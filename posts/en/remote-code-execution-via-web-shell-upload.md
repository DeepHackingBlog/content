---
id: "remote-code-execution-via-web-shell-upload"
title: "Remote Code Execution via Web Shell Upload - PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-09
updatedDate: 2022-02-09
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-0.webp"
description: "Learn to exploit file upload vulnerabilities to achieve remote code execution by uploading a PHP web shell."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we'll be solving the PortSwigger lab: "Remote Code Execution via Web Shell Upload".

![PortSwigger lab home page](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-1.avif)

To solve the lab, we need to upload a PHP file that reads and displays the contents of the `/home/carlos/secret` file. Since to demonstrate that we've completed the lab, we must submit the contents of this file.

In this case, the lab itself provides us with an account to log in, so let's do that:

![Login form](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-2.avif)

![Provided access credentials](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-3.avif)

Once we've logged in, we're presented with the account profile:

![User profile](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-4.avif)

As we can see, we have an option to upload a file, specifically it appears to be for updating the profile avatar. Let's try to take advantage of this option to upload the following PHP file:

<figure>

![PHP code to read the secret file](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-5.avif)

<figcaption>

This code simply reads the `/home/carlos/secret` file using the `cat` command.

</figcaption>

</figure>

![File selection for upload](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-6.avif)

![Confirmation of selected file](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-7.avif)

Once selected, we click `Upload`, and we'll be redirected to a page that tells us the file has been successfully uploaded:

<figure>

![Success message when uploading the file](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-8.avif)

<figcaption>

In this case there is no sanitization whatsoever

</figcaption>

</figure>

So now, if we look at the profile, we can see that the avatar has changed and is now showing an error that the image isn't loading properly.

![Avatar with loading error](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-9.avif)

By right-clicking on it, we can go directly to the image path to see if it's our PHP file:

![Context menu to open image](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-10.avif)

![Successful PHP file execution](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-11.avif)

Indeed, the PHP file we uploaded has been stored as the avatar file, that's why it wasn't loading on the profile, it was trying to load an image when it wasn't one. By visiting the PHP file, the code we placed has been interpreted, and we successfully read the secret file.

Having read this file, we simply submit the answer:

![Form to submit the solution](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-12.avif)

![Submitted solution confirmation](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-13.avif)

And this way, we complete the lab:

![Lab completed successfully](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-14.avif)

![Final confirmation message](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-15.avif)
