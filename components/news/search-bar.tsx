'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/language-context'

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  resultsCount?: number
}

export function SearchBar({ searchQuery, onSearchChange, resultsCount }: SearchBarProps) {
  const { language } = useLanguage()
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    onSearchChange('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className={`relative transition-all duration-200 ${
        isFocused ? 'scale-105' : 'scale-100'
      }`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={
            language === 'nl' 
              ? 'Zoek artikelen, tags, of onderwerpen...' 
              : 'Search articles, tags, or topics...'
          }
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-10 pr-10 h-12 text-base"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Results Count */}
      {searchQuery && typeof resultsCount === 'number' && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-muted-foreground"
        >
          {language === 'nl' ? (
            resultsCount === 1 
              ? `${resultsCount} artikel gevonden`
              : `${resultsCount} artikelen gevonden`
          ) : (
            resultsCount === 1 
              ? `${resultsCount} article found`
              : `${resultsCount} articles found`
          )}
          {searchQuery && (
            <span className="ml-1">
              {language === 'nl' ? 'voor' : 'for'} &ldquo;<em>{searchQuery}</em>&rdquo;
            </span>
          )}
        </motion.div>
      )}
      
      {/* Search Suggestions or Quick Tips */}
      <AnimatePresence>
        {isFocused && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-xs text-muted-foreground text-center"
          >
            {language === 'nl' 
              ? 'Tip: Zoek op "cybersecurity", "cloud", "AI" of auteur naam'
              : 'Tip: Try searching for "cybersecurity", "cloud", "AI" or author name'
            }
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}