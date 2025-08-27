#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of sector pages to fix
const sectorPages = [
  'divers',
  'financiele-sector', 
  'gezondheidszorg',
  'marketing-reclame',
  'media',
  'non-profit',
  'retail',
  'zzp'
];

function fixSectorPage(sectorName) {
  const filePath = path.join(__dirname, '..', 'app', 'sectoren', sectorName, 'page.tsx');
  
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${sectorName}: file not found`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove icon imports
  content = content.replace(/import \{[^}]*\} from 'lucide-react'\n/g, '');
  
  // Fix imports line
  if (!content.includes("import SectorPageTemplate")) {
    content = content.replace(/import \{ Metadata \} from 'next'/, 
      "import { Metadata } from 'next'\nimport SectorPageTemplate from '@/components/sectors/sector-page-template'");
  }
  
  // Replace icon: ComponentName with iconName: 'ComponentName'
  content = content.replace(/icon: ([A-Z][a-zA-Z0-9]*)/g, "iconName: '$1'");
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed ${sectorName}`);
}

console.log('Fixing sector pages icons...\n');

sectorPages.forEach(fixSectorPage);

console.log('\n✅ All sector pages fixed!');