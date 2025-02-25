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

    'amp-script': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >
  }
}
