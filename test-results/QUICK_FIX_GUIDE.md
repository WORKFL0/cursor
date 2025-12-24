# Quick Fix Guide - Pre-Launch Critical Issues

**Status:** ⚠️ NOT READY FOR LAUNCH
**Estimated Fix Time:** 3-4 hours minimum
**Priority:** CRITICAL - Must fix before going live

---

## 🔴 CRITICAL FIXES (BLOCKING LAUNCH)

### Fix #1: Newsletter Button (30 minutes)

**Location:** Footer section, newsletter subscription form

**Current Code:**
```tsx
// File: components/Newsletter.tsx or similar
<button className="...bg-workflo-yellow...">
  {/* EMPTY - NO TEXT */}
</button>
```

**Fixed Code:**
```tsx
<button className="...bg-workflo-yellow...">
  Aanmelden
</button>
```

**Or with icon:**
```tsx
<button
  className="...bg-workflo-yellow..."
  aria-label="Inschrijven voor nieuwsbrief"
>
  <Mail className="h-4 w-4" />
  <span>Aanmelden</span>
</button>
```

**Test:**
```bash
# After fixing, verify with:
npm run test:e2e -- tests/e2e/pre-launch-qa.spec.ts
```

---

### Fix #2: Floating Chat Button (15 minutes)

**Location:** Bottom-right corner (fixed position)

**Current Code:**
```tsx
<button className="fixed bottom-6 right-6...">
  {/* EMPTY - NO ARIA LABEL */}
</button>
```

**Fixed Code:**
```tsx
<button
  className="fixed bottom-6 right-6..."
  aria-label="Start een gesprek met ons"
>
  <MessageCircle className="h-6 w-6" />
</button>
```

---

## 🟠 HIGH PRIORITY FIXES (STRONGLY RECOMMENDED)

### Fix #3: Replace "Service" (2 hours)

**Find:** 16 instances of "service"
**Replace with:** "dienst" or "dienstverlening"

**Search & Replace Strategy:**
```bash
# Step 1: Find all instances
grep -r "service" app/ components/ --include="*.tsx" --include="*.ts"

# Step 2: Replace based on context
```

**Replacement Rules:**
- "managed service" → "beheerde diensten"
- "service provider" → "dienstverlener"
- "service level" → "serviceniveau" (OK to keep)
- "service desk" → "servicedesk" (OK as compound)

**Keep as-is:**
- Company names (e.g., "HubSpot Service")
- Technical terms in URLs
- API endpoint names

---

### Fix #4: Replace "Support" (1 hour)

**Find:** 7 instances
**Replace with:** "ondersteuning"

**Examples:**
- "IT support" → "IT-ondersteuning"
- "support team" → "ondersteuningsteam"
- "24/7 support" → "24/7 ondersteuning"

**Keep as-is:**
- "Support Portal" (product name)
- Technical documentation references

---

### Fix #5: Replace "Business" (45 minutes)

**Find:** 5 instances
**Replace with:** "bedrijf" or "zakelijk"

**Examples:**
- "business solutions" → "zakelijke oplossingen"
- "business partner" → "zakelijke partner"
- "business continuity" → "bedrijfscontinuïteit"
- "business hours" → "kantooruren" or "werktijden"

---

### Fix #6: Replace "Remote" Terms (30 minutes)

**Find:** 2-3 instances
**Replace with:** context-appropriate Dutch

**Examples:**
- "remote working" → "thuiswerken"
- "remote support" → "ondersteuning op afstand"
- "remote access" → "toegang op afstand"

---

### Fix #7: Replace "Setup" (15 minutes)

**Find:** 2 instances
**Replace with:** "installatie" or "configuratie"

**Examples:**
- "setup kosten" → "installatiekosten"
- "setup proces" → "installatieproces"
- "quick setup" → "snelle installatie"

---

## 🟡 MEDIUM PRIORITY (POST-LAUNCH OK)

### Fix #8 & #9: Video Fallback Messages

**Time:** 15 minutes

**Current:**
```html
<video>
  <source src="/videos/Workflo_W_final.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>
```

**Fixed:**
```html
<video>
  <source src="/videos/Workflo_W_final.mp4" type="video/mp4"/>
  <p className="text-center text-muted-foreground p-4">
    Uw browser ondersteunt geen video.
    <a href="/over-ons" className="text-primary hover:underline ml-1">
      Bekijk onze diensten
    </a>
  </p>
</video>
```

