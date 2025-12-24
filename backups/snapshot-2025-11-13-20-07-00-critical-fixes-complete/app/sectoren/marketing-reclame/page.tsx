import { Metadata } from 'next'
import SectorPageTemplate from '@/components/sectors/sector-page-template'
import type { SectorPageData } from '@/lib/types/sectors'

export const metadata: Metadata = {
  title: 'IT voor Marketing & Reclame | Workflo - Creative Agency IT Solutions',
  description: 'Professionele IT-oplossingen voor reclamebureaus en marketingagencies. Creative workflows, campagne management, data analytics en collaboratie tools.',
}

const marketingReclameData: SectorPageData = {
  hero: {
    title: 'IT-Oplossingen voor Marketing & Reclame',
    subtitle: 'Technologie die creativiteit en resultaten maximaliseert',
    description: 'Van creative workstations tot marketing automation en data analytics. Workflo zorgt dat uw agency optimaal presteert met de juiste tools en systemen voor succesvolle campagnes.',
    image: '/images/sectors/marketing-hero.jpg',
    stats: [
      { value: '200+', label: 'Marketing Agencies', iconName: 'Megaphone' },
      { value: '99.8%', label: 'Campaign Uptime', iconName: 'Target' },
      { value: '50TB+', label: 'Creative Assets', iconName: 'Palette' },
      { value: '24/7', label: 'Support Beschikbaar', iconName: 'Users' }
    ]
  },
  
  challenges: {
    title: 'IT-Uitdagingen in Marketing & Reclame',
    subtitle: 'Complexe eisen van moderne marketing agencies',
    items: [
      {
        iconName: 'Palette',
        title: 'Creative Workflows',
        description: 'Adobe Creative Suite, video editing en 3D graphics vragen krachtige workstations.',
        solution: 'GPU-accelerated workstations met color-accurate monitors voor professionele creative work.'
      },
      {
        iconName: 'BarChart',
        title: 'Data & Analytics',
        description: 'Marketing data uit verschillende bronnen moet geïntegreerd en geanalyseerd worden.',
        solution: 'BI dashboards, data warehouses en geautomatiseerde rapportage voor actionable insights.'
      },
      {
        iconName: 'Users',
        title: 'Client Collaboration',
        description: 'Klanten willen real-time inzicht in campagnes en creatieve ontwikkelingen.',
        solution: 'Client portals, project management tools en veilige file sharing systemen.'
      },
      {
        iconName: 'Cloud',
        title: 'Remote Teams',
        description: 'Hybride teams moeten naadloos samenwerken aan complexe campagnes.',
        solution: 'Cloud-based creative suites, VPN toegang en collaboration platforms.'
      }
    ]
  },

  solutions: {
    title: 'Onze Oplossingen voor Marketing Agencies',
    subtitle: 'Complete technologie stack voor moderne marketingorganisaties',
    categories: [
      {
        title: 'Creative Workstations',
        iconName: 'Monitor',
        description: 'High-performance systemen voor design en video',
        features: [
          'Adobe Creative Cloud optimalisatie',
          '4K/8K monitors met color accuracy',
          'Wacom tablets en design peripherals',
          'GPU rendering voor motion graphics',
          'High-speed storage voor large assets'
        ]
      },
      {
        title: 'Marketing Technology',
        iconName: 'Target',
        description: 'Tools voor campaign management en automation',
        features: [
          'Marketing automation platforms',
          'CRM integraties (HubSpot, Salesforce)',
          'Social media management tools',
          'Email marketing infrastructuur',
          'Landing page en A/B testing'
        ]
      },
      {
        title: 'Data & Analytics',
        iconName: 'BarChart',
        description: 'Business intelligence en reporting',
        features: [
          'Google Analytics en Tag Manager',
          'Custom dashboard development',
          'Data warehouse setup',
          'ROI tracking en attribution',
          'Automated reporting workflows'
        ]
      },
      {
        title: 'Collaboration & Security',
        iconName: 'Users',
        description: 'Veilige samenwerking en project management',
        features: [
          'Project management platforms',
          'Client approval workflows',
          'Version control voor creative assets',
          'Secure file sharing portals',
          'Team communication tools'
        ]
      }
    ]
  },

  benefits: {
    title: 'Waarom Marketing Agencies voor Workflo Kiezen',
    subtitle: 'De voordelen van gespecialiseerde marketing-IT',
    items: [
      {
        title: 'Creative Expertise',
        description: 'Diepgaande kennis van creative workflows en marketing technology stacks.',
        iconName: 'CheckCircle'
      },
      {
        title: 'Campaign Reliability',
        description: '99.8% uptime voor kritische marketing systemen en campagne infrastructuur.',
        iconName: 'CheckCircle'
      },
      {
        title: 'Data-Driven Insights',
        description: 'Advanced analytics setup voor meetbare resultaten en ROI optimalisatie.',
        iconName: 'CheckCircle'
      },
      {
        title: 'Scalable Growth',
        description: 'IT-infrastructuur die meegroeit van startup agency tot enterprise level.',
        iconName: 'CheckCircle'
      }
    ]
  },

  testimonials: [
    {
      name: 'Laura Vermeulen',
      role: 'Creative Director',
      company: 'BrandForge Agency',
      content: 'Workflo heeft onze creative workflows gerevolutioneerd. Rendering tijden zijn 60% korter en onze designers kunnen eindelijk onbeperkt experimenteren.',
      avatar: '/images/testimonials/marketing-1.jpg'
    },
    {
      name: 'Mark Janssen',
      role: 'Digital Strategy Director',
      company: 'Crescendo Marketing',
      content: 'De marketing automation en analytics setup van Workflo geeft ons eindelijk de data insights die we nodig hebben voor succesvolle campagnes.',
      avatar: '/images/testimonials/marketing-2.jpg'
    }
  ],

  caseStudy: {
    title: 'Case Study: BrandForge Agency',
    company: 'BrandForge Agency',
    challenge: 'Groeiende reclamebureau met 25 creatives kampte met trage workstations, onbetrouwbare file sharing en gefragmenteerde marketing data.',
    solution: 'Complete IT-transformatie met nieuwe creative workstations, centralized asset management en geïntegreerde marketing technology stack.',
    results: [
      '60% snellere creative workflows',
      '300% meer campagne data visibility',
      'Zero file loss sinds implementatie',
      '85% tijdsbesparing bij rapportage'
    ],
    quote: {
      content: 'Dankzij Workflo kunnen we nu 50% meer klanten bedienen zonder extra personeel. Onze efficiency is door het dak gegaan.',
      author: 'Laura Vermeulen',
      role: 'Creative Director'
    }
  },

  faq: [
    {
      question: 'Ondersteunen jullie alle creative software?',
      answer: 'Ja, we hebben expertise in Adobe Creative Cloud, Sketch, Figma, Cinema 4D, After Effects, Final Cut Pro en meer. We optimaliseren workstations specifiek voor uw software stack en workflows.'
    },
    {
      question: 'Hoe integreren jullie marketing automation tools?',
      answer: 'We connecteren HubSpot, Marketo, Pardot, Mailchimp en andere platforms via API\'s. Dit zorgt voor seamless data flow tussen tools en geautomatiseerde workflows.'
    },
    {
      question: 'Kunnen clients real-time campagne data inzien?',
      answer: 'Absoluut. We bouwen custom client dashboards met live data uit Google Analytics, social platforms, en uw CRM. Clients krijgen 24/7 toegang tot hun campagne performance.'
    },
    {
      question: 'Hoe beschermen jullie creative assets en client data?',
      answer: 'We implementeren role-based toegang, encrypted storage, watermarking voor creatives, en complete backup strategies. Alle client data wordt veilig gescheiden opgeslagen.'
    }
  ],

  cta: {
    title: 'Klaar voor Marketing Excellence?',
    subtitle: 'Laat uw agency groeien met technologie die creativiteit en resultaten maximaliseert',
    primaryButton: {
      text: 'Gratis Agency IT-Scan',
      href: '/contact'
    },
    secondaryButton: {
      text: 'Download MarTech Gids',
      href: '/downloads/marketing-it-guide'
    },
    features: [
      'Gratis technology assessment',
      'Creative workflow analyse',
      'Geen verplichtingen',
      'Marketing technology expert'
    ]
  }
}

export default function MarketingReclamePage() {
  return <SectorPageTemplate data={marketingReclameData} />
}