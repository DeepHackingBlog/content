---
id: "zeropointsecurity-crto-review"
title: "CRTO Review - Red Team Ops 2024"
author: "victor-capatina"
publishedDate: 2024-10-01
updatedDate: 2024-10-01
image: "https://cdn.deephacking.tech/i/posts/zeropointsecurity-crto-review/zeropointsecurity-crto-review-0.webp"
description: "Review completa de la certificación CRTO (Certified Red Team Operator), incluyendo temario, laboratorios prácticos, consejos para el examen y recomendaciones para aprobar."
categories:
  - "certifications"
draft: false
featured: false
lang: "es"
---

Buenas tardes a todos. Como es de buen saber, mis posts son directos, concisos pero informativos. A (casi) nadie le importa una introducción que parece la biblia hablando hasta de que he comido hoy.

El maravilloso día de hoy vamos a hablar de la Certified Red Team Operator (A.K.A CRTO). Sin duda alguna una de las certificaciones de Red Teaming más reconocidas en el sector.

- [¿De qué trata?](#de-qué-trata)
- [Parte Práctica](#parte-práctica)
- [¿Merece la pena?](#merece-la-pena)
- [Examen](#examen)
- [Recomendaciones para la certificación](#recomendaciones-para-la-certificación)

## ¿De qué trata?

Según el temario oficial, estos son los temas que se tratarán durante el curso:

<div class="grid grid-cols-2 gap-4">
<div>

- Command & Control
- External Reconnaissance
- Initial Compromise
- Host Reconnaissance
- Host Persistence
- Host Privilege Escalation
- Initial Compromise (Reprised)
- Credential Theft
- Password Cracking Tips & Tricks
- Domain Reconnaissance
- User Impersonation
- Lateral Movement
- Session Passing
- Data Protection API

</div>
<div>

- Kerberos
- Pivoting
- Active Directory Certificate Services
- Group Policy
- MS SQL Servers
- Microsoft Configuration Manager
- Domain Dominance
- Forest & Domain Trusts
- Local Administrator Password Solution
- Microsoft Defender Antivirus
- Application Whitelisting
- Data Hunting & Exfiltration
- Extending Cobalt Strike

</div>
</div>

![Temario completo del curso CRTO](https://cdn.deephacking.tech/i/posts/zeropointsecurity-crto-review/zeropointsecurity-crto-review-1.avif)

Pero tranquilo que aquí está el tito Víctor para simplificártelo: Lo más importante es que vas a aprender a usar Cobalt Strike de forma básica a la vez que te adentras en el mundo del directorio activo, establecer persistencia, ataques de MSSQL, las credenciales en Windows y evasión de antivirus (Gracias a diferentes opciones incorporadas en Cobalt Strike).

Una de las cosas que sin duda alguna me han encantado de este curso es que está muy bien estructurado. Se enseña el contenido de manera paulatina. Esto no es OffSec que te dice 1+1 = 2 en el capitulo 1 y luego te preguntan como se llama el Papá de María si ella tiene 12 años y lleva un vestido rojo. De esta forma, vas a poder ir aplicando los contenidos/conceptos que has aprendido anteriormente.

## Parte Práctica

Los labs son una fiel copia de la teoría. Todo lo que necesitas saber está en el material lectivo. Por otro lado, son laboratorios integrados en el navegador (usando Guacamole), por lo que su estabilidad y fluidez no es la mejor que digamos. No dudes en poner en práctica todo lo que aprendas, de verdad. Lo vas a necesitar.

Una cosa muy buena que tiene este curso (el próximo un poquitín menos, [la CRTL](/es/posts/zeropointsecurity-crtl-review/)) es que los laboratorios son una fiel copia del material teórico. Vas a tener que empezar desde cero, montando la configuración de Cobalt Strike, su perfil, configurarlo, etc. Además, vas a tener acceso directo a todas las máquinas del laboratorio (incluida la del atacante, obviamente) donde vas a poder hacer todo lo que quieras, como por ejemplo modificar X política o Y permiso. Una vez tienes todo configurado, es hora de explotar! Estate preparado, porque vas a aprender a abusar de [Kerberos](/es/posts/humilde-intento-de-explicar-kerberos/) (y sus delegaciones), servidores SQL, [confianzas de dominio](/es/posts/trusts-confianzas-active-directory/) y ¡mucho mucho más!. Sin duda alguna es una experiencia súper práctica y completa si no te has peleado mucho antes con directorio activo.

Eso sí, cabe destacar que el laboratorio no viene incluido y se debe de pagar por horas, esto no siempre fue así y puede ir cambiando, así que os dejo el [enlace oficial de extensión de laboratorio Red Team Ops](https://training.zeropointsecurity.co.uk/pages/red-team-ops-lab-extension) donde lo tendréis actualizado siempre.

## ¿Merece la pena?

Corto y Claro: Sí. Si lo que te interesa es el red teaming y el active directory, por aproximadamente 500€ vas a aprender un MONTÓN de cosas que son MUY APLICABLES EN LA VIDA REAL. Posteriormente, si quieres seguir indagando en el tema, tienes la continuación del CRTO: La [CRTL](/es/posts/zeropointsecurity-crtl-review/). En pocas palabras, ahí vais a aprender técnicas avanzadas de evasión de EDR y Cobalt Strike.

## Examen

Por razones obvias no puedo hablar sobre temas explícitos del [examen oficial de Red Team Ops](https://training.zeropointsecurity.co.uk/pages/red-team-ops-exam). Pero lo que sí que te puedo decir es que TODO LO QUE NECESITAS PARA APROBARLO ESTÁ EN EL CURSO. No te van a preguntar nada que no te hayan enseñado antes. Además, tienes 48h repartidos en 4 días para sacar 6/8 flags necesarias, así que el tiempo sobra.

Mi recomendación personal es que nada más iniciar el examen, te tomes tu tiempo para asegurarte de que el 100% de tus técnicas para evadir el defender funcionan.

## Recomendaciones para la certificación

Pon en práctica todo lo que vayas aprendiendo. No caigas en el tutorial hell (Solo ver la teoría sin aplicar la práctica). Si no entiendes algo siempre pregunta a gente del [servidor de Discord de Zero-Point Security](https://discord.gg/Whz3YtY4gG) (o mejor aún, el [servidor de Discord de Deep Hacking](https://discord.com/invite/TVcDmHduAm)).

Yo, particularmente, lo que hago es leer el curso entero y tomar notas de ABSOLUTAMENTE TODO (casi que copio el contenido del curso pero con mis palabras y en español). Luego, vuelvo a empezar de nuevo pero haciendo la parte práctica a medida que perfecciono las notas que tomo. Cuando ya tengo las notas preparadas, las separo por categorías. Por ejemplo: Kerberos, evasión AV, Ataques SQL, Persistencia, etc.

Si tienes poco tiempo, puedes activar el antivirus nada mas empezar el lab (por defecto está desactivado), asi pones en práctica no solo los ataques que haces, sino también las técnicas de evasión y adquieres esa mentalidad OPSEC de la que tanto se habla.

Una vez te sientas cómodo en los labs y entiendes todo lo que haces, estarás preparado para el examen.

* * *

Y esto es básicamente todo lo que tengo que decir sobre la CRTO. En resumen, una certificación muy recomendada si te interesa el red teaming y el Active Directory.
