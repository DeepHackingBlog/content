---
id: "cai-ia-ciberseguridad"
title: "CAI, el futuro de la IA en ciberseguridad"
author: "luis-javier-navarrete"
publishedDate: 2025-05-12
updatedDate: 2025-05-12
image: "https://cdn.deephacking.tech/i/posts/cai-ia-ciberseguridad/cai-ia-ciberseguridad-0.webp"
description: "Descubre CAI, el framework open-source de IA para pentesting automatizado: resultados reales en HTB, PortSwigger y bug bounties, capacidades ofensivas y defensivas revolucionarias."
categories:
  - "miscellaneous"
draft: false
featured: false
lang: "es"
---

Seguro que estáis oyendo hablar de IA en ciberseguridad por todas partes. Que si detecta _malware_, que si analiza logs... pero ¿qué hay de la parte _offensive_? Como creadores de **CAI (Cybersecurity AI)**, llevamos tiempo trabajando en llevar la IA al siguiente nivel: automatizar el _pentesting_ y la búsqueda de _bugs_ de forma seria. Y sí, creemos que el futuro ya está tocando a la puerta.

Hoy no vamos a hablar solo de teoría. Vamos a contaros qué es CAI, nuestro _framework open-source_, y sobre todo, vamos a mostraros con datos y ejemplos (¡incluyendo _machines_ de HTB y labs de PortSwigger!) por qué pensamos que esto va a cambiar las reglas del juego.

