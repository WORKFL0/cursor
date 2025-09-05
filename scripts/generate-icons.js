// Generate PWA icons script
const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create SVG template for each size
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.125}" fill="#1F2937"/>
  <path d="M${size * 0.25} ${size * 0.375}L${size * 0.4375} ${size * 0.1875}L${size * 0.5625} ${size * 0.1875}L${size * 0.75} ${size * 0.375}L${size * 0.75} ${size * 0.625}L${size * 0.5625} ${size * 0.8125}L${size * 0.4375} ${size * 0.8125}L${size * 0.25} ${size * 0.625}Z" fill="#60A5FA"/>
  <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.0625}" fill="#FFFFFF"/>
</svg>
`.trim();

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/images/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate PNG placeholder notice files (in production, these would be actual PNG files)
iconSizes.forEach(size => {
  const svgContent = createIconSVG(size);
  const fileName = `icon-${size}.svg`;
  const filePath = path.join(iconsDir, fileName);
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created ${fileName}`);
  
  // Create a placeholder PNG notice file
  const pngNotice = `<!-- This is a placeholder. In production, convert icon-${size}.svg to icon-${size}.png -->`;
  const pngPath = path.join(iconsDir, `icon-${size}.png`);
  fs.writeFileSync(pngPath, pngNotice);
});

// Generate shortcut icons
const shortcuts = ['contact', 'services', 'support', 'about'];
shortcuts.forEach(shortcut => {
  const svgContent = `
<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="96" height="96" rx="12" fill="#1F2937"/>
  <text x="48" y="56" text-anchor="middle" fill="#60A5FA" font-family="Arial, sans-serif" font-size="16" font-weight="bold">${shortcut.charAt(0).toUpperCase()}</text>
</svg>
  `.trim();
  
  const fileName = `${shortcut}-96.svg`;
  const filePath = path.join(iconsDir, fileName);
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created ${fileName}`);
  
  // PNG placeholder
  const pngNotice = `<!-- This is a placeholder. In production, convert ${shortcut}-96.svg to ${shortcut}-96.png -->`;
  const pngPath = path.join(iconsDir, `${shortcut}-96.png`);
  fs.writeFileSync(pngPath, pngNotice);
});

// Generate badge icon
const badgeContent = `
<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="36" cy="36" r="36" fill="#1F2937"/>
  <path d="M18 31.5L26.25 13.5L31.5 13.5L45 31.5L45 40.5L31.5 58.5L26.25 58.5L18 40.5Z" fill="#60A5FA"/>
  <circle cx="36" cy="36" r="4.5" fill="#FFFFFF"/>
</svg>
`.trim();

fs.writeFileSync(path.join(iconsDir, 'badge-72.svg'), badgeContent);
fs.writeFileSync(path.join(iconsDir, 'badge-72.png'), '<!-- Placeholder PNG -->');

console.log('Generated badge-72.svg');
console.log('All PWA icons generated successfully!');
console.log('Note: SVG files are placeholders. Convert to PNG files for production use.');