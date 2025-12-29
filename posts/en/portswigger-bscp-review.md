---
id: "portswigger-bscp-review"
title: "BSCP Review - Burp Suite Certified Practitioner 2023"
author: "{REDACTED}"
publishedDate: 2023-06-19
updatedDate: 2023-06-19
image: "https://cdn.deephacking.tech/i/posts/portswigger-bscp-review/portswigger-bscp-review-0.webp"
description: "Complete review of the BSCP (Burp Suite Certified Practitioner) certification from PortSwigger: exam experience, preparation with Web Security Academy, tips and resources to pass."
categories:
  - "certifications"
draft: false
featured: false
lang: "en"
---

Hey everyone! In this post we'll be talking about what is, in my opinion, the best black-box web pentesting certification out there, the BSCP, better known as Burp Suite Practitioner.

- [What is the BSCP?](#what-is-the-bscp?)
- [Web Security Academy: the key to the BSCP](#web-security-academy:-the-key-to-the-bscp)
- [Mystery Labs](#mystery-labs)
- [The exam](#the-exam)
- [Tips](#tips)
- [Burp extensions](#burp-extensions)
- [Personal opinion](#personal-opinion)
- [Additional resources](#additional-resources)

## What is the BSCP?

If you've been in the web hacking world for more than a week, you've most likely used Burp Suite, or at least it should ring a bell, since it is undoubtedly the most widely used tool for web pentesting.

Burp Suite has been developed and is maintained by [PortSwigger](https://portswigger.net/), one of the leading companies in web application pentesting. They focus on software and tool development, as well as conducting research and discovering new types of vulnerabilities, which they then share through articles on their website and presentations at major cybersecurity events like [DefCon](https://defcon.org/) or [BlackHat](https://www.blackhat.com/).

Additionally, they offer a completely free [academy](https://portswigger.net/web-security/learning-path), where you have access to up to [240 labs](https://portswigger.net/web-security/all-labs) (as of today) covering 25 different web vulnerabilities. And yes, contrary to what many people think, there are things beyond XSS, SQLi, CSRF, SSRF, or XXE, and this academy is the ideal place to learn about them.

The BSCP is the certification offered by PortSwigger to test your web pentesting knowledge. You have four hours to compromise two web applications, each consisting of three phases, and in each phase you'll need to find one or more vulnerabilities that you'll have to exploit to access the next stage.

In phase 1 you start as an unauthenticated user and your goal is to escalate to a low-privilege user, then in phase 2, escalate to an administrator user, and finally in phase 3, read a file from the system.

This means you need to exploit 6 vulnerabilities in 4 hours, which works out to 45 minutes per vulnerability. It might seem like a short time, and it really is if you're not fully prepared, but the goal of the certification is also to evaluate that you have the knowledge well internalized, a good methodology, and agility.

## Web Security Academy: the key to the BSCP

Before taking the certification, I heard a couple of statements from some people who had already taken the exam: that there isn't enough time and that the academy doesn't really prepare you.

After having done it, my opinion is that both statements are not true. If you're well prepared, 4 hours is plenty of time. As for the academy, it's the best place to practice, for three reasons: first, the exam environment is identical to the labs, so if you're already familiar with them, the environment will feel familiar from the moment you start. Second, you might be lucky enough that one or two vulnerabilities in the exam remind you of a lab, although if they appear, you may need to change some things and adapt them to the environment. Third, any vulnerability you encounter in the exam is covered in the academy.

In case you want a reference, this is the number of labs I had completed when I took the certification:

![Number of completed labs in Web Security Academy](https://cdn.deephacking.tech/i/posts/portswigger-bscp-review/portswigger-bscp-review-1.avif)

Obviously, that's a lot and you don't need to do all of them, but I was having fun and between one thing and another I ended up doing practically 230 of the 240 available. I highly recommend them for the exam, but above all, for learning in general. James Kettle, PortSwigger's Director of Research, and Gareth Heyes conduct vulnerability research every year, and many of the labs in the academy are replications of real cases they've encountered. Examples of this are the HTTP Request Smuggling, Server-Side Prototype Pollution, or Web Cache Poisoning labs.
- _[HTTP Request Smuggling research at PortSwigger](https://portswigger.net/research/request-smuggling)_
- _[Web Cache Entanglement research at PortSwigger](https://portswigger.net/research/web-cache-entanglement)_
- _[Server-Side Prototype Pollution research at PortSwigger](https://portswigger.net/research/server-side-prototype-pollution)_

I strongly encourage you to check out these articles, or alternatively, watch the corresponding presentation in video format, because many times certain attack vectors aren't very clear and having access to more documentation can help you understand them better.

If you're just starting out in web pentesting, you can follow the learning path recommended by PortSwigger:
- _[Web Security Academy learning path](https://portswigger.net/web-security/learning-path)_

## Mystery Labs

Let's assume you've already completed a good number of labs covering most vulnerabilities (ideally all of them). Well, now comes the stage where you need to train your reconnaissance phase, since in the exam there's no big title telling you "HEY YOU NEED TO DO AN HTTP REQUEST SMUGGLING TO STEAL THE USER'S SESSION COOKIE," like in the labs.

For this, PortSwigger challenges you with mystery labs, where they spawn a lab without any context and you have to solve it. You can choose the lab level (Apprentice, Practitioner, or Expert), whether you only want labs you've already done, or the category if you want to train a specific vulnerability.

![Mystery Labs interface in Web Security Academy](https://cdn.deephacking.tech/i/posts/portswigger-bscp-review/portswigger-bscp-review-2.avif)

Personally, I dedicated myself to doing many Practitioner-level mystery labs, which is the intermediate level, since I was more interested in training the reconnaissance phase than the exploitation phase. There are Expert labs that are long by themselves, and adding the enumeration aspect would extend them too much.

One piece of advice I would give you is to review all the labs you've done before taking the exam. A mistake I made was taking for granted labs I had done 5-6 months ago.

## The exam

The exam cost is about 99 dollars plus tax. It's very cheap compared to other certifications, although you either go very well prepared or you'll likely have to take it more than once to pass. Once you've purchased the certification, you'll need to go through Examity, which is the proctored system that BSCP uses. In reality, all you need is to provide a photo of your face and one of your ID (ID card, passport, or whatever you want).

Then, you'll need to enter the password that Examity provides in the exam, and once you've completed this, you can consider the proctored session finished. The truth is that the only thing they verify is that, the photo you provide and your ID. However, make sure to create a project in Burp Pro where you perform the entire exam and save it, because at the end of it, PortSwigger will ask for it to verify that everything was correct and that you didn't cheat. Be very careful with this, because if they catch you cheating, they will permanently ban you from their platform and from the possibility of taking the exam in the future. Be honest with yourselves.

Because of being able to save the project and also for Burp Collaborator, you will mandatorily need Burp Professional. You don't need to buy it, when you're going to take the exam, just request the free 1-week trial.

Once you've done all this, you can start the test. 4 hours, 2 web apps, 6 vulnerabilities, 45 minutes for each one. There are some vulnerabilities that are complicated to find manually, therefore, it's essential that you learn to use [Burp Scanner](https://portswigger.net/burp/documentation/scanner), to help you in that reconnaissance phase. And have several alternative ways to exploit the same vulnerability.

I have to admit I didn't pass on my first try, because of the mistake I mentioned before. There were modules I had done maybe 5 months ago, and I showed up to the exam without having refreshed them. And of course, if you spend part of the test searching through labs for how to do X thing, you lose a lot of time.

After failing my first attempt, I decided to reinforce my weaknesses. For example, although I understood the basic operation of HTTP Request Smuggling, there were certain attack vectors I didn't understand 100%. So I decided to read the corresponding research articles, I did all the labs again including the experts, and I also made a series of videos explaining each lab.

If you think you understand something, try to explain it. If you succeed, great, if not, you don't understand it. And the clearer and more concise you are, in most cases, it means you understand it well. When trying to explain HTTP Request Smuggling at first, I realized that when I got into details, I got lost and that's why I decided to reinforce that concept by trying to explain it. I encourage you to do the same with any vulnerability you feel uncomfortable with. You don't need to make videos, you can create articles or simply explain it to your coworker or friend.

I took the exam again after doing the above and refreshing some concepts that were a bit rusty, and this time I did manage to pass. I finished around the third hour, although I know colleagues who did it in two hours and even 1 hour and a half. Here we have to be fair and say that the exam is not the same for everyone, but rather it's generated randomly, so it's inevitable that one exam will feel easier than another. But the point is that there's plenty of time.

If during your first attempt you see that things are going badly and you'll probably fail, I would recommend that, at least, you write down the payloads you've used that helped you exploit some vulnerability. Because you might be lucky that in your second attempt, one of the six phases is identical or almost identical to one of the phases from your first attempt, so you'd save time there.

When you finish the exam, a user interface appears congratulating you and asking you to upload your project in zip format. However, when trying to upload it, I didn't see any feedback in the interface assuring me that my file had been uploaded correctly. I would just drag it or click a button that said "Browse Files," select my file but then nothing happened.

If you've read my _[OSWE review on Deep Hacking](https://blog.deephacking.tech/en/posts/offsec-oswe-review/)_, you'll know that I'm a person who loves being up at night doing hacking and especially, taking certification exams during those hours. Well, I started the exam at 1 AM and finished around 4 AM, so PortSwigger support was inactive, since they would naturally be sleeping. When I saw that the file wasn't uploading, I sent an email to support with the corresponding screenshots and the ZIP file containing my Burp project.

In the morning they replied and told me they were aware of a bug in the file upload after the exam. With this I just want to tell you that if you take the exam shortly after reading this review, that bug might still be there, so don't stress and just send your ZIP to support, and they'll take care of sending it to the corresponding team that reviews these things.

Hours later, I received the email telling me I had passed.

![BSCP exam passing email](https://cdn.deephacking.tech/i/posts/portswigger-bscp-review/portswigger-bscp-review-3.avif)

## Tips

- Use Burp Scanner for the reconnaissance phase. There are vulnerabilities that can take you time to find manually. While you're exploring the web app's functionalities, make sure to have something running in the background (in this case Burp Scanner). This way you save time.

- Follow this guide and complete all the steps:
    - _[BSCP certification preparation guide](https://portswigger.net/web-security/certification/how-to-prepare)_

- Although it's said that the exam level corresponds to the Practitioner level of the labs, it doesn't hurt to do some Expert labs to reinforce your understanding.

- Read the _[PortSwigger research articles](https://portswigger.net/research/articles)_.

- If you don't like reading, watch the _[video presentations on PortSwigger's channel](https://www.youtube.com/@PortSwiggerTV)_.

- Do the practice exam several times. It's a test similar to the real exam that PortSwigger makes available so you can familiarize yourself with the exam format. You can find it at _[official BSCP practice exam](https://portswigger.net/web-security/certification/practice-exam)_. The first time try to do it normally. The second time try to automate everything and do it in the shortest time possible. For example, if you find a Java deserialization, you can use the Deserialization Scanner extension and save time, if you find an SQLi you can use SQLMap. If you don't know these extensions, I highly recommend _[this video by bmdyy solving the Practice Exam](https://youtu.be/yC0F05oggTE)_, you'll learn several very good tricks.

- If something isn't 100% clear to you, try to explain it through videos, articles, or telling it to a coworker/friend. Rely on the _[PortSwigger research articles](https://portswigger.net/research/articles)_.

- Have a good foundation in HTML, CSS, and JavaScript. Many times in web hacking, it's difficult to understand certain more convoluted attack vectors if you don't have a solid foundation in web languages. If you feel uncomfortable with this, reinforce it because it's important to understand more complex things.

## Burp extensions

As you progress through the academy, they introduce you to certain extensions that are useful for certain cases. Here's a summary of those I liked the most:
- _[Param Miner extension for Burp Suite](https://portswigger.net/bappstore/17d2949a985c4b7ca092728dba871943)_ - fuzzer for hidden parameters and headers.
- _[HTTP Request Smuggler extension for Burp Suite](https://portswigger.net/bappstore/aaaa60ef945341e8a450217a54a11646)_ - contains different Request Smuggling vectors you can use.
- _[Agartha extension for Burp Suite](https://github.com/volkandindar/agartha)_ - this one isn't in the academy, but I recommend it because it provides a ton of payloads for LFI, Command Injection, SQL Injection, with WAF bypass included. You can, for example, generate the payloads and put them in the Intruder.
- _[Turbo Intruder extension for Burp Suite](https://portswigger.net/bappstore/9abaa233088242e8be252cd4ff534988)_ - useful for when you have to play with timing (race conditions) or want to send partial requests (for example only send the headers and after X seconds, send the body).
- _[Content Type Converter extension for Burp Suite](https://portswigger.net/bappstore/db57ecbe2cb7446292a94aa6181c9278)_ - convert the request body from XML to JSON and vice versa automatically.
- _[JWT Editor extension for Burp Suite](https://portswigger.net/bappstore/26aaa5ded2f74beea19e2ed8345a93dd)_ - useful when dealing with JWT tokens.
- _[Server-Side Prototype Pollution Scanner extension for Burp Suite](https://portswigger.net/blog/server-side-prototype-pollution-scanner)_ - as its name indicates, useful for Server-Side Prototype Pollution.
- _[DOM Invader tool integrated in Burp Suite](https://portswigger.net/burp/documentation/desktop/tools/dom-invader)_ - comes integrated with Burp's browser, and is useful for finding Client-Side Prototype Pollution.
- _[Java Deserialization Scanner extension for Burp Suite](https://portswigger.net/bappstore/228336544ebe4e68824b5146dbbd93ae)_ - you can load the ysoserial .jar and automate the tedious procedure of exploiting a Java deserialization.
- _[Hackvertor extension for Burp Suite](https://portswigger.net/bappstore/65033cbd2c344fbabe57ac060b5dd100)_ - tool that supports various types of encodings and escapes (HTML5 entities, hex, octal, unicode, etc.)

## Personal opinion

In this section I'd like to share my personal opinion, with complete honesty about the certification.

Considering the cheap price of the certification compared to the rest, that the academy and labs are completely free, that the certification is offered by one of the pioneering companies in everything related to web security, in addition to the quality research articles they offer and share also for free and the YouTube channel where they create related content, the only thing I can say is that this is, without a doubt, the best value-for-money certification you can find for black-box web pentesting.

If we compare it to the eWPTXv2, the reality is that, in my opinion, it beats it in every aspect. They teach a greater number of vulnerabilities, the price is cheaper, there are more resources, the labs are free and of much higher quality (in eWPTXv2 you have to pay for INE and the labs are poor), and the support service attends to you kindly and quickly, something I've heard several complaints about regarding INE. I also think I've learned quite a bit more overall.

Therefore, if someone asks me about learning web pentesting, what I usually do is redirect them to the Web Security Academy, since in my opinion, it's the best resource that exists for this learning.

And that's all for today! I hope you enjoyed this BSCP review.

## Additional resources
- _[Video by bmdyy solving the Burp Practice Exam](https://youtu.be/yC0F05oggTE)_
- _[Video by Emanuele Picariello about the BSCP](https://youtu.be/KfX9OS9POvA)_
- _[BSCP review by Micah Van Deusen](https://micahvandeusen.com/burp-suite-certified-practitioner-exam-review/)_
- _[Emanuele Picariello's YouTube channel](https://www.youtube.com/@emanuelepicariello)_
- _[Rana Khalil's YouTube channel](https://www.youtube.com/@RanaKhalil101)_
- _[BSCP study notes by botesjuan](https://github.com/botesjuan/Burp-Suite-Certified-Practitioner-Exam-Study)_
- _[XSS Cheat Sheet at PortSwigger](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet)_
- _[SQLi Cheat Sheet at PortSwigger](https://portswigger.net/web-security/sql-injection/cheat-sheet)_
