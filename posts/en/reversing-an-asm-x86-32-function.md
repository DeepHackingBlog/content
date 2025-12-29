---
id: "reversing-a-una-funcion-en-ensamblador-x86"
title: "Reversing an ASM x86-32 Function"
author: "adria-perez-montoro"
publishedDate: 2024-09-25
updatedDate: 2024-09-25
image: "https://cdn.deephacking.tech/i/posts/reversing-a-una-funcion-en-ensamblador-x86/reversing-a-una-funcion-en-ensamblador-x86-0.webp"
description: "Static and dynamic analysis of an x86-32 assembly function. Learn reversing through a practical exercise from the Practical Reverse Engineering book."
categories:
  - "low-level"
draft: false
featured: false
lang: "en"
---

Hello everyone and welcome to this article, I'm b1n4ri0 (again). Today we're going to tackle a reverse engineering exercise. On this occasion, we're going to solve exercise 1 from the first chapter of the book _[Practical Reverse Engineering](https://www.amazon.es/Practical-Reverse-Engineering-Reversing-Obfuscation-ebook/dp/B00IA22R2Y)_.

As an introduction, the exercise deals with an x86-32 assembly function. Mainly, we're asked to explain what this function does and what types of data it operates on.

We'll solve the exercise in two different ways: first with static analysis and then with dynamic analysis. This will serve as an example for those who are new to the world of reversing. The intention is to explain everything in detail and with diagrams to make it easier to understand.

