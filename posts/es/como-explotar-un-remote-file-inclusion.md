---
id: "como-explotar-un-remote-file-inclusion"
title: "Cómo explotar un Remote File Inclusion (RFI)"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-11
updatedDate: 2022-02-11
image: "https://cdn.deephacking.tech/i/posts/como-explotar-un-remote-file-inclusion/como-explotar-un-remote-file-inclusion-0.webp"
description: "Guía práctica sobre la vulnerabilidad RFI: cómo explotar Remote File Inclusion para ejecutar código remoto mediante la inclusión de archivos maliciosos desde un servidor externo."
categories:
  - "web"
draft: false
featured: false
lang: "es"
---

El Remote File Inclusion (RFI) es una vulnerabilidad muy parecida al LFI (Local File Inclusion). La diferencia es que mientras el LFI te permite la inclusión de archivos locales, el RFI te permite incluir archivos remotos.

Claro esto es super turbio, porque si nosotros como atacante nos montamos un servidor web. Podemos aprovechar el RFI de la máquina víctima para que cargue e interprete como si fuera suyo un archivo malicioso que estemos alojando.

Vamos a montarnos la vulnerabilidad en local:

Primero de todo, creamos el archivo PHP que alojará la inclusión de archivos:

![Código PHP vulnerable a RFI](https://cdn.deephacking.tech/i/posts/como-explotar-un-remote-file-inclusion/como-explotar-un-remote-file-inclusion-1.avif)

Este es un código sencillo donde a partir de una petición GET, el servidor recibirá un valor por el parámetro `file` e incluirá el archivo con ese nombre en la página.

Con este código, si accedemos a la URL:
- `http://localhost/index.php?file=/etc/hosts`

Nos cargará el archivo hosts. Sin embargo, tenemos que habilitar que admita también URLs. Para ello, nos dirigimos a la configuración de PHP, la podemos encontrar con:

![Búsqueda de archivo de configuración de PHP](https://cdn.deephacking.tech/i/posts/como-explotar-un-remote-file-inclusion/como-explotar-un-remote-file-inclusion-2.avif)

Como en mi caso el servidor web lo voy a montar usando el propio comando PHP, editaré el archivo de configuración de la segunda línea.

Dentro de este archivo, tenemos que buscar la variable `allow_url_include`:

![Variable allow_url_include en php.ini](https://cdn.deephacking.tech/i/posts/como-explotar-un-remote-file-inclusion/como-explotar-un-remote-file-inclusion-3.avif)

Por defecto, el valor de esta variable será Off, por lo que nosotros simplemente la cambiamos a On y listo.

Con esto hecho, ya simplemente nos montamos el servidor web con el comando php:
- `php -S localhost:80`

![Servidor web PHP iniciado](https://cdn.deephacking.tech/i/posts/como-explotar-un-remote-file-inclusion/como-explotar-un-remote-file-inclusion-4.avif)

![Verificación de LFI funcionando](https://cdn.deephacking.tech/i/posts/como-explotar-un-remote-file-inclusion/como-explotar-un-remote-file-inclusion-5.avif)

Podemos comprobar que el archivo y el servidor web funcionan correctamente, ya que el LFI funciona, esto ocurre porque el LFI y el RFI comparten el mismo código PHP, por lo que al comprobar que el LFI funciona sabemos que todo está correctamente.

Ahora bien, en otro equipo, voy a alojar el archivo malicioso (una webshell) y voy a montar un servidor web:

![Servidor malicioso con webshell](https://cdn.deephacking.tech/i/posts/como-explotar-un-remote-file-inclusion/como-explotar-un-remote-file-inclusion-6.avif)

Ahora mismo este equipo que es un Debian con IP 192.168.118.131 está compartiendo el archivo `sikushell.php`.

Por lo que si yo ahora desde el servidor web vulnerable, cambio el `/etc/hosts` por la dirección del servidor web del Debian, debería de recibir una petición GET:

![Petición GET desde servidor vulnerable](https://cdn.deephacking.tech/i/posts/como-explotar-un-remote-file-inclusion/como-explotar-un-remote-file-inclusion-7.avif)

![Logs del servidor malicioso mostrando petición](https://cdn.deephacking.tech/i/posts/como-explotar-un-remote-file-inclusion/como-explotar-un-remote-file-inclusion-8.avif)

Efectivamente, por el lado del servidor recibo la petición GET, y por el lado del cliente puedo visualizar todo lo este está compartiendo. Ahora, además de especificar el servidor web, vamos a dirigirnos al archivo `sikushell.php`:

![Acceso a sikushell.php sin parámetros](https://cdn.deephacking.tech/i/posts/como-explotar-un-remote-file-inclusion/como-explotar-un-remote-file-inclusion-9.avif)

Parece que existe, pero no nos muestra nada, esto es porque está esperando el parámetro `cmd`, que es el que hemos indicado en el archivo malicioso:

![Ejecución de comando mediante RFI](https://cdn.deephacking.tech/i/posts/como-explotar-un-remote-file-inclusion/como-explotar-un-remote-file-inclusion-10.avif)

> Nótese como al concatenar el nuevo parámetro `cmd` a todo los demás, hemos usado un ampersand (`&`). Esto es porque la interrogación que corresponde siempre al primer parámetro, ya está siendo usada por el parámetro `file`.

Parece que se nos interpreta correctamente el archivo malicioso y estamos ejecutando comandos. Si vemos en que máquina estamos, podemos ver que estamos en el kali, dicho de otra forma, el servidor web vulnerable:

![Confirmación de ejecución en servidor vulnerable](https://cdn.deephacking.tech/i/posts/como-explotar-un-remote-file-inclusion/como-explotar-un-remote-file-inclusion-11.avif)

Estamos ejecutando comandos localmente usando un archivo remoto. Esto es básicamente un Remote File Inclusion.
