---
id: "de-postal-antigua-a-ubicacion-exacta"
title: "De una postal antigua a la ubicación actual exacta"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2023-12-24
updatedDate: 2023-12-24
image: "https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-0.webp"
description: "Investigación OSINT para determinar la ubicación exacta de una postal antigua italiana mediante técnicas de restauración de imagen, búsqueda inversa y análisis geográfico."
categories:
  - "osint"
draft: false
featured: false
lang: "es"
---

El otro día, mientras me programaba un par de cosas, mi hermana fue a ver unos puestos de navidad que habían puesto en mi ciudad. Al parecer, en uno de ellos se encontró dentro de un libro una postal presuntamente de origen italiana con la siguiente foto:

![Postal antigua italiana encontrada en un libro](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-1.avif)

Cuando me la enseñó dije, oye, pues estaría guay sacar la ubicación exacta. Y de esto trata básicamente este artículo : )

- [Referencias](#referencias)
- [Edit 02/01/2024 - GeoSpy AI](#edit-02012024---geospy-ai)

Lo primero que hice fue hacerle una foto con el móvil (sí, lo ideal sería escanearla, pero tampoco soy tan rico como para tener una impresora):

![Fotografía de la postal antigua con el móvil](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-2.avif)

Se puede observar como la foto no solo es antigua, sino que también se encuentra deteriorada, por tanto, lo mejor es intentar reconstruirla un poco para que tenga más calidad y sea más sencillo buscar a través de ella. Así que lo que hice fue hacer uso de _[Cleanup.pictures](https://cleanup.pictures/)_:

![Interfaz de Cleanup.pictures para restaurar imágenes](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-3.avif)

Esta web te permite de forma super sencilla y bastante eficiente, limpiar objetos de imágenes, etc. Por tanto, la usé para quitar los desperfectos de la imagen a través del pincel que te proporciona:

![Uso del pincel de Cleanup.pictures para eliminar desperfectos](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-4.avif)

![Proceso de limpieza de la postal antigua](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-5.avif)

Una vez retoqué un poco lo que yo consideraba que se podía solucionar pasamos de esta imagen:

![Postal original con desperfectos visibles](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-6.avif)

A esta:

![Postal después de la limpieza con Cleanup.pictures](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-7.avif)

Una imagen más limpia y sin tanto deterioro. Sin embargo, algo común en imágenes antiguas es el "ruido" que contienen, así que también sería ideal eliminar o solucionar esto.

Para ello, hoy en día existen múltiples herramientas a través de IA que te permiten "recuperar fotos antiguas". La que usé yo concretamente fue _[jpghd](https://jpghd.com/)_ por el simple hecho de que no me tenía que registrar (me daba pereza) y era parcialmente gratuita. Además, el resultado que te proporciona sin haber pagado es bastante decente, al menos para lo que yo quería.

![Página principal de jpghd para restaurar fotos antiguas](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-8.avif)

El uso es bastante simple, subes la imagen:

![Subida de imagen a jpghd](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-9.avif)

Y defines la configuración y cambios que quieres aplicar:

![Opciones de configuración en jpghd](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-10.avif)

Como es la versión gratuita tampoco se puede retocar mucho, pero con lo que veis en la imagen es suficiente.

Una vez le das a "Start", simplemente esperas a que se procese, a mayor AI Enlarge (reescalado) le demos, mayor tardará, pero no tardará más de 5 minutos:

![Proceso de restauración iniciado en jpghd](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-11.avif)

![Barra de progreso del procesamiento de la imagen](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-12.avif)

Una vez terminó el proceso, me dio el siguiente resultado:

![Postal restaurada con IA de jpghd](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-13.avif)

Una imagen mucho más nítida, que no quita que se pueda llegar a ver un poco artificial, pero en comparación a lo que teníamos antes:

![Comparación de la postal original sin restaurar](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-14.avif)

Está mucho mejor ahora.

Llegados a este punto, he dado más o menos solución a los deterioros de la imagen y esa sensación de imagen antigua. Por tanto, es hora de usar la imagen resultante para las búsquedas.

Lo primero que hice fue subir la imagen a _[labs.tib.eu](https://labs.tib.eu/geoestimation/)_, concretamente a la herramienta "Geolocation Estimation":

![Herramienta Geolocation Estimation en TIB Labs](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-15.avif)

Esta herramienta consiste en lo siguiente:

> GeoEstimation utiliza redes neuronales convolucionales (CNN) para la estimación de la geolocalización. Al subir una foto, la red analiza visualmente la imagen para identificar características geográficamente distintivas. La herramienta genera un mapa de calor que muestra las áreas más probables donde se tomó la foto, basándose en el aprendizaje de un gran conjunto de datos de imágenes geolocalizadas. Además, utiliza técnicas de "visualización de decisiones" para resaltar las partes de la imagen que fueron más influyentes en la decisión de la red. La clasificación en entornos interiores, naturales y urbanos ayuda a afinar la estimación. Esta aproximación técnica aprovecha los avances en aprendizaje profundo y análisis de imágenes para predecir ubicaciones con base en características visuales.
> 
> ChatGPT

A nivel práctico, la herramienta intenta determinar posibles ubicaciones de la imagen que has subido:

![Análisis de geolocalización de la postal](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-16.avif)

![Mapa de calor mostrando posible ubicación en Marsella](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-17.avif)

En este caso, me indica que está bastante seguro que es Marsella, pero ya adelanto de que no es así, ya que, además, recordemos que presuntamente la postal era de origen italiano.

Ojo, esto no quita que esta herramienta no sea buena, de hecho, para mí es de las más potentes que conozco. Por ejemplo, hace tiempo di una _[mini charla de OSINT](https://github.com/draco-0x6ba/talks/blob/main/OSINT_El_Poder_de_la_Informacion_Publica.pdf)_ y puse el siguiente reto:

![Reto de geolocalización de una imagen](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-18.avif)

En este caso, si subías esta imagen, esta herramienta te daba la localización exacta y directa del lugar que era:

![Resultado exitoso de geolocalización con TIB Labs](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-19.avif)

Por tanto, simplemente para este caso esta herramienta no era la más idónea.

Como no me dio muy buenos resultados, opté por hacer una búsqueda inversa de la imagen en distintos buscadores. Probé en Yandex, Bing, Baidu y Google, siendo en este caso Google la que mejor resultado me dio.

- Personalmente en cuanto a búsqueda inversa de imágenes, las que considero que dan mejores resultados son Google y Yandex.

Total, que lo que hice fue subir la imagen a Google:

![Búsqueda inversa de imágenes en Google](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-20.avif)

![Resultados iniciales de la búsqueda en Google Imágenes](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-21.avif)

Y a primera vista no obtuve muy buenos resultados. Me daba edificios parecidos, pero ninguno que yo dijese, me cuadra o se parece mucho.

Entonces, lo que hice para intentar afinar un poco más la búsqueda, es hacer uso de la herramienta de recorte que te proporciona:

![Herramienta de recorte de Google Imágenes](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-22.avif)

Decidí quitar un poco la zona de plantas de la parte inferior por si eso podía llegar a alterar un poco la búsqueda al haber mucho "verde" en la imagen. Al hacerlo, uno de los resultados que me proporcionó era cuanto menos interesante:

![Resultado de búsqueda mostrando postal similar en eBay](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-23.avif)

Se trataba de un enlace a eBay donde se podía encontrar una postal. Si nos fijamos, no solo los edificios eran bastante parecidos al de los edificios de mi postal:

![Postal encontrada en eBay con edificios similares](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-24.avif)

![Comparación de edificios entre postales](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-25.avif)

Si no que, además, en el título del producto podía encontrar lo que pareciera ser un lugar:

![Título del producto en eBay mencionando Monferrato](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-26.avif)

Como no tenía ni idea, simplemente lo busqué en Google:

![Búsqueda de Monferrato en Google](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-27.avif)

![Información de Wikipedia sobre Monferrato](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-28.avif)

Al parecer se trataba de una región de Italia. Aquí dije, okay, me cuadra mucho sabiendo que mi postal presuntamente es de ese origen.

Total, la región de "Monferrato" se sitúa y comprende aproximadamente la siguiente zona:

![Mapa de la región de Monferrato en Italia](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-29.avif)

Las ciudades de Asti y Alessandria.

Llegados a este punto, dije, vale, no puedo ponerme a mirar cada calle de cada pueblo de toda la región que comprende Monferrato, bueno, si puedo, pero no quiero hacerlo.

![Extensión territorial de Monferrato](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-30.avif)

Total, que intentando sacar un poco más de información de la imagen de mi postal, observé que al fondo de esta, se pueden ver lo que parecen árboles, a una distancia que no están cerca, pero tampoco están lejos:

![Árboles visibles al fondo de la postal](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-31.avif)

Por tanto, de manera bastante cutre, intenté remarcar las "fronteras verdes" de la zona, sabiendo que el lugar que buscaba tenía que estar medianamente cercana a estas líneas:

![Delimitación de zonas verdes en el mapa de Monferrato](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-32.avif)

Asimismo, intenté tachar las partes más céntricas y que tenían menos posibilidades de ser por el simple hecho de que estaban bastante alejadas de las "zonas verdes".

Además de esto, quise ver la vista en modo satélite del lugar, debido a que no todas las zonas que sean "blancas" (urbanas) quiere decir que haya una ciudad, pueblo o lo que sea. Por tanto, a simple ojo con la vista satelital de Google Maps quise ver posibles poblados que hubiese en la zona:

![Vista satelital de Google Maps de Monferrato](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-33.avif)

La cantidad de posibilidades disminuía, ya que con la vista predeterminada de Google Maps se veía mucha zona urbana.

Por intentar comparar un poco estos dos posibles modos de vista de mejor forma, lo que hice fue hacer uso de _[Google Earth Pro](https://www.google.com/intl/es/earth/about/versions/)_, porque una de las funcionalidades que te proporciona es la superposición del mapa con una imagen:

![Funcionalidad de superposición de imagen en Google Earth Pro](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-34.avif)

La cutre imagen que había hecho, la superpuse en Google Earth de manera que los lugares, carreteras, etc, cuadrasen. Lo interesante de esta funcionalidad es que puedes modificar la opacidad de la imagen que has puesto para poder hacer un mejor análisis:

![Superposición de mapa con opacidad ajustable en Google Earth](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-35.avif)

Llegados a este punto, dije, vale, me vendría bien más información. Tengo la zona donde más o menos buscar, pero me vendría bien algo más concreto.

Volviendo a la imagen inicial:

![Análisis del tejado distintivo en la postal](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-36.avif)

Podemos observar como todas las casas tienen un tejado así color ladrillo (es lo más común) excepto la casa que estamos buscando. Interesante tener en cuenta ese detalle.

Además, en la propia imagen podemos suponer que la casa hace esquina con dos calles:

![Casa haciendo esquina en la postal](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-37.avif)

Por tanto, teniendo esta información extra y conociendo las zonas donde había que buscar. Encontré un lugar que parecía cuadrar con la información que tenemos:

![Casa encontrada con tejado oscuro en Google Maps](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-38.avif)

Una casa con tejado oscuro entre muchas de tejado "naranja", y además, haciendo "esquina".

Poniendo la vista del "Street View":

![Vista de Street View de la ubicación encontrada](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-39.avif)

![Confirmación de la ubicación exacta en Street View](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-40.avif)

Parecer ser que efectivamente encontré el lugar exacto de la postal que mi hermana se encontró en un libro aleatorio de un puesto de navidad aleatorio.

Como dato, la imagen más antigua del lugar que guarda Google es del 2010:

![Imagen histórica de Street View del año 2010](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-41.avif)

Y hasta aquí ha llegado el ratito de OSINT que eché, la verdad que bastante divertido ^^.

## Referencias

Dejo los enlaces a herramientas mencionadas/usadas a lo largo del post:

- _[Cleanup.pictures](https://cleanup.pictures/)_
- _[jpghd](https://jpghd.com/)_
- _[TIB Labs - Geolocation Estimation](https://labs.tib.eu/geoestimation/)_
- _[Google Earth Pro](https://www.google.com/intl/es/earth/about/versions/)_
- _[Flameshot](https://flameshot.org/)_
- _[Google Imágenes](https://www.google.com/imghp?hl=es&authuser=0&ogbl)_

## Edit 02/01/2024 - GeoSpy AI

Hello de nuevo! Vuelvo por aquí para enseñar otra herramienta interesante parecida en la práctica a lo visto en _[labs.tib.eu](https://labs.tib.eu/geoestimation/)_:

_[Tweet de DragonJAR sobre GeoSpy AI](https://twitter.com/DragonJAR/status/1742196983220044045)_

Se trata de _[GeoSpy AI](https://geospy.web.app/)_, en este caso si subimos la imagen restaurada a esta web:

![Interfaz de GeoSpy AI](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-42.avif)

![Análisis de geolocalización con GeoSpy AI](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-43.avif)

La propia web nos indica que corresponde al norte de italia. Además, nos da unas coordenadas. En este caso, las coordenadas apunta a un lugar entre Milán y Venecia, lo cual no es el sitio exacto correcto:

![Resultado de GeoSpy AI mostrando ubicación en el norte de Italia](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-44.avif)

Pero oye, en cuanto a aproximación del mundo entero, ha dado casi en el clavo, norte de Italia.

Y, quién sabe si ocurre lo mismo que con _[labs.tib.eu](https://labs.tib.eu/geoestimation/)_, puede que simplemente esta herramienta no aplique del todo para este caso, a saber como se comportará con otras imágenes, pero sin duda está bien tenerla en el radar.
