type InstructionsProps = {
  className?: string
  status?: string
  wordings: string[]
  isDot?: boolean
}

export function Instructions({
  className = '',
  wordings,
  isDot = true,
}: InstructionsProps) {
  return (
    <div
      className={`flex flex-col items-start gap-1 self-stretch rounded-lg border border-[#FDE68A] bg-[#FFFBEB] p-4 ${className}`}
    >
      <h6 className="font-sans text-sm leading-normal font-medium text-[#A16207]">
        說明
      </h6>
      <ul className="space-y-2 font-sans text-sm leading-normal font-normal text-[#D97706]">
        {wordings.map((wording, index) => (
          <li className="flex items-start gap-2" key={index}>
            {isDot && (
              <span className="mt-2 size-1 rounded-full bg-[#D97706]"></span>
            )}
            <span>{wording}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
