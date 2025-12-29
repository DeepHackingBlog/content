---
id: "jwt-authentication-bypass-via-unverified-signature"
title: "JWT authentication bypass via unverified signature – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2023-05-01
updatedDate: 2023-05-01
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-0.webp"
description: "Walkthrough of the PortSwigger lab on JWT authentication bypass through unverified signatures, explaining how to exploit this vulnerability when the server doesn't properly validate token signatures."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we're going to solve the "JWT authentication bypass via unverified signature" lab:

![JWT authentication bypass via unverified signature lab description](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-1.avif)

First of all, let's start the lab:

![Starting the lab in PortSwigger](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-2.avif)

Once we start it, we navigate to "My account" and log in with the credentials provided in the lab description:

![Navigation to My account](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-3.avif)

![Login form with credentials](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-4.avif)

![Session successfully started](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-5.avif)

Now that we're authenticated, if we examine the cookies we have, we can observe that there's a cookie called "session" which is a JWT:

![Session cookie with JWT token](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-6.avif)

If we copy this value and paste it into jwt.io, we can see the JWT structure:

![Decoded JWT structure in jwt.io](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-7.avif)

In this case, in the payload section, we can observe the `sub` field that has our username as its value. So something we might think when seeing this is that this field defines which user is authenticated.

At this point, if we're familiar with JWT vulnerabilities, several things might come to mind to test, however, in this case, the JWT is vulnerable to "unverified signature". This means that the server doesn't check whether the JWT token signature is correct or not, therefore, without knowing the public key or anything else in this case, we can edit the JWT token as we please because the server won't verify if the token is correctly signed or not.

Since the signature doesn't matter to us, what we're interested in is modifying the `sub` field to see if we can authenticate as another user, in this case, "administrator".

This task of modifying the JWT can be done in various ways, for example, using the [jwtear](https://github.com/KINGSABRI/jwtear) tool:

- `jwtear jws -h <header> -p <payload>`

![Modified JWT generation with jwtear](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-8.avif)

In this case, we also modify the algorithm to "None" because if we leave it as RSA, it will ask us for a key to sign the token. Which actually, since it doesn't verify it, we could leave the same algorithm and sign it with any key. It also works if we modify the algorithm to HMAC and sign it with any secret. For simplicity, we modify it to "None" and that's it.

With the JWT we just generated, if we replace it with the one we had and refresh to use it:

![JWT replacement in session cookie](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-9.avif)

![Successful access as administrator](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-10.avif)

We become "administrator".

Now to solve the lab, we navigate to the admin panel and delete the user "carlos".

![Admin panel](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-11.avif)

![Deletion of user carlos](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-12.avif)

This way we solve the first JWT lab :).

The entire JWT editing procedure could have also been done using the Burp Suite plugin "JSON Web Tokens". In this case, we would intercept a request to the profile and send it to the repeater:

![Request interception and sending to Repeater](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-13.avif)

Once in the repeater, we select the extension:

![JSON Web Tokens extension selection](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-14.avif)

![JSON Web Tokens extension interface](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-15.avif)

![Decoded JWT parts](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-16.avif)

In the new interface that's enabled, we can observe the different parts of the JWT decoded and separated. In this case, we would simply have to edit "wiener" to "administrator" and send the request

![Editing the sub field in the JWT](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-17.avif)

![Successful response with administrator privileges](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-18.avif)

This way would also work, and in this case, we haven't edited the signature or the algorithm, only the payload. All due to what we've already mentioned, the server doesn't really care about the JWT signature.
