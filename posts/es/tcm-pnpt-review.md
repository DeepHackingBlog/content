---
id: "tcm-pnpt-review"
title: "PNPT Review - Practical Network Penetration Tester 2022"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-07-04
image: "https://cdn.deephacking.tech/i/posts/tcm-pnpt-review/tcm-pnpt-review-0.webp"
description: "Review completa de la certificación PNPT de TCM Security: curso práctico de pentesting, Active Directory, examen realista de 5 días y mi experiencia obteniendo la certificación."
categories: 
  - "certifications"
draft: false
featured: false
lang: "es"
---

Esta última semana estuve presentándome a la famosa certificación de [CyberMentor](https://www.youtube.com/c/TheCyberMentor), el [PNPT](https://certifications.tcm-sec.com/pnpt/), y se consiguió aprobar 😎🍟

![Certificado PNPT de TCM Security](https://cdn.deephacking.tech/i/posts/tcm-pnpt-review/tcm-pnpt-review-1.avif)

Por lo que en este post vamos a estar hablando un poco de que me ha parecido y detalles de ella.

- [Contexto](#contexto)
- [Examen](#examen)
- [Cursos de Preparación](#cursos-de-preparación)
- [¿Vale la pena?](#vale-la-pena)
- [¿Qué tan difícil es?](#qué-tan-difícil-es)
- [¿Qué necesito saber?](#qué-necesito-saber)
- [Tip](#tip)
- [Conclusión](#conclusión)

## Contexto

Según la propia web oficial, el [PNPT o Practical Network Penetration Tester](https://certifications.tcm-sec.com/pnpt/), es un examen que evalúa la capacidad para realizar una prueba de penetración de red externa e interna a nivel profesional. Los estudiantes tendrán cinco (5) días completos para completar la evaluación y dos (2) días adicionales para escribir un informe.

Asimismo, se señala que los estudiantes deben:

- Realizar OSINT para reunir información sobre cómo atacar la red.
- Aprovechar sus habilidades de explotación de Active Directory para realizar evasión de AV y egress, movimientos laterales y verticales de la red y, en última instancia, comprometer el controlador de dominio de examen.
- Proporcionar un informe detallado y profesional.
- Realizar una presentación de 15 minutos enfrente de nuestros asesores.

Todo esto es a nivel práctico de lo que abarca el examen según la propia web oficial. Por mi parte, puedo asegurar que cumplen con lo que se menciona, si acaso, diría que en la parte de evasión de AV y egress, que, aunque si es cierto, no le tengáis miedo porque es muchísimo más sencillo de lo que podéis pensar, de hecho, incluso no me parecería mal que ni siquiera lo mencionasen, por lo que, no preocuparse por: "Ostias, que tengo que saber evasión de AV". Realmente no, no es así.

Dicho esto, el examen tiene dos precios:

- El examen solo, cuesta 299$. Esto te incluye, el intento de examen, y un intento adicional totalmente gratuito. Además, el voucher no caduca, es decir, que si lo compras, puedes hacer el examen hoy mismo o dentro de 2 años.
- Luego está el otro plan, que cuesta 399$, y, además de incluirte todo lo del otro plan, incluye, los 5 cursos de preparación y "necesarios" para el examen, que son:
    - [Practical Ethical Hacking](https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course)
    - [Linux Privilege Escalation for Beginners](https://academy.tcm-sec.com/p/linux-privilege-escalation)
    - [Windows Privilege Escalation for Beginners](https://academy.tcm-sec.com/p/windows-privilege-escalation-for-beginners)
    - [Open Source Intelligence (OSINT) Fundamentals](https://academy.tcm-sec.com/p/osint-fundamentals)
    - [External Pentest Playbook](https://academy.tcm-sec.com/p/external-pentest-playbook)

Aunque a la hora de escribir esto, hace poco que CyberMentor lanzó el [PNPT Live](https://academy.tcm-sec.com/p/pnpt-live), donde estará durante 25 semanas a dos horas semanales, viendo todo el contenido de los 5 cursos en directo de forma totalmente gratuita.

Así que en ese aspecto, hay flexibilidad para elegir que quieres hacer.

## Examen

Pues en el contexto, ya te haces una idea de como es el examen, pero básicamente, debes de hacer OSINT en una web que te proporcionan, en base a esa información, atacar el rango de la red externa, y a partir de la red externa, ganar acceso a la red interna, donde una vez dentro, tendrás que auditar el directorio activo y conseguir hacerte Domain Admin.

Como también se dijo antes, tienes 5 días para la parte práctica, y 2 para el reporte. Yo personalmente, la parte práctica, la empecé un viernes a las 21:00 y para las 19:30 del sábado, ya era Domain Admin, por lo que, 5 días da tiempo de sobra.

Una vez hice el examen, ya me tomé con calma el hacer el reporte, que, si no me equivoco, lo entregué el lunes y fueron unas 50 páginas aproximadamente. Ese mismo día, a las pocas horas, me enviaron un email diciendo que había pasado a la parte de la presentación:

![Email de aprobación PNPT](https://cdn.deephacking.tech/i/posts/tcm-pnpt-review/tcm-pnpt-review-2.avif)

En esta parte, que es la más innovadora, deberás presentar los resultados de la auditoria durante 15 minutos máximo en inglés. En mi caso, solo se lo presenté a Heath Adams (CyberMentor), pero conozco a otras personas, donde además de él, había otra persona. En cualquier caso, cuando llegas a esta parte, en el email te dicen que puedes usar el propio reporte, o una presentación en PowerPoint. Yo por mera comodidad, hice una presentación en PowerPoint que me ocupó unas 16 diapositivas, donde simplemente mencioné las vulnerabilidades encontradas y poco más, no debes de hacer un path completo de como desde cero has llegado a comprometer todo, con mencionar lo encontrado, decir estadísticas generales, y mencionar recomendaciones, suficiente.

Y realmente, ese es el examen:

- OSINT + Pentest Externo + Pentest Interno + Reporte + Presentación a Cliente = PNPT

Por mi parte, añadir que es un examen que, desde el momento que lo empiezas, se siente como un caso real.

## Cursos de Preparación

De los 5 cursos de preparación, yo he hecho los siguientes:

- [Linux Privilege Escalation for Beginners](https://academy.tcm-sec.com/p/linux-privilege-escalation)
- [Windows Privilege Escalation for Beginners](https://academy.tcm-sec.com/p/windows-privilege-escalation-for-beginners)
- [Open Source Intelligence (OSINT) Fundamentals](https://academy.tcm-sec.com/p/osint-fundamentals)
- [External Pentest Playbook](https://academy.tcm-sec.com/p/external-pentest-playbook)

Y de forma selectiva (seleccionando solo lo que me interesaba ver), el curso de [Practical Ethical Hacking](https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course), el considerado "curso principal".

Aquí varios detalles, los 4 cursos que sí que he completado, los hice en una semana porque aproveché que TCM puso una prueba gratuita de sus cursos durante 7 días, por lo que, tenía que aprovechar xD. Así que me hice esos 4 cursos súper corriendo y viendo los videos a 1,5 de velocidad, por lo que quizás se me pasara algo. Ahora bien, no considero que estos 4 cursos sean necesarios, por supuestos que los temas que abarca cada uno, viene bien conocerlos, pero, que si en vez de aprenderlos con estos cursos, ves los mismos temas, de otra forma o por tu cuenta, no habrá mucha diferencia. Por ejemplo, para temas de escalada de privilegios, si me tuviese que quedar con dos cursos (Linux y Windows), serían los de [Tib3rius en Udemy](https://www.udemy.com/user/tib3rius/), esos cursos de privesc, recomendados la verdad.

Ahora bien, el curso que quizás es un poco más importante que le eches un vistazo, sería el de [Practical Ethical Hacking](https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course), sobre todo, destacaría la parte de directorio activo y pivoting. Ahora bien, llegamos a lo mismo, si ves los mismos temas, pero por tu cuenta, pues tampoco es necesario el curso xD. Pero de los 5 cursos, si me tengo que quedar con uno para hacer, sería este.

## ¿Vale la pena?

El examen, un rotundo si, ahora bien, si lo que buscas es una certificación con reputación, buscada y valorada por las empresas, mala suerte, al menos a la hora de escribir esto. Que eso si, si TCMS sigue este camino de hacer certificaciones innovadoras y reales, no me cabe duda que llegará a ser una empresa certificadora bastante respetada. Pero como no lo es ahora, y el futuro es incierto, pues el PNPT no está valorado, y mucho menos en países hispanohablantes. Dejando a un lado la reputación, si lo que buscas en un examen chulo y que te ponga a prueba, además de experimentar lo especial de esta certificación como es el OSINT, Pentesting Externo y presentación de resultados al cliente, pues, adelante, a por el PNPT.

## ¿Qué tan difícil es?

Pues, comparándola con otras certificaciones, para mí, es un eCPPTv2 con esteroides y mucho mejor, si tuviese que hacer un orden de certificaciones por dificultad, sería el siguiente:

- eJPT < eCPPTv2 < PNPT < CRTP

Ahora bien, sinceramente me parece la certificación perfecta para, quien la apruebe, pueda decir, que es un Pentester Junior. ME EXPLICO, lo que parece que es actualmente el eJPT (Junior Penetration Tester y, la primera certificación para muchos), yo pondría ahora en ese lugar, el PNPT.

Volviendo ahora un poco a la dificultad, es una certificación que se nota que no está artificialmente creada para que sea un CTF y rebuscada. Por lo que, dominando los distintos temas que abarca, y de nuevo, teniendo en cuenta que no es un CTF, la certificación se puede pasar sin problemas. Ahora bien, ¿qué temas abarca?

## ¿Qué necesito saber?

Lo que yo considero que se debe de saber para pasar la certificación, es:

- Tener la mentalidad de como se realiza un pentest externo, es decir, tener la mentalidad de que, tendrás que realizar un proceso de búsqueda de información que te podrá servir en los activos publicados a internet de la empresa en cuestión.
- Pivoting
- Directorio Activo

Y realmente es eso, puede parecer """poco""" pero la idea no es que sea ni mucho ni poco, sino que los temas que se abarcan, se conozcan y se pongan a prueba bien.

## Tip

El tip que voy a mencionar ya lo he estado mencionando a lo largo del post, pero quiero hacer de verdad hincapié porque mucha gente se puede quedar atascada por esto, y es que, esto no es un CTF, no es una máquina de HackTheBox, no es una máquina de TryHackMe. Las cosas no son tan rebuscadas, ojo, que no se me malinterprete, esto no quiere decir que la certificación sea más sencilla que cualquier máquina o CTF de estas plataformas, para nada. La certificación tiene su dificultad, pero ganada por lo que es, y no por haberlo creado artificialmente más difícil.

## Conclusión

El PNPT es una certificación muy chula, que, aunque no esté ahora mismo muy reconocida, seguramente poco a poco lo vaya siendo, sí que es cierto, que seguramente ocurra esto más en países de habla inglesa y no tanto en hispanohablantes, pero, dejando esto a un lado, el examen como tal, es una gran experiencia por lo innovador que es y por como es.
