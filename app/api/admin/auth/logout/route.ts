import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Geen token gevonden' },
        { status: 400 }
      )
    }

    const supabase = getServerSupabaseClient()

    // Get session to log activity
    const { data: session } = await supabase
      .from('admin_sessions')
      .select('user_id')
      .eq('token', token)
      .single()

    // Delete session
    await supabase.from('admin_sessions').delete().eq('token', token)

    // Log activity if we found the session
    if (session) {
      await supabase.rpc('log_admin_activity', {
        p_user_id: session.user_id,
        p_action: 'logout',
        p_ip_address: request.ip || request.headers.get('x-forwarded-for'),
        p_user_agent: request.headers.get('user-agent'),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}
