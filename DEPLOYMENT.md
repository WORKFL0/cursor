# Workflo Website Deployment Guide

## 🚀 Deployment Overview

This guide covers the complete deployment process for the Workflo IT Services website, focusing on Vercel and Supabase configurations.

## 📋 Prerequisites

- GitHub repository with the latest code
- Vercel account
- Supabase account
- Payload CMS account
- Domain registered and configured

## 🔧 Environment Setup

### 1. Supabase Database Configuration

1. Create a new Supabase project
2. Copy the database connection string
3. Set the following environment variables:
   ```
   DATABASE_URL="postgresql://username:password@supabase-project.supabase.co:5432/postgres"
   ```

### 2. Payload CMS Setup

1. Configure Payload CMS settings
2. Generate a secure secret for authentication
3. Set environment variables:
   ```
   PAYLOAD_SECRET="your-secure-payload-secret"
   ```

### 3. Authentication Configuration

1. Generate a secure NextAuth secret
2. Add to environment variables:
   ```
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```

### 4. Analytics and Tracking

Configure tracking IDs:
```
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_MICROSOFT_CLARITY_ID="xxxxxxxxx"
NEXT_PUBLIC_HOTJAR_ID="xxxxxxxxx"
```

## 🌐 Vercel Deployment

### Manual Deployment Steps

1. Push latest code to GitHub
2. Connect Vercel to your GitHub repository
3. Configure project settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Environment Variable Configuration

In Vercel Dashboard:
1. Go to Project Settings
2. Navigate to "Environment Variables"
3. Add all variables from `.env.example`
   - Mark sensitive variables as "Encrypted"
   - Add both Production and Preview environments

### Domain Configuration

1. Purchase or configure domain (workflo.it)
2. In Vercel, go to Project Settings > Domains
3. Add primary and www subdomain
4. Configure DNS settings with your domain registrar:
   - CNAME: www → cname.vercel-dns.com
   - ALIAS/ANAME: @ → alias.zeit.world

## 🔒 SSL/TLS Configuration

Vercel automatically provisions SSL certificates via Let's Encrypt.

## 🚦 Deployment Workflow

### Continuous Deployment

- Main branch auto-deploys to production
- Feature branches create preview deployments

### Deployment Checks

1. Run pre-deployment checks:
   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```

2. Verify Vercel deployment:
   - Check build logs
   - Test all pages
   - Validate environment variables

## 🛠️ Troubleshooting

### Common Issues

- **Database Connection**: Verify Supabase connection string
- **Authentication Failures**: Check NextAuth and Payload secrets
- **Missing Environment Variables**: Ensure all variables are set
- **Build Errors**: Review build logs, check dependencies

### Rollback Procedure

1. In Vercel Dashboard, select previous deployment
2. Click "Promote to Current Deployment"

## 📊 Monitoring

- Use Vercel Analytics
- Set up Microsoft Clarity
- Configure Google Analytics
- Monitor Supabase database performance

## 🆘 Support

- **Support Email**: tech@workflo.it
- **Staging Environment**: localhost:3000
- **Production URL**: https://workflo.it

---

🚨 **Important**: Always test thoroughly in staging before production deployment!