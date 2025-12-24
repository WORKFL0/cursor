import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, User, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getPublishedPostBySlug, getPublishedPosts } from '@/lib/blog-api'
import type { BlogPostWithRelations } from '@/types/blog'
import { ShareButtons } from '@/components/blog/share-buttons'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: post.meta_title || `${post.title} | Workflo Blog`,
    description: post.meta_description || post.excerpt || '',
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      publishedTime: post.published_at!,
      authors: [post.author?.display_name || 'Workflo Team'],
      images: post.featured_image ? [post.featured_image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || '',
      images: post.featured_image ? [post.featured_image] : [],
    },
  }
}

export async function generateStaticParams() {
  const { posts } = await getPublishedPosts({ limit: 100 })
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export const revalidate = 3600 // Revalidate every hour

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Get related posts
  const { posts: relatedPosts } = await getPublishedPosts({
    category_id: post.category_id || undefined,
    limit: 3,
  })

  const filteredRelatedPosts = relatedPosts.filter(p => p.id !== post.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug naar blog
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <article className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Category & Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {post.category && (
              <Badge
                style={{ borderColor: (post.category as any).color, backgroundColor: `${(post.category as any).color}20` }}
                className="text-sm"
              >
                {(post.category as any).icon} {(post.category as any).name}
              </Badge>
            )}
            {post.tags && post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b">
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.avatar_url && (
                  <img
                    src={post.author.avatar_url}
                    alt={post.author.display_name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author.display_name}
                </span>
              </div>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.published_at!).toLocaleDateString('nl-NL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            {post.read_time_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.read_time_minutes} minuten leestijd
              </span>
            )}
            <span className="flex items-center gap-1">
              👁️ {post.view_count} views
            </span>
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-12 rounded-lg overflow-hidden">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Share Buttons */}
          <ShareButtons slug={post.slug} title={post.title} />

          {/* Author Bio */}
          {post.author && post.author.bio && (
            <Card className="mb-12">
              <CardContent className="py-6">
                <div className="flex gap-4">
                  {post.author.avatar_url && (
                    <img
                      src={post.author.avatar_url}
                      alt={post.author.display_name}
                      className="w-16 h-16 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {post.author.display_name}
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      {post.author.bio}
                    </p>
                    {post.author.linkedin_url && (
                      <Button variant="link" size="sm" asChild className="px-0">
                        <a href={post.author.linkedin_url} target="_blank" rel="noopener noreferrer">
                          Volg op LinkedIn →
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Related Posts */}
        {filteredRelatedPosts.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-8">Gerelateerde Artikelen</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {filteredRelatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow">
                  {relatedPost.featured_image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    {relatedPost.category && (
                      <Badge
                        variant="outline"
                        style={{ borderColor: (relatedPost.category as any).color }}
                        className="text-xs mb-3"
                      >
                        {(relatedPost.category as any).name}
                      </Badge>
                    )}
                    <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Hulp nodig met IT?</h2>
          <p className="text-xl opacity-90 mb-8">
            Workflo helpt Nederlandse bedrijven met managed IT services, cybersecurity en cloud oplossingen
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">
              Neem contact op
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
