# Workflo Design System
## Premium MSP Website Design Specification

> **Design Philosophy**: Clean, professional, premium. Apple/DEPT/MediaMonks niveau.
> **Target**: B2B IT Services (MSP) in Amsterdam
> **Audience**: Business owners, IT managers, decision makers

---

## 🎨 1. COLOR SYSTEM

### Primary Colors
```css
--workflo-yellow: #FFD938       /* Primary CTA, accents, hover states */
--workflo-yellow-light: #FFF4BF /* Subtle backgrounds, light accents */
--workflo-yellow-dark: #E6C230  /* Hover states for yellow buttons */
--workflo-black: #111111        /* Primary text, headers (light mode) */
--workflo-white: #FFFFFF        /* Backgrounds (light mode) */
```

### Grayscale Palette
```css
/* Light Mode */
--gray-50: #F8F8F8     /* Subtle backgrounds */
--gray-100: #EDEDED    /* Card backgrounds, borders */
--gray-300: #C1C1C1    /* Secondary text, icons */
--gray-600: #6A6A6A    /* Muted text */
--gray-900: #1A1A1A    /* Dark accents */

/* Dark Mode */
--gray-950: #0A0A0A    /* Background */
--gray-900: #1A1A1A    /* Card backgrounds */
--gray-800: #2A2A2A    /* Borders */
--gray-300: #C1C1C1    /* Body text */
--gray-100: #EDEDED    /* Heading text */
```

### Status Colors
```css
--success: #28C76F
--warning: #FFA100
--error: #FF4D4D
```

### Color Usage Guidelines

**Light Mode:**
- Background: `#FFFFFF` (white)
- Text Primary: `#111111` (workflo-black)
- Text Secondary: `#6A6A6A` (gray-600)
- Text Muted: `#C1C1C1` (gray-300)
- Cards: `#F8F8F8` (gray-50)
- Borders: `#EDEDED` (gray-100)

**Dark Mode:**
- Background: `#0A0A0A` (gray-950)
- Text Primary: `#EDEDED` (gray-100)
- Text Secondary: `#C1C1C1` (gray-300)
- Text Muted: `#6A6A6A` (gray-600)
- Cards: `#1A1A1A` (gray-900)
- Borders: `#2A2A2A` (gray-800)

**Yellow CTA remains EXACTLY the same in both modes:**
- Background: `#FFD938`
- Text: `#111111` (black)
- Hover: `#E6C230`

---

## 🔤 2. TYPOGRAPHY SYSTEM

### Font Family
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace; /* For code/technical content only */
```

### Type Scale

#### H1 - Hero Headlines
```css
font-size: clamp(3.75rem, 5vw, 4.5rem);  /* 60px - 72px */
font-weight: 700;
line-height: 1.1;
letter-spacing: -0.02em;
```
**Usage**: Main hero section, primary landing headlines
**Example**: "Wij regelen je IT"

#### H2 - Section Headers
```css
font-size: clamp(2.625rem, 3.5vw, 3rem);  /* 42px - 48px */
font-weight: 600;
line-height: 1.2;
letter-spacing: -0.01em;
```
**Usage**: Section titles throughout pages
**Example**: "Wat wij voor je regelen"

#### H3 - Subsection Headers
```css
font-size: clamp(1.75rem, 2.5vw, 2rem);  /* 28px - 32px */
font-weight: 600;
line-height: 1.3;
letter-spacing: 0;
```
**Usage**: Card titles, service headers, subsections
**Example**: "Managed IT Support"

#### Body - Primary Text
```css
font-size: clamp(1.125rem, 1.5vw, 1.25rem);  /* 18px - 20px */
font-weight: 400;
line-height: 1.6;
letter-spacing: 0;
```
**Usage**: Descriptions, paragraphs, main content
**Color Light**: `#6A6A6A` (gray-600)
**Color Dark**: `#C1C1C1` (gray-300)

#### Caption - Small Text
```css
font-size: 0.875rem;  /* 14px */
font-weight: 400;
line-height: 1.5;
letter-spacing: 0.01em;
```
**Usage**: Labels, metadata, footnotes
**Color**: `#C1C1C1` (gray-300)

### Tailwind Typography Classes
```css
.workflo-h1 {
  @apply text-6xl lg:text-7xl font-bold tracking-tight;
}

.workflo-h2 {
  @apply text-4xl lg:text-5xl font-semibold tracking-tight;
}

.workflo-h3 {
  @apply text-2xl lg:text-3xl font-semibold;
}

.workflo-body {
  @apply text-lg lg:text-xl leading-relaxed;
}

.workflo-caption {
  @apply text-sm leading-normal tracking-wide;
}
```

---

## 📐 3. SPACING SYSTEM

