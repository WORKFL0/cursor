'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Newspaper, Rss, TrendingUp, Calendar, Filter, ExternalLink, Linkedin } from 'lucide-react'
import { ArticleCard } from '@/components/news/article-card'
import { CategoryFilter } from '@/components/news/category-filter'
import { SearchBar } from '@/components/news/search-bar'
import { 
  newsArticles, 
  getFeaturedArticles, 
  getRecentArticles, 
  getArticlesByCategory, 
  searchArticles 
} from '@/lib/data/news-data'
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

  // Filter and search articles
  const filteredArticles = useMemo(() => {
    let articles = newsArticles

    // Apply category filter
    if (selectedCategory) {
      articles = getArticlesByCategory(selectedCategory)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      articles = searchArticles(searchQuery).filter(article => 
        selectedCategory ? article.category === selectedCategory : true
      )
    }

    // Sort by publication date (newest first)
    return articles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
  }, [selectedCategory, searchQuery])

  const featuredArticles = getFeaturedArticles()
  const recentArticles = getRecentArticles(3)

  const handleRSSFeed = () => {
    window.open('/api/rss', '_blank')
  }

  const fetchExternalNews = async (includeLinkedIn = false) => {
    setIsLoadingExternal(true)
    try {
      const response = await fetch(`/api/external-news?linkedin=${includeLinkedIn}&limit=20`)
      const data = await response.json()
      
      if (data.success) {
        // Convert date strings back to Date objects
        const newsWithDates = data.data.map((item: any) => ({
          ...item,
          publishedAt: new Date(item.publishedAt)
        }))
        setExternalNews(newsWithDates)
      }
    } catch (error) {
      console.error('Failed to fetch external news:', error)
    } finally {
      setIsLoadingExternal(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'external') {
      fetchExternalNews(false)
    } else if (activeTab === 'linkedin') {
      fetchExternalNews(true)
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Newspaper className="h-8 w-8 text-primary" />
              <Badge variant="outline" className="px-3 py-1">
                {language === 'nl' ? 'Nieuws & Updates' : 'News & Updates'}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {language === 'nl' ? (
                <>
                  Blijf op de hoogte van{' '}
                  <span className="text-primary">IT trends</span>
                </>
              ) : (
                <>
                  Stay up to date with{' '}
                  <span className="text-primary">IT trends</span>
                </>
              )}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {language === 'nl' 
                ? 'Ontdek de laatste ontwikkelingen in IT, cybersecurity tips, en inzichten van het Workflo team. Van technische tutorials tot bedrijfsupdates.'
                : 'Discover the latest developments in IT, cybersecurity tips, and insights from the Workflo team. From technical tutorials to company updates.'
              }
            </p>

            {/* RSS Feed Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <Button 
                onClick={handleRSSFeed}
                variant="outline"
                className="gap-2"
              >
                <Rss className="h-4 w-4" />
                {language === 'nl' ? 'RSS Feed' : 'RSS Feed'}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">
                  {language === 'nl' ? 'Uitgelichte Artikelen' : 'Featured Articles'}
                </h2>
              </div>
              <p className="text-muted-foreground">
                {language === 'nl' 
                  ? 'De belangrijkste updates en inzichten van deze maand'
                  : 'The most important updates and insights of this month'
                }
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredArticles.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  featured={true}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                resultsCount={filteredArticles.length}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {language === 'nl' ? 'Filter op categorie:' : 'Filter by category:'}
                </span>
              </div>
              <div className="flex justify-center">
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
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
              <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
                <TabsTrigger value="workflo" className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4" />
                  {language === 'nl' ? 'Workflo' : 'Workflo'}
                </TabsTrigger>
                <TabsTrigger value="external" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  {language === 'nl' ? 'Industrie' : 'Industry'}
                </TabsTrigger>
                <TabsTrigger value="linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </TabsTrigger>
              </TabsList>

              {/* Workflo Articles Tab */}
              <TabsContent value="workflo">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h2 className="text-2xl font-bold">
                        {selectedCategory || searchQuery ? (
                          language === 'nl' ? 'Zoekresultaten' : 'Search Results'
                        ) : (
                          language === 'nl' ? 'Workflo Artikelen' : 'Workflo Articles'
                        )}
                      </h2>
                    </div>
                    
                    {(selectedCategory || searchQuery) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(null)
                          setSearchQuery('')
                        }}
                      >
                        {language === 'nl' ? 'Reset filters' : 'Reset filters'}
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground">
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

                {filteredArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article, index) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">
                      {language === 'nl' ? 'Geen artikelen gevonden' : 'No articles found'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {language === 'nl' 
                        ? 'Probeer een andere zoekterm of selecteer een andere categorie.'
                        : 'Try a different search term or select another category.'
                      }
                    </p>
                    <Button
                      onClick={() => {
                        setSelectedCategory(null)
                        setSearchQuery('')
                      }}
                      variant="outline"
                    >
                      {language === 'nl' ? 'Alle artikelen tonen' : 'Show all articles'}
                    </Button>
                  </motion.div>
                )}
              </TabsContent>

              {/* External News Tab */}
              <TabsContent value="external">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-5 w-5 text-primary" />
                      <h2 className="text-2xl font-bold">
                        {language === 'nl' ? 'Industrie Nieuws' : 'Industry News'}
                      </h2>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchExternalNews(false)}
                      disabled={isLoadingExternal}
                    >
                      {isLoadingExternal ? (
                        language === 'nl' ? 'Laden...' : 'Loading...'
                      ) : (
                        language === 'nl' ? 'Vernieuwen' : 'Refresh'
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-muted-foreground">
                    {language === 'nl' 
                      ? 'Laatste IT-nieuws uit de industrie van verschillende bronnen'
                      : 'Latest IT news from the industry from various sources'
                    }
                  </p>
                </div>

                {isLoadingExternal ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">
                      {language === 'nl' ? 'Laden van nieuws...' : 'Loading news...'}
                    </p>
                  </div>
                ) : externalNews.length > 0 ? (
                  <div className="space-y-4">
                    {externalNews.filter(item => item.type === 'rss').map((item, index) => (
                      <Card key={item.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{item.source}</Badge>
                                <Badge variant="secondary">{item.category}</Badge>
                              </div>
                              <h3 className="text-lg font-semibold mb-2 hover:text-primary">
                                <a href={item.url} target="_blank" rel="noopener noreferrer">
                                  {item.title}
                                </a>
                              </h3>
                              <p className="text-muted-foreground mb-3">{item.excerpt}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {item.publishedAt.toLocaleDateString(
                                    language === 'nl' ? 'nl-NL' : 'en-US'
                                  )}
                                </span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={item.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📡</div>
                    <h3 className="text-xl font-semibold mb-2">
                      {language === 'nl' ? 'Geen extern nieuws beschikbaar' : 'No external news available'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'nl' 
                        ? 'Probeer later opnieuw of vernieuw de feed'
                        : 'Try again later or refresh the feed'
                      }
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* LinkedIn Tab */}
              <TabsContent value="linkedin">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-5 w-5 text-primary" />
                      <h2 className="text-2xl font-bold">
                        {language === 'nl' ? 'LinkedIn Updates' : 'LinkedIn Updates'}
                      </h2>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchExternalNews(true)}
                      disabled={isLoadingExternal}
                    >
                      {isLoadingExternal ? (
                        language === 'nl' ? 'Laden...' : 'Loading...'
                      ) : (
                        language === 'nl' ? 'Vernieuwen' : 'Refresh'
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-muted-foreground">
                    {language === 'nl' 
                      ? 'Laatste updates van Workflo op LinkedIn'
                      : 'Latest updates from Workflo on LinkedIn'
                    }
                  </p>
                </div>

                {isLoadingExternal ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">
                      {language === 'nl' ? 'Laden van LinkedIn posts...' : 'Loading LinkedIn posts...'}
                    </p>
                  </div>
                ) : externalNews.length > 0 ? (
                  <div className="space-y-4">
                    {externalNews.filter(item => item.type === 'linkedin').map((item, index) => (
                      <Card key={item.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <Linkedin className="h-5 w-5 text-blue-600" />
                                <span className="font-medium">{item.source}</span>
                                <Badge variant="secondary">LinkedIn</Badge>
                              </div>
                              <p className="text-muted-foreground mb-4 leading-relaxed">{item.excerpt}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {item.publishedAt.toLocaleDateString(
                                      language === 'nl' ? 'nl-NL' : 'en-US'
                                    )}
                                  </span>
                                  <span className="flex items-center gap-1 text-blue-600">
                                    ❤️ {Math.floor(Math.random() * 100) + 20}
                                  </span>
                                  <span className="flex items-center gap-1 text-blue-600">
                                    💬 {Math.floor(Math.random() * 50) + 5}
                                  </span>
                                  <span className="flex items-center gap-1 text-blue-600">
                                    🔄 {Math.floor(Math.random() * 30) + 3}
                                  </span>
                                </div>
                                <Button variant="outline" size="sm" className="text-blue-600 hover:bg-blue-50" asChild>
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
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">💼</div>
                    <h3 className="text-xl font-semibold mb-2">
                      {language === 'nl' ? 'Geen LinkedIn posts beschikbaar' : 'No LinkedIn posts available'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'nl' 
                        ? 'Probeer later opnieuw of volg ons op LinkedIn'
                        : 'Try again later or follow us on LinkedIn'
                      }
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* Recent Articles Sidebar */}
      {!searchQuery && !selectedCategory && recentArticles.length > 0 && (
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    {language === 'nl' ? 'Recent Gepubliceerd' : 'Recently Published'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'nl' 
                      ? 'De nieuwste artikelen en updates'
                      : 'The latest articles and updates'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
                          <div className="flex gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex-1">
                              <h4 className="font-medium line-clamp-1 mb-1">{title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {excerpt}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {article.publishedAt.toLocaleDateString(
                                    language === 'nl' ? 'nl-NL' : 'en-US'
                                  )}
                                </span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={`/nieuws/${article.slug}`}>
                                {language === 'nl' ? 'Lees' : 'Read'}
                              </a>
                            </Button>
                          </div>
                          {index < recentArticles.length - 1 && <Separator />}
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