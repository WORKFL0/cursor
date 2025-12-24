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
import { Checkbox } from '@/components/ui/checkbox'
import { createCase } from '@/lib/cases-api'
import type { CreateCaseStudyInput, CaseStatus, ClientIndustry, ClientSize } from '@/types/cases'

export default function NewCasePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<CreateCaseStudyInput>({
    client_name: '',
    title: '',
    slug: '',
    challenge: '',
    solution: '',
    results: '',
    client_industry: 'healthcare',
    client_size: '10-50',
    tagline: '',
    testimonial: '',
    testimonial_author: '',
    testimonial_role: '',
    featured_image_url: '',
    is_featured: false,
    display_order: 0,
    status: 'draft',
  })

  const handleChange = (field: keyof CreateCaseStudyInput, value: any) => {
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

  async function handleSubmit(status: CaseStatus) {
    setSaving(true)
    setError(null)

    try {
      const input: CreateCaseStudyInput = {
        ...formData,
        status,
        display_order: parseInt(formData.display_order?.toString() || '0'),
      }

      const result = await createCase(input)

      if (result) {
        router.push('/admin/cases')
      } else {
        setError('Er is een fout opgetreden bij het opslaan')
      }
    } catch (err) {
      console.error('Error saving case:', err)
      setError('Er is een fout opgetreden bij het opslaan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/cases">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nieuwe Case Study</h1>
          <p className="text-muted-foreground mt-1">
            Voeg een nieuwe klant success story toe
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
              <CardTitle>Client Informatie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="client_name">Client Naam *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => handleChange('client_name', e.target.value)}
                  placeholder="MediCare Kliniek Amsterdam"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="client_industry">Sector</Label>
                  <Select
                    value={formData.client_industry}
                    onValueChange={(value) => handleChange('client_industry', value as ClientIndustry)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="client_size">Grootte</Label>
                  <Select
                    value={formData.client_size}
                    onValueChange={(value) => handleChange('client_size', value as ClientSize)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10</SelectItem>
                      <SelectItem value="10-50">10-50</SelectItem>
                      <SelectItem value="50-200">50-200</SelectItem>
                      <SelectItem value="200+">200+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="client_location">Locatie</Label>
                  <Input
                    id="client_location"
                    value={formData.client_location || ''}
                    onChange={(e) => handleChange('client_location', e.target.value)}
                    placeholder="Amsterdam"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Case Study Inhoud</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Van Onveilig naar ISO 27001 Compliant in 6 Maanden"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="medicare-kliniek-iso-27001"
                  required
                />
              </div>

              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  placeholder="Hoe een medische kliniek volledige compliance behaalde"
                />
              </div>

              <div>
                <Label htmlFor="challenge">Uitdaging *</Label>
                <Textarea
                  id="challenge"
                  value={formData.challenge}
                  onChange={(e) => handleChange('challenge', e.target.value)}
                  rows={4}
                  placeholder="Beschrijf het probleem dat de klant had..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="solution">Oplossing *</Label>
                <Textarea
                  id="solution"
                  value={formData.solution}
                  onChange={(e) => handleChange('solution', e.target.value)}
                  rows={6}
                  placeholder="Beschrijf wat Workflo heeft gedaan..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="results">Resultaten *</Label>
                <Textarea
                  id="results"
                  value={formData.results}
                  onChange={(e) => handleChange('results', e.target.value)}
                  rows={4}
                  placeholder="Beschrijf de behaalde resultaten..."
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Testimonial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="testimonial">Quote</Label>
                <Textarea
                  id="testimonial"
                  value={formData.testimonial}
                  onChange={(e) => handleChange('testimonial', e.target.value)}
                  rows={3}
                  placeholder="Workflo heeft ons compleet ontzorgd..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="testimonial_author">Auteur</Label>
                  <Input
                    id="testimonial_author"
                    value={formData.testimonial_author}
                    onChange={(e) => handleChange('testimonial_author', e.target.value)}
                    placeholder="Dr. Sarah van Dijk"
                  />
                </div>

                <div>
                  <Label htmlFor="testimonial_role">Functie</Label>
                  <Input
                    id="testimonial_role"
                    value={formData.testimonial_role}
                    onChange={(e) => handleChange('testimonial_role', e.target.value)}
                    placeholder="Directeur"
                  />
                </div>
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
                  onValueChange={(value) => handleChange('status', value as CaseStatus)}
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
                <Label htmlFor="display_order">Volgorde</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => handleChange('display_order', parseInt(e.target.value))}
                  min="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleChange('is_featured', checked)}
                />
                <Label htmlFor="is_featured" className="cursor-pointer">
                  Featured (toon op homepage)
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="featured_image_url">Featured Image URL</Label>
                <Input
                  id="featured_image_url"
                  value={formData.featured_image_url}
                  onChange={(e) => handleChange('featured_image_url', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <Label htmlFor="client_logo_url">Client Logo URL</Label>
                <Input
                  id="client_logo_url"
                  value={formData.client_logo_url || ''}
                  onChange={(e) => handleChange('client_logo_url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => handleSubmit('published')}
              disabled={saving || !formData.client_name || !formData.title || !formData.challenge || !formData.solution || !formData.results}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Opslaan...' : 'Publiceren'}
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleSubmit('draft')}
              disabled={saving || !formData.client_name || !formData.title || !formData.challenge || !formData.solution || !formData.results}
            >
              Opslaan als Concept
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
