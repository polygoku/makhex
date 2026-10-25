# Microduck CAD / PCB source review — 2026-10-25

**MAKHEX review scope:** archival integrity, native project format, print-part naming, geometry scaling hazards, electronic board revisions and engineering handoff. No device or PCB was fabricated, printed, fitted, electrically tested or mechanically stress-tested by MAKHEX.

## Sources and checked provenance

Original repository: https://github.com/kissqy/Microduck-kissqy
Reviewed upstream commit **`be8c106`**, October 25 checkout.

Downloaded exactly **15,248,649 bytes**:

- `hardware/3d-print-frankenduck/Microduck-Print-FrankenDuck-20261015.rar`
- SHA-256 **`ff78c1d7431733d1fd9fc9265d8930548e72551dd42ee05771c3fbf0d14e302f`**
- Independently computed SHA-256 equals author's `SHA256SUMS` and `FILE-MANIFEST.json`.
- Extraction with 7-Zip 26.03: **OK**, 37 files total, approximately 53.4 MB uncompressed.
- Manifest comparison: **36/36 individual STL files verified** at source-path and byte SHA-256 level; one 3MF plate project.

File names, original plates and print settings:
https://github.com/kissqy/Microduck-kissqy/tree/main/hardware/3d-print-frankenduck

### Independent mesh topology analysis (Trimesh 5.2.0 / NumPy 2.5.4)

Every extracted STL was independently parsed into a triangle mesh:

- **36/36 STL meshes parse and are watertight** after normal STL vertex merging.
- **36/36 meshes have consistent winding** and **36/36 show positive enclosed volume** under the same topology processing.
- **11/36 files have near-zero standalone coordinate scale**, with bounding dimensions measured around 0.001–0.09 in source coordinate units; companion models measure tens of units. A likely meters/millimeters export inconsistency requires the exact slicer geometry check and possible explicit scale adjustment.
- **5/36 meshes contain non-area/degenerate faces**, **40 degenerate triangles total**. The affected pieces are the left sole (1), right thigh outer shell (17), head lid (1), left thigh outer shell (15), and thick-latch battery holder (6). Inspect automatic slicer repairs and boundary/toolpath previews before fabricating them.

Trimesh mesh validity is a useful **digital** screening check, not a guarantee of printability, overhang support, water tightness after slicing, material strength, servo clearances or safe mechanical loads. The original model files were **not modified** as part of this audit.

### 3D model format checks

- All 36 listed STL binaries/files were present, readable and individually hash-verified. Some files use ASCII STL representation; not all can be interpreted using a binary STL header. Model mesh watertightness and dimensional fit were **not** proven.
- The `.3mf` archive opens as a valid ZIP 3MF package and declares **millimeter** in its model documents. The root contains a Bambu Studio five-plate print project.
- Recorded source slicer: BambuStudio 02.08.02.61, Bambu Lab P2S, 0.4 mm nozzle, 0.20 mm standard preset. These are source defaults, not universal material or quality guarantees.
- **WARNING: mixed STL coordinate scales.** Several standalone STL meshes have dimensions around `0.041 × 0.054 × 0.013` model units while companion solid shell meshes show ordinary dimensions around `58 × 20 × 7.6` or `91.8 × 116.7 × 20.1`. The discrepancy could represent meters vs millimeters or source exporter scaling. Import the saved 3MF for layout and then check size/orientation of any independently reimported STL, including matching the physical 15-servo chassis.
- TPU group: two soles and roller tire (source plate **5**). The author cautions that saved Bambu project presets are PLA; switch plate 5 to TPU explicitly.
- Battery holders: `电池仓_M2.5螺丝_HUB组合.stl` with HUB clamp, and `电池仓_卡扣加厚.stl` with thicker snap latches. **Alternative**, do not install both.
- Foot variants: printable interchangeable feet and rollers; optional **623ZZ** bearings: bore **3 mm**, OD **10 mm**, width **4 mm**. Original order 8 pieces is **historical procurement quantity**, not validated required-installed bearing count.
- The source repository describes October 21 geometry refinements; the distributed archive filename and manifest are October 15. Confirm which exact file revision carries any later geometry changes before treating them as incorporated.
- No measured clearance, successful slice on MAKHEX hardware, print tolerances, load-bearing calculations, fatigue tests, motor overcurrent or enclosure battery-safety verification is established by archive extraction.

### Electronic CAD native-source validation

