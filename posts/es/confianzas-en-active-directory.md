---
id: "confianzas-en-active-directory"
title: "Confianzas en Active Directory (Trusts)"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-09-10
updatedDate: 2024-09-10
image: "https://cdn.deephacking.tech/i/posts/confianzas-en-active-directory/confianzas-en-active-directory-0.webp"
description: "Guía completa sobre las confianzas en Active Directory: tipos de trust, dirección, transitividad, Trust Domain Objects (TDO) y cómo enumerar relaciones de confianza con PowerView."
categories:
  - "active-directory"
draft: false
featured: false
lang: "es"
---

En el anterior artículo donde hacíamos una introducción a Active Directory, mencionábamos mínimamente las confianzas o la posibilidad de establecerlas para la conexión entre distintos dominios o árboles. Esto permite, por ejemplo, que los usuarios de un dominio o árbol puedan acceder a los recursos de otros dominios o árboles. Básicamente, podríamos definir una confianza como un tipo de conexión de autenticación/autorización.

Estas relaciones de confianza se representan en Active Directory mediante **Trusted Domain Objects (TDOs)**, que son objetos especiales que almacenan información sobre la relación de confianza establecida entre dominios. Los TDOs contienen detalles sobre el tipo de confianza, el nivel de autenticación permitido, y otros parámetros de seguridad que regulan cómo los dominios se autentican entre sí y acceden a recursos compartidos.

Dicho esto, vamos a ver cómo funciona esta característica en Active Directory.

