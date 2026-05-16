---
id: "offsec-oswa-review"
title: "OSWA Review - OffSec Web Assessor 2026"
author: "matias-schiappacasse"
publishedDate: 2026-05-18
updatedDate: 2026-05-18
image: ""
description: "My personal experience taking the OffSec OSWA certification: preparation, exam day, and tips for passing the WEB-200."
categories:
  - "certifications"
draft: false
featured: false
lang: "en"
---

Hello, I hope you are all doing well. Today I bring you an interesting article (in my opinion) and, I believe, the first Spanish-language version: a review, personal experience, and some tips regarding the **OSWA** certification and the [WEB-200](https://www.offsec.com/courses/web-200/) course by [OffSec](https://www.offsec.com/).

![OSWA Banner](./images/banner.png)

I am quite excited writing this article, as I fulfilled a dream and a goal I had for many years, and finally, the conditions were right.

Last weekend (**04/18/2026**), I took the certification exam and managed to pass on my first attempt.

![OSWA Certificate - I'm blurring it because I don't want to doxx myself so easily](./images/oswa-cert.png)

In advance, I apologize if there are any spelling or grammar mistakes. I hope you enjoy it and find it useful.

---

* [Context](#context)
* [Why this certification and not another?](#why-this-certification-and-not-another)
* [Preparation (Course and labs)](#preparation-course-and-labs)
* [Exam Day](#exam-day)
* [The Report](#the-report)
* [Personal Opinion](#personal-opinion)
* [Tips](#tips)
* [References](#references)

## Context
In general terms, the "**OffSec Web Assessor**" certification is offered by [OffSec](https://www.offsec.com), which focuses exclusively on the fundamentals of web application security and the exploitation of vulnerabilities such as: XSS, CSRF, SQLi, SSRF, XXE, CORS, SSTI, and a few others.

This certification and the course are priced at **1,749** dollars (the cheapest plan, if you can call that cheap); you get a total of **90** days of access and **1** exam attempt. For the test itself, you have **23** hours and **45** minutes to complete it, and once that time is up, you have an additional **24** hours to upload the report with your documentation.

The certification includes the course called "**WEB-200**", which offers a general and relatively superficial overview of some concepts/aspects/topics, but sufficient given the context of the certification (meaning the level or the target audience).

It has a total duration of **231** hours of content, and through its 16 modules and challenge labs, the syllabus teaches how to perform reconnaissance and exploit vulnerabilities like **XSS**, **SQLi**, and **SSRF** using standard tools like Burp Suite and, well, **Kali Linux** (obviously, it's OffSec).

In summary, it is a structured and straight-to-the-point training to give you the practical foundation needed to take the **OSWA** exam.

Additionally, the course comes with a total of **11** machines for you to practice on (I will dive deeper into this later).

Based on the information provided by **Offensive Security**, students who complete the course will be able to:
* Understand and exploit different types of **Cross-Site Scripting** (XSS) vulnerabilities.
* Use fuzzing tools to discover "**SQL injection**" vulnerabilities.
* Learn about the "**Same-Origin**" policy and how to interact with "**cross-origin**" requests.
* Identify and exploit "**Cross-Site Request Forgery** ([CSRF](https://owasp.org/www-community/attacks/csrf))" vulnerabilities.
* Learn to use tools like **Burp Suite**, **Nmap**, and **Gobuster** for web application analysis.
* Learn parameter, file, and directory detection through tools like **Wfuzz** and **Hakrawler**.
* Among others...

> For more information: [OffSec WEB-200 course page](https://www.offsec.com/courses/web-200/).

---

## Why this certification and not another?
I will be very honest here, as this decision is heavily influenced by a very personal perception. The main factor for taking this certification was that some time ago I took the **BSCP** and failed. That discouraged me quite a bit, and I stopped putting effort into studying in general [I fully understand that failure is part of the path to success, but sometimes emotions or thoughts get the better of me].

Besides this, I noticed certain technical gaps in myself. Although I could successfully exploit vulnerabilities and such, I didn't have a fully clear understanding of the background, or rather, I felt that my repertoire of techniques was limited (I hope the point I want to convey is understood). I felt the need to review concepts, improve my principles, and build a more solid foundation on the basics that this syllabus covered; therefore, I think the best alternative was to have done the course.

Additionally, it was a dream for me and a very good opportunity to get to know and get closer to **OffSec**.

---

## Preparation (Course and labs)
I studied the course for almost two months (maybe a little less). In my case, time, work, training, and all that had a significant influence, but I'm sure if you are freer and you tryhard, you can finish sooner. In any case, I recommend taking your time.

In my opinion, the material is quite complete and very direct regarding relevant concepts; they don't beat around the bush. There are modules that are more extensive than others and, as I mentioned at the beginning, I noticed that there are topics touched upon superficially (I think because of the target audience). However, this is quickly solved with a Google search to make it clear.

Something key during study: taking notes, making structured summaries with the most relevant points, marking keywords, and using reliable alternative sources if you don't understand something or want to go deeper. I also highly recommend creating your own cheat sheets, whether with `payloads` for different vulnerabilities or theoretical concepts.

If you are wondering if the course is enough for the exam, I would say yes. If you give it the necessary importance and study conscientiously, it is more than enough to understand things and pass. Regardless, I relied on external resources, especially **PortSwigger** (Web Security Academy) to practice specific vulnerabilities in their labs.

### Labs
Additionally, it is super relevant not to neglect the practical side: do machines on TryHackMe, Proving Grounds, PortSwigger, and the course's own machines.

Regarding the course machines, they have a varied difficulty (which obviously will depend on each person). Personally, I found the labs to be between difficult and very difficult; in fact, there were two machines I couldn't complete. To give you a clearer idea as a statistic, there were labs where I took a couple of hours (about an hour and 60 minutes more than the time OffSec has stipulated), and others where I spent up to **14** hours to complete the machine.

> Please, don't cheat yourself by going to look for the solution or hints just to mark the machine as completed.
>
> If you look at the answers/hints, let it be for learning; changing that mindset will help you a lot... I say this from experience.

I consider it super important to do exam-style simulations: take a random machine from any platform and try to discover the vulnerabilities as quickly as possible. Keep changing your strategy and picking up the pace (1st attempt: one machine; 2nd attempt: 2 machines in a row; 3rd attempt: 4 machines in a row, and so on).

Also, try not to read the machine description so you don't know what you're going to encounter, making it as close to the exam as possible.

Another thing: with the machines you do, write a report detailing the findings. It is very important that you practice the format and criteria they will demand in the actual report.

One more thing: focus only on web application vulnerabilities. Don't start escalating privileges if you get **RCE**, as it's not relevant or required for the exam. Try to optimize your time and only do the tasks that contribute to the context of the certification. ✌😉

---

## Exam Day
Well, I scheduled the exam for a Saturday at **9:00 PM**. However, for reasons I don't know, they changed it to **8:00 PM** that same day and I hadn't received any notification or email informing me of this change. Luckily, I thought to check the platform where you schedule, otherwise, they probably would have canceled my exam due to the delay. Aside from that detail, I didn't have any other problems or misunderstandings with **OffSec**.

I set that time because, in my opinion, I function better at night (I'm the lord of the night xD). My plan was to stay up until **4:30 AM** to advance as much as possible, then sleep and wake up between **10:30 AM** and **11:30 AM**.

When the day finally arrived, I must say I was calm, but at the same time anxious and nervous. During the course of the day, I made sure to stay away from any screen, notebook, or cell phone to keep a cool head and arrive fresh for the exam. I went out for a motorcycle ride to distract myself and, while I was at it, I went to buy some things for the hours of the test: mainly bottles of water, three Zero Cokes, some protein desserts, bars, and some sour gummies.

Without further ado, OffSec recommends connecting at least 15 minutes early for identity validation and the whole process with the proctor, but I decided to connect a bit earlier in case any problems arose. (A tip: don't connect an hour or 40 minutes early, because the thing might bug out; 20 minutes max). I entered and no one was there, but after three minutes a proctor connected. They greeted me with the default welcome message and asked if I wanted to start the validation, to which I replied yes. They asked me to show my ID, but with the webcam it looked blurry, so I ended up presenting my ID from the PC screen (a co-worker recommended I do that, thank you very much! 😊). Once that was done, they asked me to show my room and that was it: verification process successfully completed, gentlemen.

Once it turned **8:00 PM**, I received an email with all the information needed for the exam. I successfully connected to the **VPN** and created the corresponding folders for the **5** exam machines.

I started in order. After about **30** minutes I managed to get my first flag (`local.txt`). As a strategy, I documented the vulnerability I found simultaneously (only taking screenshots and organizing the **PoC**); I knew that if I started writing text, I would lose valuable time, and that's what the extra report time is for.

After a while, I got stuck on that same machine; I couldn't find the second vulnerability to get the `proof.txt`, so I decided to change targets. My rule was: if I saw that it took me more than **40** minutes to get a flag, I would change machines immediately so as not to waste time. That tactic was working well for me; between **11:40 PM** and **12:50 AM** I already had a total of 3 flags. However, after that, I got really blocked. I couldn't find any new vulnerability, so I started to get desperate and my pace dropped. Noticing it, I decided to pause for a bit, asked the proctor for a break to go to the bathroom, wash my face, drink water, and eat something.

Upon returning, I managed to get my 4th flag. But, again, the same thing happened: I was stuck until 5 in the morning without getting anything and I started doing silly things due to exhaustion. I told the proctor I was going to sleep, paused my camera, and they stopped my **VPN** connection. I slept like never before (it surprised me, because I was anxious). I woke up around **11:20 AM**, ate, showered, activated the camera, told the proctor I was back, and continued.

There were several moments during the exam where I truly believed I was going to fail. My thoughts played a trick on me; everything had turned dark and I said to myself: "I'm going to fail this thing, I'm screwed", "I'll have to pay for the retake" xDDD. (I'm laughing now, but at that moment it was terrible).

Recall that the exam consists of **5** machines, and each one has two flags (`local` and `proof`). After several hours without getting anything new, I finally got my fifth flag, but I still had to pwn more things to secure the points. I went back to those machines where I hadn't been able to find the vulnerability for the `proof` and, after hours of trying and trying, I managed to compromise a machine completely. I think at that point I already had the necessary points to pass, but I decided to continue and get another flag just to be safe, in case I made some silly mistake with the report (teslita moment).

Time passed and it seemed like I wouldn't get anything else. But, literally, **30** minutes before the end of the exam, I managed to get an extra flag. I screamed like a madman, danced, and did all those things I do (those who know me know how I am xD). After that, I had to apologize to the **proctor**, hahaha, I felt very embarrassed. I used the remaining time to make sure I took more screenshots, saved command outputs, etc.

The final hour arrived, they cut the **VPN**, I said goodbye to the proctor, and I only had the report left to do...

> I don't remember every single minute of how the exam went, so the times I mentioned are more of an approximation, so don't take them too literally or seriously.
>
> The truth is that the **proctored** part isn't that terrible. For people who hate cameras or feel uncomfortable with that, I assure you that after a while you completely forget they are watching you, so don't worry. ✌

After a few minutes, I lay down in bed. Then my mother came in and said: 'And you? What are you doing in bed? Do the report!' xD. But I replied that I was tired, so I would do it early tomorrow... (Surely teslita was going to fall asleep quickly and wake up early on a Monday he has off xDD). I had a feeling I should have made some progress that same night, as I am very slow at documenting.
![Meme about procrastinating the exam report writing](./images/jerry-meme.png)

As expected, I ended up waking up around **11:50 AM** and only started the report at **1:20 PM**. While I was doing it, I realized that I hadn't taken the screenshots with the correct format for the flags section; I had a moment of madness and Windows gave me an error. But as I am a man who solves things, I saved myself: I took the screenshots again from Burp however I could, took some from the browser with the tabs I still had open, and that was it, I solved it. The worst part is that it had happened with **3** or **4** flags. After that waste of time, I resumed at full speed with the writing of the findings.

While I was writing, I saw the time and it was getting closer to the deadline. Again, thoughts that I wouldn't make it entered my mind and I almost lost it, but I told myself: "I can't fail, especially not with the report", so let's get to it.

I finished the report at **7:00 PM**, exported it, gave it a quick review, and at **7:13 PM** I sent it...

I stayed very paranoid (worried) about the format issue; according to me, I hadn't complied and was going to fail because of those silly mistakes. Literally, I spent the whole day thinking about that. Tuesday came and I couldn't concentrate at work. Then my grandfather asked me how it went, I told him about the mistakes I had made with the report, expressed my concern, and I saw the maximum disappointment on his face (as if saying "this guy is an idiot and deserves a slap" 😂).

Days passed and on Wednesday morning I dreamed that the email with the results arrived and that I had passed. Literally, I woke up startled, the first thing I did was look for the email and, obviously, it wasn't there.
![Reaction after waiting for the OSWA exam results](./images/locura.jpeg)

I worked normally and, after work, I fell asleep. I must have woken up around **10:50 PM**; I checked the inbox and there it was, the email with the results. I couldn't believe it. I didn't want to open it (the man has serious trust issues 😎). I said in my head: 'Alright, open it, anyway, you failed'; I started reading and, well, I passed.

It was a maximum relief and top happiness. I started dancing, put on my Russian hardbass at full blast and that was it, xD. That was my experience with the exam; I hope you liked it and got a laugh out of it.

---

## The Report
For the report I used [SysReptor](https://sysreptor.com/) and the template, but I made some modifications regarding the color palette, style, and images (as you know, I like the report to look pretty).
![Original SysReptor report template for the OSWA certification](./images/report.png)
![Customized SysReptor report template with modified color palette and style](./images/custom.png)

Still, the version I sent is not **100%** my style and taste, but enough to feel comfortable. Once I have the template modified and with the style I want, I will publish it here (legend has it I said the same thing in a previous review and never uploaded the template).

---

## Personal Opinion
Regarding the course, I liked it a lot; I learned quite a few things and reviewed mostly basic concepts. I came away with a more solid foundation and at work, I've been able to put my new skills and knowledge into practice, so I'm super happy.

I found the exam to be very **CTF style** (in a good way, though), which I didn't like much. I felt that the course machines were much more complex than the exam itself. Mind you, I'm not saying the exam is easy (since there was one machine where I straight up couldn't get any vulnerability or flag). I really appreciate that the labs had a higher difficulty because, in a way, they prepare you and help you think a bit further or simply keep trying, which served me greatly during the actual test.

If you ask me if I recommend this certification: yes, totally. But it depends a lot on who you are and what you are looking for. If you are someone who wants to enter the world of web pentesting, or if you already have some experience but feel you lack organized concepts and a more solid theoretical and practical foundation (just what was happening to me), it will suit you excellently. Now, if you already have a lot of experience in the web field or are looking for a realistic environment not so focused on the **CTF** format, perhaps it will fall short and you should aim for something more advanced. But as a starting point or to consolidate knowledge, it's a good option in my opinion.

---

## Tips
Here are some tips that can help you prepare better and pass:

* Take notes.
* Read the study material carefully.
* Make structured summaries and focus on the most relevant points.
* Make your own cheat sheets.
* Don't go for solutions/hints if it's not for learning.
* Practice with machines almost every day.
* Do exam simulations.
* Write and practice vulnerability documentation.
* If you don't understand something, search for it, don't stay with those gaps.
* Try Harder!
* Develop your own methodology that you feel comfortable with.
* Practice and understand vulnerabilities.
* Maintain order and take notes on the machines, declare endpoints, technologies, users, etc.
* Don't leave the report for the end. If you find a vulnerability, start pasting the photos in the PoC.
* Take full screenshots.
* Go for a walk or get some fresh air.
* Don't go in blindly.
* Prioritize and use your time well.
* When you feel lost, do a small recap of what you have and check if you don't have any pending flows to review.
* Take breaks and stay hydrated.
* Consistency.

---

## References
Below I attach some links that helped me and reviews I read at the time.
* [OSWA: A different course on web attacks – emvee-nl](https://emvee-nl.github.io/posts/OSWA-a-different-course-on-web-attacks/#practice-makes-perfect)
* [WEB-200 OSWA Exam Guide – OffSec Help Center](https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide)
* [WEB-200 course page – OffSec](https://www.offsec.com/courses/web-200/)
* [PortSwigger labs: Cross-Site Scripting (XSS)](https://portswigger.net/web-security/all-labs#cross-site-scripting)
* [PortSwigger labs: Cross-Site Request Forgery (CSRF)](https://portswigger.net/web-security/all-labs#cross-site-request-forgery-csrf)
* [PortSwigger labs: Cross-Origin Resource Sharing (CORS)](https://portswigger.net/web-security/all-labs#cross-origin-resource-sharing-cors)
* [PortSwigger labs: XML External Entity (XXE) injection](https://portswigger.net/web-security/all-labs#xml-external-entity-xxe-injection)
* [PortSwigger labs: Server-Side Request Forgery (SSRF)](https://portswigger.net/web-security/all-labs#server-side-request-forgery-ssrf)
* [PortSwigger labs: OS command injection](https://portswigger.net/web-security/all-labs#os-command-injection)
* [PortSwigger labs: Server-Side Template Injection (SSTI)](https://portswigger.net/web-security/all-labs#server-side-template-injection)
* [PortSwigger labs: Path traversal](https://portswigger.net/web-security/all-labs#path-traversal)
* [PortSwigger labs: SQL injection](https://portswigger.net/web-security/all-labs#sql-injection)
* [PortSwigger lab: Insecure direct object references (IDOR)](https://portswigger.net/web-security/access-control/lab-insecure-direct-object-references)
* [PortSwigger lab: User ID controlled by request parameter with password disclosure](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter-with-password-disclosure)
* [MDN Web Docs](https://developer.mozilla.org/es/docs/Web/)
* [TryHackMe challenges](https://tryhackme.com/challenges)

---

I hope it serves you and thank you very much for reading ;)

Being here is also a dream =) Thanks Sikumy_
