---
id: "como-funciona-el-ataque-clickjacking"
title: "Cómo funciona el ataque Clickjacking"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-28
updatedDate: 2022-03-28
image: "https://cdn.deephacking.tech/i/posts/como-funciona-el-ataque-clickjacking/como-funciona-el-ataque-clickjacking-0.webp"
description: "Explicación del ataque Clickjacking (UI redressing), cómo funciona mediante iframes invisibles para engañar a usuarios y realizar acciones no autorizadas, y cómo protegerse usando X-Frame-Options y Content Security Policy."
categories:
  - "web"
draft: false
featured: false
lang: "es"
---

Clickjacking (o también UI redressing) es un ataque web por el cual un atacante, a través de ingeniería social o phishing, consigue que una víctima realice acciones no autorizadas de forma legítima. Por ejemplo, a través de este ataque un atacante puede ocasionar que una víctima envíe dinero sin que lo sepa, siendo la misma víctima, la que da click a enviar.

Índice:

- [Introducción](#introducción)
- [Clickjacking](#clickjacking)
- [Cómo evitar el Clickjacking](#cómo-evitar-el-clickjacking)
    - [X-Frame-Options](#x-frame-options)
    - [Content-Security-Policy](#content-security-policy-csp)
- [Referencias](#referencias)

## Introducción

Lo primero de todo es entender lo que es un iframe. Básicamente, es un elemento de HTML que permite incrustar una web dentro de otra (formalmente hablando, permite incrustar un documento HTML dentro de un documento HTML principal). Por ejemplo, con el siguiente código:

![Código HTML mostrando un iframe básico](https://cdn.deephacking.tech/i/posts/como-funciona-el-ataque-clickjacking/como-funciona-el-ataque-clickjacking-1.avif)

Conseguimos incrustar Deep Hacking en nuestro pequeño server local:

![Iframe mostrando Deep Hacking dentro de una página local](https://cdn.deephacking.tech/i/posts/como-funciona-el-ataque-clickjacking/como-funciona-el-ataque-clickjacking-2.avif)

El pequeño `<iframe>`, es la propia web totalmente funcional, puedes navegar perfectamente por el blog sin ningún problema como si estuvieras de verdad en el mismo. Eso sí, puedes pensar, ok, pero es una ventana xiquita, que mierda es esta. Y no te falta razón, por eso, si le metemos un poco de CSS al código:

![Código HTML del iframe con estilos CSS para pantalla completa](https://cdn.deephacking.tech/i/posts/como-funciona-el-ataque-clickjacking/como-funciona-el-ataque-clickjacking-3.avif)

![Resultado del iframe a pantalla completa mostrando Deep Hacking](https://cdn.deephacking.tech/i/posts/como-funciona-el-ataque-clickjacking/como-funciona-el-ataque-clickjacking-4.avif)

Bualá. Tenemos el blog como si estuviéramos en el oficial, ya no solo funcionalmente, sino también estéticamente.

Aquí entra un detalle importante, en los `<iframe>`, también cargan las cookies que tengas almacenadas sobre la página en cuestión. Esto quiere decir que si tengo la sesión del blog guardada en el navegador, al cargar en el `<iframe>`, estaré logueado en mi sesión, por lo que cualquier cambio que yo haga en el `<iframe>`, será como si lo hiciese desde el blog normal.

Volviendo al ejemplo del banco, si yo tengo la sesión guardada de mi cuenta, y visito una web que carga en un `<iframe>` la web del banco, en el `<iframe>` estaré logueado con mi cuenta, por lo que cualquier acción llevada a cabo desde el `<iframe>`, será como si lo hiciese desde la web original.

Sabiendo esto, vamos a ver el Clickjacking y cuál es la idea del ataque.

## Clickjacking

Se podría decir que el Clickjacking es un ataque que funciona por capas:

![Diagrama mostrando las capas del ataque Clickjacking desde el punto de vista del atacante](https://cdn.deephacking.tech/i/posts/como-funciona-el-ataque-clickjacking/como-funciona-el-ataque-clickjacking-5.avif)

Viendo esto puede estar pensando: ok, pero aquí hay varias cosas que no tienen sentido:

- ¿Por qué el atacante debe de hacer una web personalizada?
- Si la web del `<iframe>` va por encima, ¿qué sentido tiene poner una web debajo? Si no se va a estar viendo.

Lo que ocurre es que el `<iframe>`, aunque esté ahí, va a ser totalmente invisible, y esto se consigue con CSS. De esta forma, lo que el atacante creará en la web personalizada, será un elemento colocado totalmente estratégico para que el usuario de click en algún sitio concreto del `<iframe>`.

Veamos un ejemplo para que se vea más claro:

<figure>

![Interfaz de web bancaria mostrando formulario de transferencia](https://cdn.deephacking.tech/i/posts/como-funciona-el-ataque-clickjacking/como-funciona-el-ataque-clickjacking-6.avif)

<figcaption>

La URL correspondería al del `<iframe>`, no a la web en la que la víctima entra

</figcaption>

</figure>

<figure>

![Web falsa ofreciendo ganar un iPhone gratis](https://cdn.deephacking.tech/i/posts/como-funciona-el-ataque-clickjacking/como-funciona-el-ataque-clickjacking-7.avif)

<figcaption>

Esta URL si corresponde a la de la web donde la víctima entra

</figcaption>

</figure>

Estas son las dos webs que habrá, una por encima de la otra. Lo que ocurre es que siempre que interactuemos, será con la web que esté por encima. Por lo que, pongámonos en situación:

- La capa que el usuario verá, será la de ganar el nuevo iPhone, ya que a la otra, le indicaremos mediante CSS, opacidad 0 (que sea invisible).
- La capa que estará por encima, y con la que se interactúa dando cualquier click, será la del banco.

Si el botón del iPhone lo colocamos justamente en el mismo lugar que el de confirmar la transacción, cuando el usuario de click a ganar el iPhone, realmente le estará dando a confirmar transacción, y, como en el `<iframe>` carga las cookies que tenga almacenadas el usuario, la transacción se hará con su cuenta.

Y realmente esta es la idea del Clickjacking, hacer pensar al usuario que está dando click en una cosa, cuando realmente le está dando a otra, y si, por si lo estabas pensando, uno de los requisitos de este ataque es que el usuario no cierre sesión en los sitios y, por tanto, tenga almacenadas las cookies de sesión de la web donde queramos que realice una acción, en este caso por ejemplo, la del banco.

## Cómo evitar el Clickjacking

Ahora bien, yo soy propietario de una web, y quiero evitar que esto ocurra, o estoy en un pentest y quiero escribir cómo remediar este ataque. ¿Qué hago?

Pues, existen dos posibles mecanismos para solucionar esto, el `X-Frame-Options` y el `Content Security Policy` (CSP).

##### X-Frame-Options

El `X-Frame-Options` es una cabecera HTTP que el servidor web puede incluir en su respuesta, y, dependiendo del valor que tenga, el navegador web permitirá que el `<iframe>` cargue o no. Los tres posibles valores para esta cabecera son:

- `X-Frame-Options: deny` --> No permitirá que en ningún caso, la web pueda ser incrustada en un `<iframe>`.
- `X-Frame-Options: sameorigin` --> Solo permitirá que las webs que sean del mismo origen, puedan incrustar la web. El concepto de origen se explica en el artículo de [Same Origin Policy](https://blog.deephacking.tech/es/posts/que-es-el-same-origin-policy-sop/).
- `X-Frame-Options: allow from <url>` --> En el caso de que queramos permitir que una web de un origen distinto, pueda cargar en un `<iframe>` nuestra web, lo indicaremos con esta cabecera.

Ejemplo de respuesta HTTP que tiene implementada esta cabecera:

![Respuesta HTTP mostrando la cabecera X-Frame-Options](https://cdn.deephacking.tech/i/posts/como-funciona-el-ataque-clickjacking/como-funciona-el-ataque-clickjacking-8.avif)

##### Content Security Policy (CSP)

El `Content Security Policy` es otra cabecera HTTP que el servidor puede incluir para evitar que la web pueda ser incrustada en un `<iframe>`. Esta cabecera en concreto no se limita a proteger solo contra Clickjacking, pero si que tiene atributos concretos para ello:

- `Content-Security-Policy: frame-ancestors 'none';` --> Es el equivalente a `X-Frame-Options: deny`
- `Content-Security-Policy: frame-ancestors 'self';` --> Es el equivalente a `X-Frame-Options: sameorigin`
- `Content-Security-Policy: frame-ancestors <dominio>;` --> Es el equivalente a `X-Frame-Options: allow from <url>`

Una pequeña diferencia de esta cabecera respecto a `X-Frame-Options`, es que CSP es más flexible, en el sentido de que admite colocar varios dominios si queremos permitir varios orígenes, e incluso usar asteriscos. Por ejemplo, esto sería totalmente válido:

- `Content-Security-Policy: 'self' https://web.com https://*.ejemplo-web.com`

> Al igual que ahora sabemos que estas dos cabeceras protegen ante este ataque, de la misma forma, sabemos que la falta de implementación de estas, hará la web vulnerable. Por lo que sabemos cómo detectarlo y defendernos al mismo tiempo.

## Referencias

- [Protección contra Clickjacking usando Content Security Policy en PortSwigger](https://portswigger.net/web-security/cross-site-scripting/content-security-policy#protecting-against-clickjacking-using-csp)
- [Clickjacking (UI redressing) en PortSwigger](https://portswigger.net/web-security/clickjacking)
