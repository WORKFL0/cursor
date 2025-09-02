import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    // Check if users already exist
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (existingUsers.docs.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Admin user already exists' 
      })
    }

    // Create the first admin user
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@workflo.it',
        password: 'WorkfloAdmin2024!',
        name: 'Admin User',
      },
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Admin user created successfully!',
      instructions: 'Login at /admin with email: admin@workflo.it and password: WorkfloAdmin2024! (Please change this password immediately after logging in)'
    })
  } catch (error) {
    console.error('Error creating admin user:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}