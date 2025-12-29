---
id: "jwt-authentication-bypass-via-weak-signing-key"
title: "JWT Authentication Bypass via Weak Signing Key – PortSwigger Write-Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2023-06-12
updatedDate: 2023-06-12
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-0.webp"
description: "Learn to exploit JWT vulnerabilities with weak signing keys in this PortSwigger lab write-up on JWT authentication."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we are going to solve the lab "JWT authentication bypass via weak signing key":

![JWT authentication bypass via weak signing key lab description](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-1.avif)

The first thing to do is start the lab:

![Button to access the lab](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-2.avif)

Once we start it, we go to "My account" and log in with the credentials provided in the description:

![Lab home page](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-3.avif)

![Login form](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-4.avif)

![Wiener user account page](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-5.avif)

Once we have logged in, whether with Burp Suite, developer tools, or in this case, the Cookie Editor extension, we can see that a JWT has been assigned to us:

![JWT cookie in Cookie Editor](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-6.avif)

We can decode it on [JWT.io](https://jwt.io/):

![Decoded JWT showing wiener user](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-7.avif)

If we look at this JWT, the HMAC algorithm is being used, specifically HS256. This means that the signature and its verification are done through a key.

The interesting thing about this is that it's as if we had the hash of a password, meaning we can try to crack the "secret" that was used to sign the JWT. If we obtain it, we will be able to sign JWT tokens that are valid for the server and, likewise, we will be able to edit them.

To perform the brute force attack, we can use the [jwtear](https://github.com/KINGSABRI/jwtear) tool:

- `jwtear bruteforce -t <JWT> -l <dictionary>`

![Jwtear bruteforce result showing the found secret](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-8.avif)

In this case, the server used the word "secret1" to sign the JWT tokens. Now that we know the word used to sign the tokens, we can try to edit a JWT to our benefit and sign it using "secret1":

![Modified JWT on JWT.io changing user to administrator](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-9.avif)

![JWT signed with the found secret](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-10.avif)

We have changed the user from "wiener" to "administrator" so that, in case the signature works and the "administrator" user exists, we can become them.

If we now replace our JWT with the JWT we just generated and refresh:

![Replacing the JWT in Cookie Editor](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-11.avif)

![Admin panel after successful bypass](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-12.avif)

We become administrator users :), all due to the use of a weak "secret" in the JWT signature.

Now, to complete the lab, we simply go to the administration panel and delete the "carlos" user:

![Access to admin panel](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-13.avif)

![Button to delete carlos user](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-14.avif)

![Carlos user successfully deleted](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-15.avif)

This way, the lab is now completed:

![Lab completed successfully](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-16.avif)

JWTear is not the only tool that can be used for JWT brute force attacks, with a little searching we can find countless others:

![GitHub search for JWT cracking tools](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-17.avif)

We can also find dictionaries for brute force attacks:

![JWT dictionaries in GitHub repositories](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-18.avif)

SecLists also has a dictionary:

- [scraped-JWT-secrets.txt](https://github.com/danielmiessler/SecLists/blob/master/Passwords/scraped-JWT-secrets.txt)

![JWT secrets dictionary in SecLists](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-19.avif)
