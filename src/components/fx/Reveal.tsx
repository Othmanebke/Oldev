"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "ul" | "ol";
};

/**
 * Adds `is-in` once the block enters the viewport; its [data-reveal]
 * children then rise in, staggered by their `--i` (see globals.css).
 */
export default function Reveal({ children, className = "", style, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLDivElement & HTMLUListElement & HTMLOListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-in");
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </Tag>
  );
}
