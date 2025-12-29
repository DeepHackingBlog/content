---
id: "web-shell-upload-via-extension-blacklist-bypass"
title: "Web shell upload via extension blacklist bypass – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-16
updatedDate: 2022-02-16
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-0.webp"
description: "Aprende a bypassear blacklists de extensiones de archivos utilizando extensiones alternativas de PHP y configuraciones de Apache para ejecutar código malicioso."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio de PortSwigger: “Web shell upload via extension blacklist bypass”.

![Página de inicio del laboratorio de PortSwigger](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-1.avif)

Para resolver el laboratorio tenemos que subir un archivo PHP que lea y nos muestre el contenido del archivo `/home/carlos/secret`. Ya que para demostrar que hemos completado el laboratorio, deberemos introducir el contenido de este archivo.

Además, el servidor está configurado para que no acepte ciertas extensiones.

En este caso, el propio laboratorio nos proporciona una cuenta para iniciar sesión, por lo que vamos a hacerlo:

![Formulario de inicio de sesión](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-2.avif)

![Credenciales de acceso proporcionadas](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-3.avif)

Una vez hemos iniciado sesión, nos encontramos con el perfil de la cuenta:

![Perfil de usuario](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-4.avif)

Como podemos ver, tenemos una opción para subir archivo, y concretamente parece ser que se trata de actualizar el avatar del perfil. Vamos a intentar aprovecharnos de esta opción para subir el siguiente archivo PHP:

![Código PHP para leer el archivo secret](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-5.avif)

Antes que nada, vamos a preparar Burp Suite para que intercepte la petición:

![Configuración del proxy en el navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-6.avif)

![Activación de la interceptación en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-7.avif)

Una vez tenemos Burp Suite listo junto al proxy, seleccionamos el archivo y le damos a “Upload”:

![Selección de archivo para subir](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-8.avif)

![Confirmación de subida de archivo](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-9.avif)

![Procesando la subida del archivo](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-10.avif)

Aquí Burp Suite interceptará la petición de subida del archivo:

![Petición interceptada en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-11.avif)

Para tratar mejor con la petición y poder analizar de mejor manera la respuesta del servidor, vamos a pasar la petición al repeater con Ctrl R.

Una vez pasado, le damos a “Send” para ver la respuesta del servidor a la petición por defecto:

![Respuesta del servidor indicando que archivos PHP no están permitidos](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-12.avif)

Nos dice que los archivos PHP no están permitidos. Por lo que la idea va a ser probar alternativas a la extensión de PHP para ver si no están definidas en la blacklist. En wikipedia podemos ver los tipos de extensiones asociadas a PHP:

![Extensiones de archivos PHP en Wikipedia](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-13.avif)

Dicho esto, pasamos la petición del repeater al intruder pulsando Ctrl I. Una vez tengamos la petición en el intruder, le daremos al botón de clear para quitar los lugares de sustitución que se ponen por defecto:

![Petición en Intruder con posiciones por defecto](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-14.avif)

Como lo que nos interesa es lanzar varias peticiones y que la diferencia entre cada una solo sea la extensión, declararemos un campo de sustitución en la extensión del nombre del archivo:

![Campo de sustitución definido en la extensión](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-15.avif)

Con esto hecho, nos dirigiremos a la pestaña de “Payloads”:

![Pestaña Payloads en Intruder](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-16.avif)

Una vez aquí, definiremos nuestro diccionario, es decir, el diccionario que se usará para sustituir la extensión por defecto, por las definidas en el diccionario:

![Adición de extensiones al diccionario](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-17.avif)

![Diccionario de extensiones completado](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-18.avif)

Una vez tengamos el diccionario de extensiones a probar hecho, nos dirigiremos a la pestaña de “Options” y a la parte de “Grep - Extract”:

![Pestaña Options sección Grep - Extract](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-19.avif)

Una vez aquí, estableceremos el string por el que queremos que filtre en las distintas respuestas, para que cuando no posea el string indicado, podamos detectar la respuesta en la que no lo esté rápidamente:

![Configuración de Grep - Extract para filtrar respuestas](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-20.avif)

Una vez hecho, nos dirigiremos de nuevo a la pestaña de “Payloads” para empezar el ataque:

![Inicio del ataque desde Payloads](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-21.avif)

![Botón Start attack en Intruder](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-22.avif)

Se nos abrirá una nueva ventana referente al ataque:

