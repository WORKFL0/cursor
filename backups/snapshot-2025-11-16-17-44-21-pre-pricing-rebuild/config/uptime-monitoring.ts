/**
 * Uptime Monitoring Configuration
 * Handles health checks, uptime monitoring, and alerting
 */

export interface UptimeMonitorConfig {
  name: string
  url: string
  method?: 'GET' | 'POST' | 'HEAD'
  timeout?: number
  interval?: number
  retries?: number
  expectedStatus?: number[]
  expectedContent?: string
  headers?: Record<string, string>
  alertChannels?: ('email' | 'slack' | 'webhook' | 'sms')[]
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  checks: {
    [key: string]: {
      status: 'pass' | 'warn' | 'fail'
      message?: string
      duration?: number
      data?: any
    }
  }
  meta?: {
    version?: string
    environment?: string
    uptime?: number
    memory?: {
      used: number
      total: number
      percentage: number
    }
    cpu?: {
      usage: number
    }
  }
}

// Uptime Robot Configuration
export const uptimeRobotConfig = {
  apiKey: process.env.UPTIME_ROBOT_API_KEY,
  monitors: [
    {
      friendlyName: 'Workflo Website - Homepage',
      url: process.env.NEXT_PUBLIC_APP_URL || 'https://workflo.it',
      type: 1, // HTTP(s)
      interval: 300, // 5 minutes
      httpUsername: '',
      httpPassword: '',
      alertContacts: process.env.UPTIME_ROBOT_ALERT_CONTACTS?.split(',') || []
    },
    {
      friendlyName: 'Workflo API - Health Check',
      url: (process.env.NEXT_PUBLIC_APP_URL || 'https://workflo.it') + '/api/health',
      type: 1,
      interval: 300,
      httpUsername: '',
      httpPassword: '',
      alertContacts: process.env.UPTIME_ROBOT_ALERT_CONTACTS?.split(',') || []
    },
    {
      friendlyName: 'Workflo Database Connection',
      url: (process.env.NEXT_PUBLIC_APP_URL || 'https://workflo.it') + '/api/health/database',
      type: 1,
      interval: 600, // 10 minutes
      alertContacts: process.env.UPTIME_ROBOT_ALERT_CONTACTS?.split(',') || []
    }
  ]
}

// Pingdom Configuration
export const pingdomConfig = {
  apiKey: process.env.PINGDOM_API_KEY,
  username: process.env.PINGDOM_USERNAME,
  password: process.env.PINGDOM_PASSWORD,
  checks: [
    {
      name: 'Workflo Homepage',
      hostname: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://workflo.it').hostname,
      resolution: 5, // 5 minutes
      type: 'http',
      paused: false,
      tags: ['production', 'website'],
      integrationids: process.env.PINGDOM_INTEGRATION_IDS?.split(',').map(Number) || []
    },
    {
      name: 'Workflo API Health',
      hostname: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://workflo.it').hostname,
      url: '/api/health',
      resolution: 5,
      type: 'http',
      paused: false,
      tags: ['production', 'api'],
      integrationids: process.env.PINGDOM_INTEGRATION_IDS?.split(',').map(Number) || []
    }
  ]
}

// Healthchecks.io Configuration
export const healthchecksConfig = {
  pingUrl: process.env.HEALTHCHECKS_IO_PING_URL,
  checks: [
    {
      name: 'daily-backup',
      schedule: '0 2 * * *', // Daily at 2 AM
      grace: 3600, // 1 hour grace period
      tags: ['backup', 'daily']
    },
    {
      name: 'database-cleanup',
      schedule: '0 1 * * 0', // Weekly on Sunday at 1 AM
      grace: 7200, // 2 hours grace period
      tags: ['cleanup', 'weekly']
    }
  ]
}

