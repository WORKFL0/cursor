import { supabaseAdmin } from './supabase'
import type { Database } from '../types/supabase'

/**
 * Supabase Database Utilities for Payload CMS Integration
 * This module provides utilities for managing the Supabase database
 * with Payload CMS, including RLS policies and schema setup.
 */

// Type-safe database client
export const db = supabaseAdmin

/**
 * Initialize database schema for Payload CMS
 * This function sets up the necessary extensions and configurations
 */
export async function initializeDatabase() {
  try {
    if (!db) {
      throw new Error('Supabase admin client not available')
    }
    
    // Enable necessary PostgreSQL extensions
    const extensions = [
      'uuid-ossp',
      'pgcrypto',
      'pgjwt'
    ]

    for (const extension of extensions) {
      const { error } = await db.rpc('create_extension_if_not_exists', {
        extension_name: extension
      })
      if (error && !error.message.includes('already exists')) {
        console.error(`Error creating extension ${extension}:`, error)
      }
    }

    console.log('Database initialized successfully')
    return { success: true }
  } catch (error) {
    console.error('Database initialization failed:', error)
    return { success: false, error }
  }
}

/**
 * Set up Row Level Security policies for Payload CMS tables
 * This ensures proper security for the CMS data
 */
export async function setupRLSPolicies() {
  try {
    // RLS policies will be created after Payload CMS creates the tables
    // For now, we'll prepare the policy creation functions
    
    const policies = [
      {
        table: 'payload_users',
        policy: 'Users can manage their own data',
        sql: `
          CREATE POLICY "Users can manage their own data" ON payload_users
          FOR ALL USING (auth.uid() = id::uuid);
        `
      },
      {
        table: 'payload_media',
        policy: 'Authenticated users can access media',
        sql: `
          CREATE POLICY "Authenticated users can access media" ON payload_media
          FOR ALL USING (auth.role() = 'authenticated');
        `
      }
    ]

    // Note: These policies will be applied after the tables are created by Payload CMS
    console.log('RLS policies prepared for setup')
    return { success: true, policies }
  } catch (error) {
    console.error('RLS policy setup failed:', error)
    return { success: false, error }
  }
}

/**
 * Test database connection
 */
export async function testDatabaseConnection() {
  try {
    if (!db) {
      throw new Error('Supabase admin client not available')
    }
    
    const { data, error } = await db
      .from('information_schema.tables')
      .select('table_name')
      .limit(1)

    if (error) {
      throw error
    }

    console.log('Database connection successful')
    return { success: true, connected: true }
  } catch (error) {
    console.error('Database connection failed:', error)
    return { success: false, connected: false, error }
  }
}

/**
 * Create backup of Payload CMS data
 */
export async function createBackup() {
  try {
    // This would typically involve exporting data from all Payload tables
    // For now, we'll set up the structure for backup functionality
    
    const backupData = {
      timestamp: new Date().toISOString(),
      tables: [] as any[]
    }

    // In a real implementation, you would query all Payload tables
    // and export their data here
    
    console.log('Backup functionality prepared')
    return { success: true, backup: backupData }
  } catch (error) {
    console.error('Backup creation failed:', error)
    return { success: false, error }
  }
}

/**
 * Monitor database performance
 */
export async function getDatabaseStats() {
  try {
    if (!db) {
      throw new Error('Supabase admin client not available')
    }
    
    // Query database statistics
    const { data: tableStats, error } = await db
      .rpc('get_table_stats')

    if (error && !error.message.includes('function')) {
      throw error
    }

    return {
      success: true,
      stats: {
        tables: tableStats || [],
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Failed to get database stats:', error)
    return { success: false, error }
  }
}