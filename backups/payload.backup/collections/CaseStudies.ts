import type { CollectionConfig } from 'payload/types'

const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'category', 'status', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
    },
    {
      name: 'clientName',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Public name to display (in case different from client record)',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Cloud Migration',
          value: 'cloud-migration',
        },
        {
          label: 'Security Implementation',
          value: 'security',
        },
        {
          label: 'Infrastructure Overhaul',
          value: 'infrastructure',
        },
        {
          label: 'Managed IT Services',
          value: 'managed-it',
        },
        {
          label: 'Digital Transformation',
          value: 'digital-transformation',
        },
        {
          label: 'Cost Optimization',
          value: 'cost-optimization',
        },
      ],
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
          label: 'Other',
          value: 'other',
        },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 200,
      localized: true,
      admin: {
        description: 'Brief summary for listing pages',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'challenge',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          defaultValue: 'The Challenge',
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
          localized: true,
        },
        {
          name: 'keyPoints',
          type: 'array',
          fields: [
            {
              name: 'point',
              type: 'text',
              required: true,
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'solution',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          defaultValue: 'The Solution',
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
          localized: true,
        },
        {
          name: 'services',
          type: 'relationship',
          relationTo: 'services',
          hasMany: true,
        },
        {
          name: 'implementationSteps',
          type: 'array',
          fields: [
            {
              name: 'step',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'results',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          defaultValue: 'The Results',
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
          localized: true,
        },
        {
          name: 'metrics',
          type: 'array',
          fields: [
            {
              name: 'metric',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'value',
              type: 'text',
              required: true,
            },
            {
              name: 'improvement',
              type: 'text',
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'testimonial',
      type: 'relationship',
      relationTo: 'testimonials',
      admin: {
        description: 'Link to related testimonial from this client',
      },
    },
    {
      name: 'technologies',
      type: 'array',
      fields: [
        {
          name: 'technology',
          type: 'text',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'projectDuration',
      type: 'group',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
        },
        {
          name: 'endDate',
          type: 'date',
          required: true,
        },
        {
          name: 'timeframe',
          type: 'text',
          localized: true,
          admin: {
            description: 'Human-readable timeframe (e.g., "3 months")',
          },
        },
      ],
    },
    {
      name: 'teamSize',
      type: 'number',
      admin: {
        description: 'Number of Workflo team members involved',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'relatedCaseStudies',
      type: 'relationship',
      relationTo: 'case-studies',
      hasMany: true,
      filterOptions: ({ id }) => {
        return {
          id: {
            not_equals: id,
          },
        }
      },
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
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === 'create') {
          if (data.title && !data.slug) {
            data.slug = data.title
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

export default CaseStudies