---
id: "anatomia-del-formato-portable-executable"
title: "Anatomía del formato Portable Executable (PE)"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-10-29
updatedDate: 2024-10-29
image: "https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-0.webp"
description: "Descubre la estructura interna del formato PE de Windows: encabezados DOS, NT Headers, secciones y directorios de datos para desarrollo y análisis de malware."
categories:
  - "windows"
draft: false
featured: false
lang: "es"
---

En los sistemas Windows podemos encontrar infinidad de extensiones, aunque principalmente destaquen .exe, .dll, .sys, entre otras. Todas estas extensiones tienen algo en común: siguen el formato PE (Portable Executable). El formato PE es el estándar que utiliza Windows para los archivos ejecutables y las bibliotecas de enlace dinámico (DLLs), permitiendo que el sistema cargue y ejecute programas de manera eficiente.

Este formato es una extensión del formato COFF, que originalmente fue desarrollado para almacenar archivos objeto en sistemas Unix. Microsoft adaptó y extendió COFF para crear el formato PE con el fin de manejar las necesidades específicas de los ejecutables y bibliotecas en Windows.

![Archivos ejecutables PE en Windows: EXE, DLL, SYS](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-1.avif)

En el artículo de hoy explicaremos como se estructura este formato. Usaremos un simple ejecutable en C que imprime un Hello World, todas las capturas de este artículo pertenecerán a este ejecutable.

Para empezar, podemos observar una estructura básica a alto nivel de un archivo PE en la siguiente imagen:

![Estructura básica de un archivo PE a alto nivel](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-2.avif)

