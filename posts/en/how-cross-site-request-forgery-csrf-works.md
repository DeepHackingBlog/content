---
id: "como-funciona-el-cross-site-request-forgery-csrf"
title: "How Cross-site Request Forgery (CSRF / XSRF) Works"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-06-13
updatedDate: 2022-06-13
image: "https://cdn.deephacking.tech/i/posts/como-funciona-el-cross-site-request-forgery-csrf/como-funciona-el-cross-site-request-forgery-csrf-0.webp"
description: "Learn how the Cross-site Request Forgery (CSRF) attack works, its conditions, practical exploitation examples, and main defenses like CSRF tokens and the SameSite attribute."
categories:
  - "web"
draft: false
featured: false
lang: "en"
---

Cross-site Request Forgery is a web attack that forces a user to perform involuntary actions on their behalf.

- [Proof of Concept (PoC)](#proof-of-concept-poc)
- [Defenses](#defenses)
- [References](#references)

## Proof of Concept (PoC)

For example, let's imagine a situation where our bank's website, every time we change the password. The change request is approximately as follows:

```http
GET /account/password?nuevapassword=hola&confirmarpassword=hola HTTP/1.1
Host: elmejorbancodelmundo.com
Cookie: session=kpthbsztyeQgAPqeQ8gHgTVLYxyfsAfE
```

As we can see, it's a simple GET request where the change parameters are specified in the URL, and the change itself is carried out through this HTTP method.

We'll mention that this is a mess in itself and shouldn't be like this, but for now, let's accept that it's this way to explain the CSRF concept.

Now, the problem really comes when the user doesn't log out of the website, that is, the session cookie is kept stored by the browser for when the corresponding website is accessed.

What happens if the user accesses a website (e.g., fotossensibles.com) which has an action declared in the HTML code that could be making a GET request to:

- The domain of `elmejorbancodelmundo.com`
- With the path `/account/password`
- And with the parameters `?nuevapassword=cagaste&confirmarpassword=cagaste`

An example of a malicious HTML template would be:

```html
<html>
    <body>
        <form action="https://elmejorbancodelmundo.com/account/password?nuevapassword=cagaste&confirmarpassword=cagaste" method="GET">
        </form>
        <script>
            document.forms[0].submit()
        </script>
    </body>
</html>
```

> Note: this HTML code, although it does what we want it to do, is not optimal because it will redirect the user to the password change website. And the user themselves will be able to see that they have been redirected and that their password has just changed. To do it in the "background" we could use, for example, an iframe.

The user's browser, upon receiving this HTML code from fotossensibles.com, will interpret it to show the content to the user. However, when interpreting it, the browser itself will execute this action declared in the code and make a GET request to:

- `elmejorbancodelmundo.com/account/password?nuevapassword=cagaste&confirmarpassword=cagaste`

And of course, having the stored cookie from elmejorbancodelmundo.com, the browser will add it to the request it makes, this will result in the user's account password being changed and all without their authorization.

Graphically, what is happening is the following:

<figure>

![Explanatory diagram of the CSRF attack showing the interaction between the user, the malicious site, and the legitimate site](https://cdn.deephacking.tech/i/posts/como-funciona-el-cross-site-request-forgery-csrf/como-funciona-el-cross-site-request-forgery-csrf-1.avif)

<figcaption>

Forgive me, I don't know how to draw better

</figcaption>

</figure>

This is what CSRF is about at a conceptual level.

This, as mentioned before, is just an example to understand the concept of the vulnerability. Since the first flaw in this example is that changes should not be allowed through the GET method, it's a standard that whenever data should be sent or changes made on a website, it should be through POST.

Even so, the fact that it's through POST doesn't prevent the attack from happening either. The three main conditions that must be met for CSRF to occur are:

- Relevant action
- Stored session cookie
- No unpredictable parameters

Taking these conditions into account and applying them to the example above, it would be as follows:

- The relevant action was that we could change the password
- The user had the bank's cookie stored because they hadn't logged out of the site
- All request parameters are predictable

The first two conditions can be easily understood and their logic seen, however, regarding the second condition there are some details to discuss, and the third will be better understood when we talk about the CSRF Token later.

## Defenses

Basically, the way to avoid this attack is by using parameters that are totally unpredictable for the attacker, and this is what is known as a CSRF Token. The CSRF Token is a unique, secret, and unpredictable value that is sent in the same request as the change, so the attacker will not be able to create an HTML template/code that sends this request, for the simple fact that the attacker doesn't know the value of the CSRF Token for the server to accept the request. To better understand this last point, let's see what the example above would look like, but through a POST request:

```http
GET /account/password HTTP/1.1
Host: elmejorbancodelmundo.com
Cookie: session=kpthbsztyeQgAPqeQ8gHgTVLYxyfsAfE

nuevapassword=cagaste&confirmarpassword=cagaste
```

An example of an HTML template for this request would be:

```html
<html>
    <body>
        <form action="https://elmejorbancodelmundo.com/account/password" method="POST">
            <input type="hidden" name="nuevapassword" value="cagaste" />
            <input type="hidden" name="confirmarpassword" value="cagaste" />
        </form>
        <script>
            document.forms[0].submit()
        </script>
    </body>
</html>
```

This would work in the same way as previously stated, only changing that the request would be POST instead of GET. Now, what happens if the server, in addition to the data provided above, expects a CSRF Token, that is, the request would be as follows:

```http
GET /account/password HTTP/1.1
Host: elmejorbancodelmundo.com
Cookie: session=kpthbsztyeQgAPqeQ8gHgTVLYxyfsAfE

nuevapassword=cagaste&confirmarpassword=cagaste&csrf=APqeQ8gHgTVLYxyfsAfEsztyeQgkpthb
```

If the server received the password change request with the CSRF parameter, it would accept it. Now, from the attacker's perspective, when creating the template, they have no idea of the CSRF value, because it's a value that keeps changing, so it would be impossible to generate an HTML template that includes the correct value of the CSRF token, thus preventing this attack.

In addition to being unpredictable, the CSRF Token must:

- Be associated with the user's session
- Be completely validated before performing the action

Another defense that could be added is the `SameSite` attribute in cookies, this cookie attribute allows them to be controlled in cross-site requests. With this attribute, depending on how it's configured, it may be possible to prevent the browser from adding cookies to the request made by the malicious website (or any other website that is not the bank in this case). This attribute has 3 possible values:

- `None` --> Simply disabled, it's the default
- `Strict` --> The browser will not include in any request the cookie that has this value in the `SameSite` attribute
- `Lax` --> The browser will include in requests cookies that have this value only if the following two requirements are met:
    - The request uses the GET method
    - The request is originated by a user interaction such as clicking a link. If it's generated by code, the cookie will not be included

And as mentioned, this would be a possible additional defense layer to the CSRF Token.

Finally, you might wonder, at what point does the legitimate client know the value of the CSRF Token, at what point is there an exchange of information where the client receives this value to subsequently add it to the request it makes to the server?

Well, generally, this value is found in the website's source code, it can be in the corresponding form part or anywhere in the source code, example:

<figure>

![Example of CSRF Token in LinkedIn's source code showing the csrfToken field](https://cdn.deephacking.tech/i/posts/como-funciona-el-cross-site-request-forgery-csrf/como-funciona-el-cross-site-request-forgery-csrf-2.avif)

<figcaption>

LinkedIn

</figcaption>

</figure>

Therefore, on many occasions, it's possible to concatenate XSS and CSRF to do cool stuff :).

Now yes, to finish completely, an example of a malicious HTML template using an `iframe` so that, as mentioned at the beginning, everything is done in the "background":

```html
<html>
    <body>
        <iframe style="display:none" name="csrf-iframe"></iframe>
        <form action="https://elmejorbancodelmundo.com/account/password" method="POST" id="csrf-form" target="csrf-iframe">
            <input type="hidden" name="nuevapassword" value="cagaste" />
            <input type="hidden" name="confirmarpassword" value="cagaste" />
        </form>
        <script>
            document.getElementById("csrf-form").submit()
        </script>
    </body>
</html>
```

## References

- [How to pass CSRF token from server to client on Stack Overflow](https://stackoverflow.com/questions/50732159/how-to-pass-csrf-token-from-server-to-client)
- [Understanding CSRF on Stack Overflow](https://stackoverflow.com/questions/2581488/understanding-csrf)
- [Cross-site Request Forgery on IITBreachers Wiki](https://csea-iitb.github.io/IITBreachers-wiki/2020/07/22/CSRF.html)
- [CSRF tokens on PortSwigger Web Security](https://portswigger.net/web-security/csrf/tokens)
- [How CSRF correlates with Same Origin Policy on Stack Exchange Security](https://security.stackexchange.com/questions/157061/how-does-csrf-correlate-with-same-origin-policy)
- [Same-origin policy on PortSwigger Web Security](https://portswigger.net/web-security/cors/same-origin-policy)
- [Why Same-origin policy is not enough to prevent CSRF attacks on Stack Overflow](https://stackoverflow.com/questions/33261244/why-same-origin-policy-isnt-enough-to-prevent-csrf-attacks)
- [Same Origin Policy on AppSecMonkey](https://www.appsecmonkey.com/blog/same-origin-policy)
