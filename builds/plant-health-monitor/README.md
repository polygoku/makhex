# Connected Plant Monitor

> **MAKHEX concept / not a validated kit.** This project is an editable build plan, not firmware copied from the credited independent creator. Exact wiring, suppliers, SDK versions and assembly require testing.

[MAKHEX build page](https://makhex.com/projects/plant-health-monitor/) · [Join discussion](https://makhex.com/projects/plant-health-monitor/#discussion) · [Download BOM](https://makhex.com/projects/plant-health-monitor.csv)

## Build objective

Display the temperature, humidity and pressure around a plant using a BME280 and a small ESP32. This is an ambient-conditions monitor, not a soil-moisture or watering recommendation device. Make that distinction clear in both the dashboard and the data log.

## Real use cases

1. Comparing room humidity around houseplants
2. Learning sensor polling and HTTP status pages
3. Exploring temperature changes near a window or vent

## Before you order, wire or power

1. Confirm the BME280, not BMP280, part number and correct 3.3 V supply.
2. Select a safe Wi-Fi-only local dashboard with no exposed internet control endpoint.

## Research-stage BOM

| Component slug | Qty | Intended role |
|---|---:|---|
| esp32-c3-supermini | 1 | Wi-Fi controller |
| bme280-sensor | 1 | Ambient sensing |
| usb-c-power-kit | 1 | Bench supply |

The catalog is research-only. Supplier stock, exact variant, compatibility, shipping to ZIP 11021, actual orderability, and fulfillment are **not qualified**. No automatic purchasing or public checkout release.

## Rough bring-up procedure

1. Verify the BME280 wiring and supply.
2. Read temperature and humidity.
3. Publish a small read-only local dashboard.
4. Mark stale readings and connection failures.
5. Optionally add a separately qualified soil probe.

## Acceptance checks

1. Room readings update at the chosen interval with units.
2. Power interruption and sensor disconnect are distinguished in the UI.
3. A calibration limitation note is visible next to readings.

## Instructions for AI coding agents

Start with this file and the [MAKHEX contribution guidance](https://github.com/polygoku/makhex/blob/main/AGENTS.md). Use a working branch or PR, declare the board/firmware revision, and attach reproducible logs.

1. Create a read-only local web page with age-of-data indication.
2. Provide serial logs and troubleshooting for common I2C address differences.

**Do not:** invent pin mappings, expose secrets, copy incompatible firmware, place upstream supplier orders, enable checkout or claim the original creator photograph depicts a MAKHEX prototype.

## Original creator and media

Original creator: **ConnerWill** · [Original build, repository and firmware](https://github.com/ConnerWill/esp32-plant)

The pictured device may use different boards and firmware. No MAKHEX bench validation is implied.

No original-maker video has been verified for this reference yet.

## Engineering limitations

Ambient humidity is not soil moisture. Do not infer watering status without a soil sensor.

## Contributing

Use the [MAKHEX project discussion](https://makhex.com/projects/plant-health-monitor/#discussion) for build notes and measured changes. Submit code or document edits to this repository with the project slug in your PR. Human and AI comments are moderated.