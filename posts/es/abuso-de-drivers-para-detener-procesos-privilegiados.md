---
id: "abuso-de-drivers-para-detener-procesos-privilegiados"
title: "Abusando de drivers vulnerables para detener procesos privilegiados"
author: "julio-angel-ferrari-medina"
publishedDate: 2025-01-07
updatedDate: 2025-01-07
image: "https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-0.webp"
description: "Análisis detallado sobre cómo explotar vulnerabilidades en drivers de Windows para detener procesos privilegiados y evadir soluciones EDR y AV mediante el abuso del driver TrueSight.sys."
categories:
  - "windows"
draft: false
featured: false
lang: "es"
---

En el ámbito de la ciberseguridad, las soluciones de protección como los EDR **(Endpoint Detection and Response)** y los AV **(Antivirus)** juegan un papel crucial en la defensa contra amenazas maliciosas. Sin embargo, estos sistemas no son infalibles y, como toda tecnología, pueden presentar vulnerabilidades que los atacantes pueden explotar para evadir detecciones y comprometer la seguridad del sistema.

En este post, exploraremos cómo es posible aprovechar una vulnerabilidad en un driver de Windows para detener procesos privilegiados, incluyendo aquellos asociados a soluciones de seguridad como EDR y AV. Para ello, analizaremos y explotaremos una vulnerabilidad en un driver conocido llamado **TrueSight.sys**, que es un driver de un anti-malware denominado Rogue. A través de este análisis, demostraremos cómo es posible abusar de la función **ZwTerminateProcess** para finalizar procesos protegidos, comprometiendo así la integridad de las soluciones de seguridad implementadas en el sistema.

A lo largo de este artículo, aprenderás:

