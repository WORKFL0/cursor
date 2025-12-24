#!/usr/bin/env tsx

/**
 * Check if features table exists in Supabase
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

async function checkTable() {
  console.log('🔍 Checking features table...\n')

  try {
    const { data, error } = await supabase
      .from('features')
      .select('id, title, status')
      .limit(5)

    if (error) {
      console.log('❌ Features table does NOT exist or has error:')
      console.log('   Error:', error.message)
      console.log('   Code:', error.code)
      console.log('\n📝 You need to run the features migrations:')
      console.log('   1. Go to: https://supabase.com/dashboard/project/mzmeylvtdvqrbutlbkfu/sql')
      console.log('   2. Run migration: 003_create_features_schema.sql')
      console.log('   3. Run migration: 005_seed_features_data.sql')
    } else {
      console.log(`✅ Features table exists with ${data.length} features:`)
      data.forEach((feature: any) => {
        console.log(`   - ${feature.title} (${feature.status})`)
      })
    }
  } catch (err: any) {
    console.log('❌ Error:', err.message)
  }
}

checkTable().catch(console.error)
