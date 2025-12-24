'use client'

import { 
  Monitor, 
  Shield, 
  Phone, 
  HardDrive, 
  Building2, 
  Heart, 
  Megaphone, 
  User, 
  Camera, 
  ShoppingCart, 
  Building, 
  Cloud,
  Settings2,
  Mail,
  MapPin,
  Calendar,
  HeadphonesIcon,
  Briefcase,
  Users,
  Award,
  FileText,
  MessageCircle,
  Zap,
  Globe,
  Laptop,
  Database,
  Lock,
  Wifi,
  Smartphone,
  Server,
  TrendingUp,
  Target,
  Lightbulb,
  CheckCircle
} from 'lucide-react'

export interface MegaMenuSection {
  id: string
  title: string
  titleNL: string
  icon: any
  color: string
  gradient: string
  description: string
  descriptionNL: string
  items: MegaMenuItem[]
  featured?: boolean
}

export interface MegaMenuItem {
  title: string
  titleNL: string
  href: string
  description: string
  descriptionNL: string
  icon?: any
  badge?: string
  badgeNL?: string
}

export const megaMenuData: MegaMenuSection[] = [
  {
    id: 'diensten',
    title: 'Services',
    titleNL: 'Diensten',
    icon: Settings2,
    color: 'from-workflo-yellow-light to-workflo-yellow',
    gradient: 'bg-gradient-to-br from-workflo-yellow/20 to-orange-500/20',
    description: 'Comprehensive IT solutions for your business',
    descriptionNL: 'Uitgebreide IT-oplossingen voor uw bedrijf',
    featured: true,
    items: [
      {
        title: 'Managed IT Services',
        titleNL: 'Managed IT Services',
        href: '/diensten/managed-it-services',
        description: '24/7 monitoring and complete IT management',
        descriptionNL: '24/7 monitoring en volledig IT-beheer',
        icon: Monitor,
        badge: 'Popular',
        badgeNL: 'Populair'
      },
      {
        title: 'Cloud Services',
        titleNL: 'Cloud Services',
        href: '/diensten/cloud-diensten',
        description: 'Microsoft 365, Azure and hybrid cloud solutions',
        descriptionNL: 'Microsoft 365, Azure en hybride cloud-oplossingen',
        icon: Cloud
      },
      {
        title: 'Cybersecurity',
        titleNL: 'Cybersecurity',
        href: '/diensten/cybersecurity',
        description: 'Advanced security and GDPR compliance',
        descriptionNL: 'Geavanceerde beveiliging en GDPR-compliance',
        icon: Shield,
        badge: 'Essential',
        badgeNL: 'Essentieel'
      },
      {
        title: 'Microsoft 365',
        titleNL: 'Microsoft 365',
        href: '/diensten/microsoft-365',
        description: 'Complete Microsoft 365 setup and migration',
        descriptionNL: 'Complete Microsoft 365 inrichting en migratie',
        icon: Globe
      },
      {
        title: 'Backup & Recovery',
        titleNL: 'Backup & Recovery',
        href: '/diensten/backup-disaster-recovery',
        description: 'Secure data backup and recovery solutions',
        descriptionNL: 'Veilige data backup en herstel oplossingen',
        icon: Database
      },
      {
        title: 'IT Support',
        titleNL: 'IT Support',
        href: '/diensten/it-support',
        description: 'Expert technical support when you need it',
        descriptionNL: 'Deskundige technische ondersteuning wanneer u het nodig heeft',
        icon: HeadphonesIcon
      }
    ]
  },
  {
    id: 'sectoren',
    title: 'Sectors',
    titleNL: 'Sectoren',
    icon: Building2,
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
    description: 'Specialized IT solutions by industry',
    descriptionNL: 'Gespecialiseerde IT-oplossingen per branche',
    items: [
      {
        title: 'Healthcare',
        titleNL: 'Zorgverlening',
        href: '/sectoren/zorgverlening',
        description: 'HIPAA-compliant IT solutions for healthcare',
        descriptionNL: 'HIPAA-conforme IT-oplossingen voor de zorgverlening',
        icon: Heart
      },
      {
        title: 'Legal',
        titleNL: 'Juridisch',
        href: '/sectoren/juridisch',
        description: 'Secure IT solutions for law firms',
        descriptionNL: 'Veilige IT-oplossingen voor advocatenkantoren',
        icon: FileText
      },
      {
        title: 'Marketing Agencies',
        titleNL: 'Marketing Bureaus',
        href: '/sectoren/marketing-bureaus',
        description: 'Creative-focused IT solutions for agencies',
        descriptionNL: 'Creatief gerichte IT-oplossingen voor bureaus',
        icon: Megaphone
      },
      {
        title: 'Professional Services',
        titleNL: 'Professionele Dienstverlening',
        href: '/sectoren/professionele-dienstverlening',
        description: 'Tailored IT for consultancy and services',
        descriptionNL: 'Op maat gemaakte IT voor consultancy en diensten',
        icon: Briefcase
      },
      {
        title: 'E-commerce',
        titleNL: 'E-commerce',
        href: '/sectoren/e-commerce',
        description: 'Scalable IT solutions for online retail',
        descriptionNL: 'Schaalbare IT-oplossingen voor online retail',
        icon: ShoppingCart
      },
      {
        title: 'Real Estate',
        titleNL: 'Vastgoed',
        href: '/sectoren/vastgoed',
        description: 'Property management IT solutions',
        descriptionNL: 'IT-oplossingen voor vastgoedbeheer',
        icon: Building
      }
    ]
  },
  {
    id: 'over-ons',
    title: 'About Us',
    titleNL: 'Over Ons',
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
    description: 'Get to know the Workflo team and story',
    descriptionNL: 'Leer het Workflo-team en verhaal kennen',
    items: [
      {
        title: 'Our Story',
        titleNL: 'Ons Verhaal',
        href: '/over-ons',
        description: 'Our mission, vision and company values',
        descriptionNL: 'Onze missie, visie en bedrijfswaarden',
        icon: Lightbulb
      },
      {
        title: 'Team',
        titleNL: 'Team',
        href: '/over-ons#team',
        description: 'Meet our experienced IT professionals',
        descriptionNL: 'Ontmoet onze ervaren IT-professionals',
        icon: User
      },
      {
        title: 'Careers',
        titleNL: 'Werken bij Workflo',
        href: '/carrières',
        description: 'Join our growing team of IT experts',
        descriptionNL: 'Word deel van ons groeiende team van IT-experts',
        icon: TrendingUp
      },
      {
        title: 'Testimonials',
        titleNL: 'Testimonials',
        href: '/over-ons#testimonials',
        description: 'What our clients say about us',
        descriptionNL: 'Wat onze klanten over ons zeggen',
        icon: MessageCircle
      },
      {
        title: 'Certifications',
        titleNL: 'Certificeringen',
        href: '/over-ons#certificeringen',
        description: 'Our industry certifications and partnerships',
        descriptionNL: 'Onze branchecertificeringen en partnerschappen',
        icon: Award
      }
    ]
  },
  {
    id: 'contact-support',
    title: 'Contact & Support',
    titleNL: 'Contact & Support',
    icon: HeadphonesIcon,
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
    description: 'Get in touch and find support resources',
    descriptionNL: 'Neem contact op en vind ondersteuningsbronnen',
    items: [
      {
        title: 'Contact Us',
        titleNL: 'Contact',
        href: '/contact',
        description: 'Get in touch with our team',
        descriptionNL: 'Neem contact op met ons team',
        icon: Mail
      },
      {
        title: 'Schedule Consultation',
        titleNL: 'Plan Consultatie',
        href: '/contact#consult',
        description: 'Book a free IT consultation',
        descriptionNL: 'Boek een gratis IT-consultatie',
        icon: Calendar,
        badge: 'Free',
        badgeNL: 'Gratis'
      },
      {
        title: 'Support Portal',
        titleNL: 'Support Portal',
        href: '/support',
        description: 'Access our client support resources',
        descriptionNL: 'Toegang tot onze klantenondersteuningsbronnen',
        icon: HeadphonesIcon
      },
      {
        title: 'Emergency Support',
        titleNL: 'Noodondersteuning',
        href: '/contact#emergency',
        description: '24/7 emergency IT support',
        descriptionNL: '24/7 nood IT-ondersteuning',
        icon: Zap,
        badge: '24/7',
        badgeNL: '24/7'
      },
      {
        title: 'Office Location',
        titleNL: 'Kantoorlocatie',
        href: '/contact#locatie',
        description: 'Visit us in Amsterdam',
        descriptionNL: 'Bezoek ons in Amsterdam',
        icon: MapPin
      }
    ]
  }
]

// Animation variants for the mega menu
export const megaMenuAnimations = {
  overlay: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }
    }
  },
  container: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  section: {
    initial: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }
    }
  },
  item: {
    initial: { 
      opacity: 0, 
      x: -20
    },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }
    }
  },
  menuButton: {
    closed: { 
      rotate: 0,
      scale: 1
    },
    open: { 
      rotate: 45,
      scale: 1.1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }
    }
  }
}