'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Monitor, Laptop, Printer, Smartphone, RefreshCw, TrendingUp, ArrowRight, CheckCircle, Users, Euro, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function HardwareAsAServicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 bg-gradient-to-br from-purple-50 via-background to-pink-50 dark:from-purple-950/20 dark:via-background dark:to-pink-950/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4">
              Altijd de Nieuwste Hardware
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Hardware as a Service: Geen Investeringen, Wel de Nieuwste Tech
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Stop met dure hardware investeringen die snel verouderen. Met Workflo's Hardware as a Service 
              krijgt je team altijd de nieuwste laptops, desktops en apparatuur tegen een voorspelbare 
              maandelijkse prijs. Perfect voor groeiende Amsterdamse bedrijven.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/tevredenheidscheck">
                  Bereken Je Hardware Besparing <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/prijzen">
                  Bekijk HaaS Prijzen
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Problems with Traditional Hardware */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">De Problemen met Hardware Kopen</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Traditionele hardware aankoop brengt uitdagingen met zich mee die je bedrijf vertragen
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Hoge Initiële Kosten",
                description: "€15.000 - €50.000 investering voor 10 werkplekken. Dat geld kun je beter gebruiken voor groei.",
                impact: "Cashflow probleem"
              },
              {
                title: "Snelle Veroudering",
                description: "Hardware is na 3 jaar al verouderd. Nieuwe software vereist krachtigere systemen.",
                impact: "Productiviteitsverlies"
              },
              {
                title: "Onderhoud & Support",
                description: "Defecte hardware betekent downtime. Reparaties duren dagen en kosten geld.",
                impact: "Onproductieve dagen"
              },
              {
                title: "Geen Flexibiliteit",
                description: "Team groeit? U moet opnieuw investeren. Team krimpt? U zit vast aan overtollige hardware.",
                impact: "Inefficiënte resources"
              }
            ].map((problem, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-red-200 dark:border-red-800">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-3 text-red-600 dark:text-red-400">{problem.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{problem.description}</p>
                    <Badge variant="destructive" className="text-xs">
                      {problem.impact}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our HaaS Solution */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Workflo Hardware as a Service Voordelen</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Alle voordelen van de nieuwste hardware zonder de nadelen van eigendom
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Euro,
                title: "Voorspelbare Kosten",
                description: "Vaste maandelijkse prijs per apparaat. Geen verrassingen, geen grote investeringen. Perfect voor budgettering en cashflow."
              },
              {
                icon: RefreshCw,
                title: "Altijd Up-to-Date",
                description: "Automatische hardware refresh elke 3 jaar. Je team werkt altijd met de nieuwste, snelste apparatuur."
              },
              {
                icon: Zap,
                title: "Snelle Deployment",
                description: "Nieuwe medewerker? Binnen 24 uur heeft deze een volledig geconfigureerde laptop klaarstaan."
              },
              {
                icon: TrendingUp,
                title: "Schaal Mee met Groei",
                description: "Team groeit? Voeg eenvoudig apparaten toe. Team krimpt? Geef apparaten terug. Geen verspilling."
              },
              {
                icon: Users,
                title: "Volledige Support",
                description: "Defect apparaat? Binnen 4 uur vervanging. Alle support, onderhoud en reparaties inbegrepen."
              },
              {
                icon: Monitor,
                title: "Enterprise-Grade Hardware",
                description: "Alleen business-grade merken zoals Dell, HP en Lenovo. Geen consumen hardware die snel defect gaat."
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4 flex items-center justify-center">
                      <benefit.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hardware Options */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Hardware Opties & Prijzen</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Van budget-vriendelijk tot high-performance - voor elke functie het juiste apparaat
            </p>
          </motion.div>

          <Tabs defaultValue="laptops" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="laptops">Laptops</TabsTrigger>
              <TabsTrigger value="desktops">Desktops</TabsTrigger>
              <TabsTrigger value="accessories">Accessoires</TabsTrigger>
              <TabsTrigger value="mobile">Mobiel</TabsTrigger>
            </TabsList>
            
            <TabsContent value="laptops" className="mt-8">
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Essential Laptop",
                    price: "€35/maand",
                    specs: "Intel i5, 8GB RAM, 256GB SSD",
                    ideal: "Kantoorwerk, email, Office",
                    features: ["13-14 inch display", "8+ uur batterij", "Windows 11 Pro", "3 jaar garantie"]
                  },
                  {
                    name: "Professional Laptop",
                    price: "€55/maand",
                    specs: "Intel i7, 16GB RAM, 512GB SSD",
                    ideal: "Design, development, multitasking",
                    features: ["15 inch display", "Premium build quality", "Backlit keyboard", "Docking station support"],
                    popular: true
                  },
                  {
                    name: "Workstation Laptop",
                    price: "€85/maand",
                    specs: "Intel i9, 32GB RAM, 1TB SSD",
                    ideal: "Video editing, 3D rendering, CAD",
                    features: ["17 inch 4K display", "Dedicated graphics", "ECC memory", "ISV certification"]
                  }
                ].map((laptop, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className={laptop.popular ? "border-primary" : ""}>
                      <CardHeader>
                        {laptop.popular && <Badge className="mb-2 w-fit">Meest Populair</Badge>}
                        <CardTitle>{laptop.name}</CardTitle>
                        <div className="text-2xl font-bold text-primary">{laptop.price}</div>
                        <CardDescription>{laptop.specs}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-medium mb-3 text-muted-foreground">Ideaal voor: {laptop.ideal}</p>
                        <ul className="space-y-1">
                          {laptop.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="desktops" className="mt-8">
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Compact Desktop",
                    price: "€25/maand",
                    specs: "Intel i5, 8GB RAM, 256GB SSD",
                    ideal: "Reception, basic kantoorwerk",
                    features: ["Mini PC form factor", "Dual monitor support", "Wi-Fi 6", "Ultra quiet"]
                  },
                  {
                    name: "Business Desktop",
                    price: "€40/maand",
                    specs: "Intel i7, 16GB RAM, 512GB SSD",
                    ideal: "Power users, multitasking",
                    features: ["Tower/SFF options", "Multiple display outputs", "Expansion slots", "Tool-less upgrade"],
                    popular: true
                  },
                  {
                    name: "Workstation Desktop",
                    price: "€75/maand",
                    specs: "Intel Xeon, 32GB RAM, 1TB SSD",
                    ideal: "Engineering, rendering, analysis",
                    features: ["ECC memory support", "Professional graphics", "RAID storage", "ISV certified"]
                  }
                ].map((desktop, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className={desktop.popular ? "border-primary" : ""}>
                      <CardHeader>
                        {desktop.popular && <Badge className="mb-2 w-fit">Meest Populair</Badge>}
                        <CardTitle>{desktop.name}</CardTitle>
                        <div className="text-2xl font-bold text-primary">{desktop.price}</div>
                        <CardDescription>{desktop.specs}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-medium mb-3 text-muted-foreground">Ideaal voor: {desktop.ideal}</p>
                        <ul className="space-y-1">
                          {desktop.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="accessories" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "27\" Monitor", price: "€15/maand", description: "4K IPS display voor productiviteit" },
                  { name: "Docking Station", price: "€8/maand", description: "USB-C dock met alle connectiviteit" },
                  { name: "Business Printer", price: "€25/maand", description: "All-in-one printer met managed print" },
                  { name: "Headset", price: "€5/maand", description: "Professionele headset voor calls" }
                ].map((accessory, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card>
                      <CardContent className="p-6 text-center">
                        <h3 className="font-bold mb-2">{accessory.name}</h3>
                        <div className="text-xl font-bold text-primary mb-2">{accessory.price}</div>
                        <p className="text-sm text-muted-foreground">{accessory.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="mobile" className="mt-8">
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Business Smartphone",
                    price: "€20/maand",
                    specs: "iPhone/Samsung Galaxy",
                    features: ["Enterprise security", "Mobile device management", "Business apps", "Unlimited data plan"]
                  },
                  {
                    name: "Tablet",
                    price: "€15/maand",
                    specs: "iPad/Surface tablet",
                    features: ["Perfect voor presentations", "Remote work", "Digital signing", "Long battery life"]
                  },
                  {
                    name: "Mobile Hotspot",
                    price: "€12/maand",
                    specs: "5G mobile router",
                    features: ["Backup internet", "Event connectivity", "Travel internet", "10+ devices"]
                  }
                ].map((mobile, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>{mobile.name}</CardTitle>
                        <div className="text-2xl font-bold text-primary">{mobile.price}</div>
                        <CardDescription>{mobile.specs}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {mobile.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* ROI Comparison */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">HaaS vs. Hardware Kopen: 3-Jaar Vergelijking</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              De werkelijke kosten van hardware eigendom vs. Hardware as a Service
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="border-red-200 dark:border-red-800">
                  <CardHeader>
                    <CardTitle className="text-xl text-red-600 dark:text-red-400">Hardware Kopen (10 laptops)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Initiële investering</span>
                        <span className="font-semibold">€25.000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Support & onderhoud</span>
                        <span className="font-semibold">€7.500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vervanging defecten</span>
                        <span className="font-semibold">€3.500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Afschrijving/waardedaling</span>
                        <span className="font-semibold">€18.000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IT management tijd</span>
                        <span className="font-semibold">€4.000</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-bold">Totale kosten 3 jaar:</span>
                        <span className="font-bold text-red-600 dark:text-red-400">€58.000</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-600 dark:text-green-400">Workflo HaaS (10 laptops)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Setup kosten</span>
                        <span className="font-semibold">€0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maandelijke kosten (36 maanden)</span>
                        <span className="font-semibold">€39.600</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Support & onderhoud</span>
                        <span className="font-semibold">€0 (inbegrepen)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vervangingen</span>
                        <span className="font-semibold">€0 (inbegrepen)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IT management</span>
                        <span className="font-semibold">€0 (wij doen het)</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-bold">Totale kosten 3 jaar:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">€39.600</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <Card className="inline-block bg-gradient-to-r from-green-50 to-purple-50 dark:from-green-950/30 dark:to-purple-950/30">
                <CardContent className="p-6">
                  <p className="text-2xl font-bold mb-2">Bespaar €18.400 over 3 jaar</p>
                  <p className="text-muted-foreground">Plus altijd nieuwste hardware en geen zorgen over onderhoud</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-8">
                <blockquote className="text-lg text-muted-foreground italic mb-4 leading-relaxed">
                  "Hardware as a Service van Workflo heeft onze cashflow enorm verbeterd. 
                  In plaats van €30.000 investeren, betalen we nu €1.100 per maand en hebben we altijd de nieuwste laptops. 
                  Toen een laptop van een nieuwe medewerker defect was, lag er binnen 2 uur een vervanger klaar."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Laptop className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Thomas Bakker</p>
                    <p className="text-sm text-muted-foreground">CFO, Amsterdam Design Studio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, currentColor, currentColor 10px, transparent 10px, transparent 20px)`
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Klaar voor Smart Hardware Financiering?</h2>
            <p className="text-xl mb-8 opacity-90">
              Stop met dure investeringen en krijg altijd de nieuwste technologie
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="/tevredenheidscheck">
                  Plan Hardware Assessment <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <div className="text-white">
                <p className="text-sm opacity-90">Of bel voor advies:</p>
                <a href="tel:020-3080465" className="text-lg font-bold hover:underline">020-30 80 465</a>
              </div>
            </div>
            <p className="text-sm opacity-75 mt-6">
              ✓ Gratis hardware audit • ✓ Geen setup kosten • ✓ Flexibele contracten
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}