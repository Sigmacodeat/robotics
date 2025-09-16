"use client";

import React from "react";
import AnimatedBulletList from "@components/chapters/shared/AnimatedBulletList";
import type { ReactNode } from "react";

type Props = {
  itemsService: ReactNode[];
  itemsHumanoid: ReactNode[];
  drivers?: ReactNode;
  className?: string;
};

export default function MarketToggle({ itemsService, itemsHumanoid, drivers, className }: Props) {
  const list = React.useMemo(() => {
    const s = Array.isArray(itemsService) ? itemsService.filter(Boolean) : [];
    const h = Array.isArray(itemsHumanoid) ? itemsHumanoid.filter(Boolean) : [];
    const d = drivers ? [drivers] : [];
    // Immer beide anzeigen (Service + Humanoid) und optional Drivers anhängen
    return [...s, ...h, ...d];
  }, [itemsService, itemsHumanoid, drivers]);

  return (
    <div className={className}>
      {/* Toggle-Buttons entfernt – immer kombinierte Liste anzeigen */}
      <AnimatedBulletList items={list} />
    </div>
  );
}
