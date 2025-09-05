# DevOps Setup Guide - Workflo New Project

This comprehensive guide covers the complete DevOps setup for the Workflo New Project, including staging environments, CI/CD pipelines, Docker configurations, and branch protection strategies.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Development Workflow                     │
├─────────────────────────────────────────────────────────────┤
│  Feature Branch → Staging → Production                      │
│       ↓             ↓           ↓                          │
│   Local Tests   → Staging    → Production                   │
│   Pre-commit    → Environment → Environment                 │
│   Hooks         → Tests      → Deployment                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Stack                       │
├─────────────────────────────────────────────────────────────┤
│  GitHub Actions CI/CD                                      │
│  Docker & Docker Compose                                   │
│  PostgreSQL + Redis                                        │
│  Nginx (Reverse Proxy)                                     │
│  Monitoring (Prometheus + Grafana + Loki)                  │
│  Security (Trivy + CodeQL + Dependabot)                    │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git
- GitHub CLI (optional but recommended)

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd new-project

# Install dependencies
npm ci

# Copy environment file
cp .env.example .env.local

# Initialize Husky hooks
npm run postinstall

# Start development environment
docker-compose --profile dev up -d
```

## 📋 Table of Contents

1. [Environment Configuration](#environment-configuration)
2. [Staging Environment](#staging-environment)
3. [CI/CD Pipeline](#cicd-pipeline)
4. [Docker Setup](#docker-setup)
5. [Pre-commit Hooks](#pre-commit-hooks)
6. [Branch Protection](#branch-protection)
7. [Monitoring & Observability](#monitoring--observability)
8. [Security](#security)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

## 🔧 Environment Configuration

### Environment Files
- `.env.local` - Local development (not committed)
- `.env.example` - Template with dummy values
- `.env.staging` - Staging configuration template

### Required Environment Variables

#### Database
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### Authentication
```env
NEXTAUTH_SECRET=your_nextauth_secret_minimum_32_characters
NEXTAUTH_URL=http://localhost:3000
```

#### External Services
```env
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
SENTRY_DSN=your_sentry_dsn
RESEND_API_KEY=your_resend_api_key
```

### GitHub Secrets Setup
Configure these secrets in your GitHub repository settings:

#### Production Secrets
```
VERCEL_TOKEN=your_vercel_deployment_token
VERCEL_ORG_ID=your_vercel_organization_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

#### Staging Secrets
```
STAGING_DATABASE_URL=staging_postgresql_connection
STAGING_SUPABASE_URL=staging_supabase_url
STAGING_SUPABASE_ANON_KEY=staging_supabase_anon_key
STAGING_SUPABASE_SERVICE_ROLE_KEY=staging_service_role_key
STAGING_NEXTAUTH_SECRET=staging_nextauth_secret
STAGING_NEXTAUTH_URL=https://staging.workflo.it
```

#### Optional Integrations
```
SLACK_WEBHOOK_URL=your_slack_webhook_for_notifications
LHCI_GITHUB_APP_TOKEN=lighthouse_ci_token
LHCI_SERVER_BASE_URL=lighthouse_ci_server
LHCI_TOKEN=lighthouse_ci_build_token
```

## 🎭 Staging Environment

### Branch Strategy
- `main` → Production
- `staging` → Staging environment
- `feature/*` → Development branches

### Staging Deployment
The staging environment is automatically deployed when code is pushed to the `staging` branch.

#### Manual Staging Deployment
```bash
# Create and push to staging branch
git checkout -b staging
git push -u origin staging

# Or merge feature to staging
git checkout staging
git merge feature/your-feature
git push origin staging
```

#### Staging URLs
- **Main staging:** https://staging.workflo.it
- **PR previews:** https://pr-{number}.workflo.it

### Staging Environment Features
- Automatic deployment on `staging` branch push
- PR preview deployments
- Smoke tests after deployment
- Slack notifications
- Environment-specific configurations

## 🔄 CI/CD Pipeline

### Workflow Overview
The CI/CD pipeline consists of multiple workflows:

#### 1. Main CI/CD Pipeline (`.github/workflows/ci.yml`)
Runs on every push and PR to `main` and `develop`:

