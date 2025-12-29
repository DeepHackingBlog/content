---
id: "introduccion-a-active-directory"
title: "Introduction to Active Directory"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-09-02
updatedDate: 2024-09-02
image: "https://cdn.deephacking.tech/i/posts/introduccion-a-active-directory/introduccion-a-active-directory-0.webp"
description: "Learn the fundamental concepts of Active Directory, from its origins to its hierarchical structure with domains, forests, group policies, and domain controllers."
categories:
  - "active-directory"
draft: false
featured: false
lang: "en"
---

You've probably heard the term Active Directory a thousand times, or on the contrary, you may have never heard it before. In any case, the purpose of this article is to introduce the main concepts so that when you finish reading it, you have an idea of what it's about and how it works.

- [Origin and Purpose of Active Directory](#origin-and-purpose-of-active-directory)
- [Everything is an Object](#everything-is-an-object)
- [Domains](#domains)
- [Tree and Forests](#tree-and-forests)
    - [Functional Modes](#functional-modes)
- [Organizational Units (OUs)](#organizational-units-ous)
- [Containers](#containers)
- [Group Policies (GPO)](#group-policies-gpo)
- [Domain Controllers (DCs)](#domain-controllers-dcs)
    - [LDAP and Kerberos](#ldap-and-kerberos)
- [Conclusion](#conclusion)
- [References](#references)

## Origin and Purpose of Active Directory

Active Directory had its beginnings in the early 1990s, in a context where Microsoft was under investigation for monopolistic practices in the personal computer operating system market. To diversify its focus and reduce its dependence on end consumers, Microsoft decided to expand into the enterprise market. With a strong presence already established thanks to Windows and Office, the company sought to create a solution that would facilitate the management of data and resources in large organizations. Thus, Active Directory was born, a tool designed to integrate with Windows Server, presenting a hierarchical and scalable structure.

The first step of Active Directory came with the launch of Windows 2000 Server. Before this, user configuration in corporate networks was stored in a SAM database on the network's domain controller (central server), using the Netlogon protocol for user authentication. However, the growing complexity of corporate networks revealed a series of limitations of the SAM format when it came to scalability, this led to a transition towards Active Directory with Windows 2000, which also introduced the [Kerberos authentication protocol](https://blog.deephacking.tech/en/posts/how-the-kerberos-protocol-works/).

Active Directory offers significant advantages over the old SAM database, being more extensible and allowing additional data to be stored in user configuration, such as the security level, which can be used by applications to manage access to resources. All this data is stored locally on a domain controller and is accessible through the LDAP protocol, which operates over TCP/IP on port 389.

In summary, after all this rambling, it can be said that Active Directory has evolved to become what it is today, an essential tool for almost all IT companies in the world.

Now that we know what Active Directory is, it's time to look at some of its main features to understand how it works and is structured.

## Everything is an Object

If you've never encountered the idea of "object," it may seem a bit abstract at first, but basically an object in Active Directory is an entity that represents a network resource. A resource can be a user, a computer, a group, an organizational unit, a printer, a shared resource... in conclusion, everything.

Well, Active Directory is based on objects to function.

Each object is defined by a set of information about it, this information is found in what are the object's attributes. For example, my user robb.stark is an object and therefore, has information and attributes associated with it:

```powershell
PS C:\Users\robb.stark> Get-ADUser -Identity robb.stark

DistinguishedName : CN=robb.stark,CN=Users,DC=north,DC=sevenkingdoms,DC=local
Enabled           : True
GivenName         : Robb
Name              : robb.stark
ObjectClass       : user
ObjectGUID        : 73fde0a4-2653-4296-9a6a-fc1e51b399c3
SamAccountName    : robb.stark
SID               : S-1-5-21-2645935458-595591891-1233751793-1113
Surname           : Stark
UserPrincipalName :

PS C:\Users\robb.stark>
```

In this case, for example, we see that it has the Name attribute, the Surname attribute, and a few more. Well, this concept applies to everything existing in Active Directory, even the domain itself is an object:

```powershell
PS C:\Users\robb.stark> Get-ADDomain

AllowedDNSSuffixes                 : {}
ChildDomains                       : {}
ComputersContainer                 : CN=Computers,DC=north,DC=sevenkingdoms,DC=local
DeletedObjectsContainer            : CN=Deleted Objects,DC=north,DC=sevenkingdoms,DC=local
DistinguishedName                  : DC=north,DC=sevenkingdoms,DC=local
DNSRoot                            : north.sevenkingdoms.local
DomainControllersContainer         : OU=Domain Controllers,DC=north,DC=sevenkingdoms,DC=local
DomainMode                         : Windows2016Domain
DomainSID                          : S-1-5-21-2645935458-595591891-1233751793
ForeignSecurityPrincipalsContainer : CN=ForeignSecurityPrincipals,DC=north,DC=sevenkingdoms,DC=local
Forest                             : sevenkingdoms.local
InfrastructureMaster               : winterfell.north.sevenkingdoms.local
LastLogonReplicationInterval       :
LinkedGroupPolicyObjects           : {cn={DE1A9268-D2BC-4111-B051-9F00ECE62D3A},cn=policies,cn=system,DC=north,DC=seven
                                     kingdoms,DC=local, CN={31B2F340-016D-11D2-945F-00C04FB984F9},CN=Policies,CN=System
                                     ,DC=north,DC=sevenkingdoms,DC=local}
LostAndFoundContainer              : CN=LostAndFound,DC=north,DC=sevenkingdoms,DC=local
ManagedBy                          :
Name                               : north
NetBIOSName                        : NORTH
ObjectClass                        : domainDNS
ObjectGUID                         : b66af891-4581-4188-b6e3-b19d5506939b
ParentDomain                       : sevenkingdoms.local
PDCEmulator                        : winterfell.north.sevenkingdoms.local
PublicKeyRequiredPasswordRolling   : True
QuotasContainer                    : CN=NTDS Quotas,DC=north,DC=sevenkingdoms,DC=local
ReadOnlyReplicaDirectoryServers    : {}
ReplicaDirectoryServers            : {winterfell.north.sevenkingdoms.local}
RIDMaster                          : winterfell.north.sevenkingdoms.local
SubordinateReferences              : {DC=DomainDnsZones,DC=north,DC=sevenkingdoms,DC=local}
SystemsContainer                   : CN=System,DC=north,DC=sevenkingdoms,DC=local
UsersContainer                     : CN=Users,DC=north,DC=sevenkingdoms,DC=local

PS C:\Users\robb.stark>
```

In this case, the domain has many more associated attributes and different from those a user object has.

Something that all objects have in common is that they possess a GUID (Global Unique Identifier). A GUID is a unique and globally recognizable identifier that ensures that each object can be uniquely identified within the Active Directory structure, regardless of its location or type.

In addition to the GUID, all objects also share other fundamental attributes, such as the Distinguished Name (DN) and the Security Identifier (SID). The DN provides a hierarchical path that shows the exact location of the object within the Active Directory tree, including the domain and organizational units to which it belongs. The SID, for its part, is a unique identifier that is used primarily for security and access control, allowing Active Directory and other security systems to associate specific permissions and rights with each object.

For example, the DN and SID of my user robb.stark from the child domain north of the domain sevenkingdoms.local would be the following:

```powershell
PS C:\Users\robb.stark> Get-ADUser -Identity robb.stark

DistinguishedName : CN=robb.stark,CN=Users,DC=north,DC=sevenkingdoms,DC=local
Enabled           : True
GivenName         : Robb
Name              : robb.stark
ObjectClass       : user
ObjectGUID        : 73fde0a4-2653-4296-9a6a-fc1e51b399c3
SamAccountName    : robb.stark
SID               : S-1-5-21-2645935458-595591891-1233751793-1113
Surname           : Stark
UserPrincipalName :

PS C:\Users\robb.stark>
```

## Domains

Within the concept of Active Directory, a domain is a series of connected computers that share an Active Directory database which is managed by what is known as a domain controller (DC), which is basically the central server from which all configuration is managed. And in case you're wondering:

- Yes, within an Active Directory environment there can be multiple domain controllers.
- Yes, within Active Directory there can be multiple domains.

Therefore, this means that there can be multiple domains which each have multiple domain controllers.

An example of what an Active Directory would look like would be the following:

![Active Directory structure diagram with domains and subdomains](https://cdn.deephacking.tech/i/posts/introduccion-a-active-directory/introduccion-a-active-directory-1.avif)

Right now you might find this diagram a bit complex to understand, but the idea is that by the end of this article you can understand it, at least the main parts.

Each domain has a DNS name, normally this name is the same as the company name, for example, if Deep Hacking were a multinational that billed 999,999,999 millions, it would probably have an internal domain that was deephacking.local. Since that's not the case, we'll use the domain from the [GOAD](https://github.com/Orange-Cyberdefense/GOAD) project:

```powershell
PS C:\> $env:USERDNSDOMAIN
SEVENKINGDOMS.LOCAL
PS C:\>
```

If we execute the above command on a computer joined to a domain, it will give us the name of the domain it's joined to, in this case sevenkingdoms.local.

In addition to the DNS name, each domain can also be identified by the NetBIOS name, for example, the DNS name sevenkingdoms.local would have a NetBIOS name of sevenkingdoms. On the other hand, the child domain north.sevenkingdoms.local would have a NetBIOS name of north.

The NetBIOS name is often used when logging in, for example, sevenkingdoms\\sikumy, where sevenkingdoms is the NetBIOS name of the domain and sikumy is the user.

Finally, a domain can be identified by a SID (Security Identifiers). As we mentioned previously, SIDs are unique identifiers that Windows uses to uniquely identify users, groups, or other objects in a domain or computer. Although normally it's not necessary to know it at the user level, it may be necessary when we're tinkering with some tool to know how to obtain the domain's SID. So for now, just keep in mind its existence:

```powershell
PS C:\> Get-ADDomain | select DNSRoot,NetBIOSName,DomainSID

DNSRoot             NetBIOSName   DomainSID
------- ----------- ---------
sevenkingdoms.local SEVENKINGDOMS S-1-5-21-2643224878-1147328777-3138214671

PS C:\>
```

## Tree and Forests

In the previous image from the domains section, we've already been able to observe that a domain can have subdomains. For example, sevenkingdoms.local would be the root domain and north.sevenkingdoms.local would be a subdomain. In a real environment, this difference can serve, for example, to separate departments within the company or sites.

```
                                          deephacking.local
                                                |
                                        .-------'--------.
                                        |                |
                                        |                |
                               it.deephacking.local marketing.deephacking.local
                                        | 
                                        |
                                        |
                          desarrollo.it.deephacking.local
```

All these domains together form what is called a tree. By logic, we can infer that a forest is a set of trees, that is, if the image above is a tree, a forest could be for example the following:

```powershell
         deephacking.local ------------------------------ sevenkingdoms.local ----------- essos.local
                 |                                                 |
                 |----------------.                                |
                 |                |                                |
                 |                |                                |                
it.deephacking.local  marketing.deephacking.local       north.sevenkingdoms.local
                 | 
                 |
                 |
   desarrollo.it.deephacking.local
```

If we execute the following command on the sevenkingdoms.local domain controller:

```powershell
PS C:\> Get-ADForest

ApplicationPartitions : {DC=DomainDnsZones,DC=sevenkingdoms,DC=local,
                        DC=DomainDnsZones,DC=north,DC=sevenkingdoms,DC=local,
                        DC=ForestDnsZones,DC=sevenkingdoms,DC=local}
CrossForestReferences : {}
DomainNamingMaster    : kingslanding.sevenkingdoms.local
Domains               : {north.sevenkingdoms.local, sevenkingdoms.local}
ForestMode            : Windows2016Forest
GlobalCatalogs        : {kingslanding.sevenkingdoms.local, winterfell.north.sevenkingdoms.local}
Name                  : sevenkingdoms.local
PartitionsContainer   : CN=Partitions,CN=Configuration,DC=sevenkingdoms,DC=local
RootDomain            : sevenkingdoms.local
SchemaMaster          : kingslanding.sevenkingdoms.local
Sites                 : {Default-First-Site-Name}
SPNSuffixes           : {}
UPNSuffixes           : {}

PS C:\>
```

We can obtain in this case information about the tree. Although the PowerShell cmdlet is named Forest, it won't actually provide you with information about other trees, if you run it on sevenkingdoms.local it will only give you information about sevenkingdoms.local, it won't mention essos.local at any time.

> In any case, the concept of tree is almost never used because it tends to be simplified and talk about domains and forests.

As I mentioned at the beginning, each domain has its own database and its own domain controllers. However, users from a domain belonging to a tree can, by default, access resources from other domains within the same tree. This implies that, although each domain can operate autonomously, from a security point of view, they are not completely isolated.

Now, it occurs differently between forests (different trees), that is, on the same network there can be different trees with different root domains, between these trees there can be a trust relationship (we'll see it in another article) that makes them a forest as a whole. The important thing is to keep in mind that when it comes to forests, by default, users from one tree CANNOT access resources from other trees.

In conclusion, domains within the same tree do not have complete isolation in terms of security, as users can access resources in other domains of the same tree. However, this isolation does exist between different trees (forest), providing an additional layer of security between them.

Whatever the case, we'll talk about trusts in more detail in the next article.

### Functional Modes

As a simple detail to know, domains/forests can have different "versions." Each version with new features. And what is this for?

For compatibility reasons, on a network we can have, for example, a Windows Server 2022 together with a Windows Server 2016. Obviously, Windows Server 2016 cannot operate at the same functional level as Windows Server 2022, since the newer version includes additional features and improvements. However, Windows Server 2022 can operate at the functional level of Windows Server 2016.

Therefore, when we have domain controllers with different versions on the same network, the most relevant thing at the domain level is the "functional mode being used." This functional mode defines the available capabilities and features (for example, the Protected Users group is only available from WIN2012R2 onwards), and it's important to ensure that all domain controllers can interact correctly. You can see the list of available versions in the Microsoft documentation:

- [6.1.4.4 msDS-Behavior-Version: Forest Functional Level](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/564dc969-6db3-49b3-891a-f2f8d0a68a7f)

So if, for example, you encounter a domain that operates at the functional level in Windows Server 2016 mode, you know for sure that at minimum, all existing domain controllers on the network are Windows Server 2016.

## Organizational Units (OUs)

We now know the main structure of an active directory, we know on one hand that domains exist, which can be part of a tree and which in turn together can form a forest. Now, returning to the level of domains, even within them we need some feature to organize all the users, groups, and information we have, for this there exists what is known as Organizational Units (OUs).

Organizational units are container objects that help organize and manage AD (Active Directory) information.

> We can think of organizational units as virtual folders. And yes, within an OU there can be another OU, as I said, think of it as if they were folders.

In the end, this is very useful since it allows us to apply policies, restrictions, or access to a specific set of objects quickly and easily. For example, we apply a policy to an OU and directly this policy will be applied to all objects in that OU (users, groups...).

So, basically, OUs facilitate management, delegation, and security within a domain.

## Containers

A concept very similar to organizational units are containers. Containers also act as virtual folders that group different types of objects. So far the same as we've said about organizational units.

However, there are some distinctions that differentiate them:

- **Object Type**: Unlike Organizational Units, containers are not administrative objects and cannot be used to delegate administration permissions in a specific and detailed manner. Containers are simpler and are generally used to organize objects in a basic way within the Active Directory structure.

- **Main Purpose**: Containers are often used to group objects that do not require specific group policies or detailed administrative management. For example, the default "Users" container is used to store user and group accounts that have not been moved to specific OUs.

- **Policy Inheritance**: Unlike OUs, containers do not inherit or apply group policies (GPOs). This means they cannot be used to apply security policies or configurations in a specific way. Objects within a container are not subject to the same security rules and policies as objects within an OU.

- **Limitations**: Since containers are not as flexible as OUs for policy and permission administration, it's common for Active Directory administrators to use OUs for more structured organization and more detailed security administration. Containers are mainly used for default storage and basic grouping.

Some basic examples of containers would be:

- **Users**: Default container for storing user and group accounts.
- **Computers**: Default container for storing computer accounts.
- **ForeignSecurityPrincipals**: Used to store references to security objects from external domains.
- **Builtin**: Contains built-in security groups and default administrative roles.

In the following image we can see default containers:

![Screenshot showing default containers in Active Directory](https://cdn.deephacking.tech/i/posts/introduccion-a-active-directory/introduccion-a-active-directory-2.avif)

In summary, although containers do not offer the same management and security capabilities as OUs, they remain an important part of the Active Directory structure. They provide a default place for new objects and allow basic organization. In small or less complex environments, containers may be sufficient to organize directory objects. Additionally, the DC itself uses them during installation by default, as we can observe in the image above.

However, for more efficient and secure administration, it's recommended to move objects from default containers to properly organized OUs. This allows greater flexibility in applying group policies, delegating administrative permissions, and role-based access control.

So basically, containers are basic and essential elements of Active Directory that help in the organization and storage of objects. Although their functionality is more limited compared to OUs, they play a crucial role in the initial and default structure of an Active Directory environment.

## Group Policies (GPO)

Another important concept within AD are GPOs. GPOs are a collection of policies (configurations and rules) that help control Active Directory by facilitating the definition of these configurations and their uniform application.

GPOs can be applied at different levels of the active directory hierarchy, that is, GPOs can be applied at the domain level, at the organizational unit level, and at the user or group level.

An example of a GPO could be a specific configuration designed to automate software installation on all computers in an organizational unit (OU) or domain. This allows IT administrators to deploy necessary applications for users without having to manually install them on each machine.

GPOs can be inherited, if a GPO applies to a domain, it can affect all objects in that domain.

In summary, GPOs are objects that store a series of configurations and facilitate their application to other Active Directory objects.

## Domain Controllers (DCs)

Throughout the article, domain controllers have been mentioned several times, and I think it's been made more or less clear that they are the central servers from which Active Directory is administered and managed (in addition to storing all its information). However, domain controllers don't only fulfill these functions. They are also responsible for providing authentication and authorization services, that is, every time a user logs in or requests access to a resource, it's the DCs that are in charge of validating the credentials and deciding whether access is granted or denied.

Additionally, domain controllers also handle data replication on the network. Any change made to directory information, such as the creation or modification of user accounts, is automatically propagated to all DCs within the domain or forest so that in this way all information is always updated and consistent throughout the organization. The default replication interval is 3 hours.

In conclusion, domain controllers are the main core of AD, handling information storage and critical services such as authentication, authorization, and group policy management.

### LDAP and Kerberos

The two most fundamental protocols of Active Directory are LDAP and Kerberos.

On one hand, **LDAP (Lightweight Directory Access Protocol)** is the protocol responsible for accessing and managing information stored in the directory. For example, if I need to obtain any type of information about a user, such as their name or email address, or if I want to modify data such as their access privileges, I will do so through LDAP.

LDAP typically runs on port 389 of domain controllers. Additionally, there is a secure version, known as **LDAPS**, which encrypts communications to protect sensitive information, this version runs on port 636.

On the other hand, **Kerberos** is the default authentication protocol used in Active Directory environments. This protocol operates through a "ticket" system, which works as follows: when a user tries to access a resource on the network, they send a request to the Kerberos authentication service, which provides them with an authentication ticket. This ticket can be presented to other services and resources in the domain to verify the user's identity without the need to continuously send credentials.

There is already an article on the blog about Kerberos where we explain how it works:

- [How the Kerberos Protocol Works](https://blog.deephacking.tech/en/posts/how-the-kerberos-protocol-works/)

So basically, the important thing and what we need to keep in mind from this section is the existence and importance of the LDAP and Kerberos protocols in AD environments.

## Conclusion

We've seen the operation and main components of Active Directory. Perhaps now, even though you may have been able to understand everything or most of the ideas, you still can't visualize an AD. In that case, don't worry, it's something you'll learn as you see more examples and more concepts. My idea is to create a series of articles that start from scratch, like this one, to gradually move to more advanced concepts so that simply by reading the articles on this blog you can obtain a good level of AD knowledge.

## References

- [Attacking Active Directory: 0 to 0.9 - Eloy Pérez González](https://zer1t0.gitlab.io/posts/attacking_ad/)

- [The Purpose of Active Directory - JumpCloud](https://jumpcloud.com/blog/active-directory-purpose)

- [Active Directory objects: All you need to know](https://www.windows-active-directory.com/active-directory-objects-2.html)

- [Organizational Unit (OU)](https://www.manageengine.com/products/active-directory-audit/kb/what-is/ou-in-active-directory.html)
