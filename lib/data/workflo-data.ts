import type { 
  ServiceCategory, 
  CompanyInfo, 
  ContactLocation, 
  HubSpotFormConfig,
  NavigationItem,
  HomePageData,
  ServicesPageData,
  AboutPageData,
  ContactPageData,
  SiteConfig,
  FAQ
} from '@/lib/types/workflo'

// Site Configuration
export const siteConfig: SiteConfig = {
  name: 'Workflo',
  description: 'Amsterdam\'s Trusted IT Growth Partner - Managed IT, Cloud Solutions & Cybersecurity',
  descriptionNL: 'Dé IT-groeipartner van Amsterdam - Managed IT, Cloud-oplossingen & Cybersecurity',
  url: 'https://workflo.it',
  ogImage: '/images/og-image.jpg',
  links: {
    linkedin: 'https://linkedin.com/company/workflo-it',
  },
  defaultLanguage: 'nl',
  languages: [
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ],
}

// Company Information
export const companyInfo: CompanyInfo = {
  name: 'Workflo B.V.',
  tagline: 'Your IT Should Drive Growth—Not Hold You Back',
  taglineNL: 'Laat IT je groei versnellen, niet vertragen',
  founded: '2014',
  employees: '5',
  location: {
    name: 'Workflo Amsterdam',
    address: 'Koivistokade 3',
    city: 'Amsterdam',
    postalCode: '1013 AC',
    country: 'Netherlands',
    phone: '020-30 80 465',
    email: 'info@workflo.it',
    coordinates: {
      lat: 52.38495507204196,
      lng: 4.888571976608
    }
  },
  description: 'Amsterdam\'s most trusted IT partner since 2014, serving 50+ SMEs with comprehensive managed IT services.',
  descriptionNL: 'Amsterdam\'s meest vertrouwde IT-partner sinds 2014, ten dienste van 50+ MKB-bedrijven met complete managed IT-diensten.',
  mission: 'To transform technology from a cost center into a growth engine for Amsterdam businesses.',
  missionNL: 'Technologie transformeren van een kostenpost naar een groeimotor voor Amsterdamse bedrijven.',
  values: [
    {
      title: 'Reliability',
      titleNL: 'Betrouwbaarheid',
      description: 'We do what we promise. No surprises, no hidden costs.',
      descriptionNL: 'We doen wat we beloven. Geen verrassingen, geen verborgen kosten.',
      icon: '🛡️'
    },
    {
      title: 'Expertise',
      titleNL: 'Expertise',
      description: 'Certified specialists with years of experience across diverse sectors.',
      descriptionNL: 'Gecertificeerde specialisten met jarenlange ervaring in diverse sectoren.',
      icon: '💡'
    },
    {
      title: 'Proactivity',
      titleNL: 'Proactiviteit',
      description: 'We prevent problems before they arise through smart monitoring.',
      descriptionNL: 'We voorkomen problemen voordat ze ontstaan door slimme monitoring.',
      icon: '🚀'
    },
    {
      title: 'Partnership',
      titleNL: 'Partnership',
      description: 'We think along with your business and grow together with you.',
      descriptionNL: 'We denken mee met je business en groeien samen met je.',
      icon: '🤝'
    }
  ],
  certifications: [
    'Microsoft Cloud Partner (2015)',
    'Adobe Reseller (2017)',
    'SBB Internship Company (2021)',
    'ZorgMail Partner (2023)',
    'Cisco and Meraki Reseller (2024)'
  ],
  partnerships: [
    'Microsoft',
    'Adobe', 
    'Ruckus',
    'FortiNet',
    'Cisco',
    'Meraki'
  ]
}

