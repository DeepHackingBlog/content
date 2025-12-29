---
id: "dom-xss-in-document-write-sink-using-source-location-search"
title: "DOM XSS in document.write sink using source location.search inside a select element – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-31
updatedDate: 2022-03-31
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-0.webp"
description: "Aprende a explotar DOM XSS en document.write escapando de un elemento select y ejecutando código JavaScript arbitrario."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio: “DOM XSS in document.write sink using source location.search inside a select element”.

![Descripción del laboratorio DOM XSS](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-1.avif)

En este caso, para resolver el reto tenemos que escaparnos del elemento `select` y llamar a la función `alert`.

Lo primero de todo es acceder al laboratorio:

![Página principal del laboratorio](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-2.avif)

Una vez hemos accedido, podemos ver varios productos. Vamos a entrar en uno cualquiera:

![Lista de productos disponibles](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-3.avif)

Cuando entramos, podemos observar una función para comprobar el stock en las distintas ciudades:

![Vista del producto individual](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-4.avif)

![Selector de ciudades para verificar stock](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-5.avif)

![Resultado de la verificación de stock](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-6.avif)

Si observamos el código fuente de la web, podemos encontrar el siguiente código:

![Script JavaScript en el código fuente](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-7.avif)

Analizando un poco el script, básicamente se entiende que además de las tres ciudades por defecto para comprobar el stock, se le puede agregar una más a través de la variable `storeId` de la URL. Por lo que podemos probar a añadir esa variable y un valor cualquiera:

![URL con parámetro storeId agregado](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-8.avif)

Una vez accedemos a la web de nuevo pero con la variable `storeId`, si nos fijamos en las ciudades:

![Nueva ciudad agregada al selector](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-9.avif)

Podemos ver como se ha agregado una más, en concreto una con el nombre del valor que le hemos pasado a la variable.

Si nos vamos de nuevo al código fuente, podemos observar como este parámetro se implementa:

![Implementación del parámetro en el código](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-10.avif)

Por lo que, observando esto, podemos intentar poner un valor que ocasione que nos escapemos del propio elemento `options`, y ejecute un `alert`:

![URL con payload XSS malicioso](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-11.avif)

Al acceder a la web con este valor en la variable:

![Ejecución exitosa del alert](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-12.avif)

Se nos ejecuta el `alert`. En el código fuente, podemos observar lo siguiente:

![Código fuente mostrando el escape exitoso](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-13.avif)

Y de esta forma, conseguimos resolver el laboratorio:

![Laboratorio completado exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-document-write-sink-using-source-location-search-inside-a-select-element/dom-xss-in-document-write-sink-using-source-location-search-14.avif)
