---
id: "alteredsecurity-cartp-review"
title: "CARTP Review - Certified Azure Red Team Professional 2023"
author: "axel-losantos-lizaso"
publishedDate: 2023-06-30
updatedDate: 2023-06-30
image: "https://cdn.deephacking.tech/i/posts/alteredsecurity-cartp-review/alteredsecurity-cartp-review-0.webp"
description: "Personal review and experience with the CARTP certification from Altered Security, including details about the exam, lab, and advice for future candidates."
categories:
  - "certifications"
draft: false
featured: false
lang: "en"
---

This is the first post I publish, and I am quite happy to share my experience with this great certification from Altered Security. _[Attacking & Defending Azure Cloud (CARTP)](https://www.alteredsecurity.com/azureadlab)_ is one of the few certifications focused on Cloud pentesting that I have found online and was interested in pursuing. So, about a month ago, I started the classes and the lab, and after three weeks focused on Cloud, I began June with the exam passed.

![CARTP Lab and Exam Environment](https://cdn.deephacking.tech/i/posts/alteredsecurity-cartp-review/alteredsecurity-cartp-review-1.avif)

Personally, I prefer to keep things concise and straightforward so you don't get bored with my anecdotes and experiences. The outline I will follow is as follows (feel free to jump to the section that interests you most):

## Context
I embarked on the certification journey less than a year ago, gaining basic pentesting knowledge with the **OSCP**, and later adding **eCCPTv2** to my skill set. Once I finished those two, I decided to start with _[Altered Security](https://www.alteredsecurity.com/)_ and earned my first certification at their academy, the _[CRTP - Certified Red Team Professional](https://blog.deephacking.tech/en/posts/alteredsecurity-crtp-review/)_.
But that wasn't the end, as I faced a harsh reality: many real environments have a small part in the cloud (Azure AD), and at that time, I had no idea what a "Tenant" was. Realizing my lack of cloud knowledge, I decided to look for a certification that would allow me to train, and I found _[CARTP](https://www.alteredsecurity.com/azureadlab)_.

However, I decided to take it easy.

> Where am I going with a Cloud pentest if I don't even know how it works?
>
> Axel, May 2023

That was the first question I asked myself. So I opted for a simple solution, learn Azure. That's where [AZ-900 (Azure Fundamentals)](https://learn.microsoft.com/en-us/certifications/exams/az-900/) came in, a certification that allowed me to gain the most basic knowledge and helped me a lot later on.

> Does this mean I'm required to get it before CARTP?
>
> Hold on, we'll see that later

## CARTP Exam
The exam covers all the knowledge shown in the **classes + lab**, and maybe a bit beyond. Here's a summary of what was covered throughout the course:
- Discovery and enumeration of Azure services
- Initial compromise and access (Phishing, abuse of enterprise applications, logic apps, and insecure containers)
- Authenticated enumeration (Containers or "Blobs", automated accounts, deployment templates)
- Privilege escalation (RBAC Roles, Azure AD Roles, Subscriptions)
- Lateral movement (Pass-the-PRT, Pass-the-Certificate)
- Persistence techniques (_Hybrid Identity_, Golden SAML, Service Principals, and dynamic groups)

Wow! All this? Yes, all of this packed into "140 hours of fun" (that's the estimated time to complete the lab along with the objectives and course tasks). Plus, it's divided into four different "Kill Chains" to create more dynamism and realism, since most of the time it's not so trivial.

> For those who don't know what a "Kill Chain" is, it's basically the structure/workflow of an attack. _[See this example from Microsoft](https://www.microsoft.com/en-us/security/blog/2016/11/28/disrupting-the-kill-chain/)_

Back to the certification, the course includes labs to obtain different _Flags_ that will help you meet the objectives set so you are better prepared for the exam.

> Enough talk, tell us, what is the exam like? What did you think?

Step by step. The exam, like the _[CRTP](https://blog.deephacking.tech/en/posts/alteredsecurity-crtp-review/)_, gives you 24+1 hours of "fun" in a controlled lab that takes about 10-15 minutes to deploy. The goal is to obtain a _flag_ after compromising 5 resources, 2 Azure AD users, and 2 enterprise applications, then finish with a report to be submitted up to **48 hours** after completing the test.

Now, about the exam. For context, all the exams I've taken so far, I've started at 1:00 PM, and in this case, it involved about 10 hours of pure sweat, tears, mixed emotions, and headaches. Why do I usually take exams at that time? Very simple, my main goal is to go to sleep with a clear mind, knowing I've achieved the minimum score to pass. That way, I can rest and have the whole morning to review and take screenshots. It's a fundamental time that I appreciate.

- I would like to point out that this is totally **subjective**, everyone has their own "trick" to perform at their best

Regarding the exam, for obvious reasons I can't tell you exactly what it's about, but I will share my experience. From the start, I felt very comfortable, developing most of the concepts similar to those already practiced in the lab. I hit my first difficulty around 4:00 PM, running completely out of ideas. What to do in these cases? Keep enumerating, you missed something along the way. A good technique is to take advantage of the access you have to perform enumerations directly from the Azure portal, not just focus on opening a Powershell.

Around 6:00 PM, I hit a second wall, which caused a lot of uncertainty, "Is this as far as I go? Can't I go any further?" Faced with those thoughts, I decided to take a short break and treat it like a CTF. Investigating and stepping outside the PDF manual was key, although difficult due to the limited content I could find online. My "only friends" were _[Cloudtricks](https://cloud.hacktricks.xyz/)_ and the official _[Microsoft documentation](https://learn.microsoft.com/en-us/)_

After **8 hours of the exam**, I finally saw the light at the end of the tunnel. The **FINAL FLAG** was right in front of me, finishing the exam around 8:30 PM, wanting to throw the computer out the window and dreading the 5 more hours needed to write the report.

## Is the certification worth it?
Absolutely yes. _[Altered Security](https://www.alteredsecurity.com/)_ seems to me one of the best academies to learn, as it manages to compress a lot of knowledge and gives you a solid foundation and confidence to tackle any real-world environment.
But without a doubt, my biggest reason why you should get this certification is the **realism** and the **need to learn** these skills so you don't get into trouble in real environments. This is because organizations have been trying to move away from _on-premise_ (traditional Active Directory) to take advantage of the benefits of **Cloud**, such as scalability, cost savings, greater security, and more control over the environment, among others.

## Notes / FAQ

> Is AZ-900 necessary?

Not really. Supposedly, the certification is designed so you can jump in without any Cloud knowledge. However, just like the _[CRTP](https://blog.deephacking.tech/en/posts/alteredsecurity-crtp-review/)_, you have limited time to learn a lot of new concepts quickly. So, in my opinion, it might be a good idea to take AZ-900 first or learn the basics of Azure on your own.

> How many months did you dedicate? Can I get it in a month?

In my case, it was a month of pure dedication to this certification, working and studying in my free time. You can get it in a month, but it should be a month with few commitments, low workload, and a strong desire to listen to English :)

> What will we find in the lab and exam portal?

Once we confirm our start date in the portal, we log in with our email account and access the information panel. Initially, you are offered a Windows environment accessible via browser, different user credentials, and VPN credentials in case you prefer to connect that way.

The portal has a section to start the exam, as well as another to add the lab _flags_ and meet the objectives. As a note, there is a CTF-style _flag_ that you must obtain without help from any instructor, which serves as a review for the exam.

Finally, you get access to a shared OneDrive where you'll find a detailed lab manual and various course videos you can download and watch anytime. Additionally, you'll get diagrams of the four "kill chains" mentioned earlier and the necessary tools grouped in a zip file.

> Which comes first, CRTP or CARTP?
>
> From the creators of, Which came first, the chicken or the egg?

Both certifications cover AD, one _on-premise_ and the other in Cloud. However, I don't think it's necessary to get CRTP before tackling Azure Cloud AD, so it's up to you. If you're interested in basic AD knowledge, I recommend CRTP, otherwise, if you prefer Azure Cloud, then CARTP is your certification.

> What report template can I use?

I used the same one as for the _[CRTP](https://blog.deephacking.tech/en/posts/alteredsecurity-crtp-review/)_. And you might ask, which one did you use for the _[CRTP](https://blog.deephacking.tech/en/posts/alteredsecurity-crtp-review/)_? The answer is: the INE template. It didn't matter, as you could perfectly use the template offered by _[Offensive Security](https://help.offsec.com/hc/en-us/articles/360046787731-PEN-200-Reporting-Requirements#pwk-report-templates)_ for their exams.

> How do you write a report like this?

I treated it as if it were a story, describing each step I took and adding a small diagram of the state of my "kill chain," helping the reader know where we were at all times. It's not a vulnerability report per se, but rather explaining the process of intrusion into the system until obtaining the _flag_, basically a write-up.

To "draw" the _kill chain_, I used a _[portal for Azure icons](http://code.benco.io/icon-collection/azure-icons/)_ that allowed me to download the icons for free, and I created the diagrams with the well-known _[Excalidraw](https://excalidraw.com/)_ tool. I thought it was a good way to show the steps taken until getting the flag.

> How do I know if I've compromised everything?

This is a question I asked myself after getting the flag. Do I have everything I need? It's stressful, I don't know if I finished or skipped a step. Don't worry, the exam is designed so that if you reach the final flag, it means you necessarily had to go through all the other points to compromise. Pause, look back, and list each resource, user, and application compromised, and you'll see you meet 100% of the requirements.

* * *

And that's all I have to say about this certification. I'm really looking forward to new Cloud courses coming out, as well as some for AWS or Google to focus on, without forgetting the other interesting areas in this field. Thanks for reading this far, and see you next time!
