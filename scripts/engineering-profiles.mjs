// Reviewed engineering reference profiles. These are build fixtures, not hardware-test attestations.
export const profiles={
'touch-weather-station':{
board:'ESP32-S3 3.5-inch capacitive-touch board; exact purchased controller and PCB revision unresolved',
target:'esp32s3',example:'examples/peripherals/lcd/spi_lcd_touch',
driver:'Use ESP-IDF v5.5.6 LCD/touch demonstration only after identifying LCD controller, touch IC, PSRAM and display connector mapping. It is NOT compatible by assumption with the MAKHEX board.',
refs:['https://docs.espressif.com/projects/esp-idf/en/v5.5.6/esp32s3/api-reference/peripherals/lcd/index.html'],
wiring:[
['USB data/power host','touch board USB connector','5 V input only through rated onboard USB connector','Check board silk and power path; never backfeed 5 V into 3V3'],
['touch board regulated 3V3','BME280 VCC','3.3 V logic/supply','Check selected breakout current and its regulator before wiring'],
['touch board GND','BME280 GND','0 V shared reference','Continuity check while unpowered'],
['touch board spare SDA pad (unresolved)','BME280 SDA','I2C; 3.3 V with pullups','Map schematic; do not reuse active LCD/touch GPIO'],
['touch board spare SCL pad (unresolved)','BME280 SCL','I2C; 3.3 V with pullups','Check sensor address 0x76 or 0x77, no bus conflicts'],
['integrated LCD and capacitive touch','board-local LCD/touch IC','PCB internal buses','No guessed display GPIO: read exact vendor PCB revision and panel IC']
],
extras:['No case for the MAKHEX 3.5-inch PCB is qualified; upstream 4-inch case is not plug-compatible.'],
tests:[
['01','Record shipped PCB markings, display/touch controller IDs and schematic revision','Photograph front/back; reconcile accessible GPIO and 3V3 rail','All controller identifiers, pin mappings and voltage limits recorded'],
['02','Detect exact BME280 before enabling dashboard','Read chip ID and calibrated temp/RH/pressure over mapped I2C','Chip ID 0x60 and three valid values; fail instead of substituting BMP280'],
['03','Verify display and touch on a matched driver','Render touch targets and capture serial initialization logs','Every target can be selected without invalid pixels or unregistered presses'],
['04','Run a 30-minute touch and sensor soak','Log timestamp, values, touch count, heap and faults','No lockup, values timestamped, sustained touch response'],
['05','Unplug sensor while powered only if breakout connection is designed for hotplug; otherwise power-cycle with disconnected sensor','Observe UI stale-data behavior and error log','No fabricated reading; explicit disconnected or stale indication']
]},
'voice-command-node':{
board:'ESP32-S3 DevKitC-1 N8R8 candidate with INMP441 microphone + MAX98357A amp + 4-ohm/3-W speaker',
target:'esp32s3',example:'examples/peripherals/i2s/i2s_basic',
driver:'ESP-IDF I2S example is a peripheral smoke test, not an offline speech application. An ESP-SR recognizer/model must be separately pinned, built and benchmarked for the selected PSRAM configuration.',
refs:['https://docs.espressif.com/projects/esp-idf/en/v5.5.6/esp32s3/api-reference/peripherals/i2s.html','https://github.com/espressif/esp-sr/tree/78a923d29a45e4e1433b909d3da12ab5b0f994fc'],
wiring:[
['S3 DevKitC-1 3V3','INMP441 VDD','3.3 V only','Verify module regulator and current'],
['S3 GND','INMP441 GND and MAX98357A GND','0 V common','Continuity before power'],
['S3 GPIO4 (proposed)','INMP441 SCK + MAX98357A BCLK','I2S bit clock 3.3 V','Confirm board header and separate device timing'],
['S3 GPIO5 (proposed)','INMP441 WS + MAX98357A LRC','I2S word select 3.3 V','Confirm shared sample-rate compatibility'],
['INMP441 SD','S3 GPIO6 (proposed)','I2S RX data at 3.3 V','No 5 V on ESP32 inputs'],
['S3 GPIO7 (proposed)','MAX98357A DIN','I2S TX data at 3.3 V','Check correct amplifier pin labels'],
['Regulated 5 V rail (unqualified)','MAX98357A VIN','Amp supply only, if exact board accepts 5 V','Do not power 3 W into 4 ohms until thermal/current check'],
['MAX98357A SPK+ and SPK-','4-ohm speaker terminals','Floating bridge output','Neither SPK terminal goes to ground'],
['S3 GPIO15 (proposed) via normally-open switch','GND','PTT active-low with pullup','Switch absent from original BOM; must be added before physical build'],
['INMP441 L/R channel select','Ground or 3V3 per device datasheet','Select one channel','Never leave selection undefined']
],
extras:['Add normally-open push-to-talk switch, safe microphone-active indicator, and rated amplifier supply/connector if not present in kit.'],
tests:[
['01','Prove microphone stream independently','Capture 10 seconds PCM, inspect nonzero samples and clip count','Valid PCM stream with no continuous clipping'],
['02','Prove amplifier independently at a conservative gain','Play test tone and inspect output waveform/current','Audible output without unexpected DC, overcurrent or overheating'],
['03','Measure combined I2S full duplex','Record and play back using captured buffers','No underrun/overrun in 5-minute test'],
['04','Benchmark exact speech-recognition model','Record model checksum, RAM/PSRAM usage, three fixed test phrases and noise level','Three documented commands detected with logged true/false results'],
['05','Prove privacy timeout and obvious capture indicator','Release PTT and wait timeout; monitor mic sampling state','No silent continued capture; indicator reflects recording']
]},
'tiny-ble-presence':{
board:'ESP32-C3 SuperMini candidate, specific vendor PCB and antenna layout unresolved',
target:'esp32c3',example:'examples/bluetooth/nimble/bleprph',
driver:'Use pinned NimBLE advertising example as an SDK smoke test. Replace any default static identifier with demonstrably non-identifying rotating demo data before public operation.',
refs:['https://docs.espressif.com/projects/esp-idf/en/v5.5.6/esp32c3/api-guides/ble.html'],
wiring:[['Host USB connector','ESP32-C3 SuperMini USB','USB-supplied bench power','Check USB voltage and board regulator'],['On-board 3V3 regulator','ESP32-C3 core','3.3 V logic','Measure under BLE burst load'],['ESP32-C3 antenna region','Clear air space','2.4 GHz RF','No metal enclosure covering antenna without validation']],
extras:['No external sensor is required for the proposed BLE advertisement test; the original Spottr enclosure dimensions and PCB are different.'],
tests:[
['01','Read chip/flash ID and record board revision','Use esptool chip_id and boot log; photograph PCB','Identified ESP32-C3, flash size, firmware checksum'],
['02','Advertise a non-personal service payload','Use a BLE scanner with date/time and RSSI log','Observed service UUID and expected payload within 2 meters'],
['03','Rotate demo identifier without tracking','Capture three intervals and compare payload','Identifier changes at documented interval; no personal/device-owner strings'],
['04','Measure sleep/active supply current','Use current meter with USB meter resolution documented','Measured active/idle current and duty cycle reported'],
['05','Reboot and repeat scan','Power-cycle board twice','Reproducible advertisement startup and no boot-strap failure']
]},
'plant-health-monitor':{
board:'ESP32-C3 SuperMini candidate, BME280 breakout (not BMP280)',
target:'esp32c3',example:'examples/peripherals/i2c/i2c_tools',
driver:'Use pinned I2C tools to confirm actual bus first. Bosch BME280 SensorAPI at c90d419492e26dd95586598a794e65eb2760753a is a driver reference, not a complete Wi-Fi web dashboard.',
refs:['https://github.com/boschsensortec/BME280_SensorAPI/tree/c90d419492e26dd95586598a794e65eb2760753a','https://docs.espressif.com/projects/esp-idf/en/v5.5.6/esp32c3/api-reference/peripherals/i2c.html'],
wiring:[
['ESP32-C3 3V3','BME280 VCC','3.3 V supply','Verify breakout is not BMP280'],
['ESP32-C3 GND','BME280 GND','Shared return','Meter continuity'],
['GPIO4 (proposed)','BME280 SDA','3.3 V I2C SDA','Check vendor SuperMini pinout and pullups'],
['GPIO5 (proposed)','BME280 SCL','3.3 V I2C clock','Check pullup voltage and address 0x76/0x77']
],
extras:['Optional soil moisture probe is NOT included and no watering recommendation may be generated from BME280 alone.'],
tests:[
['01','Read sensor chip identity','Scan I2C and read BME280 ID register 0xD0','Chip returns 0x60; BMP280 is rejected'],
['02','Read calibrated temperature, RH and pressure','Compare with reference thermometer/hygrometer/barometer and serial log','All units and calibration limitations displayed; log actual deviations'],
['03','Publish local dashboard without internet endpoint','Use local Wi-Fi only and check network exposure','Timestamp and all three values present'],
['04','Power-cycle while preserving honest timestamps','Disconnect/reconnect power and inspect UI','No stale value represented as new data'],
['05','Simulate sensor disconnect with system powered off before disconnect','Restart with absent sensor and inspect dashboard','Explicit unavailable state; no watering advice']
]},
'camera-event-trigger':{
board:'ESP32-S3 camera bundle is unqualified; exact image sensor, PSRAM, pin map and voltage unknown',
target:'esp32s3',example:'examples/peripherals/camera/dvp_spi_lcd',
driver:'The IDF DVP example is not a guarantee that the unknown camera board is compatible. Use esp32-camera commit f37e65608f709bd94846dee01d947f02ae07c0b0 only after sensor/pin assignments are identified.',
refs:['https://github.com/espressif/esp32-camera/tree/f37e65608f709bd94846dee01d947f02ae07c0b0'],
wiring:[
['Board USB/data input','ESP32-S3 camera board USB','Manufacturer-rated power only','Never feed camera GPIO from 5 V'],
['Sensor camera ribbon','PCB factory camera FPC connector','DVP signals; pin assignments unresolved','Verify exact ribbon orientation, sensor ID and GPIO mapping from schematic before power'],
['Integrated frame-active status or external GPIO','Visible status indicator','LED output must be mapped','A camera-active indicator is required before private-scene use']
],
extras:['Camera-active status LED and locally controlled deletion must exist; no remote streaming or hidden monitoring.'],
tests:[
['01','Photograph PCB, camera markings and PSRAM part','Record exact hardware IDs and vendor pin map','Sensor, lens, PSRAM and required rails known'],
['02','Capture single color-bar or static test frame','Check frame dimensions, JPEG SOI/EOI and heap','Frame decodes and heap margin is recorded'],
['03','Run repeatable known-scene event trigger','Use fixed lighting and move test card through field','Changes produce timestamped events at documented threshold'],
['04','Record false positives under 10 minutes of stable scene','No movement, stable lighting','False-event count measured and documented'],
['05','Verify obvious active indicator and deletion','Toggle capture state and clear local log','Indicator always matches capture; data deleted locally']
]},
'epaper-desk-calendar':{
board:'ESP32-C3 SuperMini candidate with 2.9-inch SPI e-paper; controller revision unresolved',
target:'esp32c3',example:'examples/peripherals/spi_master/lcd',
driver:'SPI example is a bus smoke test only. GxEPD2 commit de82887e77a78528ea386e68bba2cb0291d2c319 targets an Arduino library; do not mix it into an IDF build without an explicit framework port. Exact EPD driver waveform is vendor-dependent.',
refs:['https://github.com/ZinggJM/GxEPD2/tree/de82887e77a78528ea386e68bba2cb0291d2c319'],
wiring:[
['ESP32-C3 3V3','e-paper VCC','3.3 V if selected breakout is rated','Do not assume bare panel can accept 5 V'],
['ESP32-C3 GND','e-paper GND','Common reference','Unpowered continuity'],
['GPIO7 (proposed)','e-paper DIN / MOSI','SPI data output','Check board header and panel datasheet'],
['GPIO6 (proposed)','e-paper CLK','SPI clock','Use low initial clock until validated'],
['GPIO10 (proposed)','e-paper CS','Active-low select','Check boot pin use against board revision'],
['GPIO3 (proposed)','e-paper DC','Data/command','Logic 3.3 V'],
['GPIO4 (proposed)','e-paper RST','Reset','Respect panel initialization timing'],
['e-paper BUSY','GPIO5 (proposed)','Busy input 3.3 V','Never ignore BUSY completion']
],
extras:['Exact e-paper controller, flex connector and refresh behavior must be identified. Upstream FreeCAD case is not proven to fit the proposed 2.9-inch panel.'],
tests:[
['01','Photograph panel/FPC and read controller part number','Compare with manufacturer waveform/application note','Controller ID and LUT/driver compatibility established'],
['02','Render checkerboard and full-black/white pages','Capture images after full refresh and inspect ghosting','No stuck pixel region or ghosting beyond documented panel limit'],
['03','Set timezone and sync UTC from network','Test near a local day boundary','Correct calendar date and daylight-saving behavior'],
['04','Remove Wi-Fi and restart','Observe NTP offline handling','Time validity clearly indicated rather than made up'],
['05','Measure sleep current and safe refresh cadence','Log current and 20 update cycles','Measurable current, no excessive repeated full refresh']
]},
'indoor-voc-explorer':{
board:'ESP32-S3 DevKitC-1 N8R8 plus SGP40 and BME280 3.3-V I2C breakout modules',
target:'esp32s3',example:'examples/peripherals/i2c/i2c_tools',
driver:'An I2C scan alone cannot generate a valid VOC index. Pin Sensirion SGP40 driver at 25a85e2dc9f7b0f96dbf0989162abb5beeb2bd6e and Gas Index Algorithm at 2ef9f13d225e8a0dedd3ff42dd229af4dbb1aae4; port/build those before presenting quantitative output.',
refs:['https://github.com/Sensirion/arduino-i2c-sgp40/tree/25a85e2dc9f7b0f96dbf0989162abb5beeb2bd6e','https://github.com/Sensirion/gas-index-algorithm/tree/2ef9f13d225e8a0dedd3ff42dd229af4dbb1aae4'],
wiring:[
['ESP32-S3 3V3','SGP40 VCC and BME280 VCC','3.3 V only','Breakout-specific regulators and load check'],
['ESP32-S3 GND','SGP40 GND and BME280 GND','Shared reference','Continuity check'],
['GPIO4 (proposed)','SGP40 SDA and BME280 SDA','3.3 V I2C','SGP40 address 0x59, BME280 0x76/0x77'],
['GPIO5 (proposed)','SGP40 SCL and BME280 SCL','3.3 V I2C','Pullups to 3V3 only, avoid duplicate strong pullups']
],
extras:['VOC index is a relative trend with warm-up/baseline behavior; no CO2, PM or life-safety claims.'],
tests:[
['01','Scan both I2C addresses','Confirm SGP40 0x59 and BME280 0x76/0x77','Both visible without conflicts'],
['02','Use RH/temperature compensation and checksum validation','Log compensated raw signals and measurement timing','SGP40 readings accepted with algorithm input evidence'],
['03','Run a documented baseline warm-up','Log sample interval, warm-up duration and VOC index','VOC trend appears only after valid warm-up'],
['04','Ventilate room under nonhazardous conditions','Record trend before/after using reference conditions','Trend changes recorded, no false quantitative CO2 statement'],
['05','Disconnect either sensor with power off; restart','Observe invalid compensation and stale state','System shows invalid rather than fabricated index']
]},
'rgb-matrix-clock':{
board:'ESP32-C3 SuperMini + 8x8 WS2812B RGB matrix + 5 V / 5 A external adapter candidate',
target:'esp32c3',example:'examples/peripherals/rmt/led_strip',
driver:'Pinned ESP-IDF RMT led_strip example is a pixel-driver test, not an NTP clock implementation. Pixel count 64, worst-case nominal 64 x 60 mA = 3.84 A at full-white; actual current and thermal limits must be measured.',
refs:['https://docs.espressif.com/projects/esp-idf/en/v5.5.6/esp32c3/api-reference/peripherals/rmt.html'],
wiring:[
['ESP32-C3 GPIO3 (proposed)','5 V-compatible logic buffer input','3.3 V data logic','Required level shifter SN74AHCT125-class after device verification'],
['Logic buffer output','WS2812B first DIN','5 V logic DIN','Test scope high/low and rise time'],
['Regulated 5 V 5 A PSU through correctly sized fuse','WS2812 matrix 5 V','High-current 5 V supply','Verify certified supply, current, connector and cable rating'],
['PSU GND','LED GND + ESP32-C3 GND','Single common signal reference','Avoid powering LED array from ESP32 board USB'],
['USB bench supply','ESP32-C3 USB connector','Independent controller power','Do not connect incompatible 5 V rails or backfeed board']
],
extras:['Required but absent from current project BOM: 5 V logic level shifter, fuse/holder, rated barrel/terminal adapter and power wiring. Exact NRTL certification of PSU remains on HOLD.'],
tests:[
['01','Inspect supply safety marking and polarity with no load','Measure regulated output, connector polarity and protective devices','Verified approved adapter and measured voltage'],
['02','Power single pixel via level-shifted data','Scope DIN and measure current','Pixel colors match expected order; no invalid logic level'],
['03','Test 8x8 matrix brightness and supply current','Measure conservative brightness then increase only within safe measured limits','No brownouts, PSU overheat or wire heating'],
['04','Prove date/time synchronization and fallback','Interrupt Wi-Fi and power-cycle','Clock displays invalid-time state until sync'],
['05','Run 30-minute color-cycle thermal check','Measure board, connector and PSU temperatures','Record stable temperatures and fuse behavior']
]},
'espnow-remote':{
board:'Two identical ESP32-C3 SuperMini modules powered independently over USB',
target:'esp32c3',example:'examples/wifi/espnow',
driver:'Use Espressif pinned ESP-NOW example as two-node reference. Sender emits a test sequence from serial commands; a physical button is not present in the initial BOM.',
refs:['https://docs.espressif.com/projects/esp-idf/en/v5.5.6/esp32c3/api-reference/network/esp_now.html'],
wiring:[['USB supply A','transmitter ESP32-C3 USB','Regulated onboard USB','Record board revision and MAC locally'],['USB supply B','receiver ESP32-C3 USB','Separate regulated USB','No shared hardware ground needed for wireless link'],['ESP32-C3 Wi-Fi radio A','ESP32-C3 Wi-Fi radio B','2.4 GHz ESP-NOW packets','Pair using peer identifiers; do not reveal real device MAC publicly']],
extras:['No external button/actuator in baseline BOM. Use serial-triggered test packets; add a compatible switch only with a revised BOM.'],
tests:[
['01','Record two chip IDs and firmware hashes','Flash pinned sample to each matching board','Both boot at consistent build revision'],
['02','Pair peers and send numbered messages','Send 100 tagged sequence numbers in controlled RF conditions','Capture ACK/loss/retry rates; no assumed zero loss'],
['03','Test peer authentication/encryption settings','Reject unknown peer and capture send status','Unpaired sender cannot trigger action'],
['04','Interrupt receiver power and observe sender','Log timeouts and safe fallback','Timeouts detected; no stale command executed'],
['05','Measure actual distance and current','Report room geometry, interference and idle/Tx current','Reproducible metrics and limitations recorded']
]},
'smart-desk-button':{
board:'ESP32-C3 SuperMini, 6x6-mm normally-open tactile switch and 8-pixel status ring candidate',
target:'esp32c3',example:'examples/peripherals/gpio/generic_gpio',
driver:'Pinned GPIO example proves input/debounce foundation only. An optional RMT LED example implements status signaling; current BOM includes a candidate LED ring but not the required signal shifter.',
refs:['https://docs.espressif.com/projects/esp-idf/en/v5.5.6/esp32c3/api-reference/peripherals/gpio.html'],
wiring:[
['GPIO6 (proposed)','Momentary button terminal A','Input with internal pull-up','Not GPIO2/8/9 C3 boot-strapping pins'],
['Momentary button terminal B','ESP32-C3 GND','Press pulls GPIO6 low','Confirm which pins connect internally on four-pin switch'],
['GPIO3 (proposed)','5 V tolerant buffer input','3.3 V data','Level-shifter required when driving 5 V LED ring'],
['Buffer output','8-pixel LED DIN','5 V WS2812-style serial data','Confirm selected LED option is addressable RGB'],
['Regulated LED 5 V / GND','LED ring VCC/GND','Independent current-rated power','Keep grounds common; do not draw LED load from GPIO']
],
extras:['Add approved 5 V logic shifter, strain relief and suitable current-rated power. 50-piece switch pack is purchasing quantity, not 50 installed devices. Enclosure from referenced 15-button remote does not fit one-button PCB without redesign.'],
tests:[
['01','Start board with button released and pressed','Repeat 20 cold boots while watching boot serial','Always boots normally; no bootstrapping conflict'],
['02','Debounce with 100 short presses and 20 long presses','Log press duration and event counts','No duplicate accidental activations beyond measured threshold'],
['03','Execute mock local action only','No external services, record ACK and timeout result','Action never silently claims success'],
['04','Exercise LED states and full-off privacy','Scope data after shifter and measure power','Correct acknowledged/error/off pattern without overheating'],
['05','Inspect security of firmware and network interactions','Search flash logs and sources for tokens; attempt unauthenticated action','No embedded production secret or exposed unauthenticated control']
]},
'mosaico-learning-assistant':{
board:'ESP-Mosaico ESP32-S31 Core Unit V1.2, LEFT H2 camera module (V1.4 SC101IOT candidate), onboard speaker/microphone',
target:null,example:null,
driver:'Original samyeei software describes v1.0.0 for legacy Recovery ABI 1/layout 4. It is NOT validated with modern Vibe Mode 0.2/Recovery ABI 2, and no commercial code/firmware license is granted. Do not flash or downgrade absent compatibility and rights evidence.',
refs:['https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s31/esp-mosaico/user_guide.html','https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s31/esp-mosaico/user_guide_camera.html','https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s31/esp-mosaico/user_guide_interact.html'],
wiring:[
['ESP-Mosaico LEFT H2 connector','Matching ESP-Mosaico camera module','Vendor-defined board-to-board signals','Power off before install; confirm SC101IOT versus OV3640 and correct H2 orientation'],
['ESP-Mosaico Core Unit','Onboard touch display','Factory internal interface','No invented GPIO map; preserve factory wiring'],
['ESP-Mosaico Core Unit','Onboard mic and speaker','Factory internal interface','No external microphone or speaker needed'],
['Rated USB-C data cable','ESP-Mosaico USB-C','Manufacturer-rated USB','Read recovery ABI/version without destructive flashing']
],
extras:['Cloud-region/model/account cost, privacy, child data and noncommercial firmware rights are distinct software release gates.'],
tests:[
['01','Photograph Core PCB ID, camera module and ABI','Read factory diagnostic/version screens without flashing','Core v1.2, camera model and recovery ABI logged'],
['02','Prove camera preview on factory-authorized compatible firmware','Use non-identifying sample worksheet','Correct orientation and stable image recorded'],
['03','Test Wi-Fi onboarding and signed-in cloud model in permitted environment','Use personal test account, scrub all keys from evidence','Connection error/success logged without secret exposure'],
['04','Test recognition + spoken followup with synthetic worksheet','Record transcript quality and response latency','Measured English behavior; do not assume translation shipped'],
['05','Review legal and data protections for commercialization','Record license approval, data retention and student-data impact','No commercial deployment until software rights and privacy requirements satisfied']
]},
'microduck-robot':{
board:'Radxa ZERO 3W 2-GB/no-eMMC with AMP2.0 October 15 HAT, STM32 IMU and 15 HD-1910-C001 serial servos',
target:null,example:null,
driver:'Use kissqy source as independent robot build at pinned revision; original Oct 15 AMP2.0 HAT/IMU .epro2 and audited be8c106 source. No generic ESP32 firmware is applicable. Pin Radxa OS image, kernel and servo firmware only after original-version/hardware verification.',
refs:['https://github.com/kissqy/Microduck-kissqy/tree/be8c106','https://github.com/kissqy/Microduck-kissqy/blob/be8c106/hardware/AMP2.0-VERSION.en.md'],
wiring:[
['HAT J13/J14 pin 1','IMU J1 pin 1 / DXL bus GND','GND, 2.0 mm AMP2.0 3-pin','October 15 PCB only; no EH2.5 swap'],
['HAT J13/J14 pin 2','IMU J1 pin 2 / servo bus VDD','BATT_IN / DXL_VDD','Check actual battery voltage and actuator limit before power'],
['HAT J13/J14 pin 3','IMU J1 pin 3 / servo bus DATA','DXL_DATA','Verify half-duplex bus direction and connector pitch'],
['IMU SWD J2 pin 1 / 2 / 3 / 4 / 5','3V3 / SWDIO / GND / SWCLK / NRST','STM32 SWD programming','Do not confuse with servo/battery connector'],
['Radxa ZERO 3W, 2 GB / no eMMC','HAT board interface','Board-specific headers','Check 40-pin orientation/power net from EasyEDA design'],
['HAT HP1.25 J1/J2/J9','speaker / left mic / right mic','1.25-mm audio headers','No AMP2.0 2-mm substitution for audio']
],
extras:['NP-F550 lithium battery, servo stall-current/fusing, printed TPU plate 5 and exact PCB BOM need physical validation. CAD redistribution remains governed by original permissions.'],
tests:[
['01','Verify 3MF/RAR and four .epro2 hashes from archived review','Compare SHA256 manifest with source; inspect 3MF unit and print plates','All archive hashes match, mm units, TPU plate 5; no unreviewed files mixed'],
['02','Perform EasyEDA Pro ERC/DRC on matched Oct 15 revisions','Export rule reports and review regulator/trace widths','Zero unreviewed electrical/design violations'],
['03','Measure 15 servo IDs, torque-free joints, current and polarity','One-by-one unloaded bench test with overcurrent protection','Every ID unique and current within documented limits'],
['04','Print one diagnostic joint and fit hardware before batch','Measure servo pocket, bearing bores and sample part scale','Measured physical fit and non-interfering travel'],
['05','Bring up IMU, camera, ToF and Radxa software independently','Capture firmware/kernel versions and sensor logs','Source-matched devices enumerate and deliver valid data'],
['06','Run tethered stand then bounded low-speed gait','Log battery, temperatures, gait frames and emergency cutoff','Safe calibrated standing and recoverable walking; no uncontrolled tip hazard']
]}
};
