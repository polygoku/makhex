# Supplier qualification packet — Freenove FNK0104N (first MAKHEX pilot)

_Last checked: October 21, 2026 EDT. Exact SKU only. Evidence is preliminary; NO purchase authorization or stock promise._

## Manufacturer identity and product specifications

| Attribute | Vendor evidence / status |
| --- | --- |
| Manufacturer | **Freenove** (brand should not be stripped or falsely represented as MAKHEX manufactured) |
| Official product | https://store.freenove.com/products/fnk0104 |
| Selectable variant | **3.5 Inch IPS Touch**; manufacturer **SKU FNK0104N**; Shopify variant ID `46006024995014` |
| Manufacturer price | **USD $25.99** at inspection; not a wholesale or dropship contract rate |
| Display | **3.5-inch IPS capacitive touch**, native **320 × 480**, ST77922 display/controller; QSPI display path; see https://docs.freenove.com/projects/fnk0104/en/latest/fnk0104/codes/MAIN/Freenove_ESP32S3_Display.html |
| Processor | ESP32-S3, Wi-Fi + Bluetooth LE; exact flash/PSRAM and board revision to be verified against actual unit and schematic |
| Touch | Freenove provides `ST77922_Touch.h` example for this SKU, distinct from its 2.8/4.0-inch variants. Vendor tutorial: https://docs.freenove.com/projects/fnk0104/en/latest/fnk0104/codes/MAIN/11_TFT_Touch.html |
| Firmware | Open manufacturer repo: https://github.com/Freenove/Freenove_ESP32_S3_Display ; do not claim MAKHEX-tested release or verified GPIO mapping |
| Supplier kit contents | Freenove listing mentions display module, speaker, USB-A→USB-C cable and connecting cables; check actual variant packing before listing |
| Sourcing images | Official photos are reference evidence; permission for use on MAKHEX storefront is **not established**. Prefer original photographs of owned unit |

## Supplier and fulfillment check (ZIP 11021)

A one-unit anonymous manufacturer cart session was created using the public Shopify storefront variant, **without entering payment or placing an order**. Quote obtained:

- Variant selection: **available=true** at timestamp of query; **no numeric stock or reservation verified**.
- Manufacturer price: **USD $25.99**.
- Shipping option: **Standard Shipping from China (11 to 15 working days)**.
- Quoted shipping price: **USD $0.00** for this single unit and ZIP 11021.
- **Provisional item + quoted freight: USD $25.99** before taxes, duties, payment processing, supplier/return costs and shrinkage. Do NOT present as the final customer landed cost.
- Manufacturer states handling is normally within **2 working days** of payment; cross-border delays and duty/VAT may apply. Policy: https://store.freenove.com/policies/shipping-policy .
- Manufacturer return policy: **30 days after receiving**, item unused/original packaging, with exclusions (including sale items) and unknown U.S. return freight. Policy: https://store.freenove.com/policies/refund-policy .

These figures are **dated vendor observations**, not binding wholesale terms, checkout completion, orderability/fulfillment evidence or an SLA for MAKHEX customers.

## Hardware / integration caveats

Freenove's model-specific sample code for FNK0104N uses `I2C_SDA 38` and `I2C_SCL 39` in one audio example. This does **not** prove that an arbitrary BME280 breakout can safely use those pins/connectors. Verify breakout power/logic level, actual JST pinout, shared I2C bus loads, touch controller use, ESP32-S3 peripherals, board-revision differences, and one prototype on a real bench before publishing wiring.

The MAKHEX Touch Weather Station BOM still comprises the display candidate, BME280 and USB bench power. **No complete kit offer** until all exact SKU revisions and combined fulfillment are validated.

## Missing gates before selling

- Freenove's reseller permission, dropshipping capability, use-of-brand/media conditions, invoice/commercial liability and U.S. return address.
- Exact per-option *checkout* orderability, stock depth, buyer delivery estimate, tax/duties and fulfillment logistics; 11–15-day China shipping is a commercial tradeoff.
- A verified MAKHEX Squarespace shop public product draft and unique merchant-facing SKU that stores `FNK0104N` as supplier identifier separately.
- Documented checkout, payment value/transaction ID, cancellation/refund, inventory decrement and actual shipping/tracking — require separate authorization before placing any order.
- Complete bench reproduction of touch, BME280 voltage and wiring, stable power, LVGL version and sensor driver.
- Original/authorized product photos, actual weights/dimensions, SEO copy that clearly calls this a **development board**, not a completed weather station.

**Disposition: RESEARCH / HOLD.** No MAKHEX product-price setting, public visibility, checkout approval or inventory release is authorized by this packet. Do not duplicate another agent's ongoing Squarespace SKU work. Use [issue #31](https://github.com/polygoku/makhex/issues/31) for fulfillment and electronics acceptance evidence.
