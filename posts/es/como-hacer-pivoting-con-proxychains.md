---
id: "pivoting-con-proxychains"
title: "Cómo hacer Pivoting con Proxychains"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-10-24
updatedDate: 2021-10-24
image: "https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-0.webp"
description: "Aprende a usar Proxychains para tunelizar tráfico de herramientas como nmap a través de múltiples proxies SOCKS en cascada con SSH."
categories:
  - "linux"
draft: false
featured: false
lang: "es"
---

Proxychains es un programita de Linux (no está en Windows) que nos permite hacer uso de herramientas y otros programas a través de un proxy. Como se menciona en el post de "Pivoting con SSH", es típico usarlo junto a un Dynamic Port Forwarding (en SSH), en caso de no tener el SSH disponible, también podemos usar chisel.

El "laboratorio" para este post es el siguiente:

- 4 Equipos:
    - Kali: Mi equipo de atacante
        - IP: 192.168.10.10
    - Debian 1: Servicio SSH activado
        - IP: 192.168.10.20 y 192.168.20.10 (2 Interfaces de Red)
    - Debian 2: Servicio Apache2 y SSH activado
        - IP: 192.168.20.20 y 192.168.30.10 (2 Interfaces de Red)
    - Debian 3: Servicio Apache2 activado
        - IP: 192.168.30.20 y 192.168.40.10 (2 Interfaces de Red, aunque la segunda para este post es irrelevante)

<figure>

![Diagrama de laboratorio con cuatro equipos para Proxychains](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-1.avif)

<figcaption>

Laboratorio Proxychains

</figcaption>

</figure>

Lo primero de todo es establecer un puerto como proxy, conectándonos por SSH al Debian 1:

<figure>

![Comando SSH con Dynamic Port Forwarding en puerto 8080](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-2.avif)

<figcaption>

Proxy establecido

</figcaption>

</figure>

Teniendo ya el puerto 8080 funcionando como un proxy. Tenemos que configurar proxychains para que funcione en este puerto, de tal forma que todo el tráfico lo envíe por ahí usando el protocolo SOCKS.

Para configurar proxychains nos vamos a la ruta por defecto de configuración:

```bash
/etc/proxychains.conf
```

```bash
/etc/proxychains4.conf
```

Puede ser una u otra, comprueba la que tengas en tu equipo. Normalmente es la segunda opción. De todas formas, ésta es la última ruta donde proxychains a la hora de ser usado comprobará que configuración tiene. El PATH (por así decirlo), donde proxychains busca el archivo de configuración, en orden, es el siguiente:

- Directorio Actual (`./proxychains.conf`)
- `$(HOME)/.proxychains/proxychains.conf`
- `/etc/proxychains.conf`
- `/etc/proxychains4.conf`

En cualquier caso, también puedes especificar el archivo a usar con el parámetro `-f <archivo>`, tal que:

```bash
proxychains -f <archivo> <comando>
```

Sabiendo esto, vamos a configurar el archivo, en este caso, la parte a cambiar está en el final de éste:

<figure>

![Configuración por defecto de Proxychains con SOCKS4](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-3.avif)

<figcaption>

Configuración default

</figcaption>

</figure>

> Nota: es bastante recomendable usar `socks5` en vez de `socks4`. Simplemente, se cambiaría el 4 por el 5 en el comando de arriba.

En la parte indicada, podemos, o cambiar el comando que ya hay, o comentarlo y añadir otro:

<figure>

![Configuración personalizada de Proxychains con puerto 8080](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-4.avif)

<figcaption>

Configuración nueva

</figcaption>

</figure>

De esta forma le indicamos que el proxy está en el localhost en el puerto 8080. Ahora, guardamos el archivo. Con esto, ya está todo configurado para que proxychains funcione. Para que un programa sea ejecutado enviando todo el tráfico por el proxy usando proxychains, usamos la siguiente sintaxis:

```bash
proxychains <comando>
```

Nota: puede que te des cuenta que en tu equipo existen tanto el comando `proxychains` como `proxychains4`, el primero si vemos su manual nos damos cuenta que apunta a proxychains4:

![Manual de proxychains mostrando que apunta a proxychains4](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-5.avif)

![Manual de proxychains4](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-6.avif)

Así que no importa el comando que uses.

Volviendo al tema, podemos abrir por ejemplo firefox siguiendo la sintaxis de `proxychains <comando>`:

