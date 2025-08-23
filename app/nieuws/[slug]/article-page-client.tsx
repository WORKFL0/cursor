'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, User, ArrowLeft, Share2, BookOpen } from 'lucide-react'
import { NewsArticle, NewsCategory } from '@/lib/data/news-data'
import { ArticleCard } from '@/components/news/article-card'
import Link from 'next/link'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'

interface ArticlePageClientProps {
  article: NewsArticle
  category: NewsCategory | undefined
  relatedArticles: NewsArticle[]
}

export function ArticlePageClient({ 
  article, 
  category, 
  relatedArticles 
}: ArticlePageClientProps) {
  const { toast } = useToast()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: 'Link gekopieerd',
          description: 'De link naar dit artikel is gekopieerd naar het klembord.',
        })
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: 'Link gekopieerd',
          description: 'De link naar dit artikel is gekopieerd naar het klembord.',
        })
      } catch (err) {
        console.log('Error copying to clipboard:', err)
        toast({
          title: 'Fout bij delen',
          description: 'Het kopiëren van de link is mislukt.',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Back Navigation */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <Link href="/nieuws">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Terug naar nieuws
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Category and Metadata */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge 
              variant="outline"
              style={{ 
                borderColor: category?.color || '#6b7280',
                color: category?.color || '#6b7280'
              }}
            >
              {category?.nameNL || article.category}
            </Badge>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{article.readingTime} min leestijd</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
            </div>

            <div className="ml-auto">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Delen
              </Button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            {article.titleNL}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {article.excerptNL}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tagsNL.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {article.image && (
        <section className="px-4 mb-12">
          <div className="container mx-auto max-w-4xl">
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
              <Image
                src={article.image}
                alt={article.titleNL}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="px-4 mb-12">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-8">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground"
                dangerouslySetInnerHTML={{ 
                  __html: article.contentNL.replace(/\n/g, '<br />') 
                }}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Article Footer */}
      <section className="px-4 mb-12">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-2">Vond je dit artikel interessant?</h3>
                  <p className="text-sm text-muted-foreground">
                    Volg ons voor meer IT-tips en bedrijfsupdates.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href="/nieuws">
                    <Button variant="outline" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Meer artikelen
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="sm">
                      Contact opnemen
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Gerelateerde Artikelen</h2>
              <p className="text-muted-foreground">
                Meer interessante artikelen die je misschien wilt lezen
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle, index) => (
                <ArticleCard
                  key={relatedArticle.id}
                  article={relatedArticle}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}