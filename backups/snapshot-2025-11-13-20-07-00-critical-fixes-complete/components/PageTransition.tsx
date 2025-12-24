'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
}

// Different transitions for different routes
const getRouteTransition = (pathname: string) => {
  // Home page gets a fade-in from center
  if (pathname === '/') {
    return {
      initial: { opacity: 0, scale: 0.95 },
      in: { opacity: 1, scale: 1 },
      out: { opacity: 0, scale: 1.05 }
    }
  }
  
  // Service pages slide in from right
  if (pathname.startsWith('/diensten')) {
    return {
      initial: { opacity: 0, x: 50 },
      in: { opacity: 1, x: 0 },
      out: { opacity: 0, x: -50 }
    }
  }
  
  // Contact slides up from bottom
  if (pathname.startsWith('/contact')) {
    return {
      initial: { opacity: 0, y: 50 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -50 }
    }
  }
  
  // About slides in from left
  if (pathname.startsWith('/over-ons')) {
    return {
      initial: { opacity: 0, x: -50 },
      in: { opacity: 1, x: 0 },
      out: { opacity: 0, x: 50 }
    }
  }
  
  // Default transition
  return pageVariants
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const routeVariants = getRouteTransition(pathname)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={routeVariants}
        transition={pageTransition}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}