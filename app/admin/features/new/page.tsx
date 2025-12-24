'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createFeature } from '@/lib/features-api'
import type { CreateFeatureInput, FeatureStatus, FeatureCategory } from '@/types/features'

export default function NewFeaturePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
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

  const handleChange = (field: keyof CreateFeatureInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Auto-generate slug from title
    if (field === 'title' && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  async function handleSubmit(status: FeatureStatus) {
    setSaving(true)
    setError(null)

    try {
      const input: CreateFeatureInput = {
        ...formData,
        status,
        display_order: parseInt(formData.display_order?.toString() || '0'),
      }

      const result = await createFeature(input)

      if (result) {
        router.push('/admin/features')
      } else {
        setError('Er is een fout opgetreden bij het opslaan')
      }
    } catch (err) {
      console.error('Error saving feature:', err)
      setError('Er is een fout opgetreden bij het opslaan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/features">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nieuwe Feature</h1>
          <p className="text-muted-foreground mt-1">
            Voeg een nieuwe product feature toe
          </p>
        </div>
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
