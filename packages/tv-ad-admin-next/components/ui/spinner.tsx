import { Loader2Icon } from "lucide-react"

import { cn } from "@/utils/index"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin text-gray-4", className)}
      {...props}
    />
  )
}

export { Spinner }
