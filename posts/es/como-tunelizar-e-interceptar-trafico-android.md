---
id: "tunelizar-e-interceptar-trafico-android"
title: "Cómo tunelizar e interceptar el tráfico de un dispositivo Android"
author: "pablo-castillo"
publishedDate: 2023-02-27
updatedDate: 2023-02-27
image: "https://cdn.deephacking.tech/i/posts/tunelizar-e-interceptar-trafico-android/tunelizar-e-interceptar-trafico-android-0.webp"
description: "Aprende a configurar Burp Suite para interceptar el tráfico de red de un dispositivo Android instalando certificados en el sistema y configurando el proxy HTTP."
categories:
  - "mobile-pentesting"
draft: false
featured: false
lang: "es"
---

El objetivo de este post es aprender a configurar nuestro entorno para poder interceptar el tráfico de red generado por el dispositivo Android y poder analizarlo y modificarlo. Para ello necesitaremos emplear un servidor proxy HTTP que sirva de intermediario entre el smartphone y un servidor web. En nuestro caso vamos a emplear uno de los software más conocidos en el sector del pentesting: _Burp Suite_.

- [Burp Suite y Certificados en Android](#burp-suite-y-certificados-en-android)
- [Instalación del certificado en el sistema](#instalación-del-certificado-en-el-sistema)
- [Configuración del proxy Android - Burp Suite](#configuración-del-proxy-android---burp-suite)
- [Posibles errores al configurar las particiones Android en modo escritura](#posibles-errores-al-configurar-las-particiones-android-en-modo-escritura)
- [Referencias](#referencias)

## Burp Suite y Certificados en Android

Creo que no necesita presentación, pero por si acaso, _Burp Suite_ es una herramienta empleada para las pruebas de seguridad de las aplicaciones web. Intercepta las peticiones HTTP realizadas por un servidor web o aplicación para poder analizarlas, modificarlas, aceptarlas, rechazarlas y tantas otras opciones.

Existen dos versiones de este software: _Burp Suite Community Edition_ (versión gratuita) y _Burp Suite Professional_ (versión de pago). Aunque la versión de pago sea muchísimo mejor y más completa que la gratuita, con esta última podremos trabajar perfectamente en cualquier escenario. Eso sí, la herramienta funcionará más lenta y no podremos utilizar los muchos complementos de la de pago. Podéis descargarlas a través de los siguientes enlaces:

- [Descargar Burp Suite Community Edition gratuita](https://portswigger.net/burp/communitydownload)
- [Descargar Burp Suite Professional](https://portswigger.net/burp/pro)

Si ya habéis empleado este software anteriormente sabréis que es necesario instalar un certificado de confianza para que el navegador no genere errores al trabajar bajo el protocolo HTTPS. Pues bien, para interceptar el tráfico de nuestro dispositivo Android también tendremos que instalar dicho certificado (como era de esperar).

En todos los dispositivos existen dos tipos de almacenes de credenciales o _Credenciales de Confianza_ (_Trusted Credentials_) los cuales son: Sistema y Usuario. En estos dos paneles se almacenan los certificados en los que el móvil confía. Para acceder a dichos paneles, dentro del dispositivo entraremos en:

- _Ajustes → Contraseñas y seguridad → Cifrado y credenciales → Credenciales de confianza_

![Configuración de credenciales de confianza en Android](https://cdn.deephacking.tech/i/posts/tunelizar-e-interceptar-trafico-android/tunelizar-e-interceptar-trafico-android-1.avif)

Si un usuario instala un certificado, este se almacena en la parte de Credenciales de Usuario. Anteriormente, una persona importaba el certificado generado por _Burp Suite_ y lo instalaba en su Android y ya podía interceptar el tráfico sin ningún tipo de problema. Sin embargo, a partir de la versión Android 7 (_Nougat_) se cambió la forma en la que Android confía en los certificados, y solo lo hace en aquellos instalados en el Sistema (salvo que haya una configuración especial en el certificado del usuario). Es por ello por lo que vamos a ver cómo podemos instalar el certificado generado por nuestro servidor proxy en el lugar que corresponde para su correcto uso.

## Instalación del certificado en el sistema

Para comenzar con el proceso, tendremos que haber iniciado nuestro dispositivo Android con _Android Studio_ junto con _Burp Suite_. Si no sabes a qué me refiero puedes revisar mi anterior artículo:

- [Creación de un entorno de trabajo – Pentesting Android](https://blog.deephacking.tech/es/posts/creacion-entorno-trabajo-android/)

Cuando tengamos iniciado el dispositivo, el siguiente paso será, dentro del servidor proxy, acceder a las pestañas:

- _Proxy → Proxy Settings → Import/Export CA Certificate → Certificate in DER format_

![Exportar certificado en Burp Suite](https://cdn.deephacking.tech/i/posts/tunelizar-e-interceptar-trafico-android/tunelizar-e-interceptar-trafico-android-2.avif)

Guardaremos este certificado bajo el nombre de _cacert.der_ en la misma carpeta de _platform-tools_ (por comodidad, para tenerlo todo en la misma carpeta). Los certificados que se encuentran en el sistema del dispositivo tienen la nomenclatura _subject\_hash\_old.0_ por lo que habrá que modificarlo empleando el software _OpenSSL_ que lo podéis encontrar en el siguiente enlace:

- [Descargar OpenSSL para Windows](https://slproweb.com/products/Win32OpenSSL.html)

Este programa tiene un paquete de herramientas con funciones y algoritmos para crear sistemas criptográficos y certificados digitales. Una vez realizada la instalación, los pasos a seguir serán los siguientes:

1. Modificar el formato del certificado de DER a PEM.

```bash
openssl x509 -inform DER -in cacert.der -out cacert.pem
```

2. Obtener el valor del hash subject\_hash\_old del certificado generado.

```bash
openssl x509 -inform PEM -subject_hash_old -in cacert.pem
```

3. Renombrar el certificado con la nomenclatura previamente mencionada subject\_hash\_old.0.

```bash
move cacert.pem <hash>.0
```

En mi caso, el proceso queda de la siguiente manera:

![Conversión del certificado con OpenSSL](https://cdn.deephacking.tech/i/posts/tunelizar-e-interceptar-trafico-android/tunelizar-e-interceptar-trafico-android-3.avif)

![Obtención del hash del certificado](https://cdn.deephacking.tech/i/posts/tunelizar-e-interceptar-trafico-android/tunelizar-e-interceptar-trafico-android-4.avif)

Bien, después de estas operaciones ya tenemos la mitad del camino hecho con el certificado en el formato necesario para moverlo al dispositivo. Lo siguiente que haremos será empezar a trabajar con la herramienta _adb_ siguiendo el siguiente procedimiento:

1. Iniciar _adb_ y asegurarnos de que estamos operando como root.

```bash
adb.exe
adb root
```

2. Establecer la partición _/system_ en modo escritura, ya que por defecto se encuentra en modo lectura. Este paso es muy importante.

```bash
adb remount
```

Al final de este artículo explico alternativas a este comando, por si tuvieses algún error.

3. Copiar el certificado dentro de nuestro Android.

```bash
adb push <cert>.0 /sdcard/
adb shell
```

4. Modificar los permisos de dicho certificado.

```bash
chmod 644 /sdcard/<cert>.0
```

5. Copiarlo en la carpeta donde se encuentran los certificados verificados por el sistema.

```bash
mv /sdcard/<cert>.0 /system/etc/security/cacerts/
```

Resultaría una cosa tal que así:

![Comandos adb para instalar el certificado](https://cdn.deephacking.tech/i/posts/tunelizar-e-interceptar-trafico-android/tunelizar-e-interceptar-trafico-android-5.avif)

Si ahora accedemos en los ajustes del dispositivo al apartado _Trusted Credentials_ podemos encontrar en _system_ cómo se ha agregado el certificado de _PortSwigger_:

![Certificado de PortSwigger en credenciales del sistema](https://cdn.deephacking.tech/i/posts/tunelizar-e-interceptar-trafico-android/tunelizar-e-interceptar-trafico-android-6.avif)

Listo! Vamos a rematar el proceso 🙂.

## Configuración del proxy Android - Burp Suite

Para finalizar con el proceso, en la misma pestaña donde se encontraba la exportación del certificado en _Burp Suite_, editaremos el listener que vamos a emplear y seleccionaremos la dirección IP local principal, en mi caso la IP del adaptador Wifi para emplearla en el proxy:

![Configuración del listener en Burp Suite](https://cdn.deephacking.tech/i/posts/tunelizar-e-interceptar-trafico-android/tunelizar-e-interceptar-trafico-android-7.avif)

![Selección de la dirección IP del adaptador WiFi](https://cdn.deephacking.tech/i/posts/tunelizar-e-interceptar-trafico-android/tunelizar-e-interceptar-trafico-android-8.avif)

Ahora haremos lo mismo en el dispositivo Android, seleccionaremos la red Wifi y la configuraremos para añadir un proxy manual como se muestra en las siguientes imágenes:

<div class="grid grid-cols-3 gap-4">
<div>

![Configuración de red WiFi en Android](https://cdn.deephacking.tech/i/posts/tunelizar-e-interceptar-trafico-android/tunelizar-e-interceptar-trafico-android-9.avif)

</div>
<div>

![Configuración del proxy manual en Android](https://cdn.deephacking.tech/i/posts/tunelizar-e-interceptar-trafico-android/tunelizar-e-interceptar-trafico-android-10.avif)

</div>
<div>

![Parámetros del proxy HTTP en Android](https://cdn.deephacking.tech/i/posts/tunelizar-e-interceptar-trafico-android/tunelizar-e-interceptar-trafico-android-11.avif)

</div>
</div>

Una vez tengamos realizada esta configuración, ya es posible interceptar el tráfico de nuestro móvil a través de _Burp Suite_:

![Interceptación de tráfico HTTP en Burp Suite](https://cdn.deephacking.tech/i/posts/tunelizar-e-interceptar-trafico-android/tunelizar-e-interceptar-trafico-android-12.avif)

![Tráfico HTTPS interceptado correctamente](https://cdn.deephacking.tech/i/posts/tunelizar-e-interceptar-trafico-android/tunelizar-e-interceptar-trafico-android-13.avif)

## Posibles errores al configurar las particiones Android en modo escritura

Decidí escribir este apartado para intentar ahorraros a cada uno de vosotros la desesperación y frustración que he experimentado durante mi aprendizaje en auditorías Android (que por supuesto aún continua) con los innumerables errores que me he encontrado a la hora de configurar el modo escritura en la partición _/system_.

Además del método mencionado anteriormente empleando el comando _adb remount_, otra alternativa igual de conocida que la anterior es la siguiente:

```bash
adb shell mount -o rw,remount,rw /system // Establece en modo escritura la partición
adb shell mount -o ro,remount,rw /system // Devuelve la partición a modo lectura
```

Sin embargo, me ha sucedido en algunas ocasiones que dependiendo de la versión Android empleada o bien por el dispositivo que se emulaba, me aparecían una serie de errores que impedían realizar este paso. Algunos de estos con los que me he topado son los siguientes:

- '/dev/block/pci/pci0000:00/0000:00:03.0/by-name/system' is read-only

- mount: '/system' not in /proc/mounts

- '/dev/root' is read-only

- /system/bin/sh: avbctl: not found

- remount of the / superblock failed: Permission denied

- mount: '/dev/block/pci/pci0000:00/0000:00:03.0/by-name/system'->'/system': Device or resource busy

- mount: Device or resource busy

Estos fallos han sido obtenidos empleando distintos comandos desde la cmd y desde la shell interna de Android (la mayoría en esta última).

Tras haber realizado diferentes pruebas y haberlo comprobado en distintos dispositivos y versiones de Android, he encontrado una solución que hasta la fecha me ha funcionado en todas las ocasiones. El proceso consiste en ejecutar el emulador Android desde la cmd y añadir una opción para que desde su ejecución las particiones tengan permiso de escritura. De esta manera no se tiene que modificar el emulador una vez iniciado porque la opción está implementada desde su puesta en marcha. El proceso para llevarlo a cabo será el siguiente:

1. Acceder a la carpeta Android\_SDK donde se encuentran los dispositivos emulados de Android Studio.

```bash
cd C:\Tools\Android_SDK\emulator // Buscar el directorio en tu PC
```

2. Listar los emuladores creados para saber cual ejecutar.

```bash
emulator -list-avds
```

3. Ejecutar el emulador con la flag -writable-system

```bash
emulator -avd -writable-system
```

El resultado sería el mostrado a continuación:

![Ejecución del emulador con writable-system](https://cdn.deephacking.tech/i/posts/tunelizar-e-interceptar-trafico-android/tunelizar-e-interceptar-trafico-android-14.avif)

Una vez hecho esto y se haya iniciado el emulador, ya es posible realizar todos los pasos para copiar el certificado en la carpeta especificada.

Espero que os sirva de ayuda y no tengáis problemas!

## Referencias

- [Install System CA Certificate on Android Emulator](https://docs.mitmproxy.org/stable/howto-install-system-trusted-ca-android/)
- [Installing a new trusted SSL root certificate on Android](https://blog.jamie.holdings/2016/09/04/installing-a-new-trusted-ssl-root-certificate-on-android/)
- [How to make AVD system and file-system writable?](https://gist.github.com/interference-security/b786d349839ee5bf40bbd1bc2d240a59)
