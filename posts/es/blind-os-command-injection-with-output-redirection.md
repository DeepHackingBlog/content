---
id: "blind-os-command-injection-with-output-redirection"
title: "Blind OS command injection with output redirection – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-03
updatedDate: 2022-02-03
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-0.webp"
description: "Aprende a explotar vulnerabilidades de inyección de comandos ciega mediante la redirección de output a archivos accesibles para leer la salida de los comandos ejecutados."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio de PortSwigger: “Blind OS command injection with output redirection".

![Página de inicio del laboratorio de PortSwigger](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-1.avif)

Para resolver el laboratorio, tenemos que ejecutar el comando `whoami` en el servidor y leer su salida. Para ello, haremos uso de un Blind OS Command Injection que se encuentra en la función de feedback.

![Botón Submit feedback en la página](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-2.avif)

![Formulario de feedback con campos a rellenar](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-3.avif)

Como podemos observar, hay unos cuantos campos a rellenar. Por lo que vamos a rellenarlos:

![Campos del formulario completados](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-4.avif)

Ahora, antes de enviar el feedback. Preparamos el burp suite para que reciba las peticiones:

![Configuración del proxy en el navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-5.avif)

![Activación de la interceptación en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-6.avif)

Con esto listo, enviamos el feedback para captar la petición:

![Envío del formulario de feedback](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-7.avif)

![Petición interceptada en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-8.avif)

Esta es la petición que se envía al servidor cuando se envía feedback. Para tratar con ella, la enviamos al repeater pulsando Ctrl R:

![Petición enviada al Repeater de Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-9.avif)

Una vez en el repeater, podemos observar como una petición válida simplemente obtiene una respuesta de estado 200 y no mucho más.

Sin embargo, entre todos los parámetros que se están enviando, vamos a intentar ver si podemos ejecutar un comando en alguno de ellos, y no solo eso, sino redirigir el output a un directorio que podamos acceder. Para de esta forma, poder leer la salida del comando que hemos ejecutado.

Lo primero es determinar a que directorio podemos redirigir la salida de los comandos. Para ello, en este caso, vamos a usar el directorio donde se almacenan las imágenes, que en este caso se nos indica en la descripción del laboratorio:
- `/var/www/images`

Sabiendo esto, vamos a intentar realizar un Blind OS Command Injection redirigiendo la salida del comando a un archivo en el directorio de arriba:

<figure>

![Inyección del comando whoami con redirección de salida](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-10.avif)

<figcaption>

`$(whoami > /var/www/images/whoami.txt)`

</figcaption>

</figure>

Como se trata de un Blind OS Command Injection, no podemos ver la salida en la respuesta del servidor. Por lo que para confirmar si ha funcionado, tendremos que acceder al archivo al cual hemos redirigido la salida del comando.

Para acceder al archivo en cuestión, como lo hemos puesto en una carpeta llamada "images". Podemos suponer, que quizás se haya guardado en la misma ruta que por ejemplo las imágenes de las portadas de los productos de la web:

![Acceso a la imagen de un producto](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-11.avif)

![URL de la imagen mostrando el parámetro filename](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-12.avif)

Se acceden a las imágenes a través del parámetro `filename` del archivo `image`, por lo que vamos a sustituir el valor de este parámetro por el nombre del archivo al que hemos redirigido la salida del comando, en este caso, `whoami.txt`:

![Lectura exitosa del archivo whoami.txt](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-13.avif)

De esta forma, conseguimos resolver el laboratorio:

![Laboratorio completado exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-output-redirection/blind-os-command-injection-with-output-redirection-14.avif)
