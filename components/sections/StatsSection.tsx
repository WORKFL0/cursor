'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const stats = [
  {
    value: 100,
    suffix: '+',
    label: 'Tevreden Klanten',
    description: 'MKB bedrijven in Amsterdam en omgeving',
  },
  {
    value: 99.9,
    suffix: '%',
    label: 'Uptime Garantie',
    description: 'Betrojeare systemen, altijd online',
  },
  {
    value: 35,
    suffix: '%',
    label: 'Kostenbesparing',
    description: 'Gemiddelde besparing op IT-kosten',
  },
  {
    value: 15,
    suffix: ' min',
    label: 'Response Tijd',
    description: 'Gemiddelde reactietijd op incidenten',
  },
]

const CountUp = ({ end, duration = 2000, suffix = '', decimals = 0 }: { 
  end: number; 
  duration?: number; 
  suffix?: string;
  decimals?: number;
}) => {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true)
      let startTime: number | null = null
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        const currentCount = progress * end
        setCount(decimals > 0 ? parseFloat(currentCount.toFixed(decimals)) : Math.floor(currentCount))
        if (progress < 1) {
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    }
  }, [hasStarted, end, duration, decimals])

  return (
    <span>
      {decimals > 0 ? count.toFixed(decimals) : count}{suffix}
    </span>
  )
}

export default function StatsSection() {
  const [inView, setInView] = useState(false)

  return (
    <section className="py-24 bg-secondary relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-muted to-secondary"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/50 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Warning Tape Accents */}
      <div className="absolute top-0 left-0 right-0 h-1 warning-tape opacity-80"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 warning-tape opacity-80"></div>

      <div className="container mx-auto container-padding relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          onViewportEnter={() => setInView(true)}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Workflo in <span className="text-primary">Cijfers</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meetbare resultaten die het verschil maken voor je bedrijf
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-5xl lg:text-6xl font-bold text-primary mb-2">
                  {inView && (
                    <CountUp 
                      end={stat.value} 
                      suffix={stat.suffix} 
                      decimals={stat.label === 'Uptime Garantie' ? 1 : 0}
                      duration={2500}
                    />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {stat.label}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium border border-primary/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Gecertificeerd Microsoft Partner sinds 2015</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}