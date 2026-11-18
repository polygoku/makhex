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
{
  "slug": "benewake-nova20-lidar",
  "title": "Benewake NOVA20 20-Channel LiDAR",
  "descriptor": "Short-range 40-degree solid-state distance fan",
  "category": "Sensors",
  "visual": "sensor",
  "chip": "NOVA20",
  "status": "Research",
  "description": "Exact Benewake NOVA20 sensor used for multi-channel near-field object ranging in the ESP32 LiDAR experiment. Source availability is still under review.",
  "specs": [
    "20 distance channels in up-to-40-degree field of view",
    "10 Hz nominal output; 921600 baud UART default",
    "5 V +/-5% supply; less than 850 mA startup peak",
    "1.25 mm 5-position electrical connector"
  ],
  "notes": "Do not substitute TF-NOVA, TFmini or VL53 devices. Verify voltage logic, exact harness mating, manufacturer revision, U.S. delivery, returns and genuine sensor ID before order acceptance."
},
{
  "slug": "esp32-wroom32-devkit",
  "title": "ESP32-WROOM-32 Development Board",
  "descriptor": "Wi-Fi microcontroller for high-baud-rate UART",
  "category": "Boards",
  "visual": "chip",
  "chip": "ESP32",
  "status": "Research",
  "description": "Classic ESP32 controller candidate for reading LiDAR UART frames, driving an I2C OLED and serving a local Wi-Fi dashboard.",
  "specs": [
    "ESP32-WROOM-32 class SoC",
    "Hardware UART port; GPIO16 RX candidate varies by board",
    "2.4 GHz Wi-Fi and 3.3 V GPIO"
  ],
  "notes": "Dev boards have different USB bridges, power input, PSRAM, pins and mounting holes. Confirm UART wiring and pin allocation against purchased board and test 921600 baud reception."
},
{
  "slug": "ssd1306-oled-096",
  "title": "0.96-inch SSD1306 OLED Display",
  "descriptor": "128x64 local LiDAR status screen",
  "category": "Displays",
  "visual": "screen",
  "chip": "SSD1306",
  "status": "Research",
  "description": "Monochrome 128x64 OLED display candidate for status, last-seen readings and Wi-Fi address. Maker wiring assumes I2C-capable 0.96-inch variant.",
  "specs": [
    "128x64 monochrome pixels",
    "I2C SSD1306 controller or proven firmware-compatible chip",
    "Verify 0x3C/0x3D address and voltage"
  ],
  "notes": "Adafruit Product 326 is an I2C-capable reference; generic lookalikes can use SH1106 or different I2C wiring. Confirm physical connector/headers and firmware driver."
},
{
  "slug": "nova20-5pin-harness",
  "title": "NOVA20 5-Pin Sensor Harness",
  "descriptor": "Mating 1.25 mm 5-position cable for NOVA20",
  "category": "Controls",
  "visual": "adapter",
  "chip": "1.25 / 5P",
  "status": "Research",
  "description": "A verified NOVA20-compatible cable assembly for 5 V, common ground and UART breakout. An off-the-shelf JST-style plug is not automatically compatible.",
  "specs": [
    "1.25 mm nominal connector pitch",
    "5 positions; keying/orientation must match NOVA20",
    "Correct pin-1, contact crimp and strain relief required"
  ],
  "notes": "Manufacturer documentation specifies connector pitch only. Pin function and exact mating connector family must be validated before selecting, crimping or charging for a harness."
},
{
  "slug": "regulated-5v-2a-proto-kit",
  "title": "Regulated 5 V / 2 A LiDAR Bench Supply Kit",
  "descriptor": "Power adapter and breakout for NOVA20 test bench",
  "category": "Power",
  "visual": "power",
  "chip": "5V / 2A",
  "status": "Research",
  "description": "Proposed regulated 5 V power adapter and safe terminal breakout, with low-voltage interconnection for the LiDAR prototype. Contents require supplier qualification.",
  "specs": [
    "5 V nominal regulated DC output",
    "At least 2 A adapter rating; LiDAR startup peak under 850 mA",
    "Correct DC polarity and mating barrel/terminal connector needed"
  ],
  "notes": "Adafruit Product 276 is a UL-listed reference 5 V/2 A adapter with 5.5x2.1 mm positive-tip barrel; the MAKHEX bundle, terminal converter, jumper wiring, cable length and shipping are not validated. Never connect AC wiring directly."
},
{
  "slug": "vl53l5cx-tof-8x8",
  "title": "VL53L5CX Multi-Zone ToF Sensor 8x8",
  "descriptor": "64-zone I2C substitute for NOVA20 range visualization",
  "category": "Sensors",
  "visual": "sensor",
  "chip": "VL53L5CX",
  "status": "Research",
  "description": "Alternative to the scarce NOVA20: a VL53L5CX 64-zone I2C ranging breakout. Preferred manufacturer carrier Pololu 3417 integrates a 3.3 V regulator and I2C level translation; purchase exact carrier variant, not bare BGA chip.",
  "specs": [
    "8 x 8 zones (64); 65 degree diagonal field, up to 4 m typical max",
    "I2C interface, different from NOVA20 921600-baud UART",
    "Pololu 3417 uses VIN 2.5-5.5 V, 3.3 V logic when driven at 3.3 V VIN",
    "Requires separate VL53L5CX driver/library and firmware"
  ],
  "notes": "Not a drop-in NOVA20 substitute. Match actual carrier revision and package, VIN, SDA/SCL pullups, header soldering, I2C load and supply. ESP32 should use 3.3 V logic: power Pololu 3417 VIN at 3.3 V for correct I2C level. Do not present 64-zone grid as a rotating 360-degree scan."
},
{
  "slug": "nova20-capacitor-kit",
  "title": "NOVA20 Prototype Capacitor Set (2+4)",
  "descriptor": "10uF 25-50 V electrolytics and 100nF ceramic bypass parts",
  "category": "Controls",
  "visual": "adapter",
  "chip": "2+4 CAPS",
  "status": "Research",
  "description": "A procurement bundle for all the passives explicitly specified by the independent ESP32/NOVA20 tutorial: two polarized 10uF electrolytic capacitors and four 0.1uF ceramic capacitors.",
  "specs": [
    "2 x 10uF radial electrolytic 25 V or higher, polarity marked",
    "4 x 0.1uF (100nF), 50 V ceramic capacitors, breadboard lead pitch",
    "Original tutorial quantities included; full schematic placement still to verify"
  ],
  "notes": "Bundle contents require separate seller items; do not select only one value. Never reverse electrolytic polarity. 100nF Adafruit 753 currently out of stock; source from another in-stock seller before confirming the kit. These passives are required in the source BOM, though a validated integrated breakout may already include local decoupling."
},
{
  "slug": "dupont-jumper-20cm-kit",
  "title": "Dupont 0.1-inch Jumper Lead Set",
  "descriptor": "At least 4 test leads; includes male/female compatibility",
  "category": "Controls",
  "visual": "adapter",
  "chip": "JUMPERS",
  "status": "Research",
  "description": "A maker hookup wire kit with at least four usable Dupont 2.54 mm jumper leads for connecting the ESP32, display and breakout terminals.",
  "specs": [
    "At least 4 individual insulated low-voltage leads",
    "Male-to-female leads for 0.1-inch headers; additional types may be needed",
    "15-20 cm typical cable length (SparkFun PRT-12794: 6 inches, 20-pack)"
  ],
  "notes": "The source tutorial specifies four jumper wires. This kit is distinct from the LiDAR's 1.25 mm 5-pin mated harness. Verify physical header type, wire gauge, breadboard needs, strain relief and polarity before shipping."
}
];
