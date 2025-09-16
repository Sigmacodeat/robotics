"use client";
import React, { useCallback } from 'react';
import clsx from 'clsx';
import { motion, useReducedMotion } from 'framer-motion';

type MotionDivProps = React.ComponentProps<typeof motion.div>;

interface CardProps extends MotionDivProps {
  children: React.ReactNode;
  /** Aktiviert feine Hover-/Tap-Interaktionen (Lift, 3D-Tilt, Glow) */
  interactive?: boolean;
  /** Etwas ausgeprägtere Tiefe per Schatten/Ring */
  elevated?: boolean;
  /** Ermöglicht Tastaturfokus (zeigt focus-visible Ring). Default: folgt interactive. */
  focusable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  interactive = false,
  elevated = true,
  focusable,
  style,
  onMouseMove,
  ...props
}) => {
  const reduce = useReducedMotion();
  const isFocusable = typeof focusable === 'boolean' ? focusable : interactive;

  // Mausposition für Spotlight + 3D Tilt
  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      // Nutzer-Handler zuerst aufrufen
      onMouseMove?.(e);
      if (!interactive) return;
      const el = e.currentTarget as HTMLDivElement;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--x', `${x}px`);
      el.style.setProperty('--y', `${y}px`);
      // 3D Tilt Berechnung relativ zur Mitte
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotateMax = 3.5; // Grad
      const ry = ((x - midX) / midX) * rotateMax; // Y-Rotation aus X-Verschiebung
      const rx = -((y - midY) / midY) * rotateMax; // X-Rotation aus Y-Verschiebung
      el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
      el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
    },
    [interactive, onMouseMove]
  );

  const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    const el = e.currentTarget as HTMLDivElement;
    el.style.removeProperty('--rx');
    el.style.removeProperty('--ry');
  }, []);

  // Motion props bedingt zusammenstellen, um undefined zu vermeiden
  const inViewMotionProps = reduce
    ? {}
    : ({ initial: { opacity: 0, y: 8 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-10% 0% -10% 0%' } } as const);

  const hoverMotionProps = interactive && !reduce
    ? ({ whileHover: { y: -2, scale: 1.01 }, whileTap: { scale: 0.995 } } as const)
    : ({} as const);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      tabIndex={isFocusable ? 0 : undefined}
      className={clsx(
        'relative rounded-xl overflow-hidden shadow-none',
        // Optional leicht erhöhte Tiefe über Ring (dezent, nie weiß)
        elevated && 'ring-[0.5px] ring-inset ring-[--color-border-subtle]/16',
        interactive && 'group',
        // Fokus-States für Tastaturbedienung
        'focus:outline-none focus-visible:ring-1 focus-visible:ring-[--color-border-strong] focus-visible:ring-offset-0',
        // GPU Hints + Text-Rendering-Feinschliff
        'transform-gpu will-change-[transform,opacity] [-webkit-font-smoothing:antialiased] [text-rendering:optimizeLegibility] [font-feature-settings:"ss01","ss02","liga","clig","tnum"] [font-variant-numeric:tabular-nums]',
        // Interaktive Cursor-Stimmung dezent
        interactive ? 'transition-[box-shadow,transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]' : undefined,
        className
      )}
      {...inViewMotionProps}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      {...hoverMotionProps}
      style={style ?? {}}
      {...props}
    >
      {/* 3D Tilt Wrapper: transform nur hier, Motion-Transforms bleiben außen */}
      <div
        className="relative h-full w-full"
        style={{
          transform: interactive && !reduce ? 'perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))' : undefined,
          transformStyle: 'preserve-3d',
          transition: 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Glossy Spotlight Overlay (radial gradient folgt Cursor) */}
        {interactive && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                'radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), color-mix(in oklab, white 6%, transparent), transparent 40%)',
            }}
          />
        )}

        {/* Subtiler Top-Glow für edlere Tiefe */}
        <div
          aria-hidden
          className={clsx(
            'pointer-events-none absolute -inset-px rounded-[inherit] opacity-0',
            interactive && 'group-hover:opacity-100',
            'transition-opacity duration-300'
          )}
          style={{
            background:
              'linear-gradient(to bottom, color-mix(in oklab, var(--color-foreground) 7%, transparent), transparent 40%)',
          }}
        />

        {/* Inhalt */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Sanfter, reicher Schatten bei Hover */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          initial={false}
          animate={interactive && !reduce ? { boxShadow: '0 8px 32px -12px color-mix(in oklab, black 40%, transparent)' } : { boxShadow: 'none' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
};

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className, ...props }) => {
  return (
    <div className={clsx('p-4', className)} {...props}>
      {children}
    </div>
  );
};

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className, ...props }) => {
  return (
    <h3
      className={clsx(
        // Modern, kompaktes Titeldesign (ohne feste Basisgröße)
        'font-semibold tracking-tight leading-tight text-[--color-foreground-strong]',
        // Bessere Lesbarkeit & optische Größen/Ligaturen
        '[-webkit-font-smoothing:antialiased] [text-rendering:optimizeLegibility] [font-feature-settings:"ss01","ss02","liga","clig","tnum"] [font-variant-numeric:tabular-nums]',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        'p-4',
        // Ruhige, präzise Typo für Fließtext und Zahlen
        'text-[--color-foreground] [font-feature-settings:"liga","clig","tnum"] [font-variant-numeric:tabular-nums]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
