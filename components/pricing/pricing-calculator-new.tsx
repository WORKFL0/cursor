'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { 
  CheckCircle, 
  Users, 
  Euro, 
  Calculator, 
  ArrowRight,
  ArrowLeft,
  Shield,
  Server,
  Clock,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Calendar,
  Building2,
  Monitor,
  Zap,
  Target,
  Award,
  BarChart3,
  Percent,
  MousePointer,
  Package,
  Mail
} from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/contexts/language-context'

export default function PricingCalculatorNew() {
  const { language } = useLanguage()
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Calculator state
  const [employees, setEmployees] = useState([10])
  const [servers, setServers] = useState([2])
  const [supportType, setSupportType] = useState<'remote' | 'onsite'>('remote')
  const [commitmentType, setCommitmentType] = useState<'monthly' | 'yearly'>('monthly')
  const [showComparison, setShowComparison] = useState(false)
  
  // Microsoft 365 licenses
  const [businessBasicLicenses, setBusinessBasicLicenses] = useState([0])
  const [businessStandardLicenses, setBusinessStandardLicenses] = useState([0])
  const [businessPremiumLicenses, setBusinessPremiumLicenses] = useState([0])
  
  const employeeCount = employees[0]
  const serverCount = servers[0]
  const basicLicenses = businessBasicLicenses[0]
  const standardLicenses = businessStandardLicenses[0]
  const premiumLicenses = businessPremiumLicenses[0]
  
  // Microsoft 365 license prices per month - Annual commitment rates
  const m365Prices = {
    basic: 6.90,      // Business Basic - annual commitment
    standard: 14.30,  // Business Standard - annual commitment
    premium: 25.30    // Business Premium - annual commitment
  }
  
  // Calculate total M365 costs
  const m365MonthlyCost = (basicLicenses * m365Prices.basic) + 
                          (standardLicenses * m365Prices.standard) + 
                          (premiumLicenses * m365Prices.premium)
  
  // More realistic estimate
  const estimatedHoursPerMonth = Math.round(
    (employeeCount * 1.15) + (serverCount * 5)
  )
  
  // Calculate pricing for each model
  const calculateAdHoc = () => {
    const baseRate = 110
    const baseHours = estimatedHoursPerMonth
    const baseAmount = baseHours * baseRate
    const afterHoursPercentage = 0.10
    const afterHoursHours = baseHours * afterHoursPercentage
    const afterHoursCost = afterHoursHours * baseRate * 1.5
    const monthlyTotal = baseAmount + afterHoursCost
    
    return {
      model: 'Ad-hoc',
      hours: baseHours,
      monthlyTotal: monthlyTotal,
      yearly: monthlyTotal * 12,
      riskLevel: 'high',
      predictability: 'low'
    }
  }
  
  const calculatePrePaid = () => {
    const hoursNeeded = estimatedHoursPerMonth
    const packagesNeeded = Math.ceil(hoursNeeded / 20)
    const costPerPackage = 1800
    const monthlyCost = (packagesNeeded * costPerPackage) / 3
    return {
      model: 'Pre-Paid',
      monthlyTotal: monthlyCost,
      yearly: monthlyCost * 12,
      packagesNeeded,
      hoursIncluded: packagesNeeded * 20,
      riskLevel: 'medium',
      predictability: 'medium'
    }
  }
  
  const calculateFixed = () => {
    const pricePerUser = supportType === 'remote' ? 60 : 90
    const pricePerServer = pricePerUser // Server price same as user price
    const supportCost = (employeeCount * pricePerUser) + (serverCount * pricePerServer)
    const supportDiscount = commitmentType === 'yearly' ? 0.10 : 0
    const discountedSupport = supportCost * (1 - supportDiscount)
    const monthlyPrice = discountedSupport + m365MonthlyCost // Microsoft licenses not discounted
    
    return {
      model: 'Fixed-Fee',
      monthlyStandard: supportCost + m365MonthlyCost,
      monthlyTotal: monthlyPrice,
      yearly: monthlyPrice * 12,
      discount: supportDiscount,
      savingsPerMonth: supportCost - discountedSupport,
      riskLevel: 'none',
      predictability: 'high',
      m365Cost: m365MonthlyCost
    }
  }
  
  const adhocPricing = calculateAdHoc()
  const prepaidPricing = calculatePrePaid()
  const fixedPricing = calculateFixed()
  
  const savings = {
    vsAdhoc: Math.round(adhocPricing.monthlyTotal - fixedPricing.monthlyTotal),
    percentage: Math.round((1 - fixedPricing.monthlyTotal / adhocPricing.monthlyTotal) * 100)
  }

  // Step navigation
  const nextStep = () => {
    if (currentStep < 3 && !isAnimating) {
      setIsAnimating(true)
      setCurrentStep(currentStep + 1)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }
  
  const prevStep = () => {
    if (currentStep > 1 && !isAnimating) {
      setIsAnimating(true)
      setCurrentStep(currentStep - 1)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  const sliderMarks = {
    employees: [
      { value: 1, icon: Users, label: "Klein" },
      { value: 25, icon: Building2, label: "Medium" },
      { value: 75, icon: Building2, label: "Groot" },
      { value: 100, icon: Building2, label: "Enterprise" }
    ],
    servers: [
      { value: 0, icon: Monitor, label: "Geen" },
      { value: 5, icon: Server, label: "Basis" },
      { value: 15, icon: Server, label: "Veel" },
      { value: 20, icon: Server, label: "Enterprise" }
    ]
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Step Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            IT Support Calculator
          </h2>
          <span className="text-sm text-muted-foreground">
            Stap {currentStep} van 3
          </span>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                currentStep >= step 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 rounded-full transition-all ${
                  currentStep > step ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Bedrijfsinformatie</span>
          <span>Support Voorkeuren</span>
          <span>Prijsoverzicht</span>
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={stepVariants}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary/20 bg-gradient-to-b from-background to-primary/5">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  Vertel ons over je bedrijf
                </CardTitle>
                <CardDescription className="text-lg">
                  We berekenen een nauwkeurige prijsindicatie op basis van je IT-omgeving
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-8 pt-6">
                {/* Employee Slider with Visual Feedback */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Aantal Medewerkers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary text-lg">{employeeCount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4">
                    <Slider
                      value={employees}
                      onValueChange={setEmployees}
                      max={100}
                      min={1}
                      step={1}
                      className="mb-4"
                    />
                    
                    {/* Visual Scale */}
                    <div className="flex justify-between text-xs text-muted-foreground">
                      {sliderMarks.employees.map((mark) => (
                        <div key={mark.value} className="flex flex-col items-center">
                          <mark.icon className="h-4 w-4 mb-1" />
                          <span>{mark.label}</span>
                          <span className="text-primary">{mark.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        Geschatte support behoefte: ~{Math.round(employeeCount * 1.15)} uur/maand
                      </span>
                    </div>
                  </div>
                </div>

                {/* Server Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Aantal Servers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary text-lg">{serverCount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4">
                    <Slider
                      value={servers}
                      onValueChange={setServers}
                      max={20}
                      min={0}
                      step={1}
                      className="mb-4"
                    />
                    
                    {/* Visual Scale */}
                    <div className="flex justify-between text-xs text-muted-foreground">
                      {sliderMarks.servers.map((mark) => (
                        <div key={mark.value} className="flex flex-col items-center">
                          <mark.icon className="h-4 w-4 mb-1" />
                          <span>{mark.label}</span>
                          <span className="text-primary">{mark.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        Geschat serveronderhoud: ~{serverCount * 5} uur/maand
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Estimate */}
                <motion.div 
                  className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Totale Support Behoefte</p>
                      <p className="text-2xl font-bold text-primary">~{estimatedHoursPerMonth} uur/maand</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Gebaseerd op branche gemiddelden voor vergelijkbare bedrijven
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={stepVariants}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary/20 bg-gradient-to-b from-background to-primary/5">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Jouw Support Voorkeuren
                </CardTitle>
                <CardDescription className="text-lg">
                  Deze keuzes bepalen de exacte prijsberekening voor jouw situatie
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-8 pt-6">
                {/* Support Type Toggle */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Type Support
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSupportType('remote')}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        supportType === 'remote' 
                          ? 'border-primary bg-primary/10 shadow-lg' 
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Monitor className="h-6 w-6 text-primary" />
                        <span className="font-semibold text-lg">Remote Support</span>
                        {supportType === 'remote' && <CheckCircle className="h-5 w-5 text-primary ml-auto" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Support op afstand via moderne tools. Sneller en kosteneffectiever.
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="text-primary font-medium">€60/medewerker + €30/server</div>
                        <div className="text-green-600">✓ Snelle respons</div>
                        <div className="text-green-600">✓ Lagere kosten</div>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSupportType('onsite')}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        supportType === 'onsite' 
                          ? 'border-primary bg-primary/10 shadow-lg' 
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Building2 className="h-6 w-6 text-primary" />
                        <span className="font-semibold text-lg">On-site Support</span>
                        {supportType === 'onsite' && <CheckCircle className="h-5 w-5 text-primary ml-auto" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Fysieke aanwezigheid bij complexe problemen. Ideaal voor kritieke systemen.
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="text-primary font-medium">€90/medewerker + €45/server</div>
                        <div className="text-green-600">✓ Hands-on support</div>
                        <div className="text-green-600">✓ Complexe problemen</div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Contract Type Toggle */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Contract Voorkeur
                  </h3>
                  
                  <div className="bg-muted/30 p-2 rounded-xl">
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCommitmentType('monthly')}
                        className={`p-4 rounded-lg text-center transition-all font-medium ${
                          commitmentType === 'monthly'
                            ? 'bg-background shadow-md border-2 border-primary text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div className="text-sm">Maandelijks</div>
                        <div className="text-xs mt-1">Flexibel opzegbaar</div>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCommitmentType('yearly')}
                        className={`p-4 rounded-lg text-center transition-all font-medium relative ${
                          commitmentType === 'yearly'
                            ? 'bg-background shadow-md border-2 border-primary text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div className="text-sm">Jaarcontract</div>
                        <div className="text-xs mt-1">10% korting</div>
                        {commitmentType === 'yearly' && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            SAVE 10%
                          </div>
                        )}
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Percent className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">
                          {commitmentType === 'yearly' ? 'Jaarkorting Actief!' : 'Tip: Bespaar 10%'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {commitmentType === 'yearly' 
                            ? 'Je krijgt automatisch 10% korting bij een jaarcontract. Je betaalt nog steeds maandelijks!'
                            : 'Met een jaarcontract bespaar je 10% op alle kosten. Je betaalt gewoon maandelijks.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Microsoft 365 Licenses */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Microsoft 365 Licenties
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Business Basic */}
                    <div className="bg-muted/20 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          <div>
                            <span className="font-medium">Business Basic</span>
                            <span className="text-sm text-muted-foreground ml-2">€{m365Prices.basic.toFixed(2)}/maand</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setBusinessBasicLicenses([Math.max(0, basicLicenses - 1)])}
                            disabled={basicLicenses === 0}
                          >
                            -
                          </Button>
                          <span className="w-12 text-center font-semibold">{basicLicenses}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setBusinessBasicLicenses([Math.min(100, basicLicenses + 1)])}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Email, OneDrive, Teams, SharePoint (web-only versies)
                      </p>
                    </div>

                    {/* Business Standard */}
                    <div className="bg-muted/20 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4 text-primary" />
                          <div>
                            <span className="font-medium">Business Standard</span>
                            <span className="text-sm text-muted-foreground ml-2">€{m365Prices.standard.toFixed(2)}/maand</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setBusinessStandardLicenses([Math.max(0, standardLicenses - 1)])}
                            disabled={standardLicenses === 0}
                          >
                            -
                          </Button>
                          <span className="w-12 text-center font-semibold">{standardLicenses}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setBusinessStandardLicenses([Math.min(100, standardLicenses + 1)])}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Alles van Basic + desktop apps (Word, Excel, PowerPoint, Outlook)
                      </p>
                    </div>

                    {/* Business Premium */}
                    <div className="bg-muted/20 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <div>
                            <span className="font-medium">Business Premium</span>
                            <span className="text-sm text-muted-foreground ml-2">€{m365Prices.premium.toFixed(2)}/maand</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setBusinessPremiumLicenses([Math.max(0, premiumLicenses - 1)])}
                            disabled={premiumLicenses === 0}
                          >
                            -
                          </Button>
                          <span className="w-12 text-center font-semibold">{premiumLicenses}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setBusinessPremiumLicenses([Math.min(100, premiumLicenses + 1)])}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Alles van Standard + geavanceerde beveiliging, apparaatbeheer
                      </p>
                    </div>
                  </div>

                  {/* M365 Total if any licenses selected */}
                  {m365MonthlyCost > 0 && (
                    <div className="bg-primary/5 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" />
                          <span className="font-medium">Microsoft 365 Totaal</span>
                        </div>
                        <span className="font-bold text-primary">€{m365MonthlyCost.toFixed(2)}/maand</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {basicLicenses + standardLicenses + premiumLicenses} licenties geselecteerd
                      </p>
                    </div>
                  )}
                </div>

                {/* Preview of Monthly Cost */}
                <motion.div 
                  className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={`${supportType}-${commitmentType}`}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Jouw Fixed-Fee Prijs</p>
                      <div className="flex items-center gap-2">
                        {commitmentType === 'yearly' && (
                          <span className="text-lg line-through opacity-60">
                            €{fixedPricing.monthlyStandard.toFixed(0)}
                          </span>
                        )}
                        <p className="text-2xl font-bold text-primary">
                          €{fixedPricing.monthlyTotal.toFixed(0)}
                        </p>
                        <span className="text-sm text-muted-foreground">per maand</span>
                      </div>
                      {commitmentType === 'yearly' && (
                        <p className="text-sm text-green-600 font-medium">
                          Je bespaart €{(fixedPricing.savingsPerMonth * 12).toFixed(0)} per jaar!
                        </p>
                      )}
                    </div>
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <Euro className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={stepVariants}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-8">
              {/* Results Header */}
              <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-transparent">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl flex items-center justify-center gap-3">
                    <Award className="h-8 w-8 text-primary" />
                    Jouw Persoonlijke Offerte
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Gebaseerd op {employeeCount} medewerkers, {serverCount} servers, {supportType === 'remote' ? 'remote' : 'on-site'} support
                    {(basicLicenses + standardLicenses + premiumLicenses) > 0 && `, ${basicLicenses + standardLicenses + premiumLicenses} Microsoft 365 licenties`}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Comparison Toggle */}
              <div className="flex justify-center">
                <div className="bg-muted/30 p-2 rounded-xl">
                  <div className="flex gap-2">
                    <Button
                      variant={!showComparison ? "default" : "ghost"}
                      onClick={() => setShowComparison(false)}
                      className="px-6"
                    >
                      <MousePointer className="h-4 w-4 mr-2" />
                      Jouw Advies
                    </Button>
                    <Button
                      variant={showComparison ? "default" : "ghost"}
                      onClick={() => setShowComparison(true)}
                      className="px-6"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Alle Opties
                    </Button>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!showComparison ? (
                  <motion.div
                    key="recommendation"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {/* Recommended Solution */}
                    <Card className="border-primary border-2 shadow-2xl relative overflow-hidden">
                      <div className="absolute -top-1 -right-1">
                        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-bl-xl font-bold flex items-center gap-1">
                          <Sparkles className="h-4 w-4" />
                          BESTE KEUZE VOOR JOU
                        </div>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-3">
                          <Shield className="h-6 w-6 text-green-600" />
                          Fixed-Fee IT Support
                          <Badge className="bg-green-600 text-white">Geen Risico</Badge>
                        </CardTitle>
                        <CardDescription className="text-lg">
                          All-you-can-eat IT support met volledige kostenzekerheid
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        {/* Price Breakdown */}
                        {m365MonthlyCost > 0 && (
                          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Kostenoverzicht:</div>
                            <div className="flex justify-between text-sm">
                              <span>IT Support ({employeeCount} medewerkers, {serverCount} servers)</span>
                              <span>€{(fixedPricing.monthlyStandard - m365MonthlyCost).toFixed(2)}</span>
                            </div>
                            {basicLicenses > 0 && (
                              <div className="flex justify-between text-sm">
                                <span>Microsoft 365 Basic ({basicLicenses}x)</span>
                                <span>€{(basicLicenses * m365Prices.basic).toFixed(2)}</span>
                              </div>
                            )}
                            {standardLicenses > 0 && (
                              <div className="flex justify-between text-sm">
                                <span>Microsoft 365 Standard ({standardLicenses}x)</span>
                                <span>€{(standardLicenses * m365Prices.standard).toFixed(2)}</span>
                              </div>
                            )}
                            {premiumLicenses > 0 && (
                              <div className="flex justify-between text-sm">
                                <span>Microsoft 365 Premium ({premiumLicenses}x)</span>
                                <span>€{(premiumLicenses * m365Prices.premium).toFixed(2)}</span>
                              </div>
                            )}
                            {commitmentType === 'yearly' && (
                              <>
                                <div className="border-t pt-2 flex justify-between text-sm">
                                  <span>Subtotaal</span>
                                  <span>€{fixedPricing.monthlyStandard.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-green-600">
                                  <span>Jaarcontract korting (10%)</span>
                                  <span>-€{(fixedPricing.monthlyStandard * 0.1).toFixed(2)}</span>
                                </div>
                              </>
                            )}
                            <div className="border-t pt-2 flex justify-between font-bold">
                              <span>Totaal per maand</span>
                              <span className="text-primary">€{fixedPricing.monthlyTotal.toFixed(2)}</span>
                            </div>
                          </div>
                        )}

                        {/* Price Display */}
                        <div className="text-center py-8 bg-gradient-to-b from-primary/5 to-transparent rounded-xl">
                          {commitmentType === 'yearly' ? (
                            <div>
                              <div className="flex items-center justify-center gap-3 mb-2">
                                <span className="text-2xl line-through opacity-60">
                                  €{fixedPricing.monthlyStandard.toFixed(0)}
                                </span>
                                <Badge className="bg-primary text-primary-foreground text-lg px-3 py-1">
                                  -10%
                                </Badge>
                              </div>
                              <div className="text-5xl font-bold text-primary mb-2">
                                €{fixedPricing.monthlyTotal.toFixed(0)}
                              </div>
                              <p className="text-lg text-muted-foreground">per maand bij jaarcontract</p>
                              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mt-4 inline-block">
                                <p className="text-green-600 font-medium">
                                  💰 Je bespaart €{(fixedPricing.savingsPerMonth * 12).toFixed(0)} per jaar!
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-5xl font-bold text-primary mb-2">
                                €{fixedPricing.monthlyTotal.toFixed(0)}
                              </div>
                              <p className="text-lg text-muted-foreground">per maand (maandelijks opzegbaar)</p>
                              <div className="bg-workflo-yellow-light dark:bg-workflo-yellow/20 rounded-lg p-3 mt-4 inline-block">
                                <p className="text-workflo-yellow-dark dark:text-workflo-yellow font-medium">
                                  💡 Tip: Bespaar €{(fixedPricing.monthlyStandard * 0.1 * 12).toFixed(0)} per jaar met een jaarcontract
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Savings Highlight */}
                        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
                              Bespaar €{savings.vsAdhoc * 12} per jaar
                            </p>
                            <p className="text-green-600 dark:text-green-500">
                              {savings.percentage}% goedkoper dan ad-hoc support
                            </p>
                          </div>
                        </div>

                        {/* Benefits */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-medium">Onbeperkte support</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-medium">Vaste maandkosten</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-medium">Proactief onderhoud</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-medium">24/7 monitoring</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-medium">Security updates</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-medium">Licentie management</span>
                            </div>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="pt-6">
                          <Button size="lg" className="w-full text-lg py-6" asChild>
                            <Link href="/contact">
                              Start Direct - Gratis Kennismaking
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                          </Button>
                          <p className="text-center text-sm text-muted-foreground mt-3">
                            Geen verplichtingen • Maandelijks opzegbaar • 30 dagen proefperiode
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="comparison"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid md:grid-cols-3 gap-6"
                  >
                    {/* Ad-hoc Card */}
                    <Card className="relative overflow-hidden opacity-75">
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive">Hoog Risico</Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                          Ad-hoc
                        </CardTitle>
                        <CardDescription>Pay per incident model</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="text-3xl font-bold">€{adhocPricing.monthlyTotal.toFixed(0)}</div>
                          <div className="text-sm text-muted-foreground">per maand (geschat)</div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            <span>Onvoorspelbare kosten</span>
                          </div>
                          <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            <span>150% tarief buiten kantooruren</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pre-Paid Card */}
                    <Card className="relative overflow-hidden">
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary">Gemiddeld Risico</Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Clock className="h-5 w-5 text-workflo-yellow-dark dark:text-workflo-yellow" />
                          Pre-Paid
                        </CardTitle>
                        <CardDescription>Vooruit betaalde uren</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="text-3xl font-bold">€{prepaidPricing.monthlyTotal.toFixed(0)}</div>
                          <div className="text-sm text-muted-foreground">per maand (gemiddeld)</div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Lagere uurtarieven</span>
                          </div>
                          <div className="flex items-center gap-2 text-workflo-yellow-dark dark:text-workflo-yellow">
                            <AlertCircle className="h-4 w-4" />
                            <span>Nog steeds variabele kosten</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Fixed-Fee Card */}
                    <Card className="relative overflow-hidden border-primary border-2 shadow-xl">
                      <div className="absolute -top-1 -right-1">
                        <div className="bg-primary text-primary-foreground px-3 py-1 rounded-bl-lg font-bold flex items-center gap-1">
                          <Sparkles className="h-4 w-4" />
                          BESTE KEUZE
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Shield className="h-5 w-5 text-green-600" />
                          Fixed-Fee
                        </CardTitle>
                        <CardDescription>All-you-can-eat IT support</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          {commitmentType === 'yearly' && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg line-through opacity-60">
                                €{fixedPricing.monthlyStandard.toFixed(0)}
                              </span>
                              <Badge className="bg-primary text-primary-foreground">-10%</Badge>
                            </div>
                          )}
                          <div className="text-3xl font-bold text-primary">
                            €{fixedPricing.monthlyTotal.toFixed(0)}
                          </div>
                          <div className="text-sm text-muted-foreground">per maand</div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Onbeperkte support</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Vaste maandkosten</span>
                          </div>
                        </div>

                        <Button className="w-full" size="lg" asChild>
                          <Link href="/contact">
                            Kies Fixed-Fee <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1 || isAnimating}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Vorige
        </Button>
        
        <div className="flex gap-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-all ${
                currentStep === step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        
        <Button
          onClick={nextStep}
          disabled={currentStep === 3 || isAnimating}
          className="flex items-center gap-2"
        >
          {currentStep === 3 ? 'Klaar' : 'Volgende'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}