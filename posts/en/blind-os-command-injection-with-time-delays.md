---
id: "blind-os-command-injection-with-time-delays"
title: "Blind OS command injection with time delays – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-02
updatedDate: 2022-02-02
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-0.webp"
description: "Learn to exploit blind command injection vulnerabilities using time delays to detect successful command execution on the server."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we're going to solve the PortSwigger lab: "Blind OS command injection with time delays".

![PortSwigger lab start page](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-1.avif)

To solve the lab, we need to cause a 10-second response time delay on the server. To do this, we'll use the OS Command Injection found in the feedback function.

So we head to the "Submit feedback" button:

![Submit feedback button on the page](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-2.avif)

![Feedback form with fields to fill](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-3.avif)

As we can see, there are several fields to fill out. So let's fill them in:

![Completed form fields](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-4.avif)

Now, before submitting the feedback, we prepare Burp Suite to receive the requests:

![Proxy configuration in browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-5.avif)

![Activating interception in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-6.avif)

With this ready, we submit the feedback to capture the request:

![Submitting the feedback form](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-7.avif)

![Request intercepted in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-8.avif)

This is the request that's sent to the server when submitting feedback. To handle it, we send it to the repeater by pressing Ctrl R:

![Request sent to Burp Suite Repeater](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-9.avif)

Once in the repeater, we can observe how a valid request simply gets a 200 status response and not much else.

However, among all the parameters being sent, we're going to try to see if we can execute a command in any of them:

<figure>

![Sleep command injection in the message parameter](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-10.avif)

<figcaption>

`$(sleep 10)`

</figcaption>

</figure>

In the message field, we can escape a command to execute it and thus cause a 10-second response delay on the server, which was what the lab asked us to do.

In this way, we solve the lab:

![Lab completed successfully](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-11.avif)
