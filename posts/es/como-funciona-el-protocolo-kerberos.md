---
id: "como-funciona-el-protocolo-kerberos"
title: "Cómo funciona el protocolo Kerberos"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-09-26
updatedDate: 2022-09-26
image: "https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-kerberos/como-funciona-el-protocolo-kerberos-0.webp"
description: "Guía completa sobre el funcionamiento del protocolo Kerberos en Active Directory, explicando cada paso del proceso de autenticación desde KRB_AS_REQ hasta KRB_AP_REQ."
categories:
  - "active-directory"
draft: false
featured: false
lang: "es"
---

Kerberos es el principal protocolo de autenticación usado en entornos de Active Directory. Por lo que entenderlo es vital para poder entender cómo funciona un directorio activo, y por tanto, cómo atacarlo.

## Introducción

Lo primero de todo, es que Kerberos es un protocolo de autenticación, pero no de autorización, es decir, Kerberos se encarga de verificar que somos quien decimos ser, pero no se encarga de controlar a dónde podemos acceder o no. Esta tarea ya queda en mano de los propios servicios a los que queramos acceder.

Dicho esto, algunas características de este protocolo son:

- Usa el puerto 88 tanto por TCP como UDP.
- Todos los "principals" que participen en una comunicación de Kerberos, deben tener el mismo timestamp (hora) que el servidor donde se ejecuta Kerberos (más adelante le daremos un nombre a este servidor).
    - Un ["principal"](https://web.mit.edu/kerberos/krb5-1.5/krb5-1.5.4/doc/krb5-user/What-is-a-Kerberos-Principal_003f.html) de forma resumida, es una entidad a la cual Kerberos puede asignar tickets.
- Kerberos no suele funcionar con IPs, se basa en DNS.

Ahora bien, sabiendo algunas características de este protocolo, es interesante conocer también, algunas entidades que aparecen en un proceso de autenticación:

- Cliente: es quien comienza el proceso de autenticación en Kerberos, se podría decir que seríamos nosotros.
- Domain Controller: el famoso DC de los directorios activos es el encargado de gestionar todo lo referente a Kerberos. Ahora bien, dentro del ámbito de Kerberos, puede recibir distintos nombres como pueden ser:
    - KDC (Key Distribution Center)
    - AS (Authentication Service)
    - En cualquiera de los casos donde veas que se habla de KDC o AS, se estará hablando de lo mismo, lo cual, normalmente, y en la mayoría de casos, es el Domain Controller.
- AP (Application Server): es el servidor que ofrece el servicio al cual el cliente quiere acceder.

Dicho esto, mencionar que a lo largo del artículo se comentará varias veces "el hash del usuario X". Cuando veas estas referencias, concretamente me refiero al hash NTLM, también conocido como hash NT y también conocido como hash RC4.

Por último, Kerberos se divide principalmente en 5 pasos:

1. [KRB_AS_REQ](#krb_as_req)
2. [KRB_AS_REP](#krb_as_rep)
3. [KRB_TGS_REQ](#krb_tgs_req)
4. [KRB_TGS_REP](#krb_tgs_rep)
5. [KRB_AP_REQ](#krb_ap_req)

Vamos a ir viendo cada uno poco a poco :)

## KRB\_AS\_REQ

Este es el primer paso de toda comunicación de Kerberos, la idea es que el cliente quiere que el KDC le proporcione un TGT (Ticket Granting Ticket). Para ello, el cliente genera un timestamp (marca de tiempo que indica la hora exacta de la petición) y lo cifra con su secret key, que es, básicamente, el hash de su contraseña. Este timestamp cifrado, lo envía al KDC junto a su nombre de usuario:

![Diagrama del proceso KRB_AS_REQ mostrando cliente enviando timestamp cifrado y nombre de usuario al KDC](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-kerberos/como-funciona-el-protocolo-kerberos-1.avif)

El KDC cuando recibe esta información, lo primero que hace es coger el usuario y buscarlo en su base de datos:

![Representación de base de datos del KDC con usuarios y sus hashes](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-kerberos/como-funciona-el-protocolo-kerberos-2.avif)

Si lo encuentra, usará el hash de la contraseña para intentar descifrar el timestamp.

- En caso de que no pueda, significará que el cliente no ha puesto la contraseña correcta.
- En caso de que logre desencriptarlo, validará las credenciales proporcionadas por el cliente.

Si el KDC valida las credenciales, responderá a la petición y seguirá con el proceso.

## KRB_AS_REP

El KDC responde de la siguiente manera:

![Diagrama del proceso KRB_AS_REP mostrando respuesta del KDC con TGT y clave de sesión](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-kerberos/como-funciona-el-protocolo-kerberos-3.avif)

De esta respuesta, hay que explicar varios conceptos:

### Ticket TGT

Un TGT (Ticket Granting Ticket) es un archivo que contiene la información necesaria para identificar a un usuario. Este TGT, está encriptado con la clave del KDC (el hash de la contraseña del usuario krbtgt).

El usuario krbtgt es un usuario especial que existe en kerberos el cual se usa para encriptar los TGT que el KDC proporciona.

Ahora bien, la contraseña (hash realmente) de este krbtgt, solo la conoce el KDC, por lo que, el cliente recibirá el TGT, pero simplemente podrá poseerlo, en ningún momento, podrá desencriptarlo y leer lo que hay dentro, de la misma forma, tampoco podrá manipularlo. De esta manera, se asegura que el TGT solo lo puede leer y manipular el propio KDC.

### Clave de Sesión

En la respuesta que da el KDC, podemos observar como se repite dos veces la palabra "clave de sesión". Una clave de sesión básicamente es una clave aleatoria que tiene un tiempo limitado de uso y además, está asociada al usuario.

Como se puede ver en la respuesta, esta clave de sesión se incluye dentro del TGT, que recordemos, el usuario no puede leerlo porque no puede ver el contenido de este. Y también se incluye fuera de este, encriptado con el hash de la contraseña del usuario. Esto se hace con el fin de que tanto el cliente como el KDC sean capaces de tener la clave de sesión, además, de esta manera, el KDC se asegura que, al menos, una de las claves de sesión, concretamente la que contiene el TGT, no ha sido manipulada.

### PAC (Privilege Attribute Certificate)

El PAC (Privilege Attribute Certificate) es una estructura de información relacionada con el cliente, en pocas palabras, los privilegios del usuario:

- Dominio del cliente y el SID del dominio
- Usuario y su RID
- Los grupos del usuario y sus RIDs
- Otros SIDs:
    - SID que hacen referencia a usuarios y grupos genéricos ([Well-Known SID](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-dtyp/81d92bba-d22b-4a8c-908a-554ab29148ab))
    - SID que referencian a los grupos que no son del dominio actual, es decir, grupos de inter-dominio (esto se refiere a cuando hay más de un dominio en el directorio activo y hay autenticaciones entre ellos).

Además de la información del usuario, el PAC incluye [diversas firmas](https://zer1t0.gitlab.io/posts/attacking_ad/#pac) que sirven para validar su integridad y la del propio TGT.

En cualquier caso, como el PAC se encuentra dentro del TGT, en principio es solo accesible para el KDC. Ahora bien, los servicios pueden verificar el PAC comunicándose con el KDC (aunque no es lo más normal). Sea lo que sea, cuando un servicio verifica el PAC, solo comprueba la firma, no comprueba si los privilegios que contiene son correctos o no.

Otro detalle aparte, es que un cliente puede evitar que el PAC se incluya, especificándolo en el campo KERB-PA-PAC-REQUEST en el AS-REQ.

Entonces, en conclusión, lo que realmente importa de este paso, es que el KDC nos ha dado un TGT. Este TGT es lo que nos permite, a partir de ahora, solicitar acceso a los distintos servicios sin necesidad de que estemos todo el rato poniendo nuestra contraseña, ya que, el TGT verifica quienes somos.

## KRB_TGS_REQ

Bien, una vez llegados a este punto, se podría decir que estamos autenticados, debido a que poseemos un TGT que verifica quiénes somos. Y, además de esto, poseemos una clave de sesión, la cual, recordemos que está asociada a nuestro usuario y tiene un tiempo limitado.

Ahora, imaginémonos que el cliente quiere usar un servicio, por ejemplo, el servicio CIFS que se encuentra en el servidor 1 (FILESERVER). Lo que hará el cliente es enviar una petición con la siguiente información:

![Diagrama del proceso KRB_TGS_REQ mostrando cliente enviando TGT y autenticador al KDC](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-kerberos/como-funciona-el-protocolo-kerberos-4.avif)

En este mensaje, como vemos, una de las cosas que enviamos es el TGT, aquí no hay mucha duda, ya que sabemos qué información contiene y que está cifrado con el hash de la contraseña del usuario krbtgt. Ahora bien, lo que nos interesa es lo siguiente:

### SPN

El SPN (Service Principal Name) de forma resumida, es la estructura de `<Servicio>/<Host>` que ayuda a concretar en un directorio activo a dónde queremos autenticarnos. Debido a que una máquina puede ejecutar varios servicios, de la misma manera, un mismo servicio puede ser ejecutado en varias máquinas. Por esta razón, la importancia del SPN y de que tenga la estructura que tiene.

### Autenticador

Por otra parte, aquí entra un concepto nuevo, el autenticador.

El autenticador sirve para que el KDC pueda asegurarse de que quien está haciendo la petición es el cliente legítimo, por poner un ejemplo, el usuario sikumy, el KDC quiere asegurarse de esto. Para ello, el KDC comparará el contenido del TGT (el cual, como sabemos, es el único que tiene acceso al contenido, por lo que, de esta manera, se asegura que, al menos el TGT, no ha sido manipulado) con el contenido del autenticador.

Entonces, el KDC al recibir esta petición, desencriptará el autenticador usando la clave de sesión que él ya conoce previamente debido a que fue el mismo quien la generó antes, si consigue desencriptarlo genial, lo que hará entonces es comparar los datos del autenticador con los del TGT para ver si son iguales. En conclusión, el KDC con esto, se está asegurando que quien quiera que haya hecho la petición, tiene el TGT y conoce la clave de sesión. Finalmente, si los datos al compararlos son iguales, pues autenticación exitosa.

## KRB_TGS_REP

Ahora, el KDC ha sido capaz de validar la autenticación, y que ha sido realizada por el usuario sikumy. En este punto, devolverá al cliente la información necesaria para que pueda tratar con el servicio. Este mensaje de contestación se conoce como el TGS_REP y contiene la siguiente información:

![Diagrama del proceso KRB_TGS_REP mostrando respuesta del KDC con TGS y nueva clave de sesión](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-kerberos/como-funciona-el-protocolo-kerberos-5.avif)

- Un ticket TGS que contiene el SPN, el nombre de usuario, el PAC, y la nueva clave de sesión (únicamente válida para las comunicaciones entre sikumy y el servidor donde está el servicio y por un tiempo limitado). Este ticket está encriptado con el hash de la contraseña del usuario que ejecuta el servicio.
- La nueva clave de sesión.

Estas dos piezas de información, están encriptadas con la primera clave de sesión, la que originalmente se intercambió entre el KDC y el cliente en la petición KRB\_AS\_REP. De esta manera, cuando el cliente reciba la respuesta, podrá desencriptar el mensaje para obtener él:

- Ticket TGS
- La nueva clave de sesión

El ticket que el cliente obtiene, se conoce como TGS (Ticket Granting Service). Y con esto, acaba la fase de KRB\_TGS\_REP. Como anotación del TGS, realmente, se llamaría ST (Service Ticket), recomiendo que leáis el siguiente enlace:

- [Service Ticket](https://zer1t0.gitlab.io/posts/attacking_ad/#st)

## KRB_AP_REQ

Ahora, el cliente (sikumy) generará otro autenticador que encriptará con la nueva clave de sesión que ha obtenido en el paso anterior. Recordemos que el autenticador no es más que el usuario y el timestamp actual.

Entonces, el cliente enviará al servicio donde se quiere autenticar (ya no lo envía al KDC) el TGS y el autenticador:

![Diagrama del proceso KRB_AP_REQ mostrando cliente enviando TGS y autenticador al servicio](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-kerberos/como-funciona-el-protocolo-kerberos-6.avif)

El servicio, cuando reciba el TGS, podrá desencriptarlo debido a que fue encriptado con el hash de la contraseña del usuario que ejecuta el servicio.

Cuando desencripte el TGS, podrá ver la clave de sesión, la cual le servirá para desencriptar el autenticador.

Con esto, el servicio comparará el contenido del TGS con el del autenticador, de esta manera, el servicio será capaz de validar la autenticidad del usuario, y, gracias al contenido del PAC, comprobará si el usuario tiene acceso a sus recursos.

* * *

Hasta aquí los pasos mínimos del protocolo de Kerberos. Opcionalmente, pueden seguir los siguientes pasos:

6. En el caso de que el servicio quiera validar el PAC, puede preguntarle al DC para comprobar la firma del PAC usando una petición [KERB_VERIFY_PAC_REQUEST](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-apds/b27be921-39b3-4dff-af4a-b7b74deb33b5).
7. El KDC comprobará el PAC y responderá con un código diciendo si el PAC es correcto o no.
8. Por último, en caso de que el cliente lo requiera, el servidor debe autenticarse a sí mismo respondiendo al AP-REQ con un mensaje [AP-REP](https://tools.ietf.org/html/rfc4120#section-5.5.2) y usando la clave de sesión como prueba de que el servicio puede desencriptar el TGS, y por tanto, demostrar que es el servicio verdadero debido a que ha podido desencriptar el TGS.

## Conclusión

Kerberos es un protocolo complejo y que no es sencillo de entender. Pero es de vital importancia conocerlo para entender cómo atacar o defender un directorio activo.

## Referencias

- [Kerberos in Active Directory - Pixis](https://en.hackndo.com/kerberos/)
- [Attacking Active Directory: 0 to 0.9 - Zer1t0](https://zer1t0.gitlab.io/posts/attacking_ad/#kerberos)
- [You Do (Not) Understand Kerberos - Spanish Talk](https://www.youtube.com/watch?v=5uhk2PKkDdw)
- [Kerberos (I): ¿Cómo funciona Kerberos? - Tarlogic](https://www.tarlogic.com/es/blog/como-funciona-kerberos/)
- [Kerberos Explained in a Little Too Much Detail - Steve Syfuhs](https://syfuhs.net/a-bit-about-kerberos)
