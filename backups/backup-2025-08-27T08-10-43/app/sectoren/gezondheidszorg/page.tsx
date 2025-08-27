import { Metadata } from 'next'
import { Heart, Shield, Users, FileText, Cloud, Lock, Stethoscope, CheckCircle } from 'lucide-react'
import SectorPageTemplate from '@/components/sectors/sector-page-template'
import type { SectorPageData } from '@/lib/types/sectors'

export const metadata: Metadata = {
  title: 'IT voor Gezondheidszorg | Workflo - GDPR Compliant IT Solutions',
  description: 'Veilige IT-oplossingen voor ziekenhuizen, klinieken en zorgverleners. EPD systemen, GDPR compliance, medische apparatuur integratie en 24/7 support.',
}

const gezondheidszorgData: SectorPageData = {
  hero: {
    title: 'IT-Oplossingen voor de Gezondheidszorg',
    subtitle: 'Veilige en betrouwbare technologie voor betere zorgverlening',
    description: 'Van EPD-systemen tot medische apparatuur integratie. Workflo zorgt voor GDPR-compliant IT-infrastructuur die zorgverleners in staat stelt zich te concentreren op wat het belangrijkst is: hun patiënten.',
    image: '/images/sectors/healthcare-hero.jpg',
    stats: [
      { value: '120+', label: 'Zorgorganisaties', icon: Heart },
      { value: '99.99%', label: 'EPD Uptime', icon: FileText },
      { value: '100%', label: 'GDPR Compliant', icon: Shield },
      { value: '<2 min', label: 'Responstijd support', icon: Users }
    ]
  },
  
  challenges: {
    title: 'IT-Uitdagingen in de Zorg',
    subtitle: 'Complexe eisen die specialistische kennis vereisen',
    items: [
      {
        icon: Shield,
        title: 'GDPR & AVG Compliance',
        description: 'Patiëntgegevens zijn extra gevoelig en vereisen de hoogste beveiligingsstandaarden.',
        solution: 'Complete GDPR-compliance met encrypted databases, audit trails en toegangscontrole.'
      },
      {
        icon: FileText,
        title: 'EPD Integratie',
        description: 'Elektronische Patiënt Dossiers moeten naadloos werken met andere systemen.',
        solution: 'Expertise in HiX, ChipSoft, Epic en andere EPD-systemen met betrouwbare integratie.'
      },
      {
        icon: Stethoscope,
        title: 'Medische Apparatuur',
        description: 'CT-scans, MRI\'s en andere apparatuur moeten verbonden zijn met IT-netwerken.',
        solution: 'Gespecialiseerde netwerken voor DICOM-beelden en medische device integratie.'
      },
      {
        icon: Users,
        title: '24/7 Beschikbaarheid',
        description: 'Zorgverlening stopt nooit, dus IT-systemen moeten altijd beschikbaar zijn.',
        solution: 'Redundante systemen, 24/7 monitoring en directe escalatie bij problemen.'
      }
    ]
  },

  solutions: {
    title: 'Onze Oplossingen voor Zorgverleners',
    subtitle: 'Complete IT-ondersteuning voor de moderne zorgorganisatie',
    categories: [
      {
        title: 'EPD & Zorgsystemen',
        icon: FileText,
        description: 'Veilige en efficiënte patiëntenadministratie',
        features: [
          'HiX, ChipSoft, Epic implementatie',
          'HL7 FHIR integraties',
          'Backup en disaster recovery',
          'Performance monitoring',
          'Gebruikerstraining en support'
        ]
      },
      {
        title: 'Medische IT-Infrastructuur',
        icon: Stethoscope,
        description: 'Gespecialiseerde netwerken en systemen',
        features: [
          'DICOM netwerken voor beeldvorming',
          'PACS (Picture Archiving Systems)',
          'Medische apparatuur connectiviteit',
          'Draadloze netwerken voor mobiele units',
          'IoT device management'
        ]
      },
      {
        title: 'Security & Compliance',
        icon: Shield,
        description: 'Maximale beveiliging voor patiëntgegevens',
        features: [
          'GDPR/AVG compliance audit',
          'End-to-end encryption',
          'Multi-factor authentication',
          'Role-based access control',
          'Beveiligingstraining personeel'
        ]
      },
      {
        title: 'Support & Monitoring',
        icon: Users,
        description: '24/7 ondersteuning voor kritische systemen',
        features: [
          '24/7/365 helpdesk',
          'Proactieve systeem monitoring',
          'Escalatie procedures',
          'On-site support binnen 2 uur',
          'Preventief onderhoud'
        ]
      }
    ]
  },

  benefits: {
    title: 'Waarom Zorgverleners voor Workflo Kiezen',
    subtitle: 'De voordelen van gespecialiseerde zorg-IT',
    items: [
      {
        title: 'Zorg Expertise',
        description: 'Diepgaande kennis van EPD-systemen, GDPR-eisen en medische workflows.',
        icon: CheckCircle
      },
      {
        title: 'Maximale Uptime',
        description: '99.99% beschikbaarheid door redundante systemen en proactieve monitoring.',
        icon: CheckCircle
      },
      {
        title: 'GDPR Zekerheid',
        description: 'Volledige compliance met alle privacy wetgeving en regelmatige audits.',
        icon: CheckCircle
      },
      {
        title: 'Snelle Support',
        description: 'Binnen 2 minuten respons bij kritische issues, 24/7 beschikbaar.',
        icon: CheckCircle
      }
    ]
  },

  testimonials: [
    {
      name: 'Dr. Maria Visser',
      role: 'Medisch Directeur',
      company: 'Ziekenhuis Noordwest',
      content: 'Sinds Workflo ons IT beheert, hebben we geen downtime meer gehad. Hun expertise in zorg-IT is ongeëvenaard en hun support is uitstekend.',
      avatar: '/images/testimonials/healthcare-1.jpg'
    },
    {
      name: 'Jan Bakker',
      role: 'IT Manager',
      company: 'Huisartsengroep Centrum',
      content: 'De GDPR compliance en security van onze patiëntgegevens is perfect geregeld. We kunnen ons volledig focussen op onze patiënten.',
      avatar: '/images/testimonials/healthcare-2.jpg'
    }
  ],

  caseStudy: {
    title: 'Case Study: Ziekenhuis Noordwest',
    company: 'Ziekenhuis Noordwest',
    challenge: 'Regionaal ziekenhuis met 800 bedden kampte met verouderde IT-infrastructuur, regelmatige EPD-storingen en GDPR compliance issues.',
    solution: 'Complete IT-modernisering met nieuwe servers, verbeterde netwerken, EPD-optimalisatie en implementatie van security protocols.',
    results: [
      '99.99% EPD uptime (was 94%)',
      '80% snellere beelduitwisseling',
      '100% GDPR compliance',
      '€150.000/jaar besparing op IT-kosten'
    ],
    quote: {
      content: 'Workflo heeft onze zorgverlening getransformeerd. Artsen kunnen zich nu volledig concentreren op patiënten in plaats van IT-problemen.',
      author: 'Dr. Maria Visser',
      role: 'Medisch Directeur'
    }
  },

  faq: [
    {
      question: 'Hoe zorgen jullie voor GDPR compliance?',
      answer: 'We implementeren end-to-end encryption, role-based access control, audit logging en regelmatige security audits. Alle systemen voldoen aan NEN 7510 en GDPR-eisen voor patiëntgegevens.'
    },
    {
      question: 'Welke EPD-systemen ondersteunen jullie?',
      answer: 'We hebben expertise in alle major EPD-systemen zoals HiX (ChipSoft), Epic, Nexus, EZIS en Medicore. Ook ondersteunen we gespecialiseerde systemen voor laboratoria en beeldvorming.'
    },
    {
      question: 'Wat gebeurt er bij een IT-storing tijdens spoedgevallen?',
      answer: 'We hebben 24/7 monitoring en binnen 2 minuten respons bij kritische storingen. Redundante systemen zorgen voor continue beschikbaarheid. Bij downtime activeren we direct noodprocedures.'
    },
    {
      question: 'Hoe verbinden jullie medische apparatuur met IT-systemen?',
      answer: 'We hebben ervaring met DICOM-netwerken, HL7-integraties en IoT device management. Van CT-scanners tot infuuspompen, we zorgen voor veilige en betrouwbare connectiviteit.'
    }
  ],

  cta: {
    title: 'Klaar voor Betrouwbare Zorg-IT?',
    subtitle: 'Verbeter uw zorgverlening met professionele IT-ondersteuning die voldoet aan alle eisen',
    primaryButton: {
      text: 'Gratis GDPR-Audit Aanvragen',
      href: '/contact'
    },
    secondaryButton: {
      text: 'Download Zorg-IT Checklist',
      href: '/downloads/healthcare-it-checklist'
    },
    features: [
      'Gratis GDPR compliance check',
      'Binnen 24 uur advies',
      'Geen verplichtingen',
      'Zorg-IT specialist'
    ]
  }
}

export default function GezondheidszorgPage() {
  return <SectorPageTemplate data={gezondheidszorgData} />
}