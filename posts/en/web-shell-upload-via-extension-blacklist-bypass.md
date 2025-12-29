---
id: "web-shell-upload-via-extension-blacklist-bypass"
title: "Web shell upload via extension blacklist bypass – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-16
updatedDate: 2022-02-16
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-0.webp"
description: "Learn to bypass file extension blacklists using alternative PHP extensions and Apache configurations to execute malicious code."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we're going to solve the PortSwigger lab: "Web shell upload via extension blacklist bypass".

![PortSwigger lab start page](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-1.avif)

To solve the lab, we need to upload a PHP file that reads and displays the contents of the `/home/carlos/secret` file. Since to demonstrate that we've completed the lab, we must enter the contents of this file.

Additionally, the server is configured to reject certain extensions.

In this case, the lab itself provides us with an account to log in, so let's do it:

![Login form](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-2.avif)

![Provided access credentials](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-3.avif)

Once we've logged in, we find ourselves on the account profile:

![User profile](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-4.avif)

As we can see, we have an option to upload a file, and specifically it appears to be to update the profile avatar. Let's try to take advantage of this option to upload the following PHP file:

![PHP code to read the secret file](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-5.avif)

First of all, let's prepare Burp Suite to intercept the request:

![Proxy configuration in browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-6.avif)

![Activating interception in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-7.avif)

Once we have Burp Suite ready along with the proxy, we select the file and click "Upload":

![File selection for upload](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-8.avif)

![File upload confirmation](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-9.avif)

![Processing file upload](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-10.avif)

Here Burp Suite will intercept the file upload request:

![Intercepted request in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-11.avif)

To better handle the request and be able to analyze the server's response more effectively, we're going to send the request to the repeater with Ctrl R.

Once sent, we click "Send" to see the server's response to the default request:

![Server response indicating PHP files are not allowed](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-12.avif)

It tells us that PHP files are not allowed. So the idea is going to be to try alternatives to the PHP extension to see if they aren't defined in the blacklist. On Wikipedia, we can see the types of extensions associated with PHP:

![PHP file extensions on Wikipedia](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-13.avif)

Having said that, we send the request from the repeater to the intruder by pressing Ctrl I. Once we have the request in the intruder, we'll click the clear button to remove the substitution positions that are set by default:

![Request in Intruder with default positions](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-14.avif)

Since what we're interested in is launching several requests where the only difference between each one is the extension, we'll declare a substitution field in the file name extension:

![Substitution field defined in the extension](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-15.avif)

With this done, we'll go to the "Payloads" tab:

![Payloads tab in Intruder](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-16.avif)

Once here, we'll define our dictionary, that is, the dictionary that will be used to substitute the default extension with those defined in the dictionary:

![Adding extensions to the dictionary](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-17.avif)

![Completed extensions dictionary](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-18.avif)

Once we have the dictionary of extensions to test ready, we'll go to the "Options" tab and the "Grep - Extract" section:

![Options tab Grep - Extract section](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-19.avif)

Once here, we'll set the string we want it to filter by in the different responses, so that when it doesn't have the indicated string, we can quickly detect the response where it's not present:

![Grep - Extract configuration to filter responses](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-20.avif)

Once done, we'll go back to the "Payloads" tab to start the attack:

![Starting the attack from Payloads](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-21.avif)

![Start attack button in Intruder](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-22.avif)

A new window will open regarding the attack:

![Attack results showing responses](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-23.avif)

In this case, as we can see, it seems that the only extension the server doesn't allow is PHP. So presumably all the others have been uploaded. Let's view the response to the last request in the browser, to do this we do the following:

![Show response in browser option](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-24.avif)

![URL to show response in browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-25.avif)

![Pasting the URL in the browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-26.avif)

![Server response confirming successful upload](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-27.avif)

Once we have the response, we can disable Burp Suite because we won't use it anymore:

![Disabling the proxy](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-28.avif)

With this done, we return to our profile:

![Accessing user profile](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-29.avif)

Now, if we look at the profile, we can see how the avatar has changed, and now shows an error that the image doesn't load properly:

![Avatar with loading error](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-30.avif)

By right-clicking, we can go to the direct path of the image to see if it's our PHP file:

![Context menu to open image](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-31.avif)

![PHP5 file not interpreting correctly](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-32.avif)

Watch out, the file seems to exist because it doesn't give us a 404 error, however, it's not fully interpreted since it hasn't read the file we indicated it should read. No problem, before panicking let's try with the other files with another extension we uploaded, for example, `phtml`:

![Successful execution of phtml file](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-33.avif)

This one does interpret it for us, and in this way we manage to read the secret file.

Having read it, we simply submit the solution:

![Form to submit the solution](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-34.avif)

![Submitted solution confirmation](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-35.avif)

And in this way, we complete the lab:

![Lab completed successfully](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-36.avif)

![Final confirmation message](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-37.avif)

Although we've solved it this way, PortSwigger's solution seems really cool and important to comment on:

1. We log in and upload an image of our avatar, with this done, we return to our profile page.
2. In Burp Suite, we go to `Proxy > HTTP History`. Here we'll be able to see a GET request to the `/files/avatars/<file>` path. We send this response to the repeater.
3. On our system, we create a file called `exploit.php` that contains code to read the contents of Carlos's secret file. For example: `<?php echo file_get_contents('/home/carlos/secret'); ?>`
4. We try to upload this file as our avatar. The server's response will indicate that PHP extension files are not allowed.
5. In the HTTP History, we'll now look for the POST request where we tried to upload the PHP file. In the server's response to this request, we'll be able to realize that we're dealing with an Apache server. Having said that, we send this request to the repeater.
6. In the POST request that we now have in the repeater, we're going to make the following changes:
    1. We change the file name to `.htaccess`.
    2. We change the `Content-Type` value to `text/plain`
    3. We replace the file content (the PHP code) with the following Apache directive: `AddType application/x-httpd-php .l33t` This directive will add a new extension to the server, additionally, indicating that the MIME type is `application/x-httpd-php`, which means it will behave like a PHP file. Since the server uses `mod_php` (PHP module for Apache), it will know and understand what we're telling it.
7. We send the request, and we'll see that the server will indicate in the response that the file has been uploaded successfully.
8. Now we return to the original PHP file request, and the only thing we'll change is the name. We'll change `exploit.php` to, for example, `exploit.l33t`. With this, we send the request and we'll see it has been uploaded successfully.
9. Now, returning to the GET request of `/files/avatars/<file>` where file will be `exploit.l33t`, when we make it, the response will return Carlos's secret.
10. We submit the solution and lab completed.
