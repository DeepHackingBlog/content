---
id: "introduccion-a-las-politicas-de-grupo-gpo-active-directory"
title: "Introducción a las Políticas de Grupo (GPO) en Active Directory"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2026-01-19
updatedDate: 2026-01-19
image: "https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-0.webp"
description: "Descubre qué son las Políticas de Grupo en Active Directory, cómo funcionan los GPO, sus componentes (GPC y GPT), y cómo permiten gestionar configuraciones de usuarios y equipos de forma centralizada."
categories:
  - "active-directory"
draft: false
featured: false
lang: "es"
---

Las GPO, esa característica del Directorio Activo que siempre mencionamos cuando hay alguna configuración o política que no entendemos y decimos: "será una GPO". En el artículo de hoy vamos a ver qué son y cómo funcionan.

## Índice
- [¿Qué son las políticas de grupo (GP)?](#qué-son-las-políticas-de-grupo-gp)
- [Política de directorio activo VS Política local](#política-de-directorio-activo-vs-política-local)
  - [Política de grupo local](#política-de-grupo-local)
  - [Política de grupo de directorio activo](#política-de-grupo-de-directorio-activo)
- [Objetos de Política de Grupo (GPO)](#objetos-de-política-de-grupo-gpo)
  - [Componentes de una GPO](#componentes-de-una-gpo)
    - [Group Policy Container (GPC)](#group-policy-container-gpc)
    - [Group Policy Template (GPT)](#group-policy-template-gpt)
    - [GPO, GPC y GPT](#gpo-gpc-y-gpt)
  - [Atributos de una GPO](#atributos-de-una-gpo)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

## ¿Qué son las políticas de grupo (GP)?

Las Políticas de Grupo (_Group Policy_) son un conjunto de herramientas que permiten a los administradores gestionar de manera centralizada las configuraciones de **cuentas de usuario** y **cuentas de ordenador** de un dominio de directorio activo. Su mayor potencial se alcanza en un directorio activo, pero los equipos Windows también disponen de políticas de grupo locales que usan el mismo motor de procesamiento.

Las políticas de grupo podemos también entenderlas como una especie de autoridad que ejecuta ciertas reglas. Si una política de grupo indica que ciertos usuarios deben de seguir cierta regla, esos usuarios deberán seguirla.

Por ejemplo, imagina que el jefe te dice:
- _Oye, necesito que me instales el Adobe Acrobat en todos los equipos del departamento de recursos humanos para que puedan abrir, rellenar y firmar PDFs. Porque claro, no vamos a darle privilegios de administrador para que lo hagan ellos solos._

Si el departamento son 25 personas, ponte tu a instalar uno por uno el programa en cada equipo, tardarías demasiado tiempo y al final no dejaría de ser una tarea muy repetitiva. Desde el punto de vista de la empresa esto tiene al final un coste operativo.

Pues las políticas de grupo solucionan este problema, permiten automatizar tareas repetitivas y comunes de administración. Estas tareas no se limitan al despliegue y gestión de software, sino que pueden englobar muchas más cosas como:
- Mapeo de unidades de red e impresoras
- Scripts de inicio y cierre de sesión
- Configuraciones de seguridad
- Ajustes del registro
- Gestión de energía y actualizaciones
- Redirección de carpetas
- Y mucho más

Entonces, si tuvieses que resumir lo que es una política de grupo, probablemente dirías que es una tecnología de gestión de configuración integrada en Windows y Active Directory que ayuda a crear planes estratégicos para mantener una postura sólida de seguridad en una organización ¿a que si? 😉.

Pero no es solo esto, también es un vehículo fantástico para el envío y distribución de _malware_. Aunque eso mejor lo dejaremos para otro día, primero vamos a entenderlo.

## Política de directorio activo VS Política local

Como he mencionado previamente en el inicio de la sección anterior, aunque el verdadero potencial y uso de las políticas de grupo suceden en un entorno de directorio activo, su existencia no se limita ni depende de ello.

### Política de grupo local

Todos los sistemas operativos Windows desde Windows XP tienen un grupo de ajustes de configuración que se acceden y estructuran de la misma manera que las políticas de grupo del directorio activo. Estos en este caso se conocen como política de grupo local (_local group policy_).

Estos ajustes se configuran por cada equipo y no existe forma centralizada de administrar varios equipos. Si estás desde un equipo Windows en este momento, puedes abrir la configuración de esta política de grupo local ejecutando `Win+R` y escribiendo `gpedit.msc`.

![Editor de políticas de grupo local gpedit.msc en Windows](https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-1.avif)

Desde esta ventana puedes establecer las configuraciones que quieras en tu equipo. Los cambios que hagas se aplican a todo el equipo, sin importar el usuario que haya iniciado sesión. Dependiendo del cambio, se puede requerir que se inicie o cierre sesión, o se reinicie el equipo.

### Política de grupo de directorio activo

La política de grupo de directorio activo básicamente habilita la disponibilidad de todas las configuraciones locales pero a nivel de dominio, es decir, todas las configuraciones que has podido ver en `gpedit.msc` en tu equipo las hace disponible a nivel de dominio para que cualquier equipo pueda consultarla y aplicarla (siempre que se le diga de hacerlo).

A nivel de interfaz prácticamente no hay diferencia entre la local y la de directorio activo. La única diferencia es una parte que permite fácilmente elegir a qué usuarios y equipos se le va a aplicar la política. Este filtrado lo veremos en el próximo artículo al hablar de la herencia y la precedencia.

![Consola de administración de políticas de grupo Group Policy Management en Active Directory](https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-2.avif)

![Editor de objetos de políticas de grupo Group Policy Editor en Active Directory](https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-3.avif)

## Objetos de Política de Grupo (GPO)

Siguiendo el principio de que en Directorio Activo todo es un objeto, los _Group Policy Objects_ (GPO) son objetos del directorio que encapsulan y almacenan las configuraciones de políticas de grupo. Son la representación a nivel de objeto de las políticas de grupo.

Cada GPO actúa como un contenedor independiente: tiene un nombre único, un GUID (identificador global único) y configuraciones personalizadas. En la práctica, el término "GPO" se usa indistintamente para referirse al objeto en sí o a las políticas que contiene. 

Para que las GPO se apliquen, deben vincularse a un objeto de tipo contenedor como:
- Dominio
- Sitio
- Unidad organizativa

Al realizar una vinculación a uno de estos objetos, se habrá creado un enlace entre la GPO y el contenedor, tras esto, la GPO se procesará en los objetos del contenedor según unas reglas de herencia y precedencia que veremos en el próximo artículo.

La vinculación queda reflejada en el atributo `gpLink`. Este es un atributo que existe en todos los objetos contenedores de un directorio activo. El valor que contienen son las rutas LDAP de las GPO que están vinculadas al contenedor. 

Por ejemplo, un valor de un atributo `gpLink` de un objeto contenedor podría ser:

```ldap
[LDAP://CN={A1B2C3D4-1111-2222-3333-ABCDEF123456},CN=Policies,CN=System,DC=sevenkingdoms,DC=local;0]
[LDAP://CN={B2C3D4E5-4444-5555-6666-123456ABCDEF},CN=Policies,CN=System,DC=sevenkingdoms,DC=local;2]
```

Este valor de ejemplo indica en el objeto contenedor:
- El orden en que la GPO se le aplica
- Qué GPO se le aplica
- Estado del vínculo

Complementando a este atributo también existe `gpOptions`, presente en los mismos objetos contenedores. Este atributo controla la herencia de políticas.

### Componentes de una GPO

Como se menciona en el artículo sobre [Directorio y esquema de Active Directory](https://blog.deephacking.tech/es/posts/directorio-y-esquema-de-active-directory/), todos los objetos del Directorio Activo se almacenan en la base de datos `NTDS.dit`. Sin embargo, las GPO usan un modelo híbrido: una parte reside en el directorio activo (como cualquier objeto) y la otra en la carpeta compartida `SYSVOL` para facilitar la replicación y el acceso distribuido por los clientes.

Estos dos lugares (`NTDS.dit` y `SYSVOL`) son los dos componentes principales de una GPO y se conocen como GPC y GPT, respectivamente:

#### Group Policy Container (GPC)

Cuando se crea una GPO, suceden dos cosas:

Por un lado, a la GPO se le crea un `GUID`, que en la mayoría de los casos es único; tan solo las GPO predeterminadas del dominio utilizan GUIDs bien conocidos (_well-known GUIDs_). No lo confundas con el GUID de `objectGUID` que poseen todos los objetos del AD.

![GUID de una GPO mostrado en sus propiedades](https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-4.avif)

Por otro lado, se crea un objeto de clase `groupPolicyContainer`. El objeto se crea utilizando el GUID como nombre. Este objeto que se crea es lo que se conoce como GPC. Se almacena bajo el siguiente contenedor:

```ldap
CN=Policies,CN=System,DC=tu-dominio,DC=com
```

![Vista de objetos GPC desde la consola Active Directory Users and Computers](https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-5.avif)

El GPC almacena metadatos e información general de la GPO:
- Nombre amigable (`displayName`)
- GUID único de la GPO (`name`)
- Permisos de seguridad (quién puede leer, editar o aplicar)
- Estado (habilitada o deshabilitada para equipo o usuario)
- Números de versión (`versionNumber`)

El GPC se replica mediante la replicación estándar de Active Directory. En resumen, es la parte de la GPO que vive en el Directorio Activo.


#### Group Policy Template (GPT)

Al crear una GPO, además de crearse lo que acabamos de mencionar también se crea una carpeta en `SYSVOL`:

```text
\\tu-dominio\SYSVOL\tu-dominio\Policies\{GUID-de-la-GPO}
```

![Estructura de carpetas de GPO almacenadas en SYSVOL](https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-6.avif)

Esta carpeta y su contenido forman el GPT. Aquí se almacenan la mayoría de las configuraciones reales de la GPO. Todo dependerá del tipo de política; por ejemplo, aquellas que necesitan aplicaciones, scripts o archivos, en lugar de guardar estos elementos en el `NTDS`, utilizarán la carpeta de `SYSVOL`.

Dentro de la carpeta de una GPO, podemos encontrar dos subcarpetas:
- `Machine` (configuraciones de equipo)
  - Aplican al sistema en general y afectan a todos los usuarios
- `User` (configuraciones de usuario)
  - Aplican a todos los perfiles de usuario que usen el equipo

Como se indica, estas carpetas contienen los archivos y configuraciones relacionadas con la configuración de equipo y configuración de usuario de la GPO.

![Subcarpetas Machine y User dentro de la estructura GPT en SYSVOL](https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-7.avif)

Otro archivo que podemos encontrar es `GPT.INI`. Este archivo contiene el número de versión combinado de la política de grupo (`Version`), que internamente representa tanto la versión de la configuración de usuario como la de equipo. Este valor coincide con el atributo `versionNumber` en el GPC (que también es un valor combinado de la misma forma).

Puedes encontrar que alguna herramienta desglose la versión en `userVersion` y `computerVersion`, pero en el archivo `GPT.INI` y en el GPC solo aparece como un valor único (`version` o `versionNumber`).

Cada modificación de la GPO incrementa estos valores en ambos componentes (GPC y GPT). Esto permite a los clientes detectar cambios:

1. Primero consultan la versión en el GPC del Directorio Activo
2. Si la versión es mayor que la almacenada localmente, descargan y procesan el GPT correspondiente para reaplicar la GPO

Este valor también sirve para verificar la sincronización entre GPC y GPT en los controladores de dominio.

![Contenido del archivo GPT.INI mostrando el número de versión de la GPO](https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-8.avif)

El GPT se replica mediante DFS-R (o FRS en versiones antiguas) a través de SYSVOL. 

#### GPO, GPC y GPT

En resumen:
- **GPO**: Es la política de grupo completa, la entidad lógica que se crea y gestiona desde la GPMC (_Group Policy Management Console_). Es la suma de GPC y GPT
- **GPC**: Es la parte de la GPO almacenada en el Directorio Activo
- **GPT**: Es la parte de la GPO almacenada en `SYSVOL`

Sin GPC no hay control, sin GPT no hay configuración, y sin ambos no hay GPO.

### Atributos de una GPO

Vamos a hablar de algunos atributos específicos que poseen las GPO en el Directorio Activo o, si queremos ser técnicamente correctos, las GPC:
- `displayName`: El nombre amigable de la GPO
- `name`: El GUID único funcional de la GPO (ej.: `{31B2F340-016D-11D2-945F-00C04FB984F9}`). Este es el identificador principal, usado como `CN` del objeto y para la carpeta en `SYSVOL`
- `versionNumber`: Número de versión combinado de la GPO. Ya sabes que es importante para detectar cambios y sincronización GPC-GPT
- `gPCFileSysPath`: Contiene la ruta UNC al GPT en `SYSVOL`: `\\dominio\SYSVOL\dominio\Policies\{GUID}`
- `gPCMachineExtensionNames` y `gPCUserExtensionNames`: Listas de GUIDs de `Client-Side Extensions (CSE)` necesarias para procesar configuraciones de equipo y usuario. Indican qué componentes del cliente deben activarse
- `flags`: Estado de la GPO. Si está o no habilitada, o si la configuración del usuario o del equipo está deshabilitada
- `gPCFunctionalityVersion`: Indica la versión del Group Policy Editor (GPE) que creó o modificó por última vez la GPO. Su valor es casi siempre 2 y sirve principalmente para compatibilidad hacia atrás
- `gPCWQLFilter`: Filtro WMI Query Language (WQL) para aplicar la GPO condicionalmente

![Atributos del objeto GPC visualizados en Active Directory](https://cdn.deephacking.tech/i/posts/introduccion-a-las-politicas-de-grupo-gpo-active-directory/introduccion-a-las-politicas-de-grupo-gpo-active-directory-9.avif)

## Conclusión

Hasta aquí esta pequeña introducción a las Políticas de Grupo. Este artículo pretende ser un primer acercamiento claro y ordenado a un tema tan amplio y profundo como son las GPO en Directorio Activo. Sirve como base para los próximos artículos, donde entraremos en detalle en el flujo completo de aplicación, el procesamiento en cliente, las reglas de herencia y precedencia, el filtrado y, por supuesto, cómo explotarlas de manera ofensiva.

## Referencias
- [Group Policy processing en Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-processing)
- [A Red Teamer's Guide to GPOs and OUs por wald0](https://wald0.com/?p=179)
- [Group policies in cyberattacks en Securelist](https://securelist.com/group-policies-in-cyberattacks/115331/)
- [Understanding Group Policy Storage en SDM Software](https://sdmsoftware.com/whitepapers/understanding-group-policy-storage/)
- [Sneaky Active Directory Persistence Tricks en ADSecurity](https://adsecurity.org/?p=2716)
- Libro _Mastering Windows Group Policy_ de Jordan Krause
- Libro _Mastering Active Directory_ de Dishan Francis