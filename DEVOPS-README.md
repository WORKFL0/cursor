# DevOps Infrastructure for Workflo New Project

## Overview

Complete DevOps infrastructure setup with CI/CD, monitoring, and deployment automation for the Workflo New Project. This setup prioritizes automation, reliability, and observability while maintaining simplicity and maintainability.

## 🚀 Quick Start

```bash
# Initial setup
./scripts/setup.sh

# Start development environment
npm run dev

# Or start full Docker stack
docker-compose --profile dev up
```

## 📋 What's Included

### 1. CI/CD Pipeline
- **GitHub Actions workflows** for automated testing and deployment
- **Multi-stage pipeline**: code quality, testing, building, security scanning
- **Environment-specific deployments** (dev, staging, production)
- **Automated rollback** capabilities

### 2. Development Environment
- **Pre-commit hooks** with Husky for code quality enforcement
- **Automated testing** with Jest (unit) and Playwright (E2E)
- **Docker Compose** setup for local development with database and cache
- **Hot reload** and live debugging support

### 3. Container Infrastructure
- **Multi-stage Dockerfiles** optimized for production (<100MB)
- **Security-hardened containers** with non-root users
- **Health checks** and proper signal handling
- **Development and production** container variants

### 4. Monitoring & Observability
- **Sentry integration** for error tracking and performance monitoring
- **Custom monitoring system** with uptime and performance metrics
- **Prometheus metrics** endpoint for detailed monitoring
- **Grafana dashboards** for visualization
- **Health check endpoints** for load balancer integration

### 5. Environment Management
- **Environment-specific configurations** (dev, staging, production)
- **Secure secrets management** with validation
- **Feature flags** and configuration utilities
- **Environment variable templates** and validation

### 6. Performance Optimization
- **Bundle size monitoring** with automated analysis
- **Lighthouse CI integration** for performance auditing
- **Core Web Vitals tracking** with strict thresholds
- **Resource optimization** recommendations

### 7. Deployment Automation
- **Multi-platform deployment** (Vercel, Docker, Kubernetes)
- **Automated health checks** post-deployment
- **Rollback procedures** with version tracking
- **Deployment notifications** (Slack integration)

## 🛠 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │     Staging     │    │   Production    │
│                 │    │                 │    │                 │
│ • Local Docker  │    │ • Vercel Preview│    │ • Vercel Pro    │
│ • Hot Reload    │    │ • Full Testing  │    │ • Monitoring    │
│ • Debug Tools   │    │ • Performance   │    │ • Alerting      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   CI/CD Pipeline │
                    │                 │
                    │ • GitHub Actions│
                    │ • Automated Tests│
                    │ • Security Scans │
                    │ • Bundle Analysis│
                    └─────────────────┘
```

### Monitoring Stack

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Application   │───▶│   Monitoring    │───▶│   Alerting      │
│                 │    │                 │    │                 │
│ • Custom Metrics│    │ • Prometheus    │    │ • Slack         │
│ • Health Checks │    │ • Grafana       │    │ • Email         │
│ • Error Tracking│    │ • Sentry        │    │ • PagerDuty     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 File Structure

```
├── .github/
│   └── workflows/
│       ├── ci.yml              # Main CI/CD pipeline
│       └── bundle-size.yml     # Bundle analysis
├── .husky/
│   ├── pre-commit             # Pre-commit hooks
│   └── commit-msg             # Commit message validation
├── config/
│   ├── environments/          # Environment configurations
│   │   ├── development.ts
│   │   ├── staging.ts
│   │   └── production.ts
│   └── index.ts              # Configuration manager
├── monitoring/
│   ├── grafana/              # Grafana configurations
│   └── prometheus/           # Prometheus configurations
├── scripts/
│   ├── setup.sh              # Initial setup script
│   ├── deploy.sh             # Deployment script
│   ├── health-check.sh       # Health monitoring
│   └── analyze-bundle.js     # Bundle analysis
├── tests/
│   ├── setup/                # Test configuration
│   ├── unit/                 # Unit tests
│   └── e2e/                  # End-to-end tests
├── docker-compose.yml        # Docker services
├── Dockerfile               # Production container
├── Dockerfile.dev          # Development container
├── sentry.*.config.ts      # Sentry configurations
└── DEVOPS-DEPLOYMENT-GUIDE.md
```

## 🔧 Configuration

### Environment Variables

Set these for each environment:

```bash
# Core
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...

