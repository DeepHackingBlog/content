---
id: "web-shell-upload-via-content-type-restriction-bypass"
title: "Web shell upload via Content-Type restriction bypass - PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-10
updatedDate: 2022-02-10
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-0.webp"
description: "Aprende a explotar vulnerabilidades de subida de archivos mediante el bypass de restricciones de Content-Type para ejecutar código PHP malicioso."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio de PortSwigger: "Web shell upload via Content-Type restriction bypass".

![Página de inicio del laboratorio de PortSwigger](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-1.avif)

Para resolver el laboratorio tenemos que subir un archivo PHP que lea y nos muestre el contenido del archivo `/home/carlos/secret`. Ya que para demostrar que hemos completado el laboratorio, deberemos introducir el contenido de este archivo.

Además, el servidor está configurado para prevenir la subida de archivos según el `Content-Type`. Por lo que tendremos que bypasear esta defensa.

En este caso, el propio laboratorio nos proporciona una cuenta para iniciar sesión, por lo que vamos a hacerlo:

![Formulario de inicio de sesión](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-2.avif)

![Credenciales de acceso proporcionadas](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-3.avif)

Una vez hemos iniciado sesión, nos encontramos con el perfil de la cuenta:

![Perfil de usuario](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-4.avif)

Como podemos ver, tenemos una opción para subir archivo, y concretamente parece ser que se trata de actualizar el avatar del perfil. Vamos a intentar aprovecharnos de esta opción para subir el siguiente archivo PHP:

![Código PHP para leer el archivo secret](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-5.avif)

Antes que nada, vamos a preparar Burp Suite para que intercepte la petición:

![Configuración del proxy en el navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-6.avif)

![Activación de la interceptación en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-7.avif)

Una vez tenemos Burp Suite listo junto al proxy, seleccionamos el archivo y le damos a “Upload”:

![Selección de archivo para subir](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-8.avif)

![Confirmación de subida de archivo](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-9.avif)

![Procesando la subida del archivo](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-10.avif)

Aquí Burp Suite interceptará la petición de subida del archivo:

![Petición interceptada en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-11.avif)

Vamos a mandar la petición al repeater para tratar con ella mejor, para ello, pulsamos `Ctrl R`.

Una vez en el repeater, cuando le damos a “Send”, podemos ver la respuesta a la subida del archivo por parte del servidor:

![Respuesta del servidor mostrando restricción](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-12.avif)

En este caso, indica que los archivos cuya cabecera `Content-Type` sea `application/x-php` no están permitidos. Y que solo están permitidos los que sea `image/jpeg` o `image/png`.

Sabiendo el tipo de restricción que nos está implantando el servidor, simplemente podemos cambiar el `Content-Type` de nuestra petición:

![Modificación del Content-Type en la petición](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-13.avif)

![Content-Type modificado a image/jpeg](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-14.avif)

Con esto, el contenido del archivo no cambia, y tampoco afectará a que se interprete. Con este cambio, volvemos a intentar la subida del archivo:

![Respuesta exitosa del servidor](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-15.avif)

Esta vez vemos que se ha subido correctamente. Podemos ver esta respuesta en el navegador de la siguiente forma:

![Opción Show response in browser](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-16.avif)

![URL para mostrar respuesta en navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-17.avif)

![Visualización de la respuesta en el navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-18.avif)

![Acceso al perfil desde el navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-19.avif)

Una vez llegados aquí, ya podemos desactivar el Burp Suite, ya que no haremos más uso de él.

![Desactivación del proxy](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-20.avif)

Con esto, volvemos a nuestro perfil.

![Acceso al perfil de usuario](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-21.avif)

Ahora, si nos fijamos en el perfil, podemos ver como el avatar ha cambiado, y ahora muestra un fallo de que no carga bien la imagen:

![Avatar con error de carga](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-22.avif)

Dándole click derecho, podemos irnos a la ruta directa de la imagen para ver si se trata de nuestro archivo PHP:

![Menú contextual para abrir imagen](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-23.avif)

![Ejecución exitosa del archivo PHP](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-24.avif)

Efectivamente, el archivo PHP que hemos subido se ha almacenado como el archivo del avatar, por eso no cargaba en el perfil, intentaba cargar una imagen cuando no lo era. Al visitar el archivo PHP, se ha interpretado el código que hemos colocado, y conseguimos leer el archivo secret.

Habiendo leído este archivo, ya simplemente entregamos la respuesta:

![Formulario para enviar la solución](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-25.avif)

![Confirmación de solución enviada](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-26.avif)

Y de esta forma, completamos el laboratorio:

![Laboratorio completado exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-27.avif)

![Mensaje de confirmación final](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-content-type-restriction-bypass/web-shell-upload-via-content-type-restriction-bypass-28.avif)
