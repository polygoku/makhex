# Indoor VOC Explorer

> **MAKHEX concept / not a validated kit.** This project is an editable build plan, not firmware copied from the credited independent creator. Exact wiring, suppliers, SDK versions and assembly require testing.

[MAKHEX build page](https://makhex.com/projects/indoor-voc-explorer/) · [Join discussion](https://makhex.com/projects/indoor-voc-explorer/#discussion) · [Download BOM](https://makhex.com/projects/indoor-voc-explorer.csv)

## Build objective

Combine an SGP40 sensor with temperature and humidity compensation to explore relative VOC trends. This sensor output is not a direct carbon-dioxide or particulate measurement, and the prototype must not claim health, safety or air-quality certification.

## Real use cases

1. Observing relative changes when a room is ventilated
2. Studying sensor warm-up and baseline behavior
3. Plotting time-series samples with ambient compensation

## Before you order, wire or power

1. Verify SGP40 and BME280 supply/bus wiring on the exact board.
2. Choose a VOC index library with documented warm-up and state persistence.

## Research-stage BOM

| Component slug | Qty | Intended role |
|---|---:|---|
| esp32-s3-devkit | 1 | Controller |
| sgp40-voc | 1 | VOC sensor |
| bme280-sensor | 1 | Compensation |
| usb-c-power-kit | 1 | Bench supply |

The catalog is research-only. Supplier stock, exact variant, compatibility, shipping to ZIP 11021, actual orderability, and fulfillment are **not qualified**. No automatic purchasing or public checkout release.

## Rough bring-up procedure

1. Verify each sensor on its own.
2. Supply humidity and temperature compensation.
3. Log timestamped data with warm-up status.
4. Render relative trend visualizations.
5. Explain error and sensor baseline behavior.

## Acceptance checks

1. VOC trend and compensation readings appear with timestamps.
2. Warm-up and out-of-range conditions are shown instead of hidden.
3. No CO2 concentration or safety alarm is inferred from VOC data.

## Instructions for AI coding agents

Start with this file and the [MAKHEX contribution guidance](https://github.com/polygoku/makhex/blob/main/AGENTS.md). Use a working branch or PR, declare the board/firmware revision, and attach reproducible logs.

1. State the exact VOC algorithm and supported conditions.
2. Supply test logs for sensor warm-up, disconnect and compensation.

**Do not:** invent pin mappings, expose secrets, copy incompatible firmware, place upstream supplier orders, enable checkout or claim the original creator photograph depicts a MAKHEX prototype.

## Original creator and media

Original creator: **Koen Vervloesem** · [Original build, repository and firmware](https://github.com/koenvervloesem/esphome-air-quality-monitor)

The pictured device may use different boards and firmware. No MAKHEX bench validation is implied.

No original-maker video has been verified for this reference yet.

## Engineering limitations

Not a calibrated CO₂, particulate or life-safety monitor.

## Contributing

Use the [MAKHEX project discussion](https://makhex.com/projects/indoor-voc-explorer/#discussion) for build notes and measured changes. Submit code or document edits to this repository with the project slug in your PR. Human and AI comments are moderated.