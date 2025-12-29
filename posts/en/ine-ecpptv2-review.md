---
id: "ine-ecpptv2-review"
title: "eCPPTv2 Review - eLearnSecurity Certified Professional Penetration Tester 2021"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-12-09
image: "https://cdn.deephacking.tech/i/posts/ine-ecpptv2-review/ine-ecpptv2-review-0.webp"
description: "Complete review of INE Security's eCPPTv2 certification: advanced pentesting course, complex labs, pivoting exam, and my experience obtaining the certification."
categories:
  - "certifications"
draft: false
featured: false
lang: "en"
---

I have been a bit absent these last few days because I was taking the eCPPTv2. Yesterday I submitted the report and...

![eCPPTv2 Certificate INE Security](https://cdn.deephacking.tech/i/posts/ine-ecpptv2-review/ine-ecpptv2-review-1.avif)

Passed! So now I can share a review of this certification.

Before anything else, I will follow a structure similar to my eJPT review:

- [Context](#context)
- [Is it worth it?](#is-it-worth-it)
- [How hard is it?](#how-hard-is-it)
- [What do I need to know?](#what-do-i-need-to-know)
- [What's the exam like?](#whats-the-exam-like)
- [Tips](#tips)
- [Cheatsheet, 100% guaranteed, not fake](#cheatsheet-100-guaranteed-not-fake)

## Context

The eCPPTv2, or eLearnSecurity Certified Professional Penetration Tester, is the next step after the eJPT. What the OSCP is for Offensive Security, the eCPPT is for eLearnSecurity. It is a 100% hands-on certification that, according to eLearnSecurity, covers the following topics:

- Penetration testing processes and methodologies, against Windows and Linux targets
- Vulnerability assessment of networks
- Vulnerability assessment of web applications
- Advanced exploitation with Metasploit
- Performing attacks with pivoting
- Manual web application exploitation
- Information gathering and reconnaissance
- Scanning and profiling the target
- Privilege escalation and persistence
- Exploit development
- Advanced reporting skills and remediation

## Is it worth it?

I think it is. Besides being a nice plus for your resume, the certification itself is very engaging. You touch on several areas that I will mention later, and you work in a fairly complete lab where you will need to carry out web attacks, system attacks, buffer overflows, and privilege escalation. It is a very cool certification.

## How hard is it?

Personally, I would say it is not easy or trivial. The certification requires a base of knowledge, and if you do not have it you will not be able to pass. Mostly because you will not be able to make progress during the exam. For someone who has just started and only recently passed the eJPT, this certification can feel like a whole different world. The baseline the eCPPT expects is far beyond what the eJPT demands.

That said, if you know the topics well and have a reasonably solid foundation, you will not only be able to hold your own during the exam, you will also grow and improve through the process.

## What do I need to know?

From my perspective, what you should know to successfully tackle the exam is the following:

- Pivoting and port forwarding in both Windows and Linux
- Enumeration from machines that are not your own, compiled statically when needed
- Post-exploitation enumeration on Windows and Linux systems
- Persistence in Windows
- Privilege escalation
- Common web attacks
- Common Windows attacks
- Buffer overflow

On top of that, it helps to know some post-exploitation enumeration modules in Metasploit.

Pivoting is absolutely critical. You cannot pass the exam if you do not know how to do it. You need to understand how it works and know how to use the right tools when needed. Knowing how to work with socat and chisel is enough, with those you can do everything you need. Even so, it is also useful to know how to use proxychains or netsh. The minimum you must know is chisel and socat. For all of these tools you have posts here on the blog. In short, without pivoting you are out of luck.

Beyond that, you should know how to enumerate at the web level, not just fuzzing, common web attacks, enumeration on Linux and Windows systems, and privilege escalation. All of these are essential for the exam. Tools like CrackMapExec, psexec, or mimikatz will serve you very well. Knowing how to expose internal ports with netsh, understanding what the LocalAccountTokenFilterPolicy is and how it can affect you, all of these details add up and make your life easier.

Lastly, and no less important, the good old buffer overflow. Being able to perform a buffer overflow is indispensable. The one that appears in the exam is similar to the one in the old OSCP, that is, without protections and 32 bit. The most basic one. If you know how to do the same as in this [SLMail post](https://blog.deephacking.tech/en/posts/buffer-overflow-in-slmail/), you are in good shape. For the exam, have a Windows 7 32 bit VM ready with Immunity Debugger and Mona.

## What's the exam like?

When you begin the certification you essentially receive two things. One is the letter of engagement, which explains how the exam works, its objective, and things to keep in mind for the lab and the report. It gives you the context you need.

The second is the VPN to connect to the lab. Important, before you start, define and verify your VPN credentials. You can edit them at the top right of the eLearnSecurity website.

![eCPPTv2 lab VPN settings](https://cdn.deephacking.tech/i/posts/ine-ecpptv2-review/ine-ecpptv2-review-2.avif)

I mention this because I started and powered on the lab, and when I realized it, I did not have the credentials I had used when I did the eJPT. I had to spend a lab reset.

On that note, you can reset the lab up to four times per day, that is the limit.

The exam lasts 14 days. You get 7 days for the lab and another 7 days to write the report. You do not have to follow that strictly, if you finish both the exam and the report in four days, you can submit it. I started the exam on the 3rd, submitted the report on the 8th, and luckily they took less than a day to grade it. eLearnSecurity states it can take up to 30 business days, although it is usually much less.

Do not forget that eLearnSecurity does not prohibit any tools in their exams, you can use whatever you want.

Regarding how long the exam takes, I think a full weekend is enough time for the practical part. I started on Friday at 6 pm and by Monday morning I had everything ready, and I was out most of Sunday. From Monday to Wednesday, taking it more calmly, I wrote the report.

For the report you can use a template. I used TheMayor's template, which you can download from [TheMayor's Pentesting Notes](https://themayor.notion.site/themayor/Pentesting-Notes-9c46a29fdead4d1880c70bfafa8d453a). There is also TCM's template, available on [TCM Security's GitHub repository](https://github.com/hmaverickadams/TCM-Security-Sample-Pentest-Report). Or you can write it from scratch, up to you.

For context, my experience writing reports was zero, literally this is the first one I have written. If you are in the same situation, do not worry. Follow a template a bit, add your touch, and structure it the way you think is best, you will be fine.

For the report, remember to take screenshots of every procedure and command you execute. It is better to have extra explanations and screenshots than to fall short. For example, as I worked through the exam I took screenshots and pasted them into a Word document with a short description to identify them quickly. When you have two pages it is easy, when you have 30 it is harder.

As a data point, my final report was 65 pages. Do not take that as a benchmark or think that fewer pages is worse, not at all. A friend of mine submitted about 47 pages and it was also fine.

## Tips

A couple of tips. I would create persistence on every machine you can. Not because the exam requires it, but for your own convenience. Being able to access a machine without re-exploiting the vulnerability is very comfortable, especially in an exam that spans several days and means you will sometimes power off your PC.

Also, save your initial nmap scan results when you first analyze a machine. That way you do not need to reset the lab just to capture the default open ports, as I did, ha.

Other than that, not much more. Have the knowledge mentioned above and go in motivated.

## Cheatsheet, 100% guaranteed, not fake

If you are taking the exam and get stuck, just remember this:

![Motivational eCPPTv2 cheatsheet](https://cdn.deephacking.tech/i/posts/ine-ecpptv2-review/ine-ecpptv2-review-3.avif)

While I was taking the exam, as I progressed, I realized that everything was often simpler than I thought, so I wrote this on a piece of paper. Remember that this is not a CTF, things are not that convoluted. That does not mean they are easy, they are just not overly contrived.
