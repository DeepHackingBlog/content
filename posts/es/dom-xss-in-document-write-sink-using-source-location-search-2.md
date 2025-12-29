---
id: "dom-xss-in-document-write-sink-using-source-location-search-2"
title: "DOM XSS in document.write sink using source location.search – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-02
updatedDate: 2022-03-02
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search/dom-xss-in-document-write-sink-using-source-location-search2-0.webp"
description: "Aprende a explotar DOM XSS en document.write escapando de un elemento img y ejecutando código JavaScript mediante la barra de búsqueda."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio: “DOM XSS in document.write sink using source location.search”:

![Descripción del laboratorio DOM XSS](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search/dom-xss-in-document-write-sink-using-source-location-search2-1.avif)

Cuando abrimos el lab, lo primero que nos encontramos es la siguiente web:

![Página principal del laboratorio](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search/dom-xss-in-document-write-sink-using-source-location-search2-2.avif)

Hay una barra de búsqueda, por lo que vamos a probar a simplemente buscar algo:

![Búsqueda de prueba en la barra de búsqueda](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search/dom-xss-in-document-write-sink-using-source-location-search2-3.avif)

![Resultado de búsqueda en el código fuente](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search/dom-xss-in-document-write-sink-using-source-location-search2-4.avif)

Cuando hacemos la búsqueda, si damos click derecho y vemos el código fuente del elemento de la palabra por la que hemos buscado, podremos ver que se sitúa en el atributo `src` de una imagen.

Observando el como se implementa nuestro input en el código fuente, podemos enviar un payload especializado que se escape del tag `<img>`.

Por ejemplo, vamos a usar:

- `"><script>alert("XSS")</script>//`

![Payload XSS en la barra de búsqueda](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search/dom-xss-in-document-write-sink-using-source-location-search2-5.avif)

Cuando hemos escrito nuestro payload, simplemente volvemos a hacer una búsqueda:

![Ejecución exitosa del alert](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search/dom-xss-in-document-write-sink-using-source-location-search2-6.avif)

Y como vemos, se nos ejecuta el código que hemos introducido. El código fuente se vería ahora de la siguiente forma:

![Código fuente con payload ejecutado](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search/dom-xss-in-document-write-sink-using-source-location-search2-7.avif)

Como vemos, nuestro input ya no se encuentra dentro del `<img>`, ya que hemos conseguido cerrar el elemento para escribir código JavaScript.

Con esto hecho, conseguimos resolver el laboratorio:

![Laboratorio completado exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search/dom-xss-in-document-write-sink-using-source-location-search2-8.avif)
