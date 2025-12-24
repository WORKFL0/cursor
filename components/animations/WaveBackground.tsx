'use client'

import { motion } from 'framer-motion'

interface WaveBackgroundProps {
  className?: string
  color?: string
  waveCount?: number
}

export default function WaveBackground({
  className = '',
  color = '#f2f400',
  waveCount = 3,
}: WaveBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: waveCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '200px',
            opacity: 0.1 - i * 0.03,
          }}
          initial={{ x: '-100%' }}
          animate={{
            x: ['0%', '100%'],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 2,
          }}
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-full"
            style={{ transform: `scale(${1 + i * 0.2})` }}
          >
            <path
              d={`M0,${40 + i * 10}
                  Q300,${10 + i * 5} 600,${40 + i * 10}
                  T1200,${40 + i * 10}
                  V120 H0 Z`}
              fill={color}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
