/**
 * Check blog posts in BOTH Supabase databases
 */

import { createClient } from '@supabase/supabase-js'

// Database 1: Main website database (mzmeylvtdvqrbutlbkfu)
const DB1_URL = 'https://mzmeylvtdvqrbutlbkfu.supabase.co'
const DB1_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16bWV5bHZ0ZHZxcmJ1dGxia2Z1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI4MjU2OSwiZXhwIjoyMDcxODU4NTY5fQ.Ag3YBn9NHtppC1j00OEc-VbNrsDmq5PFhoDdEzGn1CM'

// Database 2: Old database (wmaslwvesxtzmllxngoe)
const DB2_URL = 'https://wmaslwvesxtzmllxngoe.supabase.co'
const DB2_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtYXNsaXd2ZXN4dHptbHhuZ29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5MzI3ODUsImV4cCI6MjA3MTUwODc4NX0.L_8IX1l6sf_nwe_3bPwW_eszsjV2C-RMyRJFIueXQXU'

const db1 = createClient(DB1_URL, DB1_KEY)
const db2 = createClient(DB2_URL, DB2_KEY)

async function checkDatabases() {
  console.log('🔍 Checking BOTH Supabase databases...\n')

  // Check Database 1 (main website)
  console.log('=' .repeat(60))
  console.log('DATABASE 1: mzmeylvtdvqrbutlbkfu (MAIN WEBSITE)')
  console.log('=' .repeat(60))

  const { data: db1Posts, error: db1Error, count: db1Count } = await db1
    .from('blog_posts')
    .select('id, title, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(5)

  if (db1Error) {
    console.error('❌ Error:', db1Error.message)
  } else {
    console.log(`✅ Total posts: ${db1Count}`)
    console.log('\nRecent posts:')
    db1Posts?.forEach((post, i) => {
      console.log(`${i + 1}. ${post.title}`)
      console.log(`   Created: ${post.created_at}`)
    })
  }

  // Check Database 2 (old)
  console.log('\n' + '=' .repeat(60))
  console.log('DATABASE 2: wmaslwvesxtzmllxngoe (OLD DATABASE)')
  console.log('=' .repeat(60))

  const { data: db2Posts, error: db2Error, count: db2Count } = await db2
    .from('blog_posts')
    .select('id, title, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(5)

  if (db2Error) {
    console.error('❌ Error:', db2Error.message)
  } else {
    console.log(`✅ Total posts: ${db2Count}`)
    console.log('\nRecent posts:')
    db2Posts?.forEach((post, i) => {
      console.log(`${i + 1}. ${post.title}`)
      console.log(`   Created: ${post.created_at}`)
    })
  }

  // Summary
  console.log('\n' + '=' .repeat(60))
  console.log('SUMMARY')
  console.log('=' .repeat(60))
  console.log(`Database 1 (WEBSITE): ${db1Count} posts`)
  console.log(`Database 2 (OLD):     ${db2Count} posts`)
  console.log('\nThe N8N workflow should write to Database 1!')
  console.log('Check N8N Supabase credential to make sure it points to:')
  console.log(`  URL: ${DB1_URL}`)
}

checkDatabases()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
