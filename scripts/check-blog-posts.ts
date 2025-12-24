/**
 * Check blog posts in database - diagnostic script
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mzmeylvtdvqrbutlbkfu.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_service_role || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function checkBlogPosts() {
  console.log('🔍 Checking blog posts...\n')

  // Check total count
  const { data: allPosts, error: countError, count } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })

  console.log(`📊 Total blog posts in database: ${count}`)

  // Check posts by status
  const { data: published } = await supabase
    .from('blog_posts')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published')

  const { data: draft } = await supabase
    .from('blog_posts')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'draft')

  console.log(`✅ Published posts: ${published?.length || 0}`)
  console.log(`📝 Draft posts: ${draft?.length || 0}\n`)

  // Get recent posts with details
  const { data: recentPosts, error } = await supabase
    .from('blog_posts')
    .select('id, title, status, published_at, created_at, author_id')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('❌ Error fetching posts:', error)
    return
  }

  console.log('📝 Recent posts:\n')
  recentPosts?.forEach((post, i) => {
    const pubDate = post.published_at ? new Date(post.published_at) : null
    const now = new Date()
    const isFuture = pubDate && pubDate > now

    console.log(`${i + 1}. ${post.title}`)
    console.log(`   Status: ${post.status}`)
    console.log(`   Published: ${post.published_at || 'NOT SET'}`)
    console.log(`   Author ID: ${post.author_id}`)

    if (isFuture) {
      console.log(`   ⚠️  FUTURE DATE - won't show on blog (${Math.ceil((pubDate.getTime() - now.getTime()) / 60000)} minutes in future)`)
    }

    console.log('')
  })

  // Check authors exist
  const { data: authors, error: authorsError } = await supabase
    .from('blog_authors')
    .select('id, display_name, is_active')

  console.log(`👤 Authors in database: ${authors?.length || 0}`)
  authors?.forEach(author => {
    console.log(`   - ${author.display_name} (${author.id}) ${author.is_active ? '✅' : '❌ INACTIVE'}`)
  })

  // Check if posts have valid author references
  const { data: orphanedPosts } = await supabase
    .from('blog_posts')
    .select('id, title, author_id')
    .not('author_id', 'in', `(${authors?.map(a => `'${a.id}'`).join(',') || "''"}))`)

  if (orphanedPosts && orphanedPosts.length > 0) {
    console.log(`\n⚠️  ${orphanedPosts.length} posts with invalid author_id:`)
    orphanedPosts.forEach(post => {
      console.log(`   - "${post.title}" (author_id: ${post.author_id})`)
    })
  }

  // Check what would be returned by getPublishedPosts
  const { data: visiblePosts, error: visibleError } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:blog_authors(*),
      category:blog_categories(*)
    `)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())

  console.log(`\n🌐 Posts visible on public blog page: ${visiblePosts?.length || 0}`)

  if (visiblePosts && visiblePosts.length > 0) {
    console.log('\nVisible posts:')
    visiblePosts.forEach((post, i) => {
      console.log(`${i + 1}. ${post.title}`)
    })
  } else {
    console.log('\n❌ No posts would be visible on blog page!')
    console.log('\nTroubleshooting:')
    console.log('1. Check if published_at is in the past (not future)')
    console.log('2. Check if status = "published"')
    console.log('3. Check if author_id references exist in blog_authors')
    console.log('4. Check if category_id references exist in blog_categories (if set)')
  }
}

checkBlogPosts()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
