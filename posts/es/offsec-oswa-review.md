---
id: "offsec-oswa-review"
title: "OSWA Review - OffSec Web Assessor 2026"
author: "matias-schiappacasse"
publishedDate: 2026-05-18
updatedDate: 2026-05-18
image: ""
description: "Mi experiencia personal rindiendo la certificación OSWA de OffSec: preparación, el día del examen y consejos para aprobar. Review general"
categories: 
  - "certifications"
draft: false
featured: false
lang: "es"
---

Hola, espero se encuentren bien. El día de hoy traigo un artículo interesante (a mi parecer) y la primera versión en español (creo): la revisión, experiencia personal y algunos consejos con la certificación **OSWA** y el curso [WEB-200](https://www.offsec.com/courses/web-200/) de [OffSec](https://www.offsec.com/).

![OSWA Banner](./images/banner.png)

Estoy algo emocionado escribiendo este artículo, ya que cumplí un sueño, objetivo que tenía hace muchos años, y por fin se dieron las condiciones.

El fin de semana pasado (**18/04/2026**) rendí el examen de la certificación y logré aprobar con éxito al primer intento.

![Certificado OSWA - lo censuro no quiero autodoxearme tan easy](./images/oswa-cert.png)

De antemano pido disculpas si existe algún error ortográfico o de redacción. Espero que disfruten y les sea de utilidad.

---

* [Contexto](#contexto)
* [¿Por qué esta certificación y no otra?](#por-qué-esta-certificación-y-no-otra)
* [Preparación (Curso y laboratorios)](#preparación-curso-y-laboratorios)
* [Día del examen](#día-del-examen)
* [Informe](#informe)
* [Opinión personal](#opinión-personal)
* [Consejos](#consejos)
* [Referencias](#referencias)


## Contexto
De manera general, la certificación «**OffSec Web Assessor**» es ofrecida por [OffSec](https://www.offsec.com) la cual se centra exclusivamente en los fundamentos de la seguridad de aplicaciones web y la explotación de vulnerabilidades tales como: XSS, CSRF, SQLi, SSRF, XXE, CORS, SSTI y algunas otras.

Esta certificación y el curso tienen un valor de **1,749** dólares (el plan más barato, si es que a eso se le puede llamar barato); tienes un total de **90** días de acceso y **1** intento de examen. Para la prueba en sí, tienes **23** horas y **45** minutos para completarla y, una vez finalizado ese tiempo, cuentas con otras **24** horas adicionales para subir el informe con tu documentación.

La certificación trae el siguiente curso llamado «**WEB-200**», el cual ofrece una visión general y relativamente superficial de algunos conceptos/aspectos/tópicos, pero suficientes dado el contexto de la certificación (entiéndase como el nivel o al público dirigido).

Tiene una duración total de **231** horas de contenido y, a través de sus 16 módulos y laboratorios de desafío, el temario enseña a realizar reconocimiento y a explotar vulnerabilidades como **XSS**, **SQLi** y **SSRF** utilizando herramientas estándar como Burp Suite y, pues, **Kali Linux** (obvio, es OffSec).

En resumen, es un entrenamiento estructurado y directo al grano para darte la base práctica necesaria para rendir el examen **OSWA**.

Adicionalmente, el curso trae un total de **11** máquinas para que puedas practicar (profundizo en esto más adelante).

Con base en la información proporcionada por **Offensive Security** los estudiantes que finalicen el curso serán capaces de:

- Entender y explotar diferentes tipos de vulnerabilidades **Cross-Site Scripting** (XSS).
- Utilizar herramientas de fuzzing para descubrir vulnerabilidades de «**inyección SQL**».
- Aprender sobre la política «**Same-Origin**» y cómo interactuar con peticiones “**cross-origin**”.
- Identificar y explotar vulnerabilidades «**Cross-Site Request Forgery** ([CSRF](https://owasp.org/www-community/attacks/csrf))».
- Aprender a utilizar herramientas como **Burp Suite**, **Nmap** y **Gobuster** para el análisis de aplicaciones web.
- Aprender la detección de parámetros, archivos y directorios a través de herramientas como **Wfuzz** y **Hakrawler**.
- Entre otros…

> Para mayor información: [Página del curso WEB-200 de OffSec](https://www.offsec.com/courses/web-200/).

## ¿Por qué esta certificación y no otra?
Aquí seré bien sincero, ya que esta decisión está bastante influenciada por una percepción muy personal. El factor principal para rendir esta certificación fue que hace tiempo di la **BSCP** y reprobé. Eso me desmotivó bastante y dejé de meterle al estudio en general [entiendo totalmente que el fracaso es parte del camino al éxito, pero a veces las emociones o pensamientos me superan].

Además de esto, notaba en mí ciertas falencias técnicas. Si bien podía explotar con éxito vulnerabilidades y cosas así, no tenía del todo claro el trasfondo, o más bien sentía que mi repertorio de técnicas era acotado (espero se entienda el punto que deseo transmitir). Sentía la necesidad de repasar conceptos, mejorar mis principios y construir una base más sólida sobre cosas básicas que justamente tocaba este temario; por lo tanto, creo que la mejor alternativa fue haber hecho el curso.

Adicionalmente, era un sueño para mí y una muy buena oportunidad para conocer y acercarme a **OffSec**.

## Preparación (Curso y laboratorios)
Estudié el curso por casi dos meses (quizás un poquito menos). En mi caso, influyó bastante el tema del tiempo, el trabajo, el entrenamiento y todo eso, pero seguro que si estás más libre y le tryhardeas, puedes terminar antes. De todas formas, recomiendo que te tomes tu tiempo.

A mi parecer, el material es bastante completo y superdirecto en cuanto a conceptos relevantes; no le dan tantas vueltas. Hay módulos más extensos que otros y, como mencioné al principio, noté que existen tópicos que se tocan de manera superficial (creo que por el público al que va dirigido). Sin embargo, esto se soluciona rápido con una búsqueda en Google para que quede claro.

Algo clave durante el estudio: tomar notas, hacer resúmenes estructurados con lo más relevante, marcar palabras clave (keywords) y utilizar fuentes confiables alternativas por si no entiendes algo o deseas profundizar. También recomiendo mucho crear tus propias hojas de trucos (cheat sheets), ya sea con **payloads** de distintas vulnerabilidades o conceptos teóricos.

Si te preguntas si el curso basta para el examen, yo diría que sí. Si le das la importancia necesaria y estudias a conciencia, es más que suficiente para comprender las cosas y aprobar. De todas maneras, yo me apoyé en recursos externos, sobre todo en **PortSwigger** (Web Security Academy) para practicar vulnerabilidades concretas en sus laboratorios.

### Labs
Adicionalmente, es superrelevante no descuidar el apartado práctico: haz máquinas en TryHackMe, Proving Grounds, PortSwigger y las propias del curso.

Sobre las máquinas del curso, tienen una dificultad variada (que obviamente dependerá de cada persona). Personalmente, encontré los labs entre difíciles y muy difíciles; de hecho, hubo dos máquinas que me quedaron por completar. Para darte una idea más clara como estadística, había laboratorios en los que me demoraba un par de horas (sobre una hora y 60 minutos más del tiempo que tiene estipulado OffSec), y otros en los que llegué a invertir hasta **14** horas para completar la máquina.

> Por favor, no te engañes a ti mismo yendo a buscar la solución o pistas solo para marcar la máquina como completada.<br> <br> Si miras las respuestas/pistas, que sea para aprender; cambiar esa mentalidad te ayudará muchísimo... Lo digo por experiencia.

Considero superimportante hacer simulacros tipo examen: toma una máquina aleatoria de cualquier plataforma e intenta descubrir las vulnerabilidades lo más rápido posible. Ve cambiando de estrategia y subiendo el ritmo (1.° intento: una máquina; 2.° intento: 2 máquinas seguidas; 3.° intento: 4 máquinas seguidas, y así).

Además, trata de no leer la descripción de las máquinas para que no sepas con lo que te vas a encontrar, para que sea lo más acorde al examen.

Lo otro: con las máquinas que hagas, redacta un informe detallando los hallazgos. Es importantísimo que practiques el formato y los criterios que te van a exigir en el reporte real.

Otra cosa: enfócate solamente en vulnerabilidades de aplicaciones web. No te pongas a escalar privilegios si logras **RCE**, ya que para el examen no es relevante ni requerido. Procura optimizar tu tiempo y hacer solo las tareas que aporten al contexto de la certificación. ✌😉

## Día del examen
Bueno, yo agendé el examen para un día sábado a las **21:00** horas. Sin embargo, por razones que desconozco, me lo cambiaron a las **20:00** de ese mismo día y no me había llegado ninguna notificación ni correo informando sobre este cambio. Menos mal se me ocurrió revisar la plataforma donde se agendan; si no, probablemente me hubiesen cancelado el examen por la demora. Ajeno a ese detalle, no tuve ningún otro problema o malentendido con **OffSec**.

Establecí esa hora ya que, según yo, funciono mejor de noche (soy el señor de la noche xD). Mi plan era quedarme hasta las **4:30** para avanzar lo máximo posible, luego dormir y despertar entre las **10:30** y las **11:30**.

Cuando por fin llegó el día, debo decir que estaba tranquilo, pero a la vez ansioso y nervioso. Durante el transcurso de la jornada, aproveché de alejarme de cualquier pantalla, notebook y celular para mantener la cabeza fría y llegar fresco al examen. Salí a andar en moto para distraerme y, de paso, aproveché de ir a comprar unas cosas para las horas de prueba: principalmente botellas de agua, unas tres Coca-Colas Zero, unos postres de proteína, barritas y unas gomitas ácidas.

Sin más vueltas, OffSec recomienda conectarse mínimo 15 minutos antes para la validación de identidad y todo el proceso con el proctor, pero decidí conectarme un poco antes por si surgía algún problema. (Un consejo: no te vayas a conectar una hora o 40 minutos antes, ya que se te puede bugear la wea; máximo 20 minutos). Entré y no había nadie, pero al cabo de tres minutos se conectó un proctor. Me saludó con el mensaje predeterminado de bienvenida y me preguntó si quería comenzar con la validación, a lo que respondí que sí. Me pidió que mostrara mi cédula de identidad (**ID**), pero con la webcam se veía borroso, así que terminé presentando mi cédula desde la pantalla del PC (un compañero de trabajo me recomendó hacer eso, ¡muchas gracias! 😊). Una vez hecho eso, me pidieron mostrar mi habitación y listo: proceso de verificación completado con éxito, señores.

Una vez que dieron las **20:00**, me llegó un correo con toda la información necesaria para el examen. Me conecté con éxito a la **VPN** y creé las carpetas correspondientes para las **5** máquinas del examen.

Comencé en orden. Al cabo de unos **30** minutos logré obtener mi primera flag (`local.txt`). Como estrategia, la vulnerabilidad que encontraba la iba documentando en simultáneo (solo tomando capturas y ordenando la **PoC**); sabía que si me ponía a redactar texto, iba a perder tiempo valioso, y para eso está el plazo extra del informe.

Luego de un rato, me estanqué en esa misma máquina; no lograba dar con la segunda vulnerabilidad para conseguir el `proof.txt`, así que decidí cambiar de objetivo. Mi regla era: si ya veía que me demoraba más de **40** minutos en conseguir alguna flag, cambiaba de máquina enseguida para no perder el tiempo. Esa táctica me estaba funcionando bien; entre las **23:40** y las **00:50** ya llevaba un total de 3 flags. Sin embargo, después de eso me bloqueé mal. No lograba dar con ninguna vulnerabilidad nueva, así que me empecé a desesperar y a bajar mi ritmo. Al notarlo, decidí pausar un poco, pedí un break al proctor para ir al baño, lavarme la cara, tomar agüita y comer algo.

Al volver, logré obtener mi **4** flag. Pero, nuevamente, me pasó lo mismo: estuve atascado hasta las 5 de la mañana sin conseguir nada y empecé a hacer cosas tontas por el cansancio. Le avisé al proctor que me iba a dormir, pausé mi cámara y me pararon la conexión a la **VPN**. Dormí como nunca (me sorprendió, porque estaba angustiado). Desperté alrededor de las **11:20**, comí, me duché, activé la cámara, le avisé al proctor que ya estaba de vuelta y seguí.

Hubo varios momentos durante el examen en los que de verdad creí que iba a reprobar. Mis pensamientos me jugaron una mala pasada; se me había vuelto todo negro y me decía a mí mismo: “Me voy a echar esta wea, cagué”, “tendré que pagar la wea de retake” xDDD. (Me cago de la risa ahora, pero en ese momento fue terrible).

Recordemos que el examen consta de **5** máquinas, y cada una tiene dos banderas (`local` y `proof`). Luego de varias horas sin sacar nada nuevo, por fin obtuve mi quinta flag, pero aún me quedaba pwnear más cosas para asegurar los puntos. Volví a retomar aquellas máquinas en las que no había podido sacar la vulnerabilidad para el `proof` y, luego de horas de intentar e intentar, logré comprometer una máquina por completo. Creo que en ese momento ya tenía los puntos necesarios para aprobar, pero decidí seguir y sacar alguna bandera más para asegurarme, por si me mandaba algún error tonto con el informe (teslita moment).

Pasó el tiempo y parecía que no sacaría nada más. Pero, literalmente, a **30** minutos de terminar el examen, logré sacar una bandera extra. Grité como enfermo, bailé y todas esas cosas que hago (los que me conocen saben cómo soy xD). Luego de eso le tuve que pedir disculpas al **proctor**, jajaja, me dio mucha vergüenza. Aproveché el tiempo restante para asegurarme de tomar más capturas de pantalla, guardar salidas de comandos, etc.

Llegó la hora final, me cortaron la **VPN**, me despedí del proctor y ya solo me quedaba hacer el informe…

> No recuerdo al cien por ciento cada minuto de cómo fue el examen, así que los tiempos que comenté son más bien una aproximación para que no se lo tomen tan literal o seriamente. <br> <br> La verdad es que no es tan terrible el **proctored**. Para las personas que odian las cámaras o se sienten incómodas con eso, les aseguro que luego de un rato se te olvida por completo que te están viendo, así que tranqui. ✌

Luego de unos minutos, me acosté en la cama. En eso entró mi madre y me dijo: '¿Y tú? ¿Qué haces acostado? ¡Haz el informe!' xD. Pero le respondí que estaba cansado, así que lo haría mañana temprano... (Seguramente el teslita se iba a quedar dormido rápido y despertar temprano un día lunes que tiene libre xDD) - presentía que tenía que haber avanzado algo esa misma noche, ya que yo soy muy lento para documentar.
![Meme sobre procrastinar la escritura del informe del examen](./images/jerry-meme.png)

Como era de esperar, terminé despertándome tipo **11:50** y empecé con el informe recién a las **13:20**. Mientras lo hacía, me di cuenta de que no había tomado las capturas con el formato correcto para la sección de las flags; me dio un momento de locura y me dio error Windows. Pero como yo soy un hombre que resuelve, me salvé: tomé las capturas de nuevo del Burp como pude, saqué algunas del navegador con las pestañas que todavía tenía abiertas y listo, ahí resolví. Lo peor de todo es que me había pasado con **3** o **4** flags. Luego de esa pérdida de tiempo, retomé a máxima velocidad con la redacción de los hallazgos.

Mientras redactaba, veía la hora y cada vez estaba más cerca del deadline. Nuevamente me entraron pensamientos de que no iba a alcanzar y casi me da la tontera, pero me dije: “No puedo fallar y menos con el informe”, así que a darle nomás.

Terminé el informe a las **19:00**, lo exporté, le di una revisada rápida y a las **19:13** lo mandé...

Me quedé muy perseguido (preocupado) con el tema del formato; según yo, no había cumplido e iba a reprobar por culpa de esos errores tontos. Literal, estuve pensando todo el día en eso. Llegó el día martes y en el trabajo no lograba concentrarme. Luego mi abuelo me preguntó cómo me había ido, le conté sobre los errores que había cometido con el informe, le expresé mi preocupación y noté en su cara la decepción máxima (como diciendo “este es aweonao (tonto) y es para pegarle” 😂).

Pasaron los días y el miércoles en la mañana soñé que me llegaba el correo con los resultados y que había aprobado. Literal, desperté asustado, la primera cosa que hice fue buscar el correo y, obviamente, no estaba.
![Reacción al esperar los resultados del examen OSWA](./images/locura.jpeg)

Trabajé de manera normal y, luego del trabajo, me quedé dormido. Habré despertado tipo **22:50**; revisé la bandeja y ahí estaba el correo con los resultados. No lo podía creer. No lo quería abrir (serios problemas de confianza el hombre 😎). Dije en mi cabeza: ‘Ya, ábrelo, total, reprobaste’; empecé a leer y, pues, aprobé.

Fue un alivio máximo y felicidad a tope. Me puse a bailar, puse mi Russian hardbass a full y listo, xD. Esa fue mi experiencia con el examen; espero que te haya gustado y haberte sacado alguna risa.

## Informe
Para el informe utilicé [SysReptor](https://sysreptor.com/) y la plantilla, pero hice algunas modificaciones con respecto a la paleta de colores, estilo e imágenes (como saben, me gusta que el informe se vea bonito).
![Plantilla original de SysReptor para el informe de la certificación OSWA](./images/report.png)
![Plantilla de SysReptor personalizada con paleta de colores y estilo modificados](./images/custom.png)

Igual la versión que envié no es **100%** de mi estilo y gusto, pero lo suficiente como para sentirme cómodo. Una vez que tenga la plantilla modificada y con el estilo que quiero, la publicaré aquí (cuenta la leyenda que dije lo mismo en una review anterior y nunca subí la template).

## Opinión personal
Con respecto al curso, me gustó mucho; aprendí bastantes cosas y repasé sobre todo conceptos básicos. Quedé con una base más sólida y en el trabajo he podido poner en práctica mis nuevas habilidades y conocimientos, así que superfeliz.

El examen lo encontré demasiado **CTF style** (en el buen sentido, eso sí), cosa que no me gustó mucho. Sentí que las máquinas del curso eran bastante más complejas que el propio examen. Ojo, no estoy diciendo que el examen sea fácil (ya que hubo una máquina de la que derechamente no logré sacar ninguna vulnerabilidad o flag). Agradezco realmente que los labs hayan tenido una mayor dificultad porque, de cierta manera, te preparan y te ayudan a pensar un poco más allá o a simplemente seguir intentando, lo cual me sirvió muchísimo durante la prueba real.

Si me preguntan si recomiendo esta certificación: sí, totalmente. Pero depende mucho de quién seas y qué estés buscando. Si eres alguien que quiere entrar al mundo del pentesting web, o si ya tienes algo de experiencia pero sientes que te falta ordenar los conceptos y construir una base teórica y práctica más sólida (justo lo que me pasaba a mí), te va a venir excelente. Ahora bien, si ya tienes mucha experiencia en el ámbito web o buscas un entorno realista y no tan enfocado en el formato **CTF**, quizás se te quede corta y te convenga apuntar a algo más avanzado. Pero como punto de partida o para consolidar conocimientos, es una buena opción a mi parecer.

## Consejos
Aquí dejo algunos tips que pueden ayudarte a prepararte mejor y a aprobar:

- Tomar notas.
- Leer detenidamente el material de estudio.
- Hacer resúmenes estructurados y centrarte en lo más relevante.
- Haz tus propios cheat sheets.
- No vayas a por las soluciones/pistas si no es por aprendizaje.
- Practica con máquinas casi todos los días.
- Haz simulacros del examen.
- Redacta y practica la documentación de vulnerabilidades.
- Si no entiendes algo, busca, no te quedes con esos vacíos.
- Try Harder!
- Desarrolla una metodología propia con la que te sientas cómodo.
- Practica y entiende las vulnerabilidades.
- Mantén un orden y toma notas de las máquinas, declara endpoints, tecnologías, usuarios, etc.
- No dejes el informe para el final. Si encuentras alguna vulnerabilidad, ve pegando las fotos en la PoC.
- Toma captura de pantallas completas.
- Sal a caminar o tomar aire fresco.
- No vayas a lo loco.
- Prioriza y aprovecha bien el tiempo.
- Cuando te sientas perdido, haz una pequeña retroalimentación de lo que tienes y revisa si no te quedan flujos pendientes por revisar.
- Toma descansos y mantente hidratado.
- Constancia.

## Referencias
A continuación adjunto algunos enlaces que me sirvieron y reviews que leí en su momento.

- [OSWA: Un curso diferente sobre ataques web – emvee-nl](https://emvee-nl.github.io/posts/OSWA-a-different-course-on-web-attacks/#practice-makes-perfect)
- [Guía del examen WEB-200 OSWA – Centro de ayuda de OffSec](https://help.offsec.com/hc/en-us/articles/4410105650964-WEB-200-Foundational-Web-Application-Assessments-with-Kali-Linux-OSWA-Exam-Guide)
- [Página del curso WEB-200 – OffSec](https://www.offsec.com/courses/web-200/)
- [PortSwigger labs: Cross-Site Scripting (XSS)](https://portswigger.net/web-security/all-labs#cross-site-scripting)
- [PortSwigger labs: Cross-Site Request Forgery (CSRF)](https://portswigger.net/web-security/all-labs#cross-site-request-forgery-csrf)
- [PortSwigger labs: Cross-Origin Resource Sharing (CORS)](https://portswigger.net/web-security/all-labs#cross-origin-resource-sharing-cors)
- [PortSwigger labs: XML External Entity (XXE) injection](https://portswigger.net/web-security/all-labs#xml-external-entity-xxe-injection)
- [PortSwigger labs: Server-Side Request Forgery (SSRF)](https://portswigger.net/web-security/all-labs#server-side-request-forgery-ssrf)
- [PortSwigger labs: Inyección de comandos del sistema operativo](https://portswigger.net/web-security/all-labs#os-command-injection)
- [PortSwigger labs: Server-Side Template Injection (SSTI)](https://portswigger.net/web-security/all-labs#server-side-template-injection)
- [PortSwigger labs: Path traversal](https://portswigger.net/web-security/all-labs#path-traversal)
- [PortSwigger labs: Inyección SQL](https://portswigger.net/web-security/all-labs#sql-injection)
- [PortSwigger lab: Referencias directas a objetos inseguros (IDOR)](https://portswigger.net/web-security/access-control/lab-insecure-direct-object-references)
- [PortSwigger lab: ID de usuario controlado por parámetro de solicitud con divulgación de contraseña](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter-with-password-disclosure)
- [MDN Web Docs](https://developer.mozilla.org/es/docs/Web/)
- [Retos de TryHackMe](https://tryhackme.com/challenges)

Espero te sirva y muchas gracias por leer ;)

Deja algún comentario y, cualquier cosa, mi DM está abierto. 😜

Estar aquí igual es un sueño =) Gracias Sikumy.