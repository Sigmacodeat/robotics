import React from 'react';
import { WorkPackage } from '@/types/workPackage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GanttChartProps {
  workPackages: WorkPackage[];
  totalMonths?: number;
  className?: string;
}

export function GanttChart({ workPackages, totalMonths = 18, className = '' }: GanttChartProps) {
  // Calculate the maximum month needed if not provided
  const maxMonth = Math.max(
    ...workPackages.map(wp => wp.startMonth + wp.duration),
    totalMonths
  );

  const statusColors = {
    planned: 'bg-blue-200',
    'in-progress': 'bg-yellow-300',
    completed: 'bg-green-300',
    delayed: 'bg-red-300',
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Projektzeitplan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Month Header */}
            <div className="flex border-b border-gray-200">
              <div className="w-48 flex-shrink-0 border-r border-gray-200 p-2 font-medium">
                Arbeitspaket
              </div>
              <div className="flex flex-1">
                {Array.from({ length: maxMonth }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-16 flex-shrink-0 border-r border-gray-200 p-1 text-center text-xs"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Gantt Bars */}
            <div className="divide-y divide-gray-200">
              {workPackages.map((wp) => (
                <div key={wp.id} className="flex h-12 items-center">
                  <div className="w-48 flex-shrink-0 border-r border-gray-200 p-2 text-sm">
                    <div className="font-medium">{wp.id}</div>
                    <div className="text-xs text-gray-500 truncate">{wp.title}</div>
                  </div>
                  <div className="relative flex-1 h-full">
                    <div className="relative h-full">
                      {/* Background grid */}
                      <div className="absolute inset-0 flex">
                        {Array.from({ length: maxMonth }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-full w-16 flex-shrink-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                          />
                        ))}
                      </div>
                      
                      {/* Gantt bar */}
                      <div 
                        className={`absolute h-6 top-1/2 -translate-y-1/2 rounded ${statusColors[wp.status]}`}
                        style={{
                          left: `${(wp.startMonth / maxMonth) * 100}%`,
                          width: `${(wp.duration / maxMonth) * 100}%`,
                          minWidth: '8px', // Ensure very short tasks are still visible
                        }}
                        title={`${wp.title} (Monat ${wp.startMonth + 1}-${wp.startMonth + wp.duration})`}
                      >
                        <div className="absolute inset-0 flex items-center px-2 text-xs font-medium text-gray-900 truncate">
                          {wp.id}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-blue-200 mr-1"></div>
                <span>Geplant</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-yellow-300 mr-1"></div>
                <span>In Bearbeitung</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-green-300 mr-1"></div>
                <span>Abgeschlossen</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-red-300 mr-1"></div>
                <span>Verzögert</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
