---
id: "escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths"
title: "Escalada de Privilegios en Windows a través de Unquoted Service Paths"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-12-14
updatedDate: 2021-12-14
image: "https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-0.webp"
description: "Aprende a identificar y explotar servicios de Windows con rutas no entrecomilladas para escalar privilegios mediante técnicas de Unquoted Service Path."
categories:
  - "windows"
draft: false
featured: false
lang: "es"
---

Cuando se inicia un servicio, Windows busca el ejecutable correspondiente para que el servicio se pueda iniciar con éxito. La ruta del ejecutable puede estar guardada de dos formas:

- Entre comillas
- Sin comillas

De la primera forma, el sistema sabe exactamente donde está el ejecutable, sin embargo, en la segunda, si a lo largo de toda la ruta del ejecutable se encuentra entre medio carpetas que tengan algún nombre con espacios, Windows hace un proceso del cual quizás nos podamos aprovechar.

Índice:

- [Introducción](#introducción)
- [Enumeración](#enumeración)
- [Ejemplo de Explotación](#ejemplo-de-explotación)
- [Referencias](#referencias)

Nota: antes de seguir, recomiendo leer el post de: [¿Qué es un servicio en Windows? - Privilege Escalation](https://blog.deephacking.tech/es/posts/que-es-un-servicio-en-windows/)

## Introducción

Por ejemplo, imaginémonos que existe un servicio X el cual tiene asignado su ejecutable en la siguiente ruta:

`C:\Windows\Program Files\CleanUp\Common Files\clean.exe`

Teniendo en cuenta que el servicio lo tiene establecido sin comillas, y, por tanto, no de forma absoluta. Quien le dice a Windows que el ejecutable no podría ser perfectamente:

`C:\Windows\Program.exe`

Y que se le pasa como argumentos:

`Files\CleanUp\Common`

`Files\clean.exe`

O que el ejecutable fuese:

`C:\Windows\Program Files\CleanUp\Common.exe`

Con argumento:

`Files\clean.exe`

La idea básicamente es esta. Algunos programas reciben los argumentos tal que:

`programa.exe argumento1 argumento2 argumento3...`

Por lo que Windows, al no tener comillas, no sabe si está ocurriendo esto. Por ello, cada vez que se encuentra un espacio en el PATH, lo separa entre: `<ejecutable>` `<argumentos>`. En este caso, lo primero que haría Windows sería tomarlo tal que:

`C:\Windows\Program Files\CleanUp\Common Files\clean.exe`

Ejecutable: `C:\Windows\Program.exe`

Argumento 1: `Files\CleanUp\Common`

Argumento 2: `Files\clean.exe`

Y así continuamente.

Conociendo ya como Windows busca el ejecutable. Que ocurre si nosotros tuviésemos permisos de escritura en alguna de estas carpetas con espacios. Es decir, si en este caso, nosotros tuviéramos permisos de escritura en la carpeta "CleanUp". Podríamos crear un ejecutable malicioso llamado `common.exe`, de tal forma que Windows cuando llegue a esa carpeta (llegará, ya que que no encontrará un `program.exe` dentro de "Program Files") ejecutará nuestro ejecutable malicioso. Puesto que lo entenderá de la forma que vimos previamente:

Ejecutable: `C:\Windows\Program Files\CleanUp\Common.exe`

Argumento: `Files\clean.exe`

Ojo, no tenemos que caer en la trampa de que si encontramos un "Unquoted Service Path", ya podremos aprovecharnos con éxito. No sirve de nada que podamos escribir en cualquier directorio si no tenemos la capacidad de:

- Reiniciar o detener e iniciar el servicio
- Reiniciar el equipo Windows (solo en el caso de que se trate de un servicio que inicie con el sistema)

Ya que si no somos capaces de hacer esto, nunca se iniciará el servicio, y, por tanto, nunca se ejecutará nuestro ejecutable malicioso.

## Enumeración

##### Manual

WMIC (Windows Management Instrumentation Command-line) es una herramienta de administración para Windows que permite no solo obtener información, sino realizar acciones.

Podemos listar los servicios que tengan asignado un path sin comillas con el siguiente comando:

`wmic service get name,displayname,pathname,startmode | findstr /i /v "C:\Windows\\" | findstr /i /v """`

- Con `wmic` como vemos, estamos obteniendo información del servicio, en este caso el nombre, la ruta y el modo de inicio (si se inicia al encender el sistema)
- El parámetro `/i` de `findstr` sirve para ignorar si es mayúscula o minúscula.
- El parámetro `/v` de `findstr` sirve para que solo imprima las líneas que no coincidan con el match.
- Sabiendo esto, las dos veces que se utiliza `findstr` son para:
    - Ignorar los servicios que se encuentren en la carpeta `C:\Windows`
    - Ignorar los servicios que estén entre comillas (dobles)

Además de `wmic`, así de forma manual, si nos interesa un servicio en concreto, podemos ver la ruta del ejecutable en el siguiente registro:

`HKLM\SYSTEM\CurrentControlSet\Services\<nombre del servicio>`

El comando sería:

`reg query HKLM\SYSTEM\CurrentControlSet\Services\<nombre del servicio>`

##### Powersploit (PowerUp.ps1)

Powersploit tiene una función la cual nos sirve para enumerar servicios que tengan un "Unquoted Service Path" y un espacio en alguna carpeta. Una vez tenemos PowerUp.ps1 cargado en la powershell, podemos hacer uso del siguiente cmdlet:

`Get-UnquotedService`

De esta forma, se nos listaría los servicios que cumplan con estos requisitos.

Podemos descargar el script desde el [repositorio de Powersploit en GitHub](https://github.com/PowerShellMafia/PowerSploit/blob/master/Privesc/PowerUp.ps1).

##### WinPEAS

WinPEAS es una herramienta muy buena para enumerar muchísimas cosas de Windows lanzándolo sin ningún argumento. Sin embargo, también permite ejecutarse con un argumento que le especifique que buscar exactamente, o en que centrarse. Con el siguiente comando, le indicamos que se centre en enumerar servicios, lo que incluye, que busque "Unquoted Service Paths":

`winpeas.exe quiet servicesinfo`

Se puede consultar los posibles argumentos de WinPEAS en su [repositorio oficial en GitHub](https://github.com/carlospolop/PEASS-ng/blob/master/winPEAS/winPEASexe/README.md).

##### Metasploit

Metasploit no iba a ser menos, también tiene un módulo post explotación que nos permite enumerar esto, se trataría del siguiente:

- `exploit/window/local/trusted_service_path`

## Ejemplo de Explotación

Para el ejemplo de explotación, voy a usar el script de Tib3rius que podéis encontrar en su [repositorio Windows-PrivEsc-Setup en GitHub](https://github.com/Tib3rius/Windows-PrivEsc-Setup). Este script te configura un Windows 10 con distintas malas configuraciones.

Con esto claro, lo primero que haríamos sería enumerar en busca de un servicio que tenga el path de su ejecutable sin comillas, para esto, se puede usar cualquiera de las formas vistas previamente. En este caso voy a usar `wmic` quitando algún que otro campo para que el output no sea tan largo y se vea mejor:

`wmic service get name,pathname | findstr /i /v "C:\Windows\" | findstr /i /v """`

![Resultado del comando wmic mostrando servicio con Unquoted Service Path](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-1.avif)

Vemos que en este caso existe un servicio cuyo ejecutable está definido en esa ruta y sin comillas, además, contiene carpetas cuyos nombres contiene espacios. Sabiendo esto, ahora debemos de comprobar dos cosas:

- Si podemos reiniciar o detener e iniciar el servicio
- Si tenemos permisos de escritura en alguna de esas carpetas

Para ambas tareas, podemos usar el ejecutable de "accesschk". Es una herramienta que nos ayudará a ver qué tipo de accesos tienen usuarios o grupos específicos a recursos como archivos, directorios, claves del Registro, objetos globales y servicios Windows. Se puede descargar desde la [documentación oficial de AccessChk](https://docs.microsoft.com/es-es/sysinternals/downloads/accesschk).

La estructura de accesschk es la siguiente:

`accesschk.exe [opciones] [usuario o grupo] <nombre de objeto>`

Sabiendo esto, podemos ver los permisos que tiene un usuario (o grupo) sobre un servicio usando el siguiente comando:

`accesschk.exe /accepteula -ucqv <usuario> <servicio>`

Explicación de los argumentos:

- `/accepteula` --> cuando ejecutamos una herramienta de Windows Sysinternals, la primera vez que lo hacemos suele salir una ventana gráfica de aceptar términos y demás. Para no tener problemas desde nuestra shell, añadiendo directamente este argumento aceptamos los términos desde la propia consola.
- `u` --> Indicamos que no enseñe los errores si los hubiese
- `c` --> Indicamos que el `<nombre de objeto>` representa un servicio de Windows.
- `q` --> Quitamos el banner de la herramienta del output
- `v` --> Típico verbose de cualquier herramienta (mostrar información más detallada)

Conociendo que estamos haciendo, ejecutamos el comando:

![Resultado de accesschk mostrando permisos sobre el servicio](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-2.avif)

Y si nos fijamos, tenemos la capacidad de detener e iniciar el servicio.

Ahora tenemos que confirmar que tengamos la capacidad de escribir en alguno de los directorios:

Directorio completo: `C:\Program Files\Unquoted Path Service\Common Files\unquotedpathservice.exe`

Ejecutables que buscará Windows:

- `C:\Program.exe`
- `C:\Program Files\Unquoted.exe`
- `C:\Program Files\Unquoted Path Service\Common.exe`

Por lo tanto, los directorios los cuales queremos ver si tenemos permisos de escritura, son:

- `C:\`
- `C:\Program Files`
- `C:\Program Files\Unquoted Path Service`

De nuevo, para verlo, vamos a usar accesschk. En este caso el comando para ver los permisos de una carpeta, sería el siguiente:

`accesschk.exe /accepteula -uwdq <carpeta>`

Explicación de los argumentos:

- `w` --> Enseña solo los permisos que contengan escritura.
- `d` --> Indicamos que el objeto es una carpeta. Y que nos interesa los permisos de este objeto y no los de su contenido.

De esta forma, miramos los permisos en los tres directorios que hemos indicado arriba:

![Verificación de permisos de escritura en directorios usando accesschk](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-3.avif)

Si nos damos cuenta, tenemos permisos de escritura en:

- `C:\Program Files\Unquoted Path Service`

Por lo que cumplimos los dos requisitos que hacian falta, tenemos capacidad de detener e iniciar el servicio, y tenemos permiso de escritura en una de las carpetas.

En este punto, vamos preparamos un simple payload con msfvenom:

![Generación de payload malicioso con msfvenom](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-4.avif)

Desde ya, le hemos puesto el nombre que nos interesa, en este caso, `common.exe`. Ya que es el ejecutable que intentará ejecutar Windows. Ahora, simplemente descargamos el payload en el directorio "Unquoted Path Service".

![Descarga del payload en el directorio vulnerable](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-5.avif)

Con esto hecho, ya está todo listo. Nos ponemos en escucha:

![Listener de Netcat en espera de conexión](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-6.avif)

Y ahora, iniciamos el servicio (no lo detenemos porque no estaba iniciado):

![Inicio del servicio vulnerable y obtención de shell como SYSTEM](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-7.avif)

Se ejecuta nuestro payload y obtenemos shell como el usuario que ejecuta el servicio, en este caso nt authority\\system (aunque nosotros tengamos el privilegio de iniciarlo o detenerlo, no quiere decir que seamos nosotros los que lo ejecutemos).

Nota, podemos ver el estado de un servicio usando por ejemplo `sc` (o usando el cmdlet de powershell `Get-Service -Name <servicio>`):

`sc query <nombre del servicio>`

![Consulta del estado del servicio usando sc query](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-8.avif)

También podríamos ver que usuario inicia el servicio, con el comando:

`sc qc <servicio>`

![Consulta de configuración del servicio mostrando el usuario que lo ejecuta](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-9.avif)

En este caso, localsystem (nt authority\\system).

Nótese también, como, para referirnos al servicio en cualquier caso. Usamos el "name" y no el "displayname":

<figure>

![Diferencia entre name y displayname de un servicio](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths/escalada-de-privilegios-en-windows-a-traves-de-unquoted-service-paths-10.avif)

<figcaption>

Izquierda es displayname, derecha es name

</figcaption>

</figure>

Esto último lo comento por si haces uso del comando completo de `wmic` puesto al principio:

`wmic service get name,displayname,pathname,startmode | findstr /i /v “C:\Windows\\” | findstr /i /v “””`

El cual te muestra ambos nombres.

## Referencias

- [Documentación sobre el flag accepteula de AccessChk](https://xor.cat/2017/09/05/sysinternals-accesschk-accepteula/#:~:text=1%20minute%20read,auditing%20privileges%20on%20others'%20systems.)
- [Windows Sysinternals Administrator's Reference: Security Utilities](https://www.microsoftpressstore.com/articles/article.aspx?p=2224373&seqNum=2)
- [Curso Windows Privilege Escalation for OSCP & Beyond en Udemy](https://www.udemy.com/course/windows-privilege-escalation/)
