-- Anonymous per-day counts; no IP address, session identifier, customer or order data.
CREATE TABLE IF NOT EXISTS makhex_project_funnel_daily (
  day TEXT NOT NULL CHECK(length(day)=10),
  project TEXT NOT NULL,
  event TEXT NOT NULL CHECK(event IN ('project_view','demo_play','assembly_interact','add_to_cart','checkout_start','order_request_created','paid_checkout_verified')),
  count INTEGER NOT NULL DEFAULT 0 CHECK(count>=0),
  PRIMARY KEY(day,project,event)
);
CREATE INDEX IF NOT EXISTS idx_makhex_project_funnel_project_day ON makhex_project_funnel_daily(project,day DESC);
