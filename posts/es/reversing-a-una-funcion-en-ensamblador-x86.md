---
id: "reversing-a-una-funcion-en-ensamblador-x86"
title: "Reversing a una función ASM x86-32"
author: "adria-perez-montoro"
publishedDate: 2024-09-25
updatedDate: 2024-09-25
image: "https://cdn.deephacking.tech/i/posts/reversing-a-una-funcion-en-ensamblador-x86/reversing-a-una-funcion-en-ensamblador-x86-0.webp"
description: "Análisis estático y dinámico de una función en ensamblador x86-32. Aprende reversing mediante un ejercicio práctico del libro Practical Reverse Engineering."
categories:
  - "low-level"
draft: false
featured: false
lang: "es"
---

Buenas a todos y bienvenidos a este artículo, soy b1n4ri0 (otra vez). Hoy vamos a pelearnos un poco con un ejercicio de ingeniería inversa. En esta ocasión, vamos a resolver el ejercicio 1 del primer capítulo del libro _[Practical Reverse Engineering](https://www.amazon.es/Practical-Reverse-Engineering-Reversing-Obfuscation-ebook/dp/B00IA22R2Y)_.

A modo de introducción, el ejercicio trata sobre una función en ensamblador x86-32. Principalmente, se nos pide que expliquemos qué hace esta función y con qué tipos de datos opera.

Resolveremos el ejercicio de dos formas diferentes: primero con análisis estático y luego con análisis dinámico. Esto servirá como ejemplo para los que sois nuevos en el mundo del reversing. La intención es explicar todo en detalle y con dibujitos para que sea más fácil de entender.

En cualquier caso, si aún así os quedan dudas, no dudéis en preguntar en los comentarios o en la comunidad Яeverse ESP. Por si todavía no la conocéis, esta comunidad se enfoca en la seguridad a bajo nivel (entre otras cacharrerías y proyectos variados). Podéis encontrarnos tanto en [Discord](https://discord.gg/HxvetecGFF) como en [Telegram](https://t.me/reversersesp).

Antes de empezar el artículo recomiendo encarecidamente que tengáis conocimiento de los temas tratados en los siguientes recursos para poder comprender de una mejor forma ciertas prácticas llevadas a cabo en este post:
- [Guía de x86 de University of Virginia](https://www.cs.virginia.edu/~evans/cs216/guides/x86.html#calling)
- [Registros x86 en RipTutorial](https://riptutorial.com/assembly/example/18064/x86-registers)
- [Fundamentos del registro x86 en LearnTutorials](https://learntutorials.net/es/x86/topic/2122/fundamentos-del-registro) (Recurso similar al segundo).
- [Documentación de GDB](https://sourceware.org/gdb/current/onlinedocs/gdb)
- [Introducción a ensamblador x86](https://bible.malcore.io/readme/the-beginning/introduction-to-x86-assembly)

Dicho esto, me gustaría deciros que me callo, pero no me gusta mentir :|.

- [Enunciado del ejercicio](#enunciado-del-ejercicio)
- [Método de trabajo](#método-de-trabajo)
    - [Comprensión del entorno](#comprensión-del-entorno)
    - [Ejemplo de traducción](#ejemplo-de-traducción)
- [Análisis Estático](#análisis-estático)
    - [SCAS/SCASB](#scasscasb)
        - [Funcionamiento SCASB:](#funcionamiento-scasb)
        - [Discusión de Recursos](#discusión-de-recursos)
        - [Relación de ESI y ECX con la Instrucción SCASB](#relación-de-esi-y-ecx-con-la-instrucción-scasb)
    - [REPNE](#repne)
        - [Funcionamiento REPNE](#funcionamiento-repne)
        - [Discusión de Recursos](#discusión-de-recursos-1)
        - [Rol de REPNE y SCASB en ECX y Status Flags](#rol-de-repne-y-scasb-en-ecx-y-status-flags)
    - [Segunda parte de la función](#segunda-parte-de-la-función)
    - [STOS/STOSB](#stosstosb)
        - [Funcionamiento STOSB](#funcionamiento-stosb)
        - [Discusión de recursos](#discusión-de-recursos-2)
    - [REP](#rep)
        - [Funcionamiento de REP](#funcionamiento-de-rep)
        - [Discusión de recursos](#discusión-de-recursos-3)
    - [Resumen de la teoría](#resumen-de-la-teoría)
- [Pseudocódigo en C](#pseudocódigo-en-c)
- [Análisis Dinámico](#análisis-dinámico)
    - [Debugging con GDB](#debugging-con-gdb)
    - [Resumen del depurado](#resumen-del-depurado)
- [Solución](#solución)
- [Despedida](#despedida)

## Enunciado del ejercicio

> _Esta función utiliza una combinación [SCAS](https://tizee.github.io/x86_ref_book_web/instruction/scas_scasb_scasw_scasd.html) y [STOS](https://tizee.github.io/x86_ref_book_web/instruction/stos_stosb_stosw_stosd.html) para realizar su trabajo. Primero, explique cuál es el tipo de \[EBP+8\] y \[EBP+C\] en las líneas 1 y 8, respectivamente. A continuación, explica qué hace este fragmento de código._

```asm
01: 8B 7D 08         mov   edi, [ebp+8]
02: 8B D7            mov   edx, edi
03: 33 C0            xor   eax, eax
04: 83 C9 FF         or    ecx, 0FFFFFFFFh
05: F2 AE            repne scasb
06: 83 C1 02         add   ecx, 2
07: F7 D9            neg   ecx
08: 8A 45 0C         mov   al, [ebp+0Ch]
09: 8B FA            mov   edi, edx
10: F3 AA            rep stosb
11: 8B C2            mov   eax, edx
```

## Método de trabajo

Lo más probable es que, si eres nuevo, te estés preguntando: ¿Cómo le hago ingeniería inversa a este tipo de ejercicios? Tranquilo, aquí te comento lo que hago normalmente yo:

Lo primero que suelo hacer es analizar el código por encima, leo todo el código e intento entender para qué sirve cada instrucción de manera general. Lo siguiente que hago es buscar las instrucciones que me resultan desconocidas y las estudio en profundidad. Por ejemplo: `repne`, `scasb`, `rep` y `stosb`.
- [Referencia del conjunto de instrucciones x86](https://tizee.github.io/x86_ref_book_web/instruction/)

Además, busco en algunos foros para complementar la información, pues suelen tener explicaciones más extensas.
- [Explicación de la secuencia de instrucciones rep stos en Stack Overflow](https://stackoverflow.com/questions/3818856/what-does-the-rep-stos-x86-assembly-instruction-sequence-do)
- [Discusión sobre repne scas en Reverse Engineering Stack Exchange](https://reverseengineering.stackexchange.com/questions/2774/what-does-the-assembly-instruction-repne-scas-byte-ptr-esedi)

Luego, con toda la información obtenida, genero mis conjeturas sobre cómo debería comportarse el código e intento argumentarlas.

Finalmente, le añado un contexto al código, es decir, añado lo que le falta para que pueda compilarse sin problemas. Lo compilo y lo depuro con GDB o con algún otro debugger para comprobar mis teorías y ver cómo funcionan realmente las instrucciones.

En resumen, primero realizo un análisis estático y luego uno dinámico.

#### Comprensión del entorno

Antes de empezar con la resolución, primero tenemos que entender el entorno. En este caso, tenemos un fragmento de código en ensamblador, pero parece que hay más cosas alrededor. Si nunca antes has visto nada de reversing o ensamblador, entonces lo más probable es que no sepas qué son estos números y letras. Pero tranquilo que esta sección es para ti, enseguida te explico con ayuda de un gráfico qué significa cada cosa:

![Esquema explicativo de la estructura del código ensamblador](https://cdn.deephacking.tech/i/posts/reversing-a-una-funcion-en-ensamblador-x86/reversing-a-una-funcion-en-ensamblador-x86-1.avif)

Concretamente, podemos dividir el entorno en tres bloques:
- Número de línea
- Representación del código en hexadecimal
- Código en ensamblador

El número de línea y el apartado del código en ensamblador no tienen mayor complejidad.

Principalmente quiero que se entienda la representación del código en hexadecimal, ya que nos será de gran utilidad en un futuro no muy lejano. Como se puede observar en el gráfico, la representación se puede dividir en dos partes:
1. Opcode
2. ModR/M Byte

El opcode indica la instrucción que se quiere ejecutar, mientras que el ModR/M especifica los operandos a los que se aplicará la instrucción.

La información que proporciona el ModR/M ocupa un byte, distribuido de la siguiente manera:
- 2 bits para el modo de direccionamiento (memoria-registro, registro-registro, etc.).
- 3 bits para especificar el registro destino.
- 3 bits para especificar el registro fuente o ubicación de memoria.

Hay instrucciones que no cuentan con el ModR/M Byte, como por ejemplo en la línea 5, `F2 AE → repne scasb`, dado que las propias instrucciones ya gestionan la memoria y los registros de forma implícita.

#### Ejemplo de traducción

Es probable que te estés preguntando qué pasa con las instrucciones de tres bloques, como por ejemplo la de la primera línea: `8B 7D 08`. Bien, lo primero es identificar los componentes:
1. `8B` → MOV opcode
2. `7D` → Si lo convertimos a binario: `0111 1101`:
    - `01` → mod = Acceso a memoria con desplazamiento de 1 byte. Esto significa que la operación no ocurre directamente entre registros, sino que involucra un acceso a memoria con un pequeño desplazamiento (8 bits).
    - `111` → reg = **EDI**
    - `101` → rm = **EBP**
3. `08` → Indica el desplazamiento respecto al registro EBP, en este caso de 8 bits.

Hay muchos otros conceptos y temas que se podrían tratar, como por ejemplo:
- Prefijos heredados (1-4 bytes, opcional)
- Opcode con prefijos (1-4 bytes, obligatorios)
- ModR/M (1 byte, en caso necesario)
- SIB (1 byte, en caso necesario)
- Desplazamiento (1, 2, 4 u 8 bytes, en caso necesario)
- Inmediato (1, 2, 4 u 8 bytes, si es necesario)

Los demás puntos que no hemos visto se escapan del alcance de este post. Sin embargo, dejo aquí algunos recursos para aprender más sobre estos temas:
- [Visión general de codificación de instrucciones X86-64](https://wiki.osdev.org/X86-64_Instruction_Encoding#General_Overview)
- [Explicación del byte ModR/M](http://c-jump.com/CIS77/CPU/x86/X77_0060_mod_reg_r_m_byte.htm)
- [Artículo sobre ModR/M en Wikipedia](https://en.wikipedia.org/wiki/ModR/M)

## Análisis Estático

Dejo por aquí el código otra vez para tenerlo más a mano.

```asm
01: 8B 7D 08         mov   edi, [ebp+8]
02: 8B D7            mov   edx, edi
03: 33 C0            xor   eax, eax
04: 83 C9 FF         or    ecx, 0FFFFFFFFh
05: F2 AE            repne scasb
06: 83 C1 02         add   ecx, 2
07: F7 D9            neg   ecx
08: 8A 45 0C         mov   al, [ebp+0Ch]
09: 8B FA            mov   edi, edx
10: F3 AA            rep stosb
11: 8B C2            mov   eax, edx
```

En esta sección iré al grano y asumiré que ya se tiene un conocimiento básico del funcionamiento y la utilidad de los registros. Además, recalco que, según el libro, trataremos este código como si fuera un programa escrito en C.

```asm
01: 8B 7D 08         mov   edi, [ebp+8]
```

- En esta primera instrucción, se está copiando el valor alojado en la dirección de memoria **EBP+8** al registro **EDI**. Por el momento, podemos pensar que **EBP+8** se trata de un argumento de la función (si te falta contexto consulta los enlaces del principio). Además, dado el uso de **EDI**, podemos deducir vagamente que el argumento es algún tipo de array (posiblemente de tipo `char`), aunque aún no afirmaremos nada.

```asm
02: 8B D7            mov   edx, edi
```

- La siguiente instrucción copia el valor de **EDI** en **EDX**. Puede que te preguntes por qué no hemos copiado directamente **\[ebp+8\]** a **EDX**. Básicamente, es por un tema de eficiencia, es más simple y rápido realizar una operación entre registros (reg-reg) que una operación entre un registro y memoria (mem-reg). Por lo tanto, ahora tanto el contenido de **\[ebp+8\]**, **EDI** y **EDX** tienen el mismo valor. De esta instrucción, podemos asumir que **EDX** está almacenando el valor temporalmente, al menos hasta que se demuestre lo contrario.

```asm
03: 33 C0            xor   eax, eax
```

- Esta es simple, se establece el valor del registro **EAX** a 0 mediante la operación `xor`.

```asm
04: 83 C9 FF         or    ecx, 0FFFFFFFFh
```

- En este caso, se usa la operación `or` para establecer el valor de **ECX** a `0xFFFFFFFF`. Este valor puede tener diferentes interpretaciones dependiendo de si se considera como entero con signo o sin signo. Por ahora, solo tenemos esta información disponible. Más adelante veremos qué representación toma.

```asm
05: F2 AE            repne scasb
```

A continuación, explico en detalle estas instrucciones:

#### SCAS/SCASB

![Referencia de la instrucción SCAS](https://cdn.deephacking.tech/i/posts/reversing-a-una-funcion-en-ensamblador-x86/reversing-a-una-funcion-en-ensamblador-x86-2.avif)

La instrucción `SCASB` se utiliza para escanear cadenas de bytes. Como muestra la imagen anterior, existen variaciones de `SCAS` que dependen del tamaño del valor a comparar. Según el tamaño del dato, se usa un registro u otro. Es importante precisar que, la lógica de la instrucción no cambia independientemente del tamaño de los datos/registros involucrados.

![Tabla de variaciones de SCAS](https://cdn.deephacking.tech/i/posts/reversing-a-una-funcion-en-ensamblador-x86/reversing-a-una-funcion-en-ensamblador-x86-3.avif)

###### Funcionamiento SCASB:

- Comparación:

La instrucción compara el valor en el registro **AL** con el byte en la dirección **ES:\[EDI\]** (modo de 32 bits) o **ES:\[DI\]** (modo de 16 bits), dependiendo del modo en el que se encuentre la CPU (16 o 32 bits / Modo Real o Protegido). El cálculo de **ES:\[EDI\]** varía según si está en modo real o protegido, pero no entraremos en detalles en este post para evitar extendernos demasiado. Quizás lo veamos más adelante si os gusta el contenido.

- Actualización de EDI o DI:

Después de cada comparación:
- Si `DF = 0` (hacia adelante): `EDI` o `DI` se incrementa en 1.
- Si `DF = 1` (hacia atrás): `EDI` o `DI` se decrementa en 1.

![Diagrama de funcionamiento de SCASB](https://cdn.deephacking.tech/i/posts/reversing-a-una-funcion-en-ensamblador-x86/reversing-a-una-funcion-en-ensamblador-x86-4.avif)

###### Discusión de Recursos

Según los siguientes recursos (que son el mismo contenido pero en diferentes páginas), parece que se realizan las siguientes operaciones cuando se utiliza la instrucción `SCASB`. Cabe recalcar que esto es solo un símil y que, en realidad, no sucede exactamente de esta forma. Simplemente se utiliza C para representar de manera más cómoda el funcionamiento de esta instrucción:
- [Referencia de SCAS/SCASB/SCASW/SCASD en tizee](https://tizee.github.io/x86_ref_book_web/instruction/scas_scasb_scasw_scasd.html#scan-string)
- [Referencia de SCAS/SCASB/SCASW/SCASD en c9x](https://c9x.me/x86/html/file_module_x86_id_287.html)

```c
if(IsByteComparison()) {
	Temporary = AL - Source;
	SetStatusFlags(Temporary);
	if(DF == 0) {
		(E)SI = (E)SI + 1;
		(E)DI = (E)DI + 1;
	}
	else {
		(E)SI = (E)SI - 1;
		(E)DI = (E)DI - 1;
	}
}
...
```

El código anterior se traduce de la siguiente forma:
- Primero, el código comprueba que, en efecto, estamos tratando con bytes utilizando la función `IsByteComparison();`.
- Luego, se realiza la comparación entre **AL** y **ES:\[EDI\]** y se almacena el resultado en la variable `Temporary`:

```c
Temporary = AL - Source;
```

- En base al contenido de `Temporary`, se ajustan los valores de las flags (**OF, SF, ZF, AF, PF,** y **CF** son las flags afectadas). Esto lo lleva a cabo la función `SetStatusFlags();`:

```c
SetStatusFlags(Temporary);
```

- Una vez actualizados los valores de las flags con la función `SetStatusFlags();`, se comprueba el estado de la flag de dirección (**DF**). Si **DF** es igual a 0, la comparación se hará de izquierda a derecha (de abajo hacia arriba en términos de memoria), de lo contrario, se hará a la inversa. Como podemos observar, se incrementa o decrementa el valor de **EDI/DI** en una unidad según el estado de **DF**:

```c
if(DF == 0) {
		(E)SI = (E)SI + 1;
		(E)DI = (E)DI + 1;
	}
	else {
		(E)SI = (E)SI - 1;
		(E)DI = (E)DI - 1;
	}
```

###### Relación de ESI y ECX con la Instrucción SCASB

Si estás leyendo con atención, es probable que te hayas dado cuenta de que no he mencionado nada sobre el incremento o decremento del registro **ESI**.

Esto se debe a que, en realidad, **ESI** no forma parte de la instrucción `SCASB`. Como acabamos de observar en la sección anterior, la comparación se hace entre el byte almacenado en **AL** y el byte almacenado en la dirección a la que apunta **ES:\[DI\]**, por lo que en este caso podemos omitir todo lo relacionado con **ESI** del código.

Un breve recordatorio sobre la función de estos registros:
- **ESI**: _Source Index_ → Generalmente se usa en instrucciones que cargan datos desde una ubicación en memoria a un registro.
- **EDI**: _Destination Index_ → Generalmente se usa en instrucciones que almacenan datos desde un registro a una ubicación en memoria.

Personalmente, creo que **ESI** es útil en una comparación entre dos cadenas, ya que puede usarse para apuntar a la cadena fuente (cadena1) mientras **EDI** se usa para la cadena destino (cadena2). En este caso, se podría cargar un byte de `cadena1` en **AL** utilizando **\[ESI\]** y luego compararlo con el valor apuntado por **EDI** utilizando la instrucción **SCASB**. Cabe destacar que **SCASB** no modifica el registro **ESI**, solo afecta a **EDI** avanzando su puntero automáticamente. (Obviamente hay formas mejores y más efectivas de realizar este proceso).

```asm
comparar_cadenas:
    mov al, [esi]          ; Carga el byte de cadena1 en AL
    scasb                  ; Compara AL con el byte en [edi]
    inc esi                ; Avanzar al siguiente carácter en cadena1
    jmp comparar_cadenas   ; Repite el proceso
```

Igualmente, en la sección de debugging comprobaremos que **ESI/SI** no forma parte de esta instrucción.

Al igual que los recursos anteriores mencionan a **ESI/SI**, el siguiente recurso expone su funcionamiento de forma clara y directa, donde **ESI/SI** no aparece en la descripción del funcionamiento de `SCAS`.

Quizás no quede demasiado claro en [este](https://www.aldeid.com/wiki/X86-assembly/Instructions/scasb) recurso, pero la modificación del registro **ECX** tampoco está dentro de la operación `SCAS`. Dado que es común ver `SCAS` acompañado de `REPNE`, se le añade este matiz. Sin embargo, la modificación de **ECX** es en realidad responsabilidad de la instrucción `REPNE`, como veremos a continuación.

#### REPNE

![Referencia de la instrucción REPNE](https://cdn.deephacking.tech/i/posts/reversing-a-una-funcion-en-ensamblador-x86/reversing-a-una-funcion-en-ensamblador-x86-5.avif)

La instrucción `REPNE` (REPeat while Not Equal) utiliza el registro **ECX** y la flag **ZF** (Zero Flag).

###### Funcionamiento REPNE

1. Repite la operación que le acompaña hasta que **ECX** sea igual a 0 o **ZF** sea igual a 1.
2. En cada iteración, el valor de **ECX** se decrementa en 1.

```c
while (ecx != 0) {
//logica del programa
		ecx --;
    if (ZF) break;
}
```

Por ejemplo, el programa `REPNE SCASB` se puede representar de la siguiente forma:

```c
while (ecx != 0) {
    ZF = (al == *(BYTE *)edi);
    if (DF == 0)
        edi++;
    else
        edi--;
    ecx--;
    if (ZF) break;
}
```

Usando de referencia _[esta página sobre REPNE](https://www.aldeid.com/wiki/X86-assembly/Instructions/repne)_.

###### Discusión de Recursos

Si consultamos el final de la página de referencia, encontramos varios ejemplos, entre los cuales se incluye el cálculo de la longitud de una cadena. Si examinamos el fragmento en ensamblador proporcionado, veremos que parte del código es bastante similar al de nuestra función:

```asm
.text:00402515                 mov     edi, [ebp+arg_0]
.text:00402518                 or      ecx, 0FFFFFFFFh
.text:0040251B                 xor     eax, eax
.text:0040251D                 repne scasb
```

```asm
01: 8B 7D 08         mov   edi, [ebp+8]
02: 8B D7            mov   edx, edi
03: 33 C0            xor   eax, eax
04: 83 C9 FF         or    ecx, 0FFFFFFFFh
05: F2 AE            repne scasb
```

Si organizamos las instrucciones, obtenemos las siguientes coincidencias:

```asm
mov   edi, [ebp+primer_arg]
xor   eax, eax
or    ecx, 0FFFFFFFFh
repne scasb
```

Esto sugiere que parte de nuestra función está diseñada para determinar la longitud de una cadena. Aunque hay algunas variaciones en el método empleado, así de primeras nos queda como incógnita el uso de la operación `mov edx, edi`. Lo más seguro es que influya a la lógica restante que nos queda por explorar de la función.

###### Rol de REPNE y SCASB en ECX y Status Flags

Bien, creo que es sensato retomar la notación ahora y recalcar el comportamiento y las propiedades de las instrucciones `REPNE` y `SCASB`. Como se ha observado en las secciones anteriores, la modificación del registro **ECX** es responsabilidad de la instrucción `REPNE`, mientras que `REPNE` únicamente compara el valor de la flag **ZF** y no la modifica. La modificación del estado de las distintas flags mencionadas forma parte del trabajo de `SCASB`. Es importante recalcar esto para evitar errores y confusiones.

Vamos a seguir con la siguiente línea ahora que ya sabemos qué registros se han visto afectados y como.

```asm
06: 83 C1 02         add   ecx, 2
```

- Esta instrucción suma 2 al valor que contiene el registro **ECX**. En la siguiente instrucción veremos el motivo.

```asm
07: F7 D9            neg   ecx
```

- En este punto, se revela la interpretación que debemos dar al valor de **ECX**, como se mencionaba en la explicación de la línea 4. ¿Cómo? La clave está en el uso de la instrucción `neg` en lugar de `not`.

Básicamente, `neg` realiza la negación del complemento a dos (utilizado en enteros con signo), mientras que `not` simplemente niega el valor tal cual está. Con esta información, podemos interpretar que el valor de **ECX** en la línea 4 se puede considerar como -1. Por lo tanto, ahora podemos afirmar que **ECX** contiene la longitud de un arreglo de caracteres, o comúnmente conocido como la longitud de una cadena (string).

Pero entonces, ¿por qué le sumamos 2 a **ECX** antes de negarlo? Esto se hace para contrarrestar dos cosas:
1. El hecho de empezar a contar en -1.
2. El valor nulo que indica el final de la string.

* * *

En resumen, hasta este punto, lo que tenemos es la longitud de una cadena almacenada en el registro **ECX**.

#### Segunda parte de la función

Continuamos con el siguiente bloque de la función, línea 8.

```asm
08: 8A 45 0C         mov   al, [ebp+0Ch]
```

- Esta instrucción carga el registro **AL**, que tiene un tamaño de 8 bits (1 byte), con el valor almacenado en la dirección a la que apunta **EBP+0Ch**. Al igual que en la línea 1, podemos deducir que se trata del segundo argumento de la función y, dado el tamaño de **AL**, podemos aproximar que se trata de un tipo de dato `char`, ya que en C el único tipo de dato que ocupa 1 byte es `char` (o `unsigned char`, sin contar otros tipos de datos definidos por el usuario). De todas formas, esto lo comprobaremos más adelante.

```asm
09: 8B FA            mov   edi, edx
```

- En este punto, se recupera el valor original de **EDI** utilizando el valor guardado en **EDX**. Como ya hemos visto en la línea 5, el valor de **EDI** se altera con la instrucción `SCASB`, lo que confirma que **EDX** se usa como registro de almacenamiento temporal en esta función.

```asm
10: F3 AA            rep stosb
```

A continuación, explico en detalle estas instrucciones:

#### STOS/STOSB

![Referencia de la instrucción STOS](https://cdn.deephacking.tech/i/posts/reversing-a-una-funcion-en-ensamblador-x86/reversing-a-una-funcion-en-ensamblador-x86-6.avif)

La operación `STOSB` es bastante sencilla de entender ahora que conocemos `SCASB`. Básicamente, `STOSB` copia el byte almacenado en **AL** en el operando de destino **ES:\[DI\]** o **ES:\[EDI\]**. Al igual que con `SCASB`, en cada iteración, el registro **EDI** se incrementa o decrementa dependiendo del valor de la flag de dirección (**DF**).

Aunque `STOSB` y `SCASB` comparten un comportamiento similar en cuanto a la actualización de **EDI**, existe una diferencia clave:
- `STOSB` modifica la memoria, ya que almacena el valor de **AL** en la dirección de destino.
- Por otro lado, `SCASB` solo modifica el registro **EDI** y las flags de estado tras realizar una comparación, sin modificar la memoria.

Además, `STOSB` no modifica ninguna de las flags de estado, mientras que `SCASB` sí lo hace, como hemos visto anteriormente.

###### Funcionamiento STOSB

- Copia el valor en el registro **AL** al byte en la dirección **ES:\[EDI\]** (modo de 32 bits) o **ES:\[DI\]** (modo de 16 bits).

Actualización de **EDI** o **DI**:
- Después de cada copia:
- Si `DF = 0` (hacia adelante): **EDI** o **DI** se incrementa en 1.
- Si `DF = 1` (hacia atrás): **EDI** o **DI** se decrementa en 1.

###### Discusión de recursos

En este caso, también se muestra un pseudocódigo en C en _[este recurso sobre STOS](https://tizee.github.io/x86_ref_book_web/instruction/stos_stosb_stosw_stosd.html#store-string)_, que, como es habitual, menciona al registro **ESI**, que manía le tienen al pobre registro **ESI** de verdad jajaja.

Por otro lado, en _[este otro recurso](https://www.aldeid.com/wiki/X86-assembly/Instructions/stos)_ se observa que la instrucción `STOSB` se usa comúnmente junto con la instrucción `REP`, que veremos a continuación.

#### REP

![Referencia de la instrucción REP](https://cdn.deephacking.tech/i/posts/reversing-a-una-funcion-en-ensamblador-x86/reversing-a-una-funcion-en-ensamblador-x86-7.avif)

Conociendo esta instrucción, ya contamos con suficiente información para formular una teoría completa sobre el comportamiento de la función. Huele a éxito, pero no vamos a celebrar nada de momento por si las moscas.

Volviendo al asunto, la instrucción `REP` repite la instrucción que le acompaña mientras el valor de `ECX ≠ 0`, o dicho de otra forma, se repite hasta que `ECX == 0`. Por supuesto en cada iteración, **ECX** se decrementa en 1.

###### Funcionamiento de REP

Al igual que en el caso de `REPNE`, el código para esta operación sería algo similar a:

```c
while (ecx != 0) {
//logica del programa
		ecx --;
}
```

En el caso específico de `REP STOSB`, el código equivalente sería algo como:

```c
while (ecx != 0) {
    *(BYTE *)edi = al;
    if (DF == 0)
        edi++;
    else
        edi--;
    ecx--;
}
```

Aquí está lo que hace `STOSB` y cómo interactúa con `REP`:
- `STOSB` copia el valor de **AL** en la dirección apuntada por **EDI**.
- Luego **EDI** se ajusta en función del flag de dirección (`DF`):
    - Si `DF = 0`, `EDI` se incrementa, avanzando a la siguiente dirección de memoria.
    - Si `DF = 1`, `EDI` se decrementa, moviéndose hacia direcciones de memoria más bajas.
- Este proceso se repite hasta que el valor de **ECX** llegue a 0. La instrucción `REP` sigue ejecutando `STOSB` hasta que **ECX** se ha decrementado a 0.

###### Discusión de recursos

Como comentaba en la sección anterior, tanto en _[el recurso de REP](https://www.aldeid.com/wiki/X86-assembly/Instructions/rep)_ como en el de `STOSB` aparece un ejemplo de estas operaciones en conjunto. Lo más probable es que, si conoces C/C++, este comportamiento te resulte familiar. En la próxima sección haremos una posible traducción de esta función en C, así que no te ralles.

```asm
;Recurso REP

.text:004013E0 mov     edi, offset user_id ; memory location 0x40D020 (empty)
.text:004013E5 mov     ecx, 20h            ; size: 32
.text:004013EA mov     al, 4Fh             ; fill with value 0x4F
.text:004013EC rep stosb                   ; fill 32 bytes with 0x4F at memory location 0x40D020

;4F = O / 20 = 32
; Por lo que el resultado en este caso la memoria desde 0x40D020 hasta 0x40D03F (32 bytes en total) contendrá el valor 0x4F (O).
```

#### Resumen de la teoría

Ahora sabemos que el valor de `ECX` equivale a la longitud de la cadena almacenada en `EBP+8`, `EDI` apunta a la dirección de `EBP+8`, y `AL` contiene el valor almacenado en `EBP+C`. Por lo tanto, el contenido de la cadena en `EBP+8` será reemplazado por el valor en `AL` repetido **_n_** veces, donde **_n_** es la longitud de la cadena en `EBP+8`.

Por ejemplo:

```c
(EBP + 8)_0 -> 'Bienvenidos a Reverse ESP la mejor comunidad de low level', 0
EBP + C -> '@'
//se ejecuta la función
(EBP + 8)_1 -> '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', 0
```

Con esto, ya tendríamos una deducción de lo que hace la función misteriosa XD.

```asm
11: 8B C2            mov   eax, edx
```

Finalmente, esta instrucción copia el resultado de `EDX` a `EAX`, ya que este registro es el que se suele usar para devolver el valor final de la función (convención de llamada x86). En este caso, dado que `EDX` no se ha visto implicado en ninguna operación, sigue apuntando a `EBP+8`, o lo que es lo mismo, al inicio de la cadena ya modificada en este caso.

## Pseudocódigo en C

```c
#include <string.h>
#include <stdio.h>

char* tachar(char *texto, char simbolo){
	int longitud = strlen(texto);
	memset(texto, simbolo, longitud);
	return texto;
}

int main(){
	char texto[] = "Bienvenidos a Reverse ESP la mejor comunidad de low level";
	char simbolo = '@';
	printf("%s\\n", tachar(texto, simbolo));
	return 0;
}
```

Output:

```plaintext
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
```

Por si te da palo compilarlo en local, puedes usar _[onlineGDB](https://onlinegdb.com/g8q-IjaMZ)_ para comprobar que el código funciona como esperábamos.

![Resultado de ejecución en onlineGDB](https://cdn.deephacking.tech/i/posts/reversing-a-una-funcion-en-ensamblador-x86/reversing-a-una-funcion-en-ensamblador-x86-8.avif)

## Análisis Dinámico

Esta sección es bastante más corta y rápida, ya que ahora sabemos qué hace cada instrucción y solo nos queda comprobar que realmente hagan lo que hemos ido deduciendo.

Lo primero es añadir un prólogo y un epílogo a la función.

ASM

```
censurar:
    push ebp           ; guarda el stack base pointer
    mov ebp, esp       ; hacemos que el base pointer apunte a ESP    
    ; --------------------------------------------
    mov edi, [ebp+8]   
    mov edx, edi       
    xor eax, eax       
    or ecx, 0FFFFFFFFh 
    repne scasb        
    add ecx, 2         
    neg ecx            
    mov al, [ebp+0Ch]  
    mov edi, edx       
    rep stosb          
    mov eax, edx       
    ; ----------------------------------------------
    mov esp, ebp       ; restaura el stack pointer
    pop ebp            ; restaura el stack base pointer
    ret
```

Bien, con esto tenemos una función “reglamentaria”. Ahora vamos a hacer que esto se pueda ejecutar como un programa normal.

Lo haremos de la siguiente manera: no voy a entrar en demasiados detalles con el código. Básicamente, definimos las secciones necesarias para alojar los datos y poder llamar a nuestra función. Lo demás es cargar los datos en la pila, llamar a la función y realizar las operaciones de limpieza y salida.

ASM

```
section .data
texto:
	db 'Bienvenidos a Reverse ESP la mejor comunidad de low level', 0
section .text
	global _start
_start:
	push byte '@' ;push del caracter con el que censuramos
	push dword texto ;push de la direccion de la cadena
	call censurar ;llamamos a la funcion
	add esp, 8 ;limpiamos los 2 parametros del stack
	mov eax, 1 ;sys_exit
	xor ebx, ebx ;codigo de salida 0
	int 0x80 ;llamada al sistema para salir
```

Una vez tenemos el código completo, lo compilamos y enlazamos utilizando `nasm` y `ld`, respectivamente.

Bash

```
nasm -f elf32 -g -F dwarf practicalre1.asm
ld -d elf_i386 -o practicalre1 practicalre1.o
```

Os dejo todos los archivos necesarios en mi GitHub:

- **[Hacking Research Zone - GitHub b1n4ri0](https://github.com/b1n4ri0/Hacking-Research-Zone)**

Vamos a ver qué significa cada argumento para que se pueda entender fácilmente:

**NASM**
- `-f elf32` → Define el formato del archivo de salida.
- `-g` → Activa la información de depuración.
- `-F dwarf` → Define el formato de la información de depuración, en este caso DWARF (_[Debugging With Attributed Record Formats](https://dwarfstd.org/)_). Este es un formato estándar que incluye no solo las instrucciones ensambladas, sino también información adicional de depuración, necesaria para que GDB pueda depurar de manera efectiva el código ensamblado.
- `practicalre1.asm` → Es el nombre del archivo a compilar.

**LD**
- `-d` → Conserva todas las secciones comunes y asegura que se asignen espacios para ellas, evitando que el enlazador elimine las secciones comunes que no están directamente referenciadas en el código.
- `elf_i386` → Especifica el formato del archivo de salida.
- `-o` → Especifica el nombre del archivo de salida (ejecutable).

Os dejo a continuación la documentación de cada comando:
- [Documentación de NASM](https://www.nasm.us/doc)
- [Manual de LD](https://ftp.gnu.org/old-gnu/Manuals/ld-2.9.1/html_mono/ld.html#SEC3)

#### Debugging con GDB

Los comandos que vamos a usar en GDB son los siguientes:

```bash
p/x $<registro> # Imprime el contenido del registro en formato hexadecimal.
p/d $<registro> # Imprime el contenido del registro en formato decimal.
p/c $<registro> # Imprime el contenido del registro como un carácter.
x/s $<registro/dirección de memoria> # Muestra el contenido de la dirección de memoria como una cadena de caracteres.
s # Ejecuta la siguiente instrucción del programa y entra en las llamadas a funciones.
run # Inicia la ejecución del programa desde el principio.
break *_start # Establece un punto de interrupción en la etiqueta _start.
```

En esta sección saldremos de dudas y comprobaremos que nuestro análisis estático es correcto.

```bash
b1n4ri0@hacking-research-zone:~/practicalre$ gdb -q practicalre1
Reading symbols from practicalre1...
(gdb) break *_start
Breakpoint 1 at 0x8049000: file practicalre1.asm, line 7.
(gdb) run
Starting program: /home/b1n4ri0/practicalre/practicalre1 

Breakpoint 1, _start () at practicalre1.asm:7
7		push byte '@' ;push del caracter con el que censuramos
(gdb) 
```

- Primero pasamos el programa a GDB y luego establecemos un breakpoint en `_start`.

```bash
(gdb) s
8		push dword texto ;push de la direccion de la cadena
(gdb) 
9		call censurar ;llamamos a la funcion
(gdb) 
15		push ebp
(gdb) 
16		mov ebp, esp
(gdb) p/x $ebp
$1 = 0x0
(gdb) p/x $esp
$2 = 0xffffd290
(gdb) s
censurar () at practicalre1.asm:17
17		mov edi, [ebp+8]
(gdb) p/x $ebp
$3 = 0xffffd290
(gdb) p/x $esp
$4 = 0xffffd290
(gdb) p/x $edi
$5 = 0x0
(gdb) 
```

- Comprobamos cómo funciona el prólogo de la función. Esta fase la he añadido para que no parezca raro cuando comprobemos los valores de los registros. Como se puede ver, los pasos se muestran con una instrucción de "retraso", es decir, cuando aparece por ejemplo la instrucción 16 en pantalla, significa que el siguiente paso es ese (la instrucción de la línea 16), no que ese paso es el que se acaba de efectuar. Como muestra, tenemos los valores de `EBP`, `ESP`, y `EDI`. Ahora, con esta información, vamos a depurar la función `censurar`.

```bash
(gdb) s
18		mov edx, edi
(gdb) p/x $edi
$6 = 0x804a000
(gdb) p/x $edx
$7 = 0x0

(gdb) s
19		xor eax, eax

(gdb) p/x $edi
$8 = 0x804a000
(gdb) p/x $edx
$9 = 0x804a000
(gdb) x/s 0x804a000
0x804a000 <texto>:	"Bienvenidos a Reverse ESP la mejor comunidad de low level"

(gdb) s
20		or ecx, 0xFFFFFFFF
(gdb) p/x $eax
$10 = 0x0
```

- En estos pasos comprobamos los valores de los registros y, efectivamente, observamos que el valor contenido en `EDI` y `EDX` es el primer argumento de la función, en este caso, apunta la cadena que hemos definido. También comprobamos que el valor de `EAX` se configura en 0.

```bash
(gdb) p/x $ecx
$11 = 0x0
(gdb) s
21		repne scasb
(gdb) p/x $ecx
$12 = 0xffffffff
(gdb) p/d $ecx
$13 = -1

(gdb) p/x $edi
$14 = 0x804a000
(gdb) p/x $esi ;
$15 = 0x0      ;
```

- Antes de ejecutar la siguiente instrucción, comprobamos que el valor de `ECX` es distinto de `0xFFFFFFFF`. Luego ejecutamos la instrucción y observamos el valor de `ECX` en hexadecimal y en decimal. Antes de ejecutar `REPNE SCASB`, comprobamos los valores de los registros afectados, es decir, `EDI` y `ECX`. También verificamos que `ESI` no tiene ninguna función en este caso, las líneas que corresponden a la comprobación terminan en `;` para diferenciarlos del debugging normal.

```bash
(gdb) s
22		add ecx, 2
(gdb) p/x $ecx
$16 = 0xffffffc5
(gdb) p/d $ecx
$17 = -59
(gdb) p/x $edi
$18 = 0x804a03a
(gdb) p/x $esi ;
$19 = 0x0      ; 
(gdb) x/s $edi
0x804a03a:	"\\034"
```

- Tras ejecutar `REPNE SCASB`, volvemos a comprobar el valor de los registros afectados. En este caso, observamos que el valor de `ECX` ha decrecido, tal como habíamos mencionado en el análisis estático. También comprobamos el valor de `EDI` y `ESI`. Con esto, podemos determinar que `ESI` no influye en la operación. La razón por la que `ESI` se menciona en el recurso, simplemente no lo sé XD.

```bash
(gdb) s
23		neg ecx
(gdb) p/x $ecx
$20 = 0xffffffc7
(gdb) p/d $ecx
$21 = -57

(gdb) s
24		mov al, [ebp+0xC]
(gdb) p/x $ecx
$22 = 0x39
(gdb) p/d $ecx
$23 = 57

(gdb) p/x $al
$7 = 0x0

(gdb) s
25		mov edi, edx
(gdb) p/x $al
$24 = 0x40
(gdb) p/c $al
$25 = 64 '@'
```

- Comprobamos que, en efecto, el valor de `ECX` se ajusta a la longitud de la cadena de texto. También verificamos que `AL` contiene el segundo argumento de la función, que en este caso es el carácter `@`, tal como lo hemos definido previamente.

```bash
(gdb) p/x $edx
$26 = 0x804a000
(gdb) p/x $edi
$27 = 0x804a03a
```

- En este punto, recordamos los valores de `EDX` y `EDI`.

```bash
(gdb) s
26		rep stosb
(gdb) p/x $edx
$28 = 0x804a000
(gdb) p/x $edi
$29 = 0x804a000
(gdb) p/x $ecx
$30 = 0x39
(gdb) p/x $esi ;
$31 = 0x0      ;
(gdb) p/x $si ;
$32 = 0x0     ;
```

- Observamos cómo `EDX` se usa como registro temporal para almacenar la dirección original de la cadena de texto (primer argumento). Después, comprobamos los valores de los registros afectados por la operación `REP STOSB`. De nuevo, comprobamos `ESI` para ver si realmente es afectado.

```bash
(gdb) s
27		mov eax, edx
(gdb) p/x $edi
$33 = 0x804a039
(gdb) p/x $ecx
$34 = 0x0
(gdb) p/x $esi ;
$35 = 0x0      ;
(gdb) p/x $si ;
$36 = 0x0     ;
```

- Ejecutamos `REP STOSB` y comprobamos el valor de los registros. Observamos que `ECX` ha decrecido a 0 y el valor de `EDI` también se ha modificado: **_0x804a039 - 0x804a000 = 0x39_** -> Valor Decimal = 57.
- Es decir, ha aumentado en base al valor de `ECX`, como ya comentábamos en el análisis estático. Por otra parte el valor de `ESI` se ha mantenido inmutable, como en la operación `REPNE SCASB`.

```bash
(gdb) p/x $eax
$37 = 0x40
(gdb) p/x $edx
$38 = 0x804a000
(gdb) x/s $edx
0x804a000 <texto>:	'@' <repeats 57 times>

(gdb) s
28		mov esp, ebp
(gdb) p/x $eax
$39 = 0x804a000
(gdb) x/s 0x804a000
0x804a000 <texto>:	'@' <repeats 57 times>
```

- Finalmente, comprobamos el valor del registro `EAX`, que es el que se va a almacenar como valor de retorno de la función. Antes de ejecutar la operación, contiene el valor de `AL`, como es lógico. Después de ejecutar la última instrucción de la función, el valor de `EAX` es igual al de `EDX`, que es la dirección de la cadena de texto que habíamos introducido como primer argumento. Al comprobar el contenido de la cadena, observamos que ha sido modificada con la operación `REP STOSB`, como indicamos en el análisis estático. Ahora, el contenido de la cadena son `57` repeticiones del carácter `@`, como lo indica GDB.

```bash
(gdb) s
29		pop ebp
(gdb) 
30		ret
(gdb) 
_start () at practicalre1.asm:10
10		add esp, 8 ;limpiamos los 2 parametros del stack
(gdb) 
11		mov eax, 1 ;sys_exit
(gdb) 
12		xor ebx, ebx ;codigo de salida 0
(gdb) 
13		int 0x80 ;llamada al sistema para salir
(gdb) 
[Inferior 1 (process 32407) exited normally]
```

- Por último, observamos el epílogo de la función y las operaciones de salida del programa.

#### Resumen del depurado

Como hemos podido observar, nuestras teorías y el análisis estático coinciden perfectamente con el análisis dinámico, lo que nos lleva a dos conclusiones:
1. La función censura el contenido introducido como primer argumento con el valor del segundo argumento.
2. El registro `ESI` no se utiliza originalmente en las operaciones `STOSB`, `SCASB`, `REP` y `REPNE`. De nuevo, sigue siendo un misterio el motivo por el cual se menciona en _[el recurso de tizee.github.io](https://tizee.github.io/x86_ref_book_web/instruction/scas_scasb_scasw_scasd.html#scan-string)_.

## Solución

> _Primero, explique cuál es el tipo de \[EBP+8\] y \[EBP+C\] en las líneas 1 y 8, respectivamente. A continuación, explica qué hace este fragmento de código._

- Como hemos argumentado a lo largo del post, `[EBP+8]` es un puntero a `char` o `char*`. Por otro lado, `[EBP+C]` es de tipo `char`.

Me gustaría aportar otro argumento adicional (por si no son suficientes), el simple hecho de que las instrucciones que afectan a estos parámetros tuvieran terminación en ‘b’ SCASB/STOSB nos indica que se están realizando operaciones con valores de 1 byte, que como bien se ha comentado anteriormente, corresponden al tipo de dato `char` (`unsigned char`) en lenguajes como C/C++. En este caso, se supone que trabajamos con C

- Esta función censura (sobrescribe) la cadena de caracteres que se pasa como primer argumento utilizando el carácter que se pasa como segundo argumento. Como ejemplo gráfico, se puede ver el apartado de pseudocódigo en C.

## Despedida

Ciertamente, este ha sido un post largo. Para algunos con más experiencia en reversing puede que haya resultado innecesariamente extenso, pero para aquellos que son nuevos, espero que haya servido como un punto de apoyo y que hayan podido entender cómo funciona exactamente la función proporcionada.

Como veis, el ejercicio no tiene ninguna complejidad, todo es cuestión de tiempo y de querer aprender de verdad, lamentablemente tenemos la manía de querer aprenderlo todo ya y si no es así nos sentimos mal. Todo tiene su proceso, y cuando resolví el ejercicio por primera vez, me llevó mucho más tiempo del que me hubiera gustado. Ahora veo que ese tiempo fue totalmente necesario.

Me hubiera encantado profundizar en detalles técnicos sobre el funcionamiento de la CPU, el comportamiento de los registros, la convención de llamadas x86, y otros temas como la codificación de instrucciones. Sin embargo, siendo realistas, el post habría sido demasiado extenso. Es probable que trate estos temas y otros similares en futuras publicaciones.

Muchísimas gracias por leerme y espero que hayáis disfrutado tanto como yo con este post. ;)

> Por último os invito a la mejor comunidad de low level en español.
> - [Telegram](https://t.me/reversersesp)
> - [Discord](https://discord.gg/HxvetecGFF)
