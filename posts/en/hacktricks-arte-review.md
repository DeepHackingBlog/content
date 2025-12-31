---
id: "hacktricks-arte-review"
title: "Hacktricks ARTE Review - Certified AWS Red Team Expert 2024"
author: "axel-losantos-lizaso"
publishedDate: 2024-04-08
updatedDate: 2024-04-08
image: "https://cdn.deephacking.tech/i/posts/hacktricks-arte-review/hacktricks-arte-review-0.webp"
description: "Complete review of HackTricks Training's ARTE certification: AWS Red Team course, cloud labs, hands-on exam, and my experience as an AWS Red Team Expert."
categories:
  - "certifications"
draft: false
featured: false
lang: "en"
---

We all know [Hacktricks](https://book.hacktricks.xyz/) in this field, right? Early in 2024 it surprised us with **ARTE** (**AWS Red Team Expert**). After some initial doubts, I decided to jump in and take advantage of the discount for the first hundred students. In the end, after three weeks, and a root shell in between, I earned the certification.

![ARTE Certificate](https://cdn.deephacking.tech/i/posts/hacktricks-arte-review/hacktricks-arte-review-1.avif)

If you’ve never had the chance to touch a cloud environment and you want to test yourself to expand your knowledge, you’ve got two options: put your credit card into AWS, Azure, or GCP and set up a vulnerable environment for testing… or buy a certification. I genuinely think the second option is more optimal, but keep the “entry level” in mind, since some of them (like this one) require you to have a certain breadth of knowledge before taking it on.

- [Context](#context)
- [Course and Lab](#course-and-lab)
- [ARTE Exam](#arte-exam)
- [Exam Tips](#exam-tips)
- [Conclusions](#conclusions)
- [Notes / FAQ](#notes--faq)
- [Discount!](#discount)

## Context

Context is relative, and you don’t have to follow the same pace. Beyond some general concepts in offensive security, when it comes to cloud I had a few prior certifications that helped me understand more complex concepts in ARTE. Some of them are the [CARTP](https://www.alteredsecurity.com/azureadlab), which we already discussed [in another post](https://blog.deephacking.tech/en/posts/alteredsecurity-cartp-review/), and the [CHMRTS](https://cyberwarfare.live/product/hybrid-multi-cloud-red-team-specialist-chmrts/), which combines the three most in-demand cloud environments on the market.

## Course and Lab

Twenty hours of course content in English await you when you log into the site, split across five modules.

1. Brief course introduction
2. Introduction to AWS
3. Exploitation of twenty AWS resources
4. Pentesting methodologies in cloud environments
5. Bypassing cloud security measures

When you redeem your certification voucher, you’ll get access to a lab with **50 flags** to practice all the abuses covered in the course. It’s one of the densest certs in terms of hands-on content, very well put together, so you learn not only the abuses explained in the course, but you’re also encouraged to go further and dig up new techniques.

> Heads-up: you get forty-five days to complete 100% of the labs, which is not something to take lightly like any other certification. The month you dedicate to it should be almost a priority, because watching the videos and doing the exercises takes a fair bit of time.

## ARTE Exam

The exam consists of obtaining **three flags within a twelve-hour window** using the concepts learned in the labs… and maybe going one step further. People might disagree on this last point, but personally I think it’s fair for the exam to include some difficulty beyond the initial syllabus.

The main difference from other certifications is that you don’t need to submit a technical report of your steps to pass. Simply obtaining the three flags automatically gets the certificate sent to you. However, there’s another way to pass: submit a valid PR (Pull Request) to the [Hacktricks Cloud GitHub repository](https://github.com/HackTricks-wiki/hacktricks-cloud) offering new techniques and/or abuses related to AWS, and the number of flags required to pass is reduced by one.

The difficulty of the exam is worth highlighting. Opinions may vary depending on who you ask, so I’ll try to be as objective as possible. Keep in mind you have twelve hours to take an exam that can include a “rabbithole,” which raises the bar due to time pressure. The exam itself isn’t very long compared to others, and I missed a slightly longer kill chain. The process of obtaining the three flags **isn’t entirely linear**, and you might be able to get one flag without having obtained the previous one.

It took me five hours to get the three flags, after spending more than two hours stuck in every possible trap. You work with resources covered during the course, although there are so many that you can only put a few into practice. Once you obtain the required flags, the certificate is generated and the exam ends.

## Exam Tips

All right, enough preamble, here are some tips I consider important to help you pass the ARTE certification.

- Work on the **labs** while watching the **videos**. It’s a great way to understand the resource you’re going to abuse and to test yourself.
- **Go a bit beyond** what’s explained for each AWS resource. Dig around online to expand your understanding of how each one is used.
- Struggle a bit before opening a ticket. The exercises are designed so most can be solved **without help**, though for some you may need to ask the community or open a support ticket.
- Taking notes **grouped by AWS resource** helps you locate abuses very precisely and avoid wasting time during the exam.
- **Take notes on the labs**, it’s a great way to retain content and review before the exam.
- In the exam, move steadily but don’t fall asleep. If you see a path isn’t going anywhere, don’t take one step back… take **two**. You missed something.
- The exercises labeled **blackbox** are very interesting, as they resemble what you might find in the exam.

## Conclusions

One of the things that can make you hesitate, and the reason you’re reading this post, is it worth it? Since it’s a new certification, there aren’t many reviews out there. The short answer: if you’re interested in learning any cloud environment, yes.

For the long answer, we’d probably have to justify paying over €1,000 for a certification. While in others, outside the Offensive Security ecosystem, prices usually don’t exceed four digits, **ARTE** is priced higher. I won’t deny it: it’s an expensive certification. On the other hand, it doesn’t seem that expensive when your alternative is to build your own AWS environment and start paying per use.

For Hacktricks’ first AWS certification, I do NOT consider it “entry level.” You need some prior knowledge to move quickly and make the most of it. That said, I wouldn’t say you need years of experience; rather, you should have at least touched a cloud environment like AWS, Azure, or GCP, since they share many similarities.

## Notes / FAQ

> If it requires some prior knowledge, what can I study beforehand to be prepared?

Unfortunately, there aren’t many certifications and/or resources to learn from today. But here’s a short list:

- [Certified Azure Red Team Professional](https://www.alteredsecurity.com/cartp-bootcamp) (CARTP). It’s not AWS, but it will help you learn the basics of cloud environments.
- [AWS Cloud Red Team Specialist](https://cyberwarfare.live/product/aws-cloud-red-team-specialist-carts/) (CARTS).
- Any YouTube video that helps you understand how AWS resources work, like [this one](https://www.youtube.com/watch?v=B08iQQhXG1Y&ab_channel=BeABetterDev).
- Take advantage of the thirty free days AWS offers to experiment in the portal.
- Use the AWS [training portal](https://www.aws.training/).

> I’m not sure I’m interested in cloud pentesting, but I want to see if I like it. Is it worth trying here?

There are cheaper alternatives that can cover more basic cloud concepts. Also, Hacktricks is working on offering a certification that’s more approachable for those starting from scratch.

> I don’t have cloud experience but still want to get the ARTE certification. How hard would it be?

I’m not saying it’s impossible to get the certification, far from it. However, keep in mind the course focuses on exploiting AWS components, not on explaining how they work. You’ll need to put in the extra effort to understand what each resource is used for, and to dedicate more time than the baseline. Some sections of the course are introductory and the resources are easy to understand, but others will require extra effort.

> Some details in this blog differ from what I’m seeing in the course

After you finish the exam, you’re asked to give five minutes of quick feedback for tracking and future improvements. That way, the course will likely be updated with meaningful changes to improve the student experience, and some details highlighted here may no longer be present, or new ones may appear that weren’t mentioned.

## Discount!

You can get **15% off** any [HackTricks](https://training.hacktricks.xyz/) certification, including the one reviewed here, using the following code:

- `DEEPHACKING`

With that said, Happy Hacking!
