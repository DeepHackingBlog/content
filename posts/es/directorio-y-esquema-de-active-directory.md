---
id: "directorio-y-esquema-de-active-directory"
title: "Directorio y esquema de Active Directory"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-10-16
updatedDate: 2024-10-16
image: "https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-0.webp"
description: "Explora la estructura interna de Active Directory: base de datos NTDS, naming contexts, esquema, clases, atributos y el Global Catalog para entender cómo se organiza y gestiona la información en AD."
categories:
  - "active-directory"
draft: false
featured: false
lang: "es"
---

En los anteriores artículos de Active Directory hemos visto una introducción a sus conceptos principales y componentes.
- [¿Qué es Active Directory? - Introducción](https://blog.deephacking.tech/es/posts/introduccion-a-active-directory/)
- [Trusts (Confianzas) – Active Directory](https://blog.deephacking.tech/es/posts/confianzas-en-active-directory/)

Hemos mencionado que Active Directory trabaja con el concepto de objetos y que todo lo es. Ahora bien, esta información debe de guardarse en algún lado, y es eso mismo lo que vamos a ver hoy, vamos a hablar de la base de datos de Active Directory y como se estructura todo.

La base de datos de Active Directory, donde se almacena toda su información, se encuentra en la siguiente ruta de los controladores de dominio:

```plaintext
C:\Windows\NTDS\ntds.dit
```

Cada controlador de dominio (DC) tiene su propia copia de la base de datos de Active Directory, conocida como NTDS (New Technology Directory Services Directory Information Tree - NTDS.DIT). Aunque cada DC mantiene su propia NTDS, todos ellos se mantienen sincronizados mediante un proceso llamado replicación (DCSync). Esto significa que cualquier cambio realizado en la base de datos de un controlador, como añadir un nuevo usuario o modificar una política, se comunica a los demás controladores de dominio para que actualicen sus propias copias. De esta manera, se asegura que todos los controladores de dominio tengan siempre la misma información actualizada. De manera por defecto, este proceso ocurre cada 3 horas.

Sabiendo esto, vamos a ver el esquema de la base de datos y como se estructura Active Directory:

- [¿Qué es un servicio de directorio?](#qué-es-un-servicio-de-directorio)
- [Distinguished Names (DN)](#distinguished-names-dn)
- [RootDSE y Naming Contexts](#rootdse-y-naming-contexts)
    - [¿Qué es el RootDSE?](#qué-es-el-rootdse)
    - [Naming Contexts predeterminados](#naming-contexts-predeterminados)
        - [Domain Naming Context](#domain-naming-context)
        - [Configuration Naming Context](#configuration-naming-context)
        - [Schema Naming Context](#schema-naming-context)
    - [Default Naming Context](#default-naming-context)
    - [Application Naming Contexts](#application-naming-contexts)
- [Global Catalog (GC)](#global-catalog-gc)
- [Esquema de Active Directory](#esquema-de-active-directory)
    - [Clases](#clases)
    - [Definición de clases y atributos del esquema](#definición-de-clases-y-atributos-del-esquema)
    - [Propiedades](#propiedades)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

## ¿Qué es un servicio de directorio?

En informática, cuando se habla de un servicio de directorio se refiere a algo similar a una base de datos, pero normalmente un poco mas completa debido a que suele contener información mas descriptiva basada en atributos. A diferencia de las bases de datos tradicionales, un servicio de directorio sigue una estructura jerárquica, lo que permite realizar consultas rápidas y además que la información se organice de manera mas estructurada, facilitando así el acceso.

Uno de los conjuntos de estándares mas conocidos sobre servicio de directorio es X.500. ¿Qué tan relevante para nosotros es esto? Pues no mucho, mas allá de que para que lo conozcas y sepas que Active Directory Domain Services (AD DS) y LDAP están basados en este estándar.

Entonces, ¿Cómo se relaciona el directorio de Active Directory (AD DS) con LDAP?

Pues básicamente AD DS es el encargado de definir la estructura jerárquica del directorio y almacenar toda la información relacionada con los objetos de la red del directorio activo (usuarios, grupos, dispositivos, etc...). Y LDAP es el protocolo encargado de que esta información pueda ser consultada y gestionada de manera eficiente. En resumen, AD DS define y almacena, y LDAP permite la consulta y acceso a esos datos. Esta combinación es lo que hace que **Active Directory** funcione de manera efectiva en la gestión de redes empresariales.

## Distinguished Names (DN)

Ya sabemos como funciona el Active Directory Domain Services y su relación con LDAP. Ahora bien, ¿Cómo se consulta o interactúa con un objeto dentro del directorio a través de LDAP? ¿Qué estructura se sigue? ¿Qué parámetro es el encargado?

Pues de esto se encarga el DN (Distinguished Name). El DN es una cadena que identifica de forma única a cada objeto dentro del directorio, es por así decirlo, la "dirección" exacta de un objeto dentro de la jerarquía del directorio. Cuando se quiere acceder o hacer consultas sobre un objeto en **AD DS** (Active Directory) a través de **LDAP**, se utiliza el **DN** para referirse a dicho objeto de manera precisa.

A continuación un ejemplo visual:

<figure>

![Ejemplo visual de Distinguished Name mostrando la jerarquía de objetos en Active Directory](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-1.avif)

<figcaption>

Windows Security Internals: A Deep Dive into Windows Authentication, Authorization, and Auditing - James Forshaw

</figcaption>

</figure>

Por ejemplo, si queremos referirnos al usuario bob, su DN sería:

```plaintext
CN=bob,CN=Users,DC=mineral,DC=local 
```

Dentro del DN podemos encontrar distintos [tipos de atributos definidos por Microsoft](https://learn.microsoft.com/en-us/previous-versions/windows/desktop/ldap/distinguished-names):

| Nombre del atributo | Explicación |
| --- | --- |
| Common-Name (CN) | Es el nombre del objeto en cuestión, como un usuario o dispositivo. |
| Domain Component (DC) | Define los componentes del nombre de dominio, separados por puntos. Por ejemplo, para "deephacking.tech", tendríamos "DC=deephacking, DC=tech". |
| Organizational Unit (OU) | Hace referencia a una unidad organizativa dentro de la estructura del directorio. |

A través de estos atributos (que no son todos pero si los principales) podemos definir la dirección exacta de un objeto dentro de la jerarquía del directorio activo.

Además del DN está el concepto de RDN (Relative Distinguished Names), el RDN no deja de ser la versión corta del DN, por ejemplo:

- DN

```plaintext
DN: CN=bob,CN=Users,DC=mineral,DC=local
```

- RDN:

```plaintext
RDN: CN=bob
```

Viendo esto podemos llegar a la conclusión de que dentro de una organización, dos objetos pueden tener el mismo RDN, pero sus DNs siempre serán únicos en el directorio. Ahora bien, aunque el DN siempre sea único no quiere decir que sea consistente ya que cambiaría si un objeto es modificado o eliminado. Para solucionar esto podemos mencionar la existencia del objectGUID que es un atributo que tiene cada objeto y que se mantiene igual aunque cambie el DN.

## RootDSE y Naming Contexts

Después de comprender cómo funcionan los Distinguished Names (DN) para identificar objetos dentro de un directorio, es fundamental entender dos conceptos clave para interactuar con Active Directory a través de LDAP:
- RootDSE
- Naming Contexts

### ¿Qué es el RootDSE?

El RootDSE (Root Directory Server Agent Service Entry) es un objeto especial dentro de Active Directory que sirve como punto de entrada cuando interactuamos con el directorio utilizando LDAP. La DSE (Directory System Agent) es el componente del sistema que se encarga de manejar las operaciones de LDAP en el servidor, y el RootDSE es la representación de esa interfaz inicial. A diferencia de otros objetos en Active Directory, el RootDSE no tiene un Distinguished Name (DN) asignado, lo que significa que no es parte de la jerarquía de objetos que se suele consultar con un DN específico. Esto lo hace accesible de manera global en cualquier servidor LDAP de Active Directory sin necesidad de especificar su localización.

Por ejemplo, si queremos consultarlo usando ldapsearch podemos hacerlo de la siguiente manera:

```bash
ldapsearch -x -H ldap://192.168.50.10 -b "" -s base
```

![Resultado de consulta ldapsearch al RootDSE mostrando los naming contexts disponibles](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-2.avif)

![Detalle de los atributos del RootDSE en Active Directory](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-3.avif)

Un aspecto clave es que el RootDSE es accesible de manera anónima, permitiendo la lectura de ciertos atributos. Este comportamiento forma parte de la configuración predeterminada de Active Directory, ya que el RootDSE proporciona información de contexto sobre el entorno del directorio, como la versión del esquema, el nombre del dominio y las capacidades del servidor. Esta accesibilidad permite a aplicaciones y servicios descubrir la estructura y características del directorio sin necesidad de autenticarse. Sin embargo, este acceso está limitado a atributos no confidenciales.

En resumen, el RootDSE ofrece detalles sobre el entorno del directorio, como los diferentes contextos de nombres (naming contexts), las capacidades del servidor y configuraciones clave. Esto permite obtener información básica sobre la estructura del directorio y las funciones que soporta el servidor.

### Naming Contexts predeterminados

Dado el comportamiento distribuido de Active Directory, es necesario dividir los datos del directorio activo en particiones conocidas como naming contexts (NC). Sin estas particiones, cada controlador de dominio tendría que replicar toda la información del bosque cada vez que realizara una replicación (**DCSync**), lo cual sería ineficiente.

En Active Directory, un dominio se puede considerar como una partición de datos, también conocida como **naming context (NC)**. Esto permite que los controladores de dominio responsables de un dominio específico repliquen solo la información relevante a ese dominio, sin necesidad de replicar datos de otros dominios que no les afectan.

Sin embargo, existen ciertos datos que deben replicarse en **todos los controladores de dominio** dentro del bosque, lo que lleva a la necesidad de varios tipos de **naming contexts** en Active Directory.

<figure>

![Visualización de Naming Contexts en ADSI Edit mostrando las particiones de Active Directory](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-4.avif)

<figcaption>

ADSI Edit

</figcaption>

</figure>

### Domain Naming Context

El Domain Naming Context (NC) es una de las particiones clave dentro de la estructura de Active Directory. Cada dominio tiene su propio naming context, que almacena todos los objetos específicos de ese dominio. Estos objetos incluyen usuarios, grupos, ordenadores y grupos de seguridad, y el DN (Distinguished Name) del dominio actúa como el identificador principal de este contexto.

Por ejemplo, si el dominio de una organización es sevenkingdoms.local, su Domain Naming Context estaría representado por el DN DC=sevenkingdoms,DC=local.

Cada controlador de dominio dentro de un dominio específico mantiene una copia completa del Domain Naming Context para ese dominio. Esto significa que si tienes un dominio llamado north.sevenkingdoms.local, todos los controladores de dominio de ese dominio replicarán únicamente los objetos almacenados dentro de este NC, asegurando que los controladores de dominio solo manejen los datos necesarios para su propio dominio y no los de otros.

### Configuration Naming Context

El Configuration Naming Context (NC) es otro componente esencial en Active Directory, pero su alcance es diferente al del Domain NC. Mientras que el Domain NC almacena datos específicos del dominio, el Configuration NC contiene la configuración global que afecta a todo el bosque.

<figure>

![Configuration Naming Context en ADSI Edit mostrando configuración global del bosque](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-5.avif)

<figcaption>

ADSI Edit - Configuration Naming Context

</figcaption>

</figure>

A diferencia del Domain NC, el Configuration NC se replica en todos los controladores de dominio del bosque, lo que asegura que todos los controladores tengan la misma información de configuración.

Por ejemplo, dentro del Configuration NC se almacenan datos esenciales para la infraestructura global de Active Directory, como las políticas de replicación y las configuraciones de servicios críticos, como el File Replication Service (FRS), encargado de replicar el contenido del SYSVOL entre controladores de dominio. El SYSVOL es un directorio compartido que contiene archivos importantes, como scripts de inicio de sesión y políticas de grupo, que deben mantenerse sincronizados entre todos los controladores de dominio. Aunque no es el enfoque principal en este momento, cabe mencionar que en versiones más recientes de Windows Server, el Distributed File System Replication (DFSR) ha reemplazado al FRS para llevar a cabo esta tarea.

### Schema Naming Context

El Schema Naming Context (NC) es uno de los mas importantes ya que define la **estructura y reglas** que determinan qué tipos de objetos y atributos se pueden almacenar dentro del directorio. Ahora veremos mas en profundidad este concepto y podrás entender de mejor manera que se almacena en esta partición.

<figure>

![Schema Naming Context en ADSI Edit mostrando definiciones de clases y atributos](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-6.avif)

<figcaption>

ADSI Edit - Schema Naming Context

</figcaption>

</figure>

En cualquier caso, aunque el schema NC también se replica entre todos los controladores del dominio del bosque si que es cierto que aquí existe un rol especial conocido como Schema Master. El Schema Master es uno de los cinco [roles FSMO (Flexible Single Master Operations) de Active Directory](https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/fsmo-roles), y establece un único controlador de dominio en todo el bosque como autoridad para modificar el esquema.

Por ejemplo, cuando se instala una nueva aplicación que interactúa con Active Directory, como Microsoft Exchange o System Center Configuration Manager (SCCM), el esquema de Active Directory debe ser extendido para incluir nuevos tipos de atributos o clases que la aplicación necesita. Estos cambios son gestionados exclusivamente por el Schema Master.

De todas maneras ahora hablaremos de nuevo de manera mas concreta y extensa del esquema.

### Default Naming Context

El Default Naming Context se refiere al contexto de nombres predeterminado que se utiliza como punto de partida para realizar búsquedas y consultas dentro del dominio principal en Active Directory.

El Default Naming Context representa la raíz del dominio actual y actúa como el lugar desde donde se inician todas las operaciones relacionadas con la búsqueda o modificación de objetos en el dominio. Por ejemplo, si el dominio principal de una organización es sevenkingdoms.local, el Default Naming Context sería DC=kingslanding,DC=sevenkingdoms,DC=local. Este valor se obtiene consultando el RootDSE.

<figure>

![Default Naming Context en ADSI Edit representando el dominio principal](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-7.avif)

<figcaption>

ADSI Edit - Default Naming Context

</figcaption>

</figure>

Conocer este valor es crucial para los administradores (y atacantes), ya que les permite realizar consultas eficientes sobre los objetos dentro de la estructura del dominio y gestionar de manera adecuada la jerarquía de Active Directory.

### Application Naming Contexts

Además de los naming contexts principales que acabamos de ver existen particiones adicionales conocidas como Application Naming Contexts o particiones de aplicación. Estas particiones están diseñadas para almacenar datos de aplicaciones o servicios específicos que no afectan directamente a los objetos de seguridad, como usuarios o grupos, y su replicación puede ser controlada de manera más detallada entre los controladores de dominio.

A diferencia de los naming contexts principales, los Application Naming Contexts no tienen que replicarse en todos los controladores de dominio. En cambio, su replicación puede configurarse de manera selectiva, replicando solo entre los controladores de dominio que se elijan específicamente para gestionar estos datos.

Dos ejemplos comunes de Application Naming Contexts que se generan automáticamente cuando se integra DNS con Active Directory son DomainDnsZones y ForestDnsZones. Ambos naming contexts son utilizados para almacenar información relacionada con las zonas DNS y su replicación:
- **DomainDnsZones**: Esta partición contiene los datos DNS específicos de cada dominio en Active Directory. Se replica solo entre los controladores de dominio que gestionan ese dominio en particular.
- **ForestDnsZones**: Esta partición se utiliza para almacenar los datos DNS a nivel de bosque, permitiendo que la información DNS compartida por todos los dominios del bosque se replique en todos los controladores de dominio.

Por ejemplo, en la imagen del principio podemos visualizar estos dos NC debido a que el DNS está integrado y gestionado por el directorio activo:

![Application Naming Contexts DomainDnsZones y ForestDnsZones en ADSI Edit](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-8.avif)

Además de estos dos ejemplos cualquier administrador puede crear sus propias particiones de aplicación personalizadas para que sean utilizadas por aplicaciones específicas que requieran replicación de datos entre un número selecto de controladores de dominio.

## Global Catalog (GC)

Toda la información organizada en las particiones de datos (Naming Contexts) de Active Directory puede ser accedida eficientemente a nivel de todo el bosque gracias al Global Catalog (GC). El GC es una base de datos distribuida parcial que se aloja en servidores designados como Global Catalog Servers, que normalmente son controladores de dominio configurados para cumplir esta función. El primer controlador de dominio en un bosque se convierte automáticamente en un Global Catalog Server, y otros controladores de dominio pueden ser promovidos para desempeñar este rol. No es necesario que todos los controladores de dominio sean Global Catalog Servers por defecto, pero tener varios puede optimizar el rendimiento en entornos distribuidos geográficamente.

Estos servidores contienen una copia completa de todos los objetos del dominio en el que están ubicados y una copia parcial, de solo lectura, de todos los objetos de los demás dominios del bosque. Es importante destacar que la réplica parcial del GC incluye una copia de todos los objetos del bosque, pero solo de un subconjunto de sus atributos. Es decir, almacena todos los objetos, pero únicamente aquellos atributos marcados como críticos o necesarios para búsquedas comunes.

Los atributos que se incluyen en el GC se determinan en el esquema de Active Directory (del cual hablaremos más adelante) y están marcados con la propiedad isMemberOfPartialAttributeSet. Estos atributos no tienen por qué ser los más frecuentemente utilizados, sino aquellos designados para el funcionamiento eficiente del directorio y las búsquedas globales. Algunos ejemplos de estos atributos pueden ser nombres de usuario, direcciones de correo electrónico, etc.

En resumen, a diferencia de los Naming Contexts, que contienen todos los atributos de los objetos, el GC solo almacena aquellos atributos que son críticos para la búsqueda y el acceso. De esta forma, el GC optimiza el rendimiento al evitar replicar datos innecesarios y permite que aplicaciones y usuarios en un dominio puedan consultar objetos de otros dominios dentro del mismo bosque a través del Global Catalog Server.

Algunas de las funciones mas importantes que realiza el Global Catalog son:
- Búsqueda a nivel de bosque: El GC permite a los usuarios y aplicaciones realizar búsquedas en todo el bosque, independientemente del dominio en el que se encuentre el objeto. Por ejemplo, si un empleado de "spain.deephacking.local" necesita encontrar un atributo concreto de otro empleado que se encuentra en "uk.deephacking.local", puede buscar directamente en el directorio de su dominio gracias al GC.
- Autenticación de nombre principal de usuario (UPN): El GC es esencial para autenticar usuarios mediante su _User Principal Name (UPN)_, especialmente cuando la cuenta de usuario está en un dominio diferente al del controlador que procesa la solicitud de inicio de sesión. Por ejemplo, si "usuario@uk.deephacking.local" intenta iniciar sesión en un equipo dentro de "spain.deephacking.local", el controlador de dominio local consultará al GC para autenticar al usuario correctamente.
- Validación de referencias a objetos de otros dominios: Los controladores de dominio utilizan el GC para validar referencias a objetos que residen en otros dominios. Por ejemplo, si en "spain.deephacking.local" hay un grupo que incluye como miembro a un usuario de "uk.deephacking.local", el controlador de dominio necesita consultar al GC para validar esa referencia y asegurar que el usuario todavía existe y tiene los permisos adecuados.
- Pertenencia a grupos universales: En entornos de varios dominios, el GC es el único lugar donde los controladores de dominio pueden consultar si un usuario pertenece a grupos universales. Por ejemplo, si un usuario de "spain.deephacking.local" es miembro de un grupo universal que otorga acceso a recursos en "uk.deephacking.local", durante el inicio de sesión, el controlador de dominio consultará al GC para obtener esta información y garantizar que el usuario tenga los permisos necesarios.

> Cuando nos referimos a que un controlador de dominio consultará con el GC, nos referimos a que el controlador de dominio intentará contactar con un Global Catalog Server disponible en su **_[mismo sitio de Active Directory](https://blogs.manageengine.com/active-directory/2022/07/25/active-directory-sites-in-a-nutshell.html)_**, independientemente del dominio al que pertenezca ese GC. Si no hay un GC disponible en el sitio local o la conectividad está interrumpida, el controlador de dominio está diseñado para contactar con un GC en **otro sitio** dentro del mismo bosque.

En cualquier caso, estas funciones que acabamos de ver son esenciales en entornos con múltiples dominios. Por ejemplo, imaginemos un entorno con los dominios "spain.deephacking.local" y "uk.deephacking.local". Si un usuario en el dominio "spain" necesita información sobre un usuario en "uk", el Global Catalog permitirá encontrar esta información de manera rápida sin tener que consultar directamente a los controladores de dominio de "uk". Además, si el usuario de "spain" inicia sesión con un UPN y su cuenta está en "uk" , el controlador de dominio de "spain" contactará al GC para autenticar al usuario correctamente.

Para terminar, de cara al diseño de una infraestructura (o nosotros entender una desde el punto de vista ofensivo) es importante optimizar la ubicación de los Global Catalog Servers en entornos distribuidos geográficamente. Deben de estar ubicados en sitios con muchos usuarios o con frecuentes consultas interdominio, ya que, mejora la eficiencia y reduce la latencia en búsquedas y autenticaciones. Sin embargo, se debe equilibrar el número de GC en la red para evitar un exceso de tráfico de replicación que pueda afectar al rendimiento.

## Esquema de Active Directory

Vale ya hemos visto que es el directorio dentro del directorio activo además de varios conceptos como los naming contexts (que se relacionan con LDAP) y el global catalog . Ahora bien, para que todo cuadre falta un concepto mas, el esquema (que hemos mencionado mínimamente en el Schema NC).

El esquema es como un marco de referencia que define tanto las **clases de objetos** (por ejemplo, usuarios, grupos, impresoras) como los **atributos** que pueden o deben tener esos objetos. Algunas de estas clases u atributos están basados en estándares. Puedes imaginarte el esquema como un "molde".

Estas clases y atributos son esenciales para que Active Directory funcione correctamente, ya que proporcionan la estructura necesaria para que el directorio sepa qué tipo de información puede almacenar y cómo debe presentarla. Cada objeto en el directorio tiene que seguir las reglas establecidas por el esquema. Por ejemplo, si creamos un objeto de tipo "usuario", el esquema define que ese objeto debe tener atributos obligatorios como el "nombre" y la "contraseña", y puede tener atributos opcionales como el "número de teléfono" o "dirección de correo electrónico".

Es importante destacar que el esquema de **Active Directory** es **extensible**, lo que significa que se pueden agregar nuevas clases de objetos o atributos según sea necesario para adaptarse, aunque que ocurra esto no es lo común. Nadie se atreve a editar el esquema, al menos por lo que se de mi experiencia.

Aunque si que es cierto que el esquema suele ser modificado por parte de Microsoft cuando publica una nueva versión de Windows Server. Podemos observar la versión usando el siguiente comando:

PowerShell

```
PS C:\Users\robb.stark> Get-ItemProperty 'AD:\CN=Schema,CN=Configuration,DC=sevenkingdoms,DC=local' -Name objectVersion

objectVersion : 88
PSPath        : Microsoft.ActiveDirectory.Management.dll\ActiveDirectory:://RootDSE/CN=Schema,CN=Configuration,DC=sevenkingdoms,DC=local
PSParentPath  : Microsoft.ActiveDirectory.Management.dll\ActiveDirectory:://RootDSE/
PSChildName   : CN=Schema,CN=Configuration,DC=sevenkingdoms,DC=local
PSDrive       : AD
PSProvider    : Microsoft.ActiveDirectory.Management.dll\ActiveDirectory

PS C:\Users\robb.stark>
```

Estas son las versiones del esquema según la versión de Windows Server:

<figure>

![Tabla de versiones de esquema de Active Directory por versión de Windows Server](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-9.avif)

<figcaption>

[Versiones de esquema de Active Directory - Microsoft Learn](https://learn.microsoft.com/es-es/windows-server/identity/ad-ds/deploy/find-active-directory-schema)

</figcaption>

</figure>

Por ejemplo, podemos observar que entre Windows Server 2019 y Windows Server 2022 no hubo modificaciones, al menos a nivel de esquema.

Entonces, en resumen debemos de quedarnos con que mientras que el **directorio** es donde se almacenan los objetos y sus datos, el **esquema** define las reglas que esos objetos deben seguir, asegurando que todo esté estructurado de manera coherente dentro de **Active Directory**.

#### Clases

Dentro del esquema del que acabamos de hablar, se definen diversas [clases de objetos en Active Directory](https://docs.microsoft.com/en-us/windows/win32/adschema/classes) que organizan la información almacenada en el directorio. Cada clase no solo organiza los objetos, sino que define qué atributos puede o debe tener cada objeto dentro del directorio. Además, determina cómo se relacionan unas clases con otras. Por ejemplo, algunas de las clases más comunes son [clase User](https://docs.microsoft.com/en-us/windows/win32/adschema/c-user), [clase Group](https://docs.microsoft.com/en-us/windows/win32/adschema/c-group), y [clase Computer](https://docs.microsoft.com/en-us/windows/win32/adschema/c-computer), cada una diseñada para representar un tipo particular de objeto dentro de la red. De esta manera podemos indicar que cada objeto del directorio activo es una instancia de una clase del esquema.

Además, una clase puede ser una subclase si deriva de una clase padre, lo que ocasiona que la subclase herede los atributos de la clase padre. Por ejemplo, la clase Computer es una subclase de la clase User, lo que permite que los objetos de tipo ordenador compartan atributos con los objetos de tipo usuario. Además de heredar los atributos de la clase User, la clase Computer puede tener sus propios atributos adicionales, como por ejemplo ipHost en el caso de la clase Computer.

Todas las clases existentes en Active Directory son subclases de una clase base llamada [clase Top](https://docs.microsoft.com/en-us/windows/win32/adschema/c-top). La clase Top proporciona una estructura común al definir atributos esenciales que todos los objetos comparten, como ObjectClass y ObjectGUID.

El atributo ObjectClass registra una lista de todas las clases a las que pertenece un objeto, incluyendo su clase actual y todas las clases padres. Esto ayuda a categorizar y entender la jerarquía y el tipo de cada objeto. Por otro lado, ya conocemos el ObjectGUID porque los hemos mencionado antes, este atributo contiene el [Globally Unique Identifier (GUID) según el estándar UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier), un identificador único asignado a cada objeto en la base de datos de Active Directory. Este GUID garantiza que cada objeto pueda ser identificado de manera única.

Para finalizar, las clases pueden asociarse con clases auxiliares para heredar atributos adicionales. A diferencia de una clase principal, una clase auxiliar no define un objeto completo por sí misma; en cambio, proporciona atributos adicionales que pueden ser incorporados en otras clases principales. En otras palabras, las clases auxiliares no crean instancias de objetos en el directorio, sino que extienden las capacidades de otras clases al asociarse con ellas.

Por ejemplo, la clase auxiliar [Security-Principal](https://docs.microsoft.com/en-us/windows/win32/adschema/c-securityprincipal) define atributos como por ejemplo el SAMAccountName, que es fundamental para la gestión de cuentas. Este atributo está presente en objetos como usuarios y grupos, que pertenecen a las clases User y Group, respectivamente. Esto significa que la clase auxiliar Security-Principal se asocia con las clases User y Group para proporcionarles este atributo adicional (entre otros más). Es importante destacar que las clases auxiliares no aparecen de manera directa en la propiedad ObjectClass del objeto.

Por último, un par de ejemplos del atributo ObjectClass en un objeto usuario y un objeto ordenador:

```powershell
PS C:\Users\robb.stark> Get-DomainUser robb.stark -Properties objectclass | select -ExpandProperty objectclass
top
person
organizationalPerson
user
PS C:\Users\robb.stark>
```

```powershell
PS C:\Users\robb.stark> Get-DomainComputer winterfell -Properties objectclass | select -ExpandProperty objectclass
top
person
organizationalPerson
user
computer
PS C:\Users\robb.stark>
```

Podemos observar como el objeto de ordenador posee la clase de Computer, tal y como habíamos comentado previamente.

<figure>

![Diagrama de herencia de clases en Active Directory mostrando relación entre Top, User y Computer](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-10.avif)

<figcaption>

Windows Security Internals: A Deep Dive into Windows Authentication, Authorization, and Auditing - James Forshaw

</figcaption>

</figure>

#### Definición de clases y atributos del esquema

Podemos encontrar el esquema en la siguiente ruta del directorio:

```plaintext
cn=schema,cn=Configuration,dc=sevenkingdoms,dc=local
```

![Estructura del esquema de Active Directory en ADSI Edit mostrando classSchema y attributeSchema](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-11.avif)

> Nota: aunque en el DN podamos visualizar que parece que el Schema NC forma parte del Configuration NC no es así, son particiones totalmente independientes.

Aquí podemos encontrar todas las definiciones de las clases y atributos del directorio activo.

En el esquema de Active Directory, como se muestra en la imagen, podemos ver que está compuesto por dos tipos de objetos principales: **classSchema** y **attributeSchema**. Estos objetos definen, respectivamente, las clases de objetos (como por ejemplo he mencionado previamente la clase User o Computer) y los atributos (como SID, objectGUID, etc.) que los objetos pueden tener.

Vamos a ver un ejemplo para entenderlo bien, aquí vemos el objeto de mi usuario actual:

```powershell
PS C:\Users\robb.stark> Get-DomainUser -Identity robb.stark

logoncount            : 5399
badpasswordtime       : 12/31/1600 4:00:00 PM
description           : Robb Stark
l                     : Winterfell
distinguishedname     : CN=robb.stark,CN=Users,DC=north,DC=sevenkingdoms,DC=local
objectclass           : {top, person, organizationalPerson, user}
lastlogontimestamp    : 7/24/2024 3:29:17 AM
name                  : robb.stark
objectsid             : S-1-5-21-2645935458-595591891-1233751793-1113
samaccountname        : robb.stark
lastlogon             : 7/31/2024 2:42:08 PM
codepage              : 0
samaccounttype        : USER_OBJECT
accountexpires        : NEVER
countrycode           : 0
whenchanged           : 7/24/2024 10:29:17 AM
instancetype          : 4
objectguid            : 73fde0a4-2653-4296-9a6a-fc1e51b399c3
sn                    : Stark
lastlogoff            : 12/31/1600 4:00:00 PM
objectcategory        : CN=Person,CN=Schema,CN=Configuration,DC=sevenkingdoms,DC=local
dscorepropagationdata : {6/9/2024 4:19:47 PM, 6/9/2024 4:14:24 PM, 6/9/2024 4:14:21 PM, 1/1/1601 6:16:32 PM}
givenname             : Robb
admincount            : 1
memberof              : {CN=Stark,CN=Users,DC=north,DC=sevenkingdoms,DC=local, CN=Administrators,CN=Builtin,DC=north,DC=sevenkingdoms,DC=local}
whencreated           : 6/9/2024 4:01:39 PM
badpwdcount           : 0
cn                    : robb.stark
useraccountcontrol    : NORMAL_ACCOUNT, DONT_EXPIRE_PASSWORD
usncreated            : 13367
primarygroupid        : 513
pwdlastset            : 6/9/2024 10:28:18 AM
usnchanged            : 65571

PS C:\Users\robb.stark>
```

Podemos ver que el objeto por un lado:

- Pertenece a la clase User (se puede ver en el atributo objectclass)

- Posee distintos atributos: description, objectclass, samaccountname, etc, etc.

Pues todo esto, tanto la clase User, como cada atributo que podemos visualizar, están definidos en el esquema. Por ejemplo, la clase User:

![Definición de la clase User en el esquema de Active Directory](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-12.avif)

Ahí está. Ahora, el atributo por ejemplo, samaccountname:

![Definición del atributo samaccountname en el esquema de Active Directory](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-13.avif)

Está ahí también.

Lo dicho, en el esquema está todo todo definido.

Es gracioso porque los propios objetos atributos (attributeSchema) poseen atributos. Aunque en este caso a estos "segundos atributos" vamos a llamarlos propiedades.

Estas propiedades de los atributos también se definen en el esquema y podemos encontrarlos, por ejemplo, una propiedad de los atributos sería cn:

![Propiedad cn de un atributo en Active Directory](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-14.avif)

Pues esta propiedad también la podemos encontrar en el esquema porque al final, es un atributo del objeto de tipo attributeSchema:

![Definición de cn como atributo de attributeSchema en el esquema](https://cdn.deephacking.tech/i/posts/directorio-y-esquema-de-active-directory/directorio-y-esquema-de-active-directory-15.avif)

#### Propiedades

Como ya hemos visto, cada clase puede tener varias propiedades o atributos; por ende, los objetos (instancias de las clases) poseen varias propiedades o atributos. En general, cualquier usuario del dominio tiene permisos para leer la mayoría de los objetos del dominio, pero existen excepciones importantes. Un ejemplo evidente es que las contraseñas de los usuarios no pueden ser leídas por razones obvias (de seguridad).

Por ejemplo, entre las propiedades definidas en la base de datos, se encuentran UserPassword y UnicodePwd. Aunque estas propiedades existen, no pueden ser leídas por ningún usuario. Solo se pueden sobrescribir en casos como el cambio de contraseña, pero no se puede acceder a sus valores almacenados.

Este tipo de restricciones sobre las propiedades sensibles no solo aplica a las contraseñas. En Active Directory, hay otras propiedades que contienen información confidencial, y su acceso debe ser controlado de manera similar. Para proteger estos datos sensibles, Active Directory utiliza un atributo llamado SearchFlags, que se define de manera individual para cada propiedad dentro del esquema.

Por ejemplo, el valor 128 en SearchFlags marca una propiedad como confidencial, lo que significa que, además de los permisos de lectura generales, el usuario debe tener el derecho de CONTROL_ACCESS para poder leerla.

Podemos obtener las propiedades marcadas como confidenciales a través de la siguiente consulta:

```powershell
PS C:\Users\robb.stark> Get-ADObject -LDAPFilter "(searchflags:1.2.840.113556.1.4.803:=128)" -SearchBase "CN=Schema,CN=Configuration,DC=sevenkingdoms,DC=local" | Select Name

name
----
ms-TPM-Owner-Information-Temp
ms-Kds-KDF-AlgorithmID
ms-Kds-KDF-Param
ms-Kds-SecretAgreement-AlgorithmID
ms-Kds-SecretAgreement-Param
ms-Kds-PublicKey-Length
ms-Kds-PrivateKey-Length
ms-Kds-RootKeyData
ms-Kds-Version
ms-Kds-DomainID
ms-Kds-UseStartTime
ms-Kds-CreateTime
ms-FVE-RecoveryPassword
ms-FVE-KeyPackage
ms-TPM-OwnerInformation
ms-DS-Transformation-Rules-Compiled
ms-PKI-Credential-Roaming-Tokens
ms-DS-Issuer-Certificates
ms-PKI-RoamingTimeStamp
ms-PKI-DPAPIMasterKeys
ms-PKI-AccountCredentials
UnixUserPassword

PS C:\Users\robb.stark>
```

> De la consulta utilizada puede que lo único que no se entienda es el conjunto de números 1.2.840.113556.1.4.803. Este conjunto de números corresponde a un OID (Object Identifier) y se asocia a una regla de coincidencia en LDAP. Podéis obtener más información sobre [LDAP Matching Rules (extensibleMatch) en Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/4e638665-f466-4597-93c4-12f2ebfabab5)
> 
> Además, podemos observar la operación :=, esta operación básicamente busca por coincidencia. Podemos ver más información sobre la [sintaxis de filtros de búsqueda en LDAP](https://learn.microsoft.com/en-us/windows/win32/adsi/search-filter-syntax)

Para asegurar un control más preciso sobre algunas propiedades sensibles, Active Directory también implementa el concepto de Validated Writes. Estas propiedades requieren que se cumplan ciertas condiciones específicas antes de poder ser modificadas. Por ejemplo, cuando se quiere cambiar un atributo relacionado con los servicios de una cuenta (como el nombre de inicio de sesión), Active Directory verifica que el cambio cumpla con ciertas reglas o validaciones. Esto garantiza que las modificaciones no comprometan la integridad del sistema o los datos del directorio.

Básicamente, Validated Writes actúa como una capa adicional de seguridad que impide que se realicen cambios incorrectos o no autorizados en propiedades importantes, asegurando que el cambio propuesto es válido y seguro antes de permitirlo.

Por otro lado, para simplificar la gestión de permisos sobre propiedades, Active Directory ofrece la posibilidad de utilizar Property Sets. Un Property Set es un conjunto de propiedades relacionadas que pueden ser gestionadas de manera conjunta en lugar de individualmente. En lugar de asignar permisos para cada propiedad por separado, lo cual puede ser una tarea tediosa en un entorno con muchas propiedades, los administradores pueden agrupar propiedades que tengan una relación funcional y asignar permisos a todo el conjunto a la vez.

Por ejemplo, un Property Set podría incluir todas las propiedades relacionadas con la gestión de cuentas de usuario, como el nombre, dirección de correo electrónico y el identificador de inicio de sesión. Esto es especialmente útil en entornos grandes o complejos, donde hay muchas propiedades que administrar. Los Property Sets permiten una administración más eficiente y menos propensa a errores en la configuración de permisos.

## Conclusión

Pffff, tremenda chapa ha sido en realidad pero es que el directorio y esquema de un directorio activo no es poca cosa. En el día a día por supuesto que puede que no tengas que tener todas estas cosas en cuenta, me refiero, si te encuentras una credencial de administrador en un recurso compartido y comprometes el dominio, pues poca teoría has tenido que aplicar xD.

En cualquier caso conocer toda esta información o al menos, conocer su existencia, puede venir genial cuando se quiere entender en profundidad el concepto de directorio activo y como realmente funciona y se estructura todo.

Espero que os haya gustado y se agradece si lo compartís <3.

## Referencias
- [Attacking Active Directory: 0 to 0.9 - Database](https://zer1t0.gitlab.io/posts/attacking_ad/#database)
- [Active Directory O'Reilly - 5th Edition](https://www.oreilly.com/library/view/active-directory-5th/9781449361211/)
- [Introducción a Active Directory Domain Services](https://learn.microsoft.com/es-es/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview)
- [Catálogo Global (Global Catalog): Conceptos y Funciones](https://pablodiloreto.com/articulo-active-directory-domain-services-catalogo-global-global-catalog-conceptos-y-funciones/)
- [Windows Server. ¿Qué es el catálogo global?](https://www.kalerolinex.com/archives/windows-server-que-es-el-catalogo-global/)