### Spacing Scale (8px base grid)
```css
--spacing-xs: 0.5rem;    /* 8px */
--spacing-sm: 1rem;      /* 16px */
--spacing-md: 1.5rem;    /* 24px */
--spacing-lg: 2rem;      /* 32px */
--spacing-xl: 3rem;      /* 48px */
--spacing-2xl: 4rem;     /* 64px */
--spacing-3xl: 6rem;     /* 96px */
--spacing-4xl: 7.5rem;   /* 120px */
```

### Component Spacing

#### Sections
```css
padding-top: 7.5rem;     /* 120px */
padding-bottom: 7.5rem;  /* 120px */
```
**Tailwind**: `py-30` or custom `workflo-section-spacing` class

#### Cards
```css
padding: 2rem;           /* 32px */
gap: 1.5rem;             /* 24px between elements */
border-radius: 0.75rem;  /* 12px */
```

#### Container
```css
max-width: 1280px;       /* Desktop max-width */
padding-x: 1.5rem;       /* 24px horizontal */
margin: 0 auto;
```

#### Grid Gaps
```css
gap: 2rem;               /* 32px - default grid gap */
gap: 1.5rem;             /* 24px - compact grid gap */
```

### Whitespace Hierarchy
1. **Section to Section**: `120px` (py-30)
2. **Title to Subtitle**: `12px` (mb-3)
3. **Subtitle to Content**: `32px` (mb-8)
4. **Between Cards**: `32px` (gap-8)
5. **Within Cards**: `24px` (gap-6)

---

## 🔘 4. BUTTON SYSTEM

### Button Variants

#### Primary Button (Yellow CTA)
```tsx
className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-workflo-yellow hover:bg-workflo-yellow-dark text-workflo-black font-semibold text-base rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
```

**Specs:**
- Background: `#FFD938`
- Text: `#111111` (black)
- Hover: `#E6C230` + scale(1.02)
- Padding: `32px horizontal, 16px vertical`
- Border radius: `8px`
- Font: `600 weight, 16px size`
- Shadow: `sm` → `md` on hover
- **Same in light AND dark mode**

**Usage**: Primary CTAs like "Plan gratis IT-scan", "Contact opnemen"

#### Secondary Button (Outline)
```tsx
// Light Mode
className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-workflo-black text-workflo-black font-semibold text-base rounded-lg hover:bg-workflo-black hover:text-white transition-all duration-200"

// Dark Mode
className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-gray-300 text-gray-100 font-semibold text-base rounded-lg hover:bg-gray-100 hover:text-gray-950 transition-all duration-200"
```

**Specs:**
- Background: `transparent`
- Border: `2px solid`
  - Light: `#111111` (black)
  - Dark: `#C1C1C1` (gray-300)
- Text matches border color
- Hover: Inverted colors
- Same padding/radius as Primary

**Usage**: Secondary actions like "Bekijk prijzen", "Meer informatie"

#### Tertiary Link (Text Link)
```tsx
className="inline-flex items-center gap-2 text-workflo-black dark:text-gray-100 font-medium text-base hover:text-workflo-yellow dark:hover:text-workflo-yellow underline-offset-4 hover:underline transition-colors duration-200"
```

**Specs:**
- No background, no border
- Text color:
  - Light: `#111111`
  - Dark: `#EDEDED`
- Hover: `#FFD938` (yellow) + underline
- Arrow icon: `20px` (Lucide ArrowRight)

**Usage**: "Lees meer", "Bekijk alle diensten", in-text links

---

## 🎯 5. ICON SYSTEM

### Icon Library
**Single source**: **Lucide React** ONLY
**No emoji, no mixed icon sets, no generic SVGs**

### Icon Sizing
```css
--icon-sm: 16px;    /* h-4 w-4 - Navigation, small UI elements */
--icon-md: 20px;    /* h-5 w-5 - Body text inline icons */
--icon-lg: 24px;    /* h-6 w-6 - Card icons, section icons */
--icon-xl: 40px;    /* h-10 w-10 - Feature icons, hero icons */
```

### Icon Stroke Width
```tsx
<Icon className="h-5 w-5 stroke-2" />  /* Always stroke-2 for consistency */
```

### Icon Colors

#### Light Mode
- Default: `#6A6A6A` (gray-600)
- Hover: `#111111` (black)
- Active/Primary: `#FFD938` (yellow)

#### Dark Mode
- Default: `#6A6A6A` (gray-600) at 80% opacity
- Hover: `#EDEDED` (gray-100) at 100% opacity
- Active/Primary: `#FFD938` (yellow)

