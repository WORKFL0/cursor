export interface ServiceCategory {
  id: string
  name: string
  nameNL: string
  description: string
  descriptionNL: string
  icon: string
  unit: string
  unitNL: string
  minQuantity: number
  maxQuantity: number
  basePrice: number
  pricePerUnit: number
  yearlyDiscount: number // percentage discount for yearly billing
  features: string[]
  featuresNL: string[]
}

export interface PricingQuote {
  id: string
  services: {
    serviceId: string
    quantity: number
    monthlyPrice: number
    yearlyPrice: number
  }[]
  totalMonthly: number
  totalYearly: number
  yearlyDiscount: number
  generatedAt: Date
  expiresAt: Date
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'ayce-remote',
    name: 'AYCE Remote Support',
    nameNL: 'AYCE Remote Ondersteuning',
    description: 'All You Can Eat IT support - remote only',
    descriptionNL: 'All You Can Eat IT ondersteuning - alleen op afstand',
    icon: '💻',
    unit: 'users',
    unitNL: 'gebruikers',
    minQuantity: 1,
    maxQuantity: 500,
    basePrice: 0,
    pricePerUnit: 60,
    yearlyDiscount: 15,
    features: [
      '24/7 remote monitoring and support',
      'Proactive maintenance',
      'Security updates and licenses included',
      'Remote troubleshooting',
      'Software licensing management',
      'Unlimited support tickets',
      'All security licenses included'
    ],
    featuresNL: [
      '24/7 remote monitoring en ondersteuning',
      'Proactief onderhoud',
      'Beveiligingsupdates en licenties inbegrepen',
      'Probleemoplossing op afstand',
      'Software licentie beheer',
      'Onbeperkte support tickets',
      'Alle beveiligingslicenties inbegrepen'
    ]
  },
  {
    id: 'ayce-onsite',
    name: 'AYCE Onsite Support',
    nameNL: 'AYCE Onsite Ondersteuning',
    description: 'All You Can Eat IT support with onsite visits',
    descriptionNL: 'All You Can Eat IT ondersteuning met ter plaatse bezoeken',
    icon: '🏢',
    unit: 'users',
    unitNL: 'gebruikers',
    minQuantity: 1,
    maxQuantity: 500,
    basePrice: 0,
    pricePerUnit: 90,
    yearlyDiscount: 15,
    features: [
      '24/7 monitoring and support',
      'Onsite technical visits included',
      'Proactive maintenance',
      'Security updates and licenses included',
      'Hardware replacement assistance',
      'Unlimited support tickets',
      'All security licenses included',
      'Priority response time'
    ],
    featuresNL: [
      '24/7 monitoring en ondersteuning',
      'Ter plaatse bezoeken inbegrepen',
      'Proactief onderhoud',
      'Beveiligingsupdates en licenties inbegrepen',
      'Hardware vervangingsassistentie',
      'Onbeperkte support tickets',
      'Alle beveiligingslicenties inbegrepen',
      'Prioriteit reactietijd'
    ]
  },
  {
    id: 'microsoft-365-business-basic',
    name: 'Microsoft 365 Business Basic',
    nameNL: 'Microsoft 365 Business Basic',
    description: 'Basic productivity suite - Web apps only',
    descriptionNL: 'Basis productiviteitssuite - Alleen web apps',
    icon: '📊',
    unit: 'licenses',
    unitNL: 'licenties',
    minQuantity: 1,
    maxQuantity: 1000,
    basePrice: 0,
    pricePerUnit: 6.00,
    yearlyDiscount: 10,
    features: [
      'Web versions of Office apps',
      'Outlook email',
      'OneDrive storage (1TB)',
      'Teams collaboration',
      'SharePoint'
    ],
    featuresNL: [
      'Web versies van Office apps',
      'Outlook e-mail',
      'OneDrive opslag (1TB)',
      'Teams samenwerking',
      'SharePoint'
    ]
  },
  {
    id: 'microsoft-365-business-standard',
    name: 'Microsoft 365 Business Standard',
    nameNL: 'Microsoft 365 Business Standard',
    description: 'Full productivity suite with desktop apps',
    descriptionNL: 'Volledige productiviteitssuite met desktop apps',
    icon: '💼',
    unit: 'licenses',
    unitNL: 'licenties',
    minQuantity: 1,
    maxQuantity: 1000,
    basePrice: 0,
    pricePerUnit: 12.50,
    yearlyDiscount: 10,
    features: [
      'Desktop Office apps (Word, Excel, PowerPoint)',
      'Outlook email',
      'OneDrive storage (1TB)',
      'Teams collaboration',
      'SharePoint',
      'Mobile apps'
    ],
    featuresNL: [
      'Desktop Office apps (Word, Excel, PowerPoint)',
      'Outlook e-mail',
      'OneDrive opslag (1TB)',
      'Teams samenwerking',
      'SharePoint',
      'Mobiele apps'
    ]
  },
  {
    id: 'microsoft-365-business-premium',
    name: 'Microsoft 365 Business Premium',
    nameNL: 'Microsoft 365 Business Premium',
    description: 'Complete business suite with advanced security',
    descriptionNL: 'Volledige zakelijke suite met geavanceerde beveiliging',
    icon: '🛡️',
    unit: 'licenses',
    unitNL: 'licenties',
    minQuantity: 1,
    maxQuantity: 1000,
    basePrice: 0,
    pricePerUnit: 22.00,
    yearlyDiscount: 10,
    features: [
      'Desktop Office apps (Word, Excel, PowerPoint)',
      'Outlook email',
      'OneDrive storage (1TB)',
      'Teams collaboration',
      'SharePoint',
      'Advanced security features',
      'Intune device management',
      'Advanced threat protection'
    ],
    featuresNL: [
      'Desktop Office apps (Word, Excel, PowerPoint)',
      'Outlook e-mail',
      'OneDrive opslag (1TB)',
      'Teams samenwerking',
      'SharePoint',
      'Geavanceerde beveiligingsfuncties',
      'Intune apparaatbeheer',
      'Geavanceerde dreigingsbeveiliging'
    ]
  },
  {
    id: 'voip-lines',
    name: 'VoIP Phone Lines',
    nameNL: 'VoIP Telefoonlijnen',
    description: 'Business phone system',
    descriptionNL: 'Zakelijk telefoonsysteem',
    icon: '📞',
    unit: 'lines',
    unitNL: 'lijnen',
    minQuantity: 1,
    maxQuantity: 200,
    basePrice: 15,
    pricePerUnit: 8.50,
    yearlyDiscount: 12,
    features: [
      'Unlimited calling within Netherlands',
      'Voicemail to email',
      'Call forwarding',
      'Conference calling',
      'Mobile app integration',
      'Call analytics'
    ],
    featuresNL: [
      'Onbeperkt bellen binnen Nederland',
      'Voicemail naar e-mail',
      'Doorschakelen',
      'Conferentiegesprekken',
      'Mobiele app integratie',
      'Gesprek analytics'
    ]
  },
  {
    id: 'support-hours',
    name: 'Support Hours',
    nameNL: 'Ondersteuningsuren',
    description: 'Additional technical support',
    descriptionNL: 'Extra technische ondersteuning',
    icon: '🔧',
    unit: 'hours',
    unitNL: 'uren',
    minQuantity: 5,
    maxQuantity: 200,
    basePrice: 0,
    pricePerUnit: 85,
    yearlyDiscount: 8,
    features: [
      'On-site technical support',
      'System optimization',
      'Training sessions',
      'Custom integrations',
      'Project management',
      'Emergency response'
    ],
    featuresNL: [
      'Technische ondersteuning ter plaatse',
      'Systeemoptimalisatie',
      'Trainingsessies',
      'Aangepaste integraties',
      'Projectbeheer',
      'Noodrespons'
    ]
  }
]

