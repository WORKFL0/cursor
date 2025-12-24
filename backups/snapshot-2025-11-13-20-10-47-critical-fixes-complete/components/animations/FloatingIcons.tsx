'use client'

import { motion } from 'framer-motion'
import {
  Monitor,
  Shield,
  Cloud,
  Server,
  Database,
  Lock,
  Wifi,
  Smartphone,
  Laptop,
  HardDrive,
} from 'lucide-react'

const icons = [Monitor, Shield, Cloud, Server, Database, Lock, Wifi, Smartphone, Laptop, HardDrive]

interface FloatingIconsProps {
  count?: number
  className?: string
}

export default function FloatingIcons({ count = 15, className = '' }: FloatingIconsProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const Icon = icons[i % icons.length]
        const size = Math.random() * 30 + 20
        const left = Math.random() * 100
        const top = Math.random() * 100
        const duration = Math.random() * 20 + 15
        const delay = Math.random() * 5

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${left}%`,
              top: `${top}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.15, 0.15, 0],
              scale: [0, 1, 1, 0],
              y: [0, -100, -200, -300],
              x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Icon
              size={size}
              className="text-[#f2f400]"
              strokeWidth={1.5}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
