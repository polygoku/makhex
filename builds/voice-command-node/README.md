# Offline Voice Command Node

> **MAKHEX concept / not a validated kit.** This project is an editable build plan, not firmware copied from the credited independent creator. Exact wiring, suppliers, SDK versions and assembly require testing.

[MAKHEX build page](https://makhex.com/projects/voice-command-node/) · [Join discussion](https://makhex.com/projects/voice-command-node/#discussion) · [Download BOM](https://makhex.com/projects/voice-command-node.csv)

## Build objective

A microphone, a local command classifier and a speaker can become a push-to-talk desk assistant. Keep the first milestone intentionally narrow: recognize a handful of fixed commands rather than promising general-purpose fully offline conversation. The referenced Dudley project is a hybrid voice system, not proof of an offline MAKHEX build.

## Real use cases

1. Hands-free status or timer commands at a workbench
2. I2S microphone and amplifier experimentation
3. Latency and memory profiling of tiny on-device recognition models

## Before you order, wire or power

1. Select an electrically compatible 3.3 V I2S microphone, amplifier and speaker; the speaker and pushbutton are not yet in the kit.
2. Verify the board has sufficient PSRAM and use a hardware control with an unmistakable microphone-active indicator.

## Research-stage BOM

| Component slug | Qty | Intended role |
|---|---:|---|
| esp32-s3-devkit | 1 | Processor |
| i2s-mems-mic | 1 | Audio input |
| i2s-amplifier | 1 | Speaker driver |
| usb-c-power-kit | 1 | Stable supply |

**Missing or unqualified pieces — not included in subtotal:**
- A compatible physical speaker must be chosen and added to the BOM.

The catalog is research-only. Supplier stock, exact variant, compatibility, shipping to ZIP 11021, actual orderability, and fulfillment are **not qualified**. No automatic purchasing or public checkout release.

## Rough bring-up procedure

1. Verify microphone and amplifier independently.
2. Check memory and firmware SDK compatibility.
3. Build push-to-talk with a visible recording indicator.
4. Benchmark a small on-device command recognizer.
5. Add error recovery and timeout handling.

## Acceptance checks

1. Record and play back intelligible audio without buffer underruns.
2. Recognize three documented commands under a measured noise condition.
3. The device visibly stops listening on timeout and never silently records.

## Instructions for AI coding agents

Start with this file and the [MAKHEX contribution guidance](https://github.com/polygoku/makhex/blob/main/AGENTS.md). Use a working branch or PR, declare the board/firmware revision, and attach reproducible logs.

1. Document separate microphone and amplifier bring-up procedures before the combined firmware.
2. Record the recognition model, memory allocation and repeatable latency benchmark.

**Do not:** invent pin mappings, expose secrets, copy incompatible firmware, place upstream supplier orders, enable checkout or claim the original creator photograph depicts a MAKHEX prototype.

## Original creator and media

Original creator: **muhammedsaban** · [Original build, repository and firmware](https://github.com/muhammedsaban/dudley)

The pictured device may use different boards and firmware. No MAKHEX bench validation is implied.

No original-maker video has been verified for this reference yet.

## Engineering limitations

General-purpose offline speech recognition is not practical on all ESP32 modules; verify model memory needs.

## Contributing

Use the [MAKHEX project discussion](https://makhex.com/projects/voice-command-node/#discussion) for build notes and measured changes. Submit code or document edits to this repository with the project slug in your PR. Human and AI comments are moderated.