
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-wonderwhiz-purple/30 bg-white/10 px-4 py-3 text-lg font-lexend text-wonderwhiz-purple ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-wonderwhiz-purple/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wonderwhiz-pink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 md:text-lg font-medium truncate",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
