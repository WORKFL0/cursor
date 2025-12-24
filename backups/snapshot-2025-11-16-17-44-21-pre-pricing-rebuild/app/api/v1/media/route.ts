/**
 * Media/Image Upload API - v1
 * Handle file uploads and media library management
 * Author: Claude Code - Workflo Backend System
 * Date: 2025-09-04
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireEditor, allowAnonymous } from '@/lib/middleware/auth'
import type { 
  Database, 
  MediaLibrary, 
  ApiResponse 
} from '@/lib/database.types'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import crypto from 'crypto'

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Supabase client
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// Configuration
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

/**
 * Generate unique filename
 */
function generateUniqueFilename(originalFilename: string): string {
  const ext = path.extname(originalFilename)
  const name = path.basename(originalFilename, ext)
  const timestamp = Date.now()
  const random = crypto.randomBytes(4).toString('hex')
  
  return `${name}-${timestamp}-${random}${ext}`
}

/**
 * Get file dimensions for images
 */
async function getImageDimensions(filePath: string): Promise<{ width?: number; height?: number }> {
  // This is a placeholder - in production, use a proper image processing library
  // like sharp or jimp to get actual dimensions
  try {
    // For now, return empty dimensions
    return { width: undefined, height: undefined }
  } catch (error) {
    return { width: undefined, height: undefined }
  }
}

/**
 * Ensure upload directory exists
 */
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

// ================================================================
// GET /api/v1/media - List media files
// ================================================================

