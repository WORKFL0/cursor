'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { 
  Lock, User, Users, Shield, Key, Mail, UserPlus, 
  AlertCircle, CheckCircle, Settings, LogOut, Eye, EyeOff,
  UserCheck, UserX, History, ArrowLeft
} from 'lucide-react'

interface CMSUser {
  id: string
  email: string
  username: string
  role: 'admin' | 'editor' | 'viewer'
  is_active: boolean
  last_login?: string
  created_at: string
}

export default function SecurityPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [users, setUsers] = useState<CMSUser[]>([])
  const [newUser, setNewUser] = useState({
    email: '',
    username: '',
    password: '',
    role: 'editor' as 'admin' | 'editor' | 'viewer'
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [activeTab, setActiveTab] = useState('password')
  const [currentUser, setCurrentUser] = useState<CMSUser | null>(null)

  useEffect(() => {
    fetchCurrentUser()
    fetchUsers()
  }, [])

  const fetchCurrentUser = async () => {
    // This would fetch from your auth endpoint
    // For now, mock data
    setCurrentUser({
      id: '1',
      email: 'admin@workflo.it',
      username: 'admin',
      role: 'admin',
      is_active: true,
      created_at: new Date().toISOString()
    })
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/cms/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Wachtwoorden komen niet overeen' })
      return
    }
    
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Wachtwoord moet minimaal 8 karakters zijn' })
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/cms/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      })
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Wachtwoord succesvol gewijzigd' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || 'Wachtwoord wijzigen mislukt' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Er is iets misgegaan' })
    } finally {
      setLoading(false)
    }
  }

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newUser.email || !newUser.username || !newUser.password) {
      setMessage({ type: 'error', text: 'Vul alle velden in' })
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/cms/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Gebruiker succesvol toegevoegd' })
        setNewUser({ email: '', username: '', password: '', role: 'editor' })
        fetchUsers()
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || 'Gebruiker toevoegen mislukt' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Er is iets misgegaan' })
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/cms/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: isActive })
      })
      
      if (response.ok) {
        fetchUsers()
        setMessage({ 
          type: 'success', 
          text: isActive ? 'Gebruiker geactiveerd' : 'Gebruiker gedeactiveerd' 
        })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Status wijzigen mislukt' })
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) return
    
    try {
      const response = await fetch(`/api/cms/users/${userId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchUsers()
        setMessage({ type: 'success', text: 'Gebruiker verwijderd' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Verwijderen mislukt' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push('/cms')}
              variant="ghost"
              size="icon"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                Security & Users
              </h1>
              <p className="text-muted-foreground">
                Beheer wachtwoorden en gebruikers
              </p>
            </div>
          </div>
          
          {currentUser && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Ingelogd als</p>
              <p className="font-medium">{currentUser.username}</p>
              <Badge variant={currentUser.role === 'admin' ? 'default' : 'secondary'}>
                {currentUser.role}
              </Badge>
            </div>
          )}
        </div>

        {/* Alert Messages */}
        {message && (
          <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
            {message.type === 'error' ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Wachtwoord
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Gebruikers
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Audit Log
            </TabsTrigger>
          </TabsList>

          {/* Password Change Tab */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Wijzig Wachtwoord</CardTitle>
                <CardDescription>
                  Update je wachtwoord regelmatig voor betere beveiliging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current">Huidig Wachtwoord</Label>
                    <Input
                      id="current"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new">Nieuw Wachtwoord</Label>
                    <div className="relative">
                      <Input
                        id="new"
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Bevestig Nieuw Wachtwoord</Label>
                    <Input
                      id="confirm"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Bezig...' : 'Wijzig Wachtwoord'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management Tab */}
          <TabsContent value="users">
            <div className="space-y-6">
              {/* Add New User */}
              <Card>
                <CardHeader>
                  <CardTitle>Nieuwe Gebruiker Uitnodigen</CardTitle>
                  <CardDescription>
                    Voeg een nieuwe gebruiker toe aan het CMS
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInviteUser} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          placeholder="user@workflo.it"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="username">Gebruikersnaam</Label>
                        <Input
                          id="username"
                          type="text"
                          value={newUser.username}
                          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                          placeholder="gebruiker"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Tijdelijk Wachtwoord</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          placeholder="Min. 8 karakters"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="role">Rol</Label>
                        <Select 
                          value={newUser.role}
                          onValueChange={(value: 'admin' | 'editor' | 'viewer') => 
                            setNewUser({ ...newUser, role: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={loading} className="w-full">
                      <UserPlus className="h-4 w-4 mr-2" />
                      {loading ? 'Bezig...' : 'Gebruiker Toevoegen'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Users List */}
              <Card>
                <CardHeader>
                  <CardTitle>Huidige Gebruikers</CardTitle>
                  <CardDescription>
                    Beheer bestaande gebruikers en hun rechten
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Geen gebruikers gevonden
                      </p>
                    ) : (
                      users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                              {user.is_active ? (
                                <UserCheck className="h-5 w-5 text-primary" />
                              ) : (
                                <UserX className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{user.username}</p>
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                  {user.role}
                                </Badge>
                                {!user.is_active && (
                                  <Badge variant="destructive">Inactive</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              {user.last_login && (
                                <p className="text-xs text-muted-foreground">
                                  Last login: {new Date(user.last_login).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={user.is_active}
                              onCheckedChange={(checked) => toggleUserStatus(user.id, checked)}
                              disabled={user.id === currentUser?.id}
                            />
                            {user.id !== currentUser?.id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteUser(user.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                Verwijder
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>
                  Bekijk alle security-gerelateerde activiteiten
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Audit log komt binnenkort beschikbaar</p>
                  <p className="text-sm">Hier zie je straks alle login pogingen, wachtwoord wijzigingen en andere security events</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}