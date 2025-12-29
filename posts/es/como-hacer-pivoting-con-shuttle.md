---
id: "como-hacer-pivoting-con-shuttle"
title: "Cómo hacer Pivoting con Sshuttle"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2021-11-05
updatedDate: 2021-11-05
image: "https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-shuttle/como-hacer-pivoting-con-shuttle-0.webp"
description: "Guía práctica sobre cómo utilizar Sshuttle para hacer pivoting simulando una VPN a través de conexiones SSH entre diferentes redes."
categories:
  - "linux"
draft: false
featured: false
lang: "es"
---

Sshuttle es un programa que te permite simular casi una VPN a través de una conexión SSH.

El uso básico de `sshuttle` es:

```bash
sshuttle -r <usuario>@<servidor ssh> <ip de red en la que operará la vpn>/<máscara de red en CIDR>
```

![Conexión SSH con sshuttle](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-shuttle/como-hacer-pivoting-con-shuttle-1.avif)

De esta forma, nos conectamos por SSH mediante `sshuttle`.

Si le añadiéramos el argumento `-N` intentará adivinar la IP de red en la que operará la VPN, por lo que no tendríamos que especificarlo si usamos este argumento.

Con esto, si por ejemplo, nuestra red es la `192.168.0.0/24` y nos conectamos a un servidor SSH (`192.168.0.10`) que está en la misma red nuestra, pero, este servidor, tiene también acceso a la red `192.168.30.0/24`, el comando a usar sería el siguiente:

```bash
sshuttle -r <usuario>@192.168.0.10 192.168.30.0/24
```

Ya que la red en la que queremos que opere la conexión "VPN" es la `192.168.30.0/24`.

Sshuttle tiene algunas ventajas y desventajas, al contrario que por ejemplo `proxychains`, si lanzamos varias VPN una sobre la otra, pasando por diferentes redes, siempre podremos acceder a los recursos de cada una de ellas sin que se tenga en cuenta la red de la última conexión VPN que hemos lanzado. Sin embargo, `sshuttle` no permite el uso de por ejemplo trazas ICMP o `nmap`, pero si intentásemos llegar a un servidor web, llegaríamos sin problemas:

![Acceso a servidor web a través de sshuttle](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-shuttle/como-hacer-pivoting-con-shuttle-2.avif)

Así que en este aspecto, esta es la desventaja de Sshuttle, la incapacidad de usar `nmap`, `ping`, etc., además de que necesitas privilegios de administrador para poder usarlo:

![Sshuttle requiere privilegios de administrador](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-shuttle/como-hacer-pivoting-con-shuttle-3.avif)

Hasta ahora, si nos fijamos, podemos ver como hemos iniciado sesión con credenciales en el SSH, pero ¿qué ocurre si solo tenemos acceso mediante clave privada? Sshuttle en principio no acepta iniciar sesión usando clave privada, sin embargo se puede bypasear de la siguiente forma:

```bash
sshuttle -r <usuario>@<servidor ssh> --ssh-cmd "ssh -i <archivo clave privada>" <ip de red en la que operará la vpn>/<máscara de red en CIDR>
```

Ejemplo:

![Conexión con sshuttle usando clave privada](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-shuttle/como-hacer-pivoting-con-shuttle-4.avif)

De esta manera podemos iniciar sesión usando una clave privada.

Si en alguno de los usos de `sshuttle` nos saliese un error de este estilo:

```
client: Connected.
client_loop: send disconnect: Broken pipe
client: fatal: server died with error code 255
```

Podemos solucionarlo con el parámetro `-x`, el cual nos permite excluir una IP del rango donde la VPN va a operar. Este problema podría ocurrir si el dispositivo al cual nos conectamos, pertenece a la red la cual queremos que la VPN opere. En cualquier caso, si nos ocurre este error haríamos lo siguiente:

```bash
sshuttle -r <usuario>@<servidor ssh> <ip de red en la que operará la vpn>/<máscara de red en CIDR> -x <servidor ssh>
```

Así, excluiríamos el servidor SSH de la VPN por así decirlo.

Además de todo lo visto hasta ahora, `sshuttle` tiene la opción para que nuestras peticiones DNS también pasen por el proxy, de tal forma que usemos los servidores DNS que la máquina (SSH Server) tenga configurados. El argumento a añadir en la línea de comandos simplemente sería `--dns`. Lo podemos agregar ya sea al principio o al final.

Por último, otro argumento que tiene `sshuttle` es él `-D`, el cual básicamente manda al segundo plano la conexión cuando nos conectamos:

![Ejecución de sshuttle en segundo plano con parámetro -D](https://cdn.deephacking.tech/i/posts/como-hacer-pivoting-con-shuttle/como-hacer-pivoting-con-shuttle-5.avif)

Y hasta aquí las funcionalidades de `sshuttle`, al menos las más principales y comunes.
