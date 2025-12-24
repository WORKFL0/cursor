import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { newsArticles, getCategoryById, getRecentArticles } from '@/lib/data/news-data'
import { ArticlePageClient } from './article-page-client'
import { Metadata } from 'next'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

// This would normally be async, but for demo purposes we'll make it sync
async function getArticle(slug: string) {
  return newsArticles.find(article => article.slug === slug)
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  
  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: `${article.title} | Workflo News`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt.toISOString(),
      authors: [article.author],
      images: article.image ? [{ url: article.image }] : [],
    },
  }
}

export async function generateStaticParams() {
  return newsArticles.map((article) => ({
    slug: article.slug,
  }))
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const category = getCategoryById(article.category)
  const relatedArticles = getRecentArticles(3).filter(a => a.id !== article.id)

  return (
    <ArticlePageClient 
      article={article}
      category={category}
      relatedArticles={relatedArticles}
    />
  )
}