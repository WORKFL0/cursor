'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useSearchParams } from 'next/navigation'

export default function LoadingProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Start loading
    setIsLoading(true)
    setProgress(0)

    // Simulate progressive loading
    const progressTimer = setTimeout(() => {
      setProgress(30)
    }, 100)

    const progressTimer2 = setTimeout(() => {
      setProgress(70)
    }, 300)

    const completeTimer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => setIsLoading(false), 200)
    }, 500)

    return () => {
      clearTimeout(progressTimer)
      clearTimeout(progressTimer2)
      clearTimeout(completeTimer)
    }
  }, [pathname, searchParams])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 h-1"
        >
          {/* Background */}
          <div className="w-full h-full bg-gray-200/50 backdrop-blur-sm" />
          
          {/* Progress Bar */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 shadow-lg"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ 
              type: 'tween',
              ease: progress === 100 ? 'easeOut' : 'easeInOut',
              duration: progress === 100 ? 0.2 : 0.3
            }}
          />
          
          {/* Shimmer Effect */}
          <motion.div
            className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}