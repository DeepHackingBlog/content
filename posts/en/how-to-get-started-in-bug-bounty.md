---
id: "como-empezar-en-bug-bounty"
title: "How to Get Started in Bug Bounty"
author: "eric-labrador"
publishedDate: 2022-04-01
updatedDate: 2022-04-01
image: "https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-0.webp"
description: "Complete guide to getting started in the bug bounty world, including platforms, tools, VPS, methodology, and tips for finding vulnerabilities."
categories:
  - "web"
draft: false
featured: false
lang: "en"
---

In this post, I'm going to explain how to get into the world of bug bounty. For those who have no idea what this is, bug bounty is where companies, large or small, publish their infrastructure so that hackers from all over the world can openly exploit it (with certain restrictions, for example, DDoS attacks or social engineering are usually out of scope), and completely legally.

Thanks to this possibility, people with any kind of experience in the sector can practice hacking in real life instead of in an already vulnerable lab.

Index:

- [Difference between a CTF and a Bug Bounty](#difference-between-a-ctf-and-a-bug-bounty)
- [Do Companies Pay in Bug Bounty?](#do-companies-pay-in-bug-bounty)
- [Best Platforms to Practice Bug Bounty](#best-platforms-to-practice-bug-bounty)
- [What are Private Programs?](#what-are-private-programs)
- [Limitations in Bug Bounty Programs](#limitations-in-bug-bounty-programs)
- [How to Report a Vulnerability](#how-to-report-a-vulnerability)
- [How Do I Determine the Criticality of a Vulnerability?](#how-do-i-determine-the-criticality-of-a-vulnerability)
- [What is a VPS? Is it Important for Bug Bounty?](#what-is-a-vps-is-it-important-for-bug-bounty)
- [Where Can I Get a VPS?](#where-can-i-get-a-vps)
- [Where Can I Practice Hacking?](#where-can-i-practice-hacking)
- [Basic Tips to Get Better Results](#basic-tips-to-get-better-results)

## Difference between a CTF and a Bug Bounty

In bug bounty, a hacker faces systems that technically shouldn't be vulnerable because they're in production, therefore, you don't really know if what you're auditing is vulnerable or not. However, in a CTF you know in advance that there are vulnerabilities intentionally placed to be exploited.

The objective of a bug bounty is the same as a CTF, that is, to exploit the service exposed to the outside and gain access to the machine. The difference is that in bug bounty it's somewhat more complicated to access the remote server and it's usually more focused on finding other types of vulnerabilities that can affect either the correct flow of the web or the security of users.

For example, a basic SSRF (Server Side Request Forgery) would only show internal services of the server:

![Example of SSRF showing internal server services](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-1.avif)

On the other hand, an RFI (Remote File Inclusion) that allows injecting HTML code could cause credential theft through phishing and compromise user privacy:

![POST request received on attacker's server via RFI](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-2.avif)

In the image, for example, we can observe a POST request received on the server controlled by the attacker. If we had used a phishing template, instead of "test:for bugcrowd" we would be receiving the user's credentials, thanks to the RFI.

## Do Companies Pay in Bug Bounty?

Yes, there are certain companies that pay for bugs found. Now, this doesn't mean it's easy, you'll probably see on LinkedIn or Twitter bugs that are found in programs of this type, and the profit from having reported it, giving the idea that it's simple and common to find vulnerabilities, but there's a lot of work behind it, so if in the first days/weeks/months you see that you don't find anything, don't leave bug bounty aside, but do approach it differently, that is, instead of hacking to find vulnerabilities, study and practice in controlled environments (I'll mention some platforms later) and try to look for the vulnerabilities you learn in bug bounty programs.

## Best Platforms to Practice Bug Bounty

Well, it's not that there's a better one because each one has its own things, and each one has programs that others don't have, but there are some that should be mentioned:

- [HackerOne](https://hackerone.com/)
- [Bugcrowd](https://bugcrowd.com/)
- [Google Bug Hunters](https://bughunters.google.com/)
- [YesWeHack](https://www.yeswehack.com/)
- [Intigriti](https://www.intigriti.com/)

There are quite a few more, but these are the main ones and the ones that give hackers the most confidence and security due to the report review service they provide. I'm going to mention one that works very well for practicing code injection vulnerabilities, like XSS, although in my personal experience they haven't given me good results in the report management part, since I reported an XSS 2/3 months ago and it's still in "on Hold" status...

- [Open Bug Bounty](https://openbugbounty.org/)

<figure>

![Open Bug Bounty platform](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-3.avif)

<figcaption>

Open Bug Bounty

</figcaption>

</figure>

## What are Private Programs?

Well, it must be taken into account that on some of the previously mentioned platforms (HackerOne, Bugcrowd, etc.) there are private programs. A private program is one that can only be accessed by invitation, meaning if you don't have prior access you can't do anything related to hacking on the platform's website (in fact you shouldn't even know the program exists, since it's not public).

In the case of HackerOne, you can access a private program in 2 ways: the first is to find vulnerabilities in public programs, this way, the companies on the platform will send you invitations to their programs. The second way to get invitations is to complete challenges from the CTF that HackerOne has created on [Hacker101](https://ctf.hacker101.com/). For each challenge completed, the blue bar will increase, and each time it reaches the end, you'll get an invitation to some private program within 24 hours.

<figure>

![Hacker101 invitation progress bar](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-4.avif)

<figcaption>

Invitations Obtained Through CTF

</figcaption>

</figure>

On the other hand, public programs, as their name indicates, are programs open to all hackers registered on the platform. That's why hackers who have been on the platform for a while are usually in private programs, since there are fewer hackers testing the web and, therefore, more chances of finding vulnerabilities.

<figure>

![List of public programs on HackerOne](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-5.avif)

<figcaption>

HackerOne Public Programs

</figcaption>

</figure>

## Limitations in Bug Bounty Programs

Within each program, you can see the type of vulnerabilities the company is looking for or not.

<figure>

![Vulnerabilities out of scope in a program](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-6.avif)

<figcaption>

Out of Scope in a Bug Bounty Program

</figcaption>

</figure>

It also shows whether they pay or not (in case they don't pay, they'll give you points as reputation on the platform), in case they do pay, it will show the amount they pay based on the criticality of the vulnerability:

<figure>

![Rewards table based on vulnerability criticality](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-7.avif)

<figcaption>

Rewards Depending on Vulnerability Criticality

</figcaption>

</figure>

## How to Report a Vulnerability

To report a vulnerability to the company is as easy as going to the program and selecting the Submit Report button:

<figure>

![Submit Report button on HackerOne](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-8.avif)

<figcaption>

How to Submit a Report

</figcaption>

</figure>

Before reporting a vulnerability, it must be taken into account that they can be divided into:

- **Critical**: These are the ones that cause critical impact, for example SQLi or RCE.
- **High Criticality**: These are the ones that cause high impact on the asset, for example, SSRF with theft of cloud metadata or with the possibility of reading internal files of the machine, XXE, etc.
- **Medium Criticality**: These are the ones that have a medium impact on the asset, for example CSRF or information leaks (Information Disclosure).
- **Low Criticality**: These are the ones that have low criticality on the asset, for example showing some internal IP in HTTP response headers (it's another type of Information Disclosure).
- **Informative Vulnerability**: These are "vulnerabilities" which can be considered security improvements on the server for future modifications, but don't cause any impact on the asset, for example, the absence of some HTTP header.

## How Do I Determine the Criticality of a Vulnerability?

Vulnerability criticality is calculated using the CVSS (Common Vulnerability Scoring System). CVSS is an open and universally used standard that allows estimating the impact of a vulnerability.

For example, HackerOne uses CVSSv3, and the platform itself provides you with a calculator when you're going to report a finding:

<figure>

![CVSS calculator integrated in HackerOne](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-9.avif)

<figcaption>

HackerOne CVSS Calculator

</figcaption>

</figure>

In case you want to use an external calculator (equally functional to HackerOne's, in this case) you can use the following:

- [NIST CVSS v3 Calculator](https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator)

<figure>

![NIST CVSS v3 calculator](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-10.avif)

<figcaption>

NIST CVSS Calculator

</figcaption>

</figure>

## What is a VPS? Is it Important for Bug Bounty?

A VPS is a Virtual Private Server that basically allows you to have a machine in the cloud with a public IP.
This allows you to establish connections between machines without needing to use services like ngrok or without needing to expose a port on your router publicly. Additionally, being a machine in the cloud, you can create and schedule tasks that you want to be executed from time to time.

Personally, for doing bug bounty, I recommend having at least 1 machine in the cloud. For example, DigitalOcean is a hosting service (among many others) where you can have your own machine (VPS) through a monthly payment plan, however, in this case the monthly plan is only paid if you keep the machine on 24 hours throughout the entire month, otherwise, you would pay per consumption (hours the machine is on). Following this logic, if the machine is not turned on in a month, you won't be charged anything for that machine that month.

<figure>

![DigitalOcean VPS pricing table](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-11.avif)

<figcaption>

DigitalOcean Pricing

</figcaption>

</figure>

So, what is a VPS necessary for?

Well, unlike doing scans with, for example, nmap on internal networks, since there's no traffic going outside, your personal network's bandwidth isn't used. When scanning different public IPs, the bandwidth can be affected and it's normal for your router's network to either not work or go very slow. It doesn't just happen with nmap, there are other tools that use a lot of bandwidth when launched externally. Additionally, in specific cases, it can be very convenient, since with the VPS, as mentioned before, you don't need to expose your router's ports to the outside, for example, if you want to receive a reverse shell connection, it's enough to do it from the VPS and forget about your router's configuration:

<figure>

![Terminal showing reverse shell received on VPS](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-12.avif)

<figcaption>

Reverse Shell Received on a VPS (Bottom Part)

</figcaption>

</figure>

## Where Can I Get a VPS?

There are quite a few platforms that offer it, although according to my experience with different platforms, I recommend:

- [DigitalOcean](https://www.digitalocean.com/)
- [Linode](https://www.linode.com/)

## Where Can I Practice Hacking?

I'm going to leave a list of websites where you can practice/learn vulnerability exploitation, although some platforms are CTF, they equally serve to practice the methodology:

- [PortSwigger Web Security Academy](https://portswigger.net/)
- [Hacker101 CTF](https://ctf.hacker101.com/)
- [Hack The Box](https://www.hackthebox.eu/)
- [TryHackMe](https://tryhackme.com/hacktivities)
- [PentesterLab](https://pentesterlab.com/)

## Basic Tips to Get Better Results

Well, although in this post I haven't wanted to go into much technical detail, the main advice I can give is to use Burp Suite. For those who don't know, Burp Suite is a proxy with which you can intercept server requests/responses and modify them. This allows you to see at a low level how the requests sent to the server act in a very easy and comfortable way. I recommend messing around a lot with Burp extensions and practicing the functionalities a lot, as it's a very powerful tool. If you only have Burp Suite Community, it's fine to start with, although when you get more comfortable you'll need the professional version of the program.

Another recommendation, outside the technical detail, is to read what the program asks for, that is, what can and cannot be done and how to act. By this I mean what the company can ask of the hacker, that is, so that the company knows you're acting from a bug bounty platform, some companies request putting the name of the website where the program is hosted in the headers of HTTP requests. It's very important to follow this, since otherwise the company may think it's suffering a malicious attack and could take legal action against you.

Finally, I leave quality content from the community:

- [Nahamsec's YouTube Channel](https://www.youtube.com/c/Nahamsec)
- [STÖK's YouTube Channel](https://www.youtube.com/c/STOKfredrik/videos)
- [Codingo's YouTube Channel](https://www.youtube.com/c/codingo)
- [Bugcrowd University on GitHub](https://github.com/bugcrowd/bugcrowd_university)
- [Awesome Oneliner Bug Bounty](https://github.com/dwisiswant0/awesome-oneliner-bugbounty)
- [The XSS Rat Course](https://thexssrat.podia.com/products/home)
- [0x80 Blog](https://0x80dotblog.wordpress.com/)
