---
id: "como-hacer-pivoting-con-netsh"
title: "Cómo hacer Pivoting con Netsh"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-11-04
updatedDate: 2021-11-04
image: "https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-0.webp"
description: "Aprende a realizar pivoting y port forwarding en Windows utilizando Netsh, una utilidad nativa que permite tunneling de puertos y control del firewall."
categories:
  - "windows"
draft: false
featured: false
lang: "es"
---

Netsh es una utilidad de Windows que nos permite hacer Port Forwarding de una forma muy sencilla. Además, la ventaja es que viene por defecto instalado en Windows, aunque la desventaja es que son necesarios privilegios de administrador para poder usarla (al menos de cara al Port Forwarding y el control del firewall).

- [Introducción](#introducción)
- [Port Forwarding con netsh](#port-forwarding-con-netsh)
- [Control del Firewall con netsh](#control-del-firewall-con-netsh)

## Introducción

Los 3 comandos que vamos a usar son los siguientes:

1. `netsh interface portproxy add v4tov4 listenport=<puerto a escuchar> listenaddress=<direccion a escuchar> connectport=<puerto a conectar> connectaddress=<direccion a conectar>`
2. `netsh interface portproxy show all`
3. `netsh interface portproxy reset`

El laboratorio de este post es el siguiente:

- 3 Equipos
    - Kali
        - IP: 192.168.10.10
    - Windows 7
        - IP: 192.168.10.40 y 192.168.20.40 –> 2 Interfaces de Red
    - Debian –> Servidor Web y SSH – Puerto 22 y 80 activados
        - IP: 192.168.20.20

<figure>

![Diagrama del laboratorio de pivoting con Netsh](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-1.avif)

<figcaption>

Lab

</figcaption>

</figure>

## Port Forwarding con netsh

Estando en la máquina Windows y teniendo privilegios de administrador, podemos comprobar la tabla de Port Forwarding de netsh con el siguiente comando:

`netsh interface portproxy show all`

![Tabla de Port Forwarding vacía](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-2.avif)

No nos muestra nada, por lo que está vacía. Así que con el siguiente comando, vamos a hacer el Port Forwarding de los puertos que queramos:

`netsh interface portproxy add v4tov4 listenport=<puerto a escuchar> listenaddress=<direccion a escuchar> connectport=<puerto a conectar> connectaddress=<direccion a conectar>`

![Configuración de Port Forwarding con netsh](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-3.avif)

En el comando se configuran 4 parámetros, cada uno de ellos, sirve para lo siguiente:

- `listenport` --> Especificamos el puerto en el que Windows escuchará y que servirá como tunneling para la dirección y puerto que conectemos.
- `listenaddress` --> Especificamos la dirección de red en la que escuchará el puerto especificado en `listenport`. Esto indicará la interfaz en la que se escuchará.
- `connectport` --> Especificamos el puerto de la dirección a la que queremos llegar
- `connectaddress` --> Especificamos la dirección a la que queremos llegar

Como vemos en la imagen, en principio no aparece nada, ni error ni nada que diga que "ha ocurrido algo". Sin embargo, si ahora ejecutamos el comando anterior para ver la tabla de netsh:

![Tabla de Port Forwarding configurada](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-4.avif)

Podemos ver como se ha establecido lo que le hemos dicho en los comandos de arriba. Nota: como se explica en el parámetro `listenaddress`, es importante indicar bien la dirección en la que escuchamos, si indicásemos por ejemplo 127.0.0.1 solo se podrá acceder desde el propio Windows. Sin embargo, indicándole 192.168.10.40 (que también es la IP del Windows), el puerto funcionará en la interfaz 192.168.10.0/24, y, por lo tanto, será accesible para los que tengan acceso a esta red. Aunque también podemos ahorrárnoslo, si no le especificamos el parámetro `listenaddress`, escuchará en todas las interfaces:

![Port Forwarding escuchando en todas las interfaces](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-5.avif)

Con esto, Windows ya estaría realizando el Port Forwarding, por lo que vamos a comprobarlo desde nuestro kali:

![Comprobación del tunneling desde Kali](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-6.avif)

Vemos que nos tuneliza perfectamente ambos puertos. Y realmente es tan sencillo como esto. Además, netsh guarda la configuración de los Port Forwarding en el siguiente registro:

`HKLM:\SYSTEM\CurrentControlSet\Services\PortProxy\v4tov4\tcp`

![Ubicación del registro de Port Forwarding](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-7.avif)

![Contenido del registro de Port Forwarding](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-8.avif)

Si quisiéramos eliminar/resetear la tabla de netsh (también se eliminan los registros), podríamos hacerlo con el siguiente comando:

`netsh interface portproxy reset`

![Reseteo de la tabla de netsh](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-9.avif)

![Tabla de netsh reseteada](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-10.avif)

Y de esta forma eliminaríamos cualquier tunelización que estemos haciendo, además de sus respectivos registros.

## Control del Firewall con netsh

Otro aspecto muy útil que tiene netsh, es que nos permite controlar el firewall de Windows, añadiendo reglas que por ejemplo un puerto que solo esté accesible de forma interna, se muestre de hacia fuera. Es decir, si por ejemplo una máquina tuviese el SMB solo accesible de forma interna (esto significa que se esté ejecutando, pero solo de forma interna, si no estuviese ejecutándose no serviría de nada), y nosotros tuviésemos credenciales de administrador para usar con PsExec. Podríamos usar netsh para que el puerto SMB se muestre hacia fuera y así conseguir persistencia con PsExec.

En este aspecto, los comandos para arreglar reglas son los siguientes:

- Tráfico entrante:

`netsh advfirewall firewall add rule name=<nombre de la regla> protocol=TCP dir=in localport=<puerto> action=allow`

![Regla de firewall para tráfico entrante](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-11.avif)

- Tráfico saliente:

`netsh advfirewall firewall add rule name=<nombre de la regla> protocol=TCP dir=out localport=<puerto> action=allow`

![Regla de firewall para tráfico saliente](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-netsh/como-hacer-pivoting-con-netsh-12.avif)

De esta forma el puerto ya estaría expuesto de forma externa. Hay muchas otras opciones en cuanto a firewall, pero a nivel práctico, si necesitásemos una para pivoting, sería esta, la capacidad de mostrar puertos internos de forma externa.

Netsh como se ha visto, es una herramienta muy cómoda para pivoting gracias a que viene por defecto en Windows. El único requerimiento como ya se ha dicho, es tener privilegios de Administrador.
