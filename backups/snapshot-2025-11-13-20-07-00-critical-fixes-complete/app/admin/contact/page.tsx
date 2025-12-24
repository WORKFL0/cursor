'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  Search,
  MoreHorizontal,
  RefreshCw,
  Eye,
  Reply,
  Trash2,
  Archive,
  AlertCircle,
  CheckCircle2,
  Clock,
  User
} from 'lucide-react'

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  source: 'contact_form' | 'newsletter' | 'quote_request' | 'support'
  status: 'unread' | 'read' | 'replied' | 'archived'
  priority: 'low' | 'normal' | 'high'
  tags: string[]
  submittedAt: string
  readAt?: string
  repliedAt?: string
  notes?: string
}

const getStatusIcon = (status: ContactSubmission['status']) => {
  switch (status) {
    case 'unread':
      return <AlertCircle className="h-4 w-4 text-orange-500" />
    case 'read':
      return <Eye className="h-4 w-4 text-blue-500" />
    case 'replied':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case 'archived':
      return <Archive className="h-4 w-4 text-gray-500" />
    default:
      return <MessageSquare className="h-4 w-4 text-gray-500" />
  }
}

const getStatusColor = (status: ContactSubmission['status']) => {
  switch (status) {
    case 'unread':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'read':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'replied':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'archived':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getPriorityColor = (priority: ContactSubmission['priority']) => {
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

const getSourceIcon = (source: ContactSubmission['source']) => {
  switch (source) {
    case 'contact_form':
      return <MessageSquare className="h-4 w-4" />
    case 'newsletter':
      return <Mail className="h-4 w-4" />
    case 'quote_request':
      return <Calendar className="h-4 w-4" />
    case 'support':
      return <AlertCircle className="h-4 w-4" />
    default:
      return <MessageSquare className="h-4 w-4" />
  }
}

export default function ContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [isReplying, setIsReplying] = useState(false)

  // Mock contact data for demonstration
  const mockSubmissions: ContactSubmission[] = [
    {
      id: '1',
      name: 'Jan de Vries',
      email: 'jan@example.com',
      phone: '+31 6 12345678',
      company: 'ABC Consultancy',
      subject: 'Interesse in IT-beheer diensten',
      message: 'Hallo, wij zijn op zoek naar een betrouwbare IT-partner voor ons groeiende bedrijf. Kunnen we een afspraak inplannen om onze wensen door te spreken?',
      source: 'contact_form',
      status: 'unread',
      priority: 'high',
      tags: ['IT-beheer', 'nieuwe klant'],
      submittedAt: '2024-01-15T14:30:00Z'
    },
    {
      id: '2',
      name: 'Marie van der Berg',
      email: 'marie@bedrijf.nl',
      company: 'Marketing Plus',
      subject: 'Offerte aanvraag - Cloud migratie',
      message: 'Wij willen onze on-premise infrastructuur migreren naar de cloud. Kunnen jullie hiervoor een offerte opstellen?',
      source: 'quote_request',
      status: 'read',
      priority: 'normal',
      tags: ['cloud', 'migratie', 'offerte'],
      submittedAt: '2024-01-14T11:20:00Z',
      readAt: '2024-01-14T12:00:00Z'
    },
    {
      id: '3',
      name: 'Peter Janssen',
      email: 'p.janssen@startup.com',
      phone: '+31 20 1234567',
      company: 'InnoTech Startup',
      subject: 'Support voor bestaande klant',
      message: 'We hebben problemen met onze email server. Deze is sinds gisteren niet meer bereikbaar.',
      source: 'support',
      status: 'replied',
      priority: 'high',
      tags: ['support', 'email server', 'urgent'],
      submittedAt: '2024-01-13T09:15:00Z',
      readAt: '2024-01-13T09:30:00Z',
      repliedAt: '2024-01-13T10:45:00Z',
      notes: 'Email server issue resolved. DNS update was needed.'
    },
    {
      id: '4',
      name: 'Lisa Wang',
      email: 'lisa@newsletter.com',
      subject: 'Nieuwsbrief aanmelding',
      message: 'Ik zou graag jullie nieuwsbrief willen ontvangen.',
      source: 'newsletter',
      status: 'archived',
      priority: 'low',
      tags: ['nieuwsbrief'],
      submittedAt: '2024-01-12T16:45:00Z'
    }
  ]

  // Stats calculation
  const stats = {
    total: submissions.length,
    unread: submissions.filter(s => s.status === 'unread').length,
    read: submissions.filter(s => s.status === 'read').length,
    replied: submissions.filter(s => s.status === 'replied').length,
    archived: submissions.filter(s => s.status === 'archived').length
  }

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true)
      try {
        // For demo purposes, we'll use mock data
        // In real implementation:
        // const token = localStorage.getItem('admin_token')
        // const response = await fetch('/api/contact', { headers: { 'Authorization': `Bearer ${token}` } })
        
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
        setSubmissions(mockSubmissions)
        setFilteredSubmissions(mockSubmissions)
      } catch (error) {
        console.error('Failed to fetch submissions:', error)
        setError('Failed to load contact submissions')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  // Filter submissions
  useEffect(() => {
    let filtered = submissions

    if (searchQuery) {
      filtered = filtered.filter(submission =>
        submission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.company?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(submission => submission.status === statusFilter)
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(submission => submission.source === sourceFilter)
    }

    setFilteredSubmissions(filtered)
  }, [submissions, searchQuery, statusFilter, sourceFilter])

  // Mark as read
  const markAsRead = async (submissionId: string) => {
    setSubmissions(prev => prev.map(submission =>
      submission.id === submissionId && submission.status === 'unread'
        ? { ...submission, status: 'read' as const, readAt: new Date().toISOString() }
        : submission
    ))
  }

  // Update status
  const updateStatus = async (submissionId: string, status: ContactSubmission['status']) => {
    setSubmissions(prev => prev.map(submission =>
      submission.id === submissionId
        ? { ...submission, status }
        : submission
    ))
  }

  // Send reply
  const sendReply = async () => {
    if (!selectedSubmission || !replyMessage.trim()) return

    setIsReplying(true)
    try {
      // In real implementation:
      // const token = localStorage.getItem('admin_token')
      // await fetch(`/api/contact/${selectedSubmission.id}/reply`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: replyMessage })
      // })
      
      setSubmissions(prev => prev.map(submission =>
        submission.id === selectedSubmission.id
          ? { ...submission, status: 'replied' as const, repliedAt: new Date().toISOString() }
          : submission
      ))
      
      setReplyMessage('')
      setIsViewDialogOpen(false)
    } catch (error) {
      console.error('Failed to send reply:', error)
    } finally {
      setIsReplying(false)
    }
  }

  // Delete submission
  const deleteSubmission = async (submissionId: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return
    
    setSubmissions(prev => prev.filter(submission => submission.id !== submissionId))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Contact Forms</h1>
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
          <h1 className="text-3xl font-bold">Contact Forms</h1>
          <p className="text-muted-foreground">
            Manage contact form submissions and customer inquiries
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
              <MessageSquare className="h-5 w-5 text-gray-500" />
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
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.unread}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.read}</p>
                <p className="text-sm text-muted-foreground">Read</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.replied}</p>
                <p className="text-sm text-muted-foreground">Replied</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Archive className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-2xl font-bold">{stats.archived}</p>
                <p className="text-sm text-muted-foreground">Archived</p>
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
                placeholder="Search submissions..."
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
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="contact_form">Contact Form</SelectItem>
                <SelectItem value="quote_request">Quote Request</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Submissions ({filteredSubmissions.length})</CardTitle>
          <CardDescription>
            {filteredSubmissions.length === 0 
              ? 'No submissions found'
              : `Showing ${filteredSubmissions.length} submission${filteredSubmissions.length !== 1 ? 's' : ''}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground mt-2">No submissions found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id} className={submission.status === 'unread' ? 'bg-blue-50' : ''}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(submission.status)}
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{submission.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{submission.email}</span>
                        </div>
                        {submission.phone && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{submission.phone}</span>
                          </div>
                        )}
                        {submission.company && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{submission.company}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium line-clamp-1">{submission.subject}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {submission.message}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getSourceIcon(submission.source)}
                        <span className="text-sm capitalize">
                          {submission.source.replace('_', ' ')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPriorityColor(submission.priority)}>
                        {submission.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>
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
                          <DropdownMenuItem onClick={() => {
                            setSelectedSubmission(submission)
                            setIsViewDialogOpen(true)
                            if (submission.status === 'unread') {
                              markAsRead(submission.id)
                            }
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {submission.status !== 'archived' && (
                            <DropdownMenuItem onClick={() => updateStatus(submission.id, 'archived')}>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => deleteSubmission(submission.id)}
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

      {/* View Submission Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle>Contact Submission Details</DialogTitle>
                <DialogDescription>
                  From {selectedSubmission.name} - {new Date(selectedSubmission.submittedAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <strong>Name:</strong> {selectedSubmission.name}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedSubmission.email}
                  </div>
                  {selectedSubmission.phone && (
                    <div>
                      <strong>Phone:</strong> {selectedSubmission.phone}
                    </div>
                  )}
                  {selectedSubmission.company && (
                    <div>
                      <strong>Company:</strong> {selectedSubmission.company}
                    </div>
                  )}
                  <div>
                    <strong>Source:</strong> 
                    <Badge variant="outline" className="ml-2">
                      {selectedSubmission.source.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <strong>Priority:</strong>
                    <Badge variant="outline" className={`ml-2 ${getPriorityColor(selectedSubmission.priority)}`}>
                      {selectedSubmission.priority}
                    </Badge>
                  </div>
                </div>

                {/* Subject and Message */}
                <div className="space-y-4">
                  <div>
                    <strong>Subject:</strong>
                    <p className="mt-1 p-3 bg-gray-50 rounded">{selectedSubmission.subject}</p>
                  </div>
                  
                  <div>
                    <strong>Message:</strong>
                    <div className="mt-1 p-3 bg-gray-50 rounded whitespace-pre-wrap">
                      {selectedSubmission.message}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {selectedSubmission.tags.length > 0 && (
                  <div>
                    <strong>Tags:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedSubmission.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedSubmission.notes && (
                  <div>
                    <strong>Notes:</strong>
                    <p className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded">
                      {selectedSubmission.notes}
                    </p>
                  </div>
                )}

                {/* Status History */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                  {selectedSubmission.readAt && (
                    <p>Read: {new Date(selectedSubmission.readAt).toLocaleString()}</p>
                  )}
                  {selectedSubmission.repliedAt && (
                    <p>Replied: {new Date(selectedSubmission.repliedAt).toLocaleString()}</p>
                  )}
                </div>

                {/* Reply Section */}
                {selectedSubmission.status !== 'replied' && selectedSubmission.status !== 'archived' && (
                  <div className="space-y-4 border-t pt-4">
                    <strong>Send Reply:</strong>
                    <Textarea
                      placeholder="Type your reply here..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={4}
                    />
                    <Button onClick={sendReply} disabled={isReplying || !replyMessage.trim()}>
                      {isReplying ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Reply className="mr-2 h-4 w-4" />
                          Send Reply
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => updateStatus(selectedSubmission.id, 'archived')}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </Button>
                  <Button
                    variant="outline" 
                    onClick={() => setIsViewDialogOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}