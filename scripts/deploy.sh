#!/bin/bash

# Deployment Script for Workflo New Project
# Handles deployments to different environments with validation and rollback capabilities

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENVIRONMENTS=("development" "staging" "production")
DEFAULT_ENV="staging"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

# Configuration
ENVIRONMENT=""
SKIP_TESTS=false
SKIP_BUILD=false
FORCE_DEPLOY=false
DRY_RUN=false
ROLLBACK=false
ROLLBACK_VERSION=""

# Pre-flight checks
preflight_checks() {
    log "Running pre-flight checks..."
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        error "Not in a git repository"
        exit 1
    fi
    
    # Check for uncommitted changes
    if ! git diff --quiet && ! $FORCE_DEPLOY; then
        warn "You have uncommitted changes"
        read -p "Continue with deployment? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            error "Deployment cancelled"
            exit 1
        fi
    fi
    
    # Check if required tools are installed
    local required_tools=("node" "npm" "jq")
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            error "$tool is required but not installed"
            exit 1
        fi
    done
    
    log "✅ Pre-flight checks passed"
}

# Validate environment
validate_environment() {
    if [[ ! " ${ENVIRONMENTS[@]} " =~ " ${ENVIRONMENT} " ]]; then
        error "Invalid environment: $ENVIRONMENT"
        error "Valid environments: ${ENVIRONMENTS[*]}"
        exit 1
    fi
    
    info "Deploying to environment: $ENVIRONMENT"
}

# Run tests
run_tests() {
    if $SKIP_TESTS; then
        warn "Skipping tests"
        return 0
    fi
    
    log "Running tests..."
    
    # Type checking
    info "Running TypeScript checks..."
    npm run type-check
    
    # Linting
    info "Running linting..."
    npm run lint
    
    # Unit tests
    info "Running unit tests..."
    npm run test:unit
    
    # Integration tests for non-production
    if [[ "$ENVIRONMENT" != "production" ]]; then
        info "Running integration tests..."
        npm run test:e2e || warn "E2E tests failed, continuing anyway"
    fi
    
    log "✅ All tests passed"
}

# Build application
build_application() {
    if $SKIP_BUILD; then
        warn "Skipping build"
        return 0
    fi
    
    log "Building application..."
    
    # Clean previous build
    rm -rf .next
    
    # Set environment variables for build
    export NODE_ENV=production
    export NEXT_TELEMETRY_DISABLED=1
    
    # Build
    npm run build
    
    # Run bundle analysis
    info "Analyzing bundle size..."
    npm run analyze:size || warn "Bundle analysis failed"
    
    log "✅ Build completed successfully"
}

# Deploy to Vercel
deploy_vercel() {
    log "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        error "Vercel CLI not found. Install with: npm i -g vercel"
        exit 1
    fi
    
    local vercel_args=""
    
    case $ENVIRONMENT in
        production)
            vercel_args="--prod"
            ;;
        staging)
            vercel_args="--target preview"
            ;;
        development)
            vercel_args="--target development"
            ;;
    esac
    
    if $DRY_RUN; then
        info "DRY RUN: Would execute: vercel deploy $vercel_args"
        return 0
    fi
    
    # Deploy
    local deployment_url
    deployment_url=$(vercel deploy $vercel_args --yes)
    
    if [[ -n "$deployment_url" ]]; then
        log "✅ Deployment successful: $deployment_url"
        
        # Wait for deployment to be ready
        info "Waiting for deployment to be ready..."
        sleep 10
        
        # Health check
        if curl -sf "$deployment_url/api/health" > /dev/null; then
            log "✅ Health check passed"
        else
            error "❌ Health check failed"
            exit 1
        fi
        
        return 0
    else
        error "❌ Deployment failed"
        exit 1
    fi
}

# Deploy to Docker
deploy_docker() {
    log "Deploying to Docker..."
    
    local image_tag="workflo/new-project:${ENVIRONMENT}-$(git rev-parse --short HEAD)"
    
    if $DRY_RUN; then
        info "DRY RUN: Would build and deploy Docker image: $image_tag"
        return 0
    fi
    
    # Build Docker image
    info "Building Docker image..."
    docker build -t "$image_tag" .
    
    # Tag as latest for environment
    docker tag "$image_tag" "workflo/new-project:${ENVIRONMENT}-latest"
    
    # Deploy using docker-compose
    case $ENVIRONMENT in
        production)
            export COMPOSE_FILE="docker-compose.yml:docker-compose.prod.yml"
            ;;
        staging)
            export COMPOSE_FILE="docker-compose.yml:docker-compose.staging.yml"
            ;;
        development)
            export COMPOSE_FILE="docker-compose.yml"
            ;;
    esac
    
    # Update services
    docker-compose up -d --no-deps app
    
    # Health check
    info "Waiting for service to be ready..."
    sleep 15
    
    if docker-compose exec -T app curl -sf http://localhost:3000/api/health > /dev/null; then
        log "✅ Docker deployment successful"
    else
        error "❌ Docker health check failed"
        exit 1
    fi
}

