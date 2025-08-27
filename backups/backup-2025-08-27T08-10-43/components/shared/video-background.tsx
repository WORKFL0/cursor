'use client'

import { useState, useEffect } from 'react'

interface VideoBackgroundProps {
  videos: string[]
  opacity?: number
  className?: string
  overlay?: boolean
}

export function VideoBackground({ 
  videos, 
  opacity = 0.2, 
  className = "",
  overlay = true 
}: VideoBackgroundProps) {
  const [currentVideo, setCurrentVideo] = useState(0)

  // Cycle through videos for variety
  useEffect(() => {
    if (videos.length > 1) {
      const interval = setInterval(() => {
        setCurrentVideo((prev) => (prev + 1) % videos.length)
      }, 15000) // Change video every 15 seconds
      
      return () => clearInterval(interval)
    }
  }, [videos.length])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Dark overlay for better text readability */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/30 to-background/50 z-10" />
      )}
      
      <video
        key={currentVideo}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity }}
        preload="metadata"
        onError={() => {
          // Fallback to next video if current fails
          if (videos.length > 1) {
            setCurrentVideo((prev) => (prev + 1) % videos.length)
          }
        }}
      >
        <source src={videos[currentVideo]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

// Predefined video sets for different contexts
export const VideoSets = {
  hero: [
    '/videos/Workflo_W_final.mp4',
    '/videos/Workflo_W_final_1.mp4',
    '/videos/Workflo_W_final_3.mp4'
  ],
  code: [
    '/videos/Workflo-code-animatie.mp4',
    '/videos/Workflo-code-animatie-2.mp4',
    '/videos/Workflo-code-animatie-3.mp4',
    '/videos/Workflo-code-animatie (2).mp4'
  ],
  mobile: [
    '/videos/Mobile-Device-Header.mp4',
    '/videos/Mobile-Device-Header-1.mp4',
    '/videos/Mobile-Device-Header-2.mp4',
    '/videos/Mobile-Device-Header-3.mp4',
    '/videos/Workflo_W_Mobile_1.mp4',
    '/videos/Workflo_W_Mobile_1-1.mp4',
    '/videos/Workflo_W_Mobile-2.mp4'
  ],
  security: [
    '/videos/Security_1.mp4'
  ]
}