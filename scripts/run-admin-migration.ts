#!/usr/bin/env tsx

/**
 * Run admin users migration on Supabase
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

async function runMigration() {
  console.log('🚀 Starting admin users migration...')
  console.log('Supabase URL:', supabaseUrl)

  // Read the migration file
  const migrationPath = join(process.cwd(), 'supabase', 'migrations', '007_create_admin_users_schema.sql')
  const sql = readFileSync(migrationPath, 'utf-8')

  console.log('\n📄 Running migration: 007_create_admin_users_schema.sql')

  // Split SQL into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`  Found ${statements.length} SQL statements`)

  // Execute each statement
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';'

    // Skip comments
    if (statement.trim().startsWith('--') || statement.trim().startsWith('COMMENT')) {
      continue
    }

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement })

      if (error) {
        // Ignore "already exists" errors
        if (error.message.includes('already exists')) {
          console.log(`  ⚠️  Skipped (already exists): Statement ${i + 1}`)
          continue
        }
        console.error(`  ❌ Error in statement ${i + 1}:`, error.message)
      } else {
        console.log(`  ✅ Executed statement ${i + 1}`)
      }
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        console.log(`  ⚠️  Skipped (already exists): Statement ${i + 1}`)
        continue
      }
      console.error(`  ❌ Error in statement ${i + 1}:`, err.message)
    }
  }

  // Verify tables were created
  console.log('\n🔍 Verifying tables...')

  const tables = ['admin_users', 'admin_sessions', 'admin_invitations', 'admin_activity_log']

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('id')
      .limit(1)

    if (error && error.code !== 'PGRST116') {
      console.log(`  ❌ Table ${table}: NOT FOUND`)
    } else {
      console.log(`  ✅ Table ${table}: OK`)
    }
  }

  // Check if admin user was created
  console.log('\n👤 Checking admin user...')
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('email, full_name, role')
    .eq('email', 'florian@workflo.nl')
    .single()

  if (adminError) {
    console.log('  ❌ Admin user not found')
  } else {
    console.log('  ✅ Admin user created:')
    console.log('     Email:', adminUser.email)
    console.log('     Name:', adminUser.full_name)
    console.log('     Role:', adminUser.role)
    console.log('     Password: workflo2024admin (CHANGE THIS AFTER FIRST LOGIN)')
  }

  console.log('\n✅ Migration complete!')
  console.log('\n📝 Next steps:')
  console.log('1. Login at http://localhost:3000/admin/login')
  console.log('2. Email: florian@workflo.nl')
  console.log('3. Password: workflo2024admin')
  console.log('4. IMPORTANT: Change your password after first login!')
}

runMigration().catch(console.error)
