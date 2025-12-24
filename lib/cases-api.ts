// ============================================================================
// CASE STUDIES API
// ============================================================================

import { supabase } from './supabase'
import type {
  CaseStudy,
  CreateCaseStudyInput,
  UpdateCaseStudyInput,
  CaseStudiesFilters,
  CaseStudiesResponse,
} from '@/types/cases'

// Error handling helpers
function isSupabaseSchemaError(error: any): boolean {
  return error?.code === 'PGRST205' || error?.message?.includes('schema cache')
}

function logCasesAPIError(context: string, error: any) {
  if (isSupabaseSchemaError(error)) {
    console.warn(`[Cases API] Schema cache error in ${context}. Tables may not be loaded yet.`)
    console.warn('Run this SQL in Supabase: NOTIFY pgrst, \'reload schema\';')
  } else {
    console.error(`[Cases API] Error in ${context}:`, error)
  }
}

// ============================================================================
// READ OPERATIONS
// ============================================================================

/**
 * Get published case studies with optional filters
 */
export async function getPublishedCases(filters: CaseStudiesFilters = {}): Promise<CaseStudiesResponse> {
  try {
    const {
      industry,
      is_featured,
      services_used,
      tags,
      limit = 50,
      offset = 0,
    } = filters

    let query = supabase
      .from('case_studies')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('published_at', { ascending: false })

    if (industry) {
      query = query.eq('client_industry', industry)
    }

    if (is_featured !== undefined) {
      query = query.eq('is_featured', is_featured)
    }

    if (services_used) {
      query = query.contains('services_used', [services_used])
    }

    if (tags) {
      query = query.contains('tags', [tags])
    }

    if (limit) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, error, count } = await query

    if (error) {
      logCasesAPIError('getPublishedCases', error)
      return { cases: [], total: 0, page: 1, limit, hasMore: false }
    }

    const page = Math.floor(offset / limit) + 1
    const hasMore = count ? offset + limit < count : false

    return {
      cases: data || [],
      total: count || 0,
      page,
      limit,
      hasMore,
    }
  } catch (err) {
    logCasesAPIError('getPublishedCases (catch)', err)
    return { cases: [], total: 0, page: 1, limit: filters.limit || 50, hasMore: false }
  }
}

/**
 * Get all case studies (for admin)
 */
export async function getAllCases(filters: CaseStudiesFilters = {}): Promise<CaseStudiesResponse> {
  try {
    const {
      status,
      industry,
      is_featured,
      services_used,
      tags,
      limit = 50,
      offset = 0,
    } = filters

    let query = supabase
      .from('case_studies')
      .select('*', { count: 'exact' })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (industry) {
      query = query.eq('client_industry', industry)
    }

    if (is_featured !== undefined) {
      query = query.eq('is_featured', is_featured)
    }

    if (services_used) {
      query = query.contains('services_used', [services_used])
    }

    if (tags) {
      query = query.contains('tags', [tags])
    }

    if (limit) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, error, count } = await query

    if (error) {
      logCasesAPIError('getAllCases', error)
      return { cases: [], total: 0, page: 1, limit, hasMore: false }
    }

    const page = Math.floor(offset / limit) + 1
    const hasMore = count ? offset + limit < count : false

    return {
      cases: data || [],
      total: count || 0,
      page,
      limit,
      hasMore,
    }
  } catch (err) {
    logCasesAPIError('getAllCases (catch)', err)
    return { cases: [], total: 0, page: 1, limit: filters.limit || 50, hasMore: false }
  }
}

/**
 * Get case study by slug
 */
export async function getCaseBySlug(slug: string): Promise<CaseStudy | null> {
  try {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) {
      logCasesAPIError('getCaseBySlug', error)
      return null
    }

    return data
  } catch (err) {
    logCasesAPIError('getCaseBySlug (catch)', err)
    return null
  }
}

/**
 * Get case study by ID (for admin)
 */
export async function getCaseById(id: string): Promise<CaseStudy | null> {
  try {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      logCasesAPIError('getCaseById', error)
      return null
    }

    return data
  } catch (err) {
    logCasesAPIError('getCaseById (catch)', err)
    return null
  }
}

/**
 * Get featured case studies
 */
export async function getFeaturedCases(limit: number = 3): Promise<CaseStudy[]> {
  try {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
      .limit(limit)

    if (error) {
      logCasesAPIError('getFeaturedCases', error)
      return []
    }

    return data || []
  } catch (err) {
    logCasesAPIError('getFeaturedCases (catch)', err)
    return []
  }
}

// ============================================================================
// WRITE OPERATIONS
// ============================================================================

/**
 * Create a new case study
 */
export async function createCase(input: CreateCaseStudyInput): Promise<CaseStudy | null> {
  try {
    const { data, error } = await supabase
      .from('case_studies')
      .insert([input])
      .select()
      .single()

    if (error) {
      logCasesAPIError('createCase', error)
      return null
    }

    return data
  } catch (err) {
    logCasesAPIError('createCase (catch)', err)
    return null
  }
}

/**
 * Update a case study
 */
export async function updateCase(input: UpdateCaseStudyInput): Promise<CaseStudy | null> {
  try {
    const { id, ...updates } = input

    const { data, error } = await supabase
      .from('case_studies')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      logCasesAPIError('updateCase', error)
      return null
    }

    return data
  } catch (err) {
    logCasesAPIError('updateCase (catch)', err)
    return null
  }
}

/**
 * Delete a case study
 */
export async function deleteCase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('case_studies')
      .delete()
      .eq('id', id)

    if (error) {
      logCasesAPIError('deleteCase', error)
      return false
    }

    return true
  } catch (err) {
    logCasesAPIError('deleteCase (catch)', err)
    return false
  }
}

/**
 * Increment view count
 */
export async function incrementCaseViews(id: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_case_views', { case_id: id })

    if (error) {
      logCasesAPIError('incrementCaseViews', error)
    }
  } catch (err) {
    logCasesAPIError('incrementCaseViews (catch)', err)
  }
}

/**
 * Increment share count
 */
export async function incrementCaseShares(id: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_case_shares', { case_id: id })

    if (error) {
      logCasesAPIError('incrementCaseShares', error)
    }
  } catch (err) {
    logCasesAPIError('incrementCaseShares (catch)', err)
  }
}
