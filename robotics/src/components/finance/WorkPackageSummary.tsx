import React from 'react';
import { WorkPackage } from '@/types/workPackage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

interface WorkPackageSummaryProps {
  workPackages: WorkPackage[];
}

export function WorkPackageSummary({ workPackages }: WorkPackageSummaryProps) {
  const totalBudget = workPackages.reduce((sum, wp) => {
    return sum + wp.budget.personnel + wp.budget.material + wp.budget.subcontracting + wp.budget.other;
  }, 0);

  const completedPackages = workPackages.filter(wp => wp.status === 'completed').length;
  const inProgressPackages = workPackages.filter(wp => wp.status === 'in-progress').length;
  const delayedPackages = workPackages.filter(wp => wp.status === 'delayed').length;
  const plannedPackages = workPackages.filter(wp => wp.status === 'planned').length;

  const totalDuration = Math.max(...workPackages.map(wp => wp.startMonth + wp.duration), 0);
  const currentMonth = 2; // Example: current month in the project timeline
  
  const progressPercentage = Math.min(
    Math.round((currentMonth / totalDuration) * 100),
    100
  );

  const stats = [
    { 
      title: 'Gesamtbudget', 
      value: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(totalBudget),
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      description: 'Gesamtes Projektbudget'
    },
    { 
      title: 'Fertiggestellt', 
      value: completedPackages,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      description: 'Abgeschlossene Arbeitspakete'
    },
    { 
      title: 'In Bearbeitung', 
      value: inProgressPackages,
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      description: 'Laufende Arbeitspakete'
    },
    { 
      title: 'Verzögert', 
      value: delayedPackages,
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      description: 'Verzögerte Arbeitspakete'
    },
    { 
      title: 'Geplant', 
      value: plannedPackages,
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      description: 'Noch zu beginnende Pakete'
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className="text-muted-foreground">
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
      
      <Card className="md:col-span-2 lg:col-span-5">
        <CardHeader>
          <CardTitle>Projektfortschritt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Fortschritt</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-xs text-muted-foreground">
              Monat {currentMonth} von {totalDuration} (geplant)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
