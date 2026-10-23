# Tiny BLE Beacon

> **MAKHEX concept / not a validated kit.** This project is an editable build plan, not firmware copied from the credited independent creator. Exact wiring, suppliers, SDK versions and assembly require testing.

[MAKHEX build page](https://makhex.com/projects/tiny-ble-presence/) · [Join discussion](https://makhex.com/projects/tiny-ble-presence/#discussion) · [Download BOM](https://makhex.com/projects/tiny-ble-presence.csv)

## Build objective

Configure an ESP32-C3 to broadcast a rotating, non-identifying BLE demonstration payload and inspect it from a nearby scanner. This teaches GAP advertising and radio duty cycling without building a covert person-tracking system.

## Real use cases

1. Learning BLE advertising packet formats
2. Testing low-power sleep and wake intervals
3. Prototyping anonymous local device discovery

## Before you order, wire or power

1. Check the ESP32-C3 board revision and BLE stack support in your chosen ESP-IDF release.
2. Use a test identifier unrelated to any person, device owner or real-world asset.

## Research-stage BOM

| Component slug | Qty | Intended role |
|---|---:|---|
| esp32-c3-supermini | 1 | BLE transmitter |
| usb-c-power-kit | 1 | Development supply |

The catalog is research-only. Supplier stock, exact variant, compatibility, shipping to ZIP 11021, actual orderability, and fulfillment are **not qualified**. No automatic purchasing or public checkout release.

## Rough bring-up procedure

1. Flash a supported BLE advertising example.
2. Set a non-identifying payload.
3. Verify visibility from a BLE scanner.
4. Measure active and sleep currents.
5. Document range and privacy tradeoffs.

## Acceptance checks

1. A standard BLE scanner sees the advertised demo service.
2. Payload and transmit interval match the documented firmware.
3. Measured idle and transmit current are recorded with the meter setup.

## Instructions for AI coding agents

Start with this file and the [MAKHEX contribution guidance](https://github.com/polygoku/makhex/blob/main/AGENTS.md). Use a working branch or PR, declare the board/firmware revision, and attach reproducible logs.

1. Publish a tiny NimBLE advertising project with reproducible scanner steps.
2. Include privacy limits, rotation interval and current-measurement methodology.

**Do not:** invent pin mappings, expose secrets, copy incompatible firmware, place upstream supplier orders, enable checkout or claim the original creator photograph depicts a MAKHEX prototype.

## Original creator and media

Original creator: **BrunoGG69** · [Original build, repository and firmware](https://github.com/BrunoGG69/Spottr)

The pictured device may use different boards and firmware. No MAKHEX bench validation is implied.

[Watch original maker video](https://youtu.be/ntAMRt7f-G8) — BrunoGG69 (reference only).

## Engineering limitations

Never use a BLE beacon to secretly identify or track individuals.

## Contributing

Use the [MAKHEX project discussion](https://makhex.com/projects/tiny-ble-presence/#discussion) for build notes and measured changes. Submit code or document edits to this repository with the project slug in your PR. Human and AI comments are moderated.