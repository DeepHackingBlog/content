---
id: "dom-xss-in-document-write-sink-using-source-location-search-2"
title: "DOM XSS in document.write sink using source location.search – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-02
updatedDate: 2022-03-02
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search/dom-xss-in-document-write-sink-using-source-location-search2-0.webp"
description: "Learn how to exploit DOM XSS in document.write by escaping from an img element and executing JavaScript code through the search bar."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we're going to solve the lab: "DOM XSS in document.write sink using source location.search":

![DOM XSS lab description](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search/dom-xss-in-document-write-sink-using-source-location-search2-1.avif)

When we open the lab, the first thing we see is the following website:

![Lab main page](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search/dom-xss-in-document-write-sink-using-source-location-search2-2.avif)

There's a search bar, so let's try simply searching for something:

![Test search in the search bar](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search/dom-xss-in-document-write-sink-using-source-location-search2-3.avif)

![Search result in the source code](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search/dom-xss-in-document-write-sink-using-source-location-search2-4.avif)

When we perform the search, if we right-click and view the source code of the element for the word we searched for, we can see that it's located in the `src` attribute of an image.

By observing how our input is implemented in the source code, we can send a specialized payload that escapes from the `<img>` tag.

For example, let's use:

- `"><script>alert("XSS")</script>//`

![XSS payload in the search bar](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search/dom-xss-in-document-write-sink-using-source-location-search2-5.avif)

Once we've written our payload, we simply perform another search:

![Successful alert execution](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search/dom-xss-in-document-write-sink-using-source-location-search2-6.avif)

And as we can see, the code we introduced gets executed. The source code would now look like this:

![Source code with executed payload](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search/dom-xss-in-document-write-sink-using-source-location-search2-7.avif)

As we can see, our input is no longer inside the `<img>`, since we managed to close the element to write JavaScript code.

With this done, we successfully solve the lab:

![Lab successfully completed](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search/dom-xss-in-document-write-sink-using-source-location-search2-8.avif)
