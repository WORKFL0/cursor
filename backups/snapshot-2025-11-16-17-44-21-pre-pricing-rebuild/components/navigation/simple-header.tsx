'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from '@/lib/framer-motion'
import { 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Settings, 
  Moon, 
  Sun, 
  Globe, 
  ChevronDown,
  Download,
  Headphones,
  MessageCircle,
  Calendar
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/lib/contexts/language-context'
import { Button } from '@/components/ui/button'

export function SimpleHeader() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [activePopover, setActivePopover] = useState(false)
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // All services and pages for the main menu
  const menuItems = {
    services: [
      { href: '/diensten/managed-it', label: 'Managed IT Services', icon: '🖥️' },
      { href: '/diensten/cloud', label: 'Cloud Oplossingen', icon: '☁️' },
      { href: '/diensten/microsoft-365', label: 'Microsoft 365', icon: '📊' },
      { href: '/diensten/cybersecurity', label: 'Cybersecurity', icon: '🔒' },
      { href: '/diensten/backup-disaster-recovery', label: 'Backup & Recovery', icon: '💾' },
      { href: '/diensten/voip-telefonie', label: 'VoIP Telefonie', icon: '📞' },
      { href: '/diensten/hardware-as-a-service', label: 'Hardware as a Service', icon: '🖨️' },
      { href: '/diensten/cloud-oplossingen', label: 'Cloud Solutions', icon: '🌐' },
    ],
    pages: [
      { href: '/over-ons', label: 'Over Ons', icon: '👥' },
      { href: '/portfolio', label: 'Portfolio', icon: '💼' },
      { href: '/nieuws', label: 'Nieuws', icon: '📰' },
      { href: '/werken-bij', label: 'Werken Bij', icon: '🚀' },
      { href: '/prijzen', label: 'Prijzen', icon: '💰' },
      { href: '/faq', label: 'FAQ', icon: '❓' },
    ],
    sectors: [
      { href: '/sectoren/gezondheidszorg', label: 'Gezondheidszorg', icon: '🏥' },
      { href: '/sectoren/financiele-sector', label: 'Financiële Sector', icon: '🏦' },
      { href: '/sectoren/retail', label: 'Retail', icon: '🛍️' },
      { href: '/sectoren/marketing-reclame', label: 'Marketing & Reclame', icon: '📱' },
      { href: '/sectoren/non-profit', label: 'Non-Profit', icon: '🤝' },
    ]
  }

  const contactOptions = [
    { icon: Phone, label: '020-30 80 465', href: 'tel:020-3080465' },
    { icon: Mail, label: 'info@workflo.it', href: 'mailto:info@workflo.it' },
    { icon: MapPin, label: 'Amsterdam', href: '/contact' },
    { icon: Calendar, label: 'Plan een afspraak', href: '/afspraak' },
    { icon: MessageCircle, label: 'Live Chat', href: '#', onClick: () => {} },
  ]

  const supportOptions = [
    { icon: Download, label: 'Download Support Tool', href: '/downloads' }
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/workflo-logo-dark.png"
              alt="Workflo"
              width={120}
              height={40}
              className="h-10 w-auto dark:hidden"
              priority
            />
            <Image
              src="/images/workflo-logo-new.png"
              alt="Workflo"
              width={120}
              height={40}
              className="h-10 w-auto hidden dark:block"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Menu Dropdown */}
            <div className="relative group">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
                onMouseEnter={() => setActiveDropdown('menu')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Menu className="w-4 h-4" />
                Menu
                <ChevronDown className="w-3 h-3" />
              </Button>
              <AnimatePresence>
                {activeDropdown === 'menu' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ 
                      type: "tween",
                      duration: 0.2,
                      ease: "easeOut"
                    }}
                    className="absolute top-full left-0 mt-2 w-[480px] max-w-[calc(100vw-2rem)] bg-background border rounded-xl shadow-lg z-50"
                    style={{
                      transformOrigin: 'top left',
                      maxHeight: 'calc(100vh - 10rem)',
                      overflowY: 'auto'
                    }}
                    onMouseEnter={() => setActiveDropdown('menu')}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="grid grid-cols-3 gap-2 p-4">
                  {/* Services Column */}
                  <div>
                    <h3 className="font-semibold mb-2 text-xs uppercase text-muted-foreground">Diensten</h3>
                    <div className="space-y-1">
                      {menuItems.services.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-1 px-1 py-1 text-xs rounded hover:bg-accent transition-colors"
                        >
                          <span className="text-xs flex-shrink-0">{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Pages Column */}
                  <div>
                    <h3 className="font-semibold mb-2 text-xs uppercase text-muted-foreground">Pagina's</h3>
                    <div className="space-y-1">
                      {menuItems.pages.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-1 px-1 py-1 text-xs rounded hover:bg-accent transition-colors"
                        >
                          <span className="text-xs flex-shrink-0">{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Sectors Column */}
                  <div>
                    <h3 className="font-semibold mb-2 text-xs uppercase text-muted-foreground">Sectoren</h3>
                    <div className="space-y-1">
                      {menuItems.sectors.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-1 px-1 py-1 text-xs rounded hover:bg-accent transition-colors"
                        >
                          <span className="text-xs flex-shrink-0">{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Popover */}
            <div className="relative group">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
                onMouseEnter={() => setActivePopover(true)}
                onMouseLeave={() => setActivePopover(false)}
              >
                <Phone className="w-4 h-4" />
                Contact
                <ChevronDown className="w-3 h-3" />
              </Button>
              <AnimatePresence>
                {activePopover && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ 
                      type: "tween",
                      duration: 0.2,
                      ease: "easeOut"
                    }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 p-4 bg-background border rounded-xl shadow-lg z-50"
                    style={{ transformOrigin: 'top center' }}
                    onMouseEnter={() => setActivePopover(true)}
                    onMouseLeave={() => setActivePopover(false)}
                  >
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">Neem contact op</h3>
                      <div className="space-y-2">
                        {contactOptions.map((option, index) => (
                          <a
                            key={index}
                            href={option.href}
                            onClick={option.onClick}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                          >
                            <option.icon className="w-4 h-4 text-primary" />
                            <span className="text-sm">{option.label}</span>
                          </a>
                        ))}
                      </div>
                      <div className="pt-3 border-t">
                        <Link href="/contact">
                          <Button className="w-full">Contact Pagina</Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Support Dropdown */}
            <div className="relative group">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
                onMouseEnter={() => setActiveDropdown('support')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Headphones className="w-4 h-4" />
                Support
                <ChevronDown className="w-3 h-3" />
              </Button>
              <AnimatePresence>
                {activeDropdown === 'support' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ 
                      type: "tween",
                      duration: 0.2,
                      ease: "easeOut"
                    }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-background border rounded-xl shadow-lg z-50 min-w-[200px]"
                    style={{ transformOrigin: 'top center' }}
                    onMouseEnter={() => setActiveDropdown('support')}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {supportOptions.map((option, index) => (
                      <Link 
                        key={index} 
                        href={option.href} 
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                      >
                        <option.icon className="w-4 h-4" />
                        <span>{option.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings Dropdown */}
            <div className="relative group">
              <Button 
                variant="ghost" 
                size="icon"
                onMouseEnter={() => setActiveDropdown('settings')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <AnimatePresence>
                {activeDropdown === 'settings' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ 
                      type: "tween",
                      duration: 0.2,
                      ease: "easeOut"
                    }}
                    className="absolute top-full right-0 mt-2 p-2 bg-background border rounded-xl shadow-lg z-50 min-w-[180px]"
                    style={{ transformOrigin: 'top right' }}
                    onMouseEnter={() => setActiveDropdown('settings')}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-left"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun className="w-4 h-4" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-4 h-4" />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </button>
                    <div className="my-1 border-t" />
                    <button
                      onClick={() => setLanguage('nl')}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-left"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Nederlands {language === 'nl' && '✓'}</span>
                    </button>
                    <button
                      onClick={() => setLanguage('en')}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-left"
                    >
                      <Globe className="w-4 h-4" />
                      <span>English {language === 'en' && '✓'}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.2 
            }}
            className="md:hidden overflow-hidden bg-background border-t origin-top"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {/* Mobile Menu Items */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm uppercase text-muted-foreground">Diensten</h3>
                {menuItems.services.slice(0, 4).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
                <Link
                  href="/diensten"
                  className="text-primary text-sm pl-3"
                  onClick={() => setMenuOpen(false)}
                >
                  Bekijk alle diensten →
                </Link>
              </div>

              {/* Mobile Contact */}
              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-semibold text-sm uppercase text-muted-foreground">Contact</h3>
                {contactOptions.slice(0, 3).map((option, index) => (
                  <a
                    key={index}
                    href={option.href}
                    className="flex items-center gap-3 px-3 py-2"
                  >
                    <option.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm">{option.label}</span>
                  </a>
                ))}
              </div>

              {/* Mobile Settings */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="flex items-center gap-2"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage(language === 'nl' ? 'en' : 'nl')}
                  className="flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  {language === 'nl' ? 'NL' : 'EN'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}