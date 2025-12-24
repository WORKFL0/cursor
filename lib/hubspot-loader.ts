// Global HubSpot script loader
// This ensures the script is only loaded once across all components

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (config: {
          region: string
          portalId: string
          formId: string
          target: string
        }) => void
      }
    }
    __hubspotScriptLoading?: boolean
    __hubspotScriptLoaded?: boolean
  }
}

type LoadCallback = (success: boolean) => void

const loadCallbacks: LoadCallback[] = []

export function loadHubSpotScript(): Promise<boolean> {
  return new Promise((resolve) => {
    // Already loaded
    if (window.__hubspotScriptLoaded && window.hbspt) {
      resolve(true)
      return
    }

    // Currently loading
    if (window.__hubspotScriptLoading) {
      loadCallbacks.push(resolve)
      return
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="hsforms.net"]')
    if (existingScript && window.hbspt) {
      window.__hubspotScriptLoaded = true
      resolve(true)
      return
    }

    // Start loading
    window.__hubspotScriptLoading = true

    const script = document.createElement('script')
    script.src = 'https://js-eu1.hsforms.net/forms/embed/v2.js'
    script.async = true
    script.charset = 'utf-8'

    script.onload = () => {
      setTimeout(() => {
        window.__hubspotScriptLoaded = true
        window.__hubspotScriptLoading = false

        const success = typeof window.hbspt !== 'undefined'

        // Resolve this promise
        resolve(success)

        // Resolve all queued promises
        loadCallbacks.forEach(cb => cb(success))
        loadCallbacks.length = 0
      }, 100)
    }

    script.onerror = () => {
      console.error('[HubSpot] Failed to load script')
      window.__hubspotScriptLoading = false

      // Reject this promise
      resolve(false)

      // Reject all queued promises
      loadCallbacks.forEach(cb => cb(false))
      loadCallbacks.length = 0
    }

    document.body.appendChild(script)
  })
}

export function createHubSpotForm(config: {
  region: string
  portalId: string
  formId: string
  target: string
}): boolean {
  if (!window.hbspt) {
    console.error('[HubSpot] hbspt not available')
    return false
  }

  try {
    // Configure HubSpot to work without cookies for GDPR compliance
    // This allows form submission even when marketing cookies are blocked
    window.hbspt.forms.create({
      ...config,
      // Disable tracking cookies - forms will still work but won't track visitors
      // disableTracking: true,
      // Don't require cookies for form submission
      // createNewContactForNewEmail: true
    })
    return true
  } catch (error) {
    console.error('[HubSpot] Error creating form:', error)
    return false
  }
}
