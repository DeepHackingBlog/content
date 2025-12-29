---
id: "dom-xss-in-angularjs-expression"
title: "DOM XSS in AngularJS expression with angle brackets and double quotes HTML-encoded – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-04-05
updatedDate: 2022-04-05
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-0.webp"
description: "Learn how to exploit a DOM XSS in AngularJS expressions in PortSwigger Lab. Step-by-step guide to execute JavaScript through Angular expressions when angle brackets and double quotes are HTML-encoded."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we're going to be solving the lab: "DOM XSS in AngularJS expression with angle brackets and double quotes HTML-encoded".

![DOM XSS in AngularJS expression lab start screen](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-1.avif)

In this case, we're told that the website uses Angular, and furthermore, there's a DOM based XSS in the search functionality. To complete the lab, we need to execute the `alert` function.

First of all, let's access the lab:

![Lab main page with search form](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-2.avif)

Once accessed, we test the search functionality:

![Search form with test term](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-3.avif)

![Search results displayed on the page](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-4.avif)

At first glance, nothing looks unusual. However, if we look at the source code:

![HTML source code showing ng-app attribute in body](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-5.avif)

We can see that in the `body` tag, an attribute is set which is `ng-app`. `Ng-app` is a directive that defines an Angular root element, and therefore defines where the Angular application begins.

Of course, by defining in the HTML `body` tag that the Angular application starts, any Angular statement added inside the code within it will be interpreted. And thanks to the search functionality, we can control a parameter that will be placed inside the part defined as the Angular application.

Knowing this, we'll use the payload `{{constructor.constructor('alert(1)')()}}`.

Let's explain the payload:
- The double curly braces are used to treat it as an Angular expression.
- The `constructor.constructor` is basically interpreted the same as a function, it's as if we were declaring a function and inside it we placed the code that will be executed, well here it's exactly the same, inside the parentheses, we place what we want to be executed, in this case an `alert(1)`.

Knowing this, we send the mentioned payload, since remember that this will be reflected inside the part that is declared as Angular thanks to `ng-app`:

![AngularJS payload injected in the search field](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-6.avif)

And therefore, it will be interpreted as we explained and will execute:

![Successful alert execution through AngularJS expression](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-7.avif)

![Lab solved successfully message](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-8.avif)

This way, we successfully solve the lab:

![Final confirmation of lab success](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-9.avif)

Some references:
- [Object.constructor===Object.constructor.constructor explained on StackOverflow](https://stackoverflow.com/questions/5963547/object-constructor-object-constructor-constructor-why)
- [How instance.constructor.constructor works in JavaScript](https://stackoverflow.com/questions/65895494/what-is-instance-constructor-constructor-and-how-does-it-work)
- [AngularJS directives ng-app documentation on Nielit](http://nielit.gov.in/gorakhpur/sites/default/files/Gorakhpur/OLEVEL_1_WPD_04_06_2020_IL.pdf)
