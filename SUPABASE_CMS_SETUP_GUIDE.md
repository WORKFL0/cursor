# Supabase CMS Setup Guide

This guide will help you set up Supabase for the CMS article system to properly store articles in a database instead of localStorage.

## Current Status

The CMS system has been updated with:
- ✅ **Enhanced ArticleService** - Handles database operations with localStorage fallback
- ✅ **Updated API Routes** - Use the new service for better error handling
- ✅ **Improved CMS Interface** - Shows clear status messages about storage type
- ✅ **Database Schema** - Ready-to-use SQL script for table creation
- ✅ **Status Endpoint** - `/api/cms/status` to check system health

## Quick Setup Steps

### 1. Check Current Status
Visit: `http://localhost:3000/api/cms/status` to see the current configuration status.

### 2. Supabase Configuration (if not already done)

Your `.env.local` already has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://wmasliwvesxtzmlxngoe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

But you need to get the **service role key** and **database password** from your Supabase dashboard.

### 3. Create Database Tables

**Option A: Use Supabase SQL Editor (Recommended)**
1. Go to your Supabase dashboard: https://app.supabase.com/project/wmasliwvesxtzmlxngoe
2. Navigate to SQL Editor
3. Copy and run the contents of `/scripts/create-articles-table.sql`

**Option B: Use the complete setup script**
1. Copy and run the contents of `/SUPABASE_CHECK_AND_UPDATE.sql`
2. This includes additional tables for user management and audit logging

### 4. Update Environment Variables

Add the missing values to your `.env.local`:
```env
# Get these from Supabase Dashboard > Settings > API
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_DB_PASSWORD=your-database-password-here

# Update the database URL (uncomment and add password)
DATABASE_URL=postgresql://postgres.wmasliwvesxtzmlxngoe:YOUR_PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require
```

### 5. Test the Connection

1. Restart your development server: `npm run dev`
2. Visit: `http://localhost:3000/api/cms/status`
3. Check that the database connection shows as successful
4. Visit: `http://localhost:3000/cms` and test creating/editing articles

## How to Get Supabase Credentials

### Service Role Key
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `wmasliwvesxtzmlxngoe`
3. Go to **Settings** > **API**
4. Copy the **service_role** key (not the anon public key)

### Database Password
1. In Supabase Dashboard > **Settings** > **Database**
2. Copy the password from the connection string
3. Or reset the password if needed

## Features Now Available

### Database Storage
- ✅ Articles persist after page refresh
- ✅ Articles are shared between users/devices
- ✅ Proper CRUD operations with error handling
- ✅ Full-text search capabilities
- ✅ Categories, tags, and filtering

### Fallback System
- ✅ Automatic fallback to localStorage if database is unavailable
- ✅ Clear status messages showing which storage is being used
- ✅ No data loss during setup process

### Enhanced Features
- 🔍 **Search**: Full-text search across title, excerpt, and content
- 🏷️ **Categories**: Nieuws, Blog, Tutorial, Update
- 🏪 **Tags**: Flexible tagging system
- 📅 **Publishing**: Draft/published status with timestamps
- 🌟 **Featured**: Mark articles as featured
- 🖼️ **Images**: Support for article images
- 🔗 **External**: Support for external article sources (RSS/LinkedIn)

## Troubleshooting

### "Articles disappear after refresh"
- **Cause**: Using localStorage fallback
- **Solution**: Set up Supabase database connection properly

### "Database connection failed"
- **Cause**: Missing credentials or table doesn't exist
- **Solution**: Run the SQL setup script and add credentials to `.env.local`

### "Permission denied" errors
- **Cause**: Row Level Security policies
- **Solution**: The setup script includes development-friendly policies

### Check logs
- Browser console shows which storage system is being used
- API logs show connection attempts and errors
- Status endpoint provides detailed diagnosis

## Next Steps

Once the database is set up:
1. **Test thoroughly** - Create, edit, delete articles
2. **Import existing data** - Any localStorage data can be manually recreated
3. **Set up user authentication** - Use the CMS user management system
4. **Configure production policies** - Tighten Row Level Security for production

## API Endpoints

- `GET /api/cms/status` - System health and configuration check
- `GET /api/cms/articles` - Fetch articles with filtering
- `POST /api/cms/articles` - Create new article
- `PUT /api/cms/articles` - Update existing article
- `DELETE /api/cms/articles?id=<id>` - Delete article

## Support

If you encounter issues:
1. Check `/api/cms/status` for detailed diagnostics
2. Verify environment variables are set correctly
3. Ensure the articles table exists in Supabase
4. Check browser console for client-side errors
5. Review server logs for API errors