Vamos a hablar en detalle de cada uno de estos encabezados. Si por ejemplo, abrimos nuestro ejecutable usando la herramienta [PE-Bear](https://github.com/hasherezade/pe-bear), podremos visualizar todos los campos de la imagen de arriba:

![Visualización de encabezados PE en PE-Bear](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-3.avif)

Dicho esto, vamos a comenzar viendo algunos conceptos importantes y posteriormente veremos uno por uno cada parte del formato PE.

- [Glosario de términos](#glosario-de-términos)
- [Loader y Linker](#loader-y-linker)
- [Relative Virtual Address (RVA)](#relative-virtual-address-rva)
- [Sections](#sections)
- [winnth](#winnth)
- [DOS Header](#dos-header)
- [DOS Stub](#dos-stub)
- [Rich Header](#rich-header)
- [Diferencia de flujo de ejecución entre un sistema Windows y un MS-DOS](#diferencia-de-flujo-de-ejecución-entre-un-sistema-windows-y-un-ms-dos)
- [NT Headers (IMAGE_NT_HEADERS)](#nt-headers-image_nt_headers)
    - [PE Signature](#pe-signature)
    - [File Header (IMAGE_FILE_HEADER)](#file-header-image_file_header)
    - [Optional Header (IMAGE_OPTIONAL_HEADER)](#optional-header-image_optional_header)
        - [Data Directories (IMAGE_DATA_DIRECTORY)](#data-directories-image_data_directory)
            - [Export Directory](#export-directory)
            - [Import Address Table (IAT)](#import-address-table-iat)
- [Section Headers](#section-headers)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

## Glosario de términos

A lo largo del artículo vamos a ver muchos términos que quizás conviene conocer de antes. De todas maneras, cuando se haga uso de estos términos se recordará de que tratan, pero al menos así lo tenemos de manera centralizada:

- **PE32**: Archivo ejecutable portable de 32 bits.
- **PE32+**: Archivo ejecutable portable de 64 bits.
- **BYTE**: Un byte de datos (también conocido como DB).
- **WORD**: Dos bytes de datos (también conocido como DW).
- **DWORD**: Cuatro bytes de datos (también conocido como DD).
- **Sección**: Las secciones son los contenedores de los datos del archivo ejecutable. Cada archivo PE puede tener múltiples secciones, y cada una tiene un nombre y atributos específicos que determinan cómo el sistema operativo debe manejarla.
- **Archivo de objeto**: Es el resultado del ensamblador o compilador y suele estar en formato _**COFF** (Common Object File Format)_. Estos archivos sirven como entrada para el _linker_.
- **Archivo de imagen**: Es el resultado del linker y se llama archivo de imagen. Puede ser un archivo ejecutable (.exe) o una biblioteca de enlaces dinámicos (.dll). El formato PE _(Portable Executable)_ es una extensión del formato COFF y es el estándar para archivos ejecutables y DLL en sistemas Windows.
- **Archivo binario**: Un archivo binario puede ser un archivo de objeto o un archivo de imagen.
- **Loader de Windows** (o simplemente _**loader**_): Es el código responsable de cargar un archivo PE en la memoria. Cuando un archivo PE se carga en la memoria, su versión en memoria se llama **módulo**.
- **Desplazamiento (offset)**: Es una referencia a la posición de un dato o instrucción dentro de un archivo o en memoria. El desplazamiento indica cuántos bytes hay que avanzar desde una posición inicial, como el inicio de un archivo o un segmento de memoria, para llegar a una ubicación específica. En los archivos PE, se usa para señalar la posición de diferentes secciones o componentes dentro del archivo.
- **Mapear**: En el contexto de sistemas operativos y archivos ejecutables, "mapear" significa asignar partes de un archivo directamente a la memoria del sistema para que puedan ser usadas por un programa. Es como crear un enlace entre el contenido del archivo en disco y una zona específica de la memoria, permitiendo que el programa acceda a esa información de manera rápida y eficiente. En el caso de los archivos PE (Portable Executable), el loader de Windows toma las secciones del archivo ejecutable y las coloca en la memoria. Esto establece una correspondencia entre las posiciones del archivo en el disco y las direcciones en la memoria. Gracias a este proceso, el programa puede acceder directamente a sus instrucciones y datos necesarios durante la ejecución, sin tener que cargar todo el archivo completo en memoria de una sola vez.
- **Encabezados NT**: A veces a los encabezados NT también se le conocen como encabezados PE, por lo que si ves por ahí PE Header en vez de NT Header, que sepas que se refiere a lo mismo.

Además, de cara al artículo se harán las respectivas traducciones, es decir, _OS loader_ lo mencionaremos como cargador del sistema operativo, _linker_ como enlazador, etc. Por último, nos referiremos a los archivos ejecutables (.exe, .dll) como archivos de imagen, de igual forma, cuando nos refiramos a archivo PE, estaremos incluyendo tanto archivos de objeto como archivos de imagen.

## Loader y Linker

Cuando ejecutamos un programa, dos de los componentes más importantes en el proceso son el enlazador (_linker_) y el cargador (_loader_). El enlazador combina los archivos de objeto generados por el compilador o ensamblador, junto con otras piezas de código, para crear un archivo ejecutable, como por ejemplo, un archivo con extensión .exe. Este proceso asegura que todas las referencias entre diferentes partes del programa estén correctamente resueltas, permitiendo que el código funcione como una unidad.

El _loader_, por otro lado, es el encargado de tomar este archivo ejecutable generado por el _linker_ y cargarlo en la memoria principal del sistema, preparándolo para que el procesador lo ejecute. Sin el _loader_, el programa no podría ser ejecutado, ya que el código debe estar en la memoria antes de que la CPU pueda acceder a él.

Estos dos componentes, el _linker_ y el _loader_, trabajan en conjunto para que un programa pase de ser simple código a una aplicación en funcionamiento, lo que los convierte en elementos esenciales en el ciclo de vida de un programa.

![Proceso de compilación y enlace: Linker y Loader](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-4.avif)

Vamos a ver todo el proceso de compilación de manera manual usando las herramientas de MSVC (cl y link), que nos permiten obtener los archivos correspondientes a cada paso. Usaremos cl para compilar y generar código ensamblador y archivo objeto, y link para crear el ejecutable final.

Inicialmente tenemos el siguiente código en C++ que imprime un simple _Hello World_:

![Código fuente en C++ que imprime Hello World](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-5.avif)

Para obtener el código ensamblador a partir de este archivo C++, utilizamos cl con las opciones /Fa y /Fo, que nos permiten generar el ensamblador (.asm) y el archivo objeto (.obj) de salida:

```bash
cl /Fahello.asm /Fohello.obj /c hello.cpp
```

![Compilación con cl generando archivos ASM y OBJ](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-6.avif)

Este comando genera un archivo llamado hello.asm que contiene el código ensamblador del programa en formato ASCII. También genera un archivo objeto (hello.obj) que contiene el código máquina correspondiente que puede ser ejecutado por el procesador. El archivo objeto todavía no es un programa ejecutable por sí mismo. Tampoco contiene todas las referencias a bibliotecas estándar o funciones del sistema operativo, esas referencias se resuelven durante el proceso de enlazado.

![Archivos generados: hello.asm y hello.obj](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-7.avif)

Si pasamos estos dos archivos a Linux podemos observar el tipo de archivo usando el comando file:

![Comando file mostrando formato COFF de archivos ASM y OBJ](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-8.avif)

Una vez que tenemos el código ensamblador y el archivo objeto generado por cl, podemos proceder al siguiente paso para crear el ejecutable.

Para convertir el archivo objeto en un programa ejecutable de Windows, utilizamos link. Esto asegura que todas las referencias de funciones y bibliotecas se gestionen adecuadamente:

```bash
link hello.obj /OUT:hello.exe
```

![Enlazando archivo objeto con link para crear ejecutable](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-9.avif)

![Ejecutable hello.exe generado por el linker](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-10.avif)

Este paso enlaza el archivo objeto y genera un ejecutable llamado hello.exe. El enlazador (_linker_), que es llamado por el compilador de MSVC, conecta todas las referencias de funciones y bibliotecas necesarias para que el programa pueda ejecutarse correctamente en un entorno Windows.

Toda esta explicación ha sido más por simple curiosidad (y porque alguna mención habrá a lo largo del artículo), pero lo importante era comprender cómo el proceso de compilación y enlace convierte nuestro código fuente en un programa ejecutable, gestionando tanto las referencias a funciones y bibliotecas como la estructura del archivo final.

> El archivo de imagen generado en esta sección no es el mismo que el del resto del artículo.

## Relative Virtual Address (RVA)

Antes de seguir, vamos a ver otro concepto importante del cual dependen los archivos PE en gran medida. Se trata de la dirección virtual relativa (RVA), esta dirección es básicamente un desplazamiento (offset) desde donde la imagen (archivo PE) ha sido cargada en memoria (Image Base).

Por ejemplo, si una imagen es cargada en memoria con una dirección base 0x400000 y la RVA al punto de entrada (función main) es 0x1000. Podríamos obtener la dirección virtual del punto de entrada sumando estos dos valores:

- Image Base + RVA = VA
    - 0x00400000 + 0x00001000 = 0x00401000

De esta manera obtendríamos la dirección virtual de la función main.

Realmente, el valor de la RVA de un método o variable no tiene por qué ser siempre el desplazamiento desde el principio del archivo (Image Base). Normalmente es el valor relativo desde una dirección virtual, la cual lo común es que sea la dirección base de la imagen pero también puede ser la dirección base de una sección.

## Sections

El último concepto importante antes de comenzar con el formato PE es el de las secciones. Las secciones son los contenedores de los datos del archivo ejecutable, ocupan el resto del archivo PE después de los encabezados, concretamente después de los encabezados de secciones (que los veremos al final).

![Secciones en un archivo PE después de los encabezados](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-11.avif)

Algunas secciones tienen nombres especiales que indican su propósito, se puede ver la lista completa de ellas en la [documentación oficial de Microsoft sobre secciones especiales](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#special-sections). Aún así, las mas comunes son las siguientes:

- **.text**: Contiene el código ejecutable del programa.
- **.data**: Contiene los datos inicializados.
- **.bss**: Contiene los datos no inicializados.
- **.rdata**: Contiene datos inicializados de solo lectura.
- **.edata**: Contiene las tablas de exportación.
- **.idata**: Contiene las tablas de importación.
- **.reloc**: Contiene la información de reubicación de la imagen.
- **.rsrc**: Contiene los recursos utilizados por el programa, que pueden incluir imágenes, iconos e incluso binarios incrustados.
- **.tls**: Proporciona almacenamiento específico para cada hilo que se ejecuta en el programa.

![Vista de secciones PE en PE-Bear](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-12.avif)

He preferido introducir este concepto al inicio debido a que se menciona en mas de una ocasión, pero no confundáis su posición, las secciones es lo último que se encuentra en un archivo PE, como podemos observar en la imagen del inicio del artículo.

## winnt.h

A lo largo del artículo vamos a ver muchas definiciones y estructuras de datos distintas, el punto en común de todas ellas es que se encuentran en el archivo de cabecera _**winnt.h**_.

Este archivo está disponible en el repositorio de GitHub de _**mingw-w64**_. Todas las estructuras y definiciones que mencionaremos se pueden consultar directamente en el [repositorio mingw-w64 en GitHub](https://github.com/Alexpux/mingw-w64/blob/master/mingw-w64-tools/widl/include/winnt.h).

## DOS Header

El encabezado DOS (también llamado encabezado MS-DOS) es una estructura de 64 bytes que existe al inicio del archivo PE. Este encabezado no es nuevo en el formato PE; es el mismo encabezado MS-DOS que ha existido desde la versión 2 del sistema operativo MS-DOS. La principal razón para mantener la misma estructura intacta al comienzo del formato PE es que, cuando intentas cargar un archivo creado bajo Windows versión 3.1 o anterior, o MS-DOS versión 2.0 o posterior, el sistema operativo puede leer el archivo y entender que no es compatible.

En otras palabras, si intentas ejecutar un ejecutable de Windows NT en MS-DOS versión 6.0, recibirás el mensaje _"This program cannot be run in DOS mode."_.

Si el encabezado MS-DOS no estuviera incluido como la primera parte del formato PE, el sistema operativo simplemente fallaría al intentar cargar el archivo y ofrecería un mensaje de error como _"The name specified is not recognized as an internal or external command, operable program or batch file."_

Aunque no es un encabezado que se utilice comúnmente en los sistemas Windows modernos, sigue estando presente por razones de compatibilidad con sistemas más antiguos. Podemos ver la estructura de este encabezado al comprobar la definición de la estructura "IMAGE\_DOS\_HEADER" ubicada en la librería _winnt.h_:

```c
typedef struct _IMAGE_DOS_HEADER {      // DOS .EXE header
    WORD   e_magic;                     // Magic number
    WORD   e_cblp;                      // Bytes on last page of file
    WORD   e_cp;                        // Pages in file
    WORD   e_crlc;                      // Relocations
    WORD   e_cparhdr;                   // Size of header in paragraphs
    WORD   e_minalloc;                  // Minimum extra paragraphs needed
    WORD   e_maxalloc;                  // Maximum extra paragraphs needed
    WORD   e_ss;                        // Initial (relative) SS value
    WORD   e_sp;                        // Initial SP value
    WORD   e_csum;                      // Checksum
    WORD   e_ip;                        // Initial IP value
    WORD   e_cs;                        // Initial (relative) CS value
    WORD   e_lfarlc;                    // File address of relocation table
    WORD   e_ovno;                      // Overlay number
    WORD   e_res[4];                    // Reserved words
    WORD   e_oemid;                     // OEM identifier (for e_oeminfo)
    WORD   e_oeminfo;                   // OEM information; e_oemid specific
    WORD   e_res2[10];                  // Reserved words
    LONG   e_lfanew;                    // File address of new exe header
  } IMAGE_DOS_HEADER, *PIMAGE_DOS_HEADER;
```

Aunque este encabezado no sea muy utilizado, si que es cierto que contiene 6 bytes con información importante para el cargador del sistema operativo:

- **e_magic \[2-bytes/WORD\]**: Este campo, también llamado "_magic number_", se posiciona justo en los 2 primeros bytes del archivo PE. Estos primeros dos bytes tienen un valor hexadecimal fijo de 0x5A4D, que se traduce como 'MZ' en ASCII. Este valor se utiliza para identificar un tipo de archivo compatible con MS-DOS, y por esta razón, sirve como firma para indicar que se trata de un archivo ejecutable MS-DOS válido. Como curiosidad, 'MZ' se refiere a [Mark Zbikowski](https://en.wikipedia.org/wiki/Mark_Zbikowski), uno de los desarrolladores de MS-DOS.

<figure>

<figure>

![Campo e_magic del DOS Header con valor MZ](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-13.avif)

<figcaption>

e_magic

</figcaption>

</figure>

<figcaption>

e_magic

</figcaption>

</figure>

- **e_lfanew \[4-bytes/DWORD\]**: Este campo corresponde a los últimos 4 bytes de la estructura del encabezado DOS, comenzando en el byte 60 (un offset de 0x3C desde la dirección base). Este campo es verdaderamente importante ya que sirve como desplazamiento (_offset_) hacia los encabezados NT. El valor de estos 4 bytes indica dónde se inician los encabezados NT en el archivo, que coincide con donde empieza el encabezado "PE Signature". Los encabezados NT son el sucesor moderno del encabezado DOS y es crucial para que el sistema operativo pueda cargar y ejecutar el archivo correctamente.

<figure>

![Campo e_lfanew apuntando a encabezados NT](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-14.avif)

<figcaption>

e_lfanew

</figcaption>

</figure>

El encabezado DOS visto desde PE-Bear es el siguiente:

<figure>

![Vista del DOS Header completo en PE-Bear](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-15.avif)

<figcaption>

DOS Header

</figcaption>

</figure>

Podemos ver el "e\_magic" con su valor fijo y posteriormente el valor de "e\_lfanew" que sería de 0x100, es decir, que siguiendo un offset de 0x100 encontraríamos el inicio de los encabezados NT.

## DOS Stub

Después del encabezado DOS, viene el **DOS Stub** (offset de 0x40), un pequeño ejecutable compatible con MS-DOS 2.0. Su función principal es mostrar un mensaje de error que dice: _"This program cannot be run in DOS mode"_ cuando el archivo se intenta ejecutar en un [entorno DOS](https://en.wikipedia.org/wiki/DOS).

<figure>

![DOS Stub mostrando mensaje de incompatibilidad](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-16.avif)

<figcaption>

DOS Stub

</figcaption>

</figure>

Este código es necesario para garantizar la compatibilidad con sistemas más antiguos y proporcionar una respuesta amigable en lugar de un fallo sin explicación.

## Rich Header

Una vez visto el encabezado DOS y el _DOS Stub_ deberíamos de pasar a los encabezados NT. Sin embargo, antes de ellos, hay un posible fragmento de datos conocido como encabezado _Rich_ que puede o no estar presente. Se trata de una estructura sin documentar que solo está presente en aquellos ejecutables que han sido creados con el conjunto de herramientas de Microsoft.

![Rich Header en vista hexadecimal de PE-Bear](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-17.avif)

![Detalles del Rich Header en PE-Bear](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-18.avif)

Este encabezado está formado por:

- **Un conjunto de datos pasados por XOR**.
- **La palabra clave** _**Rich**_ (en _PE-Bear_ corresponde al campo _Rich ID_).
- **Una clave XOR**: que por un lado sirve como _checksum_ y por otro como clave en sí para descifrar los datos en XOR.

Esta estructura es generada por el enlazador (_linker_) y contiene algunos metadatos sobre las herramientas utilizadas para construir el ejecutable, por ejemplo:

![Análisis del Rich Header con rich.py mostrando módulos del compilador](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-19.avif)

En la imagen podemos observar el análisis del encabezado _Rich_ de nuestro archivo de imagen usando [rich.py](https://github.com/RichHeaderResearch/RichPE). El script detalla el entorno de compilación, _VS2008 SP1 build 30729_ en este caso. Además, se enumeran diferentes módulos mediante IDs y versiones específicas, junto con un conteo que indica la cantidad de veces que cada módulo fue utilizado durante la construcción de la imagen. Por ejemplo, el módulo con ID 259, versión 33808, aparece 3 veces. Por otro lado, la línea que indica objetos no marcados (_Unmarked objects count=64_) hace referencia a secciones del ejecutable que no están directamente asociadas con herramientas específicas del compilador, pero que aún forman parte del archivo final.

Este campo no solo contiene información relevante sobre el perfil del entorno de compilación, sino que también puede ser muy útil para usarse como firma o _fingerprint_. El count también da posibles indicaciones sobre el tamaño del proyecto, y el _checksum_ también puede ser usado como una firma.

Como contiene información de este tipo, los desarrolladores de malware suelen modificar esta cabecera para no proporcionar esta información o aprovecharse de este encabezado para realizar otras acciones. Si quieres ver mas información dejo por aquí algunos enlaces:

- [The devil's in the Rich header](https://securelist.com/the-devils-in-the-rich-header/84348/)
- [Rich Header Research](https://github.com/RichHeaderResearch/RichPE)
- [Case studies in Rich Header analysis and hunting](http://ropgadget.com/posts/richheader_hunting.html)
- [Microsoft's Rich Signature (undocumented)](https://www.ntcore.com/files/richsign.htm)
- [PE File Rich Header](https://offwhitesecurity.dev/malware-development/portable-executable-pe/rich-header/)

## Diferencia de flujo de ejecución entre un sistema Windows y un MS-DOS

Según lo visto hasta ahora, el comportamiento al ejecutar un archivo de imagen entre ambos sistemas sería la siguiente:

<figure>

![Flujo de ejecución comparando Windows y MS-DOS](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-20.avif)

<figcaption>

Basado en el mismo diagrama de: A dive into the PE file format - PE file structure - Part 2: DOS Header, DOS Stub and Rich Header

</figcaption>

</figure>

## NT Headers (IMAGE\_NT\_HEADERS)

Los encabezados NT son una estructura definida en la librería _winnt.h_ como "IMAGE\_NT\_HEADERS":

```c
typedef struct _IMAGE_NT_HEADERS64 {
    DWORD Signature;
    IMAGE_FILE_HEADER FileHeader;
    IMAGE_OPTIONAL_HEADER64 OptionalHeader;
} IMAGE_NT_HEADERS64, *PIMAGE_NT_HEADERS64;

typedef struct _IMAGE_NT_HEADERS {
    DWORD Signature;
    IMAGE_FILE_HEADER FileHeader;
    IMAGE_OPTIONAL_HEADER32 OptionalHeader;
} IMAGE_NT_HEADERS32, *PIMAGE_NT_HEADERS32;
```

Si observamos su definición, podemos encontrar tres miembros:

- **Signature \[4-bytes/DWORD\]**
- **FileHeader \[IMAGE\_FILE\_HEADER/Structure\]**
- **OptionalHeader \[IMAGE\_OPTIONAL\_HEADER/Structure\]**

Además, la estructura está definida en dos versiones distintas, una para ejecutables de 32 bits (también referidos como ejecutables PE32) y otra para 64 bits (referidos como PE32+). Aunque si nos fijamos, esta diferencia solo se ve reflejada en el miembro "OptionalHeader".

#### PE Signature

La firma del archivo PE es el primer miembro de la estructura de los encabezados NT, es un tipo de dato DWORD, por lo que ocupa 4 bytes. Podemos visualizarlo en PE-Bear:

![Firma PE con valor 0x50450000 en PE-Bear](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-21.avif)

La firma siempre tiene un valor fijo de 0x50450000, que se traduce en ASCII como PE\\0\\0 (P + E + Null Byte + Null Byte). El propósito de la firma es que sirva como una marca que le indica al sistema operativo que efectivamente es un ejecutable en el formato PE.

#### File Header (IMAGE\_FILE\_HEADER)

Esta estructura almacena información sobre el archivo PE, también es llamado "encabezado de archivo COFF". Está definido en _winnt.h_ como "IMAGE\_FILE\_HEADER":

```c
typedef struct _IMAGE_FILE_HEADER {
    WORD    Machine;
    WORD    NumberOfSections;
    DWORD   TimeDateStamp;
    DWORD   PointerToSymbolTable;
    DWORD   NumberOfSymbols;
    WORD    SizeOfOptionalHeader;
    WORD    Characteristics;
} IMAGE_FILE_HEADER, *PIMAGE_FILE_HEADER;
```

Vamos a ver cada miembro de la estructura:

- **Machine \[2-bytes/WORD\]**: Especifica la arquitectura de destino para el ejecutable (x86, x64, ARM, etc). Aunque solo nos interesan dos, 0x8864 para AMD64 y 0x14c para i386. Se puede ver la lista completa de valores en la [documentación de Microsoft sobre tipos de máquina](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#machine-types).
- **NumberOfSections \[2-bytes/WORD\]**: Este campo almacena el número de secciones, dicho de otra manera, el numero de encabezados de secciones (tamaño de la tabla de sección).
- **TimeDateStamp \[4-bytes/DWORD\]**: Este valor indica la hora de creación o compilación del programa en forma de _epoch timestamp_ (1728682065), que mide los segundos transcurridos desde el 01/01/97 00:00:00. Un aspecto interesante a tener en cuenta es el riesgo de un _integer overflow_ en 2038 debido al limitado espacio disponible en este campo DWORD.
- **PointerToSymbolTable y NumberOfSymbols \[4-bytes/DWORD\]**: Estos dos campos contienen el offset del archivo a la tabla de símbolos COFF y el número de entradas en esa tabla de símbolos. Sin embargo se ponen a 0 porque la información de depuración COFF está obsoleta en los archivos PE modernos (no hay tabla de símbolos COFF presente).
- **SizeOfOptionalHeader \[2-bytes/WORD\]**: Almacena el tamaño del encabezado opcional. Para PE32 suele ser 0x00E0 (224 bytes) y para PE32+ suele ser 0X00F0 (240 bytes).
- **Characteristics \[2-bytes/WORD\]**: Contiene _flags_ que indican los atributos del archivo. Estos atributos pueden ser cosas como que el archivo sea ejecutable, que sea un archivo de sistema y no un programa de usuario, y muchas otras cosas. La lista completa de atributos se puede encontrar en la [documentación de Microsoft sobre características](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#characteristics), algunos de ellos serían:
    - 0x0002 – Archivo ejecutable
    - 0x0020 – La aplicación puede manejar direcciones mayores a 2 GB
    - **0x0100** – El archivo es una DLL
    - **0x2000** – El archivo es un archivo de sistema.
    - **0x4000** – El archivo es un controlador cargable dinámicamente (_loadable driver_).
    - **0x8000** – El archivo tiene conciencia de medios removibles (_media-aware_).

El encabezado de archivo de nuestro archivo de imagen sería el siguiente:

![File Header con arquitectura y características del ejecutable](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-22.avif)

![Detalles del File Header en vista hexadecimal](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-23.avif)

#### Optional Header (IMAGE\_OPTIONAL\_HEADER)

Este encabezado es el mas importante de los encabezados NT. El cargador del sistema mirará la información dada por este encabezado para ser capaz de cargar y ejecutar el ejecutable. Se llama encabezado opcional debido que algunos tipos de archivo como los archivos de objetos no la llevan, sin embargo, es esencial para los archivos de imagen. Este encabezado no tiene un valor fijo, por eso existe el miembro "SizeOfOptionalHeader" en la estructura "IMAGE\_FILE\_HEADER".

Los primeros 8 miembros del encabezado opcional son estándar para cada implementación del formato de archivo COFF, el resto del encabezado es una extensión del encabezado estándar opcional COFF definido por Microsoft, estos miembros adicionales de la estructura son necesarios para el cargador y enlazador de Windows.

Como se mencionó previamente, existen dos versiones para este encabezado, una para ejecutables de 32 bits y otra para 64. Las dos versiones son diferentes en dos aspectos:

- **El tamaño de la propia estructura (o el número de miembros definidos dentro de la estructura)**: "IMAGE\_OPTIONAL\_HEADER32" tiene 31 miembros mientras que "IMAGE\_OPTIONAL\_HEADER64" sólo tiene 30 miembros, ese miembro adicional en la versión de 32 bits es un DWORD llamado "BaseOfData" que contiene la RVA del comienzo de la sección de datos.
- **El tipo de datos de algunos de los miembros**: Los siguientes 5 miembros de la estructura "IMAGE\_OPTIONAL\_HEADER" se definen como tipo de dato DWORD en la versión de 32 bits y como ULONGLONG en la versión de 64 bits:
    - "ImageBase"
    - "SizeOfStackReserve"
    - "SizeOfStackCommit"
    - "SizeOfHeapReserve"
    - "SizeOfHeapCommit"

Vamos a ver la definición de ambas estructuras:

- 32 bits

```c
typedef struct _IMAGE_OPTIONAL_HEADER {
    //
    // Standard fields.
    //

    WORD    Magic;
    BYTE    MajorLinkerVersion;
    BYTE    MinorLinkerVersion;
    DWORD   SizeOfCode;
    DWORD   SizeOfInitializedData;
    DWORD   SizeOfUninitializedData;
    DWORD   AddressOfEntryPoint;
    DWORD   BaseOfCode;
    DWORD   BaseOfData;

    //
    // NT additional fields.
    //

    DWORD   ImageBase;
    DWORD   SectionAlignment;
    DWORD   FileAlignment;
    WORD    MajorOperatingSystemVersion;
    WORD    MinorOperatingSystemVersion;
    WORD    MajorImageVersion;
    WORD    MinorImageVersion;
    WORD    MajorSubsystemVersion;
    WORD    MinorSubsystemVersion;
    DWORD   Win32VersionValue;
    DWORD   SizeOfImage;
    DWORD   SizeOfHeaders;
    DWORD   CheckSum;
    WORD    Subsystem;
    WORD    DllCharacteristics;
    DWORD   SizeOfStackReserve;
    DWORD   SizeOfStackCommit;
    DWORD   SizeOfHeapReserve;
    DWORD   SizeOfHeapCommit;
    DWORD   LoaderFlags;
    DWORD   NumberOfRvaAndSizes;
    IMAGE_DATA_DIRECTORY DataDirectory[IMAGE_NUMBEROF_DIRECTORY_ENTRIES];
} IMAGE_OPTIONAL_HEADER32, *PIMAGE_OPTIONAL_HEADER32;
```

- 64 bits

```c
typedef struct _IMAGE_OPTIONAL_HEADER64 {
    WORD        Magic;
    BYTE        MajorLinkerVersion;
    BYTE        MinorLinkerVersion;
    DWORD       SizeOfCode;
    DWORD       SizeOfInitializedData;
    DWORD       SizeOfUninitializedData;
    DWORD       AddressOfEntryPoint;
    DWORD       BaseOfCode;
    ULONGLONG   ImageBase;
    DWORD       SectionAlignment;
    DWORD       FileAlignment;
    WORD        MajorOperatingSystemVersion;
    WORD        MinorOperatingSystemVersion;
    WORD        MajorImageVersion;
    WORD        MinorImageVersion;
    WORD        MajorSubsystemVersion;
    WORD        MinorSubsystemVersion;
    DWORD       Win32VersionValue;
    DWORD       SizeOfImage;
    DWORD       SizeOfHeaders;
    DWORD       CheckSum;
    WORD        Subsystem;
    WORD        DllCharacteristics;
    ULONGLONG   SizeOfStackReserve;
    ULONGLONG   SizeOfStackCommit;
    ULONGLONG   SizeOfHeapReserve;
    ULONGLONG   SizeOfHeapCommit;
    DWORD       LoaderFlags;
    DWORD       NumberOfRvaAndSizes;
    IMAGE_DATA_DIRECTORY DataDirectory[IMAGE_NUMBEROF_DIRECTORY_ENTRIES];
} IMAGE_OPTIONAL_HEADER64, *PIMAGE_OPTIONAL_HEADER64;
```

- **Magic \[2-bytes/WORD\]**: es un campo que identifica el estado de la imagen. La [documentación de Microsoft sobre campos estándar del Optional Header](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#optional-header-standard-fields-image-only) menciona tres valores comunes:
    - **0x10B**: Identifica la imagen como un ejecutable PE32.
    - **0x20B**: Identifica la imagen como un ejecutable PE32+ (aka. 64 bits)
    - **0x107**: Identifica la imagen como ROM.

El valor de este campo es el que determina si el ejecutable es de 32 o 64 bits, el miembro "Machine" de la estructura "IMAGE\_FILE\_HEADER" es ignorado por el cargador PE de Windows, en su lugar, se utiliza esta.

- **MajorLinkerVersion and MinorLinkerVersion \[1-byte/BYTE\]**: Indican el número de versión principal y secundario del enlazador utilizado para crear el archivo ejecutable.
- **SizeOfCode \[4-bytes/DWORD\]**: Almacena el tamaño total, en bytes, de todas las secciones que contienen código ejecutable (normalmente la sección .text).
- **SizeOfInitializedData \[4-bytes/DWORD\]**: Indica el tamaño total, en bytes, de todas las secciones que contienen datos inicializados (normalmente la sección .data).
- **SizeOfUninitializedData \[4-bytes/DWORD\]**: Almacena el tamaño total, en bytes, de todas las secciones que contienen datos no inicializados (normalmente la sección .bss).
- **AddressOfEntryPoint \[4-bytes/DWORD\]**: Es una RVA (_Relative Virtual Address_) que señala el punto de entrada de la imagen cuando se carga en memoria. En aplicaciones ejecutables, este valor apunta al inicio de la función principal (por ejemplo, main o WinMain). En controladores de dispositivo, apunta a la función de inicialización. Para DLLs, el punto de entrada es opcional; si no existe, este campo se establece en 0.
- **BaseOfCode \[4-bytes/DWORD\]**: Es una RVA que indica la dirección de inicio de la sección de código (normalmente .text) en memoria una vez cargado el archivo.
- **BaseOfData \[4-bytes/DWORD\]**: Es una RVA que señala el inicio de la sección de datos (normalmente .data) en memoria tras cargar el archivo. Este campo no existe en el formato PE32+.
- **ImageBase \[4-bytes/DWORD en PE32 y 8-bytes/ULONGLONG en PE32+\]**: Contiene la dirección base preferida para cargar el primer byte de la imagen en memoria. Este valor debe ser múltiplo de 64 KB. Sin embargo, debido a mecanismos de protección como ASLR (_Address Space Layout Randomization_) y otras razones, la imagen a menudo no se carga en esta dirección. En ese caso, el cargador PE elige un área de memoria no utilizada para cargar la imagen y luego realiza un proceso llamado reubicación. Durante la reubicación, se ajustan las direcciones internas de la imagen para que funcionen con la nueva base de carga. Existe una sección especial, llamada sección de reubicación (.reloc), que contiene información sobre los lugares que necesitan ser ajustados si se requiere una reubicación.
- **SectionAlignment \[4-bytes/DWORD\]**: Especifica la alineación, en bytes, de las secciones cuando se cargan en memoria. Las secciones se alinean en límites que son múltiplos de este valor. Por defecto, suele ser el tamaño de página de la arquitectura (por ejemplo, 4 KB) y no puede ser menor que el valor de FileAlignment.
- **FileAlignment \[4-bytes/DWORD\]**: Especifica la alineación, en bytes, de los datos de las secciones en el archivo (en disco). Si el tamaño real de los datos de una sección es menor que FileAlignment, el resto se rellena con ceros para cumplir con la alineación. Este valor debe ser una potencia de 2 entre 512 y 64 KB. Si SectionAlignment es menor que el tamaño de página de la arquitectura, entonces FileAlignment y SectionAlignment deben ser iguales.
- **MajorOperatingSystemVersion, MinorOperatingSystemVersion \[2-bytes/WORD\]**: Especifican la versión principal y secundaria del sistema operativo requerida para ejecutar el archivo.
- **MajorImageVersion y MinorImageVersion \[2-bytes/WORD\]**: Indican la versión principal y secundaria de la imagen del archivo. Estas versiones pueden ser utilizadas por herramientas o sistemas para determinar compatibilidad.
- **MajorSubsystemVersion y MinorSubsystemVersion \[2-bytes/WORD\]**: Especifican la versión principal y secundaria del subsistema requerido. Con subsistema se refiere al entorno de ejecución, que puede ser una aplicación gráfica de Windows (GUI), una aplicación de consola (CUI), un entorno EFI (Entorno de Firmware Extensible), o incluso una aplicación nativa que interactúa directamente con el núcleo del sistema operativo, entre otros.
- **Win32VersionValue \[4-bytes/DWORD\]**: Campo reservado que, según la documentación oficial, debe establecerse en 0.
- **SizeOfImage \[4-bytes/DWORD\]**: Indica el tamaño total de la imagen en memoria (en bytes), incluyendo todos los encabezados y las secciones. Se redondea al múltiplo más cercano de "SectionAlignment", ya que este valor se utiliza al cargar la imagen en memoria.
- **SizeOfHeaders \[4-bytes/DWORD\]**: Es el tamaño combinado, en bytes, del "stub DOS", los encabezados PE (encabezados NT) y los encabezados de sección, redondeado al múltiplo más cercano de "FileAlignment".
- **CheckSum \[4-bytes/DWORD\]**: Campo utilizado para almacenar el _checksum_ de la imagen, permitiendo verificar la integridad del archivo. El _checksum_ es un valor calculado a partir del contenido del archivo que actúa como una huella digital. Si algún byte del archivo cambia (por ejemplo, debido a corrupción o manipulación), el _checksum_ resultante también cambiará, lo que permite detectar inconsistencias o daños en el archivo. Si este campo se establece en 0, el _checksum_ no se calcula ni se verifica.
- **Subsystem \[2-bytes/WORD\]**: Especifica el subsistema requerido para ejecutar este archivo. Indica el tipo de interfaz que utiliza el programa, como si es una aplicación de consola, una aplicación GUI de Windows, un driver, etc. La lista completa de posibles valores se encuentra en la [documentación de Microsoft sobre subsistemas de Windows](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#windows-subsystem).
- **DLLCharacteristics \[2-bytes/WORD\]**: Define diversas características del archivo de imagen, tales como soporte para NX (_No eXecute_) o si la imagen puede ser reubicada en tiempo de ejecución. Aunque se llama "DLLCharacteristics" por razones históricas, también se aplica a archivos ejecutables normales (EXE). La lista completa de _flags_ disponibles se puede consultar en la [documentación de Microsoft sobre características de DLL](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#dll-characteristics).
- **SizeOfStackReserve \[8-bytes/ULONGLONG\]**: Especifica el tamaño total de memoria que se reserva para la pila (_stack_) del hilo principal.
- **SizeOfStackCommit \[8-bytes/ULONGLONG\]**: Indica el tamaño inicial de memoria de la pila que se compromete (_commit_).
- **SizeOfHeapReserve \[8-bytes/ULONGLONG\]**: Especifica el tamaño total de memoria que se reserva para el _heap_ local del proceso.
- **SizeOfHeapCommit \[8-bytes/ULONGLONG\]**: Indica el tamaño inicial de memoria del _heap_ que se compromete (_commit_).

**Nota**: Los valores "_reserve_" indican cuánta memoria virtual se reserva, mientras que los valores "_commit_" indican cuánta memoria física se asigna inicialmente. La memoria reservada puede ser comprometida posteriormente según sea necesario.

- **LoaderFlags \[4-bytes/DWORD\]**: Campo reservado que debe establecerse en 0 según la [documentación de Microsoft sobre campos específicos de Windows](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#optional-header-windows-specific-fields-image-only).
- **NumberOfRvaAndSizes \[4-bytes/DWORD\]**: Indica el número de entradas en el array "DataDirectory". Especifica cuántas estructuras "IMAGE\_DATA\_DIRECTORY" siguen a continuación.
- **DataDirectory \[IMAGE\_DATA\_DIRECTORY/Structure\]**: Es un array de estructuras "IMAGE\_DATA\_DIRECTORY", donde cada entrada proporciona la dirección y el tamaño de una tabla o información específica, como la tabla de importaciones, exportaciones, recursos, etc. El número de entradas está definido por "NumberOfRvaAndSizes".
    - Ahora hablaremos mas en detalle sobre este miembro.

La encabezado opcional en nuestro PE se ve de la siguiente manera:

![Optional Header mostrando Magic, Entry Point y alineaciones](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-24.avif)

En la imagen podemos observar que el campo "Magic" tiene un valor de 0x20B, lo que significa que el archivo es un ejecutable PE32+. Este formato permite que el archivo utilice la capacidad completa del espacio de direcciones virtuales de 64 bits.

La RVA (_Relative Virtual Address_) del punto de entrada es 0x14E0, lo que indica la dirección relativa donde comenzará la ejecución del código una vez cargado en memoria. La sección de código comienza en la dirección 0x1000, y está alineada según el valor de "Section Alignment".

Además, el campo "File Alignment", con un valor de 0x200, define cómo las secciones están alineadas en el archivo en disco, mientras que en memoria siguen el "Section Alignment" de 0x1000.

![Sección .data con relleno de ceros por File Alignment](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-25.avif)

Por ejemplo, la sección .data tiene contenido desde 0x2A00 hasta 0x2A70, y el resto de la sección está relleno con ceros hasta 0x2BFF, cumpliendo con la alineación definida por el campo "FileAlignment". Esta alineación asegura que las secciones en disco estén organizadas en bloques de un tamaño predeterminado, mientras que "SectionAlignment" define cómo se organizan estas secciones en memoria una vez que el archivo se carga.

En cuanto a otros miembros importantes, "SizeOfImage" tiene un valor de 0x9000, lo que representa el tamaño total de la imagen cargada en memoria, y este valor es múltiplo de "SectionAlignment" (0x1000). "SizeOfHeaders", por su parte, tiene un valor de 0x400 y está alineado de acuerdo con "FileAlignment", lo que asegura que los encabezados del archivo ocupen un bloque completo en disco, facilitando su correcta lectura por el sistema operativo.

Por último, el campo "Subsystem" tiene un valor de 3, indicando que este archivo es una aplicación de consola, lo que es coherente con la opción que seleccioné al crear el proyecto en Visual Studio:

![Selección de subsistema de consola en Visual Studio](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-26.avif)

##### Data Directories (IMAGE\_DATA\_DIRECTORY)

Como hemos dicho antes, el último miembro de la estructura "IMAGE\_OPTIONAL\_HEADER" es un array de estructuras "IMAGE\_DATA\_DIRECTORY".

```c
IMAGE_DATA_DIRECTORY DataDirectory[IMAGE_NUMBEROF_DIRECTORY_ENTRIES];
```

"IMAGE\_NUMBEROF\_DIRECTORY\_ENTRIES" es una constante definida con el valor 16, lo que significa que el archivo PE estándar puede tener hasta 16 entradas "IMAGE\_DATA\_DIRECTORY".

```c
#define IMAGE_NUMBEROF_DIRECTORY_ENTRIES    16
```

La estructura "IMAGE\_DATA\_DIRECTORY" es la siguiente:

```c
typedef struct _IMAGE_DATA_DIRECTORY {
    DWORD   VirtualAddress;
    DWORD   Size;
} IMAGE_DATA_DIRECTORY, *PIMAGE_DATA_DIRECTORY;
```

En comparación con otras estructuras del archivo PE, "IMAGE\_DATA\_DIRECTORY" es bastante sencilla, ya que solo tiene dos miembros: "VirtualAddress", que contiene el RVA que apunta al inicio de la entrada que corresponda, y "Size", que define el tamaño de esa entrada.

Entonces, el miembro "Data Directories" de "IMAGE\_OPTIONAL\_HEADER" no es mas que una tabla que contiene las direcciones y tamaños a otras partes importantes del ejecutable que son útiles para el cargador del sistema operativo. Por ejemplo, un directorio importante es el "Import Directory", ya que contiene una lista de funciones externas importadas de otras librerías.

No todos los directorios tienen la misma estructura, el "IMAGE\_DATA\_DIRECTORY.VirtualAddress" apunta al directorio que sea, pero el tipo de directorio es lo que determina como el bloque (_chunk_) de datos va a ser interpretado.

En la librería de _winnt.h_ podemos encontrar una serie de "Data Directories" definidos:

```c
// Directory Entries

#define IMAGE_DIRECTORY_ENTRY_EXPORT          0   // Export Directory
#define IMAGE_DIRECTORY_ENTRY_IMPORT          1   // Import Directory
#define IMAGE_DIRECTORY_ENTRY_RESOURCE        2   // Resource Directory
#define IMAGE_DIRECTORY_ENTRY_EXCEPTION       3   // Exception Directory
#define IMAGE_DIRECTORY_ENTRY_SECURITY        4   // Security Directory
#define IMAGE_DIRECTORY_ENTRY_BASERELOC       5   // Base Relocation Table
#define IMAGE_DIRECTORY_ENTRY_DEBUG           6   // Debug Directory
//      IMAGE_DIRECTORY_ENTRY_COPYRIGHT       7   // (X86 usage)
#define IMAGE_DIRECTORY_ENTRY_ARCHITECTURE    7   // Architecture Specific Data
#define IMAGE_DIRECTORY_ENTRY_GLOBALPTR       8   // RVA of GP
#define IMAGE_DIRECTORY_ENTRY_TLS             9   // TLS Directory
#define IMAGE_DIRECTORY_ENTRY_LOAD_CONFIG    10   // Load Configuration Directory
#define IMAGE_DIRECTORY_ENTRY_BOUND_IMPORT   11   // Bound Import Directory in headers
#define IMAGE_DIRECTORY_ENTRY_IAT            12   // Import Address Table
#define IMAGE_DIRECTORY_ENTRY_DELAY_IMPORT   13   // Delay Load Import Descriptors
#define IMAGE_DIRECTORY_ENTRY_COM_DESCRIPTOR 14   // COM Runtime descriptor
```

Como podíamos observar antes en el encabezado opcional, podemos encontrar la tabla de directorios con sus respectivos valores:

![Tabla de Data Directories con direcciones y tamaños](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-27.avif)

Cuando una entrada tiene ambos valores ("Address" y "Size") en cero significa que ese directorio de datos específico no se usa (no existe). A continuación, antes de seguir vamos a mencionar mínimamente el directorio de exportación y la tabla de importación de direcciones, que son dos entradas importantes del "Data Directories".

###### Export Directory

El directorio de exportación de un archivo de imagen es una estructura de datos que contiene información sobre las funciones y variables que son exportadas desde el ejecutable.

```c
typedef struct _IMAGE_EXPORT_DIRECTORY {
    ULONG   Characteristics;
    ULONG   TimeDateStamp;
    USHORT  MajorVersion;
    USHORT  MinorVersion;
    ULONG   Name;
    ULONG   Base;
    ULONG   NumberOfFunctions;
    ULONG   NumberOfNames;
    PULONG  *AddressOfFunctions;
    PULONG  *AddressOfNames;
    PUSHORT *AddressOfNameOrdinals;
} IMAGE_EXPORT_DIRECTORY, *PIMAGE_EXPORT_DIRECTORY;
```

Contiene las direcciones de las funciones y variables exportadas, que pueden ser utilizadas por otros archivos ejecutables para acceder a dichas funciones y datos. El directorio de exportación se encuentra generalmente en DLLs que exportan funciones (por ejemplo, _kernel32.dll_ exportando _CreateFileA_).

###### Import Address Table (IAT)

La tabla de direcciones de importación es una estructura de datos en un archivo de imagen que contiene información sobre las direcciones de las funciones importadas de otros archivos ejecutables. Estas direcciones se utilizan para acceder a las funciones y datos en otros ejecutables (por ejemplo, _Programita.exe_ importando _CreateFileA_ de _kernel32.dll_).

## Section Headers

Después del encabezado opcional podemos encontrar lo encabezados de secciones. Estos encabezados contienen información sobre las secciones del archivo PE. Un encabezado de sección es una estructura llamada "IMAGE\_SECTION\_HEADER" definida en _winnt.h_:

```c
typedef struct _IMAGE_SECTION_HEADER {
    BYTE    Name[IMAGE_SIZEOF_SHORT_NAME];
    union {
            DWORD   PhysicalAddress;
            DWORD   VirtualSize;
    } Misc;
    DWORD   VirtualAddress;
    DWORD   SizeOfRawData;
    DWORD   PointerToRawData;
    DWORD   PointerToRelocations;
    DWORD   PointerToLinenumbers;
    WORD    NumberOfRelocations;
    WORD    NumberOfLinenumbers;
    DWORD   Characteristics;
} IMAGE_SECTION_HEADER, *PIMAGE_SECTION_HEADER;
```

- **Name \[1-byte/BYTE\]**: el primer campo del encabezado de sección es un array del tamaño de "IMAGE\_SIZEOF\_SHORT\_NAME":

```c
#define IMAGE_SIZEOF_SHORT_NAME 		8
```

Al tener un valor por defecto de 8, significa que el nombre de la sección no puede ser mayor a 8 caracteres. Para los ejecutables se mantiene este valor; para otros tipos de archivos hay algunas opciones para poder establecer nombres más largos.

- **PhysicalAddress o VirtualSize \[4-bytes/DWORD\]**: Este campo es una unión y puede denominarse "PhysicalAddress" o "VirtualSize". En archivos objeto, se llama "PhysicalAddress" y contiene el tamaño total de la sección. En imágenes ejecutables, se llama "VirtualSize" y contiene el tamaño total de la sección cuando se carga en memoria.
- **VirtualAddress \[4-bytes/DWORD\]**: Contiene la dirección virtual relativa (RVA) del primer byte de la sección respecto a la base de la imagen cuando se carga en memoria. Para archivos objeto, contiene la dirección del primer byte de la sección antes de que se apliquen las reubicaciones.
- **SizeOfRawData \[4-bytes/DWORD\]**: Este campo contiene el tamaño de la sección en disco; debe ser múltiplo de "IMAGE\_OPTIONAL\_HEADER.FileAlignment".
- **PointerToRawData \[4-bytes/DWORD\]**: Un puntero al inicio de la sección dentro del archivo; para imágenes ejecutables, debe ser un múltiplo de "IMAGE\_OPTIONAL\_HEADER.FileAlignment".
- **PointerToRelocations \[4-bytes/DWORD\]**: Un puntero de archivo al comienzo de las entradas de reubicación de la sección. Se establece en 0 para archivos ejecutables.
- **PointerToLineNumbers \[4-bytes/DWORD\]**: Un puntero de archivo al inicio de las entradas de número de línea COFF para la sección. Se establece en 0 porque la información de depuración COFF está obsoleta.
- **NumberOfRelocations \[2-bytes/WORD\]**: El número de entradas de reubicación para la sección; se establece en 0 para imágenes ejecutables.
- **NumberOfLinenumbers \[2-bytes/WORD\]**: El número de entradas de número de línea COFF para la sección; se establece en 0 porque la información de depuración COFF está obsoleta.
- **Characteristics \[4-bytes/DWORD\]**: Contiene _flags_ que describen las características de la sección. Estas _flags_ indican si la sección contiene código ejecutable, datos inicializados o no inicializados, si puede compartirse en memoria, entre otros. Una lista completa de estas _flags_ se puede encontrar en la [documentación de Microsoft sobre flags de sección](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#section-flags).

De todos estos miembros mencionados, un detalle importante es que el valor de "SizeOfRawData" y "VirtualSize" pueden ser distintos. ¿A qué me refiero y por qué pasa esto?

"SizeOfRawData" debe ser un múltiplo de "IMAGE\_OPTIONAL\_HEADER.FileAlignment" (0x200 en hexadecimal, 512 en decimal). Por lo tanto, si el tamaño real de la sección en disco es menor que "FileAlignment" o no es un múltiplo de este valor, "SizeOfRawData" se redondeará al siguiente múltiplo más cercano. Por ejemplo, si el tamaño de una sección en disco es de 600 bytes, se redondeará al siguiente múltiplo de 512 (0x200), que es 1024 bytes (0x400).

Por otro lado, "VirtualSize" representa el tamaño real de la sección en memoria. A diferencia de "SizeOfRawData", "VirtualSize" no necesita ser un múltiplo de ningún valor de alineación. Sin embargo, la dirección virtual donde comienza la sección ("VirtualAddress") debe estar alineada según "IMAGE\_OPTIONAL\_HEADER.SectionAlignment" (0x1000 en hexadecimal, 4096 en decimal).

Debido a estas diferencias, puede ocurrir que el tamaño de la sección en disco sea mayor que el tamaño de la sección en memoria. Esto sucede porque "SizeOfRawData" se alinea al siguiente múltiplo de "FileAlignment", lo que puede introducir espacio no utilizado en el archivo.

Por el contrario, también puede suceder que "VirtualSize" sea mayor que "SizeOfRawData". Esto ocurre si la sección contiene datos no inicializados, como variables globales o estáticas sin valor asignado, comúnmente ubicadas en la sección .bss. Estos datos no inicializados no ocupan espacio en disco porque no hay información real que almacenar, "SizeOfRawData" no incluye su tamaño. Sin embargo, cuando el ejecutable se carga en memoria, el sistema operativo reserva espacio para estos datos, inicializándolos generalmente a cero. De esta manera, la sección se expande en memoria para incluir el espacio necesario para los datos no inicializados, y "VirtualSize" refleja este tamaño mayor.

En resumen, "SizeOfRawData" puede ser mayor que "VirtualSize" debido al alineamiento en disco que agrega espacio no utilizado. Por otro lado, "VirtualSize" puede ser mayor que "SizeOfRawData" cuando la sección incluye datos no inicializados que requieren espacio en memoria pero no ocupan espacio en disco.

Pues con todo esto, los encabezados de sección de nuestro ejecutable en PE-Bear se ven así:

![Encabezados de sección mostrando direcciones y tamaños](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-28.avif)

En la imagen podemos observar las siguientes columnas (entre otras):

- "Raw. Addr." --> "IMAGE\_SECTION\_HEADER.PointerToRawData"

- "Raw Size" --> "IMAGE\_SECTION\_HEADER.SizeOfRawData"

- "Virtual Addr." --> "IMAGE\_SECTION\_HEADER.VirtualAddress"

- "Virtual Size" --> "IMAGE\_SECTION\_HEADER.VirtualSize"

Cada par de campos (_Raw_ y _Virtual_) sirven para calcular dónde termina una sección, tanto en disco como en memoria, qué es justamente de lo que hemos estado hablando antes.

Por ejemplo, la sección .text en disco tiene una dirección 0x400 y un tamaño de 0x1200. Sumando ambos, obtenemos 0x1600, que marca el límite final de la sección .text y el inicio de la siguiente. Este valor indica el primer byte inmediatamente después de la sección .text en el archivo en disco.

En memoria, podemos hacer un cálculo similar. La sección .text tiene una dirección virtual ("VirtualAddress") de 0x1000 y un tamaño virtual ("VirtualSize") de 0x10C9. Aunque el tamaño real de la sección es de 4297 bytes (0x10C9 en hexadecimal), las secciones deben comenzar en direcciones que sean múltiplos de "IMAGE\_OPTIONAL\_HEADER.SectionAlignment" (0x1000 en hexadecimal, 4096 en decimal). Esto significa que la sección .text comienza en 0x1000.

Debido a que el "VirtualSize" de la sección .text (4297 bytes) excede el tamaño de "SectionAlignment" (4096 bytes), la sección ocupa más de un intervalo de alineación. Al sumar la dirección virtual inicial y el tamaño virtual (0x1000 + 0x10C9), obtenemos 0x20C9, que es donde termina la sección .text en memoria. Sin embargo, las secciones deben comenzar en direcciones que sean múltiplos de "SectionAlignment", por lo que la siguiente sección comienza en la siguiente dirección alineada después de 0x20C9. El siguiente múltiplo de 0x1000 después de 0x20C9 es 0x3000.

Por lo tanto, aunque el "VirtualSize" de la sección .text no es un múltiplo de "SectionAlignment", el sistema operativo reserva espacio en memoria desde 0x1000 hasta 0x3000 para la sección .text, extendiendo su límite final hasta 0x3000, que es el comienzo de la siguiente sección en memoria, la sección .rdata. Por lo que existe un espacio no utilizado entre el final real de los datos de la sección .text y el inicio de la siguiente sección.

Para acabar, el campo "Characteristics" indica que algunas secciones son de solo lectura, otras permiten lectura y escritura, y algunas son ejecutables. Por otro lado, los campos "Ptr to Reloc.", "Num. of Reloc." y "Num. of Linenum." se encuentran en cero, lo cual es normal al tratarse de un archivo de imagen.

## Conclusión

Bueno pues hasta aquí hemos visto prácticamente lo mas fundamental del formato Portable Executable (PE), no es todo porque aun quedan cosas por ver pero sin duda que ahora sabes lo fundamental. Conocer como se estructura este tipo de archivo es verdaderamente importante si quieres aprender tanto desarrollo como análisis de malware.

## Referencias

- [MalDev Academy - 10% de descuento con el código DEEPHACKING10](https://maldevacademy.com/)
- [Windows PE File Structure - Malcore](https://bible.malcore.io/readme/the-journey/windows-pe-structure)
- [A dive into the PE file format - Introduction - 0xRick](https://0xrick.github.io/win-internals/pe1/)
- [A dive into the PE file format - PE file structure - Part 1: Overview - 0xRick](https://0xrick.github.io/win-internals/pe2/)
- [A dive into the PE file format - PE file structure - Part 2: DOS Header, DOS Stub and Rich Header - 0xRick](https://0xrick.github.io/win-internals/pe3/)
- [A dive into the PE file format - PE file structure - Part 3: NT Headers - 0xRick](https://0xrick.github.io/win-internals/pe4/)
- [A dive into the PE file format - PE file structure - Part 4: Data Directories, Section Headers and Sections - 0xRick](https://0xrick.github.io/win-internals/pe5/)
- [An Introduction to Malware Analysis - PE format - crow](https://youtu.be/-cIxKeJp4xo?si=76LAoadT1qQ8GEuI&t=1110)
- [Portable Executable File Format - kowalczyk](https://blog.kowalczyk.info/articles/pefileformat.html)
- [Portable Executable Format: Made Easy - v0rkath](https://www.v0rkath.com/blog/portable-executable-format/)
- [File formats dissections and more... - corkami](https://github.com/corkami/pics/)
- [Why is 0x00400000 the default base address for an executable?](https://devblogs.microsoft.com/oldnewthing/20141003-00/?p=43923)
- [VA (Virtual Address) & RVA (Relative Virtual Address)](https://stackoverflow.com/questions/2170843/va-virtual-address-rva-relative-virtual-address)
- [/BASE (Base address)](https://learn.microsoft.com/en-us/cpp/build/reference/base-base-address?view=msvc-170)
- [winnt.h - mingw-w64](https://github.com/Alexpux/mingw-w64/blob/master/mingw-w64-tools/widl/include/winnt.h)
- [Windows Portable Executable (PE) Files Structure - filovirid.com](https://blog.filovirid.com/page/Windows-Portable-Executable-Files-Structure)
- [Difference Between Linker and Loader - GeeksForGeeks](https://www.geeksforgeeks.org/difference-between-linker-and-loader/)
- [Compilation process with GCC and C programs - luischaparroc](https://medium.com/@luischaparroc/compilation-process-with-gcc-and-c-programs-344445180ac8)
