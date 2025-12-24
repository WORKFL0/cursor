'use client'

import { useState, useMemo } from 'react'
import { motion } from '@/lib/framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Calculator,
  Users,
  CheckCircle,
  XCircle,
  Star,
  TrendingDown,
  AlertCircle,
  Zap,
  Target,
  Clock,
  Shield,
  Euro,
  Award,
  Sparkles,
  ArrowRight,
  Calendar,
  BarChart3,
} from 'lucide-react'
import {
  WORKFLO_PRICING,
  calculateAdhocPricing,
  calculatePrepaidPricing,
  calculateMSPPricing,
  calculateSavings,
  formatEuro,
  type MSPType,
  type SLALevel,
} from '@/config/pricing'

interface WorkfloPricingCalculatorProps {
  defaultUsers?: number
}

// Helper functions for discount tier calculations
function getNextDiscountTier(currentUsers: number): number {
  if (currentUsers < 10) return 10
  if (currentUsers < 25) return 25
  if (currentUsers < 50) return 50
  if (currentUsers < 100) return 100
  return currentUsers
}

function getNextDiscountPercent(currentUsers: number): number {
  if (currentUsers < 10) return 5
  if (currentUsers < 25) return 10
  if (currentUsers < 50) return 15
  if (currentUsers < 100) return 20
  return 20
}

