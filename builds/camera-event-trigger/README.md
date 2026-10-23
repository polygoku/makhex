# Local Camera Event Trigger

> **MAKHEX concept / not a validated kit.** This project is an editable build plan, not firmware copied from the credited independent creator. Exact wiring, suppliers, SDK versions and assembly require testing.

[MAKHEX build page](https://makhex.com/projects/camera-event-trigger/) · [Join discussion](https://makhex.com/projects/camera-event-trigger/#discussion) · [Download BOM](https://makhex.com/projects/camera-event-trigger.csv)

## Build objective

Use a small camera board to detect changes between frames and log simple local events. Keep video local and avoid collecting sensitive images: this is a camera/software learning prototype rather than a certified security or monitoring system.

## Real use cases

1. Learning ESP32 camera-frame capture and PSRAM limits
2. Detecting a non-sensitive change at a model workbench
3. Comparing frame-difference thresholds in changing light

## Before you order, wire or power

1. Verify the exact camera module, lens, GPIO assignment and PSRAM capacity; bundle compatibility is currently on HOLD.
2. Point the camera at an explicitly consented, non-sensitive test scene.

## Research-stage BOM

| Component slug | Qty | Intended role |
|---|---:|---|
| esp32-s3-camera | 1 | Camera platform |
| usb-c-power-kit | 1 | Stable supply |

The catalog is research-only. Supplier stock, exact variant, compatibility, shipping to ZIP 11021, actual orderability, and fulfillment are **not qualified**. No automatic purchasing or public checkout release.

## Rough bring-up procedure

1. Check camera driver compatibility for the exact board.
2. Validate local frame capture and memory use.
3. Implement a lightweight frame-change detector.
4. Log non-sensitive events only.
5. Add visible camera-active status and deletion.

## Acceptance checks

1. A stable frame stream runs within measured memory limits.
2. A synthetic scene change creates a timestamped local event.
3. An obvious camera-active indicator and local event deletion work.

## Instructions for AI coding agents

Start with this file and the [MAKHEX contribution guidance](https://github.com/polygoku/makhex/blob/main/AGENTS.md). Use a working branch or PR, declare the board/firmware revision, and attach reproducible logs.

1. Pin down camera sensor model, frame size and PSRAM usage first.
2. Offer deterministic fixture tests for false triggers under varying light.

**Do not:** invent pin mappings, expose secrets, copy incompatible firmware, place upstream supplier orders, enable checkout or claim the original creator photograph depicts a MAKHEX prototype.

## Original creator and media

Original creator: **bernardoeugster** · [Original build, repository and firmware](https://github.com/bernardoeugster/espseccam)

The pictured device may use different boards and firmware. No MAKHEX bench validation is implied.

No original-maker video has been verified for this reference yet.

## Engineering limitations

Do not present an unverified prototype as a safety or security monitoring product.

## Contributing

Use the [MAKHEX project discussion](https://makhex.com/projects/camera-event-trigger/#discussion) for build notes and measured changes. Submit code or document edits to this repository with the project slug in your PR. Human and AI comments are moderated.