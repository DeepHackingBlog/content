---
id: "dom-xss-in-jquery-selector-sink"
title: "DOM XSS in jQuery selector sink using a hashchange event – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-09
updatedDate: 2022-03-09
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-0.webp"
description: "Learn how to exploit a DOM XSS in jQuery selector sink using hashchange event in PortSwigger Lab. Step-by-step guide to create an exploit that executes JavaScript code by leveraging vulnerabilities in jQuery selectors."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we're going to be solving the lab: "DOM XSS in jQuery selector sink using a hashchange event":

![DOM XSS in jQuery selector sink lab start screen](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-1.avif)

To solve the lab, we need to send a victim an exploit that leverages the lab's vulnerability to execute the `print()` function.

First of all, let's access the lab:

![Lab main page showing blog articles](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-2.avif)

In this case, we don't see any search bar or feedback page as has happened in other XSS challenges. However, if we go to the source code, we find the following piece of code:

![Vulnerable JavaScript code with jQuery selector](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-3.avif)

This code basically searches for a value on the website when something is specified in the URL after a hashtag and scrolls to the match.

For example, if we go all the way down to the bottom of the lab, we can see that there's a post that has the word "Resume" in the title:

![Blog article with title containing the word Resume](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-4.avif)

Knowing this, we're going to search for:
- `<URL>/#Resume`

![URL with hash fragment Resume in the address bar](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-5.avif)

We press enter.

![Automatic scroll to the article with the word Resume](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-6.avif)

And although it can't be appreciated in the image, it automatically redirects us to the post that contains the word.

To see how to exploit this, let's bring back the code:

![JavaScript code showing vulnerable jQuery selector](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-7.avif)

As we can observe, what really happens in the code is that when we specify something after the hashtag, jQuery tries to find an `h2` element that contains what we said. When it finds the element, it's stored in the `post` variable, so now what it contains is a jQuery element that looks like this:

<figure>

![jQuery object in console showing found element](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-8.avif)

<figcaption>

Note: a different lab URL shows up because this is a screenshot I took at another time :P

</figcaption>

</figure>

Subsequently, if the `post` variable has any stored data, the first element of the jQuery object is obtained and the `scrollIntoView()` method is used.

Here the vulnerability as such is found in the first line, in the jQuery selector sink (`$()`):

![Vulnerability in jQuery selector highlighted in the code](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-9.avif)

<figure>

![Detail of vulnerable jQuery selector in the console](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-10.avif)

<figcaption>

Note: this image is also from another time :P

</figcaption>

</figure>

If it's not sanitized properly, what happens approximately in the code is the following:
- `$('section.blog-list h2:contains(' + decodeURIComponent(window.location.hash.slice(1)) + ')');`
- `$('section.blog-list h2:contains(' + Hello + ')');`

Therefore, if we put a payload like the following:
- `<img src=/ onerror=print()>`

More or less, something like this would happen:
- `$('section.blog-list h2:contains(' + <img src=/ onerror=print()> + ')');`

This way, it would be interpreted. Let's test it:

![XSS payload injected in the hash fragment of the URL](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-11.avif)

We press enter:

![Successful execution of the print function through the payload](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-12.avif)

And indeed it executes. Now we need to create an exploit that we send to the victim and makes use of this vulnerability. To do this, we go to the exploit server:

![Button to access the exploit server](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-13.avif)

![Exploit server interface in PortSwigger](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-14.avif)

In this case, the idea is to automate the exploitation using a simple `<iframe>`:

![HTML code with malicious iframe in the exploit server](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-15.avif)

Before sending it, let's see what it would look like:

![Button to preview the exploit before sending it](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-16.avif)

![Exploit preview showing loaded iframe](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-17.avif)

The victim when visiting a website with our code would see what we're seeing, a small iframe of the website, and immediately after the website loads, the `print()` function would execute:

![Print dialog automatically executed by the exploit](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-18.avif)

So, seeing that it works, we simply save it and send it to the victim:

![Buttons to save and deliver the exploit to the victim](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-19.avif)

![Confirmation of exploit delivery to the victim](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-20.avif)

This way, we successfully solve the lab:

![Lab solved successfully message](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-21.avif)

![Final confirmation of lab success](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-22.avif)
