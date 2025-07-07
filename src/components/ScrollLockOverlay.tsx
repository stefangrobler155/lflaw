"use client";
import { useEffect } from "react";

export default function ScrollLockOverlay({ active }: { active: boolean }) {
  useEffect(() => {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (active) {
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
    };
  }, [active]);

  return null;
}
