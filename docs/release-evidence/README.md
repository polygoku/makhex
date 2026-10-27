# Reproducibility and commerce release gates

Generated 2026-10-27T20:48:30.387Z. The 12 projects reference **28 unique part slugs**. Every supplier/order flag defaults to false until verified from external evidence.

| Build | BOM types | Missing photo slugs | Unpriced slugs | Build certified | Purchase certified |
|---|---:|---|---|---|---|
| [01 touch-weather-station](../../builds/touch-weather-station/README.md) | 3 | None | None | No | No |
| [02 voice-command-node](../../builds/voice-command-node/README.md) | 5 | None | None | No | No |
| [03 tiny-ble-presence](../../builds/tiny-ble-presence/README.md) | 2 | None | None | No | No |
| [04 plant-health-monitor](../../builds/plant-health-monitor/README.md) | 3 | None | None | No | No |
| [05 camera-event-trigger](../../builds/camera-event-trigger/README.md) | 2 | None | None | No | No |
| [06 epaper-desk-calendar](../../builds/epaper-desk-calendar/README.md) | 3 | None | None | No | No |
| [07 indoor-voc-explorer](../../builds/indoor-voc-explorer/README.md) | 4 | None | None | No | No |
| [08 rgb-matrix-clock](../../builds/rgb-matrix-clock/README.md) | 4 | None | None | No | No |
| [09 espnow-remote](../../builds/espnow-remote/README.md) | 2 | None | None | No | No |
| [10 smart-desk-button](../../builds/smart-desk-button/README.md) | 4 | None | None | No | No |
| [11 mosaico-learning-assistant](../../builds/mosaico-learning-assistant/README.md) | 1 | None | None | No | No |
| [12 microduck-robot](../../builds/microduck-robot/README.md) | 14 | None | feetech-hd1910, radxa-zero-3w, microduck-hat, microduck-imu, imx219-160-camera, vl53l5cx-v2, npf550-power-kit, microduck-printed-parts, bearing-6700, bearing-et2216, microduck-fasteners, amp20-servo-cables, microduck-wiring-kit | No | No |

## Required per-project reproducibility evidence

1. Exact board and accessory revision plus pinout, rail voltage/current budget and wiring or PCB source.
2. Revision-pinned firmware repository and flash/build commands with checksums; original rights respected.
3. Mechanical drawing / STL / 3MF / STEP files when the project requires fabricated parts, including unit, print/material settings, and design rights.
4. Creator-attributed real product photos, a video link or explicit evidence that no demonstration exists; no generated visuals represented as tested devices.
5. Repeatable functional test checklist with hardware results, photographs and known failures.

## Required per-part procurement evidence

A supplier record must contain exact AliExpress item and selected option IDs, image evidence matched to that option, observed available quantity, shipping to 11021, quote time/expiry, landed cost, 2.5x proposed markup, margin after free-U.S.-shipping cost, Squarespace SKU/path and merchant inventory. Do not mark verified from generic listing search.

## End-to-end order gate

Keep all purchase approvals disabled until a new paid Squarespace order from its authenticated merchant feed matches a qualified SKU, Doroppu creates one and only one supplier claim, AliExpress returns an order number, provider payment is confirmed, tracking sync and refund/cancel outcomes are independently verified. An uncertain placement cannot be automatically retried.

