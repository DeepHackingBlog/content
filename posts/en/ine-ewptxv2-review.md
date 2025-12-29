---
id: "ine-ewptxv2-review"
title: "eWPTXv2 Review - eLearnSecurity Web Application Penetration Tester eXtreme 2022"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-08-22
image: "https://cdn.deephacking.tech/i/posts/ine-ewptxv2-review/ine-ewptxv2-review-0.webp"
description: "Complete review of INE Security's eWPTXv2 certification: advanced web pentesting course, bypass techniques, challenging exam, and my experience obtaining the certification."
categories: 
  - "certifications"
draft: false
featured: false
lang: "en"
---

Last week I wrestled with eLearnSecurity’s toughest web certification, eWPTXv2, and after many hours and days, I managed to pass.

![INE eWPTXv2 certificate](https://cdn.deephacking.tech/i/posts/ine-ewptxv2-review/ine-ewptxv2-review-1.avif)

Let’s go over the topics it covers, and especially, what I thought of it.

- [Context](#context)
- [How hard is it?](#how-hard-is-it)
- [What do I need to know?](#what-do-i-need-to-know)
- [What is the exam like?](#what-is-the-exam-like)
- [My opinion](#my-opinion)
- [Is it worth it?](#is-it-worth-it)
- [Tips](#tips)
- [Conclusion](#conclusion)

## Context

eWPTXv2, eLearnSecurity Web Application Penetration Tester eXtreme, is the continuation of eWPT. It is a 100% practical web hacking certification that, according to eLearnSecurity, covers the following topics:

- Penetration testing processes and methodologies
- Web application analysis and inspection
- Advanced reporting skills and remediation
- Advanced knowledge and ability to bypass basic and advanced filters for XSS, SQLi, and similar vulnerabilities
- Advanced knowledge of different database management systems
- Ability to create custom exploits when modern tools fail

## How hard is it?

Putting aside a few points I will comment on later, this certification is not easy, and it is not for beginners. In fact, it is a big jump from eWPT. I completed the latter in under 24 hours. eWPTX, on the other hand, I finished on the night of the sixth day. Maybe my personal circumstances were not the same between the two exams, but in any case, that difference highlights the big jump between one and the other. That said, to me this certification felt very artificial, meaning the exam seemed deliberately designed to be difficult and CTF like, which I did not like. Either way, let’s look at the topics you need to know for the exam.

## What do I need to know?

For this certification, I personally think you should be comfortable with almost all the most common web vulnerabilities:

- XSS
- SQLi, including filter bypasses
- XXE and blind XXE
- SSTI
- Insecure deserialization and serialization in different languages
- SSRF
- CSRF
- Cookies and sessions
- Information disclosure
- Common security misconfigurations
- Cookie entropy
- Cookie generation
  - A bit of cryptography

This is for the practical part. For the report, you should be able to classify vulnerabilities by CVSS and categorize them according to a standard, for example OWASP.

## What is the exam like?

There is not much new here, since it follows the same pattern as other eLearnSecurity certifications. You have seven days for the practical and seven days for the report. During the practical, you have four lab resets per day.

The rest is the same as always. They provide a letter of engagement, which explains how the exam works, shares a few tips, defines the scope, and most importantly, lists minimum, but insufficient, requirements. These are minimum requirements you must meet, but meeting them does not guarantee a pass. You can meet those and still fail if you do not find enough vulnerabilities. That is why they are minimum, but insufficient.

## My opinion

To be completely honest, I did not like this certification, and there were moments when I had a bad time with it, because of a few things:

- It feels very CTF like, in the bad sense of the word
- The lab breaks a lot

That last point got on my nerves, because there were times when I tried an exploitation path, and it just would not work. In that situation, the logical possibilities are two:

- The exploitation path is not correct
- The lab is failing, I will reset it once just in case

That is the logical approach. What happened to me is that I tried to exploit a path and it did not work, I reset the lab once, tried again, and still nothing. At that point I assumed the path was wrong. However, I asked a colleague who was also taking the exam whether he had tried the same approach. He had, and it worked for him. My face when he told me that was something like this:

![Reaction to lab failure](https://cdn.deephacking.tech/i/posts/ine-ewptxv2-review/ine-ewptxv2-review-2.avif)

So I reset the lab a second time, and now it worked. In other words, for the correct exploitation path to work, I needed two lab resets. If I had not asked, I would have discarded the correct path because of a lab issue.

This is why I really did not like the certification. On top of that, one of the times I reset the lab, it took an hour to come back, so that part is not great either.

Beyond all that, as I said, it is a fairly long certification, and it can feel tedious at times, especially with the CTF flavor.

## Is it worth it?

Honestly, if I had to choose, I would have preferred to spend a full week doing bug bounty, reading bug bounty reports, paying for a PentesterLab subscription, or simply reading web hacking articles. If you are not particularly interested in the certification, I would go with one of those alternatives. I think, personally, one of those options will give you more.

## Tips

Do not do it.

Nah, but if you are going to take it, enumerate thoroughly, and as soon as you see something that should be working but is not, reset the lab without hesitation.

Also, do not be afraid to use SQLMap or other automated tools if they can help.

- For SQLMap, if you do not know its "tamper" feature, take a look at it.

## Conclusion

I think my opinion should be clear from everything I have mentioned. In any case, if you think this certification could benefit your resume, go for it. If not, learn through other alternatives that, personally, I consider better.
