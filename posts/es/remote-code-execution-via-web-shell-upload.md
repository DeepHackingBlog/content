---
id: "remote-code-execution-via-web-shell-upload"
title: "Remote Code Execution via Web Shell Upload - PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-09
updatedDate: 2022-02-09
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-0.webp"
description: "Aprende a explotar vulnerabilidades de subida de archivos para lograr ejecución remota de código mediante la carga de una web shell PHP."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio de PortSwigger: "Remote Code Execution via Web Shell Upload".

![Página de inicio del laboratorio de PortSwigger](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-1.avif)

Para resolver el laboratorio tenemos que subir un archivo PHP que lea y nos muestre el contenido del archivo `/home/carlos/secret`. Ya que para demostrar que hemos completado el laboratorio, deberemos introducir el contenido de este archivo.

En este caso, el propio laboratorio nos proporciona una cuenta para iniciar sesión, por lo que vamos a hacerlo:

![Formulario de inicio de sesión](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-2.avif)

![Credenciales de acceso proporcionadas](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-3.avif)

Una vez hemos iniciado sesión, nos encontramos con el perfil de la cuenta:

![Perfil de usuario](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-4.avif)

Como podemos ver, tenemos una opción para subir archivo, y concretamente parece ser que se trata de actualizar el avatar del perfil. Vamos a intentar aprovecharnos de esta opción para subir el siguiente archivo PHP:

<figure>

![Código PHP para leer el archivo secret](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-5.avif)

<figcaption>

Este código simplemente lee el archivo `/home/carlos/secret` a través del comando `cat`.

</figcaption>

</figure>

![Selección de archivo para subir](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-6.avif)

![Confirmación de archivo seleccionado](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-7.avif)

Una vez seleccionado, le damos a `Upload`, y se nos redireccionará a una página donde se nos dirá que el archivo ha sido subido correctamente:

<figure>

![Mensaje de éxito al subir el archivo](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-8.avif)

<figcaption>

En este caso no hay ningún tipo de sanitización

</figcaption>

</figure>

Por lo que ahora, si nos fijamos en el perfil, podemos ver como el avatar ha cambiado, y ahora muestra un fallo de que no carga bien la imagen.

![Avatar con error de carga](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-9.avif)

Dándole click derecho, podemos irnos a la ruta directa de la imagen para ver si se trata de nuestro archivo PHP:

![Menú contextual para abrir imagen](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-10.avif)

![Ejecución exitosa del archivo PHP](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-11.avif)

Efectivamente, el archivo PHP que hemos subido se ha almacenado como el archivo del avatar, por eso no cargaba en el perfil, intentaba cargar una imagen cuando no lo era. Al visitar el archivo PHP, se ha interpretado el código que hemos colocado, y conseguimos leer el archivo secret.

Habiendo leído este archivo, ya simplemente entregamos la respuesta:

![Formulario para enviar la solución](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-12.avif)

![Confirmación de solución enviada](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-13.avif)

Y de esta forma, completamos el laboratorio:

![Laboratorio completado exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-14.avif)

![Mensaje de confirmación final](https://cdn.deephacking.tech/i/posts/portswigger-labs/remote-code-execution-via-web-shell-upload/remote-code-execution-via-web-shell-upload-15.avif)
