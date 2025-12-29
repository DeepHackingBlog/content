---
id: "que-es-un-servicio-en-windows"
title: "Qué es un servicio en Windows"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-12-22
updatedDate: 2021-12-22
image: "https://cdn.deephacking.tech/i/posts/que-es-un-servicio-en-windows/que-es-un-servicio-en-windows-0.webp"
description: "Aprende qué son los servicios de Windows, cómo funcionan, los diferentes tipos de escaladas de privilegios relacionados con servicios y las técnicas de enumeración con accesschk.exe."
categories:
  - "windows"
draft: false
featured: false
lang: "es"
---

Los servicios en Windows (anteriormente conocidos como servicios NT), permiten crear acciones/programas de larga ejecución que se ejecutan en sesiones propias de Windows. Los servicios pueden iniciarse automáticamente al encender el equipo, pueden detenerse o iniciarse manualmente, y, en cualquier caso, no muestran una interfaz gráfica, todo se hace en segundo plano.

Los servicios se pueden ejecutar en el contexto de otro usuario distinto al o los que hayan iniciado sesión en el equipo.

Con esta última frase, pensándolo desde la perspectiva de un atacante ya nos puede llamar la atención esta característica de Windows de cara a una posible escalada de privilegios. Si un servicio está mal configurado y lo ejecuta por ejemplo el usuario `nt authority\system`, quizás podemos aprovecharnos para inyectar acciones suplantando a este usuario (o el usuario que lo ejecute).

Índice:

