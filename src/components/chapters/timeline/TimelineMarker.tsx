"use client";
import React from 'react';
import type { TimelineCommonProps } from './types';

export default function TimelineMarker({ size = 'md' }: TimelineCommonProps) {
  const dot = size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-2.5 w-2.5' : 'h-3 w-3';
  const offset = size === 'sm' ? '-left-2' : size === 'md' ? '-left-[9px]' : '-left-[10px]';
  return (
    <>
      <span aria-hidden className={`absolute ${offset} top-3 ${dot} rounded-full bg-[--color-border] ring-1 ring-[--color-surface] shadow-sm`} />
    </>
  );
}
