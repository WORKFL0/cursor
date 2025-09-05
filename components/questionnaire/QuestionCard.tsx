'use client'

import { motion } from '@/lib/framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/contexts/language-context'
import { type Question } from '@/lib/data/questionnaire-data'
import { ChevronRight, HelpCircle } from 'lucide-react'

interface QuestionCardProps {
  question: Question
  onAnswer: (optionIndex: number) => void
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const { language } = useLanguage()

  const getCategoryIcon = () => {
    switch (question.category) {
      case 'support':
        return '🛠️'
      case 'communication':
        return '💬'
      case 'quality':
        return '⭐'
      case 'cost':
        return '💰'
      case 'reliability':
        return '🔒'
      default:
        return '📊'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="p-8"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{getCategoryIcon()}</span>
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {question.category || 'algemeen'}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
          {language === 'nl' ? question.question : question.questionEN}
        </h2>
      </div>

      <div className="space-y-3">
        {(language === 'nl' ? question.options : question.optionsEN).map((option, index) => {
          const isPositive = question.type[index] === 'positive'
          const isNegative = question.type[index] === 'negative'
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                onClick={() => onAnswer(index)}
                variant="outline"
                className={`
                  w-full p-6 text-left justify-between group
                  border-2 transition-all duration-200
                  hover:border-primary-400 hover:bg-primary-50
                  ${isPositive ? 'hover:border-green-400 hover:bg-green-50' : ''}
                  ${isNegative ? 'hover:border-red-400 hover:bg-red-50' : ''}
                `}
              >
                <span className="text-base md:text-lg font-medium">
                  {option}
                </span>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary-600 transition-colors" />
              </Button>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-center gap-2 text-sm text-gray-500"
      >
        <HelpCircle className="h-4 w-4" />
        <span>
          {language === 'nl' 
            ? 'Je antwoorden helpen ons om een gepersonaliseerd advies te geven'
            : 'Your answers help us provide personalized advice'}
        </span>
      </motion.div>
    </motion.div>
  )
}