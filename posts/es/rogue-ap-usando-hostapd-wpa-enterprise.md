---
id: "rogue-ap-usando-hostapd-wpa-enterprise"
title: "Rogue AP usando hostapd-wpe - Ataques a Redes WPA Enterprise"
author: "eric-labrador"
publishedDate: 2022-05-02
updatedDate: 2022-05-02
image: "https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-0.webp"
description: "Aprende a realizar ataques Rogue AP contra redes WPA Enterprise usando hostapd-wpe para capturar credenciales de usuarios."
categories:
  - "miscellaneous"
draft: false
featured: false
lang: "es"
---

Antes de nada, para los que no tengáis una tarjeta de red, yo utilizo la siguiente:

<figure>

![Adaptador USB WiFi ALFA Network AWUS036AXML](https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-1.avif)

<figcaption>

[Comprar adaptador ALFA Network AWUS036AXML en Amazon](https://www.amazon.es/ALFA-Network-Adaptador-inal%C3%A1mbrico-externas/dp/B08SJC78FH/)

</figcaption>

</figure>

Aunque por experiencias de conocidos esta también funciona bien:

<figure>

![Adaptador USB WiFi ALFA Network AWUS036NHA](https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-2.avif)

<figcaption>

[Comprar adaptador ALFA Network AWUS036NHA en Amazon](https://www.amazon.es/Alfa-Network-awus036nha-u-mount-cs-adaptador/dp/B01D064VMS/)

</figcaption>

</figure>

Ahora sí, empecemos con el post : )

- [¿Cómo surgió WPA?](#como-surgio-wpa)
- [¿Qué es WPA y WPA-Enterprise?](#que-es-wpa-y-wpa-enterprise)
- [¿Cómo vulnerar una red WPA-Enterprise?](#como-vulnerar-una-red-wpa-enterprise)

## ¿Cómo surgió WPA?

WPA nació de la necesidad de aumentar la seguridad del cifrado de contraseñas visto en el protocolo WEP, ya que el método que utiliza WEP es muy inseguro (se puede obtener la contraseña sin el uso de un diccionario). En el caso de WPA el ataque se complica, porque la contraseña se obtiene en formato de hash, por lo que es necesario crackearla.

Para crackear una contraseña lo más efectivo es realizar un ataque por diccionario, junto a un programa que pueda hacer el crackeo (en este post no me extenderé en cómo funcionan estos programas), como JohnTheRipper o Hashcat.

En los siguientes apartados voy a explicar cómo funciona el protocolo WPA-Enterprise y como vulnerarlo.

## ¿Qué es WPA y WPA-Enterprise?

Para empezar, las siglas WPA corresponden a **Wi-Fi Protected Access**. En el protocolo WPA la contraseña es el único vector de autenticación.

Una explicación sencilla sobre cómo funciona la autenticación:

1. El dispositivo cliente detecta al punto de acceso y viceversa.
2. El AP solicita una contraseña para realizar la conexión.
3. La contraseña introducida por el cliente viaja hasheada al punto de acceso (esta parte se conoce como handshake).
4. Dependiendo si la contraseña es correcta o no, el AP autoriza el acceso al cliente.

Pero la cosa cambia en el WPA-Enterprise (Wi-Fi Protected Access Enterprise), ya que para la autenticación se requiere de un usuario y una contraseña válida, de este modo la red es más segura, aunque en el siguiente apartado veremos como vulnerarla.

## ¿Cómo vulnerar una red WPA-Enterprise?

Para vulnerar un punto de acceso con el protocolo WPA-Enterprise, en este caso, utilizaremos un Fake AP/Rogue AP. En este ataque el objetivo es hacer que el cliente se autentique contra nuestro punto de acceso malicioso.

> Nota: de cara a un ataque real, el punto de acceso debe de tener el mismo SSID que el AP legítimo.

Cuando el cliente introduzca las credenciales, estas viajaran hasheadas y las podremos capturar de una manera muy sencilla.

Para que este ataque salga bien como atacantes solamente tenemos que:

1. Denegar la conexión entre el punto de acceso legítimo y el cliente (lo veremos a continuación).
2. Levantar un punto de acceso falso (Rogue AP) para engañar al cliente.

[¿Cómo se hace un ataque de denegación de servicio (también conocido como deautenticación)?](https://www.aircrack-ng.org/doku.php?id=deauthentication) Pues es muy sencillo, solo necesitas una tarjeta de red y una consola Linux. Aunque este tipo de ataque se puede evitar con 802.11w Management Frame Protection MFP o con WPA3.

> Nota: El software que se utiliza para este post viene por defecto instalado en distribuciones como Kali Linux, Parrot OS o Backtrack. En caso de usar una distro distinta, también se puede instalar.

Antes de realizar el ataque de deautenticación debemos poner la tarjeta de red en modo monitor, se puede hacer con el siguiente comando:

```bash
airmon-ng start wlan0
```

Ahora con la tarjeta de red ya puesta en modo monitor, debemos preparar dos consolas, una de ellas tendrá ejecutándose el siguiente comando que servirá para capturar todos los paquetes que se están transmitiendo en un canal específico:

```bash
airodump-ng wlan0mon -c 7
```

> Nota: Es necesario poner el parámetro `-c X` (donde X es el canal en el que queremos funcionar), ya que si no, no se podrá lanzar el comando de deautenticación.
> 
> En caso de solo querer realizar un reconocimiento de las redes, lo ejecutaremos sin el parámetro.

Sin cerrar el terminal donde estamos capturando paquetes, ahora si, en un terminal nuevo, ejecutaremos el comando para deautenticar a los clientes (recomiendo ejecutarlo de manera infinita, como explico a continuación, ya que de esta forma ningún cliente se podrá conectar de vuelta al punto de acceso legítimo hasta que hayamos acabado el ataque.)

```bash
aireplay-ng -0 0 -e deephacking.tech -a AB:BA:AB:BA:AB:BA -c FF:FF:FF:FF:FF:FF wlan0mon
```

Explicación del comando:

- `-0` --> Para indicarle al programa que el ataque que se quiere hacer es de deautenticación.
- `0` --> Con el 0 le indicamos al programa que emita paquetes de forma infinita.
- `-e` --> SSID (nombre de la red) del punto de acceso.
- `-a` --> Corresponde a la MAC del punto de acceso.
- `-c` --> Corresponde a la MAC del cliente. Si no colocas este parámetro, se hará en broadcast, por lo que para este caso realmente no haría falta.
- `FF:FF:FF:FF:FF:FF` --> Dirección broadcast (de esta forma se lanzará el ataque a todos los clientes conectados a la red).
- `wlan0mon` --> Corresponde al nombre de la tarjeta de red.

Utilizado el anterior comando, solo queda levantar el Rogue AP. Para ello se utiliza el programa **hostapd-wpe**. Puede ser que este software no esté instalado por defecto en algunas distribuciones, pero se puede instalar simplemente con:

```bash
sudo apt-get update && sudo apt-get install hostapd-wpe
```

- Nota: Este comando solo está disponible en repositorios de Kali y Parrot

Una vez instalado el programa, se generará un archivo en la ruta `/etc/hostapd-wpe/` llamado `hostapd-wpe.conf`. Este es el archivo que nos interesa, ya que será donde se podrá configurar el punto de acceso malicioso (SSID, canal, …).

Principalmente como atacantes tendremos que cambiar los valores marcados en la siguiente imagen:

<figure>

![Configuración de hostapd-wpe](https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-3.avif)

</figure>

- **Interface**: para indicar a hostapd a través de que interfaz queremos levantar el punto de acceso.
- **SSID**: Corresponde al nombre que se visualizará al listar todas las redes disponibles, **como se ha dicho antes, la idea es copiar el SSID de la red víctima**.

Configurados los valores, simplemente hay que guardar los cambios y levantar el punto de acceso con el siguiente comando:

```bash
hostapd-wpe /etc/hostapd-wpe/hostapd-wpe.conf
```

<figure>

![Punto de acceso levantado con hostapd-wpe](https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-4.avif)

</figure>

El punto de acceso ya está levantado, en el lado de la víctima se verá de la siguiente forma:

<figure>

![Red WiFi vista desde el dispositivo de la víctima](https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-5.avif)

</figure>

Como se puede apreciar, aparece como una red totalmente normal. Al conectarse, solicitará un usuario y una contraseña:

<figure>

![Solicitud de credenciales al conectarse a la red](https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-6.avif)

</figure>

> En este caso, el cliente no verifica el certificado y usa un hash MSCHAP, es por esto que es posible crackearlo. Si por ejemplo, se usase GTC downgrade, las credenciales aparecerían en texto plano.
> 
> Por tanto, ¿qué es lo más seguro?
> 
> La mejor opción es hacer uso de certificados en vez de usuario y contraseña.

Al introducir unas credenciales, en la consola de comandos, obtendremos lo siguiente:

<figure>

![Credenciales capturadas en formato hash](https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-7.avif)

</figure>

Efectivamente, se obtiene el usuario en texto claro y la contraseña hasheada, de hecho se nos da en formato JTR (JohnTheRipper) o Hashcat (dejo a vuestra decisión el usar un programa u otro).

Ahora, simplemente hay que crear un archivo con el hash obtenido para poder crackearlo:

<figure>

![Archivo con el hash para crackear](https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-8.avif)

</figure>

Personalmente, prefiero JohnTheRipper, así que será el que utilice, el comando para crackearlo es muy simple:

```bash
john --wordlist=rockyou.txt hash
```

<figure>

![Contraseña crackeada con JohnTheRipper](https://cdn.deephacking.tech/i/posts/rogue-ap-usando-hostapd-wpa-enterprise/rogue-ap-usando-hostapd-wpa-enterprise-9.avif)

</figure>

Si la contraseña está en el diccionario utilizado, se crackeará correctamente. De esta manera, habremos vulnerado una red WPA-Enterprise al haber obtenido credenciales de un usuario del mismo.
