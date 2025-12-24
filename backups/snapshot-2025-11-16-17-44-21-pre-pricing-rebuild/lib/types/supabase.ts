// Re-export types from database.ts to maintain consistency
export type { Database, Article, ArticleInsert, ArticleUpdate, MediaFile, CMSUser } from './database'

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Re-export from database.ts to avoid duplication
export type { PaginatedResponse } from './database'

// Common error types
export interface SupabaseError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

// Helper type for Supabase client responses
export type SupabaseResponse<T> = {
  data: T[] | null;
  error: SupabaseError | null;
  count?: number | null;
};