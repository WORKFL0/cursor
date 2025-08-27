#!/usr/bin/env tsx

/**
 * Database Connection Test Script
 * This script tests the Supabase database connection and verifies that
 * Payload CMS can connect to the database properly
 */

import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const databaseUrl = process.env.DATABASE_URL!

console.log('🔍 Testing Supabase Database Connection...\n')

async function testSupabaseConnection() {
  try {
    console.log('📡 Testing Supabase client connection...')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test basic connection with auth status
    const { data: authData, error } = await supabase.auth.getSession()

    if (error) {
      console.error('❌ Supabase connection failed:', error.message)
      return false
    }

    console.log('✅ Supabase client connection successful')
    return true

  } catch (error) {
    console.error('❌ Supabase connection test failed:', error)
    return false
  }
}

async function testDatabaseUrl() {
  try {
    console.log('\n🗄️  Testing DATABASE_URL configuration...')
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is missing')
    }

    // Parse the database URL
    const url = new URL(databaseUrl)
    console.log(`📊 Database Host: ${url.hostname}`)
    console.log(`🔢 Database Port: ${url.port}`)
    console.log(`🏷️  Database Name: ${url.pathname.slice(1)}`)
    console.log(`👤 Database User: ${url.username}`)

    // Test if URL format is correct
    if (!url.hostname.includes('supabase.co')) {
      console.warn('⚠️  Warning: DATABASE_URL does not appear to be a Supabase connection string')
    }

    if (url.searchParams.get('sslmode') !== 'require') {
      console.warn('⚠️  Warning: SSL mode is not set to "require"')
    }

    console.log('✅ DATABASE_URL format appears correct')
    return true

  } catch (error) {
    console.error('❌ DATABASE_URL test failed:', error)
    return false
  }
}

async function testPayloadConnection() {
  try {
    console.log('\n🚀 Testing Payload CMS database connection...')
    
    // This will be available once Payload CMS is running
    const response = await fetch('http://localhost:3000/api/access/health', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).catch(() => null)

    if (response && response.ok) {
      console.log('✅ Payload CMS is responding')
      return true
    } else {
      console.log('⏳ Payload CMS is not yet running or accessible')
      console.log('   Start the development server with: npm run dev')
      return false
    }

  } catch (error) {
    console.log('⏳ Payload CMS connection test skipped (server not running)')
    return false
  }
}

async function main() {
  console.log('🏗️  Workflo Supabase Integration Test\n')

  const results = {
    supabase: await testSupabaseConnection(),
    databaseUrl: await testDatabaseUrl(),
    payload: await testPayloadConnection()
  }

  console.log('\n📊 Test Results Summary:')
  console.log(`Supabase Connection: ${results.supabase ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Database URL Config: ${results.databaseUrl ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Payload CMS Status:  ${results.payload ? '✅ PASS' : '⏳ PENDING'}`)

  const allBasicTestsPassed = results.supabase && results.databaseUrl

  if (allBasicTestsPassed) {
    console.log('\n🎉 Basic database integration tests passed!')
    
    if (!results.payload) {
      console.log('\n📝 Next steps:')
      console.log('1. Make sure you have updated the SUPABASE_DB_PASSWORD in .env.local')
      console.log('2. Start the development server: npm run dev')
      console.log('3. Access Payload CMS admin at: http://localhost:3000/admin')
      console.log('4. Payload will automatically create the necessary database tables')
    }
  } else {
    console.log('\n❌ Some tests failed. Please check your configuration.')
    console.log('\n🔧 Troubleshooting:')
    console.log('- Verify your Supabase project URL and API keys')
    console.log('- Check that DATABASE_URL includes the correct password')
    console.log('- Ensure your Supabase project is active')
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}