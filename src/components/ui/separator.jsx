import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

const Separator = React.forwardRef(({ className, orientation = "horizontal", ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    orientation={orientation}
    className={cn(
      orientation === "vertical" ? "h-full w-px" : "h-px w-full",
      "bg-border",
      className
    )}
    {...props}
  />
));
Separator.displayName = "Separator";

export { Separator };