![Ejecución de Firefox con Proxychains](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-7.avif)

Ahora mismo todo el tráfico de firefox está pasando por el proxy. Por lo que si intentamos acceder al servidor web al que supuestamente no tenemos acceso:

![Acceso exitoso al servidor web a través de Proxychains](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-8.avif)

¡Vemos que podemos acceder!

Esta misma idea no es solo aplicable a firefox, sino lo guay es que por ejemplo también podemos hacer uso de nmap:

<figure>

![Escaneo de puertos con nmap usando Proxychains](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-9.avif)

<figcaption>

Escaneo nmap a través de proxy

</figcaption>

</figure>

Sin embargo, proxychains tiene la limitación de que solo permite conexiones TCP (por eso mismo especifico en el comando nmap el argumento `-sT`) y protocolos SOCKS4, SOCKS5 y HTTP, por lo que por ejemplo un ping no funcionará ya que es protocolo ICMP:

<figure>

![Intento fallido de ping a través de Proxychains](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-10.avif)

<figcaption>

Ping fallido

</figcaption>

</figure>

Se queda en el intento, pero en ningún momento llega a nada.

Éste es el útil uso de proxychains. Lo cómodo, es sabiendo todo esto, de la misma forma, proxychains nos permite crear de forma sucesiva proxies que tiren del anterior. Me explico, en el punto donde estamos ahora, si yo inicio sesion en el Debian 2, de la misma forma que lo hemos hecho con Debian 1, creamos otro puerto que actúe como proxy:

![Conexión SSH al Debian 2 a través de Proxychains](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-11.avif)

Los argumentos que se han añadido son:

- `-f`: Hacemos que SSH se vaya al segundo plano en cuanto se conecte
- `-N`: No ejecutar nada (ni siquiera una shell), útil para Port Forwarding

Sin embargo, si nos fijamos el proceso se queda ahí:

![Proceso SSH en segundo plano](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-12.avif)

Con este SSH hecho que ya tira del proxy del Debian 1, podemos editar de nuevo la configuración:

<figure>

![Configuración actual de Proxychains con puerto 8080](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-13.avif)

<figcaption>

Configuración actual

</figcaption>

</figure>

<figure>

![Configuración actualizada con segundo proxy en puerto 9090](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-14.avif)

<figcaption>

Configuración nueva

</figcaption>

</figure>

Para que de ésta forma, al hacer uso de proxychains, tire de este nuevo proxy del Debian 2 (puerto 9090), el cual ya tira de la anterior conexión hecha (Debian 1 - puerto 8080):

<figure>

![Firefox ejecutado con Proxychains en cascada](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-15.avif)

<figcaption>

Proxychains usando puerto 9090 (el cual tira del 8080)

</figcaption>

</figure>

<figure>

![Acceso a la red 192.168.30.0/24 mediante proxies en cascada](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-16.avif)

<figcaption>

Accedemos a la red 192.168.30.0/24

</figcaption>

</figure>

Como vemos, podemos llegar al Debian 3, vamos a recordar el diagrama del laboratorio:

<figure>

![Diagrama de laboratorio con cuatro equipos para Proxychains](https://cdn.deephacking.tech/i/posts/pivoting-con-proxychains/pivoting-con-proxychains-17.avif)

<figcaption>

Laboratorio Proxychains

</figcaption>

</figure>

Conseguimos llegar al Debian 3 mediante un proxy SOCKS en Debian 2 el cual tira de otro proxy SOCKS en Debian 1. Todos estos proxies creados, en este caso, mediante SSH. OJO, proxychains siempre tirará del último proxy, o, al menos, el que le especifiquemos en el archivo de configuración. Así que estamos limitados a acceder a los recursos los cuales este proxy pueda llegar. Con esto me refiero a que si por ejemplo tenemos los equipos: 1 2 3 4 5, y cada uno solo tiene acceso, al de su izquierda o derecha. Si concatenamos varios proxies para llegar al equipo 5, una vez allí, no podremos acceder a los recursos de la 3, ya que el archivo de proxychains tira en este momento del proxy 5, y por lo tanto, tendrá acceso a lo que este dispositivo tenga acceso.

Dicho esto, como he indicado, este procedimiento se puede repetir tantas veces como queramos, incluso mezclando SSH con chisel (o cualquier otra herramienta que haga lo mismo) en los distintos saltos que hagamos.
