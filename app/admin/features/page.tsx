'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllFeatures } from '@/lib/features-api'
import type { Feature, FeatureStatus } from '@/types/features'

export default function FeaturesAdminPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    loadFeatures()
  }, [statusFilter, categoryFilter])

  async function loadFeatures() {
    setLoading(true)
    const filters: any = {}

    if (statusFilter !== 'all') {
      filters.status = statusFilter as FeatureStatus
    }

    if (categoryFilter !== 'all') {
      filters.category = categoryFilter
    }

    const { features: data } = await getAllFeatures(filters)
    setFeatures(data)
    setLoading(false)
  }

  const stats = {
    total: features.length,
    published: features.filter(f => f.status === 'published').length,
    draft: features.filter(f => f.status === 'draft').length,
    archived: features.filter(f => f.status === 'archived').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Features</h1>
          <p className="text-muted-foreground mt-1">
            Beheer product features voor de website
          </p>
        </div>
        <Link href="/admin/features/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nieuwe Feature
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Totaal</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Gepubliceerd</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.published}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Concept</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.draft}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Gearchiveerd</CardDescription>
            <CardTitle className="text-3xl text-gray-600">{stats.archived}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            Alle
          </Button>
          <Button
            variant={statusFilter === 'published' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('published')}
          >
            Gepubliceerd
          </Button>
          <Button
            variant={statusFilter === 'draft' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('draft')}
          >
            Concept
          </Button>
          <Button
            variant={statusFilter === 'archived' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('archived')}
          >
            Gearchiveerd
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter('all')}
          >
            Alle Categorieën
          </Button>
          <Button
            variant={categoryFilter === 'security' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter('security')}
          >
            Security
          </Button>
          <Button
            variant={categoryFilter === 'support' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter('support')}
          >
            Support
          </Button>
          <Button
            variant={categoryFilter === 'productivity' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter('productivity')}
          >
            Productivity
          </Button>
          <Button
            variant={categoryFilter === 'communication' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter('communication')}
          >
            Communication
          </Button>
        </div>
      </div>

      {/* Features Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Volgorde</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Titel</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Categorie</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Views</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Datum</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      Laden...
                    </td>
                  </tr>
                ) : features.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      Geen features gevonden
                    </td>
                  </tr>
                ) : (
                  features.map((feature) => (
                    <tr key={feature.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm font-medium">
                        {feature.display_order}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{feature.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-md">
                            {feature.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {feature.category && (
                          <Badge variant="outline" className="capitalize">
                            {feature.category}
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            feature.status === 'published'
                              ? 'default'
                              : feature.status === 'draft'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {feature.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-muted-foreground" />
                          {feature.view_count}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {feature.published_at ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(feature.published_at).toLocaleDateString('nl-NL')}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/features/${feature.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
