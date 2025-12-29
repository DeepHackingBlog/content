---
id: "ine-emapt-review"
title: "eMAPT Review - Mobile Application Penetration Tester 2025"
author: "daniel-moreno"
publishedDate: 2025-12-05
updatedDate: 2025-12-05
image: "https://cdn.deephacking.tech/i/posts/ine-emapt-review/ine-emapt-review-0.webp"
description: "Review completa de la certificación eMAPT de INE Security: preparación, examen, consejos y si realmente vale la pena para pentesting móvil."
categories:
  - "certifications"
draft: false
featured: false
lang: "es"
---

¡Aloh! ¿Qué tal va todo? Soy **eldeim**, ese es mi nombre _hacksor_, pero me llamo **Dani**. Hace unas semanas decidí aprender sobre hacking android/APKs y ya de paso, hacer una certificación sobre el mismo tema. Tras investigar me topé con la que "al parecer" se posiciona en el mercado como la mejor en pentesting móvil, la [eMAPT](https://ine.com/security/certifications/emapt-certification).

![Portada certificación eMAPT](https://cdn.deephacking.tech/i/posts/ine-emapt-review/ine-emapt-review-1.avif)

- [Contexto](#contexto)
- [¿Cómo fue mi preparación?](#cómo-fue-mi-preparación)
- [Consejos](#consejos)
- [Reforzar el conocimiento](#reforzar-el-conocimiento)
- [¿Cómo es el examen?](#cómo-es-el-examen)
- [¿Vale la pena?](#vale-la-pena)
- [Conclusión](#conclusión)

## Contexto

Sé que esta certificación no es tan popular en el sector del pentesting, ya que no se suele trabajar mucho con CTFs de hacking móvil/APK por ser un tema bastante de nicho. Pero entonces… ¿por qué decidí hacerla? ¿Y por qué os traigo esta review?

Bueno, la respuesta es más simple de lo que parece: ¿por qué no? Quiero decir, es necesario saber defenderse en todas y cada una de las ramas del hacking, así que decidí hacerla y aprender conceptos nuevos para mí. Además, nada cae en saco roto: en mi trabajo ya me han tocado algunas auditorías de APKs, donde pude poner en práctica lo aprendido.

Quienes os pongáis a investigar sobre certificaciones de hacking móvil/APK os daréis cuenta de que las dos más conocidas y populares son la eMAPT (de INE Security) y la PMPA (de TCM Security). Así que, tras mucha investigación (e inspirarme en Carlos Polop xD), decidí hacer la eMAPT.

## ¿Cómo fue mi preparación?

Bueno, para empezar… yo partía con **muy poco tiempo**, así que tuve que _tryhardearla_. Fueron unas **tres semanas aproximadamente** las que duró mi aprendizaje… y la verdad, no fue tan fácil como pensé.

> **Nota:** partía desde **cero conocimiento sobre Android** y todo lo relacionado con él.

Lo primero que hice fue aprovechar una oferta que salió sobre la **eMAPT**, siendo ese mi pistoletazo de salida. En total, me costó unos **260 € aproximadamente**. La verdad es que el contenido del curso prometía, siendo este:

- Reconocimiento y Análisis Estático (20%)
- Pruebas Dinámicas y Manipulación en Tiempo de Ejecución (20%)
- Pruebas de Seguridad en APIs y Backends (15%)
- Fundamentos de Seguridad en Aplicaciones Móviles (10%)
- Modelado de Amenazas y Mentalidad del Atacante (10%)
- Ingeniería Inversa y Desofuscación de Código (10%)
- Análisis de Malware Móvil (10%)
- Elaboración de Informes y Comunicación (5%)

![Contenido del curso eMAPT](https://cdn.deephacking.tech/i/posts/ine-emapt-review/ine-emapt-review-2.avif)

Unas **50 horas de vídeos**, con **21 labs**… Y siendo sincero, **faltan laboratorios por añadir** para esta certificación.

![Laboratorios del curso eMAPT](https://cdn.deephacking.tech/i/posts/ine-emapt-review/ine-emapt-review-3.avif)

Ahora viene la parte más importante: **¡tomar apuntes!** Aquí van mis recomendaciones para aprender más rápido y no sufrir tanto.

Esta certificación es… bueno, la verdad es que soy **ligeramente hater de INE Security**. De las tres certificaciones que hice con ellos, las tres me gustaron poco. **PERO, dejando eso de lado**, esta certificación es un tanto _rara_.

El **primer módulo** son unas **18 horas de vídeos teóricos**… un auténtico coñazo, la verdad. Pero bueno, es necesario para entender las bases. El **segundo módulo** es el más práctico: ahí están casi todos los _labs_ de Android e iOS, y es, obviamente, el más interesante. Y como veréis, el **último módulo** (que no terminé del todo por pura desesperación 😅), aunque es el más corto en horas, resulta ser el **más importante**.

> **Nota:** si tuviera que organizar los módulos por orden de importancia, sin duda sería **de abajo hacia arriba**…

## Consejos

Sinceramente (obviando la intro): el primer módulo os lo podéis medio saltar, pero ¡el segundo y, sobre todo, el último no! Está tan mal planteada la certificación y los módulos que no hay ni un solo lab práctico en el que tengas que usar `FRIDA` para liberar restricciones de root.

Así que… sin duda, haced este último; ahora entenderéis por qué.

![Módulos del curso eMAPT](https://cdn.deephacking.tech/i/posts/ine-emapt-review/ine-emapt-review-4.avif)

## Reforzar el conocimiento

No os quedéis solo con lo que ofrece INE. En mi caso, pagué un mes de **TCM Security** para poder ver todo el contenido de su [curso de Mobile Application Penetration Testing](https://academy.tcm-sec.com/p/mobile-application-penetration-testing):

![Curso de TCM Security sobre pentesting móvil](https://cdn.deephacking.tech/i/posts/ine-emapt-review/ine-emapt-review-5.avif)

El único problema que le veo a este curso es que no hay laboratorios o CTFs finales.

## ¿Cómo es el examen?

El examen dura 12 horas, tienes que responder 45 preguntas (incluyendo flags) y consta de tres partes:

1. Preguntas teóricas
2. Preguntas sobre análisis estático
3. Parte práctica con flags de 2 APKs de Android

Para la parte teórica de preguntas, las hice manualmente y, cuando terminé el examen, fui comprobándolas con ChatGPT. Y… **¡aviso! Se equivoca bastante.**

Hay algo que tenéis que tener muy claro, y que ya mencioné en los consejos: en las dos apps tenéis que **evadir o evitar medidas con FRIDA**, y sí, en los cursos **no hay ni un solo lab práctico** que te obligue a hacerlo. Solo existen algunos vídeos donde tocan el tema muy por encima.

En cuanto al examen… sinceramente, **bien**. Pero los módulos… (les he cogido mucha manía 😂). **Aprendí más en el examen** que viendo todos los módulos, porque resolver las dos APKs enteras sin haber tocado FRIDA antes fue una locura… pero no imposible.

Finalmente, para aprobar, debes de sacar mínimo un 70% de las preguntas. En mi caso, lo hice en unas 10h y media aproximadamente.

## ¿Vale la pena?

A pesar de todo lo ocurrido… ¡sí! Quiera o no, de mejor o peor manera, INE te enseña. Y actualmente sé cosas que antes no. Así que… si queréis aprender sobre hacking móvil/APKs, podría estar bien, **PERO** con estos pasos:

- Verse los dos últimos módulos/videos/labs, enteros.
- Tomar apuntes de todo, sobre todo del último módulo de malware.
- No confiarse en que, si hago bien todos los labs, aprobaré el examen; esto no es cierto: hay muchas cosas que son cruciales en el examen (literal: si no las haces no avanzas y suspendes) que **no tienen NI UN SOLO LAB**.
- Y por último, saber utilizar `FRIDA` con los [módulos de Frida CodeShare](https://codeshare.frida.re/) normales que tiene:

![Módulos de Frida CodeShare](https://cdn.deephacking.tech/i/posts/ine-emapt-review/ine-emapt-review-6.avif)

## Conclusión

Aprendes mucho a defenderte en el ámbito del hacking móvil/APKs; la certificación está bien. Sí necesitarás complementar el aprendizaje con recursos externos, pero sigue mereciendo la pena, sobre todo si buscas una acreditación que respalde lo que sabes hacer.
