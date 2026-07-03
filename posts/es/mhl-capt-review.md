---
id: "mhl-capt-review"
title: "CAPT Review - Mobile Hacking Lab Certified Android Penetration Tester 2026"
author: "daniel-moreno"
publishedDate: 2026-07-03
updatedDate: 2026-07-03
image: "https://cdn.deephacking.tech/i/posts/mhl-capt-review/mhl-capt-review-0.webp"
description: "Review completa de la certificación CAPT de Mobile Hacking Lab: preparación, examen de 72h contra iBank y comparación con la eMAPT de INE."
categories:
  - "certifications"
draft: false
featured: false
lang: "es"
---

¡Aloh! ¿Qué tal va todo? Soy **eldeim**, ese es mi nombre _hacksor_, pero me llamo **Dani**.

Os traigo una review bastante curiosa sobre otra certificación de hacking móvil, CAPT, de la mano de Mobile Hacking Lab (MHL) y además, una comparación con la famosa eMAPT de INE.

Daré mi opinión sincera sobre ambas y cosas a tener en cuenta al estudiar esta certificación.

![Portada certificación CAPT de Mobile Hacking Lab](https://cdn.deephacking.tech/i/posts/mhl-capt-review/mhl-capt-review-1.avif)

- [Contexto](#contexto)
- [¿Cómo fue mi preparación?](#cómo-fue-mi-preparación)
- [TIPS](#tips)
- [Reforzar el conocimiento](#reforzar-el-conocimiento)
- [¿Cómo es el examen?](#cómo-es-el-examen)
- [Mi experiencia](#mi-experiencia)
- [Comparación con otras certificaciones (CAPT vs eMAPT)](#comparación-con-otras-certificaciones-capt-vs-emapt)
- [¿Vale la pena?](#vale-la-pena)
- [Conclusión](#conclusión)

## Contexto

La [**CAPT (Certified Android Penetration Tester)** de Mobile Hacking Lab](https://www.mobilehackinglab.com/courses/capt-certification) es una certificación práctica orientada al pentesting de aplicaciones Android.

Muy reconocida, aunque es un sector muy "nicho" y esta combina laboratorios hands-on sobre vulnerabilidades reales con un examen final de 72 horas contra una app bancaria intencionalmente vulnerable llamada iBank (de la cual hablaremos después).

![App bancaria vulnerable iBank del examen CAPT](https://cdn.deephacking.tech/i/posts/mhl-capt-review/mhl-capt-review-2.avif)

El curso se estructura en tres grandes categorías de ataque:

La primera es **IPC (Inter-Process Communication)**, que cubre cómo abusar de los componentes Android expuestos al exterior:

- Broadcast Receivers exportados con cifrado AES/ECB débil
- Activities exportadas con deep links y análisis de memoria con Frida y Objection
- Services exportados con command injection vía nombre de archivo
- Content Providers exportados con brute-force offline de PIN de 4 dígitos
- Deep link hijacking combinado con WebView JavaScript bridge para llegar a RCE
- XSS en WebView innerHTML que pivota a través del bridge hacia ejecución de comandos
- WebView con DSBridge sin validación de origen para robar JWTs y hacer account takeover

La segunda categoría es **Data Storage**, donde se trabaja:

- SQL Injection en queries INSERT de SQLite local para escalada de privilegios de usuario normal a Admin

La tercera es **Platform Issues**, que cubre:

- Deserialización insegura de YAML con SnakeYAML y gadgets locales del propio APK para RCE
- Path traversal con codificación `%2F` para escribir una librería nativa maliciosa y cargarla con `System.load()` (Document Viewer)
- Stack buffer overflow en código JNI nativo (para mí lo más difícil, pero nada de lo que preocuparse para el examen (porque no cae xd))

## ¿Cómo fue mi preparación?

Siendo realista, yo ya partía con muy buena base de hacking móvil. Hace unos ~6 meses hice la certificación de INE-eMAPT, en la cual aprendí alguna que otra cosa ya de hacking móvil (pero spoiler, no tanto como en esta).

> _Os dejo por aquí la [review de la eMAPT de INE](https://blog.deephacking.tech/es/posts/ine-emapt-review/)_

A pesar de tener ya la base hecha y de haber hecho varias auditorías de aplicaciones Android (y iOS) en mi empresa, decidí tomármelo como un aprendizaje desde 0.

¡Mobile Hacking Lab te da el contenido de sus cursos totalmente gratis! Cosa que me parece raro pero muy chulo. Desde su misma web puedes entrar, verlo y hacerlo.

![Curso gratuito de Mobile Hacking Lab](https://cdn.deephacking.tech/i/posts/mhl-capt-review/mhl-capt-review-3.avif)

Así que, decidí hacer todo el [PATH de aprendizaje](https://academy.mobilehackinglab.com/course/free-android-application-security-course) que te regalan (el cual es clave para entender cómo es el examen).

## TIPS

¡VALE! Ahora la parte jugosa, cosas que he aprendido por el camino y que os voy a ahorrar muchoooo tiempoooo…

Durante el estudio del PATH de aprendizaje, llegó una parte donde te recomendaban unas ciertas CTF para realizar e ir preparado al examen. ¡SÍ! Has leído bien, [CTFs de hacking móvil](https://academy.mobilehackinglab.com/free-mobile-hacking-labs), HAY POCAS DE ESTE ESTILO.

> _Antes de nada hay que entender un poco su modelo de negocio. ¡MHL tiene sus cursos gratis y además, sus CTF gratis! Tiene muchas y de diferentes tipos de aplicaciones (Android y iOS) donde se explotan diferentes vulns._

![CTFs gratuitas de Mobile Hacking Lab](https://cdn.deephacking.tech/i/posts/mhl-capt-review/mhl-capt-review-4.avif)

Ahora bien, es cierto que estas CTFs son gratis pero… MHL te da dos opciones de realizar estas:

1ª — Te da el .APK (de la CTF de Android) o el .IPA (de la CTF de iOS) para que te las descargues, la ejecutes en tu emulador y la resuelvas

2ª — Te monta un entorno (basado en un software suyo llamado Corellium), el cual ya te emula un teléfono, con la aplicación y herramientas subidas y tú solo tienes que conectarte por VPN para tener visibilidad con el teléfono emulado.

![Entorno Corellium para las CTFs de MHL](https://cdn.deephacking.tech/i/posts/mhl-capt-review/mhl-capt-review-5.avif)

El dilema de todo esto es que, al crearte una cuenta en MHL te dan una "cierta" cantidad de "créditos", con los cuales funciona el emulador suyo de Corellium. Si se te gastan, tienes que recargarlos con unos 20€ por +600 créditos →

![Recarga de créditos de Corellium en MHL](https://cdn.deephacking.tech/i/posts/mhl-capt-review/mhl-capt-review-6.avif)

> _Cuando descubrí esto, todo me encajó. Porque cuando vi todo gratis y con ofertas, lo primero que pensé fue: ¿de dónde sacan rentabilidad de esto?_

¡VALE! Aun así, ¿qué hice yo para no dejarme demasiado dinero?

1. Me creé una checklist de máquinas a realizar (ahora después hablaremos de esto).
2. Usando el conocimiento que te da el módulo + alguna que otra cosa que busqué personalmente, me creé un emulador del teléfono en Android Studio
3. Me descargaba de cada CTF, su .apk y me lo subía a mi teléfono rooteado y emulado en Android Studio para hacerlo y poder tirarme el tiempo que quisiera sin que se gastaran los créditos de MHL.
4. Por último, tras tomar el PoC de cada CTF, decidí dejarme 2 CTFs para hacerlas únicamente con Corellium y gastar los créditos gratuitos que te dan al iniciar sesión en MHL

Con esto, conseguí dos cosas: no gastarme dinero en créditos y familiarizarme con el entorno de Corellium (el cual se usa para el examen, de esto hablaremos ahora).

## Reforzar el conocimiento

¡Ahora sí! Yo, tras ver todo esto y hacerme el PATH de aprendizaje de MHL, armé una lista de CTFs para hacer y aprobar así el examen (asegurado) →

![Checklist de CTFs recomendadas para preparar el examen CAPT](https://cdn.deephacking.tech/i/posts/mhl-capt-review/mhl-capt-review-7.avif)

![Checklist de CTFs recomendadas para preparar el examen CAPT](https://cdn.deephacking.tech/i/posts/mhl-capt-review/mhl-capt-review-8.avif)

![Checklist de CTFs recomendadas para preparar el examen CAPT](https://cdn.deephacking.tech/i/posts/mhl-capt-review/mhl-capt-review-9.avif)

## ¿Cómo es el examen?

Tras completar este curso (o cuando consideres que estás listo), existe la posibilidad de realizar un examen para convertirte en Certified Android Penetration Tester (CAPT).

El precio de este es 250€, pero… Sí existe una oferta en la que te dan dos certificaciones por el precio de una (2x1).

> _Esta fue la que yo compré. Obtuve la CAPT (de hacking Android) y la CIPT (de hacking iOS) por 250€ totales. Ya no está disponible pero sé que se pone cada ciertos meses de oferta._

![Oferta 2x1 CAPT + CIPT](https://cdn.deephacking.tech/i/posts/mhl-capt-review/mhl-capt-review-10.avif)

El examen simula un pentest real contra una aplicación móvil Android, y debes encontrar y explotar el mayor número posible de vulnerabilidades basándote en el OWASP Mobile Top 10 y el OWASP MASVS y entregar un informe de pentesting en un plazo máximo de 72 horas.

### ¿Cómo lo hice yo?

Fácil, no es tan difícil si te haces esas CTFs. Yo empecé un sábado a las 11:30am (porque para el examen hay que fijar una fecha) y ese día hice unas 18 h seguidas más o menos. Al día siguiente (domingo), continué sobre la misma hora e hice unas 2 h más y el resto del día hasta las 9pm, hice el informe y lo entregué (unas 10 h más aprox).

![Progreso del examen CAPT durante el fin de semana](https://cdn.deephacking.tech/i/posts/mhl-capt-review/mhl-capt-review-11.avif)

### Cómo hacer el informe

Okay, muchos os lo estaréis preguntando… ¿Cómo va esto del informe?

> _Yo me calenté un poco la cabeza_

MHL te da un archivo WORD en modo plantilla para que tú lo sobrescribas y realices ahí tu informe, fácil. El problema para mí… es que esto es un coñazo y desde mi punto de vista, desactualizado.

> _Además, yo tengo que hacer dos exámenes de este estilo y paso de tener que hacer dos veces un WORD_

Así que… decidí, coger este archivo WORD y transformarlo a una plantilla válida para que lo lea SysReptor jeje. Porque… MHL no tiene ninguna.

Gracias a este, hice el informe entero, tardé menos y aprobé entregando un informe de calidad.

Y sí… soy un poco filántropo xd, os dejo por aquí el enlace a mi GitHub para que os lo descarguéis y lo podáis usar GRATIS. Que diosito me bendiga.

- [Plantilla de SysReptor para el examen CAPT de MHL](https://github.com/eldeim/MobileHackingLab-Sysreptor-Template)

## Mi experiencia

Fue bastante buena, como ya hice 2 CTFs con el software suyo Corellium, estaba familiarizado y fue todo ir revisando, encontrando, explotando y reportando. La verdad que me sentí cómodo, no tuve ningún imprevisto tampoco (no como en otras certs). 10/10

## Comparación con otras certificaciones (CAPT vs eMAPT)

Vale, la parte crítica. ¿Cuál es mejor?

La respuesta corta es: CAPT, sin ninguna duda.

La respuesta larga es: ambas, yo empezaría (si no tuviera ni idea de hacking móvil), por la eMAPT ya que es mucho más fácil (y con más renombre). Y después, haría la CAPT ya que tiene más tecnicismo profundo.

Aun así, no sé qué hace INE… que su forma de enseñar no me llega a gustar, no sé si es el relleno… o los profesores… pero en este caso MHL fue simple y buena. Las CTFs también están muy bien. Por poner alguna pega, los logos de las certificaciones me parecen algo cutres, demasiada IA xd sin más xd (por poner una pega xd).

![Logos de las certificaciones CAPT y CIPT](https://cdn.deephacking.tech/i/posts/mhl-capt-review/mhl-capt-review-12.avif)

No tengo más que añadir, recomendaría ir a la review que hice en su momento de INE-eMAPT:

- [eMAPT Review - Mobile Application Penetration Tester 2025 - Deep Hacking](https://blog.deephacking.tech/es/posts/ine-emapt-review/)

## ¿Vale la pena?

¡SÍ! Sin duda, por lo que vale la certificación (250€) y todo lo que aprendes… merece mucho la pena. Yo estoy muy contento incluso con el PATH que hice: eMAPT -> CAPT + CTFs -> CIPT + CTFs.

Me parece equilibrado y realista escalando la complejidad. Si queréis dedicaros al hacking móvil, es una muy buena manera de aprender.

## Conclusión

Fue una certificación chula y técnica. Puedo decir que me retó en varios aspectos y también hizo que me gustara más aún el hacking móvil.

Espero que, si estáis leyendo esto, os animéis a hacerla. Si le ponéis tiempo y ganas, llegaréis a ser unos "entendidillos pros del tema".

> _Recordar, con tiempo y con saliva… bueno, no siempre xd_

Este fui yo al recibir la certificación:

![Diploma de la certificación CAPT](https://cdn.deephacking.tech/i/posts/mhl-capt-review/mhl-capt-review-13.avif)

> _Salu2, with love eldeim_
