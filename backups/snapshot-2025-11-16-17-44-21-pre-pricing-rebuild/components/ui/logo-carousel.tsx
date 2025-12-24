"use client"

import { motion, useAnimationFrame } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

interface Logo {
  name: string
  logo: string
  sector?: string
}

interface LogoCarouselProps {
  logos: Logo[]
  speed?: number
}

export default function LogoCarousel({ logos, speed = 0.5 }: LogoCarouselProps) {
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)

  // Speed (pixels per frame) - configurable
  const SPEED = speed

  // Infinite scrolling logic
  useAnimationFrame(() => {
    if (row1Ref.current) {
      row1Ref.current.scrollLeft += SPEED
      if (row1Ref.current.scrollLeft >= row1Ref.current.scrollWidth / 2) {
        row1Ref.current.scrollLeft = 0
      }
    }

    if (row2Ref.current) {
      row2Ref.current.scrollLeft -= SPEED
      if (row2Ref.current.scrollLeft <= 0) {
        row2Ref.current.scrollLeft = row2Ref.current.scrollWidth / 2
      }
    }
  })

  // Double logos to create seamless loop - Art Director approved
  const doubled = [...logos, ...logos]

  return (
    <div className="py-12 relative">
      {/* Fade Mask Left - Art Director colors */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-white via-white to-transparent dark:from-workflo-black dark:via-workflo-black z-20" />

      {/* Fade Mask Right - Art Director colors */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white via-white to-transparent dark:from-workflo-black dark:via-workflo-black z-20" />

      <div className="flex flex-col gap-8">
        {/* ROW 1 - Scrolling Right */}
        <div
          ref={row1Ref}
          className="overflow-hidden whitespace-nowrap flex gap-12 will-change-scroll"
          style={{ scrollBehavior: 'auto' }}
        >
          {doubled.map((logo, i) => (
            <motion.div
              key={`row1-${logo.name}-${i}`}
              className="inline-flex items-center justify-center min-w-[140px] h-16 opacity-60 hover:opacity-100 transition-all duration-200"
              whileHover={{ scale: 1.05, opacity: 1 }}
            >
              <Image
                src={logo.logo}
                alt={logo.name}
                width={140}
                height={64}
                className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-200"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>

        {/* ROW 2 - Scrolling Left */}
        <div
          ref={row2Ref}
          className="overflow-hidden whitespace-nowrap flex gap-12 will-change-scroll"
          style={{ scrollBehavior: 'auto' }}
        >
          {doubled.map((logo, i) => (
            <motion.div
              key={`row2-${logo.name}-${i}`}
              className="inline-flex items-center justify-center min-w-[140px] h-16 opacity-60 hover:opacity-100 transition-all duration-200"
              whileHover={{ scale: 1.05, opacity: 1 }}
            >
              <Image
                src={logo.logo}
                alt={logo.name}
                width={140}
                height={64}
                className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-200"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
