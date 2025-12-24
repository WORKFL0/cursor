import { Metadata } from 'next'
import SectorPageTemplate from '@/components/sectors/sector-page-template'
import type { SectorPageData } from '@/lib/types/sectors'

export const metadata: Metadata = {
  title: 'IT voor Architecten | Workflo - Specialized IT Solutions',
  description: 'Betrouwbare IT-oplossingen voor architectenbureaus. CAD werkstations, BIM software, cloud storage en render farms. Optimaal presteren met professionele IT.',
}

const architectenData: SectorPageData = {
  hero: {
    title: 'IT-Oplossingen voor Architectenbureaus',
    subtitle: 'Focus op ontwerpen, wij regelen de technologie',
    description: 'Van CAD-werkstations tot BIM-software en cloud rendering. Workflo begrijpt de unieke IT-behoeften van architecten en zorgt dat uw technologie uw creativiteit ondersteunt, niet beperkt.',
    image: '/images/sectors/architects-hero.jpg',
    stats: [
      { value: '50+', label: 'Architectenbureaus', iconName: 'Building2' },
      { value: '99.9%', label: 'Uptime CAD-systemen', iconName: 'Layers' },
      { value: '10TB+', label: 'Project Storage', iconName: 'Cloud' },
      { value: '24/7', label: 'Support', iconName: 'Shield' }
    ]
  },
  
  challenges: {
    title: 'IT-Uitdagingen in de Architectuur',
    subtitle: 'Herkenbare problemen die we dagelijks oplossen',
    items: [
      {
        iconName: 'Layers',
        title: 'Grote Bestanden & Rendering',
        description: 'CAD-bestanden en 3D-renders vragen veel van systemen. Trage computers vertragen projecten.',
        solution: 'Krachtige werkstations en cloud rendering farms voor snelle projectverwerking.'
      },
      {
        iconName: 'Cloud',
        title: 'Samenwerking & Bestandsdeling',
        description: 'Teams werken aan dezelfde projecten, vaak vanaf verschillende locaties.',
        solution: 'Veilige cloud-oplossingen met real-time synchronisatie en versiecontrole.'
      },
      {
        iconName: 'Shield',
        title: 'Data Beveiliging',
        description: 'Vertrouwelijke ontwerpen en klantgegevens moeten beschermd worden.',
        solution: 'Enterprise-grade security met encrypted backups en toegangscontrole.'
      },
      {
        iconName: 'Palette',
        title: 'Software Licenties',
        description: 'Dure CAD/BIM software licenties optimaal benutten.',
        solution: 'Licentiemanagement en floating licenses voor maximale efficiency.'
      }
    ]
  },

  solutions: {
    title: 'Onze Oplossingen voor Architecten',
    subtitle: 'Complete IT-ondersteuning afgestemd op uw bureau',
    categories: [
      {
        title: 'Werkstations & Hardware',
        iconName: 'Building2',
        description: 'High-performance systemen voor CAD/BIM',
        features: [
          'CAD-geoptimaliseerde werkstations',
          'Grote 4K/5K monitors voor detail werk',
          'Grafische tablets en 3D-muizen',
          'Plotters en 3D-printers',
          'Ergonomische werkplekken'
        ]
      },
      {
        title: 'Software & Licenties',
        iconName: 'Palette',
        description: 'Alle tools die u nodig heeft',
        features: [
          'AutoCAD, Revit, ArchiCAD setup',
          'SketchUp, Rhino, 3DS Max',
          'Adobe Creative Cloud',
          'BIM 360 en collaboration tools',
          'Licentie optimalisatie'
        ]
      },
      {
        title: 'Cloud & Storage',
        iconName: 'Cloud',
        description: 'Veilige opslag en samenwerking',
        features: [
          'Onbeperkte cloud storage',
          'Automatische project backups',
          'Versiecontrole systemen',
          'Remote access oplossingen',
          'Cloud rendering services'
        ]
      },
      {
        title: 'Support & Beheer',
        iconName: 'Users',
        description: '24/7 ondersteuning voor uw team',
        features: [
          'Dedicated account manager',
          'Proactieve monitoring',
          'Software updates beheer',
          'Training voor nieuwe tools',
          'Disaster recovery planning'
        ]
      }
    ]
  },

  benefits: {
    title: 'Waarom Architecten voor Workflo Kiezen',
    subtitle: 'De voordelen van gespecialiseerde IT-ondersteuning',
    items: [
      {
        title: 'Branche Expertise',
        description: 'We kennen AutoCAD, Revit en BIM workflows van binnen en buiten.',
        iconName: 'CheckCircle'
      },
      {
        title: 'Geen Downtime',
        description: 'Deadlines halen door 99.9% uptime garantie en proactief onderhoud.',
        iconName: 'CheckCircle'
      },
      {
        title: 'Schaalbare Oplossingen',
        description: 'Groei mee van klein bureau naar grote praktijk zonder IT-zorgen.',
        iconName: 'CheckCircle'
      },
      {
        title: 'Vaste Maandprijs',
        description: 'Voorspelbare IT-kosten zonder verrassingen, inclusief alle support.',
        iconName: 'CheckCircle'
      }
    ]
  },

  testimonials: [
    {
      name: 'Mark van der Berg',
      role: 'Partner',
      company: 'Studio MVB Architecten',
      content: 'Sinds we met Workflo werken hebben we geen IT-problemen meer. Onze renders zijn 3x sneller en we kunnen overal veilig aan projecten werken.',
      avatar: '/images/testimonials/architect-1.jpg'
    },
    {
      name: 'Lisa Hendriks',
      role: 'BIM Manager',
      company: 'Hendriks & Partners',
      content: 'De cloud oplossing van Workflo heeft onze samenwerking getransformeerd. Real-time werken aan BIM-modellen zonder vertragingen.',
      avatar: '/images/testimonials/architect-2.jpg'
    }
  ],

  caseStudy: {
    title: 'Case Study: Studio MVB Architecten',
    company: 'Studio MVB Architecten',
    challenge: 'Groeiend architectenbureau met 15 medewerkers kampte met trage systemen, render bottlenecks en onveilige bestandsdeling.',
    solution: 'Complete IT-transformatie met nieuwe CAD-werkstations, cloud render farm, en veilige project management omgeving.',
    results: [
      '70% snellere render tijden',
      '100% veilige project opslag',
      'Zero downtime sinds implementatie',
      '€25.000/jaar bespaard op IT-kosten'
    ],
    quote: {
      content: 'Workflo heeft onze productiviteit enorm verhoogd. We kunnen nu 30% meer projecten aan zonder extra mensen.',
      author: 'Mark van der Berg',
      role: 'Managing Partner'
    }
  },

  faq: [
    {
      question: 'Ondersteunen jullie alle CAD/BIM software?',
      answer: 'Ja, we ondersteunen alle major CAD/BIM pakketten inclusief AutoCAD, Revit, ArchiCAD, Vectorworks, SketchUp, Rhino en meer. Ook helpen we met installatie, configuratie en updates.'
    },
    {
      question: 'Hoe werkt cloud rendering?',
      answer: 'Via onze cloud render farm kunt u renders uitbesteden aan krachtige servers. Upload uw project, selecteer de settings, en ontvang het resultaat zonder uw werkstation te belasten.'
    },
    {
      question: 'Zijn onze ontwerpen veilig in de cloud?',
      answer: 'Absoluut. We gebruiken enterprise-grade encryptie, Nederlandse datacenters, en strikte toegangscontrole. Alle data wordt dagelijks gebackupt en is ISO 27001 compliant.'
    },
    {
      question: 'Wat kost IT voor een architectenbureau?',
      answer: 'Onze all-in pakketten starten vanaf €125 per werkplek per maand. Dit is inclusief hardware, software, cloud storage, backups en onbeperkte support. Vraag een offerte aan voor uw specifieke situatie.'
    }
  ],

  cta: {
    title: 'Klaar voor Probleemloze IT?',
    subtitle: 'Laat uw architectenbureau optimaal presteren met professionele IT-ondersteuning',
    primaryButton: {
      text: 'Gratis IT-Scan Aanvragen',
      href: '/contact'
    },
    secondaryButton: {
      text: 'Download Architecten IT-Gids',
      href: '/downloads/architecten-it-guide'
    },
    features: [
      'Gratis IT-assessment',
      'Binnen 24 uur advies',
      'Geen verplichtingen',
      'Architecten specialist'
    ]
  }
}

export default function ArchitectenPage() {
  return <SectorPageTemplate data={architectenData} />
}