```yaml
jobs:
  - quality        # TypeScript, ESLint, Prettier, Security audit
  - test          # Unit tests, E2E tests  
  - build         # Build verification, Bundle analysis
  - docker        # Docker build, Vulnerability scanning
  - lighthouse    # Performance audit (PRs only)
  - deploy-production  # Production deployment (main branch)
  - deploy-staging     # Staging deployment (develop branch)
  - notify        # Slack notifications
```

#### 2. Staging Pipeline (`.github/workflows/staging.yml`)
Dedicated staging workflow:

```yaml
jobs:
  - staging-quality    # Quality checks for staging
  - staging-build     # Build for staging environment
  - staging-tests     # Staging-specific tests
  - deploy-staging    # Deploy to staging
  - deploy-preview    # PR preview deployment
  - staging-smoke-tests # Post-deployment verification
  - notify-staging    # Staging notifications
```

### Status Checks
All branches require these status checks to pass:
- Code quality (TypeScript, ESLint, Prettier)
- Security audit and vulnerability scanning
- Unit and integration tests
- Build verification
- Docker security scan
- Performance audit (for PRs)

### Pipeline Features
- ✅ Parallel job execution for faster builds
- ✅ Comprehensive test coverage reporting
- ✅ Security vulnerability scanning (Trivy + CodeQL)
- ✅ Performance monitoring (Lighthouse CI)
- ✅ Bundle size analysis
- ✅ Multi-architecture Docker builds
- ✅ Automated dependency updates (Dependabot)
- ✅ Slack/Teams notifications

## 🐳 Docker Setup

### Local Development
```bash
# Start all services with development profile
docker-compose --profile dev up -d

# Start monitoring stack
docker-compose --profile monitoring up -d

# View logs
docker-compose logs -f app
```

### Available Profiles
- **Default:** Core application services (app, db, redis)
- **dev:** Development tools (pgAdmin, Redis Commander)
- **monitoring:** Observability stack (Grafana, Prometheus, Loki)
- **production:** Production services (Nginx, SSL)

### Services Overview

#### Core Services
- **app:** Next.js application (port 3000)
- **db:** PostgreSQL database (port 5432)
- **redis:** Redis cache (port 6379)

#### Development Tools
- **pgadmin:** Database administration (port 5050)
- **redis-commander:** Redis management (port 8081)

#### Monitoring Stack
- **grafana:** Monitoring dashboard (port 3003)
- **prometheus:** Metrics collection (port 9090)
- **loki:** Log aggregation (port 3100)
- **uptime-kuma:** Uptime monitoring (port 3004)

#### Production Services
- **nginx:** Reverse proxy (ports 80, 443)
- **watchtower:** Automated updates

### Docker Commands
```bash
# Build and start services
docker-compose up --build -d

# Stop all services
docker-compose down

# View service status
docker-compose ps

# Follow logs
docker-compose logs -f [service_name]

# Restart a service
docker-compose restart [service_name]

# Clean up
docker-compose down -v  # Remove volumes
docker system prune -a  # Clean Docker cache
```

## 🪝 Pre-commit Hooks

### Configured Hooks
1. **pre-commit:** Runs before each commit
   - lint-staged (ESLint, Prettier on changed files)
   - TypeScript type checking
   - Unit tests
   - Build verification

2. **commit-msg:** Validates commit message format
   - Enforces Conventional Commits format
   - Examples: `feat:`, `fix:`, `docs:`, `chore:`

3. **pre-push:** Runs before pushing to remote
   - Comprehensive test suite
   - Security audit
   - Secret scanning
   - Build verification for protected branches
   - Bundle size analysis

### Hook Commands
```bash
# Manual hook execution
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript checks
npm run test:unit   # Run unit tests
npm run build       # Build project

# Skip hooks (emergency only)
git commit --no-verify
git push --no-verify
```

## 🛡️ Branch Protection

### Protection Rules
See [BRANCH_PROTECTION_GUIDE.md](./BRANCH_PROTECTION_GUIDE.md) for detailed configuration.

#### Main Branch
- Requires 2 approvals
- All status checks must pass
- Requires up-to-date branches
- Dismisses stale reviews
- Requires conversation resolution
- Linear history required
- Signed commits required

#### Staging Branch
- Requires 1 approval
- Basic status checks required
- Requires up-to-date branches

### Code Owners
The `.github/CODEOWNERS` file defines review requirements:
- Global owners for all changes
- Specific owners for critical files
- Team-based ownership for different areas

## 📊 Monitoring & Observability

