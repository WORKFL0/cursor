import type { CollectionConfig } from 'payload/types'

const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'featured', 'order'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'shortAnswer',
      type: 'textarea',
      required: true,
      maxLength: 200,
      localized: true,
      admin: {
        description: 'Brief answer for quick reference',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'General',
          value: 'general',
        },
        {
          label: 'Technical',
          value: 'technical',
        },
        {
          label: 'Pricing',
          value: 'pricing',
        },
        {
          label: 'Support',
          value: 'support',
        },
        {
          label: 'Services',
          value: 'services',
        },
        {
          label: 'Security',
          value: 'security',
        },
        {
          label: 'Cloud Solutions',
          value: 'cloud',
        },
        {
          label: 'Managed IT',
          value: 'managed-it',
        },
        {
          label: 'Getting Started',
          value: 'getting-started',
        },
      ],
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        description: 'Services this FAQ relates to',
      },
    },
    {
      name: 'keywords',
      type: 'array',
      fields: [
        {
          name: 'keyword',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Keywords to help users find this FAQ',
      },
    },
    {
      name: 'relatedFAQs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      filterOptions: ({ id }) => {
        return {
          id: {
            not_equals: id,
          },
        }
      },
      admin: {
        description: 'Related frequently asked questions',
      },
    },
    {
      name: 'helpfulLinks',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
      ],
      admin: {
        description: 'Helpful links and resources related to this FAQ',
      },
    },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        {
          name: 'showContactCTA',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'contactMessage',
          type: 'text',
          localized: true,
          admin: {
            condition: (data) => data.contactInfo?.showContactCTA,
          },
        },
        {
          name: 'preferredContactMethod',
          type: 'select',
          options: [
            {
              label: 'Email',
              value: 'email',
            },
            {
              label: 'Phone',
              value: 'phone',
            },
            {
              label: 'Contact Form',
              value: 'form',
            },
          ],
          admin: {
            condition: (data) => data.contactInfo?.showContactCTA,
          },
        },
      ],
      admin: {
        description: 'Show contact information if FAQ doesn\'t fully answer the question',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Featured FAQs appear prominently on the FAQ page',
      },
    },
    {
      name: 'showOnHomepage',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show this FAQ on the homepage',
      },
    },
    {
      name: 'viewCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of times this FAQ has been viewed (auto-tracked)',
        readOnly: true,
      },
    },
    {
      name: 'helpfulVotes',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of "helpful" votes (auto-tracked)',
        readOnly: true,
      },
    },
    {
      name: 'lastUpdated',
      type: 'date',
      admin: {
        description: 'Last time this FAQ was updated',
        readOnly: true,
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order within category',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
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
        {
          label: 'Needs Review',
          value: 'needs-review',
        },
      ],
    },
    {
      name: 'language',
      type: 'select',
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
        {
          label: 'Both',
          value: 'both',
        },
      ],
      admin: {
        description: 'Target language for this FAQ',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Update lastUpdated timestamp
        data.lastUpdated = new Date().toISOString()
        return data
      },
    ],
  },
}

export default FAQs