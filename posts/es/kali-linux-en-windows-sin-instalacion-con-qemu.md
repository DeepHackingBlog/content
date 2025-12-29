---
id: "kali-linux-en-windows-sin-instalacion-con-qemu"
title: "Kali Linux en Windows sin instalación ni privilegios de administrador con Qemu"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-11-12
updatedDate: 2024-11-12
image: "https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-0.webp"
description: "Aprende a ejecutar Kali Linux en Windows sin necesidad de privilegios de administrador ni instalación usando Qemu como emulador portable."
categories:
  - "linux"
  - "windows"
draft: false
featured: false
lang: "es"
---

Todo el mundo sabe instalar Kali Linux en VMWare o VirtualBox. O si también eres fiel seguidor del blog, también conocerás como hacerlo en [WSL2](https://blog.deephacking.tech/es/posts/kali-linux-en-windows-a-traves-de-wsl2/) y [Docker](https://blog.deephacking.tech/es/posts/kali-linux-en-docker//). Ahora bien, ¿Qué ocurre si nos encontramos en un entorno tan restrictivo que ni siquiera tenemos privilegios de administrador o incluso internet para instalar cualquiera de las opciones recién mencionadas?

Pues aunque no lo parezca incluso en una situación así es posible ejecutar Kali Linux sin necesidad de privilegios de administrador. Esto es posible gracias a herramientas como Qemu, que actúan como emuladores, y permiten ejecutar un sistema operativo sin la necesidad de interactuar directamente con los recursos de hardware, como lo hacen los hipervisores tradicionales.

Hoy vamos a ver como hacerlo 🤭

- [Kali Linux con Qemu](#kali-linux-con-qemu)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

## Kali Linux con Qemu

Para quien no lo conozca, [Qemu](https://www.qemu.org/) es una herramienta de código abierto que permite emular diferentes arquitecturas de hardware y ejecutar sistemas operativos en entornos virtualizados. La gran ventaja de Qemu es que, al ser un emulador y no un hipervisor, no requiere privilegios de administrador para funcionar. Esto se debe a que emula completamente el hardware necesario para ejecutar el sistema operativo, en lugar de interactuar directamente con los componentes de la máquina host, como lo haría un hipervisor (por ejemplo, VMWare o VirtualBox).

Y, aunque Qemu es uno de los emuladores mas conocidos, esta técnica que veremos hoy puede ser replicada con otros emuladores también. Así que dicho esto, lo primero que tendremos que hacer es [descargar Qemu desde su página oficial de binarios para Windows](https://qemu.weilnetz.de/w64/).

En este caso descargaré la última versión disponible a día de hoy:

![Página de descarga de Qemu mostrando las últimas versiones disponibles](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-1.avif)

Una vez descargado podemos observar como sale el símbolo de ejecución como administrador, y si lo abrimos para instalarlo, nos pedirá las credenciales de un usuario administrador debido a que mi usuario actual no posee privilegios:

![Instalador de Qemu mostrando el símbolo de escudo de administrador](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-2.avif)

![Ventana de UAC solicitando credenciales de administrador](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-3.avif)

Pues ante esta situación la solución es simple, extraemos el .exe usando por ejemplo 7z:

![Menú contextual de 7-Zip mostrando opciones de extracción](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-4.avif)

Una vez se extraiga obtendremos lo mas parecido a un Qemu Portable, obtendremos todos los archivos fuente de Qemu:

![Carpeta con los archivos extraídos del instalador de Qemu](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-5.avif)

![Contenido de la carpeta de Qemu mostrando archivos ejecutables y bibliotecas](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-6.avif)

Una vez tengamos esto es hora de descargar Kali Linux, concretamente tendremos que descargar la versión "Live Boot":

![Página de descargas de Kali Linux con opciones disponibles](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-7.avif)

![Selección de la versión Live Boot de Kali Linux para descarga](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-8.avif)

Una vez tengamos descargada la ISO la moveremos a la carpeta de Qemu:

![ISO de Kali Linux ubicada en la carpeta de Qemu](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-9.avif)

En este punto ya es hora de abrir la terminal en la carpeta de Qemu y ejecutar los siguientes comandos:

```powershell
.\qemu-img create -f qcow2 testing-image.img 20G
```

![Terminal mostrando la creación de la imagen de disco virtual](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-10.avif)

Este comando crea una imagen de disco virtual para usar con Qemu.

- qemu-img: Es la utilidad de Qemu para crear, convertir y modificar imágenes de disco.
- create: Especifica que se va a crear una nueva imagen de disco.
- \-f qcow2: Define el formato de la imagen de disco. En este caso, es qcow2, que es un formato eficiente en espacio que permite características como snapshots y compresión.
- testing-image.img: Es el nombre del archivo que contendrá la imagen de disco.
- 20G: Especifica el tamaño de la imagen de disco, en este caso, 20 gigabytes.

Una vez hemos creado esta imagen de disco es hora de ejecutar una máquina virtual usando esta imagen y la ISO de Kali que hemos descargado:

```powershell
.\qemu-system-x86_64 -m 2048 -boot d -smp 2 -net nic,model=virtio -net user -hda testing-image.img -cdrom kali-linux-2024.2-live-amd64.iso
```

- qemu-system-x86\_64: Es la utilidad de Qemu que inicia una máquina virtual con una arquitectura de 64 bits (x86\_64).
- \-m 2048: Asigna 2048 MB (2 GB) de memoria RAM a la máquina virtual.
- \-boot d: Indica que la máquina virtual debe arrancar desde el dispositivo "d", que normalmente es la unidad de CD/DVD (en este caso, la ISO).
- \-smp 2: Configura la máquina virtual para usar 2 núcleos de CPU (simulando un procesador de 2 núcleos).
- \-net nic,model=virtio: Crea una tarjeta de red virtual en la máquina, usando el modelo virtio, que es optimizado para virtualización.
- \-net user: Configura la red de la máquina virtual en modo "user", lo que permite acceso a la red externa sin requerir configuraciones adicionales en el sistema host.
- \-hda testing-image.img: Usa el archivo testing-image.img como el disco duro virtual de la máquina.
- \-cdrom kali-linux-2024.2-live-amd64.iso: Monta el archivo ISO de Kali Linux como si fuera un CD/DVD dentro de la máquina virtual, desde donde se realizará el arranque.

![Ventana de Qemu ejecutando el arranque de Kali Linux](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-11.avif)

![Menú de arranque de Kali Linux Live Boot](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-12.avif)

Puede tardar unos minutos en cargar, pero al finalizar tendrás un Kali Linux completamente funcional con conexión a internet (e intranet), sin necesidad de permisos de administrador ni instalación.

![Escritorio de Kali Linux ejecutándose en Qemu](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-13.avif)

![Terminal de Kali Linux mostrando conexión exitosa a internet](https://cdn.deephacking.tech/i/posts/kali-linux-en-windows-sin-instalacion-con-qemu/kali-linux-en-windows-sin-instalacion-con-qemu-14.avif)

## Conclusión

Lo más interesante de ejecutar Kali Linux de esta manera es que es totalmente portable. Podemos preparar en nuestro ordenador la carpeta de Qemu con la ISO de Kali y moverla a cualquier ordenador sin necesidad de instalación. Como se mencionó anteriormente, no es necesario tener conexión a internet en el momento de la ejecución, siempre y cuando se haya preparado todo de antemano.

Además, este método no está limitado a Kali Linux. Qemu puede utilizarse para emular otros sistemas operativos sin requerir privilegios de administrador, lo que lo convierte en una herramienta super útil y flexible para entornos restrictivos.

## Referencias

- [Run Kali Linux on Windows without admin rights or installation - Mark Mo](https://medium.com/@markmotig/run-kali-linux-on-windows-without-admin-rights-or-installation-2699b2537d13)
- [Virtual machine on Windows 11 without admin - Darren](https://darrengoossens.wordpress.com/2024/02/03/virtual-machine-on-windows-11-without-admin/)
