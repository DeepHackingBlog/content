---
id: "escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths"
title: "Windows Privilege Escalation Through Unquoted Service Paths"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-12-14
updatedDate: 2021-12-14
image: "https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-0.webp"
description: "Learn to identify and exploit Windows services with unquoted paths to escalate privileges using Unquoted Service Path techniques."
categories:
  - "windows"
draft: false
featured: false
lang: "en"
---

When a service starts, Windows searches for the corresponding executable so that the service can start successfully. The executable path can be stored in two ways:

- With quotes
- Without quotes

In the first case, the system knows exactly where the executable is, however, in the second case, if throughout the entire executable path there are folders in between that have names with spaces, Windows performs a process that we might be able to exploit.

Index:

- [Introduction](#introduction)
- [Enumeration](#enumeration)
- [Exploitation Example](#exploitation-example)
- [References](#references)

Note: before continuing, I recommend reading the post: [¿Qué es un servicio en Windows? - Privilege Escalation](https://blog.deephacking.tech/en/posts/what-is-a-windows-service/)

## Introduction

For example, let's imagine there is a service X which has its executable assigned to the following path:

`C:\Windows\Program Files\CleanUp\Common Files\clean.exe`

Considering that the service has it set without quotes, and therefore, not in an absolute way. Who tells Windows that the executable couldn't perfectly be:

`C:\Windows\Program.exe`

And that it's passed as arguments:

`Files\CleanUp\Common`

`Files\clean.exe`

Or that the executable was:

`C:\Windows\Program Files\CleanUp\Common.exe`

With argument:

`Files\clean.exe`

The idea is basically this. Some programs receive arguments like:

`program.exe argument1 argument2 argument3...`

So Windows, not having quotes, doesn't know if this is happening. Therefore, every time it finds a space in the PATH, it separates it between: `<executable>` `<arguments>`. In this case, the first thing Windows would do is interpret it as:

`C:\Windows\Program Files\CleanUp\Common Files\clean.exe`

Executable: `C:\Windows\Program.exe`

Argument 1: `Files\CleanUp\Common`

Argument 2: `Files\clean.exe`

And so on continuously.

Knowing how Windows searches for the executable, what happens if we had write permissions in any of these folders with spaces. That is, if in this case, we had write permissions in the "CleanUp" folder. We could create a malicious executable called `common.exe`, in such a way that when Windows reaches that folder (it will reach it, since it won't find a `program.exe` inside "Program Files") it will execute our malicious executable. Since it will understand it the way we saw previously:

Executable: `C:\Windows\Program Files\CleanUp\Common.exe`

Argument: `Files\clean.exe`

Be careful, we shouldn't fall into the trap that if we find an "Unquoted Service Path", we can already exploit it successfully. It's useless to be able to write to any directory if we don't have the ability to:

- Restart or stop and start the service
- Restart the Windows computer (only in the case that it's a service that starts with the system)

Because if we're not able to do this, the service will never start, and therefore, our malicious executable will never be executed.

## Enumeration

##### Manual

WMIC (Windows Management Instrumentation Command-line) is an administration tool for Windows that allows not only obtaining information, but performing actions.

We can list the services that have a path assigned without quotes with the following command:

`wmic service get name,displayname,pathname,startmode | findstr /i /v "C:\Windows\\" | findstr /i /v """`

- With `wmic` as we can see, we are obtaining service information, in this case the name, path and start mode (if it starts when turning on the system)
- The `/i` parameter of `findstr` is used to ignore whether it's uppercase or lowercase.
- The `/v` parameter of `findstr` is used so that it only prints lines that don't match.
- Knowing this, the two times `findstr` is used are to:
    - Ignore services that are in the `C:\Windows` folder
    - Ignore services that are in (double) quotes

In addition to `wmic`, manually, if we're interested in a specific service, we can see the executable path in the following registry:

`HKLM\SYSTEM\CurrentControlSet\Services\<service name>`

The command would be:

`reg query HKLM\SYSTEM\CurrentControlSet\Services\<service name>`

##### Powersploit (PowerUp.ps1)

Powersploit has a function which helps us enumerate services that have an "Unquoted Service Path" and a space in some folder. Once we have PowerUp.ps1 loaded in powershell, we can use the following cmdlet:

`Get-UnquotedService`

This way, it would list the services that meet these requirements.

We can download the script from the [Powersploit repository on GitHub](https://github.com/PowerShellMafia/PowerSploit/blob/master/Privesc/PowerUp.ps1).

##### WinPEAS

WinPEAS is a very good tool to enumerate many things in Windows by running it without any arguments. However, it also allows execution with an argument that specifies what to search for exactly, or what to focus on. With the following command, we indicate that it should focus on enumerating services, which includes searching for "Unquoted Service Paths":

`winpeas.exe quiet servicesinfo`

You can check the possible WinPEAS arguments in its [official repository on GitHub](https://github.com/carlospolop/PEASS-ng/blob/master/winPEAS/winPEASexe/README.md).

##### Metasploit

Metasploit wasn't going to be left behind, it also has a post-exploitation module that allows us to enumerate this, it would be the following:

- `exploit/window/local/trusted_service_path`

## Exploitation Example

For the exploitation example, I'm going to use Tib3rius's script that you can find in his [Windows-PrivEsc-Setup repository on GitHub](https://github.com/Tib3rius/Windows-PrivEsc-Setup). This script configures a Windows 10 with different misconfigurations.

With this clear, the first thing we would do is enumerate in search of a service that has the path of its executable without quotes, for this, you can use any of the forms seen previously. In this case I'm going to use `wmic` removing some fields so that the output is not so long and looks better:

`wmic service get name,pathname | findstr /i /v "C:\Windows\" | findstr /i /v """`

![Result of wmic command showing service with Unquoted Service Path](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-1.avif)

We see that in this case there is a service whose executable is defined in that path and without quotes, additionally, it contains folders whose names contain spaces. Knowing this, we now need to check two things:

- If we can restart or stop and start the service
- If we have write permissions on any of those folders

For both tasks, we can use the "accesschk" executable. It's a tool that will help us see what type of access specific users or groups have to resources such as files, directories, Registry keys, global objects and Windows services. It can be downloaded from the [official AccessChk documentation](https://docs.microsoft.com/es-es/sysinternals/downloads/accesschk).

The structure of accesschk is as follows:

`accesschk.exe [options] [user or group] <object name>`

Knowing this, we can see the permissions that a user (or group) has over a service using the following command:

`accesschk.exe /accepteula -ucqv <user> <service>`

Explanation of the arguments:

- `/accepteula` --> when we run a Windows Sysinternals tool, the first time we do it usually a graphical window appears to accept terms and such. To avoid problems from our shell, by directly adding this argument we accept the terms from the console itself.
- `u` --> We indicate that it shouldn't show errors if there are any
- `c` --> We indicate that the `<object name>` represents a Windows service.
- `q` --> We remove the tool's banner from the output
- `v` --> Typical verbose of any tool (show more detailed information)

Knowing what we're doing, we execute the command:

![Result of accesschk showing permissions on the service](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-2.avif)

And if we notice, we have the ability to stop and start the service.

Now we need to confirm that we have the ability to write to any of the directories:

Complete directory: `C:\Program Files\Unquoted Path Service\Common Files\unquotedpathservice.exe`

Executables that Windows will search for:

- `C:\Program.exe`
- `C:\Program Files\Unquoted.exe`
- `C:\Program Files\Unquoted Path Service\Common.exe`

Therefore, the directories which we want to see if we have write permissions on are:

- `C:\`
- `C:\Program Files`
- `C:\Program Files\Unquoted Path Service`

Again, to see this, we're going to use accesschk. In this case the command to see the permissions of a folder would be the following:

`accesschk.exe /accepteula -uwdq <folder>`

Explanation of the arguments:

- `w` --> Shows only permissions that contain write.
- `d` --> We indicate that the object is a folder. And that we're interested in the permissions of this object and not its content.

This way, we check the permissions on the three directories we indicated above:

![Verification of write permissions on directories using accesschk](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-3.avif)

If we notice, we have write permissions on:

- `C:\Program Files\Unquoted Path Service`

So we meet the two requirements that were needed, we have the ability to stop and start the service, and we have write permission on one of the folders.

At this point, we prepare a simple payload with msfvenom:

![Generation of malicious payload with msfvenom](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-4.avif)

From the start, we've given it the name we're interested in, in this case, `common.exe`. Since it's the executable that Windows will try to execute. Now, we simply download the payload to the "Unquoted Path Service" directory.

![Download of payload in the vulnerable directory](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-5.avif)

With this done, everything is ready. We set up a listener:

![Netcat listener waiting for connection](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-6.avif)

And now, we start the service (we don't stop it because it wasn't started):

![Start of vulnerable service and obtaining shell as SYSTEM](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-7.avif)

Our payload executes and we obtain a shell as the user running the service, in this case nt authority\\system (although we have the privilege to start or stop it, it doesn't mean we're the ones executing it).

Note, we can see the status of a service using for example `sc` (or using the powershell cmdlet `Get-Service -Name <service>`):

`sc query <service name>`

![Query of service status using sc query](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-8.avif)

We could also see which user starts the service, with the command:

`sc qc <service>`

![Query of service configuration showing the user running it](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-9.avif)

In this case, localsystem (nt authority\\system).

Note also, how, to refer to the service in any case, we use the "name" and not the "displayname":

<figure>

![Difference between name and displayname of a service](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-10.avif)

<figcaption>

Left is displayname, right is name

</figcaption>

</figure>

I mention this last point in case you use the complete `wmic` command mentioned at the beginning:

`wmic service get name,displayname,pathname,startmode | findstr /i /v "C:\Windows\\" | findstr /i /v """`

Which shows you both names.

## References

- [Documentation about the accepteula flag of AccessChk](https://xor.cat/2017/09/05/sysinternals-accesschk-accepteula/#:~:text=1%20minute%20read,auditing%20privileges%20on%20others'%20systems.)
- [Windows Sysinternals Administrator's Reference: Security Utilities](https://www.microsoftpressstore.com/articles/article.aspx?p=2224373&seqNum=2)
- [Windows Privilege Escalation for OSCP & Beyond Course on Udemy](https://www.udemy.com/course/windows-privilege-escalation/)
