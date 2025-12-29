---
id: "permisos-sgid-suid-stickybit"
title: "SGID, SUID, and Sticky Bit Permissions on Linux"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-01-17
updatedDate: 2022-01-17
image: "https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-0.webp"
description: "Complete guide to special permissions on Linux: SGID, SUID, and Sticky Bit. Learn how they work, how to identify them, and the behaviors of UID and GID in the system."
categories:
  - "linux"
draft: false
featured: false
lang: "en"
---

Everyone knows the classic Linux permissions: read (r), write (w), and execute (x). However, there are other special permissions that we're going to be talking about today. We're also going to be looking at important details about permissions in general and how the possible behaviors of User ID or Group ID can affect us.

Table of Contents:

- [Mini-fundamentals of Linux Permissions](#mini-fundamentals-of-linux-permissions)
- [SGID Permission](#sgid-permission)
- [SUID Permission](#suid-permission)
- [Sticky Bit](#sticky-bit)
- [UID and GID Behaviors](#uid-and-gid-behaviors)
- [References](#references)

## Mini-fundamentals of Linux Permissions

Although permissions may seem very simple, it's true that they have little details that need to be known for complete understanding. First of all, here's their structure:

![Linux permissions structure showing SGID, SUID, and Sticky Bit](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-1.avif)

This is the most basic and surely we all know it (if not, no worries, you just learned it).

Knowing this, let's talk about precedence in permissions. For example, if I, being the user sikumy, create a file called texto.txt, I can read it without problems and do whatever I want with it:

![File creation with default permissions](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-2.avif)

As we can see, the file is created with the owner and group values set to sikumy. Everything is good so far, but now, what happens if I assign 070 permissions? That is, nobody has any permission except people who belong to the sikumy group, who will have everything. Will I be able to read the file, being sikumy myself, and although it sounds redundant, belonging to the sikumy group?

![Read denial with 070 permissions](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-3.avif)

Well, the answer is no, despite being in the group, the permissions assigned to it are not applied to me. However, if I am another user, for example, the user Coldd, and I belong to the sikumy group, I will be able to read it:

![User Coldd reading file with group permissions](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-4.avif)

This happens because of the precedence of permissions. The best way to understand it is as follows:

- Reading the file permissions from left to right, we ask ourselves the following:
- Am I the owner of the file? If I am, the owner's permissions apply to me. If not:
- Am I a member of the file's group? If I am, the group's permissions apply to me. If not:
- The others' permissions would be the ones applied to me

That's why, in the first case, even though the user sikumy is part of the group with the same name, they won't be able to read the file, because being the owner, the owner's permissions apply to them. The opposite for user Coldd, since they're not the owner, the group permissions will apply to them because they're a member of the group, if they weren't, the "Others" permissions would apply.

## SGID Permission

The SGID permission is related to groups and has two functions:

- If set on a **file**, it allows any user to execute the file as if they were a member of the group that the file belongs to.
- If set on a **directory**, any file created in the directory will be assigned the directory's group as its belonging group.

For directories, the logic of SGID and the reason for its existence is in case we work in a group, so that everyone can access the files of other people. If SGID didn't exist, each person every time they created a file would have to change it from their own group to the common group of the project. Likewise, we avoid having to assign permissions to "Others".

Now, how do we identify the SGID permission?

When the SGID permission is assigned, we can notice it because in the permissions, in the group part, an `s` will be assigned to the execute permission. Be careful, here we need to make two distinctions:

- If the file has execute permissions, it will be assigned a lowercase `s`.

![SGID with execute permissions - lowercase s](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-5.avif)

- If the file does NOT have execute permissions, it will be assigned an uppercase `S`.

![SGID without execute permissions - uppercase S](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-6.avif)

This really has no relevance for directories, only for files. In any case, this characteristic of uppercase or lowercase `s` depending on the execute permission always applies, including in the SUID permission.

All this is very nice and all, but how do we activate SGID?

To activate it, we can use either of the following two commands:

- `chmod g+s <file>`
- `chmod 2*** <file>`

Where `*` represents the normal permissions. (Example: `chmod 2755`)

## SUID Permission

The SUID permission allows a file to be executed as if it were the owner, regardless of which user executes it, the file will be executed as the owner. Example:

![Example of execution with SUID permission](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-7.avif)

By assigning SUID permissions, the output of the whoami command has changed from being sikumy to being root. This is because, as we can see, the owner of the whoami binary is root. Therefore, exactly the definition we gave above is happening.

However, one thing to keep in mind and quite important is that the SUID permission doesn't work on scripts, it only works on compiled binaries. This is done for security reasons. In any case, if you wanted to enable the execution of a script as another user, you can always use sudo.

We've already seen it above, but the way to identify the SUID permission is through an `s` in the execute permission of the owner's permissions. The same thing we mentioned in SGID applies here, if the owner doesn't have execute permissions but does have SUID permission, it will be shown as an uppercase `S`, otherwise lowercase, which is how it should be.

**And what happens with the SUID permission on directories?**

SUID doesn't apply to directories because there's no convincing reason why it should. It can't work the same way as SGID. Linux doesn't allow a user to give a file to another user, the only one capable of doing this is root. That is, if I am the user sikumy, even though I am the owner of a file, I won't be able to use chown to give the file to the user JuanSec, this action can only be done by root.

**How do we activate SUID?**

We can do it with either of the following two commands:

- `chmod u+s <file>`
- `chmod 4*** <file>`

Where `*` represents the normal permissions (Example: `chmod 4755`).

## Sticky Bit

The Sticky Bit permission can be applied to both files and directories. Although it's most common to apply it to directories. The functions of this permission are as follows:

- At the directory level, it restricts the deletion and modification of files in the directory to all users even if they have write permissions, except for the file owner and root. Example:

![Sticky Bit blocking file deletion](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-8.avif)

Despite the user Coldd having write permissions, they are unable to delete the file because they are neither the owner nor root.

- If this permission is applied to an executable file, the first time it's executed, a copy of the program's text is stored in the swap area ([swap space](https://es.wikipedia.org/wiki/Espacio_de_intercambio)), so that the next time the program is executed in memory, it does so faster. By program text, we mean the machine code instructions of the program. (It's not very common to use this permission on files)

**How do we identify it?**

If we assign the Sticky Bit to either a file or a directory, when viewing the permission with `ls -l`, it will look like this:

`rwxrwxrwt`

Note the "`t`" at the end.

**How do we activate STICKY BIT?**

Well, we can use either of the following two commands:

- `chmod +t <file>`
- `chmod 1*** <file>`

Where `*` represents the normal permissions. (Example: `chmod 1755`).

> Note how each permission, SUID, SGID, and Sticky Bit, has an octal value, just like normal permissions. In this case it would be as follows:
> 
> 1 --> Sticky Bit  
> 2 --> SGID  
> 4 --> SUID  
> 7 --> All of the above

## UID and GID Behaviors

Lastly, this post doesn't make sense to talk about permissions if we don't talk about User and Group IDs. To begin with, you need to know that all system users have an identifier (UID), we can check it in the /etc/passwd file:

![/etc/passwd file showing user UIDs](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-9.avif)

Likewise, groups also have identifiers, we can check it in the /etc/group file:

![/etc/group file showing group GIDs](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-10.avif)

Knowing this, we can distinguish at a practical level three UID behaviors:

- Real User ID (RUID) --> Identifies the owner of the current process.
- Effective User ID (EUID) --> Used to manage access to a resource. It's also what's taken into account to determine the owner of a file when it's created. Basically, it determines what we can do, what we can access, etc. You could say that, at a practical level, "we are the user indicated by the EUID".
- Saved User ID (SUID / Saved-User-ID) --> Used in files. It allows the process to change its EUID. When the process changes its EUID, the EUID before changing it is stored in the SUID so that when the process ends, it can return to its original EUID.

> Note: just as these three UID behaviors exist, the same happens with the GID (Group ID). So, with the same definition but for groups, there are: RGID, EGID, and SGID.

All processes have two UIDs and two GIDs (real and effective). Normally, when we execute a program, the real UID and GID will be the same as the effective UID and GID. However, if that program has SUID activated, the effective UID will change. Likewise, if it has the SGID permission active, the effective GID will change.

Let me explain, if I am the user sikumy and there's a binary with SUID whose owner is root, when I execute it, my real UID will still be sikumy's, however, the effective UID will be root's.

The effective UID, as mentioned, is what determines the access and privileges of a process. For example, if only whoever has UID 22 can access a file, if your RUID is 22 but your EUID (UID) is 35, you won't be able to read it.

We can see more clearly the distinction between UIDs with the following C program:

<figure>

![C code to show RUID and EUID](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-11.avif)

<figcaption>

Don't forget it needs to be compiled with gcc

</figcaption>

</figure>

So you can copy it:

```c
#include <stdio.h>
#include <unistd.h>
#include <pwd.h>

int main(void){

    struct passwd *r_pwd = getpwuid(getuid());
    printf("The Real User (RUID) is %s\n", r_pwd->pw_name);

    struct passwd *e_pwd = getpwuid(geteuid());
    printf("The Effective User is %s\n", e_pwd->pw_name);

}
```

This program shows us the RUID and EUID when we execute it. The owner and group of the respective binary is sikumy:

![Binary permissions without SUID](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-12.avif)

Right now the file doesn't have any special permission like SUID, so if the user Coldd executes it:

![Execution without SUID showing Coldd as RUID and EUID](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-13.avif)

It will show that both the real and effective user is Coldd. However, if now the user sikumy assigns SUID permissions, the effective user when Coldd executes it should be sikumy:

![SUID permission assignment to binary](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-14.avif)

![Execution with SUID showing sikumy as EUID](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-15.avif)

It indeed changes. The RUID is the user Coldd because they're the one who starts the process, however, at a practical level and for accessing resources and so on, it will be as if we were the user sikumy.

And this is basically the idea of the different UIDs we can find. It's important to know this, as it can help us better understand the Linux system itself or help us in some situation we might encounter.

The most evident example of better understanding the Linux system has to do with the passwd binary. This binary has the SUID permission assigned by default:

![passwd binary with SUID permission](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-16.avif)

It makes sense, since the only one who can change passwords on the system is root.

Now, with the definitions we have, we can think:

- Hey, but if the binary has SUID permission and the owner is root, when I execute it, why am I not changing root's password instead of mine?

Well, it's a fairly simple reason that we can understand thanks to UIDs. It's true that when executing the passwd binary, our EUID will be root's. However, the binary, to determine which user's password to change, looks at the RUID, which is still me, the normal user.

So in conclusion, we're able to change the password thanks to the EUID, and we don't change root's password because the binary looks at the RUID to see which user's password to change.

## References

- [SUID bit on directories](https://superuser.com/questions/1013867/suid-bit-on-directories)
- [SUID doesn't work in Bash](https://stackoverflow.com/questions/25001206/suid-doesnt-work-in-bash)
- [SUID, SGID Explained](https://www.cs.du.edu/~ramki/courses/security/forensics/notes/SUID.pdf)
- [Why can't an SGID program read a file from the same group if it's used by another user?](https://unix.stackexchange.com/questions/178381/why-cant-an-sgid-program-read-a-file-from-the-same-group-if-its-used-by-anothe)
- [Why can't I read a file when I have group permissions](https://superuser.com/questions/549955/why-cant-i-read-a-file-when-i-have-group-permissions)
- [Precedence of user and group owner in file permissions](https://unix.stackexchange.com/questions/134332/precedence-of-user-and-group-owner-in-file-permissions)
- [Difference between Real User ID, Effective User ID and Saved User ID](https://stackoverflow.com/questions/32455684/difference-between-real-user-id-effective-user-id-and-saved-user-id)
- [UNIX Concepts And Applications](https://books.google.es/books?id=qX3CCAnjSPwC&pg=PA180&dq=effective+uid&hl=es&sa=X&ved=2ahUKEwi7kbDq1ar1AhUJzhoKHSrSCCEQ6AF6BAgIEAI#v=onepage&q=effective%20uid&f=false)
- [SUID bit on binary file still yielding "Permission denied" error](https://unix.stackexchange.com/questions/401351/suid-bit-on-binary-file-still-yielding-permission-denied-error)
- [Brief Overview of Real and Effective IDs in Linux C](https://aljensencprogramming.wordpress.com/2014/04/23/brief-overview-of-real-and-effective-ids-in-linux-c/)
- [Advanced Programming in the UNIX Environment](https://books.google.es/books?id=kCTMFpEcIOwC&pg=PA108&dq=sticky+bit&hl=es&sa=X&ved=2ahUKEwikx-vKm631AhWsy4UKHcMUAxgQ6AF6BAgFEAI#v=onepage&q=sticky%20bit&f=false)
