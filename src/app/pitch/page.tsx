  "use client";

import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform, useReducedMotion, useScroll } from "framer-motion";
import { useEffect, useMemo, useRef, useState, useId, type ElementType } from "react";
import { chapters } from "@/chapters/chapters.config";
import Reveal from "@/components/animation/Reveal";
import { defaultTransition, defaultViewport } from "@/components/animation/variants";
import { getMessages } from "@/i18n/messages";
import { buildLocalePath } from "@/i18n/path";
import Link from "next/link";
import ElegantCard from "@/components/ui/ElegantCard";
import { useLocale, useTranslations } from "next-intl";
import { Bot, CheckCircle2, Sparkles, LineChart, Rocket, Cpu, Users, AlertTriangle, Target, Banknote, Leaf, Flag, Briefcase, Mail, Printer, ChevronsDown, Mouse } from "lucide-react";
import PitchCoverPage from "@/components/document/PitchCoverPage";
import ClosingPage from "@/components/document/ClosingPage";
import PrintTOC from "@/components/document/PrintTOC";

type SimpleKpi = { label: string; value: string | number; sub?: string };

// Vollflächiges Intro-Overlay: Seite dunkel, nur das Icon sichtbar, danach Fade-Out
function IntroOverlay({ onDone }: { onDone?: () => void }) {
  // Fixed-Fly-To-Target: Bot fliegt von Mitte zum Header-Anker (#pitch-bot-anchor)
  const [haloOn, setHaloOn] = useState(false);
  const [target, setTarget] = useState<{ x: number; y: number; scale: number } | null>(null);
  const [colorOn, setColorOn] = useState(false);
  const [ripple, setRipple] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const prefersReduced = useReducedMotion();
  const introGradId = useId();

  useEffect(() => {
    if (prefersReduced) {
      onDone?.();
      return;
    }
    // Ziel messen (robust mit rAF + Resize)
    const measure = () => {
      const anchor = document.getElementById('pitch-bot-anchor');
      if (!anchor) return false;
      const r = anchor.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      // Zielgröße ~ 1.15em
      const cs = window.getComputedStyle(anchor);
      const fontSize = parseFloat(cs.fontSize || '16');
      const desired = 1.15 * fontSize; // px
      const base = 140; // Bot-Basisgröße px
      const scale = Math.max(0.2, Math.min(1.0, desired / base));
      setTarget({ x: cx - window.innerWidth / 2, y: cy - window.innerHeight / 2, scale });
      return true;
    };
    let raf = 0; let attempts = 0;
    const tick = () => {
      attempts++;
      const ok = measure();
      if (!ok && attempts < 60) raf = requestAnimationFrame(tick);
    };
    tick();
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    // Farbe und Halo leicht verzögert aktivieren
    const tColor = setTimeout(() => setColorOn(true), 900);
    const tHalo = setTimeout(() => setHaloOn(true), 1200);
    // skip erst nach kurzer Mindestdauer erlauben (verhindert versehentliches Abbrechen)
    const tSkip = setTimeout(() => setCanSkip(true), 300);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); clearTimeout(tColor); clearTimeout(tHalo); clearTimeout(tSkip); };
  }, [prefersReduced, onDone]);

  // Tastatur: Esc/Enter/Space zum Überspringen
  useEffect(() => {
    if (prefersReduced) return;
    const onKey = (e: KeyboardEvent) => {
      if (!canSkip) return;
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onDone?.();
      }
    };
    window.addEventListener('keydown', onKey, { passive: false } as any);
    return () => window.removeEventListener('keydown', onKey as any);
  }, [canSkip, prefersReduced, onDone]);

  const handleSkipClick = () => {
    if (!canSkip) return;
    onDone?.();
  };

  return (
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-label="Intro"
      onClick={handleSkipClick}
    >
      {/* Hintergrund layer – fadet aus */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.2 }}
        style={{
          willChange: 'opacity',
          background:
            'radial-gradient(110% 110% at 50% 40%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.98) 70%, rgba(0,0,0,1) 100%)',
        }}
      />
      {/* Halo – dezent skaliert & parallax */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform, opacity', width: 320, height: 320, borderRadius: 9999, filter: 'blur(14px)', background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.08) 38%, rgba(255,255,255,0.0) 70%)' }}
        initial={{ opacity: 0, x: 0, y: 0, scale: 0.96 }}
        animate={haloOn ? (target ? { opacity: 0.22, x: target.x * 0.80, y: target.y * 0.80, scale: 1.04 } : { opacity: 0.22, scale: 1.04 }) : { opacity: 0 }}
        transition={{ duration: 2.0, ease: 'easeInOut' }}
      />
      {/* Bot – Bogenbahn + Ghost-Trail */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform' }}
        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
        animate={target ? {
          x: [0, target.x * 0.55, target.x],
          y: [0, -28, target.y],
          scale: [1, 1.02, target.scale],
        } : {}}
        transition={{ duration: 3.2, delay: 0.6, ease: 'easeInOut', times: [0, 0.55, 1] }}
        onAnimationComplete={() => {
          if (prefersReduced) { onDone?.(); return; }
          setRipple(true);
          setTimeout(() => onDone?.(), 900);
        }}
      >
        <motion.i
          className="flex items-center justify-center"
          style={{ color: colorOn ? 'var(--color-accent)' : 'var(--color-foreground-muted)', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.25))' }}
          animate={colorOn ? { scale: [1, 1.045, 1], rotate: [0, -2.5, 0] } : {}}
          transition={{ duration: 1.0, ease: 'easeInOut' }}
        >
          <Bot width={140} height={140} stroke={`url(#${introGradId})`} fill="none" strokeWidth={2}>
            <defs>
              <linearGradient id={introGradId as any} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-accent)" />
                <stop offset="100%" stopColor="var(--color-accent-3)" />
              </linearGradient>
            </defs>
          </Bot>
        </motion.i>
        {/* Ghost-Trail – dezente Spur hinter dem Bot */}
        {target ? (
          <motion.i
            className="flex items-center justify-center absolute inset-0"
            style={{ color: 'var(--color-accent)', opacity: 0.10, filter: 'blur(0.2px)' }}
            initial={{ scale: 1, x: 0, y: 0 }}
            animate={{ scale: 1.01, x: target.x * 0.92, y: target.y * 0.92 }}
            transition={{ duration: 3.0, delay: 0.6, ease: 'easeInOut' }}
            aria-hidden
          >
            <Bot width={140} height={140} stroke="currentColor" fill="none" strokeWidth={2} />
          </motion.i>
        ) : null}
      </motion.div>

      {/* Ripple + Partikel-Effekt beim Eintreffen */}
      {!prefersReduced && ripple && target ? (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ transform: `translate(calc(-50% + ${target.x}px), calc(-50% + ${target.y}px))` }}
          aria-hidden
        >
          {/* Ripple-Ringe */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={`r-${i}`}
              className="absolute block rounded-full"
              style={{
                width: 8,
                height: 8,
                border: '1.5px solid currentColor',
                color: 'var(--color-accent)'
              }}
              initial={{ opacity: 0.22, scale: 0.6 }}
              animate={{ opacity: 0, scale: 2.5 }}
              transition={{ duration: 0.6 + i * 0.08, ease: 'easeOut', delay: 0.03 * i }}
            />
          ))}
          {/* Partikel entfernt */}
          </div>
      ) : null}

      {/* Skip Control */}
      <motion.button
        type="button"
        onClick={handleSkipClick}
        className="absolute top-4 right-4 md:top-5 md:right-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] ring-1 ring-[--color-border-subtle] bg-[color-mix(in_oklab,var(--color-surface)_72%,transparent)] text-[--color-foreground] backdrop-blur-[2px] hover:bg-[color-mix(in_oklab,var(--color-surface)_82%,transparent)] focus:outline-none focus:ring-2 focus:ring-[--color-accent]"
        initial={{ opacity: 0 }}
        animate={{ opacity: canSkip ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        aria-label="Intro überspringen"
      >
        Überspringen
      </motion.button>
    </div>
  );
}

