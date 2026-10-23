# ESP-NOW Wireless Remote

> **MAKHEX concept / not a validated kit.** This project is an editable build plan, not firmware copied from the credited independent creator. Exact wiring, suppliers, SDK versions and assembly require testing.

[MAKHEX build page](https://makhex.com/projects/espnow-remote/) · [Join discussion](https://makhex.com/projects/espnow-remote/#discussion) · [Download BOM](https://makhex.com/projects/espnow-remote.csv)

## Build objective

Pair two ESP32-C3 boards over ESP-NOW and build a very small wireless remote demonstration. Start by proving packet exchange and receive acknowledgements before adding a button, enclosure or any control output.

## Real use cases

1. Learning short-range ESP-NOW data exchange
2. Measuring packet retries, latency and link loss
3. Prototyping non-critical wireless desk controls

## Before you order, wire or power

1. Use matching ESP32-C3 boards and firmware versions on both ends.
2. Never connect the demo to a safety-critical actuator or lock.

## Research-stage BOM

| Component slug | Qty | Intended role |
|---|---:|---|
| esp32-c3-supermini | 2 | Transmitter and receiver |
| usb-c-power-kit | 2 | Bench supplies |

The catalog is research-only. Supplier stock, exact variant, compatibility, shipping to ZIP 11021, actual orderability, and fulfillment are **not qualified**. No automatic purchasing or public checkout release.

## Rough bring-up procedure

1. Flash both boards with compatible firmware.
2. Exchange peer identifiers securely.
3. Send packets with sequence IDs.
4. Measure drops and retry behavior.
5. Add authentication and safe timeout fallback.

## Acceptance checks

1. Peer pairing is documented and repeatable.
2. Each button event carries a sequence number and acknowledgement.
3. Loss of link returns the receiver to a harmless idle state.

## Instructions for AI coding agents

Start with this file and the [MAKHEX contribution guidance](https://github.com/polygoku/makhex/blob/main/AGENTS.md). Use a working branch or PR, declare the board/firmware revision, and attach reproducible logs.

1. Publish compatible sender/receiver firmware and a measurement script.
2. Document channel, pairing, auth and timeout assumptions.

**Do not:** invent pin mappings, expose secrets, copy incompatible firmware, place upstream supplier orders, enable checkout or claim the original creator photograph depicts a MAKHEX prototype.

## Original creator and media

Original creator: **ncmreynolds** · [Original build, repository and firmware](https://github.com/ncmreynolds/sticky)

The pictured device may use different boards and firmware. No MAKHEX bench validation is implied.

No original-maker video has been verified for this reference yet.

## Engineering limitations

Not for safety-critical remote control or actuators.

## Contributing

Use the [MAKHEX project discussion](https://makhex.com/projects/espnow-remote/#discussion) for build notes and measured changes. Submit code or document edits to this repository with the project slug in your PR. Human and AI comments are moderated.