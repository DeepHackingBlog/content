---
id: "unconstrained-delegation"
title: "Unconstrained Delegation - Kerberos"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2023-02-13
updatedDate: 2023-02-13
image: "https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-0.webp"
description: "Complete guide on Unconstrained Delegation in Kerberos and Active Directory, including how it works, enumeration, and exploitation techniques to compromise the domain."
categories:
  - "active-directory"
draft: false
featured: false
lang: "en"
---

Unconstrained Delegation is an existing feature in Active Directory environments that allows, so to speak, "blindly trusting" a domain computer (or user, although the latter is not the most common). When we talk about "trusting," I'm referring to, for example, allowing that computer or user to carry out actions on my behalf.

> If you haven't read it, I recommend that before continuing you read [Humble Attempt to Explain Kerberos](/en/posts/humilde-intento-de-explicar-kerberos/)

In Kerberos, the way to be able to say "I am me" is through a TGT, this is how we prove who we are in this type of environment. Therefore, for a computer or user to be able to perform actions on my behalf, they will need my TGT. And this is somewhat the basic idea of delegation.

In conclusion, and in very brief terms, the idea is that I provide my TGT to the computer that has Unconstrained Delegation enabled, so that it can perform actions on my behalf. The problem with this is that if I have access to a computer which has this feature enabled, I can look in memory if there are TGT tickets from users other than mine, which would allow me to perform lateral movements or escalate privileges in the active directory.

Let's see everything that has been discussed in more detail and step by step.

Let's imagine the situation where I authenticate with my domain user to an SMB resource on another computer, what would happen is simple, a Kerberos authentication process would begin step by step. However, in one of these steps, specifically in KRB_TGS_REP, the authentication behavior will change depending on whether the computer where the service we are trying to authenticate to is located has Unconstrained Delegation enabled or not.

- If the computer does NOT have Unconstrained Delegation, the KDC's response in KRB_TGS_REP will be as follows:

![KRB_TGS_REP response without Unconstrained Delegation](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-1.avif)

A normal and "typical" response. However:

- If the computer has Unconstrained Delegation enabled, the response will be like this:

![KRB_TGS_REP response with Unconstrained Delegation](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-2.avif)

The KDC will include, within the TGS, the user's TGT.

> Remember that the TGS is encrypted with the password hash of the user running the service. So they will be the only one who can decrypt the TGS to obtain the TGT.

Continuing with the Kerberos authentication process, we already know that what comes now is KRB_AP_REQ, the step where the client (us) sends the TGS to the service so that it can finally decide whether to authorize us or not:

![KRB_AP_REQ process with Unconstrained Delegation](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-3.avif)

The client will send the TGS and when the service receives it, it will be able to decrypt it and among other things, obtain the TGT, which will remain in memory so that it can be used by the service (or an attacker...).

