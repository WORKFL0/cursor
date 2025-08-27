import { NextResponse } from 'next/server'
import { servicesData } from '@/lib/data/services-data'

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: servicesData,
      total: servicesData.length
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch services',
        data: null
      }, 
      { status: 500 }
    )
  }
}