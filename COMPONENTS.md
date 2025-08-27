# Workflo Website Component Documentation

## 🧩 Overview

This document provides a comprehensive guide to the reusable components in the Workflo IT Services website, built with Next.js, Shadcn/ui, and Tailwind CSS.

## 📁 Component Structure

### UI Components (`components/ui/`)
These are base components from Shadcn/ui, customized for Workflo's design system.

#### Button
- Location: `components/ui/button.tsx`
- Variants: Primary, Secondary, Ghost
- Props:
  - `variant`: 'default' | 'outline' | 'ghost'
  - `size`: 'default' | 'sm' | 'lg'
  - `className`: Additional Tailwind classes

#### Card
- Location: `components/ui/card.tsx`
- Used for: Service highlights, testimonials, case studies
- Props:
  - `title`: Card title
  - `description`: Optional card description
  - `image`: Optional background or icon image

### Layout Components (`components/layout/`)

#### Header
- Location: `components/layout/header.tsx`
- Features:
  - Responsive navigation
  - Language switcher
  - Theme toggle
  - Mobile menu support

#### Footer
- Location: `components/layout/footer.tsx`
- Sections:
  - Quick links
  - Contact information
  - Social media icons
  - Newsletter signup

### Section Components (`components/sections/`)

#### HeroSection
- Location: `components/sections/HeroSection.tsx`
- Props:
  - `title`: Main headline
  - `subtitle`: Supporting text
  - `ctaText`: Call-to-action button text
  - `backgroundImage`: Optional hero background

#### ServicesSection
- Location: `components/sections/ServicesSection.tsx`
- Dynamic service card rendering
- Animated service icons
- Service category filtering

#### TestimonialsCarousel
- Location: `components/testimonials/testimonials-carousel.tsx`
- Features:
  - Swipeable testimonial cards
  - Client logos
  - Framer Motion animations

### Form Components (`components/forms/`)

#### ContactForm
- Location: `components/forms/contact-form.tsx`
- Validation:
  - Client-side validation
  - reCAPTCHA integration
- Fields:
  - Name
  - Email
  - Company
  - Message
  - Service interest

#### NewsletterSignup
- Location: `components/forms/newsletter-signup.tsx`
- HubSpot integration
- Email validation
- Success/error states

## 🪝 Custom Hooks

### useAnalytics
- Location: `hooks/use-analytics.ts`
- Centralized analytics tracking
- Methods:
  - `trackPageView()`
  - `trackEvent(eventName, eventData)`
  - `identifyUser(userData)`

### useToast
- Location: `hooks/use-toast.ts`
- Manages toast notifications
- Methods:
  - `showSuccess(message)`
  - `showError(message)`
  - `showInfo(message)`

## 🌐 Context Providers

### LanguageContext
- Location: `lib/contexts/language-context.tsx`
- Manages multilingual support
- Methods:
  - `changeLanguage(locale)`
  - `getCurrentLanguage()`

### ThemeContext
- Location: `lib/contexts/theme-context.tsx`
- Dark/light mode management
- Methods:
  - `toggleTheme()`
  - `getCurrentTheme()`

## 🎨 Design System Principles

- **Color Palette**: Workflo Yellow (#f2f400) as primary accent
- **Typography**: Inter font, responsive sizing
- **Spacing**: Consistent 8px grid system
- **Animations**: Subtle Framer Motion interactions

## 🚀 Performance Considerations

- Lazy loading for images
- Code-split components
- Minimal prop drilling
- Server-side rendering for initial load

## 🛠️ Adding New Components

1. Follow existing component structure
2. Use TypeScript with strict typing
3. Add Tailwind utility classes
4. Consider accessibility
5. Write comprehensive prop types
6. Add unit tests

## 📝 Best Practices

- Keep components small and focused
- Use composition over inheritance
- Prioritize server components
- Implement proper error boundaries
- Add meaningful prop documentation

---

🌟 Built with passion for developer experience!