All files below are valid ZIP-based **EasyEDA Pro `.epro2`** projects and passed internal ZIP CRC checks. Each contains `project2.json`, a native `.epru` project unit and associated embedded images.

| File | SHA-256 | Revision |
| --- | --- | --- |
| `ProPrj_HAT_REVA_SCH_2026-10-07.epro2` | `5aa0db7d24a14887e9e7340c1c3708c9d2a60ef5638243d39e743cc7430447f7` | EH2.5 HAT |
| `ProPrj_HAT_REVA_SCH_2026-10-15.epro2` | `9c2870a28b29845ef6e559369cf3ea3c27e3fccd12b63745ed661af77fff32b0` | AMP2.0 HAT |
| `ProPrj_imu_to_dxl_RevA_V1_2026-10-07.epro2` | `4eb30bf9e29dba578681e6752a4457659169460d554a5b178f2fd51f7b9ea6b4` | EH2.5 IMU |
| `ProPrj_imu_to_dxl_RevA_V1_2026-10-15.epro2` | `824bad07b60bbb1680f759c45b1e2bb918757f7f59747d254cb6d0d0c2ec4a25` | AMP2.0 IMU |

The October 15 board sources change critical interconnects:

| Functional net / item | HAT connector | IMU connector |
| --- | --- | --- |
| Bus cable type | J13 and J14: **CJT A2007WV-3P**, 3 pin **2.0 mm** | J1: same AMP2.0 family |
| AMP2.0 pin 1 | GND | GND |
| AMP2.0 pin 2 | BATT_IN | DXL_VDD |
| AMP2.0 pin 3 | DXL_DATA | DXL_DATA |
| Audio | HAT J1 speaker, J2 left mic and J9 right mic **HP1.25 2 pin**, CJT A1251WV-2P | Not applicable |
| Indicator additions | D5 `LTST-C190KGKT` and R34 `0603WAF1001T5E`, 1kΩ | No equivalent change |
| Flash pins | Not an IMU flash connector | J2 SWD: 1=3V3, 2=SWDIO, 3=GND, 4=SWCLK, 5=NRST |

The source's current October 15 AMP2.0 HAT BOM has **86** board components and IMU **25**. The original October 7 EH2.5 version and its Chinese procurement spreadsheet are not drop-in wiring substitutes. Use the **version-aligned** BOM and verify footprint/pin numbers before PCB orders.

Upstream connector pinout/reference:
https://github.com/kissqy/Microduck-kissqy/blob/main/hardware/AMP2.0-VERSION.en.md

### Required engineering signoff before an actual kit

1. Confirm source design revision and rights for commercial PCB fabrication or printing; the ability to download a source file is **not** a commercial manufacturing grant.
2. Run EasyEDA Pro **ERC and DRC**, verify copper trace widths/current, HAT regulator thermals, connectors, hardware revisions and IMU/SWD netlists. Valid project ZIP does **not** establish electrical correctness.
3. Verify supplied NP-F550 pack voltage and overcurrent safeguards, transient loads for 15 servos, grounding, power wiring and battery polarity; the source assembly note recommends a **1000µF** capacitor across the main power input as a design consideration, to be independently sized.
4. Print one diagnostic part and check mm scale against measured bearing/servo geometry before batch printing all plates. Switch TPU plate5.
5. Crosscheck frame assembly, servo mechanical travel and dynamic load/stand clearance with real hardware.
6. Reconcile number of *installed* bearings, wiring lengths and fasteners from actual assembly vs historical order quantities. Keep optional roller parts separate.
7. Qualify exact independent supplier variants, price at MAKHEX 2.5× source cost as instructed by owner, U.S. freight and checkout via Doroppu/Squarespace before enabling paid purchase links.

## Media review

Seven genuine original video clips were fetched and checked as MP4 `ftyp` files, with posters generated from video frames. Each video has its original upstream `github.com/user-attachments/assets/...` URL, byte size and SHA-256 recorded in `public/demo/microduck/media-manifest.json`. A distinct eighth matched GitHub attachment is a creator-support image, **not** video, and was not reused. The same source RAR supplies all five original print-plate screenshots.

**Verdict:** Source integrity/format **PASS**; dimension and BOM interface mismatch warnings documented; commercial kit readiness **NOT TESTED / HOLD**. Publish only the credited factual project showcase and research component links until mechanical/electrical and fulfillment gates pass.
