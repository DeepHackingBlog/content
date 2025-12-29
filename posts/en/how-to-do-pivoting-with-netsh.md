---
id: "como-hacer-pivoting-con-netsh"
title: "How to Do Pivoting with Netsh"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-11-04
updatedDate: 2021-11-04
image: "https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-0.webp"
description: "Learn to perform pivoting and port forwarding on Windows using Netsh, a native utility that allows port tunneling and firewall control."
categories:
  - "windows"
draft: false
featured: false
lang: "en"
---

Netsh is a Windows utility that allows us to do Port Forwarding in a very simple way. Additionally, the advantage is that it comes installed by default on Windows, although the disadvantage is that administrator privileges are necessary to use it (at least for Port Forwarding and firewall control).

- [Introduction](#introduction)
- [Port Forwarding with netsh](#port-forwarding-with-netsh)
- [Firewall Control with netsh](#firewall-control-with-netsh)

## Introduction

The 3 commands we are going to use are the following:

1. `netsh interface portproxy add v4tov4 listenport=<port to listen> listenaddress=<address to listen> connectport=<port to connect> connectaddress=<address to connect>`
2. `netsh interface portproxy show all`
3. `netsh interface portproxy reset`

The lab for this post is as follows:

- 3 Machines
    - Kali
        - IP: 192.168.10.10
    - Windows 7
        - IP: 192.168.10.40 and 192.168.20.40 –> 2 Network Interfaces
    - Debian –> Web and SSH Server – Port 22 and 80 enabled
        - IP: 192.168.20.20

<figure>

![Netsh pivoting lab diagram](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-1.avif)

<figcaption>

Lab

</figcaption>

</figure>

## Port Forwarding with netsh

Being on the Windows machine and having administrator privileges, we can check the netsh Port Forwarding table with the following command:

`netsh interface portproxy show all`

![Empty Port Forwarding table](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-2.avif)

It shows us nothing, so it's empty. So with the following command, we are going to do the Port Forwarding of the ports we want:

`netsh interface portproxy add v4tov4 listenport=<port to listen> listenaddress=<address to listen> connectport=<port to connect> connectaddress=<address to connect>`

![Port Forwarding configuration with netsh](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-3.avif)

In the command, 4 parameters are configured, each one serves the following purpose:

- `listenport` --> We specify the port on which Windows will listen and that will serve as tunneling for the address and port we connect to.
- `listenaddress` --> We specify the network address on which the port specified in `listenport` will listen. This will indicate the interface on which it will listen.
- `connectport` --> We specify the port of the address we want to reach
- `connectaddress` --> We specify the address we want to reach

As we see in the image, in principle nothing appears, no error or anything that says "something has happened". However, if we now execute the previous command to see the netsh table:

![Configured Port Forwarding table](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-4.avif)

We can see how what we told it in the commands above has been established. Note: as explained in the `listenaddress` parameter, it is important to correctly indicate the address on which we listen, if we indicated for example 127.0.0.1 it will only be accessible from Windows itself. However, by indicating 192.168.10.40 (which is also the Windows IP), the port will work on the 192.168.10.0/24 interface, and therefore, it will be accessible to those who have access to this network. Although we can also save ourselves the trouble, if we don't specify the `listenaddress` parameter, it will listen on all interfaces:

![Port Forwarding listening on all interfaces](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-5.avif)

With this, Windows would already be performing Port Forwarding, so we are going to verify it from our Kali:

![Verification of tunneling from Kali](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-6.avif)

We see that it tunnels both ports perfectly. And it really is as simple as that. Additionally, netsh saves the Port Forwarding configuration in the following registry:

`HKLM:\SYSTEM\CurrentControlSet\Services\PortProxy\v4tov4\tcp`

![Port Forwarding registry location](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-7.avif)

![Port Forwarding registry content](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-8.avif)

If we wanted to delete/reset the netsh table (the registry entries are also deleted), we could do it with the following command:

`netsh interface portproxy reset`

![Reset of the netsh table](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-9.avif)

![Reset netsh table](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-10.avif)

And in this way we would eliminate any tunneling we are doing, in addition to their respective registry entries.

## Firewall Control with netsh

Another very useful aspect that netsh has is that it allows us to control the Windows firewall, adding rules so that for example a port that is only accessible internally, is shown to the outside. That is, if for example a machine had SMB only accessible internally (this means that it is running, but only internally, if it were not running it would be useless), and we had administrator credentials to use with PsExec, we could use netsh so that the SMB port is shown to the outside and thus achieve persistence with PsExec.

In this aspect, the commands to add rules are as follows:

- Inbound traffic:

`netsh advfirewall firewall add rule name=<rule name> protocol=TCP dir=in localport=<port> action=allow`

![Firewall rule for inbound traffic](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-11.avif)

- Outbound traffic:

`netsh advfirewall firewall add rule name=<rule name> protocol=TCP dir=out localport=<port> action=allow`

![Firewall rule for outbound traffic](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-12.avif)

In this way the port would already be exposed externally. There are many other options regarding the firewall, but at a practical level, if we needed one for pivoting, it would be this one, the ability to show internal ports externally.

Netsh as we have seen, is a very convenient tool for pivoting thanks to the fact that it comes by default on Windows. The only requirement as already mentioned, is to have Administrator privileges.
