#!/usr/bin/env tsx

/**
 * Check all CMS tables in Supabase
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

async function checkAllTables() {
  console.log('🔍 Checking all CMS tables in Supabase...\n')

  const tables = [
    { name: 'blog_posts', display: 'Blog Posts' },
    { name: 'features', display: 'Features' },
    { name: 'case_studies', display: 'Case Studies' },
    { name: 'admin_users', display: 'Admin Users' },
  ]

  for (const table of tables) {
    console.log(`📋 ${table.display} (${table.name}):`)

    try {
      const { data, error, count } = await supabase
        .from(table.name)
        .select('*', { count: 'exact', head: false })
        .limit(3)

      if (error) {
        console.log(`   ❌ Error: ${error.message}`)
        console.log(`   Code: ${error.code}\n`)
      } else {
        console.log(`   ✅ Table exists with ${count} total records`)
        if (data && data.length > 0) {
          console.log(`   📝 First ${data.length} records:`)
          data.forEach((record: any, i: number) => {
            const title = record.title || record.client_name || record.email || record.name || 'Unknown'
            const status = record.status || 'N/A'
            console.log(`      ${i + 1}. ${title} (${status})`)
          })
        }
        console.log()
      }
    } catch (err: any) {
      console.log(`   ❌ Exception: ${err.message}\n`)
    }
  }

  console.log('\n📊 Summary:')
  console.log('If you see "schema cache" errors, the tables need to be created.')
  console.log('If tables exist but have 0 records, the seed migrations need to be run.')
}

checkAllTables().catch(console.error)
