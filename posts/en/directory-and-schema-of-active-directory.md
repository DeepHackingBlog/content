---
id: "directorio-y-esquema-de-active-directory"
title: "Active Directory - Directory and Schema"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-10-16
updatedDate: 2024-10-16
image: "https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-0.webp"
description: "Explore the internal structure of Active Directory: NTDS database, naming contexts, schema, classes, attributes, and the Global Catalog to understand how information is organized and managed in AD."
categories:
  - "active-directory"
draft: false
featured: false
lang: "en"
---

In previous Active Directory articles, we've seen an introduction to its main concepts and components.
- [What is Active Directory? - Introduction](https://blog.deephacking.tech/en/posts/introduction-to-active-directory/)
- [Trusts – Active Directory](https://blog.deephacking.tech/en/posts/trusts-in-active-directory/)

We've mentioned that Active Directory works with the concept of objects and that everything is one. Now, this information must be stored somewhere, and that's exactly what we're going to see today. We're going to talk about the Active Directory database and how everything is structured.

The Active Directory database, where all its information is stored, is located in the following path on domain controllers:

```plaintext
C:\Windows\NTDS\ntds.dit
```

Each domain controller (DC) has its own copy of the Active Directory database, known as NTDS (New Technology Directory Services Directory Information Tree - NTDS.DIT). Although each DC maintains its own NTDS, they all remain synchronized through a process called replication (DCSync). This means that any change made to one controller's database, such as adding a new user or modifying a policy, is communicated to the other domain controllers so they can update their own copies. This way, it ensures that all domain controllers always have the same updated information. By default, this process occurs every 3 hours.

Knowing this, let's look at the database schema and how Active Directory is structured:

- [What is a directory service?](#what-is-a-directory-service)
- [Distinguished Names (DN)](#distinguished-names-dn)
- [RootDSE and Naming Contexts](#rootdse-and-naming-contexts)
    - [What is RootDSE?](#what-is-rootdse)
    - [Default Naming Contexts](#default-naming-contexts)
        - [Domain Naming Context](#domain-naming-context)
        - [Configuration Naming Context](#configuration-naming-context)
        - [Schema Naming Context](#schema-naming-context)
    - [Default Naming Context](#default-naming-context)
    - [Application Naming Contexts](#application-naming-contexts)
- [Global Catalog (GC)](#global-catalog-gc)
- [Active Directory Schema](#active-directory-schema)
    - [Classes](#classes)
    - [Definition of Schema Classes and Attributes](#definition-of-schema-classes-and-attributes)
    - [Properties](#properties)
- [Conclusion](#conclusion)
- [References](#references)

## What is a directory service?

In computing, when we talk about a directory service, it refers to something similar to a database, but usually a bit more complete because it tends to contain more descriptive information based on attributes. Unlike traditional databases, a directory service follows a hierarchical structure, which allows for quick queries and also organizes information in a more structured way, thus facilitating access.

One of the most well-known sets of standards for directory services is X.500. How relevant is this for us? Well, not much, beyond just knowing about it and understanding that Active Directory Domain Services (AD DS) and LDAP are based on this standard.

So, how does the Active Directory directory (AD DS) relate to LDAP?

Basically, AD DS is responsible for defining the hierarchical structure of the directory and storing all information related to the active directory network objects (users, groups, devices, etc.). And LDAP is the protocol responsible for allowing this information to be queried and managed efficiently. In summary, AD DS defines and stores, and LDAP enables the querying and access to that data. This combination is what makes **Active Directory** work effectively in enterprise network management.

## Distinguished Names (DN)

We now know how Active Directory Domain Services works and its relationship with LDAP. But how do you query or interact with an object within the directory through LDAP? What structure is followed? What parameter is responsible for this?

This is handled by the DN (Distinguished Name). The DN is a string that uniquely identifies each object within the directory, it's essentially the exact "address" of an object within the directory hierarchy. When you want to access or query an object in **AD DS** (Active Directory) through **LDAP**, you use the **DN** to refer to that object precisely.

Here's a visual example:

<figure>

![Visual example of Distinguished Name showing the hierarchy of objects in Active Directory](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-1.avif)

<figcaption>

Windows Security Internals: A Deep Dive into Windows Authentication, Authorization, and Auditing - James Forshaw

</figcaption>

</figure>

For example, if we want to refer to the user bob, their DN would be:

```plaintext
CN=bob,CN=Users,DC=mineral,DC=local 
```

Within the DN, we can find different [types of attributes defined by Microsoft](https://learn.microsoft.com/en-us/previous-versions/windows/desktop/ldap/distinguished-names):

| Attribute Name | Explanation |
| --- | --- |
| Common-Name (CN) | The name of the object in question, such as a user or device. |
| Domain Component (DC) | Defines the components of the domain name, separated by dots. For example, for "deephacking.tech", we would have "DC=deephacking, DC=tech". |
| Organizational Unit (OU) | Refers to an organizational unit within the directory structure. |

Through these attributes (which are not all but the main ones), we can define the exact address of an object within the active directory hierarchy.

In addition to the DN, there's the concept of RDN (Relative Distinguished Names). The RDN is essentially the short version of the DN, for example:

- DN

```plaintext
DN: CN=bob,CN=Users,DC=mineral,DC=local
```

- RDN:

```plaintext
RDN: CN=bob
```

From this, we can conclude that within an organization, two objects can have the same RDN, but their DNs will always be unique in the directory. However, even though the DN is always unique, it doesn't mean it's consistent, as it would change if an object is modified or deleted. To solve this, we can mention the existence of objectGUID, which is an attribute that each object has and remains the same even if the DN changes.

## RootDSE and Naming Contexts

After understanding how Distinguished Names (DN) work to identify objects within a directory, it's essential to understand two key concepts for interacting with Active Directory through LDAP:
- RootDSE
- Naming Contexts

### What is RootDSE?

RootDSE (Root Directory Server Agent Service Entry) is a special object within Active Directory that serves as an entry point when we interact with the directory using LDAP. The DSE (Directory System Agent) is the system component responsible for handling LDAP operations on the server, and RootDSE is the representation of that initial interface. Unlike other objects in Active Directory, RootDSE doesn't have an assigned Distinguished Name (DN), which means it's not part of the object hierarchy typically queried with a specific DN. This makes it globally accessible on any Active Directory LDAP server without needing to specify its location.

For example, if we want to query it using ldapsearch, we can do so as follows:

```bash
ldapsearch -x -H ldap://192.168.50.10 -b "" -s base
```

![Result of ldapsearch query to RootDSE showing available naming contexts](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-2.avif)

![Detail of RootDSE attributes in Active Directory](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-3.avif)

A key aspect is that RootDSE is anonymously accessible, allowing the reading of certain attributes. This behavior is part of Active Directory's default configuration, as RootDSE provides context information about the directory environment, such as the schema version, domain name, and server capabilities. This accessibility allows applications and services to discover the directory's structure and characteristics without needing to authenticate. However, this access is limited to non-confidential attributes.

In summary, RootDSE offers details about the directory environment, such as the different naming contexts, server capabilities, and key configurations. This allows obtaining basic information about the directory structure and the functions the server supports.

### Default Naming Contexts

Given the distributed behavior of Active Directory, it's necessary to divide the active directory data into partitions known as naming contexts (NC). Without these partitions, each domain controller would have to replicate all the forest information every time it performed a replication (**DCSync**), which would be inefficient.

In Active Directory, a domain can be considered as a data partition, also known as a **naming context (NC)**. This allows domain controllers responsible for a specific domain to replicate only the information relevant to that domain, without needing to replicate data from other domains that don't affect them.

However, there is certain data that must be replicated across **all domain controllers** within the forest, which leads to the need for several types of **naming contexts** in Active Directory.

<figure>

![Visualization of Naming Contexts in ADSI Edit showing Active Directory partitions](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-4.avif)

<figcaption>

ADSI Edit

</figcaption>

</figure>

### Domain Naming Context

The Domain Naming Context (NC) is one of the key partitions within the Active Directory structure. Each domain has its own naming context, which stores all objects specific to that domain. These objects include users, groups, computers, and security groups, and the domain's DN (Distinguished Name) acts as the primary identifier for this context.

For example, if an organization's domain is sevenkingdoms.local, its Domain Naming Context would be represented by the DN DC=sevenkingdoms,DC=local.

Each domain controller within a specific domain maintains a complete copy of the Domain Naming Context for that domain. This means that if you have a domain called north.sevenkingdoms.local, all domain controllers in that domain will replicate only the objects stored within this NC, ensuring that domain controllers only handle the data necessary for their own domain and not that of others.

### Configuration Naming Context

The Configuration Naming Context (NC) is another essential component in Active Directory, but its scope is different from the Domain NC. While the Domain NC stores domain-specific data, the Configuration NC contains the global configuration that affects the entire forest.

<figure>

![Configuration Naming Context in ADSI Edit showing forest-wide global configuration](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-5.avif)

<figcaption>

ADSI Edit - Configuration Naming Context

</figcaption>

</figure>

Unlike the Domain NC, the Configuration NC replicates to all domain controllers in the forest, ensuring that all controllers have the same configuration information.

For example, within the Configuration NC, essential data for Active Directory's global infrastructure is stored, such as replication policies and configurations for critical services like the File Replication Service (FRS), responsible for replicating SYSVOL content between domain controllers. SYSVOL is a shared directory that contains important files, such as logon scripts and group policies, which must be kept synchronized among all domain controllers. Although it's not the main focus right now, it's worth mentioning that in more recent versions of Windows Server, the Distributed File System Replication (DFSR) has replaced FRS to carry out this task.

### Schema Naming Context

The Schema Naming Context (NC) is one of the most important as it defines the **structure and rules** that determine what types of objects and attributes can be stored within the directory. We'll now see this concept in more depth, and you'll be able to better understand what is stored in this partition.

<figure>

![Schema Naming Context in ADSI Edit showing class and attribute definitions](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-6.avif)

<figcaption>

ADSI Edit - Schema Naming Context

</figcaption>

</figure>

In any case, although the schema NC also replicates among all domain controllers in the forest, it's true that here there exists a special role known as Schema Master. The Schema Master is one of the five [FSMO (Flexible Single Master Operations) roles in Active Directory](https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/fsmo-roles), and it establishes a single domain controller in the entire forest as the authority to modify the schema.

For example, when a new application that interacts with Active Directory is installed, such as Microsoft Exchange or System Center Configuration Manager (SCCM), the Active Directory schema must be extended to include new types of attributes or classes that the application needs. These changes are exclusively managed by the Schema Master.

In any case, we'll now talk again more specifically and extensively about the schema.

### Default Naming Context

The Default Naming Context refers to the default naming context that is used as a starting point for performing searches and queries within the primary domain in Active Directory.

The Default Naming Context represents the root of the current domain and acts as the place from which all operations related to searching or modifying objects in the domain are initiated. For example, if an organization's primary domain is sevenkingdoms.local, the Default Naming Context would be DC=kingslanding,DC=sevenkingdoms,DC=local. This value is obtained by querying RootDSE.

<figure>

![Default Naming Context in ADSI Edit representing the primary domain](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-7.avif)

<figcaption>

ADSI Edit - Default Naming Context

</figcaption>

</figure>

Knowing this value is crucial for administrators (and attackers), as it allows them to perform efficient queries on objects within the domain structure and properly manage the Active Directory hierarchy.

### Application Naming Contexts

In addition to the main naming contexts we've just seen, there are additional partitions known as Application Naming Contexts or application partitions. These partitions are designed to store data from specific applications or services that don't directly affect security objects, such as users or groups, and their replication can be controlled in more detail between domain controllers.

Unlike the main naming contexts, Application Naming Contexts don't have to replicate to all domain controllers. Instead, their replication can be configured selectively, replicating only among domain controllers specifically chosen to manage this data.

Two common examples of Application Naming Contexts that are automatically generated when DNS is integrated with Active Directory are DomainDnsZones and ForestDnsZones. Both naming contexts are used to store information related to DNS zones and their replication:
- **DomainDnsZones**: This partition contains DNS data specific to each domain in Active Directory. It replicates only among domain controllers managing that particular domain.
- **ForestDnsZones**: This partition is used to store DNS data at the forest level, allowing DNS information shared by all domains in the forest to replicate to all domain controllers.

For example, in the initial image we can visualize these two NCs because DNS is integrated and managed by the active directory:

![Application Naming Contexts DomainDnsZones and ForestDnsZones in ADSI Edit](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-8.avif)

In addition to these two examples, any administrator can create their own custom application partitions to be used by specific applications that require data replication among a select number of domain controllers.

## Global Catalog (GC)

All information organized in the data partitions (Naming Contexts) of Active Directory can be accessed efficiently at the forest level thanks to the Global Catalog (GC). The GC is a partial distributed database hosted on servers designated as Global Catalog Servers, which are typically domain controllers configured to fulfill this function. The first domain controller in a forest automatically becomes a Global Catalog Server, and other domain controllers can be promoted to perform this role. It's not necessary for all domain controllers to be Global Catalog Servers by default, but having several can optimize performance in geographically distributed environments.

These servers contain a complete copy of all objects in the domain where they're located and a partial, read-only copy of all objects from other domains in the forest. It's important to note that the GC's partial replica includes a copy of all forest objects, but only a subset of their attributes. In other words, it stores all objects, but only those attributes marked as critical or necessary for common searches.

The attributes included in the GC are determined in the Active Directory schema (which we'll discuss later) and are marked with the isMemberOfPartialAttributeSet property. These attributes don't necessarily have to be the most frequently used, but rather those designated for the efficient functioning of the directory and global searches. Some examples of these attributes might be usernames, email addresses, etc.

In summary, unlike Naming Contexts, which contain all object attributes, the GC only stores those attributes that are critical for searching and access. This way, the GC optimizes performance by avoiding replicating unnecessary data and allows applications and users in one domain to query objects from other domains within the same forest through the Global Catalog Server.

Some of the most important functions performed by the Global Catalog are:
- Forest-wide search: The GC allows users and applications to perform searches throughout the entire forest, regardless of the domain in which the object resides. For example, if an employee from "spain.deephacking.local" needs to find a specific attribute of another employee located in "uk.deephacking.local", they can search directly in their domain's directory thanks to the GC.
- User Principal Name (UPN) authentication: The GC is essential for authenticating users through their _User Principal Name (UPN)_, especially when the user account is in a different domain from the controller processing the login request. For example, if "user@uk.deephacking.local" attempts to log in to a computer within "spain.deephacking.local", the local domain controller will query the GC to authenticate the user correctly.
- Validation of references to objects in other domains: Domain controllers use the GC to validate references to objects residing in other domains. For example, if in "spain.deephacking.local" there's a group that includes a user from "uk.deephacking.local" as a member, the domain controller needs to query the GC to validate that reference and ensure the user still exists and has appropriate permissions.
- Universal group membership: In multi-domain environments, the GC is the only place where domain controllers can query whether a user belongs to universal groups. For example, if a user from "spain.deephacking.local" is a member of a universal group that grants access to resources in "uk.deephacking.local", during login, the domain controller will query the GC to obtain this information and ensure the user has the necessary permissions.

> When we refer to a domain controller querying the GC, we mean that the domain controller will attempt to contact a Global Catalog Server available in its **_[same Active Directory site](https://blogs.manageengine.com/active-directory/2022/07/25/active-directory-sites-in-a-nutshell.html)_**, regardless of the domain that GC belongs to. If there's no GC available in the local site or connectivity is interrupted, the domain controller is designed to contact a GC in **another site** within the same forest.

In any case, these functions we've just seen are essential in multi-domain environments. For example, imagine an environment with the domains "spain.deephacking.local" and "uk.deephacking.local". If a user in the "spain" domain needs information about a user in "uk", the Global Catalog will allow finding this information quickly without having to directly query the "uk" domain controllers. Additionally, if the user from "spain" logs in with a UPN and their account is in "uk", the "spain" domain controller will contact the GC to authenticate the user correctly.

To conclude, from an infrastructure design perspective (or for us to understand one from an offensive point of view), it's important to optimize the location of Global Catalog Servers in geographically distributed environments. They should be located in sites with many users or with frequent interdomain queries, as this improves efficiency and reduces latency in searches and authentications. However, the number of GCs in the network must be balanced to avoid excess replication traffic that could affect performance.

## Active Directory Schema

Alright, we've already seen what the directory is within the active directory, as well as several concepts like naming contexts (which relate to LDAP) and the global catalog. Now, for everything to make sense, one more concept is missing: the schema (which we've mentioned minimally in the Schema NC).

The schema is like a reference framework that defines both the **object classes** (for example, users, groups, printers) and the **attributes** that those objects can or must have. Some of these classes or attributes are based on standards. You can think of the schema as a "mold".

These classes and attributes are essential for Active Directory to function correctly, as they provide the necessary structure for the directory to know what type of information it can store and how it should present it. Each object in the directory must follow the rules established by the schema. For example, if we create an object of type "user", the schema defines that this object must have mandatory attributes like "name" and "password", and may have optional attributes like "phone number" or "email address".

It's important to note that the **Active Directory** schema is **extensible**, meaning new object classes or attributes can be added as necessary to adapt, although this happening is not common. Nobody dares to edit the schema, at least from my experience.

Although it is true that the schema is usually modified by Microsoft when they release a new version of Windows Server. We can observe the version using the following command:

PowerShell

```
PS C:\Users\robb.stark> Get-ItemProperty 'AD:\CN=Schema,CN=Configuration,DC=sevenkingdoms,DC=local' -Name objectVersion

objectVersion : 88
PSPath        : Microsoft.ActiveDirectory.Management.dll\ActiveDirectory:://RootDSE/CN=Schema,CN=Configuration,DC=sevenkingdoms,DC=local
PSParentPath  : Microsoft.ActiveDirectory.Management.dll\ActiveDirectory:://RootDSE/
PSChildName   : CN=Schema,CN=Configuration,DC=sevenkingdoms,DC=local
PSDrive       : AD
PSProvider    : Microsoft.ActiveDirectory.Management.dll\ActiveDirectory

PS C:\Users\robb.stark>
```

These are the schema versions according to the Windows Server version:

<figure>

![Table of Active Directory schema versions by Windows Server version](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-9.avif)

<figcaption>

[Active Directory Schema Versions - Microsoft Learn](https://learn.microsoft.com/es-es/windows-server/identity/ad-ds/deploy/find-active-directory-schema)

</figcaption>

</figure>

For example, we can observe that between Windows Server 2019 and Windows Server 2022, there were no modifications, at least at the schema level.

So, in summary, we must understand that while the **directory** is where objects and their data are stored, the **schema** defines the rules that those objects must follow, ensuring that everything is structured coherently within **Active Directory**.

### Classes

Within the schema we've just discussed, various [object classes in Active Directory](https://docs.microsoft.com/en-us/windows/win32/adschema/classes) are defined that organize the information stored in the directory. Each class not only organizes objects but also defines what attributes each object can or must have within the directory. Additionally, it determines how classes relate to each other. For example, some of the most common classes are [User class](https://docs.microsoft.com/en-us/windows/win32/adschema/c-user), [Group class](https://docs.microsoft.com/en-us/windows/win32/adschema/c-group), and [Computer class](https://docs.microsoft.com/en-us/windows/win32/adschema/c-computer), each designed to represent a particular type of object within the network. In this way, we can indicate that each object in the active directory is an instance of a schema class.

Additionally, a class can be a subclass if it derives from a parent class, which causes the subclass to inherit the attributes of the parent class. For example, the Computer class is a subclass of the User class, which allows computer-type objects to share attributes with user-type objects. In addition to inheriting attributes from the User class, the Computer class can have its own additional attributes, such as ipHost in the case of the Computer class.

All existing classes in Active Directory are subclasses of a base class called [Top class](https://docs.microsoft.com/en-us/windows/win32/adschema/c-top). The Top class provides a common structure by defining essential attributes that all objects share, such as ObjectClass and ObjectGUID.

The ObjectClass attribute records a list of all classes to which an object belongs, including its current class and all parent classes. This helps categorize and understand the hierarchy and type of each object. On the other hand, we already know about ObjectGUID because we mentioned it before. This attribute contains the [Globally Unique Identifier (GUID) according to the UUID standard](https://en.wikipedia.org/wiki/Universally_unique_identifier), a unique identifier assigned to each object in the Active Directory database. This GUID ensures that each object can be uniquely identified.

Finally, classes can be associated with auxiliary classes to inherit additional attributes. Unlike a principal class, an auxiliary class doesn't define a complete object by itself. Instead, it provides additional attributes that can be incorporated into other principal classes. In other words, auxiliary classes don't create instances of objects in the directory, but rather extend the capabilities of other classes by associating with them.

For example, the auxiliary class [Security-Principal](https://docs.microsoft.com/en-us/windows/win32/adschema/c-securityprincipal) defines attributes such as SAMAccountName, which is fundamental for account management. This attribute is present in objects like users and groups, which belong to the User and Group classes, respectively. This means that the Security-Principal auxiliary class is associated with the User and Group classes to provide them with this additional attribute (among others). It's important to note that auxiliary classes don't appear directly in the object's ObjectClass property.

Finally, here are a couple of examples of the ObjectClass attribute in a user object and a computer object:

```powershell
PS C:\Users\robb.stark> Get-DomainUser robb.stark -Properties objectclass | select -ExpandProperty objectclass
top
person
organizationalPerson
user
PS C:\Users\robb.stark>
```

```powershell
PS C:\Users\robb.stark> Get-DomainComputer winterfell -Properties objectclass | select -ExpandProperty objectclass
top
person
organizationalPerson
user
computer
PS C:\Users\robb.stark>
```

We can observe how the computer object has the Computer class, as we had previously mentioned.

<figure>

![Diagram of class inheritance in Active Directory showing relationship between Top, User, and Computer](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-10.avif)

<figcaption>

Windows Security Internals: A Deep Dive into Windows Authentication, Authorization, and Auditing - James Forshaw

</figcaption>

</figure>

### Definition of Schema Classes and Attributes

We can find the schema in the following directory path:

```plaintext
cn=schema,cn=Configuration,dc=sevenkingdoms,dc=local
```

![Structure of Active Directory schema in ADSI Edit showing classSchema and attributeSchema](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-11.avif)

> Note: although in the DN we can see that it seems the Schema NC is part of the Configuration NC, it's not, they are completely independent partitions.

Here we can find all the definitions of active directory classes and attributes.

In the Active Directory schema, as shown in the image, we can see it's composed of two main types of objects: **classSchema** and **attributeSchema**. These objects define, respectively, the object classes (such as the User or Computer class I mentioned previously) and the attributes (such as SID, objectGUID, etc.) that objects can have.

Let's look at an example to understand it well. Here we see my current user object:

```powershell
PS C:\Users\robb.stark> Get-DomainUser -Identity robb.stark

logoncount            : 5399
badpasswordtime       : 12/31/1600 4:00:00 PM
description           : Robb Stark
l                     : Winterfell
distinguishedname     : CN=robb.stark,CN=Users,DC=north,DC=sevenkingdoms,DC=local
objectclass           : {top, person, organizationalPerson, user}
lastlogontimestamp    : 7/24/2024 3:29:17 AM
name                  : robb.stark
objectsid             : S-1-5-21-2645935458-595591891-1233751793-1113
samaccountname        : robb.stark
lastlogon             : 7/31/2024 2:42:08 PM
codepage              : 0
samaccounttype        : USER_OBJECT
accountexpires        : NEVER
countrycode           : 0
whenchanged           : 7/24/2024 10:29:17 AM
instancetype          : 4
objectguid            : 73fde0a4-2653-4296-9a6a-fc1e51b399c3
sn                    : Stark
lastlogoff            : 12/31/1600 4:00:00 PM
objectcategory        : CN=Person,CN=Schema,CN=Configuration,DC=sevenkingdoms,DC=local
dscorepropagationdata : {6/9/2024 4:19:47 PM, 6/9/2024 4:14:24 PM, 6/9/2024 4:14:21 PM, 1/1/1601 6:16:32 PM}
givenname             : Robb
admincount            : 1
memberof              : {CN=Stark,CN=Users,DC=north,DC=sevenkingdoms,DC=local, CN=Administrators,CN=Builtin,DC=north,DC=sevenkingdoms,DC=local}
whencreated           : 6/9/2024 4:01:39 PM
badpwdcount           : 0
cn                    : robb.stark
useraccountcontrol    : NORMAL_ACCOUNT, DONT_EXPIRE_PASSWORD
usncreated            : 13367
primarygroupid        : 513
pwdlastset            : 6/9/2024 10:28:18 AM
usnchanged            : 65571

PS C:\Users\robb.stark>
```

We can see that the object:
- Belongs to the User class (can be seen in the objectclass attribute)
- Has different attributes: description, objectclass, samaccountname, etc.

Well, all of this, both the User class and each attribute we can visualize, are defined in the schema. For example, the User class:

![Definition of the User class in the Active Directory schema](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-12.avif)

There it is. Now, the attribute, for example, samaccountname:

![Definition of the samaccountname attribute in the Active Directory schema](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-13.avif)

It's there too.

As I said, everything is defined in the schema.

It's funny because the attribute objects themselves (attributeSchema) have attributes. Although in this case, we'll call these "second attributes" properties.

These attribute properties are also defined in the schema and we can find them. For example, one attribute property would be cn:

![cn property of an attribute in Active Directory](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-14.avif)

Well, this property can also be found in the schema because ultimately, it's an attribute of the attributeSchema type object:

![Definition of cn as an attribute of attributeSchema in the schema](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-15.avif)

### Properties

As we've already seen, each class can have several properties or attributes. Therefore, objects (instances of classes) have several properties or attributes. Generally, any domain user has permissions to read most domain objects, but there are important exceptions. An obvious example is that user passwords cannot be read for obvious (security) reasons.

For example, among the properties defined in the database, there are UserPassword and UnicodePwd. Although these properties exist, they cannot be read by any user. They can only be overwritten in cases such as password changes, but their stored values cannot be accessed.

This type of restriction on sensitive properties doesn't only apply to passwords. In Active Directory, there are other properties that contain confidential information, and their access must be controlled similarly. To protect this sensitive data, Active Directory uses an attribute called SearchFlags, which is defined individually for each property within the schema.

For example, the value 128 in SearchFlags marks a property as confidential, which means that, in addition to general read permissions, the user must have CONTROL_ACCESS rights to be able to read it.

We can obtain properties marked as confidential through the following query:

```powershell
PS C:\Users\robb.stark> Get-ADObject -LDAPFilter "(searchflags:1.2.840.113556.1.4.803:=128)" -SearchBase "CN=Schema,CN=Configuration,DC=sevenkingdoms,DC=local" | Select Name

name
----
ms-TPM-Owner-Information-Temp
ms-Kds-KDF-AlgorithmID
ms-Kds-KDF-Param
ms-Kds-SecretAgreement-AlgorithmID
ms-Kds-SecretAgreement-Param
ms-Kds-PublicKey-Length
ms-Kds-PrivateKey-Length
ms-Kds-RootKeyData
ms-Kds-Version
ms-Kds-DomainID
ms-Kds-UseStartTime
ms-Kds-CreateTime
ms-FVE-RecoveryPassword
ms-FVE-KeyPackage
ms-TPM-OwnerInformation
ms-DS-Transformation-Rules-Compiled
ms-PKI-Credential-Roaming-Tokens
ms-DS-Issuer-Certificates
ms-PKI-RoamingTimeStamp
ms-PKI-DPAPIMasterKeys
ms-PKI-AccountCredentials
UnixUserPassword

PS C:\Users\robb.stark>
```

> From the query used, the only thing that might not be understood is the set of numbers 1.2.840.113556.1.4.803. This set of numbers corresponds to an OID (Object Identifier) and is associated with a matching rule in LDAP. You can get more information about [LDAP Matching Rules (extensibleMatch) on Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/4e638665-f466-4597-93c4-12f2ebfabab5)
> 
> Additionally, we can observe the := operation. This operation basically searches by match. We can see more information about the [search filter syntax in LDAP](https://learn.microsoft.com/en-us/windows/win32/adsi/search-filter-syntax)

To ensure more precise control over some sensitive properties, Active Directory also implements the concept of Validated Writes. These properties require certain specific conditions to be met before they can be modified. For example, when you want to change an attribute related to an account's services (such as the login name), Active Directory verifies that the change meets certain rules or validations. This ensures that modifications don't compromise the integrity of the system or directory data.

Basically, Validated Writes acts as an additional layer of security that prevents incorrect or unauthorized changes to important properties, ensuring that the proposed change is valid and safe before allowing it.

On the other hand, to simplify permission management over properties, Active Directory offers the possibility of using Property Sets. A Property Set is a collection of related properties that can be managed together instead of individually. Instead of assigning permissions for each property separately, which can be a tedious task in an environment with many properties, administrators can group properties that have a functional relationship and assign permissions to the entire set at once.

For example, a Property Set could include all properties related to user account management, such as name, email address, and login identifier. This is especially useful in large or complex environments, where there are many properties to manage. Property Sets allow for more efficient administration and less prone to errors in permission configuration.

## Conclusion

Wow, it's been quite a lengthy discussion, but the directory and schema of an active directory is no small matter. In day-to-day work, you certainly might not have to keep all these things in mind. I mean, if you find an administrator credential in a shared resource and compromise the domain, well, you didn't have to apply much theory, right? xD

In any case, knowing all this information, or at least being aware of its existence, can be great when you want to understand the active directory concept in depth and how everything really works and is structured.

I hope you enjoyed it!

## References
- [Attacking Active Directory: 0 to 0.9 - Database](https://zer1t0.gitlab.io/posts/attacking_ad/#database)
- [Active Directory O'Reilly - 5th Edition](https://www.oreilly.com/library/view/active-directory-5th/9781449361211/)
- [Introduction to Active Directory Domain Services](https://learn.microsoft.com/es-es/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview)
- [Global Catalog: Concepts and Functions](https://pablodiloreto.com/articulo-active-directory-domain-services-catalogo-global-global-catalog-conceptos-y-funciones/)
- [Windows Server. What is the Global Catalog?](https://www.kalerolinex.com/archives/windows-server-que-es-el-catalogo-global/)
