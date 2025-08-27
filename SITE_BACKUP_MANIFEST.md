# 🔒 SITE BACKUP MANIFEST - Workflo Website
## Complete Site Restoration Guide

> **Created**: 2025-08-27  
> **Version**: 1.0.0  
> **Status**: Production Ready  
> **Last Updated**: Door Claude Code

---

## 🚀 QUICK RESTORE COMMAND

```bash
# Complete site restore in one command
git clone [repository-url] workflo-site && \
cd workflo-site && \
npm install && \
cp .env.example .env.local && \
npm run dev
```

---

## 📋 PROJECT OVERVIEW

### Basic Information
- **Company**: Workflo B.V.
- **Website**: https://workflo.it
- **Tech Stack**: Next.js 15.5.0, React 19, TypeScript, Tailwind CSS v4
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel
- **Location**: Amsterdam, Netherlands

### Repository Structure
```
/new-project/
├── app/                    # Next.js App Router pages
│   ├── sectoren/          # 9 sector pages (architecten, financiele, etc.)
│   ├── diensten/          # Service pages
│   ├── nieuws/            # News/Blog with RSS & LinkedIn
│   ├── cms/               # Content Management System
│   ├── portfolio/         # Portfolio with tech carousel
│   └── api/               # API routes
├── components/            # React components
│   ├── layout/           # Header, Footer, Navigation
│   ├── sectors/          # Sector page templates
│   └── ui/               # UI components (shadcn)
├── lib/                   # Utilities and configurations
│   ├── config/           # LinkedIn posts, external links
│   ├── data/             # Portfolio data, workflo data
│   └── utils/            # RSS parser, utilities
├── public/               # Static assets
└── styles/               # Global CSS
```

---

## 🔧 COMPLETE INSTALLATION GUIDE

### 1. Prerequisites
```bash
# Required software
node --version  # v18.0.0 or higher
npm --version   # v9.0.0 or higher
git --version   # v2.0.0 or higher
```

### 2. Clone and Setup
```bash
# Clone repository
git clone [repository-url] workflo-site
cd workflo-site

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
```

### 3. Environment Variables
Create `.env.local` with:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/workflo"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Optional: AI APIs
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..."

# HubSpot (for forms)
HUBSPOT_PORTAL_ID="26510736"
HUBSPOT_FORM_NEWSLETTER="e92de02c-71b0-4a68-aedd-3b6acb0f5f67"
HUBSPOT_FORM_CONTACT="acfec8fa-c596-4fe0-aa14-ed4bf42b6f73"

# Analytics
GA_MEASUREMENT_ID="G-XXXXXXXXXX"
CLARITY_PROJECT_ID="xxxxx"
HOTJAR_SITE_ID="xxxxx"
```

### 4. Database Setup
```bash
# Push schema to database
npm run db:push

# Run migrations
npm run db:migrate

# Seed with sample data (optional)
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📦 CRITICAL FILES TO BACKUP

### Core Configuration Files
```
✅ package.json              # Dependencies
✅ tsconfig.json            # TypeScript config
✅ next.config.mjs          # Next.js config
✅ tailwind.config.ts       # Tailwind config
✅ postcss.config.mjs       # PostCSS config
✅ .env.local               # Environment variables
```

### Critical Custom Code
```
✅ /app/layout.tsx          # Root layout with analytics
✅ /components/layout/enterprise-header.tsx  # Main navigation
✅ /lib/config/linkedin-posts.ts  # LinkedIn integration
✅ /lib/utils/rss-parser.ts       # RSS feed parser
✅ /app/api/external-news/route.ts  # News API
```

### Sector Pages (All 9)
```
✅ /app/sectoren/architecten/page.tsx
✅ /app/sectoren/financiele-sector/page.tsx
✅ /app/sectoren/gezondheidszorg/page.tsx
✅ /app/sectoren/media/page.tsx
✅ /app/sectoren/marketing-reclame/page.tsx
✅ /app/sectoren/retail/page.tsx
✅ /app/sectoren/zzp/page.tsx
✅ /app/sectoren/non-profit/page.tsx
✅ /app/sectoren/divers/page.tsx
```

---

## 🎨 KEY CUSTOMIZATIONS

### 1. Color Scheme
```css
/* Workflo Brand Colors */
--workflo-yellow: #FFD700
--workflo-yellow-dark: #FFC700
--primary: #0066CC
--background: #FFFFFF
--foreground: #1A1A1A
```

### 2. Navigation Structure
```typescript
// Main menu items with correct paths
- Diensten → /diensten
- Sectoren → /sectoren/* (9 pages)
- Over Ons → /over-ons
- Portfolio → /portfolio
- Nieuws → /nieuws (was /blog, fixed)
- Contact → /contact
```

### 3. External Integrations
```javascript
// RSS Feed
url: 'https://rss.workflo.it/i/?a=rss&user=workflo&token=&hours=168'

// LinkedIn
url: 'https://www.linkedin.com/company/workflo-it/'

// HubSpot Forms
Newsletter: "e92de02c-71b0-4a68-aedd-3b6acb0f5f67"
Contact: "acfec8fa-c596-4fe0-aa14-ed4bf42b6f73"
```

