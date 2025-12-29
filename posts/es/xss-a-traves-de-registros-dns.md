---
id: "xss-a-traves-de-registros-dns"
title: "XSS a través de Registros DNS"
author: "eric-labrador"
publishedDate: 2022-07-21
updatedDate: 2022-07-21
image: "https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-0.webp"
description: "Aprende cómo ejecutar XSS alojando payloads maliciosos en diferentes tipos de registros DNS como MX, NS, CNAME y TXT."
categories:
  - "web"
draft: false
featured: false
lang: "es"
---

En este post vamos a estar explicando como se puede ejecutar un XSS alojando el payload en diferentes registros DNS.

- [Configuración Inicial](#configuración-inicial)
- [Registro MX](#registro-mx)
- [Registro NS](#registro-ns)
- [Registro CNAME](#registro-cname)
- [Registro TXT](#registro-txt)
- [Referencias](#referencias)
- [Researchers](#researchers)

## Configuración Inicial

Lo primero de todo es obtener un dominio. En este caso se va a utilizar [GoDaddy](https://www.godaddy.com/es-es) como proveedor. El siguiente paso es obtener un VPS. En este VPS es donde se podrá "linkar" (conectar) el dominio con la IP del VPS. De esa forma, todo lo que se configure en el VPS será accesible desde el dominio:

<figure>

![Dominio km2.uk apuntando a la IP del VPS](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-1.avif)

<figcaption>

Dominio km2.uk apuntando a la IP del VPS

</figcaption>

</figure>

Ahora se tiene que especificar la siguiente configuración en los Servidores de nombre.

<figure>

![Configuración de servidores DNS](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-2.avif)

<figcaption>

El one.one.one.one se ignora, ya que pertenece a Cloudflare

</figcaption>

</figure>

Ahora, en el VPS, se tienen que ejecutar los siguientes comandos:

- `cd /opt && git clone https://github.com/iphelix/dnschef`

Con la herramienta de dnschef, entre otras cosas, se puede configurar un registro utilizando caracteres especiales.

## Registro MX

El registro MX indica cómo deben dirigirse los mensajes de correo electrónico de acuerdo con el protocolo para transferencia simple de correo (SMTP). En este caso no vamos a configurar ningún servidor, únicamente vamos a añadir el registro para que sea visible al interactuar con el dominio.

Un registro MX debe apuntar a un nombre de dominio, y si buscamos cuáles son los caracteres permitidos para un nombre de dominio encontramos la siguiente información del RFC 952:

> Un nombre de dominio es una cadena de texto de hasta 24 caracteres extraídos del alfabeto (A-Z), los dígitos (0-9), el signo menos (-) y el punto (.).

Como vemos, existen ciertas limitaciones y muchos software, como por ejemplo BIND, siguen las pautas establecidas en los RFC, pero esto no quiere decir que no podamos saltarnos estas pautas. En este caso, utilizando dnschef, que no se ajusta a las RFC, podemos emplear un payload XSS en lugar de un dominio. De esta forma, nos estaríamos saltando las convenciones de nomenclatura.

Con el siguiente comando se estará configurado el payload XSS en el registro MX de nuestro DNS:

- `python3 dnschef.py -i 0.0.0.0 --fakemail <payload aquí>`

![Configuración del payload XSS en registro MX](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-3.avif)

Ahora, a través del comando `dig` se puede ver si nuestro payload está configurado correctamente:

- `dig <dominio> MX`

![Verificación del registro MX con dig](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-4.avif)

En caso de necesitar probar si el payload funciona, se puede utilizar el siguiente código en php:

> NOTA: El siguiente código es un código en php que en este caso es vulnerable a XSS. No utilizar en entornos reales.

```php
<?php
print_r( dns_get_record("km2.uk", DNS_MX) );
?>
```

Para que funcione se tiene que ejecutar el siguiente comando, el cual levanta un servicio HTTP (es importante hacerlo en el mismo directorio donde se encuentra el archivo, es recomendable llamarlo `index.php`, ya que de esta forma al acceder a `http://localhost:8000` se abrirá el archivo de forma automática):

- `php -S 0.0.0.0:8000 -t .`

Ahora, en caso de una web esté reflejando el registro MX de un dominio y no esté sanitizando ese campo, se ejecutará nuestro payload XSS.

![Ejecución del payload XSS en el navegador](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-5.avif)

## Registro NS

Los registros de NS (Name Server) se utilizan para determinar los servidores que van a comunicar la información DNS de un determinado dominio.

De nuevo, a través de la utilidad dnschef se puede configurar el campo con un payload malicioso:

- `python3 dnschef.py -i 0.0.0.0 --fakens <payload aqui>`

![Configuración del payload XSS en registro NS](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-6.avif)

Ahora, a través del comando `dig` se puede ver si nuestro payload está configurado correctamente:

![Verificación del registro NS con dig](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-7.avif)

Si se necesita probar el payload en un servidor local, se puede utilizar el siguiente código en php (nuevamente, es vulnerable a XSS)

```php
<?php
print_r( dns_get_record("ns1.km2.uk", DNS_NS) );
?>
```

En este punto, en caso que la web no haya sanitizado el campo donde se muestra la información del dominio, saltará la alerta XSS.

![Ejecución del payload XSS desde registro NS](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-8.avif)

## Registro CNAME

El CNAME (Nombre Canónico) se utiliza para determinar el nombre del dominio/subdominio en lugar del registro A. El registro A indica la IP del dominio.

Nuevamente, utilizaremos la herramienta dnschef para configurar el nuestro payload:

- `python3 dnschef.py -i 0.0.0.0 --fakealias <payload aqui>`

![Configuración del payload XSS en registro CNAME](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-9.avif)

En este punto, debemos comprobar si dnschef ha funcionado correctamente, de nuevo utilizaremos `dig`:

![Verificación del registro CNAME con dig](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-10.avif)

En caso de necesitar probar el payload en local, se puede utilizar el siguiente código:

```php
<?php
print_r( dns_get_record("km2.uk", DNS_CNAME) );
?>
```

Finalmente, en caso que el desarollador de la web no haya sanitizado correctamente ese campo, se inyectará el payload y saltará la alerta XSS:

![Ejecución del payload XSS desde registro CNAME](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-11.avif)

## Registro TXT

A través de los registros TXT los administradores introducen texto de forma informativa. En este caso tendremos que editar un archivo de configuración que viene de por defecto en la instalación de la herramienta. Se deben ejecutar los siguientes comandos:

- `cd /opt/dnschef`
- `nano dnschef.ini`

En este punto, en el archivo `dnschef.ini` se tiene que añadir la siguiente información:

![Configuración del archivo dnschef.ini](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-12.avif)

Ahora, con el siguiente comando estaremos configurando el payload en el registro TXT de nuestro DNS:

- `python3 dnschef.py --file dnschef.ini -q -i 0.0.0.0`

Para comprobar que nuestro payload esta correctamente configurado en el registro, simplemente tendremos que utilizar nuevamente la herramienta `dig`.

![Verificación del registro TXT con dig](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-13.avif)

En caso de necesitar probar el payload de forma local, se puede utilizar el siguiente código en php (vulnerable nuevamente a XSS)

```php
<?php
print_r( dns_get_record("km2.uk", DNS_CNAME) );
?>
```

Finalmente, en caso que no se esté sanitizando el input del usuario en el campo vulnerable, se ejecutará la alerta XSS en la web.

![Ejecución del payload XSS desde registro TXT](https://cdn.deephacking.tech/i/posts/xss-a-traves-de-registros-dns/xss-a-traves-de-registros-dns-14.avif)

## Referencias

Este PoC ha sido inspirado en base a [este Tweet de HackingTheory](https://twitter.com/HackingTheory/status/1426957662567247874).

## Researchers

- Víctor García (takito)
  - [Twitter](https://twitter.com/takito1812)
  - [LinkedIn](https://www.linkedin.com/in/takito1812/)
- Eric Labrador (e1abrador)
  - [LinkedIn](https://www.linkedin.com/in/ericlabrador/)
