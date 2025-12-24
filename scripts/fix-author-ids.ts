/**
 * Fix missing author_id in blog posts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mzmeylvtdvqrbutlbkfu.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_service_role || ''
const AUTHOR_ID = 'b07398bf-9ad4-4a44-8d54-66d6974a6f20'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixAuthorIds() {
  console.log('🔧 Fixing missing author_ids...\n')

  // Find posts with null author_id
  const { data: postsWithoutAuthor, error: findError } = await supabase
    .from('blog_posts')
    .select('id, title, author_id')
    .is('author_id', null)

  if (findError) {
    console.error('❌ Error finding posts:', findError)
    return
  }

  console.log(`Found ${postsWithoutAuthor?.length || 0} posts without author_id\n`)

  if (!postsWithoutAuthor || postsWithoutAuthor.length === 0) {
    console.log('✅ All posts already have author_id!')
    return
  }

  // Update all posts to have the correct author_id
  const { data: updated, error: updateError } = await supabase
    .from('blog_posts')
    .update({ author_id: AUTHOR_ID })
    .is('author_id', null)
    .select('id, title')

  if (updateError) {
    console.error('❌ Error updating posts:', updateError)
    return
  }

  console.log(`✅ Updated ${updated?.length || 0} posts with author_id: ${AUTHOR_ID}\n`)

  updated?.forEach((post, i) => {
    console.log(`${i + 1}. ${post.title}`)
  })

  console.log('\n🎉 Done! Posts should now be visible on the blog page.')
}

fixAuthorIds()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
