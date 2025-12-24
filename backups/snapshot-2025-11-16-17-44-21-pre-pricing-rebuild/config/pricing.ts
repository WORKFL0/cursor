/**
 * Pricing Configuration for Workflo IT Services
 *
 * This file contains all pricing logic and configuration for the pricing calculator.
 * All prices are in EUR per month unless otherwise specified.
 */

export type SupportModel = 'adhoc' | 'prepaid' | 'managed'
export type SecurityLevel = 'low' | 'medium' | 'high'
export type SLALevel = '4h' | '2h' | '1h'

// Base pricing configuration
export const PRICING_CONFIG = {
  // Ad-hoc Support Model
  adhoc: {
    hourlyRate: 110,
    afterHoursMultiplier: 1.5,
    estimatedHoursPerEmployee: 1.15,
    estimatedHoursPerServer: 5,
    variabilityCost: 0.1, // 10% unpredictability markup
  },

  // Prepaid Strippenkaart Model
  prepaid: {
    hourlyRate: 90, // €1800 / 20 hours
    packageSize: 20, // hours per package
    packagePrice: 1800,
    validityMonths: 3,
    discountVsAdhoc: 0.18, // 18% cheaper than ad-hoc
  },

  // Managed IT Model (Fixed Monthly Fee)
  managed: {
    pricePerEmployee: {
      remote: 60,
      onsite: 90,
    },
    pricePerWorkstation: {
      remote: 60,
      onsite: 90,
    },
    pricePerServer: {
      remote: 60,
      onsite: 90,
    },
    discountYearly: 0.10, // 10% discount for annual commitment
    discountVsAdhoc: 0.35, // 35% cheaper than ad-hoc
    includedServices: [
      'Proactive monitoring',
      '24/7 remote support',
      'Onsite support (based on SLA)',
      'Patch management',
      'Backup monitoring',
      'Security updates',
      'IT planning & consulting',
      'User onboarding/offboarding',
      'Documentation',
      'Monthly reports',
    ],
  },

  // Security Level Pricing (add-on)
  security: {
    low: {
      pricePerEmployee: 0,
      features: ['Basic antivirus', 'Firewall'],
    },
    medium: {
      pricePerEmployee: 15,
      features: ['EDR', 'Email security', 'MFA', 'Security training'],
    },
    high: {
      pricePerEmployee: 30,
      features: ['XDR', 'SOC monitoring', 'Incident response', 'Penetration testing', 'Compliance reporting'],
    },
  },

  // SLA Level Pricing (add-on)
  sla: {
    '4h': {
      multiplier: 1.0,
      responseTime: '4 hours',
      availability: 'Business hours (9-17)',
    },
    '2h': {
      multiplier: 1.15,
      responseTime: '2 hours',
      availability: '24/7',
    },
    '1h': {
      multiplier: 1.30,
      responseTime: '1 hour',
      availability: '24/7 + dedicated contact',
    },
  },

  // Microsoft 365 Licenses (pass-through pricing)
  microsoft365: {
    businessBasic: 6.90,
    businessStandard: 14.30,
    businessPremium: 25.30,
  },

  // Volume discounts
  volumeDiscounts: [
    { minEmployees: 1, maxEmployees: 4, discount: 0 },
    { minEmployees: 5, maxEmployees: 9, discount: 0.05 },
    { minEmployees: 10, maxEmployees: 24, discount: 0.10 },
    { minEmployees: 25, maxEmployees: 49, discount: 0.15 },
    { minEmployees: 50, maxEmployees: 99, discount: 0.20 },
    { minEmployees: 100, maxEmployees: Infinity, discount: 0.25 },
  ],
}

/**
 * Calculate pricing for Ad-hoc support model
 */
export function calculateAdhocPricing(params: {
  employees: number
  servers: number
}) {
  const { employees, servers } = params
  const config = PRICING_CONFIG.adhoc

  // Estimate hours needed per month
  const estimatedHours =
    employees * config.estimatedHoursPerEmployee +
    servers * config.estimatedHoursPerServer

  // Base cost
  const baseCost = estimatedHours * config.hourlyRate

  // After-hours cost (10% of calls happen after hours)
  const afterHoursCost = baseCost * config.variabilityCost * config.afterHoursMultiplier

  // Total monthly cost
  const monthlyTotal = baseCost + afterHoursCost

  return {
    model: 'Ad-hoc Support' as const,
    monthlyTotal,
    yearlyTotal: monthlyTotal * 12,
    estimatedHours,
    hourlyRate: config.hourlyRate,
    breakdown: {
      regularHours: baseCost,
      afterHours: afterHoursCost,
    },
    features: [
      'Pay per incident',
      'No commitment',
      'Variable costs',
      'After-hours surcharge',
    ],
    risks: [
      'Unpredictable costs',
      'No proactive monitoring',
      'Reactive only',
      'Priority based on availability',
    ],
  }
}

/**
 * Calculate pricing for Prepaid strippenkaart model
 */
