import * as React from "react";
import * as BreadcrumbPrimitive from "@radix-ui/react-breadcrumb";
import { cn } from "@/lib/utils";

const Breadcrumb = BreadcrumbPrimitive.Root;
const BreadcrumbItem = BreadcrumbPrimitive.Item;

const BreadcrumbLink = React.forwardRef(({ className, ...props }, ref) => (
  <BreadcrumbPrimitive.Link ref={ref} className={cn("text-sm text-muted-foreground transition hover:text-foreground", className)} {...props} />
));
BreadcrumbLink.displayName = BreadcrumbPrimitive.Link.displayName;

const BreadcrumbSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <BreadcrumbPrimitive.Separator ref={ref} className={cn("mx-2 text-sm text-muted-foreground", className)} {...props} />
));
BreadcrumbSeparator.displayName = BreadcrumbPrimitive.Separator.displayName;

export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator };
