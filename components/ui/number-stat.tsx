'use client'

import { motion } from '@/lib/framer-motion'

interface NumberStatProps {
  value: string
  label: string
  className?: string
}

/**
 * NumberStat - Premium Art Director Design System
 * 
 * Reusable stat component for displaying metrics
 * Used in logo section and throughout site
 * 
 * Specs:
 * - H3 typography for value
 * - Caption typography for label
 * - Primary color for value
 * - Muted color for label
 * - Animate on scroll
 */
export function NumberStat({ value, label, className = '' }: NumberStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-center ${className}`}
    >
      <div className="workflo-h3 text-primary">{value}</div>
      <div className="workflo-caption text-workflo-gray dark:text-gray-300">{label}</div>
    </motion.div>
  )
}
