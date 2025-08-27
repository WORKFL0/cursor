import { NextResponse } from 'next/server'
import { getServiceBySlug } from '@/lib/data/services-data'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    const service = getServiceBySlug(slug)
    
    if (!service) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Service not found',
          data: null
        }, 
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: service
    })
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch service',
        data: null
      }, 
      { status: 500 }
    )
  }
}