'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, Users, Euro, Calculator, ArrowRight } from 'lucide-react'
import { servicesData, calculateServicePrice, type Service } from '@/lib/data/services-data'

interface ServicesCalculatorProps {
  initialService?: string
  onQuoteRequest?: (serviceId: string, users: number, supportType: 'remote' | 'onsite') => void
}

export default function ServicesCalculator({ 
  initialService = 'managed-it',
  onQuoteRequest 
}: ServicesCalculatorProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [users, setUsers] = useState([10])
  const [supportType, setSupportType] = useState<'remote' | 'onsite'>('remote')

  // Initialize with the initial service
  useEffect(() => {
    const service = servicesData.find(s => s.slug === initialService)
    if (service) {
      setSelectedService(service)
    }
  }, [initialService])

  const userCount = users[0] ?? 1
  const pricing = selectedService ? calculateServicePrice(selectedService, userCount, supportType) : null

  const handleServiceChange = (serviceSlug: string) => {
    const service = servicesData.find(s => s.slug === serviceSlug)
    if (service) {
      setSelectedService(service)
      // Reset support type if service doesn't support onsite
      if (service.id !== 'managed-it' && supportType === 'onsite') {
        setSupportType('remote')
      }
    }
  }

  const handleQuoteRequest = () => {
    if (selectedService && onQuoteRequest) {
      onQuoteRequest(selectedService.id, userCount, supportType)
    }
  }

  if (!selectedService || !pricing) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Service Selection */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              <CardTitle>Service Calculator</CardTitle>
            </div>
            <CardDescription>
              Bereken de kosten voor je IT-services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Service Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Selecteer Service</label>
              <Select value={selectedService.slug} onValueChange={handleServiceChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Kies een service" />
                </SelectTrigger>
                <SelectContent>
                  {servicesData.map((service) => (
                    <SelectItem key={service.slug} value={service.slug}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{service.icon}</span>
                        <span>{service.title}</span>
                        {service.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Populair
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* User Count */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Aantal Gebruikers</label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{userCount}</span>
                </div>
              </div>
              <Slider
                value={users}
                onValueChange={setUsers}
                max={100}
                min={selectedService.pricing.minimum || 1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{selectedService.pricing.minimum || 1} min</span>
                <span>100 max</span>
              </div>
            </div>

            {/* Support Type (only for Managed IT) */}
            {selectedService.id === 'managed-it' && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Support Type</label>
                <Select value={supportType} onValueChange={(value: 'remote' | 'onsite') => setSupportType(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">
                      <div className="flex flex-col">
                        <span>Remote Support - €{selectedService.pricing.remote}/gebruiker</span>
                        <span className="text-xs text-muted-foreground">Ondersteuning op afstand</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="onsite">
                      <div className="flex flex-col">
                        <span>Onsite Support - €{selectedService.pricing.onsite}/gebruiker</span>
                        <span className="text-xs text-muted-foreground">Ondersteuning op locatie</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Service Details */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{selectedService.icon}</span>
                  {selectedService.title}
                </CardTitle>
                <CardDescription className="mt-1">
                  {selectedService.shortDescription}
                </CardDescription>
              </div>
              {selectedService.popular && (
                <Badge className="bg-primary/10 text-primary">
                  Meest Gekozen
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {selectedService.description}
            </p>
            
            {/* Key Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedService.features.slice(0, 4).map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{feature.title}</span>
                </div>
              ))}
              {selectedService.features.length > 4 && (
                <div className="text-sm text-muted-foreground">
                  +{selectedService.features.length - 4} meer functies
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pricing Results */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Euro className="h-5 w-5 text-primary" />
              <CardTitle>Jouw Investering</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Monthly Costs */}
            <div className="flex justify-between items-center p-4 bg-background rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Maandelijkse Kosten</p>
                <p className="text-2xl font-bold">€{pricing.monthly.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {userCount} gebruiker{userCount !== 1 ? 's' : ''} × €
                  {selectedService.id === 'managed-it' 
                    ? selectedService.pricing[supportType]
                    : selectedService.pricing.basePrice}
                  {pricing.discount > 0 && (
                    <span className="text-green-600 ml-2">
                      (-€{pricing.discount} korting)
                    </span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Per Jaar</p>
                <p className="text-xl font-bold">€{(pricing.monthly * 12).toLocaleString()}</p>
              </div>
            </div>

            {/* Setup Costs */}
            {pricing.setup > 0 && (
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">Eenmalige Setup Kosten</span>
                <span className="font-semibold">€{pricing.setup}</span>
              </div>
            )}

            {/* Volume Discount Info */}
            {userCount >= 5 && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-400">
                    Volume Korting Actief!
                  </span>
                </div>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Je bespaart €{pricing.discount} per maand door je volume
                  {userCount >= 50 && ' (20% korting)'}
                  {userCount >= 25 && userCount < 50 && ' (15% korting)'}
                  {userCount >= 10 && userCount < 25 && ' (10% korting)'}
                  {userCount >= 5 && userCount < 10 && ' (5% korting)'}
                </p>
              </div>
            )}

            {/* CTA Button */}
            <Button 
              onClick={handleQuoteRequest}
              className="w-full" 
              size="lg"
            >
              Vraag Offerte Aan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Ontvang binnen 24 uur een persoonlijke offerte • Geen verplichtingen
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}