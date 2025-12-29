---
id: "ine-ewpt-review"
title: "eWPT Review - eLearnSecurity Web Application Penetration Tester 2022"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-03-11
image: "https://cdn.deephacking.tech/i/posts/ine-ewpt-review/ine-ewpt-review-0.webp"
description: "Review completa de la certificación eWPT de INE Security: curso de web pentesting, vulnerabilidades OWASP, examen práctico y mi experiencia como Web Penetration Tester."
categories: 
  - "certifications"
draft: false
featured: false
lang: "es"
---


Este finde pasado dije, me apetece entretenerme un rato, e hice el eWPT. Nah, en realidad no fue tan espontáneo, pero hubiera molado que hubiese sido así. En cualquier caso, salió bien:

![Certificado eWPT de INE](https://cdn.deephacking.tech/i/posts/ine-ewpt-review/ine-ewpt-review-1.avif)

Por lo que voy a hacer una review sobre que me ha parecido.

- [Contexto](#contexto)
- [¿Vale la pena?](#vale-la-pena)
- [¿Qué tan difícil es?](#qué-tan-difícil-es)
- [¿Qué necesito saber?](#qué-necesito-saber)
- [¿Cómo es el examen?](#cómo-es-el-examen)
- [¿Cómo es el Curso de Preparación?](#cómo-es-el-curso-de-preparación)
- [Tips](#tips)
- [Conclusión](#conclusión)

## Contexto

El eWPT o eLearnSecurity Web Application Penetration Tester es una certificación 100% práctica, que pone a prueba tus habilidades de pentesting web. Según eLearnSecurity, abarca los siguientes temas:

- Penetration testing processes and methodologies
- Web application analysis and inspection
- OSINT and information gathering techniques
- Vulnerability assessment of web applications
- OWASP TOP 10 2013 / OWASP Testing guide
- Manual exploitation of XSS, SQLi, web services, HTML5, LFI/RFI
- Exploit development for web environments
- Advanced Reporting skills and remediation

## ¿Vale la pena?

Pues diría que si la verdad, es una certificación bastante entretenida donde podrás poner a prueba diversos ataques web, y no solo eso, sino la capacidad de realizar un reporte, de familiarizarte con el OWASP Testing Guide, etc. Aparte de practicar los distintos ataques y demás, si lo enfocas de forma correcta, como si fuera una auditoría web real, está muy guay y puedes aprender mucho.

## ¿Qué tan difícil es?

Pues, ya lo dije con el eCPPTv2, personalmente pienso que no es difícil, pero que tampoco quiere decir que sea fácil. Si no tienes los conocimientos o los tienes muy limitados no podrás pasar la certificación. Aquí puede venir una comparación, ¿qué es más difícil, el eCPPTv2 o el eWPT?

Pues, son distintos, me explico, la parte web del eCPPTv2 es bastante más sencilla que la del eWPT, por lo que, la conclusión es:

- A nivel web, el eWPT es mas difícil.
- El eCPPTv2 abarca mas variedad de temas.

Por lo que, siguiendo estos dos principios, una persona puede aprobar el eCPPTv2 y suspender el otro, y viceversa. Personalmente, considero que ambas certificaciones van por distinto camino:

![Comparativa eWPT vs eCPPTv2](https://cdn.deephacking.tech/i/posts/ine-ewpt-review/ine-ewpt-review-2.avif)

Por lo que en este caso, no es cuestión de cuál hacer basándote en la dificultad, sino de, ¿a qué te quieres enfocar en este momento?.

En cualquier caso, volviendo al propio eWPT, ¿es difícil?, pues no, pero sí que tienes que tener experiencia con ataques web y entender como funcionan y demás.

## ¿Qué necesito saber?

Pues personalmente, lo que yo considero que debes de saber para poder abordar con éxito la certificación, es lo siguiente:

- Burp Suite, Burp Suite, y Burp Suite. Para mí, esta es la mejor herramienta de pentesting web sin ninguna duda, es totalmente indispensable saber usarla, ya sea para CTF o para la propia realidad. Y no, Burp Suite no es solo interceptar, mandar al repeater y ya. Tiene muchas características más superútiles.
- Saber como funcionan las cookies y las sesiones.
- En cuanto a ataques web, pues no puedo ser muy concreto porque sería spoiler, pero digamos que yendo a PortSwigger y haciendo todos los laboratorios de las vulnerabilidades más conocidas e importantes, irás bien. Aun así, échale un vistazo al [temario del curso de preparación](https://my.ine.com/CyberSecurity/courses/38316560/web-application-penetration-testing).
- Tener una idea de los sitios de referencias de vulnerabilidades más famosos, MITRE (CWE), OWASP, WASC Threat Classification, y además, por supuesto, usar el CVSS.

## ¿Cómo es el examen?

Cuando comienzas la certificación, te proporcionan la "carta de compromiso", básicamente es un PDF donde te dan todos los detalles necesarios para hacer el examen.

- Súper TIP, lee ultra mega híper bien la carta de compromiso antes de comenzar el examen.

Una vez leída la carta, simplemente te conectas por VPN al examen y tendrás los distintos activos web a auditar, por esta parte no hay mucho más que comentar.

El examen dura 14 días, tienes 7 días de laboratorio, es decir, 7 días para completar la parte práctica, y luego tienes otros 7 días para realizar el reporte. Yo empecé el examen un viernes sobre las 19:30 y para el sábado sobre las 21:00 ya tenía los requisitos mínimos junto a bastantes vulnerabilidades, el domingo hice el reporte y listo.

> En referencia a "los requisitos mínimos", en la carta de compromiso se te indica que el requisito mínimo, pero no suficiente, es hacer X. Dice no suficiente, porque aunque cumplas lo que se te indica, el objetivo del examen es encontrar y reportar todas las vulnerabilidades web que encuentres.

Volviendo al reporte, por si te sirve de guía, a mí me ocupó 72 páginas, literalmente me lo escribí todo el domingo y cuando acabé tenía las manos tan reventadas que me puse a jugar God Of War xD. Para el reporte puedes seguir alguna plantilla como la de [TCM](https://github.com/hmaverickadams/TCM-Security-Sample-Pentest-Report) o [TheMayor](https://themayor.notion.site/themayor/Pentesting-Notes-9c46a29fdead4d1880c70bfafa8d453a), que es como hice yo en el eCPPTv2, sin embargo, en este caso, decidí escribirlo todo de cero, pero cogiendo ideas de ambas plantillas. Una estructura que puedes seguir puede ser:

- Vulnerabilidad
    - Breve Descripción
    - Activos Afectados
    - Descripción Extendida
    - Impacto (CVSS)
    - Recomendaciones
    - Referencias

Puedes usar este modelo y adaptarlo a lo que consideres mejor.

## ¿Cómo es el curso de Preparación?

Pues, sinceramente, un coñazo.

![Gatitoooo](https://cdn.deephacking.tech/i/posts/ine-ewpt-review/ine-ewpt-review-3.avif)

Y si, lo digo en serio. Algo que personalmente no me gusta de eLearnSecurity es que te coloca un PowerPoint de 300 páginas de contenido, donde, si te ponen un trozo de código, ni siquiera puedes copiarlo directamente. Además, 300 páginas de PowerPoint está bien cuando llevas 20, pero cuando vas por la 100 estás un poco hasta los cojones. Personalmente, prefiero el contenido en vídeo, con alguien explicándomelo todo de forma dinámica y amena. Y que me pusiera el código en la descripción para poder copiarlo x) y hacer pruebas en local.

Ahora bien, por otro lado, algo que me encanta de eLearnSecurity es como entra en detalle en muchos temas. Cuando nos enfocamos tanto en hacer máquinas y ataques, a veces, olvidamos y no tenemos en cuenta la verdadera base para poder construir de forma más sólida sobre todo lo demás. Me encanta como explica de manera detallada cosas como las Cookies, el SOP, las sesiones... Y sí, pienso a veces que cosas tan básicas como esta, la damos por sabida porque es "sencillo", pero por esa aceptación de sencillez, a veces perdemos muchos detalles importantes. Y esta parte me encanta que eLearnSecurity la abarque.

Por lo demás, el temario puedes verlo en [el curso de Web Application Penetration Testing de INE](https://my.ine.com/CyberSecurity/courses/38316560/web-application-penetration-testing) sin estar autenticado. El temario en sí, toca algunas cosas típicas como SQLi, XSS, CSRF, LFI, RFI, Session Fixation... Pero también toca cosas no tan comunes y conocidas como el XPath Injection y el SOAP, entre otros. Si puedes ver el temario mejor, si no pues toca googlear e investigar por tu cuenta, que bueno, aunque tuvieras el temario, esta parte no te la quita nadie.

En cuanto a los laboratorios, no hay ninguno que me llamase la atención especialmente, eso sí, puedes practicar todas las vulnerabilidades y más, pero no creo que sean tan necesario o que valga tanto la pena como para pagarte la subscripción premium de INE.

## Tips

Diría Burp Suite, pero no es un tip, es una necesidad jeje. Más allá de eso, recomiendo muchísimo que hagas uso de Mapas Mentales, es decir, de esto:

![Ejemplo de mapa mental (XMind)](https://cdn.deephacking.tech/i/posts/ine-ewpt-review/ine-ewpt-review-4.avif)

Personalmente, la aplicación que recomiendo es [XMind](https://www.xmind.net/). Es una aplicación supercómoda e intuitiva. Hacer uso de un MindMap te ayudará mucho a organizarte y ver las cosas mucho más claras. De hecho, esta idea es bastante usada en Bug Bounty.

Aparte de esto, realmente el único tip adicional que puedo volver a mencionar es que leas muy bien la carta de compromiso que se te entrega al comenzar el examen.

## Conclusión

El eWPT es un examen bastante entretenido y que le puedes sacar bastante partido. Personalmente, lo recomiendo siempre que quieras aprender un poco más del tema web, aunque eso si, al fin y al cabo, el aprendizaje depende sobre todo de ti, y no tanto del examen.
