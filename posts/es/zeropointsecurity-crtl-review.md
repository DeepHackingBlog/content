---
id: "zeropointsecurity-crtl-review"
title: "CRTO II / CRTL Review - Red Team Ops 2 2024"
author: "victor-capatina"
publishedDate: 2024-03-20
updatedDate: 2024-03-20
image: "https://cdn.deephacking.tech/i/posts/zeropointsecurity-crtl-review/zeropointsecurity-crtl-review-0.webp"
description: "Review completa y honesta de la certificación CRTO II / CRTL (Red Team Leader), incluyendo técnicas de evasión de EDR, consejos para el examen y recursos adicionales."
categories:
  - "certifications"
draft: false
featured: false
lang: "es"
---

Dicen que el más rico no es aquel que más tiene, sino el que más comparte. La cosa es que rico no soy, pero me gusta compartir. Es por ello que hoy vengo a hacer una review corta (pero honesta) del CRTO ll, también conocido como Red Team Leader (CRTL).

![Certificado CRTO II de Victor Capatina](https://cdn.deephacking.tech/i/posts/zeropointsecurity-crtl-review/zeropointsecurity-crtl-review-1.avif)

La certificación se enfoca en ser la continuación del famoso CRTO pero con la evasión en mente. Es decir, vas a hacer lo que hacías en el CRTO pero evadiendo el EDR de [Elastic](https://www.elastic.co/es/security/endpoint-security) a la vez que el Windows Defender.

Para ello, el curso te dota con los siguientes conocimientos:

- C2 Infrastructure
- Windows APIs
- Process Injection
- Defence Evasion
- Attack Surface Reduction (ASR)
- Windows Defender Application Control (WDAC)
- Protected Processes
- EDR Evasion

A medida que vayas avanzando en el curso, aprenderás nuevas técnicas de evasión que, sobre todo, se le pueden aplicar al cobalt strike en su perfil, como por ejemplo el [sleep mask](https://adamsvoboda.net/sleeping-with-a-mask-on-cobaltstrike/), el [thread stack spoofing](https://github.com/mgeeky/ThreadStackSpoofer), [PPID spoofing](https://www.ired.team/offensive-security/defense-evasion/parent-process-id-ppid-spoofing), etc.

Sinceramente, el curso te da una muy buena base sobre técnicas de evasión más avanzadas sobre las cuales tu tienes que seguir construyendo el conocimiento por tu cuenta. No te esperes bypassear el EDR de Kaspersky así de una después de haberte hecho este curso.

## ¿Es necesario tener el CRTO antes de hacer el CRTL?

En pocas palabras Sí, a no ser de que ya tengas vastos conocimientos de explotación de AD. Como he dicho antes, el CRTL es la continuación del CRTO, por lo que los ataques son muy parecidos pero aumentando más soluciones defensivas de por medio (EDR).

Además, el CRTO te va a permitir entender las bases del Cobalt Strike, algo que es fundamental para poder afrontar el CRTL.

## Laboratorios VS Examen

Los laboratorios son una fiel copia del examen. Esto no es OffSec para pedirte cosas que no hayas visto durante el curso. Si has conseguido hacerlo bien en los laboratorios, entonces estate tranquilo. Además, el examen dura 96h, por lo que tienes 12h al día durante 8 días para conseguir las 5/6 flags necesarias para aprobar.

## Recursos adicionales

Para asegurarte de que tus payloads son completamente indetectables por el EDR/AV, te recomiendo que le eches un vistazo a los siguientes recursos:

- [Defining Cobalt Strike Reflective Loader](https://securityintelligence.com/x-force/defining-cobalt-strike-reflective-loader/)
- [magic_mz_x86 and magic_mz_x64](https://www.redteam.cafe/red-team/shellcode-injection/magic_mz_x86-and-magic_mz_x64)
- [PE and Memory Indicators](https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/malleable-c2-extend_pe-memory-indicators.htm)
- [Revisiting the User-Defined Reflective Loader Part 1: Simplifying Development](https://www.cobaltstrike.com/blog/revisiting-the-udrl-part-1-simplifying-development)
- [An Introduction into Sleep Obfuscation](https://dtsec.us/2023-04-24-Sleep/)
- [GregsBestFriend - Tool designed to bypass AV/EDR systems](https://github.com/WKL-Sec/GregsBestFriend)
- [Unleashing the Unseen: Harnessing the Power of Cobalt Strike Profiles for EDR Evasion](https://whiteknightlabs.com/2023/05/23/unleashing-the-unseen-harnessing-the-power-of-cobalt-strike-profiles-for-edr-evasion/)
- [Cobalt Strike and YARA: Can I Have Your Signature?](https://www.cobaltstrike.com/blog/cobalt-strike-and-yara-can-i-have-your-signature)
- [Advanced Module Stomping & Heap/Stack Encryption](https://labs.cognisys.group/posts/Advanced-Module-Stomping-and-Heap-Stack-Encryption/)
- [Memory Encryption/Decryption with SystemFunction033](https://medium.com/@s12deff/memory-encryption-decryption-with-systemfunction033-2c391bc2bd89)
- [sRDI - Shellcode Reflective DLL Injection](https://github.com/waldo-irc/YouMayPasser/tree/master/sRDI-master)

## Conclusión

A modo de resumen y en mi opinión personal, puedo decir que es de las mejores certificaciones que he hecho. Además, su precio es muy asequible (500€ en total) comparado al conocimiento que obtienes. Si siempre has querido ser un haxor pero el AV te lo impide, la CRTL te será de mucha ayuda.

## Despedida

Venga, hasta luego.
