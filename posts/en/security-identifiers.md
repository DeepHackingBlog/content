---
id: "security-identifiers"
title: "What are Security Identifiers (SIDs)"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-11-19
updatedDate: 2024-11-19
image: "https://cdn.deephacking.tech/i/posts/security-identifiers/security-identifiers-0.webp"
description: "Discover what Security Identifiers (SIDs) are in Windows, their structure, types, and how they are used in the security system to identify users, groups, and sessions."
categories:
  - "active-directory"
  - "windows"
draft: false
featured: false
lang: "en"
---

In today's article, we're going to explore a concept that comes up frequently when you read about Windows. Are you reading about _Security Descriptors_? The SID is probably mentioned. Are you reading about _Access Tokens_? The same likely occurs. Therefore, we're going to see what this is all about in today's article.

- [Security identifiers](#security-identifiers)
- [Structure of a SID](#structure-of-a-sid)
- [Well-known SIDs](#well-known-sids)
- [Relative Identifiers (RIDs)](#relative-identifiers-rids)
- [Logon SIDs](#logon-sids)
- [Conversion between names and SIDs](#conversion-between-names-and-sids)
- [Conclusion](#conclusion)
- [References](#references)

## Security identifiers

Security Identifiers (SIDs) are unique security identifiers that the Windows operating system uses to identify any [security principal (_Security Principal_)](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-principals) or security group (_Security Group_). A security principal can represent any entity authenticated by the operating system, such as a user account, a computer account, or even a thread or process running in the security context of an account.

However, security principals are not limited to these entities. They also include others that can act as subjects of authorization or authentication, such as domains in an Active Directory environment, which also have their own unique SID.

Windows uses SIDs instead of names (which can change or may not be unique) to ensure consistent and secure identification of these entities. SIDs are fundamental to the Windows security model and are used in key authorization and access control components.

We can view the SIDs associated with a user account and their groups using the whoami /all command. For example:

```powershell
PS C:\Users\MALDEV01> whoami /all

USER INFORMATION
----------------

User Name                SID
======================== ============================================
desktop-c9ak2kc\maldev01 S-1-5-21-422339986-568025100-1833951960-1001

GROUP INFORMATION
-----------------

Group Name                                                    Type             SID          Attributes
============================================================= ================ ============ ==================================================
Everyone                                                      Well-known group S-1-1-0      Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Local account and member of Administrators group Well-known group S-1-5-114    Group used for deny only
BUILTIN\Administrators                                        Alias            S-1-5-32-544 Group used for deny only
BUILTIN\Performance Log Users                                 Alias            S-1-5-32-559 Mandatory group, Enabled by default, Enabled group
BUILTIN\Users                                                 Alias            S-1-5-32-545 Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\INTERACTIVE                                      Well-known group S-1-5-4      Mandatory group, Enabled by default, Enabled group
CONSOLE LOGON                                                 Well-known group S-1-2-1      Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Authenticated Users                              Well-known group S-1-5-11     Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\This Organization                                Well-known group S-1-5-15     Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Local account                                    Well-known group S-1-5-113    Mandatory group, Enabled by default, Enabled group
LOCAL                                                         Well-known group S-1-2-0      Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\NTLM Authentication                              Well-known group S-1-5-64-10  Mandatory group, Enabled by default, Enabled group
Mandatory Label\Medium Mandatory Level                        Label            S-1-16-8192

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                          State
============================= ==================================== ========
SeShutdownPrivilege           Shut down the system                 Disabled
SeChangeNotifyPrivilege       Bypass traverse checking             Enabled
SeUndockPrivilege             Remove computer from docking station Disabled
SeIncreaseWorkingSetPrivilege Increase a process working set       Disabled
SeTimeZonePrivilege           Change the time zone                 Disabled

PS C:\Users\MALDEV01> 
```

When an account or group is created in Windows, the operating system generates a unique SID to identify it. This applies to both local accounts and groups as well as those in a domain environment. SIDs are unique within their scope (local or domain) and are **never reused**, even if the account or group is deleted. This ensures that each SID always corresponds to a single security entity.

The SID of local accounts and groups is generated by the **Local Security Authority (LSA)** of the computer and is stored in a secure area of the registry. On the other hand, the SID of domain accounts and groups is generated by the **domain security authority**, in other words, the **domain controllers**. In this latter case, the SID is stored in the **ObjectSID** attribute of the _User_ or _Group_ type object in ADDS (Active Directory Domain Services).

## Structure of a SID

Alright, now that we know the concept and definition of SID, let's look at its structure.

A SID is a binary format data structure that contains several components. The general structure of a SID is as follows:

```cpp
typedef struct _SID {
  BYTE                     Revision;
  BYTE                     SubAuthorityCount;
  SID_IDENTIFIER_AUTHORITY IdentifierAuthority;
  DWORD                    SubAuthority[ANYSIZE_ARRAY];
} SID, *PISID;
```

The components of a SID are:

1. **Revision**: Indicates the version of the SID structure (normally it is 1).
3. **SubAuthorityCount**: Number of elements in the SubAuthority array.
5. **[IdentifierAuthority](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-dtyp/c6ce4275-3d90-4890-ab3a-514745e4637e)**: A 48-bit value (6 bytes) that identifies the authority issuing the SID. Some common values are:
    - **0**: Null Authority (_NULL\_SID\_AUTHORITY_)
    - **1**: World Authority (_WORLD\_SID\_AUTHORITY_)
    - **2**: Local Authority (_LOCAL\_SID\_AUTHORITY_)
    - **5**: NT Authority (_SECURITY\_NT\_AUTHORITY_)
7. **SubAuthority**: A series of values that hierarchically identify the subject within the issuing authority. They are divided into:
    - **Domain Identifier**: The first subauthorities usually identify the domain or computer.
    - **Relative Identifier (RID)**: The last subauthority uniquely identifies the account or group within the domain or computer.

The components of SIDs can be visualized much more easily when converted from binary format to text. To do this, the Security Descriptor Definition Language (SDDL) is used, although in this case, we will only use it to represent the SID and not a complete security descriptor, that's better for another article. So, a SID in text format looks like this:

```
S-Revision-IdentifierAuthority-SubAuthority1-SubAuthority2-...-SubAuthorityn
```

For example:

```
S-1-5-21-422339986-568025100-1833951960-1001
```

- **S**: Indicates that it is a SID.
- **1**: Revision number.
- **5**: Authority identifier (NT Authority).
- **21**: Fixed **SubAuthority** indicating that the SID is relative to a **domain or computer**.
- **422339986-568025100-1833951960**: These three numbers, together with the **21**, form the **base SID** that uniquely identifies the domain or computer. Each of these numbers corresponds to a randomly generated 32-bit value.
- **1001**: **Relative Identifier (RID)** that uniquely identifies the account or group within the domain or computer (we'll talk about RID now).

## Well-known SIDs

There are predefined SIDs, known as **Well-known SIDs**, which represent the also-called **Well-known Security Principals**, which are security principals (generic accounts and groups) present on all Windows systems. These SIDs have constant values across all systems and domains, which facilitates security administration and configuration. Some examples are:

- **S-1-1-0**: **Everyone** (Group that includes all users, except anonymous).
- **S-1-5-32-544**: **Administrators** (Local administrators group).
- **S-1-5-32-545**: **Users** (Local users group).
- **S-1-5-18**: **Local System** (Local system account).
- **S-1-5-19**: **Local Service** (Local service account).
- **S-1-5-20**: **Network Service** (Network service account).

These SIDs are used by the operating system and applications to apply permissions and security policies consistently. We can find more examples at the following link:

- [Well-known Security Identifiers (SIDs) - EventSentry](https://system32.eventsentry.com/codes/field/Well-known%20Security%20Identifiers%20\(SIDs\))

## Relative Identifiers (RIDs)

RIDs are values that are appended to the end of the base SID to create a unique SID for each account or group. In local environments, RIDs for user accounts and groups typically start at **1000** and increase sequentially as new accounts are created.

For special accounts, predefined RIDs are used:

- **500**: **Administrator** (default administrator account).
- **501**: **Guest** (default guest account).
- **512**: **Domain Admins** (domain administrators group).
- **513**: **Enterprise Admins** (enterprise administrators group)

In a domain, RID assignment is managed by a special role called **RID Master** (one of the [FSMO roles](https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/fsmo-roles)). This role ensures that each domain controller receives a unique block of RIDs to assign to new accounts and groups (always assigning within the RID block that the corresponding DC has assigned), thus avoiding collisions and ensuring that SIDs are not repeated throughout the domain.

Since RIDs follow sequential values, if for example we are in an environment where null sessions are supported (aka. unauthenticated access to the IPC$ resource of SMB), it is possible to obtain the SID of the computer or domain. Once we have this, we can perform an attack known as [RID Cycling](https://trustedsec.com/blog/new-tool-release-rpc_enum-rid-cycling-attack), which simply consists of brute-forcing the RIDs while maintaining the base SID, this way we can enumerate users of a computer or domain.

## Logon SIDs

In addition to SIDs associated with accounts and groups, Windows generates a unique **Logon SID** for each interactive logon session. This SID uniquely identifies the session and can be used in access control entries (ACEs) to allow or deny access during the duration of the client session.

The SID of a logon session has the following format:

```
S-1-5-5-X-Y
```

Where **X** and **Y** are randomly generated values. Logon SIDs are useful, for example, when a Windows service uses the [LogonUser](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-logonusera) function to start a new session. The service can extract the Logon SID from the returned access token and use it in an ACE to control access to specific resources during that session.

## Conversion between names and SIDs

Within the Windows security architecture, a vital component is the **Security Reference Monitor (SRM)**. This component is responsible for implementing the security mechanisms that restrict users' access to different resources. For example, without the SRM it would not be possible to prevent other users from accessing your files.

The SRM works with **SIDs (Security Identifiers)**, but it expects them in binary format. However, for us as users it is much more convenient to refer to accounts and groups through their names. The task of converting names to SIDs and vice versa is performed by the **Local Security Authority Subsystem Service (LSASS)**, which operates in a privileged process independent of the connected users.

We can use PowerShell commands to convert names to SIDs and vice versa. For example:

```powershell
PS C:\> Get-LocalGroup -Name "Users" | Select-Object Name, SID

Name  SID
---- ---
Users S-1-5-32-545

PS C:\>
```

In a domain we could obtain the SID of an object as follows:

```powershell
PS C:\> $(Get-ADDomain).DomainSID.Value
S-1-5-21-2643224878-1147328777-3138214671 // Domain SID
PS C:\>
PS C:\> $(Get-ADUser robert.baratheon).SID.Value
S-1-5-21-2643224878-1147328777-3138214671-1117 // SID of user robert.baratheon
PS C:\>
```

**Note**: From Linux we could use the [lookupsid.py](https://github.com/fortra/impacket/blob/master/examples/lookupsid.py) script from Impacket or the _lookupnames_ function of rpcclient.

On the other hand, we can convert from SID to name with the following command:

```powershell
PS C:\> $sid = New-Object System.Security.Principal.SecurityIdentifier("S-1-5-32-545")
PS C:\> $sid.Translate([System.Security.Principal.NTAccount])

Value
-----
BUILTIN\Users

PS C:\>
```

**Note**: From Linux, to obtain the name from the SID we could use the _lookupsids_ function of rpcclient.

## Conclusion

That's it for today's article, we have learned what security identifiers are in Windows and how they are structured. As you read more about other Windows concepts you will probably see many mentions of the SID, so now you know what they're about. It would be greatly appreciated if you share the article and mention Deep Hacking <3

## References

- [Security identifiers](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-identifiers)
- [SID structure (winnt.h)](https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-sid)
- [SID Components](https://learn.microsoft.com/en-us/windows/win32/secauthz/sid-components)
- [1.1.1.2 Security Identifiers (SIDs)](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-azod/ecc7dfba-77e1-4e03-ab99-114b349c7164)
- Windows Internals Part 1 - Seventh Edition
- Windows Security Internals A Deep Dive into Windows Authentication, Authorization, and Auditing
