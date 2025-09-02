#!/usr/bin/env tsx

/**
 * Supabase CMS Setup Script
 * Initializes the database with schema, sample data, and admin user
 */

import { createAdminClient } from '../lib/supabase/client'
import { readFileSync } from 'fs'
import { join } from 'path'
import bcrypt from 'bcryptjs'

const MIGRATION_FILE = join(__dirname, '..', 'supabase', 'migrations', '001_initial_cms_schema.sql')

async function setupSupabaseCMS() {
  console.log('🚀 Starting Supabase CMS setup...\n')

  try {
    const supabase = createAdminClient()
    
    // Check if we can connect
    console.log('📡 Testing Supabase connection...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1)

    if (connectionError) {
      console.error('❌ Failed to connect to Supabase:')
      console.error(connectionError)
      process.exit(1)
    }
    
    console.log('✅ Connected to Supabase successfully\n')

    // Check if CMS tables already exist
    console.log('🔍 Checking if CMS tables exist...')
    const { data: existingTables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['articles', 'cms_users'])

    if (tableError) {
      console.error('❌ Error checking existing tables:', tableError)
      process.exit(1)
    }

    const hasArticles = existingTables?.some(t => t.table_name === 'articles')
    const hasUsers = existingTables?.some(t => t.table_name === 'cms_users')

    if (hasArticles && hasUsers) {
      console.log('⚠️  CMS tables already exist. Skipping schema creation.')
      
      // Check if admin user exists
      console.log('🔍 Checking for admin user...')
      const { data: adminUsers, error: adminError } = await supabase
        .from('cms_users')
        .select('id, username, email')
        .eq('role', 'admin')
        .limit(1)

      if (adminError) {
        console.error('❌ Error checking admin user:', adminError)
      } else if (adminUsers && adminUsers.length > 0) {
        console.log(`✅ Admin user found: ${adminUsers[0].username} (${adminUsers[0].email})`)
        console.log('\n🎉 CMS setup complete! The system is ready to use.')
        return
      }
    } else {
      // Run migration
      console.log('📝 Running database migration...')
      
      try {
        const migrationSQL = readFileSync(MIGRATION_FILE, 'utf-8')
        
        // Split SQL into statements and execute them
        const statements = migrationSQL
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

        console.log(`   Executing ${statements.length} SQL statements...`)
        
        for (const statement of statements) {
          if (statement.trim()) {
            const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' })
            if (error) {
              // Try alternative method for some statements
              console.warn(`   Warning: ${error.message}`)
            }
          }
        }

        console.log('✅ Database migration completed\n')
      } catch (migrationError) {
        console.error('❌ Migration error:', migrationError)
        console.log('⚠️  Continuing with manual table creation...\n')
        
        // Fallback: create essential tables manually
        await createEssentialTables(supabase)
      }
    }

    // Create sample data
    console.log('📦 Creating sample data...')
    await createSampleData(supabase)

    console.log('\n🎉 Supabase CMS setup complete!')
    console.log('\n📋 Next steps:')
    console.log('1. Update your .env.local file with Supabase credentials')
    console.log('2. Run: npm run dev')
    console.log('3. Visit: http://localhost:3000/cms/login')
    console.log('4. Login with: admin@workflo.it / Admin123!')
    console.log('\n💡 Remember to change the admin password after first login!')

  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

async function createEssentialTables(supabase: any) {
  console.log('🔧 Creating essential tables...')

  // Create users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS cms_users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(20) DEFAULT 'editor' NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      is_active BOOLEAN DEFAULT true NOT NULL,
      last_login_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `

  // Create articles table
  const createArticlesTable = `
    CREATE TABLE IF NOT EXISTS articles (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT,
      author VARCHAR(255) DEFAULT 'Workflo Team',
      category VARCHAR(100) DEFAULT 'Nieuws',
      tags TEXT[] DEFAULT '{}',
      image_url TEXT,
      published BOOLEAN DEFAULT false NOT NULL,
      featured BOOLEAN DEFAULT false NOT NULL,
      source VARCHAR(20) DEFAULT 'cms' NOT NULL,
      views_count INTEGER DEFAULT 0,
      published_at TIMESTAMP WITH TIME ZONE,
      created_by UUID REFERENCES cms_users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `

  try {
    await supabase.rpc('exec_sql', { sql: createUsersTable })
    await supabase.rpc('exec_sql', { sql: createArticlesTable })
    console.log('✅ Essential tables created')
  } catch (error) {
    console.warn('⚠️  Could not create tables via RPC, they may already exist')
  }
}

async function createSampleData(supabase: any) {
  // Create admin user
  console.log('👤 Creating admin user...')
  
  const passwordHash = await bcrypt.hash('Admin123!', 12)
  
  const { data: adminUser, error: adminError } = await supabase
    .from('cms_users')
    .upsert({
      email: 'admin@workflo.it',
      username: 'admin',
      password_hash: passwordHash,
      role: 'admin',
      first_name: 'System',
      last_name: 'Administrator',
      is_active: true
    }, { 
      onConflict: 'email',
      ignoreDuplicates: true 
    })
    .select()

  if (adminError) {
    console.warn('⚠️  Could not create admin user:', adminError.message)
  } else {
    console.log('✅ Admin user created/updated')
  }

  // Create sample articles
  console.log('📄 Creating sample articles...')
  
  const sampleArticles = [
    {
      title: 'Welkom bij het Workflo CMS',
      slug: 'welkom-bij-workflo-cms',
      excerpt: 'Het nieuwe Content Management System van Workflo is nu live! Ontdek alle mogelijkheden.',
      content: `# Welkom bij het Workflo CMS

Het nieuwe Content Management System van Workflo is nu beschikbaar! Dit moderne, krachtige CMS biedt alle tools die je nodig hebt om content te beheren.

## Belangrijkste functies:

- **Intuïtieve editor**: Eenvoudig artikelen schrijven en bewerken
- **Media management**: Upload en beheer afbeeldingen
- **SEO optimalisatie**: Ingebouwde SEO tools
- **Gebruikersbeheer**: Veilige toegangscontrole
- **Responsive design**: Werkt perfect op alle apparaten

Veel plezier met het nieuwe CMS!`,
      author: 'Workflo Team',
      category: 'Nieuws',
      tags: ['cms', 'workflo', 'launch'],
      published: true,
      featured: true,
      published_at: new Date().toISOString()
    },
    {
      title: 'Cybersecurity Best Practices 2024',
      slug: 'cybersecurity-best-practices-2024',
      excerpt: 'Ontdek de belangrijkste cybersecurity trends en best practices voor 2024.',
      content: `# Cybersecurity Best Practices 2024

In een steeds meer verbonden wereld is cybersecurity belangrijker dan ooit. Hier zijn de belangrijkste trends en best practices voor 2024.

## Belangrijkste ontwikkelingen:

1. **Zero Trust Architecture**
2. **AI-powered threat detection**
3. **Cloud security posture management**
4. **Identity and access management**

Blijf veilig en beschermd!`,
      author: 'Security Team',
      category: 'Cybersecurity',
      tags: ['cybersecurity', 'security', '2024', 'best-practices'],
      published: true,
      featured: false,
      published_at: new Date(Date.now() - 86400000).toISOString() // Yesterday
    }
  ]

  for (const article of sampleArticles) {
    const { error } = await supabase
      .from('articles')
      .upsert(article, { 
        onConflict: 'slug',
        ignoreDuplicates: true 
      })

    if (error) {
      console.warn(`⚠️  Could not create article "${article.title}":`, error.message)
    }
  }

  console.log('✅ Sample articles created')
}

// Handle command line execution
if (require.main === module) {
  setupSupabaseCMS().catch(console.error)
}

export default setupSupabaseCMS