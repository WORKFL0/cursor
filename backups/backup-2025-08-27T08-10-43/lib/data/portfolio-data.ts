export interface Project {
  id: string
  title: string
  titleNL: string
  description: string
  descriptionNL: string
  category: string
  categoryNL: string
  client: string
  image: string
  images: string[]
  technologies: string[]
  features: string[]
  featuresNL: string[]
  duration: string
  durationNL: string
  teamSize: number
  status: 'completed' | 'in-progress' | 'planned'
  statusNL: string
  completedDate: string
  projectUrl?: string
  githubUrl?: string
  featured?: boolean
  tags: string[]
  tagsNL: string[]
  challenges: string
  challengesNL: string
  solution: string
  solutionNL: string
  results: string[]
  resultsNL: string[]
}

export const projectCategories = [
  { value: 'all', label: 'All Projects', labelNL: 'Alle Projecten' },
  { value: 'infrastructure', label: 'IT Infrastructure', labelNL: 'IT Infrastructuur' },
  { value: 'cloud-solutions', label: 'Cloud Solutions', labelNL: 'Cloud Oplossingen' },
  { value: 'security', label: 'Cybersecurity', labelNL: 'Cyberbeveiliging' },
  { value: 'automation', label: 'Automation', labelNL: 'Automatisering' },
  { value: 'communication', label: 'Communication Systems', labelNL: 'Communicatie Systemen' },
  { value: 'backup', label: 'Backup & Recovery', labelNL: 'Backup & Herstel' },
  { value: 'monitoring', label: 'Monitoring & Analytics', labelNL: 'Monitoring & Analytics' }
]

export const technologyTags = [
  { value: 'all', label: 'All Technologies', labelNL: 'Alle Technologieën' },
  { value: 'microsoft', label: 'Microsoft', labelNL: 'Microsoft' },
  { value: 'azure', label: 'Azure', labelNL: 'Azure' },
  { value: 'aws', label: 'AWS', labelNL: 'AWS' },
  { value: 'cisco', label: 'Cisco', labelNL: 'Cisco' },
  { value: 'vmware', label: 'VMware', labelNL: 'VMware' },
  { value: 'security', label: 'Security Tools', labelNL: 'Security Tools' },
  { value: 'monitoring', label: 'Monitoring Tools', labelNL: 'Monitoring Tools' }
]

