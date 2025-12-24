#!/usr/bin/env tsx

/**
 * Update admin user password in Supabase
 */

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

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

async function updatePassword() {
  console.log('🔐 Updating admin password...\n')

  const email = 'florian@workflo.nl'
  const password = 'workflo2024admin'

  // Generate proper bcrypt hash
  console.log('Generating bcrypt hash...')
  const passwordHash = await bcrypt.hash(password, 10)
  console.log('Hash generated:', passwordHash)

  // Update the user's password
  console.log('\nUpdating password in database...')
  const { data, error } = await supabase
    .from('admin_users')
    .update({ password_hash: passwordHash })
    .eq('email', email)
    .select()

  if (error) {
    console.error('❌ Error updating password:', error.message)
    process.exit(1)
  }

  console.log('✅ Password updated successfully!')
  console.log('\n📝 Login credentials:')
  console.log('   Email:', email)
  console.log('   Password:', password)
  console.log('\n⚠️  IMPORTANT: Change this password after first login!')
}

updatePassword().catch(console.error)
