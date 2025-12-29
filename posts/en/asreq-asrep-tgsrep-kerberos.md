---
id: "asreq-asrep-tgsrep-kerberos"
title: "AS-REQroasting, AS-REProasting and TGS-REProasting (Kerberoasting) - Kerberos"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-12-19
updatedDate: 2022-12-19
image: "https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-0.webp"
description: "Learn to exploit the three phases of the Kerberos protocol through AS-REQroasting, AS-REProasting and Kerberoasting to obtain credentials in Active Directory environments."
categories:
  - "active-directory"
draft: false
featured: false
lang: "en"
---

In this blog we have already talked about Kerberos, and, if you at least have a vague idea of how it works, you will know that in certain steps of an authentication of this protocol, certain information travels encrypted with the hash of the user's password.

What happens with this? If we are able to intercept one of these communications where something encrypted with the user's password hash travels, we can try to crack this information, so that, if we manage to decrypt it, we will have found out the user's password.

The steps of an authentication of this protocol that include information encrypted with the hash of a user's password are:
- AS-REQ (1st step)
- AS-REP (2nd step)
- TGS-REP (4th step)

We are going to see each step and how we can exploit each one of them. If you want to read and know how Kerberos works before continuing with this post, check out the following article:

- [Humble Attempt to Explain Kerberos](https://blog.deephacking.tech/en/posts/how-the-kerberos-protocol-works/)

## AS-REQroasting

In the Kerberos authentication process in the step called AS-REQ, the user sends the following information over the network:

![AS-REQ Process in Kerberos](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-1.avif)

The user sends a timestamp encrypted with the hash of their password. So, if we intercept this packet, we can try to crack it so that, if we manage to decrypt it, it will be because we have found out the password.

You may ask yourself how we intercept this packet, and the answer is simple, by sniffing the network.

Being connected to the same network as an Active Directory, we as an attacker in a completely passive way can listen to collect all the packets that move on the network, with the idea that one of them is an AS-REQ.

There are multiple tools that allow us to sniff the network with the objective of capturing credentials and authentications, or in turn, pass it as input a PCAP file that we have (since many times, especially when we are not physically doing the audit, we will have to use another machine to sniff the traffic, and in these cases we will generate a PCAP and bring it to our machine):

- [PCredz](https://github.com/lgandx/PCredz)
    - `apt install python3-pip && sudo apt-get install libpcap-dev && pip3 install Cython && pip3 install python-libpcap`
    - In case it gives an error that libpcap is not installed, we can use the Docker version:
        - [PCredz Docker](https://github.com/snovvcrash/PCredz)
            - `alias pcredz='sudo docker run --rm -it --network host -v ~/.pcredz:/home/<USER>/.pcredz snovvcrash/pcredz'`
- [Net Creds](https://github.com/DanMcInerney/net-creds)
- [Credslayer](https://github.com/ShellCode33/CredSLayer)

I consider PCredz to be the most complete, or, at least, the most updated. However, it is true that it is the one that can give the most problems in installation and execution. In any case, it is important to know alternatives to these tools like the ones I mention above.

When it comes to capturing AS-REQ requests, it is true that I have had problems and in my local Active Directory I have not been able to detect them with these tools. Anyway, this does not mean it cannot be done. The most manual way to do it is using Wireshark itself to be able to see all the packets in RAW:

![Packet Capture in Wireshark](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-2.avif)

The fields of an AS-REQ packet necessary to generate the string that we will later pass to John or Hashcat are:

- Username
- Domain - Example: DEEPHACKING.LOCAL (Important, DEEPHACKING alone would not work, you need the full domain)
- Cipher

With Wireshark we can find all this data easily by analyzing each packet:

<figure>

![Kerberos Field Reference in Wireshark](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-3.avif)

<figcaption>

[Wireshark Documentation on Kerberos](https://www.wireshark.org/docs/dfref/k/kerberos.html)

</figcaption>

</figure>

With this data, we form a string with the following structure:

- `$krb5pa$18$<username>$<domain>$<cipher>`

So, in this case it would look like this:

- `$krb5pa$18$rosa.melano$DEEPHACKING.LOCAL$740eb5f92bf6d5dfa18fd860ceae7d99ce1e3f7fb7a7d2f8a0c776c316f80aefc4fe91155d8b67352e7923b8e78bc1d6bc6da2a30f901214`

The manual way through Wireshark that we just saw is easily automatable in bash using tshark:

```bash
#!/bin/bash

# We use tshark to filter AS-REQ packets and display the CNameString, realm and cipher fields

filter=$(tshark -r $1 -Y "kerberos.msg_type == 10 && kerberos.cipher && kerberos.realm && kerberos.CNameString" -T fields -e kerberos.CNameString -e kerberos.realm -e kerberos.cipher -E separator=$ )

for i in $(echo $filter | tr ' ' '\n') ; do

    echo "\$krb5pa\$18\$$i"

done
```

This way, if we pass this script a PCAP file, it will parse looking for AS-REQ packets, and will return it in hashcat format:

![Script Output with Hash in Hashcat Format](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-4.avif)

With this, we proceed to pass it to hashcat with the following command:

- `hashcat -m 19900 <file with hash/es> <dictionary>`
    - It never hurts to confirm the hash format we have using the [hashcat example hashes list](https://hashcat.net/wiki/doku.php?id=example_hashes).

![Hashcat Cracking Passwords](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-5.avif)

And done. We obtain the passwords which the user has used to try to authenticate. Since AS-REQ is the first step of Kerberos, we may detect correct or incorrect passwords, as is the case above, where we detect multiple passwords for the same user. With Wireshark itself, based on the AS-REP, we can determine which one is correct.

And basically this is AS-REQroasting, sniffing this type of packets on the network with the purpose of later attempting their offline cracking.

## AS-REProasting

We have already seen a step where data is sent encrypted using the hash of the user's password, but it is not the only one. Precisely the response to the AS-REQ request, that is, the AS-REP, also contains encrypted data in the mentioned way:

![AS-REP Process in Kerberos](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-6.avif)

The KDC sends the session key encrypted with the hash of the user's password so that the user, when receiving the message, can read the session key.

AS-REProasting is a bit different from AS-REQroasting, because in the latter, we completely depend on sniffing to obtain a packet of this type. However, AS-REProasting can be "forced" if certain conditions are met.

One of these conditions is that a domain user has the DONT\_REQ\_PREAUTH attribute enabled:

![DONT_REQ_PREAUTH Attribute Enabled](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-7.avif)

This attribute makes the first step of a Kerberos authentication unnecessary, that is, anyone can generate an AS-REP response for the user who has this attribute enabled. This means that anyone can obtain data encrypted with the hash of the user's password.

For example, we are going to simulate the scenario in which we have a domain user. We as such, do not know if any domain user has the DONT\_REQ\_PREAUTH attribute enabled, it is something we have to check, so, first of all, using the credentials of the domain account we already have, we enumerate all domain users:

- `impacket-GetADUsers -all <domain>/<user>:<password> -dc-ip <dc ip>`

![Domain User Enumeration with impacket-GetADUsers](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-8.avif)

From the command output, we create a file with the domain users:

![File with Domain User List](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-9.avif)

And now, having a list of all domain users, if we are lucky, some may have the DONT\_REQ\_PREAUTH attribute enabled. We will check it as follows:

- `impacket-GetNPUsers <domain>/ -usersfile <file with user list> -no-pass -format john -dc-ip <dc ip>`

![Detection of Users with DONT_REQ_PREAUTH via GetNPUsers](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-10.avif)

> If we notice, this way, we don't really need to have a domain account, before we simply used the account we have to get the user list. But if we didn't have any account, we could create a list of possible users and do the same. In any case, GetNPUsers can also be launched using credentials instead of a user list:
> 
> - `GetNPUsers.py <domain>/<user>:<password> -request -format <john or hashcat format> -outputfile <output file>`

In this case, both the Administrator user and the lola.mento user have it enabled, so we obtain encrypted data that we can try to crack offline to obtain the passwords of the users in question.

> By adding the `-format hashcat` parameter, we can tell it to show it in hashcat format instead of john. Also, we can specify the `-outputfile cipherdata.txt` parameter to have it directly export the data to a file.

Having this data, we can try to crack it, either with john or hashcat:

![Hash Cracking with John the Ripper](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-11.avif)

This way, we manage to obtain the users' passwords.

> The command to crack with hashcat would be:
> 
> - `.\hashcat.exe -O -m 18200 -a 0 <file> <dictionary>`

All this process that we have done can also be done from Windows.

Let's put ourselves in the situation where we are connected via VPN to the network where the Active Directory is located (if we were connected physically, of course it would also work). We are with our corporate Windows computer, in which the VPN runs, and inside Windows, there is our Kali with NAT for example, this last part is a bit indifferent, but it is to detail a quite common situation, if not the most common.

Well, with all this, from your Windows, even if it does not belong to the Active Directory you are going to audit, you can open a console in the context of the target Active Directory using RunAs:

- `runas /netonly /user:<domain FQDN>\<user> cmd.exe`

![RunAs Execution to Open Console in Domain Context](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-12.avif)

> Important, this command opens the console regardless of whether the password you have entered is correct or not, that is, when you enter the password it does not verify, so that in case it is correct it opens the console, and otherwise it does not.
> 
> So you have to be very careful, and make sure 100% that you have entered the password correctly, otherwise, nothing will work, and you can even lock the domain user if you run some tool and it makes multiple requests with an incorrect password.
> 
> To verify that the password has been entered correctly, you can run the following command in the opened console:
> 
> - `net view \\<domain>\`

> Another issue is that in the situation we have proposed, being connected via VPN, the DNS will automatically be configured for the DC. In case it was not like this, we will have to configure the DC's IP as DNS on our computer.

Now, using the console we have in the context of the Active Directory user, we can use whatever tool we want to perform AS-REProasting. In this case, I will use [Rubeus](https://github.com/GhostPack/Rubeus):

- `Rubeus.exe asreproast`

![AS-REProasting with Rubeus from Windows](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-13.avif)

> Rubeus supports specifying the hash format for later cracking with the following arguments:
> 
> - `/format:hashcat`
> - `/format:john`

And done! We just did an AS-REProasting from a Windows that does NOT belong to the domain, using a console in the context of a foreign domain user. This use of RunAs is very useful, as it will make any Windows tool work to audit the target domain.

Another tool to perform AS-REProasting on Windows is:

- [ASREPRoast.ps1](https://github.com/HarmJ0y/ASREPRoast/blob/master/ASREPRoast.ps1)

Additionally, from Windows, we can enumerate users that have DONT\_REQ\_PREAUTH in the following ways:

- Using [PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1)
    - `Get-DomainUser -PreauthNotRequired -Properties SamAccountName`
- Using Microsoft's [ActiveDirectory](https://learn.microsoft.com/en-us/powershell/module/activedirectory/) module
    - `Get-ADUser -Filter {DoesNotRequirePreAuth -eq $True} -Properties DoesNotRequirePreAuth`

From Linux, in addition to the way we have seen, we could also do it using other tools:

- [ldapdomaindump](https://github.com/dirkjanm/ldapdomaindump)
- [ldapper](https://github.com/shellster/LDAPPER)
- [CrackMapExec Module](https://wiki.porchetta.industries/ldap-protocol/asreproast)

The second condition by which it is possible to force an AS-REProasting is through [ACLs](https://learn.microsoft.com/es-es/windows/win32/secauthz/access-control-lists) (Access Control List). If we have WriteProperty, GenericWrite or GenericAll privileges over a domain user, we can force enable the DONT\_REQ\_PREAUTH on them.

> Although, if you have GenericAll on a user, you can change their password xD
> 
> - [Abusing Active Directory ACLs/ACEs](https://www.ired.team/offensive-security-experiments/active-directory-kerberos-abuse/abusing-active-directory-acls-aces)

To do this, we would follow the following process:

1. We would enumerate the ACLs of a group we belong to in order to see if we have any interesting permission over any object, we can do this using [PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1):
    - `Find-InterestingDomainAcl -ResolveGUIDs | ?{$_.IdentityReferenceName -match "<group name>"}`
2. Once we already know that we have any of the mentioned permissions over a user, we would enable the DONT\_REQ\_PREAUTH with the following command also from PowerView:
    - `Set-DomainObject -Identity <username> -XOR @{useraccountcontrol=4194304} –Verbose`

This way, if we were to enumerate the users with the enabled feature again, the user we just forced would appear and it would be a matter of cracking the hash to obtain their password.

So, in conclusion, AS-REProasting has three aspects:

- One is that we are sniffing the network and manage to catch AS-REP packets. We have already seen tools that can serve us to catch this type of requests.
- That a domain user has the DONT\_REQ\_PREAUTH attribute, and, therefore, we can generate an AS-REP.
- That we have permissions over a domain user and that we ourselves generate the vulnerability.

In any of the three situations, once we have an AS-REP packet, it is time to crack, as we have done at the beginning.

## TGS-REProasting (Kerberoasting)

Finally, the famous Kerberoasting. This attack originates in the KRB\_TGS\_REP, this step also contains encrypted data that is interesting to try to crack and obtain the password of a domain user:

![TGS-REP Process in Kerberos](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-14.avif)

In this step, the KDC sends:

- The TGS (aka. Service Ticket (ST)) encrypted with the hash of the password of the user running the service
- A new session key for communications

And all this, encrypted with the first session key, the one received in the KRB\_AS\_REP.

Well, knowing this, we must know that any domain user can ask the DC for a TGS for any service, whether or not that user in question can access will depend on the service itself and it is not the DC's job to validate it. The only job of the DC is to provide the PAC (security information related to the user) when they are asked for a TGS.

So, in order to request a TGS, all that is needed is to specify the SPN (Service Principal Name). The SPN is the way to identify a service in an Active Directory environment, and it is structured as:

- `<service class>/<hostname or FQDN of the machine>`

> In an Active Directory the same service can be executed multiple times, in the same way, the same machine can execute multiple services. That is why, to specify which service we always want to refer to, the mentioned structure must be followed.

A "service class" is a generic name for a service. For example, all web servers are grouped under the service class with the name "www".

- [List of SPNs in Microsoft's official documentation (not all of them)](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc772815(v=ws.10)#service-principal-names)

In case a service runs on a different port than the original, the following structure to refer to it is valid:

- `<service class>/<hostname or FQDN of the machine>:<port>`

As a note, it is also possible to name an SPN with a custom name:

- `<service class>/<hostname or FQDN of the machine>:<port>/<name we want to assign>`

Example of an SPN following this last structure:

- `cifs/fileserver.deephacking.local:9090/Server_donde_tengo_mis_cositas`

All this is not necessarily known for the practical part we are going to carry out. However, it is important to know these details to better understand how an Active Directory works and is structured. That said, let's go back to Kerberoasting.

Normally, a service will be executed with a machine account. Machine accounts have random and strong passwords by default, so if we got data encrypted with this password and tried to crack it, it would not be useful because we would not get anything.

The thing is, it can happen that a service is being executed by a normal domain user account, being a normal user, their password may not be strong, so the chances of cracking it increase a lot. These cases are the ones that really matter and the source that gives meaning to Kerberoasting existing.

So, technically, we can get a TGS for all SPNs, but, we are only interested in SPNs of services that are being executed by domain user accounts, because their passwords may be weak.

Well, we already know all the theoretical part of Kerberoasting, so let's go to the practical part.

To enumerate from Linux the SPNs that run on normal user accounts, we can use impacket:

- `impacket-GetUserSPNs <domain fqdn>/<user>:<password> -dc-ip <dc ip>`

![SPN Enumeration with impacket-GetUserSPNs](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-15.avif)

In this case, with the above command we will be enumerating the SPNs of normal users, but we will not be requesting the respective TGS, to request them we have to add the `-request` argument:

- `impacket-GetUserSPNs -request <domain fqdn>/<user>:<password> -dc-ip <dc ip>`

![TGS Retrieval with impacket-GetUserSPNs](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-16.avif)

Once we have the hash to crack, we pass it for example to hashcat:

- `.\hashcat.exe -O -m 13100 -a 0 <file> <dictionary>`

![TGS Hash Cracking with Hashcat](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-17.avif)

This way, we get the user's password.

And, just like with AS-REProasting, the same can be done from Windows, we open a cmd in the context of the domain user as we did before and use Rubeus again (or any other tool that does Kerberoasting):

- `Rubeus.exe kerberoast`
    - Other possible arguments to add to this command:
        - `/user:<SPN>` specify the SPN from which we want to obtain a TGS (so it doesn't do it with all of them).
        - `/outfile:<filename>` specify file where the command output will be saved.
        - `/format:<hash format>` What we have seen in AS-REP, the format for later cracking

![Kerberoasting with Rubeus from Windows](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-18.avif)

Another alternative to Rubeus to perform this process would be [Invoke-Kerberoast.ps1](https://raw.githubusercontent.com/EmpireProject/Empire/master/data/module_source/credentials/Invoke-Kerberoast.ps1).

To enumerate Kerberoastable accounts from Windows, we can use any of the following tools:

- PowerView
    - `Get-DomainUser –SPN`
    - `Get-NetUser | Where-Object {$_.servicePrincipalName} | fl`
- Active Directory Module
    - `Get-ADUser -Filter {ServicePrincipalName -ne "$null"} -Properties ServicePrincipalName`
- Using a native Windows binary
    - `setspn -T <domain> -Q */*`

With this last command it is possible that filtering must be done, more information here:

- [Setspn](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc731241\(v=ws.11\))

Apart from everything seen, it is important to know that a TGS can also be obtained by dumping it from memory, the following article from [Netwrix](https://blog.netwrix.com/) explains this specific case quite well:

- [Extracting Service Account Passwords with Kerberoasting](https://blog.netwrix.com/2022/08/31/extracting-service-account-passwords-with-kerberoasting/)

Also, just like with AS-REP, if we have WriteProperty, GenericWrite or GenericAll privileges over a domain user, we can add an SPN to that user to make them vulnerable to Kerberoasting. The following source explains it quite well:

- [Targeted Kerberoasting](https://github.com/Hackndo/The-Hacker-Recipes/blob/master/active-directory-domain-services/movement/abusing-aces/targeted-kerberoasting.md)
    - About having privileges, remember that it can happen that we directly do not have them, but that a group we belong to does have them (or a group that the group we belong to belongs to... xD), so it is also important to enumerate the ACLs of the users we have. Let's remember that this last part can be done using [PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1):
        - `Find-InterestingDomainAcl -ResolveGUIDs | ?{$_.IdentityReferenceName -match "<group name>"}`

To conclude with Kerberoasting, it is important to highlight that if we manage to crack any account, we will not only have obtained another domain account, and, therefore, we will have to perform all the checks that are always done when a new account is obtained: see if it is local admin on any machine, what privileges it has, etc, etc...

What is truly interesting, is that we have cracked the account of a user who owns a service.

What does this mean?

You can look at a reminder of the KRB\_TGS\_REP step in [Humble Attempt to Explain Kerberos](https://blog.deephacking.tech/en/posts/how-the-kerberos-protocol-works/#krb_tgs_rep). But basically, we have the password that is used to encrypt the TGS (Service Ticket (ST)) that are always sent to grant a user access to the service in question. Therefore, we have the necessary key to impersonate any user in that service because we can create Service Tickets (ST/TGS). This is basically what is done when performing a [Silver Ticket](https://www.ired.team/offensive-security-experiments/active-directory-kerberos-abuse/kerberos-silver-tickets).

In a practical way, if for example, through Kerberoasting we manage to crack the password of a user running an email server, we will be able to generate TGS for any existing user in that service, in order to, in this specific case, read their emails.

> With Kerberoasting, let's also not forget the importance of doing sniffing

## Conclusion

Putting together everything we have seen in this article, a possible exploitation path to take advantage of everything seen would be:

1. Obtain a domain account through AS-REQ or AS-REP.
2. Enumeration and obtaining service tickets through TGS-REP using the obtained domain account.
3. If we manage to crack any obtained ST, we will be able to access the service whose user password running it we have cracked, impersonating the different users and accessing all available information.

Finally, emphasize the importance of doing sniffing on a network or checking ACLs, these two things can determine whether or not we manage to compromise the domain.

## References

- [Getting Passwords From Kerberos Pre-Authentication Packets](https://vbscrub.com/2020/02/27/getting-passwords-from-kerberos-pre-authentication-packets/)
- [Service Principal Name (SPN)](https://en.hackndo.com/service-principal-name-spn/)
- _[Spanish You Do (Not) Understand Kerberos](https://www.youtube.com/watch?v=5uhk2PKkDdw)_
- [ASREQRoast - From MITM to hash](https://dumpco.re/blog/asreqroast)
