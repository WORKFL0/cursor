'use client'

import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import { motion } from 'framer-motion'

export default function SecurityAnimation() {
  const [animationData, setAnimationData] = useState(null)

  useEffect(() => {
    fetch('/animations/security.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading animation:', error))
  }, [])

  if (!animationData) {
    return (
      <div className="flex items-center justify-center w-full h-[400px]">
        <div className="animate-pulse">
          <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full opacity-20" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-md mx-auto"
    >
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        className="w-full h-auto"
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
    </motion.div>
  )
}