// Service Categories
export const serviceCategories: ServiceCategory[] = [
  {
    id: 'managed-it',
    name: 'Managed IT Services',
    nameNL: 'Managed IT-diensten',
    slug: 'managed-it',
    description: 'Complete IT management and support with 24/7 monitoring, unlimited remote support, and predictable monthly costs.',
    descriptionNL: 'Complete IT-beheer en ondersteuning met 24/7 monitoring, onbeperkte remote support en voorspelbare maandelijkse kosten.',
    color: 'yellow',
    services: [
      {
        id: 'it-support',
        title: 'IT Support & Helpdesk',
        titleNL: 'IT-ondersteuning & Helpdesk',
        slug: 'it-support',
        description: 'Unlimited remote support and on-site visits when needed. Fast response times guaranteed.',
        descriptionNL: 'Onbeperkte remote ondersteuning en locatiebezoeken indien nodig. Snelle responstijden gegarandeerd.',
        icon: 'HeadphonesIcon',
        features: [
          '24/7 monitoring',
          'Unlimited remote support',
          '1-hour response time',
          'On-site support when needed',
          'Proactive maintenance'
        ],
        featuresNL: [
          '24/7 monitoring',
          'Onbeperkte remote support',
          '1 uur responstijd',
          'Locatie-ondersteuning indien nodig',
          'Proactief onderhoud'
        ],
        pricing: {
          base: 60,
          currency: 'EUR',
          period: 'monthly',
          description: 'per computer per month',
          descriptionNL: 'per computer per maand'
        },
        category: 'managed-it'
      },
      {
        id: 'system-monitoring',
        title: 'System Monitoring',
        titleNL: 'Systeemmonitoring',
        slug: 'system-monitoring',
        description: 'Proactive monitoring of all your systems to prevent issues before they impact your business.',
        descriptionNL: 'Proactieve monitoring van al je systemen om problemen te voorkomen voordat ze je bedrijf beïnvloeden.',
        icon: 'MonitorIcon',
        features: [
          'Real-time monitoring',
          'Automated alerts',
          'Performance optimization',
          'Capacity planning',
          'Monthly reports'
        ],
        featuresNL: [
          'Real-time monitoring',
          'Geautomatiseerde waarschuwingen',
          'Prestatie-optimalisatie',
          'Capaciteitsplanning',
          'Maandelijkse rapporten'
        ],
        category: 'managed-it'
      }
    ]
  },
  {
    id: 'cloud-solutions',
    name: 'Cloud Solutions',
    nameNL: 'Cloud-oplossingen',
    slug: 'cloud',
    description: 'Microsoft 365, Azure migrations, and hybrid cloud solutions tailored for Dutch businesses.',
    descriptionNL: 'Microsoft 365, Azure-migraties en hybride cloud-oplossingen op maat voor Nederlandse bedrijven.',
    color: 'blue',
    services: [
      {
        id: 'microsoft-365',
        title: 'Microsoft 365 Migration',
        titleNL: 'Microsoft 365 Migratie',
        slug: 'microsoft-365',
        description: 'Seamless migration to Microsoft 365 with minimal downtime and maximum productivity gains.',
        descriptionNL: 'Naadloze migratie naar Microsoft 365 met minimale downtime en maximale productiviteitswinst.',
        icon: 'CloudIcon',
        features: [
          'Email migration',
          'Data migration',
          'User training',
          'Security setup',
          'Ongoing support'
        ],
        featuresNL: [
          'E-mailmigratie',
          'Datamigratie',
          'Gebruikerstraining',
          'Beveiligingsinstellingen',
          'Doorlopende ondersteuning'
        ],
        category: 'cloud'
      },
      {
        id: 'azure-cloud',
        title: 'Azure Cloud Services',
        titleNL: 'Azure Cloud-diensten',
        slug: 'azure',
        description: 'Azure infrastructure design, migration, and management for scalable business growth.',
        descriptionNL: 'Azure infrastructuur ontwerp, migratie en beheer voor schaalbare bedrijfsgroei.',
        icon: 'ServerIcon',
        features: [
          'Infrastructure design',
          'Cloud migration',
          'Cost optimization',
          'Backup & recovery',
          '24/7 monitoring'
        ],
        featuresNL: [
          'Infrastructuur ontwerp',
          'Cloud migratie',
          'Kostenoptimalisatie',
          'Backup & herstel',
          '24/7 monitoring'
        ],
        category: 'cloud'
      }
    ]
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    nameNL: 'Cybersecurity',
    slug: 'cybersecurity',
    description: 'Comprehensive security solutions to protect your business from cyber threats and ensure GDPR compliance.',
    descriptionNL: 'Uitgebreide beveiligingsoplossingen om je bedrijf te beschermen tegen cyberdreigingen en GDPR-compliance te waarborgen.',
    color: 'red',
    services: [
      {
        id: 'endpoint-protection',
        title: 'Endpoint Protection',
        titleNL: 'Endpoint Protection',
        slug: 'endpoint-protection',
        description: 'Advanced endpoint security with AI-powered threat detection and automated response.',
        descriptionNL: 'Geavanceerde endpoint-beveiliging met AI-aangedreven dreigingsdetectie en geautomatiseerde respons.',
        icon: 'ShieldIcon',
        features: [
          'Anti-malware protection',
          'Real-time threat detection',
          'Automated quarantine',
          'Behavioral analysis',
          'Centralized management'
        ],
        featuresNL: [
          'Anti-malware bescherming',
          'Real-time dreigingsdetectie',
          'Geautomatiseerde quarantaine',
          'Gedragsanalyse',
          'Gecentraliseerd beheer'
        ],
        category: 'security'
      }
    ]
  }
]

// Service Categories for Navigation (organized by main categories)
export const serviceNavigationCategories = {
  coreIT: {
    title: 'Core IT Services',
    titleNL: 'Kern IT-diensten',
    icon: 'Monitor',
    services: [
      {
        title: 'Managed IT',
        titleNL: 'Managed IT',
        href: '/diensten/managed-it-services',
        description: '24/7 monitoring and complete IT management',
        descriptionNL: '24/7 monitoring en volledig IT-beheer'
      },
      {
        title: 'Cloud Services',
        titleNL: 'Cloud-diensten',
        href: '/diensten/cloud-diensten',
        description: 'Microsoft 365, Azure and hybrid cloud solutions',
        descriptionNL: 'Microsoft 365, Azure en hybride cloud-oplossingen'
      },
      {
        title: 'Microsoft 365',
        titleNL: 'Microsoft 365',
        href: '/diensten/microsoft-365',
        description: 'Complete Microsoft 365 setup and migration',
        descriptionNL: 'Complete Microsoft 365 inrichting en migratie'
      }
    ]
  },
  security: {
    title: 'Security & Backup',
    titleNL: 'Beveiliging & Backup',
    icon: 'Shield',
    services: [
      {
        title: 'Cybersecurity',
        titleNL: 'Cybersecurity',
        href: '/diensten/cybersecurity',
        description: 'Advanced security and GDPR compliance',
        descriptionNL: 'Geavanceerde beveiliging en GDPR-compliance'
      },
      {
        title: 'Backup & Disaster Recovery',
        titleNL: 'Backup & Disaster Recovery',
        href: '/diensten/backup-disaster-recovery',
        description: 'Secure data backup and recovery solutions',
        descriptionNL: 'Veilige data backup en herstel oplossingen'
      },
      {
        title: 'Zero Trust Security',
        titleNL: 'Zero Trust Beveiliging',
        href: '/diensten/zero-trust',
        description: 'Proactive security strategy with user verification',
        descriptionNL: 'Proactieve beveiligingsstrategie met gebruikersverificatie'
      }
    ]
  },
  communication: {
    title: 'Communication',
    titleNL: 'Communicatie',
    icon: 'Phone',
    services: [
      {
        title: 'VoIP Telefonie',
        titleNL: 'VoIP Telefonie',
        href: '/diensten/voip-telefonie',
        description: 'Modern cloud-based telephony solutions',
        descriptionNL: 'Moderne cloud-telefonie oplossingen'
      },
      {
        title: 'Connectivity',
        titleNL: 'Connectiviteit',
        href: '/diensten/connectivity',
        description: 'Internet connectivity and network optimization',
        descriptionNL: 'Internetconnectiviteit en netwerkoptimalisatie'
      },
      {
        title: 'Microsoft Teams',
        titleNL: 'Microsoft Teams',
        href: '/diensten/microsoft-teams',
        description: 'Unified communication platform setup',
        descriptionNL: 'Geïntegreerd communicatieplatform inrichting'
      }
    ]
  },
  hardware: {
    title: 'Hardware & Support',
    titleNL: 'Hardware & Ondersteuning',
    icon: 'HardDriveIcon',
    services: [
      {
        title: 'Hardware as a Service',
        titleNL: 'Hardware as a Service',
        href: '/diensten/hardware-as-a-service',
        description: 'Flexible hardware rental and management',
        descriptionNL: 'Flexibele hardware verhuur en beheer'
      },
      {
        title: 'Mobile Device Management',
        titleNL: 'Mobile Device Management',
        href: '/diensten/mobile-device-management',
        description: 'Central security management for mobile devices',
        descriptionNL: 'Centraal beveiligingsbeheer voor mobiele apparaten'
      },
      {
        title: 'Audio Visual',
        titleNL: 'Audio Visueel',
        href: '/diensten/audio-visueel',
        description: 'Professional AV solutions and support',
        descriptionNL: 'Professionele AV-oplossingen en ondersteuning'
      }
    ]
  }
}

