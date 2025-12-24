'use client'

import { useState, useEffect } from 'react'
import { X, Download, Smartphone, Monitor } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true)
      return
    }

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault()
      
      // Save the event for later use
      setDeferredPrompt(e)
      
      // Show our custom install prompt after a delay
      setTimeout(() => {
        const lastDismissed = localStorage.getItem('pwa-install-dismissed')
        const lastShown = localStorage.getItem('pwa-install-shown')
        const now = Date.now()
        
        // Don't show if dismissed in last 7 days or shown in last 24 hours
        if (lastDismissed && now - parseInt(lastDismissed) < 7 * 24 * 60 * 60 * 1000) {
          return
        }
        
        if (lastShown && now - parseInt(lastShown) < 24 * 60 * 60 * 1000) {
          return
        }
        
        setShowPrompt(true)
        localStorage.setItem('pwa-install-shown', now.toString())
      }, 10000) // Show after 10 seconds
    }

    // Listen for successful app installation
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      
      // Show thank you message
      setTimeout(() => {
        alert('Thank you for installing Workflo IT Services! You can now access us from your home screen.')
      }, 1000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      // Show the install prompt
      await deferredPrompt.prompt()
      
      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
        localStorage.setItem('pwa-install-dismissed', Date.now().toString())
      }
      
      // Clear the deferred prompt
      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error('Error showing install prompt:', error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Don't show if already installed or no prompt available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            {isMobile ? (
              <Smartphone className="w-6 h-6 text-blue-600 mr-2" />
            ) : (
              <Monitor className="w-6 h-6 text-blue-600 mr-2" />
            )}
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Install Workflo IT
              </h3>
              <p className="text-xs text-gray-500">
                Add to your {isMobile ? 'home screen' : 'desktop'}
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 p-1 -mt-1 -mr-1"
            aria-label="Dismiss install prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Get faster access and work offline. Install our app for the best experience.
        </p>

        {/* Benefits */}
        <ul className="text-xs text-gray-500 mb-4 space-y-1">
          <li className="flex items-center">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
            Works offline
          </li>
          <li className="flex items-center">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
            Faster loading
          </li>
          <li className="flex items-center">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
            Native app experience
          </li>
        </ul>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Later
          </button>
        </div>
      </div>
      
      {/* Custom styles for animation */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}