// 5s Intro Splash Overlay (full screen)
// IntroSplash entfernt (nicht genutzt)

function extractFinanceKpis(messages: Messages | null): SimpleKpi[] {
  if (!messages) return [];
  const m: any = messages;
  const fin = (m.content?.finance ?? m.finance ?? {}) as any;
  const labels = fin?.kpis?.labels ?? {};
  const units = fin?.kpis?.units ?? {};
  const values = fin?.kpis?.values ?? {};
  const deltas = fin?.kpis?.deltas ?? {};
  const items: SimpleKpi[] = [];
  if (typeof values.cac !== 'undefined') {
    const sub = typeof deltas.cac !== 'undefined' ? `${deltas.cac > 0 ? '+' : ''}${deltas.cac}%` : undefined;
    items.push({ label: `CAC`, value: `${values.cac}${units.cac ? ` ${units.cac}` : ''}`, ...(sub ? { sub } as { sub: string } : {}) });
  }
  if (typeof values.ltv !== 'undefined') {
    const sub = typeof deltas.ltv !== 'undefined' ? `${deltas.ltv > 0 ? '+' : ''}${deltas.ltv}%` : undefined;
    items.push({ label: `LTV`, value: `${values.ltv}${units.ltv ? ` ${units.ltv}` : ''}`, ...(sub ? { sub } as { sub: string } : {}) });
  }
  if (typeof values.payback !== 'undefined') {
    items.push({ label: labels?.payback ?? 'Payback', value: `${values.payback}${units.payback ? ` ${units.payback}` : ''}` });
  }
  if (typeof values.grossMargin !== 'undefined') {
    const sub = typeof deltas.grossMargin !== 'undefined' ? `${deltas.grossMargin > 0 ? '+' : ''}${deltas.grossMargin}%` : undefined;
    items.push({ label: labels?.grossMargin ?? 'Gross Margin', value: `${values.grossMargin}${units.grossMargin ? units.grossMargin : '%'}`, ...(sub ? { sub } as { sub: string } : {}) });
  }
  return items;
}

function extractTractionKpis(messages: Messages | null): SimpleKpi[] {
  if (!messages) return [];
  const bp: any = (messages as any).bp ?? {};
  const list = Array.isArray(bp.tractionKpis?.kpis) ? bp.tractionKpis.kpis as Array<{label: string; value: number; unit?: string}> : [];
  return list.slice(0, 4).map((k) => ({ label: k.label, value: `${k.value}${k.unit ? ` ${k.unit}` : ''}` }));
}

type Messages = Awaited<ReturnType<typeof getMessages>> & { content: any };

// Unerwünschte Einträge aus Bullets zentral filtern
function shouldHideBullet(text: string): boolean {
  if (!text) return false;
  const t = String(text).trim();
  // Entfernt exakt den Punkt "12 Arbeitspakete" (Groß-/Kleinschreibung ignorieren, flexible Spaces)
  return /(^|\b)12\s*Arbeitspakete(\b|$)/i.test(t);
}