// Uptime Kuma Configuration
export const uptimeKumaConfig = {
  webhookUrl: process.env.UPTIME_KUMA_WEBHOOK_URL,
  monitors: [
    {
      name: 'Workflo Website',
      url: process.env.NEXT_PUBLIC_APP_URL || 'https://workflo.it',
      interval: 60, // 1 minute
      retryInterval: 60,
      maxRetries: 3,
      upsideDown: false,
      acceptedStatusCodes: ['200-299'],
      tags: ['website', 'production']
    },
    {
      name: 'Workflo API',
      url: (process.env.NEXT_PUBLIC_APP_URL || 'https://workflo.it') + '/api/health',
      interval: 60,
      retryInterval: 60,
      maxRetries: 3,
      upsideDown: false,
      acceptedStatusCodes: ['200-299'],
      tags: ['api', 'production']
    }
  ]
}

// Status Page Configuration (for statuspage.io)
export const statusPageConfig = {
  apiKey: process.env.STATUSPAGE_API_KEY,
  pageId: process.env.STATUSPAGE_PAGE_ID,
  components: [
    {
      name: 'Website',
      description: 'Main Workflo website',
      status: 'operational', // operational, degraded_performance, partial_outage, major_outage
      group_id: null
    },
    {
      name: 'API',
      description: 'Workflo API services',
      status: 'operational',
      group_id: null
    },
    {
      name: 'Database',
      description: 'Database services',
      status: 'operational',
      group_id: null
    }
  ]
}

// Custom monitoring endpoints
export const customMonitors: UptimeMonitorConfig[] = [
  {
    name: 'Homepage Response Time',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://workflo.it',
    method: 'GET',
    timeout: 10000,
    interval: 300000, // 5 minutes
    retries: 3,
    expectedStatus: [200],
    alertChannels: ['email', 'slack']
  },
  {
    name: 'API Health Check',
    url: (process.env.NEXT_PUBLIC_APP_URL || 'https://workflo.it') + '/api/health',
    method: 'GET',
    timeout: 5000,
    interval: 60000, // 1 minute
    retries: 2,
    expectedStatus: [200],
    expectedContent: 'healthy',
    alertChannels: ['email', 'slack', 'webhook']
  },
  {
    name: 'Database Connectivity',
    url: (process.env.NEXT_PUBLIC_APP_URL || 'https://workflo.it') + '/api/health/database',
    method: 'GET',
    timeout: 10000,
    interval: 300000, // 5 minutes
    retries: 3,
    expectedStatus: [200],
    alertChannels: ['email', 'slack']
  },
  {
    name: 'Authentication Service',
    url: (process.env.NEXT_PUBLIC_APP_URL || 'https://workflo.it') + '/api/auth/status',
    method: 'GET',
    timeout: 5000,
    interval: 300000, // 5 minutes
    retries: 2,
    expectedStatus: [200],
    alertChannels: ['email']
  }
]

// Alert configuration
export const alertConfig = {
  email: {
    enabled: process.env.ENABLE_EMAIL_ALERTS === 'true',
    recipients: process.env.ALERT_EMAIL_RECIPIENTS?.split(',') || [],
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.resend.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    }
  },
  slack: {
    enabled: process.env.ENABLE_SLACK_ALERTS === 'true',
    webhookUrl: process.env.SLACK_WEBHOOK_URL,
    channel: process.env.SLACK_ALERT_CHANNEL || '#alerts',
    username: 'Workflo Monitor',
    iconEmoji: ':warning:'
  },
  webhook: {
    enabled: process.env.ENABLE_WEBHOOK_ALERTS === 'true',
    url: process.env.WEBHOOK_ALERT_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.WEBHOOK_AUTH_TOKEN ? `Bearer ${process.env.WEBHOOK_AUTH_TOKEN}` : undefined
    }
  }
}

// Performance monitoring thresholds
export const performanceThresholds = {
  responseTime: {
    warning: 2000, // 2 seconds
    critical: 5000 // 5 seconds
  },
  availability: {
    warning: 99.5, // 99.5%
    critical: 99.0  // 99%
  },
  errorRate: {
    warning: 1.0,  // 1%
    critical: 5.0  // 5%
  }
}