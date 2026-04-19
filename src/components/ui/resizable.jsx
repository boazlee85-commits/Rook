import * as React from "react";
import { Panel, PanelGroup } from "react-resizable-panels";
import { cn } from "@/lib/utils";

const ResizableGroup = ({ className, children, ...props }) => (
  <PanelGroup className={cn("flex h-full w-full", className)} {...props}>
    {children}
  </PanelGroup>
);

const ResizablePanel = ({ className, children, ...props }) => (
  <Panel className={cn("overflow-hidden", className)} {...props}>
    {children}
  </Panel>
);

export { ResizableGroup, ResizablePanel };
