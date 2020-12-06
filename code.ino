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

void handleRoot()
{
  server.send(200, "text/html", getHomePage());
}

auto idle = false;

auto frame = 0;
auto nextFrame = millis();
auto endFrame = millis() + 20000;

auto centerColor = RED_INDEX;
auto ringColor = GREEN_INDEX;

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

  showFrame(pixels, frame, centerColor, ringColor);
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

  server.begin();

  setColor(pixels, pixels.Color(0, 0, 0));
}

void loop(void)
{
  server.handleClient();

  MDNS.update();

  animate();
}
