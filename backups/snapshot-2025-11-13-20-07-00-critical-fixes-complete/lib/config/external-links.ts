/**
 * External Links Configuration
 * Centralized management of all external URLs
 */

export const externalLinks = {
  // Microsoft Bookings
  bookings: {
    onboarding: 'https://outlook.office.com/bookwithme/user/e5c350794a6d4425a43dec2a2fc1025d@workflo.nl/meetingtype/Hh5kGaYXzUCM7e03CR3QJg2?anonymous&ismsaljsauthenabled&ep=mlink',
    engineer: 'https://outlook.office.com/book/PlaneenafspraakmetFlorian@workflo.nl/?ismsaljsauthenabled',
    kennismaking30min: 'https://outlook.office.com/bookwithme/user/e5c350794a6d4425a43dec2a2fc1025d@workflo.nl/meetingtype/dEJHq8umc0i58zEEF5uZTw2?anonymous&ismsaljsauthenabled&ep=mlink',
    kennismaking15min: 'https://outlook.office.com/bookwithme/user/e5c350794a6d4425a43dec2a2fc1025d@workflo.nl/meetingtype/Qq1ZEfPh0UOcTWbbCOF6zQ2?anonymous&ismsaljsauthenabled&ep=mlink',
    stageGesprek: 'https://outlook.office.com/bookwithme/user/e5c350794a6d4425a43dec2a2fc1025d@workflo.nl/meetingtype/13ZKCQSKhU6YECounKZMmQ2?anonymous&ismsaljsauthenabled&ep=mlink',
  },
  
  // Forms
  forms: {
    onboardingForm: 'https://forms.office.com/e/VTeqZDGwXZ',
    newsletter: {
      portalId: "26510736",
      formId: "e92de02c-71b0-4a68-aedd-3b6acb0f5f67",
      region: "eu1"
    },
    contact: {
      portalId: "26510736",
      formId: "acfec8fa-c596-4fe0-aa14-ed4bf42b6f73",
      region: "eu1"
    }
  },
  
  // Service Desk
  serviceDesk: {
    portal: 'https://servicedesk.workflo.it/portal',
  },
  
  // Social Media
  social: {
    linkedin: 'https://www.linkedin.com/company/workflo/',
    facebook: 'https://www.facebook.com/workfloit',
    twitter: 'https://twitter.com/workfloit',
  },
  
  // RSS & Status Pages
  monitoring: {
    rssFeed: 'https://rss.workflo.it/i/?a=rss&user=workflo&token=&hours=168',
    uptime: 'https://uptime.workflo.it/status/workflo',
    itTools: 'https://it-tools.workflo.it/',
  },
  
  // Contact
  contact: {
    phone: '+31203080465',
    phoneDisplay: '020-30 80 465',
    email: 'info@workflo.it',
    address: {
      street: 'Koivistokade 3',
      postalCode: '1013 AC',
      city: 'Amsterdam',
      country: 'Nederland',
      googleMaps: 'https://maps.google.com/maps/dir/?api=1&destination=Koivistokade+3,1013+AC+Amsterdam,Netherlands',
    }
  },
  
  // Legal/Compliance
  legal: {
    privacy: '/privacy',
    terms: '/terms',
    cookies: '/cookies',
  }
}

// Helper function to create booking link with optional parameters
export function createBookingLink(params?: {
  type?: 'onboarding' | 'consultation' | 'support'
  duration?: number
  subject?: string
}) {
  // For now, return the onboarding link
  // Can be extended to handle different booking types
  return externalLinks.bookings.onboarding
}

// Helper function to create contact links
export function createContactLink(type: 'phone' | 'email' | 'whatsapp') {
  switch (type) {
    case 'phone':
      return `tel:${externalLinks.contact.phone}`
    case 'email':
      return `mailto:${externalLinks.contact.email}`
    case 'whatsapp':
      return `https://wa.me/${externalLinks.contact.phone.replace('+', '')}`
    default:
      return '#'
  }
}