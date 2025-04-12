
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black hover:bg-white/90 rounded-full shadow-lg",
        secondary:
          "bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-full border border-white/20",
        ghost: "hover:bg-white/10 text-white",
        link: "text-white underline-offset-4 hover:underline",
        icon: "bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-full border border-white/10 w-8 h-8 p-0",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-full px-3 text-xs",
        lg: "h-10 rounded-full px-8",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface AppleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const AppleButton = React.forwardRef<HTMLButtonElement, AppleButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
AppleButton.displayName = "AppleButton";

export { AppleButton, buttonVariants };
