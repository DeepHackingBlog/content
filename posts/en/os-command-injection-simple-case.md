---
id: "os-command-injection-simple-case"
title: "OS command injection, simple case - PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-01
updatedDate: 2022-02-01
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-0.webp"
description: "Step-by-step solution for PortSwigger's OS command injection, simple case lab. Learn how to exploit operating system command injection vulnerabilities."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we're going to solve the PortSwigger lab: "OS command injection, simple case".

![OS command injection lab cover](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-1.avif)

To solve the lab, we need to execute the `whoami` command on the server. To do this, we need to exploit the OS Command Injection vulnerability found in the product stock checking feature.

So let's navigate to any product on the website:

![Product page in the lab](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-2.avif)

Inside the selected product, we can see that it has a section to check the stock:

![Section to check product stock](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-3.avif)

If we click on it:

![Stock check result](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-4.avif)

It simply shows us the product stock. Now, let's intercept the request that the client makes when clicking this button, and at the same time, prepare Burp Suite to receive it:

![Burp Suite configuration for interception](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-5.avif)

![Activating intercept in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-6.avif)

![Preparation to capture the request](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-7.avif)

![Request intercepted in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-8.avif)

Once the request is intercepted, we send it to the Repeater by pressing `Ctrl + R`:

![Request sent to Repeater](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-9.avif)

As we can see, it's a normal request. However, let's try changing the value of `storeId`:

![Modifying the storeId value](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-10.avif)

We see an sh error, which means that the value of `storeId` is being passed to a Linux program. Knowing this, we can try a fairly simple OS Command Injection:

![Executing whoami on the server](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-11.avif)

In this case, simply using a semicolon to separate the value so it's treated as another command allows us to isolate the whoami command from what comes before it and have it execute. This way, we successfully solve the lab:

![Lab solved](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-12.avif)
