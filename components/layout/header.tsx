'use client'

import Link from 'next/link'
import { useState } from 'react'
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, X, Phone, Download, HeadphonesIcon, Settings, Globe, Palette } from 'lucide-react'
import { useLanguage, useLocalizedContent } from '@/lib/contexts/language-context'
import { navigation, serviceCategories } from '@/lib/data/workflo-data'
import LanguageSwitcher from '@/components/shared/language-switcher'
import { ThemeToggle } from '@/components/shared/theme-toggle'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language } = useLanguage()
  const { getLocalizedValue } = useLocalizedContent()

  const getNavTitle = (item: typeof navigation[0]) => {
    return getLocalizedValue(item, 'title')
  }

  return (
    <header className="bg-background/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Clickable Home Link */}
          <Link 
            href="/" 
            className="flex items-center group transition-all duration-200 hover:scale-105"
            aria-label="Workflo Home"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent group-hover:from-primary/80 group-hover:to-primary transition-all duration-300">
              Workflo
            </span>
            <span className="ml-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              ← Home
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {navigation.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    {item.children ? (
                      <>
                        <NavigationMenuTrigger className="text-foreground hover:text-primary font-medium transition-colors">
                          {getNavTitle(item)}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={child.href}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                                  >
                                    <div className="text-sm font-medium leading-none">
                                      {getLocalizedValue(child, 'title')}
                                    </div>
                                    {child.description && (
                                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                        {getLocalizedValue(child, 'description')}
                                      </p>
                                    )}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-foreground hover:text-primary font-medium transition-colors px-3 py-2"
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
          <div className="hidden md:flex items-center space-x-4">
            {/* Settings Dropdown for Theme & Language */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Instellingen</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Taal / Language</span>
                </DropdownMenuItem>
                <div className="px-2 py-1">
                  <LanguageSwitcher />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span>Thema / Theme</span>
                </DropdownMenuItem>
                <div className="px-2 py-1">
                  <ThemeToggle />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <a
              href="tel:+31203080465"
              className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="text-sm font-medium">020-30 80 465</span>
            </a>
            <Button 
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <a 
                href="https://servicedesk.workflo.it/portal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <HeadphonesIcon className="h-4 w-4" />
                <span>{language === 'nl' ? 'Servicedesk' : 'Servicedesk'}</span>
              </a>
            </Button>
            <Button 
              variant="default"
              className="relative bg-workflo-yellow hover:bg-workflo-yellow-dark text-background border-2 border-foreground font-bold shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => {
                window.open('https://get.teamviewer.com/workflo', '_blank')
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="uppercase tracking-wide">{language === 'nl' ? '⚠️ Support Tool' : '⚠️ Support Tool'}</span>
            </Button>
            <Button 
              asChild
              variant="workflo"
            >
              <Link href="/contact">
                {language === 'nl' ? 'Contact' : 'Get Started'}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1">
                  <LanguageSwitcher />
                </div>
                <DropdownMenuSeparator />
                <div className="px-2 py-1">
                  <ThemeToggle />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
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
              className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu Panel */}
            <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background/95 backdrop-blur-sm z-50 md:hidden shadow-xl transform transition-transform duration-300 ease-in-out">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <span className="text-lg font-semibold text-foreground">Menu</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                  {navigation.map((item) => (
                    <div key={item.href} className="space-y-3">
                      {item.children ? (
                        <>
                          <div className="text-sm font-semibold text-primary uppercase tracking-wider">
                            {getNavTitle(item)}
                          </div>
                          <div className="space-y-2 ml-2">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block text-foreground hover:text-primary transition-colors py-2 text-sm"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <div className="font-medium">{getLocalizedValue(child, 'title')}</div>
                                {child.description && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {getLocalizedValue(child, 'description')}
                                  </div>
                                )}
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className="block text-foreground hover:text-primary font-medium transition-colors py-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {getNavTitle(item)}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
                
                {/* Footer Actions */}
                <div className="p-4 border-t border-border space-y-3">
                  <a
                    href="tel:+31203080465"
                    className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors py-2"
                  >
                    <Phone className="h-5 w-5" />
                    <span className="font-medium">020-30 80 465</span>
                  </a>
                  
                  <Button 
                    asChild
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <a 
                      href="https://servicedesk.workflo.it/portal"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center space-x-2"
                    >
                      <HeadphonesIcon className="h-4 w-4" />
                      <span>{language === 'nl' ? 'Servicedesk' : 'Servicedesk'}</span>
                    </a>
                  </Button>
                  
                  <Button 
                    variant="default"
                    className="w-full bg-workflo-yellow hover:bg-workflo-yellow-dark text-background border-2 border-foreground font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      window.open('https://get.teamviewer.com/workflo', '_blank')
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    <span className="uppercase tracking-wide">{language === 'nl' ? '⚠️ Support Tool' : '⚠️ Support Tool'}</span>
                  </Button>
                  
                  <Button 
                    asChild
                    className="w-full"
                    variant="workflo"
                  >
                    <Link 
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {language === 'nl' ? 'Contact' : 'Get Started'}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}