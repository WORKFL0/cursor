'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Phone, Menu, X, ChevronDown, SlidersHorizontal,
  Sun, Moon, Monitor, Globe, ExternalLink, Download
} from 'lucide-react'
import { useLanguage } from '@/lib/contexts/language-context'
import { useTheme } from 'next-themes'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const navigation = {
    diensten: [
      { label: 'Managed IT', href: '/diensten/managed-it' },
      { label: 'Cloud', href: '/diensten/cloud' },
      { label: 'Cybersecurity', href: '/diensten/cybersecurity' },
      { label: 'IT-helpdesk', href: '/diensten/it-helpdesk' },
      { label: 'Backup & herstel', href: '/diensten/backup-herstel' },
      { label: 'Netwerkbeveiliging', href: '/diensten/netwerkbeveiliging' }
    ],
    sectoren: [
      { label: 'Gezondheidszorg', href: '/sectoren/gezondheidszorg' },
      { label: 'Financiële dienstverlening', href: '/sectoren/financiele-dienstverlening' },
      { label: 'Retail & E-commerce', href: '/sectoren/retail-ecommerce' },
      { label: 'Alle sectoren bekijken →', href: '/sectoren' }
    ],
    overOns: [
      { label: 'Over Workflo', href: '/over-ons' },
      { label: 'Cases', href: '/case-studies' },
      { label: 'Werken bij', href: '/werken-bij' },
      { label: 'Referral', href: '/referral' }
    ],
    contact: [
      { label: 'Contact formulier', href: '/contact' },
      { label: 'Servicedesk', href: 'https://workflo.halo.gowired.services/client', external: true },
      { label: 'Download TeamViewer', href: 'https://get.teamviewer.com/workflo-support', external: true }
    ]
  }

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className="mx-auto px-6 md:px-10 lg:px-20">
        <div className="flex items-center justify-between h-[72px]">

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
          <nav className="hidden lg:flex items-center gap-12" aria-label="Main navigation">

            {/* Diensten Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 text-[15px] font-semibold tracking-tight text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-all duration-150 ease-out"
                aria-expanded="false"
                aria-haspopup="true"
              >
                {language === 'nl' ? 'Diensten' : 'Services'}
                <ChevronDown className="h-4 w-4" />
              </button>

              <div className="absolute left-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-out pointer-events-none group-hover:pointer-events-auto">
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200/40 dark:border-neutral-800 p-6">
                  {navigation.diensten.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 px-4 py-3 text-base text-neutral-700 hover:bg-accent hover:text-accent-foreground dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 rounded-lg transition-all duration-150 ease-out mb-1 last:mb-0"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sectoren Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 text-[15px] font-semibold tracking-tight text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-all duration-150 ease-out"
                aria-expanded="false"
                aria-haspopup="true"
              >
                {language === 'nl' ? 'Sectoren' : 'Sectors'}
                <ChevronDown className="h-4 w-4" />
              </button>

              <div className="absolute left-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-out pointer-events-none group-hover:pointer-events-auto">
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200/40 dark:border-neutral-800 p-6">
                  {navigation.sectoren.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 px-4 py-3 text-base text-neutral-700 hover:bg-accent hover:text-accent-foreground dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 rounded-lg transition-all duration-150 ease-out mb-1 last:mb-0"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Over ons Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 text-[15px] font-semibold tracking-tight text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-all duration-150 ease-out"
                aria-expanded="false"
                aria-haspopup="true"
              >
                {language === 'nl' ? 'Over ons' : 'About us'}
                <ChevronDown className="h-4 w-4" />
              </button>

              <div className="absolute left-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-out pointer-events-none group-hover:pointer-events-auto">
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200/40 dark:border-neutral-800 p-6">
                  {navigation.overOns.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 px-4 py-3 text-base text-neutral-700 hover:bg-accent hover:text-accent-foreground dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 rounded-lg transition-all duration-150 ease-out mb-1 last:mb-0"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 text-[15px] font-semibold tracking-tight text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-all duration-150 ease-out"
                aria-expanded="false"
                aria-haspopup="true"
              >
                Contact
                <ChevronDown className="h-4 w-4" />
              </button>

              <div className="absolute left-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-out pointer-events-none group-hover:pointer-events-auto">
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200/40 dark:border-neutral-800 p-6">
                  {navigation.contact.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-2 px-4 py-3 text-base text-neutral-700 hover:bg-accent hover:text-accent-foreground dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 rounded-lg transition-all duration-150 ease-out mb-1 last:mb-0"
                    >
                      {item.external && item.label.includes('TeamViewer') && (
                        <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      {item.external && !item.label.includes('TeamViewer') && (
                        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* CTA + Phone + Settings */}
          <div className="hidden lg:flex items-center gap-6 ml-10">
            <a
              href="tel:+31203080465"
              className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-all duration-150 ease-out"
            >
              <Phone className="h-4 w-4" />
              020-30 80 465
            </a>
            <Link
              href="/contact"
              className="px-8 py-4 bg-workflo-yellow text-neutral-900 font-semibold tracking-tight text-[15px] rounded-lg hover:bg-workflo-yellow-dark transition-all duration-150 ease-out hover:shadow-lg hover:scale-105"
            >
              Gratis Consult
            </Link>

            {/* Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-150"
                aria-label="Settings"
                aria-expanded={settingsOpen}
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>

              {settingsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setSettingsOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200/40 dark:border-neutral-800 p-4 z-50">
                    <div className="mb-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">⚙️ Instellingen</p>

                      {/* Theme Settings */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">Thema</p>
                        <div className="space-y-1">
                          {themeOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setTheme(option.value)
                                setSettingsOpen(false)
                              }}
                              className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-all duration-150 ${
                                theme === option.value
                                  ? 'bg-accent text-accent-foreground'
                                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-accent/50'
                              }`}
                            >
                              <option.icon className="h-4 w-4 shrink-0" />
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Language Settings */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">Taal</p>
                        <button
                          onClick={() => setSettingsOpen(false)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-accent-foreground rounded-lg transition-all duration-150"
                        >
                          <Globe className="h-4 w-4 shrink-0" />
                          Nederlands
                        </button>
                      </div>
                    </div>

                    {/* Tools */}
                    <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">💻 Tools</p>
                      <div className="space-y-1">
                        <a
                          href="https://workflo.halo.gowired.services/client"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-accent-foreground rounded-lg transition-all duration-150"
                          onClick={() => setSettingsOpen(false)}
                        >
                          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                          Servicedesk
                        </a>
                        <a
                          href="https://get.teamviewer.com/workflo-support"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-accent-foreground rounded-lg transition-all duration-150"
                          onClick={() => setSettingsOpen(false)}
                        >
                          <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                          Download TeamViewer
                        </a>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-neutral-900 shadow-2xl overflow-y-auto z-50">
          <div className="p-6">

            {/* Mobile CTA */}
            <Link
              href="/contact"
              className="block w-full mb-6 px-6 py-3 bg-workflo-yellow text-neutral-900 font-semibold rounded-lg hover:bg-workflo-yellow-dark transition-all duration-200 text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Gratis Consult
            </Link>

            <a
              href="tel:+31203080465"
              className="flex items-center justify-center gap-2 w-full mb-8 px-6 py-3 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Phone className="h-5 w-5" />
              020-30 80 465
            </a>

            {/* Mobile Accordions */}
            <div className="space-y-4">

              {/* Diensten Accordion */}
              <div>
                <button
                  onClick={() => setMobileAccordion(mobileAccordion === 'diensten' ? null : 'diensten')}
                  className="flex items-center justify-between w-full text-left px-4 py-3 text-neutral-900 dark:text-neutral-100 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  aria-expanded={mobileAccordion === 'diensten'}
                >
                  Diensten
                  <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${mobileAccordion === 'diensten' ? 'rotate-180' : ''}`} />
                </button>
                {mobileAccordion === 'diensten' && (
                  <div className="mt-2 pl-4 space-y-1">
                    {navigation.diensten.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-accent rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Sectoren Accordion */}
              <div>
                <button
                  onClick={() => setMobileAccordion(mobileAccordion === 'sectoren' ? null : 'sectoren')}
                  className="flex items-center justify-between w-full text-left px-4 py-3 text-neutral-900 dark:text-neutral-100 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  aria-expanded={mobileAccordion === 'sectoren'}
                >
                  Sectoren
                  <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${mobileAccordion === 'sectoren' ? 'rotate-180' : ''}`} />
                </button>
                {mobileAccordion === 'sectoren' && (
                  <div className="mt-2 pl-4 space-y-1">
                    {navigation.sectoren.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-accent rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Over ons Accordion */}
              <div>
                <button
                  onClick={() => setMobileAccordion(mobileAccordion === 'over-ons' ? null : 'over-ons')}
                  className="flex items-center justify-between w-full text-left px-4 py-3 text-neutral-900 dark:text-neutral-100 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  aria-expanded={mobileAccordion === 'over-ons'}
                >
                  Over ons
                  <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${mobileAccordion === 'over-ons' ? 'rotate-180' : ''}`} />
                </button>
                {mobileAccordion === 'over-ons' && (
                  <div className="mt-2 pl-4 space-y-1">
                    {navigation.overOns.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-accent rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Accordion */}
              <div>
                <button
                  onClick={() => setMobileAccordion(mobileAccordion === 'contact' ? null : 'contact')}
                  className="flex items-center justify-between w-full text-left px-4 py-3 text-neutral-900 dark:text-neutral-100 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  aria-expanded={mobileAccordion === 'contact'}
                >
                  Contact
                  <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${mobileAccordion === 'contact' ? 'rotate-180' : ''}`} />
                </button>
                {mobileAccordion === 'contact' && (
                  <div className="mt-2 pl-4 space-y-1">
                    {navigation.contact.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-accent rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.external && item.label.includes('TeamViewer') && (
                          <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        {item.external && !item.label.includes('TeamViewer') && (
                          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Settings Accordion (Mobile) */}
              <div>
                <button
                  onClick={() => setMobileAccordion(mobileAccordion === 'settings' ? null : 'settings')}
                  className="flex items-center justify-between w-full text-left px-4 py-3 text-neutral-900 dark:text-neutral-100 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  aria-expanded={mobileAccordion === 'settings'}
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    Instellingen
                  </span>
                  <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${mobileAccordion === 'settings' ? 'rotate-180' : ''}`} />
                </button>
                {mobileAccordion === 'settings' && (
                  <div className="mt-2 pl-4 space-y-3">
                    {/* Theme */}
                    <div>
                      <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Thema</p>
                      <div className="space-y-1">
                        {themeOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setTheme(option.value)}
                            className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm rounded-lg transition-colors ${
                              theme === option.value
                                ? 'bg-accent text-accent-foreground'
                                : 'text-neutral-600 dark:text-neutral-400 hover:bg-accent'
                            }`}
                          >
                            <option.icon className="h-4 w-4 shrink-0" />
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Language */}
                    <div>
                      <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Taal</p>
                      <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-accent rounded-lg transition-colors">
                        <Globe className="h-4 w-4 shrink-0" />
                        Nederlands
                      </button>
                    </div>

                    {/* Tools */}
                    <div>
                      <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tools</p>
                      <div className="space-y-1">
                        <a
                          href="https://workflo.halo.gowired.services/client"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-accent rounded-lg transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                          Servicedesk
                        </a>
                        <a
                          href="https://get.teamviewer.com/workflo-support"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-accent rounded-lg transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                          Download TeamViewer
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
