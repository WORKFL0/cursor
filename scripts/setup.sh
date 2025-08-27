#!/bin/bash

# Quick Setup Script for Workflo New Project
# Sets up development environment with all necessary dependencies

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${GREEN}[SETUP]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[SETUP] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[SETUP] ERROR:${NC} $1"
}

info() {
    echo -e "${BLUE}[SETUP] INFO:${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Node.js version
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge 18 ]; then
            log "✅ Node.js $(node -v) is installed"
        else
            error "❌ Node.js 18+ is required. Current version: $(node -v)"
            exit 1
        fi
    else
        error "❌ Node.js is not installed"
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        log "✅ npm $(npm -v) is installed"
    else
        error "❌ npm is not installed"
        exit 1
    fi
    
    # Check Git
    if command -v git &> /dev/null; then
        log "✅ Git $(git --version | cut -d' ' -f3) is installed"
    else
        error "❌ Git is not installed"
        exit 1
    fi
    
    # Check Docker (optional)
    if command -v docker &> /dev/null; then
        log "✅ Docker $(docker --version | cut -d' ' -f3 | cut -d',' -f1) is installed"
        DOCKER_AVAILABLE=true
    else
        warn "⚠️ Docker is not installed (optional for full development stack)"
        DOCKER_AVAILABLE=false
    fi
}

# Setup environment files
setup_environment() {
    log "Setting up environment configuration..."
    
    if [ ! -f .env.local ]; then
        if [ -f .env.example ]; then
            cp .env.example .env.local
            log "✅ Created .env.local from .env.example"
            warn "Please update .env.local with your actual configuration values"
        else
            error "❌ .env.example not found"
            exit 1
        fi
    else
        log "✅ .env.local already exists"
    fi
}

# Install dependencies
install_dependencies() {
    log "Installing project dependencies..."
    
    # Clean install
    if [ -d node_modules ]; then
        info "Cleaning existing node_modules..."
        rm -rf node_modules package-lock.json
    fi
    
    npm ci
    log "✅ Dependencies installed successfully"
}

# Setup development tools
setup_dev_tools() {
    log "Setting up development tools..."
    
    # Initialize Husky
    if [ -d .git ]; then
        npx husky
        log "✅ Husky git hooks initialized"
    else
        warn "⚠️ Not in a git repository, skipping Husky setup"
    fi
    
    # Setup Playwright browsers
    if command -v npx &> /dev/null; then
        info "Installing Playwright browsers..."
        npx playwright install --with-deps
        log "✅ Playwright browsers installed"
    fi
}

# Setup Docker development stack
setup_docker() {
    if [ "$DOCKER_AVAILABLE" = true ]; then
        log "Setting up Docker development stack..."
        
        # Check if docker-compose is available
        if command -v docker-compose &> /dev/null; then
            # Pull images
            info "Pulling Docker images..."
            docker-compose pull
            
            # Create volumes
            info "Creating Docker volumes..."
            docker-compose up --no-start
            
            log "✅ Docker development stack ready"
            info "Use 'docker-compose --profile dev up' to start development services"
        else
            warn "⚠️ docker-compose not found, skipping Docker setup"
        fi
    fi
}

# Run initial build and tests
run_initial_tests() {
    log "Running initial build and tests..."
    
    # Type checking
    info "Running TypeScript checks..."
    npm run type-check
    
    # Linting
    info "Running ESLint..."
    npm run lint
    
    # Build application
    info "Building application..."
    npm run build
    
    # Run tests
    info "Running unit tests..."
    npm run test:unit
    
    log "✅ Initial build and tests completed successfully"
}

# Setup IDE configuration
setup_ide() {
    log "Setting up IDE configuration..."
    
    # VS Code settings
    if [ ! -d .vscode ]; then
        mkdir -p .vscode
    fi
    
    # Create VS Code settings if they don't exist
    if [ ! -f .vscode/settings.json ]; then
        cat > .vscode/settings.json <<EOF
{
  "typescript.preferences.defaultQuoteStyle": "single",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "typescriptreact",
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
EOF
        log "✅ VS Code settings created"
    fi
    
    # Create launch configuration
    if [ ! -f .vscode/launch.json ]; then
        cat > .vscode/launch.json <<EOF
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Next.js",
      "type": "node",
      "request": "launch",
      "program": "\${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"],
      "env": {
        "NODE_OPTIONS": "--inspect"
      }
    }
  ]
}
EOF
        log "✅ VS Code debug configuration created"
    fi
}

# Show success message and next steps
show_success() {
    log "🎉 Setup completed successfully!"
    echo
    info "Next steps:"
    echo "1. Update .env.local with your configuration values"
    echo "2. Start the development server:"
    echo "   npm run dev"
    echo
    info "Additional commands:"
    echo "• npm run dev          - Start development server"
    echo "• npm run build        - Build for production"
    echo "• npm run test         - Run all tests"
    echo "• npm run lint         - Run linting"
    echo "• npm run analyze      - Analyze bundle size"
    echo
    if [ "$DOCKER_AVAILABLE" = true ]; then
        info "Docker commands:"
        echo "• docker-compose --profile dev up    - Start full dev stack"
        echo "• docker-compose --profile monitoring up - Start with monitoring"
        echo "• ./scripts/health-check.sh          - Run health checks"
        echo
    fi
    info "Deployment:"
    echo "• ./scripts/deploy.sh staging         - Deploy to staging"
    echo "• ./scripts/deploy.sh production      - Deploy to production"
    echo
}

# Show help
show_help() {
    cat <<EOF
Workflo New Project Setup Script

Usage: $0 [OPTIONS]

Options:
    --skip-docker     Skip Docker setup
    --skip-tests      Skip initial tests
    --skip-ide        Skip IDE configuration
    -h, --help        Show this help message

This script will:
1. Check prerequisites (Node.js, npm, Git)
2. Setup environment configuration
3. Install project dependencies
4. Setup development tools (Husky, Playwright)
5. Setup Docker development stack (if available)
6. Run initial build and tests
7. Setup IDE configuration

EOF
}

# Parse command line arguments
SKIP_DOCKER=false
SKIP_TESTS=false
SKIP_IDE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-docker)
            SKIP_DOCKER=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --skip-ide)
            SKIP_IDE=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main execution
main() {
    log "🚀 Starting setup for Workflo New Project"
    log "=========================================="
    
    check_prerequisites
    setup_environment
    install_dependencies
    setup_dev_tools
    
    if [ "$SKIP_DOCKER" = false ]; then
        setup_docker
    fi
    
    if [ "$SKIP_TESTS" = false ]; then
        run_initial_tests
    fi
    
    if [ "$SKIP_IDE" = false ]; then
        setup_ide
    fi
    
    show_success
}

# Run main function
main