export const GET = allowAnonymous(async (req: NextRequest, { user }) => {
  try {
    const url = new URL(req.url)
    const searchParams = url.searchParams
    
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = (page - 1) * limit
    
    const search = searchParams.get('search')
    const mimeType = searchParams.get('mime_type')
    const isPublic = searchParams.get('public')

    // Build query
    let query = supabase
      .from('media_library')
      .select(`
        id,
        filename,
        original_filename,
        file_path,
        file_url,
        mime_type,
        file_size,
        width,
        height,
        alt_text,
        caption,
        usage_count,
        tags,
        is_public,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (!user) {
      // Anonymous users can only see public files
      query = query.eq('is_public', true)
    } else if (isPublic !== null) {
      query = query.eq('is_public', isPublic === 'true')
    }

    if (search) {
      query = query.or(`original_filename.ilike.%${search}%,alt_text.ilike.%${search}%,caption.ilike.%${search}%`)
    }

    if (mimeType) {
      query = query.like('mime_type', `${mimeType}%`)
    }

    const { data: mediaFiles, error } = await query

    if (error) {
      throw new Error(`Failed to fetch media files: ${error.message}`)
    }

    // Get total count
    let countQuery = supabase
      .from('media_library')
      .select('*', { count: 'exact', head: true })

    if (!user) {
      countQuery = countQuery.eq('is_public', true)
    } else if (isPublic !== null) {
      countQuery = countQuery.eq('is_public', isPublic === 'true')
    }

    if (search) {
      countQuery = countQuery.or(`original_filename.ilike.%${search}%,alt_text.ilike.%${search}%,caption.ilike.%${search}%`)
    }

    if (mimeType) {
      countQuery = countQuery.like('mime_type', `${mimeType}%`)
    }

    const { count } = await countQuery

    return NextResponse.json({
      success: true,
      data: {
        files: mediaFiles,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
          hasNext: page < Math.ceil((count || 0) / limit),
          hasPrev: page > 1
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('GET /api/v1/media error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch media files',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
})

// ================================================================
// POST /api/v1/media - Upload new file (requires editor role)
// ================================================================

export const POST = requireEditor(async (req: NextRequest, { user }) => {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const altText = formData.get('alt_text') as string || null
    const caption = formData.get('caption') as string || null
    const tags = formData.get('tags') as string || ''
    const isPublic = formData.get('is_public') === 'true'

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided',
          message: 'Please select a file to upload'
        },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'File too large',
          message: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
        },
        { status: 400 }
      )
    }

    // Validate mime type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type',
          message: `Allowed file types: ${ALLOWED_MIME_TYPES.join(', ')}`
        },
        { status: 400 }
      )
    }

    // Ensure upload directory exists
    await ensureUploadDir()

    // Generate unique filename
    const filename = generateUniqueFilename(file.name)
    const filePath = path.join('uploads', filename)
    const fullPath = path.join(UPLOAD_DIR, filename)
    const fileUrl = `/uploads/${filename}`

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(fullPath, buffer)

    // Get image dimensions if it's an image
    let dimensions = { width: undefined, height: undefined }
    if (file.type.startsWith('image/')) {
      dimensions = await getImageDimensions(fullPath)
    }

    // Parse tags
    const parsedTags = tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : []

    // Save to database
    const mediaData = {
      filename,
      original_filename: file.name,
      file_path: filePath,
      file_url: fileUrl,
      mime_type: file.type,
      file_size: file.size,
      width: dimensions.width,
      height: dimensions.height,
      alt_text: altText,
      caption: caption,
      uploaded_by: user?.id,
      tags: parsedTags,
      is_public: isPublic
    }

    const { data: newMedia, error } = await supabase
      .from('media_library')
      .insert(mediaData)
      .select()
      .single()

    if (error) {
      // Clean up uploaded file if database insert fails
      try {
        await import('fs/promises').then(fs => fs.unlink(fullPath))
      } catch (cleanupError) {
        console.error('Failed to cleanup file after database error:', cleanupError)
      }
      
      throw new Error(`Failed to save media to database: ${error.message}`)
    }

    const response: ApiResponse<MediaLibrary> = {
      success: true,
      data: newMedia,
      message: 'File uploaded successfully',
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('POST /api/v1/media error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload file',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
})

// ================================================================
// PUT /api/v1/media/[id] - Update media metadata (requires editor role)
// ================================================================

export const PUT = requireEditor(async (req: NextRequest, { user }) => {
  try {
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const mediaId = pathParts[pathParts.length - 1]

    if (!mediaId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing media ID',
          message: 'Media ID is required'
        },
        { status: 400 }
      )
    }

    const body = await req.json()

    // Check if media exists
    const { data: existingMedia, error: fetchError } = await supabase
      .from('media_library')
      .select('*')
      .eq('id', mediaId)
      .single()

    if (fetchError || !existingMedia) {
      return NextResponse.json(
        {
          success: false,
          error: 'Media not found',
          message: 'The media file you are trying to update does not exist'
        },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}
    const allowedFields = ['alt_text', 'caption', 'tags', 'is_public']

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    // Parse tags if provided
    if (body.tags && typeof body.tags === 'string') {
      updateData.tags = body.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
    }

    const { data: updatedMedia, error: updateError } = await supabase
      .from('media_library')
      .update(updateData)
      .eq('id', mediaId)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Failed to update media: ${updateError.message}`)
    }

    const response: ApiResponse<MediaLibrary> = {
      success: true,
      data: updatedMedia,
      message: 'Media updated successfully',
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('PUT /api/v1/media/[id] error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update media',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
})

// ================================================================
// DELETE /api/v1/media/[id] - Delete media file (requires editor role)
// ================================================================

export const DELETE = requireEditor(async (req: NextRequest, { user }) => {
  try {
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const mediaId = pathParts[pathParts.length - 1]

    if (!mediaId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing media ID',
          message: 'Media ID is required'
        },
        { status: 400 }
      )
    }

    // Check if media exists
    const { data: existingMedia, error: fetchError } = await supabase
      .from('media_library')
      .select('*')
      .eq('id', mediaId)
      .single()

    if (fetchError || !existingMedia) {
      return NextResponse.json(
        {
          success: false,
          error: 'Media not found',
          message: 'The media file you are trying to delete does not exist'
        },
        { status: 404 }
      )
    }

    // Delete from database first
    const { error: deleteError } = await supabase
      .from('media_library')
      .delete()
      .eq('id', mediaId)

    if (deleteError) {
      throw new Error(`Failed to delete media from database: ${deleteError.message}`)
    }

    // Delete physical file
    try {
      const fullPath = path.join(process.cwd(), 'public', existingMedia.file_path)
      await import('fs/promises').then(fs => fs.unlink(fullPath))
    } catch (fileError) {
      console.error('Failed to delete physical file:', fileError)
      // Don't fail the request if file deletion fails
    }

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Media deleted successfully',
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('DELETE /api/v1/media/[id] error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete media',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
})