export const calculateServicePrice = (
  service: ServiceCategory,
  quantity: number,
  isYearly: boolean = false
): { monthly: number; yearly: number; discount: number } => {
  const monthlyPrice = service.basePrice + (service.pricePerUnit * quantity)
  const yearlyPrice = monthlyPrice * 12
  const discountAmount = yearlyPrice * (service.yearlyDiscount / 100)
  const discountedYearly = yearlyPrice - discountAmount

  return {
    monthly: monthlyPrice,
    yearly: isYearly ? discountedYearly : yearlyPrice,
    discount: discountAmount
  }
}

export const generateQuote = (
  services: { serviceId: string; quantity: number }[]
): PricingQuote => {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

  const quoteServices = services.map(({ serviceId, quantity }) => {
    const service = serviceCategories.find(s => s.id === serviceId)
    if (!service) throw new Error(`Service ${serviceId} not found`)

    const prices = calculateServicePrice(service, quantity)
    return {
      serviceId,
      quantity,
      monthlyPrice: prices.monthly,
      yearlyPrice: prices.yearly
    }
  })

  const totalMonthly = quoteServices.reduce((sum, s) => sum + s.monthlyPrice, 0)
  const totalYearly = quoteServices.reduce((sum, s) => sum + s.yearlyPrice, 0)
  const yearlyDiscount = (totalMonthly * 12) - totalYearly

  return {
    id: `quote-${now.getTime()}`,
    services: quoteServices,
    totalMonthly,
    totalYearly,
    yearlyDiscount,
    generatedAt: now,
    expiresAt
  }
}