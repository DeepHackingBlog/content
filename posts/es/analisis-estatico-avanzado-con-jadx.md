---
id: "analisis-estatico-avanzado-con-jadx"
title: "Análisis estático avanzado con Jadx"
author: "pablo-castillo"
publishedDate: 2026-10-16
updatedDate: 2026-10-16
image: ""
description: "Análisis de código estático avanzado de aplicaciones Android con Jadx"
categories:
  - "mobile-pentesting"
draft: false
featured: false
lang: "es"
---

¡Hola de nuevo! En el artículo anterior dimos nuestros primeros pasos en el análisis estático de aplicaciones Android. Vimos en qué consiste, por qué es una parte fundamental de cualquier auditoría y preparamos nuestro arsenal de herramientas indispensables. Si recordáis, hice una mención especial a *Jadx*, comentando que era, con total seguridad, la herramienta más importante para leer el código de las aplicaciones Android. Pues bien, ha llegado el momento de cumplir esa promesa y ponerla en el centro del escenario.

En este post vamos a exprimir *Jadx* a un nivel más avanzado: veremos la lógica que hay detrás de un análisis, cómo seguir el rastro de los datos por dentro de la aplicación, cómo pelearnos con el código ofuscado y qué hacer cuando la herramienta no es capaz de mostrarnos el código.

