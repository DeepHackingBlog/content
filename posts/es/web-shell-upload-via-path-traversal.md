---
id: "web-shell-upload-via-path-traversal"
title: "Web shell upload via path traversal - PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-15
updatedDate: 2022-02-15
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-0.webp"
description: "Aprende a explotar vulnerabilidades de subida de archivos mediante técnicas de path traversal para bypassear restricciones de ejecución y ejecutar código PHP malicioso."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio de PortSwigger: "Web shell upload via path traversal".

![Página de inicio del laboratorio de PortSwigger](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-1.avif)

Para resolver el laboratorio tenemos que subir un archivo PHP que lea y nos muestre el contenido del archivo `/home/carlos/secret`. Ya que para demostrar que hemos completado el laboratorio, deberemos introducir el contenido de este archivo.

Además, el servidor está configurado para prevenir la ejecución de archivos suministrados por el usuario, por lo que tendremos que bypasear esta defensa.

En este caso, el propio laboratorio nos proporciona una cuenta para iniciar sesión, por lo que vamos a hacerlo:

![Formulario de inicio de sesión](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-2.avif)

![Credenciales de acceso proporcionadas](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-3.avif)

Una vez hemos iniciado sesión, nos encontramos con el perfil de la cuenta:

![Perfil de usuario](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-4.avif)

Como podemos ver, tenemos una opción para subir archivo, y concretamente parece ser que se trata de actualizar el avatar del perfil. Vamos a intentar aprovecharnos de esta opción para subir el siguiente archivo PHP:

![Código PHP para leer el archivo secret](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-5.avif)

Antes que nada, vamos a preparar Burp Suite para que intercepte la petición:

![Configuración del proxy en el navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-6.avif)

![Activación de la interceptación en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-7.avif)

Una vez tenemos Burp Suite listo junto al proxy, seleccionamos el archivo y le damos a “Upload”:

![Selección de archivo para subir](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-8.avif)

![Confirmación de subida de archivo](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-9.avif)

![Procesando la subida del archivo](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-10.avif)

Aquí Burp Suite interceptará la petición de subida del archivo:

![Petición interceptada en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-11.avif)

Teniendo esta petición, vamos a irnos a la pestaña del "Decoder" de Burp Suite y vamos a URL encodear lo siguiente:

<figure>

![URL encoding del nombre del archivo](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-12.avif)

<figcaption>

`../readSecret`

</figcaption>

</figure>

URL encodeamos esto porque es el nombre que le vamos a poner al archivo que estamos subiendo, le cambiaremos el nombre en la propia petición. Se encodea para que los símbolos del punto y el slash, no sean eliminados o malinterpretados por el servidor.

Subiendo un archivo con este nombre, dependiendo de como lo trate el servidor, puede que consigamos que se almacene un directorio atrás del que debería, y, de esta forma, bypasear la restricción que nos indica que el servidor no ejecutará archivos suministrados por el usuario. Esta técnica de usar punto y slash, se llama Path Traversal.

Dicho esto, pasamos la petición al repeater con Ctrl R, le cambiamos el nombre y enviamos la petición:

![Petición modificada con path traversal en Repeater](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-13.avif)

Según la respuesta, el archivo se ha subido exitosamente y además con el nombre de `../readSecret.php`. Vamos a ver esta respuesta en el navegador. Para ello, hacemos click derecho en la respuesta, clickamos en la opción de "Show response in browser" y copiamos el link que se nos genera:

![Opción Show response in browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-14.avif)

![URL para mostrar respuesta en navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-15.avif)

Una vez llegados aquí, ya podemos desactivar el Burp Suite, ya que no haremos más uso de él.

![Desactivación del proxy](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-16.avif)

Con esto, volvemos a nuestro perfil.

![Acceso al perfil de usuario](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-17.avif)

Ahora, si nos fijamos en el perfil, podemos ver como el avatar ha cambiado, y ahora muestra un fallo de que no carga bien la imagen:

![Avatar con error de carga](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-18.avif)

Dándole click derecho, podemos irnos a la ruta directa de la imagen para ver si se trata de nuestro archivo PHP:

![Menú contextual para abrir imagen](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-19.avif)

![Ejecución exitosa del archivo PHP](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-20.avif)

Y efectivamente, el archivo PHP que hemos subido se ha almacenado como el archivo del avatar, por eso no cargaba en el perfil, intentaba cargar una imagen cuando no lo era. Al visitar el archivo PHP, se ha interpretado el código que hemos colocado, y conseguimos leer el archivo secret. De hecho, también podríamos acceder al archivo en la siguiente ruta:

![Acceso alternativo al archivo PHP mediante path traversal](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-21.avif)

Se ha subido un directorio más atrás del que debería, por eso se interpreta y no le afecta la restricción del servidor.

Habiendo leído este archivo, ya simplemente entregamos la respuesta:

![Formulario para enviar la solución](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-22.avif)

![Confirmación de solución enviada](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-23.avif)

Y de esta forma, completamos el laboratorio:

![Laboratorio completado exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-24.avif)

![Mensaje de confirmación final](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-path-traversal/web-shell-upload-via-path-traversal-25.avif)
