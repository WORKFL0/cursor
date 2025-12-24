'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Phone, Menu, X, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/language-context'

export function HeaderNew() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null)
  const { language } = useLanguage()
  const pathname = usePathname()

  const diensten = [
    { label: 'Managed IT', href: '/diensten/managed-it' },
    { label: 'Cloud', href: '/diensten/cloud' },
    { label: 'Cybersecurity', href: '/diensten/cybersecurity' },
    { label: 'IT-helpdesk', href: '/diensten/it-helpdesk' },
    { label: 'Backup & herstel', href: '/diensten/backup-herstel' },
    { label: 'Netwerkbeveiliging', href: '/diensten/netwerkbeveiliging' }
  ]

  const sectoren = [
    { label: 'Gezondheidszorg', href: '/sectoren/gezondheidszorg' },
    { label: 'Financiële dienstverlening', href: '/sectoren/financiele-dienstverlening' },
    { label: 'Retail & E-commerce', href: '/sectoren/retail-ecommerce' },
    { label: 'Alle sectoren bekijken →', href: '/sectoren' }
  ]

  const overOns = [
    { label: 'Over Workflo', href: '/over-ons' },
    { label: 'Cases', href: '/case-studies' },
    { label: 'Werken bij', href: '/werken-bij' },
    { label: 'Referral', href: '/referral' }
  ]

  const contact = [
    { label: 'Contact formulier', href: '/contact' },
    { label: 'Servicedesk', href: 'https://servicedesk.workflo.it/portal/home', external: true },
    { label: 'Download TeamViewer', href: 'https://get.teamviewer.com/workflo', external: true }
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-workflo-gray-950/95 backdrop-blur-md border-b border-gray-200 dark:border-workflo-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity" aria-label="Workflo Home">
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
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">

            {/* Diensten Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setOpenDropdown('diensten')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center gap-1 text-base font-medium text-gray-700 hover:text-workflo-black dark:text-gray-300 dark:hover:text-white transition-colors">
                {language === 'nl' ? 'Diensten' : 'Services'}
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Dropdown Menu - Always in DOM, visibility controlled by opacity */}
              <div
                className={`absolute left-0 top-full pt-2 w-64 transition-all duration-200 ${
                  openDropdown === 'diensten'
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                }`}
                style={{ zIndex: 100 }}
              >
                <div className="bg-white dark:bg-workflo-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-workflo-gray-800 py-2">
                  {diensten.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-workflo-yellow/10 hover:text-workflo-black dark:text-gray-200 dark:hover:bg-workflo-yellow/10 dark:hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sectoren Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setOpenDropdown('sectoren')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center gap-1 text-base font-medium text-gray-700 hover:text-workflo-black dark:text-gray-300 dark:hover:text-white transition-colors">
                {language === 'nl' ? 'Sectoren' : 'Sectors'}
                <ChevronDown className="h-4 w-4" />
              </button>

              <div
                className={`absolute left-0 top-full pt-2 w-64 transition-all duration-200 ${
                  openDropdown === 'sectoren'
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                }`}
                style={{ zIndex: 100 }}
              >
                <div className="bg-white dark:bg-workflo-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-workflo-gray-800 py-2">
                  {sectoren.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-workflo-yellow/10 hover:text-workflo-black dark:text-gray-200 dark:hover:bg-workflo-yellow/10 dark:hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Over ons Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setOpenDropdown('over-ons')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center gap-1 text-base font-medium text-gray-700 hover:text-workflo-black dark:text-gray-300 dark:hover:text-white transition-colors">
                {language === 'nl' ? 'Over ons' : 'About us'}
                <ChevronDown className="h-4 w-4" />
              </button>

              <div
                className={`absolute left-0 top-full pt-2 w-64 transition-all duration-200 ${
                  openDropdown === 'over-ons'
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                }`}
                style={{ zIndex: 100 }}
              >
                <div className="bg-white dark:bg-workflo-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-workflo-gray-800 py-2">
                  {overOns.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-workflo-yellow/10 hover:text-workflo-black dark:text-gray-200 dark:hover:bg-workflo-yellow/10 dark:hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setOpenDropdown('contact')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center gap-1 text-base font-medium text-gray-700 hover:text-workflo-black dark:text-gray-300 dark:hover:text-white transition-colors">
                Contact
                <ChevronDown className="h-4 w-4" />
              </button>

              <div
                className={`absolute left-0 top-full pt-2 w-64 transition-all duration-200 ${
                  openDropdown === 'contact'
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                }`}
                style={{ zIndex: 100 }}
              >
                <div className="bg-white dark:bg-workflo-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-workflo-gray-800 py-2">
                  {contact.map((item) => (
                    item.external ? (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-workflo-yellow/10 hover:text-workflo-black dark:text-gray-200 dark:hover:bg-workflo-yellow/10 dark:hover:text-white transition-colors"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-workflo-yellow/10 hover:text-workflo-black dark:text-gray-200 dark:hover:bg-workflo-yellow/10 dark:hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    )
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Phone */}
            <a
              href="tel:+31203080465"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-workflo-black dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>020-30 80 465</span>
            </a>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="hidden lg:inline-flex items-center justify-center px-6 py-2.5 bg-workflo-yellow hover:bg-workflo-yellow-dark text-workflo-black font-semibold rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              {language === 'nl' ? 'Plan gratis IT-scan' : 'Schedule free IT assessment'}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-workflo-black dark:text-gray-300 dark:hover:text-white transition-colors"
              aria-label={mobileMenuOpen ? 'Sluit menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-workflo-gray-950 z-50 lg:hidden shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-workflo-gray-800">
                <span className="text-lg font-bold text-workflo-black dark:text-white">Workflo</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {/* Mobile Diensten */}
                  <div>
                    <button
                      onClick={() => setMobileOpenDropdown(mobileOpenDropdown === 'diensten' ? null : 'diensten')}
                      className="w-full flex items-center justify-between text-base font-medium py-2"
                    >
                      {language === 'nl' ? 'Diensten' : 'Services'}
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileOpenDropdown === 'diensten' ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileOpenDropdown === 'diensten' && (
                      <div className="pl-4 flex flex-col gap-1 mt-1">
                        {diensten.map((item) => (
                          <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5">
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile Sectoren */}
                  <div>
                    <button
                      onClick={() => setMobileOpenDropdown(mobileOpenDropdown === 'sectoren' ? null : 'sectoren')}
                      className="w-full flex items-center justify-between text-base font-medium py-2"
                    >
                      {language === 'nl' ? 'Sectoren' : 'Sectors'}
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileOpenDropdown === 'sectoren' ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileOpenDropdown === 'sectoren' && (
                      <div className="pl-4 flex flex-col gap-1 mt-1">
                        {sectoren.map((item) => (
                          <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5">
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile Over ons */}
                  <div>
                    <button
                      onClick={() => setMobileOpenDropdown(mobileOpenDropdown === 'over-ons' ? null : 'over-ons')}
                      className="w-full flex items-center justify-between text-base font-medium py-2"
                    >
                      {language === 'nl' ? 'Over ons' : 'About us'}
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileOpenDropdown === 'over-ons' ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileOpenDropdown === 'over-ons' && (
                      <div className="pl-4 flex flex-col gap-1 mt-1">
                        {overOns.map((item) => (
                          <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5">
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile Contact */}
                  <div>
                    <button
                      onClick={() => setMobileOpenDropdown(mobileOpenDropdown === 'contact' ? null : 'contact')}
                      className="w-full flex items-center justify-between text-base font-medium py-2"
                    >
                      Contact
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileOpenDropdown === 'contact' ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileOpenDropdown === 'contact' && (
                      <div className="pl-4 flex flex-col gap-1 mt-1">
                        {contact.map((item) => (
                          item.external ? (
                            <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5">
                              {item.label}
                            </a>
                          ) : (
                            <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="text-sm py-1.5">
                              {item.label}
                            </Link>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </nav>

              <div className="p-4 border-t border-gray-200 dark:border-workflo-gray-800 space-y-3">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center px-5 py-3 bg-workflo-yellow hover:bg-workflo-yellow-dark text-workflo-black font-semibold rounded-lg"
                >
                  {language === 'nl' ? 'Plan gratis IT-scan' : 'Schedule free IT assessment'}
                </Link>
                <a href="tel:+31203080465" className="w-full flex items-center justify-center gap-2 px-5 py-3 border rounded-lg">
                  <Phone className="h-4 w-4" />
                  <span>020-30 80 465</span>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
