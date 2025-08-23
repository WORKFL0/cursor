'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Cookie, Shield, BarChart3, Target } from 'lucide-react'
import Cookies from 'js-cookie'
import { useLanguage } from '@/lib/contexts/language-context'

interface CookieConsent {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

const COOKIE_CONSENT_KEY = 'workflo-cookie-consent'
const COOKIE_CONSENT_VERSION = '1.0'

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false
  })
  const { language } = useLanguage()

  useEffect(() => {
    // Check if user has already given consent
    const existingConsent = Cookies.get(COOKIE_CONSENT_KEY)
    if (!existingConsent) {
      // Delay showing banner slightly for better UX
      const timer = setTimeout(() => setShowBanner(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const saveConsent = (consentData: CookieConsent) => {
    const consentWithVersion = {
      ...consentData,
      version: COOKIE_CONSENT_VERSION,
      timestamp: new Date().toISOString()
    }
    
    Cookies.set(COOKIE_CONSENT_KEY, JSON.stringify(consentWithVersion), { 
      expires: 365, // 1 year
      sameSite: 'lax',
      secure: true
    })
    
    setShowBanner(false)

    // Trigger any analytics/marketing scripts based on consent
    if (consentData.analytics) {
      // Enable Google Analytics or other analytics
      console.log('Analytics consent granted')
    }
    
    if (consentData.marketing) {
      // Enable marketing pixels, etc.
      console.log('Marketing consent granted')
    }
  }

  const acceptAll = () => {
    const fullConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    }
    saveConsent(fullConsent)
  }

  const acceptSelected = () => {
    saveConsent(consent)
  }

  const rejectAll = () => {
    const minimalConsent: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    }
    saveConsent(minimalConsent)
  }

  if (!showBanner) return null

  const content = {
    nl: {
      title: 'Cookie Voorkeuren',
      description: 'Wij gebruiken cookies om je ervaring te verbeteren en onze diensten te optimaliseren.',
      necessary: 'Noodzakelijk',
      necessaryDesc: 'Deze cookies zijn essentieel voor het functioneren van de website.',
      analytics: 'Analytics',
      analyticsDesc: 'Helpen ons begrijpen hoe bezoekers onze website gebruiken.',
      marketing: 'Marketing',
      marketingDesc: 'Gebruikt voor gepersonaliseerde advertenties en tracking.',
      preferences: 'Voorkeuren',
      preferencesDesc: 'Onthouden je voorkeuren en instellingen.',
      acceptAll: 'Alles Accepteren',
      acceptSelected: 'Geselecteerde Accepteren',
      rejectAll: 'Alles Weigeren',
      customize: 'Aanpassen',
      close: 'Sluiten'
    },
    en: {
      title: 'Cookie Preferences',
      description: 'We use cookies to enhance your experience and optimize our services.',
      necessary: 'Necessary',
      necessaryDesc: 'These cookies are essential for the website to function.',
      analytics: 'Analytics',
      analyticsDesc: 'Help us understand how visitors use our website.',
      marketing: 'Marketing',
      marketingDesc: 'Used for personalized advertising and tracking.',
      preferences: 'Preferences',
      preferencesDesc: 'Remember your preferences and settings.',
      acceptAll: 'Accept All',
      acceptSelected: 'Accept Selected',
      rejectAll: 'Reject All',
      customize: 'Customize',
      close: 'Close'
    }
  }

  const t = content[language as keyof typeof content] || content.en

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start space-y-0 pb-4">
          <div className="flex-1 space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              {t.title}
            </CardTitle>
            <CardDescription>
              {t.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!showDetails ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={acceptAll} className="flex-1">
                {t.acceptAll}
              </Button>
              <Button onClick={rejectAll} variant="outline" className="flex-1">
                {t.rejectAll}
              </Button>
              <Button 
                onClick={() => setShowDetails(true)} 
                variant="ghost" 
                className="flex-1"
              >
                {t.customize}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{t.necessary}</span>
                    <Badge variant="secondary">Required</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.necessaryDesc}</p>
                </div>
                <div className="ml-3">
                  <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{t.analytics}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.analyticsDesc}</p>
                </div>
                <label className="ml-3 flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent.analytics}
                    onChange={(e) => setConsent(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 ${consent.analytics ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}></div>
                </label>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">{t.marketing}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.marketingDesc}</p>
                </div>
                <label className="ml-3 flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent.marketing}
                    onChange={(e) => setConsent(prev => ({ ...prev, marketing: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 ${consent.marketing ? 'bg-purple-600 border-purple-600' : 'border-gray-300'}`}></div>
                </label>
              </div>

              {/* Preferences Cookies */}
              <div className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Cookie className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">{t.preferences}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.preferencesDesc}</p>
                </div>
                <label className="ml-3 flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent.preferences}
                    onChange={(e) => setConsent(prev => ({ ...prev, preferences: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 ${consent.preferences ? 'bg-orange-600 border-orange-600' : 'border-gray-300'}`}></div>
                </label>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={acceptSelected} className="flex-1">
                  {t.acceptSelected}
                </Button>
                <Button onClick={rejectAll} variant="outline" className="flex-1">
                  {t.rejectAll}
                </Button>
                <Button 
                  onClick={() => setShowDetails(false)} 
                  variant="ghost"
                  className="flex-1"
                >
                  {t.close}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}