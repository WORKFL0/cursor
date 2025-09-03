'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { newsCategories, getArticlesByCategory } from '@/lib/data/news-data'
import { useLanguage, useLocalizedContent } from '@/lib/contexts/language-context'

interface CategoryFilterProps {
  selectedCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const { language } = useLanguage()
  const { getLocalizedValue } = useLocalizedContent()

  const allArticlesCount = newsCategories.reduce((total, category) => 
    total + getArticlesByCategory(category.id).length, 0
  )

  return (
    <div className="flex flex-wrap gap-2">
      {/* All Categories */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          onClick={() => onCategoryChange(null)}
          className="relative"
        >
          {language === 'nl' ? 'Alle artikelen' : 'All articles'}
          <Badge 
            variant="secondary" 
            className="ml-2 text-xs px-1.5 py-0.5"
          >
            {allArticlesCount}
          </Badge>
        </Button>
      </motion.div>

      {/* Category Filters */}
      {newsCategories.map((category, index) => {
        const categoryName = getLocalizedValue(category as any, 'name')
        const articleCount = getArticlesByCategory(category.id).length
        const isSelected = selectedCategory === category.id

        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            <Button
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => onCategoryChange(category.id)}
              className="relative"
              style={isSelected ? {} : {
                borderColor: category.color + '40',
                color: category.color
              }}
            >
              {categoryName}
              {articleCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 text-xs px-1.5 py-0.5"
                  style={isSelected ? {} : {
                    backgroundColor: category.color + '20',
                    color: category.color
                  }}
                >
                  {articleCount}
                </Badge>
              )}
            </Button>
          </motion.div>
        )
      })}
    </div>
  )
}