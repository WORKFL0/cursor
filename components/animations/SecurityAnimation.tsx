'use client'

import { motion } from '@/lib/framer-motion'

export default function SecurityAnimation() {
  // Placeholder animation - lottie-react dependency not installed
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-md mx-auto"
    >
      <div className="flex items-center justify-center w-full h-[400px]">
        <div className="animate-pulse">
          <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full opacity-20" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
    </motion.div>
  )
}