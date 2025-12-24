import { NextResponse } from 'next/server'
import { ArticleStorage } from '@/lib/storage/article-storage'
import { getMockArticles } from '@/lib/data/mock-articles'

export async function GET() {
  // Get localStorage articles
  const storedArticles = ArticleStorage.getArticles()
  
  // Get mock articles
  const mockArticles = getMockArticles({ limit: 5 })
  
  return NextResponse.json({
    localStorage: {
      count: storedArticles.length,
      articles: storedArticles
    },
    mockData: {
      count: mockArticles.length,
      articles: mockArticles.map(a => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        featured: a.featured,
        published: a.published
      }))
    },
    info: {
      storageKey: 'workflo_cms_articles',
      message: 'Debug info for localStorage and mock data'
    }
  })
}