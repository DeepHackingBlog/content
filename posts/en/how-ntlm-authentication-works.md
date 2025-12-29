---
id: "como-funciona-la-autenticacion-ntlm"
title: "How NTLM Authentication Works"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-01-10
updatedDate: 2022-01-10
image: "https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-0.webp"
description: "Detailed explanation of how NTLM authentication works in Windows, including LM and NT hashes, the Net-NTLMv2 process, and techniques like Pass The Hash."
categories:
  - "active-directory"
  - "windows"
draft: false
featured: false
lang: "en"
---

NTLM (NT Lan Manager) consists of a series of authentication protocols used in Windows environments. These protocols allow a user to prove their identity to a server. It is in this authentication where we as attackers can take advantage to, among other things, perform Pass The Hash.

Table of Contents:

- [Terminology](#terminology)
- [What is Pass The Hash?](#what-is-pass-the-hash)
- [LM Hash](#lm-hash)
- [NTLM (Aka. NT Hash)](#ntlm-aka-nt-hash)
- [Net-NTLMv2 Authentication](#net-ntlmv2-authentication)
    - [Negotiation Request/Response](#negotiation-requestresponse)
    - [Session Setup Request (Message Type 1)](#session-setup-request-message-type-1)
    - [Session Setup Response (Message Type 2)](#session-setup-response-message-type-2)
    - [Session Setup Request (Message Type 3)](#session-setup-request-message-type-3)
    - [Session Setup Response](#session-setup-response)
- [NTLM Authentication in Active Directory](#ntlm-authentication-in-active-directory)
- [Pentesting Perspective](#pentesting-perspective)
- [References](#references)

## Terminology

Before we start explaining things, let's clarify the terminology, as it can be quite confusing:

- `NTLM` = NT Hash (can also include the LM hash). It is the hash stored in the SAM (Security Account Manager) or in the NTDS file if we are on a domain controller.
- `NTLMv2` = Net-NTLMv2 Hash = Client's response to the server's challenge (Version 2 of Net-NTLM) = Challenge/response authentication = NTLM Authentication

Yes, Microsoft folks can be a bit confusing 😥😢.

## What is Pass The Hash?

One of the most unique features of Windows pentesting is Pass The Hash. For those unfamiliar with this technique, it basically consists of the fact that if you know a user's NTLM hash (Aka. NT hash), and that user has sufficient privileges on the system, you can both execute commands and obtain a shell on the Windows machine, just by knowing their hash, example:

![Pass The Hash example with psexec](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-1.avif)

> Note: the LM hash is not necessary, in fact, you can try using `psexec` only with the NT hash preceded by a colon (`:`) and you will see that it still works.
> 
> Additionally, this LM hash is actually the LM hash of a null password, this happens because this type of hashes was disabled since Windows Vista and Windows Server 2008. If you use CrackMapExec with the `--sam` parameter to dump the SAM, you will see that the LM hashes of all users will be the same.

Pass The Hash when seen for the first time can seem strange and even magical. But once you understand the NTLM authentication process, we will see the flaw in this protocol and why it allows this technique.

Before going to the authentication process, let's see how the two types of hashes used for password storage in Windows are created, the NT hash and the LM hash.

## LM Hash

The LM hash (Lan Manager) was the default way passwords were stored in Windows up to Windows XP and Windows Server 2003. And it has been disabled since Windows Vista and Windows Server 2008 (although it can still be enabled today for compatibility with legacy systems).

LM was a fairly insecure hashing algorithm, and to understand why, let's look at the hash generation process:

**Step 1**. Let's suppose my user's password is `password123`. Well, the first step of the process is to convert everything to uppercase, that is, go from `password123` to `PASSWORD123`.

- If the password is less than 14 characters, it is padded with null characters (NOTE, they are represented with zeros, but should not be confused as such, [explanation about null characters](https://stackoverflow.com/questions/1296843/what-is-the-difference-between-null-0-and-0#:~:text=Null%20Characters,case%20with%20the%20value%20zero.)) until reaching this length, that is, therefore, our password would become: `PASSWORD123000`.
    - Here you might ask, well, what happens if my password has 15 characters or more? Well, it's not a valid password, the LM algorithm limit is passwords with a length of up to 14 characters.

**Step 2**. The result from the first step is now divided into two strings of 7 bytes each:

- 1st String: `PASSWOR`
- 2nd String: `D123000`

**Step 3**. These two strings will be used to generate two DES (Data Encryption Standard) keys. A DES key is formed by 64 bits (8 bytes). However, being each string 7 bytes, each will make a total of 56 bits. So to complete the DES key and reach 64 bits, we need to add a parity bit for every 7 bits ([Parity Bit Explanation](https://www.lifeder.com/bit-de-paridad/) and [Parity Bit Explanation in DES encryption](https://stackoverflow.com/questions/965500/how-should-i-create-my-des-key-why-is-an-7-character-string-not-enough)).

Then, we convert each string to binary and add a parity bit for every 7 bits. Right now your head might have exploded, but in the following image you will see the process much clearer:

![DES key generation process with parity bits](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-2.avif)

This results in two 64-bit DES keys, one corresponding to the `PASSWOR` string and another to the `D123000` string:

![Resulting 64-bit DES keys](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-3.avif)

Here you might ask why, being a parity bit, we have only placed zeros and have not evaluated whether they would be a 1 or a 0. This is because although it is true that it is a parity bit, two things happen:

1. In the end, it will depend on whether the DES implementation will take parity into account or not.
2. The parity bit in this case will not affect the encryption process, which leads to what was mentioned in point 1, this implementation will not take it into account, so everything is set to zero. In fact, you can test it by manually calculating the LM hash, changing the parity bits in each case, setting everything to zero and then setting everything to one, you will see that there will be no difference in the final result.

**Step 4**. These two DES keys that we have generated, we will use them (each separately) to encrypt the following string in ECB mode:

- `KGS!@#$%`

For this, we can use this [DES online calculator](https://emvlab.org/descalc/?key=5121556B35BB3DA5&iv=0000000000000000&input=4B47532140232425&mode=ecb&action=Encrypt&output=E52CAC67419A9A22).

![DES online calculator](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-4.avif)

We need to fill in two fields, the "Key" field and the "Input Data". In this case, the calculator expects both data in hexadecimal, so we need to convert it to that format.

- Procedure for the `PASSWOR` string:

Of the two keys we previously calculated, we will use the key corresponding to this string. So we convert it to hexadecimal:

<figure>

![Binary to hexadecimal conversion](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-5.avif)

<figcaption>

Reference: https://www.rapidtables.com/convert/number/binary-to-hex.html

</figcaption>

</figure>

Similarly, the string to encrypt is `KGS!@#$%` so we also convert it to hexadecimal:

<figure>

![String to hexadecimal conversion](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-6.avif)

<figcaption>

Reference: https://codebeautify.org/string-hex-converter

</figcaption>

</figure>

With this done, we use the calculator:

![DES encryption result](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-7.avif)

We obtain that:

`PASSWOR` = `E52CAC67419A9A22`

Now we proceed with the second string.

- Procedure for the `D123000` string:

We convert the second key we generated earlier to hexadecimal:

<figure>

![Second key to hexadecimal conversion](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-8.avif)

<figcaption>

Reference: https://www.rapidtables.com/convert/number/binary-to-hex.html

</figcaption>

</figure>

And now we return to the calculator, since we already converted the string to encrypt to hexadecimal before, we only need to change the value of the "Key" field:

![Second hash calculation](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-9.avif)

We obtain that:

`D123000` = `664345140A852F61`

So, to obtain the LM hash, we concatenate the result of the first string with the result of the second:

`password123` = `E52CAC67419A9A22664345140A852F61`

We can verify that we did it correctly using some website that cracks the LM hash:

<figure>

![LM hash verification with rainbow tables](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-10.avif)

<figcaption>

http://rainbowtables.it64.com/

</figcaption>

</figure>

Seeing how an LM hash is created, we can see its disadvantages and why it became obsolete. For example, the same hash can belong to many passwords:

- `password123`
- `PaSSwoRD123`
- `PassworD123`
- `PASSword123`

Because in the first step, they all become `PASSWORD123`. For the same reason, in the image above where we see that it cracked the hash, we get `PASSWORD123` and not `password123`, since it's impossible to know the exact initial password.

Additionally, if someone wanted to crack it, it could be divided in two, this way you would only need to brute force a 7-character string to figure out part of the password.

## NTLM (Aka. NT Hash)

The NT hash (Aka. NTLM) is the algorithm currently used to store passwords in Windows systems, it is the way they are stored in the SAM. This hash should not be confused with the challenge/response authentication Net-NTLM hash that we will see later.

This hash is the hash we obtain when we dump with `mimikatz`, similarly, it is the hash we need to perform Pass The Hash.

Its generation is different and simpler than its predecessor:

**Step 1**. The password is converted to Unicode ([UTF-16LE](https://es.wikipedia.org/wiki/UTF-16#Esquemas_de_codificaci%C3%B3n_y_BOM)).

**Step 2**. The `MD4` algorithm is used.

The complete operation to generate an NTLM hash would be: `MD4(UTF-16LE(<password>))`

Python example:

![NTLM hash generation in Python](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-11.avif)

Verification with online NTLM hash generation service:

<figure>

![Verification with online NTLM hash generator](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-12.avif)

<figcaption>

Reference: https://codebeautify.org/ntlm-hash-generator

</figcaption>

</figure>

As we can see, the generation of this hash is much simpler than the LM hash.

## Net-NTLMv2 Authentication

The Net-NTLMv2 hash is the hash that is generated in each client/server authentication, so it is not a hash that is stored, but rather depends on each communication.

We have already seen how LM and NT hashes are formed, so now let's see how authentication works over the network, and how it is through this process that we take advantage to perform Pass The Hash.

When authentication to Windows is performed over the network, the process that is followed is as follows:

<figure>

![NTLM authentication diagram](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-13.avif)

<figcaption>

Diagram

</figcaption>

</figure>

At the packet level, it looks like this:

![NTLM authentication packet analysis](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-14.avif)

Let's go step by step, explaining each step to understand the complete process.

To have control of the authentication and not generate unnecessary noise on the network, we will use a Python script.

Finally, to be clear:

- Client: `192.168.118.10`
- Server: `192.168.118.128`

### Negotiation Request/Response

First of all, we initiate negotiation with the SMB server through the following lines of code:

```python
#!/usr/bin/python3

from impacket.smbconnection import SMBConnection

myconnection = SMBConnection("sikumy","192.168.118.128")
```

This corresponds to:

![Negotiation Request/Response in the diagram](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-15.avif)

And generates the packets:

![SMB negotiation packets](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-16.avif)

If we look closely, the client tries to initiate a negotiation using the SMB protocol, however, the server responds with SMB2, so that it negotiates again using this protocol, that's why we find 4 Negotiation packets when there should only be two:

- 1st Pair of packets: Negotiation attempt with SMB
- 2nd Pair of packets: Negotiation with SMB2

This re-negotiation occurs because by default, the system will always try to use the highest SMB version that both the client and server support.

### Session Setup Request (Message Type 1)

Once the authentication details have been negotiated, the client proceeds to authenticate. To initiate the process, we will do so by adding a new line of code:

```python
#!/usr/bin/python3

from impacket.smbconnection import SMBConnection

myconnection = SMBConnection("sikumy","192.168.118.128")

myconnection.login("sikumy", "sikumy123$!")
```

This new line will initiate all the remaining steps, going back to the diagram, it will initiate steps 3, 4, 5, 6 in their respective order:

![Session Setup process in the diagram](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-17.avif)

Starting with the first "Session Setup Andx Request", this packet contains:

- The `NTLMSSP` signature (NTLMSSP identifier).
- Negotiation flags (indicates options supported by the client, requires acceptance by the server).
- NTLM Message Type, which in this packet is 1.
    - The Message Type is basically a way to identify the packet, it can be 1, 2 or 3:
        - Message Type 1: Packet containing the list of options supported by the client.
        - Message Type 2: In addition to containing the list of options accepted by the server, it contains the "challenge", also known as "nonce".
        - Message Type 3: Packet containing client information (including domain and user). It also contains the response to the "challenge".

![Session Setup Request Message Type 1 content](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-18.avif)

In the image we can observe the content mentioned above.

### Session Setup Response (Message Type 2)

Following the request sent above, the server's response follows:

![Session Setup Response Message Type 2 content](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-19.avif)

The server responds with:

- The `NTLMSSP` signature (NTLMSSP identifier) again.
- NTLM Message Type, in this case, we can see it is 2.
- Server name and information about it, thanks to the `NTLMSSP_NEGOTIATE_TARGET_INFO` flag that we sent in the request.
- The challenge (16 bytes) (it is a random string).

### Session Setup Request (Message Type 3)

Now that we have the challenge, we must prove that we have the user's password, that is, we have to prove that our credentials are valid. However, we do not have to send either the password or its hash over the network.

How do we prove it then?

Basically, the idea now is to generate the NT hash of the password we entered (whether it is correct or not, since they have not yet been validated by the server). This generated NT hash is used to encrypt the "challenge" we received in the last response.

The challenge encryption method varies depending on the NTLM version (Aka. Net-NTLM) being used and the server's own settings. In the case of NTLMv2, the response would have the following form:

`<user>::<domain>:<challenge>:<encrypted challenge>:BLOB`

Example of NTLMv2 hash (Aka. Net-NTLMv2):

![Net-NTLMv2 hash example](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-20.avif)

Here we need to explain what we mean by "BLOB" and how we generate the "encrypted challenge". To do this, let's look at the NTLMv2 algorithm:

1. The client calculates the NT hash of the password entered by the user. This results in a 16-byte string.
2. Now, the unicode version of the username in uppercase and the unicode version of the domain name (can also be the server name) in uppercase are concatenated to form the "target string" (TS).
3. With this done, the "target string" and the NT hash will be used in the `HMAC-MD5` algorithm, using the NT hash as the "Key" to obtain a 16-byte NTLMv2 hash.
4. Now, what is known as "BLOB" is created, it is basically a block composed of:
    - 4 bytes --> BLOB signature (`0x01010000`)
    - 4 bytes --> reserved (`0x00000000`)
    - 8 bytes --> timestamp (64 bits representing the number of tenths of microseconds from January 1, 1601 to the current date)
    - 8 bytes --> random
    - 4 bytes --> Must be `0x00000000`.
    - Variable, formed by 2 bytes:
        - NetBIOS Domain Name (4 bits) --> `0x0002`
        - NetBIOS Server Name (4 bits) --> `0x0001`
        - DNS Domain Name (4 bits) --> `0x0004`
        - DNS Server Name (4 bits) --> `0x0003`
        - [See official variable documentation.](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-nlmp/83f5e789-660d-4781-8491-5f8c6641f75e)
    - 4 bytes --> padding (random bytes)
5. Now, the "challenge" and the "BLOB" block are concatenated, this is passed to the `HMAC-MD5` algorithm. The NTLMv2 hash we generated in step 3 will be used as the "Key". This will generate an NTLMv2 hash that will be the first part of the response, that is, the following:

![First part of the NTLMv2 response](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-21.avif)

The rest of the Net-NTLMv2 hash corresponds to the BLOB itself:

![BLOB in the Net-NTLMv2 hash](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-22.avif)

[Official NTLMv2 Documentation.](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-nlmp/aee311d6-21a7-4470-92a5-c4ecb022a87b)

So in conclusion, the client's response to the request where the server sends us the challenge is:

```
NTLMv2 = HMAC-MD5((challenge + blob), NTLMv2 as Key)

Response = NTLMv2 + BLOB
```

<figure>

![Complete NTLMv2 response in Wireshark](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-23.avif)

<figcaption>

Challenge response, NTLMv2 Response

</figcaption>

</figure>

Which corresponds to:

![Session Setup packet with NTLMv2 response](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-24.avif)

We can see that it is the same value, only the NTLMv2 response does not have the colons that separate the NTLMv2 and the BLOB in the second image.

### Session Setup Response

Once the server receives the previous response, it does the same process, but with the hash it already has stored for that user. When it calculates it, it compares the output it generated with the output that we (the client) sent it. If the NT hashes with which the entire process was done are different, they will give a totally different output, which will mean that the user entered an incorrect password, otherwise, they will be equal and the authentication will be valid.

In the response, we can check if the authentication was successful or not:

![Successful authentication in Session Setup Response](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-25.avif)

If the credentials were invalid we would get this response:

![Failed authentication in Session Setup Response](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-26.avif)

You might ask, how does the server calculate its own NTLMv2 response. Since, some parameters used to generate this response are always dynamic, such as the timestamp (`timestamp`).

So if I generate an NTLMv2 response and then the server generates another to verify if they are equal, it is impossible for them to be.

What happens then?

The solution is simple, the NTLMv2 response that we as a client send contains the BLOB in plain text, so the server takes the parameters from this BLOB and uses them to generate its own response. This way, the only possible variable and what everything will depend on will be the NT hash.

- Equal NT hashes are used = Valid authentication
- Different ones are used = Invalid authentication

In conclusion, as we can see, the plaintext password has not been used at any time during authentication except to generate its NT hash. So having the NT hash is exactly the same as if we had the plaintext password (at a practical level), that's why Pass The Hash exists and works.

## NTLM Authentication in Active Directory

If we are in an Active Directory, the authentication changes a bit, since if we are trying to authenticate on a computer, it corresponds to the Domain Controller (DC) to validate the credentials.

So the authentication process would be as follows:

![NTLM authentication diagram in Active Directory](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-27.avif)

In the RPC NetLogon request, the server will send to the Domain Controller the:

- User
- Challenge
- Challenge Response (Encrypted Challenge)

The domain controller will verify if the authentication is valid using the NT hash stored in the NTDS file.

What the domain controller determines will be sent in the RPC NetLogon response to the server, and subsequently to us.

## Pentesting Perspective

We have seen a lot of theory in this post. Theory that is interesting to know to really understand what happens behind the techniques we employ. To finish, a mini reminder about what each hash can be useful for from a pentesting perspective:

- NT Hash --> We can use it both to perform Pass The Hash and to try to crack it.
- Net-NTLM Hash --> We can try to crack it, but we cannot use it for Pass The Hash.
    - This type of authentication can be used to perform attacks such as SMB Relay.

## References

- [Windows authentication attacks – part 1](https://blog.redforce.io/windows-authentication-and-attacks-part-1-ntlm/)
- [Understanding NTLM Authentication Step by Step](https://security.stackexchange.com/questions/129832/understanding-ntlm-authentication-step-by-step)
- [The NTLM Authentication Protocol and Security Support Provider](http://davenport.sourceforge.net/ntlm.html#theLmResponse)
- [What is the difference between NULL, '\\0' and 0?](https://stackoverflow.com/questions/1296843/what-is-the-difference-between-null-0-and-0#:~:text=Null%20Characters,case%20with%20the%20value%20zero.)
- [Bit de paridad: para qué sirve, cómo funciona](https://www.lifeder.com/bit-de-paridad/)
- [How should I create my DES key? Why is an 7-character string not enough?](https://stackoverflow.com/questions/965500/how-should-i-create-my-des-key-why-is-an-7-character-string-not-enough)
- [NTLM Terminology](http://davenport.sourceforge.net/ntlm.html#ntlmTerminology)
- [Mechanics of User Identification and Authentication - Fundamentals of Identity Management](https://books.google.es/books?id=eIPA4v0u05EC&pg=PA359&lpg=PA359&dq=ntlm+version+2+response&source=bl&ots=gyRUzlWNhh&sig=ACfU3U1rgHJ17MUlc43qPWbN4qI0j14M4w&hl=es&sa=X&ved=2ahUKEwi3sNCzzKD1AhXsyYUKHQA4CM8Q6AF6BAgYEAM#v=onepage&q=ntlm%20version%202%20response&f=false)
- [NTLM v2: NTLMv2\_CLIENT\_CHALLENGE](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-nlmp/aee311d6-21a7-4470-92a5-c4ecb022a87b)
- [AV\_PAIR](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-nlmp/83f5e789-660d-4781-8491-5f8c6641f75e)
- [NTLM/LM Hashes on Domain Controller](https://security.stackexchange.com/questions/56227/ntlm-lm-hashes-on-domain-controller)
- [Disabling NTLM v1 On Windows Computer](https://services.dartmouth.edu/TDClient/1806/Portal/KB/ArticleDet?ID=136495)
- [Practical guide to NTLM Relaying in 2017](https://byt3bl33d3r.github.io/practical-guide-to-ntlm-relaying-in-2017-aka-getting-a-foothold-in-under-5-minutes.html)
- [Microsoft NTLM](https://docs.microsoft.com/en-us/windows/win32/secauthn/microsoft-ntlm)
