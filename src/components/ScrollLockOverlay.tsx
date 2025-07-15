"use client";
import { useEffect, useRef } from "react";

export default function ScrollLockOverlay({ active }: { active: boolean }) {
  const scrollY = useRef(0); // Use useRef to persist scroll position across re-renders

  useEffect(() => {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (active) {
      // Save current scroll position
      scrollY.current = window.scrollY;

      // Apply scroll lock styles
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.paddingRight = `${scrollBarWidth}px`;
      
      // Fix position to prevent jump when overflow is hidden
      document.documentElement.style.position = "fixed";
      document.documentElement.style.width = "100%";
      document.documentElement.style.top = `-${scrollY.current}px`; // Apply the saved scroll position
    } else {
      // Restore scroll lock styles
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
      document.documentElement.style.position = "";
      document.documentElement.style.width = "";
      document.documentElement.style.top = "";

      // Restore scroll position
      window.scrollTo(0, scrollY.current);
    }

    // Cleanup function
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
      document.documentElement.style.position = "";
      document.documentElement.style.width = "";
      document.documentElement.style.top = "";
      // No need to restore scroll position here, as it's handled when 'active' becomes false
    };
  }, [active]);

  return null;
}