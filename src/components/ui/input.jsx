import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-sm outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200/50",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";

export { Input };
