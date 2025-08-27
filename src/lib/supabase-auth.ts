import { supabase, supabaseAdmin } from './supabase'
import type { AuthUser, AuthSession } from '../types/supabase'

/**
 * Supabase Authentication Integration for Payload CMS
 * This module provides authentication utilities that work with both
 * Supabase Auth and Payload CMS user management
 */

export class SupabaseAuthManager {
  /**
   * Sign up a new user with Supabase Auth
   */
  static async signUp(email: string, password: string, metadata?: Record<string, any>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      if (error) throw error

      return { success: true, user: data.user, session: data.session }
    } catch (error) {
      console.error('Sign up failed:', error)
      return { success: false, error }
    }
  }

  /**
   * Sign in a user with Supabase Auth
   */
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return { success: true, user: data.user, session: data.session }
    } catch (error) {
      console.error('Sign in failed:', error)
      return { success: false, error }
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Sign out failed:', error)
      return { success: false, error }
    }
  }

  /**
   * Get current user session
   */
  static async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error

      return { success: true, session }
    } catch (error) {
      console.error('Get session failed:', error)
      return { success: false, error }
    }
  }

  /**
   * Get current user
   */
  static async getUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error

      return { success: true, user }
    } catch (error) {
      console.error('Get user failed:', error)
      return { success: false, error }
    }
  }

  /**
   * Sync Supabase user with Payload CMS user
   * This ensures user data consistency between auth and CMS
   */
  static async syncWithPayloadUser(supabaseUser: AuthUser) {
    try {
      // Check if user already exists in Payload
      const existingUser = await fetch('/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!existingUser.ok) {
        // Create new Payload user
        const payloadUser = {
          email: supabaseUser.email,
          first_name: supabaseUser.user_metadata?.first_name,
          last_name: supabaseUser.user_metadata?.last_name,
          supabase_id: supabaseUser.id
        }

        const createResponse = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payloadUser)
        })

        if (!createResponse.ok) {
          throw new Error('Failed to create Payload user')
        }

        return { success: true, created: true }
      }

      return { success: true, created: false }
    } catch (error) {
      console.error('User sync failed:', error)
      return { success: false, error }
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Password reset failed:', error)
      return { success: false, error }
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Password update failed:', error)
      return { success: false, error }
    }
  }

  /**
   * Update user metadata
   */
  static async updateUserMetadata(metadata: Record<string, any>) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: metadata
      })

      if (error) throw error

      return { success: true, user: data.user }
    } catch (error) {
      console.error('Metadata update failed:', error)
      return { success: false, error }
    }
  }

  /**
   * Listen to authentication state changes
   */
  static onAuthStateChange(callback: (event: string, session: AuthSession | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }

  /**
   * Admin function to create a user (requires service role)
   */
  static async adminCreateUser(email: string, password: string, metadata?: Record<string, any>) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        user_metadata: metadata
      })

      if (error) throw error

      return { success: true, user: data.user }
    } catch (error) {
      console.error('Admin create user failed:', error)
      return { success: false, error }
    }
  }

  /**
   * Admin function to delete a user
   */
  static async adminDeleteUser(userId: string) {
    try {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Admin delete user failed:', error)
      return { success: false, error }
    }
  }
}

export default SupabaseAuthManager