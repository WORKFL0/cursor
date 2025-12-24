// Core business data types for Workflo IT Services

export interface Service {
  id: string
  title: string
  titleNL: string
  slug: string
  description: string
  descriptionNL: string
  icon: string
  features: string[]
  featuresNL: string[]
  pricing?: {
    base: number
    currency: 'EUR'
    period: 'monthly' | 'yearly'
    description: string
    descriptionNL: string
  }
  category: 'managed-it' | 'cloud' | 'security' | 'network' | 'consultancy'
}

export interface ServiceCategory {
  id: string
  name: string
  nameNL: string
  slug: string
  description: string
  descriptionNL: string
  services: Service[]
  color: string
}

export interface Client {
  id: string
  name: string
  logo: string
  industry: string
  industryNL: string
  website?: string
  testimonial?: Testimonial
  caseStudy?: CaseStudy
}

export interface Testimonial {
  id: string
  clientId: string
  clientName: string
  clientTitle: string
  clientTitleNL: string
  content: string
  contentNL: string
  rating: number
  date: string
  featured: boolean
}

export interface CaseStudy {
  id: string
  title: string
  titleNL: string
  slug: string
  clientId: string
  clientName: string
  industry: string
  industryNL: string
  challenge: string
  challengeNL: string
  solution: string
  solutionNL: string
  results: CaseStudyResult[]
  resultsNL: CaseStudyResult[]
  image?: string
  publishDate: string
  featured: boolean
}

export interface CaseStudyResult {
  metric: string
  value: string
  description: string
}

export interface TeamMember {
  id: string
  name: string
  title: string
  titleNL: string
  bio: string
  bioNL: string
  photo: string
  email?: string
  linkedin?: string
  certifications: string[]
  specialties: string[]
  specialtiesNL: string[]
}

export interface CompanyInfo {
  name: string
  tagline: string
  taglineNL: string
  founded: string
  employees: string
  location: ContactLocation
  description: string
  descriptionNL: string
  mission: string
  missionNL: string
  values: CompanyValue[]
  certifications: string[]
  partnerships: string[]
}

export interface CompanyValue {
  title: string
  titleNL: string
  description: string
  descriptionNL: string
  icon: string
}

export interface ContactLocation {
  name: string
  address: string
  city: string
  postalCode: string
  country: string
  phone: string
  email: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface BlogPost {
  id: string
  title: string
  titleNL: string
  slug: string
  excerpt: string
  excerptNL: string
  content: string
  contentNL: string
  author: string
  publishDate: string
  lastModified: string
  tags: string[]
  tagsNL: string[]
  category: string
  categoryNL: string
  featured: boolean
  image?: string
  readTime: number
}

export interface FAQ {
  id: string
  question: string
  questionNL: string
  answer: string
  answerNL: string
  category: string
  categoryNL: string
  order: number
  featured: boolean
}

export interface Industry {
  id: string
  name: string
  nameNL: string
  slug: string
  description: string
  descriptionNL: string
  challenges: string[]
  challengesNL: string[]
  solutions: string[]
  solutionsNL: string[]
  clients: Client[]
  caseStudies: CaseStudy[]
  icon: string
  color: string
}

export interface HubSpotFormConfig {
  region: 'eu1' | 'na1' | 'ap1'
  portalId: string
  formId: string
  name: string
  purpose: string
}

export interface NavigationItem {
  title: string
  titleNL: string
  href: string
  description?: string
  descriptionNL?: string
  children?: NavigationItem[]
  external?: boolean
}

export interface SEOData {
  title: string
  titleNL: string
  description: string
  descriptionNL: string
  keywords: string[]
  keywordsNL: string[]
  ogImage?: string
  canonicalUrl?: string
}

export interface Language {
  code: 'en' | 'nl'
  name: string
  flag: string
}

export interface SiteConfig {
  name: string
  description: string
  descriptionNL: string
  url: string
  ogImage: string
  links: {
    twitter?: string
    github?: string
    linkedin: string
    instagram?: string
  }
  defaultLanguage: Language['code']
  languages: Language[]
}

// Page-specific types
export interface HomePageData {
  hero: {
    title: string
    titleNL: string
    subtitle: string
    subtitleNL: string
    cta: string
    ctaNL: string
    ctaHref: string
    backgroundVideo?: string
  }
  services: ServiceCategory[]
  testimonials: Testimonial[]
  clients: Client[]
  stats: Array<{
    value: string
    label: string
    labelNL: string
  }>
}

export interface ServicesPageData {
  hero: {
    title: string
    titleNL: string
    subtitle: string
    subtitleNL: string
  }
  categories: ServiceCategory[]
  processes: Array<{
    step: number
    title: string
    titleNL: string
    description: string
    descriptionNL: string
  }>
  pricing: {
    title: string
    titleNL: string
    description: string
    descriptionNL: string
    basePrice: number
    currency: 'EUR'
    features: string[]
    featuresNL: string[]
  }
}

export interface AboutPageData {
  hero: {
    title: string
    titleNL: string
    subtitle: string
    subtitleNL: string
  }
  story: {
    title: string
    titleNL: string
    content: string
    contentNL: string
  }
  values: CompanyValue[]
  timeline: Array<{
    year: string
    event: string
    eventNL: string
  }>
  team: TeamMember[]
  stats: Array<{
    value: string
    label: string
    labelNL: string
  }>
}

export interface ContactPageData {
  hero: {
    title: string
    titleNL: string
    subtitle: string
    subtitleNL: string
  }
  location: ContactLocation
  hours: {
    weekdays: string
    weekdaysNL: string
    support: string
    supportNL: string
  }
  forms: {
    contact: HubSpotFormConfig
    newsletter?: HubSpotFormConfig
  }
}