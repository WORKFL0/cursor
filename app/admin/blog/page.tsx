'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Search, Filter, Eye, Edit, Trash2, Calendar, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
import type { BlogPost, BlogCategory } from '@/types/blog'
import { formatDate } from '@/lib/blog-api'

export default function BlogAdminPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    loadData()
  }, [statusFilter, categoryFilter])

  async function loadData() {
    try {
      setLoading(true)

      // Load posts
      let postsQuery = supabase
        .from('blog_posts')
        .select(`
          *,
          category:blog_categories(name, color),
          author:blog_authors(display_name)
        `)
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        postsQuery = postsQuery.eq('status', statusFilter)
      }

      if (categoryFilter !== 'all') {
        postsQuery = postsQuery.eq('category_id', categoryFilter)
      }

      const { data: postsData, error: postsError } = await postsQuery

      if (postsError) throw postsError

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name')

      if (categoriesError) throw categoriesError

      setPosts(postsData as any || [])
      setCategories(categoriesData || [])
    } catch (error) {
      console.error('Error loading blog data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Weet je zeker dat je dit artikel wilt verwijderen?')) return

    try {
      // Get admin token from localStorage
      const token = localStorage.getItem('admin_token')

      if (!token) {
        alert('Je bent niet ingelogd. Log opnieuw in.')
        return
      }

      // Call API route which uses service role
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Delete error details:', data)
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      // Remove from local state
      setPosts(posts.filter(p => p.id !== id))

      // Show success message
      console.log('✅ Post successfully deleted:', id)
    } catch (error) {
      console.error('Error deleting post:', error)
      const errorMessage = error instanceof Error
        ? error.message
        : 'Onbekende fout bij verwijderen'
      alert(`Fout bij verwijderen artikel: ${errorMessage}`)
    }
  }

  const filteredPosts = posts.filter(post =>
    search === '' ||
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(search.toLowerCase())
  )

  const statusColors = {
    draft: 'bg-gray-500',
    published: 'bg-green-600',
    scheduled: 'bg-blue-600',
    archived: 'bg-red-600',
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blog Artikelen</h1>
          <p className="text-muted-foreground mt-1">
            Beheer je blog content en publiceer naar website, LinkedIn en email
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/admin/blog/new">
            <Plus className="h-5 w-5 mr-2" />
            Nieuw Artikel
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Totaal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gepubliceerd
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {posts.filter(p => p.status === 'published').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Concepten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {posts.filter(p => p.status === 'draft').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gepland
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {posts.filter(p => p.status === 'scheduled').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Zoek artikelen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle statussen</SelectItem>
                <SelectItem value="draft">Concept</SelectItem>
                <SelectItem value="published">Gepubliceerd</SelectItem>
                <SelectItem value="scheduled">Gepland</SelectItem>
                <SelectItem value="archived">Gearchiveerd</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Tag className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Categorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle categorieën</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      {loading ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              Laden...
            </div>
          </CardContent>
        </Card>
      ) : filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Geen artikelen gevonden
              </p>
              <Button asChild>
                <Link href="/admin/blog/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Eerste artikel aanmaken
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Image Preview */}
                  {post.featured_image && (
                    <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Hide broken images
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={statusColors[post.status as keyof typeof statusColors]}>
                        {post.status}
                      </Badge>
                      {post.category && (
                        <Badge
                          variant="outline"
                          style={{ borderColor: (post.category as any).color }}
                        >
                          {(post.category as any).name}
                        </Badge>
                      )}
                      {post.publish_to_linkedin && (
                        <Badge variant="outline" className="bg-blue-50">
                          LinkedIn
                        </Badge>
                      )}
                      {post.publish_to_email && (
                        <Badge variant="outline" className="bg-purple-50">
                          Email
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-1 truncate">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {post.author && (
                        <span>Door: {(post.author as any).display_name}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.published_at
                          ? formatDate(post.published_at)
                          : formatDate(post.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.view_count} views
                      </span>
                      {post.read_time_minutes && (
                        <span>{post.read_time_minutes} min leestijd</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.status === 'published' && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/blog/${post.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
