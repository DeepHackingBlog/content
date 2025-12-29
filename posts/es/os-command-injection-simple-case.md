---
id: "os-command-injection-simple-case"
title: "OS command injection, simple case - PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-01
updatedDate: 2022-02-01
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-0.webp"
description: "Resolución paso a paso del laboratorio OS command injection, simple case de PortSwigger. Aprende a explotar vulnerabilidades de inyección de comandos del sistema operativo."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio de PortSwigger: “OS command injection, simple case”.

![Portada del laboratorio OS command injection](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-1.avif)

Para resolver el laboratorio, tenemos que ejecutar el comando `whoami` en el servidor. Para ello, tenemos que hacer uso del OS Command Injection que se encuentra en la comprobación de stock de los productos.

Por lo que vamos a dirigirnos a un producto cualquiera de la web:

![Página de producto en el laboratorio](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-2.avif)

Dentro del producto elegido, podemos ver como tiene un apartado para comprobar el stock:

![Apartado para comprobar el stock del producto](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-3.avif)

Si damos click:

![Resultado de la comprobación de stock](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-4.avif)

Simplemente, se nos mostrará el stock del producto. Ahora bien, vamos a interceptar la petición que hace el cliente al darle click a este botón, a su vez, preparamos el Burp Suite para recibirla:

![Configuración de Burp Suite para interceptar](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-5.avif)

![Activación del intercept en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-6.avif)

![Preparación para capturar la petición](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-7.avif)

![Petición interceptada en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-8.avif)

Una vez interceptada la petición, la mandamos al Repeater pulsando `Ctrl + R`:

![Petición enviada al Repeater](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-9.avif)

Como vemos, es una petición normal. Sin embargo, vamos a probar a cambiar el valor del `storeId`:

![Modificación del valor storeId](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-10.avif)

Vemos un error de sh, lo que quiere decir que el valor del `storeId` se está pasando a un programa de Linux. Sabiendo esto, podemos probar a hacer un OS Command Injection bastante simple:

![Ejecución de whoami en el servidor](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-11.avif)

En este caso, simplemente usando un punto y coma para separar el valor para que se trate como otro comando nos sirve para aislar el comando whoami de lo anterior y que se ejecute. De esta forma, conseguimos resolver el laboratorio:

![Laboratorio resuelto](https://cdn.deephacking.tech/i/posts/portswigger-labs/os-command-injection-simple-case/os-command-injection-simple-case-12.avif)
