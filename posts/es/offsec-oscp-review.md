---
id: "offsec-oscp-review"
title: "OSCP Review - Offensive Security Certified Professional 2022"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-10-31
image: "https://cdn.deephacking.tech/i/posts/offsec-oscp-review/offsec-oscp-review-0.webp"
description: "Review completa de la certificación OSCP de OffSec: curso legendario de pentesting, laboratorios PWK, examen de 24 horas y mi experiencia obteniendo la certificación más reconocida."
categories: 
  - "certifications"
draft: false
featured: false
lang: "es"
---

Bueno, por fin ha llegado la hora de que hablemos en este blog sobre, sin lugar a dudas, la certificación más conocida de hacking:

![Certificado OSCP de OffSec](https://cdn.deephacking.tech/i/posts/offsec-oscp-review/offsec-oscp-review-1.avif)

El _**O ES CI PI**_ ó **_O ESE C PE_**.

Sé que hay mil reviews de esta certificación que podéis encontrar, pero no en todas la compararán con otras certificaciones, y es donde creo que estará lo más especial de este artículo. Pero antes de llegar a eso, vamos a ver algunas cositas:

- [Contexto](#contexto)
- [¿Cómo es el examen?](#cómo-es-el-examen)
- [¿Qué necesito saber?](#qué-necesito-saber)
- [Comparación a otras certificaciones](#comparación-a-otras-certificaciones)
- [¿Vale la pena?](#vale-la-pena)
- [¿Cómo prepararse?](#cómo-prepararse)
- [Guías Oficiales](#guías-oficiales)
- [Conclusión](#conclusión)

## Contexto

El OSCP o Offensive Security Certified Professional, es un examen y curso, donde según Offensive Security, aprenderás los siguientes temas:

- Penetration Testing: What You Should Know
- Getting Comfortable with Kali Linux
- Command Line Fun
- Practical Tools
- Bash Scripting
- Passive Information Gathering
- Active Information Gathering
- Vulnerability Scanning
- Web Application Attacks
- Introduction to Buffer Overflows
- Windows Buffer Overflows
- Linux Buffer Overflows
- Client-Side Attacks
- Locating Public Exploits
- Fixing Exploits
- File Transfers
- Antivirus Evasion
- Privilege Escalation
- Password Attacks
- Port Redirection and Tunneling
- Active Directory Attacks
- The Metasploit Framework
- PowerShell Empire

Todos estos temas se ven en los respectivos ejercicios con su temario. En algunos, la teoría deja un poco que desear, pero bueno, al menos algo se ve. En cualquier caso, lo verdaderamente interesante del OSCP es el laboratorio, donde actualmente si no me equivoco hay 75 máquinas, esta parte es la que más importa de cara al examen.

## ¿Cómo es el examen?

El examen, como mucha gente conoce ya, consta de 100 puntos, donde para aprobar necesitas al menos 70. Estos 100 puntos se dividen en:

- 60 puntos - 3 máquinas independientes (Standalones)
    - Cada una de estas máquinas valen 20 puntos
        - Estos 20 puntos están formados por 10 puntos de conseguir acceso a la máquina, y otros 10 por escalar privilegios y convertirnos en administrador/root.
- 40 puntos - Directorio Activo - 2 clientes y 1 DC
    - Aquí, a pesar de que haya distintas flags (local.txt y proof.txt) a lo largo de las máquinas del directorio activo, no sirven de nada si no comprometes el directorio activo al completo, básicamente, o consigues 40 puntos o nada.

Estos son los puntos en cuanto al propio examen, además, si realizas lo siguiente:

- 30 máquinas del laboratorio
- 80% de los ejercicios de cada categoría

Puedes conseguir 10 puntos extras.

Por lo que, las formas de aprobar el examen, serían:

- AD + 1 máquina Standalone + 10 puntos del laboratorio y los ejercicios
- AD + 1 User de una Standalone + 1 User de otra Standalone + 10 puntos del laboratorio y los ejercicios
- 3 máquinas Standalones + 10 puntos del laboratorio y los ejercicios

- AD + 1 máquina Standalone + 1 User de otra máquina Standalone
- AD + 3 Users de tres máquinas Standalones

Todo esto sería en cuanto a la distribución de los puntos. Ahora bien, simplemente porque quede claro, las máquinas Standalones son simples máquinas como las que podemos encontrar en plataformas como HackTheBox o TryHackMe, misma idea y procedimiento.

Por lo demás, no hay mucho más que comentar respecto al contenido del examen.

El OSCP como también muchos sabrán, es Proctored, es decir, es un examen donde te están observando a través de la cámara mientras lo realizas. Que, hablando un poco de esto, me parece bastante curioso el procedimiento que sigue Offensive Security aquí. Me explico, el mero procedimiento de cuando te conectas al Proctored, haces la comprobación de tu DNI, enseñas la habitación, etc etc. Todo ese proceso está tan formalmente y bien medido que tú, psicológicamente, antes de empezar el examen, ya sientes que es un examen distinto a cualquiera que hayas hecho, o, al menos, esa es la sensación que ellos consiguen. Y lo mismo ocurre durante el transcurso del examen y la entrega del reporte.

Sinceramente, creo que esta pequeña razón, es por la cual muchas personas, cuando hablan de esta certificación, lo hacen con respeto:

- Buah, el OSCP... no se que...

Mi opinión es que el OSCP no es tan distinta a otras certificaciones del sector, simplemente, tienen ese proceso tan medido, que desde el momento previo al examen ya te sacan un poco de tus casillas, y por lo mismo, la gente la trata como si fuese las certificaciones de las certificaciones.

Unpopular Opinion

> El miedo que se genera y se dice del OSCP, es mucho mayor, a la dificultad del examen
> 
> Que con esto no quiero decir que sea sencillo tampoco, porque no es así

## ¿Qué necesito saber?

Bien, ¿qué se necesito saber para aprobar el OSCP? Pues, lo tengo medianamente claro:

- Tener claro el procedimiento de vulnerar un sistema, es decir, saber enumerar versiones, recursos, etc. Con ello, hacer una búsqueda de posibles exploits para las versiones del software usado, con ello, si acaso, puede ocurrir que debas de modificar un poco el exploit adaptándolo a tu caso, pero no mucho más de esto.
- Tener metodologías para servicios, es decir, si te encuentras un MSSQL o cualquier otro servicio, saber qué cosas podéis hacer con él. Ejemplo de mis apuntes para que pilléis la idea:

![Ejemplo de metodología MSSQL en apuntes](https://cdn.deephacking.tech/i/posts/offsec-oscp-review/offsec-oscp-review-2.avif)

![Ejemplo de apuntes OSCP - enumeración](https://cdn.deephacking.tech/i/posts/offsec-oscp-review/offsec-oscp-review-3.avif)

- Saber ejecutar ataques webs manualmente, el más claro sería SQLi.
- Saber enumerar CMS. Por ejemplo, si te encuentras un WordPress, saber que con WPScan, pues puedes ayudarte para enumerar posibles plugins.
    - Create metodologias de CMS (y de todo, realmente xD), es decir, si te encuentras un Joomla, que solo tengas que mirar tus apuntes para saber exactamente qué cosas puedes mirar.
- Saber escaladas de privilegios tanto de Linux como de Windows.
    - Aquí incluiría que conozcáis más de una herramienta para enumerar posibles formas de escalar privilegios, no todo es WinPEAS o LinPEAS.
        - Digo esto, porque a mí me pasó algo un poco raro en el examen. Usé WinPEAS y una mala configuración que existía en el equipo, o no me lo detectó o estaba cieguísimo del cansancio que tenía y no lo vi xD. El caso es que luego usé SharpUp y me lo pilló sin problemas y pude detectar que la escalada era por ahí.
- En cuanto al directorio activo, con saber usar Mimikatz, CrackMapExec y enumerar por LDAP, casi que lo teneis hecho xD.

Y con esto, la verdad que sería casi todo, al menos, todo lo que se me ocurre ahora.

## Comparación a otras certificaciones

Ahora vamos a ver como es la dificultad del OSCP en cuanto a otras certificaciones.

Esto no es tan fácil como decir, esta es más difícil, y esta es más fácil y listo. Porque en algunos puntos, el OSCP puede ser más difícil, y en otros no, por lo que voy a dividir la comparación en categorías. La compararé con todas las certificaciones que tengo ahora mismo, eJPT, eCPPTv2, eWPT, eWPTXv2, PNPT y CRTP (aunque no todas aplicarán a todas las categorías)

- Pivoting
    - OSCP = PNPT < eCPPTv2

- Pentesting Web
    - eWPT < OSCP < eWPTXv2
        - Aquí coloco el OSCP por encima del eWPT por el posible aspecto CTF que el OSCP te puede poner si tienes mala suerte, pero por lo general, no debería de ser difícil el aspecto web del OSCP.

- Active Directory
    - OSCP < PNPT < CRTP
        - Como dije antes, para llevarte los 40 puntos del directorio activo del OSCP, solo tienes que saber tirar mimikatz, crackmapexec y saber enumerar por LDAP, poco más...
            - Aun así, importante, siempre es mucho mejor no solo saber más, sino saber realizar distintas acciones, de múltiples formas. Por ejemplo, si quieres dumpear el LSASS, no dependas únicamente de mimikatz, ten alternativas. Y así con todo.

- Escalada de Privilegios
    - eCPPTv2 < PNPT < OSCP
        - Aquí destacar que las escaladas de privilegios del eCPPTv2 y PNPT no son gran cosa. En el OSCP pasa un poco como con la parte web. Por lo general, si tienes suerte, no te encontrarás nada que no sea muy CTF. Pero por lo general, la escalada que puedes encontrar en el OSCP si serían más complejas que la de las otras dos certificaciones.

- Máquinas estilo HTB o THM (dificultad de vulnerar una máquina y posteriormente, escalar privilegios)
    - eCPPTv2 < OSCP

**_Si queréis que lo compare con alguna categoría que no esté aquí, ponedlo en los comentarios ^^_**

Y estas diría que son las principales categorías. El OSCP no es "la más difícil", simplemente, como cualquier otra certificación, en algunas categorías, sí que puede ser un poco más difícil que las demás, pero de la misma manera, que en otras, es mucho más sencilla.

## ¿Vale la pena?

Sí, totalmente. Pero quizás no por la razón de que vayas a aprender, depende del caso. Por ejemplo, es un hecho que el OSCP es una certificación burocrática, es decir, que si quieres tener más oportunidades laborales en el mundo de la seguridad ofensiva, o te la sacas, o te la sacas. No solo eso, sino que una persona que tiene el OSCP, es oro para las personas de RRHH. Lo mismo que pasa/pasaba con el CEH.

Simplemente por lo valorada que está, y las oportunidades que te brindará, vale 100% la pena.

Ahora bien, ¿se aprende realmente con el OSCP?

Pues depende, si partes de cero o tienes un nivel básico, vas a aprender muchísimo. Vas a aprender la base para poder seguir desarrollándote en este campo. Ahora bien, si eres una persona que ya tiene más certificaciones del sector, que trabajas de ello, que ha tocado mucho HTB y THM.... como era mi caso, pues quizás no te aporta tanto. Yo me medio tenía que obligar a ponerme a hacer máquinas, ya sea del laboratorio o de HTB o THM. Y, aunque si es cierto, que alguna cosa salteada aprendí, hubiera aprendido mucho más si me ponía con otras certificaciones o temas que tenía en mente empezar, pero que no podía porque tenía que sacar el OSCP.

El hecho de que vayas a aprender mucho dependerá del caso excepcional donde tú te encuentres.

## ¿Cómo prepararse?

La mejor forma de prepararse no tiene mucho misterio, para mí sería de la siguiente manera:

- Haz máquinas de HackTheBox o TryHackMe. Puedes seguir la famosa lista de [TJNULL](https://docs.google.com/spreadsheets/u/1/d/1dwSMIAPIam0PuRBkCiDI88pU3yzrqqHkDtBngUHNCw8/htmlview).
- Haz apuntes de todo lo que hagas en esas máquinas. Create metodologías de todo.
- Conforme hagas máquinas, sé consciente del proceso de pensamiento, de como la has resuelto. Cuando lleves muchas, te darás cuenta de que en un gran porcentaje de máquinas, su resolución es bastante mecánica, versión, exploit, y estamos dentro. Esto también aplica para un gran número de máquinas del OSCP.
- Haz las máquinas del laboratorio.

Y realmente, no hay mucho más misterio para prepararse que este, no hay ninguna fórmula mágica.

## Guías Oficiales

Si vas a hacer el examen o el curso próximamente, sin falta, échale un vistazo a los dos siguientes enlaces:

- [OSCP Exam Guide](https://help.offensive-security.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- [OSCP Exam FAQ](https://help.offensive-security.com/hc/en-us/articles/4412170923924-OSCP-Exam-FAQ)

## Conclusión

El OSCP es una certificación que si te vas a dedicar a este campo, tienes que tener casi de forma obligatoria. Que aprendas con ella, no solo obviamente depende de ti, como pasa con cualquier cosa. Si no que dependerá totalmente de tu caso concreto.
