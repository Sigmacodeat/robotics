"use client";
import React, { useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { defaultTransition } from "@/components/animation/variants";

export type AreaSeries = { name: string; color?: string; values: number[] };

export type StackedAreaAnimatedProps = {
  labels: Array<string | number>;
  series: AreaSeries[];
  width?: number;
  height?: number;
  ariaLabel?: string;
  className?: string;
  responsive?: boolean;
};

export default function StackedAreaAnimated({
  labels,
  series,
  width = 560,
  height = 260,
  ariaLabel = "Stacked area chart",
  className,
  responsive = false,
}: StackedAreaAnimatedProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const reduceMotion = useReducedMotion();

  const { paths, dx, maxSum } = useMemo(() => {
    const n = Math.max(1, labels.length);
    const dx = width / Math.max(1, n - 1);
    const sums: number[] = Array.from({ length: n }, () => 0);
    
    // Berechne die Summen für jeden Zeitpunkt
    for (const s of series) {
      for (let i = 0; i < n; i++) {
        sums[i] += s.values[i] ?? 0;
      }
    }
    
    const maxSum = Math.max(...sums, 1);
    let cumPrev = Array.from({ length: n }, () => 0);
    const palette = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#14b8a6", "#f97316", "#06b6d4"];
    
    const paths = series.map((s, si) => {
      const color = s.color ?? palette[si % palette.length];
      const upper: string[] = [];
      const lower: string[] = [];
      
      for (let i = 0; i < n; i++) {
        const v = Math.max(0, s.values[i] ?? 0); // Stelle sicher, dass Werte nicht negativ sind
        const yUpper = height - 30 - ((cumPrev[i] + v) / maxSum) * (height - 60);
        const yLower = height - 30 - (cumPrev[i] / maxSum) * (height - 60);
        const x = i * dx + 20; // Füge Padding hinzu
        
        if (i === 0) {
          upper.push(`M${x},${yUpper}`);
        } else {
          upper.push(`L${x},${yUpper}`);
        }
        lower.unshift(`L${x},${yLower}`);
      }
      
      const d = `${upper.join(" ")} ${lower.join(" ")} Z`;
      cumPrev = cumPrev.map((c, i) => c + (s.values[i] ?? 0));
      return { d, color, name: s.name, values: s.values };
    });
    
    return { paths, dx, maxSum };
  }, [labels, series, width, height]);

  return (
    <svg
      ref={ref}
      role="img"
      aria-label={ariaLabel}
      width={responsive ? undefined : width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={responsive ? { width: "100%", height } : undefined}
    >
      {/* grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <g key={`g-${i}`}>
          <line 
            x1={20} 
            x2={width - 20} 
            y1={height - 30 - (t * (height - 60))} 
            y2={height - 30 - (t * (height - 60))} 
            stroke="var(--color-border)" 
            opacity={0.3} 
            strokeDasharray="2 2" 
          />
          <text 
            x={15} 
            y={height - 30 - (t * (height - 60)) + 4} 
            fontSize={9} 
            textAnchor="end" 
            fill="var(--color-foreground-muted)"
          >
            {Math.round(t * maxSum)}%
          </text>
        </g>
      ))}

      {paths.map((p, i) => (
        reduceMotion ? (
          <path key={i} d={p.d} fill={p.color} opacity={0.7} stroke={p.color} strokeWidth={0.5} />
        ) : (
          <motion.path 
            key={i} 
            d={p.d} 
            fill={p.color} 
            stroke={p.color}
            strokeWidth={0.5}
            initial={{ opacity: 0, pathLength: 0 }} 
            animate={{ opacity: inView ? 0.7 : 0, pathLength: inView ? 1 : 0 }} 
            transition={{ ...defaultTransition, duration: 1.4, delay: 0.08 * i }} 
          />
        )
      ))}

      {/* x-labels */}
      {labels.map((lab, i) => (
        <text 
          key={`xl-${i}`} 
          x={i * dx + 20} 
          y={height - 8} 
          fontSize={11} 
          textAnchor="middle" 
          fill="var(--color-foreground-muted)"
          fontWeight="500"
        >
          {String(lab)}
        </text>
      ))}

      {/* legend */}
      <g>
        {series.map((s, i) => {
          const legendX = 20 + (i % 3) * 160;
          const legendY = 15 + Math.floor(i / 3) * 18;
          // Kürze lange Namen für bessere Darstellung
          const shortName = s.name
            .replace('Allianzen (OEM/Integrator)', 'OEM/Integrator')
            .replace('Design-Partner/Direct', 'Design Partner')
            .replace('Developer/Marketplace', 'Developer')
            .replace('Events & Demos', 'Events')
            .replace('Content/SEO/Community', 'Content/SEO')
            .replace('Paid (Targeted ABM)', 'Paid ABM');
          
          return (
            <g key={`leg-${i}`} transform={`translate(${legendX}, ${legendY})`}>
              <rect width={12} height={12} rx={2} fill={s.color ?? "#3b82f6"} opacity={0.8} />
              <text 
                x={16} 
                y={10} 
                fontSize={10} 
                fill="var(--color-foreground)" 
                fontWeight="500"
              >
                {shortName}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
