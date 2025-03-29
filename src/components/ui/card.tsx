
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

const CurioCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { colorVariant?: number }
>(({ className, colorVariant = 0, ...props }, ref) => {
  const getBorderColor = () => {
    switch (colorVariant % 5) {
      case 0: return "border-wonderwhiz-pink/60 bg-wonderwhiz-pink/5";
      case 1: return "border-wonderwhiz-gold/60 bg-wonderwhiz-gold/5";
      case 2: return "border-wonderwhiz-blue/60 bg-wonderwhiz-blue/5";
      case 3: return "border-wonderwhiz-purple/60 bg-wonderwhiz-purple/5";
      case 4: return "border-emerald-400/60 bg-emerald-400/5";
      default: return "border-white/60 bg-white/5";
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border-2 shadow-sm transition-all hover:shadow-md hover:scale-[1.01]",
        getBorderColor(),
        className
      )}
      {...props}
    />
  );
})
CurioCard.displayName = "CurioCard"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CurioCard }