### Common Icons
```tsx
import {
  Monitor,      // Services, IT support
  Cloud,        // Cloud solutions
  Shield,       // Security, protection
  Headphones,   // Support, helpdesk
  Server,       // Infrastructure, backup
  Lock,         // Network security
  Phone,        // Contact
  Mail,         // Email
  MapPin,       // Location
  Calendar,     // Appointments
  ArrowRight,   // CTAs, navigation
  Check,        // Features, benefits
  ChevronRight, // Dropdowns, navigation
  Menu,         // Mobile menu (hamburger)
  X,            // Close
} from 'lucide-react'
```

---

## 🎪 6. HEADER DESIGN

### Structure
```
Logo (left) | Navigation (center) | Phone Icon + CTA Button (right)
```

### Specifications
```css
height: 80px;
background: rgba(255, 255, 255, 0.95);  /* Light mode with blur */
backdrop-filter: blur(12px);
border-bottom: 1px solid rgba(237, 237, 237, 0.8);
position: sticky;
top: 0;
z-index: 50;
```

### Navigation Items (TEXT LINKS ONLY)
```tsx
<Link className="text-base font-medium text-gray-600 hover:text-workflo-black dark:text-gray-300 dark:hover:text-white transition-colors duration-200">
  Diensten
</Link>
```

**Navigation**: Diensten | Sectoren | Over ons | Contact | Servicedesk
**NO button-style nav items**
**NO Settings button in public menu**

### Phone Number
```tsx
<div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
  <Phone className="h-4 w-4 stroke-2" />
  <span className="text-sm font-medium">020-30 80 465</span>
</div>
```
**Subtle, icon + number, NOT a big button**

### Primary CTA
```tsx
<Button className="bg-workflo-yellow hover:bg-workflo-yellow-dark text-workflo-black font-semibold px-6 py-3 rounded-lg">
  Plan gratis IT-scan
</Button>
```
**This is the ONLY button in header**

### Mobile Menu
```tsx
<button className="h-10 w-10 flex items-center justify-center">
  <Menu className="h-6 w-6 stroke-2" />
</button>
```
**Real hamburger icon (☰), perfectly centered**

---

## 🦶 7. FOOTER DESIGN

### Structure
4-column grid on desktop, stacked on mobile

### Specifications
```css
background: #F8F8F8;  /* Light mode */
background: #1A1A1A;  /* Dark mode */
padding-top: 4rem;    /* 64px */
padding-bottom: 4rem;
```

### Typography
- Section headers: `text-lg font-semibold` (18px)
- Links: `text-base font-normal` (16px)
- Body text: `text-sm` (14px)
- Legal text: `text-xs` (12px)

### Colors
Light mode:
- Text: `#111111`
- Links: `#6A6A6A` → `#FFD938` (hover)
- Borders: `#EDEDED`

Dark mode:
- Text: `#EDEDED`
- Links: `#C1C1C1` → `#FFD938` (hover)
- Borders: `#2A2A2A`

---

## 🌗 8. DARK MODE SYSTEM

### Core Principles
1. **Yellow CTA NEVER changes** - Always `#FFD938` bg with `#111111` text
2. **Logo auto-inverts** - Use `dark:invert` on logo images
3. **Icons at 80% opacity** idle, 100% on hover in dark mode
4. **Gradients**: 100% black → transparent → yellow (never gray)

### Background Layers
```css
/* Light Mode */
--bg-primary: #FFFFFF;
--bg-secondary: #F8F8F8;
--bg-tertiary: #EDEDED;

/* Dark Mode */
--bg-primary: #0A0A0A;   /* gray-950 */
--bg-secondary: #1A1A1A; /* gray-900 */
--bg-tertiary: #2A2A2A;  /* gray-800 */
```

### Text Colors
```css
/* Light Mode */
--text-primary: #111111;    /* Headings */
--text-secondary: #6A6A6A;  /* Body */
--text-muted: #C1C1C1;      /* Captions */

/* Dark Mode */
--text-primary: #EDEDED;    /* Headings - gray-100 */
--text-secondary: #C1C1C1;  /* Body - gray-300 */
--text-muted: #6A6A6A;      /* Captions - gray-600 */
```

### Tailwind Dark Mode Classes
```tsx
<h1 className="text-workflo-black dark:text-gray-100">
<p className="text-gray-600 dark:text-gray-300">
<div className="bg-white dark:bg-gray-950">
<div className="bg-gray-50 dark:bg-gray-900">
<img className="dark:invert" />
<Icon className="text-gray-600 dark:text-gray-600 dark:opacity-80 hover:dark:opacity-100" />
```

---

## 🎬 9. ANIMATION SYSTEM

### Timing Functions
```css
--ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);      /* Smooth, premium feel */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);  /* Subtle bounce */
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);       /* Standard ease-in-out */
```

### Animation Specs

#### Header Fade-in
```tsx
<header className="animate-in fade-in slide-in-from-top-4 duration-700">
```

