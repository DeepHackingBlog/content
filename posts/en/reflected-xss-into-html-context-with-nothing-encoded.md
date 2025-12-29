---
id: "reflected-xss-into-html-context-with-nothing-encoded"
title: "Reflected XSS into HTML context with nothing encoded – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-24
updatedDate: 2022-02-24
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-html-context-with-nothing-encoded/reflected-xss-into-html-context-with-nothing-encoded-0.webp"
description: "Step-by-step resolution of the PortSwigger lab on Reflected XSS in HTML context without encoding, exploiting the search bar to execute JavaScript code."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we are going to solve the PortSwigger lab: "Reflected XSS into HTML context with nothing encoded".

<figure>

![Lab homepage for Reflected XSS into HTML context](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-html-context-with-nothing-encoded/reflected-xss-into-html-context-with-nothing-encoded-1.avif)

</figure>

To solve the lab, we need to perform a Cross-site Scripting attack that calls the `alert` function.

When we enter the lab, we see a search field:

![Initial view of the lab with search bar](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-html-context-with-nothing-encoded/reflected-xss-into-html-context-with-nothing-encoded-2.avif)

Let's try searching for anything:

![Test search in the search bar](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-html-context-with-nothing-encoded/reflected-xss-into-html-context-with-nothing-encoded-3.avif)

![Search result showing the reflected term](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-html-context-with-nothing-encoded/reflected-xss-into-html-context-with-nothing-encoded-4.avif)

If we look closely, the search term is reflected on the website. Therefore, we can try to inject JavaScript code using the `onerror` attribute in the `<img>` tag.

This way, if it fails to load the image we specify in the `src` attribute, it will execute what we write in `onerror`:

![XSS payload inserted in the search bar](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-html-context-with-nothing-encoded/reflected-xss-into-html-context-with-nothing-encoded-5.avif)

![JavaScript alert executing successfully](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-html-context-with-nothing-encoded/reflected-xss-into-html-context-with-nothing-encoded-6.avif)

As we can see, it indeed failed to load the image, therefore the `alert` is executed. This way, we successfully solve the lab.
