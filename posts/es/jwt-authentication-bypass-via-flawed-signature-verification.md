---
id: "jwt-authentication-bypass-via-flawed-signature-verification"
title: "JWT authentication bypass via flawed signature verification – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2023-05-15
updatedDate: 2023-05-15
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-0.webp"
description: "Resolución del laboratorio de PortSwigger sobre bypass de autenticación JWT mediante verificación de firma defectuosa, explorando cómo explotar servidores que aceptan tokens sin firmar con algoritmo 'none'."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio "JWT authentication bypass via flawed signature verification":

![Descripción del laboratorio JWT authentication bypass via flawed signature verification](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-1.avif)

Lo primero de todo es iniciar el laboratorio:

![Inicio del laboratorio en PortSwigger](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-2.avif)

Una vez lo iniciamos, nos dirigimos a "My account" e iniciamos sesión con las credenciales que nos dan en la descripción del laboratorio:

![Navegación hacia My account](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-3.avif)

![Formulario de login con credenciales](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-4.avif)

![Sesión iniciada correctamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-5.avif)

Una vez hemos iniciado sesión, ya sea con Burp Suite, las herramientas de desarrollador o como en este caso, la extensión Cookie Editor, podemos ver que se nos ha asignado un JWT:

![Cookie de sesión con token JWT](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-6.avif)

Podemos decodearlo en la web de [jwt.io](https://jwt.io/):

![Estructura del JWT decodificado en jwt.io](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-7.avif)

La vulnerabilidad que se explora en este laboratorio reside en que el servidor acepta JWTs sin firmar, es decir, con algoritmo "none". Por lo que de cara a crear un token válido que no esté firmado, debemos de modificar el campo de `alg` en el header del token, y, además, eliminar la parte de la firma, la parte azul que se puede ver en la imagen de arriba, eso sí, el punto final deberemos de mantenerlo.

Otro detalle importante es que, cuando se está comprobando si el servidor acepta o no tokens sin firmar, se deben de probar distintas combinaciones de "none" como se muestra en el plugin JOSEPH de Burp Suite:

![Variaciones del algoritmo none en el plugin JOSEPH](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-8.avif)

Por ejemplo, en el caso de este laboratorio el único que funciona es el algoritmo "none", pero puede ocurrir lo contrario en otras ocasiones, por lo que siempre habrá que comprobar todos los posibles casos.

Dicho esto, para modificar el JWT que tenemos, es decir, modificar el algoritmo y eliminar la parte de la firma, lo podemos hacer de múltiples maneras, en este caso, usaremos la herramienta de [jwtear](https://github.com/KINGSABRI/jwtear):

![Generación de JWT modificado con jwtear](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-9.avif)

Con esta herramienta, simplemente con el argumento `-h` especificamos el header del token, aquí indicaremos que usaremos el algoritmo "none". Por otra parte, con el argumento `-p` concretamos el payload, que en este caso cambiaremos el usuario que queremos ser, en vez de wiener, pondremos administrator.

De cara a una auditoría real, nos interesaría ver primero si cambiando el algoritmo a "none" y usando el JWT generado, seguimos estando autenticados como wiener, una posible escalada podría venir después de verificar que seguimos autenticados y, por tanto, el servidor acepta JWTs sin firmar.

La herramienta nos muestra por pantalla directamente el token sin la firma, por lo que será directamente copiar y pegar. Copiamos este valor y lo pegamos en este caso en el Cookie Editor para cambiar el valor por el de nuestro token:

![Sustitución del JWT en Cookie Editor](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-10.avif)

Actualizamos la página y:

![Acceso como administrator exitoso](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-11.avif)

Estamos autenticados como el usuario administrator. Con esto hecho, simplemente queda dirigirnos al panel de administración y borrar al usuario Carlos:

![Panel de administración](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-12.avif)

![Eliminación del usuario carlos](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-13.avif)

De esta manera, el laboratorio queda resuelto:

![Laboratorio completado exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-14.avif)

![Confirmación de resolución del laboratorio](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-flawed-signature-verification/jwt-authentication-bypass-via-flawed-signature-verification-15.avif)
