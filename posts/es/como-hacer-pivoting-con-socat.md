---
id: "como-hacer-pivoting-con-socat"
title: "Cómo hacer Pivoting con Socat"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-11-03
updatedDate: 2021-11-03
image: "https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-0.webp"
description: "Guía práctica sobre cómo usar Socat para realizar técnicas de pivoting, creando redirecciones y túneles bidireccionales entre múltiples equipos en diferentes redes."
categories:
  - "linux"
  - "windows"
draft: false
featured: false
lang: "es"
---

Socat es una herramienta que nos permite crear comunicaciones bidireccionales. Se le conoce como el netcat con esteroides, ya que es una herramienta tan completa que es casi imposible verla entera, por lo que vamos a centrarnos en los puntos más útiles para pivoting.

- [Introducción](#introducción)
- [Redirecciones](#redirecciones)

## Introducción

Socat es una herramienta para sistemas Linux, aunque también tiene ciertos binarios para Windows, pero no son muy comunes, de todas formas para descargar ambos binarios los links son los siguientes:

- [Binarios para Linux (32 y 64 Bits)](https://github.com/andrew-d/static-binaries/tree/master/binaries/linux)
- [Binarios para Windows (64 Bits)](https://sourceforge.net/projects/unix-utils/files/socat/1.7.3.2/socat-1.7.3.2-1-x86_64.zip/download)

La estructura de socat es muy sencilla, sin embargo la sintaxis puede parecer compleja al principio:

```bash
socat [opciones] <dirección origen> <dirección destino>
```

La sintaxis para las direcciones es:

```bash
<protocolo>:<ip>:<puerto>
```

El "laboratorio" en el que vamos a ver su funcionamiento es el siguiente:

- 4 Equipos
  - Kali --\> Mi equipo de atacante
    - IP: 192.168.10.10
  - Windows 7 de 64 Bits
    - IP: 192.168.10.40 y 192.168.20.40 --\> 2 Interfaces de Red
  - Debian 1
    - IP: 192.168.20.20 y 192.168.30.10 --\> 2 Interfaces de Red
  - Debian 2
    - IP: 192.168.30.20

<figure>

![Diagrama del laboratorio de pivoting con socat](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-1.avif)

<figcaption>

Laboratorio

</figcaption>

</figure>

## Redirecciones

Para practicar y ver como hacer redirecciones vamos a intentar enviarnos una Reverse Shell desde el Debian 2 (192.168.30.20) y Kali (192.168.10.10):

Primero nos ponemos en escucha desde nuestro kali, para tenerlo desde un principio listo:

![Netcat en escucha en Kali](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-2.avif)

Siguiendo el diagrama, la máquina con la que Kali tiene comunicación es el Windows 7, por lo que preparamos socat en esta máquina:

![Configuración de socat en Windows 7](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-3.avif)

```bash
socat tcp-l:443,fork,reuseaddr tcp:192.168.10.10.443
```

Vamos a explicar el comando:

- `tcp-l:443` --\> TCP-L es la abreviatura de TCP-LISTEN, escribiendo `TCP-L:<puerto>` nos ponemos en escucha desde ese puerto.
- `fork` --\> Indicamos que socat pueda aceptar más de una conexión.
- `reuseaddr` --\> permite reutilizar el puerto después de la finalización del programa

`fork` y `reuseaddr` se suelen usar siempre que nos pongamos en escucha con socat.

- `tcp:192.168.10.10:443` --\> recordando que socat maneja una estructura de \<origen\> \<destino\>, en este caso estamos indicando que el destino es el puerto 443 de la dirección 192.168.10.10.

Conociendo los argumentos del comando usado a nivel conceptual básicamente estamos diciendo que todo lo que reciba el equipo Windows por el puerto 443 lo envíe al puerto 443 del Kali, que es donde estamos en escucha.

Con esto listo, vamos a la máquina con la que Windows tiene comunicación (además del Kali), allí, también vamos a ejecutar socat usando el mismo concepto:

![Configuración de socat en Debian 1](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-4.avif)

El comando al fin y al cabo es el mismo, todo lo que reciba el Debian por el puerto 443, lo mandaré al puerto 443 del equipo Windows. Donde el equipo Windows todo lo que reciba lo mandará al puerto 443 del Kali. De esta forma, y con todo esta estructura ya montada, si desde el Debian 2 nos enviamos una Shell al puerto 443 del Debian 1, obtendremos la Reverse Shell en el kali:

![Enviando reverse shell desde Debian 2](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-5.avif)

![Reverse shell recibida en Kali](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-6.avif)

Si nos damos cuenta, obtenemos la conexión desde la IP del Windows, todo gracias a las redirecciones. Además, la Shell es totalmente funcional:

![Verificación de la shell funcional](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-7.avif)

Esto es un ejemplo de redirecciones para que nos llegue una Reverse Shell, sin embargo, también podemos usar socat para por ejemplo, redirecciones internas. Es decir, imaginémonos la situación donde yo tengo un servidor web corriendo en mi kali, pero solo accesible de forma interna, podría tunelizarlo a otro puerto usando socat:

Desde el Windows el Servidor Web de mi Kali no es accesible:

![Servidor web inaccesible desde Windows](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-8.avif)

Pero dentro de nuestro kali podemos hacer una redirección:

![Redirección de puerto con socat en Kali](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-9.avif)

De esta forma, estamos abriendo el puerto 8080 poniéndonos en escucha, y todo lo que recibamos desde este puerto, lo redirigimos a nuestro puerto 80 local.

Con esto, si intentamos desde el Windows acceder al 8080:

![Acceso exitoso al servidor web a través del puerto 8080](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-10.avif)

Vemos que podemos acceder al servidor 80, el cual a pesar de solo estar abierto de forma interna, podemos acceder a él.

Hasta ahora la dirección IP no ha cambiado, siempre ha sido 127.0.0.1 cuando hemos apuntado a algún sitio, sin embargo, socat nos permite colocar cualquier IP.

Ejemplo:

![Redirección de socat con IP específica](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-11.avif)

De esta forma le estamos diciendo que además de ponernos en escucha en el puerto 777, todo lo que se reciba a este puerto, se mande al puerto 80 del Kali (ahora está accesible), donde está el servidor web:

![Acceso exitoso desde el puerto 777](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-socat/como-hacer-pivoting-con-socat-12.avif)

Y vemos que accedemos sin problemas desde el puerto 777 local.

Y hasta aquí las funcionalidades de socat que nos puede ser muy útil para pivoting. Socat es una gran y compleja herramienta, aquí solo hemos visto la parte enfocada a redireccionamiento de conexiones. Veremos más cositas en otros posts. Y conforme aprenda más sobre Pivoting con Socat, también se irá agregando.
