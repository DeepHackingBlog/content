---
id: "como-hacer-pivoting-con-shuttle"
title: "How to Do Pivoting with Sshuttle"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-11-05
updatedDate: 2021-11-05
image: "https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-shuttle/como-hacer-pivoting-con-shuttle-0.webp"
description: "Practical guide on how to use Sshuttle to perform pivoting by simulating a VPN through SSH connections between different networks."
categories:
  - "linux"
draft: false
featured: false
lang: "en"
---

Sshuttle is a program that allows you to simulate almost a VPN through an SSH connection.

The basic usage of `sshuttle` is:

```bash
sshuttle -r <user>@<ssh server> <network IP where the VPN will operate>/<network mask in CIDR>
```

![SSH connection with sshuttle](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-shuttle/como-hacer-pivoting-con-shuttle-1.avif)

This way, we connect via SSH using `sshuttle`.

If we added the `-N` argument, it will try to guess the network IP where the VPN will operate, so we wouldn't need to specify it if we use this argument.

With this, if for example, our network is `192.168.0.0/24` and we connect to an SSH server (`192.168.0.10`) that is on the same network as ours, but this server also has access to the `192.168.30.0/24` network, the command to use would be the following:

```bash
sshuttle -r <user>@192.168.0.10 192.168.30.0/24
```

Since the network we want the "VPN" connection to operate on is `192.168.30.0/24`.

Sshuttle has some advantages and disadvantages, unlike for example `proxychains`, if we launch several VPNs one on top of the other, going through different networks, we will always be able to access the resources of each of them without taking into account the network of the last VPN connection we have launched. However, `sshuttle` does not allow the use of for example ICMP traces or `nmap`, but if we tried to reach a web server, we would get there without problems:

![Access to web server through sshuttle](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-shuttle/como-hacer-pivoting-con-shuttle-2.avif)

So in this aspect, this is the disadvantage of Sshuttle, the inability to use `nmap`, `ping`, etc., in addition to the fact that you need administrator privileges to be able to use it:

![Sshuttle requires administrator privileges](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-shuttle/como-hacer-pivoting-con-shuttle-3.avif)

So far, if we look closely, we can see how we have logged in with credentials via SSH, but what happens if we only have access through a private key? Sshuttle in principle does not accept logging in using a private key, however it can be bypassed as follows:

```bash
sshuttle -r <user>@<ssh server> --ssh-cmd "ssh -i <private key file>" <network IP where the VPN will operate>/<network mask in CIDR>
```

Example:

![Connection with sshuttle using private key](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-shuttle/como-hacer-pivoting-con-shuttle-4.avif)

This way we can log in using a private key.

If in any of the uses of `sshuttle` we get an error like this:

```
client: Connected.
client_loop: send disconnect: Broken pipe
client: fatal: server died with error code 255
```

We can solve it with the `-x` parameter, which allows us to exclude an IP from the range where the VPN will operate. This problem could occur if the device we are connecting to belongs to the network where we want the VPN to operate. In any case, if we get this error we would do the following:

```bash
sshuttle -r <user>@<ssh server> <network IP where the VPN will operate>/<network mask in CIDR> -x <ssh server>
```

This way, we would exclude the SSH server from the VPN, so to speak.

In addition to everything we have seen so far, `sshuttle` has the option for our DNS requests to also go through the proxy, so that we use the DNS servers that the machine (SSH Server) has configured. The argument to add to the command line would simply be `--dns`. We can add it either at the beginning or at the end.

Finally, another argument that `sshuttle` has is `-D`, which basically sends the connection to the background when we connect:

![Running sshuttle in the background with -D parameter](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-shuttle/como-hacer-pivoting-con-shuttle-5.avif)

And that's it for the functionalities of `sshuttle`, at least the most important and common ones.
