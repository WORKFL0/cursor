'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CreateFeatureInput, FeatureStatus, FeatureCategory, Feature } from '@/types/features'

export default function EditFeaturePage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<CreateFeatureInput>({
    title: '',
    slug: '',
    description: '',
    icon_name: '',
    icon_url: '',
    image_url: '',
    video_url: '',
    category: 'security',
    display_order: 0,
    status: 'draft',
    meta_title: '',
    meta_description: '',
  })

  useEffect(() => {
    async function loadFeature() {
      try {
        const token = localStorage.getItem('admin_token')
        const response = await fetch(`/api/admin/features/${id}`, {
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {}
        })

        if (!response.ok) {
          throw new Error('Failed to load feature')
        }

        const feature: Feature = await response.json()

        setFormData({
          title: feature.title,
          slug: feature.slug,
          description: feature.description,
          icon_name: feature.icon_name || '',
          icon_url: feature.icon_url || '',
          image_url: feature.image_url || '',
          video_url: feature.video_url || '',
          category: feature.category || 'security',
          display_order: feature.display_order || 0,
          status: feature.status,
          meta_title: feature.meta_title || '',
          meta_description: feature.meta_description || '',
        })
      } catch (err) {
        console.error('Error loading feature:', err)
        setError('Feature kon niet worden geladen')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadFeature()
    }
  }, [id])

  const handleChange = (field: keyof CreateFeatureInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(status?: FeatureStatus) {
    setSaving(true)
    setError(null)

    try {
      const token = localStorage.getItem('admin_token')

      const input: CreateFeatureInput = {
        ...formData,
        status: status || formData.status,
        display_order: parseInt(formData.display_order?.toString() || '0'),
      }

      const response = await fetch(`/api/admin/features/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error('Failed to update feature')
      }

      router.push('/admin/features')
    } catch (err) {
      console.error('Error saving feature:', err)
      setError('Er is een fout opgetreden bij het opslaan')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Weet je zeker dat je deze feature wilt verwijderen?')) {
      return
    }

    setDeleting(true)
    setError(null)

    try {
      const token = localStorage.getItem('admin_token')

      const response = await fetch(`/api/admin/features/${id}`, {
        method: 'DELETE',
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      })

      if (!response.ok) {
        throw new Error('Failed to delete feature')
      }

      router.push('/admin/features')
    } catch (err) {
      console.error('Error deleting feature:', err)
      setError('Er is een fout opgetreden bij het verwijderen')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/features">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Feature Bewerken</h1>
            <p className="text-muted-foreground mt-1">
              Wijzig de product feature
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {deleting ? 'Verwijderen...' : 'Verwijderen'}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Informatie</CardTitle>
              <CardDescription>Basis informatie over de feature</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="24/7 Proactieve Monitoring"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="24-7-proactieve-monitoring"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  URL-vriendelijke versie van de titel
                </p>
              </div>

              <div>
                <Label htmlFor="description">Beschrijving *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  placeholder="Ons monitoring systeem houdt je IT-infrastructuur dag en nacht in de gaten..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="icon_name">Lucide Icon</Label>
                  <Input
                    id="icon_name"
                    value={formData.icon_name}
                    onChange={(e) => handleChange('icon_name', e.target.value)}
                    placeholder="Shield"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Bijvoorbeeld: Shield, Clock, Lock
                  </p>
                </div>

                <div>
                  <Label htmlFor="icon_url">Icon URL (alternatief)</Label>
                  <Input
                    id="icon_url"
                    value={formData.icon_url}
                    onChange={(e) => handleChange('icon_url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">Afbeelding URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => handleChange('image_url', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <Label htmlFor="video_url">Video URL</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => handleChange('video_url', e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
              <CardDescription>Zoekmachine optimalisatie</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title">Meta Titel</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => handleChange('meta_title', e.target.value)}
                  placeholder="24/7 Monitoring | Workflo Features"
                />
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Beschrijving</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  rows={3}
                  placeholder="Altijd up-to-date met onze 24/7 proactieve monitoring..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publicatie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value as FeatureStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Concept</SelectItem>
                    <SelectItem value="published">Gepubliceerd</SelectItem>
                    <SelectItem value="archived">Gearchiveerd</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Categorie</Label>
                <Select
                  value={formData.category || 'security'}
                  onValueChange={(value) => handleChange('category', value as FeatureCategory)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="display_order">Volgorde</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => handleChange('display_order', parseInt(e.target.value))}
                  min="0"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Lagere nummers komen eerst
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => handleSubmit('published')}
              disabled={saving || !formData.title || !formData.slug || !formData.description}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Opslaan...' : 'Publiceren'}
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleSubmit('draft')}
              disabled={saving || !formData.title || !formData.slug || !formData.description}
            >
              Opslaan als Concept
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
