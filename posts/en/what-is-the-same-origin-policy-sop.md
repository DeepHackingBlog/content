---
id: "que-es-el-same-origin-policy-sop"
title: "What is the Same Origin Policy (SOP)"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-07
updatedDate: 2022-03-07
image: "https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-0.webp"
description: "Detailed explanation of the Same Origin Policy (SOP), the security policy implemented by browsers to prevent interaction between resources from different origins, including practical examples and exceptions."
categories:
  - "web"
draft: false
featured: false
lang: "en"
---

The Same Origin Policy is a web application security policy (pardon the redundancy) implemented by browsers, which prevents/restricts interaction with resources from a different origin. By this interaction, we mean obtaining or setting properties of a resource from a different origin.

I know that stated like this, it may not be fully understood. But we're going to look at different points little by little in order to have a complete vision and thus be able to understand what it is and how this policy affects us.

Table of Contents:

- [What is the Origin?](#what-is-the-origin)
- [What does SOP allow and what does it block?](#what-does-sop-allow-and-what-does-it-block)
- [SOP Exceptions](#sop-exceptions)
    - [window.location](#windowlocation)
    - [document.domain](#documentdomain)
    - [Cross Window Messaging](#cross-window-messaging)
- [Testing Lab](#testing-lab)
    - [Example 1 - Same Origin](#example-1--same-origin)
    - [Example 2 - Different Origin](#example-2--different-origin)
- [What if... SOP didn't exist?](#what-if-sop-didnt-exist)
- [Let's see if it's clear](#lets-see-if-its-clear)
    - [Exercise 1](#exercise-1)
    - [Exercise 2](#exercise-2)
    - [Exercise 3](#exercise-3)
    - [Exercise 4](#exercise-4)
    - [Solutions UwU](#solutions-uwu)
- [Conclusion](#conclusion)
- [References](#references)

Mini recommendation: To better understand this post, it's best to have a basic understanding of the DOM and JavaScript. If not, well, simply if you see that you don't understand something, google it to see what it's for or join the [Discord server](https://discord.gg/ZpYQn55DJV) and ask ^^.

## What is the Origin?

When we talk about the origin of a resource, it's the combination of:

- **Protocol + Host + Port**

It's easily understood with the example we're going to see now. We're going to make comparisons for the URL:

- `http://deephacking.tech/flag`
    - Protocol: HTTPS
    - Host: deephacking.tech
    - Port: 443

Examples:

- `http://deephacking.tech/artiQLAZO` --> Yes, it has the same origin, since the protocol, host, and port are all the same.
- `https://dev.deephacking.tech/flag` --> It doesn't have the same origin, because even though the protocol and port match, the host doesn't.
- `http://deephacking.tech:8080/flag` --> It doesn't have the same origin, since, even though the protocol and host match, the port doesn't.
- `http://deephacking.tech/flag` --> It doesn't have the same origin, since, even though the host and port match, the protocol doesn't (Although actually the port would also be different because being HTTP it would be 80 instead of 443, but let's forget about that detail in this case).
- `http://colddsecurity.com:69` --> I think this one is predictable. But this one, definitely wouldn't be the same origin hehe.

As a curiosity, code that runs from pages like `about:blank` or `javascript:`, inherit the origin from where they are invoked. For example, if you execute a script that opens a new `about:blank` window, this window will inherit the origin that the script that generated it has.

## What does SOP allow and what does it block?

We already have the definition of origin. Going back to SOP (Same Origin Policy), what this policy does then is block access to resources from different origins. It could be said that the main rule of SOP is:

> A document can access (through JavaScript) the properties of another document if both have the same origin.
> 
> PS: When we refer to "document" we're talking about an HTML page, an iframe included in an HTML, or an AJAX request.

Being a bit more precise, the browser will always make the request it's told to make regardless of what origin it is, however, being able to read the response, that's where what we understand/will understand as SOP applies, so, SOP does not prevent making requests to other origins, but it does prevent reading the response of a request made to another origin.

Another detail is that SOP only applies when queries are generated from the client side, not the server. That said, a couple of SOP examples:

- You can create an `<iframe>` that references another origin (if the other origin allows it). But, you cannot access or edit the content if it's not the same origin.
- In an AJAX request (XmlHTTPRequest) you won't be able to get the response of the request if it's made to a different origin.

These are a couple of classic examples. However, let's see how it behaves with other elements:

- CSS --> You can bring a CSS file from another origin using the `<link>` element or by importing directly in a CSS file.
- Images --> Embedding images from other origins is totally allowed. In fact, we constantly see this when we share, for example, a YT video or a post on some social network. However, reading images from another origin is blocked, for example, placing an image from another origin on a canvas of our web using JavaScript will be blocked.
- Scripts --> Loading JavaScript files from other origins is also allowed. However, this doesn't bypass SOP restrictions on certain APIs, such as making an HTTP request via `fetch()` or `XMLHttpRequest()` to another origin. These types of things will continue to be blocked.
- Forms --> URLs from another origin can be used in the `action` attribute of a form.
- Multimedia --> Just like images, any content whether video or audio can be brought with their respective elements, `<audio>` and `<video>`.

## SOP Exceptions

In addition to the SOP's behavior with certain elements as we just saw, there are still some exceptions for others:

##### window.location

This property is used to get the URL of a document or to change it, when we change it, we actually make a redirect to the web we indicate, through a GET request.

Knowing its functionality now, a document can always write to the `location` property of another document.

For example, if on our web we have an `<iframe>` that brings us `https://google.com`, we can change the URL of the `<iframe>` with this property and have it update and bring us another web. Even though the one that was before was from another origin. Similarly, if in the `<iframe>` we load a web, and its code executes an instruction which changes the `location` property of the web that contains the `<iframe>`, it will also work.

In this case, this last thing can always be done, whether it's the same origin or not, however, another very different thing is getting the current `location` property if it's from a different origin, we couldn't do that. We could edit it and change it for another, but we couldn't read it.

Example of trying to read the property:

![Example of attempt to read location property blocked by SOP](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-1.avif)

It says Restricted. If we tried the same thing, but with an `<iframe>` from a web with the same origin as us, there would be no problem:

![Successful reading of location property with same origin](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-2.avif)

Now, going back to the case where our `<iframe>` brought "deephacking.tech" if we try to change the property even though we can't read it:

![Successful change of location property even though it cannot be read](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-3.avif)

We see that there's no problem, as we've said, we can always edit, but not read. However, the editing also has some limitations, a document can always update the `location` property of another document if both resources have some relationship, such as:

- One document is embedded in the other by an `<iframe>` (What we've seen above)
- One document has been opened by the other through `window.open` (DOM API).

##### document.domain

This property tells us the origin host of the current document, for example:

- `http://dev.deephacking.tech/index.html`

The output of using `document.domain` would be:

- `dev.deephacking.tech`

Example:

![Example of using document.domain showing the host](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-4.avif)

A document can partially change its own origin using this property. I say partially because you can't change it however you want. Let's use the HackTheBox example to explain it. HackTheBox has the following two domains:

- `academy.hackthebox.com`
- `app.hackthebox.com`

Let's put ourselves in the case where, `academy.hackthebox.com` includes on its web, through an `<iframe>` to `app.hackthebox.com`.

It will be able to do so without problems, that part is fine. Now, let's say that `academy.hackthebox.com` executes JavaScript code to change the content of the `<iframe>` of `app.hackthebox.com`.

As we already know, both don't have the same origin because their hostname is not the same, so doing this action we're commenting on won't be possible. However, this is where the `document.domain` property comes into play.

A web can always change its hostname to one of higher hierarchy, except for the TLD (Top Level Domain) such as `.com`, `.es`, `.net`, `.tech`, etc etc. And I mean change it at the level of how it's perceived. Following this, let's see how it is at a practical level being in the `app.hackthebox.com` domain:

![Example of changing document.domain to higher hierarchy](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-5.avif)

As we can see, what was said above happens, we can change it to one of higher hierarchy, as long as it's not the TLD. So, knowing this, going back to the case where we found that `academy.hackthebox.com` wants to change the content of the `<iframe>` that embeds `app.hackthebox.com`. This action will only be possible, if both webs change their `document.domain` to `hackthebox.com`, since now it will be considered that they have the same origin (because the protocol and port also match, only the hostname was failing).

##### Cross Window Messaging

HTML5 allows iframes, frames, popups, and current windows to communicate with each other independently of SOP, this is what is known as Cross Window Messaging. This feature allows two windows to exchange messages as long as they have some kind of relationship with each other, such as:

- A window has an embedded `<iframe>`. Therefore, there is a relationship between the window and the `<iframe>`, both could communicate.
- A window generates a popup. Therefore, there is a relationship between the window and the popup, and they could also communicate.

However, to be able to exchange messages, each part of the relationship must be configured for it, either to send, to receive, or both at once. Here, from the security point of view, you have to be careful when the entity that receives allows the message to come from any origin, since, perhaps a web that expects a message, we could embed it via iframe in a web controlled by us, and if the embedded web doesn't sanitize the origin from which it accepts messages, we from our web could send it whatever we wanted.

PS: When we talk about receiving messages, at a visual and practical level, it's nothing more than an event:

```javascript
window.addEventListener('message', (event) => {
    console.log(`Received message: ${event.data}`);
});
```

## Testing Lab

To see real examples, we're going to use the testing lab by "Carlos Azuax", which you can find in the [GitHub repository azuax/pruebas-sop](https://github.com/azuax/pruebas-sop) so you can set it up yourselves too.

Another guide that might help you set it up is the [Apache Virtual Hosts configuration on Ubuntu](https://ostechnix.com/configure-apache-virtual-hosts-ubuntu-part-1/).

That said, we have the following:

![Main page of SOP testing lab](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-6.avif)

In this case, we're only going to see the first two examples which are the ones that interest us.

#### Example 1 - Same Origin

![Lab example 1 showing same origin](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-7.avif)

Source code:

![Source code of example 1 with iframe from same origin](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-8.avif)

As we can observe, we are at the URL:

- `http://uno.local/ejemplo1.html`

And in the code, we're creating an `<iframe>` from:

- `http://uno.local/ejemplo1-iframe.html`

Which is the one we see in the image:

![Content of the iframe in example 1](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-9.avif)

So far so good. We see that it loads the content of the `ejemplo1-iframe.html` file without problems.

For now, everything is normal, since, speaking in general context, we can load any web via an `<iframe>` as long as it allows it.

Now, another very different thing and this is where SOP applies. Is that we can modify the content of an origin different from ours. Taking a look at the source code:

![JavaScript code of the button to modify the iframe](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-10.avif)

![Button to attempt to modify the iframe content](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-11.avif)

We see how if we press the button. The action that WILL BE ATTEMPTED is to change the content of the `<iframe>` to, in this case, the phrase: "Contenido modificado!".

We are at the URL:

- `http://uno.local/ejemplo1.html`

And we want to change the content of the `<iframe>` that comes from the URL:

- `http://uno.local/ejemplo1-iframe.html`

As we've seen at the beginning of the post, we can easily identify that both have the same origin. So we shouldn't have any problem editing the content of the `<iframe>`, which... NOTE, obviously we're not editing the original content, only that of the `<iframe>`.

Let's check it:

![Pressing the button to modify the iframe](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-12.avif)

![Successfully modified iframe showing new content](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-13.avif)

As we can see, it modifies without problems. Since both URLs are from the same origin.

#### Example 2 - Different Origin

![Lab example 2 showing different origin](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-14.avif)

Source code:

![Source code of example 2 with iframe from different origin](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-15.avif)

In this case, the URL we are at is:

- `http://uno.local/ejemplo2.html`

And we're loading an `<iframe>` from:

- `http://dos.local/ejemplo2-iframe.html`

NOTE, as we're pros, we will have already realized that in this case, these two URLs don't have the same origin because the host changes.

Even so, the `<iframe>` loads without problems:

![Iframe from different origin loading without problems](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-16.avif)

Which is basically what we talked about in Example 1:

> "For now, everything is normal, since, speaking in general context, we can load any web via an `<iframe>` as long as it allows it."
> 
> Yeah, I've been saying it throughout the whole post, but better to make it clear and not get confused.

This example is exactly the same as example 1. However, in this case, when we press the button, it will attempt to edit the content of an `<iframe>` whose origin is different from the web that embeds it:

![Code of the button attempting to modify iframe from different origin](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-17.avif)

Let's check what happens if it's not from the same origin:

![Pressing the button to modify iframe from different origin](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-18.avif)

![SOP error blocking modification of iframe from different origin](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-19.avif)

Well, we see that an error is thrown, and it's because of the Same Origin Policy.

## What if... SOP didn't exist?

If SOP didn't exist, things would get tense as hell, because literally we could bring a web via `<iframe>` (again, as long as the web lets us xdddddddd). And edit anything. For example, that when you hit send, the destination account would be changed to mine:

![Example of attack modifying bank account without SOP](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-20.avif)

So, in definition: We could bring any web and edit it with complete freedom. This isn't that it would make the internet a bit less secure and such, it's that it would literally make it unnavigable (and not just because of this, this is just an example of something that could be done, but there are infinite other things, like for example, you visiting a malicious web, it having the ability to make a request to your bank's web, and read the response, thus obtaining your information. SOP doesn't prevent it from making the request, but it does prevent it from reading the response, as mentioned at the beginning).

Here you might say, well yeah, but it's a small window, who's going to fall for that?

Well, it's a small window if we do it poorly, but if we do it right:

![Full screen iframe simulating the real web](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-21.avif)

Well, it's not so much anymore. Imagine that this was your bank's web, you wouldn't notice any difference beyond the domain where the `<iframe>` is hosted. This is why the existence of SOP is super important when it comes to web security.

## Let's see if it's clear

Now we're going to see 4 examples where we'll see if the concept is clear to you, and if you fail, well, you owe me a kebab.

Just kidding, failing is fine, just like looking at Write Ups, the important thing is to learn. Getting back to the case, we're going to see 4 exercises and I'll leave the solution at the end, write it down in a notepad or something if you think the code shown could be successfully executed. PS: These exercises are taken from the [web.dev](https://web.dev/same-origin-policy/) website.

##### Exercise 1

We have on the `deephacking.tech` domain, the following `<iframe>`:

```html
<iframe id="iframe" src="https://example.com/some-page.html" alt="Sample iframe"></iframe>
```

And we include the following code:

```javascript
const iframe = document.getElementById('iframe');
const message = iframe.contentDocument.getElementById('message').innerText;
```

Will the action we're trying to do be successfully executed? Yes or No.

##### Exercise 2

We have on the `deephacking.tech` domain the following form:

```html
<form action="https://example.com/results.json">
  <label for="email">Enter your email: </label>
  <input type="email" name="email" id="email" required>
  <button type="submit">Subscribe</button>
</form>
```

Is this allowed? Yes or No.

##### Exercise 3

We have on the `deephacking.tech` domain the following `<iframe>`:

```html
<iframe src="https://example.com/some-page.html" alt="Sample iframe"></iframe>
```

Will it work? Yes or No.

##### Exercise 4

Last but not least, we have on the `deephacking.tech` domain the following code:

```html
<canvas id="bargraph"></canvas>
```

Additionally, there's also the following JavaScript code that attempts to draw an image on the canvas:

```javascript
var context = document.getElementById('bargraph').getContext('2d');
var img = new Image();
  img.onload = function() {
  context.drawImage(img, 0, 0);
};
img.src = 'https://example.com/graph-axes.svg';
```

Will this image be able to be drawn on the canvas? Yes or No.

##### Solutions UwU

![Separator image to avoid spoilers](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-22.avif)

Ok, this image is so you don't see the solutions at a glance if you scroll down too fast. I'll put another one just in case:

![Second separator image to avoid spoilers](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-23.avif)

That said, let's go with the solutions:

- Exercise 1: Nope, you can't, since we're trying to read information from an `<iframe>` whose origin is different from ours.
- Exercise 2: Yesssss, because as we've said previously, it's totally allowed to place in the `action` attribute of a form, a web that has a different origin.
- Exercise 3: Yeess!! But NOTE, you have to be careful, since it will depend on whether the web we're trying to embed allows us or not. Actually in exercise 1 we would be in the same case, but it wasn't the purpose of that exercise to mention this detail.
- Exercise 4: It depends. This case will depend on the CORS header that the image has, if they allow it, great, it can, if not, it will throw an error.

## Conclusion

I know this concept can be understood a bit ambiguously and so on, and not only that, it's not easy to understand if you've never had contact with the DOM through JavaScript. But at least I hope I've managed not only for you to know it exists, but at least for you to have a basic idea.

Anyway, in this post we haven't seen one of the most important things that today goes hand in hand with SOP, and that's CORS (Cross-site Resource Sharing), I will dedicate (or will have dedicated if you come from the future) a complete post to this one 👍.

## References

- [Same Origin Policy Examples on YouTube](https://www.youtube.com/watch?v=bigahWcWtmA)
- [Same Origin Policy - SOP on YouTube](https://www.youtube.com/watch?v=0ooksSSszRU)
- [Same-origin policy on web.dev](https://web.dev/same-origin-policy/)
- [Web Application Penetration Testing on INE](https://my.ine.com/INE/courses/38316560/web-application-penetration-testing)
