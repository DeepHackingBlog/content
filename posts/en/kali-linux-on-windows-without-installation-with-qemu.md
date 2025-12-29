---
id: "kali-linux-en-windows-sin-instalacion-con-qemu"
title: "Kali Linux on Windows Without Installation or Administrator Privileges with Qemu"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-11-12
updatedDate: 2024-11-12
image: "https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-0.webp"
description: "Learn how to run Kali Linux on Windows without needing administrator privileges or installation using Qemu as a portable emulator."
categories:
  - "linux"
  - "windows"
draft: false
featured: false
lang: "en"
---

Everyone knows how to install Kali Linux on VMWare or VirtualBox. Or if you're also a loyal follower of the blog, you'll also know how to do it on [WSL2](https://blog.deephacking.tech/en/posts/kali-linux-on-windows-through-wsl2/) and [Docker](https://blog.deephacking.tech/en/posts/kali-linux-on-docker/). Now, what happens if we find ourselves in such a restrictive environment that we don't even have administrator privileges or even internet access to install any of the previously mentioned options?

Well, even though it may not seem like it, even in such a situation it's possible to run Kali Linux without needing administrator privileges. This is possible thanks to tools like Qemu, which act as emulators and allow running an operating system without the need to interact directly with hardware resources, as traditional hypervisors do.

Today we're going to see how to do it 🤭

- [Kali Linux with Qemu](#kali-linux-with-qemu)
- [Conclusion](#conclusion)
- [References](#references)

## Kali Linux with Qemu

For those who don't know it, [Qemu](https://www.qemu.org/) is an open-source tool that allows emulating different hardware architectures and running operating systems in virtualized environments. The great advantage of Qemu is that, being an emulator and not a hypervisor, it doesn't require administrator privileges to function. This is because it completely emulates the necessary hardware to run the operating system, instead of interacting directly with the host machine's components, as a hypervisor would (for example, VMWare or VirtualBox).

And although Qemu is one of the most well-known emulators, this technique we'll see today can be replicated with other emulators as well. So with that said, the first thing we'll need to do is [download Qemu from its official Windows binaries page](https://qemu.weilnetz.de/w64/).

In this case, I'll download the latest version available today:

![Qemu download page showing the latest available versions](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-1.avif)

Once downloaded, we can observe how the administrator execution symbol appears, and if we open it to install it, it will ask for administrator user credentials because my current user doesn't have privileges:

![Qemu installer showing the administrator shield symbol](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-2.avif)

![UAC window requesting administrator credentials](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-3.avif)

Well, in this situation the solution is simple, we extract the .exe using, for example, 7z:

![7-Zip context menu showing extraction options](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-4.avif)

Once it's extracted, we'll get something very similar to a Portable Qemu, we'll get all the Qemu source files:

![Folder with files extracted from the Qemu installer](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-5.avif)

![Contents of the Qemu folder showing executable files and libraries](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-6.avif)

Once we have this, it's time to download Kali Linux, specifically we'll need to download the "Live Boot" version:

![Kali Linux downloads page with available options](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-7.avif)

![Selection of the Kali Linux Live Boot version for download](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-8.avif)

Once we have the ISO downloaded, we'll move it to the Qemu folder:

![Kali Linux ISO located in the Qemu folder](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-9.avif)

At this point, it's time to open the terminal in the Qemu folder and execute the following commands:

```powershell
.\qemu-img create -f qcow2 testing-image.img 20G
```

![Terminal showing the creation of the virtual disk image](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-10.avif)

This command creates a virtual disk image to use with Qemu.

- qemu-img: Is Qemu's utility for creating, converting, and modifying disk images.
- create: Specifies that a new disk image is going to be created.
- \-f qcow2: Defines the disk image format. In this case, it's qcow2, which is a space-efficient format that allows features like snapshots and compression.
- testing-image.img: Is the name of the file that will contain the disk image.
- 20G: Specifies the size of the disk image, in this case, 20 gigabytes.

Once we've created this disk image, it's time to run a virtual machine using this image and the Kali ISO we downloaded:

```powershell
.\qemu-system-x86_64 -m 2048 -boot d -smp 2 -net nic,model=virtio -net user -hda testing-image.img -cdrom kali-linux-2024.2-live-amd64.iso
```

- qemu-system-x86\_64: Is Qemu's utility that starts a virtual machine with a 64-bit architecture (x86\_64).
- \-m 2048: Assigns 2048 MB (2 GB) of RAM to the virtual machine.
- \-boot d: Indicates that the virtual machine should boot from device "d", which is normally the CD/DVD drive (in this case, the ISO).
- \-smp 2: Configures the virtual machine to use 2 CPU cores (simulating a 2-core processor).
- \-net nic,model=virtio: Creates a virtual network card in the machine, using the virtio model, which is optimized for virtualization.
- \-net user: Configures the virtual machine's network in "user" mode, which allows access to the external network without requiring additional configurations on the host system.
- \-hda testing-image.img: Uses the testing-image.img file as the virtual machine's hard drive.
- \-cdrom kali-linux-2024.2-live-amd64.iso: Mounts the Kali Linux ISO file as if it were a CD/DVD inside the virtual machine, from which the boot will be performed.

![Qemu window running the Kali Linux boot](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-11.avif)

![Kali Linux Live Boot startup menu](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-12.avif)

It may take a few minutes to load, but once finished you'll have a fully functional Kali Linux with internet (and intranet) connection, without needing administrator permissions or installation.

![Kali Linux desktop running in Qemu](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-13.avif)

![Kali Linux terminal showing successful internet connection](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-14.avif)

## Conclusion

The most interesting thing about running Kali Linux this way is that it's completely portable. We can prepare the Qemu folder with the Kali ISO on our computer and move it to any computer without needing installation. As mentioned earlier, it's not necessary to have an internet connection at the time of execution, as long as everything has been prepared beforehand.

Additionally, this method is not limited to Kali Linux. Qemu can be used to emulate other operating systems without requiring administrator privileges, making it a super useful and flexible tool for restrictive environments.

## References

- [Run Kali Linux on Windows without admin rights or installation - Mark Mo](https://medium.com/@markmotig/run-kali-linux-on-windows-without-admin-rights-or-installation-2699b2537d13)
- [Virtual machine on Windows 11 without admin - Darren](https://darrengoossens.wordpress.com/2024/02/03/virtual-machine-on-windows-11-without-admin/)
