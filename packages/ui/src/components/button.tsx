import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Icon } from "@yopem-ui/react-icons"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        danger: "bg-danger text-danger-foreground hover:bg-danger/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant,
      size,
      asChild = false,
      loading = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button"
    if (loading) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          disabled
          ref={ref}
          {...props}
        >
          <Icon name="Loader" className="mr-2 size-4" />
          {children}
        </Comp>
      )
    } else {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      )
    }
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
