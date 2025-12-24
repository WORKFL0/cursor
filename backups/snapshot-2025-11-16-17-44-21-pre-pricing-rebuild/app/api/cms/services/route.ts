import { NextResponse } from 'next/server'

// Temporary in-memory storage (in production, use database)
let services = [
  {
    id: 1,
    title: 'Managed IT Services',
    description: 'Complete IT beheer voor jouw organisatie',
    icon: 'Shield',
    published: true,
  },
  {
    id: 2,
    title: 'Cloud Solutions',
    description: 'Microsoft 365 en Azure cloud diensten',
    icon: 'Cloud',
    published: true,
  },
  {
    id: 3,
    title: 'Cybersecurity',
    description: 'Geavanceerde beveiliging en compliance',
    icon: 'Lock',
    published: true,
  },
]

export async function GET() {
  return NextResponse.json(services)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newService = {
    id: services.length + 1,
    ...body,
    published: body.published || false,
  }
  services.push(newService)
  return NextResponse.json(newService)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const index = services.findIndex(s => s.id === body.id)
  if (index !== -1) {
    services[index] = body
    return NextResponse.json(body)
  }
  return NextResponse.json({ error: 'Service not found' }, { status: 404 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  services = services.filter(s => s.id !== id)
  return NextResponse.json({ success: true })
}