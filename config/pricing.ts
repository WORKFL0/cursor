/**
 * Workflo Pricing Configuration
 *
 * CRITICAL: This file defines the ACTUAL Workflo business models
 * All prices are in EUR unless otherwise specified
 *
 * Business Models:
 * 1. Ad-Hoc Support: €120/hour, no contract, no SLA
 * 2. Pre-Paid Bundles: Discounted hourly rates with 12-month validity
 * 3. Fixed-Fee MSP (RECOMMENDED): Per-user monthly pricing with full service
 */

export type SupportModel = 'adhoc' | 'prepaid' | 'msp'
export type SecurityLevel = 'basic' | 'standard' | 'advanced'
export type SLALevel = 'standard' | 'priority' | 'premium'
export type MSPType = 'remote' | 'enterprise'

// ============================================================================
// PRICING CONFIGURATION - WORKFLO ACTUAL PRICING
// ============================================================================

export const WORKFLO_PRICING = {
  // -------------------------------------------------------------------------
  // AD-HOC SUPPORT (Least Attractive Option)
  // -------------------------------------------------------------------------
  adhoc: {
    name: 'Ad-Hoc Support',
    nameNL: 'Ad-Hoc Ondersteuning',
    hourlyRate: 110,
    minimumHours: 1,
    afterHoursMultiplier: 1.5, // 150% after 19:00 and weekends
    estimatedHoursPerUser: 1.2, // Average hours per user per month
    description: 'Pay per incident - You break, we fix',
    descriptionNL: 'Betaal per incident - You break, we fix',
    features: [
      'No commitment required',
      'Pay only for what you use',
      'Billed after service',
      'Lower priority response',
    ],
    featuresNL: [
      'Geen verplichtingen',
      'Betaal alleen wat je gebruikt',
      'Achteraf gefactureerd',
      'Lagere prioriteit respons',
    ],
    risks: [
      'Unpredictable costs',
      'No proactive monitoring',
      'Reactive only',
      'No SLA guarantees',
    ],
    risksNL: [
      'Onvoorspelbare kosten',
      'Geen proactieve monitoring',
      'Alleen reactief',
      'Geen SLA garanties',
    ],
  },

  // -------------------------------------------------------------------------
  // PRE-PAID BUNDLES (Flexible but Limited)
  // -------------------------------------------------------------------------
  prepaid: {
    name: 'Pre-Paid Support Bundles',
    nameNL: 'Vooruitbetaalde Support Bundels',
    bundles: [
      {
        hours: 10,
        totalPrice: 1000,
        hourlyRate: 100,
        discount: 0.167, // 16.7% discount vs ad-hoc
        name: '10-Hour Package',
        nameNL: '10-Uur Pakket',
      },
      {
        hours: 20,
        totalPrice: 1800,
        hourlyRate: 90,
        discount: 0.182, // 18.2% discount vs ad-hoc
        name: '20-Hour Package',
        nameNL: '20-Uur Pakket',
      },
      {
        hours: 40,
        totalPrice: 3600,
        hourlyRate: 90,
        discount: 0.25, // 25% discount vs ad-hoc
        name: '40-Hour Package',
        nameNL: '40-Uur Pakket',
      },
    ],
    validityMonths: 12,
    description: 'Prepaid hours with discount - Flexible usage',
    descriptionNL: 'Vooruitbetaalde uren met korting - Flexibel gebruik',
    features: [
      '12 months validity',
      'Up to 25% cheaper than ad-hoc',
      'High priority response',
      'Flexible hour allocation',
    ],
    featuresNL: [
      '12 maanden geldig',
      'Tot 25% goedkoper dan ad-hoc',
      'Hoge prioriteit respons',
      'Flexibele uren toewijzing',
    ],
    limitations: [
      'No proactive monitoring',
      'Still reactive support',
      'No guaranteed SLA',
      'Hours can expire',
    ],
    limitationsNL: [
      'Geen proactieve monitoring',
      'Nog steeds reactieve support',
      'Geen gegarandeerde SLA',
      'Uren kunnen verlopen',
    ],
  },

  // -------------------------------------------------------------------------
  // FIXED-FEE MSP (RECOMMENDED - Most Attractive)
  // -------------------------------------------------------------------------
  msp: {
    name: 'Fixed-Fee Managed Services',
    nameNL: 'Fixed-Fee Managed Services',
    tagline: 'All You Can Eat IT Support',
    taglineNL: 'All You Can Eat IT Support',

    pricing: {
      remote: {
        pricePerUser: 60,
        name: 'Remote Support',
        nameNL: 'Remote Ondersteuning',
        description: 'Full remote IT management',
        descriptionNL: 'Volledig remote IT beheer',
      },
      enterprise: {
        pricePerUser: 90,
        name: 'Enterprise (Onsite + Remote)',
        nameNL: 'Enterprise (Ter plaatse + Remote)',
        description: 'Remote + onsite support included',
        descriptionNL: 'Remote + ter plaatse ondersteuning inbegrepen',
      },
    },

    // Included in ALL MSP packages
    includedServices: [
      'Unlimited support tickets',
      '24/7 proactive monitoring',
      'Patch management',
      'Backup monitoring',
      'Email security',
      'Endpoint protection',
      'User onboarding/offboarding',
      'IT planning & vCIO',
      'Monthly reports',
      'Security updates',
    ],
    includedServicesNL: [
      'Onbeperkte support tickets',
      '24/7 proactieve monitoring',
      'Patch management',
      'Backup monitoring',
      'Email beveiliging',
      'Endpoint beveiliging',
      'Gebruiker aan/afmelden',
      'IT planning & vCIO',
      'Maandelijkse rapportages',
      'Beveiligingsupdates',
    ],

    // Enterprise (Onsite) additional benefits
    enterpriseExtras: [
      'Onsite support visits',
      'Hardware installation',
      'Faster response times',
      'Dedicated account manager',
    ],
    enterpriseExtrasNL: [
      'Ter plaatse support bezoeken',
      'Hardware installatie',
      'Snellere responstijden',
      'Dedicated account manager',
    ],

    // SLA options (add-on pricing)
    slaOptions: {
      standard: {
        multiplier: 1.0,
        responseTime: '4 hours',
        availability: 'Business hours (9-17)',
        name: 'Standard SLA',
        nameNL: 'Standard SLA',
      },
      priority: {
        multiplier: 1.15,
        responseTime: '2 hours',
        availability: '24/7',
        name: 'Priority SLA',
        nameNL: 'Prioriteit SLA',
      },
      premium: {
        multiplier: 1.30,
        responseTime: '1 hour',
        availability: '24/7 + dedicated contact',
        name: 'Premium SLA',
        nameNL: 'Premium SLA',
      },
    },

    // Volume discounts based on user count
    volumeDiscounts: [
      { minUsers: 1, maxUsers: 9, discount: 0, name: '1-9 users' },
      { minUsers: 10, maxUsers: 24, discount: 0.05, name: '10-24 users' },
      { minUsers: 25, maxUsers: 49, discount: 0.10, name: '25-49 users' },
      { minUsers: 50, maxUsers: 99, discount: 0.15, name: '50-99 users' },
      { minUsers: 100, maxUsers: Infinity, discount: 0.20, name: '100+ users' },
    ],

    description: 'Predictable monthly cost - Unlimited support',
    descriptionNL: 'Voorspelbare maandkosten - Onbeperkte support',

    benefits: [
      'Predictable monthly costs',
      '35% cheaper than ad-hoc',
      'Proactive problem prevention',
      'Unlimited support included',
      'Strategic IT partnership',
      'No surprise bills',
    ],
    benefitsNL: [
      'Voorspelbare maandkosten',
      '35% goedkoper dan ad-hoc',
      'Proactieve probleempreventie',
      'Onbeperkte support inbegrepen',
      'Strategisch IT partnerschap',
      'Geen verrassende rekeningen',
    ],
  },

  // -------------------------------------------------------------------------
  // MICROSOFT 365 (Pass-through pricing)
  // -------------------------------------------------------------------------
  microsoft365: {
    businessBasic: {
      price: 6.90,
      name: 'Microsoft 365 Business Basic',
      features: ['Web apps only', 'Email', '1TB OneDrive'],
    },
    businessStandard: {
      price: 14.30,
      name: 'Microsoft 365 Business Standard',
      features: ['Desktop apps', 'Email', '1TB OneDrive'],
    },
    businessPremium: {
      price: 25.30,
      name: 'Microsoft 365 Business Premium',
      features: ['Desktop apps', 'Advanced security', 'Device management'],
    },
  },
}

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate Ad-Hoc Support Pricing
 */
