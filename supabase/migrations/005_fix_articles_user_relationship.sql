-- Fix Articles-User Relationship Migration
-- This migration adds the missing foreign key relationship between articles and cms_users
-- Author: Claude Code - Backend Systems Architect
-- Date: 2025-09-04

-- Add created_by column to articles table to reference cms_users
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS created_by UUID;

-- Add updated_by column to articles table to reference cms_users  
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS updated_by UUID;

-- Add foreign key constraints
ALTER TABLE articles 
ADD CONSTRAINT articles_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES cms_users(id) ON DELETE SET NULL;

ALTER TABLE articles 
ADD CONSTRAINT articles_updated_by_fkey 
FOREIGN KEY (updated_by) REFERENCES cms_users(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_articles_created_by ON articles(created_by);
CREATE INDEX IF NOT EXISTS idx_articles_updated_by ON articles(updated_by);

-- Update the update trigger to also set updated_by when user is available
CREATE OR REPLACE FUNCTION update_articles_updated_at_and_user()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    -- updated_by will be set by the application code
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Replace the existing trigger
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at_and_user 
    BEFORE UPDATE ON articles 
    FOR EACH ROW EXECUTE FUNCTION update_articles_updated_at_and_user();

-- Create a default admin user if none exists (for testing purposes)
INSERT INTO cms_users (
    email, 
    username, 
    password_hash, 
    role, 
    first_name, 
    last_name,
    is_active
) 
SELECT 
    'admin@workflo.it',
    'admin',
    '$2b$10$LGWlAyJ7RGRyNjf1B5LqL.WGHnSQ3B8X3aF4yE5lJ9QHpJqM2C1nG', -- bcrypt hash of 'admin123'
    'admin',
    'System',
    'Administrator',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM cms_users WHERE email = 'admin@workflo.it'
);

-- Update any existing articles without created_by to use the admin user
UPDATE articles 
SET created_by = (SELECT id FROM cms_users WHERE email = 'admin@workflo.it' LIMIT 1)
WHERE created_by IS NULL;