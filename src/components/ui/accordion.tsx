"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "border-b my-2 border-b-black dark:border-b-white/20",
      className,
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center px-2 sm:px-4 font-semibold justify-between py-3 sm:py-4 text-xs sm:text-sm md:text-xl transition-all cursor-pointer",
        "text-left [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg]:text-bold [&[data-state=open]>svg]:size-7 [&[data-state=open]>svg]:text-extrabold [&[data-state=open]>svg]:animate-pulse [&[data-state=closed]>svg]:rotate-0",
        "data-[state=open]:bg-black/5 dark:data-[state=open]:bg-primary/25 rounded-t-lg ",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-8 w-8 sm:h-4 sm:w-4 shrink-0 text-black dark:text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-xs md:text-[16px] data-[state=open]:bg-black/5 dark:data-[state=open]:bg-primary/25 px-2 sm:px-4 rounded-b-lg data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-3 sm:pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
