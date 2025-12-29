---
id: "ssh-agent-hijacking"
title: "SSH Agent Hijacking"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-12-03
image: "https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-0.webp"
description: "Learn how SSH Agent Hijacking works, techniques to abuse active SSH sessions, privilege escalation, and how to compromise remote servers through SSH sockets."
categories: 
  - "linux"
draft: false
featured: false
lang: "en"
---

If you are here, I probably do not need to explain what SSH is. Even so, I will, because it is nice to start with a general introduction.

Secure Shell, SSH, is a network protocol that enables secure communication between two systems. SSH uses encryption to ensure the confidentiality and integrity of data, providing strong authentication and protection against attacks. It is widely used for remote server administration and secure file transfer. Unlike other methods such as Telnet, SSH encrypts all communications, which makes it a safe choice for accessing Linux systems remotely or running commands over an untrusted connection.

After that definition, which is taken from Wikipedia, aka ChatGPT in 2024, let’s get started with today’s article. We will look at a built-in SSH feature called SSH Agent, and how an attacker can take advantage of it to perform lateral movement within a network.

- [What is ssh-agent?](#what-is-ssh-agent)
- [ssh-agent configuration](#ssh-agent-configuration)
  - [Verifying keys loaded in ssh-agent](#verifying-keys-loaded-in-ssh-agent)
- [SSH Agent Hijacking](#ssh-agent-hijacking)
- [Conclusion](#conclusion)
- [References](#references)

## What is ssh-agent?

ssh-agent is a program included with OpenSSH that lets you manage private keys securely, keeping a decrypted copy of them in memory. It runs as a background process, a daemon, on your local machine, where it loads the decrypted private key after you enter the passphrase, if it has one. This allows SSH clients to avoid re-entering the private key passphrase every time they authenticate.

To make it clearer, a practical example: we are on our local machine, computer 1, and we run ssh-agent. Now we load our private key into the ssh-agent process, so our private key is in memory. Thanks to this, we can connect to a remote machine, computer 2, without having to enter the passphrase again if there is one. Moreover, if SSH’s Agent Forwarding feature is enabled, from computer 2 we could connect to a computer 3 using the private key that is loaded in the ssh-agent process on computer 1, of course only if our public key is present on computer 3. This helps us avoid storing or exposing our private key outside our own machine. Later on we will do a hands-on example simulating a potential real situation.

This is possible because ssh-agent creates on our machine what is known as a [Unix Domain Socket](https://medium.com/swlh/getting-started-with-unix-domain-sockets-4472c0db4eb1). This socket provides a way for interprocess communication in Linux. It allows a process A to write data to socket X so that process B can read it, and vice versa, process A can read data that process B has written to a socket Y.

This is the idea behind how ssh-agent works. It basically loads our private key into the memory of its process and establishes a socket with the SSH process. That way, the SSH process can access the decrypted private key stored in ssh-agent’s memory. SSH uses the protocol also called [SSH Agent](https://datatracker.ietf.org/doc/html/draft-miller-ssh-agent-04) to communicate with the agent. Explaining the protocol itself is not the purpose of this article, but you can find more information in the following two resources:

- [The agent protocol, summarized and easier to understand](https://smallstep.com/blog/ssh-agent-explained/#the-agent-protocol)
- [SSH Agent Protocol, more technical](https://www.ietf.org/archive/id/draft-miller-ssh-agent-13.html)

In any case, everything we just explained can be visualized in the following diagram:

![Diagram of ssh-agent and agent forwarding](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-1.avif)

In the image you can see the following:

1. Running ssh-agent on the local machine, Computer 1:
   - On our local machine we start the ssh-agent process and load our private key, which remains decrypted in memory for use. This agent lets us authenticate without re-entering the passphrase every time.

2. Creating the Unix Domain Socket, UDS:
   - ssh-agent creates a Unix Domain Socket, UDS, on the local system, which serves as the communication point between the SSH process and the agent. This socket is represented by a special file in the Linux file system, and its path is stored in the SSH_AUTH_SOCK environment variable of the ssh-agent process.

3. Connecting to the remote machine, Computer 2:
   - When establishing an SSH connection to a remote machine, an SSH tunnel is created. This tunnel is secure and allows data to be transmitted between the SSH client on Computer 1 and the SSH server on Computer 2.

4. Enabling Agent Forwarding:
   - If we enable agent forwarding, the SSH client on Computer 2 creates a new Unix Domain Socket, a UDS proxy. This socket acts as an intermediary that redirects all authentication requests from Computer 2 to the ssh-agent on Computer 1 through the SSH tunnel.

5. Connecting to a third server, Computer 3:
   - Thanks to the socket created on Computer 2, we can connect to other servers, such as Computer 3, using the private key stored in the ssh-agent on Computer 1. It is important to note that the private key never leaves Computer 1, the proxy only allows operations such as cryptographic signing and the authentications required.

Now, this all has a problem that, if you know enough about Linux, you have probably already noticed. Although SSH Agent improves security by not exposing our private key, it also places all the security in the hands of the intermediate server. In other words, if in a setup like the one we have been discussing, computer 1, computer 2, and computer 3, someone compromises computer 2, they will be able to access the socket on that machine and therefore use it to authenticate to other machines, such as computer 3.

Next we will see how to configure ssh-agent so we can discuss the concepts involved, and later we will test it with a practical example from an offensive perspective to make everything much clearer.

## ssh-agent configuration

The scenario we are going to set up for configuring ssh-agent is as follows:

- Alice is working from her personal PC and needs to connect first to a server in the DMZ, the Demilitarized Zone. From there, her goal is to access a more secure internal server that is not directly accessible from the outside. ssh-agent will allow her to connect securely without exposing her private key in the DMZ or having to enter her password multiple times.

To begin, the first thing Alice should do on her personal PC is create her key pair, public and private, then start ssh-agent. Once ssh-agent is running, Alice will add her private key so the agent can manage it:

```bash
ssh-keygen

eval "$(ssh-agent)"

ssh-add ~/.ssh/id_rsa
```

![Key generation and loading into ssh-agent](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-2.avif)

Once Alice has loaded her private key into ssh-agent, the next step is to copy her public key to the servers where she wants to authenticate, in this case the server in the DMZ and the Internal Server.

To do this, Alice will use the `ssh-copy-id` command to transfer her public key to the DMZ and the Internal Server.

```bash
ssh-copy-id alice@dmz

ssh-copy-id alice@internalserver
```

![Copying the public key to DMZ and InternalServer with ssh-copy-id](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-3.avif)

> To simplify things, we assume there is direct connectivity to the Internal Server. Otherwise, we would transfer our public key manually.

Once Alice has transferred her public key to the corresponding servers, the next step is to enable SSH agent forwarding. This will allow authentication requests from other servers, such as the DMZ, to be redirected to the ssh-agent running on her local machine, without exposing her private key.

To enable agent forwarding, Alice can modify the global SSH configuration file, but the most recommended approach is to create a personal configuration file at ~/.ssh/config. The ~/.ssh/config file is a very useful tool that lets you customize your SSH connections and create easy-to-remember aliases for frequently used servers. Instead of typing long commands with multiple options every time you connect, you can configure it to simplify your work. For example, instead of using:

```bash
ssh -i ~/.ssh/id_rsa -A alice@dmz
```

We simplify it by creating this configuration in ~/.ssh/config:

```bash
nano ~/.ssh/config

Host dmz
    HostName dmz
    User alice
    ForwardAgent yes
```

![ForwardAgent configuration in ~/.ssh/config](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-4.avif)

This lets you connect by simply typing:

```bash
ssh dmz
```

In any case, thanks to this configuration, agent forwarding will only be enabled, ForwardAgent yes, for connections to the DMZ.

With all this in place, the configuration is complete. Alice will be able to connect to the intermediate server and use the agent to move to the internal server without exposing her private key or having to enter her password:

![Connection from DMZ to internal server with forwarded agent](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-5.avif)

If, for example, ForwardAgent were disabled, Alice would not be able to make the second hop to the Internal Server:

![Error on second hop without ForwardAgent enabled](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-6.avif)

This process of first connecting to the DMZ and then to the internalserver can also be automated by creating the ~/.ssh/config file and using ProxyJump:

```bash
Host internalserver
    HostName 192.168.10.30
    User alice
    ProxyJump dmz
    ForwardAgent yes
```

With this configuration, you can connect automatically to the internal server through the DMZ by simply typing:

```bash
ssh internalserver
```

### Verifying keys loaded in ssh-agent

You can check which private keys you have loaded in ssh-agent by using the command:

```bash
ssh-add -l
```

![Output of ssh-add -l on local, keys in agent](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-7.avif)

![Output of ssh-add -l on DMZ, keys available via agent forwarding](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-8.avif)

![Output of ssh-add -l on internal server](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-9.avif)

As we can see on the different machines, this command will show a list of keys available in the agent.

## SSH Agent Hijacking

Once we have this scenario set up, let us look at the possible compromise path. Imagine we compromise the DMZ.

![SSH Agent Hijacking scenario, DMZ compromised](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-10.avif)

Since the intermediate server is compromised, we will be able to interact with any available agents. To enumerate this information, the first thing we would do is identify possible users present on the DMZ:

![User enumeration on DMZ](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-11.avif)

In this case, we see there is a user named Alice. At this point, I will enumerate whether Alice has any SSH process running:

```bash
pstree -p alice | grep ssh
```

![Alice’s SSH processes on the DMZ](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-12.avif)

We can see that she does. Since we are root on the DMZ, we are able to observe the environment variables of running processes. In Linux, these variables are available at:

```bash
/proc/<pid>/environ
```

We are interested in reading the environment variables of the shell process, because there we can find the environment variable related to the SSH agent, if it is configured and active, as in a black-box approach. To do this, we will read the environment variables of the bash process using its PID:

```bash
cat /proc/46201/environ | tr '\0' '\n' | grep SSH_AUTH_SOCK
```

![SSH_AUTH_SOCK variable in /proc/<pid>/environ](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-13.avif)

From the command output we can see the path of the SSH agent being used by the user Alice. Now it is time to identify which user the agent belongs to, which we can do using the following command and specifying the agent path:

```bash
SSH_AUTH_SOCK=/tmp/ssh-XXXX41DN9o/agent.46200 ssh-add -l
```

![Checking agent with ssh-add -l using SSH_AUTH_SOCK](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-14.avif)

This shows that the agent belongs to the user Alice, with the key loaded from her personal PC.

> Even if the current user on the DMZ were different, for example Bob, the agent would remain associated with Alice on her personal PC, because the keys and the agent depend on the environment where they originated.

At this point, we have located the agent and we know that it belongs to the user alice@personalcomputer, and that it is being used on the DMZ by the user alice.

How could we identify which servers we might move to laterally?

One idea is to check the known_hosts file for the user alice on the DMZ. This file contains a record of servers to which the user has previously connected, although in this case the entries are hashed:

```bash
cat /home/alice/.ssh/known_hosts
```

![Contents of Alice’s known_hosts, hashed](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-15.avif)

Another interesting file is alice’s .bash_history:

```bash
cat /home/alice/.bash_history | grep ssh | tail
```

![Bash history with ssh commands](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-16.avif)

> If .bash_history had not given us relevant information either, the only thing left would be to enumerate the server to see what we can find.

In this case, we can see connection attempts to a server called internalserver. This allows us to try using the identified SSH agent to connect directly to that server:

```bash
SSH_AUTH_SOCK=/tmp/ssh-XXXX41DN9o/agent.46200 ssh alice@internalserver
```

![Access to the internal server using SSH_AUTH_SOCK](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-17.avif)

We connect to the Internal Server as the user Alice by using the loaded SSH agent, without needing to know the private key passphrase. In this way, we have achieved lateral movement after compromising an intermediate server.

## Conclusion

That is it for today. We have shown how it is possible to move laterally within a network by using a compromised intermediate server where there is a socket connected to ssh-agent.

## References

- [SSH Agent Hijacking - Hacking technique for Linux and macOS explained](https://www.youtube.com/watch?v=hv7JwhwT0iQ)
- [PEN-300: Advanced Evasion Techniques and Breaching Defenses](https://www.offsec.com/courses/pen-300/)
- [SSH Agent Explained - Carl Tashian](https://smallstep.com/blog/ssh-agent-explained/)
- [SSH Agent Hijacking - Clockwork](https://www.clockwork.com/insights/ssh-agent-hijacking/)
- [SSH Agent Explained](https://smallstep.com/blog/ssh-agent-explained/)
