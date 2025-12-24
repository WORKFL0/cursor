import { NextRequest, NextResponse } from 'next/server'
import { CMSAuthService } from '@/lib/auth/cms-auth'
import { createAdminClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'

type MediaFileInsert = Database['public']['Tables']['media_files']['Insert']
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import crypto from 'crypto'

// Configuration
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await CMSAuthService.requireAuth(request, ['admin', 'editor'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const formData = await request.formData()
    
    const file = formData.get('file') as File
    const altText = formData.get('altText') as string
    const caption = formData.get('caption') as string
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${crypto.randomUUID()}.${fileExtension}`
    const filePath = join(UPLOAD_DIR, fileName)
    const publicUrl = `/uploads/${fileName}`

    // Save file to filesystem
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    await writeFile(filePath, buffer)

    // Get image dimensions if possible
    let width: number | undefined
    let height: number | undefined

    try {
      // For production, you'd use a proper image processing library like sharp
      // For now, we'll skip dimensions
    } catch (error) {
      console.log('Could not get image dimensions:', error)
    }

    // Save media info to database
    const supabase = createAdminClient()
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      )
    }
    const mediaFileData: MediaFileInsert = {
      filename: fileName,
      original_name: file.name,
      file_path: filePath,
      file_url: publicUrl,
      file_type: 'image',
      file_size: file.size,
      mime_type: file.type,
      alt_text: altText || '',
      caption: caption || '',
      width,
      height,
      uploaded_by: user.id
    }
    
    const { data: mediaFile, error: dbError } = await (supabase
      .from('media_files') as any)
      .insert(mediaFileData)
      .select()
      .single()

    if (dbError) {
      console.error('Database error saving media:', dbError)
      // File was saved but DB failed - could cleanup file here
      return NextResponse.json(
        { 
          success: true, 
          data: {
            filename: fileName,
            url: publicUrl,
            originalName: file.name
          },
          warning: 'File uploaded but database record failed'
        }
      )
    }

    if (!mediaFile) {
      return NextResponse.json(
        { success: false, error: 'Failed to save media file record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: mediaFile.id,
        filename: mediaFile.filename,
        originalName: mediaFile.original_name,
        url: mediaFile.file_url,
        type: mediaFile.file_type,
        size: mediaFile.file_size,
        mimeType: mediaFile.mime_type,
        altText: mediaFile.alt_text,
        caption: mediaFile.caption,
        width: mediaFile.width,
        height: mediaFile.height
      },
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await CMSAuthService.requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    const type = searchParams.get('type') // Filter by file type

    const supabase = createAdminClient()
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      )
    }
    
    let query = supabase
      .from('media_files')
      .select(`
        *,
        cms_users!media_files_uploaded_by_fkey (
          username,
          first_name,
          last_name
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (type) {
      query = query.eq('file_type', type)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Get media files error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch media files' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: count || 0,
      limit,
      offset
    })

  } catch (error) {
    console.error('Get media files error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}