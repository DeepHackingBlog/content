---
id: "introduccion-a-active-directory"
title: "Introducción a Active Directory"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-09-02
updatedDate: 2024-09-02
image: "https://cdn.deephacking.tech/i/posts/introduccion-a-active-directory/introduccion-a-active-directory-0.webp"
description: "Conoce los conceptos fundamentales de Active Directory, desde su origen hasta su estructura jerárquica con dominios, bosques, políticas de grupo y controladores de dominio."
categories:
  - "active-directory"
draft: false
featured: false
lang: "es"
---

Probablemente has podido escuchar mil veces el término Active Directory o por el contrario que no lo hayas escuchado nunca. En cualquier caso, el fin de este artículo es hacer una introducción a los conceptos mas principales para que cuando acabes de leerlo tengas una idea de lo que se trata y como funciona.

- [Origen y propósito de Active Directory](#origen-y-propósito-de-active-directory)
- [Todo es un objeto](#todo-es-un-objeto)
- [Dominios](#dominios)
- [Árbol (Tree) y bosques (Forests)](#árbol-tree-y-bosques-forests)
    - [Modos funcionales](#modos-funcionales)
- [Unidades Organizativas (OUs)](#unidades-organizativas-ous)
- [Contenedores (Containers)](#contenedores-containers)
- [Políticas de grupo (GPO)](#políticas-de-grupo-gpo)
- [Controladores de dominio (DCs)](#controladores-de-dominio-dcs)
    - [LDAP y Kerberos](#ldap-y-kerberos)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

## Origen y propósito de Active Directory

Active Directory tuvo sus inicios a principios de los años 90, en un contexto donde Microsoft estaba bajo investigación por prácticas monopólicas en el mercado de los sistemas operativos para ordenadores personales. Para diversificar su enfoque y reducir su dependencia de los consumidores finales, Microsoft decidió expandirse hacia el mercado empresarial. Con una fuerte presencia ya establecida gracias a Windows y Office, la compañía buscó crear una solución que facilitara la gestión de datos y recursos en grandes organizaciones. Así nació Active Directory, una herramienta diseñada para integrarse con Windows Server, presentando una estructura jerárquica y escalable.

El primer paso de Active Directory se dio con el lanzamiento de Windows 2000 Server. Antes de esto, la configuración de los usuarios en redes empresariales se almacenaba en una base de datos SAM en el controlador de dominio (servidor central) de la red, utilizando el protocolo Netlogon para la autenticación de usuarios. Sin embargo, la creciente complejidad de las redes empresariales reveló una serie de limitaciones del formato SAM cuando de escalabilidad se refería, esto llevó a una transición hacia Active Directory con Windows 2000, que además introdujo el [protocolo de autenticación Kerberos](https://blog.deephacking.tech/es/posts/como-funciona-el-protocolo-kerberos/).

Active Directory ofrece ventajas significativas respecto a la antigua base de datos SAM, siendo más extensible y permitiendo almacenar datos adicionales en la configuración de usuarios, como por ejemplo el nivel de seguridad, que puede ser utilizado por aplicaciones para gestionar el acceso a recursos. Todos estos datos se almacenan localmente en un controlador de dominio y son accesibles mediante el protocolo LDAP, que funciona sobre TCP/IP en el puerto 389.

En resumen, después de todo este tostón se puede decir que Active Directory ha ido evolucionando hasta convertirse en lo que es hoy en día, una herramienta esencial para casi todas las empresas IT del mundo.

Sabiendo ya qué es Active Directory ahora toca ver algunas de sus características principales para poder entender como funciona y se estructura.

## Todo es un objeto

Si nunca te has topado con la idea de "objeto" puede parecer un poco abstracta al principio, pero básicamente un objeto en Active Directory son entidades que representan un recurso de la red. Un recurso puede ser un usuario, un ordenador, un grupo, una unidad organizativa, una impresora, un recurso compartido... en conclusión, todo.

Pues Active Directory se basa en objetos para funcionar.

Cada objeto está definido por un conjunto de información sobre él, esta información se encuentra en lo que son los atributos del objeto. Por ejemplo, mi usuario robb.stark es un objeto y por tanto, tiene información y atributos asociados a él:

```powershell
PS C:\Users\robb.stark> Get-ADUser -Identity robb.stark

DistinguishedName : CN=robb.stark,CN=Users,DC=north,DC=sevenkingdoms,DC=local
Enabled           : True
GivenName         : Robb
Name              : robb.stark
ObjectClass       : user
ObjectGUID        : 73fde0a4-2653-4296-9a6a-fc1e51b399c3
SamAccountName    : robb.stark
SID               : S-1-5-21-2645935458-595591891-1233751793-1113
Surname           : Stark
UserPrincipalName :

PS C:\Users\robb.stark>
```

En este caso pues por ejemplo vemos que tiene el atributo Name, el atributo Surname y unos cuantos mas. Pues este concepto se aplica a todo lo existente en Active Directory, incluso el propio dominio es un objeto:

```powershell
PS C:\Users\robb.stark> Get-ADDomain

AllowedDNSSuffixes                 : {}
ChildDomains                       : {}
ComputersContainer                 : CN=Computers,DC=north,DC=sevenkingdoms,DC=local
DeletedObjectsContainer            : CN=Deleted Objects,DC=north,DC=sevenkingdoms,DC=local
DistinguishedName                  : DC=north,DC=sevenkingdoms,DC=local
DNSRoot                            : north.sevenkingdoms.local
DomainControllersContainer         : OU=Domain Controllers,DC=north,DC=sevenkingdoms,DC=local
DomainMode                         : Windows2016Domain
DomainSID                          : S-1-5-21-2645935458-595591891-1233751793
ForeignSecurityPrincipalsContainer : CN=ForeignSecurityPrincipals,DC=north,DC=sevenkingdoms,DC=local
Forest                             : sevenkingdoms.local
InfrastructureMaster               : winterfell.north.sevenkingdoms.local
LastLogonReplicationInterval       :
LinkedGroupPolicyObjects           : {cn={DE1A9268-D2BC-4111-B051-9F00ECE62D3A},cn=policies,cn=system,DC=north,DC=seven
                                     kingdoms,DC=local, CN={31B2F340-016D-11D2-945F-00C04FB984F9},CN=Policies,CN=System
                                     ,DC=north,DC=sevenkingdoms,DC=local}
LostAndFoundContainer              : CN=LostAndFound,DC=north,DC=sevenkingdoms,DC=local
ManagedBy                          :
Name                               : north
NetBIOSName                        : NORTH
ObjectClass                        : domainDNS
ObjectGUID                         : b66af891-4581-4188-b6e3-b19d5506939b
ParentDomain                       : sevenkingdoms.local
PDCEmulator                        : winterfell.north.sevenkingdoms.local
PublicKeyRequiredPasswordRolling   : True
QuotasContainer                    : CN=NTDS Quotas,DC=north,DC=sevenkingdoms,DC=local
ReadOnlyReplicaDirectoryServers    : {}
ReplicaDirectoryServers            : {winterfell.north.sevenkingdoms.local}
RIDMaster                          : winterfell.north.sevenkingdoms.local
SubordinateReferences              : {DC=DomainDnsZones,DC=north,DC=sevenkingdoms,DC=local}
SystemsContainer                   : CN=System,DC=north,DC=sevenkingdoms,DC=local
UsersContainer                     : CN=Users,DC=north,DC=sevenkingdoms,DC=local

PS C:\Users\robb.stark>
```

En este caso pues el dominio tiene muchos mas atributos asociados y diferentes a los que posee un objeto usuario.

Algo que tienen todos los objetos en común es que poseen un GUID (Global Unique Identifier). Un GUID es un identificador único y globalmente reconocible que asegura que cada objeto pueda ser identificado de manera unívoca dentro de la estructura de Active Directory, independientemente de su ubicación o tipo.

Además del GUID, todos los objetos también comparten otros atributos fundamentales, como el Distinguished Name (DN) y el Security Identifier (SID). El DN proporciona una ruta jerárquica que muestra la ubicación exacta del objeto dentro del árbol de Active Directory, incluyendo el dominio y las unidades organizativas a las que pertenece. El SID, por su parte, es un identificador único que se utiliza principalmente para la seguridad y control de acceso, permitiendo a Active Directory y otros sistemas de seguridad asociar permisos y derechos específicos con cada objeto.

Por ejemplo, el DN y el SID de mi usuario robb.stark del dominio hijo north del dominio sevenkingdoms.local serían el siguiente:

```powershell
PS C:\Users\robb.stark> Get-ADUser -Identity robb.stark

DistinguishedName : CN=robb.stark,CN=Users,DC=north,DC=sevenkingdoms,DC=local
Enabled           : True
GivenName         : Robb
Name              : robb.stark
ObjectClass       : user
ObjectGUID        : 73fde0a4-2653-4296-9a6a-fc1e51b399c3
SamAccountName    : robb.stark
SID               : S-1-5-21-2645935458-595591891-1233751793-1113
Surname           : Stark
UserPrincipalName :

PS C:\Users\robb.stark>
```

## Dominios

Dentro del concepto de Active Directory, un dominio es una serie de ordenadores conectados que comparten una base de datos de Active Directory la cual es gestionada por lo que se conoce como controlador de dominio (DC), que es básicamente el servidor central desde donde se gestiona toda la configuración. Y por si te lo preguntas:

- Si, dentro de un entorno de Active Directory pueden haber varios controladores de dominio.
- Si, dentro de Active Directory pueden haber varios dominios.

Por tanto, esto quiere decir que pueden haber varios dominios los cuales posean varios controladores de dominio cada uno.

Un ejemplo de como se vería un Active Directory sería el siguiente:

![Diagrama de estructura de Active Directory con dominios y subdominios](https://cdn.deephacking.tech/i/posts/introduccion-a-active-directory/introduccion-a-active-directory-1.avif)

Puede que ahora mismo quizás te parezca un poco complejo entender este diagrama, pero la idea es que al acabar este artículo puedas entenderlo, al menos lo principal.

Cada dominio posee un nombre de DNS, lo normal es que este nombre sea el mismo que el nombre de la empresa, por ejemplo, si Deep Hacking fuese una multinacional que facturase 999.999.999 millones probablemente tendría un dominio interno que fuese deephacking.local. Como no es el caso usaremos el dominio del proyecto de [GOAD](https://github.com/Orange-Cyberdefense/GOAD):

```powershell
PS C:\> $env:USERDNSDOMAIN
SEVENKINGDOMS.LOCAL
PS C:\>
```

Si ejecutamos el comando de arriba en un ordenador unido a un dominio nos dará el nombre del dominio al que está unido, en este caso sevenkingdoms.local.

Además del nombre de DNS, cada dominio también puede ser identificado con el nombre de NetBIOS, por ejemplo, el nombre de DNS sevenkingdoms.local tendría un nombre de NetBIOS sevenkingdoms. Por otro lado, el dominio hijo north.sevenkingdoms.local tendría un nombre de NetBIOS north.

El nombre de NetBIOS se suele usar mucho cuando se inicia sesión, por ejemplo, sevenkingdoms\\sikumy, donde sevenkingdoms es el nombre de NetBIOS del dominio y sikumy el usuario.

Por último, un dominio puede identificarse mediante un SID (Security Identifiers). Como hemos mencionado previamente, los SID son identificadores únicos que usa Windows para identificar de manera única usuarios, grupos u otros objetos en un dominio u ordenador. Aunque de normal no es necesario conocerlo a nivel usuario, puede que cuando estemos trasteando con alguna herramienta haga falta saber como obtener el SID del dominio. Así que por ahora simplemente quédate con su existencia:

```powershell
PS C:\> Get-ADDomain | select DNSRoot,NetBIOSName,DomainSID

DNSRoot             NetBIOSName   DomainSID
------- ----------- ---------
sevenkingdoms.local SEVENKINGDOMS S-1-5-21-2643224878-1147328777-3138214671

PS C:\>
```

## Árbol (Tree) y bosques (Forests)

En la imagen anterior de la sección de dominios ya hemos podido observar que un dominio puede tener subdominios. Por ejemplo, sevenkingdoms.local sería el dominio raiz y north.sevenkingdoms.local sería un subdominio. En un entorno real, esta diferencia puede servir por ejemplo para separar departamentos dentro de la empresa o sedes.

```
                                          deephacking.local
                                                |
                                        .-------'--------.
                                        |                |
                                        |                |
                               it.deephacking.local marketing.deephacking.local
                                        | 
                                        |
                                        |
                          desarrollo.it.deephacking.local
```

Todos estos dominios en su conjunto forman lo que se llama un árbol. Por lógica, podemos intuir que un bosque son un conjunto de árboles, es decir, si la imagen de arriba es un árbol, un bosque podría ser por ejemplo lo siguiente:

```powershell
         deephacking.local ------------------------------ sevenkingdoms.local ----------- essos.local
                 |                                                 |
                 |----------------.                                |
                 |                |                                |
                 |                |                                |                
it.deephacking.local  marketing.deephacking.local       north.sevenkingdoms.local
                 | 
                 |
                 |
   desarrollo.it.deephacking.local
```

Si en el controlador de dominio de sevenkingdoms.local ejecutamos el siguiente comando:

```powershell
PS C:\> Get-ADForest

ApplicationPartitions : {DC=DomainDnsZones,DC=sevenkingdoms,DC=local,
                        DC=DomainDnsZones,DC=north,DC=sevenkingdoms,DC=local,
                        DC=ForestDnsZones,DC=sevenkingdoms,DC=local}
CrossForestReferences : {}
DomainNamingMaster    : kingslanding.sevenkingdoms.local
Domains               : {north.sevenkingdoms.local, sevenkingdoms.local}
ForestMode            : Windows2016Forest
GlobalCatalogs        : {kingslanding.sevenkingdoms.local, winterfell.north.sevenkingdoms.local}
Name                  : sevenkingdoms.local
PartitionsContainer   : CN=Partitions,CN=Configuration,DC=sevenkingdoms,DC=local
RootDomain            : sevenkingdoms.local
SchemaMaster          : kingslanding.sevenkingdoms.local
Sites                 : {Default-First-Site-Name}
SPNSuffixes           : {}
UPNSuffixes           : {}

PS C:\>
```

Podemos obtener en este caso información del árbol. Aunque el cmdlet de PowerShell tenga como nombre Forest, realmente no te proporcionará información de otros árboles, si lo ejecutas en sevenkingdoms.local únicamente te dará información de sevenkingdoms.local, no te mencionará en ningún momento essos.local.

> En cualquier caso, casi nunca se utiliza el concepto de árbol porque se tiende a simplificar y hablar de dominios y bosques.

Como mencioné al principio, cada dominio tiene su propia base de datos y sus propios controladores de dominio. Sin embargo, los usuarios de un dominio perteneciente a un árbol, por defecto, pueden acceder a los recursos de otros dominios dentro del mismo árbol. Esto implica que, aunque cada dominio pueda operar de manera autónoma, desde el punto de vista de la seguridad, no están completamente aislados.

Ahora bien, ocurre distinto entre bosques (distintos árboles), es decir, en una misma red puede haber árboles diferentes con dominios raíces diferentes, entre estos árboles puede existir una relación de confianza (lo veremos en otro artículo) que haga que en conjunto sean un bosque. Lo importante es que nos quedemos que cuando se trata de bosques, de manera por defecto, los usuarios de un árbol NO pueden acceder a recursos de otros árboles.

En conclusión, los dominios dentro de un mismo árbol no tienen un aislamiento total en términos de seguridad, ya que los usuarios pueden acceder a recursos en otros dominios del mismo árbol. Sin embargo, este aislamiento sí existe entre diferentes árboles (bosque), proporcionando una capa adicional de seguridad entre ellos.

Sea lo que sea, hablaremos de las confianzas en mas detalle en el próximo artículo.

### Modos funcionales

Como simple detalle a saber, los dominios/bosques pueden poseer diferentes "versiones". Cada versión con características nuevas. ¿Y esto para qué?

Por razones de compatibilidad, en una red podemos tener, por ejemplo, un Windows Server 2022 junto con un Windows Server 2016. Obviamente, Windows Server 2016 no podrá operar al mismo nivel funcional que Windows Server 2022, ya que la versión más nueva incluye características adicionales y mejoras. Sin embargo, Windows Server 2022 puede operar al nivel funcional de Windows Server 2016.

Por lo tanto, cuando tenemos controladores de dominio con versiones diferentes en una misma red, lo más relevante a nivel de dominio es el "modo funcional que se esté usando". Este modo funcional define las capacidades y características disponibles (por ejemplo, el grupo Protected Users solo está disponible a partir de WIN2012R2), y es importante para asegurar que todos los controladores de dominio puedan interactuar correctamente. Podéis ver la lista de versiones disponibles en la documentación de Microsoft:

- [6.1.4.4 msDS-Behavior-Version: Forest Functional Level](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/564dc969-6db3-49b3-891a-f2f8d0a68a7f)

Entonces si por ejemplo, te encuentras con un dominio que a nivel funcional opera en el modo Windows Server 2016, sabes de sobra que como mínimo, todos los controladores de dominio existentes en la red son Windows Server 2016.

## Unidades Organizativas (OUs)

Ya conocemos la estructura principal de un directorio activo, sabemos por un lado que existen los dominios, los cuales pueden formar parte de un árbol y que a su vez en conjunto pueden llegar a formar un bosque. Ahora bien, volviendo al nivel de los dominios incluso dentro de ellos necesitamos alguna característica para organizar todos los usuarios, grupos e información que tenemos, para ello existe lo que se conoce como Unidades Organizativas (OUs).

Las unidades organizativas son objetos contenedores que ayudan a organizar y gestionar la información del AD (Active Directory).

> Podemos pensar en las unidades organizativas como carpetas virtuales. Y sí, dentro de una OU puede haber otra OU, lo dicho, piénsalo como si fueran carpetas.

Al final esto es muy útil ya que nos permite aplicar políticas, restricciones o accesos a un conjunto de objetos específicos de manera rápida y sencilla. Por ejemplo, aplicamos una política a una OU y directamente esta política se verá aplicada a todos los objetos de esa OU (usuarios, grupos...).

Entonces, básicamente las OU facilitan dentro de un dominio, la gestión, la delegación y la seguridad.

## Contenedores (Containers)

Un concepto muy similar a las unidades organizativas son los contenedores. Los contenedores también actúan como carpetas virtuales que agrupan distintos tipos de objetos. Por ahora lo mismo que hemos dicho de las unidades organizativas.

Sin embargo existen algunas distinciones que hacen que se diferencien:

- **Tipo de Objeto**: A diferencia de las Unidades Organizativas, los contenedores no son objetos administrativos y no se pueden utilizar para delegar permisos de administración de manera específica y detallada. Los contenedores son más simples y generalmente se utilizan para organizar objetos de una manera básica dentro de la estructura de Active Directory.

- **Propósito Principal**: Los contenedores se utilizan a menudo para agrupar objetos que no requieren políticas de grupo específicas ni una gestión administrativa detallada. Por ejemplo, el contenedor predeterminado "Users" se utiliza para almacenar cuentas de usuario y de grupo que no se han movido a OUs específicas.

- **Herencia de Políticas**: A diferencia de las OUs, los contenedores no heredan ni aplican directivas de grupo (GPOs). Esto significa que no se pueden usar para aplicar políticas de seguridad o configuraciones de manera específica. Los objetos dentro de un contenedor no están sujetos a las mismas reglas de seguridad y políticas que los objetos dentro de una OU.

- **Limitaciones**: Dado que los contenedores no son tan flexibles como las OUs para la administración de políticas y permisos, es común que los administradores de Active Directory utilicen OUs para una organización más estructurada y una administración de seguridad más detallada. Los contenedores se usan principalmente para almacenamiento predeterminado y agrupación básica.

Algunos ejemplos básicos de contenedores serían:

- **Users**: Contenedor predeterminado para almacenar cuentas de usuario y de grupo.
- **Computers**: Contenedor predeterminado para almacenar cuentas de computadora.
- **ForeignSecurityPrincipals**: Utilizado para almacenar referencias a objetos de seguridad de dominios externos.
- **Builtin**: Contiene grupos de seguridad integrados y roles administrativos predeterminados.

En la siguiente imagen podemos ver contenedores por defectos:

![Captura de pantalla mostrando contenedores predeterminados en Active Directory](https://cdn.deephacking.tech/i/posts/introduccion-a-active-directory/introduccion-a-active-directory-2.avif)

En resumen, aunque los contenedores no ofrecen las mismas capacidades de gestión y seguridad que las OUs, siguen siendo una parte importante de la estructura de Active Directory. Proporcionan un lugar predeterminado para objetos nuevos y permiten una organización básica. En entornos pequeños o menos complejos, los contenedores pueden ser suficientes para organizar los objetos del directorio. Además, el propio DC los utiliza durante la instalación por defecto, como podemos observar en la imagen de arriba.

Sin embargo, para una administración más eficiente y segura, se recomienda mover los objetos desde los contenedores predeterminados a OUs adecuadamente organizadas. Esto permite una mayor flexibilidad en la aplicación de políticas de grupo, la delegación de permisos administrativos y el control de acceso basado en roles.

Entonces básicamente los contenedores son elementos básicos y esenciales de Active Directory que ayudan en la organización y el almacenamiento de objetos. Aunque su funcionalidad es más limitada en comparación con las OUs, desempeñan un papel crucial en la estructura inicial y predeterminada de un entorno de Active Directory.

## Políticas de grupo (GPO)

Otro concepto importante dentro de AD son las GPO. Las GPO son una colección de políticas (configuraciones y reglas) que ayudan a controlar el Active Directory al facilitar la definición de estas configuraciones y su aplicación de manera uniforme.

Las GPO pueden aplicarse en distintos niveles de la jerarquía de directorio activo, es decir, las GPO pueden ser aplicadas tanto a nivel de dominio como a nivel de unidad organizativa y a nivel de usuario o grupo.

Un ejemplo de GPO podría ser una configuración específica diseñada para automatizar la instalación de software en todos los ordenadores de una unidad organizativa (OU) o dominio. Esto permite a los administradores de IT desplegar aplicaciones necesarias para los usuarios sin tener que hacer la instalación manualmente en cada máquina.

Las GPO pueden ser heredadas, si una GPO aplica a un dominio, puede afectar a todos los objetos de ese dominio.

En resumen, las GPO son objetos que almacenan una serie de configuraciones y que facilitan su aplicación a otros objetos del Active Directory.

## Controladores de dominio (DCs)

A lo largo del artículo se ha mencionado varias veces a los controladores de dominio, y creo que se ha dejado más o menos claro que son los servidores centrales desde los cuales se administra y gestiona el Active Directory (además de almacenar toda su información). Sin embargo, los controladores de dominio no solo cumplen con estas funciones. También son responsables de proporcionar servicios de autenticación y autorización, es decir, cada vez que un usuario inicia sesión o solicita acceso a un recurso, son los DCs los encargados de validar las credenciales y decidir si se concede o se niega el acceso.

Además, los controladores de dominio también se encargan de la replicación de los datos en la red. Cualquier cambio realizado en la información del directorio, como puede ser por ejemplo la creación o modificación de cuentas de usuario, se propaga automáticamente a todos los DCs dentro del dominio o bosque para que de esta manera toda la información esté siempre actualizada y sea consistente en toda la organización. El intervalo por defecto de la replicación es de 3 horas.

En conclusión, los controladores de dominio son el núcleo principal de AD, al encargarse del almacenamiento de la información y de servicios críticos como son la autenticación, autorización y gestión de políticas de grupo.

### LDAP y Kerberos

Los dos protocolos mas fundamentales de Active Directory son LDAP y Kerberos.

Por un lado, **LDAP (Lightweight Directory Access Protocol)** es el protocolo que se encarga de acceder y administrar la información almacenada en el directorio. Por ejemplo, si necesito obtener cualquier tipo de información de un usuario, como su nombre o dirección de correo electrónico, o si deseo modificar datos como sus privilegios de acceso, lo haré a través de LDAP.

LDAP se ejecuta típicamente en el puerto 389 de los controladores de dominio. Además, existe una versión segura, conocida como **LDAPS**, que cifra las comunicaciones para proteger la información sensible, esta versión se ejecuta en el puerto 636.

Por otro lado, **Kerberos** es el protocolo de autenticación predeterminado utilizado en los entornos de Active Directory. Este protocolo opera mediante un sistema de "tickets", que funciona de la siguiente manera: cuando un usuario intenta acceder a un recurso en la red, envía una solicitud al servicio de autenticación Kerberos, que le proporciona un ticket de autenticación. Este ticket puede ser presentado a otros servicios y recursos del dominio para verificar la identidad del usuario sin necesidad de enviar continuamente las credenciales.

Sobre Kerberos ya hay un artículo en el blog donde explicamos como funciona:

- [Humilde intento de explicar Kerberos](https://blog.deephacking.tech/es/posts/como-funciona-el-protocolo-kerberos/)

Entonces básicamente lo importante y con lo que nos tenemos que quedar de esta sección es la existencia e importancia de los protocolos de LDAP y Kerberos en los entornos de AD.

## Conclusión

Hemos visto el funcionamiento y principales componentes de Active Directory. Quizás ahora aunque hayas podido entender todo o la gran mayoría de las ideas sigues sin ser capaz de visualizar un AD. En ese caso no pasa nada, es algo que irás aprendiendo conforme veas mas ejemplos y mas conceptos. Mi idea es realizar una serie de artículos que partan desde cero, como este para poco a poco ir a conceptos mas avanzados y que simplemente leyendo los artículos de este blog podáis obtener un buen nivel de AD.

## Referencias

- [Attacking Active Directory: 0 to 0.9 - Eloy Pérez González](https://zer1t0.gitlab.io/posts/attacking_ad/)

- [The Purpose of Active Directory - JumpCloud](https://jumpcloud.com/blog/active-directory-purpose)

- [Active Directory objects: All you need to know](https://www.windows-active-directory.com/active-directory-objects-2.html)

- [Organizational Unit (OU)](https://www.manageengine.com/products/active-directory-audit/kb/what-is/ou-in-active-directory.html)
