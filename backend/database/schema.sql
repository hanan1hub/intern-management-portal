-- ============================================================
-- Intern Management Portal - Database Schema
-- Run this against your PostgreSQL database first
-- Then run: npm run seed  (creates default admin account)
-- ============================================================

CREATE TABLE IF NOT EXISTS admins (
  id           SERIAL PRIMARY KEY,
  username     VARCHAR(50)  UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interns (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(150) UNIQUE NOT NULL,
  department   VARCHAR(100) NOT NULL,
  joining_date DATE         NOT NULL,
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  intern_id   INTEGER      NOT NULL REFERENCES interns(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  status      VARCHAR(20)  NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'completed')),
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance (
  id          SERIAL PRIMARY KEY,
  intern_id   INTEGER     NOT NULL REFERENCES interns(id) ON DELETE CASCADE,
  date        DATE        NOT NULL,
  status      VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (intern_id, date)
);
