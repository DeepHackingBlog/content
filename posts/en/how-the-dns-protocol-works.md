---
id: "como-funciona-el-protocolo-dns"
title: "How the DNS Protocol Works"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2023-05-29
updatedDate: 2023-05-29
image: "https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-0.webp"
description: "Learn how the DNS protocol works, the types of servers involved in domain resolution, and the most common DNS records used on the internet."
categories:
  - "osint"
draft: false
featured: false
lang: "en"
---

Understanding how the DNS protocol works is vitally important to understand how the internet works. But not only that, it's also really useful and necessary when conducting reconnaissance of a company's assets. Therefore, in this post we're going to see how the protocol works with practical reconnaissance examples.

- [Introduction](#introduction)
- [Most Common DNS Records](#most-common-dns-records)
- [Conclusion](#conclusion)
- [References](#references)

## Introduction

The DNS (Domain Name System) protocol, in simple terms, translates a domain to an IP address, like a contact list. For example, on your phone you can save the contact "The Pizza Guy" and associate a phone number with it so that when you call them, you don't need to know their phone number. Well, the DNS protocol does the same thing, it's much easier to remember a domain like **deephacking.tech** than to remember its IP: 51.255.26.63.

Additionally, this allows that based on which domain you're resolving and accessing the IP with, it shows you a different response. This is what's known as [Virtual Hosting (shared hosting)](https://es.wikipedia.org/wiki/Alojamiento_compartido). It allows multiple websites to be stored on the same server.

This is the basic idea that sustains the DNS protocol. However, for it to be carried out in practice, it's a bit more complex. Before talking about the types of DNS servers, the most important thing is to know the syntax and structure of a domain when it comes to DNS resolution:

![Diagram of the hierarchical structure of a DNS domain showing TLD, domain and subdomain](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-1.avif)

When a DNS resolution is performed, it starts with the TLD domain and follows a hierarchical structure. To understand it well, let's see the types of DNS servers that exist along with a DNS resolution process:

- [Root servers](https://es.wikipedia.org/wiki/Servidor_ra%C3%ADz):
    - They are the first step of DNS.
    - They possess the information of TLD servers, name and IP address.
    - There are 13 root servers.
    - They are reviewed by ICANN (Internet Corporation for Assigned Names and Numbers).
    - On a practical level, these servers handle a file of around 200kB that contains the information of authorized DNS servers for all top-level domains (TLD), the [root zone file](https://www.internic.net/domain/root.zone).
    - For example, this file helps us know which servers we can query if we want to resolve a **.com**, **.es**, etc. domain.

<figure>

![DNS query showing authoritative TLD servers for the .com domain](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-2.avif)

<figcaption>

TLD servers for a .com domain

</figcaption>

</figure>

<figure>

![DNS query showing authoritative TLD servers for the .es domain](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-3.avif)

<figcaption>

TLD servers for a .es domain

</figcaption>

</figure>

- TLD servers:
    - These servers store the addresses of authoritative servers for all domains ending in the corresponding TLD. They are stored in records called "Glue Records".
    - They are administered by IANA (Internet Assigned Numbers Authority).
    - IANA divides TLD servers into two types:
        - **Generic TLDs**: domains that don't belong to a specific country: **.com**, **.org**, **.net**, **.edu**, **.gov**, etc.
        - **Country TLDs**: domains that are associated with countries or states: **.uk**, **.us**, **.ru**, **.jp**, etc.
    - For example, if we want to find out the authoritative servers for **amazon.es** we'll use any of the servers that help resolve domains ending in **.es**:

<figure>

![DNS query showing the authoritative servers for the amazon.es domain](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-4.avif)

<figcaption>

Authoritative servers for **amazon.es** (they are the ones that have the IP of **amazon.es**)

</figcaption>

</figure>

What we've seen so far, that is, root and TLD servers, are "public" services financed by operators and domain purchases. However, now, authoritative and recursive servers are private DNS servers.

- Authoritative servers:
    - The authoritative server is usually the last step in the chain to obtain a domain's IP address.
    - This server has specific information about the domain, such as DNS records (A, AAAA, CNAME, MX, TXT, NS, SOA, SRV, PTR).
    - If we want to obtain the final IP of **amazon.es**, we must query any of the authoritative servers we previously obtained:

<figure>

![DNS query showing the IP addresses of the amazon.es domain](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-5.avif)

<figcaption>

IPs of **amazon.es**

</figcaption>

</figure>

We can verify this in any online DNS resolution tool, for example, [MXToolbox](https://mxtoolbox.com/SuperTool.aspx):

![DNS resolution result for amazon.es in MXToolbox showing multiple IP addresses](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-6.avif)

All these steps we've seen are normally reduced due to caching, whether it's from our local computer, the recursive server we're using, internet provider, browser, etc. Speaking of recursive servers, let's see what they're about, they're probably the ones that sound most familiar:

- Recursive servers: these are the servers that handle the DNS requests we make. One of the most famous is **8.8.8.8** from Google. So basically these servers handle the steps we've seen above, we ask for a domain, and they take care of doing the work for us. This type of server along with authoritative servers are the ones that can be configured on our devices:

![DNS server configuration in Windows control panel](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-7.avif)

If we set up a recursive server, the computer will send DNS queries to that server and trust it to resolve the domain names it requests. On the contrary, if we set up an authoritative DNS server, it will only be able to respond to queries related to the domains for which it has authority. That's the difference between a recursive server and an authoritative one.

Having seen the complete process that takes place when resolving a domain, let's see the type of information that an authoritative server can have about a domain, that is, DNS records.

## Most Common DNS Records

DNS records are instructions stored on authoritative DNS servers that contain information about a specific domain. Records are stored in the form of text files, and use DNS syntax (a series of commands) to tell the DNS server what to do. Each record has its own purpose and structure within the DNS syntax. Additionally, each record has a TTL (Time-to-Live) that defines how long it should be kept in cache before requesting an update.

That said, some of the most common DNS records are:

- **A Record**: contains the IP address(es) of a domain.

![A-type DNS query showing the IP address of facebook.com](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-8.avif)

- **AAAA Record**: contains the IPv6 address(es) of a domain.

<figure>

![DNS query showing IPv6 records for facebook.com using the any type](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-9.avif)

<figcaption>

I had problems getting the value using: dig aaaa **facebook.com** so I use "any" instead

</figcaption>

</figure>

- **CNAME Record**: contains an alias to another domain name. For example, a CNAME record can associate **"www[.]example[.]com"** with **"example[.]com"**, which means both domain names point to the same resource. This is vitally important when dealing with "scope" in an audit, as we can find a subdomain of a domain in scope, but that points to another domain that has nothing to do with it.

For example, when you enumerate subdomains of a company, you'll often find an **autodiscover** domain. This subdomain is commonly related to Outlook. For example, if we get the CNAME record for **autodiscover.tesla.com**, we can see that it points to **autodiscover.outlook.com**:

![CNAME-type DNS query showing that autodiscover.tesla.com points to autodiscover.outlook.com](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-10.avif)

And if we access it:

![Outlook Web App login page for the tesla.com domain](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-11.avif)

We confirm that it's the case. So these are details to keep in mind when enumerating a company's assets.

- **MX Record**: indicates the email servers that are used to receive email messages intended for a specific domain.

![MX-type DNS query showing the mail servers for **facebook.com**](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-12.avif)

- **TXT Record**: stores arbitrary textual information associated with a domain name. It's used for various purposes, such as email authentication (SPF, DKIM), domain verification and other services.

![TXT-type DNS query showing multiple text records for **facebook.com**](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-13.avif)

- **NS Record**: used to specify the authorized name servers for a particular domain.

![NS-type DNS query showing the name servers for **facebook.com**](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-14.avif)

- **PTR Record**: used to relate an IP address to a domain name. While normal DNS records translate domain names into IP addresses, the PTR record does the opposite: it translates IP addresses into domain names. As a note, this is the record that's used when doing a reverse DNS on an IP, useful for enumerating domains and subdomains of an entity starting from a range of IPs.

![PTR-type DNS query performing reverse DNS on an IP address](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-15.avif)

All of these are not the only DNS records that exist, but they are the most common ones.

## Conclusion

We've seen how a domain is resolved step by step and the types of servers involved. Additionally, we've seen the types of records that exist in the DNS protocol. Knowing everything we've seen is vitally important to understand any information we can obtain related to DNS, such as the information we can obtain when enumerating the DNS of a domain controller or when we enumerate a company's assets as we mentioned.

## References

- [Twitter thread about DNS service by Francisco Torres](https://twitter.com/frantorres/status/1577944372384972800)
- [Comic about DNS server types on Wizardzines](https://wizardzines.com/comics/dns-server-types/)
- [Article about root servers on Wikipedia](https://es.wikipedia.org/wiki/Servidor_ra%C3%ADz)
- [Documentation about DNS server types on Cloudflare](https://www.cloudflare.com/en-gb/learning/dns/dns-server-types/)
- [DNS records guide on Cloudflare](https://www.cloudflare.com/es-es/learning/dns/dns-records/)
