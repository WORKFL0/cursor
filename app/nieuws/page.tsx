'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from '@/lib/framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Newspaper, Rss, TrendingUp, Calendar, Filter, ExternalLink, Linkedin, RefreshCw, AlertCircle } from 'lucide-react'
import { ArticleCard } from '@/components/news/article-card'
import { CategoryFilter } from '@/components/news/category-filter'
import { SearchBar } from '@/components/news/search-bar'
import { SkeletonLoader, ExternalNewsSkeletonLoader } from '@/components/news/skeleton-loader'
import { ErrorBoundary } from '@/components/shared/error-boundary'
import { 
  newsArticles as staticNewsArticles, 
  getFeaturedArticles, 
  getRecentArticles, 
  getArticlesByCategory, 
  searchArticles 
} from '@/lib/data/news-data'
import { Article } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/contexts/language-context'

interface ExternalNewsItem {
  id: string
  title: string
  excerpt: string
  url: string
  publishedAt: Date
  source: string
  category: string
  type: 'rss' | 'linkedin'
}

export default function NewsPage() {
  const { language } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('workflo')
  const [externalNews, setExternalNews] = useState<ExternalNewsItem[]>([])
  const [isLoadingExternal, setIsLoadingExternal] = useState(false)
  const [isLoadingWorkflo, setIsLoadingWorkflo] = useState(true)
  const [externalError, setExternalError] = useState<string | null>(null)
  const [cmsArticles, setCmsArticles] = useState<Article[]>([])
  const [newsArticles, setNewsArticles] = useState(staticNewsArticles)

  // Filter and search articles
  const filteredArticles = useMemo(() => {
    let articles = newsArticles

    // Apply category filter
    if (selectedCategory) {
      articles = articles.filter(article => article.category === selectedCategory)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      articles = articles.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Sort by publication date (newest first)
    return articles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
  }, [newsArticles, selectedCategory, searchQuery])

  const featuredArticles = useMemo(() => 
    newsArticles.filter(article => article.featured).slice(0, 3),
    [newsArticles]
  )
  
  const recentArticles = useMemo(() => 
    newsArticles.slice(0, 3),
    [newsArticles]
  )

  // Fetch CMS articles on mount
  useEffect(() => {
    const fetchCMSArticles = async () => {
      try {
        // Fetch from Supabase-backed API
        const response = await fetch('/api/cms/articles?published=true&limit=50&orderBy=published_at&orderDirection=desc')
        
        if (response.ok) {
          const data = await response.json()
          console.log('Supabase CMS Response:', data) // Debug log
          
          if (data.success && data.data && Array.isArray(data.data)) {
            // Convert Supabase articles to the format used by the news page
            const convertedArticles = data.data.map((article: Article) => ({
              id: article.id || '',
              title: article.title,
              titleNL: article.title_nl || article.title,
              excerpt: article.excerpt || '',
              excerptNL: article.excerpt_nl || article.excerpt || '',
              content: article.content || '',
              contentNL: article.content_nl || article.content || '',
              category: article.category || 'Nieuws',
              tags: article.tags || [],
              author: article.author || 'Workflo Team',
              publishedAt: new Date(article.published_at || article.created_at || new Date()),
              readTime: Math.max(1, Math.ceil((article.content?.length || 0) / 1000)), // Rough reading time calculation
              readingTime: Math.max(1, Math.ceil((article.content?.length || 0) / 1000)),
              image: article.image_url,
              featured: article.featured || false,
              slug: article.slug
            }))
            
            console.log('Converted Supabase articles:', convertedArticles) // Debug log
            
            // Merge Supabase articles with static articles, prioritizing Supabase content
            const allArticles = [...convertedArticles, ...staticNewsArticles]
            setNewsArticles(allArticles)
            setCmsArticles(data.data)
            
            // Show success message if using database
            if (!data.message?.includes('mock')) {
              console.log('Successfully loaded articles from Supabase database')
            }
          } else if (data.data && Array.isArray(data.data)) {
            // Handle mock data fallback
            console.log('Using fallback data:', data.message)
            const convertedMockArticles = data.data.map((article: any) => ({
              id: article.id || '',
              title: article.title,
              titleNL: article.titleNL || article.title,
              excerpt: article.excerpt || '',
              excerptNL: article.excerptNL || article.excerpt || '',
              content: article.content || '',
              contentNL: article.contentNL || article.content || '',
              category: article.category || 'Nieuws',
              tags: article.tags || [],
              author: article.author || 'Workflo Team',
              publishedAt: new Date(article.publishedAt || new Date()),
              readTime: article.readTime || 5,
              readingTime: article.readingTime || article.readTime || 5,
              image: article.image,
              featured: article.featured || false,
              slug: article.slug
            }))
            
            const allArticles = [...convertedMockArticles, ...staticNewsArticles]
            setNewsArticles(allArticles)
          }
        } else {
          throw new Error(`API returned ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        console.error('Supabase API failed, using static articles only:', error)
        
        // Fallback to static articles only
        setNewsArticles(staticNewsArticles)
        
        // Optional: Try localStorage as last resort
        try {
          const { ArticleStorage } = await import('@/lib/storage/article-storage')
          const storedArticles = ArticleStorage.searchArticles({ published: true })
          
          if (storedArticles.articles.length > 0) {
            const convertedArticles = storedArticles.articles.map((article: any) => ({
              id: article.id || '',
              title: article.title,
              titleNL: article.titleNL || article.title,
              excerpt: article.excerpt || '',
              excerptNL: article.excerptNL || article.excerpt || '',
              content: article.content || '',
              contentNL: article.contentNL || article.content || '',
              category: article.category || 'Nieuws',
              tags: article.tags || [],
              author: article.author || 'Workflo Team',
              publishedAt: new Date(article.publishedAt || article.published_at || article.created_at || new Date()),
              readTime: article.readTime || 5,
              readingTime: article.readingTime || article.readTime || 5,
              image: article.image,
              featured: article.featured || false,
              slug: article.slug
            }))
            
            const allArticles = [...convertedArticles, ...staticNewsArticles]
            setNewsArticles(allArticles as any)
            setCmsArticles(storedArticles.articles as any)
          }
        } catch (storageError) {
          console.error('localStorage fallback also failed:', storageError)
          // Keep static articles as final fallback
        }
      } finally {
        setIsLoadingWorkflo(false)
      }
    }

    fetchCMSArticles()
  }, [language])

  const handleRSSFeed = () => {
    window.open('/api/rss', '_blank')
  }

  const fetchExternalNews = async (includeLinkedIn = false, retryCount = 0) => {
    setIsLoadingExternal(true)
    setExternalError(null)
    
    try {
      const response = await fetch(`/api/external-news?linkedin=${includeLinkedIn}&limit=20`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      console.log('External news response:', data) // Debug log
      
      if (data.success) {
        // Convert date strings back to Date objects
        const newsWithDates = data.data.map((item: any) => ({
          ...item,
          publishedAt: new Date(item.publishedAt)
        }))
        console.log('External news with dates:', newsWithDates) // Debug log
        setExternalNews(newsWithDates)
      } else {
        throw new Error(data.error || 'Failed to fetch external news')
      }
    } catch (error) {
      console.error('Failed to fetch external news:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      // Retry logic for network errors
      if (retryCount < 2 && (errorMessage.includes('fetch') || errorMessage.includes('NetworkError'))) {
        setTimeout(() => fetchExternalNews(includeLinkedIn, retryCount + 1), 1000)
        return
      }
      
      setExternalError(errorMessage)
    } finally {
      setIsLoadingExternal(false)
    }
  }

  useEffect(() => {
    // Simulate initial loading for Workflo articles
    const timer = setTimeout(() => {
      setIsLoadingWorkflo(false)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (activeTab === 'external') {
      fetchExternalNews(false)
    } else if (activeTab === 'linkedin') {
      fetchExternalNews(true)
    }
  }, [activeTab])
  
  // Also fetch LinkedIn posts on mount to have them ready
  useEffect(() => {
    fetchExternalNews(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section - Enhanced with gradient background */}
      <section className="relative py-16 md:py-24 px-4 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="container mx-auto max-w-7xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="p-3 rounded-full bg-primary/10 border border-primary/20"
              >
                <Newspaper className="h-8 w-8 text-primary" />
              </motion.div>
              <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
                {language === 'nl' ? 'Nieuws & Updates' : 'News & Updates'}
              </Badge>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            >
              {language === 'nl' ? (
                <>
                  Blijf op de hoogte van{' '}
                  <span className="bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
                    IT trends
                  </span>
                </>
              ) : (
                <>
                  Stay up to date with{' '}
                  <span className="bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
                    IT trends
                  </span>
                </>
              )}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-muted-foreground max-w-4xl mx-auto mb-10 leading-relaxed"
            >
              {language === 'nl' 
                ? 'Ontdek de laatste ontwikkelingen in IT, cybersecurity tips, en inzichten van het Workflo team. Van technische tutorials tot bedrijfsupdates.'
                : 'Discover the latest developments in IT, cybersecurity tips, and insights from the Workflo team. From technical tutorials to company updates.'
              }
            </motion.p>

            {/* Enhanced RSS Feed Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center"
            >
              <Button 
                onClick={handleRSSFeed}
                variant="outline"
                size="lg"
                className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Rss className="h-5 w-5" />
                {language === 'nl' ? 'RSS Feed Abonneren' : 'Subscribe to RSS Feed'}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Articles */}
      <ErrorBoundary>
        <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">
                    {language === 'nl' ? 'Uitgelichte Artikelen' : 'Featured Articles'}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {language === 'nl' 
                      ? 'De belangrijkste updates en inzichten van deze maand'
                      : 'The most important updates and insights of this month'
                    }
                  </p>
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {isLoadingWorkflo ? (
                <SkeletonLoader count={2} featured={true} />
              ) : featuredArticles.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {featuredArticles.map((article, index) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      featured={true}
                      index={index}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <TrendingUp className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {language === 'nl' ? 'Geen uitgelichte artikelen beschikbaar' : 'No featured articles available'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </ErrorBoundary>

      {/* Enhanced Search and Filter Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-8"
          >
            {/* Search Bar with enhanced styling */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-border/50">
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  resultsCount={filteredArticles.length}
                />
              </div>
            </div>

            {/* Category Filter with improved layout */}
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold">
                    {language === 'nl' ? 'Filter op categorie' : 'Filter by category'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'nl' 
                    ? 'Vind artikelen die het meest relevant zijn voor jouw interesses'
                    : 'Find articles most relevant to your interests'
                  }
                </p>
              </div>
              <div className="flex justify-center">
                <div className="bg-background/30 backdrop-blur-sm rounded-xl p-4 border border-border/30">
                  <CategoryFilter
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* News Sources Tabs */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-10 h-14 p-1 bg-muted/50 backdrop-blur-sm">
                <TabsTrigger 
                  value="workflo" 
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all duration-300 text-sm md:text-base font-medium"
                >
                  <Newspaper className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">{language === 'nl' ? 'Workflo' : 'Workflo'}</span>
                  <span className="sm:hidden">W</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="external" 
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all duration-300 text-sm md:text-base font-medium"
                >
                  <Rss className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">{language === 'nl' ? 'RSS Feed' : 'RSS Feed'}</span>
                  <span className="sm:hidden">RSS</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="linkedin" 
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all duration-300 text-sm md:text-base font-medium"
                >
                  <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">LinkedIn</span>
                  <span className="sm:hidden">LI</span>
                </TabsTrigger>
              </TabsList>

              {/* Enhanced Workflo Articles Tab */}
              <TabsContent value="workflo">
                <ErrorBoundary>
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold">
                            {selectedCategory || searchQuery ? (
                              language === 'nl' ? 'Zoekresultaten' : 'Search Results'
                            ) : (
                              language === 'nl' ? 'Workflo Artikelen' : 'Workflo Articles'
                            )}
                          </h2>
                          <p className="text-muted-foreground mt-1">
                            {searchQuery ? (
                              language === 'nl' 
                                ? `${filteredArticles.length} artikelen gevonden voor "${searchQuery}"`
                                : `${filteredArticles.length} articles found for "${searchQuery}"`
                            ) : selectedCategory ? (
                              language === 'nl' 
                                ? `${filteredArticles.length} artikelen in deze categorie`
                                : `${filteredArticles.length} articles in this category`
                            ) : (
                              language === 'nl' 
                                ? 'Alle Workflo artikelen en updates'
                                : 'All Workflo articles and updates'
                            )}
                          </p>
                        </div>
                      </div>
                      
                      {(selectedCategory || searchQuery) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCategory(null)
                            setSearchQuery('')
                          }}
                          className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <RefreshCw className="h-4 w-4" />
                          {language === 'nl' ? 'Reset filters' : 'Reset filters'}
                        </Button>
                      )}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {isLoadingWorkflo ? (
                      <SkeletonLoader count={6} />
                    ) : filteredArticles.length > 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
                      >
                        {filteredArticles.map((article, index) => (
                          <ArticleCard
                            key={article.id}
                            article={article}
                            index={index}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                      >
                        <div className="max-w-md mx-auto">
                          <div className="bg-muted/30 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="h-12 w-12 text-muted-foreground" />
                          </div>
                          <h3 className="text-2xl font-semibold mb-3">
                            {language === 'nl' ? 'Geen artikelen gevonden' : 'No articles found'}
                          </h3>
                          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                            {language === 'nl' 
                              ? 'Probeer een andere zoekterm of selecteer een andere categorie om meer artikelen te vinden.'
                              : 'Try a different search term or select another category to find more articles.'
                            }
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                              onClick={() => {
                                setSelectedCategory(null)
                                setSearchQuery('')
                              }}
                              variant="outline"
                              size="lg"
                              className="gap-2"
                            >
                              <RefreshCw className="h-4 w-4" />
                              {language === 'nl' ? 'Alle artikelen tonen' : 'Show all articles'}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ErrorBoundary>
              </TabsContent>

              {/* Enhanced External News Tab */}
              <TabsContent value="external">
                <ErrorBoundary>
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <ExternalLink className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold">
                            {language === 'nl' ? 'Industrie Nieuws' : 'Industry News'}
                          </h2>
                          <p className="text-muted-foreground mt-1">
                            {language === 'nl' 
                              ? 'Laatste IT-nieuws uit de industrie van verschillende bronnen'
                              : 'Latest IT news from the industry from various sources'
                            }
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchExternalNews(false)}
                        disabled={isLoadingExternal}
                        className="gap-2 min-w-[120px]"
                      >
                        {isLoadingExternal ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                            {language === 'nl' ? 'Laden...' : 'Loading...'}
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4" />
                            {language === 'nl' ? 'Vernieuwen' : 'Refresh'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {isLoadingExternal ? (
                      <ExternalNewsSkeletonLoader count={5} />
                    ) : externalError ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                      >
                        <div className="max-w-md mx-auto">
                          <div className="bg-red-50 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="h-12 w-12 text-red-500" />
                          </div>
                          <h3 className="text-2xl font-semibold mb-3">
                            {language === 'nl' ? 'Fout bij laden' : 'Loading Error'}
                          </h3>
                          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                            {externalError}
                          </p>
                          <Button
                            onClick={() => fetchExternalNews(false)}
                            variant="outline"
                            size="lg"
                            className="gap-2"
                          >
                            <RefreshCw className="h-4 w-4" />
                            {language === 'nl' ? 'Probeer opnieuw' : 'Try Again'}
                          </Button>
                        </div>
                      </motion.div>
                    ) : externalNews.filter(item => item.type === 'rss').length > 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        {externalNews.filter(item => item.type === 'rss').map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500/20">
                              <CardContent className="p-6">
                                <div className="flex justify-between items-start gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                                        {item.source}
                                      </Badge>
                                      <Badge variant="secondary">{item.category}</Badge>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3 hover:text-primary transition-colors line-clamp-2">
                                      <a 
                                        href={item.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-decoration-none"
                                      >
                                        {item.title}
                                      </a>
                                    </h3>
                                    <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">{item.excerpt}</p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {item.publishedAt.toLocaleDateString(
                                          language === 'nl' ? 'nl-NL' : 'en-US',
                                          { year: 'numeric', month: 'long', day: 'numeric' }
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" asChild className="shrink-0">
                                    <a 
                                      href={item.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="hover:bg-blue-50"
                                    >
                                      <ExternalLink className="h-5 w-5 text-blue-600" />
                                    </a>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                      >
                        <div className="max-w-md mx-auto">
                          <div className="bg-muted/30 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                            <ExternalLink className="h-12 w-12 text-muted-foreground" />
                          </div>
                          <h3 className="text-2xl font-semibold mb-3">
                            {language === 'nl' ? 'Geen extern nieuws beschikbaar' : 'No external news available'}
                          </h3>
                          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                            {language === 'nl' 
                              ? 'Er is momenteel geen extern nieuws beschikbaar. Probeer later opnieuw.'
                              : 'No external news is currently available. Please try again later.'
                            }
                          </p>
                          <Button
                            onClick={() => fetchExternalNews(false)}
                            variant="outline"
                            size="lg"
                            className="gap-2"
                          >
                            <RefreshCw className="h-4 w-4" />
                            {language === 'nl' ? 'Probeer opnieuw' : 'Try Again'}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ErrorBoundary>
              </TabsContent>

              {/* Enhanced LinkedIn Tab */}
              <TabsContent value="linkedin">
                <ErrorBoundary>
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-600/10">
                          <Linkedin className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold">
                            {language === 'nl' ? 'LinkedIn Updates' : 'LinkedIn Updates'}
                          </h2>
                          <p className="text-muted-foreground mt-1">
                            {language === 'nl' 
                              ? 'Laatste updates van Workflo op LinkedIn'
                              : 'Latest updates from Workflo on LinkedIn'
                            }
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchExternalNews(true)}
                        disabled={isLoadingExternal}
                        className="gap-2 min-w-[120px]"
                      >
                        {isLoadingExternal ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                            {language === 'nl' ? 'Laden...' : 'Loading...'}
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4" />
                            {language === 'nl' ? 'Vernieuwen' : 'Refresh'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {isLoadingExternal ? (
                      <ExternalNewsSkeletonLoader count={4} />
                    ) : externalError ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                      >
                        <div className="max-w-md mx-auto">
                          <div className="bg-red-50 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="h-12 w-12 text-red-500" />
                          </div>
                          <h3 className="text-2xl font-semibold mb-3">
                            {language === 'nl' ? 'Fout bij laden' : 'Loading Error'}
                          </h3>
                          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                            {externalError}
                          </p>
                          <Button
                            onClick={() => fetchExternalNews(true)}
                            variant="outline"
                            size="lg"
                            className="gap-2"
                          >
                            <RefreshCw className="h-4 w-4" />
                            {language === 'nl' ? 'Probeer opnieuw' : 'Try Again'}
                          </Button>
                        </div>
                      </motion.div>
                    ) : externalNews.filter(item => item.type === 'linkedin').length > 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        {externalNews.filter(item => item.type === 'linkedin').map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-600/20">
                              <CardContent className="p-6">
                                <div className="flex justify-between items-start gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="p-1.5 rounded bg-blue-600/10">
                                        <Linkedin className="h-5 w-5 text-blue-600" />
                                      </div>
                                      <span className="font-semibold text-lg">{item.source}</span>
                                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">LinkedIn</Badge>
                                    </div>
                                    <p className="text-foreground mb-6 leading-relaxed text-lg line-clamp-4">{item.excerpt}</p>
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          <Calendar className="h-4 w-4" />
                                          {item.publishedAt.toLocaleDateString(
                                            language === 'nl' ? 'nl-NL' : 'en-US',
                                            { year: 'numeric', month: 'long', day: 'numeric' }
                                          )}
                                        </span>
                                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                                          ❤️ {Math.floor(Math.random() * 100) + 20}
                                        </span>
                                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                                          💬 {Math.floor(Math.random() * 50) + 5}
                                        </span>
                                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                                          🔄 {Math.floor(Math.random() * 30) + 3}
                                        </span>
                                      </div>
                                      <Button variant="outline" size="sm" className="text-blue-600 hover:bg-blue-50 border-blue-200" asChild>
                                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="h-4 w-4 mr-2" />
                                          {language === 'nl' ? 'Bekijk op LinkedIn' : 'View on LinkedIn'}
                                        </a>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                      >
                        <div className="max-w-md mx-auto">
                          <div className="bg-blue-50 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                            <Linkedin className="h-12 w-12 text-blue-600" />
                          </div>
                          <h3 className="text-2xl font-semibold mb-3">
                            {language === 'nl' ? 'Geen LinkedIn posts beschikbaar' : 'No LinkedIn posts available'}
                          </h3>
                          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                            {language === 'nl' 
                              ? 'Er zijn momenteel geen LinkedIn updates beschikbaar. Volg ons op LinkedIn voor de nieuwste updates!'
                              : 'No LinkedIn updates are currently available. Follow us on LinkedIn for the latest updates!'
                            }
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                              onClick={() => fetchExternalNews(true)}
                              variant="outline"
                              size="lg"
                              className="gap-2"
                            >
                              <RefreshCw className="h-4 w-4" />
                              {language === 'nl' ? 'Probeer opnieuw' : 'Try Again'}
                            </Button>
                            <Button
                              asChild
                              size="lg"
                              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                            >
                              <a href="https://linkedin.com/company/workflo" target="_blank" rel="noopener noreferrer">
                                <Linkedin className="h-4 w-4" />
                                {language === 'nl' ? 'Volg ons' : 'Follow Us'}
                              </a>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ErrorBoundary>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Recent Articles Sidebar */}
      {!searchQuery && !selectedCategory && recentArticles.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-b from-muted/10 to-background">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Card className="shadow-lg border-0 bg-background/60 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">
                        {language === 'nl' ? 'Recent Gepubliceerd' : 'Recently Published'}
                      </CardTitle>
                      <CardDescription className="text-base mt-1">
                        {language === 'nl' 
                          ? 'De nieuwste artikelen en updates van het Workflo team'
                          : 'The latest articles and updates from the Workflo team'
                        }
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentArticles.map((article, index) => {
                      const title = language === 'nl' ? article.titleNL : article.title
                      const excerpt = language === 'nl' ? article.excerptNL : article.excerpt
                      
                      return (
                        <motion.div
                          key={article.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.1 + index * 0.1 }}
                        >
                          <div className="group flex gap-6 p-5 rounded-xl hover:bg-muted/40 transition-all duration-300 border border-transparent hover:border-border/50">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                {title}
                              </h4>
                              <p className="text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                                {excerpt}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {article.publishedAt.toLocaleDateString(
                                    language === 'nl' ? 'nl-NL' : 'en-US',
                                    { year: 'numeric', month: 'long', day: 'numeric' }
                                  )}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {article.readingTime} {language === 'nl' ? 'min' : 'min'}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                asChild
                                className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                              >
                                <a href={`/nieuws/${article.slug}`} className="gap-2">
                                  {language === 'nl' ? 'Lees meer' : 'Read more'}
                                  <motion.div
                                    initial={false}
                                    animate={{ x: 0 }}
                                    whileHover={{ x: 4 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  >
                                    →
                                  </motion.div>
                                </a>
                              </Button>
                            </div>
                          </div>
                          {index < recentArticles.length - 1 && <Separator className="my-2" />}
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}