---
id: "pivoting-con-ssh"
title: "Cómo hacer Pivoting con SSH"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-10-22
updatedDate: 2021-10-22
image: "https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-0.webp"
description: "Guía completa sobre pivoting con SSH usando Local, Remote y Dynamic Port Forwarding para tunelizar conexiones a través de servidores intermedios."
categories:
  - "linux"
  - "windows"
draft: false
featured: false
lang: "es"
---

Hacer pivoting mediante SSH es una de las formas más cómodas. Si se tiene la oportunidad de realizar port forwarding con este protocolo es una de las mejores opciones.

Índice:

- [Introducción](#introducción)
- [Local Port Forwarding](#local-port-forwarding)
- [Remote Port Forwarding](#remote-port-forwarding)
- [Dynamic Port Forwarding](#dynamic-port-forwarding)

## Introducción

SSH nos permite 3 modos de port forwarding (reenvío de puertos):

- Local Port Forwarding
- Remote Port Forwarding
- Dynamic Port Forwarding

El "laboratorio" para este post es el siguiente:

- 3 Equipos:
    - Kali: Mi equipo de atacante
        - IP: 192.168.10.10
    - Debian: Servicio SSH activado
        - IP: 192.168.10.20 y 192.168.20.10 (2 Interfaces de Red)
    - Debian: Servidor Apache2 activado
        - IP: 192.168.20.20 y 192.168.30.10 (2 Interfaces de Red, aunque la segunda para este post es irrelevante)

<figure>

![Diagrama de laboratorio con tres equipos para pivoting SSH](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-1.avif)

<figcaption>

Lab

</figcaption>

</figure>

El objetivo es llegar desde el Kali al Debian que tiene el servidor web, en base a como están distribuidas las redes arriba podemos darnos cuenta rapidamente de que no hay conexión directa entre un equipo y otro. Sin embargo, vamos a aprovecharnos del debian que actúa como servidor SSH y que además tiene conexión a ambas redes para poder llegar desde el Kali al servidor web.

## Local Port Forwarding

En este caso, aprovechamos la sesión de SSH para nosotros abrirnos un puerto en nuestro kali para que éste, nos rediriga a la máquina y puertos seleccionados, usando como pivoting el servidor al que nos conectamos por SSH.

La sintaxis e idea es la siguiente:

<figure>

![Sintaxis de Local Port Forwarding con SSH](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-2.avif)

<figcaption>

Sintaxis

</figcaption>

</figure>

Teniendo esto en cuenta, procedemos:

<figure>

![Comando SSH con Local Port Forwarding desde Kali](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-3.avif)

<figcaption>

Conexión Kali - SSH Server

</figcaption>

</figure>

Como vemos, la sintaxis usada es:

```bash
ssh -L 80:192.168.20.20:80 sikumy@192.168.10.20
```

Explicado con palabras, es lo siguiente:

Con el parámetro `-L`, le indicamos que queremos hacer un Local Port Forwarding. El primer puerto que le indicamos, es el puerto que nosotros nos abrimos localmente y que tunelizará hacia el servicio. Posteriormente, la IP y puerto especificado es al que queremos acceder y llegar desde nuestro puerto local. Todo esto a través de la máquina en la que iniciamos sesión con SSH.

Por lo que en este punto, si nos vamos al navegador manteniendo la sesión SSH abierta y vamos a la dirección: http://localhost/, veremos el servidor web:

<figure>

![Servidor web accesible desde localhost a través del túnel SSH](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-4.avif)

<figcaption>

Servidor Web tunelizado al localhost

</figcaption>

</figure>

De esta forma, podemos acceder a todos los puertos de todas las IP a las que el servidor SSH tenga acceso.

En el momento que cortemos la conexión también perderemos el port forwarding:

<figure>

![Cierre de sesión SSH con exit](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-5.avif)

<figcaption>

Fin de Conexión SSH

</figcaption>

</figure>

<figure>

![Error de conexión al cerrar el túnel SSH](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-6.avif)

<figcaption>

Fin de Conexión Servidor Web

</figcaption>

</figure>

## Remote Port Forwarding

El Remote Port Forwarding es un poco distinto al Local Port Forwarding. No cambia mucho a nivel sintaxis pero si a nivel conceptual.

La sintaxis en este caso es la siguiente:

```bash
ssh -R <puerto a abrir en la maquina a la que te conectas>:<dirección a donde apuntar>:<puerto a apuntar de la direccion donde se apunta> <usuario>@<direccion kali>
```

La peculiaridad del Remote Port Forwarding es que nosotros no iniciamos sesión en el servidor SSH que tenemos definido en el laboratorio. Sino que en este caso, es al revés, desde el servidor SSH que tenemos, iniciamos sesión en nuestra máquina kali (tendriamos que activar el servicio SSH).

Mirándolo desde el punto de vista de atacante y víctima, si tratamos el kali como atacante y el debian (servidor SSH) como víctima, nos podemos dar cuenta de que en la máquina víctima, estaríamos poniendo credenciales de nuestro equipo. Ésto hablando desde el punto de vista de la seguridad no es lo óptimo, por eso, se suele usar siempre Local Port Forwarding, ya que no tiene este peligro.

Entonces, volviendo a la práctica, ejecutariamos lo siguiente en el Debian (servidor SSH):

<figure>

![Comando SSH con Remote Port Forwarding desde Debian a Kali](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-7.avif)

<figcaption>

Inicio de Sesión en Kali

</figcaption>

</figure>

Como vemos, el comando para el Remote Port Forwarding es:

```bash
ssh -R 80:192.168.20.20:80 user@192.168.10.10
```

De esta forma, como estamos iniciando sesión en el kali, le estamos indicando que abra el puerto 80 y que apunte al Debian que actúa como servidor web. Podemos hacer esto ya que el Debian desde el que nos conectamos tiene acceso a ambas redes, por ello, es posible conectarlas.

Con esto hecho, si nosotros desde el kali nos vamos al localhost:

<figure>

![Servidor web accesible desde Kali mediante Remote Port Forwarding](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-8.avif)

<figcaption>

Localhost

</figcaption>

</figure>

Vemos que podemos acceder perfectamente al servidor web.

Y al igual que en el Local Port Forwarding, al momento que cortemos la sesión SSH, perdemos la conexión:

<figure>

![Cierre de sesión SSH con exit en Remote Port Forwarding](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-9.avif)

<figcaption>

exit

</figcaption>

</figure>

<figure>

![Error de conexión al cerrar el túnel Remote Port Forwarding](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-10.avif)

<figcaption>

Conexión perdida

</figcaption>

</figure>

## Dynamic Port Forwarding

Éste puede ser el tipo de Port Forwarding mas peculiar pero muy útil en ciertas ocasiones. El Dynamic Port Forwarding de forma resumida y mal dicha, nos permite tunelizar todos los puertos de toda la red a la que el servidor SSH tenga acceso. Ésto ocurre porque con este modo, podemos hacer que SSH actué como un proxy SOCKS:

<figure>

![Definición de proxy SOCKS](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-11.avif)

<figcaption>

Definición Proxy SOCKS

</figcaption>

</figure>

La sintaxis para lograr esto es la mas sencilla de todas:

```bash
ssh -D <puerto local que actuará de proxy> <usuario>@<IP>
```

Por lo que:

<figure>

![Comando SSH con Dynamic Port Forwarding creando proxy SOCKS](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-12.avif)

<figcaption>

Conexión SSH con Dynamic Port Forwarding

</figcaption>

</figure>

De esta forma, ahora mismo tenemos un proxy SOCKS en nuestro puerto local 8080.

Si por ejemplo, desde firefox, nos vamos a "Ajustes > Configuración de Red", podemos indicarle que use éste puerto como proxy SOCKS:

<figure>

![Configuración de proxy SOCKS en Firefox](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-13.avif)

<figcaption>

Configuración Proxy en Firefox

</figcaption>

</figure>

Ahora, ya no tenemos que acceder al localhost como hacíamos en el Local o en el Remote Port Forwarding. De ésta forma, podemos ir directo:

<figure>

![Acceso directo al servidor web usando proxy SOCKS](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-14.avif)

<figcaption>

Servidor Web a través de Proxy SOCKS

</figcaption>

</figure>

Como vemos parece como si estuviéramos en la misma red que el servidor web. La pregunta en este punto es:

- ¿Podemos hacer uso de ésto con otras herramientas, por ejemplo, nmap?

Pues si que podemos hacer uso tanto de nmap como de otras utilidades, si que es cierto que con ciertas limitaciones, pero podemos, y algunas veces es muy útil. Para poder hacer esto haremos uso de Proxychains.

## Conclusión + Info importante

Algo que no he mencionado hasta ahora es que en cualquiera de los 3 modos, puedes usar tantos argumentos como quieras, es decir, puedes poner varios -L para crear varios Local Port Forwarding en la misma sesión. Ésto mismo aplica para el Remote y el Dynamic Port Forwarding.

Ejemplo con Dynamic:

<figure>

![Creación de dos proxies SOCKS simultáneos con SSH](https://cdn.deephacking.tech/i/posts/pivoting-con-ssh/pivoting-con-ssh-15.avif)

<figcaption>

2 Proxies SOCKS

</figcaption>

</figure>

De ésta forma, podemos tunelizar tantos puertos como queramos (si hablamos de local y remote).

Y estas son las tres formas principales de hacer pivoting en SSH, además, como dato extra, todas las conexiones funcionan por encima de la capa de seguridad que proporciona este protocolo, por lo que todas las conexiones estarán encriptadas.
