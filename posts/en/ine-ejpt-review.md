---
id: "ine-ejpt-review"
title: "eJPT Review - eLearnSecurity Junior Penetration Tester 2021"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-06-14
image: "https://cdn.deephacking.tech/i/posts/ine-ejpt-review/ine-ejpt-review-0.webp"
description: "Complete review of INE Security's eJPT certification: beginner-friendly course, study materials, hands-on exam, and my experience as a Junior Penetration Tester."
categories:
  - "certifications"
draft: false
featured: false
lang: "en"
---

> This review is deprecated due to the release of the second version of this certification, the [eJPTv2](https://ine.com/learning/certifications/internal/elearnsecurity-junior-penetration-tester-v2).

Two weeks ago I sat the eJPT and passed. I wanted to share what I thought of the certification and write a review since I often see people with doubts about it, just like I had before taking it. I'll try to cover things like:

- How hard is it?
- What do I need to know?
- Is it worth it?
- What's the exam like?

I'll try to answer all these questions for those who are planning to take the certification or are still deciding.

- [Context](#context)
- [Is it worth it?](#is-it-worth-it)
- [How hard is it?](#how-hard-is-it)
- [What do I need to know?](#what-do-i-need-to-know)
- [What's the exam like?](#whats-the-exam-like)
- [Tips](#tips)
- [Conclusion](#conclusion)

## Context

Before anything else, some context. The **eJPT**, or **eLearnSecurity Junior Penetration Tester**, is an eLearnSecurity certification aimed at people who want to start a career in cybersecurity focused on penetration testing. It's a 100% hands-on certification that, according to eLearnSecurity, covers the following topics:

- TCP/IP
- IP routing
- LAN protocols and devices
- HTTP and web technologies
- Essential penetration testing processes and methodologies
- Basic network vulnerability assessment
- Basic web application vulnerability assessment
- Exploitation with Metasploit
- Simple manual web application exploitation
- Basic information gathering and reconnaissance
- Simple scanning and target profiling

## Is it worth it?

I'd say it depends. If you're a beginner who doesn't know much yet and wants to get into this field, it's a great certification to start with because it covers the essentials. If you already have some experience, for example by practicing on platforms like TryHackMe or HackTheBox, you may find the certification fairly easy.

In my case, before taking it I had completed quite a few TryHackMe machines, and I had watched almost all of s4vitar's Twitch streams for the last three months. So the basic methodology of a penetration test was fairly clear to me, although that's something you always refine over time.

I also did the official course recommended by eLearnSecurity for the eJPT by INE. It's completely free if you sign up with the Starter Pass (a quick Google search will get you there). If you're just starting out, I highly recommend it because it covers everything from scratch.

From an exploitation standpoint the exam is very basic. What I noticed and improved the most thanks to the exam and the course labs was enumeration. On platforms like THM or HTB we're used to having a single machine and enumerating only that one, and we already know the machine's IP.

That's not the case in the eJPT. In the certification you connect via VPN to a network where the only thing you know is the network IP, inferred from the IP you're assigned when you connect. From there, you don't know anything else, so you not only improve host discovery, you also learn to deal with several machines at once. When you face seven machines instead of just one, the change is huge. That was one of my favorite parts of the certification. It really helped me improve in that area.

Back to whether it's worth it: if you're a beginner, yes, I recommend it 100%. If you already have some experience, it depends on your goals. If you want to improve enumeration, get your first certification, and get a feel for how eLearnSecurity works, I'd also recommend it. Just go in knowing there will be very little exploitation.

## How hard is it?

As I hinted above, the exploitation side is not hard at all, it's very basic in that respect. If you know XSS, SQLi, and some basic Windows exploitation, you'll be fine. If you're not used to enumerating, that can be the hardest part and feel overwhelming since it's not just one machine, but it's manageable. Besides enumeration and exploitation, the rest are basic skills you should know, we'll see them now.

## What do I need to know?

The topics you should be comfortable with to tackle the certification successfully are:

- Host discovery
- Port discovery
- Manual routing (ip route)
- Service brute forcing
- Hash brute forcing
- Fuzzing
- Basic exploitation, Windows or Linux, no privilege escalation required
- XSS
- SQLi
- Wireshark
- Basic networking knowledge

## What's the exam like?

Lastly, I'd like to give a few tips for the exam and briefly explain its structure. I won't spoil anything, that's not the goal.

The certification consists of a 20-question multiple-choice exam with four possible options per question, some are multiple-answer, based on practical tasks. For example, if they ask for user Pepito's password, you obviously have to find it, so the exam is 100% hands-on in an environment that can include both Windows and Linux machines. You have three full days to answer and submit the multiple-choice exam.

You can easily complete the exam in three to eight hours. It's straightforward to finish on the first day, and three days is more than enough time to complete it calmly.

In this certification, and in eLearnSecurity's certifications in general, no tool is prohibited. You can use SQLMap, Metasploit, or whatever you want, and the exam is not proctored, no one monitors you while you take it.

That's basically the structure of the exam.

## Tips

As for tips, I'd say take it easy. You have three days and two chances to submit the multiple-choice exam, and the questions are simple.

I'd also highlight understanding how routing and routing tables work. Try building a lab with three Linux machines and two networks, make machine 1 use machine 2 as a router to communicate with machine 3 and vice versa, and capture traffic with Wireshark. Try to understand how packets are handled, it helps a lot.

Perform the same step in different ways. For example, when you do host discovery, verify with at least two different approaches so you don't miss anything.

Don't crank up packet rates when using nmap. Use a T4 or T5 timing at most, and avoid setting a min-rate, otherwise you might miss some ports.

Stay organized. This isn't one machine like you might be used to. There are several machines, so keep your workspace and information tidy.

Work based on what the questions ask. It's the most comfortable way to proceed.

This isn't a CTF. Many things are likely simpler than you think.

And the most important tip, enjoy learning.

## Conclusion

That's everything I would have liked to know before the exam, I hope it helps. If you need anything or want to ask me something, you can reach me on [LinkedIn](https://www.linkedin.com/in/juanantonio-gonzalez/) or [Twitter](https://twitter.com/sikumy). If after reading this you decide to take it or not, that's fine. If you do take it, good luck, you'll crush it.

**Happy Hacking!**
