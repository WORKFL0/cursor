import type { CollectionConfig } from 'payload/types'

const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'category', 'status', 'publishedAt'],
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
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 200,
      localized: true,
      admin: {
        description: 'Brief summary for listing pages and SEO',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'team-members',
      required: true,
    },
    {
      name: 'coAuthors',
      type: 'relationship',
      relationTo: 'team-members',
      hasMany: true,
      admin: {
        description: 'Additional authors for this post',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'IT News',
          value: 'it-news',
        },
        {
          label: 'Cybersecurity',
          value: 'cybersecurity',
        },
        {
          label: 'Cloud Computing',
          value: 'cloud-computing',
        },
        {
          label: 'Business Technology',
          value: 'business-tech',
        },
        {
          label: 'Tutorials & Guides',
          value: 'tutorials',
        },
        {
          label: 'Company News',
          value: 'company-news',
        },
        {
          label: 'Industry Insights',
          value: 'industry-insights',
        },
        {
          label: 'Product Updates',
          value: 'product-updates',
        },
        {
          label: 'Best Practices',
          value: 'best-practices',
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
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        description: 'Estimated reading time in minutes (auto-calculated if empty)',
        position: 'sidebar',
      },
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        description: 'Services mentioned or related to this post',
      },
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'blog-posts',
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
      name: 'cta',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'buttonText',
          type: 'text',
          localized: true,
        },
        {
          name: 'buttonUrl',
          type: 'text',
        },
        {
          name: 'relatedService',
          type: 'relationship',
          relationTo: 'services',
        },
      ],
      admin: {
        description: 'Call-to-action section at the end of the post',
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
        {
          name: 'noIndex',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
      },
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
          label: 'Scheduled',
          value: 'scheduled',
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
      admin: {
        description: 'Featured posts appear prominently on the blog homepage',
      },
    },
    {
      name: 'showOnHomepage',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'allowComments',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'newsletter',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Include this post in newsletter campaigns',
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

        // Auto-calculate reading time if not provided
        if (data.content && !data.readingTime) {
          const wordsPerMinute = 200
          const textContent = JSON.stringify(data.content)
            .replace(/<[^>]*>/g, '')
            .replace(/[^\w\s]/g, ' ')
          const wordCount = textContent.split(/\s+/).length
          data.readingTime = Math.ceil(wordCount / wordsPerMinute)
        }

        return data
      },
    ],
  },
}

export default BlogPosts