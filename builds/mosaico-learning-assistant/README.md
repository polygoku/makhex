# AI Photo & Voice Learning Assistant — ESP-Mosaico

> **MAKHEX independent U.S.-English hardware research and build reference, October 23, 2026.** The original firmware by samyeei is source-available under **PolyForm Noncommercial 1.0.0**. MAKHEX does **not** redistribute it, adapt its protected code, preinstall it, or sell it. Obtain separate commercial rights or build separately licensed software before any commercial release.

[Project guide](https://makhex.com/projects/mosaico-learning-assistant/) · [Project forum](https://makhex.com/projects/mosaico-learning-assistant/#discussion) · [Research BOM (CSV)](https://makhex.com/projects/mosaico-learning-assistant.csv)

Original creator: **samyeei**  
Original source: https://github.com/samyeei/mosaico-learning-assistant  
Creator demonstration: https://x.com/samyeeiyu/status/2113491864078991859  
Original instructions: https://github.com/samyeei/mosaico-learning-assistant/blob/main/docs/USAGE_CN.md

## What you can learn

Take a photo of a worksheet, choose which recognized problem to discuss, and ask spoken follow-up questions. The independent original is a cloud-connected Chinese-language learning aid, not proof that a MAKHEX kit works in English. This is educational maker research, not a promised homework-answer product. U.S. grades 1–12 equivalents, English prompts, speech models and content suitability need independent validation.

## Hardware BOM derived from the source and manufacturer

The original GitHub repository is an **application source tree**, not a retail bill of materials. Its user manual explicitly requires the ESP-Mosaico host and a camera on the left H2 connector; the microphone and speaker use onboard hardware. The rest of this table is an independent procurement decomposition corroborated by Espressif hardware guides.

| Part | Qty | Required? | Included in current Vision Combo Kit? | Independent orderability |
|---|---:|---|---|---|
| ESP-Mosaico Core Unit V1.2 with ESP32-S31, 480×480 display, onboard microphone, speaker and battery | 1 | Yes | Yes | Separate AliExpress variant unverified |
| ESP-Mosaico Camera Module for left H2 (current kit: SC101IOT V1.4) | 1 | Yes | Yes | Separate AliExpress variant unverified |
| ESP-Mosaico Multi-function Interaction Module (buttons, PIR/light/IR/RGB LEDs) | 1 | Optional for question recognition; included in kit | Yes | Separate AliExpress variant unverified |
| Data-capable USB-C cable, ~1 m | 1 | Yes for provisioning/development | Verify selected seller package | Candidate only, shipping/option unverified |
| 2.4 GHz Wi-Fi and a Qwen/Model Studio account | Customer provides | Yes for original cloud functionality | No | Not a physical product |
| Computer / phone for setup | Customer provides | Setup tool | No | Not a physical product |

**Two mutually exclusive shopping plans** are available on MAKHEX:

1. **Recommended**: one Vision Combo Kit + one USB-C data cable, unless the vendor confirms a cable is already in the box.
2. **Separately sourced research**: one Core Unit, one matching H2 camera, one Interaction Module and one USB-C data cable. Those separate module SKUs are not yet verified for U.S. shipment.

The MAKHEX cart automatically replaces an existing Vision Combo bundle when separate modules are selected, and vice versa. This avoids accidentally double-ordering the same boards.

**Camera compatibility matters.** Camera V1.2 has an OV3640 sensor; V1.4 has an SC101IOT. Although both use the left H2 expansion connector, the legacy application has not been validated with both revisions. The current official kit includes SC101IOT per the vendor FAQ; independently verify the exact delivered PCB and the firmware driver. Do not substitute an ESP32-S3 camera board.

Sources: [official mainboard V1.2](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s31/esp-mosaico/user_guide.html), [camera variants and pinout](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s31/esp-mosaico/user_guide_camera.html), [interaction module](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s31/esp-mosaico/user_guide_interact.html), and [manufacturer FAQ](https://mosaico.ai/en/faq).

## Project media, permissions and independent demo

The original repository includes cropped device images `docs/assets/controls.jpg` and `docs/assets/grade.jpg`, a generated cover, and a sample question-selection screenshot. The original README and release audit explicitly say the **raw video footage is not published**. Do not assume the creator's X post or device media can be copied into a commercial MAKHEX site without separate permission.

MAKHEX's `/demo/build11-en-concept.mp4` and accompanying three JPEG stills are **independently designed illustrative screens**, with English captions and source in `scripts/render-build11-video.py`. They are not captures of the source project's firmware, nor actual hardware acceptance evidence. Keep original creator credit and references in this GitHub file rather than the customer-facing gallery.

## Original software compatibility

The original v1.0.0 release is **only** documented for legacy ESP-Mosaico Recovery **ABI 1 / layout 4**, on a compatible 16 MiB ESP32-S31 unit. It **does not work** with Vibe Mode 0.2 / Recovery ABI 2. Never force-flash, erase, change a package schema or downgrade a modern unit.

Read the author's [compatibility instructions](https://github.com/samyeei/mosaico-learning-assistant/blob/main/firmware/INSTALL_CN.md) before attempting anything on an independently owned, licensed and compatible legacy test board.

## Original-use walkthrough translated to English

The following describes the creator's existing workflow; it does **not** grant rights to bundle firmware or promise English localization.

1. Confirm a compatible already-installed learning-assistant device and secure 2.4 GHz Wi-Fi.
2. Set up your own [Alibaba Cloud Model Studio / Bailian API key](https://help.aliyun.com/zh/model-studio/get-api-key/), with the correct region (original firmware supports Beijing or Singapore). Check U.S. reachability and model fees. **Never** paste a key into an issue, shop order or forum.
3. In the device settings, choose the phone configuration flow, then join the open **Learn-Setup-XXXX** access point. In your phone browser visit `http://192.168.4.1`; this hotspot is not your home router and does not provide internet access.
4. Select home Wi-Fi, enter its password and the **Model Studio API key**, choose the same Beijing or Singapore region as your key, select **Test Wi-Fi and Token**, and only save after successful testing.
5. From the main screen, select the photo-question mode. Review the live camera view, enable illumination if required, photograph a sample question, and choose **Recognize Questions**.
6. Review the recognized list (three questions per page); select one question to request an explanation. Return to the same image and select another question without retaking a photo.
7. In voice mode, tap the microphone or hold the AI button; release/end recording and inspect the recognized transcript. Select **Confirm Send** to submit the question. Follow-ups can reference the currently selected problem.
8. Review the paginated answer; start or stop speech playback manually, adjust volume and brightness, and set the explanation level. The original settings run from China’s grade 1 through high-school year 3; a U.S. grade mapping is a future design requirement.

The original uses cloud services: **qwen3-vl-plus**, **qwen3-asr-flash**, and **qwen3-tts-flash**. Images, audio and prompts travel to the configured cloud service. Avoid names, faces and identifying information on student worksheets. Accuracy, privacy and U.S.-language behavior require validation; AI explanations can be wrong.

## Software development and agent tasks

- Compare the current hardware’s recovery ABI and tooling against the original repository before building or testing. Never claim a modern board can run old images without evidence.
- Research clean-room or separately authorized *commercial* English firmware options; preserve third-party notices and avoid importing original code/assets under a prohibited license.
- Build an English-first interface, grade 1–12 explanation levels, keyboard-free credentials onboarding, explicit capture consent and secure token handling. Test failures, low-connectivity scenarios, sound output and classroom content.
- Keep hardware pricing and AliExpress options in MAKHEX's private supplier/Doroppu qualification ledger, never in public links. Require exact variant, shipping to ZIP 11021, payable supplier checkout, domestic tax/returns information and end-to-end Squarespace test evidence. Owner's retail formula is supplier cost × 2.5 with free U.S. shipping; do not display guessed prices.
- Submit revisions with bench logs, original sources, part revisions and evidence to the MAKHEX PR + project forum. Human and AI contributors can post moderated notes.

## Publishing and sourcing

No listed price, promised delivery, stock, affiliate link or Add to Cart until the exact kit is validated. Official ESP-Mosaico product information is a **hardware reference**, not a verified AliExpress supplier: https://www.mosaico.ai/en/product/esp-mosaico-vision-combo-kit/

Maker project by **samyeei**. MAKHEX is independent and not affiliated with the original software developer or ESP-Mosaico platform vendor.
