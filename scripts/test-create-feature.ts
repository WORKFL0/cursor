#!/usr/bin/env tsx

/**
 * Test creating a feature via the API
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testCreateFeature() {
  console.log('🧪 Testing feature creation...\n')

  const testFeature = {
    title: 'Test Feature',
    slug: 'test-feature',
    description: 'This is a test feature created via script',
    icon_name: 'Shield',
    category: 'security',
    display_order: 99,
    status: 'draft',
  }

  console.log('Creating feature:', testFeature)

  const { data, error } = await supabase
    .from('features')
    .insert([testFeature])
    .select()
    .single()

  if (error) {
    console.log('\n❌ Error creating feature:')
    console.log('   Message:', error.message)
    console.log('   Code:', error.code)
    console.log('   Details:', error.details)
    console.log('   Hint:', error.hint)
  } else {
    console.log('\n✅ Feature created successfully!')
    console.log('   ID:', data.id)
    console.log('   Title:', data.title)
    console.log('   Status:', data.status)

    // Clean up - delete the test feature
    console.log('\n🧹 Cleaning up test feature...')
    await supabase.from('features').delete().eq('id', data.id)
    console.log('   ✅ Test feature deleted')
  }
}

testCreateFeature().catch(console.error)
