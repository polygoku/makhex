// Editorial build context: these are MAKHEX proposals, not bench-tested kits.
// Videos and source repositories belong to the credited independent creators.
export interface ProjectGuide {
  overview: string;
  useCases: string[];
  beforeYouStart: string[];
  demoGoals: string[];
  agentTasks: string[];
  video?: { url: string; title: string; creator: string };
}
export const projectGuides: Record<string, ProjectGuide> = {
  'touch-weather-station': {
    overview: 'Build a touch-operated desktop display that makes room climate readings glanceable. Start with a sensor-only serial test, prove the exact LCD and touch controller, then combine them in a simple LVGL layout. This MAKHEX configuration is different from the independently photographed weather display.',
    useCases: ['Desk climate display for a home office', 'Learning LVGL screen navigation and UI fault states', 'Monitoring environmental trends while prototyping'],
    beforeYouStart: ['Identify the precise display controller, touch chip and backlight pin mapping from the purchased board.', 'Confirm the BME280 uses 3.3 V and that its I2C pins do not conflict with the display.'],
    demoGoals: ['A live temperature/humidity reading appears with a last-updated timestamp.', 'Touch works for 30 minutes without freezes or phantom presses.', 'Unplugging the sensor produces a visible stale-data warning rather than a fabricated reading.'],
    agentTasks: ['Map actual screen/touch GPIO from the board schematic before writing display drivers.', 'Provide a minimal sensor example and LVGL build instructions with a reproducible flash log.']
  },
  'voice-command-node': {
    overview: 'A microphone, a local command classifier and a speaker can become a push-to-talk desk assistant. Keep the first milestone intentionally narrow: recognize a handful of fixed commands rather than promising general-purpose fully offline conversation. The referenced Dudley project is a hybrid voice system, not proof of an offline MAKHEX build.',
    useCases: ['Hands-free status or timer commands at a workbench', 'I2S microphone and amplifier experimentation', 'Latency and memory profiling of tiny on-device recognition models'],
    beforeYouStart: ['Select an electrically compatible 3.3 V I2S microphone, amplifier and speaker; the speaker and pushbutton are not yet in the kit.', 'Verify the board has sufficient PSRAM and use a hardware control with an unmistakable microphone-active indicator.'],
    demoGoals: ['Record and play back intelligible audio without buffer underruns.', 'Recognize three documented commands under a measured noise condition.', 'The device visibly stops listening on timeout and never silently records.'],
    agentTasks: ['Document separate microphone and amplifier bring-up procedures before the combined firmware.', 'Record the recognition model, memory allocation and repeatable latency benchmark.']
  },
  'tiny-ble-presence': {
    overview: 'Configure an ESP32-C3 to broadcast a rotating, non-identifying BLE demonstration payload and inspect it from a nearby scanner. This teaches GAP advertising and radio duty cycling without building a covert person-tracking system.',
    useCases: ['Learning BLE advertising packet formats', 'Testing low-power sleep and wake intervals', 'Prototyping anonymous local device discovery'],
    beforeYouStart: ['Check the ESP32-C3 board revision and BLE stack support in your chosen ESP-IDF release.', 'Use a test identifier unrelated to any person, device owner or real-world asset.'],
    demoGoals: ['A standard BLE scanner sees the advertised demo service.', 'Payload and transmit interval match the documented firmware.', 'Measured idle and transmit current are recorded with the meter setup.'],
    agentTasks: ['Publish a tiny NimBLE advertising project with reproducible scanner steps.', 'Include privacy limits, rotation interval and current-measurement methodology.'],
    video: { url: 'https://youtu.be/ntAMRt7f-G8', title: 'Spottr reference BLE beacon demonstration', creator: 'BrunoGG69' }
  },
  'plant-health-monitor': {
    overview: 'Display the temperature, humidity and pressure around a plant using a BME280 and a small ESP32. This is an ambient-conditions monitor, not a soil-moisture or watering recommendation device. Make that distinction clear in both the dashboard and the data log.',
    useCases: ['Comparing room humidity around houseplants', 'Learning sensor polling and HTTP status pages', 'Exploring temperature changes near a window or vent'],
    beforeYouStart: ['Confirm the BME280, not BMP280, part number and correct 3.3 V supply.', 'Select a safe Wi-Fi-only local dashboard with no exposed internet control endpoint.'],
    demoGoals: ['Room readings update at the chosen interval with units.', 'Power interruption and sensor disconnect are distinguished in the UI.', 'A calibration limitation note is visible next to readings.'],
    agentTasks: ['Create a read-only local web page with age-of-data indication.', 'Provide serial logs and troubleshooting for common I2C address differences.']
  },
  'camera-event-trigger': {
    overview: 'Use a small camera board to detect changes between frames and log simple local events. Keep video local and avoid collecting sensitive images: this is a camera/software learning prototype rather than a certified security or monitoring system.',
    useCases: ['Learning ESP32 camera-frame capture and PSRAM limits', 'Detecting a non-sensitive change at a model workbench', 'Comparing frame-difference thresholds in changing light'],
    beforeYouStart: ['Verify the exact camera module, lens, GPIO assignment and PSRAM capacity; bundle compatibility is currently on HOLD.', 'Point the camera at an explicitly consented, non-sensitive test scene.'],
    demoGoals: ['A stable frame stream runs within measured memory limits.', 'A synthetic scene change creates a timestamped local event.', 'An obvious camera-active indicator and local event deletion work.'],
    agentTasks: ['Pin down camera sensor model, frame size and PSRAM usage first.', 'Offer deterministic fixture tests for false triggers under varying light.']
  },
  'epaper-desk-calendar': {
    overview: 'Make a quiet always-on calendar that refreshes a small e-paper screen only when necessary. First prove the panel/controller combination with a static test image; then add local date handling, Wi-Fi time sync and sleep without excessive refresh cycles.',
    useCases: ['A low-distraction desk date and agenda display', 'Learning SPI displays and deep sleep', 'Exploring refresh endurance and ghosting tradeoffs'],
    beforeYouStart: ['Match the 2.9-inch panel controller and FPC to its library; current supplier bundle is not yet verified.', 'Choose a reliable timezone and offline fallback when NTP cannot be reached.'],
    demoGoals: ['A static test pattern renders cleanly.', 'Date/time remain correct through a restart and network loss.', 'Deep sleep and refresh intervals are measured and documented.'],
    agentTasks: ['Make controller-selection checks explicit before library recommendations.', 'Provide a safe demo without requiring personal calendar credentials.'],
    video: { url: 'https://youtu.be/xnUqWcdtqyU', title: 'Original e-paper calendar in action', creator: 'trandi' }
  },
  'indoor-voc-explorer': {
    overview: 'Combine an SGP40 sensor with temperature and humidity compensation to explore relative VOC trends. This sensor output is not a direct carbon-dioxide or particulate measurement, and the prototype must not claim health, safety or air-quality certification.',
    useCases: ['Observing relative changes when a room is ventilated', 'Studying sensor warm-up and baseline behavior', 'Plotting time-series samples with ambient compensation'],
    beforeYouStart: ['Verify SGP40 and BME280 supply/bus wiring on the exact board.', 'Choose a VOC index library with documented warm-up and state persistence.'],
    demoGoals: ['VOC trend and compensation readings appear with timestamps.', 'Warm-up and out-of-range conditions are shown instead of hidden.', 'No CO2 concentration or safety alarm is inferred from VOC data.'],
    agentTasks: ['State the exact VOC algorithm and supported conditions.', 'Supply test logs for sensor warm-up, disconnect and compensation.']
  },
  'rgb-matrix-clock': {
    overview: 'Drive a WS2812 LED array as a colorful clock or status board. The important design exercise is power, not animation: establish an externally rated supply, common ground and safe pixel signal levels before increasing brightness.',
    useCases: ['A desk clock that changes display modes', 'A status indicator for local maker projects', 'Experimenting with LED animation and brightness limits'],
    beforeYouStart: ['Size a separate 5 V supply for the real LED count; the current BOM does not establish a rated matrix supply.', 'Confirm ESP32-to-pixel logic compatibility and wiring length; add an appropriate level shifter if needed.'],
    demoGoals: ['A small pixel subset lights without power or data faults.', 'Current draw at the imposed brightness cap stays under the measured supply limit.', 'Loss of time-sync is displayed distinctly from valid time.'],
    agentTasks: ['Calculate current budget from verified LED quantity and brightness constraints.', 'Provide firmware color order, power injection and safe startup behavior.']
  },
  'espnow-remote': {
    overview: 'Pair two ESP32-C3 boards over ESP-NOW and build a very small wireless remote demonstration. Start by proving packet exchange and receive acknowledgements before adding a button, enclosure or any control output.',
    useCases: ['Learning short-range ESP-NOW data exchange', 'Measuring packet retries, latency and link loss', 'Prototyping non-critical wireless desk controls'],
    beforeYouStart: ['Use matching ESP32-C3 boards and firmware versions on both ends.', 'Never connect the demo to a safety-critical actuator or lock.'],
    demoGoals: ['Peer pairing is documented and repeatable.', 'Each button event carries a sequence number and acknowledgement.', 'Loss of link returns the receiver to a harmless idle state.'],
    agentTasks: ['Publish compatible sender/receiver firmware and a measurement script.', 'Document channel, pairing, auth and timeout assumptions.']
  },
  'smart-desk-button': {
    overview: 'Build a single physical button that triggers a low-risk local shortcut and signals success or failure with an LED. The click behavior should work without exposing private credentials or executing unapproved internet actions.',
    useCases: ['A focus or timer shortcut for a workstation', 'One-touch logging of a harmless local event', 'Learning switch debounce and network retry feedback'],
    beforeYouStart: ['Add a separately sourced momentary pushbutton; it is missing from the current BOM.', 'Choose an ESP32-C3 GPIO that is not a boot strapping conflict on the actual board.'],
    demoGoals: ['Short and long presses are debounced consistently.', 'LED state distinguishes acknowledgement from timeout.', 'No API secret is stored in source or sent in a public request.'],
    agentTasks: ['Write a pin-selection and debounce test matrix.', 'Implement local no-op mock action before real network integration.']
  }
};