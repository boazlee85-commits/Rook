import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";

const NavigationMenu = NavigationMenuPrimitive.Root;
const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List ref={ref} className={cn("flex space-x-1", className)} {...props} />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;
const NavigationMenuTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger ref={ref} className={cn("inline-flex items-center rounded-md px-3 py-2 text-sm font-medium", className)} {...props} />
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content ref={ref} className={cn("rounded-md border border-border bg-background p-4 shadow-lg", className)} {...props} />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

export { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent };
