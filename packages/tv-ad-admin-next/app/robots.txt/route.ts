import { NextResponse } from 'next/server'

export async function GET() {
  const robotsContent = `# Source: Tabris/tv-ad-admin-next
  User-agent: *
	Disallow: /`

  return new NextResponse(robotsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
