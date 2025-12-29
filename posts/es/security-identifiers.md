---
id: "security-identifiers"
title: "Qué son los Security Identifiers (SIDs)"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-11-19
updatedDate: 2024-11-19
image: "https://cdn.deephacking.tech/i/posts/security-identifiers/security-identifiers-0.webp"
description: "Descubre qué son los Security Identifiers (SIDs) en Windows, su estructura, tipos y cómo se utilizan en el sistema de seguridad para identificar usuarios, grupos y sesiones."
categories:
  - "active-directory"
  - "windows"
draft: false
featured: false
lang: "es"
---

En el artículo de hoy vamos a ver un concepto que se repite mucho cuando lees sobre Windows. ¿Estás leyendo sobre _Security Descriptors_? Probablemente se mencione el SID. ¿Estás leyendo sobre _Access Tokens_? Pues seguramente ocurra lo mismo. Por ello, vamos a ver de qué se trata en el artículo de hoy.

- [Security identifiers](#security-identifiers)
- [Estructura de un SID](#estructura-de-un-sid)
- [Well-known SIDs](#well-known-sids)
- [Relative Identifiers (RIDs)](#relative-identifiers-rids)
- [Logon SIDs](#logon-sids)
- [Conversión entre nombres y SIDs](#conversión-entre-nombres-y-sids)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

## Security identifiers

Los Security Identifiers (SIDs) son identificadores de seguridad únicos que utiliza el sistema operativo Windows para identificar a cualquier [principal de seguridad (_Security Principal_)](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-principals) o grupo de seguridad (_Security Group_). Un principal de seguridad puede representar a cualquier entidad autenticada por el sistema operativo, como una cuenta de usuario, una cuenta de equipo o incluso un hilo o proceso que se ejecute en el contexto de seguridad de una cuenta.

Sin embargo, los principales de seguridad no se limitan a estas entidades. También incluyen otras que pueden actuar como sujetos de autorización o autenticación, como los dominios en un entorno de Active Directory, los cuales también tienen su propio SID único.

Windows utiliza SIDs en lugar de nombres (que pueden cambiar o no ser únicos) para garantizar una identificación consistente y segura de estas entidades. Los SIDs son fundamentales en el modelo de seguridad de Windows y se emplean en componentes clave de autorización y control de acceso.

Podemos visualizar los SIDs asociados a una cuenta de usuario y sus grupos mediante el comando whoami /all. Por ejemplo:

```powershell
PS C:\Users\MALDEV01> whoami /all

USER INFORMATION
----------------

User Name                SID
======================== ============================================
desktop-c9ak2kc\maldev01 S-1-5-21-422339986-568025100-1833951960-1001

GROUP INFORMATION
-----------------

Group Name                                                    Type             SID          Attributes
============================================================= ================ ============ ==================================================
Everyone                                                      Well-known group S-1-1-0      Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Local account and member of Administrators group Well-known group S-1-5-114    Group used for deny only
BUILTIN\Administrators                                        Alias            S-1-5-32-544 Group used for deny only
BUILTIN\Performance Log Users                                 Alias            S-1-5-32-559 Mandatory group, Enabled by default, Enabled group
BUILTIN\Users                                                 Alias            S-1-5-32-545 Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\INTERACTIVE                                      Well-known group S-1-5-4      Mandatory group, Enabled by default, Enabled group
CONSOLE LOGON                                                 Well-known group S-1-2-1      Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Authenticated Users                              Well-known group S-1-5-11     Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\This Organization                                Well-known group S-1-5-15     Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Local account                                    Well-known group S-1-5-113    Mandatory group, Enabled by default, Enabled group
LOCAL                                                         Well-known group S-1-2-0      Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\NTLM Authentication                              Well-known group S-1-5-64-10  Mandatory group, Enabled by default, Enabled group
Mandatory Label\Medium Mandatory Level                        Label            S-1-16-8192

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                          State
============================= ==================================== ========
SeShutdownPrivilege           Shut down the system                 Disabled
SeChangeNotifyPrivilege       Bypass traverse checking             Enabled
SeUndockPrivilege             Remove computer from docking station Disabled
SeIncreaseWorkingSetPrivilege Increase a process working set       Disabled
SeTimeZonePrivilege           Change the time zone                 Disabled

PS C:\Users\MALDEV01> 
```

Cuando se crea una cuenta o grupo en Windows, el sistema operativo genera un SID único para identificarlo. Esto se aplica tanto a cuentas y grupos locales como a aquellos en un entorno de dominio. Los SIDs son únicos dentro de su ámbito (local o dominio) y **nunca se reutilizan**, incluso si la cuenta o grupo es eliminado. Esto garantiza que cada SID se corresponda siempre con una única entidad de seguridad.

El SID de las cuentas y grupos locales es generado por la **Autoridad de Seguridad Local (LSA)** del equipo y se almacena en un área segura del registro. Por otro lado, el SID de cuentas y grupos del dominio es generado por la **autoridad de seguridad del dominio**, en otras palabras, los **controladores de dominio**. En este último caso, el SID se almacena en el atributo **ObjectSID** del objeto de tipo _User_ o _Group_ en ADDS (Active Directory Domain Services)

## Estructura de un SID

Vale, ahora que conocemos el concepto y definición de SID vamos a ver su estructura.

Un SID es una estructura de datos en formato binario que contiene varios componentes. La estructura general de un SID es la siguiente:

```cpp
typedef struct _SID {
  BYTE                     Revision;
  BYTE                     SubAuthorityCount;
  SID_IDENTIFIER_AUTHORITY IdentifierAuthority;
  DWORD                    SubAuthority[ANYSIZE_ARRAY];
} SID, *PISID;
```

Los componentes de un SID son:

1. **Revision**: Indica la versión de la estructura del SID (normalmente es 1).

3. **SubAuthorityCount**: Número de elementos en el array SubAuthority.

5. **[IdentifierAuthority](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-dtyp/c6ce4275-3d90-4890-ab3a-514745e4637e)**: Un valor de 48 bits (6 bytes) que identifica a la autoridad emisora del SID. Algunos valores comunes son:
    - **0**: Null Authority (_NULL\_SID\_AUTHORITY_)
    - **1**: World Authority (_WORLD\_SID\_AUTHORITY_)
    - **2**: Local Authority (_LOCAL\_SID\_AUTHORITY_)
    - **5**: NT Authority (_SECURITY\_NT\_AUTHORITY_)
7. **SubAuthority**: Una serie de valores que identifican jerárquicamente al sujeto dentro de la autoridad emisora. Se dividen en:
    - **Domain Identifier**: Las primeras subautoridades suelen identificar al dominio o equipo.
    - **Relative Identifier (RID)**: La última subautoridad identifica de forma única a la cuenta o grupo dentro del dominio o equipo.

Los componentes de los SIDs se pueden visualizar de forma mucho más sencilla cuando se convierten de formato binario a texto. Para ello, se utiliza el Lenguaje de Definición de Descriptores de Seguridad (SDDL), aunque en este caso, únicamente lo emplearemos para representar el SID y no un descriptor de seguridad completo, eso mejor para otro artículo. Entonces, un SID en formato texto se ve de la siguiente manera:

```
S-Revision-IdentifierAuthority-SubAuthority1-SubAuthority2-...-SubAuthorityn
```

Por ejemplo:

```
S-1-5-21-422339986-568025100-1833951960-1001
```

- **S**: Indica que es un SID.
- **1**: Número de revisión.
- **5**: Identificador de autoridad (NT Authority).
- **21**: **SubAuthority** fija que indica que el SID es relativo a un **dominio o equipo**.
- **422339986-568025100-1833951960**: Estos tres números, junto con el **21**, forman el **SID base** que identifica de manera única al dominio o equipo. Cada uno de estos números corresponde a un valor de 32 bits generados aleatoriamente.
- **1001**: **Relative Identifier (RID)** que identifica de manera única a la cuenta o grupo dentro del dominio o equipo (hablaremos del RID ahora).

## Well-known SIDs

Existen SIDs predefinidos, conocidos como **Well-known SIDs**, que representan a los también llamados **Well-known Security Principals**, que son principales de seguridad (cuentas y grupos genéricos) presentes en todos los sistemas Windows. Estos SIDs tienen valores constantes en todos los sistemas y dominios, lo que facilita la administración y configuración de seguridad. Algunos ejemplos son:

- **S-1-1-0**: **Everyone** (Grupo que incluye a todos los usuarios, excepto anónimos).
- **S-1-5-32-544**: **Administrators** (Grupo de administradores local).
- **S-1-5-32-545**: **Users** (Grupo de usuarios local).
- **S-1-5-18**: **Local System** (Cuenta del sistema local).
- **S-1-5-19**: **Local Service** (Cuenta de servicio local).
- **S-1-5-20**: **Network Service** (Cuenta de servicio de red).

Estos SIDs son utilizados por el sistema operativo y aplicaciones para aplicar permisos y políticas de seguridad de manera consistente. Podemos encontrar mas ejemplos en el siguiente enlace:

- [Well-known Security Identifiers (SIDs) - EventSentry](https://system32.eventsentry.com/codes/field/Well-known%20Security%20Identifiers%20\(SIDs\))

## Relative Identifiers (RIDs)

Los RIDs son valores que se agregan al final del SID base para crear un SID único para cada cuenta o grupo. En entornos locales, los RIDs para cuentas de usuario y grupos suelen comenzar en **1000** y aumentan secuencialmente a medida que se crean nuevas cuentas.

Para cuentas especiales, se utilizan RIDs predefinidos:

- **500**: **Administrator** (cuenta de administrador predeterminada).
- **501**: **Guest** (cuenta de invitado predeterminada).
- **512**: **Domain Admins** (grupo de administradores del dominio).
- **513**: **Enterprise Admins** (grupo de administradores de empresas)

En un dominio, la asignación de RIDs es gestionada por un rol especial llamado **RID Master** (uno de los [roles FSMO](https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/fsmo-roles)). Este rol asegura que cada controlador de dominio reciba un bloque único de RIDs para asignar a nuevas cuentas y grupos (siempre asigna dentro del bloque de RIDs que tenga asignado el DC correspondiente), evitando así colisiones y garantizando que los SIDs no se repitan en todo el dominio.

Como los RID siguen valores secuenciales, si por ejemplo estamos en un entorno donde se admiten sesiones nulas (aka. acceso no autenticado al recurso IPC$ de SMB) es posible obtener el SID del equipo o dominio, una vez tenemos esto, podemos realizar un ataque conocido como [RID Cycling](https://trustedsec.com/blog/new-tool-release-rpc_enum-rid-cycling-attack), que consiste simplemente en realizar una fuerza bruta a los RID manteniendo el SID base, de esta manera podremos enumerar usuarios de un equipo o dominio.

## Logon SIDs

Además de los SIDs asociados a cuentas y grupos, Windows genera un **Logon SID** único para cada sesión de inicio de sesión interactivo. Este SID identifica de manera única la sesión y puede ser utilizado en entradas de control de acceso (ACEs) para permitir o denegar acceso durante la duración de la sesión del cliente.

El SID de una sesión de inicio de sesión tiene el siguiente formato:

```
S-1-5-5-X-Y
```

Donde **X** y **Y** son valores generados aleatoriamente. Los Logon SIDs son útiles, por ejemplo, cuando un servicio de Windows utiliza la función [LogonUser](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-logonusera) para iniciar una nueva sesión. El servicio puede extraer el Logon SID del token de acceso devuelto y utilizarlo en un ACE para controlar el acceso a recursos específicos durante esa sesión.

## Conversión entre nombres y SIDs

Dentro de la arquitectura de seguridad de Windows, un componente vital es el **Security Reference Monitor (SRM)**. Este componente se encarga de implementar los mecanismos de seguridad que restringen el acceso de los usuarios a distintos recursos. Por ejemplo, sin el SRM no sería posible evitar que otros usuarios accedieran a tus archivos.

El SRM trabaja con **SIDs (Security Identifiers)**, pero él los espera en formato binario. Sin embargo, nosotros como usuarios no es mucho mas conveniente referirnos a las cuentas y grupos a través de sus nombres. Pues la tarea de convertir nombres a SIDs y viceversa es realizada por el **Local Security Authority Subsystem Service (LSASS)**, que opera en un proceso privilegiado independiente de los usuarios conectados.

Podemos utilizar comandos de PowerShell para convertir nombres a SIDs y viceversa. Por ejemplo:

```powershell
PS C:\> Get-LocalGroup -Name "Users" | Select-Object Name, SID

Name  SID
---- ---
Users S-1-5-32-545

PS C:\>
```

En un dominio podriamos obtener el SID de un objeto de la siguiente forma:

```powershell
PS C:\> $(Get-ADDomain).DomainSID.Value
S-1-5-21-2643224878-1147328777-3138214671 // SID del dominio
PS C:\>
PS C:\> $(Get-ADUser robert.baratheon).SID.Value
S-1-5-21-2643224878-1147328777-3138214671-1117 // SID del usuario robert.baratheon
PS C:\>
```

**Nota**: Desde Linux podriamos utilizar el script [lookupsid.py](https://github.com/fortra/impacket/blob/master/examples/lookupsid.py) de Impacket o la función _lookupnames_ de rpcclient.

Por otro lado, podemos pasar de SID a nombre con el siguiente comando:

```powershell
PS C:\> $sid = New-Object System.Security.Principal.SecurityIdentifier("S-1-5-32-545")
PS C:\> $sid.Translate([System.Security.Principal.NTAccount])

Value
-----
BUILTIN\Users

PS C:\>
```

**Nota**: Desde Linux, para obtener el nombre a partir del SID podriamos utilizar la función _lookupsids_ de rpcclient.

## Conclusión

Pues hasta aquí el artículo de hoy, hemos aprendido que son los identificadores de seguridad en Windows y como se estructuran. Conforme leas mas sobre otros conceptos de Windows probablemente verás muchas menciones al SID, así que ya sabes de que tratan. Se agradece un montón si compartís el artículo y mencionáis a Deep Hacking <3

## Referencias

- [Security identifiers](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-identifiers)
- [SID structure (winnt.h)](https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-sid)
- [SID Components](https://learn.microsoft.com/en-us/windows/win32/secauthz/sid-components)
- [1.1.1.2 Security Identifiers (SIDs)](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-azod/ecc7dfba-77e1-4e03-ab99-114b349c7164)
- Windows Internals Part 1 - Seventh Edition
- Windows Security Internals A Deep Dive into Windows Authentication, Authorization, and Auditing
