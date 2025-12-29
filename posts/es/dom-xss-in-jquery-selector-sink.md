---
id: "dom-xss-in-jquery-selector-sink"
title: "DOM XSS in jQuery selector sink using a hashchange event – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-09
updatedDate: 2022-03-09
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-0.webp"
description: "Aprende a explotar un DOM XSS en jQuery selector sink usando hashchange event en PortSwigger Lab. Guía paso a paso para crear un exploit que ejecute código JavaScript aprovechando vulnerabilidades en selectores jQuery."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio: "DOM XSS in jQuery selector sink using a hashchange event":

![Pantalla de inicio del laboratorio DOM XSS in jQuery selector sink](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-1.avif)

Para resolver el laboratorio, tenemos que enviar a una víctima un exploit que aproveche la vulnerabilidad del laboratorio para ejecutar la función `print()`.

Lo primero de todo es acceder al laboratorio:

![Página principal del laboratorio mostrando artículos del blog](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-2.avif)

En este caso, no vemos ninguna barra de búsqueda o página de feedback como ha ocurrido en otros retos de XSS. Sin embargo, si nos vamos al código fuente, nos encontramos con el siguiente trozo de código:

![Código JavaScript vulnerable con selector jQuery](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-3.avif)

Este código, básicamente lo que hace es que cuando se especifica en la URL algo después de un hashtag, busca este valor en la web y hace un scroll hasta la coincidencia.

Por ejemplo, si nos vamos abajo del todo del laboratorio, podemos ver como hay un post que tiene la palabra “Resume” en el título:

![Artículo del blog con título conteniendo la palabra Resume](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-4.avif)

Sabiendo esto, vamos a buscar por:
- `<URL>/#Resume`

![URL con fragmento hash Resume en la barra de direcciones](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-5.avif)

Damos enter.

![Scroll automático hacia el artículo con la palabra Resume](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-6.avif)

Y aunque en la imagen no se pueda apreciar, nos redirige automáticamente hacia el post que contiene la palabra.

Para ver como explotar esto, vamos a traer el código de nuevo:

![Código JavaScript mostrando selector jQuery vulnerable](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-7.avif)

Como podemos observar, realmente lo que ocurre en el código, es que cuando especificamos algo después del hashtag, jQuery intenta busca un elemento `h2` que contenga lo que hemos dicho. Cuando encuentra el elemento, este se almacena en la variable `post`, por lo que ahora, lo que contiene es un elemento de jQuery que se ve de la siguiente forma:

<figure>

![Objeto jQuery en consola mostrando elemento encontrado](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-8.avif)

<figcaption>

Pd: sale otra URL del laboratorio porque es una captura que hice en otro momento :P

</figcaption>

</figure>

Posteriormente, si la variable `post` tiene algún dato almacenado, se obtiene el primer elemento del objeto jQuery y se usa el método `scrollIntoView()`.

Aqui la vulnerabilidad como tal, se encuentra en la primera linea, en el selector sink de jQuery (`$()`):

![Vulnerabilidad en selector jQuery resaltada en el código](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-9.avif)

<figure>

![Detalle del selector jQuery vulnerable en la consola](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-10.avif)

<figcaption>

Pd: esta imagen también es de otro momento :P

</figcaption>

</figure>

Si no se sanitiza bien, lo que ocurre en aproximadamente en el código es lo siguiente:
- `$('section.blog-list h2:contains(' + decodeURIComponent(window.location.hash.slice(1)) + ')');`
- `$('section.blog-list h2:contains(' + Hola + ')');`

Por lo tanto, si ponemos un payload como el siguiente:
- `<img src=/ onerror=print()>`

Mas o menos, ocurriría algo así:
- `$('section.blog-list h2:contains(' + <img src=/ onerror=print()> + ')');`

De esta forma, se interpretaría. Vamos a probarlo:

![Payload XSS inyectado en el fragmento hash de la URL](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-11.avif)

Damos enter:

![Ejecución exitosa de la función print mediante el payload](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-12.avif)

Y efectivamente se ejecuta. Ahora tenemos que crear un exploit que mandemos a la víctima y se haga uso de esta vulnerabilidad. Para ello nos vamos al servidor del exploit:

![Botón para acceder al exploit server](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-13.avif)

![Interfaz del exploit server en PortSwigger](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-14.avif)

En este caso, la idea es automatizar la explotación usando un simple `<iframe>`:

![Código HTML con iframe malicioso en el exploit server](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-15.avif)

Antes de enviarlo vamos a ver como se vería:

![Botón para vista previa del exploit antes de enviarlo](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-16.avif)

![Vista previa del exploit mostrando iframe cargado](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-17.avif)

La victima al visitar una web con nuestro código, vería lo que estamos viendo, un pequeño iframe de la web, e inmediatamente después de que cargase la web, se ejecutaría la función `print()`:

![Diálogo de impresión ejecutado automáticamente por el exploit](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-18.avif)

Por lo que, viendo que funciona. Simplemente lo guardamos y lo enviamos a la víctima:

![Botones para guardar y entregar el exploit a la víctima](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-19.avif)

![Confirmación de envío del exploit a la víctima](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-20.avif)

De esta forma, conseguimos resolver el laboratorio:

![Mensaje de laboratorio resuelto satisfactoriamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-21.avif)

![Confirmación final de éxito del laboratorio](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-selector-sink/dom-xss-in-jquery-selector-sink-22.avif)
