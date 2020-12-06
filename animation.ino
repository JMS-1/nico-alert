#include <Adafruit_NeoPixel.h>

#define RED_INDEX 0
#define GREEN_INDEX 1
#define YELLOW_INDEX 2

const uint32_t reds[] = {
    Adafruit_NeoPixel::Color(32, 0, 0),
    Adafruit_NeoPixel::Color(12, 0, 0),
    Adafruit_NeoPixel::Color(5, 0, 0),
    Adafruit_NeoPixel::Color(1, 0, 0),
};

const uint32_t greens[] = {
    Adafruit_NeoPixel::Color(0, 32, 0),
    Adafruit_NeoPixel::Color(0, 12, 0),
    Adafruit_NeoPixel::Color(0, 5, 0),
    Adafruit_NeoPixel::Color(0, 1, 0),
};

const uint32_t yellows[] = {
    Adafruit_NeoPixel::Color(32, 32, 0),
    Adafruit_NeoPixel::Color(12, 12, 0),
    Adafruit_NeoPixel::Color(5, 5, 0),
    Adafruit_NeoPixel::Color(1, 1, 0),
};

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
    case YELLOW_INDEX:
        return yellows;
    case GREEN_INDEX:
        return greens;
    default:
        return reds;
    }
}

uint32_t getColor(const uint32_t *colors, int index)
{
    switch (index % 6)
    {
    case 3:
        return colors[3];
    case 2:
    case 4:
        return colors[2];
    case 1:
    case 5:
        return colors[1];
    default:
        return colors[0];
    }
}

void showFrame(Adafruit_NeoPixel &pixels, int &frame, int center, int ring)
{
    const auto centerColors = getColors(center);
    const auto ringColors = getColors(ring);

    pixels.setPixelColor(0, getColor(centerColors, frame));

    for (auto i = 1; i < 7; i++)
    {
        pixels.setPixelColor(i, getColor(ringColors, i + frame));
    }

    pixels.show();

    frame = (frame + 1) % 6;
}