import type { GlobalConfig } from 'payload/types'

const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'general',
      type: 'group',
      fields: [
        {
          name: 'siteName',
          type: 'text',
          required: true,
          defaultValue: 'Workflo',
          localized: true,
        },
        {
          name: 'siteUrl',
          type: 'text',
          required: true,
          defaultValue: 'https://workflo.it',
        },
        {
          name: 'tagline',
          type: 'text',
          required: true,
          localized: true,
          defaultValue: 'Your IT Should Drive Growth—Not Hold You Back',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          localized: true,
          defaultValue: 'Amsterdam\'s Trusted IT Growth Partner - Managed IT, Cloud Solutions & Cybersecurity',
        },
        {
          name: 'defaultLanguage',
          type: 'select',
          required: true,
          defaultValue: 'nl',
          options: [
            {
              label: 'Dutch',
              value: 'nl',
            },
            {
              label: 'English',
              value: 'en',
            },
          ],
        },
        {
          name: 'favicon',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'logoWhite',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
          defaultValue: 'info@workflo.it',
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
          defaultValue: '020-30 80 465',
        },
        {
          name: 'address',
          type: 'group',
          fields: [
            {
              name: 'street',
              type: 'text',
              required: true,
              defaultValue: 'Koivistokade 3',
            },
            {
              name: 'city',
              type: 'text',
              required: true,
              defaultValue: 'Amsterdam',
            },
            {
              name: 'postalCode',
              type: 'text',
              required: true,
              defaultValue: '1013 AC',
            },
            {
              name: 'country',
              type: 'text',
              required: true,
              defaultValue: 'Netherlands',
            },
          ],
        },
        {
          name: 'businessHours',
          type: 'group',
          fields: [
            {
              name: 'weekdays',
              type: 'text',
              defaultValue: 'Monday - Friday: 8:00 - 18:00',
              localized: true,
            },
            {
              name: 'emergency',
              type: 'text',
              defaultValue: '24/7 Support for contract clients',
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        {
          name: 'linkedin',
          type: 'text',
          defaultValue: 'https://linkedin.com/company/workflo-it',
        },
        {
          name: 'twitter',
          type: 'text',
        },
        {
          name: 'facebook',
          type: 'text',
        },
        {
          name: 'instagram',
          type: 'text',
        },
        {
          name: 'youtube',
          type: 'text',
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'metaKeywords',
          type: 'text',
          localized: true,
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'twitterHandle',
          type: 'text',
        },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      fields: [
        {
          name: 'googleAnalyticsId',
          type: 'text',
          admin: {
            description: 'Google Analytics tracking ID (e.g., GA4-XXXXXXXXXX)',
          },
        },
        {
          name: 'microsoftClarityId',
          type: 'text',
        },
        {
          name: 'hotjarId',
          type: 'text',
        },
        {
          name: 'linkedinInsightId',
          type: 'text',
        },
        {
          name: 'facebookPixelId',
          type: 'text',
        },
      ],
    },
    {
      name: 'integrations',
      type: 'group',
      fields: [
        {
          name: 'hubspot',
          type: 'group',
          fields: [
            {
              name: 'portalId',
              type: 'text',
              defaultValue: '26510736',
            },
            {
              name: 'region',
              type: 'select',
              defaultValue: 'eu1',
              options: [
                {
                  label: 'EU1',
                  value: 'eu1',
                },
                {
                  label: 'NA1',
                  value: 'na1',
                },
              ],
            },
            {
              name: 'contactFormId',
              type: 'text',
              defaultValue: 'acf3fe0b-c542-4fc2-aa14-f3cb2fc356c0',
            },
            {
              name: 'newsletterFormId',
              type: 'text',
            },
          ],
        },
        {
          name: 'mailchimp',
          type: 'group',
          fields: [
            {
              name: 'apiKey',
              type: 'text',
              admin: {
                description: 'Store in environment variables',
              },
            },
            {
              name: 'listId',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'maintenance',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'message',
          type: 'richText',
          localized: true,
          admin: {
            condition: (data) => data.maintenance?.enabled,
          },
        },
        {
          name: 'allowedIPs',
          type: 'array',
          fields: [
            {
              name: 'ip',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
              admin: {
                description: 'Description of this IP (e.g., "Office IP")',
              },
            },
          ],
          admin: {
            condition: (data) => data.maintenance?.enabled,
          },
        },
      ],
    },
    {
      name: 'features',
      type: 'group',
      fields: [
        {
          name: 'enableBlog',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'enableTestimonials',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'enableCaseStudies',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'enableNewsletter',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'enableMultiLanguage',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'enableDarkMode',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'legal',
      type: 'group',
      fields: [
        {
          name: 'privacyPolicyUrl',
          type: 'text',
          defaultValue: '/privacy',
        },
        {
          name: 'termsOfServiceUrl',
          type: 'text',
          defaultValue: '/terms',
        },
        {
          name: 'cookiePolicyUrl',
          type: 'text',
          defaultValue: '/cookies',
        },
        {
          name: 'enableCookieConsent',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'cookieConsentMessage',
          type: 'richText',
          localized: true,
          admin: {
            condition: (data) => data.legal?.enableCookieConsent,
          },
        },
      ],
    },
  ],
}

export default SiteSettings