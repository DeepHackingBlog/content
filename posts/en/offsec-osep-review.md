---
id: "offsec-osep-review"
title: "OSEP Review - OffSec Experienced Penetration Tester 2024"
author: "victor-capatina"
publishedDate: 2024-01-02
updatedDate: 2024-01-02
image: "https://cdn.deephacking.tech/i/posts/offsec-osep-review/offsec-osep-review-0.webp"
description: "Complete and honest review of the OSEP certification (OffSec Experienced Penetration Tester), including tips, exam advice, and useful tools to pass."
categories:
  - "certifications"
draft: false
featured: false
lang: "en"
---

Hello everyone, my name is Víctor and I'm here to give you a short but honest review about OSEP (OffSec Experienced Pentester). Yes... another certification that takes €1600 from your wallet (Or from the company where you work, if you're lucky.)

![Victor Capatina's OSEP Certificate](https://cdn.deephacking.tech/i/posts/offsec-osep-review/offsec-osep-review-1.avif)

A few days ago, I received the confirmation email that I'm officially OSEP Certified, so I went out thinking I would have a special aura around me, but it turns out I don't 😒.

But well, leaving the jokes and nonsense aside, let's get to the good stuff: How is the certification? Is it worth it? The short answer is yes. The long answer is also yes, but with more text, so here we go:

According to OffSec, in OSEP you will learn the following things:

- Client-side code execution with Office (Malicious Macros)
- Malicious code execution with JScript (Not to be confused with JavaScript)
- Process Injection and Migration
- Introduction to antivirus evasion
- Advanced antivirus evasion techniques
- Application whitelisting
- Network filter bypassing
- Kiosk breakout
- Windows credentials
- Lateral movement in Windows and Linux
- Microsoft SQL attacks
- Active Directory exploitation

Although the curriculum is quite extensive (the PDF has approximately 700 pages), the reality is different, since during a large part of the course they teach you the why of things and the traditional and methodical way of doing things (such as bypassing AMSI using winDBG) and then summarize those 20-30-40 pages into a single command that does exactly the same thing. However, this is not a bad thing, as it teaches you how things work underneath, which is fundamental for you to understand their exploitation.

## Is it necessary to have OSCP before?

Yes and no. OSCP focuses on finding and using public exploits, while OSEP is focused on active directory and antivirus evasion topics. Additionally, (almost) everything you need to know will be taught in the course, although knowing extra things never hurts.

If you're someone who already has Active Directory knowledge (it doesn't need to be very deep), save yourself the $1600 that OSCP costs and go for OSEP directly. With guts! WHAT ARE WE, LIONS OR CHICKENS?

However, I'll say one thing, and that is that the OffSec folks are a bit sneaky, since they ask you for things they take for granted that you know because they assume you already have OSCP before taking OSEP.

## What certifications are worth getting before?

Short and clear, CRTP and CRTO will give you a push, but don't expect them to give you all the knowledge you need.

Even so, I have to say that you can perfectly take OSEP without having either of the two. Yes, you're going to suffer like crazy, but nothing is impossible (Well, yes. Getting your company to pay for OSEE).

If you don't want to spend money on certifications, you have HackTheBox's Pro Labs, among which I highly recommend RastaLabs and Cybernetics. They say they prepare quite well for the exam (I didn't do them. I have no money. I gave it all to OffSec)

## Course Tips

Since it's Christmas, I'm going to give you a little gift and tell you USEFUL tips for the certification and the exam:

1. If you're short on time and want the certification, skip the part of the PDF that explains a lot of fluff (like low level stuff, etc). Just keep the commands they use and understand what they're for.
2. Prepare backup tools ALWAYS. Always have a plan B for any attack vector.
3. Learn to use metasploit WELL (or another C2 you want, but not commercial, like Cobalt Strike).
4. Do the labs 2-3 times. Each time try something different. Try other attack vectors. Have a plan Z if necessary.
5. Focus on enumeration as if your life depended on it. Powerview, BloodHound, and Impacket will be your best friends during these months.
6. Write to memory instead of disk whenever possible.
7. If you're stuck on any part, ask for help in the OffSec discord. People are very nice and will always help you.
8. Keep your notes as organized as possible (I have them divided by categories, such as: Kerberos, Powerview enumeration, Antivirus Evasion, etc).

## Exam

The exam is 72 hours. You have 48 hours to take the exam and 24 hours for the report. I highly recommend doing what I did: While you take the exam, take notes (obviously) in such a way that when you finish your exam, you reset the lab, and ONLY following your notes, you do everything again, so you make sure that when making the report you don't miss anything.

As for the report, don't wait for the 48 hours of the exam to pass to do it. Start it once you finish the exam, in front of the proctor (I even submitted it in front of the proctor, with guts).

Explain everything as detailed as possible. Don't be afraid to write a lot. They won't charge you per word.

## Tools

1. For all SQL exploitation topics: [Octoberfest7's OSEP-Tools SQL](https://github.com/Octoberfest7/OSEP-Tools/tree/main/sql)
2. Constrained Language Mode (CLM) Bypass: [calebstewart's bypass-clm](https://github.com/calebstewart/bypass-clm)
3. Process Hollowing in memory (Save this like it's the holy grail): [qtc-de's Process Hollowing gist](https://gist.github.com/qtc-de/1ecc57264c8270f869614ddd12f2f276)

## Farewell

And well. That's all I have for you today. If you have any questions, suggestions, or whatever, you can find me at:

- Discord: viksant
- [Victor Capatina's LinkedIn](https://www.linkedin.com/in/victor-capatina-952032230/)
