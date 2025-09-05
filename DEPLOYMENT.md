# Deployment Guide for Workflo IT Services Platform

## Deployment Options

### 1. Vercel Deployment (Recommended)

#### Prerequisites
- GitHub account
- Vercel account
- Project repository on GitHub

#### Steps
1. **Connect Repository**
   - Log in to Vercel
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**
   - Select `new-project` as the root directory
   - Framework Preset: Next.js
   - Node.js version: 20.x

3. **Environment Variables**
   Configure the following environment variables in Vercel:
   ```
   DATABASE_URL=your_postgres_connection_string
   NEXTAUTH_SECRET=generate_a_secure_random_secret
   NEXTAUTH_URL=https://your-production-domain.com
   ANTHROPIC_API_KEY=your_anthropic_key
   OPENAI_API_KEY=your_openai_key
   ANALYTICS_ID=your_google_analytics_id
   ```

4. **Deploy**
   - Vercel will automatically deploy on push to main branch
   - Each PR gets a preview deployment

### 2. Docker Deployment

#### Requirements
- Docker installed
- Docker Compose (optional but recommended)

#### Deployment Steps
1. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with production values
   vim .env
   ```

2. **Docker Image**
   ```bash
   # Building the image
   docker build -t workflo-nextjs .

   # Running the container
   docker run -p 3000:3000 \
     -e DATABASE_URL=postgres://... \
     -e NEXTAUTH_SECRET=... \
     workflo-nextjs
   ```

3. **Docker Compose**
   Use `docker-compose.yml` for multi-container setup:
   ```bash
   docker-compose up -d
   ```

### 3. Supabase Database Deployment

1. **Create Supabase Project**
   - Go to Supabase Dashboard
   - Create a new project
   - Copy connection string

2. **Database Migration**
   ```bash
   npx prisma db push
   npx prisma migrate deploy
   ```

### Continuous Integration

#### GitHub Actions Workflow
Sample workflow for CI/CD:

```yaml
name: CI/Deploy
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:unit
      - run: npm run build
```

### Performance Optimization

1. **Static Optimization**
   - Use `getStaticProps` for static generation
   - Implement Incremental Static Regeneration (ISR)

2. **Image Optimization**
   - Use Next.js Image component
   - Implement lazy loading
   - Use WebP and AVIF formats

3. **Caching Strategies**
   - Implement Redis or Vercel Edge Caching
   - Use `Cache-Control` headers
   - Optimize database queries

### Monitoring & Logging

1. **Sentry Configuration**
   - Add Sentry DSN to environment variables
   - Configure error tracking in `sentry.client.config.ts` and `sentry.server.config.ts`

2. **Performance Monitoring**
   - Google Analytics
   - Microsoft Clarity
   - Uptime Robot for availability checks

### Security Considerations

- Always use HTTPS
- Implement rate limiting
- Keep all dependencies updated
- Regularly audit environment variables
- Use strong, unique secrets

## Troubleshooting

- Check Vercel/Docker logs for deployment issues
- Verify environment variable configuration
- Ensure database migrations are successful
- Test preview deployments thoroughly

---

Happy Deploying! 🚀
