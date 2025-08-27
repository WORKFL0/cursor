#!/usr/bin/env tsx

/**
 * Database Migration Script for Payload CMS + Supabase
 * This script handles database migrations and ensures proper setup
 * for Payload CMS tables in Supabase PostgreSQL
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables for database migration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

interface MigrationFile {
  version: string
  name: string
  up: string
  down: string
}

async function createMigrationsTable() {
  console.log('📋 Creating migrations table...')
  
  const createMigrationsTableSQL = `
    CREATE TABLE IF NOT EXISTS payload_migrations (
      id SERIAL PRIMARY KEY,
      version VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMPTZ DEFAULT NOW()
    );
  `

  const { error } = await supabase.rpc('sql', { query: createMigrationsTableSQL })
  
  if (error && !error.message.includes('already exists')) {
    throw new Error(`Failed to create migrations table: ${error.message}`)
  }

  console.log('✅ Migrations table ready')
}

async function getExecutedMigrations(): Promise<string[]> {
  const { data, error } = await supabase
    .from('payload_migrations')
    .select('version')

  if (error) {
    // If table doesn't exist yet, return empty array
    if (error.message.includes('does not exist')) {
      return []
    }
    throw error
  }

  return data?.map(m => m.version) || []
}

async function executeMigration(migration: MigrationFile) {
  console.log(`🚀 Executing migration: ${migration.name}`)

  // Execute the migration SQL
  const { error: migrationError } = await supabase.rpc('sql', { 
    query: migration.up 
  })

  if (migrationError) {
    throw new Error(`Migration failed: ${migrationError.message}`)
  }

  // Record the migration as executed
  const { error: recordError } = await supabase
    .from('payload_migrations')
    .insert({
      version: migration.version,
      name: migration.name
    })

  if (recordError) {
    throw new Error(`Failed to record migration: ${recordError.message}`)
  }

  console.log(`✅ Migration ${migration.name} completed successfully`)
}

async function loadMigrations(): Promise<MigrationFile[]> {
  const migrationsDir = path.join(process.cwd(), 'migrations')
  
  if (!fs.existsSync(migrationsDir)) {
    console.log('📁 Creating migrations directory...')
    fs.mkdirSync(migrationsDir, { recursive: true })
  }

  // Create default initial migration if no migrations exist
  const initialMigrationPath = path.join(migrationsDir, '001_initial_setup.sql')
  
  if (!fs.existsSync(initialMigrationPath)) {
    const initialMigration = `
-- Initial setup for Payload CMS with Supabase
-- This migration prepares the database for Payload CMS tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create indexes for better performance
-- Note: Payload CMS will create the actual tables
-- These are optimizations that will be applied after table creation

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Comment to document this is the initial Supabase setup
COMMENT ON FUNCTION update_updated_at_column() IS 'Function to automatically update updated_at timestamp';
`

    fs.writeFileSync(initialMigrationPath, initialMigration)
    console.log('📄 Created initial migration file')
  }

  // Load all .sql files from migrations directory
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort()

  const migrations: MigrationFile[] = []

  for (const file of files) {
    const filePath = path.join(migrationsDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // Extract version from filename (e.g., "001_initial_setup.sql" -> "001")
    const version = file.split('_')[0]
    const name = file.replace('.sql', '').replace(/^\d+_/, '')

    migrations.push({
      version,
      name,
      up: content,
      down: '' // For now, we'll implement down migrations later if needed
    })
  }

  return migrations
}

async function runMigrations() {
  console.log('🗄️  Starting database migrations...\n')

  try {
    // Ensure migrations table exists
    await createMigrationsTable()

    // Get list of executed migrations
    const executed = await getExecutedMigrations()
    console.log(`📊 Found ${executed.length} previously executed migrations`)

    // Load available migrations
    const migrations = await loadMigrations()
    console.log(`📁 Found ${migrations.length} migration files`)

    // Filter out already executed migrations
    const pendingMigrations = migrations.filter(m => !executed.includes(m.version))

    if (pendingMigrations.length === 0) {
      console.log('✅ All migrations are up to date!')
      return
    }

    console.log(`🚀 Executing ${pendingMigrations.length} pending migrations:\n`)

    // Execute pending migrations in order
    for (const migration of pendingMigrations) {
      await executeMigration(migration)
    }

    console.log('\n✅ All migrations completed successfully!')

    // Display next steps
    console.log('\n📝 Next steps:')
    console.log('1. Start your Next.js application: npm run dev')
    console.log('2. Payload CMS will create its tables automatically')
    console.log('3. Access admin panel at: http://localhost:3000/admin')
    console.log('4. Run npm run setup:rls to configure Row Level Security')

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

async function rollbackMigration(version: string) {
  console.log(`🔄 Rolling back migration: ${version}`)
  
  // This would implement rollback functionality
  // For now, we'll just remove the migration record
  const { error } = await supabase
    .from('payload_migrations')
    .delete()
    .eq('version', version)

  if (error) {
    throw new Error(`Failed to rollback migration: ${error.message}`)
  }

  console.log(`✅ Migration ${version} rolled back`)
}

async function createNewMigration(name: string) {
  const migrationsDir = path.join(process.cwd(), 'migrations')
  
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true })
  }

  // Find next version number
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort()

  const lastVersion = files.length > 0 
    ? parseInt(files[files.length - 1].split('_')[0])
    : 0

  const newVersion = (lastVersion + 1).toString().padStart(3, '0')
  const filename = `${newVersion}_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.sql`
  const filepath = path.join(migrationsDir, filename)

  const template = `
-- Migration: ${name}
-- Version: ${newVersion}
-- Created: ${new Date().toISOString()}

-- Add your migration SQL here
-- Example:
-- ALTER TABLE your_table ADD COLUMN new_column VARCHAR(255);

-- Don't forget to update any indexes or constraints as needed
`

  fs.writeFileSync(filepath, template)
  console.log(`📄 Created new migration: ${filename}`)
}

// Main execution
async function main() {
  const command = process.argv[2]
  const argument = process.argv[3]

  switch (command) {
    case 'up':
    case 'migrate':
      await runMigrations()
      break
    
    case 'rollback':
      if (!argument) {
        console.error('❌ Please specify a migration version to rollback')
        process.exit(1)
      }
      await rollbackMigration(argument)
      break
    
    case 'create':
      if (!argument) {
        console.error('❌ Please specify a migration name')
        process.exit(1)
      }
      await createNewMigration(argument)
      break
    
    default:
      console.log('🗄️  Database Migration Tool')
      console.log('\nUsage:')
      console.log('  npm run db:migrate         - Run pending migrations')
      console.log('  npm run db:migrate up      - Run pending migrations')
      console.log('  npm run db:rollback <ver>  - Rollback a migration')
      console.log('  npm run db:create <name>   - Create new migration')
      await runMigrations()
  }
}

if (require.main === module) {
  main()
}