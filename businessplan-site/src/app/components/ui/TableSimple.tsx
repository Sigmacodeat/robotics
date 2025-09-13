import * as React from "react";

export interface TableSimpleProps {
  caption?: string;
  headers: Array<string | number>;
  rows: Array<Array<React.ReactNode>>;
  className?: string;
}

export default function TableSimple({ caption, headers, rows, className = "" }: TableSimpleProps) {
  return (
    <div className={`overflow-x-auto rounded-xl ring-1 ring-[--color-border-subtle] bg-[--color-surface] ${className}`}>
      <table className="min-w-full text-sm">
        {caption ? (
          <caption className="text-left p-3 text-[--color-foreground-muted]">{caption}</caption>
        ) : null}
        <thead className="bg-[--color-surface-2]">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left font-semibold text-[--color-foreground-strong] border-b border-[--color-border-subtle]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="odd:bg-[--color-surface]/60">
              {r.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 align-top border-b border-[--color-border-subtle] text-[--color-foreground]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