export default function WorkfloPricingCalculator({
  defaultUsers = 10,
}: WorkfloPricingCalculatorProps) {
  // User inputs
  const [users, setUsers] = useState(defaultUsers)
  const [mspType, setMSPType] = useState<MSPType>('remote')
  const [slaLevel, setSLALevel] = useState<SLALevel>('standard')

  // Calculate all pricing models
  const adhocPricing = useMemo(
    () => calculateAdhocPricing({ users }),
    [users]
  )

  const prepaidPricing = useMemo(
    () => calculatePrepaidPricing({ users, bundleIndex: 1 }), // 20h bundle
    [users]
  )

  const mspPricing = useMemo(
    () => calculateMSPPricing({ users, mspType, slaLevel }),
    [users, mspType, slaLevel]
  )

  const savings = useMemo(
    () => calculateSavings(mspPricing.monthlyTotal, adhocPricing.monthlyTotal),
    [mspPricing.monthlyTotal, adhocPricing.monthlyTotal]
  )

  // Volume discount percentage
  const volumeDiscountPercent = Math.round(mspPricing.breakdown.volumeDiscount * 100)

  return (
    <div className="w-full space-y-8">
      {/* User Input Section */}
      <Card className="border-2 border-workflo-yellow bg-gradient-to-br from-workflo-yellow/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="w-6 h-6 text-workflo-yellow" />
            Hoeveel gebruikers heeft je bedrijf?
          </CardTitle>
          <CardDescription>
            Pas de slider aan voor een nauwkeurige prijsberekening
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-lg font-semibold">Aantal gebruikers</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={users}
                onChange={(e) => setUsers(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 text-center text-xl font-bold border-2"
                min={1}
                max={100}
              />
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <Slider
            value={[users]}
            onValueChange={(value) => setUsers(value[0] ?? 1)}
            max={100}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>1</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
          {volumeDiscountPercent > 0 && (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                      Volume korting: {volumeDiscountPercent}%
                    </p>
                    <p className="text-xs text-green-600">
                      Je bespaart €{Math.round(mspPricing.breakdown.discountAmount || 0)}/maand
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {users >= 100 ? '🎉 Maximum korting bereikt!' : `Bij ${getNextDiscountTier(users)} gebruikers krijg je ${getNextDiscountPercent(users)}% korting`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contract/Commitment Info */}
      <Card className="bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/20 border-blue-200">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="font-semibold text-sm">Maandelijks opzegbaar</p>
              <p className="text-xs text-muted-foreground">30 dagen opzegtermijn</p>
            </div>
            <div>
              <Shield className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="font-semibold text-sm">Geen lange verplichtingen</p>
              <p className="text-xs text-muted-foreground">Flexibel aanpasbaar</p>
            </div>
            <div>
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="font-semibold text-sm">Direct actief</p>
              <p className="text-xs text-muted-foreground">Setup binnen 48 uur</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Cards - 3 Columns */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* AD-HOC SUPPORT - Least Attractive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full border-2 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  Reactief
                </Badge>
              </div>
              <CardTitle className="text-xl">
                {WORKFLO_PRICING.adhoc.nameNL}
              </CardTitle>
              <CardDescription>
                {WORKFLO_PRICING.adhoc.descriptionNL}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pricing */}
              <div className="space-y-1">
                <div className="text-3xl font-bold text-foreground">
                  €{WORKFLO_PRICING.adhoc.hourlyRate}
                  <span className="text-lg text-muted-foreground font-normal">/uur</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Geschat: {formatEuro(adhocPricing.monthlyTotal)}/maand
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Inbegrepen:</h4>
                {WORKFLO_PRICING.adhoc.featuresNL.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Risks */}
              <div className="space-y-2 pt-2 border-t">
                <h4 className="font-semibold text-sm text-red-600">Nadelen:</h4>
                {WORKFLO_PRICING.adhoc.risksNL.slice(0, 3).map((risk, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-red-600">{risk}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Badge variant="secondary" className="w-full justify-center">
                  Voor incidenteel gebruik
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* PREPAID BUNDLES - Middle Option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full border-2 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  Flexibel
                </Badge>
              </div>
              <CardTitle className="text-xl">
                {WORKFLO_PRICING.prepaid.nameNL}
              </CardTitle>
              <CardDescription>
                {WORKFLO_PRICING.prepaid.descriptionNL}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pricing */}
              <div className="space-y-1">
                <div className="text-3xl font-bold text-foreground">
                  {formatEuro(prepaidPricing.bundle.price)}
                  <span className="text-lg text-muted-foreground font-normal">
                    /{prepaidPricing.bundle.hours}u
                  </span>
                </div>
                <div className="text-sm text-green-600 font-semibold">
                  = €{prepaidPricing.bundle.hourlyRate}/uur (korting: {Math.round(prepaidPricing.bundle.discount * 100)}%)
                </div>
                <div className="text-sm text-muted-foreground">
                  Geschat: {formatEuro(prepaidPricing.monthlyTotal)}/maand
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Voordelen:</h4>
                {WORKFLO_PRICING.prepaid.featuresNL.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Limitations */}
              <div className="space-y-2 pt-2 border-t">
                <h4 className="font-semibold text-sm text-yellow-600">Let op:</h4>
                {WORKFLO_PRICING.prepaid.limitationsNL.slice(0, 2).map((limitation, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-yellow-700 dark:text-yellow-500">{limitation}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Badge variant="secondary" className="w-full justify-center">
                  Voor regelmatig gebruik
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* MSP - RECOMMENDED */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Most Popular Indicator */}
          <div className="absolute -left-1 top-20 bg-green-600 text-white text-xs font-bold px-3 py-1 rotate-[-90deg] origin-left z-20">
            Meest Gekozen
          </div>

          <Card className="h-full border-4 border-workflo-yellow bg-gradient-to-br from-workflo-yellow/10 to-transparent shadow-2xl relative overflow-hidden transform scale-105 z-10">
            {/* Recommended Badge with Animation */}
            <motion.div
              className="absolute top-0 right-0 bg-workflo-yellow text-workflo-navy px-6 py-3 rounded-bl-xl font-bold flex items-center gap-2 shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-5 h-5 fill-current" />
              <span className="text-lg">AANBEVOLEN</span>
            </motion.div>

            <CardHeader className="pt-12">
              <CardTitle className="text-2xl">
                {WORKFLO_PRICING.msp.nameNL}
              </CardTitle>
              <CardDescription className="text-base font-semibold text-workflo-yellow">
                {WORKFLO_PRICING.msp.taglineNL}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* MSP Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Kies je pakket:</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMSPType('remote')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      mspType === 'remote'
                        ? 'border-workflo-yellow bg-workflo-yellow/10'
                        : 'border-border hover:border-workflo-yellow/50'
                    }`}
                  >
                    <Zap className="w-5 h-5 mx-auto mb-1 text-workflo-yellow" />
                    <div className="text-xs font-semibold">Remote</div>
                    <div className="text-xs text-muted-foreground">€60/gebruiker</div>
                  </button>
                  <button
                    onClick={() => setMSPType('enterprise')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      mspType === 'enterprise'
                        ? 'border-workflo-yellow bg-workflo-yellow/10'
                        : 'border-border hover:border-workflo-yellow/50'
                    }`}
                  >
                    <Target className="w-5 h-5 mx-auto mb-1 text-workflo-yellow" />
                    <div className="text-xs font-semibold">Enterprise</div>
                    <div className="text-xs text-muted-foreground">€90/gebruiker</div>
                  </button>
                </div>
              </div>

              {/* Pricing Display */}
              <div className="bg-workflo-navy text-white rounded-lg p-4 space-y-1">
                <div className="text-4xl font-bold">
                  {formatEuro(mspPricing.monthlyTotal)}
                  <span className="text-lg font-normal">/maand</span>
                </div>
                <div className="text-sm opacity-90">
                  = {formatEuro(mspPricing.yearlyTotal)} per jaar
                </div>
                <div className="text-xs opacity-75">
                  {formatEuro(mspPricing.config.pricePerUser)} per gebruiker/maand
                </div>
              </div>

              {/* Savings Badge */}
              {savings.monthly > 0 && (
                <div className="bg-green-50 dark:bg-green-950 border-2 border-green-500 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-700 dark:text-green-400">
                      Bespaar {savings.percentage}%!
                    </span>
                  </div>
                  <div className="text-sm text-green-600">
                    {formatEuro(savings.monthly)}/maand vs ad-hoc
                  </div>
                  <div className="text-xs text-green-600">
                    = {formatEuro(savings.yearly)} per jaar
                  </div>
                </div>
              )}

              {/* Key Features */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Alles inbegrepen:</h4>
                {WORKFLO_PRICING.msp.includedServicesNL.slice(0, 6).map((service, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-workflo-yellow mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{service}</span>
                  </div>
                ))}
                <div className="text-xs text-muted-foreground">
                  + {WORKFLO_PRICING.msp.includedServicesNL.length - 6} meer...
                </div>
              </div>

              {/* Enterprise Extras */}
              {mspType === 'enterprise' && (
                <div className="space-y-2 pt-2 border-t border-workflo-yellow/20">
                  <h4 className="font-semibold text-sm text-workflo-yellow">Enterprise extra's:</h4>
                  {WORKFLO_PRICING.msp.enterpriseExtrasNL.map((extra, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-workflo-yellow mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{extra}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4">
                <Badge className="w-full justify-center bg-workflo-yellow text-workflo-navy hover:bg-workflo-yellow/90">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Beste waarde - {savings.percentage}% goedkoper
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* SLA Options (only for MSP) */}
      <Card className="border-2 border-workflo-yellow/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-workflo-yellow" />
            Service Level Agreement (SLA)
          </CardTitle>
          <CardDescription>
            Kies je gewenste responstijd voor het MSP pakket
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {(['standard', 'priority', 'premium'] as SLALevel[]).map((level) => {
              const slaConfig = WORKFLO_PRICING.msp.slaOptions[level]
              const isSelected = slaLevel === level
              return (
                <button
                  key={level}
                  onClick={() => setSLALevel(level)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-workflo-yellow bg-workflo-yellow/10'
                      : 'border-border hover:border-workflo-yellow/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-workflo-yellow" />
                    <div className="font-bold">{slaConfig.responseTime} respons</div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {slaConfig.availability}
                  </div>
                  {slaConfig.multiplier > 1 && (
                    <div className="text-xs text-workflo-yellow font-semibold">
                      +{Math.round((slaConfig.multiplier - 1) * 100)}% toeslag
                    </div>
                  )}
                  {slaConfig.multiplier === 1 && (
                    <div className="text-xs text-green-600 font-semibold">
                      Inbegrepen
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Summary */}
      <Card className="bg-gradient-to-br from-workflo-yellow/10 to-transparent border-2 border-workflo-yellow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calculator className="w-6 h-6 text-workflo-yellow" />
            Kosten Vergelijking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-workflo-yellow">
                  <th className="text-left p-3 font-bold">Model</th>
                  <th className="text-right p-3 font-bold">Per Maand</th>
                  <th className="text-right p-3 font-bold">Per Jaar</th>
                  <th className="text-right p-3 font-bold">Besparing</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">Ad-Hoc (geschat)</td>
                  <td className="text-right p-3 font-semibold">{formatEuro(adhocPricing.monthlyTotal)}</td>
                  <td className="text-right p-3 font-semibold">{formatEuro(adhocPricing.yearlyTotal)}</td>
                  <td className="text-right p-3 text-muted-foreground">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Pre-Paid Bundles</td>
                  <td className="text-right p-3 font-semibold">{formatEuro(prepaidPricing.monthlyTotal)}</td>
                  <td className="text-right p-3 font-semibold">{formatEuro(prepaidPricing.yearlyTotal)}</td>
                  <td className="text-right p-3 text-green-600 font-semibold">
                    {formatEuro(adhocPricing.monthlyTotal - prepaidPricing.monthlyTotal)}
                  </td>
                </tr>
                <tr className="bg-workflo-yellow/20 border-b-2 border-workflo-yellow">
                  <td className="p-3 font-bold flex items-center gap-2">
                    <Star className="w-4 h-4 text-workflo-yellow fill-current" />
                    Fixed-Fee MSP
                  </td>
                  <td className="text-right p-3 font-bold text-workflo-navy">
                    {formatEuro(mspPricing.monthlyTotal)}
                  </td>
                  <td className="text-right p-3 font-bold text-workflo-navy">
                    {formatEuro(mspPricing.yearlyTotal)}
                  </td>
                  <td className="text-right p-3 font-bold text-green-600">
                    {formatEuro(savings.monthly)} ({savings.percentage}%)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ROI Summary */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white dark:bg-workflo-navy rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-workflo-yellow mb-1">
                {formatEuro(savings.yearly)}
              </div>
              <div className="text-sm text-muted-foreground">Besparing per jaar</div>
            </div>
            <div className="bg-white dark:bg-workflo-navy rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-workflo-yellow mb-1">
                {formatEuro(savings.threeYear)}
              </div>
              <div className="text-sm text-muted-foreground">Besparing 3 jaar</div>
            </div>
            <div className="bg-white dark:bg-workflo-navy rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-workflo-yellow mb-1">
                {formatEuro(savings.fiveYear)}
              </div>
              <div className="text-sm text-muted-foreground">Besparing 5 jaar</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Realistic Scenarios Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Realistische Scenario&apos;s
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { users: 10, type: 'Klein bedrijf' },
              { users: 25, type: 'Groeiend bedrijf' },
              { users: 50, type: 'Enterprise' }
            ].map((scenario) => {
              const adhoc = calculateAdhocPricing({ users: scenario.users })
              const msp = calculateMSPPricing({ users: scenario.users, mspType, slaLevel })
              const savings = calculateSavings(msp.monthlyTotal, adhoc.monthlyTotal)

              return (
                <div key={scenario.users} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{scenario.type} ({scenario.users} gebruikers)</p>
                    </div>
                    <Badge variant="outline">
                      {savings.percentage}% besparing
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Ad-Hoc (geschat)</p>
                      <p className="font-semibold">{formatEuro(adhoc.monthlyTotal)}/maand</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">MSP Fixed-Fee</p>
                      <p className="font-semibold text-green-600">{formatEuro(msp.monthlyTotal)}/maand</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-sm text-green-600 font-semibold">
                      Besparing: {formatEuro(savings.monthly)}/maand = {formatEuro(savings.yearly)}/jaar
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced CTA with Social Proof */}
      <div className="text-center space-y-4">
        <Button size="lg" className="bg-workflo-yellow text-workflo-navy hover:bg-workflo-yellow/90 font-bold text-lg px-8">
          Bereken Je Besparing Nu
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>100+ tevreden klanten</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-workflo-yellow fill-current" />
            <span>4.8/5 gemiddelde</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            <span>ISO 27001 gecertificeerd</span>
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Geen verplichtingen • Gratis consult • 30 dagen opzegtermijn
        </p>
      </div>
    </div>
  )
}
