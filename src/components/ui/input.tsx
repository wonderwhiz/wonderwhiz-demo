
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-wonderwhiz-bright-pink/20 bg-white/10 px-3 py-2 text-sm",
          "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-white/60 focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-wonderwhiz-bright-pink focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "text-white font-inter", // Using Inter font from brand guidelines
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
