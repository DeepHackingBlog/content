---
id: "como-explotar-el-ataque-shellshock"
title: "Cómo explotar el ataque Shellshock"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-01-31
updatedDate: 2022-01-31
image: "https://cdn.deephacking.tech/i/posts/como-explotar-el-ataque-shellshock/como-explotar-el-ataque-shellshock-0.webp"
description: "Explicación de la vulnerabilidad Shellshock (CVE-2014-6271), su origen, funcionamiento y cómo explotarla remotamente para lograr ejecución de comandos en servidores web."
categories:
  - "web"
draft: false
featured: false
lang: "es"
---

Shellshock es una vulnerabilidad asociada al CVE-2014-6271 que salió el 24 de septiembre de 2014 y afecta a la shell de Linux "Bash" hasta la versión 4.3. Esta vulnerabilidad permite una ejecución arbitraria de comandos.

Índice:

- [Origen de Shellshock](#origen-de-shellshock)
- [Shellshock Remoto](#shellshock-remoto)
- [Ejemplo de Explotación Remota](#ejemplo-de-explotación-remota)
- [Referencias](#referencias)

## Origen de Shellshock

La vulnerabilidad se originaba porque antes, a la hora de asignar una variable de entorno, bash te daba la posibilidad de asignar una función. Lo que ocurría cuando asignabas una función en el valor de una variable de entorno es que bash no se detenía en la propia definición, sino que continuaba y ejecutaba los comandos que se pusieran después de la definición de la función.

Literalmente tú después de leer este párrafo:

![Meme de confusión](https://cdn.deephacking.tech/i/posts/como-explotar-el-ataque-shellshock/como-explotar-el-ataque-shellshock-1.avif)

Ahora todo quedará más claro. Lo que ocurría antes es que tú podías declarar una función en una variable de entorno. Y ocurría un bug, que hacía que se ejecutara el comando que se colocase después. Por ejemplo, tú definías la siguiente función en la variable:

- `variable='() { contenido de la función;}; '`

Y en vez de simplemente definirse, el bug que tenía bash ocasionaba que se ejecutase el comando que hubiese después de la definición de la función. A nivel de concepto, esto es todo. Para entender mejor esta vulnerabilidad, vamos a ver cómo funciona el comando `env`.

Este comando imprime las variables de entornos actuales. Pero también se puede usar para ejecutar un comando en un entorno con una variable especificada. El proceso que hace es el siguiente:

1. `env` empieza un nuevo proceso
2. Modifica el entorno de este nuevo proceso
3. Ejecuta el comando que hemos dicho en el entorno creado

Por ejemplo, si pasamos como argumento el comando `env` para que se ejecute en el entorno que te crea el primer `env`, podremos ver las variables de entorno del contexto que crea el primer `env`:

![Ejemplo de uso del comando env](https://cdn.deephacking.tech/i/posts/como-explotar-el-ataque-shellshock/como-explotar-el-ataque-shellshock-2.avif)

Digamos que lo que está ocurriendo es:

"Oye, créame un entorno completamente limpio de variables de entorno. En este entorno la única variable de entorno que habrá será la que yo pase como argumento. Y dentro de este entorno, ejecútame el comando que digo, en este caso, `env`, para poder ver las variables de entorno del entorno que acabo de crear con el primer `env`, que al ser un entorno limpio, solo estará la variable de entorno que yo he pasado como argumento".

> He añadido el parámetro `--ignore-environment` para simplemente explicar el concepto del entorno que crea `env`. Si no lo pusiéramos, simplemente en el nuevo entorno se heredaría todas las variables de entorno existentes en nuestra entorno actual.

Ok, ahora estás así:

![Meme de confusión extrema](https://cdn.deephacking.tech/i/posts/como-explotar-el-ataque-shellshock/como-explotar-el-ataque-shellshock-3.avif)

Es normal, simplemente vuelve a leer el párrafo de arriba despacito y con buena letra.

Ahora bien, sabiendo esto, es aquí donde entra en juego el bug del que hemos hablado al principio, Shellshock. Si nosotros definimos la siguiente función en una variable:

- `mi_funcion='() { :;}; echo "ES VULNERABLE" '`

![Ejemplo de Shellshock ejecutándose](https://cdn.deephacking.tech/i/posts/como-explotar-el-ataque-shellshock/como-explotar-el-ataque-shellshock-4.avif)

> `bash -c ''` es lo mismo que colocar `bash -c :`
> 
> En ambos le estamos diciendo que en la nueva instancia/subproceso, que simplemente no haga nada. Menciono esto porque el doble punto aparece en el payload característico de Shellshock y es solo por eso, establece un comando que simplemente no hace nada.

Se ejecuta, a pesar de que solo estamos definiendo una variable de entorno. Esto ocurre porque la nueva shell (el nuevo proceso) ve una variable de entorno que empieza por `()` y obtiene el nombre de la variable para ejecutarla y definir la función en el entorno. Sin embargo, como ya se ha dicho, el bug hacía que se ejecutase lo que se pusiera después de la función.

En un sistema no vulnerable, ejecutando el comando de la imagen de arriba, simplemente no pasará nada:

![Sistema no vulnerable a Shellshock](https://cdn.deephacking.tech/i/posts/como-explotar-el-ataque-shellshock/como-explotar-el-ataque-shellshock-5.avif)

Y todo esto que he explicado es el bug y la famosa vulnerabilidad. Puedes pensar, oye, no es para tanto, porque al final, es un simple OS command injection en Linux.

## Shellshock Remoto

Lo turbio de esta vulnerabilidad es que se puede explotar remotamente, por ejemplo, en un servidor web, ocasionando un Remote Command Execution (RCE). Los archivos susceptibles a un ataque Shellshock son los que comúnmente pertenezcan a alguna de las siguientes extensiones:

- `.cgi`
- `.sh`

Algunos servidores web, como por ejemplo apache, soportan lo que se llama Common Gateway Interface (CGI). Esta característica permite a programas externos, hacer uso de datos provenientes del servidor web. Esta funcionalidad se relaciona con la famosa carpeta `cgi-bin` que nos podemos encontrar muchas veces. `cgi-bin` es una carpeta creada automáticamente para colocar scripts que queramos que interactúen con el servidor web.

Por lo que la explotación remota no se limita a los archivos `.cgi`. Se limita, a los archivos que interactúen con la bash usando en variables de entorno, datos del servidor web. Que es lo que permite el CGI.

Entonces, la idea de la explotación remota es que cualquier información recibida en una petición por parte del cliente como puede ser el `User-Agent`, `Referer`, u otros parámetros se almacenan en forma de variables de entorno para que puedan ser usadas por programas o scripts externos, por esto, los archivos situados en la carpeta `cgi-bin` son susceptibles a Shellshock.

> Por curiosidad, las variables de entorno tendrán de nombre estilo: `HTTP_<cabecera>`. Por ejemplo, `HTTP_USER_AGENT` sería la variable de entorno que almacenaría el valor del `User-Agent`.

Estas variables de entorno, al tratarse al fin y al cabo de cabeceras cuyo valor podemos editar, pues lo tenemos todo. Por un lado, tenemos variables de entorno las cuales podemos controlar su contenido, y, por otro lado, tenemos la ejecución en bash de scripts que hacen uso de las variables de entorno que nosotros controlamos.

Si nosotros alterásemos el valor del `User-Agent` y lo sustituyéramos con un payload como el que hemos visto previamente. Estaría ocurriendo todo lo que hemos explicado. Una función definida en una variable de entorno, al pasarla al contexto de un nuevo entorno de un proceso de bash, ejecutará cualquier comando que se le ponga después de la declaración de la función.

## Ejemplo de Explotación Remota

Vamos a ver como sería la explotación usando la máquina "Shocker" de HackTheBox.

Lo primero de todo es identificar el archivo que puede ser vulnerable, en este caso, es `user.sh`:

![Archivo user.sh vulnerable en la máquina Shocker](https://cdn.deephacking.tech/i/posts/como-explotar-el-ataque-shellshock/como-explotar-el-ataque-shellshock-6.avif)

Una vez identificado es tan sencillo como enviar el payload característico de shellshock a través de alguna cabecera, por ejemplo, el `User-Agent`:

- `curl -H 'User-Agent: () { :;}; echo; echo ¿Es vulnerable?' 'http://10.10.10.56/cgi-bin/user.sh'`

![Prueba de vulnerabilidad con User-Agent](https://cdn.deephacking.tech/i/posts/como-explotar-el-ataque-shellshock/como-explotar-el-ataque-shellshock-7.avif)

También podemos comprobar con otra cabecera, por ejemplo, el `Referer`:

![Prueba de vulnerabilidad con Referer](https://cdn.deephacking.tech/i/posts/como-explotar-el-ataque-shellshock/como-explotar-el-ataque-shellshock-8.avif)

Podemos observar que en ambos casos se nos ha ejecutado la cadena del segundo `echo`. De esta forma, acabamos de verificar que es vulnerable. Por lo que ya prácticamente tenemos RCE, si queremos confirmarlo aún más, podemos probar a mandarnos paquetes ICMP:

![Confirmación de RCE con paquetes ICMP](https://cdn.deephacking.tech/i/posts/como-explotar-el-ataque-shellshock/como-explotar-el-ataque-shellshock-9.avif)

> Aquí hay varios detalles a comentar. Lo primero es que colocamos un `echo` después de la declaración de la función para que el segundo comando pueda mostrar su salida en la respuesta HTTP. Aun así, si no lo pusiéramos, aunque no veamos la salida del comando en la respuesta, lo estaríamos ejecutando.
> 
> Lo segundo es que, si nos fijamos estamos llamando a la bash de forma absoluta. Y esto es porque la variable `$PATH` está vacía en el entorno donde shellshock ejecuta el comando.

También podríamos mandarnos una reverse shell:

![Obteniendo reverse shell mediante Shellshock](https://cdn.deephacking.tech/i/posts/como-explotar-el-ataque-shellshock/como-explotar-el-ataque-shellshock-10.avif)

La explotación de esta vulnerabilidad realmente es tan sencillo como esto, colocar el payload clásico y boom, RCE.

## Referencias

- [Understanding the Shellshock Vulnerability](https://coderwall.com/p/5db5eg/understanding-the-shellshock-vulnerability)
- [HTB: Shocker](https://0xdf.gitlab.io/2021/05/25/htb-shocker.html)
- [The ShellShock Attack](https://www.exploit-db.com/docs/48112)
- [How to run a program in a clean environment in bash?](https://unix.stackexchange.com/questions/48994/how-to-run-a-program-in-a-clean-environment-in-bash)
- [Exploiting CGI Scripts with Shellshock](https://antonyt.com/blog/2020-03-27/exploiting-cgi-scripts-with-shellshock)
- [Bash - Functions in Shell Variables](https://unix.stackexchange.com/questions/233091/bash-functions-in-shell-variables)
