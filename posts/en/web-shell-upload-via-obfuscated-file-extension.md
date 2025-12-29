---
id: "web-shell-upload-via-obfuscated-file-extension"
title: "Web shell upload via obfuscated file extension – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-17
updatedDate: 2022-02-17
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-0.webp"
description: "Learn to bypass file upload restrictions using the extension obfuscation technique with null bytes to execute PHP code."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we're going to solve the PortSwigger lab: "Web shell upload via obfuscated file extension".

![PortSwigger lab start page](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-1.avif)

To solve the lab, we need to upload a PHP file that reads and displays the contents of the `/home/carlos/secret` file. Since to demonstrate that we've completed the lab, we must enter the contents of this file.

Additionally, the server is configured to reject certain extensions.

In this case, the lab itself provides us with an account to log in, so let's do it:

![Login form](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-2.avif)

![Provided access credentials](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-3.avif)

Once we've logged in, we find ourselves on the account profile:

![User profile](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-4.avif)

Once we're on the profile, as we can see, we have a file upload field to update our account's avatar. Let's try to take advantage of this to upload the following file:

![PHP code to read the secret file](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-5.avif)

First of all, let's prepare Burp Suite to intercept the requests:

![Proxy configuration in browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-6.avif)

![Activating interception in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-7.avif)

Once we have this part configured, we upload the file:

![File selection for upload](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-8.avif)

![File upload confirmation](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-9.avif)

![Processing file upload](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-10.avif)

Burp Suite will intercept the upload request:

![Intercepted request in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-11.avif)

To better handle the file upload process, we're going to send the request to the repeater by pressing Ctrl R:

![Request sent to Burp Suite Repeater](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-12.avif)

As we can see, in this case, when clicking Send, we see in the server's response that only JPG and PNG files are allowed.

So the idea is going to be to introduce a double extension along with a null byte to see if we can bypass this restriction:

![Extension modification with null byte](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-13.avif)

![Successful server response](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-14.avif)

When sending the request, we see how in the response, the file has been uploaded, not only that, but thanks to the null byte, we've gotten rid of the second extension we had put `.jpg`. So with this done, let's view the response in the browser:

![Option to view response in browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-15.avif)

![Selection to show response in browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-16.avif)

![Response rendered in browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-17.avif)

![Successful upload confirmation](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-18.avif)

We're no longer going to use Burp Suite, so we disable the proxy:

![Disabling the proxy](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-19.avif)

Once disabled, we go back to our profile:

![Accessing user profile](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-20.avif)

![Profile view with updated avatar](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-21.avif)

As we can see, the avatar has been set, however, it appears that an error occurred while loading the image. Probably because it's trying to load our PHP file as if it were an image, and that's why it fails. Let's access the direct path of "the image" by right-clicking:

![Context menu to open image](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-22.avif)

![Error accessing with incorrect extension](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-23.avif)

It seems to give us a problem, however, if we look at the URL, it's trying to load the file `readSecret.php%00.jpg`, when in reality, the resulting file was `readSecret.php`. So we change the URL to access this last file:

![Successful execution of PHP code](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-24.avif)

And in this way, we access the PHP code and it's interpreted, thus managing to read the secret file.

Having read it, we simply submit the solution:

![Form to submit the solution](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-25.avif)

![Submitted solution confirmation](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-26.avif)

And in this way, we complete the lab:

![Lab completed successfully](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-27.avif)

![Final confirmation message](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-28.avif)
