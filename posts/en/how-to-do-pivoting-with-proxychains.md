---
id: "pivoting-con-proxychains"
title: "How to Do Pivoting with Proxychains"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-10-24
updatedDate: 2021-10-24
image: "https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-0.webp"
description: "Learn how to use Proxychains to tunnel traffic from tools like nmap through multiple cascading SOCKS proxies with SSH."
categories:
  - "linux"
draft: false
featured: false
lang: "en"
---

Proxychains is a small Linux program (not available on Windows) that allows us to use tools and other programs through a proxy. As mentioned in the "Pivoting with SSH" post, it's typically used together with Dynamic Port Forwarding (in SSH). If SSH is not available, we can also use chisel.

The "lab" for this post is as follows:

- 4 Machines:
    - Kali: My attacker machine
        - IP: 192.168.10.10
    - Debian 1: SSH service enabled
        - IP: 192.168.10.20 and 192.168.20.10 (2 Network Interfaces)
    - Debian 2: Apache2 and SSH service enabled
        - IP: 192.168.20.20 and 192.168.30.10 (2 Network Interfaces)
    - Debian 3: Apache2 service enabled
        - IP: 192.168.30.20 and 192.168.40.10 (2 Network Interfaces, although the second one is irrelevant for this post)

<figure>

![Lab diagram with four machines for Proxychains](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-1.avif)

<figcaption>

Proxychains Lab

</figcaption>

</figure>

The first thing to do is establish a port as a proxy by connecting via SSH to Debian 1:

<figure>

![SSH command with Dynamic Port Forwarding on port 8080](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-2.avif)

<figcaption>

Proxy established

</figcaption>

</figure>

Having port 8080 already functioning as a proxy, we need to configure proxychains to work on this port so that all traffic is sent through it using the SOCKS protocol.

To configure proxychains, we go to the default configuration path:

```bash
/etc/proxychains.conf
```

```bash
/etc/proxychains4.conf
```

It can be one or the other, check which one you have on your system. Normally it's the second option. In any case, this is the last path where proxychains will check for configuration when used. The PATH (so to speak) where proxychains looks for the configuration file, in order, is as follows:

- Current Directory (`./proxychains.conf`)
- `$(HOME)/.proxychains/proxychains.conf`
- `/etc/proxychains.conf`
- `/etc/proxychains4.conf`

In any case, you can also specify the file to use with the `-f <file>` parameter, like this:

```bash
proxychains -f <file> <command>
```

Knowing this, let's configure the file. In this case, the part to change is at the end of it:

<figure>

![Default Proxychains configuration with SOCKS4](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-3.avif)

<figcaption>

Default configuration

</figcaption>

</figure>

> Note: it's highly recommended to use `socks5` instead of `socks4`. Simply change the 4 to a 5 in the command above.

In the indicated part, we can either change the existing command or comment it out and add another:

<figure>

![Custom Proxychains configuration with port 8080](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-4.avif)

<figcaption>

New configuration

</figcaption>

</figure>

This way we indicate that the proxy is on localhost on port 8080. Now, we save the file. With this, everything is configured for proxychains to work. For a program to be executed sending all traffic through the proxy using proxychains, we use the following syntax:

```bash
proxychains <command>
```

Note: you may notice that both the `proxychains` and `proxychains4` commands exist on your system. If we look at the manual for the first one, we realize it points to proxychains4:

![Proxychains manual showing it points to proxychains4](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-5.avif)

![Proxychains4 manual](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-6.avif)

So it doesn't matter which command you use.

Going back to the topic, we can open Firefox, for example, following the `proxychains <command>` syntax:

![Firefox execution with Proxychains](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-7.avif)

Right now all Firefox traffic is going through the proxy. So if we try to access the web server that we supposedly don't have access to:

![Successful access to web server through Proxychains](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-8.avif)

We see that we can access it!

This same idea is not only applicable to Firefox, but the cool thing is that, for example, we can also use nmap:

<figure>

![Port scanning with nmap using Proxychains](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-9.avif)

<figcaption>

nmap scan through proxy

</figcaption>

</figure>

However, proxychains has the limitation that it only allows TCP connections (that's why I specify the `-sT` argument in the nmap command) and SOCKS4, SOCKS5, and HTTP protocols, so for example a ping won't work since it's ICMP protocol:

<figure>

![Failed ping attempt through Proxychains](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-10.avif)

<figcaption>

Failed ping

</figcaption>

</figure>

It remains in the attempt, but never reaches anything.

This is the useful use of proxychains. The convenient thing, knowing all this, is that in the same way, proxychains allows us to create successive proxies that pull from the previous one. Let me explain: at the point where we are now, if I log in to Debian 2, in the same way we did with Debian 1, we create another port to act as a proxy:

![SSH connection to Debian 2 through Proxychains](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-11.avif)

The arguments that have been added are:

- `-f`: Make SSH go to the background as soon as it connects
- `-N`: Don't execute anything (not even a shell), useful for Port Forwarding

However, if we look closely, the process stays there:

![SSH process in the background](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-12.avif)

With this SSH connection that already pulls from the Debian 1 proxy, we can edit the configuration again:

<figure>

![Current Proxychains configuration with port 8080](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-13.avif)

<figcaption>

Current configuration

</figcaption>

</figure>

<figure>

![Updated configuration with second proxy on port 9090](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-14.avif)

<figcaption>

New configuration

</figcaption>

</figure>

So that in this way, when using proxychains, it pulls from this new Debian 2 proxy (port 9090), which already pulls from the previous connection made (Debian 1 - port 8080):

<figure>

![Firefox executed with cascading Proxychains](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-15.avif)

<figcaption>

Proxychains using port 9090 (which pulls from 8080)

</figcaption>

</figure>

<figure>

![Access to 192.168.30.0/24 network through cascading proxies](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-16.avif)

<figcaption>

We access the 192.168.30.0/24 network

</figcaption>

</figure>

As we can see, we can reach Debian 3. Let's recall the lab diagram:

<figure>

![Lab diagram with four machines for Proxychains](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-17.avif)

<figcaption>

Proxychains Lab

</figcaption>

</figure>

We manage to reach Debian 3 through a SOCKS proxy on Debian 2 which pulls from another SOCKS proxy on Debian 1. All these proxies created, in this case, through SSH. ATTENTION, proxychains will always pull from the last proxy, or at least, the one we specify in the configuration file. So we are limited to accessing the resources that this proxy can reach. What I mean by this is that if for example we have machines: 1 2 3 4 5, and each one only has access to the one on its left or right. If we concatenate several proxies to reach machine 5, once there, we won't be able to access the resources of machine 3, since the proxychains file is currently pulling from proxy 5, and therefore, will have access to what this device has access to.

That said, as I indicated, this procedure can be repeated as many times as we want, even mixing SSH with chisel (or any other tool that does the same thing) in the different hops we make.
