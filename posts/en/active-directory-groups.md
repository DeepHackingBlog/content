---
id: "grupos-active-directory"
title: "Types of Groups in Active Directory"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-12-10
updatedDate: 2024-12-10
image: "https://cdn.deephacking.tech/i/posts/grupos-active-directory/grupos-active-directory-0.webp"
description: "Discover the different types of groups in Active Directory, their scopes, differences with OUs, and the most important groups for domain security."
categories:
  - "active-directory"
draft: false
featured: false
lang: "en"
---

We've already covered a good number of Active Directory articles, and this is just the beginning. Today we're going to take another step in this topic and talk about groups. What types of groups can we find? What type of scope do they have? How does a group differ from an organizational unit? Which groups are most important?

That's what we're going to see today. In the last Active Directory article, we looked at how the database is structured, I'll leave it here:

- [Active Directory directory and schema](https://blog.deephacking.tech/en/posts/directory-and-schema-of-active-directory/)

Since we already know how it's structured and where the information is stored, today we're going to look at one of the most important objects, groups.

- [Types of groups](#types-of-groups)
    - [Security groups](#security-groups)
    - [Distribution groups](#distribution-groups)
    - [How do I differentiate them?](#how-do-i-differentiate-them)
- [Group scope](#group-scope)
    - [Universal Groups](#universal-groups)
    - [Global Groups](#global-groups)
    - [Domain Local Groups](#domain-local-groups)
- [Groups vs Organizational Units (OU)](#groups-vs-organizational-units-ou)
- [Notable groups that can be found within AD](#notable-groups-that-can-be-found-within-ad)
    - [Administrative groups](#administrative-groups)
    - [Protected Users](#protected-users)
        - [Protections on devices](#protections-on-devices)
        - [Protections on the domain controller](#protections-on-the-domain-controller)
    - [Other important groups](#other-important-groups)
        - [DNSAdmins](#dnsadmins)
        - [Schema Admins](#schema-admins)
        - [Server Operators](#server-operators)
        - [Backup Operators](#backup-operators)
        - [Account Operators](#account-operators)
        - [Print Operators](#print-operators)
        - [Remote Desktop Users](#remote-desktop-users)
        - [Group Policy Creator Owners](#group-policy-creator-owners)
    - [Custom groups](#custom-groups)
- [Conclusion](#conclusion)
- [References](#references)

We have mentioned several existing groups within an Active Directory environment. In addition to finding unique groups, there are several default groups that are found in all environments. Let's look at several of them and some types:

## Types of groups

I don't think I'm teaching anything new if I say that a group is a collection of users, computers, or other groups that share the same characteristics and responsibilities. In an organization, users, computers, or so to speak, individual entities are constantly being deleted, but generally roles and responsibilities don't change much. For this very reason, in terms of managing an organization's privileges, it's best to rely on roles and responsibilities rather than individuals. A simple example is that the people in a company department may change continuously, but the operational requirements don't, they will all access the same resources. Groups in Active Directory specifically facilitate this, they allow isolating identities based on privilege requirements.

In an Active Directory environment we can find two categories of groups:

- Security groups (_Security groups_)
- Distribution groups (_Distribution groups_)

#### Security groups

Security groups are used to manage access to resources efficiently. These groups allow assigning [permissions](https://learn.microsoft.com/en-us/windows/security/identity-protection/access-control/access-control#permissions) and [user rights](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/user-rights-assignment) in a centralized manner, that is, instead of granting access directly to individual users, permissions and rights are assigned to the group, and any member automatically inherits those capabilities.

It's important to keep in mind that permissions and user rights, although they are related concepts, have different purposes:

- **User rights** determine what general tasks a user or group can perform at the system or domain level, such as logging on remotely, performing backups, or shutting down a system. These rights are not tied to specific resources, but to global actions. For example, a member of the "Backup Operators" group will have the right to perform backups on domain controllers.
- **Permissions**, on the other hand, control access to specific resources, such as folders, files, or printers, and determine what actions (such as read, write, or modify) can be performed on them. For example, a user in a group with "read" permissions on a folder will be able to access the files, but not modify or delete them.

In summary, you could say that user rights apply to user accounts while permissions are associated with objects. Regarding user rights, you can find the list in [Microsoft's documentation on User Rights Assignment](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/user-rights-assignment).

User rights are configured primarily through **Group Policy** and apply at the system or domain level. On the other hand, permissions are defined in **Access Control Lists (ACLs)** and are applied at the level of each specific resource.

For example, if a user needs to connect remotely to a server, they must first have the **"Allow log on through Remote Desktop Services"** user right assigned, which allows them to log on to the server. However, once connected, they will need specific permissions to access the server's resources, such as folders, files, or applications. This ensures that they can only interact with the resources that have been authorized, even if they have the right to log on remotely.

In summary, security groups not only centralize the management of permissions and rights, but also guarantee control over the access and capabilities of users within the system. Almost any group you encounter in Active Directory will be a security group.

#### Distribution groups

Distribution groups are those used to create email distribution lists. This type of group is used to send emails only to a defined group of users through an email application such as an Exchange server. These groups are not security-enabled, so they cannot be used to assign permissions, that is, they cannot be included in DACLs.

#### How do I differentiate them?

Now, if you're auditing a domain, how can you tell if a group is a security or distribution group?

Well, for this, in group objects there is the _[groupType](https://learn.microsoft.com/en-us/windows/win32/adschema/a-grouptype#remarks)_ attribute, this attribute can be zero or a combination of one or more values that are defined below:

| Value | Definition |
| --- | --- |
| 1 (0x00000001) | Specifies a group that is created by the system. |
| 2 (0x00000002) | Specifies a group with global scope. |
| 4 (0x00000004) | Specifies a group with domain local scope (_domain local scope_). |
| 8 (0x00000008) | Specifies a group with universal scope (_universal scope_). |
| **16 (0x00000010)** | Specifies an _APP\_BASIC_ group for Windows Server Authorization Manager. |
| **32 (0x00000020)** | Specifies an _APP\_QUERY_ group for Windows Server Authorization Manager. |
| **2147483648 (0x80000000)** | Specifies a security group. If this flag is not set, the group is a distribution group. |

As we can see, the last value in the table corresponds to the definition of whether a group object is a security group. In addition, other values that we can observe that are defined in this attribute is the scope, which is precisely what we're going to talk about now.

## Group scope

In Active Directory, groups are classified according to their scope, which as we just saw is declared in the _groupType_ attribute of _group_ objects. This attribute determines in which contexts the group can have members and what resources it can grant access to. There are three main types of groups based on their scope:

> Note: When "trusted domain" is mentioned, the forest is also intrinsically included, since all domains within a forest share an implicit and transitive trust relationship between them.

#### Universal Groups

| Scope | Possible members | Scope conversion | Where permissions can be assigned | Can be a member of |
| --- | --- | --- | --- | --- |
| Universal | User and computer accounts from any trusted domain (_[trusted side](https://blog.deephacking.tech/en/posts/trusts-in-active-directory/#trust-direction)_).<br>Global groups from any trusted domain (_[trusted side](https://blog.deephacking.tech/en/posts/trusts-in-active-directory/#trust-direction)_).<br>Other Universal groups from any domain in the same forest. | Can be converted to Domain Local scope if the group is not a member of another Universal group.<br>Can be converted to Global scope if the group does not contain other Universal groups. | In any domain in the same forest or trusted forests. | Other Universal groups in the same forest.<br>Domain Local groups in the same forest or trusted forests.<br>Local groups on computers within the same forest or trusted forests. |

Universal groups are useful when you need to grant access to shared resources between domains or manage permissions centrally.

For example, suppose the domains _contoso.com_ and _fabrikam.com_ are in the same forest. We could create a universal group that includes users from both domains. This universal group could be used to assign access permissions to a shared folder located in the _contoso.com_ domain, allowing all members to work on the same resources regardless of the domain they belong to.

In addition, universal group objects and their information are replicated to all [global catalog](https://blog.deephacking.tech/en/posts/directory-and-schema-of-active-directory/#global-catalog-gc) servers in the forest, which ensures that the information is available in all domains.

We can enumerate groups with universal scope as follows:

```powershell
PS C:\> Get-ADGroup -Filter {GroupScope -eq 'Universal'}

DistinguishedName : CN=Schema Admins,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : Universal
Name              : Schema Admins
ObjectClass       : group
ObjectGUID        : 34f36519-7649-494e-99b2-b370ad541eee
SamAccountName    : Schema Admins
SID               : S-1-5-21-2643224878-1147328777-3138214671-518

DistinguishedName : CN=Enterprise Admins,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : Universal
Name              : Enterprise Admins
ObjectClass       : group
ObjectGUID        : 60430ea5-c01a-410d-8316-58cce4d8bce4
SamAccountName    : Enterprise Admins
SID               : S-1-5-21-2643224878-1147328777-3138214671-519

DistinguishedName : CN=Enterprise Read-only Domain Controllers,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : Universal
Name              : Enterprise Read-only Domain Controllers
ObjectClass       : group
ObjectGUID        : 5e4ae0d1-6898-455e-a226-2b7ac60d6646
SamAccountName    : Enterprise Read-only Domain Controllers
SID               : S-1-5-21-2643224878-1147328777-3138214671-498

DistinguishedName : CN=Enterprise Key Admins,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : Universal
Name              : Enterprise Key Admins
ObjectClass       : group
ObjectGUID        : 0529e3d3-b7c3-43cb-864e-36bc134131c2
SamAccountName    : Enterprise Key Admins
SID               : S-1-5-21-2643224878-1147328777-3138214671-527

PS C:\>
```

For example, members of Enterprise Admins have administrative privileges in all domains of the forest, therefore, it is a universal group.

> If you notice, in the output of this command we cannot visualize the groupType attribute, instead, we see GroupCategory and GroupScope. This is simply because the Active Directory PowerShell module breaks down the groupType attribute to make it more understandable.

If we did the query using ldapsearch we can visualize the groupType attribute:

```bash
ldapsearch -x -H ldap://192.168.10.128 -D "robb.stark@north.sevenkingdoms.local" -w "sexywolfy" -b "dc=north,dc=sevenkingdoms,dc=local" "(objectClass=group)" cn groupType
```

![LDAP query showing the groupType attribute of groups in Active Directory](https://cdn.deephacking.tech/i/posts/grupos-active-directory/grupos-active-directory-1.avif)

If you notice, the value appears negative, this is because the most significant bit of the integer representing the **groupType** is activated to indicate that it is a security group. I think the following image will make it quite clear:

![Visual explanation of the signed integer in the groupType attribute of Active Directory](https://cdn.deephacking.tech/i/posts/grupos-active-directory/grupos-active-directory-2.avif)

#### Global Groups

| Scope | Possible members | Scope conversion | Where permissions can be assigned | Can be a member of |
| --- | --- | --- | --- | --- |
| Global | User and computer accounts from the same domain.<br>Other Global groups from the same domain. | Can be converted to Universal scope if the group is not a member of another Global group. | In any domain in the same forest or trusted forests. | Universal groups from any domain in the same forest.<br>Other Global groups from the same domain.<br>Domain Local groups from any domain in the same forest or trusted domains. |

Global groups are ideal for grouping users with similar functions and responsibilities within a domain, and then using that group to grant access to resources in other domains.

For example, suppose that in the _contoso.com_ domain there is a set of users who need to access a resource hosted in another domain in the same forest, for example, _fabrikam.com_. We could create a global group in _contoso.com_ that includes these users. This global group could be used to assign access permissions to the resource in _fabrikam.com_, allowing all its members to use it without the need to assign permissions one by one.

Global group objects and their information are replicated to all domain controllers within the same domain. Although their members are limited to a single domain, permissions can be applied throughout the forest, which is useful for assigning specific privileges to resources in other domains.

We can get a list of global groups with the following command:

```powershell
PS C:\> Get-ADGroup -Filter {GroupScope -eq 'Global'}

DistinguishedName : CN=Domain Computers,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : Global
Name              : Domain Computers
ObjectClass       : group
ObjectGUID        : afdaa8f4-28f1-4f2d-b354-f2bbcf6a4100
SamAccountName    : Domain Computers
SID               : S-1-5-21-2643224878-1147328777-3138214671-515

DistinguishedName : CN=Domain Controllers,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : Global
Name              : Domain Controllers
ObjectClass       : group
ObjectGUID        : c688dc5f-9b64-4233-adb7-4de60fe7808d
SamAccountName    : Domain Controllers
SID               : S-1-5-21-2643224878-1147328777-3138214671-516

DistinguishedName : CN=Domain Admins,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : Global
Name              : Domain Admins
ObjectClass       : group
ObjectGUID        : 2106add7-5215-4451-a225-92e8f9682940
SamAccountName    : Domain Admins
SID               : S-1-5-21-2643224878-1147328777-3138214671-512

DistinguishedName : CN=Domain Users,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : Global
Name              : Domain Users
ObjectClass       : group
ObjectGUID        : eb99945b-3c3e-45bb-add4-3e2aac40677f
SamAccountName    : Domain Users
SID               : S-1-5-21-2643224878-1147328777-3138214671-513

...
```

The Domain Admins group, which grants administrative permissions in a specific domain, is a global group. Although it only has members from its own domain, it can be used to manage resources throughout the forest.

#### Domain Local Groups

| Scope | Possible members | Scope conversion | Where permissions can be assigned | Can be a member of |
| --- | --- | --- | --- | --- |
| Domain Local | User and computer accounts from any trusted domain (_[trusted side](https://blog.deephacking.tech/en/posts/trusts-in-active-directory/#trust-direction)_).<br>Global groups from any trusted domain (_[trusted side](https://blog.deephacking.tech/en/posts/trusts-in-active-directory/#trust-direction)_).<br>Universal groups from any domain in the same forest.<br>Other Domain Local groups from the same domain.<br>Accounts, Global and Universal groups from other forests and external domains. | Can be converted to Universal scope if the group does not contain other Domain Local groups. | Within the same domain. | Other Domain Local groups from the same domain.<br>Local groups on computers within the same domain, excluding built-in groups that have well-known security identifiers (Well-Known SIDs). |

These groups are useful for controlling access to specific resources within a domain, without extending to other domains.

For example, suppose that in the _contoso.com_ domain there is a shared folder that contains sensitive information that only certain users should access. We could create a domain local group in _contoso.com_ and add to it the global groups or specific users who need that access. This local group would be used to assign permissions on the shared folder, ensuring that only authorized members can access the information, without extending these permissions outside the _contoso.com_ domain.

The structure of domain local groups is replicated on all domain controllers in the same domain, which ensures that resource access information is available on all servers in the domain.

We can get all local groups in the current domain with the following command:

```powershell
PS C:\> Get-ADGroup -Filter {GroupScope -eq 'DomainLocal'}

DistinguishedName : CN=Cert Publishers,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : DomainLocal
Name              : Cert Publishers
ObjectClass       : group
ObjectGUID        : ad2b04e9-92dd-40c7-a913-b2b59cb36ca4
SamAccountName    : Cert Publishers
SID               : S-1-5-21-2643224878-1147328777-3138214671-517

DistinguishedName : CN=RAS and IAS Servers,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : DomainLocal
Name              : RAS and IAS Servers
ObjectClass       : group
ObjectGUID        : d38fb4d7-8eff-4f77-9130-458913f7c892
SamAccountName    : RAS and IAS Servers
SID               : S-1-5-21-2643224878-1147328777-3138214671-553

DistinguishedName : CN=Allowed RODC Password Replication Group,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : DomainLocal
Name              : Allowed RODC Password Replication Group
ObjectClass       : group
ObjectGUID        : 862213eb-7960-4b88-a7f7-1465d222b331
SamAccountName    : Allowed RODC Password Replication Group
SID               : S-1-5-21-2643224878-1147328777-3138214671-571

DistinguishedName : CN=Denied RODC Password Replication Group,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : DomainLocal
Name              : Denied RODC Password Replication Group
ObjectClass       : group
ObjectGUID        : 3828c98e-f9bf-434e-8fdb-71d4982f625e
SamAccountName    : Denied RODC Password Replication Group
SID               : S-1-5-21-2643224878-1147328777-3138214671-572

DistinguishedName : CN=DnsAdmins,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : DomainLocal
Name              : DnsAdmins
ObjectClass       : group
ObjectGUID        : d9215dee-9a02-4d45-84b4-491da681af34
SamAccountName    : DnsAdmins
SID               : S-1-5-21-2643224878-1147328777-3138214671-1102

...
```

For example, the Administrators group in a domain is a domain local group. Although it can have members from other domains, it only grants access to resources in its own domain.

## Groups vs Organizational Units (OU)

Both groups and organizational units are quite similar, both can be used to group objects. Likewise, both can also be used with group policies. However, there are some subtle differences between them:

| Characteristic | Active Directory Groups | Organizational Units (OUs) |
| --- | --- | --- |
| Hierarchical structure | Flat structure. A group can have different types of objects (users, devices, groups) as members, but they cannot be represented in a hierarchical order. | They can use different models to organize OUs in a hierarchical order (like a tree structure). They can also easily change the structure when needed. |
| Object location | An object can be part of many different groups. | An object can only belong to one OU at a time. |
| Access Control Lists (ACLs) | Groups can be added to ACLs. | OUs cannot be part of ACLs. |
| [Security Identifier (SID)](https://blog.deephacking.tech/en/posts/security-identifiers/) value | They have a SID value. | They do not have a SID value. |

For these reasons, although at first glance groups and OUs may have similar functionalities, the purpose of each is different. For example, to manage resource permissions the most appropriate thing is to use groups, while OUs are much better for grouping objects in a hierarchical order and delegating control, that is, allowing an administrator to manage only part of Active Directory without affecting the rest.

## Notable groups that can be found within AD

Next we are going to look at several predefined (built-in) groups that we can find in an Active Directory environment:

#### Administrative groups

In Active Directory there are several [default groups](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-groups#default-security-groups) that have administrative functions. The two most famous are:

- Domain Admins: Members of this group have administrative privileges throughout the domain. By default, this group is also included in the Administrators group of the domain, as well as the Administrators group of the domain's computers.
- Enterprise Admins: This group provides administrative privileges throughout the forest and is found only in the root domain of the forest. However, by default, it is added to the Administrators group of all domains in the forest.

#### Protected Users

The **Protected Users** group was introduced with **Windows Server 2012 R2** and was developed to provide accounts with elevated privileges better protection against credential theft attacks. Members of this group have non-configurable protection applied. To use this group, the **Primary Domain Controller (PDC)** must be running at least **Windows Server 2012 R2**, and client computers must use at least **Windows 8.1** or **Windows Server 2012 R2**.

This group, as mentioned, is designed to protect its members' accounts against attacks that attempt to steal credentials, such as **NTLM relay** and Kerberos delegation. When a user is added to the **Protected Users** group, a series of security measures are automatically applied that cannot be manually configured and that are activated as soon as the user logs on, these measures can be divided into two:

##### Protections on devices

If a user belonging to this group logs on to a domain computer (Windows 8.1, Windows Server 2012 R2, Windows 10, Windows Server 2016, Windows Server 2019, Windows Server 2022, or later), the following restrictions will automatically be applied to that computer:

- **CredSSP does not store the user's credentials in plain text.** Even if the **Allow delegating default credentials** group policy is enabled, these will not be stored.
- On **Windows 8.1** and later versions (including Windows Server 2012 R2 and later), **Windows Digest does not store credentials in plain text**, even if it is enabled.
- **NTLM stops storing credentials in plain text** or using the NT one-way function (NTOWF).
- **Kerberos does not use obsolete ciphers like DES or RC4** and also does not store credentials or long-term keys after obtaining the initial TGT.
- The system **does not create a cached verifier** (_DCC2 hashes_) when logging on or unlocking the device, so members will no longer be able to log on offline.

##### Protections on the domain controller

In addition to the measures applied directly on user devices, the Protected Users group also establishes important restrictions on domain controllers, which apply when a member of the group authenticates in a domain with functional level of Windows Server 2012 R2 or later. These restrictions include the following:

- Authenticate with NTLM: They can only use Kerberos to authenticate.
- Use old ciphers like DES or RC4 in Kerberos pre-authentication.
- Delegation with Unconstrained or Constrained Delegation: The account cannot be used for delegation, whether restricted or unrestricted.
- Renew Kerberos tickets beyond the first four hours: TGTs (Ticket Granting Tickets) normally have a lifetime of 10 hours (600 minutes). However, Protected Users members cannot automatically renew their tickets after the first 4 hours. This means that, although the initial ticket lasts up to 10 hours, they will need to authenticate again once those 4 hours have passed.

#### Other important groups

In addition to administrative groups or the _Protected Users_ group, there are other predefined (_built-in_) groups that grant their members specific privileges within the domain:

##### DNSAdmins

Members of the **[DNSAdmins](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#bkmk-dnsadmins)** group have permissions to manage the domain's DNS servers. Since on most occasions domain controllers (DC) act as DNS servers, members of this group can load custom DLLs that run with system privileges (**SYSTEM**) on domain controllers, which leads to complete compromise of the domain.

In environments where the DNS service runs on servers separate or external to the domain, this risk is reduced, since control over DNS does not imply direct access to the DCs. However, it's important to note that **DNSAdmins** members can still affect name resolution and, therefore, network connectivity.

##### Schema Admins

[Schema Admins](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#schema-admins) have permission to modify the Active Directory schema, which is something that is not done frequently. These changes are very delicate, since they affect how data is structured and managed throughout the directory. If a schema change is not properly managed, it can have a significant impact on the availability and functioning of the domain, or even cause problems with data integrity. Basically, if incorrect changes are made to the schema, there is a risk of destabilizing the entire Active Directory environment.

By default, this group is usually empty and it's recommended to add users only temporarily when specific schema modifications are required.

##### Server Operators

[Server Operators](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#server-operators) have privileges to manage domain controller configuration, which includes tasks such as starting or stopping services and modifying critical configurations. In addition, they have permissions to **log on locally** to domain controllers, which means they can access the server directly, either physically or through protocols like **RDP (Remote Desktop Protocol)** or **WinRM (Windows Remote Management)**.

##### Backup Operators

[Backup Operators](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#backup-operators) have permissions to perform backups and restore files on domain controllers. They can also log on locally to DCs, similar to **Server Operators**. This means they can access sensitive data stored on the domain controller, such as the NTDS or SAM.

##### Account Operators

[Account Operators](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#bkmk-accountoperators) can create, modify, and delete user accounts and groups in the domain, as well as manage user membership in many groups. However, they cannot modify accounts that are members of protected groups, such as **Domain Admins**, **Administrators**, **Schema Admins**, and other administrative groups.

**Protected groups** are subject to **[AdminSDHolder](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/appendix-c--protected-accounts-and-groups-in-active-directory#adminsdholder)** protection, a special object in Active Directory that automatically applies predefined permissions to these accounts through the **SDProp** process, executed every 60 minutes. This ensures that their security settings remain intact and cannot be altered without authorization. To identify if a group or account is protected, you can check the adminCount attribute: if its value is 1, it means it is under AdminSDHolder protection.

Although **Account Operators** cannot directly alter these groups, they can still manage other groups like **Server Operators**.

##### Print Operators

[Print Operators](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#print-operators) have permissions to manage the domain's printers and can also **log on locally** to domain controllers. This means they can access the DC through **RDP**, **WinRM**, or physically. Although their main function is to manage print services, the fact that they can log on to a DC gives them the ability to interact directly with the system.

##### Remote Desktop Users

The **[Remote Desktop Users](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#bkmk-remotedesktopusers)** group allows its members to connect to computers through **RDP** graphically. For a domain user to be able to remotely access a specific computer, several requirements must be met:

1. The computer must have **Remote Desktop** access enabled:
    - **Manual Configuration:**
        - On each computer, go to system properties and, in the **"Remote access"** tab, select **"Allow remote connections to this computer"**.
    - **Automatic Configuration via Group Policy:**
        - In a domain environment, you can automate this process using a **Group Policy**. By configuring a GPO that enables Remote Desktop, you can apply this configuration to multiple computers simultaneously.
2. The user must be a member of the local Remote Desktop Users group on the computer they want to connect to via RDP.
    - **Membership in the Local Group:**
        - Membership in the **Remote Desktop Users** group at the domain level is **not sufficient** on its own. The user must be added to the **local** **Remote Desktop Users** group on each computer they need to access. Similarly, it is sufficient to belong locally to the group without belonging at the domain level.
    - **Automation of adding members to the group locally:**
        - You can use **Group Policy Preferences** to add domain users or groups to the local **Remote Desktop Users** group on multiple computers.
        - **For example**, you can create a **GPO** that adds a specific domain user or group to the local **Remote Desktop Users** group on all computers to which the policy applies.
3. The user must have the "Log on through Remote Desktop Services" permission in local security policies.
    - **User Rights Assignment:**
        - This permission is found in **Local Security Policies** under **Security Settings > Local Policies > User Rights Assignment**.
        - By default, this right is assigned to the **Administrators** and **Remote Desktop Users** groups.
    - **Configuration via Group Policy:**
        - In a domain environment, this permission can be configured through a GPO to ensure that necessary users or groups have this right.

##### Group Policy Creator Owners

Members of the **[Group Policy Creator Owners](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#group-policy-creator-owners)** group can create and modify **Group Policies (GPOs)** within the domain. However, their ability to edit existing GPOs is limited to those they have created themselves. They cannot modify GPOs created by other administrators unless they are granted explicit permissions.

Despite this restriction, the power to create new GPOs and apply them to organizational units (OUs) can have a significant impact on the domain.

#### Custom groups

In addition to the default groups, many organizations create custom groups to manage specific roles within the company. These groups allow more flexible management adapted to internal needs.

On the other hand, some programs also add their own groups. A common example is Microsoft Exchange, which creates groups like [Exchange Windows Permissions](https://learn.microsoft.com/en-us/exchange/permissions/split-permissions/configure-exchange-for-shared-permissions?view=exchserver-2019), granting special permissions necessary for the operation and administration of the software.

An interesting conclusion is that, by viewing the existing groups in an environment, you can identify the presence of certain programs or solutions implemented in the organization, such as Exchange or any other software that has created its own groups.

## Conclusion

As you have been able to see, groups are much more than simple collections of users and other objects, they can be quite versatile and their role is essential in an Active Directory environment, both from an offensive and defensive point of view.

If you liked the article, it would be greatly appreciated if you share it on social media and mention us <3.

## References

- [Attacking Active Directory: 0 to 0.9 - Eloy Pérez González](https://zer1t0.gitlab.io/posts/attacking_ad/)
- [Active Directory groups - ManageEngine](https://www.manageengine.com/products/active-directory-audit/kb/what-is/active-directory-group.html)
- [Mastering Active Directory, Third Edition: Design, deploy, and protect Active Directory Domain Services for Windows Server 2022, Third Edition](https://www.packtpub.com/en-us/product/mastering-active-directory-third-edition-9781801070393)
- [User rights - Microsoft](https://learn.microsoft.com/en-us/windows/security/identity-protection/access-control/access-control#user-rights)
- [Permissions - Microsoft](https://learn.microsoft.com/en-us/windows/security/identity-protection/access-control/access-control#permissions)
- [User Rights Assignment - Microsoft](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/user-rights-assignment)
- [Active Directory security groups - Microsoft](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-groups)
- [Protected Users Security Group - Microsoft](https://learn.microsoft.com/en-us/windows-server/security/credentials-protection-and-management/protected-users-security-group)
