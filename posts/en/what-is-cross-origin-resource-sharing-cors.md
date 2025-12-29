---
id: "que-es-el-cross-origin-resource-sharing-cors"
title: "What is Cross-Origin Resource Sharing (CORS)"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-05-09
updatedDate: 2022-05-09
image: "https://cdn.deephacking.tech/i/posts/que-es-el-cross-origin-resource-sharing-cors/que-es-el-cross-origin-resource-sharing-cors-0.webp"
description: "Detailed explanation of Cross-Origin Resource Sharing (CORS), its HTTP headers, functionality, and potential configuration vulnerabilities in web applications."
categories:
  - "web"
draft: false
featured: false
lang: "en"
---

CORS (Cross-Origin Resource Sharing) is an extension of the SOP (Same Origin Policy). If you don't know what the latter is, [you have a post here on the blog that explains it](https://blog.deephacking.tech/en/posts/what-is-the-same-origin-policy-sop/), it's better to read it before continuing with this one.

Table of Contents:

- [Understanding CORS](#understanding-cors)
- [Potential vulnerabilities](#potential-vulnerabilities)
- [Coexistence between CORS and SOP](#coexistence-between-cors-and-sop)
- [References](#references)

## Understanding CORS

Now, if you already know how SOP works, you'll know that it's a quite restrictive security mechanism, and that's why CORS was created, a functionality that allows extending this limitation when establishing communication between two entities from different origins.

CORS allows us to configure the SOP so that it doesn't apply if certain conditions are met. In other words, thanks to CORS, we have the possibility of configuring a server so that a client from another origin can communicate with it without problems. Put simply:

> It enables cross-origin requests from the client side

At a conceptual and theoretical level, yes, all very nice, but at a practical level, what is it, how do I identify it?

Basically, CORS is a set of HTTP headers that the server adds from its side to record what it allows and what it doesn't. Specifically, the two headers related to CORS are:

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Credentials`

The first header, `Access-Control-Allow-Origin`, indicates with which origin the response can be shared:

![Access-Control-Allow-Origin header in HTTP response](https://cdn.deephacking.tech/i/posts/que-es-el-cross-origin-resource-sharing-cors/que-es-el-cross-origin-resource-sharing-cors-1.avif)

For example, let's consider the case where I visit Website A. When visiting Website A, it makes a request to Website B. Website B will return the response to our browser. Now, at this point is where the browser, upon receiving the request, says:

- Okay, Website B tells me in its response that I can share it with Website A.

Therefore, Website A receives the response to the request it made without problems and can read it perfectly.

ATTENTION, as explained, here the SOP doesn't act, since CORS is defined in a way that favors communication between both origins, even though they're different.

Now, let's consider the case where Website B doesn't place the `Access-Control-Allow-Origin` header:

![SOP blocking request without CORS header](https://cdn.deephacking.tech/i/posts/que-es-el-cross-origin-resource-sharing-cors/que-es-el-cross-origin-resource-sharing-cors-2.avif)

Here, again, I visit Website A. When visiting Website A, it makes a request to Website B. Website B will return the response to our browser, but now, at this point, the browser upon receiving the request says:

- Okay, I don't see the CORS header anywhere, therefore, I apply the SOP. Are both origins the same? Nope, therefore, I don't let Website A read the response that Website B has given.

So, seeing these two cases, the behavior of the absence or presence of CORS would be something like this:

![CORS and SOP functionality diagram](https://cdn.deephacking.tech/i/posts/que-es-el-cross-origin-resource-sharing-cors/que-es-el-cross-origin-resource-sharing-cors-3.avif)

That said, there are three possible values for the `Access-Control-Allow-Origin` header:

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Origin: <origin>`
- `Access-Control-Allow-Origin: null`

The value `*` (asterisk) will allow any origin to have the ability to read the server's responses (this configuration already sounds sketchy, doesn't it?).

The second possible value of the header is a specific origin that you specify, for example:

- `Access-Control-Allow-Origin: http://deephacking.tech:8080`

If you're wondering, no, you can't add multiple origins, this way it only allows a single value. [This StackOverflow post discusses how to configure multiple origins without using the asterisk](https://stackoverflow.com/questions/1653308/access-control-allow-origin-multiple-origin-domains).

Lastly, the third value (`null`) would allow null origins to have the ability to read the server's responses. Now, in what cases would the origin have null as a value? Well, this value is usually set when a redirection occurs, or they're also the origins used by local files. [This StackOverflow reference explains when the origin is set to null](https://stackoverflow.com/questions/8456538/origin-null-is-not-allowed-by-access-control-allow-origin).

Another recommended reference for null Origin is this one:

- [When do browsers send the Origin header? When do browsers set the origin to null?](https://stackoverflow.com/questions/42239643/when-do-browsers-send-the-origin-header-when-do-browsers-set-the-origin-to-null)

> We've mentioned a lot about reading responses and such. At a practical level, this could refer, for example, to the JavaScript code of the website we're visiting making an `XMLHttpRequest` to another origin, and the response to this request is what, depending on the case, the JavaScript code could read or not.

At this point, it's important to keep in mind an important detail: this header really only allows communication between public pages, not authenticated pages.

Let me explain. Generally, any request that the browser makes to a web server and resource will include the cookies and sessions that the browser has stored.

However, the responses to the requests that we can observe with this header are responses to simple requests, without cookies or anything, that's why the mention above of "public pages." Now, what happens if the Frontend JavaScript of the website we're visiting makes a request with session cookies to an authenticated resource from another origin? In this case, with the header we've seen, it won't be enough for the browser and CORS to allow reading the server's response.

This is where the second header we mentioned earlier comes into play, `Access-Control-Allow-Credentials`. The only possible value for this header is `true` (`false` wouldn't apply because in that case the header simply wouldn't be set).

Basically, this header enables reading the server's response when it possesses credentials. In other words, session cookies and such, also in other words, reading authenticated resources.

![Access-Control-Allow-Credentials header in HTTP response](https://cdn.deephacking.tech/i/posts/que-es-el-cross-origin-resource-sharing-cors/que-es-el-cross-origin-resource-sharing-cors-4.avif)

For example, if a request is made to `/api/apiKey` and the server's CORS admits the origin and credentials, then the malicious page will be able to read the value of the user's apiKey, which is only accessible with authentication. If the `Allow-Credentials` header weren't present, no matter how much the origin is admitted, the malicious page would be unable to read the response, since it's a resource accessible only to authenticated users.

ATTENTION, an important detail about this header is that it's not allowed when the value of the `Access-Control-Allow-Origin` header is `*`.

## Potential vulnerabilities

When we talk about potential CORS deficiencies, we're not talking about CORS having vulnerabilities, but rather that its implementation is poorly done, that is, a security misconfiguration.

Well, keeping this in mind, and going back to the three possible values that the `Access-Control-Allow-Origin` header can have, we can realize that it's quite limited not being able to whitelist more than one origin. That's why I also attached a reference to possible solutions when what you're interested in is admitting more than one origin, but without having to admit all of them using the asterisk.

It's in this precise situation when web developers must implement some dynamic configuration to admit multiple origins. Depending on how the implementation is carried out, this is where we can find vulnerabilities. Here are some examples:

- It can happen that the server generates the `Access-Control-Allow-Origin` header based on what the client specifies in the `Origin` header of the request. That is, perhaps in legitimate requests we're seeing `Origin: legitimatedomain.com`, and therefore, the server responds with `Access-Control-Allow-Origin: legitimatedomain.com`. But if the value of the `Access-Control-Allow-Origin` header is generated from the value of the `Origin` header of the client's request, if we change it to `Origin: maliciousdomain.com`, the server will respond with `Access-Control-Allow-Origin: maliciousdomain.com`. And this happens because the server simply makes a poor implementation of dynamic origin generation, letting the client be the one who chooses the allowed origin.
  - If, for example, we make a request to the server and it doesn't contain the `Origin` header, but the server does respond with the `Access-Control` headers, it may be probable that this security flaw we just mentioned occurs. In the same way, it may not occur, but this could be an indicator.
- Errors when implementing a whitelist. Developers can make mistakes when defining the whitelist, for example, using regex. If developers write that they trust all origins that are `*legitimatedomain.com`, well, it's as simple as the attacker using an origin that ends the same way, for example, `malicioussitelegitimatedomain.com`. Following the defined regex, the application would perfectly trust the malicious origin we've placed. In the same way, the opposite can occur, that the server says it trusts origins that are `legitimatedomain.com*`. In this way, the attacker could take advantage of this configuration to place `legitimatedomain.com.malicioussite.com`, and again, it would be totally accepted by the server.
- In addition to these two possible occurrences, it can happen that the server admits the null origin. For example, we place `Origin: null` in the request, and the server responds with `Access-Control-Allow-Origin: null`.

These three potential vulnerabilities we just saw, as we can see, depend 100% on the developers' implementation, that's why what was mentioned before: all CORS vulnerabilities are really misconfigurations.

> Mini note, these three flaws we just saw are perfectly compatible with the joint use of the `Access-Control-Allow-Credentials` header. If we find one of these flaws, and also the `Allow-Credentials` header is present, well, F, because at a practical level it would be the same as if the `Access-Control-Allow-Origin` header had the asterisk as a value, and at the same time, the `Allow-Credentials` header, which we already know is not allowed, but in this case, at a practical level it would be as if it were.
> 
> Therefore, CORS vulnerabilities become especially critical and important when the `Allow-Credentials` header is present.

> Another super important detail to remember, which helps us better visualize the potential impact of a vulnerability of this type, is that by default, in all requests that your browser makes to a website, stored session cookies, etc., will be added. So if we visit a malicious site and it causes a request to, for example, our bank, if we have the session saved, the request will be made with our cookies and such. If you add to this that CORS is misconfigured, well, the malicious website we've visited will be able to read our bank data. This would be a possible proof of concept of what can happen if CORS is misconfigured.

Lastly, in relation to the CORS security flaws we've seen, these two articles are quite good:

- [Exploiting CORS misconfigurations for Bitcoins and bounties](https://portswigger.net/research/exploiting-cors-misconfigurations-for-bitcoins-and-bounties)
- [StackStorm - From Originull to RCE - CVE-2019-9580](https://quitten.github.io/StackStorm/)

## Coexistence between CORS and SOP

We already know how both work. Now, let's give an example so you can understand the coexistence of these two security mechanisms and why they complement each other:

- SOP prevents that when visiting `https://malicious_website.com`, this website can perform actions and obtain information from `https://protected_website.com`.
- Likewise, CORS allows `https://protected_website.com` to be accessible from origins other than itself, while preventing the scenario mentioned above with SOP.

And that's precisely why they complement each other ^^.

That said, this is really what CORS is. We've seen its functionality, purpose, and potential configuration errors.

## References

- [CORS and the SOP explained](https://blog.dataminded.com/cors-and-the-sop-explained-f59de3a5078)
- [Cross-Origin Resource Sharing (CORS) | Complete Guide](https://www.youtube.com/watch?v=t5FBwq-kudw)
- [Access-Control-Allow-Origin Multiple Origin Domains?](https://stackoverflow.com/questions/1653308/access-control-allow-origin-multiple-origin-domains)
