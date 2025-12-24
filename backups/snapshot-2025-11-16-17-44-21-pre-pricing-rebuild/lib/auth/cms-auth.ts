/**
 * CMS Authentication Service
 * Handles user authentication, session management, and role-based access control
 */

import { createAdminClient } from '@/lib/supabase/client'
import { CMSUser, UserSession, UserRole, CMSSession, LoginCredentials, ChangePasswordData, ResetPasswordData } from '@/lib/types/database'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

// Configuration
const SESSION_COOKIE_NAME = 'cms-session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production'

// Types for internal use
interface SessionPayload {
  userId: string
  username: string
  role: UserRole
  exp: number
}

interface AuthResult {
  success: boolean
  user?: CMSUser
  session?: UserSession
  error?: string
  message?: string
}

export class CMSAuthService {
  private static supabase = createAdminClient()

  /**
   * Authenticate user with email/username and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const { email, password, remember = false } = credentials
      
      // Find user by email or username
      if (!this.supabase) {
        return { success: false, error: 'Database connection not available' }
      }
      
      const { data: users, error: userError } = await this.supabase
        .from('cms_users')
        .select('*')
        .or(`email.eq.${email},username.eq.${email}`)
        .eq('is_active', true)
        .limit(1)

      if (userError) {
        console.error('Database error during login:', userError)
        return { success: false, error: 'Database error occurred' }
      }

      if (!users || users.length === 0) {
        // Add delay to prevent timing attacks
        await new Promise(resolve => setTimeout(resolve, 1000))
        return { success: false, error: 'Invalid credentials' }
      }

      const user = users[0]
      if (!user) {
        return { success: false, error: 'Invalid credentials' }
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, (user as any).password_hash)
      if (!isPasswordValid) {
        // Log failed attempt
        await this.logAuditEvent((user as any).id, 'failed_login', 'authentication', null, {
          email,
          reason: 'invalid_password'
        })
        return { success: false, error: 'Invalid credentials' }
      }

      // Create session
      const sessionDuration = remember ? 30 * 24 * 60 * 60 * 1000 : SESSION_DURATION // 30 days if remembered
      const sessionResult = await this.createSession(user, sessionDuration)
      
      if (!sessionResult.success) {
        return sessionResult
      }

      // Update last login
      await (this.supabase
        .from('cms_users') as any)
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', (user as any).id)

      // Log successful login
      await this.logAuditEvent((user as any).id, 'login', 'authentication', (user as any).id, {
        username: (user as any).username,
        email: (user as any).email
      })

      return {
        success: true,
        user: { ...(user as any), last_login_at: new Date().toISOString() },
        session: sessionResult.session
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Authentication service error' }
    }
  }

  /**
   * Create a new session for authenticated user
   */
  static async createSession(user: CMSUser, duration = SESSION_DURATION): Promise<AuthResult> {
    try {
      const expiresAt = new Date(Date.now() + duration)
      const sessionToken = this.generateSessionToken({
        userId: (user as any).id,
        username: (user as any).username,
        role: (user as any).role,
        exp: Math.floor(expiresAt.getTime() / 1000)
      })

      // Store session in database
      if (!this.supabase) {
        return { success: false, error: 'Database connection not available' }
      }
      
      const { data: session, error } = await (this.supabase
        .from('user_sessions') as any)
        .insert({
          user_id: (user as any).id,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
          is_active: true
        })
        .select()
        .single()

      if (error) {
        console.error('Session creation error:', error)
        return { success: false, error: 'Failed to create session' }
      }

      return { success: true, session }
    } catch (error) {
      console.error('Create session error:', error)
      return { success: false, error: 'Session service error' }
    }
  }

