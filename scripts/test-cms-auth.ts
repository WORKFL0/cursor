#!/usr/bin/env tsx
/**
 * Test script to check CMS authentication and create admin user
 */

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Checking environment variables...')
console.log('Supabase URL:', supabaseUrl ? '✅ Found' : '❌ Missing')
console.log('Service Role Key:', supabaseServiceRoleKey ? '✅ Found' : '❌ Missing')

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables!')
  console.log('\n📝 Make sure your .env.local contains:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co')
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testConnection() {
  console.log('\n🔄 Testing database connection...')
  
  try {
    // Test connection by checking if cms_users table exists
    const { data, error } = await supabase
      .from('cms_users')
      .select('count')
      .limit(1)
    
    if (error) {
      if (error.message.includes('relation "public.cms_users" does not exist')) {
        console.error('❌ Table "cms_users" does not exist!')
        console.log('📝 Please run the SQL migration first:')
        console.log('   1. Go to your Supabase dashboard')
        console.log('   2. Open SQL Editor')
        console.log('   3. Run the migration from: /supabase/migrations/003_simple_cms_schema.sql')
        return false
      }
      throw error
    }
    
    console.log('✅ Database connection successful!')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

async function listUsers() {
  console.log('\n📋 Listing existing users...')
  
  const { data, error } = await supabase
    .from('cms_users')
    .select('id, email, username, role, is_active')
  
  if (error) {
    console.error('❌ Failed to list users:', error.message)
    return
  }
  
  if (!data || data.length === 0) {
    console.log('📭 No users found in database')
    return
  }
  
  console.log(`\n📊 Found ${data.length} user(s):`)
  data.forEach(user => {
    console.log(`   - ${user.email} (${user.username}) - Role: ${user.role} - Active: ${user.is_active}`)
  })
}

async function createAdminUser() {
  console.log('\n👤 Creating admin user...')
  
  const email = 'admin@workflo.it'
  const username = 'admin'
  const password = 'Admin123!'
  
  // Check if user already exists
  const { data: existing } = await supabase
    .from('cms_users')
    .select('id, email')
    .eq('email', email)
    .single()
  
  if (existing) {
    console.log(`ℹ️  User ${email} already exists`)
    
    // Update the password
    const hashedPassword = await bcrypt.hash(password, 12)
    const { error: updateError } = await supabase
      .from('cms_users')
      .update({ 
        password_hash: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
    
    if (updateError) {
      console.error('❌ Failed to update password:', updateError.message)
    } else {
      console.log('✅ Password updated successfully!')
    }
    return
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)
  
  // Create new user
  const { data, error } = await supabase
    .from('cms_users')
    .insert({
      email,
      username,
      password_hash: hashedPassword,
      role: 'admin',
      first_name: 'Admin',
      last_name: 'User',
      is_active: true
    })
    .select()
    .single()
  
  if (error) {
    console.error('❌ Failed to create user:', error.message)
    return
  }
  
  console.log('✅ Admin user created successfully!')
  console.log(`   Email: ${email}`)
  console.log(`   Password: ${password}`)
}

async function testLogin() {
  console.log('\n🔐 Testing login...')
  
  const email = 'admin@workflo.it'
  const password = 'Admin123!'
  
  // Get user from database
  const { data: user, error } = await supabase
    .from('cms_users')
    .select('*')
    .eq('email', email)
    .single()
  
  if (error || !user) {
    console.error('❌ User not found:', error?.message)
    return
  }
  
  // Verify password
  const isValid = await bcrypt.compare(password, user.password_hash)
  
  if (isValid) {
    console.log('✅ Login test successful!')
    console.log(`   User ID: ${user.id}`)
    console.log(`   Role: ${user.role}`)
  } else {
    console.error('❌ Invalid password!')
  }
}

async function main() {
  console.log('🚀 CMS Authentication Test Script')
  console.log('==================================')
  
  // Test connection
  const connected = await testConnection()
  if (!connected) {
    process.exit(1)
  }
  
  // List users
  await listUsers()
  
  // Create/update admin user
  await createAdminUser()
  
  // Test login
  await testLogin()
  
  console.log('\n✨ Test completed!')
  console.log('\n📝 You can now login at: http://localhost:3000/cms/login')
  console.log('   Email: admin@workflo.it')
  console.log('   Password: Admin123!')
}

main().catch(console.error)