---
id: "offsec-oswp-review"
title: "OSWP Review - OffSec Wireless Professional 2024"
author: "adria-perez-montoro"
publishedDate: 2024-04-02
updatedDate: 2024-04-02
image: "https://cdn.deephacking.tech/i/posts/offsec-oswp-review/offsec-oswp-review-0.webp"
description: "Review completo de la certificación OSWP (OffSec Wireless Professional) con consejos, preparación y experiencia personal del examen de pentesting WiFi."
categories:
  - "certifications"
draft: false
featured: false
lang: "es"
---

Que tal gente, muy buenas, mi nombre es Adrià también conocido como b1n4ri0 (conocido en mi casa XD). En esta ocasión vamos a hablar del OSWP, durante este post os voy a contar todo lo que necesitáis saber sobre la certificación y aparte os contaré un poco mi experiencia sin hacer ningún spoiler del examen, claro está.

![Certificación OSWP de OffSec](https://cdn.deephacking.tech/i/posts/offsec-oswp-review/offsec-oswp-review-1.avif)

## ¿Qué es el OSWP?

El OSWP (OffSec Wireless Professional) o PEN-210, es la certificación de pentesting Wi-Fi de Offensive Security. Para comprar el OSWP tienes tres formas pero todas son mediante una suscripción anual, lo que cambia es cuantos riñones tienes que vender para pagarlo:

- Learn Fundamentals ($799/año) == (1 riñón - 737,9€)
- Learn One ($2599/año) == (2 riñones - 2400,3€)
- Learn Unlimited ($5499/año) == (2 riñones + 1 del vecino - 5078,6€)

Por lo general a las certs de OffSec se les suele tener respeto o estatus, aunque es mas sobrenombre que otra cosa, bien pues esta no lo tiene jaja, igualmente no significa que no necesites estudiar para sacarte esta certificación o que se la pueda sacar tu primo de 13 años que ha visto tres capítulos de Mr.Robot en YouTube, simplemente no se habla tanto de esta cert o al menos esa es mi percepción.

## El curso

OffSec describe el curso de la siguiente forma:

> PEN-210 es un curso exhaustivo de seguridad inalámbrica y pruebas de penetración diseñado para proporcionar a los alumnos los conocimientos y las habilidades prácticas necesarias para identificar, explotar y corregir vulnerabilidades en redes inalámbricas.
> 
> El curso cubre una amplia gama de temas, incluyendo estándares IEEE 802.11, tipos de redes inalámbricas inalámbricas, herramientas inalámbricas Linux, fundamentos de Wireshark y técnicas avanzadas de y técnicas avanzadas de supervisión y análisis de redes inalámbricas.
> 
> A lo largo del curso, los estudiantes participarán en laboratorios interactivos y ejercicios que simulan escenarios del mundo real, adquiriendo una valiosa experiencia en la realización de evaluaciones de redes inalámbricas y la aplicación de medidas de seguridad eficaces.
> 
> Al finalizar el PEN-210, los alumnos tendrán un conocimiento exhaustivo de la seguridad de las redes inalámbricas y la capacidad de realizar pruebas de penetración inalámbricas.

Bien voy a recalcar algo que debéis saber antes de nada, concretamente cuando dicen esto: "los estudiantes participarán en laboratorios interactivos y ejercicios que simulan escenarios del mundo real", lo que quieren decir en realidad es "los estudiantes se buscarán la vida para montarse los laboratorios que sean necesarios y realizarán los ejercicios con los mismos", pequeño detalle que se les olvidó mencionar XD, pero tranquilos porque en la parte de preparación veremos como nos apañamos.

Lo que aprendes según OffSec en el curso es lo siguiente:

- Mayor conocimiento de la seguridad ofensiva inalámbrica y mayor concienciación sobre la necesidad de soluciones de seguridad en el mundo real.
- Utilización de diversas herramientas de reconocimiento inalámbrico.
- Implementación de ataques contra redes cifradas WPA personales y empresariales.
- Comprensión de cómo implementar diferentes ataques contra puntos de acceso fraudulentos.
- Implementación de ataques contra redes de configuración inalámbrica protegida (WPS).
- Utilización de diversas herramientas para descifrar hashes de autenticación.
- Implementación de ataques contra portales cautivos.

Aquí hay poco que discutir pues es lo que te enseñan en el temario.

## Preparación

Los requisitos son tener PC (opcional), na es broma jaja.

Antes de empezar el curso OffSec te recomienda que tengas lo siguiente:

- Conocimientos sólidos de TCP/IP y del modelo OSI, así como familiaridad con Linux.
- Un ordenador portátil o de sobremesa moderno que pueda arrancar y ejecutar Kali Linux
- Hardware específico para completar los ejercicios del curso

Según OffSec leyendo el temario y realizando los ejercicios que te ponen en algunas de las secciones estarías ready para meterte de hostias con el examen y técnicamente lo estarías pero, sinceramente el curso es muy general y si lo que realmente quieres es aprender a penetrar redes de forma profesional te va a tocar investigar bastante, ¿cuánto?, eso depende de cuanto quieras profundizar tú, la verdad personalmente me gusta indagar y comprender todo muy bajo nivel por lo que mi preparación probablemente no sea la misma que la tuya, pero si tu intención es aprobar el examen yo creo que con el temario que te da OffSec y completando todos los retos del [WifiChallenge Lab de Raúl Calvo Laorden](https://wifichallengelab.com/) lo puedes afrontar perfectamente.

> Raúl, si estás leyendo esto quiero que sepas que literalmente te estás carreando muchos OSWP gracias por tus labs que ahorran una cantidad de tiempo increíble.

Volviendo al tema también puedes crear tus propios laboratorios con algún router viejo que te sobre y alguna antena económica de Amazon (y no, NO se vale practicar con el Wi-Fi del vecino es ilegal :/), las ventajas que tiene el laboratorio en físico es que puedes cacharrear de forma más directa, pero mi recomendación es que uséis el Wifi Challenge Lab porque os ahorraréis problemas y si tenéis alguna duda o problema tiene una comunidad más amplia y más gente os podrá ayudar, por el contrario, si tienes algún problema con tu configuración en físico te tocará batallar algo más para solucionarlo.

No está de más decir que igual que en todos los exámenes no solo influye que tan preparado vas como veréis cuando cuente mi experiencia.

## Examen

Entramos en terreno sensible, el examen es bastante cortito, concretamente dura 3h 45mins, aunque en la información del curso te lo pintan como 4h:

![Duración del examen OSWP](https://cdn.deephacking.tech/i/posts/offsec-oswp-review/offsec-oswp-review-2.avif)

Para aprobar necesitas romper dos de las tres redes de las que está formado el laboratorio de examen y obtener el proof.txt. Una de las redes es obligatoria para aprobar, lo que significa que si rompes dos de las tres, pero la que no has roto era la obligatoria, no apruebas.

Si rompes dos redes y una de ellas es la obligatoria, pero no tienes las capturas necesarias o tu reporte no contiene documentación suficiente, tampoco apruebas. Como mínimo es obligatorio tener una captura de pantalla del proof.txt y de la contraseña en texto plano de cada red.

Durante el examen está prohibido usar herramientas que automaticen la explotación p.ej (wifite, wiphisher) e inteligencia artificial p.ej (ChatGPT, YouChat), pero tranquilos que tampoco os van a hacer falta.

Una vez terminadas las 3h 45mins tienes 24h para elaborar el reporte y enviarlo.

Para más información podéis revisar la [guía oficial del examen OSWP de OffSec](https://help.offsec.com/hc/en-us/articles/360046904731-OSWP-Exam-Guide).

## Consejos

Mis consejos son los siguientes:

- Id seguros y tranquilos pero no demasiado confiados.
- Tomaos el tiempo necesario para pensar y planificar los ataques.
- Haced captura de todo lo que hagáis aunque pueda que el ataque no funcione (mejor tener algunas capturas que quedarse sin nada).
- Si os estancáis en una red parad ese escenario e id a por otra red distinta.
- Administraros el tiempo de forma eficiente y descansad (sí, da tiempo).
- Si queréis no va mal tener los apuntes al lado.
- Pensad que el examen es en base al temario del curso, pero también tendréis que investigar un poco.
- Este es el más importante para mí, si creéis que podéis hacer algo de alguna forma que vosotros no habíais planeado previamente, NO la descartéis.
- Controlad el tiempo.

## Mi experiencia

Bueno, toca explicar mi experiencia en el examen y la verdad fue algo extraño y muy divertido para mí, este es el examen más corto que he hecho nunca y además el primero que hago que es monitorizado.

Me conecté al examen 20 minutos antes, ellos aconsejan entrar 15 minutos antes, pero tengo una obsesión con no llegar tarde, todo fue correctamente, compartí mis pantallas y complete el proceso de identificación sin ningún problema, la verdad, la mar de tranquilo. Yo agendé el examen para el día 24 a las 13:00 así que transformé la habitación en el paqui de la plaza por si me daba hambre y me puse mi música para ir del chill.

Cuando dieron las 13:00 me enviaron lo necesario para empezar con el examen y empecé con el primer escenario, la verdad el primer escenario lo saqué bastante rápido y sin problemas, no tardé más de 15 mins.

Luego empecé con el segundo y se me complicó no puedo decir nada más porque no quiero dar detalles, pero en pocas palabras yo no hice caso de los dos últimos puntos de mis consejos, al ver que no estaba saliendo como yo planeaba me dio un lapsus y pensaba que me quedaba 1h menos de lo que realmente quedaba y la verdad que me  
agobié un poco.

Tras un par de reinicios me pasé al tercer escenario para ver si podía desconectar, pero como he dicho antes pensaba que me quedaba menos tiempo y el escenario en el que me encallé era el obligatorio, así que decidí volver y dedicar todo mi tiempo a ese.

En el transcurso del tiempo restante, comí tranquilamente y me dediqué a seguir probando mi primera idea de ataque, cuando ya me quedaban solo 45 mins decidí apostar por la idea de ataque que creía que no era posible, que no tenía mucho sentido en mi mente (spoiler esa era la solución XD).  
Total no perdía nada así que me puse manos a la obra y como bien os he dicho si funcionó, o al menos si una parte, por lo que significaba que era ese el camino, pero la segunda parte no estaba funcionando correctamente, como ya me había equivocado en el primer ataque pensé que estaba haciendo algo mal de nuevo, entonces empecé a investigar y probar cosas que no había visto antes (al menos aprendí cosas nuevas), el caso es que esta vez no me estaba equivocando y sí era ese el camino bueno.

Me faltaban 10 mins para que se terminara el tiempo de laboratorio y estaba bastante desesperado (creo que el chavalín que me monitorizaba llamémosle Paco se estaba partiendo el culo), no veía ninguna solución posible así que reinicie el escenario y a 7 minutos de terminar volví a realizar el procedimiento la única diferencia es que ahora si funcionaba, recogí la proof.txt tecleando de la forma más rápida que pude y al verla me marqué un bailecito.

Yo creo que Paco lo celebró conmigo, pero nunca lo sabremos, en resumen la moraleja es que os quedéis hasta el último minuto y si creéis que algo no va como tiene que ir reiniciad, y si no buscad otra alternativa que lo más seguro es que funcione. Como añadido, también existen los malos momentos y los días malos y por lo general no están vinculados a tu nivel de conocimientos ;).

Bueno mi gente, un placer estar por aquí, cualquier duda dejadla en los comentarios o me enviáis un md en [mi perfil de Twitter](https://twitter.com/b1n4ri0) o [mi perfil de LinkedIn](https://www.linkedin.com/in/b1n4ri0/) y os responderé en cuanto pueda, espero que nos veamos pronto. <3
