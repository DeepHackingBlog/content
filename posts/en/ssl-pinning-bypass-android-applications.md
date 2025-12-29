---
id: "evasion-ssl-pinning-android"
title: "SSL Pinning Bypass in Android Applications"
author: "pablo-castillo"
publishedDate: 2023-09-20
updatedDate: 2023-09-20
image: "https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-0.webp"
description: "Learn how to perform dynamic analysis of Android applications by bypassing SSL Pinning using Frida and Objection to intercept network traffic."
categories:
  - "mobile-pentesting"
draft: false
featured: false
lang: "en"
---

The objective of this post is to begin taking our first steps in the dynamic analysis of Android applications. To do this, we will explain what this analysis consists of, what SSL pinning is, and why it is so important to perform its bypass. Additionally, we will explain the tools used to carry out these tasks.

## What is dynamic analysis?

Dynamic analysis of a mobile application consists of studying the behavior of that application when it is running. This type of analysis is performed to complement static analysis (which we will discuss in upcoming articles) and observe the behavior and functionality of the code, in addition to analyzing the existing traffic between the application and the server.

The problem with performing this type of analysis lies in the security measures that are usually implemented in most applications. Specifically, we are talking about SSL pinning.

## What is SSL Pinning?

When a mobile application wants to communicate securely with the server, SSL pinning is implemented as a security measure to prevent man-in-the-middle attacks, which means that the server does not trust the certificates of the device where the application runs but only those certificates that are fixed in the application's code.

Years ago, the way certificates were validated in Android was not secure enough because any attacker could install their own CA certificate on their device and intercept communications between server and client. Currently, this system is no longer valid, as the application will compare the device's CA certificates with those on its preconfigured list and will only accept those that are trusted.

This means that if we want to intercept the traffic of an application with SSL pinning implemented and we use a proxy (like Burp Suite) that has its own certificate, it will cause the communications between both to stop and the application to stop working.

This is when the tools that will make the application trust that intermediate certificate and allow us to intercept the communications to carry out the dynamic analysis come into play.

![Diagram of the SSL Pinning process and its bypass](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-1.avif)

## Frida and Objection

As described on its website, Frida is a _"dynamic instrumentation toolkit for developers, reverse engineers, and security researchers"_. In other words, Frida allows the injection of scripts into running processes (such as mobile applications) in addition to their exploration, enumeration, and alteration. In this way, Frida will inject the necessary code to allow communications between an application and the server using a proxy.

On the other hand, Objection is a tool based on Frida that has its own scripts and functions that allow altering the behavior of an application in a simpler way (although it will not always work).

