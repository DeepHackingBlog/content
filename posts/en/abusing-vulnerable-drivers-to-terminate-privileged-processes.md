---
id: "abuso-de-drivers-para-detener-procesos-privilegiados"
title: "Abusing Vulnerable Drivers to Terminate Privileged Processes"
author: "julio-angel-ferrari-medina"
publishedDate: 2025-01-07
updatedDate: 2025-01-07
image: "https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-0.webp"
description: "Detailed analysis of how to exploit vulnerabilities in Windows drivers to terminate privileged processes and evade EDR and AV solutions through the abuse of the TrueSight.sys driver."
categories:
  - "windows"
draft: false
featured: false
lang: "en"
---

In the field of cybersecurity, protection solutions such as EDR **(Endpoint Detection and Response)** and AV **(Antivirus)** play a crucial role in defending against malicious threats. However, these systems are not infallible and, like any technology, they can present vulnerabilities that attackers can exploit to evade detection and compromise system security.

In this post, we will explore how it is possible to leverage a vulnerability in a Windows driver to terminate privileged processes, including those associated with security solutions such as EDR and AV. To do this, we will analyze and exploit a vulnerability in a well-known driver called **TrueSight.sys**, which is a driver from an anti-malware named Rogue. Through this analysis, we will demonstrate how it is possible to abuse the **ZwTerminateProcess** function to terminate protected processes, thus compromising the integrity of the security solutions implemented in the system.

Throughout this article, you will learn:

