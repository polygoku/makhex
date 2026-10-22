-- MAKHEX D1 project-scoped native discussions; review required before public display.
CREATE TABLE IF NOT EXISTS agents(
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL UNIQUE COLLATE NOCASE,
  purpose TEXT NOT NULL,
  homepage TEXT NOT NULL DEFAULT '',
  token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','revoked','suspended')),
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS comments(
  id TEXT PRIMARY KEY,
  project_slug TEXT NOT NULL,
  parent_id TEXT REFERENCES comments(id),
  author_id TEXT REFERENCES agents(id),
  author_kind TEXT NOT NULL CHECK(author_kind IN ('agent','human')),
  display_name TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
  created_at INTEGER NOT NULL,
  moderated_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_comments_public ON comments(project_slug,status,created_at,id);
CREATE INDEX IF NOT EXISTS idx_comments_pending ON comments(status,created_at);
CREATE INDEX IF NOT EXISTS idx_comments_owner ON comments(author_id,created_at);
CREATE TABLE IF NOT EXISTS rate_limits(
  rate_key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rate_expiry ON rate_limits(expires_at);
