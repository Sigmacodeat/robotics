import React from 'react';
import { WorkPackage } from '@/types/workPackage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type WorkPackageTableProps = {
  workPackages: WorkPackage[];
  onEdit?: (wp: WorkPackage) => void;
};

const statusColors = {
  planned: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  delayed: 'bg-red-100 text-red-800',
} as const;

const statusLabels = {
  planned: 'Geplant',
  'in-progress': 'In Bearbeitung',
  completed: 'Abgeschlossen',
  delayed: 'Verzögert',
} as const;

export function WorkPackageTable({ workPackages, onEdit }: WorkPackageTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTotalBudget = (wp: WorkPackage) => {
    return wp.budget.personnel + wp.budget.material + wp.budget.subcontracting + wp.budget.other;
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Arbeitspakete</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Bezeichnung</TableHead>
              <TableHead>Verantwortlich</TableHead>
              <TableHead>Zeitraum</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Budget</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workPackages.map((wp) => (
              <TableRow 
                key={wp.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onEdit?.(wp)}
              >
                <TableCell className="font-medium">{wp.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{wp.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-2">{wp.description}</div>
                </TableCell>
                <TableCell>{wp.responsible}</TableCell>
                <TableCell>
                  Monat {wp.startMonth + 1} - {wp.startMonth + wp.duration}
                </TableCell>
                <TableCell>
                  <Badge className={`${statusColors[wp.status]}`}>
                    {statusLabels[wp.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(getTotalBudget(wp))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end">
          <div className="text-lg font-semibold">
            Gesamtbudget: {formatCurrency(
              workPackages.reduce((sum, wp) => sum + getTotalBudget(wp), 0)
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
