export interface ServiceFeature {
  title: string;
  description: string;
  included: boolean;
}

export interface ServiceTier {
  name: string;
  price: number;
  features?: string[];
}

export interface ServiceAddon {
  available: boolean;
  price: number;
  description: string;
}

export interface ServicePricing {
  type: 'per_user' | 'fixed' | 'custom' | 'included_in_msp' | 'tiered' | 'addon';
  basePrice?: number;
  remote?: number;
  onsite?: number;
  setup?: number;
  minimum?: number;
  // For included_in_msp type
  includedIn?: string[];
  mspMinimum?: number;
  message?: string;
  standaloneNotAvailable?: boolean;
  addon?: ServiceAddon;
  // For tiered pricing (like M365)
  tiers?: ServiceTier[];
  note?: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  icon: string;
  features: ServiceFeature[];
  benefits: string[];
  pricing: ServicePricing;
  faqs: ServiceFAQ[];
  popular?: boolean;
  category: 'infrastructure' | 'software' | 'security' | 'communication' | 'hardware';
  targetAudience: string[];
  keyPoints: string[];
}

export const servicesData: Service[] = [
  {
    id: 'managed-it',
    slug: 'managed-it',
    title: 'Managed IT',
    subtitle: 'Je IT volledig uit handen',
    description: 'Wij zorgen voor al je IT zodat jij je kunt richten op je bedrijf. Van servers tot laptops, van updates tot beveiliging - alles geregeld.',
    shortDescription: 'Volledige IT-ondersteuning zonder zorgen',
    icon: '🔧',
    category: 'infrastructure',
    targetAudience: ['MKB', 'Startups', 'Groeiende bedrijven'],
    keyPoints: [
      'Geen eigen IT-personeel nodig',
      'Altijd up-to-date systemen',
      'Proactieve monitoring',
      'Vast maandbedrag'
    ],
    features: [
      {
        title: 'Proactieve monitoring',
        description: 'We houden 24/7 je systemen in de gaten',
        included: true
      },
      {
        title: 'Updates & patches',
        description: 'Automatische updates voor beveiliging en functionaliteit',
        included: true
      },
      {
        title: 'Helpdesk support',
        description: 'Nederlandse helpdesk voor al je vragen',
        included: true
      },
      {
        title: 'Backup beheer',
        description: 'Dagelijkse backups met hersteltests',
        included: true
      },
      {
        title: 'Security management',
        description: 'Antivirus, firewall en beveiligingsbeleid',
        included: true
      },
      {
        title: 'Asset management',
        description: 'Overzicht van al je hardware en software',
        included: true
      }
    ],
    benefits: [
      'Lagere IT-kosten dan eigen personeel',
      'Expertise van heel IT-team beschikbaar',
      'Minder uitval en problemen',
      'Meer tijd voor je kernactiviteiten'
    ],
    pricing: {
      type: 'per_user',
      remote: 60,
      onsite: 90,
      setup: 150,
      minimum: 5
    },
    faqs: [
      {
        question: 'Wat is het verschil tussen remote en onsite support?',
        answer: 'Remote support betekent dat we op afstand helpen via internet. Onsite support betekent dat we bij je langskomen. De meeste problemen lossen we remote op.'
      },
      {
        question: 'Hoe snel krijg ik hulp?',
        answer: 'Voor urgente problemen binnen 1 uur respons. Voor normale vragen binnen 4 uur op werkdagen.'
      },
      {
        question: 'Zit er een minimum aantal gebruikers aan?',
        answer: 'Ja, minimaal 5 gebruikers. Voor kleinere bedrijven hebben we andere oplossingen.'
      },
      {
        question: 'Kan ik opzeggen?',
        answer: 'Ja, met 1 maand opzegtermijn. We geloven in tevredenheid, niet in dwang.'
      }
    ],
    popular: true
  },
  {
    id: 'cloud',
    slug: 'cloud',
    title: 'Cloud Services',
    subtitle: 'Altijd en overal bij je bestanden',
    description: 'Moderne cloud-oplossingen zodat je vanaf elke plek kunt werken. Veilig, betrouwbaar en altijd toegankelijk.',
    shortDescription: 'Flexibel werken met veilige cloud-oplossingen',
    icon: '☁️',
    category: 'infrastructure',
    targetAudience: ['Moderne bedrijven', 'Remote teams', 'Groeiende organisaties'],
    keyPoints: [
      'Overal toegang tot je bestanden',
      'Automatische synchronisatie',
      'Schaalbaar naar behoefte',
      'Enterprise-grade beveiliging'
    ],
    features: [
      {
        title: 'File sync & share',
        description: 'Bestanden altijd up-to-date op alle apparaten',
        included: true
      },
      {
        title: 'Collaboration tools',
        description: 'Samen werken aan documenten in real-time',
        included: true
      },
      {
        title: 'Version control',
        description: 'Automatische versiebeheersing van documenten',
        included: true
      },
      {
        title: 'Access management',
        description: 'Bepaal wie toegang heeft tot welke bestanden',
        included: true
      },
      {
        title: 'Backup & recovery',
        description: 'Automatische backup met snelle hersteloptie',
        included: true
      },
      {
        title: 'Mobile apps',
        description: 'Toegang via smartphone en tablet',
        included: true
      }
    ],
    benefits: [
      'Flexibel werken vanaf elke locatie',
      'Lagere hardware-kosten',
      'Automatische updates en onderhoud',
      'Betere samenwerking tussen teams'
    ],
    pricing: {
      type: 'per_user',
      basePrice: 25,
      setup: 100
    },
    faqs: [
      {
        question: 'Waar worden mijn bestanden opgeslagen?',
        answer: 'In beveiligde datacenters binnen Europa, conform AVG-wetgeving.'
      },
      {
        question: 'Kan ik mijn huidige bestanden overzetten?',
        answer: 'Ja, wij helpen bij de migratie van je bestaande bestanden zonder dataverlies.'
      },
      {
        question: 'Hoeveel opslagruimte krijg ik?',
        answer: 'Standaard 1TB per gebruiker, uitbreidbaar naar behoefte.'
      },
      {
        question: 'Werkt het ook offline?',
        answer: 'Ja, belangrijke bestanden kun je offline beschikbaar maken op je apparaten.'
      }
    ]
  },
  {
    id: 'cybersecurity',
    slug: 'cybersecurity',
    title: 'Cybersecurity',
    subtitle: 'Bescherming tegen hackers',
    description: 'Complete beveiliging tegen cybercriminelen. Van firewalls tot awareness training - wij beschermen jouw bedrijf.',
    shortDescription: 'Complete bescherming tegen cyberdreigingen',
    icon: '🔒',
    category: 'security',
    targetAudience: ['Alle bedrijven', 'Gevoelige sectoren', 'Compliance-organisaties'],
    keyPoints: [
      'Meerlaagse beveiliging',
      '24/7 monitoring',
      'Incident response',
      'Awareness training'
    ],
    features: [
      {
        title: 'Firewall management',
        description: 'Geavanceerde firewall-configuratie en monitoring',
        included: true
      },
      {
        title: 'Antivirus & anti-malware',
        description: 'Enterprise antivirus op alle apparaten',
        included: true
      },
      {
        title: 'Email security',
        description: 'Bescherming tegen phishing en spam',
        included: true
      },
      {
        title: 'Security monitoring',
        description: '24/7 monitoring van verdachte activiteiten',
        included: true
      },
      {
        title: 'Vulnerability scanning',
        description: 'Regelmatige scan op beveiligingslekken',
        included: true
      },
      {
        title: 'Security awareness',
        description: 'Training voor medewerkers over cyberrisicos',
        included: true
      }
    ],
    benefits: [
      'Bescherming tegen financiële schade',
      'Voorkoming van data-lekken',
      'Compliance met wetgeving (AVG)',
      'Vertrouwen van klanten behouden'
    ],
    pricing: {
      type: 'included_in_msp',
      includedIn: ['remote', 'enterprise'],
      mspMinimum: 60,
      message: 'Inbegrepen in alle MSP pakketten',
      standaloneNotAvailable: true
    },
    faqs: [
      {
        question: 'Hoe vaak worden er cyberaanvallen gedaan?',
        answer: 'Elke 39 seconden vindt er een cyberaanval plaats. MKB-bedrijven zijn populaire doelwitten.'
      },
      {
        question: 'Wat kost een cyberaanval gemiddeld?',
        answer: 'Voor MKB-bedrijven gemiddeld €25.000 tot €50.000 aan directe kosten en imagoschade.'
      },
      {
        question: 'Ben ik als klein bedrijf ook een doelwit?',
        answer: 'Ja, juist kleinere bedrijven zijn populaire doelwitten omdat zij vaak minder goed beveiligd zijn.'
      },
      {
        question: 'Hoe train je mijn medewerkers?',
        answer: 'Via online modules, simulatie phishing-mails en praktische workshops.'
      }
    ]
  },
  {
    id: 'microsoft-365',
    slug: 'microsoft-365',
    title: 'Microsoft 365',
    subtitle: 'Microsoft zonder gedoe',
    description: 'Microsoft 365 volledig geregeld. Van installatie tot ondersteuning - wij zorgen dat alles werkt zoals het hoort.',
    shortDescription: 'Complete Microsoft 365 beheer en ondersteuning',
    icon: '📊',
    category: 'software',
    targetAudience: ['Kantoororganisaties', 'Teams die samenwerken', 'Moderne bedrijven'],
    keyPoints: [
      'Volledige installatie en setup',
      'Gebruikersbeheer en licenties',
      'Training en ondersteuning',
      'Security en compliance'
    ],
    features: [
      {
        title: 'Tenant beheer',
        description: 'Complete setup en beheer van je Microsoft 365 omgeving',
        included: true
      },
      {
        title: 'Gebruikersbeheer',
        description: 'Aanmaken, wijzigen en verwijderen van gebruikers',
        included: true
      },
      {
        title: 'Licentie optimalisatie',
        description: 'Juiste licenties voor elke gebruiker, kostenbesparing',
        included: true
      },
      {
        title: 'Security configuratie',
        description: 'Multi-factor authentication en beveiligingsbeleid',
        included: true
      },
      {
        title: 'Migration services',
        description: 'Overstap van oude email-systemen naar Office 365',
        included: true
      },
      {
        title: 'Gebruikersondersteuning',
        description: 'Helpdesk voor alle Office 365 vragen',
        included: true
      }
    ],
    benefits: [
      'Altijd nieuwste versie van Office',
      'Samenwerken vanaf elke locatie',
      'Professionele email met eigen domein',
      'Geïntegreerde videobellen (Teams)'
    ],
    pricing: {
      type: 'tiered',
      tiers: [
        { name: 'Business Basic', price: 6.90, features: ['Web apps', 'Email', '1TB OneDrive'] },
        { name: 'Business Standard', price: 14.30, features: ['Desktop apps', 'Email', '1TB OneDrive'] },
        { name: 'Business Premium', price: 25.30, features: ['Advanced security', 'Device management'] }
      ],
      setup: 50,
      note: 'Microsoft licenties + Workflo setup & support'
    },
    faqs: [
      {
        question: 'Welke Office-versie krijg ik?',
        answer: 'Altijd de nieuwste versie van Word, Excel, PowerPoint, Outlook en Teams.'
      },
      {
        question: 'Kan ik mijn huidige email behouden?',
        answer: 'Ja, we migreren al je bestaande emails en contacten naar Office 365.'
      },
      {
        question: 'Hoeveel email-opslag krijg ik?',
        answer: 'Standaard 50GB per gebruiker, uitbreidbaar naar 100GB.'
      },
      {
        question: 'Werkt het ook op Mac en telefoon?',
        answer: 'Ja, Office 365 werkt op Windows, Mac, iPhone, Android en in de browser.'
      }
    ]
  },
  {
    id: 'backup-disaster-recovery',
    slug: 'backup-disaster-recovery',
    title: 'Backup & Disaster Recovery',
    subtitle: 'Je data altijd veilig',
    description: 'Automatische backups en snelle recovery bij problemen. Want je bedrijfsdata is te belangrijk om te verliezen.',
    shortDescription: 'Professionele backup-oplossingen met snelle recovery',
    icon: '💾',
    category: 'infrastructure',
    targetAudience: ['Alle bedrijven', 'Data-intensieve organisaties', 'Compliance sectoren'],
    keyPoints: [
      'Automatische dagelijkse backups',
      'Snelle herstel bij problemen',
      'Meerdere locaties voor veiligheid',
      'Reguliere herstel-tests'
    ],
    features: [
      {
        title: 'Automated backup',
        description: 'Dagelijkse automatische backup van al je data',
        included: true
      },
      {
        title: 'Multiple locations',
        description: 'Backups op meerdere geografische locaties',
        included: true
      },
      {
        title: 'Point-in-time recovery',
        description: 'Herstel data van elk gewenst moment',
        included: true
      },
      {
        title: 'Disaster recovery',
        description: 'Snel herstel van complete systemen bij calamiteit',
        included: true
      },
      {
        title: 'Recovery testing',
        description: 'Reguliere test of backups daadwerkelijk werken',
        included: true
      },
      {
        title: 'Compliance reporting',
        description: 'Rapportages voor compliance en audits',
        included: true
      }
    ],
    benefits: [
      'Geen dataverlies bij problemen',
      'Snel weer operationeel na incident',
      'Voldoet aan compliance-eisen',
      'Gemoedsrust voor management'
    ],
    pricing: {
      type: 'included_in_msp',
      includedIn: ['remote', 'enterprise'],
      addon: {
        available: true,
        price: 10,
        description: 'Extra capaciteit bovenop MSP backup'
      },
      message: 'Basisbackup inbegrepen in MSP pakketten'
    },
    faqs: [
      {
        question: 'Hoe lang duurt het om data terug te zetten?',
        answer: 'Enkele bestanden binnen minuten, complete systemen binnen enkele uren.'
      },
      {
        question: 'Hoe ver terug kan ik data herstellen?',
        answer: 'Standaard 30 dagen, optioneel tot 1 jaar of langer voor compliance.'
      },
      {
        question: 'Wat gebeurt er bij een grote ramp?',
        answer: 'We hebben disaster recovery-procedures om je systemen snel elders operationeel te krijgen.'
      },
      {
        question: 'Wordt er getest of backups werken?',
        answer: 'Ja, we testen maandelijks willekeurige backups om te zorgen dat herstel mogelijk is.'
      }
    ]
  },
  {
    id: 'voip-telefonie',
    slug: 'voip-telefonie',
    title: 'VoIP Telefonie',
    subtitle: 'Bellen via internet',
    description: 'Moderne telefonie via internet. Goedkoper bellen, meer mogelijkheden en werkt op alle apparaten.',
    shortDescription: 'Moderne internettelefonie met professionele functies',
    icon: '📞',
    category: 'communication',
    targetAudience: ['Kantoren', 'Remote teams', 'Customer service'],
    keyPoints: [
      'Goedkoper dan vaste lijn',
      'Werkt op laptop, telefoon en tablet',
      'Professionele functies',
      'Nederlandse nummers'
    ],
    features: [
      {
        title: 'Virtual PBX',
        description: 'Professionele telefooncentrale in de cloud',
        included: true
      },
      {
        title: 'Auto attendant',
        description: 'Automatische beantwoording en doorschakeling',
        included: true
      },
      {
        title: 'Call forwarding',
        description: 'Gesprekken doorschakelen naar mobiel of thuis',
        included: true
      },
      {
        title: 'Voicemail to email',
        description: 'Voicemails automatisch naar je email',
        included: true
      },
      {
        title: 'Conference calling',
        description: 'Telefonisch vergaderen met meerdere personen',
        included: true
      },
      {
        title: 'Mobile app',
        description: 'Bellen via app met bedrijfsnummer',
        included: true
      }
    ],
    benefits: [
      'Tot 50% kostenbesparing op belkosten',
      'Flexibel werken - overal bereikbaar',
      'Professionele uitstraling',
      'Geïntegreerd met andere systemen'
    ],
    pricing: {
      type: 'per_user',
      basePrice: 15,
      setup: 50
    },
    faqs: [
      {
        question: 'Kan ik mijn huidige telefoonnummer behouden?',
        answer: 'Ja, we kunnen je bestaande bedrijfsnummer overzetten naar onze dienst.'
      },
      {
        question: 'Wat heb ik nodig om te kunnen bellen?',
        answer: 'Alleen een internetverbinding. Je kunt bellen via computer, app of speciale VoIP-telefoon.'
      },
      {
        question: 'Hoe is de geluidskwaliteit?',
        answer: 'Door HD-audio vaak beter dan traditionele telefonie, mits je goede internetverbinding hebt.'
      },
      {
        question: 'Werkt het ook bij internetstoring?',
        answer: 'Gesprekken worden automatisch doorgeschakeld naar je mobiele telefoon.'
      }
    ]
  },
  {
    id: 'hardware-as-a-service',
    slug: 'hardware-as-a-service',
    title: 'Hardware as a Service',
    subtitle: 'Laptops en computers huren',
    description: 'Moderne hardware huren in plaats van kopen. Altijd de nieuwste apparaten, inclusief onderhoud en vervanging.',
    shortDescription: 'Hardware huren inclusief onderhoud en updates',
    icon: '💻',
    category: 'hardware',
    targetAudience: ['Startups', 'Groeiende bedrijven', 'Project-based organisaties'],
    keyPoints: [
      'Geen grote investeringen vooraf',
      'Altijd moderne hardware',
      'Inclusief onderhoud en support',
      'Flexibel op- en afschalen'
    ],
    features: [
      {
        title: 'Device management',
        description: 'Complete setup en configuratie van alle apparaten',
        included: true
      },
      {
        title: 'Maintenance & support',
        description: 'Onderhoud, reparaties en technische ondersteuning',
        included: true
      },
      {
        title: 'Insurance coverage',
        description: 'Verzekering tegen diefstal en schade inbegrepen',
        included: true
      },
      {
        title: 'Regular refresh',
        description: 'Om de 3-4 jaar automatische vervanging door nieuwer model',
        included: true
      },
      {
        title: 'Asset tracking',
        description: 'Overzicht van alle apparaten en hun status',
        included: true
      },
      {
        title: 'Quick replacement',
        description: 'Snelle vervanging bij defect of diefstal',
        included: true
      }
    ],
    benefits: [
      'Voorspelbare maandelijkse kosten',
      'Geen zorgen over onderhoud',
      'Altijd toegang tot nieuwste technologie',
      'Betere cashflow voor bedrijf'
    ],
    pricing: {
      type: 'per_user',
      basePrice: 65,
      setup: 25
    },
    faqs: [
      {
        question: 'Welke apparaten kan ik huren?',
        answer: 'Laptops, desktops, tablets, monitors en andere zakelijke hardware van topmerken.'
      },
      {
        question: 'Wat gebeurt er bij schade?',
        answer: 'Schade door normaal gebruik is gedekt. Bij opzet betaal je een eigen risico van €150.'
      },
      {
        question: 'Kan ik de apparaten later kopen?',
        answer: 'Ja, na de huurperiode kun je apparaten tegen restwaarde overnemen.'
      },
      {
        question: 'Hoe snel krijg ik nieuwe apparaten?',
        answer: 'Standaard hardware binnen 3 werkdagen, speciale configuraties binnen 5 werkdagen.'
      }
    ]
  }
];

