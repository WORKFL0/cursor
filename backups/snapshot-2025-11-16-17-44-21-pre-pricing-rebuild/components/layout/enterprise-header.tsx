'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from '@/lib/framer-motion'
import { 
  Menu, X, Search, Phone, ChevronDown, Shield, Cloud, Monitor, 
  Server, Lock, Users, Globe, HelpCircle, Book, Download, Calendar,
  ArrowRight, Star, TrendingUp, Zap, CheckCircle, Briefcase, 
  Building2, Heart, Calculator, FileText, MessageSquare, Mail,
  MapPin, Clock, ExternalLink, User, Settings, LogOut, ChevronRight,
  Film, Palette, ShoppingBag, UserCircle, History, Smile
} from 'lucide-react'
import { useLanguage } from '@/lib/contexts/language-context'
import { cn } from '@/lib/utils'
import LanguageSwitcher from '@/components/shared/language-switcher'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Enterprise Navigation Structure
const navigationStructure = {
  nl: {
    services: {
      title: 'Diensten',
      featured: [
        { 
          title: 'Managed IT', 
          description: 'Complete IT-beheer',
          href: '/diensten/managed-it',
          icon: Monitor,
          badge: 'Populair'
        },
        { 
          title: 'Cybersecurity', 
          description: 'Digitale beveiliging',
          href: '/diensten/cybersecurity',
          icon: Shield,
          badge: 'Top'
        }
      ],
      categories: [
        {
          title: 'IT Beheer & Support',
          items: [
            { title: 'IT Beheer', href: '/diensten/it-beheer', icon: Server },
            { title: 'Hardware as a Service', href: '/diensten/hardware-as-a-service', icon: Monitor }
          ]
        },
        {
          title: 'Cloud & Infrastructuur',
          items: [
            { title: 'Cloud Oplossingen', href: '/diensten/cloud-oplossingen', icon: Cloud },
            { title: 'Microsoft 365', href: '/diensten/microsoft-365', icon: Building2 },
            { title: 'Backup & Recovery', href: '/diensten/backup-disaster-recovery', icon: Shield }
          ]
        },
        {
          title: 'Beveiliging & Communicatie',
          items: [
            { title: 'Cybersecurity', href: '/diensten/cybersecurity', icon: Lock },
            { title: 'VoIP Telefonie', href: '/diensten/voip-telefonie', icon: Phone },
            { title: 'Netwerk Beveiliging', href: '/diensten/netwerk-beveiliging', icon: Shield }
          ]
        }
      ],
      cta: {
        primary: { text: 'Gratis IT Health Check', href: '/contact', icon: CheckCircle },
        secondary: { text: 'Bekijk alle diensten', href: '/diensten', icon: ArrowRight }
      }
    },
    sectors: {
      title: 'Sectoren',
      items: [
        { title: 'Architecten', description: 'CAD/BIM & render oplossingen', href: '/sectoren/architecten', icon: Building2 },
        { title: 'Financiële Sector', description: 'Compliance & security', href: '/sectoren/financiele-sector', icon: Building2 },
        { title: 'Gezondheidszorg', description: 'EPD & medische IT', href: '/sectoren/gezondheidszorg', icon: Heart },
        { title: 'Media', description: 'Video & streaming', href: '/sectoren/media', icon: Film },
        { title: 'Marketing/Reclame', description: 'Creative workflows', href: '/sectoren/marketing-reclame', icon: Palette },
        { title: 'Retail', description: 'POS & e-commerce', href: '/sectoren/retail', icon: ShoppingBag },
        { title: 'ZZP', description: 'Freelancer pakketten', href: '/sectoren/zzp', icon: User },
        { title: 'Non-Profit', description: 'Speciale tarieven', href: '/sectoren/non-profit', icon: Heart },
        { title: 'Divers', description: 'Andere sectoren', href: '/sectoren/divers', icon: Briefcase }
      ]
    },
    about: {
      title: 'Over Ons',
      items: [
        { title: 'Over Workflo', href: '/over-ons', icon: Building2 },
        { title: 'Case Studies', href: '/case-studies', icon: FileText },
        { title: 'Nieuws & Blog', href: '/nieuws', icon: Book },
        { title: 'Werken bij Workflo', href: '/careers', icon: Users }
      ]
    },
    support: {
      title: 'Support & Resources',
      items: [
        { title: 'Contact', href: '/contact', icon: Phone },
        { title: 'Support Center', href: '/support', icon: HelpCircle, badge: '24/7' },
        { title: 'Tevredenheidscheck', href: '/tevredenheidscheck', icon: Smile, badge: 'Nieuw' },
        { title: 'Veelgestelde vragen', href: '/faq', icon: MessageSquare },
        { title: 'Prijzen', href: '/prijzen', icon: Calculator },
        { title: 'Downloads', href: '/downloads', icon: Download },
        { title: 'System Status', href: '/system-status', icon: TrendingUp, badge: 'Live' }
      ]
    }
  },
  en: {
    services: {
      title: 'Services',
      featured: [
        { 
          title: 'Managed IT Services', 
          description: 'Complete IT management for your organization',
          href: '/diensten/managed-it',
          icon: Monitor,
          badge: 'Popular'
        },
        { 
          title: 'Cybersecurity', 
          description: 'Protect your business from digital threats',
          href: '/diensten/cybersecurity',
          icon: Shield,
          badge: 'Recommended'
        }
      ],
      categories: [
        {
          title: 'IT Management & Support',
          items: [
            { title: 'IT Management', href: '/diensten/it-beheer', icon: Server },
            { title: 'Hardware as a Service', href: '/diensten/hardware-as-a-service', icon: Monitor }
          ]
        },
        {
          title: 'Cloud & Infrastructure',
          items: [
            { title: 'Cloud Solutions', href: '/diensten/cloud-oplossingen', icon: Cloud },
            { title: 'Microsoft 365', href: '/diensten/microsoft-365', icon: Building2 },
            { title: 'Backup & Recovery', href: '/diensten/backup-disaster-recovery', icon: Shield }
          ]
        },
        {
          title: 'Security & Communication',
          items: [
            { title: 'Cybersecurity', href: '/diensten/cybersecurity', icon: Lock },
            { title: 'VoIP Telephony', href: '/diensten/voip-telefonie', icon: Phone },
            { title: 'Network Security', href: '/diensten/netwerk-beveiliging', icon: Shield }
          ]
        }
      ],
      cta: {
        primary: { text: 'Free IT Health Check', href: '/contact', icon: CheckCircle },
        secondary: { text: 'View all services', href: '/diensten', icon: ArrowRight }
      }
    },
    sectors: {
      title: 'Industries',
      items: [
        { title: 'Architects', description: 'CAD/BIM & rendering', href: '/sectoren/architecten', icon: Building2 },
        { title: 'Financial Sector', description: 'Compliance & security', href: '/sectoren/financiele-sector', icon: Building2 },
        { title: 'Healthcare', description: 'EPD & medical IT', href: '/sectoren/gezondheidszorg', icon: Heart },
        { title: 'Media', description: 'Video & streaming', href: '/sectoren/media', icon: Film },
        { title: 'Marketing/Advertising', description: 'Creative workflows', href: '/sectoren/marketing-reclame', icon: Palette },
        { title: 'Retail', description: 'POS & e-commerce', href: '/sectoren/retail', icon: ShoppingBag },
        { title: 'Freelancers', description: 'Freelancer packages', href: '/sectoren/zzp', icon: User },
        { title: 'Non-Profit', description: 'Special rates', href: '/sectoren/non-profit', icon: Heart },
        { title: 'Other', description: 'Other industries', href: '/sectoren/divers', icon: Briefcase }
      ]
    },
    about: {
      title: 'About',
      items: [
        { title: 'About Workflo', href: '/over-ons', icon: Building2 },
        { title: 'Case Studies', href: '/case-studies', icon: FileText },
        { title: 'News & Blog', href: '/nieuws', icon: Book },
        { title: 'Careers', href: '/careers', icon: Users }
      ]
    },
    support: {
      title: 'Support & Resources',
      items: [
        { title: 'Contact', href: '/contact', icon: Phone },
        { title: 'Support Center', href: '/support', icon: HelpCircle, badge: '24/7' },
        { title: 'Satisfaction Check', href: '/tevredenheidscheck', icon: Smile, badge: 'New' },
        { title: 'FAQ', href: '/faq', icon: MessageSquare },
        { title: 'Pricing', href: '/prijzen', icon: Calculator },
        { title: 'Downloads', href: '/downloads', icon: Download },
        { title: 'System Status', href: '/system-status', icon: TrendingUp, badge: 'Live' }
      ]
    }
  }
}

