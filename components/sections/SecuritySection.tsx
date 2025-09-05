'use client'

import { motion, useScroll, useTransform } from '@/lib/framer-motion'
import { Shield, Lock, Eye, Activity, Zap, Database, Cloud, Cpu, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useLanguage } from '@/lib/contexts/language-context'
import { useRef } from 'react'

export default function SecuritySection() {
  const { language } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])

  const layers = [
    {
      icon: Globe,
      title: language === 'nl' ? 'Perimeter Beveiliging' : 'Perimeter Security',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      description: language === 'nl' ? 'Firewall & DDoS bescherming' : 'Firewall & DDoS protection'
    },
    {
      icon: Cloud,
      title: language === 'nl' ? 'Cloud Security' : 'Cloud Security',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      description: language === 'nl' ? 'Zero-trust architectuur' : 'Zero-trust architecture'
    },
    {
      icon: Shield,
      title: language === 'nl' ? 'Endpoint Protection' : 'Endpoint Protection',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      description: language === 'nl' ? 'AI-gedreven antivirus' : 'AI-powered antivirus'
    },
    {
      icon: Database,
      title: language === 'nl' ? 'Data Encryptie' : 'Data Encryption',
      color: 'text-workflo-yellow',
      bgColor: 'bg-workflo-yellow/10',
      description: language === 'nl' ? 'AES-256 versleuteling' : 'AES-256 encryption'
    }
  ]

  const metrics = [
    {
      icon: Activity,
      value: '500K+',
      label: language === 'nl' ? 'Dreigingen geblokkeerd per maand' : 'Threats blocked per month',
      color: 'text-red-500'
    },
    {
      icon: Zap,
      value: '0.3s',
      label: language === 'nl' ? 'Gemiddelde responstijd' : 'Average response time',
      color: 'text-workflo-yellow'
    },
    {
      icon: Lock,
      value: '100%',
      label: language === 'nl' ? 'GDPR Compliant' : 'GDPR Compliant',
      color: 'text-green-500'
    }
  ]

  return (
    <section ref={containerRef} className="py-20 bg-gradient-to-b from-background via-background to-muted/30 relative overflow-hidden">
      {/* Animated Background Grid */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{ y }}
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
            <Cpu className="w-3 h-3 mr-1" />
            {language === 'nl' ? 'Intelligente Beveiliging' : 'Intelligent Security'}
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {language === 'nl' 
              ? 'Maximale Cyberbeveiliging'
              : 'Maximum Cybersecurity'}
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'nl' 
              ? 'Meerdere verdedigingslinies beschermen jouw data en systemen tegen moderne cyberdreigingen'
              : 'Multiple lines of defense protect your data and systems against modern cyber threats'}
          </p>
        </motion.div>

        {/* Interactive Layers Visual */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left: Layered Defense Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[400px] flex items-center justify-center">
              {layers.map((layer, index) => (
                <motion.div
                  key={layer.title}
                  className="absolute"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ 
                    scale: 1 - (index * 0.15), 
                    opacity: 1 - (index * 0.15)
                  }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: (1 - (index * 0.15)) * 1.05,
                    zIndex: 10
                  }}
                >
                  <div className={`
                    w-[280px] h-[280px] rounded-full border-2 border-dashed
                    ${index === 0 ? 'border-blue-500/50' : ''}
                    ${index === 1 ? 'border-purple-500/50' : ''}
                    ${index === 2 ? 'border-green-500/50' : ''}
                    ${index === 3 ? 'border-workflo-yellow/50' : ''}
                    flex items-center justify-center
                    ${layer.bgColor} backdrop-blur-sm
                    transition-all duration-300 hover:bg-opacity-20
                    cursor-pointer group
                  `}>
                    <div className="text-center">
                      <layer.icon className={`w-8 h-8 ${layer.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                      <h4 className="font-semibold text-sm mb-1">{layer.title}</h4>
                      <p className="text-xs text-muted-foreground px-4">{layer.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Center Core */}
              <motion.div
                className="absolute z-20"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.8, type: "spring" }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Lock className="w-10 h-10 text-white" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Real-time Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl p-6 border border-border/50">
              <h3 className="text-xl font-semibold mb-6">
                {language === 'nl' ? 'Live Beveiligingsmetrics' : 'Live Security Metrics'}
              </h3>
              
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-between py-4 border-b border-border/30 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-background ${metric.color}`}>
                      <metric.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className="text-sm text-muted-foreground">{metric.label}</div>
                    </div>
                  </div>
                  
                  {/* Animated Activity Indicator */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-1 ${metric.color} bg-current rounded-full`}
                        animate={{
                          height: [8, 20, 8],
                          opacity: [0.3, 1, 0.3]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
            >
              <h4 className="text-lg font-semibold mb-2">
                {language === 'nl' 
                  ? 'Test jouw beveiliging gratis'
                  : 'Test your security for free'}
              </h4>
              <p className="text-sm text-blue-100 mb-4">
                {language === 'nl'
                  ? 'Ontvang een gedetailleerd rapport binnen 24 uur'
                  : 'Receive a detailed report within 24 hours'}
              </p>
              <Button 
                asChild 
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Link href="/diensten/cybersecurity">
                  {language === 'nl' ? 'Start Gratis Scan' : 'Start Free Scan'}
                  <Shield className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Microsoft Partner</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-500" />
            <span>GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-500" />
            <span>24/7 Monitoring</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}