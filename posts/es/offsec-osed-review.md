---
id: "offsec-osed-review"
title: "OSED Review - OffSec Exploit Developer 2024"
author: "adrian-diaz-aguilar"
publishedDate: 2024-04-29
updatedDate: 2024-04-29
image: "https://cdn.deephacking.tech/i/posts/offsec-osed-review/offsec-osed-review-0.webp"
description: "Experiencia personal y guía completa sobre la certificación OSED de Offensive Security: prerequisitos, consejos para el curso, laboratorios y estrategias para aprobar el examen."
categories:
  - "certifications"
draft: false
featured: false
lang: "es"
---

¡Bienvenido a todo el mundo! En esta publicación se estará hablando de mi experiencia con el OSED, una certificación que a priori mucha gente la descarta por ser de exploiting. Os contaré mi experiencia con esta, junto a algunos consejos que espero os puedan ayudar.

![Certificado OSED de Offensive Security](https://cdn.deephacking.tech/i/posts/offsec-osed-review/offsec-osed-review-1.avif)

- [¿Qué es el OSED?](#qué-es-el-osed)
- [Prerequisitos](#prerequisitos)
- [Cómo afrontar el curso](#cómo-afrontar-el-curso)
- [Ejercicios y Laboratorios](#ejercicios-y-laboratorios)
- [Examen](#examen)
- [Recursos Adicionales](#recursos-adicionales)

## ¿Qué es el OSED?

OSED son las siglas de [Offensive Security Exploit Developer](https://www.offsec.com/courses/exp-301/), y es una certificación enfocada en el desarrollo de exploits en sistemas Windows. Es requerida junto al [OSEP](https://blog.deephacking.tech/es/posts/offsec-osep-review/) y el [OSWE](https://blog.deephacking.tech/es/posts/offsec-oswe-review/) para aquellas personas que quieran obtener el [OSCE³](https://www.offsec.com/certificates/osce3/).

Según Offensive Security, en el curso se aprende lo siguiente:

- Aprender los fundamentos de reversing
- Crear exploits personalizados
- Desarrollar las habilidades necesarias para eludir las medidas de seguridad
- Escribir shellcode de Windows hecho a mano
- Adaptar técnicas antiguas a versiones más modernas de Windows

Personalmente, opino que es cierto y que el contenido del curso está bastante bien desarrollado. Tiene una progresión aceptable, aunque requiere dedicarle muchas horas.

Si bien es cierto que se centra únicamente en arquitecturas x86, amplía el campo del exploiting para que las personas puedan investigar y decidir si desean profundizar en él y, en el futuro, aspirar a obtener la certificación [OSEE](https://www.offsec.com/courses/exp-401/) u otras formas de explotación que están presentes en la actualidad.

Una cosa que recomiendo es, si es posible, pillar el [Learn One](https://www.offsec.com/products/learn-one/) para tomar esta certificación. En mi caso con 3 meses fui muy muy apretado y eso que estuve estudiando gran parte del día e incluso me salté algunos temas que consideraba no tan importantes para el examen.

## Prerequisitos

Offensive Security recomienda los siguientes prerequisitos para tomar el curso:

- Familiaridad con debuggers (ImmunityDBG, OllyDBG)
- Familiaridad con conceptos básicos de explotación en 32-bit
- Familiaridad con la escritura de código en Python 3

También, aunque opcionales, se recomienda tener los siguientes conocimientos:

- Capacidad para leer y entender código C a un nivel básico
- Capacidad para leer y entender código ensamblador de 32 bits a un nivel básico

Sin embargo, aunque creo que estos requisitos previos son suficientes para la primera mitad del curso, una vez que se avanza en [ROP (Return Oriented Programming)](https://en.wikipedia.org/wiki/Return-oriented_programming) y reversing, comprender el código ensamblador de 32 bits ya no es opcional. Se debe tener la mayor soltura posible antes de tomar el curso. Además, se puede ahorrar mucho tiempo en los primeros temas completando algunos de los tutoriales de escritura de [exploits de Corelan](https://www.corelan.be/index.php/2009/07/19/exploit-writing-tutorial-part-1-stack-based-overflows/).

Al igual que con todos los cursos de Offensive Security, se te enseña todo lo necesario además de los requisitos previos recomendados para aprobar el examen. Sin embargo, si no dispones de mucho tiempo para entender completamente todo lo que se explica, podría resultar difícil comprender absolutamente todo sin realizar preparación adicional.

## Cómo afrontar el curso

El [temario](https://www.offsec.com/courses/exp-301/download/syllabus) del curso es el siguiente:

- WinDbg and x86 Architecture
- Exploiting Stack Overflows
- Exploiting SEH Overflows
- Introduction to IDA Pro
- Overcoming Space Restrictions: Egghunters
- Creating Custom Shellcode
- Reverse Engineering for Bugs
- Stack Overflows and DEP Bypass
- Stack Overflows and ASLR Bypass
- Format String Specifier Attack Part I
- Format String Specifier Attack Part II

Es importante mencionar que mi experiencia previa en exploiting era bastante básica. Solo tenía conocimientos sobre el stack overflow que se aborda en el OSCP.

En el ámbito del exploiting, es crucial comprender completamente lo que se intenta lograr y tener cuidado de no romper el exploit. Como mencioné anteriormente, las cosas comienzan a complicarse a partir del tema de ROP. Para mí, una explicación que recibí de mi compañero Txhaka en su momento fue fundamental, ya que me permitió tener ese "clic" y empezar a comprender el por qué de lo que se estaba haciendo. Diría que es lo que más suele costar para la gente que no está tan metida en estos temas, por lo que se requiere practicar mucho (y llorar).

## Ejercicios y Laboratorios

A lo largo de los módulos, os iréis encontrando con ejercicios para reforzar los conocimientos que se han explicado. Además de los ejercicios habituales, también están disponibles los "Extra Miles". Para explicar en qué consisten, utilizaré la respuesta proporcionada por mi compañero Txhaka:

"Son ejercicios que van un poco más allá, y que no tienen solución pública. Vienen bien para poneros a prueba, y experimentar un poco esa sensación de estancarse y darse contra un muro, y aprender a desarrollar tu metodología para salir de ese estancamiento. Aunque Offensive Security no proporciona la solución a estos ejercicios, sí que pone a disposición de los estudiantes un foro donde se pueden ir intercambiando ideas para guiarse."

También es bastante recomendable que os unáis al servidor de Discord de [Offensive Security](https://discord.com/invite/offsec) y vinculéis vuestro Discord en el portal de estudiantes, para obtener acceso a los canales de las certificaciones y podáis comentar con otros estudiantes las dudas que os vayan surgiendo.

Si bien es cierto que yo no realicé todos los Extra Miles (por falta de tiempo), mi recomendación es que se vayan haciendo y os vayáis quedando con qué hace cada cosa para interiorizarlo y saber realizarlo en caso de que salga en algún laboratorio o en el examen.

Posteriormente, al final del temario se encuentran tres laboratorios. Estos son **muy pero que muy importantes** realizarlos e interiorizarlos bien. En general, la estructura de los cursos de Offensive Security permite que apruebes el examen si has realizado los ejercicios y laboratorios, pero en este curso diría que es de los más importantes de todos.

## Examen

Cabe mencionar que tuve que pagar un retake ($249) y aprobé en el segundo intento. La razón por la que suspendí es que decidí terminar el examen para poder prepararme mejor, aunque seguramente habría tenido tiempo suficiente para aprobarlo en el primer intento. Sin embargo, prefiero aprovechar al máximo cualquier certificación o curso que realice, así no me duele tanto pagarlo.

A continuación, explicaré la estructura de los exámenes de nivel 300 (PEN-300, WEB-300, EXP-301) de Offensive Security.

Se dispone de 48 horas para completar el laboratorio y luego 24 horas adicionales para elaborar el informe. En caso de finalizar antes de las 48 horas, se puede comenzar con el informe si así se desea, sin que el examinador ponga impedimento alguno. En el caso del OSED, el examen consta de tres tareas que pondrán a prueba los temas tratados durante el curso, incluido reversing para descubrir vulnerabilidades, la elaboración de exploits que eludan las mitigaciones de seguridad y la creación de shellcode personalizado (todo esto está sacado del siguiente [post](https://help.offsec.com/hc/en-us/articles/360052977212-EXP-301-Windows-User-Mode-Exploit-Development-OSED-Exam-Guide#section-1-exam-requirements) de Offensive Security). Respecto a la cantidad de puntos necesarios para aprobar, hacen falta un mínimo de 60 sobre 100.

En ambos intentos me encontraba bastante ajustado de tiempo, pero noté que estaba más tranquilo en el segundo. Es muy recomendable tomar descansos cuando uno lo considere necesario, ya que en este examen es muy fácil saturarse debido a la gran cantidad de aspectos que hay que tener en cuenta. Comparando mi experiencia en el examen con la de otros compañeros que lo han realizado, puedo decir que es bastante común acabar con un dolor de cabeza importante.

Durante las primeras 5 horas, logré resolver el primer ejercicio. Sin embargo, el tema del ROP me dejaba traspuesto, ya que no lo dominaba completamente, junto a los gadgets tan raros que me habían tocado. El resto de las horas estuve luchando para sacar la última parte (durmiendo quizás un total de 7 horas ambos días), hasta que finalmente me llegó la shell y pude leer la flag.

Una vez tuve ambos ejercicios completados, procedí a resetear las máquinas para comprobar que ambos eran 100% funcionales (es bastante recomendable comprobar que todo funciona correctamente contra un mismo host tras haber reseteado el lab).

Para realizar el reporte utilicé las plantillas de pandoc que se encuentran en el siguiente [repositorio](https://github.com/noraj/OSCP-Exam-Report-Template-Markdown). En lo personal me gusta bastante cómo se ve y la facilidad para ir rellenando la plantilla.

## Recursos Adicionales

Por último, a continuación dejo algunos recursos adicionales que pueden ser de utilidad para la certificación:

- [Binary Exploit Development 4 - DEP Bypass with VirtualAlloc](https://www.youtube.com/watch?v=phVz8CqEng8&ab_channel=GuidedHacking)
- [Exploit Development 5 - DEP Bypass with WriteProcessMemory](https://www.youtube.com/watch?v=8kYTDK9oKV8&ab_channel=GuidedHacking)
- [Repositorio de nop](https://github.com/nop-tech/OSED/tree/main)
- [Script code caver de nop](https://github.com/nop-tech/code_caver)
- [Colección de scripts de epi052](https://github.com/epi052/osed-scripts)
