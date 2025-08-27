# Workflo New Project - DevOps Deployment Guide

This comprehensive guide covers all aspects of deploying, monitoring, and maintaining the Workflo New Project infrastructure.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Docker Deployment](#docker-deployment)
5. [Production Deployment](#production-deployment)
6. [Monitoring & Observability](#monitoring--observability)
7. [Rollback Procedures](#rollback-procedures)
8. [Troubleshooting](#troubleshooting)
9. [Security Considerations](#security-considerations)

## Quick Start

### Prerequisites
- Node.js 20+
- Docker and Docker Compose
- Git
- Vercel CLI (for production deployments)

### Initial Setup
```bash
# Clone and setup
git clone <repository-url>
cd new-project
cp .env.example .env.local

# Install dependencies
npm install

# Run development server
npm run dev
```

## Environment Setup

### Environment Variables

Create environment files for each stage:

#### Development (.env.local)
```env
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/workflo_dev
SENTRY_DSN=your-sentry-dsn
```

#### Staging (.env.staging)
```env
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=staging
DATABASE_URL=your-staging-database-url
SENTRY_DSN=your-sentry-dsn
SENTRY_ENVIRONMENT=staging
```

#### Production (.env.production)
```env
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
DATABASE_URL=your-production-database-url
SENTRY_DSN=your-sentry-dsn
SENTRY_ENVIRONMENT=production
```

### Required Secrets

Set these in your deployment platform (Vercel, GitHub Actions):

```env
# Core Application
DATABASE_URL
NEXTAUTH_SECRET
ENCRYPTION_KEY

# Monitoring
SENTRY_DSN
SENTRY_ORG
SENTRY_PROJECT

# External Services  
ANTHROPIC_API_KEY
OPENAI_API_KEY
HUBSPOT_API_KEY

# Analytics
NEXT_PUBLIC_GA_ID
NEXT_PUBLIC_HOTJAR_ID

# Deployment
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID

# Notifications
SLACK_WEBHOOK_URL
```

## Local Development

### Standard Development
```bash
npm run dev
```

### Docker Development
```bash
# Start full development stack
docker-compose --profile dev up

# Start with monitoring
docker-compose --profile dev --profile monitoring up

# View logs
docker-compose logs -f app-dev
```

### Available Services
- **App**: http://localhost:3001 (Docker dev)
- **Database**: localhost:5432
- **Redis**: localhost:6379
- **pgAdmin**: http://localhost:5050
- **Grafana**: http://localhost:3003
- **Prometheus**: http://localhost:9090

## Docker Deployment

### Local Docker Build
```bash
# Build production image
docker build -t workflo/new-project .

# Run production container
docker run -p 3000:3000 workflo/new-project
```

### Docker Compose Production
```bash
# Start production stack
docker-compose --profile production up -d

# Scale application
docker-compose up --scale app=3

# View health status
docker-compose ps
```

### Multi-Environment Setup
```bash
# Development
docker-compose --profile dev up

# Staging  
docker-compose -f docker-compose.yml -f docker-compose.staging.yml up

# Production with monitoring
docker-compose --profile production --profile monitoring up -d
```

## Production Deployment

### Vercel Deployment (Recommended)

#### Automatic Deployment
- Push to `main` branch triggers production deployment
- Push to `develop` branch triggers staging deployment
- Pull requests create preview deployments

#### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Deploy specific branch
vercel --prod --github-branch=main
```

#### Environment Configuration
```bash
# Set environment variables
vercel env add DATABASE_URL production
vercel env add SENTRY_DSN production

# Pull environment variables
vercel env pull .env.local
```

### Self-Hosted Deployment

#### Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml workflo-stack

# Scale services
docker service scale workflo-stack_app=3

# Update service
docker service update --image workflo/new-project:latest workflo-stack_app
```

#### Kubernetes
```bash
# Apply configurations
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -l app=workflo-new-project

# Scale deployment
kubectl scale deployment workflo-new-project --replicas=3

# Rolling update
kubectl set image deployment/workflo-new-project app=workflo/new-project:v2.0.0
```

## Monitoring & Observability

### Health Checks

#### Application Health
```bash
# Basic health check
curl http://localhost:3000/api/health

# Detailed metrics
curl http://localhost:3000/api/metrics
```

#### Service Health
```bash
# Database connection
docker-compose exec db pg_isready -U postgres

# Redis connection  
docker-compose exec redis redis-cli ping

# Application logs
docker-compose logs -f app
```

### Monitoring Stack

#### Grafana Dashboards
- **Application Performance**: Request latency, throughput, error rates
- **Infrastructure**: CPU, memory, disk usage
- **Business Metrics**: User activity, conversion rates
- **Error Tracking**: Error frequency, error types

#### Prometheus Metrics
- Custom application metrics
- Database performance metrics
- System resource metrics
- Business KPIs

#### Sentry Error Tracking
- Real-time error monitoring
- Performance monitoring
- Release tracking
- User session replay

### Alerting

#### Critical Alerts
- Application down (response time > 30s)
- Error rate > 5%
- Database connection failures
- High memory usage (> 90%)

#### Warning Alerts
- Response time > 2s
- Error rate > 1%
- Memory usage > 75%
- Disk space < 20%

#### Notification Channels
- Slack: Real-time alerts
- Email: Critical alerts
- PagerDuty: Incident management
- SMS: Critical system failures

## Rollback Procedures

### Vercel Rollback
```bash
# List recent deployments
vercel list

# Rollback to previous deployment
vercel rollback [deployment-id]

# Promote staging to production
vercel promote [staging-url]
```

### Docker Rollback
```bash
# Rollback to previous image
docker service update --rollback workflo-stack_app

# Manual rollback
docker service update --image workflo/new-project:v1.0.0 workflo-stack_app

# Check rollback status
docker service ps workflo-stack_app
```

### Database Rollback
```bash
# Create backup before deployment
pg_dump -h localhost -U postgres workflo_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql -h localhost -U postgres -d workflo_prod < backup_20231201_120000.sql

# Run database migrations rollback
npm run db:rollback
```

### File System Rollback
```bash
# Backup uploads directory
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz public/uploads/

# Restore uploads
tar -xzf uploads_backup_20231201.tar.gz -C public/
```

## Emergency Procedures

### Complete System Recovery

1. **Assessment Phase**
   ```bash
   # Check system status
   kubectl get pods --all-namespaces
   docker-compose ps
   curl -I https://your-domain.com/api/health
   ```

2. **Isolation Phase**
   ```bash
   # Stop traffic to affected services
   kubectl scale deployment workflo-new-project --replicas=0
   
   # Enable maintenance mode
   kubectl apply -f k8s/maintenance-mode.yml
   ```

3. **Recovery Phase**
   ```bash
   # Restore from last known good backup
   ./scripts/emergency-restore.sh

   # Validate recovery
   npm run test:smoke
   ```

4. **Verification Phase**
   ```bash
   # Gradual traffic restoration
   kubectl scale deployment workflo-new-project --replicas=1
   
   # Monitor metrics
   kubectl logs -f deployment/workflo-new-project
   ```

### Data Recovery Procedures

#### Database Recovery
```bash
# Point-in-time recovery
pg_basebackup -h backup-server -D /recovery -U postgres

# WAL-based recovery
restore_command = 'cp /path/to/archive/%f %p'
recovery_target_time = '2023-12-01 12:00:00'
```

#### File Recovery
```bash
# Restore from S3 backup
aws s3 sync s3://workflo-backups/latest/ ./restore/

# Verify file integrity
find ./restore -name "*.jpg" -exec jpeginfo -c {} \;
```

## Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
docker-compose logs app
kubectl logs deployment/workflo-new-project

# Common fixes
npm install
npm run build
rm -rf .next
```

#### Database Connection Issues
```bash
# Test connection
pg_isready -h localhost -p 5432 -U postgres

# Check connection pool
SELECT count(*) FROM pg_stat_activity;

# Reset connections
docker-compose restart db
```

#### Performance Issues
```bash
# Check resource usage
docker stats
kubectl top pods

# Profile application
npm run build
npm run analyze

# Check database performance
SELECT query, calls, total_time FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

### Debugging Tools

#### Application Debugging
```bash
# Enable debug mode
DEBUG=* npm run dev

# Profile memory usage
node --inspect npm run dev

# Analyze bundle size
npm run bundle-analyzer
```

#### Infrastructure Debugging
```bash
# Container debugging
docker exec -it container-name /bin/sh
kubectl exec -it pod-name -- /bin/sh

# Network debugging
docker network ls
kubectl get services

# Storage debugging
docker volume ls
kubectl get pv,pvc
```

## Security Considerations

### Deployment Security

#### Environment Variables
- Never commit secrets to version control
- Use secure secret management (Vercel Secrets, Kubernetes Secrets)
- Rotate secrets regularly (90-day cycle)
- Use different secrets for each environment

#### Container Security
```bash
# Scan images for vulnerabilities
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image workflo/new-project

# Run with non-root user
USER nextjs

# Use read-only root filesystem
--read-only
```

#### Network Security
- Use HTTPS only in production
- Implement proper CORS policies
- Use Web Application Firewall (WAF)
- Regular security scanning

### Access Control

#### Deployment Access
- Multi-factor authentication required
- Role-based access control
- Audit logging for all deployments
- Separate staging/production access

#### Database Access
- Encrypted connections (SSL/TLS)
- Network isolation (VPC/private subnets)
- Regular access review
- Database activity monitoring

## Maintenance Procedures

### Regular Maintenance

#### Daily
- Monitor error rates and performance metrics
- Check backup integrity
- Review security alerts
- Monitor resource usage

#### Weekly
- Update dependencies (security patches)
- Clean up old deployments
- Review monitoring alerts
- Database maintenance tasks

#### Monthly
- Security vulnerability assessment
- Performance review and optimization
- Backup and recovery testing
- Documentation updates

### Planned Maintenance

#### Maintenance Window Procedures
1. **Pre-maintenance** (T-24h)
   - Notify users of maintenance window
   - Create system backup
   - Prepare rollback plan

2. **During maintenance** (T-0h)
   - Enable maintenance mode
   - Perform updates
   - Run validation tests

3. **Post-maintenance** (T+1h)
   - Disable maintenance mode
   - Monitor system health
   - Send completion notification

## Support Contacts

### Emergency Contacts
- **Primary On-Call**: +31-XXX-XXXXXXX
- **Secondary On-Call**: +31-XXX-XXXXXXX
- **Escalation Manager**: escalation@workflo.it

### Vendor Support
- **Vercel Support**: vercel.com/support
- **Sentry Support**: sentry.io/support
- **Database Support**: [provider-support]

### Internal Team
- **DevOps Lead**: devops@workflo.it
- **Development Lead**: dev@workflo.it
- **Infrastructure Team**: infrastructure@workflo.it

---

**Last Updated**: 2024-01-20  
**Document Version**: 1.0  
**Review Cycle**: Monthly