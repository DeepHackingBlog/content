---
id: "remote-code-execution-via-polyglot-web-shell-upload"
title: "Remote code execution via polyglot web shell upload – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-22
updatedDate: 2022-02-22
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-0.webp"
description: "Resolución paso a paso del laboratorio de PortSwigger sobre ejecución remota de código mediante la subida de un web shell polyglot, explotando validación de contenido de archivos."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio de PortSwigger: “Remote code execution via polyglot web shell upload”.

![Página de inicio del laboratorio Remote code execution via polyglot web shell upload](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-1.avif)

Para resolver el laboratorio tenemos que subir un archivo PHP que lea y nos muestre el contenido del archivo `/home/carlos/secret`. Ya que para demostrar que hemos completado el laboratorio, deberemos introducir el contenido de este archivo.

Además, el servidor está configurado para verificar si el archivo es una imagen fijándose en el contenido del mismo.

En este caso, el propio laboratorio nos proporciona una cuenta para iniciar sesión, por lo que vamos a hacerlo:

![Página de inicio de sesión del laboratorio](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-2.avif)

![Credenciales proporcionadas para el laboratorio](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-3.avif)

Una vez hemos iniciado sesión, nos encontramos con el perfil de la cuenta:

![Perfil de usuario con opción de subir avatar](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-4.avif)

Como podemos ver, tenemos una opción para subir archivo, y concretamente parece ser que se trata de actualizar el avatar del perfil. Vamos a intentar aprovecharnos de esta opción para subir el siguiente archivo PHP:

![Archivo PHP con magic numbers de imagen](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-5.avif)

Ojo, si nos fijamos, en este caso, además del propio código PHP. Estoy definiendo un string al principio del archivo. Esto ocurre porque para determinar el tipo de contenido de un archivo, se usan los primeros bytes, lo que se conoce como “magic numbers”. Estos primeros bytes de los archivos determinan de que tipo es o como se trataran, aunque el contenido sea totalmente distinto.

Como vemos, contiene un código PHP, pero el propio linux lo detecta como una imagen, esto ocurre por los magic numbers.

[Lista completa de magic numbers por tipo de archivo](https://gist.github.com/leommoore/f9e57ba2aa4bf197ebc5)

Con esto entendido, configuramos Burp Suite para que intercepte las peticiones:

![Configuración de proxy en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-6.avif)

![Intercepción activada en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-7.avif)

Una vez tenemos Burp Suite listo junto al proxy, seleccionamos el archivo y lo subimos:

![Selección del archivo PHP polyglot para subir](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-8.avif)

![Archivo seleccionado listo para subir](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-9.avif)

![Botón para enviar el archivo al servidor](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-10.avif)

Burp Suite interceptará la petición de la subida del archivo:

![Petición interceptada en Burp Suite mostrando el archivo](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-11.avif)

Para tratar mejor con la petición, la vamos a pasar el repeater y al mismo tiempo le vamos a dar a enviar para analizar la respuesta:

![Respuesta del servidor confirmando la subida exitosa](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-12.avif)

Parece que se ha subido sin problemas. Vamos a ver esta respuesta en el navegador:

![Opción para mostrar respuesta en el navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-13.avif)

![Confirmación para abrir en el navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-14.avif)

![Navegador integrado de Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-15.avif)

![Página del perfil mostrando archivo subido exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-16.avif)

Una vez aquí, ya no nos hará mas falta Burp Suite, por lo que vamos a desactivar el proxy:

![Desactivación del proxy en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-17.avif)

Con esto hecho, nos dirigimos a nuestro perfil:

![Acceso al perfil de usuario](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-18.avif)

Ahora, si nos fijamos en el perfil, podemos ver como el avatar ha cambiado, y ahora muestra un fallo de que no carga bien la imagen:

![Avatar mostrando error de carga de imagen](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-19.avif)

Esto seguramente es porque está intentando cargar nuestro archivo PHP como si fuera una imagen, y claro, falla al hacerlo. Para confirmar si se trata de nuestro archivo PHP, le damos click derecho para ir a la ruta exacta de “la imagen”:

![Menú contextual para abrir imagen en nueva pestaña](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-20.avif)

![Archivo PHP ejecutado mostrando el contenido de secret](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-21.avif)

Como vemos efectivamente se trata de nuestro archivo PHP, y, además del string colocado para establecer los magic numbers, podemos ver el contenido del archivo `secret`. Dicho de otra forma, la salida del código PHP interpretado.

Teniendo el contenido de `secret`, simplemente enviamos la respuesta:

![Formulario para enviar la solución del laboratorio](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-22.avif)

![Confirmación de envío de solución](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-23.avif)

Y de esta forma, resolvemos el laboratorio:

![Laboratorio resuelto exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-24.avif)

![Mensaje de felicitaciones por resolver el laboratorio](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-polyglot-web-shell-upload/remote-code-execution-via-polyglot-web-shell-upload-25.avif)

Además de la solución que hemos llevado a cabo, PortSwigger sugiere otra bastante curiosa y que vale la pena comentar:

1. Creamos un archivo `exploit.php` el cual lea el contenido del archivo `secret` de Carlos, por ejemplo: `<?php echo file_get_contents('/home/carlos/secret'); ?>`
2. Nos logueamos e intentamos subir nuestro archivo PHP en la parte de nuestro avatar. Como veremos, el servidor bloquea cualquier subida de archivo que no se trate de una imagen.
3. Vamos a crear un archivo polyglot PHP/JPG. Es decir, un archivo que sea una imagen pero contenga código PHP en sus metadatos. Para ello, es tan sencillo como usar cualquier imagen y agregarle unos metadatos personalizados usando `exiftool`. Ejemplo: `exiftool -Comment="<?php echo 'START ' . file_get_contents('/home/carlos/secret') . ' END'; ?>" <YOUR-INPUT-IMAGE>.jpg -o polyglot.php` . Esto añadirá el payload PHP al campo de comentario de los metadatos. Con esto, guardaremos la imagen con extensión `.php`.
4. Ahora, subimos este archivo, veremos que no tendremos ningún problema. Con esto hecho, volvemos a nuestro perfil.
5. Si nos vamos al HTTP History de Burp Suite, podremos ver una petición GET a la supuesta imagen del avatar (esta petición se ha producido cuando hemos accedido a nuestro perfil y el avatar ha intentado cargar). Si cogemos esta petición y miramos su respuesta, podremos ver el contenido del archivo `secret` de Carlos.
6. Enviamos la solución y habremos resuelto el laboratorio.
