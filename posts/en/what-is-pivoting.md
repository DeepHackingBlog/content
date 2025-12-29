---
id: "que-es-el-pivoting"
title: "What is Pivoting?"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-10-17
updatedDate: 2021-10-17
image: "https://cdn.deephacking.tech/i/posts/que-es-el-pivoting/que-es-el-pivoting-0.webp"
description: "Learn what pivoting is in cybersecurity, how to use compromised machines to access internal networks, and post-exploitation enumeration techniques."
categories:
  - "linux"
  - "windows"
draft: false
featured: false
lang: "en"
---

When we compromise a machine, while enumerating it, we may notice that it has access to other machines or even networks that we cannot directly access.

This means we will need to use the compromised machine as a "jump box" to gain access to internal networks and other machines. This process can be repeated recursively.

Graphical example:

<figure>

![Pivoting diagram in an enterprise network](https://cdn.deephacking.tech/i/posts/que-es-el-pivoting/que-es-el-pivoting-1.avif)

<figcaption>

Pivoting

</figcaption>

</figure>

In this image, we can see that from an entire enterprise network, we only have access to one machine, which acts as a boundary between the internal and external network. It is through this machine that we execute pivoting to jump to another machine, and we repeat the process until we reach a critical server.

Basically, the complete methodology is as follows:

1. Pivoting
2. Post-Exploitation Enumeration
3. Exploitation
4. Return to step 1

In this regard, once we have compromised an asset, the enumeration to discover other networks or machines will vary in each case. However, there are certain patterns that are generally maintained and that we can follow.

We can start by checking the machine's ARP cache for new IPs. On both Windows and Linux, this can be viewed using the `arp -a` command.

Next, we can take a look at the hosts files. The path to this file is as follows:

- Linux --> `/etc/hosts`
- Windows --> `C:\Windows\System32\drivers\etc\hosts`

On Linux, the `/etc/resolv.conf` file might also help us discover DNS servers. An alternative to this file is running the command: `nmcli dev show`. The equivalent on Windows would be using the command `ipconfig /all`.

We could also check the routing table on Linux with the command `route -n` or `ip route`. Or check if there is already an established connection with any host using the command `netstat -auntp`.

Finally, don't forget to check the different network interfaces the machine has:

- Linux --> `ifconfig`, `ip -4 addr`, `/proc/net/fib_trie`
- Windows --> `ipconfig`

At this point, additional enumeration will depend on each case, but in general terms, this is what's common.

Once we have information about which machines or network we want to reach, pivoting can be accomplished using:

- Pre-installed tools on the compromised machine.
- If none are available, use static binaries of tools.

> The difference between a static binary and a dynamic one is in the compilation. Most programs use external libraries for their operation. A static binary includes these required libraries within the compilation, while a dynamic binary requires them from the operating system. This means you need the operating system to have those libraries, otherwise it won't work. Therefore, a static binary solves potential dependency issues.

- Scripting.
- Proxies.

> Proxies should be the last option to use, as they tend to be somewhat slow and usually have limitations on the type of traffic they can transmit. For example, with a TCP proxy, you won't be able to use UDP traffic.

That's everything regarding what we can use to execute pivoting.

Returning to the general idea of pivoting, we've mentioned a lot that its purpose is to access other machines that we don't have access to because they're not on our network. However, this is not the only use. Pivoting can also be useful for a machine we already have direct access to.

For example, sometimes a machine may not show us all the open ports it actually has, or it may block us in various ways. In these cases, we can try to do the same thing but through another machine on the same network. Who knows if, based on how it's configured, it has a whitelist of which machines to block or not block for certain things.

Knowing how to pivot can also help us externally expose or tunnel ports that are only open internally on the machine, allowing us to interact from outside or directly from our own machine.

For this reason, pivoting is not only useful for accessing other networks, but can also help us interact with machines on our own network.
