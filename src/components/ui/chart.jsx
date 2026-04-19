import { ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const Chart = ({ className, children, ...props }) => (
  <ResponsiveContainer className={cn("w-full", className)} {...props}>
    {children}
  </ResponsiveContainer>
);

export { Chart };
