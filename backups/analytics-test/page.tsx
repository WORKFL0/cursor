'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAnalytics } from '@/hooks/use-analytics'
import { consentManager, CookieConsent } from '@/lib/analytics'
import { analyticsConfig } from '@/lib/analytics/config'
import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, XCircle, AlertCircle, Activity } from 'lucide-react'

export default function AnalyticsTestPage() {
  const { 
    trackEvent, 
    trackFormSubmit, 
    trackServicePageView,
    trackDownload,
    trackPricingCalculator,
    trackNewsletterSignup,
    trackAppointmentBooked 
  } = useAnalytics()
  const [consentStatus, setConsentStatus] = useState<CookieConsent | null>(null)
  const [testLog, setTestLog] = useState<string[]>([])

  useEffect(() => {
    const consent = consentManager.getConsent()
    setConsentStatus(consent)
    addLog(`Consent checked: ${consent ? JSON.stringify(consent) : 'No consent'}`)
  }, [addLog])

  const addLog = useCallback((message: string) => {
    setTestLog(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 10))
    console.log(`[Analytics Test] ${message}`)
  }, [])

  const checkConsent = () => {
    const consent = consentManager.getConsent()
    setConsentStatus(consent)
    addLog(`Consent checked: ${consent ? JSON.stringify(consent) : 'No consent'}`)
  }

  const acceptAllConsent = () => {
    consentManager.acceptAll()
    addLog('All cookies accepted')
    setTimeout(() => window.location.reload(), 1000)
  }

  const rejectAllConsent = () => {
    consentManager.rejectAll()
    addLog('All non-essential cookies rejected')
    checkConsent()
  }

  const clearConsent = () => {
    consentManager.clearConsent()
    addLog('Consent cleared - reloading page')
    setTimeout(() => window.location.reload(), 500)
  }

  const testAllTracking = () => {
    addLog('Starting comprehensive tracking test...')
    
    // Test various events
    trackEvent('test_comprehensive', { test_id: Date.now() })
    trackFormSubmit('Test Form', 'contact')
    trackServicePageView('managed-it')
    trackDownload('test-document.pdf', 'whitepaper')
    trackPricingCalculator(['managed-it', 'cybersecurity'], 3500)
    trackNewsletterSignup('test@example.com')
    trackAppointmentBooked('IT Consultation', new Date().toISOString())
    
    addLog('All tracking events fired - check your analytics dashboards')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Analytics Testing Dashboard</h1>
          <p className="text-muted-foreground">Test and verify all analytics tracking implementations</p>
        </div>
        
        <div className="grid gap-6 max-w-6xl mx-auto">
          {/* Configuration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Analytics Configuration Status
              </CardTitle>
              <CardDescription>
                Real-time status of all tracking services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">GA4</div>
                  <Badge variant={analyticsConfig.ga4.enabled ? 'default' : 'secondary'}>
                    {analyticsConfig.ga4.enabled ? (
                      <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                    ) : (
                      <><XCircle className="w-3 h-3 mr-1" /> Inactive</>
                    )}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Hotjar</div>
                  <Badge variant={analyticsConfig.hotjar.enabled ? 'default' : 'secondary'}>
                    {analyticsConfig.hotjar.enabled ? (
                      <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                    ) : (
                      <><XCircle className="w-3 h-3 mr-1" /> Inactive</>
                    )}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">LinkedIn</div>
                  <Badge variant={analyticsConfig.linkedin.enabled ? 'default' : 'secondary'}>
                    {analyticsConfig.linkedin.enabled ? (
                      <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                    ) : (
                      <><XCircle className="w-3 h-3 mr-1" /> Inactive</>
                    )}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Facebook</div>
                  <Badge variant={analyticsConfig.facebook.enabled ? 'default' : 'secondary'}>
                    {analyticsConfig.facebook.enabled ? (
                      <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                    ) : (
                      <><XCircle className="w-3 h-3 mr-1" /> Inactive</>
                    )}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Clarity</div>
                  <Badge variant={analyticsConfig.clarity.enabled ? 'default' : 'secondary'}>
                    {analyticsConfig.clarity.enabled ? (
                      <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                    ) : (
                      <><XCircle className="w-3 h-3 mr-1" /> Inactive</>
                    )}
                  </Badge>
                </div>
              </div>
              {!consentStatus?.analytics && !consentStatus?.marketing && consentStatus !== null && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Analytics tracking is disabled. Accept cookies to enable tracking.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Consent Management */}
            <Card>
              <CardHeader>
                <CardTitle>Cookie Consent Management</CardTitle>
                <CardDescription>
                  Manage cookie preferences for testing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {consentStatus ? (
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={consentStatus.necessary ? 'default' : 'secondary'}>
                        Necessary: {consentStatus.necessary ? 'Accepted' : 'Rejected'}
                      </Badge>
                      <Badge variant={consentStatus.analytics ? 'default' : 'secondary'}>
                        Analytics: {consentStatus.analytics ? 'Accepted' : 'Rejected'}
                      </Badge>
                      <Badge variant={consentStatus.marketing ? 'default' : 'secondary'}>
                        Marketing: {consentStatus.marketing ? 'Accepted' : 'Rejected'}
                      </Badge>
                      <Badge variant={consentStatus.preferences ? 'default' : 'secondary'}>
                        Preferences: {consentStatus.preferences ? 'Accepted' : 'Rejected'}
                      </Badge>
                    </div>
                  ) : (
                    <Badge variant="destructive">No consent given</Badge>
                  )}
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={acceptAllConsent} variant="default" className="w-full">
                    Accept All
                  </Button>
                  <Button onClick={rejectAllConsent} variant="secondary" className="w-full">
                    Reject All
                  </Button>
                  <Button onClick={checkConsent} variant="outline" className="w-full">
                    Refresh Status
                  </Button>
                  <Button onClick={clearConsent} variant="destructive" className="w-full">
                    Clear & Reload
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Event Tracking Tests */}
            <Card>
              <CardHeader>
                <CardTitle>Event Tracking Tests</CardTitle>
                <CardDescription>
                  Test individual tracking events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={testAllTracking}
                  className="w-full"
                  size="lg"
                >
                  Run All Tests
                </Button>
                
                <Separator />
                
                <div className="grid gap-2">
                  <Button 
                    onClick={() => {
                      trackEvent('test_button_click', { button: 'test_1', timestamp: Date.now() })
                      addLog('Custom event tracked: test_button_click')
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Custom Event
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      trackFormSubmit('Test Form', 'contact')
                      addLog('Form submission tracked: contact form')
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Form Submit
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      trackServicePageView('managed-it')
                      addLog('Service page view tracked: managed-it')
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Service View
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      trackDownload('test-file.pdf', 'whitepaper')
                      addLog('Download tracked: test-file.pdf')
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Download
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      trackPricingCalculator(['managed-it', 'cloud'], 2500)
                      addLog('Pricing calculator tracked: €2500')
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Pricing Calculator
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      trackNewsletterSignup('test@example.com')
                      addLog('Newsletter signup tracked')
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Newsletter Signup
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      trackAppointmentBooked('IT Consultation', new Date().toISOString())
                      addLog('Appointment booking tracked')
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Appointment Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Log */}
          <Card>
            <CardHeader>
              <CardTitle>Test Activity Log</CardTitle>
              <CardDescription>
                Recent tracking events and actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testLog.length > 0 ? (
                <div className="space-y-1 font-mono text-sm">
                  {testLog.map((log, i) => (
                    <div key={i} className="p-2 bg-muted rounded">
                      {log}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No activity yet. Run some tests to see logs.</p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Testing Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm font-semibold">Setup:</p>
                <ol className="list-decimal pl-5 text-sm space-y-1">
                  <li>Add tracking IDs to .env.local</li>
                  <li>Restart the development server</li>
                  <li>Accept all cookies when prompted</li>
                </ol>
                
                <Separator />
                
                <p className="text-sm font-semibold">Verification:</p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li><strong>GA4:</strong> Realtime → Events</li>
                  <li><strong>Hotjar:</strong> Dashboard → Recordings</li>
                  <li><strong>LinkedIn:</strong> Campaign Manager → Website Demographics</li>
                  <li><strong>Facebook:</strong> Events Manager → Test Events</li>
                  <li><strong>Clarity:</strong> Dashboard → Sessions</li>
                </ul>
                
                <Separator />
                
                <p className="text-sm font-semibold">Debug:</p>
                <p className="text-sm">Open DevTools Console (F12) to see detailed tracking logs</p>
              </CardContent>
            </Card>

            {/* Environment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Environment Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between p-2 rounded bg-muted">
                      <span className="text-sm font-medium">GA4 Measurement ID</span>
                      {process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ? (
                        <Badge variant="default">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Configured
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          Missing
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded bg-muted">
                      <span className="text-sm font-medium">Hotjar Site ID</span>
                      {process.env.NEXT_PUBLIC_HOTJAR_SITE_ID ? (
                        <Badge variant="default">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Configured
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          Missing
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded bg-muted">
                      <span className="text-sm font-medium">LinkedIn Partner ID</span>
                      {process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID ? (
                        <Badge variant="default">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Configured
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          Missing
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded bg-muted">
                      <span className="text-sm font-medium">Facebook Pixel ID</span>
                      {process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ? (
                        <Badge variant="default">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Configured
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          Missing
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded bg-muted">
                      <span className="text-sm font-medium">Clarity Project ID</span>
                      {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ? (
                        <Badge variant="default">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Configured
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          Missing
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {(!process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || 
                    !process.env.NEXT_PUBLIC_HOTJAR_SITE_ID ||
                    !process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID ||
                    !process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ||
                    !process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID) && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Some tracking IDs are missing. Add them to your .env.local file.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}