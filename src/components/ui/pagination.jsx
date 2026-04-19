import * as React from "react";
import { cn } from "@/lib/utils";

const Pagination = ({ className, children, ...props }) => (
  <nav className={cn("flex items-center justify-center gap-2", className)} aria-label="Pagination" {...props}>
    {children}
  </nav>
);

const PaginationButton = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("rounded-md border border-border bg-background px-3 py-1 text-sm transition hover:bg-muted", className)} {...props} />
));
PaginationButton.displayName = "PaginationButton";

export { Pagination, PaginationButton };
