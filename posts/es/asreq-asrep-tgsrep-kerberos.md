---
id: "asreq-asrep-tgsrep-kerberos"
title: "AS-REQroasting, AS-REProasting y TGS-REProasting (Kerberoasting) - Kerberos"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-12-19
updatedDate: 2022-12-19
image: "https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-0.webp"
description: "Aprende a explotar las tres fases del protocolo Kerberos mediante AS-REQroasting, AS-REProasting y Kerberoasting para obtener credenciales en entornos de Active Directory."
categories:
  - "active-directory"
draft: false
featured: false
lang: "es"
---

En este blog ya hemos hablado de kerberos, y, si al menos tienes una vaga idea de como funciona, sabrás que en ciertos pasos de una autenticación de este protocolo, cierta información viaja cifrada con el hash de la contraseña del usuario.

¿Qué ocurre con esto? Si somos capaces de interceptar una de estas comunicaciones donde viaja algo cifrado con el hash de la contraseña del usuario, podemos intentar crackear esta información, con el fin de que, si conseguimos desencriptarlo, habremos averiguado la contraseña del usuario.

Los pasos de una autenticación de este protocolo que incluyen información cifrada con el hash de la contraseña de un usuario, son:
- AS-REQ (1º paso)
- AS-REP (2º paso)
- TGS-REP (4º paso)

Vamos a ir viendo cada paso y como podemos explotar cada uno de ellos. Si quieres leer y saber como funciona kerberos antes de seguir con este post, mira el siguiente artículo:

