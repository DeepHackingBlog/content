---
id: "path-hijacking-library-hijacking"
title: "Cómo explotar el Path Hijacking y Library Hijacking"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-11-10
updatedDate: 2021-11-10
image: "https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-0.webp"
description: "Explicación de las técnicas de escalada de privilegios Path Hijacking y Library Hijacking en Linux, cómo explotarlas mediante la manipulación del PATH y ejemplos prácticos con permisos SUID y sudo."
categories:
  - "linux"
draft: false
featured: false
lang: "es"
---

El Path Hijacking y el Library Hijacking son dos técnicas básicas de escalada de privilegios, las cuales si se juntan con por ejemplo, privilegio SUID o sudo, puede llegar a ser peligroso desde el punto de vista de la seguridad.

Índice:

- [¿Qué es el PATH?](#qué-es-el-path)
- [Path Hijacking](#path-hijacking)
- [Library Hijacking](#library-hijacking)

## ¿Qué es el PATH?

Cuando ejecutamos un comando en una terminal o un cmd, como sabe la shell que esa palabra que hemos escrito corresponde a un comando con X función. ¿Qué decide que un comando sea detectado y otro no?:

![Ejemplo de comandos reconocidos y no reconocidos por la shell](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-1.avif)

Todo esto es gracias al PATH. El path es una variable de entorno la cual contiene rutas del sistema. Cuando ejecutamos un comando, el sistema va buscando algún archivo con el nombre del comando que hemos escrito, en cada ruta del path.

Es decir, por ejemplo, cuando escribimos `pwd`, el sistema irá buscando un archivo con el mismo nombre en los siguientes directorios con el siguiente orden:

![Visualización del PATH en Linux mostrando las rutas donde se buscan los comandos](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-2.avif)

Lo mismo pasaría en Windows:

![Visualización del PATH en Windows mostrando las rutas del sistema](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-3.avif)

Y también se aplica a lenguajes de programación, por ejemplo, Python:

<figure>

![Path de Python mostrando las rutas donde se buscan las librerías](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-4.avif)

<figcaption>

Este sería el path para cuando queramos cargar una librería.

</figcaption>

</figure>

Solo se hace uso del path cuando se escribe rutas relativas:

![Comparación entre ejecución de comando con ruta relativa y absoluta](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-5.avif)

En la primera ejecución, el sistema ha usado el path para encontrar donde estaba el binario de `whoami`, sin embargo, en la segunda no hace falta, porque ya le indicamos donde se encuentra. Por lo que de la segunda forma podemos evitar ataques como el path hijacking y el library hijacking. De cara al desarrollo de cualquier binario/script, es muy recomendable utilizar rutas absolutas siempre, tanto para comandos si estamos en un lenguaje de comandos como bash o librerías si estamos en un lenguaje de programación como por ejemplo Python.

## Path Hijacking

Para realizar el path hijacking he creado el siguiente programa en C:

![Código en C vulnerable a Path Hijacking usando head con ruta relativa](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-6.avif)

Como vemos, el programa saca las 10 primeras líneas del archivo `passwd` dos veces, la primera se hace usando la ruta absoluta de `head`, y la segunda, de forma relativa. En este punto, compilamos con `gcc` para crear el binario:

![Compilación del programa vulnerable con gcc](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-7.avif)

`Nota: en este caso lo hago con un binario compilado para poder hacer uso del permiso SUID de forma idónea.`

Para ver de forma más clara el peligro de no usar rutas absolutas, le voy a asignar permiso SUID:

![Asignación de permiso SUID al binario vulnerable](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-8.avif)

Con esto, si ejecutamos el binario desde el usuario normal lo haremos como el usuario root por el permiso SUID:

![Ejecución del binario con permisos SUID como usuario normal](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-9.avif)

Con todo esto hecho, vamos a llevar a cabo el Path Hijacking, si hacemos un `strings` al binario podemos identificar que se está llamando al comando de forma relativa (esta sería una posible forma de identificarlo si no tenemos acceso al código original):

<figure>

![Uso de strings para identificar comandos ejecutados de forma relativa](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-10.avif)

<figcaption>

`strings` imprime las cadenas legibles de caracteres

</figcaption>

</figure>

De esta forma podemos darnos cuenta, aunque no siempre se da el caso en el que podamos verlo.

Además, podemos fijarnos en que se está usando `setuid` en el código, esto significa que el código se ejecutará con el usuario del UID que indiquemos (ojo, aunque pongamos 0, no se ejecutará como root si no tiene el permiso SUID, necesitas por así decirlo un doble check, por eso además del `setuid` en 0, le ponemos el permiso SUID. Este doble check no aplicaría si fuésemos el usuario root, ya que tenemos privilegios totales, así que con `setuid` sería suficiente).

En este punto, vamos a cambiar el PATH añadiéndole la ruta actual y la propia variable del PATH, para no tener problemas de comandos:

![Modificación del PATH para incluir la ruta actual](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-11.avif)

En este punto, como el comando que queremos suplantar es `head`, creamos un archivo con el mismo nombre y que contenga el comando que queremos ejecutar, en mi caso, `bash -p`:

![Creación de archivo malicioso llamado head con el comando bash](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-12.avif)

Con el path cambiado para que mire en la ruta actual y un archivo que suplante al `head` legítimo, si ejecutamos ahora el binario:

![Explotación exitosa del Path Hijacking obteniendo shell root](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-13.avif)

Vemos como en la parte del código que se ejecuta `head` de forma relativa, se ejecuta el comando que hemos escrito, de esta forma hemos ejecutado un path hijacking (secuestro del path) y conseguido una shell como root.

## Library Hijacking

Entendiendo el path hijacking, el library hijacking es básicamente lo mismo, solo cambiando un poco el aspecto práctico. Vamos a usar el siguiente código en Python:

![Código Python vulnerable a Library Hijacking importando requests](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-14.avif)

Como vemos, la función del script es hacer una petición al blog y ver su código de respuesta:

![Ejecución del script Python mostrando código de respuesta HTTP](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-15.avif)

Entonces, como se ve en el código, se está llamando a la librería `requests` de forma relativa:

![Importación relativa de la librería requests en el código](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-16.avif)

Vamos a aprovecharnos de esto para ejecutar un Library Hijacking. Lo primero de todo es comprobar el path que sigue `python3`, esto lo podemos hacer con la librería `sys`:

![Visualización del sys.path de Python mostrando rutas de búsqueda](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-17.avif)

Si nos fijamos, el primer sitio donde Python comprueba de forma por defecto la existencia de la librería es en `''`, esto significa la ruta actual. Por lo que simplemente vamos a crear un archivo que se llame `requests.py` en la ruta actual:

![Creación de archivo requests.py malicioso para el hijacking](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-18.avif)

De esta forma, si ejecutamos el script:

![Explotación exitosa del Library Hijacking ejecutando código malicioso](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-19.avif)

Conseguimos ejecutar el comando que hemos especificado, en este caso, una shell.

Ojo, en este caso, el privilegio SUID no se lo aplicamos a Python, ya que al tratarse de un script, interfiere la propia capa de seguridad del propio permiso SUID:

<figure>

![Explicación de por qué SUID no funciona con scripts interpretados](https://cdn.deephacking.tech/i/posts/path-hijacking-library-hijacking/path-hijacking-library-hijacking-20.avif)

<figcaption>

[SUID doesn't work in bash - Stack Overflow](https://stackoverflow.com/questions/25001206/suid-doesnt-work-in-bash)

</figcaption>

</figure>

Sin embargo, si podríamos aprovecharnos para convertirnos en root si por ejemplo tenemos privilegios sudo sobre la ejecución del script.
