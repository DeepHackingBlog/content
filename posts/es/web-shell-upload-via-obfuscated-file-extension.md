---
id: "web-shell-upload-via-obfuscated-file-extension"
title: "Web shell upload via obfuscated file extension – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-17
updatedDate: 2022-02-17
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-0.webp"
description: "Aprende a bypassear restricciones de subida de archivos mediante la técnica de ofuscación de extensiones con null bytes para ejecutar código PHP."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio de PortSwigger: “Web shell upload via obfuscated file extension”.

![Página de inicio del laboratorio de PortSwigger](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-1.avif)

Para resolver el laboratorio tenemos que subir un archivo PHP que lea y nos muestre el contenido del archivo `/home/carlos/secret`. Ya que para demostrar que hemos completado el laboratorio, deberemos introducir el contenido de este archivo.

Además, el servidor está configurado para que no acepte ciertas extensiones.

En este caso, el propio laboratorio nos proporciona una cuenta para iniciar sesión, por lo que vamos a hacerlo:

![Formulario de inicio de sesión](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-2.avif)

![Credenciales de acceso proporcionadas](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-3.avif)

Una vez hemos iniciado sesión, nos encontramos con el perfil de la cuenta:

![Perfil de usuario](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-4.avif)

Una vez estamos en el perfil, como vemos, tenemos un campo de subida de archivos para actualizar el avatar de nuestra cuenta. Vamos a intentar aprovecharnos de esto para subir el siguiente archivo:

![Código PHP para leer el archivo secret](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-5.avif)

Antes que nada, vamos a preparar el burp suite para que intercepte las peticiones:

![Configuración del proxy en el navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-6.avif)

![Activación de la interceptación en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-7.avif)

Una vez tenemos esta parte configurada, subimos el archivo:

![Selección de archivo para subir](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-8.avif)

![Confirmación de subida de archivo](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-9.avif)

![Procesando la subida del archivo](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-10.avif)

Burp suite interceptará la petición de subida:

![Petición interceptada en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-11.avif)

Para tratar mejor con el proceso de subida de archivos, vamos a pasar la petición al repeater pulsando Ctrl R:

![Petición enviada al Repeater de Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-12.avif)

Como vemos, en este caso, al darle al Send, vemos en la respuesta del servidor que solo los archivos JPG y PNG están permitidos.

Por lo que la idea va a ser introducir una doble extensión junto a un null byte para ver si podemos bypasear esta restricción:

![Modificación de la extensión con null byte](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-13.avif)

![Respuesta exitosa del servidor](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-14.avif)

Al enviar la petición, vemos como en la respuesta, el archivo se ha subido, no solo eso, sino que gracias al null byte, nos hemos desecho de la segunda extensión que habiamos puesto `.jpg`. Por lo que con esto hecho, vamos a ver la respuesta en el navegador:

![Opción para ver respuesta en navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-15.avif)

![Selección de mostrar respuesta en navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-16.avif)

![Respuesta renderizada en el navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-17.avif)

![Confirmación de subida exitosa](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-18.avif)

Ya no vamos a usar burp suite, por lo que desactivamos el proxy:

![Desactivación del proxy](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-19.avif)

Una vez desactivado, nos volvemos a nuestro perfil:

![Acceso al perfil de usuario](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-20.avif)

![Vista del perfil con avatar actualizado](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-21.avif)

Como vemos, el avatar se ha establecido, sin embargo, parece que ha ocurrido un fallo al cargar la imagen. Probablemente porque intenta cargar nuestro archivo PHP como si fuese una imagen y por eso falla. Vamos a acceder a la ruta directa de “la imagen” dandole click derecho:

![Menú contextual para abrir imagen](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-22.avif)

![Error al acceder con extensión incorrecta](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-23.avif)

Parece que nos da un problema, sin embargo, si nos fijamos en la URL, se nos intenta cargar el archivo `readSecret.php%00.jpg`, cuando realmente, el archivo resultante fue `readSecret.php`. Por lo que cambiamos la URL para acceder a este último archivo:

![Ejecución exitosa del código PHP](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-24.avif)

Y de esta forma, accedemos al código PHP y se interpreta, consiguiendo así que leamos el archivo secret.

Habiéndolo leído, ya simplemente enviamos la solución:

![Formulario para enviar la solución](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-25.avif)

![Confirmación de solución enviada](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-26.avif)

Y de esta forma, completamos el laboratorio:

![Laboratorio completado exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-27.avif)

![Mensaje de confirmación final](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-obfuscated-file-extension/web-shell-upload-via-obfuscated-file-extension-28.avif)
