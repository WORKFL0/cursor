import { Metadata } from 'next'
import { IntelligentFAQ } from '@/components/ai/IntelligentFAQ'

export const metadata: Metadata = {
  title: 'AI-Powered FAQ - Intelligent Support',
  description: 'Find instant answers to your IT questions with our AI-powered FAQ system',
}

export const dynamic = 'force-dynamic'

export default function IntelligentFAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <IntelligentFAQ />
    </div>
  )
}