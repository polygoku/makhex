-- Community maker accounts are pseudonymous; commerce account/payment data stays in Squarespace.
-- Recovery tokens and browser sessions are stored as SHA-256 hashes only.
CREATE TABLE IF NOT EXISTS maker_accounts (
 id TEXT PRIMARY KEY NOT NULL,
 display_name TEXT NOT NULL UNIQUE COLLATE NOCASE,
 recovery_hash TEXT NOT NULL UNIQUE,
 status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','revoked','suspended')),
 created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS maker_sessions (
 session_hash TEXT PRIMARY KEY NOT NULL,
 account_id TEXT NOT NULL REFERENCES maker_accounts(id) ON DELETE CASCADE,
 created_at INTEGER NOT NULL,
 expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_maker_sessions_expiry ON maker_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_maker_sessions_account ON maker_sessions(account_id);
ALTER TABLE comments ADD COLUMN human_author_id TEXT REFERENCES maker_accounts(id);
CREATE INDEX IF NOT EXISTS idx_comments_human_owner ON comments(human_author_id,created_at);