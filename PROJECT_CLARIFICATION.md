# PROJECT CLARIFICATION - CRITICAL README

## ⚠️ IMPORTANT: READ THIS FIRST

### THE CORRECT PROJECT TO WORK ON
**Location:** `/Users/florian/Library/CloudStorage/OneDrive-WorkfloB.V/Documenten/code/Cursor/new-project`

This is the **ONLY** project we should be working on. We have been developing this for weeks and it is the active codebase.

### Projects to AVOID (Old/Deprecated)
1. ❌ **DO NOT USE:** `/Users/florian/Library/CloudStorage/OneDrive-WorkfloB.V/Documenten/code/Cursor/modern-website`
   - This is an old experimental project
   - Not the current working project
   
2. ❌ **DO NOT USE:** `/Users/florian/Library/CloudStorage/OneDrive-WorkfloB.V/Documenten/code/Cursor/old site/nextjs project`
   - This is the old production site
   - We are replacing this with the new-project
   
3. ❌ **DO NOT USE:** `/Users/florian/Library/CloudStorage/OneDrive-WorkfloB.V/Documenten/code/nextjs project`
   - Another old version
   - Not the current working project

## Current Project Details

### Project: new-project
- **Framework:** Next.js 15.5.0 with Turbopack
- **GitHub Repo:** https://github.com/WORKFL0/cursor
- **Main Branch:** `main`
- **Preview Branch:** `preview` (for staging at preview.workflo.nl)
- **Deployment:** Vercel (automatic on push)
- **Local Dev:** `npm run dev` (runs on http://localhost:3000)

### Key Features
- Supabase CMS integration (replaced Payload CMS)
- AI-powered features with OpenAI/Anthropic
- HubSpot integration for forms
- Multi-language support (NL/EN)
- Modern UI with Tailwind CSS and shadcn/ui

### Commands to Run
```bash
# ALWAYS START IN THE RIGHT DIRECTORY
cd /Users/florian/Library/CloudStorage/OneDrive-WorkfloB.V/Documenten/code/Cursor/new-project

# Development
npm run dev        # Start dev server

# Quality Checks (MUST PASS before committing)
npm run lint       # Run linting
npm run build      # Test production build

# Git Operations
git status         # Check current branch and changes
git branch         # List branches (should show main and preview)
```

### Current Issues Being Worked On
1. ✅ GitHub Actions CI/CD - Fixed (TypeScript check temporarily disabled)
2. ✅ Vercel deployment - Builds are successful
3. ⚠️ Vercel 404 error - Under investigation
4. ✅ Preview branch - Created and pushed to GitHub

### Environment Variables Required
Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

## How to Start Working

1. **FIRST:** Check you're in the right directory:
   ```bash
   pwd
   # Should output: /Users/florian/Library/CloudStorage/OneDrive-WorkfloB.V/Documenten/code/Cursor/new-project
   ```

2. **SECOND:** Pull latest changes:
   ```bash
   git pull origin main
   ```

3. **THIRD:** Install dependencies if needed:
   ```bash
   npm install
   ```

4. **FOURTH:** Start development:
   ```bash
   npm run dev
   ```

## Common Mistakes to Avoid

1. **DON'T** start the wrong project (modern-website or old site)
2. **DON'T** work in the wrong directory
3. **DON'T** commit without running `npm run lint` and `npm run build`
4. **DON'T** push directly to main without testing
5. **DON'T** forget this is the project we've been working on for weeks

## Quick Verification

Run this command to verify you're in the right project:
```bash
grep '"name": "new-project"' package.json
```

If it shows `"name": "new-project"`, you're in the right place!

---

**Remember:** When in doubt, always work in `/Users/florian/Library/CloudStorage/OneDrive-WorkfloB.V/Documenten/code/Cursor/new-project`

This is the project we've been developing for weeks. All other projects are deprecated or experimental.