---
id: "como-hacer-pivoting-con-chisel"
title: "How to Do Pivoting with Chisel"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-10-26
updatedDate: 2021-10-26
image: "https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-0.webp"
description: "Complete guide on how to use Chisel to perform pivoting techniques in Windows and Linux environments, including Local, Remote and Dynamic Port Forwarding."
categories:
  - "linux"
  - "windows"
draft: false
featured: false
lang: "en"
---

Chisel is a super useful tool for use on both Windows and Linux machines. It allows us to conveniently obtain practically the same functions as SSH (in terms of Port Forwarding).

Index

- [Introduction](#introduction)
- [Local Port Forwarding](#local-port-forwarding)
- [Remote Port Forwarding](#remote-port-forwarding)
- [Dynamic Port Forwarding](#dynamic-port-forwarding)

## Introduction

It can be downloaded from its [official Chisel repository on GitHub](https://github.com/jpillora/chisel). There we can find the different packages for different systems, both Windows and Linux:

<figure>

![Chisel packages available for download](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-1.avif)

<figcaption>

Chisel Packages

</figcaption>

</figure>

In this case, the "laboratory" is as follows:

- 3 Machines
  - Kali --\> My attacker machine
    - IP: 192.168.10.10
  - Windows 7 32 Bits
    - IP: 192.168.10.30 and 192.168.20.30 --\> 2 Network Interfaces
  - Debian --\> Web Server and SSH - Port 22 and 80 enabled
    - IP: 192.168.20.20 and 192.168.30.10 --\> 2 Network Interfaces (although the second one is irrelevant for this post)

<figure>

![Pivoting laboratory diagram with Chisel](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-2.avif)

<figcaption>

Lab

</figcaption>

</figure>

Since Chisel is also a tool that works on Windows, we are going to mix both systems, as it is fully compatible.

First of all, we download the corresponding chisel versions for both the Kali machine and the Windows machine, since Chisel works through a client-server architecture. Once downloaded, we make sure it works:

<figure>

![Chisel verification on Kali](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-3.avif)

<figcaption>

Kali

</figcaption>

</figure>

<figure>

![Chisel verification on Windows 7](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-4.avif)

<figcaption>

Windows 7 - 32 Bits

</figcaption>

</figure>

Once we have everything ready, let's see the possibilities that Chisel offers us. Actually, with this tool we can simulate and do all the forwardings that SSH can do, that is:

- Local Port Forwarding
- Remote Port Forwarding
- Dynamic Port Forwarding

And all without the need for SSH, which allows us to practically use Chisel in almost any situation without depending on this protocol. In addition, conceptually, all forwardings work in the same way as in SSH.

## Local Port Forwarding

Knowing that the architecture is client-server, and that we are dealing with Local Port Forwarding, we have to establish the server, in this case, on the Windows machine. To do this, the syntax is quite simple:

```bash
chisel server -p <port>
```

We have to establish a port which will be where chisel runs and the client subsequently connects, so knowing this, I am going to establish the server on port 1234:

<figure>

![Chisel server configuration for Local Port Forwarding](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-5.avif)

<figcaption>

Chisel Server in Local Port Forwarding

</figcaption>

</figure>

With this established, now we just have to go to our Kali to connect as a client, the syntax in this case is a little more complex since we have to specify which IP and port we want to reach:

```bash
chisel client <chisel server address>:<chisel server port> <local port to open>:<address to point to>:<port to point to on the target address>
```

In this case:

<figure>

![Chisel client configuration for Local Port Forwarding](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-6.avif)

<figcaption>

Chisel Client in Local Port Forwarding

</figcaption>

</figure>

As we see, chisel indicates that we have successfully connected, if this were not the case, it would behave as follows:

<figure>

![Chisel connection error](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-7.avif)

<figcaption>

Error if Chisel does not connect

</figcaption>

</figure>

But in this case, we connect without problems. With this, we just have to go to the local port we have opened, in this case port 80, which supposedly is pointing to port 80 of 192.168.20.20 (the web server):

<figure>

![Successful access to web server through tunnel](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-8.avif)

<figcaption>

Web Server

</figcaption>

</figure>

As we see, we arrive without problems.

Chisel also allows tunneling multiple ports at the same time, with the syntax as follows:

A = `chisel client <chisel server address>:<chisel server port>`

B = `<local port to open>:<address to point to>:<port to point to on the target address>`

The syntax for tunneling multiple ports would then be as follows:

A + B + B + B + B... etc...

Example:

<figure>

![Multiple port tunneling with Chisel](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-9.avif)

<figcaption>

Tunneling multiple ports

</figcaption>

</figure>

In addition to port 80, we are tunneling port 22 (SSH), so:

<figure>

![Successful SSH connection through tunnel](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-10.avif)

<figcaption>

SSH Connection

</figcaption>

</figure>

We see that we connect to the machine we have specified.

## Remote Port Forwarding

Unlike Local Port Forwarding, in Remote Port Forwarding, the server is placed on Kali, while the client would be Windows.

The syntax for both the client and the server has some variations, in this case, the commands would be:

- Server --\> Kali

```bash
chisel server -p <port> --reverse
```

- Client --\> Windows

```bash
chisel client <chisel server address>:<chisel server port> R:<port to open on chisel server>:<address to point to>:<port to point to on the target address>
```

Knowing this, we establish the server on our Kali:

<figure>

![Chisel server configuration on Kali](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-11.avif)

<figcaption>

Chisel Server on port 1234

</figcaption>

</figure>

With this, we connect from Windows to our Kali machine:

<figure>

![Windows client connection to Chisel server](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-12.avif)

<figcaption>

Client-Server Connection

</figcaption>

</figure>

If we now look at our Kali we can see how it has connected correctly:

<figure>

![Successful connection confirmation on server](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-13.avif)

<figcaption>

Successful connection with Chisel

</figcaption>

</figure>

Thus, analyzing and bringing the command executed on the client:

```bash
chisel client 192.168.10.10:1234 R:80:192.168.20.20:80
```

We should be able to access port 80 of 192.168.20.20 (the Web Server) from our Kali from our port 80:

<figure>

![Access to web server via Remote Port Forwarding](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-14.avif)

<figcaption>

Accessing the Web Server

</figcaption>

</figure>

As we see, we arrive without problems.

Just like in Local Port Forwarding, we can tunnel multiple ports with the same Chisel connection, it would be done in the same way:

A = `chisel client <chisel server address>:<chisel server port>`

B = `R:<port to open on chisel server>:<address to point to>:<port to point to on the target address>`

The syntax for tunneling multiple ports would then be as follows:

A + B + B + B + B... etc...

Example:

<figure>

![Multiple port tunneling from client](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-15.avif)

<figcaption>

Tunneling 2 Ports from Client

</figcaption>

</figure>

<figure>

![Server response to tunneling](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-16.avif)

<figcaption>

Response to two-port tunneling

</figcaption>

</figure>

This way, we can access not only port 80 of the machine, but also port 22:

<figure>

![SSH connection via multiple tunneling](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-17.avif)

<figcaption>

Successful SSH connection

</figcaption>

</figure>

We see that it works perfectly.

## Dynamic Port Forwarding

With Dynamic Port Forwarding we can tunnel all ports, creating a SOCKS proxy. The operation and use is exactly the same as the SSH proxy.

Chisel allows us to create both a Forward Proxy and a Reverse Proxy. In terms of usage, the Reverse Proxy is used more, for the same reason that Reverse Shells are more famous than Bind Shells. Generally speaking, a Reverse Proxy or a Reverse Shell will give you fewer problems with firewalls than the other two options (Forward and Bind). In any case, whichever proxy you choose, both will do their job.

For each one, the syntax is a little different:

- Forward Proxy
  - Server --\> Windows
    - `chisel server -p <port> --socks5`
  - Client --\> Kali
    - `chisel client <chisel server address>:<chisel server port> <port that will act as proxy>:socks`
- Reverse Proxy
  - Server --\> Kali
    - `chisel server -p <port> --reverse`
  - Client --\> Windows
    - `chisel client <chisel server address>:<chisel server port> R:<port that will act as proxy>:socks`

<figure>

![Laboratory diagram reminder](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-18.avif)

<figcaption>

Lab Reminder

</figcaption>

</figure>

We are going to see both in practice, but first, we configure firefox to use port 1080, which will be the port where in each case each proxy will work (so we don't have to change it).

<figure>

![SOCKS proxy configuration in Firefox](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-19.avif)

<figcaption>

Firefox Configuration

</figcaption>

</figure>

With this ready, let's start.

- Forward Proxy

<figure>

![Server configuration for Forward Proxy](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-20.avif)

<figcaption>

Server

</figcaption>

</figure>

<figure>

![Client configuration for Forward Proxy](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-21.avif)

<figcaption>

Client

</figcaption>

</figure>

This way, if we try to access IP 192.168.20.20 in Firefox:

<figure>

![Successful access via Forward Proxy](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-22.avif)

<figcaption>

Successful connection

</figcaption>

</figure>

We see that we access it.

- Reverse Proxy:

<figure>

![Server configuration for Reverse Proxy](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-23.avif)

<figcaption>

Server

</figcaption>

</figure>

<figure>

![Client configuration for Reverse Proxy](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-24.avif)

<figcaption>

Client

</figcaption>

</figure>

This way, if we try again to access the Web Server:

<figure>

![Successful access via Reverse Proxy](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-25.avif)

<figcaption>

Successful connection

</figcaption>

</figure>

We continue to arrive without problems.

In this case, we are only using the proxy for firefox, but it can be used for other programs or commands. To do this, we can use Proxychains, which will leverage this created SOCKS proxy to route all traffic. This can be seen in more detail in the post about [Pivoting with Proxychains](https://blog.deephacking.tech/en/posts/how-to-do-pivoting-with-proxychains/).
