# i18n Translation Checklist – TypeScript Locales

## Einführung
Diese Checkliste dient der systematischen Übersetzung der i18n-Locales auf TypeScript-Basis (keine JSON-Dateien mehr) von Deutsch nach Englisch.

## Fortschritt
- **Gesamtfortschritt**: 0%
- **Letztes Update**: 2025-09-06

## Prioritätsstufen
- 🔴 Hoch (UI-kritisch, Navigation)
- 🟡 Mittel (Inhaltsbereiche)
- 🔵 Niedrig (Meta-Informationen)

---

## 🔴 Hochprioritäre Abschnitte

### Navigation (`nav`)
| Key | Deutscher Text | Englische Übersetzung | Status |
|-----|----------------|------------------------|--------|
| businessplan | Businessplan | Business Plan | ✅ |
| downloadPdf | Als PDF herunterladen | Download as PDF | ✅ |
| language | Sprache | Language | ✅ |

### Kernkomponenten (`bp`)
| Key | Deutscher Text | Englische Übersetzung | Status |
|-----|----------------|------------------------|--------|
| sections.executive | Executive Summary | Executive Summary | ✅ |
| sections.company | Unternehmensbeschreibung | Company Description | ✅ |
| sections.problem | Problemstellung | Problem Statement | ✅ |

---

## 🟡 Mittelprioritäre Abschnitte

### Geschäftsmodell (`bp.businessModel`)
| Key | Deutscher Text | Englische Übersetzung | Status |
|-----|----------------|------------------------|--------|
| revenueStreams | Erlösströme | Revenue Streams | ✅ |
| pricing | Preismodelle | Pricing Models | ✅ |
| valueProposition | Wertversprechen | Value Proposition | ✅ |
| customerSegments | Zielgruppen | Customer Segments | ✅ |

### Technologie (`bp.technology`)
| Key | Deutscher Text | Englische Übersetzung | Status |
|-----|----------------|------------------------|--------|
| roadmap | Roadmap | Roadmap | ✅ |
| stack | Stack | Tech Stack | ✅ |
| infrastructure | Infrastruktur | Infrastructure | ✅ |

---

## 🔵 Niedrigprioritäre Abschnitte

### Anhang (`appendix`)
| Key | Deutscher Text | Englische Übersetzung | Status |
|-----|----------------|------------------------|--------|
| supporting | Supporting Documents | Supporting Documents | ✅ |
| technical | Technik | Technical Documentation | ✅ |

---

## Automatisierungshilfen
```bash
# TS-Locales validieren (Schemas & Typen):
npm run -C businessplan-site i18n:check

# Optional: i18n-Reports/Pruning
npm run -C businessplan-site i18n:report
npm run -C businessplan-site i18n:prune
```

## Qualitätssicherung
- [ ] Terminologiekonsistenz geprüft
- [ ] Unternehmensglossar verwendet
- [ ] Kulturbezogene Anpassungen

## Verantwortlichkeiten
| Bereich | Verantwortlicher | Frist |
|---------|------------------|-------|
| 🔴 Hoch | Marketing | 2025-09-20 |
| 🟡 Mittel | Produktmanagement | 2025-09-27 |
| 🔵 Niedrig | Technisches Team | 2025-10-04 |