Doy por hecho que ya tenéis *Jadx* instalado y que sabéis abrir una *APK* y moveros por sus pestañas, ya que eso lo vimos en el artículo anterior. Si no es así, os recomiendo que le echéis un vistazo antes de continuar con el artículo. Lo podéis encontrar [aquí](https://blog.deephacking.tech/es/posts/introduccion-al-analisis-estatico-en-aplicaciones-android/).

Para todo el artículo vamos a trabajar con una aplicación vulnerable llamada ***InsecureShop***, diseñada precisamente para practicar este tipo de análisis. Podéis descargarla desde su web oficial:

- [https://insecureshopapp.com/](https://insecureshopapp.com/)

La razón de elegir esta aplicación es que tiene la cantidad justa de vulnerabilidades y componentes para que el recorrido sea entretenido; no es demasiado simple como algunas otras aplicaciones vulnerables cuyo análisis manual sería muy reducido, por lo que podremos lucirnos un poco más con el uso de las distintas funcionalidades que posee *Jadx*.

Dicho esto, vamos a darle caña.

- [La lógica del análisis: por dónde se empieza una APK](#la-lógica-del-análisis-por-dónde-se-empieza-una-apk)
- [Xrefs: seguir el rastro en lugar de leer código](#xrefs-seguir-el-rastro-en-lugar-de-leer-código)
- [Desofuscación y renombrado: construir tu propio mapa](#desofuscación-y-renombrado-construir-tu-propio-mapa)
- [Cuando Jadx no puede: leyendo smali](#cuando-jadx-no-puede-leyendo-smali)
- [Exportar el proyecto: cuándo tiene sentido y cuándo no](#exportar-el-proyecto-cuándo-tiene-sentido-y-cuándo-no)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

## La lógica del análisis: por dónde se empieza una APK

Antes de tocar una sola clase, conviene tener claro un concepto que mucha gente que empieza pasa por alto: **el análisis estático no consiste en leer código de arriba abajo**. Una aplicación mediana puede tener cientos o miles de clases, y si os ponéis a leerlas una por una os vais a volver locos y no habréis encontrado nada. El análisis estático consiste en **seguir los datos**: identificar por dónde entra la información que nosotros controlamos y perseguirla hasta ver dónde acaba y qué se hace con ella por el camino.

Para ordenar este proceso, a mí me gusta seguir siempre un recorrido parecido. No es una regla escrita en acero, pero sí una metodología que os va a servir como punto de partida en prácticamente cualquier auditoría:

**1. El AndroidManifest.xml.** Siempre, siempre se empieza aquí. Como ya explicamos en el artículo anterior, este fichero es el mapa de la aplicación. Lo que buscamos en una primera lectura es lo siguiente:

- Los **permisos** que solicita la aplicación, que nos dan una primera idea de qué es capaz de hacer (acceso a ficheros, a la cámara, a SMS, etc.).
- Los **componentes exportados**. Un componente exportado es un componente al que **otra aplicación puede acceder**, es decir, una puerta de entrada a la aplicación desde el exterior y, por tanto, una parte fundamental de nuestra superficie de ataque. Un componente se considera exportado cuando declara `android:exported="true"` de manera explícita, pero **ojo con un matiz importante**: cualquier componente que declare un `<intent-filter>` pasa a estar exportado automáticamente aunque no lleve dicho atributo (este era el comportamiento por defecto hasta Android 12, momento en el que se obligó a declararlo de forma explícita). Es un detalle que se le escapa a mucha gente y que deja puertas abiertas sin que el desarrollador sea consciente de ello.
- Los **deeplinks**, que reconoceremos por las etiquetas `<intent-filter>` que contienen un `<data android:scheme="...">` junto con la categoría `BROWSABLE`. Un deeplink permite abrir un componente de la aplicación desde una simple URL, lo que amplía todavía más esa superficie de ataque.
- Configuraciones generales peligrosas como `android:debuggable="true"`, `android:allowBackup="true"` o `android:usesCleartextTraffic="true"`.

![AndroidManifest.xml de InsecureShop en Jadx con permisos y atributos debuggable, allowBackup y usesCleartextTraffic resaltados](images/image.png)

En el caso de *InsecureShop*, una primera lectura del manifest ya nos deja bastante trabajo sobre la mesa. Vemos que la aplicación es **depurable** (`android:debuggable="true"`), permite **copias de seguridad** (`android:allowBackup="true"`) y admite **tráfico en claro** (`android:usesCleartextTraffic="true"`). Además, encontramos dos activities exportadas de forma explícita, `AboutUsActivity` y `ResultActivity`, un **content provider exportado** (`InsecureShopProvider`) y hasta un servicio exportado (`UploadService`).

Pero si hay algo que llama la atención son las dos activities que gestionan *WebViews*. Por un lado, la ***WebViewActivity***, que define un deeplink con el esquema `insecureshop://com.insecureshop` y la categoría `BROWSABLE`, lo que significa que **podremos invocarla desde el navegador del dispositivo con una simple URL**. Por otro, la ***WebView2Activity***, que se expone a través de una action personalizada (`com.insecureshop.action.WEBVIEW`). Fijaos que ninguna de las dos lleva el atributo `android:exported="true"`, pero ambas están exportadas por el simple hecho de declarar un `<intent-filter>`, tal y como acabamos de explicar:

![Declaración en el manifest de WebViewActivity con deeplink insecureshop:// y de WebView2Activity con su action personalizada](images/image%201.png)

**2. De los componentes al código.** Una vez identificados los componentes que nos interesan (las puertas de entrada), saltamos a su código para ver cómo tratan la información que reciben. Aquí es donde entra en juego la idea de *source* y *sink* que veremos en el siguiente apartado. Nos interesa especialmente cómo se recuperan los datos que llegan del exterior, con llamadas del tipo `getIntent()`, `getStringExtra()`, `getData()`, etc.

**3. Búsqueda de información sensible.** En paralelo, hacemos un barrido con el buscador (recordad, el `Ctrl+Shift+F` que vimos en el artículo anterior) rastreando términos jugosos como `http`, `password`, `token`, `api_key`, `secret` o `key`. Como ya comentamos, es habitual que los desarrolladores dejen credenciales *hardcodeadas*, URLs de servidores internos y *endpoints* olvidados dentro del propio código.

![Búsqueda global de texto en Jadx mostrando las coincidencias de https:// en el código de InsecureShop](images/image%202.png)

**4. Revisión de recursos y assets.** No todo está en el código. La pestaña de *Resources* guarda el `strings.xml`, ficheros de configuración y, en ocasiones, sorpresas dentro de la carpeta `assets/`. Merece la pena echar siempre un vistazo.

![Fichero strings.xml de InsecureShop abierto desde resources.arsc en Jadx](images/image%203.png)

## Xrefs: seguir el rastro en lugar de leer código

Llegamos a la que, para mí, es la funcionalidad más importante de *Jadx* y a la vez la más desaprovechada por quien empieza. Si en el apartado anterior os decía que el análisis estático consiste en seguir los datos, las **xrefs** (referencias cruzadas) son precisamente la herramienta que nos permite hacerlo.

La idea es sencilla. El buscador que vimos en el artículo anterior nos da **puntos sueltos**: sabemos que en algún sitio se usa `loadUrl`, que en otro hay una cadena con `password`, etc. Pero un punto suelto no nos dice gran cosa. Lo que de verdad nos interesa es **el camino que une esos puntos**: de dónde viene ese dato, quién llama a ese método, quién lee ese campo. Y eso es exactamente lo que nos dan las xrefs.

En *Jadx*, sobre cualquier clase, método, campo o constante, podemos pulsar la tecla `X` (o botón derecho → *Find Usage*) para que nos muestre **todos los lugares desde los que se referencia ese elemento**. Acostumbraos a usar la `X` incluso más que el `Ctrl+Shift+F`, porque es lo que marca la diferencia entre analizar de verdad y dar palos de ciego.

![Menú contextual de Jadx con la opción Find Usage (tecla X) sobre la clase WebView2Activity](images/image%204.png)

### Source y sink: los dos extremos del camino

Antes de seguir conviene interiorizar dos conceptos que vais a escuchar constantemente en el análisis estático:

- El **source** (fuente) es el punto por donde entra un dato que nosotros controlamos. En Android, los *sources* más habituales son los datos que llegan a un componente exportado: lo que se recupera con `getIntent()`, `getData()`, `getStringExtra()`, los parámetros de un *deeplink*, la información que llega a un *content provider*, etc.
- El **sink** (sumidero) es el punto donde ese dato acaba haciendo algo peligroso. Hablamos de llamadas como `loadUrl()` en un *WebView*, `Runtime.exec()` para ejecutar comandos, `rawQuery()` en una base de datos, operaciones de fichero, etc.

> Una vulnerabilidad, en la mayoría de los casos, no es más que un dato que viaja desde un *source* hasta un *sink* sin que nadie lo valide por el camino. Y las xrefs son lo que nos permite recorrer ese viaje sin tener que leernos la clase entera adivinando.
> 

### Un caso real en InsecureShop

Vamos a aplicarlo sobre la ***WebViewActivity*** que localizamos en el manifest. Recordad que era una activity exportada (a través de su `<intent-filter>`) con un *deeplink* de esquema `insecureshop://com.insecureshop`. Es decir, tenemos un *source* claro: cualquiera puede invocar esta activity desde el navegador con una URL de ese esquema.

El siguiente paso es saltar a su código y ver qué hace con lo que recibe. Al abrir la clase, encontramos que recupera los datos del *intent* que la ha lanzado y, tras una comprobación, termina cargando una URL en el *WebView*:

![Método onCreate de WebViewActivity mostrando el flujo desde getData() hasta loadUrl()](images/image%205.png)

Aquí es donde las xrefs brillan. En este caso concreto, el recorrido *hacia atrás* de la URL (del `loadUrl()` hasta el `getData()` inicial) es corto y lo podemos seguir con la vista, ya que todo ocurre dentro del mismo `onCreate`. Pero fijaos en la línea 108, justo debajo del `loadUrl()`:

```java
Prefs.INSTANCE.getInstance(this).setData(data);
```

La aplicación no se limita a cargar la URL: además **la guarda de forma persistente** mediante `Prefs.setData()`. Y aquí surge la pregunta que no podemos responder a ojo: **¿quién más lee ese dato después?** Este es el otro sentido en el que trabajan las xrefs. Antes perseguíamos el dato *hacia atrás* para saber de dónde venía; ahora lo perseguimos *hacia adelante* para ver a dónde llega. Para averiguarlo, nos colocamos sobre el método `setData` y pulsamos `X`:

![Resultado de Find Usage sobre setData con las llamadas desde PrivateActivity y WebViewActivity](images/image%206.png)

El resultado es revelador. *Jadx* nos muestra que `setData` se invoca desde **dos** sitios: la propia `WebViewActivity` (donde estamos) y, atención, la `com.insecureshop.PrivateActivity`. Es decir, el dato que un atacante mete a través del deeplink no se queda aquí, sino que viaja hasta otra activity completamente distinta a través de las `SharedPreferences`. Esto es algo que jamás habríamos descubierto leyendo la `WebViewActivity` de arriba abajo, y es la esencia de por qué las xrefs son tan potentes: nos permiten ver cómo circula un dato **por toda la aplicación**, saltando de una clase a otra.

Haciendo el recorrido completo confirmamos la cadena: el esquema del deeplink → la recuperación del parámetro `url` en la activity → el `loadUrl()` que lo carga → y su persistencia en `Prefs`, que otras clases leerán más adelante. Con esto no solo hemos confirmado la vulnerabilidad del WebView, sino que además hemos destapado un nuevo componente, la `PrivateActivity`, que ahora nos toca revisar para ver qué hace exactamente con ese dato que recupera. Así es como un único hallazgo va tirando del hilo y ampliando la superficie de análisis.

### Por qué las xrefs son imprescindibles con código ofuscado

Guardo para el final el motivo que, en lo personal, convierte a las xrefs en la funcionalidad estrella. Cuando nos enfrentamos a una aplicación ofuscada (que serán la mayoría de las que encontréis en las stores oficiales, como ya adelantamos en el artículo anterior), los nombres de clases, métodos y variables no significan absolutamente nada: nos encontraremos cosas como `a.b.c` o `d(String, int)`. En ese escenario, leer el código se vuelve una tortura.

Sin embargo, hay algo que la ofuscación no puede tocar: el grafo de llamadas. Los nombres mienten, pero quién llama a quién no. Si vemos que ese misterioso método `a.b.c()` se invoca desde el `onCreate` de la activity principal, ya tenemos una pista enorme sobre qué hace, aunque su nombre no nos diga nada. Las xrefs son, en muchas ocasiones, lo único fiable que nos queda para entender la estructura de una aplicación ofuscada, y son también el primer paso para lo que veremos en el siguiente apartado: empezar a renombrar las cosas para construir nuestro propio mapa.

## Desofuscación y renombrado: construir tu propio mapa

Aquí conviene separar desde el principio dos cosas que mucha gente confunde: la *desofuscación* automática que ofrece *Jadx* y el *renombrado* manual que hacemos nosotros. No son lo mismo, ni de lejos.

### El desofuscador de Jadx: qué hace y qué no hace

*Jadx* incorpora un desofuscador que se activa en *Archivo → Preferencias → Desofuscación*. Lo primero que hay que entender es qué podéis esperar de él, porque el nombre genera muchas expectativas equivocadas.

![Ventana de preferencias de Jadx con la opción de desofuscación activada](images/image%207.png)

**El desofuscador no recupera los nombres originales del código**. Eso es completamente imposible: cuando un desarrollador ofusca su aplicación con ProGuard o R8, los nombres originales se destruyen y no quedan almacenados en ninguna parte de la APK. Lo que hace *Jadx* es algo más modesto pero igualmente útil: asigna nombres estables y únicos a los elementos ofuscados, de forma que puedas navegar sin volverte loco. Es la diferencia entre tener quince clases llamadas `a`, `b`, `c` que se repiten por todos lados, y tener nombres del tipo `C0001a`, `C0002b`, que al menos son inequívocos y te permiten seguirles la pista.

> Hay un detalle práctico que os va a ahorrar disgustos: decidid si activáis el desofuscador **al principio** de la auditoría y no lo toquéis más. Si lo activáis o desactiváis a mitad de análisis, los nombres generados cambian, y todas las notas que hayáis ido tomando (o los renombrados que hayáis hecho) dejarán de cuadrar. Es de esas cosas que solo aprendes cuando te pasa una vez y pierdes media tarde.
> 

### El renombrado manual: aquí está el trabajo de verdad

Si el desofuscador es la herramienta automática, el renombrado manual es el trabajo artesanal, y es donde realmente construimos nuestro mapa de la aplicación. La mecánica es simple: nos colocamos sobre cualquier clase, método, campo o variable, pulsamos la tecla `N` (o botón derecho → *Rename*) y le ponemos un nombre que tenga sentido para nosotros.

![Diálogo de renombrado de Jadx sobre la clase WebViewActivity](images/image%208.png)

La clave está en que *Jadx* propaga el cambio a todas las referencias de ese elemento de forma automática. Es decir, cada vez que renombramos algo, todo el código que lo utilizaba queda al instante más legible. Y aquí se produce un efecto bola de nieve: conforme vamos entendiendo y renombrando, `a.b.c` pasa a ser `CryptoHelper`, su método `d(String, String)` pasa a ser `encryptPayload`, y de repente una clase que era ilegible empieza a contar una historia. Este es, precisamente, el proceso que convierte una aplicación ofuscada de "imposible de leer" a "lenta pero perfectamente abordable".

Como InsecureShop no está ofuscada, sus nombres ya son descriptivos y no necesitamos renombrar nada para entenderla. Pero el mecanismo es idéntico, y en una aplicación ofuscada de verdad es donde esta técnica se vuelve imprescindible. Para ilustrarlo voy a apoyarme en otra aplicación de prácticas, la *UnCrackable App for Android Level 1* de OWASP, cuyo código sí está ofuscado.

Fijaos en el siguiente fragmento de su `MainActivity`. Nada más abrirlo nos encontramos con clases y métodos de una sola letra (`c.a()`, `c.b()`, `c.c()`, `b.a()`, `a.a()`) que, a priori, no nos dicen absolutamente nada:

![MainActivity ofuscada de UnCrackable Level 1 con las llamadas c.a(), c.b(), c.c() y b.a() resaltadas](images/image%209.png)

Y, sin embargo, la propia aplicación se delata. Aquí es donde entra en juego lo que os comentaba: la ofuscación no puede tocar las cadenas de texto. Si observamos el `onCreate`, vemos que el resultado de `c.a() || c.b() || c.c()` desemboca en un mensaje `"Root detected!"`, y que `b.a()` hace lo propio con `"App is debuggable!"`. Con solo eso ya podemos deducir que ese paquete `c` contiene las comprobaciones de root y que `b.a()` es la comprobación de *debuggable*, así que podríamos renombrarlos a algo como `RootChecker`, `isDeviceRooted()` o `isDebuggable()`. De un vistazo, y sin ejecutar nada, hemos empezado a reconstruir el mapa de la aplicación.

### No pierdas tu trabajo: el proyecto .jadx

Todo este esfuerzo de renombrar, comentar y ordenar tiene un enemigo mortal: cerrar la ventana. Por defecto, si cerráis *Jadx* perderéis todos los cambios y la próxima vez tendréis que empezar de cero. Para evitarlo, *Jadx* permite guardar el trabajo en un proyecto propio con extensión `.jadx` (*File → Save project*), que conserva los renombrados, los comentarios y los marcadores que hayáis ido añadiendo. Acostumbraos a guardar el proyecto igual que guardaríais cualquier otro documento, porque un análisis serio se hace en varias sesiones y no querréis rehacer el mapa cada vez.

### Lo que la ofuscación no puede tocar

Termino con un apunte que os va a resultar muy útil cuando os toque pelearos con una app ofuscada de verdad. Aunque los nombres de clases y métodos estén destrozados, hay elementos que el ofuscador no puede alterar sin romper el funcionamiento de la aplicación, y que se convierten en nuestras mejores pistas para renombrar con criterio:

- Las **cadenas de texto y los mensajes de log**, que muchas veces delatan qué hace una clase.
- Los **nombres de recursos** (layouts, strings, ids), que siguen siendo legibles y suelen dar contexto sobre la pantalla o la función a la que pertenecen.
- Las **anotaciones** que sobreviven a la ofuscación. Aquí hay dos joyas: los `@SerializedName` de los modelos de Gson y las interfaces de Retrofit, porque conservan intactos los nombres de los campos y los *endpoints* de la API. En una app ofuscada, encontrar una interfaz de Retrofit es como encontrar un mapa del tesoro con el listado completo de llamadas al servidor.

Con el desofuscador activado, un buen puñado de clases renombradas y el proyecto guardado, tenemos ya un mapa mucho más claro de la aplicación. Pero antes de dar por cerrado el tema, nos queda ver qué hacer cuando *Jadx* directamente no es capaz de mostrarnos el código.

## Cuando Jadx no puede: leyendo smali

Hasta ahora hemos dado por sentado que *Jadx* nos devuelve un código Java limpio y legible. Y la mayoría de las veces será así. Pero conviene que sepáis que *Jadx* falla más a menudo de lo que la gente cree, y que hay que estar preparado para esos momentos.

Recordad lo que ya adelantamos en el artículo introductorio: *Jadx* no lee Java directamente, sino que lo reconstruye a partir del *bytecode* de Dalvik (los ficheros `.dex`). El problema es que existe *bytecode* perfectamente válido para Dalvik que no tiene una traducción posible a Java: flujos de control que ningún compilador de Java generaría jamás, saltos imposibles de representar con estructuras normales, y trucos anti-descompilación que meten a propósito los protectores comerciales como DexGuard precisamente para reventar herramientas como esta.

Cuando *Jadx* se topa con uno de estos casos, no os va a devolver el código como si nada. En su lugar os encontraréis con señales del tipo:

- Comentarios como `/* JADX WARNING: ... */`.
- El clásico `/* Code decompiled incorrectly, please refer to instructions dump */`.
- Métodos que aparecen vacíos, o directamente una excepción del propio descompilador.

Y aquí viene lo importante, que no es casualidad: las clases que fallan al descompilar suelen ser justamente las más interesantes. Comprobaciones de root, protecciones anti-tamper, validación de licencias, rutinas de cifrado... Muchas veces están protegidas a propósito, y el hecho de que *Jadx* tropiece con ellas es en sí mismo una pista de que ahí hay algo que alguien no quería que leyéramos con comodidad.

### Ver el código que Jadx esconde

Lo primero que os recomiendo es activar la opción *Show inconsistent code* dentro de las preferencias de descompilación (*Archivo → Preferencias → Descompilación*). Con ella marcada, *Jadx* os mostrará su mejor intento de reconstrucción aunque el resultado sea imperfecto, en lugar de esconderos el método directamente. No será un Java bonito, pero muchas veces es suficiente para entender la lógica:

![Preferencias de descompilación de Jadx con la opción Mostrar código inconsistente activada](images/image%2010.png)

Cuando ni con eso conseguimos sacar nada en claro, toca bajar un peldaño y leer el *smali* directamente. El smali, como comentamos en el artículo anterior, es esa especie de "ensamblador" del *bytecode* de Dalvik. Es bastante más árido que el Java, pero tiene una ventaja enorme: es lo que la aplicación ejecuta de verdad, así que no miente ni se queda a medias. En *Jadx* podemos ver el smali de cualquier clase seleccionando la pestaña correspondiente en el panel de código:

![Código smali de MainActivity de UnCrackable Level 1 en la pestaña Smali de Jadx](images/image%2011.png)

### Por qué esto os importa: el enlace con Frida

Llegados a este punto, alguno se estará preguntando para qué quiere leer smali si lo suyo es la explotación. Pues bien, hay un motivo muy concreto que conecta directamente con nuestros artículos sobre análisis dinámico y Frida.

Cuando queremos *hookear* un método con *Frida*, necesitamos su firma exacta. Y si el método está sobrecargado (varias versiones con el mismo nombre pero distintos parámetros), tenemos que especificar los tipos con un `.overload(...)` para decirle a *Frida* a cuál de todas nos referimos. El problema es que el Java que reconstruye *Jadx* a veces nos miente con los tipos: simplifica, asume o directamente se equivoca. El smali, en cambio, nos da los descriptores de tipos tal y como son, sin ninguna ambigüedad.

Dicho de otro modo: cuando vayáis a escribir un hook sobre un método ofuscado o sobrecargado y no os funcione, el smali es donde vais a encontrar la firma real que necesitáis. No se trata de aprender smali a fondo ni de programar en él, sino de saber leerlo lo justo para extraer ese dato cuando el Java os falle. Con eso os ahorraréis más de un dolor de cabeza a la hora de instrumentar una aplicación.

## Exportar el proyecto: cuándo tiene sentido y cuándo no

Cerramos la parte manual con una funcionalidad que conviene poner en su sitio: la exportación del proyecto. *Jadx* permite volcar todo el código descompilado a disco desde *File → Save as gradle project*, dejándonos una estructura de carpetas con el código Java, los recursos y el manifest, lista para abrir con cualquier editor.

Vamos a separar cuándo merece la pena y cuándo no.

Sí que merece la pena para:

- Comparar dos versiones de la misma aplicación. Este es, para mí, el uso estrella. Si exportáis la versión 1.2 y la 1.3 de una app y le pasáis un simple `diff`, veréis exactamente qué han tocado entre una y otra. En un *retest* esto es demoledor, porque os dice de un vistazo si han corregido de verdad un hallazgo o simplemente lo han maquillado.
- Pasar herramientas sobre todo el código a la vez. Con el código en disco podéis lanzar un `ripgrep` con expresiones regulares en condiciones, o reglas de Semgrep orientadas a Android, sobre el conjunto completo de la aplicación.

No merece la pena para:

- Leer el código. Para leer y navegar se usa *Jadx-gui*, sin discusión. En cuanto exportáis perdéis las `xrefs` y toda la navegación entre clases, que es justamente lo que hace útil a la herramienta. Leer código exportado en un editor normal es dar un paso atrás.
- Metérselo a una IA. Mucha gente exporta el código con la idea de pegárselo a un modelo para que lo analice. Y aunque la intención es buena, meterle a un modelo miles de líneas de código de golpe es incómodo y poco eficiente, y rara vez da buenos resultados.

Añado, por último, un par de avisos prácticos: en aplicaciones grandes la exportación es lenta y genera un buen montón de ficheros, y el código exportado no siempre compila (recordad que es una reconstrucción, no el código fuente original). Así que no os frustréis si intentáis abrirlo como un proyecto normal y os llueven los errores; para lo que sirve (diffear y hacer barridos con herramientas) funciona perfectamente igual.

## Conclusión

Hemos dejado atrás el uso básico que vimos en el artículo introductorio para meternos de lleno en las funcionalidades que de verdad marcan la diferencia a la hora de analizar una aplicación. Hemos aprendido que el análisis estático no consiste en leer código sin más, sino en seguir el rastro de los datos con las xrefs; hemos visto cómo construir nuestro propio mapa de una aplicación ofuscada a base de desofuscación y renombrado; hemos aprendido qué hacer cuando *Jadx* no es capaz de mostrarnos el código y nos toca bajar al smali; y hemos puesto en su sitio la exportación del proyecto, sabiendo ahora para qué sirve realmente y para qué no.

Con todo esto, ya tenéis un dominio de *Jadx* muy por encima de lo que la mayoría llega a exprimir de la herramienta. Mi consejo es siempre el mismo: practicad. Coged cualquiera de las aplicaciones vulnerables que hay repartidas por los distintos recursos y repositorios y perdeos un rato dándole a la `X`, renombrando clases y trasteando con sus opciones. No hay mejor manera de interiorizar todo esto que ensuciarse las manos.

Nos vemos pronto con más novedades. Espero que os haya servido de ayuda para llevar vuestro análisis estático al siguiente nivel. ¡Contadme en comentarios qué funcionalidades de *Jadx* no conocíais y si echáis en falta alguna!

Gracias por estar al otro lado. ¡Un abrazo! 🙂

## Referencias

- [https://github.com/skylot/jadx](https://github.com/skylot/jadx)
- [https://github.com/skylot/jadx/wiki](https://github.com/skylot/jadx/wiki)
- [https://insecureshopapp.com/](https://insecureshopapp.com/)
- [https://github.com/OWASP/mastg/tree/master/Crackmes/Android/Level_01](https://github.com/OWASP/mastg/tree/master/Crackmes/Android/Level_01)
- [https://mas.owasp.org/MASTG/](https://mas.owasp.org/MASTG/)
- [https://frida.re/docs/javascript-api/](https://frida.re/docs/javascript-api/)