import { Variants } from 'framer-motion';

export const defaultTransition = { duration: 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };
// amount sorgt für stabilere Trigger, margin lässt Effekte etwas früher starten
export const defaultViewport = { once: true, amount: 0.2, margin: '-80px' } as const;
// Lux-Viewport: frühere, zuverlässige Triggerpunkte für Section-Inhalte
export const viewportLux = { once: true, amount: 0.2, margin: '0px' } as const;

export const variantsMap: Record<string, Variants> = {
  fadeInUpShort: {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  // Section/UL orchestriert die Kinder mit Stagger
  containerStagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.12,
      },
    },
  },
  // Einzelnes List-Item/Card Eintritt
  itemEnter: {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  },
  // Kräftigerer, aber noch subtiler Karten-Einflug (für das gesamte List-Item)
  cardEnter: {
    hidden: { opacity: 0, y: 28, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  // Bullets innerhalb einer Card
  bulletEnter: {
    hidden: { opacity: 0, y: 4 },
    visible: { opacity: 1, y: 0 },
  },
  // Textbereich von der Seite einfliegen lassen
  textSlideInLeft: {
    hidden: { opacity: 0, x: -72 },
    visible: { opacity: 1, x: 0 },
  },
  textSlideInRight: {
    hidden: { opacity: 0, x: 72 },
    visible: { opacity: 1, x: 0 },
  },
  // Aside (Statistik) aus dem Hintergrund "poppen"
  asidePop: {
    hidden: { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
    visible: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  },
};
