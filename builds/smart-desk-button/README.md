# One-Press Smart Button

> **MAKHEX concept / not a validated kit.** This project is an editable build plan, not firmware copied from the credited independent creator. Exact wiring, suppliers, SDK versions and assembly require testing.

[MAKHEX build page](https://makhex.com/projects/smart-desk-button/) · [Join discussion](https://makhex.com/projects/smart-desk-button/#discussion) · [Download BOM](https://makhex.com/projects/smart-desk-button.csv)

## Build objective

Build a single physical button that triggers a low-risk local shortcut and signals success or failure with an LED. The click behavior should work without exposing private credentials or executing unapproved internet actions.

## Real use cases

1. A focus or timer shortcut for a workstation
2. One-touch logging of a harmless local event
3. Learning switch debounce and network retry feedback

## Before you order, wire or power

1. Choose a verified 6×6 mm normally-open momentary pushbutton; one is listed in research but exact fit and pin geometry remain unqualified.
2. Choose an ESP32-C3 GPIO that is not a boot strapping conflict on the actual board.

## Research-stage BOM

| Component slug | Qty | Intended role |
|---|---:|---|
| esp32-c3-supermini | 1 | Input controller |
| ws2812-leds | 1 | 8-pixel LED ring; not 8×8 matrix |
| momentary-tactile-switch | 1 | Physical normally-open input |
| usb-c-power-kit | 1 | Bench power |

**Missing or unqualified pieces — not included in subtotal:**
- The 6×6 mm switch and LED ring are unqualified research variants. The switch needs a proven pull-up/pull-down scheme and boot-safe GPIO.

The catalog is research-only. Supplier stock, exact variant, compatibility, shipping to ZIP 11021, actual orderability, and fulfillment are **not qualified**. No automatic purchasing or public checkout release.

## Rough bring-up procedure

1. Choose a safe input pin for a pushbutton.
2. Debounce and distinguish press patterns.
3. Run a mock local action first.
4. Report success or failure with LED status.
5. Keep credentials out of Git history.

## Acceptance checks

1. Short and long presses are debounced consistently.
2. LED state distinguishes acknowledgement from timeout.
3. No API secret is stored in source or sent in a public request.

## Instructions for AI coding agents

Start with this file and the [MAKHEX contribution guidance](https://github.com/polygoku/makhex/blob/main/AGENTS.md). Use a working branch or PR, declare the board/firmware revision, and attach reproducible logs.

1. Write a pin-selection and debounce test matrix.
2. Implement local no-op mock action before real network integration.

**Do not:** invent pin mappings, expose secrets, copy incompatible firmware, place upstream supplier orders, enable checkout or claim the original creator photograph depicts a MAKHEX prototype.

## Original creator and media

Original creator: **aamat09** · [Original build, repository and firmware](https://github.com/aamat09/baby-tracker-suite)

The pictured device may use different boards and firmware. No MAKHEX bench validation is implied.

No original-maker video has been verified for this reference yet.

## Engineering limitations

Do not embed private API tokens or expose unauthenticated control endpoints.

## Contributing

Use the [MAKHEX project discussion](https://makhex.com/projects/smart-desk-button/#discussion) for build notes and measured changes. Submit code or document edits to this repository with the project slug in your PR. Human and AI comments are moderated.