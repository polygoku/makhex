# MAKHEX Build 11 — Independent U.S. English firmware specification

**Status: design specification only. No hardware-flashed application, commercial firmware, or student-facing service exists yet.**

The original samyeei learning-assistant application uses PolyForm Noncommercial 1.0.0. Do **not** copy its C files, bundled firmware, UI JSON/bitmaps, models, prompts, screenshots or artwork into a commercial MAKHEX build. This document describes a separate implementation using publicly documented hardware behavior and permissively licensed dependencies. Its creator credit, source license and build provenance stay in MAKHEX GitHub documentation.

## Hardware baseline

1. Core: ESP-Mosaico ESP32-S31 Core Unit V1.2 (480 × 480 touch OLED, onboard mic/speaker/ES8311, internal cell, USB-C).
2. Camera: official Camera Module V1.4 **SC101IOT** on LEFT H2, using official documented BSP; alternatively V1.2 **OV3640**, but compile/test a separate driver target. Never infer the old firmware supports SC101IOT.
3. Interaction board: optional for core camera/voice workflow, included in official Vision Combo Kit.
4. Data-capable USB-C cable; user's 2.4 GHz Wi-Fi. For a standalone component plan, verify the specific part versions and lawful U.S. freight/returns.

## Clean implementation modules

| Component | Proposed independent responsibility | Acceptance evidence |
|---|---|---|
| `board/esp_mosaico_s31.c` | Board init, GPIO and power rails using supported Apache-2.0 BSP APIs | Bench logs for detected board revision and recovery ABI |
| `capture/sc101iot.c` / `capture/ov3640.c` | Left-H2 camera probe, DVP capture, flash, orientation | Test image/frame checksum on real hardware and no H1 access |
| `ui/learn_lvgl.c` | Original, English-first 480×480 UI; camera view, question list, answer, transcript, settings | U.S. English strings and 200% zoom/large-touch-target QA |
| `audio/audio_stream.c` | Record from on-board microphone, playback via on-board codec/speaker | Voice latency, clipping and privacy LED/notice verification |
| `net/provision.c` | 2.4 GHz Wi-Fi and model credentials setup with secure storage | Client isolation, credentials redaction, factory reset and revoke |
| `providers/cloud_api.c` | Explicit HTTPS provider adapter for U.S.-available vision, ASR, and TTS | TLS validation, rate limits, quota/cost/error handling |
| `learning/state_machine.c` | Capture → detect questions → select → answer → follow up | Reproducible offline test fixtures independent of original source |
| `packaging/ota.c` | Safe package that targets current recovery ABI only when officially supported | Signed bundle, rollback and no forbidden old-ABI downgrade |

## Required commercial acceptance tests

- Bench-verify exact camera SKU with current ESP32-S31 BSP and operating recovery layout, on a separate test unit. No destructive firmware install.
- Test English speech recognition and synthesis from the United States with a controlled API account and cost ceiling. Never print or store plaintext API keys in logs.
- Map difficulty to U.S. grades 1–12 only after pedagogical testing; generic LLM outputs can be incorrect. Use a visible warning and feedback mechanism.
- Address COPPA/privacy obligations before directing the service to children under 13. Prefer parent-controlled account setup, purpose limitation and retention controls, and do not upload worksheets containing identifiable children in testing.
- Provide supplier-deliverable kit contents, real photos with reuse permission, ZIP 11021 shipping, returns and end-to-end Squarespace–Doroppu checkout/fulfillment before turning on payment.
- Do not claim a simulator, static screenshots or an English concept MP4 are working firmware.

## Existing source and background

Original noncommercial research: https://github.com/samyeei/mosaico-learning-assistant

Manufacturer: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s31/esp-mosaico/user_guide_camera.html and https://mosaico.ai/en/faq

Independent site video source: `scripts/render-build11-video.py` and `public/demo/build11-en-concept.mp4`. Concept media intentionally uses none of the original project's protected software or raw footage.
