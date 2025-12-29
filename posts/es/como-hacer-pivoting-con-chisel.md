---
id: "como-hacer-pivoting-con-chisel"
title: "Cómo hacer Pivoting con Chisel"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-10-26
updatedDate: 2021-10-26
image: "https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-0.webp"
description: "Guía completa sobre cómo utilizar Chisel para realizar técnicas de pivoting en entornos Windows y Linux, incluyendo Local, Remote y Dynamic Port Forwarding."
categories:
  - "linux"
  - "windows"
draft: false
featured: false
lang: "es"
---

Chisel es una herramienta super útil para usar tanto en máquinas Windows como Linux. Nos permite de forma muy cómoda prácticamente obtener las mismas funciones que SSH (en el aspecto de Port Forwarding).

Índice

- [Introducción](#introducción)
- [Local Port Forwarding](#local-port-forwarding)
- [Remote Port Forwarding](#remote-port-forwarding)
- [Dynamic Port Forwarding](#dynamic-port-forwarding)

## Introducción

Se puede descargar desde su [repositorio oficial de Chisel en GitHub](https://github.com/jpillora/chisel). Ahí podemos encontrar los diferentes paquetes para los distintos sistemas, tanto Windows como Linux:

<figure>

![Paquetes de Chisel disponibles para descarga](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-1.avif)

<figcaption>

Paquetes de Chisel

</figcaption>

</figure>

En este caso el "laboratorio" es el siguiente:

- 3 Equipos
  - Kali --\> Mi equipo de atacante
    - IP: 192.168.10.10
  - Windows 7 de 32 Bits
    - IP: 192.168.10.30 y 192.168.20.30 --\> 2 Interfaces de Red
  - Debian --\> Servidor Web y SSH - Puerto 22 y 80 activados
    - IP: 192.168.20.20 y 192.168.30.10 --\> 2 Interfaces de Red (aunque la segunda para este post es irrelevante)

<figure>

![Diagrama del laboratorio de pivoting con Chisel](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-2.avif)

<figcaption>

Lab

</figcaption>

</figure>

Como Chisel también es una herramienta que sirve en Windows, vamos a mezclar ambos sistemas, ya que es totalmente compatible.

Primero de todo descargamos las versiones correspondientes de chisel tanto para la máquina Kali como para la máquina Windows, ya que Chisel funciona mediante una arquitectura cliente-servidor. Una vez descargado nos aseguramos de que funcione:

<figure>

![Verificación de Chisel en Kali](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-3.avif)

<figcaption>

Kali

</figcaption>

</figure>

<figure>

![Verificación de Chisel en Windows 7](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-4.avif)

<figcaption>

Windows 7 - 32 Bits

</figcaption>

</figure>

Una vez tenemos todo listo, vamos a ver las posibilidades que nos ofrece Chisel. Realmente, con esta herramienta podemos simular y hacer todos los forwardings que SSH puede, es decir:

- Local Port Forwarding
- Remote Port Forwarding
- Dynamic Port Forwarding

Y todo sin la necesidad de SSH, lo que nos permite prácticamente poder usar Chisel en casi cualquier situación de forma que no dependamos de este protocolo. Además, de forma conceptual, todos los forwardings funcionan de la misma forma que en SSH.

## Local Port Forwarding

Sabiendo que la arquitectura es cliente-servidor, y que estamos ante el Local Port Forwarding, tenemos que establecer el servidor, en este caso, en la máquina Windows. Para ello, la sintaxis es bastante sencilla:

```bash
chisel server -p <puerto>
```

Tenemos que establecer un puerto el cual será donde chisel funcione y el cliente posteriormente se conecte, por lo que conociendo esto, yo voy a establecer el servidor en el puerto 1234:

<figure>

![Configuración del servidor Chisel para Local Port Forwarding](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-5.avif)

<figcaption>

Chisel Server en Local Port Forwarding

</figcaption>

</figure>

Con esto establecido, ahora solo tenemos que ir a nuestro Kali para que se conecte como cliente, la sintaxis en este caso es un poquito mas compleja ya que le tenemos que especificar a que IP y puerto queremos llegar:

```bash
chisel client <dirección servidor chisel>:<puerto servidor chisel> <puerto local a abrir>:<dirección a donde apuntar>:<puerto a apuntar de la direccion donde se apunta>
```

En este caso:

<figure>

![Configuración del cliente Chisel para Local Port Forwarding](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-6.avif)

<figcaption>

Chisel Cliente en Local Port Forwarding

</figcaption>

</figure>

Como vemos, chisel nos indica que nos hemos conseguido conectar, si no fuese ésto, se comportaría de la siguiente forma:

<figure>

![Error de conexión en Chisel](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-7.avif)

<figcaption>

Error si Chisel no se conecta

</figcaption>

</figure>

Pero en este caso, nos conectamos sin problemas. Con esto, ya solo tenemos que ir al puerto local que hemos abierto, en este caso el 80, el que supuestamente está apuntando al puerto 80 de la 192.168.20.20 (el servidor web vaya):

<figure>

![Acceso exitoso al servidor web a través del túnel](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-8.avif)

<figcaption>

Servidor Web

</figcaption>

</figure>

Como vemos, llegamos sin problemas.

Chisel también permite tunelizar varios puertos al mismo tiempo, siendo la sintaxis de esta forma:

A = `chisel client <dirección servidor chisel>:<puerto servidor chisel>`

B = `<puerto local a abrir>:<dirección a donde apuntar>:<puerto a apuntar de la direccion donde se apunta>`

La sintaxis para tunelizar varios puertos seria entonces la siguiente:

A + B + B + B + B... etc...

Ejemplo:

<figure>

![Tunelización de múltiples puertos con Chisel](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-9.avif)

<figcaption>

Tunelización de varios puertos

</figcaption>

</figure>

Además del puerto 80, estamos tunelizando el puerto 22 (SSH), por lo que:

<figure>

![Conexión SSH exitosa a través del túnel](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-10.avif)

<figcaption>

Conexión SSH

</figcaption>

</figure>

Vemos que nos conectamos a la máquina que hemos especificado.

## Remote Port Forwarding

Al contrario que en el Local Port Forwarding, en el Remote Port Forwarding, el servidor se coloca en el Kali, mientras que el cliente sería el Windows.

La sintaxis tanto para el cliente como para el servidor tiene algunas variaciones, en este caso, los comandos serían:

- Servidor --\> Kali

```bash
chisel server -p <puerto> --reverse
```

- Cliente --\> Windows

```bash
chisel client <dirección servidor chisel>:<puerto servidor chisel> R:<puerto a abrir en el servidor de chisel>:<dirección a donde apuntar>:<puerto a apuntar de la direccion donde se apunta>
```

Sabiendo esto, establecemos el servidor en nuestro kali:

<figure>

![Configuración del servidor Chisel en Kali](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-11.avif)

<figcaption>

Chisel Server en el puerto 1234

</figcaption>

</figure>

Con esto, nos conectamos desde el Windows a nuestra máquina Kali:

<figure>

![Conexión del cliente Windows al servidor Chisel](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-12.avif)

<figcaption>

Conexión Cliente-Servidor

</figcaption>

</figure>

Si miramos ahora nuestro Kali podemos ver como se ha conectado correctamente:

<figure>

![Confirmación de conexión exitosa en el servidor](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-13.avif)

<figcaption>

Conexión exitosa con Chisel

</figcaption>

</figure>

De esta forma, analizando y trayendo el comando ejecutado en el cliente:

```bash
chisel client 192.168.10.10:1234 R:80:192.168.20.20:80
```

Deberíamos en nuestro kali desde nuestro puerto 80, poder acceder al puerto 80 de la 192.168.20.20 (el Servidor Web):

<figure>

![Acceso al servidor web mediante Remote Port Forwarding](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-14.avif)

<figcaption>

Accedemos al Servidor Web

</figcaption>

</figure>

Como vemos llegamos sin problemas.

Al igual que en el Local Port Forwarding, podemos tunelizar varios puertos con la misma conexión de Chisel, se haría de la misma forma:

A = `chisel client <dirección servidor chisel>:<puerto servidor chisel>`

B = `R:<puerto a abrir en el servidor de chisel>:<dirección a donde apuntar>:<puerto a apuntar de la direccion donde se apunta>`

La sintaxis para tunelizar varios puertos seria entonces la siguiente:

A + B + B + B + B... etc...

Ejemplo:

<figure>

![Tunelización de múltiples puertos desde el cliente](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-15.avif)

<figcaption>

Tunelización de 2 Puertos desde el Cliente

</figcaption>

</figure>

<figure>

![Respuesta del servidor a la tunelización](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-16.avif)

<figcaption>

Respuesta a Tunelización de dos puertos

</figcaption>

</figure>

De esta forma, podemos acceder no solo puerto 80 de la máquina, sino también al puerto 22:

<figure>

![Conexión SSH mediante tunelización múltiple](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-17.avif)

<figcaption>

Conexión SSH exitosa

</figcaption>

</figure>

Vemos que funciona perfectamente.

## Dynamic Port Forwarding

Con el Dynamic Port Forwarding podemos tunelizar todos los puertos, creando un proxy SOCKS. El funcionamiento y uso es exactamente el mismo que el proxy de SSH.

Chisel nos permite tanto crear un Forward Proxy como un Reverse Proxy. A nivel de uso, se suele usar mas el Reverse Proxy, por la misma razón que las Reverse Shells son mas famosas que las Bind Shells. Hablando de forma genérica, un Reverse Proxy o una Reverse Shell te dará menos problemas en cuanto a firewalls que las otras dos opciones (Forward y Bind). En cualquier caso, sea el que sea el proxy que escojas, ambos harán su cometido.

Para cada uno, la sintaxis es un poco distinta:

- Forward Proxy
  - Servidor --\> Windows
    - `chisel server -p <puerto> --socks5`
  - Cliente --\> Kali
    - `chisel client <dirección servidor chisel>:<puerto servidor chisel> <puerto que actuará como proxy>:socks`
- Reverse Proxy
  - Servidor --\> Kali
    - `chisel server -p <puerto> --reverse`
  - Cliente --\> Windows
    - `chisel client <dirección servidor chisel>:<puerto servidor chisel> R:<puerto que actuará como proxy>:socks`

<figure>

![Recordatorio del diagrama del laboratorio](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-18.avif)

<figcaption>

Recordatorio del Lab

</figcaption>

</figure>

Vamos a ver ambos de forma práctica, pero antes, configuramos el firefox para que tire contra el puerto 1080, que será el puerto donde en cada caso de cada proxy funcionará éste (para que no tengamos que cambiarlo).

<figure>

![Configuración del proxy SOCKS en Firefox](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-19.avif)

<figcaption>

Configuración Firefox

</figcaption>

</figure>

Con esto listo, vamos a empezar.

- Forward Proxy

<figure>

![Configuración del servidor para Forward Proxy](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-20.avif)

<figcaption>

Servidor

</figcaption>

</figure>

<figure>

![Configuración del cliente para Forward Proxy](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-21.avif)

<figcaption>

Cliente

</figcaption>

</figure>

De esta forma, si intentamos acceder a la IP 192.168.20.20 en Firefox:

<figure>

![Acceso exitoso mediante Forward Proxy](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-22.avif)

<figcaption>

Conexión exitosa

</figcaption>

</figure>

Vemos que accedemos.

- Reverse Proxy:

<figure>

![Configuración del servidor para Reverse Proxy](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-23.avif)

<figcaption>

Servidor

</figcaption>

</figure>

<figure>

![Configuración del cliente para Reverse Proxy](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-24.avif)

<figcaption>

Cliente

</figcaption>

</figure>

De esta forma, si intentamos de nuevo acceder al Servidor Web:

<figure>

![Acceso exitoso mediante Reverse Proxy](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-chisel/como-hacer-pivoting-con-chisel-25.avif)

<figcaption>

Conexión exitosa

</figcaption>

</figure>

Seguimos llegando sin problemas.

En este caso, solo estamos usando el proxy para firefox, pero se puede usar para otros programas o comandos. Para ello, podemos hacer uso de Proxychains, el cual aprovechará este proxy SOCKS creado para tramitar todo el tráfico. Esto se puede ver con mayor detalle en el post de [Pivoting con Proxychains](https://blog.deephacking.tech/es/posts/como-hacer-pivoting-con-proxychains/).
