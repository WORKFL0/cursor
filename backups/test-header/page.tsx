'use client'

import { useState, useEffect } from 'react'

export default function TestHeaderPage() {
  const [headerInfo, setHeaderInfo] = useState<any>(null)

  useEffect(() => {
    // Check which header is being used
    const headerElement = document.querySelector('header')
    const navMenu = document.querySelector('nav')
    const navigationMenu = document.querySelector('[role="navigation"]')
    
    setHeaderInfo({
      hasHeader: !!headerElement,
      headerClasses: headerElement?.className || 'No header found',
      hasNav: !!navMenu,
      navClasses: navMenu?.className || 'No nav found',
      hasNavigationMenu: !!navigationMenu,
      menuItems: Array.from(document.querySelectorAll('nav a')).map(a => ({
        text: (a as HTMLAnchorElement).textContent,
        href: (a as HTMLAnchorElement).href
      })),
      environmentVar: process.env.NEXT_PUBLIC_USE_ENTERPRISE_HEADER || 'not set'
    })
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Header Debug Information</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Current Header Status:</h2>
        
        {headerInfo && (
          <div className="space-y-4">
            <div>
              <strong>Header Found:</strong> {headerInfo.hasHeader ? 'Yes ✅' : 'No ❌'}
            </div>
            
            <div>
              <strong>Header Classes:</strong>
              <pre className="mt-2 p-2 bg-white rounded text-xs overflow-x-auto">
                {headerInfo.headerClasses}
              </pre>
            </div>
            
            <div>
              <strong>Navigation Found:</strong> {headerInfo.hasNav ? 'Yes ✅' : 'No ❌'}
            </div>
            
            <div>
              <strong>Navigation Classes:</strong>
              <pre className="mt-2 p-2 bg-white rounded text-xs overflow-x-auto">
                {headerInfo.navClasses}
              </pre>
            </div>
            
            <div>
              <strong>NavigationMenu Component:</strong> {headerInfo.hasNavigationMenu ? 'Yes ✅' : 'No ❌'}
            </div>
            
            <div>
              <strong>Enterprise Header Env:</strong> {headerInfo.environmentVar}
            </div>
            
            <div>
              <strong>Menu Items Found ({headerInfo.menuItems.length}):</strong>
              <ul className="mt-2 space-y-1">
                {headerInfo.menuItems.map((item: any, index: number) => (
                  <li key={index} className="text-sm">
                    <span className="font-mono bg-white px-2 py-1 rounded">
                      {item.text} → {item.href}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Expected Menu Items:</h2>
        <ul className="space-y-1">
          <li>✓ Diensten (with dropdown)</li>
          <li>✓ Prijzen</li>
          <li>✓ Resources (with dropdown)</li>
          <li>✓ Contact</li>
        </ul>
      </div>
    </div>
  )
}