function usePitchMessages() {
  const localeHookVal = useLocale();
  const [locale, setLocale] = useState<string>(localeHookVal || "de");
  const [msgs, setMsgs] = useState<Messages | null>(null);

  useEffect(() => {
    let active = true;
    const loc = (localeHookVal || locale || "de").startsWith("de") ? "de" : "en";
    getMessages(loc as "de" | "en").then((m) => {
      if (!active) return;
      setMsgs(m as Messages);
      setLocale(loc);
    }).catch(() => {
      // Fallback: DE
      getMessages("de").then((m) => active && setMsgs(m as Messages));
    });
    return () => { active = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localeHookVal]);

  return { locale, messages: msgs } as const;
}

function extractBulletsForChapter(slug: string, messages: Messages | null): string[] {
  if (!messages) return [];
  const m: any = messages;
  const content = (m.content ?? {}) as any;

  switch (slug) {
    case "executive": {
      const exec: string[] = [];
      const comp = content.company ?? {};
      const sol = content.solution ?? {};
      const mkt = content.market ?? {};
      if (comp.name || comp.industry || comp.location) {
        exec.push([
          comp.name ? String(comp.name) : null,
          comp.industry ? String(comp.industry) : null,
          comp.location ? String(comp.location) : null,
        ].filter(Boolean).join(" • "));
      }
      if (comp.vision) exec.push(String(comp.vision));
      if (comp.mission) exec.push(String(comp.mission));
      // Lösung/Produkt in 2-3 kurzen Punkten
      const solPoints = [sol.rass, sol.appstore, sol.agents, sol.integration, sol.usp]
        .map(x => (typeof x === 'string' && x.trim().length > 0) ? x : null)
        .filter(Boolean) as string[];
      exec.push(...solPoints.slice(0, 3));
      // Markt-Kurzfassung TAM/SAM/SOM
      const marketLine = [mkt.tam, mkt.sam, mkt.som]
        .map(x => (typeof x === 'string' && x.trim().length > 0) ? x : null)
        .filter(Boolean)
        .join(" • ");
      if (marketLine) exec.push(marketLine);
      return exec.slice(0, 8);
    }
    case "business-model": {
      const bm = content.businessModel ?? {};
      const bullets: string[] = [];
      if (Array.isArray(bm.valueProp)) bullets.push(...bm.valueProp);
      if (Array.isArray(bm.pricing)) bullets.push(...bm.pricing);
      const streamsRaw = bm.revenueStreams ?? bm.streams ?? [];
      if (Array.isArray(streamsRaw)) bullets.push(...streamsRaw.map((x: any) => typeof x === "string" ? x : (x?.type ? `${x.type}: ${x?.description ?? ""}` : String(x))));
      if (Array.isArray(bm.unitEconomics)) bullets.push(...bm.unitEconomics);
      if (Array.isArray(bm.salesChannels)) bullets.push(...bm.salesChannels);
      if (Array.isArray(bm.partnerships)) bullets.push(...bm.partnerships);
      return bullets.slice(0, 8);
    }
    case "market": {
      const market = content.market ?? (m.market ?? {});
      const bullets: string[] = [];
      if (Array.isArray(market.description)) bullets.push(...market.description);
      if (Array.isArray(market.competitiveAdvantage)) bullets.push(...market.competitiveAdvantage);
      if (market.tam) bullets.push(String(market.tam));
      if (market.sam) bullets.push(String(market.sam));
      if (market.som) bullets.push(String(market.som));
      // Traction bullets
      if (Array.isArray(market.traction)) bullets.push(...market.traction);
      return bullets.slice(0, 8);
    }
    case "gtm": {
      const gtm = content.gtm ?? (m.gtm ?? {});
      const bullets: string[] = [];
      if (Array.isArray(gtm.phase1)) bullets.push(...gtm.phase1);
      if (Array.isArray(gtm.tactics)) bullets.push(...gtm.tactics);
      if (Array.isArray(gtm.kpis)) bullets.push(...gtm.kpis);
      return bullets.slice(0, 8);
    }
    case "finance": {
      const fin = content.finance ?? (m.finance ?? {});
      const bullets: string[] = [];
      if (fin.revenueNarrative) bullets.push(String(fin.revenueNarrative));
      if (Array.isArray(fin.assumptions)) bullets.push(...fin.assumptions);
      if (Array.isArray(fin.fundingStrategy)) bullets.push(...fin.fundingStrategy);
      return bullets.slice(0, 8);
    }
    case "technology": {
      const tech = content.technology ?? (m.technology ?? {});
      const bullets: string[] = [];
      if (Array.isArray(tech.points)) bullets.push(...tech.points);
      if (Array.isArray(tech.stack)) bullets.push(...tech.stack);
      if (Array.isArray(tech.safetyCompliancePoints)) bullets.push(...tech.safetyCompliancePoints);
      return bullets.slice(0, 8);
    }
    case "team": {
      const team = content.teamOrg ?? (m.teamOrg ?? {});
      const bullets: string[] = [];
      if (Array.isArray(team.roles)) bullets.push(...team.roles);
      if (Array.isArray((m.bp as any)?.team?.esopDetails)) bullets.push(...(m.bp as any).team.esopDetails);
      return bullets.slice(0, 8);
    }
    case "risks": {
      const r = content.risks ?? (m.risks ?? {});
      const bullets: string[] = [];
      // 1) Kurze Gesamtliste
      if (Array.isArray(r.list)) bullets.push(...r.list);
      // 2) Verdichtete risk→mitigation Paare aus Unterabschnitten
      const sections = [r.tech, r.market, r.finance, r.regulatory, r.operations].filter(Boolean);
      for (const sec of sections as any[]) {
        for (const k of Object.keys(sec)) {
          const node = (sec as any)[k];
          if (node && typeof node === 'object' && (node.risk || node.mitigation)) {
            bullets.push(`${node.risk ?? ''}${node.mitigation ? ` – ${node.mitigation}` : ''}`.trim());
          }
        }
      }
      // 3) Mitigation-Listen
      if (r.mitigation && Array.isArray(r.mitigation.items)) bullets.push(...r.mitigation.items);
      // 4) MitigationDetailed (einige knackige Beispiele)
      if (r.mitigationDetailed) {
        const md = r.mitigationDetailed as any;
        const pick = (arr: any) => Array.isArray(arr) ? arr.slice(0, 1) : [];
        bullets.push(...pick(md.tech), ...pick(md.market), ...pick(md.finance), ...pick(md.legal));
      }
      // 5) Benefits / Additional, falls Platz
      if (Array.isArray(r.benefits)) bullets.push(...r.benefits);
      if (r.additional) {
        const add = r.additional as Record<string, unknown>;
        for (const v of Object.values(add)) if (typeof v === 'string') bullets.push(v);
      }
      return bullets.filter(Boolean).slice(0, 8);
    }
    case "traction-kpis": {
      const tk = (m.bp as any)?.tractionKpis ?? {};
      const bullets: string[] = [];
      if (Array.isArray(tk.highlights)) bullets.push(...tk.highlights);
      if (Array.isArray(tk.kpisExplain)) bullets.push(...tk.kpisExplain);
      if (Array.isArray(tk.methodology)) bullets.push(...tk.methodology);
      if (Array.isArray(tk.evidence)) bullets.push(...tk.evidence);
      if (Array.isArray(tk.deliverables)) bullets.push(...tk.deliverables);
      return bullets.slice(0, 8);
    }
    case "impact": {
      const imp = content.impact ?? (m.impact ?? {});
      const bullets: string[] = [];
      // aktuelle i18n Felder: description[], sustainabilityGoals[], socialImpact[]
      if (Array.isArray(imp.description)) bullets.push(...imp.description);
      if (Array.isArray(imp.sustainabilityGoals)) bullets.push(...imp.sustainabilityGoals);
      if (Array.isArray(imp.socialImpact)) bullets.push(...imp.socialImpact);
      return bullets.slice(0, 8);
    }
    case "exit-strategy": {
      const ex = content.exit ?? (m.exit ?? {});
      const bullets: string[] = [];
      // notes
      if (ex.notes) bullets.push(String(ex.notes));
      // valuation
      if (ex.valuation) {
        if (ex.valuation.range) bullets.push(String(ex.valuation.range));
        if (Array.isArray(ex.valuation.multiples)) bullets.push(...ex.valuation.multiples);
      }
      // options titles
      if (ex.options) {
        const optTitles = [ex.options.a?.title, ex.options.b?.title, ex.options.c?.title]
          .filter(Boolean)
          .map((t: any) => String(t));
        if (optTitles.length) bullets.push(...optTitles);
      }
      // buyers
      if (ex.buyers) {
        if (Array.isArray(ex.buyers.strategic)) bullets.push(...ex.buyers.strategic.map((x: any) => `Strategic: ${x}`));
        if (Array.isArray(ex.buyers.financial)) bullets.push(...ex.buyers.financial.map((x: any) => `Financial: ${x}`));
      }
      // timeline phases → kurze Zeilen
      if (ex.timeline && Array.isArray(ex.timeline.phases)) {
        bullets.push(...ex.timeline.phases.map((p: any) => `${p.period}: ${(Array.isArray(p.activities) ? p.activities[0] : '')}`.trim()));
      }
      // preparation actions
      if (ex.preparation && Array.isArray(ex.preparation.actions)) bullets.push(...ex.preparation.actions);
      // risks items
      if (ex.risks && Array.isArray(ex.risks.items)) bullets.push(...ex.risks.items.map((r: any) => `${r.risk}${r.mitigation ? ` – ${r.mitigation}` : ''}`));
      return bullets.filter(Boolean).slice(0, 8);
    }
    default:
      return [];
  }
}

export default function PitchPage() {
  const { messages, locale } = usePitchMessages();
  const [showIntro, setShowIntro] = useState(true);
  const t = useTranslations("pitchCover");
  // Startsignal für Header-Sequenz, nachdem der Bot im Header angekommen ist
  const [headerReady, setHeaderReady] = useState(false);
  // Orchestrierung: 'intro' -> 'title' -> 'badge' -> 'meta'
  const [stage, setStage] = useState<'intro' | 'title' | 'badge' | 'meta'>('intro');
  const prefersReducedPage = useReducedMotion();
  const [isCoarse, setIsCoarse] = useState(false);
  // Gradient-IDs dynamisch, um Kollisionen zu vermeiden
  const badgeGradId = useId();

  // Scroll-Fortschritt (Top-Bar)
  const { scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, { stiffness: 120, damping: 22, mass: 0.4 });

  // Aktueller Kapitelindex für Dots-Navigation
  const [currentChapter, setCurrentChapter] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>('.chapter-section[data-chapter-index]'));
      const scrollY = window.scrollY;
      let current = 0;
      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        const top = rect.top + window.scrollY;
        if (top - 130 <= scrollY) current = i; else break;
      }
      setCurrentChapter(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll as any);
      window.removeEventListener('resize', onScroll as any);
    };
  }, []);

  // Während des Intros Scrollen verhindern
  useEffect(() => {
    if (!showIntro) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showIntro]);

  // Intro nur einmal pro Session anzeigen; via ?intro=1 erzwingen
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const url = new URL(window.location.href);
      const force = url.searchParams.get('intro') === '1';
      const seen = sessionStorage.getItem('pitchIntroSeen') === '1';
      if (force) {
        sessionStorage.removeItem('pitchIntroSeen');
        setShowIntro(true);
      } else if (seen) {
        setShowIntro(false);
      }
    } catch {}
  }, []);

  // 0.5s nachdem das Intro weg ist, Text einfahren und Bot leicht nach links schieben
  useEffect(() => {
    if (showIntro) return;
    const timer = setTimeout(() => setHeaderReady(true), 500);
    return () => clearTimeout(timer);
  }, [showIntro]);

  // Stage auf 'title' setzen sobald Intro vorbei ist
  useEffect(() => {
    if (!showIntro) setStage('title');
  }, [showIntro]);

  // Reduced Motion: sofort alles zeigen
  useEffect(() => {
    if (!showIntro && prefersReducedPage) {
      setHeaderReady(true);
      setStage('meta');
    }
  }, [showIntro, prefersReducedPage]);

  // Detect coarse pointer (Touch) to switch hint between Swipe (mobile) and Scroll (desktop)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(pointer: coarse)');
    const apply = () => setIsCoarse(!!mq.matches);
    apply();
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(apply);
      return () => mq.removeListener(apply);
    }
  }, []);

  // Sequenzstart wird im Header-Icon nach Layout-Animation getriggert (robuster als fixe Zeit)

  // Fallback/Override-Daten für die Pitch-Sektion gemäß Nutzerangaben (stabil via useMemo)
  const overrides = useMemo(() => ({
    investmentCase: {
      moat: [] as string[], // n/a laut Vorgabe
      traction: [
        "RaaS‑Rollouts mit Partnern (OEM/Integrator) beschleunigen Units & MRR",
        "App‑Store Anteil ab Jahr 3 bei 5–15% des Umsatzes (Upsell)",
        "Payback ~3 Monate (CAC ~€6k), LTV (Beitrag) ~€50k, LTV/CAC > 7x",
      ],
      unitEconomics: [
        "RaaS‑Preis je Roboter: 3.000–4.000 € / Monat (Ø ~3.500 €)",
        "Deckungsbeitrag je Roboter/Monat: ~2.000–2.400 € nach COGS",
        "Payback CAC: ~3 Monate (bei ~2.100 € mtl. Beitrag, CAC ~6.000 €)",
      ],
      gtm: [
        "Pilotprojekte mit Pflegeheimen, Hotels, Forschungsinstituten",
        "Kooperationen mit österreichischen Universitäten (TU Wien, FH Hagenberg, JKU Linz)",
        "Skalierung 2028–2029: RaaS‑Infrastruktur B2B, App‑Store (Beta), 20–30 Kunden DACH",
      ],
    },
    useOfFunds: {
      ticket: "€600.000",
      allocation: [
        { area: "Team", percent: 55 },
        { area: "Hardware CAPEX", percent: 20 },
        { area: "GTM/Vertrieb", percent: 12 },
        { area: "Cloud/Infra", percent: 8 },
        { area: "Compliance/Safety", percent: 5 },
      ] as Array<{ area: string; percent: number }>,
      milestones: [] as Array<{ year?: string; quarter?: string; title?: string }>, // n/a
    },
    askTerms: {
      roundLines: [
        "2025: Seed €0,6 Mio. (Produkt/Team/GTM) + Grants €0,2–0,4 Mio.",
        "2026: Bridge €0,3–0,5 Mio. zur Beschleunigung Pilot‑Rollouts",
        "Optional 2027: Series‑A abhängig von KPI‑Meilensteinen",
      ],
      terms: [
        "Instrument: SAFE",
        "Discount: 15%",
        "Valuation Cap: €5,0 Mio.",
        "Pro‑Rata‑Rechte: Ja",
      ],
      runway: [
        ["Aktueller Cash", 450000],
        ["Monatlicher Burn", -65000],
        ["Runway (Monate)", 7],
      ] as any[],
    },
  }) as const, []);

  // Kapitel 'Arbeitspakete' vollständig aus dem Pitch ausblenden
  const filteredChapters = useMemo(() => (
    chapters.filter((c) => !/arbeitspaket/i.test(c.title) && !/arbeitspaket/i.test(String(c.slug)))
  ), []);

  // Presenter-Mode: einfache Tastaturnavigation zwischen Kapiteln
  useEffect(() => {
    function getSections(): HTMLElement[] {
      return Array.from(document.querySelectorAll<HTMLElement>('.chapter-section[data-chapter-index]'));
    }
    function getCurrentIndex(): number {
      const sections = getSections();
      const scrollY = window.scrollY;
      let current = 0;
      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        const top = rect.top + window.scrollY;
        if (top - 120 <= scrollY) current = i; else break;
      }
      return current;
    }
    function scrollToIndex(idx: number) {
      const sections = getSections();
      if (idx < 0 || idx >= sections.length) return;
      const el = sections[idx];
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const onKey = (e: KeyboardEvent) => {
      const key = e.key;
      if (["ArrowRight","ArrowDown","PageDown"," "].includes(key)) {
        e.preventDefault();
        scrollToIndex(getCurrentIndex() + 1);
      } else if (["ArrowLeft","ArrowUp","PageUp"].includes(key)) {
        e.preventDefault();
        scrollToIndex(getCurrentIndex() - 1);
      }
    };
    window.addEventListener('keydown', onKey, { passive: false } as any);
    return () => window.removeEventListener('keydown', onKey as any);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Scroll Progress Bar */}
      {!prefersReducedPage && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left bg-[linear-gradient(90deg,var(--color-accent),var(--color-accent-3))]"
          style={{ scaleX: progressX }}
          aria-hidden
        />
      )}
      {/* Vollflächiges Intro-Overlay – deterministische Fly-to-Target Animation */}
      <AnimatePresence>
        {showIntro && (
          <IntroOverlay
            onDone={() => {
              try { sessionStorage.setItem('pitchIntroSeen', '1'); } catch {}
              setShowIntro(false);
            }}
          />
        )}
      </AnimatePresence>
      {/* Print-only cover page for Pitch */}
      <div className="hidden print:block">
        <PitchCoverPage />
        {/* Print watermark */}
        <div className="print-watermark" aria-hidden>
          <span>VERTRAULICH</span>
        </div>
        {/* Print Table of Contents for pitch chapters */}
        <PrintTOC title="Inhalt" items={filteredChapters.map(c => ({ id: c.slug, title: c.title }))} />
      </div>
      {/* Main Content (RootLayout stellt bereits Container-Breite & Padding bereit) */}
      <div className="py-8">
        {/* Hero Header – eleganter Titel mit Badge & i18n Subtitel */}
        <div className="mb-12 md:mb-16">
          <div className="mx-auto max-w-3xl text-center flex flex-col items-center justify-center">
            {/* Badge (bleibt sichtbar ab 'badge' und in 'meta') */}
            <AnimatePresence>
              {(stage === 'badge' || stage === 'meta') && (
                <motion.div
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium tracking-wide
                             ring-1 [--g1:var(--color-accent)] [--g2:var(--color-accent-3)]
                             ring-[color-mix(in_oklab,color-mix(in_oklab,var(--g1)_50%,var(--g2)_50%)_45%,transparent)]
                             bg-[linear-gradient(90deg,color-mix(in_oklab,var(--g1)_10%,transparent),color-mix(in_oklab,var(--g2)_10%,transparent))]
                             backdrop-blur-[0.5px]
                             shadow-[inset_0_0_0_1px_color-mix(in_oklab,color-mix(in_oklab,var(--g1)_50%,var(--g2)_50%)_22%,transparent)]"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: [-2, 1, 0] }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  onAnimationComplete={() => {
                    if (stage === 'badge') setStage('meta');
                  }}
                >
                  <CheckCircle2 className="h-3 w-3" aria-hidden stroke={`url(#${badgeGradId})`}>
                    <defs>
                      <linearGradient id={badgeGradId as any} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-accent)" />
                        <stop offset="100%" stopColor="var(--color-accent-3)" />
                      </linearGradient>
                    </defs>
                  </CheckCircle2>
                  <span className="text-transparent bg-clip-text bg-[linear-gradient(90deg,var(--g1),var(--g2))]">
                    {t("title", { default: "Investor Pitch" })}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Brand Lockup (kein Link, zentriert, ohne Unterstreichung) */}
            <h1 className="mt-1.5 text-[clamp(3.0rem,10.5vw,3.6rem)] md:text-5xl font-extrabold tracking-tight md:tracking-tighter leading-[1.06] md:leading-tight w-full">
              <span className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:items-center sm:justify-center sm:gap-2 [--g1:var(--color-accent)] [--g2:var(--color-accent-3)] pointer-events-none select-none w-full">
                  {/* Header-Anchor für die Zielmessung */}
                  <span id="pitch-bot-anchor" className="inline-flex items-center justify-center w-[1.5em] h-[1.5em] sm:w-[1.15em] sm:h-[1.15em]">
                    <motion.i
                      aria-hidden
                      className={`inline-flex items-center justify-center text-[--color-accent] w-[1.5em] h-[1.5em] sm:w-[1.15em] sm:h-[1.15em] ${showIntro ? 'invisible' : 'visible'}`}
                      style={{ width: '1.15em', height: '1.15em' }}
                      animate={headerReady && !showIntro ? { scale: [1, 1.03, 1] } : {}}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                    >
                      <Bot className="w-full h-full" stroke="currentColor" fill="none" strokeWidth={2} />
                    </motion.i>
                  </span>
                  {/* Titel-Textsegmente */}
                  <motion.span
                    className="text-transparent bg-clip-text bg-[linear-gradient(90deg,var(--g1),var(--g2))] text-center [text-wrap:balance] decoration-transparent"
                    initial={{ opacity: 0, x: 60 }}
                    animate={headerReady && !showIntro ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
                    transition={{ type: 'spring', stiffness: 520, damping: 22, mass: 0.7 }}
                    onAnimationComplete={() => {
                      if (stage === 'title') setStage('badge');
                    }}
                  >
                    SIGMACODE AI
                  </motion.span>
                  <motion.span
                    className="ai-gradient-subtle text-center [text-wrap:balance] decoration-transparent"
                    initial={{ opacity: 0, x: 12 }}
                    animate={headerReady && !showIntro ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
                    transition={{ duration: 0.35, ease: 'easeOut', delay: 0.15 }}
                  >
                    Robotics
                  </motion.span>
              </span>
            </h1>

            {/* Subtitel + Divider erscheinen erst nach Badge */}
            <AnimatePresence>
              {stage === 'meta' && (
                <>
                  <motion.p
                    className="mt-2 text-[16px] md:text-lg text-[--color-foreground-muted] max-w-[68ch] mx-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1], delay: 0.12 }}
                  >
                    {t("subtitle", { default: "Humanoid Robotics · App‑Store · KI‑Assistenz · Skalierbares RaaS" })}
                  </motion.p>
                  {/* Unterstreichung/Divider im Logo-Hero entfernt */}
                  {!prefersReducedPage && (
                    <motion.div
                      className="mt-3 flex items-center justify-center"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.36 }}
                      role="status"
                      aria-live="polite"
                    >
                      <motion.span
                        className="inline-flex items-center justify-center p-2.5 md:p-3 rounded-full ring-1 ring-[--color-border-subtle] bg-[--color-surface]/60 backdrop-blur-[1px] text-[--color-accent]"
                        animate={{ y: [0, 10, 0], opacity: [0.75, 1, 0.75] }}
                        transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
                        aria-hidden
                      >
                        {isCoarse ? (
                          <ChevronsDown className="h-6 w-6 md:h-7 md:w-7" />
                        ) : (
                          <Mouse className="h-6 w-6 md:h-7 md:w-7" />
                        )}
                      </motion.span>
                      <span className="sr-only">{isCoarse ? 'Nach unten wischen' : 'Nach unten scrollen'}</span>
                    </motion.div>
                  )}
                  {/* Intro-Replay */}
                  <motion.div
                    className="mt-2 flex items-center justify-center"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut', delay: 0.48 }}
                  >
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-[12px] ring-1 ring-[--color-border-subtle] bg-[color-mix(in_oklab,var(--color-surface)_70%,transparent)] text-[--color-foreground] hover:bg-[color-mix(in_oklab,var(--color-surface)_82%,transparent)] focus:outline-none focus:ring-2 focus:ring-[--color-accent]"
                      onClick={() => {
                        try { sessionStorage.removeItem('pitchIntroSeen'); } catch {}
                        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
                        setShowIntro(true);
                      }}
                    >
                      Intro wiedergeben
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="space-y-20">
          {filteredChapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              className="chapter-section"
              data-chapter-index={index}
              id={`pitch-${chapter.slug}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ ...defaultTransition, delay: index * 0.08 }}
              viewport={{ ...defaultViewport, margin: "-30% 0px -55% 0px" }}
            >
              <ChapterSection
                chapter={chapter}
                index={index}
                total={filteredChapters.length}
                messages={messages}
                locale={locale}
              />
            </motion.div>
          ))}
        </div>

        {/* Rechte Dots-Navigation */}
        <nav
          aria-label="Kapitel Navigation"
          className="fixed right-3 md:right-4 top-1/2 -translate-y-1/2 z-[55] hidden sm:block"
        >
          <ul className="m-0 p-0 list-none space-y-2">
            {filteredChapters.map((chapter, idx) => (
              <li key={chapter.id} className="m-0">
                <button
                  type="button"
                  aria-label={`${idx + 1}. ${chapter.title}`}
                  title={`${idx + 1}. ${chapter.title}`}
                  onClick={() => {
                    const el = document.getElementById(`pitch-${chapter.slug}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="group relative block h-2.5 w-2.5 rounded-full overflow-hidden"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-[--color-border-subtle] group-hover:bg-[--color-accent]/50 transition-colors"
                  />
                  {currentChapter === idx && (
                    <motion.span
                      layoutId="chapter-dot"
                      className="absolute inset-0 rounded-full bg-[--color-accent]"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Investment Case – Moat, Traction, Unit Economics, GTM */}
        <Reveal>
          <ElegantCard className="mt-14" innerClassName="p-8 print:shadow-none print:ring-0 print:bg-transparent">
            <div className="mb-4">
              <h2 className="text-xl font-extrabold tracking-tight">Investment Case</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {useMemo(() => {
              const m: any = messages ?? {};
              const moats: string[] = Array.isArray(m.marketCompetitive?.moat) ? m.marketCompetitive.moat : (Array.isArray(m.content?.marketCompetitive?.moat) ? m.content.marketCompetitive.moat : overrides.investmentCase.moat);
              const traction: string[] = Array.isArray((m.bp as any)?.tractionKpis?.highlights) ? (m.bp as any).tractionKpis.highlights : overrides.investmentCase.traction;
              const unit: string[] = Array.isArray(m.businessModel?.unitEconomics) ? m.businessModel.unitEconomics : (Array.isArray(m.content?.businessModel?.unitEconomics) ? m.content.businessModel.unitEconomics : overrides.investmentCase.unitEconomics);
              const gtm: string[] = Array.isArray(m.gtm?.phase1) ? m.gtm.phase1 : (Array.isArray(m.content?.gtm?.phase1) ? m.content.gtm.phase1 : overrides.investmentCase.gtm);
              type Sec = { title: string; items: string[] };
              const sections: Sec[] = [
                { title: 'Moat', items: moats.slice(0, 3) },
                { title: 'Traction', items: traction.slice(0, 3) },
                { title: 'Unit Economics', items: unit.slice(0, 3) },
                { title: 'GTM', items: gtm.slice(0, 3) },
              ];
              return sections;
            }, [messages, overrides]).map((sec, idx) => (
              <motion.div
                key={idx}
                className="rounded-2xl bg-[--color-surface]/70 ring-1 ring-[--color-border-subtle] p-5"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30% 0px -55% 0px" }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: Math.min(idx * 0.05, 0.25) }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <h3 className="text-sm font-semibold tracking-wide uppercase">{sec.title}</h3>
                </div>
                <ul className="grid gap-2.5 md:gap-3 text-[13px] md:text-[14px] list-none p-0 m-0">
                  {sec.items.length > 0 ? sec.items.filter((t) => !shouldHideBullet(String(t))).map((t, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-1 h-1 w-1 rounded-full bg-white/80" aria-hidden />
                      <span>{t}</span>
                    </li>
                  )) : <li className="text-[--color-foreground-muted]">n/a</li>}
                </ul>
              </motion.div>
            ))}
            </div>
          </ElegantCard>
        </Reveal>

        {/* Use of Funds – Ticket, Allocation, Nächste Meilensteine */}
        <Reveal>
          <ElegantCard className="mt-12" innerClassName="p-8 print:shadow-none print:ring-0 print:bg-transparent">
            <div className="mb-4">
              <h2 className="text-xl font-extrabold tracking-tight">Use of Funds</h2>
            </div>
            
            {useMemo(() => {
            const m: any = messages ?? {};
            const fin = (m.content?.finance ?? m.finance ?? {}) as any;
            const ticket = fin.fundingStrategy?.ticket ?? fin.fundingRound?.ticket ?? overrides.useOfFunds.ticket;
            const allocation = Array.isArray(fin.fundingStrategy?.allocation)
              ? fin.fundingStrategy.allocation as Array<{area: string; percent?: number | string}>
              : (Array.isArray(fin.fundingStrategyAllocation)
                ? fin.fundingStrategyAllocation as Array<{area: string; percent?: number | string}>
                : overrides.useOfFunds.allocation);
            const msRows: any[] = Array.isArray(m.milestones?.rows) ? m.milestones.rows : (Array.isArray(m.content?.milestones?.rows) ? m.content.milestones.rows : overrides.useOfFunds.milestones);
            const milestones = (msRows || []).slice(0, 3).map((r: any[]) => ({ year: r?.[0], quarter: r?.[1], title: r?.[2] }));
            return { ticket, allocation, milestones };
          }, [messages, overrides]) as any /* narrow scope */ && (
              <div className="grid gap-6 md:grid-cols-3">
              {/* Ticketgröße */}
              <div className="rounded-2xl bg-[--color-surface]/70 ring-1 ring-[--color-border-subtle] p-5 print:shadow-none print:ring-0 print:bg-transparent">
                <div className="text-sm font-semibold tracking-wide uppercase mb-1">Ticketgröße</div>
                <div className="text-2xl font-extrabold [font-feature-settings:'tnum'] [font-variant-numeric:tabular-nums]">
                  {(() => {
                    const m: any = messages ?? {};
                    const fin = (m.content?.finance ?? m.finance ?? {}) as any;
                    const ticketVal = fin.fundingStrategy?.ticket ?? fin.fundingRound?.ticket ?? overrides.useOfFunds.ticket ?? null;
                    return ticketVal ? String(ticketVal) : <span className="text-[--color-foreground-muted]">n/a</span>;
                  })()}
                </div>
                <div className="text-[12px] text-[--color-foreground-muted] mt-1">Geplant für 12–18 Monate Runway</div>
              </div>
              {/* Allocation */}
              <div className="rounded-2xl bg-[--color-surface]/70 ring-1 ring-[--color-border-subtle] p-5 print:shadow-none print:ring-0 print:bg-transparent">
                <div className="text-sm font-semibold tracking-wide uppercase mb-2">Allocation</div>
                <ul className="grid gap-0 text-[13px] md:text-[14px] list-none p-0 m-0 divide-y divide-[--color-border-subtle]/50">
                  {(() => {
                    const m: any = messages ?? {};
                    const fin = (m.content?.finance ?? m.finance ?? {}) as any;
                    const allocExplicit = Array.isArray(fin.fundingStrategy?.allocation)
                      ? (fin.fundingStrategy.allocation as Array<{ area: string; percent?: number | string }>)
                      : (Array.isArray(fin.fundingStrategyAllocation)
                        ? (fin.fundingStrategyAllocation as Array<{ area: string; percent?: number | string }>)
                        : overrides.useOfFunds.allocation as Array<{ area: string; percent?: number | string }>);
                    if (allocExplicit.length > 0) {
                      return allocExplicit.slice(0,5).map((a, i) => {
                        const pct = typeof a.percent === 'number' ? a.percent : (typeof a.percent === 'string' ? parseFloat(a.percent) : NaN);
                        const safePct = Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : NaN;
                        return (
                          <li key={i}>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span>{a.area}</span>
                              <span className="font-medium [font-feature-settings:'tnum'] [font-variant-numeric:tabular-nums]">{Number.isFinite(safePct) ? `${safePct}%` : (typeof a.percent !== 'undefined' ? String(a.percent) : '—')}</span>
                            </div>
                            {Number.isFinite(safePct) ? (
                              <div className="h-2 rounded-full bg-[--color-surface-2] overflow-hidden">
                                <div className="h-full bg-[--color-accent]" style={{ width: `${safePct}%` }} />
                              </div>
                            ) : null}
                          </li>
                        );
                      });
                    }
                    // Fallback: aus useOfFundsYears die erste Zeile für Anteile ableiten
                    const table = fin.useOfFundsYears;
                    const headers: any[] = Array.isArray(table?.headers) ? table.headers : [];
                    const first: any[] = Array.isArray(table?.rows?.[0]) ? table.rows[0] : [];
                    // Erwartet Schema: [Jahr, Cat1, Cat2, ..., CatN, Summe]
                    if (headers.length > 0 && first.length > 2) {
                      const lastIdx = first.length - 1;
                      const total = typeof first[lastIdx] === 'number' ? first[lastIdx] : first.slice(1, lastIdx).reduce((acc: number, v: any) => acc + (typeof v === 'number' ? v : 0), 0);
                      const items = headers.slice(1, -1).map((h: any, idx: number) => ({
                        area: String(h),
                        value: typeof first[idx + 1] === 'number' ? first[idx + 1] : 0
                      }));
                      const top = items
                        .map(it => ({ ...it, percent: total > 0 ? Math.round((it.value / total) * 100) : 0 }))
                        .sort((a, b) => b.percent - a.percent)
                        .slice(0, 5);
                      return top.map((a, i) => (
                        <li key={i}>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span>{a.area}</span>
                            <span className="font-medium [font-feature-settings:'tnum'] [font-variant-numeric:tabular-nums]">{a.percent}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-[--color-surface-2] overflow-hidden">
                            <div className="h-full bg-[--color-accent]" style={{ width: `${a.percent}%` }} />
                          </div>
                        </li>
                      ));
                    }
                    return <li className="text-[--color-foreground-muted]">n/a</li>;
                  })()}
                </ul>
              </div>
              {/* Meilensteine */}
              <div className="rounded-2xl bg-[--color-surface]/70 ring-1 ring-[--color-border-subtle] p-5 print:shadow-none print:ring-0 print:bg-transparent">
                <div className="text-sm font-semibold tracking-wide uppercase mb-2">Nächste Meilensteine</div>
                <ul className="grid gap-2 text-[13px] md:text-[14px] list-none p-0 m-0">
                  {(() => {
                    const m: any = messages ?? {};
                    const fin = (m.content?.finance ?? m.finance ?? {}) as any;
                    const milestones: Array<{ year?: string; quarter?: string; title?: string }> = Array.isArray(fin.milestones) ? fin.milestones : overrides.useOfFunds.milestones;
                    if (Array.isArray(milestones) && milestones.length > 0) {
                      return milestones.slice(0, 4).map((ms, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[--color-accent-3]" aria-hidden />
                          <span>{[ms.year, ms.quarter, ms.title].filter(Boolean).join(' · ') || '—'}</span>
                        </li>
                      ));
                    }
                    return <li className="text-[--color-foreground-muted]">n/a</li>;
                  })()}
                </ul>
              </div>
              </div>
            )}
          </ElegantCard>
        </Reveal>

        {/* Ask & Terms – Runde, Rahmenbedingungen, Runway */}
        <Reveal>
          <ElegantCard className="mt-12" innerClassName="p-8 print:shadow-none print:ring-0 print:bg-transparent">
            <div className="mb-4">
              <h2 className="text-xl font-extrabold tracking-tight">Ask & Terms</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
            {/* Runde & Zweck */}
            <div>
              <div className="text-sm font-semibold tracking-wide uppercase mb-2">Runde & Zweck</div>
              <ul className="grid gap-2 text-[13px] md:text-[14px] list-none p-0 m-0">
                {(() => {
                  const m: any = messages ?? {};
                  const fin = (m.content?.finance ?? m.finance ?? {}) as any;
                  const lines: string[] = Array.isArray(fin.fundingStrategy) ? fin.fundingStrategy : overrides.askTerms.roundLines;
                  return lines.length > 0 ? lines.slice(0, 3).map((l, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[--color-accent]" aria-hidden />
                      <span>{l}</span>
                    </li>
                  )) : <li className="text-[--color-foreground-muted]">n/a</li>;
                })()}
              </ul>
            </div>
            {/* Konditionen (falls gepflegt) */}
            <div>
              <div className="text-sm font-semibold tracking-wide uppercase mb-2">Konditionen</div>
              <ul className="grid gap-2 text-[13px] md:text-[14px] list-none p-0 m-0">
                {(() => {
                  const m: any = messages ?? {};
                  const fin = (m.content?.finance ?? m.finance ?? {}) as any;
                  const terms: Array<string> = Array.isArray(fin.terms) ? fin.terms : overrides.askTerms.terms;
                  if (terms.length > 0) return terms.slice(0, 4).map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[--color-accent-2]" aria-hidden />
                      <span>{t}</span>
                    </li>
                  ));
                  // Fallback Platzhalter
                  return (
                    <>
                      <li className="text-[--color-foreground-muted]">Pre‑Money: n/a</li>
                      <li className="text-[--color-foreground-muted]">Instrument: n/a</li>
                      <li className="text-[--color-foreground-muted]">Discount/Cap: n/a</li>
                    </>
                  );
                })()}
              </ul>
            </div>
            {/* Runway */}
            <div>
              <div className="text-sm font-semibold tracking-wide uppercase mb-2">Runway</div>
              <ul className="grid gap-2 text-[13px] md:text-[14px] list-none p-0 m-0">
                {(() => {
                  const m: any = messages ?? {};
                  const fin = (m.content?.finance ?? m.finance ?? {}) as any;
                  const runway: any[] = Array.isArray(fin.runway) ? fin.runway : overrides.askTerms.runway;
                  return runway.length > 0 ? runway.slice(0, 3).map((row, i) => (
                    <li key={i} className="flex items-center justify-between gap-2">
                      <span>{row?.[0]}</span>
                      <span className="font-medium [font-feature-settings:'tnum'] [font-variant-numeric:tabular-nums]">{typeof row?.[1] === 'number' ? row[1].toLocaleString('de-DE') : String(row?.[1] ?? '—')}</span>
                    </li>
                  )) : <li className="text-[--color-foreground-muted]">n/a</li>;
                })()}
              </ul>
            </div>
          </div>
          </ElegantCard>
        </Reveal>

        {/* Compact Risks & Mitigation */}
        <Reveal>
          <ElegantCard className="mt-12" innerClassName="p-8 print:shadow-none print:ring-0 print:bg-transparent">
            <div className="mb-2">
              <h2 className="text-lg font-semibold tracking-tight">Risiken & Mitigation (Auszug)</h2>
            </div>
            <ul className="grid gap-2.5 md:gap-3 md:grid-cols-2 text-[13px] md:text-[14px] list-none p-0 m-0">
            {useMemo(() => extractBulletsForChapter('risks', messages), [messages]).filter((r) => !shouldHideBullet(r)).slice(0,6).map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-1 w-1 rounded-full bg-white/80" aria-hidden />
                <span>{r}</span>
              </li>
            ))}
            </ul>
          </ElegantCard>
        </Reveal>

        {/* Call to Action */}
        <Reveal>
          <ElegantCard className="mt-16" innerClassName="p-8 print:shadow-none print:ring-0 print:bg-transparent">
            <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ ...defaultTransition, delay: 0.2 }}
            viewport={{ ...defaultViewport }}
          >
            <h2>
              Nächster Schritt: Investment-Dialog
            </h2>
            <p className="text-xl text-[--color-foreground] max-w-3xl mx-auto">
              Wir kombinieren differenzierte Technologie, belastbare Unit Economics und klare GTM-Pfade. Lassen Sie uns konkret über Ticketgröße,
              Meilensteine und Zeithorizont sprechen – kompakt, datenbasiert, ergebnisorientiert.
            </p>
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <motion.a
                href={"mailto:invest@sigmacode.ai?subject=Investor%20Meeting&body=Hallo%20SIGMACODE%20AI%2C%5Cnwir%20m%C3%B6chten%20gern%20ein%20Gespr%C3%A4ch%20vereinbaren.%20Vorschl%C3%A4ge%20f%C3%BCr%20Termine%3A%20..."}
                className="btn-outline-gradient print:hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="h-4 w-4" aria-hidden />
                Gespräch vereinbaren (Invest)
              </motion.a>
              <motion.button
                onClick={() => window.print()}
                className="btn-outline-brand print:hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Printer className="h-4 w-4" aria-hidden />
                PDF exportieren
              </motion.button>
            </div>
            </motion.div>
          </ElegantCard>
        </Reveal>
      </div>
      {/* Print-only closing/contact page */}
      <div className="hidden print:block">
        <ClosingPage />
      </div>
    </div>
  );
}

