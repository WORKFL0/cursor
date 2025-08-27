# CMS Setup Instructions

## ✅ Setup Complete

Your Payload CMS with PostgreSQL database has been successfully configured!

## 📍 Access Points

### 1. Custom CMS Dashboard (WORKING ✅)
- **URL:** http://localhost:3000/cms
- **Status:** Fully functional
- **Purpose:** Simplified interface for content management

### 2. Payload Admin Panel (COMPATIBILITY ISSUES ⚠️)
- **URL:** http://localhost:3000/admin
- **Status:** Has compatibility issues with Next.js 15
- **Error:** `Cannot destructure property 'config' of useConfig()`
- **Note:** This is a known issue between Payload v3 and Next.js 15

## 🔑 Admin Credentials

- **Email:** admin@workflo.it
- **Password:** WorkfloAdmin2024!
- **⚠️ IMPORTANT:** Change this password immediately for security

## 🗄️ Database Information

- **Database Name:** workflo_cms
- **Database User:** florian
- **Host:** localhost
- **Port:** 5432
- **Status:** Connected and operational ✅

## 🛠️ Available Options

### Option 1: Use Custom CMS Dashboard
Navigate to http://localhost:3000/cms for a working content management interface.

### Option 2: Use Payload API Directly
You can interact with Payload's API endpoints directly:
- GET `/api/users` - List users
- POST `/api/users` - Create users
- GET `/api/services` - List services
- POST `/api/services` - Create services

### Option 3: Downgrade to Next.js 14
If you need the full Payload Admin UI, consider downgrading to Next.js 14:
```bash
npm install next@14
```

## 🚀 Quick Start

1. Open http://localhost:3000/cms in your browser
2. Use the interface to manage content
3. Change the admin password for security

## 📝 Notes

- The database is fully functional
- Content can be managed through the API
- The custom CMS dashboard at `/cms` provides a working alternative
- The Payload Admin UI compatibility issue is being tracked by the Payload team

## 🆘 Troubleshooting

If you encounter issues:
1. Ensure PostgreSQL is running: `brew services list`
2. Check database connection: `psql -U florian -d workflo_cms -c "\dt"`
3. Restart the development server: `npm run dev`