'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { Menu, X, Home, Briefcase, Phone, User, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { 
    href: '/', 
    label: 'Home', 
    icon: Home,
    description: 'Back to homepage'
  },
  { 
    href: '/diensten', 
    label: 'Services', 
    icon: Briefcase,
    description: 'Our IT services'
  },
  { 
    href: '/contact', 
    label: 'Contact', 
    icon: Phone,
    description: 'Get in touch'
  },
  { 
    href: '/over-ons', 
    label: 'About', 
    icon: User,
    description: 'About Workflo'
  }
]

interface MobileNavigationProps {
  className?: string
}

export default function MobileNavigation({ className = '' }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const pathname = usePathname()
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close menu when pathname changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Handle swipe gestures
  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null) 
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    // Close menu on left swipe when open
    if (isLeftSwipe && isOpen) {
      setIsOpen(false)
    }
    
    // Open menu on right swipe from left edge when closed
    if (isRightSwipe && !isOpen && touchStart < 20) {
      setIsOpen(true)
    }
  }

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [touchStart, touchEnd, isOpen])

  // Handle drag to close
  const handleDrag = (event: MouseEvent | TouchEvent, info: PanInfo) => {
    if (info.offset.x < -100) {
      setIsOpen(false)
    }
  }

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden relative z-50 p-2 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm hover:bg-gray-50 transition-all duration-200 ${className}`}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-gray-700" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Overlay and Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              ref={overlayRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 200,
                mass: 0.8
              }}
              drag="x"
              dragConstraints={{ left: -300, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDrag}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white shadow-2xl md:hidden overflow-hidden"
            >
              {/* Menu Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <div className="w-6 h-6 bg-white rounded-sm"></div>
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Workflo IT</h2>
                    <p className="text-blue-100 text-sm">Professional IT Services</p>
                  </div>
                </div>
                
                {/* Swipe indicator */}
                <div className="mt-6 flex items-center text-blue-100 text-xs">
                  <div className="w-8 h-0.5 bg-white/30 rounded-full mr-2"></div>
                  Swipe left to close
                </div>
              </div>

              {/* Menu Items */}
              <div className="px-2 py-4">
                {menuItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: index * 0.1 + 0.1,
                        duration: 0.3
                      }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center px-4 py-4 mx-2 mb-2 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <div className={`p-2 rounded-lg mr-4 transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1">
                          <div className={`font-semibold ${
                            isActive ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {item.label}
                          </div>
                          <div className={`text-sm ${
                            isActive ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {item.description}
                          </div>
                        </div>
                        
                        <ChevronRight className={`w-4 h-4 transition-all duration-200 ${
                          isActive 
                            ? 'text-blue-600 transform translate-x-1' 
                            : 'text-gray-400 group-hover:text-blue-600 group-hover:transform group-hover:translate-x-1'
                        }`} />
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-50 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">
                    Need help?
                  </p>
                  <Link
                    href="/contact"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact us anytime
                  </Link>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}