'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Language } from '@/lib/types/workflo'

interface LanguageContextType {
  language: Language['code']
  setLanguage: (lang: Language['code']) => void
  t: (key: string, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: React.ReactNode
  defaultLanguage?: Language['code']
}

export function LanguageProvider({ 
  children, 
  defaultLanguage = 'nl' 
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language['code']>(defaultLanguage)

  // Load language preference from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('workflo-language')
      if (saved === 'en' || saved === 'nl') {
        setLanguage(saved)
      } else {
        // Detect browser language
        const browserLang = navigator.language.toLowerCase()
        if (browserLang.startsWith('en')) {
          setLanguage('en')
        } else {
          setLanguage('nl')
        }
      }
    }
  }, [])

  // Save language preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('workflo-language', language)
    }
  }, [language])

  // Translation helper function
  const t = (key: string, fallback?: string) => {
    // This is a simplified version. In a real app, you'd load translations from files
    // For now, we'll use the fallback or key as the translation
    return fallback || key
  }

  const value = {
    language,
    setLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

// Hook to get localized content from data structures
export function useLocalizedContent() {
  const { language } = useLanguage()

  const getLocalizedValue = <T extends Record<string, unknown>>(
    obj: T,
    key: string
  ): string => {
    if (language === 'nl') {
      return obj[`${key}NL`] || obj[key] || ''
    }
    return obj[key] || obj[`${key}NL`] || ''
  }

  const getLocalizedArray = <T extends Record<string, unknown>>(
    obj: T,
    key: string
  ): string[] => {
    if (language === 'nl') {
      return obj[`${key}NL`] || obj[key] || []
    }
    return obj[key] || obj[`${key}NL`] || []
  }

  return {
    language,
    getLocalizedValue,
    getLocalizedArray
  }
}