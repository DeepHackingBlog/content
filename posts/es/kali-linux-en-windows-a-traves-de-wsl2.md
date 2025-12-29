---
id: "kali-linux-en-windows-a-traves-de-wsl2"
title: "Kali Linux en Windows a través de WSL2"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-04-24
updatedDate: 2024-04-24
image: "https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-0.webp"
description: "Aprende a instalar Kali Linux con interfaz gráfica en Windows usando WSL2. Guía completa con tres modos de visualización y configuración del entorno."
categories:
  - "windows"
draft: false
featured: false
lang: "es"
---

Todo el mundo conoce VMWare o VirtualBox, además, en [otro artículo sobre Kali Linux en Docker](https://blog.deephacking.tech/es/posts/kali-linux-en-docker/) vimos también Docker. Sin embargo, estas no son las únicas alternativas para tener y ejecutar Linux. Hoy vamos a ver como se puede instalar Kali Linux con interfaz gráfica en Windows gracias a WSL (Windows Subsystem for Linux).

- [Instalación de Kali Linux](#instalación-de-kali-linux)
- [Seamless Mode](#seamless-mode)
- [Enhanced Session Mode](#enhanced-session-mode)
- [Windows Mode](#windows-mode)
- [Acceso directo desde Windows Terminal](#acceso-directo-desde-windows-terminal)
- [Acceder al sistema de archivos de Kali desde Windows](#acceder-al-sistema-de-archivos-de-kali-desde-windows)
- [Acceder al sistema de archivos de Windows desde Kali](#acceder-al-sistema-de-archivos-de-windows-desde-kali)
- [Redirección de puertos - De Windows a Kali](#redirección-de-puertos---de-windows-a-kali)
- [Referencias](#referencias)

## Instalación de Kali Linux

Primero de todo nos dirigimos a la Microsoft Store y buscamos el sistema operativo Linux que queramos instalar, en nuestro caso Kali. Una vez lo encontremos, lo instalamos:

![Instalación de Kali Linux desde Microsoft Store](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-1.avif)

Asimismo, si no lo tenemos instalado, recomiendo instalar la Windows Terminal:

![Windows Terminal en Microsoft Store](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-2.avif)

Una vez tenemos instalado ambas cosas, o al menos el Kali, miramos si el WSL está habilitado, para ello, comprobamos las características de Windows:

![Acceso a Panel de Control de Windows](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-3.avif)

![Activar características de Windows - WSL](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-4.avif)

Si está marcado, genial, no tocamos nada, sino, lo activamos, en ese caso probablemente tendremos que reiniciar el equipo.

Una vez hecho esto, abrimos Kali Linux:

![Icono de Kali Linux en Windows](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-5.avif)

La primera vez que lo abrimos tendremos que esperar un poco a que se instale:

![Proceso de instalación de Kali Linux](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-6.avif)

![Configuración inicial de usuario en Kali](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-7.avif)

Una vez termine, nos pedirá que le indiquemos el usuario y contraseña a crear, y hecho esto ya tendremos nuestro Kali en Windows:

![Terminal de Kali Linux funcionando en Windows](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-8.avif)

Una vez lo tenemos, una de las primeras cosas a hacer sería ejecutar un apt update:

![Actualización de paquetes con apt update](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-9.avif)

Este kali viene bastante vacío por defecto, por lo que es recomendable también instalar por ejemplo el siguiente paquete:

```bash
sudo apt install kali-linux-default
```

Podemos encontrar mas conjunto de paquetes en la [documentación oficial](https://www.kali.org/docs/general-use/metapackages/).

Una vez hecho todo esto, es hora de instalar la parte gráfica del Kali, para ello instalamos el siguiente paquete:

```bash
sudo apt install -y kali-win-kex
```

![Instalación de kali-win-kex](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-10.avif)

Win-Kex es el paquete que proporciona esta característica. Con él, vienen tres posibles modos que podemos usar para ver el escritorio de nuestro kali:

- Window Mode
- Enhanced Session Mode
- Seamless Mode

Vamos a ver las tres opciones que tenemos:

## Seamless Mode

El modo Seamless integra el entorno de escritorio KDE directamente en el escritorio de Windows, se vería así:

![Kali Linux en modo Seamless](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-11.avif)

Esto permite que las aplicaciones de Linux se ejecuten como si fueran aplicaciones nativas de Windows. Las ventanas de las aplicaciones aparecen junto a las aplicaciones de Windows sin la barrera visual de estar trabajando dentro de una ventana de VM distinta.

Personalmente, he intentado habilitar este modo pero nunca he tenido la suerte de que me funcionase. En cualquier caso, si queremos hacer uso de él, teóricamente debemos de ejecutar uno de los siguientes comandos:

- Dentro del Kali

```bash
kex --sl -s
```

- Desde una CMD o PowerShell

```powershell
wsl -d kali-linux kex --sl -s
```

No tenemos que ejecutar ambos comandos, simplemente uno de ellos.

## Enhanced Session Mode

El modo de Enhaced Session permite utilizar el protocolo RDP para conectarse a Kali de manera gráfica. Para habilitarlo, de nuevo, tendremos que ejecutar uno de los siguientes dos comandos, el que queramos desde donde queramos:

- Desde del Kali

```bash
kex --esm --ip -s
```

- Desde una CMD o PowerShell

```powershell
wsl -d kali-linux kex --esm --ip -s
```

Si lo ejecutamos por ejemplo desde el Kali, ocurre lo siguiente:

![Iniciando Win-KeX en modo Enhanced Session](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-12.avif)

Se inicia el cliente de Win-Kex, y tras esperar unos segundos, se nos abrirá el cliente RDP de Windows pidiendo conectarse al Kali, simplemente le damos que si y nos habremos conectado:

![Conexión RDP a Kali Linux](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-13.avif)

Este modo está bastante bien ya que se integra muy cómodamente con Windows. El único problema que le he visto es que no le gusta mucho el que redimensiones la ventana, ya que no se adapta:

![Problema de redimensionamiento en modo RDP](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-14.avif)

Es un buen modo si vas a hacer uso de la ventana completa siempre, de otra manera, creo que es bastante coñazo.

## Windows Mode

Este para mi es el mejor modo. Básicamente permite tener el Kali en una ventana independiente en Windows y conectado por VNC. En resumen, es lo mismo que estar conectado por RDP, pero en este caso la ventana si se redimensiona si cambias el tamaño.

Para hacer uso de él, ejecutamos uno de los siguientes comandos:

- Desde el Kali

```bash
kex --win -s
```

- Desde CMD o PowerShell

```powershell
wsl -d kali-linux kex --win -s
```

Si lo ejecutamos, pasa un poco lo mismo que antes, se iniciará el servicio de VNC (al cual la primera vez tendremos que ponerle una contraseña):

![Configuración inicial de VNC en Kali](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-15.avif)

Y tras unos segundos, se abrirá en pantalla completa el Kali:

![Kali Linux en pantalla completa con VNC](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-16.avif)

En este caso, de primeras no se nos abre en ventana ni nada, sino que abarca la pantalla al completo. Para salirnos y convertirlo en modo ventana, presionamos F8:

![Menú de opciones VNC](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-17.avif)

Y se nos abre el menú de VNC. Aquí simplemente damos click en Full screen (que estará marcado) y entonces el Kali pasará al modo ventana:

![Kali Linux en modo ventana](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-18.avif)

Y de esta manera podremos tener el Kali en una ventanita del Windows : )

## Acceso directo desde Windows Terminal

Es posible crear un acceso directo en Windows Terminal para que cada vez que queramos hacer uso de la parte gráfica, no tengamos que sabernos y escribir el comando. Para ello, nos dirigimos a los ajustes y abrimos el JSON de configuración:

> En este caso voy a configurar el Windows Mode. Si quisieses configurar otro simplemente mira el comando en la [documentación oficial de Kali Win-KeX](https://www.kali.org/docs/wsl/win-kex/#windows-terminal).

![Ajustes de Windows Terminal](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-19.avif)

![Abrir archivo JSON de configuración](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-20.avif)

Una vez tenemos el archivo abierto simplemente tendremos que agregar a la lista el acceso directo que queremos crear. En este caso para el Windows Mode sería el siguiente código:

```json
{
      "guid": "{55ca431a-3a87-5fb3-83cd-11ececc031d2}",
      "hidden": false,
      "name": "Win-KeX",
      "commandline": "wsl -d kali-linux kex --wtstart -s",
},
```

![Configuración JSON de Windows Terminal](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-21.avif)

Una vez agregado, guardamos el archivo sin que contenga errores del formato JSON y si todo está bien, nos aparecerá en el desplegable de Windows Terminal:

![Acceso directo Win-KeX en Windows Terminal](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-22.avif)

Si lo pulsamos, se nos abre la siguiente ventana:

![Iniciando Win-KeX desde Windows Terminal](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-23.avif)

Donde simplemente tendremos que esperar un poco a que se inicie el servicio y cuando ocurra, se nos abrirá el Kali:

![Kali Linux abierto desde Windows Terminal](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-24.avif)

## Acceder al sistema de archivos de Kali desde Windows

Sea cual sea la opción que hayamos elegido gráficamente, es importante saber como podemos acceder al sistema de archivos de Kali desde Windows. Para ello hay distintas maneras:

Desde el explorador de archivos:

![Acceso a Linux en el explorador de Windows](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-25.avif)

![Selección de Kali-Linux en el explorador](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-26.avif)

![Sistema de archivos de Kali en Windows](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-27.avif)

Desde la terminal:

```powershell
\\wsl$\Kali-Linux\
```

![Ruta UNC de Kali Linux en Windows](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-28.avif)

Usando Explorer.exe:

Otra opción que tenemos es directamente ejecutar explorer.exe dentro del Kali, seleccionando el directorio de Kali que queremos que se nos abre, por ejemplo el directorio actual:

```bash
explorer.exe .
```

![Abrir explorador de Windows desde Kali](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-29.avif)

## Acceder al sistema de archivos de Windows desde Kali

Por otra parte, ¿Cómo accedemos al sistema de archivos de Windows desde Kali? Pues básicamente podemos encontrar los discos montados en el directorio /mnt:

![Listado de discos montados en mnt](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-30.avif)

![Acceso al disco C desde Kali](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-31.avif)

![Sistema de archivos de Windows desde Kali](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-32.avif)

## Redirección de puertos - De Windows a Kali

Otra cosa bastante útil de usar el WSL es que podemos realizar una redirección de puertos de Windows a Kali, es decir, si Windows no está usando un puerto y recibe una solicitud de lo que sea en ese puerto, lo reenviará al Kali. Esto es super útil para infinidad de cosas, como por ejemplo recibir reverse shells.

Sea lo que sea, para configurarlo tendremos que crear el archivo .wslconfig en el directorio del usuario de Windows:

![Creación del archivo wslconfig](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-33.avif)

Y escribiremos la opción que ves en la imagen:

```ini
localhostForwarding=true
```

De esta manera, si por ejemplo creamos un servidor HTTP en el Kali en el puerto 8000:

![Servidor HTTP en Kali Linux](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-34.avif)

Podremos acceder a él desde Windows poniendo localhost:

![Acceso desde navegador Windows a servidor Kali](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-35.avif)

![Contenido del servidor desde Windows](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-a-traves-de-wsl2/kali-linux-en-windows-a-traves-de-wsl2-36.avif)

## Referencias

- [Guía de instalación de Kali Linux con Win-KeX en WSL2](https://miloserdov.org/?p=4945&PageSpeed=noscript)
