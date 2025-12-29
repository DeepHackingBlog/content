---
id: "alteredsecurity-crtp-review"
title: "CRTP + Bootcamp Review - Certified Red Team Professional 2022"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-06-10
image: "https://cdn.deephacking.tech/i/posts/alteredsecurity-crtp-review/alteredsecurity-crtp-review-0.webp"
description: "Review completa de la certificación CRTP de Altered Security: contenido del curso, laboratorios de Active Directory, examen práctico y mi experiencia como Certified Red Team Professional."
categories: 
  - "certifications"
draft: false
featured: false
lang: "es"
---

Vaya mesesito de mayo he tenido 😵🥴. Hace un mes empecé el bootcamp "[Attacking and Defending Active Directory](https://bootcamps.pentesteracademy.com/courses)" de Pentester Academy. Después de haber estado unas cuantas semanas con las clases, los apuntes, el laboratorio, y, finalmente, el examen, puedo decir que la certificación se aprobó:

![Certificado AlteredSecurity CRTP](https://cdn.deephacking.tech/i/posts/alteredsecurity-crtp-review/alteredsecurity-crtp-review-1.avif)

Por lo que, voy a hablar un poquito de como fue todo, clases, laboratorio, opinión, experiencia, comparaciones, y demás:

- [Contexto](#contexto)
- [Bootcamp](#bootcamp)
- [Examen (CRTP)](#examen-crtp)
- [¿Vale la pena?](#vale-la-pena)
- [Puntualizaciones](#puntualizaciones)
- [Tips](#tips)

## Contexto

El laboratorio de "[Attacking and Defending Active Directory](https://www.pentesteracademy.com/activedirectorylab)" según la propia web, te permite practicar lo siguiente:

- Practice various attacks in a fully patched realistic Windows environment with Server 2016 and SQL Server 2017 machine.
- Multiple domains and forests to understand and practice cross trust attacks.
- Learn and understand concepts of well-known Windows and Active Directory attacks.
- Learn to use Windows as an attack platform and using trusted features of the OS like PowerShell and others for attacks.
- Try scripts, tools and new attacks in a fully functional AD environment.

Por mi parte, puedo confirmar que perfectamente todo esto se practica en el laboratorio, que, aunque no es exactamente igual, más o menos la estructura es la siguiente:

![Topología del laboratorio de AD](https://cdn.deephacking.tech/i/posts/alteredsecurity-crtp-review/alteredsecurity-crtp-review-2.avif)

Además, prometen que practicarás los siguientes conceptos:

- Active Directory Enumeration
- Local Privilege Escalation
- Domain Privilege Escalation
- Domain Persistence and Dominance
- Cross Trust Attacks
- Forest Persistence and Dominance
- Defenses – Monitoring
- Defenses and bypass – Architecture and Work Culture Changes
- Defenses and Bypass – Deception
- Defenses and Bypass – PowerShell

De nuevo, es totalmente cierto que todos estos conceptos se ven. Sin embargo, si me gustaría hacer una puntualización en el apartado de "Local Privilege Escalation". Y se trata de que esto, es un curso de Directorio Activo, no de escalada de privilegios local, por lo que, lo que se ve de escalada de privilegios es prácticamente nada, y totalmente automatizado con PowerUp.

Esta es toda la parte en cuanto a lo que puedes practicar y lo que verás en el laboratorio, ahora bien, al comprar el laboratorio (PD: el laboratorio no es el bootcamp), tienes lo siguiente:

- Lo primero es que tienes la opción de comprar 30, 60 o 90 días. Puedes comprar una y si quieres extenderlo también tienes esa posibilidad, ya el precio de extenderlo, pues ni idea. En cualquier caso, una vez lo compras, tienes hasta 90 días para empezarlo.
    - El acceso que se te proporciona puede ser vía VPN + RDP o vía Web, puedes elegir cual usar cuando quieras.
- Se te proporciona el curso entero de "[Attacking and Defending Active Directory](https://www.pentesteracademy.com/course?id=47)" (14 horas de vídeo) de Pentester Academy. Este curso básicamente es lo mismo que das en el bootcamp. Ahora bien, ¿cuáles son las diferencias?
    - Puede que las diapositivas del bootcamp estén un poco más actualizadas debido a que son en directo. Aun así, aunque pueda haber diferencias, el núcleo y lo verdaderamente importante no cambiará.
    - En el bootcamp, las clases son en directo, por lo que, además de las propias preguntas que puedas hacer en tiempo real, puede que el instructor (Nikhil Mittal) de vez en cuando diga información esporádica que no está en el curso en vídeo, simplemente porque se le ha venido a la cabeza (De la misma forma, oye, no descarto que en el curso en video ocurra lo mismo, pero quizás en el bootcamp es más probable al no estar tan guionizado y ser en directo)
- En el mismo precio, se te da un intento de examen.

Todo esto, lo tienes por 249$ al momento de escribir esto, hablando de la opción más barata, la de 30 días de laboratorio.

## Bootcamp

Hablando del bootcamp, lo primero es que tiene un precio actualmente de 299$. En el apartado de arriba ya se ha hablado un poquito, pero en resumen, el bootcamp es:

- 30 días de laboratorio + todo lo que incluye si lo comprases por separado (todo lo mencionado arriba exceptuando el curso en video ya que lo verás, pero en directo)
- 1 Clase semanal de 3 horas durante 4 semanas (4 clases en total). Las clases se dan los domingos, en horario de España, la clase comienza a las 17:00 si estamos en horario de verano, si no, a las 16:00.
- Las clases en directo básicamente es Nikhil explicando el PowerPoint del curso.
    - PD: Desconozco si el comprar solo el laboratorio incluye el PowerPoint del curso, ver el PowerPoint en los videos lo verás, pero que te den el archivo por separado, ahí ni idea.
- En Discord se crea un servidor exclusivo de todas las personas que están cursando el bootcamp ese mes, en el mismo servidor está Nikhil para resolver dudas. Este punto está superbién porque cualquier duda que tengas, la preguntas por ahí y seguro que alguien te contesta, si no, el propio Nikhil lo hará (aunque a veces le cuesta un poco contestar xD). Aquí también podrás ver preguntas de otra personas y errores junto a soluciones.
- En cuanto a los archivos que se te proporcionan, también dan un PDF donde se resuelve los distintos "Learning Objetives" que se te van presentando en el PowerPoint, son básicamente retos para practicar el temario. Además, proporcionan un diagrama del laboratorio y un diagrama del laboratorio con los vectores de ataque para cada máquina. Por último, también proporcionan un archivo zip de Tools, ahi se encuentran todas las herramientas que necesitas tanto para el laboratorio como para el examen, por supuesto, también tienes la opcion de subir la que tu quieras, no tienes por qué limitarte a las que se te proporcionan.
    - En este punto, desconozco de nuevo si al comprar solo el laboratorio, se te proporciona todo esto, pero diría y entiendo que si, aunque este "si", cógelo con muchas pinzas jeje.

Resumen:

- Clases
    - 4 Clases en total
    - Clase Semanal de 3 horas los domingos
    - Te sacas el C2 de inglés porque hay algunos momentos en los que el inglés indio brilla en todo su esplendor.

- Apuntes
    - Se te proporciona:
        - PowerPoint del curso.
        - Manual de Resolución de los Learning Objetives que aparecen en el PowerPoint
        - Manual de Resolución de los Learning Objetives usando la herramienta de Covenant.
        - Archivo ZIP con todas las tools. Esta carpeta ya está subida por defecto en tu máquina del laboratorio, en C:\\AD\\Tools.
        - Diagrama del laboratorio y diagrama del laboratorio con todos los vectores de ataque.
        - Videos de resolución de cada uno de los learning objetives (por si prefieres formato video) aunque el video es sin sonido.

Por último, recalcar de nuevo la diferencia entre el bootcamp y el laboratorio por separado, lo que está claro que tiene de especial el bootcamp son las clases en directo y el servidor de discord. En cuanto a los archivos proporcionados, desde la completa ignorancia, quiero entender que se proporcionan exactamente los mismos si solo compras el laboratorio, pero eso, ni idea realmente.

## Examen (CRTP)

El CRTP (Certified Red Ream Professional) es un examen de 24 horas donde debes hacer una auditoría interna a un Directorio Activo partiendo de una máquina windows y usuario del dominio. El objetivo del examen es conseguir ejecución de comandos en todas las máquinas, sin importar si el privilegio es de administrador o no. En total son 5 máquinas sin contar la tuya propia.

En el examen no cae ningún ataque donde sea necesario hacer fuerza bruta o usar un diccionario, por lo que ataques como Kerberoasting y AS-REP Roast no serán necesarios. Los certificados (AD CS) tampoco caen. Y en cuanto a persistencia, tampoco es necesario de cara al examen, ya que no es el objetivo del mismo.

La parte práctica es la que dura 24 horas, posteriormente, tienes 48h para enviar el reporte. Por lo general, el reporte suele ser de 20/25 páginas, a mí me ocupó 26.

Ojo, que el número de páginas no te engañe, sin duda puedo decir que, el CRTP es la certificación con el reporte más corto que he hecho, pero es el examen más difícil que hice hasta ahora. Sin duda, es más difícil que el eCPPTv2 o eWPT. Que, a ver, los temas de los tres son distintos, y por supuesto, aprobar el CRTP no te asegura para nada aprobar cualquiera de los otros dos, lo mismo ocurre al revés. Pero en cuanto a temario, examen, y tiempo, sinceramente pienso que el CRTP es bastante más complicado.

En cuanto al examen yo tardé unas 16 horas en hacerlo, antes de empezar se menciona que lo ideal es estar 18 horas en el laboratorio del examen y 6h reportando. Reportando tardé no mas de 3h.

Es un examen complejo porque necesitas conocer BIEN los conceptos de directorio activo que ves en el curso, mirándolo en perspectiva después de hacerlo, no es un examen complejo para quien de verdad entienda y conozca todo el temario. Yo estuve pillado como 8h en una tontería grandísima :').

Hablando de herramientas, no hay ninguna restricción, puedes usar la que quieras, siempre y cuando, posteriormente en el informe, expliques para qué sirve.

## ¿Vale la pena?

Absolutamente si, Pentester Academy para mí es de las mejores plataformas para aprender, personalmente me encanta su contenido. Y este bootcamp y examen no es para menos. Tenía superoxidado el tema de directorio activo y con este curso puedo decir, que no solo he recordado todo lo que aprendí en su momento, sino que sé más aun. Así que, si quieres aprender directorio activo bien, superrecomendado.

## Puntualizaciones

- Tanto el examen como el laboratorio, es todo mediante máquinas Windows y PowerShell, y el temario y examen está preparado para que se haga así. Ahora bien, en ambos, no se te prohíbe que hagas uso de Linux, lo importante al final es que resuelvas tanto el examen como el laboratorio. Pero personalmente, creo que es una buena oportunidad para salir de la zona de confort y hacerlo todo desde PowerShell y Windows.
- El laboratorio tiene 40 flags, que serán necesarias completar para obtener el [certificado del laboratorio](https://www.credential.net/5cdc3c89-f7e8-489c-b2e7-254426c93c02#gs.39002z).
- Debo de decir que si compras el bootcamp, esos 30 dias que tienes de laboratorio y estarás con el temario, es literalmente un rusheo, es decir, ves el temario muy muy rapido, y le tienes que meter muchas horas en el mes que estés de bootcamp. Lo digo porque literalmente en el blog se puede ver reflejado, que en cuanto a posts, el mes de mayo a estado super parado, y no ha sido por otra cosa sino porque, el mes de bootcamp, es literalmente, mes de bootcamp, nada mas porque no te da tiempo. Y además, no te da tiempo a entrar en muchas cosas con la profundidad que te gustaría, por el tiempo limitado, por lo que mi recomendacion en este caso, es que veas las cosas con la profundidad mínima para entenderlo teoricamente, llevarlo a cabo, conocer que estás haciendo y saber que posibilidades te proporciona eso. Cuando acabes el bootcamp y hagas el examen, ya tendrás tiempo para profundizar en todo lo que has visto con tranquilidad.
- Cuando compras el laboratorio o el bootcamp, tienes como límite unos 3/4 meses para presentar el examen.
- Los intentos de examen adicionales en el caso de que suspendieses, tienen un precio de 99$.

## Tips

De cara al bootcamp, mi tip es que le des prioridad al PowerPoint, y que las clases sean algo secundario, es decir, no dependas de esperar a la clase para seguir avanzando. Las clases al final son solo de apoyo, pero el avanzar y aprender, depende de ti completamente. Dicho esto, mi metodologia ha sido:

- Ver el temario del PowerPoint, con cada cosa que veia, investigaba mas allá de lo que se mostraba en el curso, ya sea de forma teórica para entenderlo o de forma práctica, y posteriormente hacia apuntes.
- Cuando llegaba a un Learning Objetive, lo hacía, tanto en el caso como pudiera hacerlo o no, después miraba si o si la resolución en el PDF que te entregan, para ver si se puede hacer de otra forma o no.
- Despues de haber visto el temario, y llegar y hacer el Learning Objetive que me encontrase. Comprobaba los enunciados de las flags del laboratorio, y me preguntaba: ¿Ya he visto el temario correspondiente para hacer esta flag? Si la respuesta es que si, pues la hacía, sino, pues seguía con el PowerPoint.

Y como tal esta ha sido mi metodología de cara al bootcamp. En paralelo, pues veia las clases cuando correspondían o grabadas (Si! las clases son grabadas y te las puedes descargar)

De cara al examen diría:

- Enumera enumera y enumera, obtén toda la información posible al principio y ponla sobre la mesa, que sepas que opciones tienes, que usuarios hay, a que grupos pertenece cada uno, que máquinas hay, etc etc. Ten un mapa mental del directorio activo antes de ponerte a explotar.
- Como me dijo un amigo (Hellou Dani!), explotar un directorio activo no es lineal, puedes que desde el principio encuentres X cosa que hasta dentro de un rato o pasos mas adelante, no puedas hacer uso de ello. De igual forma, si te quedas atascado, puede que te hayas pasado alguna cosa útil unos pasos atrás y que te pueda servir ahora.
- La carpeta de Tools que tienes en el laboratorio, descargatela en local, para que, de cara al examen, puedas coger las herramientas de ahí y usarlas. Eso si, en el examen, no vayas a subir el ZIP completo con todas las herramientas, sube solo las que vayas a utilizar.
- Hazte una cheatsheet de comandos, que no tengas que ir buscando por el temario el comando para hacer X cosa.

Y realmente esto es todo, si quieres aprender de directorio activo y estas pensando en si hacer esta certificación, no lo dudes y hazla ^^.
