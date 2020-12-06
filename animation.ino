#include <Adafruit_NeoPixel.h>

#define RED_INDEX 0
#define GREEN_INDEX 1
#define YELLOW_INDEX 2

const uint32_t reds[] = {
    Adafruit_NeoPixel::Color(16, 0, 0),
    Adafruit_NeoPixel::Color(32, 2, 2),
    Adafruit_NeoPixel::Color(32, 4, 4)};

const uint32_t greens[] = {
    Adafruit_NeoPixel::Color(0, 16, 0),
    Adafruit_NeoPixel::Color(2, 32, 2),
    Adafruit_NeoPixel::Color(4, 32, 4)};

const uint32_t yellows[] = {
    Adafruit_NeoPixel::Color(16, 16, 0),
    Adafruit_NeoPixel::Color(32, 32, 2),
    Adafruit_NeoPixel::Color(32, 32, 4)};

void setColor(Adafruit_NeoPixel &pixels, uint32_t color)
{
    for (int i = 0; i < 7; i++)
    {
        pixels.setPixelColor(i, color);
    }

    pixels.show();
}

const uint32_t *getColors(int index)
{
    switch (index)
    {
    case RED_INDEX:
        return reds;
    case YELLOW_INDEX:
        return yellows;
    case GREEN_INDEX:
        return greens;
    }

    return reds;
}

void showFrame(Adafruit_NeoPixel &pixels, int &frame, int center, int ring)
{
    const auto centerColors = getColors(center);
    const auto ringColors = getColors(ring);

    auto centerIndex = frame % 4;
    auto centerColor = (centerIndex == 2) ? centerColors[2] : (centerIndex == 0) ? centerColors[0] : centerColors[1];

    pixels.setPixelColor(0, centerColor);

    auto ringBias = (frame % 6);

    for (auto i = 1; i < 7; i++)
    {
        auto ringIndex = (ringBias + i) % 3;

        pixels.setPixelColor(i, ringColors[ringIndex]);
    }

    pixels.show();

    frame = (frame + 1) % 12;
}