![Resultados del ataque mostrando las respuestas](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-23.avif)

En este caso, como podemos ver, parece que la única extensión que el servidor no permite, es la PHP. Por lo que presuntamente se han subido todas las demás. Vamos a ver la respuesta a la última petición en el navegador, para ello hacemos lo siguiente:

![Opción Show response in browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-24.avif)

![URL para mostrar respuesta en navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-25.avif)

![Pegando la URL en el navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-26.avif)

![Respuesta del servidor confirmando subida exitosa](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-27.avif)

Una vez tengamos la respuesta, podemos desactivar el burp suite porque no haremos mas uso de él:

![Desactivación del proxy](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-28.avif)

Con esto hecho, volvemos a nuestro perfil:

![Acceso al perfil de usuario](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-29.avif)

Ahora, si nos fijamos en el perfil, podemos ver como el avatar ha cambiado, y ahora muestra un fallo de que no carga bien la imagen:

![Avatar con error de carga](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-30.avif)

Dándole click derecho, podemos irnos a la ruta directa de la imagen para ver si se trata de nuestro archivo PHP:

![Menú contextual para abrir imagen](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-31.avif)

![Archivo PHP5 sin interpretar correctamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-32.avif)

Ojo, el archivo parece que existe porque no nos da error 404, sin embargo, no se interpreta del todo ya que no ha leido el archivos que le hemos indicado que lea. No pasa nada, antes de entrar en panico vamos a probar con los demas archivos con otra extensión que hemos subido, por ejemplo, el `phtml`:

![Ejecución exitosa del archivo phtml](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-33.avif)

Este si nos lo interpreta, y de esta forma conseguimos leer el archivo secret.

Habiéndolo leído, ya simplemente entregamos la solución:

![Formulario para enviar la solución](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-34.avif)

![Confirmación de solución enviada](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-35.avif)

Y de esta forma, completamos el laboratorio:

![Laboratorio completado exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-36.avif)

![Mensaje de confirmación final](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-extension-blacklist-bypass/web-shell-upload-via-extension-blacklist-bypass-37.avif)

Aunque lo hayamos solucionado de esta forma, la solución de PortSwigger me parece super chula e importante de comentar:

1. Nos logueamos y subimos una imagen de nuestro avatar, con esto hecho, volvemos a la página de nuestro perfil.
2. En el burp suite, nos dirigimos a `Proxy > HTTP History`. Aquí podremos ver una petición GET a la ruta `/files/avatars/<archivo>`. Enviamos esta respuesta al repeater.
3. En nuestro sistema, creamos un archivo que se llame `exploit.php` que contenta un código que lea el contenido del archivo secret del usuario Carlos. Por ejemplo: `<?php echo file_get_contents('/home/carlos/secret'); ?>`
4. Intentamos subir este archivo como nuestro avatar. La respuesta del servidor nos indicará que no se permiten archivos de extensión PHP.
5. En el HTTP History ahora buscaremos la petición POST en la que hemos intentado subir el archivo php. En la respuesta del servidor a esta petición, nos podremos dar cuenta de que estamos tratando con un servidor apache. Dicho esto, enviamos esta petición al repeater.
6. En la petición POST que ahora tenemos en el repeater, vamos a hacer los siguientes cambios:
    1. Cambiamos el nombre del archivo a `.htaccess`.
    2. Cambiamos el valor de `Content-Type` a `text/plain`
    3. Reemplazamos el contenido del archivo (el código PHP) por la siguiente directiva de apache: `AddType application/x-httpd-php .l33t` Esta directiva añadirá una nueva extensión al servidor, además, indicando que el tipo de MIME es `application/x-httpd-php`, lo que quiere decir que se comportará como un archivo PHP. Como el servidor hace uso de `mod_php` (módulo de PHP para apache), sabrá y entenderá lo que le estamos diciendo.
7. Enviamos la petición, y veremos que el servidor nos indicará en la respuesta que el archivo se ha subido correctamente.
8. Ahora volvemos a la petición original del archivo PHP, y lo único que cambiaremos será el nombre. Cambiaremos `exploit.php` por por ejemplo, `exploit.l33t`. Con esto, enviamos la petición y veremos que se ha subido correctamente.
9. Ahora, volviendo a la petición GET del `/files/avatars/<archivo>` donde archivo será `exploit.l33t`, al hacerla, en la respuesta se nos devolverá el secret de Carlos.
10. Mandamos la solución y laboratorio completado.
