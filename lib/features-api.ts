// ============================================================================
// FEATURES API
// ============================================================================

import { supabase } from './supabase'
import type {
  Feature,
  CreateFeatureInput,
  UpdateFeatureInput,
  FeaturesFilters,
  FeaturesResponse,
} from '@/types/features'

// Error handling helpers
function isSupabaseSchemaError(error: any): boolean {
  return error?.code === 'PGRST205' || error?.message?.includes('schema cache')
}

function logFeaturesAPIError(context: string, error: any) {
  if (isSupabaseSchemaError(error)) {
    console.warn(`[Features API] Schema cache error in ${context}. Tables may not be loaded yet.`)
    console.warn('Run this SQL in Supabase: NOTIFY pgrst, \'reload schema\';')
  } else {
    console.error(`[Features API] Error in ${context}:`, error)
  }
}

// ============================================================================
// READ OPERATIONS
// ============================================================================

/**
 * Get published features with optional filters
 */
export async function getPublishedFeatures(filters: FeaturesFilters = {}): Promise<FeaturesResponse> {
  try {
    const {
      category,
      limit = 50,
      offset = 0,
    } = filters

    let query = supabase
      .from('features')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (limit) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, error, count } = await query

    if (error) {
      logFeaturesAPIError('getPublishedFeatures', error)
      return { features: [], total: 0, page: 1, limit, hasMore: false }
    }

    const page = Math.floor(offset / limit) + 1
    const hasMore = count ? offset + limit < count : false

    return {
      features: data || [],
      total: count || 0,
      page,
      limit,
      hasMore,
    }
  } catch (err) {
    logFeaturesAPIError('getPublishedFeatures (catch)', err)
    return { features: [], total: 0, page: 1, limit: filters.limit || 50, hasMore: false }
  }
}

/**
 * Get all features (for admin) - Uses API route for server-side access
 */
export async function getAllFeatures(filters: FeaturesFilters = {}): Promise<FeaturesResponse> {
  try {
    const {
      status,
      category,
      limit = 50,
      offset = 0,
    } = filters

    // Build query params
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (category) params.set('category', category)

    // Get admin token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null

    const response = await fetch(`/api/admin/features?${params.toString()}`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('[Features API] getAllFeatures error:', errorData)
      return { features: [], total: 0, page: 1, limit, hasMore: false }
    }

    const { features, total } = await response.json()

    const page = Math.floor(offset / limit) + 1
    const hasMore = total ? offset + limit < total : false

    return {
      features: features || [],
      total: total || 0,
      page,
      limit,
      hasMore,
    }
  } catch (err) {
    logFeaturesAPIError('getAllFeatures (catch)', err)
    return { features: [], total: 0, page: 1, limit: filters.limit || 50, hasMore: false }
  }
}

/**
 * Get feature by slug
 */
export async function getFeatureBySlug(slug: string): Promise<Feature | null> {
  try {
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) {
      logFeaturesAPIError('getFeatureBySlug', error)
      return null
    }

    return data
  } catch (err) {
    logFeaturesAPIError('getFeatureBySlug (catch)', err)
    return null
  }
}

/**
 * Get feature by ID (for admin)
 */
export async function getFeatureById(id: string): Promise<Feature | null> {
  try {
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      logFeaturesAPIError('getFeatureById', error)
      return null
    }

    return data
  } catch (err) {
    logFeaturesAPIError('getFeatureById (catch)', err)
    return null
  }
}

// ============================================================================
// WRITE OPERATIONS
// ============================================================================

/**
 * Create a new feature (via API route to use service role)
 */
export async function createFeature(input: CreateFeatureInput): Promise<Feature | null> {
  try {
    // Get admin token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null

    const response = await fetch('/api/admin/features', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('[Features API] createFeature error:', errorData)
      return null
    }

    const data = await response.json()
    return data
  } catch (err) {
    logFeaturesAPIError('createFeature (catch)', err)
    return null
  }
}

/**
 * Update a feature
 */
export async function updateFeature(input: UpdateFeatureInput): Promise<Feature | null> {
  try {
    const { id, ...updates } = input

    const { data, error } = await supabase
      .from('features')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      logFeaturesAPIError('updateFeature', error)
      return null
    }

    return data
  } catch (err) {
    logFeaturesAPIError('updateFeature (catch)', err)
    return null
  }
}

/**
 * Delete a feature
 */
export async function deleteFeature(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('features')
      .delete()
      .eq('id', id)

    if (error) {
      logFeaturesAPIError('deleteFeature', error)
      return false
    }

    return true
  } catch (err) {
    logFeaturesAPIError('deleteFeature (catch)', err)
    return false
  }
}

/**
 * Increment view count
 */
export async function incrementFeatureViews(id: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_feature_views', { feature_id: id })

    if (error) {
      logFeaturesAPIError('incrementFeatureViews', error)
    }
  } catch (err) {
    logFeaturesAPIError('incrementFeatureViews (catch)', err)
  }
}
