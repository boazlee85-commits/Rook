import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
      variant === "default" && "bg-muted text-foreground",
      variant === "secondary" && "bg-secondary text-secondary-foreground",
      variant === "destructive" && "bg-red-600 text-white",
      className
    )}
    {...props}
  />
));
Badge.displayName = "Badge";

export { Badge };
