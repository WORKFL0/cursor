import UnifiedHeroSection from './UnifiedHeroSection'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <UnifiedHeroSection 
      variant="standard"
      title="Uw IT-Partner in Amsterdam"
      subtitle="Betrouwbare IT-services voor MKB en grootzakelijke klanten"
      primaryCta={{
        text: "Start Gratis IT-Check",
        href: "/tevredenheidscheck",
        icon: ArrowRight
      }}
    />
  )
}