import * as React from "react";
import { cn } from "@/lib/utils";

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("w-full overflow-auto", className)} {...props} />
));
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("border-b border-border bg-muted/50", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("bg-background", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-4 px-4 py-3", className)} {...props} />
));
TableRow.displayName = "TableRow";

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("min-w-[10rem] px-2 py-1 text-sm", className)} {...props} />
));
TableCell.displayName = "TableCell";

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("min-w-[10rem] px-2 py-1 text-left text-xs uppercase tracking-wide text-muted-foreground", className)} {...props} />
));
TableHead.displayName = "TableHead";

export { Table, TableHeader, TableBody, TableRow, TableCell, TableHead };
