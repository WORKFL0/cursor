'use client'

import { HubSpotNewsletterSignup } from '@/components/forms/HubSpotNewsletterSignup'
import { useLanguage } from '@/lib/contexts/language-context'

export default function NewsletterDemo() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-workflo-yellow-light/10 to-background">
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'nl' ? '🚀 Nieuwe Newsletter Ontwerpen' : '🚀 New Newsletter Designs'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'nl' 
              ? 'Ontdek onze prachtige nieuwe newsletter signup designs met Workflo yellow themeing, Framer Motion animaties, en moderne UX!'
              : 'Discover our beautiful new newsletter signup designs with Workflo yellow theming, Framer Motion animations, and modern UX!'
            }
          </p>
        </div>

        {/* Compact Variant Demo */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Compact Variant</h2>
            <p className="text-muted-foreground">
              {language === 'nl' ? 'Perfect voor footers en sidebar placements' : 'Perfect for footers and sidebar placements'}
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <HubSpotNewsletterSignup variant="compact" />
          </div>
        </section>

        {/* Full Variant Demo */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Full Hero Variant</h2>
            <p className="text-muted-foreground">
              {language === 'nl' ? 'Indrukwekkende hero sectie voor dedicated paginas' : 'Stunning hero section for dedicated pages'}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <HubSpotNewsletterSignup variant="full" />
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">
              {language === 'nl' ? '✨ Nieuwe Features' : '✨ New Features'}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: language === 'nl' ? 'Workflo Branding' : 'Workflo Branding',
                description: language === 'nl' 
                  ? 'Volledig geïntegreerd met Workflo yellow (#f2f400) kleuren en moderne gradiënten'
                  : 'Fully integrated with Workflo yellow (#f2f400) colors and modern gradients',
                icon: '🎨'
              },
              {
                title: language === 'nl' ? 'Framer Motion' : 'Framer Motion',
                description: language === 'nl' 
                  ? 'Vloeiende animaties, micro-interacties, en delightful hover effecten'
                  : 'Smooth animations, micro-interactions, and delightful hover effects',
                icon: '🎬'
              },
              {
                title: language === 'nl' ? 'Trust Indicators' : 'Trust Indicators',
                description: language === 'nl' 
                  ? 'GDPR compliance, geen spam garantie, en sociale bewijsvoering'
                  : 'GDPR compliance, no spam guarantee, and social proof elements',
                icon: '🛡️'
              },
              {
                title: language === 'nl' ? 'Mobile First' : 'Mobile First',
                description: language === 'nl' 
                  ? 'Responsive design dat perfect werkt op alle apparaten'
                  : 'Responsive design that works perfectly on all devices',
                icon: '📱'
              },
              {
                title: language === 'nl' ? 'HubSpot Integratie' : 'HubSpot Integration',
                description: language === 'nl' 
                  ? 'Naadloze integratie met bestaande HubSpot workflow'
                  : 'Seamless integration with existing HubSpot workflow',
                icon: '🔗'
              },
              {
                title: language === 'nl' ? 'Conversion Geoptimaliseerd' : 'Conversion Optimized',
                description: language === 'nl' 
                  ? 'Psychologie-gedreven design om meer inschrijvingen te krijgen'
                  : 'Psychology-driven design to increase subscription rates',
                icon: '📈'
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="text-center p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-workflo-yellow/20 hover:border-workflo-yellow/60 hover:shadow-lg hover:shadow-workflo-yellow/20 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 bg-gradient-to-r from-workflo-yellow-light/20 via-workflo-yellow-light/40 to-workflo-yellow-light/20 rounded-3xl border border-workflo-yellow/20">
          <h3 className="text-3xl font-bold mb-4">
            {language === 'nl' ? '🎉 Klaar voor implementatie!' : '🎉 Ready for implementation!'}
          </h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            {language === 'nl' 
              ? 'Dit nieuwe newsletter design is nu beschikbaar in de footer, referral pagina, en waar je het maar wilt gebruiken!'
              : 'This new newsletter design is now available in the footer, referral page, and wherever you want to use it!'
            }
          </p>
          <div className="text-sm text-muted-foreground">
            <code className="bg-muted px-2 py-1 rounded">
              {`<HubSpotNewsletterSignup variant="${language === 'nl' ? 'compact' : 'full'}" />`}
            </code>
          </div>
        </section>
      </div>
    </div>
  )
}