// Helper functions
export const getServiceBySlug = (slug: string): Service | undefined => {
  return servicesData.find(service => service.slug === slug);
};

export const getServicesByCategory = (category: string): Service[] => {
  return servicesData.filter(service => service.category === category);
};

export const getPopularServices = (): Service[] => {
  return servicesData.filter(service => service.popular);
};

export const calculateServicePrice = (
  service: Service, 
  users: number, 
  supportType: 'remote' | 'onsite' = 'remote'
): {
  monthly: number;
  setup: number;
  total: number;
  discount: number;
} => {
  let monthlyPrice = 0;
  const setupPrice = service.pricing.setup || 0;
  
  // Volume discounts
  const getVolumeDiscount = (users: number): number => {
    if (users >= 50) return 0.20; // 20% discount
    if (users >= 25) return 0.15; // 15% discount
    if (users >= 10) return 0.10; // 10% discount
    if (users >= 5) return 0.05;  // 5% discount
    return 0;
  };

  if (service.pricing.type === 'per_user') {
    if (service.id === 'managed-it') {
      const rate = supportType === 'onsite' ? service.pricing.onsite! : service.pricing.remote!;
      monthlyPrice = users * rate;
    } else {
      monthlyPrice = users * (service.pricing.basePrice || 0);
    }
  } else if (service.pricing.type === 'fixed') {
    monthlyPrice = service.pricing.basePrice || 0;
  }

  const discount = getVolumeDiscount(users);
  const discountAmount = monthlyPrice * discount;
  const finalMonthlyPrice = monthlyPrice - discountAmount;

  return {
    monthly: Math.round(finalMonthlyPrice * 100) / 100,
    setup: setupPrice,
    total: Math.round((finalMonthlyPrice + setupPrice) * 100) / 100,
    discount: Math.round(discountAmount * 100) / 100
  };
};