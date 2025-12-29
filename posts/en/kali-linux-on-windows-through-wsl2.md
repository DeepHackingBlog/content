---
id: "kali-linux-en-windows-a-traves-de-wsl2"
title: "Kali Linux on Windows through WSL2"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-04-24
updatedDate: 2024-04-24
image: "https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-0.webp"
description: "Learn how to install Kali Linux with a graphical interface on Windows using WSL2. Complete guide with three display modes and environment configuration."
categories:
  - "windows"
draft: false
featured: false
lang: "en"
---

Everyone knows VMWare or VirtualBox, and in [another article about Kali Linux on Docker](https://blog.deephacking.tech/en/posts/kali-linux-on-docker/), we also covered Docker. However, these are not the only alternatives for having and running Linux. Today we're going to see how to install Kali Linux with a graphical interface on Windows thanks to WSL (Windows Subsystem for Linux).

- [Kali Linux Installation](#kali-linux-installation)
- [Seamless Mode](#seamless-mode)
- [Enhanced Session Mode](#enhanced-session-mode)
- [Windows Mode](#windows-mode)
- [Shortcut from Windows Terminal](#shortcut-from-windows-terminal)
- [Accessing Kali's File System from Windows](#accessing-kalis-file-system-from-windows)
- [Accessing Windows File System from Kali](#accessing-windows-file-system-from-kali)
- [Port Forwarding - From Windows to Kali](#port-forwarding---from-windows-to-kali)
- [References](#references)

## Kali Linux Installation

First of all, we go to the Microsoft Store and search for the Linux operating system we want to install, in our case Kali. Once we find it, we install it:

![Kali Linux installation from Microsoft Store](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-1.avif)

Also, if we don't have it installed, I recommend installing Windows Terminal:

![Windows Terminal in Microsoft Store](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-2.avif)

Once we have both things installed, or at least Kali, we check if WSL is enabled. To do this, we check the Windows features:

![Access to Windows Control Panel](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-3.avif)

![Activate Windows features - WSL](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-4.avif)

If it's checked, great, we don't touch anything. If not, we activate it. In that case, we'll probably need to restart the computer.

Once this is done, we open Kali Linux:

![Kali Linux icon in Windows](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-5.avif)

The first time we open it, we'll have to wait a bit for it to install:

![Kali Linux installation process](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-6.avif)

![Initial user configuration in Kali](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-7.avif)

Once it finishes, it will ask us to specify the username and password to create, and once we do that, we'll have our Kali on Windows:

![Kali Linux terminal running on Windows](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-8.avif)

Once we have it, one of the first things to do would be to run an apt update:

![Package update with apt update](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-9.avif)

This Kali comes quite empty by default, so it's also recommended to install, for example, the following package:

```bash
sudo apt install kali-linux-default
```

We can find more package sets in the [official documentation](https://www.kali.org/docs/general-use/metapackages/).

Once all this is done, it's time to install the graphical part of Kali. To do this, we install the following package:

```bash
sudo apt install -y kali-win-kex
```

![Installation of kali-win-kex](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-10.avif)

Win-Kex is the package that provides this feature. With it come three possible modes we can use to view our Kali desktop:

- Window Mode
- Enhanced Session Mode
- Seamless Mode

Let's look at the three options we have:

## Seamless Mode

Seamless mode integrates the KDE desktop environment directly into the Windows desktop, it would look like this:

![Kali Linux in Seamless mode](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-11.avif)

This allows Linux applications to run as if they were native Windows applications. Application windows appear alongside Windows applications without the visual barrier of working inside a separate VM window.

Personally, I've tried to enable this mode but have never had the luck of getting it to work. In any case, if we want to use it, theoretically we should run one of the following commands:

- Inside Kali

```bash
kex --sl -s
```

- From CMD or PowerShell

```powershell
wsl -d kali-linux kex --sl -s
```

We don't have to run both commands, just one of them.

## Enhanced Session Mode

Enhanced Session mode allows using the RDP protocol to connect to Kali graphically. To enable it, again, we'll need to run one of the following two commands, whichever we want from wherever we want:

- From Kali

```bash
kex --esm --ip -s
```

- From CMD or PowerShell

```powershell
wsl -d kali-linux kex --esm --ip -s
```

If we run it, for example, from Kali, the following happens:

![Starting Win-KeX in Enhanced Session mode](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-12.avif)

The Win-Kex client starts, and after waiting a few seconds, the Windows RDP client will open asking to connect to Kali. We simply say yes and we'll be connected:

![RDP connection to Kali Linux](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-13.avif)

This mode is quite good as it integrates very comfortably with Windows. The only problem I've seen is that it doesn't like it much when you resize the window, as it doesn't adapt:

![Resizing problem in RDP mode](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-14.avif)

It's a good mode if you're going to use full screen all the time, otherwise, I think it's quite a hassle.

## Windows Mode

This is the best mode for me. Basically, it allows having Kali in a separate window in Windows and connected via VNC. In summary, it's the same as being connected via RDP, but in this case the window does resize if you change the size.

To use it, we run one of the following commands:

- From Kali

```bash
kex --win -s
```

- From CMD or PowerShell

```powershell
wsl -d kali-linux kex --win -s
```

If we run it, something similar happens as before, the VNC service will start (for which we'll need to set a password the first time):

![Initial VNC configuration in Kali](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-15.avif)

And after a few seconds, Kali will open in full screen:

![Kali Linux in full screen with VNC](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-16.avif)

In this case, initially it doesn't open in a window or anything, but rather covers the entire screen. To exit and convert it to window mode, we press F8:

![VNC options menu](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-17.avif)

And the VNC menu opens. Here we simply click on Full screen (which will be checked) and then Kali will switch to window mode:

![Kali Linux in window mode](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-18.avif)

And this way we can have Kali in a little Windows window : )

## Shortcut from Windows Terminal

It's possible to create a shortcut in Windows Terminal so that every time we want to use the graphical part, we don't have to remember and write the command. To do this, we go to settings and open the JSON configuration file:

> In this case, I'm going to configure Windows Mode. If you wanted to configure another one, simply check the command in the [official Kali Win-KeX documentation](https://www.kali.org/docs/wsl/win-kex/#windows-terminal).

![Windows Terminal settings](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-19.avif)

![Open JSON configuration file](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-20.avif)

Once we have the file open, we simply need to add the shortcut we want to create to the list. In this case, for Windows Mode it would be the following code:

```json
{
      "guid": "{55ca431a-3a87-5fb3-83cd-11ececc031d2}",
      "hidden": false,
      "name": "Win-KeX",
      "commandline": "wsl -d kali-linux kex --wtstart -s",
},
```

![Windows Terminal JSON configuration](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-21.avif)

Once added, we save the file without any JSON format errors, and if everything is okay, it will appear in the Windows Terminal dropdown:

![Win-KeX shortcut in Windows Terminal](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-22.avif)

If we click on it, the following window opens:

![Starting Win-KeX from Windows Terminal](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-23.avif)

Where we simply need to wait a bit for the service to start, and when it does, Kali will open:

![Kali Linux opened from Windows Terminal](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-24.avif)

## Accessing Kali's File System from Windows

Whatever option we've chosen graphically, it's important to know how we can access Kali's file system from Windows. There are different ways to do this:

From File Explorer:

![Access to Linux in Windows Explorer](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-25.avif)

![Kali-Linux selection in Explorer](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-26.avif)

![Kali file system in Windows](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-27.avif)

From the terminal:

```powershell
\\wsl$\Kali-Linux\
```

![UNC path of Kali Linux in Windows](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-28.avif)

Using Explorer.exe:

Another option we have is to directly run explorer.exe inside Kali, selecting the Kali directory we want to open, for example the current directory:

```bash
explorer.exe .
```

![Open Windows Explorer from Kali](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-29.avif)

## Accessing Windows File System from Kali

On the other hand, how do we access the Windows file system from Kali? Well, basically we can find the mounted disks in the /mnt directory:

![List of mounted disks in mnt](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-30.avif)

![Access to C drive from Kali](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-31.avif)

![Windows file system from Kali](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-32.avif)

## Port Forwarding - From Windows to Kali

Another quite useful thing about using WSL is that we can perform port forwarding from Windows to Kali, that is, if Windows is not using a port and receives a request for whatever on that port, it will forward it to Kali. This is super useful for countless things, such as receiving reverse shells.

Whatever it may be, to configure it we'll need to create the .wslconfig file in the Windows user directory:

![Creation of wslconfig file](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-33.avif)

And we'll write the option you see in the image:

```ini
localhostForwarding=true
```

This way, if for example we create an HTTP server in Kali on port 8000:

![HTTP server in Kali Linux](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-34.avif)

We can access it from Windows by using localhost:

![Access from Windows browser to Kali server](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-35.avif)

![Server content from Windows](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-36.avif)

## References

- [Kali Linux installation guide with Win-KeX on WSL2](https://miloserdov.org/?p=4945&PageSpeed=noscript)