export const projects: Project[] = [
  {
    id: '1',
    title: 'Enterprise Cloud Migration Platform',
    titleNL: 'Enterprise Cloud Migratie Platform',
    description: 'A comprehensive cloud migration solution for large enterprises, featuring automated assessment, planning, and execution tools with minimal downtime.',
    descriptionNL: 'Een uitgebreide cloud migratie oplossing voor grote ondernemingen, met geautomatiseerde assessment, planning, en uitvoeringstools met minimale downtime.',
    category: 'cloud-solutions',
    categoryNL: 'cloud-oplossingen',
    client: 'Fortune 500 Financial Services',
    image: '/images/projects/cloud-migration-hero.jpg',
    images: [
      '/images/projects/cloud-migration-hero.jpg',
      '/images/projects/cloud-migration-dashboard.jpg',
      '/images/projects/cloud-migration-analytics.jpg',
      '/images/projects/cloud-migration-security.jpg'
    ],
    technologies: ['Microsoft Azure', 'Azure Migrate', 'PowerShell', 'ARM Templates', 'Azure DevOps', 'Terraform'],
    features: [
      'Automated workload assessment',
      'Zero-downtime migration strategies',
      'Cost optimization recommendations',
      'Security compliance validation',
      'Real-time migration monitoring',
      'Rollback capabilities'
    ],
    featuresNL: [
      'Geautomatiseerde workload assessment',
      'Zero-downtime migratie strategieën',
      'Kostenoptimalisatie aanbevelingen',
      'Security compliance validatie',
      'Real-time migratie monitoring',
      'Rollback mogelijkheden'
    ],
    duration: '8 months',
    durationNL: '8 maanden',
    teamSize: 12,
    status: 'completed',
    statusNL: 'voltooid',
    completedDate: '2024-02-15',
    featured: true,
    tags: ['azure', 'microsoft', 'cloud-migration', 'enterprise'],
    tagsNL: ['azure', 'microsoft', 'cloud-migratie', 'enterprise'],
    challenges: 'Migrating 500+ legacy applications with complex dependencies while maintaining 99.9% uptime and ensuring regulatory compliance across multiple jurisdictions.',
    challengesNL: 'Het migreren van 500+ legacy applicaties met complexe afhankelijkheden waarbij 99,9% uptime behouden blijft en regulatoire compliance gewaarborgd wordt in meerdere jurisdicties.',
    solution: 'Developed a phased migration approach using Azure Migrate, custom automation scripts, and comprehensive testing environments. Implemented parallel running systems and automated rollback procedures.',
    solutionNL: 'Ontwikkelde een gefaseerde migratie aanpak met Azure Migrate, aangepaste automatiseringsscripts, en uitgebreide testomgevingen. Implementeerde parallelle systemen en geautomatiseerde rollback procedures.',
    results: [
      '40% reduction in infrastructure costs',
      '99.99% uptime maintained during migration',
      '60% improvement in application performance',
      'Zero data loss incidents',
      '90% faster deployment cycles'
    ],
    resultsNL: [
      '40% reductie in infrastructuurkosten',
      '99,99% uptime behouden tijdens migratie',
      '60% verbetering in applicatie prestaties',
      'Nul data verlies incidenten',
      '90% snellere deployment cycli'
    ]
  },
  {
    id: '2',
    title: 'Advanced Threat Detection System',
    titleNL: 'Geavanceerd Bedreigingsdetectie Systeem',
    description: 'AI-powered cybersecurity solution with real-time threat detection, automated response capabilities, and comprehensive security analytics.',
    descriptionNL: 'AI-gestuurde cybersecurity oplossing met real-time bedreigingsdetectie, geautomatiseerde respons mogelijkheden, en uitgebreide security analytics.',
    category: 'security',
    categoryNL: 'beveiliging',
    client: 'Healthcare Network',
    image: '/images/projects/security-dashboard.jpg',
    images: [
      '/images/projects/security-dashboard.jpg',
      '/images/projects/security-alerts.jpg',
      '/images/projects/security-analytics.jpg',
      '/images/projects/security-compliance.jpg'
    ],
    technologies: ['CrowdStrike Falcon', 'Microsoft Sentinel', 'Azure AI', 'PowerBI', 'LogicApps', 'KQL'],
    features: [
      'Real-time threat detection',
      'Automated incident response',
      'Machine learning analytics',
      'Compliance reporting',
      'Threat intelligence integration',
      'User behavior analytics'
    ],
    featuresNL: [
      'Real-time bedreigingsdetectie',
      'Geautomatiseerde incident respons',
      'Machine learning analytics',
      'Compliance rapportage',
      'Threat intelligence integratie',
      'Gebruikersgedrag analytics'
    ],
    duration: '6 months',
    durationNL: '6 maanden',
    teamSize: 8,
    status: 'completed',
    statusNL: 'voltooid',
    completedDate: '2024-01-20',
    featured: true,
    tags: ['security', 'ai', 'monitoring', 'compliance'],
    tagsNL: ['beveiliging', 'ai', 'monitoring', 'compliance'],
    challenges: 'Protecting sensitive healthcare data while maintaining system performance and ensuring HIPAA compliance across a distributed network of 50+ locations.',
    challengesNL: 'Het beschermen van gevoelige zorggegevens waarbij systeemprestaties behouden blijven en HIPAA compliance gewaarborgd wordt in een gedistribueerd netwerk van 50+ locaties.',
    solution: 'Implemented a multi-layered security approach with AI-driven threat detection, automated response workflows, and continuous compliance monitoring using Microsoft Sentinel and CrowdStrike.',
    solutionNL: 'Implementeerde een meerlaagse security aanpak met AI-gestuurde bedreigingsdetectie, geautomatiseerde respons workflows, en continue compliance monitoring met Microsoft Sentinel en CrowdStrike.',
    results: [
      '95% reduction in false positives',
      '80% faster threat response time',
      '100% HIPAA compliance maintained',
      'Zero successful cyber attacks',
      '50% reduction in security incidents'
    ],
    resultsNL: [
      '95% reductie in valse positieven',
      '80% snellere bedreigingsresponstijd',
      '100% HIPAA compliance behouden',
      'Nul succesvolle cyberaanvallen',
      '50% reductie in beveiligingsincidenten'
    ]
  },
  {
    id: '3',
    title: 'Hybrid Network Infrastructure',
    titleNL: 'Hybride Netwerk Infrastructuur',
    description: 'Modern network infrastructure combining on-premises and cloud resources with SD-WAN technology for optimal performance and security.',
    descriptionNL: 'Moderne netwerk infrastructuur die on-premises en cloud resources combineert met SD-WAN technologie voor optimale prestaties en beveiliging.',
    category: 'infrastructure',
    categoryNL: 'infrastructuur',
    client: 'Manufacturing Corporation',
    image: '/images/projects/network-infrastructure.jpg',
    images: [
      '/images/projects/network-infrastructure.jpg',
      '/images/projects/network-topology.jpg',
      '/images/projects/network-monitoring.jpg',
      '/images/projects/network-security.jpg'
    ],
    technologies: ['Cisco Meraki', 'Azure ExpressRoute', 'Fortinet', 'SD-WAN', 'MPLS', 'VPN'],
    features: [
      'SD-WAN implementation',
      'Cloud connectivity optimization',
      'Network segmentation',
      'Bandwidth management',
      'Redundancy and failover',
      'Centralized management'
    ],
    featuresNL: [
      'SD-WAN implementatie',
      'Cloud connectiviteit optimalisatie',
      'Netwerk segmentatie',
      'Bandwidth management',
      'Redundantie en failover',
      'Gecentraliseerd beheer'
    ],
    duration: '10 months',
    durationNL: '10 maanden',
    teamSize: 6,
    status: 'completed',
    statusNL: 'voltooid',
    completedDate: '2024-03-10',
    featured: false,
    tags: ['cisco', 'networking', 'sd-wan', 'hybrid'],
    tagsNL: ['cisco', 'netwerken', 'sd-wan', 'hybride'],
    challenges: 'Connecting 25 manufacturing sites across 3 continents with varying internet quality while ensuring consistent performance and security.',
    challengesNL: 'Het verbinden van 25 productielocaties verspreid over 3 continenten met variërende internetkwaliteit waarbij consistente prestaties en beveiliging gewaarborgd worden.',
    solution: 'Designed and implemented a hybrid SD-WAN solution with intelligent path selection, automatic failover, and centralized policy management using Cisco Meraki and Azure ExpressRoute.',
    solutionNL: 'Ontwierp en implementeerde een hybride SD-WAN oplossing met intelligente path selectie, automatische failover, en gecentraliseerd beleidsbeheer met Cisco Meraki en Azure ExpressRoute.',
    results: [
      '70% improvement in network performance',
      '50% reduction in connectivity issues',
      '30% cost savings on WAN connections',
      '99.8% network uptime achieved',
      'Unified management across all sites'
    ],
    resultsNL: [
      '70% verbetering in netwerkprestaties',
      '50% reductie in connectiviteitsproblemen',
      '30% kostenbesparing op WAN verbindingen',
      '99,8% netwerk uptime bereikt',
      'Uniform beheer over alle locaties'
    ]
  },
  {
    id: '4',
    title: 'Intelligent Backup & Recovery Solution',
    titleNL: 'Intelligente Backup & Herstel Oplossing',
    description: 'Enterprise-grade backup solution with AI-driven optimization, instant recovery capabilities, and comprehensive data protection across hybrid environments.',
    descriptionNL: 'Enterprise-grade backup oplossing met AI-gestuurde optimalisatie, instant recovery mogelijkheden, en uitgebreide data bescherming in hybride omgevingen.',
    category: 'backup',
    categoryNL: 'backup',
    client: 'Legal Services Firm',
    image: '/images/projects/backup-solution.jpg',
    images: [
      '/images/projects/backup-solution.jpg',
      '/images/projects/backup-dashboard.jpg',
      '/images/projects/backup-recovery.jpg',
      '/images/projects/backup-testing.jpg'
    ],
    technologies: ['Veeam Backup & Replication', 'Azure Blob Storage', 'Hyper-V', 'PowerShell', 'Azure Site Recovery'],
    features: [
      'Instant VM recovery',
      'Automated backup testing',
      'Ransomware protection',
      'Cloud-tier storage',
      'Compliance reporting',
      'Cross-platform support'
    ],
    featuresNL: [
      'Instant VM herstel',
      'Geautomatiseerde backup testing',
      'Ransomware bescherming',
      'Cloud-tier opslag',
      'Compliance rapportage',
      'Cross-platform ondersteuning'
    ],
    duration: '4 months',
    durationNL: '4 maanden',
    teamSize: 4,
    status: 'completed',
    statusNL: 'voltooid',
    completedDate: '2024-02-28',
    featured: false,
    tags: ['backup', 'veeam', 'azure', 'recovery'],
    tagsNL: ['backup', 'veeam', 'azure', 'herstel'],
    challenges: 'Protecting 50TB of sensitive legal documents with strict recovery time objectives and regulatory compliance requirements.',
    challengesNL: 'Het beschermen van 50TB aan gevoelige juridische documenten met strikte recovery time objectives en regulatoire compliance vereisten.',
    solution: 'Implemented a tiered backup strategy using Veeam with local high-speed recovery and cloud archiving, including automated testing and immutable backup copies.',
    solutionNL: 'Implementeerde een gelaagde backup strategie met Veeam met lokale high-speed recovery en cloud archivering, inclusief geautomatiseerde testing en onveranderlijke backup kopieën.',
    results: [
      '15-minute recovery time objective achieved',
      '99.99% backup success rate',
      '60% reduction in storage costs',
      'Zero data loss in 18 months',
      'Automated compliance reporting'
    ],
    resultsNL: [
      '15-minuten recovery time objective bereikt',
      '99,99% backup succes ratio',
      '60% reductie in opslagkosten',
      'Nul data verlies in 18 maanden',
      'Geautomatiseerde compliance rapportage'
    ]
  },
  {
    id: '5',
    title: 'Modern Workplace Communication Platform',
    titleNL: 'Modern Workplace Communicatie Platform',
    description: 'Comprehensive Microsoft Teams implementation with custom integrations, advanced calling features, and seamless collaboration tools.',
    descriptionNL: 'Uitgebreide Microsoft Teams implementatie met aangepaste integraties, geavanceerde belfuncties, en naadloze samenwerkingstools.',
    category: 'communication',
    categoryNL: 'communicatie',
    client: 'International Consulting Firm',
    image: '/images/projects/teams-platform.jpg',
    images: [
      '/images/projects/teams-platform.jpg',
      '/images/projects/teams-calling.jpg',
      '/images/projects/teams-collaboration.jpg',
      '/images/projects/teams-analytics.jpg'
    ],
    technologies: ['Microsoft Teams', 'Teams Phone', 'Power Platform', 'SharePoint', 'Azure AD', 'Graph API'],
    features: [
      'Enterprise voice integration',
      'Custom Teams apps',
      'Advanced meeting features',
      'External collaboration',
      'Mobile optimization',
      'Usage analytics'
    ],
    featuresNL: [
      'Enterprise voice integratie',
      'Aangepaste Teams apps',
      'Geavanceerde meeting functies',
      'Externe samenwerking',
      'Mobiele optimalisatie',
      'Gebruiks analytics'
    ],
    duration: '5 months',
    durationNL: '5 maanden',
    teamSize: 5,
    status: 'completed',
    statusNL: 'voltooid',
    completedDate: '2024-01-10',
    featured: false,
    tags: ['microsoft', 'teams', 'communication', 'collaboration'],
    tagsNL: ['microsoft', 'teams', 'communicatie', 'samenwerking'],
    challenges: 'Enabling seamless collaboration for 1000+ employees across 15 countries with varying compliance requirements and communication preferences.',
    challengesNL: 'Het mogelijk maken van naadloze samenwerking voor 1000+ medewerkers verspreid over 15 landen met variërende compliance vereisten en communicatievoorkeuren.',
    solution: 'Deployed Microsoft Teams with integrated calling, custom governance policies, and automated provisioning workflows tailored to regional requirements.',
    solutionNL: 'Implementeerde Microsoft Teams met geïntegreerde belfuncties, aangepaste governance beleid, en geautomatiseerde provisioning workflows afgestemd op regionale vereisten.',
    results: [
      '85% reduction in travel costs',
      '40% improvement in project delivery time',
      '95% user adoption rate',
      '60% increase in cross-team collaboration',
      'Unified communication platform'
    ],
    resultsNL: [
      '85% reductie in reiskosten',
      '40% verbetering in projectleveringstijd',
      '95% gebruikersadoptie ratio',
      '60% toename in cross-team samenwerking',
      'Uniform communicatieplatform'
    ]
  },
  {
    id: '6',
    title: 'IT Operations Automation Suite',
    titleNL: 'IT Operations Automatisering Suite',
    description: 'Comprehensive automation platform for IT operations including automated provisioning, monitoring, and incident response with self-healing capabilities.',
    descriptionNL: 'Uitgebreide automatiseringsplatform voor IT operations inclusief geautomatiseerde provisioning, monitoring, en incident respons met self-healing mogelijkheden.',
    category: 'automation',
    categoryNL: 'automatisering',
    client: 'Technology Startup',
    image: '/images/projects/automation-suite.jpg',
    images: [
      '/images/projects/automation-suite.jpg',
      '/images/projects/automation-workflows.jpg',
      '/images/projects/automation-monitoring.jpg',
      '/images/projects/automation-reporting.jpg'
    ],
    technologies: ['Azure Automation', 'PowerShell', 'Logic Apps', 'Azure Monitor', 'Terraform', 'ARM Templates'],
    features: [
      'Infrastructure as Code',
      'Automated monitoring',
      'Self-healing systems',
      'Incident automation',
      'Resource optimization',
      'Compliance automation'
    ],
    featuresNL: [
      'Infrastructure as Code',
      'Geautomatiseerde monitoring',
      'Self-healing systemen',
      'Incident automatisering',
      'Resource optimalisatie',
      'Compliance automatisering'
    ],
    duration: '7 months',
    durationNL: '7 maanden',
    teamSize: 6,
    status: 'completed',
    statusNL: 'voltooid',
    completedDate: '2024-03-20',
    featured: true,
    tags: ['automation', 'azure', 'monitoring', 'devops'],
    tagsNL: ['automatisering', 'azure', 'monitoring', 'devops'],
    challenges: 'Managing rapid infrastructure growth while maintaining reliability and cost-effectiveness for a fast-scaling startup environment.',
    challengesNL: 'Het beheren van snelle infrastructuurgroei waarbij betrouwbaarheid en kosteneffectiviteit behouden blijven voor een snel schaalbare startup omgeving.',
    solution: 'Built a comprehensive automation platform using Azure services with Infrastructure as Code, automated monitoring, and self-healing capabilities.',
    solutionNL: 'Bouwde een uitgebreide automatiseringsplatform met Azure services met Infrastructure as Code, geautomatiseerde monitoring, en self-healing mogelijkheden.',
    results: [
      '90% reduction in manual operations',
      '75% faster deployment cycles',
      '50% improvement in system reliability',
      '40% cost optimization achieved',
      '24/7 automated operations'
    ],
    resultsNL: [
      '90% reductie in handmatige operaties',
      '75% snellere deployment cycli',
      '50% verbetering in systeembetrouwbaarheid',
      '40% kostenoptimalisatie bereikt',
      '24/7 geautomatiseerde operaties'
    ]
  }
]

export function getFeaturedProjects(): Project[] {
  return projects.filter(p => p.featured)
}

export function getProjectsByCategory(category: string): Project[] {
  if (category === 'all') return projects
  return projects.filter(p => p.category === category)
}

export function getProjectsByTechnology(technology: string): Project[] {
  if (technology === 'all') return projects
  return projects.filter(p => p.tags.includes(technology))
}

export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id)
}

export function getRecentProjects(limit: number = 3): Project[] {
  return projects
    .sort((a, b) => new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime())
    .slice(0, limit)
}