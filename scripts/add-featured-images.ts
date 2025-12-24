/**
 * Script to add featured images to existing blog posts that don't have them
 * Run with: ADMIN_TOKEN=fFlH4rqhvQrRnScrZQnYW5rYYaRmYvYoLbiFRWjImy7v1m9OEuUbicgkfvJMGWW9 npx tsx scripts/add-featured-images.ts
 */

const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
const token = process.env.ADMIN_TOKEN

if (!token) {
  console.error('❌ Error: ADMIN_TOKEN environment variable is required')
  console.log('Usage: ADMIN_TOKEN=your_token npx tsx scripts/add-featured-images.ts')
  process.exit(1)
}

// Category-based featured images
function getFeaturedImage(tags: string[]): string {
  // Check tags to determine appropriate image
  if (tags.some(tag => tag.toLowerCase().includes('cyber') || tag.toLowerCase().includes('beveiliging'))) {
    return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop'
  }

  if (tags.some(tag => tag.toLowerCase().includes('ai') || tag.toLowerCase().includes('innovatie'))) {
    return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop'
  }

  if (tags.some(tag => tag.toLowerCase().includes('cloud'))) {
    return 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&h=630&fit=crop'
  }

  if (tags.some(tag => tag.toLowerCase().includes('tech') || tag.toLowerCase().includes('microsoft') || tag.toLowerCase().includes('google'))) {
    return 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop'
  }

  // Default IT Tips image
  return 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=630&fit=crop'
}

async function addFeaturedImages() {
  try {
    console.log('🔍 Fetching blog posts without featured images...\n')

    // Get all blog posts
    const response = await fetch(`${baseUrl}/api/admin/blog`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`)
    }

    const { posts } = await response.json()

    // Filter posts without featured images
    const postsWithoutImages = posts.filter((post: any) => !post.featured_image)

    console.log(`Found ${postsWithoutImages.length} posts without featured images`)
    console.log(`Total posts: ${posts.length}\n`)

    if (postsWithoutImages.length === 0) {
      console.log('✅ All posts already have featured images!')
      return
    }

    let updated = 0
    let errors = 0

    for (const post of postsWithoutImages) {
      try {
        const featuredImage = getFeaturedImage(post.tags || [])

        console.log(`Updating: "${post.title}"`)
        console.log(`  Tags: ${post.tags?.join(', ') || 'none'}`)
        console.log(`  Image: ${featuredImage}`)

        // Update the post with featured image
        const updateResponse = await fetch(`${baseUrl}/api/admin/blog/${post.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            featured_image: featuredImage
          })
        })

        if (!updateResponse.ok) {
          throw new Error(`Failed to update post: ${updateResponse.statusText}`)
        }

        console.log(`  ✅ Updated successfully\n`)
        updated++
      } catch (error: any) {
        console.error(`  ❌ Error updating "${post.title}": ${error.message}\n`)
        errors++
      }
    }

    console.log('\n=== Update Summary ===')
    console.log(`✅ Successfully updated: ${updated}`)
    console.log(`❌ Errors: ${errors}`)
    console.log(`Total processed: ${postsWithoutImages.length}`)
    console.log('\nUpdate completed!')
  } catch (error: any) {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  }
}

addFeaturedImages()
