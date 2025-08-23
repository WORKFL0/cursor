import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'office'
  
  if (type === 'office') {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <div style={{ fontSize: 60, marginBottom: 20 }}>🏢</div>
          <div style={{ fontWeight: 'bold' }}>Workflo Amsterdam Office</div>
          <div style={{ fontSize: 24, opacity: 0.8, marginTop: 10 }}>Herengracht 282</div>
          <div style={{ fontSize: 20, opacity: 0.7 }}>1016 BX Amsterdam</div>
        </div>
      ),
      {
        width: 1200,
        height: 400,
      }
    )
  }
  
  return new Response('Not found', { status: 404 })
}