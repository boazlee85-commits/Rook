import * as React from "react";
import * as CommandPrimitive from "cmdk";
import { cn } from "@/lib/utils";

const Command = CommandPrimitive.Command;

const CommandInput = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Input ref={ref} className={cn("h-10 w-full rounded-md border border-border bg-background px-3 text-sm shadow-sm outline-none", className)} {...props} />
));
CommandInput.displayName = "CommandInput";

const CommandList = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.List ref={ref} className={cn("max-h-80 overflow-y-auto p-1", className)} {...props} />
));
CommandList.displayName = "CommandList";

const CommandItem = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Item ref={ref} className={cn("cursor-pointer rounded-md px-2 py-1 text-sm text-foreground focus:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)} {...props} />
));
CommandItem.displayName = "CommandItem";

export { Command, CommandInput, CommandList, CommandItem };
