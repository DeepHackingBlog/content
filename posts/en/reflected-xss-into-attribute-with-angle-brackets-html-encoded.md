---
id: "reflected-xss-into-attribute-with-angle-brackets-html-encoded"
title: "Reflected XSS into attribute with angle brackets HTML-encoded – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-10
updatedDate: 2022-03-10
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-attribute-with-angle-brackets-html-encoded/reflected-xss-into-attribute-with-angle-brackets-html-encoded-0.webp"
description: "Learn how to exploit a Reflected XSS in an HTML attribute in PortSwigger Lab. Step-by-step guide to inject a malicious attribute that executes JavaScript when angle brackets are HTML-encoded."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we're going to be solving the lab: "Reflected XSS into attribute with angle brackets HTML-encoded".

![Reflected XSS into attribute lab start screen](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-attribute-with-angle-brackets-html-encoded/reflected-xss-into-attribute-with-angle-brackets-html-encoded-1.avif)

In this case, to solve the challenge we need to inject an attribute that executes an `alert`.

First of all, let's access the lab:

![Lab main page with search bar](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-attribute-with-angle-brackets-html-encoded/reflected-xss-into-attribute-with-angle-brackets-html-encoded-2.avif)

Once we access it, we find ourselves before a search bar, so we're going to use it by searching for a random word:

![Search form with test term](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-attribute-with-angle-brackets-html-encoded/reflected-xss-into-attribute-with-angle-brackets-html-encoded-3.avif)

![Search results showing parameter in URL](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-attribute-with-angle-brackets-html-encoded/reflected-xss-into-attribute-with-angle-brackets-html-encoded-4.avif)

When we search, if we pay attention, several things happen here:
1. In this case, there are no results, but that's the least of it.
2. The `search` parameter is added to the URL.
3. What we search for ends up being the value of the `value` attribute in the `input` element.

Taking into account the last two points, we can create a payload that creates a new attribute inside the `input` element so that an `alert` is executed. In this case, the payload is:
- `"onmousemove="alert(1)`

![XSS payload injected in the search parameter](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-attribute-with-angle-brackets-html-encoded/reflected-xss-into-attribute-with-angle-brackets-html-encoded-5.avif)

This way, by searching for the payload we specified above, we solve the lab:

![Results page without visible alert execution](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-attribute-with-angle-brackets-html-encoded/reflected-xss-into-attribute-with-angle-brackets-html-encoded-6.avif)

It seems that nothing has happened in terms of executing the `alert`, however, if we move the mouse over the word:

![Successful alert execution when moving mouse over the field](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-attribute-with-angle-brackets-html-encoded/reflected-xss-into-attribute-with-angle-brackets-html-encoded-7.avif)

It executes. This way we successfully solve the lab:

![Final confirmation of lab success](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-attribute-with-angle-brackets-html-encoded/reflected-xss-into-attribute-with-angle-brackets-html-encoded-8.avif)
