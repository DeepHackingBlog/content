---
id: "que-es-el-localaccounttokenfilterpolicy"
title: "Qué es el LocalAccountTokenFilterPolicy"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-01-21
updatedDate: 2022-01-21
image: "https://cdn.deephacking.tech/i/posts/que-es-el-localaccounttokenfilterpolicy/que-es-el-localaccounttokenfilterpolicy-0.webp"
description: "Aprende qué es el LocalAccountTokenFilterPolicy en Windows, cómo afecta la ejecución remota de comandos con cuentas administrativas locales y cómo deshabilitarlo para realizar pentesting."
categories:
  - "windows"
  - "active-directory"
draft: false
featured: false
lang: "es"
---

Cuando obtenemos credenciales de administrador en un entorno de equipos Windows, es muy típico comprobar si tenemos el clásico Pwn3d! de CrackMapExec para verificar si podemos ejecutar comandos y obtener shell.

Post que recomiendo leer:
- [¿Qué es y por qué funciona Pass The Hash? - Autenticación NTLM](https://blog.deephacking.tech/es/posts/como-funciona-la-autenticacion-ntlm/)

Sin embargo, puede ocurrir que tengamos credenciales de administrador, pero no tengamos la capacidad de ejecutar comandos. Esto puede ser por el LocalAccountTokenFilterPolicy.

Ejemplo:

![Usuario sikumy perteneciente al grupo Administradores en Windows](https://cdn.deephacking.tech/i/posts/que-es-el-localaccounttokenfilterpolicy/que-es-el-localaccounttokenfilterpolicy-1.avif)

El usuario "sikumy" está en el grupo "Administradores", pero:

![CrackMapExec sin Pwn3d debido a LocalAccountTokenFilterPolicy](https://cdn.deephacking.tech/i/posts/que-es-el-localaccounttokenfilterpolicy/que-es-el-localaccounttokenfilterpolicy-2.avif)

No obtenemos el famoso Pwn3d!, por lo tanto, no podemos ejecutar comandos.

Entonces, ¿qué es el LocalAccountTokenFilterPolicy y como nos afecta?

De forma simple, el LocalAccountTokenFilterPolicy es un filtro que previene que se usen privilegios elevados a través de la red. Esto solo aplica para las cuentas administrativas locales, no afectan a las cuentas de dominios. Por esta restricción, es por la que no podemos hacer uso de los privilegios de la cuenta a través de la red, y, por tanto, obtener el Pwn3d! y ejecutar comandos.

Para deshabilitar el LocalAccountTokenFilterPolicy, debemos retocar el siguiente registro:

- `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\system`

En concreto, el valor con nombre "LocalAccountTokenFilterPolicy". Si ese registro es 0, significa que está habilitado, si vale 1, lo contrario. A nosotros nos interesa que valga 1. Podemos cambiar su valor mediante el siguiente comando:

```cmd
cmd /c reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\system /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1 /f
```

![Modificación del registro LocalAccountTokenFilterPolicy con valor 1](https://cdn.deephacking.tech/i/posts/que-es-el-localaccounttokenfilterpolicy/que-es-el-localaccounttokenfilterpolicy-3.avif)

Ahora, si volvemos a CrackMapExec:

![CrackMapExec mostrando Pwn3d después de deshabilitar LocalAccountTokenFilterPolicy](https://cdn.deephacking.tech/i/posts/que-es-el-localaccounttokenfilterpolicy/que-es-el-localaccounttokenfilterpolicy-4.avif)

Obtenemos el Pwn3d!, gracias a haber deshabilitado esta restricción. Por lo que ya podemos ejecutar comandos y hacer lo que queramos.

## Referencias

- [Descripción del Control de Cuentas de Usuario y restricciones remotas en Microsoft Docs](https://docs.microsoft.com/en-us/troubleshoot/windows-server/windows-security/user-account-control-and-remote-restriction)
- [Cuentas de administrador local deben tener su token privilegiado filtrado para prevenir privilegios elevados en la red en sistemas de dominio](https://www.stigviewer.com/stig/windows_server_2008_r2_member_server/2014-04-02/finding/V-36439)
