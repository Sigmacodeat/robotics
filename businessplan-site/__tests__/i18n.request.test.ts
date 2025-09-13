import {readFileSync} from 'node:fs';
import {join} from 'node:path';

describe('i18n: request config + middleware alignment (regex-based to avoid ESM imports)', () => {
  test('src/i18n/request.ts deklariert defaultLocale=de und localePrefix=as-needed', () => {
    const reqPath = join(process.cwd(), 'src', 'i18n', 'request.ts');
    const src = readFileSync(reqPath, 'utf8');
    expect(src).toMatch(/export const defaultLocale:\s*Locale\s*=\s*'de'/);
    expect(src).toMatch(/export const localePrefix\s*=\s*'as-needed'/);
  });

  test('next-intl.config.ts deklariert defaultLocale=de und localePrefix=as-needed', () => {
    const cfgPath = join(process.cwd(), 'next-intl.config.ts');
    const src = readFileSync(cfgPath, 'utf8');
    expect(src).toMatch(/defaultLocale:\s*'de'/);
    expect(src).toMatch(/localePrefix:\s*'as-needed'/);
  });

  test('middleware.ts verwendet localePrefix = as-needed', () => {
    const mwPath = join(process.cwd(), 'middleware.ts');
    const src = readFileSync(mwPath, 'utf8');
    expect(src).toMatch(/localePrefix:\s*'as-needed'/);
  });
});
