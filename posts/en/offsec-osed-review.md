---
id: "offsec-osed-review"
title: "OSED Review - OffSec Exploit Developer 2024"
author: "adrian-diaz-aguilar"
publishedDate: 2024-04-29
updatedDate: 2024-04-29
image: "https://cdn.deephacking.tech/i/posts/offsec-osed-review/offsec-osed-review-0.webp"
description: "Personal experience and complete guide on Offensive Security's OSED certification: prerequisites, course tips, labs, and strategies to pass the exam."
categories:
  - "certifications"
draft: false
featured: false
lang: "en"
---

Welcome everyone! In this post, I'll be talking about my experience with the OSED, a certification that many people initially dismiss because it's about exploiting. I'll share my experience with it, along with some tips that I hope can help you.

![OSED Certificate from Offensive Security](https://cdn.deephacking.tech/i/posts/offsec-osed-review/offsec-osed-review-1.avif)

- [What is the OSED?](#what-is-the-osed)
- [Prerequisites](#prerequisites)
- [How to approach the course](#how-to-approach-the-course)
- [Exercises and Labs](#exercises-and-labs)
- [Exam](#exam)
- [Additional Resources](#additional-resources)

## What is the OSED?

OSED stands for [Offensive Security Exploit Developer](https://www.offsec.com/courses/exp-301/), and it's a certification focused on exploit development in Windows systems. It's required along with [OSEP](https://blog.deephacking.tech/en/posts/offsec-osep-review/) and [OSWE](https://blog.deephacking.tech/en/posts/offsec-oswe-review/) for those who want to obtain the [OSCE³](https://www.offsec.com/certificates/osce3/).

According to Offensive Security, the course teaches the following:

- Learn the fundamentals of reversing
- Create custom exploits
- Develop the skills necessary to bypass security measures
- Write handcrafted Windows shellcode
- Adapt old techniques to more modern versions of Windows

Personally, I believe this is true and that the course content is quite well developed. It has an acceptable progression, although it requires dedicating many hours.

While it's true that it focuses solely on x86 architectures, it broadens the field of exploiting so that people can research and decide if they want to delve deeper into it and, in the future, aspire to obtain the [OSEE](https://www.offsec.com/courses/exp-401/) certification or other forms of exploitation that are present today.

One thing I recommend is, if possible, getting the [Learn One](https://www.offsec.com/products/learn-one/) subscription for this certification. In my case, with 3 months I was very tight on time, even though I was studying most of the day and even skipped some topics that I considered not so important for the exam.

## Prerequisites

Offensive Security recommends the following prerequisites for taking the course:

- Familiarity with debuggers (ImmunityDBG, OllyDBG)
- Familiarity with basic 32-bit exploitation concepts
- Familiarity with writing code in Python 3

Also, although optional, it's recommended to have the following knowledge:

- Ability to read and understand C code at a basic level
- Ability to read and understand 32-bit assembly code at a basic level

However, although I believe these prerequisites are sufficient for the first half of the course, once you advance into [ROP (Return Oriented Programming)](https://en.wikipedia.org/wiki/Return-oriented_programming) and reversing, understanding 32-bit assembly code is no longer optional. You must be as comfortable as possible before taking the course. Additionally, you can save a lot of time in the first topics by completing some of [Corelan's exploit writing tutorials](https://www.corelan.be/index.php/2009/07/19/exploit-writing-tutorial-part-1-stack-based-overflows/).

As with all Offensive Security courses, you're taught everything necessary beyond the recommended prerequisites to pass the exam. However, if you don't have much time to fully understand everything that's explained, it could be difficult to comprehend absolutely everything without doing additional preparation.

## How to approach the course

The course [syllabus](https://www.offsec.com/courses/exp-301/download/syllabus) is as follows:

- WinDbg and x86 Architecture
- Exploiting Stack Overflows
- Exploiting SEH Overflows
- Introduction to IDA Pro
- Overcoming Space Restrictions: Egghunters
- Creating Custom Shellcode
- Reverse Engineering for Bugs
- Stack Overflows and DEP Bypass
- Stack Overflows and ASLR Bypass
- Format String Specifier Attack Part I
- Format String Specifier Attack Part II

It's important to mention that my previous experience in exploiting was quite basic. I only had knowledge about the stack overflow that's covered in the OSCP.

In the field of exploiting, it's crucial to fully understand what you're trying to achieve and be careful not to break the exploit. As I mentioned earlier, things start to get complicated from the ROP topic onward. For me, an explanation I received from my colleague Txhaka at the time was fundamental, as it allowed me to have that "click" and start understanding the why of what was being done. I'd say it's what usually takes the most effort for people who aren't so immersed in these topics, so a lot of practice is required (and crying).

## Exercises and Labs

Throughout the modules, you'll encounter exercises to reinforce the knowledge that has been explained. In addition to the usual exercises, "Extra Miles" are also available. To explain what they consist of, I'll use the answer provided by my colleague Txhaka:

"They are exercises that go a bit further, and don't have a public solution. They're good for testing yourself, and experiencing a bit of that feeling of getting stuck and hitting a wall, and learning to develop your methodology to get out of that stagnation. Although Offensive Security doesn't provide the solution to these exercises, it does make available to students a forum where they can exchange ideas for guidance."

It's also highly recommended that you join the [Offensive Security](https://discord.com/invite/offsec) Discord server and link your Discord in the student portal to gain access to the certification channels and discuss doubts that arise with other students.

While it's true that I didn't complete all the Extra Miles (due to lack of time), my recommendation is to do them and internalize what each thing does so you can perform it in case it comes up in a lab or on the exam.

Subsequently, at the end of the syllabus there are three labs. These are **very, very important** to complete and internalize well. In general, the structure of Offensive Security courses allows you to pass the exam if you've done the exercises and labs, but in this course I'd say it's one of the most important of all.

## Exam

It's worth mentioning that I had to pay for a retake ($249) and passed on the second attempt. The reason I failed was that I decided to end the exam to better prepare myself, although I surely would have had enough time to pass it on the first attempt. However, I prefer to make the most of any certification or course I take, so it doesn't hurt as much to pay for it.

Below, I'll explain the structure of level 300 exams (PEN-300, WEB-300, EXP-301) from Offensive Security.

You have 48 hours to complete the lab and then an additional 24 hours to prepare the report. In case you finish before 48 hours, you can start with the report if you wish, without the examiner putting any impediment. In the case of OSED, the exam consists of three tasks that will test the topics covered during the course, including reversing to discover vulnerabilities, creating exploits that bypass security mitigations, and creating custom shellcode (all of this is taken from the following [post](https://help.offsec.com/hc/en-us/articles/360052977212-EXP-301-Windows-User-Mode-Exploit-Development-OSED-Exam-Guide#section-1-exam-requirements) from Offensive Security). Regarding the number of points needed to pass, a minimum of 60 out of 100 is required.

In both attempts I was quite tight on time, but I noticed I was calmer in the second one. It's highly recommended to take breaks when you deem it necessary, as in this exam it's very easy to get saturated due to the large number of aspects you have to keep in mind. Comparing my experience on the exam with that of other colleagues who have taken it, I can say it's quite common to end up with a significant headache.

During the first 5 hours, I managed to solve the first exercise. However, the ROP topic left me dazed, as I didn't fully master it, along with the very strange gadgets I had gotten. The rest of the hours I was struggling to complete the last part (sleeping perhaps a total of 7 hours over both days), until finally I got the shell and was able to read the flag.

Once I had both exercises completed, I proceeded to reset the machines to verify that both were 100% functional (it's highly recommended to check that everything works correctly against the same host after resetting the lab).

To create the report, I used the pandoc templates found in the following [repository](https://github.com/noraj/OSCP-Exam-Report-Template-Markdown). Personally, I quite like how it looks and the ease of filling in the template.

## Additional Resources

Finally, here are some additional resources that may be useful for the certification:

- [Binary Exploit Development 4 - DEP Bypass with VirtualAlloc](https://www.youtube.com/watch?v=phVz8CqEng8&ab_channel=GuidedHacking)
- [Exploit Development 5 - DEP Bypass with WriteProcessMemory](https://www.youtube.com/watch?v=8kYTDK9oKV8&ab_channel=GuidedHacking)
- [nop's repository](https://github.com/nop-tech/OSED/tree/main)
- [nop's code caver script](https://github.com/nop-tech/code_caver)
- [epi052's script collection](https://github.com/epi052/osed-scripts)
