---
id: "htb-cwes-review"
title: "CWES Review - HackTheBox Certified Web Exploitation Specialist 2025"
author: "daniel-moreno"
publishedDate: 2025-11-05
updatedDate: 2025-11-05
image: "https://cdn.deephacking.tech/i/posts/htb-cwes-review/htb-cwes-review-0.webp"
description: "Complete review of HackTheBox's CWES certification: preparation, exam, comparison with eWPTX and BSCP, and tips to pass."
categories:
  - "certifications"
draft: false
featured: false
lang: "en"
---

Hey there! How's everything going? I'm **eldeim**, that's my hacker name, but my name is **Dani**.

Today I bring you a really juicy review about how I prepared for and passed the **CWES (Web Exploitation Specialist)** certification. Lately it's been gaining a lot of weight in the market for being from **HackTheBox (HTB)**, and many compare it with other certifications like **eWPTX** or **BSCP**.

![CWES certification cover](https://cdn.deephacking.tech/i/posts/htb-cwes-review/htb-cwes-review-1.avif)

- [Context](#context)
- [What is the exam like?](#what-is-the-exam-like)
- [My experience](#my-experience)
- [Tips](#tips)
- [Comparison with other certifications](#comparison-with-other-certifications)
- [Conclusion](#conclusion)

## Context

The [CWES (Web Exploitation Specialist)](https://academy.hackthebox.com/preview/certifications/htb-certified-web-exploitation-specialist), formerly called CBBH (Bug Bounty Hunter) is a practical certification oriented to web application hacking/pentesting for professionals. Lately very recognized in the sector for the 20 topics/modules it covers:

1. Web Requests
2. Introduction to Web Applications
3. Using Web Proxies (Burp Suite, OWASP ZAP)
4. Information Gathering - Web Edition
5. Attacking Web Applications with Ffuf (Enumeration and fuzzing with Ffuf)
6. JavaScript Deobfuscation
7. Cross-Site Scripting (XSS)
8. SQL Injection Fundamentals
9. SQLMap Essentials (Advanced use of SQLMap)
10. Command Injections
11. File Upload Attacks
12. Server-side Attacks (SSRF, SSTI, SSI)
13. Login Brute Forcing (Hydra, Medusa)
14. Broken Authentication
15. Web Attacks (HTTP Verb Tampering, IDOR, XXE)
16. File Inclusion
17. Session Security (Hijacking, fixation, CSRF, XSS, open redirect)
18. Web Service & API Attacks
19. Hacking WordPress
20. Bug Bounty Hunting Process (Methodology and reporting)

There's really no section that leaves anything to be desired, they all have labs to test what you've learned and then final **Skills Assessments** (like a final CTF specific to the module).

![CWES certification modules](https://cdn.deephacking.tech/i/posts/htb-cwes-review/htb-cwes-review-2.avif)

## What is the exam like?

You can start the exam whenever you want, whether you just bought the voucher or you've completed all the modules. It's not a proctored exam, or, in other words, an exam where someone monitors you, you'll simply have a countdown, VPN access, one of their machines, and a panel where you submit all the flags.

![CWES exam panel](https://cdn.deephacking.tech/i/posts/htb-cwes-review/htb-cwes-review-3.avif)

The exam consists of five websites that you must fully compromise, going from access as a low-privileged user to escalation to administrator (both on the web and on the server). You're given seven days to obtain eight of the ten flags and write a report (they provide the template). In reality, this closely resembles a real audit, where you have a week to complete everything.

And yes, for those wondering, all the content is in English and the report is also in English, in my case I had no problem, but I understand that for some people this may be an extra difficulty.

## My experience

The exam is... damn cool, the typical one where you do it, it stings, and then you're glad you dared to start it.

In my case, as advice for people who intend to take the certification, TRYHARD MENTALITY IS VERY IMPORTANT, I did it with 5 white monsters and a total of 18 hours the first day, 16 hours the second, about 10 hours the third, and then (because of work) 8 hours, 6 hours, 6 hours approximately for the remaining days.

> Editor's note (aka. Sikumy): At Deep Hacking we promote taking care of yourself, resting, and drinking lots of water.
> 
> ![Drink water](https://cdn.deephacking.tech/i/posts/htb-cwes-review/htb-cwes-review-4.avif)

Finally, when I finished and submitted it, the countdown stopped and I just had to wait a maximum of 7 business days for them to give me a pass (or fail) on the report, in my case it was 4 days of waiting.

![CWES certification passed](https://cdn.deephacking.tech/i/posts/htb-cwes-review/htb-cwes-review-5.avif)

## Tips

I consider this to be the most important part, the one that guaranteed me passing the certification.

First: take notes, but in an insane way. I copied and pasted important content from the academy, from each of the modules and, above all, I made step-by-step writeups of how I solved the final Skills Assessments! (this is super important: it's where you really see what you learned).

Then, I did the Akerva Fortress making a writeup in real time. For those who don't know it, HTB Fortresses are advanced and realistic hacking labs that simulate complete enterprise environments (they can contain AD, Web, Pivoting...), much larger and more complex than a single CTF machine or a challenge. Making it as close as possible to the exam.

[![HackTheBox Fortress](https://cdn.deephacking.tech/i/posts/htb-cwes-review/htb-cwes-review-6.avif)](https://app.hackthebox.com/fortresses)

Surprisingly, the Fortress has a couple of things that are identical to the certification, so it's SUPER RECOMMENDED.

Finally, I made myself a cheat sheet of what to do/face depending on what I was finding.

![Personal cheat sheet for CWES](https://cdn.deephacking.tech/i/posts/htb-cwes-review/htb-cwes-review-7.avif)

## Comparison with other certifications

Comparing it with the eWPT (which I have) or the eWPTX (whose exam I know very well through friends), I would say that CWES/CBBH is above eWPTX, since in both you chain vulnerabilities to access as administrator. But... HTB is HTB, and they're bastards, so everything is better explained and more "difficult" and realistic.

If you have doubts about which one to do first, definitely go for CWES, since it will cost you very little more compared to eWPT and, in addition, the content is better explained!

![Web certifications comparison](https://cdn.deephacking.tech/i/posts/htb-cwes-review/htb-cwes-review-8.avif)

## Conclusion

So far, it's one of the best certifications I've done. HTB explains everything very clearly and covers almost all possible scenarios. Thanks to this, I finished with a much more solid understanding of both the certification content and my own skills, plus a very rewarding experience and good feedback on the final report.
