---
id: "escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps"
title: "Windows Privilege Escalation Through Insecure GUI Applications"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-12-27
updatedDate: 2021-12-27
image: "https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-0.webp"
description: "Learn to identify and exploit misconfigured graphical applications in Windows to escalate privileges using GUI exploitation techniques."
categories:
  - "windows"
draft: false
featured: false
lang: "en"
---

Normally, we are used to escalating privileges from the command console, and in fact, this is the case 95 percent of the time. However, there are certain occasions when, graphically, when we install or open a program, if it runs as administrator directly without asking us for a password, it is possible that we may have the ability to escape from the application to execute a cmd as the same user running the process.

Let's see an example using the vulnerable environment prepared by the "tib3rius" script, which you can find in his [Windows PrivEsc Setup repository](https://github.com/Tib3rius/Windows-PrivEsc-Setup).

- [Exploitation Example](#exploitation-example)
- [Real-world Example of this Exploitation](#real-world-example-of-this-exploitation)
- [References](#references)

## Exploitation Example

In this case, in this environment, the program that when executed runs as the administrator user is Paint:

![Paint shortcut configured to run as administrator](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-1.avif)

We have logged into the computer as the "user" account, we are an unprivileged user:

![Session started as unprivileged user](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-2.avif)

Going back to Paint, when we double-click and open it, it doesn't ask us for anything, it just opens, because it's configured to do so:

![Paint running without requesting credentials](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-3.avif)

However, we can verify that it's being executed by the administrator user through the following command:

`tasklist /V | findstr <program>`

> Tasklist displays the list of processes that are currently running on the computer. With the `/V` argument it shows a more detailed output
> 
> Findstr is simply the equivalent of grep in Linux systems

![Paint process running as administrator](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-4.avif)

Well, knowing this, we go back to Paint and what is usually done in these cases is to navigate to some feature of the program where we can escape from it. The most typical approach is to try to open the file explorer, whether to select a path or open a file or whatever:

![Paint menu to open file](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-5.avif)

![File explorer opened from Paint](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-6.avif)

With the file explorer open, we can open a cmd in the following way:

![File explorer address bar](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-7.avif)

![CMD running as administrator](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-8.avif)

IMPORTANT: we could also escape and open a powershell.exe by doing "SHIFT + Right Click":

![Context menu to open PowerShell](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-9.avif)

![PowerShell running as administrator](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-10.avif)

And this way, we also manage to escape and execute a cmd in the context of whoever is running Paint, in this case, admin. This happens because since the parent process is running as administrator (Paint), the cmd will execute with the same privileges being a child process. From the [Process Explorer](https://docs.microsoft.com/en-us/sysinternals/downloads/process-explorer), it looks like this:

![Process hierarchy in Process Explorer](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-11.avif)

So it's not a vulnerability in Paint itself, but rather there's a misconfiguration where this application runs as administrator directly.

Now, if we are "anti-graphical-interface," we can simply transfer an "exe" file generated with msfvenom to execute a reverse shell:

- I set up a listener on Kali:

![Netcat listener on Kali](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-12.avif)

- I execute the "exe" that I transferred to Windows, which generates a reverse shell to Kali on port 4444:

![Payload execution on Windows](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-13.avif)

![Reverse shell obtained as administrator](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-14.avif)

This way, having taken advantage of a vulnerability graphically, in the end, we have managed to escalate privileges and obtain a shell as Administrator.

## Real-world Example of this Exploitation

Not long ago (at least at the time of writing this post), in August 2021, a vulnerability emerged which allowed privilege escalation using Razer devices. The escalation was performed almost exactly the same way as explained in this post.

Basically, the basic idea is that when physically connecting a Razer device, Windows will automatically download and install the "Razer Synapse Software" program, this process will be performed as the SYSTEM user (all without asking us for permissions, it does it automatically). In the installation wizard, there comes a moment when it allows us to open the file explorer to select the path where we want it to be installed, at this point we simply do what has been explained in this post.

Below I leave you an article that talks about the vulnerability:

- [How a gaming mouse can get you Windows superpowers!](https://www.sophos.com/es-es/blog/how-a-gaming-mouse-can-get-you-windows-superpowers)

Of course, this literally allowed anyone with a Razer device and physical access to a computer to have the ability to escalate privileges.

For more information, here are other sources that discuss in detail how it works:

- [Razer bug lets you become a Windows 10 admin by plugging in a mouse](https://www.bleepingcomputer.com/news/security/razer-bug-lets-you-become-a-windows-10-admin-by-plugging-in-a-mouse/)
- [You Can Get Admin Privileges On Windows 10 With A Razer Mouse](https://www.minitool.com/news/razer-mouse-bug-gain-admin-privileges-windows.html)

## References

- [Windows Privilege Escalation for OSCP & Beyond Course on Udemy](https://www.udemy.com/course/windows-privilege-escalation/)
- [Windows-PrivEsc-Setup Repository on GitHub](https://github.com/Tib3rius/Windows-PrivEsc-Setup)
- [Original tweet about the vulnerability in Razer devices](https://twitter.com/j0nh4t/status/1429049506021138437)
- [Razer bug lets you become a Windows 10 admin by plugging in a mouse](https://www.bleepingcomputer.com/news/security/razer-bug-lets-you-become-a-windows-10-admin-by-plugging-in-a-mouse/)
- [You Can Get Admin Privileges On Windows 10 With A Razer Mouse](https://www.minitool.com/news/razer-mouse-bug-gain-admin-privileges-windows.html)
