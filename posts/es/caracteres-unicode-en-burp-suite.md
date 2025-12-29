---
id: "caracteres-unicode-en-burp-suite"
title: "Caracteres Unicode en Burp Suite"
author: "eric-labrador"
publishedDate: 2023-07-28
updatedDate: 2023-07-28
image: "https://cdn.deephacking.tech/i/posts/caracteres-unicode-en-burp-suite/caracteres-unicode-en-burp-suite-0.webp"
description: "Descubre cómo utilizar caracteres Unicode en Burp Suite para bypassear filtros de aplicaciones web y mejorar tus técnicas de pentesting."
categories:
  - "web"
draft: false
featured: false
lang: "es"
---

Después de un tiempo vuelvo a Deep Hacking con un post sobre un TIP que descubrí hace poco en Burp Suite. Esta investigación la hice a causa del siguiente [tweet de HusseiN98D](https://twitter.com/HusseiN98D/status/1681347329243201553).

Al ver esto, no podía entender como estaba utilizando caracteres Unicode en el Repeater sin hacer uso del URL Encoding.

La fuente por defecto de Burp Suite es _**Courier New**_, si intentamos hacer **CTRL + V** para pegar texto en Unicode pasará lo siguiente:

![Intento fallido de pegar caracteres Unicode en Burp Suite con fuente Courier New mostrando cuadrados](https://cdn.deephacking.tech/i/posts/caracteres-unicode-en-burp-suite/caracteres-unicode-en-burp-suite-1.avif)

No he investigado a fondo el porqué de este motivo, pero lo más probable es que en el tipo de fuente no existan los caracteres que se quieren pegar y por eso mismo salgan los caracteres en forma de cuadrados.

Pues bien, investigando muchas opciones de Burp llegué a la conclusión que esto pasa exactamente por el tipo de fuente. Mirando distintas fuentes hay muchas que aceptan algunos caracteres en Unicode y otras no, por ejemplo, la que uso actualmente es _**Monospaced 14pt**_ ya que es la que más amigable se me hace para leer (aunque depende de la persona) y la fuente que acepta los caracteres en Unicode que necesito usar cuando estoy auditando una aplicación web:

![Configuración de fuente Monospaced en Burp Suite mostrando caracteres Unicode correctamente](https://cdn.deephacking.tech/i/posts/caracteres-unicode-en-burp-suite/caracteres-unicode-en-burp-suite-2.avif)

Este tipo de letra acepta todos estos caracteres:

<figure>

⓪①②③④⑤⑥⑦⑧⑨


<figcaption>

Con estos caracteres se puede testear si los filtros de una aplicación web funcionan correctamente o no, es decir, puede ser que la web bloquee cualquier dirección IP interna:

</figcaption>

</figure>

![Burp Suite bloqueando acceso a dirección IP interna 127.0.0.1 con mensaje de error](https://cdn.deephacking.tech/i/posts/caracteres-unicode-en-burp-suite/caracteres-unicode-en-burp-suite-3.avif)

Pero que al momento de introducir una dirección IP en formato Unicode se logre bypasear los filtros implementados y se consiga acceder a una IP de la red interna:

![Bypass exitoso de filtros usando caracteres Unicode para acceder a 127.0.0.1](https://cdn.deephacking.tech/i/posts/caracteres-unicode-en-burp-suite/caracteres-unicode-en-burp-suite-4.avif)

Como se puede ver en la captura, el servidor hace el [normalize del Unicode](https://unicode.org/reports/tr15/) y, dado que no hay filtros que restrinjan una dirección IP en el formato Unicode, el servidor funcionará como si se solicitara una URL pública (que es para lo que está configurada la web). Si se prueba por ejemplo a introducir **google.com** funcionará correctamente.

La configuración de la letra en la última versión de Burp se puede encontrar en Settings:

![Menú de configuración de fuentes en Burp Suite Settings](https://cdn.deephacking.tech/i/posts/caracteres-unicode-en-burp-suite/caracteres-unicode-en-burp-suite-5.avif)

La web donde he realizado las pruebas corresponde a una personalizada que he montado con el siguiente script en Python:

```python
from flask import Flask, request, Response
import requests
from urllib.parse import urlparse

app = Flask(__name__)

def is_internal(ip):
    if ip.startswith('127.0.0.1') or ip.startswith('192.168.') or ip.startswith('10.') or (ip.startswith('172.') and int(ip.split('.')[1]) in range(16, 32)):
        return True
    return False

@app.route('/request', methods=['POST'])
def render_url():
    data = request.get_json()
    if data is None or 'url' not in data:
        return 'Bad request', 400

    url = data['url']

    url_parsed = urlparse(url)

    if url_parsed.hostname is None:
        return 'Bad request', 400

    unicode_to_ascii = {
        '①': '1', '②': '2', '③': '3', '④': '4', '⑤': '5',
        '⑥': '6', '⑦': '7', '⑧': '8', '⑨': '9', '⓪': '0'
    }

    ip = url_parsed.hostname
    for unicode, ascii in unicode_to_ascii.items():
        ip = ip.replace(unicode, ascii)

    if is_internal(ip):
        return 'Internal IPs are not allowed', 403

    ascii_url = url
    for unicode, ascii in unicode_to_ascii.items():
        ascii_url = ascii_url.replace(unicode, ascii)

    ascii_url = ascii_url.replace('。', '.')

    try:
        # No es necesario hacer la solicitud aquí
        # res = requests.get(ascii_url)
        html = f"""<!DOCTYPE html>
<html>
    <body>
        <iframe src="{ascii_url}" width="100%" height="100%"></iframe>
    </body>
</html>"""
        return Response(html, mimetype='text/html')
    except requests.exceptions.RequestException as e:
        return str(e), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0')
```

Aunque se pueden generar caracteres Unicode en esta [herramienta online de conversión Unicode](https://qaz.wtf/u/convert.cgi). También podemos usar la siguiente extensión de Burp Suite que he hecho:

- [Extensión Burp-Encode-IP en GitHub](https://github.com/e1abrador/Burp-Encode-IP)

Con esta extensión podemos realizar la generación de caracteres Unicode de forma rápida desde Burp Suite.
