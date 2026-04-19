import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root ref={ref} className={cn("relative flex w-full touch-none select-none items-center", className)} {...props} />
));
Slider.displayName = "Slider";

const SliderTrack = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Track ref={ref} className={cn("relative h-2 w-full grow overflow-hidden rounded-full bg-muted", className)} {...props} />
));
SliderTrack.displayName = "SliderTrack";

const SliderRange = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Range ref={ref} className={cn("absolute h-full bg-amber-500", className)} {...props} />
));
SliderRange.displayName = "SliderRange";

const SliderThumb = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Thumb ref={ref} className={cn("block h-5 w-5 rounded-full bg-foreground shadow-lg", className)} {...props} />
));
SliderThumb.displayName = "SliderThumb";

export { Slider, SliderTrack, SliderRange, SliderThumb };