- [¿Qué es un EDR y cómo se diferencia de un AV?](#que-es-un-edr-y-como-se-diferencia-de-un-av)
    - [Análisis de comportamiento](#analisis-de-comportamiento)
    - [Sandboxes Internas](#sandboxes-internas)
    - [Características de Machine Learning](#caracteristicas-de-machine-learning)
    - [Telemetría Constante](#telemetria-constante)
- [Técnicas comunes de manipulación de EDR](#tecnicas-comunes-de-manipulacion-de-edr)
    - [Bloqueo de envío de telemetría](#bloqueo-de-envio-de-telemetria)
    - [Inyección de código en procesos confiables](#inyeccion-de-codigo-en-procesos-confiables)
    - [Abuso de Drivers Vulnerables para Detener Procesos Privilegiados](#abuso-de-drivers-vulnerables-para-detener-procesos-privilegiados)
- [¿Qué es un Driver?](#que-es-un-driver)
    - [¿Qué es Ring 0, Ring 1, Ring 2 y Ring 3?](#que-es-ring-0-ring-1-ring-2-y-ring-3)
- [Analizando y Abusando de un Driver Vulnerable](#analizando-y-abusando-de-un-driver-vulnerable)
    - [Análisis estático de TrueSight.sys con IDA Pro](#analisis-estatico-de-truesight-sys-con-ida-pro)
- [Creación de exploit en C++ y prueba de concepto](#creacion-de-exploit-en-c-y-prueba-de-concepto)
- [Conclusión](#conclusion)
- [Despedida](#despedida)

## ¿Qué es un EDR y cómo se diferencia de un AV?

EDR significa **Endpoint Detection and Response** (Detección y Respuesta en Endpoints). Se trata de una solución avanzada de seguridad que no solo detecta amenazas en tiempo real, sino que también es capaz de proporcionar capacidades para investigar y responder a incidentes de seguridad de manera efectiva.

Entonces, ¿cuáles son las principales diferencias que podemos encontrar en sus métodos de detección? Veámoslo.

#### Análisis de comportamiento

1. **Monitoreo de Procesos:** Los EDR observan la creación, modificación y terminación de procesos en tiempo real. Cualquier actividad inusual, como la creación de procesos desconocidos o la modificación de procesos existentes, puede indicar una posible amenaza.
2. **Inspección de Memoria:** Analizan el uso de la memoria para detectar inyecciones de código y otros ataques que operan directamente en la memoria, evitando así ser detectados por mecanismos de seguridad basados en disco.
3. **Seguimiento de Eventos del Sistema:** Se registran y analizan eventos críticos del sistema, como cambios en archivos de sistema, modificaciones en el registro de Windows y llamadas a APIs sensibles que podrían ser indicativas de actividades maliciosas.

#### Sandboxes Internas

1. **Ejecución Aislada:** Los binarios sospechosos se ejecutan en un entorno virtualizado donde sus acciones pueden ser monitoreadas y analizadas sin riesgo de comprometer el sistema principal.
2. **Observación de Comportamientos:** Se registran todas las actividades realizadas por el binario dentro del sandbox, incluyendo la creación de archivos, conexiones de red, modificaciones en el registro y llamadas a APIs.
3. **Detección de amenazas desconocidas:** Al observar el comportamiento real del binario, los EDR pueden identificar malware desconocido que aún no cuenta con firmas reconocidas por los AV tradicionales.

#### Características de Machine Learning

1. **Modelado de Comportamientos Normales:** Los algoritmos crean perfiles de comportamiento "**normal**" para cada endpoint, lo que permite detectar desviaciones significativas que podrían indicar una intrusión o actividad maliciosa.
2. **Predicción de Amenazas:** Utilizando datos históricos y patrones aprendidos, los EDRs pueden predecir y detectar amenazas antes de que se conviertan en problemas más graves.

#### Telemetría Constante

**Envío de Telemetría a un SOC:** Los EDRs también suelen enviar telemetría a un SOC, con el fin de tener centralizada la información y coordinar una respuesta eficaz ante cualquier incidente.

## Técnicas comunes de manipulación de EDR

A pesar de las avanzadas capacidades de detección y respuesta que ofrecen los EDRs, estos sistemas no son infalibles. Los atacantes desarrollan nuevas tácticas para evadir o deshabilitar las defensas, permitiéndoles llevar a cabo sus actividades maliciosas sin ser detectados.

Por lo que en el siguiente punto, hablaremos un poco sobre las distintas técnicas que existen para evadir o incluso desactivar las protecciones que ofrecen este tipos de soluciones.

#### Bloqueo de envío de telemetría

Un atacante puede evitar el envío de telemetría para que las acciones que está llevando a cabo no se reflejen en el SOC. Esto se realiza bloqueando de una forma u otra la conexión entre el agente del EDR y su destino, que generalmente es la consola de gestión del EDR o el servidor central de monitoreo.

Al interrumpir esta comunicación, el atacante reduce la visibilidad que tiene el SOC sobre las actividades en el endpoint comprometido, dificultando la detección temprana de comportamientos maliciosos.

Para lograr esto, el atacante puede emplear diversas técnicas, como **modificar las reglas de firewall para bloquear puertos específicos**, entre muchas otras.

#### Inyección de código en procesos confiables

Un atacante puede **inyectar código malicioso en procesos confiables para ocultar sus actividades** y evadir la detección por parte del EDR. Aunque los EDR modernos implementan protecciones robustas contra este tipo de ataques, utilizando técnicas avanzadas de monitoreo y análisis de comportamiento, los atacantes continúan desarrollando métodos para sortear estas defensas.

La inyección de código en procesos legítimos permite operar dentro del contexto de aplicaciones de confianza, aprovechando su reputación para evitar ser identificado como una amenaza. Para lograr esto, los atacantes pueden utilizar técnicas como la **manipulación de APIs legítimas** para alterar el comportamiento de procesos existentes o emplear métodos de ofuscación que dificultan el análisis del código malicioso. Al operar dentro de procesos protegidos, el código inyectado puede realizar acciones dañinas sin desencadenar las alertas del EDR.

#### Abuso de Drivers Vulnerables para Detener Procesos Privilegiados

Una de las técnicas más sofisticadas para manipular los EDR es el abuso de drivers vulnerables con el fin de detener procesos privilegiados. En este contexto, un driver opera a un nivel de privilegio elevado dentro del sistema operativo, lo que le otorga un control profundo sobre los procesos y recursos del sistema.

Cuando un driver presenta vulnerabilidades, los atacantes pueden explotarlas para escalar sus privilegios desde un nivel de usuario a uno de kernel (Ring 0, más adelante se entrará en detalle). Esto les permite ejecutar funciones críticas del sistema, como **ZwTerminateProcess**, que pueden finalizar cualquier proceso en ejecución, incluidos aquellos asociados con soluciones de seguridad como los EDR y AV.

Al aprovechar una vulnerabilidad en el driver, el atacante puede invocar esta función de manera maliciosa para deshabilitar las defensas del sistema, eliminando así la capacidad del EDR para monitorear y responder a amenazas en tiempo real.

## ¿Qué es un Driver?

Para poder comprender en detalle la parte práctica de este post, es fundamental establecer una base teórica sobre **qué es un driver y cuál es su papel en el sistema** operativo Windows. Así que vamos a ellos.

Un **driver**, o **controlador**, es un componente esencial del sistema operativo que permite la comunicación y el control de dispositivos de hardware y software dentro de un ordenador. En el contexto de Windows, los drivers operan en diferentes niveles de privilegio del procesador, conocidos como anillos (rings), siendo Ring 0 el de mayor privilegio y Ring 3 el de menor.

Vamos a explicar un poco que es esto de los Rings y cuales son sus diferencias.

#### ¿Qué es Ring 0, Ring 1, Ring 2 y Ring 3?

Para comprender cómo los drivers operan y por qué su seguridad es crucial, es esencial entender los niveles de privilegio en el sistema operativo Windows, conocidos como Rings (Anillos). Estos anillos **determinan el grado de acceso y control** que tienen los diferentes componentes y procesos sobre el sistema. Vamos a entrar un poco más en detalle.

1. **Ring 0: Kernel Mode**

**Descripción:** Kernel Mode es el nivel de privilegio más alto en el sistema operativo Windows, **conocido como Ring 0**. En este modo, el código tiene acceso completo a todos los recursos del hardware y puede ejecutar cualquier instrucción del procesador.

**Caracteristica:** Los componentes que operan en Ring 0, como el núcleo del sistema operativo y los drivers, tienen acceso directo a la memoria, al hardware y a todas las partes del sistema.

**Riesgo:** Debido a su alto nivel de acceso, cualquier vulnerabilidad en el código que se ejecuta en Ring 0 puede comprometer completamente la seguridad y estabilidad del sistema.

2. **Ring 3: User Mode**

**Descripción:** User Mode corresponde al nivel de privilegio más bajo, **conocido como Ring 3**. En este modo, el código tiene acceso limitado a los recursos del sistema y debe interactuar con el kernel a través de llamadas de sistema (system calls) para realizar operaciones que requieren mayores privilegios.

**Caracteristica:** Los procesos que operan en Ring 3 no pueden acceder directamente al hardware ni a la memoria del kernel. En su lugar, **dependen del sistema operativo para realizar operaciones** que requieren mayor privilegio.

**Riesgo:** Las restricciones de Ring 3 ayudan a prevenir que aplicaciones maliciosas realicen cambios no autorizados en el sistema operativo. Si una aplicación en Ring 3 se ve comprometida, **el daño está limitado a las operaciones que puede realizar** sin acceso directo al kernel.

3. **Rings Intermedios: Ring 1 y Ring 2**

**Descripción:** Ring 1 y Ring 2 son niveles de privilegio intermedios que existen teóricamente en la arquitectura de anillos del procesador, pero en la práctica, **Windows no utiliza estos niveles de manera extensiva**. Generalmente, los sistemas operativos modernos, incluido Windows, se centran principalmente en Ring 0 y Ring 3 para simplificar la gestión de privilegios y mejorar la seguridad.

**Caracteristica:** En sistemas que utilizan Ring 1 y Ring 2, **estos anillos pueden ser utilizados para componentes que requieren más privilegios** que el User Mode pero menos que el Kernel Mode. Sin embargo, en Windows, la mayoría de las funcionalidades se gestionan directamente entre Ring 0 y Ring 3.

**Riesgo:** En la práctica, estos anillos intermedios no representan un riesgo significativo en los sistemas actuales.

![Diagrama de los niveles de privilegio Ring 0, Ring 1, Ring 2 y Ring 3 en Windows](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-1.avif)

## Analizando y Abusando de un Driver Vulnerable

Tal y como se mencionó al inicio de este post, para comprender plenamente cómo se puede explotar una vulnerabilidad en un driver de Windows para terminar procesos privilegiados, utilizaremos el driver TrueSight.sys, que forma parte del software **anti-malware Rogue**.

A través del uso de IDA Pro, una potente herramienta de desensamblado y análisis estático, que muchos de vosotros conocereis, desglosaremos el funcionamiento interno de **TrueSight.sys** para identificar funciones críticas y posibles vulnerabilidades. Este análisis nos permitirá comprender cómo un atacante puede abusar de funcionalidades específicas, como **ZwTerminateProcess**, para deshabilitar procesos privilegiados.

Lo primero sería descargar el driver para poder analizarlo. Entonces, ¿dónde podemos encontrarlo?

Os dejo aquí un recurso donde podréis encontrar una amplia colección de drivers con vulnerabilidades descubiertas a lo largo del tiempo, todos ellos publicados en ese sitio.

- _[Base de datos de drivers vulnerables en loldrivers.io](https://www.loldrivers.io)_

Al acceder a dicho recurso, debemos buscar por **TrueSight.sys** que es el que vamos a analizar, así que lo descargamos.

![Página de descarga del driver TrueSight.sys en loldrivers.io](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-2.avif)

Cabe destacar que, con el tiempo, **estos drivers vulnerables suelen ser incluidos en listas negras.** Al intentar cargarlos en el sistema operativo, se genera un mensaje de error indicando que **el certificado del driver ha sido revocado.** Sin embargo, en el momento de escribir este post, **todavía es posible cargarlos y utilizarlos sin problemas en las últimas versiones de Windows 11**.

#### Análisis estático de TrueSight.sys con IDA Pro

Ahora que hemos entendido todo este "tostón" teórico, es momento de comenzar con la parte práctica. En mi caso, utilizaré **IDA Pro** como herramienta de análisis, pero vosotros podéis optar por otras, como **Ghidra**. Lo importante es que la herramienta permita convertir el código ensamblador en un pseudocódigo más comprensible.

Para comenzar debémos abrir nuestro driver en nuestro decompilador, este es más o menos el aspecto que tendrá.

![Interfaz de IDA Pro mostrando el driver TrueSight.sys cargado](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-3.avif)

Entonces, una vez aquí lo interesante sería buscar funciones que el controlador utiliza y podrían ser vulnerables, como por ejemplo la función **"ZwTerminaProcess"**.

ZwTerminaProcess es una función de bajo nivel de Windows que **normalmente es utilizada en código modo kernel para finalizar procesos**.

Si lo pensamos un poco, es bastante probable que nuestro controlador utilice esa función, ya que, al tratarse de un anti-malware, tiene sentido que tenga la capacidad de detener cualquier proceso, dado que eso es precisamente lo que hace al detectar una amenaza.

Antes de hacer la busqueda, vamos a estudiar un poco el funcionamiento de **ZwTerminaProcess**. Toda esta información la podemos encontrar en la documentación de Windows.

Si observamos los parámetros que maneja la función, encontramos **ProcessHandle** y **ExitStatus**. Esta función recibe un identificador y un código de estado.

![Documentación de Windows mostrando los parámetros de ZwTerminateProcess](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-4.avif)

Una vez entendido esto, si realizamos dicha busqueda sobre nuestro controlador, podemos observar un bloque de código llamado **"sub\_1140002B7C"**, dicho código realiza una llamada a la función **"ZwTerminaProcess"**.

![Bloque de código en IDA Pro mostrando la llamada a ZwTerminateProcess](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-5.avif)

Así es como se ve el flujo de ese bloque de código.

![Diagrama de flujo del bloque de código que llama a ZwTerminateProcess](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-6.avif)

Si lo decompilamos, vemos que **"sub\_1140002B7C"** recibe un entero como argumento, luego abre un proceso usando la función **"ZwOpenProcess"** y le pasa cuatro argumentos, incluyendo el entero que recibe **"sub\_1140002B7C"**.

![Código decompilado de la función sub_1140002B7C en IDA Pro](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-7.avif)

Después de esto, vamos a ver un poco más en profundidad lo que hace la función **"ZwOpenProcess"**.

![Análisis detallado de la función ZwOpenProcess](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-8.avif)

Como se puede observar, la función recibe **PHANDLE**, **ACESS\_MASK**, **POBJECT\_ATTRIBUTES** y **PCLIENT\_ID**.

Entonces, teniendo esto claro podemos determinar que la función **"ZwOpenProcess"** recibe 4 parametros entre ellos **a1** que se pasa como argumento en **"sub\_1140002B7C"**.

Osea, que **"ZwOpenProcess"** se utiliza para obtener el ProcessHandle que posteriormente recibe la función **"ZwTerminateProcess"**.

Algo interesante que podríamos hacer, es buscar en que otros lugares de nuestro controlador se llama a **"sub\_1140002B7C"**.

![Referencias cruzadas en IDA Pro mostrando las llamadas a sub_1140002B7C](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-9.avif)

Vemos que en el bloque de código **"sub\_140001690"**, se realiza una llamada a **"sub\_1140002B7C"**. Vamos a ver que hace.

![Código decompilado de la función sub_140001690](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-10.avif)

La función recibe tres parámetros: **a1, a2 y a3**, y verifica si **a1** es un puntero válido y si **a2** es mayor o igual a 4. Si estas condiciones se cumplen, llama a **"sub\_140002B7C"** con el valor apuntado por **a1** (que es el PID) y, si el resultado es 0, **asigna 4i64 a a3**. Si las condiciones no se cumplen, **asigna directamente 4i64 a a3 y devuelve el valor constante 2147483653i64**.

Una vez entendido esto, vamos a buscar nuevos lugares en el controlador donde se llame esta vez a la función **"sub\_140001690"**.

![Referencias cruzadas mostrando llamadas a sub_140001690](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-11.avif)

Como vemos hay una llamada a **"sub\_140001690"** desde **"sub\_1400017C0"**, vamos a ver que es lo que hace ese código.

![Código decompilado de la función sub_1400017C0 mostrando la condición v10](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-12.avif)

Revisando el código, observamos que existe una condición para que la función **"sub\_140001690"** sea llamada y es que **v10** sea igual a **"2285636"**. Una vez se consigue ese valor, se llama a **"sub\_140001690"** pasandole **v9** como PID, para después llamar a **"sub\_140002B7C"** y esa finalmente a **"ZwTerminateProcess"** para detener nuestro proceso.

La cosa es, ¿cómo podemos alcanzar esa función para pasarle el PID que nosotros querámos?

Si analizamos un poco más la función **"sub\_1400017C0"** vemos lo siguiente.

![Función de procesamiento IOCTL identificada en sub_1400017C0](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-13.avif)

Si observamos las lineas, vemos que parece ser una función de **procesamiento IOCTL**.

Para que se pueda entender de forma sencilla, IOCTL es una sigla que significa **Input Output Control**. En el contexto de los drivers de Windows, los IOCTL son códigos que **permiten a las aplicaciones en modo usuario comunicarse y enviar comandos específicos a los drivers en modo kernel**.

Entonces, conciendo todo esto ya conocemos como cumplir la condición necesaria  
**(v10 == 0x22E044)** que llamará a todas las demás funciones hasta llegar a **"ZwTerminaProcess"** con el PID del proceso que queremos detener.

## Creación de exploit en C++ y prueba de concepto

Ahora ha llegado el momento de crear nuestra prueba de concepto para probar la vulnerabildad encontrada en el controlador, para ello, vamos a emplear dos funciones principales de la API de Windows.

- **CreateFileA**: Con esta función vamos a poder crear o abrir un archivo o un dispositivo. La idea sería utilizarla par obtener un identificador para un controlar, lo que nos permitirá interacturar con el.

- **DeviceIoControl**: Esta función la vamos a utilizar para enviar comando IOCTL con la finalidad de interactuar con el controlador, de esta forma podemos enviar datos, consultar información o realizar otras acciones.

Entonces, ¿cuál va a ser el funcionamiento del exploit? Sencillo, vamos a verlo.

El script busca repetidamente el PID de un proceso específico en el sistema, abriendo un **“snapshot”** de todos los procesos y comparando sus nombres. Luego, se conecta a nuestro controlador **"\\.\\TrueSight"** mediante la función **CreateFileA**. Con la función **DeviceIoControl**, le envía el PID al driver usando el código de control **0x22E044 (este es el valor que debía de tomar la variable v10)**, indicando así que debe **“detener”** el proceso con ese PID.

Este procedimiento se ejecuta en un bucle infinito, de modo que, si el proceso reaparece o sigue activo, el driver intenta eliminarlo continuamente.

Vamos a ver en detalle la función **ObtenerPID**.

![Código de la función ObtenerPID en C++](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-14.avif)

La función comienza creando una instantánea de todos los procesos del sistema con **CreateToolhelp32Snapshot(TH32CS\_SNAPPROCESS, 0)**. Luego, usa una estructura **PROCESSENTRY32** para guardar los datos del primer proceso encontrado mediante **Process32First**.

Si tiene éxito, continúa recorriendo todos los procesos siguientes con **Process32Next**, comparando el nombre de cada uno **(pe32.szExeFile)** con el nombre que se recibe por parámetro. Si coincide, extrae el PID **(pe32.th32ProcessID)** y rompe el ciclo.

Finalmente, cierra la instantánea **(CloseHandle(hCaptura))** y devuelve el PID encontrado (o cero si no halló coincidencias).

Ahora vamos a ver la función **main**.

![Código de la función main del exploit en C++](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-15.avif)

La función comienza definiendo el nombre del proceso que se desea detener y llama a **getPID** para obtener su ID. Después, trata de abrir el driver **\\.\\TrueSight** con permisos de **lectura/escritura a través de CreateFileA**. Si logra abrirlo, entra en un bucle infinito donde, en cada iteración realiza lo siguiente:

1. Vuelve a obtener el PID del proceso objetivo **llamando otra vez a getPID**.

3. Invoca **DeviceIoControl** con el código de control **0x22E044**, pasándole el PID como parámetro para que el driver intente detener el proceso.

5. Informa si la operación fue **exitosa o falló**.

De esta manera, mientras el programa se ejecute, el **driver recibirá constantemente el PID y podrá volver a matar el proceso** si este reaparece o sigue activo.

Es hora de verlo en acción, para mis pruebas estoy usando el **EPDR de WatchGuard** actualizado en su última versión.

Por otro lado, he modificado el código de la prueba de concepto para poder pasarle el nombre del proceso o el PID a través de un argumento.

Primero, vamos a cargar nuestro driver haciendo uso del siguiente comando. Recordad que debemos ejecutar la consola con **permisos de Administrador**.

```cmd
sc.exe create truesight.sys binPath=C:\windows\temp\truesight.sys type=kernel && sc.exe start truesight.sys
```

![Consola de comandos mostrando la carga del driver TrueSight.sys](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-16.avif)

Este comando realiza las siguientes acciones.

1. Ejecuta sc.exe pasandole **binPath**, que será la ubicación de nuestro controlador.
2. Indica el tipo, que en este caso será modo **Kernel**.
3. Por último, **inicia el servicio**.

Podéis utilizar este comando o la herramienta **OSRLoader** para cargar el controlador.

Como se observa en esta imagen, **el estado del EDR es correcto** y todos sus servicios se estan ejecutando.

![Consola del EDR de WatchGuard mostrando estado operativo](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-17.avif)

Ahora vamos a ejecutar nuestra POC y veamos que ocurre.

![Ejecución del exploit y detención del proceso del EDR](https://cdn.deephacking.tech/i/posts/abuso-de-drivers-para-detener-procesos-privilegiados/abuso-de-drivers-para-detener-procesos-privilegiados-18.avif)

Como podéis observar, **el proceso del EDR se detiene y la consola muestra errores**, **dejando el equipo sin protecciones y permitiéndonos llevar a cabo otros ataques**, como la ejecución de Mimikatz, entre otras acciones.😁

## Conclusión

En este post, hemos explorado en profundidad cómo las vulnerabilidades en drivers de Windows pueden ser explotadas para **deshabilitar procesos privilegiados y evadir soluciones de seguridad como los EDR y AV**.

A través del análisis detallado del funcionamiento interno de **TrueSight.sys** utilizando **IDA Pro**, demostramos cómo una vulnerabilidad en una función crítica, como **ZwTerminateProcess**, puede ser aprovechada para terminar procesos protegidos, debilitando así las defensas del sistema.

## Despedida

Hasta aquí este post, espero que os haya gustado y, sobre todo, que hayáis aprendido no solo cómo estas vulnerabilidades en drivers pueden ser explotadas para deshabilitar procesos privilegiados, sino también cómo funciona Windows y sus controladores.

**¡Hasta la proxima y Happy Hacking! 😁**
