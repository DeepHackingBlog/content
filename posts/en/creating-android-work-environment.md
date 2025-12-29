---
id: "creacion-entorno-trabajo-android"
title: "Creating a Work Environment in Android"
author: "pablo-castillo"
publishedDate: 2022-12-12
updatedDate: 2022-12-12
image: "https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-0.webp"
description: "Complete guide to creating a virtualized work environment in Android: Android Studio installation, emulator configuration, ADB usage, and essential tools for mobile audits."
categories:
- "mobile-pentesting"
draft: false
featured: false
lang: "en"
---

The objective of this post is to learn how to create a virtualized work environment that allows us to start performing audits on Android applications. We will begin by selecting our device emulator, then show the different smartphone creation options, and finish with the download of some necessary tools for our work.

- [Android Studio as the environment emulator](#android-studio-as-the-environment-emulator)
- [Installation and first steps with Android Studio](#installation-and-first-steps-with-android-studio)
- [Installation and execution of Android Debug Bridge (ADB)](#installation-and-execution-of-android-debug-bridge-adb)
- [References](#references)

## Android Studio as the environment emulator

There are many free Android emulators that we can use for our testing environment, but it's true that some of them stand out above the rest. After working with several of them, personally Android Studio is the one I like the most (basically, because it's the one that has given me the least problems when performing audits). I acknowledge that it consumes more resources than other emulators and can be slower, but it has many more utilities and is more robust. You can download Android Studio through the following link:

- [Download Official Android Studio](https://developer.android.com/studio)

Similarly, below I'll leave you the download links for other Android emulators widely used by the community so you can try them and choose the one you like best, since we don't all have the same tastes or the same criteria:

- **Genymotion:**
    - [Download Genymotion for Android](https://www.genymotion.com/download/)
- **BlueStacks:**
    - [Download BlueStacks Android Emulator](https://www.bluestacks.com/es/index.html)
- **Visual Studio:**
    - [Download Visual Studio Emulator for Android](https://visualstudio.microsoft.com/es/vs/msft-android-emulator/)

## Installation and first steps with Android Studio

For the installation of our emulator, my recommendation is that it be installed on your computer's main operating system, in my case Windows. You can also install it on a virtual machine with Kali or another distribution focused on pentesting, but the emulation of an Android device will require a lot of memory and you may have problems with the environment processing.

So, first of all, download [Android Studio](https://developer.android.com/studio), run the installer, and follow the steps that appear during the process, leaving everything as default.

Once we have it installed, we'll start it and see a window like the one shown below:

![Android Studio initial screen](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-1.avif)

We'll click on the _More Actions_ dropdown and then select the _Virtual Device Manager_ option to create our Android device:

![Virtual Device Manager option](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-2.avif)

> IMPORTANT: It's possible that this option may initially be blocked and we can't select it. In that case, what we'll do is select the _SDK Manager_ option that is just above:

![SDK Manager menu](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-3.avif)

In this menu we need to make sure of two things:

- First, that the _Android SDK Location_ path doesn't appear in red because it doesn't recognize the default predefined path, in which case we would have to choose a valid path ourselves.
- Second, that in the SDK Tools tab we have the _Android SDK Build-Tools 33_ package installed. If it's not installed, we'll click on the square that appears to the left of the name and click _OK_ so it downloads and installs automatically:

![SDK Tools with Android SDK Build-Tools](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-4.avif)

Since I'm in this menu, I'll take the opportunity to indicate that in the _SDK Platforms_ section we can download the different Android versions that we'll use on the devices we create later. They can also be downloaded from the device creation menu, so it's not necessary to come to this window for that, but it's good to know the different options available to perform the same tasks. I recommend taking a look and investigating the possible downloads:

![Available SDK Platforms](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-5.avif)

Now yes, let's proceed with the device creation in the new menu that has opened after selecting the _Virtual Device Manager_ option.

![Empty Virtual Device Manager menu](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-6.avif)

This new window is empty, so we'll click on _Create Virtual Device_ which is in the center of it or on the _Create device_ tab located in the upper left corner:

![Hardware selection for virtual device](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-7.avif)

In the new pop-up window, different Hardware creation options appear, where we can choose different electronic devices. This is mainly so that developers can run and test their applications on the different devices that are capable of opening them.

We're interested in the _Phone_ tab, from which we can select among a series of available brands and see the respective characteristics of the different phones. Based on this, we'll choose which one to emulate. It's not necessary to choose a latest model because there may be problems later when running certain Android versions, nor a very old model for the inverse reason. Personally, I usually choose among the _Nexus 5, Pixel 4_, and _Pixel 5_ models. It's important to note that in one of the columns you can see which devices include the _Play Store_ for downloading applications, a function that may be necessary for obtaining the application to audit later:

![Available phone options](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-8.avif)

When clicking on _Next_ we'll find the menu where we'll choose the Android version we're going to install on our smartphone. We find three different tabs indicating the recommended images, those that are x86, and other images. I don't recommend installing the latest version of Android, nor a version that's many years old, as both cases can generate problems when opening or running applications. I normally install those versions between 7 and 10, except for some specific cases where a specific version was necessary.

As I mentioned earlier, in this panel it will be possible to download the image we want to install by pressing the arrow that appears to the right of the version name. I've chosen an _Android 8.0 (Google APIS)_ compatible with _Google Play_ services and with an _x86\_64_ architecture compatible with both 32 or 64-bit versions:

![Android system image selection](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-9.avif)

Once selected, we'll find a final box where we can make some modifications to the configuration, but in principle the only thing we should touch is the name in case we want to identify it in some way. Once this is done, we finish:

![Final virtual device configuration](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-10.avif)

Now, in the window that we previously found empty, the device will appear with information about the Android version and the architecture used. To run the emulator, we'll click on the _Play_ arrow that appears under the _Actions_ column:

![Virtual device created in the list](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-11.avif)

![Android emulator running](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-12.avif)

Once this is done, we now have our device running and ready to install and run any Android application compatible with its version and architecture.

## Installation and execution of Android Debug Bridge (ADB)

_Android Debug Bridge_ is a command-line tool that will allow us to communicate with the mobile device and execute multiple instructions to perform different actions, such as accessing the inside of the device, copying or deleting information, installing or uninstalling applications...

When downloading Android Studio, this tool is also included within the _SDK Tools_ folder that we mentioned earlier under the name _platform-tools_. In any case, if you can't find it, you can get it at the following link for download:

- [Download Official Android SDK Platform Tools](https://developer.android.com/studio/releases/platform-tools)

Once located or obtained, we'll access that folder and open a _cmd_ and run **adb.exe** to start the tool. Once this is done, within the same console, these are some of the main commands we can use:

- **adb devices:** Lists the emulators currently in the system.
- **adb root/unroot:** Restarts the client with/without root permissions (It's important to note that for most actions it's necessary to be root).
- **adb push/pull \[path\_to\_file\]:** Sends a file from the computer to the mobile device/from the mobile device to the computer.
- **adb install/uninstall \[path\_to\_apk\]**: Installs/uninstalls an application.
- **adb shell:** Allows access to the device via console (remember that Android is a Linux system, so the commands will be the same ones we use in our Kali).
- **adb reboot**: Forces a device reboot.

![ADB commands in the console](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-13.avif)

We now have the main scenario to start performing pentesting on Android applications. Soon, we'll continue with a series of articles where we'll see how to perform a complete audit of an Android application.

## References

- [Android Debug Bridge (adb)](https://developer.android.com/studio/command-line/adb?hl=es-419)
