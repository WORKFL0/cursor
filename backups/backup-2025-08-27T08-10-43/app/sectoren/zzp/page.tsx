import { Metadata } from 'next'
import { User, Laptop, Shield, Calculator, Cloud, Smartphone, Coffee, CheckCircle } from 'lucide-react'
import SectorPageTemplate from '@/components/sectors/sector-page-template'
import type { SectorPageData } from '@/lib/types/sectors'

export const metadata: Metadata = {
  title: 'IT voor ZZP\'ers & Freelancers | Workflo - Professional Freelancer IT',
  description: 'Betaalbare IT-oplossingen voor ZZP\'ers en freelancers. Veilige systemen, backup solutions, productiviteit tools en professionele support.',
}

const zzpData: SectorPageData = {
  hero: {
    title: 'IT-Oplossingen voor ZZP\'ers & Freelancers',
    subtitle: 'Professionele technologie voor de zelfstandige professional',
    description: 'Als ZZP\'er verdient u dezelfde professionele IT-ondersteuning als grote bedrijven. Van veilige backup tot productiviteit tools - Workflo zorgt dat u zich kunt focussen op uw werk.',
    image: '/images/sectors/freelancer-hero.jpg',
    stats: [
      { value: '2500+', label: 'ZZP\'ers & Freelancers', icon: User },
      { value: '99.5%', label: 'Systeem Uptime', icon: Laptop },
      { value: '€89', label: 'Vanaf per maand', icon: Calculator },
      { value: '24/7', label: 'Online Support', icon: Smartphone }
    ]
  },
  
  challenges: {
    title: 'IT-Uitdagingen voor ZZP\'ers',
    subtitle: 'Herkenbare problemen die uw business raken',
    items: [
      {
        icon: Shield,
        title: 'Data Beveiliging',
        description: 'Klantgegevens en eigen werk moet beschermd worden tegen verlies en diefstal.',
        solution: 'Professionele backup solutions en security software voor volledige data bescherming.'
      },
      {
        icon: Laptop,
        title: 'Hardware Problemen',
        description: 'Als uw laptop crasht, staat uw business stil en loopt u inkomsten mis.',
        solution: '24/7 support, preventief onderhoud en snelle hardware vervanging services.'
      },
      {
        icon: Cloud,
        title: 'Overal Werken',
        description: 'Flexibel werken vereist toegang tot bestanden vanaf elke locatie.',
        solution: 'Cloud storage en remote access oplossingen voor mobiel werken.'
      },
      {
        icon: Calculator,
        title: 'IT-Kosten Beheersen',
        description: 'Beperkt budget maar wel professionele tools nodig voor concurrentie.',
        solution: 'All-in pakketten met voorspelbare maandkosten en enterprise tools.'
      }
    ]
  },

  solutions: {
    title: 'Onze Oplossingen voor ZZP\'ers',
    subtitle: 'Complete IT-ondersteuning aangepast aan uw budget',
    categories: [
      {
        title: 'Hardware & Software',
        icon: Laptop,
        description: 'Professionele tools voor elke freelancer',
        features: [
          'Lease laptops en desktop systemen',
          'Microsoft Office 365 Business',
          'Adobe Creative Cloud licenties',
          'Antivirus en security software',
          'Hardware verzekeringen'
        ]
      },
      {
        title: 'Backup & Security',
        icon: Shield,
        description: 'Bescherming van uw data en privacy',
        features: [
          'Automatische cloud backups',
          'Ransomware protection',
          'VPN voor veilig internetten',
          'Password managers',
          'GDPR compliance hulp'
        ]
      },
      {
        title: 'Productivity & Collaboration',
        icon: Cloud,
        description: 'Tools voor efficiënt werken',
        features: [
          'Project management software',
          'Online file storage & sync',
          'Video conferencing tools',
          'Client portal solutions',
          'Time tracking applicaties'
        ]
      },
      {
        title: 'Support & Onderhoud',
        icon: Smartphone,
        description: '24/7 hulp wanneer u het nodig heeft',
        features: [
          'Remote IT support',
          'Software update management',
          'System performance monitoring',
          'Email en telefoon support',
          'Preventieve systeemchecks'
        ]
      }
    ]
  },

  benefits: {
    title: 'Waarom ZZP\'ers voor Workflo Kiezen',
    subtitle: 'De voordelen van professionele IT-ondersteuning',
    items: [
      {
        title: 'ZZP Expertise',
        description: 'We begrijpen de unieke behoeften en budgetbeperkingen van zelfstandigen.',
        icon: CheckCircle
      },
      {
        title: 'Vaste Lage Kosten',
        description: 'Voorspelbare maandelijkse kosten vanaf €89, geen verrassingen.',
        icon: CheckCircle
      },
      {
        title: 'Enterprise Tools',
        description: 'Toegang tot dezelfde professionele software als grote bedrijven.',
        icon: CheckCircle
      },
      {
        title: 'Persoonlijke Service',
        description: 'Directe lijn met uw vaste IT-specialist die uw setup kent.',
        icon: CheckCircle
      }
    ]
  },

  testimonials: [
    {
      name: 'Marieke de Wit',
      role: 'Grafisch Ontwerper',
      company: 'Studio de Wit',
      content: 'Sinds ik met Workflo werk, heb ik geen IT-zorgen meer. Mijn data is veilig en ik kan overal werken. Voor €89 per maand krijg ik enterprise-level service!',
      avatar: '/images/testimonials/freelancer-1.jpg'
    },
    {
      name: 'Erik Molenhof',
      role: 'Marketing Consultant',
      company: 'Molenhof Marketing',
      content: 'De backup oplossing van Workflo heeft me al twee keer gered van dataloss. Hun support is snel en persoonlijk - perfect voor ZZP\'ers.',
      avatar: '/images/testimonials/freelancer-2.jpg'
    }
  ],

  caseStudy: {
    title: 'Case Study: Studio de Wit',
    company: 'Marieke de Wit - Grafisch Ontwerper',
    challenge: 'Freelance grafisch ontwerper kampte met trage laptop, data verlies angst en hoge software licentie kosten die haar budget overschreden.',
    solution: 'Complete IT-setup met krachtige lease laptop, Adobe Creative Cloud, automatische backup en 24/7 support voor één vast bedrag.',
    results: [
      '300% snellere Adobe performance',
      '100% data backup zekerheid',
      '60% lagere IT-kosten per maand',
      'Zero downtime in 18 maanden'
    ],
    quote: {
      content: 'Workflo heeft mijn freelance business getransformeerd. Ik werk nu professioneler dan ooit en mijn klanten merken het verschil.',
      author: 'Marieke de Wit',
      role: 'Grafisch Ontwerper'
    }
  },

  faq: [
    {
      question: 'Wat is inbegrepen in het ZZP basis pakket?',
      answer: 'Voor €89/maand krijgt u: laptop lease, Office 365, antivirus software, automatische backup, VPN toegang, en onbeperkte remote support. Upgrade opties beschikbaar voor specifieke software.'
    },
    {
      question: 'Kan ik Adobe Creative Cloud toevoegen?',
      answer: 'Ja, wij regelen Adobe CC licenties met korting. Voor designers hebben we speciale pakketten die Creative Cloud, color-accurate monitors en extra storage bevatten.'
    },
    {
      question: 'Wat gebeurt er als mijn laptop stuk gaat?',
      answer: 'We leveren binnen 24 uur een vervangende laptop met al uw software en instellingen. Dankzij cloud sync zijn al uw bestanden direct beschikbaar.'
    },
    {
      question: 'Helpen jullie met GDPR compliance?',
      answer: 'Absoluut. We helpen met privacy statements, beveiligde email, encrypted storage en alle technische aspecten van GDPR compliance voor ZZP\'ers.'
    }
  ],

  cta: {
    title: 'Klaar voor Professionele ZZP-IT?',
    subtitle: 'Start vandaag nog met enterprise-level technologie voor uw freelance business',
    primaryButton: {
      text: 'Start uw €89 Pakket',
      href: '/contact'
    },
    secondaryButton: {
      text: 'Download ZZP IT-Gids',
      href: '/downloads/zzp-it-guide'
    },
    features: [
      'Geen setup kosten',
      '30 dagen geld terug garantie',
      'Flexibele contracten',
      'Persoonlijke ZZP-specialist'
    ]
  }
}

export default function ZZPPage() {
  return <SectorPageTemplate data={zzpData} />
}