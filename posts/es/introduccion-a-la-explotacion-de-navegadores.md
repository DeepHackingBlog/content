---
id: "introduccion-a-la-explotacion-de-navegadores"
title: "Introducción a la Explotación de Navegadores"
author: "ivan-cabrera-fresno"
publishedDate: 2024-10-23
updatedDate: 2024-10-23
image: "https://cdn.deephacking.tech/i/posts/introduccion-a-la-explotacion-de-navegadores/introduccion-a-la-explotacion-de-navegadores-0.webp"
description: "Introducción a la explotación de navegadores web: funcionamiento de motores JavaScript, arquitectura de seguridad de Chrome y vulnerabilidades comunes."
categories:
  - "web"
draft: false
featured: false
lang: "es"
---

Los navegadores web son nuestra principal vía de acceso a Internet. Actualmente, juegan un rol crucial en las organizaciones modernas, ya que un número creciente de aplicaciones de software se proporciona a los usuarios mediante navegadores, en formato de aplicaciones web. Prácticamente cualquier actividad que realices en línea requiere el uso de un navegador, lo que los convierte en uno de los productos de software más utilizados por los consumidores en todo el mundo.

Al ser las principales vías de acceso a Internet, los navegadores también representan un riesgo significativo para la seguridad de los dispositivos personales. Su amplia funcionalidad y constante conexión a la red los convierten en objetivos atractivos para ciberdelincuentes. Además, la complejidad de su código y la necesidad de procesar contenido potencialmente malicioso los hace vulnerables a diversas formas de ataque, como veremos más adelante.

¿Por qué Chrome?

Pues principalmente porque es el navegador más utilizado del mundo (entorno al 70% de cuota de mercado según algunos artículos).

En este artículo se va a introducir esta tecnología con el objetivo de brindar una base de conocimiento para que puedan investigar posteriormente por su cuenta. Para no realizar un artículo excesivamente largo, se van a referenciar diversos enlaces; se recomienda encarecidamente su lectura.

