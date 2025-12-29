---
id: "reflected-xss-into-html-context-with-nothing-encoded"
title: "Reflected XSS into HTML context with nothing encoded – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-24
updatedDate: 2022-02-24
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-html-context-with-nothing-encoded/reflected-xss-into-html-context-with-nothing-encoded-0.webp"
description: "Resolución paso a paso del laboratorio de PortSwigger sobre Reflected XSS en contexto HTML sin codificación, explotando la barra de búsqueda para ejecutar código JavaScript."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio de PortSwigger: “Reflected XSS into HTML context with nothing encoded”.

<figure>

![Página de inicio del laboratorio Reflected XSS into HTML context](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-html-context-with-nothing-encoded/reflected-xss-into-html-context-with-nothing-encoded-1.avif)

</figure>

Para resolver el laboratorio tenemos que realizar un Cross-site Scripting que llame a la función `alert`.

Cuando entramos en el laboratorio, vemos un campo de búsqueda:

![Vista inicial del laboratorio con barra de búsqueda](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-html-context-with-nothing-encoded/reflected-xss-into-html-context-with-nothing-encoded-2.avif)

Vamos a probar a buscar cualquier cosa:

![Búsqueda de prueba en la barra de búsqueda](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-html-context-with-nothing-encoded/reflected-xss-into-html-context-with-nothing-encoded-3.avif)

![Resultado de búsqueda mostrando el término reflejado](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-html-context-with-nothing-encoded/reflected-xss-into-html-context-with-nothing-encoded-4.avif)

Si nos fijamos, el término de búsqueda se ve reflejado en la web. Por lo que, podemos probar a meter un código Javascript usando el atributo `onerror` en el tag `<img>`.

De tal forma, que si falla al cargar la imagen que especificamos en el atributo `src`, se nos ejecutará lo que escribimos en `onerror`:

![Payload XSS insertado en la barra de búsqueda](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-html-context-with-nothing-encoded/reflected-xss-into-html-context-with-nothing-encoded-5.avif)

![Alerta JavaScript ejecutándose con éxito](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-html-context-with-nothing-encoded/reflected-xss-into-html-context-with-nothing-encoded-6.avif)

Como vemos, efectivamente vemos que ha fallado al cargar la imagen, por tanto, se nos ejecuta el `alert`. De esta forma, conseguimos resolver el laboratorio.
