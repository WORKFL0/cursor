'use client'

import { motion } from '@/lib/framer-motion'
import { ReactNode } from 'react'

interface QuestionnaireCardProps {
  children: ReactNode
}

export default function QuestionnaireCard({ children }: QuestionnaireCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
        <div className="h-1 bg-gradient-to-r from-primary-300 via-primary-400 to-primary-300"></div>
        {children}
      </div>
    </motion.div>
  )
}