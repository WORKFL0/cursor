import UnifiedHeroSection from './UnifiedHeroSection'
import { ArrowRight, Shield, Award, Users, Zap } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/language-context'

export default function PremiumHeroSection() {
  const { language } = useLanguage()
  
  const videos = [
    '/videos/Workflo-code-animatie.mp4',
    '/videos/Workflo-code-animatie-2.mp4',
    '/videos/Workflo-code-animatie-3.mp4'
  ]
  return (
    <UnifiedHeroSection
      variant="premium"
      language={language}
      videos={videos}
      headerImage="/images/workflo-linkedin-header.jpg"
      title={language === 'nl' ? 'IT die gewoon werkt' : 'IT that just works'}
      subtitle={language === 'nl' 
        ? 'Schaalbare managed IT-services voor bedrijven die groei niet willen laten beperken door technologie.'
        : 'Scalable managed IT services for businesses that refuse to let technology limit their growth.'
      }
      stats={[
        { 
          value: '10+', 
          label: language === 'nl' ? 'Jaar Ervaring' : 'Years Experience', 
          description: language === 'nl' ? 'Gespecialiseerd in bedrijfskritische systemen' : 'Specialized in business-critical systems',
          icon: Award
        },
        { 
          value: '50+', 
          label: language === 'nl' ? 'Tevreden Klanten' : 'Happy Clients', 
          description: language === 'nl' ? 'Van scale-ups tot multinationals' : 'From scale-ups to multinationals',
          icon: Users
        },
        { 
          value: '< 1h', 
          label: language === 'nl' ? 'Reactietijd' : 'Response Time', 
          description: language === 'nl' ? 'Snelle eerste reactie gegarandeerd' : 'Fast first response guaranteed',
          icon: Shield
        },
        { 
          value: '24/7', 
          label: language === 'nl' ? 'Support Beschikbaar' : 'Support Available', 
          description: language === 'nl' ? 'Altijd bereikbaar voor noodgevallen' : 'Always available for emergencies',
          icon: Zap
        }
      ]}
      primaryCta={{
        text: language === 'nl' ? 'IT Assessment Aanvragen' : 'Request IT Assessment',
        href: '/contact',
        icon: ArrowRight
      }}
      secondaryCta={{
        text: language === 'nl' ? 'Enterprise Oplossingen' : 'Enterprise Solutions',
        href: '/diensten',
        icon: Shield
      }}
    />
  )
}