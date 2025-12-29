---
id: "como-funciona-la-autenticacion-ntlm"
title: "Cómo funciona la autenticación NTLM"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-01-10
updatedDate: 2022-01-10
image: "https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-0.webp"
description: "Explicación detallada del funcionamiento de la autenticación NTLM en Windows, incluyendo los hashes LM y NT, el proceso Net-NTLMv2 y técnicas como Pass The Hash."
categories:
  - "active-directory"
  - "windows"
draft: false
featured: false
lang: "es"
---

NTLM (NT Lan Manager) consiste en una serie de protocolos de autenticación utilizados en los entornos Windows. Estos protocolos permiten que un usuario demuestre su identidad a un servidor. Es en esta autenticación donde nosotros como atacantes, podemos aprovecharnos para, entre otras cosas, hacer Pass The Hash.

Índice:

- [Terminología](#terminología)
- [¿Qué es Pass The Hash?](#qué-es-pass-the-hash)
- [Hash LM](#hash-lm)
- [NTLM (Aka. Hash NT)](#ntlm-aka-hash-nt)
- [Autenticación Net-NTLMv2](#autenticación-net-ntlmv2)
    - [Negotiation Request/Response](#negotiation-requestresponse)
    - [Session Setup Request (Message Type 1)](#session-setup-request-message-type-1)
    - [Session Setup Response (Message Type 2)](#session-setup-response-message-type-2)
    - [Session Setup Request (Message Type 3)](#session-setup-request-message-type-3)
    - [Session Setup Response](#session-setup-response)
- [Autenticación NTLM en un Directorio Activo](#autenticación-ntlm-en-un-directorio-activo)
- [Punto de vista del Pentesting](#punto-de-vista-del-pentesting)
- [Referencias](#referencias)

## Terminología

Antes de empezar a explicar cosas, vamos a dejar clara la terminología, ya que puede llegar a ser muy confusa:

- `NTLM` = Hash NT (también puede incluir el hash LM). Es el hash almacenado en la SAM (Security Account Manager) o en el archivo NTDS si estamos en un controlador de dominio.
- `NTLMv2` = Hash Net-NTLMv2 = Respuesta del cliente al challenge del servidor (Versión 2 de Net-NTLM) = Autenticación de desafío/respuesta = Autenticación NTLM

Sí, son un poco liosos estos de Microsoft 😥😢.

## ¿Qué es Pass The Hash?

Una de las características más únicas del pentesting a Windows es Pass The Hash. Esta técnica para quien no la conozca, consiste en que básicamente si conoces el hash NTLM (Aka. hash NT) de un usuario, y ese usuario tiene los suficientes privilegios en el sistema. Puedes tanto ejecutar comandos como obtener una shell en el equipo Windows, solo conociendo su hash, ejemplo:

![Ejemplo de Pass The Hash con psexec](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-1.avif)

> Nota: el hash LM no hace falta, de hecho, puedes probar a usar `psexec` solo con el hash NT precedido por dos puntos (`:`) y comprobarás que sigue funcionando.
> 
> Además, realmente este hash LM es el hash LM de una contraseña nula, esto ocurre porque se deshabilitó este tipo de hashes desde Windows Vista y Windows Server 2008. Si usas CrackMapExec con el parámetro `--sam` para dumpear la SAM, verás como los LM hashes de todos los usuarios serán el mismo.

Pass The Hash cuando se ve por primera vez puede resultar extraño e incluso mágico. Pero una vez se conoce el proceso de autenticación NTLM, veremos el fallo de este protocolo y por qué permite esta técnica.

Antes de ir al proceso de autenticación, vamos a ver como se crean los dos tipos de hashes usados en almacenamiento de contraseñas en Windows, el hash NT y el hash LM.

## Hash LM

El hash LM (Lan Manager) fue la forma por defecto en la que se almacenaban las contraseñas en Windows hasta el Windows XP y Windows Server 2003. Y está deshabilitado desde Windows Vista y Windows Server 2008 (aunque se puede seguir activando a día de hoy por temas de compatibilidad con sistemas antiguos).

LM era un algoritmo de hash bastante inseguro, y para saber por qué, vamos a ver el proceso de generación del hash:

**Paso 1**. Supongamos que la contraseña de mi usuario es `password123`. Pues el primer paso del proceso es pasarlo todo a mayúsculas, es decir, pasar de `password123` a `PASSWORD123`.

- En caso de que la contraseña sea menor a 14 caracteres, se rellena con caracteres nulos (OJO, se representan con ceros, pero no hay que confundirlos como tal, [explicación sobre caracteres nulos](https://stackoverflow.com/questions/1296843/what-is-the-difference-between-null-0-and-0#:~:text=Null%20Characters,case%20with%20the%20value%20zero.)) hasta llegar a esta longitud, es decir, que, por lo tanto, nuestra contraseña se convertiría en: `PASSWORD123000`.
    - Aquí te puedes preguntar, bueno, y ¿qué pasa si mi contraseña tiene 15 caracteres o más? Pues que no es una contraseña válida, el límite del algoritmo LM son contraseñas con longitud de hasta 14 caracteres.

**Paso 2**. El resultado del primer paso, ahora se divide en dos cadenas de 7 bytes cada una:

- 1ª Cadena: `PASSWOR`
- 2ª Cadena: `D123000`

**Paso 3**. Estas dos cadenas se van a usar para generar dos claves DES (Data Encryption Standard). Una clave DES está formada por 64 bits (8 bytes). Sin embargo, siendo cada cadena de 7 bytes, cada una hará un total de 56 bits. Por lo que para completar la clave DES y llegar a 64 bits, tenemos que añadir un bit de paridad por cada 7 bits ([Explicación del Bit de Paridad](https://www.lifeder.com/bit-de-paridad/) y [Explicación del Bit de Paridad en el cifrado DES](https://stackoverflow.com/questions/965500/how-should-i-create-my-des-key-why-is-an-7-character-string-not-enough)).

Entonces, cada cadena la pasamos a binario y le añadimos un bit de paridad por cada 7 bits. Ahora mismo te ha podido explotar la cabeza, pero en la siguiente imagen verás mucho más claro el proceso:

![Proceso de generación de claves DES con bits de paridad](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-2.avif)

Esto resulta en dos claves DES de 64 bits cada una, una correspondiente a la cadena `PASSWOR` y otra a la cadena `D123000`:

![Claves DES resultantes de 64 bits](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-3.avif)

Aquí te puedes preguntar por qué, siendo un bit de paridad, hemos colocado solo ceros y no hemos evaluado si serían un 1, o un 0. Esto es porque aunque sí que es cierto que es un bit de paridad. Ocurren dos cosas:

1. Al final dependerá si la implementación de DES tendrá en cuenta la paridad o no.
2. El bit de paridad en este caso no afectará al proceso de cifrado, lo que conlleva lo mencionado en el punto 1, esta implementación no la tendrá en cuenta, por lo que se pone todo en cero. De hecho, puedes hacer la prueba calculando el hash LM manualmente cambiando en cada caso los bits de paridad, poniéndolo todo en cero y luego poniéndolo todo en uno, ya verás que no habrá diferencia en el resultado final.

**Paso 4**. Estas dos claves DES que hemos generado, las vamos a usar (cada una por separado) para encriptar el siguiente string en modo ECB:

- `KGS!@#$%`

Para ello, podemos usar esta [calculadora online de DES](https://emvlab.org/descalc/?key=5121556B35BB3DA5&iv=0000000000000000&input=4B47532140232425&mode=ecb&action=Encrypt&output=E52CAC67419A9A22).

![Calculadora DES online](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-4.avif)

Tenemos que rellenar dos campos, el campo "Key" y el "Input Data". En este caso, la calculadora espera ambos datos en hexadecimal, por lo que tenemos que pasarlo a ese formato.

- Procedimiento para la cadena `PASSWOR`:

De las dos claves que hemos calculado previamente, usaremos la clave correspondiente a esta cadena. Por lo que la pasamos a hexadecimal:

<figure>

![Conversión de binario a hexadecimal](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-5.avif)

<figcaption>

Referencia: https://www.rapidtables.com/convert/number/binary-to-hex.html

</figcaption>

</figure>

De la misma forma, el string a encriptar se trata de `KGS!@#$%` por lo que lo pasamos también a hexadecimal:

<figure>

![Conversión de string a hexadecimal](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-6.avif)

<figcaption>

Referencia: https://codebeautify.org/string-hex-converter

</figcaption>

</figure>

Con esto hecho, usamos la calculadora:

![Resultado del cifrado DES](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-7.avif)

Obtenemos que:

`PASSWOR` = `E52CAC67419A9A22`

Ahora procedemos con la segunda cadena.

- Procedimiento para la cadena `D123000`:

Pasamos la segunda clave que generamos anteriormente a hexadecimal:

<figure>

![Conversión de segunda clave a hexadecimal](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-8.avif)

<figcaption>

Referencia: https://www.rapidtables.com/convert/number/binary-to-hex.html

</figcaption>

</figure>

Y ahora volvemos a la calculadora, ya que el string a encriptar ya lo pasamos a hexadecimal antes, solo tenemos que cambiar el valor del campo "Key":

![Cálculo del segundo hash](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-9.avif)

Obtenemos que:

`D123000` = `664345140A852F61`

Por lo que, para obtener el hash LM, concatenamos el resultado de la primera cadena con el resultado de la segunda:

`password123` = `E52CAC67419A9A22664345140A852F61`

Podemos comprobar que lo hemos hecho bien usando alguna web que crackee el hash LM:

<figure>

![Verificación del hash LM con rainbow tables](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-10.avif)

<figcaption>

http://rainbowtables.it64.com/

</figcaption>

</figure>

Viendo como se crea un hash LM podemos ver sus desventajas y por qué se quedó en desuso. Por ejemplo, un mismo hash puede pertenecer a muchas contraseñas:

- `password123`
- `PaSSwoRD123`
- `PassworD123`
- `PASSword123`

Porque en el primer paso, todas se convierten en `PASSWORD123`. Por esa misma razón, en la imagen de arriba donde vemos que nos ha crackeado el hash, nos sale `PASSWORD123` y no `password123`, ya que es imposible saber exactamente la contraseña inicial.

Además, en caso de que se quisiese crackear, se podría dividir en dos, de esta forma solo habría que hacerle fuerza bruta a una cadena de 7 caracteres para averiguar una parte de la contraseña.

## NTLM (Aka. NT Hash)

El hash NT (Aka. NTLM) es el algoritmo actualmente usado para almacenar las contraseñas en sistemas Windows, es la forma en la que se almacenan en la SAM. No hay que confundir este hash con el hash de autenticación de desafío/respuesta Net-NTLM que veremos más adelante.

Este hash es el hash que obtenemos cuando dumpeamos con mimikatz, de la misma forma, es el hash que necesitamos para hacer Pass The Hash.

Su generación es distinta y más sencilla que la de su predecesor:

**Paso 1**. La contraseña se pasa a Unicode ([UTF-16LE](https://es.wikipedia.org/wiki/UTF-16#Esquemas_de_codificaci%C3%B3n_y_BOM)).

**Paso 2**. Se usa el algoritmo `MD4`.

La operación completa para generar un hash NTLM sería: `MD4(UTF-16LE(<contraseña>))`

Ejemplo en python:

![Generación de hash NTLM en Python](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-11.avif)

Comprobación con servicio online de generación de hash NTLM:

<figure>

![Verificación con generador online de hash NTLM](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-12.avif)

<figcaption>

Referencia: https://codebeautify.org/ntlm-hash-generator

</figcaption>

</figure>

Como podemos comprobar, la generación de este hash es mucho más sencilla que la del hash LM.

## Autenticación Net-NTLMv2

El hash Net-NTLMv2 es el hash que se genera en cada autenticación cliente/servidor, por lo que no es un hash que se almacene, sino que dependerá de cada comunicación.

Ya hemos visto como se forman los hashes LM y NT, por lo que ahora vamos a ver como funciona una autenticación a través de la red, y como es a través de este proceso del cual nos aprovechamos para hacer Pass The Hash.

Cuando se realiza una autenticación a Windows a través de la red, el proceso que se sigue es el siguiente:

<figure>

![Diagrama de autenticación NTLM](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-13.avif)

<figcaption>

Diagrama

</figcaption>

</figure>

A nivel de paquetes, se ve de esta forma:

![Análisis de paquetes de autenticación NTLM](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-14.avif)

Vamos a ir poco a poco, explicando cada paso para entender el proceso completo.

Para tener el control de la autenticación y no generar ruido innecesario en la red, vamos a usar un script en python.

Por último, para tenerlo claro:

- Cliente: `192.168.118.10`
- Servidor: `192.168.118.128`

### Negotiation Request/Response

Primero de todo, iniciamos la negociación con el servidor SMB a través de las siguientes líneas de código:

```python
#!/usr/bin/python3

from impacket.smbconnection import SMBConnection

myconnection = SMBConnection("sikumy","192.168.118.128")
```

Esto corresponde a:

![Negotiation Request/Response en el diagrama](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-15.avif)

Y genera los paquetes:

![Paquetes de negociación SMB](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-16.avif)

Si nos fijamos, el cliente intenta iniciar una negociación usando el protocolo SMB, sin embargo, el servidor le responde con SMB2, para que negocie de nuevo usando este protocolo, por eso, encontramos 4 paquetes de Negociación cuando solo debería de haber dos:

- 1º Par de paquetes: Intento de negociación con SMB
- 2º Par de paquetes: Negociación con SMB2

Esta re-negociación ocurre porque por defecto, siempre se va a intentar utilizar la versión SMB más alta que soporte el cliente y el servidor.

### Session Setup Request (Message Type 1)

Una vez se ha negociado los detalles de la autenticación, el cliente procede a autenticarse. Para iniciar el proceso, lo haremos añadiendo una nueva línea de código:

```python
#!/usr/bin/python3

from impacket.smbconnection import SMBConnection

myconnection = SMBConnection("sikumy","192.168.118.128")

myconnection.login("sikumy", "sikumy123$!")
```

Esta nueva línea iniciará todos los pasos restantes, volviendo al diagrama, iniciará los pasos 3, 4, 5, 6 en su respectivo orden:

![Proceso de Session Setup en el diagrama](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-17.avif)

Empezando por el primer "Session Setup Andx Request", este paquete contiene:

- La firma `NTLMSSP` (NTLMSSP identifier).
- Flags de negociación (indica opciones soportadas por el cliente, requiere la aceptación por parte del servidor).
- NTLM Message Type, el cual en este paquete es 1.
    - El Message Type es básicamente una forma de identificar el paquete, puede ser 1, 2 o 3:
        - Message Type 1: Paquete que contiene la lista de opciones soportadas por el cliente.
        - Message Type 2: Además de contener la lista de opciones aceptadas por el servidor, contiene el "challenge", también conocido como "nonce".
        - Message Type 3: Paquete que contiene información del cliente (incluyendo dominio y usuario). También contiene la respuesta al "challenge".

![Contenido del Session Setup Request Message Type 1](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-18.avif)

En la imagen podemos observar el contenido mencionado arriba.

### Session Setup Response (Message Type 2)

A la petición enviada arriba, le sigue la respuesta por parte del servidor:

![Contenido del Session Setup Response Message Type 2](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-19.avif)

El servidor responde con:

- La firma `NTLMSSP` (NTLMSSP identifier) de nuevo.
- NTLM Message Type, en este caso, podemos ver como es 2.
- Nombre del servidor e información sobre él, gracias a la flag `NTLMSSP_NEGOTIATE_TARGET_INFO` que habíamos enviado en la petición.
- El challenge (16 bytes) (es una cadena aleatoria).

### Session Setup Request (Message Type 3)

Ahora que tenemos el challenge, debemos demostrar que tenemos la contraseña del usuario, es decir, tenemos que demostrar que nuestras credenciales son válidas. Eso si, no tenemos que enviar ni la contraseña, ni el hash de la misma, a través de la red.

¿Cómo lo demostramos entonces?

Básicamente, la idea ahora es generar el hash NT de la contraseña que hemos introducido (sea o no correcta, ya que aún no han sido validadas por el servidor). Este hash NT generado es usado para encriptar el "challenge" que hemos recibido en la última respuesta.

El método de encriptado del challenge varía dependiendo de la versión NTLM (Aka. Net-NTLM) que se esté usando y los ajustes propios del servidor. En el caso de NTLMv2, la respuesta tendría la siguiente forma:

`<usuario>::<dominio>:<challenge>:<challenge encriptado>:BLOB`

Ejemplo de hash NTLMv2 (Aka. Net-NTLMv2):

![Ejemplo de hash Net-NTLMv2](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-20.avif)

Aquí hay que explicar a que nos referimos con "BLOB" y como generamos el "challenge encriptado". Para ello, vamos a ver el algoritmo NTLMv2:

1. El cliente calcula el hash NT de la contraseña que ha introducido el usuario. Esto resulta en una cadena de 16 bytes.
2. Ahora, la versión unicode del nombre del usuario en mayúsculas y la versión unicode del nombre del dominio (también puede ser el nombre del servidor) en mayúsculas se concatenan para formar el "target string" (TS).
3. Con esto hecho, se usará el "target string" y el hash NT en el algoritmo `HMAC-MD5`, usando como "Key" el hash NT para obtener un hash NTLMv2 de 16 bytes.
4. Ahora se crea, lo que se conoce como "BLOB", es básicamente un bloque compuesto por:
    - 4 bytes --> firma BLOB (`0x01010000`)
    - 4 bytes --> reservado (`0x00000000`)
    - 8 bytes --> marca de tiempo (64 bits que representa el número de décimas de microsegundo desde el 1 de enero de 1601 hasta la fecha actual)
    - 8 bytes --> aleatorio
    - 4 bytes --> Debe de ser `0x00000000`.
    - Variable, formado por 2 bytes:
        - Nombre de Dominio NetBIOS (4 bits) --> `0x0002`
        - Nombre del servidor NetBIOS (4 bits) --> `0x0001`
        - Nombre DNS del Dominio (4 bits) --> `0x0004`
        - Nombre DNS del Servidor (4 bits) --> `0x0003`
        - [Ver documentación oficial de la variable.](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-nlmp/83f5e789-660d-4781-8491-5f8c6641f75e)
    - 4 bytes --> relleno (bytes random)
5. Ahora, se concatena el "challenge" y el bloque "BLOB", esto, se le pasa al algoritmo `HMAC-MD5`. Se usará como "Key" el hash NTLMv2 que generamos en el paso 3. Esto generará un hash NTLMv2 que será la primera parte de la respuesta, es decir, lo siguiente:

![Primera parte de la respuesta NTLMv2](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-21.avif)

El resto del hash Net-NTLMv2 corresponde al propio BLOB:

![BLOB en el hash Net-NTLMv2](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-22.avif)

[Documentación Oficial de NTLMv2.](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-nlmp/aee311d6-21a7-4470-92a5-c4ecb022a87b)

Por lo que en conclusión, la respuesta por parte del cliente a la petición donde el servidor nos envía el challenge es:

```
NTLMv2 = HMAC-MD5((challenge + blob), NTLMv2 como Key)

Respuesta = NTLMv2 + BLOB
```

<figure>

![Respuesta NTLMv2 completa en Wireshark](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-23.avif)

<figcaption>

Respuesta al challenge, NTLMv2 Response

</figcaption>

</figure>

Que corresponde con:

![Paquete Session Setup con respuesta NTLMv2](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-24.avif)

Podemos ver como es el mismo valor, únicamente la respuesta NTLMv2 no tiene los dos puntos que separan el NTLMv2 y el BLOB en la segunda imagen.

### Session Setup Response

Una vez el servidor recibe la respuesta anterior, hace el mismo proceso, pero con el hash que ya tiene almacenado del propio usuario. Cuando lo calcula, compara la salida que ha generado con la salida que nosotros (el cliente) le hemos enviado. Si los hashes NT con los que se han hecho todo el proceso, son distintos, darán un output totalmente distinto, lo que significará que el usuario puso una contraseña errónea, de lo contrario, serán iguales y la autenticación será válida.

En la respuesta, podemos comprobar si la autenticación ha tenido éxito o no:

![Autenticación exitosa en Session Setup Response](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-25.avif)

Si las credenciales fueran inválidas obtendríamos esta respuesta:

![Autenticación fallida en Session Setup Response](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-26.avif)

Te puedes preguntar, como calcula el servidor su propia respuesta NTLMv2. Ya que, algunos parámetros usados para generar esta respuesta siempre son dinámicos, como por ejemplo, la marca de tiempo (`timestamp`).

Por lo que si yo genero una respuesta NTLMv2 y luego el servidor genera otra para verificar si son iguales, es imposible que lo sean.

¿Qué ocurre entonces?

La solución es sencilla, la respuesta NTLMv2 que nosotros como cliente enviamos, contiene el BLOB en texto plano, por lo que el servidor coge los parámetros de este BLOB y los usa para generar su propia respuesta. De esta forma, la única variable posible y de lo que todo dependerá será del hash NT.

- Se usan hashes NT iguales = Autenticación válida
- Se usan distintos = Autenticación inválida

En conclusión, como podemos comprobar, la contraseña en texto claro no se ha usado en ningún momento de la autenticación salvo para generar su hash NT. Por lo que teniendo el hash NT es exactamente lo mismo que si tuviésemos la contraseña en texto claro (a nivel práctico), por eso, Pass The Hash existe y funciona.

## Autenticación NTLM en un Directorio Activo

Si estamos en un directorio activo, cambia un poco la autenticación, ya que si estamos intentando autenticarnos en un equipo, corresponde al Domain Controller (DC), validar las credenciales.

Por lo que el proceso de autenticación sería el siguiente:

![Diagrama de autenticación NTLM en Active Directory](https://cdn.deephacking.tech/i/posts/como-funciona-la-autenticacion-ntlm/como-funciona-la-autenticacion-ntlm-27.avif)

En la petición RPC NetLogon, el servidor enviará al Controlador de Dominio el:

- Usuario
- Challenge
- Respuesta al Challenge (Challenge encriptado)

El controlador de dominio verificará si la autenticación es válida usando el hash NT almacenado en el archivo NTDS.

Lo que determine el controlador de dominio será enviado en la respuesta RPC NetLogon al servidor, y posteriormente a nosotros.

## Punto de vista del Pentesting

Hemos visto mucha teoría en este post. Teoría que es interesante saber para conocer realmente que ocurre detrás de las técnicas que empleamos. Para acabar, un mini recordatorio sobre para qué nos puede servir cada hash de cara al pentesting:

- Hash NT --> Podemos usarlo tanto para realizar Pass The Hash como para intentar crackearlo.
- Hash Net-NTLM --> Podemos intentar crackearlo, pero no lo podemos usar para Pass The Hash.
    - Este tipo de autenticación se puede usar para realizar ataques como el SMB Relay.

## Referencias

- [Windows authentication attacks – part 1](https://blog.redforce.io/windows-authentication-and-attacks-part-1-ntlm/)
- [Understanding NTLM Authentication Step by Step](https://security.stackexchange.com/questions/129832/understanding-ntlm-authentication-step-by-step)
- [The NTLM Authentication Protocol and Security Support Provider](http://davenport.sourceforge.net/ntlm.html#theLmResponse)
- [What is the difference between NULL, '\\0' and 0?](https://stackoverflow.com/questions/1296843/what-is-the-difference-between-null-0-and-0#:~:text=Null%20Characters,case%20with%20the%20value%20zero.)
- [Bit de paridad: para qué sirve, cómo funciona](https://www.lifeder.com/bit-de-paridad/)
- [How should I create my DES key? Why is an 7-character string not enough?](https://stackoverflow.com/questions/965500/how-should-i-create-my-des-key-why-is-an-7-character-string-not-enough)
- [NTLM Terminology](http://davenport.sourceforge.net/ntlm.html#ntlmTerminology)
- [Mechanics of User Identification and Authentication - Fundamentals of Identity Management](https://books.google.es/books?id=eIPA4v0u05EC&pg=PA359&lpg=PA359&dq=ntlm+version+2+response&source=bl&ots=gyRUzlWNhh&sig=ACfU3U1rgHJ17MUlc43qPWbN4qI0j14M4w&hl=es&sa=X&ved=2ahUKEwi3sNCzzKD1AhXsyYUKHQA4CM8Q6AF6BAgYEAM#v=onepage&q=ntlm%20version%202%20response&f=false)
- [NTLM v2: NTLMv2\_CLIENT\_CHALLENGE](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-nlmp/aee311d6-21a7-4470-92a5-c4ecb022a87b)
- [AV\_PAIR](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-nlmp/83f5e789-660d-4781-8491-5f8c6641f75e)
- [NTLM/LM Hashes on Domain Controller](https://security.stackexchange.com/questions/56227/ntlm-lm-hashes-on-domain-controller)
- [Disabling NTLM v1 On Windows Computer](https://services.dartmouth.edu/TDClient/1806/Portal/KB/ArticleDet?ID=136495)
- [Practical guide to NTLM Relaying in 2017](https://byt3bl33d3r.github.io/practical-guide-to-ntlm-relaying-in-2017-aka-getting-a-foothold-in-under-5-minutes.html)
- [Microsoft NTLM](https://docs.microsoft.com/en-us/windows/win32/secauthn/microsoft-ntlm)
