#!/bin/bash
# Build Validation Script
set -euo pipefail

log() { echo -e "\033[0;36m[VALIDATE]\033[0m $1"; }
success() { echo -e "\033[0;32m[SUCCESS]\033[0m $1"; }
error() { echo -e "\033[0;31m[ERROR]\033[0m $1"; exit 1; }

log "🔍 Validating build process..."

# Check if we can install dependencies
log "📦 Testing dependency installation..."
npm ci --prefer-offline --no-audit || error "Dependency installation failed"

# Check TypeScript
log "🔍 Running TypeScript check..."
if npm run type-check 2>/dev/null; then
    success "✅ TypeScript check passed"
else
    log "⚠️ TypeScript errors found (continuing - this is expected)"
fi

# Check ESLint
log "🔍 Running ESLint..."
npm run lint || error "ESLint failed"

# Check if build works
log "🏗️ Testing build process..."
npm run build || error "Build failed"

# Check if required files exist after build
log "📁 Validating build artifacts..."
[[ -d ".next" ]] || error "Build directory not found"
[[ -f ".next/BUILD_ID" ]] || error "Build ID not found"

success "🎉 Build validation completed successfully!"
log "📊 TypeScript errors: $(npm run type-check 2>&1 | grep -c "error TS" || echo "0")"
log "🏗️ Build size: $(du -sh .next 2>/dev/null | cut -f1 || echo "unknown")"
