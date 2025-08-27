import { LucideIcon } from 'lucide-react'

export interface SectorPageData {
  hero: {
    title: string
    subtitle: string
    description: string
    image?: string
    stats?: {
      value: string | number
      label: string
      icon?: LucideIcon
    }[]
  }
  
  challenges: {
    title: string
    subtitle: string
    items: {
      icon: LucideIcon
      title: string
      description: string
      solution: string
    }[]
  }

  solutions: {
    title: string
    subtitle: string
    categories: {
      title: string
      icon: LucideIcon
      description: string
      features: string[]
    }[]
  }

  benefits: {
    title: string
    subtitle: string
    items: {
      title: string
      description: string
      icon: LucideIcon
    }[]
  }

  testimonials?: {
    name: string
    role: string
    company: string
    content: string
    avatar?: string
  }[]

  caseStudy?: {
    title: string
    company: string
    challenge: string
    solution: string
    results: string[]
    quote?: {
      content: string
      author: string
      role: string
    }
  }

  faq?: {
    question: string
    answer: string
  }[]

  cta: {
    title: string
    subtitle: string
    primaryButton: {
      text: string
      href: string
    }
    secondaryButton?: {
      text: string
      href: string
    }
    features?: string[]
  }
}