// ============================================================================
// CASE STUDIES TYPES
// ============================================================================

export type CaseStatus = 'draft' | 'published' | 'archived'
export type ClientIndustry = 'healthcare' | 'finance' | 'retail' | 'media' | 'marketing' | 'other'
export type ClientSize = '1-10' | '10-50' | '50-200' | '200+'

export interface CaseStudy {
  id: string

  // Client info
  client_name: string
  client_logo_url: string | null
  client_industry: ClientIndustry | null
  client_size: ClientSize | null
  client_location: string | null

  // Case content
  title: string
  slug: string
  tagline: string | null
  challenge: string
  solution: string
  results: string

  // Testimonial
  testimonial: string | null
  testimonial_author: string | null
  testimonial_role: string | null

  // Media
  featured_image_url: string | null
  gallery_images: string[] | null
  video_url: string | null

  // Metrics
  metrics: Record<string, string> | null

  // Categorization
  services_used: string[] | null
  tags: string[] | null

  // Display
  is_featured: boolean
  display_order: number

  // Status
  status: CaseStatus

  // SEO
  meta_title: string | null
  meta_description: string | null
  og_image_url: string | null

  // Timestamps
  created_at: string
  updated_at: string
  published_at: string | null
  project_completed_at: string | null

  // Stats
  view_count: number
  share_count: number
}

export interface CreateCaseStudyInput {
  client_name: string
  title: string
  slug: string
  challenge: string
  solution: string
  results: string

  // Optional fields
  client_logo_url?: string
  client_industry?: ClientIndustry
  client_size?: ClientSize
  client_location?: string
  tagline?: string
  testimonial?: string
  testimonial_author?: string
  testimonial_role?: string
  featured_image_url?: string
  gallery_images?: string[]
  video_url?: string
  metrics?: Record<string, string>
  services_used?: string[]
  tags?: string[]
  is_featured?: boolean
  display_order?: number
  status?: CaseStatus
  meta_title?: string
  meta_description?: string
  og_image_url?: string
  project_completed_at?: string
}

export interface UpdateCaseStudyInput extends Partial<CreateCaseStudyInput> {
  id: string
}

export interface CaseStudiesFilters {
  status?: CaseStatus
  industry?: ClientIndustry
  is_featured?: boolean
  services_used?: string
  tags?: string
  limit?: number
  offset?: number
}

export interface CaseStudiesResponse {
  cases: CaseStudy[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
