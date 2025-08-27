import { Metadata } from 'next'
import { Puzzle, Wrench, Briefcase, Settings, Cloud, Users, Shield, CheckCircle } from 'lucide-react'
import SectorPageTemplate from '@/components/sectors/sector-page-template'
import type { SectorPageData } from '@/lib/types/sectors'

export const metadata: Metadata = {
  title: 'IT voor Diverse Sectoren | Workflo - Custom IT Solutions',
  description: 'Maatwerk IT-oplossingen voor alle sectoren. Van industrieel tot consulting, van transport tot onderwijs. Workflo past zich aan uw branche aan.',
}

const diversData: SectorPageData = {
  hero: {
    title: 'IT-Oplossingen voor Diverse Sectoren',
    subtitle: 'Maatwerk technologie voor elke branche',
    description: 'Uw sector staat niet in onze lijst? Geen probleem. Workflo heeft ervaring met talloze branches en past zich aan uw specifieke behoeften aan. Van industrieel tot onderwijs, van transport tot consulting.',
    image: '/images/sectors/diverse-hero.jpg',
    stats: [
      { value: '50+', label: 'Verschillende Sectoren', icon: Puzzle },
      { value: '1000+', label: 'Unieke Oplossingen', icon: Settings },
      { value: '99.7%', label: 'Klant Tevredenheid', icon: Users },
      { value: '15+', label: 'Jaar Ervaring', icon: Briefcase }
    ]
  },
  
  challenges: {
    title: 'Universele IT-Uitdagingen',
    subtitle: 'Problemen die elke sector kent, oplossingen die werken',
    items: [
      {
        icon: Settings,
        title: 'Branche-Specifieke Eisen',
        description: 'Elke sector heeft unieke compliance, software en workflow vereisten.',
        solution: 'Maatwerk oplossingen gebaseerd op diepgaande analyse van uw branche-specifieke needs.'
      },
      {
        icon: Cloud,
        title: 'Legacy Systeem Integratie',
        description: 'Oude systemen moeten verbonden worden met moderne technologieën.',
        solution: 'Custom API\'s en bridges die oude en nieuwe systemen naadloos laten samenwerken.'
      },
      {
        icon: Shield,
        title: 'Compliance & Regelgeving',
        description: 'Verschillende branches hebben verschillende compliance eisen.',
        solution: 'Expertise in AVG, NEN, ISO en branche-specifieke regelgeving voor volledige compliance.'
      },
      {
        icon: Users,
        title: 'Gebruiksvriendelijkheid',
        description: 'Complexe systemen moeten intuïtief zijn voor alle medewerkers.',
        solution: 'User-centric design en uitgebreide training programma\'s voor optimale adoptie.'
      }
    ]
  },

  solutions: {
    title: 'Onze Universele Oplossingen',
    subtitle: 'Flexibele technologie die zich aanpast aan uw sector',
    categories: [
      {
        title: 'Branche Analyse & Strategy',
        icon: Briefcase,
        description: 'Diepgaand onderzoek naar uw sector',
        features: [
          'Sector-specifieke IT assessment',
          'Compliance requirements analyse',
          'Best practices research',
          'Competitor technology benchmarking',
          'ROI calculaties voor IT investeringen'
        ]
      },
      {
        title: 'Custom Software & Integraties',
        icon: Settings,
        description: 'Maatwerk ontwikkeling voor unieke needs',
        features: [
          'Custom business applicaties',
          'Legacy system modernisatie',
          'API ontwikkeling en integraties',
          'Workflow automation tools',
          'Mobile en web app development'
        ]
      },
      {
        title: 'Infrastructure & Security',
        icon: Shield,
        description: 'Robuuste IT-infrastructuur voor elke sector',
        features: [
          'Hybrid cloud architecturen',
          'Cybersecurity voor uw branche',
          'Disaster recovery planning',
          'Network design en implementatie',
          '24/7 monitoring en support'
        ]
      },
      {
        title: 'Training & Change Management',
        icon: Users,
        description: 'Succesvolle IT adoptie in uw organisatie',
        features: [
          'User training programma\'s',
          'Change management ondersteuning',
          'IT governance implementatie',
          'Performance monitoring',
          'Continuous improvement processen'
        ]
      }
    ]
  },

  benefits: {
    title: 'Waarom Diverse Sectoren voor Workflo Kiezen',
    subtitle: 'De voordelen van sector-agnostische IT expertise',
    items: [
      {
        title: 'Brede Ervaring',
        description: 'Ervaring met 50+ verschillende sectoren en hun unieke uitdagingen.',
        icon: CheckCircle
      },
      {
        title: 'Maatwerk Aanpak',
        description: 'Geen one-size-fits-all, maar custom oplossingen per branche.',
        icon: CheckCircle
      },
      {
        title: 'Snelle Implementatie',
        description: 'Door brede ervaring kunnen we snel schakelen en implementeren.',
        icon: CheckCircle
      },
      {
        title: 'Toekomstbestendig',
        description: 'Oplossingen die meegroeien met uw sector en technologische ontwikkelingen.',
        icon: CheckCircle
      }
    ]
  },

  testimonials: [
    {
      name: 'Johan Smits',
      role: 'Managing Director',
      company: 'Transportbedrijf Smits',
      content: 'Workflo begreep onze complexe logistieke uitdagingen meteen. Hun maatwerk oplossing heeft onze efficiency met 40% verhoogd.',
      avatar: '/images/testimonials/transport-1.jpg'
    },
    {
      name: 'Dr. Linda Koster',
      role: 'Hoofd ICT',
      company: 'Technische Hogeschool Amsterdam',
      content: 'Voor een onderwijsinstelling hebben we unieke eisen. Workflo leverde een perfect op maat gemaakte oplossing binnen budget en planning.',
      avatar: '/images/testimonials/education-1.jpg'
    }
  ],

  caseStudy: {
    title: 'Case Study: Transportbedrijf Smits',
    company: 'Transportbedrijf Smits - Internationale Logistiek',
    challenge: 'Familiebedrijf in transport worstelde met verouderde routeplanning, papieren administratie en gebrek aan real-time tracking voor klanten.',
    solution: 'Complete digitalisering met custom transport management systeem, GPS tracking integratie en klantportaal voor shipment visibility.',
    results: [
      '40% efficiëntere routeplanning',
      '90% minder papierwerk',
      '100% shipment visibility voor klanten',
      '€75.000/jaar besparing op brandstof'
    ],
    quote: {
      content: 'Workflo heeft ons familiebedrijf getransformeerd van ouderwets naar cutting-edge. Onze klanten zijn onder de indruk van onze nieuwe mogelijkheden.',
      author: 'Johan Smits',
      role: 'Managing Director'
    }
  },

  faq: [
    {
      question: 'Hebben jullie ervaring met mijn specifieke sector?',
      answer: 'Met 15+ jaar ervaring hebben we waarschijnlijk wel in uw sector gewerkt. Zo niet, dan maken we eerst een grondige analyse van uw branche voordat we oplossingen voorstellen.'
    },
    {
      question: 'Hoe lang duurt een maatwerk IT-project?',
      answer: 'Dit hangt af van de complexiteit, maar een gemiddeld project duurt 3-6 maanden. We werken met agile methodieken voor snelle iteraties en feedback.'
    },
    {
      question: 'Kunnen jullie legacy systemen integreren?',
      answer: 'Ja, we zijn specialist in het verbinden van oude en nieuwe systemen. Via custom API\'s en middleware zorgen we voor naadloze integratie zonder data verlies.'
    },
    {
      question: 'Wat kost een maatwerk IT-oplossing?',
      answer: 'Kosten variëren sterk per project. Na een gratis intake kunnen we een indicatief voorstel maken. We werken met vaste prijzen per fase om budget overschrijdingen te voorkomen.'
    }
  ],

  cta: {
    title: 'Klaar voor Maatwerk IT-Oplossingen?',
    subtitle: 'Laat ons uw unieke uitdagingen analyseren en de perfecte oplossing ontwikkelen',
    primaryButton: {
      text: 'Gratis Sector Analyse',
      href: '/contact'
    },
    secondaryButton: {
      text: 'Bekijk Onze Case Studies',
      href: '/case-studies'
    },
    features: [
      'Gratis sector assessment',
      'Custom solution design',
      'Geen verplichtingen',
      'Ervaren consultants'
    ]
  }
}

export default function DiversPage() {
  return <SectorPageTemplate data={diversData} />
}