---
id: "stored-xss-into-html-context-with-nothing-encoded"
title: "Stored XSS into HTML context with nothing encoded – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-01
updatedDate: 2022-03-01
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-html-context-with-nothing-encoded/stored-xss-into-html-context-with-nothing-encoded-0.webp"
description: "Resolución paso a paso del laboratorio de PortSwigger sobre Stored XSS en contexto HTML sin codificación, explotando comentarios para ejecutar código JavaScript malicioso."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio de PortSwigger: “Stored XSS into HTML context with nothing encoded”.

![Página de inicio del laboratorio Stored XSS into HTML context](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-html-context-with-nothing-encoded/stored-xss-into-html-context-with-nothing-encoded-1.avif)

Para resolver el laboratorio tenemos que ejecutar la función `alert` en un comentario de un post.

Cuando abrimos el laboratorio lo primero que tenemos que hacer es dirigirnos a un post cualquiera:

![Vista del blog con listado de posts disponibles](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-html-context-with-nothing-encoded/stored-xss-into-html-context-with-nothing-encoded-2.avif)

Dentro del post, encontramos lo siguiente:

![Formulario de comentarios con campos para rellenar](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-html-context-with-nothing-encoded/stored-xss-into-html-context-with-nothing-encoded-3.avif)

Como podemos ver tenemos la opción de dejar un comentario, y distintos campos a rellenar.

Por lo que nosotros simplemente vamos a hacerle caso, y vamos a rellenar todos los campos, eso si, en el campo del comentario, colocaremos un pequeño código JavaScript que nos ejecute un `alert`:

![Formulario completado con payload XSS en el campo de comentario](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-html-context-with-nothing-encoded/stored-xss-into-html-context-with-nothing-encoded-4.avif)

Con todos los campos rellenados, simplemente enviamos el comentario y habremos resuelto el laboratorio:

![Laboratorio resuelto exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-html-context-with-nothing-encoded/stored-xss-into-html-context-with-nothing-encoded-5.avif)

Para ver que ha ocurrido, vamos a volver al post donde hemos escrito nuestro comentario:

![Alerta JavaScript ejecutándose en el navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-html-context-with-nothing-encoded/stored-xss-into-html-context-with-nothing-encoded-6.avif)

![Post mostrando el comentario con código XSS inyectado](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-html-context-with-nothing-encoded/stored-xss-into-html-context-with-nothing-encoded-7.avif)

Y como vemos, al entrar en el post, se nos ejecuta el código que habíamos escrito en el campo de comentario. Acabamos de explotar un Stored XSS.

![Confirmación de laboratorio completado](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-xss-into-html-context-with-nothing-encoded/stored-xss-into-html-context-with-nothing-encoded-8.avif)