- [JavaScript para dummies](#javascript-para-dummies)
- [Funcionamiento del motor de JavaScript](#funcionamiento-del-motor-de-javascript)
    - [Problemas de compatibilidad](#problemas-de-compatibilidad)
- [Seguridad en Chrome](#seguridad-en-chrome)
    - [Arquitectura multiproceso y Sandboxing](#arquitectura-multiproceso-y-sandboxing)
- [Vulnerabilidades comunes](#vulnerabilidades-comunes)
- [Conclusión](#conclusión)
- [Otras referencias interesantes](#otras-referencias-interesantes)

## JavaScript para dummies

Empecemos por lo básico, JavaScript es un lenguaje de tipado dinámico, lo que implica que los tipos de datos se determinan en tiempo de ejecución, a diferencia de lenguajes como C++ donde los tipos se definen en tiempo de compilación. Esto permite que cualquier objeto en JavaScript pueda modificar sus propiedades de manera flexible durante la ejecución del programa. Este concepto lo explica muy bien [Jhalon](https://jhalon.github.io/) en su blog. Además, es uno de los recursos donde he aprendido más sobre este tema.

Usaremos su ejemplo, imagina una variable con valor 42:

```javascript
var item = 42;
```

Al utilizar el operador typeof en la variable item, podemos ver que devuelve su tipo de datos, que será Number.

```javascript
typeof item
'number'
```

Ahora, ¿Qué pasaría si intentamos establecerlo en una cadena y luego verificamos su tipo de datos?

```javascript
item = "Hello!";
typeof item
'string'
```

Si analizamos esto, la variable item ahora está configurada con el tipo de datos String y no Number. Esto es lo que hace que JavaScript sea dinámico por naturaleza. A diferencia de C++, si intentáramos crear una variable entera (int) y luego intentáramos configurarla con una cadena (string), fallaría.

Otro punto importante a explicar son los objetos:

En JavaScript, los objetos son una colección de propiedades que se almacenan como pares clave-valor. Cada objeto tiene propiedades asociadas, que pueden explicarse simplemente como una variable que ayuda a definir las características del objeto. Veamos un ejemplo:

```javascript
let persona = {
    nombre: "Juan",
    apellido: "Pérez",
    edad: 30,
    genero: "masculino",
    nacionalidad: "Italiano"
};
```

Además, a cada propiedad del objeto se le asignan atributos de propiedad , que se utilizan para definir y explicar el estado de las propiedades de los objetos. Pueden consultar los atributos de propiedad aquí:

- [Property Attributes](https://tc39.es/ecma262/#sec-property-attributes)

Ahora que conocemos lo básico acerca de JavaScript, veamos que ocurre cuando el código se ejecuta.

## Funcionamiento del motor de JavaScript

Los motores son esos programas que se encargan de convertir código de alto nivel (JavaScript, Python, C) a código de bajo nivel (_Machine Code_, _Bytecode_). Cada navegador tiene su propio motor para compilar e interpretar JavaScript.

Los navegadores hoy en día utilizan numerosos motores JavaScript diferentes, como por ejemplo:

- V8 : motor JavaScript y WebAssembly de alto rendimiento y código abierto de Google, utilizado en Chrome.
- SpiderMonkey : motor de JavaScript y WebAssembly de Mozilla, utilizado en Firefox.
- Charka : un motor JScript propietario desarrollado por Microsoft para su uso en IE y Edge.
- JavaScriptCore : el motor JavaScript integrado de Apple para el uso de WebKit en Safari.

Durante mi investigación encontré este blog muy interesante sobre explotar vulnerabilidades en Firefox:

- [Introduction to SpiderMonkey exploitation.](https://doar-e.github.io/blog/2018/11/19/introduction-to-spidermonkey-exploitation/)

¿Por qué son necesarios los motores JavaScript y toda su complejidad?

JavaScript es un lenguaje de programación orientado a objetos, ligero e interpretado. En los lenguajes interpretados, el código se ejecuta línea por línea, y su resultado se obtiene de inmediato, sin necesidad de compilarlo previamente en otro formato antes de que el navegador lo procese. Sin embargo, este enfoque suele afectar negativamente el rendimiento. Aquí es donde entra en juego la compilación, específicamente la técnica Just-In-Time (JIT). Con JIT, el código JavaScript se traduce a bytecode, una representación intermedia del código máquina, y luego se optimiza para hacerlo mucho más eficiente y, por lo tanto, más rápido.

Si desea aprender más sobre JIT puede leer el siguiente artículo:

- [Cómo funcionan los compiladores JIT](https://keepcoding.io/blog/como-funcionan-los-compiladores-jit/)

Entonces, ¿Qué sucede realmente después de ejecutar el código JavaScript?

![Diagrama del flujo de ejecución de JavaScript mostrando Parser, AST, Intérprete y Compilador](https://cdn.deephacking.tech/i/posts/introduccion-a-la-explotacion-de-navegadores/introduccion-a-la-explotacion-de-navegadores-1.avif)

¿Qué hace cada uno de estos componentes?

- Analizador: una vez que ejecutamos el código JavaScript, el código se pasa al motor y comenzamos nuestro primer paso, que es analizar el código. El analizador convierte el código en Tokens. Por ejemplo, var num = 1 se desglosa en var,num,=,1 y cada token o elemento se etiqueta con su tipo, por lo que en este caso sería Keyword,Identifier,Operator,Number.
- AST (Abstract Syntax Tree): Una vez que tenemos el código convertido tokens, estos, se convierten en un AST. Utilizando el código de antes se vería así:

```json
{
  "type": "Program",
  "start": 0,
  "end": 12,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 11,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 11,
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 7,
            "name": "num"
          },
          "init": {
            "type": "Literal",
            "start": 10,
            "end": 11,
            "value": 1,
            "raw": "1"
          }
        }
      ],
      "kind": "var"
    }
  ],
  "sourceType": "module"
```

Esto se puede comprobar usando la siguiente herramienta: [AST Explorer](https://astexplorer.net/).

- Intérprete: El AST se pasa al intérprete y este se encarga de generar y ejecutar el código de bytes. El código de ejemplo se vería tal que así:

![Bytecode generado por el intérprete de V8](https://cdn.deephacking.tech/i/posts/introduccion-a-la-explotacion-de-navegadores/introduccion-a-la-explotacion-de-navegadores-2.avif)

El siguiente tutorial explica como realizarlo: [How to Generate the Bytecode of Your JavaScript Code](https://medium.com/@nalbandean/how-to-generate-the-bytecode-of-your-javascript-code-eb93bcb36ab5)

Puedes encontrar una lista de instrucciones de V8 aquí: [JavaScript Bytecode – v8 Ignition Instructions](https://www.alibabacloud.com/blog/javascript-bytecode-v8-ignition-instructions_599188)

Por último, si quiere entender el bytecode le recomiendo el siguiente artículo: [Understanding V8’s Bytecode](https://medium.com/dailyjs/understanding-v8s-bytecode-317d46c94775)

- Compilador: El compilador trabaja con anticipación mediante un algoritmo llamado Profiler, que monitorea y vigila el código que debe optimizarse. Si existe algo conocido como función activa, el compilador toma esa función y genera código de máquina optimizado para ejecutar. De lo contrario, si ve que una función activa que se optimizó ya no se usa, la desoptimizará y la convertirá en código de bytes.

El Profiler es una herramienta que monitorea en tiempo real el comportamiento del código JavaScript. Su principal objetivo es identificar qué partes del código (particularmente las funciones) se están utilizando con frecuencia y podrían beneficiarse de una optimización adicional.

- **Monitoreo del rendimiento:** El Profiler está constantemente vigilando qué partes del código se ejecutan con mayor frecuencia, denominadas **funciones activas** o **hot functions**.
- **Funciones activas:** Estas son las funciones que el Profiler detecta que se llaman repetidamente o tienen un uso intensivo de recursos. Cuando identifica una función activa, el Profiler le indica al compilador que optimice esa función.

En cuanto al motor de JavaScript V8 de Google, el proceso de compilación es bastante similar. No obstante, V8 incorpora un compilador adicional no optimizador que se añadió en 2021. Actualmente, cada componente de V8 tiene un nombre específico, que son los siguientes:

- **Ignition**: intérprete rápido de bajo nivel basado en registros de V8 que genera el código de bytes. Puedes encontrar más detalles en: [Firing up the Ignition interpreter](https://v8.dev/blog/ignition-interpreter).
- **SparkPlug**: el nuevo compilador de JavaScript no optimizador de V8 que compila a partir de código de bytes, iterando el código de bytes y emitiendo código de máquina para cada código de bytes a medida que se visita.
- **TurboFan**: compilador optimizador de V8 que traduce el bytecode a código de máquina con optimizaciones de código más numerosas y sofisticadas. También incluye compilación JIT (Just-In-Time).

Si desean entender TurboFan (uno de los componentes más importantes) recomiendo la siguiente lectura: [Introduction to TurboFan](https://doar-e.github.io/blog/2019/01/28/introduction-to-turbofan/).

Mención especial a la herramienta [Turbolizer](https://github.com/thlorenz/turbolizer) o si preferís su versión online: [Turbolizer online](https://v8.github.io/tools/head/turbolizer/index.html).

Según el repositorio oficial, esta herramienta visualiza el código optimizado a lo largo de las distintas fases del proceso de optimización de Turbofan, lo que permite una fácil navegación entre el código fuente, los gráficos IR de Turbofan, los nodos IR programados y el código de ensamblaje generado.

Un ejemplo práctico sería a partir de un código como este:

![Código JavaScript de ejemplo para analizar con Turbolizer](https://cdn.deephacking.tech/i/posts/introduccion-a-la-explotacion-de-navegadores/introduccion-a-la-explotacion-de-navegadores-3.avif)

Generar el fichero necesario:

![Comando para generar el archivo de trace de TurboFan](https://cdn.deephacking.tech/i/posts/introduccion-a-la-explotacion-de-navegadores/introduccion-a-la-explotacion-de-navegadores-4.avif)

Y la herramienta se vería así:

![Interfaz de Turbolizer mostrando la visualización del código optimizado](https://cdn.deephacking.tech/i/posts/introduccion-a-la-explotacion-de-navegadores/introduccion-a-la-explotacion-de-navegadores-5.avif)

#### Problemas de compatibilidad

V8 e Ignition están escritos en C++, por lo que el intérprete y el compilador deben determinar cómo JavaScript pretende utilizar algunos de los datos. Esto es fundamental para la eficiencia y seguridad, ya que si el intérprete y el compilador interpretan mal el código se pueden acontecer vulnerabilidades de confusión de tipos.

¿Cómo V8 maneja esto?

Para solucionar la falta de información sobre los tipos en JavaScript y mejorar el rendimiento, V8 implementa un mecanismo de optimización llamado hidden classes (clases ocultas), inspirado en el uso de clases y estructuras en lenguajes como C++.

¿Qué son las Hidden Classes?

Las hidden classes son estructuras internas generadas automáticamente por V8 para seguir la estructura de un objeto. Cada vez que creas un objeto y le agregas o modificas una propiedad, V8 genera una clase interna que describe la estructura de ese objeto en ese momento específico.

Al crear un objeto vacío obj, V8 asocia ese objeto con una clase oculta inicial que no tiene ninguna propiedad.

Cuando se agrega la propiedad x, V8 crea una nueva clase oculta que ahora contiene la propiedad x.

```javascript
let obj = {};
obj.x = 10;
```

Al agregar una nueva propiedad x a obj, V8 genera una nueva clase oculta que tiene las propiedades x e y. Esta clase es diferente de la anterior.

```javascript
obj.y = 20;
```

Este mecanismo permite que V8 gestione el cambio de la estructura de los objetos en tiempo de ejecución sin perder la posibilidad de optimizar el acceso a las propiedades de los objetos.

Si desea profundizar más puede apoyarse en el siguiente artículo:

- [Secret Behind JavaScript Performance: V8 & Hidden Classes](https://blog.bitsrc.io/secret-behind-javascript-performance-v8-hidden-classes-ba4d0ebfb89d)

## Seguridad en Chrome

Para poder ver el panorama general y unir todas las piezas del rompecabezas, debemos comenzar por comprender el modelo de seguridad de Chrome. Después de todo, esta publicación es un recorrido por los aspectos internos del navegador y su explotación.

Como sabemos, los motores de JavaScript son una parte integral de la ejecución del código JavaScript en los sistemas. Si bien desempeñan un papel importante para que los navegadores sean rápidos y eficientes, también pueden exponerlos a fallas, bloqueos de aplicaciones e incluso riesgos de seguridad. Pero los motores de JavaScript no son la única parte de un navegador que puede tener problemas o vulnerabilidades. Muchos otros componentes, como las API o los motores de renderizado HTML y CSS que se utilizan, también pueden tener problemas de estabilidad y vulnerabilidades que podrían explotarse, ya sea intencionalmente o no.

La seguridad en Chrome se resume en dos palabras: arquitectura multiproceso y un entorno aislado (sandboxing).

#### Arquitectura multiproceso y Sandboxing

La arquitectura de múltiples procesos de Chromium divide el navegador en distintos tipos de procesos para mejorar la estabilidad, seguridad y rendimiento. Cada pestaña o ventana opera en su propio proceso, aislando el motor de renderizado de otros componentes para evitar que un fallo afecte a todo el navegador. Además, se emplea un sandbox para restringir el acceso de los procesos a los recursos del sistema. Esta arquitectura también optimiza el uso de memoria y permite liberar recursos de pestañas inactivas.

![Diagrama de la arquitectura multiproceso de Chrome mostrando separación de procesos](https://cdn.deephacking.tech/i/posts/introduccion-a-la-explotacion-de-navegadores/introduccion-a-la-explotacion-de-navegadores-6.avif)

Si desea profundizar en el tema se recomiendan las siguientes lecturas:

- [Multi-process Architecture](https://www.chromium.org/developers/design-documents/multi-process-architecture/)
- [Sandbox](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/design/sandbox.md)

## Vulnerabilidades comunes

Ahora que comprendemos algunos conceptos del proceso de desarrollo de V8 y las optimizaciones del compilador, podemos analizar qué tipos de vulnerabilidades están presentes en los navegadores. Como sabemos, el motor de JavaScript y todos sus componentes, incluido el compilador, están implementados en C++.

Entre las vulnerabilidades más comunes se encuentran los famosos buffer overflows, heap overflows, user-after-free off-by-one errors y out-of-bound reads entre otras.

Adjunto un repositorio con CVEs:

- [Case Study of JavaScript Engine Vulnerabilities](https://github.com/tunz/js-vuln-db)

Además de los errores habituales de C++, también podemos tener errores lógicos y errores de generación de código de máquina que pueden ocurrir durante la fase de optimización debido a la naturaleza de las suposiciones especulativas. Este tipo de problemas se conocen como type confusion, en las que el compilador no verifica el tipo o la forma del objeto que se le pasa, lo que hace que el compilador utilice el objeto a ciegas.

Si quieren comprender y analizar la explotación de una vulnerabilidad real les recomiendo el siguiente artículo de Samuel Gross:

- [Exploiting Logic Bugs in JavaScript JIT Engines](https://phrack.org/issues/70/9.html#article)

En dicho artículo, se explica la vulnerabilidad CVE-2018-17463, un RCE en Google Chrome.

## Conclusión

El descubrimiento y la explotación de vulnerabilidades en navegadores como Google Chrome es una tarea complicada, y pasa por entender el funcionamiento en detalle de cada componente con el fin de conocer los mejores vectores de ataque. Espero que esta introducción haya servido para lograr una base de conocimiento al lector con la cual pueda investigar posteriormente por su cuenta.

## Otras referencias interesantes

- [An Introduction to Speculative Optimization in V8](https://ponyfoo.com/articles/an-introduction-to-speculative-optimization-in-v8)
- [V8: Behind the Scenes (February Edition feat. A tale of TurboFan)](https://benediktmeurer.de/2017/03/01/v8-behind-the-scenes-february-edition)
- [V8 Resources](https://mrale.ph/v8/resources.html)
- [Sea of Nodes](https://darksi.de/d.sea-of-nodes/)
