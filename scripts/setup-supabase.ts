#!/usr/bin/env tsx

/**
 * Supabase Database Setup Script
 * This script initializes the Supabase database for use with Payload CMS
 * Run with: npm run setup:supabase
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database for Payload CMS...\n')

  try {
    // Step 1: Enable necessary extensions
    console.log('📦 Enabling PostgreSQL extensions...')
    
    const extensions = ['uuid-ossp', 'pgcrypto', 'pgjwt']
    
    for (const ext of extensions) {
      const { error } = await supabase.rpc('create_extension_if_not_exists', {
        extension_name: ext
      })
      
      if (error && !error.message.includes('already exists')) {
        console.warn(`⚠️  Warning: Could not enable extension ${ext}:`, error.message)
      } else {
        console.log(`✅ Extension ${ext} enabled`)
      }
    }

    // Step 2: Create custom functions for database management
    console.log('\n🔧 Creating database utility functions...')
    
    const createExtensionFunction = `
      CREATE OR REPLACE FUNCTION create_extension_if_not_exists(extension_name TEXT)
      RETURNS VOID AS $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = extension_name) THEN
          EXECUTE format('CREATE EXTENSION %I', extension_name);
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `

    const { error: funcError } = await supabase.rpc('sql', {
      query: createExtensionFunction
    })

    if (funcError) {
      console.warn('⚠️  Warning: Could not create extension function:', funcError.message)
    } else {
      console.log('✅ Extension utility function created')
    }

    // Step 3: Set up database configuration for optimal performance
    console.log('\n⚙️  Configuring database settings...')
    
    const configSettings = [
      "SET shared_preload_libraries = 'pg_stat_statements'",
      "SET log_statement = 'all'",
      "SET log_min_duration_statement = 1000"
    ]

    for (const setting of configSettings) {
      try {
        await supabase.rpc('sql', { query: setting })
        console.log(`✅ Applied setting: ${setting}`)
      } catch (error) {
        console.warn(`⚠️  Warning: Could not apply setting: ${setting}`)
      }
    }

    // Step 4: Test database connection
    console.log('\n🔍 Testing database connection...')
    
    const { data: testData, error: testError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1)

    if (testError) {
      throw new Error(`Database connection test failed: ${testError.message}`)
    }

    console.log('✅ Database connection successful')

    // Step 5: Prepare for Payload CMS tables
    console.log('\n📋 Preparing for Payload CMS initialization...')
    
    console.log(`
📝 Next steps:
1. Update your .env.local file with the correct SUPABASE_DB_PASSWORD
2. Run 'npm run dev' to start the application
3. Payload CMS will automatically create the necessary tables
4. Run 'npm run setup:rls' after Payload creates the tables to set up Row Level Security

🔗 Your Supabase project: ${supabaseUrl}
📊 Dashboard: ${supabaseUrl.replace('https://', 'https://app.').replace('.supabase.co', '.supabase.co')}
    `)

    console.log('\n✅ Supabase setup completed successfully!')

  } catch (error) {
    console.error('\n❌ Setup failed:', error)
    process.exit(1)
  }
}

async function setupRLS() {
  console.log('🔒 Setting up Row Level Security policies...\n')

  try {
    // RLS policies for Payload CMS tables
    const rlsPolicies = [
      {
        table: 'payload_users',
        policies: [
          {
            name: 'Users can view their own data',
            action: 'SELECT',
            sql: 'CREATE POLICY "Users can view their own data" ON payload_users FOR SELECT USING (auth.uid()::text = id);'
          },
          {
            name: 'Users can update their own data',
            action: 'UPDATE', 
            sql: 'CREATE POLICY "Users can update their own data" ON payload_users FOR UPDATE USING (auth.uid()::text = id);'
          }
        ]
      },
      {
        table: 'media',
        policies: [
          {
            name: 'Authenticated users can access media',
            action: 'SELECT',
            sql: 'CREATE POLICY "Authenticated users can access media" ON media FOR SELECT USING (auth.role() = \'authenticated\');'
          }
        ]
      }
    ]

    for (const tableConfig of rlsPolicies) {
      console.log(`🔒 Setting up RLS for table: ${tableConfig.table}`)
      
      // Enable RLS on table
      try {
        await supabase.rpc('sql', {
          query: `ALTER TABLE ${tableConfig.table} ENABLE ROW LEVEL SECURITY;`
        })
        console.log(`✅ RLS enabled for ${tableConfig.table}`)
      } catch (error) {
        console.warn(`⚠️  Warning: Could not enable RLS for ${tableConfig.table}`)
      }

      // Create policies
      for (const policy of tableConfig.policies) {
        try {
          await supabase.rpc('sql', { query: policy.sql })
          console.log(`✅ Policy "${policy.name}" created`)
        } catch (error) {
          console.warn(`⚠️  Warning: Could not create policy "${policy.name}"`)
        }
      }
    }

    console.log('\n✅ Row Level Security setup completed!')

  } catch (error) {
    console.error('\n❌ RLS setup failed:', error)
    process.exit(1)
  }
}

// Main execution
async function main() {
  const command = process.argv[2]

  if (command === 'rls') {
    await setupRLS()
  } else {
    await setupDatabase()
  }
}

if (require.main === module) {
  main()
}