'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { motion } from '@/lib/framer-motion'
import { Download, Mail, Calculator, TrendingDown } from 'lucide-react'
import { PricingQuote, serviceCategories } from '@/lib/data/pricing-data'
import { useLanguage, useLocalizedContent } from '@/lib/contexts/language-context'

interface QuoteSummaryProps {
  quote: PricingQuote
  isYearly: boolean
  onExportQuote: () => void
  onEmailQuote: () => void
}

export function QuoteSummary({ 
  quote, 
  isYearly, 
  onExportQuote, 
  onEmailQuote 
}: QuoteSummaryProps) {
  const { language } = useLanguage()
  const { getLocalizedValue } = useLocalizedContent()

  const totalPrice = isYearly ? quote.totalYearly : quote.totalMonthly
  const savingsPercentage = quote.yearlyDiscount > 0 
    ? Math.round((quote.yearlyDiscount / (quote.totalMonthly * 12)) * 100) 
    : 0

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">
            {language === 'nl' ? 'Offerte Overzicht' : 'Quote Summary'}
          </CardTitle>
        </div>
        <CardDescription>
          {language === 'nl' 
            ? 'Je gepersonaliseerde IT-diensten offerte' 
            : 'Your personalized IT services quote'
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Services List */}
        <div className="space-y-3">
          {quote.services.map((quoteService) => {
            const service = serviceCategories.find(s => s.id === quoteService.serviceId)
            if (!service) return null

            const serviceName = getLocalizedValue(service as any, 'name')
            const serviceUnit = getLocalizedValue(service as any, 'unit')
            const servicePrice = isYearly ? quoteService.yearlyPrice : quoteService.monthlyPrice

            return (
              <motion.div
                key={quoteService.serviceId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{service.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{serviceName}</div>
                    <div className="text-xs text-muted-foreground">
                      {quoteService.quantity} {serviceUnit}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">
                    €{servicePrice.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isYearly ? 'per jaar' : 'per maand'}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <Separator />

        {/* Yearly Savings */}
        {isYearly && quote.yearlyDiscount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <TrendingDown className="h-4 w-4" />
              <span className="font-medium text-sm">
                {language === 'nl' ? 'Jaarlijkse Besparing' : 'Annual Savings'}
              </span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              €{quote.yearlyDiscount.toFixed(2)}
            </div>
            <div className="text-sm text-green-600">
              {savingsPercentage}% {language === 'nl' ? 'korting' : 'discount'}
            </div>
          </motion.div>
        )}

        {/* Total Price */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">
              {language === 'nl' ? 'Totaal' : 'Total'}:
            </span>
            <Badge variant={isYearly ? 'default' : 'secondary'}>
              {isYearly ? 'Jaarlijks' : 'Maandelijks'}
            </Badge>
          </div>
          <div className="text-3xl font-bold text-primary">
            €{totalPrice.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">
            {isYearly ? 'per jaar' : 'per maand'}
          </div>
        </div>

        {/* Quote Info */}
        <div className="p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
          <div className="mb-1">
            {language === 'nl' ? 'Offerte geldig tot:' : 'Quote valid until:'} {' '}
            <span className="font-medium">
              {quote.expiresAt.toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US')}
            </span>
          </div>
          <div>
            {language === 'nl' ? 'Offerte ID:' : 'Quote ID:'} {' '}
            <span className="font-mono">{quote.id}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={onExportQuote} 
            className="w-full"
            size="lg"
          >
            <Download className="h-4 w-4 mr-2" />
            {language === 'nl' ? 'Download PDF' : 'Download PDF'}
          </Button>
          
          <Button 
            onClick={onEmailQuote} 
            variant="outline" 
            className="w-full"
          >
            <Mail className="h-4 w-4 mr-2" />
            {language === 'nl' ? 'E-mail Offerte' : 'Email Quote'}
          </Button>
        </div>

        {/* Contact Info */}
        <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
          <div className="text-sm font-medium mb-2">
            {language === 'nl' ? 'Vragen over deze offerte?' : 'Questions about this quote?'}
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>📧 info@workflo.nl</div>
            <div>📞 +31 (0)20 123 4567</div>
            <div>🕒 Ma-Vr 9:00-17:00</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}