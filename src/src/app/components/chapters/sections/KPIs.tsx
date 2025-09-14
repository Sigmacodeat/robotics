"use client";
import { useTranslations } from "next-intl";
import CountUp from "react-countup";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { defaultTransition } from "@/components/animation/variants";

type KPIItem = {
  labelKey: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
};

type KPIsProps = {
  items?: readonly KPIItem[];
};

export function KPIs({ items: itemsProp }: KPIsProps) {
  const t = useTranslations("kpi");
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, {once: true, margin: "-20% 0px -10% 0px"});
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (inView && !hasAnimated) setHasAnimated(true);
  }, [inView, hasAnimated]);

  const defaults: readonly KPIItem[] = [
    { labelKey: "uptime", value: 99.99, suffix: "%", decimals: 2 },
    { labelKey: "roi", value: 12, suffix: "x", decimals: 0 },
    { labelKey: "throughput", value: 28, suffix: "%", decimals: 0 },
    { labelKey: "units", value: 15, suffix: "+", decimals: 0 },
  ] as const;

  const items = (itemsProp ?? defaults).map((k) => ({
    ...k,
    label: t(k.labelKey as any),
  }));

  return (
    <section className="container-gutter py-10 md:py-14" aria-label="KPIs" ref={ref}>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
        {...(!reduceMotion ? { initial: { opacity: 0, y: 12 } } : {})}
        {...(!reduceMotion && inView ? { animate: { opacity: 1, y: 0 } } : {})}
        transition={{ ...defaultTransition, duration: 0.6 }}
      >
        {items.map((k, i) => (
          <motion.div
            key={i}
            className="rounded-2xl bg-[--color-card] backdrop-blur p-5 shadow-sm"
            {...(!reduceMotion ? { initial: { opacity: 0, y: 10 } } : {})}
            {...(!reduceMotion && inView ? { animate: { opacity: 1, y: 0 } } : {})}
            transition={{ ...defaultTransition, duration: 0.5, delay: reduceMotion ? 0 : i * 0.08 }}
          >
            <div className="text-2xl md:text-3xl font-semibold tracking-tight text-[--color-foreground-strong]">
              {hasAnimated && !reduceMotion ? (
                <CountUp end={k.value} duration={1.2} decimals={k.decimals ?? 0} suffix={k.suffix ?? ''} prefix={(k as any).prefix ?? ''} separator="," />
              ) : (
                <span>{(k as any).prefix ?? ''}{k.value}{k.suffix ?? ''}</span>
              )}
            </div>
            <div className="text-sm text-[--color-foreground-muted] mt-1">{(k as any).label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
