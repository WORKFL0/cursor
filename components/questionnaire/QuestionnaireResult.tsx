'use client'

import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, XCircle, TrendingUp, ArrowRight, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { useLanguage } from '@/lib/contexts/language-context'
import { QuestionnaireResult as Result } from '@/lib/data/questionnaire-data'

interface QuestionnaireResultProps {
  result: Result
  onRestart: () => void
}

export default function QuestionnaireResult({ result, onRestart }: QuestionnaireResultProps) {
  const { language } = useLanguage()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const getIcon = () => {
    switch (result.category) {
      case 'excellent':
        return <CheckCircle className="w-16 h-16 text-green-500" />
      case 'good':
        return <TrendingUp className="w-16 h-16 text-blue-500" />
      case 'needs-improvement':
        return <AlertCircle className="w-16 h-16 text-yellow-500" />
      case 'critical':
        return <XCircle className="w-16 h-16 text-red-500" />
    }
  }

  const getColorClass = () => {
    switch (result.category) {
      case 'excellent':
        return 'bg-green-50 border-green-200'
      case 'good':
        return 'bg-blue-50 border-blue-200'
      case 'needs-improvement':
        return 'bg-yellow-50 border-yellow-200'
      case 'critical':
        return 'bg-red-50 border-red-200'
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send the email and results to your backend
    console.log('Submitting results for:', email)
    setSubmitted(true)
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="flex justify-center mb-6"
      >
        {getIcon()}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-center text-foreground mb-4"
      >
        {language === 'nl' ? result.title : result.titleEN}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-2 bg-muted rounded-full px-4 py-2">
          <span className="text-sm font-medium text-muted-foreground">
            {language === 'nl' ? 'Uw score:' : 'Your score:'}
          </span>
          <span className="text-2xl font-bold text-primary">
            {Math.round(result.score)}%
          </span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-muted-foreground text-center mb-8 text-lg"
      >
        {language === 'nl' ? result.description : result.descriptionEN}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`rounded-xl border-2 p-6 mb-8 ${getColorClass()}`}
      >
        <h3 className="font-semibold text-foreground mb-4">
          {language === 'nl' ? 'Onze aanbevelingen:' : 'Our recommendations:'}
        </h3>
        <ul className="space-y-3">
          {(language === 'nl' ? result.recommendations : result.recommendationsEN).map((rec, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{rec}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {!submitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-muted/30 rounded-xl p-6 mb-8"
        >
          <h3 className="font-semibold text-foreground mb-4">
            {language === 'nl' 
              ? 'Ontvang je gepersonaliseerde IT-rapport' 
              : 'Receive your personalized IT report'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'nl' ? 'Uw e-mailadres' : 'Your email address'}
                className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {language === 'nl' ? 'Stuur mijn rapport' : 'Send my report'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <h3 className="font-semibold text-foreground">
                {language === 'nl' ? 'Bedankt!' : 'Thank you!'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'nl' 
                  ? 'Uw rapport is verstuurd naar ' + email
                  : 'Your report has been sent to ' + email}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button
          asChild
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
        >
          <Link href="/contact">
            {language === 'nl' ? result.ctaText : result.ctaTextEN}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button
          onClick={onRestart}
          variant="outline"
          className="flex-1 border-2 border-input"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {language === 'nl' ? 'Opnieuw beginnen' : 'Start over'}
        </Button>
      </motion.div>
    </div>
  )
}