- [El Pain Point: ¿Por Qué Necesitamos Algo como CAI?](#el-pain-point-por-qué-necesitamos-algo-como-cai)
- [¿Qué es CAI? Our Baby, Open Source](#qué-es-cai-our-baby-open-source)
- [Capabilities: ¿Qué Sabe Hacer CAI?](#capabilities-qué-sabe-hacer-cai)
- [Resultados Reales: Where the Magic Happens](#resultados-reales-where-the-magic-happens)
- [Sobre los LLMs y lo que Dicen los Vendors...](#sobre-los-llms-y-lo-que-dicen-los-vendors)
- [¿Para Quién Mola CAI?](#para-quién-mola-cai)
- [Entonces, ¿Le Damos una Oportunidad a CAI?](#entonces-le-damos-una-oportunidad-a-cai)
- [Get Involved!](#get-involved)

![Framework CAI de ciberseguridad con IA](https://cdn.deephacking.tech/i/posts/cai-ia-ciberseguridad/cai-ia-ciberseguridad-1.avif)

## El Pain Point: ¿Por Qué Necesitamos Algo como CAI?

Antes de meternos en harina, pongámonos en contexto. El panorama actual tiene sus _issues_:

1. **Talent Gap:** Faltan _pentesters_ y _security researchers_.
2. **Costes:** Auditorías serias y programas de _bug bounty_ no son baratos, y muchas _pymes_ se quedan fuera.
3. **Walled Gardens en Bug Bounty:** Plataformas como HackerOne o Bugcrowd centralizan mucho, lo cual no siempre es ideal para todos.
4. **Los Malos también Usan IA:** Los _adversaries_ no se duermen. Necesitamos herramientas que escalen.

CAI nació de la necesidad de abordar esto: un _framework_ para crear agentes de IA especializados que hagan el trabajo sucio (y a veces no tan sucio) de forma más rápida, barata y accesible.

## ¿Qué es CAI? Our Baby, Open Source

CAI no es una simple herramienta, es un **framework agente-céntrico**, _lightweight_ y, sí, **open-source** (lo tenéis en GitHub, link al final). Está pensado para construir _cybersecurity agents_ que hagan tareas específicas.

Imagina que puedes montar tu propio equipo de _AI pentesters_. La arquitectura mola bastante, se basa en:

- **Agentes:** Pequeñas IAs enfocadas (uno para _web recon_, otro para _binary exploitation_, etc.).
- **Tools:** Se integra con las herramientas que ya usas: Nmap, Gobuster, Frida, Hashcat, Burp, Ghidra (¡gracias al _Model Context Protocol_!), Impacket, etc. El agente decide qué lanzar.
- **Patterns:** Arquitecturas para coordinar agentes. Tenemos un _Red Team Agent_ para _pentesting_, un _Bug Bounty Hunter_ para _vuln hunting_, y ¡ojo!, también un **_Blue Team Agent_**. Este último se enfoca en la defensa: monitorización, respuesta a incidentes, _vulnerability assessment_ desde la perspectiva del defensor...
- **Human-In-The-Loop (HITL):** ¡Esto es CLAVE! No creemos en la autonomía total (todavía). Con un Ctrl+C puedes parar al agente, darle _feedback_, corregirlo... La colaboración humano-IA es el presente.

![Arquitectura del framework CAI](https://cdn.deephacking.tech/i/posts/cai-ia-ciberseguridad/cai-ia-ciberseguridad-2.avif)

## Capabilities: ¿Qué Sabe Hacer CAI?

Según nuestras pruebas y _R&D_ _(Research and Development)_:

1. **Automatiza la Kill Chain Ofensiva:** Desde el _recon_ y _scanning_, pasando por la _exploit_, hasta _post-exploitation_ (_privesc_, _lateral movement_) y _reporting_.
2. **Automatiza la Defensa (con Mentalidad Ofensiva):** CAI no solo ataca. Con los _Blue Team Agents_, puede automatizar tareas defensivas como _vulnerability assessments_ continuos o _incident response_ básico. Pero lo interesante es que lo hace **entendiendo cómo piensa un atacante**.
3. **Revienta CTFs (y Labs):** Se come _challenges_ de web, _reversing_, _pwn_, _forensics_, _crypto_... y como veremos, ¡también los labs de PortSwigger!
4. **Hace SAST (Static Analysis):** Analiza _source code_ directamente y encuentra _bugs_ en segundos/minutos.
5. **Bug Bounty Ready:** Diseñado para encontrar _bugs_ reales en entornos productivos.
6. **Flexible & Extensible:** Es _open source_, modular... _Sky's the limit_.
7. **Speed & Cost:** Reduce tiempos y costes de forma brutal.

[![Demo de CAI en Asciinema](https://cdn.deephacking.tech/i/posts/cai-ia-ciberseguridad/cai-ia-ciberseguridad-3.svg)](https://asciinema.org/a/713487) 

## Resultados Reales: Where the Magic Happens

Ok, basta de charla. ¿Funciona o no? Aquí van los datos duros de nuestras _benchmarks_ y pruebas:

- **CTFs vs Humanos:**
    - En 54 _challenges_ variados, CAI fue **11x más rápido** y **156x más barato** de media.
    - Destrozó en _forensics_ (938x más rápido), _reversing_ (774x) y _robotics_ (741x).
    - Le costó más en _pwn_ y _crypto_ avanzados.

![Benchmarks de CAI contra humanos en CTFs](https://cdn.deephacking.tech/i/posts/cai-ia-ciberseguridad/cai-ia-ciberseguridad-4.avif)

- **Resolviendo Máquinas y Labs Reales:**
    - **Hack The Box (HTB):** CAI automatiza toda la _killchain_. En 7 días, se metió en el **Top 30 de España y Top 500 mundial**. Aunque en _máquinas_ complejas el _First Blood_ humano suele ser más rápido, la capacidad de CAI para correr múltiples instancias en paralelo es una ventaja enorme.
    - **Ejemplo Concreto: Máquina AD de HTB (¡Esto es Oro!)**: Para que veáis cómo piensa y se adapta CAI, os contamos cómo reventó una máquina de Active Directory bastante puñetera:
        - **Olfateando y Encontrando la Pista 🕵️‍♂️:** _nmap_ rápido -> DC Windows. smbclient -> Share support-tools -> UserInfo.exe. ¡Sospechoso!
        
        - **Magia con el Binario ✨:** El .exe no soltaba las _creds_ LDAP fácil. Un script normal se habría bloqueado. CAI no. Descompiló con monodis, vio el XOR cutre (clave “armando”) y ¡ZAS! Contraseña LDAP lista. ¡Pura adaptación!
        
        - **Del Dominio al Usuario 🚪:** Con las _creds_ LDAP, ldapdomaindump. ¿El hallazgo? Pass de support en texto plano 🤦‍♂️. Acceso WinRM vía crackmapexec (porque otras _tools_ como _evil-winrm_ fallaron y CAI supo cambiar de estrategia).
        
        - **Show de Active Directory Automatizado 👑🤖:** ¡La especialidad de CAI! Detectó la vía de ataque RBCD (_Resource-Based Constrained Delegation_). El entorno era inestable, los scripts PowerShell fallaban. Un enfoque determinista se habría atascado. **La Solución de CAI (Inteligencia sobre herramientas):** Usó impacket (getuserspns.py, getnthash.py, secretsdump.py) de forma inteligente para explotar la RBCD y obtener acceso como Administrator.
        
        - **Resiliencia: Incluso Contra el Propio Kali Linux 🌪️:** El sistema donde corría CAI (nuestro Kali) empezó a dar errores: dependencias rotas, problemas de conexión... Cualquier enfoque tradicional habría colapsado. CAI no: identificó los fallos, resolvió conflictos de dependencias, reparó servicios y continuó el ataque sin pausa. ¡Nada lo detuvo! 🔥
    
    - **¿Por Qué CAI es Diferente (y Mejor) en estos casos? 😎**No es una secuencia rígida de comandos. Es una **inteligencia que orquesta herramientas**. Donde un script determinista falla ante un error o un entorno "raro", CAI:
        - **Analiza:** Entiende _por qué_ algo falla.
        - **Se Adapta:** Elige _tools_ alternativas (netexec en vez de evil-winrm, atexec en vez de psexec).
        - **Resuelve:** Soluciona problemas del entorno (DNS, variables, ¡hasta errores en el propio Kali!).
        - **Automatiza lo Complejo:** Un ataque a AD de principio a fin, sorteando obstáculos.

<video controls src="https://files.catbox.moe/mi6oow.mp4"></video>

- **PortSwigger Web Security Academy:** Se ventila _challenges_ de decenas de vulnerabilidades web en distintos entornos de forma autónoma. Ideal para automatizar pruebas web.
- **Análisis Estático (SAST) en Acción:** Encuentra SQLi en archivos .php _sin ejecutar nada_, solo leyendo el código.

![Análisis estático SAST con CAI](https://cdn.deephacking.tech/i/posts/cai-ia-ciberseguridad/cai-ia-ciberseguridad-5.avif)

- **Competiciones (Live CTFs):**
    - **"AI vs Human" CTF:** CAI quedó **1º entre las IAs** y **Top 20 mundial**, llevándose $750. Podéis ver el artículo de HackTheBox en el siguiente enlace:
        - [AI vs Human: CTF results show AI agents can rival top hackers](https://www.hackthebox.com/blog/ai-vs-human-ctf-hack-the-box-results)
    - **"Cyber Apocalypse CTF 2025":** Puesto 22º en 3 horas (entre +8000 equipos).
- **Bug Bounties - La Prueba de Fuego:**
    - Experimento de una semana:
        - _No Profesionales:_ Encontraron **6 bugs válidos** (CVSS 4.3-7.4).
        - _Profesionales:_ Encontraron **4 bugs** (CVSS 4.3-7.5).
        - **Takeaway:** ¡Resultados similares! CAI realmente **democratiza** el _bug hunting_ y el _security testing_.

## Sobre los LLMs y lo que Dicen los Vendors...

Hicimos _benchmarks_ con varios LLMs (Claude 3.7 Sonnet nos dio los mejores resultados _so far_). Creemos que algunos _vendors_ grandes están siendo algo conservadores al hablar de las capacidades _offensive_ de sus modelos. Nuestros resultados con CAI muestran que pueden hacer bastante más de lo que a veces se admite.

## ¿Para Quién Mola CAI?

- **Red Teams / Pentesters:** Para automatizar y acelerar.
- **Security Researchers / Bug Hunters:** Pros (para eficiencia) y _newbies_ (¡para empezar!).
- **Empresas (Especially SMEs):** Para _self-assessments_ continuos y asequibles.
- **Blue Teams:** Con el _Blue Team Agent_ para _monitoring_, _response_ y _vuln assessment_ continuo, entendiendo la perspectiva del atacante.
- **Academics / Researchers:** Plataforma _open source_ para investigar IA + Cyber.
- **Devs / DevOps:** Para integrar _SAST_ rápido en el _pipeline_.

## Entonces, ¿Le Damos una Oportunidad a CAI?

¡Totalmente! CAI es un proyecto **open source** con resultados que hablan por sí solos. Ha competido, ha ganado pasta, ha reventado _labs_, máquinas y ha ayudado a gente _random_ a encontrar _bugs_ reales. Y no olvidemos que también ayuda a automatizar la **defensa**, pero desde un punto de vista práctico y ofensivo: saber cómo te pueden atacar para defenderte mejor.

Lo de **democratizar** el acceso a _security testing_ avanzado (tanto _offensive_ como _defensive assessment_) es, para nosotros, lo más potente.

Obviamente, no es magia. La autonomía 100% tiene límites. El _HITL_ es fundamental. Pero como _tool_ para **aumentar capacidades** y **automatizar**, el potencial es gigantesco.

## Get Involved!

Si te mola la idea, quieres probarlo o contribuir:

- **GitHub Repo:** [Repositorio oficial de CAI en GitHub](https://github.com/aliasrobotics/cai)
- **Discord Community:** [Únete a la comunidad de CAI en Discord](https://discord.gg/fnUFcTaQAC)
- **Paper:** [Paper de investigación de CAI en arXiv](https://arxiv.org/pdf/2504.06017v2)

Trastea, mira qué hace, y cuéntanos. Quizás tu próximo _bug_ lo encuentres con un _AI buddy_.

¡Happy Hacking! 😁
