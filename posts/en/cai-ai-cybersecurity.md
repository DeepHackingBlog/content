---
id: "cai-ia-ciberseguridad"
title: "CAI, the Future of AI in Cybersecurity"
author: "luis-javier-navarrete"
publishedDate: 2025-05-12
updatedDate: 2025-05-12
image: "https://cdn.deephacking.tech/i/posts/cai-ia-ciberseguridad/cai-ia-ciberseguridad-0.webp"
description: "Discover CAI, the open-source AI framework for automated pentesting: real results on HTB, PortSwigger, and bug bounties, revolutionary offensive and defensive capabilities."
categories:
  - "miscellaneous"
draft: false
featured: false
lang: "en"
---

You've probably been hearing about AI in cybersecurity everywhere. Whether it detects _malware_, analyzes logs... but what about the _offensive_ side? As creators of **CAI (Cybersecurity AI)**, we've been working for a while to take AI to the next level: seriously automating _pentesting_ and _bug_ hunting. And yes, we believe the future is already knocking at the door.

Today we're not just going to talk theory. We're going to tell you what CAI is, our _open-source framework_, and above all, we're going to show you with data and examples (including HTB _machines_ and PortSwigger labs!) why we think this is going to change the game.

- [The Pain Point: Why Do We Need Something Like CAI?](#the-pain-point-why-do-we-need-something-like-cai)
- [What is CAI? Our Baby, Open Source](#what-is-cai-our-baby-open-source)
- [Capabilities: What Can CAI Do?](#capabilities-what-can-cai-do)
- [Real Results: Where the Magic Happens](#real-results-where-the-magic-happens)
- [About LLMs and What Vendors Say...](#about-llms-and-what-vendors-say)
- [Who is CAI For?](#who-is-cai-for)
- [So, Should We Give CAI a Try?](#so-should-we-give-cai-a-try)
- [Get Involved!](#get-involved)

![CAI cybersecurity framework with AI](https://cdn.deephacking.tech/i/posts/cai-ia-ciberseguridad/cai-ia-ciberseguridad-1.avif)

## The Pain Point: Why Do We Need Something Like CAI?

Before diving in, let's set the context. The current landscape has its _issues_:

1. **Talent Gap:** There's a shortage of _pentesters_ and _security researchers_.
2. **Costs:** Serious audits and _bug bounty_ programs aren't cheap, and many _SMEs_ are left out.
3. **Walled Gardens in Bug Bounty:** Platforms like HackerOne or Bugcrowd centralize a lot, which isn't always ideal for everyone.
4. **The Bad Guys Use AI Too:** _Adversaries_ aren't sleeping. We need tools that scale.

CAI was born from the need to address this: a _framework_ to create specialized AI agents that do the dirty work (and sometimes not so dirty) faster, cheaper, and more accessible.

## What is CAI? Our Baby, Open Source

CAI isn't just a simple tool, it's an **agent-centric framework**, _lightweight_ and yes, **open-source** (you can find it on GitHub, link at the end). It's designed to build _cybersecurity agents_ that perform specific tasks.

Imagine you could assemble your own team of _AI pentesters_. The architecture is pretty cool, based on:

- **Agents:** Small focused AIs (one for _web recon_, another for _binary exploitation_, etc.).
- **Tools:** It integrates with the tools you already use: Nmap, Gobuster, Frida, Hashcat, Burp, Ghidra (thanks to the _Model Context Protocol_!), Impacket, etc. The agent decides what to launch.
- **Patterns:** Architectures to coordinate agents. We have a _Red Team Agent_ for _pentesting_, a _Bug Bounty Hunter_ for _vuln hunting_, and watch out!, also a **_Blue Team Agent_**. This last one focuses on defense: monitoring, incident response, _vulnerability assessment_ from the defender's perspective...
- **Human-In-The-Loop (HITL):** This is KEY! We don't believe in total autonomy (yet). With a Ctrl+C you can stop the agent, give it _feedback_, correct it... Human-AI collaboration is the present.

![CAI framework architecture](https://cdn.deephacking.tech/i/posts/cai-ia-ciberseguridad/cai-ia-ciberseguridad-2.avif)

## Capabilities: What Can CAI Do?

According to our tests and _R&D_ _(Research and Development)_:

1. **Automates the Offensive Kill Chain:** From _recon_ and _scanning_, through _exploit_, to _post-exploitation_ (_privesc_, _lateral movement_) and _reporting_.
2. **Automates Defense (with Offensive Mindset):** CAI doesn't just attack. With the _Blue Team Agents_, it can automate defensive tasks like continuous _vulnerability assessments_ or basic _incident response_. But what's interesting is that it does so **understanding how an attacker thinks**.
3. **Crushes CTFs (and Labs):** It eats through _challenges_ of web, _reversing_, _pwn_, _forensics_, _crypto_... and as we'll see, also PortSwigger labs!
4. **Does SAST (Static Analysis):** Analyzes _source code_ directly and finds _bugs_ in seconds/minutes.
5. **Bug Bounty Ready:** Designed to find real _bugs_ in production environments.
6. **Flexible & Extensible:** It's _open source_, modular... _Sky's the limit_.
7. **Speed & Cost:** Dramatically reduces time and costs.

[![CAI demo on Asciinema](https://cdn.deephacking.tech/i/posts/cai-ia-ciberseguridad/cai-ia-ciberseguridad-3.svg)](https://asciinema.org/a/713487)

## Real Results: Where the Magic Happens

Okay, enough talk. Does it work or not? Here's the hard data from our _benchmarks_ and tests:

- **CTFs vs Humans:**
    - In 54 varied _challenges_, CAI was **11x faster** and **156x cheaper** on average.
    - It destroyed in _forensics_ (938x faster), _reversing_ (774x), and _robotics_ (741x).
    - It struggled more with advanced _pwn_ and _crypto_.

![CAI benchmarks against humans in CTFs](https://cdn.deephacking.tech/i/posts/cai-ia-ciberseguridad/cai-ia-ciberseguridad-4.avif)

- **Solving Real Machines and Labs:**
    - **Hack The Box (HTB):** CAI automates the entire _killchain_. In 7 days, it got into the **Top 30 in Spain and Top 500 worldwide**. Although on complex _machines_ the human _First Blood_ is usually faster, CAI's ability to run multiple instances in parallel is a huge advantage.
    - **Concrete Example: HTB AD Machine (This is Gold!)**: So you can see how CAI thinks and adapts, we'll tell you how it broke a pretty nasty Active Directory machine:
        - **Sniffing and Finding the Lead 🕵️‍♂️:** Quick _nmap_ -> Windows DC. smbclient -> Share support-tools -> UserInfo.exe. Suspicious!
        - **Magic with the Binary ✨:** The .exe didn't give up the LDAP _creds_ easily. A normal script would have blocked. CAI didn't. It decompiled with monodis, saw the crappy XOR (key "armando") and BAM! LDAP password ready. Pure adaptation!
        - **From Domain to User 🚪:** With the LDAP _creds_, ldapdomaindump. The finding? Support pass in plain text 🤦‍♂️. WinRM access via crackmapexec (because other _tools_ like _evil-winrm_ failed and CAI knew to change strategy).
        - **Automated Active Directory Show 👑🤖:** CAI's specialty! It detected the RBCD (_Resource-Based Constrained Delegation_) attack path. The environment was unstable, PowerShell scripts were failing. A deterministic approach would have gotten stuck. **CAI's Solution (Intelligence over tools):** It used impacket (getuserspns.py, getnthash.py, secretsdump.py) intelligently to exploit RBCD and gain Administrator access.
        - **Resilience: Even Against Kali Linux Itself 🌪️:** The system running CAI (our Kali) started giving errors: broken dependencies, connection problems... Any traditional approach would have collapsed. CAI didn't: it identified the failures, resolved dependency conflicts, repaired services, and continued the attack without pause. Nothing stopped it! 🔥
    - **Why is CAI Different (and Better) in these cases? 😎** It's not a rigid command sequence. It's an **intelligence that orchestrates tools**. Where a deterministic script fails with an error or a "weird" environment, CAI:
        - **Analyzes:** Understands _why_ something fails.
        - **Adapts:** Chooses alternative _tools_ (netexec instead of evil-winrm, atexec instead of psexec).
        - **Resolves:** Fixes environment problems (DNS, variables, even errors in Kali itself!).
        - **Automates the Complex:** An AD attack from start to finish, overcoming obstacles.

<video controls src="https://files.catbox.moe/mi6oow.mp4"></video>

- **PortSwigger Web Security Academy:** It goes through _challenges_ of dozens of web vulnerabilities in different environments autonomously. Ideal for automating web testing.
- **Static Analysis (SAST) in Action:** Finds SQLi in .php files _without executing anything_, just by reading the code.

![Static SAST analysis with CAI](https://cdn.deephacking.tech/i/posts/cai-ia-ciberseguridad/cai-ia-ciberseguridad-5.avif)

- **Competitions (Live CTFs):**
    - **"AI vs Human" CTF:** CAI ranked **1st among AIs** and **Top 20 worldwide**, taking home $750. You can see HackTheBox's article at the following link:
        - [AI vs Human: CTF results show AI agents can rival top hackers](https://www.hackthebox.com/blog/ai-vs-human-ctf-hack-the-box-results)
    - **"Cyber Apocalypse CTF 2025":** 22nd place in 3 hours (among +8000 teams).
- **Bug Bounties, The Real Test:**
    - Week-long experiment:
        - _Non-Professionals:_ Found **6 valid bugs** (CVSS 4.3-7.4).
        - _Professionals:_ Found **4 bugs** (CVSS 4.3-7.5).
        - **Takeaway:** Similar results! CAI truly **democratizes** _bug hunting_ and _security testing_.

## About LLMs and What Vendors Say...

We did _benchmarks_ with several LLMs (Claude 3.7 Sonnet gave us the best results _so far_). We believe some major _vendors_ are being somewhat conservative when talking about the _offensive_ capabilities of their models. Our results with CAI show they can do quite a bit more than sometimes admitted.

## Who is CAI For?

- **Red Teams / Pentesters:** To automate and accelerate.
- **Security Researchers / Bug Hunters:** Pros (for efficiency) and _newbies_ (to get started!).
- **Companies (Especially SMEs):** For continuous and affordable _self-assessments_.
- **Blue Teams:** With the _Blue Team Agent_ for _monitoring_, _response_, and continuous _vuln assessment_, understanding the attacker's perspective.
- **Academics / Researchers:** _Open source_ platform to research AI + Cyber.
- **Devs / DevOps:** To integrate _SAST_ quickly into the _pipeline_.

## So, Should We Give CAI a Try?

Absolutely! CAI is an **open source** project with results that speak for themselves. It has competed, won money, crushed _labs_, machines, and has helped random people find real _bugs_. And let's not forget it also helps automate **defense**, but from a practical and offensive point of view: knowing how you can be attacked to defend yourself better.

The whole **democratizing** access to advanced _security testing_ (both _offensive_ and _defensive assessment_) is, for us, the most powerful thing.

Obviously, it's not magic. 100% autonomy has limits. _HITL_ is fundamental. But as a _tool_ to **augment capabilities** and **automate**, the potential is gigantic.

## Get Involved!

If you like the idea, want to try it, or contribute:

- **GitHub Repo:** [CAI Official Repository on GitHub](https://github.com/aliasrobotics/cai)
- **Discord Community:** [Join CAI Discord Community](https://discord.gg/fnUFcTaQAC)
- **Paper:** [CAI Research Paper on arXiv](https://arxiv.org/pdf/2504.06017v2)

Tinker around, see what it does, and tell us about it. Maybe your next _bug_ will be found with an _AI buddy_.

Happy Hacking! 😁