  /**
   * Validate session token and return user data
   */
  static async validateSession(token: string): Promise<CMSSession | null> {
    try {
      // Decode and verify JWT
      const payload = jwt.verify(token, JWT_SECRET) as SessionPayload
      
      // Check if token is expired
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null
      }

      // Get session from database
      if (!this.supabase) {
        return null
      }
      
      const { data: sessions, error: sessionError } = await this.supabase
        .from('user_sessions')
        .select(`
          *,
          cms_users (*)
        `)
        .eq('session_token', token)
        .eq('is_active', true)
        .gte('expires_at', new Date().toISOString())
        .limit(1)

      if (sessionError || !sessions || sessions.length === 0) {
        return null
      }

      const session = sessions[0]
      if (!session) {
        return null
      }
      
      const user = (session as any).cms_users as CMSUser

      if (!user || !user.is_active) {
        // Deactivate invalid session
        await (this.supabase
          .from('user_sessions') as any)
          .update({ is_active: false })
          .eq('id', (session as any).id)
        return null
      }

      return {
        user,
        session: {
          id: (session as any).id,
          user_id: (session as any).user_id,
          session_token: (session as any).session_token,
          expires_at: (session as any).expires_at,
          ip_address: (session as any).ip_address,
          user_agent: (session as any).user_agent,
          is_active: (session as any).is_active,
          created_at: (session as any).created_at,
          updated_at: (session as any).updated_at
        },
        expires: (session as any).expires_at
      }
    } catch (error) {
      console.error('Session validation error:', error)
      return null
    }
  }

  /**
   * Logout user and invalidate session
   */
  static async logout(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get session info for audit log
      const sessionData = await this.validateSession(token)
      
      // Invalidate session in database
      if (!this.supabase) {
        return { success: false, error: 'Database connection not available' }
      }
      
      const { error } = await (this.supabase
        .from('user_sessions') as any)
        .update({ is_active: false })
        .eq('session_token', token)

      if (error) {
        console.error('Logout error:', error)
        return { success: false, error: 'Failed to invalidate session' }
      }

      // Log logout event
      if (sessionData) {
        await this.logAuditEvent(
          sessionData.user.id, 
          'logout', 
          'authentication', 
          sessionData.user.id,
          { username: sessionData.user.username }
        )
      }

      return { success: true }
    } catch (error) {
      console.error('Logout service error:', error)
      return { success: false, error: 'Logout service error' }
    }
  }

  /**
   * Change user password
   */
  static async changePassword(userId: string, data: ChangePasswordData): Promise<{ success: boolean; error?: string }> {
    try {
      const { currentPassword, newPassword, confirmPassword } = data

      if (newPassword !== confirmPassword) {
        return { success: false, error: 'New passwords do not match' }
      }

      // Get user
      if (!this.supabase) {
        return { success: false, error: 'Database connection not available' }
      }
      
      const { data: user, error: userError } = await this.supabase
        .from('cms_users')
        .select('password_hash')
        .eq('id', userId)
        .single()

      if (userError || !user) {
        return { success: false, error: 'User not found' }
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, (user as any).password_hash)
      if (!isCurrentPasswordValid) {
        return { success: false, error: 'Current password is incorrect' }
      }

      // Hash new password
      const saltRounds = 12
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds)

      // Update password
      const { error: updateError } = await (this.supabase
        .from('cms_users') as any)
        .update({ 
          password_hash: newPasswordHash,
          password_changed_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) {
        console.error('Password update error:', updateError)
        return { success: false, error: 'Failed to update password' }
      }

      // Invalidate all other sessions for this user
      await (this.supabase
        .from('user_sessions') as any)
        .update({ is_active: false })
        .eq('user_id', userId)

      // Log password change
      await this.logAuditEvent(userId, 'password_changed', 'user', userId)

      return { success: true }
    } catch (error) {
      console.error('Change password error:', error)
      return { success: false, error: 'Password change service error' }
    }
  }

  /**
   * Check if user has required role
   */
  static hasRole(user: CMSUser, requiredRole: UserRole | UserRole[]): boolean {
    if (!user || !user.is_active) return false

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    return roles.includes(user.role)
  }

  /**
   * Check if user has permission for specific action
   */
  static hasPermission(user: CMSUser, action: string, resource?: string): boolean {
    if (!user || !user.is_active) return false

    // Admin can do everything
    if (user.role === 'admin') return true

    // Define permission matrix
    const permissions = {
      editor: [
        'articles.read',
        'articles.create',
        'articles.update',
        'articles.delete',
        'categories.read',
        'tags.read',
        'tags.create',
        'media.read',
        'media.create',
        'media.update'
      ],
      viewer: [
        'articles.read',
        'categories.read',
        'tags.read',
        'media.read'
      ]
    }

    const userPermissions = permissions[user.role] || []
    const fullPermission = resource ? `${resource}.${action}` : action
    
    return userPermissions.includes(fullPermission) || userPermissions.includes(action)
  }

  /**
   * Middleware function for route protection
   */
  static async requireAuth(
    request: NextRequest, 
    requiredRole?: UserRole | UserRole[]
  ): Promise<{ user: CMSUser; session: UserSession } | NextResponse> {
    try {
      const cookieStore = await cookies()
      const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
      
      if (!sessionCookie) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      const sessionData = await this.validateSession(sessionCookie.value)
      if (!sessionData) {
        const response = NextResponse.json(
          { error: 'Invalid or expired session' },
          { status: 401 }
        )
        response.cookies.delete(SESSION_COOKIE_NAME)
        return response
      }

      // Check role if required
      if (requiredRole && !this.hasRole(sessionData.user, requiredRole)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }

      return { user: sessionData.user, session: sessionData.session }
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { error: 'Authentication service error' },
        { status: 500 }
      )
    }
  }

  /**
   * Generate secure session token
   */
  private static generateSessionToken(payload: SessionPayload): string {
    return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' })
  }

  /**
   * Log audit event
   */
  private static async logAuditEvent(
    userId: string,
    action: string,
    resourceType: string,
    resourceId?: string | null,
    data?: any
  ): Promise<void> {
    try {
      if (!this.supabase) return
      
      await (this.supabase
        .from('audit_logs') as any)
        .insert({
          user_id: userId,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          new_values: data
        })
    } catch (error) {
      console.error('Audit log error:', error)
      // Don't throw - audit logging shouldn't break the main flow
    }
  }

  /**
   * Cleanup expired sessions
   */
  static async cleanupExpiredSessions(): Promise<void> {
    try {
      if (!this.supabase) return
      
      const { error } = await (this.supabase
        .from('user_sessions') as any)
        .update({ is_active: false })
        .lt('expires_at', new Date().toISOString())

      if (error) {
        console.error('Session cleanup error:', error)
      }
    } catch (error) {
      console.error('Session cleanup service error:', error)
    }
  }

  /**
   * Set session cookie
   */
  static setSessionCookie(response: NextResponse, token: string, maxAge: number = SESSION_DURATION / 1000): void {
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
      path: '/'
    })
  }

  /**
   * Clear session cookie
   */
  static clearSessionCookie(response: NextResponse): void {
    response.cookies.delete(SESSION_COOKIE_NAME)
  }

  /**
   * Get current user from request
   */
  static async getCurrentUser(request: NextRequest): Promise<CMSUser | null> {
    try {
      const cookieStore = await cookies()
      const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
      
      if (!sessionCookie) {
        return null
      }

      const sessionData = await this.validateSession(sessionCookie.value)
      return sessionData?.user || null
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  /**
   * Create initial admin user (development only)
   */
  static async createInitialAdmin(): Promise<{ success: boolean; error?: string }> {
    if (process.env.NODE_ENV === 'production') {
      return { success: false, error: 'Not allowed in production' }
    }

    try {
      if (!this.supabase) return { success: false, error: 'Database connection not available' }
      
      // Check if admin already exists
      const { data: existingAdmin } = await this.supabase
        .from('cms_users')
        .select('id')
        .eq('role', 'admin')
        .limit(1)

      if (existingAdmin && existingAdmin.length > 0) {
        return { success: false, error: 'Admin user already exists' }
      }

      // Create admin user
      const passwordHash = await bcrypt.hash('Admin123!', 12)
      const { error } = await (this.supabase
        .from('cms_users') as any)
        .insert({
          email: 'admin@workflo.it',
          username: 'admin',
          password_hash: passwordHash,
          role: 'admin',
          first_name: 'System',
          last_name: 'Administrator',
          is_active: true
        })

      if (error) {
        console.error('Create admin error:', error)
        return { success: false, error: 'Failed to create admin user' }
      }

      return { success: true }
    } catch (error) {
      console.error('Create initial admin error:', error)
      return { success: false, error: 'Service error' }
    }
  }
}

// Utility functions for client-side usage
export const clientAuthUtils = {
  /**
   * Check if user is authenticated (client-side)
   */
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/cms/auth/validate')
      return response.ok
    } catch {
      return false
    }
  },

  /**
   * Get current user (client-side)
   */
  getCurrentUser: async (): Promise<CMSUser | null> => {
    try {
      const response = await fetch('/api/cms/auth/user')
      if (response.ok) {
        const data = await response.json()
        return data.user || null
      }
      return null
    } catch {
      return null
    }
  },

  /**
   * Login (client-side)
   */
  login: async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string; user?: CMSUser }> => {
    try {
      const response = await fetch('/api/cms/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      
      return await response.json()
    } catch {
      return { success: false, error: 'Network error' }
    }
  },

  /**
   * Logout (client-side)
   */
  logout: async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/cms/auth/logout', {
        method: 'POST'
      })
      
      return await response.json()
    } catch {
      return { success: false, error: 'Network error' }
    }
  }
}