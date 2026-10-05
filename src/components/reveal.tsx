"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -24px 0px" });
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  // Content remains visible in server HTML and when JavaScript is unavailable.
  const visible = !mounted || reducedMotion || inView;
  return <motion.div ref={ref} className={`reveal-content ${className}`} initial={false} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 24 }} transition={{ duration: reducedMotion ? 0 : .8, delay: visible && !reducedMotion ? delay : 0, ease: [.22, 1, .36, 1] }}>
    {children}
  </motion.div>;
}

