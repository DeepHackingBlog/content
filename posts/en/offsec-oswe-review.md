---
id: "offsec-oswe-review"
title: "OSWE Review - Offensive Security Web Expert 2023"
author: "{REDACTED}"
publishedDate: 2023-02-08
image: "https://cdn.deephacking.tech/i/posts/offsec-oswe-review/offsec-oswe-review-0.webp"
description: "Complete review of OffSec's OSWE certification: advanced web security course, code analysis, whitebox exam, and my experience obtaining the certification."
categories: 
  - "certifications"
draft: false
featured: false
lang: "en"
---

Hello everyone! In this post I’ll be talking about the OSWE, which is perhaps the certification I was most excited to obtain. I’ll share my personal experience, tips and advice on how to tackle it, and I’ll answer questions I asked myself at the time that I think can be useful for anyone planning to take the certification in the future.

- [What is OSWE?](#what-is-oswe)
- [Prerequisites](#prerequisites)
- [Course opinion](#course-opinion)
- [Labs](#labs)
- [The exam](#the-exam)
- [Exam tips](#exam-tips)
- [Questions and answers](#questions-and-answers)
- [Additional resources](#additional-resources)

## What is OSWE?

OSWE stands for [Offensive Security Web Expert](https://www.offensive-security.com/courses/web-300/), and it is Offensive Security’s most advanced web pentesting certification. It is one of the three certifications required to aim for OSCE3, alongside OSEP and OSED.

What makes this certification unique is its white-box approach, which sets it apart from others in the same track, such as [BSCP](https://portswigger.net/web-security/certification), [eWPT](https://elearnsecurity.com/product/ewpt-certification/), [eWPTXv2](https://elearnsecurity.com/product/ewptxv2-certification/), or the recent [CBBH](https://academy.hackthebox.com/preview/certifications/htb-certified-bug-bounty-hunter/).

So, what is a white-box approach? It means penetration testing where the attacker has full access to the application’s source code, the databases, and the entire system. Why? To try to identify security issues from both internal and external perspectives.

The problem is that these applications are generally very large and contain a lot of source code, which can make it hard for an attacker to find vulnerabilities if they are not prepared. That is where OSWE comes in, aiming to teach the methodology to follow in this type of engagement, and how to find and exploit vulnerabilities. However, as mentioned at the beginning, this is an advanced course, and there are a series of prerequisites I think you should keep in mind before signing up.

## Prerequisites

##### Languages and frameworks

Since the approach is white-box, we need to get comfortable reading source code in different languages and frameworks. This is key, because many times we know how to exploit certain vulnerabilities, but the difficulty lies in finding them. John Hammond described his OSWE experience as “trying to find a needle in a haystack.”

Don’t get discouraged. Like many of you, I have zero experience as a developer, and I still managed to pass the certification with the maximum score, so I’m sure you can too. So, which languages or frameworks should you get familiar with?

- The course covers five languages: Java, PHP, Python, NodeJS (JavaScript), and C#.

- Frameworks I recommend touching: Spring and Hibernate (Java), Laravel and Symfony (PHP), Flask and Django (Python), Express (NodeJS), and .NET (C#).

I know it’s a lot of languages and frameworks, and you might be thinking this is complicated, but I’ll say it again, don’t get discouraged. You don’t need to master these frameworks, simply get familiar with their structure and syntax, nothing more, so you can tell when a certain piece of code might be vulnerable or not. And how can you do that? Without a doubt, the best site I can recommend is [Secure Code Warrior](https://www.securecodewarrior.com/).

On this site you can create an account, if it mentions a 14-day free trial just ignore it, then select a language you want to practice. The most interesting part is the “challenges”, where you get a project in that language with several code sections marked with a triangle. The goal is to identify which of these code sections contains the vulnerability to find.

For example, in this case the goal is to find an SQL injection:

![SQLi challenge example in Secure Code Warrior](https://cdn.deephacking.tech/i/posts/offsec-oswe-review/offsec-oswe-review-1.avif)

And in one of these files marked with a triangle, there is supposed to be a piece of code vulnerable to SQL injection.

![SQLi vulnerable code highlighted](https://cdn.deephacking.tech/i/posts/offsec-oswe-review/offsec-oswe-review-2.avif)

Your goal is to identify it, then you will be given four possible remediations and you will have to choose the most appropriate one to mitigate that vulnerability.

I believe this site was key to speeding up my source code reading, and especially to identify at a glance, more or less, which pieces of code might be vulnerable and which are not.

Another tip I would give you is to build small projects with a framework to better understand how they work, and how developers tend to think when programming. There are hundreds of articles online, YouTube tutorials, or Twitch streamers who show how they develop in a given framework.

Additionally, I recently decided to try HackTheBox’s web “challenges”, not the machines, and they are actually very good, because in some of them you are given the source code along with the challenge, so you can try to solve it from a white-box perspective. Highly recommended.

##### MVC model

Because you will be reading a lot of code, it is important to understand how a project is usually structured. That way, you’ll know where to look when you want to search for a certain type of vulnerability. The course briefly discusses what [MVC](https://www.google.com/search?q=modelo+mvc) is, but I highly recommend you research it a bit more and see how it is typically applied in real projects, or in the ones Secure Code Warrior provides in the challenges, for example.

![MVC model diagram](https://cdn.deephacking.tech/i/posts/offsec-oswe-review/offsec-oswe-review-3.avif)

##### Python scripting

An important aspect of OSWE is that it’s not enough to just exploit vulnerabilities, you must also provide a proof-of-concept script that, by simply running it, executes and chains all vulnerabilities to obtain a reverse shell.

The script, as long as it works, can be in any language of your choice, but my personal recommendation, and Offensive Security’s, is that you choose Python, due to its minimal syntax and the wealth of libraries available, which can make your job much easier in many situations.

There are no secrets to improving your scripting skills, the only thing to do is practice a lot. However, I can tell you which libraries you should practice with:

- requests, argparse, os, re, threading, http.server, pwn, urllib.parse, sys, subprocess, string, random, base64, time, pdb, json, bs4

You can also learn to use Flask, since it might come in handy in some situations.

## Course opinion

According to Offensive Security, this is everything covered in the OSWE course, known as AWAE.

- Cross-Origin Resource Sharing (CORS) with CSRF and RCE
- JavaScript Prototype Pollution
- Advanced Server-Side Request Forgery (SSRF)
- Web security tools and methodologies
- Source code analysis
- Persistent cross-site scripting
- Session hijacking
- .NET deserialization
- Remote code execution
- Blind SQL injection
- Data exfiltration
- Bypassing file upload restrictions and file extension filters
- PHP type juggling with loose comparisons
- PostgreSQL Extension and User Defined Functions
- Bypassing REGEX restrictions
- Magic hashes
- Bypassing character restrictions
- UDF reverse shells
- PostgreSQL large objects
- DOM-based cross-site scripting, black box
- Server-side template injection
- Weak random token generation
- XML external entity injection
- RCE via database functions
- OS command injection via WebSockets, black box

Personally, I can tell you that I liked the course. The techniques taught, the methodology followed, and the depth with which most concepts are covered were the aspects I liked the most. Above all, how they teach you that combining multiple vulnerabilities, which on their own may seem harmless, can result in much greater damage and, in many cases, remote code execution.

In addition, many of the vulnerabilities taught come from real cases found by the Offensive Security team and others. This adds a lot of realism, because you realize that everything they teach is applicable to the real world.

## Labs

For each module taught in the course, there is a corresponding lab so you can practice. My recommendation is to let yourself be guided at first, to learn the methodology of how to proceed, and if you want to keep practicing, do the extra miles. Naturally, the following question comes up:

What are the extra miles?

They are exercises that go a bit further and do not have a public solution. They are good to test yourself, and to experience that feeling of getting stuck and hitting a wall, and to learn to develop your methodology to get out of that rut. Although Offensive Security does not provide the solution to these exercises, they do provide a forum where students can exchange ideas and get guidance. I also highly recommend joining Offensive Security’s official Discord server and requesting the role corresponding to your course, in this case web-300, so you can interact with other students going through the same thing.

Additionally, there are three extra labs that are not covered in the course and whose solutions are not public either. I recommend saving these for the end, and using them as a test to see if you are really ready to face the exam. Try to solve these labs without any help. If you manage to do so, you are likely ready for the exam, if not, then you know you still have aspects to improve. Do not forget that once you complete the lab, you should fully automate it in a Python script, because you will be asked to do this in the exam.

Personally, I did not do all the extra miles, because I felt some were redundant or would not add much for me, since they were things I already knew how to do. But I did some, I would say around 60% to 70% of the total, more or less.  
As for the extra labs, two are white-box and one is black-box, but in the latter, once you solve it, you can extract the source code and redo it from a white-box approach to keep finding more vulnerabilities. Personally, I did the two white-box labs without help, and that gave me confidence to take the exam right away and not have to do the third lab I had left.

## The exam

After almost three months from starting the course, I decided to sit the exam. You have 48 hours to compromise the exam lab put in front of you and 24 hours to write the corresponding report.

Offensive Security does not allow sharing much information about the exam itself, so I will not get into details. Looking back after finishing, I can say it was quite manageable if you have done the course and worked properly during these months. That said, when you are in the exam itself, given that it is proctored, meaning someone is watching you, the nerves, not finding what you need to find, or just things not working out, can make you have a rough time, which happened to me.

You can access the exam portal 15 minutes early to do the whole proctoring process, meaning verify your identity, ensure there is no one else in your room, among other things. Once all the checks were done, I received the email with all the exam information and I got to work.

The first eight hours went very well, I had made notable progress and felt very comfortable. Around the ninth hour, things started to get complicated, because I could not find what I needed to find.

I recommend that in these cases you take a break, you can take as many breaks as you want, as long as you notify the proctor, go for a walk and clear your mind. Often the solution is right in front of us, but by overthinking we can overlook certain things. And as I said before, if you have studied the course and done the labs, you are capable of passing the exam.

From hour nine to hour nineteen I did not progress much in terms of points, but that is okay, there was still plenty of time. From there, everything started to flow, to run smoothly, and about 12 hours later I already had the 85 points required to be eligible to pass the exam. Indeed, to obtain your OSWE certificate, you need at least 85 out of 100 possible points, and around hour 32 I had already reached them.

From then on I relaxed a lot, and after making sure I had enough screenshots for the report and that my scripts worked without issues, I decided to go for the full 100 points. I asked to finish the exam at hour 38, because I was very tired, even though I still had 10 hours left.

During my exam, even though I tried to sleep, I did not manage to sleep much due to the amount of caffeine I had consumed. In total I slept around 6 to 7 hours in those 38 hours, which is not much. Therefore, as soon as I finished the exam, I went to sleep for a few hours, because it was not over. I still had the tedious part of writing a good report, with all the details required to obtain the certification. Offensive Security is very strict in this regard, so it is better to write a very detailed report, with all the steps you took, and with enough screenshots to complement the explanation. In total, my report ended up at 71 pages, in case you want a reference, but I can tell you that number does not matter at all. Whether shorter or longer, what matters is that it contains what Offensive Security asks for as requirements and objectives.

## Exam tips

After sharing my experience, I want to highlight some important tips for the exam:

- Do not give up. Forty-eight hours is a lot of time, and even if things do not work at first, be patient and persevere. There are cases where people did not find anything in the first 24 hours, and only afterward did they start to make progress.

- Stay relaxed. Treat it like just another CTF, and do not overthink things.

- Disconnect from the certification a few days before the exam. This is a personal recommendation. In general, before any exam I like to clear my mind and not think about the test.

- Whenever you are stuck for a long time, take breaks. Personally, I took around 10 to 15 breaks during the exam, I would go for a walk and that allowed my brain to process things and come up with new ideas or things to try.

- The exam is based on the course. You may have to apply the famous “TRY HARDER” to get some things, but remember the exam is there to evaluate your knowledge of the course.

- If you find something that looks suspicious, write it down somewhere, then keep exploring the code. This prevents you from wasting too much time on something that might not lead anywhere. That said, if you are good at reading source code, at a glance you should know whether something might be vulnerable or not. But I understand that exam nerves can play tricks on you.

- Have good notes. I used to be someone who did not think notes were important, but believe me, having well-organized notes with prepared modular functions can save you a lot of time in the exam. I did not do it because I thought I could manage during the exam, but the best approach is to have them.

## Questions and answers

In this section I will answer questions I had while preparing for the certification, as well as questions from other people.

- Is it necessary to get the OSCP before signing up for OSWE?
    - No, it is not. I do not have OSCP at the moment, I felt it was not the certification I most wanted to do, and I decided to go straight for OSWE.

- What was the minimum number of hours per day you put in?
    - I do not have work experience as a developer or as a pentester, and I am still quite new to web hacking. Therefore, I put in a lot of hours into understanding the different frameworks and languages, some I had never used, understanding the course and practicing it, streaming on Twitch and practicing there. I did not keep exact track, but I would say I averaged about four to five hours a day for three months. Understand that it was not all focused on the certification. I am a very curious person and I like to understand the why behind things, and many times I went down rabbit holes to understand specific topics.

- How long had you been in the field, and after how long did you decide to go for OSWE?
    - At the time, I had been in the field for one year and one month, and I decided to enroll in the course when I had been in the sector for nine to ten months. In web hacking, my only background was some PortSwigger labs and HTB machines.

- Is it necessary to do all the extra miles?
    - It is not necessary, but you should know how to choose which ones to do. Some are useful and help a lot, others not so much. The more you do, the better, but if you do not want to do them all, as I said, you need to choose wisely.

- Is it necessary to do the entire course and labs?
    - My recommendation is yes. Complete the course from A to Z, because anything included in it can appear in the exam. As for the extra labs, as I said, save them for the end as a challenge, and do them without any help. If you manage to complete them, it is a good sign that you can start thinking about taking the exam.

- eWPTXv2 vs OSWE?
    - Even though both certifications are about web security, the approach is different. eWPTXv2 is black-box while OSWE is white-box. I believe the latter is more complex, because the course goes into more detail about vulnerabilities, you are required to automate everything in Python, and in general it is harder to read code for hours than to try payloads to see if any work. Overall, I liked OSWE much more.

## Additional resources

Here are some additional resources that may be useful. I highlight Maiky’s gitbook, which includes explanations of many of the vulnerabilities you will see in the course, and bmdyy’s labs, which you can use to practice a bit more, there are about three or four focused on web and that you can use to prepare for OSWE. The advantage of these labs is that they have Python solutions, which can be useful to see how to script or automate certain vulnerabilities.

- [Sonar Source Code Challenges](https://www.sonarsource.com/knowledge/code-challenges/advent-calendar-2022/)
- [Maiky’s GitBook](https://maikypedia.gitbook.io/oswe-awae/)
- [bmdyy’s labs](https://github.com/bmdyy?tab=repositories)
- [AWAE prep blog, XSS to RCE](https://sarthaksaini.com/2019/awae/xss-rce.html)
- [HTB WEB challenges](https://app.hackthebox.com/challenges/retired), do them from a white-box perspective
- [AWAE-PREP repository](https://github.com/wetw0rk/AWAE-PREP)

And that is all for today. I sincerely hope you enjoyed this review and that it was useful to you.
