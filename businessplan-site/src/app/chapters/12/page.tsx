import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { chapters } from '../chapters.config';
import { getMessages } from '@/i18n/messages';
import WorkPackagesDetailedChapter from '@/app/components/chapters/sections/chapter/WorkPackagesDetailedChapter';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const index = Math.max(0, chapters.findIndex((c) => c.slug === 'work-packages')) + 1;
  return { 
    robots: { index: false, follow: true }, 
    alternates: { canonical: `/${locale}/chapters/${index}` } 
  } as Metadata;
}

export default async function WorkPackagesPage() {
  const locale = await getLocale();
  const tBp = await getTranslations('bp');
  
  // Debug-Ausgabe, um die Kapitel zu überprüfen
  console.log('Geladene Kapitel:', chapters.map(c => ({ 
    id: c.id, 
    slug: c.slug, 
    title: c.title 
  })));
  
  const chapterId = 12; // Direkt auf 12 setzen, da es Kapitel 12 ist
  const chapter = chapters.find(c => c.id === chapterId);
  
  if (!chapter) {
    console.error('Kapitel 12 nicht in der Konfiguration gefunden');
    return <div className="p-4 text-red-600">Fehler: Kapitel nicht gefunden</div>;
  }
  
  console.log('Gefundenes Kapitel 12:', chapter);
  
  // i18n-Nachrichten laden
  const messages = await getMessages(locale.startsWith('de') ? 'de' : 'en');
  
  // Debug-Ausgabe für die gesamte Nachrichtenstruktur
  console.log('Geladene Nachrichtenstruktur:', {
    topLevelKeys: Object.keys(messages),
    hasBp: 'bp' in messages,
    hasContent: 'content' in messages,
    bpKeys: messages.bp ? Object.keys(messages.bp) : [],
    contentKeys: messages.content ? Object.keys(messages.content) : []
  });
  
  const { bp } = messages;
  
  // Debug-Ausgabe, um die Daten zu überprüfen
  console.log('Verfügbare i18n-Schlüssel:', Object.keys(messages?.content || {}));
  
  const wpd = (messages?.content?.workPackagesDetailed ?? messages?.bp?.workPackagesDetailed) as {
    title?: string;
    note?: string;
    headersEffort?: (string | number)[];
    items?: Array<{
      id: string; 
      name: string; 
      timeframe?: string; 
      objectives?: string[]; 
      scope?: string[];
      deliverables?: string[]; 
      dependencies?: string[]; 
      effort?: Array<{ role: string; fte: number }>;
      personMonths?: Array<{ role: string; pm: number }>;
      trl?: { start: number; target: number };
      budgetJustification?: { 
        personnel?: string; 
        material?: string; 
        subcontracting?: string; 
        other?: string 
      };
      risks?: string[]; 
      mitigations?: string[]; 
      kpis?: string[];
      milestones?: Array<{ label: string; month: number; acceptance?: string }>;
      budget?: { 
        personnel?: number; 
        material?: number; 
        subcontracting?: number; 
        other?: number 
      };
    }>;
  } | undefined;

  // Sicherstellen, dass die ID ein String ist
  const chapterIdString = chapter.id.toString();
  
  // Debug-Ausgabe für die Arbeitspakete
  if (!wpd) {
    console.error('Keine Work-Packages-Daten gefunden in:', {
      contentKeys: Object.keys(messages?.content || {}),
      bpKeys: Object.keys(messages?.bp || {})
    });
    return (
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
        <h1 className="text-xl font-bold mb-2">{chapter.title}</h1>
        <p className="text-yellow-700">
          Die Arbeitspakete konnten nicht geladen werden. Bitte überprüfen Sie die Konsolenausgaben für weitere Details.
        </p>
      </div>
    );
  }
  
  if (!wpd.items || wpd.items.length === 0) {
    console.error('Keine Arbeitspakete in den i18n-Nachrichten gefunden');
    return (
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
        <h1 className="text-xl font-bold mb-2">{chapter.title}</h1>
        <p className="text-yellow-700">
          Keine Arbeitspakete gefunden. Bitte überprüfen Sie die i18n-Konfiguration.
        </p>
      </div>
    );
  }
  
  console.log(`Geladene Arbeitspakete: ${wpd.items.length}`);
  
  // Ensure note is either a string or undefined to match the component's prop types
  const note = typeof wpd.note === 'string' ? wpd.note : undefined;
  // Ensure headersEffort is either an array or undefined
  const headersEffort = Array.isArray(wpd.headersEffort) ? wpd.headersEffort : undefined;
  
  return (
    <WorkPackagesDetailedChapter
      id={chapterIdString}
      title={chapter.title}
      note={note}
      headersEffort={headersEffort}
      items={wpd.items}
    />
  );
}
