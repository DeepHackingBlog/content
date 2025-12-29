---
id: "kali-linux-en-docker"
title: "Kali Linux on Docker"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2023-06-05
updatedDate: 2023-06-05
image: "https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-0.webp"
description: "Complete guide to install and manage Kali Linux on Docker. Learn to configure the environment, tunnel traffic through Burp Suite, and manage containers."
categories:
  - "linux"
  - "windows"
draft: false
featured: false
lang: "en"
---

Everyone knows VMWare or VirtualBox, they are the most common options for setting up virtual machines, and more specifically, setting up Kali. However, although both options are good, they are not the only ones. In this post, we're going to see how to install and manage Kali on Docker and some reasons why I've recently chosen this option instead of using a virtual machine.

- [Downloading and Installing Kali and Docker Desktop](#downloading-and-installing-kali-and-docker-desktop)
- [WSL2 vs Docker based on WSL2](#wsl2-vs-docker-based-on-wsl2)
- [Tunneling all container traffic through Burp Suite](#tunneling-all-container-traffic-through-burp-suite)
- [Commands to manage the container](#commands-to-manage-the-container)
- [Conclusion](#conclusion)
- [References](#references)

## Downloading and Installing Kali and Docker Desktop

The first thing we need to do is download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/) on our computer:

![Docker Desktop download page](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-1.avif)

The installation is relatively simple, you just need to follow the wizard itself. If anything, I would mention that in one of the steps it will ask if you want to use HyperV or WSL. The option that the wizard itself will recommend is WSL, so we'll keep it.

![WSL configuration in Docker Desktop](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-2.avif)

Once it's installed, you'll need to restart the computer and we'll have Docker installed:

![Docker Desktop installed and running](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-3.avif)

I recommend having Windows Terminal installed, since aside from the customization options it has, the aesthetics are much more pleasant than CMD or PowerShell. In Windows 11 it's included by default, in Windows 10 we'll need to install it.

- [Windows Terminal installation and configuration guide](https://learn.microsoft.com/es-es/windows/terminal/install)

Once we have all this, it's time to go with the Kali installation. First of all, we need to download the image. Here we have several possibilities that we can see in more detail in the following link:

- [Official Kali Linux Docker Images documentation](https://www.kali.org/docs/containers/official-kalilinux-docker-images/)

The two main images are:

- [kalilinux/kali-rolling updated weekly](https://hub.docker.com/r/kalilinux/kali-rolling)
- [kalilinux/kali-last-release updated quarterly](https://hub.docker.com/r/kalilinux/kali-last-release)

In this case, we're going to install the first one. Installing a Docker image is as simple as using the command shown in their respective Docker Hub links:

![Command to download image on Docker Hub](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-4.avif)

```bash
docker pull kalilinux/kali-rolling
```

![Downloading Kali Linux image in terminal](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-5.avif)

After downloading the image, we'll be able to visualize it in Docker Desktop:

![Kali Linux image in Docker Desktop](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-6.avif)

Once we have the Kali image downloaded, the idea before creating the container is to limit the resources it will use, since if we don't limit them, it will start using almost all the PC's resources. Therefore, we need to create the .wslconfig file in the following path:

- C:\\Users\\\<User\>\\.wslconfig
- C:\\Usuarios\\\<Usuario\>\\.wslconfig

The content should be as follows:

```ini
# Settings apply across all Linux distros running on WSL 2
[wsl2]

# Limits VM memory to use no more than 4 GB, this can be set as whole numbers using GB or MB
memory=4GB 

# Sets the VM to use two virtual processors
processors=2
```

These are not the only options that can be configured in this file, but they are the minimum to limit resources, which is what we're interested in. For more options, you can check Microsoft's documentation:

- [wslconfig file documentation on Microsoft](https://learn.microsoft.com/es-es/windows/wsl/wsl-config#example-wslconfig-file)

Once the .wslconfig file is created, what we'll do before creating the container is restart WSL. To do this, we close Docker Desktop and run the following in CMD or PowerShell:

![Restarting WSL from PowerShell](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-7.avif)

All this is simply to apply the .wslconfig changes. Once done, we'll open Docker Desktop again and create the container, which is basically the Kali "VM". To create the container, we run the following command:

```bash
docker run -ti -h deephacking --name deephacking kalilinux/kali-rolling
```

- `docker run`: is Docker's main command to run a container.
- `-ti`: are the options passed to the run command. The \-t flag assigns a pseudo TTY (terminal) to the container, and the \-i flag allows interaction with the container's terminal.
- `-h` deephacking: sets the container's hostname as "deephacking".
- `--name` deephacking: assigns a name to the container, in this case "deephacking".
- `kalilinux/kali-rolling`: is the name of the Docker image that will be used to create the container.

![Kali Linux container running](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-8.avif)

And in an instant, we'll be inside our Kali.

At this point, we actually already have Kali installed, the only thing is that it's almost empty. From the [official Docker images documentation for Kali](https://www.kali.org/docs/containers/official-kalilinux-docker-images/), we're recommended to install kali-linux-headless, which corresponds to the default installation without GUI. Other available packages can be seen in the [Kali Linux metapackages documentation](https://www.kali.org/docs/general-use/metapackages/). In any case, we proceed to install the recommended package:

```bash
apt update && apt -y install kali-linux-headless
```

![Installing packages on Kali Linux](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-9.avif)

Throughout the package installation, we'll be asked several configuration guidelines. I personally configured it as follows:

![Wireshark configuration](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-10.avif)

![Keyboard configuration](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-11.avif)

![macchanger configuration](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-12.avif)

![Kismet configuration](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-13.avif)

![sslh configuration](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-14.avif)

With the installation finished, we'll have a fully functional Kali with several pre-installed tools:

![Kali Linux fully installed and functional](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-15.avif)

## WSL2 vs Docker based on WSL2

At this point, the question may arise: Why would I install Kali using Docker if I can go to the Microsoft Store, download it directly, and use it with WSL2?

![Kali Linux in Microsoft Store](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-16.avif)

Between these two options, there are a series of differences that, at least for me, make me lean towards the Docker option. Of course, everything will depend on each person's needs and even preferences.

In any case, some differences between these two options are as follows:

1. Using WSL2 directly, you have more direct access to Windows resources. This can be useful if you're interested in interacting with specific Windows tools or files. On the other hand, using Docker means you're using an isolated environment.
2. In WSL2, since files and data are stored directly in the Windows file system, you'll have them available even after closing Kali. Conversely, in Docker, data is stored inside the container. As mentioned, an isolated system.
3. Using Docker, you'll have all its advantages in terms of building, sharing, and managing containers.
4. Docker uses a Linux image inside the container, which may provide greater compatibility with applications and tools.

Moreover, speaking more personally, WSL2 has given me more problems than Docker has so far. With WSL2, I've had DNS problems more than once, while with Docker I haven't. And hey, I also like that both systems are isolated for simple organization, not in the same file system.

In conclusion, both options have their differences and are good. Simply, at least for now and by personal preference, I'll stick with Docker. Even so, in the following link you can see more information about this debate:

- [Comparison between Docker and WSL on AskUbuntu](https://askubuntu.com/questions/969810/ubuntu-on-windows-10-docker-vs-wsl)

> Also, in favor of these two options instead of using a VM, is disk capacity. I don't have to worry about how many GB of hard drive it has, since both WSL and Docker use the host system's capacity based on their needs.

## Tunneling all container traffic through Burp Suite

One of the features I liked about Docker that I didn't know about was how easily you can tunnel or not tunnel traffic through a Proxy. For example, I use Burp Suite on Windows because it has better performance than on virtualized Linux due to the available resources of the host system. Therefore, in a very simple way, it's possible to tunnel all container traffic through Burp Suite, located on the Windows host machine.

First of all, go to:

Configuration → Resources → Proxies

![Docker Desktop configuration](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-17.avif)

![Proxies section in Docker Desktop](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-18.avif)

In this section, we configure the Burp Suite proxy so that all traffic goes through it:

![Proxy configuration in Docker Desktop](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-19.avif)

Now, what we'll need to do is install the Burp Suite certificate in Kali Linux for HTTPS requests, because otherwise, when we deal with websites using this protocol, it will show that we're using an insecure certificate:

![Insecure certificate error in HTTPS](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-20.avif)

To fix this, first of all we need to download the Burp Suite certificate, which we'll do in Windows, since our Burp Suite is located there:

![CA certificate download in Burp Suite](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-21.avif)

Now, the idea is to move it to the container. To do this, we can use Docker Desktop itself, specifically the "Files" tab that we can find by clicking on a container.

![Container view in Docker Desktop](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-22.avif)

![Files tab in Docker Desktop](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-23.avif)

Here we can select and drag a file to move it from Windows to Kali simply without complications:

![Dragging file to container](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-24.avif)

> This feature can also be used in reverse, it's possible to download files from the container to the host computer.

This way we already have it in the container:

![Certificate in Kali container](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-25.avif)

Now we need to convert the certificate that is in DER format to a public key. To do this, we use openssl:

```bash
openssl x509 -in cacert.der -inform DER -out burp.crt
```

![Certificate conversion with openssl](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-26.avif)

Once we have the public key, we simply move it to the "/usr/local/share/ca-certificates/" directory:

![Moving certificate to correct directory](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-27.avif)

Finally, we simply update the certificates:

```bash
update-ca-certificates
```

![Certificate update in Kali](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-28.avif)

As we can see, it indicates that one has been added.

Now, if we try the same curl we did at the beginning again:

![Curl working correctly with certificate](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-29.avif)

It works without problems and we manage to get all traffic to go through Burp Suite.

This is quite useful for the following situations:

- We want to save all the requests we make in the Burp Suite project.
- We have an exploit and we want to get the HTTP request in RAW to be able to play with it from Burp Suite.
- We're building a script. Burp Suite can help us debug it thanks to the fact that we can visualize both the requests that are sent and their respective response. The same can be done from the code, but hey, seeing it in Burp Suite is much more comfortable.
    - On this point, it came in great for me for the exploitation and automation of a boolean-based SQL injection :)

> We can deactivate or activate the use of the proxy from the configuration as many times as we want and whenever we want. After making the respective change, it's not necessary to restart the containers or anything like that.

## Commands to manage the container

We now have Kali ready and the Burp Suite certificate installed. At this point, all that's left is to go into Hack mode. However, it's important to know the basic commands to manage the container in case you haven't touched Docker before. Therefore, I'll leave the minimum commands to know to be able to deal with it:

List all containers, whether running or not:

```bash
docker ps -a
```

![Listing all containers](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-30.avif)

List running containers:

```bash
docker ps
```

![Listing running containers](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-31.avif)

Start a stopped container:

```bash
docker start <ID>
```

The container ID corresponds to the ID we can get with docker ps.

![Starting stopped container](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-32.avif)

Connect to the container's main process:

```bash
docker attach <ID>
```

If we exit this process, the container will stop, because it's the main process.

![Connecting to container's main process](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-33.avif)

Execute a new process in a container:

```bash
docker exec -it <ID> <command>
```

![Executing new process in container](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-34.avif)

Stop a running container:

```bash
docker stop <ID>
```

![Stopping running container](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-35.avif)

These are the main commands we need to know to deal with the Kali we've installed.

## Conclusion

We've seen how to install Kali Linux on Docker. Likewise, we've seen a bit of the flow and commands that are followed when dealing with Docker images and containers, which helps us deal with any image we see from here on out.

Moreover, hey, knowing another alternative to the famous VirtualBox and VMWare is great. As I've already mentioned in the post, right now my setup is such that:

- Burp Suite on Windows
- Kali on Docker
    - Which I tunnel when I need it through Burp Suite

Of course, this setup does without Kali's graphical part, however, the truth is that I haven't missed it.

> Off-topic: And although it escapes a bit from the post's theme, it's also important to know which tools are worth launching from Windows and which from Linux. For example, hashcat is clearly going to be much better on Windows to be able to get the most out of the GPU.

## References

- [Guide to add Burp Suite CA certificate in Kali Linux](https://bestestredteam.com/2019/05/25/adding-burp-suite-ca-certificate-to-kali-linux-ca-store/)
- [Official Kali Linux Docker Images documentation](https://www.kali.org/docs/containers/official-kalilinux-docker-images/)
- [How to limit memory usage on Docker Desktop with WSL 2](https://medium.com/geekculture/how-to-limit-memory-usage-on-docker-desktop-wsl-2-mode-2a4a719f05fd)
- [Comparison between Docker and WSL on AskUbuntu](https://askubuntu.com/questions/969810/ubuntu-on-windows-10-docker-vs-wsl)
