/**
 * Fix future publication dates on RSS posts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mzmeylvtdvqrbutlbkfu.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16bWV5bHZ0ZHZxcmJ1dGxia2Z1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI4MjU2OSwiZXhwIjoyMDcxODU4NTY5fQ.Ag3YBn9NHtppC1j00OEc-VbNrsDmq5PFhoDdEzGn1CM'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function fixFutureDates() {
  console.log('🔧 Fixing future publication dates...\n')

  const now = new Date()
  console.log(`Current date: ${now.toISOString()}\n`)

  // Find posts with future dates
  const { data: futurePosts, error: findError } = await supabase
    .from('blog_posts')
    .select('id, title, published_at')
    .gt('published_at', now.toISOString())
    .order('published_at', { ascending: false })

  if (findError) {
    console.error('❌ Error finding posts:', findError)
    return
  }

  console.log(`Found ${futurePosts?.length || 0} posts with future dates\n`)

  if (!futurePosts || futurePosts.length === 0) {
    console.log('✅ All posts have valid dates!')
    return
  }

  // Show what we found
  console.log('Posts with future dates:')
  futurePosts.forEach((post, i) => {
    const futureDate = new Date(post.published_at!)
    const daysInFuture = Math.ceil((futureDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    console.log(`${i + 1}. ${post.title}`)
    console.log(`   Published: ${post.published_at} (${daysInFuture} days in future)`)
  })

  console.log('\n⚙️  Updating all future dates to NOW...\n')

  // Update all future posts to current time, but spread them out over the last 24 hours
  const updates = futurePosts.map((post, index) => {
    // Spread posts over last 24 hours (newest first)
    const minutesAgo = index * 5  // 5 minutes apart
    const publishedAt = new Date(now.getTime() - minutesAgo * 60 * 1000)

    return supabase
      .from('blog_posts')
      .update({ published_at: publishedAt.toISOString() })
      .eq('id', post.id)
  })

  const results = await Promise.all(updates)

  const errors = results.filter(r => r.error)
  if (errors.length > 0) {
    console.error('❌ Some updates failed:', errors)
    return
  }

  console.log(`✅ Updated ${futurePosts.length} posts!`)
  console.log('\nPosts are now spread over the last 24 hours.')
  console.log('They should now be visible on the blog page! 🎉')
}

fixFutureDates()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
