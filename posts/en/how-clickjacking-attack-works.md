---
id: "como-funciona-el-ataque-clickjacking"
title: "How the Clickjacking Attack Works"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-28
updatedDate: 2022-03-28
image: "https://cdn.deephacking.tech/i/posts/como-funciona-el-ataque-clickjacking/como-funciona-el-ataque-clickjacking-0.webp"
description: "Explanation of the Clickjacking attack (UI redressing), how it works through invisible iframes to trick users into performing unauthorized actions, and how to protect against it using X-Frame-Options and Content Security Policy."
categories:
  - "web"
draft: false
featured: false
lang: "en"
---

Clickjacking (or also UI redressing) is a web attack by which an attacker, through social engineering or phishing, manages to get a victim to perform unauthorized actions legitimately. For example, through this attack an attacker can cause a victim to send money without them knowing, with the victim themselves being the one who clicks send.

Table of Contents:

- [Introduction](#introduction)
- [Clickjacking](#clickjacking)
- [How to Prevent Clickjacking](#how-to-prevent-clickjacking)
    - [X-Frame-Options](#x-frame-options)
    - [Content-Security-Policy](#content-security-policy-csp)
- [References](#references)

## Introduction

The first thing is to understand what an iframe is. Basically, it's an HTML element that allows you to embed a web page within another (formally speaking, it allows you to embed an HTML document within a main HTML document). For example, with the following code:

![HTML code showing a basic iframe](https://cdn.deephacking.tech/i/posts/como-funciona-el-ataque-clickjacking/como-funciona-el-ataque-clickjacking-1.avif)

We manage to embed Deep Hacking in our small local server:

![Iframe showing Deep Hacking within a local page](https://cdn.deephacking.tech/i/posts/como-funciona-el-ataque-clickjacking/como-funciona-el-ataque-clickjacking-2.avif)

The small `<iframe>` is the fully functional website itself, you can navigate the blog perfectly without any problem as if you were actually on it. However, you might think, ok, but it's a tiny window, what the hell is this. And you're not wrong, that's why, if we add a bit of CSS to the code:

![HTML code of the iframe with CSS styles for fullscreen](https://cdn.deephacking.tech/i/posts/como-funciona-el-ataque-clickjacking/como-funciona-el-ataque-clickjacking-3.avif)

![Result of the fullscreen iframe showing Deep Hacking](https://cdn.deephacking.tech/i/posts/como-funciona-el-ataque-clickjacking/como-funciona-el-ataque-clickjacking-4.avif)

Voilà. We have the blog as if we were on the official one, not only functionally, but also aesthetically.

Here an important detail comes into play, in `<iframe>` elements, the cookies you have stored for the page in question also load. This means that if I have the blog session saved in the browser, when loading in the `<iframe>`, I will be logged into my session, so any change I make in the `<iframe>` will be as if I did it from the normal blog.

Going back to the bank example, if I have my account session saved, and I visit a website that loads the bank's website in an `<iframe>`, in the `<iframe>` I will be logged in with my account, so any action carried out from the `<iframe>` will be as if I did it from the original website.

Knowing this, let's see Clickjacking and what the idea of the attack is.

## Clickjacking

You could say that Clickjacking is an attack that works by layers:

![Diagram showing the layers of the Clickjacking attack from the attacker's point of view](https://cdn.deephacking.tech/i/posts/como-funciona-el-ataque-clickjacking/como-funciona-el-ataque-clickjacking-5.avif)

Seeing this you might be thinking: ok, but there are several things here that don't make sense:

- Why does the attacker need to make a custom website?
- If the `<iframe>` website goes on top, what's the point of putting a website underneath? If it's not going to be seen.

What happens is that the `<iframe>`, even though it's there, is going to be completely invisible, and this is achieved with CSS. This way, what the attacker will create on the custom website will be a strategically placed element so that the user clicks somewhere specific on the `<iframe>`.

Let's see an example to make it clearer:

<figure>

![Banking website interface showing transfer form](https://cdn.deephacking.tech/i/posts/como-funciona-el-ataque-clickjacking/como-funciona-el-ataque-clickjacking-6.avif)

<figcaption>

The URL would correspond to the `<iframe>`, not to the website the victim enters

</figcaption>

</figure>

<figure>

![Fake website offering to win a free iPhone](https://cdn.deephacking.tech/i/posts/como-funciona-el-ataque-clickjacking/como-funciona-el-ataque-clickjacking-7.avif)

<figcaption>

This URL does correspond to the website the victim enters

</figcaption>

</figure>

These are the two websites there will be, one on top of the other. What happens is that whenever we interact, it will be with the website that is on top. So, let's put ourselves in the situation:

- The layer the user will see will be the one to win the new iPhone, since the other one, we will indicate via CSS, opacity 0 (to be invisible).
- The layer that will be on top, and with which you interact by clicking anywhere, will be the bank's.

If we place the iPhone button exactly in the same place as the confirm transaction button, when the user clicks to win the iPhone, they will actually be clicking confirm transaction, and, since the `<iframe>` loads the cookies the user has stored, the transaction will be made with their account.

And this is really the idea of Clickjacking, making the user think they're clicking on one thing, when they're really clicking on another, and yes, in case you were thinking about it, one of the requirements of this attack is that the user doesn't log out of sites and, therefore, has the session cookies stored for the website where we want them to perform an action, in this case for example, the bank's.

## How to Prevent Clickjacking

Now, I'm a website owner, and I want to prevent this from happening, or I'm on a pentest and I want to write how to remediate this attack. What do I do?

Well, there are two possible mechanisms to solve this, `X-Frame-Options` and `Content Security Policy` (CSP).

##### X-Frame-Options

`X-Frame-Options` is an HTTP header that the web server can include in its response, and, depending on the value it has, the web browser will allow the `<iframe>` to load or not. The three possible values for this header are:

- `X-Frame-Options: deny` --> Will not allow the website to be embedded in an `<iframe>` under any circumstances.
- `X-Frame-Options: sameorigin` --> Will only allow websites that are from the same origin to embed the website. The concept of origin is explained in the [Same Origin Policy](https://blog.deephacking.tech/en/posts/what-is-the-same-origin-policy-sop/) article.
- `X-Frame-Options: allow from <url>` --> In case we want to allow a website from a different origin to load our website in an `<iframe>`, we will indicate it with this header.

Example of an HTTP response that has this header implemented:

![HTTP response showing the X-Frame-Options header](https://cdn.deephacking.tech/i/posts/como-funciona-el-ataque-clickjacking/como-funciona-el-ataque-clickjacking-8.avif)

##### Content Security Policy (CSP)

`Content Security Policy` is another HTTP header that the server can include to prevent the website from being embedded in an `<iframe>`. This particular header is not limited to protecting only against Clickjacking, but it does have specific attributes for it:

- `Content-Security-Policy: frame-ancestors 'none';` --> Is the equivalent of `X-Frame-Options: deny`
- `Content-Security-Policy: frame-ancestors 'self';` --> Is the equivalent of `X-Frame-Options: sameorigin`
- `Content-Security-Policy: frame-ancestors <domain>;` --> Is the equivalent of `X-Frame-Options: allow from <url>`

A small difference of this header compared to `X-Frame-Options` is that CSP is more flexible, in the sense that it allows placing multiple domains if we want to allow multiple origins, and even using wildcards. For example, this would be totally valid:

- `Content-Security-Policy: 'self' https://web.com https://*.example-web.com`

> Just as we now know that these two headers protect against this attack, in the same way, we know that the lack of implementation of these will make the website vulnerable. So we know how to detect it and defend ourselves at the same time.

## References

- [Clickjacking protection using Content Security Policy on PortSwigger](https://portswigger.net/web-security/cross-site-scripting/content-security-policy#protecting-against-clickjacking-using-csp)
- [Clickjacking (UI redressing) on PortSwigger](https://portswigger.net/web-security/clickjacking)
