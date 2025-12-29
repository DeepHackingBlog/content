---
id: "remote-code-execution-via-polyglot-web-shell-upload"
title: "Remote code execution via polyglot web shell upload – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-22
updatedDate: 2022-02-22
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-0.webp"
description: "Step-by-step resolution of the PortSwigger lab on remote code execution through uploading a polyglot web shell, exploiting file content validation."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we are going to solve the PortSwigger lab: "Remote code execution via polyglot web shell upload".

![Lab homepage for Remote code execution via polyglot web shell upload](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-1.avif)

To solve the lab, we need to upload a PHP file that reads and displays the content of the `/home/carlos/secret` file. To demonstrate that we have completed the lab, we must submit the content of this file.

Additionally, the server is configured to verify if the file is an image by examining its content.

In this case, the lab itself provides us with an account to log in, so let's do that:

![Lab login page](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-2.avif)

![Credentials provided for the lab](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-3.avif)

Once we have logged in, we find the account profile:

![User profile with avatar upload option](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-4.avif)

As we can see, we have an option to upload a file, specifically it appears to be for updating the profile avatar. We are going to try to take advantage of this option to upload the following PHP file:

![PHP file with image magic numbers](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-5.avif)

Be careful, if we look closely, in this case, in addition to the PHP code itself, I am defining a string at the beginning of the file. This happens because to determine the content type of a file, the first bytes are used, which is known as "magic numbers". These first bytes of files determine what type they are or how they will be treated, even if the content is completely different.

As we can see, it contains PHP code, but Linux itself detects it as an image, this happens because of the magic numbers.

[Complete list of magic numbers by file type](https://gist.github.com/leommoore/f9e57ba2aa4bf197ebc5)

With this understood, we configure Burp Suite to intercept the requests:

![Proxy configuration in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-6.avif)

![Interception enabled in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-7.avif)

Once we have Burp Suite ready along with the proxy, we select the file and upload it:

![Selecting the polyglot PHP file to upload](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-8.avif)

![File selected ready to upload](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-9.avif)

![Button to send the file to the server](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-10.avif)

Burp Suite will intercept the file upload request:

![Intercepted request in Burp Suite showing the file](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-11.avif)

To better handle the request, we are going to send it to the repeater and at the same time click send to analyze the response:

![Server response confirming successful upload](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-12.avif)

It seems to have uploaded without problems. Let's view this response in the browser:

![Option to show response in browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-13.avif)

![Confirmation to open in browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-14.avif)

![Burp Suite integrated browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-15.avif)

![Profile page showing successfully uploaded file](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-16.avif)

Once here, we no longer need Burp Suite, so we are going to disable the proxy:

![Disabling proxy in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-17.avif)

With this done, we go to our profile:

![Accessing user profile](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-18.avif)

Now, if we look at the profile, we can see that the avatar has changed and now shows an error that it doesn't load the image properly:

![Avatar showing image loading error](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-19.avif)

This is probably because it is trying to load our PHP file as if it were an image, and of course, it fails to do so. To confirm if it is our PHP file, we right-click to go to the exact path of "the image":

![Context menu to open image in new tab](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-20.avif)

![Executed PHP file showing the content of secret](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-21.avif)

As we can see, it is indeed our PHP file, and in addition to the string placed to establish the magic numbers, we can see the content of the `secret` file. In other words, the output of the interpreted PHP code.

Having the content of `secret`, we simply submit the answer:

![Form to submit the lab solution](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-22.avif)

![Solution submission confirmation](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-23.avif)

And in this way, we solve the lab:

![Lab solved successfully](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-24.avif)

![Congratulations message for solving the lab](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-25.avif)

In addition to the solution we have carried out, PortSwigger suggests another quite interesting one worth mentioning:

1. We create an `exploit.php` file that reads the content of Carlos's `secret` file, for example: `<?php echo file_get_contents('/home/carlos/secret'); ?>`
2. We log in and try to upload our PHP file in the avatar section. As we will see, the server blocks any file upload that is not an image.
3. We are going to create a polyglot PHP/JPG file. That is, a file that is an image but contains PHP code in its metadata. To do this, it is as simple as using any image and adding custom metadata using `exiftool`. Example: `exiftool -Comment="<?php echo 'START ' . file_get_contents('/home/carlos/secret') . ' END'; ?>" <YOUR-INPUT-IMAGE>.jpg -o polyglot.php` . This will add the PHP payload to the comment field of the metadata. With this, we will save the image with the `.php` extension.
4. Now, we upload this file, we will see that we have no problem. With this done, we return to our profile.
5. If we go to the HTTP History in Burp Suite, we can see a GET request to the supposed avatar image (this request was produced when we accessed our profile and the avatar tried to load). If we take this request and look at its response, we can see the content of Carlos's `secret` file.
6. We submit the solution and we will have solved the lab.
