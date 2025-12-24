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
    id: 'ad-hoc',
    name: 'Ad-hoc Support',
    nameNL: 'Ad-hoc Ondersteuning',
    description: 'Pay-per-hour IT support - You break, we fix',
    descriptionNL: 'Betaal per uur IT ondersteuning - You break, we fix',
    icon: '⚡',
    unit: 'hours',
    unitNL: 'uren',
    minQuantity: 1,
    maxQuantity: 100,
    basePrice: 0,
    pricePerUnit: 110,
    yearlyDiscount: 0,
    features: [
      'Pay only for what you use',
      'Billed after service',
      '150% rate after 19:00 and weekends',
      'Lower priority response',
      'No guaranteed response time',
      'You break, we fix approach'
    ],
    featuresNL: [
      'Betaal alleen wat je gebruikt',
      'Achteraf gefactureerd',
      '150% tarief na 19:00 en weekenden',
      'Lagere prioriteit respons',
      'Geen gegarandeerde responstijd',
      'You break, we fix aanpak'
    ]
  },
  {
    id: 'prepaid-10',
    name: 'Pre-Paid 10 Hours',
    nameNL: 'Pre-Paid 10 Uur',
    description: 'Prepaid support bundle - Best value',
    descriptionNL: 'Vooruitbetaald support bundel - Beste waarde',
    icon: '📦',
    unit: 'package',
    unitNL: 'pakket',
    minQuantity: 1,
    maxQuantity: 10,
    basePrice: 1000,
    pricePerUnit: 0,
    yearlyDiscount: 0,
    features: [
      '10 support hours (€100/hour)',
      'High priority response',
      '4-hour guaranteed response time',
      '12 months validity',
      'Monthly balance updates',
      'Best hourly rate'
    ],
    featuresNL: [
      '10 support uren (€100/uur)',
      'Hoge prioriteit respons',
      '4 uur gegarandeerde responstijd',
      '12 maanden geldig',
      'Maandelijkse saldo updates',
      'Beste uurtarief'
    ]
  },
  {
    id: 'prepaid-20',
    name: 'Pre-Paid 20 Hours',
    nameNL: 'Pre-Paid 20 Uur',
    description: 'Prepaid support bundle - Maximum savings',
    descriptionNL: 'Vooruitbetaald support bundel - Maximale besparing',
    icon: '🎯',
    unit: 'package',
    unitNL: 'pakket',
    minQuantity: 1,
    maxQuantity: 10,
    basePrice: 1800,
    pricePerUnit: 0,
    yearlyDiscount: 0,
    features: [
      '20 support hours (€90/hour)',
      'High priority response',
      '4-hour guaranteed response time',
      '12 months validity',
      'Monthly balance updates',
      'Lowest hourly rate'
    ],
    featuresNL: [
      '20 support uren (€90/uur)',
      'Hoge prioriteit respons',
      '4 uur gegarandeerde responstijd',
      '12 maanden geldig',
      'Maandelijkse saldo updates',
      'Laagste uurtarief'
    ]
  },
  {
    id: 'fixed-fee-remote',
    name: 'Fixed-Fee Remote Support',
    nameNL: 'Fixed-Fee Remote Ondersteuning',
    description: 'Unlimited remote support - All You Can Eat',
    descriptionNL: 'Onbeperkte remote ondersteuning - All You Can Eat',
    icon: '💻',
    unit: 'users',
    unitNL: 'gebruikers',
    minQuantity: 1,
    maxQuantity: 500,
    basePrice: 0,
    pricePerUnit: 60,
    yearlyDiscount: 15,
    features: [
      'Unlimited remote support',
      'Support via tickets, email, Teams, WhatsApp, phone',
      'All security licenses included',
      'Proactive monitoring',
      'Regular maintenance',
      'Complete digital wellbeing responsibility',
      'Office 365 not included'
    ],
    featuresNL: [
      'Onbeperkte remote ondersteuning',
      'Support via tickets, email, Teams, WhatsApp, telefoon',
      'Alle beveiligingslicenties inbegrepen',
      'Proactieve monitoring',
      'Regelmatig onderhoud',
      'Complete digitale welzijn verantwoordelijkheid',
      'Office 365 niet inbegrepen'
    ]
  },
  {
    id: 'fixed-fee-onsite',
    name: 'Fixed-Fee Onsite Support',
    nameNL: 'Fixed-Fee Onsite Ondersteuning',
    description: 'Unlimited support including onsite visits',
    descriptionNL: 'Onbeperkte ondersteuning inclusief ter plaatse bezoeken',
    icon: '🏢',
    unit: 'users',
    unitNL: 'gebruikers',
    minQuantity: 1,
    maxQuantity: 500,
    basePrice: 0,
    pricePerUnit: 90,
    yearlyDiscount: 15,
    features: [
      'Unlimited remote & onsite support',
      'Hardware replacement included',
      'Support via all channels',
      'All security licenses included',
      'Proactive monitoring',
      'Priority response',
      'Complete digital wellbeing responsibility',
      'Office 365 not included'
    ],
    featuresNL: [
      'Onbeperkte remote & ter plaatse ondersteuning',
      'Hardware vervanging inbegrepen',
      'Support via alle kanalen',
      'Alle beveiligingslicenties inbegrepen',
      'Proactieve monitoring',
      'Prioriteit respons',
      'Complete digitale welzijn verantwoordelijkheid',
      'Office 365 niet inbegrepen'
    ]
  },
  {
    id: 'server-support',
    name: 'Server Support',
    nameNL: 'Server Ondersteuning',
    description: 'Dedicated server management',
    descriptionNL: 'Toegewijd server beheer',
    icon: '🖥️',
    unit: 'servers',
    unitNL: 'servers',
    minQuantity: 1,
    maxQuantity: 100,
    basePrice: 0,
    pricePerUnit: 90,
    yearlyDiscount: 15,
    features: [
      '24/7 server monitoring',
      'Proactive maintenance',
      'Security patches',
      'Performance optimization',
      'Backup verification',
      'Incident response'
    ],
    featuresNL: [
      '24/7 server monitoring',
      'Proactief onderhoud',
      'Beveiligingsupdates',
      'Prestatie optimalisatie',
      'Backup verificatie',
      'Incident respons'
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
    pricePerUnit: 6.90,
    yearlyDiscount: 0,
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
    pricePerUnit: 14.30,
    yearlyDiscount: 0,
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
    pricePerUnit: 25.30,
    yearlyDiscount: 0,
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