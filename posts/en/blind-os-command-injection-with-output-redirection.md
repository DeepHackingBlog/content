---
id: "blind-os-command-injection-with-output-redirection"
title: "Blind OS command injection with output redirection – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-03
updatedDate: 2022-02-03
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-0.webp"
description: "Learn to exploit blind command injection vulnerabilities by redirecting output to accessible files to read the output of executed commands."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we're going to solve the PortSwigger lab: "Blind OS command injection with output redirection".

![PortSwigger lab start page](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-1.avif)

To solve the lab, we need to execute the `whoami` command on the server and read its output. To do this, we'll use a Blind OS Command Injection found in the feedback function.

![Submit feedback button on the page](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-2.avif)

![Feedback form with fields to fill](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-3.avif)

As we can see, there are several fields to fill out. So let's fill them in:

![Completed form fields](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-4.avif)

Now, before submitting the feedback, we prepare Burp Suite to receive the requests:

![Proxy configuration in browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-5.avif)

![Activating interception in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-6.avif)

With this ready, we submit the feedback to capture the request:

![Submitting the feedback form](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-7.avif)

![Request intercepted in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-8.avif)

This is the request that's sent to the server when submitting feedback. To handle it, we send it to the repeater by pressing Ctrl R:

![Request sent to Burp Suite Repeater](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-9.avif)

Once in the repeater, we can observe how a valid request simply gets a 200 status response and not much else.

However, among all the parameters being sent, we're going to try to see if we can execute a command in any of them, and not only that, but also redirect the output to a directory we can access. This way, we can read the output of the command we've executed.

The first thing is to determine which directory we can redirect the command output to. For this, in this case, we're going to use the directory where images are stored, which in this case is indicated in the lab description:
- `/var/www/images`

Knowing this, we're going to try to perform a Blind OS Command Injection by redirecting the command output to a file in the directory above:

<figure>

![Whoami command injection with output redirection](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-10.avif)

<figcaption>

`$(whoami > /var/www/images/whoami.txt)`

</figcaption>

</figure>

Since this is a Blind OS Command Injection, we can't see the output in the server's response. So to confirm if it worked, we'll need to access the file to which we've redirected the command output.

To access the file in question, since we've placed it in a folder called "images", we can assume that it might have been saved in the same path as, for example, the images of product covers on the website:

![Accessing a product image](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-11.avif)

![Image URL showing the filename parameter](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-12.avif)

Images are accessed through the `filename` parameter of the `image` file, so we're going to replace the value of this parameter with the name of the file to which we've redirected the command output, in this case, `whoami.txt`:

![Successful reading of the whoami.txt file](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-13.avif)

In this way, we manage to solve the lab:

![Lab completed successfully](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-14.avif)
