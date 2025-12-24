// ============================================================================
// FEATURES TYPES
// ============================================================================

export type FeatureStatus = 'draft' | 'published' | 'archived'
export type FeatureCategory = 'security' | 'support' | 'productivity' | 'communication'

export interface Feature {
  id: string
  title: string
  slug: string
  description: string
  icon_name: string | null
  icon_url: string | null
  image_url: string | null
  video_url: string | null
  category: FeatureCategory | null
  display_order: number
  status: FeatureStatus
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  published_at: string | null
  view_count: number
}

export interface CreateFeatureInput {
  title: string
  slug: string
  description: string
  icon_name?: string
  icon_url?: string
  image_url?: string
  video_url?: string
  category?: FeatureCategory
  display_order?: number
  status?: FeatureStatus
  meta_title?: string
  meta_description?: string
}

export interface UpdateFeatureInput extends Partial<CreateFeatureInput> {
  id: string
}

export interface FeaturesFilters {
  status?: FeatureStatus
  category?: FeatureCategory
  limit?: number
  offset?: number
}

export interface FeaturesResponse {
  features: Feature[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
