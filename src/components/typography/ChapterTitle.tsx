import React from "react";

export default function ChapterTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-emerald-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-cyan-400 dark:to-sky-500">
      {children}
    </h1>
  );
}
