#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266mDNS.h>

#include <ESP8266WebServer.h>

#include <Adafruit_NeoPixel.h>

#include "private.h"

const char *ssid = STASSID;
const char *password = STAPSK;

ESP8266WebServer server(80);

Adafruit_NeoPixel pixels = Adafruit_NeoPixel(7, D2, NEO_GRB + NEO_KHZ800);

bool on = true;

void handleRoot()
{
  server.send(200, "text/html", "\n\
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
");
}

void setup(void)
{
  pinMode(D2, OUTPUT);

  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
  }

  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  MDNS.begin("esp8266");

  server.on("/", handleRoot);

  server.on(
      "/on", []() {
        on = true;

        server.send(200, "text/plain", "ON");
      });

  server.on(
      "/off", []() {
        on = false;

        server.send(200, "text/plain", "OFF");
      });

  server.begin();

  pixels.begin();
}

int at = 0;

void green()
{
  if (!on)
  {
    return;
  }

  auto color = ((int)(at / 7)) % 3;
  auto pos = at % 7;

  for (int i = 0; i < 7; i++)
  {
    pixels.setPixelColor(i, pixels.Color(
                                (i == pos && color == 0) ? 16 : 0,
                                (i == pos && color == 1) ? 16 : 0,
                                (i == pos && color == 2) ? 16 : 0));
  }

  pixels.show();

  at = (at + 1) % 21;

  delay(250);
}

void loop(void)
{
  server.handleClient();

  MDNS.update();

  green();
}
