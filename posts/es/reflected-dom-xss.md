---
id: "reflected-dom-xss"
title: "Reflected DOM XSS – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-05-03
updatedDate: 2022-05-03
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-dom-xss/reflected-dom-xss-0.webp"
description: "Aprende a explotar una vulnerabilidad Reflected DOM XSS en PortSwigger Lab. Guía paso a paso para identificar y explotar un script inseguro que procesa datos reflejados en el DOM de manera vulnerable."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio: "Reflected DOM XSS":

![Pantalla de inicio del laboratorio Reflected DOM XSS](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-dom-xss/reflected-dom-xss-1.avif)

En este caso se nos indica que el servidor procesa los datos de una petición y lo muestra los datos de la respuesta. Posteriormente, un script de la página procesa los datos reflejados de una forma insegura. Para resolver el laboratorio debemos de ejecutar la función `alert`.

Dicho esto, lo primero de todo es acceder al laboratorio:

![Página principal del laboratorio con formulario de búsqueda](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-dom-xss/reflected-dom-xss-2.avif)

Una vez accedidos, podemos observar un formulario que nos permite buscar en el blog. Para analizar mejor el comportamiento de esta funcionalidad, abrimos Burp Suite y activamos el proxy en el navegador:

![Configuración del proxy en el navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-dom-xss/reflected-dom-xss-3.avif)

![Interceptor de Burp Suite activado y en espera](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-dom-xss/reflected-dom-xss-4.avif)

Con esto hecho, probamos a hacer cualquier búsqueda:

![Formulario de búsqueda con término de prueba](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-dom-xss/reflected-dom-xss-5.avif)

![Petición GET interceptada con parámetro de búsqueda](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-dom-xss/reflected-dom-xss-6.avif)

Cuando damos a `Buscar`, se genera la petición que podemos observar arriba. No hay mucha información, además de que en el enunciado nos hacen el spoiler de que la vulnerabilidad está en un script inseguro, por lo que podemos suponer que la primera petición de búsqueda no tiene mucha historia, por lo que simplemente la enviamos.

Cuando enviamos la primera petición de búsqueda, si mantenemos el intercept de Burp Suite puesto, interceptaremos la siguiente petición:

![Segunda petición JSON interceptada generada por el frontend](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-dom-xss/reflected-dom-xss-7.avif)

Esta tiene pinta que ha sido generada por el frontend del recurso que se solicitó en la primera petición (`/?search=test`). Para analizar mejor su respuesta, la pasamos al repeater:

![Respuesta JSON en Burp Suite Repeater mostrando término de búsqueda](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-dom-xss/reflected-dom-xss-8.avif)

El servidor nos devuelve una respuesta en formato JSON, donde en la parte inferior podemos observar el término de búsqueda que hemos colocado.

Podemos probar a intentar escaparnos del contexto del JSON en este caso, por ejemplo, a intentar meter un `alert`:

![Payload de prueba inyectado en el parámetro de búsqueda](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-dom-xss/reflected-dom-xss-9.avif)

En la respuesta podemos observar como en principio parece que sin problemas podemos inyectar y escaparnos del JSON, ya que no hay ningún tipo de sanitización, por lo que, usando el payload de arriba, lo colocamos en la petición que dejamos en el proxy, y lo enviamos:

![Petición con payload XSS enviada desde el proxy](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-dom-xss/reflected-dom-xss-10.avif)

![Ejecución exitosa del alert mostrando XSS](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-dom-xss/reflected-dom-xss-11.avif)

De esta manera, conseguimos obtener un XSS y resolver el laboratorio:

![Mensaje de laboratorio resuelto satisfactoriamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-dom-xss/reflected-dom-xss-12.avif)

![Confirmación final de éxito del laboratorio](https://cdn.deephacking.tech/i/posts/portswigger-labs/reflected-dom-xss/reflected-dom-xss-13.avif)
