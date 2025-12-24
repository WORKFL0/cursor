export interface CaseStudy {
  id: string
  clientName: string
  clientLogo: string
  industry: string
  industryNL: string
  challenge: string
  challengeNL: string
  solution: string
  solutionNL: string
  results: string[]
  resultsNL: string[]
  technologies: string[]
  testimonial?: {
    quote: string
    quoteNL: string
    author: string
    role: string
    roleNL: string
  }
  duration: string
  durationNL: string
  teamSize: number
  featured?: boolean
  tags: string[]
  tagsNL: string[]
  completedDate: string
  projectType: string
  projectTypeNL: string
}

export const industries = [
  { value: 'all', label: 'All Industries', labelNL: 'Alle Sectoren' },
  { value: 'startup', label: 'Startups', labelNL: 'Startups' },
  { value: 'finance', label: 'Financial Services', labelNL: 'Financiële Diensten' },
  { value: 'healthcare', label: 'Healthcare', labelNL: 'Zorgverlening' },
  { value: 'legal', label: 'Legal Services', labelNL: 'Juridische Diensten' },
  { value: 'retail', label: 'Retail', labelNL: 'Retail' },
  { value: 'education', label: 'Education', labelNL: 'Onderwijs' },
  { value: 'creative', label: 'Creative Agency', labelNL: 'Creatief Bureau' },
  { value: 'manufacturing', label: 'Manufacturing', labelNL: 'Productie' },
  { value: 'nonprofit', label: 'Non-profit', labelNL: 'Non-profit' },
  { value: 'architecture', label: 'Architecture', labelNL: 'Architectuur' }
]

export const serviceTypes = [
  { value: 'all', label: 'All Services', labelNL: 'Alle Diensten' },
  { value: 'managed-it', label: 'Managed IT', labelNL: 'Managed IT' },
  { value: 'cloud-migration', label: 'Cloud Migration', labelNL: 'Cloud Migratie' },
  { value: 'cybersecurity', label: 'Cybersecurity', labelNL: 'Cyberbeveiliging' },
  { value: 'backup-recovery', label: 'Backup & Recovery', labelNL: 'Backup & Herstel' },
  { value: 'network-setup', label: 'Network Setup', labelNL: 'Netwerk Installatie' },
  { value: 'voip', label: 'VoIP Implementation', labelNL: 'VoIP Implementatie' },
  { value: 'microsoft-365', label: 'Microsoft 365', labelNL: 'Microsoft 365' },
  { value: 'it-support', label: 'IT Support', labelNL: 'IT Ondersteuning' }
]

