"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ElementType } from "react";
import { chapters } from "@/app/chapters/chapters.config";
import Reveal from "@/components/animation/Reveal";
import { defaultTransition, defaultViewport } from "@/components/animation/variants";
import { getMessages } from "@/i18n/messages";
import { buildLocalePath } from "@/i18n/path";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useLocale } from "next-intl";
import { CheckCircle2, Sparkles, LineChart, Shield, Rocket, Cpu, Users, AlertTriangle, Target, ArrowRight } from "lucide-react";
import PitchCoverPage from "@/components/document/PitchCoverPage";
import ClosingPage from "@/components/document/ClosingPage";
import PrintTOC from "@/components/document/PrintTOC";

type SimpleKpi = { label: string; value: string | number; sub?: string };

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
      {/* Print-only cover page for Pitch */}
      <div className="hidden print:block">
        <PitchCoverPage />
        {/* Print watermark */}
        <div className="print-watermark" aria-hidden>
          <span>VERTRAULICH</span>
        </div>
        {/* Print Table of Contents for pitch chapters */}
        <PrintTOC title="Inhalt" items={chapters.map(c => ({ id: c.slug, title: c.title }))} />
      </div>
      {/* Main Content (RootLayout stellt bereits Container-Breite & Padding bereit) */}
      <div className="py-8">
        {/* Seitentitel im Content-Kontext (kein eigener Sticky-Header) */}
        <div className="mb-6">
          <h1 className="shine-text ai-gradient text-center uppercase">Investor Pitch – Überblick</h1>
        </div>
        <div className="space-y-20">
          {chapters.map((chapter, index) => (
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
                total={chapters.length}
                messages={messages}
                locale={locale}
              />
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-24 text-center space-y-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ ...defaultTransition, delay: 0.2 }}
          viewport={{ ...defaultViewport }}
        >
          <h2>
            Bereit, die Zukunft der Robotik mitzugestalten?
          </h2>
          <p className="text-xl text-[--color-foreground] max-w-3xl mx-auto">
            Begleiten Sie uns bei der Revolution humanoider Robotik – mit KI‑gestützten Plattformen und messbarem Business‑Impact.
            Lassen Sie uns besprechen, wie SIGMACODE AI Robotics Ihr Unternehmen nach vorn bringt.
          </p>
          <div className="flex items-center justify-center gap-3">
            <motion.a
              href={"mailto:invest@sigmacode.ai?subject=Investor%20Meeting&body=Hallo%20SIGMACODE%20AI%2C%5Cnwir%20m%C3%B6chten%20gern%20ein%20Gespr%C3%A4ch%20vereinbaren.%20Vorschl%C3%A4ge%20f%C3%BCr%20Termine%3A%20..."}
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Gespräch vereinbaren
            </motion.a>
            <motion.button
              onClick={() => window.print()}
              className="inline-block px-5 py-4 font-semibold rounded-lg transition-all duration-300 bg-[--color-surface]/70 ring-1 ring-[--color-border-subtle] hover:bg-[--color-surface]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              PDF exportieren
            </motion.button>
          </div>
        </motion.div>
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
  const Icon = useMemo<ElementType>(() => {
    switch (chapter.slug) {
      case 'business-model': return CheckCircle2;
      case 'market': return LineChart;
      case 'gtm': return Rocket;
      case 'finance': return Shield;
      case 'technology': return Cpu;
      case 'team': return Users;
      case 'risks': return AlertTriangle;
      case 'traction-kpis': return Target;
      case 'impact': return Sparkles;
      case 'exit-strategy': return LineChart;
      default: return CheckCircle2;
    }
  }, [chapter.slug]);

  // Kontextbasierte Icon-Heuristik je Bullet
  const pickIconForBullet = useMemo<((text: string) => ElementType)>(() => {
    return (text: string): ElementType => {
      const t = (text || "").toLowerCase();
      if (/(revenue|arr|growth|cagr|market|tam|sam|som|kpi|payback|ltv|cac|margin|upsell|roi|conversion)/.test(t)) return LineChart;
      if (/(security|compliance|ce|ai act|safety|guardrail|audit|certif|certification)/.test(t)) return Shield;
      if (/(partner|alliance|oem|integrator|university|customer|design partner|ecosystem|co-?selling)/.test(t)) return Users;
      if (/(launch|rollout|scale|expansion|beta|app[- ]store|go-to-market|gtm)/.test(t)) return Rocket;
      if (/(robot|edge|sim|llm|vla|diffusion|policy|tensorrt|ros2|hardware|compute|fleet)/.test(t)) return Cpu;
      if (/(risk|mitigation|challenge|uncertainty)/.test(t)) return AlertTriangle;
      if (/(target|goal|objective|kpi)/.test(t)) return Target;
      if (/(innovation|ai|breakthrough|novel)/.test(t)) return Sparkles;
      // Fallback: Kapitel-Icon
      return Icon;
    };
  }, [Icon]);
  return (
    <Reveal className="panel panel--hairline rounded-2xl p-8">
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

      {/* Kompakte Inhaltsstichpunkte aus Businessplan/i18n mit Icons */}
      <div className="prose max-w-none">
        {bullets.length > 0 && (
          <ul className="grid gap-2 md:gap-2.5 sm:grid-cols-2 list-none p-0 m-0 list-separators-gradient">
            {bullets.map((b, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-2.5 text-[13px] md:text-[14px] text-[--color-foreground]"
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.8, 0.25, 1], delay: Math.min(i * 0.03, 0.18) }}
                viewport={{ once: true, margin: "-30% 0px -55% 0px" }}
              >
                <span className="chip-anim inline-flex items-center justify-center h-7 w-7">
                  {(() => { const I = pickIconForBullet(b); return <I aria-hidden className="h-5 w-5 md:h-6 md:w-6 text-[--color-accent-3]" /> })()}
                </span>
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
              <Card className="kpi-card kpi-card--spacious kpi-card--hairline rounded-2xl bg-[--color-surface]/70">
                <div className="kpi-card-content p-4 md:p-5 text-center">
                  <div className="kpi-card-header text-[10px] md:text-[11px] tracking-wide uppercase text-[--color-foreground] opacity-80">{k.label}</div>
                  <div className="kpi-value-row font-semibold [font-feature-settings:'tnum'] [font-variant-numeric:tabular-nums]">
                    <span className="kpi-value">{k.value}</span>
                  </div>
                  {k.sub ? (<div className="kpi-sub">{k.sub}</div>) : null}
                </div>
              </Card>
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
            <ArrowRight aria-hidden className="h-4 w-4" />
          </motion.span>
        </Link>
      </motion.div>
    </Reveal>
  );
}
