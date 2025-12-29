---
id: "reflected-xss-into-a-javascript-string"
title: "Reflected XSS into a JavaScript string with angle brackets HTML encoded – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-30
updatedDate: 2022-03-30
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-a-javascript-string/reflected-xss-into-a-javascript-string-0.webp"
description: "Aprende a explotar un Reflected XSS dentro de un string JavaScript en PortSwigger Lab. Guía paso a paso para escapar de un string y ejecutar código JavaScript cuando los corchetes angulares están codificados en HTML."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio: "Reflected XSS into attribute with angle brackets HTML-encoded".

![Pantalla de inicio del laboratorio Reflected XSS into a JavaScript string](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-a-javascript-string/reflected-xss-into-a-javascript-string-1.avif)

En este caso, para resolver el reto tenemos que inyectar un payload que escape del string donde se encuentra y llame a la función `alert`.

Lo primero de todo es acceder al laboratorio:

![Página principal del laboratorio con barra de búsqueda](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-a-javascript-string/reflected-xss-into-a-javascript-string-2.avif)

Una vez accedemos, nos encontramos ante una barra de búsqueda, por lo que vamos a usarla buscando una palabra aleatoria:

![Formulario de búsqueda con término de prueba](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-a-javascript-string/reflected-xss-into-a-javascript-string-3.avif)

Cuando hacemos la búsqueda, podemos observar como la palabra que hemos buscado, se encuentra, entre otros sitios en la siguiente parte del código fuente

![Código fuente mostrando término de búsqueda dentro de un string JavaScript](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-a-javascript-string/reflected-xss-into-a-javascript-string-4.avif)

Como podemos observar, es un string. Puedes pensar, ok, cierro la variable, pongo un `alert` y listo, una cosa así:
- `var searchTerms= ' alert('XSS') '`

Pero esto no es válido, ya que JavaScript no permite espacios en una variable, por esa misma razón para que toda la cadena se tome como parte de la variable, y aun así, el `alert` se ejecute, se concatena usando un guion. [En la documentación de StackOverflow puedes ver una explicación más detallada sobre el tratamiento de guiones en JavaScript](https://stackoverflow.com/questions/60593034/how-does-javascript-treat-hyphens).

Dicho esto, colocamos un payload como:
- `' '-alert('XSS')-' '`

![Payload XSS inyectado en el campo de búsqueda](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-a-javascript-string/reflected-xss-into-a-javascript-string-5.avif)

Y cuando le demos a buscar:

![Ejecución exitosa del alert escapando del string JavaScript](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-a-javascript-string/reflected-xss-into-a-javascript-string-6.avif)

Se habrá ejecutado el `alert`. En el código fuente, se verá de la siguiente forma:

![Código fuente mostrando payload inyectado exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-a-javascript-string/reflected-xss-into-a-javascript-string-7.avif)

Con esto, completamos el laboratorio:

![Confirmación final de éxito del laboratorio](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-a-javascript-string/reflected-xss-into-a-javascript-string-8.avif)
