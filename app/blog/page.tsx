import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getPublishedPosts, getCategories } from '@/lib/blog-api'
import type { BlogPostWithRelations } from '@/types/blog'
import { BlogNewsletterCTA } from '@/components/blog/blog-newsletter-cta'

export const metadata: Metadata = {
  title: 'Blog | Workflo - IT Tips & Cybersecurity Nieuws',
  description: 'Blijf op de hoogte van de laatste IT trends, cybersecurity dreigingen en praktische tips voor Nederlandse bedrijven.',
  openGraph: {
    title: 'Workflo Blog - IT Tips & Cybersecurity Nieuws',
    description: 'Blijf op de hoogte van de laatste IT trends, cybersecurity dreigingen en praktische tips.',
    type: 'website',
  },
}

export const revalidate = 300 // Revalidate every 5 minutes

export default async function BlogPage() {
  const { posts } = await getPublishedPosts({ limit: 20 })
  const categories = await getCategories()

  const featuredPost = posts[0]
  const regularPosts = posts.slice(1)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-transparent py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Workflo Blog</h1>
            <p className="text-xl text-muted-foreground">
              IT inzichten, cybersecurity updates en praktische tips voor Nederlandse bedrijven
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="cursor-pointer">
              Alle artikelen
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant="outline"
                className="cursor-pointer"
                style={{ borderColor: category.color }}
              >
                {category.icon} {category.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      {posts.length === 0 ? (
        /* Empty State */
        <section className="py-24">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto text-center p-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Tag className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Binnenkort beschikbaar</h2>
              <p className="text-muted-foreground mb-8">
                We zijn bezig met het schrijven van interessante artikelen over IT, cybersecurity en productiviteit.
                Meld je aan voor onze nieuwsbrief om als eerste op de hoogte te zijn!
              </p>
              <Button asChild>
                <Link href="/contact">
                  Neem contact op
                </Link>
              </Button>
            </Card>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Post */}
          {featuredPost && (
            <section className="py-12">
              <div className="container mx-auto px-4">
                <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredPost.featured_image && (
                      <div className="relative h-64 md:h-full">
                        <img
                          src={featuredPost.featured_image}
                          alt={featuredPost.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className="bg-primary">Featured</Badge>
                        {featuredPost.category && (
                          <Badge
                            variant="outline"
                            style={{ borderColor: (featuredPost.category as any).color }}
                          >
                            {(featuredPost.category as any).icon} {(featuredPost.category as any).name}
                          </Badge>
                        )}
                      </div>
                      <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
                      <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(featuredPost.published_at!).toLocaleDateString('nl-NL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        {featuredPost.read_time_minutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {featuredPost.read_time_minutes} min
                          </span>
                        )}
                      </div>
                      <Button asChild>
                        <Link href={`/blog/${featuredPost.slug}`}>
                          Lees meer <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </section>
          )}

          {/* Recent Posts Grid */}
          {regularPosts.length > 0 && (
            <section className="py-12 bg-muted/30">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-8">Recente Artikelen</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Newsletter CTA */}
      <BlogNewsletterCTA />
    </div>
  )
}

function BlogPostCard({ post }: { post: BlogPostWithRelations }) {
  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow h-full">
      {post.featured_image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          {post.category && (
            <Badge
              variant="outline"
              style={{ borderColor: (post.category as any).color }}
              className="text-xs"
            >
              {(post.category as any).icon} {(post.category as any).name}
            </Badge>
          )}
        </div>
        <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </CardDescription>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(post.published_at!).toLocaleDateString('nl-NL', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
          {post.read_time_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.read_time_minutes} min
            </span>
          )}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
