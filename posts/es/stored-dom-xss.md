---
id: "stored-dom-xss"
title: "Stored DOM XSS – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-05-04
updatedDate: 2022-05-04
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-0.webp"
description: "Aprende a explotar vulnerabilidades de XSS DOM almacenado en la funcionalidad de comentarios y cómo bypassear el método replace() de JavaScript."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio: “Stored DOM XSS”.

![Descripción del laboratorio Stored DOM XSS](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-1.avif)

En este caso, el enunciado nos dice que existe una vulnerabilidad de XSS del tipo DOM almacenado en la funcionalidad de comentario del blog. Para resolver el laboratorio debemos de explotar la vulnerabilidad y ejecutar la función `alert`.

Dicho esto, lo primero de todo es acceder al laboratorio:

![Página principal del laboratorio](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-2.avif)

Una vez accedidos, podemos observar como hay distintos artículos, en este caso, vamos a ver el primero:

![Lista de artículos del blog](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-3.avif)

![Vista del primer artículo](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-4.avif)

Al acceder a un artículo, podemos observar como hay una zona de comentarios:

![Formulario de comentarios del blog](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-5.avif)

En este caso, simplemente vamos a llenarla con datos random y a publicar un comentario:

![Formulario de comentario completado](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-6.avif)

Una vez publicado, volvemos al artículo para ver nuestro comentario:

![Comentario publicado en el artículo](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-7.avif)

![Confirmación del comentario publicado](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-8.avif)

Sin problemas se ha publicado.

Si investigamos un poco el código fuente y las distintas dependencias (archivos JS), podemos encontrar el siguiente archivo de JavaScript, llamado `loadComments.js`:

![Archivo JavaScript loadComments.js](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-9.avif)

El archivo, entre otras cosas, posee una función que reemplaza los símbolos `>` y `<`, HTML encodeándolos cuando se carga los comentarios.

Aquí es donde está el fallo, está usando el método `replace` para la sustitución. Este método únicamente reemplaza la primera ocurrencia que encuentra, por ejemplo, si tengo la palabra patata y utilizo la función `replace` para sustituir las 'a' por una 'e', el resultado de implementar este método en la palabra patata dará como resultado: petata.

[Referencia del funcionamiento del método replace() en JavaScript](https://bobbyhadz.com/blog/javascript-replace-first-character-in-string#:~:text=To%20replace%20the%20first%20character%20in%20a%20string%3A,-Assign%20the%20character&text=Call%20the%20replace\(\)%20method,with%20the%20first%20character%20replaced.)

Por lo que, teniendo en cuenta este funcionamiento, podemos crear un payload típico de XSS, pero colocando al principio de este `<>` para que sean los que el script sustituya y no los símbolos usados en el código malicioso:

![Payload XSS con bypass del método replace](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-10.avif)

![Comentario con payload XSS publicado](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-11.avif)

De esta manera, al publicar el comentario y volver al post:

![Ejecución exitosa del alert de JavaScript](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-12.avif)

Conseguimos ejecutar el código JavaScript que habíamos puesto, en este caso, el `alert`.

De esta forma, conseguimos resolver el laboratorio:

![Mensaje de laboratorio resuelto](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-13.avif)

![Laboratorio completado exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/stored-dom-xss/stored-dom-xss-14.avif)
