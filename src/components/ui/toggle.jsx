import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cn } from "@/lib/utils";

const Toggle = React.forwardRef(({ className, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn("inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-3 text-sm transition data-[state=on]:bg-amber-500", className)}
    {...props}
  />
));
Toggle.displayName = "Toggle";

export { Toggle };
