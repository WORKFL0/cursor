import type { CollectionConfig } from 'payload/types'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    group: 'Content',
  },
  access: {
    read: () => true, // Anyone can read media files
  },
  upload: {
    staticDir: 'public/media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 500,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
      {
        name: 'logo',
        width: 300,
        height: 200,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'caption',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        {
          label: 'Logo',
          value: 'logo',
        },
        {
          label: 'Hero Image',
          value: 'hero',
        },
        {
          label: 'Team Photo',
          value: 'team',
        },
        {
          label: 'Service Icon',
          value: 'service-icon',
        },
        {
          label: 'Client Logo',
          value: 'client-logo',
        },
        {
          label: 'Blog Image',
          value: 'blog',
        },
        {
          label: 'Office Photo',
          value: 'office',
        },
        {
          label: 'Video',
          value: 'video',
        },
        {
          label: 'Document',
          value: 'document',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
    },
  ],
}

export default Media