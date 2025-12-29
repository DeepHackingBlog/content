---
id: "como-cargarse-windows-defender-sin-querer"
title: "Cómo cargarse Windows Defender (y explorer.exe sin querer)"
author: "daniel-monzon"
publishedDate: 2022-11-21
updatedDate: 2022-11-21
image: "https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-0.webp"
description: "Proceso técnico que llevó a provocar un crash en explorer.exe e inutilizar Windows Defender mediante la suspensión de procesos protegidos en Windows"
categories:
  - "windows"
draft: false
featured: false
lang: "es"
---

En este post voy a contar el proceso que me llevó a provocar un crash en `explorer.exe` e inutilizar Windows Defender.

Bueno, pues resulta que estaba leyendo sobre los tipos de acceso que se pueden pedir al intentar abrir un handle a un proceso con la función _[OpenProcess](https://learn.microsoft.com/es-es/windows/win32/api/processthreadsapi/nf-processthreadsapi-openprocess)_ de la API de Windows. Para quien no lo sepa, en Windows un handle es un identificador necesario para poder acceder a un objeto.

Ahora bien, ¿qué es un objeto?, pues igual que se dice que en Linux todo es un fichero, en Windows, todo es un objeto, por ejemplo, un proceso en Windows se representa con el objeto _[EPROCESS](https://www.geoffchappell.com/studies/windows/km/ntoskrnl/inc/ntos/ps/eprocess/index.htm)_. Esta sería la definición de un objeto en Windows, más información de lo mencionado en:
- _[Documentación Oficial de Handles y Objetos en Windows](https://learn.microsoft.com/es-es/windows/win32/sysinfo/handles-and-objects)_
- _[Documentación Oficial de tipos de acceso a procesos en Windows](https://learn.microsoft.com/en-us/windows/win32/procthread/process-security-and-access-rights)_

En resumen, no se puede acceder directamente a un objeto sin un handle. Así es como se representa un handle (identificador) en el libro de _[Windows System Programming parte 1 de Pavel Yosifovich](https://www.amazon.es/Windows-10-System-Programming-Part/dp/B08X63B6VP)_:

![Representación de un handle en Windows](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-1.avif)

Hay muchas formas de ver los handles que tiene abierto un proceso, una sería con _[Process Explorer](https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer)_ o _[Handle](https://learn.microsoft.com/en-us/sysinternals/downloads/handle)_ (tools de la suite Sysinternals), con WinDbg, etc.

Volviendo al tema, leyendo sobre los protected processes (Procesos Protegidos), leí esto:

<figure>

![Derechos de acceso prohibidos desde procesos normales a procesos protegidos](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-2.avif)

<figcaption>

_[Documentación oficial de derechos de acceso y seguridad de procesos](https://learn.microsoft.com/en-us/windows/win32/procthread/process-security-and-access-rights)_

</figcaption>

</figure>

De todos los derechos de acceso que se prohíben desde procesos normales a procesos protegidos, vi que había varios que no están permitidas. Entonces, conociendo todos los tipos de derechos de acceso que existen, por simple omisión deberían estar permitidos los siguientes:
- `SYNCHRONIZE`: _[Derecho de acceso SYNCHRONIZE](https://helgeklein.com/blog/what-is-the-synchronize-file-access-right/)_
- `PROCESS_SUSPEND_RESUME`: _[Suspensión de procesos en Windows](https://j00ru.vexillium.org/2009/08/suspending-processes-in-windows/)_
- `PROCESS_QUERY_LIMITED_INFORMATION`: _[Entendiendo el robo de tokens de acceso](https://posts.specterops.io/understanding-and-defending-against-access-token-theft-finding-alternatives-to-winlogon-exe-80696c8a73b)_

Tanto `SYNCHRONIZE` como `PROCESS_QUERY_LIMITED_INFORMATION` no iban a llevarnos a mucho, así que me centré en `PROCESS_SUSPEND_RESUME`.

Esto de los procesos protegidos esencialmente impide que incluso siendo administrador puedas tocar lo que no debes. Muchos procesos de sistema y casi todos los antivirus y EDRs tienen sus procesos y servicios como protegidos, y Defender no es la excepción.

Estos son todos los procesos protegidos que hay en una máquina virtual con Windows visto desde _[WinDbg](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/debugger-download-tools)_ con debugging local de kernel:

![Procesos protegidos en Windows desde WinDbg](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-3.avif)

Y aquí vemos cómo el servicio de Defender y el proceso son efectivamente objetos protegidos:

<figure>

![Servicio de Windows Defender como proceso protegido](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-4.avif)

<figcaption>

En el caso de Windows Defender, el proceso se llama `MsMpEng.exe` y el servicio que ejecuta este proceso es `windefend`

</figcaption>

</figure>

![Proceso de Windows Defender protegido](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-5.avif)

Así que me puse a investigar cómo suspender un proceso de manera programática y resultó que se podía hacer con _[NtSuspendProcess](http://pinvoke.net/default.aspx/ntdll.NtSuspendProcess)_. Al no estar esta función presente en la API de Windows, sabiendo que empieza por Nt sabemos que debe estar en `ntdll.dll` (esta DLL tiene la Native API y es la que se utiliza en todos los procesos de Windows para comunicarse con el kernel).

Sabiendo esto, procedemos a buscar cómo llamar a esta función, sus argumentos, etc. Usando el enlace del párrafo anterior como referencia, definimos la función de `NtSuspendProcessFn`, requiriendo como argumento un handle a un proceso:

![Definición de la función NtSuspendProcessFn](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-6.avif)

`NtSuspendProcess` en NTDLL solo es un wrapper para la función real, que está en el kernel (`ntoskrnl.exe`), que tiene esta pinta al abrirla en IDA:

![Función NtSuspendProcess en IDA](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-7.avif)

Las funciones en Windows normalmente acaban necesitando de DLLs como `kernel32.dll` o `advapi32.dll`, las cuales a su vez usan las funciones de la Native API (en `ntdll`), y finalmente desde esas funciones se hacen las syscalls que permiten ejecutar código en kernel mode:

![Flujo de llamadas desde user mode a kernel mode](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-8.avif)

> Nota: este dibujo es una simplificación del proceso, dejo un enlace en las referencias a un post donde se detalla todo el proceso.

Siguiendo con el tema, la función para suspender procesos quedó tal que así:

![Implementación de la función para suspender procesos](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-9.avif)

Esencialmente, lo que se hace es abrir un handle al módulo `ntdll.dll` que tendrá este proceso en memoria cuando sea ejecutado (todos los procesos lo tienen, como ya he mencionado antes) y con _[GetProcAddress](https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getprocaddress)_ se buscará la dirección de memoria de la función `NtSuspendProcess` que está en la _[EAT (Export Address Table)](https://learn.microsoft.com/en-us/archive/msdn-magazine/2002/march/inside-windows-an-in-depth-look-into-the-win32-portable-executable-file-format-part-2)_ de `ntdll.dll`.

También hará falta incluir estas headers:

![Headers necesarios para el código](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-10.avif)

> _[Diferencias entre headers y librerías](https://www.geeksforgeeks.org/difference-header-file-library/)_

Y usar esta función para encontrar el PID del proceso cuyo nombre demos como argumento a la función. La función crea un snapshot de todos los procesos usando _[CreateToolhelp32Snapshot](https://learn.microsoft.com/en-us/windows/win32/api/tlhelp32/nf-tlhelp32-createtoolhelp32snapshot)_ y va iterando sobre la estructura que devuelve esta función y va comparando el campo _[szExeFile](https://learn.microsoft.com/en-us/windows/win32/api/tlhelp32/ns-tlhelp32-processentry32)_ de cada entrada correspondiente a cada proceso con el nombre de proceso que nosotros le hemos pasado. Y finalmente si corresponde el nombre del ejecutable del snapshot con el que nosotros queremos, se devuelve el PID del proceso que nos interesa:

![Función para encontrar el PID por nombre de proceso](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-11.avif)

Al intentar hacer una prueba me dio acceso denegado (error 5):

![Error de acceso denegado](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-12.avif)

Así que añadí una función para activar el privilegio `SeDebugPrivilege` en el access token del proceso (eso sí, ese privilegio ya debe estar ahí, es decir, que esto solo funciona si lanzamos nuestra PoC con permisos de administrador).

> Para los que no sepan que es un access token, es una estructura que contiene información sobre los privilegios que tiene un proceso o un hilo y que se utiliza para acceder a una serie de recursos. Por ponerlo más sencillo, podemos ver los privilegios que vienen incluidos en el access token de `cmd.exe` cuando nosotros hacemos `whoami /priv` (ya que el proceso de `whoami.exe` se crea con los mismos privilegios que tiene el `cmd.exe`). El `SeDebugPrivilege` en concreto, se utiliza por parte tanto de debuggers como incluso de tools ofensivas como es el caso de mimikatz cuando hacemos el famoso `privilege::debug`.

La función completa para habilitar este privilegio es un poco larga, así que vamos a saltárnosla para ir directamente a la main, que se queda tal que así:

![Función main del programa](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-13.avif)

Así que, recapitulando, lo que vamos a hacer es:
1. Identificar el PID del proceso de Defender
2. Abrir un handle al access token de nuestro proceso
3. Habilitar el privilegio `SeDebugPrivilege`
4. Abrir un handle al proceso de Defender con el acceso `PROCESS_SUSPEND_RESUME`
5. Llamar a `NtSuspendProcess` para ver qué ocurre

Y una vez lanzado, el proceso de Defender se queda en estado suspendido y para más sorpresas, resulta que el entorno gráfico se cuelga (`explorer.exe`), la única ventana que funciona es la del propio cmd. Quería comprobar que de verdad estuviera suspendido, pero como no tenía herramientas gráficas, usé una tool llamada _[DTrace](https://learn.microsoft.com/es-es/windows-hardware/drivers/devtest/dtrace)_. Es una tool open-source que tiene una versión para Windows y tiene esta arquitectura:

![Arquitectura de DTrace en Windows](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-14.avif)

Escribiendo scripts en D, se pueden hacer cosas como la que nos interesa ahora, loggear las syscalls hechas por el proceso, y, curiosamente después de un rato sin hacer syscalls (lo que es de suponer en un proceso suspendido), de repente `MsMpEng.exe` empezó a hacer syscalls, no está claro el por qué, aunque puede ser que esto sea por algún driver que esté haciendo algo con el proceso de Defender que nosotros no vemos.

Este es el script en D que usé para loggear las syscalls de ese proceso:

![Script en D para loggear syscalls](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-15.avif)

Así es como se ve antes de suspender el proceso:

![Syscalls del proceso antes de suspender](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-16.avif)

Y así es como se ve un rato después (al principio no efectúa ninguna syscall):

![Syscalls del proceso después de suspender](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-17.avif)

Reiniciando la máquina, en Eventviewer revisando los eventos recientes vemos que se ha producido un evento 1002 (cuelgue de aplicación) en `explorer.exe`:

![Evento 1002 en Eventviewer mostrando el crash de explorer.exe](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-18.avif)

Inicialmente pensé que habría algún handle abierto desde `MsMpEng` a `explorer`, sin embargo, al ver los handles de `MsMpEng` no vi handles a `explorer.exe`

> Nota: Este PID (5004) es en mi máquina anfitrión, en la máquina virtual es 3068, o bfc en hexadecimal

![Handles del proceso MsMpEng](https://cdn.deephacking.tech/i/posts/como-cargarse-windows-defender-sin-querer/como-cargarse-windows-defender-sin-querer-19.avif)

Únicamente había handles a sí mismo, así que puede que no sea por eso. Le dediqué algo de tiempo a intentar averiguar el motivo del crasheo de explorer, aunque no saqué nada en claro. Así que por el momento lo dejo aquí por si alguien quiere profundizar más.

Y en conclusión, así es como nos cargamos Defender :D (eso si, con privs de admin).

> Nota: cuando tenga un rato, publicaré la tool para que podáis trastear.

## Referencias
- _[Reversing Windows Internals (Part 1) - Digging Into Handles, Callbacks & ObjectTypes](https://rayanfam.com/topics/reversing-windows-internals-part1/)_
- _[Backstab - A tool to kill antimalware protected processes](https://github.com/Yaxser/Backstab)_
- _[Windows 10 System Programming, Part 1](https://www.amazon.es/Windows-10-System-Programming-Part/dp/B086Y6M7LH/)_
- _[DTrace en Windows](https://learn.microsoft.com/es-es/windows-hardware/drivers/devtest/dtrace)_
- _[Anatomy of the thread suspension mechanism in Windows (Windows Internals)](https://ntopcode.wordpress.com/2018/01/16/anatomy-of-the-thread-suspension-mechanism-in-windows-windows-internals/)_
- _[A Syscall Journey in the Windows Kernel](https://alice.climent-pommeret.red/posts/a-syscall-journey-in-the-windows-kernel/)_
