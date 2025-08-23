'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

const CountUp = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true)
      let startTime: number | null = null
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) {
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    }
  }, [hasStarted, end, duration])

  return (
    <span>
      {count}{suffix}
    </span>
  )
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background to-muted/30">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-workflo-yellow/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Subtle Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

      <div className="container mx-auto container-padding relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              No-nonsense ICT dienstverlening voor het MKB
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Wij regelen <span className="text-background bg-workflo-yellow px-2 rounded">uw IT</span>,
              <br />zodat u kunt ondernemen
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Amsterdam&apos;s MKB vertrouwt op Workflo voor betrojeare IT-ondersteuning. 
              Verminder IT-kosten met 35% terwijl u je productiviteit verhoogt.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center lg:text-left"
              >
                <div className="text-3xl font-bold text-foreground">
                  <CountUp end={35} suffix="%" />
                </div>
                <div className="text-sm text-muted-foreground">Kostenbesparing</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center lg:text-left"
              >
                <div className="text-3xl font-bold text-foreground">
                  <CountUp end={99} suffix="%" />
                </div>
                <div className="text-sm text-muted-foreground">Uptime Garantie</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-center lg:text-left"
              >
                <div className="text-3xl font-bold text-foreground">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </motion.div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" variant="workflo" className="font-bold shadow-lg" asChild>
                <Link href="/tevredenheidscheck">
                  Start Gratis IT-Check
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-workflo-yellow text-foreground hover:bg-workflo-yellow-light" asChild>
                <Link href="/diensten">
                  Bekijk Diensten
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>100+ Bedrijven Vertrouwen Ons</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Microsoft Partner</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>ISO Gecertificeerd</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image/Graphic */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Workflo Logo/Graphic */}
              <div className="bg-card rounded-2xl shadow-2xl p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-primary/20"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-primary/20"></div>
                
                <div className="text-center">
                  <div className="text-6xl font-bold mb-4">
                    <span className="text-background bg-workflo-yellow px-1 rounded">Work</span>
                    <span className="text-foreground">flo</span>
                  </div>
                  <p className="text-muted-foreground text-lg mb-6">Een no-nonsense IT bedrijf</p>
                  
                  {/* Service Icons */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <span className="text-xs text-muted-foreground">Security</span>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                      </div>
                      <span className="text-xs text-muted-foreground">Cloud</span>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-muted-foreground">Mobile</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/30 rounded-full blur-xl opacity-40"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}