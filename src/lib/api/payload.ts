import { getPayloadClient } from '@/lib/payload'

let payload: unknown = null

async function getPayload() {
  if (!payload) {
    payload = await getPayloadClient()
  }
  return payload
}

export const payloadAPI = {
  // Services
  async getServices(options: {
    category?: string
    status?: string
    featured?: boolean
    limit?: number
    page?: number
  } = {}) {
    const { category, status = 'published', featured, limit = 10, page = 1 } = options
    
    const where: unknown = { status: { equals: status } }
    
    if (category) {
      where.category = { equals: category }
    }
    
    if (featured !== undefined) {
      where.featured = { equals: featured }
    }

    const payloadInstance = await getPayload()
    return await payloadInstance.find({
      collection: 'services',
      where,
      limit,
      page,
      sort: 'order',
    })
  },

  async getService(slug: string) {
    const payloadInstance = await getPayload()
    const result = await payloadInstance.find({
      collection: 'services',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' }
      },
      limit: 1,
    })
    return result.docs[0] || null
  },

  // Case Studies
  async getCaseStudies(options: {
    category?: string
    industry?: string
    featured?: boolean
    limit?: number
    page?: number
  } = {}) {
    const { category, industry, featured, limit = 10, page = 1 } = options
    
    const where: unknown = { status: { equals: 'published' } }
    
    if (category) {
      where.category = { equals: category }
    }
    
    if (industry) {
      where.industry = { equals: industry }
    }
    
    if (featured !== undefined) {
      where.featured = { equals: featured }
    }

    const payloadInstance = await getPayload()
    return await payloadInstance.find({
      collection: 'case-studies',
      where,
      limit,
      page,
      sort: '-publishedAt',
    })
  },

  async getCaseStudy(slug: string) {
    const payloadInstance = await getPayload()
    const result = await payloadInstance.find({
      collection: 'case-studies',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' }
      },
      limit: 1,
    })
    return result.docs[0] || null
  },

  // Testimonials
  async getTestimonials(options: {
    featured?: boolean
    showOnHomepage?: boolean
    industry?: string
    rating?: number
    limit?: number
    page?: number
  } = {}) {
    const { featured, showOnHomepage, industry, rating, limit = 10, page = 1 } = options
    
    const where: unknown = { 
      status: { equals: 'published' },
      approved: { equals: true }
    }
    
    if (featured !== undefined) {
      where.featured = { equals: featured }
    }
    
    if (showOnHomepage !== undefined) {
      where.showOnHomepage = { equals: showOnHomepage }
    }
    
    if (industry) {
      where.industry = { equals: industry }
    }
    
    if (rating) {
      where.rating = { greater_than_equal: rating }
    }

    const payloadInstance = await getPayload()
    return await payloadInstance.find({
      collection: 'testimonials',
      where,
      limit,
      page,
      sort: '-dateGiven',
    })
  },

  // Blog Posts
  async getBlogPosts(options: {
    category?: string
    author?: string
    featured?: boolean
    showOnHomepage?: boolean
    limit?: number
    page?: number
  } = {}) {
    const { category, author, featured, showOnHomepage, limit = 10, page = 1 } = options
    
    const where: unknown = { status: { equals: 'published' } }
    
    if (category) {
      where.category = { equals: category }
    }
    
    if (author) {
      where.author = { equals: author }
    }
    
    if (featured !== undefined) {
      where.featured = { equals: featured }
    }
    
    if (showOnHomepage !== undefined) {
      where.showOnHomepage = { equals: showOnHomepage }
    }

    const payloadInstance = await getPayload()
    return await payloadInstance.find({
      collection: 'blog-posts',
      where,
      limit,
      page,
      sort: '-publishedAt',
    })
  },

  async getBlogPost(slug: string) {
    const payloadInstance = await getPayload()
    const result = await payloadInstance.find({
      collection: 'blog-posts',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' }
      },
      limit: 1,
    })
    return result.docs[0] || null
  },

  // Team Members
  async getTeamMembers(options: {
    department?: string
    showOnTeamPage?: boolean
    status?: string
    limit?: number
  } = {}) {
    const { department, showOnTeamPage, status = 'active', limit = 50 } = options
    
    const where: unknown = { status: { equals: status } }
    
    if (department) {
      where.department = { equals: department }
    }
    
    if (showOnTeamPage !== undefined) {
      where.showOnTeamPage = { equals: showOnTeamPage }
    }

    const payloadInstance = await getPayload()
    return await payloadInstance.find({
      collection: 'team-members',
      where,
      limit,
      sort: 'order',
    })
  },

  async getTeamMember(slug: string) {
    const payloadInstance = await getPayload()
    const result = await payloadInstance.find({
      collection: 'team-members',
      where: {
        slug: { equals: slug },
        status: { equals: 'active' }
      },
      limit: 1,
    })
    return result.docs[0] || null
  },

  // Clients
  async getClients(options: {
    industry?: string
    showInPortfolio?: boolean
    featured?: boolean
    status?: string
    limit?: number
  } = {}) {
    const { industry, showInPortfolio, featured, status = 'active', limit = 50 } = options
    
    const where: unknown = { status: { equals: status } }
    
    if (industry) {
      where.industry = { equals: industry }
    }
    
    if (showInPortfolio !== undefined) {
      where.showInPortfolio = { equals: showInPortfolio }
    }
    
    if (featured !== undefined) {
      where.featured = { equals: featured }
    }

    const payloadInstance = await getPayload()
    return await payloadInstance.find({
      collection: 'clients',
      where,
      limit,
      sort: 'order',
    })
  },

  // FAQs
  async getFAQs(options: {
    category?: string
    featured?: boolean
    showOnHomepage?: boolean
    limit?: number
    page?: number
  } = {}) {
    const { category, featured, showOnHomepage, limit = 50, page = 1 } = options
    
    const where: unknown = { status: { equals: 'published' } }
    
    if (category) {
      where.category = { equals: category }
    }
    
    if (featured !== undefined) {
      where.featured = { equals: featured }
    }
    
    if (showOnHomepage !== undefined) {
      where.showOnHomepage = { equals: showOnHomepage }
    }

    const payloadInstance = await getPayload()
    return await payloadInstance.find({
      collection: 'faqs',
      where,
      limit,
      page,
      sort: ['category', 'order'],
    })
  },

  // Globals
  async getSiteSettings() {
    const payloadInstance = await getPayload()
    return await payloadInstance.findGlobal({
      slug: 'site-settings',
    })
  },

  async getCompanyInfo() {
    const payloadInstance = await getPayload()
    return await payloadInstance.findGlobal({
      slug: 'company-info',
    })
  },

  // Media
  async getMedia(id: string) {
    const payloadInstance = await getPayload()
    return await payloadInstance.findByID({
      collection: 'media',
      id,
    })
  },

  // Search
  async search(query: string, collections: string[] = ['services', 'blog-posts', 'case-studies', 'faqs']) {
    const results = []
    const payloadInstance = await getPayload()
    
    for (const collection of collections) {
      try {
        const collectionResults = await payloadInstance.find({
          collection,
          where: {
            or: [
              { title: { contains: query } },
              { description: { contains: query } },
              { content: { contains: query } },
            ]
          },
          limit: 5,
        })
        
        results.push({
          collection,
          results: collectionResults.docs
        })
      } catch (error) {
        console.error(`Error searching ${collection}:`, error)
      }
    }
    
    return results
  }
}