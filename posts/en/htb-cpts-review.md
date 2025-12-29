---
id: "htb-cpts-review"
title: "CPTS Review - HackTheBox Certified Penetration Testing Specialist 2025"
author: "oliver-felix-giovanardi"
publishedDate: 2025-10-13
updatedDate: 2025-10-13
image: "https://cdn.deephacking.tech/i/posts/htb-cpts-review/htb-cpts-review-0.webp"
description: "Complete review of HackTheBox's CPTS certification: preparation, exam, comparison with OSCP, tips, and final thoughts."
categories:
  - "certifications"
draft: false
featured: false
lang: "en"
---

I hope you're doing great out there. My name is Oliver, and today I'm bringing you a review of a certification that's been growing strong in the market: HackTheBox's [CPTS (Certified Penetration Testing Specialist)](https://academy.hackthebox.com/preview/certifications/htb-certified-penetration-testing-specialist).

![CPTS certification cover](https://cdn.deephacking.tech/i/posts/htb-cpts-review/htb-cpts-review-1.avif)

Whether it's due to its accessible price or its difficulty level theoretically designed for "junior" profiles (very much in quotes), this certification has become a promising option and is increasingly mentioned as a direct competitor to the **OSCP**.

- [What is this certification about?](#what-is-this-certification-about)
- [Price](#price)
- [Path](#path)
- [Exam](#exam)
- [Final thoughts](#final-thoughts)

## What is this certification about?

It's a certification completely focused on Pentesting, with quite general content and approach to this world. It stands out for its excellent content development, structured through a **mandatory path** that you must complete before taking the exam. This journey takes place in [HackTheBox Academy](https://academy.hackthebox.com/) and prepares you very well for what's coming in the test, without straying from the topics it covers.

The course includes **28 modules**, and each one contains a series of practical labs to apply the techniques seen in the module. Upon completing the journey, you get access to the **exam with up to 3 attempts** available.

- Penetration testing processes and methodologies
- Information gathering & reconnaissance techniques
- Attacking Windows & Linux targets
- Active Directory penetration testing
- Web application penetration testing
- Manual & automated exploitation
- Vulnerability assessment
- Pivoting & Lateral Movement
- Post-exploitation enumeration
- Windows & Linux Privilege escalation
- Vulnerability/Risk communication and reporting

## Price

You can check the prices at [this HTB Academy subscriptions link](https://help.hackthebox.com/en/articles/5720974-academy-subscriptions), basically you need to pay for any subscription that at minimum provides you access to TIER I and TIER II level modules. The two cheapest subscriptions that can provide you full access are the student subscription and the Silver Annual. For example, if you have an educational email, you can use the first subscription and get all the necessary access for only **$8 USD** per month.

TIER I and TIER II modules completely cover the CPTS path, plus other HTB certifications, so you would only need to pay for the exam voucher, which costs **$210 USD** with taxes included. If you plan to complete the certification in about 3 to 4 months with a student subscription, the total investment would be around **$242 USD**. A real bargain, as long as you know how to organize yourself well.

If you can't get a student subscription, your only option is to pay for the Silver Annual subscription, which is around $490 USD per year, or alternatively, purchase the necessary cubes separately to unlock each module, although this last option is probably the most expensive of all, according to the estimates provided by the platform itself.

## Path

The **28 modules** that make up the **Penetration Tester** path represent the most extensive journey among all HTB certifications, but this is justified by how complete and well-structured it is. Ideally, you should follow them linearly and in the established order, as they are designed to progressively build knowledge and thoroughly prepare even those who don't have much previous experience in the area.

HackTheBox's philosophy throughout the entire journey is to always think **outside the box**, something that is constantly repeated and truly makes a difference both in the exam and in the actual practice of pentesting. If you complete each module of the path and master the **Skill Assessments** at the end of each module well, you'll be more than prepared to face the certification. Even so, I recommend doing machines related to each module to reinforce your knowledge and gain more fluency in executing the techniques. Additionally, I advise you to:

- Complete the entire path patiently and review whatever is necessary.
- Create your own methodology for the exam, like checklists or personalized roadmaps.
- Don't "waste" time studying material outside the course content, the syllabus covers everything you need.
- If you see something that seems like filler, don't get frustrated: synthesize what you've learned and focus on how to apply it.
- The most important modules (they all are, eh!) for the exam are **Active Directory Enumeration & Attacks**, **Attacking Common Applications**, and especially **Attacking Enterprise Networks**, since this last one closely resembles the actual exam lab environment.
- Although it may seem boring or very theoretical, the **Documentation & Reporting** module is key. Read it carefully and pay attention to detail, because the HTB folks don't forgive here: study the template and follow the module to the letter. In the end, **they pass you based on the report, not the pentest.**

## Exam

![CPTS exam panel](https://cdn.deephacking.tech/i/posts/htb-cpts-review/htb-cpts-review-2.avif)

With this exam, I understood that when a certification gives you several days to complete it, it's because you're really going to need it. The experience with the CPTS was crazy: it makes you feel that **10 days of exam** are not enough for everything you have ahead, especially due to the magnitude and complexity of the environment.

The exam consists of compromising a black-box style enterprise environment, composed of approximately **8 machines**, both Linux and Windows (at least for the most part, according to the current version at the time of writing this). The goal is to obtain a total of **14 flags** distributed throughout the environment. To pass, you need to get at least 12 of them and submit a well-structured commercial report that strictly complies with the requirements established in the corresponding module.

![CPTS exam timeline](https://cdn.deephacking.tech/i/posts/htb-cpts-review/htb-cpts-review-3.avif)

I started the exam on **May 8, 2025**, and managed to fully compromise the environment, obtaining the 14 flags needed to reach the maximum score of 100 points. By **May 15**, I had completed all objectives, still having three additional days to finish the documentation and make the submission.

The exam presents several notable aspects, as although it doesn't focus so much on evasion techniques, it remains a challenging environment due to its size and complexity. This requires not only a good work methodology but also applying the well-known philosophy of "thinking outside the box" at various moments, which is key throughout the process.

One thing is completing the exam lab, and quite another is getting the report approved, which is governed by quite a strict standard. In fact, many people fail to certify despite having compromised the entire environment. It's estimated that only a few of those who finish the lab get approval, mainly because they don't follow the report guidelines to the letter. That's why, to close, I'll share all the necessary tips and recommendations to approach this challenge in the best possible way.

- It's impressive how well-structured and stable the lab is, which allows you to work with total confidence. There's no need to rush for fear that something will fail or crash, you can focus on executing each step calmly and precisely.
- Many tend to fear the pivoting aspect, but I can assure you that if you learn to use the [ligolo-ng](https://github.com/nicocha30/ligolo-ng) tool correctly, this part of the exam becomes one of the easiest.
- In this exam, everything is designed quite intricately, so it's not worth wasting time on tasks that aren't directly related to enumeration, as this is the key to success. Also, document absolutely everything you find: this challenge is largely based on revisiting information seen previously and using it strategically later.
- I recommend creating the report as you go through compromising the environment, because if you leave everything for the end, there will hardly be enough time to complete such a demanding report. In fact, this is one of the most extensive reports in the world of offensive certifications. However, tools like [SysReport](https://docs.sysreptor.com/htb-reporting-with-sysreptor/), which even includes HTB's official template, can save you a significant amount of time. That said, it's essential to have studied the reporting module provided by the platform well and pay special attention to the example template they provide.
- Try to document absolutely everything from the perspective of an offensive engineer, not as if it were a CTF-style writeup. This means including relevant screenshots, justifying each step taken, and explaining the why behind each action, not just showing the commands used.
- Try to maintain rigorous order in everything you do: note the paths of each script you upload, record the commands used, and document each action clearly. Precision in documentation is key, as this exam puts you in the role of a hired pentester, and you're expected to deliver a professional and coherent report, as you would in a real environment.
- Make sure to thoroughly review the **Enterprise Network Attacks** module, as it will be key to successfully approaching the exam. This module covers many of the techniques and methodologies that are applied during the assessment, so having them well understood will make a big difference when facing the environment.
- It's highly recommended to have well-organized cheat sheets for each module, as having quick and structured references will allow you to save valuable time during the exam and avoid unnecessary mistakes.

After submitting the report, just hours before my exam attempt expired, I had to wait approximately three weeks during which I could barely sleep due to nerves. Finally, I received by email the long-awaited confirmation that I had passed.

![CPTS certification approved](https://cdn.deephacking.tech/i/posts/htb-cpts-review/htb-cpts-review-4.avif)

If you don't pass the exam, you'll always receive detailed **feedback** indicating which aspects you need to improve, which is very useful for preparing a second attempt. Additionally, the **lab environment doesn't change between attempts**, so if you kept good organization, you'll only need to pick up where you left off and recapture the necessary flags.

## Final thoughts

I had the honor of becoming the youngest person in my country to obtain this certification, and there's more to come. Without a doubt, the experience that the CPTS offers is unique, even for experienced professionals, due to how complete and well-designed it is. It has been one of the most exciting labs I've had the opportunity to compromise in my entire career so far. Additionally, for the price it's offered at, I consider it to be widely undervalued. I hope it continues to grow and demonstrate that, with a small budget, great things can also be achieved, even at the level of competing with giants like OffSec.

I don't consider or recommend this to be the first certification for someone just starting out, as it's quite complex and demands a high level of organization, which can be difficult for those with little experience. However, nothing is impossible. If you follow the study path with discipline and face several practical machines to train your mind, you're definitely going to crush it.

I hope I've motivated you with this review, and if not, at least that it serves to reflect on your own path, it's always worth having experiences as enriching as this one. Best wishes to all who dare to take the step and to those who continue advancing in this exciting career!
