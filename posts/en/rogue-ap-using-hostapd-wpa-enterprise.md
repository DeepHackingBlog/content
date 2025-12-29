---
id: "rogue-ap-usando-hostapd-wpa-enterprise"
title: "Rogue AP using hostapd-wpe - Attacks on WPA Enterprise Networks"
author: "eric-labrador"
publishedDate: 2022-05-02
updatedDate: 2022-05-02
image: "https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-0.webp"
description: "Learn how to perform Rogue AP attacks against WPA Enterprise networks using hostapd-wpe to capture user credentials."
categories:
  - "miscellaneous"
draft: false
featured: false
lang: "en"
---

First of all, for those of you who don't have a network card, I use the following one:

<figure>

![ALFA Network AWUS036AXML USB WiFi Adapter](https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-1.avif)

<figcaption>

[Buy ALFA Network AWUS036AXML adapter on Amazon](https://www.amazon.es/ALFA-Network-Adaptador-inal%C3%A1mbrico-externas/dp/B08SJC78FH/)

</figcaption>

</figure>

Although based on the experiences of acquaintances, this one also works well:

<figure>

![ALFA Network AWUS036NHA USB WiFi Adapter](https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-2.avif)

<figcaption>

[Buy ALFA Network AWUS036NHA adapter on Amazon](https://www.amazon.es/Alfa-Network-awus036nha-u-mount-cs-adaptador/dp/B01D064VMS/)

</figcaption>

</figure>

Now yes, let's start with the post : )

- [How did WPA come about?](#how-did-wpa-come-about)
- [What is WPA and WPA-Enterprise?](#what-is-wpa-and-wpa-enterprise)
- [How to exploit a WPA-Enterprise network?](#how-to-exploit-a-wpa-enterprise-network)

## How did WPA come about?

WPA was born from the need to increase the security of password encryption seen in the WEP protocol, since the method used by WEP is very insecure (the password can be obtained without using a dictionary). In the case of WPA, the attack becomes more complicated because the password is obtained in hash format, so it needs to be cracked.

To crack a password, the most effective method is to perform a dictionary attack, along with a program that can do the cracking (in this post I won't go into detail about how these programs work), such as JohnTheRipper or Hashcat.

In the following sections I will explain how the WPA-Enterprise protocol works and how to exploit it.

## What is WPA and WPA-Enterprise?

To begin with, WPA stands for **Wi-Fi Protected Access**. In the WPA protocol, the password is the only authentication vector.

A simple explanation of how authentication works:

1. The client device detects the access point and vice versa.
2. The AP requests a password to establish the connection.
3. The password entered by the client travels hashed to the access point (this part is known as handshake).
4. Depending on whether the password is correct or not, the AP authorizes client access.

But things change in WPA-Enterprise (Wi-Fi Protected Access Enterprise), since authentication requires a valid username and password, making the network more secure, although in the next section we'll see how to exploit it.

## How to exploit a WPA-Enterprise network?

To exploit an access point with the WPA-Enterprise protocol, in this case, we will use a Fake AP/Rogue AP. In this attack, the goal is to make the client authenticate against our malicious access point.

> Note: for a real attack, the access point must have the same SSID as the legitimate AP.

When the client enters the credentials, they will travel hashed and we can capture them very easily.

For this attack to succeed, as attackers we only need to:

1. Deny the connection between the legitimate access point and the client (we'll see this below).
2. Set up a fake access point (Rogue AP) to deceive the client.

[How do you perform a denial of service attack (also known as deauthentication)?](https://www.aircrack-ng.org/doku.php?id=deauthentication) Well, it's very simple, you only need a network card and a Linux console. Although this type of attack can be prevented with 802.11w Management Frame Protection MFP or with WPA3.

> Note: The software used for this post comes pre-installed by default on distributions like Kali Linux, Parrot OS, or Backtrack. If you're using a different distro, it can also be installed.

Before performing the deauthentication attack, we must put the network card in monitor mode, which can be done with the following command:

```bash
airmon-ng start wlan0
```

Now with the network card already in monitor mode, we need to prepare two consoles, one of them will be running the following command that will serve to capture all packets being transmitted on a specific channel:

```bash
airodump-ng wlan0mon -c 7
```

> Note: It's necessary to set the `-c X` parameter (where X is the channel on which we want to operate), otherwise the deauthentication command cannot be launched.
> 
> If you only want to perform a reconnaissance of the networks, we'll run it without the parameter.

Without closing the terminal where we're capturing packets, now in a new terminal, we'll execute the command to deauthenticate clients (I recommend running it infinitely, as I'll explain below, since this way no client will be able to reconnect to the legitimate access point until we've finished the attack.)

```bash
aireplay-ng -0 0 -e deephacking.tech -a AB:BA:AB:BA:AB:BA -c FF:FF:FF:FF:FF:FF wlan0mon
```

Command explanation:

- `-0` --> To tell the program that the attack we want to perform is deauthentication.
- `0` --> With 0 we tell the program to send packets infinitely.
- `-e` --> SSID (network name) of the access point.
- `-a` --> Corresponds to the MAC address of the access point.
- `-c` --> Corresponds to the MAC address of the client. If you don't set this parameter, it will be done in broadcast, so for this case it wouldn't really be necessary.
- `FF:FF:FF:FF:FF:FF` --> Broadcast address (this way the attack will be launched against all clients connected to the network).
- `wlan0mon` --> Corresponds to the name of the network card.

Using the previous command, all that remains is to set up the Rogue AP. For this, the **hostapd-wpe** program is used. This software may not be installed by default on some distributions, but it can be installed simply with:

```bash
sudo apt-get update && sudo apt-get install hostapd-wpe
```

- Note: This command is only available in Kali and Parrot repositories

Once the program is installed, a file will be generated in the path `/etc/hostapd-wpe/` called `hostapd-wpe.conf`. This is the file we're interested in, as it will be where we can configure the malicious access point (SSID, channel, ...).

Mainly as attackers we will have to change the values marked in the following image:

<figure>

![hostapd-wpe configuration](https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-3.avif)

</figure>

- **Interface**: to tell hostapd through which interface we want to set up the access point.
- **SSID**: Corresponds to the name that will be displayed when listing all available networks, **as mentioned before, the idea is to copy the SSID of the victim network**.

Once the values are configured, you simply need to save the changes and set up the access point with the following command:

```bash
hostapd-wpe /etc/hostapd-wpe/hostapd-wpe.conf
```

<figure>

![Access point set up with hostapd-wpe](https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-4.avif)

</figure>

The access point is now set up, on the victim's side it will be seen as follows:

<figure>

![WiFi network as seen from the victim's device](https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-5.avif)

</figure>

As you can see, it appears as a completely normal network. When connecting, it will request a username and password:

<figure>

![Credentials request when connecting to the network](https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-6.avif)

</figure>

> In this case, the client doesn't verify the certificate and uses an MSCHAP hash, which is why it's possible to crack it. If for example, GTC downgrade were used, the credentials would appear in plain text.
> 
> So, what is the most secure option?
> 
> The best option is to use certificates instead of username and password.

When entering credentials, in the command console, we will get the following:

<figure>

![Captured credentials in hash format](https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-7.avif)

</figure>

Indeed, we get the username in clear text and the hashed password, in fact it's provided in JTR (JohnTheRipper) or Hashcat format (I'll leave it to your discretion to use one program or the other).

Now, you simply need to create a file with the obtained hash to be able to crack it:

<figure>

![File with the hash to crack](https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-8.avif)

</figure>

Personally, I prefer JohnTheRipper, so that's what I'll use. The command to crack it is very simple:

```bash
john --wordlist=rockyou.txt hash
```

<figure>

![Password cracked with JohnTheRipper](https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-9.avif)

</figure>

If the password is in the dictionary used, it will be cracked successfully. In this way, we will have exploited a WPA-Enterprise network by having obtained user credentials from it.