- [Dirección de la confianza (trust direction)](#dirección-de-la-confianza-trust-direction)
- [Transitividad de la confianza (trust transitivity)](#transitividad-de-la-confianza-trust-transitivity)
- [Tipos de confianzas (trust types)](#tipos-de-confianzas-trust-types)
- [Clave de confianza (trust key)](#clave-de-confianza-trust-key)
- [Atributo trustAttributes de los Trust Domain Object (TDO)](#atributo-trustattributes-de-los-trust-domain-object-tdo)
- [Enumeración de confianzas](#enumeración-de-confianzas)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

## Dirección de la confianza (trust direction)

Cuando se crea una confianza entre dos dominios siempre existe la parte que confía (trusting side) y la parte que es de confianza (trusted side). Por ejemplo, si creo una confianza del dominio sevenkingdoms.local al dominio essos.local, sevenkingdoms.local sería en este caso el trusting side, y essos.local el trusted side, porque es sevenkingdoms quien está confiando en essos.

Si es sevenkingdoms quien confía en essos, tiene sentido pensar que los usuarios de essos serán lo que podrán acceder a los recursos de sevenkingdoms y no al revés. Por tanto podemos definir lo siguiente:

> La dirección de confianza es la contraria a la dirección de acceso.

![Diagrama de dirección de confianza en Active Directory](https://cdn.deephacking.tech/i/posts/confianzas-en-active-directory/confianzas-en-active-directory-1.avif)

Cuando una confianza apunta a tu dominio actual se dice que es una confianza entrante (incoming/inbound). Según hemos visto, las confianzas entrantes permiten a los usuarios de tu dominio acceder a otro dominio.

Por otro lado, están las confianzas salientes (outgoing/outbound) que desde tu dominio, apuntan a otro. En este caso ocurre al contrario, los usuarios del otro dominio podrán acceder a tu dominio.

Ahora bien, no se restringe en ningún momento que puedan haber estos dos tipos de confianzas al mismo tiempo. Cuando entre dos dominios existen para cada uno una confianza tanto entrante como saliente se denomina confianza bidireccional (aunque realmente haya 2 confianzas), en caso contrario, unidireccional.

## Transitividad de la confianza (trust transitivity)

Existen otros detalles cuando hablamos de las confianzas y esa es la transitividad. La imagen de la sección anterior es sencilla, dos dominios con una confianza existente entre ellos. Ahora bien, vamos a agregar otra variable:

![Diagrama de transitividad de confianzas entre dominios](https://cdn.deephacking.tech/i/posts/confianzas-en-active-directory/confianzas-en-active-directory-2.avif)

¿Qué ocurre cuando hay un mínimo de 3 dominios? ¿El dominio de sevenkingdoms.local puede acceder de alguna manera a deephacking.local o viceversa si tienen en común un dominio de confianza como es en este caso essos.local?

Pues eso va a depender de la transitividad. Una confianza puede ser o no transitiva.

- Una confianza NO transitiva solo podrá ser usada por los dos lados de la confianza implicados. Un tercer dominio que posea una confianza con uno de los dos lados no podrá hacer uso de esta confianza.

- Sin embargo, una confianza transitiva puede actuar como puente y ser usada por otros dominios que estén conectados con la confianza transitiva.

Por ejemplo, en este caso, sevenkingdoms confia en essos.local, por tanto los usuarios de essos.local pueden acceder a sevenkingdoms.local.

Si la confianza de sevenkingdoms a essos es transitiva, entonces los usuarios de deephacking.local pueden acceder a sevenkingdoms atravesando las dos confianzas, la que acabamos de mencionar y la confianza ya existente entre essos.local y deephacking.local.

Si por el contrario, la confianza de sevenkingdoms a essos NO es transitiva, los usuarios de deephacking.local no podrán acceder a sevenkingdoms.

## Tipos de confianzas (trust types)

Dentro de las confianzas existen distintos tipos con distintos objetivos:

- **Parent-Child**: Es una confianza transitiva y bidireccional que se crea automáticamente entre un dominio padre y su dominio hijo al establecer una nueva estructura de dominio en un árbol. Estas confianzas solo pueden existir entre dos dominios dentro del mismo árbol con el mismo espacio de nombres contiguo. No se pueden crear manualmente, y el dominio padre siempre es confiado por el dominio hijo.

- **Tree/Root Trust**: Es una confianza transitiva y bidireccional que se establece automáticamente cuando se añade un nuevo árbol al bosque de Active Directory. Esta confianza se crea entre el dominio raíz del bosque y el dominio raíz del nuevo árbol, permitiendo la autenticación y el acceso a recursos entre dominios de árboles diferentes dentro del mismo bosque. No se pueden crear manualmente, y son fundamentales para mantener la estructura jerárquica y la interoperabilidad dentro del bosque.

- **Forest**: Permiten compartir recursos entre árboles en diferentes bosques. Estas confianzas pueden ser unidireccionales transitivas o bidireccionales transitivas, y permiten la autenticación entre bosques utilizando Kerberos v5 y NTLM, con la posibilidad de utilizar el Nombre Principal Universal (UPN) para acceder a recursos (UPN es un estándar existente en internet para las cuentas de usuario).

- **External**: Son confianzas unidireccionales y no transitivas que se crean manualmente para conectar un dominio específico con otro dominio fuera del bosque de Active Directory, como un dominio de Windows NT 4.0. Son útiles cuando no se desea extender la confianza a todo el bosque.

- **Realm**: Permiten la interoperabilidad entre un dominio de Active Directory y un dominio no perteneciente a Windows, como un dominio Kerberos en entornos Unix/Linux. Estas confianzas pueden ser transitivas o no transitivas y son esenciales para la interoperabilidad entre diferentes sistemas operativos.

- **Shortcut**: Se utilizan para optimizar el proceso de autenticación acortando el camino de confianza necesario entre dominios que no tienen una relación de confianza directa. Estas confianzas transitivas se crean manualmente y solo pueden existir dentro de un mismo bosque.

![Diagrama de tipos de confianzas en Active Directory](https://cdn.deephacking.tech/i/posts/confianzas-en-active-directory/confianzas-en-active-directory-3.avif)

En la imagen podemos observar un ejemplo gráfico de como podrían verse los diferentes tipos de confianza en un entorno de AD. Las líneas negras corresponden a las confianzas que se crean de manera automática y las rojas las que se crean de forma manual.

Todo los tipos de confianza vistos y algunas de sus características se puede resumir en la siguiente tabla:

| Tipo | Transitiva | Dirección | Creación |
| --- | --- | --- | --- |
| Parent-Child | SI | Bidireccional | Automática |
| Tree/Root | SI | Bidireccional | Automática |
| Forest | SI | Unidireccional o bidireccional | Manual |
| External | NO | Unidireccional o bidireccional | Manual |
| Realm | SI o NO | Unidireccional o bidireccional | Manual |
| Shortcut | SI | Unidireccional o bidireccional | Manual |

## Clave de confianza (trust key)

Cuando se establece una relación de confianza, debe haber comunicación segura entre los controladores de dominio de ambos dominios involucrados en la confianza (o, en el caso de relaciones transitivas, con un controlador de dominio intermedio).

La naturaleza de esta comunicación puede variar dependiendo del protocolo utilizado, como NTLM, Kerberos, etc. Sin embargo, independientemente del protocolo, los controladores de dominio deben compartir una clave común para asegurar que las comunicaciones sean seguras. Esta clave es conocida como **clave de confianza** y se genera al mismo tiempo que se establece la confianza.

Al crear la confianza, se crea una **cuenta de confianza (Trust Account)** en la base de datos del dominio, la cual es tratada como si fuese una cuenta de usuario. La única diferencia es que su nombre termina con un símbolo "$". Durante la creación de esta cuenta, la clave de confianza se almacena en el campo de contraseña de este usuario recién creado, por lo que se puede considerar que la "contraseña" o el hash de esta cuenta es en realidad la clave de confianza.

El nombre de esta cuenta de usuario se forma utilizando el nombre de NetBIOS del otro dominio, seguido de un signo de dólar. Por ejemplo, en una confianza bidireccional entre los dominios sevenkingdoms.local y essos.local, con nombres de NetBIOS "sevenkingdoms" y "essos" respectivamente, el dominio sevenkingdoms.local creará una cuenta de usuario llamada "ESSOS$", y el dominio essos.local creará una cuenta llamada "SEVENKINGDOMS$".

Las contraseñas o hashes de estas cuentas corresponden a las respectivas claves de confianza, que se utilizan para autenticar y autorizar de forma segura las comunicaciones entre los dominios.

En resumen, cuando se crea una confianza en Active Directory, se generan dos objetos importantes: una **cuenta de confianza (Trust Account)** y un **Trust Domain Object (TDO)** (hicimos mención del TDO en el inicio del artículo). La cuenta de confianza se crea solo en el dominio que confía en el otro, mientras que el TDO se genera en ambos dominios, independientemente de si la confianza es unidireccional o bidireccional. Esto asegura que ambos dominios tengan la información necesaria para gestionar la relación de confianza y mantener la seguridad de las comunicaciones.

## Atributo trustAttributes de los Trust Domain Object (TDO)

Los objetos que representan a las confianzas ya sabemos que son los llamados TDO. Estos objetos, como cualquier otro en directorio activo poseen una serie de atributos asociados. En este caso me gustaría ver concretamente el atributo trustAttributes y sus posibles valores.

El atributo trustAttributes básicamente define ciertas propiedades y comportamientos de la relación de confianza, como la transitividad, restricciones de acceso, y compatibilidad con sistemas operativos específicos. Estos valores permiten a los administradores configurar y gestionar las confianzas de manera precisa.

Es posible que al leer sobre algunos de estos conceptos no te resulten familiares, y eso está bien. Lo importante es que conozcas la existencia de estos valores, para que, en caso de encontrarte con ellos, puedas entender mejor el entorno y saber cómo actuar.

##### TRUST\_ATTRIBUTE\_NON\_TRANSITIVE (TANT - 0x00000001)

Este atributo indica que la confianza no es transitiva, lo que significa que no se extiende más allá de los dos dominios directamente involucrados. Esto es común en confianzas de tipo External y Realm, donde se desea limitar la confianza a una conexión específica sin permitir que otras conexiones confíen implícitamente a través de esta.

##### TRUST\_ATTRIBUTE\_UPLEVEL\_ONLY (TAUO - 0x00000002)

Especifica que solo los clientes que ejecutan Windows 2000 o versiones posteriores pueden utilizar la confianza. Esto asegura que solo los sistemas operativos más modernos, que cumplen con ciertos estándares de seguridad, puedan beneficiarse de esta relación de confianza.

##### TRUST\_ATTRIBUTE\_QUARANTINED\_DOMAIN (TAQD - 0x00000004)

Indica que el dominio confiado está en cuarentena, lo que implica que se aplican reglas de filtrado de SID (Security Identifier) más estrictas. Este atributo es crucial para proteger recursos internos al limitar el acceso desde dominios considerados menos seguros.

##### TRUST\_ATTRIBUTE\_FOREST\_TRANSITIVE (TAFT - 0x00000008)

Este atributo es fundamental para las confianzas de tipo Forest, indicando que la confianza es transitiva y abarca todos los dominios dentro de los bosques involucrados. Permite una autenticación fluida y el acceso a recursos a través de múltiples dominios en distintos árboles del bosque.

##### TRUST\_ATTRIBUTE\_CROSS\_ORGANIZATION (TACO - 0x00000010)

Indica que la confianza es con un dominio o bosque externo a la organización, facilitando la colaboración y el acceso controlado entre diferentes entidades. Este atributo es especialmente relevante en entornos corporativos.

##### TRUST\_ATTRIBUTE\_WITHIN\_FOREST (TAWF - 0x00000020)

Se utiliza para señalar que el dominio confiado está dentro del mismo bosque, lo que generalmente conlleva una mayor confianza y menos restricciones comparado con confianzas con dominios externos.

##### TRUST\_ATTRIBUTE\_TREAT\_AS\_EXTERNAL (TATE - 0x00000040)

Este atributo señala que una confianza de tipo _cross-forest_ (entre bosques) debe ser manejada como si fuera una confianza externa, específicamente en lo que respecta al filtrado de SID (Security Identifier). Esto implica que se aplican medidas de seguridad adicionales y más estrictas para controlar y limitar el acceso a recursos, asegurando que solo usuarios y grupos autorizados puedan acceder a los recursos del bosque de confianza. Es una forma de aumentar la seguridad al tratar estas confianzas de la misma manera que una confianza con dominios externos al bosque de la organización.

##### TRUST\_ATTRIBUTE\_USES\_RC4\_ENCRYPTION (TARC - 0x00000080)

Este atributo se utiliza en confianzas de tipo Realm, indicando que la relación puede utilizar cifrado RC4. Es relevante para la interoperabilidad con implementaciones de Kerberos que soportan este tipo de cifrado, asegurando una compatibilidad adecuada entre diferentes sistemas operativos o versiones de Kerberos.

##### TRUST\_ATTRIBUTE\_CROSS\_ORGANIZATION\_NO\_TGT\_DELEGATION (TANC - 0x00000200)

Este atributo asegura que los tickets de confianza generados bajo esta relación no se puedan utilizar para delegación, lo que limita el uso de estos tickets en otras partes de la red.

##### TRUST\_ATTRIBUTE\_CROSS\_ORGANIZATION\_ENABLE\_TGT\_DELEGATION (TAEC - 0x00000800)

Permite que los tickets emitidos bajo esta relación de confianza sean utilizados para delegación, lo cual es necesario para ciertas operaciones que requieren autenticación delegada.

##### TRUST\_ATTRIBUTE\_PIM\_TRUST (TAPT - 0x00000400)

Asociado con la gestión de identidades privilegiadas (Privileged Identity Management), este atributo asegura que las confianzas sean tratadas con filtros de SID más estrictos, proporcionando una capa adicional de seguridad.

##### TRUST\_ATTRIBUTE\_DISABLE\_AUTH\_TARGET\_VALIDATION (TDAV - 0x00001000)

Desactiva la validación del nombre de dominio durante la autenticación de paso NTLM, lo que puede ser relevante en configuraciones de seguridad específicas.

* * *

Si te interesa echar un vistazo a otros posibles atributos asociados a los TDO puedes echar un vistazo a la documentación de Microsoft:

- _[Atributos esenciales de un Trusted Domain Object en MS-ADTS](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/c9efe39c-f5f9-43e9-9479-941c20d0e590)_

## Enumeración de confianzas

Suponiendo que me haya explicado bien hasta este punto, ya tenemos que tener una idea de como funcionan las confianzas en Active Directory, ahora simplemente me gustaría mostrar un poco algunas maneras de enumerarlo, tanto desde Windows como desde Linux. El entorno en el que vamos a enumerar es el de _[GOAD](https://github.com/Orange-Cyberdefense/GOAD)_:

![Diagrama del entorno GOAD para enumeración de confianzas](https://cdn.deephacking.tech/i/posts/confianzas-en-active-directory/confianzas-en-active-directory-4.avif)

Vamos a ver como se enumerarían las confianzas.

- _[PowerView.ps1 (PowerSploit)](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1)_

Dentro de PowerView tenemos un par de funciones interesantes para enumerar las confianzas, Get-DomainTrust y Get-DomainTrustMapping. La diferencia entre ambas funciones es la siguiente:

- **Get-DomainTrust** proporciona las relaciones de confianza desde el punto de vista de un dominio específico, que por defecto es el dominio actual si no se especifica otro. Este cmdlet muestra únicamente las confianzas donde el dominio especificado es el dominio de origen, sin incluir cómo otros dominios perciben o confían en él. Como resultado, solo se presenta una perspectiva unidireccional de las relaciones de confianza desde el dominio especificado hacia otros dominios.

- **Get-DomainTrustMapping**, por otro lado, es mucho más completo. No solo muestra la perspectiva del dominio especificado, sino también la de los otros dominios involucrados en la relación de confianza. Además, presenta las relaciones de confianza desde el punto de vista de todos los dominios implicados, lo que permite ver tanto los dominios que confían como aquellos en los que confía el dominio especificado.

Si ejecutamos Get-DomainTrust en un equipo del dominio sevenkingdoms.local, obtenemos lo siguiente:

```powershell
PS C:\Windows\system32> Get-DomainTrust

SourceName      : sevenkingdoms.local
TargetName      : north.sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:48:45 PM
WhenChanged     : 7/11/2024 3:37:42 PM

SourceName      : sevenkingdoms.local
TargetName      : essos.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : TREAT_AS_EXTERNAL,FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:58:48 PM
WhenChanged     : 7/21/2024 10:50:58 AM

PS C:\Windows\system32>
```

Si ejecutamos Get-DomainTrustMapping:

```powershell
PS C:\Windows\system32> Get-DomainTrustMapping

SourceName      : sevenkingdoms.local
TargetName      : north.sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:48:45 PM
WhenChanged     : 7/11/2024 3:37:42 PM

SourceName      : sevenkingdoms.local
TargetName      : essos.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : TREAT_AS_EXTERNAL,FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:58:48 PM
WhenChanged     : 7/21/2024 10:50:58 AM

SourceName      : essos.local
TargetName      : sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:58:47 PM
WhenChanged     : 7/21/2024 10:50:58 AM

SourceName      : north.sevenkingdoms.local
TargetName      : sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:48:45 PM
WhenChanged     : 7/11/2024 3:37:42 PM

PS C:\Windows\system32>
```

Podemos ver que Get-DomainTrustMapping proporciona mas información al proporcionar todos los puntos de vista y no únicamente donde el dominio actual es el origen.

Si ejecutáramos Get-DomainTrust en los dominios north.sevenkingdoms.local y essos.local, obtendríamos las confianzas de esos dominios si, pero por ejemplo, en north.sevenkingdoms.local no veríamos que sevenkingdoms.local tiene una confianza con essos.local. De la misma manera, si lo ejecutáramos en essos.local no veríamos que sevenkingdoms.local tiene una confianza con north.sevenkingdoms.local. He aquí el ejemplo de ejecutar Get-DomainTrust:

- north.sevenkingdoms.local

```powershell
PS C:\Users\robb.stark> Get-DomainTrust

SourceName      : north.sevenkingdoms.local
TargetName      : sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:48:45 PM
WhenChanged     : 7/11/2024 3:37:42 PM

PS C:\Users\robb.stark>
```

- essos.local

```powershell
PS C:\Windows\system32> Get-DomainTrust

SourceName      : essos.local
TargetName      : sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:58:47 PM
WhenChanged     : 7/21/2024 10:50:58 AM

PS C:\Windows\system32>
```

Y si ahora ejecutamos Get-DomainTrustMapping:

- north.sevenkingdoms.local

```powershell
PS C:\Users\robb.stark> Get-DomainTrustMapping

SourceName      : north.sevenkingdoms.local
TargetName      : sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:48:45 PM
WhenChanged     : 7/11/2024 3:37:42 PM

SourceName      : sevenkingdoms.local
TargetName      : north.sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:48:45 PM
WhenChanged     : 7/11/2024 3:37:42 PM

SourceName      : sevenkingdoms.local
TargetName      : essos.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : TREAT_AS_EXTERNAL,FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:58:48 PM
WhenChanged     : 7/21/2024 10:50:58 AM

SourceName      : essos.local
TargetName      : sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:58:47 PM
WhenChanged     : 7/21/2024 10:50:58 AM

PS C:\Users\robb.stark>
```

- essos.local

```powershell
PS C:\Windows\system32> Get-DomainTrustMapping

SourceName      : essos.local
TargetName      : sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:58:47 PM
WhenChanged     : 7/21/2024 10:50:58 AM

SourceName      : sevenkingdoms.local
TargetName      : north.sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:48:45 PM
WhenChanged     : 7/11/2024 3:37:42 PM

SourceName      : sevenkingdoms.local
TargetName      : essos.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : TREAT_AS_EXTERNAL,FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:58:48 PM
WhenChanged     : 7/21/2024 10:50:58 AM

SourceName      : north.sevenkingdoms.local
TargetName      : sevenkingdoms.local
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 6/9/2024 3:48:45 PM
WhenChanged     : 7/11/2024 3:37:42 PM

PS C:\Windows\system32>
```

Podemos observar entonces que si ejecutamos Get-DomainTrust estamos "perdiendo información". Que no es perder, simplemente estamos solicitando una información diferente. Depende de nuestras necesidades usaremos uno u otro.

Esta misma enumeración podemos realizarla desde Linux usando las mismas funciones a través de herramientas como _[PowerView.py](https://github.com/aniqfakhrul/powerview.py)_ o _[PywerView](https://github.com/the-useless-one/pywerview)_:

- PowerView.py

```bash
powerview north/robb.stark:sexywolfy@192.168.50.10 --use-ldap

Get-DomainTrust
```

![Resultado de Get-DomainTrust con PowerView.py en Linux](https://cdn.deephacking.tech/i/posts/confianzas-en-active-directory/confianzas-en-active-directory-5.avif)

- PywerView

```bash
pywerview get-netdomaintrust -w north.sevenkingdoms.local -u robb.stark -p sexywolfy --dc-ip 192.168.50.10
```

![Resultado de PywerView para enumeración de confianzas](https://cdn.deephacking.tech/i/posts/confianzas-en-active-directory/confianzas-en-active-directory-6.avif)

Todas estas confianzas que acabamos de enumerar desde _[BloodHound](https://github.com/BloodHoundAD/BloodHound)_ se verían de la siguiente manera:

![Visualización de confianzas en BloodHound](https://cdn.deephacking.tech/i/posts/confianzas-en-active-directory/confianzas-en-active-directory-7.avif)

## Conclusión

Llegados este punto hemos visto todos los tipos distintos de confianzas que puede existir en un directorio activo junto a las posibles propiedades de un atributo importante de los TDO. De esta manera si nos encontramos una confianza en algún dominio ya podemos ser capaces de identificar su funcionamiento y rol.

## Referencias

- _[Trusts - Attacking Active Directory: 0 to 0.9 - Eloy Pérez González](https://zer1t0.gitlab.io/posts/attacking_ad/#trusts)_
- _[Active Directory Domain Trust and Forest Enumeration Part-3 With PowerView](https://nored0x.github.io/red-teaming/active-directory-Trust-enumeration/)_
- _[Active Directory Spotlight: Trusts — Part 2. Operational Guidance](https://www.securesystems.de/blog/active-directory-spotlight-trusts-part-2-operational-guidance/)_
