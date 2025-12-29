---
id: "como-empezar-en-bug-bounty"
title: "Cómo Empezar en Bug Bounty"
author: "eric-labrador"
publishedDate: 2022-04-01
updatedDate: 2022-04-01
image: "https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-0.webp"
description: "Guía completa para iniciarse en el mundo del bug bounty, incluyendo plataformas, herramientas, VPS, metodología y consejos para encontrar vulnerabilidades."
categories:
  - "web"
draft: false
featured: false
lang: "es"
---

En este post voy a estar explicando cómo adentrarse en el mundo del bug bounty. Para los que no tengan ni idea de qué es esto, el bug bounty es donde empresas, grandes o pequeñas, publican su infraestructura para que hackers de todo el mundo la puedan vulnerar abiertamente (con determinadas restricciones, por ejemplo, ataques de DDoS o ingeniería social normalmente están fuera del alcance), además, de manera completamente legal.

Gracias a esta posibilidad, personas con cualquier tipo de experiencia en el sector pueden practicar hacking en la vida real en vez de en un laboratorio ya vulnerable.

Índice:

- [Diferencia entre un CTF y un Bug Bounty](#diferencia-entre-un-ctf-y-un-bug-bounty)
- [¿Las Empresas pagan en Bug Bounty?](#las-empresas-pagan-en-bug-bounty)
- [Mejores plataformas para practicar Bug Bounty](#mejores-plataformas-para-practicar-bug-bounty)
- [¿Qué son los Programas Privados?](#qué-son-los-programas-privados)
- [Limitaciones en los Programas de Bug Bounty](#limitaciones-en-los-programas-de-bug-bounty)
- [Cómo se reporta una Vulnerabilidad](#cómo-se-reporta-una-vulnerabilidad)
- [¿Cómo determino la Criticidad de una Vulnerabilidad?](#cómo-determino-la-criticidad-de-una-vulnerabilidad)
- [¿Qué es un VPS? ¿Es importante para Bug Bounty?](#qué-es-un-vps-es-importante-para-bug-bounty)
- [¿Dónde puedo conseguir un VPS?](#dónde-puedo-conseguir-un-vps)
- [¿Dónde puedo practicar Hacking?](#dónde-puedo-practicar-hacking)
- [Tips básicos para obtener mejores resultados](#tips-básicos-para-obtener-mejores-resultados)

## Diferencia entre un CTF y un Bug Bounty

En bug bounty un hacker se enfrenta a sistemas los cuales técnicamente no deberían de ser vulnerables porque están en producción, por tanto, no sabes realmente si lo que estás auditando es vulnerable o no. Sin embargo, en un CTF sabes por adelantado que hay vulnerabilidades intencionadamente puestas para poder explotarlas.

El objetivo de un bug bounty es igual al de un CTF, es decir, vulnerar el servicio expuesto al exterior y ganar acceso a la máquina. La diferencia es que en bug bounty es algo más complicado el acceder al servidor remoto y normalmente se enfoca más en encontrar otros tipos de vulnerabilidades que puedan afectar o bien al correcto flujo de la web o bien a la seguridad de los usuarios.

Por ejemplo, un SSRF (Server Side Request Forgery) básico únicamente mostraría servicios internos del servidor:

![Ejemplo de SSRF mostrando servicios internos del servidor](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-1.avif)

En cambio, un RFI (Remote File Inclusion) que permita inyectar código HTML podría ocasionar un robo de credenciales mediante phishing y vulnerar la privacidad de los usuarios:

![Petición POST recibida en servidor del atacante mediante RFI](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-2.avif)

En la imagen, por ejemplo, podemos observar una petición POST recibida en el servidor controlado por el atacante. Si hubiéramos usado una plantilla para phishing, en vez de "test:for bugcrowd" estaríamos recibiendo las credenciales del usuario, gracias al RFI.

## ¿Las empresas pagan en Bug Bounty?

Sí, hay determinadas empresas que pagan por los bugs encontrados. Ahora, esto no quiere decir que sea llegar y besar el santo, seguramente veas por LinkedIn o Twitter bugs que se encuentran en programas de este tipo, y la ganancia de haberlo reportado, dando la idea de que es sencillo y común encontrar vulnerabilidades, pero por detrás hay mucho trabajo, así que si en los primeros días/semanas/meses ves que no encuentras nada, no dejes el bug bounty de lado, pero si enfócalo de otra manera, es decir, en lugar de hackear para encontrar vulnerabilidades, estudia y practica en entornos controlados (mencionaré algunas plataformas más adelante) e intenta en los programas de bug bounty buscar las vulnerabilidades que aprendas.

## Mejores plataformas para practicar Bug Bounty

Bien, no es que haya una mejor porque cada una tiene sus cosas, y cada una tiene programas que otras no tienen, pero sí que hay algunas que hay que mencionar:

- [HackerOne](https://hackerone.com/)
- [Bugcrowd](https://bugcrowd.com/)
- [Google Bug Hunters](https://bughunters.google.com/)
- [YesWeHack](https://www.yeswehack.com/)
- [Intigriti](https://www.intigriti.com/)

Hay bastantes más, pero estas son las principales y las que más confianza y seguridad dan a los hackers por el servicio de revisión de reportes que dan. Voy a mencionar una que va muy bien para practicar vulnerabilidades de inyección de código, como XSS, aunque en mi experiencia personal no me han dado buenos resultados en la parte de gestión de reportes, ya que reporté un XSS hace 2/3 meses y aún está en estado "on Hold"...

- [Open Bug Bounty](https://openbugbounty.org/)

<figure>

![Plataforma Open Bug Bounty](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-3.avif)

<figcaption>

Open Bug Bounty

</figcaption>

</figure>

## ¿Qué son los Programas Privados?

Bien, hay que tener en cuenta que en algunas de las plataformas anteriormente mencionadas (HackerOne, Bugcrowd, etc.) hay programas privados. Un programa privado es aquel que únicamente se puede acceder por invitación, es decir, que si no tienes acceso previo no puedes hacer nada relacionado con hacking en la web de la plataforma (de hecho no deberías ni saber que el programa existe, ya que no es público).

En el caso de HackerOne, se puede acceder a un programa privado de 2 formas: la primera es encontrar vulnerabilidades en programas públicos, de esta forma, las empresas de la plataforma te enviarán invitaciones a sus programas. La segunda manera de obtener invitaciones es completar retos del CTF que tiene creado HackerOne en [Hacker101](https://ctf.hacker101.com/). Por cada reto completado, la barra azul se irá incrementando, y cada vez que llegue al fin, obtendrás en menos de 24 horas alguna invitación a algún programa privado.

<figure>

![Barra de progreso de invitaciones en Hacker101](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-4.avif)

<figcaption>

Invitaciones obtenidas a través del CTF

</figcaption>

</figure>

Por otra parte, los públicos, como su nombre indica, son programas abiertos para todos los hackers registrados en la plataforma. Por eso, los hackers que llevan tiempo en la plataforma suelen estar en programas privados, ya que hay menos hackers testeando la web y, por lo tanto, más probabilidades de encontrar vulnerabilidades.

<figure>

![Listado de programas públicos en HackerOne](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-5.avif)

<figcaption>

Programas Públicos de HackerOne

</figcaption>

</figure>

## Limitaciones en los Programas de Bug Bounty

Dentro de cada programa, se pueden ver el tipo de vulnerabilidades que busca o no la empresa.

<figure>

![Vulnerabilidades fuera del alcance en un programa](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-6.avif)

<figcaption>

Fuera del Scope de un Programa de Bug Bounty

</figcaption>

</figure>

También sale si pagan o no pagan (en caso de que no paguen, te darán puntos a modo de reputación en la plataforma), en caso de que paguen saldrá la cantidad que pagan por la criticidad de la vulnerabilidad:

<figure>

![Tabla de recompensas según criticidad de vulnerabilidades](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-7.avif)

<figcaption>

Rewards dependiendo de la Criticidad de la Vulnerabilidad

</figcaption>

</figure>

## Como se reporta una Vulnerabilidad

Para reportar la vulnerabilidad en la empresa es tan fácil como ir al programa y seleccionar el botón de Submit Report:

<figure>

![Botón Submit Report en HackerOne](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-8.avif)

<figcaption>

Cómo enviar un reporte

</figcaption>

</figure>

Antes de reportar una vulnerabilidad, hay que tener en cuenta que se pueden dividir en:

- **Críticas**: Son las que ocasionan un impacto crítico, por ejemplo SQLi o RCE.
- **Criticidad alta**: Son las que ocasionan alto impacto sobre el activo, por ejemplo, SSRF con robo de los metadatos del cloud o con posibilidad de leer archivos internos de la máquina, XXE, etc.
- **Criticidad media**: Son las que tienen un impacto medio sobre el activo, por ejemplo CSRF o fugas de información (Information Disclosure).
- **Criticidad baja**: Son las que tienen una baja criticidad sobre el activo, por ejemplo el que se muestre alguna IP interna en las cabeceras HTTP de respuesta (es otro tipo de Information Disclosure).
- **Vulnerabilidad informativa**: Son "vulnerabilidades" las cuales pueden considerarse mejoras de seguridad en el servidor de cara a futuras modificaciones, pero que no ocasionan impacto alguno sobre el activo, por ejemplo, la ausencia de alguna cabecera HTTP.

## ¿Cómo determino la Criticidad de una Vulnerabilidad?

Las criticidad de las vulnerabilidades se calcula utilizando el CVSS (Common Vulnerability Scoring System). El CVSS es un estándar abierto y universalmente utilizado, que permite estimar el impacto de una vulnerabilidad.

Por ejemplo, en HackerOne se utiliza el CVSSv3, y la propia plataforma te proporciona una calculadora cuando vas a reportar un informe:

<figure>

![Calculadora CVSS integrada en HackerOne](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-9.avif)

<figcaption>

Calculadora CVSS de HackerOne

</figcaption>

</figure>

En caso de querer utilizar una calculadora externa (igual de funcional a la de HackerOne, en este caso) se puede utilizar la siguiente:

- [Calculadora CVSS v3 de NIST](https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator)

<figure>

![Calculadora CVSS v3 de NIST](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-10.avif)

<figcaption>

Calculadora CVSS de NIST

</figcaption>

</figure>

## ¿Qué es un VPS? ¿Es importante para Bug Bounty?

Un VPS es un Servidor Virtual Privado que básicamente te permite tener una máquina en la nube con una IP pública.  
Esto permite establecer conexiones entre máquinas sin necesidad de utilizar servicios como ngrok o sin necesidad de exponer un puerto de tu router de forma pública. Además, siendo una máquina en la nube, puedes crear y programar tareas que quieras que se ejecuten cada cierto tiempo.

Personalmente, para hacer bug bounty, recomiendo tener al menos 1 máquina en la nube. Por ejemplo, DigitalOcean es un hosting (entre otros muchos que hay) donde puedes tener tu propia máquina (VPS) mediante un plan de pago mensual, aun así, en este caso el plan mensual se paga solo si mantienes la máquina encendida 24 horas durante todo el mes, en caso contrario, pagarías por consumo (horas de la máquina encendida). Siguiendo esta lógica, si la máquina no se enciende en un mes, ese mes no se te cobrará nada de esa máquina.

<figure>

![Tabla de precios de VPS en DigitalOcean](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-11.avif)

<figcaption>

Precios en DigitalOcean

</figcaption>

</figure>

Entonces, ¿para qué es necesario un VPS?

Pues bien, a diferencia de hacer escaneos de, por ejemplo, nmap a redes internas, dado que no hay tráfico que salga al exterior, no se utiliza el ancho de banda de tu red personal. Al hacer un escaneo a diferentes IP públicas el ancho de banda se puede ver afectado y lo normal es que la red de tu router o bien no funcione o bien vaya muy lenta. No solo pasa con nmap, hay otras herramientas que tiran de mucho ancho de banda en caso de ser lanzadas al exterior. Además, en casos concretos, puede ser muy cómodo, ya que con el VPS, como se ha mencionado antes, no tienes la necesidad de que exponer los puertos de tu router al exterior, por ejemplo, si quieres recibir una conexión de una reverse shell, basta con que lo hagas desde el VPS y así te olvidas de la configuración de tu router:

<figure>

![Terminal mostrando reverse shell recibida en VPS](https://cdn.deephacking.tech/i/posts/como-empezar-en-bug-bounty/como-empezar-en-bug-bounty-12.avif)

<figcaption>

Reverse Shell Recibida en un VPS (Parte Inferior)

</figcaption>

</figure>

## ¿Dónde puedo conseguir un VPS?

Hay bastantes plataformas que lo ofrecen, aunque según mi experiencia con diferentes plataformas, recomiendo:

- [DigitalOcean](https://www.digitalocean.com/)
- [Linode](https://www.linode.com/)

## ¿Dónde puedo practicar Hacking?

Voy a dejar un listado de webs donde practicar/aprender la explotación de vulnerabilidades, aunque algunas plataformas son CTF, sirven igualmente para practicar la metodología:

- [PortSwigger Web Security Academy](https://portswigger.net/)
- [Hacker101 CTF](https://ctf.hacker101.com/)
- [Hack The Box](https://www.hackthebox.eu/)
- [TryHackMe](https://tryhackme.com/hacktivities)
- [PentesterLab](https://pentesterlab.com/)

## Tips básicos para obtener mejores resultados

Pues bien, aunque en este post no he querido entrar mucho en detalles técnicos, el principal consejo que puedo dar es utilizar Burp Suite. Para los que no lo sepan, Burp Suite es un proxy con el cual puedes interceptar peticiones/respuestas del servidor y modificarlas. Esto permite ver a bajo nivel como actúan las peticiones que se envían al servidor de una manera muy fácil y cómoda. Recomiendo trastear mucho con las extensiones de Burp y practicar mucho las funcionalidades, ya que es una herramienta muy potente. Si únicamente dispones del Burp Suite Community, para empezar está muy bien, aunque cuando consigas más soltura necesitarás la versión profesional del programa.

Otra recomendación, fuera del detalle técnico, es leer lo que pide el programa, es decir, que se puede y que no se puede hacer y la forma de actuar. Con esto me refiero a lo que puede pedir la empresa al hacker, es decir, para que la empresa sepa que estás actuando desde una plataforma de bug bounty, algunas empresas solicitan poner en los headers de las solicitudes HTTP el nombre de la web donde está alojado el programa. Es muy importante seguir esto, ya que en caso contrario la empresa puede pensar que está sufriendo un ataque malintencionado y podría tomar medidas legales contra ti.

Finalmente, dejo contenido de calidad por parte de la comunidad:

- [Canal de YouTube de Nahamsec](https://www.youtube.com/c/Nahamsec)
- [Canal de YouTube de STÖK](https://www.youtube.com/c/STOKfredrik/videos)
- [Canal de YouTube de Codingo](https://www.youtube.com/c/codingo)
- [Bugcrowd University en GitHub](https://github.com/bugcrowd/bugcrowd_university)
- [Awesome Oneliner Bug Bounty](https://github.com/dwisiswant0/awesome-oneliner-bugbounty)
- [The XSS Rat Course](https://thexssrat.podia.com/products/home)
- [Blog 0x80](https://0x80dotblog.wordpress.com/)
