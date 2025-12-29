---
id: "magisk-en-dispositivos-emulados-con-android-studio"
title: "Cómo instalar Magisk en dispositivos emulados con Android Studio"
author: "pablo-castillo"
publishedDate: 2024-12-17
updatedDate: 2024-12-17
image: "https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-0.webp"
description: "Aprende a instalar Magisk en dispositivos emulados de Android Studio para crear un entorno de pentesting móvil completo con root, certificados de Burp Suite y Frida mediante módulos de Magisk."
categories:
  - "mobile-pentesting"
draft: false
featured: false
lang: "es"
---

En el primer post sobre auditorías móviles explicamos la creación y configuración de un entorno de pruebas de pentesting utilizando el software Android Studio. Bien es cierto que es posible crear dispositivos emulados que ya se encuentren rooteados, pero como ya sabréis los que habéis trabajado con ellos, en muchas ocasiones presentan una serie de problemas o incomodidades que hacen que la configuración del dispositivo y el trabajo con el mismo se pueda complicar.

Si habéis echado un ojo a mi último post sobre la [configuración de dispositivos físicos usando Magisk](https://blog.deephacking.tech/es/posts/configuracion-dispositivo-fisico-pentesting-android/) habréis visto lo cómodo y manejable que resulta tener nuestro Android dispuesto con esa estructura para trabajar. Por ello, en esta ocasión vamos a fusionar ambas partes para obtener un emulador de Android para la realización de pruebas de pentesting con la comodidad que nos aporta Magisk.

- [Sobre Android Studio](#sobre-android-studio)
- [Creación y configuración del dispositivo emulado](#creación-y-configuración-del-dispositivo-emulado)
- [Antes de comenzar: Añadir al Path la herramienta adb](#antes-de-comenzar-añadir-al-path-la-herramienta-adb)
- [Herramienta para la instalación de Magisk: rootAVD](#herramienta-para-la-instalación-de-magisk-rootavd)
- [Instalación del certificado de Burp Suite a través de Magisk](#instalación-del-certificado-de-burp-suite-a-través-de-magisk)
- [Frida a través de Magisk](#frida-a-través-de-magisk)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

## Sobre Android Studio

Me imagino que si estás aquí es porque ya tienes instalado y configurado el software Android Studio en tu ordenador, pero en caso contrario [puedes encontrar la explicación al completo aquí](https://blog.deephacking.tech/es/posts/creacion-entorno-trabajo-android/). Si ya lo tienes instalado, te voy a recomendar que lo actualices a la última versión de la siguiente manera:

- Abrir Android Studio → Ruleta de ajustes en la parte inferior izquierda → _Check for updates_

![Menú de configuración de Android Studio](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-1.avif)

Necesitaremos conocer la ruta en la que tenemos instalado _Android SDK_ (kit de desarrollo de software), un conjunto de herramientas empleadas por el programa. Para ello:

- Android Studio → More actions → SDK Manager → Android SDK Location

![Menú More actions en Android Studio](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-2.avif)

![Ubicación del Android SDK](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-3.avif)

OJO!! En caso de que no hayas instalado todavía Android Studio, habrá un momento en el que nos pregunte en qué ruta queremos instalar _Android SDK_. Por defecto, la ruta es _C:\\Users\\<TU USUARIO>\\AppData\\Local\\Android\\Sdk_. Salvo que tengas una necesidad excelsa de instalarlo en otra ruta, mantén la que se establece por defecto, ya que más adelante emplearemos una herramienta que busca por defecto en esa ruta definida.

## Creación y configuración del dispositivo emulado

Bien, si habéis pinchado en el enlace que os puse arriba hablando de la creación del entorno en Android Studio, habréis recordado el procedimiento para la creación de un dispositivo emulado (si no lo habéis hecho, [este es otro buen momento para hacerlo](https://blog.deephacking.tech/es/posts/creacion-entorno-trabajo-android/)). Haciendo un breve resumen, los pasos a seguir son los siguientes:

- _Android Studio → More actions → Virtual Device Manager → Create Device_

Para este post he elegido un dispositivo Pixel 7 con la versión Android 11.0 (API 30) **que contenga Google Play.** Recordaros que con esta configuración, el entorno será similar a uno de producción, por lo que el dispositivo por defecto no se encuentra rooteado (cosa que tiene sentido si lo que queremos es emplear _Magisk_ para conseguir ese root:

![Selección de hardware del dispositivo virtual](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-4.avif)

![Selección de imagen del sistema Android](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-5.avif)

Como recomendación personal, nunca utilicéis las últimas versiones de Android para vuestros emuladores ya que algunas herramientas o aplicaciones pueden dar errores o directamente no funcionar debido al corto periodo de adaptación que han podido tener.

En esta ocasión también vamos a instalar la aplicación _Root Checker_ para verificar y validar que actualmente el dispositivo no se encuentra rooteado pero que posteriormente lo estará:

- [Root Checker - APKPURE](https://apkpure.com/es/root-checker/com.joeykrim.rootcheck)

Instalamos la aplicación arrastrándola encima del emulador o bien ejecutando el comando _adb install <Nombre de la aplicación>:_

<div class="grid grid-cols-2 gap-4">
<div>

![Instalación de Root Checker mediante adb](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-6.avif)

</div>
<div>

![Root Checker indica que no hay acceso root](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-7.avif)

</div>
</div>

Si hacemos memoria, para poder instalar _Magisk_ en nuestro dispositivo físico y conseguir ser superusuario teníamos que habilitar las opciones de desarrollador para desbloquear la depuración por USB así como desbloquear el OEM. ¿Se podrá replicar el procedimiento empleado en ese escenario para un dispositivo emulado? Vamos a comprobarlo y salimos de dudas.

- _Settings→ About emulated device →_ Pulsar 7 veces en _Build number_

![Activación del modo desarrollador](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-8.avif)

- _Settings → System → Developer options_

![Menú de opciones de desarrollador](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-9.avif)

Por si alguno se lo había preguntado, efectivamente la depuración por USB en los dispositivos emulados viene habilitada por defecto, y es por ello por lo que se pueden utilizar herramientas como _adb_ desde la creación del mismo sin tener que habilitar estas opciones:

![Depuración USB habilitada por defecto](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-10.avif)

Sin embargo, por mucho que busquemos la opción para deshabilitar el desbloqueo del OEM ya os adelanto que no la vais a encontrar. En los dispositivos emulados esta opción no existe y tiene todo el sentido del mundo: dicha opción permite, entre otras cosas, la modificación del sistema operativo de Android, pero en Android Studio si no te gusta el dispositivo que has emulado pues creas otro. No existe el modo _Recovery_, por lo que no hay _bootloader_ que desbloquear. De hecho podéis comprobar vosotros mismos que si ejecutais el comando _adb reboot bootloader_ no ocurre nada.

Pero no os preocupéis, tenemos una manera bastante mas rápida y sencilla de rootear el dispositivo con Magisk que la que se emplea en los móviles físicos.

## Antes de comenzar: Añadir al Path la herramienta adb

Quizá ya lo tengáis correctamente configurado pero por si acaso vamos a explicar cómo añadir la herramienta _adb_ al path de Windows para poder ejecutarla desde cualquier directorio, lo cual será necesario para la realización del procedimiento sin contratiempos.

Para ello, haremos lo siguiente:

- Sistema → Configuración avanzada del sistema → Variables de entorno

![Configuración avanzada del sistema en Windows](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-11.avif)

- Variables del sistema → Path → Editar

![Edición de variables de entorno](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-12.avif)

- Nuevo → Añadir la ruta de la carpeta donde tengamos _adb_ (_platform-tools_)

![Añadiendo ruta de platform-tools al PATH](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-13.avif)

**RECUERDA:** Al descargar Android Studio e instalar las _SDK Tools,_ la carpeta de _platform-tools_ con _adb_ se encuentra por defecto en el directorio:

- _C:\\Users\\<Tu Usuario>\\AppData\\Local\\Android\\Sdk\\platform-tools_

## Herramienta para la instalación de Magisk: rootAVD

La descripción de la herramienta rootAVD dice literalmente ser _un script para rootear AVDs ejecutándose con el emulador QEMU desde Android Studio_. Usando mis palabras, es una herramienta que rootea un dispositivo emulado basado en QEMU (emulador de procesadores basado en la traducción dinámica de binarios) desde el software Android Studio. Podéis encontrar la herramienta en Github, pero en dicho repositorio dicen que donde se encuentra actualizada es en GitLab, así que os dejo ambos enlaces pero utilizar este último:

- [rootAVD - GitHub](https://github.com/newbit1/rootAVD)
- [rootAVD - GitLab](https://gitlab.com/newbit/rootAVD)

Para descargarla tenemos dos opciones: podemos ejecutar el comando _git clone_ junto con el enlace del repositorio desde Powershell si tenemos instalado en nuestro ordenador Git ([Descargar Git para Windows](https://git-scm.com/downloads)) o si lo quisiéramos descargar en una máquina Linux (aunque ya sabéis que para las auditorías móviles trabajamos en Windows). También podéis descargarlo desde el repositorio de GitLab desde la pestaña _Code_ en formato zip como podéis ver a continuación:

![Descarga de rootAVD desde GitLab](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-14.avif)

Una vez descargado (y descomprimido si hubiese sido necesario) podemos acceder a la carpeta de la herramienta. Si nos fijamos, dentro de esta encontramos la herramienta _Magisk_ comprimida en formato zip preparada para su instalación en el sistema del emulador, pero si prestamos atención a la versión comprobamos que la que se encuentra lista para instalar es la v26.4. Sin embargo, la última versión disponible en su repositorio oficial es la v.28.0 (a fecha de la redacción de este post). Esto se debe, por lo que he podido leer y deducir (ya que no lo especifican en el propio repositorio) a que van incorporando las versiones en función de los parches y de la estabilidad que obtienen durante su desarrollo. No olvidemos que trabajar en entornos virtualizados no es lo mismo que hacerlo en dispositivos físicos. Igualmente, durante el proceso de instalación tendremos la opción de instalar la versión v.27 (que es la última versión estable oficial) en lugar de la que es considerada la versión estable local.

Una vez aclarado esto, tenemos todo listo para poder ejecutar la herramienta. Si revisamos el repositorio, podemos observar los pasos a seguir en el proceso, incluso varios pequeños videos de su ejecución en distintos sistemas operativos. Os dejo el de Windows para que lo tengáis a mano:

- [rootAVD_Windows.gif](https://gitlab.com/newbit/video-files/-/blob/master/rootAVD_Windows.gif)

Antes de lanzar la herramienta, vamos a ejecutar desde la consola el siguiente comando para configurar las variables de entorno para su funcionamiento:

```batch
set PATH=%LOCALAPPDATA%\Android\Sdk\platform-tools;%PATH% system-images\android-$API\google_apis_playstore\x86_64\
```

Una vez hecho esto ya podemos ejecutar la herramienta siguiendo los siguientes pasos:

1\. Desde la carpeta rootAVD ejecutamos rootAVD.bat:

![Ejecución de rootAVD.bat](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-15.avif)

2\. Listamos todas las máquinas virtuales con el parámetro _ListAllAVDs_:

![Lista de AVDs disponibles](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-16.avif)

3\. Seleccionamos el emulador que estamos utilizando, la cual se puede diferenciar por la versión de la API (30 para Android 11.0) y la imagen utilizada (x86):

![Selección del AVD a rootear](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-17.avif)

4\. Ahora hay que estar atentos porque durante el proceso habrá una interrupción en la que tendremos que elegir la versión que queremos intalar. Por defecto si no tocamos nada, se instalará la versión que aparece descargada en la carpeta, pero a nosotros nos interesa instalar la versión estable más reciente, que como hemos dicho anteriormente es la v.27.0. Por tanto, escribiremos un 2 y le daremos al Enter en este punto:

![Selección de versión de Magisk](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-18.avif)

Tras esto dejaremos que el proceso termine automáticamente, lo que hará que el dispositivo emulado se cierre automáticamente, así que no os preocupeis que es lo normal. Una vez hecho esto iniciaremos el dispositivo en modo _Cold Boot_, que reiniciará nuestro Android al completo:

![Finalización del proceso de instalación](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-19.avif)

![Inicio en modo Cold Boot](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-20.avif)

Una vez tengamos el emulador operativo y accedamos a la aplicación de _Magisk_, esta nos pedirá que necesita hacer una configuración adicional y volver a reiniciar:

![Configuración adicional de Magisk](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-21.avif)

En este momento tenemos la aplicación instalada de manera correcta y el dispositivo se encuentra rooteado:

![Magisk instalado correctamente](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-22.avif)

Para comprobarlo, abriremos nuestra cmd para abrir una shell en el dispositivo empleando _adb shell_ para posteriormente ejecutar el comando _su_. Nos aparecerá una ventana en el dispositivo con la cual tendremos que otorgarle permisos de superusuario a la consola como se muestra a continuación:

![Concesión de permisos de superusuario](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-23.avif)

Podremos comprobar dónde otorgamos permisos de superusuario en la pestaña _Superuser_ de la aplicación _Magisk_:

![Lista de aplicaciones con permisos de superusuario](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-24.avif)

En este momento, si volvemos a ejecutar la aplicación _Root Checker_ nos volverá a aparecer el cuadro para otorgar el permiso en esta aplicación y nos indicará que somos root:

<div class="grid grid-cols-2 gap-4">
<div>

![Root Checker solicitando permisos de superusuario](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-25.avif)

</div>
<div>

![Root Checker confirmando acceso root](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-26.avif)

</div>
</div>

IMPORTANTE: Una gran ventaja del uso de _Magisk_ es que podemos retirar los derechos de superusuario en cualquier momento de cualquier aplicación a la que se lo hayamos otorgado previamente. Esto nos permitiría ejecutar aplicaciones que tengan detección de estos permisos. Como ejemplo, a continuación se muestra como podemos revertir la detección de root de la aplicación anterior:

<div class="grid grid-cols-2 gap-4">
<div>

![Revocación de permisos de superusuario](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-27.avif)

</div>
<div>

![Root Checker sin acceso root](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-28.avif)

</div>
</div>

## Instalación del certificado de Burp Suite a través de Magisk

A pesar de que este proceso ya lo hayamos visto en anteriores ocasiones, creo que este post merece repasar la explicación (es necesario que tengamos instalado _Burp Suite_). Abrimos este software con el emulador Android funcionando como lo habíamos dejado anteriormente. Configuramos ambas partes para tunelizar el tráfico de la siguiente manera:

- Burp Suite:
    - Proxy → Proxy Settings → Add → Añadimos la IP de nuestra máquina Windows

![Configuración del proxy en Burp Suite](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-29.avif)

- Emulador Android:
    - Settings → Network & interfaces → Wifi → Network Details → Edit → Proxy → Manual → Añadir la misma IP y puerto que en _Burp Suite_

![Configuración del proxy en Android](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-30.avif)

En función del modelo de dispositivo que hayáis emulado quizá los pasos anteriores varíen un poco, pero la esencia es la misma. Es importante que deshabilitéis los datos y solo funcione el wifi en el emulador para que esto que estamos haciendo tenga sentido.

Si todo ha ido bien y la configuración es correcta, no vais a poder navegar por Internet desde el buscador del emulador:

![Error de conexión tras configurar proxy](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-31.avif)

Donde si podremos acceder será a la ruta [http://burpsuite](http://burpsuite/) desde donde descargaremos e instalaremos su certificado CA modificando la extensión bajo el nombre _cacert.cer._ Es posible que el certificado tengas que instalarlo desde _Settings_ si no te deja hacerlo automáticamente:

![Descarga e instalación del certificado CA](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-32.avif)

Una vez tenemos el certificado instalado, vamos a descargar el módulo de _Magisk_ que nos permite mover el certificado que acabamos de descargar al sistema para que se pueda interceptar el tráfico http. Para ello tendremos que descargarlo en Windows y mover el archivo a nuestro Android ya que el proxy del emulador no nos permite el tráfico por Internet (o bién deshabilitar el proxy, descargarlo y volverlo a habilitar, per es más follón).

- [burpcert-magisk-module](https://github.com/belane/burpcert-magisk-module)

Teniendo en Android el archivo, accederemos a la aplicación _Magisk_ y en la pestaña _Módulos_ seleccionaremos la opción _Instalar desde almacenamiento,_ y elegiremos el archivo zip del módulo que se encontrará en la carpeta de _Downloads_:

<div class="grid grid-cols-2 gap-4">
<div>

![Instalación de módulo desde almacenamiento](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-33.avif)

</div>
<div>

![Selección del módulo burpcert](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-34.avif)

</div>
</div>

Nos pedirá un reinicio del dispositivo tras el cual el proceso se habrá realizado con éxito. Podemos comprobarlo revisando los certificados de confianza del sistema:

<div class="grid grid-cols-2 gap-4">
<div>

![Acceso a certificados del sistema](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-35.avif)

</div>
<div>

![Certificado de Burp Suite en el sistema](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-36.avif)

</div>
</div>

Ahora podemos navegar y comprobar que nuestro tráfico está pasando por _Burp Suite_:

![Interceptación de tráfico en Burp Suite](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-37.avif)

## Frida a través de Magisk

Seguramente después de haber visto el módulo de _Magisk_ para la instalación del certificado de _Burp Suite_ muchos os habréis preguntado si esta herramienta también tiene un módulo relacionado con frida. En efecto, lo tiene. Si habéis investigado un poco sobre _Magisk_ quizá hayáis encontrado varias webs oficiales en las que te hablan de los módulos que podéis encontrar. Algunos ejemplos son:

- [Magisk Modules - www.magiskmodule.com](https://www.magiskmodule.com/category/magisk-modules/)
- [Magisk Modules - magiskmodule.gitlab.io](https://magiskmodule.gitlab.io/)

Recordaros que si no habéis instalado _Frida_ todavía o tenéis alguna duda al respecto, podéis encontrar toda la información necesaria en nuestro [tutorial completo sobre evasión de SSL Pinning en aplicaciones Android](https://blog.deephacking.tech/es/posts/evasion-ssl-pinning-android/).

Para verificar que efectivamente hay algunas peticiones http que no podemos interceptar debido al _ssl pinning_, vamos a descargar e instalar una aplicación diseñada para la realización de pruebas llamada _AndroGoat_:

- [AndroGoat.apk](https://github.com/satishpatnayak/MyTest/blob/master/AndroGoat.apk)

Una vez instalada, la abriremos y pincharemos en la primera opción llamada _Network Intercepting_:

![Aplicación AndroGoat](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-38.avif)

En este apartado encontramos 3 botones. Con _Burp Suite_ abierto y con la configuración del proxy realizada previamente vamos a pinchar en el botón https para verificar que funciona correctamente:

![Interceptación HTTPS funcionando correctamente](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-39.avif)

Sin embargo, al pinchar en el botón de _Certificate Pinning_ no ocurre nada, como era de esperar:

![Certificate Pinning bloqueando la interceptación](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-40.avif)

Una vez realizada esta comprobación, vamos a instalar el módulo de _Frida_ que va a permitirnos poder utilizar la herramienta para evadir el _ssl pinning_. Este módulo lo que hará será instalar y ejecutar el _frida-server_ dentro del emulador Android. Este se encuentra en el siguiente enlace:

- [magisk-frida](https://github.com/ViRb3/magisk-frida)

Para garantizar su funcionamiento, tenemos que asegurarnos que la versión de _Frida_ instalada en nuestro ordenador sea la misma que la versión del módulo que vamos a instalar en el dispositivo. Como la versión que estamos descargando es la última, lo que haremos será actualizar el _Frida_ desde la consola con el siguiente comando:

```bash
pip3 install --upgrade frida
```

![Actualización de Frida](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-41.avif)

En caso de que os salga algún error, actualizar las _frida-tools_ mediante _pip install frida-tools_ o seleccionando las versiones que queréis instalar a mano de la siguiente manera:

```bash
pip install frida==16.5.9 frida-tools==13.6.0
```

Una vez tenemos todo en sintonía, procedemos a la instalación del módulo de la misma manera que lo hicimos con el anterior. Desde la pestaña _módulos_ de _Magisk_ escogemos el archivo zip que hemos introducido en el dispositivo previamente:

![Instalación del módulo de Frida](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-42.avif)

Para comprobar que todo ha funcionado correctamente, desde nuestra consola podemos abrir una terminal en el emulador con un _adb shell_ y siendo _root_ ejecutar el comando _netstat -tupln_ donde podremos visualizar rápidamente que hay un proceso de _frida-server_ corriendo en el puerto 27042:

![Frida-server ejecutándose en el dispositivo](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-43.avif)

Sabiendo que el _frida-server_ está funcionando, ya podemos ejecutar _Frida_ para poder hacerle el bypass al _ssl pinning_. Volvemos a abrir _AndroGoat_ para que _Frida y Objection_ la encuentren y vamos a ejecutar los siguientes comandos:

1. _**Frida-ps -Uai**_ → Listamos las aplicaciones en ejecución del emulador.
2. _**Objection -g <PID> explore**_ → Ejecutamos Objection indicándole el PID de la aplicación para operar con ella (también se puede hacer con el nombre pero este tiene muchos espacios y guiones y puede dar error).
3. _**Android ssl pinning disabled**_ → Comando para hacer el bypass al _ssl pinning_.

![Ejecución de Objection para bypass de SSL Pinning](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-44.avif)

Ahora que tenemos todo listo volvemos a pulsar el botón de _Certificate Pinning_ de la aplicación e interceptamos la petición perfectamente:

![Interceptación exitosa tras bypass de SSL Pinning](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-45.avif)

Además podemos corroborar dicho bypass desde _Objection_ ya que en la consola aparecen las llamadas a las funciones que se han manipulado para poder interceptar el tráfico:

![Logs de Objection mostrando el bypass](https://cdn.deephacking.tech/i/posts/magisk-en-dispositivos-emulados-con-android-studio/magisk-en-dispositivos-emulados-con-android-studio-46.avif)

## Conclusión

Siendo sincero, esta nueva configuración del entorno virtualizado utilizando _Magisk_ y sus módulos es mucho más cómoda y fácil de configurar que la manera estándar que habíamos visto previamente en otros posts. Os recomiendo encarecidamente que lo probéis, aunque pueda parecer largo es un proceso súper rápido y que no da errores de ningún tipo.

Espero que os haya gustado y que os sirva para poder trabajar cómodamente si no disponéis de un dispositivo físico. ¿Os gusta Magisk? ¿Lo habíais utilizado ya? Contarme vuestra experiencia, os leo abajo!

Gracias por estar al otro lado! Un abrazo! 🙂

## Referencias

- [Magisk Module Repository](https://www.magiskmodule.com/)
- [Repositorio oficial de Magisk en GitHub](https://github.com/topjohnwu/Magisk)
- [Frida Codeshare - Scripts de la comunidad](https://codeshare.frida.re/)
