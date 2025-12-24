'use client'

import { useState, useEffect } from 'react'
import { Phone } from 'lucide-react'

interface PhoneLinkProps {
  phoneNumber: string
  className?: string
  showIcon?: boolean
  iconClassName?: string
  label?: string
  sublabel?: string
}

export function PhoneLink({ 
  phoneNumber, 
  className = "flex items-center gap-3 hover:underline group",
  showIcon = true,
  iconClassName = "w-6 h-6 text-foreground",
  label,
  sublabel
}: PhoneLinkProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Clean phone number for href
  const cleanNumber = phoneNumber.replace(/\s/g, '')
  
  // Don't render the link until client-side to avoid hydration issues with browser extensions
  if (!mounted) {
    return (
      <div className={className}>
        {showIcon && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <Phone className={iconClassName} />
          </div>
        )}
        {(label || sublabel) && (
          <div>
            {sublabel && <div className="text-sm text-muted-foreground">{sublabel}</div>}
            {label && <div className="text-xl font-semibold text-foreground">{phoneNumber}</div>}
          </div>
        )}
      </div>
    )
  }

  return (
    <a 
      href={`tel:${cleanNumber}`}
      className={className}
      suppressHydrationWarning
    >
      {showIcon && (
        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
          <Phone className={iconClassName} />
        </div>
      )}
      {(label || sublabel) && (
        <div>
          {sublabel && <div className="text-sm text-muted-foreground">{sublabel}</div>}
          {label && <div className="text-xl font-semibold text-foreground">{phoneNumber}</div>}
        </div>
      )}
    </a>
  )
}