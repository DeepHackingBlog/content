---
id: "tcm-pnpt-review"
title: "PNPT Review - Practical Network Penetration Tester 2022"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-07-04
image: "https://cdn.deephacking.tech/i/posts/tcm-pnpt-review/tcm-pnpt-review-0.webp"
description: "Complete review of TCM Security's PNPT certification: practical pentesting course, Active Directory, realistic 5-day exam, and my experience obtaining the certification."
categories: 
  - "certifications"
draft: false
featured: false
lang: "en"
---

This past week I sat the famous certification by [CyberMentor](https://www.youtube.com/c/TheCyberMentor), the [PNPT](https://certifications.tcm-sec.com/pnpt/), and I passed 😎🍟

![PNPT certificate from TCM Security](https://cdn.deephacking.tech/i/posts/tcm-pnpt-review/tcm-pnpt-review-1.avif)

So in this post I am going to share what I thought of it and a few details.

- [Context](#context)
- [Exam](#exam)
- [Preparation courses](#preparation-courses)
- [Is it worth it?](#is-it-worth-it)
- [How hard is it?](#how-hard-is-it)
- [What do I need to know?](#what-do-i-need-to-know)
- [Tip](#tip)
- [Conclusion](#conclusion)

## Context

According to the official site, the [PNPT, Practical Network Penetration Tester](https://certifications.tcm-sec.com/pnpt/), is an exam that evaluates your ability to perform professional level external and internal network penetration testing. Students have five, 5, full days to complete the assessment and two, 2, additional days to write a report.

It also states that students must:

- Perform OSINT to gather information on how to attack the network.
- Leverage their Active Directory exploitation skills to perform AV and egress evasion, lateral and vertical movement across the network, and ultimately compromise the exam domain controller.
- Provide a detailed, professional report.
- Deliver a fifteen minute presentation in front of the examiners.

All of that is the practical scope of the exam according to the official site. From my side, I can confirm they deliver on what they say. If anything, I would add that in the AV and egress evasion part, although it is there, do not be afraid of it, it is far simpler than you might think. In fact, I would not mind if they did not even mention it. So do not worry about “I must know AV evasion.” You really do not, not in the sense people fear.

That said, the exam has two pricing options:

- Exam only, 299 USD. This includes one exam attempt, plus one additional attempt for free. The voucher does not expire, meaning you can take the exam today or in two years.
- A second plan costs 399 USD and, in addition to everything above, includes the five “required” preparation courses:
  - [Practical Ethical Hacking](https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course)
  - [Linux Privilege Escalation for Beginners](https://academy.tcm-sec.com/p/linux-privilege-escalation)
  - [Windows Privilege Escalation for Beginners](https://academy.tcm-sec.com/p/windows-privilege-escalation-for-beginners)
  - [Open Source Intelligence (OSINT) Fundamentals](https://academy.tcm-sec.com/p/osint-fundamentals)
  - [External Pentest Playbook](https://academy.tcm-sec.com/p/external-pentest-playbook)

Around the time of writing, CyberMentor launched [PNPT Live](https://academy.tcm-sec.com/p/pnpt-live), a free live series running for twenty-five weeks at two hours per week, covering the content of the five courses.

So there is flexibility to choose what works for you.

## Exam

From the context, you can already guess the structure, but basically, you start with OSINT on a provided website. Based on that information, you attack the external network range, and from the external network you gain access to the internal network. Once inside, you audit Active Directory and obtain Domain Admin.

As mentioned earlier, you have five days for the practical part and two for the report. Personally, I started the practical on a Friday at 21:00, and by 19:30 on Saturday I was Domain Admin. Five days is more than enough time.

Once I finished the practical, I took my time writing the report. If I remember correctly, I submitted it on Monday, about fifty pages. That same day, a few hours later, I received an email saying I had moved on to the presentation phase:

![PNPT pass email](https://cdn.deephacking.tech/i/posts/tcm-pnpt-review/tcm-pnpt-review-2.avif)

In this part, which is the most innovative, you must present your findings for up to fifteen minutes in English. In my case I presented to Heath Adams, CyberMentor, only, but I know others had a second person present. When you reach this phase, the email says you can use your report or a PowerPoint deck. For convenience, I made a PowerPoint with about sixteen slides, where I simply mentioned the vulnerabilities found and not much else. You do not need to walk through a complete path from zero to full compromise. Mention what you found, share general statistics, give recommendations, that is enough.

And that is really the exam:

- OSINT + External Pentest + Internal Pentest + Report + Client Presentation = PNPT

From my perspective, as soon as you start, it feels like a real world engagement.

## Preparation courses

Out of the five preparation courses, I completed the following:

- [Linux Privilege Escalation for Beginners](https://academy.tcm-sec.com/p/linux-privilege-escalation)
- [Windows Privilege Escalation for Beginners](https://academy.tcm-sec.com/p/windows-privilege-escalation-for-beginners)
- [Open Source Intelligence (OSINT) Fundamentals](https://academy.tcm-sec.com/p/osint-fundamentals)
- [External Pentest Playbook](https://academy.tcm-sec.com/p/external-pentest-playbook)

And selectively, picking only what I wanted to see, the so called “main course,” [Practical Ethical Hacking](https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course).

A few details here. I did the four courses I fully completed in one week because TCM had a seven day free trial for their courses, so I had to take advantage, xD. I went through those four courses very quickly, watching at 1.5x speed, so I might have missed something. That said, I do not think those four courses are strictly necessary. Of course, the topics they cover are worth knowing, but if instead of learning them through those courses, you learn the same topics in other ways, there will not be much difference. For example, for privilege escalation, if I had to pick two courses, Linux and Windows, I would choose [Tib3rius on Udemy](https://www.udemy.com/user/tib3rius/). Those privesc courses are honestly recommended.

The course that might be a bit more important to review is [Practical Ethical Hacking](https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course), especially the Active Directory and pivoting sections. Still, the same logic applies. If you cover those topics on your own, the course is not strictly necessary. But out of the five, if I had to choose one to take, it would be this one.

## Is it worth it?

The exam, a resounding yes. If what you are looking for is a certification with reputation, in demand and valued by companies, bad luck, at least at the time of writing. That said, if TCM Security continues down this road of building innovative, real world certifications, I have no doubt it will become a quite respected certifying body. For now it is not, and the future is uncertain, so PNPT is not highly valued, even less so in Spanish speaking countries. Putting reputation aside, if what you want is a cool exam that challenges you, and you want to experience the unique parts of this certification like OSINT, external pentesting, and presenting results to a client, then go for PNPT.

## How hard is it?

Compared to other certifications, for me it is an eCPPTv2 on steroids, and much better. If I had to rank certifications by difficulty, it would be:

- eJPT < eCPPTv2 < PNPT < CRTP

Sincerely, I think this is the perfect certification for someone who passes it to be able to say they are a Junior Pentester. Let me explain. What eJPT seems to represent right now, Junior Penetration Tester and the first certification for many, I would now put PNPT in that position.

Back to difficulty. It is a certification that is clearly not artificially crafted to be a CTF or overly convoluted. Master the topics it covers, and keeping in mind it is not a CTF, you can pass without problems. So, what topics does it cover?

## What do I need to know?

What I think you should know to pass the certification is:

- Have the mindset of how an external pentest is carried out. You will need to run a process of gathering information that can help you against the company’s internet facing assets.
- Pivoting.
- Active Directory.

That is really it. It might look “small,” but the goal is not to cover too much or too little. The point is to know the topics and put them into practice properly.

## Tip

The tip I am going to mention is something I have been saying throughout the post, but I want to emphasize it, because many people can get stuck on this. This is not a CTF, it is not a HackTheBox machine, it is not a TryHackMe machine. Things are not that contrived. Do not get me wrong, this does not mean the certification is easier than any of those platforms’ machines or CTFs, not at all. The certification has its difficulty, but it is earned by what it is, not by artificially making it harder.

## Conclusion

PNPT is a very cool certification that, although it is not widely recognized right now, will likely be more so over time. It is true this will probably happen more in English speaking countries than in Spanish speaking ones. Leaving that aside, as an exam it is a great experience because of how innovative it is and because of its structure.
