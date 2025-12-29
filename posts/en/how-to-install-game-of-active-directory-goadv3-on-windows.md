---
id: "como-instalar-game-of-active-directory-goadv3-en-windows"
title: "How to Install Game of Active Directory (GOADv3) on Windows"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2025-04-12
updatedDate: 2025-04-12
image: "https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-0.webp"
description: "Complete guide to install GOADv3, the best Active Directory lab for practicing pentesting, using VMWare and Python on Windows."
categories:
  - "active-directory"
draft: false
featured: false
lang: "en"
---

One year ago we released an article showing how to install the best Active Directory lab for practice, GOAD. Since then, quite some time has passed and GOAD has been updating, reaching its current version, version 3. Today's article is an update and replacement of the article we did at the time, we're going to see how to install the GOAD lab on Windows using VMWare and Python. The steps to perform the installation on VirtualBox should be practically the same, but since I haven't personally tested it I can't confirm it 100%. That said, let's get started :)

- [GOAD Features](#goad-features)
- [Requirements](#requirements)
- [Installing GOAD Using VMWare and Python](#installing-goad-using-vmware-and-python)
- [GOAD Credentials](#goad-credentials)
- [Possible Issues if Using WSL](#possible-issues-if-using-wsl)

## GOAD Features

Let's briefly mention the features that GOAD has for those who don't know it. The infrastructure of the complete lab (which is what we're going to install) is as follows:

![Complete GOAD lab infrastructure with its domains and machines](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-1.avif)

Although it has other versions and extensions. We can see all the available ones in the [official GOAD repository on GitHub](https://github.com/Orange-Cyberdefense/GOAD).

GOAD has a large number of vulnerabilities and features, in the following table, we can find all those that have been added to the lab through the versions. The current version and the one we're going to install is v3, and, as of this writing, this is everything the lab includes and supports:

| Version | Functionalities | Functionalities |
| --- | --- | --- |
| **v1** | SMB share anonymous   SMB not signed   Responder   Zerologon   Windows Defender | ASREPRoast   Kerberoasting   AD ACL abuse   Unconstrained delegation   NTLM relay |
| **v2** | Password reuse between computers (PTH)   Spray user = password   Password in description   Constrained delegation   Install MSSQL   MSSQL trusted link   MSSQL impersonate   Install IIS   Upload ASP app   Multiple forests   Anonymous RPC user listing   Child-parent domain   Generate certificate and enable LDAPS   ADCS (ESC 1/2/3/4/6/8)   Certify | samAccountName/noPAC   PetitPotam unauthenticated   PrinterBug   Drop the mic   Shadow credentials   mitm6   Add LAPS   GPO abuse   Add WebDAV   Add RDP bot   Full Proxmox integration   Add gMSA (recipe created)   Add Azure support   Refactor lab and providers   Protected Users   Account is sensitive   Add PPL   Groups inside groups   Shares with secrets (all, SYSVOL)   SCCM (see SCCM lab) |
| **v3** | AWS support   Ludus support   Windows install compatibility   Extension support   Multiple instance management | Extension Exchange   Extension Ludus   Extension ELK   Extension WS01   Extension Exchange: add a bot to read mails |

## Requirements

First we're going to install everything necessary to be able to install the GOAD lab without (almost) any problems. We're going to follow the steps described in the documentation itself, although here we'll see them in more detail and with images, if you're interested in having the documentation as a reference you can find it at the following link:
- [Official GOAD documentation for Windows installation](https://orange-cyberdefense.github.io/GOAD/installation/windows/)

Let's start by installing Visual C++ 2019, we can download it from the following link:
- [Download Visual C++ Redistributable 2019 x64](https://aka.ms/vs/17/release/vc_redist.x64.exe)

<div class="grid grid-cols-2 gap-4">
<div>

![Visual C++ Redistributable installer download](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-2.avif)

</div>
<div>

![Visual C++ Redistributable installation window](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-3.avif)

</div>
</div>

![Visual C++ Redistributable installation completion](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-4.avif)

Once installed, we'll restart the computer, and then we'll proceed to install Vagrant:
- [Official Vagrant installation page](https://developer.hashicorp.com/vagrant/install)

In this case you can download the latest version that's available, it should work. The version I used as of this writing is 2.4.3:

![Vagrant download page](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-5.avif)

<div class="grid grid-cols-2 gap-4">
<div>

![Vagrant installer start](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-6.avif)

</div>
<div>

![Vagrant installation process](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-7.avif)

</div>
</div>

![Vagrant installation completion](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-8.avif)

After installing Vagrant we must restart the computer again. Once we do, we'll install the Vagrant VMWare utility:
- [Vagrant VMWare Utility installation page](https://developer.hashicorp.com/vagrant/install/vmware)

![Vagrant VMWare Utility download page](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-9.avif)

<div class="grid grid-cols-2 gap-4">
<div>

![Vagrant VMWare Utility installer start](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-10.avif)

</div>
<div>

![Vagrant VMWare Utility installation process](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-11.avif)

</div>
</div>

![Vagrant VMWare Utility installation completion](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-12.avif)

Once this utility is installed, we'll open a CMD or PowerShell window and install the necessary plugins (it's not necessary to open the window as administrator):

```powershell
vagrant.exe plugin install vagrant-reload vagrant-vmware-desktop winrm winrm-fs winrm-elevated
```

![Vagrant plugins installation in PowerShell](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-13.avif)

After installing the plugins it's time to install the last requirements:
- Python: version 3.10 is recommended.
  - [Download Python for Windows](https://www.python.org/downloads/windows/)

![Python for Windows download page](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-14.avif)

<div class="grid grid-cols-2 gap-4">
<div>

![Python installer start](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-15.avif)

</div>
<div>

![Python installation completion](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-16.avif)

</div>
</div>

- Git: to be able to clone the repository
  - [Download Git for Windows](https://git-scm.com/downloads/win)

![Git for Windows download page](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-17.avif)

<div class="grid grid-cols-2 gap-4">
<div>

![Git installer start](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-18.avif)

</div>
<div>

![Git installation process](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-19.avif)

</div>
</div>

![Git installation completion](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-20.avif)

At this point, we now have all the necessary requirements to install GOAD. So let's begin with the process.

## Installing GOAD Using VMWare and Python

First we're going to start by cloning the repository and installing the Python package requirements. It's important to correctly choose the folder where we'll clone it, since that's where the GOAD machines will be installed later, for example I install it in Documents.

```powershell
git clone https://github.com/Orange-Cyberdefense/GOAD
cd GOAD/
pip install -r noansible_requirements.yml
```

![GOAD repository cloning and Python dependencies installation](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-21.avif)

Once we've cloned the repository and installed the dependencies we must edit one of the scripts that come in the GOAD repository, specifically we must edit the following script:

```powershell
GOAD\vagrant\fix_ip.ps1
```

![Location of fix_ip.ps1 script in GOAD repository](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-22.avif)

If we open this script, we can see in the first two lines a comment referring to an existing bug in vmware when setting the IP:

![Comment in fix_ip.ps1 script about VMWare bug](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-23.avif)

If we open the issue link, we can see a script that solves the mentioned bug:

![Bug solution in VMWare GitHub issue](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-24.avif)

So we'll simply have to copy this script and replace it with the original content:

```powershell
param ([String] $ip)

$subnet = $ip -replace "\.\d+$", ""

$name = (Get-NetIPAddress -AddressFamily IPv4 `
   | Where-Object -FilterScript { ($_.IPAddress).StartsWith($subnet) } `
   ).InterfaceAlias

if ($name) {
  Write-Host "Set IP address to $ip of interface $name"
  & netsh.exe int ip set address "$name" static $ip 255.255.255.0 "$subnet.1"
}
```

![Updated fix_ip.ps1 script with bug solution](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-25.avif)

We'll save this change and proceed to execute the GOAD script:

```powershell
py goad.py -m vm
```

![GOAD script execution with virtual machine parameter](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-26.avif)

To verify that everything is fine or that we have space, we can execute the check command:

![Verification of available space and system requirements](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-27.avif)

After verifying that we have enough space and everything is correct, we can proceed to execute the install command:

![GOAD installation process start](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-28.avif)

During installation, I encountered the following problem with the WinRM transport: negotiate command:

![WinRM transport negotiate error during installation](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-29.avif)

If it doesn't happen to you, that's better, but in case it does, this is a typical error that's detailed in the GOAD documentation. Within the documentation, we can find a Troubleshooting section:
- [GOAD troubleshooting guide](https://orange-cyberdefense.github.io/GOAD/troobleshoot/)

If you encounter any problem, first check on this page if your error might already be described. If not, you'll have to search in GOAD's issues in case it has happened to someone else. In any case, to solve the error I show in the image above we must edit the main Vagrantfile. To do this, we'll go to the folder we can see in the second line of the image above (the CWD value):

```powershell
GOAD\workspace\5ac83c-goad-vmware\provider
```

Your identifier will be different, so check what value the CWD has in your console. Once verified, we go to that folder:

![GOAD provider folder with unique identifier](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-30.avif)

Here we'll find the main Vagrant file:

![Main Vagrantfile in provider folder](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-31.avif)

Inside this file, to solve the WinRM transport: negotiate failure, we'll have to add the following two lines:

```powershell
config.winrm.transport = "plaintext"
config.winrm.basic_auth_only = true
```

The error occurs because WinRM SSL negotiation fails, so with these two new lines we'll be telling it to do the communication in plain text:

![WinRM plaintext configuration in Vagrantfile](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-32.avif)

Here I'd like to make a small aside, if you've made several installation attempts because you've had different errors, I recommend that before running the install command again, you delete the interface that the GOAD script creates. This interface corresponds by default to the 192.169.56 subnet. Go to your computer's network adapter settings, and delete the adapter that corresponds to that subnet. Once you do this, resume the installation process with the install command. I mention this detail because it happened to me that while looking for a solution to the errors I was getting, there was a point where the existence of this interface was giving me problems when I wanted to resume an installation, since when the installation starts, it tries to create this interface.

In any case, getting back to the topic, after adding the two lines to the Vagrant file, I proceeded again with the installation by running the installation command. Here everything started to go well, however, on the second to last machine (SRV02) I got the following error:

![Error during SRV02 machine installation](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-33.avif)

This error is not a big deal, normally it occurs if I'm not mistaken because the script tries to communicate with the machine before it has time to turn on. So the solution to this error is simply to turn off the machine and start the process again. Don't worry because the machines that have finished installing and configuring up to this point won't have to be done again, as long as you leave them on, which is how they are at this moment. To turn off the SRV02 computer where this failure occurred, simply right-click on the VMWare icon in the taskbar and indicate that we want to open all the virtual machines that are in the background:

![VMWare context menu to open virtual machines](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-34.avif)

Here VMWare will open and we'll simply have to turn off the machine with right-click and PowerOff. This way, the script will continue correctly:

![GOAD virtual machines in VMWare with shutdown option](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-35.avif)

The SRV02 and SRV03 machines will presumably install without problems. Now, when we reach the machine used to provision (aka. configure each AD machine with users, vulnerabilities, etc), we may get an authentication failure error:

![Authentication failure error on PROVISIONING machine](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-36.avif)

This is simply because the key pair that the script uses to authenticate to the computer hasn't been generated. We'll have to do this step manually, it's simple so no worries. To do this, we'll have to open VMWare and go to the PROVISIONING machine:

![PROVISIONING machine in VMWare](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-37.avif)

![Login to PROVISIONING machine with vagrant credentials](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-38.avif)

Here we'll log in with the default credentials vagrant:vagrant.

![Generation of SSH ed25519 key pair for vagrant user](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-39.avif)

Once logged in, we must generate an SSH key pair for the vagrant user:

```bash
ssh-keygen -t ed25519
```

![Copying SSH public key to authorized_keys](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-40.avif)

We won't set any passphrase, we'll simply press enter until the key pair is generated. Once done, we'll copy the public key to the authorized\_keys file inside the .ssh folder:

```bash
cp id_ed25519.pub authorized_keys
```

![Python HTTP server to download private key](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-41.avif)

Having done this, we must download the private key to our Windows computer, for this, the easiest way is to start a simple HTTP server with Python:

```bash
python3 -m http.server 80
```

![Private key download from browser](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-42.avif)

![Private key saved as private_key in Vagrant folder](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-43.avif)

We'll download the private key and save it in the following path:

```powershell
C:\Users\JuanA\Documents\GOAD\workspace\5ac83c-goad-vmware\provider\.vagrant\machines\PROVISIONING\vmware_desktop
```

The name we must save the private key with is private\_key.

![SSH authentication verification with private key](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-44.avif)

After saving the key we can verify that it works:

![Installation continuation after configuring SSH authentication](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-45.avif)

In this case, to connect I used the IP of the PROVISIONING machine's NAT interface. Basically, each GOAD machine has 2 interfaces:
- Host-Only (the 192.168.56 subnet interface)
- The default interface that we have configured as NAT in VMWare

I used the IP of the second interface because I know it works without problems. Now I'll explain why. The thing is we can see that the private key works without problems for authentication. So turn off the PROVISIONING machine and run the install command again to continue with the installation:

![File transfer to PROVISIONING via SCP](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-46.avif)

We'll be able to see how where authentication failed before, it will now work without problems. Once the script verifies that authentication works, it will proceed to pass the necessary files to the PROVISIONING machine, it will do this with the SSH SCP command:

![VMWare interface IP verification with ipconfig](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-47.avif)

However, here we may encounter the error we can see in the image. An error that it can't make the connection. This error occurs because for some reason, the VMWare interface of the 192.168.56 subnet doesn't have a valid IP, we can confirm this by running an ipconfig in another console on our Windows:

![Windows network adapter configuration](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-48.avif)

We see that the IP is an APIPA one, which means that a valid IP couldn't be established for the interface. The solution to this is really simple, we'll simply have to configure a static IP for this interface:

![Static IP configuration on VMWare Host-Only interface](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-49.avif)

![SSH connectivity verification with ssh_jumpbox command](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-50.avif)

In this interface, being Host-Only type, it won't need a Gateway and DNS servers. We can set the configuration shown in the image. Once we've made this change, if we run the ssh\_jumpbox command in the GOAD script, we can see it works without problems:

```python
ssh_jumpbox
```

![Successful installation continuation after configuring IP](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-51.avif)

So, after validating that it now works and has connection, if we run the install command again, the installation continues without problems:

![Connection error from PROVISIONING to domain machines](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-52.avif)

Now, later on I got another connection error, but this time not with the PROVISIONING machine, but the error came from the PROVISIONING machine not being able to communicate with any of the GOAD machines:

![Invalid IP verification on domain machines](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-53.avif)

This failure occurs for the same reason as the previous one, the GOAD machines don't have a valid IP on the 192.168.56 subnet interface. We can validate this if we log into each machine and see the IP of their second interface. To log into each machine we can use the default vagrant credentials, vagrant:vagrant.

![Location of Vagrantfile with default IPs](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-54.avif)

As we can observe, just like the Windows interface previously, these machines have an invalid IP. The solution is exactly the same, go machine by machine configuring a static IP. Of course, it's important to observe what IP we give it since the script uses the last octet to communicate with the computer that's getting the configuration, meaning we don't want DC01 to get the SRV03 configuration for example.

In the following Vagrant file we can see what the default IPs of each machine are:

```powershell
GOAD\ad\GOAD\providers\vmware
```

![Vagrantfile showing IPs assigned to each machine](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-55.avif)

![Static IP configuration on domain machines](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-56.avif)

The IPs with their corresponding computer are as follows:
- DC01: 192.168.56.10
- DC02: 192.168.56.11
- DC03: 192.168.56.12
- SRV02: 192.168.56.22
- SRV03: 192.168.56.23

So we'll simply have to go computer by computer, logging in with the vagrant user and setting the following configuration, where only the last octet of the IP will change depending on the machine we're configuring:

![Provision_lab command execution to configure lab](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-57.avif)

After making these changes, now yes, everything will install without problems and the GOAD lab installation will be complete. Now instead of running the install command, since we only have provisioning left, we can run the following command directly:

```python
provision_lab
```

![Successful lab provisioning completion](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-58.avif)

![Confirmation that GOAD lab is fully functional](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-59.avif)

With this, GOAD is now fully operational :)

![Network interface configuration in Kali Linux to connect with GOAD](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-60.avif)

It's important that you add a second interface to your Kali that corresponds to the 192.168.56 subnet and configure the static IP:

![Static IP configuration on Kali Linux interface](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-61.avif)

![Static IP configuration on Kali Linux interface](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-62.avif)

Otherwise, you can also use the NAT subnet (192.168.10 in my case) and that's it, since the GOAD machines also have this interface.

## GOAD Credentials

Below is a table that summarizes all GOAD credentials to be used as reference:

| User | Domain | Password | Purpose | Administrator on |
| --- | --- | --- | --- | --- |
| tywin.lannister | sevenkingdoms.local | powerkingftw135 | Lannister leader, with specific permissions (forcechangepassword). | \- |
| jaime.lannister | sevenkingdoms.local | cersei | Lannister member, with elevated permissions (GenericWrite). | \- |
| cersei.lannister | sevenkingdoms.local | il0vejaime | Administrative leader, member of Domain Admins, Lannister and Small Council. | dc01 (kingslanding) |
| tyron.lannister | sevenkingdoms.local | Alc00L&S3x | Lannister member, with specific permissions (Self-Membership). | \- |
| robert.baratheon | sevenkingdoms.local | iamthekingoftheworld | Administrative leader, member of Domain Admins, Baratheon and Small Council. | dc01 (kingslanding) |
| joffrey.baratheon | sevenkingdoms.local | 1killerlion | Member of Baratheon and Lannister, with elevated permissions (WriteDacl). | \- |
| renly.baratheon | sevenkingdoms.local | lorastyrell | Member of Baratheon and Small Council, with sensitive permissions (WriteDacl). | \- |
| stannis.baratheon | sevenkingdoms.local | Drag0nst0ne | Member of Baratheon and Small Council, with elevated permissions (GenericAll). | \- |
| petyer.baelish | sevenkingdoms.local | @littlefinger@ | Small Council member, standard role. | \- |
| lord.varys | sevenkingdoms.local | W1sper$ | Small Council member, with critical permissions (GenericAll Domain Admins). | \- |
| maester.pycelle | sevenkingdoms.local | MaesterOfMaesters | Small Council member, standard role. | \- |
| arya.stark | north.sevenkingdoms.local | Needle | Stark member, with elevated SQL permissions (impersonate dbo). | \- |
| eddard.stark | north.sevenkingdoms.local | FightP3aceAndHonor! | Administrative leader, member of Domain Admins and Stark. | dc02 (winterfell) |
| catelyn.stark | north.sevenkingdoms.local | robbsansabradonaryarickon | Stark member, with administrative role. | dc02 (winterfell) |
| robb.stark | north.sevenkingdoms.local | sexywolfy | Stark member, with exposed credentials (autologon). | dc02 (winterfell) |
| sansa.stark | north.sevenkingdoms.local | 345ertdfg | Stark member, with SPN (HTTP/eyrie). | \- |
| brandon.stark | north.sevenkingdoms.local | iseedeadpeople | Stark member, with SQL permissions (impersonate jon.snow). | \- |
| rickon.stark | north.sevenkingdoms.local | Winter2022 | Stark member, standard role. | \- |
| hodor | north.sevenkingdoms.local | hodor | Stark member, standard role (likely test account). | \- |
| jon.snow | north.sevenkingdoms.local | iknownothing | Member of Stark and Night Watch, with SPN (HTTP/thewall) and SQL permissions (sa). | \- |
| samwell.tarly | north.sevenkingdoms.local | Heartsbane | Night Watch member, with SQL permissions (impersonate sa). | \- |
| jeor.mormont | north.sevenkingdoms.local | L0ngCl@w | Night Watch and Mormont leader, with administrative role. | srv02 (castelblack) |
| sql\_svc (north) | north.sevenkingdoms.local | YouWillNotKerboroast1ngMeeeeee | SQL service account for MSSQL on castelblack. | \- |
| daenerys.targaryen | essos.local | BurnThemAll! | Administrative leader, member of Domain Admins and Targaryen. | dc03 (meereen) |
| viserys.targaryen | essos.local | GoldCrown | Targaryen member, with specific permissions (e.g. CA manager). | dc03 (meereen) |
| khal.drogo | essos.local | horse | Dothraki leader, with elevated permissions (GenericAll). | srv03 (braavos) |
| jorah.mormont | essos.local | H0nnor! | Targaryen member, with specific permissions (GenericAll by Spys). | \- |
| missandei | essos.local | fr3edom | User with specific permissions (GenericWrite/GenericAll). | \- |
| drogon | essos.local | Dracarys | Dragons member, related to gMSA. | \- |
| sql\_svc (essos) | essos.local | YouWillNotKerboroast1ngMeeeeee | SQL service account for MSSQL on braavos. | \- |

## Possible Issues if Using WSL

This part is sponsored by my friend Ángel (aka. [Anthares101 on GitHub](https://github.com/Anthares101)), who also installed GOAD, but unlike me, he did it using WSL instead of Python. If you do it this way it's possible you may also encounter some issues. Below I list some problems he encountered, and the respective solutions he took:

#### Ansible Cannot Reach Machines

After deploying Vagrant on all machines (remember to add them to VMware using the scan option), Ansible will complain about not being able to reach the machines. This is because the created network interface doesn't have a DHCP server by default, leaving our host without a valid IP address.

Go to Virtual Network Editor and update the new network to have a DHCP server, wait about 5 minutes and try again.

#### DNS Errors

Sometimes, machines can get confused about which interface to use for DNS resolution. Just force the correct interface for .local domains on the machines with:

```powershell
Add-DnsClientNrptRule -Namespace ".local" -NameServers "192.168.56.10"
Clear-DnsClientCache

# Avoid blocking as it can fail even if the problem is resolved  
Resolve-DnsName sevenkingdoms.local
```

#### Time Zone and Trial Renewal

You should probably change the time zone of each machine to yours to avoid problems with Kerberos. Run the following command as administrator on all machines:

```bash
# Windows
tzutil /s "Romance Standard Time"

# Linux
sudo timedatectl set-timezone Europe/Madrid
```

To avoid having to reinstall the lab again, you can renew the Windows Server trial license using:
- [Microsoft Activation Scripts on GitHub](https://github.com/massgrave/Microsoft-Activation-Scripts)
