---
id: "introduccion-al-analisis-estatico-en-aplicaciones-android"
title: "Introducción al análisis estático en aplicaciones Android"
author: "pablo-castillo"
publishedDate: 2026-09-13
updatedDate: 2026-09-13
image: "https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-0.webp"
description: "Primeros pasos en el análisis estático de aplicaciones Android: qué es, cómo se compone un APK y las herramientas indispensables para analizarlo."
categories:
  - "mobile-pentesting"
draft: false
featured: false
lang: "es"
---

## Introducción

¡Hola de nuevo! ¿Qué tal estáis? ¡Cuánto tiempo sin vernos! Volvemos a la carga con este post para dar nuestros primeros pasos en el análisis estático de las aplicaciones Android. Si recordáis, en el artículo sobre la evasión del SSL pinning ya adelantamos que el análisis dinámico y el estático son dos caras de la misma moneda y que se complementan entre sí. Pues bien, ha llegado el momento de hablar de esta segunda parte. En este artículo vamos a explicar en qué consiste este tipo de análisis, por qué es tan importante y qué cosas debemos tener en cuenta antes de ponernos manos a la obra. Para ello, vamos a ver las herramientas indispensables que utilizaremos para llevarlo a cabo.

- [Qué es el análisis estático de una aplicación](#qué-es-el-análisis-estático-de-una-aplicación)
- [Qué es un fichero APK y de qué está compuesto](#qué-es-un-fichero-apk-y-de-qué-está-compuesto)
- [Sobre la ofuscación y descompilación](#sobre-la-ofuscación-y-descompilación)
- [Entorno de trabajo para el análisis estático](#entorno-de-trabajo-para-el-análisis-estático)
- [Herramientas principales en el análisis estático](#herramientas-principales-en-el-análisis-estático)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

## Qué es el análisis estático de una aplicación

El análisis estático de una aplicación móvil consiste en el estudio de dicha aplicación **sin necesidad de ejecutarla** (de ahí su nombre, claro). A diferencia del análisis dinámico, donde observábamos el comportamiento de la aplicación en tiempo de ejecución, aquí lo que hacemos es "diseccionar" el fichero de la aplicación para inspeccionar su interior: su código, sus recursos, sus permisos, sus ficheros de configuración y todo aquello que la compone y que no se ve.

¿Y por qué es tan importante realizar este tipo de análisis? Pues bien, es habitual que los desarrolladores dejen (muchas veces sin darse cuenta) información sensible dentro del propio código de la aplicación. Hablamos de claves de API, tokens, credenciales *hardcodeadas*, URLs y *endpoints* internos, rutas de servidores, y un largo etcétera. El análisis estático nos permite localizar todo esto, además de ayudarnos a entender la lógica de la aplicación, mapear su superficie de ataque, revisar los permisos que solicita y detectar configuraciones inseguras. En resumen, nos da una fotografía completa de cómo está construida la aplicación antes incluso de arrancarla.

> Es importante mencionar que, si bien es posible encontrar vulnerabilidades únicamente leyendo el código de la aplicación, lo ideal siempre es estudiar su funcionamiento y entender cómo se ejecutan todas las operaciones por detrás. Esto hará posible la explotación de algunas clases o funciones vulnerables o mal configuradas empleando herramientas como *Frida*, donde podremos *hookearlas* para modificar su comportamiento (como hacemos con la evasión del *SSL Pinning*, por ejemplo).

Antes de empezar a trastear con las herramientas, hay una serie de cosas que conviene tener claras.

## Qué es un fichero APK y de qué está compuesto

Un *APK* (*Android Package*) no es más que un fichero comprimido (un *zip* de toda la vida) que contiene todos los elementos necesarios para que la aplicación funcione. Si lo descomprimimos (luego veremos cómo), nos encontraremos principalmente con lo siguiente:

- **AndroidManifest.xml:** el fichero más importante para nosotros. Aquí se declaran los permisos que solicita la aplicación, sus componentes (*activities*, *services*, *receivers*, *providers*), cuáles de ellos están exportados y la configuración general de la app.
- **classes.dex:** contiene el código de la aplicación compilado a *bytecode* de Dalvik. Puede haber uno o varios (`classes2.dex`, `classes3.dex`…). Este es el fichero que las herramientas van a "descompilar" para mostrarnos el código.
- **resources.arsc:** almacena los recursos compilados de la aplicación (textos, estilos, etc.).
- **res/** y **assets/:** carpetas donde se guardan los recursos e imágenes, así como otros ficheros que el desarrollador haya querido empaquetar (a veces aquí aparecen sorpresas jugosas).
- **lib/:** contiene las librerías nativas (ficheros `.so`) organizadas por arquitectura.
- **META-INF/:** guarda la información relativa a la firma de la aplicación.

## Sobre la ofuscación y descompilación

Otra cosa a tener en cuenta es la **ofuscación**. Muchas aplicaciones (sobre todo las que encontramos en las *stores* oficiales) utilizan herramientas como *ProGuard* o *R8* para dificultar la lectura de su código, renombrando clases, métodos y variables con nombres sin sentido (por ejemplo, `a.b.c` o similar). Esto no impide el análisis, pero sí que lo hace más lento y engorroso, así que no os asustéis si al descompilar una aplicación os encontráis con este panorama.

También hay que mencionar que la descompilación **no siempre es perfecta**. Al reconstruir el código a partir del *bytecode*, en ocasiones las herramientas fallan o no consiguen reconstruir ciertas partes al 100%. Es completamente normal y forma parte del proceso.

## Entorno de trabajo para el análisis estático

Como ya he mencionado alguna vez, yo casi siempre trabajo en entorno *Windows*. Tanto para trabajar con dispositivos emulados (aunque siempre utilizo un móvil físico) como para interceptar el tráfico con *Burp Suite*, es lo más cómodo, eficiente y rápido (contando con que este sea el sistema operativo principal de vuestro PC). Esto también ocurre con algunas herramientas empleadas en el análisis estático, sobre todo aquellas que utilizan una interfaz gráfica, como veremos a continuación. A pesar de todo, hay algunas herramientas que prefiero usar en Linux, así que si queréis usarlas todas en ese entorno, que sepáis que el resultado va a ser exactamente el mismo y es una decisión igual de válida.

Dicho esto, vais a necesitar tener Java instalado en cualquier sistema para utilizar la mayoría de las herramientas de análisis estático. Así que aquí os dejo rápidamente cómo hacerlo para ambos casos:

- **Windows:**
    - Descargad e instalad el archivo con extensión `.msi` (recomiendo las versiones 17 o 21) desde las [releases de Eclipse Temurin en Adoptium](https://adoptium.net/es/temurin/releases?version=21&os=any&arch=any).
    - Aseguraos de incluirlo en el PATH de Windows.
- **Linux:**
    ```bash
    sudo apt update
    sudo apt install openjdk-21-jdk openjdk-21-jre -y
    ```

## Herramientas principales en el análisis estático

Hay que comenzar mencionando que existe una infinidad de herramientas que os ayudan a analizar y trabajar sobre el código de una aplicación. Con el paso del tiempo, cada persona se va formando su propio arsenal de las que más le gustan o más se ajustan a su manera de trabajar. Pero aquí os voy a mostrar las que considero completamente indispensables y que os van a acompañar prácticamente en todas vuestras auditorías. Para no extender el artículo demasiado, vamos a hablar de ellas de manera resumida, ya que en próximos artículos veremos usos más avanzados de estas y de algunas otras.

### Apktool

*Apktool* es una herramienta de ingeniería inversa empleada para descodificar los recursos a su forma casi original y reconstruirlos tras realizar algunas modificaciones; además, permite depurar código *smali* paso a paso. A continuación tenéis los enlaces para descargarla y su guía de instalación:

- [Repositorio oficial de Apktool en GitHub](https://github.com/iBotPeaches/Apktool)
- [Página oficial de Apktool](https://apktool.org/)
- [Guía de instalación de Apktool](https://apktool.org/docs/install/)

Lo que hace *Apktool* es descomponer el archivo *APK* dejándonos el `AndroidManifest.xml` en un formato completamente legible, extrayéndonos los recursos y *assets*, y convirtiendo el código `.dex` a *smali* (una especie de "ensamblador" del *bytecode* de Dalvik). Es importante entender que *Apktool* no nos va a devolver código Java, sino código *smali*, que es bastante más difícil de leer. Por este motivo, para revisar el código en sí solemos apoyarnos en otras herramientas (que veremos a continuación), y reservamos *Apktool* principalmente para el análisis de los recursos contenidos dentro de la aplicación.

Su uso más básico consiste en ejecutar el siguiente comando para descompilar la aplicación:

```bash
apktool d aplicacion.apk
```

Como se ha mencionado arriba, esta herramienta permite volver a construir la aplicación empaquetándola de nuevo a su formato `.apk`. Esto abre la puerta a técnicas más avanzadas de ingeniería inversa como la inyección de código directamente en los propios archivos de la aplicación, pero eso es algo que dejaremos para otra ocasión.

![Ejecución del comando apktool d para descompilar una aplicación Android](https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-1.avif)

![Estructura de carpetas y ficheros generada por Apktool tras descompilar la APK](https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-2.avif)

### Jadx

*Jadx* es, con total seguridad, la herramienta que más vais a utilizar para leer el código de una aplicación. A diferencia de *Apktool*, *Jadx* descompila el código `.dex` directamente a **Java**, que es un lenguaje muchísimo más cómodo y legible para nosotros. A pesar de tener una versión de línea de comandos, os recomiendo encarecidamente utilizar la versión con interfaz gráfica (*Jadx-gui*), al menos hasta que tengáis la suficiente experiencia. La podéis encontrar en el [repositorio oficial de Jadx en GitHub](https://github.com/skylot/jadx).

Si descargamos la versión de interfaz gráfica y la ejecutamos, veremos una ventana como esta:

![Ventana principal de Jadx-gui recién abierta, sin ninguna aplicación cargada](https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-3.avif)

Aquí podemos abrir el archivo con extensión `.apk` o directamente arrastrar la aplicación sobre la ventana para abrirla, y ya podremos inspeccionar el código:

![Árbol de clases y paquetes de una APK cargada en Jadx-gui](https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-4.avif)

Si seleccionamos un archivo se abrirá una pestaña donde podremos verlo y analizarlo:

![Código Java descompilado de una clase mostrado en una pestaña de Jadx-gui](https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-5.avif)

La gran funcionalidad de esta herramienta es su **buscador**. Podemos buscar cadenas de texto por todo el código, lo cual es oro puro para el análisis estático. Términos como `http`, `password`, `token`, `api_key` o `secret` suelen ser un buen punto de partida para encontrar información sensible rápidamente:

![Buscador de texto de Jadx-gui mostrando coincidencias dentro del código de la aplicación](https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-6.avif)

### MobSF

*MobSF* (*Mobile Security Framework*) es seguramente la herramienta de auditoría de aplicaciones móviles más conocida en el sector. Aunque también tiene la capacidad de realizar análisis dinámicos, su principal uso es el escaneo automático del código de la aplicación, proporcionando una visión general sobre la configuración y el estado en el que se encuentra.

Su funcionamiento es sencillo: levanta un servidor local con una interfaz web donde le proporcionaremos el archivo `.apk` (parecido a como hace *Jadx-gui*). La herramienta lo analizará y generará un reporte completo de manera automática, que además almacenará para poder consultarlo posteriormente sin repetir el análisis. Podéis descargarlo y consultar su documentación a través de los siguientes enlaces:

- [Repositorio oficial de MobSF en GitHub](https://github.com/MobSF/Mobile-Security-Framework-MobSF)
- [Documentación oficial de MobSF](https://mobsf.github.io/docs/#/)

Para su instalación, en primer lugar tendremos que ejecutar el archivo `setup.*` y, una vez se haya completado, lanzar el archivo `run.*` para levantar el servidor web, que quedará accesible en la dirección `http://localhost:8000`.

![Consola mostrando el arranque del servidor web de MobSF en el puerto 8000](https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-7.avif)

El usuario y la contraseña por defecto son en ambos casos `mobsf`:

![Pantalla de inicio de sesión de la interfaz web de MobSF](https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-8.avif)

Una vez aquí, proporcionaremos la aplicación que queremos analizar, seleccionándola a través del botón de subida o arrastrándola sobre la pantalla. Tras una breve espera, el análisis se habrá realizado correctamente:

![Informe de análisis estático generado por MobSF para una aplicación Android](https://cdn.deephacking.tech/i/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/introduccion-al-analisis-estatico-en-aplicaciones-android-9.avif)

A la izquierda de la pantalla observamos un menú desde el que podemos buscar rápidamente la parte del análisis que más nos interese. Los puntos más importantes que hay que revisar son los siguientes:

- Permissions
- Browsable Activities
- Security Analysis
- Reconnaissance

> *MobSF* es una herramienta muy útil porque nos permite, en un instante, visualizar las principales vulnerabilidades existentes en la aplicación junto con sus configuraciones clave, pero también hay que saber por qué este análisis es insuficiente: **en algunas ocasiones genera falsos positivos, no entiende la lógica de negocio de la aplicación y no es del todo preciso cuando trabaja con código ofuscado.** Por estas razones, siempre hay que complementar el análisis del código de la aplicación de manera manual con herramientas como *Jadx* (*MobSF* es terrible para leer código) y conocer el funcionamiento y la lógica de la aplicación para discernir cuáles son las vulnerabilidades reales independientemente de lo que reporte *MobSF*.

### Otras herramientas

He estado dándole vueltas y pensando en qué otras herramientas podría explicar en este artículo. Algunas de ellas son demasiado avanzadas para un primer acercamiento al análisis estático, y otras no aportan un valor diferencial, por lo que voy a hacer una mención a tres herramientas que podéis probar y ver si de verdad creéis que merecen la pena.

Las dos primeras están relacionadas, ya que ambas sirven para lo mismo: echar un primer vistazo a la aplicación sin necesidad de descompilarla y revisarla a mano, escaneando el *APK* en busca de *endpoints*, URLs y secretos (como claves de API o tokens) mediante el uso de expresiones regulares, y nos sirven como punto de partida para orientar el resto del análisis. Estas herramientas son *Apkleaks* y *Apkscan*:

- [Repositorio de Apkleaks en GitHub](https://github.com/dwisiswant0/apkleaks)
- [Repositorio de Apkscan en GitHub](https://github.com/LucasFaudman/apkscan)

La tercera es *APKDeepLens*, una herramienta que es como una versión ligera de *MobSF*, ya que hace un barrido rápido del OWASP Top 10 y muestra un informe con las vulnerabilidades encontradas:

- [Repositorio de APKDeepLens en GitHub](https://github.com/d78ui98/APKDeepLens)

## Conclusión

Con esto ya tenemos una base sólida para comenzar a realizar análisis estático sobre aplicaciones Android. Hemos visto en qué consiste, por qué es una parte fundamental de cualquier auditoría móvil y hemos preparado nuestro arsenal de herramientas indispensables, haciendo una mención especial a *Jadx*. Es fundamental que aprendáis y os familiaricéis con ella, ya que es la herramienta más importante para conocer los entresijos de las aplicaciones.

El análisis estático y el dinámico se complementan a la perfección, y dominar ambos es lo que nos permitirá realizar auditorías completas y de calidad. En próximos artículos seguiremos profundizando en el uso de estas herramientas y comenzaremos a analizar aplicaciones para seguir aprendiendo.

Espero que os haya servido de ayuda para dar vuestros primeros pasos en este tipo de análisis. ¡Contadme qué herramientas utilizáis vosotros!

Gracias por estar al otro lado. ¡Un abrazo! 🙂

## Referencias

- [Página oficial de Apktool](https://apktool.org/)
- [Repositorio oficial de Jadx en GitHub](https://github.com/skylot/jadx)
- [Repositorio oficial de MobSF en GitHub](https://github.com/MobSF/Mobile-Security-Framework-MobSF)
- [Repositorio de Apkleaks en GitHub](https://github.com/dwisiswant0/apkleaks)
- [Repositorio de Apkscan en GitHub](https://github.com/LucasFaudman/apkscan)
- [Fundamentos de las aplicaciones Android (documentación oficial)](https://developer.android.com/guide/components/fundamentals)
