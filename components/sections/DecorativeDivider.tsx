'use client'

import { motion } from 'framer-motion'

export default function DecorativeDivider() {
  return (
    <div className="relative py-8 sm:py-12 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.img
          src="/images/yellow-slash.svg"
          alt=""
          className="h-24 opacity-20"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
      </div>
      
      {/* Animated Lines */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.2 }}
        />
        <motion.div
          className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-workflo-yellow/50 to-transparent mt-1"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.4 }}
        />
      </div>
      
      {/* Dots Pattern */}
      <div className="relative z-10 flex justify-center items-center gap-2">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary/30"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 * i }}
          />
        ))}
      </div>
    </div>
  )
}