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
  { value: 'nonprofit', label: 'Non-profit', labelNL: 'Non-profit' }
]

export const serviceTypes = [
  { value: 'all', label: 'All Services', labelNL: 'Alle Diensten' },
  { value: 'managed-it', label: 'Managed IT', labelNL: 'Managed IT' },
  { value: 'cloud-migration', label: 'Cloud Migration', labelNL: 'Cloud Migratie' },
  { value: 'cybersecurity', label: 'Cybersecurity', labelNL: 'Cyberbeveiliging' },
  { value: 'backup-recovery', label: 'Backup & Recovery', labelNL: 'Backup & Herstel' },
  { value: 'network-setup', label: 'Network Setup', labelNL: 'Netwerk Installatie' },
  { value: 'voip', label: 'VoIP Implementation', labelNL: 'VoIP Implementatie' },
  { value: 'microsoft-365', label: 'Microsoft 365', labelNL: 'Microsoft 365' }
]

export const caseStudies: CaseStudy[] = [
  {
    id: '1',
    clientName: 'TechStart Amsterdam',
    clientLogo: '/images/logos/techstart.png',
    industry: 'startup',
    industryNL: 'startup',
    challenge: 'A rapidly growing startup needed a complete IT infrastructure overhaul to support their scaling team from 10 to 50 employees. Their existing setup was causing frequent downtime and security vulnerabilities.',
    challengeNL: 'Een snelgroeiende startup had een complete IT-infrastructuur renovatie nodig om hun schaalbare team van 10 naar 50 medewerkers te ondersteunen. Hun bestaande setup veroorzaakte frequente downtime en beveiligingslekken.',
    solution: 'We implemented a comprehensive managed IT solution including cloud-first infrastructure, Microsoft 365 deployment, advanced cybersecurity measures, and 24/7 monitoring. The entire migration was completed over a weekend with zero business disruption.',
    solutionNL: 'We implementeerden een uitgebreide managed IT-oplossing inclusief cloud-first infrastructuur, Microsoft 365 deployment, geavanceerde cybersecurity maatregelen, en 24/7 monitoring. De volledige migratie werd voltooid tijdens een weekend zonder bedrijfsonderbreking.',
    results: [
      '99.9% uptime achieved',
      '70% reduction in IT-related incidents',
      '40% cost savings on IT infrastructure',
      '50% faster deployment of new employees',
      'Enhanced security posture with zero breaches'
    ],
    resultsNL: [
      '99,9% uptime bereikt',
      '70% reductie in IT-gerelateerde incidenten',
      '40% kostenbesparing op IT-infrastructuur',
      '50% snellere implementatie van nieuwe medewerkers',
      'Verbeterde beveiligingspositie zonder inbreuken'
    ],
    technologies: ['Microsoft 365', 'Azure Cloud', 'Cisco Meraki', 'CrowdStrike', 'Teams Phone'],
    testimonial: {
      quote: 'Workflo transformed our chaotic IT setup into a streamlined, secure infrastructure. Their proactive approach means we can focus on growing our business instead of fighting technology issues.',
      quoteNL: 'Workflo transformeerde onze chaotische IT-setup naar een gestroomlijnde, veilige infrastructuur. Hun proactieve aanpak betekent dat we ons kunnen focussen op het laten groeien van ons bedrijf in plaats van technologieproblemen te bestrijden.',
      author: 'Jan van der Berg',
      role: 'CEO',
      roleNL: 'CEO'
    },
    duration: '6 weeks',
    durationNL: '6 weken',
    teamSize: 4,
    featured: true,
    tags: ['cloud-migration', 'managed-it', 'cybersecurity'],
    tagsNL: ['cloud-migratie', 'managed-it', 'cyberbeveiliging'],
    completedDate: '2024-01-15',
    projectType: 'Complete IT Transformation',
    projectTypeNL: 'Volledige IT Transformatie'
  },
  {
    id: '2',
    clientName: 'Creative Agency Zuid',
    clientLogo: '/images/logos/creative-agency.png',
    industry: 'creative',
    industryNL: 'creatief',
    challenge: 'A creative agency with large file workflows needed faster file sharing and collaboration tools. Their creative teams were losing hours daily due to slow file transfers and outdated collaboration methods.',
    challengeNL: 'Een creatief bureau met grote bestandsworkflows had snellere bestandsdeling en samenwerkingstools nodig. Hun creatieve teams verloren dagelijks uren door langzame bestandsoverdrachten en verouderde samenwerkingsmethoden.',
    solution: 'We deployed a high-performance cloud storage solution with Adobe Creative Cloud integration, implemented high-speed fiber connectivity, and set up collaborative workspaces with real-time synchronization.',
    solutionNL: 'We implementeerden een high-performance cloud storage oplossing met Adobe Creative Cloud integratie, implementeerden high-speed glasvezel connectiviteit, en richtten collaboratieve werkruimtes in met real-time synchronisatie.',
    results: [
      '80% faster file transfers',
      '60% improvement in team collaboration',
      '95% reduction in version conflicts',
      '30% increase in project delivery speed',
      'Seamless remote work capabilities'
    ],
    resultsNL: [
      '80% snellere bestandsoverdrachten',
      '60% verbetering in teamsamenwerking',
      '95% reductie in versieconflicten',
      '30% toename in projectleveringssnelheid',
      'Naadloze mogelijkheden voor thuiswerken'
    ],
    technologies: ['Adobe Creative Cloud', 'Microsoft OneDrive', 'Teams', 'Fiber Internet', 'Synology NAS'],
    testimonial: {
      quote: 'The performance improvement has been incredible. Our creative workflows are now seamless, and our team can collaborate effortlessly whether they\'re in the office or working from home.',
      quoteNL: 'De prestatieverbetering is ongelooflijk geweest. Onze creatieve workflows zijn nu naadloos, en ons team kan moeiteloos samenwerken, of ze nu op kantoor zijn of thuiswerken.',
      author: 'Lisa de Vries',
      role: 'Operations Manager',
      roleNL: 'Operations Manager'
    },
    duration: '4 weeks',
    durationNL: '4 weken',
    teamSize: 3,
    featured: true,
    tags: ['cloud-migration', 'collaboration', 'performance'],
    tagsNL: ['cloud-migratie', 'samenwerking', 'prestaties'],
    completedDate: '2024-02-20',
    projectType: 'Creative Workflow Optimization',
    projectTypeNL: 'Creatieve Workflow Optimalisatie'
  },
  {
    id: '3',
    clientName: 'Financial Partners BV',
    clientLogo: '/images/logos/financial-partners.png',
    industry: 'finance',
    industryNL: 'financieel',
    challenge: 'A financial services firm required enhanced cybersecurity measures to meet regulatory compliance and protect sensitive client data. They needed to implement multi-factor authentication and advanced threat protection.',
    challengeNL: 'Een financiële dienstverlener had verbeterde cybersecurity maatregelen nodig om te voldoen aan regulatoire compliance en gevoelige klantgegevens te beschermen. Ze moesten multi-factor authenticatie en geavanceerde bedreigingsbescherming implementeren.',
    solution: 'We implemented a comprehensive cybersecurity framework including endpoint detection and response (EDR), multi-factor authentication, encrypted communications, regular security audits, and staff training programs.',
    solutionNL: 'We implementeerden een uitgebreid cybersecurity framework inclusief endpoint detection and response (EDR), multi-factor authenticatie, versleutelde communicatie, regelmatige beveiligingsaudits, en training programma\'s voor personeel.',
    results: [
      'Achieved full regulatory compliance',
      'Zero security incidents in 12 months',
      '90% reduction in phishing susceptibility',
      '100% encrypted data transmission',
      'Improved client trust and confidence'
    ],
    resultsNL: [
      'Volledige regulatoire compliance bereikt',
      'Nul beveiligingsincidenten in 12 maanden',
      '90% reductie in phishing gevoeligheid',
      '100% versleutelde datatransmissie',
      'Verbeterd klantvertrouwen en -vertrouwen'
    ],
    technologies: ['CrowdStrike Falcon', 'Microsoft Defender', 'Azure AD', 'Duo MFA', 'Proofpoint'],
    testimonial: {
      quote: 'Our clients now have complete confidence in our security measures. Workflo\'s cybersecurity expertise has been instrumental in maintaining our reputation and regulatory compliance.',
      quoteNL: 'Onze klanten hebben nu volledig vertrouwen in onze beveiligingsmaatregelen. Workflo\'s cybersecurity expertise is instrumentaal geweest in het behouden van onze reputatie en regulatoire compliance.',
      author: 'Mark Jansen',
      role: 'IT Director',
      roleNL: 'IT Directeur'
    },
    duration: '8 weeks',
    durationNL: '8 weken',
    teamSize: 3,
    featured: true,
    tags: ['cybersecurity', 'compliance', 'data-protection'],
    tagsNL: ['cyberbeveiliging', 'compliance', 'gegevensbescherming'],
    completedDate: '2024-03-10',
    projectType: 'Cybersecurity Enhancement',
    projectTypeNL: 'Cybersecurity Verbetering'
  },
  {
    id: '4',
    clientName: 'Healthcare Plus',
    clientLogo: '/images/logos/healthcare-plus.png',
    industry: 'healthcare',
    industryNL: 'zorgverlening',
    challenge: 'A healthcare practice needed HIPAA-compliant backup and disaster recovery solutions to protect patient data and ensure business continuity during emergencies.',
    challengeNL: 'Een zorgpraktijk had HIPAA-conforme backup en disaster recovery oplossingen nodig om patiëntgegevens te beschermen en bedrijfscontinuïteit te waarborgen tijdens noodsituaties.',
    solution: 'We designed and implemented a comprehensive backup strategy with encrypted cloud storage, local redundancy, automated testing, and detailed disaster recovery procedures with guaranteed recovery time objectives.',
    solutionNL: 'We ontwierpen en implementeerden een uitgebreide backup strategie met versleutelde cloud opslag, lokale redundantie, geautomatiseerde testing, en gedetailleerde disaster recovery procedures met gegarandeerde recovery time objectives.',
    results: [
      'HIPAA compliance achieved',
      '15-minute recovery time objective',
      '99.99% data integrity maintained',
      'Automated daily backup verification',
      'Successful disaster recovery testing'
    ],
    resultsNL: [
      'HIPAA compliance bereikt',
      '15-minuten recovery time objective',
      '99,99% data integriteit behouden',
      'Geautomatiseerde dagelijkse backup verificatie',
      'Succesvolle disaster recovery testing'
    ],
    technologies: ['Veeam Backup', 'Azure Storage', 'Hyper-V', 'BitLocker', 'HIPAA Tools'],
    testimonial: {
      quote: 'Peace of mind is priceless in healthcare. Knowing our patient data is secure and recoverable allows us to focus entirely on providing excellent patient care.',
      quoteNL: 'Gemoedsrust is onbetaalbaar in de zorgverlening. Weten dat onze patiëntgegevens veilig en herstelbaar zijn, stelt ons in staat om ons volledig te concentreren op het bieden van uitstekende patiëntenzorg.',
      author: 'Anna Hendriks',
      role: 'Operations Director',
      roleNL: 'Operations Directeur'
    },
    duration: '5 weeks',
    durationNL: '5 weken',
    teamSize: 2,
    featured: false,
    tags: ['backup-recovery', 'compliance', 'data-protection'],
    tagsNL: ['backup-herstel', 'compliance', 'gegevensbescherming'],
    completedDate: '2024-03-05',
    projectType: 'Disaster Recovery Implementation',
    projectTypeNL: 'Disaster Recovery Implementatie'
  },
  {
    id: '5',
    clientName: 'Legal Associates',
    clientLogo: '/images/logos/legal-associates.png',
    industry: 'legal',
    industryNL: 'juridisch',
    challenge: 'A law firm needed a complete Microsoft 365 implementation with advanced document management, secure client communication, and mobile access for their attorneys.',
    challengeNL: 'Een advocatenkantoor had een complete Microsoft 365 implementatie nodig met geavanceerd documentbeheer, veilige klantcommunicatie, en mobiele toegang voor hun advocaten.',
    solution: 'We deployed Microsoft 365 E5 with SharePoint document libraries, Teams for secure client communication, advanced compliance features, and mobile device management for seamless remote work.',
    solutionNL: 'We implementeerden Microsoft 365 E5 met SharePoint documentbibliotheken, Teams voor veilige klantcommunicatie, geavanceerde compliance functies, en mobiel apparaatbeheer voor naadloos thuiswerken.',
    results: [
      '50% faster document retrieval',
      '75% reduction in email storage issues',
      '100% secure client communications',
      '60% improvement in remote productivity',
      'Enhanced collaboration between attorneys'
    ],
    resultsNL: [
      '50% snellere document retrieval',
      '75% reductie in email storage problemen',
      '100% veilige klantcommunicatie',
      '60% verbetering in remote productiviteit',
      'Verbeterde samenwerking tussen advocaten'
    ],
    technologies: ['Microsoft 365 E5', 'SharePoint', 'Teams', 'OneDrive', 'Intune'],
    testimonial: {
      quote: 'The transition to Microsoft 365 has revolutionized how we work. Document management is now effortless, and our attorneys can work securely from anywhere.',
      quoteNL: 'De overgang naar Microsoft 365 heeft een revolutie teweeggebracht in hoe we werken. Documentbeheer is nu moeiteloos, en onze advocaten kunnen veilig overal werken.',
      author: 'Sophie Bakker',
      role: 'Managing Partner',
      roleNL: 'Managing Partner'
    },
    duration: '6 weeks',
    durationNL: '6 weken',
    teamSize: 3,
    featured: false,
    tags: ['microsoft-365', 'document-management', 'collaboration'],
    tagsNL: ['microsoft-365', 'documentbeheer', 'samenwerking'],
    completedDate: '2024-01-28',
    projectType: 'Microsoft 365 Implementation',
    projectTypeNL: 'Microsoft 365 Implementatie'
  },
  {
    id: '6',
    clientName: 'Retail Solutions NL',
    clientLogo: '/images/logos/retail-solutions.png',
    industry: 'retail',
    industryNL: 'retail',
    challenge: 'A retail company with multiple locations needed a modern VoIP phone system to improve customer service and reduce communication costs across their stores.',
    challengeNL: 'Een retailbedrijf met meerdere locaties had een modern VoIP telefoonsysteem nodig om de klantenservice te verbeteren en communicatiekosten in hun winkels te verlagen.',
    solution: 'We implemented a cloud-based VoIP solution with advanced call routing, customer queue management, integration with their CRM system, and detailed analytics for performance monitoring.',
    solutionNL: 'We implementeerden een cloud-gebaseerde VoIP oplossing met geavanceerde oproep routing, klant wachtrij management, integratie met hun CRM systeem, en gedetailleerde analytics voor prestatie monitoring.',
    results: [
      '40% reduction in communication costs',
      '35% improvement in call quality',
      '60% faster customer service response',
      '25% increase in customer satisfaction',
      'Unified communication across all locations'
    ],
    resultsNL: [
      '40% reductie in communicatiekosten',
      '35% verbetering in gesprekskwaliteit',
      '60% snellere klantenservice respons',
      '25% toename in klanttevredenheid',
      'Uniforme communicatie over alle locaties'
    ],
    technologies: ['Teams Phone', 'Azure Communication Services', 'Power Platform', 'Session Border Controller'],
    testimonial: {
      quote: 'The new phone system has transformed our customer service. Our staff can now handle calls more efficiently, and the cost savings have been substantial.',
      quoteNL: 'Het nieuwe telefoonsysteem heeft onze klantenservice getransformeerd. Ons personeel kan nu efficiënter omgaan met gesprekken, en de kostenbesparing is aanzienlijk geweest.',
      author: 'Peter van Dijk',
      role: 'CTO',
      roleNL: 'CTO'
    },
    duration: '7 weeks',
    durationNL: '7 weken',
    teamSize: 3,
    featured: false,
    tags: ['voip', 'communication', 'cost-optimization'],
    tagsNL: ['voip', 'communicatie', 'kostenoptimalisatie'],
    completedDate: '2024-02-15',
    projectType: 'VoIP System Implementation',
    projectTypeNL: 'VoIP Systeem Implementatie'
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