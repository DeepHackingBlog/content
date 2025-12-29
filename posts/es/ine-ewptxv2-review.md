---
id: "ine-ewptxv2-review"
title: "eWPTXv2 Review - eLearnSecurity Web Application Penetration Tester eXtreme 2022"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-08-22
image: "https://cdn.deephacking.tech/i/posts/ine-ewptxv2-review/ine-ewptxv2-review-0.webp"
description: "Review completa de la certificación eWPTXv2 de INE Security: curso avanzado de web pentesting, técnicas de bypass, examen desafiante y mi experiencia obteniendo la certificación."
categories: 
  - "certifications"
draft: false
featured: false
lang: "es"
---

La semana pasada estuve peleándome con la certificación de web más dura de eLearnSecurity, el eWPTXv2. Y después de muchas horas y días, al final se pudo pasar:

![Certificado eWPTXv2 de INE](https://cdn.deephacking.tech/i/posts/ine-ewptxv2-review/ine-ewptxv2-review-1.avif)

Por lo que vamos a ir viendo un poco que temas trata, y sobre todo que me ha parecido...

- [Contexto](#contexto)
- [¿Qué tan difícil es?](#qué-tan-difícil-es)
- [¿Qué necesito saber?](#qué-necesito-saber)
- [¿Cómo es el examen?](#cómo-es-el-examen)
- [Mi opinión](#mi-opinión)
- [¿Vale la pena?](#vale-la-pena)
- [Tips](#tips)
- [Conclusión](#conclusión)

## Contexto

El eWPTXv2 o eLearnSecurity Web application Penetration Tester eXtreme es la continuación del eWPT de eLearnSecurity. Es una certificación de hacking web 100% práctica que, según eLearnSecurity, abarca los siguientes temas:

- Penetration testing processes and methodologies
- Web application analysis and inspection
- Advanced Reporting skills and Remediation
- Advanced knowledge and abilities to bypass basics advanced XSS, SQLi, etc. filters
- Advanced knowledge of different Database Management Systems
- Ability to create custom exploits when the modern tools fail

## ¿Qué tan difícil es?

Dejando un poco al lado algunos temas que quiero comentar más adelante, la certificación no es fácil ni para principiantes, de hecho, es un gran salto respecto al eWPT. Este último yo conseguí hacerlo en menos de 24h, sin embargo, el eWPTX lo acabé la noche del sexto día, que quizás mis condiciones personales al hacerlo no han sido la misma en ambos exámenes, pero en cualquier caso, esa diferencia de tiempo, puede remarcar el gran salto que hay de una certificación a otra. Dicho esto, es una certificación que a mí personalmente me ha parecido muy artificial, es decir, el examen como tal me ha parecido que estaba hecho artificialmente para que sea difícil y estilo CTF, lo cual no me ha gustado mucho. Ahora bien, en cualquier caso, vamos a ver los temas que se tocan, o al menos, los necesarios a saber de cara al examen.

## ¿Qué necesito saber?

Para esta certificación, personalmente pienso que para poder enfrentarte a ella, debes de tocar casi todas las vulnerabilidades webs más comunes:

- XSS
- SQLi y SQLi con bypasses
- XXE y XXE Blind
- SSTI
- Deserializaciones Inseguras y Serializaciones en distintos lenguajes.
- SSRF
- CSRF
- Cookies y Sesiones
- Exposición de Información
- Malas configuraciones de seguridad comunes
- Entropía de Cookies
- Generación de Cookies
    - Un poco de criptografía

Todo esto para la parte práctica del examen. De cara al reporte, pues, saber clasificar las vulnerabilidades según el CVSS, categorizarlas siguiendo algún estándar, por ejemplo OWASP.

## ¿Cómo es el examen?

Aquí no hay mucha novedad, ya que sigue la misma línea que otras certificaciones de eLearnSecurity. Tienes 7 días para la parte práctica y 7 días para el reporte. Asimismo, en la parte práctica, tienes 4 reseteos del laboratorio por día.

Por lo demás, igual que siempre, se te entrega lo que se conoce como "carta de compromiso", donde se te explica el funcionamiento del examen, algún tip, el scope, y lo más importante, los requisitos mínimos, pero insuficientes, es decir, requisitos mínimos que debes de conseguir si o si, pero que no te aseguran en ningún momento el aprobado. Puedes tener esos requisitos mínimos cubiertos que, si no has encontrado muchas vulnerabilidades, pues suspenderás, de ahí lo de mínimos pero insuficientes.

## Mi opinión

Siendo totalmente sincero, a mí esta certificación no me ha gustado e incluso hubo momentos en los que lo pasé mal haciéndola, porque ocurren distintas cosas:

- Me parece muy CTF (en el mal sentido de la palabra)
- El laboratorio falla muchísimo

Este último punto me tocó bastante los nervios, debido a que hubo momentos en los que yo intentaba realizar una explotación y veía que no iba. Y claro, lo lógico que te puede ocurrir aquí, son dos cosas:

- Simplemente, esta vía de explotación no es la correcta
- El laboratorio está fallando, voy a resetearlo una vez por si acaso.

Es lo lógico. Ahora bien, a mí me pasó que estaba intentando explotar una vía y veía que no iba, reinicié el laboratorio una vez, lo intenté de nuevo y tampoco. Claro, aquí yo ya decía, oye, pues descarto esta vía. Sin embargo, me dio por preguntar a otro conocido que también estaba con el examen, para ver si él lo había intentado de la misma forma. Y efectivamente lo había hecho, pero a él si le había funcionado, claro, mi cara al decirme eso fue:

![Reacción al fallo del laboratorio](https://cdn.deephacking.tech/i/posts/ine-ewptxv2-review/ine-ewptxv2-review-2.avif)

Total, que reinicié el laboratorio una segunda vez y ahora si funcionó, por lo que, para que la vía de explotación correcta funcionase, me hizo falta dos resets del laboratorio. Teniendo en cuenta, que si yo no hubiera preguntado nada, hubiera descartado la vía correcta de explotación, por un fallo del propio laboratorio.

Es por esto, que esta certificación no me ha gustado nada, además, una de las veces que fui a resetear el laboratorio, me tardó 1 hora en reiniciar, así que esta parte tampoco va muy bien...

Aparte de todo esto, lo dicho, es una certificación bastante larga y que se puede hacer hasta pesada, sumando su punto de CTF.

## ¿Vale la pena?

Pues sinceramente, si tuviera que elegir, hubiera preferido haber estado una semana completa haciendo Bug Bounty, leyendo reportes de bug bounty, pagarme una suscripción a PentesterLab o simplemente leyendo artículos de hacking web. Si no os interesa mucho la certificación, yo optaría por una de estas alternativas, creo que a nivel personal una de estas opciones te aportará más.

## Tips

No hacerlo.

Nah, pero en el caso de que lo hagas, enumerar enumerar, y a la mínima de que veas que algo debería de estar funcionando, pero no lo hace, resetea el laboratorio sin dudarlo.

Además, no tengáis miedo de usar SQLMap o herramientas automatizadas que os puedan ayudar en algunos casos.

- De cara a SQLMap, si no conocéis su característica de "tampers", echadle un vistazo.

## Conclusión

Creo que con todo lo que he mencionado he dejado clara mi opinión, en cualquier caso, si ves que es una certificación que te puede aportar profesionalmente al CV y demás, hazla. Si no es el caso, aprende con otras alternativas que yo personalmente considero mejores.
