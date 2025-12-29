---
id: "magisk-en-dispositivos-emulados-con-android-studio"
title: "How to Install Magisk on Emulated Devices with Android Studio"
author: "pablo-castillo"
publishedDate: 2024-12-17
updatedDate: 2024-12-17
image: "https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-0.webp"
description: "Learn how to install Magisk on Android Studio emulated devices to create a complete mobile pentesting environment with root access, Burp Suite certificates, and Frida through Magisk modules."
categories:
  - "mobile-pentesting"
draft: false
featured: false
lang: "en"
---

In the first post about mobile audits, we explained the creation and configuration of a pentesting testing environment using Android Studio software. While it's true that it's possible to create emulated devices that are already rooted, as those of you who have worked with them know, they often present a series of problems or inconveniences that can complicate the device configuration and working with it.

If you've taken a look at my latest post about [configuring physical devices using Magisk](https://blog.deephacking.tech/en/posts/physical-device-configuration-android-pentesting/), you'll have seen how comfortable and manageable it is to have our Android set up with that structure for work. Therefore, on this occasion, we're going to merge both parts to obtain an Android emulator for conducting pentesting tests with the convenience that Magisk provides us.

- [About Android Studio](#about-android-studio)
- [Creation and Configuration of the Emulated Device](#creation-and-configuration-of-the-emulated-device)
- [Before Starting: Adding adb Tool to Path](#before-starting-adding-adb-tool-to-path)
- [Tool for Installing Magisk: rootAVD](#tool-for-installing-magisk-rootavd)
- [Installing Burp Suite Certificate Through Magisk](#installing-burp-suite-certificate-through-magisk)
- [Frida Through Magisk](#frida-through-magisk)
- [Conclusion](#conclusion)
- [References](#references)

## About Android Studio

I imagine if you're here, it's because you already have Android Studio software installed and configured on your computer, but if not, [you can find the complete explanation here](https://blog.deephacking.tech/en/posts/creating-android-work-environment/). If you already have it installed, I'm going to recommend that you update it to the latest version as follows:

- Open Android Studio → Settings wheel in the lower left corner → _Check for updates_

![Android Studio Configuration Menu](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-1.avif)

We'll need to know the path where we have _Android SDK_ (software development kit) installed, a set of tools used by the program. To do this:

- Android Studio → More actions → SDK Manager → Android SDK Location

![More Actions Menu in Android Studio](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-2.avif)

![Android SDK Location](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-3.avif)

ATTENTION!! In case you haven't installed Android Studio yet, there will be a moment when it asks us in what path we want to install _Android SDK_. By default, the path is _C:\\Users\\<YOUR USER>\\AppData\\Local\\Android\\Sdk_. Unless you have an exceptional need to install it in another path, keep the default one, as we'll use a tool later that searches by default in that defined path.

## Creation and Configuration of the Emulated Device

Well, if you've clicked on the link I put above talking about creating the environment in Android Studio, you'll have remembered the procedure for creating an emulated device (if you haven't done it, [check out our guide on creating an Android pentesting work environment](https://blog.deephacking.tech/en/posts/creating-android-work-environment/)). Making a brief summary, the steps to follow are:

- _Android Studio → More actions → Virtual Device Manager → Create Device_

For this post, I've chosen a Pixel 7 device with Android version 11.0 (API 30) **that contains Google Play.** I remind you that with this configuration, the environment will be similar to a production one, so the device by default is not rooted (which makes sense if what we want is to use _Magisk_ to achieve that root):

![Virtual Device Hardware Selection](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-4.avif)

![Android System Image Selection](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-5.avif)

As a personal recommendation, never use the latest Android versions for your emulators as some tools or applications may give errors or simply not work due to the short adaptation period they may have had.

On this occasion, we're also going to install the _Root Checker_ application to verify and validate that currently the device is not rooted but will be later:

- [Root Checker - APKPURE](https://apkpure.com/es/root-checker/com.joeykrim.rootcheck)

We install the application by dragging it onto the emulator or by executing the command _adb install <Application Name>:_

<div class="grid grid-cols-2 gap-4">
<div>

![Root Checker Installation via adb](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-6.avif)

</div>
<div>

![Root Checker Indicates No Root Access](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-7.avif)

</div>
</div>

If we remember, to be able to install _Magisk_ on our physical device and become superuser, we had to enable developer options to unlock USB debugging as well as unlock the OEM. Can we replicate the procedure used in that scenario for an emulated device? Let's check it out and find out.

- _Settings → About emulated device →_ Tap 7 times on _Build number_

![Developer Mode Activation](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-8.avif)

- _Settings → System → Developer options_

![Developer Options Menu](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-9.avif)

In case anyone was wondering, indeed USB debugging on emulated devices is enabled by default, and that's why tools like _adb_ can be used from the device's creation without having to enable these options:

![USB Debugging Enabled by Default](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-10.avif)

However, no matter how much we search for the option to disable OEM unlocking, I'll tell you right now that you won't find it. On emulated devices, this option doesn't exist and it makes perfect sense: that option allows, among other things, the modification of the Android operating system, but in Android Studio if you don't like the device you've emulated, you create another one. There's no _Recovery_ mode, so there's no _bootloader_ to unlock. In fact, you can check for yourselves that if you execute the command _adb reboot bootloader_ nothing happens.

But don't worry, we have a much faster and simpler way to root the device with Magisk than the one used on physical phones.

## Before Starting: Adding adb Tool to Path

You may already have it correctly configured, but just in case, we're going to explain how to add the _adb_ tool to the Windows path so you can execute it from any directory, which will be necessary for performing the procedure without setbacks.

To do this, we'll do the following:

- System → Advanced system settings → Environment variables

![Advanced System Settings in Windows](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-11.avif)

- System variables → Path → Edit

![Environment Variables Editing](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-12.avif)

- New → Add the path to the folder where we have _adb_ (_platform-tools_)

![Adding platform-tools Path to PATH](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-13.avif)

**REMEMBER:** When downloading Android Studio and installing the _SDK Tools_, the _platform-tools_ folder with _adb_ is by default in the directory:

- _C:\\Users\\<Your User>\\AppData\\Local\\Android\\Sdk\\platform-tools_

## Tool for Installing Magisk: rootAVD

The description of the rootAVD tool literally says it's _a script to root AVDs running with the QEMU emulator from Android Studio_. Using my words, it's a tool that roots an emulated device based on QEMU (processor emulator based on dynamic binary translation) from the Android Studio software. You can find the tool on GitHub, but in that repository they say that where it's updated is on GitLab, so I'll leave you both links but use the latter:

- [rootAVD - GitHub](https://github.com/newbit1/rootAVD)
- [rootAVD - GitLab](https://gitlab.com/newbit/rootAVD)

To download it, we have two options: we can execute the _git clone_ command along with the repository link from PowerShell if we have Git installed on our computer ([Download Git for Windows](https://git-scm.com/downloads)) or if we wanted to download it on a Linux machine (although you already know that for mobile audits we work on Windows). You can also download it from the GitLab repository from the _Code_ tab in zip format as you can see below:

![Downloading rootAVD from GitLab](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-14.avif)

Once downloaded (and decompressed if necessary), we can access the tool's folder. If we look, inside it we find the _Magisk_ tool compressed in zip format ready for installation in the emulator's system, but if we pay attention to the version, we'll see that the one ready to install is v26.4. However, the latest version available in its official repository is v.28.0 (as of the writing of this post). This is due, from what I've been able to read and deduce (since they don't specify it in the repository itself), to the fact that they're incorporating versions based on patches and stability they obtain during development. Let's not forget that working in virtualized environments is not the same as doing it on physical devices. Likewise, during the installation process we'll have the option to install version v.27 (which is the latest official stable version) instead of what is considered the local stable version.

Once this is clarified, we have everything ready to execute the tool. If we review the repository, we can observe the steps to follow in the process, even several small videos of its execution on different operating systems. I'll leave you the Windows one so you have it handy:

- [rootAVD_Windows.gif](https://gitlab.com/newbit/video-files/-/blob/master/rootAVD_Windows.gif)

Before launching the tool, we're going to execute the following command from the console to configure the environment variables for its operation:

```batch
set PATH=%LOCALAPPDATA%\Android\Sdk\platform-tools;%PATH% system-images\android-$API\google_apis_playstore\x86_64\
```

Once this is done, we can now execute the tool following the following steps:

1\. From the rootAVD folder, we execute rootAVD.bat:

![Executing rootAVD.bat](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-15.avif)

2\. We list all virtual machines with the _ListAllAVDs_ parameter:

![List of Available AVDs](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-16.avif)

3\. We select the emulator we're using, which can be differentiated by the API version (30 for Android 11.0) and the image used (x86):

![Selecting the AVD to Root](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-17.avif)

4\. Now we need to be attentive because during the process there will be an interruption in which we'll have to choose the version we want to install. By default, if we don't touch anything, the version that appears downloaded in the folder will be installed, but we're interested in installing the most recent stable version, which as we said earlier is v.27.0. Therefore, we'll write a 2 and press Enter at this point:

![Selecting Magisk Version](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-18.avif)

After this, we'll let the process finish automatically, which will cause the emulated device to close automatically, so don't worry, it's normal. Once this is done, we'll start the device in _Cold Boot_ mode, which will restart our Android completely:

![Installation Process Completion](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-19.avif)

![Starting in Cold Boot Mode](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-20.avif)

Once we have the emulator operational and access the _Magisk_ application, it will ask us that it needs to make an additional configuration and reboot again:

![Additional Magisk Configuration](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-21.avif)

At this point, we have the application correctly installed and the device is rooted:

![Magisk Successfully Installed](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-22.avif)

To check it, we'll open our cmd to open a shell on the device using _adb shell_ and then execute the _su_ command. A window will appear on the device with which we'll have to grant superuser permissions to the console as shown below:

![Granting Superuser Permissions](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-23.avif)

We can check where we grant superuser permissions in the _Superuser_ tab of the _Magisk_ application:

![List of Applications with Superuser Permissions](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-24.avif)

At this point, if we run the _Root Checker_ application again, the box to grant permission to this application will appear again and it will indicate that we are root:

<div class="grid grid-cols-2 gap-4">
<div>

![Root Checker Requesting Superuser Permissions](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-25.avif)

</div>
<div>

![Root Checker Confirming Root Access](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-26.avif)

</div>
</div>

IMPORTANT: A great advantage of using _Magisk_ is that we can revoke superuser rights at any time from any application to which we've previously granted them. This would allow us to run applications that have detection of these permissions. As an example, below is shown how we can revert the root detection of the previous application:

<div class="grid grid-cols-2 gap-4">
<div>

![Revoking Superuser Permissions](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-27.avif)

</div>
<div>

![Root Checker Without Root Access](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-28.avif)

</div>
</div>

## Installing Burp Suite Certificate Through Magisk

Although we've seen this process on previous occasions, I think this post deserves to review the explanation (it's necessary that we have _Burp Suite_ installed). We open this software with the Android emulator running as we had left it previously. We configure both parts to tunnel traffic as follows:

- Burp Suite:
    - Proxy → Proxy Settings → Add → We add the IP of our Windows machine

![Proxy Configuration in Burp Suite](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-29.avif)

- Android Emulator:
    - Settings → Network & interfaces → Wifi → Network Details → Edit → Proxy → Manual → Add the same IP and port as in _Burp Suite_

![Proxy Configuration in Android](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-30.avif)

Depending on the device model you've emulated, the previous steps may vary a bit, but the essence is the same. It's important that you disable data and only have wifi working on the emulator for what we're doing to make sense.

If everything went well and the configuration is correct, you won't be able to browse the Internet from the emulator's browser:

![Connection Error After Configuring Proxy](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-31.avif)

Where we will be able to access is the [http://burpsuite](http://burpsuite/) path from where we'll download and install its CA certificate by modifying the extension under the name _cacert.cer._ It's possible that you'll have to install the certificate from _Settings_ if it doesn't let you do it automatically:

![Downloading and Installing CA Certificate](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-32.avif)

Once we have the certificate installed, we're going to download the _Magisk_ module that allows us to move the certificate we just downloaded to the system so that http traffic can be intercepted. To do this, we'll have to download it on Windows and move the file to our Android since the emulator's proxy doesn't allow us Internet traffic (or disable the proxy, download it and re-enable it, but that's more hassle).

- [burpcert-magisk-module](https://github.com/belane/burpcert-magisk-module)

Having the file on Android, we'll access the _Magisk_ application and in the _Modules_ tab we'll select the _Install from storage_ option, and we'll choose the module's zip file that will be in the _Downloads_ folder:

<div class="grid grid-cols-2 gap-4">
<div>

![Installing Module from Storage](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-33.avif)

</div>
<div>

![Selecting burpcert Module](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-34.avif)

</div>
</div>

It will ask for a device reboot after which the process will have been completed successfully. We can verify it by reviewing the system's trusted certificates:

<div class="grid grid-cols-2 gap-4">
<div>

![Accessing System Certificates](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-35.avif)

</div>
<div>

![Burp Suite Certificate in System](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-36.avif)

</div>
</div>

Now we can browse and verify that our traffic is going through _Burp Suite_:

![Traffic Interception in Burp Suite](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-37.avif)

## Frida Through Magisk

Surely after seeing the _Magisk_ module for installing the _Burp Suite_ certificate, many of you have wondered if this tool also has a module related to Frida. Indeed, it does. If you've investigated a bit about _Magisk_, you may have found several official websites where they talk about the modules you can find. Some examples are:

- [Magisk Modules - www.magiskmodule.com](https://www.magiskmodule.com/category/magisk-modules/)
- [Magisk Modules - magiskmodule.gitlab.io](https://magiskmodule.gitlab.io/)

I remind you that if you haven't installed _Frida_ yet or have any doubts about it, you can find all the necessary information in [our guide on SSL Pinning bypass in Android applications](https://blog.deephacking.tech/en/posts/ssl-pinning-bypass-android-applications/).

To verify that there are indeed some http requests that we cannot intercept due to _ssl pinning_, we're going to download and install an application designed for testing called _AndroGoat_:

- [AndroGoat.apk](https://github.com/satishpatnayak/MyTest/blob/master/AndroGoat.apk)

Once installed, we'll open it and click on the first option called _Network Intercepting_:

![AndroGoat Application](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-38.avif)

In this section, we find 3 buttons. With _Burp Suite_ open and with the proxy configuration performed previously, we're going to click on the https button to verify that it works correctly:

![HTTPS Interception Working Correctly](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-39.avif)

However, when clicking on the _Certificate Pinning_ button, nothing happens, as expected:

![Certificate Pinning Blocking Interception](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-40.avif)

Once this check is done, we're going to install the _Frida_ module that will allow us to use the tool to bypass _ssl pinning_. What this module will do is install and run the _frida-server_ inside the Android emulator. It's located at the following link:

- [magisk-frida](https://github.com/ViRb3/magisk-frida)

To guarantee its operation, we have to make sure that the version of _Frida_ installed on our computer is the same as the version of the module we're going to install on the device. Since the version we're downloading is the latest, what we'll do is update _Frida_ from the console with the following command:

```bash
pip3 install --upgrade frida
```

![Updating Frida](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-41.avif)

In case you get any error, update the _frida-tools_ using _pip install frida-tools_ or by selecting the versions you want to install manually as follows:

```bash
pip install frida==16.5.9 frida-tools==13.6.0
```

Once we have everything in sync, we proceed to install the module in the same way we did with the previous one. From the _modules_ tab of _Magisk_ we choose the zip file we've previously introduced in the device:

![Installing Frida Module](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-42.avif)

To check that everything has worked correctly, from our console we can open a terminal in the emulator with _adb shell_ and being _root_ execute the command _netstat -tupln_ where we can quickly visualize that there's a _frida-server_ process running on port 27042:

![Frida-server Running on Device](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-43.avif)

Knowing that the _frida-server_ is running, we can now execute _Frida_ to bypass _ssl pinning_. We open _AndroGoat_ again so that _Frida and Objection_ can find it and we're going to execute the following commands:

1. _**Frida-ps -Uai**_ → We list the running applications on the emulator.
2. _**Objection -g <PID> explore**_ → We execute Objection indicating the PID of the application to operate with it (you can also do it with the name but this one has many spaces and hyphens and may give an error).
3. _**Android ssl pinning disabled**_ → Command to bypass _ssl pinning_.

![Executing Objection for SSL Pinning Bypass](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-44.avif)

Now that we have everything ready, we click the _Certificate Pinning_ button of the application again and we intercept the request perfectly:

![Successful Interception After SSL Pinning Bypass](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-45.avif)

Additionally, we can corroborate this bypass from _Objection_ since the calls to the functions that have been manipulated to intercept traffic appear in the console:

![Objection Logs Showing Bypass](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-46.avif)

## Conclusion

To be honest, this new virtualized environment configuration using _Magisk_ and its modules is much more comfortable and easier to configure than the standard way we had seen previously in other posts. I highly recommend you try it, although it may seem long, it's a super fast process that doesn't give any kind of errors.

I hope you liked it and that it helps you work comfortably if you don't have a physical device. Do you like Magisk? Have you used it before? Share your experience with me!

Thanks for being on the other side! Cheers! 🙂

## References

- [Magisk Module Repository](https://www.magiskmodule.com/)
- [Official Magisk Repository on GitHub](https://github.com/topjohnwu/Magisk)
- [Frida Codeshare - Community Scripts](https://codeshare.frida.re/)
