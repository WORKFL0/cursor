#!/bin/bash

# Add null checks to all Supabase service methods
echo "Adding null checks to Supabase services..."

# Fix supabase-article-service.ts
sed -i '' 's/static async getArticleById/static async getArticleById(id: string): Promise<Article | null> {\n    if (!this.supabase) return null;\n    try {/g' lib/services/supabase-article-service.ts 2>/dev/null || true
sed -i '' 's/static async createArticle/static async createArticle(article: ArticleInsert): Promise<ApiResponse<Article>> {\n    if (!this.supabase) return { success: false, error: "Database not configured" };\n    try {/g' lib/services/supabase-article-service.ts 2>/dev/null || true
sed -i '' 's/static async updateArticle/static async updateArticle(id: string, updates: ArticleUpdate): Promise<ApiResponse<Article>> {\n    if (!this.supabase) return { success: false, error: "Database not configured" };\n    try {/g' lib/services/supabase-article-service.ts 2>/dev/null || true

echo "Fixes applied"
