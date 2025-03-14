declare namespace JSX {
  interface IntrinsicElements {
    'amp-analytics': {
      type?: string
      config?: string
      'data-credentials'?: string
      children?: React.ReactNode
    }
    'amp-img': {
      width?: string
      height?: string
      src: string
      alt?: string
      layout?: string
      className?: string
      [key: string]: any
    }
    'amp-video': React.DetailedHTMLProps<
      React.VideoHTMLAttributes<HTMLVideoElement>,
      HTMLVideoElement
    >
    'amp-youtube': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      'data-videoid': string
      width?: string | number
      height?: string | number
      layout?: string
    }
    'amp-script': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >
  }
}
