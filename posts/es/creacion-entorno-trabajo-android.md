---
id: "creacion-entorno-trabajo-android"
title: "Creación de un entorno de trabajo en Android"
author: "pablo-castillo"
publishedDate: 2022-12-12
updatedDate: 2022-12-12
image: "https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-0.webp"
description: "Guía completa para crear un entorno de trabajo virtualizado en Android: instalación de Android Studio, configuración de emuladores, uso de ADB y herramientas esenciales para auditorías móviles."
categories:
- "mobile-pentesting"
draft: false
featured: false
lang: "es"
---

El objetivo de este post es aprender a crear un entorno de trabajo virtualizado con el que poder comenzar a realizar auditorías a aplicaciones Android. Comenzaremos seleccionando nuestro emulador de dispositivos para posteriormente mostrar las distintas opciones de creación de smartphones y finalizar con la descarga de alguna herramienta necesaria para nuestro trabajo.

- [Android Studio como emulador del entorno](#android-studio-como-emulador-del-entorno)
- [Instalación y primeros pasos con Android Studio](#instalación-y-primeros-pasos-con-android-studio)
- [Instalación y ejecución de Android Debug Bridge (ADB)](#instalación-y-ejecución-de-android-debug-bridge-adb)
- [Referencias](#referencias)

## Android Studio como emulador del entorno

Existen muchos emuladores de Android gratuitos que podemos emplear para nuestro entorno de pruebas, pero bien es cierto que algunos de ellos destacan por encima de los demás. Después de trabajar con varios de ellos, personalmente Android Studio es el que más me gusta (básicamente, porque es el que menos problemas me ha dado a la hora de realizar auditorías). Reconozco que consume más recursos que otros emuladores y puede ser más lento, pero tiene muchas más utilidades y es más robusto. Podéis descargar Android Studio a través del siguiente enlace:

- [Descargar Android Studio oficial](https://developer.android.com/studio)

De igual manera, a continuación os dejo los enlaces de descarga de otros emuladores Android muy empleados por la comunidad para que los probéis y elijáis el que más os guste, ya que no todos tenemos los mismos gustos ni el mismo criterio:

- **Genymotion:**
    - [Descargar Genymotion para Android](https://www.genymotion.com/download/)
- **BlueStacks:**
    - [Descargar BlueStacks emulador Android](https://www.bluestacks.com/es/index.html)
- **Visual Studio:**
    - [Descargar Visual Studio Emulator para Android](https://visualstudio.microsoft.com/es/vs/msft-android-emulator/)

## Instalación y primeros pasos con Android Studio

Para la instalación de nuestro emulador, mi recomendación es que se instale en el sistema operativo principal de nuestro ordenador, en mi caso Windows. También podéis instalarlo en una máquina virtual con Kali u otra distribución enfocada al pentesting, pero la emulación de un dispositivo Android va a requerir de mucha memoria y es posible que tengáis problemas para el procesamiento del entorno.

Entonces, lo primero de todo es descargar [Android Studio](https://developer.android.com/studio), ejecutar el instalador y seguir los pasos que van apareciendo durante el proceso, lo dejamos todo por defecto.

Una vez lo tengamos instalado, lo iniciaremos y veremos una ventana como la que aparece a continuación:

![Pantalla inicial de Android Studio](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-1.avif)

Pincharemos sobre el desplegable _More Actions_ y posteriormente seleccionaremos la opción _Virtual Device Manager_ para crear nuestro dispositivo Android:

![Opción Virtual Device Manager](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-2.avif)

> IMPORTANTE: Es posible que dicha opción en un principio se encuentre bloqueada y no podamos seleccionarla. En tal caso, lo que haremos será seleccionar la opción _SDK Manager_ que se encuentra justo encima:

![Menú SDK Manager](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-3.avif)

En dicho menú tenemos que asegurarnos de dos cosas:

- La primera de ellas, que la ruta _Android SDK Location_ no aparezca en rojo por no reconocer la ruta predefinida por defecto, que en tal caso tendríamos que elegir una ruta nosotros que sea válida.

- La segunda, que en la pestaña SDK Tools tengamos instalado el paquete _Android SDK Build-Tools 33_. En caso de no tenerlo instalado, pincharemos sobre el cuadrado que aparece a la izquierda del nombre y le daremos a _OK_ para que se descargue e instale automáticamente:

![SDK Tools con Android SDK Build-Tools](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-4.avif)

Ya que me encuentro en este menú, aprovecho para indicar que en el apartado _SDK Platforms_ podemos descargar las distintas versiones de Android que emplearemos en los dispositivos que creemos posteriormente. También se pueden descargar desde el menú de creación de estos, así que no es necesario venir a esta ventana para ello, pero está bien saber las distintas opciones disponibles para realizar las mismas tareas. Os recomiendo echarle un vistazo y que investiguéis las posibles descargas:

![SDK Platforms disponibles](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-5.avif)

Ahora sí, vamos a proceder a la creación del dispositivo en el nuevo menú que se ha abierto tras seleccionar la opción de _Virtual Device Manager_.

![Menú Virtual Device Manager vacío](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-6.avif)

Esta nueva ventana se encuentra vacía, así que pincharemos sobre _Create Virtual Device_ que se encuentra en el centro de la misma o en la pestaña _Create device_ situada en la esquina superior izquierda:

![Selección de hardware para dispositivo virtual](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-7.avif)

En la nueva ventana emergente, aparecen distintas opciones de creación de Hardware, donde podremos elegir distintos dispositivos electrónicos. Esto es principalmente para que los desarrolladores puedan ejecutar y realizar pruebas sobre sus aplicaciones en los distintos dispositivos que son capaces de abrirlas.

A nosotros nos interesa la pestaña _Phone_, que es desde donde podremos seleccionar entre una serie marcas disponibles y ver las respectivas características de los distintos móviles, en base a esto, elegiremos cuál emular. No es necesario elegir un último modelo porque posteriormente puede haber problemas al ejecutar según qué versión de Android, ni tampoco un modelo muy antiguo por el motivo inverso. Personalmente, suelo elegir entre los modelos _Nexus 5, Pixel 4_ y _Pixel 5_. Es importante señalar que en una de las columnas se puede ver qué dispositivos incluyen la _Play Store_ para la descarga de aplicaciones, función que puede ser necesaria para la obtención de la aplicación a auditar posteriormente:

![Opciones de teléfonos disponibles](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-8.avif)

Al clickar en _Next_ encontraremos el menú en el que elegiremos la versión de Android que vamos a instalar en nuestro smartphone. Encontramos tres pestañas distintas en las que nos indican las imágenes recomendadas, las que son x86 y otras imágenes. No os recomiendo que instaléis la última versión de Android, ni tampoco una versión que tenga muchos años, ya que ambos casos pueden generar problemas a la hora de abrir o ejecutar aplicaciones. Yo normalmente instalo aquellas versiones que se encuentran entre la 7 y la 10, salvo algún caso puntual en el que ha sido necesaria una versión en específico.

Como mencioné anteriormente, en este panel será posible descargar la imagen que queramos instalar pulsando la flecha que aparece a la derecha del nombre de la versión. He escogido un _Android 8.0 (Google APIS)_ compatible con los servicios de _Google Play_ y con una arquitectura _x86\_64_ compatible tanto para versiones de 32 o 64 bits_:_

![Selección de imagen del sistema Android](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-9.avif)

Una vez seleccionado, encontraremos un cuadro final donde podremos realizar algunas modificaciones en la configuración, pero en principio lo único que deberíamos tocar es el nombre en caso de querer identificarlo de alguna manera. Una vez hecho esto, finalizamos:

![Configuración final del dispositivo virtual](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-10.avif)

Ahora, en la ventana que antes encontrábamos vacía, nos aparecerá el dispositivo con la información sobre la versión de Android y la arquitectura empleada. Para ejecutar el emulador, pincharemos sobre la flecha de _Play_ que aparece debajo de la columna _Actions:_

![Dispositivo virtual creado en la lista](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-11.avif)

![Emulador Android en ejecución](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-12.avif)

Una vez hecho esto, ya tenemos nuestro dispositivo funcionando y preparado para instalar y ejecutar cualquier aplicación Android compatible con su versión y arquitectura.

## Instalación y ejecución de Android Debug Bridge (ADB)

_Android Debug Bridge_ es una herramienta de línea de comandos que nos servirá para poder comunicarnos con el dispositivo móvil y ejecutar múltiples instrucciones para realizar distintas acciones, como acceder al interior del dispositivo, copiar o eliminar información, instalar o desinstalar aplicaciones…

Al descargar Android Studio, dicha herramienta también se incluye dentro de la carpeta _SDK Tools_ que mencionamos anteriormente bajo el nombre de _platform-tools_. En cualquier caso, si no la encontráis la podéis obtener en el siguiente enlace para su descarga:

- [Descargar Android SDK Platform Tools oficial](https://developer.android.com/studio/releases/platform-tools)

Una vez localizada u obtenida, accederemos a dicha carpeta y abriremos una _cmd_ y ejecutaremos **adb.exe** para iniciar la herramienta. Una vez hecho esto, dentro de la misma consola, estos son algunos de los comandos principales que podemos emplear:

- **adb devices:** Lista los emuladores que actualmente se encuentran en el sistema.
- **adb root/unroot:** Reinicia el cliente con permisos/sin permisos de root (Es importante destacar que para la realización de la mayoría de acciones es necesario que seamos root).
- **adb push/pull \[path\_to\_file\]:** Envía un archivo desde el ordenador al dispositivo móvil/del dispositivo móvil al ordenador.
- **adb install/uninstall \[path\_to\_apk\]**: Instala/desinstala una aplicación.
- **adb shell:** Permite acceder al dispositivo por consola (recordar que Android es un sistema Linux, por lo que los comandos serán los mismos que empleamos en nuestra Kali).
- **adb reboot**: Fuerza un reinicio del dispositivo.

![Comandos de ADB en la consola](https://cdn.deephacking.tech/i/posts/creacion-entorno-trabajo-android/creacion-entorno-trabajo-android-13.avif)

Ya tenemos el escenario principal para poder comenzar a realizar pentesting en aplicaciones Android. Próximamente, continuaremos con una serie de artículos donde veremos como hacer una auditoría completa a una aplicación Android.

## Referencias

- [Android Debug Bridge (adb)](https://developer.android.com/studio/command-line/adb?hl=es-419)
