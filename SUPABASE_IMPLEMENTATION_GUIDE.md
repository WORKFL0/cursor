# Supabase-First CMS Implementation Guide
**Migration from Dual-CMS to Supabase-Only Architecture**

---

## Overview

This guide provides step-by-step instructions for migrating from the current dual-CMS architecture (Payload + Supabase) to a streamlined Supabase-first approach. The implementation follows the architectural decision outlined in [ADR-001](./ADR-001-CMS-ARCHITECTURE-DECISION.md).

---

## Prerequisites

### Environment Setup
```bash
# Ensure you have the required dependencies
npm list @supabase/supabase-js  # Should be v2.56.0+
npm list next                   # Should be v15.5.0+
npm list typescript             # Should be v5.x
```

### Supabase Project Configuration
- ✅ Supabase project: `wmasliwvesxtzmlxngoe.supabase.co`
- ✅ Articles table created and indexed
- ✅ Row Level Security enabled
- ⚠️ Missing: Service role key for admin operations
- ⚠️ Missing: Storage bucket for media files

---

## Phase 1: Foundation Setup (Week 1-2)

### Step 1: Clean Up Payload CMS Dependencies

#### 1.1 Remove Payload CMS Packages
```bash
npm uninstall payload @payloadcms/db-postgres @payloadcms/richtext-lexical sharp
npm audit fix
```

#### 1.2 Remove Payload Configuration Files
```bash
# Files to remove:
rm payload.config.ts
rm -rf src/payload/
rm -rf migrations/
```

#### 1.3 Update package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack", 
    "start": "next start",
    "lint": "eslint",
    "type-check": "tsc --noEmit"
    // Remove any payload-specific scripts
  }
}
```

### Step 2: Complete Supabase Configuration

#### 2.1 Update Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://wmasliwvesxtzmlxngoe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Add these new variables (get from Supabase dashboard):
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-jwt-secret-here

# Remove Payload-specific variables:
# PAYLOAD_SECRET=...
# DATABASE_URL=postgresql://florian@localhost:5432/workflo_cms
```

#### 2.2 Create Enhanced Supabase Client
```typescript
// lib/supabase/admin-client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Admin client with service role (for server-side operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Client-side client (existing)
export { supabase } from './client'
```

### Step 3: Implement Authentication System

#### 3.1 Create Authentication Service
```typescript
// lib/services/auth-service.ts
import { supabaseAdmin } from '@/lib/supabase/admin-client'
import { supabase } from '@/lib/supabase/client'

export interface CMSUser {
  id: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  created_at: string
  last_sign_in: string
}

export class AuthService {
  // Sign in with email/password
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  // Sign out
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Get current user
  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  // Check if user has CMS access
  static async checkCMSAccess(userId: string): Promise<boolean> {
    const { data } = await supabaseAdmin
      .from('cms_users')
      .select('role')
      .eq('user_id', userId)
      .single()
    
    return !!data && ['admin', 'editor'].includes(data.role)
  }

  // Create CMS user (admin only)
  static async createCMSUser(email: string, role: 'admin' | 'editor' | 'viewer') {
    // Create auth user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: this.generateTempPassword(),
      email_confirm: true
    })

    if (authError) throw authError

    // Create CMS user record
    const { data, error } = await supabaseAdmin
      .from('cms_users')
      .insert([{
        user_id: authUser.user.id,
        email,
        role,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  private static generateTempPassword(): string {
    return Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12)
  }
}
```

#### 3.2 Create CMS Users Table
```sql
-- Run in Supabase SQL Editor
CREATE TABLE cms_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in TIMESTAMPTZ,
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Create indexes
CREATE INDEX idx_cms_users_user_id ON cms_users(user_id);
CREATE INDEX idx_cms_users_role ON cms_users(role);

-- Enable RLS
ALTER TABLE cms_users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own record" ON cms_users
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all users" ON cms_users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM cms_users 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Insert initial admin user (replace with your email)
INSERT INTO cms_users (user_id, email, role) 
VALUES ('YOUR-USER-ID-HERE', 'admin@workflo.it', 'admin');
```

### Step 4: Enhance Article Service

