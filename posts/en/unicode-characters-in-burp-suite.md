---
id: "caracteres-unicode-en-burp-suite"
title: "Unicode Characters in Burp Suite"
author: "eric-labrador"
publishedDate: 2023-07-28
updatedDate: 2023-07-28
image: "https://cdn.deephacking.tech/i/posts/caracteres-unicode-en-burp-suite/caracteres-unicode-en-burp-suite-0.webp"
description: "Discover how to use Unicode characters in Burp Suite to bypass web application filters and improve your pentesting techniques."
categories:
  - "web"
draft: false
featured: false
lang: "en"
---

After some time I'm back to Deep Hacking with a post about a TIP I recently discovered in Burp Suite. I did this research because of the following [tweet by HusseiN98D](https://twitter.com/HusseiN98D/status/1681347329243201553).

When I saw this, I couldn't understand how he was using Unicode characters in the Repeater without using URL Encoding.

The default font in Burp Suite is _**Courier New**_, if we try to do **CTRL + V** to paste Unicode text the following will happen:

![Failed attempt to paste Unicode characters in Burp Suite with Courier New font showing squares](https://cdn.deephacking.tech/i/posts/caracteres-unicode-en-burp-suite/caracteres-unicode-en-burp-suite-1.avif)

I haven't thoroughly investigated the reason for this, but most likely the font type doesn't have the characters you want to paste and that's why the characters appear as squares.

Well, after researching many Burp options I came to the conclusion that this happens exactly because of the font type. Looking at different fonts, there are many that accept some Unicode characters and others don't. For example, the one I currently use is _**Monospaced 14pt**_ since it's the most readable for me (although it depends on the person) and it's the font that accepts the Unicode characters I need to use when auditing a web application:

![Monospaced font configuration in Burp Suite showing Unicode characters correctly](https://cdn.deephacking.tech/i/posts/caracteres-unicode-en-burp-suite/caracteres-unicode-en-burp-suite-2.avif)

This font type accepts all these characters:

<figure>

⓪①②③④⑤⑥⑦⑧⑨


<figcaption>

With these characters you can test whether a web application's filters work correctly or not, that is, the web may block any internal IP address:

</figcaption>

</figure>

![Burp Suite blocking access to internal IP address 127.0.0.1 with error message](https://cdn.deephacking.tech/i/posts/caracteres-unicode-en-burp-suite/caracteres-unicode-en-burp-suite-3.avif)

But when entering an IP address in Unicode format, you can bypass the implemented filters and gain access to an internal network IP:

![Successful filter bypass using Unicode characters to access 127.0.0.1](https://cdn.deephacking.tech/i/posts/caracteres-unicode-en-burp-suite/caracteres-unicode-en-burp-suite-4.avif)

As you can see in the capture, the server performs [Unicode normalization](https://unicode.org/reports/tr15/) and, since there are no filters that restrict an IP address in Unicode format, the server will work as if a public URL were being requested (which is what the web is configured for). If you try to enter **google.com** for example, it will work correctly.

The font configuration in the latest version of Burp can be found in Settings:

![Font configuration menu in Burp Suite Settings](https://cdn.deephacking.tech/i/posts/caracteres-unicode-en-burp-suite/caracteres-unicode-en-burp-suite-5.avif)

The website where I performed the tests is a custom one that I set up with the following Python script:

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
        # No need to make the request here
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

Although Unicode characters can be generated on this [online Unicode conversion tool](https://qaz.wtf/u/convert.cgi). We can also use the following Burp Suite extension that I made:

- [Burp-Encode-IP Extension on GitHub](https://github.com/e1abrador/Burp-Encode-IP)

With this extension we can quickly generate Unicode characters from Burp Suite.
