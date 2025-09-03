import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center whitespace-nowrap rounded-md font-medium ring-offset-white transition-colors transition-all duration-300 hover:opacity-90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        default:
          "text-bold bg-transparent dark:bg-transparent text-center justify center text-sm sm:text-base lg:text-lg xl:text-xl text-white hover:bg-primary/90 hover:dark:bg-slate-500/90",
        destructive:
          "text-bold bg-red-500 text-sm sm:text-base lg:text-lg text-slate-50 hover:bg-red-500/90 dark:bg-red-700 dark:text-slate-50 dark:hover:bg-red-900/90",
        outline:
          "capitalize border text-sm sm:text-base lg:text-lg xl:text-xl border-2 border-primary bg-transparent text-white hover:bg-white/50 dark:border-slate-800 dark:hover:text-slate-50",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        ghost:
          "border-2 border-white hover:bg-slate-100 text-2xl sm:text-3xl lg:text-5xl hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
        inactive: "border-2 border-slate-600 bg-white text-slate-600",
        active: "bg-alert text-white bg-red-700",
      },
      size: {
        default: "h-9 sm:h-10 px-3 sm:px-4 py-2",
        sm: "h-7 sm:h-9 w-7 sm:w-9 rounded-md px-2 sm:px-3",
        lg: "rounded-md px-3 sm:px-4 py-2.5",
        icon: "h-fit w-fit rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
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
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