#### 4.1 Add Authentication to Article Operations
```typescript
// lib/services/article-service.ts (enhancement)
import { AuthService } from './auth-service'

export class ArticleService {
  // Add authentication check to write operations
  private static async checkWritePermission(): Promise<void> {
    const user = await AuthService.getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const hasAccess = await AuthService.checkCMSAccess(user.id)
    if (!hasAccess) {
      throw new Error('CMS access denied')
    }
  }

  // Enhanced create method
  static async createArticle(articleData: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<ArticleResponse> {
    await this.checkWritePermission()
    
    // Add audit fields
    const user = await AuthService.getCurrentUser()
    const enrichedData = {
      ...articleData,
      created_by: user?.id,
      updated_by: user?.id,
      slug: articleData.slug || this.generateSlug(articleData.title || ''),
    }

    // Continue with existing logic...
    return super.createArticle(enrichedData)
  }

  // Similar enhancements for update and delete methods...
}
```

---

## Phase 2: Feature Enhancement (Week 3-4)

### Step 5: Implement Media Management

#### 5.1 Create Storage Bucket
```sql
-- Run in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public) 
VALUES ('article-images', 'article-images', true);

-- Create storage policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT 
USING (bucket_id = 'article-images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'article-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own images" ON storage.objects FOR UPDATE 
USING (bucket_id = 'article-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own images" ON storage.objects FOR DELETE 
USING (bucket_id = 'article-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

#### 5.2 Create Image Upload Service
```typescript
// lib/services/image-service.ts
import { supabase } from '@/lib/supabase/client'
import { AuthService } from './auth-service'

export class ImageService {
  private static readonly BUCKET_NAME = 'article-images'
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

  static async uploadImage(file: File): Promise<string> {
    // Validate file
    this.validateFile(file)
    
    // Get current user
    const user = await AuthService.getCurrentUser()
    if (!user) throw new Error('Authentication required')

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(data.path)

    return urlData.publicUrl
  }

  static async deleteImage(imageUrl: string): Promise<void> {
    const path = this.extractPathFromUrl(imageUrl)
    const { error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove([path])
    
    if (error) throw error
  }

  private static validateFile(file: File): void {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error('File size too large. Maximum 5MB allowed.')
    }
    
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP allowed.')
    }
  }

  private static extractPathFromUrl(url: string): string {
    const urlObj = new URL(url)
    return urlObj.pathname.split('/storage/v1/object/public/article-images/')[1]
  }
}
```

#### 5.3 Create Image Upload Component
```typescript
// components/cms/image-upload.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { ImageService } from '@/lib/services/image-service'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  currentImage?: string
  onImageRemoved?: () => void
}