// Sectors for dropdown
export const sectors = [
  {
    title: 'Financial Services',
    titleNL: 'Financiële Dienstverlening',
    href: '/sectoren/financiele-dienstverlening',
    icon: 'Building2'
  },
  {
    title: 'Healthcare',
    titleNL: 'Gezondheidszorg',
    href: '/sectoren/gezondheidszorg',
    icon: 'Heart'
  },
  {
    title: 'Marketing & Advertising',
    titleNL: 'Marketing & Reclame',
    href: '/sectoren/marketing-reclame',
    icon: 'Megaphone'
  },
  {
    title: 'Freelancers',
    titleNL: 'ZZP',
    href: '/sectoren/zzp',
    icon: 'User'
  },
  {
    title: 'Media',
    titleNL: 'Media',
    href: '/sectoren/media',
    icon: 'Camera'
  },
  {
    title: 'Retail',
    titleNL: 'Retail',
    href: '/sectoren/retail',
    icon: 'ShoppingCart'
  },
  {
    title: 'Non-Profit',
    titleNL: 'Non-Profit',
    href: '/sectoren/non-profit',
    icon: 'Heart'
  },
  {
    title: 'Other',
    titleNL: 'Overige',
    href: '/sectoren/overige',
    icon: 'Building'
  }
]

// Consolidated Navigation Structure
export const navigation: NavigationItem[] = [
  {
    title: 'Services',
    titleNL: 'Diensten',
    href: '/diensten',
    children: Object.values(serviceNavigationCategories).flatMap(category => category.services)
  },
  {
    title: 'Sectors',
    titleNL: 'Sectoren',
    href: '/sectoren',
    children: sectors.map(sector => ({
      title: sector.title,
      titleNL: sector.titleNL,
      href: sector.href,
      description: `IT solutions for ${sector.title.toLowerCase()}`,
      descriptionNL: `IT-oplossingen voor ${sector.titleNL.toLowerCase()}`
    }))
  },
  {
    title: 'About Us',
    titleNL: 'Over Ons',
    href: '/over-ons',
    children: [
      {
        title: 'Our Story',
        titleNL: 'Ons Verhaal',
        href: '/over-ons',
        description: 'Our story, team and values',
        descriptionNL: 'Ons verhaal, team en waarden'
      },
      {
        title: 'Team',
        titleNL: 'Team',
        href: '/over-ons#team',
        description: 'Meet our experienced IT professionals',
        descriptionNL: 'Ontmoet onze ervaren IT-professionals'
      },
      {
        title: 'Careers',
        titleNL: 'Werken bij Workflo',
        href: '/werken-bij',
        description: 'Join our growing team',
        descriptionNL: 'Word onderdeel van ons groeiende team'
      },
      {
        title: 'Certifications',
        titleNL: 'Certificeringen',
        href: '/over-ons#certifications',
        description: 'Our industry certifications and partnerships',
        descriptionNL: 'Onze branche certificeringen en partnerships'
      }
    ]
  },
  {
    title: 'Contact',
    titleNL: 'Contact',
    href: '/contact'
  }
]

// HubSpot Forms Configuration
export const hubspotForms: Record<string, HubSpotFormConfig> = {
  contact: {
    region: 'eu1',
    portalId: '26510736',
    formId: 'acf3fe0b-c542-4fc2-aa14-f3cb2fc356c0',
    name: 'Contact Form',
    purpose: 'General contact and consultation requests'
  },
  newsletter: {
    region: 'eu1',
    portalId: '26510736',
    formId: 'newsletter-signup-id', // Replace with actual newsletter form ID
    name: 'Newsletter Signup',
    purpose: 'Newsletter subscription'
  }
}

// Page Data
export const homePageData: HomePageData = {
  hero: {
    title: 'Your IT Should Drive Growth—Not Hold You Back',
    titleNL: 'Laat IT je groei versnellen, niet vertragen',
    subtitle: 'End downtime, lower costs 35% and unleash productivity with our fully-managed IT services.',
    subtitleNL: 'Minder downtime, 35% lagere kosten en maximale productiviteit dankzij onze complete IT-ontzorging.',
    cta: 'Get My Free IT Assessment',
    ctaNL: 'Plan mijn gratis IT-scan',
    ctaHref: '/free-assessment',
    backgroundVideo: '/videos/hero-video.mp4'
  },
  services: serviceCategories,
  testimonials: [], // Will be populated with actual testimonials
  clients: [], // Will be populated with actual clients
  stats: [
    {
      value: '50+',
      label: 'Happy Clients',
      labelNL: 'Tevreden klanten'
    },
    {
      value: '10+',
      label: 'Years Experience',
      labelNL: 'Jaar ervaring'
    },
    {
      value: '99.9%',
      label: 'Uptime Guarantee',
      labelNL: 'Uptime garantie'
    },
    {
      value: '24/7',
      label: 'Support Available',
      labelNL: 'Support beschikbaar'
    }
  ]
}

