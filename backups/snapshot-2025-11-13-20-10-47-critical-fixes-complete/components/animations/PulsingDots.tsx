'use client'

import { motion } from 'framer-motion'

interface PulsingDotsProps {
  count?: number
  color?: string
  className?: string
}

export default function PulsingDots({
  count = 20,
  color = '#f2f400',
  className = '',
}: PulsingDotsProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const size = Math.random() * 8 + 4
        const left = Math.random() * 100
        const top = Math.random() * 100
        const duration = Math.random() * 3 + 2
        const delay = Math.random() * 2

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )
      })}
    </div>
  )
}
