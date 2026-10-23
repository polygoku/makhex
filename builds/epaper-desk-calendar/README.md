# E-Paper Desk Calendar

> **MAKHEX concept / not a validated kit.** This project is an editable build plan, not firmware copied from the credited independent creator. Exact wiring, suppliers, SDK versions and assembly require testing.

[MAKHEX build page](https://makhex.com/projects/epaper-desk-calendar/) · [Join discussion](https://makhex.com/projects/epaper-desk-calendar/#discussion) · [Download BOM](https://makhex.com/projects/epaper-desk-calendar.csv)

## Build objective

Make a quiet always-on calendar that refreshes a small e-paper screen only when necessary. First prove the panel/controller combination with a static test image; then add local date handling, Wi-Fi time sync and sleep without excessive refresh cycles.

## Real use cases

1. A low-distraction desk date and agenda display
2. Learning SPI displays and deep sleep
3. Exploring refresh endurance and ghosting tradeoffs

## Before you order, wire or power

1. Match the 2.9-inch panel controller and FPC to its library; current supplier bundle is not yet verified.
2. Choose a reliable timezone and offline fallback when NTP cannot be reached.

## Research-stage BOM

| Component slug | Qty | Intended role |
|---|---:|---|
| esp32-c3-supermini | 1 | Controller |
| epaper-29 | 1 | Display |
| usb-c-power-kit | 1 | Bench power |

The catalog is research-only. Supplier stock, exact variant, compatibility, shipping to ZIP 11021, actual orderability, and fulfillment are **not qualified**. No automatic purchasing or public checkout release.

## Rough bring-up procedure

1. Select the correct e-paper driver library.
2. Render a static test pattern.
3. Synchronize time and timezone safely.
4. Use correct refresh intervals and full-refresh maintenance.
5. Measure sleep current before battery testing.

## Acceptance checks

1. A static test pattern renders cleanly.
2. Date/time remain correct through a restart and network loss.
3. Deep sleep and refresh intervals are measured and documented.

## Instructions for AI coding agents

Start with this file and the [MAKHEX contribution guidance](https://github.com/polygoku/makhex/blob/main/AGENTS.md). Use a working branch or PR, declare the board/firmware revision, and attach reproducible logs.

1. Make controller-selection checks explicit before library recommendations.
2. Provide a safe demo without requiring personal calendar credentials.

**Do not:** invent pin mappings, expose secrets, copy incompatible firmware, place upstream supplier orders, enable checkout or claim the original creator photograph depicts a MAKHEX prototype.

## Original creator and media

Original creator: **trandi** · [Original build, repository and firmware](https://github.com/trandi/e-paper-calendar)

The pictured device may use different boards and firmware. No MAKHEX bench validation is implied.

[Watch original maker video](https://youtu.be/xnUqWcdtqyU) — trandi (reference only).

## Engineering limitations

Panel ghosting and burn-in may result from incorrect refresh behavior; consult module documentation.

## Contributing

Use the [MAKHEX project discussion](https://makhex.com/projects/epaper-desk-calendar/#discussion) for build notes and measured changes. Submit code or document edits to this repository with the project slug in your PR. Human and AI comments are moderated.