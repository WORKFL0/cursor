import type { CollectionConfig } from 'payload/types'

const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'company', 'rating', 'featured', 'status'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'company',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'position',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      admin: {
        description: 'Link to client record if available',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional photo of the client',
      },
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      maxLength: 500,
      localized: true,
    },
    {
      name: 'fullTestimonial',
      type: 'richText',
      localized: true,
      admin: {
        description: 'Full testimonial text for detailed views',
      },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
      admin: {
        step: 1,
        description: 'Rating out of 5 stars',
      },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        description: 'Services this testimonial relates to',
      },
    },
    {
      name: 'caseStudy',
      type: 'relationship',
      relationTo: 'case-studies',
      admin: {
        description: 'Related case study if available',
      },
    },
    {
      name: 'industry',
      type: 'select',
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
      name: 'companySize',
      type: 'select',
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
      name: 'videoTestimonial',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional video testimonial',
      },
    },
    {
      name: 'projectType',
      type: 'select',
      options: [
        {
          label: 'Managed IT Services',
          value: 'managed-it',
        },
        {
          label: 'Cloud Migration',
          value: 'cloud-migration',
        },
        {
          label: 'Security Implementation',
          value: 'security',
        },
        {
          label: 'Infrastructure Upgrade',
          value: 'infrastructure',
        },
        {
          label: 'IT Support',
          value: 'support',
        },
        {
          label: 'Consulting',
          value: 'consulting',
        },
      ],
    },
    {
      name: 'dateGiven',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Client has approved this testimonial for public use',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Featured testimonials appear prominently on the website',
      },
    },
    {
      name: 'showOnHomepage',
      type: 'checkbox',
      defaultValue: false,
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
        description: 'Tags for organizing testimonials (e.g., "cost-savings", "security", "productivity")',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Ensure approved testimonials are published
        if (data.approved && data.status === 'draft') {
          data.status = 'published'
        }
        return data
      },
    ],
  },
}

export default Testimonials