---
id: "escalada-de-privilegios-a-traves-de-contrasenas-en-windows"
title: "Escalada de Privilegios a través de Contraseñas en Windows"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-01-03
updatedDate: 2022-01-03
image: "https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-0.webp"
description: "Técnicas para escalar privilegios en Windows mediante contraseñas almacenadas en el registro, archivos de configuración, credenciales guardadas y extracción de hashes SAM."
categories:
  - "windows"
draft: false
featured: false
lang: "es"
---

Otra de las formas típicas de escalar privilegios en Windows es a través de las contraseñas. Ya sea porque algún usuario las reutiliza o porque las encontramos en texto plano en algún archivo o documento.

Windows es bastante susceptible de ser vulnerable a esto, ya que contiene muchas características las cuales almacenan información de forma no muy segura. Vamos a ver en que tipo de sitios y como nos podemos encontrar información sensible:

Índice:

- [Registro](#registro)
- [WinPEAS](#winpeas)
- [PowerSploit](#powersploit)
- [Save Creds](#save-creds)
- [Archivos de Configuración](#archivos-de-configuración)
- [SAM y SYSTEM](#sam-y-system)
- [Referencias](#referencias)

El entorno usado en el post se ha montado usando el script [Windows-PrivEsc-Setup](https://github.com/Tib3rius/Windows-PrivEsc-Setup) de Tib3rius.

## Registro

Los programas suelen guardar información para su correcto funcionamiento en el registro de Windows. Así mismo, también guardan contraseñas.

Podemos hacer una búsqueda recursiva para ver si encontramos el campo "password" en algún registro con los siguientes comandos:
- `reg query HKLM /f password /t REG_SZ /s`
- `reg query HKCU /f password /t REG_SZ /s`

En el primer comando, buscamos recursivamente en el registro HKEY\_LOCAL\_MACHINE la palabra "password", en el segundo comando hacemos lo mismo pero en el registro HKEY\_CURRENT\_USER.

La diferencia entre estos dos registros es que HKLM contiene información de configuraciones relacionadas con el sistema operativo y el software instalado. Mientras que HKCU almacena configuraciones específicas del usuario con el que se ha iniciado la sesión.

Por lo demás, la explicación de los argumentos del comando `reg query` es la siguiente:
- `/f` --> Se usa para indicar por la palabra a buscar, por eso, va acompañada de password (`/f <palabra>`), ya que es lo que queremos buscar.
- `/t` --> Especificamos el tipo de registro (`/f <tipo de registro>`), en este caso como podemos ver, indicamos REG\_SZ, aunque las diferentes opciones son: **REG\_MULTI\_SZ**, **REG\_EXPAND\_SZ**, **REG\_DWORD**, **REG\_BINARY**, **REG\_NONE**. Si no se especifica ninguna, busca por todas. En nuestro caso, REG\_SZ corresponde con una cadena de texto de longitud fija.
- `/s` --> Indicamos que se consulte a todas las subclaves y nombres de valores de forma recursiva. Aquí una imagen que explica que es cada cosa:

<figure>

![Estructura del registro de Windows mostrando Key, Value y Data](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-1.avif)

<figcaption>

https://binaryforay.blogspot.com/2015/01/registry-hive-basics-part-2-nk-records.html

</figcaption>

</figure>

Estos dos comandos suelen generar una gran salida. Por lo que a menudo, en vez de hacer esto, se suele mirar previamente en sitios comunes, como por ejemplo winlogon. Winlogon es un componente de los sistemas Windows el cual, entre otras cosas, se encarga del inicio de sesión automático.

Para que se produzca un inicio de sesión automático, las credenciales se tienen que almacenar en algún sitio, y este no es otro que el registro. De hecho, Microsoft proporciona un tutorial oficial de como activar el inicio de sesión automático añadiendo tus credenciales al registro en texto plano, [aquí tenéis la fuente](https://docs.microsoft.com/es-es/troubleshoot/windows-server/user-profiles-and-logon/turn-on-automatic-logon).

Por lo que algo típico, es comprobar si hay credenciales almacenadas en el registro de winlogon, de forma manual se podría hacer de la siguiente forma:

`reg query "HKLM\SOFTWARE\Microsoft\Windows NT\Currentversion\Winlogon"`

<figure>

![Query al registro de Winlogon mostrando credenciales en texto plano](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-2.avif)

<figcaption>

Shell de 64 bits

</figcaption>

</figure>

Como vemos, en este caso, obtenemos las credenciales al tener configurado el inicio de sesión automático en el equipo.

> Nota: Antes de hacer queries a los registros, o realmente, en general para las escaladas de privilegio en Windows, tenemos que fijarnos muy bien si el proceso de nuestra shell es de 64 bits o 32 bits (esto obviamente solo aplica si la máquina es de 64 bits, ya que en sistemas de 32 pues no hay otra opción).
>
> Que nuestro proceso trabaje en 64 o 32 puede suponer que consigamos escalar o no privilegios. Por ejemplo, este sería el output si hiciésemos una query al registro de winlogon, como acabamos de hacer, pero desde un proceso de 32 bits:

<figure>

![Query al registro de Winlogon desde shell de 32 bits mostrando diferentes resultados](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-3.avif)

<figcaption>

Shell de 32 bits en un Sistema de 64 bits

</figcaption>

</figure>

No nos lista el mismo resultado, la razón de esto la podéis ver en [este artículo de Stack Overflow](https://stackoverflow.com/questions/9433928/execute-reg-query-as-a-new-process-does-not-display-all-keys) (otro recurso a echarle un vistazo es a la propia documentación oficial de Microsoft, en este caso, al [Redirector del Registro](https://docs.microsoft.com/es-es/windows/win32/winprog64/registry-redirector?redirectedfrom=MSDN)). A lo que quiero llegar, es que hay que tener cuidado con este tipo de cosas.

Dicho esto, este es uno de los sitios típicos para buscar credenciales almacenadas, también es muy recomendable echar un vistazo si el equipo tiene programas como Putty, WinSCP, o algún navegador como Mozilla (entre otros) instalados. Ya que estos, también pueden contener credenciales almacenadas de alguna sesión. En cualquier caso, existen herramientas que nos pueden automatizar la enumeración y extracción de credenciales, como por ejemplo, WinPEAS.

## WinPEAS

Como ya hemos visto en otros posts, WinPEAS es una herramienta muy potente cuando se trata de buscar posibles formas de escalar privilegios en Windows. Además, acepta argumentos para seleccionar exactamente que tipo de información queremos que enumere (del mismo modo, podemos ejecutarlo sin argumentos para que enumere todo). La lista de argumentos la podemos consultar en su [repositorio oficial](https://github.com/carlospolop/PEASS-ng/blob/master/winPEAS/winPEASexe/README.md).

En este caso, los argumentos que nos pueden interesar para buscar credenciales, son `filesinfo` y `userinfo`, de tal forma, que el comando a ejecutar sería:

`winPEAS.exe quiet filesinfo userinfo`

El argumento `quiet` solo sirve para que no muestre el banner en la salida.

Entonces, ejecutando este comando, WinPEAS entre otras muchas cosas que obtendrá, algunas de ellas, serán las siguientes:

![Salida de WinPEAS mostrando credenciales extraídas de Winlogon](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-4.avif)

![Salida de WinPEAS mostrando credenciales extraídas de Putty](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-5.avif)

Como podemos ver, ha conseguido extraer credenciales de Winlogon y Putty (no es lo único que ha obtenido, pero el output es demasiado grande como para mostrarlo uno por uno). Lo podríamos haber hecho manualmente, sin embargo, no es lo más eficiente teniendo una herramienta como WinPEAS.

> Nota: Las credenciales de Putty en caso de hacerlo manualmente la encontraríamos de la siguiente forma:
>
> `reg query "HKCU\Software\SimonTatham\PuTTY\Sessions" /s`

## PowerSploit

Siempre hay que tener alternativas en caso de que algo falle, por lo que otra herramienta que podemos usar para enumerar credenciales es PowerSploit, más específicamente su script "PowerUp.ps1".

En este caso, las posibles funciones que nos pueden interesar son las siguientes:

```powershell
Get-UnattendedInstallFile
Get-Webconfig
Get-ApplicationHost
Get-SiteListPassword
Get-CachedGPPPassword
Get-RegistryAutoLogon
```

Si no conoces PowerSploit, básicamente es un repositorio que contiene una gran cantidad de scripts de powershell útiles para post-explotación, en este caso el que nos interesa es `PowerUp.ps1`. Una vez cargamos el script en el sistema, tendremos todos los cmdlets (funciones) que menciono en la parte superior (y muchos más). Esta herramienta se puede descargar desde su [repositorio oficial](https://github.com/PowerShellMafia/PowerSploit/blob/master/Privesc/PowerUp.ps1).

Ejemplo de uso:

![Ejemplo de ejecución de PowerUp.ps1 obteniendo credenciales del registro](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-6.avif)

Con el primer comando cargamos el módulo en la powershell, para así, tener las funciones de `PowerUp.ps1` integradas.

> En el primer comando he podido cargarlo, ya que mi Windows tiene acceso a internet y puede llegar al repositorio. Si estuvieses en una máquina de HackTheBox o TryHackMe, no podrías cargarlo directamente desde el repositorio, puesto que las máquinas no tienen salida a internet. Tendrías que descargarlo en tu máquina y montarte un servidor web o pasarlo al Windows.

## Save Creds

Al igual que en Linux se le pueden asignar privilegios `sudo` a un usuario para que pueda ejecutar un script o binario en nombre de otro, Windows tiene una característica bastante parecida, en este caso, RunAs.

RunAs es una característica que te permite ejecutar cualquier programa en nombre de otro usuario si conoces su contraseña, ejemplo:

![Ejemplo de uso de RunAs para ejecutar comandos como otro usuario](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-7.avif)

Sin embargo, RunAs tiene una característica la cual permite guardar credenciales de otro usuario para que puedas ejecutar lo que quieras sin conocer la contraseña del mismo. Esta característica se trata del argumento `savecred`.

Podemos comprobar si hay credenciales almacenadas de algún usuario usando el comando [cmdkey](https://ss64.com/nt/cmdkey.html). Cmdkey es una herramienta de línea de comandos que nos permite gestionar las credenciales almacenadas en el sistema, de forma gráfica, lo gestionaríamos desde el "Administrador de Credenciales". En cualquier caso, para ver el listado de credenciales almacenadas en el sistema, usamos el siguiente comando:

`cmdkey /list`

<figure>

![Salida del comando cmdkey mostrando credenciales guardadas](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-8.avif)

<figcaption>

Cmdkey

</figcaption>

</figure>

<figure>

![Administrador de Credenciales de Windows mostrando las credenciales guardadas](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-9.avif)

<figcaption>

Administrador de Credenciales

</figcaption>

</figure>

Como podemos comprobar en ambas imágenes, hay credenciales almacenadas del usuario "admin" (También podríamos enumerarlo usando WinPEAS con el comando `winPEAS.exe quiet windowscreds`).

Sabiendo que hay credenciales del usuario "admin" almacenadas, nos podemos aprovechar de esto para ejecutarnos una reverse shell usando runas:

`runas /savecred /user:<usuario> <ejecutable>`

![Uso de runas con savecred para obtener reverse shell como administrador](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-10.avif)

> Nota: En RunAs también podemos indicar que el ejecutable se ejecute con los argumentos que queramos si lo ponemos todo entre comillas.

De esta forma, somos capaces de escalar privilegios gracias a las credenciales almacenadas del usuario administrador.

## Archivos de Configuración

En cualquier sistema, los archivos de configuración existen, de la misma forma, existe la posibilidad de que estos tengan credenciales en texto plano (Un ejemplo típico es el archivo `wp-config.php` en Wordpress, o el archivo `web.config` en IIS).

Podemos buscar recursivamente archivos de configuración que contengan de nombre la palabra "pass" o que tengan de extensión ".config" con el siguiente comando:

`dir /s *pass* == *.config`

También podríamos buscar archivos que contengan la palabra "password" en su contenido y que tengan como extensión la que nosotros especifiquemos:

`findstr /si password *.xml *.ini`

Estos dos comandos tenemos que tener cuidado desde donde lo lanzamos, ya que si por ejemplo lo lanzásemos desde la raiz (C:\\), traerían un output inmenso, ya que ambos buscan de forma recursiva.

En este caso, de nuevo WinPEAS nos podría facilitar la tarea de enumeración, podríamos usar el siguiente comando:

`winPEAS.exe quiet searchfast filesinfo`

Recuerda que puedes ver los argumentos de WinPEAS desde su [repositorio](https://github.com/carlospolop/PEASS-ng/blob/master/winPEAS/winPEASexe/README.md).

Lanzando el comando de WinPEAS, encontramos el siguiente archivo interesante:

<figure>

![Salida de WinPEAS detectando archivo Unattend.xml](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-11.avif)

<figcaption>

Esto también lo reportó el comando `winPEAS.exe quiet filesinfo userinfo` aunque no lo mencionase

</figcaption>

</figure>

Comprobando su contenido, vemos lo siguiente:

![Contenido del archivo Unattend.xml mostrando configuración de usuario](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-12.avif)

![Credenciales codificadas en base64 en archivo Unattend.xml](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-13.avif)

Encontramos las credenciales de "admin" en base64.

`Unattend.xml` es un archivo típico donde podemos encontrar credenciales. Según la [documentación oficial de Microsoft](https://docs.microsoft.com/en-us/windows-hardware/customize/desktop/wsim/answer-files-overview#:~:text=An%20answer%20file%20is%20an,to%20use%20during%20Windows%20Setup.&text=You%20can%20also%20specify%20values,xml.), este archivo es un archivo basado en XML que contiene definiciones y valores de configuración para utilizar durante la instalación de Windows.

Es muy típico que los administradores de sistemas usen los Servicios de Implementación de Windows para crear una imagen del mismo para implantarla en varios equipos de la red. Esto se denomina "Unattended Installation". El problema de este tipo de instalación, es que la contraseña del administrador local del equipo se puede almacenar en varias ubicaciones como la que hemos visto. Otras posibles ubicaciones son:
- `C:\unattend.xml`
- `C:\Windows\Panther\Unattend\Unattend.xml`
- `C:\Windows\system32\sysprep.inf`
- `C:\Windows\system32\sysprep\sysprep.xml`

También existe un módulo de metasploit que comprueba esto: `post/windows/gather/enum_unattend`

Una vez hemos obtenido y conocemos la contraseña de un usuario, podemos usar RunAs, o algún programa como psexec para obtener shell como el usuario en cuestión.

## SAM y SYSTEM

A veces, no todos son las contraseñas. Una característica que tiene Windows, es que sabiendo el hash NT de un usuario, podemos obtener una shell sin necesidad de la contraseña (esto no es random, sabiendo como funciona la autenticación NTLM entendemos por qué).

El SAM del equipo, o, dicho de otra forma, el "Security Account Manager" es donde se almacenan los hashes de las contraseñas de los usuarios del sistema. Los hashes se almacenan de forma encriptada, y la clave de desencriptación se encuentra en el archivo SYSTEM.

Por lo que, si somos capaces de leer el archivo SAM y SYSTEM, podemos extraer los hashes de todos los usuarios del equipo.

Los archivos SAM y SYSTEM, se almacenan en el directorio:

`C:\Windows\System32\config`

Estos archivos están bloqueados mientras Windows está ejecutándose. Sin embargo, quizás podemos encontrar un backup en alguno de los siguientes directorios:
- `C:\Windows\Repair`
- `C:\Windows\System32\config\RegBack`

En este caso, encontramos un backup de ambos archivos en el directorio `C:\Windows\Repair`, por lo que podemos copiárnoslo a nuestro equipo:

![Transferencia de archivos SAM y SYSTEM a máquina atacante](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-14.avif)

Ambos archivos son ilegibles, ya que son binarios:

![Contenido binario de los archivos SAM y SYSTEM](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-15.avif)

Para desencriptar el archivo "SAM" usando "SYSTEM", podemos usar por ejemplo `pwdump.py`:

![Extracción de hashes con pwdump.py](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-16.avif)

También podríamos usar `secretsdump.py`:

![Extracción de hashes con secretsdump.py](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-contrasenas-en-windows/escalada-de-privilegios-a-traves-de-contrasenas-en-windows-17.avif)

Por último, una vez tenemos el hash NT de los usuarios, tenemos dos opciones, intentar crackearlo, o hacer Pass The Hash.

> Nota: Si ya hemos escalado privilegios y lo que queremos es obtener los hashes para generar persistencia. Siendo administrador, podemos obtener la SAM y el SYSTEM desde el registro con los comandos:
>
> `reg save HKLM\SAM SAM.backup`
>
> `reg save HKLM\SYSTEM SYSTEM.backup`

## Referencias
- [HKEY_LOCAL_MACHINE (HKLM) | Neoguias](https://www.neoguias.com/hkey-local-machine-hklm/#:~:text=HKEY_LOCAL_MACHINE%2C%20abreviado%20como%20HKLM%2C%20es,software%20instalado%20en%20tu%20ordenador.)
- [Registro de Windows - Wikipedia](https://es.wikipedia.org/wiki/Registro_de_Windows#:~:text=HKEY_CURRENT_USER%2C%20abreviado%20como%20HKCU%2C%20almacena,misma%20informaci%C3%B3n%20en%20ambas%20ubicaciones.)
- [Registry hive basics part 2: NK records - Binary Foray](https://binaryforay.blogspot.com/2015/01/registry-hive-basics-part-2-nk-records.html)
- [Activar el inicio de sesión automático en Windows - Microsoft Docs](https://docs.microsoft.com/es-es/troubleshoot/windows-server/user-profiles-and-logon/turn-on-automatic-logon)
- [Execute "reg query" as a new process does not display all keys - Stack Overflow](https://stackoverflow.com/questions/9433928/execute-reg-query-as-a-new-process-does-not-display-all-keys)
- [Redirector del Registro - Microsoft Docs](https://docs.microsoft.com/es-es/windows/win32/winprog64/registry-redirector?redirectedfrom=MSDN)
- [CMDKEY.exe - SS64 Command Line Reference](https://ss64.com/nt/cmdkey.html)
- [Answer Files Overview - Microsoft Docs](https://docs.microsoft.com/en-us/windows-hardware/customize/desktop/wsim/answer-files-overview#:~:text=An%20answer%20file%20is%20an,to%20use%20during%20Windows%20Setup.&text=You%20can%20also%20specify%20values,xml.)
- [Stored Credentials - PentestLab](https://pentestlab.blog/2017/04/19/stored-credentials/)
- [Windows Privilege Escalation for OSCP & Beyond - Udemy](https://www.udemy.com/course/windows-privilege-escalation/)
- [Windows-PrivEsc-Setup - GitHub Repository](https://github.com/Tib3rius/Windows-PrivEsc-Setup)
