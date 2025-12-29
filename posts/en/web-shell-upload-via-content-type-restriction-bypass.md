---
id: "web-shell-upload-via-content-type-restriction-bypass"
title: "Web shell upload via Content-Type restriction bypass - PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-10
updatedDate: 2022-02-10
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-0.webp"
description: "Learn to exploit file upload vulnerabilities by bypassing Content-Type restrictions to execute malicious PHP code."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we'll be solving the PortSwigger lab: "Web shell upload via Content-Type restriction bypass".

![PortSwigger lab home page](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-1.avif)

To solve the lab, we need to upload a PHP file that reads and displays the contents of the `/home/carlos/secret` file. Since to demonstrate that we've completed the lab, we must submit the contents of this file.

Additionally, the server is configured to prevent file uploads based on the `Content-Type`. So we'll need to bypass this defense.

In this case, the lab itself provides us with an account to log in, so let's do that:

![Login form](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-2.avif)

![Provided access credentials](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-3.avif)

Once we've logged in, we're presented with the account profile:

![User profile](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-4.avif)

As we can see, we have an option to upload a file, specifically it appears to be for updating the profile avatar. Let's try to take advantage of this option to upload the following PHP file:

![PHP code to read the secret file](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-5.avif)

First, let's prepare Burp Suite to intercept the request:

![Browser proxy configuration](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-6.avif)

![Activating interception in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-7.avif)

Once we have Burp Suite ready along with the proxy, we select the file and click "Upload":

![File selection for upload](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-8.avif)

![File upload confirmation](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-9.avif)

![Processing file upload](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-10.avif)

Here Burp Suite will intercept the file upload request:

![Intercepted request in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-11.avif)

Let's send the request to the repeater for better handling, to do this, we press `Ctrl R`.

Once in the repeater, when we click "Send", we can see the server's response to the file upload:

![Server response showing restriction](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-12.avif)

In this case, it indicates that files whose `Content-Type` header is `application/x-php` are not allowed. And that only those with `image/jpeg` or `image/png` are permitted.

Knowing the type of restriction the server is imposing on us, we can simply change the `Content-Type` of our request:

![Modifying the Content-Type in the request](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-13.avif)

![Content-Type modified to image/jpeg](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-14.avif)

With this, the file content doesn't change, and it won't affect its interpretation either. With this change, we try uploading the file again:

![Successful server response](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-15.avif)

This time we see that it has been successfully uploaded. We can view this response in the browser as follows:

![Show response in browser option](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-16.avif)

![URL to display response in browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-17.avif)

![Viewing the response in the browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-18.avif)

![Accessing the profile from the browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-19.avif)

Once we get here, we can now disable Burp Suite, as we won't be using it anymore.

![Proxy deactivation](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-20.avif)

With this, we return to our profile.

![Accessing user profile](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-21.avif)

Now, if we look at the profile, we can see that the avatar has changed and is now showing an error that the image isn't loading properly:

![Avatar with loading error](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-22.avif)

By right-clicking on it, we can go directly to the image path to see if it's our PHP file:

![Context menu to open image](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-23.avif)

![Successful PHP file execution](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-24.avif)

Indeed, the PHP file we uploaded has been stored as the avatar file, that's why it wasn't loading on the profile, it was trying to load an image when it wasn't one. By visiting the PHP file, the code we placed has been interpreted, and we successfully read the secret file.

Having read this file, we simply submit the answer:

![Form to submit the solution](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-25.avif)

![Submitted solution confirmation](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-26.avif)

And this way, we complete the lab:

![Lab completed successfully](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-27.avif)

![Final confirmation message](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-28.avif)
