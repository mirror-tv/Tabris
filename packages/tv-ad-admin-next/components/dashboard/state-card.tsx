type StateCardProps = {
  count: number
  text: string
  color: string
  bgColor: string
}

export default function StateCard({ count, text, color, bgColor }: StateCardProps) {
  return (
    <div
      className={`rounded-lg border p-4 text-center transition-all hover:shadow-md ${bgColor}`}
    >
      <div className={`text-2xl font-bold ${color}`}>{count}</div>
      <div className={`text-sm ${color}`}>{text}</div>
    </div>
  )
}
