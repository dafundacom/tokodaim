import * as React from "react"

import { cn } from "@/lib/utils/style"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export type InputSizes =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"

export type InputElementSizes = Exclude<
  InputSizes,
  "md" | "2xl" | "3xl" | "4xl" | "5xl"
>
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { className, type, ...rest } = props
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...rest}
      />
    )
  },
)
