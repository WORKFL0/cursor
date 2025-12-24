/**
 * Debug why blog posts aren't visible
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mzmeylvtdvqrbutlbkfu.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// This is what the blog page uses (anon key, not service role)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function debugVisibility() {
  console.log('🔍 Testing blog visibility with ANON key (like the website does)...\n')

  // Test 1: Exact query from blog page
  console.log('TEST 1: Exact query from getPublishedPosts()\n')

  const { data, error, count } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:blog_authors(*),
      category:blog_categories(*)
    `, { count: 'exact' })
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('❌ Error:', error)
    console.error('\nThis is likely the problem!')

    if (error.code === 'PGRST301') {
      console.error('\n🔐 PERMISSION ISSUE!')
      console.error('The anon role cannot read blog_posts table!')
      console.error('\nYou need to enable Row Level Security (RLS) policies.')
    }

    return
  }

  console.log(`✅ Query succeeded!`)
  console.log(`📊 Found ${count} total posts`)
  console.log(`📄 Returned ${data?.length || 0} posts in this page\n`)

  if (data && data.length > 0) {
    console.log('Sample posts:')
    data.slice(0, 5).forEach((post, i) => {
      console.log(`${i + 1}. ${post.title}`)
      console.log(`   Author: ${post.author?.display_name || 'MISSING'}`)
      console.log(`   Category: ${post.category?.name || 'none'}`)
    })
  } else {
    console.log('❌ No posts returned!')
    console.log('\nLikely causes:')
    console.log('1. RLS (Row Level Security) is blocking anonymous access')
    console.log('2. Policies need to be created for blog_posts, blog_authors, blog_categories')
  }

  // Test 2: Check RLS status
  console.log('\n\nTEST 2: Check if RLS is enabled\n')

  const { data: tables } = await supabase
    .from('pg_tables')
    .select('tablename, rowsecurity')
    .in('tablename', ['blog_posts', 'blog_authors', 'blog_categories'])

  console.log('Table RLS status:', tables)
}

debugVisibility()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
