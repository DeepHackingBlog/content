---
id: "zeropointsecurity-crto-review"
title: "CRTO Review - Red Team Ops 2024"
author: "victor-capatina"
publishedDate: 2024-10-01
updatedDate: 2024-10-01
image: "https://cdn.deephacking.tech/i/posts/zeropointsecurity-crto-review/zeropointsecurity-crto-review-0.webp"
description: "Complete review of the CRTO (Certified Red Team Operator) certification, including syllabus, practical labs, exam tips, and recommendations to pass."
categories:
  - "certifications"
draft: false
featured: false
lang: "en"
---

Good afternoon everyone. As you well know, my posts are direct, concise but informative. (Almost) nobody cares about an introduction that looks like the Bible talking about what I had for lunch today.

Today we're going to talk about the Certified Red Team Operator (A.K.A CRTO). Without a doubt, one of the most recognized Red Teaming certifications in the sector.

- [What is it about?](#what-is-it-about)
- [Practical Part](#practical-part)
- [Is it worth it?](#is-it-worth-it)
- [Exam](#exam)
- [Recommendations for the certification](#recommendations-for-the-certification)

## What is it about?

According to the official syllabus, these are the topics that will be covered during the course:

<div class="grid grid-cols-2 gap-4">
<div>

- Command & Control
- External Reconnaissance
- Initial Compromise
- Host Reconnaissance
- Host Persistence
- Host Privilege Escalation
- Initial Compromise (Reprised)
- Credential Theft
- Password Cracking Tips & Tricks
- Domain Reconnaissance
- User Impersonation
- Lateral Movement
- Session Passing
- Data Protection API

</div>
<div>

- Kerberos
- Pivoting
- Active Directory Certificate Services
- Group Policy
- MS SQL Servers
- Microsoft Configuration Manager
- Domain Dominance
- Forest & Domain Trusts
- Local Administrator Password Solution
- Microsoft Defender Antivirus
- Application Whitelisting
- Data Hunting & Exfiltration
- Extending Cobalt Strike

</div>
</div>

![Complete CRTO course syllabus](https://cdn.deephacking.tech/i/posts/zeropointsecurity-crto-review/zeropointsecurity-crto-review-1.avif)

But don't worry, Uncle Victor is here to simplify it for you: The most important thing is that you're going to learn to use Cobalt Strike in a basic way while diving into the world of Active Directory, establishing persistence, MSSQL attacks, Windows credentials, and antivirus evasion (thanks to different options built into Cobalt Strike).

One of the things I've definitely loved about this course is that it's very well structured. The content is taught gradually. This isn't OffSec that tells you 1+1 = 2 in chapter 1 and then asks you what Mary's dad's name is if she's 12 years old and wearing a red dress. This way, you'll be able to apply the contents/concepts you've learned previously.

## Practical Part

The labs are a faithful copy of the theory. Everything you need to know is in the course material. On the other hand, they are labs integrated into the browser (using Guacamole), so their stability and fluidity isn't the best. Don't hesitate to put everything you learn into practice, seriously. You're going to need it.

One very good thing about this course (the next one a little less, [the CRTL](/en/posts/zeropointsecurity-crtl-review/)) is that the labs are a faithful copy of the theoretical material. You're going to have to start from scratch, setting up Cobalt Strike configuration, its profile, configuring it, etc. Additionally, you're going to have direct access to all the lab machines (including the attacker's, obviously) where you'll be able to do whatever you want, such as modifying X policy or Y permission. Once you have everything configured, it's time to exploit! Be prepared, because you're going to learn to abuse [Kerberos](/en/posts/humble-attempt-to-explain-kerberos/) (and its delegations), SQL servers, [domain trusts](/en/posts/trusts-confianzas-active-directory/) and much, much more! Without a doubt, it's a super practical and complete experience if you haven't fought much with Active Directory before.

That said, it's worth noting that the lab is not included and must be paid for by the hour, this wasn't always the case and may change, so I'll leave you the [official Red Team Ops lab extension link](https://training.zeropointsecurity.co.uk/pages/red-team-ops-lab-extension) where you'll always have it updated.

## Is it worth it?

Short and Clear: Yes. If you're interested in red teaming and Active Directory, for approximately 500€ you're going to learn a TON of things that are VERY APPLICABLE IN REAL LIFE. Later, if you want to continue delving into the subject, you have the continuation of the CRTO: The [CRTL](/en/posts/zeropointsecurity-crtl-review/). In short, there you'll learn advanced EDR and Cobalt Strike evasion techniques.

## Exam

For obvious reasons I can't talk about explicit topics from the [official Red Team Ops exam](https://training.zeropointsecurity.co.uk/pages/red-team-ops-exam). But what I can tell you is that EVERYTHING YOU NEED TO PASS IT IS IN THE COURSE. They won't ask you anything they haven't taught you before. Additionally, you have 48 hours spread over 4 days to get 6/8 necessary flags, so there's plenty of time.

My personal recommendation is that as soon as you start the exam, take your time to make sure 100% of your techniques to evade Defender work.

## Recommendations for the certification

Put everything you learn into practice. Don't fall into tutorial hell (just watching theory without applying practice). If you don't understand something, always ask people on the [Zero-Point Security Discord server](https://discord.gg/Whz3YtY4gG) (or even better, the [Deep Hacking Discord server](https://discord.com/invite/TVcDmHduAm)).

Personally, what I do is read the entire course and take notes on ABSOLUTELY EVERYTHING (I almost copy the course content but in my own words and in Spanish). Then, I start again but doing the practical part while perfecting the notes I take. When I have the notes ready, I separate them by categories. For example: Kerberos, AV evasion, SQL Attacks, Persistence, etc.

If you have little time, you can activate the antivirus as soon as you start the lab (by default it's disabled), so you practice not only the attacks you do but also evasion techniques and acquire that OPSEC mindset that's talked about so much.

Once you feel comfortable in the labs and understand everything you do, you'll be ready for the exam.

* * *

And that's basically everything I have to say about the CRTO. In summary, a highly recommended certification if you're interested in red teaming and Active Directory.
