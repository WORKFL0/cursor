'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from '@/lib/framer-motion'
import { X, Menu, ChevronRight, Sparkles } from 'lucide-react'
import { useLanguage, useLocalizedContent } from '@/lib/contexts/language-context'
import { megaMenuData, megaMenuAnimations, type MegaMenuSection, type MegaMenuItem } from '@/lib/data/mega-menu-data'
import { cn } from '@/lib/utils'

interface MegaMenuProps {
  className?: string
}

export function MegaMenu({ className }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const { language } = useLanguage()
  const { getLocalizedValue } = useLocalizedContent()
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle touch gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0]?.clientY ?? null)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    
    const touchEnd = e.touches[0]?.clientY ?? 0
    const diff = touchStart - touchEnd

    // Close menu on upward swipe
    if (diff < -100) {
      setIsOpen(false)
    }
  }

  const getLocalizedTitle = (item: MegaMenuSection | MegaMenuItem) => {
    return language === 'nl' ? item.titleNL : item.title
  }

  const getLocalizedDescription = (item: MegaMenuSection | MegaMenuItem) => {
    return language === 'nl' ? item.descriptionNL : item.description
  }

  const getLocalizedBadge = (item: MegaMenuItem) => {
    if (!item.badge) return null
    return language === 'nl' ? item.badgeNL : item.badge
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    setActiveSection(null)
  }

  return (
    <>
      {/* Menu Trigger Button */}
      <motion.button
        onClick={toggleMenu}
        className={cn(
          "relative z-[60] flex items-center justify-center",
          "w-12 h-12 rounded-full",
          "bg-gradient-to-r from-workflo-primary to-workflo-secondary",
          "shadow-lg shadow-workflo-primary/25",
          "hover:shadow-xl hover:shadow-workflo-primary/40",
          "border border-workflo-primary/30",
          "backdrop-blur-sm",
          "transition-all duration-300 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-workflo-primary/50 focus:ring-offset-2",
          "group",
          className
        )}
        variants={megaMenuAnimations.menuButton}
        animate={isOpen ? "open" : "closed"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <motion.div
          className="relative"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white drop-shadow-sm" />
          ) : (
            <Menu className="w-6 h-6 text-white drop-shadow-sm group-hover:scale-110 transition-transform duration-200" />
          )}
        </motion.div>
        
        {/* Floating sparkle effect */}
        <motion.div
          className="absolute -top-1 -right-1"
          animate={isOpen ? { scale: 0, opacity: 0 } : { scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <Sparkles className="w-4 h-4 text-workflo-primary-light" />
        </motion.div>
      </motion.button>

      {/* Mega Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={overlayRef}
            variants={megaMenuAnimations.overlay}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
            />

            {/* Main Menu Container */}
            <motion.div
              variants={megaMenuAnimations.container}
              className="relative max-w-6xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Glassmorphism Container */}
              <div className={cn(
                "relative rounded-3xl",
                "bg-white/95 dark:bg-gray-900/95",
                "backdrop-blur-3xl",
                "border border-gray-200 dark:border-gray-700",
                "shadow-2xl shadow-black/20",
                "overflow-hidden"
              )}>
                {/* Header with Better Contrast */}
                <div className="relative p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-workflo-primary to-workflo-secondary">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {language === 'nl' ? 'Navigatie' : 'Navigation'}
                      </h2>
                      <p className="text-white/90 text-sm">
                        {language === 'nl' 
                          ? 'Ontdek alle mogelijkheden van Workflo' 
                          : 'Discover all Workflo possibilities'}
                      </p>
                    </div>
                    <motion.button
                      onClick={toggleMenu}
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Menu Content */}
                <div className="p-6">
                  <motion.div
                    variants={megaMenuAnimations.container}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6"
                  >
                    {megaMenuData.map((section, sectionIndex) => {
                      const IconComponent = section.icon
                      
                      return (
                        <motion.div
                          key={section.id}
                          variants={megaMenuAnimations.section}
                          className={cn(
                            "relative group cursor-pointer",
                            section.featured && "xl:col-span-2 md:col-span-2"
                          )}
                          onMouseEnter={() => setActiveSection(section.id)}
                          onMouseLeave={() => setActiveSection(null)}
                          whileHover={{ y: -4 }}
                        >
                          {/* Section Card */}
                          <div className={cn(
                            "relative h-full rounded-2xl p-6",
                            "bg-white/80 dark:bg-gray-800/80",
                            "hover:bg-white/90 hover:dark:bg-gray-800/90",
                            "border border-gray-200/50 dark:border-gray-700/50",
                            "hover:border-workflo-primary/30 dark:hover:border-workflo-primary/30",
                            "backdrop-blur-sm",
                            "transition-all duration-300",
                            "overflow-hidden"
                          )}>
                            {/* Background Gradient */}
                            <div className={cn(
                              "absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity",
                              section.gradient
                            )} />

                            {/* Header */}
                            <div className="relative mb-4">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className={cn(
                                  "flex-shrink-0 w-10 h-10 rounded-xl",
                                  "bg-gradient-to-r",
                                  section.color,
                                  "flex items-center justify-center",
                                  "shadow-lg"
                                )}>
                                  <IconComponent className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-workflo-primary transition-colors">
                                    {getLocalizedTitle(section)}
                                  </h3>
                                </div>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                {getLocalizedDescription(section)}
                              </p>
                            </div>

                            {/* Items Grid */}
                            <div className="relative space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
                              <AnimatePresence>
                                {section.items.map((item, itemIndex) => {
                                  const ItemIcon = item.icon
                                  const badge = getLocalizedBadge(item)

                                  return (
                                    <motion.div
                                      key={item.href}
                                      variants={megaMenuAnimations.item}
                                      initial="initial"
                                      animate="animate"
                                      transition={{ delay: itemIndex * 0.05 }}
                                    >
                                      <Link
                                        href={item.href}
                                        onClick={toggleMenu}
                                        className={cn(
                                          "group/item block p-3 rounded-xl",
                                          "hover:bg-white/10 active:bg-white/15",
                                          "border border-transparent hover:border-white/20",
                                          "transition-all duration-200",
                                          "focus:outline-none focus:ring-2 focus:ring-workflo-primary/50"
                                        )}
                                      >
                                        <div className="flex items-start space-x-3">
                                          {ItemIcon && (
                                            <div className="flex-shrink-0 mt-0.5">
                                              <ItemIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover/item:text-workflo-primary transition-colors" />
                                            </div>
                                          )}
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                              <h4 className="text-sm font-medium text-white group-hover/item:text-workflo-primary transition-colors">
                                                {getLocalizedTitle(item)}
                                              </h4>
                                              {badge && (
                                                <span className="px-2 py-0.5 text-xs font-medium bg-workflo-primary text-black rounded-full">
                                                  {badge}
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                                              {getLocalizedDescription(item)}
                                            </p>
                                          </div>
                                          <ChevronRight className="w-3 h-3 text-white/40 group-hover/item:text-workflo-primary group-hover/item:translate-x-1 transition-all duration-200 mt-0.5" />
                                        </div>
                                      </Link>
                                    </motion.div>
                                  )
                                })}
                              </AnimatePresence>
                            </div>

                            {/* View All Link for featured sections */}
                            {section.featured && (
                              <div className="relative mt-4 pt-4 border-t border-white/10">
                                <Link
                                  href={`/${section.id}`}
                                  onClick={toggleMenu}
                                  className="inline-flex items-center text-sm font-medium text-workflo-primary hover:text-workflo-primary transition-colors"
                                >
                                  {language === 'nl' ? 'Alles bekijken' : 'View all'}
                                  <ChevronRight className="ml-1 w-4 h-4" />
                                </Link>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </motion.div>

                  {/* Footer */}
                  <motion.div
                    variants={megaMenuAnimations.section}
                    className="mt-8 pt-6 border-t border-white/10"
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                      <div className="text-center sm:text-left">
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {language === 'nl' 
                            ? 'Vragen? Neem contact met ons op!' 
                            : 'Questions? Get in touch with us!'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Link
                          href="/contact"
                          onClick={toggleMenu}
                          className={cn(
                            "px-6 py-3 rounded-xl",
                            "bg-gradient-to-r from-workflo-primary to-workflo-primary",
                            "text-black font-medium text-sm",
                            "hover:shadow-lg hover:shadow-workflo-primary/30",
                            "transition-all duration-200",
                            "focus:outline-none focus:ring-2 focus:ring-workflo-primary/50"
                          )}
                        >
                          {language === 'nl' ? 'Contact' : 'Contact Us'}
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}