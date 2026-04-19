import { useEmblaCarousel } from "embla-carousel-react";
import { cn } from "@/lib/utils";

const Carousel = ({ className, children, options, ...props }) => {
  const [emblaRef] = useEmblaCarousel(options);
  return (
    <div ref={emblaRef} className={cn("overflow-hidden", className)} {...props}>
      <div className="flex">{children}</div>
    </div>
  );
};

const CarouselSlide = ({ className, children, ...props }) => (
  <div className={cn("flex-auto px-2", className)} {...props}>
    {children}
  </div>
);

export { Carousel, CarouselSlide };
