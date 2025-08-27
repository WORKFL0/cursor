import { Metadata } from 'next'
import { Building, Shield, Lock, TrendingUp, FileCheck, Users, Clock, CheckCircle } from 'lucide-react'
import SectorPageTemplate from '@/components/sectors/sector-page-template'
import type { SectorPageData } from '@/lib/types/sectors'

export const metadata: Metadata = {
  title: 'IT voor de Financiële Sector | Workflo - Secure Financial IT',
  description: 'Betrouwbare IT voor banken, verzekeraars en financiële dienstverleners. Compliance, security en performance. ISO 27001 gecertificeerde IT-partner.',
}

const financieleSectorData: SectorPageData = {
  hero: {
    title: 'IT voor de Financiële Sector',
    subtitle: 'Compliance, Security & Performance',
    description: 'Van banken tot accountantskantoren: wij begrijpen de strenge eisen van de financiële sector. ISO 27001 gecertificeerd, DNB compliant, en met 24/7 monitoring voor maximale zekerheid.',
    image: '/images/sectors/finance-hero.jpg',
    stats: [
      { value: '30+', label: 'Financiële Klanten', icon: Building },
      { value: '100%', label: 'DNB Compliant', icon: FileCheck },
      { value: 'ISO 27001', label: 'Gecertificeerd', icon: Shield },
      { value: '24/7', label: 'Security Monitoring', icon: Clock }
    ]
  },
  
  challenges: {
    title: 'Uitdagingen in Financial Services',
    subtitle: 'Strikte regelgeving vraagt om specialistische IT',
    items: [
      {
        icon: Shield,
        title: 'Compliance & Regelgeving',
        description: 'DNB, AFM, GDPR, PSD2 - de regelgeving wordt steeds strenger.',
        solution: 'Volledig compliant IT-platform met audit trails en rapportages.'
      },
      {
        icon: Lock,
        title: 'Cybersecurity Threats',
        description: 'Financiële instellingen zijn een gewild doelwit voor cybercriminelen.',
        solution: 'Multi-layer security met SOC monitoring en incident response.'
      },
      {
        icon: TrendingUp,
        title: 'Data Management',
        description: 'Grote hoeveelheden gevoelige data die veilig opgeslagen moet worden.',
        solution: 'Encrypted storage met automatische backups en disaster recovery.'
      },
      {
        icon: Clock,
        title: 'Business Continuity',
        description: 'Downtime is geen optie in de financiële wereld.',
        solution: '99.99% uptime garantie met redundante systemen.'
      }
    ]
  },

  solutions: {
    title: 'Onze Financial IT Solutions',
    subtitle: 'Enterprise-grade oplossingen voor de financiële sector',
    categories: [
      {
        title: 'Security & Compliance',
        icon: Shield,
        description: 'Complete security stack',
        features: [
          'ISO 27001 compliance framework',
          'DNB/AFM regelgeving support',
          'GDPR data protection',
          'Penetration testing',
          'Security awareness training'
        ]
      },
      {
        title: 'Infrastructure',
        icon: Building,
        description: 'Robuuste IT-infrastructuur',
        features: [
          'Redundante datacenter setup',
          'High-availability systemen',
          'Load balancing',
          'Disaster recovery sites',
          'Real-time replicatie'
        ]
      },
      {
        title: 'Monitoring & Support',
        icon: Clock,
        description: '24/7 bewaking en ondersteuning',
        features: [
          'SOC monitoring',
          'Proactieve threat detection',
          'Incident response team',
          'Performance monitoring',
          'Compliance auditing'
        ]
      },
      {
        title: 'Werkplek Beveiliging',
        icon: Lock,
        description: 'Secure workplace solutions',
        features: [
          'Zero-trust architecture',
          'Multi-factor authentication',
          'Endpoint protection',
          'Secure remote access',
          'Data loss prevention'
        ]
      }
    ]
  },

  benefits: {
    title: 'Waarom Financiële Instellingen voor Workflo Kiezen',
    subtitle: 'Bewezen expertise in financial services IT',
    items: [
      {
        title: 'Compliance Garantie',
        description: 'Altijd voldoen aan DNB, AFM en andere toezichthouders.',
        icon: CheckCircle
      },
      {
        title: 'Security First',
        description: 'Multi-layer security met 24/7 SOC monitoring.',
        icon: CheckCircle
      },
      {
        title: 'Zero Downtime',
        description: '99.99% uptime SLA met financiële garanties.',
        icon: CheckCircle
      },
      {
        title: 'Audit Ready',
        description: 'Altijd voorbereid op compliance audits en controles.',
        icon: CheckCircle
      }
    ]
  },

  testimonials: [
    {
      name: 'Robert van den Berg',
      role: 'CFO',
      company: 'Van den Berg & Partners Accountants',
      content: 'Workflo heeft onze IT-compliance volledig op orde gebracht. We zijn nu altijd audit-ready en hebben geen zorgen meer over security.',
      avatar: '/images/testimonials/finance-1.jpg'
    },
    {
      name: 'Sandra Jansen',
      role: 'IT Manager',
      company: 'Amstel Vermogensbeheer',
      content: 'De 24/7 monitoring en snelle response times geven ons het vertrouwen dat onze kritieke systemen altijd beschikbaar zijn.',
      avatar: '/images/testimonials/finance-2.jpg'
    }
  ],

  caseStudy: {
    title: 'Case Study: Amstel Vermogensbeheer',
    company: 'Amstel Vermogensbeheer',
    challenge: 'Vermogensbeheerder met €500M AUM had verouderde IT die niet meer voldeed aan DNB-eisen en kampte met security issues.',
    solution: 'Complete IT-transformatie met focus op compliance, security en business continuity. ISO 27001 certificering traject begeleid.',
    results: [
      'ISO 27001 gecertificeerd binnen 6 maanden',
      '100% DNB compliant',
      'Zero security incidents sinds implementatie',
      '40% lagere IT-kosten door efficiency'
    ],
    quote: {
      content: 'Workflo heeft ons IT-landschap getransformeerd. We zijn nu volledig compliant en kunnen ons focussen op onze klanten.',
      author: 'Jan Willem de Vries',
      role: 'CEO Amstel Vermogensbeheer'
    }
  },

  faq: [
    {
      question: 'Zijn jullie DNB/AFM compliant?',
      answer: 'Ja, wij zijn volledig bekend met DNB en AFM regelgeving. Onze oplossingen zijn specifiek ontworpen om te voldoen aan alle compliance vereisten voor financiële instellingen.'
    },
    {
      question: 'Hoe waarborgen jullie data security?',
      answer: 'We hanteren een multi-layer security approach met encryptie, access controls, monitoring, en regular security audits. Alle data wordt versleuteld opgeslagen in Nederlandse datacenters.'
    },
    {
      question: 'Wat gebeurt er bij een security incident?',
      answer: 'Ons Security Operations Center monitort 24/7. Bij een incident treedt direct ons incident response protocol in werking met gegarandeerde response binnen 15 minuten.'
    },
    {
      question: 'Kunnen jullie helpen met compliance audits?',
      answer: 'Absoluut. We bereiden alle documentatie voor, ondersteunen tijdens de audit, en zorgen dat uw systemen altijd audit-ready zijn.'
    }
  ],

  cta: {
    title: 'Klaar voor Enterprise-Grade Financial IT?',
    subtitle: 'Laat uw financiële instelling excelleren met compliant, veilige IT',
    primaryButton: {
      text: 'Plan Security Assessment',
      href: '/contact'
    },
    secondaryButton: {
      text: 'Download Compliance Checklist',
      href: '/downloads/financial-compliance'
    },
    features: [
      'Gratis security scan',
      'Compliance check',
      'Binnen 24 uur rapport',
      'Geen verplichtingen'
    ]
  }
}

export default function FinancieleSectorPage() {
  return <SectorPageTemplate data={financieleSectorData} />
}