- [Tipos de Escaladas de Privilegios](#tipos-de-escaladas-de-privilegios)
- [Enumeración usando accesschk.exe](#enumeración-usando-accesschkexe)
- [Cómo reiniciar servicios](#cómo-reiniciar-servicios)
- [Referencias](#referencias)

## Tipos de Escaladas de Privilegios

Existen diversas escaladas de privilegios conocidas que están relacionadas con los servicios de Windows:

- Insecure Service Permissions
- Unquoted Service Path
- Weak Registry Permissions
- Insecure Service Executables
- DLL Hijacking

Todas estas posibles escaladas están basadas en malas configuraciones que se pueden encontrar en el equipo Windows. Ahora bien, ninguna de estas escaladas servirá aunque exista esa mala configuración, si no tenemos la capacidad de:

- Iniciar, detener o reiniciar el servicio
- Reiniciar el equipo Windows (suponiendo que el servicio vulnerable se inicie al iniciar el equipo)

Por lo que no hay que caer en la trampa de que si encontramos cualquiera de estas posibles malas configuraciones, podremos aprovecharlas. Todo dependerá de si somos capaces de realizar cualquiera de las dos últimas acciones mencionadas.

Ahora vamos a ver como podemos enumerar los permisos, configuraciones de un servicio, archivo y directorio.

## Enumeración usando accesschk.exe

Accesschk es una herramienta de línea de comandos que pertenece al kit de tools de Windows Sysinternals, por lo que es del propio Microsoft. Te permite ver qué tipo de accesos tienen usuarios o grupos específicos a recursos como archivos, directorios, claves del Registro, objetos globales y servicios Windows. Se puede descargar desde la [documentación oficial](https://docs.microsoft.com/es-es/sysinternals/downloads/accesschk).

La estructura de accesschk es la siguiente:

`accesschk.exe [opciones] [usuario o grupo] <nombre de objeto>`

Sabiendo esto, vamos a ver algunos comandos concretos que nos pueden ser útiles:

### Ver permisos que tiene cierto usuario sobre un servicio

`accesschk.exe /accepteula -ucqv <usuario> <servicio>`

Explicación de argumentos:

- `/accepteula` –> cuando ejecutamos una herramienta de Windows Sysinternals, la primera vez que lo hacemos suele salir una ventana gráfica de aceptar términos y demás. Para no tener problemas desde nuestra shell, añadiendo directamente este argumento aceptamos los términos desde la propia consola
- `u` –> Indicamos que no enseñe los errores si los hubiese
- `c` –> Indicamos que el `<nombre de objeto>` representa un servicio de Windows
- `q` –> Quitamos el banner de la herramienta del output
- `v` –> Típico verbose de cualquier herramienta (mostrar información más detallada)

![Ejemplo de permisos del usuario sobre el servicio daclsvc mostrando capacidad de editar, iniciar y detener](https://cdn.deephacking.tech/i/posts/que-es-un-servicio-en-windows/que-es-un-servicio-en-windows-1.avif)

En este ejemplo podemos ver como el usuario `user`, tiene la capacidad en el servicio `daclsvc` de:

- Editar la configuración del servicio
- Iniciar el servicio
- Detener el servicio

De esta forma, identificaríamos permisos los cuales nos pueden venir bien saber para determinar alguna posible explotación.

### Ver permisos de escritura en un directorio

`accesschk.exe /accepteula -uwdq <directorio>`

Explicación de argumentos:

- `/accepteula` –> cuando ejecutamos una herramienta de Windows Sysinternals, la primera vez que lo hacemos suele salir una ventana gráfica de aceptar términos y demás. Para no tener problemas desde nuestra shell, añadiendo directamente este argumento aceptamos los términos desde la propia consola
- `u` –> Indicamos que no enseñe los errores si los hubiese
- `w` –> Enseña solo los permisos que contengan escritura
- `d` –> Indicamos que el objeto es una carpeta. Y que nos interesa los permisos de este objeto y no los de su contenido
- `q` –> Quitamos el banner de la herramienta del output

![Resultado de accesschk mostrando permisos de escritura del grupo BUILTIN Users en un directorio](https://cdn.deephacking.tech/i/posts/que-es-un-servicio-en-windows/que-es-un-servicio-en-windows-2.avif)

De esta manera, podemos ver como todos los usuarios (`BUILTIN\Users`) tienen capacidad de escritura sobre el directorio especificado, lo que nos podría servir para aprovecharnos de alguna mala configuración.

### Comprobar los permisos de un registro

`accesschk.exe /accepteula -uvwqk HKLM\System\CurrentControlSet\Services\regsvc`

Explicación de argumentos:

- `/accepteula` –> cuando ejecutamos una herramienta de Windows Sysinternals, la primera vez que lo hacemos suele salir una ventana gráfica de aceptar términos y demás. Para no tener problemas desde nuestra shell, añadiendo directamente este argumento aceptamos los términos desde la propia consola
- `u` –> Indicamos que no enseñe los errores si los hubiese
- `v` –> Típico verbose de cualquier herramienta (mostrar información más detallada)
- `w` –> Enseña solo los permisos que contengan escritura
- `q` –> Quitamos el banner de la herramienta del output
- `k` --> Indicamos que el `<nombre de objeto>` representa un registro

![Permisos del grupo INTERACTIVE en el registro mostrando capacidad de escritura](https://cdn.deephacking.tech/i/posts/que-es-un-servicio-en-windows/que-es-un-servicio-en-windows-3.avif)

En este caso, gracias a accesschk podemos saber que el grupo `INTERACTIVE` tiene permisos de escritura en el registro. En este grupo se encuentran todos los usuarios que alguna vez se han logueado en la máquina de forma local, por lo que es muy probable que cualquier usuario pertenezca a este grupo.

Sabiendo esto, en este caso hemos podido comprobar que tenemos capacidad de escritura sobre este registro, lo que nos podría ser de utilidad.

OJOO, como curiosidad, todos los servicios en Windows, se encuentran en la ruta:

`HKLM\System\CurrentControlSet\Services\<nombre del servicio>`

### Ver si tenemos permisos de escritura sobre un ejecutable

`accesschk.exe /accepteula -quvw <ejecutable>`

Explicación de argumentos:

- `/accepteula` –> cuando ejecutamos una herramienta de Windows Sysinternals, la primera vez que lo hacemos suele salir una ventana gráfica de aceptar términos y demás. Para no tener problemas desde nuestra shell, añadiendo directamente este argumento aceptamos los términos desde la propia consola
- `q` –> Quitamos el banner de la herramienta del output
- `u` –> Indicamos que no enseñe los errores si los hubiese
- `v` –> Típico verbose de cualquier herramienta (mostrar información más detallada)
- `w` –> Enseña solo los permisos que contengan escritura

![Permisos de escritura sobre un ejecutable para todos los usuarios](https://cdn.deephacking.tech/i/posts/que-es-un-servicio-en-windows/que-es-un-servicio-en-windows-4.avif)

De esta forma, podemos ver como todos los usuarios tienen capacidad de escritura sobre el archivo especificado. Lo que nos puede ser muy útil para sustituirlo y aprovecharnos de alguna manera.

Accesschk.exe es una herramienta muy útil para enumerar información que nos puede ser muy útil saber para los diferentes tipos de escaladas relacionadas con servicios de Windows. En cualquier caso, se verá mejor su uso práctico en cada post de las diferentes escaladas.

## Cómo reiniciar servicios

Como se ha mencionado previamente, en todas las escaladas relacionadas con los servicios de Windows, un requisito infalible es la capacidad de iniciar, detener o reiniciar un servicio (sin contar el reiniciar directamente el equipo para un servicio que inicie al arrancar). Una vez ya sabemos que tenemos los privilegios para hacerlo, existen distintas formas para llevarlo a cabo:

### net

Podemos iniciar un servicio mediante:

`net start <nombre del servicio>`

De la misma forma, podemos pararlo con:

`net stop <nombre del servicio>`

También podemos usar `net` para listar todos los servicios que se estén ejecutando:

`net start`

### sc

`sc` (Service Controller) es un programa de línea de comandos usado para la comunicación con el Windows Service Controller and installed services.

Podemos iniciar un servicio con:

`sc start <nombre del servicio>`

Y pararlo con:

`sc stop <nombre del servicio>`

Como dato extra, con `sc` podemos:

#### Comprobar configuración actual del servicio

`sc qc <servicio>`

Ejemplo:

![Configuración de un servicio de Windows mostrada con el comando sc qc](https://cdn.deephacking.tech/i/posts/que-es-un-servicio-en-windows/que-es-un-servicio-en-windows-5.avif)

#### Comprobar estado actual del servicio

`sc query <servicio>`

![Estado actual de un servicio mostrado con el comando sc query](https://cdn.deephacking.tech/i/posts/que-es-un-servicio-en-windows/que-es-un-servicio-en-windows-6.avif)

### Powershell

Desde powershell podemos usar un cmdlet para reiniciar servicios:

`Restart-Service <nombre servicio> -Force`

De la misma forma, existen cmdlets para iniciar y detener un servicio:

- `Start-Service`
- `Stop-Service`

La sintaxis es sencilla: `<cmdlet> <nombre del servicio>`. Aunque también se puede usar el argumento `-Name` para referirse al servicio:

- `Start-Service -Name <nombre del servicio>`
- `Stop-Service -Name <nombre del servicio>`

## Referencias

- [Introducción a las aplicaciones de servicios de Windows en Microsoft Learn](https://docs.microsoft.com/es-es/dotnet/framework/windows-services/introduction-to-windows-service-applications)
- [Curso Windows Privilege Escalation for OSCP & Beyond en Udemy](https://www.udemy.com/course/windows-privilege-escalation/)
- [Repositorio Windows-PrivEsc-Setup en GitHub](https://github.com/Tib3rius/Windows-PrivEsc-Setup)
- [Grupo Interactive en TechNet Forums](https://social.technet.microsoft.com/Forums/windows/en-US/899f5b73-f762-4b1a-b54f-6910d3c47621/interactive-group?forum=winserversecurity)
- [Windows Sysinternals Administrator's Reference Security Utilities en Microsoft Press Store](https://www.microsoftpressstore.com/articles/article.aspx?p=2224373&seqNum=2)