export function calculatePrepaidPricing(params: {
  employees: number
  servers: number
}) {
  const { employees, servers } = params
  const adhocConfig = PRICING_CONFIG.adhoc
  const prepaidConfig = PRICING_CONFIG.prepaid

  // Estimate hours needed per month
  const estimatedHours =
    employees * adhocConfig.estimatedHoursPerEmployee +
    servers * adhocConfig.estimatedHoursPerServer

  // Calculate packages needed (valid for 3 months)
  const totalHoursNeeded = estimatedHours * 3
  const packagesNeeded = Math.ceil(totalHoursNeeded / prepaidConfig.packageSize)

  // Monthly cost (packages divided by 3 months)
  const totalCost = packagesNeeded * prepaidConfig.packagePrice
  const monthlyTotal = totalCost / prepaidConfig.validityMonths

  return {
    model: 'Prepaid Strippenkaart' as const,
    monthlyTotal,
    yearlyTotal: monthlyTotal * 12,
    packagesNeeded,
    hoursIncluded: packagesNeeded * prepaidConfig.packageSize,
    hourlyRate: prepaidConfig.hourlyRate,
    breakdown: {
      packageCost: prepaidConfig.packagePrice,
      totalPackages: packagesNeeded,
      totalHours: packagesNeeded * prepaidConfig.packageSize,
    },
    features: [
      '20 hours per package',
      '3 months validity',
      '18% cheaper than ad-hoc',
      'Flexibility with planning',
    ],
    risks: [
      'Still unpredictable usage',
      'Hours can expire',
      'No proactive support',
      'Limited cost control',
    ],
  }
}

/**
 * Calculate pricing for Managed IT model
 */
export function calculateManagedPricing(params: {
  employees: number
  workstations?: number
  servers: number
  remoteWorkers?: number
  securityLevel: SecurityLevel
  slaLevel: SLALevel
  supportType?: 'remote' | 'onsite'
  commitmentType?: 'monthly' | 'yearly'
}) {
  const {
    employees,
    workstations = employees,
    servers,
    remoteWorkers = 0,
    securityLevel,
    slaLevel,
    supportType = 'remote',
    commitmentType = 'monthly',
  } = params

  const managedConfig = PRICING_CONFIG.managed
  const securityConfig = PRICING_CONFIG.security[securityLevel]
  const slaConfig = PRICING_CONFIG.sla[slaLevel]

  // Base support cost
  const employeeCost = employees * managedConfig.pricePerEmployee[supportType]
  const workstationCost = workstations * managedConfig.pricePerWorkstation[supportType]
  const serverCost = servers * managedConfig.pricePerServer[supportType]

  const baseSupportCost = employeeCost + serverCost

  // Apply SLA multiplier
  const supportCostWithSLA = baseSupportCost * slaConfig.multiplier

  // Security add-on
  const securityCost = employees * securityConfig.pricePerEmployee

  // Total before volume discount
  const totalBeforeDiscount = supportCostWithSLA + securityCost

  // Apply volume discount
  const volumeDiscount = getVolumeDiscount(employees)
  const totalAfterVolumeDiscount = totalBeforeDiscount * (1 - volumeDiscount)

  // Apply yearly commitment discount
  const yearlyDiscount = commitmentType === 'yearly' ? managedConfig.discountYearly : 0
  const monthlyTotal = totalAfterVolumeDiscount * (1 - yearlyDiscount)

  return {
    model: 'Managed IT' as const,
    monthlyTotal,
    yearlyTotal: monthlyTotal * 12,
    breakdown: {
      employeeCost,
      serverCost,
      securityCost,
      slaMultiplier: slaConfig.multiplier,
      volumeDiscount,
      yearlyDiscount,
    },
    features: [
      ...managedConfig.includedServices,
      ...securityConfig.features,
      `${slaConfig.responseTime} response time`,
      `${slaConfig.availability} availability`,
    ],
    benefits: [
      'Predictable monthly costs',
      'Proactive monitoring',
      'Unlimited support tickets',
      `${Math.round(PRICING_CONFIG.managed.discountVsAdhoc * 100)}% cheaper than ad-hoc`,
      'No hidden fees',
      'Strategic IT planning included',
    ],
  }
}

/**
 * Get volume discount based on number of employees
 */
export function getVolumeDiscount(employees: number): number {
  const tier = PRICING_CONFIG.volumeDiscounts.find(
    (tier) => employees >= tier.minEmployees && employees <= tier.maxEmployees
  )
  return tier?.discount || 0
}

/**
 * Calculate savings when comparing models
 */
export function calculateSavings(
  managedCost: number,
  adhocCost: number
) {
  const monthlySavings = adhocCost - managedCost
  const yearlySavings = monthlySavings * 12
  const percentageSavings = Math.round((monthlySavings / adhocCost) * 100)

  return {
    monthly: monthlySavings,
    yearly: yearlySavings,
    percentage: percentageSavings,
  }
}

/**
 * Calculate ROI for managed IT investment
 */
export function calculateROI(params: {
  employees: number
  servers: number
  securityLevel: SecurityLevel
  slaLevel: SLALevel
  supportType?: 'remote' | 'onsite'
}) {
  const adhocPricing = calculateAdhocPricing(params)
  const managedPricing = calculateManagedPricing(params)
  const savings = calculateSavings(managedPricing.monthlyTotal, adhocPricing.monthlyTotal)

  // Calculate payback period (if any setup costs)
  const setupCost = 0 // No setup costs for managed IT
  const paybackMonths = setupCost > 0 ? Math.ceil(setupCost / savings.monthly) : 0

  return {
    monthlySavings: savings.monthly,
    yearlySavings: savings.yearly,
    percentageSavings: savings.percentage,
    paybackMonths,
    threeYearSavings: savings.yearly * 3,
    fiveYearSavings: savings.yearly * 5,
  }
}
