'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, ArrowLeft, FileText, Users, Shield, Cloud, Phone, Settings } from 'lucide-react'

interface SearchResult {
  title: string
  description: string
  url: string
  category: string
  icon: any
}

const searchableContent: SearchResult[] = [
  // Diensten
  { title: 'Managed IT Services', description: 'Complete IT-beheer voor uw organisatie', url: '/diensten/managed-it', category: 'Diensten', icon: Settings },
  { title: 'Cybersecurity', description: 'Bescherm uw bedrijf tegen digitale dreigingen', url: '/diensten/cybersecurity', category: 'Diensten', icon: Shield },
  { title: 'Cloud Oplossingen', description: 'Moderne cloud infrastructuur', url: '/diensten/cloud-oplossingen', category: 'Diensten', icon: Cloud },
  { title: 'VoIP Telefonie', description: 'Moderne zakelijke telefonie', url: '/diensten/voip-telefonie', category: 'Diensten', icon: Phone },
  { title: 'Microsoft 365', description: 'Complete Microsoft suite voor bedrijven', url: '/diensten/microsoft-365', category: 'Diensten', icon: FileText },
  
  // Sectoren
  { title: 'Architecten', description: 'IT-oplossingen voor architectenbureaus', url: '/sectoren/architecten', category: 'Sectoren', icon: Users },
  { title: 'Financiële Sector', description: 'Compliance & security voor financiële instellingen', url: '/sectoren/financiele-sector', category: 'Sectoren', icon: Users },
  { title: 'Gezondheidszorg', description: 'EPD & medische IT oplossingen', url: '/sectoren/gezondheidszorg', category: 'Sectoren', icon: Users },
  { title: 'ZZP', description: 'IT voor zelfstandig professionals', url: '/sectoren/zzp', category: 'Sectoren', icon: Users },
  
  // Over Ons
  { title: 'Over Workflo', description: 'Leer meer over ons bedrijf', url: '/over-ons', category: 'Bedrijf', icon: Users },
  { title: 'Contact', description: 'Neem contact met ons op', url: '/contact', category: 'Bedrijf', icon: Phone },
  { title: 'Nieuws', description: 'Laatste nieuws en updates', url: '/nieuws', category: 'Bedrijf', icon: FileText },
  { title: 'Support', description: '24/7 support voor onze klanten', url: '/support', category: 'Support', icon: Shield },
  { title: 'FAQ', description: 'Veelgestelde vragen', url: '/faq', category: 'Support', icon: FileText },
]

function SearchPageContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  
  useEffect(() => {
    if (query.trim()) {
      const filtered = searchableContent.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [query])

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = []
    }
    acc[result.category]?.push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Zoeken</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Zoek naar diensten, sectoren, artikelen..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-6 text-lg"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        {query.trim() && (
          <div>
            <p className="text-muted-foreground mb-6">
              {results.length} {results.length === 1 ? 'resultaat' : 'resultaten'} gevonden voor "{query}"
            </p>

            {results.length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedResults).map(([category, items]) => (
                  <div key={category}>
                    <h2 className="text-xl font-semibold mb-4 text-primary">{category}</h2>
                    <div className="grid gap-4">
                      {items.map((result, index) => (
                        <Link href={result.url} key={index}>
                          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="flex items-center gap-4 p-6">
                              <div className="flex-shrink-0">
                                <result.icon className="h-8 w-8 text-primary" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                                  {result.title}
                                </h3>
                                <p className="text-muted-foreground">
                                  {result.description}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">
                    Geen resultaten gevonden voor uw zoekopdracht.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Probeer andere zoektermen of bekijk onze populaire pagina's:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    <Link href="/diensten">
                      <Button variant="outline" size="sm">Diensten</Button>
                    </Link>
                    <Link href="/over-ons">
                      <Button variant="outline" size="sm">Over Ons</Button>
                    </Link>
                    <Link href="/contact">
                      <Button variant="outline" size="sm">Contact</Button>
                    </Link>
                    <Link href="/support">
                      <Button variant="outline" size="sm">Support</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Popular searches when no query */}
        {!query.trim() && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Populaire zoekopdrachten</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {searchableContent.slice(0, 6).map((item, index) => (
                <Link href={item.url} key={index}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="flex items-center gap-4 p-6">
                      <item.icon className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}

export const dynamic = 'force-dynamic'
