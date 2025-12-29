---
id: "que-es-el-same-origin-policy-sop"
title: "Qué es el Same Origin Policy (SOP)"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-07
updatedDate: 2022-03-07
image: "https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-0.webp"
description: "Explicación detallada del Same Origin Policy (SOP), la política de seguridad implementada por los navegadores para prevenir la interacción entre recursos de diferentes orígenes, incluyendo ejemplos prácticos y excepciones."
categories:
  - "web"
draft: false
featured: false
lang: "es"
---

El Same Origin Policy es una política (valga la redundancia) de seguridad de aplicaciones web implementada por los navegadores, que previene/restringe la interacción con recursos de otro origen. Entendiéndose por esta interacción, que se obtenga o establezca propiedades de un recurso de origen diferente.

Sé que así dicho, puede no llegar a entenderse. Pero vamos a ir viendo diferentes puntos poco a poco de cara a tener una visión completa y así poder entender que es y como nos afecta esta política.

Índice:

- [¿Qué es el Origen?](#qué-es-el-origen)
- [¿Qué permite y qué bloquea el SOP?](#qué-permite-y-qué-bloquea-el-sop)
- [Excepciones del SOP](#excepciones-del-sop)
    - [window.location](#windowlocation)
    - [document.domain](#documentdomain)
    - [Cross Window Messaging](#cross-window-messaging)
- [Laboratorio de Pruebas](#laboratorio-de-pruebas)
    - [Ejemplo 1 - Mismo Origen](#ejemplo-1--mismo-origen)
    - [Ejemplo 2 - Distinto Origen](#ejemplo-2--distinto-origen)
- [¿Y sí... no existiera el SOP?](#y-sí-no-existiera-el-sop)
- [Vamos a ver si ha quedado claro](#vamos-a-ver-si-ha-quedado-claro)
    - [Ejercicio 1](#ejercicio-1)
    - [Ejercicio 2](#ejercicio-2)
    - [Ejercicio 3](#ejercicio-3)
    - [Ejercicio 4](#ejercicio-4)
    - [Soluciones UwU](#soluciones-uwu)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

Mini recomendación: Para entender mejor este post, lo suyo es tener una mini base del DOM y Javascript. Si no, pues simplemente si ves que no entiendes algo, googléalo para ver para qué sirve o únete al [servidor de Discord](https://discord.gg/ZpYQn55DJV) y pregunta ^^.

## ¿Qué es el Origen?

Cuando hablamos del origen de un recurso, es la combinación de:

- **Protocolo + Host + Puerto**

Se entiende de forma sencilla con el ejemplo que vamos a ver ahora. Vamos a hacer las comparaciones para la URL:

- `http://deephacking.tech/flag`
    - Protocolo: HTTPS
    - Host: deephacking.tech
    - Puerto: 443

Ejemplos:

- `http://deephacking.tech/artiQLAZO` --> Si tiene el mismo origen, ya que tanto el protocolo, como el host y el puerto, son el mismo.
- `https://dev.deephacking.tech/flag` --> No tiene el mismo origen, porque a pesar de que el protocolo y el puerto si coincide, el host no.
- `http://deephacking.tech:8080/flag` --> No tiene el mismo origen, ya que, a pesar de que el protocolo y host si coincide, el puerto no.
- `http://deephacking.tech/flag` --> No tiene el mismo origen, puesto que, a pesar de que el host y el puerto coincide, el protocolo no (Aunque realmente el puerto también sería distinto porque al ser HTTP sería 80 en vez de 443, pero vamos a olvidarnos de ese detalle en este caso).
- `http://colddsecurity.com:69` --> Esto ya creo que se predice. Pero este, para nada sería el mismo origen jeje.

Como curiosidad, el código que se ejecute desde páginas como `about:blank` o `javascript:`, heredan el origen desde donde se invocan. Por ejemplo, si ejecutas un script que te abra una nueva ventana `about:blank`, esta ventana heredará el origen que tenga el script que la ha generado.

## ¿Qué permite y qué bloquea el SOP?

Ya tenemos la definición del origen. Volviendo al SOP (Same Origin Policy), lo que hace entonces esta política es que bloquea el acceso a recursos de orígenes distintos. Podría decirse que la regla principal del SOP es:

> Un documento puede acceder (a través de Javascript) a las propiedades de otro documento si ambos tienen el mismo origen.
> 
> PD: Cuando nos referimos a "documento" estamos hablando de una página HTML, un iframe incluido en un HTML, o una petición AJAX.

Siendo un poco más precisos, el navegador siempre hará la petición que se le dice que haga sin importar el origen que sea, sin embargo, el que se pueda leer la respuesta, ahí es donde aplica lo que entendemos/entenderemos por SOP, por lo que, el SOP no previene la realización de peticiones a otros orígenes, pero si previene la lectura de la respuesta de una petición hecha a otro origen.

Otro detalle, es que el SOP solo aplica cuando las consultas son generadas desde el lado del cliente, no el servidor. Dicho esto, un par de ejemplos del SOP:

- Tú puedes crear un `<iframe>` que haga referencia a otro origen (si el otro origen lo permite). Pero, tú no puedes acceder ni editar el contenido si no se trata del mismo origen.
- En una petición AJAX (XmlHTTPRequest) no podrás obtener la respuesta de la petición si se hace a un origen distinto.

Esto son un par de ejemplos clásicos. Sin embargo, vamos a ver como se comporta con otros elementos:

- CSS --> Se puede traer un archivo CSS de otro origen usando el elemento `<link>` o importando directamente en un archivo CSS.
- Images --> Incrustar imágenes de otros orígenes está totalmente permitido. De hecho, este en concreto lo vemos constantemente cuando compartimos por ejemplo un vídeo de YT o un post por alguna red social. Eso si, la lectura de imágenes de otro origen está bloqueado, por ejemplo, colocar una imagen de otro origen en un canvas de nuestra web usando JavaScript estará bloqueado.
- Scripts --> También se permite cargar archivos Javascript de otros orígenes. Sin embargo, esto no bypasea las restricciones del SOP a ciertas APIs, como por ejemplo, el hacer una petición HTTP mediante `fetch()` o `XMLHttpRequest()` a otro origen. Se seguirán bloqueando este tipo de cosas.
- Forms --> Se pueden usar URLs de otro origen en el atributo `action` de un form.
- Multimedia --> Al igual que las imágenes, cualquier contenido ya sea video o audio puede ser traídos con sus respectivos elementos, `<audio>` y `<video>`.

## Excepciones del SOP

Además del comportamiento del SOP ante ciertos elementos como acabamos de ver, siguen existiendo algunas excepciones para otros:

##### window.location

Esta propiedad sirve para obtener la URL de un documento o para cambiarla, cuando la cambiamos, realmente hacemos una redirección a la web que indicamos, a través de una petición GET.

Sabiendo ya su funcionalidad, un documento siempre podrá escribir en la propiedad `location` de otro documento.

Por ejemplo, si en nuestra web tenemos un `<iframe>` que nos trae `https://google.com`, nosotros podemos cambiar con esta propiedad la URL del `<iframe>` y que se actualice y nos traiga otra web. A pesar de que la que estaba antes, fuese de otro origen. De la misma forma, si en el `<iframe>` cargamos una web, y su código ejecuta una instrucción la cual cambia la propiedad `location` de la web que contiene el `<iframe>`, también funcionará.

En este caso, esto último se puede hacer siempre, sea o no el mismo origen, ahora bien, otra cosa muy distinta es obtener la propiedad `location` actual si es de origen distinto, eso no podríamos. Podríamos editarlo y cambiarlo por otro, pero no podríamos leerlo.

Ejemplo de intentar leer la propiedad:

![Ejemplo de intento de lectura de la propiedad location bloqueada por SOP](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-1.avif)

Nos dice Restricted. Si intentáramos lo mismo, pero con un `<iframe>` de una web del mismo origen que nosotros, no habría ningún problema:

![Lectura exitosa de la propiedad location con mismo origen](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-2.avif)

Ahora, volviendo al caso donde nuestro `<iframe>`, traía "deephacking.tech" si intentamos cambiar la propiedad aunque no podamos leerla:

![Cambio exitoso de la propiedad location aunque no se pueda leer](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-3.avif)

Vemos que no hay ningún tipo de problema, como hemos dicho, podemos editar siempre, pero no leer. Eso si, la edición también tiene alguna limitación, un documento siempre puede actualizar la propiedad `location` de otro documento si ambos recursos tienen alguna relación, como por ejemplo:

- Un documento está incrustado en el otro por un `<iframe>` (Lo que hemos visto arriba)
- Un documento ha sido abierto por el otro a través de `window.open` (DOM API).

##### document.domain

Esta propiedad nos dice el host de origen del documento actual, por ejemplo:

- `http://dev.deephacking.tech/index.html`

La salida del uso de `document.domain` sería:

- `dev.deephacking.tech`

Ejemplo:

![Ejemplo de uso de document.domain mostrando el host](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-4.avif)

Un documento puede cambiar parcialmente su propio origen usando este propiedad. Digo parcialmente porque no la puede cambiar como quieras. Usemos el ejemplo de HackTheBox para explicarlo. HackTheBox tiene los dos siguientes dominios:

- `academy.hackthebox.com`
- `app.hackthebox.com`

Pongámonos en el caso donde, `academy.hackthebox.com` incluye en su web, mediante un `<iframe>` a `app.hackthebox.com`.

Podrá hacerlo sin problemas, por esa parte perfecto. Ahora bien, pongamos ahora que `academy.hackthebox.com` ejecuta un código Javascript para cambiar el contenido del `<iframe>` de `app.hackthebox.com`.

Como ya sabremos, ambos no tienen el mismo origen porque su hostname no es el mismo, por lo que hacer esta acción que comentamos, no será posible. Sin embargo, aquí es donde entra en juego la propiedad de `document.domain`.

Una web puede cambiar siempre su hostname a uno de mayor jerarquía, exceptuando el TLD (Top Level Domain) como puede ser `.com`, `.es`, `.net`, `.tech`, etc etc. Y me refiero cambiarlo a nivel de como se percibe. Siguiendo esto, veamos como es a nivel práctico estando en el dominio `app.hackthebox.com`:

![Ejemplo de cambio de document.domain a jerarquía superior](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-5.avif)

Como vemos, ocurre lo dicho arriba, podemos cambiarlo a uno de jerarquía mayor, siempre y cuando no sea el TLD. Por lo que, sabiendo esto, volviendo al caso donde nos encontrábamos que `academy.hackthebox.com` quiere cambiar el contenido del `<iframe>` que incrusta a `app.hackthebox.com`. Esta acción solo será posible, si ambas web, cambian su `document.domain` a `hackthebox.com`, ya que, ahora sí que se considerará que tienen el mismo origen (porque el protocolo y puerto también coinciden, solo fallaba el hostname).

##### Cross Window Messaging

HTML5 permite a iframes, frames, popups y ventanas actuales comunicarse entre sí independientemente del SOP, esto es lo que se conoce como Cross Window Messaging. Esta característica permite que dos ventanas intercambien mensajes siempre y cuando tengan algún tipo de relación entre sí, como puede ser:

- Que una ventana tenga un `<iframe>` incrustado. Por lo tanto, existe una relación entre la ventana y el `<iframe>`, ambas se podrían comunicar.
- Que una ventana genere un popup. Por lo tanto, existe una relación entre la ventana y el popup, y también se podrían comunicar.

Eso si, para poder intercambiar mensajes, cada parte de la relación debe de estar configurada para ello, ya sea para enviar, para recibir o ambas a la vez. Aquí, desde el punto de vista de la seguridad, hay que tener cuidado cuando la entidad que recibe, permite que el mensaje pueda provenir de cualquier origen, ya que, quizás una web que espera un mensaje, podríamos incrustarla mediante iframe en una web controlada por nosotros, y si la web incrustada no sanitiza el origen desde el cual acepta mensajes, nosotros desde nuestra web podríamos enviarle lo que quisiéramos.

Pd: Cuando se habla de recibir mensajes, a nivel visual y práctico, no es más que un evento:

```javascript
window.addEventListener('message', (event) => {
    console.log(`Received message: ${event.data}`);
});
```

## Laboratorio de Pruebas

Para ver ejemplos reales, vamos a usar el laboratorio de pruebas de "Carlos Azuax", el cual podéis encontrar en el [repositorio de GitHub azuax/pruebas-sop](https://github.com/azuax/pruebas-sop) para que os lo podáis montar vosotros también.

Otra guía que quizás os ayuda a montarlo es la [configuración de Apache Virtual Hosts en Ubuntu](https://ostechnix.com/configure-apache-virtual-hosts-ubuntu-part-1/).

Dicho esto, tenemos lo siguiente:

![Página principal del laboratorio de pruebas SOP](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-6.avif)

En este caso, solo vamos a ver los dos primeros ejemplos que son los que nos interesan.

#### Ejemplo 1 - Mismo Origen

![Ejemplo 1 del laboratorio mostrando mismo origen](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-7.avif)

Código fuente:

![Código fuente del ejemplo 1 con iframe del mismo origen](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-8.avif)

Como podemos observar, nos encontramos en la URL:

- `http://uno.local/ejemplo1.html`

Y en el código, estamos creando un `<iframe>` de:

- `http://uno.local/ejemplo1-iframe.html`

El cual es el que vemos en la imagen:

![Contenido del iframe en el ejemplo 1](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-9.avif)

Hasta aquí guay. Vemos que nos carga sin problemas el contenido del archivo `ejemplo1-iframe.html`.

Por ahora, todo normal, ya que, hablando en contexto general, podemos cargar mediante un `<iframe>` cualquier web siempre y cuando esta lo permita.

Ahora bien, otra cosa muy distinta y es donde aplica el SOP. Es que podamos modificar el contenido de un origen distinto al nuestro. Echándole un vistazo al código fuente:

![Código JavaScript del botón para modificar el iframe](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-10.avif)

![Botón para intentar modificar el contenido del iframe](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-11.avif)

Vemos como si pulsamos el botón. La acción que se INTENTARÁ efectuar es la de cambiar el contenido del `<iframe>` por, en este caso, la frase: "Contenido modificado!".

Estamos en la URL:

- `http://uno.local/ejemplo1.html`

Y queremos cambiar el contenido del `<iframe>` que proviene de la URL:

- `http://uno.local/ejemplo1-iframe.html`

Como hemos visto al principio del post, podemos identificar fácilmente, que ambos tienen el mismo origen. Por lo que no deberíamos de tener ningún problema a la hora de editar el contenido del `<iframe>`, que... OJO, obviamente no estamos editando el contenido original, solo el del `<iframe>`.

Vamos a comprobarlo:

![Presionando el botón para modificar el iframe](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-12.avif)

![Iframe modificado exitosamente mostrando el nuevo contenido](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-13.avif)

Como vemos, se modifica sin problemas. Ya que ambas URL son del mismo origen.

#### Ejemplo 2 - Distinto Origen

![Ejemplo 2 del laboratorio mostrando distinto origen](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-14.avif)

Código fuente:

![Código fuente del ejemplo 2 con iframe de distinto origen](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-15.avif)

En este caso, la URL en la que nos encontramos es:

- `http://uno.local/ejemplo2.html`

Y estamos cargando un `<iframe>` de:

- `http://dos.local/ejemplo2-iframe.html`

OJO, como somos unos máquinas, ya nos habremos dado cuenta de que en este caso, estas dos URL no tienen el mismo origen porque cambia el host.

Aun así, el `<iframe>` carga sin problemas:

![Iframe de distinto origen cargando sin problemas](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-16.avif)

Que es básicamente, lo que hemos hablado en el Ejemplo 1:

> "Por ahora, todo normal, ya que, hablando en contexto general, podemos cargar mediante un `<iframe>` cualquier web siempre y cuando esta lo permita."
> 
> Q si, q lo llevo diciendo todo el pto post, pero mejor que quede claro y no nos confundamos.

Este ejemplo, es exactamente igual que el ejemplo 1. Sin embargo, en este caso, cuando pulsemos el botón, se intentará editar el contenido de un `<iframe>` cuyo origen es distinto al de la web que lo incrusta:

![Código del botón que intenta modificar iframe de distinto origen](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-17.avif)

Vamos a comprobar que ocurre si no es del mismo origen:

![Presionando el botón para modificar iframe de distinto origen](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-18.avif)

![Error de SOP bloqueando la modificación de iframe de distinto origen](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-19.avif)

Pues vemos que nos salta un error, y es por el Same Origin Policy.

## ¿Y sí... no existiera el SOP?

Si el SOP no existiera, se tensaría que te cagas, porque literalmente podríamos traernos una web mediante `<iframe>` (de nuevo, siempre y cuando la web nos deje xdddddddd). Y editar cualquier cosa. Por ejemplo, que cuando le des a enviar, la cuenta de destino se cambiase por la mía:

![Ejemplo de ataque modificando cuenta bancaria sin SOP](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-20.avif)

Por lo que, en definición: Podríamos traernos cualquier web y editarla con toda libertad. Esto no es que hiciese internet un poco menos seguro y tal, es que literalmente lo haría innavegable (y no solo por esto, esto es solo un ejemplo de algo que se podría hacer, pero hay infinidad de cosas mas, como que por ejemplo, tu al visitar una web maliciosa, esta tenga la capacidad de realizar una petición a la web de tu banco, y leer la respuesta, obteniendo así tu información. El SOP no previene que haga la petición, pero si previene que lea la respuesta, como se ha comentado al principio).

Aquí puedes decir, si bueno, pero es una ventana chica, ¿quién va a caer en eso?

Pues, es una ventana chica si lo hacemos cutre, pero si lo hacemos bien:

![Iframe a pantalla completa simulando la web real](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-21.avif)

Pues ya no lo es tanto. Imagínate que esto fuese la web de tu banco, no notarías ninguna diferencia más allá del dominio donde se aloje el `<iframe>`. Es por esto, que la existencia del SOP es superimportante en cuanto a seguridad web se refiere.

## Vamos a ver si ha quedado claro

Ahora vamos a ver 4 ejemplos donde veremos si te ha quedado claro el concepto, y si fallas, pues me debes un kebab.

Okno, fallar está bien, al igual que mirar Write Ups, lo importante es aprender. Volviendo al caso, vamos a ver 4 ejercicios y dejaré la solución al final, apúntate en un bloc de notas o algo si crees que se podría llevar a cabo con éxito el código que se muestra. PD: Estos ejercicios están sacados de la web de [web.dev](https://web.dev/same-origin-policy/).

##### Ejercicio 1

Tenemos en el dominio de `deephacking.tech`, el siguiente `<iframe>`:

```html
<iframe id="iframe" src="https://example.com/some-page.html" alt="Sample iframe"></iframe>
```

E incluimos el siguiente código:

```javascript
const iframe = document.getElementById('iframe');
const message = iframe.contentDocument.getElementById('message').innerText;
```

¿Se ejecutará con éxito la acción que estamos intentando hacer? Sí o No.

##### Ejercicio 2

Tenemos en el dominio de `deephacking.tech` el siguiente formulario:

```html
<form action="https://example.com/results.json">
  <label for="email">Enter your email: </label>
  <input type="email" name="email" id="email" required>
  <button type="submit">Subscribe</button>
</form>
```

¿Está permitido esto? Sí o No.

##### Ejercicio 3

Tenemos en el dominio `deephacking.tech` el siguiente `<iframe>`:

```html
<iframe src="https://example.com/some-page.html" alt="Sample iframe"></iframe>
```

¿Funcionará? Sí o No.

##### Ejercicio 4

Por último, pero no menos importante, tenemos en el dominio `deephacking.tech` el siguiente código:

```html
<canvas id="bargraph"></canvas>
```

Además, también está el siguiente código Javascript que intenta dibujar una imagen en el canvas:

```javascript
var context = document.getElementById('bargraph').getContext('2d');
var img = new Image();
  img.onload = function() {
  context.drawImage(img, 0, 0);
};
img.src = 'https://example.com/graph-axes.svg';
```

¿Conseguirá esta imagen dibujarse en el canvas? Sí o No.

##### Soluciones UwU

![Imagen de separación para evitar spoilers](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-22.avif)

Ok, esta imagen es para que no vieses las soluciones de refilón por si bajas demasiado rápido. Pongo otra por si acaso:

![Segunda imagen de separación para evitar spoilers](https://cdn.deephacking.tech/i/posts/que-es-el-same-origin-policy-sop/que-es-el-same-origin-policy-sop-23.avif)

Dicho esto, vamos con las soluciones:

- Ejercicio 1: Noup, no se puede, ya que estamos intentando leer información de un `<iframe>` cuyo origen es distinto al nuestro.
- Ejercicio 2: Siiiiipppp, porque como hemos dicho previamente, está totalmente permitido colocar en el atributo `action` de un form, una web que tenga un origen distinto.
- Ejercicio 3: Yeess!! Pero OJO, hay que tener cuidado, ya que dependerá de si la web que estamos intentando incrustar, nos deje o no. Realmente en el ejercicio 1 estaríamos en el mismo caso, pero no era el fin de ese ejercicio mencionar este detalle.
- Ejercicio 4: Depende. Este caso dependerá de la cabecera CORS que tenga la imagen, si lo permiten, guay, se puede, sino, lanzará un error.

## Conclusión

Sé que este concepto puede llegar a entenderse un poco de forma ambigua y demás, y no solo eso, no es sencillo de entender si nunca has tenido contacto con el DOM mediante Javascript. Pero al menos espero haber conseguido que no solo sepas que existe, sino que al menos tengas una idea básica.

De todas formas, en este post no hemos visto una de las cosas más importantes que a día de hoy va de la mano con el SOP, y es el CORS (Cross-site Resource Sharing), a este le dedicaré (o le habré dedicado si vienes del futuro) un post completo 👍.

## Referencias

- [Ejemplos de Same Origin Policy en YouTube](https://www.youtube.com/watch?v=bigahWcWtmA)
- [Same Origin Policy - SOP en YouTube](https://www.youtube.com/watch?v=0ooksSSszRU)
- [Same-origin policy en web.dev](https://web.dev/same-origin-policy/)
- [Web Application Penetration Testing en INE](https://my.ine.com/INE/courses/38316560/web-application-penetration-testing)
