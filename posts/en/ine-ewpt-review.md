---
id: "ine-ewpt-review"
title: "eWPT Review - eLearnSecurity Web Application Penetration Tester 2022"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-11
image: "https://cdn.deephacking.tech/i/posts/ine-ewpt-review/ine-ewpt-review-0.webp"
description: "Complete review of INE Security's eWPT certification: web pentesting course, OWASP vulnerabilities, hands-on exam, and my experience as a Web Penetration Tester."
categories: 
  - "certifications"
draft: false
featured: false
lang: "en"
---

This past weekend I said to myself, I feel like keeping busy for a bit, so I took the eWPT. Nah, it was not that spontaneous, but it would have been cool if it were. In any case, it went well:

![INE eWPT certificate](https://cdn.deephacking.tech/i/posts/ine-ewpt-review/ine-ewpt-review-1.avif)

So here is a review with my take on it.

- [Context](#context)
- [Is it worth it?](#is-it-worth-it)
- [How hard is it?](#how-hard-is-it)
- [What do I need to know?](#what-do-i-need-to-know)
- [What is the exam like?](#what-is-the-exam-like)
- [What is the preparation course like?](#what-is-the-preparation-course-like)
- [Tips](#tips)
- [Conclusion](#conclusion)

## Context

The eWPT, eLearnSecurity Web Application Penetration Tester, is a 100% practical certification that tests your web pentesting skills. According to eLearnSecurity, it covers the following topics:

- Penetration testing processes and methodologies
- Web application analysis and inspection
- OSINT and information gathering techniques
- Vulnerability assessment of web applications
- OWASP Top 10 2013, OWASP Testing Guide
- Manual exploitation of XSS, SQLi, web services, HTML5, LFI and RFI
- Exploit development for web environments
- Advanced reporting skills and remediation

## Is it worth it?

I would say yes. It is an enjoyable certification where you can put a variety of web attacks to the test, and not only that, you practice writing a report and get familiar with the OWASP Testing Guide. Beyond practicing the different attacks, if you approach it correctly, as if it were a real web assessment, it is great and you can learn a lot.

## How hard is it?

As I said with eCPPTv2, I personally think it is not hard, but that does not mean it is easy. If you lack the knowledge, or your knowledge is very limited, you will not pass. Here is a comparison that often comes up, which one is harder, eCPPTv2 or eWPT?

They are different. The web portion of eCPPTv2 is quite a bit easier than eWPT, so the takeaway is:

- At the web level, eWPT is harder.
- eCPPTv2 covers a broader variety of topics.

Following those two principles, someone might pass eCPPTv2 and fail eWPT, and vice versa. I personally see them as going down different paths:

![eWPT vs eCPPTv2 comparison](https://cdn.deephacking.tech/i/posts/ine-ewpt-review/ine-ewpt-review-2.avif)

So in this case, it is not about choosing based on difficulty, but about what you want to focus on right now.

Back to eWPT itself, is it difficult? Not really, but you do need experience with web attacks and an understanding of how they work.

## What do I need to know?

What I think you should know to tackle the certification successfully is:

- Burp Suite, Burp Suite, and Burp Suite. For me, this is the best web pentesting tool without a doubt. Knowing how to use it is essential, for CTF and in real life. And no, Burp Suite is not just intercepting and sending to Repeater. It has many other super useful features.
- How cookies and sessions work.
- As for web attacks, I cannot be too specific without spoilers, but if you go to PortSwigger and complete the labs for the most well known and important vulnerabilities, you will be in good shape. Still, take a look at the [preparation course syllabus](https://my.ine.com/CyberSecurity/courses/38316560/web-application-penetration-testing).
- Have an idea of the main vulnerability reference resources, MITRE, CWE, OWASP, WASC Threat Classification, and of course use CVSS.

## What is the exam like?

When you start the certification, you receive a letter of engagement, basically a PDF with all the details you need about the exam.

- Super tip, read the letter of engagement very, very carefully before starting the exam.

Once you have read it, you connect to the exam via VPN and you will have different web assets to assess. There is not much more to say here.

The exam lasts fourteen days. You have seven days for the lab, that is, seven days to complete the practical part, then another seven days to write the report. I started on a Friday around 19:30, and by Saturday around 21:00 I had the minimum requirements covered plus quite a few vulnerabilities. On Sunday I wrote the report, and that was it.

> Regarding the “minimum requirements,” the letter of engagement specifies that there is a minimum, but not sufficient, requirement to do X. It is not sufficient because, even if you meet that requirement, the goal of the exam is to find and report all the web vulnerabilities you can.

About the report, in case it helps as a reference, mine was 72 pages. I literally wrote it all on Sunday and when I finished my hands were so done that I went to play God of War, xD. For the report you can follow a template such as [TCM’s](https://github.com/hmaverickadams/TCM-Security-Sample-Pentest-Report) or [TheMayor’s](https://themayor.notion.site/themayor/Pentesting-Notes-9c46a29fdead4d1880c70bfafa8d453a). That is what I did for eCPPTv2. In this case, I decided to write everything from scratch, but I borrowed ideas from both templates. A structure you can follow could be:

- Vulnerability
  - Brief description
  - Affected assets
  - Extended description
  - Impact, CVSS
  - Recommendations
  - References

Use this model and adapt it to whatever you think works best.

## What is the preparation course like?

Honestly, a drag.

![Kitten](https://cdn.deephacking.tech/i/posts/ine-ewpt-review/ine-ewpt-review-3.avif)

And yes, I mean it. Something I personally do not like about eLearnSecurity is that they give you a 300 page PowerPoint of content where, if they include code, you cannot even copy it directly. Three hundred pages of slides is fine when you are at page 20, but around page 100 you are a bit fed up. Personally, I prefer video content with someone explaining things in a dynamic, engaging way, and I want the code in the description so I can copy it and try it locally.

On the other hand, something I love about eLearnSecurity is how deeply they go on many topics. When we focus so much on solving boxes and running attacks, we sometimes forget the real fundamentals we need to build everything else solidly. I love how they explain, in detail, concepts like cookies, SOP, and sessions. I do think that we often take these basics for granted because they are “simple,” and because of that assumption we miss important details. I am glad eLearnSecurity covers this area.

As for the syllabus, you can see it on [INE's Web Application Penetration Testing course page](https://my.ine.com/CyberSecurity/courses/38316560/web-application-penetration-testing) without logging in. The content covers common topics like SQLi, XSS, CSRF, LFI, RFI, session fixation, but it also touches on less common ones like XPath injection and SOAP, among others. If you can view the syllabus, great. If not, it is time to search and research on your own. Even with the syllabus, that part is on you.

Regarding the labs, none stood out to me in particular. You can practice all the vulnerabilities and more, but I do not think they are necessary enough, or worth it enough, to pay for INE’s premium subscription.

## Tips

I would say Burp Suite, but that is not a tip, it is a necessity, haha. Beyond that, I highly recommend using mind maps, like this:

![Mind map example, XMind](https://cdn.deephacking.tech/i/posts/ine-ewpt-review/ine-ewpt-review-4.avif)

Personally, I recommend [XMind](https://www.xmind.net/). It is very comfortable and intuitive. Using a mind map will help you stay organized and see things more clearly. In fact, this approach is pretty common in bug bounty.

Aside from that, the only additional tip I will repeat is to read the letter of engagement very carefully when you start the exam.

## Conclusion

The eWPT is a fairly enjoyable exam, and you can get a lot out of it. I recommend it if you want to learn more about web security. In the end, learning depends mostly on you, not so much on the exam itself.
