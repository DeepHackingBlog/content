---
id: "zeropointsecurity-crtl-review"
title: "CRTO II / CRTL Review - Red Team Ops 2 2024"
author: "victor-capatina"
publishedDate: 2024-03-20
updatedDate: 2024-03-20
image: "https://cdn.deephacking.tech/i/posts/zeropointsecurity-crtl-review/zeropointsecurity-crtl-review-0.webp"
description: "Complete and honest review of the CRTO II / CRTL (Red Team Leader) certification, including EDR evasion techniques, exam tips, and additional resources."
categories:
  - "certifications"
draft: false
featured: false
lang: "en"
---

They say the richest person is not the one who has the most, but the one who shares the most. The thing is I'm not rich, but I like to share. That's why today I'm here to give a short (but honest) review of CRTO II, also known as Red Team Leader (CRTL).

![Victor Capatina's CRTO II Certificate](https://cdn.deephacking.tech/i/posts/zeropointsecurity-crtl-review/zeropointsecurity-crtl-review-1.avif)

The certification focuses on being the continuation of the famous CRTO but with evasion in mind. That is, you're going to do what you did in CRTO but evading [Elastic](https://www.elastic.co/es/security/endpoint-security)'s EDR while also dealing with Windows Defender.

To do this, the course equips you with the following knowledge:

- C2 Infrastructure
- Windows APIs
- Process Injection
- Defence Evasion
- Attack Surface Reduction (ASR)
- Windows Defender Application Control (WDAC)
- Protected Processes
- EDR Evasion

As you progress through the course, you will learn new evasion techniques that, above all, can be applied to Cobalt Strike in its profile, such as [sleep mask](https://adamsvoboda.net/sleeping-with-a-mask-on-cobaltstrike/), [thread stack spoofing](https://github.com/mgeeky/ThreadStackSpoofer), [PPID spoofing](https://www.ired.team/offensive-security/defense-evasion/parent-process-id-ppid-spoofing), etc.

Honestly, the course gives you a very good foundation on more advanced evasion techniques on which you have to continue building knowledge on your own. Don't expect to bypass Kaspersky's EDR just like that after taking this course.

## Is it necessary to have CRTO before doing CRTL?

In short, yes, unless you already have vast knowledge of AD exploitation. As I said before, CRTL is the continuation of CRTO, so the attacks are very similar but with more defensive solutions in between (EDR).

Additionally, CRTO will allow you to understand the basics of Cobalt Strike, which is essential to be able to tackle CRTL.

## Labs VS Exam

The labs are a faithful copy of the exam. This is not OffSec asking you for things you haven't seen during the course. If you've managed to do well in the labs, then rest easy. Additionally, the exam lasts 96 hours, so you have 12 hours a day for 8 days to get the 5/6 flags needed to pass.

## Additional Resources

To make sure your payloads are completely undetectable by EDR/AV, I recommend you check out the following resources:

- [Defining Cobalt Strike Reflective Loader](https://securityintelligence.com/x-force/defining-cobalt-strike-reflective-loader/)
- [magic_mz_x86 and magic_mz_x64](https://www.redteam.cafe/red-team/shellcode-injection/magic_mz_x86-and-magic_mz_x64)
- [PE and Memory Indicators](https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/malleable-c2-extend_pe-memory-indicators.htm)
- [Revisiting the User-Defined Reflective Loader Part 1: Simplifying Development](https://www.cobaltstrike.com/blog/revisiting-the-udrl-part-1-simplifying-development)
- [An Introduction into Sleep Obfuscation](https://dtsec.us/2023-04-24-Sleep/)
- [GregsBestFriend - Tool designed to bypass AV/EDR systems](https://github.com/WKL-Sec/GregsBestFriend)
- [Unleashing the Unseen: Harnessing the Power of Cobalt Strike Profiles for EDR Evasion](https://whiteknightlabs.com/2023/05/23/unleashing-the-unseen-harnessing-the-power-of-cobalt-strike-profiles-for-edr-evasion/)
- [Cobalt Strike and YARA: Can I Have Your Signature?](https://www.cobaltstrike.com/blog/cobalt-strike-and-yara-can-i-have-your-signature)
- [Advanced Module Stomping & Heap/Stack Encryption](https://labs.cognisys.group/posts/Advanced-Module-Stomping-and-Heap-Stack-Encryption/)
- [Memory Encryption/Decryption with SystemFunction033](https://medium.com/@s12deff/memory-encryption-decryption-with-systemfunction033-2c391bc2bd89)
- [sRDI - Shellcode Reflective DLL Injection](https://github.com/waldo-irc/YouMayPasser/tree/master/sRDI-master)

## Conclusion

To summarize and in my personal opinion, I can say that it's one of the best certifications I've done. Additionally, its price is very affordable (€500 in total) compared to the knowledge you gain. If you've always wanted to be a hacker but the AV prevents you, CRTL will be very helpful.

## Farewell

Alright, see you later.
