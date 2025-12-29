---
id: "dom-xss-in-document-write-sink-using-source-location-search"
title: "DOM XSS in document.write sink using source location.search inside a select element – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-31
updatedDate: 2022-03-31
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-0.webp"
description: "Learn how to exploit DOM XSS in document.write by escaping from a select element and executing arbitrary JavaScript code."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we will be solving the lab: "DOM XSS in document.write sink using source location.search inside a select element".

![DOM XSS lab description](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-1.avif)

In this case, to solve the challenge we need to escape from the `select` element and call the `alert` function.

The first thing to do is access the lab:

![Lab main page](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-2.avif)

Once we've accessed it, we can see several products. Let's enter any one:

![List of available products](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-3.avif)

When we enter, we can see a function to check stock in different cities:

![Individual product view](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-4.avif)

![City selector to verify stock](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-5.avif)

![Stock verification result](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-6.avif)

If we look at the website's source code, we can find the following code:

![JavaScript script in the source code](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-7.avif)

Analyzing the script a bit, we basically understand that in addition to the three default cities to check stock, one more can be added through the `storeId` variable in the URL. So we can try adding that variable with any value:

![URL with storeId parameter added](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-8.avif)

Once we access the website again but with the `storeId` variable, if we look at the cities:

![New city added to the selector](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-9.avif)

We can see that one more has been added, specifically one with the name of the value we passed to the variable.

If we go back to the source code, we can see how this parameter is implemented:

![Parameter implementation in the code](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-10.avif)

So, observing this, we can try putting a value that causes us to escape from the `options` element itself and execute an `alert`:

![URL with malicious XSS payload](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-11.avif)

When accessing the website with this value in the variable:

![Successful alert execution](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-12.avif)

The `alert` is executed. In the source code, we can see the following:

![Source code showing successful escape](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-13.avif)

And this way, we manage to solve the lab:

![Lab successfully completed](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-14.avif)
