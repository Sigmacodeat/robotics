"use client";
import React from "react";

export type SectionHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SectionHeader({ children, className }: SectionHeaderProps) {
  return (
    <div className={"mt-3 md:mt-4 mb-2 " + (className ?? "")}>{children}</div>
  );
}
