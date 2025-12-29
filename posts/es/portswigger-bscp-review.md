---
id: "portswigger-bscp-review"
title: "BSCP Review - Burp Suite Certified Practicioner 2023"
author: "{REDACTED}"
publishedDate: 2023-06-19
updatedDate: 2023-06-19
image: "https://cdn.deephacking.tech/i/posts/portswigger-bscp-review/portswigger-bscp-review-0.webp"
description: "Review completa de la certificación BSCP (Burp Suite Certified Practitioner) de PortSwigger: experiencia del examen, preparación con Web Security Academy, consejos y recursos para aprobar."
categories:
  - "certifications"
draft: false
featured: false
lang: "es"
---

¡Muy buenas a todos! En este post estaremos hablando de, para mí, la mejor certificación de pentesting web de caja negra que hay, el BSCP, mejor conocido como Burp Suite Practicioner.

- [¿Qué es el BSCP?](#¿qué-es-el-bscp?)
- [Web Security Academy: la clave para el BSCP](#web-security-academy:-la-clave-para-el-bscp)
- [Mistery Labs](#mistery-labs)
- [El examen](#el-examen)
- [Consejos](#consejos)
- [Extensiones de Burp](#extensiones-de-burp)
- [Opinión personal](#opinión-personal)
- [Recursos adicionales](#recursos-adicionales)

## ¿Qué es el BSCP?

Si habéis estado en el mundo del hacking web durante más de 1 semana, lo más probable es que hayáis usado Burp Suite, o al menos os debería sonar, puesto que es sin duda alguna, la herramienta más usada para pentesting web.

Burp Suite ha sido desarrollado y es mantenido por [PortSwigger](https://portswigger.net/), una de las empresas líderes en el pentesting de aplicaciones web. Se dedican al desarrollo de software y herramientas, además de realizar labores de investigación y encontrar nuevos tipos de vulnerabilidades, que luego comparten mediante artículos en su página web y ponencias en los mayores eventos de ciberseguridad como la [DefCon](https://defcon.org/) o la [BlackHat](https://www.blackhat.com/).

Además de ello, ofrecen una [academia](https://portswigger.net/web-security/learning-path) totalmente gratis, donde tienes a tu disposición hasta [240 laboratorios](https://portswigger.net/web-security/all-labs) (a fecha de hoy) de 25 vulnerabilidades web distintas. Y sí, al contrario de lo que piensa mucha gente, hay cosas más allá de los XSS, SQLi, CSRF, SSRF o XXE, y esta academia es el lugar idóneo para aprender sobre estas cosas.

El BSCP es la certificación que ofrece PortSwigger para poner a prueba tus conocimientos de pentesting web. Tienes a tu disposición cuatro horas para vulnerar dos aplicaciones web, cada una consistente de tres fases, y en cada fase tendrás que encontrar una o más vulnerabilidades que tendrás que explotar para acceder a la siguiente etapa.

En la fase 1 empiezas como usuario no autenticado y tu objetivo es escalar a un usuario de bajos privilegios, luego en la fase 2, escalar a un usuario administrador, y finalmente en la fase 3, leer un archivo del sistema.

Esto nos deja con que hay que explotar 6 vulnerabilidades en 4 horas, lo que serían, 45 minutos por vulnerabilidad. Puede parecer poco tiempo, y realmente lo es si no estás del todo preparado, pero el objetivo de la certificación es también evaluar que tengas los conocimientos bien interiorizados, una buena metodología y tu agilidad.

## Web Security Academy: la clave para el BSCP

Antes de realizar la certificación, escuché un par de afirmaciones de algunas personas que ya habían realizado el examen: que no hay tiempo suficiente y que la academia no te preparaba realmente.

Tras haberlo hecho, mi opinión es que ambas afirmaciones no son ciertas. Si estás bien preparado, 4 horas es tiempo de sobra. En cuanto a la academia, es el mejor sitio donde puedes practicar, por tres razones: la primera es que el entorno del examen es calcado a los laboratorios, así que si ya estás familiarizado con ellos, el entorno te será conocido desde el momento en el que empiezas. La segunda es que puedes tener la suerte de que alguna que otra vulnerabilidad en el examen te suene del laboratorio, aunque si aparece, es posible que tengas que cambiar algunas cosas y adaptarla al entorno. La tercera es que cualquier vulnerabilidad que te encuentres en el examen está contemplada en la academia.

Por si queréis tener una referencia, este es el número de labs que llevaba en el momento en el que me presenté a la certificación:

![Número de laboratorios completados en Web Security Academy](https://cdn.deephacking.tech/i/posts/portswigger-bscp-review/portswigger-bscp-review-1.avif)

Evidentemente, son muchos y no hace falta hacerlos todos, pero yo me lo pasaba bien y entre rato y rato acabé haciendo prácticamente 230 de los 240 que hay. Los recomiendo mucho de cara al examen, pero sobre todo, para el aprendizaje en general. James Kettle, el director de research de PortSwigger, y Gareth Heyes, realizan cada año investigaciones de vulnerabilidades, y muchos de los laboratorios que hay en la academia, son replicaciones de casos reales que se han encontrado. Ejemplo de ello, son por ejemplo los laboratorios de HTTP Request Smuggling, Server-Side Prototype Pollution o Web Cache Poisoning.
- _[Investigación sobre HTTP Request Smuggling en PortSwigger](https://portswigger.net/research/request-smuggling)_
- _[Investigación sobre Web Cache Entaglement en PortSwigger](https://portswigger.net/research/web-cache-entanglement)_
- _[Investigación sobre Server-Side Prototype Pollution en PortSwigger](https://portswigger.net/research/server-side-prototype-pollution)_

Insisto mucho en que le echéis un vistazo a estos artículos, o en su lugar, veáis la correspondiente ponencia en formato vídeo, porque muchas veces no te queda muy claro cómo funcionan ciertos vectores de ataque y el tener acceso a más documentación sobre ello te puede ayudar a entenderlo mejor.

Si estáis empezando en pentesting web, podéis seguir el learning path que os recomienda PortSwigger:
- _[Ruta de aprendizaje de Web Security Academy](https://portswigger.net/web-security/learning-path)_

## Mistery Labs

Supongamos que ya tienes hecho una buena cantidad de laboratorios habiendo tocado la mayoría de vulnerabilidades (idealmente todas). Pues bien, ahora entra la etapa en la que tienes que entrenar tu fase de reconocimiento, puesto que en el examen no hay un título en grande que te diga "OYE NECESITAS HACER UN HTTP REQUEST SMUGGLING PARA ROBARLE LA SESIÓN DE COOKIE AL USUARIO", como si pasa en los laboratorios.

Para ello, PortSwigger te pone a desafío con los mystery labs, donde te spawnea un laboratorio sin contexto alguno y tienes que resolverlo. Puedes elegir el nivel del laboratorio (Apprentice, Practicioner o Expert), si solo quieres que te salgan laboratorios que hayas hecho, o la categoría por si quieres entrenar alguna vulnerabilidad en concreto.

![Interfaz de Mystery Labs en Web Security Academy](https://cdn.deephacking.tech/i/posts/portswigger-bscp-review/portswigger-bscp-review-2.avif)

Personalmente me dediqué a hacer muchos mistery labs de nivel Practicioner, que es el nivel intermedio, puesto que me interesaba entrenar más la fase de reconocimiento que la de explotación. Hay laboratorios Expert que son largos de por sí, y añadiéndoles el tema de la enumeración se extenderían demasiado.

Un consejo que os daría es que revisarais bien todos los laboratorios que hayáis hecho antes de presentaros al examen. Un error que cometí fue dar por sabido laboratorios que igual había hecho hace 5-6 meses.

## El examen

El coste del examen es de unos 99 dólares + IVA. Es muy barato en comparación a otras certificaciones, aunque eso sí, o vas muy bien preparado o seguramente tengas que hacerlo más de 1 vez para aprobarlo. Una vez hayas comprado la certificación, necesitarás pasar por Examity, que es el sistema proctored que usa el BSCP. En realidad lo único que necesitas es proporcionar una foto de tu cara y una de tu ID (DNI, Pasaporte o lo que quieras).

Después, necesitarás introducir la contraseña que te proporciona Examity en el examen, y una vez completado esto, ya puedes dar por finalizada la sesión de proctored. La verdad es que lo único que verifican es eso, la foto que proporcionas y tu ID. Eso sí, aseguraros de crearos un proyecto en Burp Pro donde realicéis todo el examen y lo guardéis, porque al final del mismo, PortSwigger os lo pedirá para comprobar que todo haya sido correcto y que no hayáis hecho trampas. Mucho cuidado con este tema, puesto que si os pillan haciendo trampas os banearán permanentemente de su plataforma y de la posibilildad de realizar el examen en un futuro. Sed honestos con vosotros mismos.

Por el tema de poder guardar el proyecto y además del Burp Collaborator, necesitaréis obligatoriamente Burp Professional. No hace falta que os lo compréis, cuando vayáis a realizar el examen, simplemente pedid la prueba gratuita de 1 semana.

Una vez hayáis realizado todo esto, ya podéis empezar la prueba. 4 horas, 2 web apps, 6 vulnerabilidades, 45 minutos por cada una. Hay alguna que otra vulnerabilidad que es complicada de encontrar manualmente, por lo tanto, es imprescindible que aprendáis a usar [Burp Scanner](https://portswigger.net/burp/documentation/scanner), para que os ayude en esa fase de reconocimiento. Y tened varias formas alternativas de explotar una misma vulnerabilidad.

Tengo que admitir que no lo aprobé a la primera, por el error que os comentaba antes. Había módulos que igual había hecho hace 5 meses, y me presenté al examen sin tenerlos refrescados. Y claro, si te pasas una parte de la prueba buscando entre labs y labs como se hacía x cosa, hay mucho tiempo que pierdes.

Luego de fallar mi primer intento, decidí reforzar mis debilidades. Por ejemplo, aunque entendía el funcionamiento básico del HTTP Request Smuggling, había ciertos vectores de ataque que no entendía al 100%. Por ello, decidí leerme los artículos de research correspondientes, me hice todos los labs de nuevo incluyendo los experts, y además hice una serie de vídeos explicando cada laboratorio.

Si creéis que entendéis algo, intentad explicarlo. Si lo conseguís, bien, si no, es que no lo entendéis. Y cuanto más claro y conciso seais, en la mayoría de casos, supondrá que lo entiendes bien. Al intentar explicar el HTTP Request Smuggling al principio, me di cuenta de que cuando iba entrando en detalles, me perdía y por ello decidí reforzar ese concepto intentando explicarlo. Os animo a que hagáis lo mismo con cualquier vulnerabilidad con la que os sintáis incómodos. No hace falta hacer vídeos, podéis crear artículos o simplemente explicárselo a tu compañero de trabajo o amigo.

Me volví a presentar al examen tras hacer lo anterior y refrescar algunos conceptos que tenía un poco oxidados, y esta vez sí que lo conseguí aprobar. Lo acabé alrededor de la tercera hora, aunque conozco a compañeros que lo hicieron en dos horas e incluso 1 hora y media. Aquí hay que ser justos y decir que el examen no es el mismo para todos, sino que se va generando de manera aleatoria, por lo que es inevitable que un examen te resulte más fácil que otro. Pero la cosa es que tiempo hay de sobra.

Si mientras hacéis vuestro primer intento veis que la cosa va mal y seguramente vayáis a suspender, os recomendaría que, por lo menos, apuntarais los payloads que hayáis usado y que os hayan servido para explotar alguna vulnerabilidad. Porque puedes tener la suerte de que en tu segundo intento, alguna fase de las seis sea calcada o casi, a una de las fases de tu primer intento, por lo que ahorraríais tiempo ahí.

Al acabar el examen, sale una interfaz de usuario dándote la enhorabuena y pidiéndote que subas tu proyecto en formato zip. Sin embargo, al intentar subirlo, no veía ningún feedback en la interfaz asegurándome de que mi archivo se haya subido correctamente. Simplemente lo arrastraba o le daba a un botón que ponía "Browse Files", seleccionaba mi archivo pero luego nada de nada.

Si habéis leído mi _[review del OSWE en Deep Hacking](https://blog.deephacking.tech/es/posts/offsec-oswe-review/)_, sabréis que soy una persona que le encanta estar de noche dándole al hacking y sobre todo, hacer los exámenes de certificaciones por esas horas. Pues bien, el examen lo empecé a las 1 AM y lo acabé a eso de las 4 AM, por lo que el soporte de PortSwigger estaba inactivo, ya que naturalmente estarían durmiendo. Al ver que el archivo no se subía, le mandé un correo a soporte con las capturas de pantallas correspondientes y el archivo ZIP que contenía mi proyecto de Burp.

Por la mañana me contestaron y me dijeron que sabían de la existencia de un bug en la subida de archivos posterior al examen. Con esto simplemente deciros que si hacéis el examen poco tiempo después de leeros esta review, es probable que ese bug siga ahí, así que no os ralléis y simplemente mandad vuestro ZIP a soporte, y ellos ya se encargan de mandarlos al equipo correspondiente de revisar esas cosas.

Horas después, me llegó el correo diciéndome que había aprobado.

![Correo de aprobación del examen BSCP](https://cdn.deephacking.tech/i/posts/portswigger-bscp-review/portswigger-bscp-review-3.avif)

## Consejos

- Usad Burp Scanner para la fase de reconocimiento. Hay vulnerabilidades que os puede llevar tiempo para encontrarlas manualmente. Mientras os dedicáis a explorar las funcionalidades de la web app, aseguraros de tener algo corriendo en segundo plano (en este caso Burp Scanner). Así ahorráis tiempo.

- Seguid esta guía y haceros todos los pasos:
    - _[Guía de preparación para la certificación BSCP](https://portswigger.net/web-security/certification/how-to-prepare)_

- Aunque se dice que el nivel del examen es correspondiente al nivel Practicioner de los laboratorios, no viene mal hacerse algunos laboratorios Experts para reforzar vuestro entendimiento.

- Leeros los _[artículos de investigación de PortSwigger](https://portswigger.net/research/articles)_.

- Si no os gusta leer, miraros la _[ponencia en formato vídeo en el canal de PortSwigger](https://www.youtube.com/@PortSwiggerTV)_.

- Haced el practice exam varias veces. Es una prueba similar al examen real que pone PortSwigger a vuestra disposición para que podáis familiarizaros con el formato del examen. Lo tenéis en el _[examen de práctica oficial de BSCP](https://portswigger.net/web-security/certification/practice-exam)_. La primera vez intentad hacerlo de manera normal. La segunda vez intentad automatizarlo todo y hacerlo en el menor tiempo posible. Por ejemplo, si te encuentras una deserialización en Java, puedes usar la extensión Deserialization Scanner y ahorrar tiempo, si te encuentras una SQLi puedes usar SQLMap. Si no conocéis estas extensiones, os recomiendo encarecidamente _[este vídeo de bmdyy resolviendo el Practice Exam](https://youtu.be/yC0F05oggTE)_, aprenderéis varios trucos muy buenos.

- Si no os queda claro algo al 100%, intentad explicarlo mediante vídeos, artículos o contándoselo a un compañero/amigo. Apoyaros en los _[artículos de investigación de PortSwigger](https://portswigger.net/research/articles)_.

- Tened una buena base de HTML, CSS y JavaScript. Muchas veces en hacking web, es complicado entender ciertos vectores de ataques más enreversados si no tenéis una base sólida del lenguaje de la web. Si os sentís incómodos con esto, reforzadlo que es importante para entender cosas más complejas.

## Extensiones de Burp

A medida que vas avanzando en la academia, te van introduciendo ciertas extensiones que son útiles para ciertos casos. Os dejo un resumen de aquellas que más me han gustado:
- _[Extensión Param Miner para Burp Suite](https://portswigger.net/bappstore/17d2949a985c4b7ca092728dba871943)_ - fuzzer de parámetros y cabeceras ocultas.
- _[Extensión HTTP Request Smuggler para Burp Suite](https://portswigger.net/bappstore/aaaa60ef945341e8a450217a54a11646)_ - contiene distintos vectores de Request Smuggling que puedes usar.
- _[Extensión Agartha para Burp Suite](https://github.com/volkandindar/agartha)_ - ésta no está en la academia, pero la recomiendo porque te proporciona un montón de payloads para LFI, Inyección de Comandos, SQL Injection, con bypass de WAFS incluido. Se puede, por ejemplo, generar los payloads y meterlos en el Intruder.
- _[Extensión Turbo Intruder para Burp Suite](https://portswigger.net/bappstore/9abaa233088242e8be252cd4ff534988)_ - útil para cuando tengas que jugar con el timing (race conditions) o quieras mandar requests parcialmente (por ejemplo solo mandar los headers y tras X segundos, mandar el body).
- _[Extensión Content Type Converter para Burp Suite](https://portswigger.net/bappstore/db57ecbe2cb7446292a94aa6181c9278)_ - pasar el cuerpo de la petición de XML a JSON y viceversa de manera automatizada.
- _[Extensión JWT Editor para Burp Suite](https://portswigger.net/bappstore/26aaa5ded2f74beea19e2ed8345a93dd)_ - útil para cuando se trata con tokens JWT.
- _[Extensión Server-Side Prototype Pollution Scanner para Burp Suite](https://portswigger.net/blog/server-side-prototype-pollution-scanner)_ - como su nombre indica, útil para Server-Side Prototype Pollution.
- _[Herramienta DOM Invader integrada en Burp Suite](https://portswigger.net/burp/documentation/desktop/tools/dom-invader)_ - viene integrado con el navegador de Burp, y es útil para encontrar Client-Side Prototype Pollution.
- _[Extensión Java Deserialization Scanner para Burp Suite](https://portswigger.net/bappstore/228336544ebe4e68824b5146dbbd93ae)_ - puedes cargarle el .jar del ysoserial y automatizar el tedioso procedimiento de explotar una deserialización en Java.
- _[Extensión Hackvertor para Burp Suite](https://portswigger.net/bappstore/65033cbd2c344fbabe57ac060b5dd100)_ - herramienta que soporta varios tipos de encodings y escapes (entidades HTML5, hex, octal, unicode, etc.)

## Opinión personal

En este apartado me gustaría comentar mi opinión personal, con toda honestidad sobre la certificación.

Teniendo en cuenta el precio barato de la certificación comparándola con el resto, que la academia y los laboratorios son totalmente gratis, que la certificación la ofrece una de las empresas pioneras en todo lo relacionado con la seguridad en la web, además de los artículos de investigación de calidad que ofrecen y comparten también de manera gratis y el canal de YouTube donde crean contenido relacionado, lo único que puedo decir es que esta es, sin duda alguna, la mejor certificación calidad/precio que te puedes encontrar de pentesting web de caja negra.

Si la dedicamos a comparar con el eWPTXv2, la realidad es que, bajo mi opinión, le da mil vueltas en todos los aspectos. Se enseñan un mayor número de vulnerabilidades, el precio es más barato, hay más recursos, los laboratorios son gratis y de mucha mayor calidad (en eWPTXv2 tienes que pagar el INE y además los laboratorios son pochos), y el servicio de soporte te atiende amablemente y de forma rápida, cosa que en el INE he escuchado varias quejas al respecto de eso. Además creo que he aprendido bastante más en general.

Por ello, si alguien me pregunta sobre aprender pentesting web, lo que suelo hacer es redirigirlo a la Web Security Academy, puesto que en mi opinión, es el mejor recurso que existe para este aprendizaje.

¡Y eso es todo por hoy! Espero que os haya gustado esta review del BSCP.

## Recursos adicionales
- _[Vídeo de bmdyy resolviendo el Burp Practice Exam](https://youtu.be/yC0F05oggTE)_
- _[Vídeo de Emanuele Picariello sobre el BSCP](https://youtu.be/KfX9OS9POvA)_
- _[Review del BSCP de Micah Van Deusen](https://micahvandeusen.com/burp-suite-certified-practitioner-exam-review/)_
- _[Canal de YouTube de Emanuele Picariello](https://www.youtube.com/@emanuelepicariello)_
- _[Canal de YouTube de Rana Khalil](https://www.youtube.com/@RanaKhalil101)_
- _[Apuntes de estudio del BSCP por botesjuan](https://github.com/botesjuan/Burp-Suite-Certified-Practitioner-Exam-Study)_
- _[Cheat Sheet de XSS en PortSwigger](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet)_
- _[Cheat Sheet de SQLi en PortSwigger](https://portswigger.net/web-security/sql-injection/cheat-sheet)_
