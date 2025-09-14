import React from 'react';
import { cn } from '@/lib/utils';

export type KpiTileProps = {
  label: string;
  value?: string | number | undefined;
  subtitle?: string | undefined;
  trend?: string | undefined; // e.g., "+15% MoM" oder "-1%p"
  className?: string | undefined;
  children?: React.ReactNode;
  as?: 'div' | 'li';
  'aria-label'?: string;
};

/**
 * Barrierearme KPI-Kachel ohne Animation, Dark/Light über CSS-Variablen.
 */
export default function KpiTile({ label, value, subtitle, trend, className, children, as = 'div', ...rest }: KpiTileProps) {
  const Comp: any = as;
  return (
    <Comp
      className={cn(
        'rounded-xl ring-1 ring-[--color-border-subtle] bg-transparent p-3 md:p-4',
        'text-[--color-foreground] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary]',
        className
      )}
      {...rest}
    >
      <div className="flex flex-col gap-1">
        <div className="text-[11px] md:text-[12px] font-medium uppercase tracking-wide opacity-85 one-line">{label}</div>
        <div className="text-[16px] md:text-[18px] font-semibold [font-feature-settings:'tnum'] [font-variant-numeric:tabular-nums] one-line">
          {value != null && value !== '' ? value : '—'}
        </div>
        {subtitle ? (
          <div className="text-[11px] md:text-[12px] opacity-75 one-line">{subtitle}</div>
        ) : null}
        {trend ? (
          <div className="text-[11px] md:text-[12px] opacity-75 one-line" aria-live="polite">{trend}</div>
        ) : null}
        {children}
      </div>
    </Comp>
  );
}
