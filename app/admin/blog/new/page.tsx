'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Send, Calendar, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
import { generateSlug } from '@/lib/blog-api'
import type { BlogCategory, BlogAuthor } from '@/types/blog'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [authors, setAuthors] = useState<BlogAuthor[]>([])

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category_id: '',
    author_id: '',
    meta_title: '',
    meta_description: '',
    tags: [] as string[],
    publish_to_linkedin: false,
    publish_to_email: false,
    status: 'draft' as 'draft' | 'published' | 'scheduled',
  })

  const [tagsInput, setTagsInput] = useState('')

  useEffect(() => {
    loadMetadata()
  }, [])

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title)
      }))
    }
  }, [formData.title])

  async function loadMetadata() {
    try {
      const [categoriesRes, authorsRes] = await Promise.all([
        supabase.from('blog_categories').select('*').order('name'),
        supabase.from('blog_authors').select('*').eq('is_active', true).order('display_name'),
      ])

      if (categoriesRes.data) setCategories(categoriesRes.data)
      if (authorsRes.data) setAuthors(authorsRes.data)

      // Set default author
      if (authorsRes.data && authorsRes.data.length > 0) {
        setFormData(prev => ({ ...prev, author_id: (authorsRes.data![0] as any).id || '' }))
      }
    } catch (error) {
      console.error('Error loading metadata:', error)
    }
  }

  async function handleSubmit(status: 'draft' | 'published' = 'draft') {
    if (!formData.title || !formData.content) {
      alert('Vul minimaal een titel en content in')
      return
    }

    setLoading(true)

    try {
      const postData = {
        ...formData,
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([postData])
        .select()
        .single()

      if (error) throw error

      alert(status === 'published' ? 'Artikel gepubliceerd!' : 'Concept opgeslagen!')
      router.push('/admin/blog')
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Fout bij opslaan artikel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Nieuw Blog Artikel</h1>
          <p className="text-muted-foreground mt-1">
            Schrijf en publiceer naar website, LinkedIn en email
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit('draft')}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            Opslaan als concept
          </Button>
          <Button
            onClick={() => handleSubmit('published')}
            disabled={loading}
          >
            <Send className="h-4 w-4 mr-2" />
            Publiceren
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Artikel Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  placeholder="Bijv: Nieuwe Cybersecurity Dreiging in 2025"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="text-2xl font-bold"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  placeholder="nieuwe-cybersecurity-dreiging-2025"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Preview: workflo.it/blog/{formData.slug || 'slug'}
                </p>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Samenvatting (voor LinkedIn/Email)</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Korte samenvatting van het artikel (160-200 karakters)"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.excerpt.length} / 200 karakters
                </p>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Schrijf hier je artikel... (Markdown supported)"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={20}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.content.split(/\s+/).length} woorden (~
                  {Math.ceil(formData.content.split(/\s+/).length / 200)} min leestijd)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Instellingen</CardTitle>
              <CardDescription>Optimaliseer voor zoekmachines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Titel</Label>
                <Input
                  id="meta_title"
                  placeholder="Gebruikt artikel titel indien leeg"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Beschrijving</Label>
                <Textarea
                  id="meta_description"
                  placeholder="Gebruikt excerpt indien leeg"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Instellingen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Categorie</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer categorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Author */}
              <div className="space-y-2">
                <Label htmlFor="author">Auteur</Label>
                <Select
                  value={formData.author_id}
                  onValueChange={(value) => setFormData({ ...formData, author_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer auteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((author) => (
                      <SelectItem key={author.id} value={author.id}>
                        {author.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="cybersecurity, tips, microsoft"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </div>

              {/* Featured Image */}
              <div className="space-y-2">
                <Label htmlFor="featured_image">Featured Image URL</Label>
                <Input
                  id="featured_image"
                  placeholder="https://..."
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                />
                {formData.featured_image && (
                  <img
                    src={formData.featured_image}
                    alt="Preview"
                    className="w-full rounded-lg mt-2"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Multi-channel Publishing */}
          <Card>
            <CardHeader>
              <CardTitle>Publicatie Kanalen</CardTitle>
              <CardDescription>Waar wil je dit artikel plaatsen?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="publish_to_linkedin">LinkedIn</Label>
                  <p className="text-xs text-muted-foreground">
                    Ook posten op LinkedIn company page
                  </p>
                </div>
                <Switch
                  id="publish_to_linkedin"
                  checked={formData.publish_to_linkedin}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, publish_to_linkedin: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="publish_to_email">Email Campagne</Label>
                  <p className="text-xs text-muted-foreground">
                    Versturen via HubSpot nieuwsbrief
                  </p>
                </div>
                <Switch
                  id="publish_to_email"
                  checked={formData.publish_to_email}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, publish_to_email: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
