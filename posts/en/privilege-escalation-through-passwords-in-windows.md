---
id: "escalada-de-privilegios-a-traves-de-contrasenas-en-windows"
title: "Privilege Escalation through Passwords in Windows"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-01-03
updatedDate: 2022-01-03
image: "https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-0.webp"
description: "Techniques for escalating privileges in Windows through passwords stored in the registry, configuration files, saved credentials, and SAM hash extraction."
categories:
  - "windows"
draft: false
featured: false
lang: "en"
---

Another typical way to escalate privileges in Windows is through passwords. Either because a user reuses them or because we find them in plain text in some file or document.

Windows is quite susceptible to being vulnerable to this, as it contains many features which store information in a not very secure way. Let's see what kind of places and how we can find sensitive information:

Table of Contents:

- [Registry](#registry)
- [WinPEAS](#winpeas)
- [PowerSploit](#powersploit)
- [Save Creds](#save-creds)
- [Configuration Files](#configuration-files)
- [SAM and SYSTEM](#sam-and-system)
- [References](#references)

The environment used in this post has been set up using the [Windows-PrivEsc-Setup](https://github.com/Tib3rius/Windows-PrivEsc-Setup) script by Tib3rius.

## Registry

Programs usually save information for their proper functioning in the Windows registry. Likewise, they also save passwords.

We can do a recursive search to see if we find the field "password" in any registry with the following commands:
- `reg query HKLM /f password /t REG_SZ /s`
- `reg query HKCU /f password /t REG_SZ /s`

In the first command, we recursively search the HKEY\_LOCAL\_MACHINE registry for the word "password", in the second command we do the same but in the HKEY\_CURRENT\_USER registry.

The difference between these two registries is that HKLM contains information about configurations related to the operating system and installed software. While HKCU stores configurations specific to the user who has logged in.

For the rest, the explanation of the arguments of the `reg query` command is as follows:
- `/f` --> Used to indicate the word to search for, that's why it's accompanied by password (`/f <word>`), since that's what we want to search for.
- `/t` --> We specify the registry type (`/f <registry type>`), in this case as we can see, we indicate REG\_SZ, although the different options are: **REG\_MULTI\_SZ**, **REG\_EXPAND\_SZ**, **REG\_DWORD**, **REG\_BINARY**, **REG\_NONE**. If none is specified, it searches through all of them. In our case, REG\_SZ corresponds to a fixed-length text string.
- `/s` --> We indicate that all subkeys and value names should be queried recursively. Here's an image that explains what each thing is:

<figure>

![Windows registry structure showing Key, Value and Data](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-1.avif)

<figcaption>

https://binaryforay.blogspot.com/2015/01/registry-hive-basics-part-2-nk-records.html

</figcaption>

</figure>

These two commands must be careful from where we launch them, since if for example we launched them from the root (C:\\), they would bring an immense output, since both search recursively.

In this case, again WinPEAS could make the enumeration task easier for us, we could use the following command:

`winPEAS.exe quiet searchfast filesinfo`

Remember that you can see the WinPEAS arguments from its [repository](https://github.com/carlospolop/PEASS-ng/blob/master/winPEAS/winPEASexe/README.md).

In any case, these two commands tend to generate a large output. So often, instead of doing this, it's common to look previously in common places, such as winlogon. Winlogon is a component of Windows systems which, among other things, is responsible for automatic login.

For automatic login to occur, the credentials have to be stored somewhere, and this is none other than the registry. In fact, Microsoft provides an official tutorial on how to activate automatic login by adding your credentials to the registry in plain text, [here's the source](https://docs.microsoft.com/es-es/troubleshoot/windows-server/user-profiles-and-logon/turn-on-automatic-logon).

So a typical thing to do is to check if there are credentials stored in the winlogon registry, it could be done manually as follows:

`reg query "HKLM\SOFTWARE\Microsoft\Windows NT\Currentversion\Winlogon"`

<figure>

![Query to Winlogon registry showing credentials in plain text](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-2.avif)

<figcaption>

64-bit shell

</figcaption>

</figure>

As we can see, in this case, we obtain the credentials by having automatic login configured on the computer.

> Note: Before making queries to the registries, or really, in general for privilege escalation in Windows, we have to be very careful whether the process of our shell is 64-bit or 32-bit (this obviously only applies if the machine is 64-bit, since on 32-bit systems there is no other option).
>
> Whether our process works in 64 or 32 can mean that we manage to escalate privileges or not. For example, this would be the output if we made a query to the winlogon registry, as we just did, but from a 32-bit process:

<figure>

![Query to Winlogon registry from 32-bit shell showing different results](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-3.avif)

<figcaption>

32-bit shell on a 64-bit System

</figcaption>

</figure>

It doesn't list the same result, the reason for this can be seen in [this Stack Overflow article](https://stackoverflow.com/questions/9433928/execute-reg-query-as-a-new-process-does-not-display-all-keys) (another resource to check out is Microsoft's own official documentation, in this case, the [Registry Redirector](https://docs.microsoft.com/es-es/windows/win32/winprog64/registry-redirector?redirectedfrom=MSDN)). What I want to get at is that you have to be careful with this kind of thing.

That said, this is one of the typical places to look for stored credentials, it's also highly recommended to check if the computer has programs like Putty, WinSCP, or some browser like Mozilla (among others) installed. Since these can also contain stored credentials from some session. In any case, there are tools that can automate the enumeration and extraction of credentials for us, such as WinPEAS.

## WinPEAS

As we've already seen in other posts, WinPEAS is a very powerful tool when it comes to looking for possible ways to escalate privileges in Windows. Additionally, it accepts arguments to select exactly what type of information we want it to enumerate (similarly, we can run it without arguments so that it enumerates everything). The list of arguments can be consulted in its [official repository](https://github.com/carlospolop/PEASS-ng/blob/master/winPEAS/winPEASexe/README.md).

In this case, the arguments that might interest us to search for credentials are `filesinfo` and `userinfo`, so the command to execute would be:

`winPEAS.exe quiet filesinfo userinfo`

The `quiet` argument only serves to not show the banner in the output.

So, executing this command, WinPEAS among many other things it will obtain, some of them will be the following:

![WinPEAS output showing credentials extracted from Winlogon](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-4.avif)

![WinPEAS output showing credentials extracted from Putty](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-5.avif)

As we can see, it has managed to extract credentials from Winlogon and Putty (it's not the only thing it has obtained, but the output is too large to show it one by one). We could have done it manually, however, it's not the most efficient having a tool like WinPEAS.

> Note: The Putty credentials if we did it manually we would find them as follows:
>
> `reg query "HKCU\Software\SimonTatham\PuTTY\Sessions" /s`

## PowerSploit

We always have to have alternatives in case something fails, so another tool we can use to enumerate credentials is PowerSploit, more specifically its "PowerUp.ps1" script.

In this case, the possible functions that might interest us are the following:

```powershell
Get-UnattendedInstallFile
Get-Webconfig
Get-ApplicationHost
Get-SiteListPassword
Get-CachedGPPPassword
Get-RegistryAutoLogon
```

If you don't know PowerSploit, basically it's a repository that contains a large amount of useful powershell scripts for post-exploitation, in this case the one we're interested in is `PowerUp.ps1`. Once we load the script on the system, we'll have all the cmdlets (functions) that I mention in the upper part (and many more). This tool can be downloaded from its [official repository](https://github.com/PowerShellMafia/PowerSploit/blob/master/Privesc/PowerUp.ps1).

Usage example:

![Example of executing PowerUp.ps1 obtaining credentials from registry](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-6.avif)

With the first command we load the module in powershell, so we have the functions of `PowerUp.ps1` integrated.

> In the first command I was able to load it, since my Windows has internet access and can reach the repository. If you were on a HackTheBox or TryHackMe machine, you couldn't load it directly from the repository, since the machines don't have internet access. You would have to download it on your machine and set up a web server or transfer it to Windows.

## Save Creds

Just as in Linux you can assign `sudo` privileges to a user so they can execute a script or binary on behalf of another, Windows has a quite similar feature, in this case, RunAs.

RunAs is a feature that allows you to run any program on behalf of another user if you know their password, example:

![Example of using RunAs to execute commands as another user](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-7.avif)

However, RunAs has a feature which allows saving credentials of another user so you can execute whatever you want without knowing their password. This feature is the `savecred` argument.

We can check if there are stored credentials for any user using the [cmdkey](https://ss64.com/nt/cmdkey.html) command. Cmdkey is a command-line tool that allows us to manage credentials stored on the system, graphically, we would manage it from the "Credential Manager". In any case, to see the list of credentials stored on the system, we use the following command:

`cmdkey /list`

<figure>

![Output of cmdkey command showing saved credentials](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-8.avif)

<figcaption>

Cmdkey

</figcaption>

</figure>

<figure>

![Windows Credential Manager showing saved credentials](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-9.avif)

<figcaption>

Credential Manager

</figcaption>

</figure>

As we can verify in both images, there are stored credentials for the "admin" user (We could also enumerate it using WinPEAS with the command `winPEAS.exe quiet windowscreds`).

Knowing that there are stored credentials for the "admin" user, we can take advantage of this to execute a reverse shell using runas:

`runas /savecred /user:<user> <executable>`

![Using runas with savecred to obtain reverse shell as administrator](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-10.avif)

> Note: In RunAs we can also indicate that the executable is executed with the arguments we want if we put everything in quotes.

This way, we're able to escalate privileges thanks to the stored credentials of the administrator user.

## Configuration Files

In any system, configuration files exist, likewise, there's a possibility that these have credentials in plain text (A typical example is the `wp-config.php` file in Wordpress, or the `web.config` file in IIS).

We can recursively search for configuration files that contain the word "pass" in their name or that have the ".config" extension with the following command:

`dir /s *pass* == *.config`

We could also search for files that contain the word "password" in their content and that have the extension we specify:

`findstr /si password *.xml *.ini`

We have to be careful from where we launch these two commands, since if for example we launched them from the root (C:\\), they would bring an immense output, since both search recursively.

In this case, again WinPEAS could make the enumeration task easier for us, we could use the following command:

`winPEAS.exe quiet searchfast filesinfo`

Remember that you can see the WinPEAS arguments from its [repository](https://github.com/carlospolop/PEASS-ng/blob/master/winPEAS/winPEASexe/README.md).

Launching the WinPEAS command, we find the following interesting file:

<figure>

![WinPEAS output detecting Unattend.xml file](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-11.avif)

<figcaption>

This was also reported by the command `winPEAS.exe quiet filesinfo userinfo` although I didn't mention it

</figcaption>

</figure>

Checking its content, we see the following:

![Content of Unattend.xml file showing user configuration](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-12.avif)

![Credentials encoded in base64 in Unattend.xml file](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-13.avif)

We find the credentials for "admin" in base64.

`Unattend.xml` is a typical file where we can find credentials. According to [Microsoft's official documentation](https://docs.microsoft.com/en-us/windows-hardware/customize/desktop/wsim/answer-files-overview#:~:text=An%20answer%20file%20is%20an,to%20use%20during%20Windows%20Setup.&text=You%20can%20also%20specify%20values,xml.), this file is an XML-based file that contains definitions and configuration values to use during Windows installation.

It's very typical for system administrators to use Windows Deployment Services to create an image of it to deploy it on several computers on the network. This is called "Unattended Installation". The problem with this type of installation is that the local administrator password of the computer can be stored in several locations like the one we've seen. Other possible locations are:
- `C:\unattend.xml`
- `C:\Windows\Panther\Unattend\Unattend.xml`
- `C:\Windows\system32\sysprep.inf`
- `C:\Windows\system32\sysprep\sysprep.xml`

There's also a metasploit module that checks this: `post/windows/gather/enum_unattend`

Once we've obtained and know the password of a user, we can use RunAs, or some program like psexec to obtain a shell as the user in question.

## SAM and SYSTEM

Sometimes, not everything is about passwords. A feature that Windows has is that knowing the NT hash of a user, we can obtain a shell without needing the password (this is not random, knowing how NTLM authentication works we understand why).

The SAM of the computer, or, in other words, the "Security Account Manager" is where the hashes of the passwords of the system users are stored. The hashes are stored in encrypted form, and the decryption key is found in the SYSTEM file.

So, if we're able to read the SAM and SYSTEM file, we can extract the hashes of all the users on the computer.

The SAM and SYSTEM files are stored in the directory:

`C:\Windows\System32\config`

These files are locked while Windows is running. However, perhaps we can find a backup in some of the following directories:
- `C:\Windows\Repair`
- `C:\Windows\System32\config\RegBack`

In this case, we find a backup of both files in the `C:\Windows\Repair` directory, so we can copy them to our computer:

![Transfer of SAM and SYSTEM files to attacker machine](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-14.avif)

Both files are unreadable, since they are binary:

![Binary content of SAM and SYSTEM files](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-15.avif)

To decrypt the "SAM" file using "SYSTEM", we can use for example `pwdump.py`:

![Hash extraction with pwdump.py](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-16.avif)

We could also use `secretsdump.py`:

![Hash extraction with secretsdump.py](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-17.avif)

Finally, once we have the NT hash of the users, we have two options, try to crack it, or do Pass The Hash.

> Note: If we've already escalated privileges and what we want is to obtain the hashes to generate persistence. Being an administrator, we can obtain the SAM and SYSTEM from the registry with the commands:
>
> `reg save HKLM\SAM SAM.backup`
>
> `reg save HKLM\SYSTEM SYSTEM.backup`

## References
- [HKEY_LOCAL_MACHINE (HKLM) | Neoguias](https://www.neoguias.com/hkey-local-machine-hklm/#:~:text=HKEY_LOCAL_MACHINE%2C%20abreviado%20como%20HKLM%2C%20es,software%20instalado%20en%20tu%20ordenador.)
- [Windows Registry - Wikipedia](https://es.wikipedia.org/wiki/Registro_de_Windows#:~:text=HKEY_CURRENT_USER%2C%20abreviado%20como%20HKCU%2C%20almacena,misma%20informaci%C3%B3n%20en%20ambas%20ubicaciones.)
- [Registry hive basics part 2: NK records - Binary Foray](https://binaryforay.blogspot.com/2015/01/registry-hive-basics-part-2-nk-records.html)
- [Turn on automatic logon in Windows - Microsoft Docs](https://docs.microsoft.com/es-es/troubleshoot/windows-server/user-profiles-and-logon/turn-on-automatic-logon)
- [Execute "reg query" as a new process does not display all keys - Stack Overflow](https://stackoverflow.com/questions/9433928/execute-reg-query-as-a-new-process-does-not-display-all-keys)
- [Registry Redirector - Microsoft Docs](https://docs.microsoft.com/es-es/windows/win32/winprog64/registry-redirector?redirectedfrom=MSDN)
- [CMDKEY.exe - SS64 Command Line Reference](https://ss64.com/nt/cmdkey.html)
- [Answer Files Overview - Microsoft Docs](https://docs.microsoft.com/en-us/windows-hardware/customize/desktop/wsim/answer-files-overview#:~:text=An%20answer%20file%20is%20an,to%20use%20during%20Windows%20Setup.&text=You%20can%20also%20specify%20values,xml.)
- [Stored Credentials - PentestLab](https://pentestlab.blog/2017/04/19/stored-credentials/)
- [Windows Privilege Escalation for OSCP & Beyond - Udemy](https://www.udemy.com/course/windows-privilege-escalation/)
- [Windows-PrivEsc-Setup - GitHub Repository](https://github.com/Tib3rius/Windows-PrivEsc-Setup)
