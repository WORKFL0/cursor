# Branch Protection Rules Configuration Guide

This document outlines the recommended branch protection rules for the Workflo New Project repository to ensure code quality, security, and proper deployment procedures.

## Overview

Branch protection rules help maintain code quality by enforcing certain requirements before code can be merged into protected branches. This guide covers the setup for the main production branches.

## Protected Branches

### 1. Main Branch (`main`)
The main branch represents the production-ready code that gets deployed to the live environment.

**Protection Rules:**
- ✅ Require a pull request before merging
- ✅ Require approvals: **2 reviewers minimum**
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Require review from code owners
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Require signed commits
- ✅ Require linear history
- ✅ Restrict pushes that create files larger than 100MB
- ✅ Lock branch (only administrators can push)
- ✅ Do not allow bypassing the above settings

**Required Status Checks:**
- `CI/CD Pipeline / quality` (TypeScript, ESLint, Prettier checks)
- `CI/CD Pipeline / test` (Unit tests, E2E tests)
- `CI/CD Pipeline / build` (Build verification)
- `CI/CD Pipeline / docker` (Docker build and security scan)
- `CI/CD Pipeline / lighthouse` (Performance audit)
- `CodeQL` (Security analysis)
- `Dependency Review` (Dependency security check)

### 2. Staging Branch (`staging`)
The staging branch is used for pre-production testing and validation.

**Protection Rules:**
- ✅ Require a pull request before merging
- ✅ Require approvals: **1 reviewer minimum**
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Restrict pushes that create files larger than 100MB

**Required Status Checks:**
- `Deploy to Staging / staging-quality` (Basic quality checks)
- `Deploy to Staging / staging-build` (Build verification)
- `Deploy to Staging / staging-tests` (Test execution)

### 3. Development Branch (`develop`) - Optional
If using GitFlow, the develop branch integration point for feature development.

**Protection Rules:**
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

**Required Status Checks:**
- `CI/CD Pipeline / quality` (Basic quality checks)
- `CI/CD Pipeline / test` (Unit tests)

## Setup Instructions

### Via GitHub Web Interface

1. **Navigate to Repository Settings**
   - Go to your repository on GitHub
   - Click on "Settings" tab
   - Select "Branches" from the left sidebar

2. **Create Branch Protection Rule for Main Branch**
   - Click "Add rule"
   - Branch name pattern: `main`
   - Configure the following settings:

   **Pull Request Requirements:**
   ```
   ☑️ Require a pull request before merging
   ☑️ Require approvals: 2
   ☑️ Dismiss stale PR approvals when new commits are pushed
   ☑️ Require review from code owners
   ```

   **Status Check Requirements:**
   ```
   ☑️ Require status checks to pass before merging
   ☑️ Require branches to be up to date before merging
   
   Required status checks:
   - CI/CD Pipeline / quality
   - CI/CD Pipeline / test  
   - CI/CD Pipeline / build
   - CI/CD Pipeline / docker
   - CI/CD Pipeline / lighthouse
   - CodeQL
   ```

   **Additional Rules:**
   ```
   ☑️ Require conversation resolution before merging
   ☑️ Require signed commits
   ☑️ Require linear history
   ☑️ Lock branch
   ☑️ Do not allow bypassing the above settings
   ```

3. **Create Branch Protection Rule for Staging Branch**
   - Repeat the process with adjusted settings as listed above

### Via GitHub CLI

```bash
# Install GitHub CLI if not already installed
brew install gh  # macOS
# or
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Authenticate
gh auth login

# Create branch protection rule for main
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["CI/CD Pipeline / quality","CI/CD Pipeline / test","CI/CD Pipeline / build","CI/CD Pipeline / docker","CI/CD Pipeline / lighthouse","CodeQL"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":2,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' \
  --field restrictions='{"users":[],"teams":[],"apps":[]}' \
  --field required_linear_history=true \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field required_conversation_resolution=true
```

### Via Terraform (Infrastructure as Code)

