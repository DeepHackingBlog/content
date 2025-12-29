---
id: "como-configurar-ip-forwarding-en-linux"
title: "Cómo configurar IP Forwarding en Linux"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-11-06
updatedDate: 2021-11-06
image: "https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-0.webp"
description: "Guía práctica para configurar un sistema Linux como router mediante IP Forwarding y el uso de rutas estáticas con ip route"
categories:
  - "linux"
draft: false
featured: false
lang: "es"
---

Podemos configurar un Linux como router de forma bastante sencilla. La idea es comprobar si en la máquina Linux que usaremos como router está el IP Forwarding activado, que es lo que permite el reenvío de paquetes. Por defecto, esta configuración estará desactivada.

Para este post estaremos usando las siguientes máquinas:
- 3 Equipos:
    - Kali -> Mi equipo de atacante
        - IP: 192.168.10.10
    - Debian 1 -> Actuará como Router
        - IP: 192.168.10.20 y 192.168.20.10 -> 2 Interfaces de Red
    - Debian 2 -> Servidor Apache 2 activado
        - IP: 192.168.20.20

![Topología de red con tres equipos](https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-1.avif)

Para comprobarlo, tendremos que mirar el contenido del archivo `/proc/sys/net/ipv4/ip_forward`.

![Contenido del archivo ip_forward mostrando valor 0](https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-2.avif)

Si está desactivado, el contenido será 0, por lo que, si queremos activarlo, tendremos que modificar su contenido a 1:

```bash
echo '1' > /proc/sys/net/ipv4/ip_forward
```

![Activación del IP Forwarding con valor 1](https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-3.avif)

Teniendo este valor activado en el Debian 1, ya solo queda agregar el enrutamiento estático.

¡OJO!, importante, tendremos que agregar la ruta estática por supuesto a nuestro kali, pero no olvidemos que también tendremos que agregarla a la máquina con la que queramos interactuar de la otra red (Debian 2), para que las respuestas sepan llegar a nosotros.

Podemos ver las rutas estáticas con el siguiente comando:

![Comando ip route show mostrando rutas estáticas](https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-4.avif)

Podemos agregar y eliminar rutas estáticas a nuestro antojo con los siguientes comandos (hace falta root):
- Agregar: `ip route add <ip de red a llegar>/<mascara de red en CIDR> via <ip del router> dev <interfaz a usar>`
- Eliminar: `ip route delete <ip de red a llegar>/<mascara de red en CIDR> via <ip del router> dev <interfaz a usar>`

De esta forma, en este caso, las rutas a agregar tanto en el Kali como en el Debian 2, serían las siguientes:
- Kali:

![Agregando ruta estática en Kali](https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-5.avif)
- Debian 2:

![Agregando ruta estática en Debian 2](https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-6.avif)

Teniendo el IP Forwarding ya activado en el Debian 1 y las rutas estáticas tanto en el Kali como en el Debian 2, ya podemos comunicarnos entre estos dos dispositivos sin ningún tipo de problema:

![Ping exitoso desde Kali a Debian 2](https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-7.avif)

![Acceso HTTP desde Kali a servidor Apache en Debian 2](https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-8.avif)

![Visualización del servidor Apache funcionando](https://cdn.deephacking.tech/i/posts/como-configurar-ip-forwarding-en-linux/como-configurar-ip-forwarding-en-linux-9.avif)

Y con esto ya habríamos configurado un Linux como router, además de hacer uso de `ip route` para agregar rutas que no tenemos de forma por defecto.
