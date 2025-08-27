import { Metadata } from 'next'
import { Heart, Users, Globe, Shield, DollarSign, Handshake, Gift, CheckCircle } from 'lucide-react'
import SectorPageTemplate from '@/components/sectors/sector-page-template'
import type { SectorPageData } from '@/lib/types/sectors'

export const metadata: Metadata = {
  title: 'IT voor Non-Profit & Goede Doelen | Workflo - Affordable Charity IT Solutions',
  description: 'Betaalbare IT-oplossingen voor non-profit organisaties en goede doelen. Donor management, volunteer portals, security en subsidie-vriendelijke tarieven.',
}

const nonProfitData: SectorPageData = {
  hero: {
    title: 'IT-Oplossingen voor Non-Profit Organisaties',
    subtitle: 'Technologie die uw missie ondersteunt, niet uw budget belast',
    description: 'Non-profit organisaties verdienen dezelfde professionele IT als commerciële bedrijven. Workflo biedt speciale tarieven en oplossingen die passen bij uw budget en uw belangrijke werk ondersteunen.',
    image: '/images/sectors/nonprofit-hero.jpg',
    stats: [
      { value: '180+', label: 'Non-Profit Klanten', icon: Heart },
      { value: '50%', label: 'Korting op tarieven', icon: DollarSign },
      { value: '99.8%', label: 'Donor Database Uptime', icon: Shield },
      { value: '10K+', label: 'Vrijwilligers Ondersteund', icon: Users }
    ]
  },
  
  challenges: {
    title: 'IT-Uitdagingen voor Non-Profits',
    subtitle: 'Unieke behoeften van maatschappelijke organisaties',
    items: [
      {
        icon: DollarSign,
        title: 'Beperkt IT-Budget',
        description: 'Elke euro moet naar de missie gaan, maar professionele IT is wel nodig.',
        solution: 'Speciale non-profit tarieven tot 50% korting en subsidie-vriendelijke opties.'
      },
      {
        icon: Users,
        title: 'Vrijwilliger Management',
        description: 'Vele vrijwilligers met verschillende IT-vaardigheden en apparaten.',
        solution: 'User-friendly systemen en uitgebreide training voor diverse gebruikersgroepen.'
      },
      {
        icon: Gift,
        title: 'Donor & Grant Management',
        description: 'Donaties tracken, rapportages voor subsidies en transparante financiën.',
        solution: 'Gespecialiseerde CRM systemen voor donor management en grant reporting.'
      },
      {
        icon: Shield,
        title: 'Data Privacy & Compliance',
        description: 'Donor gegevens en gevoelige informatie moet beschermd worden.',
        solution: 'GDPR-compliant systemen met nonprofit-specifieke privacy instellingen.'
      }
    ]
  },

  solutions: {
    title: 'Onze Oplossingen voor Non-Profit Organisaties',
    subtitle: 'Betaalbare technologie die impact maximaliseert',
    categories: [
      {
        title: 'Donor & CRM Systemen',
        icon: Heart,
        description: 'Professioneel donor en relationship management',
        features: [
          'Salesforce Non-Profit Cloud',
          'DonorPerfect integraties',
          'Online donatie platforms',
          'Grant tracking & reporting',
          'Email marketing voor donors'
        ]
      },
      {
        title: 'Collaboration & Vrijwilligers',
        icon: Users,
        description: 'Tools voor effectieve samenwerking',
        features: [
          'Microsoft 365 Non-Profit licenties',
          'Volunteer management portals',
          'Project collaboration tools',
          'Online training platforms',
          'Communication apps'
        ]
      },
      {
        title: 'Website & Digital Presence',
        icon: Globe,
        description: 'Professionele online aanwezigheid',
        features: [
          'WordPress Non-Profit websites',
          'Online donatie functionaliteit',
          'Social media integraties',
          'Email newsletter systemen',
          'SEO voor meer visibility'
        ]
      },
      {
        title: 'Security & Backup',
        icon: Shield,
        description: 'Bescherming van gevoelige gegevens',
        features: [
          'GDPR compliant data storage',
          'Automated backup solutions',
          'Cybersecurity training',
          'Secure email systemen',
          'Access control management'
        ]
      }
    ]
  },

  benefits: {
    title: 'Waarom Non-Profits voor Workflo Kiezen',
    subtitle: 'De voordelen van maatschappelijk betrokken IT-ondersteuning',
    items: [
      {
        title: 'Non-Profit Expertise',
        description: 'Diepgaande kennis van donor management, grants en compliance eisen.',
        icon: CheckCircle
      },
      {
        title: 'Speciale Tarieven',
        description: 'Tot 50% korting op IT-diensten plus toegang tot gratis software licenties.',
        icon: CheckCircle
      },
      {
        title: 'Subsidie Ondersteuning',
        description: 'Hulp bij IT-subsidie aanvragen en rapportages voor geldgevers.',
        icon: CheckCircle
      },
      {
        title: 'Maatschappelijke Impact',
        description: 'Wij geloven in uw missie en helpen graag mee aan maatschappelijke verandering.',
        icon: CheckCircle
      }
    ]
  },

  testimonials: [
    {
      name: 'Anne-Marie Peters',
      role: 'Directeur',
      company: 'Stichting Hulp voor Kinderen',
      content: 'Dankzij Workflo kunnen we met een beperkt budget toch professioneel werken. Hun non-profit korting en expertise zijn onbetaalbaar.',
      avatar: '/images/testimonials/nonprofit-1.jpg'
    },
    {
      name: 'Robert van Dijk',
      role: 'Bestuurslid',
      company: 'Nederlandse Natuurstichting',
      content: 'De donor management oplossing heeft onze fondsenwerving revolutionair verbeterd. We kunnen nu veel gerichter communiceren met supporters.',
      avatar: '/images/testimonials/nonprofit-2.jpg'
    }
  ],

  caseStudy: {
    title: 'Case Study: Stichting Hulp voor Kinderen',
    company: 'Stichting Hulp voor Kinderen',
    challenge: 'Groeiende kinderhulp organisatie worstelde met Excel-donor administratie, verouderde website en gebrek aan professionele IT-ondersteuning.',
    solution: 'Complete digitale transformatie met moderne CRM, nieuwe website met donatie functionaliteit en professionele IT-infrastructuur.',
    results: [
      '200% meer online donaties',
      '80% efficiënter donor management',
      '60% tijd besparing op administratie',
      '€50.000 extra fondsenwerving per jaar'
    ],
    quote: {
      content: 'Workflo heeft ons geholpen om van een kleine stichting uit te groeien tot een professionele organisatie die echt impact maakt.',
      author: 'Anne-Marie Peters',
      role: 'Directeur'
    }
  },

  faq: [
    {
      question: 'Hoeveel korting krijgen non-profit organisaties?',
      answer: 'Erkende non-profit organisaties krijgen tot 50% korting op onze standaard tarieven. Daarnaast helpen we bij het verkrijgen van gratis software licenties van Microsoft, Google en andere partners.'
    },
    {
      question: 'Ondersteunen jullie donor management systemen?',
      answer: 'Ja, we hebben ervaring met alle major donor management platforms zoals Salesforce NPSP, DonorPerfect, Raiser\'s Edge, en MailChimp. Ook helpen we bij integratie met online donatie platforms.'
    },
    {
      question: 'Kunnen jullie helpen met subsidie aanvragen voor IT?',
      answer: 'Absoluut. We hebben ervaring met IT-subsidies van overheden en fondsen. We helpen bij het schrijven van IT-budgetten en technische specificaties voor aanvragen.'
    },
    {
      question: 'Hoe werkt GDPR compliance voor donor gegevens?',
      answer: 'We implementeren speciale privacy controls voor donor data, inclusief opt-in/opt-out management, data retention policies en transparante communicatie over data gebruik.'
    }
  ],

  cta: {
    title: 'Klaar voor Professionele Non-Profit IT?',
    subtitle: 'Laat uw organisatie groeien met technologie die uw missie ondersteunt',
    primaryButton: {
      text: 'Aanvragen Non-Profit Korting',
      href: '/contact'
    },
    secondaryButton: {
      text: 'Download Non-Profit IT-Gids',
      href: '/downloads/nonprofit-it-guide'
    },
    features: [
      'Tot 50% korting',
      'Gratis software licenties',
      'Subsidie ondersteuning',
      'Non-profit specialist'
    ]
  }
}

export default function NonProfitPage() {
  return <SectorPageTemplate data={nonProfitData} />
}