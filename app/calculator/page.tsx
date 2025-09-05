'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, Calculator, Users, Monitor, HelpCircle, Check, Building2, Clock, Shield, Headphones, TrendingUp, Package, Zap, Euro, ChevronRight, Star, Award, Sparkles, BadgeCheck, AlertTriangle, X, Info, Mail, Phone, Server, Cloud, Smartphone, FileText, Video, BarChart3, Globe, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useLanguage } from '@/lib/contexts/language-context'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { HubSpotContactModal } from '@/components/modals/hubspot-contact-modal'

export default function CalculatorPage() {
  const { language } = useLanguage()
  
  // State for calculator inputs
  const [users, setUsers] = useState([10])
  const [servers, setServers] = useState([1])
  const [pricingModel, setPricingModel] = useState<'fixed-fee' | 'ad-hoc' | 'pre-paid'>('fixed-fee')
  const [supportType, setSupportType] = useState<'remote' | 'onsite'>('onsite')
  const [officeOption, setOfficeOption] = useState<'none' | 'basic' | 'standard' | 'premium'>('none')
  const [estimatedHours, setEstimatedHours] = useState(0)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const [prePaidPackage, setPrePaidPackage] = useState<'10' | '20'>('20')
  const [contactModalOpen, setContactModalOpen] = useState(false)
  
  // Calculate estimated hours based on FTE (1 hour per FTE per month average)
  useEffect(() => {
    setEstimatedHours(users[0] || 10)
  }, [users])
  
  // Correct pricing logic based on Diensten omschrijving.md
  const fixedFeePrice = supportType === 'remote' ? 60 : 90
  const serverPrice = fixedFeePrice // Servers cost same as users
  const adHocHourlyRate = 110  
  const adHocEveningWeekendRate = adHocHourlyRate * 1.5  // 150% after 19:00 and weekends
  
  // Pre-paid packages
  const prePaidPackages = {
    '10': { hours: 10, price: 1000, hourlyRate: 100 },
    '20': { hours: 20, price: 1800, hourlyRate: 90 }
  }
  
  // Office 365 pricing (monthly vs yearly commitment) - CORRECT PRICES
  const officePricing = {
    monthly: {
      none: 0,
      basic: 6.70,     // Business Basic (monthly commitment)
      standard: 14.00, // Business Standard (monthly commitment)
      premium: 24.70   // Business Premium (monthly commitment)
    },
    yearly: {
      none: 0,
      basic: 5.60,     // Business Basic (yearly commitment)
      standard: 11.70, // Business Standard (yearly commitment)
      premium: 20.60   // Business Premium (yearly commitment)
    }
  }
  
  const yearlyDiscount = 0.10  // 10% discount for yearly commitment
  
  const getDiscount = (userCount: number) => {
    if (userCount >= 50) return 0.20 // 20% discount
    if (userCount >= 20) return 0.15 // 15% discount
    if (userCount >= 10) return 0.10 // 10% discount
    if (userCount >= 5) return 0.05 // 5% discount
    return 0
  }
  
  const discount = getDiscount(users[0])
  
  // Calculate prices for different models
  const fixedFeePricePerUser = fixedFeePrice * (1 - discount)
  const fixedFeeServerTotal = servers[0] * serverPrice * (1 - discount)
  const officePrice = officePricing[billingPeriod][officeOption] * users[0]
  const fixedFeeMonthlyBase = (fixedFeePricePerUser * users[0]) + fixedFeeServerTotal + officePrice
  const fixedFeeTotalMonthly = billingPeriod === 'yearly' ? fixedFeeMonthlyBase * (1 - yearlyDiscount) : fixedFeeMonthlyBase
  const fixedFeeTotalYearly = fixedFeeTotalMonthly * 12
  
  const adHocTotalMonthly = estimatedHours * adHocHourlyRate
  const adHocTotalYearly = adHocTotalMonthly * 12
  
  // Pre-paid is based on package selection
  const selectedPackage = prePaidPackages[prePaidPackage]
  const prePaidTotalMonthly = selectedPackage.price / selectedPackage.hours * estimatedHours
  const prePaidTotalYearly = prePaidTotalMonthly * 12
  
  // Calculate savings
  const savingsVsAdHoc = adHocTotalMonthly - fixedFeeTotalMonthly
  const savingsVsPrePaid = prePaidTotalMonthly - fixedFeeTotalMonthly
  const savingsPercentage = savingsVsAdHoc > 0 ? Math.round((savingsVsAdHoc / adHocTotalMonthly) * 100) : 0

  // Features for Fixed-Fee
  const fixedFeeFeatures = {
    remote: [
      { icon: Shield, text: language === 'nl' ? '24/7 proactieve monitoring' : '24/7 proactive monitoring' },
      { icon: Headphones, text: language === 'nl' ? 'Onbeperkte remote support' : 'Unlimited remote support' },
      { icon: Package, text: language === 'nl' ? 'Alle benodigde software licenties' : 'All required software licenses' },
      { icon: Shield, text: language === 'nl' ? 'Enterprise antivirus & beveiliging' : 'Enterprise antivirus & security' },
      { icon: Clock, text: language === 'nl' ? 'Gegarandeerde responstijd <1 uur' : 'Guaranteed response time <1 hour' },
      { icon: TrendingUp, text: language === 'nl' ? 'Maandelijkse IT-rapportages' : 'Monthly IT reports' },
      { icon: Building2, text: language === 'nl' ? 'Backup & disaster recovery' : 'Backup & disaster recovery' },
      { icon: Users, text: language === 'nl' ? 'Dedicated accountmanager' : 'Dedicated account manager' },
      { icon: Award, text: language === 'nl' ? 'Complete digitale verantwoordelijkheid' : 'Complete digital responsibility' }
    ],
    onsite: [
      { number: 1, text: language === 'nl' ? 'Alles van Remote Support' : 'Everything from Remote Support' },
      { number: 2, text: language === 'nl' ? 'Onbeperkte locatiebezoeken' : 'Unlimited onsite visits' },
      { number: 3, text: language === 'nl' ? 'Hardware vervanging ter plaatse' : 'Onsite hardware replacement' },
      { number: 4, text: language === 'nl' ? 'Persoonlijke training & workshops' : 'Personal training & workshops' },
      { number: 5, text: language === 'nl' ? 'Prioriteit support status' : 'Priority support status' },
      { number: 6, text: language === 'nl' ? 'Quarterly security audits' : 'Quarterly security audits' },
      { number: 7, text: language === 'nl' ? 'Geen extra reis- of voorrijkosten' : 'No extra travel costs' },
      { number: 8, text: language === 'nl' ? 'SLA garantie 99.9% uptime' : 'SLA guarantee 99.9% uptime' }
    ]
  }

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-[#0F172A] py-12 sm:py-16 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/20 via-transparent to-[#1E3A8A]/10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {language === 'nl' ? 'Terug naar home' : 'Back to home'}
            </Link>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {language === 'nl' ? 'IT Kosten Calculator' : 'IT Cost Calculator'}
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto mb-6">
              {language === 'nl' 
                ? 'Bereken precies wat onze Fixed-Fee IT-ondersteuning voor jouw bedrijf kost' 
                : 'Calculate exactly what our Fixed-Fee IT support costs for your business'}
            </p>
            
            {/* Instructions */}
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-[#f2f400] mb-3 flex items-center gap-2">
                <Info className="w-5 h-5" />
                {language === 'nl' ? 'Hoe werkt het?' : 'How does it work?'}
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-white/80">
                <div className="bg-white/10 rounded-lg p-4 transform transition-all duration-700 hover:scale-105 hover:bg-white/15 animate-[fadeInUp_0.6s_ease-out] opacity-0 [animation-delay:0.2s] [animation-fill-mode:forwards]">
                  <div className="font-medium text-white mb-2">1. {language === 'nl' ? 'Configureer' : 'Configure'}</div>
                  <p>{language === 'nl' 
                    ? 'Voer het aantal medewerkers en servers in. Kies optioneel voor Office 365 licenties.'
                    : 'Enter the number of employees and servers. Optionally choose Office 365 licenses.'
                  }</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 transform transition-all duration-700 hover:scale-105 hover:bg-white/15 animate-[fadeInUp_0.6s_ease-out] opacity-0 [animation-delay:0.4s] [animation-fill-mode:forwards]">
                  <div className="font-medium text-white mb-2">2. {language === 'nl' ? 'Commitment keuze' : 'Commitment choice'}</div>
                  <p>{language === 'nl' 
                    ? 'Maandelijks = flexibel. Jaarlijks = eerste maand gratis + 10% korting maar 12 maanden commitment. Je betaalt altijd per maand!'
                    : 'Monthly = flexible. Yearly = first month free + 10% discount but 12-month commitment. You always pay monthly!'
                  }</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 transform transition-all duration-700 hover:scale-105 hover:bg-white/15 animate-[fadeInUp_0.6s_ease-out] opacity-0 [animation-delay:0.6s] [animation-fill-mode:forwards]">
                  <div className="font-medium text-white mb-2">3. {language === 'nl' ? 'Automatische kortingen' : 'Automatic discounts'}</div>
                  <p>{language === 'nl' 
                    ? 'Volume kortingen vanaf 5 gebruikers. Hoe meer gebruikers, hoe meer korting!'
                    : 'Volume discounts from 5 users. More users = more discount!'
                  }</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-8 sm:py-12 bg-gradient-to-br from-gray-50/50 via-blue-50/30 to-yellow-50/20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Billing Period Toggle */}
            <div className="mb-8">
              <div className="flex flex-col items-center gap-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {language === 'nl' ? 'Kies je commitment periode' : 'Choose your commitment period'}
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md">
                    {language === 'nl' 
                      ? 'Let op: Je betaalt altijd per maand. Het verschil zit in de contractduur en korting.'
                      : 'Note: You always pay monthly. The difference is in contract duration and discount.'}
                  </p>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-1 inline-flex">
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      billingPeriod === 'monthly'
                        ? 'bg-[#0F172A] text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span>{language === 'nl' ? 'Maandelijks' : 'Monthly'}</span>
                      <span className="text-xs opacity-75">
                        {language === 'nl' ? 'Flexibel opzegbaar' : 'Flexible cancellation'}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => setBillingPeriod('yearly')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all relative ${
                      billingPeriod === 'yearly'
                        ? 'bg-[#0F172A] text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span>{language === 'nl' ? 'Jaarlijks' : 'Yearly'}</span>
                      <span className="text-xs opacity-75">
                        {language === 'nl' ? '12 mnd + 10% + 1e maand gratis' : '12 mo + 10% + 1st month free'}
                      </span>
                    </div>
                    <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                      {language === 'nl' ? '1e maand gratis' : '1st month free'}
                    </Badge>
                  </button>
                </div>
                
                <div className="text-xs text-gray-500 text-center max-w-lg">
                  {billingPeriod === 'yearly' ? (
                    language === 'nl' 
                      ? '💡 Je tekent voor 12 maanden + eerste maand gratis + 10% korting. Je betaalt nog steeds elke maand je factuur.'
                      : '💡 You commit to 12 months + first month free + 10% discount. You still pay your invoice every month.'
                  ) : (
                    language === 'nl' 
                      ? '💡 Maandelijks opzegbaar, geen lange verplichtingen'
                      : '💡 Monthly cancellation, no long-term obligations'
                  )}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Configuration Panel */}
              <div className="lg:col-span-2 space-y-6">
                {/* Company Size */}
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#1E3A8A]" />
                      {language === 'nl' ? 'Bedrijfsgrootte' : 'Company Size'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Users/Employees */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <Label className="text-base font-medium">
                          {language === 'nl' ? 'Aantal medewerkers' : 'Number of employees'}
                        </Label>
                        <span className="text-2xl font-bold text-[#0F172A]">{users[0]}</span>
                      </div>
                      <Slider
                        value={users}
                        onValueChange={setUsers}
                        min={1}
                        max={150}
                        step={1}
                        className="mb-2"
                      />
                      {/* Business Size Labels - Positioned at correct percentages */}
                      <div className="relative text-xs text-gray-500 mt-1 mb-2 h-4">
                        {/* Small: 1-10 is at 6.67% of the slider (10/150) */}
                        <span className="absolute left-0">Small (1-10)</span>
                        {/* Medium: 11-50 is at 33.33% of the slider (50/150) */}
                        <span className="absolute left-[33%] transform -translate-x-1/2">Medium (11-50)</span>
                        {/* Large: 51-150 is at 100% of the slider */}
                        <span className="absolute right-0">Large (51-150)</span>
                      </div>
                      {/* Visual indicators for size boundaries */}
                      <div className="relative h-1 -mt-1 mb-3">
                        {/* Marker at 10 employees (6.67%) */}
                        <div className="absolute w-0.5 h-2 bg-gray-300" style={{ left: '6.67%' }}></div>
                        {/* Marker at 50 employees (33.33%) */}
                        <div className="absolute w-0.5 h-2 bg-gray-300" style={{ left: '33.33%' }}></div>
                      </div>
                      {users[0] > 150 ? (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800 font-medium">
                            Voor meer dan 150 medewerkers doen we alleen maatwerk en/of tweede lijns support. Neem contact op voor de opties.
                          </p>
                        </div>
                      ) : discount > 0 ? (
                        <Badge className="bg-green-100 text-green-700">
                          {(discount * 100).toFixed(0)}% volume korting
                        </Badge>
                      ) : null}
                    </div>

                    {/* Servers */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <Label className="text-base font-medium flex items-center gap-2">
                          <Server className="w-4 h-4 text-gray-600" />
                          {language === 'nl' ? 'Aantal servers' : 'Number of servers'}
                        </Label>
                        <span className="text-2xl font-bold text-[#0F172A]">{servers[0]}</span>
                      </div>
                      <Slider
                        value={servers}
                        onValueChange={setServers}
                        min={0}
                        max={20}
                        step={1}
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        {language === 'nl' 
                          ? `Servers kosten hetzelfde als gebruikers (€${fixedFeePrice}/maand)` 
                          : `Servers cost the same as users (€${fixedFeePrice}/month)`}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing Model Selection */}
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-[#1E3A8A]" />
                      {language === 'nl' ? 'Kies je model' : 'Choose your model'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={pricingModel} onValueChange={(value: any) => setPricingModel(value)}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="fixed-fee" className="relative">
                          Fixed-Fee
                          <Badge className="absolute -top-3 -right-2 bg-green-500 text-white text-xs">
                            {language === 'nl' ? 'Aanbevolen' : 'Recommended'}
                          </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="pre-paid" className="text-gray-500">Pre-paid</TabsTrigger>
                        <TabsTrigger value="ad-hoc" className="text-gray-500">Ad-hoc</TabsTrigger>
                      </TabsList>

                      <TabsContent value="fixed-fee" className="mt-6 space-y-6">
                        {/* Support Type */}
                        <div>
                          <Label className="text-base font-medium mb-4 block">
                            {language === 'nl' ? 'Type ondersteuning' : 'Support type'}
                          </Label>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Remote Support Card */}
                            <button
                              onClick={() => setSupportType('remote')}
                              className={`p-4 rounded-lg border-2 transition-all text-left ${
                                supportType === 'remote' 
                                  ? 'border-[#1E3A8A] bg-[#1E3A8A]/5 shadow-lg' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <Monitor className="w-8 h-8 mb-2 text-[#1E3A8A]" />
                                  <h5 className="font-semibold text-lg">Remote Support</h5>
                                  <p className="text-lg font-bold text-[#1E3A8A]">€60/maand</p>
                                </div>
                                {supportType === 'remote' && <BadgeCheck className="w-6 h-6 text-green-600" />}
                              </div>
                              
                              <div className="border-t pt-3">
                                <p className="text-xs font-semibold text-gray-700 mb-2">{language === 'nl' ? 'Wat zit erbij:' : 'What\'s included:'}</p>
                                <ul className="space-y-1">
                                  <li className="flex items-start gap-2">
                                    <Check className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-xs text-gray-600">{language === 'nl' ? '24/7 proactieve monitoring' : '24/7 proactive monitoring'}</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <Check className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-xs text-gray-600">{language === 'nl' ? 'Onbeperkte remote support' : 'Unlimited remote support'}</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <Check className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-xs text-gray-600">{language === 'nl' ? 'Alle software licenties' : 'All software licenses'}</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <Check className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-xs text-gray-600">{language === 'nl' ? 'Enterprise beveiliging' : 'Enterprise security'}</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <Check className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-xs text-gray-600">{language === 'nl' ? 'Responstijd <1 uur' : 'Response time <1 hour'}</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <Check className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-xs text-gray-600">{language === 'nl' ? 'Backup & disaster recovery' : 'Backup & disaster recovery'}</span>
                                  </li>
                                </ul>
                              </div>
                            </button>
                            
                            {/* Onsite Support Card */}
                            <button
                              onClick={() => setSupportType('onsite')}
                              className={`p-4 rounded-lg border-2 transition-all text-left ${
                                supportType === 'onsite' 
                                  ? 'border-[#1E3A8A] bg-[#1E3A8A]/5 shadow-lg' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <Building2 className="w-8 h-8 mb-2 text-[#1E3A8A]" />
                                  <h5 className="font-semibold text-lg">Onsite Support</h5>
                                  <p className="text-lg font-bold text-[#1E3A8A]">€90/maand</p>
                                </div>
                                {supportType === 'onsite' && <BadgeCheck className="w-6 h-6 text-green-600" />}
                              </div>
                              
                              <div className="border-t pt-3">
                                <p className="text-xs font-semibold text-gray-700 mb-2">{language === 'nl' ? 'Wat zit erbij:' : 'What\'s included:'}</p>
                                <ul className="space-y-1">
                                  <li className="flex items-start gap-2">
                                    <Check className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-xs text-gray-600 font-semibold">{language === 'nl' ? 'Alles van Remote Support' : 'Everything from Remote'}</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <Star className="w-3 h-3 text-[#f2f400] flex-shrink-0 mt-0.5" />
                                    <span className="text-xs text-gray-600">{language === 'nl' ? 'Onbeperkte locatiebezoeken' : 'Unlimited onsite visits'}</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <Star className="w-3 h-3 text-[#f2f400] flex-shrink-0 mt-0.5" />
                                    <span className="text-xs text-gray-600">{language === 'nl' ? 'Hardware vervanging' : 'Hardware replacement'}</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <Star className="w-3 h-3 text-[#f2f400] flex-shrink-0 mt-0.5" />
                                    <span className="text-xs text-gray-600">{language === 'nl' ? 'Training & workshops' : 'Training & workshops'}</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <Star className="w-3 h-3 text-[#f2f400] flex-shrink-0 mt-0.5" />
                                    <span className="text-xs text-gray-600">{language === 'nl' ? 'Prioriteit support' : 'Priority support'}</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <Star className="w-3 h-3 text-[#f2f400] flex-shrink-0 mt-0.5" />
                                    <span className="text-xs text-gray-600">{language === 'nl' ? 'SLA 99.9% uptime' : 'SLA 99.9% uptime'}</span>
                                  </li>
                                </ul>
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Office 365 Options - Compact Modern Design */}
                        <div>
                          <Label className="text-base font-medium mb-3 block">
                            Microsoft 365 ({language === 'nl' ? 'optioneel' : 'optional'})
                          </Label>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {/* None Option */}
                            <button
                              onClick={() => setOfficeOption('none')}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                officeOption === 'none'
                                  ? 'border-[#1E3A8A] bg-[#1E3A8A]/5 shadow-md'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="text-center">
                                <X className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                                <div className="font-medium text-sm">{language === 'nl' ? 'Geen' : 'None'}</div>
                                <div className="text-xs text-gray-600 font-semibold">€0</div>
                              </div>
                            </button>

                            {/* Basic Option */}
                            <button
                              onClick={() => setOfficeOption('basic')}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                officeOption === 'basic'
                                  ? 'border-[#1E3A8A] bg-[#1E3A8A]/5 shadow-md'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="text-center">
                                <Cloud className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                                <div className="font-medium text-sm">Basic</div>
                                <div className="text-xs text-gray-600 font-semibold">€{officePricing[billingPeriod].basic}</div>
                                <div className="text-xs text-gray-500 mt-1">Email • OneDrive • Teams</div>
                              </div>
                            </button>

                            {/* Standard Option */}
                            <button
                              onClick={() => setOfficeOption('standard')}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                officeOption === 'standard'
                                  ? 'border-[#1E3A8A] bg-[#1E3A8A]/5 shadow-md'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="text-center">
                                <FileText className="w-6 h-6 mx-auto mb-1 text-green-600" />
                                <div className="font-medium text-sm">Standard</div>
                                <div className="text-xs text-gray-600 font-semibold">€{officePricing[billingPeriod].standard}</div>
                                <div className="text-xs text-gray-500 mt-1">+ Office Apps</div>
                              </div>
                            </button>

                            {/* Premium Option */}
                            <button
                              onClick={() => setOfficeOption('premium')}
                              className={`p-3 rounded-lg border-2 transition-all text-left relative ${
                                officeOption === 'premium'
                                  ? 'border-[#1E3A8A] bg-[#1E3A8A]/5 shadow-md'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1">Popular</Badge>
                              <div className="text-center">
                                <Shield className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                                <div className="font-medium text-sm">Premium</div>
                                <div className="text-xs text-gray-600 font-semibold">€{officePricing[billingPeriod].premium}</div>
                                <div className="text-xs text-gray-500 mt-1">+ Security • Device Mgmt</div>
                              </div>
                            </button>
                          </div>
                          
                          {/* Feature Details */}
                          {officeOption !== 'none' && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <div className="text-xs text-gray-700 space-y-1">
                                {officeOption === 'basic' && (
                                  <div className="grid grid-cols-3 gap-2">
                                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />Email</span>
                                    <span className="flex items-center gap-1"><Cloud className="w-3 h-3" />1TB OneDrive</span>
                                    <span className="flex items-center gap-1"><Video className="w-3 h-3" />Teams</span>
                                  </div>
                                )}
                                {officeOption === 'standard' && (
                                  <div className="grid grid-cols-3 gap-2">
                                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" />Office Apps</span>
                                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" />SharePoint</span>
                                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />Exchange</span>
                                  </div>
                                )}
                                {officeOption === 'premium' && (
                                  <div className="grid grid-cols-3 gap-2">
                                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" />Advanced Security</span>
                                    <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" />Device Management</span>
                                    <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" />Analytics</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="pre-paid" className="mt-6">
                        <Alert className="bg-orange-50 border-orange-200">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <AlertDescription className="text-orange-800">
                            <strong>{language === 'nl' ? 'Let op:' : 'Warning:'}</strong> {language === 'nl' 
                              ? 'Bij pre-paid geldt "You break, we fix". Wij doen geen proactief onderhoud en nemen geen verantwoordelijkheid voor de digitale gezondheid van je systemen.'
                              : 'With pre-paid "You break, we fix" applies. We do not perform proactive maintenance and take no responsibility for the digital health of your systems.'}
                          </AlertDescription>
                        </Alert>
                        
                        <div className="mt-6">
                          <Label className="text-base font-medium mb-4 block">
                            {language === 'nl' ? 'Kies pakket' : 'Choose package'}
                          </Label>
                          <div className="grid grid-cols-2 gap-4">
                            {/* 10 Hour Package */}
                            <button
                              onClick={() => setPrePaidPackage('10')}
                              className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                                prePaidPackage === '10'
                                  ? 'border-[#1E3A8A] bg-gradient-to-br from-[#1E3A8A]/5 to-white shadow-lg'
                                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                              }`}
                            >
                              <div className="text-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">10</div>
                                <div className="text-sm text-gray-600 mb-2">{language === 'nl' ? 'uren' : 'hours'}</div>
                                <div className="text-xl font-semibold text-[#0F172A] mb-1">€1.000</div>
                                <div className="text-sm text-gray-500">€100/uur</div>
                              </div>
                            </button>

                            {/* 20 Hour Package */}
                            <button
                              onClick={() => setPrePaidPackage('20')}
                              className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                                prePaidPackage === '20'
                                  ? 'border-green-500 bg-gradient-to-br from-green-50 to-white shadow-lg'
                                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                              }`}
                            >
                              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1">
                                {language === 'nl' ? 'Beste waarde' : 'Best value'}
                              </Badge>
                              <div className="text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <Zap className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">20</div>
                                <div className="text-sm text-gray-600 mb-2">{language === 'nl' ? 'uren' : 'hours'}</div>
                                <div className="text-xl font-semibold text-[#0F172A] mb-1">€1.800</div>
                                <div className="text-sm text-green-600 font-medium">€90/uur • 10% besparing</div>
                              </div>
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mt-4">
                            • {language === 'nl' ? 'Uren verlopen nooit' : 'Hours never expire'}<br />
                            • {language === 'nl' ? '4 uur gegarandeerde responstijd' : '4 hour guaranteed response'}<br />
                            • {language === 'nl' ? 'Hoge prioriteit' : 'High priority'}
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="ad-hoc" className="mt-6">
                        <Alert className="bg-green-50 border-green-200 mb-4">
                          <Check className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            <strong>{language === 'nl' ? 'Voordeel:' : 'Advantage:'}</strong> {language === 'nl' 
                              ? 'Geen verplichtingen, maar wel goede service'
                              : 'No commitments, but still good service'}
                          </AlertDescription>
                        </Alert>
                        
                        <Alert className="bg-red-50 border-red-200">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800">
                            <strong>{language === 'nl' ? 'Waarschuwing:' : 'Warning:'}</strong> {language === 'nl' 
                              ? 'Ad-hoc is alleen voor noodgevallen. "You break, we fix" - geen onderhoud, geen monitoring, geen verantwoordelijkheid. Lagere prioriteit en geen gegarandeerde responstijd.'
                              : 'Ad-hoc is for emergencies only. "You break, we fix" - no maintenance, no monitoring, no responsibility. Lower priority and no guaranteed response time.'}
                          </AlertDescription>
                        </Alert>
                        
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                          <p className="font-medium mb-2">{language === 'nl' ? 'Ad-hoc tarieven:' : 'Ad-hoc rates:'}</p>
                          <ul className="space-y-2 text-sm">
                            <li>• {language === 'nl' ? 'Standaard tarief' : 'Standard rate'}: €110/uur</li>
                            <li>• {language === 'nl' ? 'Avond & weekend (150%)' : 'Evening & weekend (150%)'}: €165/uur</li>
                            <li>• {language === 'nl' ? 'Betaling achteraf' : 'Payment afterwards'}</li>
                            <li className="text-red-600">• {language === 'nl' ? 'Geen preventief onderhoud' : 'No preventive maintenance'}</li>
                            <li className="text-red-600">• {language === 'nl' ? 'Geen monitoring' : 'No monitoring'}</li>
                            <li className="text-red-600">• {language === 'nl' ? 'Geen garanties' : 'No guarantees'}</li>
                          </ul>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

              </div>

              {/* Pricing Display */}
              <div className="lg:sticky lg:top-6 lg:h-fit">
                <Card className={`shadow-xl border-2 ${
                  pricingModel === 'fixed-fee' 
                    ? 'border-green-500 bg-gradient-to-br from-green-50 to-white' 
                    : pricingModel === 'pre-paid'
                    ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-white'
                    : 'border-red-300 bg-gradient-to-br from-red-50 to-white'
                }`}>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center justify-between">
                      {language === 'nl' ? 'Jouw investering' : 'Your investment'}
                      {pricingModel === 'fixed-fee' && (
                        <Badge className="bg-green-500 text-white">
                          {language === 'nl' ? 'Beste keuze' : 'Best choice'}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Price Display */}
                    <div className="text-center py-6 bg-white rounded-xl shadow-inner">
                      <div className="mb-2">
                        <span className="text-4xl font-bold text-[#0F172A]">
                          €{Math.round(
                            pricingModel === 'fixed-fee' ? fixedFeeTotalMonthly :
                            pricingModel === 'ad-hoc' ? adHocTotalMonthly :
                            prePaidTotalMonthly
                          ).toLocaleString()}
                        </span>
                        <span className="text-xl text-gray-600">
                          /{language === 'nl' ? 'maand' : 'month'}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">
                        {language === 'nl' 
                          ? `€${Math.round(
                              pricingModel === 'fixed-fee' ? fixedFeeTotalYearly :
                              pricingModel === 'ad-hoc' ? adHocTotalYearly :
                              prePaidTotalYearly
                            ).toLocaleString()} per jaar` 
                          : `€${Math.round(
                              pricingModel === 'fixed-fee' ? fixedFeeTotalYearly :
                              pricingModel === 'ad-hoc' ? adHocTotalYearly :
                              prePaidTotalYearly
                            ).toLocaleString()} per year`}
                      </p>
                    </div>

                    {/* Savings for Fixed Fee */}
                    {pricingModel === 'fixed-fee' && savingsVsAdHoc > 0 && (
                      <Alert className="bg-green-50 border-green-200">
                        <Sparkles className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          <strong>
                            {language === 'nl' 
                              ? `Bespaar €${Math.round(savingsVsAdHoc).toLocaleString()}/maand` 
                              : `Save €${Math.round(savingsVsAdHoc).toLocaleString()}/month`}
                          </strong>
                          <span className="block text-sm mt-1">
                            {language === 'nl' 
                              ? `${savingsPercentage}% goedkoper dan ad-hoc` 
                              : `${savingsPercentage}% cheaper than ad-hoc`}
                          </span>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Cost Breakdown */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">
                          {language === 'nl' ? 'Gebruikers' : 'Users'}
                        </span>
                        <div className="text-right">
                          <div className="font-medium">
                            {users[0]} × €{(fixedFeePricePerUser * (billingPeriod === 'yearly' ? (1 - yearlyDiscount) : 1)).toFixed(2)}
                          </div>
                          {(discount > 0 || billingPeriod === 'yearly') && (
                            <div className="text-xs text-gray-500 space-y-0.5">
                              <div className="line-through">€{fixedFeePrice.toFixed(0)} {language === 'nl' ? 'oorspronkelijk' : 'original'}</div>
                              {billingPeriod === 'yearly' && (
                                <div className="text-green-600">-10% jaar = €{(fixedFeePrice * (1 - yearlyDiscount)).toFixed(2)}</div>
                              )}
                              {discount > 0 && (
                                <div className="text-green-600">-{(discount * 100).toFixed(0)}% volume = €{(fixedFeePrice * (billingPeriod === 'yearly' ? (1 - yearlyDiscount) : 1) * (1 - discount)).toFixed(2)}</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {servers[0] > 0 && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">
                            {language === 'nl' ? 'Servers' : 'Servers'}
                          </span>
                          <div className="text-right">
                            <div className="font-medium">
                              {servers[0]} × €{(serverPrice * (1 - discount) * (billingPeriod === 'yearly' ? (1 - yearlyDiscount) : 1)).toFixed(2)}
                            </div>
                            {(discount > 0 || billingPeriod === 'yearly') && (
                              <div className="text-xs text-gray-500 space-y-0.5">
                                <div className="line-through">€{serverPrice.toFixed(0)} {language === 'nl' ? 'oorspronkelijk' : 'original'}</div>
                                {billingPeriod === 'yearly' && (
                                  <div className="text-green-600">-10% jaar = €{(serverPrice * (1 - yearlyDiscount)).toFixed(2)}</div>
                                )}
                                {discount > 0 && (
                                  <div className="text-green-600">-{(discount * 100).toFixed(0)}% volume = €{(serverPrice * (billingPeriod === 'yearly' ? (1 - yearlyDiscount) : 1) * (1 - discount)).toFixed(2)}</div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {officeOption !== 'none' && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Office 365</span>
                          <span className="font-medium">€{officePrice.toFixed(0)}</span>
                        </div>
                      )}
                      
                      {/* Summary of total savings */}
                      {(discount > 0 || billingPeriod === 'yearly') && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <div className="flex justify-between items-center">
                            <span className="text-green-800 font-semibold">
                              🎉 {language === 'nl' ? 'Totale besparing per maand:' : 'Total monthly savings:'}
                            </span>
                            <span className="text-green-800 font-bold text-lg">
                              €{(((users[0] + servers[0]) * fixedFeePrice) + (billingPeriod === 'yearly' ? fixedFeeMonthlyBase * yearlyDiscount : 0) - (fixedFeeTotalMonthly - officePrice)).toFixed(0)}
                            </span>
                          </div>
                          <div className="text-xs text-green-700 mt-1">
                            {billingPeriod === 'yearly' && discount > 0 && (
                              <span>{language === 'nl' ? 'Jaarkorting + volume korting gecombineerd!' : 'Yearly + volume discounts combined!'}</span>
                            )}
                            {billingPeriod === 'yearly' && discount === 0 && (
                              <span>{language === 'nl' ? 'Dankzij jaarlijkse betaling!' : 'Thanks to yearly billing!'}</span>
                            )}
                            {billingPeriod === 'monthly' && discount > 0 && (
                              <span>{language === 'nl' ? 'Dankzij volume korting!' : 'Thanks to volume discount!'}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                      <Button 
                        onClick={() => setContactModalOpen(true)}
                        className="w-full bg-[#0F172A] hover:bg-[#1E3A8A] text-white"
                        size="lg"
                      >
                        {language === 'nl' ? 'Start vandaag' : 'Start today'}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button 
                        asChild 
                        variant="outline" 
                        className="w-full"
                      >
                        <Link href="/contact">
                          <Phone className="mr-2 h-4 w-4" />
                          {language === 'nl' ? 'Bel voor advies' : 'Call for advice'}
                        </Link>
                      </Button>
                    </div>

                    {/* Trust badges */}
                    <div className="pt-4 border-t text-center">
                      <div className="flex justify-center gap-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-xs text-gray-900 font-medium">
                        {language === 'nl' 
                          ? '15+ jaar ervaring • Amsterdam IT-experts' 
                          : '15+ years experience • Amsterdam IT experts'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* HubSpot Contact Modal */}
      <HubSpotContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        title={language === 'nl' ? 'Vraag een offerte aan' : 'Request a Quote'}
      />
    </>
  )
}