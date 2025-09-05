'use client'

import { motion } from '@/lib/framer-motion'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  animation?: 'pulse' | 'wave' | 'shimmer'
  delay?: number
}

// Base Skeleton Component with performance optimization
export function Skeleton({ 
  className, 
  animation = 'shimmer',
  delay = 0,
  ...props 
}: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      className={cn(
        "rounded-md bg-muted overflow-hidden relative",
        animation === 'pulse' && "animate-pulse",
        animation === 'shimmer' && "bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.2 }}
      {...props}
    />
  )
}

// Card Skeleton for service pages and case studies
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton className="h-48 w-full" animation="shimmer" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" delay={0.1} />
        <Skeleton className="h-3 w-1/2" delay={0.2} />
      </div>
    </div>
  )
}

// Service Page Skeleton
export function ServicePageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section Skeleton */}
      <div className="space-y-6 mb-12">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-2/3 mx-auto" delay={0.1} />
        <Skeleton className="h-10 w-48 mx-auto rounded-lg" delay={0.2} />
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Features List Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-4">
            <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" delay={i * 0.1} />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" delay={i * 0.1 + 0.05} />
              <Skeleton className="h-3 w-3/4" delay={i * 0.1 + 0.1} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// News/Blog List Skeleton
export function NewsListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="flex space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex space-x-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Team/About Page Skeleton
export function TeamSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <Skeleton className="h-32 w-32 rounded-full mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-24 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Testimonial Skeleton
export function TestimonialSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="bg-card border rounded-lg p-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-center space-x-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-20 w-full" />
          <div className="flex space-x-1">
            {Array.from({ length: 5 }).map((_, starI) => (
              <Skeleton key={starI} className="h-4 w-4" />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// FAQ Skeleton
export function FaqSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="border rounded-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Pricing Table Skeleton
export function PricingSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "border rounded-lg p-8 space-y-6",
            i === 1 && "ring-2 ring-workflo-yellow border-workflo-yellow"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="text-center space-y-3">
            <Skeleton className="h-6 w-24 mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-20 mx-auto" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
          </div>
          
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, featureI) => (
              <div key={featureI} className="flex items-center space-x-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
          
          <Skeleton className="h-12 w-full rounded-lg" />
        </motion.div>
      ))}
    </div>
  )
}

// Data Table Skeleton
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted/50 border-b px-4 py-3">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowI) => (
          <div key={rowI} className="px-4 py-3">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: cols }).map((_, colI) => (
                <Skeleton 
                  key={colI} 
                  className="h-4" 
                  delay={rowI * 0.05 + colI * 0.02} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Image Gallery Skeleton
export function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <Skeleton className="aspect-square w-full" />
        </motion.div>
      ))}
    </div>
  )
}

// Search Results Skeleton
export function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex space-x-4 pt-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}