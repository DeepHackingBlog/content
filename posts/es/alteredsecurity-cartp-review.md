---
id: "alteredsecurity-cartp-review"
title: "CARTP Review - Certified Azure Red Team Professional 2023"
author: "axel-losantos-lizaso"
publishedDate: 2023-06-30
updatedDate: 2023-06-30
image: "https://cdn.deephacking.tech/i/posts/alteredsecurity-cartp-review/alteredsecurity-cartp-review-0.webp"
description: "Reseña y experiencia personal sobre la certificación CARTP de Altered Security, con detalles del examen, laboratorio y consejos para futuros candidatos."
categories:
  - "certifications"
draft: false
featured: false
lang: "es"
---

Este es el primer post que publico y estoy bastante contento de poder contaros mi experiencia con esta gran certificación de Altered Security. ["Attacking & Defending Azure Cloud" (CARTP)](https://www.alteredsecurity.com/azureadlab) es de las pocas certificaciones centradas en pentest Cloud que he podido ver por internet y me ha interesado cursar. Así que, hace cosa de un mes empecé con las clases y el laboratorio, y tras 3 semanas centrado en Cloud, empecé Junio con el examen aprobado.

![Laboratorio y entorno de examen de CARTP](https://cdn.deephacking.tech/i/posts/alteredsecurity-cartp-review/alteredsecurity-cartp-review-1.avif)

Ahora bien, soy de las personas que prefiere dar todo "escueto" y "mascao" para que no os lleguéis a aburrir de mis anécdotas y experiencias. El índice sobre el que me basaré es el siguiente (podéis saltar a la sección que más os interese)

## Contexto
Me embarqué en la aventura de certificaciones hace menos de un año, pudiendo obtener los conocimientos básicos de pentest con el **OSCP**, para posteriormente añadir el **eCCPTv2** a mis habilidades. Una vez finalicé con estos dos, decidí empezar con _[Altered Security](https://www.alteredsecurity.com/)_ obteniendo mi primera certificación en su academia, el _[CRTP - Certified Red Team Professional](https://blog.deephacking.tech/es/posts/alteredsecurity-crtp-review/)_.
Pero ahí no acabó, puesto que me enfrenté a una cruda realidad: muchos entornos reales cuentan con una pequeña parte en la nube (Azure AD) y en aquel entonces no sabía qué demonios era un "Tenant". Por lo tanto, al darme cuenta de mis conocimientos nulos en la nube, decidí buscar alguna certificación que me permitiera formarme, encontrando el _[CARTP](https://www.alteredsecurity.com/azureadlab)_.

No obstante, decidí tomármelo con más calma.

> ¿A donde voy con un pentest Cloud si no se ni como funciona?
>
> Axel, Mayo de 2023

Fue la primera pregunta que me hice a mí mismo. Así que opté por una solución sencilla, aprender Azure. Ahí entró en juego el [AZ-900 (Azure Fundamentals)](https://learn.microsoft.com/es-es/certifications/exams/az-900/), una certificación que me permitió obtener los conocimientos más básicos y que me ayudaron bastante más adelante.

> ¿Esto quiere decir que estoy obligado a sacármelo antes del CARTP?
> 
> Quieto compañer@, lo veremos más adelante

## Examen CARTP
El examen recoge todos los conocimientos mostrados en las **clases + laboratorio**, y tal vez algo fuera de ella. Como resumen de lo visto durante todo el curso:
- Descubrimiento y enumeración de servicios de Azure
- Compromiso y acceso inicial (Phishing, abuso de aplicaciones empresariales, aplicaciones lógicas y contenedores inseguros)
- Enumeración autenticada (Contenedores o "Blobs", cuentas automatizadas, plantillas de despliegue)
- Escalada de privilegios (Roles RBAC, Roles Azure AD, Subscripciones)
- Movimiento lateral (Pass-the-PRT, Pass-the-Certifícate)
- Técnicas de persistencia (_Hybrid Identity_, Golden SAML, Service Principals y grupos dinámicos)

Guau! ¿Todo esto? Sí, todo esto contenido en "140 horas de diversión" (es lo que se estima que tardas en realizar el laboratorio junto a los objetivos y tareas del temario). Además, queda repartido en cuatro diferentes "Kill Chains" para crear mayor dinamismo y realismo, puesto que la mayoría de las veces no es tan trivial.

> Para quien no sepa lo que es un "Kill Chain" básicamente es la estructura/workflow de un ataque. [Aquí podeis ver un ejemplo de un artículo de Microsoft](https://www.microsoft.com/en-us/security/blog/2016/11/28/disrupting-the-kill-chain/).

Volviendo a la certificación, el curso cuenta con laboratorios para obtener diferentes _**Flags**_ que van a ayudarte a cumplir con los objetivos que se te plantean con el fin de ir mejor preparado al examen.

> Calla y cuéntanos , ¿Cómo es el examen? ¿Qué te pareció?

Por partes y con calma. El examen, así como el [CRTP](https://blog.deephacking.tech/es/posts/alteredsecurity-crtp-review/), cuenta con 24+1 horas de "diversión" en un laboratorio controlado que tarda en desplegarse entre 10-15 minutos. El objetivo es conseguir una _flag_ tras haber logrado comprometer 5 recursos, 2 usuarios de Azure AD y 2 aplicaciones empresariales, para posteriormente acabar con un informe y entregarlo hasta **48 horas** después de finalizar con la prueba.

Ahora bien, el examen. Por poner un poco de contexto, todos los exámenes que he realizado hasta ahora los he empezado a las 13:00 PM, donde en este caso se ha contado con unas 10 horas de puro sudor, lágrimas, emociones encontradas y quebraderos de cabeza. ¿Y por qué suelo hacer los exámenes a esa hora? Muy simple, mi principal objetivo es ir a dormir con la mente despejada, sabiendo que he obtenido la puntuación mínima para aprobar. Y así poder descansar y contar al día siguiente con toda la mañana para poder repasar y hacer capturas. Es un tiempo fundamental que se agradece.

- Me gustaría puntualizar que esto es totalmente **subjetivo**, cada quién tiene su "truquito" para obtener su mejor rendimiento

Respecto al examen, por razones obvias no puedo contar de que trata específicamente, pero si que contaré mi experiencia. Desde que comencé me sentí muy cómodo, desarrollando la gran mayoría de los conceptos similares a los ya practicados en el laboratorio. Me encontré con la primera dificultad sobre las 16:00 PM, quedándome completamente sin ideas. ¿Que hacer en estos casos? Sigue enumerando, algo te has dejado por el camino. Una buena técnica es aprovechar los accesos que uno tiene para poder realizar enumeraciones directamente desde el portal de Azure, no estar enfocado únicamente en abrir una Powershell.

Sobre las 18:00 encontré un segundo muro, y este me generó mucha incertidumbre, ¿Hasta aquí llegue? ¿Ya no doy mas de mí? Ante esos pensamientos, decidí hacer un pequeño descanso y tomármelo como un CTF. Indagar y salir del manual PDF fue clave, aunque difícil por los escasos contenidos que pude observar por internet. Mis "únicos amigos" fueron [Cloudtricks](https://cloud.hacktricks.xyz/) y la página oficial de [Microsoft](https://learn.microsoft.com/es-es/)

Tras **8 horas de examen**, logré ver la luz al final del túnel. La **FINAL FLAG** estaba delante de mis narices, acabando con el examen a eso de las 20:30 PM, tirando el ordenador por la ventana y queriendo dormir con la pereza de tener que pasar 5 horas más realizando el reporte.

## ¿Merece la pena la certificación?
Completamente sí. _[Altered Security](https://www.alteredsecurity.com/)_ me parece una de las mejores academias para aprender, ya que logra comprimir muchísimos conocimientos y te genera un grado de base y seguridad del que a posteriori te ves capaz de cumplir con cualquier entorno en la vida real.
Pero sin duda, mi mayor justificación de por qué deberíais obtener esta certificación es por el **realismo** y la **necesidad de aprender** estos conocimientos para no verse en aprietos en entornos reales. Esto es así porque las entidades ya llevan un tiempo intentando salir de la dependencia del _on-premise_ (el directorio activo de toda la vida) para aprovecharse de las ventajas que proporciona **Cloud**, como podría ser: escalabilidad, ahorro de costes, mayor seguridad y mayor control del entorno, entre otros.

## Puntualizaciones / FAQ

> ¿Es necesario el AZ-900?

Realmente no. Supuestamente la certificación está preparada para que tu vayas con todo el morro y te presentes sin tener ni idea de Cloud. No obstante, así como el [CRTP](https://blog.deephacking.tech/es/posts/alteredsecurity-crtp-review/), cuentas con un tiempo reducido sobre el que tienes que obtener muchos conocimientos nuevos en poco tiempo. Por ello, bajo mi punto de vista, puede ser una buena opción examinarse previamente del AZ-900 o aprender por tu propia cuenta los conceptos más básicos de Azure.

> ¿Cuántos meses dedicaste? ¿Puedo obtenerlo en un mes?

En mi caso fue un mes de pura dedicación a esta certificación, trabajando y estudiando en mis ratos libres. Se puede sacar en un mes , pero debe ser un mes con pocos compromisos, carga baja de trabajo y muchas ganas de escuchar ingles :)

> ¿Qué nos vamos a encontrar en el portal del laboratorio y examen?

Una vez confirmemos nuestra fecha de inicio en el portal, iniciaremos sesión con nuestra cuenta de correo y accederemos al panel de información. Se nos ofrece en primera instancia un entorno Windows al que se puede acceder por navegador, diferentes credenciales de usuarios y las de la VPN, por si preferimos conectarnos de esta última manera.

El portal cuenta con una sección para poder iniciar el examen, así como otra para añadir las _flags_ del laboratorio e ir cumpliendo los objetivos. Así como dato, existe una _flag_ estilo CTF que debemos obtener sin ayuda de ningún instructor y que sirve de repaso para el examen.

Finalmente, se nos dará acceso a un OneDrive compartido donde contaremos con un manual del laboratorio explicado y los diferentes videos del curso que podremos descargar y visualizar en cualquier momento. Como complemento, se nos ofrecerá los diagramas de las cuatro "kill chains" mencionadas anteriormente y las herramientas necesarias agrupadas en un zip.

> ¿Qué va antes, CRTP o CARTP?
> 
> De los creadores de, ¿Qué vino antes, el huevo o la gallina?

Ambas certificaciones tocan AD, una _on-premise_ y otra en Cloud. Sin embargo, creo que no es necesario obtener el CRTP antes de plantarse con Azure Cloud AD, así que para gustos colores. Si estás interesado en tener conocimiento básico en AD, te remito directamente al CRTP; en caso contrario, si lo que te gusta es Azure Cloud, entonces CARTP es tu certificación.

> ¿Qué informe puedo utilizar como plantilla?

En mi caso utilice la misma que en el [CRTP](https://blog.deephacking.tech/es/posts/alteredsecurity-crtp-review/). Y me dirás, ¿y cual demonios es la que usaste en el [CRTP](https://blog.deephacking.tech/es/posts/alteredsecurity-crtp-review/)? La respuesta es: la plantilla del INE. Fue indiferente, ya que perfectamente se podría utilizar la plantilla que ofrece [Offensive Security](https://help.offsec.com/hc/en-us/articles/360046787731-PEN-200-Reporting-Requirements#pwk-report-templates) para sus exámenes.

> ¿Cómo se hace un informe de este tipo?

Me lo tome como si fuera una historia, contando cada paso que realizada y añadiendo un pequeño diagrama del estado de mi "kill chain", facilitando al lector a conocer el punto en el que estábamos en todo momento. No es un informe de vulnerabilidades como tal, sino explicar el proceso del intrusión en el sistema. hasta lograr la _flag_, básicamente un write up.

Para "dibujar" la _kill chain_, utilice un [portal](http://code.benco.io/icon-collection/azure-icons/) que me permitía descargar los iconos de manera gratuita y generé los diagramas con el conocido [Excalidraw](https://excalidraw.com/). Me pareció una buena manera de contar los pasos realizados hasta obtener la flag.

> ¿Cómo se si he comprometido todo?

Esta es una pregunta que me hice al obtener la flag. ¿Tengo todo lo que necesito? Que agobio, no se si termine o me salté algún paso. Tranquilidad… el examen esta pensado para que si llegas a la flag final, significa que necesariamente has tenido que pasar por todos los demás puntos a comprometer. Pon pausa a tu cabeza, echa la vista atrás, y enumera cada recurso, usuario y aplicación comprometida, y verás como cuentas con el 100% de los requisitos.

* * *

Y esto es todo lo que tengo que contar sobre esta certificación. Estoy con muchas ganas de que aparezcan nuevos cursos de Cloud, así como alguno de AWS o Google para poder ponerle foco, sin olvidar las otras áreas tan interesantes que tiene este mundo. ¡Gracias por haber llegado hasta aquí y nos vemos!
