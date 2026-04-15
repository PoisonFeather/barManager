-- Migration: Add role column to users table
-- Run this on the production database before deploying the superadmin feature
-- Safe to run multiple times (IF NOT EXISTS guard)

ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user';

-- Verify
-- SELECT id, username, role FROM users;