export const servicesPageData: ServicesPageData = {
  hero: {
    title: 'One Partner. Every IT Solution.',
    titleNL: 'Eén partner. Alle IT-oplossingen.',
    subtitle: 'Comprehensive IT services designed to help Amsterdam businesses grow and thrive.',
    subtitleNL: 'Uitgebreide IT-diensten ontworpen om Amsterdamse bedrijven te laten groeien en bloeien.'
  },
  categories: serviceCategories,
  processes: [
    {
      step: 1,
      title: 'Free Network Scan',
      titleNL: 'Gratis netwerk-scan',
      description: 'We visit for a free consultation. No obligations. We look at your current situation and perform a network scan to assess your current IT setup.',
      descriptionNL: 'We komen langs voor een gratis gesprek. Geen verplichtingen. We kijken naar je huidige situatie en maken een netwerk-scan om te zien wat voor vlees jullie in de kuip hebben.'
    },
    {
      step: 2,
      title: 'Personal Advice',
      titleNL: 'Persoonlijk advies',
      description: 'Prefer to take our advice to someone else? No problem! We charge 2 hours for the effort of creating the report and advice. If you agree to work with us, these costs are waived and we arrange everything.',
      descriptionNL: 'Ga je met dit advies liever naar een ander, geen probleem! Dan rekenen we 2 uur voor de moeite van het maken van dit rapport en het gemaakte advies. Als je akkoord gaat, vervallen deze kosten en regelen wij alles.'
    },
    {
      step: 3,
      title: 'Worry-Free Working',
      titleNL: 'Zorgeloos werken',
      description: 'From that moment we ensure everything works and stays safe and secure. For a fixed price per month. No surprises, no hassle.',
      descriptionNL: 'Vanaf dat moment zorgen wij dat alles werkt. Zorgen wij dat alles veilig is en blijft. Voor een vaste prijs per maand. Geen verrassingen, geen gedoe.'
    }
  ],
  pricing: {
    title: 'What does it cost?',
    titleNL: 'Wat kost het?',
    description: 'Everything included. No surprises.',
    descriptionNL: 'Alles inclusief. Geen verrassingen.',
    basePrice: 60,
    currency: 'EUR',
    features: [
      'Computer maintenance',
      'All updates',
      'Virus protection',
      'File backup',
      'Fast help',
      'No hidden costs'
    ],
    featuresNL: [
      'Computer onderhoud',
      'Alle updates',
      'Virusbeveiliging',
      'Backup van bestanden',
      'Snelle hulp',
      'Geen verborgen kosten'
    ]
  }
}

export const aboutPageData: AboutPageData = {
  hero: {
    title: 'IT Without Worries Since 2014',
    titleNL: 'IT zonder Zorgen sinds 2014',
    subtitle: 'From startup to scale-up: we are the technology partner that grows with you',
    subtitleNL: 'Van startup tot scale-up: wij zijn de technologiepartner die met je meegroeit'
  },
  story: {
    title: 'Our Story',
    titleNL: 'Ons Verhaal',
    content: 'Workflo started in 2014 with a simple mission: IT support that actually works. Founded by Florian de Haan, who was frustrated by the traditional way of working in the IT sector. We saw companies struggling with complex systems, unclear invoices and IT partners who caused more problems than they solved. We wanted to change that.',
    contentNL: 'Workflo begon in 2014 met een simpele missie: IT-ondersteuning die écht werkt. Opgericht door Florian de Haan, die gefrustreerd was door de traditionele manier van werken in de IT-sector. We zagen bedrijven worstelen met complexe systemen, onduidelijke facturen en IT-partners die meer problemen veroorzaakten dan oplosten. Daar wilden we verandering in brengen.'
  },
  values: companyInfo.values,
  timeline: [
    { year: '2014', event: 'Workflo founded by Florian de Haan in Amsterdam', eventNL: 'Workflo opgericht door Florian de Haan in Amsterdam' },
    { year: '2015', event: 'Microsoft Cloud Partner certification', eventNL: 'Microsoft Cloud Partner certificering' },
    { year: '2016', event: 'Ruckus and FortiNet reseller partnership', eventNL: 'Ruckus en FortiNet reseller partnerschap' },
    { year: '2017', event: 'Adobe Reseller certification achieved', eventNL: 'Adobe Reseller certificering behaald' },
    { year: '2018', event: 'Domain registrar services launched', eventNL: 'Domain registrar diensten gelanceerd' },
    { year: '2021', event: 'SBB internship company accreditation', eventNL: 'SBB stage bedrijf accreditatie' },
    { year: '2023', event: 'ZorgMail partner for healthcare sector', eventNL: 'ZorgMail partner voor zorgverlening sector' },
    { year: '2024', event: 'New Amsterdam office opened, Cisco and Meraki reseller', eventNL: 'Nieuw Amsterdam kantoor geopend, Cisco en Meraki reseller' }
  ],
  team: [
    {
      id: 'florian',
      name: 'Florian de Haan',
      title: 'Founder/System Administrator/Consultant/IT Support',
      titleNL: 'Oprichter/Systeembeheerder/Consultant/IT Support',
      bio: 'Ik ben Florian, de oprichter van Workflo. Ik ben een gedreven generalist en vind het heerlijk om met nieuwe dingen bezig te zijn en vooral de vertaalslag te maken van idee naar een concreet resultaat.',
      bioNL: 'Ik ben Florian, de oprichter van Workflo. Ik ben een gedreven generalist en vind het heerlijk om met nieuwe dingen bezig te zijn en vooral de vertaalslag te maken van idee naar een concreet resultaat.',
      photo: '/images/team/florian.jpg',
      certifications: ['Microsoft Cloud Partner', 'Business Management'],
      specialties: ['System Administration', 'Strategic Planning', 'Business Development', 'IT Consulting'],
      specialtiesNL: ['Systeembeheer', 'Strategische Planning', 'Business Development', 'IT Consultancy']
    },
    {
      id: 'samir',
      name: 'Samir Amanzou',
      title: 'System Administrator/Consultant/IT Support',
      titleNL: 'Systeembeheerder/Consultant/IT Support',
      bio: 'Ha, ik ben Samir, en werk inmiddels drie jaar bij Workflo. Ik ben een IT Engineer met 8 jaar ervaring, gespecialiseerd in systeembeheer en projectmanagement.',
      bioNL: 'Ha, ik ben Samir, en werk inmiddels drie jaar bij Workflo. Ik ben een IT Engineer met 8 jaar ervaring, gespecialiseerd in systeembeheer en projectmanagement.',
      photo: '/images/team/samir.jpg',
      certifications: ['IT Engineering', 'Project Management'],
      specialties: ['System Administration', 'Project Management', 'IT Support'],
      specialtiesNL: ['Systeembeheer', 'Projectmanagement', 'IT Support']
    },
    {
      id: 'nam',
      name: 'Nam-Hoon Boots',
      title: 'Senior System Administrator/Consultant/IT Support',
      titleNL: 'Senior Systeembeheerder/Consultant/IT Support',
      bio: 'Ha, ik ben Nam-Hoon, een IT-systeembeheerder met een grote passie voor elektronische apparatuur. Met maar liefst 25 jaar in het vak kun je mij gerust ervaren noemen.',
      bioNL: 'Ha, ik ben Nam-Hoon, een IT-systeembeheerder met een grote passie voor elektronische apparatuur. Met maar liefst 25 jaar in het vak kun je mij gerust ervaren noemen.',
      photo: '/images/team/nam.jpg',
      certifications: ['25 Years IT Experience', 'Electronics Specialist'],
      specialties: ['System Administration', 'Electronic Equipment', 'IT Support', 'Hardware'],
      specialtiesNL: ['Systeembeheer', 'Elektronische Apparatuur', 'IT Support', 'Hardware']
    },
    {
      id: 'marcello',
      name: 'Marcello Macknac',
      title: 'Junior Infrastructure Engineer/Consultant/IT Support',
      titleNL: 'Junior Infrastructuur Engineer/Consultant/IT Support',
      bio: 'Hey, ik ben Marcello, een Infrastructure Engineer die altijd wel bezig is met scripting, networking en engineering.',
      bioNL: 'Hey, ik ben Marcello, een Infrastructure Engineer die altijd wel bezig is met scripting, networking en engineering.',
      photo: '/images/team/marcello.jpg',
      certifications: ['Infrastructure Engineering', 'Networking'],
      specialties: ['Scripting', 'Networking', 'Engineering', 'Infrastructure'],
      specialtiesNL: ['Scripting', 'Networking', 'Engineering', 'Infrastructuur']
    }
  ],
  stats: [
    {
      value: '50+',
      label: 'Satisfied clients',
      labelNL: 'Tevreden klanten'
    },
    {
      value: '10+',
      label: 'Years experience',
      labelNL: 'Jaar ervaring'
    },
    {
      value: '99.9%',
      label: 'Uptime guarantee',
      labelNL: 'Uptime garantie'
    },
    {
      value: '24/7',
      label: 'Support available',
      labelNL: 'Support beschikbaar'
    }
  ]
}