### Monitoring Stack
Access the monitoring services at:
- **Grafana:** http://localhost:3003 (admin/admin)
- **Prometheus:** http://localhost:9090
- **Uptime Kuma:** http://localhost:3004

### Key Metrics
- Application performance
- Database health
- API response times
- Error rates
- Resource utilization

### Logging
- Structured JSON logging
- Centralized log aggregation with Loki
- Log levels: ERROR, WARN, INFO, DEBUG
- Request/response logging

### Alerting
- Prometheus alerting rules
- Slack/Teams integration
- Email notifications
- PagerDuty integration (production)

## 🔒 Security

### Security Measures
1. **Vulnerability Scanning**
   - Dependency scanning (npm audit, Dependabot)
   - Container scanning (Trivy)
   - Code analysis (CodeQL)

2. **Secret Management**
   - Environment variables for secrets
   - GitHub Secrets for CI/CD
   - Pre-commit hook secret scanning

3. **Access Control**
   - Branch protection rules
   - Required code reviews
   - Team-based permissions

4. **Runtime Security**
   - Non-root Docker containers
   - Minimal base images
   - Regular security updates

### Security Best Practices
- Never commit secrets to version control
- Use environment variables for configuration
- Regularly update dependencies
- Enable automated security scanning
- Review security alerts promptly

## 🚀 Deployment

### Deployment Environments

#### Production
- **URL:** https://workflo.vercel.app
- **Branch:** `main`
- **Auto-deploy:** Yes, on push to main
- **Approval:** Required (2 reviewers)

#### Staging
- **URL:** https://staging.workflo.it
- **Branch:** `staging`
- **Auto-deploy:** Yes, on push to staging
- **Approval:** Required (1 reviewer)

#### Preview
- **URL:** Generated per PR
- **Trigger:** Pull requests
- **Auto-deploy:** Yes, on PR creation/update

### Deployment Process
1. Create feature branch from `main`
2. Develop and test locally
3. Push feature branch (triggers CI checks)
4. Create PR to `staging` (triggers preview deployment)
5. Review and merge to `staging` (triggers staging deployment)
6. Test in staging environment
7. Create PR from `staging` to `main`
8. Review and merge to `main` (triggers production deployment)

### Rollback Procedure
```bash
# Option 1: Revert commit
git revert <commit-hash>
git push origin main

# Option 2: Redeploy previous version
# Via Vercel dashboard or CLI
vercel rollback <deployment-url>
```

## 🔍 Troubleshooting

### Common Issues

#### CI/CD Pipeline Failures
```bash
# Check workflow logs in GitHub Actions
# Common fixes:
npm ci              # Dependency issues
npm run type-check  # TypeScript errors
npm run lint        # ESLint errors
npm run build       # Build errors
```

#### Docker Issues
```bash
# Container not starting
docker-compose logs <service-name>

# Database connection issues
docker-compose exec db psql -U postgres -d workflo_dev

# Port conflicts
docker-compose down
lsof -ti:3000 | xargs kill -9  # Kill processes on port 3000
```

#### Environment Issues
```bash
# Environment variables not loading
cp .env.example .env.local
# Edit .env.local with correct values

# Database schema issues
docker-compose exec db psql -U postgres -d workflo_dev -f /docker-entrypoint-initdb.d/init-db.sql
```

#### Pre-commit Hook Issues
```bash
# Hooks not running
npx husky install

# Hook permissions
chmod +x .husky/pre-commit .husky/commit-msg .husky/pre-push

# Skip hooks temporarily (emergency only)
git commit --no-verify
```

### Getting Help
1. Check GitHub Actions logs
2. Review Docker service logs
3. Consult team documentation
4. Contact DevOps team
5. Create issue in repository

## 📝 Maintenance

### Regular Tasks
- **Weekly:** Review Dependabot PRs
- **Monthly:** Update base Docker images
- **Quarterly:** Review branch protection rules
- **Bi-annually:** Security audit and penetration testing

### Monitoring Health
- Monitor CI/CD pipeline success rates
- Review deployment frequency and lead time
- Track mean time to recovery (MTTR)
- Analyze security scan results

## 🔗 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

**Maintained by:** Workflo DevOps Team  
**Last Updated:** 2025-09-04  
**Next Review:** 2025-12-04

For questions or issues, please contact the DevOps team or create an issue in this repository.