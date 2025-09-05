// Generate PWA screenshot placeholders
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, '../public/images/screenshots');

// Desktop screenshot (1920x1080)
const desktopSVG = `
<svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1920" height="1080" fill="#F9FAFB"/>
  
  <!-- Header -->
  <rect width="1920" height="80" fill="#1F2937"/>
  <rect x="60" y="25" width="120" height="30" rx="4" fill="#60A5FA"/>
  <text x="120" y="45" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Workflo</text>
  
  <!-- Hero Section -->
  <rect x="60" y="120" width="800" height="400" rx="8" fill="#FFFFFF" stroke="#E5E7EB"/>
  <text x="460" y="200" text-anchor="middle" fill="#1F2937" font-family="Arial, sans-serif" font-size="32" font-weight="bold">Professional IT Services</text>
  <text x="460" y="250" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="18">Managed Services • Cloud Solutions • Cybersecurity</text>
  <rect x="380" y="300" width="160" height="40" rx="8" fill="#60A5FA"/>
  <text x="460" y="325" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="16">Get Started</text>
  
  <!-- Services Grid -->
  <rect x="920" y="120" width="380" height="180" rx="8" fill="#FFFFFF" stroke="#E5E7EB"/>
  <text x="1110" y="160" text-anchor="middle" fill="#1F2937" font-family="Arial, sans-serif" font-size="20" font-weight="bold">Our Services</text>
  
  <rect x="920" y="340" width="380" height="180" rx="8" fill="#FFFFFF" stroke="#E5E7EB"/>
  <text x="1110" y="380" text-anchor="middle" fill="#1F2937" font-family="Arial, sans-serif" font-size="20" font-weight="bold">24/7 Support</text>
  
  <!-- Footer indication -->
  <rect y="1000" width="1920" height="80" fill="#1F2937"/>
  <text x="960" y="1045" text-anchor="middle" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="14">Workflo IT Services - Amsterdam</text>
</svg>
`.trim();

// Mobile screenshot (390x844)
const mobileSVG = `
<svg width="390" height="844" viewBox="0 0 390 844" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="390" height="844" fill="#F9FAFB"/>
  
  <!-- Mobile Header -->
  <rect width="390" height="60" fill="#1F2937"/>
  <rect x="20" y="15" width="80" height="30" rx="4" fill="#60A5FA"/>
  <text x="60" y="35" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Workflo</text>
  
  <!-- Hamburger Menu -->
  <rect x="330" y="20" width="20" height="2" fill="#FFFFFF"/>
  <rect x="330" y="27" width="20" height="2" fill="#FFFFFF"/>
  <rect x="330" y="34" width="20" height="2" fill="#FFFFFF"/>
  
  <!-- Hero Section -->
  <rect x="20" y="80" width="350" height="200" rx="8" fill="#FFFFFF" stroke="#E5E7EB"/>
  <text x="195" y="120" text-anchor="middle" fill="#1F2937" font-family="Arial, sans-serif" font-size="18" font-weight="bold">Professional IT</text>
  <text x="195" y="145" text-anchor="middle" fill="#1F2937" font-family="Arial, sans-serif" font-size="18" font-weight="bold">Services</text>
  <text x="195" y="175" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="14">Expert support in Amsterdam</text>
  <rect x="155" y="200" width="80" height="35" rx="6" fill="#60A5FA"/>
  <text x="195" y="220" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="14">Contact</text>
  
  <!-- Services Cards -->
  <rect x="20" y="300" width="350" height="120" rx="8" fill="#FFFFFF" stroke="#E5E7EB"/>
  <text x="35" y="330" fill="#1F2937" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Managed Services</text>
  <text x="35" y="355" fill="#6B7280" font-family="Arial, sans-serif" font-size="14">24/7 monitoring and support</text>
  
  <rect x="20" y="440" width="350" height="120" rx="8" fill="#FFFFFF" stroke="#E5E7EB"/>
  <text x="35" y="470" fill="#1F2937" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Cloud Solutions</text>
  <text x="35" y="495" fill="#6B7280" font-family="Arial, sans-serif" font-size="14">Migration and management</text>
  
  <rect x="20" y="580" width="350" height="120" rx="8" fill="#FFFFFF" stroke="#E5E7EB"/>
  <text x="35" y="610" fill="#1F2937" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Cybersecurity</text>
  <text x="35" y="635" fill="#6B7280" font-family="Arial, sans-serif" font-size="14">Protection and compliance</text>
  
  <!-- Bottom Navigation -->
  <rect y="764" width="390" height="80" fill="#FFFFFF" stroke="#E5E7EB"/>
  <rect x="20" y="784" width="60" height="40" rx="8" fill="#60A5FA"/>
  <text x="50" y="807" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="12">Home</text>
  
  <rect x="100" y="784" width="60" height="40" rx="8" fill="#F3F4F6"/>
  <text x="130" y="807" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="12">Services</text>
  
  <rect x="180" y="784" width="60" height="40" rx="8" fill="#F3F4F6"/>
  <text x="210" y="807" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="12">Contact</text>
  
  <rect x="260" y="784" width="60" height="40" rx="8" fill="#F3F4F6"/>
  <text x="290" y="807" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="12">About</text>
</svg>
`.trim();

// Create screenshots
fs.writeFileSync(path.join(screenshotsDir, 'desktop-home.svg'), desktopSVG);
fs.writeFileSync(path.join(screenshotsDir, 'mobile-home.svg'), mobileSVG);

// Create PNG placeholder notices
fs.writeFileSync(path.join(screenshotsDir, 'desktop-home.png'), '<!-- Convert desktop-home.svg to PNG for production -->');
fs.writeFileSync(path.join(screenshotsDir, 'mobile-home.png'), '<!-- Convert mobile-home.svg to PNG for production -->');

console.log('Generated desktop-home.svg');
console.log('Generated mobile-home.svg');
console.log('PWA screenshots generated successfully!');
console.log('Note: Convert SVG files to PNG for production use.');