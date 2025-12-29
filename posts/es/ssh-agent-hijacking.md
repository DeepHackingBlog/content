---
id: "ssh-agent-hijacking"
title: "SSH Agent Hijacking"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-12-03
image: "https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-0.webp"
description: "Aprende cómo funciona SSH Agent Hijacking, técnicas para abusar de sesiones SSH activas, escalada de privilegios y cómo comprometer servidores remotos mediante sockets SSH."
categories: 
    - "linux"
draft: false
featured: false
lang: "es"
---

Si estás en este artículo no creo que haga falta que explique que es SSH. Aún así lo haré porque queda bien tener una introducción así general.

Secure Shell (SSH) es un protocolo de red que permite la comunicación segura entre dos sistemas. SSH utiliza cifrado para garantizar la confidencialidad e integridad de los datos, proporcionando autenticación robusta y protección frente a ataques. Es muy utilizado para la administración remota de servidores y la transferencia segura de archivos. A diferencia de otros métodos como Telnet, SSH cifra todas las comunicaciones, lo que lo convierte en una opción segura para acceder a sistemas Linux de forma remota o ejecutar comandos sobre una conexión no confiable.

Después de esta definición que está sacada de Wikipedia (aka. ChatGPT en 2024) vamos a comenzar con el artículo de hoy. Vamos a ver una funcionalidad existente en SSH llamada SSH Agent y como un atacante puede aprovecharse de ella para realizar movimientos laterales en una red.

