'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from '@/lib/framer-motion'
import { Phone, Calendar } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/language-context'
import { Button } from '@/components/ui/button'
import { MegaMenu } from '@/components/navigation/mega-menu'
import LanguageSwitcher from '@/components/shared/language-switcher'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { cn } from '@/lib/utils'

interface ModernHeaderProps {
  className?: string
}

export function ModernHeader({ className }: ModernHeaderProps) {
  const { language } = useLanguage()

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full",
      "bg-background/80 backdrop-blur-xl",
      "border-b border-border/50",
      "shadow-lg shadow-black/5",
      "transition-all duration-300",
      className
    )}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <Link 
              href="/" 
              className="flex items-center group transition-all duration-300 hover:scale-105"
              aria-label="Workflo Home"
            >
              <div className="relative">
                <Image
                  src="/images/workflo-logo-dark.png"
                  alt="Workflo"
                  width={140}
                  height={70}
                  className="h-14 w-auto dark:hidden transition-all duration-300 group-hover:brightness-110"
                  priority
                />
                <Image
                  src="/images/workflo-logo-new.png"
                  alt="Workflo"
                  width={140}
                  height={70}
                  className="h-14 w-auto hidden dark:block transition-all duration-300 group-hover:brightness-110"
                  priority
                />
                
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-workflo-primary/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
            </Link>
            
            {/* Tagline - Hidden on mobile */}
            <div className="hidden lg:block">
              <div className="h-8 w-px bg-border/50 mx-4" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">
                  {language === 'nl' 
                    ? 'IT die je groei versnelt' 
                    : 'IT that accelerates your growth'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Center Section - Navigation Mega Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <MegaMenu className="relative" />
          </motion.div>

          {/* Right Section - Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center space-x-4"
          >
            
            {/* Quick Actions - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-3">
              
              {/* Emergency Call Button */}
              <Link
                href="tel:020-30-80-465"
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-xl",
                  "bg-red-500/10 hover:bg-red-500/20",
                  "border border-red-500/20 hover:border-red-500/30",
                  "text-red-600 dark:text-red-400",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-red-500/30",
                  "group"
                )}
              >
                <Phone className="w-4 h-4 group-hover:animate-pulse" />
                <span className="text-sm font-medium">
                  {language === 'nl' ? 'Noodhulp' : 'Emergency'}
                </span>
              </Link>

              {/* Consultation Button */}
              <Link
                href="/contact#consult"
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-xl",
                  "bg-workflo-primary/10 hover:bg-workflo-primary/20",
                  "border border-workflo-primary/20 hover:border-workflo-primary/30",
                  "text-workflo-secondary dark:text-workflo-primary",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-workflo-primary/30",
                  "group"
                )}
              >
                <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">
                  {language === 'nl' ? 'Gratis Consult' : 'Free Consult'}
                </span>
              </Link>
            </div>

            {/* Utility Controls */}
            <div className="flex items-center space-x-2">
              {/* Language Switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              
              {/* Theme Toggle */}
              <ThemeToggle />
            </div>

            {/* Primary CTA */}
            <div className="hidden sm:block">
              <Link href="/contact">
                <Button 
                  size="sm"
                  className={cn(
                    "px-6 py-2 h-10",
                    "bg-gradient-to-r from-workflo-primary to-workflo-secondary",
                    "hover:from-workflo-secondary to-workflo-primary",
                    "text-white font-semibold",
                    "shadow-lg shadow-workflo-primary/25",
                    "hover:shadow-xl hover:shadow-workflo-primary/40",
                    "border-0",
                    "transition-all duration-300",
                    "group relative overflow-hidden"
                  )}
                >
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <span className="relative z-10">
                    {language === 'nl' ? 'Laten we praten' : 'Let\'s Talk'}
                  </span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Mobile Bottom Bar - Visible only on mobile */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="sm:hidden border-t border-border/30 py-3"
        >
          <div className="flex items-center justify-between">
            
            {/* Mobile Language Switcher */}
            <LanguageSwitcher />
            
            {/* Mobile Quick Actions */}
            <div className="flex items-center space-x-3">
              <Link
                href="tel:020-30-80-465"
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{language === 'nl' ? 'Nood' : 'SOS'}</span>
              </Link>
              
              <Link href="/contact">
                <Button 
                  size="sm" 
                  className="h-8 px-4 bg-gradient-to-r from-workflo-primary to-workflo-primary text-black font-medium"
                >
                  {language === 'nl' ? 'Contact' : 'Contact'}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-workflo-primary/5 rounded-full blur-3xl pointer-events-none" />
    </header>
  )
}