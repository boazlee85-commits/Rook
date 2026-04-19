import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

const Calendar = ({ className, ...props }) => (
  <DayPicker className={cn("w-full rounded-md border border-border bg-background p-2", className)} {...props} />
);

export { Calendar };
