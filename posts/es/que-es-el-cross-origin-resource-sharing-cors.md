---
id: "que-es-el-cross-origin-resource-sharing-cors"
title: "Qué es el Cross-Origin Resource Sharing (CORS)"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-05-09
updatedDate: 2022-05-09
image: "https://cdn.deephacking.tech/i/posts/que-es-el-cross-origin-resource-sharing-cors/que-es-el-cross-origin-resource-sharing-cors-0.webp"
description: "Explicación detallada del Cross-Origin Resource Sharing (CORS), sus cabeceras HTTP, funcionamiento y posibles vulnerabilidades de configuración en aplicaciones web."
categories:
  - "web"
draft: false
featured: false
lang: "es"
---

El CORS (Cross-Origin Resource Sharing) es una extensión del SOP (Same Origin Policy), si no sabes de qué se trata este último, [tienes un post aquí en el blog que te lo explica](https://blog.deephacking.tech/es/posts/que-es-el-same-origin-policy-sop/), mejor que lo leas antes de seguir con este.

Índice:

- [Entendiendo el CORS](#entendiendo-el-cors)
- [Posibles vulnerabilidades](#posibles-vulnerabilidades)
- [Convivencia entre el CORS y el SOP](#convivencia-entre-el-cors-y-el-sop)
- [Referencias](#referencias)

## Entendiendo el CORS

Ahora bien, si ya conoces como funciona el SOP, sabrás que es un mecanismo de seguridad bastante restrictivo, y es por ello que se creó el CORS, una funcionalidad que permite extender esta limitación a la hora de establecer una comunicación entre dos entidades de orígenes distintos.

El CORS nos permite configurar el SOP para que no aplique si se cumple ciertas condiciones, en otras palabras, gracias al CORS tenemos la posibilidad de configurar un servidor para que un cliente de otro origen pueda comunicarse con él sin problemas. Dicho de forma sencilla:

> Habilita las peticiones de origen cruzado del lado del cliente

A nivel conceptual y teórico si, muy bonito todo, pero a nivel práctico, ¿qué es, cómo lo identifico?.

Básicamente, el CORS son unas cabeceras HTTP que el servidor añade desde su lado, para dejar constancia de lo que permite y lo que no. En concreto, las dos cabeceras relacionadas con el CORS, son:

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Credentials`

La primera cabecera, la `Access-Control-Allow-Origin` indica con que origen puede ser compartida la respuesta:

![Cabecera Access-Control-Allow-Origin en respuesta HTTP](https://cdn.deephacking.tech/i/posts/que-es-el-cross-origin-resource-sharing-cors/que-es-el-cross-origin-resource-sharing-cors-1.avif)

Por ejemplo, pongámonos en el caso en el que yo visito la Web A. Al visitar la Web A, esta realiza una petición a la Web B. La Web B devolverá la respuesta a nuestro navegador, ahora bien, aquí, en este punto es donde el navegador al recibir la petición dice:

- Okay, la Web B me dice en su respuesta que puedo compartirla con la Web A.

Por lo tanto, la Web A recibe la respuesta de la petición que hizo sin problemas, y puede leerla perfectamente.

OJO, como se ha explicado, aquí el SOP no actúa, ya que el CORS está definido de forma que favorece la comunicación entre ambos orígenes, aunque sean distintos.

Ahora bien, pongámonos en el caso en el que la Web B, no coloca la cabecera `Access-Control-Allow-Origin`:

![SOP bloqueando petición sin cabecera CORS](https://cdn.deephacking.tech/i/posts/que-es-el-cross-origin-resource-sharing-cors/que-es-el-cross-origin-resource-sharing-cors-2.avif)

Aqui, de nuevo, yo visito la Web A. Al visitar la Web A, esta realiza una petición a la Web B. La Web B devolverá la respuesta a nuestro navegador, pero ahora bien, en este punto, el navegador al recibir la petición dice:

- Okay, no veo por ningún lado la cabecera CORS, por lo tanto, aplico el SOP. ¿Son ambos orígenes el mismo? Nop, por lo tanto, no dejo que la Web A lea la respuesta que la Web B ha dado.

Entonces, viendo estos dos casos, el comportamiento de la ausencia o presencia del CORS sería algo así:

![Esquema de funcionamiento de CORS y SOP](https://cdn.deephacking.tech/i/posts/que-es-el-cross-origin-resource-sharing-cors/que-es-el-cross-origin-resource-sharing-cors-3.avif)

Dicho esto, existen tres posibles valores para la cabecera `Access-Control-Allow-Origin`:

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Origin: <origen>`
- `Access-Control-Allow-Origin: null`

El valor `*` (asterisco), permitirá que cualquier origen tenga la capacidad de leer las respuestas del servidor (esta configuración ya suena turbia, ¿a que sí?).

El segundo posible valor de la cabecera es un origen concreto que especifiques, por ejemplo:

- `Access-Control-Allow-Origin: http://deephacking.tech:8080`

Si te lo preguntas, no, no puedes añadir múltiples orígenes, de esta manera, solo permite un único valor. [Este post de StackOverflow trata cómo configurar múltiples orígenes sin usar el asterisco](https://stackoverflow.com/questions/1653308/access-control-allow-origin-multiple-origin-domains).

Por último, el tercer valor (`null`) permitiría que los orígenes null tengan la capacidad de leer las respuestas del servidor. Ahora bien, ¿en qué casos, el origen tendría como valor null? Pues este valor se suele establecer cuando ocurre una redirección, o también son los orígenes usados por los archivos locales. [Esta referencia de StackOverflow explica cuándo se establece el origen como null](https://stackoverflow.com/questions/8456538/origin-null-is-not-allowed-by-access-control-allow-origin).

Otra referencia recomendada para el null Origin es esta:

- [When do browsers send the Origin header? When do browsers set the origin to null?](https://stackoverflow.com/questions/42239643/when-do-browsers-send-the-origin-header-when-do-browsers-set-the-origin-to-null)

> Hemos mencionado mucho el tema de leer respuestas y demás, a nivel práctico, esto por ejemplo se podría referir a que el código JavaScript de la web que visitamos hace una petición `XMLHttpRequest` a otro origen, y la respuesta de esta petición es lo que, dependiendo del caso, el código JavaScript podría leer o no.

Llegados a este punto, hay que tener en cuenta un detalle importante, esta cabecera realmente solo permite la comunicación entre páginas públicas, y no páginas autenticadas.

Me explico, por lo general, cualquier petición que el navegador haga a un servidor web y recurso, incluirá las cookies y sesiones que el navegador tenga almacenadas.

Sin embargo, las respuestas de las peticiones que podemos observar con esta cabecera, son respuestas de peticiones simples, sin cookies ni nada, por eso la mención arriba de "páginas públicas". Ahora bien, que ocurre si el JavaScript del Frontend de la web que visitamos realiza una petición con las cookies de una sesión a un recurso autenticado de otro origen, en este caso, con la cabecera que hemos visto, no será suficiente para que el navegador y el CORS, permita la lectura de la respuesta del servidor.

Es aquí donde entra en juego la segunda cabecera que mencionamos antes, `Access-Control-Allow-Credentials`. El único valor posible para esta cabecera es `true` (`false` no aplicaría porque en ese caso simplemente la cabecera no se pondría).

Básicamente, esta cabecera habilita la lectura de la respuesta del servidor cuando esta posee credenciales, dicho de otra forma, cookies de sesión y demás, dicho también de otra forma, la lectura de recursos autenticados.

![Cabecera Access-Control-Allow-Credentials en respuesta HTTP](https://cdn.deephacking.tech/i/posts/que-es-el-cross-origin-resource-sharing-cors/que-es-el-cross-origin-resource-sharing-cors-4.avif)

Por ejemplo, si se hace una petición a `/api/apiKey` y el CORS del servidor, admite el origen y credenciales, pues la página maliciosa será capaz de leer el valor de la apiKey del usuario, cosa que es solo accesible con autenticación. Si la cabecera `Allow-Credentials` no estuviese, por mucho que el origen sea admitido, la página maliciosa sería incapaz de leer la respuesta, ya que se trata de un recurso accesible solo para usuarios autenticados.

OJO, un detalle importante sobre esta cabecera es que no está permitida cuando el valor de la cabecera `Access-Control-Allow-Origin` es `*`.

## Posibles vulnerabilidades

Cuando hablamos de posibles deficiencias del CORS, no hablamos de que el CORS tenga vulnerabilidades, sino de que su implementación está mal hecha, es decir, una mala configuración de seguridad.

Bien, teniendo en cuenta esto, y volviendo a los tres posibles valores que puede tener la cabecera `Access-Control-Allow-Origin`, podemos darnos cuenta de que es bastante limitado no poder poner en lista blanca más de un origen. Es por ello, que también adjuntaba una referencia a posibles soluciones cuando lo que te interesa es admitir más de un origen, pero sin llegar a tener que admitir todos usando el asterisco.

Es en esta precisa situación, cuando los desarrolladores de la web deben de implementar alguna configuración dinámica para admitir múltiples orígenes. Dependiendo de como se lleve a cabo la implementación, es aquí donde podemos encontrar vulnerabilidades, aquí algunos ejemplos:

- Puede ocurrir, que el servidor genere la cabecera `Access-Control-Allow-Origin` en base a lo que el cliente le especifica en la cabecera `Origin` de la petición, es decir, quizás en las peticiones legítimas estamos viendo `Origin: dominiolegitimo.com`, y, por tanto, el servidor responde con `Access-Control-Allow-Origin: dominiolegitimo.com`. Pero, si el valor de la cabecera `Access-Control-Allow-Origin` está generado a partir del valor de la cabecera `Origin` de la petición del cliente, si lo cambiamos a `Origin: dominiomalicioso.com`, el servidor responderá con `Access-Control-Allow-Origin: dominiomalicioso.com`. Y esto ocurre porque simplemente el servidor hace una mala implementación de la generación dinámica de los orígenes, dejando que el cliente sea el que elija el origen permitido.
  - Si por ejemplo, hacemos una petición al servidor, y esta no contiene la cabecera `Origin`, pero el servidor si responde con las cabeceras de `Access-Control`, puede ser probable que ocurra este fallo de seguridad que acabamos de comentar. De la misma forma, puede que no ocurra, pero esto podría ser un indicativo.
- Errores al implementar una lista blanca. Los desarrolladores pueden equivocarse a la hora de definir la lista blanca, por ejemplo, usando regex. Si los desarrolladores escriben que confían en todos los orígenes que sean `*dominiolegitimo.com`. Pues, es tan sencillo como que el atacante utilice un origen que acabe de la misma forma, por ejemplo, `sitiomaliciosodominiolegitimo.com`, siguiendo el regex definido, la aplicación confiaría perfectamente en el origen malicioso que hemos colocado. De la misma manera, puede ocurrir lo contrario, que el servidor diga que confía en los orígenes que sean `dominiolegitimo.com*`, de esta forma, el atacante podría aprovecharse de esta configuración, para colocar `dominiolegitimo.com.sitiomalicioso.com`, y de nuevo, sería totalmente aceptado por el servidor.
- Además de estas dos posibles ocurrencias, puede pasar que el servidor admita el origen nulo, por ejemplo, que nosotros coloquemos en la petición `Origin: null`, y el servidor nos responda con `Access-Control-Allow-Origin: null`.

Estas tres posibles vulnerabilidades que acabamos de ver, como vemos, dependen 100% de la implementación de los desarrolladores, por eso lo que se comentaba antes de que todas las vulnerabilidades del CORS realmente son configuraciones mal hechas.

> Mini apunte, estos tres fallos que acabamos de ver, son perfectamente compatibles con el uso conjunto de la cabecera `Access-Control-Allow-Credentials`. Si encontramos uno de estos fallos, y, además, se encuentra la cabecera `Allow-Credentials`, pues F, porque a nivel práctico sería lo mismo que si la cabecera `Access-Control-Allow-Origin` tuviera como valor el asterisco, y al mismo tiempo, la cabecera `Allow-Credentials`, cosa que ya sabemos que no está permitida, pero en este caso, a nivel práctico seria como si lo fuese.
> 
> Por lo que, las vulnerabilidades de CORS se vuelven especialmente críticas e importantes, cuando la cabecera `Allow-Credentials`, está presente.

> Otro detalle superimportante a recordar, y que nos sirve para visualizar mejor el posible impacto de una vulnerabilidad de este tipo, es que por defecto, en todas las peticiones que tu navegador realice a un sitio web, se añadirán las cookies de sesión guardadas, etc. Por lo que si visitamos un sitio malicioso, y este ocasiona una petición a por ejemplo, nuestro banco, si tenemos la sesión guardada, la petición se hará con nuestras cookies y demás. Si a esto le sumas, que el CORS está mal configurado, pues la web maliciosa que hemos visitado, será capaz de leer los datos nuestros del banco, esto sería una posible prueba de concepto de lo que puede ocurrir si el CORS está mal configurado.

Por último, en relación a los fallos de seguridad de CORS vistos, estos dos artículos están bastante bien:

- [Exploiting CORS misconfigurations for Bitcoins and bounties](https://portswigger.net/research/exploiting-cors-misconfigurations-for-bitcoins-and-bounties)
- [StackStorm - From Originull to RCE - CVE-2019-9580](https://quitten.github.io/StackStorm/)

## Convivencia entre el CORS y el SOP

Ya sabemos como funcionan ambos, ahora bien, vamos a poner un ejemplo para que se entienda la convivencia de estos dos mecanismos de seguridad y porque se complementan:

- El SOP previene que al visitar `https://web_maliciosa.com`, esta web pueda realizar acciones y obtener información de `https://web_protegida.com`.
- Asimismo, el CORS permite que `https://web_protegida.com` pueda ser accesible desde otros origenes distintos a asímismo, al mismo tiempo que previene el escenario mencionado arriba con el SOP.

Y es por eso mismo que se complementan ^^.

Dicho esto, realmente esto es el CORS, hemos visto su funcionamiento, finalidad y posibles errores de configuración UwU.

## Referencias

- [CORS and the SOP explained](https://blog.dataminded.com/cors-and-the-sop-explained-f59de3a5078)
- [Cross-Origin Resource Sharing (CORS) | Complete Guide](https://www.youtube.com/watch?v=t5FBwq-kudw)
- [Access-Control-Allow-Origin Multiple Origin Domains?](https://stackoverflow.com/questions/1653308/access-control-allow-origin-multiple-origin-domains)
