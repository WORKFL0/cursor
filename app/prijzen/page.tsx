'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Calculator, 
  Check, 
  Euro, 
  Users, 
  Server, 
  Shield, 
  HeadphonesIcon,
  Mail,
  FileDown,
  Building,
  CheckCircle,
  X,
  Zap,
  Clock,
  TrendingUp,
  Home,
  Car,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { downloadQuotePDF } from '@/lib/utils/pdf-generator'
import { generateQuote } from '@/lib/data/pricing-data'
import { MSPServicesBreakdown } from '@/components/pricing/msp-services-breakdown'

export default function PricingPage() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [supportType, setSupportType] = useState<'remote' | 'onsite'>('remote')
  const [userCount, setUserCount] = useState(10)
  const [microsoftLicense, setMicrosoftLicense] = useState('none')
  const [includeServers, setIncludeServers] = useState(false)
  const [serverCount, setServerCount] = useState(1)

  const microsoftLicenses = [
    { 
      id: 'none', 
      name: language === 'nl' ? 'Geen Microsoft licentie' : 'No Microsoft license',
      price: 0,
      description: language === 'nl' ? 'Gebruik je eigen licenties' : 'Use your own licenses'
    },
    { 
      id: 'microsoft-365-business-basic', 
      name: 'Business Basic', 
      price: 6.00,
      description: language === 'nl' ? 'Web Office + 1TB' : 'Web Office + 1TB'
    },
    { 
      id: 'microsoft-365-business-standard', 
      name: 'Business Standard', 
      price: 12.50,
      description: language === 'nl' ? 'Desktop Office + Teams' : 'Desktop Office + Teams'
    },
    { 
      id: 'microsoft-365-business-premium', 
      name: 'Business Premium', 
      price: 22.00,
      description: language === 'nl' ? 'Premium + Beveiliging' : 'Premium + Security'
    }
  ]

  const calculateTotalPrice = () => {
    const basePrice = supportType === 'remote' ? 60 : 90
    const supportCost = userCount * basePrice
    const serverCost = includeServers ? serverCount * basePrice : 0
    const licenseCost = microsoftLicenses.find(l => l.id === microsoftLicense)?.price || 0
    const totalLicenseCost = userCount * licenseCost
    
    const monthlyTotal = supportCost + serverCost + totalLicenseCost
    const yearlyTotal = monthlyTotal * 12 * 0.9 // 10% yearly discount
    
    return billingPeriod === 'monthly' ? monthlyTotal : yearlyTotal / 12
  }

  const getSupportCost = () => {
    const basePrice = supportType === 'remote' ? 60 : 90
    return (userCount * basePrice) + (includeServers ? serverCount * basePrice : 0)
  }

  const getLicenseCost = () => {
    const licenseCost = microsoftLicenses.find(l => l.id === microsoftLicense)?.price || 0
    return userCount * licenseCost
  }

  const handleDownloadPDF = async () => {
    try {
      // Build services array for the quote
      const services = []
      
      // Add support service
      services.push({
        serviceId: supportType === 'remote' ? 'ayce-remote' : 'ayce-onsite',
        quantity: userCount
      })
      
      // Add Microsoft license if selected
      if (microsoftLicense !== 'none') {
        services.push({
          serviceId: microsoftLicense,
          quantity: userCount
        })
      }
      
      // Generate the quote
      const quote = generateQuote(services)
      
      // Download the PDF
      downloadQuotePDF({ 
        quote, 
        isYearly: billingPeriod === 'yearly',
        language: language as 'nl' | 'en'
      })
      
      toast({
        title: language === 'nl' ? 'PDF gedownload!' : 'PDF downloaded!',
        description: language === 'nl' 
          ? 'Je offerte is succesvol gedownload.' 
          : 'Your quote has been successfully downloaded.',
      })
    } catch (error) {
      toast({
        title: language === 'nl' ? 'Download mislukt' : 'Download failed',
        description: language === 'nl' 
          ? 'Er ging iets mis bij het downloaden.' 
          : 'Something went wrong while downloading.',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary text-black">
              {language === 'nl' ? 'Transparante Prijzen' : 'Transparent Pricing'}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {language === 'nl' ? 'Eenvoudige, Eerlijke Prijzen' : 'Simple, Fair Pricing'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {language === 'nl' 
                ? 'Geen verborgen kosten. Geen verrassingen. Gewoon duidelijke prijzen voor premium IT-support.'
                : 'No hidden costs. No surprises. Just clear pricing for premium IT support.'
              }
            </p>
          </div>
        </motion.div>
      </section>

      {/* Super Clear Calculator */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            {/* Title */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                <Calculator className="w-10 h-10 text-primary" />
                {language === 'nl' ? 'Bereken Je Investering' : 'Calculate Your Investment'}
              </h2>
              <p className="text-lg text-muted-foreground">
                {language === 'nl' 
                  ? 'In 3 simpele stappen naar je persoonlijke offerte'
                  : 'Get your personal quote in 3 simple steps'
                }
              </p>
            </div>

            {/* Step 1: Primary Choice - Support Type */}
            <div className="mb-8">
              <Card className="border-2 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-muted/50 to-background">
                  <div className="flex items-center gap-3">
                    <Badge className="text-lg px-3 py-1">1</Badge>
                    <CardTitle className="text-2xl">
                      {language === 'nl' ? 'Kies Je Support Type' : 'Choose Your Support Type'}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Remote Support Option */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all hover:shadow-xl ${
                          supportType === 'remote' ? 'ring-2 ring-primary border-primary' : 'hover:border-border'
                        }`}
                        onClick={() => setSupportType('remote')}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <Home className="w-8 h-8 text-blue-600" />
                            </div>
                            {supportType === 'remote' && 
                              <Badge className="bg-primary text-black">
                                <Check className="w-4 h-4 mr-1" />
                                Geselecteerd
                              </Badge>
                            }
                          </div>
                          <h3 className="text-2xl font-bold mb-2">
                            Remote Support
                          </h3>
                          <p className="text-4xl font-bold text-primary mb-3">
                            €60
                            <span className="text-lg font-normal text-muted-foreground">/gebruiker/maand</span>
                          </p>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{language === 'nl' ? '24/7 Support op afstand' : '24/7 Remote support'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{language === 'nl' ? 'Proactief systeembeheer' : 'Proactive system management'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{language === 'nl' ? 'Inclusief alle beveiliging' : 'All security included'}</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Onsite Support Option */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all hover:shadow-xl relative ${
                          supportType === 'onsite' ? 'ring-2 ring-primary border-primary' : 'hover:border-border'
                        }`}
                        onClick={() => setSupportType('onsite')}
                      >
                        <div className="absolute -top-3 -right-3">
                          <Badge className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-3 py-1">
                            <Sparkles className="w-3 h-3 mr-1" />
                            {language === 'nl' ? 'Populair' : 'Popular'}
                          </Badge>
                        </div>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                              <Car className="w-8 h-8 text-purple-600" />
                            </div>
                            {supportType === 'onsite' && 
                              <Badge className="bg-primary text-black">
                                <Check className="w-4 h-4 mr-1" />
                                Geselecteerd
                              </Badge>
                            }
                          </div>
                          <h3 className="text-2xl font-bold mb-2">
                            Onsite Support
                          </h3>
                          <p className="text-4xl font-bold text-primary mb-3">
                            €90
                            <span className="text-lg font-normal text-muted-foreground">/gebruiker/maand</span>
                          </p>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm font-semibold">{language === 'nl' ? 'Alles van Remote +' : 'Everything from Remote +'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{language === 'nl' ? 'Support op locatie' : 'Onsite support visits'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{language === 'nl' ? 'Hardware installatie & reparatie' : 'Hardware installation & repair'}</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Configuration */}
              <div className="lg:col-span-2 space-y-6">
                {/* Step 2: User Count */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">2</Badge>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        {language === 'nl' ? 'Aantal Gebruikers' : 'Number of Users'}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <span className="text-5xl font-bold text-primary">{userCount}</span>
                        <span className="text-xl text-muted-foreground ml-2">
                          {language === 'nl' ? 'gebruikers' : 'users'}
                        </span>
                      </div>
                      <Slider
                        value={[userCount]}
                        onValueChange={(v) => setUserCount(v[0])}
                        min={1}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1</span>
                        <span>25</span>
                        <span>50</span>
                        <span>75</span>
                        <span>100+</span>
                      </div>
                      {userCount > 50 && (
                        <p className="text-sm text-green-600 text-center">
                          {language === 'nl' 
                            ? '💰 Volume korting beschikbaar voor 50+ gebruikers!'
                            : '💰 Volume discount available for 50+ users!'
                          }
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Step 3: Optional Add-ons */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">3</Badge>
                    <h3 className="text-lg font-semibold">
                      {language === 'nl' ? 'Optionele Extra\'s' : 'Optional Extras'}
                    </h3>
                  </div>

                  {/* Microsoft Licenses - Compact */}
                  <Card className="border-dashed">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Microsoft 365 Licenties
                        <Badge variant="outline" className="text-xs ml-auto">
                          {language === 'nl' ? 'Optioneel' : 'Optional'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select value={microsoftLicense} onValueChange={setMicrosoftLicense}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {microsoftLicenses.map((license) => (
                            <SelectItem key={license.id} value={license.id}>
                              <div className="flex justify-between items-center w-full">
                                <span>{license.name}</span>
                                {license.price > 0 && (
                                  <span className="text-sm text-muted-foreground ml-4">
                                    €{license.price}/user
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>

                  {/* Server Management - Compact */}
                  <Card className="border-dashed">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4" />
                          {language === 'nl' ? 'Server Beheer' : 'Server Management'}
                        </div>
                        <Switch
                          checked={includeServers}
                          onCheckedChange={setIncludeServers}
                        />
                      </CardTitle>
                    </CardHeader>
                    {includeServers && (
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">{serverCount}</span>
                            <span className="text-sm text-muted-foreground">
                              {language === 'nl' ? 'servers' : 'servers'}
                            </span>
                          </div>
                          <Slider
                            value={[serverCount]}
                            onValueChange={(v) => setServerCount(v[0])}
                            min={1}
                            max={10}
                            step={1}
                          />
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </div>
              </div>

              {/* Right Column - Price Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24 border-2 border-primary shadow-2xl">
                  <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-black">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Euro className="w-6 h-6" />
                      {language === 'nl' ? 'Totaaloverzicht' : 'Total Overview'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    {/* Billing Toggle */}
                    <Tabs value={billingPeriod} onValueChange={(v) => setBillingPeriod(v as 'monthly' | 'yearly')}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="monthly">
                          {language === 'nl' ? 'Maandelijks' : 'Monthly'}
                        </TabsTrigger>
                        <TabsTrigger value="yearly">
                          {language === 'nl' ? 'Jaarlijks' : 'Yearly'}
                          <Badge className="ml-1 bg-green-600 text-white text-xs">-10%</Badge>
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    {/* Clear Price Breakdown */}
                    <div className="space-y-3 pt-4 border-t">
                      {/* Support Cost */}
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">
                              {supportType === 'remote' ? 'Remote Support' : 'Onsite Support'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {userCount} users × €{supportType === 'remote' ? '60' : '90'}
                              {includeServers && ` + ${serverCount} servers`}
                            </p>
                          </div>
                          <span className="text-lg font-bold">€{getSupportCost()}</span>
                        </div>
                      </div>

                      {/* Microsoft Licenses */}
                      {microsoftLicense !== 'none' && (
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">Microsoft 365</p>
                              <p className="text-xs text-muted-foreground">
                                {userCount} × {microsoftLicenses.find(l => l.id === microsoftLicense)?.name}
                              </p>
                            </div>
                            <span className="text-lg font-bold">€{getLicenseCost()}</span>
                          </div>
                        </div>
                      )}

                      {/* Yearly Discount */}
                      {billingPeriod === 'yearly' && (
                        <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex justify-between items-center">
                            <span className="text-green-700 dark:text-green-400 font-semibold">
                              {language === 'nl' ? '🎉 Jaarlijkse korting' : '🎉 Yearly discount'}
                            </span>
                            <span className="text-green-700 dark:text-green-400 font-bold">-10%</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Total Price - Super Clear */}
                    <div className="pt-4 border-t-2 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        {language === 'nl' ? 'Totaal per maand' : 'Total per month'}
                      </p>
                      <p className="text-5xl font-bold text-primary mb-2">
                        €{calculateTotalPrice().toFixed(0)}
                      </p>
                      {billingPeriod === 'yearly' && (
                        <Badge className="bg-green-600 text-white">
                          {language === 'nl' ? 'Je bespaart' : 'You save'} €{(calculateTotalPrice() * 12 * 0.1 / 12).toFixed(0)}/maand
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-4">
                      <Button 
                        onClick={handleDownloadPDF}
                        className="w-full bg-primary hover:bg-primary/90 text-black"
                        size="lg"
                      >
                        <FileDown className="w-4 h-4 mr-2" />
                        {language === 'nl' ? 'Download Offerte' : 'Download Quote'}
                      </Button>
                      <Button 
                        asChild
                        variant="outline" 
                        className="w-full"
                        size="lg"
                      >
                        <Link href="/contact">
                          <Mail className="w-4 h-4 mr-2" />
                          {language === 'nl' ? 'Contact Opnemen' : 'Get in Touch'}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MSP Services Breakdown - Detailed Explanation */}
      <section className="py-20 bg-card dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <MSPServicesBreakdown language={language} />
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-muted/50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              {language === 'nl' ? 'Wat zit er allemaal bij in?' : 'What\'s included?'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    {language === 'nl' ? 'Altijd Inbegrepen' : 'Always Included'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>{language === 'nl' ? 'Complete antivirus & malware bescherming' : 'Complete antivirus & malware protection'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>{language === 'nl' ? 'Automatische backups' : 'Automatic backups'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>{language === 'nl' ? 'Proactieve monitoring 24/7' : 'Proactive monitoring 24/7'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>{language === 'nl' ? 'Patch management' : 'Patch management'}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <X className="w-5 h-5 text-red-600" />
                    {language === 'nl' ? 'Geen Extra Kosten Voor' : 'No Extra Costs For'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <X className="w-5 h-5 text-red-600 mt-0.5" />
                      <span>{language === 'nl' ? 'Installatie of setup' : 'Installation or setup'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-5 h-5 text-red-600 mt-0.5" />
                      <span>{language === 'nl' ? 'Software updates' : 'Software updates'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-5 h-5 text-red-600 mt-0.5" />
                      <span>{language === 'nl' ? 'Telefonische support' : 'Phone support'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-5 h-5 text-red-600 mt-0.5" />
                      <span>{language === 'nl' ? 'Remote assistentie' : 'Remote assistance'}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            {language === 'nl' 
              ? 'Klaar om te beginnen?'
              : 'Ready to get started?'
            }
          </h2>
          <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
            {language === 'nl'
              ? 'Geen lange contracten. Geen verborgen kosten. Start vandaag nog met professionele IT-support.'
              : 'No long contracts. No hidden fees. Start with professional IT support today.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              asChild
              className="text-lg"
            >
              <Link href="/contact">
                <HeadphonesIcon className="w-5 h-5 mr-2" />
                {language === 'nl' ? 'Vraag Demo Aan' : 'Request Demo'}
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              asChild
              className="text-lg bg-card/10 backdrop-blur border-white/20 hover:bg-card/20"
            >
              <Link href="/tevredenheidscheck">
                <Zap className="w-5 h-5 mr-2" />
                {language === 'nl' ? 'Gratis IT-Check' : 'Free IT Check'}
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}