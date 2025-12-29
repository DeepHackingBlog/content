---
id: "jwt-authentication-bypass-via-weak-signing-key"
title: "JWT authentication bypass via weak signing key – PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2023-06-12
updatedDate: 2023-06-12
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-0.webp"
description: "Aprende a explotar vulnerabilidades en JWT con claves de firma débiles en este write-up del laboratorio de PortSwigger sobre autenticación JWT."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio "JWT authentication bypass via weak signing key":

![Descripción del laboratorio JWT authentication bypass via weak signing key](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-1.avif)

Lo primero de todo es iniciar el laboratorio:

![Botón para acceder al laboratorio](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-2.avif)

Una vez lo iniciamos, nos dirigimos a "My account" e iniciamos sesión con las credenciales que nos dan en la descripción:

![Página principal del laboratorio](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-3.avif)

![Formulario de inicio de sesión](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-4.avif)

![Página de cuenta de usuario wiener](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-5.avif)

Una vez hemos iniciado sesión, ya sea con Burp Suite, las herramientas de desarrollador o como en este caso, la extensión Cookie Editor, podemos ver que se nos ha asignado un JWT:

![Cookie JWT en Cookie Editor](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-6.avif)

Podemos decodearlo en [JWT.io](https://jwt.io/):

![JWT decodificado mostrando el usuario wiener](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-7.avif)

Si nos fijamos en este JWT se está usando el algoritmo HMAC, concretamente el HS256. Esto quiere decir que la firma y su comprobación se hace a través de una clave.

Lo interesante de esto es que es como si tuviésemos el hash de una contraseña, es decir, podemos intentar crackear el "secret" que se ha usado para firmar el JWT. En caso de que lo obtengamos, podremos firmar tokens JWT que sean válidos para el servidor, y, asimismo, podremos editarlos.

Para realizar la fuerza bruta podemos usar la herramienta de [jwtear](https://github.com/KINGSABRI/jwtear):

- `jwtear bruteforce -t <JWT> -l <diccionario>`

![Resultado de jwtear bruteforce mostrando el secret encontrado](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-8.avif)

En este caso, el servidor ha usado la palabra "secret1" para firmar los tokens JWT. Ahora que conocemos la palabra con la que se ha firmado los tokens, podemos intentar editar un JWT a nuestro beneficio y firmarlo usando "secret1":

![JWT modificado en JWT.io cambiando usuario a administrator](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-9.avif)

![JWT firmado con el secret encontrado](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-10.avif)

Hemos cambiado el usuario de "wiener" por el de "administrator" con el fin de que, en caso de que la firma funcione y, el usuario "administrator" exista, podamos convertirnos en él.

Si ahora cambiamos nuestro JWT por el JWT que acabamos de generar y actualizamos:

![Reemplazando el JWT en Cookie Editor](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-11.avif)

![Panel de administrador tras el bypass exitoso](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-12.avif)

Nos convertimos en usuarios administradores :), todo debido a que se ha usado un "secret" débil en la firma de los JWT.

Ya simplemente para finalizar el laboratorio, nos dirigimos al panel de administración y eliminamos al usuario "carlos":

![Acceso al panel de administración](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-13.avif)

![Botón para eliminar usuario carlos](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-14.avif)

![Usuario carlos eliminado exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-15.avif)

De esta manera, el laboratorio ya estaría completado:

![Laboratorio completado con éxito](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-16.avif)

JWTear no es la única herramienta que se puede usar para hacer fuerza bruta a JWT, buscando un poco podemos encontrar infinidad de ellas:

![Búsqueda de herramientas para crackear JWT en GitHub](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-17.avif)

Asimismo, podemos encontrar diccionarios para realizar fuerza bruta:

![Diccionarios para JWT en repositorios de GitHub](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-18.avif)

SecLists también tiene un diccionario:

- [scraped-JWT-secrets.txt](https://github.com/danielmiessler/SecLists/blob/master/Passwords/scraped-JWT-secrets.txt)

![Diccionario de secrets JWT en SecLists](https://cdn.deephacking.tech/i/posts/portswigger-labs/jwt-authentication-bypass-via-weak-signing-key/jwt-authentication-bypass-via-weak-signing-key-19.avif)
