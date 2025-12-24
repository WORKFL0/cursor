import { Metadata } from 'next'
import SectorPageTemplate from '@/components/sectors/sector-page-template'
import type { SectorPageData } from '@/lib/types/sectors'

export const metadata: Metadata = {
  title: 'IT voor Media & Productie | Workflo - Professional Media IT Solutions',
  description: 'Professionele IT-oplossingen voor mediabedrijven, TV-stations, productiemaatschappijen. Video editing, streaming, opslag en workflow automation.',
}

const mediaData: SectorPageData = {
  hero: {
    title: 'IT-Oplossingen voor Media & Productie',
    subtitle: 'Krachtige technologie voor creatieve professionals',
    description: 'Van 4K video editing tot live streaming en content management. Workflo levert de IT-infrastructuur die mediaprofessionals nodig hebben voor seamless productie en distributie.',
    image: '/images/sectors/media-hero.jpg',
    stats: [
      { value: '75+', label: 'Media Bedrijven', iconName: 'Video' },
      { value: '1PB+', label: 'Media Opslag', iconName: 'HardDrive' },
      { value: '99.9%', label: 'Streaming Uptime', iconName: 'Broadcast' },
      { value: '24/7', label: 'Productie Support', iconName: 'Monitor' }
    ]
  },
  
  challenges: {
    title: 'IT-Uitdagingen in Media & Productie',
    subtitle: 'Complexe technische eisen voor creatieve workflows',
    items: [
      {
        iconName: 'Video',
        title: 'Grote Video Bestanden',
        description: '4K/8K video content en raw footage vereisen enorme opslag en bandbreedte.',
        solution: 'High-speed NAS systemen, fiber netwerken en geoptimaliseerde workflows voor grote bestanden.'
      },
      {
        iconName: 'Monitor',
        title: 'Real-time Rendering',
        description: 'Video editing en color grading vragen extreme rekenkracht voor smooth playback.',
        solution: 'GPU-farms, render clusters en optimized workstations voor professionele video productie.'
      },
      {
        iconName: 'Broadcast',
        title: 'Live Streaming',
        description: 'Broadcasting naar duizenden kijkers zonder buffering of downtime.',
        solution: 'Redundante streaming infrastructuur met CDN integratie en failover systemen.'
      },
      {
        iconName: 'Cloud',
        title: 'Remote Collaboration',
        description: 'Teams werken wereldwijd samen aan projecten met grote media assets.',
        solution: 'Cloud-native workflows met proxy editing en centralized asset management.'
      }
    ]
  },

  solutions: {
    title: 'Onze Oplossingen voor Mediabedrijven',
    subtitle: 'Complete technologie stack voor moderne media productie',
    categories: [
      {
        title: 'Video & Audio Workstations',
        iconName: 'Monitor',
        description: 'High-performance systemen voor content creatie',
        features: [
          'Avid, Adobe, DaVinci Resolve setups',
          'GPU accelerated rendering',
          'Color accurate 4K/8K monitors',
          'Audio interfaces en monitoring',
          'Thunderbolt storage connectivity'
        ]
      },
      {
        title: 'Storage & Workflow',
        iconName: 'HardDrive',
        description: 'Schaalbare opslag en asset management',
        features: [
          'High-speed shared storage (SAN)',
          'Automated backup workflows',
          'Asset tagging en metadata',
          'Version control systemen',
          'Archive en retrieval automation'
        ]
      },
      {
        title: 'Streaming & Broadcasting',
        iconName: 'Broadcast',
        description: 'Live streaming en distribution platforms',
        features: [
          'Multi-bitrate encoding',
          'CDN configuratie en management',
          'Live switching en mixing',
          'Stream monitoring en analytics',
          'Failover en redundancy'
        ]
      },
      {
        title: 'Netwerk & Infrastructuur',
        iconName: 'Wifi',
        description: 'Robust netwerk voor media workflows',
        features: [
          '10Gb+ netwerk infrastructuur',
          'Dedicated internet verbindingen',
          'VPN voor remote workflows',
          'Network attached storage (NAS)',
          'Disaster recovery planning'
        ]
      }
    ]
  },

  benefits: {
    title: 'Waarom Media Professionals voor Workflo Kiezen',
    subtitle: 'De voordelen van gespecialiseerde media-IT',
    items: [
      {
        title: 'Media Expertise',
        description: 'Diepgaande kennis van video workflows, codecs en professionele software.',
        iconName: 'CheckCircle'
      },
      {
        title: 'Snelle Performance',
        description: 'Geen wachttijden bij rendering of export dankzij geoptimaliseerde systemen.',
        iconName: 'CheckCircle'
      },
      {
        title: 'Schaalbare Opslag',
        description: 'Van TB tot PB storage die meegroeit met uw content bibliotheek.',
        iconName: 'CheckCircle'
      },
      {
        title: 'Global Reach',
        description: 'CDN integratie voor wereldwijde content distributie met lage latency.',
        iconName: 'CheckCircle'
      }
    ]
  },

  testimonials: [
    {
      name: 'Pieter de Jong',
      role: 'Technical Director',
      company: 'MediaHouse Productions',
      content: 'Workflo heeft onze productiviteit verdubbeld. 4K editing is nu real-time en onze render tijden zijn 75% korter geworden.',
      avatar: '/images/testimonials/media-1.jpg'
    },
    {
      name: 'Sophie van Dam',
      role: 'Post-Production Manager',
      company: 'Studio Visuals',
      content: 'De workflow automation en asset management van Workflo heeft onze chaos omgezet in een geoliede machine. Projecten worden nu op tijd opgeleverd.',
      avatar: '/images/testimonials/media-2.jpg'
    }
  ],

  caseStudy: {
    title: 'Case Study: MediaHouse Productions',
    company: 'MediaHouse Productions',
    challenge: 'Groeiende productiemaatschappij worstelde met trage 4K workflows, onbetrouwbare storage en bottlenecks bij color grading.',
    solution: 'Complete infrastructuur upgrade met GPU render farm, high-speed shared storage en automatische backup workflows.',
    results: [
      '75% snellere render tijden',
      '100% meer concurrent editors',
      'Zero data loss sinds implementatie',
      '40% hogere project throughput'
    ],
    quote: {
      content: 'Met Workflo kunnen we eindelijk concurreren met de grote studio\'s. Onze technical capabilities zijn nu world-class.',
      author: 'Pieter de Jong',
      role: 'Technical Director'
    }
  },

  faq: [
    {
      question: 'Ondersteunen jullie alle video editing software?',
      answer: 'Ja, we hebben expertise in alle professionele pakketten: Avid Media Composer, Adobe Premiere Pro, DaVinci Resolve, Final Cut Pro, en meer. We optimaliseren workstations specifiek voor uw software stack.'
    },
    {
      question: 'Hoe werkt remote video editing?',
      answer: 'Via proxy workflows kunt u remote editing doen met lage resolutie files, terwijl de originele 4K/8K assets in onze datacenter blijven. Final renders gebruiken de full resolution masters.'
    },
    {
      question: 'Kunnen jullie live streaming events ondersteunen?',
      answer: 'Absoluut. We bieden complete live streaming oplossingen inclusief encoding, CDN configuratie, backup streams en real-time monitoring. Van kleine webinars tot grote broadcasts.'
    },
    {
      question: 'Hoe zit het met copyright en asset beveiliging?',
      answer: 'We implementeren DRM systemen, watermarking, encrypted storage en gecontroleerde toegang tot assets. Alle content wordt veilig opgeslagen met audit trails en access logging.'
    }
  ],

  cta: {
    title: 'Klaar voor Professionele Media-IT?',
    subtitle: 'Transformeer uw creatieve workflow met technologie die uw visie ondersteunt',
    primaryButton: {
      text: 'Gratis Workflow Analyse',
      href: '/contact'
    },
    secondaryButton: {
      text: 'Download Media-IT Gids',
      href: '/downloads/media-it-guide'
    },
    features: [
      'Gratis workflow assessment',
      'Performance benchmarking',
      'Geen verplichtingen',
      'Media technology expert'
    ]
  }
}

export default function MediaPage() {
  return <SectorPageTemplate data={mediaData} />
}