# SEO System Documentation

This comprehensive SEO system is designed to optimize your Next.js application for Dutch business websites, specifically targeting local Amsterdam search results and international visibility.

## 🎯 Overview

The SEO system provides:
- ✅ **Complete Meta Tags Management** - Title, description, keywords, OG, Twitter Cards
- ✅ **Advanced Structured Data** - JSON-LD schema for business, services, articles, FAQs
- ✅ **Dynamic Sitemap Generation** - Automatic updates with hreflang support
- ✅ **Smart Robots.txt** - Proper crawl directives with bot management
- ✅ **Canonical URLs** - Prevent duplicate content issues
- ✅ **Multi-language Support** - Dutch/English with proper hreflang tags
- ✅ **SEO-Optimized Components** - Headings, images, breadcrumbs with schema markup
- ✅ **Performance Optimization** - Core Web Vitals compliance

## 📁 File Structure

```
lib/seo/
├── meta-generator.ts      # Metadata generation utilities
├── structured-data.ts     # JSON-LD schema generators
└── README.md             # This documentation

components/seo/
├── breadcrumb.tsx        # Breadcrumb navigation with schema
├── seo-heading.tsx       # SEO-optimized heading components
├── seo-image.tsx         # Image components with alt text and schema
└── seo-page.tsx          # Page wrappers with complete SEO integration

app/
├── sitemap.xml/route.ts  # Dynamic sitemap generator
└── robots.txt/route.ts   # Smart robots.txt with bot management
```

## 🚀 Quick Start

### 1. Basic Page Setup

```tsx
import { generateMetadata } from '@/lib/seo/meta-generator'
import { SEOPage } from '@/components/seo/seo-page'
import { PageTitle, SectionTitle } from '@/components/seo/seo-heading'

// Generate metadata
export const metadata = generateMetadata({
  title: 'Your Page Title',
  titleNL: 'Je Pagina Titel',
  description: 'Page description in English',
  descriptionNL: 'Pagina beschrijving in het Nederlands',
  keywords: ['your', 'custom', 'keywords'],
})

export default function YourPage() {
  return (
    <SEOPage>
      <PageTitle>Your Main Heading</PageTitle>
      <SectionTitle>Section Heading</SectionTitle>
      {/* Your content */}
    </SEOPage>
  )
}
```

### 2. Service Page Setup

```tsx
import { ServicePage } from '@/components/seo/seo-page'
import { seoTemplates } from '@/lib/seo/meta-generator'

export const metadata = generateMetadata(
  seoTemplates.service(
    'IT Support Services',
    'IT Ondersteuning Diensten',
    'Professional IT support for Amsterdam businesses',
    'Professionele IT-ondersteuning voor Amsterdamse bedrijven'
  )
)

export default function ServicePageComponent() {
  return (
    <ServicePage
      serviceName="IT Support Services"
      serviceNameNL="IT Ondersteuning Diensten"
      description="Professional IT support"
      descriptionNL="Professionele IT-ondersteuning"
      features={['24/7 Support', 'Remote Access', 'On-site Visits']}
      pricing={{ base: 60, currency: 'EUR', period: 'monthly' }}
    >
      {/* Your service content */}
    </ServicePage>
  )
}
```

### 3. Article/Blog Page Setup

```tsx
import { ArticlePage } from '@/components/seo/seo-page'
import { ArticleTitle } from '@/components/seo/seo-heading'

export default function ArticlePageComponent() {
  return (
    <ArticlePage
      title="Article Title"
      titleNL="Artikel Titel"
      description="Article description"
      descriptionNL="Artikel beschrijving"
      publishedAt="2024-01-01T00:00:00Z"
      author="Workflo B.V."
      category="IT News"
      image="/images/article.jpg"
    >
      <ArticleTitle
        title="Article Title"
        titleNL="Artikel Titel"
        publishedAt="2024-01-01T00:00:00Z"
      />
      {/* Article content */}
    </ArticlePage>
  )
}
```

## 🧩 Component Usage

### SEO Headings

```tsx
import { PageTitle, SectionTitle, SubSectionTitle, ServiceTitle } from '@/components/seo/seo-heading'

// Main page title (H1) - use only once per page
<PageTitle id="main-title">
  Main Page Title
</PageTitle>

// Section headings (H2)
<SectionTitle id="section-1">
  Section Title
</SectionTitle>

// Sub-section headings (H3)
<SubSectionTitle id="subsection-1">
  Subsection Title
</SubSectionTitle>

// Service-specific title
<ServiceTitle
  serviceName="Cloud Solutions"
  serviceNameNL="Cloud-oplossingen"
  id="service-title"
/>
```

### SEO Images

```tsx
import { SEOImage, ServiceImage, TeamMemberImage, CompanyLogo } from '@/components/seo/seo-image'

// Basic SEO image
<SEOImage
  src="/images/example.jpg"
  alt="Descriptive alt text"
  altNL="Beschrijvende alt tekst"
  width={800}
  height={400}
  schema={true}
/>

// Service image with automatic SEO optimization
<ServiceImage
  serviceName="Managed IT"
  serviceNameNL="Managed IT"
  src="/images/managed-it.jpg"
  width={600}
  height={400}
/>

// Team member image
<TeamMemberImage
  name="John Doe"
  role="IT Specialist"
  roleNL="IT Specialist"
  src="/images/team/john.jpg"
  width={300}
  height={300}
/>

// Company logo with schema markup
<CompanyLogo variant="header" />
```

### Breadcrumbs

