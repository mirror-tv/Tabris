import Document, {
  DocumentContext,
  DocumentInitialProps,
  Main,
} from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    // Check if this is an AMP page
    // For AMP pages, we must skip styled-components to avoid
    // styles being injected into body, which violates AMP rules
    // See: https://github.com/vercel/next.js/issues/21278
    const isAmpPage = ctx.pathname?.includes('/amp/')

    if (isAmpPage) {
      // For AMP pages, skip styled-components completely
      // Styles should be inlined in <style amp-custom> tag in the page component
      const originalRenderPage = ctx.renderPage
      ctx.renderPage = () => originalRenderPage()
      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: initialProps.styles, // Don't add styled-components styles
      }
    }

    // For non-AMP pages, use styled-components normally
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    // Since this project only has AMP pages that return full HTML,
    // we return just Main and let the page component's
    // full HTML structure (with head and body) take over
    return <Main />
  }
}
