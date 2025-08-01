import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-xl border", {
  variants: {
    variant: {
      default: "bg-white border-[#E5E7EB]",
      noticeGreen: "bg-[#F0FDF4] border-[#BBF7D0]",
      noticeBlue: "bg-[#EFF6FF] border-[#DBEAFE]",
      destructive: "bg-[#FEF2F2] border-[#FECACA]",
      warning: "bg-[#FFFBEB] border-[#FDE68A]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const cardHeaderVariants = cva("flex flex-col space-y-1.5 p-5 md:p-6", {
  variants: {
    variant: {
      default: "text-[#1F2937]",
      noticeGreen: "text-[#166534]",
      noticeBlue: "text-[#1E40AF]",
      destructive: "text-[#DC2626]",
      warning: "text-[#92400E]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const cardContentVariants = cva("text-sm p-5 md:p-6 pt-0 md:pt-0", {
  variants: {
    variant: {
      default: "text-[#1F2937]",
      noticeGreen: "text-[#166534]",
      noticeBlue: "text-[#1E3A8A]",
      destructive: "text-[#7F1D1D]",
      warning: "text-[#92400E]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Card = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, className }))}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardHeaderVariants({ variant, className }))}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-2 font-bold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardContentVariants({ variant, className }))}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 md:p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
