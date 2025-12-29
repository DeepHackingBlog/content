---
id: "ine-ecpptv2-review"
title: "eCPPTv2 Review - eLearnSecurity Certified Professional Penetration Tester 2021"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-12-09
image: "https://cdn.deephacking.tech/i/posts/ine-ecpptv2-review/ine-ecpptv2-review-0.webp"
description: "Review completa de la certificación eCPPTv2 de INE Security: curso avanzado de pentesting, laboratorios complejos, examen de pivoting y mi experiencia obteniendo la certificación."
categories: 
  - "certifications"
draft: false
featured: false
lang: "es"
---

Estos últimos días he estado un poco ausente en general porque me estaba examinando del eCPPTv2. Ayer envié el reporte y...

![Certificado eCPPTv2 INE Security](https://cdn.deephacking.tech/i/posts/ine-ecpptv2-review/ine-ecpptv2-review-1.avif)

¡Aprobado!. Así que ya tengo la capacidad de poder hacer una review de esta certificación.

Antes que nada, voy a seguir un poco la estructura que hice con la review del eJPT:

- [Contexto](#contexto)
- [¿Vale la pena?](#vale-la-pena)
- [¿Qué tan difícil es?](#qué-tan-difícil-es)
- [¿Qué necesito saber?](#qué-necesito-saber)
- [¿Cómo es el examen?](#cómo-es-el-examen)
- [Tips](#tips)
- [Cheatsheet para aprobar 100% seguro no fake](#cheatsheet)

## Contexto

El eCPPTv2 o eLearnSecurity Certified Professional Penetration Tester, es el siguiente paso al eJPT. Lo que es para Offensive Security el OSCP, lo es el eCPPT para eLearnSecurity. Es una certificación 100% práctica que según eLearnSecurity abarca los siguientes temas:

- Penetration testing processes and methodologies, against Windows and Linux targets
- Vulnerability Assessment of Networks
- Vulnerability Assessment of Web Applications
- Advanced Exploitation with Metasploit
- Performing Attacks in Pivoting
- Web application Manual exploitation
- Information Gathering and Reconnaissance
- Scanning and Profiling the target
- Privilege escalation and Persistence
- Exploit Development
- Advanced Reporting skills and Remediation

## ¿Vale la pena?

Pues pienso que sí. La verdad que además de que al final es un plus para el curriculum y eso. La certificación como tal es muy entretenida, tocas diversas temáticas que mencionaremos más adelante, y te expones ante un laboratorio bastante completo donde tendrás que ejecutar tanto ataques web, de sistema, buffer overflow o escaladas de privilegios. La verdad que es una certificación muy chula.

## ¿Qué tan difícil es?

Pues personalmente diría que no es difícil, que ojo, esto no quiere decir que sea fácil. La certificación te exige una base de conocimientos que si no tienes no podrás pasarla. Mayormente, porque no podrás abarcar nada en el examen. Para alguien que recién empieza y se acaba de certificar del eJPT esta certificación le puede parecer un mundo. Porque la base que te exige el eCPPT no es ni por asomo la mitad de lo que te exige el eJPT.

Sin embargo, conociendo bien los temas y teniendo una base medianamente sólida de lo que necesitas, podrás no solo defenderte en el examen, sino desarrollarte y mejorar en el mismo.

## ¿Qué necesito saber?

Pues personalmente, lo que yo considero que debes de saber para poder abordar con éxito es lo siguiente:

- Pivoting/Port Forwarding tanto en Windows como en Linux
- Enumeración desde máquinas que no sean la tuya (muy útil los binarios compilados)
- Enumeración post-explotación en sistemas Windows y Linux
- Persistencia en Windows
- Escalada de Privilegios
- Ataques webs comunes
- Ataques comunes en Windows
- Buffer Overflow

Además de esto, te puede venir bien saber algún que otro módulo de enumeración post-explotación de metasploit.

El pivoting es super mega hiper importante. No puedes aprobar el examen si no sabes hacerlo, necesitas saber como funciona perfectamente y saber usar las herramientas correspondientes cuando hagan falta. Sabiendo manejar socat y chisel es suficiente, con eso ya puedes realizar todo lo que tengas que hacer, aun así, también te puede venir bien saber usar proxychains o netsh. Pero como tal, lo obligatorio y mínimo es chisel y socat (de todas estas herramientas tenéis tutoriales sobre pivoting en el blog). En resumen, sin pivoting te vas _pal carajo_.

Además de esto, saber enumerar a nivel web (no me refiero explícitamente a Fuzzing), ataques web comunes, enumeración en sistemas Linux y Windows, escalada de privilegios… Todos son conocimientos esenciales de cara al examen. Saber usar herramientas como CrackMapExec, psexec o mimikatz te vendrán fenomenal. Saber también como exponer puertos internos utilizando netsh, saber que es el LocalAccountTokenFilterPolicy y como te puede afectar, todas estas cosas suman y te ayudarán y facilitarán la vida mucho.

Por último, y no menos importante, el buen buffer overflow. Saber hacer un buffer overflow es indispensable, el que aparece en el examen es del mismo estilo que en el (antiguo) OSCP, es decir, sin protecciones y de 32 bits. El más básico de todos, literalmente sabiendo hacer lo mismo que en este [tutorial de Buffer Overflow en SLMail 5.5](https://blog.deephacking.tech/es/posts/buffer-overflow-en-slmail/) ya vas bien. Así que, de cara al examen, ten preparado un buen Windows 7 de 32 bits con Immunity Debugger y Mona.

## ¿Cómo es el examen?

Cuando comienzas la certificación básicamente se te entregan dos cosas, una es la "carta de compromiso" la cual básicamente te explica como funciona el examen, el objetivo, cosas a tener en cuenta para el laboratorio y el reporte. Digamos que es todo el contexto que necesitas.

Lo segundo es la VPN para que puedas conectarte al laboratorio, OJO, importante, antes de empezar la certificación, define bien y conoce las credenciales de la VPN, las puedes editar en la parte superior derecha de la web de eLearnSecurity.

![Configuración VPN del laboratorio eCPPTv2](https://cdn.deephacking.tech/i/posts/ine-ecpptv2-review/ine-ecpptv2-review-2.avif)

Digo esto, porque empecé y encendí el laboratorio, y cuando me di cuenta, no tenía las credenciales que le puse en su momento cuando hice el eJPT. Por lo que tuve que gastar un reset del laboratorio.

Hablando de esto último, puedes resetear el laboratorio hasta 4 veces cada día, ese es el límite.

Dicho esto, el examen dura 14 días. Tienes 7 días de laboratorio y otros 7 días para realizar el reporte. No tienes por qué seguir esto, me refiero, si acabas el examen y haces el reporte, todo en 4 días, puedes entregarlo perfectamente. Yo empecé el examen el día 3, entregué el reporte el día 8 y por suerte, han tardado menos de 1 día en corregírmelo (eLearnSecurity te indica que como mucho pueden tardar hasta 30 días laborables, pero que suele ser mucho menos).

No olvidar que eLearnSecurity no prohíbe ningún tipo de herramienta en sus exámenes, puedes usar lo que quieras.

En cuanto a cuanto se puede tardar en hacer el examen, yo pienso que estando un fin de semana al completo, da tiempo suficiente, hablando de la parte práctica. Yo empecé el viernes a las 6 de la tarde y el lunes por la mañana ya tenía todo listo, contando que, casi todo el día del domingo estuve fuera. Y ya pues desde el lunes al miércoles, que ya me lo tomé con bastante más calma, hice el reporte.

Para hacer el reporte podéis hacer uso de alguna plantilla, yo hice uso de la de TheMayor, que podéis descargar desde [la plantilla de pentesting de TheMayor en Notion](https://themayor.notion.site/themayor/Pentesting-Notes-9c46a29fdead4d1880c70bfafa8d453a). También está la de TCM que podéis descargar desde [el repositorio de plantillas de TCM Security en GitHub](https://github.com/hmaverickadams/TCM-Security-Sample-Pentest-Report). O podéis hacerlo de cero, eso ya a cada cual.

Por comentar, mi experiencia haciendo un reporte era 0, literalmente este es el primero que he hecho, así que si estás igual que lo estaba yo, no te preocupes. Siguiendo un poco la plantilla, poniéndole tu toque y estructurarlo de la forma que mejor creas, irás bien.

Para el reporte, recuerda tomar capturas de todo procedimiento y comando que ejecutes, mejor que sobren explicaciones y capturas que no que falten. Yo por ejemplo conforme hacia el examen iba haciendo capturas y pegándolas en un Word, con alguna frase descriptiva para poder identificar rápidamente de que eran esas capturas. Porque cuando tienes 2 páginas es fácil, pero cuando tengas 30 quizás cuesta un poco más jeje.

Como dato, a mí el reporte final me ocupó 65 páginas, esto no lo tomes como referencia del tipo, si haces menos páginas es peor, no, para nada. Un compañero mío su reporte fueron 47 páginas aproximadamente y también estuvo bien.

## Tips

Por comentar algún que otro tip, yo diría que creéis persistencia en todas las máquinas que podáis. No porque os lo pida el examen, sino por comodidad vuestra. Poder acceder a un equipo sin tener que volver a explotar la vulnerabilidad es bastante cómodo, sobre todo en un examen que llevará algún que otro día y conllevará que apagues el PC en ocasiones.

También, guarda las capturas de nmap cuando analices por primera vez un equipo. Así no tendrás que resetear el laboratorio para hacer captura de los puertos abiertos por defecto (como hice yo xd).

Por lo demás, no hay mucho más, tener los conocimientos ya mencionados previamente e ir con ganas.

## Cheatsheet para aprobar 100% seguro no fake

Si estás haciendo el examen y te quedas estancado, solo recuerda esto:

![Cheatsheet motivacional eCPPTv2](https://cdn.deephacking.tech/i/posts/ine-ecpptv2-review/ine-ecpptv2-review-3.avif)

Mientras hacia el examen, conforme avanzaba, me di cuenta en ocasiones de que todo era más fácil de lo que creía, por lo que me escribí esto en un folio. Recuerda que esto no es un CTF, las cosas no son tan complejas, que no quiere decir que sean fáciles, simplemente, no hay cosas tan rebuscadas.
