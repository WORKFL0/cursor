// Service Worker for Workflo IT Services
// Implements caching strategies for optimal performance

const CACHE_NAME = 'workflo-v1.0.0'
const STATIC_CACHE_NAME = 'workflo-static-v1.0.0'
const API_CACHE_NAME = 'workflo-api-v1.0.0'
const IMAGE_CACHE_NAME = 'workflo-images-v1.0.0'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/images/workflo-logo.webp',
  '/images/workflo-logo.png',
  '/favicon.ico',
  '/manifest.json',
]

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/health',
  '/api/company-info',
]

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
}

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then(cache => {
        return cache.addAll(STATIC_ASSETS)
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    Promise.all([
      // Delete old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName.startsWith('workflo-') && 
              ![CACHE_NAME, STATIC_CACHE_NAME, API_CACHE_NAME, IMAGE_CACHE_NAME].includes(cacheName)
            )
            .map(cacheName => caches.delete(cacheName))
        )
      }),
      
      // Claim all clients
      self.clients.claim()
    ])
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Only handle same-origin requests
  if (url.origin !== self.location.origin) {
    return
  }
  
  // Route requests to appropriate handlers
  if (request.method !== 'GET') {
    return // Only cache GET requests
  }
  
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
  } else if (url.pathname.startsWith('/images/') || url.pathname.includes('.webp') || url.pathname.includes('.jpg') || url.pathname.includes('.png')) {
    event.respondWith(handleImageRequest(request))
  } else if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(handleStaticAssets(request))
  } else {
    event.respondWith(handlePageRequest(request))
  }
})

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME)
  
  try {
    // Try network first
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
    
    // If network fails, try cache
    return await cache.match(request) || new Response(
      JSON.stringify({ error: 'Service unavailable' }), 
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return error response
    return new Response(
      JSON.stringify({ error: 'Service unavailable' }), 
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME)
  
  // Try cache first
  const cachedResponse = await cache.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    // Fetch from network
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache the response
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
    
    // Return placeholder image for failed image requests
    return await cache.match('/images/placeholder.jpg') || networkResponse
  } catch (error) {
    // Return placeholder image
    return await cache.match('/images/placeholder.jpg') || new Response('', { status: 404 })
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAssets(request) {
  const cache = await caches.open(STATIC_CACHE_NAME)
  
  // Try cache first
  const cachedResponse = await cache.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    // Fetch from network
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache static assets with long TTL
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    return new Response('', { status: 404 })
  }
}

// Handle page requests with network-first strategy and offline fallback
async function handlePageRequest(request) {
  const cache = await caches.open(CACHE_NAME)
  
  try {
    // Try network first for fresh content
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful page responses
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
    
    // If network response is not ok, try cache
    return await cache.match(request) || await cache.match('/offline')
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page
    return await cache.match('/offline') || new Response(
      '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your internet connection.</p></body></html>',
      { 
        headers: { 'Content-Type': 'text/html' },
        status: 503
      }
    )
  }
}

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms())
  }
})

// Sync offline form submissions
async function syncContactForms() {
  const cache = await caches.open('form-submissions')
  const requests = await cache.keys()
  
  for (const request of requests) {
    try {
      const response = await fetch(request)
      if (response.ok) {
        await cache.delete(request)
      }
    } catch (error) {
      console.error('Failed to sync form submission:', error)
    }
  }
}

// Push notification handling
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json()
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/images/icons/icon-192.png',
        badge: '/images/icons/badge-72.png',
        tag: 'workflo-notification',
        requireInteraction: true,
        actions: [
          {
            action: 'open',
            title: 'Open Workflo'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ]
      })
    )
  }
})

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close()
  
  if (event.action === 'open') {
    event.waitUntil(
      self.clients.openWindow('https://workflo.it')
    )
  }
})

// Message handling for cache updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    event.waitUntil(updateCache())
  }
})

// Update cache programmatically
async function updateCache() {
  const cache = await caches.open(STATIC_CACHE_NAME)
  await cache.addAll(STATIC_ASSETS)
}

// Clean up old cache entries periodically
setInterval(() => {
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => {
      if (cacheName.includes('workflo-') && !cacheName.includes('v1.0.0')) {
        caches.delete(cacheName)
      }
    })
  })
}, 24 * 60 * 60 * 1000) // Daily cleanup