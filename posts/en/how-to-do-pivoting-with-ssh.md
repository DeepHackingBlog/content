---
id: "pivoting-con-ssh"
title: "How to Do Pivoting with SSH"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-10-22
updatedDate: 2021-10-22
image: "https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-0.webp"
description: "Complete guide on SSH pivoting using Local, Remote, and Dynamic Port Forwarding to tunnel connections through intermediate servers."
categories:
  - "linux"
  - "windows"
draft: false
featured: false
lang: "en"
---

Pivoting through SSH is one of the most convenient methods. If you have the opportunity to perform port forwarding with this protocol, it's one of the best options.

Table of Contents:

- [Introduction](#introduction)
- [Local Port Forwarding](#local-port-forwarding)
- [Remote Port Forwarding](#remote-port-forwarding)
- [Dynamic Port Forwarding](#dynamic-port-forwarding)

## Introduction

SSH allows us 3 modes of port forwarding:

- Local Port Forwarding
- Remote Port Forwarding
- Dynamic Port Forwarding

The "lab" for this post is as follows:

- 3 Machines:
    - Kali: My attacker machine
        - IP: 192.168.10.10
    - Debian: SSH service enabled
        - IP: 192.168.10.20 and 192.168.20.10 (2 Network Interfaces)
    - Debian: Apache2 server enabled
        - IP: 192.168.20.20 and 192.168.30.10 (2 Network Interfaces, although the second one is irrelevant for this post)

<figure>

![Lab diagram with three machines for SSH pivoting](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-1.avif)

<figcaption>

Lab

</figcaption>

</figure>

The goal is to reach the Debian that has the web server from Kali. Based on how the networks are distributed above, we can quickly realize that there is no direct connection between one machine and another. However, we're going to take advantage of the Debian that acts as an SSH server and also has a connection to both networks to be able to reach the web server from Kali.

## Local Port Forwarding

In this case, we take advantage of the SSH session to open a port on our Kali that will redirect to the selected machine and ports, using the server we connect to via SSH as pivoting.

The syntax and idea is as follows:

<figure>

![Local Port Forwarding syntax with SSH](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-2.avif)

<figcaption>

Syntax

</figcaption>

</figure>

With this in mind, we proceed:

<figure>

![SSH command with Local Port Forwarding from Kali](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-3.avif)

<figcaption>

Kali - SSH Server Connection

</figcaption>

</figure>

As we can see, the syntax used is:

```bash
ssh -L 80:192.168.20.20:80 sikumy@192.168.10.20
```

Explained in words, it's as follows:

With the `-L` parameter, we indicate that we want to do Local Port Forwarding. The first port we specify is the port we open locally that will tunnel to the service. Subsequently, the specified IP and port is what we want to access and reach from our local port. All of this through the machine on which we start an SSH session.

So at this point, if we go to the browser while keeping the SSH session open and go to the address: http://localhost/, we'll see the web server:

<figure>

![Web server accessible from localhost through SSH tunnel](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-4.avif)

<figcaption>

Web Server tunneled to localhost

</figcaption>

</figure>

This way, we can access all ports of all IPs that the SSH server has access to.

When we close the connection we will also lose the port forwarding:

<figure>

![SSH session closed with exit](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-5.avif)

<figcaption>

End of SSH Connection

</figcaption>

</figure>

<figure>

![Connection error when closing SSH tunnel](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-6.avif)

<figcaption>

End of Web Server Connection

</figcaption>

</figure>

## Remote Port Forwarding

Remote Port Forwarding is a bit different from Local Port Forwarding. It doesn't change much at the syntax level but it does at the conceptual level.

The syntax in this case is as follows:

```bash
ssh -R <port to open on the machine you connect to>:<address to point to>:<port to point to on the address> <user>@<kali address>
```

The peculiarity of Remote Port Forwarding is that we don't start a session on the SSH server we have defined in the lab. Instead, in this case, it's the reverse, from the SSH server we have, we start a session on our Kali machine (we would need to enable the SSH service).

Looking at it from the attacker and victim point of view, if we treat Kali as the attacker and Debian (SSH server) as the victim, we can realize that on the victim machine, we would be entering credentials from our machine. From a security standpoint, this is not optimal, which is why Local Port Forwarding is always used, as it doesn't have this danger.

So, returning to practice, we would execute the following on Debian (SSH server):

<figure>

![SSH command with Remote Port Forwarding from Debian to Kali](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-7.avif)

<figcaption>

Login Session on Kali

</figcaption>

</figure>

As we can see, the command for Remote Port Forwarding is:

```bash
ssh -R 80:192.168.20.20:80 user@192.168.10.10
```

This way, since we're starting a session on Kali, we're telling it to open port 80 and point to the Debian that acts as a web server. We can do this because the Debian from which we connect has access to both networks, therefore it's possible to connect them.

With this done, if we go to localhost from Kali:

<figure>

![Web server accessible from Kali through Remote Port Forwarding](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-8.avif)

<figcaption>

Localhost

</figcaption>

</figure>

We can see that we can perfectly access the web server.

And just like in Local Port Forwarding, the moment we close the SSH session, we lose the connection:

<figure>

![SSH session closed with exit in Remote Port Forwarding](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-9.avif)

<figcaption>

exit

</figcaption>

</figure>

<figure>

![Connection error when closing Remote Port Forwarding tunnel](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-10.avif)

<figcaption>

Connection lost

</figcaption>

</figure>

## Dynamic Port Forwarding

This can be the most peculiar type of Port Forwarding but very useful in certain situations. Dynamic Port Forwarding, in a summarized and loosely speaking way, allows us to tunnel all ports of the entire network that the SSH server has access to. This happens because with this mode, we can make SSH act as a SOCKS proxy:

<figure>

![SOCKS proxy definition](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-11.avif)

<figcaption>

SOCKS Proxy Definition

</figcaption>

</figure>

The syntax to achieve this is the simplest of all:

```bash
ssh -D <local port that will act as proxy> <user>@<IP>
```

Therefore:

<figure>

![SSH command with Dynamic Port Forwarding creating SOCKS proxy](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-12.avif)

<figcaption>

SSH Connection with Dynamic Port Forwarding

</figcaption>

</figure>

This way, we now have a SOCKS proxy on our local port 8080.

If, for example, from Firefox, we go to "Settings > Network Settings", we can tell it to use this port as a SOCKS proxy:

<figure>

![SOCKS proxy configuration in Firefox](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-13.avif)

<figcaption>

Proxy Configuration in Firefox

</figcaption>

</figure>

Now, we no longer need to access localhost as we did in Local or Remote Port Forwarding. This way, we can go directly:

<figure>

![Direct access to web server using SOCKS proxy](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-14.avif)

<figcaption>

Web Server through SOCKS Proxy

</figcaption>

</figure>

As we can see, it appears as if we were on the same network as the web server. The question at this point is:

- Can we use this with other tools, for example, nmap?

Well, we can indeed use nmap as well as other utilities. It's true that there are certain limitations, but we can, and sometimes it's very useful. To do this we'll use Proxychains.

## Conclusion + Important Info

Something I haven't mentioned until now is that in any of the 3 modes, you can use as many arguments as you want, meaning you can put multiple -L to create multiple Local Port Forwarding in the same session. This also applies to Remote and Dynamic Port Forwarding.

Example with Dynamic:

<figure>

![Creating two simultaneous SOCKS proxies with SSH](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-15.avif)

<figcaption>

2 SOCKS Proxies

</figcaption>

</figure>

This way, we can tunnel as many ports as we want (if we're talking about local and remote).

And these are the three main ways to do pivoting with SSH. Additionally, as an extra fact, all connections work on top of the security layer provided by this protocol, so all connections will be encrypted.
