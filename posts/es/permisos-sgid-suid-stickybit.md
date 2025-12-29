---
id: "permisos-sgid-suid-stickybit"
title: "Permisos SGID, SUID y Sticky Bit en Linux"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-01-17
updatedDate: 2022-01-17
image: "https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-0.webp"
description: "Guía completa sobre permisos especiales en Linux: SGID, SUID y Sticky Bit. Aprende cómo funcionan, cómo identificarlos y los comportamientos de UID y GID en el sistema."
categories:
  - "linux"
draft: false
featured: false
lang: "es"
---

Todo el mundo conoce los clásicos permisos de Linux, read (r), write (w) y execute (x). Sin embargo, existen otros permisos especiales que son de los que vamos a estar hablando hoy. También vamos a estar viendo detalles importantes a conocer de los permisos en general y de como los posibles comportamientos del User ID o Group ID pueden afectarnos.

Índice:

- [Mini-fundamentos de Permisos en Linux](#mini-fundamentos-de-permisos-en-linux)
- [Permiso SGID](#permiso-sgid)
- [Permiso SUID](#permiso-suid)
- [Sticky Bit](#sticky-bit)
- [Comportamientos de UID y GID](#comportamientos-de-uid-y-gid)
- [Referencias](#referencias)

## Mini-fundamentos de Permisos en Linux

Aunque parezcan que los permisos son muy sencillos, sí que es cierto que tienen detallitos que hay que conocer para su completo entendimiento. Lo primero de todo es su estructura:

![Estructura de permisos en Linux mostrando SGID, SUID y Sticky Bit](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-1.avif)

Esto es lo más básico y seguramente ya lo conozcamos todos (si no, no pasa nada, acabas de aprenderlo).

Sabiendo esto, hablemos sobre la precedencia en los permisos. Por ejemplo, si yo siendo el usuario sikumy, creo un archivo texto.txt. Lo puedo leer sin problemas, y hacer lo que quiera con él:

![Creación de archivo con permisos por defecto](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-2.avif)

Como vemos, el archivo se crea con valor en propietario y grupo, sikumy. Todo guay hasta aquí, ahora bien, ¿qué ocurre si asigno permisos 070?, es decir, que nadie tenga ningún permiso, excepto las personas que pertenezcan al grupo sikumy, que lo tendrán todo. ¿Podré leer el archivo, siendo yo mismo sikumy, y aunque suene redundante, perteneciente al grupo sikumy?.

![Denegación de lectura con permisos 070](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-3.avif)

Pues la respuesta es que no, a pesar de yo estar en el grupo, no se me aplican los permisos asignados al mismo. Sin embargo, si soy otro usuario, por ejemplo, el usuario Coldd, y pertenezco al grupo sikumy, si podré leerlo:

![Usuario Coldd leyendo archivo con permisos de grupo](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-4.avif)

Esto ocurre por la precedencia de los permisos. La mejor forma de entenderlo es la siguiente:

- Leyendo los permisos del archivo de izquierda a derecha, nos vamos preguntando lo siguiente:
- ¿Soy el propietario del archivo? Si lo soy, se me aplican los permisos del propietario. Si no:
- ¿Soy miembro del grupo del archivo? Si lo soy, se me aplican los permisos del grupo. Si no:
- Los permisos de otros serían los que se me aplicasen

Por eso mismo, en el primer caso, a pesar de que el usuario sikumy sea del grupo con mismo nombre, no podrá leer el archivo, porque al ser el propietario, se le aplican los permisos del propietario. Lo contrario al usuario Coldd, como no es propietario, se le aplicarán los permisos del grupo porque es miembro del grupo, si no lo fuese, se le aplicarían los permisos de "Otros".

## Permiso SGID

El permiso SGID está relacionado con los grupos, tiene dos funciones:

- Si se establece en un **archivo**, permite que cualquier usuario ejecute el archivo como si fuese miembro del grupo al que pertenece el archivo.
- Si se establece en un **directorio**, a cualquier archivo creado en el directorio se le asignará como grupo perteneciente, el grupo del directorio.

Para los directorios, la lógica del SGID y el motivo de su existencia es por si trabajamos en grupo, para que todos podamos acceder a los archivos de las demás personas. Si SGID no existiera, cada persona cada vez que crease un archivo, tendría que cambiarlo del grupo suyo al grupo común del proyecto. Asimismo, evitamos tener que asignarle permisos a "Otros".

Ahora bien, ¿cómo identificamos el permiso SGID?

Cuando se asigna el permiso SGID, podemos notarlo porque en los permisos, en la parte de grupo, en el permiso de ejecución se asignará una `s`. Ojo, aquí hay que hacer dos distinciones:

- Si el archivo tiene permisos de ejecución, se le asignará una `s` minúscula.

![SGID con permisos de ejecución - s minúscula](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-5.avif)

- Si el archivo NO tiene permisos de ejecución, se le asignará una `S` mayúscula.

![SGID sin permisos de ejecución - S mayúscula](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-6.avif)

Esto realmente para los directorios no tiene relevancia, solo para los archivos. En cualquier caso, esta característica de `s` mayúscula o minúscula dependiendo del permiso de ejecución se aplica siempre, incluido en el permiso SUID.

Todo esto es muy bonito y tal, pero, ¿Cómo activamos SGID?

Para activarlo podemos usar cualquiera de los siguientes dos comandos:

- `chmod g+s <archivo>`
- `chmod 2*** <archivo>`

Siendo el `*` los permisos normales. (Ejemplo: `chmod 2755`)

## Permiso SUID

El permiso SUID permite que un archivo se ejecute como si del propietario se tratase, independientemente del usuario que lo ejecute, el archivo se ejecutará como el propietario. Ejemplo:

![Ejemplo de ejecución con permiso SUID](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-7.avif)

Al asignar permisos SUID, la salida del comando whoami, a pasado de ser sikumy a ser root. Esto porque como podemos ver, el propietario del binario de whoami, es root. Por lo tanto, está ocurriendo exactamente la definición que hemos dado arriba.

Eso si, una cosa a tener en cuenta y bastante importante, es que el permiso SUID no funciona en scripts, solo lo hace en binarios compilados. Esto se hace por razones de seguridad. En cualquier caso si quisieseis habilitar la ejecución de un script como otro usuario, siempre se puede tirar de sudo.

Ya lo vemos arriba, pero la forma de identificar el permiso SUID es mediante una `s` en el permiso de ejecución de los permisos del propietario. Aquí se aplica lo mismo que hemos mencionado en SGID, si el propietario no tiene permisos de ejecución, pero si permiso SUID, se verá como una `S` mayúscula, de lo contrario, minúscula, que es como debería de estar.

**¿Y qué ocurre con el permiso SUID en los directorios?**

El SUID no aplica a los directorios debido a que no hay una razón convincente de por qué debería. No puede funcionar de la misma manera que SGID. Linux no permite que un usuario entregue un archivo a otro usuario, el único capaz de hacer esto es root. Es decir, si yo soy el usuario sikumy, aunque yo sea el propietario de un archivo, no seré capaz de usar chown para entregar el archivo al usuario JuanSec, esta acción solo la puede hacer root.

**¿Cómo activamos SUID?**

Podemos hacerlo con alguno de los dos siguientes comandos:

- `chmod u+s <archivo>`
- `chmod 4*** <archivo>`

Siendo el `*` los permisos normales (Ejemplo: `chmod 4755`).

## Sticky Bit

El permiso Sticky Bit se puede aplicar tanto a archivos como directorios. Aunque lo más normal es aplicarlos a directorios. Las funciones de este permiso son las siguientes:

- A nivel de directorio, restringe la eliminación y modificación de los archivos del directorio a todos los usuarios aunque tengan permisos de escritura, excepto al propietario del archivo y root. Ejemplo:

![Sticky Bit bloqueando eliminación de archivo](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-8.avif)

A pesar de que el usuario Coldd tiene permisos de escritura, es incapaz de borrar el archivo porque no es ni el propietario ni root.

- Si este permiso se aplica a un archivo ejecutable. La primera vez que se ejecute, una copia del texto del programa se almacena en el área de swap ([área de intercambio](https://es.wikipedia.org/wiki/Espacio_de_intercambio)), para que la próxima vez que se ejecute el programa en la memoria, lo haga más rapido. Por texto del programa se entiende las instrucciones en código máquina del mismo. (No es muy común usar este permiso en archivos)

**¿Cómo lo identificamos?**

Si asignamos el Sticky Bit ya sea a un archivo o un directorio, a la hora de ver el permiso con `ls -l`, se verá tal que así:

`rwxrwxrwt`

Nótese la "`t`" al final.

**¿Cómo activamos STICKY BIT?**

Pues podemos usar cualquiera de los dos siguientes comandos:

- `chmod +t <archivo>`
- `chmod 1*** <archivo>`

Siendo el `*` los permisos normales. (Ejemplo: `chmod 1755`).

> Nótese como cada permiso, SUID, SGID y Sticky Bit, tienen un valor octal, al igual que los permisos normales. En este caso sería así:
> 
> 1 --> Sticky Bit  
> 2 --> SGID  
> 4 --> SUID  
> 7 --> Todos los anteriores

## Comportamientos de UID y GID

Por último, no tiene sentido este post y hablar de permisos si no hablamos sobre los ID de Usuarios y Grupos. Para empezar, hay que saber que todos los usuarios del sistema, tienen un identificador (UID), podemos comprobarlo en el archivo /etc/passwd:

![Archivo /etc/passwd mostrando UIDs de usuarios](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-9.avif)

Así mismo, los grupos también tienen identificadores, podemos comprobarlo en el archivo /etc/group:

![Archivo /etc/group mostrando GIDs de grupos](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-10.avif)

Sabiendo esto, podemos llegar a distinguir a nivel práctico, 3 comportamientos del UID:

- ID de Usuario Real (RUID) --> Identifica al propietario del proceso actual.
- ID de Usuario Efectivo (EUID) --> Se usa para gestionar los accesos a un recurso. También es el que se tiene en cuenta para determinar el propietario de un archivo cuando se crea. Básicamente, determina que podemos hacer, a que podemos acceder, etc. Se podría decir, que a nivel práctico, "somos el usuario que indica el EUID".
- ID de Usuario Guardado (SUID / Saved-User-ID) --> Se utiliza en archivos. Y permite que el proceso cambie su EUID. Cuando el proceso cambia su EUID, el EUID antes de cambiárselo, se almacena en el SUID para que cuando acabe el proceso, pueda volver a su EUID original.

> Nota: al igual que existen estos tres comportamientos del UID. Ocurre lo mismo con el GID (Group ID). Por lo que, con la misma definición, pero en grupos. Existen: RGID, EGID y SGID.

Todos los procesos tienen dos UIDs y dos GIDs (real y efectivo). Normalmente, cuando ejecutemos un programa, el UID y GID real serán el mismo que el UID y GID efectivo. Sin embargo, si ese programa tiene el SUID activado, el UID efectivo cambiarán. Asimismo, si tiene el permiso SGID activo, el GID efectivo cambiará.

Me explico, si soy el usuario sikumy y hay un binario con SUID cuyo propietario es root. Yo al ejecutarlo, mi UID real seguirá siendo el de sikumy, sin embargo, el UID efectivo será el de root.

El UID efectivo, como se ha dicho es el que determina los accesos y privilegios de un proceso. Por ejemplo, si solo quien tenga UID 22 puede acceder a un archivo, si tu RUID es 22 pero tu EUID (UID) es 35, no podrás leerlo.

Podemos ver de forma más clara la distinción entre los UID con el siguiente programa en C:

<figure>

![Código C para mostrar RUID y EUID](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-11.avif)

<figcaption>

No olvidemos que hay que compilarlo con gcc

</figcaption>

</figure>

Para que podáis copiarlo:

```c
#include <stdio.h>
#include <unistd.h>
#include <pwd.h>

int main(void){

    struct passwd *r_pwd = getpwuid(getuid());
    printf("El Usuario Real (RUID) es %s\n", r_pwd->pw_name);

    struct passwd *e_pwd = getpwuid(geteuid());
    printf("El Usuario Efectivo es %s\n", e_pwd->pw_name);

}
```

Este programa nos muestra el RUID y EUID cuando lo ejecutamos. El propietario y grupo del respectivo binario es sikumy:

![Permisos del binario sin SUID](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-12.avif)

Ahora mismo el archivo no tiene ningún permiso especial como SUID, por lo que si lo ejecuta el usuario Coldd:

![Ejecución sin SUID mostrando Coldd como RUID y EUID](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-13.avif)

Nos saldrá que tanto el usuario real como efectivo es Coldd. Sin embargo, si ahora el usuario sikumy asigna permisos SUID, el usuario efectivo cuando lo ejecute Coldd, debería de ser sikumy:

![Asignación de permiso SUID al binario](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-14.avif)

![Ejecución con SUID mostrando sikumy como EUID](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-15.avif)

Efectivamente cambia. El RUID es el usuario Coldd porque es quien inicia el proceso, sin embargo, a nivel práctico y de acceder a recursos y demás, será como si fuésemos el usuario sikumy.

Y esta es básicamente la idea de los distintos UID que podemos encontrar. Es importante conocer esto, ya que nos puede ayudar a entender más el propio sistema Linux o ayudarnos en alguna situación en la que nos podamos encontrar.

El ejemplo más evidente sobre entender mejor el sistema Linux tiene relación con el binario passwd. Este binario tiene por defecto asignado permiso SUID:

![Binario passwd con permiso SUID](https://cdn.deephacking.tech/i/posts/permisos-sgid-suid-stickybit/permisos-sgid-suid-stickybit-16.avif)

Tiene sentido, ya que el único que puede cambiar contraseñas en el sistema es root.

Ahora bien, con las definiciones que tenemos podemos pensar:

- Oye, pero si el binario es permiso SUID y el propietario es root. Cuando yo lo ejecuto, ¿por qué en vez de cambiar mi contraseña, no estoy cambiando la de root?

Pues es una razón bastante simple y que podemos entender gracias a los UID. Es cierto que al ejecutar el binario de passwd, nuestro EUID será el de root. Sin embargo, el binario, para determinar de que usuario cambiar la contraseña, se fija en el RUID, el cual sigo siendo yo, el usuario normal.

Por lo que en conclusión, somos capaces de cambiar la contraseña gracias al EUID, y no cambiamos la contraseña de root porque el binario se fija en el RUID para ver de cuál usuario cambiar la contraseña.

## Referencias

- [SUID bit on directories](https://superuser.com/questions/1013867/suid-bit-on-directories)
- [SUID doesn't work in Bash](https://stackoverflow.com/questions/25001206/suid-doesnt-work-in-bash)
- [SUID, SGID Explained](https://www.cs.du.edu/~ramki/courses/security/forensics/notes/SUID.pdf)
- [Why can't an SGID program read a file from the same group if it's used by another user?](https://unix.stackexchange.com/questions/178381/why-cant-an-sgid-program-read-a-file-from-the-same-group-if-its-used-by-anothe)
- [Why can't I read a file when I have group permissions](https://superuser.com/questions/549955/why-cant-i-read-a-file-when-i-have-group-permissions)
- [Precedence of user and group owner in file permissions](https://unix.stackexchange.com/questions/134332/precedence-of-user-and-group-owner-in-file-permissions)
- [Difference between Real User ID, Effective User ID and Saved User ID](https://stackoverflow.com/questions/32455684/difference-between-real-user-id-effective-user-id-and-saved-user-id)
- [UNIX Concepts And Applications](https://books.google.es/books?id=qX3CCAnjSPwC&pg=PA180&dq=effective+uid&hl=es&sa=X&ved=2ahUKEwi7kbDq1ar1AhUJzhoKHSrSCCEQ6AF6BAgIEAI#v=onepage&q=effective%20uid&f=false)
- [SUID bit on binary file still yielding "Permission denied" error](https://unix.stackexchange.com/questions/401351/suid-bit-on-binary-file-still-yielding-permission-denied-error)
- [Brief Overview of Real and Effective IDs in Linux C](https://aljensencprogramming.wordpress.com/2014/04/23/brief-overview-of-real-and-effective-ids-in-linux-c/)
- [Advanced Programming in the UNIX Environment](https://books.google.es/books?id=kCTMFpEcIOwC&pg=PA108&dq=sticky+bit&hl=es&sa=X&ved=2ahUKEwikx-vKm631AhWsy4UKHcMUAxgQ6AF6BAgFEAI#v=onepage&q=sticky%20bit&f=false)
