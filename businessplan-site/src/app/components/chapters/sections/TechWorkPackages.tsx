"use client";
import React from "react";
import { useTranslations } from "next-intl";
import TableSimple from "@ui/TableSimple";

export type WorkPackage = {
  id: string;
  name: string;
  timeline?: string; // e.g., "Q1–Q3 2026"
  deliverables?: string[];
};

interface TechWorkPackagesProps {
  title?: string;
  packages: WorkPackage[];
}

/**
 * Renders Technology Work Packages in a compact, printable table.
 * Edge cases handled:
 * - Empty list => renders nothing
 * - Missing deliverables => gracefully shows "-"
 */
export default function TechWorkPackages({ title, packages }: TechWorkPackagesProps) {
  const tBp = useTranslations('bp');
  if (!Array.isArray(packages) || packages.length === 0) return null;

  return (
    <div className="mt-6">
      {title ? <h3 className="font-semibold">{title}</h3> : null}
      <TableSimple
        headers={[
          tBp("tables.headers.workPackage", { defaultMessage: "WP" }) as string,
          tBp("tables.headers.name", { defaultMessage: "Name" }) as string,
          tBp("tables.headers.timeline", { defaultMessage: "Timeline" }) as string,
          tBp("tables.headers.deliverables", { defaultMessage: "Deliverables" }) as string,
        ]}
        rows={packages.map((wp) => [
          wp.id,
          wp.name,
          wp.timeline ?? "-",
          Array.isArray(wp.deliverables) && wp.deliverables.length > 0 ? wp.deliverables.join(", ") : "-",
        ])}
      />
    </div>
  );
}
