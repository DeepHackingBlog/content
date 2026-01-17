---
id: "introduccion-a-las-politicas-de-grupo-gpo-active-directory"
title: "Introduction to Group Policy Objects (GPO) in Active Directory"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2026-01-19
updatedDate: 2026-01-19
image: "https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-0.webp"
description: "Discover what Group Policies are in Active Directory, how GPOs work, their components (GPC and GPT), and how they enable centralized management of user and computer configurations."
categories:
  - "active-directory"
draft: false
featured: false
lang: "en"
---

GPOs, that Active Directory feature we always mention when there's some configuration or policy we don't understand and we say: "it must be a GPO". In today's article, we're going to see what they are and how they work.

## Table of Contents
- [What are Group Policies (GP)?](#what-are-group-policies-gp)
- [Active Directory Policy VS Local Policy](#active-directory-policy-vs-local-policy)
  - [Local Group Policy](#local-group-policy)
  - [Active Directory Group Policy](#active-directory-group-policy)
- [Group Policy Objects (GPO)](#group-policy-objects-gpo)
  - [Components of a GPO](#components-of-a-gpo)
    - [Group Policy Container (GPC)](#group-policy-container-gpc)
    - [Group Policy Template (GPT)](#group-policy-template-gpt)
    - [GPO, GPC and GPT](#gpo-gpc-and-gpt)
  - [Attributes of a GPO](#attributes-of-a-gpo)
- [Conclusion](#conclusion)
- [References](#references)

## What are Group Policies (GP)?

Group Policies are a set of tools that allow administrators to centrally manage the configurations of **user accounts** and **computer accounts** in an Active Directory domain. Their greatest potential is achieved in Active Directory, but Windows computers also have local group policies that use the same processing engine.

We can also understand Group Policies as a kind of authority that enforces certain rules. If a Group Policy indicates that certain users must follow a certain rule, those users will have to follow it.

For example, imagine your boss tells you:
- _Hey, I need you to install Adobe Acrobat on all computers in the human resources department so they can open, fill out, and sign PDFs. Because obviously, we're not going to give them administrator privileges to do it themselves._

If the department has 25 people, imagine installing the program on each computer one by one, it would take too much time and ultimately would be a very repetitive task. From the company's perspective, this ultimately has an operational cost.

Well, Group Policies solve this problem, they allow automating repetitive and common administration tasks. These tasks are not limited to software deployment and management, but can encompass many more things such as:
- Network drive and printer mapping
- Startup and shutdown scripts
- Security configurations
- Registry settings
- Power management and updates
- Folder redirection
- And much more

So, if you had to summarize what a Group Policy is, you would probably say it's a configuration management technology integrated into Windows and Active Directory that helps create strategic plans to maintain a solid security posture in an organization, right? 😉

But it's not just that, it's also a fantastic vehicle for sending and distributing _malware_. Although we'd better leave that for another day, first let's understand it.

## Active Directory Policy VS Local Policy

As I mentioned previously at the beginning of the previous section, although the true potential and use of Group Policies occur in an Active Directory environment, their existence is not limited to or dependent on it.

### Local Group Policy

All Windows operating systems since Windows XP have a group of configuration settings that are accessed and structured in the same way as Active Directory Group Policies. These are known as Local Group Policy.

These settings are configured per computer and there is no centralized way to manage multiple computers. If you're on a Windows computer right now, you can open the configuration of this Local Group Policy by running `Win+R` and typing `gpedit.msc`.

![Local Group Policy Editor gpedit.msc in Windows](https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-1.avif)

From this window, you can set whatever configurations you want on your computer. The changes you make apply to the entire computer, regardless of which user has logged in. Depending on the change, it may require logging in or out, or restarting the computer.

### Active Directory Group Policy

Active Directory Group Policy basically enables the availability of all local configurations but at the domain level, that is, all the configurations you could see in `gpedit.msc` on your computer are made available at the domain level so that any computer can query and apply them (as long as it's told to do so).

At the interface level, there is practically no difference between local and Active Directory policies. The only difference is a part that allows you to easily choose which users and computers the policy will be applied to. We'll see this filtering in the next article when discussing inheritance and precedence.

![Group Policy Management Console in Active Directory](https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-2.avif)

![Group Policy Editor for policy objects in Active Directory](https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-3.avif)

## Group Policy Objects (GPO)

Following the principle that in Active Directory everything is an object, _Group Policy Objects_ (GPO) are directory objects that encapsulate and store Group Policy configurations. They are the object-level representation of Group Policies.

Each GPO acts as an independent container: it has a unique name, a GUID (globally unique identifier), and custom configurations. In practice, the term "GPO" is used interchangeably to refer to the object itself or the policies it contains.

For GPOs to be applied, they must be linked to a container-type object such as:
- Domain
- Site
- Organizational Unit

When linking to one of these objects, a link is created between the GPO and the container, after which the GPO will be processed on the objects in the container according to inheritance and precedence rules that we'll see in the next article.

The linking is reflected in the `gpLink` attribute. This is an attribute that exists in all container objects of Active Directory. The value it contains are the LDAP paths of the GPOs that are linked to the container.

For example, a value of a `gpLink` attribute of a container object could be:

```ldap
[LDAP://CN={A1B2C3D4-1111-2222-3333-ABCDEF123456},CN=Policies,CN=System,DC=sevenkingdoms,DC=local;0]
[LDAP://CN={B2C3D4E5-4444-5555-6666-123456ABCDEF},CN=Policies,CN=System,DC=sevenkingdoms,DC=local;2]
```

This example value indicates in the container object:
- The order in which the GPO is applied to it
- What GPO is applied to it
- Link status

Complementing this attribute there is also `gpOptions`, present in the same container objects. This attribute controls policy inheritance.

### Components of a GPO

As mentioned in the article about [Active Directory Directory and Schema](https://blog.deephacking.tech/en/posts/directorio-y-esquema-de-active-directory/), all Active Directory objects are stored in the `NTDS.dit` database. However, GPOs use a hybrid model: one part resides in Active Directory (like any object) and the other in the `SYSVOL` shared folder to facilitate replication and distributed access by clients.

These two locations (`NTDS.dit` and `SYSVOL`) are the two main components of a GPO and are known as GPC and GPT, respectively:

#### Group Policy Container (GPC)

When a GPO is created, two things happen:

On one hand, a `GUID` is created for the GPO, which in most cases is unique; only the default domain GPOs use well-known GUIDs. Don't confuse it with the `objectGUID` GUID that all AD objects possess.

![GUID of a GPO shown in its properties](https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-4.avif)

On the other hand, an object of class `groupPolicyContainer` is created. The object is created using the GUID as its name. This object that is created is what is known as the GPC. It is stored under the following container:

```ldap
CN=Policies,CN=System,DC=your-domain,DC=com
```

![View of GPC objects from the Active Directory Users and Computers console](https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-5.avif)

The GPC stores metadata and general information about the GPO:
- Friendly name (`displayName`)
- Unique GUID of the GPO (`name`)
- Security permissions (who can read, edit, or apply)
- State (enabled or disabled for computer or user)
- Version numbers (`versionNumber`)

The GPC is replicated through standard Active Directory replication. In summary, it's the part of the GPO that lives in Active Directory.

#### Group Policy Template (GPT)

When creating a GPO, in addition to what we just mentioned, a folder is also created in `SYSVOL`:

```text
\\your-domain\SYSVOL\your-domain\Policies\{GPO-GUID}
```

![Folder structure of GPOs stored in SYSVOL](https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-6.avif)

This folder and its contents form the GPT. Here most of the actual GPO configurations are stored. It all depends on the policy type; for example, those that need applications, scripts, or files, instead of storing these elements in the `NTDS`, will use the `SYSVOL` folder.

Within a GPO folder, we can find two subfolders:
- `Machine` (computer configurations)
  - Apply to the system in general and affect all users
- `User` (user configurations)
  - Apply to all user profiles that use the computer

As indicated, these folders contain the files and configurations related to the computer configuration and user configuration of the GPO.

![Machine and User subfolders within the GPT structure in SYSVOL](https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-7.avif)

Another file we can find is `GPT.INI`. This file contains the combined version number of the Group Policy (`Version`), which internally represents both the user configuration version and the computer version. This value matches the `versionNumber` attribute in the GPC (which is also a combined value in the same way).

You may find that some tool breaks down the version into `userVersion` and `computerVersion`, but in the `GPT.INI` file and in the GPC it only appears as a single value (`version` or `versionNumber`).

Each modification of the GPO increments these values in both components (GPC and GPT). This allows clients to detect changes:

1. First they query the version in the GPC of Active Directory
2. If the version is higher than the one stored locally, they download and process the corresponding GPT to reapply the GPO

This value also serves to verify synchronization between GPC and GPT on domain controllers.

![Content of GPT.INI file showing the GPO version number](https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-8.avif)

The GPT is replicated through DFS-R (or FRS in older versions) via SYSVOL.

#### GPO, GPC and GPT

In summary:
- **GPO**: It's the complete Group Policy, the logical entity that is created and managed from the GPMC (_Group Policy Management Console_). It's the sum of GPC and GPT
- **GPC**: It's the part of the GPO stored in Active Directory
- **GPT**: It's the part of the GPO stored in `SYSVOL`

Without GPC there is no control, without GPT there is no configuration, and without both there is no GPO.

### Attributes of a GPO

Let's talk about some specific attributes that GPOs possess in Active Directory or, if we want to be technically correct, the GPCs:
- `displayName`: The friendly name of the GPO
- `name`: The unique functional GUID of the GPO (e.g., `{31B2F340-016D-11D2-945F-00C04FB984F9}`). This is the primary identifier, used as the `CN` of the object and for the folder in `SYSVOL`
- `versionNumber`: Combined version number of the GPO. You already know it's important for detecting changes and GPC-GPT synchronization
- `gPCFileSysPath`: Contains the UNC path to the GPT in `SYSVOL`: `\\domain\SYSVOL\domain\Policies\{GUID}`
- `gPCMachineExtensionNames` and `gPCUserExtensionNames`: Lists of `Client-Side Extensions (CSE)` GUIDs needed to process computer and user configurations. They indicate which client components should be activated
- `flags`: GPO state. Whether it's enabled or not, or whether the user or computer configuration is disabled
- `gPCFunctionalityVersion`: Indicates the version of the Group Policy Editor (GPE) that last created or modified the GPO. Its value is almost always 2 and mainly serves for backward compatibility
- `gPCWQLFilter`: WMI Query Language (WQL) filter to apply the GPO conditionally

![Attributes of the GPC object visualized in Active Directory](https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-9.avif)

## Conclusion

This concludes this brief introduction to Group Policies. This article is intended to be a clear and organized first approach to a topic as broad and deep as GPOs in Active Directory. It serves as a foundation for upcoming articles, where we'll go into detail about the complete application flow, client-side processing, inheritance and precedence rules, filtering, and of course, how to exploit them offensively.

## References
- [Group Policy processing on Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-processing)
- [A Red Teamer's Guide to GPOs and OUs by wald0](https://wald0.com/?p=179)
- [Group policies in cyberattacks on Securelist](https://securelist.com/group-policies-in-cyberattacks/115331/)
- [Understanding Group Policy Storage on SDM Software](https://sdmsoftware.com/whitepapers/understanding-group-policy-storage/)
- [Sneaky Active Directory Persistence Tricks on ADSecurity](https://adsecurity.org/?p=2716)
- Book _Mastering Windows Group Policy_ by Jordan Krause
- Book _Mastering Active Directory_ by Dishan Francis
