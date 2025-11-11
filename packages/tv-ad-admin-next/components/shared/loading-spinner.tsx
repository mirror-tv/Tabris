type LoadingSpinnerProps = {
  message?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  overlay?: boolean
}

const sizeMap = {
  sm: 'size-6',
  md: 'size-8',
  lg: 'size-12',
}

export default function LoadingSpinner({
  message = '載入中...',
  className = '',
  size = 'md',
  overlay = false,
}: LoadingSpinnerProps) {
  const spinnerSize = sizeMap[size]

  const content = (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        className={`${spinnerSize} animate-spin rounded-full border-4 border-gray-3 border-t-blue-6`}
      />
      {message && <p className="text-sm text-gray-7">{message}</p>}
    </div>
  )

  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}
