import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import CountUp from '@/components/charts/CountUp';
import { useTranslations } from 'next-intl';
import { z } from 'zod'; 
import { useEffect, useState } from 'react';
import ErrorMessage from '@/components/ui/error-message'; 
import { Skeleton } from '@/components/ui/skeleton'; 
import { defaultTransition } from '@/components/animation/variants';

const KPIItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  value: z.number(),
  description: z.string().optional(),
});

type KPIItem = z.infer<typeof KPIItemSchema>;

interface KPISectionProps {
  data: unknown; 
  layout?: 'grid' | 'list';
  title?: string;
  description?: string;
}

export function KPISection({ data, layout = 'grid', title, description }: KPISectionProps) {
  const t = useTranslations('KPISection');
  const [validatedData, setValidatedData] = useState<KPIItem[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const result = KPIItemSchema.array().parse(data);
      setValidatedData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Invalid data format'));
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className={layout === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
        : 'space-y-4'
      }>
        {[1, 2, 3].map((id) => (
          <Card key={id} className="kpi-card kpi-card--hairline">
            <CardHeader className="kpi-card-header">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="kpi-card-content">
              <Skeleton className="h-8 w-full mt-2" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={t('dataError')} />;
  }

  if (validatedData.length === 0) {
    return <p className="text-center py-8 text-muted-foreground">{t('noData')}</p>;
  }

  return (
    <section className="py-8">
      {title && <h2 className="mb-4">{title}</h2>}
      {description && <p className="text-muted-foreground mb-6">{description}</p>}
      
      <div className={layout === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
        : 'space-y-4'
      }>
        {validatedData.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...defaultTransition }}
          >
            <Card aria-label={`${t(item.title, { default: item.title })}: ${item.value}`} className="kpi-card kpi-card--hairline">
              <CardHeader className="kpi-card-header">
                <CardTitle className="not-prose block w-full leading-tight font-medium text-[--color-foreground-muted] tracking-tight whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: 'clamp(10px, 0.9vw, 15px)' }}>
                  {t(item.title, { default: item.title })}
                </CardTitle>
              </CardHeader>
              <CardContent className="kpi-card-content">
                <div className="kpi-value-row font-bold my-1">
                  <CountUp
                    to={item.value}
                    durationMs={2500}
                    className="text-gradient"
                  />
                </div>
                {item.description && (
                  <p className="kpi-sub text-center">{t(item.description, { default: item.description })}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
