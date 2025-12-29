---
id: "escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps"
title: "Escalada de Privilegios en Windows a través de Aplicaciones Gráficas Inseguras"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-12-27
updatedDate: 2021-12-27
image: "https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-0.webp"
description: "Aprende a identificar y explotar aplicaciones gráficas mal configuradas en Windows para escalar privilegios mediante técnicas de GUI exploitation."
categories:
  - "windows"
draft: false
featured: false
lang: "es"
---

Normalmente, estamos acostumbrados a escalar privilegios desde la consola de comandos, y de hecho, es así el 95 por ciento de las veces. Sin embargo, hay ciertas ocasiones en las que de forma gráfica, cuando instalamos o abrimos un programa, si se hace como administrador directamente sin pedirnos contraseña del mismo etc, es posible que tengamos la capacidad de escaparnos de la aplicación para poder ejecutarnos una cmd como el mismo usuario que esté ejecutando el proceso.

Vamos a ver un ejemplo usando el entorno vulnerable que te prepara el script de "tib3rius" y que podéis encontrar en su [repositorio de Windows PrivEsc Setup](https://github.com/Tib3rius/Windows-PrivEsc-Setup).

- [Ejemplo de Explotación](#ejemplo-de-explotación)
- [Ejemplo real de esta explotación](#ejemplo-real-de-esta-explotación)
- [Referencias](#referencias)

## Ejemplo de Explotación

En este caso, en este entorno, el programa que al ejecutarlo, se ejecuta como el usuario administrador es el paint:

![Acceso directo de Paint configurado para ejecutarse como administrador](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-1.avif)

Nosotros hemos iniciado sesión en el equipo como el usuario "user", somos un usuario sin privilegios:

![Sesión iniciada como usuario sin privilegios](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-2.avif)

Volviendo al paint, al darle doble click y abrirlo, no nos pide nada, se abre sin más, porque está configurado para ello:

![Paint ejecutándose sin solicitar credenciales](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-3.avif)

Sin embargo, podemos comprobar que lo está ejecutando el usuario administrador a través del siguiente comando:

`tasklist /V | findstr <programa>`

> Tasklist muestra la lista de procesos que están actualmente en ejecución en el equipo. Con el argumento `/V` muestra una salida más detallada
> 
> Findstr simplemente es el equivalente al grep en sistemas Linux

![Proceso de Paint ejecutándose como administrador](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-4.avif)

Bien, pues sabiendo esto, nos volvemos al paint y lo que se suele hacer en estos casos es dirigirnos a alguna característica del programa donde nos podamos escapar del mismo. Lo más típico es intentar abrir el explorador de archivos, ya sea para seleccionar una ruta o abrir un archivo o lo que sea:

![Menú de Paint para abrir archivo](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-5.avif)

![Explorador de archivos abierto desde Paint](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-6.avif)

Con el explorador de archivos abierto, podemos abrirnos una cmd de la siguiente manera:

![Barra de direcciones del explorador de archivos](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-7.avif)

![CMD ejecutándose como administrador](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-8.avif)

OJO, también podríamos escaparnos y abrirnos una powershell.exe haciendo "SHIFT + Click Derecho":

![Menú contextual para abrir PowerShell](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-9.avif)

![PowerShell ejecutándose como administrador](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-10.avif)

Y de esta forma, también conseguimos escaparnos y ejecutar una cmd en el contexto de quien está ejecutando el paint, en este caso, admin. Esto ocurre ya que como el proceso padre está ejecutándose como administrador (paint), la cmd se ejecutará con los mismos privilegios al ser un proceso hijo. Desde el [Process Explorer](https://docs.microsoft.com/en-us/sysinternals/downloads/process-explorer), se ve así:

![Jerarquía de procesos en Process Explorer](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-11.avif)

Por lo que no es una vulnerabilidad como tal de paint, sino que existe la mala configuración de que esta aplicación se ejecuta como administrador directamente.

Ahora, si somos "anti-interfaz-gráfica", pues simplemente podemos pasarnos un archivo "exe" generado con msfvenom para que nos ejecute una reverse shell:

- Me pongo en escucha en el Kali:

![Listener de Netcat en Kali](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-12.avif)

- Ejecuto el "exe" que he pasado al Windows, el cual me genera una reverse shell hacia el kali al puerto 4444:

![Ejecución del payload en Windows](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-13.avif)

![Reverse shell obtenida como administrador](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps/escalada-de-privilegios-en-windows-a-traves-de-insecure-gui-apps-14.avif)

De esta forma, habiéndonos aprovechado de una vulnerabilidad de forma gráfica, al final de todo, hemos conseguido escalar privilegios y obtener una shell como Administrador.

## Ejemplo real de esta explotación

Hace no mucho (al menos a la hora de escribir este post), en agosto de 2021 salió una vulnerabilidad la cual permitía una escalada de privilegios usando dispositivos Razer. La escalada se realizaba prácticamente casi de la misma forma que se ha explicado en este post.

Básicamente, la idea básica consiste en que al conectar físicamente un dispositivo Razer, Windows automáticamente descargará e instalará el programa "Razer Synapse Software", este proceso lo realizará como el usuario SYSTEM (todo sin pedirnos permisos, lo hace automático). En el asistente de instalación, llega un momento en el que nos permite abrir el explorador de archivos para seleccionar la ruta donde queremos que se instale, en este punto simplemente ya hacemos lo que se ha explicado en este post.

A continuación os dejo un artículo que habla de la vulnerabilidad:

- [How a gaming mouse can get you Windows superpowers!](https://www.sophos.com/es-es/blog/how-a-gaming-mouse-can-get-you-windows-superpowers)

Claro, esto literalmente permitía que cualquier persona con un dispositivo Razer y acceso físico a un equipo, tuviera la capacidad de escalar privilegios.

Para más información, aquí otras fuentes donde se habla en detalle de como funciona:

- [Razer bug lets you become a Windows 10 admin by plugging in a mouse](https://www.bleepingcomputer.com/news/security/razer-bug-lets-you-become-a-windows-10-admin-by-plugging-in-a-mouse/)
- [You Can Get Admin Privileges On Windows 10 With A Razer Mouse](https://www.minitool.com/news/razer-mouse-bug-gain-admin-privileges-windows.html)

## Referencias

- [Curso Windows Privilege Escalation for OSCP & Beyond en Udemy](https://www.udemy.com/course/windows-privilege-escalation/)
- [Repositorio Windows-PrivEsc-Setup en GitHub](https://github.com/Tib3rius/Windows-PrivEsc-Setup)
- [Tweet original de la vulnerabilidad en dispositivos Razer](https://twitter.com/j0nh4t/status/1429049506021138437)
- [Razer bug lets you become a Windows 10 admin by plugging in a mouse](https://www.bleepingcomputer.com/news/security/razer-bug-lets-you-become-a-windows-10-admin-by-plugging-in-a-mouse/)
- [You Can Get Admin Privileges On Windows 10 With A Razer Mouse](https://www.minitool.com/news/razer-mouse-bug-gain-admin-privileges-windows.html)
