'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { 
  Settings, 
  Save, 
  Users, 
  Mail, 
  Globe, 
  Shield, 
  Database,
  AlertCircle,
  CheckCircle2,
  Key,
  Bell,
  Palette
} from 'lucide-react'

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Workflo B.V.',
    siteDescription: 'Professional IT Services & Solutions',
    adminEmail: 'admin@workflo.it',
    contactEmail: 'info@workflo.it',
    phone: '+31 20 123 4567',
    address: 'Amsterdam, Netherlands',
    timezone: 'Europe/Amsterdam',
    language: 'nl'
  })

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'noreply@workflo.it',
    smtpPassword: '••••••••',
    fromName: 'Workflo B.V.',
    fromEmail: 'noreply@workflo.it',
    enableEmailQueue: true,
    maxRetries: 3
  })

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    enableIpWhitelist: false,
    allowedIps: '',
    enableSslOnly: true,
    enableCsrf: true
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailOnNewContact: true,
    emailOnNewArticle: false,
    emailOnSystemError: true,
    webhookUrl: '',
    enableSlackNotifications: false,
    slackWebhook: ''
  })

  const handleSave = async (category: string) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // In real implementation, save settings via API
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess(`${category} settings saved successfully!`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(`Failed to save ${category} settings`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Settings className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure your admin panel and system preferences
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">
            <Globe className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic website and company information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={generalSettings.adminEmail}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={generalSettings.phone}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <Button onClick={() => handleSave('General')} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save General Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                SMTP settings for outgoing emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableEmailQueue">Enable Email Queue</Label>
                    <p className="text-sm text-muted-foreground">Use background queue for email delivery</p>
                  </div>
                  <Switch
                    id="enableEmailQueue"
                    checked={emailSettings.enableEmailQueue}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, enableEmailQueue: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxRetries">Max Retry Attempts</Label>
                  <Input
                    id="maxRetries"
                    type="number"
                    value={emailSettings.maxRetries}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, maxRetries: parseInt(e.target.value) }))}
                    className="w-32"
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('Email')} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Email Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <CardDescription>
                Authentication and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableTwoFactor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                  </div>
                  <Switch
                    id="enableTwoFactor"
                    checked={securitySettings.enableTwoFactor}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enableTwoFactor: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableSslOnly">SSL Only</Label>
                    <p className="text-sm text-muted-foreground">Force HTTPS connections</p>
                  </div>
                  <Switch
                    id="enableSslOnly"
                    checked={securitySettings.enableSslOnly}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enableSslOnly: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableCsrf">CSRF Protection</Label>
                    <p className="text-sm text-muted-foreground">Enable Cross-Site Request Forgery protection</p>
                  </div>
                  <Switch
                    id="enableCsrf"
                    checked={securitySettings.enableCsrf}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enableCsrf: checked }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableIpWhitelist">IP Whitelist</Label>
                    <p className="text-sm text-muted-foreground">Restrict admin access to specific IPs</p>
                  </div>
                  <Switch
                    id="enableIpWhitelist"
                    checked={securitySettings.enableIpWhitelist}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enableIpWhitelist: checked }))}
                  />
                </div>

                {securitySettings.enableIpWhitelist && (
                  <div className="space-y-2">
                    <Label htmlFor="allowedIps">Allowed IP Addresses</Label>
                    <Textarea
                      id="allowedIps"
                      placeholder="192.168.1.1&#10;10.0.0.1&#10;203.0.113.0/24"
                      value={securitySettings.allowedIps}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, allowedIps: e.target.value }))}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">One IP address or CIDR block per line</p>
                  </div>
                )}
              </div>

              <Button onClick={() => handleSave('Security')} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Security Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailOnNewContact">New Contact Notifications</Label>
                    <p className="text-sm text-muted-foreground">Email alerts for new contact form submissions</p>
                  </div>
                  <Switch
                    id="emailOnNewContact"
                    checked={notificationSettings.emailOnNewContact}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailOnNewContact: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailOnNewArticle">New Article Notifications</Label>
                    <p className="text-sm text-muted-foreground">Email alerts when articles are published</p>
                  </div>
                  <Switch
                    id="emailOnNewArticle"
                    checked={notificationSettings.emailOnNewArticle}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailOnNewArticle: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailOnSystemError">System Error Notifications</Label>
                    <p className="text-sm text-muted-foreground">Email alerts for system errors and failures</p>
                  </div>
                  <Switch
                    id="emailOnSystemError"
                    checked={notificationSettings.emailOnSystemError}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailOnSystemError: checked }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://your-app.com/webhook"
                    value={notificationSettings.webhookUrl}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">Optional: Receive notifications via webhook</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableSlackNotifications">Slack Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications to Slack</p>
                  </div>
                  <Switch
                    id="enableSlackNotifications"
                    checked={notificationSettings.enableSlackNotifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, enableSlackNotifications: checked }))}
                  />
                </div>

                {notificationSettings.enableSlackNotifications && (
                  <div className="space-y-2">
                    <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
                    <Input
                      id="slackWebhook"
                      placeholder="https://hooks.slack.com/services/..."
                      value={notificationSettings.slackWebhook}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, slackWebhook: e.target.value }))}
                    />
                  </div>
                )}
              </div>

              <Button onClick={() => handleSave('Notification')} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Notification Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Current system status and version information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <strong>Version:</strong> 1.0.0
            </div>
            <div>
              <strong>Environment:</strong> 
              <Badge variant="outline" className="ml-2">Development</Badge>
            </div>
            <div>
              <strong>Database:</strong> 
              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">Connected</Badge>
            </div>
            <div>
              <strong>Cache:</strong> 
              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}