---
id: "jwt-authentication-bypass-via-unverified-signature"
title: "JWT authentication bypass via unverified signature – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2023-05-01
updatedDate: 2023-05-01
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-0.webp"
description: "Resolución del laboratorio de PortSwigger sobre bypass de autenticación JWT mediante firma no verificada, explicando cómo explotar esta vulnerabilidad cuando el servidor no valida correctamente las firmas de los tokens."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio "JWT authentication bypass via unverified signature":

![Descripción del laboratorio JWT authentication bypass via unverified signature](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-1.avif)

Lo primero de todo es iniciar el laboratorio:

![Inicio del laboratorio en PortSwigger](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-2.avif)

Una vez lo iniciamos, nos dirigimos a "My account" e iniciamos sesión con las credenciales que nos dan en la descripción del laboratorio:

![Navegación hacia My account](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-3.avif)

![Formulario de login con credenciales](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-4.avif)

![Sesión iniciada correctamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-5.avif)

Ahora que ya estamos autenticados, si observamos las cookies que tenemos, podemos observar como tenemos una cookie llamada "session" la cual es un JWT:

![Cookie de sesión con token JWT](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-6.avif)

Si copiamos este valor y lo colocamos en jwt.io, podemos ver la estructura del JWT:

![Estructura del JWT decodificado en jwt.io](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-7.avif)

En este caso, en la parte del payload, podemos observar el campo de `sub` que tiene como valor el nombre de nuestro usuario. Por lo que algo que se nos puede ocurrir al ver esto es que este campo defina el usuario con el que se está autenticado.

En este punto, si conocemos las vulnerabilidades referentes a JWT se nos pueden ocurrir varias cosas a probar, sin embargo, en este caso, el JWT es vulnerable a "unverified signature". Esto quiere decir que el servidor no revisa si la firma del token JWT es correcta o no, por tanto, sin conocer en este caso la clave pública ni nada, podemos editar el token JWT a nuestro placer debido a que el servidor no va a revisar si el token está firmado correctamente o no.

Como la firma entonces nos da igual, lo que nos interesa es modificar el campo de `sub` para ver si podemos autenticarnos como otro usuario, en este caso, "administrator".

Esta tarea de modificar el JWT se puede hacer de diversas formas, por ejemplo, usando la herramienta [jwtear](https://github.com/KINGSABRI/jwtear):

- `jwtear jws -h <header> -p <payload>`

![Generación de JWT modificado con jwtear](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-8.avif)

En este caso, también le modificamos el algoritmo a "None" porque si lo dejamos en RSA nos pedirá una clave para firmar el token. Que realmente, como no lo verifica, podríamos dejar el mismo algoritmo y firmarlo con cualquier clave. También funciona si modificamos el algoritmo a HMAC y lo firmamos con cualquier secret. Por simplicidad, lo modificamos a "None" y listo.

Con el JWT que acabamos de generar, si lo sustituimos por el que teníamos y actualizamos para usarlo:

![Sustitución del JWT en la cookie de sesión](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-9.avif)

![Acceso como administrator exitoso](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-10.avif)

Nos convertimos en "administrator".

Ya para resolver el laboratorio, nos dirigimos al panel de administración y eliminamos el usuario "carlos".

![Panel de administración](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-11.avif)

![Eliminación del usuario carlos](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-12.avif)

De esta manera se resuelve el primer laboratorio de JWT :).

Todo el procedimiento de edición del JWT lo podríamos haber hecho también usando el plugin de burp suite "JSON Web Tokens". En este caso, interceptaríamos una petición al perfil y la mandamos al repeater:

![Interceptación de petición y envío al Repeater](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-13.avif)

Una vez en el repeater, seleccionamos la extensión:

![Selección de la extensión JSON Web Tokens](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-14.avif)

![Interfaz de la extensión JSON Web Tokens](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-15.avif)

![Partes del JWT decodificadas](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-16.avif)

En la nueva interfaz que se habilita, podemos observar las distintas partes del JWT decodeadas y separadas. En este caso, simplemente tendríamos que editar "wiener" por "administrator" y mandar la petición

![Edición del campo sub en el JWT](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-17.avif)

![Respuesta exitosa con privilegios de administrator](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-unverified-signature/jwt-authentication-bypass-via-unverified-signature-18.avif)

De esta manera también funcionaría, y en este caso, no hemos editado ni la firma ni el algoritmo, solo el payload. Todo debido a lo que ya hemos comentado, al servidor le da bastante igual la firma del JWT.
