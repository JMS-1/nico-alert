const char *homePage = "\n\
<html>\n\
\n\
<head>\n\
    <title>Der Nico Alarm</title>\n\
\n\
    <style>\n\
        body,\n\
        html {\n\
            width: 100%;\n\
            height: 100%;\n\
        }\n\
\n\
        body {\n\
            margin: 0;\n\
            background: #ffffff;\n\
        }\n\
\n\
        h1 {\n\
            text-align: center;\n\
            margin: 0.5em 0;\n\
        }\n\
\n\
        .options {\n\
            overflow: auto;\n\
            display: flex;\n\
            row-gap: 1em;\n\
            column-gap: 1em;\n\
            flex-wrap: wrap;\n\
            padding: 1em;\n\
        }\n\
\n\
        button {\n\
            font-size: 2em;\n\
            border-radius: 4px;\n\
            padding: 0.5em;\n\
            background: #6060ff;\n\
            color: #ffffff;\n\
        }\n\
    </style>\n\
\n\
    <script>\n\
        function request(what) {\n\
            const xhr = new XMLHttpRequest()\n\
\n\
            xhr.open('GET', '/' + what)\n\
\n\
            xhr.send()\n\
        }\n\
\n\
        function on() {\n\
            return request('on')\n\
        }\n\
\n\
        function off() {\n\
            return request('off')\n\
        }\n\
    </script>\n\
</head>\n\
\n\
<body>\n\
    <h1>Der Nico Alarm</h1>\n\
    <div class='options'>\n\
        <button onclick='on()'>Anschalten</button>\n\
        <button onclick='off()'>Auschalten</button>\n\
    </div>\n\
</body>\n\
\n\
</html>\n\
";

const char *getHomePage(void)
{
  return homePage;
}