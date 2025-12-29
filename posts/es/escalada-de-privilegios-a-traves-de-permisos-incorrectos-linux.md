---
id: "escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux"
title: "Escalada de Privilegios en Linux a través de Permisos Incorrectos"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-08-29
updatedDate: 2022-08-29
image: "https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-0.webp"
description: "Guía completa sobre escalada de privilegios en Linux explotando permisos incorrectos en archivos críticos como /etc/shadow, /etc/passwd y /etc/sudoers."
categories:
  - "linux"
draft: false
featured: false
lang: "es"
---

Una de las formas más típicas de escalada de privilegios consiste en una mala configuración de los permisos de un archivo o directorio, es por ello, que en este post vamos a ir viendo como podemos enumerar recursos con permisos que nos interesan, y la explotación de los más típicos.

Índice:

- [Enumeración Manual](#enumeración-manual)
- [Permisos de Lectura](#permisos-de-lectura)
    - [/etc/shadow](#lectura-shadow)
    - [Otros recursos](#lectura-otros-recursos)
- [Permisos de Escritura](#permisos-de-escritura)
    - [/etc/shadow](#escritura-shadow)
    - [/etc/passwd](#escritura-passwd)
    - [/etc/sudoers](#escritura-sudoers)
    - [Otros recursos](#escritura-otros-recursos)
- [Referencias](#referencias)

## Enumeración Manual

Cada sistema de archivos de cada máquina es distinto, sin contar las estructuras bases del propio sistema operativo, es por ello, que por lo general, aunque verifiquemos algunos archivos típicos que veremos más adelante, es importante saber hacer una enumeración global de los archivos que poseen X permiso. Para ello se puede hacer uso de algún que otro comando:

- Buscar archivos escribibles en el directorio raíz:

```bash
find / -maxdepth 1 -writable -type f
```

- `/` → Señalamos el directorio desde donde queremos comenzar la búsqueda.
- `-maxdepth 1` → Indicamos que solo queremos que la búsqueda llegue al primer nivel, es decir, unica y exclusivamente a los archivos y carpetas que se encuentran en el directorio que indicamos, y no recursivamente. De la misma forma, podemos indicarle más niveles, 2, 3... . En caso de no poner este argumento, la búsqueda se haría de forma recursiva.
- `-writable` → Filtramos por archivos y directorios que posean permiso de escritura para nuestro usuario.
- `-type f` → Limitamos la búsqueda única y exclusivamente a archivos.

- Buscar archivos legibles:

```bash
find /etc -maxdepth 1 -readable -type f
```

- `-readable` → Filtramos por archivos y directorios que posean permiso de lectura para nuestro usuario.

- Buscar todos los directorios donde se pueda escribir:

```bash
find / -executable -writable -type d
```

- `-executable` → Filtramos por archivos y directorios que posean permiso de ejecución para nuestro usuario actual.
- `-type d` → Limitamos la búsqueda única y exclusivamente a directorios.

Con el comando find y sus diferentes argumentos, podemos llegar a afinar búsquedas de forma bastante sencilla y cómoda. Estos tres comandos, de manera general, nos pueden servir para enumerar archivos y directorios interesantes de un sistema. Por ejemplo, podemos imaginarnos la situación donde con el tercer comando, conseguimos enumerar un directorio /var/backups donde el usuario root, ejecuta cada X tiempo una tarea cron que comprime usando zip y un wildcard. Puede que quizás aún no conozca la escalada de privilegios que acabo de mencionar, eso lo veremos en otro post, así que dont worry!. De igual forma, imaginémonos, que con el primer comando encontramos un script que el usuario root ejecuta cada X tiempo, y nosotros tenemos privilegios de escritura en ese script... Pues, ahí habría un vector de escalada de privilegios, al igual que con el primer caso.

Y con estos dos ejemplos, queda clara la finalidad de la enumeración de archivos y directorios a partir de los permisos. Ahora vamos a ver algunos casos de archivos típicos que en caso de tener permisos de más, puede que nos proporcionen un modo de convertirnos en root.

## Permisos de Lectura

##### /etc/shadow

Aprovechando los comandos que hemos visto previamente, por ejemplo, vamos a enumerar los archivos legibles dentro de la carpeta /etc:

![Enumeración de archivos legibles en /etc](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-1.avif)

En este caso, se puede ver que nuestro usuario tiene permisos de lectura sobre el archivo /etc/shadow:

![Permisos de lectura en /etc/shadow](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-2.avif)

Tener visibilidad sobre este archivo nos permite ver los hashes de las contraseñas de los usuarios, por lo que, podemos copiarlos e intentar crackearlos.

El tipo de algoritmo que sea el hash dependerá de cada sistema. Lo mejor para determinar cuál es, es fijarse en las primeras letras, en este caso $y$, y pues googlear sobre de que tipo de hash se puede tratar, un buen recurso es la [wiki de Hashcat con ejemplos de hashes](https://hashcat.net/wiki/doku.php?id=example_hashes).

Dejando esto a un lado, teniendo el hash del usuario root obtenido de haber leído el /etc/shadow, podemos intentar crackearlo:

![Crackeo de hash con hashcat](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-3.avif)

Y en caso de que haya suerte, habremos obtenido las credenciales correspondientes, en este caso, la de root.

##### Otros recursos

Aprovecharse de tener permisos de lectura no se limita para nada al archivo /etc/shadow. Realmente, aplicará a cualquier archivo que nos pueda ser de utilidad, esto dependerá totalmente de cada sistema, de archivos personales de ese sistema, etc. En cualquier caso, otros recursos en los que viene bien comprobar los archivos que puede haber son:

- `/tmp`
- `/opt`
- `/mnt`
- `/var/tmp`
- `/var/backups`
- `/var/mail`
- `/var/spool/mail`
- `/etc/exports`
- `/home/<otro usuario>/.ssh`

Y en todos estos casos, y en cualquiera realmente, no olvidemos comprobar los archivos y directorios ocultos.

## Permisos de Escritura

##### /etc/shadow

Al igual que antes, podemos aprovechar los comandos vistos al principio para enumerar todos los archivos situados en la carpeta /etc donde tengamos permisos de escritura:

![Enumeración de archivos escribibles en /etc](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-4.avif)

Tenemos permisos de escritura en el archivo /etc/shadow:

![Permisos de escritura en /etc/shadow](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-5.avif)

Por lo que la idea, es que al tener capacidad de escritura, podemos cambiar el hash de la contraseña de los usuarios, y, por tanto, cambiar la contraseña a los usuarios.

Para generar los hashes, podemos usar mkpasswd:

```bash
mkpasswd <contraseña>
```

![Generación de hash con mkpasswd](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-6.avif)

Con este hash generado, lo sustituimos por el hash que ya tiene el usuario root:

![Edición del archivo /etc/shadow](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-7.avif)

![Verificación de cambio de contraseña](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-8.avif)

De esta manera, ahora el usuario tendrá la contraseña que le acabamos de colocar y nos habremos aprovechado de los permisos de escritura en este archivo.

##### /etc/passwd

Sí volvemos a enumerar los archivos:

![Permisos de escritura en /etc/passwd](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-9.avif)

En este caso podemos observar como el usuario sikumy tiene permisos de escritura en el archivo /etc/passwd. Aprovecharnos de esto es bastante parecido a lo hecho en el /etc/shadow. La idea es generar la contraseña, la cual queremos asignarle al usuario correspondiente, normalmente root:

```bash
openssl passwd <contraseña>
```

![Generación de hash con openssl](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-10.avif)

Este comando genera la contraseña en [formato crypt](https://unix.stackexchange.com/questions/510990/why-is-the-output-of-openssl-passwd-different-each-time). Este es un formato válido para lo que queremos realizar. Ahora, teniendo esta contraseña, la idea es sustituir la x del usuario al que queramos cambiarle la contraseña, en el archivo /etc/passwd:

![Contenido original de /etc/passwd](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-11.avif)

![Modificación del archivo /etc/passwd](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-12.avif)

De esta forma, cuando hagamos, por ejemplo, un su root, el sistema buscará el usuario en el archivo /etc/passwd, y, una vez lo ha encontrado, en vez de irse al archivo /etc/shadow para ver el hash de la contraseña (que es lo que haría si estuviese la x). El sistema dirá, tengo aquí el hash, pues listo, lo valido con este y no compruebo el /etc/shadow. De esta manera, la contraseña del usuario root se habrá cambiado debido a que nuestra contraseña va antes que la original.

##### /etc/sudoers

Otro archivo típico, del cual nos podemos aprovechar si tenemos permisos de escritura, es el archivo de sudoers, este archivo define los privilegios de sudo en el sistema. Por defecto más o menos será así:

![Contenido por defecto de /etc/sudoers](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-13.avif)

Si tenemos capacidad de escritura sobre este archivo, podremos aplicarnos los permisos que queramos, de tal manera, que, por ejemplo, tengamos la capacidad de ejecutar cualquier comando siendo root por ejemplo. Para ello, primero verificamos los permisos que tenga nuestro usuario para este archivo:

![Verificación de permisos en /etc/sudoers](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-14.avif)

Una vez sabemos que podemos editar el archivo, la idea será agregar la siguiente línea:

```bash
sikumy ALL=(ALL) NOPASSWD:ALL
```

![Modificación del archivo sudoers](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-15.avif)

Como dato, podemos editar el archivo sin la necesidad de tener permisos de lectura. Ahora bien, una vez hemos agregado esta línea, le estaremos diciendo que el usuario sikumy puede ejecutar cualquier comando como cualquier usuario sin la necesidad de proporcionar contraseña. Por ejemplo:

![Ejecución de comandos con sudo sin contraseña](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux/escalada-de-privilegios-a-traves-de-permisos-incorrectos-linux-16.avif)

> Puede que si intentamos hacer uso de sudo teniendo en el archivo sudoers, permisos de escritura en "otros", nos salga un error. Este error es para prevenir este tipo de fallos de seguridad. Lo realmente importante aquí, es que si se encontrase la forma de sustituir el archivo de sudoers, o cambiarlo, sin la necesidad de que tenga permisos distintos a los por defectos, se podrá aprovechar para escalar privilegios.

##### Otros recursos

Al igual que en los permisos de lectura, los de escritura no se limitan a los archivos que hemos mencionado arriba, dependerá totalmente del propio sistemas donde nos encontremos. Aun así, otras situaciones que se me ocurren son:

- Tenemos capacidad de escritura en una carpeta donde se está ejecutando una tarea cron.
- Tenemos capacidad de escritura en un archivo que es ejecutado por una tarea cron.
- Tenemos capacidad de escritura en una librería que está siendo usada por un script el cual es ejecutado por una tarea cron.
- Tenemos capacidad de escritura en un [timer de systemd que se ejecuta cada cierto tiempo](https://book.hacktricks.xyz/linux-hardening/privilege-escalation#timers).

Y así, habrá mil situaciones más donde todo dependerá del propio sistema donde estemos, al final, lo que realmente importa, es que seamos consciente de lo que supone tener permisos de escritura en algún recurso del sistema, y que, a primera vista, puede parecer que no sirve de nada, pero concatenándolo con otras cosas, se puede realizar una explotación.

## Referencias

- [Escalada de privilegios en Linux por permisos incorrectos - Nozerobit](https://nozerobit.github.io/linux-privesc-wrong-permissions/)
- [Guía de escalada de privilegios en Linux mediante archivos escribibles - PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Linux%20-%20Privilege%20Escalation.md#writable-files)
- [Curso de escalada de privilegios en Linux para OSCP y más - Udemy](https://www.udemy.com/course/linux-privilege-escalation/)
