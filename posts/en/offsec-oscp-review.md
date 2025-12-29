---
id: "offsec-oscp-review"
title: "OSCP Review - Offensive Security Certified Professional 2022"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-10-31
image: "https://cdn.deephacking.tech/i/posts/offsec-oscp-review/offsec-oscp-review-0.webp"
description: "Complete review of OffSec's OSCP certification: legendary pentesting course, PWK labs, 24-hour exam, and my experience obtaining the most recognized certification."
categories: 
  - "certifications"
draft: false
featured: false
lang: "en"
---

Well, it is finally time to talk on this blog about, without a doubt, the most well known hacking certification:

![OffSec OSCP certificate](https://cdn.deephacking.tech/i/posts/offsec-oscp-review/offsec-oscp-review-1.avif)

The O S C P.

I know there are a thousand reviews of this certification out there, but not all of them compare it to other certifications, and that is where I think this post will be a bit different. Before we get there, let’s cover a few basics:

- [Context](#context)
- [What is the exam like?](#what-is-the-exam-like)
- [What do I need to know?](#what-do-i-need-to-know)
- [Comparison with other certifications](#comparison-with-other-certifications)
- [Is it worth it?](#is-it-worth-it)
- [How to prepare](#how-to-prepare)
- [Official guides](#official-guides)
- [Conclusion](#conclusion)

## Context

OSCP, Offensive Security Certified Professional, is an exam and a course where, according to Offensive Security, you will learn the following topics:

- Penetration Testing: What You Should Know
- Getting Comfortable with Kali Linux
- Command Line Fun
- Practical Tools
- Bash Scripting
- Passive Information Gathering
- Active Information Gathering
- Vulnerability Scanning
- Web Application Attacks
- Introduction to Buffer Overflows
- Windows Buffer Overflows
- Linux Buffer Overflows
- Client Side Attacks
- Locating Public Exploits
- Fixing Exploits
- File Transfers
- Antivirus Evasion
- Privilege Escalation
- Password Attacks
- Port Redirection and Tunneling
- Active Directory Attacks
- The Metasploit Framework
- PowerShell Empire

All these topics appear in the corresponding exercises and their material. In some cases the theory leaves something to be desired, but at least you get exposure. In any case, the truly interesting part of OSCP is the lab, where currently, if I am not mistaken, there are 75 machines, and this lab work is what matters most for the exam.

## What is the exam like?

As many people already know, the exam is worth 100 points, and you need at least 70 to pass. These 100 points are divided as follows:

- 60 points, 3 standalone machines
  - Each of these machines is worth 20 points
    - Those 20 points come from 10 points for getting a foothold on the machine, and another 10 points for privilege escalation to administrator or root
- 40 points, Active Directory, 2 clients and 1 DC
  - Here, even though there are several flags, local.txt and proof.txt, across the AD machines, they do not count unless you compromise the entire domain. In practice, you either get 40 points or you get nothing.

These are the points as far as the exam itself is concerned. In addition, if you do the following:

- 30 lab machines
- 80% of the exercises in each category

You can get 10 extra points.

So, the ways to pass the exam would be:

- AD plus 1 standalone machine plus 10 bonus points from the lab and exercises
- AD plus 1 user from one standalone plus 1 user from another standalone plus 10 bonus points from the lab and exercises
- 3 standalone machines plus 10 bonus points from the lab and exercises

- AD plus 1 standalone machine plus 1 user from another standalone
- AD plus 3 users from three standalone machines

All of this is about point distribution. Just to be clear, “standalone” machines are simple boxes like the ones you can find on platforms such as HackTheBox or TryHackMe, same idea and workflow.

Other than that, there is not much more to comment regarding the exam content.

OSCP is also proctored, meaning someone watches you through your camera during the exam. On that note, I find Offensive Security’s procedure here pretty interesting. When you connect to the proctoring session, verify your ID, show your room, and so on, the whole process is so formal and well choreographed that, psychologically, before you even start, you already feel like this is a different kind of exam, or at least that is the feeling they manage to convey. The same feeling continues during the exam and the report submission.

Honestly, I think this small detail is why many people talk about this certification with respect:

- “Wow, the OSCP... I do not know...”

My opinion is that OSCP is not that different from other certifications in the field, they simply have the process so buttoned up that, from the moment before the exam, it throws you a bit off balance, and for that reason people treat it as the certification of certifications.

Unpopular opinion

> The fear that is generated and repeated about OSCP is much greater than the actual difficulty of the exam
>
> That does not mean it is easy, because it is not

## What do I need to know?

So, what do you need to know to pass OSCP? I have it fairly clear:

- Be clear on the process for compromising a system, meaning knowing how to enumerate versions, resources, and so on. From there, search for possible exploits for the software versions in use. In some cases you might have to slightly modify the exploit to adapt it to your case, but usually not much more than that.
- Have methodologies for services. For example, if you find MSSQL, or any other service, know what you can do with it. A snippet from my notes to get the idea:

![Example MSSQL methodology in notes](https://cdn.deephacking.tech/i/posts/offsec-oscp-review/offsec-oscp-review-2.avif)

![Example from OSCP notes, enumeration](https://cdn.deephacking.tech/i/posts/offsec-oscp-review/offsec-oscp-review-3.avif)

- Be able to perform web attacks manually, the clearest example would be SQLi.
- Know how to enumerate CMSs. For example, if you find a WordPress, you know you can use WPScan to help enumerate possible plugins.
  - Create CMS methodologies, and really for everything. If you find a Joomla, the idea is you only need to look at your notes to know exactly what to check.
- Know privilege escalation paths in both Linux and Windows.
  - I would include knowing more than one tool for enumerating potential privilege escalation paths. Not everything is WinPEAS or LinPEAS.
    - I say this because I had a bit of a weird situation in the exam. I used WinPEAS and a misconfiguration that existed on the host either did not get flagged, or I was just too tired and missed it, xD. Then I ran SharpUp and it picked it up without issues, which led me to the correct escalation.
- As far as Active Directory is concerned, if you know how to use Mimikatz, CrackMapExec, and enumerate via LDAP, you have most of it covered, xD.

And that is pretty much it, at least everything that comes to mind right now.

## Comparison with other certifications

Let us see how OSCP compares in difficulty with other certifications.

This is not as simple as saying this one is harder and that one is easier, because in some aspects OSCP might be harder, and in others not. So I will split the comparison by category. I will compare it with the certifications I hold right now, eJPT, eCPPTv2, eWPT, eWPTXv2, PNPT, and CRTP, although not all apply to every category:

- Pivoting
  - OSCP = PNPT < eCPPTv2

- Web pentesting
  - eWPT < OSCP < eWPTXv2
    - I place OSCP above eWPT because you may encounter a more CTF like element in OSCP if you get unlucky, but in general, the web aspect of OSCP should not be difficult.

- Active Directory
  - OSCP < PNPT < CRTP
    - As I said before, to get the 40 AD points in OSCP you mostly need to know how to run Mimikatz and CrackMapExec and enumerate via LDAP, not much more.
      - Even so, it is always better to know more and to know how to perform actions in multiple ways. For example, if you want to dump LSASS, do not rely only on Mimikatz, have alternatives. And the same applies across the board.

- Privilege escalation
  - eCPPTv2 < PNPT < OSCP
    - Here, I would highlight that the privilege escalations in eCPPTv2 and PNPT are not a big deal. In OSCP it is a bit like the web part. If you are lucky, you will not find anything too CTF like. But in general, the escalations you may find in OSCP are more complex than in the other two.

- HTB or THM style boxes, difficulty of compromising a machine and then escalating
  - eCPPTv2 < OSCP

If you want me to compare it with another category that is not here, let me know in the comments.

These are the main categories in my view. OSCP is not “the hardest one.” Like any other certification, in some categories it can be a bit more difficult than the rest, and in others it is much simpler.

## Is it worth it?

Yes, absolutely. But maybe not because you are going to learn, it depends. For example, it is a fact that OSCP is a bureaucratic certification. If you want more job opportunities in offensive security, you get it, or you get it. Not only that, someone with OSCP is gold for HR. The same that happens, or used to happen, with the CEH.

Just because of how highly it is valued, and the opportunities it will open, it is 100% worth it.

Now, do you really learn with OSCP?

It depends. If you are starting from zero or have a basic level, you will learn a lot. You will learn the foundations to keep growing in this field. If you already hold other certs, work in the field, have done a lot of HTB and THM, like I had, then maybe it will not add that much. I had to kind of force myself to do machines, either in the lab or on HTB or THM. And, although it is true that I learned a few scattered things, I would have learned much more by moving on to other certifications or topics I had in mind, but could not start because I had to get OSCP.

Whether you learn a lot will depend on your particular situation.

## How to prepare

The best way to prepare is no mystery. For me it would be something like this:

- Do HackTheBox or TryHackMe machines. You can follow TJNULL’s famous list: [TJNULL HTB list](https://docs.google.com/spreadsheets/u/1/d/1dwSMIAPIam0PuRBkCiDI88pU3yzrqqHkDtBngUHNCw8/htmlview).
- Take notes on everything you do on those machines. Create methodologies for everything.
- As you do machines, be conscious of your thought process, how you solved them. After you have done a lot, you will realize that for a large percentage, the resolution is quite mechanical, version, exploit, and you are in. This also applies to many OSCP machines.
- Do the lab machines.

There is really no more mystery to preparing than that, there is no magic formula.

## Official guides

If you are going to take the exam or the course soon, definitely check the following links:

- [OSCP Exam Guide](https://help.offensive-security.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- [OSCP Exam FAQ](https://help.offensive-security.com/hc/en-us/articles/4412170923924-OSCP-Exam-FAQ)

## Conclusion

OSCP is a certification that, if you plan to work in this field, you almost have to have. Whether you learn with it obviously depends on you, as with anything, and it will depend entirely on your specific case.
