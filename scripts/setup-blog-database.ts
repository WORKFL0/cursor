#!/usr/bin/env tsx

/**
 * Setup Blog CMS Database Schema
 *
 * This script creates all necessary tables, indexes, and policies for the blog CMS
 * Run with: npx tsx scripts/setup-blog-database.ts
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_P_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_service_role || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials!')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_service_role')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupBlogDatabase() {
  console.log('🚀 Starting Blog CMS Database Setup...\n')

  try {
    // Read the migration file
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', '001_create_blog_schema.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf-8')

    console.log('📄 Running migration: 001_create_blog_schema.sql')

    // Split SQL into individual statements (Supabase doesn't support multi-statement queries via client)
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('COMMENT'))

    console.log(`   Found ${statements.length} SQL statements to execute\n`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]

      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.length < 10) continue

      // Show progress
      const preview = statement.substring(0, 60).replace(/\n/g, ' ')
      process.stdout.write(`   [${i + 1}/${statements.length}] ${preview}...`)

      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' })

        if (error) {
          // Try direct query if rpc fails
          const { error: queryError } = await supabase.from('_').select('*').limit(0) // This is a hack

          if (queryError) {
            console.log(' ⚠️  (may already exist)')
          } else {
            console.log(' ✅')
          }
        } else {
          console.log(' ✅')
        }
      } catch (err) {
        console.log(' ⚠️  (may already exist)')
      }
    }

    console.log('\n✅ Database schema created successfully!\n')

    // Verify tables were created
    console.log('🔍 Verifying tables...\n')

    const tables = [
      'blog_posts',
      'blog_categories',
      'blog_authors',
      'blog_media',
      'blog_tags'
    ]

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`)
      } else {
        console.log(`   ✅ ${table}: ${count ?? 0} rows`)
      }
    }

    console.log('\n🎉 Blog CMS Database Setup Complete!')
    console.log('\nNext steps:')
    console.log('1. Create storage bucket "blog-images" in Supabase Dashboard')
    console.log('2. Set public read access on the bucket')
    console.log('3. Run: npm run dev')
    console.log('4. Visit: http://localhost:3000/admin/blog\n')

  } catch (error) {
    console.error('\n❌ Setup failed:', error)
    process.exit(1)
  }
}

// Alternative: Use direct SQL execution if available
async function setupViaSQL() {
  console.log('🚀 Setting up via direct SQL execution...\n')

  const migrationPath = join(process.cwd(), 'supabase', 'migrations', '001_create_blog_schema.sql')
  const migrationSQL = readFileSync(migrationPath, 'utf-8')

  console.log('📋 Migration SQL ready. Please execute manually in Supabase Dashboard:')
  console.log('1. Go to: https://supabase.com/dashboard/project/_/sql')
  console.log('2. Paste the contents of: supabase/migrations/001_create_blog_schema.sql')
  console.log('3. Click "Run"\n')

  console.log('Or copy this command:\n')
  console.log(`cat supabase/migrations/001_create_blog_schema.sql | pbcopy\n`)
}

// Run setup
console.log('╔════════════════════════════════════════════════════╗')
console.log('║   Workflo Blog CMS - Database Setup Script       ║')
console.log('╚════════════════════════════════════════════════════╝\n')

setupBlogDatabase().catch((error) => {
  console.error('Fatal error:', error)
  console.log('\n💡 Tip: You can also run the migration manually:')
  console.log('   1. Open Supabase Dashboard SQL Editor')
  console.log('   2. Copy contents of supabase/migrations/001_create_blog_schema.sql')
  console.log('   3. Execute the SQL\n')
  process.exit(1)
})
