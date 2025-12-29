---
id: "htb-cpts-review"
title: "CPTS Review - HackTheBox Certified Penetration Testing Specialist 2025"
author: "oliver-felix-giovanardi"
publishedDate: 2025-10-13
updatedDate: 2025-10-13
image: "https://cdn.deephacking.tech/i/posts/htb-cpts-review/htb-cpts-review-0.webp"
description: "Review completa de la certificación CPTS de HackTheBox: preparación, examen, comparación con OSCP, consejos y opinión final."
categories:
  - "certifications"
draft: false
featured: false
lang: "es"
---

Espero que estén súper bien por ahí. Mi nombre es Oliver y hoy les traigo una review de una certificación que viene creciendo con fuerza en el mercado: la [CPTS (Certified Penetration Testing Specialist)](https://academy.hackthebox.com/preview/certifications/htb-certified-penetration-testing-specialist) de **HackTheBox**.

![Portada certificación CPTS](https://cdn.deephacking.tech/i/posts/htb-cpts-review/htb-cpts-review-1.avif)

Ya sea por su precio accesible o su nivel de dificultad pensado en teoría para perfiles "junior" (muy entre comillas), esta certificación se ha convertido en una opción prometedora y cada vez más mencionada como una competidora directa de la **OSCP**.

- [¿De qué va esta certificación?](#de-qué-va-esta-certificación)
- [Precio](#precio)
- [Path](#path)
- [Examen](#examen)
- [Opinión final](#opinión-final)

## ¿De qué va esta certificación?

Es una certificación completamente enfocada al Pentesting, con un contenido y enfoque bastante general de este mundo. Destaca por su excelente desarrollo de contenido, estructurado a través de un **path obligatorio** que debes completar antes de presentar el examen. Este recorrido se realiza en [HackTheBox Academy](https://academy.hackthebox.com/) y te prepara muy bien para lo que viene en la prueba, sin salirse de los temas que abarca.

El curso incluye **28 módulos**, y cada uno contiene una serie de laboratorios prácticos para aplicar las técnicas vistas en el módulo. Al finalizar el recorrido, obtienes acceso al **examen con hasta 3 intentos** disponibles.

- Penetration testing processes and methodologies
- Information gathering & reconnaissance techniques
- Attacking Windows & Linux targets
- Active Directory penetration testing
- Web application penetration testing
- Manual & automated exploitation
- Vulnerability assessment
- Pivoting & Lateral Movement
- Post-exploitation enumeration
- Windows & Linux Privilege escalation
- Vulnerability/Risk communication and reporting

## Precio

Puedes comprobar los precios en [este enlace de suscripciones de HTB Academy](https://help.hackthebox.com/en/articles/5720974-academy-subscriptions), básicamente debes de pagar cualquier suscripción que mínimo te proporcione acceso a los módulos de niveles TIER I y TIER II. Las dos suscripciones más baratas que te pueden proporcionar este acceso por completo son la estudiantil y la Silver Annual. Por ejemplo, si tienes un correo educativo puedes hacer uso de la primera suscripción y obtener todo el acceso necesario por únicamente **$8 USD** al mes.

Los módulos TIER I y TIER II cubren por completo el path del CPTS, además de otras certificaciones de HTB, por lo que únicamente quedaría por pagar el voucher del examen, que cuesta **$210 USD** con impuestos incluidos. Si te planteas completar la certificación en unos 3 a 4 meses con una suscripción estudiantil, la inversión total rondaría los **$242 USD**. Una verdadera ganga, siempre y cuando sepas organizarte bien.

En caso de no poder contar con una suscripción estudiantil, solo te queda como opción pagar la suscripción Silver Annual, que ronda los $490 USD al año, o, por otro lado, adquirir los cubos necesarios por separado para desbloquear cada módulo, aunque probablemente esta última opción sea la más cara de todas, según los cálculos estimados por la propia plataforma.

## Path

Los **28 módulos** que conforman el path de **Penetration Tester** representan el recorrido más extenso entre todas las certificaciones de HTB, pero esto se justifica por lo completo y bien estructurado que es. Lo ideal es seguirlos de manera lineal y en el orden establecido, ya que están diseñados para construir conocimientos progresivamente y preparar a fondo incluso a quienes no tienen mucha experiencia previa en el área.

La filosofía de HackTheBox a lo largo de todo el recorrido es que siempre pensemos **fuera de la caja**, algo que se repite constantemente y que realmente marca la diferencia tanto en el examen como en la práctica real del pentesting. Si completas cada módulo del path y dominas bien los **Skill Assessments** que componen a cada final de módulo, estarás más que preparado para enfrentar la certificación. Aun así, te recomiendo hacer máquinas relacionadas con cada módulo para reforzar los conocimientos y ganar más soltura en la ejecución de las técnicas. Además de eso, te aconsejo:

- Completar todo el path con paciencia y repasar lo que sea necesario.
- Crea tu propia metodología para el examen, como checklists u hojas de ruta personalizadas.
- No "pierdas" tiempo estudiando material fuera del contenido del curso; el temario cubre todo lo que necesitas.
- Si ves algo que parece relleno, no te frustres: sintetiza lo aprendido y concéntrate en cómo aplicarlo.
- Los módulos más importantes (¡todos lo son, eh!) para el examen son **Active Directory Enumeration & Attacks**, **Attacking Common Applications** y, sobre todo, **Attacking Enterprise Networks**, ya que este último se asemeja bastante al entorno real del laboratorio del examen.
- Aunque pueda parecer aburrido o muy teórico, el módulo de **Documentation & Reporting** es clave. Léelo con atención al detalle, porque los de HackTheBox no perdonan aquí: estudia la plantilla y sigue el módulo al pie de la letra. Al final, **te aprueban por el reporte, no por el pentest.**

## Examen

![Panel del examen CPTS](https://cdn.deephacking.tech/i/posts/htb-cpts-review/htb-cpts-review-2.avif)

Con este examen comprendí que cuando una certificación te otorga varios días para completarla, es porque realmente lo vas a necesitar. La experiencia con la CPTS fue una locura: te hace sentir que **10 días de examen** no son suficientes para todo lo que tienes por delante, especialmente por la magnitud y complejidad del entorno.

El examen consiste en comprometer un entorno empresarial estilo black-box, compuesto por aproximadamente **8 máquinas**, tanto Linux como Windows (al menos en su mayoría, según la versión actual al momento de escribir esto). El objetivo es obtener un total de **14 banderas** distribuidas en el entorno. Para aprobar, es necesario conseguir al menos 12 de ellas y entregar un reporte comercial bien estructurado que cumpla estrictamente con los requisitos establecidos en el módulo correspondiente.

![Cronología del examen CPTS](https://cdn.deephacking.tech/i/posts/htb-cpts-review/htb-cpts-review-3.avif)

Inicié el examen el **8 de mayo de 2025** y logré comprometer por completo el entorno, obteniendo las 14 banderas necesarias para alcanzar la puntuación máxima de 100 puntos. Para el **15 de mayo** ya había completado todos los objetivos, disponiendo aún de tres días adicionales para finalizar la documentación y realizar la entrega.

El examen presenta varios aspectos destacables, ya que, aunque no se enfoca tanto en técnicas de evasión, sigue siendo un entorno desafiante debido a su tamaño y complejidad. Esto requiere no solo una buena metodología de trabajo, sino también aplicar en varios momentos la conocida filosofía de "pensar fuera de la caja", que resulta clave a lo largo del proceso.

Una cosa es completar el laboratorio del examen, y otra muy distinta es que aprueben el reporte, el cual se rige por un estándar bastante estricto. De hecho, muchas personas no logran certificar a pesar de haber comprometido el entorno completo. Se estima que sólo unos pocos de quienes finalizan el laboratorio consiguen la aprobación, principalmente por no seguir al pie de la letra las directrices del reporte. Por eso, para cerrar, compartiré todos los consejos y recomendaciones necesarios para abordar este reto de la mejor manera posible.

- Es impresionante lo bien estructurado y estable que está el laboratorio, lo cual permite trabajar con total confianza. No es necesario apresurarse por temor a que algo falle o se caiga; puedes concentrarte en ejecutar cada paso con calma y precisión.
- Muchos suelen temerle al aspecto del pivoting, pero puedo asegurar que, si se aprende a utilizar correctamente la herramienta [ligolo-ng](https://github.com/nicocha30/ligolo-ng), esta parte del examen se vuelve una de las más sencillas.
- En este examen, todo está diseñado de forma bastante rebuscada, por lo que no vale la pena perder tiempo en tareas que no estén directamente relacionadas con la enumeración, ya que esta es la clave del éxito. Además, documenta absolutamente todo lo que encuentres: este reto se basa en gran medida en retomar información vista anteriormente y utilizarla estratégicamente más adelante.
- Recomiendo ir elaborando el reporte a medida que se va comprometiendo el entorno, ya que si se deja todo para el final, difícilmente habrá tiempo suficiente para completar un informe tan exigente. De hecho, este es uno de los reportes más extensos dentro del mundo de las certificaciones ofensivas. Sin embargo, herramientas como [SysReport](https://docs.sysreptor.com/htb-reporting-with-sysreptor/) que incluso incluye la plantilla oficial de HTB pueden ahorrarte una cantidad significativa de tiempo. Eso sí, es fundamental haber estudiado bien el módulo de reporte que proporciona la plataforma y prestar especial atención a la plantilla de ejemplo que ellos mismos ofrecen.
- Procura documentar absolutamente todo desde la perspectiva de un ingeniero ofensivo, no como si se tratara de un writeup de tipo CTF. Esto implica incluir capturas relevantes, justificar cada paso realizado y explicar el porqué detrás de cada acción, no solo mostrar los comandos utilizados.
- Procura mantener un orden riguroso en todo lo que hagas: anota las rutas de cada script que subas, registra los comandos utilizados y documenta cada acción de forma clara. La precisión en la documentación es clave, ya que este examen te pone en el rol de un pentester contratado, y se espera que entregues un reporte profesional y coherente, como lo harías en un entorno real.
- Asegúrate de repasar a fondo el módulo **Enterprise Network Attacks**, ya que será clave para abordar el examen con éxito. Este módulo cubre muchas de las técnicas y metodologías que se aplican durante la evaluación, por lo que tenerlas bien comprendidas marcará una gran diferencia a la hora de enfrentar el entorno.
- Es altamente recomendable contar con cheat sheets bien organizados por cada módulo, ya que tener referencias rápidas y estructuradas te permitirá ahorrar tiempo valioso durante el examen y evitar errores innecesarios.

Después de haber entregado el reporte, a pocas horas de que expirara mi intento de examen, tuve que esperar aproximadamente tres semanas durante las cuales apenas podía dormir por los nervios. Finalmente, recibí por correo la tan esperada confirmación de que había aprobado.

![Certificación CPTS aprobada](https://cdn.deephacking.tech/i/posts/htb-cpts-review/htb-cpts-review-4.avif)

En caso de no aprobar el examen, siempre recibirás un **feedback** detallado indicando en qué aspectos debes mejorar, lo cual es muy útil para preparar un segundo intento. Además, el entorno del **laboratorio no cambia entre intentos**, por lo que, si llevaste una buena organización, solo tendrás que retomar desde donde lo dejaste y volver a capturar las banderas necesarias.

## Opinión final

Tuve el honor de convertirme en la persona más joven de mi país en obtener esta certificación, y vamos por más. Sin duda, la experiencia que ofrece la CPTS es única, incluso para profesionales con experiencia, debido a lo completa y bien diseñada que es. Ha sido uno de los laboratorios más emocionantes que he tenido la oportunidad de comprometer en toda mi carrera hasta ahora. Además, por el precio con el que se ofrece, considero que está ampliamente infravalorada. Ojalá siga creciendo y demostrando que, con poco presupuesto, también se pueden lograr grandes cosas incluso al nivel de competir con gigantes como OffSec.

No considero ni recomiendo que esta sea la primera certificación para alguien que recién comienza, ya que es bastante compleja y exige un alto nivel de organización, algo que puede resultar difícil para quienes tienen poca experiencia. Sin embargo, nada es imposible. Si sigues el path de estudio con disciplina y te enfrentas a varias máquinas prácticas para entrenar tu mente, definitivamente vas a romperla.

Espero haberte motivado con esta review y, si no es así, al menos que te sirva para reflexionar sobre tu propio camino; siempre vale la pena vivir experiencias tan enriquecedoras como esta. ¡Mis mejores deseos para todos los que se animen a dar el paso y para quienes siguen avanzando en esta apasionante carrera!
