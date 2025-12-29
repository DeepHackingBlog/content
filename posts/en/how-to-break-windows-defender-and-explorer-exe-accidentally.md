---
id: "como-cargarse-windows-defender-sin-querer"
title: "How to Break Windows Defender (and explorer.exe by Accident)"
author: "daniel-monzon"
publishedDate: 2022-11-21
updatedDate: 2022-11-21
image: "https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-0.webp"
description: "Technical process that led to causing a crash in explorer.exe and disabling Windows Defender through the suspension of protected processes in Windows"
categories:
  - "windows"
draft: false
featured: false
lang: "en"
---

In this post, I'm going to explain the process that led me to cause a crash in `explorer.exe` and disable Windows Defender.

Well, it turns out that I was reading about the types of access that can be requested when trying to open a handle to a process with the _[OpenProcess](https://learn.microsoft.com/es-es/windows/win32/api/processthreadsapi/nf-processthreadsapi-openprocess)_ function from the Windows API. For those who don't know, in Windows a handle is an identifier necessary to access an object.

Now, what is an object? Just as it's said that in Linux everything is a file, in Windows, everything is an object. For example, a process in Windows is represented with the _[EPROCESS](https://www.geoffchappell.com/studies/windows/km/ntoskrnl/inc/ntos/ps/eprocess/index.htm)_ object. This would be the definition of an object in Windows, more information on what was mentioned at:
- _[Official Documentation of Handles and Objects in Windows](https://learn.microsoft.com/es-es/windows/win32/sysinfo/handles-and-objects)_
- _[Official Documentation of Process Access Rights in Windows](https://learn.microsoft.com/en-us/windows/win32/procthread/process-security-and-access-rights)_

In summary, you cannot access an object directly without a handle. This is how a handle (identifier) is represented in the book _[Windows System Programming Part 1 by Pavel Yosifovich](https://www.amazon.es/Windows-10-System-Programming-Part/dp/B08X63B6VP)_:

![Handle representation in Windows](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-1.avif)

There are many ways to view the handles that a process has open, one would be with _[Process Explorer](https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer)_ or _[Handle](https://learn.microsoft.com/en-us/sysinternals/downloads/handle)_ (tools from the Sysinternals suite), with WinDbg, etc.

Getting back to the topic, while reading about protected processes, I read this:

<figure>

![Access rights denied from normal processes to protected processes](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-2.avif)

<figcaption>

_[Official documentation on process security and access rights](https://learn.microsoft.com/en-us/windows/win32/procthread/process-security-and-access-rights)_

</figcaption>

</figure>

Of all the access rights that are denied from normal processes to protected processes, I saw that there were several that are not allowed. So, knowing all the types of access rights that exist, by simple omission the following should be allowed:
- `SYNCHRONIZE`: _[SYNCHRONIZE Access Right](https://helgeklein.com/blog/what-is-the-synchronize-file-access-right/)_
- `PROCESS_SUSPEND_RESUME`: _[Process Suspension in Windows](https://j00ru.vexillium.org/2009/08/suspending-processes-in-windows/)_
- `PROCESS_QUERY_LIMITED_INFORMATION`: _[Understanding Access Token Theft](https://posts.specterops.io/understanding-and-defending-against-access-token-theft-finding-alternatives-to-winlogon-exe-80696c8a73b)_

Both `SYNCHRONIZE` and `PROCESS_QUERY_LIMITED_INFORMATION` weren't going to get us very far, so I focused on `PROCESS_SUSPEND_RESUME`.

This thing about protected processes essentially prevents you from touching what you shouldn't even when running as administrator. Many system processes and almost all antiviruses and EDRs have their processes and services as protected, and Defender is no exception.

These are all the protected processes on a Windows virtual machine as seen from _[WinDbg](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/debugger-download-tools)_ with local kernel debugging:

![Protected processes in Windows from WinDbg](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-3.avif)

And here we see how the Defender service and process are indeed protected objects:

<figure>

![Windows Defender service as a protected process](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-4.avif)

<figcaption>

In the case of Windows Defender, the process is called `MsMpEng.exe` and the service that runs this process is `windefend`

</figcaption>

</figure>

![Windows Defender protected process](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-5.avif)

So I started researching how to suspend a process programmatically and it turned out that it could be done with _[NtSuspendProcess](http://pinvoke.net/default.aspx/ntdll.NtSuspendProcess)_. Since this function is not present in the Windows API, knowing that it starts with Nt we know it must be in `ntdll.dll` (this DLL has the Native API and is what all Windows processes use to communicate with the kernel).

Knowing this, we proceed to find out how to call this function, its arguments, etc. Using the link from the previous paragraph as a reference, we define the `NtSuspendProcessFn` function, requiring a handle to a process as an argument:

![NtSuspendProcessFn function definition](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-6.avif)

`NtSuspendProcess` in NTDLL is just a wrapper for the real function, which is in the kernel (`ntoskrnl.exe`), which looks like this when opened in IDA:

![NtSuspendProcess function in IDA](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-7.avif)

Functions in Windows normally end up needing DLLs like `kernel32.dll` or `advapi32.dll`, which in turn use the Native API functions (in `ntdll`), and finally from those functions the syscalls are made that allow code execution in kernel mode:

![Flow of calls from user mode to kernel mode](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-8.avif)

> Note: this drawing is a simplification of the process, I leave a link in the references to a post that details the entire process.

Continuing with the topic, the function to suspend processes ended up like this:

![Implementation of the function to suspend processes](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-9.avif)

Essentially, what is done is opening a handle to the `ntdll.dll` module that this process will have in memory when executed (all processes have it, as I mentioned before) and with _[GetProcAddress](https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getprocaddress)_ the memory address of the `NtSuspendProcess` function will be searched for in the _[EAT (Export Address Table)](https://learn.microsoft.com/en-us/archive/msdn-magazine/2002/march/inside-windows-an-in-depth-look-into-the-win32-portable-executable-file-format-part-2)_ of `ntdll.dll`.

You'll also need to include these headers:

![Headers needed for the code](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-10.avif)

> _[Differences between headers and libraries](https://www.geeksforgeeks.org/difference-header-file-library/)_

And use this function to find the PID of the process whose name we give as an argument to the function. The function creates a snapshot of all processes using _[CreateToolhelp32Snapshot](https://learn.microsoft.com/en-us/windows/win32/api/tlhelp32/nf-tlhelp32-createtoolhelp32snapshot)_ and iterates over the structure that this function returns, comparing the _[szExeFile](https://learn.microsoft.com/en-us/windows/win32/api/tlhelp32/ns-tlhelp32-processentry32)_ field of each entry corresponding to each process with the process name we've passed. And finally, if the executable name from the snapshot matches the one we want, the PID of the process we're interested in is returned:

![Function to find PID by process name](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-11.avif)

When trying to do a test, I got access denied (error 5):

![Access denied error](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-12.avif)

So I added a function to enable the `SeDebugPrivilege` privilege in the process's access token (yes, that privilege must already be there, meaning this only works if we launch our PoC with administrator permissions).

> For those who don't know what an access token is, it's a structure that contains information about the privileges that a process or thread has and is used to access a series of resources. To put it more simply, we can see the privileges that are included in the access token of `cmd.exe` when we run `whoami /priv` (since the `whoami.exe` process is created with the same privileges as `cmd.exe`). The `SeDebugPrivilege` in particular is used by both debuggers and even offensive tools such as mimikatz when we run the famous `privilege::debug`.

The complete function to enable this privilege is a bit long, so let's skip it to go directly to the main, which looks like this:

![Main function of the program](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-13.avif)

So, to recap, what we're going to do is:
1. Identify the PID of the Defender process
2. Open a handle to our process's access token
3. Enable the `SeDebugPrivilege` privilege
4. Open a handle to the Defender process with `PROCESS_SUSPEND_RESUME` access
5. Call `NtSuspendProcess` to see what happens

And once launched, the Defender process becomes suspended and to further surprise, it turns out that the graphical environment hangs (`explorer.exe`), the only window that works is the cmd itself. I wanted to verify that it was really suspended, but since I didn't have graphical tools, I used a tool called _[DTrace](https://learn.microsoft.com/es-es/windows-hardware/drivers/devtest/dtrace)_. It's an open-source tool that has a version for Windows and has this architecture:

![DTrace architecture in Windows](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-14.avif)

Writing scripts in D, you can do things like what we're interested in now, logging the syscalls made by the process, and curiously after a while without making syscalls (which is to be expected in a suspended process), suddenly `MsMpEng.exe` started making syscalls, it's not clear why, although it could be that this is due to some driver doing something with the Defender process that we don't see.

This is the D script I used to log the syscalls of that process:

![D script to log syscalls](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-15.avif)

This is what it looks like before suspending the process:

![Process syscalls before suspending](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-16.avif)

And this is what it looks like a while later (at first it doesn't make any syscalls):

![Process syscalls after suspending](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-17.avif)

After rebooting the machine, in Eventviewer while reviewing recent events we see that a 1002 event (application hang) occurred in `explorer.exe`:

![Event 1002 in Eventviewer showing explorer.exe crash](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-18.avif)

Initially I thought there might be some handle open from `MsMpEng` to `explorer`, however, when looking at the handles of `MsMpEng` I didn't see any handles to `explorer.exe`

> Note: This PID (5004) is on my host machine, on the virtual machine it's 3068, or bfc in hexadecimal

![MsMpEng process handles](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-19.avif)

There were only handles to itself, so it may not be because of that. I spent some time trying to figure out the reason for the explorer crash, although I didn't get anything clear. So for the moment I'll leave it here in case someone wants to dig deeper.

And in conclusion, this is how we break Defender :D (but yes, with admin privs).

> Note: when I have some time, I'll publish the tool so you can mess around with it.

## References
- _[Reversing Windows Internals (Part 1) - Digging Into Handles, Callbacks & ObjectTypes](https://rayanfam.com/topics/reversing-windows-internals-part1/)_
- _[Backstab - A tool to kill antimalware protected processes](https://github.com/Yaxser/Backstab)_
- _[Windows 10 System Programming, Part 1](https://www.amazon.es/Windows-10-System-Programming-Part/dp/B086Y6M7LH/)_
- _[DTrace on Windows](https://learn.microsoft.com/es-es/windows-hardware/drivers/devtest/dtrace)_
- _[Anatomy of the thread suspension mechanism in Windows (Windows Internals)](https://ntopcode.wordpress.com/2018/01/16/anatomy-of-the-thread-suspension-mechanism-in-windows-windows-internals/)_
- _[A Syscall Journey in the Windows Kernel](https://alice.climent-pommeret.red/posts/a-syscall-journey-in-the-windows-kernel/)_
