# Ambient RGB Clock

> **MAKHEX concept / not a validated kit.** This project is an editable build plan, not firmware copied from the credited independent creator. Exact wiring, suppliers, SDK versions and assembly require testing.

[MAKHEX build page](https://makhex.com/projects/rgb-matrix-clock/) · [Join discussion](https://makhex.com/projects/rgb-matrix-clock/#discussion) · [Download BOM](https://makhex.com/projects/rgb-matrix-clock.csv)

## Build objective

Drive a WS2812 LED array as a colorful clock or status board. The important design exercise is power, not animation: establish an externally rated supply, common ground and safe pixel signal levels before increasing brightness.

## Real use cases

1. A desk clock that changes display modes
2. A status indicator for local maker projects
3. Experimenting with LED animation and brightness limits

## Before you order, wire or power

1. Size a separate 5 V supply for the real LED count; a 5V/5A US plug supply candidate is in the BOM, but its safety listing, wiring and load regulation are not verified.
2. Confirm ESP32-to-pixel logic compatibility and wiring length; add an appropriate level shifter if needed.

## Research-stage BOM

| Component slug | Qty | Intended role |
|---|---:|---|
| esp32-c3-supermini | 1 | LED controller |
| ws2812-leds | 1 | 8×8 (64-pixel) matrix variant; not 8-LED ring |
| 5v-5a-led-power | 1 | External US-plug regulated 5 V/5 A supply candidate |
| usb-c-power-kit | 1 | Prototyping tools |

**Missing or unqualified pieces — not included in subtotal:**
- A power adapter is included as a research candidate, but its exact NRTL-listed US SKU, fused power connection, polarity, current margin and 3.3 V→5 V data level shifting need verification.

The catalog is research-only. Supplier stock, exact variant, compatibility, shipping to ZIP 11021, actual orderability, and fulfillment are **not qualified**. No automatic purchasing or public checkout release.

## Rough bring-up procedure

1. Budget current draw for worst-case LED brightness.
2. Test a small number of pixels on a correctly rated supply.
3. Use common ground and correct logic levels.
4. Synchronize time and impose brightness limits.
5. Add strain relief, diffusion and failure tests.

## Acceptance checks

1. A small pixel subset lights without power or data faults.
2. Current draw at the imposed brightness cap stays under the measured supply limit.
3. Loss of time-sync is displayed distinctly from valid time.

## Instructions for AI coding agents

Start with this file and the [MAKHEX contribution guidance](https://github.com/polygoku/makhex/blob/main/AGENTS.md). Use a working branch or PR, declare the board/firmware revision, and attach reproducible logs.

1. Calculate current budget from verified LED quantity and brightness constraints.
2. Provide firmware color order, power injection and safe startup behavior.

**Do not:** invent pin mappings, expose secrets, copy incompatible firmware, place upstream supplier orders, enable checkout or claim the original creator photograph depicts a MAKHEX prototype.

## Original creator and media

Original creator: **l0calgost / mataberks** · [Original build, repository and firmware](https://github.com/l0calgost/ledclock)

The pictured device may use different boards and firmware. No MAKHEX bench validation is implied.

No original-maker video has been verified for this reference yet.

## Engineering limitations

Never source LED strip current from microcontroller GPIO.

## Contributing

Use the [MAKHEX project discussion](https://makhex.com/projects/rgb-matrix-clock/#discussion) for build notes and measured changes. Submit code or document edits to this repository with the project slug in your PR. Human and AI comments are moderated.