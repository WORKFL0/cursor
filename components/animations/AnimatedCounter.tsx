'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export default function AnimatedCounter({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  // Determine if we're working with decimals
  const isDecimal = end % 1 !== 0
  const decimalPlaces = isDecimal ? end.toString().split('.')[1]?.length || 1 : 0

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const startValue = 0
    const endValue = end

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const rawCount = startValue + (endValue - startValue) * easeOutQuart

      // Use Math.floor for integers, but preserve decimals for decimal values
      const currentCount = isDecimal
        ? parseFloat(rawCount.toFixed(decimalPlaces))
        : Math.floor(rawCount)

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(endValue)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration, isInView, isDecimal, decimalPlaces])

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      {isDecimal ? count.toFixed(decimalPlaces) : count}
      {suffix}
    </motion.span>
  )
}