export function calculateAdhocPricing(params: {
  users: number
  estimatedHoursPerMonth?: number
}) {
  const { users, estimatedHoursPerMonth } = params
  const config = WORKFLO_PRICING.adhoc

  // Estimate hours if not provided
  const hours = estimatedHoursPerMonth || users * config.estimatedHoursPerUser

  // Base cost
  const regularHours = hours * 0.9 // 90% during business hours
  const afterHours = hours * 0.1 // 10% after hours

  const regularCost = regularHours * config.hourlyRate
  const afterHoursCost = afterHours * config.hourlyRate * config.afterHoursMultiplier

  const monthlyTotal = regularCost + afterHoursCost
  const yearlyTotal = monthlyTotal * 12

  return {
    model: 'adhoc' as const,
    monthlyTotal,
    yearlyTotal,
    estimatedHours: hours,
    hourlyRate: config.hourlyRate,
    breakdown: {
      regularHours: regularCost,
      afterHours: afterHoursCost,
      totalHours: hours,
    },
    features: config.features,
    risks: config.risks,
  }
}

/**
 * Calculate Pre-Paid Bundle Pricing
 */
export function calculatePrepaidPricing(params: {
  users: number
  bundleIndex?: number // 0=10h, 1=20h, 2=40h
}) {
  const { users, bundleIndex = 1 } = params // Default to 20-hour package
  const bundle = WORKFLO_PRICING.prepaid.bundles[bundleIndex]
  const config = WORKFLO_PRICING.prepaid

  // Estimate how many bundles needed per year
  const estimatedHoursPerYear = users * WORKFLO_PRICING.adhoc.estimatedHoursPerUser * 12
  const bundlesNeeded = Math.ceil(estimatedHoursPerYear / bundle.hours)

  const totalCost = bundlesNeeded * bundle.totalPrice
  const monthlyTotal = totalCost / 12
  const yearlyTotal = totalCost

  return {
    model: 'prepaid' as const,
    monthlyTotal,
    yearlyTotal,
    bundlesNeeded,
    bundle: {
      hours: bundle.hours,
      price: bundle.totalPrice,
      hourlyRate: bundle.hourlyRate,
      discount: bundle.discount,
    },
    breakdown: {
      totalHours: bundlesNeeded * bundle.hours,
      totalBundles: bundlesNeeded,
      costPerBundle: bundle.totalPrice,
    },
    features: config.features,
    limitations: config.limitations,
  }
}

