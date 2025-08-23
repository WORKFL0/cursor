'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { ServiceCategory, calculateServicePrice } from '@/lib/data/pricing-data'
import { useLanguage, useLocalizedContent } from '@/lib/contexts/language-context'

interface ServiceCalculatorProps {
  service: ServiceCategory
  quantity: number
  onQuantityChange: (quantity: number) => void
  isYearly: boolean
}

export function ServiceCalculator({ 
  service, 
  quantity, 
  onQuantityChange, 
  isYearly 
}: ServiceCalculatorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { language } = useLanguage()
  const { getLocalizedValue, getLocalizedArray } = useLocalizedContent()

  const pricing = calculateServicePrice(service, quantity, isYearly)
  const displayPrice = isYearly ? pricing.yearly : pricing.monthly

  const serviceName = getLocalizedValue(service, 'name')
  const serviceDescription = getLocalizedValue(service, 'description')
  const serviceUnit = getLocalizedValue(service, 'unit')
  const serviceFeatures = getLocalizedArray(service, 'features')

  return (
    <Card className="w-full transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{service.icon}</span>
            <div>
              <CardTitle className="text-lg">{serviceName}</CardTitle>
              <CardDescription>{serviceDescription}</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              €{displayPrice.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              {isYearly ? 'per jaar' : 'per maand'}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor={`quantity-${service.id}`} className="text-sm font-medium">
              {language === 'nl' ? 'Aantal' : 'Quantity'}: {quantity} {serviceUnit}
            </Label>
            <Badge variant="outline" className="text-xs">
              {service.minQuantity} - {service.maxQuantity} {serviceUnit}
            </Badge>
          </div>
          
          <Slider
            id={`quantity-${service.id}`}
            min={service.minQuantity}
            max={service.maxQuantity}
            step={service.id === 'cloud-storage' || service.id === 'backup-solutions' ? 50 : 1}
            value={[quantity]}
            onValueChange={(value) => onQuantityChange(value[0])}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{service.minQuantity}</span>
            <span>{service.maxQuantity}</span>
          </div>
        </div>

        {isYearly && pricing.discount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-700 font-medium">
                {language === 'nl' ? 'Jaarlijkse korting' : 'Annual discount'}:
              </span>
              <span className="text-green-600 font-bold">
                -€{pricing.discount.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-green-600 mt-1">
              {service.yearlyDiscount}% {language === 'nl' ? 'korting bij jaarlijkse betaling' : 'discount for annual billing'}
            </div>
          </motion.div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between text-muted-foreground hover:text-foreground"
        >
          <span>{language === 'nl' ? 'Toon functies' : 'Show features'}</span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-2">
                  {language === 'nl' ? 'Inbegrepen functies:' : 'Included features:'}
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {serviceFeatures.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-2"
                    >
                      <span className="text-primary mt-0.5">•</span>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}