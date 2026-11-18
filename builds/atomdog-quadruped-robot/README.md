# MAKHEX Build 14 — AtomDog browser-controlled ESP32 quadruped

**Original author:** se kino / kinosei
**Original Hackster project:** https://www.hackster.io/kinosei/atomdog-open-source-quadruped-robot-with-m5atommotion-aa540d
**Published MAKHEX route (live November 17, 2026):** https://makhex.com/projects/atomdog-quadruped-robot/
**Original project listing license:** MIT. Verify that the license explicitly covers each specific media, firmware and 3MF asset before redistributing it; MAKHEX does not mirror upstream firmware or print archive in this import.

## Objective and demonstrable use cases

AtomDog is a real external maker project combining a M5Stack ESP32 ATOM Lite, a 4-channel ATOMIC Motion Base, four small metal-gear positional servos and seven printed parts. The creator's local browser dashboard can center/calibrate the legs, save settings, and demonstrate standing, sitting and gait movement. It is useful to teach introductory leg kinematics, Wi-Fi interfaces, PWM servo calibration, 3D-print tolerances and real-time firmware debugging.

**Status:** source-researched MAKHEX project guide and first-party *unpriced order-request* component catalog. MAKHEX has not built or tested the original design, has not verified that the new Motion Base v1.2 fits, and has obtained live supplier inventory indicators and ZIP-11021 anonymous-cart shipping estimates but has not verified authenticated AliExpress fulfillment or actual physical compatibility. No credit card payment should be taken for these unqualified parts.

## Original BOM mapped to MAKHEX

| Original requirement | Slug | Quantity | Critical selection and review |
| --- | --- | ---: | --- |
| M5Stack ATOM Lite C008 ESP32 | `m5stack-atom-lite` | 1 | Actual ATOM Lite, not ATOMS3; USB-C data flashing |
| ATOMIC Motion Base (original v1.1) | `m5stack-atomic-motion-v12` | 1 | A090-V12 replacement *candidate*: original v1.1 now EOL; bench check fit, I2C, controller and per-channel current before selling |
| FEETECH FS90MG 180-degree metal-gear PWM micro servo | `feetech-fs90mg` | 4 | Exactly FS90MG; not FS90R continuous or generic MG90S; RobotDoo supplier package includes horns/screws; verify connector, current and travel |
| USB-A to USB-C 1m data cable | usb-a-c-data-cable-1m | 1 | True USB data cable for ATOM Lite flashing; use C-to-C alternative for a USB-C-only host |
| 1.75mm PLA filament 1kg retail spool | pla-filament-175-1kg | 1 spool | Purchase unit for the original 7-piece 3MF; actual consumption is less than 1 kg |

**3D-print source:** original Hackster attachment `AtomDog_3mf.zip`, seven printable components (body, head, tail and four legs). Download from source page, do not treat STL/3MF as commerce physical parts. The USB data cable and PLA retail spool are now listed in MAKHEX BOM. Additional workshop equipment: 3D printer, hand tools, and 2.4 GHz Wi-Fi. The official A090-V12 includes its 18350 cell; RobotDoo FS90MG pack includes horns and screws. Verify each package and do not bill twice. The manufacturer lists a rechargeable/protected 18350 cell with A090-V12; do not double-charge it by default.

### Why v1.2 is a conditional replacement

Original Hackster documentation calls out Motion Base **v1.1**. M5Stack marks that hardware end-of-life. Its replacement is **ATOMIC Motion Base v1.2 A090-V12** with power monitor; source firmware mentions v1.2 compatibility, but that is not evidence of mechanical assembly, wiring or loaded operation in the original shell.

M5Stack documents a **0.4 A peak servo-channel** rating. A digital FS90MG listing reports up to **0.8 A stall at 6 V**, which exceeds the base's **0.4 A peak servo-channel rating**. Analog FS90MG variants with 120-degree travel are also in circulation. Select the author-matched 180-degree variant, and independently measure current, expected synchronized movement, and physical protection before offering an assembled kit; add protective movement limits. Do not force locked servos or rely on an unprotected loose Li-ion cell.

## Assembly sequence

1. Visit the **original Hackster source** and obtain `main.cpp`, `platformio.ini`, `wifi_config.h` and `AtomDog_3mf.zip`. Confirm links and individual license terms. The zip has not been mirrored or checksum-validated by MAKHEX.
2. Open the 3MF in a slicer, verify units and shell/servo mounting dimensions, and print each of the seven parts in PLA. Do a single-piece fit test before printing everything.
3. Confirm original ATOM Lite board, four exact FS90MG servos, horns and connectors; validate the Motion Base revision. With battery disconnected, assemble and route wiring.
4. Wire the servo sockets according to source orientation: **S1 right rear, S2 right front, S3 left rear, S4 left front**. Check actual housing orientation and rail polarity.
5. Set up PlatformIO with `m5stack-atom`, Arduino and the source-matched versions of `M5Unified`, `M5Atomic-Motion`, and `links2004/WebSockets`. Keep personal `wifi_config.h` private.
6. Flash over a real USB-C **data** cable. Read the serial log for the address and connect to the local web UI. Try `dogrobot.local` only where mDNS works.
7. With legs unloaded, individually center S1–S4 and verify rotation/direction; attach horns/legs only after finding neutral. Save servo trims to flash.
8. Mount head/tail, confirm wiring does not bind. Try sit/stand at minimum safe acceleration, then cautiously test walk/turn/gait. Check heat and current at every stage.
9. Record firmware/toolchain version, power readings, servo model and real device video for a reproducible MAKHEX kit later. Do not call a source demo a MAKHEX test.

## Original documentation and references

- Creator project, source attachments and videos: https://www.hackster.io/kinosei/atomdog-open-source-quadruped-robot-with-m5atommotion-aa540d
- M5Stack ATOM Lite C008: https://docs.m5stack.com/en/core/Atom-Lite
- Official ATOMIC Motion v1.2: https://shop.m5stack.com/products/atomic-motion-base-v1-2-with-power-monitor
- Original ATOMIC Motion v1.1: https://shop.m5stack.com/products/atomic-motion-base-v1-1
- FS90MG manufacturer PDF: https://www.feetechrc.com/Data/feetechrc/upload/file/20200612/6372758119731571407558713.pdf

### AI agent tasks / release gates

- Confirm and record exact, current genuine supplier variants and actual U.S. ZIP delivery charges (11021 test), with date and unit quantity; store private supplier IDs in Doroppu, not public product pages.
- Assemble one actual A090-V12 + ATOM Lite + FS90MG x4 pilot to verify 3MF fit, web UI, servo center/gait and power margins. If mechanical/firmware mismatch, source an authenticated original v1.1 stock unit or obtain redesign approval, never silently substitute.
- Test a controllable MAKHEX first-party *order request* for all six electronic units; no Squarespace card charge, test purchase or AliExpress automatic placement until verified exact stock, payment/return and shipment flows.
- Re-check media/CAD redistribution rights before mirroring anything; project description has editorial original prose, and the hero is a MAKHEX *illustration*, not a creator photograph.
- GitHub review and Cloudflare production deployment are separate gates. Do not deploy without explicit approval.

**Credits:** Original design, guide and demo by se kino (kinosei). MAKHEX independently created this annotated reproduction/sourcing guide.
