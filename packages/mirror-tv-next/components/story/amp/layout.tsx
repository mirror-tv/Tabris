import { GA4_ID } from '~/constants/environment-variables'
import { Noto_Sans } from 'next/font/google'

const noto_sans = Noto_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans',
})

export default function AMPLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <a href="/">
          <amp-img
            width="183"
            height="34"
            src="/icons/mnews-logo-white.svg"
            alt="mnews homepage"
            layout="intrinsic"
          />
        </a>
      </header>
      <main>{children}</main>
    </>
  )
}
