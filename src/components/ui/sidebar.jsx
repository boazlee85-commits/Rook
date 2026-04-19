import * as React from "react";
import { cn } from "@/lib/utils";

const Sidebar = React.forwardRef(({ className, ...props }, ref) => (
  <aside ref={ref} className={cn("flex h-full flex-col border-r border-border bg-background", className)} {...props} />
));
Sidebar.displayName = "Sidebar";

export { Sidebar };
