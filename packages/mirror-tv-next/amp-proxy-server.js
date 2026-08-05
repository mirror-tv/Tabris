/* eslint-disable */
const express = require('express')
const {
  createProxyMiddleware,
  responseInterceptor,
} = require('http-proxy-middleware')

// Create Express Server
const app = express()

// Configuration
const PORXY_SERVER_PORT = Number(process.env.PROXY_SERVER_PORT) || 3000
const PROXIED_SERVER_PORT = Number(process.env.PROXIED_SERVER_PORT) || 3001
const HOST = 'localhost'
const API_SERVICE_URL = `http://localhost:${PROXIED_SERVER_PORT}`
// const jsdom = require('jsdom')
// const { JSDOM } = jsdom

// handle amp route
app.use(
  '/story/amp',
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    selfHandleResponse: true,
    on: {
      proxyRes: responseInterceptor(async (responseBuffer, req, res) => {
      let response = responseBuffer.toString('utf8') // convert buffer to string
      const originStoryUrl = res.url?.replace('/story/amp/', '/story/')

      // Fix Next.js nested HTML structure issue
      // Next.js wraps our AMP page's full HTML with its own <html><head><body> structure
      // This creates nested HTML which causes AMP validation errors
      // We need to extract only the AMP page's HTML structure
      // See: https://github.com/vercel/next.js/issues/21278

      if (response.includes('<!-- __NEXT_DATA__ -->')) {
        // Find the second DOCTYPE (from the AMP page component)
        const nextDataIndex = response.indexOf('<!-- __NEXT_DATA__ -->')
        const secondDoctypeIndex = response.indexOf(
          '<!DOCTYPE',
          nextDataIndex + 1
        )
        if (secondDoctypeIndex !== -1) {
          // Extract from the second DOCTYPE onwards (this is our AMP page's HTML)
          let ampHtml = response.substring(secondDoctypeIndex)

          // The AMP page component returns a complete HTML document
          // Find the first </html> tag - that's where the AMP page ends
          // Everything after that is from Next.js wrapper
          const firstHtmlClose = ampHtml.indexOf('</html>')
          if (firstHtmlClose !== -1) {
            // Extract everything up to and including the first </html>
            response = ampHtml.substring(0, firstHtmlClose + 7)
          } else {
            // Fallback: if no closing tag found, use everything from second DOCTYPE
            response = ampHtml
          }
        }
      }

      return response
        .replace(/<amp-video controls="true"/g, '<amp-video controls')
        .replace(/contenteditable|spellcheck/g, (match) => `data-${match}`)
        .replace(
          /<a class="link-to-story"/g,
          (match) => `${match} href=${originStoryUrl} target="_blank"`
        )
      }),
    },
  })
)

// proxy all other routes in case any other request misleading to this proxy
app.use(createProxyMiddleware({ target: API_SERVICE_URL, changeOrigin: true }))

// Start Proxy
app.listen(PORXY_SERVER_PORT, () => {
  console.log(`Starting Proxy at ${HOST}:${PORXY_SERVER_PORT}`)
})
