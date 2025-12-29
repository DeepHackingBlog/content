---
id: "offsec-osep-review"
title: "OSEP Review - OffSec Experienced Penetration Tester 2024"
author: "victor-capatina"
publishedDate: 2024-01-02
updatedDate: 2024-01-02
image: "https://cdn.deephacking.tech/i/posts/offsec-osep-review/offsec-osep-review-0.webp"
description: "Review completa y sincera de la certificación OSEP (OffSec Experienced Penetration Tester), incluyendo consejos, tips para el examen y herramientas útiles para aprobar."
categories:
  - "certifications"
draft: false
featured: false
lang: "es"
---

Buenas a todos, mi nombre es Víctor y vengo a haceros una review corta, pero sincera sobre la OSEP (OffSec Experienced Pentester). Si… otra certificación que te quita 1600€ de la cartera (O a la empresa donde trabajas, si tienes suerte.)

![Certificado OSEP de Víctor Capatina](https://cdn.deephacking.tech/i/posts/offsec-osep-review/offsec-osep-review-1.avif)

Hace escasos días, me mandaron el mail de confirmación de que soy oficialmente un OSEP Certified, así que salí a la calle pensando que tendría un aura especial alrededor, pero al final resulta que no 😒.

Pero bueno, dejando ya las coñas y tonterías aparte, vamos a lo jugoso: ¿Qué tal está la certificación? ¿Merece la pena? La respuesta corta es sí. La larga es también sí, pero con más texto, así que vamos allá:

Según OffSec, en la OSEP vas a aprender las siguientes cosas:

- Ejecución de código por parte del cliente con Office (Macros maliciosas)
- Ejecución de código malicioso con JScript (No confundir con JavaScript)
- Process Injection and Migration
- Introducción a la evasión de antivirus
- Técnicas avanzadas de evasión de antivirus
- Application whitelisting
- Bypassing de filtros de red
- Kiosk breakout
- Windows credentials
- Movimiento lateral en Windows y Linux
- Ataques con Microsoft SQL
- Explotación de Active Directory

Aunque el temario es bastante extenso (el PDF tiene aproximadamente 700 páginas), la realidad es otra, ya que durante gran parte del curso te enseñan el porqué de las cosas y la manera tradicional y metódica de hacer las cosas (como por ejemplo bypasear el AMSI usando winDBG) para luego resumirte esas 20-30-40 páginas en un único comando que hace exactamente lo mismo. No obstante, esto no tiene nada de malo, ya que te enseña cómo funcionan las cosas por debajo, algo que es fundamental para que entiendas su exploit.

## ¿Es necesario tener la OSCP antes?

Si y no. La OSCP se centra en buscar y usar exploits públicos, mientras que la OSEP está enfocada en tema de directorio activo y evasión de antivirus. Además, (casi) todo lo que necesitas saber te lo van a enseñar en el curso… aunque saber cosas de más nunca vienen mal.

Si eres una persona que ya tiene conocimientos de Active Directory (no hace falta que sean muy profundos), ahórrate los 1600$ que cuesta la OSCP y preséntate a la OSEP de una. Con dos cojones! QUE SOMOS, LEONES O HUEVONES?

No obstante, diré una cosa, y es que los de OffSec son un poco guarrones, ya que te piden cosas que dan por sentado, que tú sabes por qué suponen que ya tienes la OSCP antes de presentarte a la OSEP.

## ¿Qué certificaciones sirven hacerse antes?

Corto y claro, la CRTP y la CRTO te darán un empujón… pero no esperes que te den todos los conocimientos que necesitas.

Aun así, tengo que decir que te puedes presentar perfectamente a la OSEP sin tener ninguna de las dos. Eso si, vas a sufrir lo que no está escrito… pero no nada es imposible (Bueno, sí. Que tu empresa te pague el OSEE).

Si no queréis gastaros dinero en certificaciones, tenéis los Pro Labs de HackTheBox, entre los cuales recomiendo encarecidamente RastaLabs y Cybernetics. Dicen que preparan bastante bien para el examen (Yo no los hice. No tengo dinero. Se lo di todo a OffSec)

## Tips para el curso

Como es navidad, voy a haceros un pequeño regalo y deciros tips ÚTILES de cara a la certificación y al examen:

1. Si estáis pillados de tiempo y queréis la certificación, saltaros la parte del PDF que te explica mucha paja (como las cosas low level. etc etc). Quédate simplemente con los comandos que usan y entiende para qué sirven.
2. Prepárate herramientas de backup SIEMPRE. Siempre ten un plan B para cualquier vector de ataque.
3. Aprende a usar metasploit BIEN (u otro C2 que tú quieras, pero que no sea comercial… como Cobalt Strike).
4. Hazte los labs 2-3 veces. Cada vez prueba una cosa diferente. Prueba otros vectores de ataque. Ten un plan Z si hace falta.
5. Enfócate en la enumeración como si te fuese la vida en ello. Powerview, BloodHound e Impacket van a ser tus mejores amigos durante estos meses.
6. Escribe en memoria en lugar de disco en la medida de lo posible.
7. Si estás atascado en alguna parte, pide ayuda en el discord de OffSec. La gente es muy maja y siempre te ayudarán.
8. Ten tus notas lo más organizadas posibles (yo las tengo divididas por categorías, como por ejemplo: Kerberos, enumeración Powerview, Evasión Antivirus, etc etc).

## Examen

El examen son 72h. Tienes 48h para hacer el examen y 24h para el reporte. Yo recomiendo encarecidamente hacer lo que yo hice: Mientras haces el examen vas tomando notas (obviamente) de tal manera que, cuando termines tu examen, vuelvas a resetear el lab, y ÚNICAMENTE siguiendo tus notas, lo haces todo de nuevo, asi te aseguras de que a la hora de hacer el reporte no te dejas nada.

En cuanto al reporte, no esperes a que pasen las 48h del examen para hacerlo. Empiézalo una vez termines el examen, delante del proctorer (yo incluso lo entregué delante del proctorer, con un par).

Explica todo de la manera más detallada posible. No tengas miedo a escribir mucho. No te van a cobrar por palabras.

## Herramientas

1. Para todo el tema de explotación de SQL: [OSEP-Tools SQL de Octoberfest7](https://github.com/Octoberfest7/OSEP-Tools/tree/main/sql)
2. Bypass del Constrained Language Mode (CLM): [bypass-clm de calebstewart](https://github.com/calebstewart/bypass-clm)
3. Process Hollowing en memoria (Este guardátelo como si fuese un rosario de la virgen maría): [Process Hollowing gist de qtc-de](https://gist.github.com/qtc-de/1ecc57264c8270f869614ddd12f2f276)

## Despedida

Y bueno. Eso es todo lo que tengo para vosotros el día de hoy. Si tenéis cualquier duda, sugerencia o lo que sea, me podéis encontrar en:

- Discord: viksant
- [LinkedIn de Victor Capatina](https://www.linkedin.com/in/victor-capatina-952032230/)
