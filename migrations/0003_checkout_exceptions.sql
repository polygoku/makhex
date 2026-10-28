-- Non-payment MAKHEX first-party order and exception queue.
-- Buyer address/card data stays with the payment provider; only email and ZIP here.
CREATE TABLE IF NOT EXISTS makhex_checkout_requests (
  id TEXT PRIMARY KEY NOT NULL,
  access_hash TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  shipping_zip TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING_REVIEW'
    CHECK(status IN ('PENDING_REVIEW','APPROVED_NEEDS_PAYMENT_LINK','PAYMENT_LINK_READY','REJECTED','PAID_VERIFIED','FULFILLMENT_PENDING','FULFILLED')),
  lines_json TEXT NOT NULL,
  planning_subtotal_cents INTEGER,
  approved_total_cents INTEGER CHECK(approved_total_cents IS NULL OR approved_total_cents > 0),
  payment_url TEXT,
  merchant_order_id TEXT,
  tracking_reference TEXT,
  owner_note TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_makhex_checkout_status_created
  ON makhex_checkout_requests(status,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_makhex_checkout_expires
  ON makhex_checkout_requests(expires_at);
CREATE TABLE IF NOT EXISTS makhex_checkout_events (
  id TEXT PRIMARY KEY NOT NULL,
  request_id TEXT NOT NULL REFERENCES makhex_checkout_requests(id),
  actor TEXT NOT NULL CHECK(actor IN ('CUSTOMER','OWNER','PROVIDER')),
  action TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  note TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_makhex_checkout_events
  ON makhex_checkout_events(request_id,created_at ASC);
