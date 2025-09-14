'use client';

import { useState } from 'react';
import { WorkPackage, workPackages as initialWorkPackages } from '@/types/workPackage';
import { WorkPackageTable } from '@/components/finance/WorkPackageTable';
import { GanttChart } from '@/components/finance/GanttChart';
import { WorkPackageSummary } from '@/components/finance/WorkPackageSummary';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WorkPackagesPage() {
  const [workPackages, setWorkPackages] = useState<WorkPackage[]>(initialWorkPackages);
  const [selectedWorkPackage, setSelectedWorkPackage] = useState<WorkPackage | null>(null);

  const handleEdit = (wp: WorkPackage) => {
    setSelectedWorkPackage(wp);
    // In a real app, you would open a modal or navigate to an edit page
    console.log('Edit work package:', wp);
  };

  const handleAddWorkPackage = () => {
    // In a real app, you would open a form to add a new work package
    console.log('Add new work package');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Arbeitspakete & Zeitplan</h1>
        <Button onClick={handleAddWorkPackage}>
          <Plus className="mr-2 h-4 w-4" />
          Neues Arbeitspaket
        </Button>
      </div>

      <WorkPackageSummary workPackages={workPackages} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Arbeitspakete</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkPackageTable 
              workPackages={workPackages} 
              onEdit={handleEdit} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zeitplan (Gantt-Diagramm)</CardTitle>
          </CardHeader>
          <CardContent>
            <GanttChart workPackages={workPackages} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budgetübersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium">Personalkosten</div>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
                  .format(workPackages.reduce((sum, wp) => sum + wp.budget.personnel, 0))}
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round((workPackages.reduce((sum, wp) => sum + wp.budget.personnel, 0) / 
                  workPackages.reduce((sum, wp) => sum + wp.budget.personnel + wp.budget.material + wp.budget.subcontracting + wp.budget.other, 0)) * 100)}% des Gesamtbudgets
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium">Sachkosten</div>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
                  .format(workPackages.reduce((sum, wp) => sum + wp.budget.material, 0))}
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium">Fremdleistungen</div>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
                  .format(workPackages.reduce((sum, wp) => sum + wp.budget.subcontracting, 0))}
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium">Sonstige Kosten</div>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
                  .format(workPackages.reduce((sum, wp) => sum + wp.budget.other, 0))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
