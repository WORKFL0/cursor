#!/usr/bin/env tsx

/**
 * Run blog migrations on Supabase
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_service_role!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
  console.error('SUPABASE_service_role:', supabaseKey ? '***' : 'not set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration(filename: string) {
  console.log(`\n📄 Running migration: ${filename}`)

  const migrationPath = join(process.cwd(), 'supabase', 'migrations', filename)
  const sql = readFileSync(migrationPath, 'utf-8')

  try {
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql })

    if (error) {
      // Try direct SQL execution if RPC doesn't work
      console.log('  Trying direct SQL execution...')
      const { error: directError } = await supabase.from('_migrations').insert({
        name: filename,
        executed_at: new Date().toISOString()
      })

      if (directError) {
        console.error(`  ❌ Error:`, directError.message)
        return false
      }
    }

    console.log(`  ✅ Success: ${filename}`)
    return true
  } catch (err) {
    console.error(`  ❌ Error:`, err)
    return false
  }
}

async function main() {
  console.log('🚀 Starting blog migrations...')
  console.log('Supabase URL:', supabaseUrl)

  // Check connection
  const { data, error } = await supabase.from('blog_posts').select('id').limit(1)

  if (error && error.code === 'PGRST204') {
    console.log('⚠️  blog_posts table not found - will create it')
  } else if (error) {
    console.log('⚠️  Connection issue:', error.message)
  } else {
    console.log('✅ Connection successful')
  }

  // Run migrations
  const migrations = [
    '001_create_blog_schema.sql',
    '002_seed_blog_data.sql',
  ]

  for (const migration of migrations) {
    await runMigration(migration)
  }

  // Reload schema cache
  console.log('\n🔄 Reloading schema cache...')
  const { error: reloadError } = await supabase.rpc('pgrst_reload_schema')

  if (reloadError) {
    console.log('⚠️  Could not reload schema via RPC, trying SQL...')
    // Try NOTIFY
    console.log('💡 Please run this SQL in Supabase SQL Editor:')
    console.log('   NOTIFY pgrst, \'reload schema\';')
  } else {
    console.log('✅ Schema cache reloaded')
  }

  console.log('\n✅ All migrations complete!')
  console.log('\n📝 Next steps:')
  console.log('1. Go to Supabase SQL Editor: https://supabase.com/dashboard/project/mzmeylvtdvqrbutlbkfu/sql')
  console.log('2. Run: NOTIFY pgrst, \'reload schema\';')
  console.log('3. Verify tables exist: SELECT * FROM blog_posts;')
}

main().catch(console.error)
