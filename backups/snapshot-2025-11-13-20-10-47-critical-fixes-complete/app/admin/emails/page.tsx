'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Mail, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search,
  MoreHorizontal,
  RefreshCw,
  Eye,
  Trash2,
  AlertTriangle
} from 'lucide-react'

interface EmailJob {
  id: string
  to: string
  from: string
  subject: string
  template?: string
  status: 'pending' | 'sending' | 'sent' | 'failed'
  priority: 'low' | 'normal' | 'high'
  attempts: number
  maxAttempts: number
  errorMessage?: string
  scheduledFor?: string
  sentAt?: string
  createdAt: string
  updatedAt: string
}

const getStatusIcon = (status: EmailJob['status']) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-orange-500" />
    case 'sending':
      return <Send className="h-4 w-4 text-blue-500" />
    case 'sent':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <Mail className="h-4 w-4 text-gray-500" />
  }
}

const getStatusColor = (status: EmailJob['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'sending':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'sent':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getPriorityColor = (priority: EmailJob['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'normal':
      return 'bg-blue-100 text-blue-800'
    case 'low':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function EmailQueuePage() {
  const [emails, setEmails] = useState<EmailJob[]>([])
  const [filteredEmails, setFilteredEmails] = useState<EmailJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedEmail, setSelectedEmail] = useState<EmailJob | null>(null)

  // Mock email data for demonstration
  const mockEmails: EmailJob[] = [
    {
      id: '1',
      to: 'klant@example.com',
      from: 'noreply@workflo.it',
      subject: 'Welkom bij Workflo - Uw account is aangemaakt',
      template: 'welcome',
      status: 'sent',
      priority: 'high',
      attempts: 1,
      maxAttempts: 3,
      sentAt: '2024-01-15T14:30:00Z',
      createdAt: '2024-01-15T14:29:45Z',
      updatedAt: '2024-01-15T14:30:00Z'
    },
    {
      id: '2',
      to: 'prospect@bedrijf.nl',
      from: 'noreply@workflo.it',
      subject: 'Bedankt voor uw interesse in onze IT-diensten',
      template: 'contact-response',
      status: 'pending',
      priority: 'normal',
      attempts: 0,
      maxAttempts: 3,
      scheduledFor: '2024-01-16T09:00:00Z',
      createdAt: '2024-01-15T16:45:00Z',
      updatedAt: '2024-01-15T16:45:00Z'
    },
    {
      id: '3',
      to: 'newsletter@example.com',
      from: 'newsletter@workflo.it',
      subject: 'Workflo Nieuwsbrief - Januari 2024',
      template: 'newsletter',
      status: 'failed',
      priority: 'low',
      attempts: 3,
      maxAttempts: 3,
      errorMessage: 'SMTP Error: Could not connect to mail server',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:15:00Z'
    },
    {
      id: '4',
      to: 'support@klant.com',
      from: 'support@workflo.it', 
      subject: 'Ticket #12345 - Status update',
      template: 'support-update',
      status: 'sending',
      priority: 'high',
      attempts: 1,
      maxAttempts: 3,
      createdAt: '2024-01-15T15:20:00Z',
      updatedAt: '2024-01-15T15:21:00Z'
    }
  ]

  // Stats calculation
  const stats = {
    total: emails.length,
    pending: emails.filter(e => e.status === 'pending').length,
    sending: emails.filter(e => e.status === 'sending').length,
    sent: emails.filter(e => e.status === 'sent').length,
    failed: emails.filter(e => e.status === 'failed').length
  }

  useEffect(() => {
    const fetchEmails = async () => {
      setIsLoading(true)
      try {
        // For demo purposes, we'll use mock data
        // In real implementation:
        // const token = localStorage.getItem('admin_token')
        // const response = await fetch('/api/v1/emails', { headers: { 'Authorization': `Bearer ${token}` } })
        
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
        setEmails(mockEmails)
        setFilteredEmails(mockEmails)
      } catch (error) {
        console.error('Failed to fetch emails:', error)
        setError('Failed to load email queue')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmails()
  }, [])

  // Filter emails
  useEffect(() => {
    let filtered = emails

    if (searchQuery) {
      filtered = filtered.filter(email =>
        email.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.from.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(email => email.status === statusFilter)
    }

    setFilteredEmails(filtered)
  }, [emails, searchQuery, statusFilter])

  // Retry email
  const retryEmail = async (emailId: string) => {
    try {
      // In real implementation:
      // const token = localStorage.getItem('admin_token')
      // await fetch(`/api/v1/emails/${emailId}/retry`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } })
      
      setEmails(prev => prev.map(email =>
        email.id === emailId
          ? { ...email, status: 'pending' as const, attempts: 0 }
          : email
      ))
    } catch (error) {
      console.error('Failed to retry email:', error)
    }
  }

  // Delete email
  const deleteEmail = async (emailId: string) => {
    if (!confirm('Are you sure you want to delete this email from the queue?')) return
    
    try {
      // In real implementation:
      // const token = localStorage.getItem('admin_token')
      // await fetch(`/api/v1/emails/${emailId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
      
      setEmails(prev => prev.filter(email => email.id !== emailId))
    } catch (error) {
      console.error('Failed to delete email:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Email Queue</h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Queue</h1>
          <p className="text-muted-foreground">
            Monitor and manage email delivery status
          </p>
        </div>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Send className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.sending}</p>
                <p className="text-sm text-muted-foreground">Sending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.sent}</p>
                <p className="text-sm text-muted-foreground">Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.failed}</p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sending">Sending</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Email Queue Table */}
      <Card>
        <CardHeader>
          <CardTitle>Email Queue ({filteredEmails.length})</CardTitle>
          <CardDescription>
            {filteredEmails.length === 0 
              ? 'No emails found'
              : `Showing ${filteredEmails.length} email${filteredEmails.length !== 1 ? 's' : ''}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : filteredEmails.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground mt-2">No emails found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(email.status)}
                        <Badge className={getStatusColor(email.status)}>
                          {email.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{email.to}</p>
                        <p className="text-sm text-muted-foreground">from {email.from}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium line-clamp-1">{email.subject}</p>
                        {email.template && (
                          <p className="text-sm text-muted-foreground">Template: {email.template}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPriorityColor(email.priority)}>
                        {email.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{email.attempts}/{email.maxAttempts}</span>
                        {email.attempts >= email.maxAttempts && email.status === 'failed' && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(email.createdAt).toLocaleString()}
                      </div>
                      {email.scheduledFor && (
                        <div className="text-xs text-muted-foreground">
                          Scheduled: {new Date(email.scheduledFor).toLocaleString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setSelectedEmail(email)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {email.status === 'failed' && (
                            <DropdownMenuItem onClick={() => retryEmail(email.id)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Retry
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => deleteEmail(email.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Email Details Dialog */}
      <Dialog open={!!selectedEmail} onOpenChange={() => setSelectedEmail(null)}>
        <DialogContent className="max-w-2xl">
          {selectedEmail && (
            <>
              <DialogHeader>
                <DialogTitle>Email Details</DialogTitle>
                <DialogDescription>
                  Detailed information about this email
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Status:</strong>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(selectedEmail.status)}
                      <Badge className={getStatusColor(selectedEmail.status)}>
                        {selectedEmail.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <strong>Priority:</strong>
                    <Badge variant="outline" className={`${getPriorityColor(selectedEmail.priority)} mt-1`}>
                      {selectedEmail.priority}
                    </Badge>
                  </div>
                  <div>
                    <strong>To:</strong> {selectedEmail.to}
                  </div>
                  <div>
                    <strong>From:</strong> {selectedEmail.from}
                  </div>
                  <div>
                    <strong>Attempts:</strong> {selectedEmail.attempts}/{selectedEmail.maxAttempts}
                  </div>
                  <div>
                    <strong>Template:</strong> {selectedEmail.template || 'None'}
                  </div>
                  <div>
                    <strong>Created:</strong> {new Date(selectedEmail.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <strong>Updated:</strong> {new Date(selectedEmail.updatedAt).toLocaleString()}
                  </div>
                  {selectedEmail.scheduledFor && (
                    <div>
                      <strong>Scheduled:</strong> {new Date(selectedEmail.scheduledFor).toLocaleString()}
                    </div>
                  )}
                  {selectedEmail.sentAt && (
                    <div>
                      <strong>Sent:</strong> {new Date(selectedEmail.sentAt).toLocaleString()}
                    </div>
                  )}
                </div>
                
                <div>
                  <strong>Subject:</strong>
                  <p className="mt-1 p-2 bg-gray-100 rounded">{selectedEmail.subject}</p>
                </div>
                
                {selectedEmail.errorMessage && (
                  <div>
                    <strong>Error Message:</strong>
                    <p className="mt-1 p-2 bg-red-50 border border-red-200 rounded text-red-700">
                      {selectedEmail.errorMessage}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}