In any case, if you still have questions, don't hesitate to ask in the Яeverse ESP community. In case you don't know it yet, this community focuses on low-level security (among other tinkering and various projects). You can find us on both [Discord](https://discord.gg/HxvetecGFF) and [Telegram](https://t.me/reversersesp).

Before starting the article, I strongly recommend that you have knowledge of the topics covered in the following resources to better understand certain practices carried out in this post:
- [x86 Guide from University of Virginia](https://www.cs.virginia.edu/~evans/cs216/guides/x86.html#calling)
- [x86 Registers on RipTutorial](https://riptutorial.com/assembly/example/18064/x86-registers)
- [x86 Register Fundamentals on LearnTutorials](https://learntutorials.net/es/x86/topic/2122/fundamentos-del-registro) (Similar resource to the second one).
- [GDB Documentation](https://sourceware.org/gdb/current/onlinedocs/gdb)
- [Introduction to x86 Assembly](https://bible.malcore.io/readme/the-beginning/introduction-to-x86-assembly)

That said, I'd like to tell you I'll shut up now, but I don't like to lie :|.

- [Exercise Statement](#exercise-statement)
- [Working Method](#working-method)
    - [Understanding the Environment](#understanding-the-environment)
    - [Translation Example](#translation-example)
- [Static Analysis](#static-analysis)
    - [SCAS/SCASB](#scasscasb)
        - [SCASB Operation:](#scasb-operation)
        - [Resource Discussion](#resource-discussion)
        - [Relationship of ESI and ECX with the SCASB Instruction](#relationship-of-esi-and-ecx-with-the-scasb-instruction)
    - [REPNE](#repne)
        - [REPNE Operation](#repne-operation)
        - [Resource Discussion](#resource-discussion-1)
        - [Role of REPNE and SCASB in ECX and Status Flags](#role-of-repne-and-scasb-in-ecx-and-status-flags)
    - [Second Part of the Function](#second-part-of-the-function)
    - [STOS/STOSB](#stosstosb)
        - [STOSB Operation](#stosb-operation)
        - [Resource Discussion](#resource-discussion-2)
    - [REP](#rep)
        - [REP Operation](#rep-operation)
        - [Resource Discussion](#resource-discussion-3)
    - [Theory Summary](#theory-summary)
- [Pseudocode in C](#pseudocode-in-c)
- [Dynamic Analysis](#dynamic-analysis)
    - [Debugging with GDB](#debugging-with-gdb)
    - [Debugging Summary](#debugging-summary)
- [Solution](#solution)
- [Farewell](#farewell)

## Exercise Statement

> _This function uses a combination of [SCAS](https://tizee.github.io/x86_ref_book_web/instruction/scas_scasb_scasw_scasd.html) and [STOS](https://tizee.github.io/x86_ref_book_web/instruction/stos_stosb_stosw_stosd.html) to perform its work. First, explain what the type of \[EBP+8\] and \[EBP+C\] is in lines 1 and 8, respectively. Then, explain what this code snippet does._

```asm
01: 8B 7D 08         mov   edi, [ebp+8]
02: 8B D7            mov   edx, edi
03: 33 C0            xor   eax, eax
04: 83 C9 FF         or    ecx, 0FFFFFFFFh
05: F2 AE            repne scasb
06: 83 C1 02         add   ecx, 2
07: F7 D9            neg   ecx
08: 8A 45 0C         mov   al, [ebp+0Ch]
09: 8B FA            mov   edi, edx
10: F3 AA            rep stosb
11: 8B C2            mov   eax, edx
```

## Working Method

Most likely, if you're new, you're wondering: How do I reverse engineer this type of exercise? Don't worry, here I'll tell you what I normally do:

The first thing I usually do is analyze the code at a high level, I read all the code and try to understand what each instruction is for in general. The next thing I do is look up the instructions that are unknown to me and study them in depth. For example: `repne`, `scasb`, `rep`, and `stosb`.
- [x86 Instruction Set Reference](https://tizee.github.io/x86_ref_book_web/instruction/)

Additionally, I search some forums to complement the information, as they tend to have more extensive explanations.
- [Explanation of the rep stos instruction sequence on Stack Overflow](https://stackoverflow.com/questions/3818856/what-does-the-rep-stos-x86-assembly-instruction-sequence-do)
- [Discussion about repne scas on Reverse Engineering Stack Exchange](https://reverseengineering.stackexchange.com/questions/2774/what-does-the-assembly-instruction-repne-scas-byte-ptr-esedi)

Then, with all the information obtained, I generate my conjectures about how the code should behave and try to argue them.

Finally, I add context to the code, that is, I add what's missing so it can be compiled without problems. I compile it and debug it with GDB or some other debugger to verify my theories and see how the instructions actually work.

In summary, I first perform static analysis and then dynamic analysis.

#### Understanding the Environment

Before starting with the solution, we first need to understand the environment. In this case, we have a fragment of assembly code, but it seems there are more things around it. If you've never seen anything about reversing or assembly before, then you most likely don't know what these numbers and letters are. But don't worry, this section is for you. I'll explain right away with the help of a diagram what each thing means:

![Explanatory diagram of assembly code structure](https://cdn.deephacking.tech/i/posts/reversing-a-una-funcion-en-ensamblador-x86/reversing-a-una-funcion-en-ensamblador-x86-1.avif)

Specifically, we can divide the environment into three blocks:
- Line number
- Hexadecimal representation of the code
- Assembly code

The line number and the assembly code section have no major complexity.

I mainly want you to understand the hexadecimal representation of the code, as it will be very useful to us in the not-too-distant future. As can be seen in the diagram, the representation can be divided into two parts:
1. Opcode
2. ModR/M Byte

The opcode indicates the instruction to be executed, while the ModR/M specifies the operands to which the instruction will be applied.

The information provided by the ModR/M occupies one byte, distributed as follows:
- 2 bits for the addressing mode (memory-register, register-register, etc.).
- 3 bits to specify the destination register.
- 3 bits to specify the source register or memory location.

There are instructions that don't have the ModR/M Byte, such as in line 5, `F2 AE → repne scasb`, since the instructions themselves already manage memory and registers implicitly.

#### Translation Example

You're probably wondering what happens with three-block instructions, such as the one on the first line: `8B 7D 08`. Well, the first thing is to identify the components:
1. `8B` → MOV opcode
2. `7D` → If we convert it to binary: `0111 1101`:
    - `01` → mod = Memory access with 1-byte displacement. This means the operation doesn't occur directly between registers, but involves memory access with a small displacement (8 bits).
    - `111` → reg = **EDI**
    - `101` → rm = **EBP**
3. `08` → Indicates the displacement with respect to the EBP register, in this case 8 bits.

There are many other concepts and topics that could be covered, such as:
- Legacy prefixes (1-4 bytes, optional)
- Opcode with prefixes (1-4 bytes, mandatory)
- ModR/M (1 byte, if necessary)
- SIB (1 byte, if necessary)
- Displacement (1, 2, 4, or 8 bytes, if necessary)
- Immediate (1, 2, 4, or 8 bytes, if necessary)

The other points we haven't seen are beyond the scope of this post. However, I leave here some resources to learn more about these topics:
- [X86-64 Instruction Encoding General Overview](https://wiki.osdev.org/X86-64_Instruction_Encoding#General_Overview)
- [ModR/M Byte Explanation](http://c-jump.com/CIS77/CPU/x86/X77_0060_mod_reg_r_m_byte.htm)
- [ModR/M Article on Wikipedia](https://en.wikipedia.org/wiki/ModR/M)

## Static Analysis

I'll leave the code here again to have it more at hand.

```asm
01: 8B 7D 08         mov   edi, [ebp+8]
02: 8B D7            mov   edx, edi
03: 33 C0            xor   eax, eax
04: 83 C9 FF         or    ecx, 0FFFFFFFFh
05: F2 AE            repne scasb
06: 83 C1 02         add   ecx, 2
07: F7 D9            neg   ecx
08: 8A 45 0C         mov   al, [ebp+0Ch]
09: 8B FA            mov   edi, edx
10: F3 AA            rep stosb
11: 8B C2            mov   eax, edx
```

In this section I'll get to the point and assume that you already have a basic understanding of how registers work and their purpose. Additionally, I emphasize that, according to the book, we'll treat this code as if it were a program written in C.

```asm
01: 8B 7D 08         mov   edi, [ebp+8]
```

- In this first instruction, the value stored in the memory address **EBP+8** is being copied to the **EDI** register. For now, we can think that **EBP+8** is a function argument (if you lack context, check the links at the beginning). Additionally, given the use of **EDI**, we can vaguely deduce that the argument is some type of array (possibly of type `char`), although we won't confirm anything yet.

```asm
02: 8B D7            mov   edx, edi
```

- The next instruction copies the value of **EDI** to **EDX**. You might wonder why we didn't copy **\[ebp+8\]** directly to **EDX**. Basically, it's for efficiency reasons, it's simpler and faster to perform an operation between registers (reg-reg) than an operation between a register and memory (mem-reg). Therefore, now the contents of **\[ebp+8\]**, **EDI**, and **EDX** all have the same value. From this instruction, we can assume that **EDX** is storing the value temporarily, at least until proven otherwise.

```asm
03: 33 C0            xor   eax, eax
```

- This one is simple, the value of the **EAX** register is set to 0 using the `xor` operation.

```asm
04: 83 C9 FF         or    ecx, 0FFFFFFFFh
```

- In this case, the `or` operation is used to set the value of **ECX** to `0xFFFFFFFF`. This value can have different interpretations depending on whether it's considered as a signed or unsigned integer. For now, we only have this information available. Later we'll see what representation it takes.

```asm
05: F2 AE            repne scasb
```

Next, I'll explain these instructions in detail:

#### SCAS/SCASB

![SCAS instruction reference](https://cdn.deephacking.tech/i/posts/reversing-a-una-funcion-en-ensamblador-x86/reversing-a-una-funcion-en-ensamblador-x86-2.avif)

The `SCASB` instruction is used to scan byte strings. As the image above shows, there are variations of `SCAS` that depend on the size of the value to compare. Depending on the data size, one register or another is used. It's important to note that the instruction logic doesn't change regardless of the size of the data/registers involved.

![SCAS variations table](https://cdn.deephacking.tech/i/posts/reversing-a-una-funcion-en-ensamblador-x86/reversing-a-una-funcion-en-ensamblador-x86-3.avif)

###### SCASB Operation:

- Comparison:

The instruction compares the value in the **AL** register with the byte at address **ES:\[EDI\]** (32-bit mode) or **ES:\[DI\]** (16-bit mode), depending on the mode the CPU is in (16 or 32 bits / Real or Protected Mode). The calculation of **ES:\[EDI\]** varies depending on whether it's in real or protected mode, but we won't go into details in this post to avoid extending too much. Perhaps we'll see it later if you like the content.

- EDI or DI Update:

After each comparison:
- If `DF = 0` (forward): `EDI` or `DI` is incremented by 1.
- If `DF = 1` (backward): `EDI` or `DI` is decremented by 1.

![SCASB operation diagram](https://cdn.deephacking.tech/i/posts/reversing-a-una-funcion-en-ensamblador-x86/reversing-a-una-funcion-en-ensamblador-x86-4.avif)

###### Resource Discussion

According to the following resources (which are the same content but on different pages), it seems that the following operations are performed when using the `SCASB` instruction. It should be noted that this is only an analogy and that, in reality, it doesn't happen exactly this way. C is simply used to represent the operation of this instruction more comfortably:
- [SCAS/SCASB/SCASW/SCASD reference on tizee](https://tizee.github.io/x86_ref_book_web/instruction/scas_scasb_scasw_scasd.html#scan-string)
- [SCAS/SCASB/SCASW/SCASD reference on c9x](https://c9x.me/x86/html/file_module_x86_id_287.html)

```c
if(IsByteComparison()) {
	Temporary = AL - Source;
	SetStatusFlags(Temporary);
	if(DF == 0) {
		(E)SI = (E)SI + 1;
		(E)DI = (E)DI + 1;
	}
	else {
		(E)SI = (E)SI - 1;
		(E)DI = (E)DI - 1;
	}
}
...
```

The above code translates as follows:
- First, the code checks that we are indeed dealing with bytes using the `IsByteComparison();` function.
- Then, the comparison is made between **AL** and **ES:\[EDI\]** and the result is stored in the `Temporary` variable:

```c
Temporary = AL - Source;
```

- Based on the content of `Temporary`, the flag values are adjusted (**OF, SF, ZF, AF, PF,** and **CF** are the affected flags). This is carried out by the `SetStatusFlags();` function:

```c
SetStatusFlags(Temporary);
```

- Once the flag values have been updated with the `SetStatusFlags();` function, the state of the direction flag (**DF**) is checked. If **DF** equals 0, the comparison will be done from left to right (from bottom to top in terms of memory), otherwise, it will be done in reverse. As we can see, the value of **EDI/DI** is incremented or decremented by one unit depending on the state of **DF**:

```c
if(DF == 0) {
		(E)SI = (E)SI + 1;
		(E)DI = (E)DI + 1;
	}
	else {
		(E)SI = (E)SI - 1;
		(E)DI = (E)DI - 1;
	}
```

###### Relationship of ESI and ECX with the SCASB Instruction

If you're reading carefully, you've probably noticed that I haven't mentioned anything about the increment or decrement of the **ESI** register.

This is because, in reality, **ESI** is not part of the `SCASB` instruction. As we just observed in the previous section, the comparison is made between the byte stored in **AL** and the byte stored at the address pointed to by **ES:\[DI\]**, so in this case we can omit everything related to **ESI** from the code.

A brief reminder about the function of these registers:
- **ESI**: _Source Index_ → Generally used in instructions that load data from a memory location to a register.
- **EDI**: _Destination Index_ → Generally used in instructions that store data from a register to a memory location.

Personally, I think **ESI** is useful in a comparison between two strings, as it can be used to point to the source string (string1) while **EDI** is used for the destination string (string2). In this case, you could load a byte from `string1` into **AL** using **\[ESI\]** and then compare it with the value pointed to by **EDI** using the **SCASB** instruction. It should be noted that **SCASB** doesn't modify the **ESI** register, it only affects **EDI** by automatically advancing its pointer. (Obviously there are better and more effective ways to perform this process).

```asm
compare_strings:
    mov al, [esi]          ; Load the byte from string1 into AL
    scasb                  ; Compare AL with the byte at [edi]
    inc esi                ; Advance to the next character in string1
    jmp compare_strings    ; Repeat the process
```

Likewise, in the debugging section we'll verify that **ESI/SI** is not part of this instruction.

Just as the previous resources mention **ESI/SI**, the following resource exposes its operation clearly and directly, where **ESI/SI** doesn't appear in the description of `SCAS` operation.

Perhaps it's not too clear in [this](https://www.aldeid.com/wiki/X86-assembly/Instructions/scasb) resource, but the modification of the **ECX** register is also not within the `SCAS` operation. Since it's common to see `SCAS` accompanied by `REPNE`, this nuance is added. However, the modification of **ECX** is actually the responsibility of the `REPNE` instruction, as we'll see next.

#### REPNE

![REPNE instruction reference](https://cdn.deephacking.tech/i/posts/reversing-a-una-funcion-en-ensamblador-x86/reversing-a-una-funcion-en-ensamblador-x86-5.avif)

The `REPNE` instruction (REPeat while Not Equal) uses the **ECX** register and the **ZF** flag (Zero Flag).

###### REPNE Operation

1. Repeats the operation that accompanies it until **ECX** equals 0 or **ZF** equals 1.
2. In each iteration, the value of **ECX** is decremented by 1.

```c
while (ecx != 0) {
//program logic
		ecx --;
    if (ZF) break;
}
```

For example, the `REPNE SCASB` program can be represented as follows:

```c
while (ecx != 0) {
    ZF = (al == *(BYTE *)edi);
    if (DF == 0)
        edi++;
    else
        edi--;
    ecx--;
    if (ZF) break;
}
```

Using _[this page about REPNE](https://www.aldeid.com/wiki/X86-assembly/Instructions/repne)_ as reference.

###### Resource Discussion

If we consult the end of the reference page, we find several examples, among which the calculation of a string's length is included. If we examine the provided assembly fragment, we'll see that part of the code is quite similar to our function:

```asm
.text:00402515                 mov     edi, [ebp+arg_0]
.text:00402518                 or      ecx, 0FFFFFFFFh
.text:0040251B                 xor     eax, eax
.text:0040251D                 repne scasb
```

```asm
01: 8B 7D 08         mov   edi, [ebp+8]
02: 8B D7            mov   edx, edi
03: 33 C0            xor   eax, eax
04: 83 C9 FF         or    ecx, 0FFFFFFFFh
05: F2 AE            repne scasb
```

If we organize the instructions, we get the following matches:

```asm
mov   edi, [ebp+first_arg]
xor   eax, eax
or    ecx, 0FFFFFFFFh
repne scasb
```

This suggests that part of our function is designed to determine the length of a string. Although there are some variations in the method used, at first glance we're left with the use of the `mov edx, edi` operation as an unknown. Most likely it influences the remaining logic that we have yet to explore in the function.

###### Role of REPNE and SCASB in ECX and Status Flags

Well, I think it makes sense to return to the notation now and emphasize the behavior and properties of the `REPNE` and `SCASB` instructions. As has been observed in the previous sections, the modification of the **ECX** register is the responsibility of the `REPNE` instruction, while `REPNE` only compares the value of the **ZF** flag and doesn't modify it. The modification of the state of the various mentioned flags is part of `SCASB`'s work. It's important to emphasize this to avoid errors and confusion.

Let's continue with the next line now that we already know which registers have been affected and how.

```asm
06: 83 C1 02         add   ecx, 2
```

- This instruction adds 2 to the value contained in the **ECX** register. We'll see the reason in the next instruction.

```asm
07: F7 D9            neg   ecx
```

- At this point, the interpretation we should give to the value of **ECX** is revealed, as mentioned in the explanation of line 4. How? The key is in the use of the `neg` instruction instead of `not`.

Basically, `neg` performs two's complement negation (used in signed integers), while `not` simply negates the value as is. With this information, we can interpret that the value of **ECX** in line 4 can be considered as -1. Therefore, we can now affirm that **ECX** contains the length of a character array, or commonly known as the length of a string.

But then, why do we add 2 to **ECX** before negating it? This is done to counteract two things:
1. The fact of starting to count at -1.
2. The null value that indicates the end of the string.

* * *

In summary, up to this point, what we have is the length of a string stored in the **ECX** register.

#### Second Part of the Function

We continue with the next block of the function, line 8.

```asm
08: 8A 45 0C         mov   al, [ebp+0Ch]
```

- This instruction loads the **AL** register, which has a size of 8 bits (1 byte), with the value stored at the address pointed to by **EBP+0Ch**. As in line 1, we can deduce that this is the second argument of the function and, given the size of **AL**, we can approximate that it's a `char` data type, since in C the only data type that occupies 1 byte is `char` (or `unsigned char`, not counting other user-defined data types). Anyway, we'll verify this later.

```asm
09: 8B FA            mov   edi, edx
```

- At this point, the original value of **EDI** is recovered using the value saved in **EDX**. As we've already seen in line 5, the value of **EDI** is altered with the `SCASB` instruction, which confirms that **EDX** is used as a temporary storage register in this function.

```asm
10: F3 AA            rep stosb
```

Next, I'll explain these instructions in detail:

#### STOS/STOSB

![STOS instruction reference](https://cdn.deephacking.tech/i/posts/reversing-a-una-funcion-en-ensamblador-x86/reversing-a-una-funcion-en-ensamblador-x86-6.avif)

The `STOSB` operation is quite simple to understand now that we know `SCASB`. Basically, `STOSB` copies the byte stored in **AL** to the destination operand **ES:\[DI\]** or **ES:\[EDI\]**. As with `SCASB`, in each iteration, the **EDI** register is incremented or decremented depending on the value of the direction flag (**DF**).

Although `STOSB` and `SCASB` share similar behavior regarding the update of **EDI**, there's a key difference:
- `STOSB` modifies memory, as it stores the value of **AL** at the destination address.
- On the other hand, `SCASB` only modifies the **EDI** register and the status flags after performing a comparison, without modifying memory.

Additionally, `STOSB` doesn't modify any of the status flags, while `SCASB` does, as we've seen previously.

###### STOSB Operation

- Copies the value in the **AL** register to the byte at address **ES:\[EDI\]** (32-bit mode) or **ES:\[DI\]** (16-bit mode).

**EDI** or **DI** Update:
- After each copy:
- If `DF = 0` (forward): **EDI** or **DI** is incremented by 1.
- If `DF = 1` (backward): **EDI** or **DI** is decremented by 1.

###### Resource Discussion

In this case, pseudocode in C is also shown in _[this resource about STOS](https://tizee.github.io/x86_ref_book_web/instruction/stos_stosb_stosw_stosd.html#store-string)_, which, as usual, mentions the **ESI** register, they really have a thing for the poor **ESI** register, hahaha.

On the other hand, in _[this other resource](https://www.aldeid.com/wiki/X86-assembly/Instructions/stos)_ it's observed that the `STOSB` instruction is commonly used together with the `REP` instruction, which we'll see next.

#### REP

![REP instruction reference](https://cdn.deephacking.tech/i/posts/reversing-a-una-funcion-en-ensamblador-x86/reversing-a-una-funcion-en-ensamblador-x86-7.avif)

Knowing this instruction, we already have enough information to formulate a complete theory about the function's behavior. It smells like success, but we're not going to celebrate anything for now, just in case.

Going back to the matter, the `REP` instruction repeats the instruction that accompanies it while the value of `ECX ≠ 0`, or in other words, it repeats until `ECX == 0`. Of course in each iteration, **ECX** is decremented by 1.

###### REP Operation

As in the case of `REPNE`, the code for this operation would be something similar to:

```c
while (ecx != 0) {
//program logic
		ecx --;
}
```

In the specific case of `REP STOSB`, the equivalent code would be something like:

```c
while (ecx != 0) {
    *(BYTE *)edi = al;
    if (DF == 0)
        edi++;
    else
        edi--;
    ecx--;
}
```

Here's what `STOSB` does and how it interacts with `REP`:
- `STOSB` copies the value of **AL** to the address pointed to by **EDI**.
- Then **EDI** is adjusted based on the direction flag (`DF`):
    - If `DF = 0`, `EDI` is incremented, advancing to the next memory address.
    - If `DF = 1`, `EDI` is decremented, moving toward lower memory addresses.
- This process is repeated until the value of **ECX** reaches 0. The `REP` instruction continues executing `STOSB` until **ECX** has been decremented to 0.

###### Resource Discussion

As I mentioned in the previous section, both in _[the REP resource](https://www.aldeid.com/wiki/X86-assembly/Instructions/rep)_ and in the `STOSB` one, an example of these operations together appears. Most likely, if you know C/C++, this behavior will be familiar to you. In the next section we'll make a possible translation of this function in C, so don't worry.

```asm
;REP Resource

.text:004013E0 mov     edi, offset user_id ; memory location 0x40D020 (empty)
.text:004013E5 mov     ecx, 20h            ; size: 32
.text:004013EA mov     al, 4Fh             ; fill with value 0x4F
.text:004013EC rep stosb                   ; fill 32 bytes with 0x4F at memory location 0x40D020

;4F = O / 20 = 32
; So the result in this case is that the memory from 0x40D020 to 0x40D03F (32 bytes in total) will contain the value 0x4F (O).
```

#### Theory Summary

Now we know that the value of `ECX` equals the length of the string stored in `EBP+8`, `EDI` points to the address of `EBP+8`, and `AL` contains the value stored in `EBP+C`. Therefore, the content of the string in `EBP+8` will be replaced by the value in `AL` repeated **_n_** times, where **_n_** is the length of the string in `EBP+8`.

For example:

```c
(EBP + 8)_0 -> 'Welcome to Reverse ESP the best low level community', 0
EBP + C -> '@'
//the function is executed
(EBP + 8)_1 -> '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', 0
```

With this, we would already have a deduction of what the mysterious function does XD.

```asm
11: 8B C2            mov   eax, edx
```

Finally, this instruction copies the result of `EDX` to `EAX`, since this register is the one usually used to return the final value of the function (x86 calling convention). In this case, since `EDX` hasn't been involved in any operation, it continues pointing to `EBP+8`, or what is the same, to the beginning of the string now modified in this case.

## Pseudocode in C

```c
#include <string.h>
#include <stdio.h>

char* redact(char *text, char symbol){
	int length = strlen(text);
	memset(text, symbol, length);
	return text;
}

int main(){
	char text[] = "Welcome to Reverse ESP the best low level community";
	char symbol = '@';
	printf("%s\\n", redact(text, symbol));
	return 0;
}
```

Output:

```plaintext
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
```

In case you don't feel like compiling it locally, you can use _[onlineGDB](https://onlinegdb.com/g8q-IjaMZ)_ to verify that the code works as we expected.

![Execution result on onlineGDB](https://cdn.deephacking.tech/i/posts/reversing-a-una-funcion-en-ensamblador-x86/reversing-a-una-funcion-en-ensamblador-x86-8.avif)

## Dynamic Analysis

This section is quite shorter and faster, since we now know what each instruction does and we just need to verify that they actually do what we've been deducing.

The first thing is to add a prologue and epilogue to the function.

```asm
redact:
    push ebp           ; save the stack base pointer
    mov ebp, esp       ; make the base pointer point to ESP    
    ; --------------------------------------------
    mov edi, [ebp+8]   
    mov edx, edi       
    xor eax, eax       
    or ecx, 0FFFFFFFFh 
    repne scasb        
    add ecx, 2         
    neg ecx            
    mov al, [ebp+0Ch]  
    mov edi, edx       
    rep stosb          
    mov eax, edx       
    ; ----------------------------------------------
    mov esp, ebp       ; restore the stack pointer
    pop ebp            ; restore the stack base pointer
    ret
```

Well, with this we have a "proper" function. Now let's make this executable as a normal program.

We'll do it as follows: I won't go into too much detail with the code. Basically, we define the necessary sections to host the data and be able to call our function. The rest is loading the data onto the stack, calling the function, and performing cleanup and exit operations.

```asm
section .data
text:
	db 'Welcome to Reverse ESP the best low level community', 0
section .text
	global _start
_start:
	push byte '@' ;push the character with which we redact
	push dword text ;push the string address
	call redact ;call the function
	add esp, 8 ;clean the 2 parameters from the stack
	mov eax, 1 ;sys_exit
	xor ebx, ebx ;exit code 0
	int 0x80 ;system call to exit
```

Once we have the complete code, we compile and link it using `nasm` and `ld`, respectively.

```bash
nasm -f elf32 -g -F dwarf practicalre1.asm
ld -d elf_i386 -o practicalre1 practicalre1.o
```

I leave all the necessary files on my GitHub:
- _[Hacking Research Zone on GitHub b1n4ri0](https://github.com/b1n4ri0/Hacking-Research-Zone)_

Let's see what each argument means so it can be easily understood:

**NASM**
- `-f elf32` → Defines the output file format.
- `-g` → Enables debugging information.
- `-F dwarf` → Defines the debugging information format, in this case DWARF (_[Debugging With Attributed Record Formats](https://dwarfstd.org/)_). This is a standard format that includes not only the assembled instructions, but also additional debugging information, necessary for GDB to effectively debug the assembled code.
- `practicalre1.asm` → Is the name of the file to compile.

**LD**
- `-d` → Preserves all common sections and ensures that spaces are allocated for them, preventing the linker from removing common sections that are not directly referenced in the code.
- `elf_i386` → Specifies the output file format.
- `-o` → Specifies the name of the output file (executable).

I leave the documentation for each command below:
- [NASM Documentation](https://www.nasm.us/doc)
- [LD Manual](https://ftp.gnu.org/old-gnu/Manuals/ld-2.9.1/html_mono/ld.html#SEC3)

#### Debugging with GDB

The commands we'll use in GDB are as follows:

```bash
p/x $<register> # Prints the register content in hexadecimal format.
p/d $<register> # Prints the register content in decimal format.
p/c $<register> # Prints the register content as a character.
x/s $<register/memory address> # Shows the memory address content as a character string.
s # Executes the next program instruction and enters function calls.
run # Starts program execution from the beginning.
break *_start # Sets a breakpoint at the _start label.
```

In this section we'll clear up doubts and verify that our static analysis is correct.

```bash
b1n4ri0@hacking-research-zone:~/practicalre$ gdb -q practicalre1
Reading symbols from practicalre1...
(gdb) break *_start
Breakpoint 1 at 0x8049000: file practicalre1.asm, line 7.
(gdb) run
Starting program: /home/b1n4ri0/practicalre/practicalre1 

Breakpoint 1, _start () at practicalre1.asm:7
7		push byte '@' ;push the character with which we redact
(gdb) 
```

- First we pass the program to GDB and then set a breakpoint at `_start`.

```bash
(gdb) s
8		push dword text ;push the string address
(gdb) 
9		call redact ;call the function
(gdb) 
15		push ebp
(gdb) 
16		mov ebp, esp
(gdb) p/x $ebp
$1 = 0x0
(gdb) p/x $esp
$2 = 0xffffd290
(gdb) s
redact () at practicalre1.asm:17
17		mov edi, [ebp+8]
(gdb) p/x $ebp
$3 = 0xffffd290
(gdb) p/x $esp
$4 = 0xffffd290
(gdb) p/x $edi
$5 = 0x0
(gdb) 
```

- We verify how the function prologue works. I've added this phase so it doesn't seem strange when we verify the register values. As can be seen, the steps are shown with a "delay" instruction, that is, when for example instruction 16 appears on screen, it means that the next step is that one (the instruction on line 16), not that that step is the one just executed. As a sample, we have the values of `EBP`, `ESP`, and `EDI`. Now, with this information, we're going to debug the `redact` function.

```bash
(gdb) s
18		mov edx, edi
(gdb) p/x $edi
$6 = 0x804a000
(gdb) p/x $edx
$7 = 0x0

(gdb) s
19		xor eax, eax

(gdb) p/x $edi
$8 = 0x804a000
(gdb) p/x $edx
$9 = 0x804a000
(gdb) x/s 0x804a000
0x804a000 <text>:	"Welcome to Reverse ESP the best low level community"

(gdb) s
20		or ecx, 0xFFFFFFFF
(gdb) p/x $eax
$10 = 0x0
```

- In these steps we verify the register values and, indeed, we observe that the value contained in `EDI` and `EDX` is the first argument of the function, in this case, it points to the string we've defined. We also verify that the value of `EAX` is set to 0.

```bash
(gdb) p/x $ecx
$11 = 0x0
(gdb) s
21		repne scasb
(gdb) p/x $ecx
$12 = 0xffffffff
(gdb) p/d $ecx
$13 = -1

(gdb) p/x $edi
$14 = 0x804a000
(gdb) p/x $esi ;
$15 = 0x0      ;
```

- Before executing the next instruction, we verify that the value of `ECX` is different from `0xFFFFFFFF`. Then we execute the instruction and observe the value of `ECX` in hexadecimal and decimal. Before executing `REPNE SCASB`, we verify the values of the affected registers, that is, `EDI` and `ECX`. We also verify that `ESI` has no function in this case, the lines corresponding to the verification end in `;` to differentiate them from normal debugging.

```bash
(gdb) s
22		add ecx, 2
(gdb) p/x $ecx
$16 = 0xffffffca
(gdb) p/d $ecx
$17 = -54
(gdb) p/x $edi
$18 = 0x804a035
(gdb) p/x $esi ;
$19 = 0x0      ; 
(gdb) x/s $edi
0x804a035:	"\\034"
```

- After executing `REPNE SCASB`, we verify the value of the affected registers again. In this case, we observe that the value of `ECX` has decreased, as we mentioned in the static analysis. We also verify the value of `EDI` and `ESI`. With this, we can determine that `ESI` doesn't influence the operation. The reason why `ESI` is mentioned in the resource, I simply don't know XD.

```bash
(gdb) s
23		neg ecx
(gdb) p/x $ecx
$20 = 0xffffffcc
(gdb) p/d $ecx
$21 = -52

(gdb) s
24		mov al, [ebp+0xC]
(gdb) p/x $ecx
$22 = 0x34
(gdb) p/d $ecx
$23 = 52

(gdb) p/x $al
$7 = 0x0

(gdb) s
25		mov edi, edx
(gdb) p/x $al
$24 = 0x40
(gdb) p/c $al
$25 = 64 '@'
```

- We verify that, indeed, the value of `ECX` adjusts to the length of the text string. We also verify that `AL` contains the second argument of the function, which in this case is the character `@`, as we previously defined it.

```bash
(gdb) p/x $edx
$26 = 0x804a000
(gdb) p/x $edi
$27 = 0x804a035
```

- At this point, we recall the values of `EDX` and `EDI`.

```bash
(gdb) s
26		rep stosb
(gdb) p/x $edx
$28 = 0x804a000
(gdb) p/x $edi
$29 = 0x804a000
(gdb) p/x $ecx
$30 = 0x34
(gdb) p/x $esi ;
$31 = 0x0      ;
(gdb) p/x $si ;
$32 = 0x0     ;
```

- We observe how `EDX` is used as a temporary register to store the original address of the text string (first argument). Then, we verify the values of the registers affected by the `REP STOSB` operation. Again, we verify `ESI` to see if it's actually affected.

```bash
(gdb) s
27		mov eax, edx
(gdb) p/x $edi
$33 = 0x804a034
(gdb) p/x $ecx
$34 = 0x0
(gdb) p/x $esi ;
$35 = 0x0      ;
(gdb) p/x $si ;
$36 = 0x0     ;
```

- We execute `REP STOSB` and verify the register values. We observe that `ECX` has decreased to 0 and the value of `EDI` has also been modified: **_0x804a034 - 0x804a000 = 0x34_** -> Decimal Value = 52.
- That is, it has increased based on the value of `ECX`, as we already mentioned in the static analysis. On the other hand, the value of `ESI` has remained unchanged, as in the `REPNE SCASB` operation.

```bash
(gdb) p/x $eax
$37 = 0x40
(gdb) p/x $edx
$38 = 0x804a000
(gdb) x/s $edx
0x804a000 <text>:	'@' <repeats 52 times>

(gdb) s
28		mov esp, ebp
(gdb) p/x $eax
$39 = 0x804a000
(gdb) x/s 0x804a000
0x804a000 <text>:	'@' <repeats 52 times>
```

- Finally, we verify the value of the `EAX` register, which is what will be stored as the function's return value. Before executing the operation, it contains the value of `AL`, as is logical. After executing the last instruction of the function, the value of `EAX` equals that of `EDX`, which is the address of the text string we had entered as the first argument. When verifying the string's content, we observe that it has been modified with the `REP STOSB` operation, as we indicated in the static analysis. Now, the string's content is `52` repetitions of the character `@`, as GDB indicates.

```bash
(gdb) s
29		pop ebp
(gdb) 
30		ret
(gdb) 
_start () at practicalre1.asm:10
10		add esp, 8 ;clean the 2 parameters from the stack
(gdb) 
11		mov eax, 1 ;sys_exit
(gdb) 
12		xor ebx, ebx ;exit code 0
(gdb) 
13		int 0x80 ;system call to exit
(gdb) 
[Inferior 1 (process 32407) exited normally]
```

- Finally, we observe the function epilogue and the program exit operations.

#### Debugging Summary

As we've been able to observe, our theories and the static analysis perfectly match the dynamic analysis, which leads us to two conclusions:
1. The function redacts the content entered as the first argument with the value of the second argument.
2. The `ESI` register is not originally used in the `STOSB`, `SCASB`, `REP`, and `REPNE` operations. Again, the reason why it's mentioned in _[the tizee.github.io resource](https://tizee.github.io/x86_ref_book_web/instruction/scas_scasb_scasw_scasd.html#scan-string)_ remains a mystery.

## Solution

> _First, explain what the type of \[EBP+8\] and \[EBP+C\] is in lines 1 and 8, respectively. Then, explain what this code snippet does._

- As we've argued throughout the post, `[EBP+8]` is a pointer to `char` or `char*`. On the other hand, `[EBP+C]` is of type `char`.

I'd like to provide another additional argument (in case there aren't enough), the simple fact that the instructions affecting these parameters had the 'b' ending SCASB/STOSB indicates that operations are being performed with 1-byte values, which as we've previously mentioned, correspond to the `char` data type (`unsigned char`) in languages like C/C++. In this case, we're supposed to be working with C.

- This function redacts (overwrites) the character string passed as the first argument using the character passed as the second argument. As a graphic example, you can see the pseudocode section in C.

## Farewell

Certainly, this has been a long post. For some with more experience in reversing it may have been unnecessarily extensive, but for those who are new, I hope it has served as a support point and that you've been able to understand exactly how the provided function works.

As you can see, the exercise has no complexity, it's all a matter of time and really wanting to learn, unfortunately we have the habit of wanting to learn everything right away and if it's not like that we feel bad. Everything has its process, and when I solved the exercise for the first time, it took me much longer than I would have liked. Now I see that that time was totally necessary.

I would have loved to delve into technical details about CPU operation, register behavior, x86 calling convention, and other topics like instruction encoding. However, being realistic, the post would have been too extensive. I'll probably cover these topics and similar ones in future publications.

Thank you very much for reading me and I hope you've enjoyed this post as much as I have. ;)

> Finally, I invite you to the best low-level community in Spanish.
> - [Telegram](https://t.me/reversersesp)
> - [Discord](https://discord.gg/HxvetecGFF)
