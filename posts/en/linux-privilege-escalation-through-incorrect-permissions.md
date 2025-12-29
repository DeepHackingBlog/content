---
id: "escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux"
title: "Linux Privilege Escalation Through Incorrect Permissions"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-08-29
updatedDate: 2022-08-29
image: "https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-0.webp"
description: "Complete guide on Linux privilege escalation by exploiting incorrect permissions on critical files like /etc/shadow, /etc/passwd, and /etc/sudoers."
categories:
  - "linux"
draft: false
featured: false
lang: "en"
---

One of the most typical forms of privilege escalation consists of misconfiguring file or directory permissions. For this reason, in this post we'll explore how to enumerate resources with permissions that interest us, and exploit the most common ones.

Table of Contents:

- [Manual Enumeration](#manual-enumeration)
- [Read Permissions](#read-permissions)
    - [/etc/shadow](#read-shadow)
    - [Other resources](#read-other-resources)
- [Write Permissions](#write-permissions)
    - [/etc/shadow](#write-shadow)
    - [/etc/passwd](#write-passwd)
    - [/etc/sudoers](#write-sudoers)
    - [Other resources](#write-other-resources)
- [References](#references)

## Manual Enumeration

Each machine's filesystem is different, not counting the base structures of the operating system itself. For this reason, although we'll verify some typical files that we'll see later, it's important to know how to perform a global enumeration of files that have specific permissions. To do this, we can use various commands:

- Search for writable files in the root directory:

```bash
find / -maxdepth 1 -writable -type f
```

- `/` → We specify the directory from where we want to start the search.
- `-maxdepth 1` → We indicate that we only want the search to reach the first level, that is, only the files and folders found in the directory we specified, and not recursively. Similarly, we can specify more levels, 2, 3, etc. If we don't include this argument, the search would be done recursively.
- `-writable` → We filter by files and directories that have write permission for our user.
- `-type f` → We limit the search exclusively to files.

- Search for readable files:

```bash
find /etc -maxdepth 1 -readable -type f
```

- `-readable` → We filter by files and directories that have read permission for our user.

- Search for all writable directories:

```bash
find / -executable -writable -type d
```

- `-executable` → We filter by files and directories that have execute permission for our current user.
- `-type d` → We limit the search exclusively to directories.

With the find command and its different arguments, we can fine-tune searches quite easily and comfortably. These three commands can generally help us enumerate interesting files and directories on a system. For example, we can imagine the situation where with the third command, we enumerate a /var/backups directory where the root user executes a cron task every so often that compresses using zip and a wildcard. You may not yet know the privilege escalation I just mentioned, we'll see that in another post, so don't worry! Similarly, imagine that with the first command we find a script that the root user executes every so often, and we have write privileges on that script. Well, there would be a privilege escalation vector, just like the first case.

With these two examples, the purpose of enumerating files and directories based on permissions is clear. Now let's look at some typical file cases that, if they have excessive permissions, might provide us with a way to become root.

## Read Permissions

##### /etc/shadow

Taking advantage of the commands we've seen previously, for example, let's enumerate the readable files within the /etc folder:

![Enumeration of readable files in /etc](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-1.avif)

In this case, we can see that our user has read permissions on the /etc/shadow file:

![Read permissions on /etc/shadow](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-2.avif)

Having visibility into this file allows us to see the password hashes of users, so we can copy them and try to crack them.

The type of algorithm the hash uses will depend on each system. The best way to determine which it is, is to look at the first letters, in this case $y$, and then google about what type of hash it could be. A good resource is [Hashcat's wiki with hash examples](https://hashcat.net/wiki/doku.php?id=example_hashes).

Setting that aside, having the root user's hash obtained from reading /etc/shadow, we can try to crack it:

![Hash cracking with hashcat](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-3.avif)

And if we're lucky, we'll have obtained the corresponding credentials, in this case, root's.

##### Other resources

Taking advantage of read permissions isn't limited to the /etc/shadow file. It really applies to any file that could be useful to us, this will depend entirely on each system, personal files on that system, etc. In any case, other resources where it's good to check what files might exist are:

- `/tmp`
- `/opt`
- `/mnt`
- `/var/tmp`
- `/var/backups`
- `/var/mail`
- `/var/spool/mail`
- `/etc/exports`
- `/home/<other user>/.ssh`

And in all these cases, and really any case, let's not forget to check hidden files and directories.

## Write Permissions

##### /etc/shadow

As before, we can take advantage of the commands seen at the beginning to enumerate all files located in the /etc folder where we have write permissions:

![Enumeration of writable files in /etc](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-4.avif)

We have write permissions on the /etc/shadow file:

![Write permissions on /etc/shadow](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-5.avif)

So the idea is that by having write capability, we can change the password hash of users, and therefore change users' passwords.

To generate hashes, we can use mkpasswd:

```bash
mkpasswd <password>
```

![Hash generation with mkpasswd](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-6.avif)

With this generated hash, we replace the hash that the root user already has:

![Editing the /etc/shadow file](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-7.avif)

![Verification of password change](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-8.avif)

This way, the user will now have the password we just set, and we've taken advantage of write permissions on this file.

##### /etc/passwd

If we enumerate the files again:

![Write permissions on /etc/passwd](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-9.avif)

In this case, we can observe that the sikumy user has write permissions on the /etc/passwd file. Taking advantage of this is quite similar to what we did with /etc/shadow. The idea is to generate the password that we want to assign to the corresponding user, normally root:

```bash
openssl passwd <password>
```

![Hash generation with openssl](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-10.avif)

This command generates the password in [crypt format](https://unix.stackexchange.com/questions/510990/why-is-the-output-of-openssl-passwd-different-each-time). This is a valid format for what we want to accomplish. Now, having this password, the idea is to replace the x of the user whose password we want to change in the /etc/passwd file:

![Original content of /etc/passwd](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-11.avif)

![Modification of /etc/passwd file](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-12.avif)

This way, when we do, for example, su root, the system will search for the user in the /etc/passwd file, and once it has found it, instead of going to the /etc/shadow file to see the password hash (which is what it would do if the x were there). The system will say, I have the hash here, so I'll validate it with this one and not check /etc/shadow. This way, the root user's password will have been changed because our password takes precedence over the original.

##### /etc/sudoers

Another typical file that we can take advantage of if we have write permissions is the sudoers file. This file defines sudo privileges on the system. By default, it will be something like this:

![Default content of /etc/sudoers](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-13.avif)

If we have write capability on this file, we can apply whatever permissions we want, so that, for example, we have the ability to execute any command as root. To do this, we first verify the permissions our user has for this file:

![Verification of permissions on /etc/sudoers](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-14.avif)

Once we know we can edit the file, the idea will be to add the following line:

```bash
sikumy ALL=(ALL) NOPASSWD:ALL
```

![Modification of sudoers file](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-15.avif)

As a note, we can edit the file without needing read permissions. Now, once we've added this line, we'll be telling it that the sikumy user can execute any command as any user without needing to provide a password. For example:

![Executing commands with sudo without password](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-16.avif)

> If we try to use sudo while having write permissions for "others" in the sudoers file, we might get an error. This error is to prevent this type of security flaw. What's really important here is that if a way were found to replace the sudoers file, or change it, without needing different permissions from the defaults, it could be exploited to escalate privileges.

##### Other resources

As with read permissions, write permissions aren't limited to the files we've mentioned above, it will depend entirely on the system we're on. Still, other situations I can think of are:

- We have write capability in a folder where a cron task is being executed.
- We have write capability in a file that is executed by a cron task.
- We have write capability in a library that is being used by a script that is executed by a cron task.
- We have write capability in a [systemd timer that executes periodically](https://book.hacktricks.xyz/linux-hardening/privilege-escalation#timers).

And so on, there will be a thousand more situations where everything will depend on the system we're on. In the end, what really matters is that we're aware of what having write permissions on some system resource means, and that at first glance it may seem useless, but by chaining it with other things, an exploitation can be performed.

## References

- [Linux Privilege Escalation Through Incorrect Permissions on Nozerobit](https://nozerobit.github.io/linux-privesc-wrong-permissions/)
- [Linux Privilege Escalation Guide Through Writable Files on PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Linux%20-%20Privilege%20Escalation.md#writable-files)
- [Linux Privilege Escalation Course for OSCP and Beyond on Udemy](https://www.udemy.com/course/linux-privilege-escalation/)
