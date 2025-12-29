---
id: "que-es-un-servicio-en-windows"
title: "What is a Windows Service"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-12-22
updatedDate: 2021-12-22
image: "https://cdn.deephacking.tech/i/posts/que-es-un-servicio-en-windows/que-es-un-servicio-en-windows-0.webp"
description: "Learn what Windows services are, how they work, the different types of privilege escalation related to services, and enumeration techniques with accesschk.exe."
categories:
  - "windows"
draft: false
featured: false
lang: "en"
---

Windows services (formerly known as NT services) allow you to create long-running actions/programs that execute in their own Windows sessions. Services can be started automatically when the computer boots up, can be stopped or started manually, and in any case, they don't display a graphical interface, everything happens in the background.

Services can run in the context of a different user than the one or those who have logged into the computer.

With this last statement, thinking from an attacker's perspective, this Windows feature may already catch our attention regarding a possible privilege escalation. If a service is misconfigured and is executed by, for example, the `nt authority\system` user, we might be able to take advantage of it to inject actions by impersonating this user (or whatever user executes it).

Index:

- [Types of Privilege Escalations](#types-of-privilege-escalations)
- [Enumeration using accesschk.exe](#enumeration-using-accesschkexe)
- [How to restart services](#how-to-restart-services)
- [References](#references)

## Types of Privilege Escalations

There are several known privilege escalations that are related to Windows services:

- Insecure Service Permissions
- Unquoted Service Path
- Weak Registry Permissions
- Insecure Service Executables
- DLL Hijacking

All these possible escalations are based on misconfigurations that can be found on the Windows system. However, none of these escalations will work even if that misconfiguration exists, if we don't have the ability to:

- Start, stop, or restart the service
- Restart the Windows computer (assuming the vulnerable service starts on system boot)

So we shouldn't fall into the trap of thinking that if we find any of these possible misconfigurations, we'll be able to exploit them. Everything will depend on whether we're capable of performing either of the last two mentioned actions.

Now let's see how we can enumerate the permissions and configurations of a service, file, and directory.

## Enumeration using accesschk.exe

Accesschk is a command-line tool that belongs to the Windows Sysinternals toolkit, so it's from Microsoft itself. It allows you to see what type of access specific users or groups have to resources such as files, directories, Registry keys, global objects, and Windows services. It can be downloaded from the [official documentation](https://docs.microsoft.com/es-es/sysinternals/downloads/accesschk).

The structure of accesschk is as follows:

`accesschk.exe [options] [user or group] <object name>`

Knowing this, let's look at some specific commands that can be useful to us:

### View permissions that a certain user has over a service

`accesschk.exe /accepteula -ucqv <user> <service>`

Argument explanation:

- `/accepteula` –> when we run a Windows Sysinternals tool, the first time we do it, a graphical window usually appears to accept terms and so on. To avoid problems from our shell, by directly adding this argument we accept the terms from the console itself
- `u` –> We indicate not to show errors if there are any
- `c` –> We indicate that the `<object name>` represents a Windows service
- `q` –> We remove the tool's banner from the output
- `v` –> Typical verbose of any tool (display more detailed information)

![Example of user permissions on the daclsvc service showing the ability to edit, start, and stop](https://cdn.deephacking.tech/i/posts/que-es-un-servicio-en-windows/que-es-un-servicio-en-windows-1.avif)

In this example we can see how the `user` user has the ability on the `daclsvc` service to:

- Edit the service configuration
- Start the service
- Stop the service

This way, we would identify permissions which can be useful to know to determine some possible exploitation.

### View write permissions on a directory

`accesschk.exe /accepteula -uwdq <directory>`

Argument explanation:

- `/accepteula` –> when we run a Windows Sysinternals tool, the first time we do it, a graphical window usually appears to accept terms and so on. To avoid problems from our shell, by directly adding this argument we accept the terms from the console itself
- `u` –> We indicate not to show errors if there are any
- `w` –> Shows only permissions that contain write access
- `d` –> We indicate that the object is a folder. And that we're interested in the permissions of this object and not its contents
- `q` –> We remove the tool's banner from the output

![Accesschk result showing write permissions of the BUILTIN Users group on a directory](https://cdn.deephacking.tech/i/posts/que-es-un-servicio-en-windows/que-es-un-servicio-en-windows-2.avif)

This way, we can see how all users (`BUILTIN\Users`) have write capability on the specified directory, which could be useful to take advantage of some misconfiguration.

### Check the permissions of a registry key

`accesschk.exe /accepteula -uvwqk HKLM\System\CurrentControlSet\Services\regsvc`

Argument explanation:

- `/accepteula` –> when we run a Windows Sysinternals tool, the first time we do it, a graphical window usually appears to accept terms and so on. To avoid problems from our shell, by directly adding this argument we accept the terms from the console itself
- `u` –> We indicate not to show errors if there are any
- `v` –> Typical verbose of any tool (display more detailed information)
- `w` –> Shows only permissions that contain write access
- `q` –> We remove the tool's banner from the output
- `k` --> We indicate that the `<object name>` represents a registry key

![Permissions of the INTERACTIVE group on the registry showing write capability](https://cdn.deephacking.tech/i/posts/que-es-un-servicio-en-windows/que-es-un-servicio-en-windows-3.avif)

In this case, thanks to accesschk we can know that the `INTERACTIVE` group has write permissions on the registry. This group includes all users who have ever logged into the machine locally, so it's very likely that any user belongs to this group.

Knowing this, in this case we've been able to verify that we have write capability on this registry, which could be useful.

FYI, as a curiosity, all services in Windows are located at the path:

`HKLM\System\CurrentControlSet\Services\<service name>`

### Check if we have write permissions on an executable

`accesschk.exe /accepteula -quvw <executable>`

Argument explanation:

- `/accepteula` –> when we run a Windows Sysinternals tool, the first time we do it, a graphical window usually appears to accept terms and so on. To avoid problems from our shell, by directly adding this argument we accept the terms from the console itself
- `q` –> We remove the tool's banner from the output
- `u` –> We indicate not to show errors if there are any
- `v` –> Typical verbose of any tool (display more detailed information)
- `w` –> Shows only permissions that contain write access

![Write permissions on an executable for all users](https://cdn.deephacking.tech/i/posts/que-es-un-servicio-en-windows/que-es-un-servicio-en-windows-4.avif)

This way, we can see how all users have write capability on the specified file. Which can be very useful to replace it and take advantage of it somehow.

Accesschk.exe is a very useful tool for enumerating information that can be very useful to know for the different types of escalations related to Windows services. In any case, its practical use will be better seen in each post of the different escalations.

## How to restart services

As mentioned previously, in all escalations related to Windows services, an essential requirement is the ability to start, stop, or restart a service (not counting directly restarting the computer for a service that starts on boot). Once we know that we have the privileges to do so, there are different ways to carry it out:

### net

We can start a service using:

`net start <service name>`

Similarly, we can stop it with:

`net stop <service name>`

We can also use `net` to list all running services:

`net start`

### sc

`sc` (Service Controller) is a command-line program used for communication with the Windows Service Controller and installed services.

We can start a service with:

`sc start <service name>`

And stop it with:

`sc stop <service name>`

As extra information, with `sc` we can:

#### Check current service configuration

`sc qc <service>`

Example:

![Configuration of a Windows service displayed with the sc qc command](https://cdn.deephacking.tech/i/posts/que-es-un-servicio-en-windows/que-es-un-servicio-en-windows-5.avif)

#### Check current service status

`sc query <service>`

![Current status of a service displayed with the sc query command](https://cdn.deephacking.tech/i/posts/que-es-un-servicio-en-windows/que-es-un-servicio-en-windows-6.avif)

### Powershell

From PowerShell we can use a cmdlet to restart services:

`Restart-Service <service name> -Force`

Similarly, there are cmdlets to start and stop a service:

- `Start-Service`
- `Stop-Service`

The syntax is simple: `<cmdlet> <service name>`. Although you can also use the `-Name` argument to refer to the service:

- `Start-Service -Name <service name>`
- `Stop-Service -Name <service name>`

## References

- [Introduction to Windows Service Applications on Microsoft Learn](https://docs.microsoft.com/es-es/dotnet/framework/windows-services/introduction-to-windows-service-applications)
- [Windows Privilege Escalation for OSCP & Beyond Course on Udemy](https://www.udemy.com/course/windows-privilege-escalation/)
- [Windows-PrivEsc-Setup Repository on GitHub](https://github.com/Tib3rius/Windows-PrivEsc-Setup)
- [Interactive Group on TechNet Forums](https://social.technet.microsoft.com/Forums/windows/en-US/899f5b73-f762-4b1a-b54f-6910d3c47621/interactive-group?forum=winserversecurity)
- [Windows Sysinternals Administrator's Reference Security Utilities on Microsoft Press Store](https://www.microsoftpressstore.com/articles/article.aspx?p=2224373&seqNum=2)
