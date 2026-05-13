"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-sm text-xs font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-300",
        outline:
          "border border-[rgba(255,255,255,0.1)] text-secondary-200 hover:border-[rgba(255,255,255,0.2)] hover:text-secondary-100 hover:bg-[rgba(255,255,255,0.04)]",
        ghost: "text-secondary-300 hover:bg-[rgba(255,255,255,0.06)] hover:text-secondary-100",
        link: "text-primary underline-offset-4 hover:underline",
        destructive: "bg-risk-high text-white hover:bg-red-600",
      },
      size: {
        default: "px-4 py-2",
        sm: "px-3 py-1.5 text-[11px]",
        lg: "px-5 py-2.5 text-sm",
        icon: "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
Button.displayName = "Button";

export { Button, buttonVariants };
