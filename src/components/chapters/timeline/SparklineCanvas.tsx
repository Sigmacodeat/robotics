"use client";

import React from "react";

export type SparklineCanvasProps = {
  // Prozentwert 0..1000 (wir clampen intern)
  percent?: number | undefined;
  // Optional: Achsenlabels links/rechts (z.B. Jahre)
  xLabels?: [string, string] | undefined;
  // Optional: ARIA Label für Barrierefreiheit
  ariaLabel?: string | undefined;
  // Optional: Farbe der Linie (rgba)
  color?: string | undefined;
};

// State-of-the-Art Canvas Sparkline (Variante B: Model/Draw strikt getrennt)
const SparklineCanvas: React.FC<SparklineCanvasProps> = ({ percent, xLabels, ariaLabel, color = 'rgba(16,185,129,0.8)' }) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const resizeObsRef = React.useRef<ResizeObserver | null>(null);

  // Sichtbarkeitsbeobachtung (leichtgewichtig, ohne zusätzliche Lib)
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      const vis = entries.some(e => e.isIntersecting);
      setInView(vis);
    }, { root: null, rootMargin: '-20% 0px -20% 0px', threshold: [0, 0.01, 0.1, 0.25, 0.5, 0.75, 1] });
    io.observe(el);
    return () => { try { io.disconnect(); } catch {} };
  }, []);

  type Model = {
    width: number;
    height: number;
    padTop: number;
    padBottom: number;
    padX: number;
    strokeColor: string;
    tipGlowColor: string;
    label: string; // "+XYZ%"
    labelWidth: number;
    startX: number;
    startY: number;
    endX: number;
    yFinal: number; // Ziel-Y für Prozentpunkt
  };

  const buildModel = (ctx: CanvasRenderingContext2D, cssW: number, cssH: number): Model => {
    const pRaw = typeof percent === 'number' && Number.isFinite(percent) ? percent : 100;
    const p = Math.max(0, Math.min(1000, pRaw));
    const stroke = color;
    const glow = /239,\s*68,\s*68/.test(color) ? 'rgba(239,68,68,0.9)' : 'rgba(16,185,129,0.9)';

    const padTop = 10;
    const padBottom = 18;
    const padX = 10;

    const label = `${p >= 0 ? '+' : ''}${Math.round(p)}%`;
    ctx.save();
    ctx.font = '12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
    const labelWidth = ctx.measureText(label).width;
    ctx.restore();

    // rechter Gutter abhängig von Labelbreite
    const rightGutterBase = 36;
    const rightGutter = Math.max(rightGutterBase, labelWidth + 18);

    // Raum für Y-Achse links (fix + etwas Luft)
    const leftAxis = 20 + 8; // 20 Achse + 8 Luft

    const startX = padX + leftAxis;
    const endX = Math.max(startX, cssW - padX - rightGutter);

    const Hdraw = Math.max(1, cssH - padTop - padBottom);
    const normFinal = Math.max(0, Math.min(1, p / 1000));
    const startY = cssH - padBottom - 1;
    const yFinal = padTop + (1 - normFinal) * Hdraw;

    return { width: cssW, height: cssH, padTop, padBottom, padX, strokeColor: stroke, tipGlowColor: glow, label, labelWidth, startX, startY, endX, yFinal };
  };

  const draw = (
    ctx: CanvasRenderingContext2D,
    dpr: number,
    model: Model,
    tt: number,
    xLabels?: [string, string]
  ) => {
    const { width, height, padTop, padBottom, padX, strokeColor, tipGlowColor, label, labelWidth, startX, startY, endX, yFinal } = model;

    // Clear & scale
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Ease: Cosine in/out
    const prog = 0.5 * (1 - Math.cos(Math.PI * Math.max(0, Math.min(1, tt))));
    const tipX = startX + (endX - startX) * prog;
    const tipY = startY + (yFinal - startY) * prog;

    // Y-Achse links
    ctx.strokeStyle = 'rgba(148,163,184,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padX + 20, padTop + 0.5);
    ctx.lineTo(padX + 20, height - padBottom + 0.5);
    ctx.stroke();

    // Horizontale Gridline durch StartY (Niveau)
    ctx.strokeStyle = 'rgba(148,163,184,0.10)';
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(startX, startY + 0.5);
    ctx.lineTo(endX, startY + 0.5);
    ctx.stroke();
    ctx.setLineDash([]);

    // Linie
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    // Glow um Spitze
    ctx.save();
    const g = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 10);
    g.addColorStop(0.0, 'rgba(255,255,255,0.85)');
    g.addColorStop(0.30, tipGlowColor);
    g.addColorStop(0.85, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(tipX, tipY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Tip-Dot + Ring
    ctx.fillStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(tipX, tipY, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = tipGlowColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(tipX, tipY, 2.8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Prozent-Label (mit "Pill"-Hintergrund)
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = strokeColor;
    ctx.font = '12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';

    let pctX = Math.min(width - padX - 6, tipX + 8);
    const pctY = Math.max(padTop + 10, Math.min(height - padBottom - 10, tipY - 8));
    if (tipX + 8 + labelWidth > width - padX - 6) {
      pctX = Math.max(padX + 24, tipX - labelWidth - 8);
    }

    // Pill-Hintergrund (abgeleitet aus Stroke-Farbe)
    const bgPadX = 6; const r = 6; const bgH = 16;
    const bgW = labelWidth + bgPadX * 2;
    const bgX = pctX - bgPadX; const bgY = pctY - bgH / 2;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(bgX + r, bgY);
    ctx.arcTo(bgX + bgW, bgY, bgX + bgW, bgY + bgH, r);
    ctx.arcTo(bgX + bgW, bgY + bgH, bgX, bgY + bgH, r);
    ctx.arcTo(bgX, bgY + bgH, bgX, bgY, r);
    ctx.arcTo(bgX, bgY, bgX + bgW, bgY, r);
    ctx.closePath();
    const rgbaMatch = /rgba?\((\s*\d+\s*),(\s*\d+\s*),(\s*\d+\s*)(?:,(\s*\d*\.?\d+\s*))?\)/.exec(strokeColor);
    const pillFill = rgbaMatch ? `rgba(${rgbaMatch[1]},${rgbaMatch[2]},${rgbaMatch[3]},0.18)` : 'rgba(0,0,0,0.28)';
    const pillStroke = rgbaMatch ? `rgba(${rgbaMatch[1]},${rgbaMatch[2]},${rgbaMatch[3]},0.35)` : 'rgba(255,255,255,0.08)';
    ctx.fillStyle = pillFill;
    ctx.fill();
    ctx.strokeStyle = pillStroke;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    ctx.fillText(label, pctX, pctY);

    // X-Labels
    if (Array.isArray(xLabels) && xLabels.length === 2) {
      ctx.fillStyle = 'rgba(148,163,184,0.75)';
      ctx.font = '10.5px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const x0 = padX + 24; // links am Axisbereich
      const x1 = endX;      // rechts am Linienende
      const yAxisLabels = height - padBottom + 12;
      ctx.fillText(xLabels[0], x0, yAxisLabels);
      ctx.fillText(xLabels[1], x1, yAxisLabels);
    }
  };

  const renderOnce = React.useCallback(() => {
    const canvas = canvasRef.current; const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.max(1, Math.floor((typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1));
    const rect = wrapper.getBoundingClientRect();
    const cssW = Math.max(1, Math.floor(rect.width));
    const cssH = Math.max(1, Math.floor(rect.height));

    canvas.width = Math.max(1, Math.floor(cssW * dpr));
    canvas.height = Math.max(1, Math.floor(cssH * dpr));
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    const model = buildModel(ctx, cssW, cssH);

    const start = performance.now();
    const step = (ts: number) => {
      const raw = Math.min(1, Math.max(0, (ts - start) / 980));
      const eased = 0.5 * (1 - Math.cos(Math.PI * raw));
      draw(ctx, dpr, model, eased, xLabels);
      if (raw < 1 && (inView || typeof document === 'undefined')) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percent, color, JSON.stringify(xLabels), inView]);

  React.useEffect(() => {
    if (!inView && typeof document !== 'undefined') return; // Zeichne nur wenn sichtbar (oder SSR)
    renderOnce();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [inView, renderOnce]);

  React.useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    try {
      const obs = new ResizeObserver(() => {
        // bei jeder Größenänderung neu zeichnen (debounced via RAF im renderOnce)
        renderOnce();
      });
      obs.observe(el);
      resizeObsRef.current = obs;
      return () => { try { obs.disconnect(); } catch {} };
    } catch {
      // Fallback ohne ResizeObserver
      const handler = () => renderOnce();
      window.addEventListener('resize', handler);
      return () => window.removeEventListener('resize', handler);
    }
  }, [renderOnce]);

  return (
    <div ref={wrapperRef} className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" role="img" aria-label={ariaLabel} />
    </div>
  );
};

export default SparklineCanvas;