# Monitoring
SENTRY_DSN=https://...
NEXT_PUBLIC_SENTRY_DSN=https://...

# Deployment
VERCEL_TOKEN=...
VERCEL_ORG_ID=...
VERCEL_PROJECT_ID=...
```

### GitHub Secrets

Required secrets in GitHub repository:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID` 
- `VERCEL_PROJECT_ID`
- `SENTRY_AUTH_TOKEN`
- `SLACK_WEBHOOK_URL`

## 🚀 Deployment

### Automatic Deployment

- **Production**: Push to `main` branch
- **Staging**: Push to `develop` branch
- **Preview**: Open pull request

### Manual Deployment

```bash
# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production

# Dry run
./scripts/deploy.sh --dry-run production

# Rollback
./scripts/deploy.sh --rollback v1.0.0 production
```

### Docker Deployment

```bash
# Local production testing
docker-compose --profile production up

# With monitoring
docker-compose --profile production --profile monitoring up
```

## 📊 Monitoring

### Health Checks

```bash
# Application health
curl http://localhost:3000/api/health

# Detailed metrics
curl http://localhost:3000/api/metrics

# System health check
./scripts/health-check.sh
```

### Monitoring URLs

- **Grafana**: http://localhost:3003 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Uptime Kuma**: http://localhost:3004

### Performance Monitoring

```bash
# Bundle analysis
npm run analyze

# Lighthouse audit
npm run lighthouse

# Performance testing
npm run test:performance
```

## 🧪 Testing

### Test Types

```bash
# Unit tests
npm run test:unit

# End-to-end tests
npm run test:e2e

# All tests
npm run test

# Coverage report
npm run test:coverage
```

### CI Pipeline Tests

- TypeScript type checking
- ESLint code quality
- Unit test suite
- E2E test suite (critical paths)
- Bundle size validation
- Security vulnerability scan
- Performance audit

## 🔒 Security

### Security Features

- **Container security**: Non-root user, read-only filesystem
- **Dependency scanning**: Automated vulnerability detection
- **Secret management**: Environment-based secrets
- **HTTPS enforcement**: Security headers and SSL
- **Access control**: Role-based deployment permissions

### Security Checks

```bash
# Dependency audit
npm audit

# Container scan
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image workflo/new-project

# Security headers test
curl -I https://your-domain.com
```

## 🛟 Troubleshooting

### Common Issues

1. **Build failures**: Check Node.js version and dependencies
2. **Docker issues**: Ensure Docker daemon is running
3. **Database connection**: Verify DATABASE_URL and network access
4. **Deployment failures**: Check environment variables and secrets

### Debug Commands

```bash
# Check application logs
docker-compose logs -f app

# Database connection test
docker-compose exec db pg_isready

# Redis connection test
docker-compose exec redis redis-cli ping

# Full health check
./scripts/health-check.sh
```

### Performance Issues

```bash
# Analyze bundle size
npm run analyze

# Check memory usage
docker stats

# Profile application
NODE_OPTIONS="--inspect" npm run dev
```

## 📚 Documentation

- **[Deployment Guide](./DEVOPS-DEPLOYMENT-GUIDE.md)**: Comprehensive deployment procedures
- **[API Documentation](./api-docs.md)**: API endpoints and usage
- **[Monitoring Guide](./monitoring-guide.md)**: Monitoring and alerting setup

## 🤝 Contributing

1. **Setup**: Run `./scripts/setup.sh`
2. **Development**: Use `npm run dev` or `docker-compose --profile dev up`
3. **Testing**: All tests must pass before PR
4. **Deployment**: Automatic on merge to main/develop

### Code Quality Standards

- **TypeScript**: Strict mode enabled
- **Testing**: 80% coverage minimum
- **Performance**: Core Web Vitals compliance
- **Security**: No high/critical vulnerabilities
- **Documentation**: Update for significant changes

## 📞 Support

- **Development Team**: dev@workflo.it
- **DevOps Team**: devops@workflo.it
- **Emergency Contact**: +31-XXX-XXXXXXX

---

**Version**: 1.0  
**Last Updated**: 2024-01-20  
**Maintained by**: Workflo DevOps Team