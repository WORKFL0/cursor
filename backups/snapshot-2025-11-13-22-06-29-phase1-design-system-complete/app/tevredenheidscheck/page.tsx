import { Metadata } from 'next'
import FlowchartQuestionnaire from '@/components/questionnaire/FlowchartQuestionnaire'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'IT Tevredenheidscheck | Workflo',
  description: 'Test de gezondheid van je IT-infrastructuur met onze gratis tevredenheidscheck. Krijg direct inzicht en gepersonaliseerd advies.',
}

export default function TevredenheidscheckPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6 pt-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="font-medium">Terug naar home</span>
        </Link>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            IT Tevredenheidscheck
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ontdek in 5 minuten hoe gezond je IT-infrastructuur is en krijg direct gepersonaliseerd advies
          </p>
        </div>

        {/* Questionnaire */}
        <FlowchartQuestionnaire />

        {/* Additional info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% Gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Veilig & Vertrouwelijk</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>5 minuten</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}