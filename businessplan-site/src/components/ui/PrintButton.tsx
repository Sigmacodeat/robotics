"use client";

import React, { useRef } from "react";
import { Printer } from "lucide-react";
import { motion } from "framer-motion";
import { useReactToPrint } from 'react-to-print';
import CoverPage from '@/components/document/CoverPage';

export type PrintButtonProps = {
  label?: string;
  className?: string;
  content?: () => HTMLElement | null;
  /** Optional: CSS-Selector zu einem externen Container, der gedruckt werden soll */
  contentSelector?: string;
  children?: React.ReactNode;
  /** Optional: Interner Inhalt (Cover + Inhalte). Wird nur gerendert, wenn kein contentSelector gesetzt ist. */
  businessPlanContent?: React.ReactNode;
};

export default function PrintButton({ 
  label = "Drucken / Export", 
  className, 
  content, 
  contentSelector,
  children,
  businessPlanContent 
}: PrintButtonProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const resolveNode = () => {
    if (typeof document !== 'undefined' && contentSelector) {
      return document.querySelector(contentSelector) as HTMLElement | null;
    }
    return contentRef.current;
  };

  const handlePrint = useReactToPrint({
    content: content ?? resolveNode,
    documentTitle: 'Businessplan',
    pageStyle: `@page { size: A4; margin: 1cm; }`,
  } as any);
  
  // Use react-to-print to ensure the hidden container (Cover + full content) is printed
  const handleWindowPrint = handlePrint;

  return (
    <>
      {!contentSelector && (
        <div ref={contentRef} className="hidden" data-testid="print-source">
          <CoverPage />
          {businessPlanContent}
        </div>
      )}
      <motion.button
        type="button"
        onClick={handleWindowPrint}
        className={
          "print:hidden inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm bg-[--color-surface] text-[--color-foreground] ring-1 ring-black/5 hover:bg-[--color-surface-2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-background] " +
          (className ?? "")
        }
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        aria-label={label}
        data-testid="print-button"
      >
        <Printer className="h-4 w-4" />
        <span>{children ?? label}</span>
      </motion.button>
      {/* Optional secondary action retained only if you want a distinct label for PDF export */}
      {/* <Button onClick={handlePrint}>Als PDF exportieren</Button> */}
    </>
  );
}
