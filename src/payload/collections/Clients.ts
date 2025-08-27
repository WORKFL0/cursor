import type { CollectionConfig } from 'payload/types'

const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'industry', 'status', 'partnershipLevel'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'displayName',
      type: 'text',
      admin: {
        description: 'Public display name (if different from legal name)',
      },
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
      admin: {
        description: 'White version of logo for dark backgrounds',
      },
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Client website URL',
      },
    },
    {
      name: 'industry',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Finance & Accounting',
          value: 'finance',
        },
        {
          label: 'Healthcare',
          value: 'healthcare',
        },
        {
          label: 'Legal Services',
          value: 'legal',
        },
        {
          label: 'Marketing & Advertising',
          value: 'marketing',
        },
        {
          label: 'Real Estate',
          value: 'real-estate',
        },
        {
          label: 'Manufacturing',
          value: 'manufacturing',
        },
        {
          label: 'Retail',
          value: 'retail',
        },
        {
          label: 'Non-profit',
          value: 'non-profit',
        },
        {
          label: 'Technology',
          value: 'technology',
        },
        {
          label: 'Hospitality',
          value: 'hospitality',
        },
        {
          label: 'Education',
          value: 'education',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
    },
    {
      name: 'companySize',
      type: 'select',
      required: true,
      options: [
        {
          label: '1-10 employees',
          value: '1-10',
        },
        {
          label: '11-50 employees',
          value: '11-50',
        },
        {
          label: '51-200 employees',
          value: '51-200',
        },
        {
          label: '200+ employees',
          value: '200+',
        },
      ],
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
          defaultValue: 'Netherlands',
        },
        {
          name: 'region',
          type: 'select',
          options: [
            {
              label: 'Amsterdam',
              value: 'amsterdam',
            },
            {
              label: 'Utrecht',
              value: 'utrecht',
            },
            {
              label: 'Rotterdam',
              value: 'rotterdam',
            },
            {
              label: 'The Hague',
              value: 'the-hague',
            },
            {
              label: 'Other Netherlands',
              value: 'other-nl',
            },
            {
              label: 'International',
              value: 'international',
            },
          ],
        },
      ],
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      required: true,
      admin: {
        description: 'Services provided to this client',
      },
    },
    {
      name: 'partnershipLevel',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Basic Support',
          value: 'basic',
        },
        {
          label: 'Managed Services',
          value: 'managed',
        },
        {
          label: 'Premium Partner',
          value: 'premium',
        },
        {
          label: 'Enterprise',
          value: 'enterprise',
        },
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        description: 'When the partnership started',
      },
    },
    {
      name: 'primaryContact',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'position',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the company and what they do',
      },
    },
    {
      name: 'projects',
      type: 'array',
      fields: [
        {
          name: 'projectName',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'startDate',
          type: 'date',
        },
        {
          name: 'endDate',
          type: 'date',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            {
              label: 'Completed',
              value: 'completed',
            },
            {
              label: 'In Progress',
              value: 'in-progress',
            },
            {
              label: 'On Hold',
              value: 'on-hold',
            },
            {
              label: 'Cancelled',
              value: 'cancelled',
            },
          ],
        },
      ],
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: {
        description: 'Testimonials from this client',
      },
    },
    {
      name: 'caseStudies',
      type: 'relationship',
      relationTo: 'case-studies',
      hasMany: true,
      admin: {
        description: 'Case studies featuring this client',
      },
    },
    {
      name: 'contractValue',
      type: 'group',
      fields: [
        {
          name: 'monthlyValue',
          type: 'number',
          admin: {
            description: 'Monthly contract value in EUR (confidential)',
          },
        },
        {
          name: 'annualValue',
          type: 'number',
          admin: {
            description: 'Annual contract value in EUR (confidential)',
          },
        },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'EUR',
          options: [
            {
              label: 'EUR',
              value: 'EUR',
            },
            {
              label: 'USD',
              value: 'USD',
            },
          ],
        },
      ],
      admin: {
        description: 'Contract value information (internal only)',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this client (not public)',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Tags for organizing clients (e.g., "high-value", "referral-source", "case-study")',
      },
    },
    {
      name: 'showInPortfolio',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Display client logo in portfolio/clients section',
      },
    },
    {
      name: 'allowPublicReference',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Client has approved public reference and case studies',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Featured clients appear prominently',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Inactive',
          value: 'inactive',
        },
        {
          label: 'Prospect',
          value: 'prospect',
        },
        {
          label: 'Former Client',
          value: 'former',
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order in client listings',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === 'create') {
          if (data.name && !data.slug) {
            data.slug = data.name
              .toLowerCase()
              .replace(/[^a-zA-Z0-9 ]/g, '')
              .replace(/\s+/g, '-')
          }
        }
        return data
      },
    ],
  },
}

export default Clients