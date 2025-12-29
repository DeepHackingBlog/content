---
id: "ine-ejpt-review"
title: "eJPT Review  - eLearnSecurity Junior Penetration Tester 2021"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-06-14
image: "https://cdn.deephacking.tech/i/posts/ine-ejpt-review/ine-ejpt-review-0.webp"
description: "Review completa de la certificación eJPT de INE Security: curso para principiantes, material de estudio, examen práctico y mi experiencia como Junior Penetration Tester."
categories: 
  - "certifications"
draft: false
featured: false
lang: "es"
---

> Esta review ya está deprecated debido a la salida de la segunda versión de esta certificación, el [eJPTv2](https://ine.com/learning/certifications/internal/elearnsecurity-junior-penetration-tester-v2).

Hace 2 semanas me presenté al eJPT y pude sacarlo con éxito, quería hablar sobre que me ha parecido esta certificación y hacer una review ya que siempre veo personas que tienen dudas sobre la misma (al igual que yo antes de hacerla).Voy a intentar abordar cosas como:

- ¿Qué tan difícil es?

- ¿Qué necesito saber?

- ¿Vale la pena?

- ¿Cómo es el examen?

Voy a intentar resolver todas estas dudas para los que tengan pensado o se estén pensando en hacer la certificación ^^

- [Contexto](#contexto)

- [¿Vale la pena?](#vale-la-pena)

- [¿Qué tan difícil es?](#qué-tan-difícil-es)

- [¿Qué necesito saber?](#qué-necesito-saber)

- [¿Cómo es el examen?](#cómo-es-el-examen)

- [Tips](#tips)

- [Conclusión](#conclusión)

## Contexto

Antes de nada, pongámonos en contexto. El **eJPT** ó **eLearnSecurity Junior Penetration Tester**, es una certificación de eLearnSecurity pensada para personas que quieran empezar una nueva carrera en el campo de la ciberseguridad, enfocado al Pentesting. Es una certificación 100% práctica que segun eLearnSecurity aborda los siguientes temas:

- TCP/IP

- IP Routing

- LAN protocols and devices

- HTTP and web technologies

- Essential penetration testing processes and methodologies

- Basic vulnerability assessment of networks

- Basic vulnerability assessment of web applications

- Exploitation with Metasploit

- Simple web application manual exploitation

- Basic information gathering and reconnaissance

- Simple scanning and profiling the target

## ¿Vale la pena?

Diría que depende, si eres principiante, no sabes nada y quieres introducirte en este mundo, es una gran certificación para empezar ya que tocas lo esencial. Sin embargo, si ya eres mas o menos experimentado en el sentido de que has practicado con plataformas como TryHackMe o HackTheBox, puede que te parezca bastante sencilla la certificación.

En mi caso, yo antes de realizarla llevaba bastantes máquinas de TryHackMe hechas, y habia visto casi todos los directos desde hace 3 meses que s4vitar hace en twitch. Por lo que la metodología básica de un test de penetración la tenia mas o menos clara, aunque es algo que siempre se mejora con el tiempo.

También realicé el curso oficial que te recomienda eLearnSecurity para el eJPT de la mano de INE, es totalmente gratuito si te registras con el Starter Pass (Con una simple búsqueda en google lo encontrarás), si recién empiezas, es muy recomendable hacerlo ya que abarca todo desde cero.

A nivel de explotación el examen es muy básico, sin embargo, lo que mas noté y mejoré gracias al examen y los respectivos laboratorios del curso oficial fue la enumeración. En plataformas como THM o HTB estamos acostumbrados a tener una sola máquina y enumerar solo esa, además de conocer la IP de la máquina previamente.

Esto no es así en el eJPT. En la certificación te conectas por VPN a una red de la cual tu solo sabes la IP de red, gracias a la IP que te otorgan cuando te conectas. A partir de ahí, no sabes nada, por lo que no solo mejoras el Host Discovery, sino que además, cuando te encuentres frente a 7 máquinas por ejemplo y no solo 1, el cambio es abismal, se nota mucho. Ha sido de lo que mas me ha gustado de la certificación. Ha hecho que mejore en ese aspecto.

Y, volviendo al tema de si vale la pena, si eres principiante, si, 100% recomendada, si eres ya un poco experimentado, pues depende de ti. Si quieres mejorar la enumeración, además de obtener tu primera certificación y testear un poco a eLearnSecurity para ver como funciona, también la recomiendo. Pero tienes que ir con la idea, de que no va a haber casi nada de explotación.

## ¿Qué tan difícil es?

Arriba creo que mas o menos ya he dado una idea, pero básicamente, en explotación no es para nada complicado, es lo más básico en ese aspecto, con que sepas XSS, SQLi y alguna que otra explotación básica de windows todo bien. Lo que si, si no estás acostumbrado a enumerar es lo que mas te puede costar y abrumar al no ser solo 1 máquina, pero nada, poco a poco. Aparte de la enumeración y la explotación, lo demás son skills básicos que tienes que saber, lo veremos ahora.

## ¿Qué necesito saber?

Pues, los temas de los que debes controlar para poder abordar la certificación con éxito son:

- Host Discovery

- Ports Discovery

- Enrutamiento Manual –> ip route

- Fuerza bruta a Servicios

- Fuerza bruta a Hashes

- Fuzzing

- Explotación básica, ya sea Windows o Linux –> no hay que saber nada sobre escalada de privilegios

- XSS

- SQLi

- Wireshark

- Conocimiento básico de redes

## ¿Cómo es el examen?

Por último, me gustaría dar algunos tips de cara al examen y explicar por encima su estructura (no haré spoilers, no es mi objetivo).

La certificación consiste en un examen tipo test de 20 preguntas y 4 posibles opciones (algunas multirespuesta) basadas en la práctica. Es decir, si te preguntan la contraseña del usuario Pepito, pues obviamente lo tienes que averiguar, asi que el examen es 100% práctico en un entorno donde puede haber tanto máquinas windows como linux. Tienes 3 días completos para contestar al tipo test y entregarlo.

El examen se puede completar fácilmente entre 3 y 8 horas, es sencillo acabarlo el primer día, por no decir, que 3 días son tiempo de sobra para completarla con tranquilidad.

En esta certificación y en las de eLearnSecurity no están prohibida ninguna herramienta, es decir, puedes usar SQLMap, Metasploit y lo que quieras, además de que el examen no es proctored, nadie te vigila mientras lo haces.

Ésta básicamente es la estructura del examen.

## Tips

Tips como tal, mencionaría que fueras con calma, son 3 dias y 2 oportunidades de entregar el tipo test, además, son preguntas sencillas.

También destacaría que supieras como funciona el enrutamiento y las tablas de enrutamiento, prueba a montarte un laboratorio con 3 máquinas linux y 2 redes, e intenta que la máquina 1 use a la máquina 2 como router para poder comunicarse con la máquina 3 y viceversa, con esto seguro que te quedará bastante claro el tema, además, haz capturas con wireshark e intenta entender como se tramitan los paquetes, te ayudará.

Haz el mismo procedimiento de distintas formas, por ejemplo, cuando hagas host discovery, comprueba con al menos dos formas distintas que no se te escapa nada.

No juegues con mucha velocidad de paquetes cuando uses nmap, juega con un T4 o T5 como mucho, pero no le metas un min-rate, puede que no te detecte algún puerto de esta manera.

Organizate, no es 1 máquina como puedes estar acostumbrado, son varias, por lo que mantén tu zona de trabajo e información ordenada.

Trabaja en base a lo que te preguntan, es lo más cómodo.

Esto no es un CTF, seguro que muchas cosas son mas simples de lo que piensas.

Y el tip mas importante, disfruta aprendiendo.

## Conclusión

Esto creo que es todo lo que me hubiera gustado saber antes del examen, espero que te sirva de ayuda, de todas formas, me puedes contactar por [Linkedin](https://www.linkedin.com/in/juanantonio-gonzalez/) o [Twitter](https://twitter.com/sikumy) por si necesitas cualquier cosa o me quieras preguntar algo ^^. Si después de esto has decidido tanto presentarte como si no, está bien, en el caso de que lo vayas a hacer, mucha suerte, seguro que lo sacas ^^

Dicho esto,

**Happy Hacking!**
