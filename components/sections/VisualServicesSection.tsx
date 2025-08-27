'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { 
  Shield, 
  Cloud, 
  Monitor, 
  Smartphone,
  Network,
  ChevronRight,
  Sparkles,
  Lock,
  Wifi
} from 'lucide-react'
import { useLanguage } from '@/lib/contexts/language-context'

export default function VisualServicesSection() {
  const { language } = useLanguage()
  
  const services = [
    {
      title: language === 'nl' ? 'Cloud Diensten' : 'Cloud Services',
      description: language === 'nl' 
        ? 'Moderne cloud-oplossingen voor maximale flexibiliteit en schaalbaarheid'
        : 'Modern cloud solutions for maximum flexibility and scalability',
      image: '/images/cloud-services.png',
      icon: Cloud,
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      link: '/diensten/cloud'
    },
    {
      title: language === 'nl' ? 'Device Management' : 'Device Management',
      description: language === 'nl'
        ? 'Beheer al je apparaten centraal, veilig en efficiënt'
        : 'Manage all your devices centrally, securely and efficiently',
      image: '/images/mobile-device-management.png',
      icon: Smartphone,
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30',
      link: '/diensten/hardware-as-a-service'
    },
    {
      title: language === 'nl' ? 'Connectiviteit' : 'Connectivity',
      description: language === 'nl'
        ? 'Betrouwbare netwerken die jouw business verbinden'
        : 'Reliable networks that connect your business',
      image: '/images/connectivity-network.png',
      icon: Network,
      color: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30',
      link: '/diensten/managed-it'
    },
    {
      title: language === 'nl' ? 'Werkplek Oplossingen' : 'Workplace Solutions',
      description: language === 'nl'
        ? 'Moderne digitale werkplekken voor productief werken'
        : 'Modern digital workplaces for productive work',
      image: '/images/laptop-mockup.png',
      icon: Monitor,
      color: 'from-workflo-yellow/20 to-red-500/20',
      borderColor: 'border-workflo-yellow/30',
      link: '/diensten/microsoft-365'
    }
  ]
  
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-workflo-yellow/15 rounded-full border border-workflo-yellow/30 mb-4">
            <Sparkles className="w-4 h-4 text-workflo-yellow" />
            <span className="text-sm font-medium text-workflo-yellow uppercase tracking-wider">
              {language === 'nl' ? 'Onze Expertise' : 'Our Expertise'}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {language === 'nl' 
              ? 'IT-Oplossingen Die Werken'
              : 'IT Solutions That Work'}
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {language === 'nl'
              ? 'Van cloud tot werkplek, wij hebben de expertise om jouw IT naar een hoger niveau te tillen'
              : 'From cloud to workplace, we have the expertise to elevate your IT to the next level'}
          </p>
        </motion.div>
        
        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`group h-full relative overflow-hidden border-2 hover:border-workflo-yellow/50 hover:shadow-2xl hover:shadow-workflo-yellow/10 transition-all duration-300 hover:scale-105`}>
                <div className={`absolute inset-0 bg-gradient-to-br from-workflo-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative p-6">
                  {/* Icon & Image */}
                  <div className="mb-6 relative h-32 flex items-center justify-center">
                    {service.image && (
                      <div className="relative w-full h-full">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    )}
                    <div className="absolute top-0 right-0 bg-workflo-yellow/10 rounded-full p-2 group-hover:bg-workflo-yellow/20 transition-all">
                      <service.icon className="w-6 h-6 text-workflo-yellow" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-workflo-yellow transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 group-hover:text-foreground/80 transition-colors">
                    {service.description}
                  </p>
                  
                  {/* Link */}
                  <Link 
                    href={service.link}
                    className="inline-flex items-center gap-2 text-workflo-yellow font-medium text-sm group-hover:gap-3 transition-all hover:text-workflo-yellow/80"
                  >
                    {language === 'nl' ? 'Meer info' : 'Learn more'}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-card rounded-2xl p-8 shadow-xl"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-workflo-yellow/15 rounded-full flex items-center justify-center mx-auto mb-4 border border-workflo-yellow/20 group-hover:bg-workflo-yellow/25 group-hover:scale-110 transition-all duration-300">
                <Shield className="w-8 h-8 text-workflo-yellow" />
              </div>
              <h4 className="font-semibold text-lg mb-2 group-hover:text-workflo-yellow transition-colors">
                {language === 'nl' ? 'Veiligheid Voorop' : 'Security First'}
              </h4>
              <p className="text-muted-foreground text-sm group-hover:text-foreground/80 transition-colors">
                {language === 'nl'
                  ? 'Enterprise-grade beveiliging voor al onze oplossingen'
                  : 'Enterprise-grade security for all our solutions'}
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-workflo-yellow/15 rounded-full flex items-center justify-center mx-auto mb-4 border border-workflo-yellow/20 group-hover:bg-workflo-yellow/25 group-hover:scale-110 transition-all duration-300">
                <Wifi className="w-8 h-8 text-workflo-yellow" />
              </div>
              <h4 className="font-semibold text-lg mb-2 group-hover:text-workflo-yellow transition-colors">
                {language === 'nl' ? 'Altijd Verbonden' : 'Always Connected'}
              </h4>
              <p className="text-muted-foreground text-sm group-hover:text-foreground/80 transition-colors">
                {language === 'nl'
                  ? '99.9% uptime garantie met redundante systemen'
                  : '99.9% uptime guarantee with redundant systems'}
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-workflo-yellow/15 rounded-full flex items-center justify-center mx-auto mb-4 border border-workflo-yellow/20 group-hover:bg-workflo-yellow/25 group-hover:scale-110 transition-all duration-300">
                <Lock className="w-8 h-8 text-workflo-yellow" />
              </div>
              <h4 className="font-semibold text-lg mb-2 group-hover:text-workflo-yellow transition-colors">
                {language === 'nl' ? 'GDPR Compliant' : 'GDPR Compliant'}
              </h4>
              <p className="text-muted-foreground text-sm group-hover:text-foreground/80 transition-colors">
                {language === 'nl'
                  ? 'Volledig conform privacy wetgeving en standaarden'
                  : 'Fully compliant with privacy laws and standards'}
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" className="bg-workflo-yellow text-black hover:bg-workflo-yellow/90 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <Link href="/diensten">
              {language === 'nl' ? 'Bekijk Alle Diensten' : 'View All Services'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}