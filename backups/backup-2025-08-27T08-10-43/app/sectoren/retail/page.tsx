import { Metadata } from 'next'
import { ShoppingCart, Store, Package, CreditCard, BarChart, Shield, Truck, CheckCircle } from 'lucide-react'
import SectorPageTemplate from '@/components/sectors/sector-page-template'
import type { SectorPageData } from '@/lib/types/sectors'

export const metadata: Metadata = {
  title: 'IT voor Retail & E-commerce | Workflo - Omnichannel Retail Solutions',
  description: 'Complete IT-oplossingen voor retailers. POS systemen, e-commerce platforms, voorraadmanagement, omnichannel integratie en customer analytics.',
}

const retailData: SectorPageData = {
  hero: {
    title: 'IT-Oplossingen voor Retail & E-commerce',
    subtitle: 'Omnichannel technologie voor moderne retailers',
    description: 'Van POS-systemen tot e-commerce platforms en voorraadmanagement. Workflo verbindt al uw verkoopkanalen en zorgt voor naadloze customer experiences, zowel online als in de winkel.',
    image: '/images/sectors/retail-hero.jpg',
    stats: [
      { value: '350+', label: 'Retail Klanten', icon: Store },
      { value: '99.9%', label: 'POS Uptime', icon: CreditCard },
      { value: '1M+', label: 'Transacties/dag', icon: ShoppingCart },
      { value: '<5s', label: 'Checkout Tijd', icon: Package }
    ]
  },
  
  challenges: {
    title: 'IT-Uitdagingen in Retail',
    subtitle: 'Complexe eisen van moderne retail organisaties',
    items: [
      {
        icon: Store,
        title: 'Omnichannel Integratie',
        description: 'Online, in-store en mobile kanalen moeten naadloos samenwerken.',
        solution: 'Geïntegreerde retail platforms die alle kanalen synchroniseren met real-time data.'
      },
      {
        icon: Package,
        title: 'Voorraadmanagement',
        description: 'Real-time inzicht in voorraad over alle locaties en kanalen.',
        solution: 'Centralized inventory management met automatische aanvulling en reporting.'
      },
      {
        icon: CreditCard,
        title: 'Payment Processing',
        description: 'Veilige en snelle betalingsverwerking met PCI compliance.',
        solution: 'Moderne POS-systemen met contactless payments en fraud protection.'
      },
      {
        icon: BarChart,
        title: 'Customer Analytics',
        description: 'Inzicht in klantgedrag en preferences voor betere service.',
        solution: 'Advanced analytics dashboards met customer journey tracking en personalisatie.'
      }
    ]
  },

  solutions: {
    title: 'Onze Oplossingen voor Retailers',
    subtitle: 'Complete retail technology stack voor optimale performance',
    categories: [
      {
        title: 'POS & Payment Systems',
        icon: CreditCard,
        description: 'Moderne kassasystemen en betalingsverwerking',
        features: [
          'Cloud-based POS systemen',
          'Contactless en mobile payments',
          'Integrated loyalty programs',
          'Receipt printing en email',
          'Multi-location management'
        ]
      },
      {
        title: 'E-commerce Platforms',
        icon: ShoppingCart,
        description: 'Professionele online shops en marketplaces',
        features: [
          'Shopify, Magento, WooCommerce',
          'Mobile-responsive design',
          'Payment gateway integratie',
          'SEO optimalisatie',
          'Performance monitoring'
        ]
      },
      {
        title: 'Inventory & Logistics',
        icon: Package,
        description: 'Voorraad- en logistiek management',
        features: [
          'Real-time inventory tracking',
          'Automated reordering',
          'Warehouse management systems',
          'Shipping integrations',
          'Returns processing'
        ]
      },
      {
        title: 'Analytics & CRM',
        icon: BarChart,
        description: 'Customer insights en relationship management',
        features: [
          'Customer behavior analytics',
          'Sales performance dashboards',
          'Email marketing automation',
          'Customer service tools',
          'Business intelligence reporting'
        ]
      }
    ]
  },

  benefits: {
    title: 'Waarom Retailers voor Workflo Kiezen',
    subtitle: 'De voordelen van gespecialiseerde retail-IT',
    items: [
      {
        title: 'Retail Expertise',
        description: 'Diepgaande kennis van retail workflows, POS-systemen en e-commerce platforms.',
        icon: CheckCircle
      },
      {
        title: 'Maximum Uptime',
        description: '99.9% beschikbaarheid voor kritische verkoop systemen, zelfs tijdens piekperiodes.',
        icon: CheckCircle
      },
      {
        title: 'Schaalbare Architectuur',
        description: 'Infrastructuur die meegroeit van lokale winkel tot landelijke keten.',
        icon: CheckCircle
      },
      {
        title: 'Snelle Implementation',
        description: 'Nieuwe winkels operational binnen 48 uur dankzij gestandaardiseerde setups.',
        icon: CheckCircle
      }
    ]
  },

  testimonials: [
    {
      name: 'Sandra Konings',
      role: 'Operations Manager',
      company: 'FashionForward Retail',
      content: 'Onze omnichannel strategie is perfect uitgevoerd door Workflo. Online en offline voorraad is nu real-time gesynchroniseerd.',
      avatar: '/images/testimonials/retail-1.jpg'
    },
    {
      name: 'Tom Verbeek',
      role: 'IT Director',
      company: 'MegaMart Supermarkten',
      content: 'Met 47 winkels hadden we complexe IT-uitdagingen. Workflo heeft alles gestroomlijnd en onze checkout tijden gehalveerd.',
      avatar: '/images/testimonials/retail-2.jpg'
    }
  ],

  caseStudy: {
    title: 'Case Study: FashionForward Retail',
    company: 'FashionForward Retail',
    challenge: 'Fashion retailer met 12 winkels en online shop worstelde met voorraad inconsistenties, trage checkouts en gefragmenteerde customer data.',
    solution: 'Complete omnichannel transformatie met geïntegreerde POS, e-commerce platform synchronisatie en centralized customer database.',
    results: [
      '90% nauwkeurigere voorraad tracking',
      '50% snellere checkout processen',
      '200% hogere online conversie',
      '35% meer customer retention'
    ],
    quote: {
      content: 'Workflo heeft ons van een traditionele retailer getransformeerd naar een moderne omnichannel organisatie.',
      author: 'Sandra Konings',
      role: 'Operations Manager'
    }
  },

  faq: [
    {
      question: 'Ondersteunen jullie alle POS-systemen?',
      answer: 'We hebben expertise in alle major POS-platforms zoals Square, Lightspeed, Vend, Shopify POS, en custom retail solutions. Ook integreren we legacy systemen met moderne platforms.'
    },
    {
      question: 'Hoe synchroniseren jullie online en offline voorraad?',
      answer: 'Via real-time API integraties tussen uw POS, e-commerce platform en warehouse management systeem. Alle kanalen tonen dezelfde accurate voorraad informatie.'
    },
    {
      question: 'Kunnen jullie helpen met PCI compliance?',
      answer: 'Absoluut. We implementeren PCI DSS compliant payment processing, encrypted data storage, en secure network architecturen voor veilige creditcard verwerking.'
    },
    {
      question: 'Hoe snel kan een nieuwe winkel operationeel zijn?',
      answer: 'Met onze gestandaardiseerde retail IT-stacks kan een nieuwe winkel binnen 48 uur volledig operationeel zijn, inclusief POS, netwerk, en integraties met hoofdkantoor systemen.'
    }
  ],

  cta: {
    title: 'Klaar voor Omnichannel Success?',
    subtitle: 'Transformeer uw retail business met technologie die alle kanalen verbindt',
    primaryButton: {
      text: 'Gratis Retail IT-Assessment',
      href: '/contact'
    },
    secondaryButton: {
      text: 'Download Omnichannel Gids',
      href: '/downloads/retail-omnichannel-guide'
    },
    features: [
      'Gratis retail technology audit',
      'Omnichannel strategie advies',
      'Geen verplichtingen',
      'Retail technology specialist'
    ]
  }
}

export default function RetailPage() {
  return <SectorPageTemplate data={retailData} />
}