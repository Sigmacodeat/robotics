"use client";
import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import type { TimelineCommonProps } from './types';
import { Briefcase, GraduationCap } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { variantsMap, defaultTransition, viewportLux } from './variants';

export type TimelineEventCardProps = TimelineCommonProps & {
  title: string;
  subtitle?: string;
  bullets?: string[];
  headerUnderline?: 'blue' | 'neutral' | 'gold' | 'none';
  rightAside?: React.ReactNode; // e.g. Sparkline
  /** Optional: ID für die Bullets-Liste zur sauberen Verknüpfung mit aria-controls */
  bulletsId?: string;
  /** Eintragsart für optionales Icon im Header */
  kind?: 'work' | 'education';
  /** Position der Statistik/Aside innerhalb der Card (lg+): links oder rechts */
  asidePosition?: 'left' | 'right';
};

export default function TimelineEventCard({ title, subtitle, bullets, size = 'md', headerUnderline = 'blue', rightAside, bulletsId, kind, asidePosition = 'right' }: TimelineEventCardProps) {
  const underlineClass = headerUnderline === 'none'
    ? ''
    : headerUnderline === 'blue'
      ? 'border-b border-sky-500/25 dark:border-sky-400/30'
      : headerUnderline === 'gold'
        ? 'border-b border-amber-500/30 dark:border-amber-400/30'
        : 'border-b border-slate-300/30 dark:border-slate-600/30';

  // Mobile-first, lesbarere Basisschriftgrößen; md/lg leicht angehoben
  const titleSize = size === 'sm' ? 'text-[13.5px] md:text-[15px] lg:text-[17px]'
    : size === 'md' ? 'text-[14.5px] md:text-[16px] lg:text-[18px]'
    : 'text-[15px] md:text-[17px] lg:text-[19px]';

  // Hilfsfunktion: Unterpunkte durch Zeilenumbrüche erkennen
  const splitLines = (s: string) => s.split(/\n+/).map(l => l.trim()).filter(Boolean);

  // Parallax: dezente Gegenbewegung für Aside, respektiert Reduced Motion
  const prefersReducedMotion = useReducedMotion();
  const rafPending = React.useRef<number | null>(null);
  // Stabiler, kleiner Jitter (0..20ms) für organischere Sequenzen
  const jitterMs = React.useMemo(() => {
    const seedStr = `${title}|${subtitle ?? ''}`;
    let s = 0;
    for (let i = 0; i < seedStr.length; i++) s = (s * 31 + seedStr.charCodeAt(i)) % 997;
    return (s % 21); // 0..20 ms
  }, [title, subtitle]);
  const jitter = jitterMs / 1000; // in s
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'end start'] });
  const asideY = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  // 3D Depth Tilt (nur Desktop + pointer:fine, kein Reduced Motion)
  const [isInteractive, setIsInteractive] = React.useState(false);
  const [tilt, setTilt] = React.useState<{ rx: number; ry: number; glowX: number; glowY: number; moving: boolean }>({ rx: 0, ry: 0, glowX: 50, glowY: 50, moving: false });
  React.useEffect(() => {
    try {
      const mq = window.matchMedia('(min-width: 1024px)');
      const pq = window.matchMedia('(pointer: fine)');
      const update = () => setIsInteractive(!prefersReducedMotion && mq.matches && pq.matches);
      update();
      mq.addEventListener?.('change', update);
      pq.addEventListener?.('change', update);
      return () => {
        mq.removeEventListener?.('change', update);
        pq.removeEventListener?.('change', update);
      };
    } catch { /* SSR safe */ }
  }, [prefersReducedMotion]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isInteractive || !cardRef.current) return;
    if (rafPending.current != null) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rafPending.current = requestAnimationFrame(() => {
      const nx = (x / rect.width) - 0.5;
      const ny = (y / rect.height) - 0.5;
      const ry = nx * 10;
      const rx = -ny * 8;
      const glowX = 50 + nx * 22;
      const glowY = 50 + ny * 20;
      setTilt({ rx, ry, glowX, glowY, moving: true });
      rafPending.current = null;
    });
  };
  const onMouseLeave = () => {
    if (!isInteractive) return;
    setTilt({ rx: 0, ry: 0, glowX: 50, glowY: 50, moving: false });
  };

  const body = (
    <Card elevated={false} className="relative ring-0 rounded-[11px] bg-[var(--color-surface)]/95 dark:bg-[var(--color-surface)]/70 supports-[backdrop-filter]:backdrop-blur-sm antialiased">
      <CardContent className={`${size === 'sm' ? 'px-3 pt-2.5 pb-3' : size === 'md' ? 'px-3.5 pt-3 pb-3.5' : 'px-4 pt-3.5 md:pt-4 pb-4'}`}>
        <div
          ref={cardRef}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          className={`relative grid grid-cols-1 ${asidePosition === 'left' ? 'lg:[grid-template-columns:minmax(0,2fr)_minmax(0,3fr)]' : 'lg:[grid-template-columns:minmax(0,3fr)_minmax(0,2fr)]'} items-center lg:gap-x-10 min-w-0`}
          style={isInteractive ? { perspective: '900px' } : undefined}
        >
          {/* Moving Glow */}
          {/* Entfernt: bewegtes Glow-Overlay (Schein) */}
          {/* Textbereich */}
          <motion.div
            variants={asidePosition === 'left' ? variantsMap.textSlideInRight : variantsMap.textSlideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportLux}
            transition={{ ...defaultTransition, delay: 0 + jitter * 0.5 }}
            className={`${asidePosition === 'left' ? 'order-2 lg:order-2 lg:pl-5' : 'order-1 lg:pr-5'} min-w-0 flex flex-col justify-center w-full`}
          >
            {/* Titel + Untertitel gehören mit in die Textspalte */}
            <div className={`${underlineClass} pb-2 md:pb-2.5`}>
              <CardTitle className={`${titleSize} leading-[1.2] md:leading-[1.15] text-[--color-foreground] font-medium tracking-[-0.005em] md:tracking-[0.01em] [text-wrap:balance]`}>
                <span className="inline-flex items-center gap-1">
                  {kind === 'work' && <Briefcase aria-hidden className="h-[1em] w-[1em] opacity-85" />}
                  {kind === 'education' && <GraduationCap aria-hidden className="h-[1em] w-[1em] opacity-85" />}
                  <span className="[hyphens:auto]">{title}</span>
                </span>
              </CardTitle>
              {subtitle ? (
                <p className={`${size === 'sm' ? 'text-[12px] md:text-[12.5px]' : size === 'md' ? 'text-[12.5px] md:text-[13px]' : 'text-[13px] md:text-[13.5px]'} text-[--color-foreground]/75 mt-1 md:mt-0.5 font-normal leading-[1.5] [hyphens:auto]`}>{subtitle}</p>
              ) : null}
            </div>
            {Array.isArray(bullets) && bullets.length > 0 ? (
              <motion.ul
                id={bulletsId}
                variants={variantsMap.containerStagger}
                initial="hidden"
                animate="visible"
                className={`${size === 'sm' ? 'space-y-1.25 md:space-y-1.5' : size === 'md' ? 'space-y-1.25 md:space-y-1.5' : 'space-y-1.5'} list-disc pl-4 marker:text-[--color-foreground]/25 max-w-[62ch]`}
              >
                {bullets.map((b, i) => {
                  const lines = splitLines(b);
                  const hasSubs = lines.length > 1;
                  const head = lines[0] ?? '';
                  const subs = hasSubs ? lines.slice(1) : [];
                  return (
                    <motion.li
                      key={i}
                      variants={variantsMap.bulletEnter}
                      className={`${size === 'sm' ? 'text-[12px] md:text-[12.5px]' : size === 'md' ? 'text-[12.5px] md:text-[13px]' : 'text-[13px] md:text-[13.5px]'} leading-[1.5] text-[--color-foreground]/80 [text-wrap:pretty] tracking-[-0.006em]`}
                    >
                      <span className="[hyphens:auto] tracking-[-0.005em]">{head}</span>
                      {hasSubs && (
                        <motion.ul
                          variants={variantsMap.containerStagger}
                          initial="hidden"
                          animate="visible"
                          className={`mt-0.5 ${size === 'sm' ? 'space-y-0.5' : 'space-y-0.5'} list-[square] pl-4 marker:text-[--color-foreground]/20`}
                        >
                          {subs.map((s, j) => (
                            <motion.li key={j} variants={variantsMap.bulletEnter} className={`${size === 'sm' ? 'text-[11px] md:text-[11.5px]' : size === 'md' ? 'text-[11.5px] md:text-[12px]' : 'text-[12px] md:text-[12.5px]'} leading-[1.45] text-[--color-foreground]/75 [hyphens:auto] tracking-[-0.006em]`}>{s}</motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </motion.li>
                  );
                })}
              </motion.ul>
            ) : null}
          </motion.div>
          {/* Aside: Statistik/Visuals zentriert, Position abhängig */}
          <motion.div
            variants={variantsMap.asidePop}
            initial="hidden"
            whileInView="visible"
            viewport={viewportLux}
            transition={
              prefersReducedMotion
                ? { ...defaultTransition, delay: asidePosition === 'left' ? 0.18 : 0.22 }
                : { type: 'spring', stiffness: 140, damping: 26, mass: 1.05, delay: asidePosition === 'left' ? 0.26 : 0.3 }
            }
            className={`${asidePosition === 'left' 
              ? 'order-1 lg:order-1 lg:pr-6' 
              : 'order-2 lg:pl-6'} hidden lg:flex items-center justify-center w-full overflow-visible min-w-0`}
            style={prefersReducedMotion ? undefined : ({ y: asideY } as any)}
          >
            <div
              className="w-full max-w-[420px] px-2 min-w-0"
              style={isInteractive ? {
                transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                transition: tilt.moving ? 'transform 16ms linear' : 'transform 220ms ease-out',
              } : undefined}
            >
              {rightAside}
            </div>
          </motion.div>
          {/* Mobile: Aside immer UNTER dem Text anzeigen */}
          <div className={`order-2 lg:hidden flex items-center justify-center w-full mt-3`}>
            {rightAside}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return body;
}
