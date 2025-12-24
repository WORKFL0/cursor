#!/usr/bin/env tsx

/**
 * Check if admin tables exist in Supabase
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_service_role!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkTables() {
  console.log('🔍 Checking admin tables in Supabase...\n')

  const tables = ['admin_users', 'admin_sessions', 'admin_invitations', 'admin_activity_log']

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1)

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          console.log(`❌ Table '${table}' does NOT exist`)
        } else {
          console.log(`⚠️  Table '${table}': ${error.message}`)
        }
      } else {
        console.log(`✅ Table '${table}' exists`)
      }
    } catch (err: any) {
      console.log(`❌ Table '${table}': ${err.message}`)
    }
  }

  // Check for admin user
  console.log('\n👤 Checking for admin user...')
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('email, full_name, role')
      .eq('email', 'florian@workflo.nl')
      .single()

    if (error) {
      console.log('❌ Admin user NOT found or table does not exist')
    } else {
      console.log('✅ Admin user found:')
      console.log('   Email:', data.email)
      console.log('   Name:', data.full_name)
      console.log('   Role:', data.role)
    }
  } catch (err: any) {
    console.log('❌ Error checking admin user:', err.message)
  }

  console.log('\n📝 If tables do NOT exist, you need to:')
  console.log('1. Go to: https://supabase.com/dashboard/project/mzmeylvtdvqrbutlbkfu/sql')
  console.log('2. Copy the entire content of: supabase/migrations/007_create_admin_users_schema.sql')
  console.log('3. Paste it in the SQL Editor and click "Run"')
}

checkTables().catch(console.error)