- [¿Qué es ssh-agent?](#qué-es-ssh-agent)
- [Configuración de ssh-agent](#configuración-de-ssh-agent)
    - [Verificación de claves cargadas en ssh-agent](#verificación-de-claves-cargadas-en-ssh-agent)
- [SSH Agent Hijacking](#ssh-agent-hijacking)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

## ¿Qué es ssh-agent?

ssh-agent es un programa incluido en OpenSSH que permite gestionar claves privadas de manera segura, manteniendo una copia descifrada de estas en la memoria. Funciona como un proceso en segundo plano (demonio) que se ejecuta en nuestro equipo local, donde carga la clave privada descifrada tras ingresar la passphrase (en caso de que tenga). Esto permite que los clientes SSH no tengan necesidad de volver a introducir la contraseña de la clave privada cada vez que quieran autenticar.

Para que se entienda, un ejemplo práctico: Nosotros estamos en nuestro equipo local (ordenador 1) y ejecutamos ssh-agent, ahora, cargamos nuestra clave privada en el proceso de ssh-agent, para que de esta manera, nuestra clave privada esté cargada en memoria. Gracias a esto, podemos conectarnos a un equipo remoto (ordenador 2) sin necesidad de colocar de nuevo la passphrase si la hubiese. Ahora bien, además de esto, si la funcionalidad Forward Agent de SSH se encuentra habilitada, podríamos desde el ordenador 2, conectarnos a un ordenador 3 utilizando la clave privada que está cargada en el proceso de ssh-agent en el ordenador 1 (por supuesto siempre y cuando nuestra clave pública esté en el ordenador 3). Esto nos ayuda a que no tengamos que almacenar ni exponer nuestra clave privada fuera de nuestro equipo. Mas adelante haremos un ejemplo práctico simulando una posible situación real.

Esto es posible gracias a que ssh-agent crea localmente en nuestro equipo lo que se conoce como un [Socket de Dominio Unix (Unix Domain Socket)](https://medium.com/swlh/getting-started-with-unix-domain-sockets-4472c0db4eb1), este socket proporciona una manera de comunicación entre procesos dentro de Linux. Permite que un proceso A escriba datos en el socket X para que sean leídos por un proceso B, al contrario lo mismo, el proceso A puede leer los datos que han sido escritos por un proceso B en un socket Y.

A través de esta idea es como funciona ssh-agent, básicamente carga en la memoria de su proceso nuestra clave privada y establece un socket con el proceso de SSH, de esta forma el proceso de SSH puede acceder a la clave privada descifrada que se encuentra en la memoria de ssh-agent. SSH utiliza el protocolo también llamado [SSH Agent](https://datatracker.ietf.org/doc/html/draft-miller-ssh-agent-04) para comunicarse con el agente, no es propósito de este artículo explicar como funciona el protocolo en sí, pero podéis obtener mas información en los dos siguientes artículos:

- [The agent protocol (explicación mas resumida y más fácil de entender)](https://smallstep.com/blog/ssh-agent-explained/#the-agent-protocol)

- [SSH Agent Protocol (explicación mas técnica)](https://www.ietf.org/archive/id/draft-miller-ssh-agent-13.html)

En cualquier caso, todo esto que acabamos de explicar los podemos visualizar en el siguiente esquema:

![Esquema de ssh-agent y agent forwarding](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-1.avif)

En la imagen podemos observar lo siguiente:

1. Ejecución de ssh-agent en el equipo local (Ordenador 1):
    - En nuestro equipo local, iniciamos el proceso de ssh-agent y cargamos nuestra clave privada, que se mantiene en memoria descifrada para su uso. Este agente nos permite realizar autenticaciones sin necesidad de reingresar la passphrase cada vez.

3. Creación del Unix Domain Socket (USD):
    - ssh-agent crea un Unix Domain Socket (USD) en el sistema local, que sirve como punto de comunicación entre el proceso de SSH y el agente. Este socket es representado por un archivo especial en el sistema de archivos de Linux, cuya ruta se almacena en la variable de entorno SSH\_AUTH\_SOCK del proceso de ssh-agent.

5. Conexión al equipo remoto (Ordenador 2):
    - Al establecer una conexión SSH con un equipo remoto, se crea un túnel SSH. Este túnel es seguro y permite transmitir datos entre el cliente SSH en el Ordenador 1 y el servidor SSH en el Ordenador 2.

7. Habilitación del Forward Agent:
    - Si activamos el reenvío del agente (Forward Agent), el cliente SSH en el Ordenador 2 crea un nuevo Unix Domain Socket (USD proxy). Este socket actúa como un intermediario que redirige todas las solicitudes de autenticación desde el Ordenador 2 al ssh-agent en el Ordenador 1 a través del túnel SSH.

9. Conexión a un tercer servidor (Ordenador 3):
    - Gracias al socket creado en el Ordenador 2, podemos conectarnos a otros servidores (como el Ordenador 3) utilizando la clave privada almacenada en el ssh-agent del Ordenador 1. Es importante destacar que la clave privada nunca abandona el Ordenador 1, el proxy solo permite realizar operaciones como firmas criptográficas y autenticaciones necesarias.

Ahora bien, todo esto tiene un problema que si sabes lo suficiente de Linux ya te habrás dado cuenta, y es que, aunque SSH Agent aumenta la seguridad al no exponer nuestra clave privada, deja también toda la seguridad en manos del servidor intermedio. Me explico, si en una estructura como la que hemos ido hablando de ordenador 1, ordenador 2 y ordenador 3 alguien compromete el ordenador 2, podrá acceder al socket establecido en ese equipo y, por tanto, podrá hacer uso de él para usarlo como autenticación a otros equipos, como el ordenador 3 por ejemplo.

A continuación vamos a ver como configurar ssh-agent para que hablemos de los conceptos implicados y posteriormente lo pondremos a prueba con un ejemplo desde un punto de vista ofensivo para que todo quede mucho mas claro.

## Configuración de ssh-agent

El escenario que vamos a plantear para la configuración de ssh-agent es el siguiente:

- Alice está trabajando desde su PC personal y necesita conectarse primero a un servidor en la DMZ (Zona Desmilitarizada). Desde allí, su objetivo es acceder a un servidor interno más seguro, que no está directamente accesible desde el exterior. ssh-agent le permitirá conectarse de forma segura sin tener que exponer su clave privada en la DMZ ni tener que introducir su contraseña varias veces.

Para comenzar lo primero de todo es que Alice cree en su PC personal su par de claves (pública y privada) y posteriormente inicie ssh-agent. Una vez ssh-agent esté iniciado, Alice agregará su clave privada para que el agente pueda gestionarla:



```bash
ssh-keygen

eval "$(ssh-agent)"

ssh-add ~/.ssh/id_rsa
```

![Generación de claves y carga en ssh-agent](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-2.avif)

Una vez que Alice haya cargado su clave privada en **ssh-agent**, el siguiente paso será copiar su clave pública a los servidores en los que quiere autenticarse, en este caso, el servidor en la **DMZ** y el **Servidor Interno**.

Para ello, Alice hará uso del comando `ssh-copy-id` para transferir su clave pública a la DMZ y el Servidor Interno.


```bash
ssh-copy-id alice@dmz

ssh-copy-id alice@internalserver
```

![Copia de clave pública a DMZ e InternalServer con ssh-copy-id](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-3.avif)

> Por simplificar las cosas hay conexión directa con el Servidor Interno, sino traspasaríamos nuestra clave pública a mano.

Una vez que Alice ha transferido su clave pública a los servidores correspondientes, el siguiente paso es habilitar el reenvío del agente SSH (Agent Forwarding). Esto permitirá que las solicitudes de autenticación desde otros servidores (como la DMZ) se redirijan al ssh-agent que está corriendo en su máquina local, sin necesidad de exponer su clave privada.

Para habilitar el reenvío del agente, Alice puede modificar el archivo de configuración global de SSH, pero lo más recomendable es crear un archivo de configuración personal en ~/.ssh/config. El archivo ~/.ssh/config es una herramienta muy útil que te permite personalizar tus conexiones SSH y crear alias fáciles de recordar para los servidores que utilizas frecuentemente. En lugar de escribir comandos largos con múltiples opciones cada vez que te conectas, puedes configurarlo para simplificar tu trabajo. Por ejemplo, en vez de usar:

```bash
ssh -i ~/.ssh/id_rsa -A alice@dmz
```

Lo simplificamos creando esta configuración en ~/.ssh/config:

```bash
nano ~/.ssh/config

Host dmz
    HostName dmz
    User alice
    ForwardAgent yes
```

![Configuración de ForwardAgent en ~/.ssh/config](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-4.avif)

Esto te permite conectarte simplemente escribiendo:

```bash
ssh dmz
```

En cualquier caso, gracias a esta configuración, el reenvío del agente solo estará habilitado (ForwardAgent yes) para las conexiones a la DMZ.

Con todo esto realizado ya tenemos la configuración terminada. Alice podrá conectarse al servidor intermedio y hacer uso del agente para moverse al servidor interno sin tener que exponer su clave privada ni tener que ingresar su contraseña:

![Conexión desde DMZ a servidor interno con agente reenviado](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-5.avif)

Si por ejemplo, el ForwardAgent estuviese deshabilitado Alice no podría hacer el segundo salto al Servidor Interno:

![Error al segundo salto sin ForwardAgent habilitado](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-6.avif)

Este proceso de primero conectarse a la dmz para conectarse al internalserver también se puede automatizar con la creación del archivo ~/.ssh/config y usando ProxyJump:

```bash
Host internalserver
    HostName 192.168.10.30
    User alice
    ProxyJump dmz
    ForwardAgent yes
```

Con esta configuración podrías conectarte automáticamente al servidor interno a través de la DMZ con solo escribir:

```bash
ssh internalserver
```

### Verificación de claves cargadas en ssh-agent

Puedes verificar qué claves privadas tienes cargadas en ssh-agent usando el comando:

```bash
ssh-add -l
```

![Salida de ssh-add -l en local (claves en agente)](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-7.avif)

![Salida de ssh-add -l en DMZ (claves disponibles via agent forwarding)](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-8.avif)

![Salida de ssh-add -l en servidor interno](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-9.avif)

Como podemos observar en los distintos equipos, este comando mostrará una lista de claves disponibles en el agente.

## SSH Agent Hijacking

Una vez tenemos este escenario montado, vamos ver la posible vía de compromiso. Imaginémonos que comprometemos el DMZ.

![Escenario de SSH Agent Hijacking (DMZ comprometido)](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-10.avif)

Al haber comprometido el servidor intermedio vamos a ser capaces de interactuar con los posibles agentes disponibles. Para enumerar esta información lo primero que haríamos es identificar posibles usuarios existentes en el DMZ:

![Enumeración de usuarios en DMZ](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-11.avif)

En este caso vemos que existe un usuario llamado Alice. Vale pues en este punto, voy a enumerar si Alice tiene algún proceso abierto de SSH:

```bash
pstree -p alice | grep ssh
```

![Procesos SSH de Alice en DMZ](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-12.avif)

Vemos que si. Pues como somos root en la DMZ tenemos la capacidad de observar las variables de entorno de los procesos en ejecución. Estas variables en Linux se encuentran disponibles en:

```bash
/proc/<pid>/environ
```

Nos interesa leer las variables de entorno del proceso de la Shell debido a que ahí podremos encontrar la variable de entorno relacionada al agente SSH (en caso de que esté configurado y activo, como en un enfoque de caja negra). Para ello, leeremos las variables de entorno del proceso de bash, utilizando su PID:

```bash
cat /proc/46201/environ | tr '\0' '\n' | grep SSH_AUTH_SOCK
```

![Variable SSH_AUTH_SOCK en /proc/<pid>/environ](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-13.avif)

Tras la salida del comando, podemos observar la ruta del agente SSH que está siendo ejecutado por el usuario Alice. Ahora es momento de identificar a qué usuario pertenece el agente, lo cual podemos hacer utilizando el siguiente comando, especificando la ruta del agente:

```bash
SSH_AUTH_SOCK=/tmp/ssh-XXXX41DN9o/agent.46200 ssh-add -l
```

![Comprobación de agente con ssh-add -l usando SSH_AUTH_SOCK](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-14.avif)

Esto nos muestra que el agente pertenece al usuario Alice, con la clave cargada desde su PC personal.

> Aunque el usuario actual de la DMZ fuese diferente (por ejemplo, Bob), el agente seguiría asociado a Alice en su PC personal, ya que las claves y el agente dependen del entorno en el que se originaron.

En este punto, ya tenemos ubicado el agente y sabemos que pertenece al usuario alice@personalcomputer, además de que está siendo ejecutado en la DMZ por el usuario alice.

¿Cómo podríamos identificar los servidores a los que podríamos movernos lateralmente?

Una posible idea es revisar el archivo known_hosts del usuario alice en la DMZ. Este archivo contiene un registro de los servidores con los que el usuario ha establecido conexiones previas, aunque en este caso, las entradas están hasheadas:

```bash
cat /home/alice/.ssh/known_hosts
```

![Contenido de known_hosts de Alice (hashes)](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-15.avif)

Otro archivo interesante sería el .bash_history del usuario alice:

```bash
cat /home/alice/.bash_history | grep ssh | tail
```

![Historial de bash con comandos ssh](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-16.avif)

> Si .bash\_history tampoco nos hubiese dado información relevante lo único que quedaría es realizar una enumeración en el servidor para ver que podemos encontrar.

En este caso, podemos observar intentos de conexión a un servidor llamado internalserver. Esto nos permite probar el uso del agente SSH identificado para conectarnos directamente a dicho servidor:

```bash
SSH_AUTH_SOCK=/tmp/ssh-XXXX41DN9o/agent.46200 ssh alice@internalserver
```

![Acceso al servidor interno usando SSH_AUTH_SOCK](https://cdn.deephacking.tech/i/posts/ssh-agent-hijacking/ssh-agent-hijacking-17.avif)

Nos conectamos al Servidor Interno bajo el usuario Alice utilizando el agente SSH cargado, sin necesidad de conocer la passphrase de la clave privada. De esta forma, hemos logrado movernos lateralmente tras comprometer un servidor intermedio.

## Conclusión

Pues listo por hoy, hemos demostrado como sería posible moverse lateralmente dentro de una red utilizando un servidor intermedio comprometido donde haya un socket que conecte con ssh-agent.

## Referencias

- [SSH Agent Hijacking - Hacking technique for Linux and macOS explained](https://www.youtube.com/watch?v=hv7JwhwT0iQ)
- [PEN-300: Advanced Evasion Techniques and Breaching Defenses](https://www.offsec.com/courses/pen-300/)
- [SSH Agent Explained - Carl Tashian](https://smallstep.com/blog/ssh-agent-explained/)
- [SSH Agent Hijacking - Clockwork](https://www.clockwork.com/insights/ssh-agent-hijacking/)
- [SSH Agent Explained](https://smallstep.com/blog/ssh-agent-explained/)
