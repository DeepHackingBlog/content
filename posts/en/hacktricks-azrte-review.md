---
id: "hacktricks-azrte-review"
title: "HackTricks AzRTE Review – Certified Azure Red Team Expert 2025"
author: "hector-ruiz-ruiz"
publishedDate: 2025-06-02
updatedDate: 2025-06-02
image: "https://cdn.deephacking.tech/i/posts/hacktricks-azrte-review/hacktricks-azrte-review-0.webp"
description: "Complete review of HackTricks Training's AzRTE certification: course content, hands-on labs, exam, and my experience as a Certified Azure Red Team Expert 2025."
categories:
- "certifications"
draft: false
featured: false
lang: "en"
---

The cloud... A technology that has completely changed the paradigm of enterprise technological infrastructure. A few years ago, we all discussed its viability, however, its adoption has been massive. Any company, regardless of its size, uses its services today, whether in a hybrid form or fully in business models like startups.

This reason led me in 2024 to start my offensive Cloud training with HackTricks Training certifications, the training branch of the well-known HackTricks, with which I went from Zero to Hero. That's why when the HackTricks team announced their new certification, **[AzRTE (Azure Red Team Expert)](https://training.hacktricks.xyz/courses/azrte)**, I jumped headfirst into the shopping cart.

![AzRTE certificate obtained](https://cdn.deephacking.tech/i/posts/hacktricks-azrte-review/hacktricks-azrte-review-1.avif)

After completing AzRTE, I now hold all cloud certifications available from HackTricks (AzRTE, GRTE, and ARTE), so I hope this review serves as a reference for all those who are thinking about taking their first steps in Azure or want to expand their knowledge for executing Cloud Red Team exercises.

During this review, we will cover the following points:

- [Context](#context)
- [Course and Laboratory](#course-and-laboratory)
- [AzRTE Exam](#azrte-exam)
- [Conclusions](#conclusions)
- [AzRTA - AzRTE Lite](#azrta---azrte-lite)
- [Discount](#discount)

## Context

The question we all usually ask ourselves before starting a certification is:
- Do I need prior knowledge to be able to take and pass the certification?

And the answer is simple, no. When I started with HackTricks certifications, I had no previous experience beyond what any person who is introduced to the cybersecurity sector might have.

All the concepts you need to know and internalize are explained during the course, which makes it an ideal option to start from an almost null base (if you work in the IT sector) and manage to acquire the necessary skills to execute Cloud audits.

## Course and Laboratory

Once you purchase your certification voucher, you will get access to the course and the laboratory. Something important to highlight is that access to the materials is permanent, so if in the future the course undergoes updates of any kind, whether they include new materials or update them, you will always be able to consult them and refresh your knowledge.

The laboratory is accessible for practice for 60 calendar days from when you redeem the voucher, and includes more than 80 labs, which you will need to complete throughout the course. If you're worried about time, in my experience, it's more than enough. I've always had days of lab access left over in each of the certifications I've taken.

However, it is possible to acquire more days of laboratory access at any time in case you need it.

![AzRTE course progress](https://cdn.deephacking.tech/i/posts/hacktricks-azrte-review/hacktricks-azrte-review-2.avif)

At the time of writing this review, the course covers 23 of the most common Azure and Entra ID services, plus 3 defensive security services, being the certification par excellence in terms of number of services covered and number of laboratories to practice in.

For each of these services, you will learn:
- How the service works and what it's used for
- Specific characteristics of that service
- Manual/automated enumeration
- Privilege escalations
- Post-exploitation actions
- Persistence
- From 1 to 9 laboratories to practice what you've learned

![AzRTE course material](https://cdn.deephacking.tech/i/posts/hacktricks-azrte-review/hacktricks-azrte-review-3.avif)

With the number of laboratories this certification offers, it's impossible not to end up mastering Microsoft's tools to interact with Azure and Entra ID, such as Azure CLI or Azure PowerShell among others, and that's something I really like about HackTricks certifications in general.

The quality of the different laboratories is very good, trying to maintain a realistic approach in the explanations and exploitations of the services.

## AzRTE Exam

The exam consists of a 100% hands-on laboratory where you will have to find 3 flags through exploitation, privilege escalation, and pivoting in an Azure tenant.

You have 12 hours to find the 3 flags. If at any time you feel stuck, remember that in this type of exam, enumeration plays a fundamental role, so review all your findings again.

It's very useful to take notes of all the course contents and laboratories you solve. Making your own cheat sheets will allow you to perform with greater confidence during the exam. If you have completed the entire course and taken notes, I'm quite sure you will pass.

The exam is not easy, and I really liked it, as it tests your acquired knowledge and methodology.

> Pro Tips
- Don't trust the output of a single tool
- Enumerate non-stop until you identify a clear exploitation vector
- Stay calm, there's plenty of time to complete the exam
- Think outside the box and don't complicate things, everything you need to know is in the course

> Extra Points (PR)

Finally, I would like to mention the Extra Points system. In any of the HackTricks certifications, if you submit a PR to the official GitHub repository, in which you explain a new technique you've discovered through research, you will get an extra point. This extra point will allow you to not submit one flag in the exam, being able to pass with just 2 flags, which encourages students to research and share knowledge related to new exploitation vectors in Azure.

![AzRTE exam completed](https://cdn.deephacking.tech/i/posts/hacktricks-azrte-review/hacktricks-azrte-review-4.avif)

I hope to see you certified soon!

## Conclusions

My opinion regarding this certification is clear. First of all, I would like to mention that I have paid for all certifications in full, I have not received any kind of discounts from the HackTricks team, and my opinion is not biased.

AzRTE is undoubtedly the best Azure certification you will find. The amount of laboratories and content is unmatched, and something that is very important to me, the delivery and explanations, a clear and minimalist platform through which it is very easy to extract content and make notes efficiently.

Another aspect that seems fundamental to me about this certification is that unlike others, it is focused on applying knowledge to a real environment. In the certification, the execution process of a Blackbox and Whitebox exercise is covered, commenting on the requirements you will need to request from the client in order to carry them out, which adds great value. At the end of the day, it's what we all want to know for the development of our profession.

The courses and laboratories are updated relatively frequently. Reviewing the platform, I can see that in the two certifications I took earlier (ARTE and GRTE), there are new laboratories and lessons that were not available at the time.

## AzRTA - AzRTE Lite

If you consider that **AzRTE** is too much for you, the HackTricks Training team is planning the launch of **AzRTA**, which is a simpler version of the original **AzRTE**. In it, you can also learn the fundamental concepts of Azure and explore a reduced number of services.

After completing **AzRTA**, you will get a **25% discount** to take AzRTE, which also seems like an interesting option to me, as it is a cheaper and simpler way to get introduced to the world of Cloud Red Teaming.

**AzRTA** will not have a certification exam and you will have 30 days of laboratory access to practice just like in AzRTE, but with fewer services.

Once you complete all the laboratories, you will get a certificate. The diploma contains a QR code that can be used to verify its authenticity like the rest of the certifications.

## Discount

You can get a 15% discount on any [HackTricks](https://training.hacktricks.xyz/) certification, including the one in this review, using the following code:
- `DEEPHACKING`

With that said, I say goodbye to all of you, greetings and Happy Hacking!
