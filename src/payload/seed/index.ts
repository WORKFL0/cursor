import { getPayload } from 'payload'
import config from '@payload-config'

const seed = async () => {
  const payload = await getPayload({ config })

  try {
    console.log('Seeding database...')

    // Create initial admin user
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (existingUsers.docs.length === 0) {
      const adminUser = await payload.create({
        collection: 'users',
        data: {
          email: 'admin@workflo.it',
          password: 'admin123',
          firstName: 'Admin',
          lastName: 'User',
          role: 'super-admin',
        },
      })
      console.log('Created admin user:', adminUser.email)
    }

    // Seed Site Settings
    try {
      await payload.updateGlobal({
        slug: 'site-settings',
        data: {
          general: {
            siteName: 'Workflo',
            siteUrl: 'https://workflo.it',
            tagline: 'Your IT Should Drive Growth—Not Hold You Back',
            description: 'Amsterdam\'s Trusted IT Growth Partner - Managed IT, Cloud Solutions & Cybersecurity',
            defaultLanguage: 'nl',
          },
          contact: {
            email: 'info@workflo.it',
            phone: '020-30 80 465',
            address: {
              street: 'Koivistokade 3',
              city: 'Amsterdam',
              postalCode: '1013 AC',
              country: 'Netherlands',
            },
            businessHours: {
              weekdays: 'Monday - Friday: 8:00 - 18:00',
              emergency: '24/7 Support for contract clients',
            },
          },
          social: {
            linkedin: 'https://linkedin.com/company/workflo-it',
          },
          features: {
            enableBlog: true,
            enableTestimonials: true,
            enableCaseStudies: true,
            enableNewsletter: true,
            enableMultiLanguage: true,
            enableDarkMode: true,
          },
          legal: {
            privacyPolicyUrl: '/privacy',
            termsOfServiceUrl: '/terms',
            cookiePolicyUrl: '/cookies',
            enableCookieConsent: true,
          },
        },
      })
      console.log('Site settings updated')
    } catch (error) {
      console.error('Error updating site settings:', error)
    }

    // Seed Company Info
    try {
      await payload.updateGlobal({
        slug: 'company-info',
        data: {
          basic: {
            legalName: 'Workflo B.V.',
            tradingName: 'Workflo',
            founded: '2015',
            employeeCount: '4',
          },
          mission: {
            missionStatement: [
              {
                children: [
                  {
                    text: 'To transform technology from a cost center into a growth engine for Amsterdam businesses.',
                  },
                ],
              },
            ],
            valueProposition: [
              {
                children: [
                  {
                    text: 'We provide reliable, proactive IT services that let business owners focus on what they do best - growing their business.',
                  },
                ],
              },
            ],
          },
          values: [
            {
              title: 'Reliability',
              description: [
                {
                  children: [
                    {
                      text: 'We do what we promise. No surprises, no hidden costs.',
                    },
                  ],
                },
              ],
              order: 1,
            },
            {
              title: 'Expertise',
              description: [
                {
                  children: [
                    {
                      text: 'Certified specialists with years of experience across diverse sectors.',
                    },
                  ],
                },
              ],
              order: 2,
            },
            {
              title: 'Proactivity',
              description: [
                {
                  children: [
                    {
                      text: 'We prevent problems before they arise through smart monitoring.',
                    },
                  ],
                },
              ],
              order: 3,
            },
            {
              title: 'Partnership',
              description: [
                {
                  children: [
                    {
                      text: 'We think along with your business and grow together with you.',
                    },
                  ],
                },
              ],
              order: 4,
            },
          ],
          statistics: [
            {
              label: 'Happy Clients',
              value: '250+',
              featured: true,
              showOnHomepage: true,
              order: 1,
            },
            {
              label: 'Years Experience',
              value: '10+',
              featured: true,
              showOnHomepage: true,
              order: 2,
            },
            {
              label: 'Uptime Guarantee',
              value: '99.9%',
              featured: true,
              showOnHomepage: true,
              order: 3,
            },
            {
              label: 'Support Available',
              value: '24/7',
              featured: true,
              showOnHomepage: true,
              order: 4,
            },
          ],
        },
      })
      console.log('Company info updated')
    } catch (error) {
      console.error('Error updating company info:', error)
    }

    // Create sample services
    const existingServices = await payload.find({
      collection: 'services',
      limit: 1,
    })

    if (existingServices.docs.length === 0) {
      const sampleServices = [
        {
          title: 'Managed IT Services',
          slug: 'managed-it',
          category: 'managed-it',
          description: 'Complete IT management and support with 24/7 monitoring, unlimited remote support, and predictable monthly costs.',
          features: [
            { feature: '24/7 monitoring' },
            { feature: 'Unlimited remote support' },
            { feature: '1-hour response time' },
            { feature: 'On-site support when needed' },
            { feature: 'Proactive maintenance' },
          ],
          pricing: {
            basePrice: 60,
            currency: 'EUR',
            period: 'monthly',
            priceDescription: 'per computer per month',
          },
          status: 'published',
          featured: true,
          order: 1,
        },
        {
          title: 'Microsoft 365 Migration',
          slug: 'microsoft-365',
          category: 'cloud',
          description: 'Seamless migration to Microsoft 365 with minimal downtime and maximum productivity gains.',
          features: [
            { feature: 'Email migration' },
            { feature: 'Data migration' },
            { feature: 'User training' },
            { feature: 'Security setup' },
            { feature: 'Ongoing support' },
          ],
          pricing: {
            customPricing: true,
            priceDescription: 'Contact for quote',
          },
          status: 'published',
          featured: true,
          order: 2,
        },
        {
          title: 'Cybersecurity Solutions',
          slug: 'cybersecurity',
          category: 'security',
          description: 'Comprehensive security solutions to protect your business from cyber threats and ensure GDPR compliance.',
          features: [
            { feature: 'Advanced threat detection' },
            { feature: 'Security awareness training' },
            { feature: 'GDPR compliance' },
            { feature: 'Incident response' },
            { feature: 'Regular security audits' },
          ],
          pricing: {
            customPricing: true,
            priceDescription: 'Based on company size and requirements',
          },
          status: 'published',
          featured: true,
          order: 3,
        },
      ]

      for (const service of sampleServices) {
        await payload.create({
          collection: 'services',
          data: service,
        })
      }
      console.log('Sample services created')
    }

    console.log('Database seeding completed successfully!')
    process.exit(0)

  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seed()