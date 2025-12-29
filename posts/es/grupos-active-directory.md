---
id: "grupos-active-directory"
title: "Tipos de Grupos en Active Directory"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-12-10
updatedDate: 2024-12-10
image: "https://cdn.deephacking.tech/i/posts/grupos-active-directory/grupos-active-directory-0.webp"
description: "Descubre los diferentes tipos de grupos en Active Directory, sus alcances, diferencias con las OUs y los grupos más importantes para la seguridad del dominio."
categories:
  - "active-directory"
draft: false
featured: false
lang: "es"
---

Ya llevamos un buen número de artículos de Active Directory, y esto es solo el principio. Hoy vamos a dar un paso más en este tema y vamos a hablar sobre los grupos. ¿Qué tipo de grupos podemos encontrar? ¿Qué tipo de alcance tienen? ¿En qué se diferencia un grupo de una unidad organizativa? ¿Qué grupos son más importantes?

Eso es lo que vamos a ver hoy. En el último artículo de Active Directory estuvimos viendo cómo se estructura la base de datos, te lo dejo por aquí:

- [Directorio y esquema de Active Directory](https://blog.deephacking.tech/es/posts/directorio-y-esquema-de-active-directory/)

Como ya sabemos como se estructura y donde se almacena la información, hoy vamos a ver uno de los objetos mas importantes, los grupos.

- [Tipos de grupos](#tipos-de-grupos)
    - [Grupos de seguridad](#grupos-de-seguridad)
    - [Grupos de distribución](#grupos-de-distribución)
    - [¿Cómo los diferencio?](#cómo-los-diferencio)
- [Alcance de los grupos](#alcance-de-los-grupos)
    - [Grupos Universales](#grupos-universales)
    - [Grupos Globales](#grupos-globales)
    - [Grupos Locales de Dominio](#grupos-locales-de-dominio)
- [Grupos vs Unidades Organizativas (OU)](#grupos-vs-unidades-organizativas-ou)
- [Grupos destacables que podemos encontrar dentro de AD](#grupos-destacables-que-podemos-encontrar-dentro-de-ad)
    - [Grupos administrativos](#grupos-administrativos)
    - [Protected Users](#protected-users)
        - [Protecciones en dispositivos](#protecciones-en-dispositivos)
        - [Protecciones en el controlador de dominio](#protecciones-en-el-controlador-de-dominio)
    - [Otros grupos importantes](#otros-grupos-importantes)
        - [DNSAdmins](#dnsadmins)
        - [Schema Admins](#schema-admins)
        - [Server Operators](#server-operators)
        - [Backup Operators](#backup-operators)
        - [Account Operators](#account-operators)
        - [Print Operators](#print-operators)
        - [Remote Desktop Users](#remote-desktop-users)
        - [Group Policy Creator Owners](#group-policy-creator-owners)
    - [Grupos personalizados](#grupos-personalizados)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

Hemos hecho mención a varios grupos existentes dentro de un entorno de Active Directory. Además de encontrar grupos únicos, existen varios grupos por defecto que se encuentran en todos los entornos. Vamos a ver varios de ellos y algunos tipos:

## Tipos de grupos

No creo que esté enseñando nada nuevo si digo que un grupo es una colección de usuarios, ordenadores u otros grupos que comparten las mismas características y responsabilidades. En una organización, constantemente se están eliminando usuarios, ordenadores o, por así decirlo, entidades individuales, pero por lo general los roles y responsabilidades no cambian mucho. Por esto mismo, de cara a gestionar los privilegios de una organización, lo mejor es basarse en roles y responsabilidades en lugar de individuos. Un ejemplo simple es que las personas de un departamento de una empresa pueden cambiar continuamente, pero los requisitos operativos no, todas ellas accederan a los mismos recursos. Los grupos en Active Directory facilitan exprésamente esto, permiten aislar identidades basándose en los requisitos de privilegios.

En un entorno de Active Directory podemos encontrar dos categorías de grupos:

- Grupos de seguridad (_Security groups_)
- Grupos de distribución (_Distribution groups_)

#### Grupos de seguridad

Los grupos de seguridad son utilizados para gestionar el acceso a los recursos de manera eficiente. Estos grupos permiten asignar [permisos](https://learn.microsoft.com/en-us/windows/security/identity-protection/access-control/access-control#permissions) y [derechos de usuario](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/user-rights-assignment) de forma centralizada, es decir, en lugar de otorgar accesos directamente a usuarios individuales, los permisos y derechos se asignan al grupo, y cualquier miembro hereda automáticamente dichas capacidades.

Es importante tener en cuenta que los permisos y los derechos de usuario, aunque sean conceptos relacionados, tienen propósitos diferentes:

- **Los derechos de usuario** determinan qué tareas generales puede realizar un usuario o grupo a nivel del sistema o dominio, como iniciar sesión de forma remota, realizar copias de seguridad o apagar un sistema. Estos derechos no están vinculados a recursos específicos, sino a acciones globales. Por ejemplo, un miembro del grupo "Backup Operators" tendrá el derecho de realizar copias de seguridad en los controladores de dominio.

- **Los permisos**, en cambio, controlan el acceso a recursos específicos, como carpetas, archivos o impresoras, y determinan qué acciones (como lectura, escritura o modificación) se pueden realizar sobre ellos. Por ejemplo, un usuario en un grupo con permisos de "lectura" sobre una carpeta podrá acceder a los archivos, pero no modificarlos ni eliminarlos.

En resumen se podría decir que los derechos de usuario aplican a cuentas de usuario mientras que los permisos están asociados con objetos. Sobre los derechos de usuarios se puede encontrar la lista en [la documentación de Microsoft sobre asignación de derechos de usuario](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/user-rights-assignment).

Los derechos de usuario son configurados principalmente a través de **Políticas de Grupo (Group Policy)** y aplican a nivel del sistema o dominio. Por otro lado, los permisos son definidos en las **Listas de Control de Acceso (ACLs)** y se aplican a nivel de cada recurso específico.

Por ejemplo, si un usuario necesita conectarse de forma remota a un servidor, primero deberá tener asignado el derecho de usuario **"Allow log on through Remote Desktop Services"**, que le permite iniciar sesión en el servidor. Sin embargo, una vez conectado, necesitará permisos específicos para acceder a los recursos del servidor, como carpetas, archivos o aplicaciones. Esto asegura que solo pueda interactuar con los recursos que le han sido autorizados, incluso si tiene derecho a iniciar sesión de manera remota.

En resumen, los grupos de seguridad no solo centralizan la gestión de permisos y derechos, sino que también garantizan un control sobre el acceso y las capacidades de los usuarios dentro del sistema. Casi cualquier grupo que te encuentres en Active Directory será un grupo de seguridad.

#### Grupos de distribución

Los grupos de distribución son aquellos usados para crear listas de distribución de correos. Este tipo de grupos se utilizan para enviar correos solo a un grupo definido de usuarios a través de una aplicación de correo como puede ser por ejemplo un servidor de Exchange. Estos grupos no están habilitados para seguridad, por lo que no se pueden usar para asignar permisos, es decir, no se pueden incluir en DACLs.

#### ¿Cómo los diferencio?

Ahora bien, si estás auditando un dominio, ¿cómo puedes saber si un grupo es de seguridad o de distribución?

Pues para ello en los objetos de grupo existe el atributo _[groupType](https://learn.microsoft.com/en-us/windows/win32/adschema/a-grouptype#remarks)_, este atributo puede ser cero o una combinación de uno o varios valores que se definen a continuación:

| Valor | Definición |
| --- | --- |
| 1 (0x00000001) | Especifica un grupo que es creado por el sistema. |
| 2 (0x00000002) | Especifica un grupo con alcance global. |
| 4 (0x00000004) | Especifica un grupo con alcance local en el dominio (_domain local scope_). |
| 8 (0x00000008) | Especifica un grupo con alcance universal (_universal scope_). |
| **16 (0x00000010)** | Especifica un grupo _APP\_BASIC_ para el Administrador de Autorización de Windows Server. |
| **32 (0x00000020)** | Especifica un grupo _APP\_QUERY_ para el Administrador de Autorización de Windows Server. |
| **2147483648 (0x80000000)** | Especifica un grupo de seguridad. Si este indicador no está establecido, el grupo es un grupo de distribución. |

Como vemos, el último valor de la tabla corresponde a la definición de si un objeto grupo es un grupo de seguridad. Además, otros valores que podemos observar que se definen en este atributo es el alcance, que es justamente de lo que vamos a hablar ahora.

## Alcance de los grupos

En Active Directory los grupos se clasifican según su alcance, el cual como acabamos de ver se declara en el atributo _groupType_ de los objetos _group_. Este atributo determina en qué contextos el grupo puede tener miembros y a qué recursos puede otorgar acceso. Existen tres tipos principales de grupos basados en su alcance:

> Nota: Cuando se menciona "dominio confiable", también se incluye intrínsecamente el bosque, ya que todos los dominios dentro de un bosque comparten una relación de confianza implícita y transitiva entre ellos.

#### Grupos Universales

| Alcance | Posibles miembros | Conversión de alcance | Dónde se le pueden asignar permisos | Posible miembro de |
| --- | --- | --- | --- | --- |
| Universal | Cuentas de usuario y equipos de cualquier dominio confiable (_[trusted side](https://blog.deephacking.tech/es/posts/confianzas-en-active-directory/#direcci%C3%B3n-de-la-confianza-trust-direction)_).      Grupos globales de cualquier dominio confiable (_[trusted side](https://blog.deephacking.tech/es/posts/confianzas-en-active-directory/#direcci%C3%B3n-de-la-confianza-trust-direction)_).      Otros grupos Universales de cualquier dominio en el mismo bosque. | Puede convertirse a alcance Local de Dominio si el grupo no es miembro de otro grupo Universal.      Puede convertirse a alcance Global si el grupo no contiene otros grupos Universales. | En cualquier dominio del mismo bosque o bosques confiables. | Otros grupos Universales en el mismo bosque.      Grupos Locales de Dominio en el mismo bosque o bosques confiables.      Grupos Locales en ordenadores dentro del mismo bosque o bosques confiables. |

Los grupos universales son útiles cuando se necesita otorgar acceso a recursos compartidos entre dominios o gestionar permisos de manera centralizada.

Por ejemplo, supongamos que los dominios _contoso.com_ y _fabrikam.com_ están en el mismo bosque. Podríamos crear un grupo universal que incluya usuarios de ambos dominios. Este grupo universal podría usarse para asignar permisos de acceso a una carpeta compartida que se encuentra en el dominio _contoso.com_, permitiendo a todos los miembros trabajar en los mismos recursos independientemente del dominio al que pertenezcan.

Además, los objetos de los grupos universales y su información se replican a todos los servidores de [catálogo global](https://blog.deephacking.tech/es/posts/directorio-y-esquema-de-active-directory/#global-catalog-gc) en el bosque, lo que garantiza que la información esté disponible en todos los dominios.

Podemos enumerar los grupos con alcance universal de la siguiente manera:

```powershell
PS C:\> Get-ADGroup -Filter {GroupScope -eq 'Universal'}

DistinguishedName : CN=Schema Admins,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : Universal
Name              : Schema Admins
ObjectClass       : group
ObjectGUID        : 34f36519-7649-494e-99b2-b370ad541eee
SamAccountName    : Schema Admins
SID               : S-1-5-21-2643224878-1147328777-3138214671-518

DistinguishedName : CN=Enterprise Admins,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : Universal
Name              : Enterprise Admins
ObjectClass       : group
ObjectGUID        : 60430ea5-c01a-410d-8316-58cce4d8bce4
SamAccountName    : Enterprise Admins
SID               : S-1-5-21-2643224878-1147328777-3138214671-519

DistinguishedName : CN=Enterprise Read-only Domain Controllers,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : Universal
Name              : Enterprise Read-only Domain Controllers
ObjectClass       : group
ObjectGUID        : 5e4ae0d1-6898-455e-a226-2b7ac60d6646
SamAccountName    : Enterprise Read-only Domain Controllers
SID               : S-1-5-21-2643224878-1147328777-3138214671-498

DistinguishedName : CN=Enterprise Key Admins,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : Universal
Name              : Enterprise Key Admins
ObjectClass       : group
ObjectGUID        : 0529e3d3-b7c3-43cb-864e-36bc134131c2
SamAccountName    : Enterprise Key Admins
SID               : S-1-5-21-2643224878-1147328777-3138214671-527

PS C:\>
```

Por ejemplo, los miembros de Enterprise Admins tienen privilegios administrativos en todos los dominios del bosque, por ello, es un grupo universal.

> Si te das cuenta, en la salida de este comando no podemos visualizar el atributo groupType, en su lugar, vemos GroupCategory y GroupScope. Esto es simplemente porque el módulo Active Directory de PowerShell descompone el atributo groupType para que sea mas comprensible.

Si hiciéramos la consulta usando ldapsearch si podemos visualizar el atributo groupType:

```bash
ldapsearch -x -H ldap://192.168.10.128 -D "robb.stark@north.sevenkingdoms.local" -w "sexywolfy" -b "dc=north,dc=sevenkingdoms,dc=local" "(objectClass=group)" cn groupType
```

![Consulta LDAP mostrando el atributo groupType de grupos en Active Directory](https://cdn.deephacking.tech/i/posts/grupos-active-directory/grupos-active-directory-1.avif)

Si te fijas, el valor aparece en negativo, esto es porque el bit más significativo del entero que representa el **groupType** está activado para indicar que se trata de un grupo de seguridad. Creo que con la siguiente imagen quedará bastante claro:

![Explicación visual del entero con signo en el atributo groupType de Active Directory](https://cdn.deephacking.tech/i/posts/grupos-active-directory/grupos-active-directory-2.avif)

#### Grupos Globales

| Alcance | Posibles miembros | Conversión de alcance | Dónde se le pueden asignar permisos | Posible miembro de |
| --- | --- | --- | --- | --- |
| Global | Cuentas de usuario y equipos del mismo dominio.      Otros grupos Globales del mismo dominio. | Puede convertirse a alcance Universal si el grupo no es miembro de otro grupo Global. | En cualquier dominio del mismo bosque o bosques confiables. | Grupos Universales de cualquier dominio en el mismo bosque.      Otros grupos Globales del mismo dominio.      Grupos Locales de Dominio de cualquier dominio en el mismo bosque o dominios confiables. |

Los grupos globales son ideales para agrupar usuarios con funciones y responsabilidades similares dentro de un dominio, y luego utilizar ese grupo para otorgar acceso a recursos en otros dominios.

Por ejemplo, supongamos que en el dominio _contoso.com_ existe un conjunto de usuarios que necesitan acceder a un recurso alojado en otro dominio del mismo bosque, por ejemplo, _fabrikam.com_. Podríamos crear un grupo global en _contoso.com_ que incluya a estos usuarios. Este grupo global podría utilizarse para asignar permisos de acceso al recurso en _fabrikam.com_, permitiendo a todos sus miembros utilizarlo sin necesidad de asignar permisos uno a uno.

Los objetos de los grupos globales y su información se replican a todos los controladores de dominio dentro del mismo dominio. Aunque sus miembros estén limitados a un único dominio, los permisos pueden aplicarse en todo el bosque, lo que es útil para asignar privilegios específicos a recursos en otros dominios.

Podemos obtener una lista de grupos globales con el siguiente comando:

```powershell
PS C:\> Get-ADGroup -Filter {GroupScope -eq 'Global'}

DistinguishedName : CN=Domain Computers,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : Global
Name              : Domain Computers
ObjectClass       : group
ObjectGUID        : afdaa8f4-28f1-4f2d-b354-f2bbcf6a4100
SamAccountName    : Domain Computers
SID               : S-1-5-21-2643224878-1147328777-3138214671-515

DistinguishedName : CN=Domain Controllers,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : Global
Name              : Domain Controllers
ObjectClass       : group
ObjectGUID        : c688dc5f-9b64-4233-adb7-4de60fe7808d
SamAccountName    : Domain Controllers
SID               : S-1-5-21-2643224878-1147328777-3138214671-516

DistinguishedName : CN=Domain Admins,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : Global
Name              : Domain Admins
ObjectClass       : group
ObjectGUID        : 2106add7-5215-4451-a225-92e8f9682940
SamAccountName    : Domain Admins
SID               : S-1-5-21-2643224878-1147328777-3138214671-512

DistinguishedName : CN=Domain Users,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : Global
Name              : Domain Users
ObjectClass       : group
ObjectGUID        : eb99945b-3c3e-45bb-add4-3e2aac40677f
SamAccountName    : Domain Users
SID               : S-1-5-21-2643224878-1147328777-3138214671-513

...
```

El grupo Domain Admins, que otorga permisos administrativos en un dominio específico, es un grupo global. Aunque solo tiene miembros de su propio dominio, puede ser utilizado para gestionar recursos en todo el bosque.

#### Grupos Locales de Dominio

| Alcance | Posibles miembros | Conversión de alcance | Dónde se le pueden asignar permisos | Posible miembro de |
| --- | --- | --- | --- | --- |
| Local de Dominio | Cuentas de usuario y equipos de cualquier dominio confiable (_[trusted side](https://blog.deephacking.tech/es/posts/confianzas-en-active-directory/#direcci%C3%B3n-de-la-confianza-trust-direction)_).      Grupos globales de cualquier dominio confiable (_[trusted side](https://blog.deephacking.tech/es/posts/confianzas-en-active-directory/#direcci%C3%B3n-de-la-confianza-trust-direction)_).      Grupos Universales de cualquier dominio en el mismo bosque.      Otros grupos Locales de Dominio del mismo dominio.      Cuentas, grupos Globales y Universales de otros bosques y dominios externos. | Puede convertirse a alcance Universal si el grupo no contiene otros grupos Locales de Dominio. | Dentro del mismo dominio. | Otros grupos Locales de Dominio del mismo dominio.      Grupos Locales en ordenadores dentro del mismo dominio, excluyendo los grupos integrados que tienen identificadores de seguridad conocidos (Well-Known SIDs). |

Estos grupos son útiles para controlar el acceso a recursos específicos dentro de un dominio, sin extenderse a otros dominios.

Por ejemplo, supongamos que en el dominio _contoso.com_ existe una carpeta compartida que contiene información sensible a la que solo deben acceder ciertos usuarios. Podríamos crear un grupo local de dominio en _contoso.com_ y agregar en él a los grupos globales o usuarios específicos que necesiten ese acceso. Este grupo local serviría para asignar permisos sobre la carpeta compartida, asegurando que únicamente los miembros autorizados puedan acceder a la información, sin extender estos permisos fuera del dominio _contoso.com_.

La estructura de los grupos locales de dominio se replica en todos los controladores de dominio del mismo dominio, lo que asegura que la información de acceso a los recursos esté disponible en todos los servidores del dominio.

Podemos obtener todos los grupos locales del dominio actual con el siguiente comando:

```powershell
PS C:\> Get-ADGroup -Filter {GroupScope -eq 'DomainLocal'}

DistinguishedName : CN=Cert Publishers,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : DomainLocal
Name              : Cert Publishers
ObjectClass       : group
ObjectGUID        : ad2b04e9-92dd-40c7-a913-b2b59cb36ca4
SamAccountName    : Cert Publishers
SID               : S-1-5-21-2643224878-1147328777-3138214671-517

DistinguishedName : CN=RAS and IAS Servers,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : DomainLocal
Name              : RAS and IAS Servers
ObjectClass       : group
ObjectGUID        : d38fb4d7-8eff-4f77-9130-458913f7c892
SamAccountName    : RAS and IAS Servers
SID               : S-1-5-21-2643224878-1147328777-3138214671-553

DistinguishedName : CN=Allowed RODC Password Replication Group,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : DomainLocal
Name              : Allowed RODC Password Replication Group
ObjectClass       : group
ObjectGUID        : 862213eb-7960-4b88-a7f7-1465d222b331
SamAccountName    : Allowed RODC Password Replication Group
SID               : S-1-5-21-2643224878-1147328777-3138214671-571

DistinguishedName : CN=Denied RODC Password Replication Group,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : DomainLocal
Name              : Denied RODC Password Replication Group
ObjectClass       : group
ObjectGUID        : 3828c98e-f9bf-434e-8fdb-71d4982f625e
SamAccountName    : Denied RODC Password Replication Group
SID               : S-1-5-21-2643224878-1147328777-3138214671-572

DistinguishedName : CN=DnsAdmins,CN=Users,DC=sevenkingdoms,DC=local
GroupCategory     : Security
GroupScope        : DomainLocal
Name              : DnsAdmins
ObjectClass       : group
ObjectGUID        : d9215dee-9a02-4d45-84b4-491da681af34
SamAccountName    : DnsAdmins
SID               : S-1-5-21-2643224878-1147328777-3138214671-1102

...
```

Por ejemplo, el grupo Administrators en un dominio es un grupo local de dominio. Aunque puede tener miembros de otros dominios, solo otorga acceso a los recursos del propio dominio.

## Grupos vs Unidades Organizativas (OU)

Tanto los grupos como las unidades organizativas son bastante parecidos, ambos se pueden usar para agrupar objetos. Asímismo ambos también se pueden usar con políticas de grupo. Sin embargo, existen algunas sutiles diferencias entre ambos:

| Característica | Grupos de Active Directory | Unidades Organizativas (OUs) |
| --- | --- | --- |
| Estructura jerárquica | Estructura plana. Un grupo puede tener diferentes tipos de objetos (usuarios, dispositivos, grupos) como miembros, pero no pueden representarse en un orden jerárquico. | Pueden usar diferentes modelos para organizar las OUs en un orden jerárquico (como una estructura de árbol). También pueden cambiar la estructura fácilmente cuando sea necesario. |
| Ubicación de objetos | Un objeto puede ser parte de muchos grupos diferentes. | Un objeto solo puede pertenecer a una OU a la vez. |
| Listas de Control de Acceso (ACLs) | Los grupos pueden ser añadidos a las ACLs. | Las OUs no pueden formar parte de las ACLs. |
| Valor de [Identificador de Seguridad (SID)](https://blog.deephacking.tech/es/posts/security-identifiers/) | Tienen un valor de SID. | No tienen un valor de SID. |

Por estas razones aunque a primera vista los grupos y las OUs puedan tener funcionalidades parecidas, el propósito de cada uno es distinto. Por ejemplo, para gestionar permisos de recursos lo mas adecuado es hacer uso de grupos, mientras que las OUs son mucho mejores para agrupar objetos en un orden jerárquico y delegar control, es decir, permitir que un administrador gestiona solo una parte de Active Directory sin que afecte al resto.

## Grupos destacables que podemos encontrar dentro de AD

A continuación vamos a ver varios grupos predefinidos (built-in) que podemos encontrar en un entorno de active directory:

#### Grupos administrativos

En Active Directory existen varios [grupos predeterminados](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-groups#default-security-groups) que tienen funciones administrativas. Los dos mas famosos son:

- Domain Admins: Los miembros de este grupo tienen privilegios administrativos en todo el dominio. De forma predeterminada, este grupo también se incluye en el grupo Administrators del dominio, así como al grupo Administrators de los equipos del dominio.

- Enterprise Admins: Este grupo proporciona privilegios administrativos en todo el bosque y se encuentra únicamente en el dominio raíz del bosque. Sin embargo, de manera predeterminada, se añade al grupo Administrators de todos los dominios en el bosque.

#### Protected Users

El grupo **Protected Users** fue introducido con **Windows Server 2012 R2** y fue desarrollado para proporcionar a las cuentas con privilegios elevados una mejor protección frente a los ataques de robo de credenciales. Los miembros de este grupo tienen una protección no configurable aplicada. Para hacer uso de este grupo, el controlador de dominio primario (**Primary Domain Controller - PDC**) debe estar ejecutándose como mínimo en **Windows Server 2012 R2**, y los ordenadores cliente deben usar al menos **Windows 8.1** o **Windows Server 2012 R2**.

Este grupo, como se ha mencionado, está diseñado para proteger las cuentas de sus miembros contra ataques que intentan robar credenciales, como el **NTLM relay** y la delegación de Kerberos. Cuando un usuario se añade al grupo **Protected Users**, se aplican automáticamente una serie de medidas de seguridad que no pueden ser configuradas manualmente y que se activan en cuanto el usuario inicia sesión, estas medidas se pueden dividir en dos:

##### Protecciones en dispositivos

Si un usuario perteneciente a este grupo inicia sesión en un ordenador del dominio (Windows 8.1, Windows Server 2012 R2, Windows 10, Windows Server 2016, Windows Server 2019, Windows Server 2022 o posteriores), automáticamente se le aplicarán a ese ordenador las siguientes restricciones:

- **CredSSP no almacena las credenciales del usuario en texto plano.** Incluso si se habilita la política de grupo **Allow delegating default credentials**, estas no serán almacenadas.
- En **Windows 8.1** y versiones posteriores (incluyendo Windows Server 2012 R2 y posteriores), **Windows Digest no almacena credenciales en texto plano**, incluso si está habilitado.
- **NTLM detiene el almacenamiento de credenciales en texto plano** o el uso de la función NT one-way (NTOWF).
- **Kerberos no utiliza cifrados obsoletos como DES o RC4** y tampoco almacena credenciales o claves de largo plazo después de obtener el TGT inicial.
- El sistema **no crea un verificador en caché** (_hashes DCC2_) al iniciar sesión o desbloquear el dispositivo, por lo que los miembros ya no podrán iniciar sesión de manera offline.

##### Protecciones en el controlador de dominio

Además de las medidas aplicadas directamente en los dispositivos de los usuarios, el grupo Protected Users también establece importantes restricciones en los controladores de dominio, que aplican cuando un miembro del grupo se autentica en un dominio con nivel funcional de Windows Server 2012 R2 o posterior. Estas restricciones incluyen las siguientes:

- Autenticarse con NTLM: Solo podrán utilizar Kerberos para autenticarse.
- Usar cifrados antiguos como DES o RC4 en la preautenticación de Kerberos.
- Delegación con Unconstrained o Constrained Delegation: La cuenta no puede ser usada para delegación, ya sea restringida o no restringida.
- Renovar los tickets de Kerberos más allá de las primeras cuatro horas: Los TGTs (Ticket Granting Tickets) normalmente tienen una vida útil de 10 horas (600 minutos). Sin embargo, los miembros de Protected Users no pueden renovar sus tickets automáticamente después de las primeras 4 horas. Esto significa que, aunque el ticket inicial dure hasta 10 horas, deberán autenticarse de nuevo una vez pasadas esas 4 horas.

#### Otros grupos importantes

Además de los grupos administrativos o el grupo _Protected Users_, existen otros grupos predefinidos (_built-in_) que otorgan a sus miembros privilegios específicos dentro del dominio:

##### DNSAdmins

Los miembros del grupo **[DNSAdmins](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#bkmk-dnsadmins)** tienen permisos para administrar los servidores DNS del dominio. Dado que en la mayoría de ocasiones los controladores de dominio (DC) actúan como servidores DNS, los miembros de este grupo pueden cargar DLL personalizadas que se ejecutan con privilegios del sistema (**SYSTEM**) en los controladores de dominio, lo que lleva al compromiso completo del dominio.

En entornos donde el servicio DNS se ejecuta en servidores separados o externos al dominio, este riesgo se reduce, ya que el control sobre el DNS no implica acceso directo a los DC. Sin embargo, es importante tener en cuenta que los miembros de **DNSAdmins** aún pueden afectar la resolución de nombres y, por ende, la conectividad en la red.

##### Schema Admins

Los [Schema Admins](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#schema-admins) tienen permiso para modificar el esquema de Active Directory, lo cual es algo que no se realiza con frecuencia. Estos cambios son muy delicados, ya que afectan cómo se estructuran y manejan los datos en todo el directorio. Si un cambio en el esquema no se gestiona adecuadamente, puede tener un impacto significativo en la disponibilidad y funcionamiento del dominio, o incluso provocar problemas en la integridad de los datos. Básicamente, si se hacen cambios incorrectos en el esquema, se corre el riesgo de desestabilizar todo el entorno de Active Directory.

Por defecto, este grupo suele estar vacío y se recomienda agregar usuarios solo temporalmente cuando se requiera realizar modificaciones específicas en el esquema.

##### Server Operators

Los [Server Operators](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#server-operators) tienen privilegios para gestionar la configuración de los controladores de dominio, lo que incluye tareas como iniciar o detener servicios y modificar configuraciones críticas. Además, tienen permisos para **iniciar sesión localmente** en los controladores de dominio, lo que significa que pueden acceder directamente al servidor, ya sea físicamente o mediante protocolos como **RDP (Remote Desktop Protocol)** o **WinRM (Windows Remote Management)**.

##### Backup Operators

Los [Backup Operators](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#backup-operators) tienen permisos para realizar copias de seguridad y restaurar archivos en los controladores de dominio. También pueden iniciar sesión localmente en los DC, similar a los **Server Operators**. Esto significa que pueden acceder a los datos sensibles almacenados en el controlador de dominio, como por ejemplo el NTDS o la SAM.

##### Account Operators

Los [Account Operators](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#bkmk-accountoperators) pueden crear, modificar y eliminar cuentas de usuario y grupos en el dominio, así como gestionar la membresía de usuarios en muchos grupos. Sin embargo, no pueden modificar cuentas que son miembros de grupos protegidos, como **Domain Admins**, **Administrators**, **Schema Admins** y otros grupos administrativos.

Los **grupos protegidos** están sujetos a la protección de **[AdminSDHolder](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/appendix-c--protected-accounts-and-groups-in-active-directory#adminsdholder)**, un objeto especial en Active Directory que aplica automáticamente permisos predefinidos a estas cuentas mediante el proceso **SDProp**, ejecutado cada 60 minutos. Esto asegura que sus configuraciones de seguridad permanezcan intactas y no puedan ser alteradas sin autorización. Para identificar si un grupo o cuenta está protegido, puedes revisar el atributo adminCount: si su valor es 1, significa que está bajo la protección de AdminSDHolder.

Aunque los **Account Operators** no pueden alterar directamente estos grupos, aún pueden gestionar otros grupos como **Server Operators**.

##### Print Operators

Los [Print Operators](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#print-operators) tienen permisos para administrar las impresoras del dominio y también pueden **iniciar sesión localmente** en los controladores de dominio. Esto significa que pueden acceder al DC mediante **RDP**, **WinRM** o físicamente. Aunque su función principal es gestionar servicios de impresión, el hecho de que puedan iniciar sesión en un DC les otorga la capacidad de interactuar directamente con el sistema.

##### Remote Desktop Users

El grupo **[Remote Desktop Users](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#bkmk-remotedesktopusers)** permite a sus miembros conectarse a equipos a través de **RDP** de forma gráfica. Para que un usuario de dominio pueda acceder remotamente a un equipo específico, deben cumplirse varios requisitos:

1. El equipo debe tener habilitado el acceso por **Escritorio Remoto**:
    - **Configuración Manual:**
        - En cada equipo, ve a las propiedades del sistema y, en la pestaña **"Acceso remoto"**, selecciona **"Permitir las conexiones remotas a este equipo"**.
    - **Configuración Automática mediante Política de Grupo:**
        - En un entorno de dominio, puedes automatizar este proceso utilizando una **Política de Grupo**. Al configurar una GPO que habilite el Escritorio Remoto, puedes aplicar esta configuración a múltiples equipos simultáneamente.
2. El usuario debe ser miembro del grupo Remote Desktop Users local en el equipo al que se quiera conectar por RDP.
    - **Membresía en el Grupo Local:**
        - La pertenencia al grupo **Remote Desktop Users** a nivel de dominio **no es suficiente** por sí sola. El usuario debe ser añadido al grupo **Remote Desktop Users** **local** en cada equipo al que necesita acceder. De la misma manera, es suficiente con pertenecer de manera local al grupo sin pertenecer a nivel de dominio.
    - **Automatización de añadir miembros al grupo de manera local:**
        - Puedes utilizar **Preferencias de Política de Grupo** para agregar usuarios o grupos de dominio al grupo **Remote Desktop Users** local en múltiples equipos.
        - **Por ejemplo**, puedes crear una **GPO** que agregue un usuario o grupo de dominio específico al grupo **Remote Desktop Users** local en todos los equipos a los que se aplique la política.
3. El usuario debe tener el permiso "Iniciar sesión a través de Servicios de Escritorio Remoto" en las políticas de seguridad locales.
    - **Asignación de Derechos de Usuario:**
        - Este permiso se encuentra en las **Políticas de Seguridad Local** bajo **Configuración de Seguridad > Políticas Locales > Asignación de Derechos de Usuario**.
        - Por defecto, este derecho está asignado a los grupos **Administradores** y **Remote Desktop Users**.
    - **Configuración mediante Política de Grupo:**
        - En un entorno de dominio, este permiso se puede configurar a través de una GPO para garantizar que los usuarios o grupos necesarios tengan este derecho.

##### Group Policy Creator Owners

Los miembros del grupo **[Group Policy Creator Owners](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups#group-policy-creator-owners)** pueden crear y modificar **Políticas de Grupo (GPOs)** dentro del dominio. Sin embargo, su capacidad para editar GPO existentes está limitada a aquellas que ellos mismos han creado. No pueden modificar GPO creadas por otros administradores a menos que se les otorguen permisos explícitos.

A pesar de esta restricción, el poder de crear nuevas GPO y aplicarlas a unidades organizativas (OUs) puede tener un impacto significativo en el dominio.

#### Grupos personalizados

Además de los grupos predeterminados, muchas organizaciones crean grupos personalizados para gestionar roles específicos dentro de la empresa. Estos grupos permiten una gestión más flexible y adaptada a las necesidades internas.

Por otro lado, algunos programas también añaden sus propios grupos. Un ejemplo común es Microsoft Exchange, que crea grupos como [Exchange Windows Permissions](https://learn.microsoft.com/en-us/exchange/permissions/split-permissions/configure-exchange-for-shared-permissions?view=exchserver-2019), otorgando permisos especiales necesarios para el funcionamiento y administración del software.

Una conclusión interesante es que, al visualizar los grupos existentes en un entorno, se puede identificar la presencia de ciertos programas o soluciones implementadas en la organización, como Exchange o cualquier otro software que haya creado sus propios grupos.

## Conclusión

Como has podido ver, los grupos son mucho mas que simple colecciones de usuarios y otros objetos, pueden llegar a dar mucho juego y su papel es primordial en un entorno de directorio activo, tanto desde el punto de vista ofensivo como defensivo.

Si te ha gustado el artículo se agradece un montón que lo compartas por redes y nos menciones <3.

## Referencias

- [Attacking Active Directory: 0 to 0.9 - Eloy Pérez González](https://zer1t0.gitlab.io/posts/attacking_ad/)
- [Active Directory groups - ManageEngine](https://www.manageengine.com/products/active-directory-audit/kb/what-is/active-directory-group.html)
- [Mastering Active Directory, Third Edition: Design, deploy, and protect Active Directory Domain Services for Windows Server 2022, Third Edition](https://www.packtpub.com/en-us/product/mastering-active-directory-third-edition-9781801070393)
- [User rights - Microsoft](https://learn.microsoft.com/en-us/windows/security/identity-protection/access-control/access-control#user-rights)
- [Permissions - Microsoft](https://learn.microsoft.com/en-us/windows/security/identity-protection/access-control/access-control#permissions)
- [User Rights Assignment - Microsoft](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/user-rights-assignment)
- [Active Directory security groups - Microsoft](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-groups)
- [Protected Users Security Group - Microsoft](https://learn.microsoft.com/en-us/windows-server/security/credentials-protection-and-management/protected-users-security-group)
