import UnifiedHeroSection from './UnifiedHeroSection'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <UnifiedHeroSection 
      variant="standard"
      title="Uw IT-Partner in Amsterdam"
      subtitle="Betrouwbare IT-services voor MKB en grootzakelijke klanten"
      primaryCta={{
        text: "Plan gratis IT-scan",
        href: "/contact",
        icon: ArrowRight
      }}
    />
  )
}