---
id: "como-configurar-ip-forwarding-en-linux"
title: "How to Configure IP Forwarding on Linux"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-11-06
updatedDate: 2021-11-06
image: "https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-0.webp"
description: "Practical guide to configure a Linux system as a router using IP Forwarding and static routes with ip route"
categories:
  - "linux"
draft: false
featured: false
lang: "en"
---

We can configure a Linux system as a router quite easily. The idea is to check if IP Forwarding is enabled on the Linux machine we'll use as a router, which is what allows packet forwarding. By default, this setting will be disabled.

For this post we'll be using the following machines:
- 3 Computers:
    - Kali -> My attacking machine
        - IP: 192.168.10.10
    - Debian 1 -> Will act as Router
        - IP: 192.168.10.20 and 192.168.20.10 -> 2 Network Interfaces
    - Debian 2 -> Apache 2 server enabled
        - IP: 192.168.20.20

![Network topology with three computers](https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-1.avif)

To check this, we'll need to look at the contents of the `/proc/sys/net/ipv4/ip_forward` file.

![Contents of ip_forward file showing value 0](https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-2.avif)

If it's disabled, the content will be 0, so if we want to enable it, we'll need to change its content to 1:

```bash
echo '1' > /proc/sys/net/ipv4/ip_forward
```

![Enabling IP Forwarding with value 1](https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-3.avif)

Having this value enabled on Debian 1, all that's left is to add static routing.

HEADS UP! Important, we'll need to add the static route to our Kali of course, but let's not forget that we'll also need to add it to the machine we want to interact with on the other network (Debian 2), so that the responses know how to reach us.

We can view static routes with the following command:

![ip route show command displaying static routes](https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-4.avif)

We can add and remove static routes as we please with the following commands (root access required):
- Add: `ip route add <destination network ip>/<network mask in CIDR> via <router ip> dev <interface to use>`
- Remove: `ip route delete <destination network ip>/<network mask in CIDR> via <router ip> dev <interface to use>`

So, in this case, the routes to add on both Kali and Debian 2 would be the following:
- Kali:

![Adding static route on Kali](https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-5.avif)
- Debian 2:

![Adding static route on Debian 2](https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-6.avif)

Having IP Forwarding already enabled on Debian 1 and the static routes on both Kali and Debian 2, we can now communicate between these two devices without any problem:

![Successful ping from Kali to Debian 2](https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-7.avif)

![HTTP access from Kali to Apache server on Debian 2](https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-8.avif)

![Apache server running successfully](https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-9.avif)

And with this we would have successfully configured a Linux system as a router, in addition to using `ip route` to add routes that we don't have by default.
