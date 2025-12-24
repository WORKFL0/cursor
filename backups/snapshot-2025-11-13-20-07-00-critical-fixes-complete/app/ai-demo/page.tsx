'use client'

import { useState } from 'react'
import { SmartSearch } from '@/components/ai/SmartSearch'
import { ContentRecommendations } from '@/components/ai/ContentRecommendations'
import { IntelligentFAQ } from '@/components/ai/IntelligentFAQ'
import { Brain, Search, MessageSquare, TrendingUp, HelpCircle, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AIDemoPage() {
  const [userId] = useState('demo-user-' + Math.random().toString(36).substr(2, 9))

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6">
              <Brain className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI-Powered Features Demo
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Ervaar de toekomst van IT-diensten met onze intelligente features
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="px-3 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                Slimme Zoekfunctie
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <MessageSquare className="h-3 w-3 mr-1" />
                WorkBot AI Assistent
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Aanbevelingen
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <HelpCircle className="h-3 w-3 mr-1" />
                Intelligente FAQ
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Alert */}
      <div className="container mx-auto px-4 py-6">
        <Alert className="max-w-4xl mx-auto">
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            Dit is een demo pagina met AI-powered features. WorkBot is beschikbaar op alle pagina&apos;s via de knop rechtsonder.
          </AlertDescription>
        </Alert>
      </div>

      {/* Features Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
                <TabsTrigger value="search" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Slimme Zoekfunctie
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Aanbevelingen
                </TabsTrigger>
                <TabsTrigger value="faq" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Intelligente FAQ
                </TabsTrigger>
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Overzicht
                </TabsTrigger>
              </TabsList>

              {/* Smart Search Tab */}
              <TabsContent value="search">
                <Card>
                  <CardHeader>
                    <CardTitle>Smart Search</CardTitle>
                    <CardDescription>
                      Intelligent search with typo correction, semantic understanding, and instant results
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-muted/50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-4">Try searching for:</h3>
                      <div className="flex flex-wrap gap-2 mb-6">
                        <Badge>managed it</Badge>
                        <Badge>cloud solutions</Badge>
                        <Badge>backup</Badge>
                        <Badge>security</Badge>
                        <Badge>microsoft 365</Badge>
                      </div>
                      <div className="max-w-xl mx-auto">
                        <SmartSearch />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4">
                        <div className="text-3xl mb-2">🔍</div>
                        <h4 className="font-semibold mb-1">Fuzzy Search</h4>
                        <p className="text-sm text-muted-foreground">
                          Handles typos and variations automatically
                        </p>
                      </div>
                      <div className="text-center p-4">
                        <div className="text-3xl mb-2">🧠</div>
                        <h4 className="font-semibold mb-1">Semantic Understanding</h4>
                        <p className="text-sm text-muted-foreground">
                          Understands context and meaning
                        </p>
                      </div>
                      <div className="text-center p-4">
                        <div className="text-3xl mb-2">⚡</div>
                        <h4 className="font-semibold mb-1">Instant Results</h4>
                        <p className="text-sm text-muted-foreground">
                          Real-time suggestions as you type
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Recommendations Tab */}
              <TabsContent value="recommendations">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Recommendations</CardTitle>
                    <CardDescription>
                      Personalized content suggestions based on behavior and context
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid lg:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-semibold mb-4">How it works:</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-semibold">1</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Behavior Tracking</h4>
                              <p className="text-sm text-muted-foreground">
                                Learns from your interactions and viewing patterns
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-semibold">2</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Context Analysis</h4>
                              <p className="text-sm text-muted-foreground">
                                Considers current page, industry, and company size
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-semibold">3</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Smart Matching</h4>
                              <p className="text-sm text-muted-foreground">
                                Uses collaborative and content-based filtering
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-4">Your Recommendations:</h3>
                        <ContentRecommendations 
                          userId={userId}
                          context={{ currentPage: 'ai-demo' }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Intelligent FAQ Tab */}
              <TabsContent value="faq">
                <Card>
                  <CardHeader>
                    <CardTitle>Intelligent FAQ System</CardTitle>
                    <CardDescription>
                      AI-powered FAQ with semantic search and auto-generated answers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <IntelligentFAQ />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Features Overview</CardTitle>
                      <CardDescription>
                        Complete suite of AI-powered features for enhanced user experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <Search className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                              <h3 className="font-semibold mb-2">Smart Search</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                Advanced search with fuzzy matching, typo correction, and semantic understanding
                              </p>
                              <ul className="text-sm space-y-1">
                                <li>✓ Real-time suggestions</li>
                                <li>✓ Content type filtering</li>
                                <li>✓ Relevance scoring</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4">
                            <MessageSquare className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                              <h3 className="font-semibold mb-2">AI Chatbot</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                24/7 virtual assistant for instant support and lead qualification
                              </p>
                              <ul className="text-sm space-y-1">
                                <li>✓ Natural language processing</li>
                                <li>✓ Context-aware responses</li>
                                <li>✓ Lead qualification</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <TrendingUp className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                              <h3 className="font-semibold mb-2">Content Recommendations</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                Personalized content suggestions based on user behavior
                              </p>
                              <ul className="text-sm space-y-1">
                                <li>✓ Collaborative filtering</li>
                                <li>✓ Industry-specific content</li>
                                <li>✓ Real-time adaptation</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4">
                            <HelpCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                              <h3 className="font-semibold mb-2">Intelligent FAQ</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                Smart FAQ system with semantic search and auto-generation
                              </p>
                              <ul className="text-sm space-y-1">
                                <li>✓ Semantic question matching</li>
                                <li>✓ Auto-generated answers</li>
                                <li>✓ Trending questions</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
                    <CardHeader>
                      <CardTitle>Technology Stack</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-background rounded-lg">
                          <div className="text-2xl mb-2">🤖</div>
                          <h4 className="font-semibold">OpenAI GPT</h4>
                          <p className="text-xs text-muted-foreground">Language Model</p>
                        </div>
                        <div className="text-center p-4 bg-background rounded-lg">
                          <div className="text-2xl mb-2">🧠</div>
                          <h4 className="font-semibold">Claude AI</h4>
                          <p className="text-xs text-muted-foreground">Assistant Model</p>
                        </div>
                        <div className="text-center p-4 bg-background rounded-lg">
                          <div className="text-2xl mb-2">📊</div>
                          <h4 className="font-semibold">Pinecone</h4>
                          <p className="text-xs text-muted-foreground">Vector Database</p>
                        </div>
                        <div className="text-center p-4 bg-background rounded-lg">
                          <div className="text-2xl mb-2">⚡</div>
                          <h4 className="font-semibold">LangChain</h4>
                          <p className="text-xs text-muted-foreground">AI Framework</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  )
}