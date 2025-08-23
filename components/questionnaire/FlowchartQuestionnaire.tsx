'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/contexts/language-context'
import { questions, calculateResult, type Question } from '@/lib/data/questionnaire-data'
import QuestionnaireCard from './QuestionnaireCard'
import QuestionnaireProgress from './QuestionnaireProgress'
import QuestionnaireResult from './QuestionnaireResult'
import QuestionCard from './QuestionCard'

export default function FlowchartQuestionnaire() {
  const { language } = useLanguage()
  const [currentQuestionId, setCurrentQuestionId] = useState(1)
  const [answers, setAnswers] = useState<number[]>([])
  const [questionsAnswered, setQuestionsAnswered] = useState<number[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [showResult, setShowResult] = useState<'satisfied' | 'contact' | null>(null)

  const currentQuestion = questions.find(q => q.id === currentQuestionId)
  const totalQuestions = 10 // Show progress for first 10 questions as main flow

  useEffect(() => {
    // Check if we've reached an endpoint
    if (showResult === 'satisfied' || showResult === 'contact') {
      setIsComplete(true)
    }
  }, [showResult])

  const handleAnswer = (optionIndex: number) => {
    if (!currentQuestion) return

    // Track the answer value (0 = negative, 1 = neutral, 2 = positive)
    const answerValue = currentQuestion.type[optionIndex] === 'positive' ? 2 : 
                       currentQuestion.type[optionIndex] === 'neutral' ? 1 : 0
    setAnswers([...answers, answerValue])
    setQuestionsAnswered([...questionsAnswered, currentQuestion.id])

    // Determine next step
    const nextStep = currentQuestion.next[optionIndex]
    
    if (nextStep === 'satisfied') {
      setShowResult('satisfied')
    } else if (nextStep === 'contact') {
      setShowResult('contact')
    } else if (typeof nextStep === 'number') {
      setCurrentQuestionId(nextStep)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionId(1)
    setAnswers([])
    setQuestionsAnswered([])
    setIsComplete(false)
    setShowResult(null)
  }

  if (isComplete && showResult) {
    const result = showResult === 'satisfied' 
      ? calculateResult(answers)
      : {
          ...calculateResult(answers),
          category: 'critical' as const,
          title: language === 'nl' ? 'Tijd voor een upgrade!' : 'Time for an upgrade!',
          titleEN: 'Time for an upgrade!',
          description: language === 'nl' 
            ? 'Het lijkt erop dat je huidige IT-oplossing niet meer voldoet aan je behoeften. Wij kunnen helpen!'
            : 'It seems your current IT solution no longer meets your needs. We can help!',
          descriptionEN: 'It seems your current IT solution no longer meets your needs. We can help!',
          ctaText: language === 'nl' ? 'Neem direct contact op' : 'Contact us immediately',
          ctaTextEN: 'Contact us immediately'
        }

    return (
      <QuestionnaireCard>
        <QuestionnaireResult result={result} onRestart={handleRestart} />
      </QuestionnaireCard>
    )
  }

  if (!currentQuestion) {
    return (
      <QuestionnaireCard>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">
            {language === 'nl' ? 'Vraag niet gevonden' : 'Question not found'}
          </p>
        </div>
      </QuestionnaireCard>
    )
  }

  return (
    <QuestionnaireCard>
      <QuestionnaireProgress 
        current={Math.min(questionsAnswered.length + 1, totalQuestions)} 
        total={totalQuestions} 
      />
      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          onAnswer={handleAnswer}
        />
      </AnimatePresence>
    </QuestionnaireCard>
  )
}