---
id: "stored-dom-xss"
title: "Stored DOM XSS – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-05-04
updatedDate: 2022-05-04
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-0.webp"
description: "Learn how to exploit stored DOM XSS vulnerabilities in the comments functionality and how to bypass JavaScript's replace() method."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we will be solving the lab: "Stored DOM XSS".

![Stored DOM XSS lab description](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-1.avif)

In this case, the statement tells us that there is a stored DOM XSS vulnerability in the blog's comment functionality. To solve the lab, we must exploit the vulnerability and execute the `alert` function.

That said, the first thing to do is access the lab:

![Lab main page](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-2.avif)

Once we're in, we can see that there are different articles. In this case, we're going to view the first one:

![Blog articles list](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-3.avif)

![First article view](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-4.avif)

When accessing an article, we can see that there is a comments section:

![Blog comments form](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-5.avif)

In this case, we will simply fill it in with random data and publish a comment:

![Completed comment form](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-6.avif)

Once published, we return to the article to see our comment:

![Comment published in the article](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-7.avif)

![Published comment confirmation](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-8.avif)

It has been published without any issues.

If we investigate the source code and the different dependencies (JS files) a bit, we can find the following JavaScript file, called `loadComments.js`:

![JavaScript file loadComments.js](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-9.avif)

The file, among other things, has a function that replaces the `>` and `<` symbols, HTML encoding them when loading comments.

This is where the flaw is, it's using the `replace` method for substitution. This method only replaces the first occurrence it finds. For example, if I have the word "patata" and I use the `replace` function to substitute the 'a's with an 'e', the result of implementing this method on the word "patata" will give as a result: "petata".

[Reference on how the replace() method works in JavaScript](https://bobbyhadz.com/blog/javascript-replace-first-character-in-string#:~:text=To%20replace%20the%20first%20character%20in%20a%20string%3A,-Assign%20the%20character&text=Call%20the%20replace\(\)%20method,with%20the%20first%20character%20replaced.)

So, taking this behavior into account, we can create a typical XSS payload, but placing `<>` at the beginning so that these are what the script replaces and not the symbols used in the malicious code:

![XSS payload with replace method bypass](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-10.avif)

![Comment with XSS payload published](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-11.avif)

This way, when publishing the comment and returning to the post:

![Successful execution of JavaScript alert](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-12.avif)

We manage to execute the JavaScript code we had put in, in this case, the `alert`.

This way, we manage to solve the lab:

![Lab solved message](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-13.avif)

![Lab successfully completed](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-14.avif)