Their main websites are:
- [Official Frida Website - Dynamic Instrumentation Toolkit](https://frida.re/)
- [Objection Repository on GitHub](https://github.com/sensepost/objection)

## Installing Frida and Objection

To install these tools, it is necessary to have Python installed on your PC. My advice is not to install any of the latest versions, as they can sometimes cause conflicts. You can download it through the following link:
- [Download Python for Windows](https://www.python.org/downloads/windows/)

Once this is done, we only need to execute the following commands to perform the installation (it is important to execute them in that order):
- python -m pip install frida
- python -m pip install frida-tools
- python -m pip install objection

The process is quick and simple, but if you have any questions or problems, you can always consult Frida's website, which has a lot of information and is very well documented:
- [Official Frida Installation Documentation](https://frida.re/docs/installation/)

In addition to these tools, we will need to download a file called _frida-server_ to place it on the mobile device and run it, thanks to which we can inject the script. We must always make sure that the installed version of Frida and the frida-server are the same. To find out the installed version of Frida, you can execute the following command:

```bash
frida --version
```

In addition to this, it is also important to know the architecture of your Android device. You can see it in your Android device panel:

![Android device panel showing the system architecture](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-2.avif)

For example, for my device I will have to download the file _frida-server-16.1.4-android-x86.xz_ through the following link:
- [Official Frida Server Downloads on GitHub](https://github.com/frida/frida/releases/)

![Frida releases page on GitHub](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-3.avif)

Once this is done, we have everything we need to start with the next step.

## SSL Pinning Bypass Process

There are many applications with a wide variety of vulnerabilities made exclusively for testing and practicing with them. Here you can find some of them:
- [OWASP MASTG - Reference Applications for Testing](https://mas.owasp.org/MASTG/Tools/0x08b-Reference-Apps/)
- [10 Vulnerable Android Applications for Beginners Learning Hacking](https://www.linkedin.com/pulse/10-vulnerable-android-applications-beginners-learn-hacking-anugrah-sr/)
- [List of Intentionally Vulnerable Android Applications](https://pentester.land/blog/list-of-intentionally-vulnerable-android-apps/)
- [UnSAFE Bank - Vulnerable App for Pentesting](https://github.com/lucideus-repo/UnSAFE_Bank)

For our case, the application we are going to use is called _SSL-Pinning-demo_:
- [Download SSL Pinning Demo v1.3.1 on GitHub](https://github.com/httptoolkit/android-ssl-pinning-demo/releases/tag/v1.3.1)

Once the application is downloaded, we are going to install it on the Android device. To do this, we can do it in two ways: the first is by dragging the application directly onto the emulator, and the second is by using the following command (from the folder where the application is located):

```bash
adb install pinning-demo.apk
```

![Terminal showing the application installation via adb](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-4.avif)

Once the application is installed on the device, we are going to do a test: we are going to try to intercept the application's traffic using _Burp Suite_. As you may recall, in the previous article we saw how to tunnel the traffic from our emulator through a proxy. [Complete guide on Android traffic tunneling and interception](https://blog.deephacking.tech/en/posts/how-to-tunnel-and-intercept-android-device-traffic/). In the following image you can see how when clicking one of the buttons to intercept the request, we see that _Burp Suite_ does not intercept anything, it turns red, and the application also shows an error message related to SSL and the certificate:

![Application showing SSL Pinning error when trying to intercept with Burp Suite](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-5.avif)

On other occasions, in real applications from the stores, what usually happens is that the application freezes when starting or shows a message that it is not connected to the Internet. These types of errors are what make us see that they have the SSL pinning security measure.

To perform the bypass, we will have to start by introducing two files into the Android device: the _Burp Suite_ certificate that we previously downloaded to intercept traffic and the Frida server that we mentioned above. Remember that to download the certificate we will follow these steps:
- _Proxy → Proxy Settings → Import/Export CA Certificate → Certificate in DER format_

The Frida server is a file with a _.xz_ extension that is decompressed like any other with a _zip_ or _rar_ extension. When decompressing it, we will modify the name so that it only remains as _frida-server_. For convenience, I recommend that you always have this type of files in the same folder (in my case in _platform-tools_):

![Platform-tools folder showing the necessary files](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-6.avif)

Now we will introduce these two files into the _/data/local/tmp_ folder of the device and give the necessary permissions to _frida-server_ using the following commands:

```bash
adb push cacert.der /data/local/tmp/cert-der.crt
adb push frida-server /data/local/tmp
adb shell chmod 777 /data/local/tmp/frida-server
```

![Terminal executing adb commands to upload files to the device](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-7.avif)

Once this is done, we start the Frida server so that the script injection can be performed as follows:

```bash
adb shell /data/local/tmp/frida-server &
```

![Terminal showing frida-server running in the background](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-8.avif)

In another tab of our _cmd_, we will execute a Frida command that shows us all the running applications on the mobile device. It is important that the application is running, otherwise it will not locate it. The command is as follows:

```bash
frida-ps -U
```

![List of running processes on the Android device with frida-ps](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-9.avif)

If you notice, we find two columns: in one we see the PID of the application, referenced with a number, and in the other the name. These are two valid ways to recognize the process we are looking for. To perform this last step, we find two equally valid ways to proceed that do the same thing in different ways.

## Method 1: Using Objection

As we mentioned earlier, it is a tool based on Frida that will use different predefined scripts and functions. It should be mentioned that it is not only used to bypass SSL pinning, it also performs many other tasks. However, it should be noted again that they do not always work. It is the one I always use as the first option (for convenience). Knowing the name of our application, we will execute the following command:

```bash
objection -g "SSL Pinning Demo" explore
```

The name must always be entered in quotes and copied exactly as it appeared in the process list to avoid errors. Once this is done, Objection will 'hook' into the application and a kind of shell will appear. In it, we will write the following command:

```bash
android sslpinning disable
```

![Terminal showing Objection disabling SSL Pinning](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-10.avif)

Once this is done, we minimize the console and return to _Burp Suite_. We click on the previous button again and this time we have successfully intercepted the request to the server with the application's host as you can see. Additionally, the application's button has turned green instead of red when we let it through:

![Burp Suite successfully intercepting the request after bypassing SSL Pinning](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-11.avif)

![Application showing green button indicating successful connection](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-12.avif)

## Method 2: Using Frida Scripts

To perform the bypass with this method, first we will have to visit the Frida website where the different scripts created by the community for multiple purposes are hosted:
- [Frida Codeshare - Community Scripts Repository](https://codeshare.frida.re/)

In our case, we will look for a script that serves to bypass SSL pinning. It will happen, as with Objection, that some will not work for us. For example, for this case the second script I tried worked, which was the following:
- [Frida Multiple Unpinning Script by akabe1](https://codeshare.frida.re/@akabe1/frida-multiple-unpinning/)

The reality is that when you have a series of different scripts stored to use, this method is as simple as the previous one. We copy the code and save it in a document with a _.js_ (javascript) extension and save it in the folder where we store everything related to Frida. Next, when executing the following command, we can do it using the application name or the PID process number. My advice is that if the application has a single-word name, use the name, if on the contrary (as is this case) it has several words or has some strange character, use the PID. The commands are these:

```bash
frida -U -f <app-name> -l script.js
frida -U -p <PID> -l script.js
```

In my specific case, since the application has a long name, I will use the PID as follows:

```bash
frida -U -p 11953 -l fridascript2.js
```

![Terminal showing Frida script execution to bypass SSL Pinning](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-13.avif)

The result is exactly the same as shown in the first method, so you can choose the one you like best.

In addition to these bypass methods, there is another more complex one that consists of injecting the code into the application itself, but to see it we first need to talk about static analysis in the upcoming posts related to Android.

I hope you find this very helpful, see you soon with more.

Cheers!

## References
- [Hail Frida!! The Universal SSL Pinning Bypass for Android - InfoSec Writeups](https://infosecwriteups.com/hail-frida-the-universal-ssl-pinning-bypass-for-android-e9e1d733d29)
- [Mobile Application Security Resources - 0xche.org](https://0xche.org/recursos/seguridad-apps-moviles/)
