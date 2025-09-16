"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations, useMessages } from "next-intl";
import { z } from "zod";

// TypeScript Interfaces
interface SkillCategory {
  name: string;
  items: string[];
}

interface LanguageItem {
  name: string;
  level: string;
}

interface CVSkillsProps {
  skills?: SkillCategory[];
  languages?: LanguageItem[];
}

// Zod Schemas for validation
const SkillCategorySchema = z.object({
  name: z.string().min(1),
  items: z.array(z.string().min(1)),
});

const LanguageItemSchema = z.object({
  name: z.string().min(1),
  level: z.string().min(1),
});

const SkillCategoriesSchema = z.array(SkillCategorySchema);
const LanguagesSchema = z.array(LanguageItemSchema);

export default function CVSkills({ skills, languages }: CVSkillsProps) {
  const t = useTranslations("cv");
  const messages = useMessages();

  // Get skills from i18n if not provided via props
  const skillsFromI18n = React.useMemo(() => {
    const root = messages as Record<string, unknown> | undefined;
    if (!root || typeof root !== "object") return undefined;
    const cvRaw = "cv" in root ? (root["cv"] as unknown) : undefined;
    if (!cvRaw || typeof cvRaw !== "object") return undefined;
    const cvObj = cvRaw as Record<string, unknown>;
    const skillsRaw = "skills" in cvObj ? (cvObj["skills"] as unknown) : undefined;
    if (!skillsRaw || typeof skillsRaw !== "object") return undefined;
    const skillsObj = skillsRaw as Record<string, unknown>;
    return "categories" in skillsObj ? (skillsObj["categories"] as unknown) : undefined;
  }, [messages]);

  // Get languages from i18n if not provided via props
  const languagesFromI18n = React.useMemo(() => {
    const root = messages as Record<string, unknown> | undefined;
    if (!root || typeof root !== "object") return undefined;
    const cvRaw = "cv" in root ? (root["cv"] as unknown) : undefined;
    if (!cvRaw || typeof cvRaw !== "object") return undefined;
    const cvObj = cvRaw as Record<string, unknown>;
    return "languages" in cvObj ? (cvObj["languages"] as unknown) : undefined;
  }, [messages]);

  // Validate and use skills data
  const validatedSkills = React.useMemo(() => {
    if (skills && SkillCategoriesSchema.safeParse(skills).success) {
      return skills;
    }
    if (skillsFromI18n && SkillCategoriesSchema.safeParse(skillsFromI18n).success) {
      return skillsFromI18n as SkillCategory[];
    }
    return [];
  }, [skills, skillsFromI18n]);

  // Validate and use languages data
  const validatedLanguages = React.useMemo(() => {
    if (languages && LanguagesSchema.safeParse(languages).success) {
      return languages;
    }
    if (languagesFromI18n && LanguagesSchema.safeParse(languagesFromI18n).success) {
      const langObj = languagesFromI18n as Record<string, unknown>;
      return "items" in langObj ? (langObj["items"] as LanguageItem[]) : [];
    }
    return [];
  }, [languages, languagesFromI18n]);

  const hasContent = validatedSkills.length > 0 || validatedLanguages.length > 0;

  if (!hasContent) {
    return null;
  }

  return (
    <div className="space-y-12">
      {/* Skills Section */}
      {validatedSkills.length > 0 && (
        <section className="space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-semibold tracking-tight text-[--color-foreground-strong]"
          >
            {t("skills.title", { default: "Kenntnisse & Fähigkeiten" })}
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {validatedSkills.map((category, categoryIndex) => (
              <motion.div
                key={`${category.name}-${categoryIndex}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="group"
              >
                <div className="h-full bg-[--color-surface]/30 backdrop-blur-sm rounded-2xl border border-[--color-border-subtle]/20 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[--color-border-subtle]/40">
                  <h3 className="text-lg md:text-xl font-semibold text-[--color-foreground-strong] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[--color-primary] to-[--color-primary-dark] opacity-80 group-hover:opacity-100 transition-opacity" />
                    {category.name}
                  </h3>
                  <ul className="space-y-2.5">
                    {category.items.map((item, itemIndex) => (
                      <motion.li
                        key={`${item}-${itemIndex}`}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, delay: (categoryIndex * 0.1) + (itemIndex * 0.05) }}
                        className="flex items-start gap-2.5"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[--color-border-subtle] flex-shrink-0" />
                        <span className="text-[--color-foreground] text-sm md:text-base leading-relaxed">
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Languages Section */}
      {validatedLanguages.length > 0 && (
        <section className="space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl md:text-3xl font-semibold tracking-tight text-[--color-foreground-strong]"
          >
            {t("languages.title", { default: "Sprachen" })}
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {validatedLanguages.map((language, index) => (
              <motion.div
                key={`${language.name}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                className="group"
              >
                <div className="h-full bg-gradient-to-br from-[--color-surface]/20 to-[--color-surface]/30 backdrop-blur-sm rounded-xl border border-[--color-border-subtle]/20 p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[--color-border-subtle]/40">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[--color-foreground-strong] text-base md:text-lg">
                      {language.name}
                    </span>
                    <span className="text-sm text-[--color-foreground-muted] bg-[--color-surface]/60 px-2.5 py-1 rounded-full">
                      {language.level}
                    </span>
                  </div>
                  {/* Visual proficiency indicator */}
                  <div className="mt-3 h-1.5 bg-[--color-border-subtle]/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: language.level === 'Muttersprache' || language.level === 'Native' ? '100%' : '85%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 + (index * 0.1) }}
                      className="h-full bg-gradient-to-r from-[--color-primary] to-[--color-primary-dark] rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
