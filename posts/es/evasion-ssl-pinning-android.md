---
id: "evasion-ssl-pinning-android"
title: "Evasión de SSL Pinning en aplicaciones Android"
author: "pablo-castillo"
publishedDate: 2023-09-20
updatedDate: 2023-09-20
image: "https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-0.webp"
description: "Aprende a realizar análisis dinámico de aplicaciones Android mediante la evasión de SSL Pinning utilizando Frida y Objection para interceptar el tráfico de red."
categories:
  - "mobile-pentesting"
draft: false
featured: false
lang: "es"
---

El objetivo de este post es comenzar a dar nuestros primeros pasos en el análisis dinámico de las aplicaciones Android. Para ello, vamos a explicar en qué consiste este análisis, que es el SSL pinning y por qué es tan importante realizar su bypass. Además, explicaremos las herramientas empleadas para llevar a cabo estas tareas.

## ¿Qué es el análisis dinámico?

El análisis dinámico de una aplicación móvil consiste en el estudio del comportamiento de dicha aplicación cuando se encuentra en ejecución. Este tipo de análisis se realiza para complementar al análisis estático (del que hablaremos en próximos artículos) y observar el comportamiento y la funcionalidad del código, además de analizar el tráfico existente entre la aplicación y el servidor.

El problema para realizar este tipo de análisis consiste en las medidas de seguridad que suelen venir implementadas en la mayoría de aplicaciones. En concreto, hablamos del SSL pinning.

## ¿Qué es el SSL Pinning?

Cuando una aplicación móvil se quiere comunicar de manera segura con el servidor, se implementa el SSL pinning como medida de seguridad para evitar ataques de intermediarios, lo que hace que el servidor no confíe en los certificados del dispositivo donde se ejecuta la aplicación sino únicamente en aquellos certificados que se encuentran fijados en el código de la misma.

Años atrás la manera en la que se validaban los certificados en Android no era lo suficientemente segura debido a que cualquier atacante podía instalar en su dispositivo su propio certificado CA e interceptar las comunicaciones entre servidor y cliente. Actualmente, ese sistema no es válido, ya que la aplicación comparará los certificados CA del dispositivo con los de su lista preconfigurada y solo aceptará aquellos que sean de confianza.

Esto significa que, si queremos interceptar el tráfico de una aplicación con SSL pinning implementado y utilizamos un proxy (como Burp Suite) que tiene su propio certificado, hará que las comunicaciones entre ambos se detengan y la aplicación deje de funcionar.

Es en este momento donde entran en juego las herramientas que harán que la aplicación confíe en ese certificado intermediario y podamos interceptar las comunicaciones para poder llevar a cabo el análisis dinámico.

![Diagrama del proceso de SSL Pinning y su evasión](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-1.avif)

## Frida y Objection

Como se describe en su web, Frida es un _"conjunto de herramientas de instrumentación dinámica para desarrolladores, ingenieros inversos e investigadores de seguridad"_. En otras palabras, Frida permite la inyección de scripts en procesos en ejecución (como aplicaciones móviles) además de su exploración, enumeración y alteración. De esta manera, Frida inyectará el código necesario para permitir las comunicaciones entre una aplicación y el servidor empleando un proxy.

Por otro lado, Objection es una herramienta basada en Frida que posee sus propios scripts y funciones y permiten alterar el comportamiento de una aplicación de una manera más sencilla (aunque no siempre funcionará).

