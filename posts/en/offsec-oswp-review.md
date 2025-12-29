---
id: "offsec-oswp-review"
title: "OSWP Review - OffSec Wireless Professional 2024"
author: "adria-perez-montoro"
publishedDate: 2024-04-02
updatedDate: 2024-04-02
image: "https://cdn.deephacking.tech/i/posts/offsec-oswp-review/offsec-oswp-review-0.webp"
description: "Complete review of the OSWP (OffSec Wireless Professional) certification with tips, preparation advice and personal experience from the WiFi pentesting exam."
categories:
  - "certifications"
draft: false
featured: false
lang: "en"
---

What's up folks, my name is Adrià, also known as b1n4ri0 (well-known in my own house XD). Today we're going to talk about the OSWP. Throughout this post, I'll tell you everything you need to know about the certification and share a bit of my experience without spoiling anything about the exam, of course.

![OffSec OSWP Certification](https://cdn.deephacking.tech/i/posts/offsec-oswp-review/offsec-oswp-review-1.avif)

## What is the OSWP?

The OSWP (OffSec Wireless Professional) or PEN-210, is Offensive Security's Wi-Fi pentesting certification. To purchase the OSWP you have three options, but all of them are through an annual subscription. What changes is how many kidneys you have to sell to pay for it:

- Learn Fundamentals ($799/year) == (1 kidney)
- Learn One ($2599/year) == (2 kidneys)
- Learn Unlimited ($5499/year) == (2 kidneys + 1 from your neighbor)

Generally, OffSec certs tend to have respect or status, although it's more of a reputation than anything else. Well, this one doesn't have that haha. That said, it doesn't mean you don't need to study to pass this certification or that your 13-year-old cousin who watched three episodes of Mr. Robot on YouTube could pass it. It's just that people don't talk about this cert as much, or at least that's my perception.

## The Course

OffSec describes the course as follows:

> PEN-210 is a comprehensive wireless security and penetration testing course designed to provide students with the knowledge and practical skills needed to identify, exploit, and remediate vulnerabilities in wireless networks.
> 
> The course covers a wide range of topics, including IEEE 802.11 standards, types of wireless networks, Linux wireless tools, Wireshark fundamentals, and advanced techniques for wireless network monitoring and analysis.
> 
> Throughout the course, students will engage in interactive labs and exercises that simulate real-world scenarios, gaining valuable experience in conducting wireless network assessments and implementing effective security measures.
> 
> Upon completing PEN-210, students will have a comprehensive understanding of wireless network security and the ability to perform wireless penetration testing.

Alright, I'm going to highlight something you need to know right off the bat. Specifically, when they say: "students will engage in interactive labs and exercises that simulate real-world scenarios," what they actually mean is "students will figure out how to set up whatever labs they need and complete the exercises with them." A small detail they forgot to mention XD. But don't worry, because in the preparation section we'll see how to manage.

What you learn according to OffSec in the course is the following:

- Greater knowledge of offensive wireless security and increased awareness of the need for real-world security solutions.
- Use of various wireless reconnaissance tools.
- Implementation of attacks against personal and enterprise WPA encrypted networks.
- Understanding of how to implement different attacks against rogue access points.
- Implementation of attacks against Wi-Fi Protected Setup (WPS) networks.
- Use of various tools to crack authentication hashes.
- Implementation of attacks against captive portals.

There's not much to discuss here since that's what they teach you in the syllabus.

## Preparation

The requirements are having a PC (optional), just kidding haha.

Before starting the course, OffSec recommends you have the following:

- Solid knowledge of TCP/IP and the OSI model, as well as familiarity with Linux.
- A modern laptop or desktop computer that can boot and run Kali Linux
- Specific hardware to complete the course exercises

According to OffSec, reading the syllabus and completing the exercises in some of the sections should make you ready to face the exam, and technically you would be. But honestly, the course is very general, and if what you really want is to learn to penetrate networks professionally, you're going to have to do quite a bit of research. How much? That depends on how deep you want to go. Personally, I like to dig in and understand everything at a very low level, so my preparation probably won't be the same as yours. But if your intention is to pass the exam, I believe that with the syllabus OffSec provides and completing all the challenges in the [WifiChallenge Lab by Raúl Calvo Laorden](https://wifichallengelab.com/), you can tackle it perfectly.

> Raúl, if you're reading this, I want you to know that you're literally carrying a lot of OSWP passes. Thanks for your labs that save an incredible amount of time.

Getting back on topic, you can also create your own labs with some old router you have lying around and an inexpensive antenna from Amazon (and no, practicing with your neighbor's Wi-Fi doesn't count, it's illegal :/). The advantage of a physical lab is that you can tinker more directly, but my recommendation is to use the Wifi Challenge Lab because you'll save yourself trouble. If you have any questions or problems, there's a larger community and more people who can help you. On the other hand, if you have any issues with your physical setup, you'll have to struggle a bit more to solve them.

It's worth mentioning that, just like in all exams, how prepared you are isn't the only factor, as you'll see when I share my experience.

## The Exam

Now we're entering sensitive territory. The exam is pretty short, specifically lasting 3 hours and 45 minutes, although in the course information they present it as 4 hours:

![OSWP exam duration](https://cdn.deephacking.tech/i/posts/offsec-oswp-review/offsec-oswp-review-2.avif)

To pass, you need to crack two of the three networks that make up the exam lab and obtain the proof.txt. One of the networks is mandatory to pass, meaning if you crack two of the three but the one you didn't crack was the mandatory one, you fail.

If you crack two networks and one of them is the mandatory one, but you don't have the necessary screenshots or your report doesn't contain sufficient documentation, you also fail. At minimum, you're required to have a screenshot of the proof.txt and the plaintext password for each network.

During the exam, it's forbidden to use tools that automate exploitation, e.g., (wifite, wiphisher), and artificial intelligence, e.g., (ChatGPT, YouChat), but don't worry, you won't need them anyway.

Once the 3 hours and 45 minutes are up, you have 24 hours to write the report and submit it.

For more information, you can check the [official OffSec OSWP Exam Guide](https://help.offsec.com/hc/en-us/articles/360046904731-OSWP-Exam-Guide).

## Tips

My tips are as follows:

- Go in confident and calm, but not too overconfident.
- Take the necessary time to think and plan your attacks.
- Screenshot everything you do, even if the attack might not work (better to have some screenshots than nothing at all).
- If you get stuck on a network, pause that scenario and go for a different network.
- Manage your time efficiently and rest (yes, there's time for that).
- If you want, it doesn't hurt to have your notes nearby.
- Keep in mind that the exam is based on the course syllabus, but you'll also need to do some research.
- This one is the most important to me: if you think you can do something in a way you hadn't previously planned, DON'T dismiss it.
- Watch the clock.

## My Experience

Alright, time to explain my experience with the exam, and honestly it was somewhat strange and very fun for me. This is the shortest exam I've ever taken and also the first proctored one I've done.

I connected to the exam 20 minutes early. They recommend joining 15 minutes before, but I have an obsession with not being late. Everything went smoothly, I shared my screens and completed the identification process without any issues, it was very chill. I scheduled the exam for the 24th at 1:00 PM, so I transformed my room into a snack bar in case I got hungry and put on my music to stay relaxed.

When 1:00 PM hit, they sent me what I needed to start the exam and I began with the first scenario. Honestly, I completed the first scenario pretty quickly without any problems, it didn't take me more than 15 minutes.

Then I started with the second one and things got complicated. I can't say much more because I don't want to give details, but in short, I didn't follow my own last two pieces of advice. When I saw that things weren't going as I planned, I had a mental lapse and thought I had 1 hour less than I actually did, and I got a bit stressed.

After a couple of restarts, I moved on to the third scenario to see if I could decompress, but as I said before, I thought I had less time and the scenario I was stuck on was the mandatory one, so I decided to go back and dedicate all my time to that one.

During the remaining time, I ate calmly and kept trying my first attack idea. When I only had 45 minutes left, I decided to go with the attack idea that I thought wasn't possible, that didn't make much sense in my mind (spoiler: that was the solution XD). After all, I had nothing to lose, so I got to work. And as I told you, it did work, or at least part of it, which meant that was the right path. But the second part wasn't working correctly. Since I had already made a mistake in the first attack, I thought I was doing something wrong again. So I started researching and trying things I hadn't seen before (at least I learned new things). The thing is, this time I wasn't making a mistake and it was indeed the right path.

I had 10 minutes left before lab time ended and I was pretty desperate (I think the kid proctoring me, let's call him Paco, was cracking up). I didn't see any possible solution, so I restarted the scenario. With 7 minutes to go, I performed the procedure again, and the only difference was that now it worked. I grabbed the proof.txt typing as fast as I could, and when I saw it, I did a little victory dance.

I think Paco celebrated with me, but we'll never know. In summary, the moral of the story is to stay until the last minute. If you think something isn't working as it should, restart. And if not, look for another alternative because most likely it will work. As an addition, bad moments and bad days also exist, and they're generally not linked to your level of knowledge ;).

Alright folks, it's been a pleasure being here. Any questions, feel free to send me a DM on [my Twitter profile](https://twitter.com/b1n4ri0) or [my LinkedIn profile](https://www.linkedin.com/in/b1n4ri0/) and I'll respond as soon as I can. Hope to see you soon. <3