export const contactPageData: ContactPageData = {
  hero: {
    title: 'Let\'s Talk About Your IT Challenges',
    titleNL: 'Bespreek je IT-uitdagingen met ons',
    subtitle: 'We are ready to solve your IT challenges',
    subtitleNL: 'We staan klaar om je IT-uitdagingen op te lossen'
  },
  location: companyInfo.location,
  hours: {
    weekdays: 'Monday - Friday: 8:00 - 18:00',
    weekdaysNL: 'Maandag - Vrijdag: 8:00 - 18:00',
    support: '24/7 Support for contract clients',
    supportNL: '24/7 Support voor contractklanten'
  },
  forms: {
    contact: hubspotForms.contact || {
      region: 'eu1',
      portalId: '139506119',
      formId: 'contact-form',
      name: 'Contact Form',
      purpose: 'Contact form for inquiries'
    },
    newsletter: hubspotForms.newsletter || {
      region: 'eu1', 
      portalId: '139506119',
      formId: 'newsletter-form',
      name: 'Newsletter Form',
      purpose: 'Newsletter signup form'
    }
  }
}

// FAQ Data
export const faqData: FAQ[] = [
  // General Questions
  {
    id: 'general-1',
    question: 'What services does Workflo provide?',
    questionNL: 'Welke diensten biedt Workflo?',
    answer: 'We provide comprehensive IT services including managed IT support, cloud solutions (Microsoft 365, Azure), cybersecurity, network infrastructure, and IT consultancy. Our goal is to be your complete IT partner.',
    answerNL: 'Wij bieden uitgebreide IT-diensten waaronder managed IT-ondersteuning, cloud-oplossingen (Microsoft 365, Azure), cybersecurity, netwerkinfrastructuur en IT-consultancy. Ons doel is om je complete IT-partner te zijn.',
    category: 'General',
    categoryNL: 'Algemeen',
    order: 1,
    featured: true
  },
  {
    id: 'general-2',
    question: 'How quickly can you respond to IT issues?',
    questionNL: 'Hoe snel kunnen jullie reageren op IT-problemen?',
    answer: 'We guarantee a 1-hour response time for all support requests during business hours. For critical issues, we often respond within minutes. Our 24/7 monitoring helps us prevent problems before they impact your business.',
    answerNL: 'Wij garanderen een responstijd van 1 uur voor alle support-verzoeken tijdens kantooruren. Voor kritieke problemen reageren we vaak binnen enkele minuten. Onze 24/7 monitoring helpt ons problemen te voorkomen voordat ze je bedrijf beïnvloeden.',
    category: 'General',
    categoryNL: 'Algemeen',
    order: 2,
    featured: true
  },
  {
    id: 'general-3',
    question: 'Do you work with small businesses?',
    questionNL: 'Werken jullie met kleine bedrijven?',
    answer: 'Yes, we specialize in serving small to medium-sized businesses (SMEs) in Amsterdam and surrounding areas. Our solutions are designed to be cost-effective and scalable for growing businesses.',
    answerNL: 'Ja, wij zijn gespecialiseerd in het bedienen van kleine tot middelgrote bedrijven (MKB) in Amsterdam en omgeving. Onze oplossingen zijn ontworpen om kosteneffectief en schaalbaar te zijn voor groeiende bedrijven.',
    category: 'General',
    categoryNL: 'Algemeen',
    order: 3,
    featured: false
  },
  
  // Technical Questions
  {
    id: 'technical-1',
    question: 'What happens if our server goes down?',
    questionNL: 'Wat gebeurt er als onze server uitvalt?',
    answer: 'Our 24/7 monitoring system typically detects server issues before they cause downtime. If a server does go down, we immediately begin recovery procedures and will have you back online as quickly as possible. We also maintain backup systems to minimize downtime.',
    answerNL: 'Ons 24/7 monitoringsysteem detecteert serverproblemen meestal voordat ze downtime veroorzaken. Als een server toch uitvalt, starten we onmiddellijk herstelprocedures en zorgen we dat je zo snel mogelijk weer online bent. We onderhouden ook back-upsystemen om downtime te minimaliseren.',
    category: 'Technical',
    categoryNL: 'Technisch',
    order: 1,
    featured: true
  },
  {
    id: 'technical-2',
    question: 'How secure is cloud storage?',
    questionNL: 'Hoe veilig is cloud-opslag?',
    answer: 'Cloud storage, when properly configured, is typically more secure than on-premise solutions. We use enterprise-grade security measures including encryption, multi-factor authentication, and regular security audits. All our cloud solutions are GDPR compliant.',
    answerNL: 'Cloud-opslag is, indien correct geconfigureerd, meestal veiliger dan on-premise oplossingen. We gebruiken enterprise-grade beveiligingsmaatregelen waaronder encryptie, multi-factor authenticatie en regelmatige security audits. Al onze cloud-oplossingen zijn GDPR-compliant.',
    category: 'Technical',
    categoryNL: 'Technisch',
    order: 2,
    featured: false
  },
  {
    id: 'technical-3',
    question: 'Can you help with Microsoft 365 migration?',
    questionNL: 'Kunnen jullie helpen met Microsoft 365 migratie?',
    answer: 'Absolutely! We are Microsoft Gold Partners and have extensive experience with Microsoft 365 migrations. We handle everything from planning and data migration to user training and ongoing support.',
    answerNL: 'Absoluut! We zijn Microsoft Gold Partners en hebben uitgebreide ervaring met Microsoft 365 migraties. We regelen alles van planning en datamigratie tot gebruikerstraining en doorlopende ondersteuning.',
    category: 'Technical',
    categoryNL: 'Technisch',
    order: 3,
    featured: false
  },

  // Pricing Questions
  {
    id: 'pricing-1',
    question: 'How much does IT support cost?',
    questionNL: 'Hoeveel kost IT-ondersteuning?',
    answer: 'Our managed IT services start at €60 per computer per month, which includes 24/7 monitoring, unlimited remote support, regular maintenance, security updates, and backup services. We offer transparent, fixed-price contracts with no hidden costs.',
    answerNL: 'Onze managed IT-diensten beginnen bij €60 per computer per maand, wat 24/7 monitoring, onbeperkte remote support, regulier onderhoud, beveiligingsupdates en back-upservices omvat. We bieden transparante contracten met vaste prijzen zonder verborgen kosten.',
    category: 'Pricing',
    categoryNL: 'Prijzen',
    order: 1,
    featured: true
  },
  {
    id: 'pricing-2',
    question: 'Are there any setup fees?',
    questionNL: 'Zijn er opstartkosten?',
    answer: 'Setup fees depend on the complexity of your current IT environment and the services required. We provide a detailed quote after our free consultation, so you know exactly what to expect with no surprises.',
    answerNL: 'Opstartkosten hangen af van de complexiteit van jouw huidige IT-omgeving en de benodigde diensten. We geven een gedetailleerde offerte na ons gratis gesprek, zodat je precies weet wat je kunt verwachten zonder verrassingen.',
    category: 'Pricing',
    categoryNL: 'Prijzen',
    order: 2,
    featured: false
  },
  {
    id: 'pricing-3',
    question: 'Can we get a custom quote?',
    questionNL: 'Kunnen we een offerte op maat krijgen?',
    answer: 'Yes! Every business is unique, and we tailor our solutions to your specific needs and budget. Contact us for a free consultation and custom quote based on your requirements.',
    answerNL: 'Ja! Elk bedrijf is uniek, en wij stemmen onze oplossingen af op jouw specifieke behoeften en budget. Neem contact met ons op voor een gratis gesprek en offerte op maat gebaseerd op jouw vereisten.',
    category: 'Pricing',
    categoryNL: 'Prijzen',
    order: 3,
    featured: false
  },

  // Support Questions
  {
    id: 'support-1',
    question: 'What are your support hours?',
    questionNL: 'Wat zijn jullie support-tijden?',
    answer: 'Our standard business hours are Monday-Friday 8:00-18:00. However, we provide 24/7 monitoring and emergency support for all managed service clients. Critical issues are handled immediately, regardless of the time.',
    answerNL: 'Onze standaard kantooruren zijn maandag-vrijdag 8:00-18:00. We bieden echter 24/7 monitoring en noodhulp voor alle managed service klanten. Kritieke problemen worden onmiddellijk behandeld, ongeacht het tijdstip.',
    category: 'Support',
    categoryNL: 'Ondersteuning',
    order: 1,
    featured: true
  },
  {
    id: 'support-2',
    question: 'Do you provide remote support?',
    questionNL: 'Bieden jullie remote support?',
    answer: 'Yes, most issues can be resolved remotely, which allows us to fix problems quickly and efficiently. When on-site support is needed, we schedule visits promptly. Remote support is included in all our service plans.',
    answerNL: 'Ja, de meeste problemen kunnen op afstand worden opgelost, waardoor we problemen snel en efficiënt kunnen oplossen. Wanneer ondersteuning ter plaatse nodig is, plannen we snel bezoeken in. Remote support is inbegrepen in al onze servicepakketten.',
    category: 'Support',
    categoryNL: 'Ondersteuning',
    order: 2,
    featured: false
  },
  {
    id: 'support-3',
    question: 'How do we contact support?',
    questionNL: 'Hoe nemen we contact op met support?',
    answer: 'You can contact our support team via phone, email, or our customer portal. We also provide a dedicated support app for quick issue reporting. All contact methods are available 24/7 for managed service clients.',
    answerNL: 'Je kunt contact opnemen met ons support-team via telefoon, e-mail of ons klantportaal. We bieden ook een speciale support-app voor snelle probleemmelding. Alle contactmethoden zijn 24/7 beschikbaar voor managed service klanten.',
    category: 'Support',
    categoryNL: 'Ondersteuning',
    order: 3,
    featured: false
  },

  // Security & Backup Questions
  {
    id: 'security-1',
    question: 'How do you protect our data from cyber threats?',
    questionNL: 'Hoe beschermen jullie onze data tegen cyberdreigingen?',
    answer: 'We implement multi-layered security including advanced firewalls, endpoint protection, email security, regular security patches, employee training, and 24/7 security monitoring. We also conduct regular security assessments and provide incident response planning.',
    answerNL: 'We implementeren meerlagige beveiliging waaronder geavanceerde firewalls, endpoint-bescherming, e-mailbeveiliging, regelmatige security patches, medewerkerstraining en 24/7 beveiligingsmonitoring. We voeren ook regelmatige security assessments uit en bieden incident response planning.',
    category: 'Security',
    categoryNL: 'Beveiliging',
    order: 1,
    featured: true
  },
  {
    id: 'security-2',
    question: 'What backup solutions do you offer?',
    questionNL: 'Welke backup-oplossingen bieden jullie?',
    answer: 'We provide automated daily backups to secure cloud locations with multiple restore points. Our backup solutions include local and cloud redundancy, automated testing, and disaster recovery planning. We guarantee data recovery within agreed RTOs.',
    answerNL: 'We bieden geautomatiseerde dagelijkse backups naar beveiligde cloud-locaties met meerdere herstelpunten. Onze backup-oplossingen omvatten lokale en cloud-redundantie, geautomatiseerde tests en disaster recovery planning. We garanderen dataherstel binnen afgesproken RTOs.',
    category: 'Security',
    categoryNL: 'Beveiliging',
    order: 2,
    featured: false
  },
  {
    id: 'security-3',
    question: 'Are you GDPR compliant?',
    questionNL: 'Zijn jullie GDPR-compliant?',
    answer: 'Yes, we are fully GDPR compliant and help our clients maintain compliance. We provide data processing agreements, regular compliance audits, privacy impact assessments, and guidance on data handling best practices.',
    answerNL: 'Ja, we zijn volledig GDPR-compliant en helpen onze klanten compliance te behouden. We bieden verwerkersovereenkomsten, regelmatige compliance audits, privacy impact assessments en begeleiding bij best practices voor dataverwerking.',
    category: 'Security',
    categoryNL: 'Beveiliging',
    order: 3,
    featured: false
  },

  // Migration & Setup Questions
  {
    id: 'migration-1',
    question: 'How long does a typical IT migration take?',
    questionNL: 'Hoe lang duurt een typische IT-migratie?',
    answer: 'Migration timelines depend on complexity but typically range from 1-4 weeks for most small businesses. We create detailed migration plans with minimal downtime, usually completed during evenings or weekends to avoid business disruption.',
    answerNL: 'Migratietijdlijnen hangen af van complexiteit maar variëren meestal van 1-4 weken voor de meeste kleine bedrijven. We maken gedetailleerde migratieplannen met minimale downtime, meestal voltooid tijdens avonden of weekends om bedrijfsverstoringen te voorkomen.',
    category: 'Migration',
    categoryNL: 'Migratie',
    order: 1,
    featured: false
  },
  {
    id: 'migration-2',
    question: 'Do you provide training after implementation?',
    questionNL: 'Bieden jullie training na implementatie?',
    answer: 'Absolutely! We provide comprehensive user training sessions, documentation, video tutorials, and ongoing support to ensure your team can effectively use new systems. Training is tailored to your specific setup and user needs.',
    answerNL: 'Absoluut! We bieden uitgebreide gebruikerstrainingen, documentatie, video-tutorials en doorlopende ondersteuning om ervoor te zorgen dat je team nieuwe systemen effectief kan gebruiken. Training wordt afgestemd op jouw specifieke setup en gebruikersbehoeften.',
    category: 'Migration',
    categoryNL: 'Migratie',
    order: 2,
    featured: false
  },
  {
    id: 'migration-3',
    question: 'What if we have custom software or legacy systems?',
    questionNL: 'Wat als we custom software of verouderde systemen hebben?',
    answer: 'We specialize in working with custom and legacy systems. Our team assesses compatibility, creates integration solutions, and provides modernization strategies while maintaining business continuity throughout the process.',
    answerNL: 'We zijn gespecialiseerd in het werken met custom en verouderde systemen. Ons team beoordeelt compatibiliteit, creëert integratieoplossingen en biedt moderniseringsstrategieën terwijl de bedrijfscontinuïteit tijdens het proces behouden blijft.',
    category: 'Migration',
    categoryNL: 'Migratie',
    order: 3,
    featured: false
  },

  // Hardware & Infrastructure
  {
    id: 'hardware-1',
    question: 'Do you provide computer hardware?',
    questionNL: 'Leveren jullie computerhardware?',
    answer: 'Yes, we offer Hardware-as-a-Service with latest business computers, servers, and networking equipment. This includes procurement, setup, maintenance, and replacement under flexible leasing arrangements.',
    answerNL: 'Ja, we bieden Hardware-as-a-Service met de nieuwste business computers, servers en netwerkapparatuur. Dit omvat inkoop, setup, onderhoud en vervanging onder flexibele leasingovereenkomsten.',
    category: 'Hardware',
    categoryNL: 'Hardware',
    order: 1,
    featured: false
  },
  {
    id: 'hardware-2',
    question: 'What happens when hardware fails?',
    questionNL: 'Wat gebeurt er als hardware kapot gaat?',
    answer: 'We provide rapid hardware replacement with next-business-day delivery for critical components. Our monitoring systems alert us to potential failures before they occur, and we maintain spare equipment for immediate replacement.',
    answerNL: 'We bieden snelle hardwarevervanging met levering op de volgende werkdag voor kritieke componenten. Onze monitoringsystemen waarschuwen ons voor potentiële storingen voordat ze optreden, en we houden reserveapparatuur aan voor directe vervanging.',
    category: 'Hardware',
    categoryNL: 'Hardware',
    order: 2,
    featured: false
  },
  {
    id: 'hardware-3',
    question: 'Can you help with network infrastructure?',
    questionNL: 'Kunnen jullie helpen met netwerkinfrastructuur?',
    answer: 'Yes, we design, implement, and manage complete network infrastructures including WiFi, switches, routers, and security appliances. We ensure optimal performance, security, and scalability for your business needs.',
    answerNL: 'Ja, we ontwerpen, implementeren en beheren complete netwerkinfrastructuren inclusief WiFi, switches, routers en beveiligingsapparatuur. We zorgen voor optimale prestaties, beveiliging en schaalbaarheid voor jouw bedrijfsbehoeften.',
    category: 'Hardware',
    categoryNL: 'Hardware',
    order: 3,
    featured: false
  },

  // Cloud & Microsoft 365
  {
    id: 'cloud-1',
    question: 'What are the benefits of moving to the cloud?',
    questionNL: 'Wat zijn de voordelen van overstappen naar de cloud?',
    answer: 'Cloud solutions offer improved accessibility, automatic backups, enhanced security, lower maintenance costs, better collaboration tools, and easier scaling. You can work from anywhere while we handle the technical infrastructure.',
    answerNL: 'Cloud-oplossingen bieden verbeterde toegankelijkheid, automatische backups, verbeterde beveiliging, lagere onderhoudskosten, betere samenwerkingstools en eenvoudiger opschaling. Je kunt overal werken terwijl wij de technische infrastructuur afhandelen.',
    category: 'Cloud',
    categoryNL: 'Cloud',
    order: 1,
    featured: true
  },
  {
    id: 'cloud-2',
    question: 'Is Microsoft 365 suitable for small businesses?',
    questionNL: 'Is Microsoft 365 geschikt voor kleine bedrijven?',
    answer: 'Absolutely! Microsoft 365 is perfect for small businesses, offering professional email, document collaboration, video conferencing, and cloud storage at an affordable price. We help you choose the right plan and set it up correctly.',
    answerNL: 'Absoluut! Microsoft 365 is perfect voor kleine bedrijven en biedt professionele e-mail, documentsamenwerking, videoconferenties en cloud-opslag tegen een betaalbare prijs. We helpen je het juiste plan te kiezen en correct in te stellen.',
    category: 'Cloud',
    categoryNL: 'Cloud',
    order: 2,
    featured: false
  },
  {
    id: 'cloud-3',
    question: 'What about internet connectivity for cloud services?',
    questionNL: 'Hoe zit het met internetconnectiviteit voor cloud-diensten?',
    answer: 'Reliable internet is crucial for cloud services. We assess your connectivity needs, recommend appropriate bandwidth, and can arrange redundant internet connections to ensure uninterrupted access to your cloud services.',
    answerNL: 'Betrouwbaar internet is cruciaal voor cloud-diensten. We beoordelen je connectiviteitsbehoeften, adviseren geschikte bandbreedte en kunnen redundante internetverbindingen regelen om ononderbroken toegang tot jouw cloud-diensten te garanderen.',
    category: 'Cloud',
    categoryNL: 'Cloud',
    order: 3,
    featured: false
  },

  // Service Contracts & Agreements
  {
    id: 'contracts-1',
    question: 'What is included in your managed IT contracts?',
    questionNL: 'Wat is inbegrepen in jullie managed IT-contracten?',
    answer: 'Our contracts include 24/7 monitoring, unlimited remote support, regular maintenance, security updates, backup services, priority response times, and monthly reporting. Everything is covered under one predictable monthly fee.',
    answerNL: 'Onze contracten omvatten 24/7 monitoring, onbeperkte remote support, regulier onderhoud, beveiligingsupdates, backup-diensten, prioritaire responstijden en maandelijkse rapportage. Alles wordt gedekt onder één voorspelbare maandelijkse vergoeding.',
    category: 'Contracts',
    categoryNL: 'Contracten',
    order: 1,
    featured: false
  },
  {
    id: 'contracts-2',
    question: 'Can we cancel our contract anytime?',
    questionNL: 'Kunnen we ons contract altijd opzeggen?',
    answer: 'We offer flexible contract terms with standard 30-60 day notice periods. While we prefer long-term partnerships, we understand business needs change. We focus on providing such good service that you\'ll want to stay with us.',
    answerNL: 'We bieden flexibele contractvoorwaarden met standaard opzegtermijnen van 30-60 dagen. Hoewel we voorkeur geven aan langetermijnpartnerschappen, begrijpen we dat bedrijfsbehoeften veranderen. We richten ons op het leveren van zo\'n goede service dat je bij ons wilt blijven.',
    category: 'Contracts',
    categoryNL: 'Contracten',
    order: 2,
    featured: false
  },
  {
    id: 'contracts-3',
    question: 'Do you offer Service Level Agreements (SLAs)?',
    questionNL: 'Bieden jullie Service Level Agreements (SLAs)?',
    answer: 'Yes, all our managed service contracts include clear SLAs with guaranteed response times, uptime targets, and resolution timeframes. We provide monthly reports showing our performance against these commitments.',
    answerNL: 'Ja, al onze managed service contracten bevatten duidelijke SLAs met gegarandeerde responstijden, uptime-doelen en oplossingstermijnen. We bieden maandelijkse rapportages die onze prestaties tegen deze commitments tonen.',
    category: 'Contracts',
    categoryNL: 'Contracten',
    order: 3,
    featured: false
  }
]