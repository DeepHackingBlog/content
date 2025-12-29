---
id: "que-es-el-localaccounttokenfilterpolicy"
title: "What is LocalAccountTokenFilterPolicy"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-01-21
updatedDate: 2022-01-21
image: "https://cdn.deephacking.tech/i/posts/que-es-el-localaccounttokenfilterpolicy/que-es-el-localaccounttokenfilterpolicy-0.webp"
description: "Learn what LocalAccountTokenFilterPolicy is in Windows, how it affects remote command execution with local administrative accounts, and how to disable it for pentesting purposes."
categories:
  - "windows"
  - "active-directory"
draft: false
featured: false
lang: "en"
---

When we obtain administrator credentials in a Windows environment, it's very common to check if we get the classic Pwn3d! from CrackMapExec to verify whether we can execute commands and obtain a shell.

Post I recommend reading:
- [What is Pass The Hash and Why Does It Work? - NTLM Authentication](https://blog.deephacking.tech/en/posts/how-ntlm-authentication-works/)

However, it can happen that we have administrator credentials but don't have the ability to execute commands. This can be due to LocalAccountTokenFilterPolicy.

Example:

![User sikumy belonging to the Administrators group in Windows](https://cdn.deephacking.tech/i/posts/que-es-el-localaccounttokenfilterpolicy/que-es-el-localaccounttokenfilterpolicy-1.avif)

The user "sikumy" is in the "Administrators" group, but:

![CrackMapExec without Pwn3d due to LocalAccountTokenFilterPolicy](https://cdn.deephacking.tech/i/posts/que-es-el-localaccounttokenfilterpolicy/que-es-el-localaccounttokenfilterpolicy-2.avif)

We don't get the famous Pwn3d!, therefore, we cannot execute commands.

So, what is LocalAccountTokenFilterPolicy and how does it affect us?

Simply put, LocalAccountTokenFilterPolicy is a filter that prevents elevated privileges from being used over the network. This only applies to local administrative accounts, it doesn't affect domain accounts. Because of this restriction, we cannot make use of the account's privileges over the network, and therefore, obtain the Pwn3d! and execute commands.

To disable LocalAccountTokenFilterPolicy, we need to modify the following registry key:

`HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\system`

Specifically, the value named "LocalAccountTokenFilterPolicy". If that registry is 0, it means it's enabled, if it's 1, the opposite. We want it to be 1. We can change its value using the following command:

```cmd
cmd /c reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\system /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1 /f
```

![Modification of the LocalAccountTokenFilterPolicy registry with value 1](https://cdn.deephacking.tech/i/posts/que-es-el-localaccounttokenfilterpolicy/que-es-el-localaccounttokenfilterpolicy-3.avif)

Now, if we go back to CrackMapExec:

![CrackMapExec showing Pwn3d after disabling LocalAccountTokenFilterPolicy](https://cdn.deephacking.tech/i/posts/que-es-el-localaccounttokenfilterpolicy/que-es-el-localaccounttokenfilterpolicy-4.avif)

We get the Pwn3d!, thanks to having disabled this restriction. So now we can execute commands and do whatever we want.

## References

- [Description of User Account Control and Remote Restrictions on Microsoft Docs](https://docs.microsoft.com/en-us/troubleshoot/windows-server/windows-security/user-account-control-and-remote-restriction)
- [Local Administrator Accounts Must Have Their Privileged Token Filtered to Prevent Elevated Privileges on the Network in Domain Systems](https://www.stigviewer.com/stig/windows_server_2008_r2_member_server/2014-04-02/finding/V-36439)
