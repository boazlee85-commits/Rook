import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { cn } from "@/lib/utils";

const Menubar = MenubarPrimitive.Root;
const MenubarMenu = MenubarPrimitive.Menu;
const MenubarTrigger = MenubarPrimitive.Trigger;
const MenubarContent = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content ref={ref} className={cn("rounded-md border border-border bg-background p-1 shadow-lg", className)} {...props} />
  </MenubarPrimitive.Portal>
));
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Item ref={ref} className={cn("cursor-pointer rounded-sm px-2 py-2 text-sm outline-none focus:bg-amber-500/10", className)} {...props} />
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem };
