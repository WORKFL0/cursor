import type { GlobalConfig } from 'payload/types'

const CompanyInfo: GlobalConfig = {
  slug: 'company-info',
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'basic',
      type: 'group',
      fields: [
        {
          name: 'legalName',
          type: 'text',
          required: true,
          defaultValue: 'Workflo B.V.',
        },
        {
          name: 'tradingName',
          type: 'text',
          defaultValue: 'Workflo',
        },
        {
          name: 'founded',
          type: 'text',
          defaultValue: '2015',
        },
        {
          name: 'employeeCount',
          type: 'text',
          defaultValue: '4',
        },
        {
          name: 'kvkNumber',
          type: 'text',
          admin: {
            description: 'Dutch Chamber of Commerce number',
          },
        },
        {
          name: 'vatNumber',
          type: 'text',
          admin: {
            description: 'VAT/BTW number',
          },
        },
      ],
    },
    {
      name: 'mission',
      type: 'group',
      fields: [
        {
          name: 'missionStatement',
          type: 'richText',
          required: true,
          localized: true,
        },
        {
          name: 'visionStatement',
          type: 'richText',
          localized: true,
        },
        {
          name: 'valueProposition',
          type: 'richText',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'values',
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
          type: 'richText',
          required: true,
          localized: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'certifications',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'issuer',
          type: 'text',
          required: true,
        },
        {
          name: 'year',
          type: 'number',
        },
        {
          name: 'expiryDate',
          type: 'date',
        },
        {
          name: 'certificateUrl',
          type: 'text',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'level',
          type: 'select',
          options: [
            {
              label: 'Bronze',
              value: 'bronze',
            },
            {
              label: 'Silver',
              value: 'silver',
            },
            {
              label: 'Gold',
              value: 'gold',
            },
            {
              label: 'Platinum',
              value: 'platinum',
            },
            {
              label: 'Partner',
              value: 'partner',
            },
            {
              label: 'Certified',
              value: 'certified',
            },
          ],
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'partnerships',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Technology Partner',
              value: 'technology',
            },
            {
              label: 'Reseller',
              value: 'reseller',
            },
            {
              label: 'Certified Partner',
              value: 'certified',
            },
            {
              label: 'Solutions Partner',
              value: 'solutions',
            },
            {
              label: 'Channel Partner',
              value: 'channel',
            },
          ],
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
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
    },
    {
      name: 'timeline',
      type: 'array',
      fields: [
        {
          name: 'year',
          type: 'text',
          required: true,
        },
        {
          name: 'event',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'milestone',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Mark as a major milestone',
          },
        },
      ],
    },
    {
      name: 'statistics',
      type: 'array',
      fields: [
        {
          name: 'label',
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
          name: 'suffix',
          type: 'text',
          admin: {
            description: 'e.g., "+", "%", "years"',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'showOnHomepage',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'awards',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'issuer',
          type: 'text',
          required: true,
        },
        {
          name: 'year',
          type: 'number',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'Link to award announcement or details',
          },
        },
        {
          name: 'category',
          type: 'select',
          options: [
            {
              label: 'Industry Recognition',
              value: 'industry',
            },
            {
              label: 'Client Service',
              value: 'service',
            },
            {
              label: 'Innovation',
              value: 'innovation',
            },
            {
              label: 'Growth',
              value: 'growth',
            },
            {
              label: 'Other',
              value: 'other',
            },
          ],
        },
      ],
    },
    {
      name: 'locations',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Headquarters',
              value: 'headquarters',
            },
            {
              label: 'Office',
              value: 'office',
            },
            {
              label: 'Branch',
              value: 'branch',
            },
            {
              label: 'Remote',
              value: 'remote',
            },
          ],
        },
        {
          name: 'address',
          type: 'group',
          fields: [
            {
              name: 'street',
              type: 'text',
              required: true,
            },
            {
              name: 'city',
              type: 'text',
              required: true,
            },
            {
              name: 'postalCode',
              type: 'text',
              required: true,
            },
            {
              name: 'country',
              type: 'text',
              required: true,
            },
            {
              name: 'coordinates',
              type: 'group',
              fields: [
                {
                  name: 'latitude',
                  type: 'number',
                },
                {
                  name: 'longitude',
                  type: 'number',
                },
              ],
            },
          ],
        },
        {
          name: 'contact',
          type: 'group',
          fields: [
            {
              name: 'phone',
              type: 'text',
            },
            {
              name: 'email',
              type: 'email',
            },
            {
              name: 'hours',
              type: 'text',
              localized: true,
            },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'primary',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'industries',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'clientCount',
          type: 'number',
          admin: {
            description: 'Number of clients in this industry',
          },
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
    },
  ],
}

export default CompanyInfo