### 4. Technology Partners Carousel
```javascript
// Portfolio page carousel partners
Row 1: Microsoft, Office 365, Google, G-Suite, Apple, Adobe, HP, Dell
Row 2: Cisco, Meraki, Sophos, Ruckus, FortiNet, Ubiquiti, AWS, Synology, Dropbox
```

---

## 🐛 FIXED ISSUES LOG

### Issues Resolved
1. ✅ Sector pages 404 errors - Fixed menu links
2. ✅ Contrast issues on werken-bij page - Changed to workflo-yellow
3. ✅ Newsletter HubSpot integration - Added proper form IDs
4. ✅ LinkedIn posts authentication - Added real URLs
5. ✅ RSS feed integration - Implemented real parser
6. ✅ Nieuws page 404 - Fixed path from /blog to /nieuws
7. ✅ Contact bereikbaarheid - Updated to "30+ minuten lopen"

---

## 🚀 DEPLOYMENT

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Environment variables needed in Vercel:
# Add all variables from .env.local
```

### Production Checklist
- [ ] Run `npm run typecheck` - MUST PASS
- [ ] Run `npm run lint` - MUST PASS  
- [ ] Test all sector pages
- [ ] Verify RSS feed loading
- [ ] Check LinkedIn integration
- [ ] Test contact forms
- [ ] Verify analytics tracking

---

## 🔄 RESTORE PROCEDURES

### Complete Restore from Backup
```bash
# 1. Clone repository
git clone [backup-repository] workflo-restored
cd workflo-restored

# 2. Install exact versions
npm ci

# 3. Setup environment
cp SITE_BACKUP_MANIFEST.md .
cp .env.example .env.local
# Edit .env.local with actual values

# 4. Database setup
npm run db:push
npm run db:migrate

# 5. Verify installation
npm run typecheck
npm run lint
npm run dev
```

### Partial Restore (specific features)
```bash
# Restore sector pages only
cp -r backup/app/sectoren/* app/sectoren/

# Restore LinkedIn integration
cp backup/lib/config/linkedin-posts.ts lib/config/

# Restore RSS parser
cp backup/lib/utils/rss-parser.ts lib/utils/
```

---

## 📊 DATABASE SCHEMA

### Key Tables (Prisma)
```prisma
model Article {
  id          String   @id @default(cuid())
  title       String
  titleNL     String
  slug        String   @unique
  content     String   @db.Text
  contentNL   String   @db.Text
  excerpt     String
  excerptNL   String
  published   Boolean  @default(false)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Service {
  id          String   @id @default(cuid())
  title       String
  titleNL     String
  slug        String   @unique
  description String   @db.Text
  // ... more fields
}
```

---

## 🔐 SECURITY NOTES

### Sensitive Data
- **Never commit**: .env.local, .env.production
- **API Keys**: Store in environment variables only
- **Database**: Use connection pooling in production
- **Forms**: HubSpot handles data security

### Access Control
- CMS requires authentication
- Admin routes protected
- API rate limiting recommended

---

## 📝 MAINTENANCE COMMANDS

```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit
npm audit fix

# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev

# Database maintenance
npm run db:studio  # Open Prisma Studio
npm run db:reset   # Reset database
```

---

## 🆘 TROUBLESHOOTING

### Common Issues & Solutions

#### Port 3000 already in use
```bash
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

#### Build errors
```bash
rm -rf .next node_modules
npm ci
npm run build
```

#### Database connection issues
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Reset database
npm run db:reset
```

---

## 📞 SUPPORT CONTACTS

### Development Team
- **Claude Code**: This restoration guide
- **Repository**: [Your Git repository]
- **Production**: https://workflo.it

### External Services
- **Vercel**: https://vercel.com/dashboard
- **HubSpot**: Portal ID 26510736
- **LinkedIn**: https://www.linkedin.com/company/workflo-it/

---

## ✅ RESTORATION VERIFICATION

After restoration, verify:
1. [ ] Homepage loads correctly
2. [ ] All 9 sector pages accessible
3. [ ] Portfolio carousel animates
4. [ ] News page shows RSS feed
5. [ ] LinkedIn posts display
6. [ ] Contact forms work
7. [ ] CMS login functional
8. [ ] No console errors
9. [ ] Mobile responsive
10. [ ] Analytics tracking

---

## 📅 BACKUP SCHEDULE

Recommended backup frequency:
- **Code**: Daily (Git commits)
- **Database**: Weekly (pg_dump)
- **Environment**: On change
- **Full backup**: Monthly

---

## 🎉 COMPLETION NOTES

This manifest contains everything needed to rebuild the entire Workflo website from scratch. Keep this file updated with any major changes to ensure successful restoration.

**Last successful build**: 2025-08-27
**Node version used**: 18.x
**npm version used**: 9.x

---

*Generated by Claude Code - Your AI Development Partner*