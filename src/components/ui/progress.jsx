import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef(({ className, ...props }, ref) => (
  <ProgressPrimitive.Root ref={ref} className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)} {...props} />
));
Progress.displayName = "Progress";

const ProgressIndicator = React.forwardRef(({ className, ...props }, ref) => (
  <ProgressPrimitive.Indicator ref={ref} className={cn("h-full w-full bg-amber-500 transition-all", className)} {...props} />
));
ProgressIndicator.displayName = "ProgressIndicator";

export { Progress, ProgressIndicator };
