---
id: "web-shell-upload-via-path-traversal"
title: "Web shell upload via path traversal - PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-15
updatedDate: 2022-02-15
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-0.webp"
description: "Learn to exploit file upload vulnerabilities using path traversal techniques to bypass execution restrictions and execute malicious PHP code."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we'll be solving the PortSwigger lab: "Web shell upload via path traversal".

![PortSwigger lab home page](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-1.avif)

To solve the lab, we need to upload a PHP file that reads and displays the contents of the `/home/carlos/secret` file. Since to demonstrate that we've completed the lab, we must submit the contents of this file.

Additionally, the server is configured to prevent the execution of user-supplied files, so we'll need to bypass this defense.

In this case, the lab itself provides us with an account to log in, so let's do that:

![Login form](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-2.avif)

![Provided access credentials](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-3.avif)

Once we've logged in, we're presented with the account profile:

![User profile](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-4.avif)

As we can see, we have an option to upload a file, specifically it appears to be for updating the profile avatar. Let's try to take advantage of this option to upload the following PHP file:

![PHP code to read the secret file](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-5.avif)

First, let's prepare Burp Suite to intercept the request:

![Browser proxy configuration](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-6.avif)

![Activating interception in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-7.avif)

Once we have Burp Suite ready along with the proxy, we select the file and click "Upload":

![File selection for upload](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-8.avif)

![File upload confirmation](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-9.avif)

![Processing file upload](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-10.avif)

Here Burp Suite will intercept the file upload request:

![Intercepted request in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-11.avif)

With this request, let's go to the "Decoder" tab in Burp Suite and URL encode the following:

<figure>

![URL encoding the filename](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-12.avif)

<figcaption>

`../readSecret`

</figcaption>

</figure>

We URL encode this because it's the name we're going to give to the file we're uploading, we'll change the name in the request itself. It's encoded so that the dot and slash symbols aren't removed or misinterpreted by the server.

By uploading a file with this name, depending on how the server handles it, we might be able to store it one directory back from where it should be, and thus bypass the restriction that indicates the server won't execute user-supplied files. This technique of using dots and slashes is called Path Traversal.

That said, let's pass the request to the repeater with Ctrl R, change the name, and send the request:

![Modified request with path traversal in Repeater](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-13.avif)

According to the response, the file has been successfully uploaded with the name `../readSecret.php`. Let's view this response in the browser. To do this, right-click on the response, click on the "Show response in browser" option, and copy the generated link:

![Show response in browser option](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-14.avif)

![URL to display response in browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-15.avif)

Once we get here, we can now disable Burp Suite, as we won't be using it anymore.

![Proxy deactivation](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-16.avif)

With this, we return to our profile.

![Accessing user profile](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-17.avif)

Now, if we look at the profile, we can see that the avatar has changed and is now showing an error that the image isn't loading properly:

![Avatar with loading error](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-18.avif)

By right-clicking on it, we can go directly to the image path to see if it's our PHP file:

![Context menu to open image](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-19.avif)

![Successful PHP file execution](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-20.avif)

And indeed, the PHP file we uploaded has been stored as the avatar file, that's why it wasn't loading on the profile, it was trying to load an image when it wasn't one. By visiting the PHP file, the code we placed has been interpreted, and we successfully read the secret file. In fact, we could also access the file at the following path:

![Alternative access to PHP file via path traversal](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-21.avif)

It was uploaded one directory back from where it should be, which is why it's interpreted and isn't affected by the server restriction.

Having read this file, we simply submit the answer:

![Form to submit the solution](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-22.avif)

![Submitted solution confirmation](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-23.avif)

And this way, we complete the lab:

![Lab completed successfully](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-24.avif)

![Final confirmation message](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-25.avif)
