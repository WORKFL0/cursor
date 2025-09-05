'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from '@/lib/framer-motion'
import { Calendar, Clock, User, ArrowRight, Star } from 'lucide-react'
import { NewsArticle, getCategoryById } from '@/lib/data/news-data'
import { useLanguage, useLocalizedContent } from '@/lib/contexts/language-context'
import Link from 'next/link'
import Image from 'next/image'

interface ArticleCardProps {
  article: NewsArticle
  featured?: boolean
  index?: number
}

export function ArticleCard({ article, featured = false, index = 0 }: ArticleCardProps) {
  const { language } = useLanguage()
  const { getLocalizedValue, getLocalizedArray } = useLocalizedContent()
  
  const category = getCategoryById(article.category)
  const title = getLocalizedValue(article as any, 'title')
  const excerpt = getLocalizedValue(article as any, 'excerpt')
  const tags = getLocalizedArray(article as any, 'tags')
  const categoryName = category ? getLocalizedValue(category as any, 'name') : article.category

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className={`h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg ${featured ? 'border-primary/50 shadow-md' : ''}`}>
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-primary text-primary-foreground gap-1">
              <Star className="h-3 w-3" />
              {language === 'nl' ? 'Uitgelicht' : 'Featured'}
            </Badge>
          </div>
        )}

        {/* Article Image */}
        {article.image && (
          <div className={`relative ${featured ? 'h-48' : 'h-40'} overflow-hidden bg-muted`}>
            <Image
              src={article.image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        <CardHeader className={featured ? 'pb-3' : 'pb-2'}>
          {/* Category and Date */}
          <div className="flex items-center justify-between mb-2">
            <Badge 
              variant="outline" 
              style={{ 
                borderColor: category?.color || '#6b7280',
                color: category?.color || '#6b7280'
              }}
              className="text-xs"
            >
              {categoryName}
            </Badge>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>

          {/* Title */}
          <CardTitle className={`line-clamp-2 ${featured ? 'text-xl' : 'text-lg'}`}>
            {title}
          </CardTitle>

          {/* Excerpt */}
          <CardDescription className={`line-clamp-3 ${featured ? 'text-base' : 'text-sm'}`}>
            {excerpt}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between">
          {/* Tags */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, tagIndex) => (
                <Badge 
                  key={tagIndex} 
                  variant="secondary" 
                  className="text-xs px-2 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="space-y-3">
            {/* Reading time and author */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {article.readingTime} {language === 'nl' ? 'min leestijd' : 'min read'}
                </span>
              </div>
            </div>

            {/* Read More Button */}
            <Link href={`/nieuws/${article.slug}`} className="block">
              <Button 
                variant="outline" 
                className="w-full group transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                size={featured ? 'default' : 'sm'}
              >
                <span>{language === 'nl' ? 'Lees meer' : 'Read more'}</span>
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
        {/* Hover overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </Card>
    </motion.div>
  )
}