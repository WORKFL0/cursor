// Manual Supabase type definitions based on schema analysis

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          author: string;
          category: string;
          published: boolean;
          featured: boolean;
          published_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          author: string;
          category: string;
          published?: boolean;
          featured?: boolean;
          published_at: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          author?: string;
          category?: string;
          published?: boolean;
          featured?: boolean;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      media_files: {
        Row: {
          id: string;
          filename: string;
          original_name: string;
          file_path: string;
          file_url: string;
          file_type: string;
          file_size: number;
          mime_type: string;
          alt_text: string;
          caption: string;
          width: number;
          height: number;
          uploaded_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          filename: string;
          original_name: string;
          file_path: string;
          file_url: string;
          file_type: string;
          file_size: number;
          mime_type: string;
          alt_text?: string;
          caption?: string;
          width?: number;
          height?: number;
          uploaded_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          filename?: string;
          original_name?: string;
          file_path?: string;
          file_url?: string;
          file_type?: string;
          file_size?: number;
          mime_type?: string;
          alt_text?: string;
          caption?: string;
          width?: number;
          height?: number;
          uploaded_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          short_description: string;
          icon: string;
          category: string;
          pricing: any; // JSON field
          features: string[];
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          short_description: string;
          icon: string;
          category: string;
          pricing?: any;
          features?: string[];
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          short_description?: string;
          icon?: string;
          category?: string;
          pricing?: any;
          features?: string[];
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Type aliases for common usage
export type Article = Tables<'articles'>;
export type ArticleInsert = TablesInsert<'articles'>;
export type ArticleUpdate = TablesUpdate<'articles'>;

export type MediaFile = Tables<'media_files'>;
export type MediaFileInsert = TablesInsert<'media_files'>;
export type MediaFileUpdate = TablesUpdate<'media_files'>;

export type Service = Tables<'services'>;
export type ServiceInsert = TablesInsert<'services'>;
export type ServiceUpdate = TablesUpdate<'services'>;

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends APIResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

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