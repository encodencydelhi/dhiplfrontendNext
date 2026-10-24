"use client";

// Count-up animations for the careers pages, started when the element scrolls into view.
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

import ScoreRing from "./ScoreRing";

export function useCountUpInView<T extends Element>(target: number, delayMs = 0, durationMs = 1200) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now + delayMs;
      const t = Math.max(0, Math.min(1, (now - start) / durationMs));
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, delayMs, durationMs]);
  return [ref, value] as const;
}

// Score ring that fills from 0 to `value` once visible; children render the running number
export const CountRing = ({
  value,
  children,
  ...ring
}: { value: number; children: (v: number) => React.ReactNode } & Omit<React.ComponentProps<typeof ScoreRing>, "value" | "children">) => {
  const [ref, v] = useCountUpInView<HTMLDivElement>(value);
  return (
    <div ref={ref} className="flex-shrink-0">
      <ScoreRing value={v} {...ring}>
        {children(v)}
      </ScoreRing>
    </div>
  );
};

export const CountText = ({ value, delayMs = 0, className }: { value: number; delayMs?: number; className: string }) => {
  const [ref, v] = useCountUpInView<HTMLSpanElement>(value, delayMs, 900);
  return (
    <span ref={ref} className={className}>
      {v}%
    </span>
  );
};