- [Humilde intento de explicar Kerberos](https://blog.deephacking.tech/es/posts/como-funciona-el-protocolo-kerberos/)

## AS-REQroasting

En el proceso de autenticación de kerberos en el paso llamado AS-REQ, el usuario manda a través de la red la siguiente información:

![Proceso AS-REQ en Kerberos](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-1.avif)

El usuario envía un timestamp cifrado con el hash de su contraseña. Por lo que, si interceptamos este paquete, podemos intentar crackearlo con el fin de que, si conseguimos desencriptarlo, será porque habremos averiguado la contraseña.

Te puedes preguntar como interceptamos este paquete, y la respuesta es simple, esnifando la red.

Estando conectado a la misma red que un directorio activo, nosotros como atacante de forma totalmente pasiva podemos ponernos en escucha para recopilar todos los paquetes que se mueven en la red, con la idea de que alguno de ellos sea un AS-REQ.

Hay múltiples herramientas que nos permiten esnifar la red con el objetivo de capturar credenciales y autenticaciones, o a su vez, pasarle como input un archivo PCAP que tengamos (ya que muchas veces, sobre todo cuando no estemos presencialmente haciendo la auditoría, tendremos que usar otra máquina para esnifar el tráfico, y en estos casos generaremos un PCAP y nos lo traeremos a nuestra máquina):

- [PCredz](https://github.com/lgandx/PCredz)
    - `apt install python3-pip && sudo apt-get install libpcap-dev && pip3 install Cython && pip3 install python-libpcap`
    - En el caso de que de un error de libpcap no instalado, podemos hacer uso de la versión de Docker:
        - [PCredz Docker](https://github.com/snovvcrash/PCredz)
            - `alias pcredz='sudo docker run --rm -it --network host -v ~/.pcredz:/home/<USUARIO>/.pcredz snovvcrash/pcredz'`
- [Net Creds](https://github.com/DanMcInerney/net-creds)
- [Credslayer](https://github.com/ShellCode33/CredSLayer)

PCredz considero que es la más completa, o, al menos, la más actualizada. Sin embargo, sí que es cierto que es la que más problemas puede dar en la instalación y ejecución. En cualquier caso, es importante conocer alternativas a estas herramientas como las que menciono arriba.

A la hora de capturar peticiones AS-REQ sí que es cierto que he tenido problemas y en mi directorio activo local no he conseguido detectarlas con estas herramientas. De todas formas, esto no quiere decir que no se pueda. La forma más manual de hacerlo es usando el propio wireshark para poder ver todos los paquetes en RAW:

![Captura de paquetes en Wireshark](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-2.avif)

Los campos de un paquete AS-REQ necesarios para generar la cadena que pasaremos posteriormente a John o Hashcat son:

- Nombre de usuario
- Dominio - Ejemplo: DEEPHACKING.LOCAL (Importante, DEEPHACKING asecas no funcionaría, hace falta el dominio completo)
- Cipher

Con wireshark podemos encontrar todos estos datos de forma sencilla analizando cada paquete:

<figure>

![Referencia de campos Kerberos en Wireshark](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-3.avif)

<figcaption>

[Documentación de Wireshark sobre Kerberos](https://www.wireshark.org/docs/dfref/k/kerberos.html)

</figcaption>

</figure>

Con estos datos, formamos una cadena con la siguiente estructura:

- `$krb5pa$18$<nombre de usuario>$<dominio>$<cipher>`

Entonces, quedaría en este caso así:

- `$krb5pa$18$rosa.melano$DEEPHACKING.LOCAL$740eb5f92bf6d5dfa18fd860ceae7d99ce1e3f7fb7a7d2f8a0c776c316f80aefc4fe91155d8b67352e7923b8e78bc1d6bc6da2a30f901214`

La forma manual a través de wireshark que acabamos de ver es fácilmente automatizable en bash usando tshark:

```bash
#!/bin/bash

# Usamos tshark para filtrar los paquetes AS-REQ y mostrar los campos CNameString, realm y cipher

filter=$(tshark -r $1 -Y "kerberos.msg_type == 10 && kerberos.cipher && kerberos.realm && kerberos.CNameString" -T fields -e kerberos.CNameString -e kerberos.realm -e kerberos.cipher -E separator=$ )

for i in $(echo $filter | tr ' ' '\n') ; do

    echo "\$krb5pa\$18\$$i"

done
```

De esta manera, si le pasamos a este script un archivo PCAP, parseará en busca de paquetes AS-REQ, y nos lo devolverá en formato hashcat:

![Salida del script con hash en formato hashcat](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-4.avif)

Con esto, procedemos a pasárselo a hashcat con el siguiente comando:

- `hashcat -m 19900 <archivo con hash/es> <diccionario>`
    - Nunca está de más confirmar el formato del hash que tenemos usando la [lista de hashes de ejemplos de hashcat](https://hashcat.net/wiki/doku.php?id=example_hashes).

![Hashcat crackeando contraseñas](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-5.avif)

Y listo. Obtenemos las contraseñas las cuales el usuario ha usado para intentar autenticarse. Como el AS-REQ es el primer paso de kerberos, puede que detectemos contraseñas correctas o incorrectas, como es el caso de arriba, que detectamos múltiples contraseñas para el mismo usuario. Con el mismo wireshark, basándonos en el AS-REP, podremos determinar cuál es la correcta :).

Y básicamente esto es el AS-REQroasting, esnifar este tipo de paquetes en la red con la finalidad de posteriormente intentar su crackeo de forma offline.

## AS-REProasting

Ya hemos visto un paso donde se envían datos cifrados usando el hash de la contraseña del usuario, pero no es el único. Justamente la respuesta a la petición del AS-REQ, es decir, el AS-REP, también contiene datos cifrados de la forma mencionada:

![Proceso AS-REP en Kerberos](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-6.avif)

El KDC envía la clave de sesión cifrada con el hash de la contraseña del usuario con el fin de que el usuario, cuando reciba el mensaje, pueda leer la clave de sesión.

El AS-REProasting es un poco distinto al AS-REQroasting, porque en este último, dependemos completamente del sniffing para obtener un paquete de este tipo. Sin embargo, el AS-REProasting, se puede "forzar" si se dan ciertas condiciones.

Una de estas condiciones es que un usuario del dominio tenga habilitado el atributo DONT\_REQ\_PREAUTH:

![Atributo DONT_REQ_PREAUTH habilitado](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-7.avif)

Este atributo hace que el primer paso de una autenticación de kerberos, no sea necesaria, es decir, cualquier persona puede generar un respuesta AS-REP para el usuario que tenga este atributo habilitado. Esto quiere decir, que cualquier persona puede obtener un dato cifrado con el hash de la contraseña del usuario.

Por ejemplo, vamos a simular el escenario en el que tenemos un usuario del dominio. Nosotros como tal, no sabemos si algún usuario del dominio tiene habilitado el atributo DONT\_REQ\_PREAUTH, es algo que tenemos que comprobar, por lo que, primero de todo, usando las credenciales de la cuenta de dominio que ya tenemos, enumeramos todos los usuarios del dominio:

- `impacket-GetADUsers -all <dominio>/<usuario>:<contraseña> -dc-ip <ip dc>`

![Enumeración de usuarios del dominio con impacket-GetADUsers](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-8.avif)

De la salida del comando, creamos un archivo con los usuarios del dominio:

![Archivo con listado de usuarios del dominio](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-9.avif)

Y ahora, teniendo una lista de todos los usuarios del dominio, si tenemos suerte, puede que alguno tenga el atributo DONT\_REQ\_PREAUTH habilitado. Lo comprobaremos de la siguiente manera:

- `impacket-GetNPUsers <dominio>/ -usersfile <archivo con listado de usuarios> -no-pass -format john -dc-ip <ip dc>`

![Detección de usuarios con DONT_REQ_PREAUTH mediante GetNPUsers](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-10.avif)

> Si nos fijamos, de esta manera, realmente no necesitamos tener una cuenta de dominio, antes simplemente hemos usado la cuenta que tenemos para sacar el listado de usuarios. Pero si no tuviésemos ninguna cuenta, podríamos crear un listado de posibles usuarios y hacer lo mismo. En cualquier caso, GetNPUsers también se puede lanzar usando credenciales en vez de un listado de usuarios:
> 
> - `GetNPUsers.py <dominio>/<usuario>:<contraseña> -request -format <formato john o hashcat> -outputfile <archivo de salida>`

En este caso, tanto el usuario Administrator como el usuario lola.mento lo tienen habilitado, por lo que obtenemos datos cifrados que podemos intentar crackear de forma offline para obtener la contraseña de los usuarios en cuestión.

> Agregando el parámetro `-format hashcat`, podemos decir que nos lo muestre en formato hashcat en vez de john. También, podemos especificar el parámetro `-outputfile cipherdata.txt` para que nos exporte directamente los datos a un archivo.

Teniendo estos datos, podemos intentar crackearlos, ya sea con john o hashcat:

![Crackeo de hashes con John the Ripper](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-11.avif)

De esta forma, se consiguen obtener las contraseñas de los usuarios.

> El comando para crackear con hashcat sería:
> 
> - `.\hashcat.exe -O -m 18200 -a 0 <archivo> <diccionario>`

Todo este proceso que hemos realizado también se puede hacer desde Windows.

Pongámonos en la situación, en la que, estamos conectados por VPN a la red donde se encuentra el directorio activo (si estuviésemos conectados presencialmente, pues por supuesto que también funcionaría). Nosotros estamos con nuestro equipo corporativo con Windows, en el cual se ejecuta la VPN, y dentro del Windows, pues está nuestro kali con por ejemplo NAT, esto último es un poco indiferente, pero es por detallar una situación bastante común, si no la que más.

Bien, con todo esto, desde tu Windows, aunque no pertenezca al directorio activo que vas a auditar, puedes abrir una consola en el contexto del directorio activo objetivo usando RunAs:

- `runas /netonly /user:<FQDN del dominio>\<usuario> cmd.exe`

![Ejecución de RunAs para abrir consola en contexto del dominio](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-12.avif)

> Importante, este comando te abre la consola sin importar que la contraseña que hayas puesto sea correcta o no, es decir, cuando introduces la contraseña no hace la verificación, para que en caso de que sea correcta abrirte la consola, y de lo contrario no hacerlo.
> 
> Por lo que hay que tener mucho cuidado, y asegurarse al 100% de que has introducido la contraseña bien, sino, nada funcionará, e incluso, puedes llegar a bloquear el usuario del dominio si tiras alguna herramienta y hace múltiples peticiones con contraseña incorrecta.
> 
> Para verificar que se haya puesto la contraseña correctamente se puede lanzar el siguiente comando en la consola abierta:
> 
> - `net view \\<dominio>\`

> Otra cuestión es que en la situación que hemos propuesto, al estar conectados por VPN, el DNS automáticamente se configurará para el DC. En caso de que no fuera así, tendremos que configurar en nuestro equipo la IP del DC como DNS.

Ahora, usando la consola que tenemos en el contexto del usuario del directorio activo, podemos usar la herramienta que queramos para realizar el AS-REProasting. En este caso, usaré [Rubeus](https://github.com/GhostPack/Rubeus):

- `Rubeus.exe asreproast`

![AS-REProasting con Rubeus desde Windows](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-13.avif)

> Rubeus admite especificar el formato del hash para su posterior crackeo con los siguientes argumentos:
> 
> - `/format:hashcat`
> - `/format:john`

¡Y listo! Acabamos de hacer un AS-REProasting desde un Windows que NO pertenece al dominio, usando una consola en el contexto de un usuario del dominio ajeno. Este uso de RunAs es muy útil, ya que hará que cualquier herramienta de Windows funcione para auditar el dominio objetivo.

Otra herramienta para realizar el AS-REProasting en Windows es:

- [ASREPRoast.ps1](https://github.com/HarmJ0y/ASREPRoast/blob/master/ASREPRoast.ps1)

De forma adicional, desde Windows, podemos enumerar los usuarios que tengan el DONT\_REQ\_PREAUTH de las siguientes maneras:

- Usando [PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1)
    - `Get-DomainUser -PreauthNotRequired -Properties SamAccountName`
- Usando el módulo de [ActiveDirectory](https://learn.microsoft.com/en-us/powershell/module/activedirectory/) de Microsoft
    - `Get-ADUser -Filter {DoesNotRequirePreAuth -eq $True} -Properties DoesNotRequirePreAuth`

Desde linux, además de la forma que hemos visto, también podríamos hacerlo usando otras herramientas:

- [ldapdomaindump](https://github.com/dirkjanm/ldapdomaindump)
- [ldapper](https://github.com/shellster/LDAPPER)
- [Módulo de CrackMapExec](https://wiki.porchetta.industries/ldap-protocol/asreproast)

La segunda condición por la cual es posible forzar un AS-REProasting es a través de los [ACL](https://learn.microsoft.com/es-es/windows/win32/secauthz/access-control-lists) (Access Control List). Si tenemos privilegios de WriteProperty, GenericWrite o GenericAll sobre un usuario del dominio, podemos forzar a habilitarle el DONT\_REQ\_PREAUTH.

> Aunque, si tienes GenericAll en un usuario, le puedes cambiar la contraseña xD
> 
> - [Abusing Active Directory ACLs/ACEs](https://www.ired.team/offensive-security-experiments/active-directory-kerberos-abuse/abusing-active-directory-acls-aces)

Para hacer esto, seguiríamos el siguiente proceso:

1. Enumeraríamos los ACL de un grupo al que pertenezcamos para ver si tenemos algún permiso interesante sobre algún objeto, esto lo podemos hacer usando [PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1):
    - `Find-InterestingDomainAcl -ResolveGUIDs | ?{$_.IdentityReferenceName -match "<nombre grupo>"}`
2. Una vez ya sabemos que tenemos alguno de los permisos mencionados sobre un usuario, le habilitaríamos el DONT\_REQ\_PREAUTH con el siguiente comando también de PowerView:
    - `Set-DomainObject -Identity <nombre usuario> -XOR @{useraccountcontrol=4194304} –Verbose`

De esta manera, si volviésemos a enumerar los usuarios con la característica habilitada, nos saldría el usuario que acabamos de forzar y ya sería cuestión de crackear el hash para obtener su contraseña.

Entonces, como conclusión, el AS-REProasting tiene tres vertientes:

- Una es que estemos esnifando la red y logremos pillar paquetes AS-REP. Ya hemos visto herramientas que nos pueden servir para pillar este tipo de peticiones.
- Que un usuario del dominio tenga el atributo DONT\_REQ\_PREAUTH, y, por tanto, podamos generar un AS-REP.
- Que tengamos permisos sobre un usuario del dominio y que nosotros mismos generemos la vulnerabilidad.

En cualquiera de las tres situaciones, una vez tengamos un paquete AS-REP, es hora de crackear, como hemos hecho al principio.

## TGS-REProasting (Kerberoasting)

Por último, el famoso Kerberoasting. Este ataque se origina en el KRB\_TGS\_REP, este paso, también contiene unos datos cifrados que interesan de cara a intentar crackearlos y obtener la contraseña de un usuario del dominio:

![Proceso TGS-REP en Kerberos](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-14.avif)

En este paso, el KDC envía:

- El TGS (aka. Service Ticket (ST)) cifrado con el hash de la contraseña del usuario que corre el servicio
- Una nueva clave de sesión para las comunicaciones

Y todo esto, cifrado con la primera clave de sesión, la recibida en el KRB\_AS\_REP.

Bien, sabiendo esto, debemos saber que cualquier usuario del dominio, puede pedirle al DC un TGS para cualquier servicio, el hecho de que pueda o no acceder ese usuario en cuestión, dependerá del propio servicio y no es trabajo del DC validarlo. El único trabajo del DC, es proporcionar el PAC (información de seguridad relacionada con el usuario) cuando le piden un TGS.

Entonces, de cara a pedir un TGS, lo único que hace falta es especificar el SPN (Service Principal Name). El SPN es la manera de identificar un servicio en un entorno de directorio activo, y se estructura en:

- `<clase de servicio>/<hostname o FQDN de la máquina>`

> En un directorio activo un mismo servicio se puede ejecutar múltiples veces, de la misma forma, una misma máquina, puede ejecutar múltiples servicios. Es por ello, que para concretar a qué servicio nos queremos referir siempre, se debe de seguir la estructura mencionada.

Una "clase de servicio" es un nombre genérico para un servicio. Por ejemplo, todos los servidores web se agrupan bajo la clase de servicio con nombre "www".

- [Lista de SPN en la documentación oficial de Microsoft (no están todos)](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc772815(v=ws.10)#service-principal-names)

En el caso de que un servicio se ejecute en un puerto distinto al original, la siguiente estructura para referirse a él, es válida:

- `<clase de servicio>/<hostname o FQDN de la máquina>:<puerto>`

Como dato, también es posible nombrar con un nombre personalizado a un SPN:

- `<clase de servicio>/<hostname o FQDN de la máquina>:<puerto>/<nombre que queramos asignarle>`

Ejemplo de un SPN siguiendo esta última estructura:

- `cifs/fileserver.deephacking.local:9090/Server_donde_tengo_mis_cositas`

Todo esto no es que deba de saberse para la parte práctica que vamos a llevar a cabo. Sin embargo, si es importante conocer estos detalles para entender mejor como funciona y se estructura un directorio activo. Dicho esto, vamos a volver al Kerberoasting.

Normalmente, un servicio, se ejecutará con una cuenta de máquina. Las cuentas de máquinas poseen por defecto contraseñas aleatorias y fuertes, por lo que si se consiguiese un dato cifrado con esta contraseña e intentásemos su crackeo no sería útil porque no conseguiríamos nada.

El caso es, que puede ocurrir que un servicio, esté siendo ejecutado por una cuenta de un usuario normal del dominio, al ser un usuario normal, puede que su contraseña no sea fuerte, por lo que las posibilidades de crackearla aumentan mucho. Estos casos son los que de verdad interesan y la fuente que da sentido a que exista el Kerberoasting.

Entonces, técnicamente, podemos conseguir un TGS para todos los SPN, pero, solo nos interesan los SPN de servicios que estén siendo ejecutados por cuentas de usuario del dominio, porque sus contraseñas puede que sean débiles.

Bien, ya sabemos toda la parte teórica del kerberoasting, por lo que vayamos a la parte práctica.

Para enumerar desde Linux los SPN que corren en cuentas de usuarios normales, podemos hacer uso de impacket:

- `impacket-GetUserSPNs <fqdn del dominio>/<usuario>:<contraseña> -dc-ip <ip del dc>`

![Enumeración de SPN con impacket-GetUserSPNs](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-15.avif)

En este caso, con el comando de arriba estaremos enumerando los SPN de usuarios normales, pero no estaremos pidiendo los respectivos TGS, para pedirlos tenemos que agregar el argumento `-request`:

- `impacket-GetUserSPNs -request <fqdn del dominio>/<usuario>:<contraseña> -dc-ip <ip del dc>`

![Obtención de TGS con impacket-GetUserSPNs](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-16.avif)

Una vez tenemos el hash para crackear, se lo pasamos por ejemplo a hashcat:

- `.\hashcat.exe -O -m 13100 -a 0 <archivo> <diccionario>`

![Crackeo de hash TGS con hashcat](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-17.avif)

De esta manera, conseguimos la contraseña del usuario.

Y, al igual que con el AS-REProasting, lo mismo se puede hacer desde Windows, abrimos una cmd en el contexto del usuario del dominio como hemos hecho antes y usamos de nuevo rubeus (o cualquier otra herramienta que haga un kerberoasting):

- `Rubeus.exe kerberoast`
    - Otros posibles argumentos a añadir a este comando:
        - `/user:<SPN>` especificar el SPN del cual queremos obtener un TGS (para que no lo haga con todos).
        - `/outfile:<nombre archivo>` especificar archivo donde se guardará la salida del comando.
        - `/format:<formato hash>` Lo que hemos visto en el AS-REP, el formato para su posterior crackeo

![Kerberoasting con Rubeus desde Windows](https://cdn.deephacking.tech/i/posts/asreq-asrep-tgsrep-kerberos/asreq-asrep-tgsrep-kerberos-18.avif)

Otra alternativa a Rubeus para realizar este proceso sería [Invoke-Kerberoast.ps1](https://raw.githubusercontent.com/EmpireProject/Empire/master/data/module_source/credentials/Invoke-Kerberoast.ps1).

Para enumerar las cuentas kerberoasteables desde Windows, podemos hacer uso de alguna de las siguientes herramientas:

- PowerView
    - `Get-DomainUser –SPN`
    - `Get-NetUser | Where-Object {$_.servicePrincipalName} | fl`
- Active Directory Module
    - `Get-ADUser -Filter {ServicePrincipalName -ne "$null"} -Properties ServicePrincipalName`
- Usando un binario nativo de Windows
    - `setspn -T <dominio> -Q */*`

Con este último comando es posible que se deba hacer un filtrado, más información aquí:

- [Setspn](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc731241\(v=ws.11\))

Aparte de todo lo visto, es importante saber que un TGS también se puede obtener dumpeandolo de la memoria, el siguiente artículo de [Netwrix](https://blog.netwrix.com/) explica bastante bien este caso concreto:

- [Extracting Service Account Passwords with Kerberoasting](https://blog.netwrix.com/2022/08/31/extracting-service-account-passwords-with-kerberoasting/)

Además, al igual que ocurre en el AS-REP, si tenemos privilegios de WriteProperty, GenericWrite o GenericAll sobre un usuario del dominio, podemos añadir un SPN a ese usuario para que sea vulnerable a kerberoasting. La siguiente fuente lo explica bastante bien:

- [Targeted Kerberoasting](https://github.com/Hackndo/The-Hacker-Recipes/blob/master/active-directory-domain-services/movement/abusing-aces/targeted-kerberoasting.md)
    - Sobre lo de tener privilegios, recuerda que puede ocurrir que nosotros directamente no tengamos, pero que un grupo al que pertenecemos si los tenga (o un grupo al que pertenezca el grupo al que pertenecemos... xD), por lo que también es importante enumerar las ACLs de los usuarios que tengamos. Recordemos que esto último se puede hacer usando [PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1):
        - `Find-InterestingDomainAcl -ResolveGUIDs | ?{$_.IdentityReferenceName -match "<nombre del grupo>"}`

Para concluir con el kerberoasting, es importante resaltar que si conseguimos crackear alguna cuenta, no solo habremos obtenido otra cuenta del dominio, y, por tanto, tendremos que realizar todas las comprobaciones que se hacen siempre que se consigue una cuenta nueva: ver si es local admin en alguna máquina, que privilegios tiene, etc, etc...

Lo verdaderamente interesante, es que hemos crackeado la cuenta de un usuario propietario de un servicio.

- ¿Qué quiere decir esto?

Puedes mirar un recordatorio al paso KRB\_TGS\_REP en [Humilde intento de explicar Kerberos](https://blog.deephacking.tech/es/posts/como-funciona-el-protocolo-kerberos/#krb_tgs_rep). Pero básicamente, tenemos la contraseña que se usa para cifrar los TGS (Service Ticket (ST)) que se envían siempre para otorgar acceso a un usuario al servicio en cuestión. Por tanto, tenemos la clave necesaria para impersonar a cualquier usuario en ese servicio porque podemos crear Service Tickets (ST/TGS). Esto es básicamente lo que se hace cuando se realiza un [Silver Ticket](https://www.ired.team/offensive-security-experiments/active-directory-kerberos-abuse/kerberos-silver-tickets).

De forma práctica, si por ejemplo, a través de kerberoasting conseguimos crackear la contraseña de un usuario que ejecuta un servidor de correo. Podremos generar TGS para cualquier usuario existente en ese servicio, con el fin de, en este caso concreto, leer sus correos.

> Con el kerberoasting tampoco olvidemos la importancia de hacer sniffing

## Conclusión

Poniendo en conjunto todo lo que hemos visto en este artículo, una posible vía de explotación para aprovecharnos de todo lo visto, sería:

1. Obtener una cuenta del dominio a través de AS-REQ o AS-REP.
2. Enumeración y obtención de tickets de servicio a través de TGS-REP usando la cuenta de dominio conseguida.
3. Si conseguimos crackear algún ST obtenido, podremos acceder al servicio cuya contraseña de usuario que lo ejecuta hemos crackeado, impersonando a los distintos usuarios y accediendo a toda la información disponible.

Por último, recalcar la importancia de hacer sniffing en una red o comprobar los ACL, estas dos cosas pueden determinar que consigamos o no comprometer el dominio ^^.

## Referencias

- [Getting Passwords From Kerberos Pre-Authentication Packets](https://vbscrub.com/2020/02/27/getting-passwords-from-kerberos-pre-authentication-packets/)
- [Service Principal Name (SPN)](https://en.hackndo.com/service-principal-name-spn/)
- _[Spanish You Do (Not) Understand Kerberos](https://www.youtube.com/watch?v=5uhk2PKkDdw)_
- [ASREQRoast - From MITM to hash](https://dumpco.re/blog/asreqroast)
