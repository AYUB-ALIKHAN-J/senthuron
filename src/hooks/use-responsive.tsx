
import { useEffect, useState } from "react";

export type BreakpointType = "xs" | "sm" | "md" | "lg" | "xl";

// Breakpoint values in pixels (similar to Tailwind's defaults)
const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export function useResponsive() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointType>("lg");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < breakpoints.sm) {
        setCurrentBreakpoint("xs");
        setIsMobile(true);
      } else if (width < breakpoints.md) {
        setCurrentBreakpoint("sm");
        setIsMobile(true);
      } else if (width < breakpoints.lg) {
        setCurrentBreakpoint("md");
        setIsMobile(false);
      } else if (width < breakpoints.xl) {
        setCurrentBreakpoint("lg");
        setIsMobile(false);
      } else {
        setCurrentBreakpoint("xl");
        setIsMobile(false);
      }
    };

    // Set initial value
    updateBreakpoint();

    // Add event listener
    window.addEventListener("resize", updateBreakpoint);

    // Cleanup
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return {
    breakpoint: currentBreakpoint,
    isMobile,
    isTablet: currentBreakpoint === "md",
    isDesktop: currentBreakpoint === "lg" || currentBreakpoint === "xl",
    isSmallScreen: currentBreakpoint === "xs" || currentBreakpoint === "sm",
  };
}
