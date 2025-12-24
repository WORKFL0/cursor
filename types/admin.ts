/**
 * Admin User Types
 */

export type AdminRole = 'admin' | 'editor' | 'author'

export interface AdminUser {
  id: string
  email: string
  full_name: string
  role: AdminRole
  is_active: boolean
  avatar_url: string | null
  invited_by: string | null
  invited_at: string | null
  last_login_at: string | null
  login_count: number
  email_verified: boolean
  created_at: string
  updated_at: string
}

export interface AdminSession {
  id: string
  user_id: string
  token: string
  expires_at: string
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface AdminInvitation {
  id: string
  email: string
  role: AdminRole
  invited_by: string
  token: string
  expires_at: string
  accepted_at: string | null
  created_at: string
}

export interface AdminActivityLog {
  id: string
  user_id: string | null
  action: string
  resource_type: string | null
  resource_id: string | null
  details: Record<string, any> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

// API Request/Response types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  token?: string
  user?: AdminUser
  error?: string
}

export interface InviteUserRequest {
  email: string
  role: AdminRole
  full_name: string
}

export interface InviteUserResponse {
  success: boolean
  invitation?: AdminInvitation
  error?: string
}

export interface AcceptInvitationRequest {
  token: string
  password: string
  full_name: string
}

export interface AcceptInvitationResponse {
  success: boolean
  user?: AdminUser
  error?: string
}

export interface ValidateSessionResponse {
  valid: boolean
  user?: AdminUser
  error?: string
}
