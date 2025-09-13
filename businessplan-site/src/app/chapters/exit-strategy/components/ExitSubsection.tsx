import { getTranslations } from "next-intl/server";

interface Props {
  id: string;
  labelKey: string;
  level: 2 | 3;
}

export default async function ExitSubsection({ id, labelKey, level }: Props) {
  const t = await getTranslations("bp");
  
  // Dynamische Inhaltszuordnung basierend auf Subsection-ID
  let content;
  switch (id) {
    case "exit-options":
      const points = t.raw("content.exit.options.a.points") as string[] | undefined;
      content = (
        <div>
          <h3>{t("content.exit.options.a.title")}</h3>
          {points && (
            <ul>
              {points.map((point: string, i: number) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          )}
        </div>
      );
      break;
    case "exit-roi":
      content = <p>{t("content.exit.roi.text")}</p>;
      break;
    case "exit-valuation":
      const methods = t.raw("content.exit.valuation.methods") as string[] | undefined;
      content = (
        <div>
          <h4>{t("content.exit.valuation.title")}</h4>
          {methods && (
            <ul>
              {methods.map((method: string, i: number) => (
                <li key={i}>{method}</li>
              ))}
            </ul>
          )}
        </div>
      );
      break;
    default:
      content = <p>{t("emptyNotice")}</p>;
  }

  const HeadingTag = level === 2 ? 'h2' : 'h3';
  
  return (
    <div className="mb-8">
      <HeadingTag className="text-xl font-semibold mb-4">
        {t(labelKey)}
      </HeadingTag>
      {content}
    </div>
  );
}
