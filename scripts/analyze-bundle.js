#!/usr/bin/env node

/**
 * Bundle analysis script for Workflo New Project
 * Analyzes webpack bundle composition and size
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BUNDLE_SIZE_LIMITS = {
  maxTotalSize: 500 * 1024, // 500KB
  maxChunkSize: 250 * 1024, // 250KB
  maxPageSize: 100 * 1024,  // 100KB per page
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
  console.log('📦 Analyzing bundle composition...\n');
  
  const buildDir = path.join(process.cwd(), '.next');
  
  if (!fs.existsSync(buildDir)) {
    console.error('❌ Build directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  // Read build manifest
  const buildManifestPath = path.join(buildDir, 'build-manifest.json');
  const buildManifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf8'));
  
  // Read route manifest
  const routesManifestPath = path.join(buildDir, 'routes-manifest.json');
  const routesManifest = JSON.parse(fs.readFileSync(routesManifestPath, 'utf8'));

  // Analyze pages
  console.log('📄 Page Analysis:');
  console.log('─'.repeat(60));
  
  let totalSize = 0;
  let warnings = [];
  let errors = [];
  
  Object.entries(buildManifest.pages).forEach(([page, files]) => {
    let pageSize = 0;
    
    files.forEach(file => {
      const filePath = path.join(buildDir, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        pageSize += stats.size;
      }
    });
    
    totalSize += pageSize;
    const status = pageSize > BUNDLE_SIZE_LIMITS.maxPageSize ? '⚠️' : '✅';
    
    console.log(`${status} ${page.padEnd(25)} ${formatBytes(pageSize)}`);
    
    if (pageSize > BUNDLE_SIZE_LIMITS.maxPageSize) {
      warnings.push(`Page "${page}" exceeds size limit: ${formatBytes(pageSize)}`);
    }
  });

  console.log('\n📊 Bundle Statistics:');
  console.log('─'.repeat(60));
  
  // Analyze static files
  const staticDir = path.join(buildDir, 'static');
  if (fs.existsSync(staticDir)) {
    const staticFiles = getAllFiles(staticDir);
    let jsSize = 0;
    let cssSize = 0;
    let otherSize = 0;
    
    staticFiles.forEach(file => {
      const stats = fs.statSync(file);
      const ext = path.extname(file);
      
      if (ext === '.js') jsSize += stats.size;
      else if (ext === '.css') cssSize += stats.size;
      else otherSize += stats.size;
    });
    
    console.log(`JavaScript: ${formatBytes(jsSize)}`);
    console.log(`CSS: ${formatBytes(cssSize)}`);
    console.log(`Other: ${formatBytes(otherSize)}`);
    console.log(`Static Total: ${formatBytes(jsSize + cssSize + otherSize)}`);
  }
  
  console.log(`Pages Total: ${formatBytes(totalSize)}`);
  
  // Check against limits
  console.log('\n🎯 Size Limits Check:');
  console.log('─'.repeat(60));
  
  if (totalSize > BUNDLE_SIZE_LIMITS.maxTotalSize) {
    errors.push(`Total bundle size exceeds limit: ${formatBytes(totalSize)} > ${formatBytes(BUNDLE_SIZE_LIMITS.maxTotalSize)}`);
    console.log(`❌ Total size: ${formatBytes(totalSize)} (EXCEEDS LIMIT)`);
  } else {
    console.log(`✅ Total size: ${formatBytes(totalSize)} (within limit)`);
  }
  
  // Analyze largest chunks
  console.log('\n🔍 Largest Files:');
  console.log('─'.repeat(60));
  
  const allFiles = getAllFiles(buildDir, ['.js', '.css']);
  const sortedFiles = allFiles
    .map(file => ({
      path: path.relative(buildDir, file),
      size: fs.statSync(file).size
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);
  
  sortedFiles.forEach(file => {
    const status = file.size > BUNDLE_SIZE_LIMITS.maxChunkSize ? '⚠️' : '  ';
    console.log(`${status} ${file.path.padEnd(40)} ${formatBytes(file.size)}`);
    
    if (file.size > BUNDLE_SIZE_LIMITS.maxChunkSize) {
      warnings.push(`File "${file.path}" is large: ${formatBytes(file.size)}`);
    }
  });

  // Dependencies analysis
  console.log('\n📦 Dependencies Impact:');
  console.log('─'.repeat(60));
  
  try {
    // This would require additional webpack plugins in a real setup
    console.log('Use "npm run bundle-analyzer" for detailed dependency analysis');
  } catch (error) {
    console.log('⚠️ Could not analyze dependencies');
  }

  // Recommendations
  console.log('\n💡 Optimization Recommendations:');
  console.log('─'.repeat(60));
  
  const recommendations = [
    'Use dynamic imports for large components',
    'Implement code splitting for different routes',
    'Optimize images with next/image',
    'Remove unused dependencies',
    'Use tree shaking for bundle optimization',
    'Consider using a CDN for static assets',
  ];
  
  recommendations.forEach(rec => console.log(`• ${rec}`));

  // Report warnings and errors
  if (warnings.length > 0) {
    console.log('\n⚠️ Warnings:');
    warnings.forEach(warning => console.log(`  ${warning}`));
  }
  
  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(error => console.log(`  ${error}`));
    process.exit(1);
  }
  
  console.log('\n✅ Bundle analysis complete!');
}

function getAllFiles(dir, extensions = []) {
  let files = [];
  
  if (!fs.existsSync(dir)) return files;
  
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      files = files.concat(getAllFiles(filePath, extensions));
    } else if (extensions.length === 0 || extensions.includes(path.extname(file))) {
      files.push(filePath);
    }
  });
  
  return files;
}

// Run analysis if called directly
if (require.main === module) {
  analyzeBundle();
}

module.exports = { analyzeBundle };