export function ImageUpload({ onImageUploaded, currentImage, onImageRemoved }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const imageUrl = await ImageService.uploadImage(file)
      onImageUploaded(imageUrl)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    if (!currentImage) return

    try {
      await ImageService.deleteImage(currentImage)
      onImageRemoved?.()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="image-upload">Artikel Afbeelding</Label>
      
      {currentImage ? (
        <div className="relative">
          <img 
            src={currentImage} 
            alt="Uploaded image" 
            className="w-full max-w-md h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <div className="space-y-2">
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
            <Label
              htmlFor="image-upload"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 cursor-pointer"
            >
              {uploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Afbeelding
                </>
              )}
            </Label>
            <p className="text-sm text-muted-foreground">
              JPEG, PNG of WebP, max 5MB
            </p>
          </div>
        </div>
      )}

      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
```

### Step 6: Add Full-Text Search

#### 6.1 Enable PostgreSQL Full-Text Search
```sql
-- Run in Supabase SQL Editor
-- Add full-text search columns
ALTER TABLE articles ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create search index
CREATE INDEX IF NOT EXISTS articles_search_idx ON articles USING GIN (search_vector);

-- Function to update search vector
CREATE OR REPLACE FUNCTION articles_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('dutch', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('dutch', COALESCE(NEW.title_nl, '')), 'A') ||
    setweight(to_tsvector('dutch', COALESCE(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('dutch', COALESCE(NEW.excerpt_nl, '')), 'B') ||
    setweight(to_tsvector('dutch', COALESCE(NEW.content, '')), 'C') ||
    setweight(to_tsvector('dutch', COALESCE(NEW.content_nl, '')), 'C') ||
    setweight(to_tsvector('dutch', array_to_string(NEW.tags, ' ')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS articles_search_update ON articles;
CREATE TRIGGER articles_search_update 
  BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION articles_search_trigger();

-- Update existing articles
UPDATE articles SET updated_at = updated_at; -- Triggers the search vector update
```

#### 6.2 Enhance Search Service
```typescript
// lib/services/search-service.ts
import { supabase } from '@/lib/supabase/client'

export interface SearchResult {
  id: string
  title: string
  excerpt: string
  url: string
  relevance: number
  type: 'article' | 'page'
}

export class SearchService {
  static async searchArticles(query: string, limit = 10): Promise<SearchResult[]> {
    if (!query.trim()) return []

    const { data, error } = await supabase.rpc('search_articles', {
      search_query: query,
      result_limit: limit
    })

    if (error) throw error

    return data?.map((item: any) => ({
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      url: `/nieuws/${item.slug}`,
      relevance: item.relevance,
      type: 'article' as const
    })) || []
  }

  static async getSearchSuggestions(query: string): Promise<string[]> {
    if (!query.trim()) return []

    const { data, error } = await supabase.rpc('get_search_suggestions', {
      search_query: query,
      suggestion_limit: 5
    })

    if (error) throw error
    return data || []
  }
}
```

#### 6.3 Create Search RPC Functions
```sql
-- Run in Supabase SQL Editor
-- Search articles function
CREATE OR REPLACE FUNCTION search_articles(search_query TEXT, result_limit INT DEFAULT 10)
RETURNS TABLE(
  id UUID,
  title TEXT,
  excerpt TEXT,
  slug TEXT,
  relevance REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.excerpt,
    a.slug,
    ts_rank(a.search_vector, plainto_tsquery('dutch', search_query)) AS relevance
  FROM articles a
  WHERE a.published = true
    AND a.search_vector @@ plainto_tsquery('dutch', search_query)
  ORDER BY relevance DESC, a.published_at DESC
  LIMIT result_limit;
END;
$$;

-- Search suggestions function
CREATE OR REPLACE FUNCTION get_search_suggestions(search_query TEXT, suggestion_limit INT DEFAULT 5)
RETURNS TABLE(suggestion TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    unnest(string_to_array(a.title, ' ')) as suggestion
  FROM articles a
  WHERE a.published = true
    AND a.title ILIKE '%' || search_query || '%'
  ORDER BY suggestion
  LIMIT suggestion_limit;
END;
$$;
```

---

## Phase 3: Advanced Features (Week 5-6)

### Step 7: Real-Time Updates

#### 7.1 Implement Real-Time Subscriptions
```typescript
// lib/services/realtime-service.ts
import { supabase } from '@/lib/supabase/client'
import { Article } from '@/lib/supabase/client'

export type ArticleChangeEvent = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new?: Article
  old?: Article
}

export class RealtimeService {
  private static subscriptions: Map<string, any> = new Map()

  static subscribeToArticleChanges(
    callback: (event: ArticleChangeEvent) => void,
    subscriptionId: string = 'default'
  ) {
    // Unsubscribe existing subscription
    this.unsubscribe(subscriptionId)

    const subscription = supabase
      .channel('articles-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'articles',
          filter: 'published=eq.true' // Only listen to published articles
        },
        (payload) => {
          callback({
            eventType: payload.eventType as any,
            new: payload.new as Article,
            old: payload.old as Article
          })
        }
      )
      .subscribe()

    this.subscriptions.set(subscriptionId, subscription)
    return subscription
  }

  static unsubscribe(subscriptionId: string) {
    const subscription = this.subscriptions.get(subscriptionId)
    if (subscription) {
      supabase.removeChannel(subscription)
      this.subscriptions.delete(subscriptionId)
    }
  }

  static unsubscribeAll() {
    for (const [id] of this.subscriptions) {
      this.unsubscribe(id)
    }
  }
}
```

#### 7.2 Add Real-Time to News Page
```typescript
// app/nieuws/page.tsx (enhancement)
import { RealtimeService } from '@/lib/services/realtime-service'

export default function NewsPage() {
  // ... existing code ...

  useEffect(() => {
    // Subscribe to real-time updates
    const subscription = RealtimeService.subscribeToArticleChanges((event) => {
      switch (event.eventType) {
        case 'INSERT':
          if (event.new) {
            setNewsArticles(prev => [convertArticle(event.new!), ...prev])
            toast.info('Nieuw artikel beschikbaar!')
          }
          break
        case 'UPDATE':
          if (event.new) {
            setNewsArticles(prev => 
              prev.map(article => 
                article.id === event.new!.id ? convertArticle(event.new!) : article
              )
            )
          }
          break
        case 'DELETE':
          if (event.old) {
            setNewsArticles(prev => 
              prev.filter(article => article.id !== event.old!.id)
            )
          }
          break
      }
    })

    return () => {
      RealtimeService.unsubscribe('news-page')
    }
  }, [])

  // ... rest of component
}
```

### Step 8: Content Scheduling

#### 8.1 Add Scheduling Fields to Database
```sql
-- Run in Supabase SQL Editor
ALTER TABLE articles ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' 
  CHECK (status IN ('draft', 'scheduled', 'published', 'archived'));

-- Create index for scheduled articles
CREATE INDEX IF NOT EXISTS idx_articles_scheduled ON articles(scheduled_publish_at) 
  WHERE status = 'scheduled';

-- Function to publish scheduled articles
CREATE OR REPLACE FUNCTION publish_scheduled_articles()
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  published_count INT := 0;
BEGIN
  UPDATE articles 
  SET 
    status = 'published',
    published = true,
    published_at = NOW(),
    updated_at = NOW()
  WHERE status = 'scheduled' 
    AND scheduled_publish_at <= NOW();
  
  GET DIAGNOSTICS published_count = ROW_COUNT;
  RETURN published_count;
END;
$$;
```

#### 8.2 Create Scheduling Service
```typescript
// lib/services/schedule-service.ts
import { supabaseAdmin } from '@/lib/supabase/admin-client'

export class ScheduleService {
  static async scheduleArticle(articleId: string, publishAt: Date): Promise<void> {
    const { error } = await supabaseAdmin
      .from('articles')
      .update({
        status: 'scheduled',
        scheduled_publish_at: publishAt.toISOString(),
        published: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', articleId)

    if (error) throw error
  }

  static async publishScheduledArticles(): Promise<number> {
    const { data, error } = await supabaseAdmin.rpc('publish_scheduled_articles')
    if (error) throw error
    return data || 0
  }

  static async getScheduledArticles(): Promise<any[]> {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('id, title, scheduled_publish_at')
      .eq('status', 'scheduled')
      .order('scheduled_publish_at', { ascending: true })

    if (error) throw error
    return data || []
  }
}
```

---

## Phase 4: Production Optimization (Week 7-8)

### Step 9: Performance Optimization

#### 9.1 Add Database Optimizations
```sql
-- Run in Supabase SQL Editor
-- Partitioning for large datasets (if needed)
-- CREATE TABLE articles_2024 PARTITION OF articles 
-- FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Additional performance indexes
CREATE INDEX IF NOT EXISTS idx_articles_category_published ON articles(category, published) 
  WHERE published = true;

CREATE INDEX IF NOT EXISTS idx_articles_featured_published ON articles(featured, published_at DESC) 
  WHERE featured = true AND published = true;

-- Database statistics update
ANALYZE articles;
```

#### 9.2 Add Caching Layer
```typescript
// lib/services/cache-service.ts
export class CacheService {
  private static cache = new Map<string, { data: any, expires: number }>()

  static set(key: string, data: any, ttlMinutes = 10): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + (ttlMinutes * 60 * 1000)
    })
  }

  static get<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached || cached.expires < Date.now()) {
      this.cache.delete(key)
      return null
    }
    return cached.data
  }

  static invalidate(pattern: string): void {
    for (const [key] of this.cache) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }

  static clear(): void {
    this.cache.clear()
  }
}
```

### Step 10: Security Hardening

#### 10.1 Enhance RLS Policies
```sql
-- Run in Supabase SQL Editor
-- More restrictive policies for production

-- Drop the overly permissive development policy
DROP POLICY IF EXISTS "Allow all operations for development" ON articles;

-- Create role-based policies
CREATE POLICY "Editors can manage articles" ON articles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM cms_users 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'editor')
  )
);

