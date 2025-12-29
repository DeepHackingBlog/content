---
id: "reflected-xss-into-attribute-with-angle-brackets-html-encoded"
title: "Reflected XSS into attribute with angle brackets HTML-encoded – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-10
updatedDate: 2022-03-10
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-attribute-with-angle-brackets-html-encoded/reflected-xss-into-attribute-with-angle-brackets-html-encoded-0.webp"
description: "Aprende a explotar un Reflected XSS en un atributo HTML en PortSwigger Lab. Guía paso a paso para inyectar un atributo malicioso que ejecute JavaScript cuando los corchetes angulares están codificados en HTML."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio: "Reflected XSS into attribute with angle brackets HTML-encoded".

![Pantalla de inicio del laboratorio Reflected XSS into attribute](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-attribute-with-angle-brackets-html-encoded/reflected-xss-into-attribute-with-angle-brackets-html-encoded-1.avif)

En este caso, para resolver el reto tenemos que inyectar un atributo que nos ejecute un `alert`.

Lo primero de todo es acceder al laboratorio:

![Página principal del laboratorio con barra de búsqueda](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-attribute-with-angle-brackets-html-encoded/reflected-xss-into-attribute-with-angle-brackets-html-encoded-2.avif)

Una vez accedemos, nos encontramos ante una barra de búsqueda, por lo que vamos a usarla buscando una palabra aleatoria:

![Formulario de búsqueda con término de prueba](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-attribute-with-angle-brackets-html-encoded/reflected-xss-into-attribute-with-angle-brackets-html-encoded-3.avif)

![Resultados de búsqueda mostrando parámetro en URL](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-attribute-with-angle-brackets-html-encoded/reflected-xss-into-attribute-with-angle-brackets-html-encoded-4.avif)

Cuando buscamos, si nos fijamos aquí ocurren varias cosas:
1. En este caso no hay resultados, pero eso es lo de menos.
2. En la URL se nos añade el parámetro `search`.
3. Lo que buscamos, acaba siendo el valor del atributo `value` en el elemento `input`.

Teniendo en cuenta los dos últimos puntos, podemos crear un payload que nos cree un nuevo atributo dentro del elemento `input` para que se nos ejecute un `alert`. En este caso el payload es:
- `"onmousemove="alert(1)`

![Payload XSS inyectado en el parámetro de búsqueda](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-attribute-with-angle-brackets-html-encoded/reflected-xss-into-attribute-with-angle-brackets-html-encoded-5.avif)

De esta forma, buscando por el payload que hemos especificado arriba, conseguimos resolver el laboratorio:

![Página de resultados sin ejecución visible del alert](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-attribute-with-angle-brackets-html-encoded/reflected-xss-into-attribute-with-angle-brackets-html-encoded-6.avif)

Parece que no ha ocurrido nada a nivel de ejecutar el `alert`, sin embargo, si pasamos el ratón por encima de la palabra:

![Ejecución exitosa del alert al mover el ratón sobre el campo](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-attribute-with-angle-brackets-html-encoded/reflected-xss-into-attribute-with-angle-brackets-html-encoded-7.avif)

Se nos ejecuta. De esta forma conseguimos resolver el laboratorio:

![Confirmación final de éxito del laboratorio](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-xss-into-attribute-with-angle-brackets-html-encoded/reflected-xss-into-attribute-with-angle-brackets-html-encoded-8.avif)
