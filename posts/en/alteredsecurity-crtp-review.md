---
id: "alteredsecurity-crtp-review"
title: "CRTP + Bootcamp Review - Certified Red Team Professional 2022"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-06-10
updatedDate: 2022-06-10
image: "https://cdn.deephacking.tech/i/posts/alteredsecurity-crtp-review/alteredsecurity-crtp-review-0.webp"
description: "Complete review of Altered Security's CRTP certification: course content, Active Directory labs, hands-on exam, and my experience as a Certified Red Team Professional."
categories:
  - "certifications"
draft: false
featured: false
lang: "en"
---

What a month of May I had 😵🥴. A month ago I started Pentester Academy's "[Attacking and Defending Active Directory](https://bootcamps.pentesteracademy.com/courses)" bootcamp. After a few weeks of classes, notes, the lab, and finally the exam, I can say I passed the certification:

![AlteredSecurity CRTP Certificate](https://cdn.deephacking.tech/i/posts/alteredsecurity-crtp-review/alteredsecurity-crtp-review-1.avif)

So I am going to talk a bit about how everything went, the classes, the lab, my opinion, experience, comparisons, and more:

- [Context](#context)
- [Bootcamp](#bootcamp)
- [Exam (CRTP)](#exam-crtp)
- [Is it worth it?](#is-it-worth-it)
- [Notes](#notes)
- [Tips](#tips)

## Context

The "[Attacking and Defending Active Directory](https://www.pentesteracademy.com/activedirectorylab)" lab, according to the website, lets you practice the following:

- Practice various attacks in a fully patched realistic Windows environment with a Server 2016 and SQL Server 2017 machine.
- Multiple domains and forests to understand and practice cross trust attacks.
- Learn and understand concepts of well known Windows and Active Directory attacks.
- Use Windows as an attack platform and leverage trusted OS features like PowerShell and others for attacks.
- Try scripts, tools, and new attacks in a fully functional AD environment.

From my experience, you can indeed practice all of this in the lab. Although it is not exactly the same as the diagram, the structure is roughly as follows:

![AD lab topology](https://cdn.deephacking.tech/i/posts/alteredsecurity-crtp-review/alteredsecurity-crtp-review-2.avif)

They also promise you will practice the following concepts:

- Active Directory enumeration
- Local privilege escalation
- Domain privilege escalation
- Domain persistence and dominance
- Cross trust attacks
- Forest persistence and dominance
- Defenses: Monitoring
- Defenses and bypass: Architecture and work culture changes
- Defenses and bypass: Deception
- Defenses and bypass: PowerShell

Again, it is true that all of these concepts are covered. However, I would like to add a note regarding "Local privilege escalation." This is an Active Directory course, not a local privilege escalation course, so the privesc content is minimal and handled entirely with PowerUp.

This covers what you can practice and what you will see in the lab. When you purchase the lab, note that the lab is not the same as the bootcamp, you get the following:

- First, you can buy 30, 60, or 90 days. You can buy one term and extend it if you want, I do not know the extension pricing. In any case, once you purchase it, you have up to 90 days to start.
  - Access is provided via VPN plus RDP or via the web interface. You can choose either at any time.
- You are given the full "[Attacking and Defending Active Directory](https://www.pentesteracademy.com/course?id=47)" course from Pentester Academy, 14 hours of video. This is essentially the same material covered in the bootcamp. What are the differences?
  - The bootcamp slides may be a bit more up to date because the sessions are live. Even if there are differences, the core material will not change.
  - In the bootcamp, classes are live, so in addition to asking questions in real time, the instructor, Nikhil Mittal, may occasionally share off the cuff information that is not in the recorded course. The reverse could also be true in places.
- The price also includes one exam attempt.

All of this costs $249 at the time of writing for the cheapest option, 30 days of lab access.

## Bootcamp

As for the bootcamp, the current price is $299. I covered some of this above, but in short, the bootcamp includes:

- 30 days of lab access plus everything included if you bought the lab separately, everything mentioned above except the recorded video course since you will see it live.
- One weekly class of three hours over four weeks, four classes in total. Classes are on Sundays. In Spain, they start at 17:00 during daylight saving time, otherwise at 16:00.
- Live classes are basically Nikhil explaining the course PowerPoint.
  - Note: I do not know if buying only the lab includes the actual PowerPoint file. You will see it in the videos, but I am not sure if you get the file separately.
- A dedicated Discord server is created for the people taking the bootcamp that month, with Nikhil in the server to answer questions. This is great because you can ask anything there and someone will reply, and if not, Nikhil will, though sometimes it takes a bit. You can also see other people's questions and errors along with solutions.
- Regarding the files provided, you also get a PDF with solutions to the various Learning Objectives presented in the PowerPoint. They provide a lab diagram and a lab diagram with the attack vectors for each machine. Finally, they provide a Tools zip file with everything you need for both the lab and the exam. You can of course upload your own tools too.
  - Again, I do not know if all of this is included when buying only the lab, but I would expect so, take that with a grain of salt.

Summary:

- Classes
  - Four classes in total.
  - A three hour class every Sunday.
  - You will seriously level up your listening skills, Indian English can be intense at times.

- Notes and materials
  - You are provided with:
    - The course PowerPoint.
    - A solutions manual for the Learning Objectives that appear in the PowerPoint.
    - A solutions manual for the Learning Objectives using the Covenant framework.
    - A zip file with all the tools. This folder is already uploaded by default on your lab machine at C:\\AD\\Tools.
    - The lab diagram and the lab diagram with all attack vectors.
    - Solution videos for each Learning Objective, if you prefer video format, the videos are silent.

To reiterate the difference between the bootcamp and the standalone lab, the special parts of the bootcamp are the live classes and the Discord server. For the provided files, my assumption is that you get the same set with the lab only, but I cannot say for sure.

## Exam (CRTP)

The CRTP, Certified Red Team Professional, is a 24 hour exam where you must perform an internal Active Directory assessment starting from a Windows machine and a domain user. The goal is to achieve command execution on every machine, regardless of the privilege level. There are five machines in total, not counting your own.

There are no tasks requiring brute force or dictionary attacks, so attacks like Kerberoasting and AS REP Roast will not be needed. Certificates, AD CS, are also out of scope. Persistence is not required for the purposes of the exam.

The hands on part lasts 24 hours, afterward you have 48 hours to submit the report. In general, the report is about 20 to 25 pages. Mine was 26.

Do not be fooled by the page count. I can say the CRTP has the shortest report of any certification I have done, but it is the hardest exam I have taken so far. It is harder than the eCPPTv2 or eWPT in my opinion. Of course, the topics differ, and passing CRTP does not imply you will pass the other two, or vice versa. In terms of content, the exam, and timing, I honestly think CRTP is more demanding.

I took around 16 hours for the exam. Before starting, they suggest spending 18 hours in the exam lab and 6 hours writing the report. I spent under three hours reporting.

It is a complex exam because you need to know Active Directory concepts well. Looking back, it is not complex for someone who truly understands the entire syllabus. I was stuck for about eight hours on something very simple.

Regarding tools, there are no restrictions. You can use whatever you want, as long as you explain what each tool is used for in the report.

## Is it worth it?

Absolutely yes. For me, Pentester Academy is one of the best platforms to learn. I love their content, and this bootcamp and exam are no exception. My Active Directory knowledge was very rusty, and with this course I can say I have not only remembered everything I learned, I also know more now. If you want to learn Active Directory properly, I highly recommend it.

## Notes

- Both the exam and the lab are done on Windows machines using PowerShell, and the content and exam are designed that way. You are not prohibited from using Linux, the important part is solving the lab and the exam. Personally, I think it is a great chance to step out of your comfort zone and do everything from PowerShell and Windows.
- The lab has 40 flags, which you need to complete to obtain the [lab certificate](https://www.credential.net/5cdc3c89-f7e8-489c-b2e7-254426c93c02#gs.39002z).
- If you buy the bootcamp, those 30 days of lab and course content are a rush. You cover the material very quickly, and you will need to put in a lot of hours in that month. You can see it reflected on the blog, the month of May was very quiet in terms of posts, simply because bootcamp month is bootcamp month, you do not have time for much else. You will also not have time to go as deep as you would like into many topics due to the limited time. My recommendation is to reach a minimum depth that lets you understand the theory, carry it out, know what you are doing, and know what possibilities it gives you. After you finish the bootcamp and take the exam, you will have time to go deeper into everything you saw.
- When you purchase the lab or the bootcamp, you have roughly three to four months to take the exam.
- Additional exam attempts, if you fail, cost $99.

## Tips

For the bootcamp, my tip is to prioritize the PowerPoint, and treat the classes as secondary. Do not wait for class to keep progressing. Classes are support, progressing and learning is entirely on you. My approach was:

- Go through the PowerPoint material. For each topic I looked beyond what was shown, either theoretically to understand it better or practically. Then I took notes.
- When I reached a Learning Objective, I tackled it. Regardless of whether I solved it or not, I then reviewed the solution in the provided PDF, to see if there was another way to do it.
- After covering the material and completing the Learning Objective I was on, I checked the lab flag descriptions and asked myself, have I already covered the topic needed for this flag? If yes, I did it. If not, I continued with the PowerPoint.

That was my methodology for the bootcamp. In parallel, I attended the classes live when they were scheduled, or watched the recordings. Yes, classes are recorded and you can download them.

For the exam I would say:

- Enumerate, enumerate, enumerate. Gather as much information as possible at the beginning and put it on the table. Know your options, which users exist, which groups each belongs to, what machines there are, and so on. Build a mental map of the Active Directory before you start exploiting.
- As a friend told me, hi Dani, attacking Active Directory is not linear. You may find something early that you cannot use until later. If you get stuck, you may have skipped something useful a few steps back that can help you now.
- Download the Tools folder from the lab to your local machine, so for the exam you can grab tools from there and use them. Do not upload the whole zip with all tools during the exam, upload only what you are going to use.
- Build yourself a commands cheatsheet, so you do not have to search through the material for every command you need.

That is pretty much everything. If you want to learn Active Directory and you are thinking about this certification, do it.