CREATE POLICY "Viewers can only read published articles" ON articles
FOR SELECT USING (
  published = true OR 
  EXISTS (
    SELECT 1 FROM cms_users 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'editor')
  )
);

-- Create audit log table
CREATE TABLE article_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit trigger function
CREATE OR REPLACE FUNCTION article_audit_trigger() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO article_audit_log (article_id, user_id, action, old_values, new_values)
  VALUES (
    COALESCE(NEW.id, OLD.id),
    auth.uid(),
    TG_OP,
    CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers
CREATE TRIGGER article_audit_insert_update_delete
  AFTER INSERT OR UPDATE OR DELETE ON articles
  FOR EACH ROW EXECUTE FUNCTION article_audit_trigger();
```

### Step 11: Monitoring and Alerting

#### 11.1 Create Health Check Endpoints
```typescript
// app/api/health/cms/route.ts
import { NextResponse } from 'next/server'
import { ArticleService } from '@/lib/services/article-service'
import { AuthService } from '@/lib/services/auth-service'

export async function GET() {
  try {
    // Test database connection
    const dbTest = await ArticleService.testConnection()
    
    // Test authentication service
    const authTest = await AuthService.healthCheck()
    
    // Test storage (if implemented)
    // const storageTest = await ImageService.healthCheck()

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbTest,
        authentication: authTest,
        // storage: storageTest
      }
    }

    return NextResponse.json(health)
  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 503 })
  }
}
```

---

## Testing Strategy

### Unit Tests
```typescript
// tests/services/article-service.test.ts
import { ArticleService } from '@/lib/services/article-service'

