---
id: "como-funciona-el-protocolo-kerberos"
title: "How the Kerberos Protocol Works"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-09-26
updatedDate: 2022-09-26
image: "https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-kerberos/como-funciona-el-protocolo-kerberos-0.webp"
description: "Complete guide on how the Kerberos protocol works in Active Directory, explaining each step of the authentication process from KRB_AS_REQ to KRB_AP_REQ."
categories:
  - "active-directory"
draft: false
featured: false
lang: "en"
---

Kerberos is the main authentication protocol used in Active Directory environments. Therefore, understanding it is vital to understand how an Active Directory works, and consequently, how to attack it.

## Introduction

First of all, Kerberos is an authentication protocol, but not an authorization protocol, meaning Kerberos is responsible for verifying that we are who we say we are, but it's not responsible for controlling where we can access or not. This task is left to the services themselves that we want to access.

That said, some characteristics of this protocol are:

- It uses port 88 for both TCP and UDP.
- All "principals" participating in a Kerberos communication must have the same timestamp (time) as the server where Kerberos runs (we'll give this server a name later).
    - A ["principal"](https://web.mit.edu/kerberos/krb5-1.5/krb5-1.5.4/doc/krb5-user/What-is-a-Kerberos-Principal_003f.html) in summary is an entity to which Kerberos can assign tickets.
- Kerberos doesn't usually work with IPs, it's based on DNS.

Now, knowing some characteristics of this protocol, it's interesting to also know some entities that appear in an authentication process:

- Client: it's who starts the authentication process in Kerberos, we could say that would be us.
- Domain Controller: the famous DC of Active Directories is responsible for managing everything related to Kerberos. However, within the scope of Kerberos, it can receive different names such as:
    - KDC (Key Distribution Center)
    - AS (Authentication Service)
    - In any case where you see KDC or AS being discussed, it will be referring to the same thing, which, normally, and in most cases, is the Domain Controller.
- AP (Application Server): it's the server that offers the service which the client wants to access.

That said, it should be mentioned that throughout the article "the hash of user X" will be mentioned several times. When you see these references, I specifically mean the NTLM hash, also known as NT hash and also known as RC4 hash.

Finally, Kerberos is mainly divided into 5 steps:

1. [KRB_AS_REQ](#krb_as_req)
2. [KRB_AS_REP](#krb_as_rep)
3. [KRB_TGS_REQ](#krb_tgs_req)
4. [KRB_TGS_REP](#krb_tgs_rep)
5. [KRB_AP_REQ](#krb_ap_req)

Let's go through each one step by step :)

## KRB_AS_REQ

This is the first step of any Kerberos communication, the idea is that the client wants the KDC to provide them with a TGT (Ticket Granting Ticket). To do this, the client generates a timestamp (time mark indicating the exact time of the request) and encrypts it with their secret key, which is basically the hash of their password. This encrypted timestamp is sent to the KDC along with their username:

![Diagram of the KRB_AS_REQ process showing client sending encrypted timestamp and username to the KDC](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-kerberos/como-funciona-el-protocolo-kerberos-1.avif)

When the KDC receives this information, the first thing it does is take the user and look for them in its database:

![Representation of KDC database with users and their hashes](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-kerberos/como-funciona-el-protocolo-kerberos-2.avif)

If it finds them, it will use the password hash to try to decrypt the timestamp.

- If it can't, it will mean that the client hasn't provided the correct password.
- If it manages to decrypt it, it will validate the credentials provided by the client.

If the KDC validates the credentials, it will respond to the request and continue with the process.

## KRB_AS_REP

The KDC responds as follows:

![Diagram of the KRB_AS_REP process showing KDC response with TGT and session key](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-kerberos/como-funciona-el-protocolo-kerberos-3.avif)

From this response, several concepts need to be explained:

### TGT Ticket

A TGT (Ticket Granting Ticket) is a file that contains the necessary information to identify a user. This TGT is encrypted with the KDC's key (the hash of the krbtgt user's password).

The krbtgt user is a special user that exists in Kerberos which is used to encrypt the TGTs that the KDC provides.

Now, the password (actually the hash) of this krbtgt is only known by the KDC, so the client will receive the TGT, but will simply be able to possess it, at no time will they be able to decrypt it and read what's inside, likewise, they won't be able to manipulate it either. This way, it's ensured that only the KDC itself can read and manipulate the TGT.

### Session Key

In the response given by the KDC, we can observe how the phrase "session key" is repeated twice. A session key is basically a random key that has a limited time of use and is also associated with the user.

As can be seen in the response, this session key is included inside the TGT, which remember, the user can't read because they can't see its contents. And it's also included outside of it, encrypted with the user's password hash. This is done so that both the client and the KDC are able to have the session key, additionally, this way the KDC ensures that at least one of the session keys, specifically the one contained in the TGT, hasn't been manipulated.

### PAC (Privilege Attribute Certificate)

The PAC (Privilege Attribute Certificate) is an information structure related to the client, in short, the user's privileges:

- Client's domain and the domain's SID
- User and their RID
- User's groups and their RIDs
- Other SIDs:
    - SIDs that refer to generic users and groups ([Well-Known SID](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-dtyp/81d92bba-d22b-4a8c-908a-554ab29148ab))
    - SIDs that reference groups that are not from the current domain, meaning inter-domain groups (this refers to when there's more than one domain in Active Directory and there are authentications between them).

In addition to user information, the PAC includes [various signatures](https://zer1t0.gitlab.io/posts/attacking_ad/#pac) that serve to validate its integrity and that of the TGT itself.

In any case, since the PAC is located inside the TGT, in principle it's only accessible to the KDC. However, services can verify the PAC by communicating with the KDC (although it's not the most common). Whatever the case, when a service verifies the PAC, it only checks the signature, it doesn't check whether the privileges it contains are correct or not.

Another detail aside is that a client can prevent the PAC from being included by specifying it in the KERB-PA-PAC-REQUEST field in the AS-REQ.

So, in conclusion, what really matters from this step is that the KDC has given us a TGT. This TGT is what allows us, from now on, to request access to different services without needing to constantly enter our password, since the TGT verifies who we are.

## KRB_TGS_REQ

Well, once we reach this point, we could say we're authenticated, because we have a TGT that verifies who we are. And in addition to this, we have a session key, which remember is associated with our user and has a limited time.

Now, let's imagine that the client wants to use a service, for example, the CIFS service located on server 1 (FILESERVER). What the client will do is send a request with the following information:

![Diagram of the KRB_TGS_REQ process showing client sending TGT and authenticator to the KDC](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-kerberos/como-funciona-el-protocolo-kerberos-4.avif)

In this message, as we see, one of the things we send is the TGT, here there's not much doubt, since we know what information it contains and that it's encrypted with the krbtgt user's password hash. Now, what interests us is the following:

### SPN

The SPN (Service Principal Name) in summary is the structure of `<Service>/<Host>` that helps specify in an Active Directory where we want to authenticate. Because a machine can run multiple services, likewise, the same service can be run on multiple machines. For this reason, the importance of the SPN and having the structure it has.

### Authenticator

On the other hand, here a new concept comes in, the authenticator.

The authenticator serves for the KDC to ensure that whoever is making the request is the legitimate client, for example, the user sikumy, the KDC wants to ensure this. To do this, the KDC will compare the contents of the TGT (which, as we know, is the only one with access to the content, so this way it ensures that at least the TGT hasn't been manipulated) with the contents of the authenticator.

So, when the KDC receives this request, it will decrypt the authenticator using the session key that it already knows previously because it was the one who generated it before, if it manages to decrypt it great, what it will do then is compare the authenticator data with the TGT data to see if they're equal. In conclusion, with this the KDC is ensuring that whoever made the request has the TGT and knows the session key. Finally, if the data when compared are equal, then authentication is successful.

## KRB_TGS_REP

Now, the KDC has been able to validate the authentication, and that it was performed by user sikumy. At this point, it will return to the client the necessary information so they can deal with the service. This response message is known as TGS_REP and contains the following information:

![Diagram of the KRB_TGS_REP process showing KDC response with TGS and new session key](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-kerberos/como-funciona-el-protocolo-kerberos-5.avif)

- A TGS ticket that contains the SPN, username, PAC, and the new session key (only valid for communications between sikumy and the server where the service is located and for a limited time). This ticket is encrypted with the password hash of the user running the service.
- The new session key.

These two pieces of information are encrypted with the first session key, the one that was originally exchanged between the KDC and the client in the KRB_AS_REP request. This way, when the client receives the response, they'll be able to decrypt the message to obtain:

- TGS Ticket
- The new session key

The ticket that the client obtains is known as TGS (Ticket Granting Service). And with this, the KRB_TGS_REP phase ends. As a note about TGS, it would actually be called ST (Service Ticket), I recommend reading the following link:

- [Service Ticket](https://zer1t0.gitlab.io/posts/attacking_ad/#st)

## KRB_AP_REQ

Now, the client (sikumy) will generate another authenticator that they'll encrypt with the new session key obtained in the previous step. Remember that the authenticator is nothing more than the user and the current timestamp.

Then, the client will send to the service where they want to authenticate (no longer sending it to the KDC) the TGS and the authenticator:

![Diagram of the KRB_AP_REQ process showing client sending TGS and authenticator to the service](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-kerberos/como-funciona-el-protocolo-kerberos-6.avif)

The service, when it receives the TGS, will be able to decrypt it because it was encrypted with the password hash of the user running the service.

When it decrypts the TGS, it will be able to see the session key, which will help it decrypt the authenticator.

With this, the service will compare the contents of the TGS with that of the authenticator, this way the service will be able to validate the user's authenticity, and thanks to the PAC content, it will check if the user has access to its resources.

* * *

Up to here are the minimum steps of the Kerberos protocol. Optionally, the following steps can follow:

6. In case the service wants to validate the PAC, it can ask the DC to check the PAC signature using a [KERB_VERIFY_PAC_REQUEST](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-apds/b27be921-39b3-4dff-af4a-b7b74deb33b5) request.
7. The KDC will check the PAC and respond with a code saying whether the PAC is correct or not.
8. Finally, in case the client requires it, the server must authenticate itself by responding to the AP-REQ with an [AP-REP](https://tools.ietf.org/html/rfc4120#section-5.5.2) message and using the session key as proof that the service can decrypt the TGS, and therefore prove it's the real service because it was able to decrypt the TGS.

## Conclusion

Kerberos is a complex protocol that isn't easy to understand. But it's vitally important to know it to understand how to attack or defend an Active Directory.

## References

- [Kerberos in Active Directory - Pixis](https://en.hackndo.com/kerberos/)
- [Attacking Active Directory: 0 to 0.9 - Zer1t0](https://zer1t0.gitlab.io/posts/attacking_ad/#kerberos)
- [You Do (Not) Understand Kerberos - Spanish Talk](https://www.youtube.com/watch?v=5uhk2PKkDdw)
- [Kerberos (I): ¿Cómo funciona Kerberos? - Tarlogic](https://www.tarlogic.com/es/blog/como-funciona-kerberos/)
- [Kerberos Explained in a Little Too Much Detail - Steve Syfuhs](https://syfuhs.net/a-bit-about-kerberos)
