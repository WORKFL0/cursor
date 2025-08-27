#!/usr/bin/env node

/**
 * Automated Backup Script for Workflo Website
 * Creates a complete backup of all critical files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Backup configuration
const BACKUP_CONFIG = {
  timestamp: new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5),
  backupDir: 'backups',
  criticalFiles: [
    // Configuration files
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'next.config.mjs',
    'tailwind.config.ts',
    'postcss.config.mjs',
    '.env.example',
    'SITE_BACKUP_MANIFEST.md',
    'CLAUDE.md',
    
    // Database schema
    'prisma/schema.prisma',
    
    // Core layouts and configs
    'app/layout.tsx',
    'app/globals.css',
    
    // API routes
    'app/api/external-news/route.ts',
    'app/api/newsletter/route.ts',
    'app/api/contact/route.ts',
    'app/api/cms/articles/route.ts',
    
    // Components
    'components/layout/enterprise-header.tsx',
    'components/layout/enterprise-footer.tsx',
    'components/sectors/sector-page-template.tsx',
    
    // Library files
    'lib/config/linkedin-posts.ts',
    'lib/utils/rss-parser.ts',
    'lib/types/sectors.ts',
    'lib/data/portfolio-data.ts',
    'lib/data/workflo-data.ts',
    
    // All sector pages
    'app/sectoren/architecten/page.tsx',
    'app/sectoren/financiele-sector/page.tsx',
    'app/sectoren/gezondheidszorg/page.tsx',
    'app/sectoren/media/page.tsx',
    'app/sectoren/marketing-reclame/page.tsx',
    'app/sectoren/retail/page.tsx',
    'app/sectoren/zzp/page.tsx',
    'app/sectoren/non-profit/page.tsx',
    'app/sectoren/divers/page.tsx',
    
    // Service pages
    'app/diensten/page.tsx',
    'app/diensten/managed-it/page.tsx',
    'app/diensten/cybersecurity/page.tsx',
    'app/diensten/cloud-oplossingen/page.tsx',
    'app/diensten/microsoft-365/page.tsx',
    'app/diensten/backup-disaster-recovery/page.tsx',
    'app/diensten/hardware-as-a-service/page.tsx',
    'app/diensten/voip-telefonie/page.tsx',
    
    // Other important pages
    'app/portfolio/page.tsx',
    'app/nieuws/page.tsx',
    'app/cms/page.tsx',
    'app/contact/page.tsx',
    'app/over-ons/page.tsx',
    'app/werken-bij/page.tsx',
  ],
  
  directories: [
    'components/ui',
    'components/shared',
    'lib/contexts',
    'lib/hooks',
    'public/images',
    'styles',
  ]
};

// Console colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function createBackupDirectory() {
  const backupPath = path.join(BACKUP_CONFIG.backupDir, `backup-${BACKUP_CONFIG.timestamp}`);
  
  if (!fs.existsSync(BACKUP_CONFIG.backupDir)) {
    fs.mkdirSync(BACKUP_CONFIG.backupDir);
  }
  
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }
  
  return backupPath;
}

function copyFile(source, destination) {
  const destDir = path.dirname(destination);
  
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, destination);
    return true;
  }
  
  return false;
}

function copyDirectory(source, destination) {
  if (!fs.existsSync(source)) {
    return false;
  }
  
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  const files = fs.readdirSync(source);
  
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
  
  return true;
}

function createBackupReport(backupPath, results) {
  const report = `# Backup Report
Generated: ${new Date().toISOString()}
Backup Location: ${backupPath}

## Summary
- Total Files Backed Up: ${results.success.length}
- Failed Files: ${results.failed.length}
- Directories Backed Up: ${results.directories.length}

## Successful Backups
${results.success.map(f => `✅ ${f}`).join('\n')}

## Failed Backups
${results.failed.length > 0 ? results.failed.map(f => `❌ ${f}`).join('\n') : 'None'}

## Directories
${results.directories.map(d => `📁 ${d}`).join('\n')}

## Next Steps
1. Verify backup integrity
2. Test restoration procedure
3. Store backup in secure location
4. Update SITE_BACKUP_MANIFEST.md if needed
`;

  fs.writeFileSync(path.join(backupPath, 'BACKUP_REPORT.md'), report);
  return report;
}

function runBackup() {
  log('\n🔒 WORKFLO WEBSITE BACKUP SYSTEM', colors.bright + colors.cyan);
  log('━'.repeat(50), colors.cyan);
  
  // Create backup directory
  log('\n📁 Creating backup directory...', colors.yellow);
  const backupPath = createBackupDirectory();
  log(`   ✓ Created: ${backupPath}`, colors.green);
  
  const results = {
    success: [],
    failed: [],
    directories: []
  };
  
  // Backup critical files
  log('\n📄 Backing up critical files...', colors.yellow);
  for (const file of BACKUP_CONFIG.criticalFiles) {
    const source = file;
    const destination = path.join(backupPath, file);
    
    if (copyFile(source, destination)) {
      results.success.push(file);
      log(`   ✓ ${file}`, colors.green);
    } else {
      results.failed.push(file);
      log(`   ✗ ${file} (not found)`, colors.red);
    }
  }
  
  // Backup directories
  log('\n📁 Backing up directories...', colors.yellow);
  for (const dir of BACKUP_CONFIG.directories) {
    const source = dir;
    const destination = path.join(backupPath, dir);
    
    if (copyDirectory(source, destination)) {
      results.directories.push(dir);
      log(`   ✓ ${dir}/`, colors.green);
    } else {
      log(`   ✗ ${dir}/ (not found)`, colors.red);
    }
  }
  
  // Create environment template
  log('\n🔐 Creating environment template...', colors.yellow);
  const envTemplate = `# Environment Variables Template
# Copy this file to .env.local and fill in the values

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/workflo"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""

# AI APIs (optional)
ANTHROPIC_API_KEY=""
OPENAI_API_KEY=""

# HubSpot
HUBSPOT_PORTAL_ID="26510736"
HUBSPOT_FORM_NEWSLETTER="e92de02c-71b0-4a68-aedd-3b6acb0f5f67"
HUBSPOT_FORM_CONTACT="acfec8fa-c596-4fe0-aa14-ed4bf42b6f73"

# Analytics
GA_MEASUREMENT_ID=""
CLARITY_PROJECT_ID=""
HOTJAR_SITE_ID=""
`;
  fs.writeFileSync(path.join(backupPath, '.env.template'), envTemplate);
  log('   ✓ Environment template created', colors.green);
  
  // Git information
  log('\n📊 Capturing git information...', colors.yellow);
  try {
    const gitInfo = {
      branch: execSync('git branch --show-current').toString().trim(),
      commit: execSync('git rev-parse HEAD').toString().trim(),
      status: execSync('git status --short').toString().trim(),
      remotes: execSync('git remote -v').toString().trim()
    };
    
    fs.writeFileSync(
      path.join(backupPath, 'git-info.json'),
      JSON.stringify(gitInfo, null, 2)
    );
    log('   ✓ Git information saved', colors.green);
  } catch (error) {
    log('   ⚠ Could not capture git information', colors.yellow);
  }
  
  // Package versions
  log('\n📦 Saving package versions...', colors.yellow);
  try {
    const packages = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const versions = {
      dependencies: packages.dependencies,
      devDependencies: packages.devDependencies,
      node: process.version,
      npm: execSync('npm --version').toString().trim()
    };
    
    fs.writeFileSync(
      path.join(backupPath, 'versions.json'),
      JSON.stringify(versions, null, 2)
    );
    log('   ✓ Package versions saved', colors.green);
  } catch (error) {
    log('   ⚠ Could not save package versions', colors.yellow);
  }
  
  // Create backup report
  log('\n📝 Generating backup report...', colors.yellow);
  createBackupReport(backupPath, results);
  log('   ✓ Report generated', colors.green);
  
  // Create restoration script
  log('\n🔧 Creating restoration script...', colors.yellow);
  const restoreScript = `#!/bin/bash
# Restoration Script for Workflo Website
# Generated: ${new Date().toISOString()}

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
`;
  
  fs.writeFileSync(path.join(backupPath, 'restore.sh'), restoreScript);
  fs.chmodSync(path.join(backupPath, 'restore.sh'), '755');
  log('   ✓ Restoration script created', colors.green);
  
  // Summary
  log('\n' + '═'.repeat(50), colors.cyan);
  log('✨ BACKUP COMPLETE!', colors.bright + colors.green);
  log('═'.repeat(50), colors.cyan);
  log(`📍 Location: ${colors.bright}${backupPath}${colors.reset}`);
  log(`📊 Files: ${colors.green}${results.success.length} succeeded${colors.reset}, ${colors.red}${results.failed.length} failed${colors.reset}`);
  log(`📁 Directories: ${colors.green}${results.directories.length} backed up${colors.reset}`);
  log('\n💡 Next steps:', colors.yellow);
  log('   1. Review BACKUP_REPORT.md in backup folder');
  log('   2. Test restoration with restore.sh script');
  log('   3. Store backup in secure location');
  log('   4. Consider uploading to cloud storage\n');
}

// Run the backup
runBackup();