---
id: "hacktricks-azrte-review"
title: "HackTricks AzRTE Review – Certified Azure Red Team Expert 2025"
author: "hector-ruiz-ruiz"
publishedDate: 2025-06-02
updatedDate: 2025-06-02
image: "https://cdn.deephacking.tech/i/posts/hacktricks-azrte-review/hacktricks-azrte-review-0.webp"
description: "Review completa de la certificación AzRTE de HackTricks Training: contenido del curso, laboratorios prácticos, examen y mi experiencia como Certified Azure Red Team Expert 2025."
categories:
- "certifications"
draft: false
featured: false
lang: "es"
---

El cloud... Una tecnología que ha cambiado el paradigma de la infraestructura tecnológica empresarial por completo, hace unos años, todos discutíamos sobre su viabilidad, no obstante, su adopción ha sido masiva. Cualquier empresa, independientemente de su tamaño, emplea sus servicios hoy en día, ya sea de forma híbrida o total en modelos de negocio como startups.

Este motivo fue el que me llevo en 2024 a iniciar mi formación ofensiva en Cloud de la mano de las certificaciones de HackTricks Training, la vertiente formativa de la archiconocida HackTricks, con las cuales he pasado de Cero to Hero. Es por ello, que cuando el equipo de HackTricks anunció su nueva certificación, **[AzRTE (Azure Red Team Expert)](https://training.hacktricks.xyz/courses/azrte)**, salté de cabeza al carrito de la compra.

![Certificado AzRTE obtenido](https://cdn.deephacking.tech/i/posts/hacktricks-azrte-review/hacktricks-azrte-review-1.avif)

Tras completar el AzRTE, poseo todas las certificaciones cloud disponibles por parte de HackTricks (AzRTE, GRTE y ARTE), por lo que espero que esta review os sirva de referencia a todos ellos que estéis pensando en dar vuestros primeros pasos en Azure o queráis expandir vuestros conocimientos de cara a la ejecución de ejercicios de Red Team Cloud.

Durante esta review, trataremos los siguientes puntos:

- [Contexto](#contexto)
- [Curso y Laboratorio](#curso-y-laboratorio)
- [Examen AzRTE](#examen-azrte)
- [Conclusiones](#conclusiones)
- [AzRTA - AzRTE Lite](#azrta-azrte-lite)
- [Descuento](#descuento)

## Contexto

La pregunta que todos nos solemos hacer normalmente antes de comenzar una certificación es:
- ¿Necesito conocimientos previos para poder cursar y aprobar la certificación?

Y la respuesta es sencilla, no, yo cuando empecé con las certificaciones de HackTricks no tenía experiencia previa más allá de la que puede tener cualquier persona que esté introducida en el sector de la ciberseguridad.

Todos los conceptos que necesitas conocer e interiorizar, son explicados durante el transcurso del curso, lo que la hace una opción ideal para partir de una base casi nula (si trabajas en el sector IT) y conseguir adquirir las aptitudes necesarias para ejecutar auditorías Cloud.

## Curso y Laboratorio

Una vez comprado tu voucher para la certificación, obtendrás acceso al curso y al laboratorio, algo importante a destacar es que el acceso a los materiales es permanente, por lo que si en el futuro el curso sufre actualizaciones de cualquier tipo, ya sea que incluyan nuevos materiales o los actualicen, siempre podrás consultarlos y refrescar tus conocimientos.

El laboratorio es accesible para practicar durante 60 días naturales desde que canjees el voucher, e incluye más de 80 labs, los cuales deberás ir completando a lo largo del curso, si estás preocupado por el tiempo, bajo mi experiencia, es más que de sobra, siempre me han sobrado días de acceso al laboratorio en cada una de las certificaciones que he cursado.

No obstante, es posible adquirir más días de acceso al laboratorio en cualquier momento en caso de que lo necesitases.

![Progreso del curso AzRTE](https://cdn.deephacking.tech/i/posts/hacktricks-azrte-review/hacktricks-azrte-review-2.avif)

Al momento de escribir esta review, el curso cubre 23 de los servicios más comunes de Azure y Entra ID, más 3 servicios de seguridad defensiva, siendo la certificación por excelencia en cuanto a número de servicios tratados y cantidad de laboratorios en los que practicar.

Por cada uno de estos servicios, aprenderás:
- Cómo funciona y para qué sirve el servicio en cuestión
- Características específicas de dicho servicio
- Enumeración manual/automatizada del mismo
- Escaladas de privilegios
- Acciones de post-explotación
- Persistencia
- De 1 a 9 laboratorios en los cuales practicar lo aprendido

![Material del curso AzRTE](https://cdn.deephacking.tech/i/posts/hacktricks-azrte-review/hacktricks-azrte-review-3.avif)

Con la cantidad de laboratorios que esta certificación ofrece, es imposible que no acabes dominando las herramientas de Microsoft para interactuar con Azure y Entra ID, como Azure CLI o Azure PowerShell entre otras, y eso es algo que me gusta mucho de las certificaciones de HackTricks en general.

La calidad de los distintos laboratorios es muy buena, tratando de mantener un enfoque realista en las explicaciones y explotaciones de los servicios.

## Examen AzRTE

El examen consta de un laboratorio 100% práctico en el que tendrás que encontrar 3 flags mediante la explotación, escalada de privilegios y pivoting en un tenant de Azure.

Dispones de 12 horas para encontrar las 3 flags, si en algún momento te sientes atascado, recuerda que en este tipo de exámenes, la enumeración juega un papel fundamental, así que repasa nuevamente todos tus findings.

Es muy útil ir tomando notas de todos los contenidos del curso y laboratorios que vayas resolviendo, hacerte tus propias cheat sheets te permitirá desenvolverte con mayor seguridad durante el examen, si has completado todo el curso y tomado apuntes, estoy bastante seguro de que aprobarás.

El examen no es sencillo, y me gustó mucho, ya que pone a prueba tus conocimientos y metodología adquiridos.

> Pro Tips
- No confíes en el output de una única herramienta
- Enumera sin parar hasta que identifiques un vector de explotación claro
- Mantente calmado, hay tiempo de sobra para completar el examen
- Piensa fuera de la caja y no te compliques, todo lo que necesitas saber está en el curso

> Extra Points (PR)

Por último me gustaría mencionar el sistema de Extra Points, en cualquiera de las certificaciones de HacktTricks, si llevas a cabo un PR al repositorio oficial de Github, en el cual explicas una nueva técnica que has descubierto haciendo research, obtendrás un extra point, este extra point te permitirá no entregar una flag en el examen, pudiendo aprobar con tan solo 2 flags, lo cual incentiva a los alumnos a investigar y compartir conocimiento relativo a nuevos vectores de explotación en Azure.

![Examen AzRTE completado](https://cdn.deephacking.tech/i/posts/hacktricks-azrte-review/hacktricks-azrte-review-4.avif)

¡Espero veros certificados pronto!.

## Conclusiones

Mi opinion al respecto a esta certificación es clara, antes de nada me gustaría mencionar que yo he pagado todas las certificaciones de forma íntegra, no he recibido ningún tipo de descuentos por parte del equipo de HackTricks y mi opinión no se encuentra sesgada.

AzRTE es sin duda la mejor certificación de Azure que vas a encontrar, la cantidad de laboratorios y contenidos es inigualable, y algo que para mí es muy importante, el delivery y las explicaciones, una plataforma clara y minimalista, a través de la cual es muy fácil extraer los contenidos y hacer apuntes de forma eficiente.

Otro aspecto que me parece fundamental de esta certificación, es que al contrario de otras, está enfocada en aplicar los conocimientos a un entorno real, en la certificación se trata el proceso de ejecución de un ejercicio de Blackbox y Withebox, comentando los requisitos que deberás solicitar al cliente de cara a poder llevarlos a cabo, lo que aporta un gran valor añadido, al final del día es lo que todos queremos saber para el desarrollo de nuestra profesión.

Los cursos y laboratorios se van actualizando con relativa frecuencia, revisando la plataforma, puedo ver como en las dos certificaciones que realicé con anterioridad (ARTE y GRTE) hay nuevos laboratorios y lecciones que no estaban disponibles en su momento.

## AzRTA - AzRTE Lite

Si consideras que **AzRTE** es mucho para ti, el equipo de HackTricks Training, está planeando el lanzamiento de **AzRTA**, el cual es una versión más simple de la original, **AzRTE**, en ella también podrás aprender los conceptos fundamentales de Azure y explorar un número reducido de servicios.

Tras completar **AzRTA**, obtendrás un **descuento del 25%** para cursar AzRTE, por lo que también me parece una opción interesante, ya que es una forma más barata y sencilla de introducirse en el mundo del Red Teamming Cloud.

**AzRTA** no tendrá examen de certificación y dispondrás de 30 días de acceso al laboratorio, en los cuales practicar al igual que en AzRTE, pero con menos servicios.

Una vez completado todos los laboratorios, obtendrás un certificado. El diploma contiene un código QR que se puede utilizar para verificar su autenticidad como el del resto de certificaciones.

## Descuento

Puedes obtener un 15% de descuento en cualquier certificación de [HackTricks](https://training.hacktricks.xyz/), incluida la de esta misma review, usando el siguiente código:
- `DEEPHACKING`

Dicho esto, me despido de todos vosotros, un saludo y Happy Hacking!
