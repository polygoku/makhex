# Touch Weather Station

> **MAKHEX concept / not a validated kit.** This project is an editable build plan, not firmware copied from the credited independent creator. Exact wiring, suppliers, SDK versions and assembly require testing.

[MAKHEX build page](https://makhex.com/projects/touch-weather-station/) · [Join discussion](https://makhex.com/projects/touch-weather-station/#discussion) · [Download BOM](https://makhex.com/projects/touch-weather-station.csv)

## Build objective

Build a touch-operated desktop display that makes room climate readings glanceable. Start with a sensor-only serial test, prove the exact LCD and touch controller, then combine them in a simple LVGL layout. This MAKHEX configuration is different from the independently photographed weather display.

## Real use cases

1. Desk climate display for a home office
2. Learning LVGL screen navigation and UI fault states
3. Monitoring environmental trends while prototyping

## Before you order, wire or power

1. Identify the precise display controller, touch chip and backlight pin mapping from the purchased board.
2. Confirm the BME280 uses 3.3 V and that its I2C pins do not conflict with the display.

## Research-stage BOM

| Component slug | Qty | Intended role |
|---|---:|---|
| esp32-s3-touch-35 | 1 | Touch interface |
| bme280-sensor | 1 | Environment readings |
| usb-c-power-kit | 1 | Bench power |

The catalog is research-only. Supplier stock, exact variant, compatibility, shipping to ZIP 11021, actual orderability, and fulfillment are **not qualified**. No automatic purchasing or public checkout release.

## Rough bring-up procedure

1. Identify the exact display and touch controller SKU.
2. Verify display firmware alone before adding peripherals.
3. Read BME280 sensor values over verified I²C pins.
4. Build LVGL screen states and stale-data warnings.
5. Stress-test touch, power and thermal behavior.

## Acceptance checks

1. A live temperature/humidity reading appears with a last-updated timestamp.
2. Touch works for 30 minutes without freezes or phantom presses.
3. Unplugging the sensor produces a visible stale-data warning rather than a fabricated reading.

## Instructions for AI coding agents

Start with this file and the [MAKHEX contribution guidance](https://github.com/polygoku/makhex/blob/main/AGENTS.md). Use a working branch or PR, declare the board/firmware revision, and attach reproducible logs.

1. Map actual screen/touch GPIO from the board schematic before writing display drivers.
2. Provide a minimal sensor example and LVGL build instructions with a reproducible flash log.

**Do not:** invent pin mappings, expose secrets, copy incompatible firmware, place upstream supplier orders, enable checkout or claim the original creator photograph depicts a MAKHEX prototype.

## Original creator and media

Original creator: **Damov** · [Original build, repository and firmware](https://github.com/Damov/esp32_weather_forecast_screen)

The pictured device may use different boards and firmware. No MAKHEX bench validation is implied.

No original-maker video has been verified for this reference yet.

## Engineering limitations

Controller, I²C bus and GPIO maps are board-dependent; never rely on generic wiring.

## Contributing

Use the [MAKHEX project discussion](https://makhex.com/projects/touch-weather-station/#discussion) for build notes and measured changes. Submit code or document edits to this repository with the project slug in your PR. Human and AI comments are moderated.