#### CTA Hover
```tsx
className="hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
```

#### Logo Carousel
```css
animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
/* Infinite scroll, no jumps, smooth loop */
```

#### Card Hover
```tsx
className="hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
```

#### Section Fade-in (Framer Motion)
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
```

### Animation Guidelines
- **Subtle, not overwhelming**
- **Fast performance** (use `transform` and `opacity` only)
- **Once on scroll** (viewport={{ once: true }})
- **No looping animations** (except logo carousel)
- **Respect `prefers-reduced-motion`**

---

## 📦 10. COMPONENT SPECIFICATIONS

### Cards
```tsx
<div className="p-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-workflo-yellow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
  {/* Icon */}
  <div className="w-14 h-14 mb-6 bg-workflo-yellow-light dark:bg-workflo-yellow/10 rounded-lg flex items-center justify-center">
    <Icon className="h-7 w-7 text-workflo-yellow-dark" />
  </div>

  {/* Title */}
  <h3 className="text-2xl font-semibold text-workflo-black dark:text-gray-100 mb-3">
    Title
  </h3>

  {/* Description */}
  <p className="text-gray-600 dark:text-gray-300 mb-6">
    Description text
  </p>

  {/* Link */}
  <LinkTertiary href="/link">Learn more</LinkTertiary>
</div>
```

**Specs:**
- Padding: `32px` (p-8)
- Border radius: `12px` (rounded-xl)
- Border: `1px solid gray-100/gray-800`
- Hover: Yellow border + lift + shadow
- Icon container: `56px × 56px` (w-14 h-14)
- Icon size: `28px` (h-7 w-7)

### Sections
```tsx
<section className="py-30 bg-white dark:bg-gray-950">
  <div className="container mx-auto px-6">
    {/* Section Header */}
    <div className="text-center mb-16">
      <h2 className="text-5xl font-semibold text-workflo-black dark:text-gray-100 mb-4">
        Section Title
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
        Section subtitle or description
      </p>
    </div>

    {/* Content */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Cards */}
    </div>
  </div>
</section>
```

**Specs:**
- Section padding: `120px top/bottom` (py-30)
- Container: `max-w-7xl` (1280px) + `px-6` (24px)
- Title margin-bottom: `16px` (mb-4)
- Subtitle max-width: `768px` (max-w-3xl)
- Content margin-top: `64px` (mb-16)
- Grid gap: `32px` (gap-8)

---

## ✅ 11. QUALITY CHECKLIST

### Before Launch
- [ ] All buttons use Button System (Primary/Secondary/Tertiary only)
- [ ] All icons are from Lucide (NO emoji, NO mixed libraries)
- [ ] Dark mode tested on ALL pages
- [ ] Logo inverts correctly in dark mode
- [ ] Yellow CTA unchanged in dark mode
- [ ] Typography uses Inter font
- [ ] All H1/H2/H3 follow size specs (60-72px, 42-48px, 28-32px)
- [ ] Section padding is 120px (py-30)
- [ ] Cards have 12px border-radius (rounded-xl)
- [ ] All icons are stroke-2 and consistent size
- [ ] Navigation is text-links only (NO button-style)
- [ ] Header height is 80px
- [ ] Phone number is subtle icon + text (NOT big button)
- [ ] Settings button removed from public header
- [ ] Logo carousel has NO visual duplicates
- [ ] Logo carousel uses 2 rows, opposite directions
- [ ] All animations use cubic-bezier easing
- [ ] All hover states tested
- [ ] Spacing follows 8px grid
- [ ] Color contrast meets WCAG AA
- [ ] Mobile responsive on all breakpoints
- [ ] No broken links or missing images

---

## 🚀 12. IMPLEMENTATION PRIORITY

1. **Foundation** (Must have first)
   - Update tailwind.config.ts with color tokens
   - Add Inter font to globals.css
   - Create Button System component
   - Setup Lucide icon imports

2. **Header & Footer** (High visibility)
   - Redesign Header with text-link nav
   - Fix CTA button consistency
   - Redesign Footer with dark mode

3. **Core Components** (Used everywhere)
   - Rebuild Logo Carousel (premium infinite marquee)
   - Standardize Card component
   - Fix all Section layouts

4. **Dark Mode** (Quality)
   - Fix all color inconsistencies
   - Test logo inversion
   - Verify yellow CTA unchanged

5. **Polish** (Final touches)
   - Add premium animations
   - Optimize spacing
   - Clean up duplicates
   - Test mobile responsiveness

---

**Last Updated**: 2025-11-13
**Version**: 1.0.0
**Design Lead**: Senior Art Director Standards
**Target**: Apple/DEPT/MediaMonks Quality Level
