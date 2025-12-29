---
id: "kali-linux-en-docker"
title: "Kali Linux en Docker"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2023-06-05
updatedDate: 2023-06-05
image: "https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-0.webp"
description: "Guía completa para instalar y administrar Kali Linux en Docker. Aprende a configurar el entorno, tunelizar tráfico por Burp Suite y gestionar contenedores."
categories:
  - "linux"
  - "windows"
draft: false
featured: false
lang: "es"
---

Todo el mundo conoce VMWare o VirtualBox, es lo más común para montar máquinas virtuales, y, hablando más concretamente, montar un kali. Sin embargo, aunque ambas opciones son buenas, no son las únicas. En este post vamos a ver como instalar y administrar Kali en Docker y algunas razones de porque últimamente me he decantado por esta opción en vez de usar una máquina virtual.

- [Descarga e Instalación de Kali y Docker Desktop](#descarga-e-instalación-de-kali-y-docker-desktop)
- [WSL2 vs Docker basado en WSL2](#wsl2-vs-docker-basado-en-wsl2)
- [Tunelizar todo el tráfico del contenedor por Burp Suite](#tunelizar-todo-el-tráfico-del-contenedor-por-burp-suite)
- [Comandos para administrar el contenedor](#comandos-para-administrar-el-contenedor)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

## Descarga e Instalación de Kali y Docker Desktop

Lo primero que tenemos que hacer es descargar e instalar [Docker Desktop](https://www.docker.com/products/docker-desktop/) en nuestro equipo:

![Página de descarga de Docker Desktop](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-1.avif)

La instalación es relativamente sencilla, simplemente hay que seguir el propio asistente. Si acaso mencionaría que en uno de los pasos preguntará si se quiere usar HyperV o WSL. La opción que recomendará el propio asistente es WSL, así que la mantenemos.

![Configuración de WSL en Docker Desktop](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-2.avif)

Una vez se haya instalado, tocará reiniciar el equipo y ya tendremos Docker instalado:

![Docker Desktop instalado y funcionando](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-3.avif)

Os recomiendo que tengáis instalado Windows Terminal, ya que dejando a un lado las opciones de personalización que tiene, la estética es mucho más agradable que el de la CMD o PowerShell. En Windows 11 está por defecto, en Windows 10 tendremos que instalarlo.

- [Guía de instalación y configuración de Windows Terminal](https://learn.microsoft.com/es-es/windows/terminal/install)

Una vez tengamos todo esto es hora de ir con la instalación de Kali. Lo primero de todo es descargar la imagen, aquí tenemos varias posibilidades y que podemos ver con más detalles en el siguiente enlace:

- [Documentación oficial de imágenes Docker de Kali Linux](https://www.kali.org/docs/containers/official-kalilinux-docker-images/)

Las dos imágenes principales son:

- [kalilinux/kali-rolling actualizada semanalmente](https://hub.docker.com/r/kalilinux/kali-rolling)
- [kalilinux/kali-last-release actualizada trimestralmente](https://hub.docker.com/r/kalilinux/kali-last-release)

En este caso vamos a instalar la primera de ellas. Para instalar una imagen de Docker es tan sencillo como usar el propio comando que se nos indica en sus respectivos enlaces de Docker Hub:

![Comando para descargar imagen en Docker Hub](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-4.avif)

```bash
docker pull kalilinux/kali-rolling
```

![Descarga de imagen Kali Linux en terminal](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-5.avif)

Después de descargar la imagen ya la podremos visualizar en Docker Desktop:

![Imagen Kali Linux en Docker Desktop](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-6.avif)

Una vez tenemos la imagen de Kali descargada, la idea antes de crear el contenedor, es limitar los recursos que usará, ya que si no los limitamos, se pondrá a usar casi todos los recursos del PC. Por ello, debemos de crear el archivo .wslconfig en la siguiente ruta:

- C:\\Users\\\<Usuario\>\\.wslconfig
- C:\\Usuarios\\\<Usuario\>\\.wslconfig

El contenido del mismo deberá de ser el siguiente:

```ini
# Settings apply across all Linux distros running on WSL 2
[wsl2]

# Limits VM memory to use no more than 4 GB, this can be set as whole numbers using GB or MB
memory=4GB 

# Sets the VM to use two virtual processors
processors=2
```

Estas no son las únicas opciones que se pueden configurar en este archivo, pero sí que son las mínimas para limitar los recursos, que es lo que nos interesa. Para más opciones puedes mirar la propia documentación de Microsoft:

- [Documentación de archivo wslconfig en Microsoft](https://learn.microsoft.com/es-es/windows/wsl/wsl-config#example-wslconfig-file)

Una vez creado el archivo .wslconfig lo que haremos antes de crear el contenedor será reiniciar el WSL, para ello, cerramos el Docker Desktop y ejecutamos en una CMD o PowerShell lo siguiente:

![Reinicio de WSL desde PowerShell](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-7.avif)

Todo esto simplemente para que se apliquen los cambios del .wslconfig. Una vez hecho esto, abriremos Docker Desktop de nuevo y crearemos el contenedor, que es básicamente la "VM" de kali. Para crear el contenedor, ejecutamos el siguiente comando:

```bash
docker run -ti -h deephacking --name deephacking kalilinux/kali-rolling
```

- `docker run`: es el comando principal de Docker para ejecutar un contenedor.
- `-ti`: son las opciones que se pasan al comando run. El indicador \-t asigna un pseudo TTY (terminal) al contenedor, y el indicador \-i permite la interacción con la terminal del contenedor.
- `-h` deephacking: establece el nombre de host del contenedor como "deephacking".
- `--name` deephacking: asigna un nombre al contenedor, en este caso "deephacking".
- `kalilinux/kali-rolling`: es el nombre de la imagen de Docker que se utilizará para crear el contenedor.

![Contenedor Kali Linux en ejecución](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-8.avif)

Y en un instante, ya estaremos dentro de nuestro kali.

Llegados a este punto, realmente ya tenemos el Kali instalado, lo único es que está casi vacío. Desde la [documentación oficial de imágenes Docker de Kali](https://www.kali.org/docs/containers/official-kalilinux-docker-images/) se nos recomienda instalar kali-linux-headless que corresponde a la instalación por defecto sin GUI. Otros paquetes disponibles lo podemos ver en [documentación de metapaquetes de Kali Linux](https://www.kali.org/docs/general-use/metapackages/). En cualquier caso, procedemos a instalar el paquete que nos recomiendan:

```bash
apt update && apt -y install kali-linux-headless
```

![Instalación de paquetes en Kali Linux](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-9.avif)

A lo largo de la instalación de los paquetes, se nos preguntará varias pautas de configuración, yo personalmente lo configuré de la siguiente manera:

![Configuración de Wireshark](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-10.avif)

![Configuración de teclado](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-11.avif)

![Configuración de macchanger](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-12.avif)

![Configuración de Kismet](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-13.avif)

![Configuración de sslh](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-14.avif)

Con la instalación finalizada ya tendremos un kali totalmente funcional y con varias herramientas preinstaladas:

![Kali Linux totalmente instalado y funcional](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-15.avif)

## WSL2 vs Docker basado en WSL2

Llegados a este punto puede surgir la duda de: ¿Para qué voy a instalar Kali usando Docker, si me puedo ir a la tienda de Microsoft, descargarlo directamente y usarlo con WSL2?

![Kali Linux en Microsoft Store](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-16.avif)

Entre estas dos opciones hay una serie de diferencias que, al menos a mí, me hacen decantarme por la opción de Docker. También por supuesto, todo dependerá de las necesidades de cada uno e incluso los gustos.

En cualquier caso, algunas diferencias entre estas dos opciones son las siguientes:

1. Usando WSL2 directamente tienes acceso a los recursos de Windows de manera más directa. Esto puede ser útil si lo que te interesa es interactuar con herramientas o archivos concretos de Windows. Por otro lado, usando Docker estás usando un entorno aislado.
2. En WSL2, como los archivos y datos se almacenan directamente en el sistema de archivos de Windows, los tendrás disponibles incluso después de cerrar el Kali. De forma contraria, en Docker, los datos se almacenan dentro del contenedor. Lo dicho, un sistema aislado.
3. Usando Docker tendrás todas las ventajas del mismo en cuanto a construir, compartir y administrar contenedores se refiere.
4. Docker utiliza una imagen de Linux dentro del contenedor, lo que quizás puede llegar a dar mayor compatibilidad con las aplicaciones y herramientas.

Además, hablando un poco más personalmente, WSL2 a mí me ha dado más problemas de los que me ha dado Docker hasta ahora. Con WSL2 he tenido más de una vez algún problema de DNS mientras que con Docker no. Y oye, también me gusta por simple organización que ambos sistemas estén aislados y no en el mismo sistema de archivos.

En conclusión, ambas opciones tienen sus diferencias y son buenas. Simplemente, al menos por ahora y por propio gusto, me quedo con Docker. Aun así, en el siguiente enlace podéis ver más información de este debate:

- [Comparativa entre Docker y WSL en AskUbuntu](https://askubuntu.com/questions/969810/ubuntu-on-windows-10-docker-vs-wsl)

> Además, a favor de estas dos opciones en lugar de usar una VM, es la capacidad de disco. No me tengo que preocupar por cuantos GB de disco duro tiene, ya que tanto WSL como Docker usan la capacidad del sistema anfitrión en función de sus necesidades.

## Tunelizar todo el tráfico del contenedor por Burp Suite

Una de las características que me ha gustado de Docker y que desconocía era la facilidad con la que puedes tunelizar o no el tráfico a través de un Proxy. Por ejemplo, yo uso Burp Suite en Windows debido a que tiene mejor rendimiento que en Linux virtualizado por los recursos disponibles del sistema anfitrión. Por tanto, de forma muy sencilla es posible tunelizar todo el tráfico del contenedor a través de Burp Suite, situado en la máquina anfitrión Windows.

Lo primero de todo es dirigirse a:

Configuración → Resources → Proxies

![Configuración de Docker Desktop](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-17.avif)

![Sección de Proxies en Docker Desktop](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-18.avif)

En este apartado, configuramos el proxy de Burp Suite para que todo el tráfico pase por él:

![Configuración de proxy en Docker Desktop](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-19.avif)

Ahora, lo que tendremos que hacer es instalar el certificado de Burp Suite en el Kali Linux para las peticiones HTTPS, ya que sino, cuando tratemos con webs que usen este protocolo, saldrá que estamos usando un certificado inseguro:

![Error de certificado inseguro en HTTPS](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-20.avif)

Para solucionar esto, lo primero de todo es descargar el certificado de Burp Suite, que lo haremos en Windows, ya que nuestro Burp Suite se encuentra ahí:

![Descarga de certificado CA en Burp Suite](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-21.avif)

Ahora, la idea es moverlo al contenedor, para hacerlo podemos hacer uso del propio Docker Desktop, concretamente de la pestaña de "Files" que podemos encontrar al dar click a un contenedor.

![Vista de contenedor en Docker Desktop](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-22.avif)

![Pestaña Files en Docker Desktop](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-23.avif)

Aquí podemos seleccionar y arrastrar un archivo para moverlo del Windows al Kali de forma sencilla sin complicaciones:

![Arrastrar archivo al contenedor](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-24.avif)

> Esta característica también se puede usar a la inversa, es posible descargar archivos del contenedor al equipo anfitrión.

De esta manera ya lo tenemos en el contenedor:

![Certificado en el contenedor Kali](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-25.avif)

Ahora debemos de convertir el certificado que está en formato DER a una clave pública, para ello hacemos uso de openssl:

```bash
openssl x509 -in cacert.der -inform DER -out burp.crt
```

![Conversión de certificado con openssl](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-26.avif)

Una vez tenemos la clave pública, simplemente la movemos al directorio "/usr/local/share/ca-certificates/":

![Mover certificado al directorio correcto](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-27.avif)

Por último, simplemente actualizamos los certificados:

```bash
update-ca-certificates
```

![Actualización de certificados en Kali](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-28.avif)

Como podemos observar, se indica que se ha agregado uno.

Ahora, si volvemos a intentar el mismo curl que hicimos al principio:

![Curl funcionando correctamente con certificado](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-29.avif)

Funciona sin problemas y conseguimos que todo el tráfico pase por Burp Suite.

Esto es bastante útil para las siguientes situaciones:

- Queremos guardar todas las peticiones que hagamos en el proyecto de Burp Suite.
- Tenemos un exploit y queremos obtener la petición HTTP en RAW para poder jugar con ella desde Burp Suite.
- Estamos montando un script. Burp Suite nos puede ayudar a debuggearlo gracias a que podemos visualizar tanto las peticiones que se mandan como su respectiva respuesta. Lo mismo se puede hacer desde el código, pero oye, verlo en Burp Suite es bastante más cómodo.
    - Sobre este punto, a mí me vino genial para la explotación y automatización de una inyección SQL de tipo boolean :)

> Podemos desactivar o activar el uso del proxy desde la configuración tantas veces como queramos y cuando queramos. No es necesario después de realizar el respectivo cambio reiniciar los contenedores o algo parecido.

## Comandos para administrar el contenedor

Ya tenemos el Kali preparado y el certificado de Burp Suite instalado. Llegados a este punto, solo queda ponerse modo Hack. Sin embargo, es importante saber los comandos básicos para administrar el contenedor en caso de que no hayas tocado Docker antes. Por ello, dejo los comandos mínimos a saber para poder tratar con ello:

Listar todos los contenedores, estén o no en ejecución:

```bash
docker ps -a
```

![Listado de todos los contenedores](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-30.avif)

Listar contenedores en ejecución:

```bash
docker ps
```

![Listado de contenedores en ejecución](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-31.avif)

Iniciar un contenedor que esté parado:

```bash
docker start <ID>
```

El ID del contenedor corresponde al ID que podemos obtener con docker ps.

![Inicio de contenedor detenido](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-32.avif)

Conectarnos al proceso principal del contenedor:

```bash
docker attach <ID>
```

En caso de que nos salgamos de este proceso, el contenedor se detendrá, debido a que es el proceso principal.

![Conexión al proceso principal del contenedor](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-33.avif)

Ejecutar un nuevo proceso en un contenedor:

```bash
docker exec -it <ID> <comando>
```

![Ejecución de nuevo proceso en contenedor](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-34.avif)

Detener un contenedor en ejecución:

```bash
docker stop <ID>
```

![Detención de contenedor en ejecución](https://cdn.deephacking.tech/i/posts/kali-linux-en-docker/kali-linux-en-docker-35.avif)

Estos son los comandos principales que necesitamos saber para tratar con el Kali que hemos instalado.

## Conclusión

Hemos visto como se instala kali linux en Docker. Asimismo, hemos visto un poco el flujo y comandos que se siguen cuando se trata con imágenes y contenedores Docker, lo que nos sirve para tratar con cualquier imagen que veamos de aquí en adelante.

Además, oye, saber otra alternativa a los famosos VirtualBox y VMWare está genial. Como ya he mencionado en el post, ahora mismo mi setup es tal que:

- Burp Suite en Windows
- Kali en Docker
    - El cual tunelizo cuando lo necesito por Burp Suite

Por supuesto, este setup prescinde de la parte gráfica de kali, sin embargo, la verdad que no la hecho en falta.

> Offtopic: Y aunque ya se escape un poco de la temática del post, también es importante saber qué herramientas valen la pena lanzar desde Windows y cuáles desde Linux. Por ejemplo, un hashcat está claro que será mucho mejor en Windows para poder sacarle todo el partido a la GPU.

## Referencias

- [Guía para añadir certificado CA de Burp Suite en Kali Linux](https://bestestredteam.com/2019/05/25/adding-burp-suite-ca-certificate-to-kali-linux-ca-store/)
- [Documentación oficial de imágenes Docker de Kali Linux](https://www.kali.org/docs/containers/official-kalilinux-docker-images/)
- [Cómo limitar el uso de memoria en Docker Desktop con WSL 2](https://medium.com/geekculture/how-to-limit-memory-usage-on-docker-desktop-wsl-2-mode-2a4a719f05fd)
- [Comparativa entre Docker y WSL en AskUbuntu](https://askubuntu.com/questions/969810/ubuntu-on-windows-10-docker-vs-wsl)
