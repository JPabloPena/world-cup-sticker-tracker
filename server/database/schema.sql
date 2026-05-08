-- stickers table
CREATE TABLE IF NOT EXISTS stickers (
    id TEXT PRIMARY KEY,
    country_code TEXT NOT NULL,
    name TEXT NOT NULL,
    position INTEGER NOT NULL,
    count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stickers_country ON stickers(country_code);
CREATE INDEX IF NOT EXISTS idx_stickers_name ON stickers(name);