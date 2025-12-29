---
id: "xss-a-traves-de-registros-dns"
title: "XSS Through DNS Records"
author: "eric-labrador"
publishedDate: 2022-07-21
updatedDate: 2022-07-21
image: "https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-0.webp"
description: "Learn how to execute XSS by hosting malicious payloads in different types of DNS records such as MX, NS, CNAME, and TXT."
categories:
  - "web"
draft: false
featured: false
lang: "en"
---

In this post we will be explaining how to execute XSS by hosting the payload in different DNS records.

- [Initial Setup](#initial-setup)
- [MX Record](#mx-record)
- [NS Record](#ns-record)
- [CNAME Record](#cname-record)
- [TXT Record](#txt-record)
- [References](#references)
- [Researchers](#researchers)

## Initial Setup

First of all, you need to get a domain. In this case, we will use [GoDaddy](https://www.godaddy.com/es-es) as the provider. The next step is to get a VPS. In this VPS is where you will be able to "link" (connect) the domain with the VPS IP. This way, everything configured on the VPS will be accessible from the domain:

<figure>

![Domain km2.uk pointing to the VPS IP](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-1.avif)

<figcaption>

Domain km2.uk pointing to the VPS IP

</figcaption>

</figure>

Now you need to specify the following configuration in the nameservers.

<figure>

![DNS server configuration](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-2.avif)

<figcaption>

The one.one.one.one is ignored, as it belongs to Cloudflare

</figcaption>

</figure>

Now, on the VPS, you need to execute the following commands:

- `cd /opt && git clone https://github.com/iphelix/dnschef`

With the dnschef tool, among other things, you can configure a record using special characters.

## MX Record

The MX record indicates how email messages should be routed according to the Simple Mail Transfer Protocol (SMTP). In this case, we are not going to configure any server, we are only going to add the record so that it is visible when interacting with the domain.

An MX record must point to a domain name, and if we look for what characters are allowed for a domain name, we find the following information from RFC 952:

> A domain name is a text string of up to 24 characters drawn from the alphabet (A-Z), digits (0-9), the minus sign (-), and the period (.).

As we can see, there are certain limitations and many software, such as BIND, follow the guidelines established in the RFCs, but this does not mean that we cannot bypass these guidelines. In this case, using dnschef, which does not adhere to the RFCs, we can use an XSS payload instead of a domain. This way, we would be bypassing the naming conventions.

With the following command, the XSS payload will be configured in the MX record of our DNS:

- `python3 dnschef.py -i 0.0.0.0 --fakemail <payload here>`

![XSS payload configuration in MX record](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-3.avif)

Now, through the `dig` command you can see if our payload is configured correctly:

- `dig <domain> MX`

![MX record verification with dig](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-4.avif)

If you need to test whether the payload works, you can use the following PHP code:

> NOTE: The following code is PHP code that in this case is vulnerable to XSS. Do not use in production environments.

```php
<?php
print_r( dns_get_record("km2.uk", DNS_MX) );
?>
```

For it to work, you need to execute the following command, which starts an HTTP service (it is important to do it in the same directory where the file is located, it is recommended to call it `index.php`, so that when accessing `http://localhost:8000` the file will open automatically):

- `php -S 0.0.0.0:8000 -t .`

Now, in case a website is reflecting the MX record of a domain and is not sanitizing that field, our XSS payload will be executed.

![XSS payload execution in the browser](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-5.avif)

## NS Record

NS (Name Server) records are used to determine the servers that will communicate the DNS information of a specific domain.

Again, through the dnschef utility you can configure the field with a malicious payload:

- `python3 dnschef.py -i 0.0.0.0 --fakens <payload here>`

![XSS payload configuration in NS record](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-6.avif)

Now, through the `dig` command you can see if our payload is configured correctly:

![NS record verification with dig](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-7.avif)

If you need to test the payload on a local server, you can use the following PHP code (again, it is vulnerable to XSS):

```php
<?php
print_r( dns_get_record("ns1.km2.uk", DNS_NS) );
?>
```

At this point, if the website has not sanitized the field where the domain information is displayed, the XSS alert will be triggered.

![XSS payload execution from NS record](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-8.avif)

## CNAME Record

The CNAME (Canonical Name) is used to determine the domain/subdomain name instead of the A record. The A record indicates the IP of the domain.

Again, we will use the dnschef tool to configure our payload:

- `python3 dnschef.py -i 0.0.0.0 --fakealias <payload here>`

![XSS payload configuration in CNAME record](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-9.avif)

At this point, we must check if dnschef has worked correctly, we will use `dig` again:

![CNAME record verification with dig](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-10.avif)

If you need to test the payload locally, you can use the following code:

```php
<?php
print_r( dns_get_record("km2.uk", DNS_CNAME) );
?>
```

Finally, if the website developer has not properly sanitized that field, the payload will be injected and the XSS alert will be triggered:

![XSS payload execution from CNAME record](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-11.avif)

## TXT Record

Through TXT records, administrators insert informational text. In this case, we will need to edit a configuration file that comes by default in the tool installation. You must execute the following commands:

- `cd /opt/dnschef`
- `nano dnschef.ini`

At this point, in the `dnschef.ini` file you need to add the following information:

![dnschef.ini file configuration](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-12.avif)

Now, with the following command we will be configuring the payload in the TXT record of our DNS:

- `python3 dnschef.py --file dnschef.ini -q -i 0.0.0.0`

To verify that our payload is correctly configured in the record, we will simply need to use the `dig` tool again.

![TXT record verification with dig](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-13.avif)

If you need to test the payload locally, you can use the following PHP code (again vulnerable to XSS):

```php
<?php
print_r( dns_get_record("km2.uk", DNS_CNAME) );
?>
```

Finally, if the user input is not being sanitized in the vulnerable field, the XSS alert will be executed on the website.

![XSS payload execution from TXT record](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-14.avif)

## References

This PoC was inspired by [this Tweet from HackingTheory](https://twitter.com/HackingTheory/status/1426957662567247874).

## Researchers

- Víctor García (takito)
  - [Twitter](https://twitter.com/takito1812)
  - [LinkedIn](https://www.linkedin.com/in/takito1812/)
- Eric Labrador (e1abrador)
  - [LinkedIn](https://www.linkedin.com/in/ericlabrador/)
