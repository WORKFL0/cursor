'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload,
  X,
  Plus,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  image_url: string
  published: boolean
  featured: boolean
  views_count: number
  published_at: string | null
  created_at: string
  updated_at: string
}

interface ArticleFormData {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  image_url: string
  published: boolean
  featured: boolean
}

const CATEGORIES = [
  'Nieuws',
  'Tech', 
  'Updates',
  'Tutorials',
  'Case Studies',
  'Insights'
]

export default function EditArticlePage() {
  const params = useParams()
  const router = useRouter()
  const articleId = params.id as string

  const [article, setArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Nieuws',
    tags: [],
    image_url: '',
    published: false,
    featured: false
  })
  
  const [newTag, setNewTag] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingArticle, setIsLoadingArticle] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem('admin_token')
        const response = await fetch(`/api/v1/articles/${articleId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (data.success && data.data) {
          const articleData = data.data
          setArticle(articleData)
          setFormData({
            title: articleData.title,
            slug: articleData.slug,
            excerpt: articleData.excerpt || '',
            content: articleData.content,
            category: articleData.category,
            tags: articleData.tags || [],
            image_url: articleData.image_url || '',
            published: articleData.published,
            featured: articleData.featured
          })
        } else {
          throw new Error(data.message || 'Article not found')
        }
      } catch (error) {
        console.error('Failed to fetch article:', error)
        setError('Failed to load article')
      } finally {
        setIsLoadingArticle(false)
      }
    }

    if (articleId) {
      fetchArticle()
    }
  }, [articleId])

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  // Handle form changes
  const handleChange = (field: keyof ArticleFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
    setSuccess('')
  }

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // Validate form
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required')
      return false
    }
    if (!formData.content.trim()) {
      setError('Content is required')
      return false
    }
    if (!formData.slug.trim()) {
      setError('Slug is required')
      return false
    }
    return true
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent, shouldPublish?: boolean) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('admin_token')
      const dataToSubmit = {
        ...formData,
        published: shouldPublish !== undefined ? shouldPublish : formData.published,
        published_at: (shouldPublish || formData.published) && !article?.published_at ? new Date().toISOString() : article?.published_at
      }

      const response = await fetch(`/api/v1/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSubmit)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`Article updated successfully!`)
        
        // Update local article data
        if (data.data) {
          setArticle(data.data)
        }
        
        // Redirect to article list after a brief delay
        setTimeout(() => {
          router.push('/admin/articles')
        }, 1500)
      } else {
        throw new Error(data.message || 'Failed to update article')
      }
    } catch (error) {
      console.error('Submit error:', error)
      setError(error instanceof Error ? error.message : 'Failed to update article')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingArticle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/articles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Loading Article...</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error && !article) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/articles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Error</h1>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/articles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Article</h1>
            <p className="text-muted-foreground">
              Last updated: {article ? new Date(article.updated_at).toLocaleString() : ''}
            </p>
          </div>
        </div>
        
        {article && (
          <Button variant="outline" asChild>
            <Link href={`/nieuws/${article.slug}`} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Live
            </Link>
          </Button>
        )}
      </div>

      {/* Success/Error Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
                <CardDescription>Edit the main content of your article</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter article title..."
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    placeholder="article-url-slug"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    URL: /nieuws/{formData.slug || 'article-url-slug'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief description of the article..."
                    value={formData.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your article content here... (Markdown supported)"
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    rows={12}
                    required
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    You can use Markdown formatting for rich text
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Article Stats */}
            {article && (
              <Card>
                <CardHeader>
                  <CardTitle>Article Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{article.views_count}</div>
                      <p className="text-sm text-muted-foreground">Views</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {new Date(article.created_at).toLocaleDateString()}
                      </div>
                      <p className="text-sm text-muted-foreground">Created</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{article.author}</div>
                      <p className="text-sm text-muted-foreground">Author</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="published">Published</Label>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => handleChange('published', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Featured</Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleChange('featured', checked)}
                  />
                </div>

                {article?.published_at && (
                  <div className="text-sm text-muted-foreground">
                    Published: {new Date(article.published_at).toLocaleString()}
                  </div>
                )}

                <div className="flex flex-col space-y-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Article
                      </>
                    )}
                  </Button>
                  
                  {!formData.published && (
                    <Button 
                      type="button"
                      onClick={(e) => handleSubmit(e, true)}
                      disabled={isLoading}
                      className="w-full"
                      variant="default"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Publish Now
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Categories & Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image_url}
                    onChange={(e) => handleChange('image_url', e.target.value)}
                  />
                </div>
                
                {formData.image_url && (
                  <div className="mt-2">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}

                <Button type="button" variant="outline" className="w-full" disabled>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}