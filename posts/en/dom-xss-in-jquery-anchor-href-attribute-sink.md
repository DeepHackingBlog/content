---
id: "dom-xss-in-jquery-anchor-href-attribute-sink"
title: "DOM XSS in jQuery anchor href attribute sink using location.search source – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-08
updatedDate: 2022-03-08
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-0.webp"
description: "Learn how to exploit a DOM XSS in jQuery href attribute using location.search in PortSwigger Lab. Step-by-step guide to execute JavaScript code by leveraging vulnerabilities in anchor href attributes."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we're going to be solving the lab: "DOM XSS in jQuery anchor href attribute sink using location.search source":

![DOM XSS in jQuery anchor href attribute sink lab start screen](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-1.avif)

In this case, to solve the lab we need to execute an `alert` that returns the cookies.

First of all, let's access the lab:

![Lab main page showing blog articles](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-2.avif)

Once we access it, we navigate to the submit feedback section, since the statement indicates that's where the XSS is located:

![Submit feedback button on the main page](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-3.avif)

![Lab feedback submission form](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-4.avif)

When we access it, if we look at the URL, we can see that by default the `returnPath` parameter is added:

![URL showing returnPath parameter in the address bar](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-5.avif)

Let's try adding any value to the parameter:

![returnPath parameter modified with test value](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-6.avif)

In principle, nothing happens, but if we hover the mouse over the `Back` hyperlink:

![Inspection of Back hyperlink showing injected value](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-7.avif)

We can see how the value we placed in the variable is implemented in the `href` attribute of this element. So it's as simple as placing a payload that executes the `alert` when we click the button:
- `javascript:alert(document.cookie)`

![JavaScript payload injected in the returnPath parameter](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-8.avif)

As we can see, we successfully solve the lab, and from the source code perspective, what we've achieved is the following:

![HTML source code showing href attribute with JavaScript payload](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-9.avif)

Now, if we click on the `Back` hyperlink:

![Lab solved successfully message](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-10.avif)

The JavaScript code we indicated will execute:

![Alert window showing empty cookies](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-11.avif)

In this case, nothing appears because the only cookie we have has the `HTTPOnly` flag enabled:

![Session cookie with HTTPOnly attribute in developer tools](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-12.avif)

This flag enables cookies to only be read from the HTTP protocol and not from JavaScript, it's a defense mechanism. And with this explained, we've completed the lab:

![Final confirmation of lab success](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-13.avif)
