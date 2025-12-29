---
id: "unconstrained-delegation"
title: "Unconstrained Delegation - Kerberos"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2023-02-13
updatedDate: 2023-02-13
image: "https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-0.webp"
description: "Guía completa sobre Unconstrained Delegation en Kerberos y Active Directory, incluyendo cómo funciona, enumeración y técnicas de explotación para comprometer el dominio."
categories:
  - "active-directory"
draft: false
featured: false
lang: "es"
---

Unconstrained Delegation es una característica existente en los entornos de Active Directory que permite por así decirlo "confiar" de manera ciega en un equipo del dominio (o usuario, aunque este último no es lo más normal). Cuando hablamos de "confiar" me estoy refiriendo a que, por ejemplo, yo permita que ese equipo o usuario, pueda llevar a cabo acciones en mi nombre.

> Si no lo has leído, te recomiendo que antes de seguir leas [Humilde intento de explicar Kerberos](https://blog.deephacking.tech/es/posts/como-funciona-el-protocolo-kerberos/)

En Kerberos, la manera de poder decir "yo soy yo" es a través de un TGT, esta es la forma en la que demostramos quien somos en este tipo de entornos. Por lo que, para que un equipo o usuario pueda realizar acciones en mi nombre, necesitará mi TGT. Y esta es un poco la idea básica de la delegación.

En conclusión, y en muy resumidas cuentas, la idea es que yo le proporcione mi TGT al equipo que tenga el Unconstrained Delegation habilitado, para que pueda realizar acciones en mi nombre. El problema de esto, es que si yo tengo acceso a un equipo el cual tiene esta característica habilitada, puedo mirar en la memoria si hay tickets de TGT de usuarios ajenos al mío, lo que me permitiría realizar movimientos laterales o escalar privilegio en el directorio activo.

Vamos a ver todo lo que se ha comentado más en detalle y paso a paso.

Imaginémonos la situación en la que yo me autentico con mi usuario de dominio a un recurso SMB de otro equipo, lo que ocurriría es simple, comenzaría un proceso de autenticación en Kerberos paso por paso. Ahora bien, en uno de estos pasos, concretamente en el KRB\_TGS\_REP el comportamiento de la autenticación cambiará dependiendo de si el equipo donde se encuentra el servicio al que estamos intentando autenticarnos, tiene el Unconstrained Delegation habilitado o no.

- Si el equipo NO tiene el Unconstrained Delegation, la respuesta del KDC en el KRB\_TGS\_REP será la siguiente:

![Respuesta KRB_TGS_REP sin Unconstrained Delegation](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-1.avif)

Una respuesta normal y la "típica". Ahora bien:

- Si el equipo tiene el Unconstrained Delegation habilitado, la respuesta será así:

![Respuesta KRB_TGS_REP con Unconstrained Delegation](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-2.avif)

El KDC incluirá, dentro del TGS, el TGT del usuario.

> Recordemos que el TGS está cifrado con el hash de la contraseña del usuario que ejecuta el servicio. Por lo que él será el único que podrá desencriptar el TGS para obtener el TGT.

Siguiendo con el proceso de autenticación de Kerberos, ya sabemos que lo que va ahora es el KRB\_AP\_REQ, el paso donde el cliente (nosotros), envía el TGS al servicio para que finalmente él decida si autorizarnos o no:

![Proceso KRB_AP_REQ con Unconstrained Delegation](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-3.avif)

El cliente enviará el TGS y cuando el servicio lo reciba, podrá desencriptarlo y entre otras cosas, obtener el TGT, el cual, se quedará en la memoria para que pueda ser usado por el servicio (o un atacante...).

> Cuando se habilita el Unconstrained Delegation, lo que se está habilitando es la flag [TRUSTED\_FOR\_DELEGATION](https://learn.microsoft.com/en-us/troubleshoot/windows-server/identity/useraccountcontrol-manipulate-account-properties) en la cuenta del servicio.

Por ejemplo, si habilitamos el Unconstrained Delegation en el siguiente equipo:

![Habilitación de Unconstrained Delegation en equipo](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-4.avif)

Al enumerar el [UserAccountControl](https://learn.microsoft.com/en-us/troubleshoot/windows-server/identity/useraccountcontrol-manipulate-account-properties), podremos ver la flag TRUSTED\_FOR\_DELEGATION habilitada:

<figure>

![Flag TRUSTED_FOR_DELEGATION en Get-DomainComputer](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-5.avif)

<figcaption>

Get-DomainComputer

</figcaption>

</figure>

Por lo que si esta flag no se encuentra en la cuenta que corre el servicio, el KDC nunca incluirá el TGT cuando nos intentemos autenticar en ese servicio. El KDC tampoco incluirá el TGT si el usuario que corre el servicio de la delegación, pertenece al grupo Protected Users, o posee la flag NOT\_DELEGATED, la delegación no funcionará aunque se tenga la flag TRUSTED\_FOR\_DELEGATION.

En conclusión, el proceso completo es:

1. Un usuario Y solicita un TGS para un servicio X que ejecuta un usuario X (ya sea cuenta de equipo o de usuario normal).
2. El KDC mira si la flag TRUSTED\_FOR\_DELEGATION se encuentra habilitada en el usuario X y si pertenece al grupo Protected Users o posee la flag NOT\_DELEGATED.
3. En caso de que solo posea TRUSTED\_FOR\_DELEGATION, el KDC incluirá un TGT del usuario Y dentro del TGS para el servicio X.
4. Por último, el servicio X recibirá el TGS y obtendrá el TGT del usuario Y.
5. A partir de aquí, como el servicio X ya tiene el TGT del usuario, cada vez que se quiera autenticar contra un servicio en nombre del usuario Y, realizará los pasos correspondientes a KRB\_TGS\_REQ y KRB\_TGS\_REP para obtener un TGS para el servicio en cuestión donde se quiera autenticar

La siguiente imagen de [adsecurity.org](https://adsecurity.org/?p=1667) ilustra muy bien este proceso completo:

<figure>

![Diagrama de flujo de comunicación de Kerberos Unconstrained Delegation](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-6.avif)

<figcaption>

Kerberos Unconstrained Delegation Communication Flow

</figcaption>

</figure>

Conociendo como funciona todo el proceso y de que trata el Unconstrained Delegation, vamos a verlo de forma práctica.

Pongámonos en situación, acabamos de entrar a la red corporativa y tenemos un usuario del dominio, por lo que, procedemos a enumerar el directorio activo, concretamente, queremos revisar si existe algún equipo o usuario el cual tenga el Unconstrained Delegation habilitado, dicho de otra forma, la flag TRUSTED\_FOR\_DELEGATION.

Podemos enumerar esta información de diferentes maneras:

- [PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1)

```powershell
Get-DomainComputer -UnConstrained
```

![Enumeración con PowerView Get-DomainComputer](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-7.avif)

![Resultado de enumeración con PowerView](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-8.avif)

- [Módulo de ActiveDirectory](https://learn.microsoft.com/en-us/powershell/module/activedirectory/?view=windowsserver2022-ps)

```powershell
Get-ADComputer -Filter {TrustedForDelegation -eq $True}
```

![Enumeración con Get-ADComputer](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-9.avif)

```powershell
Get-ADComputer -Filter {TrustedForDelegation -eq $true -and primarygroupid -eq 515} -Properties trustedfordelegation,serviceprincipalname,description
```

![Enumeración detallada con Get-ADComputer](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-10.avif)

```powershell
Get-ADUser -Filter {TrustedForDelegation -eq $True}
```

Enumerar si algún usuario normal posee la flag TrustedForDelegation.

![Enumeración de usuarios con Get-ADUser](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-11.avif)

En este caso no hay ningún usuario "normal" que tenga la flag habilitada.

Llegados a este punto, ya hemos enumerado el directorio activo y hemos visto que hay una máquina que posee el Unconstrained Delegation habilitado. Por lo tanto, vamos a imaginarnos que de una u otra forma, conseguimos comprometer esta máquina.

La idea ahora sería observar si hay TGT's almacenados en memoria, para ello podemos hacer uso de Mimikatz o Rubeus.

Por ejemplo, vamos a probar primero con Mimikatz:

```powershell
Invoke-Mimikatz –Command '"sekurlsa::tickets /export"'
```

![Exportación de tickets con Mimikatz](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-12.avif)

Una vez exportado los tickets, podemos visualizarlos en el directorio actual:

![Tickets exportados en el directorio](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-13.avif)

En este caso, si nos fijamos, todos los tickets pertenecen al usuario que ya tenemos al haber comprometido esta máquina, por lo que no hay ningún TGT relevante. Sin embargo, si yo ahora fuerzo una autenticación del Administrador del Dominio en este equipo, por ejemplo usando PSSession:

![Forzar autenticación con PSSession](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-14.avif)

![Tickets exportados después de autenticación](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-15.avif)

![Detalle de tickets del Administrator](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-16.avif)

Al dumpear de nuevo los tickets, esta vez podemos observar cómo hay algunos pertenecientes al usuario Administrator y al servicio krbtgt. Si pertenece al servicio krbtgt significa que es un ticket TGT. Además, en el output de Mimikatz podemos visualizar los detalles de forma más ordenada, con el fin de confirmar que se trata de un ticket TGT del usuario Administrator.

Este mismo procedimiento se puede llevar a cabo con Rubeus:

```powershell
.\Rubeus.exe monitor /interval:5 /nowrap
```

![Monitorización de tickets con Rubeus](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-17.avif)

Con Rubeus podemos concretar cada cuánto tiempo queremos monitorizar si hay tickets en memoria usando el argumento /interval, en este caso, cada 5 segundos. Al ejecutar esto, Rubeus nos mostrará tanto los tickets que ya hay en memoria, como los nuevos que vayan llegando.

Para evitar el ruido se puede concretar que solo se muestren los tickets del usuario concreto que especifiques, por ejemplo, Administrator:

![Monitorización específica de usuario Administrator](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-18.avif)

De esta manera, se quedará esperando a que llegue algún TGT de este usuario. Si ahora forzamos una autenticación del usuario Administrator:

![Forzar autenticación del Administrator](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-19.avif)

Rubeus detectará el TGT y lo mostrará por pantalla en base64:

![TGT detectado por Rubeus en base64](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-20.avif)

Con estas dos herramientas vistas, podemos dumpear y visualizar los tickets que pueda haber en la memoria de un equipo.

Ahora bien, ¿qué se haría ahora?

Llegados a este punto y teniendo TGT's se procedería a realizar Pass The Ticket. Esto lo veremos en otro post, sin embargo, he aquí un ejemplo para el TGT recopilado con Rubeus:

Convertir el ticket con [ticketConverter.py de Impacket](https://raw.githubusercontent.com/SecureAuthCorp/impacket/master/examples/ticketConverter.py)

<figure>

![Uso de Pass The Ticket con CrackMapExec](https://cdn.deephacking.tech/i/posts/unconstrained-delegation/unconstrained-delegation-21.avif)

<figcaption>

Importante concretar el FQDN en CrackMapExec, la IP no funcionaría

</figcaption>

</figure>

De esta manera, se consigue comprometer el DC, y con ello, el directorio activo. No siempre será tan sencillo como obtener un TGT de un administrador del dominio directamente, a veces obtendremos TGT's de otros usuarios del dominio que nos permitirán realizar movimientos laterales en la red.

Por último, si no te has dado cuenta aún, el Unconstrained Delegation se puede combinar super bién con [ataques de Coerce](https://www.thehacker.recipes/ad/movement/mitm-and-coerced-authentications).

## Referencias

- [Unconstrained Delegation - Penetration Testing Lab](https://pentestlab.blog/2022/03/21/unconstrained-delegation/)
- [Active Directory Security Risk #101: Kerberos Unconstrained Delegation (or How Compromise of a Single Server Can Compromise the Domain)](https://adsecurity.org/?p=1667)
- [Kerberos Unconstrained Delegation - Red Team Notes](https://www.ired.team/offensive-security-experiments/active-directory-kerberos-abuse/domain-compromise-via-unrestricted-kerberos-delegation)
- [Kerberos (III): ¿Cómo funciona la delegación? - Tarlogic](https://www.tarlogic.com/es/blog/kerberos-iii-como-funciona-la-delegacion/#Unconstrained_Delegation)
