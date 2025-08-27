#!/bin/bash
# Restoration Script for Workflo Website
# Generated: 2025-08-27T08:10:43.976Z

echo "🔄 WORKFLO WEBSITE RESTORATION"
echo "================================"

# Check if running from backup directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Run from backup directory."
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci || npm install

# Setup environment
echo "🔐 Setting up environment..."
if [ ! -f ".env.local" ]; then
  cp .env.template .env.local
  echo "⚠️  Please edit .env.local with your actual values"
fi

# Database setup
echo "🗄️  Setting up database..."
npm run db:push
npm run db:migrate

# Verify installation
echo "✅ Verifying installation..."
npm run typecheck
npm run lint

echo ""
echo "✨ Restoration complete!"
echo "Run 'npm run dev' to start the development server"