- [What is an EDR and how does it differ from an AV?](#what-is-an-edr-and-how-does-it-differ-from-an-av)
    - [Behavior Analysis](#behavior-analysis)
    - [Internal Sandboxes](#internal-sandboxes)
    - [Machine Learning Features](#machine-learning-features)
    - [Constant Telemetry](#constant-telemetry)
- [Common EDR Manipulation Techniques](#common-edr-manipulation-techniques)
    - [Blocking Telemetry Transmission](#blocking-telemetry-transmission)
    - [Code Injection in Trusted Processes](#code-injection-in-trusted-processes)
    - [Abusing Vulnerable Drivers to Terminate Privileged Processes](#abusing-vulnerable-drivers-to-terminate-privileged-processes)
- [What is a Driver?](#what-is-a-driver)
    - [What are Ring 0, Ring 1, Ring 2, and Ring 3?](#what-are-ring-0-ring-1-ring-2-and-ring-3)
- [Analyzing and Abusing a Vulnerable Driver](#analyzing-and-abusing-a-vulnerable-driver)
    - [Static Analysis of TrueSight.sys with IDA Pro](#static-analysis-of-truesight-sys-with-ida-pro)
- [Creating an Exploit in C++ and Proof of Concept](#creating-an-exploit-in-c-and-proof-of-concept)
- [Conclusion](#conclusion)
- [Farewell](#farewell)

## What is an EDR and how does it differ from an AV?

EDR stands for **Endpoint Detection and Response**. It is an advanced security solution that not only detects threats in real-time but is also capable of providing capabilities to investigate and respond to security incidents effectively.

So, what are the main differences we can find in their detection methods? Let's see.

#### Behavior Analysis

1. **Process Monitoring:** EDRs observe the creation, modification, and termination of processes in real-time. Any unusual activity, such as the creation of unknown processes or modification of existing processes, may indicate a possible threat.
2. **Memory Inspection:** They analyze memory usage to detect code injections and other attacks that operate directly in memory, thus avoiding detection by disk-based security mechanisms.
3. **System Event Tracking:** Critical system events are recorded and analyzed, such as changes in system files, modifications in the Windows registry, and calls to sensitive APIs that could be indicative of malicious activities.

#### Internal Sandboxes

1. **Isolated Execution:** Suspicious binaries are executed in a virtualized environment where their actions can be monitored and analyzed without risk of compromising the main system.
2. **Behavior Observation:** All activities performed by the binary within the sandbox are recorded, including file creation, network connections, registry modifications, and API calls.
3. **Unknown Threat Detection:** By observing the actual behavior of the binary, EDRs can identify unknown malware that does not yet have signatures recognized by traditional AVs.

#### Machine Learning Features

1. **Normal Behavior Modeling:** Algorithms create "**normal**" behavior profiles for each endpoint, which allows detection of significant deviations that could indicate an intrusion or malicious activity.
2. **Threat Prediction:** Using historical data and learned patterns, EDRs can predict and detect threats before they become more serious problems.

#### Constant Telemetry

**Telemetry Transmission to a SOC:** EDRs also typically send telemetry to a SOC, in order to centralize information and coordinate an effective response to any incident.

## Common EDR Manipulation Techniques

Despite the advanced detection and response capabilities offered by EDRs, these systems are not infallible. Attackers develop new tactics to evade or disable defenses, allowing them to carry out their malicious activities without being detected.

Therefore, in the following section, we will discuss the different techniques that exist to evade or even disable the protections offered by these types of solutions.

#### Blocking Telemetry Transmission

An attacker can prevent telemetry transmission so that the actions being carried out are not reflected in the SOC. This is done by blocking, in one way or another, the connection between the EDR agent and its destination, which is generally the EDR management console or the central monitoring server.

By interrupting this communication, the attacker reduces the visibility that the SOC has over activities on the compromised endpoint, making early detection of malicious behaviors difficult.

To achieve this, the attacker can employ various techniques, such as **modifying firewall rules to block specific ports**, among many others.

#### Code Injection in Trusted Processes

An attacker can **inject malicious code into trusted processes to hide their activities** and evade detection by the EDR. Although modern EDRs implement robust protections against this type of attack, using advanced monitoring and behavior analysis techniques, attackers continue to develop methods to circumvent these defenses.

Code injection in legitimate processes allows operating within the context of trusted applications, leveraging their reputation to avoid being identified as a threat. To achieve this, attackers can use techniques such as **manipulating legitimate APIs** to alter the behavior of existing processes or employ obfuscation methods that make malicious code analysis difficult. By operating within protected processes, the injected code can perform harmful actions without triggering EDR alerts.

#### Abusing Vulnerable Drivers to Terminate Privileged Processes

One of the most sophisticated techniques for manipulating EDRs is the abuse of vulnerable drivers to terminate privileged processes. In this context, a driver operates at an elevated privilege level within the operating system, which grants it deep control over system processes and resources.

When a driver has vulnerabilities, attackers can exploit them to escalate their privileges from a user level to a kernel level (Ring 0, details will be discussed later). This allows them to execute critical system functions, such as **ZwTerminateProcess**, which can terminate any running process, including those associated with security solutions such as EDRs and AVs.

By exploiting a vulnerability in the driver, the attacker can invoke this function maliciously to disable the system's defenses, thus eliminating the EDR's ability to monitor and respond to threats in real-time.

## What is a Driver?

To be able to understand in detail the practical part of this post, it is essential to establish a theoretical foundation about **what a driver is and what its role is in the Windows operating system**. So let's get to it.

A **driver**, or **controller**, is an essential component of the operating system that enables communication and control of hardware and software devices within a computer. In the context of Windows, drivers operate at different processor privilege levels, known as rings, with Ring 0 being the highest privilege and Ring 3 the lowest.

Let's explain a bit about what these Rings are and what their differences are.

#### What are Ring 0, Ring 1, Ring 2, and Ring 3?

To understand how drivers operate and why their security is crucial, it is essential to understand the privilege levels in the Windows operating system, known as Rings. These rings **determine the degree of access and control** that different components and processes have over the system. Let's go into a bit more detail.

1. **Ring 0: Kernel Mode**

**Description:** Kernel Mode is the highest privilege level in the Windows operating system, **known as Ring 0**. In this mode, the code has complete access to all hardware resources and can execute any processor instruction.

**Characteristic:** Components operating in Ring 0, such as the operating system kernel and drivers, have direct access to memory, hardware, and all parts of the system.

**Risk:** Due to its high level of access, any vulnerability in code executing in Ring 0 can completely compromise the security and stability of the system.

2. **Ring 3: User Mode**

**Description:** User Mode corresponds to the lowest privilege level, **known as Ring 3**. In this mode, the code has limited access to system resources and must interact with the kernel through system calls to perform operations that require higher privileges.

**Characteristic:** Processes operating in Ring 3 cannot directly access the hardware or kernel memory. Instead, **they depend on the operating system to perform operations** that require higher privilege.

**Risk:** Ring 3 restrictions help prevent malicious applications from making unauthorized changes to the operating system. If an application in Ring 3 is compromised, **the damage is limited to the operations it can perform** without direct access to the kernel.

3. **Intermediate Rings: Ring 1 and Ring 2**

**Description:** Ring 1 and Ring 2 are intermediate privilege levels that theoretically exist in the processor's ring architecture, but in practice, **Windows does not use these levels extensively**. Generally, modern operating systems, including Windows, focus mainly on Ring 0 and Ring 3 to simplify privilege management and improve security.

**Characteristic:** In systems that use Ring 1 and Ring 2, **these rings can be used for components that require more privileges** than User Mode but less than Kernel Mode. However, in Windows, most functionalities are managed directly between Ring 0 and Ring 3.

**Risk:** In practice, these intermediate rings do not represent a significant risk in current systems.

![Diagram of privilege levels Ring 0, Ring 1, Ring 2, and Ring 3 in Windows](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-1.avif)

## Analyzing and Abusing a Vulnerable Driver

As mentioned at the beginning of this post, to fully understand how a vulnerability in a Windows driver can be exploited to terminate privileged processes, we will use the TrueSight.sys driver, which is part of the **anti-malware Rogue** software.

Through the use of IDA Pro, a powerful disassembly and static analysis tool that many of you will be familiar with, we will break down the internal workings of **TrueSight.sys** to identify critical functions and potential vulnerabilities. This analysis will allow us to understand how an attacker can abuse specific functionalities, such as **ZwTerminateProcess**, to disable privileged processes.

The first step would be to download the driver to analyze it. So, where can we find it?

I leave you here a resource where you can find a wide collection of drivers with vulnerabilities discovered over time, all of them published on that site.

- _[Vulnerable driver database at loldrivers.io](https://www.loldrivers.io)_

When accessing this resource, we must search for **TrueSight.sys**, which is the one we are going to analyze, so we download it.

![TrueSight.sys driver download page at loldrivers.io](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-2.avif)

It should be noted that, over time, **these vulnerable drivers are usually included in blacklists**. When attempting to load them into the operating system, an error message is generated indicating that **the driver's certificate has been revoked**. However, at the time of writing this post, **it is still possible to load and use them without problems on the latest versions of Windows 11**.

#### Static Analysis of TrueSight.sys with IDA Pro

Now that we have understood all this theoretical background, it's time to begin with the practical part. In my case, I will use **IDA Pro** as an analysis tool, but you can opt for others, such as **Ghidra**. The important thing is that the tool allows converting assembly code into more understandable pseudocode.

To begin, we must open our driver in our decompiler, this is more or less what it will look like.

![IDA Pro interface showing the loaded TrueSight.sys driver](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-3.avif)

So, once here, the interesting thing would be to look for functions that the controller uses and could be vulnerable, such as the **"ZwTerminateProcess"** function.

ZwTerminateProcess is a low-level Windows function that **is normally used in kernel mode code to terminate processes**.

If we think about it a bit, it's quite likely that our controller uses that function, since, being an anti-malware, it makes sense that it has the ability to stop any process, given that this is precisely what it does when detecting a threat.

Before doing the search, let's study a bit about how **ZwTerminateProcess** works. We can find all this information in the Windows documentation.

If we observe the parameters that the function handles, we find **ProcessHandle** and **ExitStatus**. This function receives a handle and a status code.

![Windows documentation showing ZwTerminateProcess parameters](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-4.avif)

Once this is understood, if we perform this search on our controller, we can observe a code block called **"sub\_1140002B7C"**, this code makes a call to the **"ZwTerminateProcess"** function.

![Code block in IDA Pro showing the call to ZwTerminateProcess](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-5.avif)

This is how the flow of that code block looks.

![Flow diagram of the code block calling ZwTerminateProcess](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-6.avif)

If we decompile it, we see that **"sub\_1140002B7C"** receives an integer as an argument, then opens a process using the **"ZwOpenProcess"** function and passes it four arguments, including the integer received by **"sub\_1140002B7C"**.

![Decompiled code of the sub_1140002B7C function in IDA Pro](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-7.avif)

After this, let's take a closer look at what the **"ZwOpenProcess"** function does.

![Detailed analysis of the ZwOpenProcess function](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-8.avif)

As can be observed, the function receives **PHANDLE**, **ACCESS\_MASK**, **POBJECT\_ATTRIBUTES**, and **PCLIENT\_ID**.

So, having this clear, we can determine that the **"ZwOpenProcess"** function receives 4 parameters, among them **a1**, which is passed as an argument to **"sub\_1140002B7C"**.

In other words, **"ZwOpenProcess"** is used to obtain the ProcessHandle that is subsequently received by the **"ZwTerminateProcess"** function.

Something interesting we could do is search for other places in our controller where **"sub\_1140002B7C"** is called.

![Cross-references in IDA Pro showing calls to sub_1140002B7C](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-9.avif)

We see that in the code block **"sub\_140001690"**, a call is made to **"sub\_1140002B7C"**. Let's see what it does.

![Decompiled code of the sub_140001690 function](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-10.avif)

The function receives three parameters: **a1, a2, and a3**, and verifies if **a1** is a valid pointer and if **a2** is greater than or equal to 4. If these conditions are met, it calls **"sub\_140002B7C"** with the value pointed to by **a1** (which is the PID) and, if the result is 0, **assigns 4i64 to a3**. If the conditions are not met, **it directly assigns 4i64 to a3 and returns the constant value 2147483653i64**.

Once this is understood, let's search for new places in the controller where the **"sub\_140001690"** function is called this time.

![Cross-references showing calls to sub_140001690](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-11.avif)

As we can see, there is a call to **"sub\_140001690"** from **"sub\_1400017C0"**, let's see what that code does.

![Decompiled code of the sub_1400017C0 function showing the v10 condition](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-12.avif)

Reviewing the code, we observe that there is a condition for the **"sub\_140001690"** function to be called, which is that **v10** equals **"2285636"**. Once this value is achieved, **"sub\_140001690"** is called, passing **v9** as the PID, then calling **"sub\_140002B7C"** and finally **"ZwTerminateProcess"** to terminate our process.

The question is, how can we reach that function to pass the PID we want?

If we analyze the **"sub\_1400017C0"** function a bit more, we see the following.

![IOCTL processing function identified in sub_1400017C0](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-13.avif)

If we observe the lines, we see that it appears to be an **IOCTL processing** function.

To understand it simply, IOCTL is an acronym that stands for **Input Output Control**. In the context of Windows drivers, IOCTLs are codes that **allow applications in user mode to communicate and send specific commands to drivers in kernel mode**.

So, knowing all this, we now know how to fulfill the necessary condition **(v10 == 0x22E044)** that will call all the other functions until reaching **"ZwTerminateProcess"** with the PID of the process we want to terminate.

## Creating an Exploit in C++ and Proof of Concept

Now it's time to create our proof of concept to test the vulnerability found in the controller. To do this, we will use two main functions from the Windows API.

- **CreateFileA**: With this function, we will be able to create or open a file or device. The idea would be to use it to obtain a handle for a controller, which will allow us to interact with it.

- **DeviceIoControl**: We will use this function to send IOCTL commands to interact with the controller, in this way we can send data, query information, or perform other actions.

So, what will be the exploit's operation? Simple, let's see it.

The script repeatedly searches for the PID of a specific process in the system, opening a **"snapshot"** of all processes and comparing their names. Then, it connects to our controller **"\\.\\TrueSight"** using the **CreateFileA** function. With the **DeviceIoControl** function, it sends the PID to the driver using the control code **0x22E044 (this is the value that variable v10 should take)**, thus indicating that it should **"terminate"** the process with that PID.

This procedure is executed in an infinite loop, so that, if the process reappears or remains active, the driver continuously attempts to eliminate it.

Let's see the **ObtenerPID** function in detail.

![Code of the ObtenerPID function in C++](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-14.avif)

The function begins by creating a snapshot of all system processes with **CreateToolhelp32Snapshot(TH32CS\_SNAPPROCESS, 0)**. Then, it uses a **PROCESSENTRY32** structure to store the data of the first process found using **Process32First**.

If successful, it continues traversing all following processes with **Process32Next**, comparing the name of each one **(pe32.szExeFile)** with the name received as a parameter. If it matches, it extracts the PID **(pe32.th32ProcessID)** and breaks the cycle.

Finally, it closes the snapshot **(CloseHandle(hCaptura))** and returns the found PID (or zero if no matches were found).

Now let's see the **main** function.

![Code of the main function of the exploit in C++](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-15.avif)

The function begins by defining the name of the process to be terminated and calls **getPID** to obtain its ID. Then, it attempts to open the driver **\\.\\TrueSight** with **read/write permissions through CreateFileA**. If it manages to open it, it enters an infinite loop where, in each iteration, it does the following:

1. It obtains the PID of the target process again **by calling getPID again**.
2. It invokes **DeviceIoControl** with the control code **0x22E044**, passing the PID as a parameter so that the driver attempts to terminate the process.
3. It reports whether the operation was **successful or failed**.

In this way, while the program is running, the **driver will constantly receive the PID and will be able to kill the process again** if it reappears or remains active.

It's time to see it in action. For my tests, I'm using **WatchGuard's EPDR** updated to its latest version.

On the other hand, I have modified the proof of concept code to be able to pass the process name or PID through an argument.

First, let's load our driver using the following command. Remember that we must execute the console with **Administrator permissions**.

```cmd
sc.exe create truesight.sys binPath=C:\windows\temp\truesight.sys type=kernel && sc.exe start truesight.sys
```

![Command console showing the loading of the TrueSight.sys driver](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-16.avif)

This command performs the following actions:

1. It executes sc.exe passing **binPath**, which will be the location of our controller.
2. It indicates the type, which in this case will be **Kernel** mode.
3. Finally, it **starts the service**.

You can use this command or the **OSRLoader** tool to load the controller.

As can be seen in this image, **the EDR status is correct** and all its services are running.

![WatchGuard EDR console showing operational status](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-17.avif)

Now let's execute our POC and see what happens.

![Exploit execution and EDR process termination](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-18.avif)

As you can observe, **the EDR process stops and the console shows errors**, **leaving the computer without protections and allowing us to carry out other attacks**, such as the execution of Mimikatz, among other actions. 😁

## Conclusion

In this post, we have explored in depth how vulnerabilities in Windows drivers can be exploited to **disable privileged processes and evade security solutions such as EDRs and AVs**.

Through detailed analysis of the internal workings of **TrueSight.sys** using **IDA Pro**, we demonstrated how a vulnerability in a critical function, such as **ZwTerminateProcess**, can be exploited to terminate protected processes, thus weakening the system's defenses.

## Farewell

That's it for this post. I hope you enjoyed it and, above all, that you learned not only how these vulnerabilities in drivers can be exploited to disable privileged processes, but also how Windows and its controllers work.

**Until next time and Happy Hacking! 😁**