> When Unconstrained Delegation is enabled, what is being enabled is the [TRUSTED_FOR_DELEGATION](https://learn.microsoft.com/en-us/troubleshoot/windows-server/identity/useraccountcontrol-manipulate-account-properties) flag on the service account.

For example, if we enable Unconstrained Delegation on the following computer:

![Enabling Unconstrained Delegation on computer](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-4.avif)

When enumerating [UserAccountControl](https://learn.microsoft.com/en-us/troubleshoot/windows-server/identity/useraccountcontrol-manipulate-account-properties), we will be able to see the TRUSTED_FOR_DELEGATION flag enabled:

<figure>

![TRUSTED_FOR_DELEGATION flag in Get-DomainComputer](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-5.avif)

<figcaption>

Get-DomainComputer

</figcaption>

</figure>

So if this flag is not found in the account running the service, the KDC will never include the TGT when we try to authenticate to that service. The KDC will also not include the TGT if the user running the delegation service belongs to the Protected Users group, or has the NOT_DELEGATED flag, the delegation will not work even if you have the TRUSTED_FOR_DELEGATION flag.

In conclusion, the complete process is:

1. A user Y requests a TGS for a service X that runs under user X (either a computer account or a normal user account).
2. The KDC checks if the TRUSTED_FOR_DELEGATION flag is enabled on user X and if they belong to the Protected Users group or have the NOT_DELEGATED flag.
3. If they only have TRUSTED_FOR_DELEGATION, the KDC will include a TGT from user Y within the TGS for service X.
4. Finally, service X will receive the TGS and obtain the TGT from user Y.
5. From here, since service X already has the user's TGT, each time it wants to authenticate to a service on behalf of user Y, it will perform the corresponding KRB_TGS_REQ and KRB_TGS_REP steps to obtain a TGS for the service in question where it wants to authenticate

The following image from [adsecurity.org](https://adsecurity.org/?p=1667) illustrates this complete process very well:

<figure>

![Kerberos Unconstrained Delegation communication flow diagram](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-6.avif)

<figcaption>

Kerberos Unconstrained Delegation Communication Flow

</figcaption>

</figure>

Knowing how the entire process works and what Unconstrained Delegation is about, let's see it in a practical way.

Let's put ourselves in a situation, we have just entered the corporate network and we have a domain user, so we proceed to enumerate the active directory, specifically, we want to check if there is any computer or user that has Unconstrained Delegation enabled, in other words, the TRUSTED_FOR_DELEGATION flag.

We can enumerate this information in different ways:

- [PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1)

```powershell
Get-DomainComputer -UnConstrained
```

![Enumeration with PowerView Get-DomainComputer](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-7.avif)

![Enumeration result with PowerView](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-8.avif)

- [ActiveDirectory Module](https://learn.microsoft.com/en-us/powershell/module/activedirectory/?view=windowsserver2022-ps)

```powershell
Get-ADComputer -Filter {TrustedForDelegation -eq $True}
```

![Enumeration with Get-ADComputer](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-9.avif)

```powershell
Get-ADComputer -Filter {TrustedForDelegation -eq $true -and primarygroupid -eq 515} -Properties trustedfordelegation,serviceprincipalname,description
```

![Detailed enumeration with Get-ADComputer](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-10.avif)

```powershell
Get-ADUser -Filter {TrustedForDelegation -eq $True}
```

Enumerate if any normal user has the TrustedForDelegation flag.

![User enumeration with Get-ADUser](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-11.avif)

In this case there is no "normal" user that has the flag enabled.

At this point, we have already enumerated the active directory and we have seen that there is a machine that has Unconstrained Delegation enabled. Therefore, let's imagine that in one way or another, we manage to compromise this machine.

The idea now would be to observe if there are TGTs stored in memory, for this we can use Mimikatz or Rubeus.

For example, let's try first with Mimikatz:

```powershell
Invoke-Mimikatz –Command '"sekurlsa::tickets /export"'
```

![Ticket export with Mimikatz](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-12.avif)

Once the tickets are exported, we can view them in the current directory:

![Exported tickets in directory](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-13.avif)

In this case, if we look closely, all tickets belong to the user we already have from having compromised this machine, so there is no relevant TGT. However, if I now force an authentication of the Domain Administrator on this computer, for example using PSSession:

![Force authentication with PSSession](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-14.avif)

![Exported tickets after authentication](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-15.avif)

![Administrator ticket details](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-16.avif)

When dumping the tickets again, this time we can observe how there are some belonging to the Administrator user and the krbtgt service. If it belongs to the krbtgt service it means it is a TGT ticket. Additionally, in the Mimikatz output we can view the details in a more organized way, in order to confirm that it is a TGT ticket from the Administrator user.

This same procedure can be carried out with Rubeus:

```powershell
.\Rubeus.exe monitor /interval:5 /nowrap
```

![Ticket monitoring with Rubeus](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-17.avif)

With Rubeus we can specify how often we want to monitor if there are tickets in memory using the /interval argument, in this case, every 5 seconds. When executing this, Rubeus will show us both the tickets that are already in memory, as well as the new ones that arrive.

To avoid noise, you can specify that only tickets from the specific user you specify are shown, for example, Administrator:

![Specific monitoring of Administrator user](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-18.avif)

In this way, it will wait for any TGT from this user to arrive. If we now force an authentication of the Administrator user:

![Force Administrator authentication](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-19.avif)

Rubeus will detect the TGT and display it on screen in base64:

![TGT detected by Rubeus in base64](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-20.avif)

With these two tools seen, we can dump and view the tickets that may be in a computer's memory.

Now, what would be done now?

At this point and having TGTs, we would proceed to perform Pass The Ticket. We will see this in another post, however, here is an example for the TGT collected with Rubeus:

Convert the ticket with [ticketConverter.py from Impacket](https://raw.githubusercontent.com/SecureAuthCorp/impacket/master/examples/ticketConverter.py)

<figure>

![Using Pass The Ticket with CrackMapExec](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-21.avif)

<figcaption>

Important to specify the FQDN in CrackMapExec, the IP would not work

</figcaption>

</figure>

In this way, the DC is compromised, and with it, the active directory. It will not always be as simple as obtaining a TGT from a domain administrator directly, sometimes we will obtain TGTs from other domain users that will allow us to perform lateral movements on the network.

Finally, if you haven't noticed yet, Unconstrained Delegation can be combined very well with [Coerce attacks](https://www.thehacker.recipes/ad/movement/mitm-and-coerced-authentications).

## References

- [Unconstrained Delegation - Penetration Testing Lab](https://pentestlab.blog/2022/03/21/unconstrained-delegation/)
- [Active Directory Security Risk #101: Kerberos Unconstrained Delegation (or How Compromise of a Single Server Can Compromise the Domain)](https://adsecurity.org/?p=1667)
- [Kerberos Unconstrained Delegation - Red Team Notes](https://www.ired.team/offensive-security-experiments/active-directory-kerberos-abuse/domain-compromise-via-unrestricted-kerberos-delegation)
- [Kerberos (III): How does delegation work? - Tarlogic](https://www.tarlogic.com/es/blog/kerberos-iii-como-funciona-la-delegacion/#Unconstrained_Delegation)