```hcl
resource "github_branch_protection" "main" {
  repository_id = github_repository.workflo_new_project.node_id
  pattern       = "main"

  required_status_checks {
    strict = true
    contexts = [
      "CI/CD Pipeline / quality",
      "CI/CD Pipeline / test",
      "CI/CD Pipeline / build", 
      "CI/CD Pipeline / docker",
      "CI/CD Pipeline / lighthouse",
      "CodeQL"
    ]
  }

  required_pull_request_reviews {
    required_approving_review_count = 2
    dismiss_stale_reviews          = true
    require_code_owner_reviews     = true
  }

  enforce_admins                 = true
  require_signed_commits         = true
  require_linear_history         = true
  require_conversation_resolution = true
  allows_deletions              = false
  allows_force_pushes           = false
}

resource "github_branch_protection" "staging" {
  repository_id = github_repository.workflo_new_project.node_id
  pattern       = "staging"

  required_status_checks {
    strict = true
    contexts = [
      "Deploy to Staging / staging-quality",
      "Deploy to Staging / staging-build",
      "Deploy to Staging / staging-tests"
    ]
  }

  required_pull_request_reviews {
    required_approving_review_count = 1
    dismiss_stale_reviews          = true
  }

  require_conversation_resolution = true
  allows_deletions              = false
  allows_force_pushes           = false
}
```

## Code Owners Configuration

Create a `.github/CODEOWNERS` file to define who needs to review changes to specific parts of the codebase:

```
# Global owners
* @workflo-dev-team @workflo-leads

# DevOps and Infrastructure
.github/ @workflo-devops-team
docker-compose*.yml @workflo-devops-team
Dockerfile* @workflo-devops-team
.env* @workflo-devops-team
monitoring/ @workflo-devops-team

# Security-related files
.husky/ @workflo-security-team @workflo-devops-team
scripts/ @workflo-security-team @workflo-devops-team

# Frontend components
components/ @workflo-frontend-team
app/ @workflo-frontend-team
public/ @workflo-frontend-team

# Backend and API
lib/ @workflo-backend-team
src/ @workflo-backend-team

# Configuration files
*.config.* @workflo-devops-team
package.json @workflo-devops-team @workflo-leads
```

## Bypassing Branch Protection (Emergency Procedures)

In emergency situations, administrators may need to bypass branch protection rules:

### When to Bypass
- Critical security vulnerabilities requiring immediate patching
- Production outages requiring urgent fixes
- Infrastructure emergencies

### How to Bypass
1. **Temporary Rule Modification:** Temporarily disable specific protection rules
2. **Admin Override:** Use administrative privileges to merge without checks
3. **Hotfix Workflow:** Create emergency hotfix branches with reduced protection

### Post-Emergency Actions
1. **Immediate Re-enabling:** Re-enable all protection rules immediately after emergency fix
2. **Audit Review:** Document the bypass decision and emergency actions taken
3. **Retrospective:** Conduct team retrospective to prevent future emergencies
4. **Process Improvement:** Update emergency procedures based on lessons learned

## Monitoring and Compliance

### Monitoring Branch Protection
- **GitHub Audit Log:** Monitor changes to branch protection rules
- **Webhook Notifications:** Set up webhooks for branch protection events
- **Regular Reviews:** Quarterly review of protection rules and their effectiveness

### Compliance Reporting
- **Merge Activity:** Track merge requests and approval patterns
- **Protection Violations:** Monitor attempts to bypass protections
- **Status Check Failures:** Analyze common causes of CI/CD failures

## Troubleshooting

### Common Issues

**Status Checks Not Found:**
- Ensure the status check names match exactly with your workflow job names
- Verify the workflows are running on the correct branches
- Check that the GitHub App has necessary permissions

**Pull Request Reviews Not Working:**
- Verify team memberships and permissions
- Check CODEOWNERS file syntax
- Ensure reviewers have appropriate repository access

**Linear History Conflicts:**
- Use `git rebase` instead of `git merge` for feature branches
- Enable "Rebase and merge" option in repository settings
- Train team members on rebase workflows

### Getting Help

- **GitHub Support:** For platform-specific issues
- **Team Lead:** For process and workflow questions  
- **DevOps Team:** For CI/CD and automation issues

## Best Practices Summary

1. **Start Strict:** Begin with strict rules and relax as needed
2. **Regular Reviews:** Periodically review and update protection rules
3. **Team Training:** Ensure all team members understand the workflow
4. **Clear Documentation:** Maintain up-to-date documentation
5. **Monitor Compliance:** Actively monitor and address violations
6. **Continuous Improvement:** Refine rules based on team feedback and project needs

---

**Last Updated:** 2025-09-04  
**Next Review:** 2025-12-04  
**Owner:** Workflo DevOps Team