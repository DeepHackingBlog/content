---
id: "blind-os-command-injection-with-time-delays"
title: "Blind OS command injection with time delays – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-02
updatedDate: 2022-02-02
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-0.webp"
description: "Aprende a explotar vulnerabilidades de inyección de comandos ciega usando delays de tiempo para detectar la ejecución exitosa de comandos en el servidor."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio de PortSwigger: “Blind OS command injection with time delays”.

![Página de inicio del laboratorio de PortSwigger](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-1.avif)

Para resolver el laboratorio, tenemos que ocasionar un delay de tiempo de respuesta en el servidor de 10 segundos. Para ello, haremos uso del OS Command Injection que se encuentra en la función de feedback.

Por lo que nos dirigimos la botón de “Submit feedback”:

![Botón Submit feedback en la página](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-2.avif)

![Formulario de feedback con campos a rellenar](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-3.avif)

Como podemos observar, hay unos cuantos campos a rellenar. Por lo que vamos a rellenarlos:

![Campos del formulario completados](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-4.avif)

Ahora, antes de enviar el feedback. Preparamos el burp suite para que reciba las peticiones:

![Configuración del proxy en el navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-5.avif)

![Activación de la interceptación en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-6.avif)

Con esto listo, enviamos el feedback para captar la petición:

![Envío del formulario de feedback](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-7.avif)

![Petición interceptada en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-8.avif)

Esta es la petición que se envía al servidor cuando se envía feedback. Para tratar con ella, la enviamos al repeater pulsando Ctrl R:

![Petición enviada al Repeater de Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-9.avif)

Una vez en el repeater, podemos observar como una petición válida simplemente obtiene una respuesta de estado 200 y no mucho más.

Sin embargo, entre todo los parámetros que se están enviando, vamos a intentar ver si podemos ejecutar un comando en alguno de ellos:

<figure>

![Inyección del comando sleep en el parámetro de mensaje](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-10.avif)

<figcaption>

`$(sleep 10)`

</figcaption>

</figure>

En el campo del mensaje, podemos escapar un comando para que se ejecute y así causemos un delay de respuesta de 10 segundos en el servidor, que era lo que nos pedía el enunciado.

De esta forma, resolvemos el laboratorio:

![Laboratorio completado exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-time-delays/blind-os-command-injection-with-time-delays-11.avif)
