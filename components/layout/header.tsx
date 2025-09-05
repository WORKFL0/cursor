'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, X, Phone, HeadphonesIcon, ChevronRight, Globe, Monitor, Shield, Cloud, Settings2, Mail, MapPin, ChevronDown, Calendar, Building2, Heart, Megaphone, User, Camera, ShoppingCart, Building, HardDrive } from 'lucide-react'
import { useLanguage, useLocalizedContent } from '@/lib/contexts/language-context'
import { navigation, serviceNavigationCategories, sectors } from '@/lib/data/workflo-data'
import LanguageSwitcher from '@/components/shared/language-switcher'
import { ThemeToggle } from '@/components/shared/theme-toggle'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language } = useLanguage()
  const { getLocalizedValue } = useLocalizedContent()
  const pathname = usePathname()

  const getNavTitle = (item: typeof navigation[0]) => {
    return getLocalizedValue(item as any, 'title')
  }

  const isActivePage = (href: string) => {
    if (href === '/' && pathname === '/') return true
    if (href !== '/' && pathname?.startsWith(href)) return true
    return false
  }

  // Icon mapping for services and sectors
  const iconMap = {
    Monitor: Monitor,
    Shield: Shield,
    Phone: Phone,
    HardDriveIcon: HardDrive,
    Building2: Building2,
    Heart: Heart,
    Megaphone: Megaphone,
    User: User,
    Camera: Camera,
    ShoppingCart: ShoppingCart,
    Building: Building,
    Cloud: Cloud
  }

  return (
    <header className="bg-background/95 backdrop-blur-md sticky top-0 z-50 border-b border-workflo-yellow/20 shadow-lg shadow-workflo-yellow/5 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Clickable Home Link */}
          <Link 
            href="/" 
            className="flex items-center group transition-transform duration-200 hover:scale-105"
            aria-label="Workflo Home"
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
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            <NavigationMenu>
              <NavigationMenuList>
                {navigation.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    {item.children ? (
                      <>
                        <NavigationMenuTrigger 
                          className={`h-10 px-4 text-sm font-medium transition-all duration-300 hover:scale-[1.02] focus:scale-[1.02] ${
                            isActivePage(item.href) 
                              ? 'text-primary bg-primary/5 border-b-2 border-primary rounded-b-none' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }`}
                          aria-label={`${getNavTitle(item)} menu`}>
                          {getNavTitle(item)}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          {/* Services Mega Menu */}
                          {item.href === '/diensten' ? (
                            <div className="w-[900px] p-6">
                              <div className="grid grid-cols-4 gap-6">
                                {Object.entries(serviceNavigationCategories).map(([key, category]) => {
                                  const IconComponent = iconMap[category.icon as keyof typeof iconMap]
                                  return (
                                    <div key={key} className="space-y-3">
                                      <div className="flex items-center space-x-2 mb-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-md bg-workflo-yellow/20 flex items-center justify-center">
                                          {IconComponent && <IconComponent className="w-4 h-4 text-workflo-yellow-dark" />}
                                        </div>
                                        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                                          {language === 'nl' ? category.titleNL : category.title}
                                        </h4>
                                      </div>
                                      <div className="space-y-1">
                                        {category.services.map((service) => (
                                          <Link
                                            key={service.href}
                                            href={service.href}
                                            className="group block p-2 rounded-md hover:bg-muted/50 hover:scale-[1.01] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            aria-describedby={`service-${service.href.replace(/\//g, '-')}-desc`}
                                          >
                                            <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                              {language === 'nl' ? service.titleNL : service.title}
                                            </div>
                                            <div 
                                              className="text-xs text-muted-foreground mt-1 line-clamp-2"
                                              id={`service-${service.href.replace(/\//g, '-')}-desc`}
                                            >
                                              {language === 'nl' ? service.descriptionNL : service.description}
                                            </div>
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                              <div className="border-t border-border mt-6 pt-4 flex justify-between items-center">
                                <Link href="/diensten" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                  {language === 'nl' ? 'Alle diensten bekijken' : 'View all services'}
                                  <ChevronRight className="ml-1 w-4 h-4" />
                                </Link>
                                <Link href="/prijzen" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                  {language === 'nl' ? 'Prijzen & Pakketten' : 'Pricing & Packages'}
                                  <ChevronRight className="ml-1 w-4 h-4" />
                                </Link>
                              </div>
                            </div>
                          ) : item.href === '/sectoren' ? (
                            <div className="w-[700px] p-6">
                              <div className="grid grid-cols-3 gap-4">
                                {sectors.map((sector) => {
                                  const IconComponent = iconMap[sector.icon as keyof typeof iconMap]
                                  return (
                                    <Link
                                      key={sector.href}
                                      href={sector.href}
                                      className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 hover:scale-[1.01] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                      aria-label={`IT solutions for ${language === 'nl' ? sector.titleNL : sector.title}`}
                                    >
                                      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-workflo-yellow/20 flex items-center justify-center group-hover:bg-workflo-yellow/30 transition-colors">
                                        {IconComponent && <IconComponent className="w-4 h-4 text-workflo-yellow-dark" />}
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                          {language === 'nl' ? sector.titleNL : sector.title}
                                        </div>
                                      </div>
                                    </Link>
                                  )
                                })}
                              </div>
                              <div className="border-t border-border mt-6 pt-4">
                                <Link href="/sectoren" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                  {language === 'nl' ? 'Alle sectoren bekijken' : 'View all sectors'}
                                  <ChevronRight className="ml-1 w-4 h-4" />
                                </Link>
                              </div>
                            </div>
                          ) : (
                            <ul className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
                              {item.children?.map((child) => (
                                <li key={child.href}>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      href={child.href}
                                      className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-muted/50 hover:text-primary focus:bg-muted/50 focus:text-primary"
                                    >
                                      <div className="text-sm font-medium leading-none">
                                        {getLocalizedValue(child as any, 'title')}
                                      </div>
                                      {child.description && (
                                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                                          {getLocalizedValue(child as any, 'description')}
                                        </p>
                                      )}
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          )}
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`h-10 px-4 inline-flex items-center text-sm font-medium transition-all duration-200 rounded-md ${
                          isActivePage(item.href) 
                            ? 'text-primary bg-primary/10 font-semibold' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {getNavTitle(item)}
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Servicedesk Quick Link */}
            <Button 
              asChild
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <a 
                href="https://servicedesk.workflo.it/portal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <HeadphonesIcon className="h-4 w-4" />
                <span>Servicedesk</span>
              </a>
            </Button>

            {/* Settings - Compact */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                  <Settings2 className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-3 py-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                    <Globe className="h-4 w-4" />
                    <span>Language</span>
                  </div>
                  <LanguageSwitcher />
                </div>
                <div className="border-t px-3 py-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                    <Settings2 className="h-4 w-4" />
                    <span>Theme</span>
                  </div>
                  <ThemeToggle />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Phone Number with Dropdown - Primary CTA */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-workflo-yellow to-workflo-yellow-dark hover:from-workflo-yellow-dark hover:to-workflo-yellow text-workflo-black font-semibold shadow-lg shadow-workflo-yellow/30 hover:shadow-xl hover:shadow-workflo-yellow/40 transition-all group"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  <span>020-30 80 465</span>
                  <ChevronDown className="h-4 w-4 ml-1 group-data-[state=open]:rotate-180 transition-transform" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild className="cursor-pointer py-3">
                  <a href="tel:+31203080465" className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-medium">{language === 'nl' ? 'Bel Direct' : 'Call Now'}</span>
                      <span className="text-xs text-muted-foreground">020-30 80 465</span>
                    </div>
                  </a>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild className="cursor-pointer py-3">
                  <Link href="/contact" className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-medium">{language === 'nl' ? 'Contact Pagina' : 'Contact Page'}</span>
                      <span className="text-xs text-muted-foreground">{language === 'nl' ? 'Alle contactopties' : 'All contact options'}</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild className="cursor-pointer py-3">
                  <a href="mailto:info@workflo.it" className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-medium">Email</span>
                      <span className="text-xs text-muted-foreground">info@workflo.it</span>
                    </div>
                  </a>
                </DropdownMenuItem>
                
                <div className="border-t my-1" />
                
                <DropdownMenuItem asChild className="cursor-pointer py-3">
                  <Link href="/afspraak" className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-medium">{language === 'nl' ? 'Plan Afspraak' : 'Schedule Meeting'}</span>
                      <span className="text-xs text-muted-foreground">{language === 'nl' ? 'Gratis adviesgesprek' : 'Free consultation'}</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <a
              href="tel:+31203080465"
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-5 w-5" />
            </a>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="h-10 w-10 p-0"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu Panel */}
            <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background z-50 lg:hidden shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-border">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-workflo-yellow/30 bg-gradient-to-r from-workflo-yellow-light/20 to-workflo-yellow-light/10">
                  <div className="text-lg font-bold bg-gradient-to-r from-workflo-yellow-dark to-primary bg-clip-text text-transparent">Workflo</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {navigation.map((item) => (
                      <div key={item.href} className="space-y-1">
                        {item.children ? (
                          <>
                            <Link
                              href={item.href}
                              className={`flex items-center justify-between px-3 py-3 text-sm font-semibold rounded-lg transition-colors ${
                                isActivePage(item.href) 
                                  ? 'text-primary bg-primary/10' 
                                  : 'text-foreground hover:text-primary hover:bg-muted/50'
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span>{getNavTitle(item)}</span>
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                            
                            {/* Services submenu with categories */}
                            {item.href === '/diensten' && (
                              <div className="ml-4 space-y-3 pb-2">
                                {Object.entries(serviceNavigationCategories).map(([key, category]) => {
                                  const IconComponent = iconMap[category.icon as keyof typeof iconMap]
                                  return (
                                    <div key={key} className="space-y-1">
                                      <div className="flex items-center space-x-2 px-2 py-1">
                                        <div className="flex-shrink-0 w-5 h-5 rounded bg-workflo-yellow/20 flex items-center justify-center">
                                          {IconComponent && <IconComponent className="w-4 h-4 text-workflo-yellow-dark" />}
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                          {language === 'nl' ? category.titleNL : category.title}
                                        </span>
                                      </div>
                                      {category.services.map((service) => (
                                        <Link
                                          key={service.href}
                                          href={service.href}
                                          className={`block px-3 py-2 ml-2 text-sm rounded-lg transition-colors ${
                                            isActivePage(service.href)
                                              ? 'text-primary bg-primary/10 font-medium'
                                              : 'text-foreground hover:text-primary hover:bg-muted/50'
                                          }`}
                                          onClick={() => setMobileMenuOpen(false)}
                                        >
                                          {language === 'nl' ? service.titleNL : service.title}
                                        </Link>
                                      ))}
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                            
                            {/* Sectors submenu */}
                            {item.href === '/sectoren' && (
                              <div className="ml-4 space-y-1 pb-2">
                                {sectors.map((sector) => {
                                  const IconComponent = iconMap[sector.icon as keyof typeof iconMap]
                                  return (
                                    <Link
                                      key={sector.href}
                                      href={sector.href}
                                      className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                                        isActivePage(sector.href)
                                          ? 'text-primary bg-primary/10 font-medium'
                                          : 'text-foreground hover:text-primary hover:bg-muted/50'
                                      }`}
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      <div className="flex-shrink-0 w-4 h-4 rounded bg-workflo-yellow/20 flex items-center justify-center">
                                        {IconComponent && <IconComponent className="w-4 h-4 text-workflo-yellow-dark" />}
                                      </div>
                                      <span>{language === 'nl' ? sector.titleNL : sector.title}</span>
                                    </Link>
                                  )
                                })}
                              </div>
                            )}
                            
                            {/* Other children (e.g., About Us) */}
                            {item.href !== '/diensten' && item.href !== '/sectoren' && (
                              <div className="ml-4 space-y-1 pb-2">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                                      isActivePage(child.href)
                                        ? 'text-primary bg-primary/10 font-medium'
                                        : 'text-foreground hover:text-primary hover:bg-muted/50'
                                    }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {getLocalizedValue(child as any, 'title')}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <Link
                            href={item.href}
                            className={`block px-3 py-3 text-sm font-semibold rounded-lg transition-colors ${
                              isActivePage(item.href)
                                ? 'text-primary bg-primary/10'
                                : 'text-foreground hover:text-primary hover:bg-muted/50'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {getNavTitle(item)}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </nav>
                
                {/* Quick Actions */}
                <div className="p-4 border-t border-workflo-yellow/30 bg-gradient-to-r from-workflo-yellow-light/20 to-workflo-yellow-light/10 space-y-3">
                  <Button 
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <a 
                      href="https://servicedesk.workflo.it/portal"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2"
                    >
                      <HeadphonesIcon className="h-4 w-4" />
                      <span>Servicedesk</span>
                    </a>
                  </Button>
                  
                  <Button 
                    asChild
                    className="w-full"
                  >
                    <Link 
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {language === 'nl' ? 'Contact' : 'Get Started'}
                    </Link>
                  </Button>
                  
                  {/* Settings */}
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <LanguageSwitcher />
                        <ThemeToggle />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}