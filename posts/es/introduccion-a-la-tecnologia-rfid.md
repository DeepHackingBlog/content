---
id: "introduccion-a-la-tecnologia-rfid"
title: "Introducción a la tecnología RFID"
author: "antonio-sanchez"
publishedDate: 2024-09-18
updatedDate: 2024-09-18
image: "https://cdn.deephacking.tech/i/posts/introduccion-a-la-tecnologia-rfid/introduccion-a-la-tecnologia-rfid-0.webp"
description: "Descubre qué es la tecnología RFID, cómo funcionan las etiquetas de baja y alta frecuencia, sus aplicaciones en control de acceso, pagos sin contacto y cómo identificar la frecuencia de las etiquetas RFID."
categories:
  - "miscellaneous"
draft: false
featured: false
lang: "es"
---

La tecnología RFID puede o no que os suene, pero lo que está claro es que está presente en nuestro día a día: intercomunicadores, tarjetas bancarias, pases del transporte público, pases de oficina, seguimiento de animales domésticos, cobro de peajes, etc.

En este artículo vamos a ver de manera práctica el funcionamiento de este tipo de tecnología desde un marco teórico.

- [¿Qué es la tecnología RFID?](#qué-es-la-tecnología-rfid)
- [Etiquetas RFID](#etiquetas-rfid)
    - [Tipos de frecuencia](#tipos-de-frecuencia)
    - [Etiquetas de baja frecuencia - 125 KHz a 134 KHz](#etiquetas-de-baja-frecuencia---125-khz-a-134-khz)
        - [Protocolos populares de baja frecuencia](#protocolos-populares-de-baja-frecuencia)
    - [Etiquetas de alta frecuencia - 13.56 MHz](#etiquetas-de-alta-frecuencia---1356-mhz)
        - [Ejemplos de aplicaciones de etiquetas de alta frecuencia (NFC, MIFARE, y EMV)](#ejemplos-de-aplicaciones-de-etiquetas-de-alta-frecuencia-nfc-mifare-y-emv)
            - [NFC (Near Field Communication)](#nfc-near-field-communication)
            - [Mifare Ultralight](#mifare-ultralight)
            - [Tarjetas bancarias EMV (PayPass, payWave, Apple Pay, Google Pay)](#tarjetas-bancarias-emv-paypass-paywave-apple-pay-google-pay)
    - [Como identificar la frecuencia de las etiquetas](#como-identificar-la-frecuencia-de-las-etiquetas)
    - [Factores que afectan al alcance de las etiquetas](#factores-que-afectan-al-alcance-de-las-etiquetas)
        - [Frecuencia y Longitud de Onda](#frecuencia-y-longitud-de-onda)
        - [Modo de Comunicación](#modo-de-comunicación)
        - [Potencia del Lector y Sensibilidad de la Antena](#potencia-del-lector-y-sensibilidad-de-la-antena)
- [Fase de enumeración](#fase-de-enumeración)
    - [Enumeración de baja frecuencia](#enumeración-de-baja-frecuencia)
    - [Enumeración de alta frecuencia](#enumeración-de-alta-frecuencia)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

## ¿Qué es la tecnología RFID?

La tecnología RFID (Identificación por Radiofrecuencia, por sus siglas en inglés) es un método de comunicación inalámbrica que permite la transferencia de datos entre un lector y una etiqueta o chip que contiene información. Esta tecnología utiliza ondas de radio para identificar y rastrear automáticamente objetos, personas o animales que llevan estas etiquetas.

El sistema RFID se compone principalmente de tres elementos:
- **Etiqueta RFID:** Contiene un microchip y una antena. El microchip almacena la información y la antena se encarga de recibir y enviar señales.
- **Lector RFID:** Emite ondas de radio para activar las etiquetas y recibe la información que estas transmiten. El lector convierte las ondas de radio reflejadas por la etiqueta en datos digitales que pueden ser procesados por un sistema informático.
- **Middleware:** Es el software encargado de procesar la información recibida por el lector, integrándola en sistemas de bases de datos y otros sistemas informáticos. Por ejemplo, gracias a este tipo de software una empresa puede integrar un software ERP con el lector RFID.

<figure>

![Arquitectura de middleware RFID](https://cdn.deephacking.tech/i/posts/introduccion-a-la-tecnologia-rfid/introduccion-a-la-tecnologia-rfid-1.avif)

<figcaption>

[Arquitectura de middleware RFID en ResearchGate](https://www.researchgate.net/figure/RFID-middleware-architecture_fig2_46388704)

</figcaption>

</figure>

En este artículo, nos enfocaremos principalmente en los dos primeros elementos: la etiqueta RFID y el lector RFID.

En definición y lo que tenemos que tener siempre presente es que la tecnología RFID se usa en un montón de campos de nuestra vida cotidiana y nos daremos cuenta de ello a lo largo que avancemos en el artículo.

## Etiquetas RFID

Dentro de la tecnología RFID existen lo que se denominan etiquetas. Estas etiquetas son dispositivos que almacenan información y pueden ser leídos a distancia mediante ondas de radio por un lector RFID. Cada etiqueta contiene dos componentes principales:

- Un microchip, que almacena la información.

- Una antena, que permite la comunicación con el lector RFID.

La combinación de estos componentes es lo que permite que el lector acceda a los datos almacenados en la etiqueta de manera inalámbrica.

Existen diferentes tipos de etiquetas, siendo las más comunes las **etiquetas pasivas**. Estas no tienen una fuente de alimentación interna y dependen completamente del campo electromagnético del lector RFID para activarse. El chip interior de la etiqueta permanece apagado hasta que la etiqueta se expone al campo electromagnético generado por el lector. En ese momento, la antena de la etiqueta comienza a absorber la energía del campo, lo que permite que el chip reciba energía, se encienda y comience a comunicarse con el lector. Es importante señalar que la antena de la etiqueta está sintonizada a una frecuencia específica, lo que significa que solo puede activarse cuando se encuentra dentro de un campo electromagnético adecuado.

Además de las etiquetas pasivas, existen **etiquetas activas** y **etiquetas semipasivas**. Las etiquetas activas cuentan con una fuente de alimentación interna (como una batería), lo que les permite transmitir señales de manera continua o a intervalos regulares. Por otro lado, las etiquetas semipasivas tienen una batería interna que alimenta el microchip, pero dependen del campo electromagnético del lector para activar la transmisión de datos.

#### Tipos de frecuencia

Estas etiquetas se clasifican según la frecuencia en la que operan y el método de alimentación. Existen dos tipos principales de etiquetas:
- **Baja Frecuencia (LF)**: funcionan en un rango de 125 KHz a 134 KHz. A pesar de ser inseguras, se siguen utilizando en sistemas primitivos de control de acceso como: interfonos de edificios, oficinas, casas, instalaciones deportivas, museos, etc. Estas etiquetas tienen un rango de lectura generalmente corto, de unos pocos centímetros hasta un metro, y son menos sensibles a la interferencia de metales y líquidos.
- **Alta Frecuencia (HF)**: funcionan a una frecuencia de 13.56 MHz y tienen un alcance efectivo menor que las de baja frecuencia. Sin embargo, tienen protocolos más complejos que admiten encriptación, autenticación y criptografía. Estas etiquetas se utilizan habitualmente en tarjetas bancarias sin contacto, para pagar el transporte público y en sistemas de control de acceso de alta seguridad. Tienen una capacidad media de almacenamiento de datos y mejor velocidad de lectura/escritura comparada con las etiquetas de baja frecuencia, aunque pueden verse afectadas por la presencia de metales y líquidos.

<div class="grid grid-cols-2 gap-4" >
<div>

![Etiqueta RFID de baja frecuencia 125 KHz](https://cdn.deephacking.tech/i/posts/introduccion-a-la-tecnologia-rfid/introduccion-a-la-tecnologia-rfid-2.avif)

_125 KHz_

</div>
<div>

![Etiqueta RFID de alta frecuencia 13.56 MHz](https://cdn.deephacking.tech/i/posts/introduccion-a-la-tecnologia-rfid/introduccion-a-la-tecnologia-rfid-3.avif)

_13.56 MHz_

</div>
</div>

Muchas empresas utilizan tarjetas RFID para el acceso a sus instalaciones por lo que es verdaderamente importante utilizar tarjetas seguras y evitar utilizar tecnologías vulnerables.

#### Etiquetas de baja frecuencia - 125 KHz a 134 KHz

Como acabamos de mencionar, las etiquetas de baja frecuencia (LF) operan en el rango de 125 kHz a 134 kHz. De este tipo de etiquetas se pueden sacar algunas características particulares que las hacen útiles en ciertas aplicaciones, pero también presentan limitaciones notables.
- Largo alcance - las etiquetas de baja frecuencia tienen un alcance relativamente largo en comparación con las de alta frecuencia. Algunos lectores de baja frecuencia (LF), como los de los protocolos EM-Marin y HID, pueden leer etiquetas desde distancias de hasta un metro
- Protocolo Primitivo - estas etiquetas operan con un protocolo básico, lo que se traduce en una baja tasa de transferencia de datos (alrededor de 10 kbps). Esto significa que solo pueden transmitir un identificador (ID) corto, generalmente de unos pocos bytes. Debido a la simplicidad del protocolo, las etiquetas no pueden manejar transferencias de datos complejas ni implementar medidas avanzadas de seguridad, como la criptografía.
- Baja seguridad: la falta de autenticación y encriptación hace que estas etiquetas sean vulnerables. Pueden ser fácilmente copiadas o leídas a distancia sin el consentimiento del propietario, lo que representa un riesgo de seguridad considerable en aplicaciones donde se requiere proteger la información transmitida.

Según hemos recién comentado, estas etiquetas almacenan un ID corto. Este ID es de apenas un par de bytes. El ID de la etiqueta se comparará con los ID almacenados en la base de datos de un controlador o un interfono. Si el ID de la etiqueta coincide con uno de los ID en la base de datos, se concede el acceso o se activa la función correspondiente. Así es como operan algunos sistemas de control de acceso. Debido a la naturaleza de estas etiquetas, tan pronto como reciben energía, transmiten su ID.

##### Protocolos populares de baja frecuencia

Dentro de las etiquetas de baja frecuencia, existen múltiples protocolos, pero a continuación destacamos los más utilizados:
- **EM-Marin (EM4100, EM4102)**: Este es uno de los protocolos más populares en la región de la Comunidad de Estados Independientes (CIS). Se caracteriza por su sencillez y estabilidad, transmitiendo un identificador único de forma no cifrada, lo que permite su fácil implementación. Su distancia de lectura puede alcanzar aproximadamente un metro, aunque esto varía según las condiciones del lector y del entorno. Si bien su simplicidad es una ventaja en términos de costo, su principal desventaja es la vulnerabilidad a la clonación y la falta de seguridad.
- **HID Prox II**: Introducido por HID Global, este protocolo de baja frecuencia es ampliamente utilizado en los países occidentales. Su estructura de datos es más compleja en comparación con EM-Marin, lo que proporciona un mayor nivel de seguridad, aunque sigue siendo menos seguro que las tecnologías de alta frecuencia (como las basadas en 13.56 MHz). Tanto las tarjetas como los lectores compatibles con este protocolo suelen ser más costosos. La distancia de lectura es generalmente menor que en EM-Marin debido a los mecanismos de autenticación y cifrado involucrados.
- **Indala**: Este es un protocolo de baja frecuencia más antiguo, originalmente desarrollado por Motorola y posteriormente adquirido por HID Global. Indala utilizaba un esquema de señal más complejo en su momento y ofrecía una mejor seguridad que el EM-Marin. Sin embargo, con el paso del tiempo ha caído en desuso debido a la adopción de tecnologías más modernas y seguras. Hoy en día, es menos común, aunque aún se puede encontrar en algunos sistemas antiguos.

Aunque existen otros protocolos de baja frecuencia, la mayoría utiliza una modulación similar en la capa física, como la modulación ASK (Amplitude Shift Keying) a 125 kHz. A pesar de compartir esta característica, los distintos protocolos no son necesariamente compatibles entre sí debido a las diferencias en la estructura de datos y los niveles de seguridad que cada uno maneja.

En general, la tendencia en la industria está cambiando hacia tecnologías más seguras y rápidas, como las basadas en alta frecuencia (HF) y las comunicaciones de campo cercano (NFC), lo que explica el declive de algunos protocolos de baja frecuencia.

#### Etiquetas de alta frecuencia - 13.56 MHz

Dejando a un lado las bajas frecuencias vamos a hablar ahora de las altas. Como ya sabemos éstas operan a 13.56 MHz y ofrecen varias ventajas en términos de alcance controlado, velocidad de transferencia y seguridad:
- **Bajo Alcance**: Las tarjetas de alta frecuencia están diseñadas específicamente para que deban colocarse cerca del lector, lo que también ayuda a protegerlas de interacciones no autorizadas. Normalmente, su rango de operación es inferior a 10 cm, aunque en algunas pruebas que hice con lectores de alto alcance hechos a medida, se pueden alcanzar hasta 15 cm. Este alcance reducido no solo mejora la seguridad, sino que también minimiza el riesgo de ataques de "sniffing" o interceptaciones a mayor distancia. El alcance puede depender de la potencia del lector y del tamaño de la antena de la tarjeta.
- **Protocolos Avanzados**: Gracias a velocidades de transferencia de datos de hasta 424 kbps, las tarjetas de alta frecuencia permiten la implementación de protocolos complejos con transferencia de datos bidireccional completa. Ejemplos de estos protocolos incluyen **ISO/IEC 14443**, ampliamente utilizado en tarjetas sin contacto como **MIFARE**, y **ISO/IEC 15693**, común en etiquetas **NFC**. Estos protocolos habilitan la autenticación mutua entre la tarjeta y el lector, lo que facilita la criptografía avanzada y la transferencia segura de datos. Este nivel de seguridad permite que las tarjetas de alta frecuencia sean utilizadas en aplicaciones como pagos sin contacto y acceso seguro.
- **Alta Seguridad**: Las tarjetas sin contacto de alta frecuencia ofrecen un nivel de seguridad comparable al de las tarjetas inteligentes. Algunas tarjetas, como las basadas en la tecnología **MIFARE DESFire EV2**, soportan algoritmos criptográficos robustos como **AES** y **Triple DES**, así como criptografía asimétrica para mayor seguridad. Estas características permiten la implementación de esquemas de autenticación avanzados, firma digital y encriptación de datos, protegiendo eficazmente frente a ataques de clonación, intermediarios (man-in-the-middle) y otras amenazas. Además, el uso de criptografía asimétrica facilita la autenticación basada en certificados, lo que refuerza aún más la seguridad en aplicaciones críticas.

##### Ejemplos de aplicaciones de etiquetas de alta frecuencia (NFC, MIFARE, y EMV)

Las etiquetas de alta frecuencia poseen un conjunto de normas y protocolos. A menudo, se les denomina **NFC**, pero esto no siempre es correcto. Aunque NFC también opera a 13.56 MHz, es solo una subcategoría de esta tecnología. El conjunto de protocolos básicos utilizados a nivel físico y lógico es el **ISO/IEC 14443**, y muchos de los protocolos de alto nivel se basan en este estándar.

La implementación más común de **ISO/IEC 14443** es **ISO 14443-A**, que se utiliza en la mayoría de los sistemas de transporte público, control de acceso en oficinas, y en tarjetas bancarias sin contacto. Este estándar establece la base para la comunicación a corta distancia utilizada en una amplia gama de aplicaciones. Un ejemplo destacado es la tecnología **MIFARE**, desarrollada por NXP, que se basa en **ISO 14443-A** a nivel físico. Las tarjetas MIFARE son muy populares en sistemas de transporte y control de acceso, ofreciendo versiones más seguras como **MIFARE DESFire**, que implementan criptografía avanzada.

Todas las tarjetas de alta frecuencia basadas en la norma **ISO 14443-A** tienen un identificador único de chip (**UID**), que funciona como un número de serie de la tarjeta, similar a la dirección MAC de una tarjeta de red. Este UID tiene, generalmente, entre 4 y 7 bytes, aunque en casos raros puede ser de hasta 10 bytes. El UID no es secreto y es fácilmente legible, incluso a veces está impreso en la propia tarjeta.

En muchos sistemas de control de acceso, el **UID** se utiliza como un identificador simple para autenticar a los usuarios y concederles acceso. Sin embargo, confiar solo en el UID reduce la seguridad al nivel de las tarjetas de 125 kHz, que no implementan medidas criptográficas avanzadas. Aunque las etiquetas HF tienen la capacidad de admitir criptografía para mayor seguridad, muchas implementaciones básicas aún dependen únicamente del UID, lo que las hace vulnerables a la clonación y a ataques de intermediarios.

Ahora que ya conocemos la existencia de esta norma vamos a ver algunos protocolos populares que la usan.

###### NFC (Near Field Communication)

La tecnología **NFC** (Near Field Communication) se basa en los estándares **ISO 14443-A** y **14443-B**, pero ofrece una capacidad de comunicación bidireccional más avanzada y rápida entre dispositivos. A diferencia de las tarjetas tradicionales que tienen un UID fijo, NFC permite que dispositivos como teléfonos móviles interactúen de manera más dinámica con los lectores.

Un ejemplo de esto es el uso de **tarjetas virtuales**, como **Apple Pay** o **Google Pay**, que utilizan un **UID dinámico**. Esto significa que el identificador cambia con cada transacción, lo que incrementa la seguridad, ya que previene que se reutilice el mismo UID para realizar otras transacciones o acciones no autorizadas, como abrir puertas de acceso. Esta flexibilidad es clave para mejorar la protección frente a ataques como la clonación o suplantación de identidad.

En la siguiente imagen podemos ver la arquitectura de NFC, donde se muestra cómo las características específicas de NFC (como **NDEF**) y varios productos de tarjetas virtuales se apoyan en los estándares **ISO 14443** a nivel bajo:

![Arquitectura de NFC basada en estándares ISO 14443](https://cdn.deephacking.tech/i/posts/introduccion-a-la-tecnologia-rfid/introduccion-a-la-tecnologia-rfid-4.avif)

###### Mifare Ultralight

Dentro de las tarjetas inteligentes, **MIFARE**, desarrollada por **NXP**, es una de las tecnologías más populares para sistemas de alta frecuencia, con varias versiones disponibles para distintas aplicaciones. Una de las tarjetas más sencillas de esta familia es la **MIFARE Ultralight**.

En su versión básica, la **MIFARE Ultralight** ofrece solo **64 bytes de memoria** flash incrustada y **no cuenta con protección criptográfica**, lo que la hace más asequible pero también menos segura en comparación con otras tarjetas MIFARE más avanzadas, como la **MIFARE DESFire**. Debido a su simplicidad, estas tarjetas se utilizan principalmente en aplicaciones donde la seguridad no es una prioridad absoluta, como pases de acceso temporal, billetes de transporte público, o sistemas de control básico de acceso.

Un ejemplo de su uso a gran escala es el sistema de transporte público de Moscú, donde los billetes electrónicos están basados en la tecnología **MIFARE Ultralight**.

###### Tarjetas bancarias EMV (PayPass, payWave, Apple Pay, Google Pay)

El estándar **EMV** (Europay, Mastercard y Visa) es el protocolo internacionalmente establecido para las tarjetas bancarias, diseñando un marco robusto para las **tarjetas inteligentes** que se utilizan en pagos sin contacto y transacciones con chip. EMV asegura que las tarjetas bancarias sean mucho más que simples dispositivos de almacenamiento de datos, ofreciendo **complejos protocolos de intercambio** y **cifrado asimétrico** para garantizar la seguridad de las transacciones.

Las tarjetas bancarias bajo este estándar, como **PayPass** (Mastercard), **payWave** (Visa), así como plataformas de pago digital como **Apple Pay** y **Google Pay**, permiten mucho más que la simple lectura de un **UID**. A través de un lector compatible, es posible acceder a información adicional como el número completo de la tarjeta (**PAN** de 16 dígitos), la **fecha de validez**, y en ciertos casos, hasta el **nombre del titular** y un **historial de transacciones recientes**. Sin embargo, estos datos varían dependiendo de la implementación específica del estándar EMV en cada tarjeta y de las políticas de seguridad del emisor.

Es importante notar que, aunque mucha información puede ser leída, **el código CVV** (los 3 dígitos impresos en el reverso de la tarjeta) **no es accesible** a través de este tipo de lecturas, ya que no se almacena en el chip de la tarjeta ni se transmite durante las transacciones sin contacto.

Además, las plataformas como **Apple Pay** y **Google Pay** implementan una capa adicional de seguridad al utilizar **tokens dinámicos** y un **UID** cambiante, lo que evita que los datos sensibles de la tarjeta real sean expuestos directamente durante las transacciones. Esto hace que estas plataformas sean aún más seguras frente a intentos de fraude o clonación.

#### Como identificar la frecuencia de las etiquetas

Por fuera, las etiquetas pueden ser muy diferentes: tarjetas gruesas o finas, llaveros, pulseras, monedas, anillos o incluso pegatinas. A juzgar por el aspecto, es casi imposible distinguir la frecuencia o el protocolo con el que funciona la etiqueta.

![Diferentes tipos de etiquetas RFID: tarjetas, llaveros, pulseras y anillos](https://cdn.deephacking.tech/i/posts/introduccion-a-la-tecnologia-rfid/introduccion-a-la-tecnologia-rfid-5.avif)

A menudo, los fabricantes utilizan carcasas de plástico similares para etiquetas que operan en diferentes frecuencias. Dos etiquetas absolutamente similares desde el punto de vista visual pueden ser totalmente diferentes por dentro. Merece la pena tenerlo en cuenta a la hora de distinguir el tipo de etiqueta que tiene.

La manera mas sencilla para identificar en qué tipo de etiqueta (frecuencia) se está operando es mirar la antena. Las etiquetas de baja frecuencia (125KHz - 134 KHz) tienen una antena hecha de un cable muy fino, literalmente más fino que un pelo. Pero estas antenas tienen un gran número de vueltas, por lo que parecen una pieza sólida de metal. Por otro lado, las etiquetas de alta frecuencia (13.56 MHz) tienen un número significativamente menor de vueltas más gruesas, con espacios visibles entre ellas.

![Comparación de antenas entre etiquetas de alta y baja frecuencia](https://cdn.deephacking.tech/i/posts/introduccion-a-la-tecnologia-rfid/introduccion-a-la-tecnologia-rfid-6.avif)

Puedes iluminar una etiqueta RFID para ver la antena de su interior. Si la antena tiene sólo unas pocas vueltas grandes, lo más probable es que sea una antena de alta frecuencia. Si la antena parece una pieza sólida de metal sin espacios entre las vueltas, es una antena de baja frecuencia.

![Vista interior de etiquetas RFID iluminadas mostrando sus antenas](https://cdn.deephacking.tech/i/posts/introduccion-a-la-tecnologia-rfid/introduccion-a-la-tecnologia-rfid-7.avif)

Las etiquetas de baja frecuencia suelen utilizarse en sistemas que no requieren una gran seguridad:
- Acceso a edificios
- Llaves de interfono
- Tarjetas de socio de gimnasios
- etc

Por ejemplo, debido a su mayor alcance, son convenientes para el aparcamiento de pago porque el conductor no necesita acercar la tarjeta al lector, ya que se activa desde más lejos. Al mismo tiempo, las etiquetas de baja frecuencia son muy primitivas, como hemos mencionado previamente, tienen una baja tasa de transferencia de datos. Por ello, es imposible implementar una compleja transferencia de datos bidireccional, lo cual sería necesario para funciones avanzadas como el mantenimiento de saldo en tarjetas de pago o la implementación de métodos de seguridad como la criptografía. Las etiquetas de baja frecuencia sólo pueden transmitir una breve identificación sin ningún tipo de autenticación, lo que significa que no pueden verificar la identidad del usuario ni proteger la información transmitida contra accesos no autorizados.

Las etiquetas de alta frecuencia se utilizan para interacciones complejas entre el lector y la etiqueta, tales como criptografía, transferencias bidireccionales de grandes volúmenes de datos y autenticación. Estas etiquetas son comunes en tarjetas bancarias, sistemas de transporte público y otros pases seguros.

![Tabla comparativa entre etiquetas RFID de baja y alta frecuencia](https://cdn.deephacking.tech/i/posts/introduccion-a-la-tecnologia-rfid/introduccion-a-la-tecnologia-rfid-8.avif)

Con todo esto visto vamos a dar paso a ver cada tipo de etiqueta de manera mas detallada.

#### Factores que afectan al alcance de las etiquetas

A lo largo del artículo hemos hecho mención al tema del alcance de cada frecuencia, que una posee mayor alcance que la otra. A continuación, vamos a ver las razones de por qué ocurre esto y cómo interactúan diversos factores para influir en el alcance y la funcionalidad de las etiquetas RFID en diferentes aplicaciones.

###### Frecuencia y Longitud de Onda

Las frecuencias más bajas como 125 kHz (LF) tienen longitudes de onda más largas. Por otro lado, las frecuencias más altas (HF) poseen longitudes de onda más cortas, lo que se puede ver en la siguiente imagen:

![Comparación de longitudes de onda entre baja y alta frecuencia RFID](https://cdn.deephacking.tech/i/posts/introduccion-a-la-tecnologia-rfid/introduccion-a-la-tecnologia-rfid-9.avif)

Las longitudes de onda más largas (baja frecuencia) permiten que las señales penetren mejor a través de ciertos materiales como agua, seres humanos y objetos no metálicos como madera, etc. Esto significa que son menos afectadas por las interferencias ambientales, haciéndolas más adecuadas para entornos con muchos obstáculos.

Por otro lado, las longitudes de onda más cortas (alta frecuencia) tienen una menor capacidad de penetración y son más susceptibles a interferencias ambientales como el metal o el agua, lo que limita el alcance de lectura.

###### Modo de Comunicación

Tanto las frecuencias altas como bajas suelen utilizar la inducción electromagnética, donde la comunicación se basa en la proximidad de la etiqueta al campo magnético generado por el lector RFID. En las bajas frecuencias, esto normalmente se traduce en un alcance corto (unos pocos centímetros en la mayoría de los casos). Sin embargo, los lectores RFID específicos que tienen mayor potencia pueden generar campos magnéticos más intensos, permitiendo así lecturas a distancias mayores (hasta un metro).

Un lector con mayor potencia de salida puede compensar parcialmente la menor eficiencia de las etiquetas de alta frecuencia en entornos con interferencias, aumentando su alcance efectivo. Sin embargo, esto también podría aumentar el riesgo de lectura accidental de otras etiquetas en el área.

Por ejemplo, en los sistemas de control de acceso para aparcamientos, se utilizan lectores de baja frecuencia con alta potencia de salida. Estos lectores permiten que las etiquetas en los vehículos sean leídas a mayor distancia, facilitando el acceso sin que el conductor tenga que acercar físicamente la tarjeta al lector.

Por otro lado, en las de alta frecuencia, debido a la mayor frecuencia (longitudes de onda más cortas), el campo electromagnético generado decae más rápidamente con la distancia. Por lo tanto, el alcance de lectura es típicamente más corto.

###### Potencia del Lector y Sensibilidad de la Antena

Como hemos mencionado, todo depende del campo que genere el propio lector RFID. Los lectores de baja frecuencia pueden ser diseñados para tener una mayor potencia de salida y utilizar antenas más grandes, permitiendo alcanzar un rango más amplio.

La sensibilidad de la antena en el lector también juega un papel crucial. Una antena más sensible puede detectar señales débiles de etiquetas afectadas por interferencias, mejorando la tasa de éxito en la lectura de datos.

En el lado opuesto podemos encontrar los lectores de alta frecuencia que están generalmente diseñados para un uso a corta distancia, especialmente en aplicaciones donde se busca limitar el rango de lectura por razones de seguridad, como las tarjetas de acceso y pago sin contacto.

Entonces, por mencionar algún ejemplo, en sistemas como los de aparcamiento donde no se requiere que el dispositivo deba estar cerca del lector para ser leído, se utilizan lectores de baja frecuencia diseñados para cubrir un área más amplia y detectar etiquetas desde una distancia mayor. Por otro lado, los lectores de alta frecuencia se diseñan intencionalmente para tener un rango de lectura corto con el fin de evitar interacciones no autorizadas o la lectura accidental de etiquetas a distancias no deseadas.

## Fase de enumeración

Después de haber visto todo lo referente a las etiquetas y lectores RFID vamos a ponernos en un escenario real de una auditoría a este tipo de tarjetas. En primer lugar se pueden distinguir varias fases para la realización de una auditoría. Una de ellas es la fase de **reconocimiento** del activo. En nuestro caso, el escenario que vamos a plantear trata sobre un sistema de control de acceso por RFID del cual no se dispone información útil, es decir, desconocemos si se trata de un escenario de alta frecuencia o de baja frecuencia.

Ante esta situación de no conocer nada, lo primero que haría un atacante es comprobar ante qué tipo de control de acceso se encuentra, es decir, si trabaja con protocolos de alta frecuencia o de baja frecuencia. Para ello existe hardware específico que nos permite identificarlo. En nuestro caso utilizaremos dos opciones diferentes pero igual de válidas:
- **Proxgrind RFID Field Detector**: detecta y muestra la presencia de campos de baja frecuencia (125KHz) y de alta frecuencia (13,56MHz).

<figure>

![Dispositivo Proxgrind RFID Field Detector para identificar frecuencias](https://cdn.deephacking.tech/i/posts/introduccion-a-la-tecnologia-rfid/introduccion-a-la-tecnologia-rfid-10.avif)

<figcaption>

Podéis obtenerlo desde [Lab401 con un 5% de descuento](https://lab401.com/r?id=9merd7)

</figcaption>

</figure>

- **Dangerous Things RFID Diagnostic Card**: averigua la frecuencia y el ciclo de trabajo de cualquier lector pasivo de LF/HF. La diferencia con respecto al anterior es que determina el ciclo de trabajo (la frecuencia con la que se enciende el campo) y comprueba la intensidad del campo a través de la intensidad del LED.

![Tarjeta de diagnóstico RFID de Dangerous Things](https://cdn.deephacking.tech/i/posts/introduccion-a-la-tecnologia-rfid/introduccion-a-la-tecnologia-rfid-11.avif)

#### Enumeración de baja frecuencia

En este primer caso para comprobar ante que tipo de sistema de control de acceso nos encontramos utilizaremos Proxgrind RFID Field Detector. Si acercamos este dispositivo al lector del control de acceso:

![Detector Proxgrind mostrando luz roja indicando baja frecuencia](https://cdn.deephacking.tech/i/posts/introduccion-a-la-tecnologia-rfid/introduccion-a-la-tecnologia-rfid-12.avif)

Podemos ver que se enciende una luz roja en la parte inferior, lo cual nos indica que nos encontramos ante un control de acceso de baja frecuencia.

#### Enumeración de alta frecuencia

Ahora vamos ver un ejemplo de alta frecuencia, para este caso no hace falta disponer de un control de acceso. Podemos simplemente utilizar el teléfono móvil y activar la opción de **NFC**. Recordemos que el móvil se utiliza para pagar con nuestras tarjetas bancarias y dichas tarjetas utilizan una tecnología de alta frecuencia.

<div class="grid grid-cols-2 gap-4">
<div>

![Tarjeta de diagnóstico detectando alta frecuencia](https://cdn.deephacking.tech/i/posts/introduccion-a-la-tecnologia-rfid/introduccion-a-la-tecnologia-rfid-13.avif)

</div>
<div>

![Detección de alta frecuencia con teléfono móvil NFC](https://cdn.deephacking.tech/i/posts/introduccion-a-la-tecnologia-rfid/introduccion-a-la-tecnologia-rfid-14.avif)

</div>
</div>

En este caso, se han utilizados los dos detectores previamente explicados para que se aprecie como ambos detectan que nos encontramos ante un sistema de control de alta frecuencia.

## Conclusión

A lo largo de este artículo, hemos visto en detalle la tecnología RFID, desde su definición hasta los diferentes tipos de frecuencias y las aplicaciones más comunes. Ahora tienes una visión general de cómo funcionan las etiquetas RFID, los distintos protocolos de baja y alta frecuencia, y los factores que influyen en su rendimiento. Sin embargo, si aún no te sientes del todo cómodo con estos conceptos, no te preocupes. Este es solo el primer paso para comprender en profundidad la tecnología RFID.

En los próximos artículos, abordaremos temas más avanzados, como la creación de un laboratorio de RFID, ejemplos de casos reales y técnicas de ataques en baja y alta frecuencia. Así, podrás continuar aprendiendo de manera progresiva hasta dominar por completo esta tecnología, simplemente siguiendo las publicaciones de este blog. ¡Nos vemos muy pronto!

## Referencias

- [Trabajo de Fin de Máster sobre entorno de concienciación de ciberseguridad en RFID por Antonio José Sánchez Moscoso](https://www.linkedin.com/posts/antonio-s%C3%A1nchez-aka-sh0x-aa1636196_tfm-entorno-de-concienciaci%C3%B3n-de-ciberseguridad-activity-7003395208973279232-xtL-/)
- [Guía completa sobre protocolos RFID con Flipper Zero](https://blog.flipper.net/rfid/)
