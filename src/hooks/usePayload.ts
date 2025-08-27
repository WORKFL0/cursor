'use client'

import { useState, useEffect } from 'react'

interface UsePayloadOptions {
  revalidateOnFocus?: boolean
  revalidateOnReconnect?: boolean
}

interface UsePayloadResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  mutate: () => void
}

export function usePayload<T>(
  fetcher: () => Promise<T>,
  options: UsePayloadOptions = {}
): UsePayloadResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetcher()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Handle focus revalidation
  useEffect(() => {
    if (!options.revalidateOnFocus) return

    const handleFocus = () => {
      if (!document.hidden) {
        fetchData()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [options.revalidateOnFocus])

  // Handle online revalidation
  useEffect(() => {
    if (!options.revalidateOnReconnect) return

    const handleOnline = () => {
      fetchData()
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [options.revalidateOnReconnect])

  return {
    data,
    loading,
    error,
    mutate: fetchData,
  }
}

// Specific hooks for common data fetching patterns
export function useServices(category?: string, featured?: boolean) {
  return usePayload(() =>
    fetch(`/api/services?${new URLSearchParams({
      ...(category && { category }),
      ...(featured !== undefined && { featured: featured.toString() }),
    })}`).then(res => res.json())
  )
}

export function useTestimonials(featured?: boolean) {
  return usePayload(() =>
    fetch(`/api/testimonials?${new URLSearchParams({
      ...(featured !== undefined && { featured: featured.toString() }),
    })}`).then(res => res.json())
  )
}

export function useCaseStudies(category?: string, featured?: boolean) {
  return usePayload(() =>
    fetch(`/api/case-studies?${new URLSearchParams({
      ...(category && { category }),
      ...(featured !== undefined && { featured: featured.toString() }),
    })}`).then(res => res.json())
  )
}

export function useBlogPosts(category?: string, limit?: number) {
  return usePayload(() =>
    fetch(`/api/blog-posts?${new URLSearchParams({
      ...(category && { category }),
      ...(limit && { limit: limit.toString() }),
    })}`).then(res => res.json())
  )
}

export function useTeamMembers(department?: string) {
  return usePayload(() =>
    fetch(`/api/team-members?${new URLSearchParams({
      ...(department && { department }),
    })}`).then(res => res.json())
  )
}

export function useClients(featured?: boolean) {
  return usePayload(() =>
    fetch(`/api/clients?${new URLSearchParams({
      ...(featured !== undefined && { featured: featured.toString() }),
    })}`).then(res => res.json())
  )
}

export function useFAQs(category?: string, featured?: boolean) {
  return usePayload(() =>
    fetch(`/api/faqs?${new URLSearchParams({
      ...(category && { category }),
      ...(featured !== undefined && { featured: featured.toString() }),
    })}`).then(res => res.json())
  )
}

export function useSiteSettings() {
  return usePayload(() =>
    fetch('/api/globals/site-settings').then(res => res.json())
  )
}

export function useCompanyInfo() {
  return usePayload(() =>
    fetch('/api/globals/company-info').then(res => res.json())
  )
}