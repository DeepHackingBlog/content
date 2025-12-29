---
id: "reflected-xss-into-a-javascript-string"
title: "Reflected XSS into a JavaScript string with angle brackets HTML encoded – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-30
updatedDate: 2022-03-30
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-a-javascript-string/reflected-xss-into-a-javascript-string-0.webp"
description: "Learn how to exploit a Reflected XSS inside a JavaScript string in PortSwigger Lab. Step-by-step guide to escape from a string and execute JavaScript code when angle brackets are HTML-encoded."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we're going to be solving the lab: "Reflected XSS into attribute with angle brackets HTML-encoded".

![Reflected XSS into a JavaScript string lab start screen](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-a-javascript-string/reflected-xss-into-a-javascript-string-1.avif)

In this case, to solve the challenge we need to inject a payload that escapes from the string where it's located and calls the `alert` function.

First of all, let's access the lab:

![Lab main page with search bar](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-a-javascript-string/reflected-xss-into-a-javascript-string-2.avif)

Once we access it, we find ourselves before a search bar, so we're going to use it by searching for a random word:

![Search form with test term](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-a-javascript-string/reflected-xss-into-a-javascript-string-3.avif)

When we perform the search, we can observe that the word we searched for is found, among other places, in the following part of the source code

![Source code showing search term inside a JavaScript string](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-a-javascript-string/reflected-xss-into-a-javascript-string-4.avif)

As we can observe, it's a string. You might think, ok, I close the variable, put an `alert` and done, something like:
- `var searchTerms= ' alert('XSS') '`

But this is not valid, since JavaScript doesn't allow spaces in a variable, for this same reason so that the entire string is taken as part of the variable, and even so, the `alert` executes, it's concatenated using a hyphen. [In the StackOverflow documentation you can see a more detailed explanation about the treatment of hyphens in JavaScript](https://stackoverflow.com/questions/60593034/how-does-javascript-treat-hyphens).

That said, we place a payload like:
- `' '-alert('XSS')-' '`

![XSS payload injected in the search field](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-a-javascript-string/reflected-xss-into-a-javascript-string-5.avif)

And when we click search:

![Successful alert execution escaping from the JavaScript string](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-a-javascript-string/reflected-xss-into-a-javascript-string-6.avif)

The `alert` will have been executed. In the source code, it will be seen as follows:

![Source code showing successfully injected payload](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-a-javascript-string/reflected-xss-into-a-javascript-string-7.avif)

With this, we complete the lab:

![Final confirmation of lab success](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-a-javascript-string/reflected-xss-into-a-javascript-string-8.avif)