export const caseStudies: CaseStudy[] = [
  {
    id: '1',
    clientName: 'Schulte & Lestraden',
    clientLogo: '/images/logos/schulte-lestraden.png',
    industry: 'professional-services',
    industryNL: 'professionele diensten',
    challenge: 'Schulte & Lestraden had behoefte aan professionele 2de lijns IT-support om hun groeiende praktijk te ondersteunen. Hun bestaande IT-setup kon de complexe vereisten van hun moderne dienstverlening niet meer aan.',
    challengeNL: 'Schulte & Lestraden had behoefte aan professionele 2de lijns IT-support om hun groeiende praktijk te ondersteunen. Hun bestaande IT-setup kon de complexe vereisten van hun moderne dienstverlening niet meer aan.',
    solution: 'Workflo implementeerde een complete managed IT-oplossing met focus op betrouwbaarheid, beveiliging en compliance. We zorgden voor 24/7 monitoring, proactief onderhoud en directe support wanneer nodig.',
    solutionNL: 'Workflo implementeerde een complete managed IT-oplossing met focus op betrouwbaarheid, beveiliging en compliance. We zorgden voor 24/7 monitoring, proactief onderhoud en directe support wanneer nodig.',
    results: [
      'Volledige 2de lijns IT-support geïmplementeerd',
      '99.9% uptime bereikt',
      'Verbeterde compliance en beveiliging',
      'Snellere response tijden op IT-issues',
      'Proactieve preventie van problemen'
    ],
    resultsNL: [
      'Volledige 2de lijns IT-support geïmplementeerd',
      '99.9% uptime bereikt',
      'Verbeterde compliance en beveiliging',
      'Snellere response tijden op IT-issues',
      'Proactieve preventie van problemen'
    ],
    technologies: ['Microsoft 365', 'Azure Cloud', 'Advanced Security', 'Document Management', 'VPN Solutions'],
    testimonial: {
      quote: 'Schulte & Lestraden benaderde ons voor professionele 2de lijns support. Hun vertrouwen in onze expertise heeft geleid tot een succesvolle langdurige samenwerking.',
      quoteNL: 'Schulte & Lestraden benaderde ons voor professionele 2de lijns support. Hun vertrouwen in onze expertise heeft geleid tot een succesvolle langdurige samenwerking.',
      author: 'Managing Partner',
      role: 'Managing Partner',
      roleNL: 'Managing Partner'
    },
    duration: '8 weeks',
    durationNL: '8 weken',
    teamSize: 4,
    featured: true,
    tags: ['managed-it', 'it-support', 'cybersecurity'],
    tagsNL: ['managed-it', 'it-ondersteuning', 'cyberbeveiliging'],
    completedDate: '2024-06-15',
    projectType: 'Managed IT Services',
    projectTypeNL: 'Beheerde IT Diensten'
  },
  {
    id: '2',
    clientName: 'Duwtje',
    clientLogo: '/images/logos/duwtje.png',
    industry: 'research',
    industryNL: 'onderzoek',
    challenge: 'Duwtje, een wetenschappelijk gedragsbureau, had behoefte aan een gespecialiseerde IT-partner die hun onderzoeksmethodieken en data-analyse behoeften kon ondersteunen met moderne technologie oplossingen.',
    challengeNL: 'Duwtje, een wetenschappelijk gedragsbureau, had behoefte aan een gespecialiseerde IT-partner die hun onderzoeksmethodieken en data-analyse behoeften kon ondersteunen met moderne technologie oplossingen.',
    solution: 'We ontwikkelden een op maat gemaakte IT-infrastructuur die perfect aansluit bij wetenschappelijke onderzoeksprocessen, inclusief veilige data opslag, cloud collaboratie tools en betrouwbare backup systemen voor onderzoeksdata.',
    solutionNL: 'We ontwikkelden een op maat gemaakte IT-infrastructuur die perfect aansluit bij wetenschappelijke onderzoeksprocessen, inclusief veilige data opslag, cloud collaboratie tools en betrouwbare backup systemen voor onderzoeksdata.',
    results: [
      'Naadloze onderzoeks workflows geïmplementeerd',
      'Verbeterde team collaboratie',
      'Snellere project deliveries',
      'Zero data loss incidents',
      'Flexibele remote werk mogelijkheden'
    ],
    resultsNL: [
      'Naadloze onderzoeks workflows geïmplementeerd',
      'Verbeterde team collaboratie',
      'Snellere project deliveries',
      'Zero data loss incidents',
      'Flexibele remote werk mogelijkheden'
    ],
    technologies: ['Adobe Creative Cloud', 'Microsoft Teams', 'OneDrive', 'High-speed Fiber', 'Cloud Storage'],
    testimonial: {
      quote: 'Het voordeel van een gespecialiseerde IT-partner zoals Workflo is dat ze onze creatieve processen begrijpen en de technologie daarop afstemmen. Een perfecte match voor ons bureau.',
      quoteNL: 'Het voordeel van een gespecialiseerde IT-partner zoals Workflo is dat ze onze creatieve processen begrijpen en de technologie daarop afstemmen. Een perfecte match voor ons bureau.',
      author: 'Creative Director',
      role: 'Creative Director',
      roleNL: 'Creative Director'
    },
    duration: '6 weeks',
    durationNL: '6 weken',
    teamSize: 3,
    featured: true,
    tags: ['cloud-migration', 'managed-it', 'backup-recovery'],
    tagsNL: ['cloud-migratie', 'managed-it', 'backup-herstel'],
    completedDate: '2024-07-20',
    projectType: 'Creative IT Infrastructure',
    projectTypeNL: 'Creatieve IT Infrastructuur'
  },
  {
    id: '3',
    clientName: 'JUMP! Retail',
    clientLogo: '/images/logos/jump.png',
    industry: 'retail',
    industryNL: 'retail',
    challenge: 'JUMP! Retail had vanaf de start behoefte aan een betrouwbare IT-partner die kon fungeren als hun complete IT-afdeling voor advies, aankoop, installatie en dagelijks beheer.',
    challengeNL: 'JUMP! Retail had vanaf de start behoefte aan een betrouwbare IT-partner die kon fungeren als hun complete IT-afdeling voor advies, aankoop, installatie en dagelijks beheer.',
    solution: 'Workflo werd de vaste IT-manager voor JUMP!, waarbij we volledige verantwoordelijkheid namen voor hun IT-infrastructuur, van strategisch advies tot dagelijkse ondersteuning.',
    solutionNL: 'Workflo werd de vaste IT-manager voor JUMP!, waarbij we volledige verantwoordelijkheid namen voor hun IT-infrastructuur, van strategisch advies tot dagelijkse ondersteuning.',
    results: [
      'Complete IT-afdeling as a Service',
      'Strategisch IT-advies voor groei',
      'Proactief beheer en onderhoud',
      'Snelle respons op dagelijkse issues',
      'Kostenefficiënte IT-oplossingen'
    ],
    resultsNL: [
      'Complete IT-afdeling as a Service',
      'Strategisch IT-advies voor groei',
      'Proactief beheer en onderhoud',
      'Snelle respons op dagelijkse issues',
      'Kostenefficiënte IT-oplossingen'
    ],
    technologies: ['Microsoft 365', 'Azure', 'Retail Systems', 'POS Integration', 'Security Solutions'],
    testimonial: {
      quote: 'Florian, is vrijwel vanaf de start van ons bureau JUMP! onze IT manager geweest. In advies, in aankoop, in installatie en operatie is Florian onze spil. Ook bij dagelijkse issues is Florian zeer adequaat in zijn schakelen.',
      quoteNL: 'Florian, is vrijwel vanaf de start van ons bureau JUMP! onze IT manager geweest. In advies, in aankoop, in installatie en operatie is Florian onze spil. Ook bij dagelijkse issues is Florian zeer adequaat in zijn schakelen.',
      author: 'Ernst-Jan Smids',
      role: 'Oprichter',
      roleNL: 'Oprichter'
    },
    duration: 'Ongoing',
    durationNL: 'Doorlopend',
    teamSize: 4,
    featured: false,
    tags: ['managed-it', 'it-support', 'microsoft-365'],
    tagsNL: ['managed-it', 'it-ondersteuning', 'microsoft-365'],
    completedDate: '2024-08-01',
    projectType: 'Complete IT Management',
    projectTypeNL: 'Volledig IT Beheer'
  },
  {
    id: '4',
    clientName: 'Voice.industries',
    clientLogo: '/images/logos/voice-industries.png',
    industry: 'creative',
    industryNL: 'creatief',
    challenge: 'Een voice casting bureau had specifieke technische uitdagingen met audio workflows en hardware/software integratie die hun productiviteit beïnvloedde.',
    challengeNL: 'Een voice casting bureau had specifieke technische uitdagingen met audio workflows en hardware/software integratie die hun productiviteit beïnvloedde.',
    solution: 'Workflo loste complexe audio-technische problemen op en optimaliseerde de workflow zodat het creatieve proces ononderbroken kon doorgaan.',
    solutionNL: 'Workflo loste complexe audio-technische problemen op en optimaliseerde de workflow zodat het creatieve proces ononderbroken kon doorgaan.',
    results: [
      'Geoptimaliseerde audio workflows',
      'Stabiele recording omgeving',
      'Snellere projectafhandeling',
      'Minimale technische onderbrekingen',
      'Verhoogde klant tevredenheid'
    ],
    resultsNL: [
      'Geoptimaliseerde audio workflows',
      'Stabiele recording omgeving',
      'Snellere projectafhandeling',
      'Minimale technische onderbrekingen',
      'Verhoogde klant tevredenheid'
    ],
    technologies: ['Audio Software', 'DAW Systems', 'Cloud Storage', 'Hardware Integration', 'Backup Solutions'],
    testimonial: {
      quote: 'Florian keeps your workflow going, literally! Whenever you have a problem regarding a computer\'s soft or hardware, he will look into it and solve it for you! Always eager to extend his knowledge with the end goal to give you an even better service!',
      quoteNL: 'Florian houdt je workflow letterlijk draaiende! Wanneer je een probleem hebt met computer software of hardware, kijkt hij ernaar en lost het voor je op! Altijd bereid om zijn kennis uit te breiden met als einddoel een nog betere service te geven!',
      author: 'Sabine Hernandez Arce - de Bruijn',
      role: 'Voice Consultant | Casting Director',
      roleNL: 'Voice Consultant | Casting Director'
    },
    duration: '4 weeks',
    durationNL: '4 weken',
    teamSize: 2,
    featured: false,
    tags: ['it-support', 'managed-it', 'backup-recovery'],
    tagsNL: ['it-ondersteuning', 'managed-it', 'backup-herstel'],
    completedDate: '2024-03-20',
    projectType: 'Audio Workflow Optimization',
    projectTypeNL: 'Audio Workflow Optimalisatie'
  }
]

export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies.filter(cs => cs.featured)
}

export function getCaseStudiesByIndustry(industry: string): CaseStudy[] {
  if (industry === 'all') return caseStudies
  return caseStudies.filter(cs => cs.industry === industry)
}

export function getCaseStudiesByService(service: string): CaseStudy[] {
  if (service === 'all') return caseStudies
  return caseStudies.filter(cs => cs.tags.includes(service))
}

export function getCaseStudyById(id: string): CaseStudy | undefined {
  return caseStudies.find(cs => cs.id === id)
}