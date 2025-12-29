---
id: "como-funciona-el-protocolo-dns"
title: "Cómo funciona el protocolo DNS"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2023-05-29
updatedDate: 2023-05-29
image: "https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-0.webp"
description: "Aprende cómo funciona el protocolo DNS, los tipos de servidores implicados en la resolución de dominios y los registros DNS más comunes utilizados en internet."
categories:
  - "osint"
draft: false
featured: false
lang: "es"
---

Conocer como funciona el protocolo DNS es de vital importancia para entender cómo funciona internet. Pero no solo eso, sino que es realmente útil y necesario de cara a cuando se realiza un reconocimiento de los activos de una compañía. Por ello, en este post vamos a ver cómo funciona el protocolo con ejemplos prácticos de reconocimiento.

- [Introducción](#introducción)
- [Registros DNS más comunes](#registros-dns-más-comunes)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

## Introducción

El protocolo DNS (Domain Name System) de forma sencilla, traduce un dominio a una IP, como si de una agenda de contactos se tratase, por ejemplo, en tu móvil puedes guardar el contacto de "El Pizzero" y asociarle un número de teléfono para que cuando lo llames, no tengas que saber su número de teléfono. Pues el protocolo DNS hace lo mismo, es mucho más sencillo recordar un dominio como puede ser **deephacking.tech** que recordar su IP: 51.255.26.63.

Además, esto permite que en base a con que dominio estés resolviendo y accediendo a la IP, esta te muestre una respuesta distinta, esto es lo que se conoce como [Virtual Hosting (alojamiento compartido)](https://es.wikipedia.org/wiki/Alojamiento_compartido). Permite que en un mismo servidor se puedan almacenar varias webs.

Esta es la idea base que sustenta el protocolo DNS, ahora bien, para que se lleve a cabo en la práctica es un poco más complejo. Antes de hablar de los tipos de servidores DNS, lo más importante es conocer la sintaxis y estructura de un dominio cuando de resolución DNS se trata:

![Diagrama de la estructura jerárquica de un dominio DNS mostrando TLD, dominio y subdominio](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-1.avif)

Cuando se realiza una resolución DNS, se empieza por el dominio TLD y se sigue siguiendo una estructura jerárquica. Para entenderlo bien, vamos a ver los tipos de servidores DNS que existen junto a un proceso de resolución DNS:

- [Servidores raíz](https://es.wikipedia.org/wiki/Servidor_ra%C3%ADz):
    - Son el primer paso del DNS.
    - Poseen la información de los servidores TLD, nombre y dirección IP.
    - Existen 13 servidores raíz.
    - Son revisados por el ICANN (Internet Corporation for Assigned Names and Numbers).
    - A niveles prácticos, estos servidores manejan un archivo de alrededor de 200kB que poseen la información de los servidores DNS autorizados para todos los dominios de nivel superior (TLD), el [archivo raíz de zonas](https://www.internic.net/domain/root.zone).
    - Por ejemplo, este archivo nos ayuda a saber a qué servidores podemos preguntar si queremos resolver un dominio **.com**, **.es**, etc.

<figure>

![Consulta DNS mostrando servidores TLD autoritativos para el dominio .com](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-2.avif)

<figcaption>

Servidores TLD para un dominio .com

</figcaption>

</figure>

<figure>

![Consulta DNS mostrando servidores TLD autoritativos para el dominio .es](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-3.avif)

<figcaption>

Servidores TLD para un dominio .es

</figcaption>

</figure>

- Servidores TLD:
    - Estos servidores almacenan las direcciones de los servidores autoritativos para todos los dominios que terminen en el TLD que corresponda. Se almacenan en unos registros llamados "Glue Records".
    - Están administrados por IANA (Internet Assigned Numbers Authority).
    - IANA divide los servidores TLD en dos tipos:
        - **TLD genéricos**: dominios que no pertenecen a un país específico: **.com**, **.org**, **.net**, **.edu**, **.gov**, etc.
        - **TLD de países**: dominios que se asocian a países o estados: **.uk**, **.us**, **.ru**, **.jp**, etc.
    - Por ejemplo, si queremos averiguar los servidores autoritativos de **amazon.es** haremos uso de cualquiera de los servidores que ayuden a resolver dominios que acaben en **.es**:

<figure>

![Consulta DNS mostrando los servidores autoritativos del dominio amazon.es](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-4.avif)

<figcaption>

Servidores autoritativos de **amazon.es** (ellos son los que poseen la IP de **amazon.es**)

</figcaption>

</figure>

Lo que hemos visto hasta ahora, es decir, los servidores raíz y TLD son servicios "públicos" financiados por los operadores y la compra de dominios. Sin embargo, ahora, los servidores autoritativos y recursivos son servidores DNS privados.

- Servidores autoritativos:
    - El servidor autoritativo suele ser el último paso en la cadena para obtener la dirección IP de un dominio.
    - Este servidor posee información específica del dominio, como puede ser los registros DNS (A, AAAA, CNAME, MX, TXT, NS, SOA, SRV, PTR).
    - Si queremos obtener la IP final de **amazon.es**, debemos de preguntarle a cualquiera de los servidores autoritativos que obtuvimos previamente:

<figure>

![Consulta DNS mostrando las direcciones IP del dominio amazon.es](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-5.avif)

<figcaption>

IPs de **amazon.es**

</figcaption>

</figure>

Podemos corroborarlo en cualquier herramienta de resolución DNS online, por ejemplo, [MXToolbox](https://mxtoolbox.com/SuperTool.aspx):

![Resultado de resolución DNS de amazon.es en MXToolbox mostrando múltiples direcciones IP](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-6.avif)

Todos estos pasos que hemos visto normalmente son reducidos debido a la caché, ya sea de nuestro equipo local, del servidor recursivo que estemos usando, proveedor de internet, navegador, etc. Que, mencionando los servidores recursivos vamos a ver de que se tratan, seguramente sean el que más nos suene:

- Servidores recursivos: estos son los servidores que se encargan de realizar las peticiones DNS que hacemos. Uno de los más famosos es el **8.8.8.8** de Google. Entonces básicamente estos servidores se encargan de los pasos que hemos visto arriba, nosotros preguntamos por un dominio, y ellos se encargan de hacernos el trabajo. Este tipo de servidores junto a los autoritativos son los que se pueden configurar en nuestros dispositivos:

![Configuración de servidores DNS en panel de control de Windows](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-7.avif)

Si establecemos un servidor recursivo, el equipo enviará las consultas DNS a ese servidor y confiará en él para resolver los nombres de los dominios que solicite. Por el contrario, si establecemos un servidor DNS autoritativo, este solo será capaz de responder consultas relacionadas con los dominios para los cuales tiene autoridad. Esa es la diferencia entre un servidor recursivo y uno autoritativo.

Habiendo visto el proceso completo que se lleva a cabo cuando se resuelve un dominio, vamos a ver el tipo de información que puede tener un servidor autoritativo sobre un dominio, es decir, los registros DNS.

## Registros DNS más comunes

Los registros DNS son instrucciones almacenadas en servidores DNS autoritativos que contienen información sobre un dominio específico. Los registros se almacenan en forma de archivos de texto, y utilizan una sintaxis DNS (una serie de comandos) para indicar al servidor DNS qué hacer. Cada registro tiene su propio propósito y estructura dentro de la sintaxis DNS. Además, cada registro tiene un TTL (Time-to-Live) que define cuánto tiempo se debe mantener en caché antes de solicitar una actualización.

Dicho esto, algunos de los registros DNS más comunes son:

- **Registro A**: contiene la/s dirección/es IP de un dominio.

![Consulta DNS de tipo A mostrando la dirección IP de facebook.com](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-8.avif)

- **Registro AAAA**: contiene la/s dirección/es IPv6 de un dominio.

<figure>

![Consulta DNS mostrando registros IPv6 de facebook.com usando el tipo any](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-9.avif)

<figcaption>

Tenía problemas al obtener el valor usando: dig aaaa **facebook.com** por eso uso "any" en su lugar

</figcaption>

</figure>

- **Registro CNAME**: contiene un alias a otro nombre de dominio. Por ejemplo, un registro CNAME puede asociar **"www[.]ejemplo[.]com"** a **"ejemplo[.]com"**, lo que significa que ambos nombres de dominio apuntan al mismo recurso. Esto es de vital importancia cuando tratamos con el "scope" en una auditoría, ya que podemos encontrar un subdominio de un dominio en scope, pero que apunte a otro dominio que no tenga nada que ver.

Por ejemplo, cuando enumeras subdominios de una empresa, en muchas ocasiones te encontrarás con un dominio **autodiscover**. Este subdominio comúnmente está relacionado con Outlook. Por ejemplo, si obtenemos el registro CNAME de **autodiscover.tesla.com**, podemos ver que apunta a **autodiscover.outlook.com**:

![Consulta DNS de tipo CNAME mostrando que autodiscover.tesla.com apunta a autodiscover.outlook.com](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-10.avif)

Y ya sí accedemos a él:

![Página de inicio de sesión de Outlook Web App para el dominio tesla.com](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-11.avif)

Confirmamos que es así. Por lo que esto son detalles a tener en cuenta de cara a enumerar los activos de una empresa.

- **Registro MX**: indica los servidores de correo electrónico que se utilizan para recibir mensajes de correo electrónico destinados a un dominio específico.

![Consulta DNS de tipo MX mostrando los servidores de correo de **facebook.com**](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-12.avif)

- **Registro TXT**: almacena información textual arbitraria asociada con un nombre de dominio. Se utiliza para diversos propósitos, como autenticación de correo electrónico (SPF, DKIM), verificación de dominio y otros servicios.

![Consulta DNS de tipo TXT mostrando múltiples registros de texto de **facebook.com**](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-13.avif)

- **Registro NS**: se utiliza para especificar los servidores de nombres (name servers) autorizados para un dominio en particular.

![Consulta DNS de tipo NS mostrando los servidores de nombres de **facebook.com**](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-14.avif)

- **Registro PTR**: se utiliza para relacionar una dirección IP con un nombre de dominio. Mientras que los registros DNS normales traducen nombres de dominio en direcciones IP, el registro PTR hace lo contrario: traduce direcciones IP en nombres de dominio. Así como dato, este es el registro que se usa cuando se hace un reverse DNS a una IP, útil para enumerar dominios y subdominios de una entidad partiendo de un rango de IPs.

![Consulta DNS de tipo PTR realizando reverse DNS de una dirección IP](https://cdn.deephacking.tech/i/posts/como-funciona-el-protocolo-dns/como-funciona-el-protocolo-dns-15.avif)

Todos estos no son los únicos registros DNS que existen, pero sí que son los más comunes.

## Conclusión

Hemos visto como se resuelve un dominio poco a poco y los tipos de servidores que se ven implicados. Además, hemos visto los tipos de registros existentes en el protocolo DNS. Conocer todo lo que hemos visto es de vital importancia para entender cualquier información que podamos obtener relacionada a DNS, como por ejemplo la información que podemos obtener al enumerar el DNS de un controlador de dominio o cuando enumeremos los activos de una empresa como hemos mencionado.

## Referencias

- [Hilo de Twitter sobre el servicio DNS por Francisco Torres](https://twitter.com/frantorres/status/1577944372384972800)
- [Comic sobre tipos de servidores DNS en Wizardzines](https://wizardzines.com/comics/dns-server-types/)
- [Artículo sobre servidores raíz en Wikipedia](https://es.wikipedia.org/wiki/Servidor_ra%C3%ADz)
- [Documentación sobre tipos de servidores DNS en Cloudflare](https://www.cloudflare.com/en-gb/learning/dns/dns-server-types/)
- [Guía de registros DNS en Cloudflare](https://www.cloudflare.com/es-es/learning/dns/dns-records/)