describe('ArticleService', () => {
  test('should create article with proper validation', async () => {
    const mockArticle = {
      title: 'Test Article',
      excerpt: 'Test excerpt',
      content: 'Test content',
      published: true
    }

    const result = await ArticleService.createArticle(mockArticle)
    expect(result.success).toBe(true)
    expect(result.articles[0].slug).toBeDefined()
  })

  test('should validate required fields', async () => {
    const invalidArticle = { title: '' }
    
    await expect(ArticleService.createArticle(invalidArticle))
      .rejects.toThrow('Title is required')
  })
})
```

### Integration Tests
```typescript
// tests/api/cms.test.ts
import { GET, POST } from '@/app/api/cms/articles/route'

describe('/api/cms/articles', () => {
  test('GET should return articles', async () => {
    const request = new Request('http://localhost/api/cms/articles')
    const response = await GET(request)
    const data = await response.json()
    
    expect(data.success).toBe(true)
    expect(Array.isArray(data.articles)).toBe(true)
  })
})
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All Payload CMS code removed
- [ ] Environment variables configured
- [ ] Database schema applied
- [ ] Initial admin user created
- [ ] Security policies enabled
- [ ] Performance indexes created
- [ ] Health checks implemented
- [ ] Tests passing

### Production Environment
- [ ] Supabase project in production mode
- [ ] SSL certificates configured
- [ ] CDN enabled for static assets
- [ ] Backup strategy implemented
- [ ] Monitoring alerts configured
- [ ] Error tracking setup (Sentry)
- [ ] Performance monitoring enabled

### Post-Deployment
- [ ] Smoke tests executed
- [ ] Performance benchmarks verified
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Team training completed
- [ ] Rollback procedure tested

---

## Maintenance Tasks

### Daily
- Monitor system health checks
- Review error logs
- Check scheduled article publication

### Weekly
- Database performance review
- Security log analysis
- Backup verification
- User access audit

### Monthly
- Performance optimization review
- Security policy update
- Cost analysis
- Feature usage analytics

---

## Support and Troubleshooting

### Common Issues

#### Authentication Problems
```typescript
// Debug authentication issues
const debugAuth = async () => {
  const user = await supabase.auth.getUser()
  console.log('Current user:', user)
  
  if (user.data.user) {
    const cmsUser = await supabase
      .from('cms_users')
      .select('*')
      .eq('user_id', user.data.user.id)
      .single()
    console.log('CMS user:', cmsUser)
  }
}
```

#### Database Connection Issues
```typescript
// Test database connection
const testConnection = async () => {
  const { data, error } = await supabase.from('articles').select('count').limit(1)
  console.log('DB Test:', { data, error })
}
```

#### Image Upload Issues
```typescript
// Debug image upload
const testImageUpload = async (file: File) => {
  console.log('File size:', file.size)
  console.log('File type:', file.type)
  
  const { data, error } = await supabase.storage
    .from('article-images')
    .upload('test.jpg', file)
  
  console.log('Upload result:', { data, error })
}
```

---

## Conclusion

This implementation guide provides a comprehensive migration path from the dual-CMS architecture to a streamlined Supabase-first approach. The phased implementation ensures minimal disruption while adding powerful features like real-time updates, advanced search, and content scheduling.

The resulting architecture will be more maintainable, performant, and scalable while providing all the CMS functionality required for the Workflo news and blog system.