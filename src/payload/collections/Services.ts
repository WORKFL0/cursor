import type { CollectionConfig } from 'payload/types'

const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'updatedAt'],
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
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Managed IT',
          value: 'managed-it',
        },
        {
          label: 'Cloud Solutions',
          value: 'cloud',
        },
        {
          label: 'Cybersecurity',
          value: 'security',
        },
        {
          label: 'VoIP Telephony',
          value: 'voip',
        },
        {
          label: 'Hardware as a Service',
          value: 'hardware',
        },
        {
          label: 'Backup & Disaster Recovery',
          value: 'backup',
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
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
    {
      name: 'pricing',
      type: 'group',
      fields: [
        {
          name: 'basePrice',
          type: 'number',
          required: false,
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
        {
          name: 'period',
          type: 'select',
          options: [
            {
              label: 'Monthly',
              value: 'monthly',
            },
            {
              label: 'Yearly',
              value: 'yearly',
            },
            {
              label: 'One-time',
              value: 'one-time',
            },
          ],
        },
        {
          name: 'priceDescription',
          type: 'text',
          localized: true,
        },
        {
          name: 'customPricing',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'benefits',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          localized: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'technicalSpecs',
      type: 'array',
      fields: [
        {
          name: 'specification',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
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
      name: 'order',
      type: 'number',
      defaultValue: 0,
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

export default Services