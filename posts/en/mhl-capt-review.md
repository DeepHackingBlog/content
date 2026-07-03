---
id: "mhl-capt-review"
title: "CAPT Review - Mobile Hacking Lab Certified Android Penetration Tester 2026"
author: "daniel-moreno"
publishedDate: 2026-07-03
updatedDate: 2026-07-03
image: ""
description: "Complete review of Mobile Hacking Lab's CAPT certification: preparation, the 72-hour exam against iBank, and a comparison with INE's eMAPT."
categories:
  - "certifications"
draft: false
featured: false
lang: "en"
---

Aloh! How's it going? I'm **eldeim**, that's my hacker handle, but my name is **Dani**.

I'm bringing you a pretty interesting review of another mobile hacking certification, CAPT, from Mobile Hacking Lab (MHL), plus a comparison with the famous eMAPT from INE.

I'll give you my honest opinion on both, along with things to keep in mind when studying for this certification.

![Cover of Mobile Hacking Lab's CAPT certification](./images/imagen-1.png)

- [Context](#context)
- [How Was My Preparation?](#how-was-my-preparation)
- [TIPS](#tips)
- [Reinforcing the Knowledge](#reinforcing-the-knowledge)
- [What Is the Exam Like?](#what-is-the-exam-like)
- [My Experience](#my-experience)
- [Comparison with Other Certifications (CAPT vs eMAPT)](#comparison-with-other-certifications-capt-vs-emapt)
- [Is It Worth It?](#is-it-worth-it)
- [Conclusion](#conclusion)

## Context

The [**CAPT (Certified Android Penetration Tester)** from Mobile Hacking Lab](https://www.mobilehackinglab.com/courses/capt-certification) is a hands-on certification focused on Android application penetration testing.

It's well recognized, even though it's a pretty niche field, and it combines hands-on labs covering real vulnerabilities with a final 72-hour exam against an intentionally vulnerable banking app called iBank (which we'll talk about later).

![Vulnerable banking app iBank from the CAPT exam](./images/imagen-2.png)

The course is structured around three major attack categories:

The first is **IPC (Inter-Process Communication)**, which covers how to abuse Android components exposed to the outside world:

- Exported Broadcast Receivers with weak AES/ECB encryption
- Exported Activities with deep links and memory analysis using Frida and Objection
- Exported Services with command injection via file name
- Exported Content Providers with offline brute-forcing of 4-digit PINs
- Deep link hijacking combined with a WebView JavaScript bridge to achieve RCE
- XSS in WebView innerHTML that pivots through the bridge to command execution
- WebView with DSBridge and no origin validation, used to steal JWTs and perform account takeover

The second category is **Data Storage**, which covers:

- SQL Injection in local SQLite INSERT queries to escalate privileges from a normal user to Admin

The third is **Platform Issues**, which covers:

- Insecure YAML deserialization with SnakeYAML and local gadgets from the APK itself to achieve RCE
- Path traversal using `%2F` encoding to write a malicious native library and load it with `System.load()` (Document Viewer)
- Stack buffer overflow in native JNI code (the hardest one for me, but nothing to worry about for the exam, since it doesn't show up xd)

## How Was My Preparation?

Realistically, I already had a solid foundation in mobile hacking. About 6 months ago I got the INE-eMAPT certification, where I learned quite a bit about mobile hacking (but spoiler, not as much as with this one).

> _Here's the link to my [review of INE's eMAPT](https://blog.deephacking.tech/en/posts/ine-emapt-review/)_

Even though I already had that foundation and had done several Android (and iOS) app audits at my company, I decided to approach it as if learning from scratch.

Mobile Hacking Lab gives you the content of its courses completely free! Which I find strange but really cool. You can go straight to their website, check it out, and take it.

![Free course from Mobile Hacking Lab](./images/imagen-3.png)

So I decided to complete the entire [learning path](https://academy.mobilehackinglab.com/course/free-android-application-security-course) they give you for free (which is key to understanding what the exam is like).

## TIPS

Alright! Now for the juicy part, things I learned along the way that are going to save you soooo much time…

While going through the learning path, there's a part where they recommend certain CTFs to complete so you're ready for the exam. Yes! You read that right, [mobile hacking CTFs](https://academy.mobilehackinglab.com/free-mobile-hacking-labs), THERE AREN'T MANY LIKE THIS.

> _First, you need to understand a bit about their business model. MHL has free courses and, on top of that, free CTFs! They have a lot of them, covering different types of apps (Android and iOS) where you exploit different vulns._

![Free CTFs from Mobile Hacking Lab](./images/imagen-4.png)

Now, it's true that these CTFs are free but... MHL gives you two options for completing them:

1. It gives you the .APK (for the Android CTF) or the .IPA (for the iOS CTF) so you can download it, run it in your own emulator, and solve it
2. It sets up an environment for you (based on their own software called Corellium), which emulates a phone with the app and tools already loaded, and you just need to connect via VPN to access the emulated phone.

![Corellium environment for MHL's CTFs](./images/imagen-5.png)

The catch is that when you create an MHL account, you get a "certain" amount of "credits," which is what powers their Corellium emulator. If you run out, you have to top up with about €20 for over 600 credits →

![Topping up Corellium credits on MHL](./images/imagen-6.png)

> _When I figured this out, everything clicked. Because when I saw everything was free and full of deals, the first thing I thought was: where do they actually make money from this?_

Alright! Even so, here's what I did to avoid spending too much money:

1. I created a checklist of machines to complete (we'll talk more about this later).
2. Using the knowledge the module gives you, plus a few things I looked up myself, I set up a phone emulator in Android Studio
3. For each CTF, I'd download its .apk and upload it to my rooted, emulated phone in Android Studio so I could spend as much time as I wanted without using up MHL's credits.
4. Finally, after getting the PoC for each CTF, I decided to save 2 CTFs to do exclusively with Corellium and use up the free credits you get when you sign up for MHL

With this, I accomplished two things: not spending money on credits, and getting familiar with the Corellium environment (which is used for the exam, more on that in a moment).

## Reinforcing the Knowledge

Now for real! After going through all this and completing MHL's learning path, I put together a list of CTFs to do in order to guarantee passing the exam →

![Checklist of recommended CTFs to prepare for the CAPT exam](./images/imagen-7.png)

![Checklist of recommended CTFs to prepare for the CAPT exam](./images/imagen-8.png)

![Checklist of recommended CTFs to prepare for the CAPT exam](./images/imagen-9.png)

## What Is the Exam Like?

After completing this course (or whenever you feel ready), you have the option to take an exam to become a Certified Android Penetration Tester (CAPT).

It costs €250, but... there is a deal where they give you two certifications for the price of one (2-for-1).

> _That's the one I bought. I got the CAPT (Android hacking) and the CIPT (iOS hacking) for €250 total. It's not available anymore, but I know they run it as a promotion every few months._

![Two-for-one CAPT + CIPT offer](./images/imagen-10.png)

The exam simulates a real pentest against an Android mobile app, and you have to find and exploit as many vulnerabilities as possible based on the OWASP Mobile Top 10 and the OWASP MASVS, then submit a pentest report within a maximum of 72 hours.

### How Did I Do It?

Easy, it's not that hard if you do those CTFs. I started on a Saturday at 11:30 a.m. (since you have to set a date for the exam) and that day I worked around 18 hours straight. The next day (Sunday), I continued around the same time and did about 2 more hours, then spent the rest of the day until 9 p.m. writing and submitting my report (about 10 more hours).

![Progress on the CAPT exam over the weekend](./images/imagen-11.png)

### How to Write the Report

Okay, a lot of you are probably wondering... how does the report thing work?

> _I racked my brain a bit over this one_

MHL gives you a WORD file as a template for you to overwrite and write your report in, easy. The problem for me is that it's a pain and, in my opinion, outdated.

> _Plus, I had to do two exams like this, and I really didn't feel like doing the same WORD file twice_

So... I decided to take that WORD file and turn it into a valid template that SysReptor could read, haha. Because... MHL doesn't have one.

Thanks to that, I wrote the whole report, took less time, and passed by submitting a quality report.

And yes... I'm a bit of a philanthropist xd, here's the link to my GitHub so you can download it and use it for FREE. God bless me.

- [SysReptor template for MHL's CAPT exam](https://github.com/eldeim/MobileHackingLab-Sysreptor-Template)

## My Experience

It was pretty good. Since I'd already done 2 CTFs with their Corellium software, I was already familiar with it, and it was all about reviewing, finding, exploiting, and reporting. Honestly, I felt comfortable and didn't run into any unexpected issues either (unlike other certs). 10/10

## Comparison with Other Certifications (CAPT vs eMAPT)

Alright, the critical part. Which one is better?

The short answer is: CAPT, without a doubt.

The long answer is: both. If I had no idea about mobile hacking, I'd start with the eMAPT since it's much easier (and better known). Then I'd move on to the CAPT since it goes into much deeper technical detail.

Even so, I don't know what it is about INE, but I just don't love their teaching style. I'm not sure if it's the filler content or the instructors, but in this case MHL was simple and good. The CTFs are also really solid. If I had to nitpick something, the certification logos feel a bit cheesy, way too AI-generated xd, but that's just a minor complaint xd.

![Logos of the CAPT and CIPT certifications](./images/imagen-12.png)

I don't have much else to add. I'd recommend checking out the review I did of INE's eMAPT:

- [eMAPT Review - Mobile Application Penetration Tester 2025 - Deep Hacking](https://blog.deephacking.tech/en/posts/ine-emapt-review/)

## Is It Worth It?

Yes! Without a doubt. For what the certification costs (€250) and everything you learn, it's definitely worth it. I'm really happy with the path I followed: eMAPT -> CAPT + CTFs -> CIPT + CTFs.

I think it's a balanced and realistic way to scale up in complexity. If you want to get into mobile hacking, this is a really good way to learn.

## Conclusion

It was a cool, technical certification. I can honestly say it challenged me in several ways and made me love mobile hacking even more.

I hope that if you're reading this, it encourages you to go for it. If you put in the time and effort, you'll become real experts on the subject.

> _Remember, with enough time and patience... well, not always xd_

This was me when I received the certification:

![Diploma for the CAPT certification](./images/imagen-13.png)

> _Cheers, with love, eldeim_
