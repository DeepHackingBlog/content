---
id: "jwt-authentication-bypass-via-flawed-signature-verification"
title: "JWT authentication bypass via flawed signature verification – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2023-05-15
updatedDate: 2023-05-15
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-0.webp"
description: "Walkthrough of the PortSwigger lab on JWT authentication bypass through flawed signature verification, exploring how to exploit servers that accept unsigned tokens with the 'none' algorithm."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we're going to solve the "JWT authentication bypass via flawed signature verification" lab:

![JWT authentication bypass via flawed signature verification lab description](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-1.avif)

First of all, let's start the lab:

![Starting the lab in PortSwigger](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-2.avif)

Once we start it, we navigate to "My account" and log in with the credentials provided in the lab description:

![Navigation to My account](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-3.avif)

![Login form with credentials](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-4.avif)

![Session successfully started](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-5.avif)

Once we've logged in, whether using Burp Suite, developer tools, or as in this case, the Cookie Editor extension, we can see that we've been assigned a JWT:

![Session cookie with JWT token](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-6.avif)

We can decode it on the [jwt.io](https://jwt.io/) website:

![Decoded JWT structure in jwt.io](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-7.avif)

The vulnerability explored in this lab lies in the fact that the server accepts unsigned JWTs, that is, with the "none" algorithm. So in order to create a valid token that isn't signed, we must modify the `alg` field in the token header and, additionally, remove the signature part, the blue part that can be seen in the image above, though we must keep the final period.

Another important detail is that, when checking whether or not the server accepts unsigned tokens, different combinations of "none" should be tested as shown in Burp Suite's JOSEPH plugin:

![None algorithm variations in JOSEPH plugin](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-8.avif)

For example, in the case of this lab, the only one that works is the "none" algorithm, but the opposite may occur on other occasions, so all possible cases should always be checked.

That said, to modify the JWT we have, that is, modify the algorithm and remove the signature part, we can do it in multiple ways, in this case, we'll use the [jwtear](https://github.com/KINGSABRI/jwtear) tool:

![Modified JWT generation with jwtear](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-9.avif)

With this tool, simply with the `-h` argument we specify the token header, here we'll indicate that we'll use the "none" algorithm. On the other hand, with the `-p` argument we specify the payload, which in this case we'll change the user we want to be, instead of wiener, we'll put administrator.

For a real audit, we'd be interested in first seeing if by changing the algorithm to "none" and using the generated JWT, we're still authenticated as wiener, a possible escalation could come after verifying that we're still authenticated and, therefore, the server accepts unsigned JWTs.

The tool directly shows us the token without the signature on screen, so it'll be as simple as copy and paste. We copy this value and paste it in this case into Cookie Editor to change the value to our token:

![JWT replacement in Cookie Editor](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-10.avif)

We refresh the page and:

![Successful access as administrator](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-11.avif)

We're authenticated as the administrator user. With this done, all that remains is to navigate to the admin panel and delete the user Carlos:

![Admin panel](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-12.avif)

![Deletion of user carlos](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-13.avif)

This way, the lab is solved:

![Lab successfully completed](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-14.avif)

![Lab resolution confirmation](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-15.avif)
