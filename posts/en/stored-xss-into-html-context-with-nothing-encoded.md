---
id: "stored-xss-into-html-context-with-nothing-encoded"
title: "Stored XSS into HTML context with nothing encoded – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-01
updatedDate: 2022-03-01
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-html-context-with-nothing-encoded/stored-xss-into-html-context-with-nothing-encoded-0.webp"
description: "Step-by-step resolution of the PortSwigger lab on Stored XSS in HTML context without encoding, exploiting comments to execute malicious JavaScript code."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we are going to solve the PortSwigger lab: "Stored XSS into HTML context with nothing encoded".

![Lab homepage for Stored XSS into HTML context](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-html-context-with-nothing-encoded/stored-xss-into-html-context-with-nothing-encoded-1.avif)

To solve the lab, we need to execute the `alert` function in a post comment.

When we open the lab, the first thing we need to do is navigate to any post:

![Blog view with list of available posts](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-html-context-with-nothing-encoded/stored-xss-into-html-context-with-nothing-encoded-2.avif)

Inside the post, we find the following:

![Comment form with fields to fill out](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-html-context-with-nothing-encoded/stored-xss-into-html-context-with-nothing-encoded-3.avif)

As we can see, we have the option to leave a comment and different fields to fill out.

So we are simply going to do as instructed and fill out all the fields, but in the comment field, we will place a small piece of JavaScript code that executes an `alert`:

![Form completed with XSS payload in the comment field](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-html-context-with-nothing-encoded/stored-xss-into-html-context-with-nothing-encoded-4.avif)

With all the fields filled out, we simply submit the comment and we will have solved the lab:

![Lab solved successfully](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-html-context-with-nothing-encoded/stored-xss-into-html-context-with-nothing-encoded-5.avif)

To see what happened, let's go back to the post where we wrote our comment:

![JavaScript alert executing in the browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-html-context-with-nothing-encoded/stored-xss-into-html-context-with-nothing-encoded-6.avif)

![Post showing the comment with injected XSS code](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-html-context-with-nothing-encoded/stored-xss-into-html-context-with-nothing-encoded-7.avif)

And as we can see, when entering the post, the code we had written in the comment field is executed. We have just exploited a Stored XSS.

![Lab completion confirmation](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-html-context-with-nothing-encoded/stored-xss-into-html-context-with-nothing-encoded-8.avif)