export function EnterpriseHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ username?: string; role?: string } | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const { language } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const navigation = navigationStructure[language]

  // Check authentication status on mount and when pathname changes
  useEffect(() => {
    checkAuthStatus()
  }, [pathname])
  
  // Check auth status on mount with a retry to ensure cookies are loaded
  useEffect(() => {
    checkAuthStatus()
    
    // Also check again after a short delay in case cookies aren't immediately available
    const timer = setTimeout(() => {
      checkAuthStatus()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const checkAuthStatus = async () => {
    // Don't show loading state if we're just rechecking
    if (!isAuthenticated && !currentUser) {
      setAuthLoading(true)
    }
    
    try {
      const response = await fetch('/api/cms/auth', {
        credentials: 'include', // Ensure cookies are sent
        cache: 'no-store' // Prevent caching of auth status
      })
      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(data.authenticated === true)
        setCurrentUser(data.user || null)
      } else {
        setIsAuthenticated(false)
        setCurrentUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
      setCurrentUser(null)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/cms/auth', {
        method: 'DELETE'
      })
      if (response.ok) {
        setIsAuthenticated(false)
        setCurrentUser(null)
        router.push('/login')
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null)
        setMobileMenuOpen(false)
        setIsSearchFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  const isActivePage = (href: string) => {
    if (href === '/' && pathname === '/') return true
    if (href !== '/' && pathname?.startsWith(href)) return true
    return false
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar - Contact Info (Desktop Only) */}
      <div className="hidden lg:block bg-gradient-to-r from-gray-900 to-gray-800 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <a 
                href="tel:+31203080465" 
                className="flex items-center gap-2 hover:text-workflo-yellow transition-colors"
                suppressHydrationWarning
              >
                <Phone className="w-3 h-3" />
                020-30 80 465
              </a>
              <a 
                href="mailto:info@workflo.it" 
                className="flex items-center gap-2 hover:text-workflo-yellow transition-colors"
                suppressHydrationWarning
              >
                <Mail className="w-3 h-3" />
                info@workflo.it
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                Amsterdam
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/support" className="flex items-center gap-2 hover:text-workflo-yellow transition-colors">
                <HelpCircle className="w-3 h-3" />
                Support
              </Link>
              {authLoading ? (
                // Show nothing or a loading indicator while checking auth
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserCircle className="w-3 h-3" />
                  <span>...</span>
                </div>
              ) : isAuthenticated && currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:text-workflo-yellow transition-colors">
                      <UserCircle className="w-3 h-3" />
                      <span>{currentUser.username || 'Account'}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{currentUser.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          Rol: {currentUser.role === 'admin' ? 'Administrator' : currentUser.role}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/cms" className="cursor-pointer">
                        <Monitor className="mr-2 h-4 w-4" />
                        <span>CMS Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/cms/security" className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Security & Users</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/cms/security#password" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{language === 'nl' ? 'Wijzig Wachtwoord' : 'Change Password'}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="#" className="cursor-pointer opacity-50" onClick={(e) => e.preventDefault()}>
                        <History className="mr-2 h-4 w-4" />
                        <span>Audit Log</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/support" className="cursor-pointer">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>Help & Documentatie</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{language === 'nl' ? 'Uitloggen' : 'Log out'}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" className="flex items-center gap-2 hover:text-workflo-yellow transition-colors">
                  <User className="w-3 h-3" />
                  {language === 'nl' ? 'Inloggen' : 'Login'}
                </Link>
              )}
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center group"
              aria-label="Workflo Home"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/images/workflo-logo-dark.png"
                  alt="Workflo"
                  width={120}
                  height={60}
                  className="h-12 w-auto dark:hidden"
                  priority
                />
                <Image
                  src="/images/workflo-logo-new.png"
                  alt="Workflo"
                  width={120}
                  height={60}
                  className="h-12 w-auto hidden dark:block"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8" ref={dropdownRef}>
              {/* Main Menu Items */}
              <div className="flex items-center gap-1">
                {/* Services Mega Menu */}
                <div className="relative">
                  <button
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      activeDropdown === 'services' || pathname?.startsWith('/diensten')
                        ? "bg-workflo-yellow/10 text-workflo-yellow-dark"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    onClick={() => setActiveDropdown(activeDropdown === 'services' ? null : 'services')}
                    onMouseEnter={() => setActiveDropdown('services')}
                  >
                    {navigation.services.title}
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      activeDropdown === 'services' && "rotate-180"
                    )} />
                  </button>

                  {/* Mega Menu Content */}
                  <AnimatePresence>
                    {activeDropdown === 'services' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-2 w-[800px] bg-background border border-border rounded-xl shadow-2xl"
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <div className="grid grid-cols-12 gap-4 p-4">
                          {/* Featured Services */}
                          <div className="col-span-4 space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                              {language === 'nl' ? 'Uitgelichte diensten' : 'Featured Services'}
                            </h3>
                            {navigation.services.featured.map((service) => (
                              <Link
                                key={service.href}
                                href={service.href}
                                className="group block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-10 h-10 bg-workflo-yellow/10 rounded-lg flex items-center justify-center group-hover:bg-workflo-yellow/20 transition-colors">
                                    <service.icon className="w-5 h-5 text-workflo-yellow-dark" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-sm font-semibold text-foreground">
                                        {service.title}
                                      </h4>
                                      {service.badge && (
                                        <span className="px-2 py-0.5 text-xs font-medium bg-workflo-yellow/20 text-workflo-yellow-dark rounded-full">
                                          {service.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                      {service.description}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>

                          {/* Service Categories */}
                          <div className="col-span-6 grid grid-cols-2 gap-4">
                            {navigation.services.categories.map((category) => (
                              <div key={category.title} className="space-y-2">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                  {category.title}
                                </h3>
                                <div className="space-y-1">
                                  {category.items.map((item) => (
                                    <Link
                                      key={item.href}
                                      href={item.href}
                                      className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-md transition-colors"
                                    >
                                      <item.icon className="w-4 h-4" />
                                      {item.title}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Call to Actions */}
                          <div className="col-span-2 space-y-2">
                            <Button
                              asChild
                              className="w-full justify-center bg-workflo-yellow hover:bg-workflo-yellow-dark text-black font-semibold"
                            >
                              <Link href={navigation.services.cta.primary.href}>
                                <navigation.services.cta.primary.icon className="w-4 h-4 mr-2" />
                                {navigation.services.cta.primary.text}
                              </Link>
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              className="w-full justify-center"
                            >
                              <Link href={navigation.services.cta.secondary.href}>
                                {navigation.services.cta.secondary.text}
                                <navigation.services.cta.secondary.icon className="w-4 h-4 ml-2" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Other Menu Items */}
                {[navigation.sectors, navigation.about, navigation.support].map((menu) => (
                  <div key={menu.title} className="relative">
                    <button
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        activeDropdown === menu.title 
                          ? "bg-workflo-yellow/10 text-workflo-yellow-dark"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                      onClick={() => setActiveDropdown(activeDropdown === menu.title ? null : menu.title)}
                      onMouseEnter={() => setActiveDropdown(menu.title)}
                    >
                      {menu.title}
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        activeDropdown === menu.title && "rotate-180"
                      )} />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === menu.title && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-full mt-2 w-72 bg-background border border-border rounded-xl shadow-2xl p-2"
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          {menu.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center justify-between px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <item.icon className="w-4 h-4" />
                                <div>
                                  <div className="font-medium">{item.title}</div>
                                  {(item as any).description && (
                                    <div className="text-xs text-muted-foreground">{(item as any).description}</div>
                                  )}
                                </div>
                              </div>
                              {(item as any).badge && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-workflo-yellow/20 text-workflo-yellow-dark rounded-full">
                                  {(item as any).badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative" ref={searchRef}>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (searchQuery.trim()) {
                      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
                      setIsSearchFocused(false)
                      setSearchQuery('')
                    }
                  }}
                  className="relative"
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder={language === 'nl' ? 'Zoeken...' : 'Search...'}
                    className="w-64 pl-9 pr-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-workflo-yellow/50 focus:border-transparent transition-all duration-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                  />
                </form>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {isSearchFocused && searchQuery && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 w-full bg-background border border-border rounded-xl shadow-2xl p-2"
                    >
                      <div className="py-2 px-3 text-xs text-muted-foreground uppercase tracking-wider">
                        {language === 'nl' ? 'Zoekresultaten' : 'Search Results'}
                      </div>
                      <div className="space-y-1">
                        <Link
                          href={`/search?q=${encodeURIComponent(searchQuery)}`}
                          className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                          onClick={() => {
                            setIsSearchFocused(false)
                            setSearchQuery('')
                          }}
                        >
                          {language === 'nl' ? 'Bekijk alle resultaten voor' : 'View all results for'} "{searchQuery}"
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3">
                <Button asChild className="bg-workflo-yellow hover:bg-workflo-yellow-dark text-black" size="sm">
                  <Link href="/downloads">
                    <Download className="w-4 h-4 mr-2" />
                    {language === 'nl' ? 'Support Tool' : 'Support Tool'}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/afspraak">
                    <Calendar className="w-4 h-4 mr-2" />
                    {language === 'nl' ? 'Afspraak' : 'Schedule'}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
              <button
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-background border-l border-border shadow-2xl overflow-y-auto"
            >
              <div className="p-4">
                {/* Mobile Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="text-2xl font-bold bg-gradient-to-r from-workflo-yellow via-workflo-yellow-dark to-primary bg-clip-text text-transparent">
                    Workflo
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Search */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault()
                    const input = e.currentTarget.querySelector('input')
                    const query = input?.value.trim()
                    if (query) {
                      router.push(`/search?q=${encodeURIComponent(query)}`)
                      setMobileMenuOpen(false)
                    }
                  }}
                  className="relative mb-6"
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder={language === 'nl' ? 'Zoeken...' : 'Search...'}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-workflo-yellow/50 focus:border-transparent"
                  />
                </form>

                {/* Mobile Navigation */}
                <div className="space-y-4">
                  {/* Services */}
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {navigation.services.title}
                    </h3>
                    <div className="space-y-2">
                      {navigation.services.featured.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          <service.icon className="w-4 h-4" />
                          {service.title}
                          {service.badge && (
                            <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-workflo-yellow/20 text-workflo-yellow-dark rounded-full">
                              {service.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                      <Link
                        href="/diensten"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-workflo-yellow-dark hover:bg-muted/50 rounded-lg transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                        {language === 'nl' ? 'Alle diensten' : 'All services'}
                      </Link>
                    </div>
                  </div>

                  {/* Other Sections */}
                  {[navigation.sectors, navigation.about, navigation.support].map((menu) => (
                    <div key={menu.title}>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        {menu.title}
                      </h3>
                      <div className="space-y-1">
                        {menu.items.slice(0, 3).map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                          >
                            <item.icon className="w-4 h-4" />
                            {item.title}
                            {(item as any).badge && (
                              <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-workflo-yellow/20 text-workflo-yellow-dark rounded-full">
                                {(item as any).badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Mobile CTAs */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <Button asChild className="w-full justify-center bg-workflo-yellow hover:bg-workflo-yellow-dark text-black">
                      <Link href="/downloads">
                        <Download className="w-4 h-4 mr-2" />
                        {language === 'nl' ? 'Download Support Tool' : 'Download Support Tool'}
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-center">
                      <Link href="/afspraak">
                        <Calendar className="w-4 h-4 mr-2" />
                        {language === 'nl' ? 'Afspraak maken' : 'Schedule'}
                      </Link>
                    </Button>
                  </div>

                  {/* Account/Login Section */}
                  <div className="pt-4 border-t border-border space-y-3">
                    {authLoading ? (
                      <div className="px-3 py-2 text-center text-muted-foreground">
                        <UserCircle className="w-5 h-5 mx-auto mb-2" />
                        <span className="text-sm">Loading...</span>
                      </div>
                    ) : isAuthenticated && currentUser ? (
                      <>
                        <div className="px-3 py-2 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <UserCircle className="w-5 h-5 text-primary" />
                              <div>
                                <p className="text-sm font-medium">{currentUser.username}</p>
                                <p className="text-xs text-muted-foreground">
                                  {currentUser.role === 'admin' ? 'Administrator' : currentUser.role}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Link 
                          href="/cms"
                          className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          <Monitor className="w-4 h-4" />
                          CMS Dashboard
                        </Link>
                        <Link 
                          href="/cms/security"
                          className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          Security
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          {language === 'nl' ? 'Uitloggen' : 'Log out'}
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-workflo-yellow hover:bg-workflo-yellow-dark text-black font-medium rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4" />
                        {language === 'nl' ? 'Inloggen' : 'Login'}
                      </Link>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                    <a 
                      href="tel:+31203080465" 
                      className="flex items-center gap-2"
                      suppressHydrationWarning
                    >
                      <Phone className="w-4 h-4" />
                      020-30 80 465
                    </a>
                    <a 
                      href="mailto:info@workflo.it" 
                      className="flex items-center gap-2"
                      suppressHydrationWarning
                    >
                      <Mail className="w-4 h-4" />
                      info@workflo.it
                    </a>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Amsterdam
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}