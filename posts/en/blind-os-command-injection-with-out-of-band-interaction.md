---
id: "blind-os-command-injection-with-out-of-band-interaction"
title: "Blind OS command injection with out-of-band interaction – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-08
updatedDate: 2022-02-08
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-0.webp"
description: "Learn to detect blind command injection vulnerabilities using out-of-band techniques with DNS lookups to external servers."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we're going to solve the PortSwigger lab: "Blind OS command injection with out-of-band interaction".

![PortSwigger lab start page](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-1.avif)

To solve the lab, we need to trigger a DNS lookup to the Burp Suite public server (`burpcollaborator.net`). To do this, we'll use a Blind OS Command Injection found in the feedback function.

![Submit feedback button on the page](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-2.avif)

![Feedback form with fields to fill](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-3.avif)

As we can see, there are several fields to fill out. So let's fill them in:

![Completed form fields](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-4.avif)

Now, before submitting the feedback, we prepare Burp Suite to receive the requests:

![Proxy configuration in browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-5.avif)

![Activating interception in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-6.avif)

With this ready, we submit the feedback to capture the request:

![Submitting the feedback form](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-7.avif)

![Request intercepted in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-8.avif)

This is the request that's sent to the server when submitting feedback. To handle it, we send it to the repeater by pressing Ctrl R:

![Request sent to Burp Suite Repeater](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-9.avif)

Once in the repeater, we can observe how a valid request simply gets a 200 status response and not much else.

However, among all the parameters being sent, we're going to try to see if we can execute a command in any of them, and with that, perform a DNS lookup to the Burp Suite server:

<figure>

![Nslookup command injection for DNS lookup](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-10.avif)

<figcaption>

`$(nslookup burpcollaborator.net)`

</figcaption>

</figure>

When we make this request, if we refresh the page, we'll realize that we've solved the challenge:

![Lab completed successfully](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-11.avif)

In this case, it's true that the best way to tackle "out-of-band" style challenges is to have `Burp Suite PRO` to be able to use the `Burp Collaborator client` feature:

![Burp Collaborator client in Burp Suite PRO](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-12.avif)

In fact, the next and final OS Command Injection challenge (at least as of February 2022) can't be solved without `Burp Suite PRO`.
