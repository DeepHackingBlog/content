---
id: "dom-xss-in-jquery-anchor-href-attribute-sink"
title: "DOM XSS in jQuery anchor href attribute sink using location.search source – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-08
updatedDate: 2022-03-08
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-0.webp"
description: "Aprende a explotar un DOM XSS en atributo href de jQuery usando location.search en PortSwigger Lab. Guía paso a paso para ejecutar código JavaScript aprovechando vulnerabilidades en anchor href attributes."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio: "DOM XSS in jQuery anchor href attribute sink using location.search source":

![Pantalla de inicio del laboratorio DOM XSS in jQuery anchor href attribute sink](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-1.avif)

En este caso, para resolver el laboratorio tenemos que ejecutar un `alert` que nos devuelva las cookies.

Lo primero de todo es acceder al laboratorio:

![Página principal del laboratorio mostrando artículos del blog](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-2.avif)

Una vez accedidos, nos dirigimos a la parte de enviar feedback, ya que, en el enunciado es donde se nos indica que se encuentra el XSS:

![Botón de Submit feedback en la página principal](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-3.avif)

![Formulario de envío de feedback del laboratorio](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-4.avif)

Cuando accedemos, si nos fijamos en la URL, podemos ver que de forma por defecto se nos añade el parámetro `returnPath`:

![URL mostrando parámetro returnPath en la barra de direcciones](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-5.avif)

Vamos a probar a añadirle cualquier valor al parámetro:

![Parámetro returnPath modificado con valor de prueba](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-6.avif)

En principio no pasa nada, pero si ponemos el ratón encima del hipervínculo de `Back`:

![Inspección del hipervínculo Back mostrando valor inyectado](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-7.avif)

Vemos como el valor que hemos colocado en la variable, se implementa en el atributo `href` de este elemento. Por lo que es tan sencillo como colocar un payload que nos ejecute el `alert` cuando demos click en el botón:
- `javascript:alert(document.cookie)`

![Payload JavaScript inyectado en el parámetro returnPath](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-8.avif)

Como vemos, conseguimos resolver el laboratorio, y desde el punto de vista del código fuente, lo que hemos conseguido es lo siguiente:

![Código fuente HTML mostrando atributo href con payload JavaScript](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-9.avif)

Ahora, si damos click en el hipervínculo `Back`:

![Mensaje de laboratorio resuelto satisfactoriamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-10.avif)

Se nos ejecutará el código Javascript que hemos indicado:

![Ventana de alert mostrando cookies vacías](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-11.avif)

En este caso no nos sale nada porque la única cookie que tenemos, tiene la flag `HTTPOnly` habilitada:

![Cookie de sesión con atributo HTTPOnly en herramientas de desarrollo](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-12.avif)

Esta flag habilita que las cookies solo puedan ser leídas desde el protocolo HTTP y no desde Javascript, es un mecanismo de defensa. Y con esto explicado, ya tendríamos el laboratorio hecho:

![Confirmación final de éxito del laboratorio](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-jquery-anchor-href-attribute-sink/dom-xss-in-jquery-anchor-href-attribute-sink-13.avif)
