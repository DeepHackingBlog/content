---
id: "como-hacer-pivoting-con-socat"
title: "How to Do Pivoting with Socat"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-11-03
updatedDate: 2021-11-03
image: "https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-0.webp"
description: "Practical guide on how to use Socat to perform pivoting techniques, creating redirections and bidirectional tunnels between multiple machines across different networks."
categories:
  - "linux"
  - "windows"
draft: false
featured: false
lang: "en"
---

Socat is a tool that allows us to create bidirectional communications. It's known as netcat on steroids, as it's such a complete tool that it's almost impossible to see it all, so we're going to focus on the most useful points for pivoting.

- [Introduction](#introduction)
- [Redirections](#redirections)

## Introduction

Socat is a tool for Linux systems, although it also has certain binaries for Windows, but they are not very common. Either way, to download both binaries, the links are as follows:

- [Linux Binaries (32 and 64 Bits)](https://github.com/andrew-d/static-binaries/tree/master/binaries/linux)
- [Windows Binaries (64 Bits)](https://sourceforge.net/projects/unix-utils/files/socat/1.7.3.2/socat-1.7.3.2-1-x86_64.zip/download)

The structure of socat is very simple, however the syntax may seem complex at first:

```bash
socat [options] <source address> <destination address>
```

The syntax for addresses is:

```bash
<protocol>:<ip>:<port>
```

The "laboratory" in which we are going to see its operation is as follows:

- 4 Machines
  - Kali --\> My attacker machine
    - IP: 192.168.10.10
  - Windows 7 64 Bits
    - IP: 192.168.10.40 and 192.168.20.40 --\> 2 Network Interfaces
  - Debian 1
    - IP: 192.168.20.20 and 192.168.30.10 --\> 2 Network Interfaces
  - Debian 2
    - IP: 192.168.30.20

<figure>

![Pivoting laboratory diagram with socat](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-1.avif)

<figcaption>

Laboratory

</figcaption>

</figure>

## Redirections

To practice and see how to make redirections, we are going to try sending ourselves a Reverse Shell from Debian 2 (192.168.30.20) to Kali (192.168.10.10):

First, we start listening from our Kali machine, to have it ready from the beginning:

![Netcat listening on Kali](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-2.avif)

Following the diagram, the machine with which Kali has communication is Windows 7, so we prepare socat on this machine:

![Socat configuration on Windows 7](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-3.avif)

```bash
socat tcp-l:443,fork,reuseaddr tcp:192.168.10.10.443
```

Let's explain the command:

- `tcp-l:443` --\> TCP-L is the abbreviation of TCP-LISTEN, by typing `TCP-L:<port>` we start listening on that port.
- `fork` --\> We indicate that socat can accept more than one connection.
- `reuseaddr` --\> Allows reusing the port after the program finishes.

`fork` and `reuseaddr` are usually always used when listening with socat.

- `tcp:192.168.10.10:443` --\> Remembering that socat handles a structure of \<source\> \<destination\>, in this case we are indicating that the destination is port 443 of the address 192.168.10.10.

Knowing the arguments of the command used, at a conceptual level we are basically saying that everything the Windows machine receives on port 443, it should send to port 443 of the Kali machine, which is where we are listening.

With this ready, we go to the machine with which Windows has communication (besides Kali), there we are also going to execute socat using the same concept:

![Socat configuration on Debian 1](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-4.avif)

The command is basically the same, everything that Debian receives on port 443, I will send to port 443 of the Windows machine. Where the Windows machine will send everything it receives to port 443 of the Kali machine. This way, with this entire structure already set up, if from Debian 2 we send ourselves a Shell to port 443 of Debian 1, we will get the Reverse Shell on Kali:

![Sending reverse shell from Debian 2](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-5.avif)

![Reverse shell received on Kali](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-6.avif)

If we notice, we get the connection from the Windows IP, all thanks to the redirections. Moreover, the Shell is fully functional:

![Functional shell verification](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-7.avif)

This is an example of redirections to get a Reverse Shell, however, we can also use socat for, for example, internal redirections. That is, let's imagine the situation where I have a web server running on my Kali, but only accessible internally, I could tunnel it to another port using socat:

From Windows, the Web Server on my Kali is not accessible:

![Web server inaccessible from Windows](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-8.avif)

But inside our Kali we can make a redirection:

![Port redirection with socat on Kali](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-9.avif)

This way, we are opening port 8080 and listening, and everything we receive on this port, we redirect to our local port 80.

With this, if we try to access port 8080 from Windows:

![Successful access to web server through port 8080](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-10.avif)

We see that we can access server 80, which despite being only open internally, we can access it.

So far the IP address has not changed, it has always been 127.0.0.1 when we have pointed to somewhere, however, socat allows us to place any IP.

Example:

![Socat redirection with specific IP](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-11.avif)

This way we are telling it that in addition to listening on port 777, everything received on this port should be sent to port 80 of the Kali machine (now accessible), where the web server is:

![Successful access from port 777](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-12.avif)

And we see that we access without problems from local port 777.

And that's it for the functionalities of socat that can be very useful for pivoting. Socat is a great and complex tool, here we have only seen the part focused on connection redirection. We will see more things in other posts. And as I learn more about Pivoting with Socat, it will also be added.
