import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 leading-4",
  {
    variants: {
      variant: {
        default:
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-foreground/5",
        panel:
          "shadow-sm outline-none transition-all focus:ring-2 focus:ring-current focus-visible:shadow-md bg-foreground/5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
export { Input };
