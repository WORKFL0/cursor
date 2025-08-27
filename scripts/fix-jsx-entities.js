#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixJSXEntities(content) {
  // Fix unescaped entities in JSX text content
  return content
    // Fix curly quotes - be more specific to avoid breaking code
    .replace(/([>\s])'([^']*)'([<\s])/g, '$1&apos;$2&apos;$3')
    .replace(/([>\s])"([^"]*)"([<\s])/g, '$1&quot;$2&quot;$3')
    // Fix standalone quotes in JSX content between tags
    .replace(/>([^<]*)'([^<]*)</g, '>$1&apos;$2<')
    .replace(/>([^<]*)"([^<]*)</g, '>$1&quot;$2<')
    // Fix quotes in props values but be careful not to break actual string literals
    .replace(/(\w+\s*=\s*")([^"]*)'([^"]*)"(?=\s|>)/g, '$1$2&apos;$3"')
    .replace(/(\w+\s*=\s*')([^']*)"([^']*)'(?=\s|>)/g, "$1$2&quot;$3'");
}

// Get all TSX files
const files = glob.sync('**/*.{tsx,jsx}', {
  ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**'],
  cwd: process.cwd()
});

console.log(`Found ${files.length} files to process...`);

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const fixed = fixJSXEntities(content);
    
    if (content !== fixed) {
      fs.writeFileSync(file, fixed, 'utf8');
      console.log(`Fixed: ${file}`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log('Done!');