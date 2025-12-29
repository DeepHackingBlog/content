---
id: "htb-cwes-review"
title: "CWES Review - HackTheBox Certified Web Exploitation Specialist 2025"
author: "daniel-moreno"
publishedDate: 2025-11-05
updatedDate: 2025-11-05
image: "https://cdn.deephacking.tech/i/posts/htb-cwes-review/htb-cwes-review-0.webp"
description: "Review completa de la certificación CWES de HackTheBox: preparación, examen, comparación con eWPTX y BSCP, y consejos para aprobar."
categories:
  - "certifications"
draft: false
featured: false
lang: "es"
---

¡Aloh! ¿Qué tal va todo? Soy **eldeim**, ese es mi nombre _hacksor_, pero me llamo **Dani**.

Hoy os traigo una review bastante jugosa sobre cómo me preparé y aprobé la certificación **CWES (Web Exploitation Specialist)**. Últimamente está ganando bastante peso en el mercado por ser de **HackTheBox (HTB)**, y muchos la comparan con otras certificaciones como la **eWPTX** o la **BSCP**.

![Portada certificación CWES](https://cdn.deephacking.tech/i/posts/htb-cwes-review/htb-cwes-review-1.avif)

- [Contexto](#contexto)
- [¿Cómo es el examen?](#cómo-es-el-examen)
- [Mi experiencia](#mi-experiencia)
- [Tips](#tips)
- [Comparación con otras certificaciones](#comparación-con-otras-certificaciones)
- [Conclusión](#conclusión)

## Contexto

La [CWES (Web Exploitation Specialist)](https://academy.hackthebox.com/preview/certifications/htb-certified-web-exploitation-specialist), anteriormente llamada CBBH (Bug Bounty Hunter) es una certificación práctica orientada a hacking/pentesting de aplicaciones web para profesionales. Últimamente muy reconocida en el sector por los 20 temas/módulos que abarca:

1. Web Requests (Peticiones web)
2. Introduction to Web Applications (Introducción a aplicaciones web)
3. Using Web Proxies (Uso de proxies web / Burp Suite, OWASP ZAP)
4. Information Gathering - Web Edition (Recolección de información web)
5. Attacking Web Applications with Ffuf (Enumeración y fuzzing con Ffuf)
6. JavaScript Deobfuscation (Deofuscación de JavaScript)
7. Cross-Site Scripting (XSS)
8. SQL Injection Fundamentals (Inyecciones SQL)
9. SQLMap Essentials (Uso avanzado de SQLMap)
10. Command Injections (Inyección de comandos)
11. File Upload Attacks (Ataques por subida de ficheros)
12. Server-side Attacks (Ataques del lado servidor: SSRF, SSTI, SSI)
13. Login Brute Forcing (Fuerza bruta en autenticaciones: Hydra, Medusa)
14. Broken Authentication (Autenticación rota / fallos de identificación)
15. Web Attacks (HTTP Verb Tampering, IDOR, XXE)
16. File Inclusion (Inclusión de ficheros)
17. Session Security (Seguridad de sesiones: hijacking, fixation, CSRF, XSS, open redirect)
18. Web Service & API Attacks (Ataques a APIs y servicios web)
19. Hacking WordPress (Hacking de WordPress)
20. Bug Bounty Hunting Process (Proceso de bug bounty: metodología y reporting)

No hay ninguna sección que deje algo que desear la verdad, en todas tiene laboratorios para poner a prueba lo aprendido y luego **Skills Assessments** finales (como un CTF final específico del módulo).

![Módulos de la certificación CWES](https://cdn.deephacking.tech/i/posts/htb-cwes-review/htb-cwes-review-2.avif)

## ¿Cómo es el examen?

Puedes comenzar el examen cuando quieras, ya sea que acabes de comprar el voucher o que hayas completado todos los módulos. No es un examen proctored, o, dicho de otra manera, un examen donde alguien te controle, simplemente vas a tener una cuenta atrás, un acceso VPN, una máquina suya y un panel donde entregar todas las flags.

![Panel del examen CWES](https://cdn.deephacking.tech/i/posts/htb-cwes-review/htb-cwes-review-3.avif)

El examen se compone de cinco sitios web que debes comprometer en su totalidad, pasando desde el acceso como usuario con bajos privilegios hasta la escalada a administrador (tanto en la web como en el servidor). Se otorgan siete días para obtener ocho de las diez flags y redactar un informe (te proporcionan la plantilla). En realidad, esto se asemeja bastante a una auditoría real, en la que dispones de un plazo de una semana para completarlo todo.

Y si, para los que os lo preguntáis, está todo el contenido en inglés y el informe también es en inglés, en mi caso no tuve ningún problema, pero entiendo que haya gente que esto le suponga una dificultad extra.

## Mi experiencia

El examen es… jodidamente chulo, el típico que te lo haces, te escuece y luego te alegras de haberte atrevido a empezarlo.

En mi caso, como consejo para la gente que tiene intención en hacer la certificación, es MUY IMPORTANTE LA MENTALIDAD TRYHARD, yo lo hice con 5 monsters blancos y siendo un total de 18h el primer día, 16h el segundo, unas 10h el tercero y ya (por el trabajo) 8h, 6h, 6h aprox los restantes.

> Nota del editor (aka. Sikumy): Desde Deep Hacking promovemos el cuidarse a uno mismo, descansar y beber mucha awita.
> 
> ![Bebe awita](https://cdn.deephacking.tech/i/posts/htb-cwes-review/htb-cwes-review-4.avif)

Finalmente, cuando lo terminé y entregué se paró la cuenta atrás y solo quedaba esperar un máximo de 7 días laborales a que dieran el aprobado (o suspenso) en el informe, en mi caso fueron 4 días de espera.

![Aprobado certificación CWES](https://cdn.deephacking.tech/i/posts/htb-cwes-review/htb-cwes-review-5.avif)

## Tips

Considero que esta es la parte más importante, la que me garantizó el aprobado en la certificación.

Lo primero: tomar notas, pero de una manera insana. Copié y pegué contenido importante de la academia, de cada uno de los módulos y, sobre todo, ¡hice writeups paso a paso de cómo resolvía los Skills Assessments finales! (esto es súper importante: es donde realmente ves lo que aprendiste).

Luego, hice el Fortress de Akerva haciendo un writeup en tiempo real. Para quien no lo conozca, los Fortress de HTB son laboratorios avanzados y realistas de hacking que simulan entornos empresariales completos (pueden contener AD, Web, Pivoting...), mucho más grandes y complejos que una máquina CTF sola o un challengers. Haciendo que se aproxime lo máximo posible al examen.

[![Fortress de HackTheBox](https://cdn.deephacking.tech/i/posts/htb-cwes-review/htb-cwes-review-6.avif)](https://app.hackthebox.com/fortresses)

Sorprendentemente, el Fortress tiene un par de cosas que son idénticas a la certificación, así que es SÚPER RECOMENDABLE.

Por último, me hice una cheat sheet de que hacer/afrontar según lo que fuera encontrando.

![Cheat sheet personal para CWES](https://cdn.deephacking.tech/i/posts/htb-cwes-review/htb-cwes-review-7.avif)

## Comparación con otras certificaciones

Comparándola con la eWPT (que tengo) o la eWPTX (cuyo examen conozco muy bien por amigos), diría que la CWES/CBBH está por encima de la eWPTX, ya que en ambas se concatenan vulnerabilidades para acceder como administrador. Pero… HTB es HTB, y son unos cabrones, por lo que todo está mejor explicado y es más "difícil" y realista.

Si tenéis dudas sobre cuál hacer primero, sin duda tiradle a la CWES, ya que os costará muy poco más en comparación con la eWPT y, además, ¡el contenido está mejor explicado!.

![Comparación de certificaciones web](https://cdn.deephacking.tech/i/posts/htb-cwes-review/htb-cwes-review-8.avif)

## Conclusión

Hasta ahora, es de las mejores certificaciones que he realizado. HTB explica todo de manera muy clara y cubre casi todas las casuísticas posibles. Gracias a ello, terminé con una comprensión mucho más sólida tanto del contenido de la certificación como de mis propias habilidades, además de una experiencia muy gratificante y una buena retroalimentación sobre el informe final.
