---
id: "fundamentos-para-stack-based-buffer-overflow"
title: "Fundamentos para Stack based Buffer Overflow"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-10-17
updatedDate: 2021-10-17
image: "https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-0.webp"
description: "Guía completa sobre los fundamentos del Stack-based Buffer Overflow: registros, memoria, stack frames, funciones y técnicas de explotación."
categories:
  - "low-level"
draft: false
featured: false
lang: "es"
---

Antes de la explotación del Buffer Overflow tenemos que entender que ocurre cuando ejecutamos este tipo de ataque, para ello vamos a empezar desde lo más básico.

Índice:

- [Introducción](#introducción)
- [Registros](#registros)
- [Proceso en la memoria](#proceso-en-la-memoria)
- [Stack](#stack)
- [Funciones](#funciones)
- [Endianness](#endianness)
- [NOPS - No Operation Instruction](#nops---no-operation-instruction)

## Introducción

La CPU (Unidad Central de Procesamiento), es la parte de nuestro ordenador que se encarga de ejecutar el "código máquina". El código máquina es una serie de instrucciones que la CPU procesa. Siendo estas instrucciones, cada una de ellas un comando básico que ejecuta una operación específica, como mover datos, cambiar el flujo de ejecución del programa, hacer operaciones aritméticas, operaciones lógicas, etc.

Las instrucciones de la CPU son representadas en hexadecimal. Sin embargo, ésta misma instrucciones son traducidas a código mnemotécnico (un lenguaje mas legible), y es esto lo que conocemos como código ensamblador (ASM).

Entonces, de forma gráfica, la diferencia entre el código máquina y el lenguaje ensamblador es la siguiente:

<figure>

![Comparación entre código máquina y lenguaje ensamblador](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-1.avif)

<figcaption>

Referencia: [Quora - Is assembly language a source code or object code?](https://www.quora.com/Is-assembly-language-a-source-code-or-object-code)

</figcaption>

</figure>

Cada CPU tiene su Conjunto de Instrucciones, en inglés: `Instruction Set Architecture (ISA)`.

El ISA es una serie de instrucciones que el programador o el compilador debe entender y usar para poder escribir un programa correctamente para esa CPU y máquina en específico.

En otras palabras, ISA es lo que el programador puede ver, es decir, memoria, registros, instrucciones, etc. Da toda la información necesaria para el que quiera escribir un programa en ese lenguaje maquina.

## Registros

Cuando se habla de que un procesador es de 32 o 64 bits, se refiere al ancho de los registros de la CPU. Cada CPU tiene un conjunto de registros que son accesibles cuando se requieren. Se podría pensar en los registros como variables temporales usadas por la CPU para obtener y almacenar datos.

Hay registros que tienen una función específica, mientras que hay otros que solo sirven como se dice arriba, para obtener y almacenar datos.

En este caso, nos vamos a centrar e los registros GPRs (Registros de Propósito General):

<figure>

![Tabla de Registros de Propósito General](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-2.avif)

<figcaption>

Registros de Propósito General

</figcaption>

</figure>

En la primera columna como vemos, pone "Nomenclatura x86", esto es porque dependiendo de los bits del procesador, la nomenclatura es distinta:

<figure>

![Nomenclatura de registros según arquitectura](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-3.avif)

<figcaption>

Referencia: [Decoder Cloud - Idiot's Guide to Buffer Overflow on GNU/Linux x64 Architecture](https://decoder.cloud/2017/01/25/idiots-guide-to-buffer-overflow-on-gnulinux-x64-architecture/)

</figcaption>

</figure>

- En las CPU de 8 bits, se añadia el sufijo L o H dependiendo de si se trataba de un Low byte o High Byte.
- En las CPU de 16 bits, el sufijo era la X (sustituyendolo por la L o H de las CPU de 8 bits), excepto en el ESP, EBP, ESI y EDI, donde simplemente quitaron la L.
- En las CPU de 32 bits, como vemos, se añade el prefijo E, refiriendose a Extender.
- Por último, en las CPU de 64 bits, la E se reemplaza por la R.

Además de los 8 GPR, hay otro registro que será muy importante para nosotros, se trata del EIP (en la nomenclatura x86). El EIP (Extended Instruction Pointer) contiene la dirección de la próxima instrucción del programa.

## Proceso en la memoria

Cuando se ejecuta un proceso, se organiza en la memoria de la siguiente forma:

<figure>

![Organización de un proceso en memoria](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-4.avif)

<figcaption>

Proceso en memoria

</figcaption>

</figure>

La memoria se divide en 4 regiones: Text, Data, Heap y Stack.

- `Text`: es establecido por el programa y contiene su código, éste área está establecida de solo lectura.
- `Data`: esta region se divide en datos inicializados y datos no inicializados.
    - Los datos inicializados incluyen objetos como variables estáticas y globales que ya han sido predefinidas y pueden ser modificadas.
    - Los datos no inicializados, llamados también BSS (Block Started by Symbol), también inicializan variables, pero estas se inicializan como 0 o sin ninguna inicializacion explícita, por ejemplo: `static int t`.
- `Heap`: aquí es donde se encuentra la memoria dinámica, es decir, durante la ejecución, el programa puede requerir mas memoria de lo que estaba previsto, por ello, a través de llamadas al sistema como `brk` o `sbrk` y todo controlado a través del uso de `malloc`, `realloc` y `free`, se consigue un área expandible en base a lo necesario.
- `Stack`: es el área donde ocurre todo, vamos a dedicarle un punto:

## Stack

El stack es un bloque o estructura de datos con modo de acceso LIFO (Last In, First Out; último en entrar, primero en salir), y está ubicado en la **High Memory**. Se puede pensar en el stack como un array usado para almacenar direcciones de retornos de funciones, pasar argumentos a funciones y almacenar variables locales.

Algo curioso del stack, es que crece hacia **Low Memory**, es decir, crece hacia abajo, hacia **0x00000000**.

Siendo el stack de modo de acceso LIFO, existen dos operaciones principales, antes de entrar a explicar cada una de ellas, voy a definir un registro importante para entender estas dos operaciones:

--> ESP (Stack Pointer): es un registro el cual apunta siempre a la cima del stack (top of the stack). En este punto hay que darse cuenta que, como el stack crece hacia abajo, es decir, hacia Low Memory, conforme el ESP esté mas cerca del 0x00000000 mas grande es el stack.

- Operación PUSH

La operación de PUSH lo que hace es restar al ESP. En CPU de 32 bits, resta 4 mientras que en 64, 8. Si lo pensamos bien, si el PUSH en vez de restar, sumase, estariamos sobreescribiendo/perdiendo datos.

Ejemplo de PUSH T:

<figure>

![Diagrama de operación PUSH en el stack](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-5.avif)

<figcaption>

Referencia: [JavaPoint - Stack Push Operation](https://www.javatpoint.com/stack-push-operation)

</figcaption>

</figure>

Ahora, por ejemplo, de forma mas técnica, si el valor inicial del ESP fuese `0x0028FF80`, e hiciésemos un PUSH 1, el ESP disminuiria -4, conviertiéndose en `0x0028FF7C` y entonces, el 1 se pondría en la cima del stack.

De forma detallada, la dirección iria cambiando tal que:

<figure>

![Ejemplo detallado de operación PUSH](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-6.avif)

<figcaption>

Ejemplo de operación PUSH

</figcaption>

</figure>

- Operacion POP

El caso del POP es igual pero al contrario, en 32 bits también se suma 4 y en 64, 8. El POP lo que haría en este caso sería quitar el valor que está en la cima del stack, es decir, los datos que se encuentren en la dirección donde apunta ahora mismo el ESP. Estos datos que se quitan normalmente se almacenarian en otro registro.

Ejemplo de POP T:

<figure>

![Diagrama de operación POP en el stack](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-7.avif)

<figcaption>

Referencia: [JavaPoint - Stack Pop Operation](https://www.javatpoint.com/stack-pop-operation)

</figcaption>

</figure>

De nuevo, de forma mas técnica, si por ejemplo, despues del PUSH 1 anterior, el ESP vale `0x0028FF7C`, haciendole la operacion `POP EAX` quitariamos lo previamente empujado, haciendo que el ESP volviese a valer `0x0028FF80`, y, además, haciendo que el valor quitado, se copie al registro EAX (en este caso).

Es importante saber que el valor que se quita no se elimina o se vuelve 0. Se queda en el stack hasta que otra instrucción lo sobreescriba.

## Funciones

Ahora que se entiende mejor el stack, vamos a ver las funciones. Éstas, alteran el flujo normal del programa y cuando una función acaba, el flujo vuelve a la parte desde donde ha sido llamada.

Hay dos fases importantes aquí:

- **Prólogo**: es lo que ocurre al principio de cada función. Crea el stack frame correspondiente.
- **Epílogo**: exactamente lo contrario al prólogo. Ocurre al final de la funcion cuando ésta acaba. Su propósito es restaurar el stack frame de la función que llamó a la que acaba de terminar.

Por lo que el stack consiste en `stack frames` (porciones o areas del stack), que son empujadas (PUSH) cuando se llama a una función y quitadas (POP) cuando devuelve el valor esa funcion.

Cuando una funcion empieza, se crea un stack frame que se asigna a la dirección actual del ESP.

Cuando la funcion termina, ocurren dos cosas:

- El programa recibe los parámetros pasados a la subrutina
- El EIP se resetea a la dirección de la llamada inicial.

Dicho de otra forma, el stack frame mantiene el control de la direccion donde cada `subrutina`/`stack frame` debe volver cuando acaba.

Vamos a ver un ejemplo práctico básico para que se vea todo mas claro:

<figure>

![Ejemplo de código simple en C](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-8.avif)

<figcaption>

Ejemplo código simple en C

</figcaption>

</figure>

1. El programa empieza por la funcion main. El primer stack frame que debe ser empujado (PUSH) al stack es `main() stack frame`. Así que una vez se inicia, un nuevo stack frame se crea, el main() stack frame.
2. Dentro de `main()`, se llama a la función `a()`, por lo que el ESP está apuntando a la cima del stack de `main()` y aquí se crea el stack frame para `a()`.
3. Dentro de `a()`, se llama a `b()`, por lo que estando el ESP en la cima del stack frame de `a()` se crea el stack frame para `b()`.
4. A la hora de acabar y que cada funcion vaya llegando a su return, es el proceso contrario, entraremos en detalle en el siguiente ejemplo.

<figure>

![Proof of Concept del flujo de stack frames](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-9.avif)

<figcaption>

POC (proof of concept)

</figcaption>

</figure>

- Ejemplo mas complejo y en detalle:

<figure>

![Ejemplo de código en C más complejo](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-10.avif)

<figcaption>

Ejemplo código en C

</figcaption>

</figure>

Cuando una función comienza, lo primero que se añade al stack son los parámetros, en este caso, el programa comienza en la función `main()` y añade mediante PUSH al stack los parámetros `argc` y `argv` , en orden de derecha a izquierda (siempre es así).

El stack se vería asi:

<div style="text-align: center;"><code>High Memory</code></div>

![Stack inicial con parámetros](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-11.avif)

<div style="text-align: center;"><code>Low Memory</code></div>

<br>

Ahora, se hace la llamada (CALL) a la función main(). Se empuja el contenido del EIP (Instruction Pointer) al stack y se apunta al primer byte después del CALL.

Este punto es importante porque tenemos que saber la dirección de la siguiente instrucción para poder seguir una vez la función llamada retorne.

<div style="text-align: center;"><code>High Memory</code></div>

![Stack después de guardar EIP](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-12.avif)

<div style="text-align: center;"><code>Low Memory</code></div>

<br>

Ahora estamos dentro de la funcion main(), se tiene que crear un nuevo stack frame para ésta funcion. El stack frame es definido por el EBP (Frame Pointer) y el ESP (Stack Pointer).

Como no queremos perder información del anterior stack frame, debemos guardar el EBP actual del stack, ya que si no hacemos esto cuando retornemos, no sabremos que información pertenecía al anterior stack frame, la que llamó a main().

Una vez se ha guardado el valor del EBP, el EBP se actualiza y apunta a la cima del stack. En este punto, el EBP y el ESP apuntan al mismo sitio

<div style="text-align: center;"><code>Low Memory</code></div>

![Stack con EBP y ESP apuntando al mismo sitio](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-13.avif)

<div style="text-align: center;"><code>High Memory</code></div>

<br>

Desde este punto, el nuevo stack frame comienza encima del anterior (old stack frame).

Toda esta secuencia de instrucciones llevadas a cabo hasta ahora es lo que se conoce como "prólogo". Esta fase ocurre en todas las funciones. Las instrucciones llevadas a cabo hasta ahora, en ensamblador, serían las siguientes:

1. `push ebp`
2. `mov ebp, esp`
3. `sub esp, X` // Donde X es un número

El stack antes de estas tres instrucciones es el siguiente:

<div style="text-align: center;"><code>Low Memory</code></div>

![Stack antes del prólogo](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-14.avif)

<div style="text-align: center;"><code>High Memory</code></div>

<br>

La primera instrucción (`push ebp`), guarda el EBP empujándolo al stack, correspondiendose en el stack a "old EBP", para que se pueda restaurar una vez la función retorne.

Ahora el EBP está apuntando a la cima del anterior stack frame (old stack frame).

Con la segunda instrucción (`mov ebp, esp`), conseguimos que el ESP se mueva donde está el EBP, creando ahora si, un nuevo stack frame:

<div style="text-align: center;"><code>Low Memory</code></div>

![Stack después de crear nuevo frame](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-15.avif)

<div style="text-align: center;"><code>High Memory</code></div>

<br>

Recordemos que en este punto, el EBP y el ESP están ubicados en la misma dirección.

La tercera instrucción (`sub esp, X`), mueve el ESP disminuyendo su valor (que como el stack crece hacia abajo, está por así decirlo, aumentando). Esto es necesario para hacer espacio para las variables locales de la función.

Esta instrucción básicamente está haciendo la siguiente operación:

- ESP = ESP - X

Dejando el stack, en la siguiente forma:

<div style="text-align: center;"><code>Low Memory</code></div>

![Stack con espacio reservado para variables locales](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-16.avif)

<div style="text-align: center;"><code>High Memory</code></div>

<br>

Ahora que el prólogo ha terminado, el stack frame para la función main() está completado. Ahora, hemos creado un hueco, que se puede ver en la imagen superior, para las variables locales.

Pero ocurre un problema, el ESP no está apuntando a la memoria que hay después del "old EBP", sino que está apuntando a la cima del stack. Por lo que si hacemos un PUSH para añadir cada variable local, no se estaría empujando a la memoria reservada para ellas.

Así que no podemos usar este tipo de operación.

Así que, en este caso, trayendo el código para recordarlo:

<figure>

![Código en C con variables locales](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-17.avif)

<figcaption>

Código en C

</figcaption>

</figure>

Vamos a tener que usar otro tipo de operación, y será la siguiente:

- `MOV DWORD PRT SS:[ESP+Y], 0B`

Teniendo en cuenta que 0B es 11, y estamos hablando de la primera variable declarada en main() como podemos ver en el código. Esta instrucción significa:

- Mueveme el valor 0B a la dirección de memoria que apunte ESP+Y. Siendo Y un número y ESP+Y una dirección de memoria entre EBP y ESP.

Este proceso se repetirá para todas las variables que se tengan que declarar. Una vez completado, el stack tendrá esta forma:

<div style="text-align: center;"><code>Low Memory</code></div>

![Stack con variables locales almacenadas](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-18.avif)

<div style="text-align: center;"><code>High Memory</code></div>

<br>

Despues de colocar las 3 variables, el main() ejecutará la siguiente instrucción. En términos generales, el main() seguirá con su ejecución.

En este caso, el main() ahora llama a la función test(), por lo que otro stack frame se creará.

El proceso será el mismo que lo visto hasta ahora:

- PUSH a los parámetros de la función
- Llamada a la función
- Prólogo (entre otras cosas, actualizará el EBP y el ESP para el nuevo stack frame)
- Almacenará las variables locales en el stack

Al final de todo este proceso, el stack se verá de esta forma:

<div style="text-align: center;"><code>Low Memory</code></div>

![Stack completo con función test](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-19.avif)

<div style="text-align: center;"><code>High Memory</code></div>

<br>

Hasta este punto, solo hemos visto la mitad del proceso, el cómo se crea los stack frames. Ahora vamos a ver como se destruyen, es decir, que ocurre cuando se ejecuta una sentencia return, que es también, lo que se conoce como "epílogo".

En el epílogo, ocurre lo siguiente:

- Se devuelve el control al caller (a quien llamó a la función)
- El ESP se reemplaza con el valor actual de EBP, haciendo que ESP y EBP apunten al mismo sitio. Ahora se hace un POP a EBP para que se recupere el anterior EBP.
- Se vuelve al caller haciendo un POP al EIP y luego saltando a él.

El epílogo se puede representar como:

- leave
- ret

En instrucciones en ensamblador correspondería a:

1. `mov esp, ebp`
2. `pop ebp`
3. `ret`

Cuando se ejecuta la primera instrucción (`mov esp, ebp`), el ESP valdrá lo mismo que el EBP y por lo tanto, el stack obtiene la siguiente forma:

<div style="text-align: center;"><code>Low Memory</code></div>

![Stack después de mov esp, ebp](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-20.avif)

<div style="text-align: center;"><code>High Memory</code></div>

<br>

Con la segunda instrucción (`pop ebp`), se hace un POP al EBP (donde también se encuentra en este momento el ESP). Por lo que al quitarlo del stack. El "old EBP" vuelve a ser el principal, y de esta forma, se ha restaurado el anterior stack frame:

<div style="text-align: center;"><code>Low Memory</code></div>

![Stack después de pop ebp](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-21.avif)

<div style="text-align: center;"><code>High Memory</code></div>

<br>

Con la tercera instrucción (`ret`), se vuelve a la dirección de retorno del stack (referencia: [Oracle - Instruction Set Reference - ret](https://docs.oracle.com/cd/E19455-01/806-3773/instructionset-67/index.html))

Con esto, conseguimos que el ESP apunte a "old EIP", de tal forma que el stack quede de la siguiente forma:

<div style="text-align: center;"><code>Low Memory</code></div>

![Stack después de ret](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-22.avif)

<div style="text-align: center;"><code>High Memory</code></div>

<br>

En este punto, todo se ha restaurado correctamente, y el programa ya seguiría a la siguiente instrucción después de la llamada a test(). Y cuando acabe, ocurre el mismo proceso.

## Endianness

La forma de representar y almacenar los valores en la memoria es en Endianness, donde dentro de éste formato hay 2 tipos:

- big-endian
- little-endian

<figure>

![Comparación entre Big Endian y Little Endian](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-23.avif)

<figcaption>

Referencia: [SKMP Dev - Negative Addressing and BSWAP](https://skmp.dev/blog/negative-addressing-bswap/)

</figcaption>

</figure>

Ejemplo:

Si representamos el número 11, en 4 bytes y en hexadecimal, obtenemos el siguiente valor:

- 0x000000**0B**

Siendo 0B = 11

Si por ejemplo, víesemos que en la dirección de memoria 0x0028FEBC se encuentra 0x0000000B, si estamos en un **sistema que usa Little Endian**, podriamos entender en que dirección de memoria está cada byte con lo siguiente:

A 0x000000**0B**, hacemos la operación de la imagen, quedandose tal que:

<div style="text-align: center;">

0B

00

00

**00**

</div>

El último valor, el resaltado, tiene como dirección de memoria la ya vista arriba: 0x0028FEBC, por lo que podríamos obtener los demás valores tal que:

<div style="text-align: center;"><code>high memory</code></div>

<br>

<div style="text-align: center;">

0B : 0x0028FEBF

00 : 0x0028FEBE

00 : 0x0028FEBD

**00 : 0x0028FEBC**

</div>

<div style="text-align: center;"><code>low memory</code></div>

<br>

En forma de ecuación por así decirlo, podriamos expresarlo de la siguiente manera:

<div style="text-align: center;">

a = 0x0028FEBC

0B : a + 3

00 : a + 2

00 : a + 1

00 : a

</div>

Si el sistema hubiese sido Big Endian sería exactamente al revés, las direcciones hubieran correspondido a:

<div style="text-align: center;"><code>high memory</code></div>

<br>

<div style="text-align: center;">

00 : 0x0028FEBF

00 : 0x0028FEBE

00 : 0x0028FEBD

**0B : 0x0028FEBC**

</div>

<div style="text-align: center;"><code>low memory</code></div>

<br>

Es importante saber la diferencia ya que lo necesitaremos para escribir payloads de cara a un Buffer Overflow.

## NOPS - No Operation Instruction

El NOP es una instrucción del lenguaje ensamblador que no hace nada. Si un programa se encuentra un NOP simplemente saltará a la siguiente instrucción. El NOP es normalmente representado en hexadecimal como 0x90, en los sistemas x86.

El NOP-sled es una técnica usada durante la explotación de buffer overflows. Su propósito es llenar ya sea una gran porcion o pequeña del stack de NOPS. Esto nos permitirá controlar que instrucción queremos ejecutar, la cual será la que normalmente se coloque despues del NOP-Sled.

![Diagrama de NOP-sled](https://cdn.deephacking.tech/i/posts/fundamentos-para-stack-based-buffer-overflow/fundamentos-para-stack-based-buffer-overflow-24.avif)

La razon de ésto es porque quizas el buffer overflow en cuestion del programa, necesite un tamaño y dirección específico porque será la que el programa esté esperando. O también nos puede facilitar conseguir que el EIP apunte a nuestro payload/shellcode.
