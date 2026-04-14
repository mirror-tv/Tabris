import { NextResponse } from 'next/server'
import { ENV } from '~/constants/environment'

export async function GET() {
  let robotsContent = ''

  switch (ENV) {
    case 'prod':
      robotsContent = `# Source: Tabris/mirror-tv-next
User-agent: Googlebot
Disallow: /login
Disallow: /search/

User-agent: *
Disallow: /search/
Allow: /`
      break

    case 'staging':
      robotsContent = `# Source: Tabris/mirror-tv-next
User-agent: *
Disallow: /`
      break

    case 'dev':
    default:
      robotsContent = `# Source: Tabris/mirror-tv-next
User-agent: *
Disallow: /`
      break
  }

  return new NextResponse(robotsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
