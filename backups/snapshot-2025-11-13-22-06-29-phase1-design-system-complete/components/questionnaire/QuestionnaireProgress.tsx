'use client'

import { motion } from '@/lib/framer-motion'
import { useLanguage } from '@/lib/contexts/language-context'

interface QuestionnaireProgressProps {
  current: number
  total: number
}

export default function QuestionnaireProgress({ current, total }: QuestionnaireProgressProps) {
  const { language } = useLanguage()
  const percentage = (current / total) * 100

  return (
    <div className="p-6 bg-muted/50 border-b">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          {language === 'nl' ? `Vraag ${current} van ${total}` : `Question ${current} of ${total}`}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {Math.round(percentage)}% {language === 'nl' ? 'compleet' : 'complete'}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}