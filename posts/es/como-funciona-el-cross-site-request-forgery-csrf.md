---
id: "como-funciona-el-cross-site-request-forgery-csrf"
title: "Cómo funciona el Cross-site Request Forgery (CSRF / XSRF)"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-06-13
updatedDate: 2022-06-13
image: "https://cdn.deephacking.tech/i/posts/como-funciona-el-cross-site-request-forgery-csrf/como-funciona-el-cross-site-request-forgery-csrf-0.webp"
description: "Aprende cómo funciona el ataque Cross-site Request Forgery (CSRF), sus condiciones, ejemplos prácticos de explotación y las defensas principales como CSRF tokens y atributo SameSite."
categories:
  - "web"
draft: false
featured: false
lang: "es"
---

El Cross-site Request Forgery es un ataque web que obliga a un usuario a realizar acciones involuntarias por parte suya.

- [Proof of Concept (PoC)](#proof-of-concept-poc)
- [Defensas](#defensas)
- [Referencias](#referencias)

## Proof of Concept (PoC)

Por ejemplo, imaginémonos una situación donde nuestra web del banco, cada vez que nosotros cambiamos la contraseña. La petición del cambio es aproximadamente la siguiente:

```http
GET /account/password?nuevapassword=hola&confirmarpassword=hola HTTP/1.1
Host: elmejorbancodelmundo.com
Cookie: session=kpthbsztyeQgAPqeQ8gHgTVLYxyfsAfE
```

Como vemos, es una simple petición GET donde los parámetros del cambio se especifican en la URL, y el cambio en sí, se realiza a través de este método HTTP.

Ya mencionaremos que esto de por sí es una cagada y no debería de ser así, pero hasta entonces, vamos a aceptar que es de esta forma para explicar el concepto del CSRF.

Ahora, el problema realmente viene cuando el usuario no cierra sesión en el sitio web, es decir, la cookie de la sesión la mantiene almacenada el navegador para cuando se acceda al sitio web correspondiente.

Que ocurre, si el usuario accede a una web (ej: fotossensibles.com) la cual en el código HTML hay declarada una acción como puede ser realizar una petición GET a:

- El dominio de `elmejorbancodelmundo.com`
- Con la ruta `/account/password`
- Y con los parámetros `?nuevapassword=cagaste&confirmarpassword=cagaste`

Un ejemplo de plantilla HTML maliciosa sería:

```html
<html>
    <body>
        <form action="https://elmejorbancodelmundo.com/account/password?nuevapassword=cagaste&confirmarpassword=cagaste" method="GET">
        </form>
        <script>
            document.forms[0].submit()
        </script>
    </body>
</html>
```

> Nota: este código HTML aunque haga lo que queremos que haga, no es lo más óptimo porque redirigirá al usuario a la web del cambio de contraseña. Y el mismo usuario podrá ver que ha sido redirigido y que su contraseña acaba de cambiar. Para hacerlo en "segundo plano" podríamos hacer uso de por ejemplo, un iframe.

El navegador del usuario, al recibir este código HTML de fotossensibles.com, lo interpretará para mostrarle el contenido al usuario. Sin embargo, al interpretarlo, el mismo navegador ejecutará esta acción declarada en el código y hará una petición GET a:

- `elmejorbancodelmundo.com/account/password?nuevapassword=cagaste&confirmarpassword=cagaste`

Y claro, al tener la cookie almacenada de elmejorbancodelmundo.com, el navegador la añadirá a la petición que hace, esto conllevará que se cambie la contraseña de la cuenta del usuario y todo sin la autorización del mismo.

De forma gráfica, lo que está ocurriendo es lo siguiente:

<figure>

![Diagrama explicativo del ataque CSRF mostrando la interacción entre el usuario, el sitio malicioso y el sitio legítimo](https://cdn.deephacking.tech/i/posts/como-funciona-el-cross-site-request-forgery-csrf/como-funciona-el-cross-site-request-forgery-csrf-1.avif)

<figcaption>

Perdonadme, no sé dibujar mejor

</figcaption>

</figure>

A nivel conceptual de esto trata el CSRF.

Esto, como se ha dicho antes, es solo un ejemplo para entender el concepto de la vulnerabilidad. Ya que, el primer fallo de este ejemplo es que no se debe permitir realizar cambios mediante el método GET, es un estándar, siempre que se deba enviar datos o realizar cambios en una web, debe ser por POST.

Aun así, el hecho de que sea por POST tampoco evita que se produzca el ataque. Las tres principales condiciones que se deben cumplir para que ocurra un CSRF son:

- Acción relevante
- Cookie de sesión almacenada
- Que no haya parámetros impredecibles

Teniendo en cuenta estas condiciones y aplicándolas al ejemplo de arriba, quedaría tal que:

- La acción relevante era que podíamos cambiar la contraseña
- El usuario tenía almacenada la cookie del banco porque no había cerrado sesión en el sitio
- Todos los parámetros de la petición son predecibles

Las dos primeras condiciones se pueden entender fácilmente y verle la lógica, aun así, sobre la segunda condición hay algunos detalles de los cuales hablar, y la tercera, se entenderá mejor cuando hablemos más adelante del Token CSRF.

## Defensas

Básicamente, la forma de evitar este ataque es haciendo uso de parámetros que sean totalmente impredecibles para el atacante, y esto es lo que se conoce como CSRF Token. El CSRF Token es un valor único, secreto e impredecible que se envía en la misma petición que el cambio, por lo que, el atacante no será capaz de crear una plantilla/código HTML el cual envíe esta petición, por el simple hecho, de que el atacante no conoce el valor del CSRF Token para que el servidor acepte la petición. Para entender esto último mejor, vamos a ver como sería el ejemplo de arriba, pero mediante una petición POST:

```http
GET /account/password HTTP/1.1
Host: elmejorbancodelmundo.com
Cookie: session=kpthbsztyeQgAPqeQ8gHgTVLYxyfsAfE

nuevapassword=cagaste&confirmarpassword=cagaste
```

Una ejemplo de plantilla HTML para esta petición sería:

```html
<html>
    <body>
        <form action="https://elmejorbancodelmundo.com/account/password" method="POST">
            <input type="hidden" name="nuevapassword" value="cagaste" />
            <input type="hidden" name="confirmarpassword" value="cagaste" />
        </form>
        <script>
            document.forms[0].submit()
        </script>
    </body>
</html>
```

Esto funcionaría de la misma forma que lo anteriormente expuesto, cambiando solo que la petición en vez de ser GET sería POST. Ahora bien, que ocurre si el servidor, además de los datos proporcionados arriba, espera un CSRF Token, es decir, que la petición fuera la siguiente:

```http
GET /account/password HTTP/1.1
Host: elmejorbancodelmundo.com
Cookie: session=kpthbsztyeQgAPqeQ8gHgTVLYxyfsAfE

nuevapassword=cagaste&confirmarpassword=cagaste&csrf=APqeQ8gHgTVLYxyfsAfEsztyeQgkpthb
```

Si el servidor recibiese la petición de cambio de contraseña con el parámetro de CSRF la aceptaría. Ahora bien, de cara al atacante, a la hora de crear la plantilla, no tiene ni idea del valor CSRF, porque es un valor que va cambiando, por lo que le sería imposible generar una plantilla HTML que incluya el valor correcto del token CSRF, de esta manera, se impide este ataque.

Además de que sea impredecible, el CSRF Token debe:

- Estar asociado a la sesión del usuario
- Validarse completamente antes de realizar la acción

Otro defensa que se podría añadir es el atributo `SameSite` en las cookies, este atributo de las cookies permite controlarlas en las peticiones de sitios cruzados. Con este atributo, dependiendo de como esté configurado, quizás es posible evitar que el navegador añada las cookies a la petición que hace la web maliciosa (o cualquier otra web que no sea la del banco en este caso). Este atributo tiene 3 posibles valores:

- `None` --> Deshabilitado simplemente, es él por defecto
- `Strict` --> El navegador no incluirá en ninguna petición la cookie que tenga este valor en el atributo `SameSite`
- `Lax` --> El navegador incluirá en las peticiones las cookies que tengan este valor solo si se cumplen los dos siguientes requisitos:
    - La petición usa el método GET
    - La petición es originada por una interacción del usuario como hacer click a un link. Si es generada por un código no se incluirá la cookie

Y lo dicho, esto sería una posible capa de defensa adiciona al CSRF Token.

Por último, te puedes preguntar, ¿en qué momento, el cliente legítimo conoce el valor del CSRF Token, en que momento hay un intercambio de información donde el cliente recibe este valor para posteriormente añadirlo a la petición que hace al servidor?

Pues por lo general, este valor se encuentra en el código fuente de la web, puede estar en la parte del formulario correspondiente o en cualquier sitio del código fuente, ejemplo:

<figure>

![Ejemplo de CSRF Token en el código fuente de LinkedIn mostrando el campo csrfToken](https://cdn.deephacking.tech/i/posts/como-funciona-el-cross-site-request-forgery-csrf/como-funciona-el-cross-site-request-forgery-csrf-2.avif)

<figcaption>

LinkedIn

</figcaption>

</figure>

Por lo que, en muchas ocasiones, es posible concatenar XSS y CSRF para hacer cositas chulas x).

Ahora si, para finalizar del todo, ejemplo de una plantilla HTML maliciosa usando un `iframe` para que como se mencionaba al principio, se haga todo, en "segundo plano":

```html
<html>
    <body>
        <iframe style="display:none" name="csrf-iframe"></iframe>
        <form action="https://elmejorbancodelmundo.com/account/password" method="POST" id="csrf-form" target="csrf-iframe">
            <input type="hidden" name="nuevapassword" value="cagaste" />
            <input type="hidden" name="confirmarpassword" value="cagaste" />
        </form>
        <script>
            document.getElementById("csrf-form").submit()
        </script>
    </body>
</html>
```

## Referencias

- [Cómo pasar el token CSRF del servidor al cliente en Stack Overflow](https://stackoverflow.com/questions/50732159/how-to-pass-csrf-token-from-server-to-client)
- [Entendiendo CSRF en Stack Overflow](https://stackoverflow.com/questions/2581488/understanding-csrf)
- [Cross-site Request Forgery en IITBreachers Wiki](https://csea-iitb.github.io/IITBreachers-wiki/2020/07/22/CSRF.html)
- [CSRF tokens en PortSwigger Web Security](https://portswigger.net/web-security/csrf/tokens)
- [Cómo se correlaciona CSRF con Same Origin Policy en Stack Exchange Security](https://security.stackexchange.com/questions/157061/how-does-csrf-correlate-with-same-origin-policy)
- [Same-origin policy en PortSwigger Web Security](https://portswigger.net/web-security/cors/same-origin-policy)
- [Por qué Same-origin policy no es suficiente para prevenir ataques CSRF en Stack Overflow](https://stackoverflow.com/questions/33261244/why-same-origin-policy-isnt-enough-to-prevent-csrf-attacks)
- [Same Origin Policy en AppSecMonkey](https://www.appsecmonkey.com/blog/same-origin-policy)
