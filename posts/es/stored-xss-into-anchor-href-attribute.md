---
id: "stored-xss-into-anchor-href-attribute"
title: "Stored XSS into anchor href attribute with double quotes HTML-encoded – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-29
updatedDate: 2022-03-29
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-0.webp"
description: "Aprende a explotar un Stored XSS en el atributo href de un anchor en PortSwigger Lab. Guía paso a paso para ejecutar JavaScript al hacer clic en el nombre del autor del comentario cuando las comillas dobles están codificadas en HTML."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio: "Stored XSS into anchor href attribute with double quotes HTML-encoded".

![Pantalla de inicio del laboratorio Stored XSS into anchor href attribute](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-1.avif)

En este caso, para resolver el laboratorio tenemos que escribir un comentario que llame a la función `alert` cuando se haga click en el nombre del autor del comentario.

Lo primero de todo es acceder al laboratorio:

![Página principal del laboratorio mostrando artículos del blog](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-2.avif)

Una vez accedemos, podemos ver como hay distintos artículos, nos metemos en el primero de ellos (podríamos meternos en cualquiera):

![Listado de artículos disponibles en el blog](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-3.avif)

![Vista completa del primer artículo del blog](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-4.avif)

Una vez dentro, podemos observar que hay una zona de comentarios:

![Sección de comentarios al final del artículo](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-5.avif)

Por lo que vamos a escribir un comentario cualquiera:

![Formulario de comentarios con campos a completar](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-6.avif)

![Comentario de prueba enviado correctamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-7.avif)

![Comentario publicado mostrando nombre del autor como hipervínculo](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-8.avif)

Cuando enviamos un comentario, este se escribe y almacena en la web. Podemos observar como en el comentario que hemos puesto hay un hipervínculo. Si vemos su código fuente, podemos observar como el atributo `href` corresponde al campo de `Website` de cuando se escribe un comentario:

![Código fuente HTML mostrando atributo href con valor del campo Website](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-9.avif)

Por lo que sabiendo esto, podemos escribir en el campo de `Website` un payload que nos ejecute un `alert` cuando se de click en el nombre del autor:

![Payload XSS inyectado en el campo Website del formulario](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-10.avif)

Enviamos el comentario y:

![Mensaje de laboratorio resuelto satisfactoriamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-11.avif)

¡Completamos el laboratorio! Si volvemos a la zona de comentarios y observamos el código fuente, podemos ver como se ha colocado nuestro payload:

![Código fuente mostrando payload XSS inyectado en atributo href](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-12.avif)

Y si damos click en `test`:

![Ejecución exitosa del alert al hacer clic en el nombre del autor](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-anchor-href-attribute/stored-xss-into-anchor-href-attribute-13.avif)

¡Se nos ejecuta!