---

## Checklist: Minimum Viable Launch

Use this checklist to track progress:

### Critical (MUST DO)
- [ ] Newsletter button has visible text or aria-label
- [ ] Floating chat button has aria-label
- [ ] Test both buttons with keyboard (Tab navigation)
- [ ] Test with screen reader (macOS VoiceOver: Cmd+F5)

### High Priority (STRONGLY RECOMMENDED)
- [ ] Replace "service" → "dienst" (customer-facing instances)
- [ ] Replace "support" → "ondersteuning"
- [ ] Replace "business" → "bedrijf/zakelijk"
- [ ] Replace "remote working" → "thuiswerken"
- [ ] Replace "setup" → "installatie"
- [ ] Get Dutch native speaker approval

### Testing
- [ ] Re-run QA test suite: `npm run test:e2e`
- [ ] Manual browser testing (Chrome, Safari, Firefox)
- [ ] Mobile testing (iOS Safari, Android Chrome)
- [ ] Accessibility audit (Lighthouse or axe DevTools)
- [ ] Final stakeholder approval

---

## Quick Test Commands

```bash
# Run full pre-launch QA suite
npm run test:e2e -- tests/e2e/pre-launch-qa.spec.ts

# Run accessibility tests only
npm run test:e2e -- tests/e2e/accessibility/

# Generate Lighthouse report
npm run analyze

# Check for English words (custom grep)
grep -rE '\b(service|support|business|remote|setup)\b' app/ --color=always | grep -v node_modules
```

---

## Files Likely to Need Changes

Based on the test results, check these files:

### Components
- `/app/components/Newsletter.tsx` - Newsletter button
- `/app/components/ChatWidget.tsx` - Floating button
- `/app/components/Footer.tsx` - "Service" and "Support" text
- `/app/components/Hero.tsx` - Video fallback

### Pages
- `/app/page.tsx` - Homepage content
- `/app/diensten/page.tsx` - Services page
- `/app/over-ons/page.tsx` - About page

### Content Files (if using)
- `/content/` or `/data/` folders
- Any JSON/MD files with text content

---

## Automated Fix Script (Use with Caution)

**⚠️ WARNING:** Always review changes before committing!

```bash
#!/bin/bash
# Quick fix script - use at your own risk!

# Backup first
git checkout -b pre-launch-fixes

# Find potential files (review output first)
echo "Files with English terms:"
grep -rl "service\|support\|business\|remote working\|setup" app/ components/ | grep -E '\.(tsx|ts|jsx|js)$'

# Manual review required - DO NOT auto-replace without checking context!
```

---

## Final Verification

Before deploying:

1. **Visual Check:**
   - Load http://localhost:3000
   - Check newsletter button has text
   - Check floating button has icon/label
   - Verify no obvious English words in Dutch sections

2. **Keyboard Test:**
   - Press Tab to navigate through page
   - Ensure all buttons are reachable
   - Verify button labels are announced properly

3. **Screen Reader Test:**
   - macOS: Cmd+F5 (VoiceOver)
   - Windows: NVDA or JAWS
   - Check button announcements make sense

4. **Mobile Test:**
   - Test on real device if possible
   - Check button sizes (minimum 44x44px)
   - Verify text is readable

5. **Run Tests:**
   ```bash
   npm run test:e2e
   npm run lint
   npm run typecheck
   ```

---

## Getting Help

If you encounter issues:

1. **Review full report:** `/test-results/COMPREHENSIVE_PRE_LAUNCH_QA_REPORT.md`
2. **Check screenshots:** `/test-results/pre-launch-qa/`
3. **View Playwright report:** `npx playwright show-report`
4. **Contact QA team** with specific error messages

---

## Time Estimates by Role

### Frontend Developer
- Critical fixes: 45 minutes
- High priority: 3-4 hours
- Testing: 1 hour
- **Total: 5-6 hours**

### Content Editor
- Review Dutch translations: 1 hour
- Approve terminology: 30 minutes
- **Total: 1.5 hours**

### QA Tester
- Run automated tests: 15 minutes
- Manual testing: 1 hour
- Accessibility audit: 30 minutes
- **Total: 1.75 hours**

### Project Manager
- Coordinate fixes: 30 minutes
- Final approval: 30 minutes
- **Total: 1 hour**

---

**Last Updated:** November 13, 2025, 17:45
**Next Action:** Assign tasks to developers and start fixing critical issues
