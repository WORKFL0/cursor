'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Lock, User, AlertCircle, ArrowRight, Building2, Shield, Mail, Key, LogIn, UserPlus } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('cms')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // CMS Login
  const [cmsUsername, setCmsUsername] = useState('')
  const [cmsPassword, setCmsPassword] = useState('')
  
  // Customer Portal Login (future)
  const [portalEmail, setPortalEmail] = useState('')
  const [portalPassword, setPortalPassword] = useState('')

  useEffect(() => {
    // Check if already logged in
    checkAuth()
    
    // Check for redirect parameter
    const redirect = searchParams.get('redirect')
    if (redirect?.includes('cms')) {
      setActiveTab('cms')
    }
  }, [searchParams])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/cms/auth')
      if (response.ok) {
        const data = await response.json()
        if (data.authenticated) {
          // Already logged in, redirect to appropriate page
          const redirect = searchParams.get('redirect') || '/cms'
          router.push(redirect)
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  const handleCMSLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/cms/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: cmsUsername, 
          password: cmsPassword,
          rememberMe 
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Redirect to CMS or requested page
        const redirect = searchParams.get('redirect') || '/cms'
        router.push(redirect)
      } else {
        setError(data.error || 'Ongeldige inloggegevens')
      }
    } catch (err) {
      setError('Er is iets misgegaan. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  const handlePortalLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // Future implementation for customer portal
    setTimeout(() => {
      setError('Klantportaal komt binnenkort beschikbaar')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Workflo Login</CardTitle>
          <CardDescription>
            Toegang tot uw Workflo account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cms" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                CMS
              </TabsTrigger>
              <TabsTrigger value="portal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Klantportaal
              </TabsTrigger>
            </TabsList>
            
            {/* CMS Login */}
            <TabsContent value="cms">
              <form onSubmit={handleCMSLogin} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cms-username">Gebruikersnaam</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cms-username"
                        type="text"
                        value={cmsUsername}
                        onChange={(e) => setCmsUsername(e.target.value)}
                        placeholder="admin"
                        className="pl-10"
                        required
                        autoComplete="username"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cms-password">Wachtwoord</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cms-password"
                        type="password"
                        value={cmsPassword}
                        onChange={(e) => setCmsPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10"
                        required
                        autoComplete="current-password"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember-cms"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        disabled={loading}
                      />
                      <Label htmlFor="remember-cms" className="text-sm">
                        Onthoud mij
                      </Label>
                    </div>
                    <Link href="/cms/forgot-password" className="text-sm text-primary hover:underline">
                      Wachtwoord vergeten?
                    </Link>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    'Inloggen...'
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Inloggen in CMS
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Alleen voor geautoriseerde medewerkers
              </div>
            </TabsContent>
            
            {/* Customer Portal Login */}
            <TabsContent value="portal">
              <form onSubmit={handlePortalLogin} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="portal-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="portal-email"
                        type="email"
                        value={portalEmail}
                        onChange={(e) => setPortalEmail(e.target.value)}
                        placeholder="uw@email.nl"
                        className="pl-10"
                        required
                        autoComplete="email"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portal-password">Wachtwoord</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="portal-password"
                        type="password"
                        value={portalPassword}
                        onChange={(e) => setPortalPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10"
                        required
                        autoComplete="current-password"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember-portal"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        disabled={loading}
                      />
                      <Label htmlFor="remember-portal" className="text-sm">
                        Onthoud mij
                      </Label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Wachtwoord vergeten?
                    </Link>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    'Inloggen...'
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Inloggen in Klantportaal
                    </>
                  )}
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Of
                    </span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/register">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nieuw account aanmaken
                  </Link>
                </Button>
              </form>
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Voor klanten met een service contract
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              ← Terug naar website
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export const dynamic = 'force-dynamic'
