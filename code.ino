#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266mDNS.h>

#include <ESP8266WebServer.h>

#include <Adafruit_NeoPixel.h>

#include "./private.h"

const char *ssid = STASSID;
const char *password = STAPSK;

ESP8266WebServer server(80);

Adafruit_NeoPixel pixels = Adafruit_NeoPixel(7, D2, NEO_GRB + NEO_KHZ800);

auto idle = true;

auto frame = 0;
auto nextFrame = millis();
auto endFrame = millis() + 20000;

void start(int center, int ring)
{
  setColors(center, ring);

  frame = 0;
  nextFrame = millis();
  endFrame = millis() + 60000;

  idle = false;

  server.send(200, "text/plain", "OK");
}

void animate()
{
  if (idle)
  {
    return;
  }

  auto now = millis();

  if (now >= endFrame)
  {
    setColor(pixels, pixels.Color(0, 0, 0));

    idle = true;

    return;
  }

  if (now < nextFrame)
  {
    return;
  }

  nextFrame = now + 100;

  showFrame(pixels, frame);
}

void setup(void)
{
  pinMode(D2, OUTPUT);

  pixels.begin();

  setColor(pixels, pixels.Color(0, 0, 32));

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

  server.on("/RR", [] { start(RED_INDEX, RED_INDEX); });
  server.on("/RG", [] { start(RED_INDEX, GREEN_INDEX); });
  server.on("/RY", [] { start(RED_INDEX, YELLOW_INDEX); });

  server.on("/GR", [] { start(GREEN_INDEX, RED_INDEX); });
  server.on("/GG", [] { start(GREEN_INDEX, GREEN_INDEX); });
  server.on("/GY", [] { start(GREEN_INDEX, YELLOW_INDEX); });

  server.on("/YR", [] { start(YELLOW_INDEX, RED_INDEX); });
  server.on("/YG", [] { start(YELLOW_INDEX, GREEN_INDEX); });
  server.on("/YY", [] { start(YELLOW_INDEX, YELLOW_INDEX); });

  server.on("/OFF", [] { endFrame = millis() - 1; server.send(200, "text/plain", "OK"); });

  server.onNotFound([] { server.send(200, "text/html", getHomePage()); });

  server.begin();

  setColor(pixels, pixels.Color(0, 0, 0));
}

void loop(void)
{
  server.handleClient();

  MDNS.update();

  animate();
}