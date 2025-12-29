---
id: "como-instalar-game-of-active-directory-goadv3-en-windows"
title: "Cómo instalar Game of Active Directory (GOADv3) en Windows"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2025-04-12
updatedDate: 2025-04-12
image: "https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-0.webp"
description: "Guía completa para instalar GOADv3, el mejor laboratorio de Active Directory para practicar pentesting, utilizando VMWare y Python en Windows."
categories:
  - "active-directory"
draft: false
featured: false
lang: "es"
---

Hace 1 año lanzamos un artículo donde mostramos como instalar el mejor laboratorio de Active Directory para practicar, el GOAD. Desde entonces, ha pasado bastante tiempo y GOAD se ha ido actualizando, llegando a su versión actual, la versión 3. El artículo de hoy es una actualización y sustitución del artículo que hicimos en su momento, vamos a ver como instalar el laboratorio de GOAD en Windows utilizando VMWare y Python. Los pasos para realizar la instalación en VirtualBox deberían ser prácticamente iguales, pero como no lo he probado personalmente no puedo confirmarlo al 100%. Dicho esto, vamos a empezar :)

- [Características de GOAD](#características-de-goad)
- [Requisitos](#requisitos)
- [Instalación de GOAD utilizando VMWare y Python](#instalación-de-goad-utilizando-vmware-y-python)
- [Credenciales de GOAD](#credenciales-de-goad)
- [Posibles problemas si usamos WSL](#posibles-problemas-si-usamos-wsl)

## Características de GOAD

Vamos a mencionar mínimamente las características que tiene GOAD para quien no lo conozca. La infraestructura del laboratorio completo (que es el que vamos a instalar) es el siguiente:

![Infraestructura del laboratorio GOAD completo con sus dominios y máquinas](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-1.avif)

Aunque tiene otras versiones y extensiones. Podemos ver todas las disponibles en el [repositorio oficial de GOAD en GitHub](https://github.com/Orange-Cyberdefense/GOAD).

GOAD posee una gran cantidad de vulnerabilidades y características, en la siguiente tabla, podemos encontrar todas las que se han ido agregando al laboratorio a través de las versiones. La versión actual y la que vamos a instalar es la v3, y, a fecha de escribir esto, esto es todo lo que incluye y soporta el laboratorio:

| Versión | Funcionalidades | Funcionalidades |
| --- | --- | --- |
| **v1** | SMB share anonymous   SMB not signed   Responder   Zerologon   Windows Defender | ASREPRoast   Kerberoasting   AD ACL abuse   Unconstrained delegation   NTLM relay |
| **v2** | Password reuse between computers (PTH)   Spray user = password   Password in description   Constrained delegation   Install MSSQL   MSSQL trusted link   MSSQL impersonate   Install IIS   Upload ASP app   Multiple forests   Anonymous RPC user listing   Child-parent domain   Generate certificate and enable LDAPS   ADCS (ESC 1/2/3/4/6/8)   Certify | samAccountName/noPAC   PetitPotam unauthenticated   PrinterBug   Drop the mic   Shadow credentials   mitm6   Add LAPS   GPO abuse   Add WebDAV   Add RDP bot   Full Proxmox integration   Add gMSA (recipe created)   Add Azure support   Refactor lab and providers   Protected Users   Account is sensitive   Add PPL   Groups inside groups   Shares with secrets (all, SYSVOL)   SCCM (see SCCM lab) |
| **v3** | AWS support   Ludus support   Windows install compatibility   Extension support   Multiple instance management | Extension Exchange   Extension Ludus   Extension ELK   Extension WS01   Extension Exchange: add a bot to read mails |

## Requisitos

Primero vamos a instalar todo lo necesario para poder instalar el laboratorio de GOAD sin (casi) problemas. Vamos a seguir los pasos descritos en la propia documentación, aunque aquí los veremos mas en detalles y con imágenes, si estais interesados en tener la documentación como referencia la podeis encontrar en el siguiente enlace:
- [Documentación oficial de GOAD para instalación en Windows](https://orange-cyberdefense.github.io/GOAD/installation/windows/)

Vamos a comenzar instalando Visual C++ 2019, podemos descargarlo desde el siguiente enlace:
- [Descargar Visual C++ Redistributable 2019 x64](https://aka.ms/vs/17/release/vc_redist.x64.exe)

<div class="grid grid-cols-2 gap-4">
<div>

![Descarga del instalador de Visual C++ Redistributable](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-2.avif)

</div>
<div>

![Ventana de instalación de Visual C++ Redistributable](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-3.avif)

</div>
</div>

![Finalización de la instalación de Visual C++ Redistributable](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-4.avif)

Una vez instalado, reiniciaremos el equipo, y después procederemos a instalar Vagrant:
- [Página de instalación oficial de Vagrant](https://developer.hashicorp.com/vagrant/install)

En este caso podeis descargar la última versión que esté disponible, debería de funcionar. La versión que he usado a fecha de escribir esto es la 2.4.3:

![Página de descarga de Vagrant](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-5.avif)

<div class="grid grid-cols-2 gap-4">
<div>

![Inicio del instalador de Vagrant](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-6.avif)

</div>
<div>

![Proceso de instalación de Vagrant](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-7.avif)

</div>
</div>

![Finalización de la instalación de Vagrant](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-8.avif)

Tras instalar Vagrant deberemos reiniciar de nuevo el equipo. Una vez lo hagamos instalaremos la utilidad de Vagrant de VMWare:
- [Página de instalación de Vagrant VMWare Utility](https://developer.hashicorp.com/vagrant/install/vmware)

![Página de descarga de Vagrant VMWare Utility](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-9.avif)

<div class="grid grid-cols-2 gap-4">
<div>

![Inicio del instalador de Vagrant VMWare Utility](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-10.avif)

</div>
<div>

![Proceso de instalación de Vagrant VMWare Utility](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-11.avif)

</div>
</div>

![Finalización de la instalación de Vagrant VMWare Utility](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-12.avif)

Una vez instalada esta utilidad, abriremos una ventana de CMD o PowerShell e instalaremos los plugins necesarios (no es necesario que abramos la ventana como administrador):

```powershell
vagrant.exe plugin install vagrant-reload vagrant-vmware-desktop winrm winrm-fs winrm-elevated
```

![Instalación de plugins de Vagrant en PowerShell](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-13.avif)

Tras instalar los plugins es hora de instalar los últimos requisitos:
- Python: se recomienda usar la versión 3.10.
  - [Descargar Python para Windows](https://www.python.org/downloads/windows/)

![Página de descarga de Python para Windows](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-14.avif)

<div class="grid grid-cols-2 gap-4">
<div>

![Inicio del instalador de Python](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-15.avif)

</div>
<div>

![Finalización de la instalación de Python](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-16.avif)

</div>
</div>

- Git: para poder clonar el repositorio
  - [Descargar Git para Windows](https://git-scm.com/downloads/win)

![Página de descarga de Git para Windows](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-17.avif)

<div class="grid grid-cols-2 gap-4">
<div>

![Inicio del instalador de Git](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-18.avif)

</div>
<div>

![Proceso de instalación de Git](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-19.avif)

</div>
</div>

![Finalización de la instalación de Git](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-20.avif)

Llegados este punto, ya tenemos todos los requisitos necesarios para instalar el GOAD. Así que vamos a comenzar con el proceso.

## Instalación de GOAD utilizando VMWare y Python

Primero vamos a comenzar clonando el repositorio e instalando los requisitos de paquetes de Python. Es importante elegir de manera correcta la carpeta donde lo clonaremos, ya que es ahí mismo donde se instalaran las máquinas del GOAD posteriormente, yo por ejemplo lo instalo en Documents.

```powershell
git clone https://github.com/Orange-Cyberdefense/GOAD
cd GOAD/
pip install -r noansible_requirements.yml
```

![Clonación del repositorio de GOAD e instalación de dependencias Python](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-21.avif)

Una vez hayamos clonado el repositorio e instalado las dependencias debemos editar uno de los scripts que vienen en el repositorio de GOAD, concretamente deberemos de editar el siguiente script:

```powershell
GOAD\vagrant\fix_ip.ps1
```

![Ubicación del script fix_ip.ps1 en el repositorio de GOAD](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-22.avif)

Si abrimos este script, podemos observar en las primeras dos líneas un comentario haciendo referencia a un bug existente en vmware al establecer la IP:

![Comentario en el script fix_ip.ps1 sobre el bug de VMWare](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-23.avif)

Si abrimos el enlace del issue, podemos observar un script que soluciona el bug que se menciona:

![Solución del bug en el issue de GitHub de VMWare](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-24.avif)

Así que simplemente tendremos que copiar este script y sustituirlo por el contenido original:

```powershell
param ([String] $ip)

$subnet = $ip -replace "\.\d+$", ""

$name = (Get-NetIPAddress -AddressFamily IPv4 `
   | Where-Object -FilterScript { ($_.IPAddress).StartsWith($subnet) } `
   ).InterfaceAlias

if ($name) {
  Write-Host "Set IP address to $ip of interface $name"
  & netsh.exe int ip set address "$name" static $ip 255.255.255.0 "$subnet.1"
}
```

![Script fix_ip.ps1 actualizado con la solución del bug](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-25.avif)

Guardaremos este cambio y procederemos a ejecutar el script de GOAD:

```powershell
py goad.py -m vm
```

![Ejecución del script de GOAD con el parámetro de máquina virtual](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-26.avif)

Para verificar que todo está bien o que tenemos espacio, podemos ejecutar el comando de check:

![Verificación de espacio disponible y requisitos del sistema](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-27.avif)

Tras verificar que tenemos espacio suficiente y que todo está correcto, podemos proceder a ejecutar el comando de install:

![Inicio del proceso de instalación de GOAD](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-28.avif)

Durante la instalación, a mi se me presentó el siguiente problema en el comando WinRM transport: negotiate:

![Error de WinRM transport negotiate durante la instalación](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-29.avif)

Si no te ocurre, pues mejor, pero en el caso de que te ocurra, esto es un error típico que está detallado en la documentación de GOAD. Dentro de la documentación, podemos encontrar un apartado de Troobleshoot:
- [Guía de solución de problemas de GOAD](https://orange-cyberdefense.github.io/GOAD/troobleshoot/)

Si te ocurre cualquier problema, comprueba primero en esta página que tu error pueda estar ya descrito. Si no fuese así, ya te tocaría buscar en los issues de GOAD por si a alguien mas le ha ocurrido. En cualquier caso, para solucionar el error que muestro en la imagen de arriba deberemos de editar el archivo Vagrantfile principal. Para ello, nos dirigiremos a la carpeta que podemos observar en la segunda línea de la imagen de arriba (el valor de CWD):

```powershell
GOAD\workspace\5ac83c-goad-vmware\provider
```

Vuestro identificador será distinto, por lo que observar que valor tiene el CWD en vuestra consola. Una vez comprobado, nos dirigimos a esa carpeta:

![Carpeta del proveedor de GOAD con el identificador único](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-30.avif)

Aquí encontraremos el archivo de Vagrant principal:

![Archivo Vagrantfile principal en la carpeta del proveedor](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-31.avif)

Dentro de este archivo, para solucionar el fallo de WinRM transport: negotiate, tendremos que agregar las siguiente dos líneas:

```powershell
config.winrm.transport = "plaintext"
config.winrm.basic_auth_only = true
```

El error ocurre porque la negociación SSL de WinRM falla, por lo que con estas dos líneas nuevos le estaremos diciendo que la comunicación la haga en texto plano:

![Configuración de WinRM en plaintext en el Vagrantfile](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-32.avif)

Aquí me gustaría hacer un pequeño inciso y es que, si has realizado varios intentos de instalación porque hayas tenido distintos errores, te recomiendo que antes de volver a ejecutar el comando de install, borres la interfaz que te crea el script de GOAD. Esta interfaz corresponde por defecto a la subred 192.169.56. Dirígete a la configuración de adaptadores de red de tu equipo, y elimina el adaptador que corresponda a esa subred. Una vez hagas esto, reanuda el proceso de instalación con el comando install. Menciono este detalle porque me ocurrió que mientras buscaba solución a los fallos que me iban saliendo, hubo un punto donde la existencia de esta interfaz me daba problemas cuando queria reanudar una instalación, ya que, la instalación cuando comienza, intenta crear esta interfaz.

En cualquier caso, volviendo al tema, tras agregar las dos líneas al archivo de Vagrant, procedí de nuevo con la instalación ejecutando el comando de instalación. Aquí todo empezó a ir bien, sin embargo, en la penúltima máquina (SRV02) me salió el siguiente error:

![Error durante la instalación de la máquina SRV02](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-33.avif)

Este error no es gran cosa, normalmente ocurre si no me equivoco porque el script intenta comunicarse con la máquina antes de que a esta le de tiempo a encenderse. Por lo que la solución a este error es simplemente apagar la máquina y comenzar el proceso de nuevo. No te preocupes porque las máquinas que haya finalizado de instalar y configurar hasta este momento no tendrá que hacerlas de nuevo, siempre y cuando las dejes encendidas, que es como están en este momento. Para apagar el equipo de SRV02 que es donde ha ocurrido este fallo simplemente en la barra de tareas daremos click derecho al icono de VMWare e indicaremos que queremos abrir todas las máquinas virtuales que se encuentran en segundo plano:

![Menú contextual de VMWare para abrir máquinas virtuales](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-34.avif)

Aquí se abrirá el VMWare y simplemente tendremos que apagar la máquina con click derecho y PowerOff. De esta manera, el script seguirá correctamente:

![Máquinas virtuales de GOAD en VMWare con opción de apagado](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-35.avif)

Las máquinas SRV02 y SRV03 se instalarán presuntamente sin problemas. Ahora bien, cuando lleguemos al equipo utilizado para provisionar (aka. configurar cada máquina del AD con los usuarios, vulnerabilidades, etc), puede que nos de un fallo de autenticación fallida:

![Error de autenticación fallida en la máquina de PROVISIONING](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-36.avif)

Esto es simplemente porque no se han generado el par de claves que el script utiliza para autenticarse en el equipo. Tendremos que realizar este paso manualmente, es sencillo asi que no pasa nada. Para ello, tendremos que abrir VMWare y dirigirnos al equipo de PROVISIONING:

![Máquina de PROVISIONING en VMWare](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-37.avif)

![Inicio de sesión en la máquina PROVISIONING con credenciales vagrant](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-38.avif)

Aquí iniciaremos sesión con las credenciales por defecto vagrant:vagrant.

![Generación de par de claves SSH ed25519 para el usuario vagrant](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-39.avif)

Una vez iniciado sesión, deberemos de generar un par de claves SSH para el usuario vagrant:

```bash
ssh-keygen -t ed25519
```

![Copia de la clave pública SSH a authorized_keys](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-40.avif)

No estableceremos ningún passphrase, simplemente daremos enter hasta que se generen el par de claves. Hecho esto, copiaremos la clave pública al archivo authorized\_keys dentro de la carpeta .ssh:

```bash
cp id_ed25519.pub authorized_keys
```

![Servidor HTTP con Python para descargar la clave privada](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-41.avif)

Hecho esto, deberemos de descargar la clave privada a nuestro equipo Windows, para ello, la manera mas sencilla es levantar un servidor simple HTTP con Python:

```bash
python3 -m http.server 80
```

![Descarga de la clave privada desde el navegador](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-42.avif)

![Clave privada guardada como private_key en la carpeta de Vagrant](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-43.avif)

Descargaremos la clave privada y la guardaremos en la siguiente ruta:

```powershell
C:\Users\JuanA\Documents\GOAD\workspace\5ac83c-goad-vmware\provider\.vagrant\machines\PROVISIONING\vmware_desktop
```

El nombre con el que deberemos de guardar la clave privada es private\_key.

![Verificación de la autenticación SSH con la clave privada](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-44.avif)

Tras guardar la clave podemos verificar que funciona:

![Continuación de la instalación después de configurar la autenticación SSH](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-45.avif)

En este caso, para conectarme he utilizado la IP de la máquina de PROVISIONING de la interfaz de NAT. Básicamente, cada máquina del GOAD, tiene 2 interfaces:
- Host-Only (la interfaz de subred 192.168.56)
- La interfaz por defecto que tengamos nosotros configurada como NAT en VMWare

He usado la IP de la segunda interfaz porque se que funciona sin problemas. Ahora explicaré por qué. El caso es que podemos ver que la clave privada funciona sin problemas para la autenticación. Por lo que apaga la máquina de PROVISIONING y vuelve a ejecutar el comando de install para seguir con la instalación:

![Transferencia de archivos a PROVISIONING mediante SCP](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-46.avif)

Podremos ver como donde antes fallaba la autenticación, ahora funcionará sin problemas. Una vez el script verifica que la autenticación funciona, procederá a pasar los archivos necesarios a la máquina de PROVISIONING, esto lo hará con el comando SCP de SSH:

![Verificación de la IP de la interfaz VMWare con ipconfig](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-47.avif)

Sin embargo, aquí puede que nos encontremos el error que podemos ver en la imagen. Un error de que no consigue realizar la conexión. Este error ocurre porque por alguna razón, la interfaz de VMWare de la subred 192.168.56 no tiene una IP válida, podemos confirmar esto ejecutando un ipconfig en otra consola de nuestro Windows:

![Configuración de adaptadores de red en Windows](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-48.avif)

Vemos que la IP es una de APIPA, lo que significa que no se ha podido establecer una IP válida para la interfaz. La solución de esto es verdaderamente sencilla, simplemente tendremos que configurarle una IP estática a esta interfaz:

![Configuración de IP estática en la interfaz VMWare Host-Only](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-49.avif)

![Verificación de conectividad SSH con el comando ssh_jumpbox](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-50.avif)

En esta interfaz, al ser de tipo Host-Only, no le hará falta un Gateway y servidores DNS. Podemos establecer la configuración que se observa en la imagen. Una vez hayamos hecho este cambio, si en el script de GOAD ejecutamos el comando ssh\_jumpbox, podremos ver que funciona sin problemas:

```python
ssh_jumpbox
```

![Continuación exitosa de la instalación después de configurar la IP](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-51.avif)

Por lo que, tras validar que ahora funciona y se tiene conexión, si volvemos a ejecutar el comando de install, la instalación sigue sin problemas:

![Error de conexión desde PROVISIONING a las máquinas del dominio](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-52.avif)

Ahora bien, mas adelante me volvió a ocurrir un error de conexión, pero esta vez no con la máquina de PROVISIONING, sino que el error venía de que la máquina de PROVISIONING no conseguía comunicarse con ninguna de las máquinas del GOAD:

![Verificación de IP inválida en máquinas del dominio](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-53.avif)

Este fallo ocurre por la misma razón que el anterior, las máquinas del GOAD no tienen una IP válida en la interfaz de la subred 192.168.56. Podemos validarlo si iniciamos sesión en cada máquina y vemos la IP de su segunda interfaz. Para iniciar sesión en cada máquina podemos usar las credenciales por defecto de vagrant, vagrant:vagrant.

![Ubicación del archivo Vagrantfile con las IPs por defecto](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-54.avif)

Como podemos observar, al igual que previamente la interfaz de Windows, estas máquinas tienen una IP no válida. La solución es exactamente la misma, ir máquina por máquina configurando una IP estática. Eso si, es importante observar que IP le otorgamos ya que el script utiliza el último octeto para comunicarse con el equipo al que le toca la configuración, es decir, no queremos que al DC01 se le haga la configuración del SRV03 por ejemplo.

En el siguiente archivo de Vagrant podemos observar cuales son las IP por defecto de cada máquina:

```powershell
GOAD\ad\GOAD\providers\vmware
```

![Archivo Vagrantfile mostrando las IPs asignadas a cada máquina](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-55.avif)

![Configuración de IP estática en las máquinas del dominio](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-56.avif)

Las IP con su equipo correspondiente son las siguientes:
- DC01: 192.168.56.10
- DC02: 192.168.56.11
- DC03: 192.168.56.12
- SRV02: 192.168.56.22
- SRV03: 192.168.56.23

Así que simplemente tendremos que ir equipo por equipo, iniciando sesión con el usuario de vagrant y estableciendo la siguiente configuración, donde solo cambiará el último octeto de la IP dependiendo de la máquina que estemos configurando:

![Ejecución del comando provision_lab para configurar el laboratorio](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-57.avif)

Tras hacer estos cambios, ahora si que si, se instalará todo sin problemas y la instalación del laboratorio de GOAD habrá finalizado. Ahora en vez de ejecutar el comando de install, como solo nos queda la provisión, podemos ejecutar el siguiente comando directamente:

```python
provision_lab
```

![Finalización exitosa del aprovisionamiento del laboratorio](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-58.avif)

![Confirmación de que el laboratorio GOAD está completamente funcional](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-59.avif)

Con esto, GOAD ya está totalmente operativo :)

![Configuración de interfaz de red en Kali Linux para conectar con GOAD](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-60.avif)

Es importante que a vuestra Kali le añadais una segunda interfaz que corresponda a la de la subred 192.168.56 y le configureis la IP estática:

![Configuración de IP estática en la interfaz de Kali Linux](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-61.avif)

![Configuración de IP estática en la interfaz de Kali Linux](https://cdn.deephacking.tech/i/posts/game-of-active-directory-goadv3-en-windows/game-of-active-directory-goadv3-en-windows-62.avif)

Sino, también podeis usar la subred de la NAT (192.168.10 en mi caso) y listo, ya que las máquinas de GOAD también tienen esta interfaz.

## Credenciales de GOAD

Dejo a continuación una tabla donde se resumen todas las credenciales de GOAD para que se puedan usar como referencia:

| Usuario | Dominio | Contraseña | Propósito | Administrador en |
| --- | --- | --- | --- | --- |
| tywin.lannister | sevenkingdoms.local | powerkingftw135 | Líder de Lannister, con permisos específicos (forcechangepassword). | \- |
| jaime.lannister | sevenkingdoms.local | cersei | Miembro de Lannister, con permisos elevados (GenericWrite). | \- |
| cersei.lannister | sevenkingdoms.local | il0vejaime | Líder administrativa, miembro de Domain Admins, Lannister y Small Council. | dc01 (kingslanding) |
| tyron.lannister | sevenkingdoms.local | Alc00L&S3x | Miembro de Lannister, con permisos específicos (Self-Membership). | \- |
| robert.baratheon | sevenkingdoms.local | iamthekingoftheworld | Líder administrativo, miembro de Domain Admins, Baratheon y Small Council. | dc01 (kingslanding) |
| joffrey.baratheon | sevenkingdoms.local | 1killerlion | Miembro de Baratheon y Lannister, con permisos elevados (WriteDacl). | \- |
| renly.baratheon | sevenkingdoms.local | lorastyrell | Miembro de Baratheon y Small Council, con permisos sensibles (WriteDacl). | \- |
| stannis.baratheon | sevenkingdoms.local | Drag0nst0ne | Miembro de Baratheon y Small Council, con permisos elevados (GenericAll). | \- |
| petyer.baelish | sevenkingdoms.local | @littlefinger@ | Miembro de Small Council, rol estándar. | \- |
| lord.varys | sevenkingdoms.local | W1sper$ | Miembro de Small Council, con permisos críticos (GenericAll Domain Admins). | \- |
| maester.pycelle | sevenkingdoms.local | MaesterOfMaesters | Miembro de Small Council, rol estándar. | \- |
| arya.stark | north.sevenkingdoms.local | Needle | Miembro de Stark, con permisos SQL elevados (impersonate dbo). | \- |
| eddard.stark | north.sevenkingdoms.local | FightP3aceAndHonor! | Líder administrativo, miembro de Domain Admins y Stark. | dc02 (winterfell) |
| catelyn.stark | north.sevenkingdoms.local | robbsansabradonaryarickon | Miembro de Stark, con rol administrativo. | dc02 (winterfell) |
| robb.stark | north.sevenkingdoms.local | sexywolfy | Miembro de Stark, con credenciales expuestas (autologon). | dc02 (winterfell) |
| sansa.stark | north.sevenkingdoms.local | 345ertdfg | Miembro de Stark, con SPN (HTTP/eyrie). | \- |
| brandon.stark | north.sevenkingdoms.local | iseedeadpeople | Miembro de Stark, con permisos SQL (impersonate jon.snow). | \- |
| rickon.stark | north.sevenkingdoms.local | Winter2022 | Miembro de Stark, rol estándar. | \- |
| hodor | north.sevenkingdoms.local | hodor | Miembro de Stark, rol estándar (probable cuenta de prueba). | \- |
| jon.snow | north.sevenkingdoms.local | iknownothing | Miembro de Stark y Night Watch, con SPN (HTTP/thewall) y permisos SQL (sa). | \- |
| samwell.tarly | north.sevenkingdoms.local | Heartsbane | Miembro de Night Watch, con permisos SQL (impersonate sa). | \- |
| jeor.mormont | north.sevenkingdoms.local | L0ngCl@w | Líder de Night Watch y Mormont, con rol administrativo. | srv02 (castelblack) |
| sql\_svc (north) | north.sevenkingdoms.local | YouWillNotKerboroast1ngMeeeeee | Cuenta de servicio SQL para MSSQL en castelblack. | \- |
| daenerys.targaryen | essos.local | BurnThemAll! | Líder administrativa, miembro de Domain Admins y Targaryen. | dc03 (meereen) |
| viserys.targaryen | essos.local | GoldCrown | Miembro de Targaryen, con permisos específicos (ej. CA manager). | dc03 (meereen) |
| khal.drogo | essos.local | horse | Líder Dothraki, con permisos elevados (GenericAll). | srv03 (braavos) |
| jorah.mormont | essos.local | H0nnor! | Miembro de Targaryen, con permisos específicos (GenericAll por Spys). | \- |
| missandei | essos.local | fr3edom | Usuario con permisos específicos (GenericWrite/GenericAll). | \- |
| drogon | essos.local | Dracarys | Miembro de Dragons, relacionado con gMSA. | \- |
| sql\_svc (essos) | essos.local | YouWillNotKerboroast1ngMeeeeee | Cuenta de servicio SQL para MSSQL en braavos. | \- |

## Posibles problemas si usamos WSL

Esta parte está patronicada por mi amigo Ángel (aka. [Anthares101 en GitHub](https://github.com/Anthares101)), quien también instaló el GOAD, pero, al contrario que yo, lo hizo usando WSL en lugar de Python. Si lo haces de esta manera es posible que también te surja algún que otro incoveniente. A continuación dejo algunos problemas que le surgieron a él, y las respectivas soluciones que él tomó:

#### Ansible no puede alcanzar las máquinas

Después de implementar Vagrant en todas las máquinas (recuerda añadirlas a VMware usando la opción de escaneo), Ansible se quejará de no poder alcanzar las máquinas. Esto se debe a que la interfaz de red creada no tiene un servidor DHCP por defecto, dejando a nuestro host sin una dirección IP válida.

Ve al Editor de Red Virtual y actualiza la nueva red para que tenga un servidor DHCP, espera unos 5 minutos y vuelve a intentarlo.

#### Errores de DNS

A veces, las máquinas pueden confundirse sobre qué interfaz usar para la resolución de DNS. Solo fuerza la interfaz correcta para los dominios .local en las máquinas con:

```powershell
Add-DnsClientNrptRule -Namespace ".local" -NameServers "192.168.56.10"
Clear-DnsClientCache

# Evita el bloqueo ya que puede fallar incluso aunque el problema esté resuelto  
Resolve-DnsName sevenkingdoms.local
```

#### Zona horaria y prueba de renovación

Probablemente deberías cambiar la zona horaria de cada máquina a la tuya para evitar problemas con Kerberos. Ejecuta el siguiente comando como administrador en todas las máquinas:

```bash
# Windows
tzutil /s "Romance Standard Time"

# Linux
sudo timedatectl set-timezone Europe/Madrid
```

Para evitar tener que reinstalar el laboratorio nuevamente, puedes renovar la licencia de prueba de Windows Server usando:
- [Scripts de activación de Microsoft en GitHub](https://github.com/massgrave/Microsoft-Activation-Scripts)