/**
 * Calculate Fixed-Fee MSP Pricing (RECOMMENDED)
 */
export function calculateMSPPricing(params: {
  users: number
  mspType?: MSPType
  slaLevel?: SLALevel
}) {
  const { users, mspType = 'remote', slaLevel = 'standard' } = params
  const config = WORKFLO_PRICING.msp

  // Base pricing
  const basePrice = config.pricing[mspType].pricePerUser
  const baseCost = users * basePrice

  // Apply SLA multiplier
  const slaMultiplier = config.slaOptions[slaLevel].multiplier
  const costWithSLA = baseCost * slaMultiplier

  // Apply volume discount
  const volumeDiscount = getVolumeDiscount(users)
  const discountAmount = costWithSLA * volumeDiscount
  const costAfterDiscount = costWithSLA - discountAmount

  const monthlyTotal = costAfterDiscount
  const yearlyTotal = monthlyTotal * 12

  return {
    model: 'msp' as const,
    monthlyTotal,
    yearlyTotal,
    breakdown: {
      basePrice,
      baseCost,
      slaMultiplier,
      costWithSLA,
      volumeDiscount,
      discountAmount,
      finalCost: costAfterDiscount,
    },
    config: {
      users,
      mspType,
      slaLevel,
      pricePerUser: basePrice,
    },
    features: [
      ...config.includedServices,
      ...(mspType === 'enterprise' ? config.enterpriseExtras : []),
    ],
    benefits: config.benefits,
  }
}

/**
 * Get volume discount based on user count
 */
export function getVolumeDiscount(users: number): number {
  const tier = WORKFLO_PRICING.msp.volumeDiscounts.find(
    (tier) => users >= tier.minUsers && users <= tier.maxUsers
  )
  return tier?.discount || 0
}

/**
 * Calculate savings comparing MSP to Ad-Hoc
 */
export function calculateSavings(
  mspMonthly: number,
  adhocMonthly: number
) {
  const monthlySavings = adhocMonthly - mspMonthly
  const yearlySavings = monthlySavings * 12
  const percentageSavings = Math.round((monthlySavings / adhocMonthly) * 100)

  return {
    monthly: monthlySavings,
    yearly: yearlySavings,
    percentage: percentageSavings,
    threeYear: yearlySavings * 3,
    fiveYear: yearlySavings * 5,
  }
}

/**
 * Calculate complete comparison of all models
 */
export function calculateCompleteComparison(params: {
  users: number
  mspType?: MSPType
  slaLevel?: SLALevel
}) {
  const adhoc = calculateAdhocPricing({ users: params.users })
  const prepaid = calculatePrepaidPricing({ users: params.users })
  const msp = calculateMSPPricing(params)
  const savings = calculateSavings(msp.monthlyTotal, adhoc.monthlyTotal)

  return {
    adhoc,
    prepaid,
    msp,
    savings,
    recommended: 'msp' as const,
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format currency in EUR
 */
export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Get recommended bundle index based on usage
 */
export function getRecommendedBundle(users: number): number {
  const estimatedHoursPerYear = users * WORKFLO_PRICING.adhoc.estimatedHoursPerUser * 12

  if (estimatedHoursPerYear <= 120) return 0 // 10h bundle
  if (estimatedHoursPerYear <= 240) return 1 // 20h bundle
  return 2 // 40h bundle
}
