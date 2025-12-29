---
id: "dom-xss-in-innerhtml-sink"
title: "DOM XSS in innerHTML sink using source location.search – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-03
updatedDate: 2022-03-03
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-innerhtml-sink/dom-xss-in-innerhtml-sink-0.webp"
description: "Step-by-step resolution of the PortSwigger lab on DOM XSS using innerHTML sink with source location.search to execute malicious JavaScript code."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we are going to solve the lab: "DOM XSS in innerHTML sink using source location.search".

![Lab homepage for DOM XSS in innerHTML sink](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-innerhtml-sink/dom-xss-in-innerhtml-sink-1.avif)

First of all, as always, we access the lab:

![Initial view of the lab with search bar](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-innerhtml-sink/dom-xss-in-innerhtml-sink-2.avif)

Once we are in, we see a search bar. So let's search for anything:

![Test search in the search bar](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-innerhtml-sink/dom-xss-in-innerhtml-sink-3.avif)

![Source code showing innerHTML of the span tag](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-innerhtml-sink/dom-xss-in-innerhtml-sink-4.avif)

If we look closely, what we searched for is reflected on the website. And if we right-click and view the part of the source code where it is located, we can see that it is stored in the `innerHTML` of the `<span>` tag.

Knowing this, we can try to use a payload in the search that is specially designed to escape from this tag and execute JavaScript code. For example, we will use the following payload:

- `</span><img src=/ onerror=alert(1) />//`

![XSS payload inserted in the search bar](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-innerhtml-sink/dom-xss-in-innerhtml-sink-5.avif)

![JavaScript alert executing successfully](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-innerhtml-sink/dom-xss-in-innerhtml-sink-6.avif)

When searching for it, we can see that the payload is successfully executed. We went from:

- `<span id="searchMessage">hola</span>`

to:

- `<span id="searchMessage"></span><img src=/ onerror=alert(1) />//</span>`

This way, by achieving this execution, we successfully solve the lab:

![Lab solved successfully](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-innerhtml-sink/dom-xss-in-innerhtml-sink-7.avif)
