import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const text = searchParams.get('text') || 'Workflo'
  const width = parseInt(searchParams.get('width') || '200')
  const height = parseInt(searchParams.get('height') || '100')
  const type = searchParams.get('type') || 'client'
  
  // Color schemes based on type
  const colorSchemes = {
    client: { bg: 'linear-gradient(135deg, #f2f400 0%, #d97706 100%)', color: '#000' },
    office: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' },
    service: { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' },
    logo: { bg: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)', color: '#374151' }
  }
  
  const scheme = colorSchemes[type as keyof typeof colorSchemes] || colorSchemes.client
  const fontSize = Math.min(width / 8, height / 3, 24)
  
  return new ImageResponse(
    (
      <div
        style={{
          background: scheme.bg,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: scheme.color,
          fontSize: fontSize,
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        {text}
      </div>
    ),
    {
      width: width,
      height: height,
    }
  )
}