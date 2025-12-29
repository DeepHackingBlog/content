---
id: "dom-xss-in-innerhtml-sink"
title: "DOM XSS in innerHTML sink using source location.search – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-03
updatedDate: 2022-03-03
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-innerhtml-sink/dom-xss-in-innerhtml-sink-0.webp"
description: "Resolución paso a paso del laboratorio de PortSwigger sobre DOM XSS utilizando innerHTML sink con source location.search para ejecutar código JavaScript malicioso."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio: “DOM XSS in innerHTML sink using source location.search”.

![Página de inicio del laboratorio DOM XSS in innerHTML sink](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-innerhtml-sink/dom-xss-in-innerhtml-sink-1.avif)

Lo primero de todo como siempre es acceder al laboratorio:

![Vista inicial del laboratorio con barra de búsqueda](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-innerhtml-sink/dom-xss-in-innerhtml-sink-2.avif)

Una vez accedidos, vemos una barra de búsqueda. Por lo que vamos a buscar cualquier cosa:

![Búsqueda de prueba en la barra de búsqueda](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-innerhtml-sink/dom-xss-in-innerhtml-sink-3.avif)

![Código fuente mostrando innerHTML del tag span](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-innerhtml-sink/dom-xss-in-innerhtml-sink-4.avif)

Si nos fijamos, lo que hemos buscado se ve reflejado en la web. Y si damos click derecho y vemos la parte del código fuente donde se situa, vemos que se almacena en el `innerHTML` del tag `<span>`.

Por lo que conociendo esto, podemos intentar usar en la búsqueda un payload especialmente diseñado para escaparnos de este tag, y ejecutar código Javascript. Por ejemplo, usaremos el siguiente payload:

- `</span><img src=/ onerror=alert(1) />//`

![Payload XSS insertado en la barra de búsqueda](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-innerhtml-sink/dom-xss-in-innerhtml-sink-5.avif)

![Alerta JavaScript ejecutándose con éxito](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-innerhtml-sink/dom-xss-in-innerhtml-sink-6.avif)

Al buscar por él, podemos ver como se nos ejecuta con éxito el payload. Hemos pasado de:

- `<span id="searchMessage">hola</span>`

a:

- `<span id="searchMessage"></span><img src=/ onerror=alert(1) />//</span>`

De esta forma, y consiguiendo esta ejecución, conseguimos resolver el laboratorio:

![Laboratorio resuelto exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-innerhtml-sink/dom-xss-in-innerhtml-sink-7.avif)