function AnimatedCounter({ value, delay = 0 }: { value: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  // Trigger etwas später im Viewport: erscheint, wenn der Abschnitt wirklich im Fokus ist
  const inView = useInView(ref, { once: true, margin: "-30% 0px -55% 0px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 90, damping: 22 });
  const rounded = useTransform(spring, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => {
      const n = typeof v === "number" ? v : parseFloat(String(v));
      if (!Number.isNaN(n)) setDisplay(Math.round(n));
    });
    if (inView) {
      const timer = setTimeout(() => {
        motionVal.stop();
        motionVal.set(0);
        spring.set(0);
        motionVal.set(value);
      }, delay * 1000);
      return () => { clearTimeout(timer); unsub(); };
    }
    return () => unsub();
  }, [inView, value, delay, motionVal, spring, rounded]);

  return (
    <motion.span
      ref={ref}
      style={{}}
      initial={{ opacity: 0.85 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-30% 0px -55% 0px" }}
      transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
    >
      {display}
    </motion.span>
  );
}

function ChapterSection({ chapter, index, total, messages, locale }: {
  chapter: typeof chapters[0];
  index: number;
  total: number;
  messages: Messages | null;
  locale?: string;
}) {
  const bullets = useMemo(() => extractBulletsForChapter(chapter.slug, messages), [chapter.slug, messages]);
  const financeKpis = useMemo(() => chapter.slug === 'finance' ? extractFinanceKpis(messages) : [], [chapter.slug, messages]);
  const tractionKpis = useMemo(() => chapter.slug === 'traction-kpis' ? extractTractionKpis(messages) : [], [chapter.slug, messages]);

  // Kapitel-Icon je Abschnitt (nur für Bullets unten)
  const Icon = useMemo<ElementType>(() => {
    switch (chapter.slug) {
      case 'executive': return Sparkles;
      case 'business-model': return Briefcase;
      case 'market': return LineChart;
      case 'gtm': return Rocket;
      case 'finance': return Banknote;
      case 'technology': return Cpu;
      case 'team': return Users;
      case 'risks': return AlertTriangle;
      case 'traction-kpis': return Target;
      case 'impact': return Leaf;
      case 'exit-strategy': return Flag;
      default: return CheckCircle2;
    }
  }, [chapter.slug]);

  // Einheitliche Icon-Größe; für 'risks' etwas dünnerer Stroke, damit das Ausrufezeichen klar bleibt
  const bulletIconSize = useMemo(() => 20, []);
  const bulletIconStroke = useMemo(() => (
    chapter.slug === 'risks' ? 2.0 : 2.25
  ), [chapter.slug]);

  const bulletIconKeyframes = useMemo(() => {
    switch (chapter.slug) {
      case 'gtm':
        return { animate: { y: [0, -6, 0] as number[] }, transition: { duration: 1.15, ease: 'easeInOut' as const, repeat: 2, repeatType: 'mirror' as const } };
      case 'market':
        return { animate: { y: [0, -5, 0] as number[] }, transition: { duration: 1.05, ease: 'easeInOut' as const, repeat: 2, repeatType: 'mirror' as const } };
      case 'finance':
        return { animate: { scale: [1, 1.12, 1] as number[] }, transition: { duration: 1.05, ease: 'easeInOut' as const, repeat: 2, repeatType: 'mirror' as const } };
      case 'technology':
        return { animate: { rotate: [0, -12, 0] as number[] }, transition: { duration: 1.15, ease: 'easeInOut' as const, repeat: 2, repeatType: 'mirror' as const } };
      case 'team':
        return { animate: { scale: [1, 1.1, 1] as number[] }, transition: { duration: 1.0, ease: 'easeInOut' as const, repeat: 2, repeatType: 'mirror' as const } };
      case 'risks':
        return { animate: { rotate: [0, -10, 0] as number[] }, transition: { duration: 1.05, ease: 'easeInOut' as const, repeat: 2, repeatType: 'mirror' as const } };
      case 'traction-kpis':
        return { animate: { scale: [1, 1.12, 1] as number[] }, transition: { duration: 1.05, ease: 'easeInOut' as const, repeat: 2, repeatType: 'mirror' as const } };
      case 'impact':
        return { animate: { y: [0, -6, 0] as number[] }, transition: { duration: 1.05, ease: 'easeInOut' as const, repeat: 2, repeatType: 'mirror' as const } };
      case 'exit-strategy':
        return { animate: { x: [0, -6, 0] as number[] }, transition: { duration: 1.05, ease: 'easeInOut' as const, repeat: 2, repeatType: 'mirror' as const } };
      case 'business-model':
        return { animate: { scale: [1, 1.1, 1] as number[] }, transition: { duration: 1.0, ease: 'easeInOut' as const, repeat: 2, repeatType: 'mirror' as const } };
      case 'executive':
      default:
        return { animate: { opacity: [0.85, 1, 0.85] as number[] }, transition: { duration: 1.0, ease: 'easeInOut' as const, repeat: 2, repeatType: 'mirror' as const } };
    }
  }, [chapter.slug]);

  return (
    <Reveal>
      <ElegantCard innerClassName="p-8 print:shadow-none print:ring-0 print:bg-transparent">
        <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <motion.span
            className="shine-text text-3xl sm:text-4xl font-extrabold"
            initial={{ opacity: 0.85, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
          >
            <AnimatedCounter value={index + 1} delay={index * 0.05} />
          </motion.span>
          <div>
            <h2
              className="shine-text ai-gradient-subtle text-2xl font-extrabold tracking-tight"
            >
              {chapter.title}
            </h2>
          </div>
        </div>
        <div className="text-sm text-[--color-foreground-muted]">
          {index + 1} von {total}
        </div>
      </div>

      {/* Kompakte Inhaltsstichpunkte aus Businessplan/i18n mit Kapitel-Icons */}
      <div className="prose max-w-none">
        {bullets.length > 0 && (
          <ul className="grid gap-2.5 md:gap-3 sm:grid-cols-2 list-none p-0 m-0">
            {bullets.filter((b) => !shouldHideBullet(b)).map((b, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-2.5 text-[13px] md:text-[14px] text-[--color-foreground]"
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: Math.min(i * 0.03, 0.18) }}
                viewport={{ once: true, margin: "-30% 0px -55% 0px" }}
              >
                {(() => {
                  const I = Icon;
                  const gradId = `pitch-icon-grad-${chapter.slug}-${i}`;
                  return (
                    <motion.i
                      aria-hidden
                      className="inline-flex items-center justify-center shrink-0 leading-none"
                      initial={false}
                      whileInView={bulletIconKeyframes.animate}
                      transition={bulletIconKeyframes.transition}
                      viewport={{ once: true, margin: "-30% 0px -55% 0px" }}
                      style={{ width: bulletIconSize, height: bulletIconSize }}
                    >
                      {chapter.slug === 'risks' ? (
                        <svg
                          width={bulletIconSize as any}
                          height={bulletIconSize as any}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="none"
                        >
                          <defs>
                            <linearGradient id={gradId} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                              <stop offset="0%" stopColor={'var(--color-accent-2)'} />
                              <stop offset="100%" stopColor={'var(--color-accent-3)'} />
                            </linearGradient>
                          </defs>
                          <path
                            d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                            stroke={`url(#${gradId})`}
                            strokeWidth={bulletIconStroke as any}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <rect x="10.9" y="8.2" width="2.2" height="6.0" rx="1.1" fill={`url(#${gradId})`} shapeRendering="geometricPrecision" />
                          <circle cx="12" cy="16" r="1.5" fill={`url(#${gradId})`} />
                        </svg>
                      ) : (
                        <I
                          className="block w-full h-full"
                          width={bulletIconSize as any}
                          height={bulletIconSize as any}
                          stroke={`url(#${gradId})`}
                          fill="none"
                          strokeWidth={bulletIconStroke as any}
                          vectorEffect="non-scaling-stroke"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ shapeRendering: 'geometricPrecision' }}
                        >
                          <defs>
                            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={chapter.slug === 'risks' ? 'var(--color-accent-2)' : 'var(--color-accent)'} />
                              <stop offset="100%" stopColor={'var(--color-accent-3)'} />
                            </linearGradient>
                          </defs>
                        </I>
                      )}
                    </motion.i>
                  );
                })()}
                <span>{b}</span>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      {/* Mini KPI-Karten für Finance / Traction */}
      {(financeKpis.length > 0 || tractionKpis.length > 0) && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(financeKpis.length > 0 ? financeKpis : tractionKpis).map((k, i) => (
            <motion.div
              key={`${k.label}-${i}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30% 0px -55% 0px" }}
              transition={{ ...defaultTransition, delay: Math.min(i * 0.06, 0.24) }}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
           >
              <ElegantCard
                className="kpi-card kpi-card--spacious kpi-card--hairline rounded-2xl"
                innerClassName="kpi-card-content p-4 md:p-5 text-center bg-[--color-surface]/70"
                ariaLabel={`${k.label} KPI Card`}
                role="group"
              >
                <div className="kpi-card-header text-[10px] md:text-[11px] tracking-wide uppercase text-[--color-foreground] opacity-80">{k.label}</div>
                <div className="kpi-value-row font-semibold [font-feature-settings:'tnum'] [font-variant-numeric:tabular-nums]">
                  <span className="kpi-value">{k.value}</span>
                </div>
                {k.sub ? (<div className="kpi-sub">{k.sub}</div>) : null}
              </ElegantCard>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        className="mt-6 flex justify-end items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Link href={buildLocalePath((locale ?? 'de'), `/chapters/${chapter.slug}`)} prefetch>
          <motion.span
            className="btn-outline-gradient"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Details ansehen
          </motion.span>
        </Link>
      </motion.div>
      </ElegantCard>
    </Reveal>
  );
}
