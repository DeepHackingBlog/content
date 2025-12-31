---
id: "hacktricks-arte-review"
title: "Hacktricks ARTE Review - Certified AWS Red Team Expert 2024"
author: "axel-losantos-lizaso"
publishedDate: 2024-04-08
image: "https://cdn.deephacking.tech/i/posts/hacktricks-arte-review/hacktricks-arte-review-0.webp"
description: "Review completa de la certificación ARTE de HackTricks Training: curso de AWS Red Team, laboratorios cloud, examen práctico y mi experiencia como AWS Red Team Expert."
categories: 
  - "certifications"
draft: false
featured: false
lang: "es"
---

Todos los profesionales dentro de este mundillo conocemos [Hacktricks](https://book.hacktricks.xyz/), ¿verdad? A inicios de 2024 nos sorprendió con **ARTE** (**AWS Red Team Expert**). Después de ciertas dudas decidí aventurarme junto con el descuento incluido de los cien primeros alumnos. Finalmente, después de tres semanas y una rooted de por medio, obtuve la certificación.

![ARTE Certificate](https://cdn.deephacking.tech/i/posts/hacktricks-arte-review/hacktricks-arte-review-1.avif)

Si nunca has tenido la oportunidad de tocar un entorno cloud y quieres _probarte_ para ampliar conocimientos, tienes dos opciones: meter la tarjeta en AWS, Azure o GCP y preparar el entorno vulnerable para hacer pruebas… o compras una certificación. Sinceramente creo que la segunda opción es la mas óptima, pero hay que tener en cuenta el “_entry level_”, ya que alguna de ellas (como esta) requiere que cuentes con cierto abanico de conocimientos antes de plantarle cara.

- [Contexto](#contexto)
- [Curso y Laboratorio](#curso-y-laboratorio)
- [Examen ARTE](#examen-arte)
- [Tips para el examen](#tips-para-el-examen)
- [Conclusiones](#conclusiones)
- [Puntualizaciones / FAQ](#puntualizaciones--faq)
- [¡Descuento!](#descuento)

## Contexto

Bueno, el contexto es relativo y tampoco hace falta que sigáis el mismo ritmo. Descontando ciertos conceptos generales en seguridad ofensiva, si especificamos en la nube dispongo con alguna certificación previa que me facilitó comprender conceptos más complejos en ARTE. Alguno de ellos son el [CARTP](https://www.alteredsecurity.com/azureadlab), del que ya comentamos [en nuestra review de CARTP (Certified Azure Red Team Professional)](https://blog.deephacking.tech/es/posts/alteredsecurity-cartp-review/) o el [CHMRTS](https://cyberwarfare.live/product/hybrid-multi-cloud-red-team-specialist-chmrts/) que combina los tres entornos cloud mas cotizados del mercado.

## Curso y Laboratorio

Veinte horas de curso en inglés son los que te esperan cuando inicias sesión en la web repartidos en cinco módulos.

1. Breve introducción del curso
2. Introducción a AWS
3. Explotación de veinte recursos AWS
4. Metodologías de _pentest_ en entornos cloud
5. _Bypass_ de medidas de seguridad cloud

En el momento en que comienzas el voucher de la certificación, se te habilitará un laboratorio de **50 flags** para poder realizar todos los abusos que se comentan en el curso. Es una de las certificaciones mas densas en cuanto a contenido práctico y muy bien elaborados, de manera que aprendes no solamente abusos explicados en el curso, sino te incita a ir mas allá y rebuscar nuevas técnicas.

> Ojo, cuarenta y cinco días para poder completar el 100% de los laboratorios no es como para tomárselo con calma como cualquier otra certificación. El mes que dispongas debes considerarlo como casi una prioridad, ya que ver los videos y realizar los ejercicios consume bastante tiempo. 

## Examen ARTE

El examen consta de obtener **tres flags en un periodo de doce horas** utilizando los conceptos aprendidos en los laboratorios... y tal vez ir un paso más. Puede que en este último punto existan diferentes opiniones, pero en lo personal me parece correcto que el examen cuente con cierta dificultad fuera del temario inicial.

La principal diferencia con respecto a otras certificaciones es que para aprobar no se requiere presentar ningún informe técnico de los pasos seguidos para el compromiso y obtención de las flags, sino que simplemente con obtener las tres automáticamente te mandan el certificado. Sin embargo, también existe otra forma de aprobar: debes realizar un PR (Pull Request) válido en el [repositorio oficial de Hacktricks Cloud en GitHub](https://github.com/HackTricks-wiki/hacktricks-cloud) ofreciendo nuevas técnicas y/o abusos referentes a AWS y se reducirá en uno el número de flag necesarias para aprobar.

La dificultad del examen es un punto importante a destacar. Es posible que existan diferentes opiniones según la persona a la que preguntes, así que intentaré ser lo más objetivo posible. Hay que tener en cuenta que disponemos de doce horas para realizar un examen que puede contener algún “_rabbithole_”, lo que eleva la exigencia por la falta de tiempo. El examen en sí no es muy largo a diferencia de otras certificaciones y se echó en falta una _kill chain_ un pelín mas larga. El proceso de obtención de las 3 flags **no es del todo lineal**, pudiendo llegar a obtener una flag sin haber obtenido la anterior.

Fueron cinco horas de dedicación donde obtuve las tres flags, después de pasar mas de dos horas estancado en todas las trampas posibles. Se trabajan los recursos estudiados durante el curso, aunque existen tantos que únicamente se pueden poner en práctica unos pocos. Una vez se obtienen las flag necesarias, se genera el certificado y se cierra el examen.

## Tips para el examen

Ahora bien, una vez dada la chapa va siendo hora de contar algún tip que considere importante y sirva para poder superar la certificación ARTE.

- Trabajar con los **laboratorios** a la vez que los **videos**. Es una muy buena forma de entender el recurso que vas a abusar y probarte a tí mismo.
- **Ir un poco más allá** con la explicación del recurso AWS. Indaga por internet para ampliar información sobre el uso de cada uno de ellos.
- Pelearse antes de mandar ticket. Los ejercicios están pensados para poder sacarlos la mayor parte **sin ayuda**, aunque pueden existir algunos laboratorios que debas preguntar a la comunidad o abrir un ticket a soporte.
- Hacer apuntes **agrupados por recurso AWS** ayuda a ubicar los abusos de una manera muy precisa y evitar perder el tiempo durante el examen.
- **Hacer apuntes de los laboratorios** es una buena manera de retener los contenidos y repasar antes del examen. 
- En el examen ir con calma pero sin dormirse. Si ves que la vía no llega a ningún lado no des un paso atrás… sino **dos**. Algo te dejaste.
- Los ejercicios denominados _**blackbox**_ son muy interesantes, ya que se asemejan a lo que uno podría encontrarse en el examen.

## Conclusiones

Una de las partes que más puede hacerte dudar y por eso estas leyendo este post, ¿Merece la pena? Como es una certificación nueva, no existen apenas comentarios acerca de ello. En una respuesta corta te diré que si te interesa aprender cualquier entorno cloud, sí.

Si tuviera que dar una respuesta larga, probablemente tendríamos que entrar en detalle a justificar los +1000€ en una certificación. Así como en otras los precios fuera de Offensive no suelen superar los cuatro dígitos, **ARTE** está por encima a nivel de precio. No voy a negar, es una certificación cara. Por otro lado, no me parece tan caro cuando tu otra alternativa es montarte un entorno AWS y empezar a pagar por uso.

Para ser la primera certificación de AWS en _Hacktricks_, NO considero que sea “entry level”. Hay que tener ciertos conocimientos para poder ir ágil y aprovechar toda la certificación. Ahora bien, no por ello diría que se necesiten años de experiencia en el campo, sino haber llegado a tocar algún entorno cloud como AWS, Azure o GCP, ya que tienen grandes similitudes.

## Puntualizaciones / FAQ

> Si requiere de ciertos conocimientos, ¿qué puedo estudiar previamente para ir preparado?

Por desgracia, a día de hoy no hay muchas certificaciones y/o recursos a los que acudir para aprender. Pero aún se puede dejar una pequeña lista:

- [Certified Azure Red Team Professional](https://www.alteredsecurity.com/cartp-bootcamp) (CARTP). No es de AWS pero ayudará a conocer los conceptos básicos de los entornos cloud.
- [AWS Cloud Red Team Specialist](https://cyberwarfare.live/product/aws-cloud-red-team-specialist-carts/) (CARTS).
- Cualquier video de Youtube que te ayude a comprender el funcionamiento de los recursos AWS, como por ejemplo [este](https://www.youtube.com/watch?v=B08iQQhXG1Y&ab_channel=BeABetterDev).
- Aprovechar los treinta días gratuitos que te ofrece AWS para poder experimentar en su portal.
- Utilizar el [portal de training](https://www.aws.training/) de AWS.

> No estoy seguro de si me interesa meterme en _pentest cloud_, pero quiero comprobar si me gusta, ¿Merece la pena intentarlo aquí?

Existen alternativas más económicas que pueden abarcar conceptos más básicos de los entornos cloud. Asimismo, _Hacktricks_ se encuentra trabajando en ofrecer una certificación que resulte más amena para aquellas personas que partan de cero.

> No tengo experiencia en cloud pero aun así quiero sacarme la certificación ARTE. ¿Qué tan difícil sería?

No digo que sea imposible ni mucho menos sacarse la certificación. Sin embargo hay que tener en cuenta que el curso hace foco en las explotaciones de los elementos de AWS, no de explicarte cómo funcionan. Deberás hacer el ejercicio extra de entender para qué se utilizan, así como dedicarle mas tiempo del estipulado. Hay secciones del curso que son introductorios y recursos sencillos de entender, pero otros que necesitarás de un esfuerzo extra.

> Algunos datos de este blog han cambiado con respecto a lo que me estoy encontrando en el curso

Una vez completas el examen, te solicitan que des un pequeño _feedback_ de cinco minutos para realizar un seguimiento y posibles mejoras. De esta manera, es probable que vayan actualizando el curso con cambios notorios para mejorar la experiencia del alumno y algunos de los datos que se remarcan ya no estarán o aparecerán otros que no se mencionaron.

## ¡Descuento!

Puedes obtener un **15% de descuento** en cualquier certificación de [HackTricks](https://training.hacktricks.xyz/), incluida la de esta misma review, usando el siguiente código:

- `DEEPHACKING`

Dicho esto, Happy Hacking!
