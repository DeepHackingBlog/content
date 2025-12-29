---
id: "stored-xss-into-anchor-href-attribute"
title: "Stored XSS into anchor href attribute with double quotes HTML-encoded – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-29
updatedDate: 2022-03-29
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-0.webp"
description: "Learn how to exploit a Stored XSS in the href attribute of an anchor in PortSwigger Lab. Step-by-step guide to execute JavaScript when clicking on the comment author's name when double quotes are HTML-encoded."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we're going to be solving the lab: "Stored XSS into anchor href attribute with double quotes HTML-encoded".

![Stored XSS into anchor href attribute lab start screen](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-1.avif)

In this case, to solve the lab we need to write a comment that calls the `alert` function when clicking on the comment author's name.

First of all, let's access the lab:

![Lab main page showing blog articles](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-2.avif)

Once we access it, we can see that there are different articles, we go into the first one (we could go into any of them):

![List of available blog articles](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-3.avif)

![Complete view of the first blog article](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-4.avif)

Once inside, we can observe that there's a comments section:

![Comments section at the end of the article](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-5.avif)

So we're going to write any comment:

![Comment form with fields to complete](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-6.avif)

![Test comment submitted successfully](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-7.avif)

![Published comment showing author name as hyperlink](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-8.avif)

When we submit a comment, it's written and stored on the website. We can observe that in the comment we posted there's a hyperlink. If we look at its source code, we can observe that the `href` attribute corresponds to the `Website` field from when writing a comment:

![HTML source code showing href attribute with value from Website field](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-9.avif)

So knowing this, we can write in the `Website` field a payload that executes an `alert` when clicking on the author's name:

![XSS payload injected in the Website field of the form](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-10.avif)

We submit the comment and:

![Lab solved successfully message](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-11.avif)

We complete the lab! If we go back to the comments section and observe the source code, we can see how our payload has been placed:

![Source code showing XSS payload injected in href attribute](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-12.avif)

And if we click on `test`:

![Successful alert execution when clicking on the author's name](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-13.avif)

It executes!
