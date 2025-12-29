---
id: "que-es-el-pivoting"
title: "¿Qué es el Pivoting?"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-10-17
updatedDate: 2021-10-17
image: "https://cdn.deephacking.tech/i/posts/que-es-el-pivoting/que-es-el-pivoting-0.webp"
description: "Aprende qué es el pivoting en ciberseguridad, cómo usar equipos comprometidos para acceder a redes internas y las técnicas de enumeración post-explotación."
categories:
  - "linux"
  - "windows"
draft: false
featured: false
lang: "es"
---

Cuando comprometemos un equipo, mientras lo enumeramos, es probable que veamos que tenga acceso a otros equipos o incluso redes, que nosotros no tenemos acceso directamente.

Esto quiere decir, que tendremos que usar el equipo comprometido como "máquina de salto", para poder tener acceso a redes internas y otros equipos. Este proceso se puede repetir de forma recursiva.

Ejemplo gráfico:

<figure>

![Diagrama de pivoting en red empresarial](https://cdn.deephacking.tech/i/posts/que-es-el-pivoting/que-es-el-pivoting-1.avif)

<figcaption>

Pivoting

</figcaption>

</figure>

En esta imagen como vemos, de toda una red empresarial nosotros solo tenemos acceso a un equipo, el cual actúa de frontera entre la red interna y externa. Es a través de él, por el cual ejecutamos un pivoting para saltar a otro equipo, y repetimos el proceso, hasta llegar como vemos a un servidor crítico.

Básicamente, la metodología completa es la siguiente:

1. Pivoting
2. Enumeración Post-Explotación
3. Explotación
4. Vuelta al punto 1

En este aspecto, una vez hemos comprometido un activo, la enumeración para poder darnos cuenta de la existencias de otras redes o equipos variará en cada caso, sin embargo, si que hay ciertos patrones que se mantienen de forma general que podemos seguir.

Podemos empezar comprobando la caché ARP del equipo en busca de nuevas IPs, tanto en windows como en linux se puede ver mediante el comando `arp -a`.

Posteriormente, podemos echar un vistazo a los archivos hosts, la ruta de este archivo es la siguiente:

- Linux --> `/etc/hosts`
- Windows --> `C:\Windows\System32\drivers\etc\hosts`

En linux quizás también podría ayudarnos el archivo `/etc/resolv.conf` para descubrir servidores DNS. Una alternativa a este archivo es ejecutar el comando: `nmcli dev show`. Lo equivalente en windows sería usar el comando `ipconfig /all`.

También podríamos comprobar en Linux la tabla de routing, con el comando `route -n` o `ip route`. O ver si ya hay alguna conexión establecida con algún host con el comando `netstat -auntp`.

Por último, no olvidar comprobar las distintas interfaces de red que tenga el equipo:

- Linux --> `ifconfig`, `ip -4 addr`, `/proc/net/fib_trie`
- Windows --> `ipconfig`

En este punto, ya la enumeración adicional dependerá de cada caso, pero en lineas generales, ésto es lo común.

Una vez tenemos la información de a que equipos o red queremos llegar, la acción de hacer pivoting se puede llevar a cabo usando:

- Herramientas preinstaladas en el equipo comprometido.
- En caso de no tener, usar binarios estáticos de herramientas.

> La diferencia entre un binario estático y uno dinámico es la compilación. La mayoría de programas hacen uso de librerías externas para su funcionamiento. El binario estático trae con la compilación estas librerías que requiere el programa, sin embargo, un binario dinámico las requiere del sistema operativo, esto quiere decir que necesitas que el sistema operativo tengas esas librerias, ya que sino no funcionará. Por lo que el binario estático te soluciona posibles problemas de dependencias.

- Scripting.
- Proxies.

> Los proxies deben ser la última opción a usar, ya que éstos además de ser un poco lentos, suelen tener limitaciones sobre el tipo de tráfico que pueden transmitir, es decir, que por ejemplo, con un proxy TCP, no vas a poder hacer uso de tráfico UDP.

Ésto es todo en cuanto a que podemos usar para ejecutar pivoting.

Volviendo a la idea general del pivoting, hemos comentado mucho que su fin es acceder a otros equipos los cuales no tenemos accesos porque no están en nuestra red. Sin embargo, éste no es el único uso, el pivoting puede servirnos incluso para un equipo el cual ya tenemos acceso directamente.

Por ejemplo, puede que en ciertas ocasiones, un equipo no nos muestre todo los puertos abiertos que de verdad tiene, o que nos bloquee de distintas formas. Podemos en estos casos intentar hacer lo mismo pero a través de otro equipo de la misma red. Quien sabe si de la forma que está configurado, tiene una lista blanca de a que equipos bloquear o no X cosas.

Saber hacer pivoting también nos puede servir para mostrar externamente o tunelizar puertos que solo están abiertos de forma interna en la máquina, para así, poder interactuar desde fuera o desde nuestro equipo directamente.

Por eso mismo, el pivoting no solo es útil para acceder a otras redes, sino que también nos puede servir para interactuar con equipos de nuestra propia red.
