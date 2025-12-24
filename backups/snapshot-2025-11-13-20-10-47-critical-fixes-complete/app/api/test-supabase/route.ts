import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'

export async function GET() {
  // Check configuration
  const config = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    configured: isSupabaseConfigured
  }

  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({
      success: false,
      error: 'Supabase not configured',
      config,
      recommendation: 'Check your .env.local file for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    }, { status: 500 })
  }

  try {
    // Test the connection with a simple query
    const { data: _data, error } = await supabase
      .from('articles')
      .select('count')
      .limit(1)

    if (error) {
      // Check if it's a network/fetch error
      if (error.message?.includes('fetch failed') || error.message?.includes('ENOTFOUND')) {
        return NextResponse.json({
          success: false,
          error: 'Cannot connect to Supabase',
          details: error.message,
          config,
          recommendation: 'The Supabase URL may be incorrect or the project may not exist. Using localStorage fallback.'
        }, { status: 500 })
      }
      
      // Check if it's a table not found error
      if (error.code === '42P01') {
        return NextResponse.json({
          success: false,
          error: 'Articles table does not exist',
          details: error.message,
          config,
          recommendation: 'Run the database migration script to create the articles table'
        }, { status: 500 })
      }

      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      config,
      hasArticlesTable: true
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Supabase connection test failed',
      details: error.message || 'Unknown error',
      config,
      recommendation: 'Using localStorage fallback for articles'
    }, { status: 500 })
  }
}