Sus páginas web principales son:
- [Sitio oficial de Frida - Dynamic instrumentation toolkit](https://frida.re/)
- [Repositorio de Objection en GitHub](https://github.com/sensepost/objection)

## Instalación de Frida y Objection

Para poder instalar estas herramientas es necesario tener python instalado en nuestro PC. Mi consejo es que no instaléis ninguna de las últimas versiones, ya que en algunas ocasiones pueden generar conflicto. Podéis descargarlo a través del siguiente enlace:
- [Descargar Python para Windows](https://www.python.org/downloads/windows/)

Una vez hecho esto, únicamente tendremos que ejecutar los siguientes comandos para realizar la instalación (es importante ejecutarlos en ese orden):
- python -m pip install frida
- python -m pip install frida-tools
- python -m pip install objection

El proceso es rápido y sencillo, pero si os surge alguna duda o algún problema siempre podéis consultar la web de Frida, que tiene mucha información y está muy bien documentada:
- [Documentación oficial de instalación de Frida](https://frida.re/docs/installation/)

Además de estas herramientas necesitaremos descargarnos un archivo llamado _frida-server_ para introducirlo en el dispositivo móvil y ejecutarlo, gracias al cual podremos inyectar el script. Tendremos que asegurarnos siempre de que la versión instalada de frida y la del frida-server sean la misma. Para conocer la versión instalada de frida, podéis ejecutar el siguiente comando:

```bash
frida --version
```

Además de esto, también es importante conocer la arquitectura que tiene vuestro dispositivo Android. Lo podéis ver en vuestro panel de dispositivos de Android:

![Panel de dispositivos Android mostrando la arquitectura del sistema](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-2.avif)

Por ejemplo, para mi dispositivo tendré que descargar el archivo _frida-server-16.1.4-android-x86.xz_ a través del siguiente enlace:
- [Descargas oficiales de Frida Server en GitHub](https://github.com/frida/frida/releases/)

![Página de releases de Frida en GitHub](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-3.avif)

Una vez hecho esto, ya tenemos todo lo necesario para comenzar con el siguiente paso.

## Proceso de evasión del SSL pinning

Existen muchas aplicaciones con una gran variedad de vulnerabilidades hechas exclusivamente para testearlas y practicar con ellas. Aquí podéis encontrar algunas de ellas:
- [OWASP MASTG - Aplicaciones de referencia para testing](https://mas.owasp.org/MASTG/Tools/0x08b-Reference-Apps/)
- [10 aplicaciones Android vulnerables para principiantes en hacking](https://www.linkedin.com/pulse/10-vulnerable-android-applications-beginners-learn-hacking-anugrah-sr/)
- [Lista de aplicaciones Android intencionadamente vulnerables](https://pentester.land/blog/list-of-intentionally-vulnerable-android-apps/)
- [UnSAFE Bank - Aplicación vulnerable para pentesting](https://github.com/lucideus-repo/UnSAFE_Bank)

Para nuestro caso, la aplicación que vamos a utilizar se llama _SSL-Pinning-demo_:
- [Descargar SSL Pinning Demo v1.3.1 en GitHub](https://github.com/httptoolkit/android-ssl-pinning-demo/releases/tag/v1.3.1)

Una vez descargada la aplicación, vamos a instalarla en el dispositivo Android. Para ello, podemos hacerlo de dos maneras: la primera es arrastrando la aplicación directamente sobre el emulador, y la segunda es empleando el siguiente comando (desde la carpeta donde se encuentre la aplicación):

```bash
adb install pinning-demo.apk
```

![Terminal mostrando la instalación de la aplicación mediante adb](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-4.avif)

Una vez la aplicación se encuentra instalada en el dispositivo, vamos a hacer una prueba: vamos a intentar interceptar el tráfico de la aplicación por medio de _Burp Suite_. Como recordaréis, en el artículo anterior vimos cómo tunelizar el tráfico de nuestro emulador a través de un proxy. [Guía completa sobre tunelización e interceptación de tráfico Android](https://blog.deephacking.tech/es/posts/como-tunelizar-e-interceptar-trafico-android/). En la siguiente imagen podéis observar cómo al pulsar uno de los botones para interceptar la petición vemos que _Burp Suite_ no intercepta nada, se vuelve rojo y además la aplicación muestra un mensaje de error relacionado con el SSL y el certificado:

![Aplicación mostrando error de SSL Pinning al intentar interceptar con Burp Suite](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-5.avif)

En otras ocasiones, en aplicaciones reales de las stores, normalmente lo que sucede es que la aplicación se queda congelada al arrancar o muestran un mensaje de que no está conectada a Internet. Este tipo de errores son los que nos hacen ver que tienen la medida de seguridad del SSL pinning.

Para realizar la evasión, tendremos que comenzar introduciendo dos archivos dentro del dispositivo Android: el certificado de _Burpsuite_ que descargamos previamente para interceptar el tráfico y el servidor de frida que mencionamos más arriba. Recordaros que para descargar el certificado seguiremos estos pasos:
- _Proxy → Proxy Settings → Import/Export CA Certificate → Certificate in DER format_

El servidor de frida es un archivo de extensión _.xz_ que se descomprime como cualquier otro de extensión _zip_ o _rar_. Al descomprimirlo modificaremos el nombre para que solo quede _frida-server_. Por comodidad os recomiendo que tengáis siempre este tipo de archivos dentro de la misma carpeta (en mi caso en _platform-tools_):

![Carpeta platform-tools mostrando los archivos necesarios](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-6.avif)

Ahora introduciremos estos dos archivos dentro de la carpeta _/data/local/tmp_ del dispositivo y le daremos los permisos necesarios al _frida-server_ empleando los siguientes comandos:

```bash
adb push cacert.der /data/local/tmp/cert-der.crt
adb push frida-server /data/local/tmp
adb shell chmod 777 /data/local/tmp/frida-server
```

![Terminal ejecutando comandos adb para subir archivos al dispositivo](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-7.avif)

Una vez hecho esto, ponemos a funcionar el servidor de frida para que se pueda realizar la inyección del script de la siguiente forma:

```bash
adb shell /data/local/tmp/frida-server &
```

![Terminal mostrando frida-server ejecutándose en segundo plano](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-8.avif)

En otra pestaña de nuestra _cmd_ ejecutaremos un comando de frida que nos muestre todas las aplicaciones en ejecución del dispositivo móvil. Es importante que la aplicación esté funcionando, de lo contrario no la localizará. El comando es el siguiente:

```bash
frida-ps -U
```

![Listado de procesos en ejecución del dispositivo Android con frida-ps](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-9.avif)

Si os fijáis encontramos dos columnas: en una vemos el PID de la aplicación, referenciado con un número, y en la otra el nombre. Son dos maneras válidas de reconocer el proceso que buscamos. Para realizar este último paso encontramos dos maneras de proceder igual de válidas y que hacen lo mismo de distinta manera.

## Método 1: Empleando Objection

Como mencionamos anteriormente, es una herramienta basada en frida que empleará distintos scripts y funciones predeterminadas. Mencionar que no solo sirve para evadir el SSL pinning, también realiza otras muchas tareas. Eso si, volver a decir que no siempre funcionan. Es la que yo siempre utilizo como primera opción (por comodidad). Conociendo el nombre de nuestra aplicación, ejecutaremos el siguiente comando:

```bash
objection -g "SSL Pinning Demo" explore
```

El nombre hay que introducirlo siempre entre comillas y copiarlo tal cual nos ha aparecido en el listado de procesos para no dar lugar a error. Una vez hecho esto, Objection se 'enganchará' a la aplicación y nos aparecerá una especie de shell. En ella, escribiremos el siguiente comando:

```bash
android sslpinning disable
```

![Terminal mostrando Objection deshabilitando SSL Pinning](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-10.avif)

Una vez hecho esto, minimizamos la consola y volvemos a _Burpsuite_. Volvemos a pinchar encima del botón anterior y esta vez sí que hemos interceptado la petición al servidor con el host del aplicativo como se puede ver. Además, el botón de la aplicación ha pasado a ser verde en lugar de rojo cuando la dejamos pasar:

![Burp Suite interceptando correctamente la petición tras evadir SSL Pinning](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-11.avif)

![Aplicación mostrando botón verde indicando conexión exitosa](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-12.avif)

## Método 2: Empleando scripts de Frida

Para realizar la evasión con este método, en primer lugar tendremos que visitar el sitio web de frida donde se alojan los diferentes scripts realizados por la comunidad para múltiples propósitos:
- [Frida Codeshare - Repositorio de scripts de la comunidad](https://codeshare.frida.re/)

En nuestro caso, buscaremos un script que sirva para evadir el SSL pinning. Ocurrirá, como con Objection, que algunos no nos sirvan. Por ejemplo, para este caso me ha servido el segundo script que he probado, que ha sido el siguiente:
- [Script Frida Multiple Unpinning de akabe1](https://codeshare.frida.re/@akabe1/frida-multiple-unpinning/)

La realidad es que cuando tengáis almacenados una serie de scripts diferentes que utilizar, este método es tan simple como el anterior. Copiamos el código y lo guardamos en un documento de extensión _.js_ (javascript) y lo guardamos en la carpeta donde almacenamos todo lo de frida. A continuación, a la hora de ejecutar el siguiente comando, podremos hacerlo empleando el nombre de la aplicación o el número del proceso PID. Mi consejo es que, si la aplicación tiene un nombre de una única palabra, uséis el nombre, si por el contrario (como es este caso) tiene varias palabras o tiene algun caracter raro, usad el PID. Los comandos son estos:

```bash
frida -U -f <nombre-app> -l script.js
frida -U -p <PID> -l script.js
```

En mi caso en concreto, como la aplicación tiene un nombre largo, emplearé el PID de la siguiente manera:

```bash
frida -U -p 11953 -l fridascript2.js
```

![Terminal mostrando ejecución de script de Frida para evadir SSL Pinning](https://cdn.deephacking.tech/i/posts/evasion-ssl-pinning-android/evasion-ssl-pinning-android-13.avif)

El resultado es exactamente el mismo que el mostrado en el primer método, así que podéis elegir el que más os guste.

Además de estas formas de evasión, existe otra más compleja que consiste en inyectar el código dentro de la propia aplicación, pero para verlo primero tenemos que hablar del análisis estático en los próximos posts relacionados con Android.

Espero que os sea de gran ayuda, nos vemos pronto con más.

Un abrazo!

## Referencias
- [Hail Frida!! The Universal SSL Pinning Bypass for Android - InfoSec Writeups](https://infosecwriteups.com/hail-frida-the-universal-ssl-pinning-bypass-for-android-e9e1d733d29)
- [Recursos de seguridad en aplicaciones móviles - 0xche.org](https://0xche.org/recursos/seguridad-apps-moviles/)
