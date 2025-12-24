'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Star, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllCases } from '@/lib/cases-api'
import type { CaseStudy, CaseStatus } from '@/types/cases'

export default function CasesAdminPage() {
  const [cases, setCases] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [industryFilter, setIndustryFilter] = useState<string>('all')

  useEffect(() => {
    loadCases()
  }, [statusFilter, industryFilter])

  async function loadCases() {
    setLoading(true)
    const filters: any = {}

    if (statusFilter !== 'all') {
      filters.status = statusFilter as CaseStatus
    }

    if (industryFilter !== 'all') {
      filters.industry = industryFilter
    }

    const { cases: data } = await getAllCases(filters)
    setCases(data)
    setLoading(false)
  }

  const stats = {
    total: cases.length,
    published: cases.filter(c => c.status === 'published').length,
    featured: cases.filter(c => c.is_featured).length,
    draft: cases.filter(c => c.status === 'draft').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Case Studies</h1>
          <p className="text-muted-foreground mt-1">
            Beheer klant success stories
          </p>
        </div>
        <Link href="/admin/cases/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nieuwe Case
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
            <CardDescription>Featured</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.featured}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Concept</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.draft}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
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
        </div>

        <div className="flex gap-2">
          <Button
            variant={industryFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIndustryFilter('all')}
          >
            Alle Sectoren
          </Button>
          <Button
            variant={industryFilter === 'healthcare' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIndustryFilter('healthcare')}
          >
            Healthcare
          </Button>
          <Button
            variant={industryFilter === 'finance' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIndustryFilter('finance')}
          >
            Finance
          </Button>
          <Button
            variant={industryFilter === 'retail' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIndustryFilter('retail')}
          >
            Retail
          </Button>
        </div>
      </div>

      {/* Cases Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Client</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Titel</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Sector</th>
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
                ) : cases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      Geen cases gevonden
                    </td>
                  </tr>
                ) : (
                  cases.map((caseStudy) => (
                    <tr key={caseStudy.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {caseStudy.is_featured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                          <div className="font-medium">{caseStudy.client_name}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{caseStudy.title}</div>
                          {caseStudy.tagline && (
                            <div className="text-sm text-muted-foreground truncate max-w-md">
                              {caseStudy.tagline}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {caseStudy.client_industry && (
                          <Badge variant="outline" className="capitalize">
                            {caseStudy.client_industry}
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            caseStudy.status === 'published'
                              ? 'default'
                              : caseStudy.status === 'draft'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {caseStudy.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-muted-foreground" />
                          {caseStudy.view_count}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {caseStudy.published_at ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(caseStudy.published_at).toLocaleDateString('nl-NL')}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/cases/${caseStudy.id}`}>
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
