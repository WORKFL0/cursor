'use client'

import { useLanguage } from '@/lib/contexts/language-context'
import { siteConfig } from '@/lib/data/workflo-data'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDownIcon, GlobeIcon } from 'lucide-react'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const currentLanguage = siteConfig.languages.find(lang => lang.code === language)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 px-2">
          <GlobeIcon className="h-4 w-4 mr-1" />
          <span className="text-sm">{currentLanguage?.flag}</span>
          <span className="ml-1 text-sm font-medium">
            {currentLanguage?.code.toUpperCase()}
          </span>
          <ChevronDownIcon className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {siteConfig.languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-2 cursor-pointer ${
              language === lang.code ? 'bg-workflo-yellow/10' : ''
            }`}
          >
            <span className="text-sm">{lang.flag}</span>
            <span className="text-sm font-medium">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}