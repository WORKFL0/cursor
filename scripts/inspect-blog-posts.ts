#!/usr/bin/env tsx

/**
 * Debug script to inspect blog posts in the database
 * Checks for:
 * - Posts with missing or invalid featured_image URLs
 * - Empty posts without content
 * - Posts that might be causing deletion issues
 */

import { supabase } from '../lib/supabase'

async function inspectBlogPosts() {
    console.log('🔍 Inspecting blog posts...\n')

    try {
        // Fetch all blog posts
        const { data: posts, error } = await supabase
            .from('blog_posts')
            .select('id, title, slug, featured_image, content, status, created_at')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('❌ Error fetching posts:', error)
            return
        }

        if (!posts || posts.length === 0) {
            console.log('📭 No blog posts found in database')
            return
        }

        console.log(`📊 Total posts: ${posts.length}\n`)

        // Analyze posts
        const postsWithoutImages = posts.filter(p => !p.featured_image)
        const postsWithImages = posts.filter(p => p.featured_image)
        const emptyPosts = posts.filter(p => !p.content || p.content.trim().length < 50)
        const draftPosts = posts.filter(p => p.status === 'draft')

        console.log('📈 Statistics:')
        console.log(`  - Posts with images: ${postsWithImages.length}`)
        console.log(`  - Posts without images: ${postsWithoutImages.length}`)
        console.log(`  - Empty/minimal content posts: ${emptyPosts.length}`)
        console.log(`  - Draft posts: ${draftPosts.length}\n`)

        // Show posts without images
        if (postsWithoutImages.length > 0) {
            console.log('🖼️  Posts WITHOUT featured images:')
            postsWithoutImages.forEach(post => {
                console.log(`  - [${post.status}] ${post.title || '(No title)'}`)
                console.log(`    ID: ${post.id}`)
                console.log(`    Slug: ${post.slug || '(No slug)'}`)
                console.log(`    Created: ${new Date(post.created_at).toLocaleDateString('nl-NL')}`)
                console.log('')
            })
        }

        // Show empty posts
        if (emptyPosts.length > 0) {
            console.log('📝 Empty or minimal content posts:')
            emptyPosts.forEach(post => {
                console.log(`  - [${post.status}] ${post.title || '(No title)'}`)
                console.log(`    ID: ${post.id}`)
                console.log(`    Content length: ${post.content?.length || 0} chars`)
                console.log(`    Has image: ${post.featured_image ? 'Yes' : 'No'}`)
                console.log('')
            })
        }

        // Show sample of posts with images
        if (postsWithImages.length > 0) {
            console.log('✅ Sample posts WITH images (first 3):')
            postsWithImages.slice(0, 3).forEach(post => {
                console.log(`  - ${post.title}`)
                console.log(`    Image URL: ${post.featured_image}`)
                console.log(`    Status: ${post.status}`)
                console.log('')
            })
        }

        // Check for potentially problematic URLs
        const brokenImageUrls = postsWithImages.filter(p => {
            const url = p.featured_image || ''
            return !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')
        })

        if (brokenImageUrls.length > 0) {
            console.log('⚠️  Posts with potentially invalid image URLs:')
            brokenImageUrls.forEach(post => {
                console.log(`  - ${post.title}`)
                console.log(`    URL: ${post.featured_image}`)
                console.log('')
            })
        }

    } catch (error) {
        console.error('❌ Unexpected error:', error)
    }
}

// Run the inspection
inspectBlogPosts()
    .then(() => {
        console.log('✅ Inspection complete')
        process.exit(0)
    })
    .catch((error) => {
        console.error('❌ Fatal error:', error)
        process.exit(1)
    })
