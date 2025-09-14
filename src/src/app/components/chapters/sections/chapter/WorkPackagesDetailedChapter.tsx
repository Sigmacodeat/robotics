"use client";
import Chapter from "./Chapter";
import TableSimple from "@ui/TableSimple";

type EffortRow = { role: string; fte: number };

type WPItem = {
  id: string;
  name: string;
  timeframe?: string;
  objectives?: string[];
  scope?: string[];
  deliverables?: string[];
  dependencies?: string[];
  effort?: EffortRow[];
  personMonths?: Array<{ role: string; pm: number }>;
  trl?: { start: number; target: number };
  budgetJustification?: { personnel?: string; material?: string; subcontracting?: string; other?: string };
  risks?: string[];
  mitigations?: string[];
  kpis?: string[];
  milestones?: Array<{ label: string; month: number; acceptance?: string }>;
  budget?: { personnel?: number; material?: number; subcontracting?: number; other?: number };
};

export default function WorkPackagesDetailedChapter({
  id,
  title,
  note,
  headersEffort,
  items,
}: {
  id: string;
  title: string;
  note: string | undefined;
  headersEffort: (string | number)[] | undefined;
  items: WPItem[];
}) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const fmtK = (v?: number) => (typeof v === "number" ? `${v.toFixed(0)}k` : v === 0 ? "0" : "-");

  return (
    <Chapter id={id} title={title} pageBreakBefore avoidBreakInside variant="fadeIn" headingVariant="fadeInUp" contentVariant="fadeInUp">
      {typeof note === 'string' && note ? (
        <p className="text-sm text-[--color-foreground-muted] mb-3">{note}</p>
      ) : null}
      <div className="space-y-6">
        {items.map((wp) => (
          <section
            key={wp.id}
            className="rounded-xl p-4 avoid-break-inside bg-[--color-surface]"
            style={{
              border: '1px solid transparent',
              background:
                'linear-gradient(var(--color-surface), var(--color-surface)) padding-box, var(--gradient-underline) border-box',
              backgroundClip: 'padding-box, border-box',
              WebkitBackgroundClip: 'padding-box, border-box',
            }}
          >
            <h3 className="m-0 text-base font-semibold">
              {wp.id} – {wp.name}
            </h3>
            {wp.timeframe && (
              <div className="text-xs text-[--color-foreground-muted] mt-0.5">{wp.timeframe}</div>
            )}

            {/* Ziele & Scope */}
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {Array.isArray(wp.objectives) && wp.objectives.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-1">Ziele</div>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {wp.objectives.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
              {Array.isArray(wp.scope) && wp.scope.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-1">Scope</div>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {wp.scope.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Deliverables & Dependencies */}
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {Array.isArray(wp.deliverables) && wp.deliverables.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-1">Deliverables</div>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {wp.deliverables.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
              {Array.isArray(wp.dependencies) && wp.dependencies.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-1">Abhängigkeiten</div>
                  <div className="text-sm">{wp.dependencies.join(", ")}</div>
                </div>
              )}
            </div>

            {/* Effort (FTE) */}
            {Array.isArray(wp.effort) && wp.effort.length > 0 && (
              <div className="mt-3">
                <TableSimple
                  headers={(headersEffort ?? ["WP", "Rolle", "FTE"]) as (string | number | null)[]}
                  rows={wp.effort.map((e) => [wp.id, e.role, e.fte])}
                  animateRows
                  rowVariant="fadeInUp"
                  stagger={0.04}
                />
              </div>
            )}

            {/* Personmonate (PM) */}
            {Array.isArray(wp.personMonths) && wp.personMonths.length > 0 && (
              <div className="mt-3">
                <TableSimple
                  headers={["WP", "Rolle", "PM"]}
                  rows={wp.personMonths.map((e) => [wp.id, e.role, e.pm])}
                  animateRows
                  rowVariant="fadeInUp"
                  stagger={0.04}
                />
              </div>
            )}

            {/* TRL Start/Ziel */}
            {wp.trl && typeof wp.trl.start === 'number' && typeof wp.trl.target === 'number' ? (
              <div className="mt-3 text-sm text-[--color-foreground-muted]">
                <span className="font-medium text-[--color-foreground]">TRL:</span>{' '}
                {`Start TRL ${wp.trl.start} → Ziel TRL ${wp.trl.target}`}
              </div>
            ) : null}

            {/* Risiken & Mitigation */}
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {Array.isArray(wp.risks) && wp.risks.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-1">Risiken</div>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {wp.risks.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
              {Array.isArray(wp.mitigations) && wp.mitigations.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-1">Mitigation</div>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {wp.mitigations.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* KPIs & Milestones */}
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {Array.isArray(wp.kpis) && wp.kpis.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-1">KPIs</div>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {wp.kpis.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
              {Array.isArray(wp.milestones) && wp.milestones.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-1">Milestones</div>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {wp.milestones.map((m, i) => (
                      <li key={i}>{m.label} – M{m.month}{m.acceptance ? ` (${m.acceptance})` : ''}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Budget */}
            {wp.budget && (
              <div className="mt-3 text-sm text-[--color-foreground-muted]">
                <span className="font-medium text-[--color-foreground]">Budget: </span>
                {`Personal ${fmtK(wp.budget.personnel)} | Sachkosten ${fmtK(wp.budget.material)} | Fremdleistungen ${fmtK(wp.budget.subcontracting)} | Sonstiges ${fmtK(wp.budget.other)}`}
              </div>
            )}

            {/* Budget-Begründung */}
            {wp.budgetJustification && (
              <div className="mt-2 grid gap-3 md:grid-cols-2 text-sm">
                {wp.budgetJustification.personnel ? (
                  <div>
                    <div className="font-medium">Begründung Personal</div>
                    <p className="mt-0.5 text-[--color-foreground-muted]">{wp.budgetJustification.personnel}</p>
                  </div>
                ) : null}
                {wp.budgetJustification.material ? (
                  <div>
                    <div className="font-medium">Begründung Sachkosten</div>
                    <p className="mt-0.5 text-[--color-foreground-muted]">{wp.budgetJustification.material}</p>
                  </div>
                ) : null}
                {wp.budgetJustification.subcontracting ? (
                  <div>
                    <div className="font-medium">Begründung Fremdleistungen</div>
                    <p className="mt-0.5 text-[--color-foreground-muted]">{wp.budgetJustification.subcontracting}</p>
                  </div>
                ) : null}
                {wp.budgetJustification.other ? (
                  <div>
                    <div className="font-medium">Begründung Sonstiges</div>
                    <p className="mt-0.5 text-[--color-foreground-muted]">{wp.budgetJustification.other}</p>
                  </div>
                ) : null}
              </div>
            )}
          </section>
        ))}
      </div>
    </Chapter>
  );
}
