---
id: "confianzas-en-active-directory"
title: "Trusts in Active Directory"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-09-10
updatedDate: 2024-09-10
image: "https://cdn.deephacking.tech/i/posts/confianzas-en-active-directory/confianzas-en-active-directory-0.webp"
description: "Complete guide on trusts in Active Directory: trust types, direction, transitivity, Trust Domain Objects (TDO) and how to enumerate trust relationships with PowerView."
categories:
  - "active-directory"
draft: false
featured: false
lang: "en"
---

In the previous article where we introduced Active Directory, we briefly mentioned trusts or the possibility of establishing them for connection between different domains or trees. This allows, for example, users from one domain or tree to access resources from other domains or trees. Basically, we could define a trust as a type of authentication/authorization connection.

These trust relationships are represented in Active Directory through **Trusted Domain Objects (TDOs)**, which are special objects that store information about the trust relationship established between domains. TDOs contain details about the type of trust, the allowed authentication level, and other security parameters that regulate how domains authenticate with each other and access shared resources.

That said, let's see how this feature works in Active Directory.

- [Trust direction](#trust-direction)
- [Trust transitivity](#trust-transitivity)
- [Trust types](#trust-types)
- [Trust key](#trust-key)
- [trustAttributes attribute of Trust Domain Objects (TDO)](#trustattributes-attribute-of-trust-domain-objects-tdo)
- [Trust enumeration](#trust-enumeration)
- [Conclusion](#conclusion)
- [References](#references)

## Trust direction

When a trust is created between two domains, there is always the trusting side and the trusted side. For example, if I create a trust from the sevenkingdoms.local domain to the essos.local domain, sevenkingdoms.local would be the trusting side in this case, and essos.local the trusted side, because sevenkingdoms is the one trusting essos.

If sevenkingdoms is the one trusting essos, it makes sense to think that essos users will be the ones who can access sevenkingdoms resources and not the other way around. Therefore, we can define the following:

> The trust direction is the opposite of the access direction.

![Trust direction diagram in Active Directory](https://cdn.deephacking.tech/i/posts/confianzas-en-active-directory/confianzas-en-active-directory-1.avif)

When a trust points to your current domain, it is called an incoming (inbound) trust. As we have seen, incoming trusts allow users from your domain to access another domain.

On the other hand, there are outgoing (outbound) trusts that point from your domain to another. In this case, the opposite occurs, users from the other domain will be able to access your domain.

However, there is no restriction preventing both types of trusts from existing at the same time. When two domains have both an incoming and outgoing trust for each one, it is called a bidirectional trust (even though there are actually 2 trusts), otherwise it is unidirectional.

## Trust transitivity

There are other details when we talk about trusts, and that is transitivity. The image from the previous section is simple, two domains with an existing trust between them. Now, let's add another variable:

![Trust transitivity diagram between domains](https://cdn.deephacking.tech/i/posts/confianzas-en-active-directory/confianzas-en-active-directory-2.avif)

What happens when there are at least 3 domains? Can the sevenkingdoms.local domain access deephacking.local somehow or vice versa if they have a trusted domain in common, as is the case with essos.local?

Well, that will depend on transitivity. A trust can be transitive or not.

- A NON-transitive trust can only be used by the two sides involved in the trust. A third domain that has a trust with one of the two sides will not be able to use this trust.
- However, a transitive trust can act as a bridge and be used by other domains that are connected to the transitive trust.

For example, in this case, sevenkingdoms trusts essos.local, therefore essos.local users can access sevenkingdoms.local.

If the trust from sevenkingdoms to essos is transitive, then deephacking.local users can access sevenkingdoms by traversing both trusts, the one we just mentioned and the existing trust between essos.local and deephacking.local.

If, on the contrary, the trust from sevenkingdoms to essos is NOT transitive, deephacking.local users will not be able to access sevenkingdoms.

## Trust types

Within trusts, there are different types with different objectives:

- **Parent-Child**: It is a transitive and bidirectional trust that is automatically created between a parent domain and its child domain when establishing a new domain structure in a tree. These trusts can only exist between two domains within the same tree with the same contiguous namespace. They cannot be created manually, and the parent domain is always trusted by the child domain.
- **Tree/Root Trust**: It is a transitive and bidirectional trust that is automatically established when a new tree is added to the Active Directory forest. This trust is created between the forest root domain and the new tree's root domain, allowing authentication and access to resources between domains from different trees within the same forest. They cannot be created manually and are fundamental for maintaining the hierarchical structure and interoperability within the forest.
- **Forest**: They allow sharing resources between trees in different forests. These trusts can be unidirectional transitive or bidirectional transitive, and they allow authentication between forests using Kerberos v5 and NTLM, with the possibility of using the Universal Principal Name (UPN) to access resources (UPN is an existing internet standard for user accounts).
- **External**: They are unidirectional and non-transitive trusts that are manually created to connect a specific domain with another domain outside the Active Directory forest, such as a Windows NT 4.0 domain. They are useful when you do not want to extend the trust to the entire forest.
- **Realm**: They allow interoperability between an Active Directory domain and a non-Windows domain, such as a Kerberos domain in Unix/Linux environments. These trusts can be transitive or non-transitive and are essential for interoperability between different operating systems.
- **Shortcut**: They are used to optimize the authentication process by shortening the trust path required between domains that do not have a direct trust relationship. These transitive trusts are manually created and can only exist within the same forest.

![Trust types diagram in Active Directory](https://cdn.deephacking.tech/i/posts/confianzas-en-active-directory/confianzas-en-active-directory-3.avif)

In the image, we can observe a graphical example of how the different types of trusts might look in an AD environment. Black lines correspond to trusts that are created automatically and red ones are created manually.

All the trust types we've seen and some of their characteristics can be summarized in the following table:

| Type | Transitive | Direction | Creation |
| --- | --- | --- | --- |
| Parent-Child | YES | Bidirectional | Automatic |
| Tree/Root | YES | Bidirectional | Automatic |
| Forest | YES | Unidirectional or bidirectional | Manual |
| External | NO | Unidirectional or bidirectional | Manual |
| Realm | YES or NO | Unidirectional or bidirectional | Manual |
| Shortcut | YES | Unidirectional or bidirectional | Manual |

## Trust key

When a trust relationship is established, there must be secure communication between the domain controllers of both domains involved in the trust (or, in the case of transitive relationships, with an intermediate domain controller).

The nature of this communication can vary depending on the protocol used, such as NTLM, Kerberos, etc. However, regardless of the protocol, domain controllers must share a common key to ensure that communications are secure. This key is known as the **trust key** and is generated at the same time the trust is established.

When creating the trust, a **Trust Account** is created in the domain database, which is treated as if it were a user account. The only difference is that its name ends with a "$" symbol. During the creation of this account, the trust key is stored in the password field of this newly created user, so it can be considered that the "password" or hash of this account is actually the trust key.

The name of this user account is formed using the NetBIOS name of the other domain, followed by a dollar sign. For example, in a bidirectional trust between the sevenkingdoms.local and essos.local domains, with NetBIOS names "sevenkingdoms" and "essos" respectively, the sevenkingdoms.local domain will create a user account called "ESSOS$", and the essos.local domain will create an account called "SEVENKINGDOMS$".

The passwords or hashes of these accounts correspond to the respective trust keys, which are used to securely authenticate and authorize communications between domains.

In summary, when a trust is created in Active Directory, two important objects are generated: a **Trust Account** and a **Trust Domain Object (TDO)** (we mentioned TDO at the beginning of the article). The trust account is only created in the domain that trusts the other, while the TDO is generated in both domains, regardless of whether the trust is unidirectional or bidirectional. This ensures that both domains have the necessary information to manage the trust relationship and maintain communication security.

## trustAttributes attribute of Trust Domain Objects (TDO)

We already know that the objects representing trusts are called TDOs. These objects, like any other in Active Directory, have a series of associated attributes. In this case, I would like to look specifically at the trustAttributes attribute and its possible values.

The trustAttributes attribute basically defines certain properties and behaviors of the trust relationship, such as transitivity, access restrictions, and compatibility with specific operating systems. These values allow administrators to configure and manage trusts precisely.

It is possible that when reading about some of these concepts they may not be familiar to you, and that's okay. The important thing is that you know about the existence of these values, so that if you encounter them, you can better understand the environment and know how to act.

##### TRUST\_ATTRIBUTE\_NON\_TRANSITIVE (TANT - 0x00000001)

This attribute indicates that the trust is not transitive, meaning it does not extend beyond the two directly involved domains. This is common in External and Realm type trusts, where you want to limit the trust to a specific connection without allowing other connections to implicitly trust through it.

##### TRUST\_ATTRIBUTE\_UPLEVEL\_ONLY (TAUO - 0x00000002)

Specifies that only clients running Windows 2000 or later can use the trust. This ensures that only more modern operating systems, which meet certain security standards, can benefit from this trust relationship.

##### TRUST\_ATTRIBUTE\_QUARANTINED\_DOMAIN (TAQD - 0x00000004)

Indicates that the trusted domain is quarantined, which implies that stricter SID (Security Identifier) filtering rules are applied. This attribute is crucial for protecting internal resources by limiting access from domains considered less secure.

##### TRUST\_ATTRIBUTE\_FOREST\_TRANSITIVE (TAFT - 0x00000008)

This attribute is fundamental for Forest type trusts, indicating that the trust is transitive and encompasses all domains within the involved forests. It allows fluid authentication and access to resources across multiple domains in different trees of the forest.

##### TRUST\_ATTRIBUTE\_CROSS\_ORGANIZATION (TACO - 0x00000010)

Indicates that the trust is with a domain or forest external to the organization, facilitating collaboration and controlled access between different entities. This attribute is especially relevant in corporate environments.

##### TRUST\_ATTRIBUTE\_WITHIN\_FOREST (TAWF - 0x00000020)

Used to indicate that the trusted domain is within the same forest, which generally entails greater trust and fewer restrictions compared to trusts with external domains.

##### TRUST\_ATTRIBUTE\_TREAT\_AS\_EXTERNAL (TATE - 0x00000040)

This attribute indicates that a cross-forest trust should be handled as if it were an external trust, specifically regarding SID (Security Identifier) filtering. This implies that additional and stricter security measures are applied to control and limit access to resources, ensuring that only authorized users and groups can access the trusted forest's resources. It is a way to increase security by treating these trusts the same way as a trust with domains external to the organization's forest.

##### TRUST\_ATTRIBUTE\_USES\_RC4\_ENCRYPTION (TARC - 0x00000080)

This attribute is used in Realm type trusts, indicating that the relationship can use RC4 encryption. It is relevant for interoperability with Kerberos implementations that support this type of encryption, ensuring adequate compatibility between different operating systems or Kerberos versions.

##### TRUST\_ATTRIBUTE\_CROSS\_ORGANIZATION\_NO\_TGT\_DELEGATION (TANC - 0x00000200)

This attribute ensures that trust tickets generated under this relationship cannot be used for delegation, which limits the use of these tickets in other parts of the network.

##### TRUST\_ATTRIBUTE\_CROSS\_ORGANIZATION\_ENABLE\_TGT\_DELEGATION (TAEC - 0x00000800)

Allows tickets issued under this trust relationship to be used for delegation, which is necessary for certain operations that require delegated authentication.

##### TRUST\_ATTRIBUTE\_PIM\_TRUST (TAPT - 0x00000400)

Associated with Privileged Identity Management, this attribute ensures that trusts are treated with stricter SID filters, providing an additional layer of security.

##### TRUST\_ATTRIBUTE\_DISABLE\_AUTH\_TARGET\_VALIDATION (TDAV - 0x00001000)

Disables domain name validation during NTLM pass-through authentication, which can be relevant in specific security configurations.

* * *

If you are interested in taking a look at other possible attributes associated with TDOs, you can check Microsoft's documentation:

- _[Essential Attributes of a Trusted Domain Object in MS-ADTS](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/c9efe39c-f5f9-43e9-9479-941c20d0e590)_

## Trust enumeration

Assuming I have explained myself well up to this point, we should already have an idea of how trusts work in Active Directory. Now I would simply like to show some ways to enumerate them, both from Windows and Linux. The environment we are going to enumerate is _[GOAD](https://github.com/Orange-Cyberdefense/GOAD)_:

![GOAD environment diagram for trust enumeration](https://cdn.deephacking.tech/i/posts/confianzas-en-active-directory/confianzas-en-active-directory-4.avif)

Let's see how trusts would be enumerated.

- _[PowerView.ps1 (PowerSploit)](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1)_

Within PowerView, we have a couple of interesting functions for enumerating trusts, Get-DomainTrust and Get-DomainTrustMapping. The difference between both functions is as follows:

- **Get-DomainTrust** provides trust relationships from the perspective of a specific domain, which by default is the current domain if no other is specified. This cmdlet only shows trusts where the specified domain is the source domain, without including how other domains perceive or trust it. As a result, only a unidirectional perspective of trust relationships from the specified domain to other domains is presented.
- **Get-DomainTrustMapping**, on the other hand, is much more comprehensive. It not only shows the perspective of the specified domain but also that of the other domains involved in the trust relationship. Additionally, it presents trust relationships from the point of view of all involved domains, allowing you to see both the trusting domains and those trusted by the specified domain.

If we run Get-DomainTrust on a computer in the sevenkingdoms.local domain, we get the following:

```powershell
PS C:\Windows\system32> Get-DomainTrust

SourceName      : sevenkingdoms.local
TargetName      : north.sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:48:45 PM
WhenChanged     : 7/11/2024 3:37:42 PM

SourceName      : sevenkingdoms.local
TargetName      : essos.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : TREAT_AS_EXTERNAL,FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:58:48 PM
WhenChanged     : 7/21/2024 10:50:58 AM

PS C:\Windows\system32>
```

If we run Get-DomainTrustMapping:

```powershell
PS C:\Windows\system32> Get-DomainTrustMapping

SourceName      : sevenkingdoms.local
TargetName      : north.sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:48:45 PM
WhenChanged     : 7/11/2024 3:37:42 PM

SourceName      : sevenkingdoms.local
TargetName      : essos.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : TREAT_AS_EXTERNAL,FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:58:48 PM
WhenChanged     : 7/21/2024 10:50:58 AM

SourceName      : essos.local
TargetName      : sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:58:47 PM
WhenChanged     : 7/21/2024 10:50:58 AM

SourceName      : north.sevenkingdoms.local
TargetName      : sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:48:45 PM
WhenChanged     : 7/11/2024 3:37:42 PM

PS C:\Windows\system32>
```

We can see that Get-DomainTrustMapping provides more information by providing all points of view and not just where the current domain is the source.

If we were to run Get-DomainTrust on the north.sevenkingdoms.local and essos.local domains, we would get the trusts of those domains, yes, but for example, in north.sevenkingdoms.local we would not see that sevenkingdoms.local has a trust with essos.local. Similarly, if we ran it on essos.local, we would not see that sevenkingdoms.local has a trust with north.sevenkingdoms.local. Here is the example of running Get-DomainTrust:

- north.sevenkingdoms.local

```powershell
PS C:\Users\robb.stark> Get-DomainTrust

SourceName      : north.sevenkingdoms.local
TargetName      : sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:48:45 PM
WhenChanged     : 7/11/2024 3:37:42 PM

PS C:\Users\robb.stark>
```

- essos.local

```powershell
PS C:\Windows\system32> Get-DomainTrust

SourceName      : essos.local
TargetName      : sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:58:47 PM
WhenChanged     : 7/21/2024 10:50:58 AM

PS C:\Windows\system32>
```

And if we now run Get-DomainTrustMapping:

- north.sevenkingdoms.local

```powershell
PS C:\Users\robb.stark> Get-DomainTrustMapping

SourceName      : north.sevenkingdoms.local
TargetName      : sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:48:45 PM
WhenChanged     : 7/11/2024 3:37:42 PM

SourceName      : sevenkingdoms.local
TargetName      : north.sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:48:45 PM
WhenChanged     : 7/11/2024 3:37:42 PM

SourceName      : sevenkingdoms.local
TargetName      : essos.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : TREAT_AS_EXTERNAL,FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:58:48 PM
WhenChanged     : 7/21/2024 10:50:58 AM

SourceName      : essos.local
TargetName      : sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:58:47 PM
WhenChanged     : 7/21/2024 10:50:58 AM

PS C:\Users\robb.stark>
```

- essos.local

```powershell
PS C:\Windows\system32> Get-DomainTrustMapping

SourceName      : essos.local
TargetName      : sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:58:47 PM
WhenChanged     : 7/21/2024 10:50:58 AM

SourceName      : sevenkingdoms.local
TargetName      : north.sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:48:45 PM
WhenChanged     : 7/11/2024 3:37:42 PM

SourceName      : sevenkingdoms.local
TargetName      : essos.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : TREAT_AS_EXTERNAL,FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:58:48 PM
WhenChanged     : 7/21/2024 10:50:58 AM

SourceName      : north.sevenkingdoms.local
TargetName      : sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:48:45 PM
WhenChanged     : 7/11/2024 3:37:42 PM

PS C:\Windows\system32>
```

We can then observe that if we run Get-DomainTrust we are "losing information". It's not really losing, we are simply requesting different information. Depending on our needs, we will use one or the other.

This same enumeration can be performed from Linux using the same functions through tools like _[PowerView.py](https://github.com/aniqfakhrul/powerview.py)_ or _[PywerView](https://github.com/the-useless-one/pywerview)_:

- PowerView.py

```bash
powerview north/robb.stark:sexywolfy@192.168.50.10 --use-ldap

Get-DomainTrust
```

![Get-DomainTrust result with PowerView.py on Linux](https://cdn.deephacking.tech/i/posts/confianzas-en-active-directory/confianzas-en-active-directory-5.avif)

- PywerView

```bash
pywerview get-netdomaintrust -w north.sevenkingdoms.local -u robb.stark -p sexywolfy --dc-ip 192.168.50.10
```

![PywerView result for trust enumeration](https://cdn.deephacking.tech/i/posts/confianzas-en-active-directory/confianzas-en-active-directory-6.avif)

All these trusts we just enumerated would look like the following from _[BloodHound](https://github.com/BloodHoundAD/BloodHound)_:

![Trust visualization in BloodHound](https://cdn.deephacking.tech/i/posts/confianzas-en-active-directory/confianzas-en-active-directory-7.avif)

## Conclusion

At this point, we have seen all the different types of trusts that can exist in an Active Directory along with the possible properties of an important TDO attribute. This way, if we encounter a trust in any domain, we can now identify its function and role.

## References

- _[Trusts - Attacking Active Directory: 0 to 0.9 - Eloy Pérez González](https://zer1t0.gitlab.io/posts/attacking_ad/#trusts)_
- _[Active Directory Domain Trust and Forest Enumeration Part-3 With PowerView](https://nored0x.github.io/red-teaming/active-directory-Trust-enumeration/)_
- _[Active Directory Spotlight: Trusts — Part 2. Operational Guidance](https://www.securesystems.de/blog/active-directory-spotlight-trusts-part-2-operational-guidance/)_
