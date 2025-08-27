'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArticleStorage } from '@/lib/storage/article-storage'
import { ArticleService } from '@/lib/services/article-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Plus, Edit, Trash2, Save, X, Calendar, Tag, User, Eye, EyeOff, FileText, LogOut, Shield, ChevronDown, Settings, UserCircle, History, HelpCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Article {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  image?: string
  published: boolean
  publishedDate: string
  createdAt: string
  updatedAt: string
}

export default function CMSPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [newArticle, setNewArticle] = useState<Partial<Article>>({
    title: '',
    excerpt: '',
    content: '',
    author: 'Workflo Team',
    category: 'Nieuws',
    tags: [],
    published: false,
  })
  const [tagInput, setTagInput] = useState('')
  const [activeTab, setActiveTab] = useState('list')
  const [currentUser, setCurrentUser] = useState({ username: 'admin', role: 'admin' }) // Mock user data

  const showMessage = useCallback((type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }, [])

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/cms/articles')
      const data = await response.json()
      
      if (data.success && data.articles) {
        setArticles(data.articles)
        
        if (data.useClientStorage) {
          showMessage('success', 'Artikelen geladen uit browser opslag - gegevens blijven lokaal opgeslagen')
        } else if (data.warning) {
          showMessage('success', `Artikelen geladen: ${data.warning}`)
        } else {
          showMessage('success', `${data.articles.length} artikelen geladen uit database`)
        }
      } else {
        // Fallback to localStorage
        const storedArticles = ArticleStorage.getArticles()
        setArticles(storedArticles as any[])
        showMessage('error', 'Fout bij ophalen artikelen - lokale opslag gebruikt')
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
      // Fallback to localStorage
      const storedArticles = ArticleStorage.getArticles()
      setArticles(storedArticles as any[])
      showMessage('error', 'Verbindingsfout - lokale opslag gebruikt')
    } finally {
      setLoading(false)
    }
  }, [showMessage])

  // Fetch articles on load
  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])


  const handleLogout = async () => {
    try {
      await fetch('/api/cms/auth', { method: 'DELETE' })
      router.push('/cms/login')
    } catch (error) {
      showMessage('error', 'Logout failed')
    }
  }

  const handleAddArticle = async () => {
    if (!newArticle.title || !newArticle.excerpt || !newArticle.content) {
      showMessage('error', 'Vul alle verplichte velden in')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/cms/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle),
      })
      const data = await response.json()
      
      if (data.success && data.article) {
        // Save to localStorage if needed
        if (data.useClientStorage) {
          const savedArticle = ArticleStorage.saveArticle({
            title: newArticle.title!,
            slug: newArticle.slug || newArticle.title!.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            excerpt: newArticle.excerpt!,
            content: newArticle.content!,
            author: newArticle.author || 'Workflo Team',
            category: newArticle.category || 'Nieuws',
            tags: newArticle.tags || [],
            published: newArticle.published || false,
            featured: false,
            image: newArticle.image
          })
          setArticles([savedArticle as any, ...articles])
          showMessage('success', 'Artikel opgeslagen in browser - gebruik database voor permanente opslag')
        } else {
          setArticles([data.article, ...articles])
          showMessage('success', 'Artikel succesvol opgeslagen in database')
        }
        
        // Reset form
        setNewArticle({
          title: '',
          excerpt: '',
          content: '',
          author: 'Workflo Team',
          category: 'Nieuws',
          tags: [],
          published: false,
        })
        setTagInput('')
        setActiveTab('list')
      } else {
        throw new Error(data.error || 'Onbekende fout bij opslaan')
      }
    } catch (error: any) {
      showMessage('error', `Fout bij opslaan artikel: ${error.message}`)
    }
    setLoading(false)
  }

  const handleUpdateArticle = async (article: Article) => {
    setLoading(true)
    try {
      const response = await fetch('/api/cms/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      })
      const data = await response.json()
      
      if (data.success && data.article) {
        // Update in localStorage if needed
        if (data.useClientStorage) {
          const updatedArticle = ArticleStorage.updateArticle(article.id.toString(), {
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: article.content,
            author: article.author,
            category: article.category,
            tags: article.tags,
            published: article.published,
            image: article.image
          })
          if (updatedArticle) {
            setArticles(articles.map(a => a.id.toString() === updatedArticle.id ? updatedArticle as any : a))
          }
          showMessage('success', 'Artikel bijgewerkt in browser - gebruik database voor permanente opslag')
        } else {
          setArticles(articles.map(a => a.id === data.article.id ? data.article : a))
          showMessage('success', 'Artikel succesvol bijgewerkt in database')
        }
        
        setEditingArticle(null)
      } else {
        throw new Error(data.error || 'Onbekende fout bij bijwerken')
      }
    } catch (error: any) {
      showMessage('error', `Fout bij bijwerken artikel: ${error.message}`)
    }
    setLoading(false)
  }

  const handleDeleteArticle = async (id: number) => {
    if (!confirm('Weet je zeker dat je dit artikel wilt verwijderen?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/cms/articles?id=${id}`, { method: 'DELETE' })
      const data = await response.json()
      
      if (data.success) {
        // Delete from localStorage if needed
        if (data.useClientStorage) {
          ArticleStorage.deleteArticle(id.toString())
          showMessage('success', 'Artikel verwijderd uit browser opslag')
        } else {
          showMessage('success', 'Artikel succesvol verwijderd uit database')
        }
        
        setArticles(articles.filter(a => a.id !== id))
      } else {
        throw new Error(data.error || 'Onbekende fout bij verwijderen')
      }
    } catch (error: any) {
      showMessage('error', `Fout bij verwijderen artikel: ${error.message}`)
    }
    setLoading(false)
  }

  const handleAddTag = () => {
    if (tagInput.trim() && newArticle.tags && !newArticle.tags.includes(tagInput.trim())) {
      setNewArticle({
        ...newArticle,
        tags: [...newArticle.tags, tagInput.trim().toLowerCase()]
      })
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setNewArticle({
      ...newArticle,
      tags: newArticle.tags?.filter(t => t !== tag) || []
    })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Niet gepubliceerd'
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Nieuws & Blog CMS</h1>
          </div>
          <p className="text-muted-foreground">Beheer nieuws artikelen en blog posts - Beveiligde omgeving</p>
        </div>
        
        {/* Account Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <span>{currentUser.username}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser.username}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Rol: {currentUser.role === 'admin' ? 'Administrator' : currentUser.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/cms')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>CMS Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/cms/security')}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Security & Users</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/cms/security?tab=password')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Wijzig Wachtwoord</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/cms/security?tab=audit')}>
              <History className="mr-2 h-4 w-4" />
              <span>Audit Log</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.open('/cms/help', '_blank')}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Documentatie</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Uitloggen</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <AlertTitle>{message.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">
            <FileText className="w-4 h-4 mr-2" />
            Artikelen ({articles.length})
          </TabsTrigger>
          <TabsTrigger value="new">
            <Plus className="w-4 h-4 mr-2" />
            Nieuw Artikel
          </TabsTrigger>
          <TabsTrigger value="stats">
            <Eye className="w-4 h-4 mr-2" />
            Statistieken
          </TabsTrigger>
        </TabsList>

        {/* Articles List */}
        <TabsContent value="list">
          <div className="space-y-4">
            {articles.map((article) => (
              <Card key={article.id}>
                <CardContent className="p-6">
                  {editingArticle?.id === article.id && editingArticle ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <Input
                        value={editingArticle.title || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                        placeholder="Artikel titel"
                      />
                      <Textarea
                        value={editingArticle.excerpt || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                        placeholder="Samenvatting"
                        rows={2}
                      />
                      <Textarea
                        value={editingArticle.content || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                        placeholder="Inhoud"
                        rows={6}
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          value={editingArticle.author || ''}
                          onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                          placeholder="Auteur"
                        />
                        <Select
                          value={editingArticle.category || 'Nieuws'}
                          onValueChange={(value) => setEditingArticle({ ...editingArticle, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Nieuws">Nieuws</SelectItem>
                            <SelectItem value="Blog">Blog</SelectItem>
                            <SelectItem value="Tutorial">Tutorial</SelectItem>
                            <SelectItem value="Update">Update</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={editingArticle.published || false}
                            onCheckedChange={(checked) => setEditingArticle({ ...editingArticle, published: checked })}
                          />
                          <Label>Gepubliceerd</Label>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" onClick={() => handleUpdateArticle(editingArticle)}>
                          <Save className="w-4 h-4 mr-1" />
                          Opslaan
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingArticle(null)}>
                          <X className="w-4 h-4 mr-1" />
                          Annuleren
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{article.title}</h3>
                            {article.published ? (
                              <Badge className="bg-green-100 text-green-800">
                                <Eye className="w-3 h-3 mr-1" />
                                Gepubliceerd
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <EyeOff className="w-3 h-3 mr-1" />
                                Concept
                              </Badge>
                            )}
                            <Badge variant="outline">{article.category}</Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">{article.excerpt}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {article.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(article.publishedDate)}
                            </span>
                          </div>
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {article.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingArticle(article)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteArticle(article.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {articles.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Nog geen artikelen. Maak je eerste artikel aan!</p>
                  <Button className="mt-4" onClick={() => setActiveTab('new')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nieuw Artikel
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* New Article Form */}
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Nieuw Artikel Schrijven</CardTitle>
              <CardDescription>Maak een nieuw nieuws artikel of blog post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  placeholder="Bijv. Workflo lanceert nieuwe cybersecurity diensten"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Samenvatting *</Label>
                <Textarea
                  id="excerpt"
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  placeholder="Een korte samenvatting van het artikel (max 2-3 zinnen)"
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="content">Inhoud *</Label>
                <Textarea
                  id="content"
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  placeholder="De volledige inhoud van het artikel..."
                  rows={10}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author">Auteur</Label>
                  <Input
                    id="author"
                    value={newArticle.author}
                    onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                    placeholder="Naam van de auteur"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categorie</Label>
                  <Select
                    value={newArticle.category}
                    onValueChange={(value) => setNewArticle({ ...newArticle, category: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nieuws">Nieuws</SelectItem>
                      <SelectItem value="Blog">Blog</SelectItem>
                      <SelectItem value="Tutorial">Tutorial</SelectItem>
                      <SelectItem value="Update">Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Voeg een tag toe en druk Enter"
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {newArticle.tags && newArticle.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newArticle.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="image">Afbeelding URL (optioneel)</Label>
                <Input
                  id="image"
                  value={newArticle.image || ''}
                  onChange={(e) => setNewArticle({ ...newArticle, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={newArticle.published}
                    onCheckedChange={(checked) => setNewArticle({ ...newArticle, published: checked })}
                  />
                  <Label htmlFor="published">Direct publiceren</Label>
                </div>

                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setActiveTab('list')}>
                    Annuleren
                  </Button>
                  <Button onClick={handleAddArticle} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {newArticle.published ? 'Publiceren' : 'Opslaan als concept'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics */}
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Totaal Artikelen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{articles.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gepubliceerd</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {articles.filter(a => a.published).length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Concepten</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-workflo-yellow">
                  {articles.filter(a => !a.published).length}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Recente Artikelen</CardTitle>
              <CardDescription>Laatste 5 gepubliceerde artikelen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {articles
                  .filter(a => a.published)
                  .slice(0, 5)
                  .map((article) => (
                    <div key={article.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{article.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {article.author} • {formatDate(article.publishedDate)}
                        </p>
                      </div>
                      <Badge>{article.category}</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}