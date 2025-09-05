'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from '@/lib/framer-motion'

interface SkeletonLoaderProps {
  count?: number
  featured?: boolean
}

const SkeletonCard = ({ featured = false }: { featured?: boolean }) => {
  return (
    <Card className={`h-full overflow-hidden ${featured ? 'border-primary/20' : ''}`}>
      {/* Image skeleton */}
      <div className={`relative ${featured ? 'h-48' : 'h-40'} bg-muted animate-pulse`}>
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/80 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
      </div>

      <CardHeader className={featured ? 'pb-3' : 'pb-2'}>
        {/* Category and Date skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
          <div className="h-4 w-16 bg-muted/70 rounded animate-pulse" />
        </div>

        {/* Title skeleton */}
        <div className="space-y-2">
          <div className={`h-6 bg-muted rounded animate-pulse ${featured ? 'w-full' : 'w-4/5'}`} />
          <div className="h-6 bg-muted/70 rounded animate-pulse w-3/4" />
        </div>

        {/* Excerpt skeleton */}
        <div className="space-y-2 mt-3">
          <div className="h-4 bg-muted/50 rounded animate-pulse w-full" />
          <div className="h-4 bg-muted/50 rounded animate-pulse w-5/6" />
          <div className="h-4 bg-muted/50 rounded animate-pulse w-2/3" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between">
        {/* Tags skeleton */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <div className="h-5 w-12 bg-muted/60 rounded-full animate-pulse" />
            <div className="h-5 w-16 bg-muted/60 rounded-full animate-pulse" />
            <div className="h-5 w-14 bg-muted/60 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Footer skeleton */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 bg-muted/50 rounded animate-pulse" />
            <div className="h-4 w-16 bg-muted/50 rounded animate-pulse" />
          </div>
          
          {/* Button skeleton */}
          <div className="h-9 w-full bg-muted/40 rounded-md animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonLoader({ count = 6, featured = false }: SkeletonLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={featured ? 
        "grid grid-cols-1 md:grid-cols-2 gap-6" : 
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      }
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <SkeletonCard featured={featured && index < 2} />
        </motion.div>
      ))}
    </motion.div>
  )
}

// Enhanced Article Card Skeleton for external news
export function ExternalNewsSkeletonLoader({ count = 5 }: { count?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  {/* Badges skeleton */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                    <div className="h-5 w-12 bg-muted/70 rounded-full animate-pulse" />
                  </div>
                  
                  {/* Title skeleton */}
                  <div className="space-y-2 mb-3">
                    <div className="h-6 bg-muted rounded animate-pulse w-full" />
                    <div className="h-6 bg-muted/70 rounded animate-pulse w-4/5" />
                  </div>
                  
                  {/* Excerpt skeleton */}
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-muted/50 rounded animate-pulse w-full" />
                    <div className="h-4 bg-muted/50 rounded animate-pulse w-5/6" />
                    <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
                  </div>
                  
                  {/* Date skeleton */}
                  <div className="h-4 w-24 bg-muted/40 rounded animate-pulse" />
                </div>
                
                {/* External link button skeleton */}
                <div className="h-8 w-8 bg-muted/40 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}