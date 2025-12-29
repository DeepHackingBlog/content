---
id: "offsec-oswe-review"
title: "OSWE Review - Offensive Security Web Expert 2023"
author: "{REDACTED}"
publishedDate: 2023-02-08
image: "https://cdn.deephacking.tech/i/posts/offsec-oswe-review/offsec-oswe-review-0.webp"
description: "Review completa de la certificación OSWE de OffSec: curso avanzado de web security, análisis de código, examen de whitebox y mi experiencia obteniendo la certificación."
categories: 
  - "certifications"
draft: false
featured: false
lang: "es"
---

¡Muy buenas a todos! En este post estaré hablando del OSWE, que es quizás, la certificación que más ganas tenía de obtener. Os comentaré mi experiencia personal, tips y consejos para afrontarla y responderé a preguntas que me hice en su momento y que creo que pueden ser de utilidad para todos aquellos o aquellas que queráis presentaros a la certificación en un futuro.

- [¿Qué es el OSWE?](#qué-es-el-oswe)
- [Requisitos antes del curso](#requisitos)
- [Opinión del curso](#opinión-del-curso)
- [Laboratorios](#laboratorios)
- [El examen](#el-examen)
- [Consejos para el examen](#consejos-para-el-examen)
- [Preguntas y respuestas](#preguntas-y-respuestas)
- [Recursos adicionales](#recursos-adicionales)

## ¿Qué es el OSWE?

OSWE son las siglas de [Offensive Security Web Expert](https://www.offensive-security.com/courses/web-300/), y es la certificación más avanzada de pentesting web de Offensive Security. Es una de las tres certificaciones necesarias para aspirar al OSCE3, junto al OSEP y el OSED.

La peculiaridad de esta certificación reside en que el enfoque es desde una perspectiva de caja blanca, lo que la diferencia de las demás de la misma rama, como el [BSCP](https://portswigger.net/web-security/certification), [eWPT](https://elearnsecurity.com/product/ewpt-certification/), [eWPTXv2](https://elearnsecurity.com/product/ewptxv2-certification/) o el recién [CBBH](https://academy.hackthebox.com/preview/certifications/htb-certified-bug-bounty-hunter/).

Y, ¿qué es un enfoque de caja blanca? Pues bien, son pruebas de penetración en el que el atacante tiene acceso total al código fuente de la aplicación, a las bases de datos y a todo el sistema. ¿Por qué? Para tratar de identificar posibles fallos de seguridad tanto desde una perspectiva interna como externa.

El problema suele ser que estas aplicaciones, generalmente, suelen ser muy grandes y contienen mucho código fuente, lo que puede dificultar la tarea del atacante en encontrar vulnerabilidades si no está preparado. Y ahí es donde entra el OSWE, el cual intenta enseñar la metodología a seguir en este tipo de pruebas, así como lograr encontrar y explotar las vulnerabilidades. Sin embargo, como se ha mencionado al principio, este es un curso avanzado y es por ello que hay una serie de prerrequisitos que considero que debéis tener en cuenta antes de inscribiros.

## Requisitos

##### Lenguajes y frameworks

Dado que el enfoque es de caja blanca, debemos familiarizarnos con la lectura de código fuente en distintos lenguajes y frameworks. Esto es clave, puesto que muchas veces sabemos cómo explotar ciertas vulnerabilidades, pero la dificultad radica en encontrarlas. John Hammond describió su experiencia en el OSWE como "intentar encontrar una aguja en un pajar".

¡Pero no os desaniméis! Al igual que muchos de vosotros, tengo cero experiencia como desarrollador, y aun así conseguí aprobar la certificación con la puntuación máxima, así que seguro que vosotros podéis también. Entonces, ¿cuáles son los lenguajes o frameworks con los que os debéis familiarizar?

- En el curso se tocan cinco lenguajes: Java, PHP, Python, NodeJS (JavaScript) y C#.

- Frameworks que recomiendo tocar: Spring y Hibernate (Java), Laravel y Symfony (PHP), Flask y Django (Python), Express (NodeJS) y .NET (C#)

Sé que son muchos lenguajes y frameworks, y que estaréis pensando que esto es complicado, pero os lo repito, no os desaniméis. No necesitáis dominar estos frameworks, simplemente familiarizaros con su estructura y sintaxis, nada más, de forma que podáis diferenciar cuándo un cierto código pueda llegar a ser vulnerable o no. ¿Y cómo lo podéis hacer? Pues sin duda alguna, la mejor página que os puedo recomendar es [Secure Code Warrior](https://www.securecodewarrior.com/).

En esta página podéis crearos una cuenta (si os pone algo de free trial por 14 días haced caso omiso), y acto seguido seleccionar un lenguaje que queráis practicar. El aspecto más interesante son los "challenges", en los que te dan un proyecto en ese lenguaje, con varias secciones de código marcadas por un triángulo. El objetivo es identificar cuál de estas secciones de código presenta la vulnerabilidad a encontrar.

Por ejemplo, en este caso el objetivo es encontrar una inyección SQL:

![Ejemplo challenge SQLi en Secure Code Warrior](https://cdn.deephacking.tech/i/posts/offsec-oswe-review/offsec-oswe-review-1.avif)

Y en uno de estos archivos marcados por un triángulo, se supone que hay una porción de código vulnerable a inyección SQL.

![Código vulnerable a SQLi destacado](https://cdn.deephacking.tech/i/posts/offsec-oswe-review/offsec-oswe-review-2.avif)

El objetivo es identificarla y acto después, te serán proporcionadas cuatro posibles remediaciones y tendrás que elegir cuál es la más apropiada, para mitigar esa vulnerabilidad.

Considero que esta página ha sido clave para agilizar mucho mi lectura de código fuente, y sobretodo, identificar a simple vista (más o menos) qué porciones de código pueden ser vulnerables y cuáles no.

Otro consejo que os daría es que os montarais proyectos con algún framework, para ver mejor cómo funcionan, y cómo suelen pensar los desarrolladores a la hora de programar. Para ello tenéis a vuestra disposición cientos de artículos por Internet, tutoriales en Youtube, o streamers de Twitch que emiten cómo desarrollan en x framework.

Adicionalmente, recientemente me dió por probar los "challenges" web (no las máquinas) de HackTheBox, y la verdad que están muy bien, porque en algunos de ellos os proporcionan junto al challenge el código fuente, por lo que podéis intentar resolverlo desde un enfoque de caja blanca. ¡Muy recomendados!

##### Modelo MVC

Debido a que estaréis leyendo mucho código, es importante saber cómo suele estar estructurado un proyecto. De esta forma, sabréis donde mirar cuando queráis buscar un cierto tipo de vulnerabilidad. En el curso se discute brevemente lo que es el [MVC](https://www.google.com/search?q=modelo+mvc), pero os recomiendo encarecidamente que investiguéis un poco más al respecto y veáis cómo se suele aplicar en proyectos reales (o en los que te proporciona [Secure Code Warrior](https://www.securecodewarrior.com/) en los challenges, por ejemplo).

![Esquema del modelo MVC](https://cdn.deephacking.tech/i/posts/offsec-oswe-review/offsec-oswe-review-3.avif)

##### Scripting en Python

Un aspecto importante del OSWE, es que no basta con tan solo explotar las vulnerabilidades, sino que además, hay que proporcionar un script como prueba de concepto, que con tan solo ejecutarlo, realice y encadene todas las vulnerabilidades para recibir una reverse shell.

El script, mientras funcione, puede ser en cualquier lenguaje de vuestra elección, pero mi recomendación personal (y la de Offensive Security), es que elijáis Python, debido a la sintaxis minimalista que posee y todas las librerías que tienes a tu disposición, que pueden facilitarte mucho el trabajo en varias ocasiones.

Para mejorar vuestras habilidades de scripting no hay ningun secreto, lo único que hay que hacer es practicar mucho. Sin embargo, sí que os puedo decir cuáles serían las librerías con las que deberías practicar:

- requests, argparse, os, re, threading, http.server, pwn, urllib.parse, sys, subprocess, string, random, base64, time, pdb, json, bs4

Podéis aprender a usar Flask también, ya que os podría venir bien en alguna que otra ocasión.

## Opinión del curso

Según Offensive Security, esto es todo lo que se toca en el curso del OSWE, lo que se conoce como AWAE.

- Cross-Origin Resource Sharing (CORS) with CSRF and RCE
- JavaScript Prototype Pollution
- Advanced Server-Side Request Forgery (SSRF)
- Web security tools and methodologies
- Source code analysis
- Persistent cross-site scripting
- Session hijacking
- .NET deserialization
- Remote code execution
- Blind SQL injection
- Data exfiltration
- Bypassing file upload restrictions and file extension filters
- PHP type juggling with loose comparisons
- PostgreSQL Extension and User Defined Functions
- Bypassing REGEX restrictions
- Magic hashes
- Bypassing character restrictions
- UDF reverse shells
- PostgreSQL large objects
- DOM-based cross site scripting (black box)
- Server-side template injection
- Weak random token generation
- XML external entity injection
- RCE via database functions
- OS command injection via WebSockets (black box)

Personalmente, puedo deciros que el curso me ha gustado. Las técnicas que se enseñan, la metodología que se sigue, y la profundidad con la que se abarcan la mayoría de conceptos fueron los aspectos que más me gustaron. Sobre todo, cómo te enseñan que el ir combinando múltiples vulnerabilidades, que por sí solas pueden parecer inofensivas, puede resultar en un daño mucho mayor y en muchas ocasiones conseguir ejecución remota de comandos o RCE.

Además, muchas de las vulnerabilidades que se enseñan, son de casos reales que encontró el propio equipo de Offensive y otras personas. Esto le añade mucho realismo, puesto que te das cuenta de que todo lo que te enseñan es aplicable al mundo real.

## Laboratorios

Por cada módulo que se enseña en el curso, está su correspondiente laboratorio para que podáis practicar. Mi recomendación es que os dejéis guiar, para poder aprender la metodología de cómo proceder, y si queréis seguir practicando, realizad los extra miles. Evidentemente, surge la siguiente pregunta:

¿Qué son los extra miles?

Pues bien, son ejercicios que van un poco más allá, y que no tienen solución pública. Vienen bien para poneros a prueba, y experimentar un poco esa sensación de estancarse y darse contra un muro, y aprender a desarrollar tu metodología para salir de ese estancamiento. Aunque Offensive Security no proporciona la solución a estos ejercicios, sí que pone a disposición de los estudiantes un foro donde se pueden ir intercambiando ideas para guiarse. Además, os recomiendo encarecidamente que os unáis al servidor de Discord oficial de Offensive Security y reclaméis el rol correspondiente a vuestro curso, en este caso web-300, para que podáis interaccionar con otros estudiantes que estén pasando por lo mismo.

Adicionalmente, hay tres laboratorios extras que no están contemplados en el curso y cuya solución tampoco es pública. Os recomiendo que os los dejéis para el final, y que os sirvan un poco como prueba para ver si realmente estáis capacitados para enfrentaros al examen. Intentad resolver estos laboratorios sin ningún tipo de ayuda, si lo lográis, entonces seguramente estaréis preparados para el examen, si no, pues ya sabéis que todavía tenéis aspectos a mejorar. No os olvidéis de, una vez completado el laboratorio, automatizarlo enteramente en un script en Python, puesto que se os pedirá esto en el examen.

Personalmente, no realicé todos los extra miles, porque consideré que algunos eran redundantes o que no me iban a aportar mucho, ya que eran cosas que sabía hacer. Pero sí que hice algunos, diría que entre un 60-70% del total más o menos.  
En cuanto a los laboratorios extra, dos son de enfoque de caja blanca y uno es de caja negra, pero este último, una vez que lo resuelves, puedes extraer el código fuente y volver a hacerlo desde un enfoque de caja blanca para seguir encontrando más vulnerabilidades. Personalmente, hice los dos laboratorios de caja blanca sin ayuda, y eso me dio confianza para enfrentarme al examen de una y no tener que hacer el tercer laboratorio que me quedaba.

## El examen

Después de casi 3 meses de iniciar el curso, decidí presentarme al examen. Consiste en que tienes 48 horas para vulnerar el laboratorio que te ponen por delante y 24 horas para realizar el reporte correspondiente.

Offensive Security no permite dar mucha información sobre el examen en sí, así que no entraré en detalles sobre el mismo. Viéndolo en perspectiva y una vez acabado, puedo decir que era bastante asequible si has realizado el curso y trabajado de forma apropiada durante estos meses. Pero sí que es verdad que cuando estás en la propia prueba, entre que es proctored (es decir, te están vigilando), el nerviosismo, el que no encuentres lo que tengas que encontrar, o que simplemente no te salgan las cosas, puede hacerte pasar un mal rato como me pasó a mí.

Se puede acceder al portal del examen 15 minutos antes, para poder realizar todo el tema del proctored, es decir, que verifiquen tu identidad, se aseguren que en tu habitación no hay nadie más, entre otras cosas. Una vez acabado toda la comprobación, me llegó el correo con toda la información para la prueba y empecé a darle caña.

Las primeras ocho horas fueron muy bien, ya había progresado notablemente y me sentía muy cómodo. Pero a eso de la novena hora, se empezó a complicar la cosa, puesto que no encontraba lo que necesitaba encontrar.

  
Os recomiendo que en estos casos os pilléis un descanso (podéis pedir todos los que queráis, con tal de avisar al proctored es suficiente), deis una vuelta y despejad la mente. Muchas veces la solución está delante de nosotros, pero por pensar demasiado de pueden obviar ciertas cosas. Y lo dicho antes, si habéis estudiado el curso y realizado los laboratorios, capacitados estáis para aprobar la prueba.

De la novena a la decimo novena hora no progresé mucho en cuanto a puntaje, pero tampoco pasa nada, quedaba bastante tiempo todavía. A partir de ahí, todo empezó a fluir, a ir sobre ruedas, y unas 12 horas después, ya tenía los 85 puntos mínimos para poder aspirar a aprobar el examen. Efectivamente, para poder obtener tu certificado del OSWE, necesitas obtener mínimo 85 puntos de los 100 posibles, y a eso de la hora 32 ya los había conseguido.

A partir de ahí me relajé mucho, y tras asegurarme de que tenía las capturas de pantalla suficientes para el reporte y que mis scripts funcionaban sin problema, me dispuse a ir a por los 100 puntos. Pedí terminar el examen en la hora 38, puesto que estaba muy cansado, aunque me quedaban todavía 10 horas.

Durante mi examinación, a pesar de que intenté dormir, no logré hacerlo por mucho tiempo debido a la cantidad de cafeína que me había tomado. En total habré tenido entre 6-7 horas de sueño en esas 38 horas, lo cual no es mucho. Por ello, nada más acabar el examen, me fui a dormir unas cuantas horas, porque la cosa no había acabado. Todavía quedaba la tediosa parte de realizar un buen reporte, con todos los detalles para poder conseguir la certificación. Y en ese aspecto Offensive Security suelen ser muy estrictos, así que más vale realizar un reporte muy detallado, con todos los pasos que has hecho, y con suficientes capturas de pantallas que complementen esa explicación. En total, mi reporte quedó en 71 páginas, por si queréis tenerlo de referencia, pero ya os digo que eso no importa nada. Sea más corto o más largo, lo importante es que contenga las cosas que te pide Offensive Security como requisitos y objetivos.

## Consejos para el examen

Tras contaros mi experiencia, quiero rescatar algunos consejos importantes de cara al examen:

- No bajéis los brazos. 48 horas es mucho tiempo, y aunque no os salgan las cosas a la primera, tened paciencia y perseverad. Hay casos de personas que no encontraron nada en las primeras 24 horas, y no fue hasta después que sacaron las cosas.

- Id relajados. Haced como que es un CTF más, y no le deis vueltas a las cosas.

- Desconectad de la certificación los días antes del examen. Esto es una recomendación personal, en general antes de los examenes de cualquier tipo me gusta despejar la mente y no pensar en la prueba.

- Siempre que os estanquéis por mucho tiempo, tomad descansos. Personalmente, me habré tomado como 10-15 descansos en el examen, salía a dar una vuelta y eso permitía a mi cerebro procesar las cosas y que me surgiesen nuevas ideas o cosas que podría probar.

- El examen está basado en el curso. Es posible que tengáis que aplicar el famoso "TRY HARDER" para sacar algunas cosas, pero recordad que el examen está ahí para evaluar vuestros conocimientos sobre el curso.

- Si encontráis algo que pueda parecer sospechoso, apuntaroslo en algún lado pero seguid explorando el código. Esto es para evitar que perdáis mucho el tiempo en algo que no os lleve a nada al final. Aunque también os digo, si sois buenos leyendo el código fuente, a simple vista deberías saber si algo podría ser vulnerable o no. Pero entiendo que los nervios en el examen pueden jugar una mala pasada.

- Tened buenos apuntes. Yo era de aquellos que no les daba la importancia a los apuntes, pero creedme que tener unos apuntes bien organizados, con funciones modulares preparadas, os pueden ahorrar mucho tiempo en el examen. No lo hice, porque consideré que me las podía apañar en el examen, pero lo mejor es tenerlo.

## Preguntas y Respuestas

En esta sección responderé a preguntas que tuve durante mi preparación para la certificación, además de preguntas de otras personas.

- ¿Es necesario sacarse el OSCP para apuntarse al OSWE?
    - No, no hace falta. No tengo el OSCP de momento, consideré que no era la certificación que más me apetecía hacer, y decidí ir de una al OSWE.

- ¿Mínimo cuántas horas al día le metiste?
    - No tengo experiencia de trabajo como desarrollador ni como pentester, y soy bastante novato todavía en hacking web. Por lo tanto, le metí muchas horas a entender los distintos frameworks y lenguajes (algunos no los había usado nunca), a entender el curso y practicarlo, a hacer directos en Twitch y practicar ahí. No lo tengo calculado, pero diría que unas 4-5 horas al día de media le habré metido durante 3 meses. Entended que no todo ha sido enfocado a la certificación, soy una persona muy curiosa y me gusta entender el por qué de las cosas, y muchas veces me he ido por las ramas para entender cosas puntuales.

- ¿Cuánto tiempo tienes ya en el campo y a los cuantos decidiste ir a por el OSWE?
    - Actualmente, llevo 1 año y 1 mes en el campo, y decidí inscribirme en el curso cuando llevaba 9-10 meses en el sector. En hacking web, el único background que tenía eran algunos laboratorios de PortSwigger y máquinas de HTB.

- ¿Es necesario hacerse todos los extra miles?
    - No hace falta, pero debéis saber elegir cuáles hacer. Hay algunos que sirven y ayudan mucho, otros no tanto. Cuantos más hagais, mejor, pero si no queréis hacerlos todos, lo dicho, hay que saber elegir.

- ¿Es necesario hacerse todo el curso/laboratorios?
    - Mi recomendación es que sí. Completaros el curso de A a Z, porque en el examen os puede salir cualquier cosa contenida en ellos. En cuanto a los laboratorios extra, lo dicho, dejároslo para el final a modo de challenge, y hacedlos sin ningún tipo de ayuda. Si lo conseguís, es buena señal para que empecéis a pensar en enfrentaros al examen.

- ¿eWPTXv2 vs OSWE?
    - A pesar de que ambas certificaciones son de web, el enfoque es distinto. eWPTXv2 es caja negra mientras que el OSWE es caja blanca. Considero que este último es más complejo, puesto que el curso entra en más detalles con las vulnerabilidades, se requiere de automatizar todo en Python, y en general es más difícil estar leyendo código durante horas que simplemente estar probando payloads a ver si funciona alguno.. En general, el OSWE me ha gustado mucho más.

## Recursos Adicionales

Por aquí os dejo algunos recursos adicionales que os pueden llegar a ser de utilidad, destaco el gitbook de Maiky, que contiene una explicación de muchas de las vulnerabilidades que veréis en el curso, y los laboratorios de bmdyy que os pueden servir para practicar un poco más (hay unos tres o cuatro enfocados a web y que podéis usar para preparar el OSWE) . La ventaja de estos labs es que tiene las soluciones en python, lo que os puede ser útil para ver como scriptear o automatizar ciertas vulnerabilidades.

- [Sonar Source Code Challenges](https://www.sonarsource.com/knowledge/code-challenges/advent-calendar-2022/)
- [Gitbook de Maiky](https://maikypedia.gitbook.io/oswe-awae/)
- [Laboratorios de bmdyy](https://github.com/bmdyy?tab=repositories)
- [Blog preparación AWAE, XSS a RCE](https://sarthaksaini.com/2019/awae/xss-rce.html)
- [Challenges WEB de HTB](https://app.hackthebox.com/challenges/retired) (hacerlo desde una perspectiva de caja blanca)
- [AWAE-PREP repositorio](https://github.com/wetw0rk/AWAE-PREP)

¡Y eso es todo por hoy! Espero de todo corazón que os haya gustado esta review y que os haya sido de utilidad.
