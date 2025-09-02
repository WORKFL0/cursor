import type { CollectionConfig } from 'payload/types'

const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'department', 'status'],
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
      name: 'position',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'department',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Management',
          value: 'management',
        },
        {
          label: 'IT Support',
          value: 'support',
        },
        {
          label: 'Network & Security',
          value: 'network-security',
        },
        {
          label: 'Cloud Engineering',
          value: 'cloud',
        },
        {
          label: 'Sales & Business Development',
          value: 'sales',
        },
        {
          label: 'Marketing',
          value: 'marketing',
        },
      ],
    },
    {
      name: 'bio',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'shortBio',
      type: 'textarea',
      required: true,
      maxLength: 150,
      localized: true,
      admin: {
        description: 'Brief bio for team overview pages',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Professional headshot photo',
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'Work email address (kept private)',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Work phone number (optional)',
      },
    },
    {
      name: 'socialMedia',
      type: 'group',
      fields: [
        {
          name: 'linkedin',
          type: 'text',
          admin: {
            description: 'LinkedIn profile URL',
          },
        },
        {
          name: 'twitter',
          type: 'text',
          admin: {
            description: 'Twitter profile URL',
          },
        },
        {
          name: 'github',
          type: 'text',
          admin: {
            description: 'GitHub profile URL',
          },
        },
      ],
    },
    {
      name: 'specialties',
      type: 'array',
      fields: [
        {
          name: 'specialty',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
      admin: {
        description: 'Areas of expertise and specialization',
      },
    },
    {
      name: 'certifications',
      type: 'array',
      fields: [
        {
          name: 'certification',
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
          name: 'credentialUrl',
          type: 'text',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'languages',
      type: 'array',
      fields: [
        {
          name: 'language',
          type: 'select',
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
              label: 'German',
              value: 'de',
            },
            {
              label: 'French',
              value: 'fr',
            },
            {
              label: 'Spanish',
              value: 'es',
            },
            {
              label: 'Other',
              value: 'other',
            },
          ],
        },
        {
          name: 'proficiency',
          type: 'select',
          options: [
            {
              label: 'Native',
              value: 'native',
            },
            {
              label: 'Fluent',
              value: 'fluent',
            },
            {
              label: 'Intermediate',
              value: 'intermediate',
            },
            {
              label: 'Basic',
              value: 'basic',
            },
          ],
        },
      ],
    },
    {
      name: 'yearsOfExperience',
      type: 'number',
      admin: {
        description: 'Total years of experience in IT',
      },
    },
    {
      name: 'joinedDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Date when they joined Workflo',
      },
    },
    {
      name: 'hobbies',
      type: 'array',
      fields: [
        {
          name: 'hobby',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
      admin: {
        description: 'Personal interests and hobbies',
      },
    },
    {
      name: 'quote',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Personal or professional quote/motto',
      },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        description: 'Services this team member specializes in',
      },
    },
    {
      name: 'showOnTeamPage',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Display on the main team page',
      },
    },
    {
      name: 'showContactInfo',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show contact information publicly',
      },
    },
    {
      name: 'availableForConsultations',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Available for client consultations',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order on team page',
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
          label: 'On Leave',
          value: 'on-leave',
        },
        {
          label: 'Alumni',
          value: 'alumni',
        },
        {
          label: 'Hidden',
          value: 'hidden',
        },
      ],
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

export default TeamMembers