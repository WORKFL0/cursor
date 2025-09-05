#!/usr/bin/env tsx
/**
 * Monitoring Verification Script
 * Verifies all monitoring and security configurations are properly set up
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)

interface CheckResult {
  name: string
  status: 'pass' | 'warn' | 'fail'
  message: string
  details?: string[]
}

class MonitoringVerifier {
  private results: CheckResult[] = []

  private addResult(name: string, status: 'pass' | 'warn' | 'fail', message: string, details?: string[]) {
    this.results.push({ name, status, message, details })
  }

  private async checkEnvironmentVariables() {
    const requiredVars = {
      'NEXT_PUBLIC_SENTRY_DSN': { required: true, description: 'Sentry client-side DSN' },
      'SENTRY_DSN': { required: true, description: 'Sentry server-side DSN' },
      'SENTRY_ORG': { required: true, description: 'Sentry organization' },
      'SENTRY_PROJECT': { required: true, description: 'Sentry project name' },
      'NEXT_PUBLIC_GA_ID': { required: false, description: 'Google Analytics measurement ID' },
      'NEXT_PUBLIC_CLARITY_ID': { required: false, description: 'Microsoft Clarity project ID' },
      'UPTIME_ROBOT_API_KEY': { required: false, description: 'UptimeRobot API key' },
      'HEALTHCHECKS_IO_PING_URL': { required: false, description: 'Healthchecks.io ping URL' }
    }

    const missing: string[] = []
    const optional: string[] = []
    const present: string[] = []

    for (const [varName, config] of Object.entries(requiredVars)) {
      const value = process.env[varName]
      if (!value) {
        if (config.required) {
          missing.push(`${varName} (${config.description})`)
        } else {
          optional.push(`${varName} (${config.description})`)
        }
      } else {
        present.push(`${varName} (${config.description})`)
      }
    }

    if (missing.length > 0) {
      this.addResult(
        'Environment Variables',
        'fail',
        `Missing ${missing.length} required environment variables`,
        missing
      )
    } else if (optional.length > 0) {
      this.addResult(
        'Environment Variables',
        'warn',
        `${present.length} variables configured, ${optional.length} optional variables missing`,
        optional
      )
    } else {
      this.addResult(
        'Environment Variables',
        'pass',
        `All ${present.length} monitoring variables configured`,
        present
      )
    }
  }

  private async checkSentryConfiguration() {
    try {
      const sentryFiles = [
        'sentry.client.config.ts',
        'sentry.server.config.ts',
        'sentry.edge.config.ts'
      ]

      const existingFiles: string[] = []
      const missingFiles: string[] = []

      for (const file of sentryFiles) {
        try {
          await fs.access(path.join(process.cwd(), file))
          existingFiles.push(file)
        } catch {
          missingFiles.push(file)
        }
      }

      if (missingFiles.length === 0) {
        this.addResult(
          'Sentry Configuration',
          'pass',
          'All Sentry configuration files present',
          existingFiles
        )
      } else {
        this.addResult(
          'Sentry Configuration',
          'warn',
          `Missing ${missingFiles.length} Sentry configuration files`,
          missingFiles
        )
      }
    } catch (error) {
      this.addResult(
        'Sentry Configuration',
        'fail',
        'Error checking Sentry configuration files',
        [error instanceof Error ? error.message : 'Unknown error']
      )
    }
  }

  private async checkAnalyticsComponents() {
    try {
      const analyticsComponents = [
        'components/analytics/google-analytics.tsx',
        'components/analytics/microsoft-clarity.tsx',
        'components/analytics/analytics-provider.tsx'
      ]

      const existingComponents: string[] = []
      const missingComponents: string[] = []

      for (const component of analyticsComponents) {
        try {
          await fs.access(path.join(process.cwd(), component))
          existingComponents.push(component)
        } catch {
          missingComponents.push(component)
        }
      }

      if (missingComponents.length === 0) {
        this.addResult(
          'Analytics Components',
          'pass',
          'All analytics components present',
          existingComponents
        )
      } else {
        this.addResult(
          'Analytics Components',
          'warn',
          `Missing ${missingComponents.length} analytics components`,
          missingComponents
        )
      }
    } catch (error) {
      this.addResult(
        'Analytics Components',
        'fail',
        'Error checking analytics components',
        [error instanceof Error ? error.message : 'Unknown error']
      )
    }
  }

  private async checkNextConfigSecurity() {
    try {
      const nextConfigPath = path.join(process.cwd(), 'next.config.ts')
      const content = await fs.readFile(nextConfigPath, 'utf-8')

      const securityFeatures = [
        { pattern: /X-Frame-Options/i, name: 'X-Frame-Options header' },
        { pattern: /X-Content-Type-Options/i, name: 'X-Content-Type-Options header' },
        { pattern: /Strict-Transport-Security/i, name: 'HSTS header' },
        { pattern: /Content-Security-Policy/i, name: 'Content Security Policy' },
        { pattern: /Permissions-Policy/i, name: 'Permissions Policy' },
        { pattern: /withSentryConfig/i, name: 'Sentry webpack integration' }
      ]

      const presentFeatures: string[] = []
      const missingFeatures: string[] = []

      for (const feature of securityFeatures) {
        if (feature.pattern.test(content)) {
          presentFeatures.push(feature.name)
        } else {
          missingFeatures.push(feature.name)
        }
      }

      if (missingFeatures.length === 0) {
        this.addResult(
          'Security Headers',
          'pass',
          'All security headers configured in next.config.ts',
          presentFeatures
        )
      } else {
        this.addResult(
          'Security Headers',
          'warn',
          `Missing ${missingFeatures.length} security features`,
          missingFeatures
        )
      }
    } catch (error) {
      this.addResult(
        'Security Headers',
        'fail',
        'Error checking next.config.ts security configuration',
        [error instanceof Error ? error.message : 'Unknown error']
      )
    }
  }

  private async checkHealthEndpoint() {
    try {
      const healthPath = path.join(process.cwd(), 'app/api/health/route.ts')
      await fs.access(healthPath)
      
      this.addResult(
        'Health Check Endpoint',
        'pass',
        'Health check endpoint exists at /api/health'
      )
    } catch {
      this.addResult(
        'Health Check Endpoint',
        'fail',
        'Health check endpoint missing at app/api/health/route.ts'
      )
    }
  }

  private async checkMonitoringConfiguration() {
    try {
      const configPath = path.join(process.cwd(), 'config/uptime-monitoring.ts')
      await fs.access(configPath)
      
      this.addResult(
        'Monitoring Configuration',
        'pass',
        'Uptime monitoring configuration file exists'
      )
    } catch {
      this.addResult(
        'Monitoring Configuration',
        'warn',
        'Uptime monitoring configuration file missing (optional)'
      )
    }
  }

  private async testHealthEndpointLocally() {
    if (process.env.NODE_ENV === 'production') {
      this.addResult(
        'Health Endpoint Test',
        'warn',
        'Skipping local health endpoint test in production'
      )
      return
    }

    try {
      // Check if local dev server is running
      const response = await fetch('http://localhost:3000/api/health')
      const data = await response.json()
      
      if (response.ok && data.status) {
        this.addResult(
          'Health Endpoint Test',
          'pass',
          `Health endpoint responded with status: ${data.status}`
        )
      } else {
        this.addResult(
          'Health Endpoint Test',
          'warn',
          'Health endpoint responded but with unexpected format'
        )
      }
    } catch (error) {
      this.addResult(
        'Health Endpoint Test',
        'warn',
        'Could not test health endpoint (dev server may not be running)'
      )
    }
  }

  private async checkPackageJsonScripts() {
    try {
      const packagePath = path.join(process.cwd(), 'package.json')
      const content = await fs.readFile(packagePath, 'utf-8')
      const packageJson = JSON.parse(content)
      
      const monitoringScripts = [
        'build',
        'lint',
        'test',
        'analyze'
      ]
      
      const presentScripts: string[] = []
      const missingScripts: string[] = []
      
      for (const script of monitoringScripts) {
        if (packageJson.scripts && packageJson.scripts[script]) {
          presentScripts.push(script)
        } else {
          missingScripts.push(script)
        }
      }
      
      this.addResult(
        'Package Scripts',
        missingScripts.length === 0 ? 'pass' : 'warn',
        `${presentScripts.length}/${monitoringScripts.length} monitoring-related scripts available`,
        presentScripts
      )
    } catch (error) {
      this.addResult(
        'Package Scripts',
        'fail',
        'Error reading package.json',
        [error instanceof Error ? error.message : 'Unknown error']
      )
    }
  }

  async runAllChecks() {
    console.log('🔍 Running Monitoring & Security Verification...\n')
    
    await this.checkEnvironmentVariables()
    await this.checkSentryConfiguration()
    await this.checkAnalyticsComponents()
    await this.checkNextConfigSecurity()
    await this.checkHealthEndpoint()
    await this.checkMonitoringConfiguration()
    await this.testHealthEndpointLocally()
    await this.checkPackageJsonScripts()
  }

  generateReport() {
    const passCount = this.results.filter(r => r.status === 'pass').length
    const warnCount = this.results.filter(r => r.status === 'warn').length
    const failCount = this.results.filter(r => r.status === 'fail').length
    
    console.log('📊 Verification Report')
    console.log('='.repeat(50))
    console.log(`✅ Passed: ${passCount}`)
    console.log(`⚠️  Warnings: ${warnCount}`)
    console.log(`❌ Failed: ${failCount}`)
    console.log('='.repeat(50))
    console.log()

    for (const result of this.results) {
      const icon = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️ ' : '❌'
      console.log(`${icon} ${result.name}`)
      console.log(`   ${result.message}`)
      
      if (result.details && result.details.length > 0) {
        result.details.forEach(detail => {
          console.log(`   - ${detail}`)
        })
      }
      console.log()
    }

    // Summary and recommendations
    console.log('💡 Recommendations')
    console.log('='.repeat(50))
    
    if (failCount > 0) {
      console.log('❗ Critical issues found. Please address failed checks before deploying to production.')
    } else if (warnCount > 0) {
      console.log('⚠️  Some optional features are not configured. Consider enabling them for better monitoring.')
    } else {
      console.log('🎉 All monitoring and security checks passed! Ready for production deployment.')
    }
    
    console.log('\n📚 For detailed setup instructions, see MONITORING_SECURITY_SETUP.md')
    
    // Exit code based on results
    if (failCount > 0) {
      process.exit(1)
    }
  }
}

// Run verification
async function main() {
  const verifier = new MonitoringVerifier()
  await verifier.runAllChecks()
  verifier.generateReport()
}

if (require.main === module) {
  main().catch(console.error)
}

export { MonitoringVerifier }