---
id: "dom-xss-in-angularjs-expression"
title: "DOM XSS in AngularJS expression with angle brackets and double quotes HTML-encoded – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-04-05
updatedDate: 2022-04-05
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-0.webp"
description: "Aprende a explotar un DOM XSS en expresiones de AngularJS en PortSwigger Lab. Guía paso a paso para ejecutar JavaScript mediante expresiones de Angular cuando los corchetes angulares y comillas dobles están codificados en HTML."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio: "DOM XSS in AngularJS expression with angle brackets and double quotes HTML-encoded".

![Pantalla de inicio del laboratorio DOM XSS in AngularJS expression](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-1.avif)

En este caso, se nos indica que la web usa Angular, y que, además, existe un DOM based XSS en la funcionalidad de búsqueda. Para completar el laboratorio, tenemos que ejecutar la función `alert`.

Lo primero de todo es acceder al laboratorio:

![Página principal del laboratorio con formulario de búsqueda](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-2.avif)

Una vez accedidos, probamos la funcionalidad de búsqueda:

![Formulario de búsqueda con término de prueba](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-3.avif)

![Resultados de búsqueda mostrados en la página](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-4.avif)

En principio no se ve nada raro. Sin embargo, si miramos el código fuente:

![Código fuente HTML mostrando atributo ng-app en body](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-5.avif)

Podemos ver como en el `body` se establece un atributo el cual es `ng-app`. `Ng-app` es una directiva que se define un elemento raíz de Angular, y, por tanto, define que comienza la aplicación de Angular.

Claro, definiendo en el tag `body` de HTML que empieza la aplicación de Angular, en todo el código que haya dentro, se interpretará cualquier sentencia de Angular que se añada. Y gracias a la funcionalidad de búsqueda, podemos controlar un parámetro que se colocará dentro de la parte definida como aplicación de Angular.

Sabiendo esto, usaremos el payload `{{constructor.constructor('alert(1)')()}}`.

Vamos a explicar el payload:
- Los dobles corchetes sirven para que se trate como una expresión de Angular.
- El `constructor.constructor`, básicamente se interpreta igual que una función, es como si declarásemos una función y dentro de esta colocáramos el código que se ejecutará, pues aquí es exactamente lo mismo, dentro de los paréntesis, colocamos lo que queremos que se ejecute, en este caso un `alert(1)`.

Sabiendo esto, mandamos el payload mencionado, ya que recordemos que este se verá reflejado dentro de la parte que es declarada como Angular gracias al `ng-app`:

![Payload de AngularJS inyectado en el campo de búsqueda](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-6.avif)

Y, por lo tanto, se interpretará como hemos explicado y ejecutará:

![Ejecución exitosa del alert mediante expresión de AngularJS](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-7.avif)

![Mensaje de laboratorio resuelto satisfactoriamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-8.avif)

De esta forma, conseguimos resolver el laboratorio:

![Confirmación final de éxito del laboratorio](https://cdn.deephacking.tech/i/posts/portswigger-labs/dom-xss-in-angularjs-expression/dom-xss-in-angularjs-expression-9.avif)

Algunas referencias:
- [Object.constructor===Object.constructor.constructor explicado en StackOverflow](https://stackoverflow.com/questions/5963547/object-constructor-object-constructor-constructor-why)
- [Cómo funciona instance.constructor.constructor en JavaScript](https://stackoverflow.com/questions/65895494/what-is-instance-constructor-constructor-and-how-does-it-work)
- [Documentación de directivas AngularJS ng-app en Nielit](http://nielit.gov.in/gorakhpur/sites/default/files/Gorakhpur/OLEVEL_1_WPD_04_06_2020_IL.pdf)