```tsx
import { Breadcrumb, generateBreadcrumbsFromPath } from '@/components/seo/breadcrumb'

// Manual breadcrumbs
const breadcrumbs = [
  { name: 'Services', nameNL: 'Diensten', href: '/diensten' },
  { name: 'IT Support', nameNL: 'IT Ondersteuning', href: '/diensten/it-support', current: true }
]

<Breadcrumb items={breadcrumbs} />

// Auto-generated from pathname
const pathname = '/diensten/managed-it'
const autoBreadcrumbs = generateBreadcrumbsFromPath(pathname)
<Breadcrumb items={autoBreadcrumbs} />
```

## 🔧 Advanced Configuration

### Custom Metadata Templates

```tsx
// Create custom SEO template
const customTemplate: PageSEOData = {
  title: 'Custom Page Title',
  titleNL: 'Aangepaste Pagina Titel',
  description: 'Custom description',
  descriptionNL: 'Aangepaste beschrijving',
  keywords: ['custom', 'keywords'],
  pageType: 'website',
  canonicalUrl: 'https://workflo.it/custom-page'
}

export const metadata = generateMetadata(customTemplate, 'nl')
```

### Structured Data Configuration

```tsx
import { generateStructuredData, getServiceSchema, getFAQSchema } from '@/lib/seo/structured-data'

// Custom structured data
const structuredDataConfigs = [
  {
    type: 'service' as const,
    data: {
      name: 'Custom Service',
      nameNL: 'Aangepaste Dienst',
      description: 'Service description',
      descriptionNL: 'Dienst beschrijving',
      slug: 'custom-service'
    }
  },
  {
    type: 'faq' as const,
    data: [
      { question: 'Question?', answer: 'Answer.' }
    ]
  }
]

const completeStructuredData = generateStructuredData(structuredDataConfigs)
```

## 📊 SEO Best Practices Implementation

### 1. Title Optimization
- **H1**: One per page, descriptive and keyword-rich
- **H2-H6**: Logical hierarchy, no skipping levels
- **Length**: Titles 50-60 characters, descriptions 150-160 characters

### 2. Dutch Local SEO
```tsx
// Keywords targeting Amsterdam and Netherlands
const dutchKeywords = [
  'IT Services Amsterdam',
  'IT ondersteuning Nederland',
  'Computer reparatie Amsterdam',
  'Managed IT Nederland',
  'Cybersecurity Amsterdam'
]
```

### 3. Structured Data Schema
- **Organization**: Company information and contact details
- **LocalBusiness**: Local Amsterdam business details
- **Service**: Individual service pages
- **Article**: Blog posts and news articles
- **FAQPage**: FAQ sections
- **BreadcrumbList**: Navigation breadcrumbs

### 4. Performance Optimization
```tsx
// Image optimization
<SEOImage
  src="/images/service.jpg"
  alt="Service description"
  width={800}
  height={400}
  loading="lazy"          // Lazy loading for performance
  priority={false}        // Only true for above-the-fold images
  schema={true}          // Include structured data
/>
```

## 🌐 Multi-language Support

### Language Detection and Content

```tsx
import { useLanguage } from '@/lib/contexts/language-context'

export default function MultilingualComponent() {
  const { language } = useLanguage()
  
  return (
    <PageTitle>
      {language === 'nl' ? 'Nederlandse Titel' : 'English Title'}
    </PageTitle>
  )
}
```

### Hreflang Implementation

The system automatically generates hreflang tags in:
- Page metadata
- Sitemap.xml entries
- Breadcrumb schema markup

## 🔍 Monitoring and Analytics

### SEO Monitoring Tools Integration

```tsx
// Development mode heading hierarchy validation
import { useHeadingHierarchy } from '@/components/seo/seo-heading'

export default function PageWithMonitoring() {
  useHeadingHierarchy() // Warns about SEO issues in development
  
  return (
    // Your page content
  )
}
```

### Core Web Vitals Optimization

All SEO components are optimized for:
- **LCP (Largest Contentful Paint)**: Optimized image loading
- **FID (First Input Delay)**: Minimal JavaScript overhead
- **CLS (Cumulative Layout Shift)**: Proper image dimensions

## 🛠 Troubleshooting

### Common Issues

1. **Multiple H1 headings**: Use `useHeadingHierarchy()` hook to detect
2. **Missing alt text**: All `SEOImage` components require alt text
3. **Incorrect heading hierarchy**: Follow H1 → H2 → H3 sequence
4. **Sitemap not updating**: Check database connection in `sitemap.xml/route.ts`

### Development Tools

```bash
# Check TypeScript types
npm run type-check

# Lint for SEO issues
npm run lint

# Test sitemap generation
curl http://localhost:3000/sitemap.xml

# Test robots.txt
curl http://localhost:3000/robots.txt
```

## 📈 Expected Results

Following this SEO implementation should result in:

- ✅ **100% SEO Score** on Lighthouse audits
- ✅ **Rich Snippets** in Google search results
- ✅ **Local Search Visibility** for Amsterdam-based queries
- ✅ **Proper Schema Validation** on Google's Rich Results Test
- ✅ **Fast Page Loading** with Core Web Vitals compliance
- ✅ **Multi-language Support** with proper hreflang implementation

## 🔗 Resources

- [Google Search Console](https://search.google.com/search-console)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Schema.org Documentation](https://schema.org/)
- [Google's SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)

## 🤝 Contributing

When adding new SEO features:
1. Follow existing component patterns
2. Add proper TypeScript types
3. Include both Dutch and English content support
4. Test with SEO validation tools
5. Update this documentation

---

This SEO system provides comprehensive optimization for Dutch business websites targeting both local Amsterdam markets and international audiences.