"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import { useScrollToSection } from "@/lib/useScrollToSection";

/**
 * On every page change: back to the top (Lenis would otherwise keep the old
 * scroll position), or straight to the section when the link has a #hash.
 */
function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();
  const scrollToSection = useScrollToSection();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) {
      // Let the new page render before measuring the section
      const t = setTimeout(() => scrollToSection(id), 120);
      return () => clearTimeout(t);
    }
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    // Only on navigation; lenis / scrollToSection are read at that moment
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  // No smoothed wheel scrolling under reduced motion
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: !reduce }}>
      <ScrollReset />
      {children}
    </ReactLenis>
  );
}
