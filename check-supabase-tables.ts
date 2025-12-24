import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_P_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_service_role || process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function checkTables() {
  console.log('🔍 Checking Supabase connection...\n')
  console.log('URL:', SUPABASE_URL)
  console.log('Service Key:', SUPABASE_SERVICE_KEY ? '✓ Present' : '✗ Missing')
  console.log('\n---\n')

  // Try to query blog_categories
  console.log('Checking blog_categories table...')
  const { data: categories, error: catError } = await supabase
    .from('blog_categories')
    .select('*')
    .limit(5)

  if (catError) {
    console.error('❌ Error:', catError)
  } else {
    console.log('✅ Success! Found', categories?.length, 'categories')
    console.log(categories)
  }

  console.log('\n---\n')

  // Try to query blog_posts
  console.log('Checking blog_posts table...')
  const { data: posts, error: postsError } = await supabase
    .from('blog_posts')
    .select('*')
    .limit(5)

  if (postsError) {
    console.error('❌ Error:', postsError)
  } else {
    console.log('✅ Success! Found', posts?.length, 'posts')
    console.log(posts)
  }
}

checkTables()
