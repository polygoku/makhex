export type Category='Boards'|'Displays'|'Sensors'|'Audio'|'Lighting'|'Power'|'Controls'|'Mechanical';
export type Visual='chip'|'screen'|'sensor'|'audio'|'light'|'power'|'speaker'|'button'|'adapter';
export interface Product{slug:string;title:string;descriptor:string;category:Category;visual:Visual;chip:string;status:string;description:string;specs:string[];notes:string;featured?:boolean;storePath?:string;}
export const products:Product[]=[
{slug:'esp32-s3-devkit',title:'ESP32-S3 Dev Board',descriptor:'A flexible base for connected builds',category:'Boards',visual:'chip',chip:'ESP32-S3',status:'Research',featured:true,description:'A capable starting point for USB, Wi-Fi, Bluetooth LE, display and audio prototyping.',specs:['Wi-Fi + Bluetooth Low Energy','Microcontroller development board','USB and exposed GPIO'],notes:'Pinout, PSRAM, flash, USB ports and voltage regulators vary by exact board. Verify the seller schematic before wiring.'},
{slug:'esp32-c3-supermini',title:'ESP32-C3 SuperMini',descriptor:'Tiny board, big prototyping potential',category:'Boards',visual:'chip',chip:'ESP32-C3',status:'Research',featured:true,description:'Compact Wi-Fi and BLE controller for buttons, sensors and small connected projects.',specs:['2.4 GHz Wi-Fi + BLE','Compact form factor','3.3 V logic'],notes:'Board pin maps and onboard components differ by seller. Confirm safe power input and revision.'},
{slug:'esp32-c6-devkit',title:'ESP32-C6 Dev Board',descriptor:'Experiments with modern wireless stacks',category:'Boards',visual:'chip',chip:'ESP32-C6',status:'Research',description:'An exploratory platform for connected sensing and newer smart-device radio stacks.',specs:['Wi-Fi 6 on 2.4 GHz','Bluetooth LE','IEEE 802.15.4-capable family'],notes:'Matter/Thread/Zigbee availability depends on board, SDK and firmware.'},
{slug:'esp32-s3-touch-35',title:'ESP32-S3 3.5″ Touch Display',descriptor:'Your UI, built into the hardware',category:'Displays',visual:'screen',chip:'TOUCH / 3.5',status:'Research',featured:true,description:'An integrated display candidate for dashboards, clocks and touch interfaces.',specs:['ESP32-S3 class processor','Color touch interface','LVGL-compatible applications'],notes:'Panel controller, resolution, touch controller, GPIO and power behavior vary by exact vendor SKU.'},
{slug:'esp32-s3-camera',title:'ESP32-S3 Camera Board',descriptor:'Vision at the edge',category:'Boards',visual:'chip',chip:'S3 / CAM',status:'Research',description:'Camera-capable hardware for experimental visual triggers and local event logging.',specs:['Camera sensor interface','Wi-Fi network connectivity','Optional PSRAM by revision'],notes:'Camera sensor support and PSRAM must be confirmed for the chosen board.'},
{slug:'i2s-mems-mic',title:'I²S MEMS Microphone',descriptor:'Bring sound into your prototype',category:'Audio',visual:'audio',chip:'I2S / IN',status:'Research',description:'Digital audio input breakout for acoustic sensing and microphone experiments.',specs:['Digital I²S output','Typically 3.3 V logic','Mono microphone output'],notes:'Check exact module supply, channel select and pin names; I²S timing may differ.'},
{slug:'i2s-amplifier',title:'I²S Speaker Amplifier',descriptor:'Give a voice to your device',category:'Audio',visual:'audio',chip:'I2S / OUT',status:'Research',description:'Digital audio output stage for notifications and voice response prototypes.',specs:['Digital audio input','Speaker output','External speaker required'],notes:'Do not drive a speaker directly from GPIO. Match impedance and supply to the specific amplifier.'},
{slug:'bme280-sensor',title:'BME280 Environment Sensor',descriptor:'Temperature, humidity, pressure',category:'Sensors',visual:'sensor',chip:'BME280',status:'Research',featured:true,description:'Room environment sensing for weather displays and telemetry experiments.',specs:['Temperature','Relative humidity','Barometric pressure'],notes:'Confirm BME280 versus BMP280 lookalikes, logic-level voltage and I²C address. Not a CO₂ or PM sensor.'},
{slug:'sgp40-voc',title:'SGP40 VOC Sensor',descriptor:'Explore indoor VOC trends',category:'Sensors',visual:'sensor',chip:'SGP40',status:'Research',description:'An experimental VOC trend sensor with environmental compensation.',specs:['VOC sensing signal','I²C interface','Humidity compensation recommended'],notes:'Not a certified air-quality safety device; output is not a direct measurement of CO₂ or particulate matter.'},
{slug:'epaper-29',title:'2.9″ E-Paper Display',descriptor:'A calm, low-power output',category:'Displays',visual:'screen',chip:'E-PAPER',status:'Research',description:'A paperlike screen suitable for calendars and low-refresh status displays.',specs:['Monochrome modules common','Low-power image retention','Refresh varies by revision'],notes:'Controller, partial-refresh capability, voltage and pinout depend on exact SKU.'},
{slug:'ws2812-leds',title:'Addressable RGB LEDs',descriptor:'Pixels for physical interfaces',category:'Lighting',visual:'light',chip:'RGB / DATA',status:'Research',description:'Individually addressable pixels for status indication and animations.',specs:['Digital pixel control','Separate supply may be necessary','Logic level shifting can be required'],notes:'Calculate worst-case power, use common ground, and do not drive long strips from ESP32 GPIO.'},
{slug:'usb-c-power-kit',title:'USB-C Prototyping Kit',descriptor:'Start with repeatable bench power',category:'Power',visual:'power',chip:'USB / 5V',status:'Research',description:'A proposed low-voltage power and breadboarding starter bundle.',specs:['USB bench power','Breadboard and jumpers','Low-voltage wiring accessories'],notes:'Final supplier contents are unverified. Do not connect unprotected Li-ion cells to charging or power circuits.'},
{slug:'esp-mosaico-vision-combo-kit',title:'ESP-Mosaico Vision Combo Kit',descriptor:'ESP32-S31 touchscreen, camera and interaction module',category:'Boards',visual:'screen',chip:'ESP32-S31',status:'Research',description:'The dedicated ESP-Mosaico hardware candidate for the photo-and-voice learning assistant. The official kit contains the Core Unit V1.2, a camera expansion module, and a multi-function interaction module; the microphone, speaker and 480 × 480 touchscreen are onboard.',specs:['ESP32-S31 Core Unit V1.2 with 2.16-inch 480 × 480 touch display','Camera Module for LEFT H2 expansion slot','Interaction Module included in the Vision Combo Kit','Onboard microphone, speaker and built-in battery','Pre-order or supplier listing does not establish U.S. shipping or readiness'],notes:'Research only; no verified MAKHEX SKU, free-shipping landed cost, U.S. orderability or working firmware. Generic ESP32-S3 camera boards are not substitutes. The original learning-assistant application is noncommercial and cannot be bundled or preinstalled without separate permission. Firmware compatibility and English support are unverified.'},
{slug:'speaker-4ohm-3w',title:'Mini 4 Ω / 3 W Speaker',descriptor:'External audio driver load for voice experiments',category:'Audio',visual:'speaker',chip:'4 OHM',status:'Research',description:'Compact full-range miniature speaker candidate for the I²S amplifier in an ESP32 voice prototype.',specs:['Nominal 4 Ω impedance','3 W nominal rating; verify test conditions','Check measured dimensions and leads'],notes:'Research only. Match impedance and rated output to exact MAX98357A board and supply. No enclosure, audio performance or supplier option has been qualified.'},
{slug:'momentary-tactile-switch',title:'6 mm Momentary Pushbutton',descriptor:'Physical control for smart desk projects',category:'Controls',visual:'button',chip:'PUSH',status:'Research',description:'Normally-open momentary tactile switch candidate for debounced microcontroller inputs.',specs:['6 × 6 mm common footprint','4-pin DIP variants available','Normally open; confirm selected height and pin geometry'],notes:'Research only. Select exact 4-pin through-hole variant, check mounting clearance and connect with proper internal pull-up or pull-down; avoid boot-strap pin conflicts.'},
{slug:'5v-5a-led-power',title:'5 V / 5 A LED Power Adapter (U.S. Plug)',descriptor:'Rated power for a 64-pixel RGB array',category:'Power',visual:'adapter',chip:'5V / 5A',status:'Research',description:'External, regulated 5 V, 5 A AC/DC power adapter candidate for a 64-pixel RGB matrix, subject to U.S. safety certification and wiring checks.',specs:['5 V DC nominal output; 5 A rating','U.S. plug option required','5.5 × 2.1 mm barrel connector candidate'],notes:'Research only. Confirm an actual NRTL certification (UL/ETL), matching adapter SKU, polarity, power feed, inline fuse, terminal conversion and voltage under load. Mains-powered products may not be sold before safety verification.'}
,
{"slug": "feetech-hd1910", "title": "Feetech HD-1910-C001 Serial Bus Servo", "descriptor": "15 actuators for the walking platform", "category": "Controls", "visual": "chip", "chip": "HD1910", "status": "Research", "description": "15 actuators for the walking platform. Exact-source hardware candidate for the independent Microduck build.", "specs": ["Exact model HD-1910-C001", "Feetech serial bus", "AMP2.0 wiring variant"], "notes": "Do not substitute a generic PWM servo or adjacent Feetech model. Confirm output shaft, dimensions, firmware bus and matching AMP2.0 harness."},
{"slug": "radxa-zero-3w", "title": "Radxa ZERO 3W, 2GB (no eMMC)", "descriptor": "Microduck main Linux controller", "category": "Boards", "visual": "chip", "chip": "RADXA ZERO", "status": "Research", "description": "Microduck main Linux controller. Exact-source hardware candidate for the independent Microduck build.", "specs": ["2GB RAM variant", "No eMMC", "Installed header option"], "notes": "Not an ESP32: verify the board boots the Microduck-supported operating system and firmware. Confirm header, SD storage and supply."},
{"slug": "microduck-hat", "title": "Microduck HAT Custom Controller PCB", "descriptor": "Board carrying power, audio and servo bus", "category": "Boards", "visual": "chip", "chip": "HAT AMP2.0", "status": "Research", "description": "Board carrying power, audio and servo bus. Exact-source hardware candidate for the independent Microduck build.", "specs": ["Original EasyEDA Pro source", "October 15 AMP2.0 variant", "Matching audio connectors HP1.25"], "notes": "Research design, not a manufactured or independently qualified PCB. Do not mix EH2.5 with AMP2.0 harnesses; match supply, PCB BOM and connector pitch."},
{"slug": "microduck-imu", "title": "Microduck STM32 IMU Controller PCB", "descriptor": "Custom orientation/servo bus interface", "category": "Boards", "visual": "chip", "chip": "STM32 IMU", "status": "Research", "description": "Custom orientation/servo bus interface. Exact-source hardware candidate for the independent Microduck build.", "specs": ["STM32G031F8P6 and LSM6DSV16XTR design", "October 15 AMP2.0 connector version", "SWD firmware flashing required"], "notes": "Soldered bare PCB does not work until correct FT6 firmware is flashed. Validate board pinout and revision before power-up."},
{"slug": "imx219-160-camera", "title": "IMX219 160° Camera Module", "descriptor": "Microduck wide-angle vision sensor", "category": "Sensors", "visual": "sensor", "chip": "IMX219", "status": "Research", "description": "Microduck wide-angle vision sensor. Exact-source hardware candidate for the independent Microduck build.", "specs": ["IMX219 sensor", "160 degree lens variant", "Exact flex-cable and camera-interface alignment required"], "notes": "Generic OV-series cameras or incompatible flex cables are not interchangeable. Verify Radxa ZERO 3W supported CSI camera wiring."},
{"slug": "vl53l5cx-v2", "title": "VL53L5CX V2 8×8 ToF Sensor", "descriptor": "Depth/proximity sensing", "category": "Sensors", "visual": "sensor", "chip": "VL53L5CX", "status": "Research", "description": "Depth/proximity sensing. Exact-source hardware candidate for the independent Microduck build.", "specs": ["8x8 zones", "V2 breakout with cover", "Verify supply and I2C address"], "notes": "Match the source guide's specific VL53L5CX/VL53L5X V2 module; similar ToF products may use a different board and footprint."},
{"slug": "npf550-power-kit", "title": "NP-F550 Battery & Dual Charger Kit", "descriptor": "Swappable robot battery power", "category": "Power", "visual": "power", "chip": "NP-F550", "status": "Research", "description": "Swappable robot battery power. Exact-source hardware candidate for the independent Microduck build.", "specs": ["Two NP-F550 compatible batteries", "Original 2200mAh reference", "Matching dual charger"], "notes": "Lithium-ion safety: verify authentic protection, voltage, polarity, enclosure fit and charger certifications. Do not wire bare cells directly."},
{"slug": "bearing-6700", "title": "6700 Open Thin-Wall Bearing", "descriptor": "10×15×3 mm rotary bearings", "category": "Mechanical", "visual": "sensor", "chip": "6700", "status": "Research", "description": "10×15×3 mm rotary bearings. Exact-source hardware candidate for the independent Microduck build.", "specs": ["10 mm ID x 15 mm OD x 3 mm", "Open thin-wall design", "Five units in the author's reference purchase"], "notes": "Confirm actual installed quantity and clearances; procurement numbers can include spare units."},
{"slug": "bearing-et2216", "title": "ET2216 Thin-Wall Bearing", "descriptor": "16×22×4 mm rotary bearings", "category": "Mechanical", "visual": "sensor", "chip": "ET2216", "status": "Research", "description": "16×22×4 mm rotary bearings. Exact-source hardware candidate for the independent Microduck build.", "specs": ["16 mm ID x 22 mm OD x 4 mm", "Twelve units in the author's reference purchase"], "notes": "Exact OD, bore, width and shaft-fit are critical. Stock and orderability are unverified."},
{"slug": "bearing-623zz", "title": "623ZZ Roller Bearings (optional)", "descriptor": "Roller feet: 3×10×4 mm", "category": "Mechanical", "visual": "sensor", "chip": "623ZZ", "status": "Research", "description": "Roller feet: 3×10×4 mm. Exact-source hardware candidate for the independent Microduck build.", "specs": ["3 mm bore x 10 mm OD x 4 mm", "Author purchased eight for optional roller build"], "notes": "Optional only: do not include with standard walking-foot BOM. Roller print files and bearings are a separate configuration."},
{"slug": "microduck-speaker-3525", "title": "Microduck 3525 4 Ohm 3 W Speaker", "descriptor": "3525 cavity with 2-pin HP1.25 plug for robot HAT", "category": "Audio", "visual": "audio", "chip": "3525 4R 3W", "status": "Research", "description": "Microduck-specific 3525 cavity loudspeaker: 4 ohms, 3 watts, with 1.25 mm 2-pin connector for HAT J1. Separate from the 28 mm voice-node speaker.", "specs": ["3525 cavity / 4 ohm / 3 W", "2-pin 1.25 mm audio connector", "HAT J1 SPK_R_P and SPK_R_N; confirm polarity"], "notes": "Select supplier image YZ3525 4Ω 3 W, 2P 1.25 connector. Do not substitute an 8Ω 2 W option; seller shipping and audio polarity need checkout verification."},
{"slug": "microduck-fasteners", "title": "Microduck M2/M2.6 Fastener Set", "descriptor": "Assorted mechanical fasteners and mounting screws", "category": "Mechanical", "visual": "sensor", "chip": "M2 / M2.6", "status": "Research", "description": "Assorted mechanical fasteners and mounting screws. Exact-source hardware candidate for the independent Microduck build.", "specs": ["M2x4, M2x5, M2x6, M2x8, M2x12", "M2.6x8", "Verify actual installed quantities"], "notes": "One pack of each length in the author's historical purchase is not the assembly count. Verify thread type against printed material and pilot holes."},
{"slug": "amp20-servo-cables", "title": "AMP2.0 3-Pin Servo Cable Set", "descriptor": "Matching serial bus servo harnesses", "category": "Controls", "visual": "audio", "chip": "AMP 2.0", "status": "Research", "description": "Matching serial bus servo harnesses. Exact-source hardware candidate for the independent Microduck build.", "specs": ["3-pin AMP2.0", "10 cm and 20 cm variants", "24AWG source specification"], "notes": "Connector pin order, pitch and wire gauge must match the October 15 AMP2.0 HAT/IMU revision; EH2.5 parts are not drop-in."},
{"slug": "microduck-wiring-kit", "title": "Microduck 22AWG Wiring & Heat Shrink", "descriptor": "Robot harness finishing", "category": "Power", "visual": "power", "chip": "22 AWG", "status": "Research", "description": "Robot harness finishing. Exact-source hardware candidate for the independent Microduck build.", "specs": ["22 AWG silicone wire", "3-core and single-core", "Heat shrink assortment"], "notes": "Check wire cross section and current demand, protected joints, strain relief and fuse location."},
{slug:'m5stack-atom-lite',title:'M5Stack ATOM Lite ESP32 (C008)',descriptor:'Original Wi-Fi controller used in AtomDog',category:'Boards',visual:'chip',chip:'ATOM LITE',status:'Research',description:'Compact M5Stack ATOM Lite controller with ESP32-PICO-D4, USB-C programming and Wi-Fi. Source-listed controller for AtomDog; not interchangeable with an ATOMS3 without a board/firmware change.',specs:['M5Stack SKU C008 / ATOM Lite','ESP32-PICO-D4 with 4 MB flash','2.4 GHz Wi-Fi; USB-C data programming','Fits Atom-series compatible base'],notes:'No MAKHEX retail price or verified AliExpress option yet. Confirm C008, mechanical latch, header/pin contact and U.S. delivery before purchase. Never preinstall customer Wi-Fi credentials.'},
{slug:'m5stack-atomic-motion-v12',title:'M5Stack ATOMIC Motion Base v1.2 (A090-V12)',descriptor:'4-channel servo driver and rechargeable base',category:'Controls',visual:'adapter',chip:'A090-V12',status:'Research',description:'Four-servo I2C driver base with 18350 battery and power monitoring. M5Stack now lists v1.2 for sale; AtomDog’s original published hardware list specifies v1.1, which is end-of-life.',specs:['M5Stack A090-V12 candidate replacement; original A090-V11 EOL','4 PWM servo channels; 2 DC motor channels','I2C controller and INA226 power monitor','Manufacturer listing includes protected 18350 900 mAh cell'],notes:'Source firmware mentions v1.2 compatibility, but do not claim mechanically or electrically equivalent until a sourced example passes fit, connector clearance, loaded-current and firmware tests. Check manufacturer 0.4 A per-channel servo limit and total power budget.'},
{slug:'feetech-fs90mg',title:'FEETECH FS90MG 180° Metal-Gear Servo',descriptor:'One exact PWM micro servo for each of four legs',category:'Controls',visual:'button',chip:'FS90MG',status:'Research',description:'Original-project Feetech FS90MG 180-degree PWM micro servo. Four identical servos are specified for AtomDog; do not silently substitute SG90, MG90S, FS90R or 360-degree variants.',specs:['FEETECH model FS90MG, 180° end limit','Metal gears; approx. 22.5 × 12.1 mm body footprint','Standard 3-wire PWM connection','Four units; RobotDoo lists a horn set and mounting screws with each FS90MG, confirm packaging for the selected seller'],notes:'Qualified exact variant and U.S. shipping pending. Verify output spline/horn fit in downloaded 3MF, 4.8–6 V drive compatibility, servo wire pinout, peak/stall current versus the Motion Base 0.4 A per-channel rating; one published digital FS90MG variant reports 0.8 A stall current at 6 V, so require physical current-limiting/standstill validation.'}
,
{slug:'usb-a-c-data-cable-1m',title:'USB-A to USB-C Data Cable 1 m',descriptor:'Data-capable programming and charging lead',category:'Power',visual:'adapter',chip:'USB DATA',status:'Research',description:'Approximately one-meter USB-A to USB-C cable for flashing the ATOM Lite and supported 5V USB power. Not charge-only.',specs:['USB-A male to USB-C male; data wires connected','About 1 m long','Reference Adafruit SKU 4474','For USB-C computer ports, use an approved C-to-C alternative'],notes:'Maker may own a compatible cable already. Shipping and MAKHEX retail quote pending; do not substitute a charge-only lead.'},
{slug:'pla-filament-175-1kg',title:'1.75 mm PLA Filament 1 kg Spool',descriptor:'3D printing feedstock for AtomDog shell',category:'Mechanical',visual:'sensor',chip:'PLA 1.75',status:'Research',description:'One retail spool of 1.75 mm PLA suitable for printing original AtomDog body, head, tail and four leg pieces. One 1kg spool is a retail selling unit; the model does not need a whole kilogram.',specs:['PLA / 1.75mm nominal diameter','One 1kg spool; printer required, not included','Select color after exact source and shipping qualification','Print source model scale and machine profile require validation'],notes:'Do not imply a finished 3D-printed enclosure is shipped. Retail unit is a spool, not printed parts; material consumption unverified.'},
{
  "slug": "rebot-b601-dm-full-kit",
  "title": "Seeed reBot B601-DM Full Arm & Gripper Kit",
  "descriptor": "Unassembled 6-DOF Damiao actuator arm and gripper",
  "category": "Mechanical",
  "visual": "sensor",
  "chip": "DM / FULL",
  "status": "Research",
  "description": "Official reBot B601-DM Full Kit selection with complete arm body and gripper, mechanical structure and associated harnesses. Source DM-v1.1 assembly differs from vendor-production refinements. Power adapter and clamps are not standard inclusions.",
  "specs": [
    "6 axes plus gripper",
    "Damiao actuator family: 4x DM4310(V4) and 3x DM4340P(V4) in source BOM",
    "24 V DC matched supply required, sold separately unless explicit bundle includes it",
    "Source STEP assembly dated 2026-06-25"
  ],
  "notes": "Request exact Full Kit option, current maker revision, count of included motor/harness/fasteners, packing list, 11021 shipping, warranty/returns and landed quote. The official category landing page's lowest displayed price is NOT a verified full-kit selling price."
},
{
  "slug": "rebot-b601-rs-full-kit",
  "title": "Seeed reBot B601-RS Full Arm & Gripper Kit",
  "descriptor": "Unassembled 6-DOF RobStride arm and gripper",
  "category": "Mechanical",
  "visual": "sensor",
  "chip": "RS / FULL",
  "status": "Research",
  "description": "Seeed B601-RS Disassembly Kit, with RobStride motors, matching CNC structure and gripper. Supplier offers assembled and bundle variants; verify selection, whether a power kit is included and what accessories are packed.",
  "specs": [
    "6 axes plus gripper",
    "Source BOM: 4x RobStride RS00 and 3x RS06 actuators",
    "48 V DC matched supply required",
    "Source STEP full assembly dated 2026-06-25"
  ],
  "notes": "Source 'with Power Supply Bundle' product landing may include the adapter. Confirm actual variant to prevent double-counting any power kit. DM motors and 24 V supply are NOT compatible replacements."
},
{
  "slug": "rebot-b601-dm-power-kit",
  "title": "reBot B601-DM 24 V Power Adapter Kit",
  "descriptor": "Official 24 V / 14.6 A adapter assembly",
  "category": "Power",
  "visual": "power",
  "chip": "24V/14.6A",
  "status": "Research",
  "description": "Seeed's official power adapter kit intended for Damiao B601-DM. Prefer a safely enclosed/preassembled and independently certified U.S. power configuration over user-wired exposed mains.",
  "specs": [
    "24 V nominal DC, 14.6 A reference",
    "Approximately 350 W power class",
    "U.S. input voltage and plug type require seller confirmation"
  ],
  "notes": "Do not substitute 48 V RS supply, expose unqualified AC wiring to users or assume UL/ETL/NRTL status without evidence. Include correct connector, protective earth, fusing, discharge behavior, enclosure and accessible isolation/stop control."
},
{
  "slug": "rebot-b601-rs-power-kit",
  "title": "reBot B601-RS 48 V Power Adapter Kit",
  "descriptor": "Official 48 V / 12.5 A adapter assembly",
  "category": "Power",
  "visual": "power",
  "chip": "48V/12.5A",
  "status": "Research",
  "description": "Seeed's official 600 W class power adapter kit for the RobStride B601-RS. May already be included in certain RS bundles; prevent duplicates.",
  "specs": [
    "48 V nominal DC, 12.5 A reference",
    "Approximately 600 W class",
    "Higher peak-performance 48V/25A configuration is separately documented by Seeed"
  ],
  "notes": "Never use this for a 24 V DM arm. Verify U.S. mains safety listing, wiring, strain relief, supply polarity, matching DC/XT interface and operator emergency stop. Avoid bare-AC DIY supply as a novice retail item."
},
{
  "slug": "rebot-b601-dm-can-usb",
  "title": "reBot B601-DM CAN-USB Interface",
  "descriptor": "Damiao CAN motor communication interface",
  "category": "Controls",
  "visual": "chip",
  "chip": "DM / CAN",
  "status": "Research",
  "description": "Source-identified Damiao CAN-to-USB driver board used for programming/motor communications with B601-DM.",
  "specs": [
    "Manufacturer product: DM-CAN-USB Driver Board",
    "CAN physical-layer wiring and termination to verify",
    "Requires compatible host, drivers and motor protocol"
  ],
  "notes": "May be included in some factory kits: check packing list, protocol and driver version before billing or claiming a separate accessory is required."
},
{
  "slug": "rebot-b601-rs-can-usb",
  "title": "reBot B601-RS USB-to-CAN Interface",
  "descriptor": "Host adapter for RobStride CAN bus",
  "category": "Controls",
  "visual": "chip",
  "chip": "RS / CAN",
  "status": "Research",
  "description": "B601-RS source BOM lists a CAN-USB converter with PCAN-like firmware for RobStride actuator control; exact tested dongle SKU and host compatibility require verification.",
  "specs": [
    "CAN USB interface (source BOM reference PCAN-compatible)",
    "Driver, bit rate, cable termination and host OS depend on chosen SDK",
    "Source BOM separately lists XT30 power separation board"
  ],
  "notes": "Do not substitute a Damiao CAN board without a proven RS driver/protocol mapping. Source listing is an example, NOT a verified firmware-compatible or U.S. shipping-qualified adapter."
},
{
  "slug": "rebot-b601-mount-clamps",
  "title": "reBot Arm Desk Clamp Pair",
  "descriptor": "Two 6-inch G-clamps for stable bench mounting",
  "category": "Mechanical",
  "visual": "sensor",
  "chip": "2x CLAMP",
  "status": "Research",
  "description": "Two heavy-duty 6-inch G-clamps for a rigid, suitable workbench mount. The arm can impose significant tipping moments; check table thickness, clamp jaws and load rating.",
  "specs": [
    "2 clamps to secure arm mounting plate",
    "6-inch class as referenced in source BOM",
    "Verify table and arm base geometry"
  ],
  "notes": "Do not operate an unsecured robotic arm. Clamp suitability must be reviewed for installation, with anti-slip support and unobstructed motion envelope."
},
{
  "slug": "rebot-b601-dm-discharge-module",
  "title": "B601-DM Circuit Protection / Discharge Module",
  "descriptor": "Optional Seeed energy discharge and stop module for Damiao arm",
  "category": "Controls",
  "visual": "chip",
  "chip": "DM / STOP",
  "status": "Research",
  "description": "Official optional Seeed module addressing energy/regenerative dissipation and emergency stop interaction with B601-DM.",
  "specs": [
    "Seeed product 6988 for B601-DM only",
    "Matches DM architecture, not RS bleeder by default",
    "Emergency-stop integration requires functional verification"
  ],
  "notes": "Recommended safety/accessory request, not established to be included in standard full arm. Do not rely on this as the only risk reduction; verify safety circuit and hardware under a qualified design."
},
{
  "slug": "rebot-b601-rs-bleeder-module",
  "title": "B601-RS Bleeder / Stop Module",
  "descriptor": "Optional Seeed energy bleed and stop module for RobStride arm",
  "category": "Controls",
  "visual": "chip",
  "chip": "RS / STOP",
  "status": "Research",
  "description": "Official optional Seeed bleeder/circuit protection and emergency stop module designed for B601-RS.",
  "specs": [
    "Seeed product 6987 for RS only",
    "Check 48 V bus and regenerative energy path",
    "Emergency-stop integration is version-dependent"
  ],
  "notes": "Not interchangeable with B601-DM discharge module. Source- and physically verify actual stop behavior, cable connector and enclosure before operating."
},
{
  "slug": "rebot-b601-dm-body-motor-kit",
  "title": "B601-DM Body Motor & Harness Kit",
  "descriptor": "Damiao body actuators and matched cable harnesses (not structure or gripper).",
  "category": "Mechanical",
  "visual": "sensor",
  "chip": "DM / BODY-",
  "status": "Research",
  "description": "Damiao body actuators and matched cable harnesses (not structure or gripper).",
  "specs": [
    "Official component-only Seeed kit; NOT a complete robotic arm",
    "For DM model ONLY",
    "Contents, harness and revision must match current factory option"
  ],
  "notes": "This kit is a separately purchasable repair/custom assembly option. Do not add to a cart already containing the complete full arm kit for this model without removing overlapping components. Current vendor pack list/U.S. shipping not independently confirmed."
},
{
  "slug": "rebot-b601-dm-body-structure-kit",
  "title": "B601-DM Body Structural Kit",
  "descriptor": "Body plates, fasteners and structural components without body motor kit or gripper.",
  "category": "Mechanical",
  "visual": "sensor",
  "chip": "DM / BODY-",
  "status": "Research",
  "description": "Body plates, fasteners and structural components without body motor kit or gripper.",
  "specs": [
    "Official component-only Seeed kit; NOT a complete robotic arm",
    "For DM model ONLY",
    "Contents, harness and revision must match current factory option"
  ],
  "notes": "This kit is a separately purchasable repair/custom assembly option. Do not add to a cart already containing the complete full arm kit for this model without removing overlapping components. Current vendor pack list/U.S. shipping not independently confirmed."
},
{
  "slug": "rebot-b601-dm-gripper-kit",
  "title": "B601-DM Complete Gripper Kit",
  "descriptor": "Damiao gripper actuator, mechanical gripper and its wiring bundle.",
  "category": "Mechanical",
  "visual": "sensor",
  "chip": "DM / GRIPP",
  "status": "Research",
  "description": "Damiao gripper actuator, mechanical gripper and its wiring bundle.",
  "specs": [
    "Official component-only Seeed kit; NOT a complete robotic arm",
    "For DM model ONLY",
    "Contents, harness and revision must match current factory option"
  ],
  "notes": "This kit is a separately purchasable repair/custom assembly option. Do not add to a cart already containing the complete full arm kit for this model without removing overlapping components. Current vendor pack list/U.S. shipping not independently confirmed."
},
{
  "slug": "rebot-b601-rs-body-motor-kit",
  "title": "B601-RS Body Motor & Harness Kit",
  "descriptor": "RobStride body actuators and wiring harnesses, structure excluded.",
  "category": "Mechanical",
  "visual": "sensor",
  "chip": "RS / BODY-",
  "status": "Research",
  "description": "RobStride body actuators and wiring harnesses, structure excluded.",
  "specs": [
    "Official component-only Seeed kit; NOT a complete robotic arm",
    "For RS model ONLY",
    "Contents, harness and revision must match current factory option"
  ],
  "notes": "This kit is a separately purchasable repair/custom assembly option. Do not add to a cart already containing the complete full arm kit for this model without removing overlapping components. Current vendor pack list/U.S. shipping not independently confirmed."
},
{
  "slug": "rebot-b601-rs-body-structure-kit",
  "title": "B601-RS Body Structural Kit",
  "descriptor": "B601-RS specific mechanical structure without actuator kit or gripper.",
  "category": "Mechanical",
  "visual": "sensor",
  "chip": "RS / BODY-",
  "status": "Research",
  "description": "B601-RS specific mechanical structure without actuator kit or gripper.",
  "specs": [
    "Official component-only Seeed kit; NOT a complete robotic arm",
    "For RS model ONLY",
    "Contents, harness and revision must match current factory option"
  ],
  "notes": "This kit is a separately purchasable repair/custom assembly option. Do not add to a cart already containing the complete full arm kit for this model without removing overlapping components. Current vendor pack list/U.S. shipping not independently confirmed."
},
{
  "slug": "rebot-b601-rs-gripper-kit",
  "title": "B601-RS Complete Gripper Kit",
  "descriptor": "RobStride gripper with actuator, gripper mechanics and harness.",
  "category": "Mechanical",
  "visual": "sensor",
  "chip": "RS / GRIPP",
  "status": "Research",
  "description": "RobStride gripper with actuator, gripper mechanics and harness.",
  "specs": [
    "Official component-only Seeed kit; NOT a complete robotic arm",
    "For RS model ONLY",
    "Contents, harness and revision must match current factory option"
  ],
  "notes": "This kit is a separately purchasable repair/custom assembly option. Do not add to a cart already containing the complete full arm kit for this model without removing overlapping components. Current vendor pack list/U.S. shipping not independently confirmed."
},
{
  "slug": "rebot-dm4310-v4",
  "title": "Damiao DM4310(V4) Actuator",
  "descriptor": "Source B601-DM actuator, four used in source BOM",
  "category": "Controls",
  "visual": "chip",
  "chip": "DM4310",
  "status": "Research",
  "description": "Original Seeed B601-DM source bill lists four DM4310(V4) brushless actuator modules.",
  "specs": [
    "4 x DM4310 V4 per original B601-DM source",
    "Controls over CAN / matched SDK",
    "Exact mechanical spline, firmware and electrical revision mandatory"
  ],
  "notes": "Source developer BOM quantities are not necessarily the factory packed set. Do not mix with RS00/RS06 or silently substitute DM4310 V3."
},
{
  "slug": "rebot-dm4340p-v4",
  "title": "Damiao DM4340P(V4) Actuator",
  "descriptor": "Source B601-DM actuator, three used in source BOM",
  "category": "Controls",
  "visual": "chip",
  "chip": "DM4340P",
  "status": "Research",
  "description": "Original Seeed B601-DM source lists three DM4340P(V4) motor modules.",
  "specs": [
    "3 x DM4340P V4 per source",
    "Joint 1 correction is in DM-v1.1 assembly revision",
    "Damiao CAN motor family"
  ],
  "notes": "Do not substitute DM4310 on corrected Joint 1; double-check mounting, motor firmware and cable restraint revision."
},
{
  "slug": "rebot-robstride-rs00",
  "title": "RobStride RS00 Actuator",
  "descriptor": "Source B601-RS actuator, four used in source BOM",
  "category": "Controls",
  "visual": "chip",
  "chip": "RS00",
  "status": "Research",
  "description": "Original Seeed B601-RS source lists four RobStride RS00 brushless modules.",
  "specs": [
    "4 x RobStride RS00 per B601-RS source",
    "CAN-capable integrated actuator",
    "RS hardware family, not Damiao"
  ],
  "notes": "Do not mix motor and 24V Damiao electronics. Check exact RS00 hardware revision and bus ID before sale."
},
{
  "slug": "rebot-robstride-rs06",
  "title": "RobStride RS06 Actuator",
  "descriptor": "Source B601-RS actuator, three used in source BOM",
  "category": "Controls",
  "visual": "chip",
  "chip": "RS06",
  "status": "Research",
  "description": "Original Seeed B601-RS source lists three RobStride RS06 integrated actuator modules.",
  "specs": [
    "3 x RobStride RS06 per source",
    "CAN-capable integrated actuator",
    "48V RS system context"
  ],
  "notes": "Do not silently substitute RS05, RS03 or Damiao; match output torque, mounting, CAN protocol and firmware."
},
{
  "slug": "rebot-b601-dm-hardware-pack",
  "title": "B601-DM Mechanical Fasteners & Bearings Pack",
  "descriptor": "Source-exact custom procurement from 79-row engineering BOM",
  "category": "Mechanical",
  "visual": "sensor",
  "chip": "DM / MISC",
  "status": "Research",
  "description": "Custom-request spares pack containing source-specific shielded bearings, thrust bearing, linear rail, carriage blocks, gear and screw/washer assortment; exact quantities in downloadable DM CSV.",
  "specs": [
    "Source includes 6707ZZ, 6803ZZ x3, AXK5578, MGN9 170mm rail + 2 carriages",
    "M3/M4 specialty fasteners and hardware detailed in DM BOM CSV",
    "Not included as extra in the complete official Full Kit unless packaging verified"
  ],
  "notes": "Custom procurement pack, no verified single vendor, inventory or current price. Must reconcile all fastener sizes, gear bore/teeth and bearing dimensions before approval. May overlap full vendor structure kit."
},
{
  "slug": "rebot-b601-rs-hardware-pack",
  "title": "B601-RS Mechanical Fasteners & Bearings Pack",
  "descriptor": "Source-exact custom procurement from 75-row engineering BOM",
  "category": "Mechanical",
  "visual": "sensor",
  "chip": "RS / MISC",
  "status": "Research",
  "description": "Custom-request mechanical spares with source-specific bearings, thrust bearing, linear rail/carriages, racks/gears and screw assortments from RS BOM CSV.",
  "specs": [
    "Source includes 6803ZZ x3, AXK5578, MGN9 170mm rail + 2 carriages",
    "RS-specific countersunk and hex socket screw inventory",
    "Source RS mechanical features differ from DM and not dimensionally interchangeable"
  ],
  "notes": "No single supplier pack is verified. Verify exact kit itemization and tolerance; do not double-charge when full structure kit already contains fasteners."
}
];
