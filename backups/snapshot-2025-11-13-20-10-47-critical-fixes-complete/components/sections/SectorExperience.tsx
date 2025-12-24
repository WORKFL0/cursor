'use client'

import { motion } from '@/lib/framer-motion'
import { useLanguage } from '@/lib/contexts/language-context'

const sectors = [
  {
    name: 'Gezondheidszorg',
    nameEN: 'Healthcare',
    logo: '/images/logos/healthcare-sector.svg',
    description: 'Gespecialiseerde IT-oplossingen voor ziekenhuizen, klinieken en zorginstellingen',
    descriptionEN: 'Specialized IT solutions for hospitals, clinics and healthcare institutions',
    companies: ['HAP Elings', 'Doctor Feelgood'],
    color: 'emerald',
    stats: {
      nl: '15+ zorginstellingen',
      en: '15+ healthcare institutions'
    }
  },
  {
    name: 'Financiële Dienstverlening',
    nameEN: 'Financial Services',
    logo: '/images/logos/financial-sector.svg',
    description: 'Veilige en compliante IT-infrastructuur voor financiële instellingen',
    descriptionEN: 'Secure and compliant IT infrastructure for financial institutions',
    companies: ['Aescap', 'BLC FinanceView'],
    color: 'blue',
    stats: {
      nl: '8+ financiële partners',
      en: '8+ financial partners'
    }
  },
  {
    name: 'Retail & E-commerce',
    nameEN: 'Retail & E-commerce',
    logo: '/images/logos/retail-sector.svg',
    description: 'Complete IT-ondersteuning voor retail en e-commerce bedrijven',
    descriptionEN: 'Complete IT support for retail and e-commerce businesses',
    companies: ['Daily Paper', 'LaDress', 'Bijvoorkeur', 'Klaar'],
    color: 'amber',
    stats: {
      nl: '12+ retail klanten',
      en: '12+ retail clients'
    }
  }
]

const colorClasses = {
  emerald: {
    bg: 'bg-emerald-50 hover:bg-emerald-100',
    border: 'border-emerald-200 hover:border-emerald-300',
    text: 'text-emerald-700',
    accent: 'text-emerald-600',
    icon: 'text-emerald-500'
  },
  blue: {
    bg: 'bg-blue-50 hover:bg-blue-100',
    border: 'border-blue-200 hover:border-blue-300',
    text: 'text-blue-700',
    accent: 'text-blue-600',
    icon: 'text-blue-500'
  },
  amber: {
    bg: 'bg-amber-50 hover:bg-amber-100',
    border: 'border-amber-200 hover:border-amber-300',
    text: 'text-amber-700',
    accent: 'text-amber-600',
    icon: 'text-amber-500'
  }
}

export default function SectorExperience() {
  const { language } = useLanguage()

  return (
    <section className="workflo-section-spacing bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center workflo-block-spacing">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="workflo-h2 text-workflo-navy dark:text-white mb-4"
          >
            {language === 'nl' ? 'Sector Ervaring' : 'Industry Expertise'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="workflo-body text-workflo-gray dark:text-gray-300 max-w-3xl mx-auto"
          >
            {language === 'nl'
              ? 'Wij begrijpen de unieke IT-uitdagingen van verschillende sectoren en bieden oplossingen op maat'
              : 'We understand the unique IT challenges of different industries and provide tailored solutions'
            }
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {sectors.map((sector, index) => {
            const colors = colorClasses[sector.color as keyof typeof colorClasses]
            
            return (
              <motion.div
                key={sector.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative rounded-2xl p-6 lg:p-8 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${colors.bg} ${colors.border}`}
              >
                {/* Logo */}
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-16 lg:w-32 lg:h-20 flex items-center justify-center">
                    <img 
                      src={sector.logo} 
                      alt={language === 'nl' ? sector.name : sector.nameEN}
                      className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-4">
                  <h3 className={`workflo-h3 ${colors.text}`}>
                    {language === 'nl' ? sector.name : sector.nameEN}
                  </h3>

                  <p className="workflo-body text-workflo-gray dark:text-gray-300">
                    {language === 'nl' ? sector.description : sector.descriptionEN}
                  </p>

                  {/* Stats */}
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.accent} bg-white/50`}>
                    {language === 'nl' ? sector.stats.nl : sector.stats.en}
                  </div>

                  {/* Company examples */}
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">
                      {language === 'nl' ? 'Inclusief:' : 'Including:'}
                    </p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {sector.companies.slice(0, 3).map((company, i) => (
                        <span key={i} className={`text-xs px-2 py-1 rounded-full bg-white/70 ${colors.text}`}>
                          {company}
                        </span>
                      ))}
                      {sector.companies.length > 3 && (
                        <span className={`text-xs px-2 py-1 rounded-full bg-white/70 ${colors.text}`}>
                          +{sector.companies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12 lg:mt-16"
        >
          <p className="text-lg text-muted-foreground mb-6">
            {language === 'nl' 
              ? 'Staat jouw sector er niet tussen? Geen probleem!'
              : "Don't see your industry? No problem!"
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {language === 'nl' ? 'Plan gratis IT-scan' : 'Schedule free IT assessment'}
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/sectoren"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-primary bg-transparent border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {language === 'nl' ? 'Alle sectoren bekijken' : 'View all sectors'}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}