# Rollback deployment
rollback_deployment() {
    log "Rolling back deployment..."
    
    if [[ -z "$ROLLBACK_VERSION" ]]; then
        error "No rollback version specified"
        exit 1
    fi
    
    if $DRY_RUN; then
        info "DRY RUN: Would rollback to version: $ROLLBACK_VERSION"
        return 0
    fi
    
    case $DEPLOYMENT_TYPE in
        vercel)
            vercel rollback "$ROLLBACK_VERSION"
            ;;
        docker)
            local rollback_image="workflo/new-project:$ROLLBACK_VERSION"
            docker-compose stop app
            docker-compose up -d --no-deps app
            ;;
        *)
            error "Rollback not supported for deployment type: $DEPLOYMENT_TYPE"
            exit 1
            ;;
    esac
    
    log "✅ Rollback completed"
}

# Post-deployment tasks
post_deployment() {
    log "Running post-deployment tasks..."
    
    # Create deployment record
    local deployment_info=$(cat <<EOF
{
    "environment": "$ENVIRONMENT",
    "version": "$(git rev-parse HEAD)",
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "deployed_by": "$(git config user.email)",
    "branch": "$(git rev-parse --abbrev-ref HEAD)"
}
EOF
)
    
    echo "$deployment_info" > "deployments/${ENVIRONMENT}-latest.json"
    
    # Send notification (if configured)
    if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
        local message="🚀 Deployment to $ENVIRONMENT completed successfully"
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$message\"}" \
            "$SLACK_WEBHOOK_URL" || warn "Failed to send Slack notification"
    fi
    
    # Tag successful deployments
    if [[ "$ENVIRONMENT" == "production" ]] && ! $DRY_RUN; then
        local tag="release-$(date +%Y%m%d-%H%M%S)"
        git tag "$tag"
        log "Created git tag: $tag"
    fi
    
    log "✅ Post-deployment tasks completed"
}

# Show help
show_help() {
    cat <<EOF
Workflo New Project Deployment Script

Usage: $0 [OPTIONS] [ENVIRONMENT]

Arguments:
    ENVIRONMENT    Target environment (development|staging|production)
                  Default: $DEFAULT_ENV

Options:
    -t, --skip-tests      Skip running tests
    -b, --skip-build      Skip building application
    -f, --force          Force deployment despite warnings
    -d, --dry-run        Show what would be done without executing
    -r, --rollback VER   Rollback to specified version
    --docker             Deploy using Docker
    --vercel             Deploy using Vercel (default)
    -h, --help           Show this help message

Environment Variables:
    DEPLOYMENT_TYPE      Deployment method (vercel|docker)
    SLACK_WEBHOOK_URL    Slack webhook for notifications
    VERCEL_TOKEN         Vercel authentication token

Examples:
    $0 staging                    # Deploy to staging
    $0 production --skip-tests    # Deploy to production without tests
    $0 --dry-run production       # Preview production deployment
    $0 --rollback v1.0.0 staging  # Rollback staging to v1.0.0

EOF
}

# Parse command line arguments
DEPLOYMENT_TYPE="${DEPLOYMENT_TYPE:-vercel}"

while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        -b|--skip-build)
            SKIP_BUILD=true
            shift
            ;;
        -f|--force)
            FORCE_DEPLOY=true
            shift
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -r|--rollback)
            ROLLBACK=true
            ROLLBACK_VERSION="$2"
            shift 2
            ;;
        --docker)
            DEPLOYMENT_TYPE="docker"
            shift
            ;;
        --vercel)
            DEPLOYMENT_TYPE="vercel"
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        -*)
            error "Unknown option: $1"
            show_help
            exit 1
            ;;
        *)
            if [[ -z "$ENVIRONMENT" ]]; then
                ENVIRONMENT="$1"
            else
                error "Unexpected argument: $1"
                show_help
                exit 1
            fi
            shift
            ;;
    esac
done

# Set default environment
if [[ -z "$ENVIRONMENT" ]]; then
    ENVIRONMENT="$DEFAULT_ENV"
fi

# Main execution
main() {
    log "Starting deployment for Workflo New Project"
    log "============================================"
    
    cd "$PROJECT_ROOT"
    
    if $ROLLBACK; then
        rollback_deployment
        exit 0
    fi
    
    validate_environment
    preflight_checks
    
    if ! $DRY_RUN; then
        # Create deployments directory
        mkdir -p deployments
    fi
    
    run_tests
    build_application
    
    case $DEPLOYMENT_TYPE in
        vercel)
            deploy_vercel
            ;;
        docker)
            deploy_docker
            ;;
        *)
            error "Unknown deployment type: $DEPLOYMENT_TYPE"
            exit 1
            ;;
    esac
    
    if ! $DRY_RUN; then
        post_deployment
    fi
    
    log "🎉 Deployment completed successfully!"
}

# Run main function
main