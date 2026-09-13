---
id: "introduccion-al-analisis-estatico-en-aplicaciones-android"
title: "Introduction to Static Analysis in Android Applications"
author: "pablo-castillo"
publishedDate: 2026-09-13
updatedDate: 2026-09-13
image: "https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-0.webp"
description: "First steps in the static analysis of Android applications: what it is, how an APK is put together and the essential tools to analyze it."
categories:
  - "mobile-pentesting"
draft: false
featured: false
lang: "en"
---

## Introduction

Hello again! How are you all doing? It's been a long time! We're back with this post to take our first steps in the static analysis of Android applications. If you remember, in the article about SSL Pinning bypass we already mentioned that dynamic and static analysis are two sides of the same coin and that they complement each other. Well, the time has come to talk about that second part. In this article we are going to explain what this type of analysis consists of, why it is so important and what things we need to keep in mind before getting down to work. To do so, we are going to look at the essential tools we will use to carry it out.

- [What Is Static Analysis of an Application](#what-is-static-analysis-of-an-application)
- [What an APK File Is and What It Contains](#what-an-apk-file-is-and-what-it-contains)
- [About Obfuscation and Decompilation](#about-obfuscation-and-decompilation)
- [Working Environment for Static Analysis](#working-environment-for-static-analysis)
- [Main Tools in Static Analysis](#main-tools-in-static-analysis)
- [Conclusion](#conclusion)
- [References](#references)

## What Is Static Analysis of an Application

Static analysis of a mobile application consists of studying that application **without needing to run it** (hence the name, of course). Unlike dynamic analysis, where we observed the behavior of the application at runtime, here what we do is "dissect" the application file to inspect its interior: its code, its resources, its permissions, its configuration files and everything that makes it up and that cannot be seen.

And why is it so important to carry out this type of analysis? Well, it is common for developers to leave (many times without realizing it) sensitive information inside the application's own code. We are talking about API keys, tokens, *hardcoded* credentials, internal URLs and *endpoints*, server paths, and a long etcetera. Static analysis allows us to locate all of this, and it also helps us understand the logic of the application, map its attack surface, review the permissions it requests and detect insecure configurations. In short, it gives us a complete picture of how the application is built before we even launch it.

> It is important to mention that, although it is possible to find vulnerabilities just by reading the application's code, the ideal approach is always to study how it works and understand how all the operations are executed behind the scenes. This makes it possible to exploit some vulnerable or misconfigured classes or functions using tools such as *Frida*, where we can *hook* them to modify their behavior (as we do with the *SSL Pinning* bypass, for example).

Before we start playing around with the tools, there are a few things that are worth having clear.

## What an APK File Is and What It Contains

An *APK* (*Android Package*) is nothing more than a compressed file (a good old *zip*) that contains all the elements needed for the application to work. If we unzip it (we will see how later), we will mainly find the following:

- **AndroidManifest.xml:** the most important file for us. This is where the permissions requested by the application are declared, along with its components (*activities*, *services*, *receivers*, *providers*), which of them are exported and the general configuration of the app.
- **classes.dex:** contains the application code compiled into Dalvik *bytecode*. There can be one or several (`classes2.dex`, `classes3.dex`…). This is the file that the tools are going to "decompile" to show us the code.
- **resources.arsc:** stores the application's compiled resources (texts, styles, etc.).
- **res/** and **assets/:** folders where the resources and images are stored, as well as other files that the developer wanted to package (juicy surprises sometimes show up here).
- **lib/:** contains the native libraries (`.so` files) organized by architecture.
- **META-INF/:** holds the information related to the application's signature.

## About Obfuscation and Decompilation

Another thing to keep in mind is **obfuscation**. Many applications (especially the ones we find in the official *stores*) use tools such as *ProGuard* or *R8* to make their code harder to read, renaming classes, methods and variables with meaningless names (for example, `a.b.c` or similar). This does not prevent the analysis, but it does make it slower and more tedious, so do not panic if you decompile an application and come across this scenario.

We also have to mention that decompilation is **not always perfect**. When rebuilding the code from the *bytecode*, the tools sometimes fail or do not manage to reconstruct certain parts 100%. That is completely normal and part of the process.

## Working Environment for Static Analysis

As I have mentioned before, I almost always work in a *Windows* environment. Both for working with emulated devices (although I always use a physical phone) and for intercepting traffic with *Burp Suite*, it is the most convenient, efficient and fastest option (assuming this is the main operating system on your PC). The same happens with some of the tools used in static analysis, especially those that have a graphical interface, as we will see below. Even so, there are some tools I prefer to use on Linux, so if you want to use them all in that environment, just know that the result is going to be exactly the same and it is an equally valid decision.

That said, you are going to need Java installed on any system in order to use most static analysis tools. So here is a quick guide on how to do it for both cases:

- **Windows:**
    - Download and install the file with the `.msi` extension (I recommend versions 17 or 21) from the [Eclipse Temurin releases on Adoptium](https://adoptium.net/temurin/releases?version=21&os=any&arch=any).
    - Make sure to include it in the Windows PATH.
- **Linux:**
    ```bash
    sudo apt update
    sudo apt install openjdk-21-jdk openjdk-21-jre -y
    ```

## Main Tools in Static Analysis

We have to start by mentioning that there is an endless number of tools that help you analyze and work on an application's code. Over time, each person builds their own arsenal with the ones they like most or that best suit their way of working. But here I am going to show you the ones I consider absolutely essential and that will be with you in practically all of your audits. So as not to make the article too long, we are going to talk about them briefly, since in upcoming articles we will look at more advanced uses of these and some others.

### Apktool

*Apktool* is a reverse engineering tool used to decode resources back to a nearly original form and to rebuild them after making some modifications; it also allows you to debug *smali* code step by step. Below you have the links to download it and its installation guide:

- [Official Apktool repository on GitHub](https://github.com/iBotPeaches/Apktool)
- [Official Apktool website](https://apktool.org/)
- [Apktool installation guide](https://apktool.org/docs/install/)

What *Apktool* does is break down the *APK* file, leaving us the `AndroidManifest.xml` in a completely readable format, extracting the resources and *assets*, and converting the `.dex` code into *smali* (a sort of "assembler" of the Dalvik *bytecode*). It is important to understand that *Apktool* is not going to give us back Java code, but *smali* code, which is quite a bit harder to read. For this reason, to review the code itself we usually rely on other tools (which we will see below), and we reserve *Apktool* mainly for analyzing the resources contained inside the application.

Its most basic use consists of running the following command to decompile the application:

```bash
apktool d application.apk
```

As mentioned above, this tool allows you to rebuild the application, packaging it back into its `.apk` format. This opens the door to more advanced reverse engineering techniques such as injecting code directly into the application's own files, but that is something we will leave for another time.

![Running the apktool d command to decompile an Android application](https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-1.avif)

![Folder and file structure generated by Apktool after decompiling the APK](https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-2.avif)

### Jadx

*Jadx* is, without a doubt, the tool you are going to use the most to read an application's code. Unlike *Apktool*, *Jadx* decompiles the `.dex` code directly into **Java**, which is a much more convenient and readable language for us. Even though it has a command line version, I strongly recommend using the version with a graphical interface (*Jadx-gui*), at least until you have enough experience. You can find it in the [official Jadx repository on GitHub](https://github.com/skylot/jadx).

If we download the graphical interface version and run it, we will see a window like this one:

![Main Jadx-gui window just opened, with no application loaded](https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-3.avif)

Here we can open the file with the `.apk` extension or simply drag the application onto the window to open it, and we will be able to inspect the code:

![Class and package tree of an APK loaded in Jadx-gui](https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-4.avif)

If we select a file, a tab will open where we can view and analyze it:

![Decompiled Java code of a class shown in a Jadx-gui tab](https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-5.avif)

The great feature of this tool is its **search engine**. We can search for text strings throughout the whole code, which is pure gold for static analysis. Terms such as `http`, `password`, `token`, `api_key` or `secret` are usually a good starting point for quickly finding sensitive information:

![Jadx-gui text search showing matches inside the application's code](https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-6.avif)

### MobSF

*MobSF* (*Mobile Security Framework*) is probably the best known mobile application auditing tool in the industry. Although it can also perform dynamic analysis, its main use is the automatic scanning of the application's code, providing an overview of its configuration and the state it is in.

The way it works is simple: it starts a local server with a web interface where we provide the `.apk` file (similar to what *Jadx-gui* does). The tool will analyze it and automatically generate a complete report, which it will also store so it can be reviewed later without repeating the analysis. You can download it and check its documentation through the following links:

- [Official MobSF repository on GitHub](https://github.com/MobSF/Mobile-Security-Framework-MobSF)
- [Official MobSF documentation](https://mobsf.github.io/docs/#/)

To install it, first we will have to run the `setup.*` file and, once it has finished, launch the `run.*` file to start the web server, which will be accessible at the address `http://localhost:8000`.

![Console showing the MobSF web server starting up on port 8000](https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-7.avif)

The default username and password are `mobsf` in both cases:

![Login screen of the MobSF web interface](https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-8.avif)

Once here, we will provide the application we want to analyze, selecting it through the upload button or dragging it onto the screen. After a short wait, the analysis will have been completed successfully:

![Static analysis report generated by MobSF for an Android application](https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-9.avif)

On the left side of the screen we can see a menu from which we can quickly jump to the part of the analysis we are most interested in. The most important points that need to be reviewed are the following:

- Permissions
- Browsable Activities
- Security Analysis
- Reconnaissance

> *MobSF* is a very useful tool because it lets us see, in an instant, the main vulnerabilities present in the application along with its key configurations, but you also have to know why this analysis is insufficient: **it sometimes generates false positives, it does not understand the application's business logic and it is not entirely accurate when working with obfuscated code.** For these reasons, you always have to complement the analysis of the application's code manually with tools such as *Jadx* (*MobSF* is terrible for reading code) and understand how the application works and what its logic is in order to figure out which vulnerabilities are real regardless of what *MobSF* reports.

### Other Tools

I have been going back and forth thinking about which other tools I could cover in this article. Some of them are too advanced for a first approach to static analysis, and others do not add any real value, so I am going to mention three tools that you can try out and see whether you really think they are worth it.

The first two are related, since both serve the same purpose: taking a first look at the application without having to decompile it and review it by hand, scanning the *APK* for *endpoints*, URLs and secrets (such as API keys or tokens) through the use of regular expressions, and they serve as a starting point to guide the rest of the analysis. These tools are *Apkleaks* and *Apkscan*:

- [Apkleaks repository on GitHub](https://github.com/dwisiswant0/apkleaks)
- [Apkscan repository on GitHub](https://github.com/LucasFaudman/apkscan)

The third one is *APKDeepLens*, a tool that is like a lightweight version of *MobSF*, since it does a quick sweep of the OWASP Top 10 and shows a report with the vulnerabilities it found:

- [APKDeepLens repository on GitHub](https://github.com/d78ui98/APKDeepLens)

## Conclusion

With this we now have a solid foundation to start performing static analysis on Android applications. We have seen what it consists of, why it is a fundamental part of any mobile audit and we have prepared our arsenal of essential tools, with a special mention for *Jadx*. It is fundamental that you learn it and get familiar with it, since it is the most important tool for getting to know the inner workings of applications.

Static and dynamic analysis complement each other perfectly, and mastering both is what will allow us to carry out complete, quality audits. In upcoming articles we will keep going deeper into the use of these tools and we will start analyzing applications to keep learning.

I hope this has been helpful for taking your first steps in this type of analysis.

Thanks for being on the other side. Cheers! 🙂

## References

- [Official Apktool website](https://apktool.org/)
- [Official Jadx repository on GitHub](https://github.com/skylot/jadx)
- [Official MobSF repository on GitHub](https://github.com/MobSF/Mobile-Security-Framework-MobSF)
- [Apkleaks repository on GitHub](https://github.com/dwisiswant0/apkleaks)
- [Apkscan repository on GitHub](https://github.com/LucasFaudman/apkscan)
- [Application fundamentals (official Android documentation)](https://developer.android.com/guide/components/fundamentals)
