'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Briefcase, Phone, User, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
    color: 'text-blue-600'
  },
  {
    href: '/diensten',
    label: 'Services',
    icon: Briefcase,
    color: 'text-green-600'
  },
  {
    href: '/contact',
    label: 'Contact',
    icon: Phone,
    color: 'text-purple-600'
  },
  {
    href: '/over-ons',
    label: 'About',
    icon: User,
    color: 'text-orange-600'
  }
]

export default function BottomNavigation() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showQuickActions, setShowQuickActions] = useState(false)

  // Hide/show on scroll
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 100) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false)
        setShowQuickActions(false)
      } else {
        // Scrolling up
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', controlNavbar)
    return () => window.removeEventListener('scroll', controlNavbar)
  }, [lastScrollY])

  // Quick actions
  const quickActions = [
    {
      label: 'Call Us',
      href: 'tel:+31204236000',
      icon: Phone,
      color: 'bg-green-500'
    },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/31204236000',
      icon: Phone,
      color: 'bg-green-600'
    },
    {
      label: 'Email',
      href: 'mailto:info@workflo.it',
      icon: Phone,
      color: 'bg-blue-500'
    }
  ]

  const getActiveIndex = () => {
    return navItems.findIndex(item => item.href === pathname)
  }

  return (
    <>
      {/* Quick Actions Overlay */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setShowQuickActions(false)}
          />
        )}
      </AnimatePresence>

      {/* Quick Actions Menu */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 md:hidden"
          >
            <div className="flex flex-col space-y-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={action.href}
                    className={`flex items-center ${action.color} text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 min-w-max`}
                    onClick={() => setShowQuickActions(false)}
                  >
                    <action.icon className="w-5 h-5 mr-2" />
                    <span className="font-medium text-sm">{action.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: isVisible ? 0 : 100 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-30 md:hidden"
      >
        {/* Navigation Background */}
        <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl">
          {/* Active Indicator */}
          <motion.div
            className="absolute top-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={false}
            animate={{
              x: `${getActiveIndex() * 25}%`,
              width: '25%'
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          />
          
          <div className="flex items-center justify-between px-2 py-2">
            {/* Navigation Items */}
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex-1 flex flex-col items-center py-2 px-1 min-h-[44px] relative"
                >
                  {/* Touch Target */}
                  <div className="absolute inset-0 rounded-lg" />
                  
                  {/* Icon Container */}
                  <motion.div
                    className={`relative flex items-center justify-center w-8 h-8 mb-1 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-50' 
                        : 'hover:bg-gray-50 active:bg-gray-100'
                    }`}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isActive 
                          ? item.color 
                          : 'text-gray-500'
                      }`}
                    />
                    
                    {/* Active Indicator Dot */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                  
                  {/* Label */}
                  <span
                    className={`text-xs font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'text-blue-600' 
                        : 'text-gray-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              )
            })}
            
            {/* Quick Actions Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowQuickActions(!showQuickActions)}
              className={`flex-1 flex flex-col items-center py-2 px-1 min-h-[44px] transition-all duration-200 ${
                showQuickActions 
                  ? 'bg-blue-50' 
                  : 'hover:bg-gray-50 active:bg-gray-100'
              }`}
            >
              <motion.div
                animate={{ rotate: showQuickActions ? 45 : 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className={`flex items-center justify-center w-8 h-8 mb-1 rounded-lg transition-all duration-200 ${
                  showQuickActions 
                    ? 'bg-blue-100' 
                    : 'bg-gray-100'
                }`}
              >
                <Plus
                  className={`w-5 h-5 transition-colors duration-200 ${
                    showQuickActions 
                      ? 'text-blue-600' 
                      : 'text-gray-600'
                  }`}
                />
              </motion.div>
              <span
                className={`text-xs font-medium transition-colors duration-200 ${
                  showQuickActions 
                    ? 'text-blue-600' 
                    : 'text-gray-500'
                }`}
              >
                Quick
              </span>
            </motion.button>
          </div>
        </div>

        {/* Safe Area for iPhone */}
        <div className="bg-white h-safe-area-inset-bottom" />
      </motion.nav>
    </>
  )
}