"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useMessages } from "next-intl";
import { z } from "zod";

interface PerformanceData {
  period: string;
  company: string;
  value: number; // in Millionen €
  growth: number; // Prozentuales Wachstum
  employees?: number; // Anzahl Mitarbeiter
  description: string;
}

interface CVPerformanceChartProps {
  data?: PerformanceData[];
}

// Animated Counter Component
const AnimatedCounter: React.FC<{ value: number; suffix?: string; decimals?: number }> = ({ 
  value, 
  suffix = "", 
  decimals = 0 
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 2000; // 2 seconds
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              current = value;
              clearInterval(timer);
            }
            setCount(current);
          }, duration / steps);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={countRef} className="font-bold text-[--color-foreground-strong]">
      {count.toFixed(decimals)}{suffix}
    </span>
  );
};

// Mini Line Chart Component
const MiniLineChart: React.FC<{ 
  data: number[]; 
  color?: string; 
  growth: number;
}> = ({ data, color = "#3b82f6", growth }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 4;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate points
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;

    const points = data.map((value, index) => ({
      x: padding + (index / (data.length - 1)) * (width - 2 * padding),
      y: height - padding - ((value - minValue) / range) * (height - 2 * padding)
    }));

    // Stroke style – Farbe bevorzugt aus CSS-Variablen (Dark/Light konsistent)
    const rootStyles = getComputedStyle(document.documentElement);
    const tokenPrimary = rootStyles.getPropertyValue('--kpi-blue') || rootStyles.getPropertyValue('--color-primary') || color;
    const stroke = (tokenPrimary && tokenPrimary.trim()) ? tokenPrimary.trim() : color;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw line
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();

    // Draw area under curve with transparency
    ctx.fillStyle = stroke;
    const prevAlpha = ctx.globalAlpha;
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = prevAlpha;

    // Draw points
    points.forEach((point) => {
      ctx.fillStyle = stroke;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

  }, [data, color]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={200}
        height={60}
        className="w-full h-full"
      />
      {/* Growth indicator */}
      <div className="absolute top-1 right-1 text-xs font-medium">
        <span className={growth >= 0 ? "text-green-600" : "text-red-600"}>
          {growth >= 0 ? "+" : ""}{growth}%
        </span>
      </div>
    </div>
  );
};

// Zod Schema (modulweit, stabil für Hooks)
const ItemSchema = z.object({
  period: z.string(),
  company: z.string(),
  value: z.number(),
  growth: z.number(),
  employees: z.number().optional(),
  description: z.string(),
});

const ItemsSchema = z.array(ItemSchema);

export default function CVPerformanceChart({ data }: CVPerformanceChartProps) {
  const messages = useMessages();

  const dataFromI18n: PerformanceData[] | undefined = useMemo(() => {
    const root = messages as Record<string, unknown> | undefined;
    if (!root || typeof root !== "object") return undefined;
    const cvRaw = "cv" in root ? (root["cv"] as unknown) : undefined;
    if (!cvRaw || typeof cvRaw !== "object") return undefined;
    const cvObj = cvRaw as Record<string, unknown>;
    const perfRaw = "performance" in cvObj ? (cvObj["performance"] as unknown) : undefined;
    if (!perfRaw || typeof perfRaw !== "object") return undefined;
    const perfObj = perfRaw as Record<string, unknown>;
    const itemsRaw = "items" in perfObj ? (perfObj["items"] as unknown) : undefined;
    if (!itemsRaw) return undefined;
    const parsed = ItemsSchema.safeParse(itemsRaw);
    return parsed.success ? (parsed.data as PerformanceData[]) : undefined;
  }, [messages]);

  const list: PerformanceData[] = data && data.length > 0 ? data : (dataFromI18n ?? []);

  return (
    <div className="space-y-6">
      {list.map((item, index) => {
        // Generate sample data for the chart based on the actual values
        const chartData = [
          item.value * 0.3,  // Starting point (30% of final value)
          item.value * 0.5,  // Mid point 1
          item.value * 0.7,  // Mid point 2
          item.value * 0.85, // Near final
          item.value         // Final value
        ];

        return (
          <motion.div
            key={`${item.period}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-[--color-surface]/20 backdrop-blur-sm rounded-xl border border-[--color-border-subtle]/20 p-4 hover:border-[--color-border-subtle]/40 transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Left side - Description */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[--color-foreground-muted]">
                    {item.period}
                  </span>
                  <span className="text-sm text-[--color-foreground] opacity-75">
                    • {item.company}
                  </span>
                </div>
                <p className="text-sm text-[--color-foreground] leading-relaxed">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-[--color-foreground-muted]">Firmenwert:</span>
                    <AnimatedCounter value={item.value} suffix="M€" decimals={1} />
                  </div>
                  {item.employees && (
                    <div className="flex items-center gap-1">
                      <span className="text-[--color-foreground-muted]">Mitarbeiter:</span>
                      <AnimatedCounter value={item.employees} suffix="" />
                    </div>
                  )}
                </div>
              </div>

              {/* Right side - Chart */}
              <div className="h-16 bg-[--color-surface]/10 rounded-lg p-2">
                <MiniLineChart 
                  data={chartData} 
                  growth={item.growth}
                  color="#3b82f6"
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
