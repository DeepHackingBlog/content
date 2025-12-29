---
id: "fundamentos-para-stack-based-buffer-overflow"
title: "Fundamentals for Stack-based Buffer Overflow"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-10-17
updatedDate: 2021-10-17
image: "https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-0.webp"
description: "Complete guide on the fundamentals of Stack-based Buffer Overflow: registers, memory, stack frames, functions, and exploitation techniques."
categories:
  - "low-level"
draft: false
featured: false
lang: "en"
---

Before exploiting a Buffer Overflow, we need to understand what happens when we execute this type of attack. To do this, we're going to start from the basics.

Table of Contents:

- [Introduction](#introduction)
- [Registers](#registers)
- [Process in Memory](#process-in-memory)
- [Stack](#stack)
- [Functions](#functions)
- [Endianness](#endianness)
- [NOPS - No Operation Instruction](#nops---no-operation-instruction)

## Introduction

The CPU (Central Processing Unit) is the part of our computer responsible for executing "machine code". Machine code is a series of instructions that the CPU processes. Each of these instructions is a basic command that executes a specific operation, such as moving data, changing the program's execution flow, performing arithmetic operations, logical operations, etc.

CPU instructions are represented in hexadecimal. However, these same instructions are translated into mnemonic code (a more readable language), and this is what we know as assembly code (ASM).

So, graphically, the difference between machine code and assembly language is as follows:

<figure>

![Comparison between machine code and assembly language](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-1.avif)

<figcaption>

Reference: [Quora - Is assembly language a source code or object code?](https://www.quora.com/Is-assembly-language-a-source-code-or-object-code)

</figcaption>

</figure>

Each CPU has its Instruction Set, in English: `Instruction Set Architecture (ISA)`.

The ISA is a series of instructions that the programmer or compiler must understand and use to correctly write a program for that specific CPU and machine.

In other words, ISA is what the programmer can see, meaning memory, registers, instructions, etc. It provides all the necessary information for anyone who wants to write a program in that machine language.

## Registers

When talking about a processor being 32 or 64 bits, it refers to the width of the CPU registers. Each CPU has a set of registers that are accessible when required. You could think of registers as temporary variables used by the CPU to obtain and store data.

There are registers that have a specific function, while others only serve, as mentioned above, to obtain and store data.

In this case, we're going to focus on GPRs (General Purpose Registers):

<figure>

![General Purpose Registers Table](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-2.avif)

<figcaption>

General Purpose Registers

</figcaption>

</figure>

In the first column, as we can see, it says "x86 Nomenclature". This is because depending on the processor's bits, the nomenclature is different:

<figure>

![Register nomenclature according to architecture](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-3.avif)

<figcaption>

Reference: [Decoder Cloud - Idiot's Guide to Buffer Overflow on GNU/Linux x64 Architecture](https://decoder.cloud/2017/01/25/idiots-guide-to-buffer-overflow-on-gnulinux-x64-architecture/)

</figcaption>

</figure>

- In 8-bit CPUs, the suffix L or H was added depending on whether it was a Low byte or High Byte.
- In 16-bit CPUs, the suffix was X (replacing the L or H from 8-bit CPUs), except for ESP, EBP, ESI, and EDI, where they simply removed the L.
- In 32-bit CPUs, as we can see, the prefix E is added, referring to Extended.
- Finally, in 64-bit CPUs, the E is replaced by R.

In addition to the 8 GPRs, there's another register that will be very important for us: the EIP (in x86 nomenclature). The EIP (Extended Instruction Pointer) contains the address of the program's next instruction.

## Process in Memory

When a process is executed, it's organized in memory as follows:

<figure>

![Process organization in memory](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-4.avif)

<figcaption>

Process in memory

</figcaption>

</figure>

Memory is divided into 4 regions: Text, Data, Heap, and Stack.

- `Text`: is established by the program and contains its code. This area is set to read-only.
- `Data`: this region is divided into initialized data and uninitialized data.
    - Initialized data includes objects like static and global variables that have already been predefined and can be modified.
    - Uninitialized data, also called BSS (Block Started by Symbol), also initializes variables, but these are initialized as 0 or without any explicit initialization, for example: `static int t`.
- `Heap`: this is where dynamic memory is located. During execution, the program may require more memory than initially planned, so through system calls like `brk` or `sbrk` and all controlled through the use of `malloc`, `realloc`, and `free`, an expandable area is achieved based on what's needed.
- `Stack`: this is the area where everything happens. Let's dedicate a section to it:

## Stack

The stack is a block or data structure with LIFO (Last In, First Out) access mode and is located in **High Memory**. You can think of the stack as an array used to store function return addresses, pass arguments to functions, and store local variables.

Something curious about the stack is that it grows toward **Low Memory**, meaning it grows downward, toward **0x00000000**.

Since the stack has LIFO access mode, there are two main operations. Before explaining each of them, I'll define an important register for understanding these two operations:

--> ESP (Stack Pointer): is a register that always points to the top of the stack. At this point, you need to realize that since the stack grows downward, meaning toward Low Memory, the closer the ESP is to 0x00000000, the larger the stack.

- PUSH Operation

The PUSH operation subtracts from ESP. In 32-bit CPUs, it subtracts 4, while in 64-bit, 8. If we think about it, if PUSH added instead of subtracted, we would be overwriting/losing data.

Example of PUSH T:

<figure>

![PUSH operation diagram on the stack](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-5.avif)

<figcaption>

Reference: [JavaPoint - Stack Push Operation](https://www.javatpoint.com/stack-push-operation)

</figcaption>

</figure>

Now, for example, more technically, if the initial value of ESP were `0x0028FF80`, and we did a PUSH 1, ESP would decrease by -4, becoming `0x0028FF7C`, and then 1 would be placed at the top of the stack.

In detail, the address would change as follows:

<figure>

![Detailed PUSH operation example](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-6.avif)

<figcaption>

PUSH operation example

</figcaption>

</figure>

- POP Operation

The POP case is the same but reversed. In 32 bits, 4 is also added, and in 64, 8. POP would, in this case, remove the value at the top of the stack, meaning the data located at the address where ESP is currently pointing. This removed data would normally be stored in another register.

Example of POP T:

<figure>

![POP operation diagram on the stack](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-7.avif)

<figcaption>

Reference: [JavaPoint - Stack Pop Operation](https://www.javatpoint.com/stack-pop-operation)

</figcaption>

</figure>

Again, more technically, if, for example, after the previous PUSH 1, ESP is worth `0x0028FF7C`, performing the operation `POP EAX` would remove what was previously pushed, making ESP return to `0x0028FF80`, and additionally, making the removed value copy to the EAX register (in this case).

It's important to know that the removed value doesn't get deleted or become 0. It stays on the stack until another instruction overwrites it.

## Functions

Now that we better understand the stack, let's look at functions. These alter the normal flow of the program, and when a function ends, the flow returns to the part from which it was called.

There are two important phases here:

- **Prologue**: is what happens at the beginning of each function. It creates the corresponding stack frame.
- **Epilogue**: exactly the opposite of the prologue. It occurs at the end of the function when it finishes. Its purpose is to restore the stack frame of the function that called the one that just finished.

So the stack consists of `stack frames` (portions or areas of the stack), which are pushed (PUSH) when a function is called and popped (POP) when that function returns a value.

When a function begins, a stack frame is created and assigned to the current ESP address.

When the function ends, two things happen:

- The program receives the parameters passed to the subroutine
- The EIP is reset to the address of the initial call.

In other words, the stack frame maintains control of the address where each `subroutine`/`stack frame` should return when it finishes.

Let's look at a basic practical example to make everything clearer:

<figure>

![Simple C code example](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-8.avif)

<figcaption>

Simple C code example

</figcaption>

</figure>

1. The program starts with the main function. The first stack frame that must be pushed (PUSH) to the stack is `main() stack frame`. So once it starts, a new stack frame is created, the main() stack frame.
2. Within `main()`, the function `a()` is called, so ESP is pointing to the top of `main()`'s stack, and here the stack frame for `a()` is created.
3. Within `a()`, `b()` is called, so with ESP at the top of `a()`'s stack frame, the stack frame for `b()` is created.
4. When finishing and each function reaches its return, it's the reverse process. We'll go into detail in the next example.

<figure>

![Proof of Concept of stack frame flow](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-9.avif)

<figcaption>

POC (proof of concept)

</figcaption>

</figure>

- More complex and detailed example:

<figure>

![More complex C code example](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-10.avif)

<figcaption>

C code example

</figcaption>

</figure>

When a function begins, the first thing added to the stack are the parameters. In this case, the program starts in the `main()` function and adds the parameters `argc` and `argv` to the stack via PUSH, in right-to-left order (it's always like this).

The stack would look like this:

<div style="text-align: center;"><code>High Memory</code></div>

![Initial stack with parameters](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-11.avif)

<div style="text-align: center;"><code>Low Memory</code></div>

<br>

Now, the call (CALL) to the main() function is made. The content of the EIP (Instruction Pointer) is pushed to the stack and points to the first byte after the CALL.

This point is important because we need to know the address of the next instruction to be able to continue once the called function returns.

<div style="text-align: center;"><code>High Memory</code></div>

![Stack after saving EIP](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-12.avif)

<div style="text-align: center;"><code>Low Memory</code></div>

<br>

Now we're inside the main() function. A new stack frame must be created for this function. The stack frame is defined by EBP (Frame Pointer) and ESP (Stack Pointer).

Since we don't want to lose information from the previous stack frame, we must save the current EBP of the stack. If we don't do this, when we return, we won't know what information belonged to the previous stack frame, the one that called main().

Once the EBP value has been saved, EBP is updated and points to the top of the stack. At this point, EBP and ESP point to the same place.

<div style="text-align: center;"><code>Low Memory</code></div>

![Stack with EBP and ESP pointing to the same place](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-13.avif)

<div style="text-align: center;"><code>High Memory</code></div>

<br>

From this point, the new stack frame begins on top of the previous one (old stack frame).

This entire sequence of instructions carried out so far is what's known as the "prologue". This phase occurs in all functions. The instructions carried out so far, in assembly, would be the following:

1. `push ebp`
2. `mov ebp, esp`
3. `sub esp, X` // Where X is a number

The stack before these three instructions is as follows:

<div style="text-align: center;"><code>Low Memory</code></div>

![Stack before prologue](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-14.avif)

<div style="text-align: center;"><code>High Memory</code></div>

<br>

The first instruction (`push ebp`) saves the EBP by pushing it to the stack, corresponding in the stack to "old EBP", so it can be restored once the function returns.

Now EBP is pointing to the top of the previous stack frame (old stack frame).

With the second instruction (`mov ebp, esp`), we get ESP to move to where EBP is, now creating a new stack frame:

<div style="text-align: center;"><code>Low Memory</code></div>

![Stack after creating new frame](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-15.avif)

<div style="text-align: center;"><code>High Memory</code></div>

<br>

Remember that at this point, EBP and ESP are located at the same address.

The third instruction (`sub esp, X`) moves ESP by decreasing its value (which, since the stack grows downward, is, so to speak, increasing). This is necessary to make room for the function's local variables.

This instruction is basically performing the following operation:

- ESP = ESP - X

Leaving the stack in the following form:

<div style="text-align: center;"><code>Low Memory</code></div>

![Stack with space reserved for local variables](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-16.avif)

<div style="text-align: center;"><code>High Memory</code></div>

<br>

Now that the prologue has finished, the stack frame for the main() function is complete. Now, we've created a gap, which can be seen in the image above, for local variables.

But a problem occurs: ESP is not pointing to the memory after "old EBP", but rather it's pointing to the top of the stack. So if we do a PUSH to add each local variable, it wouldn't be pushing to the memory reserved for them.

So we can't use this type of operation.

So, in this case, bringing back the code to remember:

<figure>

![C code with local variables](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-17.avif)

<figcaption>

C code

</figcaption>

</figure>

We're going to have to use another type of operation, which will be the following:

- `MOV DWORD PRT SS:[ESP+Y], 0B`

Considering that 0B is 11, and we're talking about the first variable declared in main() as we can see in the code. This instruction means:

- Move the value 0B to the memory address pointed to by ESP+Y. Where Y is a number and ESP+Y is a memory address between EBP and ESP.

This process will repeat for all variables that need to be declared. Once completed, the stack will have this form:

<div style="text-align: center;"><code>Low Memory</code></div>

![Stack with local variables stored](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-18.avif)

<div style="text-align: center;"><code>High Memory</code></div>

<br>

After placing the 3 variables, main() will execute the next instruction. In general terms, main() will continue with its execution.

In this case, main() now calls the test() function, so another stack frame will be created.

The process will be the same as what we've seen so far:

- PUSH the function's parameters
- Call the function
- Prologue (among other things, it will update EBP and ESP for the new stack frame)
- Store local variables on the stack

At the end of this entire process, the stack will look like this:

<div style="text-align: center;"><code>Low Memory</code></div>

![Complete stack with test function](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-19.avif)

<div style="text-align: center;"><code>High Memory</code></div>

<br>

Up to this point, we've only seen half of the process, how stack frames are created. Now we're going to see how they're destroyed, meaning what happens when a return statement is executed, which is also what's known as the "epilogue".

In the epilogue, the following happens:

- Control is returned to the caller (to whoever called the function)
- ESP is replaced with the current value of EBP, making ESP and EBP point to the same place. Now a POP is done to EBP to recover the previous EBP.
- Return to the caller by doing a POP to EIP and then jumping to it.

The epilogue can be represented as:

- leave
- ret

In assembly instructions it would correspond to:

1. `mov esp, ebp`
2. `pop ebp`
3. `ret`

When the first instruction (`mov esp, ebp`) is executed, ESP will be worth the same as EBP, and therefore, the stack obtains the following form:

<div style="text-align: center;"><code>Low Memory</code></div>

![Stack after mov esp, ebp](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-20.avif)

<div style="text-align: center;"><code>High Memory</code></div>

<br>

With the second instruction (`pop ebp`), a POP is done to EBP (where ESP is also currently located). So by removing it from the stack, "old EBP" becomes the main one again, and thus, the previous stack frame has been restored:

<div style="text-align: center;"><code>Low Memory</code></div>

![Stack after pop ebp](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-21.avif)

<div style="text-align: center;"><code>High Memory</code></div>

<br>

With the third instruction (`ret`), it returns to the return address of the stack (reference: [Oracle - Instruction Set Reference - ret](https://docs.oracle.com/cd/E19455-01/806-3773/instructionset-67/index.html))

With this, we get ESP to point to "old EIP", in such a way that the stack is as follows:

<div style="text-align: center;"><code>Low Memory</code></div>

![Stack after ret](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-22.avif)

<div style="text-align: center;"><code>High Memory</code></div>

<br>

At this point, everything has been correctly restored, and the program would continue to the next instruction after the call to test(). And when it finishes, the same process occurs.

## Endianness

The way to represent and store values in memory is in Endianness, where within this format there are 2 types:

- big-endian
- little-endian

<figure>

![Comparison between Big Endian and Little Endian](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-23.avif)

<figcaption>

Reference: [SKMP Dev - Negative Addressing and BSWAP](https://skmp.dev/blog/negative-addressing-bswap/)

</figcaption>

</figure>

Example:

If we represent the number 11, in 4 bytes and in hexadecimal, we obtain the following value:

- 0x000000**0B**

Where 0B = 11

If, for example, we saw that at memory address 0x0028FEBC there is 0x0000000B, if we're on **a system using Little Endian**, we could understand at which memory address each byte is with the following:

To 0x000000**0B**, we perform the operation shown in the image, leaving it as:

<div style="text-align: center;">

0B

00

00

**00**

</div>

The last value, the highlighted one, has the memory address already seen above: 0x0028FEBC, so we could obtain the other values as:

<div style="text-align: center;"><code>high memory</code></div>

<br>

<div style="text-align: center;">

0B : 0x0028FEBF

00 : 0x0028FEBE

00 : 0x0028FEBD

**00 : 0x0028FEBC**

</div>

<div style="text-align: center;"><code>low memory</code></div>

<br>

In equation form, so to speak, we could express it as follows:

<div style="text-align: center;">

a = 0x0028FEBC

0B : a + 3

00 : a + 2

00 : a + 1

00 : a

</div>

If the system had been Big Endian, it would be exactly the opposite, the addresses would have corresponded to:

<div style="text-align: center;"><code>high memory</code></div>

<br>

<div style="text-align: center;">

00 : 0x0028FEBF

00 : 0x0028FEBE

00 : 0x0028FEBD

**0B : 0x0028FEBC**

</div>

<div style="text-align: center;"><code>low memory</code></div>

<br>

It's important to know the difference as we'll need it to write payloads for a Buffer Overflow.

## NOPS - No Operation Instruction

NOP is an assembly language instruction that does nothing. If a program encounters a NOP, it simply jumps to the next instruction. NOP is normally represented in hexadecimal as 0x90, in x86 systems.

The NOP-sled is a technique used during buffer overflow exploitation. Its purpose is to fill either a large portion or a small portion of the stack with NOPs. This will allow us to control which instruction we want to execute, which will normally be the one placed after the NOP-Sled.

![NOP-sled diagram](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-24.avif)

The reason for this is because perhaps the buffer overflow in question of the program needs a specific size and address because it will be what the program is expecting. Or it can also make it easier for us to get the EIP to point to our payload/shellcode.
